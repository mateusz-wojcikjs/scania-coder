
import { CheckboxChangeEvent } from "antd/es/checkbox";

export interface FormListProps {
  name: string;
  onCheckToRemove: (e: CheckboxChangeEvent, name: number) => void;
  isCableList?: boolean;
}
