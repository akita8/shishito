import { User, UserResponse, UserToken, UserTokenResponse } from "./types";
import { prepareAuthHeader, strictFetch } from "./utils";

export const fetchUser = async (token: UserToken): Promise<User> => {
  const response = await fetch("/user/me/", {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: UserResponse = await response.json();
  return {
    username: data.username,
    userId: data.user_id,
    baseCurrency: data.base_currency,
  };
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<UserToken> => {
  const response = await strictFetch("/user/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=password&username=${username}&password=${password}`,
  });
  const data: UserTokenResponse = await response.json();
  return {
    tokenType: data.token_type,
    accessToken: data.access_token,
  };
};
