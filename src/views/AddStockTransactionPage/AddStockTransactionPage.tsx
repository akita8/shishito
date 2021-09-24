import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, /*useLocation,*/ useParams } from "react-router";
import classnames from "classnames";
import Select from "react-select";

import {
  createStockTransaction,
  fetchOrCreateStock,
  fetchTradedStock,
} from "../../api/stocks";
import {
  Stock,
  //StockTransaction,
  TradedStock,
  UserToken,
} from "../../api/types";
import { Button } from "../../components/Button";
import { GridCell, GridList } from "../../components/GridList";
import { Input } from "../../components/Input";
import { parseDecimal } from "../../utils";

import style from "./AddStockTransactionPage.module.scss";

interface AddStockTransactionPageProps {
  authToken: UserToken;
}

enum Actions {
  ADD = "add",
  MODIFY = "modify",
}

const AddStockTransactionPage = ({
  authToken,
}: AddStockTransactionPageProps) => {
  const { ownerId, stockId } =
    useParams<{
      ownerId: string;
      stockId: string | undefined;
      action: Actions;
    }>();
  const history = useHistory();
  //const { state } = useLocation<{ transaction: StockTransaction }>();

  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState<Stock | TradedStock | null>(null);
  const [stockHint, setStockHint] = useState<string>("");
  const [priceHint, setPriceHint] = useState<string>("");
  const [exRateHint, setExRateHint] = useState<string>("");
  const [quantityHint, setQuantityHint] = useState<string>("");
  const [taxHint, setTaxHint] = useState<string>("");
  const [commissionHint, setCommissionHint] = useState<string>("");

  const [price, setPrice] = useState<number | null>(null);
  const [exRate, setExRate] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(null);
  const [commission, setCommission] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (stockId) {
        setStock(
          await fetchTradedStock(authToken, Number(ownerId), Number(stockId))
        );
      }
    })();
  }, [authToken, stockId, ownerId]);

  const onSearch = useCallback(() => {
    void (async () => {
      try {
        const stockResponse = await fetchOrCreateStock(authToken, symbol);
        setStock(stockResponse);
        setStockHint("");
      } catch (error) {
        setStockHint(`Could not find symbol: ${symbol}`);
      }
    })();
  }, [authToken, symbol]);

  const handleEnterKeyPress = useCallback(
    (key: string) => {
      if (key === "Enter" && symbol !== "") onSearch();
    },
    [onSearch, symbol]
  );

  const stockCells = useMemo<GridCell[]>(() => {
    if (!stock) return [];
    const currency = stock.isoCurrency.toUpperCase();
    const lang = navigator.language;
    const nativeFormatter = new Intl.NumberFormat(lang, {
      style: "currency",
      currency: currency,
    });
    return [
      {
        field: "Name",
        value: stock.shortName,
      },
      {
        field: "Symbol",
        value: stock.symbol,
      },
      {
        field: "Market",
        value: stock.market,
      },
      {
        field: "Currency",
        value: currency,
      },
      {
        field: "Last Price",
        value: nativeFormatter.format(stock.lastPrice),
      },
    ];
  }, [stock]);

  const confirmedDisabled = useMemo(() => {
    return (
      price === null ||
      quantity === null ||
      tax === null ||
      commission === null ||
      date === null ||
      date === "" ||
      transactionType === null ||
      priceHint !== "" ||
      quantityHint !== "" ||
      taxHint !== "" ||
      commissionHint !== "" ||
      exRateHint !== ""
    );
  }, [
    commission,
    commissionHint,
    date,
    price,
    priceHint,
    quantity,
    quantityHint,
    tax,
    taxHint,
    transactionType,
    exRateHint,
  ]);

  return (
    <div className={style.AddStockTransactionPage}>
      {!stockId && (
        <section className={style.StockSearch}>
          <Input
            className={style.Input}
            placeholder="Stock Symbol"
            inputType="text"
            name="symbol"
            onChange={setSymbol}
            onKeyPress={handleEnterKeyPress}
            hint={stockHint}
          />
          <Button onClick={onSearch}>Search</Button>
        </section>
      )}
      {stockCells.length > 0 && (
        <GridList className={style.StockGridList} cells={stockCells} />
      )}
      {stock && (
        <section className={style.TransactionParameters}>
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Price: "
            inputType="text"
            name="price"
            onChange={(v) => {
              const num = parseDecimal(v);
              if (isNaN(num) || num < 0) {
                setPriceHint("Price must be a positive number");
                setPrice(null);
              } else {
                setPriceHint("");
                setPrice(num);
              }
            }}
            hint={priceHint}
          />
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Exchange Rate: "
            inputType="text"
            name="exchange_rate"
            onChange={(v) => {
              const num = parseDecimal(v);
              if (isNaN(num) || num < 0) {
                setExRateHint("Exchange rate must be a positive number");
                setExRate(null);
              } else {
                setExRateHint("");
                setExRate(num);
              }
            }}
            hint={exRateHint}
          />
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Quantity: "
            inputType="text"
            name="quantity"
            onChange={(v) => {
              const num = parseDecimal(v);
              if (
                v.indexOf(".") !== -1 ||
                v.indexOf(",") !== -1 ||
                isNaN(num) ||
                num < 0
              ) {
                setQuantityHint("Quantity must be a positive integer");
                setQuantity(null);
              } else {
                setQuantityHint("");
                setQuantity(num);
              }
            }}
            hint={quantityHint}
          />
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Tax: "
            inputType="text"
            name="tax"
            onChange={(v) => {
              const num = parseDecimal(v);
              if (isNaN(num) || num < 0) {
                setTaxHint("Tax must be a positive number");
                setTax(null);
              } else {
                setTaxHint("");
                setTax(num);
              }
            }}
            hint={taxHint}
          />
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Commission: "
            inputType="text"
            name="commission"
            onChange={(v) => {
              const num = parseDecimal(v);
              if (isNaN(num) || num < 0) {
                setCommissionHint("Commission must be a positive number");
                setCommission(null);
              } else {
                setCommissionHint("");
                setCommission(num);
              }
            }}
            hint={commissionHint}
          />
          <Input
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Date: "
            inputType="date"
            name="date"
            onChange={setDate}
          />

          <div className={style.TransactionType}>
            <span>Transaction Type: </span>
            <Select
              className={style.Select}
              options={[
                { label: "Buy", value: "buy" },
                { label: "Sell", value: "sell" },
              ]}
              onChange={(o) => setTransactionType(o ? o.value : null)}
            />
          </div>

          <div className={style.TransactionNotes}>
            <label htmlFor="note">Notes: </label>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              name="note"
              cols={40}
              rows={10}
            />
          </div>

          <div className={style.ActionButtons}>
            <Button onClick={() => history.goBack()}>Cancel</Button>
            <Button
              disabled={confirmedDisabled}
              onClick={async () => {
                if (
                  price !== null &&
                  quantity !== null &&
                  tax !== null &&
                  commission !== null &&
                  date !== null &&
                  transactionType !== null
                ) {
                  await createStockTransaction(authToken, Number(ownerId), {
                    stock_id: stock.stockId,
                    price,
                    quantity,
                    tax,
                    commission,
                    date: `${date}T12:00:00.000000`,
                    transaction_type: transactionType,
                    transaction_note: note,
                    transaction_ex_rate: exRate,
                  });
                  history.push(
                    `/transaction/${ownerId}/stock/${stock.stockId}`
                  );
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AddStockTransactionPage;
