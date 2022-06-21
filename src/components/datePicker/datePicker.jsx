import React, { useState, useRef, useCallback, useEffect } from 'react';

import './styles/datePicker.styles.css';

export default function DatePicker({
  label,
  name,
  type,
  id,
  defaultValue,
  titleError,
  hasError,
  placeHolder,
  handleOnChange,
  getSelectedDate,
  ...rest
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    getSelectedDate(selectedDate);
  }, [selectedDate]);

  const handleDateSelected = (e) => {
    setSelectedDate(e);
  };

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className="wrap-field-label">
      <label className={isFocused ? 'label-form on' : 'label-form'}>
        {label}
      </label>
      <input
        ref={inputRef}
        className={
          hasError
            ? 'default-input-text form-control default-input-text-invalid'
            : 'default-input-text form-control'
        }
        name={name}
        type={type}
        id={id}
        defaultValue={
          type === 'month'
            ? defaultValue.getMonth() + 1 < 10
              ? defaultValue.getFullYear() +
                '-' +
                '0' +
                (defaultValue.getMonth() + 1)
              : defaultValue.getFullYear() + '-' + (defaultValue.getMonth() + 1)
            : defaultValue
        }
        onChange={(e) => handleDateSelected(e)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
      <div className={hasError ? 'invalid-feedback-show' : 'invalid-feedback'}>
        {titleError}
      </div>
    </div>
  );
}
