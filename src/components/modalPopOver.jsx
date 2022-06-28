/* ModalPopOver Modal Component

*/
import React from 'react';
import SingleUserCard from './userList/singleUserCard';
import ListUsersControls from './userList/listUsersControls';

class ModalPopOver extends React.Component {
  constructor(props) {
    super(props);
    this.ESCcloseModal = this.ESCcloseModal.bind(this);
  }

  ESCcloseModal(event) {
    if (event.key === 'Escape') {
      this.props.closeModal();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.ESCcloseModal, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.ESCcloseModal, false);
  }

  render() {
    return (
      <>
        <div className="container">
          <header>
            {this.props.modalTitle && (
              <h3 className="title-popover">{this.props.modalTitle}</h3>
            )}
            <button
              className="close-button"
              onClick={() => this.props.closeModal()}
            >
              <i
                className="material-icons-outlined close-details"
                data-toggle="tooltip"
                data-placement="left"
                title="Close"
              >
                close
              </i>
            </button>
          </header>

          {this.props.children}
        </div>
        <div
          className="background"
          onClick={() => this.props.closeModal()}
        ></div>
      </>
    );
  }
}

export default ModalPopOver;
