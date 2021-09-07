import { useState } from "react";

import { Card } from "../Card";
import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg";
import { ReactComponent as ChevronUp } from "../../icons/chevron-up.svg";

import style from "./Accordion.module.scss";

interface ExpandableRowProps {
  id?: number;
  title: string;
  component: JSX.Element;
}

interface AccordionProps {
  rows: ExpandableRowProps[];
  className?: string;
}

const ExpandableRow = ({ title, component }: ExpandableRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className={style.ExpandableRow}>
      <Card className={style.TitleCard}>
        <h3 onClick={() => setIsOpen(!isOpen)}>{title}</h3>
        <span className={style.IconWrapper} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronUp className={style.Icon} />
          ) : (
            <ChevronDown className={style.Icon} />
          )}
        </span>
      </Card>
      {isOpen && <Card className={style.ExpandedCard}>{component}</Card>}
    </li>
  );
};

export const Accordion = ({ rows, className }: AccordionProps) => {
  return (
    <ul className={className}>
      {rows.map((r) => (
        <span key={r.id}>
          <ExpandableRow title={r.title} component={r.component} key={r.id} />
        </span>
      ))}
    </ul>
  );
};
