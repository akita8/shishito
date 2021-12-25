import { useState } from "react";
import { useHistory } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";

import { updateStocks } from "../../api/stocks";
import { BankAccount, UserToken } from "../../api/types";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

import style from "./IndexPage.module.scss";

interface IndexPageProps {
  accounts: BankAccount[];
  authToken: UserToken;
}

const IndexPage = ({ accounts, authToken }: IndexPageProps) => {
  const history = useHistory();
  const [updatingStocks, setUpdatingStocks] = useState(false);
  return (
    <div className={style.IndexPage}>
      <div className={style.UpdateStocks}>
        {updatingStocks ? (
          <ClipLoader color="black" loading size={30} />
        ) : (
          <Button
            onClick={async () => {
              setUpdatingStocks(true);
              await updateStocks(authToken);
              setUpdatingStocks(false);
            }}
          >
            Update Stocks and Currencies
          </Button>
        )}
      </div>
      <div className={style.Accounts}>
        {accounts.map((a) => (
          <Card key={a.accountId} className={style.Card}>
            <header>
              <span className={style.Bank}>{a.bankName}</span>
              <span className={style.AccountNumber}>{a.accountNumber}</span>
            </header>
            <div className={style.Buttons}>
              {a.owners.map((o) => (
                <Button
                  key={o.ownerId}
                  onClick={() => history.push(`/traded/${o.ownerId}`)}
                >
                  {o.name}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
