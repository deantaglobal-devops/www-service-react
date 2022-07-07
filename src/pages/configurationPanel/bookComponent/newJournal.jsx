import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import Input from "../../../components/input/input";
import Dropdown from "../../../components/dropdown/dropdown";
import Loading from "../../../components/loader/Loading";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export default function NewJournal(props) {
  const xmlTypeList = [
    { id: "1", value: "DOCBOOK" },
    { id: "2", value: "NLM" },
    { id: "3", value: "DOCBOOK/MathML" },
    { id: "4", value: "NLM/MathML" },
  ];

  // getting project manager list
  const projectManagerList = props.clientData.companyhasuserList.filter(
    (item) => {
      if (item.role.toLowerCase() === "project manager") {
        if (item.role.toLowerCase().includes("project manager")) {
          return item;
        }
      }
    },
  );

  const [isLoading, setIsLoading] = useState(false);

  const issueFrequencyList = [
    { id: "1", value: "Annual" },
    { id: "2", value: "Semi-Annual" },
    { id: "3", value: "Tri-Annual" },
    { id: "4", value: "Quarterly" },
    { id: "5", value: "Bi-Monthly" },
    { id: "6", value: "Monthly" },
    { id: "7", value: "Semi-Monthly" },
    { id: "8", value: "Bi-Weekly" },
    { id: "9", value: "Weekly" },
    { id: "10", value: "Irregular" },
  ];

  // complexity type
  const complexityListType = [
    { id: "1", value: "Only Text" },
    { id: "2", value: "Text with few Figures and Tables" },
    { id: "3", value: "Text with few Figures, Tables and Box" },
    { id: "4", value: "Text with few Figures, Tables, Extract and Box" },
    { id: "5", value: "Text with few Figures, Tables, Extract, List and Box" },
    {
      id: "7",
      value: "Text with few Figures, Tables, Extract, List, Math and Box",
    },
    { id: "8", value: "Text with more than 50 Figures, Tables and Box" },
    {
      id: "9",
      value: "Text with more than 50 Figures, Tables, Extract and Box",
    },
    {
      id: "10",
      value: "Text with more than 50 Figures, Tables, Extract, List and Box",
    },
    {
      id: "11",
      value:
        "Text with more than 50 Figures, Tables, Extract, List, Math and Box",
    },
    { id: "12", value: "Text with more than 100 Figures and Tables" },
    { id: "13", value: "Text with more than 100 Figures, Tables and Box" },
    {
      id: "14",
      value: "Text with more than 100 Figures, Tables, Extract and Box",
    },
    {
      id: "15",
      value: "Text with more than 100 Figures, Tables, Extract, List and Box",
    },
    {
      id: "16",
      value:
        "Text with more than 100 Figures, Tables, Extract, List, Math and Box",
    },
    { id: "17", value: "Table Project" },
    { id: "18", value: "Design Project" },
    { id: "19", value: "Math Project" },
    { id: "20", value: "High Complex Project" },
  ];

  const [data, setData] = useState({
    title: "",
    subTitle: "",
    publisher: props.clientData.name,
    abbreviation: "",
    productionEditor: "",
    editor: "",
    journalEditor: "",
    doi: "",
    projectManager: { id: 0, value: "" },
    type: { id: 0, value: "" },
    category: { id: 0, value: "" },
    complexity: { id: 0, value: "" },
    projectPriority: { id: 0, value: "" },
    publishedDate: "",
    xmlType: { id: 0, value: "" },
    bookCode: "",
    printISSN: "",
    onlineISSN: "",
    price: "",
    edition: "",
    tps: "",
    templateName: "",
    nlmTitle: "",
    chief: "",
    issueFrequency: { id: 0, value: "" },
    description: "",
    client: props.clientData.id,
    avatar: "",
    userImg: "",
    PMList: [],
  });
  const [inputList, setInputList] = useState([{ journalEditor: "" }]);
  const [categoryList, setCategoryList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [collectFootnote, setCollectFootnote] = useState("0");

  const [validateForm, setValidateForm] = useState({
    title: false,
    publisher: false,
    projectManager: false,
    productionEditor: false,
    type: false,
    category: false,
  });

  const inputElement = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    handlingData();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleAddNew = () => {
    setInputList([...inputList, { journalEditor: "" }]);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  useEffect(() => {
    if (data.type.id > 0) {
      handleType(data.type.id);
    }
  }, [data.type]);

  const handleType = (typeval) => {
    let categoryArr = [];
    if (typeval > 0) {
      categoryArr = props.clientData.categoryList.filter((item) =>
        item.typeId.toString().includes(typeval),
      );
      categoryArr = categoryArr.map(({ id, name, ...rest }) => ({
        ...rest,
        id,
        value: name,
      }));
    }
    setCategoryList(categoryArr);
  };

  // file upload functions
  const fileUploadAction = () => {
    inputElement.current.click();
  };

  const fileUploadInputChange = async (e) => {
    const areFilesSelected = e.target.files && e.target.files[0];
    if (
      areFilesSelected &&
      e.target.files[0].size / 1024 / 1024 <= fileSizeLimit
    ) {
      const newImage = e.target.files[0];
      const data = new FormData();
      data.append("avatar", newImage);

      const token = localStorage.getItem("lanstad-token");

      // For this endpoint we need to use fetch instead of axios.
      // Headers is not being created properly using axios
      await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/file/upload/avatar`,
        {
          method: "POST",
          body: data,
          headers: {
            "Lanstad-Token": token,
          },
        },
      )
        .then((res) => res.json())
        .then(
          (response) => {
            if (response.filePath) {
              setData((prevState) => ({
                ...prevState,
                avatar: response.filePath,
                userImg: URL.createObjectURL(newImage),
              }));
            }
          },
          (error) => {
            console.log(error);
          },
        );
    } else if (
      areFilesSelected &&
      e.target.files[0].size / 1024 / 1024 > fileSizeLimit
    ) {
      window.showFailToast({
        statusText: `The file selected is too large. The maximum supported file size is ${fileSizeLimit}MB.`,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = await defaultValidation();
    if (!validation) {
      setIsLoading(true);
      // new journal - form submit
      const bodyRequest = {
        title: data.title,
        subTitle: data.subTitle,
        publisher: props.clientData.name,
        abbreviation: data.abbreviation,
        productionEditor: data.productionEditor,
        projectManager:
          data.projectManager.id === 0 ? "" : data.projectManager.id,
        type: data.type.id === 0 ? "" : data.type.id,
        category: data.category.id === 0 ? "" : data.category.id,
        description: data.description,
        xmlType: data.xmlType.id === 0 ? "" : data.xmlType.id,
        doi: data.doi,
        printISSN: data.printISSN,
        onlineISSN: data.onlineISSN,
        templateName: data.templateName,
        nlmTitle: data.nlmTitle,
        issueFrequency:
          data.issueFrequency.id === 0 ? "" : data.issueFrequency.id,
        chief: data.chief,
        client: props.clientData.id,
        userImg: data.avatar,
        journalEditor: inputList,
      };

      await api
        .post("/configuration/create/journal", bodyRequest)
        .then((response) => {
          if (response.data.status === "success") {
            navigate(`/project/journal/list/${data.lastInsertedId}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setIsLoading(false);
  };

  const handlingData = () => {
    // PM dropdown
    const newPMList = projectManagerList.map(({ id, fullname, ...rest }) => ({
      ...rest,
      id,
      value: fullname,
    }));

    const newTypeList = props.clientData.typeList.map(
      ({ id, name, ...rest }) => ({
        ...rest,
        id,
        value: name,
      }),
    );
    setTypeList(newTypeList);
    setData({
      ...data,
      PMList: newPMList,
    });
  };

  // checking validation while click submit buttion
  const defaultValidation = () => {
    const validateFormObject = {
      title: data.title === "",
      publisher: data.publisher === "",
      productionEditor: data.productionEditor === "",
      projectManager: data.projectManager.id === 0,
      type: data.type.id === 0,
      category: data.categoryid === 0,
    };

    const res = Object.values(validateFormObject).indexOf(true) > -1;

    setValidateForm((prevState) => ({
      ...prevState,
      title: data.title === "",
      publisher: data.publisher === "",
      productionEditor: data.productionEditor === "",
      projectManager: data.projectManager.id === 0,
      type: data.type.id === 0,
      category: data.category.id === 0,
    }));

    return res;
  };

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (name === "title") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, title: true });
          } else {
            setValidateForm({ ...validateForm, title: false });
          }
        } else if (name === "productionEditor") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, productionEditor: true });
          } else {
            setValidateForm({ ...validateForm, productionEditor: false });
          }
        }

        setData((prevState) => ({
          ...prevState,
          [name]: value || "",
        }));
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = JSON.parse(e.target.getAttribute("data-id"));
        if (eleName === "projectManager") {
          if (eleValue.id === 0) {
            setValidateForm({ ...validateForm, projectManager: true });
          } else {
            setValidateForm({ ...validateForm, projectManager: false });
          }
        }
        if (eleName === "type") {
          if (eleValue.id === 0) {
            setValidateForm({ ...validateForm, type: true });
          } else {
            setValidateForm({ ...validateForm, type: false });
          }
        }
        if (eleName === "category") {
          if (eleValue.id === 0) {
            setValidateForm({ ...validateForm, category: true });
          } else {
            setValidateForm({ ...validateForm, category: false });
          }
        }

        setData((prevState) => ({
          ...prevState,
          [eleName]: eleValue || "",
        }));
      }
    }
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <div className="general-info">
        <div className="left-side flex-side">
          <div id="user-area" className="coverImage">
            <form className="profilePhoto" encType="mulitpart/form-data">
              {data.avatar !== "" && (
                <img src={data.avatar ? `${data.userImg}` : ""} />
              )}
              <i className="material-icons-outlined" onClick={fileUploadAction}>
                add_photo_alternate
              </i>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                hidden
                name="profilePhoto"
                ref={inputElement}
                onChange={fileUploadInputChange}
              />
            </form>
          </div>
        </div>

        <div className="right-side" />
      </div>
      <div className="book-main-content full-info-grid">
        <div className="book-first-col">
          {/* Title */}
          <Input
            label="Title *"
            name="title"
            id="title"
            value={data?.title}
            titleError="Please enter the Title."
            hasError={validateForm?.title}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Subtitle */}
          <Input
            label="Subtitle"
            name="subTitle"
            id="subTitle"
            value={data?.subTitle}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Publisher */}
          <Input
            label="Publisher *"
            name="publisher"
            id="publisher"
            value={data?.publisher}
            titleError="Please enter the Publisher."
            hasError={validateForm?.publisher}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Abbreviations */}
          <Input
            label="Abbreviation"
            name="abbreviation"
            value={data?.abbreviation}
            handleOnChange={(e) => handleOnChange(e)}
            maxLength="255"
          />

          {/* Production Editor */}
          <Input
            label="Production Editor *"
            name="productionEditor"
            id="productionEditor"
            value={data?.productionEditor}
            titleError="Please enter the Production Editor."
            hasError={validateForm?.productionEditor}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Project manager */}
          <Dropdown
            label="Project manager *"
            name="projectManager"
            value={data?.projectManager?.value}
            valuesDropdown={data?.PMList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Project manager."
            hasError={validateForm?.projectManager}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Type */}
          <Dropdown
            label="Type *"
            name="type"
            value={data?.type?.value}
            valuesDropdown={typeList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Type."
            hasError={validateForm?.type}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Category */}
          <Dropdown
            label="Category *"
            name="category"
            value={data?.category?.value}
            valuesDropdown={categoryList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Category."
            hasError={validateForm?.category}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Description */}
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Description</label>
              <textarea
                className="default-input-text"
                id="description"
                onChange={(e) => handleOnChange(e)}
              />
            </div>
          </div>
        </div>
        <div className="book-second-col">
          {/* XML type */}
          <Dropdown
            label="XML type"
            name="xmlType"
            value={data?.xmlType?.value}
            valuesDropdown={xmlTypeList}
            handleOnChange={(e) => handleOnChange(e)}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* DOI */}
          <Input
            label="DOI"
            name="doi"
            id="doi"
            value={data?.doi}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Print ISSN */}
          <Input
            label="Print ISSN"
            name="printISSN"
            id="printISSN"
            value={data?.printISSN}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Online ISSN */}
          <Input
            label="Online ISSN"
            name="onlineISSN"
            id="onlineISSN"
            value={data?.onlineISSN}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Template Name */}
          <Input
            label="Template Name"
            name="templateName"
            id="templateName"
            value={data?.templateName}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Issue Frequency */}
          <Dropdown
            label="Issue Frequency"
            name="issueFrequency"
            value={data?.issueFrequency?.value}
            valuesDropdown={issueFrequencyList}
            handleOnChange={(e) => handleOnChange(e)}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Editor in Chief */}
          <Input
            label="Editor-in-Chief"
            name="chief"
            id="chief"
            value={data?.chief}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {inputList.map((x, i) => {
            return (
              <div className="journal-editor-main" key={i}>
                <Input
                  label="Journal Editor"
                  name="journalEditor"
                  id="journalEditor"
                  value={x.journalEditor}
                  onChange={(e) => handleInputChange(e, i)}
                />
                {i !== 0 && (
                  <a
                    href="#"
                    onClick={() => handleRemoveClick(i)}
                    className="delete-icon"
                  >
                    <i
                      className="material-icons-outlined"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                    >
                      delete
                    </i>
                  </a>
                )}
              </div>
            );
          })}
          <div className="secondary-navigation">
            <a href="#" className="add-si" onClick={(e) => handleAddNew(e)}>
              <i className="material-icons-outlined">add</i> Add New
            </a>
          </div>
        </div>
      </div>
      <div className="adduseranotherclient add-user-button mt-4">
        <button
          type="button"
          className="btn btn-outline-primary mr-2"
          onClick={props.clientDashboard}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={(event) => handleSubmit(event)}
        >
          Save
        </button>
      </div>
    </>
  );
}
