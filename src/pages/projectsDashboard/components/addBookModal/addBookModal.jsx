// remove it after demo
// delete this file
import { useState, useEffect } from "react";
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
    file: {
      file: "",
      fileData: "",
    },
    projectCode: "",
  });
  const [error, setError] = useState("");
  // const [completed, setCompleted] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    projectCode: "",
    categoryList: "",
  });
  const [validateForm, setValidateForm] = useState({
    projectCode: false,
    categoryList: false,
  });

  useEffect(() => {
    const handleCategoryList = async () => {
      const categoriesList = await api
        .get("/company/categories")
        .then((response) => {
          return response.data[0].categoryList.map((category) => {
            return {
              id: category.category_id,
              value: category.category_name,
            };
          });
        });
      setCategoryList(categoriesList);
    };
    handleCategoryList();
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
      // let value = 0;
      // setInterval(() => {
      //   value += 20;
      //   if (value <= 100) {
      //     setCompleted(value);
      //   }
      // }, 2000);
      handleAddNewProject(data?.projectCode, data?.categoryList, data?.file);
    } else if (data?.projectCode === "" && data?.categoryList?.id === "") {
      setErrorMessage({
        projectCode: "Project code is required",
        categoryList: "Category is required",
      });
      setValidateForm({ projectCode: true, categoryList: true });
    } else if (data?.projectCode === "") {
      setErrorMessage({
        categoryList: "",
        projectCode: "Project code is required",
      });
      setValidateForm({ categoryList: false, projectCode: true });
    } else if (data?.categoryList?.id === "") {
      setErrorMessage({
        projectCode: "",
        categoryList: "Category is required",
      });
      setValidateForm({ projectCode: false, categoryList: true });
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
    bodyFormData.append("file", file?.fileData);

    const token = localStorage.getItem("lanstad-token");

    // For this endpoint we need to use fetch instead of axios.
    // Headers is not being created properly using axios
    await fetch(
      `${
        import.meta.env.VITE_URL_API_SERVICE
      }/file/upload/project?project_code=${projectCode}&category_id=${
        category.id
      }`,
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
          if (response?.error?.message === "project already exists") {
            setErrorMessage({
              ...errorMessage,
              projectCode: "Project already exists",
            });
            setValidateForm({ categoryList: false, projectCode: true });
          } else {
            setIsUploaded(true);
          }
        },
        (error) => {
          console.log("error", error);
        },
      );
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
          <Input
            label="Project Code *"
            name="projectCode"
            id="projectCode"
            value={data?.projectCode}
            handleOnChange={(e) => handleOnChange(e)}
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
              Upload
            </button>
          </div>
        </>
      )}
    </ModalForm>
  );
}
