export interface VersionAttributes {
  MajorVersion: string;
  MinorVersion: string;
  RebuildType: string;
  RebuildId: string;
  AffectedEcus: string;
  LicenseSerialNumber: string;
  ApplicationId: string;
  ApplicationVersion: string;
  Date: string;
}

export interface VersionBlock {
  $: { Version: string };
  Version: Array<{ $: VersionAttributes }>;
}

export interface FPC {
  $: {
    Name: string;
    Value: string;
    Updated: string;
  };
}

export interface FpcBlock {
  $: { Version: string };
  FPC: FPC[];
}

export interface CableList {
  $: {
    Name: string;
  };
}

export interface CableListBlock {
  $: { Version: string };
  CableList: CableList[];
}

export interface Data {
  FpcBlock: FpcBlock[];
  VersionBlock: VersionBlock[];
  CableListBlock: CableListBlock[];
}

export interface Sops {
  Meta: object;
  Data: Data[];
}

export interface ParsedXml {
  Sops: Sops;
}

export interface XmlFileServiceData {
  updatedXml: string;
  updatedFields: string[],
  errors: string[],
}
