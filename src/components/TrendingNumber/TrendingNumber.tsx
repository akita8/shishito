import classnames from "classnames";

import { ReactComponent as TrendingUp } from "../../icons/trending-up.svg";
import { ReactComponent as TrendingDown } from "../../icons/trending-down.svg";
import { ReactComponent as X } from "../../icons/x.svg";

import style from "./TrendingNumber.module.scss";

interface TrendingNumberProps {
  value: string;
  positive: boolean | null;
  className?: string;
}

export const TrendingNumber = ({
  value,
  positive,
  className,
}: TrendingNumberProps) => (
  <span
    className={classnames(
      style.TrendingNumber,
      positive === null
        ? style.Zero
        : positive
        ? style.Positive
        : style.Negative,
      className
    )}
  >
    <span className={style.Value}>{value}</span>
    {positive === null ? (
      <X className={style.Icon} />
    ) : positive ? (
      <TrendingUp className={style.Icon} />
    ) : (
      <TrendingDown className={style.Icon} />
    )}
  </span>
);
