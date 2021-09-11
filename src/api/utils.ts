import { UserToken } from "./types";

export const prepareAuthHeader = (
  token: UserToken
): Record<string, string> => ({
  Authorization: `${token.tokenType} ${token.accessToken}`,
});

export const strictFetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`fetch call to ${input} failed`);
  }
  return response;
};
