// remove it after demo
// delete this file
import { useState } from "react";
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
  const [data, setData] = useState({
    categoryList: { id: "", value: "" },
    file: {
      file: "",
      fileData: "",
    },
    projectCode: "",
  });
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  // remove it after demo
  const categoryList = [
    { id: "1", value: "TS+PR" },
    { id: "2", value: "CE+TS" },
    { id: "3", value: "CE+TS+PR" },
    { id: "4", value: "Light CE+TS+PR" },
    { id: "5", value: "TS-only" },
  ];

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
      setData({
        ...data,
        file: {
          file: URL.createObjectURL(event.target.files[0]),
          fileData: event.target.files[0],
        },
      });
    }
  };

  const handleOnChangeDropdown = (e) => {
    if (e) {
      const eleValue = JSON.parse(e.target.getAttribute("data-id"));

      setData({
        ...data,
        categoryList: { id: eleValue.id, value: eleValue.value },
      });
    }
  };

  const handleOnChange = (e) => {
    setData({
      ...data,
      projectCode: e?.target?.value,
    });
  };

  const handleUpload = () => {
    if (
      data?.projectCode !== "" &&
      data?.file?.fileData !== "" &&
      data?.categoryList?.id !== ""
    ) {
      setIsUploaded(true);
      let value = 0;
      setInterval(() => {
        value += 20;
        if (value <= 100) {
          setCompleted(value);
        }
      }, 2000);
      handleAddNewProject(data?.projectCode, data?.categoryList, data?.file);
    } else {
      // handle error
    }
  };

  return (
    <ModalForm show={openAddBookModal} className="addBook-modal">
      <div className="modal-header">
        {isUploaded ? (
          <>
            <h5 className="modal-title" />
            {completed === 100 ? (
              <button
                type="button"
                className="close"
                onClick={() => {
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

      {isUploaded ? (
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
            value={data?.projectCode}
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

      {!isUploaded && (
        <>
          <div className="modal-footer cta-right mt-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleOnCloseAddBookModal()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleUpload()}
            >
              Upload
            </button>
          </div>
          <div className="modal-footer cta-right mt-2" />
        </>
      )}
    </ModalForm>
  );
}
