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

export interface Data {
  FpcBlock: FpcBlock[];
  VersionBlock: VersionBlock[];
}

export interface Sops {
  Meta: object;
  Data: Data[];
}

export interface ParsedXml {
  Sops: Sops;
}
