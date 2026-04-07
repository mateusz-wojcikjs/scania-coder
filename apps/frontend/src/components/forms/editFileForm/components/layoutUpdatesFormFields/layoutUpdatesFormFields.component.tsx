import { FC } from "react";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { FormList } from "../formList/formList.component";

export interface LayoutUpdatesFormFieldsProps {
  onCheckToRemove: (e: CheckboxChangeEvent, listName: string, fieldIndex: number) => void;
}

export const LayoutUpdatesFormFields: FC<LayoutUpdatesFormFieldsProps> = ({
  onCheckToRemove,
}): JSX.Element => (
  <>
    <FormList name="updates" onCheckToRemove={onCheckToRemove} />
    <FormList name="cableList" isCableList onCheckToRemove={onCheckToRemove} />
  </>
);
