import { useState } from "react";
import classnames from 'classnames'

import { Card } from "../Card";
import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg";
import { ReactComponent as ChevronUp } from "../../icons/chevron-up.svg";
import { ReactComponent as InformationCircle } from "../../icons/information-circle.svg";

import style from "./Accordion.module.scss";

export interface ExpandableRowProps {
  id?: number;
  title: string | JSX.Element;
  component: JSX.Element;
  onMoreInfo?: () => void;
}

interface AccordionProps {
  rows: ExpandableRowProps[];
  className?: string;
}

const ExpandableRow = ({
  title,
  component,
  onMoreInfo,
}: ExpandableRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className={style.ExpandableRow}>
      <Card className={style.TitleCard}>
        <h3 onClick={() => setIsOpen(!isOpen)}>{title}</h3>
        <span className={style.ActionIcons}>
          {onMoreInfo && (
            <InformationCircle
              onClick={onMoreInfo}
              className={style.MoreInfoIcon}
            />
          )}
          <span
            className={style.IconWrapper}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUp className={style.Icon} />
            ) : (
              <ChevronDown className={style.Icon} />
            )}
          </span>
        </span>
      </Card>
      {isOpen && <Card className={style.ExpandedCard}>{component}</Card>}
    </li>
  );
};

export const Accordion = ({ rows, className }: AccordionProps) => {
  return (
    <ul className={classnames(style.Accordion, className)}>
      {rows.map((r) => (
        <span key={r.id}>
          <ExpandableRow {...r} />
        </span>
      ))}
    </ul>
  );
};
