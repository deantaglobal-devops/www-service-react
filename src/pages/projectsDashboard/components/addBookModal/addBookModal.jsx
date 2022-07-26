// remove it after demo
// delete this file
import { useState, useEffect, useRef } from "react";
import { api } from "../../../../services/api";
import ModalForm from "../../../../components/ModalForm/modalForm";
// import ProgressBar from "./components/progressBar";
import Dropdown from "../../../../components/dropdown/dropdown";
import Input from "../../../../components/input/input";

import "./styles/addBookModal.styles.css";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export default function AddBookModal({
  openAddBookModal,
  handleOnCloseAddBookModal,
  // handleAddNewProject,
}) {
  const [data, setData] = useState({
    categoryList: { id: "", value: "" },
    file: [],
    projectCode: "",
  });
  const [error, setError] = useState("");
  // const [completed, setCompleted] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    // projectCode: "",
    // categoryList: "",
    fileUpload: "",
  });
  const [validateForm, setValidateForm] = useState({
    projectCode: false,
    categoryList: false,
    fileUpload: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // create a ref for the file input
  const inputRef = useRef(null);

  // useEffect(() => {
  //   const handleCategoryList = async () => {
  //     const categoriesList = await api
  //       .get("/company/categories")
  //       .then((response) => {
  //         return response.data[0].categoryList.map((category) => {
  //           return {
  //             id: category.category_id,
  //             value: category.category_name,
  //           };
  //         });
  //       });
  //     setCategoryList(categoriesList);
  //   };
  //   handleCategoryList();
  // }, []);

  const fileTypeChecker = (file) => {
    if (
      file?.type?.includes("zip") ||
      file?.type?.includes("doc") ||
      file?.type?.includes("xls")
    ) {
      return true;
    }

    setError("Please select a zip/docx/xls/xlsx file.");
    return false;
  };

  const handleUploadFileOnChange = () => {
    setError("");
    setErrorMessage({
      ...errorMessage,
      fileUpload: "",
    });

    const filesUploaded = [];
    Array.from(inputRef.current.files).map((files) => {
      const areFilesSelected = files;

      if (!fileTypeChecker(areFilesSelected)) {
        return;
      }

      if (areFilesSelected && files.size / 1024 / 1024 > fileSizeLimit) {
        setError(
          `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
        );
      } else if (areFilesSelected) {
        filesUploaded.push({
          file: URL.createObjectURL(files),
          fileData: files,
        });
      }
    });

    const fileConcatenated = data?.file.concat(filesUploaded);

    setData({
      ...data,
      file: fileConcatenated,
    });
  };

  // const handleOnChangeDropdown = (e) => {
  //   if (e) {
  //     const eleValue = JSON.parse(e.target.getAttribute("data-id"));

  //     setData({
  //       ...data,
  //       categoryList: { id: eleValue.id, value: eleValue.value },
  //     });
  //   }
  // };

  // const handleInputOnChange = (e) => {
  //   setData({
  //     ...data,
  //     projectCode: e?.target?.value,
  //   });
  // };

  const handleUpload = () => {
    if (
      // data?.projectCode !== "" &&
      data?.file.length > 0
      // data?.categoryList?.id !== ""
    ) {
      // let value = 0;
      // setInterval(() => {
      //   value += 20;
      //   if (value <= 100) {
      //     setCompleted(value);
      //   }
      // }, 2000);
      handleAddNewProject(data?.projectCode, data?.categoryList, data?.file);
    } else {
      setErrorMessage({
        // projectCode: data?.projectCode === "" ? "Project code is required" : "",
        // categoryList:
        //   data?.categoryList?.id === "" ? "Category is required" : "",
        fileUpload: data?.file.length === 0 ? "File is required" : "",
      });
      setValidateForm({
        // projectCode: data?.projectCode === "",
        // categoryList: data?.categoryList?.id === "",
        fileUpload: (data?.file.length === 0) === "",
      });
    }
  };

  // remove it after demo
  const handleAddNewProject = async (projectCode, category, file) => {
    // const newBook = {
    //   author: "Natasha Santarossa",
    //   bookcode: "TFN",
    //   client: "Deanta Publishers",
    //   clientId: 13,
    //   endDate: "31-08-2022",
    //   id: 248169,
    //   indexer: "",
    //   isbn: "235634547547235346",
    //   milestones: [
    //     {
    //       id: 156380,
    //       percentage: 0,
    //       milestoneTitle: "Project analysis and scheduling",
    //       milestoneStart: "30-06-2022",
    //       milestoneEnd: "02-07-2022",
    //     },
    //     {
    //       id: 156381,
    //       percentage: 0,
    //       milestoneTitle: "Copy editing",
    //       milestoneStart: "04-07-2022",
    //       milestoneEnd: "09-08-2022",
    //     },
    //   ],
    //   percent: 0,
    //   productionEditor: "Donnita McDonnell",
    //   projectImage: testBook,
    //   projectManager: "Michelle van Kampen",
    //   projectType: "LXE",
    //   startDate: "30-06-2022",
    //   template: "",
    //   title: "Comparative Policing",
    // };
    // setFilterProjects([newBook, ...filterProjects]);
    // getFilterValues([newBook, ...filterProjects]);

    const bodyFormData = new FormData();
    file.map((file) => {
      bodyFormData.append("file[]", file?.fileData);
    });

    const token = localStorage.getItem("lanstad-token");
    setIsLoading(true);

    // For this endpoint we need to use fetch instead of axios.
    // Headers is not being created properly using axios
    await fetch(
      `${
        import.meta.env.VITE_URL_API_SERVICE
        // }/file/upload/project?project_code=${projectCode}&category_id=${
      }/file/upload/project`,
      {
        method: "POST",
        body: bodyFormData,
        headers: {
          "Lanstad-Token": token,
        },
      },
    )
      .then((res) => res.json())
      .then(
        (response) => {
          console.log("response", response);
          if (response?.error?.message === "project already exists") {
            setErrorMessage({
              ...errorMessage,
              projectCode: "Project already exists",
            });
            setValidateForm({ categoryList: false, projectCode: true });
          } else if (response?.error?.message) {
            setErrorMessage({
              ...errorMessage,
              fileUpload: "Error while creating the project, please try again.",
            });
            // setValidateForm({ categoryList: false, projectCode: true });
          } else {
            setIsUploaded(true);
          }
        },
        (error) => {
          console.log("error", error);
          setIsLoading(false);
        },
      );
    setIsLoading(false);
  };

  const removeFileFromDragAndDropArea = (fileToBeRemoved) => {
    const fileRemoved = data?.file?.filter(
      (file) => file.file !== fileToBeRemoved.file,
    );

    setData({
      ...data,
      file: fileRemoved,
    });

    inputRef.current.value = null;
  };

  return (
    <ModalForm show={openAddBookModal} className="addBook-modal">
      {isUploaded ? (
        <>
          <div className="modal-header">
            <h5 className="modal-title" />
            <button
              type="button"
              className="close"
              onClick={() => {
                handleOnCloseAddBookModal();
              }}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="upload-file-container">
            <main id="loading-zone" aria-busy="true">
              {/* <span>Analysing File</span> */}

              {/* <ProgressBar bgcolor="#17C671" completed={completed} /> */}
              <span>
                We have already set up your project and will notify you when it
                is completed.
              </span>
            </main>
            <div className="modal-footer cta-right mt-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  handleOnCloseAddBookModal();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="modal-header">
            <h5 className="modal-title">Upload file</h5>
            <button
              type="button"
              className="close"
              onClick={() => handleOnCloseAddBookModal()}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          {/* Project Code */}
          {/* <Input
            label="Project Code *"
            name="projectCode"
            id="projectCode"
            value={data?.projectCode}
            handleOnChange={(e) => handleInputOnChange(e)}
            titleError={errorMessage?.projectCode}
            hasError={validateForm?.projectCode}
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
              titleError={errorMessage?.categoryList}
              hasError={validateForm?.categoryList}
            />
          </div> */}
          <div className="upload-file-container">
            {/* <span>Uploaded file must be in .zip format</span> */}
            <form id="add-book-file-upload-form">
              <p>
                Drop files to upload or <span>Click here to select</span>
              </p>
              <input
                ref={inputRef}
                accept=".zip, .docx, .xls, .xlsx"
                id="file-upload"
                type="file"
                name="fileUpload"
                onChange={(e) => handleUploadFileOnChange(e)}
                multiple
              />
            </form>
            {data?.file?.map((file) => (
              <div className="w-100" id="" key={file?.file}>
                <div className="flex flex-column align-items-center mt-2 w-100 ">
                  <div className="flex align-items-center w-100 ">
                    <span className="w-100">{file?.fileData?.name}</span>
                    <i
                      className="material-icons-outlined add-book-delete-file-from-upload"
                      onClick={() => {
                        removeFileFromDragAndDropArea(file);
                      }}
                    >
                      delete_outline
                    </i>
                  </div>
                  <div className="w-100">
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
                </div>
              </div>
            ))}
          </div>

          {errorMessage?.fileUpload !== "" && (
            <span className="add-book-error-message-upload-zip-file">
              {errorMessage?.fileUpload}
            </span>
          )}

          {error !== "" && (
            <span className="error-message-upload-zip-file">{error}</span>
          )}

          <div className="modal-footer cta-right mt-4">
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
              {isLoading ? (
                <>
                  <i className="material-icons-outlined loading-icon-button">
                    sync
                  </i>{" "}
                  Uploading
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </>
      )}
    </ModalForm>
  );
}
