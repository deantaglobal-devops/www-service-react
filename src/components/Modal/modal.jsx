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
  listData,
  button1Text,
  handleButton1Modal = () => {},
  Button2Text,
  handleButton2Modal = () => {},
  Button3Text,
  handleButton3Modal = () => {},
  linkArticle = () => {},
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
        {listData?.length > 0 ? (
          listData.map((data, index) => {
            return (
              <div
                key={`key-${index}`}
                className="row link-list-container px-0"
              >
                <div className="col-9 link-list-view">
                  {data.articleId} - {data.chapterTitle}
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary mr-2 float-right cstm-link-btn p-1 px-2"
                    onClick={() => linkArticle(data.chapterID)}
                  >
                    <i className="material-icons-outlined cstm-link-icon px-1">
                      link
                    </i>{" "}
                    Link
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 no-data-link">No data</div>
        )}
        <div className="modal-footer-container">
          {button1Text && (
            <button
              type="button"
              className="btn-container modal-cancel-button-container"
              onClick={() => handleButton1Modal()}
            >
              {button1Text}
            </button>
          )}
          {Button2Text && (
            <button
              type="button"
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
              type="button"
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
