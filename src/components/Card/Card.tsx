import classnames from 'classnames'

import style from  "./Card.module.scss";

interface CardProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <section className={classnames(style.Card, className)}>{children}</section>
);
