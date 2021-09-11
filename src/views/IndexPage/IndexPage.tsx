import { useHistory } from "react-router";
import { BankAccount } from "../../api/types";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

import style from "./IndexPage.module.scss";

interface IndexPageProps {
  accounts: BankAccount[];
}

const IndexPage = ({ accounts }: IndexPageProps) => {
  const history = useHistory();
  return (
    <div className={style.IndexPage}>
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
  );
};

export default IndexPage;
