import classNames from "classnames";
import { useEffect, useState } from "react";
import { parseDecimal } from "../../utils";
import style from "./Input.module.scss";

interface InputProps {
  inputType: string;
  name: string;
  label?: JSX.Element | JSX.Element[] | string;
  onChange: (value: string) => void;
  onKeyPress?: (key: string) => void;
  hint?: string;
  min?: string;
  placeholder?: string;
  className?: string;
  value?: string | number | null;
}

const validateNumber =
  (
    hint: string,
    setValue: (v: React.SetStateAction<number | null>) => void,
    setHint: (v: React.SetStateAction<string>) => void,
    setNullWhenEmpty?: boolean,
    additionalValidation?: (rawValue: string, value: number) => boolean
  ) =>
  (value: string) => {
    if (setNullWhenEmpty && value === "") {
      setValue(null);
      return;
    }
    const num = parseDecimal(value);
    const isValid = additionalValidation ? additionalValidation(value, num) : true
    if (value !== "" && !isNaN(num) && isValid) {
      setHint("");
      setValue(num);
    } else {
      setHint(hint);
      setValue(null);
    }
  };

export const mustBeNumber = (
  fieldName: string,
  setValue: (v: React.SetStateAction<number | null>) => void,
  setHint: (v: React.SetStateAction<string>) => void,
  setNullWhenEmpty?: boolean
) =>
  validateNumber(
    `${fieldName} must be a number`,
    setValue,
    setHint,
    setNullWhenEmpty
  );

export const mustBePositiveNumber = (
  fieldName: string,
  setValue: (v: React.SetStateAction<number | null>) => void,
  setHint: (v: React.SetStateAction<string>) => void,
  setNullWhenEmpty?: boolean
) =>
  validateNumber(
    `${fieldName} must be a positive number`,
    setValue,
    setHint,
    setNullWhenEmpty,
    (_, value) => value > 0
  );

export const mustBePositiveInteger = (
  fieldName: string,
  setValue: (v: React.SetStateAction<number | null>) => void,
  setHint: (v: React.SetStateAction<string>) => void,
  setNullWhenEmpty?: boolean
) =>
  validateNumber(
    `${fieldName} must be a positive integer`,
    setValue,
    setHint,
    setNullWhenEmpty,
    (rawValue, value) =>
      rawValue.indexOf(".") === -1 && rawValue.indexOf(",") === -1 && value > 0
  );

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
  const [innerValue, setInnerValue] = useState<string | number | undefined>();

  useEffect(() => {
    if (value === null) setInnerValue(undefined);
    else setInnerValue(value);
  }, [value]);

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
