import { useState, useRef, useCallback } from "react";

import "./styles/input.styles.css";

export default function Input({
  label,
  name,
  id,
  value,
  titleError,
  hasError,
  placeHolder,
  handleOnChange,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className="wrap-field-label">
      <label className={isFocused ? "label-form on" : "label-form"}>
        {label}
      </label>
      <input
        ref={inputRef}
        className={
          hasError
            ? "default-input-text form-control default-input-text-invalid"
            : "default-input-text form-control"
        }
        type="text"
        name={name}
        id={id}
        value={value}
        placeholder={placeHolder}
        onChange={(e) => handleOnChange(e)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
      <div className={hasError ? "invalid-feedback-show" : "invalid-feedback"}>
        {titleError}
      </div>
    </div>
  );
}
