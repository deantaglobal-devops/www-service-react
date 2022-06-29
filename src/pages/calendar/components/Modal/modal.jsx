import React from 'react';
import './styles/modal.css';

export default function Modal({
  displayModal,
  closeModal = () => {},
  title,
  body,
  button1Text,
  handleButton1Modal = () => {},
  Button2Text,
  handleButton2Modal = () => {},
}) {
  const divStyle = {
    display: displayModal ? 'block' : 'none',
  };

  return (
    <div className="modal" onClick={closeModal} style={divStyle}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>

        <p className="modal-body">{body}</p>
        <div className="modal-footer">
          <button
            type="button"
            className="btn modal-cancel-button"
            onClick={() => handleButton1Modal()}
          >
            {button1Text}
          </button>
          <button
            type="button"
            className="btn modal-confirm-button"
            onClick={() => handleButton2Modal()}
          >
            {Button2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
