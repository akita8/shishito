import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import classnames from "classnames";
import Select from "react-select";

import {
  createStockTransaction,
  fetchOrCreateStock,
  fetchTradedStock,
  modifyStockTransaction,
} from "../../api/stocks";
import {
  Stock,
  StockTransaction,
  TradedStock,
  UserToken,
} from "../../api/types";
import { Button } from "../../components/Button";
import { GridCell, GridList } from "../../components/GridList";
import { Input } from "../../components/Input";
import { datetimeToDate, dateToDatetime } from "../../utils";

import style from "./AddStockTransactionPage.module.scss";
import {
  mustBePositiveInteger,
  mustBePositiveNumber,
} from "../../components/Input/Input";

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
  const { ownerId, stockId, action } =
    useParams<{
      ownerId: string;
      stockId: string | undefined;
      action: Actions;
    }>();
  const history = useHistory();
  const { state } = useLocation<{ transaction: StockTransaction }>();

  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState<Stock | TradedStock | null>(null);
  const [stockHint, setStockHint] = useState<string>("");
  const [priceHint, setPriceHint] = useState<string>("");
  const [exRateHint, setExRateHint] = useState<string>("");
  const [quantityHint, setQuantityHint] = useState<string>("");
  const [taxHint, setTaxHint] = useState<string>("");
  const [commissionHint, setCommissionHint] = useState<string>("");

  const [price, setPrice] = useState<number | null>(
    state && state.transaction ? state.transaction.price : null
  );
  const [exRate, setExRate] = useState<number | null>(
    state && state.transaction ? state.transaction.transactionExRate : null
  );
  const [quantity, setQuantity] = useState<number | null>(
    state && state.transaction ? state.transaction.quantity : null
  );
  const [tax, setTax] = useState<number | null>(
    state && state.transaction ? state.transaction.tax : null
  );
  const [commission, setCommission] = useState<number | null>(
    state && state.transaction ? state.transaction.commission : null
  );
  const [date, setDate] = useState<string | null>(
    state && state.transaction ? datetimeToDate(state.transaction.date) : null
  );
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(
    state && state.transaction ? state.transaction.transactionNote : null
  );

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
      (transactionType === null && action === Actions.ADD) ||
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
    action,
  ]);

  const onConfirm = useMemo(
    () =>
      action === Actions.ADD
        ? async () => {
            if (
              price !== null &&
              quantity !== null &&
              tax !== null &&
              commission !== null &&
              date !== null &&
              transactionType !== null
            ) {
              await createStockTransaction(authToken, Number(ownerId), {
                stock_id: (stock as Stock).stockId,
                price,
                quantity,
                tax,
                commission,
                date: dateToDatetime(date),
                transaction_type: transactionType,
                transaction_note: note,
                transaction_ex_rate: exRate,
              });
              history.push(
                `/transaction/${ownerId}/stock/${(stock as Stock).stockId}`
              );
            }
          }
        : async () => {
            if (
              state &&
              state.transaction &&
              price !== null &&
              quantity !== null &&
              tax !== null &&
              commission !== null &&
              date !== null
            ) {
              await modifyStockTransaction(authToken, {
                stock_transaction_id: state.transaction.stockTransactionId,
                price,
                quantity,
                tax,
                commission,
                date: dateToDatetime(date),
                transaction_note: note,
                transaction_ex_rate: exRate,
              });

              history.push(
                `/transaction/${ownerId}/stock/${state.transaction.stockId}`
              );
            }
          },
    [
      action,
      authToken,
      commission,
      date,
      exRate,
      history,
      note,
      ownerId,
      price,
      quantity,
      state,
      stock,
      tax,
      transactionType,
    ]
  );

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
            value={price}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Price: "
            inputType="text"
            name="price"
            onChange={mustBePositiveNumber("Price", setPrice, setPriceHint)}
            hint={priceHint}
          />
          <Input
            value={exRate}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Exchange Rate: "
            inputType="text"
            name="exchange_rate"
            onChange={mustBePositiveNumber(
              "Exchange rate",
              setExRate,
              setExRateHint
            )}
            hint={exRateHint}
          />
          <Input
            value={quantity}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Quantity: "
            inputType="text"
            name="quantity"
            onChange={mustBePositiveInteger(
              "Quantity",
              setQuantity,
              setQuantityHint
            )}
            hint={quantityHint}
          />
          <Input
            value={tax}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Tax: "
            inputType="text"
            name="tax"
            onChange={mustBePositiveNumber("Tax", setTax, setTaxHint)}
            hint={taxHint}
          />
          <Input
            value={commission}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Commission: "
            inputType="text"
            name="commission"
            onChange={mustBePositiveNumber(
              "Commission",
              setCommission,
              setCommissionHint
            )}
            hint={commissionHint}
          />
          <Input
            value={date}
            className={classnames(style.Input, style.Parameter, style.Mobile)}
            label="Date: "
            inputType="date"
            name="date"
            onChange={setDate}
          />

          {action === Actions.ADD && (
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
          )}

          <div className={style.TransactionNotes}>
            <label htmlFor="note">Notes: </label>
            <textarea
              value={note ? note : ""}
              onChange={(e) => setNote(e.target.value)}
              name="note"
              cols={40}
              rows={10}
            />
          </div>

          <div className={style.ActionButtons}>
            <Button onClick={() => history.goBack()}>Cancel</Button>
            <Button disabled={confirmedDisabled} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AddStockTransactionPage;
