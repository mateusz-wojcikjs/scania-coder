import { BlockType } from './blockType.types';

export interface UpdatePayload {
  name: string;
  newValue: string;
  shouldBeRemoved?: boolean;
  blockType?: BlockType;
}
