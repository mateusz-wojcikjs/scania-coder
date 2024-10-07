import { parseStringPromise, Builder } from "xml2js";
import { UpdatePayload } from "../types";

export class XmlFileService {
    static async editXmlFile(
        xmlData: string,
        updates: UpdatePayload[]
    ): Promise<any> {
            const parsedXml = await parseStringPromise(xmlData);
            const records = parsedXml.Sops.Data[0].FpcBlock[0].FPC || [];

        updates.forEach(update => {
            const record = records.find((r: any) => r.$.Name === update.name);
            if (record) {
                record.$.Value = update.newValue;
            } else {
                throw new Error(`Record with Name "${update.name}" not found.`);
            }
        });

        console.log(parsedXml.Sops.Data[0].FpcBlock[0].FPC);
        const builder = new Builder();
        const updatedXml = builder.buildObject(parsedXml);

        return updatedXml;

    }

    static async extractMetaData(xmlData: string): Promise<unknown> {

            const parsedXml = await parseStringPromise(xmlData);
            const versionBlock = parsedXml.Sops.Data[0].VersionBlock[0];

            const data = {
                blockVersion: versionBlock.$.Version,
                majorVersion: versionBlock.Version[0].$.MajorVersion,
                minorVersion: versionBlock.Version[0].$.MinorVersion,
                date: versionBlock.Version[0].$.Date
            };

            if (!data) {
                throw new Error("Data not found");
            }

            return { data };
    }
}
