import React from 'react';
import BasicButtonsSet from './basicButtonsSet';

class FinishTemplateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTemplateId: null,
      showOptions: false,
      optionSelected: 'select a template',
    };
    this.setModalWrapper = this.setModalWrapper.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.go2MessagingTemplateArea = this.go2MessagingTemplateArea.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  setModalWrapper(node) {
    this.modalWrapper = node;
  }

  handleClickOutside(event) {
    if (this.modalWrapper && !this.modalWrapper.contains(event.target)) {
      this.closeModal();
    }
  }

  closeModal() {
    this.props.closeTemplateModal();
  }

  handleChange(newValue, selectedTemplateId) {
    this.setState({
      optionSelected: newValue,
      selectedTemplateId,
      showOptions: false,
    });
  }

  showOptions() {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  }

  go2MessagingTemplateArea() {
    this.props.go2MessagingCenterWithFinishTemplate(
      this.state.selectedTemplateId,
      // MODAL_DATA_PROPS.taskId,
      // MODAL_DATA_PROPS.projectId,
      // MODAL_DATA_PROPS.taskName,
      // MODAL_DATA_PROPS.taskPath
      this.props.taskId,
      this.props.projectId,
      this.props.taskName,
      this.props.taskPath,
    );
    this.props.closeTemplateModal();
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
        <div className="deanta-modal-dialog" role="document">
          <div className="deanta-modal-content" ref={this.setModalWrapper}>
            <div className="deanta-modal-header">
              <h5 className="deanta-modal-title" id="ModalLabel">
                Choose a template
              </h5>
              <button
                type="button"
                onClick={() => {
                  this.closeModal();
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="deanta-modal-body">
              <div className="wrap-field-label">
                <label className="label-form">Choose the email template</label>
                <div className="content-select">
                  <div
                    className="content-select-input"
                    onClick={() => {
                      this.showOptions();
                    }}
                  >
                    <input
                      className="default-input-select"
                      value={this.state.optionSelected}
                      type="text"
                      disabled="disabled"
                    />
                    <i className="material-icons">keyboard_arrow_down</i>
                  </div>
                  {this.state.showOptions && (
                    <div className="content-select-options content-select-options-show">
                      <ul className="options">
                        {this.props?.finishTemplateList?.map((template) => (
                          <li
                            data-value={template.template_name}
                            key={template.templateId}
                            id={template.templateId}
                            onClick={() => {
                              this.handleChange(
                                template.template_name,
                                template.templateId,
                              );
                            }}
                          >
                            {template.template_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="deanta-modal-footer">
              <BasicButtonsSet
                loadingButtonAction={false}
                disableButtonAction={this.state.selectedTemplateId === null}
                cancelButtonAction={this.closeModal}
                buttonAction={this.go2MessagingTemplateArea}
                actionText="Continue"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FinishTemplateModal;

// ReactDOM.render(
//   <FinishTemplateModal />,
//   document.getElementById('lanstadModal')
// );
