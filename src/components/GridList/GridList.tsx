import classnames from "classnames";
import style from "./GridList.module.scss";

export interface GridCell {
  field: string;
  value: string | JSX.Element;
}

interface GridListProps {
  cells: GridCell[];
  className?: string;
}

export const GridList = ({ cells, className }: GridListProps) => (
  <ul className={classnames(style.GridList, className)}>
    {cells.map((e) => (
      <li key={e.field}>
        <span className={style.Field}>{e.field}: </span>
        <span className={style.Value}>{e.value}</span>
      </li>
    ))}
  </ul>
);
