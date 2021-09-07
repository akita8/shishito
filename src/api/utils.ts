import { UserToken } from "./types";

export const prepareAuthHeader = (
  token: UserToken
): Record<string, string> => ({
  Authorization: `${token.tokenType} ${token.accessToken}`,
});
