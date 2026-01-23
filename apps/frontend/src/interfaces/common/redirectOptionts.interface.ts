export interface RedirectOptions {
    targetRoute?: string;
    params?: Record<string, string | number>;
    searchParams?: Record<string, string | number>;
    isExternalUrl?: boolean;
    inNewTab?: boolean;
    goBack?: boolean;
  }