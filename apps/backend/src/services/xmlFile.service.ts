import { Builder, parseStringPromise } from "xml2js";
import { FPC, ParsedXml, VersionBlock } from "../types";
import { XmlFileMetaData, UpdatePayload } from "@scania-coder/types";

export class XmlFileService {
    static async editXmlFile(
        xmlData: string,
        updates: UpdatePayload[]
    ): Promise<string> {
      const parsedXml: ParsedXml = await parseStringPromise(xmlData);
      const records: FPC[] = parsedXml.Sops.Data[0].FpcBlock[0].FPC || [];

      updates.forEach((update: UpdatePayload): void => {
          const record: FPC | undefined = records.find((r: FPC): boolean => r.$.Name === update.name);

          if (record) {
              record.$.Value = update.newValue;
          } else {
              throw new Error(`Record with Name "${update.name}" not found.`);
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
