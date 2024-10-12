export interface VersionCardProps {
  currentFileVersion: string;
  newFileVersion: string;
  setFileVersion: (version: string) => void;
}
