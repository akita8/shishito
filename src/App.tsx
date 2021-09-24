import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Switch, Route } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { authenticateUser, fetchUser } from "./api/user";
import { fetchAccounts } from "./api/account";
import { BankAccount, User, UserToken } from "./api/types";
import { DefaultLayout } from "./components/DefaultLayout";

const IndexPage = lazy(() => import("./views/IndexPage/IndexPage"));
const LoginPage = lazy(() => import("./views/LoginPage/LoginPage"));
const TradedAssetsPage = lazy(
  () => import("./views/TradedAssetsPage/TradedAssetsPage")
);
const AddStockTransactionPage = lazy(
  () => import("./views/AddStockTransactionPage/AddStockTransactionPage")
);

const StockTransactionHistoryPage = lazy(
  () =>
    import("./views/StockTransactionHistoryPage/StockTransactionHistoryPage")
);

function App() {
  const [authToken, setAuthToken] = useState<UserToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccount] = useState<BankAccount[] | null>(null);
  const [failedAuth, setFailedAuth] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    if (authToken) {
      void (async () => {
        setUser(await fetchUser(authToken));
        setAccount(await fetchAccounts(authToken));
        history.push("/");
      })();
    } else history.push("/login");
  }, [authToken, history]);

  const index = useMemo(
    () => <>{accounts && user && <IndexPage accounts={accounts} />}</>,
    [accounts, user]
  );

  return (
    <Switch>
      <DefaultLayout username={user ? user.username : undefined}>
        <Suspense
          fallback={
            <div className="PageLoader">
              <ClipLoader color={"black"} loading size={150} />
            </div>
          }
        >
          <Route exact path="/">
            {index}
          </Route>
          <Route exact path="/login">
            <LoginPage
              onLogin={async (username, password) => {
                try {
                  const token = await authenticateUser(username, password);
                  setAuthToken(token);
                  setFailedAuth(false);
                } catch (error) {
                  setFailedAuth(true);
                }
              }}
              failedAuth={failedAuth}
            />
          </Route>
          <Route exact path="/traded/:ownerId">
            {authToken && user && (
              <TradedAssetsPage
                authToken={authToken}
                baseCurrency={user.baseCurrency}
              />
            )}
          </Route>
          <Route path="/transaction/:ownerId/:action/stock/:stockId?">
            {authToken && <AddStockTransactionPage authToken={authToken} />}
          </Route>
          <Route exact path="/transaction/:ownerId/stock/:stockId">
            {authToken && <StockTransactionHistoryPage authToken={authToken} />}
          </Route>
        </Suspense>
      </DefaultLayout>
    </Switch>
  );
}

export default App;
