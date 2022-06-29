import React from "react";
import { api } from "../../../../services/api";
import Modal from "../../../../components/modal";
import BasicButtonsSet from "../../../../components/basicButtonsSet";
import Dropdown from "../../../../components/dropdown/dropdown";

export default class EditFileName extends React.Component {
  constructor(props) {
    super(props);
    const originalFileNameSplitted = props?.originalFileName.split("_");
    this.state = {
      serialNumber: originalFileNameSplitted[1],
      invalid_serialNumber: false,
      title: originalFileNameSplitted[3],
      invalid_title: false,
      clientCode: props?.projectCode,
      bookCode: props?.bookCode,
      projectId: props?.projectId,
      tocId: props?.tocId,
      fileNameExists: false,
      noSave: false,
      isSaving: false,
      frontmatter: [
        { id: "ABB", value: "Abbreviations" },
        { id: "ACK", value: "Acknowledgements" },
        { id: "CON", value: "Contents" },
        { id: "DED", value: "Dedication" },
        { id: "PRELIMS_INFO", value: "Info" },
        { id: "PRELIMS_PREFACE", value: "Preface" },
        { id: "Prelims", value: "Prelims" },
        { id: "LIM", value: "List of Maps" },
        { id: "LIT", value: "List of Tables" },
        { id: "LIF", value: "List of Figures" },
        { id: "LIL", value: "List of Illustration" },
        { id: "PRELIMS_1_PREFACE", value: "Prelims_1_preface" },
        { id: "PRELIMS_2_PREFACE", value: "Prelims_2_preface" },
        { id: "PRELIMS_3_PREFACE", value: "Prelims_3_preface" },
        { id: "PRELIMS_4_PREFACE", value: "Prelims_4_preface" },
        { id: "PRELIMS_5_PREFACE", value: "Prelims_5_preface" },
        { id: "PRELIMS_6_PREFACE", value: "Prelims_6_preface" },
        { id: "PRELIMS_7_PREFACE", value: "Prelims_7_preface" },
        { id: "PRELIMS_8_PREFACE", value: "Prelims_8_preface" },
        { id: "PRELIMS_9_PREFACE", value: "Prelims_9_preface" },
      ],
      backmatter: [
        { id: "Appendix", value: "Appendix" },
        { id: "BIB", value: "Bibliography" },
        { id: "EPI", value: "Epilogue" },
        { id: "GLO", value: "Glossary" },
        { id: "REF", value: "References" },
        { id: "CONC", value: "Conclusion" },
        { id: "INDEX", value: "Index" },
      ],
      newTitle: "",
      newTitleValue: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.updateFileName = this.updateFileName.bind(this);
  }

  componentDidMount() {
    if (this.props.modalAction !== "Edit") {
      this.setState({
        serialNumber: "00",
      });
    }
  }

  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const { id } = event.target;
    const newFileName = event.target.value;
    const isFileNameOk = this.fileNamecheck(newFileName, id);
    if (isFileNameOk) {
      this.setState(
        {
          [id]: newFileName,
          [`invalid_${id}`]: false,
          noSave: true,
        },
        () => {
          this.checkIfFileNameExists();
        },
      );
    } else {
      this.setState({
        [`invalid_${id}`]: true,
        [id]: newFileName,
        noSave: true,
      });
    }
  }

  handleSelectChange(e) {
    const eleValue = JSON.parse(e.target.getAttribute("data-id"));
    this.setState(
      {
        newTitle: eleValue.value,
        title: eleValue.value,
        newTitleValue: eleValue.id,
      },
      () => {
        this.checkIfFileNameExists();
      },
    );
  }

  checkIfFileNameExists() {
    const newFileName = `${this.state.clientCode}_${this.state.serialNumber}_${this.state.bookCode}_${this.state.title}`;
    if (newFileName !== this.props?.originalFileName) {
      const fileNameExists = this.props?.fileNameList.filter(
        (fileName) => fileName === newFileName,
      );
      if (fileNameExists.length > 0) {
        this.setState({
          fileNameExists: true,
          noSave: true,
        });
      } else {
        this.setState({
          fileNameExists: false,
          noSave: false,
        });
      }
    }
  }

  fileNamecheck(chapterName, id) {
    if (chapterName != "") {
      const format = /^[0-9a-zA-Z_]+$/;
      const nameMatchFormat = chapterName.match(format);
      const firstTitleFormat = /[C]\d/;
      const titleMatchFirstFormat = chapterName.match(firstTitleFormat);
      if (nameMatchFormat) {
        if (id === "title" && titleMatchFirstFormat) {
          const titleConvention = /[C][0-9]{3}/;
          const titleMatch = chapterName.match(titleConvention);
          if (titleMatch) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  }

  updateFileName() {
    if (this.props.modalAction === "Edit") {
      if (this.state.serialNumber === "" || this.state.title === "") {
        this.setState(
          {
            invalid_serialNumber: true,
            invalid_title: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                invalid_serialNumber: false,
                invalid_title: false,
              });
            }, 1000);
          },
        );
      } else if (this.state.fileNameExists) {
        this.setState(
          {
            invalid_serialNumber: true,
            invalid_title: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                invalid_serialNumber: false,
                invalid_title: false,
              });
            }, 2000);
          },
        );
      } else {
        this.setState(
          {
            isSaving: true,
          },
          async () => {
            const newFileName = `${this.state.clientCode}_${this.state.serialNumber}_${this.state.bookCode}_${this.state.title}`;
            await api
              .post("/project/toc/updatetocchapter", {
                projectId: this.state.projectId,
                tocId: this.state.tocId,
                chapterName: newFileName,
              })
              .then((response) => {
                // location.reload();
                this.props.handleUpdateData(response.data);
                this.props.handleCloseModal();
              })
              .catch((err) => {
                this.setState({
                  isSaving: false,
                });
                console.log(err);
              });
          },
        );
      }
    } else {
      const validation = true;
      const newFile = `${this.state.clientCode}_${this.state.serialNumber}_${this.state.bookCode}_${this.state.title}`;
      if (validation) {
        this.props.createTocElement(newFile);
      }
    }
  }

  render() {
    const editFileNameBody = (
      <div className="deanta-modal-long">
        <p className="deanta-modal-paragraph">
          The file name needs to have a certain structure for the PRO Editor to
          interpret. However, you can customise it below.
        </p>
        <form className="general-forms edit-file-form">
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Serial Number </label>
              <input
                className={`default-input-text ${
                  this.state.invalid_serialNumber ? "is-invalid" : ""
                }`}
                type="text"
                id="serialNumber"
                value={this.state.serialNumber}
                onChange={this.handleChange}
              />
            </div>
            {this.props.modalAction === "Edit" && (
              <div className="inputWrapper">
                <label className="label-form">Title</label>
                <input
                  className={`default-input-text ${
                    this.state.invalid_title ? "is-invalid" : ""
                  }`}
                  type="text"
                  id="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
            )}
            {this.props.modalAction !== "Edit" &&
              this.props.newElement.id === "FM" && (
                <Dropdown
                  label="Title"
                  name="newTitle"
                  value={this.state.newTitle}
                  valuesDropdown={this.state.frontmatter}
                  handleOnChange={this.handleSelectChange}
                  placeholder="Select"
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />
              )}
            {this.props.modalAction !== "Edit" &&
              this.props.newElement.id === "BM" && (
                <Dropdown
                  label="Title"
                  name="newTitle"
                  value={this.state.newTitle}
                  valuesDropdown={this.state.backmatter}
                  handleOnChange={this.handleSelectChange}
                  placeholder="Select"
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />
              )}
          </div>
        </form>
        <p className="deanta-modal-paragraph">
          Below is a preview of what the new file name will be:
        </p>
        <p className="deanta-modal-preview">
          {this.state.clientCode}_<span>{this.state.serialNumber}</span>_
          {this.state.bookCode}_<span>{this.state.title}</span>
        </p>
        {this.state.fileNameExists && (
          <span className="deanta-modal-invalid-text">
            That file name already exists.
          </span>
        )}
      </div>
    );

    return (
      <Modal
        modalInSlider={false}
        title={
          this.props.modalAction === "Edit"
            ? "Edit File Name"
            : `Add ${this.props.newElement?.value}`
        }
        body={editFileNameBody}
        footer={
          <BasicButtonsSet
            loadingButtonAction={this.state.isSaving}
            disableButtonAction={this.state.noSave}
            cancelButtonAction={this.props.handleCloseModal}
            buttonAction={this.updateFileName}
            actionText="Save"
          />
        }
        closeModal={this.props.handleCloseModal}
      />
    );
  }
}

// ReactDOM.render(
//     <EditFileName />,
//     document.getElementById('deanta-modal-container')
// );
