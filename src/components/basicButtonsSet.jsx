import React from "react";

class BasicDeleteButtonsSet extends React.Component {
  render() {
    return (
      <div className="deanta-button-container">
        <button
          className="deanta-button deanta-button-outlined"
          onClick={() => this.props.cancelButtonAction()}
        >
          {this.props.cancelButtonText ? this.props.cancelButtonText : "Cancel"}
        </button>
        <button
          className={`deanta-button deanta-button-outlined ${
            this.props.disableButtonAction ? "deanta-button-disabled" : ""
          } ${this.props.loadingButtonAction ? "deanta-button-loading" : ""}`}
          onClick={() =>
            !this.props.disableButtonAction && !this.props.loadingButtonAction
              ? this.props.buttonAction()
              : null
          }
        >
          {this.props.loadingButtonAction ? (
            <>
              <i className="material-icons">refresh</i> Saving
            </>
          ) : (
            this.props.actionText
          )}
        </button>
      </div>
    );
  }
}

export default BasicDeleteButtonsSet;
