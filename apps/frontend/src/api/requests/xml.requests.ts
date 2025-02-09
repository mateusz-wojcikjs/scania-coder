import { api } from "../api.ts";

export const uploadXml: (file: File) => Promise<any> = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload-xml', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const editXml: (formData: FormData) => Promise<Blob> = async (formData: FormData): Promise<Blob> => {
  try {
    const { data } = await api.post('/edit-xml', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'text',
    });

    return new Blob([data], { type: 'application/xml' });
  } catch (error) {
    console.error('Failed to modify XML file:', error);
    throw error;
  }
};
