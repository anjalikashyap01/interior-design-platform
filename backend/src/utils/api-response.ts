export interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export const createApiResponse = <T>(
  message: string,
  data?: T
): ApiResponseData<T> => {
  return {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
};