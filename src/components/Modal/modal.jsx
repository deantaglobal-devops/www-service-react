import "./styles/modal.css";

export default function Modal({
  displayModal,
  closeModal = () => {},
  hideClose,
  title,
  body,
  content,
  loading,
  classCustom,
  button1Text,
  handleButton1Modal = () => {},
  Button2Text,
  handleButton2Modal = () => {},
  Button3Text,
  handleButton3Modal = () => {},
}) {
  const divStyle = {
    display: displayModal ? "block" : "none",
  };

  return (
    <div
      className={`modal-container ${classCustom}`}
      onClick={closeModal}
      style={divStyle}
    >
      <div
        className="modal-content-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-container">
          <strong>{title}</strong>
          {!hideClose && (
            <span className="close-container" onClick={closeModal}>
              &times;
            </span>
          )}
        </div>

        <p
          className="modal-body-container"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        {content && content}
        <div className="modal-footer-container">
          {button1Text && (
            <button
              className="btn-container modal-cancel-button-container"
              onClick={() => handleButton1Modal()}
            >
              {button1Text}
            </button>
          )}
          {Button2Text && (
            <button
              disabled={loading}
              className="btn-container deanta-button-outlined"
              onClick={() => handleButton2Modal()}
            >
              {!loading ? (
                Button2Text
              ) : (
                <>
                  <i className="material-icons-outlined loading-icon-button">
                    sync
                  </i>{" "}
                  Saving
                </>
              )}
            </button>
          )}
          {Button3Text && (
            <button
              className="btn-container deanta-button-outlined"
              onClick={() => handleButton3Modal()}
            >
              {Button3Text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
