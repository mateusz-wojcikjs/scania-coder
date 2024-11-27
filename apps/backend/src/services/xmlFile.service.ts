import { Builder, parseStringPromise } from "xml2js";
import { FPC, ParsedXml, VersionBlock, XmlFileServiceData } from "../types";
import { XmlFileMetaData, UpdatePayload } from "@scania-coder/types";
import { BadRequestError } from "../errors";
import { findInsertionIndex } from "../utils";

export class XmlFileService {
  static async editXmlFile(
    xmlData: string,
    updates: UpdatePayload[],
    newMajorVersion: string,
  ): Promise<XmlFileServiceData> {
    const parsedXml: ParsedXml = await parseStringPromise(xmlData);
    const records: FPC[] = parsedXml.Sops.Data[0].FpcBlock[0].FPC || [];
    const currentMajorVersion: number = Number(
      parsedXml.Sops.Data[0].VersionBlock[0].Version[0].$.MajorVersion,
    );

    const updatedFields: string[] = [];
    const errors: string[] = [];

    if (currentMajorVersion <= 0) {
      throw new BadRequestError(
        `New MajorVersion (${newMajorVersion}) should be bigger than 0.`,
      );
    }

    parsedXml.Sops.Data[0].VersionBlock[0].Version[0].$.MajorVersion = newMajorVersion;

    updates.forEach((update: UpdatePayload): void => {
      const recordIndex: number = records.findIndex(
        (r: FPC): boolean => r.$.Name === update.name,
      );

      if (recordIndex !== -1) {
        if (update.shouldBeRemoved) {
          console.log('remove');
          records.splice(recordIndex, 1);
        } else {
          records[recordIndex].$.Value = update.newValue;
          updatedFields.push(update.name);
        }
      } else {
        try {
          const newRecord: FPC = {
            $: {
              Name: update.name,
              Value: update.newValue,
              Updated: 'false',
            },
          };

          const insertIndex: number = findInsertionIndex(update.name, records);
          records.splice(insertIndex, 0, newRecord);
          updatedFields.push(update.name);
        } catch (error) {
          errors.push(`Failed to add or update field: ${update.name}`);
        }
      }
    });

    const builder: Builder = new Builder({
      xmldec: { version: '1.0', encoding: undefined, standalone: undefined },
    });

    let updatedXml = builder.buildObject(parsedXml);

    // Add space before the slash in self-closing tags
    updatedXml = updatedXml.replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />');

    return {
      updatedXml,
      updatedFields,
      errors,
    };
  }

    static async extractMetaData(xmlData: string): Promise<XmlFileMetaData> {
      const parsedXml: ParsedXml = await parseStringPromise(xmlData);
      const versionBlock: VersionBlock = parsedXml.Sops.Data[0].VersionBlock[0];

      const data: XmlFileMetaData = {
          blockVersion: versionBlock.$.Version,
          majorVersion: versionBlock.Version[0].$.MajorVersion,
          minorVersion: versionBlock.Version[0].$.MinorVersion,
          date: versionBlock.Version[0].$.Date
      };

      if (!data) {
          throw new Error("Data not found");
      }

      return { ...data };
    }
}
