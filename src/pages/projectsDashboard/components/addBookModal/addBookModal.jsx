// remove it after demo
// delete this file
import { useState, useEffect } from "react";
import ModalForm from "../../../../components/ModalForm/modalForm";
import ProgressBar from "./components/progressBar";
import Dropdown from "../../../../components/dropdown/dropdown";
import Input from "../../../../components/input/input";

import "./styles/addBookModal.styles.css";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export default function AddBookModal({
  openAddBookModal,
  handleOnCloseAddBookModal,
  handleAddNewProject,
}) {
  const [error, setError] = useState("");
  const [file, setFile] = useState({
    file: "",
    fileData: "",
  });

  const [completed, setCompleted] = useState(0);

  // remove it after demo
  const categoryList = [
    { id: "1", value: "TS+PR" },
    { id: "2", value: "CE+TS" },
    { id: "3", value: "CE+TS+PR" },
    { id: "3", value: "Light CE+TS+PR" },
    { id: "3", value: "TS-only" },
  ];
  const [data, setData] = useState({
    categoryList: { id: "", value: "" },
  });
  const [projectCode, setProjectCode] = useState("");

  useEffect(() => {
    let value = 0;
    setInterval(() => {
      value += 20;
      if (value <= 100) {
        setCompleted(value);
      }
    }, 2000);
  }, []);

  const fileTypeChecker = (file) => {
    if (file?.type?.includes("zip")) {
      return true;
    }
    setError("Please select a zip file.");
    return false;
  };

  const handleChange = (event) => {
    setError("");
    const areFilesSelected = event.target.files && event.target.files[0];

    if (!fileTypeChecker(areFilesSelected)) {
      return;
    }

    if (
      areFilesSelected &&
      event.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      setError(
        `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
      );
    } else if (areFilesSelected) {
      setFile({
        file: URL.createObjectURL(event.target.files[0]),
        fileData: event.target.files[0],
      });
      // this.setState({
      //   file: URL.createObjectURL(event.target.files[0]),
      //   fileData: event.target.files[0],
      // });
      // this.showHide("#progress-upload", "remove");
    }
  };

  const handleOnChangeDropdown = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      setData({
        categoryList: { id: eleValue.id, value: eleValue.value },
      });
    }
  };

  const handleOnChange = (e) => {
    setProjectCode(e.target.value);
  };

  return (
    <ModalForm show={openAddBookModal}>
      <div className="modal-header">
        {file.file !== "" ? (
          <>
            <h5 className="modal-title" />
            {completed === 100 ? (
              <button
                type="button"
                className="close"
                onClick={() => {
                  handleAddNewProject();
                  handleOnCloseAddBookModal();
                }}
              >
                <i className="material-icons">close</i>
              </button>
            ) : (
              <button
                type="button"
                className="close"
                onClick={() => handleOnCloseAddBookModal()}
              >
                <i className="material-icons">close</i>
              </button>
            )}
          </>
        ) : (
          <>
            <h5 className="modal-title">Upload file</h5>
            <button
              type="button"
              className="close"
              onClick={() => handleOnCloseAddBookModal()}
            >
              <i className="material-icons">close</i>
            </button>
          </>
        )}
      </div>

      {file.file !== "" ? (
        <div className="upload-file-container">
          <main id="loading-zone" aria-busy="true">
            <span>Analysing File</span>

            <ProgressBar bgcolor="#17C671" completed={completed} />
          </main>
          {completed === 100 && (
            <div className="modal-footer cta-right mt-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  handleAddNewProject();
                  handleOnCloseAddBookModal();
                }}
              >
                Complete
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Project Code */}
          <Input
            label="Project Code *"
            name="projectCode"
            id="projectCode"
            value={projectCode}
            handleOnChange={(e) => handleOnChange(e)}
          />
          <div className="">
            <Dropdown
              label="Category *"
              name="taskFilter"
              id="taskFilter"
              value={data?.categoryList?.value}
              valuesDropdown={categoryList}
              handleOnChange={(e) => handleOnChangeDropdown(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />
          </div>
          <div className="upload-file-container">
            <span>Uploaded file must be in .zip format</span>
            <form
              id="add-book-file-upload-form"
              encType="multipart/form-data"
              action="/upload/image"
              method="post"
            >
              <p>
                Drop files to upload or <span>Click here to select</span>
              </p>
              <input
                id="file-upload"
                accept=".zip"
                type="file"
                name="fileUpload"
                onChange={(e) => handleChange(e)}
                multiple
              />
            </form>
          </div>
        </>
      )}

      {error !== "" && (
        <span className="error-message-upload-zip-file">{error}</span>
      )}

      {file.file === "" && (
        <div className="modal-footer cta-right mt-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleOnCloseAddBookModal()}
          >
            Cancel
          </button>
        </div>
      )}
    </ModalForm>
  );
}
