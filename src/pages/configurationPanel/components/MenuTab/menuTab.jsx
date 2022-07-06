import { useState, useRef, useCallback, useEffect } from "react";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import Modal from "../../../../components/Modal/modal";

import "./styles/menuTab.styles.css";

export default function MenuTab({ ...props }) {
  const [isHover, setIsHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(props.text);
  const [oldInputValue, setOldinputValue] = useState(props.text);
  const [isFocused, setIsFocused] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const inputRef = useRef(null);

  // If active add class.
  let isActive = "";
  if (props.active) {
    isActive = props.active;
  }

  function onClick() {
    if (typeof props.onClick !== "function") {
      console.error(
        `You need to pass a function as a Prop.
					eg. () => myFunction()

					eg. <MenuTab onClick={() => myFunction()}/>
				`,
      );
      return;
    }

    props.onClick();
  }

  const handleIconMouseevent = (e) => {
    if (e.type === "mouseleave") {
      setIsHover(false);
    } else {
      setIsHover(true);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e?.target;
    setInputValue(value);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
  };

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <>
      {showDeleteModal && (
        <Modal
          displayModal={showDeleteModal}
          closeModal={closeModals}
          title="Delete Role"
          body="Are you sure you want to delete this role?"
          button1Text="Cancel"
          handleButton1Modal={() => closeModals()}
          Button2Text="Confirm"
          handleButton2Modal={(e) => {
            props.handleDeleteRole(e, props.id);
            closeModals();
          }}
        />
      )}
      <button
        onClick={() => onClick()}
        className={`tab w-100 m-0 p-0 menuTabBar-permission ${
          props.active ? `${isActive} icon-text-bold active` : "icon-text"
        } MenuTab_tab `}
        onMouseEnter={(e) => handleIconMouseevent(e)}
        onMouseLeave={(e) => {
          handleIconMouseevent(e);
        }}
      >
        <div className="title-container">
          {isEditing ? (
            <>
              <div className="wrap-field-label m-0 p-0">
                <label className={isFocused ? "label-form on" : "label-form"}>
                  Role Name
                </label>
                <input
                  ref={inputRef}
                  className="default-input-text form-control"
                  type="text"
                  name="roleName"
                  id="roleName"
                  value={inputValue}
                  onChange={(e) => handleOnChange(e)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{ marginBottom: `${12}px` }}
                />
              </div>

              <div className="permissions-icons">
                <Tooltip content="Close" direction="top">
                  <i
                    className="material-icons-outlined"
                    onClick={(e) => {
                      setIsEditing(false);
                      setInputValue(oldInputValue);
                    }}
                  >
                    close
                  </i>
                </Tooltip>
                <Tooltip content="Save" direction="top">
                  <i
                    className="material-icons-outlined icon-save"
                    onClick={(e) => {
                      setIsEditing(false);
                      props.handleSaveEditRole(e, inputValue, props.id);
                    }}
                  >
                    save
                  </i>
                </Tooltip>
              </div>
            </>
          ) : (
            <span className="title">{inputValue}</span>
          )}

          {props.columnNumber == "1" && isHover && !isEditing && (
            <div className="permissions-icons">
              <Tooltip content="Rename" direction="top">
                <i
                  className="material-icons-outlined"
                  onClick={(e) => {
                    setIsEditing(true);
                  }}
                >
                  edit
                </i>
              </Tooltip>
              <Tooltip content="Duplicate" direction="top">
                <i
                  className="material-icons-outlined"
                  onClick={(e) => {
                    props.handleDuplicateButton(e, oldInputValue, props.id);
                  }}
                >
                  content_copy
                </i>
              </Tooltip>
              <Tooltip content="Remove" direction="top">
                <i
                  className="material-icons-outlined icon-remove"
                  onClick={(e) => setShowDeleteModal(true)}
                >
                  delete
                </i>
              </Tooltip>
            </div>
          )}
        </div>

        {props.secondColumn && (
          <span className="second_column">{props.secondColumn}</span>
        )}
      </button>
    </>
  );
}
