import { useEffect, useState } from "react";
import { api } from "../../../../services/api";

import SideSlider from "../../../../components/sideSlider/SideSlider";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export default function GalleryUpload({ show, set, chapter, project }) {
  const [sliderHeader, setSliderHeader] = useState("Add New");
  const [sliderWidth, setSliderWidth] = useState("");
  const [messageToast, setMessageToast] = useState("");
  const [typeToast, setTypeToast] = useState("success");
  const [taskData, setTaskData] = useState([]);

  const [nameFile, setNameFile] = useState("");
  const [taskFile, setTaskFile] = useState("select");

  const { projectId } = project;
  const chapterId = chapter?.chapter_id || 0;
  const [file, setFile] = useState("");
  const [fileData, setFileData] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    function loadTasks() {
      api
        .post("/task/list/information", { projectId, chapterId })
        .then((response) => {
          setTaskData(response?.data?.taskData);
        })
        .catch((err) => console.log(err));
    }
    loadTasks();
  }, [show]);

  function fileTypeChecker(file) {
    if (
      file.type.includes("png") ||
      file.type.includes("jpg") ||
      file.type.includes("jpeg") ||
      file.type.includes("tif") ||
      file.type.includes("application/postscript") /* .eps files */
    ) {
      return true;
    }
    setMessageToast("Please select an image file.");
    setTypeToast("fail");
    return false;
  }

  function handleChange(event) {
    const areFilesSelected = event.target.files && event.target.files[0];

    if (!fileTypeChecker(areFilesSelected)) {
      // if selected file is not an image, abort
      return;
    }

    if (
      areFilesSelected &&
      event.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      setMessageToast(
        "The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.",
      );
      setTypeToast("fail");
    } else if (areFilesSelected) {
      setFile(URL.createObjectURL(event.target.files[0]));
      setFileData(event.target.files[0]);
    }
  }

  async function handleSave() {
    if (taskFile !== "select" && nameFile !== "") {
      setInvalid(false);
      const formData = new FormData();
      // Update the formData object
      formData.append("myFile", fileData);
      formData.append("projectId", projectId);
      formData.append("taskId", taskFile);
      formData.append("fileName", nameFile);
      formData.append("chapterId", chapterId);

      await fetch("/call/add/gallery/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: formData,
      })
        .then((res) => res.json())
        .then(
          () => {
            set(false);
            window.location.reload();
          },
          (error) => {
            // Todo: should we add a fail toast to show the error?
            console.log(error);
          },
        );
    } else {
      setInvalid(true);
    }
  }

  return (
    <div className={show ? "open" : ""} id="side-slider-container">
      <SideSlider
        SIDESLIDER_PROPS={{
          SliderHeader: sliderHeader,
          SliderStatus: show,
          SliderWidth: sliderWidth,
        }}
        showSlider={() => set(false)}
      >
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
            onChange={handleChange}
          />
        </form>
        {file && (
          <div className="progress-upload" id="progress-upload">
            <div className="content-box">
              <img className="thumb-img" src={file} />
              <div className="project-card-details-gallery">
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
              <div className="wrap-field-label figureNameInput ">
                <label className="label-form">Title</label>
                <input
                  required
                  className={
                    invalid && nameFile === ""
                      ? "default-input-text is-invalid"
                      : "default-input-text"
                  }
                  maxLength="45"
                  type="text"
                  name="filename"
                  onChange={(e) => {
                    setNameFile(e.target.value);
                  }}
                />
                {invalid && nameFile === "" && (
                  <span className="validation-error-figurename">
                    Please enter a figure name
                  </span>
                )}
              </div>
              <div className="wrap-field-label last-f mt-3">
                <fieldset className="chooseRole dropdown">
                  <div className="DdWrapper">
                    <label htmlFor="roleSelect">Task</label>
                    <div className="styled-select TaskNameInput">
                      <select
                        id="taskupload"
                        required
                        onChange={(e) => {
                          setTaskFile(e.target.value);
                        }}
                        defaultValue={taskFile}
                      >
                        <option value="select">Select Task</option>
                        {taskData?.map((galleryList, index) => (
                          <option
                            value={galleryList.taskId}
                            key={galleryList.taskId + index}
                          >
                            {galleryList.taskName}
                          </option>
                        ))}
                        ;
                      </select>
                      {invalid && taskFile === "select" && (
                        <span className="validation-error-taskname">
                          Please any one task
                        </span>
                      )}
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="float-right">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => set(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                id="project-update-btn"
                className="btn btn-outline-primary ml-1"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </SideSlider>

      {messageToast && (
        <Toast
          type={typeToast}
          text={messageToast}
          handleToastOnClick={() => setMessageToast("")}
        />
      )}
    </div>
  );
}
