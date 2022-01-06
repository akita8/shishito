import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.scss";

import {
  createStockAlert,
  deleteStockAlert,
  deleteStockTransaction,
  fetchStockAlert,
  fetchStockTransactions,
  fetchTradedStock,
  updateStockAlert,
} from "../../api/stocks";
import {
  StockAlert,
  StockAlertUpdatePayload,
  StockAlertCreationPayload,
  StockTransaction,
  TradedStock,
  UserToken,
  AlertFields,
} from "../../api/types";
import { Button } from "../../components/Button";
import { Header, Row, SortOrder, Table } from "../../components/Table";
import { ReactComponent as Plus } from "../../icons/plus.svg";
import { ReactComponent as Pencil } from "../../icons/pencil.svg";
import { ReactComponent as Trash } from "../../icons/trash.svg";

import style from "./StockTransactionHistoryPage.module.scss";
import { datetimeToDate, dateToDatetime } from "../../utils";
import { TradedStockGrid } from "../TradedAssetsPage/TradedAssetsPage";
import { Input } from "../../components/Input";
import {
  mustBeNumber,
  mustBePositiveNumber,
} from "../../components/Input/Input";
import { Bell } from "../../components/Bell";

interface StockTransactionHistoryPageProps {
  authToken: UserToken;
  baseCurrency: string;
}

interface AlertFormProps {
  alert: StockAlert | null;
  onUpdate: (alert: StockAlertUpdatePayload) => void;
  onCreate: (alert: StockAlertCreationPayload) => void;
  onDelete: (id: number) => void;
}

const AlertForm = ({ alert, onUpdate, onCreate, onDelete }: AlertFormProps) => {
  const { ownerId, stockId } =
    useParams<{ ownerId: string; stockId: string }>();

  const [lowerLimitPrice, setLowerLimitPrice] = useState<number | null>(
    alert ? alert.lowerLimitPrice : null
  );
  const [upperLimitPrice, setUpperLimitPrice] = useState<number | null>(
    alert ? alert.upperLimitPrice : null
  );
  const [dividendDate, setDividendDate] = useState<string | null>(
    alert && alert.dividendDate ? datetimeToDate(alert.dividendDate) : null
  );
  const [fiscalPriceLowerThan, setFiscalPriceLowerThan] = useState<
    boolean | null
  >(alert ? alert.fiscalPriceLowerThan : null);
  const [fiscalPriceGreaterThan, setFiscalPriceGreaterThan] = useState<
    boolean | null
  >(alert ? alert.fiscalPriceGreaterThan : null);
  const [profitAndLossLowerLimit, setProfitAndLossLowerLimit] = useState<
    number | null
  >(alert ? alert.profitAndLossLowerLimit : null);
  const [profitAndLossUpperLimit, setProfitAndLossUpperLimit] = useState<
    number | null
  >(alert ? alert.profitAndLossUpperLimit : null);

  const [lowerLimitPriceHint, setLowerLimitPriceHint] = useState("");
  const [upperLimitPriceHint, setUpperLimitPriceHint] = useState("");
  const [profitAndLossLowerLimitHint, setProfitAndLossLowerLimitHint] =
    useState("");
  const [profitAndLossUpperLimitHint, setProfitAndLossUpperLimitHint] =
    useState("");

  const isSame =
    lowerLimitPrice === (alert && alert.lowerLimitPrice) &&
    upperLimitPrice === (alert && alert.upperLimitPrice) &&
    dividendDate ===
      (alert &&
        alert.dividendDate &&
        datetimeToDate(alert.dividendDate as string)) &&
    fiscalPriceLowerThan === (alert && alert.fiscalPriceLowerThan) &&
    fiscalPriceGreaterThan === (alert && alert.fiscalPriceGreaterThan) &&
    profitAndLossLowerLimit === (alert && alert.profitAndLossLowerLimit) &&
    profitAndLossUpperLimit === (alert && alert.profitAndLossUpperLimit);

  const inValid =
    lowerLimitPriceHint !== "" ||
    upperLimitPriceHint !== "" ||
    profitAndLossLowerLimitHint !== "" ||
    profitAndLossUpperLimitHint !== "";

  const makeLabel = useCallback(
    (label: string, field: AlertFields) =>
      alert?.triggeredFields.includes(field) ? (
        <span className={style.AlertLabel}>
          <span>{label}</span>
          <Bell warning={alert.triggeredFields.length > 0} />
        </span>
      ) : (
        label
      ),
    [alert]
  );

  return (
    <section className={style.AlertForm}>
      <Input
        className={style.Input}
        value={lowerLimitPrice}
        label={makeLabel("Lower Limit Price", AlertFields.lowerLimitPrice)}
        inputType="text"
        name="lower-limit-price"
        onChange={mustBePositiveNumber(
          "Lower limit price",
          setLowerLimitPrice,
          setLowerLimitPriceHint,
          true
        )}
        hint={lowerLimitPriceHint}
      />
      <Input
        className={style.Input}
        value={upperLimitPrice}
        label={makeLabel("Upper Limit Price", AlertFields.upperLimitPrice)}
        inputType="text"
        name="upper-limit-price"
        onChange={mustBePositiveNumber(
          "Upper limit price",
          setUpperLimitPrice,
          setUpperLimitPriceHint,
          true
        )}
        hint={upperLimitPriceHint}
      />
      <Input
        className={style.Input}
        value={dividendDate}
        label={makeLabel("Dividend Date", AlertFields.dividendDate)}
        inputType="date"
        name="date"
        onChange={setDividendDate}
      />
      <span className={style.Checkbox}>
        <input
          type="checkbox"
          id="fiscal-price-lower-than"
          name="fiscal-price-lower-than"
          checked={Boolean(fiscalPriceLowerThan)}
          onChange={() => setFiscalPriceLowerThan(!fiscalPriceLowerThan)}
        />
        <label htmlFor="fiscal-price-lower-than">
          {makeLabel(
            "Fiscal Price lower than price",
            AlertFields.fiscalPriceLowerThan
          )}
        </label>
      </span>
      <span>
        <input
          type="checkbox"
          id="fiscal-price-greater-than"
          name="fiscal-price-greater-than"
          checked={Boolean(fiscalPriceGreaterThan)}
          onChange={() => setFiscalPriceGreaterThan(!fiscalPriceGreaterThan)}
        />
        <label htmlFor="fiscal-price-greater-than">
          {makeLabel(
            "Fiscal Price greater than price",
            AlertFields.fiscalPriceGreaterThan
          )}
        </label>
      </span>
      <Input
        className={style.Input}
        value={profitAndLossLowerLimit}
        label={makeLabel(
          "Profit and Loss lower limit",
          AlertFields.profitAndLossLowerLimit
        )}
        inputType="text"
        name="profit-and-loss-lower-limit"
        onChange={mustBeNumber(
          "Profit and Loss lower limit",
          setProfitAndLossLowerLimit,
          setProfitAndLossLowerLimitHint,
          true
        )}
        hint={profitAndLossLowerLimitHint}
      />
      <Input
        className={style.Input}
        value={profitAndLossUpperLimit}
        label={makeLabel(
          "Profit and Loss upper limit",
          AlertFields.profitAndLossUpperLimit
        )}
        inputType="text"
        name="profit-and-loss-upper-limit"
        onChange={mustBeNumber(
          "Profit and Loss upper limit",
          setProfitAndLossUpperLimit,
          setProfitAndLossUpperLimitHint,
          true
        )}
        hint={profitAndLossUpperLimitHint}
      />
      <span className={style.Buttons}>
        {alert !== null && (
          <Button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this alert?")
              ) {
                onDelete(alert.stockAlertId);
              }
            }}
          >
            Delete
          </Button>
        )}
        <Button
          disabled={isSame || inValid}
          onClick={() => {
            if (alert !== null) {
              onUpdate({
                stock_alert_id: alert.stockAlertId,
                lower_limit_price: lowerLimitPrice,
                upper_limit_price: upperLimitPrice,
                dividend_date: dividendDate && dateToDatetime(dividendDate),
                fiscal_price_lower_than: fiscalPriceLowerThan,
                fiscal_price_greater_than: fiscalPriceGreaterThan,
                profit_and_loss_lower_limit: profitAndLossLowerLimit,
                profit_and_loss_upper_limit: profitAndLossUpperLimit,
              });
            } else {
              onCreate({
                stock_id: Number(stockId),
                owner_id: Number(ownerId),
                lower_limit_price: lowerLimitPrice,
                upper_limit_price: upperLimitPrice,
                dividend_date: dividendDate && dateToDatetime(dividendDate),
                fiscal_price_lower_than: fiscalPriceLowerThan,
                fiscal_price_greater_than: fiscalPriceGreaterThan,
                profit_and_loss_lower_limit: profitAndLossLowerLimit,
                profit_and_loss_upper_limit: profitAndLossUpperLimit,
              });
            }
          }}
        >
          {alert === null ? "Create" : "Update"}
        </Button>
      </span>
    </section>
  );
};

const StockTransactionHistoryPage = ({
  authToken,
  baseCurrency,
}: StockTransactionHistoryPageProps) => {
  const history = useHistory();
  const { ownerId, stockId } =
    useParams<{ ownerId: string; stockId: string }>();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [stock, setStock] = useState<TradedStock | null>(null);
  const [alert, setAlert] = useState<StockAlert | null>(null);
  const [showAlertForm, setShowAlertForm] = useState(false);

  useEffect(() => {
    void (async () => {
      setStock(
        await fetchTradedStock(authToken, Number(ownerId), Number(stockId))
      );
    })();
  }, [authToken, stockId, ownerId]);

  useEffect(() => {
    void (async () => {
      const retrievedTransactions = await fetchStockTransactions(
        authToken,
        Number(ownerId),
        Number(stockId)
      );
      setTransactions(
        retrievedTransactions.sort((a, b) => a.date.localeCompare(b.date))
      );
    })();
  }, [authToken, ownerId, stockId]);

  useEffect(() => {
    void (async () => {
      try {
        const retrievedAlert = await fetchStockAlert(
          authToken,
          Number(ownerId),
          Number(stockId)
        );
        setAlert(retrievedAlert);
        setShowAlertForm(true);
      } catch (_) {
        setAlert(null);
      }
    })();
  }, [authToken, ownerId, stockId]);

  const onSort = useCallback(
    (order: SortOrder) => {
      const sortedTransactions = [...transactions].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      if (!order.ascending) {
        sortedTransactions.reverse();
      }
      setTransactions(sortedTransactions);
    },
    [transactions]
  );

  const headers = useMemo<Header[]>(
    () => [
      { label: "Date", onSort },
      { label: "Price" },
      { label: "Quantity" },
      { label: "Tax" },
      { label: "Commission" },
      { label: "Type" },
      { label: "Note" },
      { label: "Exchange Rate" },
    ],
    [onSort]
  );

  const rows = useMemo<Row<number | string | null>[]>(
    () =>
      transactions.map((t) => ({
        id: t.stockTransactionId,
        cells: [
          datetimeToDate(t.date),
          t.price,
          t.quantity,
          t.tax,
          t.commission,
          t.transactionType,
          t.transactionNote,
          t.transactionExRate,
        ],
      })),
    [transactions]
  );

  const actionButtons = useMemo(
    () => (
      <section className={style.ActionButtons}>
        <Button
          onClick={() =>
            history.push(`/transaction/${ownerId}/add/stock/${stockId}`)
          }
        >
          <span>Add</span>
          <Plus className={style.Icon} />
        </Button>
        {selectedIds.length === 1 && (
          <Button
            onClick={() =>
              history.push(`/transaction/${ownerId}/modify/stock/${stockId}`, {
                transaction: transactions.find(
                  (t) => t.stockTransactionId === selectedIds[0]
                ),
              })
            }
          >
            <span>Modify</span>
            <Pencil className={style.Icon} />
          </Button>
        )}
        {selectedIds.length === 1 && (
          <Button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to delete this transaction?"
                )
              ) {
                await deleteStockTransaction(authToken, selectedIds[0]);
                const idIndex = transactions.findIndex(
                  (t) => t.stockTransactionId === selectedIds[0]
                );
                const newTransactions = [...transactions];
                newTransactions.splice(idIndex, 1);
                setTransactions(newTransactions);
                setSelectedIds([]);
                // TODO handle cancellation of last transaction
              }
            }}
          >
            <span>Delete</span>
            <Trash className={style.Icon} />
          </Button>
        )}
        {/* {selectedIds.length >= 1 && (
          <Button onClick={() => null}>
            <span>Move</span>
            <ArrowRight className={style.Icon} />
          </Button>
        )} */}
      </section>
    ),
    [authToken, history, ownerId, selectedIds, stockId, transactions]
  );

  return (
    <div className={style.StockTransactionHistoryPage}>
      {stock && <TradedStockGrid stock={stock} baseCurrency={baseCurrency} />}
      <Tabs selectedTabClassName={style.SelectedTab}>
        <TabList className={style.Tabs}>
          <Tab>Transactions History</Tab>
          <Tab>Alerts</Tab>
        </TabList>

        <TabPanel>
          {actionButtons}
          <Table
            headers={headers}
            rows={rows}
            onRowSelection={setSelectedIds}
          />
        </TabPanel>
        <TabPanel className={style.AlertTab}>
          {showAlertForm ? (
            <AlertForm
              alert={alert}
              onUpdate={async (p) =>
                setAlert(await updateStockAlert(authToken, p))
              }
              onCreate={async (p) =>
                setAlert(await createStockAlert(authToken, p))
              }
              onDelete={async (id) => {
                await deleteStockAlert(authToken, id);
                setAlert(null);
                setShowAlertForm(false);
              }}
            />
          ) : (
            <section className={style.NoAlert}>
              <span>There is no alert set for this stock</span>
              <Button onClick={() => setShowAlertForm(true)}>Create It</Button>
            </section>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StockTransactionHistoryPage;
