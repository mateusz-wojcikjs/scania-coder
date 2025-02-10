import { useMutation } from "@tanstack/react-query";
import { UploadProps } from "antd/es/upload/interface";
import { uploadXml } from "../api/requests";
import { message } from "antd";
import { TransProps, useTranslation } from "react-i18next";

export const useUpload = () => {
  const { t }: TransProps<never> = useTranslation();

  const mutation = useMutation({
    mutationFn: uploadXml,
    onError: (error: Error): void => {
      const errorMessage: string = t("sc.fe.forms.upload.error");
      message.error(errorMessage);
      console.log(error);
    },
  });

  const customUpload: UploadProps["customRequest"] = async (options): Promise<void> => {
    const { file, onSuccess, onError } = options;

    try {
      mutation.mutate(file as File, {
        onSuccess: (data): void => {
          if (onSuccess) {
            onSuccess(data, file);
          }
        },
        onError: (error: any): void => {
          const uploadError = {
            name: error.name || "Error",
            message: error.message || "Upload failed",
          };
          onError && onError(uploadError);
        },
      });
    } catch (err) {
      const uploadError = {
        name: (err as Error).name,
        message: (err as Error).message,
      };
      onError && onError(uploadError);
    }
  };

  return {
    customUpload,
  };
};
