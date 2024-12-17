import { Builder, parseStringPromise } from "xml2js";
import { FPC, ParsedXml, VersionBlock, XmlFileServiceData } from "../types";
import { XmlFileMetaData, UpdatePayload, ErrorCodes } from "@scania-coder/types";
import { BadRequestError, CustomError } from "../errors";
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
        `New MajorVersion (${newMajorVersion}) should be bigger than 0.` as ErrorCodes,
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

    let updatedXml: string = builder.buildObject(parsedXml);
    updatedXml = updatedXml.replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />');

    return {
      updatedXml,
      updatedFields,
      errors,
    };
  }

  static async extractMetaData(xmlData: string): Promise<XmlFileMetaData> {
    try {
      const parsedXml: ParsedXml = await parseStringPromise(xmlData);

      if (!parsedXml?.Sops?.Data?.[0]?.VersionBlock?.[0]) {
        throw new CustomError(
          "The provided XML does not match the expected structure.",
          400,
          "ERR_INVALID_FILE_STRUCTURE"
        );
      }

      const versionBlock = parsedXml.Sops.Data[0].VersionBlock[0];

      if (
        !versionBlock.$?.Version ||
        !versionBlock.Version?.[0]?.$?.MajorVersion ||
        !versionBlock.Version?.[0]?.$?.MinorVersion ||
        !versionBlock.Version?.[0]?.$?.Date
      ) {
        throw new CustomError(
          "One or more required attributes are missing in the XML data.",
          400,
          "ERR_MISSING_ATTRIBUTES",
        );
      }

      const data: XmlFileMetaData = {
        blockVersion: versionBlock.$.Version,
        majorVersion: versionBlock.Version[0].$.MajorVersion,
        minorVersion: versionBlock.Version[0].$.MinorVersion,
        date: versionBlock.Version[0].$.Date,
      };

      return data;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }

      throw new CustomError(
        "Failed to parse the XML data. Ensure the input is valid XML.",
        500,
        "ERR_XML_PARSE_ERROR",
      );
    }
  }
}
