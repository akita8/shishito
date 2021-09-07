import { useCallback, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";

import style from "./LoginPage.module.scss";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const isInvalid = useMemo(
    () => username === "" || password === "",
    [username, password]
  );

  const handleEnterKeyPress = useCallback(
    (key: string) => {
      if (key === "Enter" && !isInvalid) {
        onLogin(username, password);
      }
    },
    [isInvalid, onLogin, password, username]
  );

  return (
    <div className={style.LoginPage}>
      <Card className={style.LoginCard}>
        <Input
          inputType="text"
          name="username"
          onChange={setUsername}
          onKeyPress={handleEnterKeyPress}
          label="Username:"
        />
        <Input
          inputType="password"
          name="password"
          onChange={setPassword}
          onKeyPress={handleEnterKeyPress}
          label="Password:"
        />
        <Button
          disabled={isInvalid}
          onClick={() => onLogin(username, password)}
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
