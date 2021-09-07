import classnames from "classnames";

import { ReactComponent as TrendingUp } from "../../icons/trending-up.svg";
import { ReactComponent as TrendingDown } from "../../icons/trending-down.svg";

import style from "./TrendingNumber.module.scss";

interface TrendingNumberProps {
  value: string;
  positive: boolean;
}

export const TrendingNumber = ({ value, positive }: TrendingNumberProps) => (
  <span
    className={classnames(
      style.TrendingNumber,
      positive ? style.Positive : style.Negative
    )}
  >
    <span className={style.Value}>{value}</span>
    {positive ? (
      <TrendingUp className={style.Icon} />
    ) : (
      <TrendingDown className={style.Icon} />
    )}
  </span>
);
