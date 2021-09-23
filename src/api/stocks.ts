import {
  NewStockTransactionPayload,
  Stock,
  StockResponse,
  StockTransactionsResponse,
  StockTransaction,
  TradedStocks,
  TradedStocksResponse,
  UserToken,
} from "./types";
import { prepareAuthHeader, strictFetch } from "./utils";

export const fetchTradedStocks = async (
  token: UserToken,
  ownerID: number
): Promise<TradedStocks> => {
  const response = await fetch(`/stock/traded/${ownerID}/`, {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: TradedStocksResponse = await response.json();
  return {
    stocks: data.stocks.map((s) => ({
      stockId: s.stock_id,
      symbol: s.symbol,
      market: s.market,
      currency: s.currency,
      lastPrice: s.last_price,
      currentCtvConverted: s.current_ctv_converted,
      fiscalPrice: s.fiscal_price,
      profitAndLoss: s.profit_and_loss,
      currentQuantity: s.current_quantity,
      invested: s.invested,
      currentCtv: s.current_ctv,
      shortName: s.short_name,
    })),
    currentCtvConverted: data.current_ctv_converted,
  };
};

export const fetchOrCreateStock = async (
  token: UserToken,
  symbol: string
): Promise<Stock> => {
  const response = await strictFetch("/stock/", {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify({ symbol }),
  });
  const data: StockResponse = await response.json();
  return {
    shortName: data.short_name,
    symbol: data.symbol,
    stockId: data.stock_id,
    market: data.market,
    lastPrice: data.last_price,
    currencyId: data.currency_id,
    isoCurrency: data.iso_currency,
  };
};

export const createStockTransaction = async (
  token: UserToken,
  ownerId: number,
  payload: NewStockTransactionPayload
) => {
  await fetch(`/stock/transaction/${ownerId}/`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify(payload),
  });
};

export const fetchStockTransactions = async (
  token: UserToken,
  ownerID: number,
  stockID: number
): Promise<StockTransaction[]> => {
  const response = await fetch(
    `/stock/transaction/${ownerID}/history/${stockID}`,
    {
      headers: {
        accept: "application/json",
        ...prepareAuthHeader(token),
      },
    }
  );
  const data: StockTransactionsResponse = await response.json();
  return data.transactions.map((t) => ({
    stockTransactionId: t.stock_transaction_id,
    stockId: t.stock_id,
    price: t.price,
    quantity: t.quantity,
    tax: t.tax,
    commission: t.commission,
    date: t.date,
    transactionType: t.transaction_type,
    transactionNote: t.transaction_note,
    transactionExRate: t.transaction_ex_rate,
  }));
};
