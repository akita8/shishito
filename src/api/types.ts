export interface UserResponse {
  username: string;
  user_id: number;
  base_currency: string;
}

export interface User {
  username: string;
  userId: number;
  baseCurrency: string;
}

export interface UserTokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserToken {
  accessToken: string;
  tokenType: string;
}

export interface AccountsResponse {
  accounts: {
    account_id: number;
    account_number: number;
    bank: string;
    bank_name: string;
    owners: {
      name: string;
      owner_id: number;
    }[];
  }[];
}

export interface Owner {
  name: string;
  ownerId: number;
}

export interface BankAccount {
  accountId: number;
  accountNumber: number;
  bank: string;
  bankName: string;
  owners: Owner[];
}

export interface TradedStockResponse {
  stock_id: number;
  symbol: string;
  market: string;
  iso_currency: string;
  last_price: number;
  current_ctv_converted: number;
  fiscal_price: number;
  profit_and_loss: number;
  current_quantity: number;
  invested: number;
  current_ctv: number;
  short_name: string;
  fiscal_price_converted: number
  profit_and_loss_converted: number
  invested_converted: number
}

export interface TradedStocksResponse {
  stocks: TradedStockResponse[];
  current_ctv_converted: number;
  profit_and_loss_converted: number;
  invested_converted: number;
}

export interface TradedStock {
  stockId: number;
  symbol: string;
  market: string;
  isoCurrency: string;
  lastPrice: number;
  currentCtvConverted: number;
  fiscalPrice: number;
  profitAndLoss: number;
  currentQuantity: number;
  invested: number;
  currentCtv: number;
  shortName: string;
  fiscalPriceConverted: number
  profitAndLossConverted: number
  investedCoverted: number
}

export interface TradedStocks {
  stocks: TradedStock[];
  currentCtvConverted: number;
  profitAndLossConverted: number
  investedConverted: number
}

export interface StockResponse {
  short_name: string;
  symbol: string;
  stock_id: number;
  market: string;
  last_price: number;
  currency_id: number;
  iso_currency: string;
}

export interface Stock {
  shortName: string;
  symbol: string;
  stockId: number;
  market: string;
  lastPrice: number;
  currencyId: number;
  isoCurrency: string;
}

export interface NewStockTransactionPayload {
  stock_id: number;
  price: number;
  quantity: number;
  tax: number;
  commission: number;
  date: string;
  transaction_type: string;
  transaction_note: string | null;
  transaction_ex_rate: number | null;
}

export interface OwnerDetailsResponse {
  owner_id: number;
  name: string;
  bank_name: string;
  account_number: string;
}

export interface OwnerDetails extends Owner {
  bankName: string;
  accountNumber: string;
}

export interface StockTransactionResponse extends NewStockTransactionPayload {
  stock_transaction_id: number;
}

export interface StockTransactionsResponse {
  transactions: StockTransactionResponse[];
}

export interface StockTransaction {
  stockTransactionId: number;
  stockId: number;
  price: number;
  quantity: number;
  tax: number;
  commission: number;
  date: string;
  transactionType: string;
  transactionNote: string | null;
  transactionExRate: number | null;
}

export interface UpdateStockTransactionPayload {
  stock_transaction_id: number;
  price: number;
  quantity: number;
  tax: number;
  commission: number;
  date: string;
  transaction_note: string | null;
  transaction_ex_rate: number | null;
}

