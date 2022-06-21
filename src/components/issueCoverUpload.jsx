import React from "react";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;
class IssueCoverUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      fileData: "",
      fileName: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.fileTypeChecker = this.fileTypeChecker.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(event) {
    const areFilesSelected = event.target.files && event.target.files[0];
    if (!this.fileTypeChecker(areFilesSelected)) {
      // if selected file is not an image, abort
      return;
    }
    if (
      areFilesSelected &&
      event.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      window.showFailToast({
        statusText: `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
      });
    } else if (areFilesSelected) {
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        fileData: event.target.files[0],
      });
      this.showHide("#progress-upload", "remove");
    }
  }

  fileTypeChecker(file) {
    if (
      file.type.includes("png") ||
      file.type.includes("jpg") ||
      file.type.includes("jpeg") ||
      file.type.includes("gif") ||
      file.type.includes("application/postscript") /* .eps files */
    ) {
      return true;
    }
    window.showFailToast({
      statusText:
        "Uploaded file is not a valid image. Only JPG, PNG, GIF files are allowed.",
    });
    return false;
  }

  showHide(id, action) {
    const element = document.querySelector(id);
    if (action === "add") {
      element.classList.add("hide");
    } else {
      element.classList.remove("hide");
    }
  }

  async handleSave(e) {
    e.preventDefault();
    const { fileData } = this.state;
    const { projectId, issueId, handleIssue, handleCoverUpload } = this.props;

    const formData = new FormData();
    // Update the formData object
    formData.append("myFile", fileData);
    formData.append("projectId", projectId);
    formData.append("issueId", issueId);

    const token = localStorage.getItem("lanstad-token");

    // For this endpoint we need to use fetch instead of axios.
    // Headers is not being created properly using axios
    await fetch(
      `${import.meta.env.VITE_URL_API_SERVICE}/issue/coverimage/upload`,
      {
        method: "POST",
        headers: {
          "Lanstad-Token": token,
        },
        body: formData,
      },
    )
      .then((res) => res.json())
      .then(
        (data) => {
          const fileName = data.coverimagename;
          handleCoverUpload(true);
          handleIssue(fileName, issueId, projectId);
        },
        (error) => {
          // Todo: should we add a fail toast to show the error?
          console.log(error);
        },
      );
  }

  render() {
    return (
      <div className="coverUploadEle">
        <form
          id="file-upload-form"
          encType="multipart/form-data"
          action="/upload/image"
          method="post"
        >
          <p>
            Drop files to upload or <span>Click here to select</span>
          </p>
          <input
            id="file-upload"
            accept=".png, .jpg, .jpeg, .tif, .eps"
            type="file"
            name="fileUpload"
            onChange={this.handleChange}
            multiple
          />
        </form>
        <div className="progress-upload hide" id="progress-upload">
          <div className="content-box">
            <img className="thumb-img" src={this.state.file} />
            <div className="project-card-details">
              <div className="progress-status">
                <div className="progress progress-sm">
                  <div
                    className="progress-bar bg-success progress-per"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            </div>
            <i
              className="material-icons-outlined delete-file-from-upload hide"
              data-toggle="tooltip"
              data-placement="top"
              title="Delete"
            >
              delete_outline
            </i>
          </div>
          <div className="float-right">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => this.props.handleCoverUpload(true)}
            >
              Cancel
            </button>
            <button
              type="button"
              id="project-update-btn"
              className="btn btn-outline-primary ml-1"
              onClick={(e) => {
                this.handleSave(e);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default IssueCoverUpload;
