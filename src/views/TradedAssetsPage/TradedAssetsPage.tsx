import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";

import { fetchOwner } from "../../api/account";
import { fetchStockAlerts, fetchTradedStocks } from "../../api/stocks";
import {
  AlertFields,
  OwnerDetails,
  StockAlert,
  TradedStock,
  TradedStocks,
  UserToken,
} from "../../api/types";
import { Accordion, ExpandableRowProps } from "../../components/Accordion";
import { Button } from "../../components/Button";
import { GridCell, GridList } from "../../components/GridList";
import { TrendingNumber } from "../../components/TrendingNumber";
import { Bell } from "../../components/Bell";
import { ReactComponent as Plus } from "../../icons/plus.svg";

import style from "./TradedAssetsPage.module.scss";

interface TradedAssetsPageProps {
  authToken: UserToken;
  baseCurrency: string;
}
interface TradedStockGridProps {
  stock: TradedStock;
  baseCurrency: string;
}

interface TrendingProfitAndLossProps {
  profitAndLoss: number;
  formatter: Intl.NumberFormat;
}

const TrendingProfitAndLoss = ({
  profitAndLoss,
  formatter,
}: TrendingProfitAndLossProps) => (
  <TrendingNumber
    className={style.ProfitAndLoss}
    value={formatter.format(profitAndLoss)}
    positive={profitAndLoss === 0 ? null : profitAndLoss > 0}
  />
);

const AlertMessages = {
  [AlertFields.lowerLimitPrice]: (lastPrice: string, limit: string) =>
    `Last price ${lastPrice} lower than lower limit ${limit}`,
  [AlertFields.upperLimitPrice]: (lastPrice: string, limit: string) =>
    `Last price ${lastPrice} greater than upper limit ${limit}`,
  [AlertFields.dividendDate]: (date: string) =>
    `Dividend date ${date} has expired`,
  [AlertFields.fiscalPriceLowerThan]: () =>
    "Fiscal price is lower than last price",
  [AlertFields.fiscalPriceGreaterThan]: () =>
    "Fiscal price is greater than last price",
  [AlertFields.profitAndLossLowerLimit]: (
    profitAndLoss: string,
    limit: string
  ) => `Profit and loss ${profitAndLoss} lower than lower limit ${limit}`,
  [AlertFields.profitAndLossUpperLimit]: (
    profitAndLoss: string,
    limit: string
  ) => `Profit and loss ${profitAndLoss} greater than upper limit ${limit}`,
};

const createAlertMessage = (
  stock: TradedStock,
  alert: StockAlert,
  triggeredField: string,
  currencyFormatter: Intl.NumberFormat
) => {
  switch (triggeredField) {
    case AlertFields.lowerLimitPrice:
      return AlertMessages[triggeredField](
        currencyFormatter.format(stock.lastPrice),
        currencyFormatter.format(alert.lowerLimitPrice as number)
      );
    case AlertFields.upperLimitPrice:
      return AlertMessages[triggeredField](
        currencyFormatter.format(stock.lastPrice),
        currencyFormatter.format(alert.upperLimitPrice as number)
      );
    case AlertFields.dividendDate:
      return AlertMessages[triggeredField](alert.dividendDate as string);
    case AlertFields.fiscalPriceLowerThan:
      return AlertMessages[triggeredField]();
    case AlertFields.fiscalPriceGreaterThan:
      return AlertMessages[triggeredField]();
    case AlertFields.profitAndLossLowerLimit:
      return AlertMessages[triggeredField](
        currencyFormatter.format(stock.profitAndLoss),
        currencyFormatter.format(alert.profitAndLossLowerLimit as number)
      );
    case AlertFields.profitAndLossUpperLimit:
      return AlertMessages[triggeredField](
        currencyFormatter.format(stock.profitAndLoss),
        currencyFormatter.format(alert.profitAndLossUpperLimit as number)
      );
    default:
      throw Error("missing formatter for alert field");
  }
};

export const TradedStockGrid = ({
  stock,
  baseCurrency,
}: TradedStockGridProps) => {
  const cells = useMemo(() => {
    const currency = stock.isoCurrency.toUpperCase();
    const baseFormatter = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: baseCurrency.toUpperCase(),
    });
    const nativeFormatter = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: currency,
    });
    const numberFormatter = new Intl.NumberFormat(navigator.language, {
      maximumSignificantDigits: 3,
    });
    return [
      {
        field: "Name",
        value: stock.shortName,
      },
      {
        field: "Quantity",
        value: numberFormatter.format(stock.currentQuantity),
      },
      {
        field: "Fiscal Price",
        value: nativeFormatter.format(stock.fiscalPrice),
      },
      {
        field: `Fiscal Price (${baseCurrency})`,
        value: baseFormatter.format(stock.fiscalPriceConverted),
      },
      {
        field: "Last Price",
        value: nativeFormatter.format(stock.lastPrice),
      },
      {
        field: "Invested",
        value: nativeFormatter.format(stock.invested),
      },
      {
        field: `Invested (${baseCurrency})`,
        value: baseFormatter.format(stock.investedConverted),
      },
      {
        field: "Ctv",
        value: nativeFormatter.format(stock.currentCtv),
      },
      {
        field: `Ctv (${baseCurrency})`,
        value: baseFormatter.format(stock.currentCtvConverted),
      },
      {
        field: "Profit and Loss",
        value: (
          <TrendingProfitAndLoss
            profitAndLoss={stock.profitAndLoss}
            formatter={nativeFormatter}
          />
        ),
      },
      {
        field: `Profit and Loss (${baseCurrency})`,
        value: (
          <TrendingProfitAndLoss
            profitAndLoss={stock.profitAndLossConverted}
            formatter={baseFormatter}
          />
        ),
      },
    ];
  }, [baseCurrency, stock]);
  return <GridList cells={cells} />;
};

const TradedAssetsPage = ({
  authToken,
  baseCurrency,
}: TradedAssetsPageProps) => {
  const history = useHistory();
  const { ownerId } = useParams<{ ownerId: string }>();
  const [tradedStocks, setTradedStocks] = useState<TradedStocks | null>(null);
  const [stockAlerts, setStockAlerts] =
    useState<Map<number, StockAlert> | null>(null);
  const [owner, setOwner] = useState<OwnerDetails | null>(null);

  const rows = useMemo<ExpandableRowProps[]>(() => {
    if (tradedStocks !== null && stockAlerts != null) {
      const sortedStocks = [...tradedStocks.stocks].sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
      return sortedStocks.map((s) => {
        const currency = s.isoCurrency.toUpperCase();
        const lang = navigator.language;
        const nativeFormatter = new Intl.NumberFormat(lang, {
          style: "currency",
          currency: currency,
        });
        const profitAndLoss = (
          <TrendingNumber
            className={style.ProfitAndLoss}
            value={nativeFormatter.format(s.profitAndLoss)}
            positive={s.profitAndLoss === 0 ? null : s.profitAndLoss > 0}
          />
        );
        const alert = stockAlerts.get(s.stockId);
        return {
          id: s.stockId,
          title: (
            <span className={style.Info}>
              <span className={style.Title}>
                {`${s.symbol} - ${s.isoCurrency.toUpperCase()} - ${s.market}`}
              </span>
              {profitAndLoss}
              {alert ? (
                <Bell warning={alert.triggeredFields.length > 0} />
              ) : (
                <></>
              )}
            </span>
          ),
          onMoreInfo: () =>
            history.push(`/transaction/${ownerId}/stock/${s.stockId}`),
          component: (
            <>
              <TradedStockGrid stock={s} baseCurrency={baseCurrency} />
              {alert && alert.triggeredFields.length > 0 ? (
                <section className={style.TriggeredFields}>
                  <span>Triggered Alerts</span>
                  <ul>
                    {alert.triggeredFields.map((f, i) => (
                      <li key={`triggered-field-${i}`}>
                        {createAlertMessage(s, alert, f, nativeFormatter)}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <></>
              )}
            </>
          ),
        };
      });
    } else return [];
  }, [tradedStocks, stockAlerts, baseCurrency, history, ownerId]);

  const infoCells = useMemo<GridCell[]>(() => {
    const formatter = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: baseCurrency.toUpperCase(),
    });
    return owner
      ? [
          {
            field: "Owner",
            value: owner.name,
          },
          {
            field: "Bank",
            value: owner.bankName,
          },
          {
            field: "Account Number",
            value: owner.accountNumber,
          },
          {
            field: `Ctv (${baseCurrency})`,
            value: tradedStocks
              ? formatter.format(tradedStocks.currentCtvConverted)
              : "",
          },
          {
            field: `Invested (${baseCurrency})`,
            value: tradedStocks
              ? formatter.format(tradedStocks.investedConverted)
              : "",
          },
          {
            field: `Profit and Loss (${baseCurrency})`,
            value: tradedStocks
              ? formatter.format(tradedStocks.profitAndLossConverted)
              : "",
          },
        ]
      : [];
  }, [owner, tradedStocks, baseCurrency]);

  useEffect(() => {
    void (async () => {
      const id = Number(ownerId);
      setOwner(await fetchOwner(authToken, id));
      setTradedStocks(await fetchTradedStocks(authToken, id));
      const alerts = await fetchStockAlerts(authToken, id);
      const indexedAlerts = new Map();
      for (const alert of alerts) {
        indexedAlerts.set(alert.stockId, alert);
      }
      setStockAlerts(indexedAlerts);
    })();
  }, [authToken, ownerId]);

  return (
    <div className={style.TradedAssetsPage}>
      <section className={style.Summary}>
        <GridList className={style.OwnerSummary} cells={infoCells} />
        <Button
          className={style.AddTransactionButton}
          onClick={() => history.push(`/transaction/${ownerId}/add/stock`)}
        >
          <span>Add Transaction</span>
          <Plus className={style.AddIcon} />
        </Button>
      </section>
      {tradedStocks && <Accordion rows={rows} />}
    </div>
  );
};

export default TradedAssetsPage;
