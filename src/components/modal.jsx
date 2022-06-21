import React from "react";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.setModalWrapper = this.setModalWrapper.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  setModalWrapper(node) {
    this.modalWrapper = node;
  }

  handleClickOutside(event) {
    if (this.modalWrapper && !this.modalWrapper.contains(event.target)) {
      this.props.closeModal();
    }
  }

  render() {
    return (
      <div
        className="deanta-modal"
        id="deanta-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
      >
        <div
          className={`${
            this.props.modalInSlider
              ? "deanta-modal-dialog-slider"
              : "deanta-modal-dialog"
          }`}
          role="document"
        >
          <div className="deanta-modal-content">
            <div className="deanta-modal-header">
              <h5 className="deanta-modal-title" id="ModalLabel">
                {this.props.title}
              </h5>
              <button
                onClick={() => this.props.closeModal()}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="deanta-modal-body">{this.props.body}</div>
            {this.props.footer && (
              <div className="deanta-modal-footer">{this.props.footer}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
