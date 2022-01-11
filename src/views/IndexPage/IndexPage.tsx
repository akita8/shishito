import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchAccounts } from "../../api/account";

import { updateStocks } from "../../api/stocks";
import { BankAccount, UserToken } from "../../api/types";
import { Bell } from "../../components/Bell";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

import style from "./IndexPage.module.scss";

interface IndexPageProps {
  authToken: UserToken;
  baseCurrency: string;
}

const IndexPage = ({ authToken, baseCurrency }: IndexPageProps) => {
  const history = useHistory();
  const [updatingStocks, setUpdatingStocks] = useState(false);
  const [accounts, setAccount] = useState<BankAccount[] | null>(null);

  useEffect(() => {
    if (authToken) {
      void (async () => {
        setAccount(await fetchAccounts(authToken))
      })();
    }
  }, [authToken])

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currency: baseCurrency.toUpperCase(),
      }),
    [baseCurrency]
  );

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
              setAccount(await fetchAccounts(authToken))
              setUpdatingStocks(false);
            }}
          >
            Update Stocks and Currencies
          </Button>
        )}
      </div>
      <div className={style.Accounts}>
        {accounts ? accounts.map((a) => (
          <Card key={a.accountId} className={style.Card}>
            <header>
              <span className={style.Bank}>{a.bankName}</span>
              <span className={style.AccountNumber}>{a.accountNumber}</span>
              <span className={style.AccountCtv}>
                {currencyFormatter.format(a.currentStockCtv)}
              </span>
            </header>
            <div className={style.Buttons}>
              {a.owners.map((o) => (
                <span>
                  {
                    o.hasTriggeredAlerts &&
                    <Bell warning /> 
                  }
                  <Button
                    key={o.ownerId}
                    onClick={() => history.push(`/traded/${o.ownerId}`)}
                  >
                    {o.name}
                  </Button>
                </span>
              ))}
            </div>
          </Card>
        )): <></>}
      </div>
    </div>
  );
};

export default IndexPage;
