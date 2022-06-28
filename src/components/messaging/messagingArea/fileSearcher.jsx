import React from "react";
import { api } from "../../../services/api";
import SliderLoading from "../../sliderLoading/SliderLoading";

class FileSearcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filesList: [],
      filesListFiltered: [],
      selectedAttachments: [],
      loadingFiles: true,
      statusMsg: "",
      loading: false,
    };

    this.startSearching = this.startSearching.bind(this);
  }

  async componentDidMount() {
    const filesList = await api
      .get(`/project/assets/${this.props.projectId} `)
      .then((response) => {
        if (response.data.assetsList) {
          const taskAssets = response.data.assetsList.filter((asset) => {
            return parseInt(asset.task_id) === this.props.taskId;
          });
          return taskAssets;
        }
        return [];
      })
      .catch((err) => console.log(err));
    this.setState({
      loadingFiles: false,
      filesList,
      filesListFiltered: filesList,
    });
  }

  async addSelectedAttachment(e, id, name, file_path) {
    const addAttachment = e.currentTarget.checked;
    const newAttachment = { id, name, file_path };
    // If checking an item
    if (addAttachment) {
      const newListOfAttachments = [...this.state.selectedAttachments];
      newListOfAttachments.push(newAttachment);
      this.setState({
        selectedAttachments: newListOfAttachments,
      });
      // If unchecking an item
    } else {
      const newListOfAttachments = this.state.selectedAttachments.filter(
        (attachment) => {
          return attachment.id !== newAttachment.id;
        },
      );
      this.setState({
        selectedAttachments: newListOfAttachments,
      });
    }
  }

  startSearching(e) {
    const input = e.currentTarget.value.toLowerCase();
    const filteredResult = this.state.filesList.filter((file) => {
      if (file.name && file.name.toLowerCase().includes(input)) {
        return true;
      }
    });
    this.setState({
      filesListFiltered: filteredResult,
    });
  }

  async addAttachmentsChecker() {
    this.setState({ statusMsg: "" });

    if (this.state.selectedAttachments.length === 0) {
      this.setState({ statusMsg: "Please select at least one asset" });
    } else {
      const newSelectedAttachments =
        await this.changeFilePathToSelectedAttachments(
          this.state.selectedAttachments,
        );
      this.props.validationChecker(newSelectedAttachments);
      this.props.close();
    }
  }

  async changeFilePathToSelectedAttachments(attachments) {
    this.setState({ loading: true });
    const newAttachments = await Promise.all(
      attachments.map(async (att) => {
        const newFilePath = await fetch("/call/file/attachment/move", {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            taskId: this.props.taskId,
            assetPath: att.file_path,
          }),
        })
          .then((res) => res.json())
          .then(
            (response) => {
              return response.filePath;
            },
            (error) => {
              // Todo: How are we going to show the errors
              console.log(error);
            },
          )
          .finally(() => {
            this.setState({ loading: false });
          });
        return { id: att.id, name: att.name, file_path: newFilePath };
      }),
    );
    return newAttachments;
  }

  render() {
    return (
      <div className="txt-editor-popup">
        <div>
          <p className="file-disclaimer">
            Attach files from the assets library
          </p>
        </div>
        <div id="fileList">
          <div className="file-search">
            <i className="material-icons">search</i>
            <input
              className="navbar-search form-control"
              type="text"
              placeholder="Search for an asset"
              aria-label="Search"
              onChange={(e) => this.startSearching(e)}
            />
          </div>
          {this.state.loadingFiles ? (
            <SliderLoading fitLoad />
          ) : (
            <>
              <div className="file-list">
                <ul>
                  {this.state.filesListFiltered.length === 0
                    ? "Sorry, no assets found"
                    : ""}
                  {this.state.filesListFiltered.map((file) => {
                    return (
                      <li
                        key={file.document_id}
                        className="file-list-item options-checkbox"
                      >
                        <label
                          htmlFor={`file-checkbox-${file.document_id}`}
                          title={file.name}
                          className="label-flex"
                        >
                          <input
                            id={`file-checkbox-${file.document_id}`}
                            type="checkbox"
                            value="fileCheckbox"
                            name={`file-checkbox-${file.document_id}`}
                            onChange={(e) => {
                              this.addSelectedAttachment(
                                e,
                                file.document_id,
                                file.name,
                                file.file_path,
                              );
                            }}
                          />
                          <span>{file.name}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="col-md-12 p-0 flex-between deanta-button-container">
                <p
                  className={`text-warning ${
                    this.state.statusMsg.includes("success")
                      ? "text-success"
                      : "text-error"
                  }`}
                >
                  {this.state.statusMsg}
                </p>
                <button
                  className="deanta-button-outlined save-users "
                  disabled={this.state.loading}
                  onClick={() => this.addAttachmentsChecker()}
                >
                  {!this.state.loading ? (
                    "Attach"
                  ) : (
                    <>
                      <i className="material-icons-outlined loading-icon-button">
                        sync
                      </i>{" "}
                      Attaching
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default FileSearcher;
