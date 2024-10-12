import { Builder, parseStringPromise } from "xml2js";
import { FPC, ParsedXml, VersionBlock } from "../types";
import { XmlFileMetaData, UpdatePayload } from "@scania-coder/types";
import { BadRequestError } from "../errors";

export class XmlFileService {
    static async editXmlFile(
        xmlData: string,
        updates: UpdatePayload[],
        newMajorVersion: string,
    ): Promise<string> {
      const parsedXml: ParsedXml = await parseStringPromise(xmlData);
      const records: FPC[] = parsedXml.Sops.Data[0].FpcBlock[0].FPC || [];
      const currentMajorVersion: number = Number(parsedXml.Sops.Data[0].VersionBlock[0].Version[0].$.MajorVersion);

      if (currentMajorVersion >= Number(newMajorVersion)) {
        throw new BadRequestError(`New MajorVersion (${newMajorVersion}) should be bigger than current MajorVersion(${currentMajorVersion}).`);
      }

      parsedXml.Sops.Data[0].VersionBlock[0].Version[0].$.MajorVersion = newMajorVersion;
      updates.forEach((update: UpdatePayload): void => {
          const record: FPC | undefined = records.find((r: FPC): boolean => r.$.Name === update.name);

          if (record) {
              record.$.Value = update.newValue;
          } else {
              throw new BadRequestError(`Record with Name "${update.name}" not found.`);
          }
      });

      const builder: Builder = new Builder();
      return builder.buildObject(parsedXml);
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
