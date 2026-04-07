import { FormInstance } from "antd/es/form";
import { CheckboxChangeEvent } from "antd/es/checkbox";

/** Clears `newValue` when "remove" is checked (shared by file edit and layout-only forms). */
export const createOnCheckToRemoveHandler: (
  form: FormInstance
) => (e: CheckboxChangeEvent, listName: string, fieldIndex: number) => void = (form) => (
  e: CheckboxChangeEvent,
  listName: string,
  fieldIndex: number
): void => {
  if (e.target.checked) {
    form.setFields([
      {
        name: [listName, fieldIndex, "newValue"],
        value: undefined,
      },
    ]);
  }
};
