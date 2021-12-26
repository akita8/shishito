import {
  BankAccount,
  AccountsResponse,
  UserToken,
  OwnerDetailsResponse,
  OwnerDetails,
} from "./types";
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
    currentStockCtv: a.current_stock_ctv,
  }));
};

export const fetchOwner = async (
  token: UserToken,
  ownerId: number
): Promise<OwnerDetails> => {
  const response = await fetch(`/account/owner/${ownerId}`, {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: OwnerDetailsResponse = await response.json();
  return {
    name: data.name,
    ownerId: data.owner_id,
    bankName: data.bank_name,
    accountNumber: data.account_number,
  };
};
