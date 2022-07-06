import { useState, useRef, useEffect } from "react";
import { api } from "../../../services/api";
import DatePicker from "../../../components/datePicker/datePicker";
import Input from "../../../components/input/input";
import Dropdown from "../../../components/dropdown/dropdown";
import Loading from "../../../components/loader/Loading";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

// complexity dropdown data
const complexityList = [
  { id: 1, value: "Simple" },
  { id: 2, value: "Medium" },
  { id: 3, value: "Complex" },
];

// indexer dropdown data
const indexerList = [
  { id: 1, value: "Deanta" },
  { id: 2, value: "Author" },
  { id: 3, value: "Freelancer" },
];

// origin dropdown data
const originList = [
  { id: 1, value: "UK" },
  { id: 2, value: "UK" },
];

// currency dropdown data
const currencyList = [
  { id: "1", value: "Dollar" },
  { id: "2", value: "Euro" },
  { id: "3", value: "Yen" },
  { id: "4", value: "Pound" },
  { id: "5", value: "Rand" },
  { id: "6", value: "Rupee" },
  { id: "7", value: "Cent" },
  { id: "8", value: "Øre" },
  { id: "9", value: "Centavo" },
];

// editoy type dropdown data
const editorTypeList = [
  { id: "1", value: "VXE FP" },
  { id: "2", value: "VXE" },
  { id: "3", value: "VXE LITE AQR" },
  { id: "4", value: "VXE LITE FP" },
  { id: "5", value: "VXE LITE" },
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
  { id: "9", value: "Text with more than 50 Figures, Tables, Extract and Box" },
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

const indexTypeList = [
  { id: "1", value: "Subject-Only Text" },
  { id: "2", value: "Author-Only" },
  { id: "3", value: "Combined" },
  { id: "4", value: "No Index" },
];

const legalTableList = [
  { id: "1", value: "No" },
  { id: "2", value: "Onshore" },
  { id: "3", value: "Offshore" },
];

const workflowList = [
  { id: "1", value: "PDF Only" },
  { id: "2", value: "FP only in Pro Editor" },
  { id: "3", value: "FP & Revised Pages in Pro Editor" },
  { id: "4", value: "c4 Wrokflow" },
  { id: "5", value: "Page Numbers Only" },
];

const authorEditorType = [
  { id: "1", value: "Author" },
  { id: "2", value: "Editor" },
];

const xmlTypeList = [
  { id: "1", value: "DOCBOOK" },
  { id: "2", value: "NLM" },
  { id: "3", value: "DOCBOOK/MathML" },
  { id: "4", value: "NLM/MathML" },
];

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

export default function ConfigurationForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const formType = props.type;
  const [bookValidation, setBookValidation] = useState({
    title: false,
    projectManager: false,
    productionEditor: false,
    startDate: false,
    endDate: false,
    type: false,
    category: false,
    xmlType: false,
    editorType: false,
    isbn: false,
  });

  const [data, setData] = useState({
    title: "",
    subTitle: "",
    publisher: props.clientData.name,
    abbreviation: "",
    productionEditor: "",
    journalEditor: "",
    projectManager: "",
    projectManagerId: "",
    xmlType: "",
    xmlTypeId: "",
    printISSN: "",
    onlineISSN: "",
    templateName: "",
    nlmTitle: "",
    issueFrequency: "",
    description: "",
    client: props.clientData.id,

    author: "",
    authorMailId: "",
    startDate: "",
    endDate: "",
    edition: "",
    bookCode: "",
    isbn: "",
    projectID: "",
    productionEditorMailId: "",
    type: "",
    typeId: "",
    category: "",
    categoryId: "",
    avatar: "",
    userImg: "",
    PMList: [],
    typeList: [],
    categoryList: [],

    // meta form
    imprint: "",
    series: "",
    volume: "",
    doi: "",
    hardbackIsbn: "",
    paperBackIsbn: "",
    ebookSet: "",
    bisacCode: "",
    subject: "",
    keyWords: "",
    orcidID: "",
    productionDate: "",
    binding: "",
    dac: "",
    paperback: "",
    ebookMaster: "",
    mobiIsbn: "",
    ebookPdf: "",
    epubIsbn: "",
    epub2Isbn: "",
    thema: "",
    bicCodes: "",

    // invoice
    poNo: "",
    po2No: "",
    publisherWordCount: "",
    wordCount: "",
    publisherPageEstimate: "",
    pageEstimate: "",
    typesetPages: "",
    PMComplexity: "",
    CEComplexity: "",
    TSComplexity: "",
    OffshorePM: "",
    OffshoreCE: "",
    indexCharge: "",
    indexType: "",
    indexInvoice: "",
    indexer: "",
    origin: "",
    currency: "",
    otherCost: "",
    otherCostValue: "",
    legalTable: "",
    simpleRedraws: "",
    mediumRedraws: "",
    complexRedraws: "",
    relables: "",
    proofReading: "",

    // production details
    trimSize: "",
    typeface: "",
    template: "",
    abbreviation: "",
    coverDetails: "",
    editorType: "",
    equation: "",
    workflow: "",
    textDesign: "",
    textDesignNotes: "",
    tocAbbr: "",
    xmlType: "",
    interiorColour: "",
    pantone: "",
    lineFigures: "",
    halfTones: "",
    tables: "",
    artWorkDetails: "",
    prrof: "",
    complexity: "",

    // checkbox
    multipleauthorStatus: "",
    isbn10: "",
    contentGeneration: "",
    aitrigger: "",
    collectFootnote: "",

    // radio
    deliverablesPdf: "",
    deliverablesEbooks: "",
    deliverablesXml: "",
    projectStatus: "",
    thema: "",
    bicCodes: "",
    printISBN: "",
  });

  const inputElement = useRef(null);

  const [metaDataShow, setMetaDataShow] = useState(false);
  const [invoicingShow, setInvoicing] = useState(false);
  const [productionDetailsShow, setProductionDetails] = useState(false);
  const [productionValidation, setProductionValidation] = useState(false);

  useEffect(() => {
    handlingData();
  }, []);

  useEffect(() => {
    handleType();
  }, [data.type]);

  const handleType = () => {
    setData((prevState) => ({
      ...prevState,
      categoryList:
        data.typeId !== ""
          ? props.clientData.categoryList
              .filter((item) => item.typeId.toString().includes(data.typeId))
              .map(({ id, name, ...rest }) => ({
                ...rest,
                id,
                value: name,
              }))
          : [],
    }));
  };

  const handleMetaaData = () => {
    setMetaDataShow((metaDataShow) => !metaDataShow);
  };
  const handleInvoicing = () => {
    setInvoicing((invoicingShow) => !invoicingShow);
  };
  const handleProductionDetails = () => {
    setProductionDetails((productionDetailsShow) => !productionDetailsShow);
  };

  // file upload functions
  const fileUploadAction = () => {
    inputElement.current.click();
  };

  const fileUploadInputChange = (e) => {
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
      fetch(`${import.meta.env.VITE_URL_API_SERVICE}/file/upload/avatar`, {
        method: "POST",
        body: data,
        headers: {
          "Lanstad-Token": token,
        },
      })
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
    if (formType !== "journal" && !productionDetailsShow) {
      setProductionDetails(true);
      setProductionValidation(true);
    }
    const validation = await defaultValidation();
    if (!validation) {
      setIsLoading(true);
      // new journal - form submit

      const bodyRequest = {
        title: data.title,
        subTitle: data.subTitle,
        publisher: data.publisher,
        abbreviation: data.abbreviation,
        productionEditor: data.productionEditor,
        journalEditor: data.journalEditor,
        projectManager: data.projectManager,
        xmlType: data.xmlType,
        printISSN: data.printISSN,
        onlineISSN: data.onlineISSN,
        templateName: data.templateName,
        nlmTitle: data.nlmTitle,
        issueFrequency: data.issueFrequency,
        description: data.description,
        client: props.clientData.id,
        userImg: data.userImg,
      };

      await api
        .post("/configuration/create/journal", bodyRequest)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const handlingData = () => {
    // PM dropdown
    const newPMList = props.clientData.companyhasuserList
      .filter((item) => {
        if (item.role.toLowerCase() === "project manager") {
          if (item.role.toLowerCase().includes("project manager")) {
            return item;
          }
        }
      })
      .map(({ id, fullname, ...rest }) => ({
        ...rest,
        id,
        value: fullname,
      }));

    // type list
    const newTypeList = props.clientData.typeList.map(
      ({ id, name, ...rest }) => ({
        ...rest,
        id,
        value: name,
      }),
    );

    setData({
      ...data,
      PMList: newPMList,
      typeList: newTypeList,
    });
  };

  // checking validation while click submit buttion
  const defaultValidation = () => {
    if (formType === "book") {
      setBookValidation({
        ...bookValidation,
        title: data.title === "",
        productionEditor: data.productionEditor === "",
        projectManager: data.projectManager === "",
        startDate: data.startDate === "",
        endDate: data.endDate === "",
        type: data.type === "",
        category: data.category === "",
        xmlType: data.xmlType === "",
        editorType: data.editorType === "",
        isbn: data.isbn === "",
      });
      const res = Object.values(bookValidation).indexOf(true) > -1;
      return res;
    }
  };

  const handleInputValidation = (field, value) => {
    if (formType === "book") {
      setBookValidation({
        ...bookValidation,
        [field]: value === "",
      });
    }
  };

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (name in bookValidation) {
          handleInputValidation(name, value);
        }

        setData((prevState) => ({
          ...prevState,
          [name]: value || "",
        }));
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = e.target.getAttribute("data-value");
        const keyValue = JSON.parse(e.target.getAttribute("data-id"));
        setData((prevState) => ({
          ...prevState,
          [eleName]: eleValue || "",
          [`${eleName}Id`]: keyValue.id ? keyValue.id : "",
        }));
        if (eleName in bookValidation) {
          handleInputValidation(eleName, value);
        }
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
              {data.avatar !== "" && (
                <img src={data.avatar ? `${data.avatar}` : ""} />
              )}
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
            hasError={bookValidation?.title}
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
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Abbreviations */}
          {formType !== "book" && (
            <Input
              label="Abbreviations"
              name="abbreviation"
              value={data?.abbreviation}
              handleOnChange={(e) => handleOnChange(e)}
              maxLength="255"
            />
          )}

          {/* >Author or Editor */}
          {formType === "book" && (
            <Input
              label="Author or Editor"
              name="author"
              value={data?.author}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Author Mail ID */}
          {formType === "book" && (
            <Input
              label="Author Mail ID"
              name="authorMailId"
              value={data?.authorMailId}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Start Date */}
          <DatePicker
            type="date"
            name="startDate"
            label="Start Date *"
            defaultValue={new Date(data?.startDate)}
            getSelectedDate={(date) => handleOnChange(date)}
            titleError="Please enter the Start Date."
            hasError={bookValidation?.startDate}
          />

          {/* Publisher End Date */}
          <DatePicker
            type="date"
            name="endDate"
            label="Publisher End Date *"
            defaultValue={new Date(data?.endDate)}
            getSelectedDate={(event) => handleOnChange(event)}
            titleError="Please enter the Publisher End Date."
            hasError={bookValidation?.endDate}
          />

          {/* Edition */}
          {formType !== "journal" && (
            <Input
              label="Edition"
              name="edition"
              id="edition"
              value={data?.edition}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Journal Editor */}
          {formType === "journal" && (
            <Input
              label="Journal Editor/Editor in Chief"
              name="journalEditor"
              id="journalEditor"
              value={data?.journalEditor}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Print ISSN */}
          {formType === "journal" && (
            <Input
              label="Print ISSN"
              name="printISSN"
              id="printISSN"
              value={data?.printISSN}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Online ISSN */}
          {formType === "journal" && (
            <Input
              label="Online ISSN"
              name="onlineISSN"
              id="onlineISSN"
              value={data?.onlineISSN}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}
        </div>
        <div className="book-second-col">
          {/* Book Code */}
          {formType === "book" && (
            <Input
              label="Book Code"
              name="bookCode"
              id="bookCode"
              value={data?.bookCode}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* ISBN */}
          {formType === "book" && (
            <Input
              label="ISBN *"
              name="isbn"
              id="isbn"
              value={data?.isbn}
              handleOnChange={(e) => handleOnChange(e)}
              titleError="Please enter the Publisher ISBN."
              hasError={bookValidation?.endDate}
            />
          )}

          {/* XML type */}
          {formType === "journal" && (
            <Dropdown
              label="XML type"
              name="xmlType"
              value={data?.xmlType}
              valuesDropdown={xmlTypeList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />
          )}

          {/* Production Editor */}
          <Input
            label="Production Editor *"
            name="productionEditor"
            id="productionEditor"
            value={data?.productionEditor}
            titleError="Please enter the Production Editor."
            hasError={bookValidation?.productionEditor}
            handleOnChange={(e) => handleOnChange(e)}
          />

          {/* Production Editor Mail ID */}
          {formType !== "journal" && (
            <Input
              label="Production Editor Mail ID"
              name="productionEditorMailId"
              id="productionEditorMailId"
              value={data?.productionEditorMailId}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Template Name */}
          {formType === "journal" && (
            <Input
              label="Template Name"
              name="templateName"
              id="templateName"
              value={data?.templateName}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* NLM tilte Abbreviation */}
          {formType === "journal" && (
            <Input
              label="NLM tilte Abbreviation"
              name="nlmTitle"
              id="nlmTitle"
              value={data?.nlmTitle}
              handleOnChange={(e) => handleOnChange(e)}
            />
          )}

          {/* Issue Frequency */}
          {formType === "journal" && (
            <Dropdown
              label="Issue Frequency"
              name="issueFrequency"
              value={data?.issueFrequency}
              valuesDropdown={issueFrequencyList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />
          )}

          {/* Project manager */}
          <Dropdown
            label="Project manager *"
            name="projectManager"
            value={data?.projectManager}
            valuesDropdown={data?.PMList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Project manager."
            hasError={bookValidation?.projectManager}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Type */}
          <Dropdown
            label="Type *"
            name="type"
            value={data?.type}
            valuesDropdown={data?.typeList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Type."
            hasError={bookValidation?.type}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Category */}
          <Dropdown
            label="Category *"
            name="category"
            value={data?.category}
            valuesDropdown={data?.categoryList}
            handleOnChange={(e) => handleOnChange(e)}
            titleError="Please Select Category."
            hasError={bookValidation?.category}
            iconName="keyboard_arrow_down"
            iconClassName="material-icons"
          />

          {/* Description */}
          {formType === "journal" && (
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
          )}
        </div>
      </div>
      {formType !== "journal" && (
        <div className="book-sub-menu" onClick={handleMetaaData}>
          <h3>Metadata</h3>
          <i className="material-icons-outlined">keyboard_arrow_down</i>
        </div>
      )}
      {/* metadata start */}
      {formType !== "journal" && metaDataShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            {/* Imprint */}
            {formType === "book" && (
              <Input
                label="Imprint"
                name="imprint"
                id="imprint"
                value={data?.imprint}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Series */}
            {formType === "book" && (
              <Input
                label="Series"
                name="series"
                id="series"
                value={data?.series}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Volume */}
            <Input
              label="Volume"
              name="volume"
              id="volume"
              value={data?.volume}
              handleOnChange={(e) => handleOnChange(e)}
            />
            {/* Print ISBN */}
            {formType === "mrw" && (
              <Input
                label="Print ISBN"
                name="printISBN"
                id="printISBN"
                value={data?.printISBN}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* DOI */}
            <Input
              label="DOI"
              name="doi"
              id="doi"
              value={data?.doi}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Hardback ISBN */}
            <Input
              label="Hardback ISBN"
              name="hardbackIsbn"
              id="hardbackIsbn"
              value={data?.hardbackIsbn}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Paperback ISBN */}
            <Input
              label="Paperback ISBN"
              name="paperBackIsbn"
              id="paperBackIsbn"
              value={data?.paperBackIsbn}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* E-Book set */}
            {formType === "book" && (
              <Input
                label="E-Book set"
                name="ebookSet"
                id="ebookSet"
                value={data?.ebookSet}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Bisac code */}
            <Input
              label="Bisac code"
              name="bisacCode"
              id="bisacCode"
              value={data?.bisacCode}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Subject */}
            {formType === "book" && (
              <Input
                label="Subject"
                name="subject"
                id="subject"
                value={data?.subject}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Key Words */}
            {formType === "book" && (
              <Input
                label="Key Words"
                name="keyWords"
                id="keyWords"
                value={data?.keyWords}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Orcid ID */}
            {formType === "book" && (
              <Input
                label="Orcid ID"
                name="orcidID"
                id="orcidID"
                value={data?.orcidID}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Thema */}
            {formType === "mrw" && (
              <Input
                label="Thema"
                name="thema"
                id="thema"
                value={data?.thema}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* BIC Codes */}
            {formType === "mrw" && (
              <Input
                label="BIC Codes"
                name="bicCodes"
                id="bicCodes"
                value={data?.bicCodes}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}
          </div>
          <div className="book-second-col">
            {/* Production Month */}
            <Input
              label="Production Month"
              name="productionDate"
              id="productionDate"
              value={data?.productionDate}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Print ISSN */}
            {formType === "mrw" && (
              <Input
                label="Print ISSN"
                name="printISSN"
                id="printISSN"
                value={data?.printISSN}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Online ISSN */}
            {formType === "mrw" && (
              <Input
                label="Online ISSN"
                name="onlineISSN"
                id="onlineISSN"
                value={data?.onlineISSN}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Binding */}
            {formType === "book" && (
              <Input
                label="Binding"
                name="binding"
                id="binding"
                value={data?.binding}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* DAC */}
            {formType === "book" && (
              <Input
                label="DAC"
                name="dac"
                id="dac"
                value={data?.dac}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* New in Paperback */}
            {formType === "book" && (
              <Input
                label="New in Paperback"
                name="paperback"
                id="paperback"
                value={data?.paperback}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* E-Book master ISBN */}
            {formType === "book" && (
              <Input
                label="E-Book master ISBN"
                name="ebookMaster"
                id="ebookMaster"
                value={data?.ebookMaster}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Mobi ISBN */}
            <Input
              label="Mobi ISBN"
              name="mobiIsbn"
              id="mobiIsbn"
              value={data?.mobiIsbn}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* E-Book PDF ISBN */}
            <Input
              label="E-Book PDF ISBN"
              name="ebookPdf"
              id="ebookPdf"
              value={data?.ebookPdf}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* ePUB ISBN */}
            <Input
              label="ePUB ISBN"
              name="epubIsbn"
              id="epubIsbn"
              value={data?.epubIsbn}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* ePUB2 ISBN */}
            {formType === "book" && (
              <Input
                label="ePUB2 ISBN"
                name="epub2Isbn"
                id="epub2Isbn"
                value={data?.epub2Isbn}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

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
        </div>
      )}
      {/* metadata end */}

      {/* Invoicing start */}
      {formType !== "journal" && (
        <div className="book-sub-menu mt-2" onClick={handleInvoicing}>
          <h3>Invoicing</h3>
          <i className="material-icons-outlined">keyboard_arrow_down</i>
        </div>
      )}
      {formType !== "journal" && invoicingShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            {/* PO Number */}
            <Input
              label="PO Number"
              name="poNo"
              id="poNo"
              value={data?.poNo}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* PO Number2 */}
            <Input
              label="PO Number2"
              name="po2No"
              id="po2No"
              value={data?.po2No}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Publisher Word count */}
            <Input
              label="Publisher Word count"
              name="publisherWordCount"
              id="publisherWordCount"
              value={data?.publisherWordCount}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Word count */}
            <Input
              label="Word count"
              name="wordCount"
              id="wordCount"
              value={data?.wordCount}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Publisher Page Estimate */}
            <Input
              label="Publisher Page Estimate"
              name="publisherPageEstimate"
              id="publisherPageEstimate"
              value={data?.publisherPageEstimate}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Page Estimate */}
            <Input
              label="Page Estimate"
              name="pageEstimate"
              id="pageEstimate"
              value={data?.pageEstimate}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* No.of Typeset Pages */}
            <Input
              label="No.of Typeset Pages"
              name="typesetPages"
              id="typesetPages"
              value={data?.typesetPages}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* PM Complexity */}
            <Dropdown
              label="PM Complexity"
              name="PMComplexity"
              value={data?.PMComplexity}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* CE Complexity */}
            <Dropdown
              label="CE Complexity"
              name="CEComplexity"
              value={data?.CEComplexity}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* TS Complexity */}
            <Dropdown
              label="TS Complexity"
              name="TSComplexity"
              value={data?.TSComplexity}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Offshore PM */}
            <Dropdown
              label="Offshore PM"
              name="OffshorePM"
              value={data?.OffshorePM}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Offshore CE */}
            <Dropdown
              label="Offshore CE"
              name="OffshoreCE"
              value={data?.OffshoreCE}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Index Charge */}
            <Input
              label="Index Charge"
              name="indexCharge"
              id="indexCharge"
              value={data?.indexCharge}
              handleOnChange={(e) => handleOnChange(e)}
            />
          </div>
          <div className="book-second-col">
            {/* Index Charge */}
            <Input
              label="Index Charge"
              name="indexCharge"
              id="indexCharge"
              value={data?.indexCharge}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Index Type */}
            <Dropdown
              label="Index Type"
              name="indexType"
              value={data?.indexType}
              valuesDropdown={indexTypeList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Index Invoice */}
            <Input
              label="Index Invoice"
              name="indexInvoice"
              id="indexInvoice"
              value={data?.indexInvoice}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Indexer */}
            <Dropdown
              label="Indexer"
              name="indexer"
              value={data?.indexer}
              valuesDropdown={indexerList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Origin */}
            <Dropdown
              label="Origin"
              name="origin"
              value={data?.origin}
              valuesDropdown={originList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Currency */}
            <Dropdown
              label="Currency"
              name="currency"
              value={data?.currency}
              valuesDropdown={currencyList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Additional Charges */}
            <Input
              label="Additional Charges"
              name="otherCost"
              id="otherCost"
              value={data?.otherCost}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Additional Charge Value */}
            <Input
              label="Additional Charge Value"
              name="otherCostValue"
              id="otherCostValue"
              value={data?.otherCostValue}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* PM Complexity */}
            <Dropdown
              label="PM Complexity"
              name="PMComplexity"
              value={data?.PMComplexity}
              valuesDropdown={complexityList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* No. of simple redraws */}
            <Input
              label="No. of simple redraws"
              name="simpleRedraws"
              id="simpleRedraws"
              value={data?.simpleRedraws}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* No. of medium redraws */}
            <Input
              label="No. of medium redraws"
              name="mediumRedraws"
              id="mediumRedraws"
              value={data?.mediumRedraws}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* No. of complex redraws */}
            <Input
              label="No. of complex redraws"
              name="complexRedraws"
              id="complexRedraws"
              value={data?.complexRedraws}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* No. of relables */}
            <Input
              label="No. of relables"
              name="relables"
              id="relables"
              value={data?.relables}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Proofreading */}
            <Input
              label="Proofreading"
              name="proofReading"
              id="proofReading"
              value={data?.proofReading}
              handleOnChange={(e) => handleOnChange(e)}
            />
          </div>
        </div>
      )}
      {/* Invoicing end */}

      {/* Production Details start */}
      {formType !== "journal" && (
        <div className="book-sub-menu mt-2" onClick={handleProductionDetails}>
          <h3>Production Details</h3>
          <i className="material-icons-outlined">keyboard_arrow_down</i>
        </div>
      )}
      {formType !== "journal" && productionDetailsShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            {/* Trim Size/Format */}
            {formType === "book" && (
              <Input
                label="Trim Size/Format"
                name="trimSize"
                id="trimSize"
                value={data?.trimSize}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Typeface */}
            {formType === "book" && (
              <Input
                label="Typeface"
                name="typeface"
                id="typeface"
                value={data?.typeface}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Interior colour */}
            <Input
              label="Interior colour"
              name="interiorColour"
              id="interiorColour"
              value={data?.interiorColour}
              handleOnChange={(e) => handleOnChange(e)}
            />

            {/* Template Name */}
            <Input
              label="Template Name"
              name="template"
              id="template"
              value={data?.template}
              handleOnChange={(e) => handleOnChange(e)}
            />

            <Dropdown
              label="XML type"
              name="xmlType"
              value={data?.xmlType}
              valuesDropdown={xmlTypeList}
              handleOnChange={(e) => handleOnChange(e)}
              iconName="keyboard_arrow_down"
              iconClassName="material-icons"
            />

            {/* Template Abbreviation */}
            {formType === "book" && (
              <Input
                label="Template Abbreviation"
                name="abbreviation"
                id="abbreviation"
                value={data?.abbreviation}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Cover Details */}
            {formType === "book" && (
              <Input
                label="Cover Details"
                name="coverDetails"
                id="coverDetails"
                value={data?.coverDetails}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Editor Type */}
            {formType === "book" && (
              <Dropdown
                label="Editor Type *"
                name="editorType"
                value={data?.editorType}
                valuesDropdown={editorTypeList}
                handleOnChange={(e) => handleOnChange(e)}
                iconName="keyboard_arrow_down"
                iconClassName="material-icons"
              />
            )}

            {/* No of Equations */}
            {formType === "book" && (
              <Input
                label="No of Equations"
                name="equation"
                id="equation"
                value={data?.equation}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Workflow */}
            {formType === "book" && (
              <Dropdown
                label="Workflow"
                name="workflow"
                value={data?.workflow}
                valuesDropdown={workflowList}
                handleOnChange={(e) => handleOnChange(e)}
                iconName="keyboard_arrow_down"
                iconClassName="material-icons"
              />
            )}

            {/* Text design */}
            {formType === "book" && (
              <Input
                label="Text design"
                name="textDesign"
                id="textDesign"
                value={data?.textDesign}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {/* Text design notes */}
            {formType === "book" && (
              <Input
                label="Text design notes"
                name="textDesignNotes"
                id="textDesignNotes"
                value={data?.textDesignNotes}
                handleOnChange={(e) => handleOnChange(e)}
              />
            )}

            {formType === "book" && (
              <div className="book-radio-block">
                <div className="wrap-field-label">
                  <label className="label-radio">Deliverables XML</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_xml"
                        value="Yes"
                        name="deliverables_xml"
                        onChange={(e) => setDeliverablesXml(e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_xml"
                        value="No"
                        name="deliverables_xml"
                        onChange={(e) => setDeliverablesXml(e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="wrap-field-label pl-4">
                  <label className="label-radio">Deliverables E-Books</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_ebooks"
                        value="Yes"
                        name="deliverables_ebooks"
                        onChange={(e) => setDeliverablesEbooks(e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_ebooks"
                        value="No"
                        name="deliverables_ebooks"
                        onChange={(e) => setDeliverablesEbooks(e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="wrap-field-label pl-4">
                  <label className="label-radio">Deliverables PDF</label>
                  <div className="flex-side">
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_pdf"
                        value="Yes"
                        name="deliverables_pdf"
                        onChange={(e) => setDeliverablesPdf(e.target.value)}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pure-material-radio">
                      <input
                        type="radio"
                        className="project-radio"
                        id="deliverables_pdf"
                        value="No"
                        name="deliverables_pdf"
                        onChange={(e) => setDeliverablesPdf(e.target.value)}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          {formType === "book" && (
            <div className="book-second-col">
              {/* TOC abbreviation */}
              <Input
                label="TOC abbreviation"
                name="tocAbbr"
                id="tocAbbr"
                value={data?.tocAbbr}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* TOC abbreviation */}
              <Input
                label="TOC abbreviation"
                name="tocAbbr"
                id="tocAbbr"
                value={data?.tocAbbr}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Pantone */}
              <Input
                label="Pantone"
                name="pantone"
                id="pantone"
                value={data?.pantone}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* No of line figures */}
              <Input
                label="No of line figures"
                name="lineFigures"
                id="lineFigures"
                value={data?.lineFigures}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* No of half tones */}
              <Input
                label="No of half tones"
                name="halfTones"
                id="halfTones"
                value={data?.halfTones}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* No of Tables */}
              <Input
                label="No of Tables"
                name="tables"
                id="tables"
                value={data?.tables}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Artwork Details */}
              <Input
                label="Artwork Details"
                name="artWorkDetails"
                id="artWorkDetails"
                value={data?.artWorkDetails}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Prrof */}
              <Input
                label="Prrof"
                name="prrof"
                id="prrof"
                value={data?.prrof}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Complexity */}
              <Dropdown
                label="Complexity"
                name="complexity"
                value={data?.complexity}
                valuesDropdown={complexityListType}
                handleOnChange={(e) => handleOnChange(e)}
                iconName="keyboard_arrow_down"
                iconClassName="material-icons"
              />

              <div>
                <label className="pure-material-checkbox">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="multipleauthor_status"
                    onChange={(e) =>
                      setMultipleauthorStatus(e.target.checked ? 1 : 0)
                    }
                  />
                  <span>Multiple Author</span>
                </label>
                <label className="pure-material-checkbox">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="isbn10"
                    onChange={(e) => setIsbn10(e.target.checked ? 1 : 0)}
                  />
                  <span>TOC</span>
                </label>
                <label className="pure-material-checkbox">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="content_generation"
                    onChange={(e) =>
                      setContentGeneration(e.target.checked ? 1 : 0)
                    }
                  />
                  <span>Collect TOC</span>
                </label>
                <label className="pure-material-checkbox">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="content_footnote"
                    onChange={(e) =>
                      setCollectFootnote(e.target.checked ? 1 : 0)
                    }
                  />
                  <span>Collect Footnote</span>
                </label>
                <label className="pure-material-checkbox">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="aitrigger"
                    onChange={(e) => setAitrigger(e.target.checked ? 1 : 0)}
                  />
                  <span>AI-trigger</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Production Details End */}
      <div className="adduseranotherclient add-user-button mt-4">
        <button type="button" className="btn btn-outline-primary mr-2">
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
