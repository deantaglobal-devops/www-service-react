import { useState, useRef, useCallback, useEffect } from "react";

import "./styles/dropdown.styles.css";

export default function Dropdown({
  label,
  name,
  value,
  id,
  valuesDropdown,
  handleOnChange,
  hasError,
  titleError,
  placeholder,
  iconName,
  iconClassName,
  uniqKey,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutsideStartTime(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutsideStartTime);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutsideStartTime);
    };
  }, [dropdownRef]);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSelectedValue = (e) => {
    handleOnChange(e);
    setShowDropdown(false);
  };

  return (
    <div className="wrap-field-label">
      <label className={isFocused ? "label-form on" : "label-form"}>
        {label}
      </label>
      <div
        className={isFocused ? "content-select active" : "content-select"}
        ref={dropdownRef}
      >
        <div className="content-select-input" onClick={() => handleDropdown()}>
          <input
            className="default-input-select"
            type="text"
            name="inputDropdown"
            value={value}
            id={id}
            placeholder={placeholder}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            key={uniqKey}
            readOnly
          />
          <i className={iconClassName}>{iconName}</i>
        </div>
        <div
          className={hasError ? "invalid-feedback-show" : "invalid-feedback"}
        >
          {titleError}
        </div>
        {/* <!-- WE NEED REVIEW IT --> */}
        <div
          className={
            showDropdown
              ? "content-select-options content-select-options-show"
              : "content-select-options"
          }
        >
          <ul className="options">
            {valuesDropdown?.map((value, index) => (
              <li
                key={value?.id === undefined ? index : value?.id}
                name={name}
                value={value?.value}
                data-value={value?.value}
                data-id={JSON.stringify({
                  id: value?.id ? value?.id : index,
                  value: value?.value,
                })}
                onClick={(e) => handleSelectedValue(e)}
              >
                {value?.labelDropdown ? value?.labelDropdown : value?.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
