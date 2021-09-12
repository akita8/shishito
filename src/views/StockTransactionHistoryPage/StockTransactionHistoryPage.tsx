import { UserToken } from "../../api/types";
import style from "./StockTransactionHistoryPage.module.scss";

interface StockTransactionHistoryPageProps {
  authToken: UserToken;
}

const StockTransactionHistoryPage = ({
  authToken,
}: StockTransactionHistoryPageProps) => (
  <div className={style.StockTransactionHistoryPage}></div>
);

export default StockTransactionHistoryPage;
