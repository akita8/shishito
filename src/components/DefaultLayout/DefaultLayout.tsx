import classNames from "classnames";
import { Link } from "react-router-dom";

import style from "./DefaultLayout.module.scss";

interface DefaultLayoutProps {
  username?: string;
  children: JSX.Element | JSX.Element[];
  className?: string;
}

export const DefaultLayout = ({
  username,
  children,
  className,
}: DefaultLayoutProps) => (
  <div className={classNames(style.DefaultLayout, className)}>
    <header className={style.TopBar}>
      <Link to="/">
        <h1>Shishito</h1>
      </Link>
      {username && <span>{username}</span>}
    </header>
    <main>{children}</main>
  </div>
);
