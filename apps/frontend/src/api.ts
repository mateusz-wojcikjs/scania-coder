import { Layout } from "./types/layout.type.ts";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authJwtToken');

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${JSON.parse(token).token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });


  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }

  return response.json();
}

export const getLayouts: () => Promise<Layout[]> = async () => {
  return await api('/api/layouts');
}

export const deleteLayout = async (id: number) => {
  const response = await fetch(`/api/layouts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${JSON.parse(<string>localStorage.getItem('authJwtToken')).token}`,
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete layout');
  }

  return response.json();
};
