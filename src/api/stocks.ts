import {
  NewStockTransactionPayload,
  Stock,
  StockResponse,
  StockTransactionsResponse,
  StockTransaction,
  TradedStocks,
  TradedStocksResponse,
  UserToken,
  TradedStock,
  TradedStockResponse,
  UpdateStockTransactionPayload,
  StockAlert,
  StockAlertsResponse,
  StockAlertResponse,
  StockAlertCreationPayload,
  StockAlertUpdatePayload,
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
      isoCurrency: s.iso_currency,
      lastPrice: s.last_price,
      currentCtvConverted: s.current_ctv_converted,
      fiscalPrice: s.fiscal_price,
      profitAndLoss: s.profit_and_loss,
      currentQuantity: s.current_quantity,
      invested: s.invested,
      currentCtv: s.current_ctv,
      shortName: s.short_name,
      fiscalPriceConverted: s.fiscal_price_converted,
      profitAndLossConverted: s.profit_and_loss_converted,
      investedConverted: s.invested_converted,
    })),
    currentCtvConverted: data.current_ctv_converted,
    investedConverted: data.invested_converted,
    profitAndLossConverted: data.profit_and_loss_converted,
  };
};

export const fetchTradedStock = async (
  token: UserToken,
  ownerID: number,
  stockID: number
): Promise<TradedStock> => {
  const response = await fetch(`/stock/traded/${ownerID}/${stockID}/`, {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: TradedStockResponse = await response.json();
  return {
    stockId: data.stock_id,
    symbol: data.symbol,
    market: data.market,
    isoCurrency: data.iso_currency,
    lastPrice: data.last_price,
    currentCtvConverted: data.current_ctv_converted,
    fiscalPrice: data.fiscal_price,
    profitAndLoss: data.profit_and_loss,
    currentQuantity: data.current_quantity,
    invested: data.invested,
    currentCtv: data.current_ctv,
    shortName: data.short_name,
    fiscalPriceConverted: data.fiscal_price_converted,
    profitAndLossConverted: data.profit_and_loss_converted,
    investedConverted: data.invested_converted,
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

export const modifyStockTransaction = async (
  token: UserToken,
  payload: UpdateStockTransactionPayload
) => {
  await fetch(`/stock/transaction`, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify(payload),
  });
};

export const deleteStockTransaction = async (
  token: UserToken,
  stockTransactionId: number
) => {
  await fetch(`/stock/transaction`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify({ stock_transaction_id: stockTransactionId }),
  });
};

export const updateStocks = async (token: UserToken) => {
  await fetch(`/stock/`, {
    method: "POST",
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  await fetch(`/stock/currency/`, {
    method: "POST",
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
};

const toStockAlert = (a: StockAlertResponse): StockAlert => ({
  stockId: a.stock_id,
  ownerId: a.owner_id,
  lowerLimitPrice: a.lower_limit_price,
  upperLimitPrice: a.upper_limit_price,
  dividendDate: a.dividend_date,
  fiscalPriceLowerThan: a.fiscal_price_lower_than,
  fiscalPriceGreaterThan: a.fiscal_price_greater_than,
  profitAndLossLowerLimit: a.profit_and_loss_lower_limit,
  profitAndLossUpperLimit: a.profit_and_loss_upper_limit,
  stockAlertId: a.stock_alert_id,
  triggeredFields: a.triggered_fields,
});

export const fetchStockAlerts = async (
  token: UserToken,
  ownerID: number
): Promise<StockAlert[]> => {
  const response = await fetch(`/stock/alert/${ownerID}/`, {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: StockAlertsResponse = await response.json();
  return data.alerts.map((a) => toStockAlert(a));
};

export const fetchStockAlert = async (
  token: UserToken,
  ownerID: number,
  stockID: number
): Promise<StockAlert> => {
  const response = await strictFetch(`/stock/alert/${ownerID}/${stockID}/`, {
    headers: {
      accept: "application/json",
      ...prepareAuthHeader(token),
    },
  });
  const data: StockAlertResponse = await response.json();
  return toStockAlert(data);
};

export const createStockAlert = async (
  token: UserToken,
  payload: StockAlertCreationPayload
): Promise<StockAlert> => {
  const response = await fetch(`/stock/alert/`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify(payload),
  });
  const data: StockAlertResponse = await response.json();
  return toStockAlert(data);
};

export const updateStockAlert = async (
  token: UserToken,
  payload: StockAlertUpdatePayload
): Promise<StockAlert> => {
  const response = await fetch(`/stock/alert/`, {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify(payload),
  });
  const data: StockAlertResponse = await response.json();
  return toStockAlert(data);
};

export const deleteStockAlert = async (token: UserToken, id: number) => {
  await fetch(`/stock/alert/`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...prepareAuthHeader(token),
    },
    body: JSON.stringify({ stock_alert_id: id }),
  });
};
