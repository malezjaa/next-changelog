const DEFAULT_BASE_URL = "http://localhost:3000/";

export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE_URL;

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};
