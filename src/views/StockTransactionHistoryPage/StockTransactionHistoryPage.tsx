import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  deleteStockTransaction,
  fetchStockTransactions,
} from "../../api/stocks";
import { StockTransaction, UserToken } from "../../api/types";
import { Button } from "../../components/Button";
import { Header, Row, SortOrder, Table } from "../../components/Table";
import { ReactComponent as Plus } from "../../icons/plus.svg";
import { ReactComponent as Pencil } from "../../icons/pencil.svg";
import { ReactComponent as Trash } from "../../icons/trash.svg";
//import { ReactComponent as ArrowRight } from "../../icons/arrow-right.svg";

import style from "./StockTransactionHistoryPage.module.scss";
import { datetimeToDate } from "../../utils";

interface StockTransactionHistoryPageProps {
  authToken: UserToken;
}

const StockTransactionHistoryPage = ({
  authToken,
}: StockTransactionHistoryPageProps) => {
  const history = useHistory();
  const { ownerId, stockId } =
    useParams<{ ownerId: string; stockId: string }>();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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

  return (
    <div className={style.StockTransactionHistoryPage}>
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
      <Table headers={headers} rows={rows} onRowSelection={setSelectedIds} />
    </div>
  );
};

export default StockTransactionHistoryPage;
