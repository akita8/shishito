import classNames from "classnames";
import style from "./Input.module.scss";

interface InputProps {
  inputType: string;
  name: string;
  label?: string;
  onChange: (value: string) => void;
  onKeyPress?: (key: string) => void;
  hint?: string;
  min?: string;
  placeholder?: string;
  className?: string;
}

export const Input = ({
  inputType,
  name,
  label,
  hint,
  placeholder,
  onChange,
  onKeyPress,
  className,
}: InputProps) => (
  <span className={classNames(style.Input, className)}>
    {label && <label htmlFor={name}>{label}</label>}
    <span className={style.InputGroup}>
      <input
        placeholder={placeholder}
        type={inputType}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => onKeyPress && onKeyPress(e.key)}
      />
      {hint && <span className={style.Hint}>{hint}</span>}
    </span>
  </span>
);
