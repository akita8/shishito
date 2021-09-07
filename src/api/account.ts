import { BankAccount, AccountsResponse, UserToken } from "./types";
import { prepareAuthHeader } from "./utils";

export const fetchAccounts = async (
  token: UserToken
): Promise<BankAccount[]> => {
  const response = await fetch("/account/", {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: AccountsResponse = await response.json();
  return data.accounts.map((a) => ({
    accountId: a.account_id,
    accountNumber: a.account_number,
    bank: a.bank,
    bankName: a.bank_name,
    owners: a.owners.map((o) => ({ ownerId: o.owner_id, name: o.name })),
  }));
};
