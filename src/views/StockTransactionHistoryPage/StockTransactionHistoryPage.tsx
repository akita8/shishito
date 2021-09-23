import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { fetchStockTransactions } from "../../api/stocks";
import { StockTransaction, UserToken } from "../../api/types";
import { Header, Row, SortOrder, Table } from "../../components/Table";

import style from "./StockTransactionHistoryPage.module.scss";

interface StockTransactionHistoryPageProps {
  authToken: UserToken;
}

const StockTransactionHistoryPage = ({
  authToken,
}: StockTransactionHistoryPageProps) => {
  const { ownerId, stockId } =
    useParams<{ ownerId: string; stockId: string }>();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

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
      { label: "Date", onSort }, // TODO add sort
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
          t.date.split("T")[0],
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
      <Table
        headers={headers}
        rows={rows}
        onRowSelection={(ids) => console.log(ids)}
      />
    </div>
  );
};

export default StockTransactionHistoryPage;
