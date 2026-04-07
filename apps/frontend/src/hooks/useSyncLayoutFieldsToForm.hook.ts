import { UpdatePayload } from "@scania-coder/types";
import { FormInstance } from "antd/es/form";
import { useEffect } from "react";

const EMPTY_ARRAY_LENGTH: number = 0;

/**
 * Maps persisted layout `updates` into the two form lists (`updates` / `cableList`)
 * used by the XML editor and layout-only editor.
 */
export const useSyncLayoutFieldsToForm: (
  form: FormInstance,
  layoutFields: UpdatePayload[] | undefined,
  layoutName?: string
) => void = (form, layoutFields, layoutName): void => {
  useEffect(() => {
    if (!layoutFields || layoutFields.length === EMPTY_ARRAY_LENGTH) {
      form.setFieldsValue({
        updates: [],
        cableList: [],
        ...(layoutName !== undefined ? { layoutName } : {}),
      });
      return;
    }

    const updates = layoutFields
      .filter(f => f.blockType !== "CableList")
      .map(({ name, newValue, shouldBeRemoved }) => ({
        name,
        newValue,
        shouldBeRemoved,
      }));

    const cableList = layoutFields
      .filter(f => f.blockType === "CableList")
      .map(({ name, newValue, shouldBeRemoved }) => ({
        name,
        newValue,
        shouldBeRemoved,
        blockType: "CableList" as const,
      }));

    form.setFieldsValue({
      updates,
      cableList,
      ...(layoutName !== undefined ? { layoutName } : {}),
    });
  }, [form, layoutFields, layoutName]);
};
