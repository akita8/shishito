import classNames from "classnames";
import { useState } from "react";
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
  value?: string | number;
}

export const Input = ({
  inputType,
  name,
  label,
  hint,
  placeholder,
  value,
  onChange,
  onKeyPress,
  className,
}: InputProps) => {
  const [innerValue, setInnerValue] = useState(value);
  return (
    <span className={classNames(style.Input, className)}>
      {label && <label htmlFor={name}>{label}</label>}
      <span className={style.InputGroup}>
        <input
          value={innerValue}
          placeholder={placeholder}
          type={inputType}
          name={name}
          onChange={(e) => {
            setInnerValue(e.target.value);
            onChange(e.target.value);
          }}
          onKeyPress={(e) => onKeyPress && onKeyPress(e.key)}
        />
        {hint && <span className={style.Hint}>{hint}</span>}
      </span>
    </span>
  );
};
