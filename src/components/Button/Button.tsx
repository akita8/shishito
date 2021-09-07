import classNames from "classnames";
import style from "./Button.module.scss";

interface ButtonProps {
  children: JSX.Element | JSX.Element[] | string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const Button = ({
  children,
  disabled,
  onClick,
  className,
}: ButtonProps) => (
  <button
    className={classNames(style.Button, className)}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
