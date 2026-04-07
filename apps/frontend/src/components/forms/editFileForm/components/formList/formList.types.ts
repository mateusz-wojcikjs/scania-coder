
import { CheckboxChangeEvent } from "antd/es/checkbox";

export interface FormListProps {
  name: string;
  onCheckToRemove: (e: CheckboxChangeEvent, listName: string, fieldIndex: number) => void;
  isCableList?: boolean;
}

export interface FormListItem {
  name?: string;
  newValue?: string;
  shouldBeRemoved?: boolean;
  blockType?: string;
}