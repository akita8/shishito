import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { fetchOwner } from "../../api/account";

import { fetchTradedStocks } from "../../api/stocks";
import { OwnerDetails, TradedStocks, UserToken } from "../../api/types";
import { Accordion } from "../../components/Accordion";
import { Button } from "../../components/Button";
import { GridCell, GridList } from "../../components/GridList";
import { TrendingNumber } from "../../components/TrendingNumber";
import { ReactComponent as Plus } from "../../icons/plus.svg";

import style from "./TradedAssetsPage.module.scss";

interface TradedAssetsPageProps {
  authToken: UserToken;
  baseCurrency: string;
}

const TradedAssetsPage = ({
  authToken,
  baseCurrency,
}: TradedAssetsPageProps) => {
  const history = useHistory();
  const { ownerId } = useParams<{ ownerId: string }>();
  const [tradedStocks, setTradedStocks] = useState<TradedStocks | null>(null);
  const [owner, setOwner] = useState<OwnerDetails | null>(null);

  const rows = useMemo(() => {
    if (tradedStocks) {
      const sortedStocks = [...tradedStocks.stocks].sort((a, b) =>
        a.symbol.localeCompare(b.symbol)
      );
      return sortedStocks.map((s) => {
        const currency = s.currency.toUpperCase();
        const lang = navigator.language;
        const baseFormatter = new Intl.NumberFormat(lang, {
          style: "currency",
          currency: baseCurrency.toUpperCase(),
        });
        const nativeFormatter = new Intl.NumberFormat(lang, {
          style: "currency",
          currency: currency,
        });
        const numberFormatter = new Intl.NumberFormat(lang, {
          maximumSignificantDigits: 3,
        });
        const profitAndLoss = (
          <TrendingNumber
            className={style.ProfitAndLoss}
            value={nativeFormatter.format(s.profitAndLoss)}
            positive={s.profitAndLoss === 0 ? null : s.profitAndLoss > 0}
          />
        );
        return {
          id: s.stockId,
          title: (
            <span className={style.AccordionTitle}>
              <span className={style.TitleText}>
                {`${s.symbol} - ${currency} - ${s.market}`}
              </span>
              {profitAndLoss}
            </span>
          ),
          component: (
            <GridList
              cells={[
                {
                  field: "Name",
                  value: s.shortName,
                },
                {
                  field: "Quantity",
                  value: numberFormatter.format(s.currentQuantity),
                },
                {
                  field: "Fiscal Price",
                  value: nativeFormatter.format(s.fiscalPrice),
                },
                {
                  field: "Last Price",
                  value: nativeFormatter.format(s.lastPrice),
                },
                {
                  field: "Invested",
                  value: nativeFormatter.format(s.invested),
                },
                {
                  field: "Ctv",
                  value: nativeFormatter.format(s.currentCtv),
                },
                {
                  field: `Ctv (${baseCurrency})`,
                  value: baseFormatter.format(s.currentCtvConverted),
                },
                {
                  field: "Profit and Loss",
                  value: profitAndLoss,
                },
              ]}
            />
          ),
        };
      });
    } else return [];
  }, [tradedStocks, baseCurrency]);

  const infoCells = useMemo<GridCell[]>(
    () =>
      owner
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
                ? new Intl.NumberFormat(navigator.language, {
                    style: "currency",
                    currency: baseCurrency.toUpperCase(),
                  }).format(tradedStocks.currentCtvConverted)
                : "",
            },
          ]
        : [],
    [owner, tradedStocks, baseCurrency]
  );

  useEffect(() => {
    void (async () => {
      const id = Number(ownerId);
      setOwner(await fetchOwner(authToken, id));
      setTradedStocks(await fetchTradedStocks(authToken, id));
    })();
  }, [authToken, ownerId]);

  return (
    <div className={style.TradedAssetsPage}>
      <section className={style.Summary}>
        <GridList className={style.OwnerSummary} cells={infoCells} />
        <Button
          className={style.AddTransactionButton}
          onClick={() => history.push(`/transaction/stock/${ownerId}`)}
        >
          <span>Add Transaction</span>
          <Plus className={style.Icon} />
        </Button>
      </section>
      {tradedStocks && <Accordion rows={rows} />}
    </div>
  );
};

export default TradedAssetsPage;
