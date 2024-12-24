// Functions to format responses
export function successResponse(
  data: any,
  message: string,
  meta: { [key: string]: any } | null = null,
) {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(message: string, issues: any = null) {
  return {
    success: false,
    message,
    ...(issues ? { meta: { issues } } : {}),
  };
}
