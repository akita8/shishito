import classnames from "classnames";

import { ReactComponent as BellIcon } from "../../icons/bell.svg";

import style from "./Bell.module.scss";

interface BellProps {
  warning?: boolean;
}

export const Bell = ({ warning }: BellProps) => (
  <BellIcon
    className={classnames(style.Bell, {
      [style.WarningBell]: warning,
    })}
  />
);
