export interface ApiError {
  error: {
    errorCode: string;
    message: string;
    statusCode: number;
  };
}
