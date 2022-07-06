import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

const fileSizeLimit = import.meta.env.VITE_REACT_APP_FILE_SIZE_LIMIT;

export default function newBook(props) {
  // complexity dropdown data
  const complexityList = [
    { id: 1, name: "Simple" },
    { id: 2, name: "Medium" },
    { id: 3, name: "Complex" },
  ];

  // indexer dropdown data
  const indexerList = [
    { id: 1, name: "Deanta" },
    { id: 2, name: "Author" },
    { id: 3, name: "Freelancer" },
  ];

  // origin dropdown data
  const originList = [
    { id: 1, name: "UK" },
    { id: 2, name: "UK" },
  ];

  // currency dropdown data
  const currencyList = [
    { id: "1", name: "Dollar" },
    { id: "2", name: "Euro" },
    { id: "3", name: "Yen" },
    { id: "4", name: "Pound" },
    { id: "5", name: "Rand" },
    { id: "6", name: "Rupee" },
    { id: "7", name: "Cent" },
    { id: "8", name: "Øre" },
    { id: "9", name: "Centavo" },
  ];

  // editoy type dropdown data
  const editorTypeList = [
    { id: "1", name: "VXE FP" },
    { id: "2", name: "VXE" },
    { id: "3", name: "VXE LITE AQR" },
    { id: "4", name: "VXE LITE FP" },
    { id: "5", name: "VXE LITE" },
  ];

  // complexity type
  const complexityListType = [
    { id: "1", name: "Only Text" },
    { id: "2", name: "Text with few Figures and Tables" },
    { id: "3", name: "Text with few Figures, Tables and Box" },
    { id: "4", name: "Text with few Figures, Tables, Extract and Box" },
    { id: "5", name: "Text with few Figures, Tables, Extract, List and Box" },
    {
      id: "7",
      name: "Text with few Figures, Tables, Extract, List, Math and Box",
    },
    { id: "8", name: "Text with more than 50 Figures, Tables and Box" },
    {
      id: "9",
      name: "Text with more than 50 Figures, Tables, Extract and Box",
    },
    {
      id: "10",
      name: "Text with more than 50 Figures, Tables, Extract, List and Box",
    },
    {
      id: "11",
      name: "Text with more than 50 Figures, Tables, Extract, List, Math and Box",
    },
    { id: "12", name: "Text with more than 100 Figures and Tables" },
    { id: "13", name: "Text with more than 100 Figures, Tables and Box" },
    {
      id: "14",
      name: "Text with more than 100 Figures, Tables, Extract and Box",
    },
    {
      id: "15",
      name: "Text with more than 100 Figures, Tables, Extract, List and Box",
    },
    {
      id: "16",
      name: "Text with more than 100 Figures, Tables, Extract, List, Math and Box",
    },
    { id: "17", name: "Table Project" },
    { id: "18", name: "Design Project" },
    { id: "19", name: "Math Project" },
    { id: "20", name: "High Complex Project" },
  ];

  const indexTypeList = [
    { id: "1", name: "Subject-Only Text" },
    { id: "2", name: "Author-Only" },
    { id: "3", name: "Combined" },
    { id: "4", name: "No Index" },
  ];

  const indextInvoiceList = [
    { id: "1", name: "To Publisher" },
    { id: "2", name: "To Author" },
  ];

  const legalTableList = [
    { id: "1", name: "No" },
    { id: "2", name: "Onshore" },
    { id: "3", name: "Offshore" },
  ];

  const workflowList = [
    { id: "1", name: "PDF Only" },
    { id: "2", name: "FP only in Pro Editor" },
    { id: "3", name: "FP & Revised Pages in Pro Editor" },
    { id: "4", name: "c4 Wrokflow" },
    { id: "5", name: "Page Numbers Only" },
  ];

  const authorEditorType = [
    { id: "1", name: "Author" },
    { id: "2", name: "Editor" },
  ];

  const xmlTypeList = [
    { id: "1", name: "DOCBOOK" },
    { id: "2", name: "NLM" },
    { id: "3", name: "DOCBOOK/MathML" },
    { id: "4", name: "NLM/MathML" },
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

  // type list
  const { typeList } = props.clientData;
  // category list
  const clientCategoryList = props.clientData.categoryList;

  const [metaDataShow, setMetaDataShow] = useState(false);
  const [invoicingShow, setInvoicing] = useState(false);
  const [productionDetailsShow, setProductionDetails] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const inputElement = useRef(null);

  // general form
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [publisher, setPublisher] = useState(props.clientData.name);
  const [author, setAuthor] = useState("");
  const [authorMailId, setAuthorMailId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [edition, setEdition] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [isbn, setIsbn] = useState("");
  const [projectID, setProjectID] = useState("");
  const [productionEditor, setProductionEditor] = useState("");
  const [productionEditorMailId, setProductionEditorMailId] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [client, setClient] = useState(props.clientData.id);

  // metadata
  const [imprint, setImprint] = useState("");
  const [series, setSeries] = useState("");
  const [volume, setVolume] = useState("");
  const [doi, setDoi] = useState("");
  const [hardbackIsbn, setHardbackIsbn] = useState("");
  const [paperBackIsbn, setPaperBackIsbn] = useState("");
  const [ebookSet, setEbookSet] = useState("");
  const [bisacCode, setBisacCode] = useState("");
  const [subject, setSubject] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [orcidID, setOrcidID] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [binding, setBinding] = useState("");
  const [dac, setDac] = useState("");
  const [paperback, setPaperback] = useState("");
  const [ebookMaster, setEbookMaster] = useState("");
  const [mobiIsbn, setMobiIsbn] = useState("");
  const [ebookPdf, setEbookPdf] = useState("");
  const [epubIsbn, setEpubIsbn] = useState("");
  const [epub2Isbn, setEpub2Isbn] = useState("");
  const [dscription, setDscription] = useState("");

  // invoice
  const [poNo, setPoNo] = useState("");
  const [po2No, setPo2No] = useState("");
  const [publisherWordCount, setPublisherWordCount] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [publisherPageEstimate, setPublisherPageEstimate] = useState("");
  const [pageEstimate, setPageEstimate] = useState("");
  const [typesetPages, setTypesetPages] = useState("");
  const [PMComplexity, setPMComplexity] = useState("");
  const [CEComplexity, setCEComplexity] = useState("");
  const [TSComplexity, setTSComplexity] = useState("");
  const [OffshorePM, setOffshorePM] = useState("");
  const [OffshoreCE, setOffshoreCE] = useState("");
  const [indexCharge, setIndexCharge] = useState("");
  const [indexType, setIndexType] = useState("");
  const [indexInvoice, setIndexInvoice] = useState("");
  const [indexer, setIndexer] = useState("");
  const [origin, setOrigin] = useState("");
  const [currency, setCurrency] = useState("");
  const [otherCost, setOtherCost] = useState("");
  const [otherCostValue, setOtherCostValue] = useState("");
  const [legalTable, setLegalTable] = useState("");
  const [simpleRedraws, setSimpleRedraws] = useState("");
  const [mediumRedraws, setMediumRedraws] = useState("");
  const [complexRedraws, setComplexRedraws] = useState("");
  const [relables, setRelables] = useState("");
  const [proofReading, setProofReading] = useState("");
  const [altText, setAltText] = useState("");

  // production details
  const [trimSize, setTrimSize] = useState("");
  const [typeface, setTypeface] = useState("");
  const [template, setTemplate] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [coverDetails, setCoverDetails] = useState("");
  const [editorType, setEditorType] = useState("");
  const [equation, setEquation] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [textDesign, setTextDesign] = useState("");
  const [textDesignNotes, setTextDesignNotes] = useState("");
  const [tocAbbr, setTocAbbr] = useState("");
  const [xmlType, setXmlType] = useState("");
  const [interiorColour, setInteriorColour] = useState("");
  const [pantone, setPantone] = useState("");
  const [lineFigures, setLineFigures] = useState("");
  const [halfTones, setHalfTones] = useState("");
  const [tables, setTables] = useState("");
  const [artWorkDetails, setArtWorkDetails] = useState("");
  const [prrof, setPrrof] = useState("");
  const [complexity, setComplexity] = useState("");

  // checkbox
  const [multipleauthorStatus, setMultipleauthorStatus] = useState("0");
  const [isbn10, setIsbn10] = useState("0");
  const [contentGeneration, setContentGeneration] = useState("0");
  const [aitrigger, setAitrigger] = useState("0");
  const [collectFootnote, setCollectFootnote] = useState("0");

  // radio
  const [deliverablesPdf, setDeliverablesPdf] = useState("");
  const [deliverablesEbooks, setDeliverablesEbooks] = useState("");
  const [deliverablesXml, setDeliverablesXml] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userImg, setUserImg] = useState("");
  const [bookValidation, setBookValidation] = useState(false);

  const handleMetaaData = () => {
    setMetaDataShow((metaDataShow) => !metaDataShow);
  };
  const handleInvoicing = () => {
    setInvoicing((invoicingShow) => !invoicingShow);
  };
  const handleProductionDetails = () => {
    setProductionDetails((productionDetailsShow) => !productionDetailsShow);
  };

  const fileUploadAction = () => {
    inputElement.current.click();
  };

  const navigate = useNavigate();

  useEffect(() => {
    handleType(type);
  }, [type]);

  const handleType = (typeval) => {
    let categoryArr = [];
    if (typeval !== "") {
      categoryArr = clientCategoryList.filter((item) =>
        item.typeId.toString().includes(typeval),
      );
    }
    setCategoryList(categoryArr);
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
              setAvatar(URL.createObjectURL(newImage));
              setUserImg(response.filePath);
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

  const inputValidation = () => {
    let result = false;
    const titleValidation = handleValidation("title", title);
    const publisherValidation = handleValidation("publisher", publisher);
    const startdateValidation = handleValidation("start-date", startDate);
    const enddateValidation = handleValidation("end-date", endDate);
    const isbnValidation = handleValidation("isbn", isbn);
    const productioneditorValidation = handleValidation(
      "production-editor",
      productionEditor,
    );
    const projectmanagerValidation = handleValidation(
      "project-manager",
      projectManager,
    );
    const typeValidation = handleValidation("type", type);
    const categoryValidation = handleValidation("category", category);
    const editorTypeValidation = handleValidation("editor-type", editorType);
    const xmlTypeValidation = handleValidation("xml-type", xmlType);
    if (
      titleValidation &&
      publisherValidation &&
      startdateValidation &&
      enddateValidation &&
      isbnValidation &&
      productioneditorValidation &&
      projectmanagerValidation &&
      typeValidation &&
      editorTypeValidation &&
      xmlTypeValidation &&
      categoryValidation
    ) {
      result = true;
    }
    return result;
  };

  const handleValidation = (id, val) => {
    const errorSpan = document.getElementById(`${id}-validation`);
    let res = false;
    if (errorSpan) {
      errorSpan.classList.remove("is-invalid");
      res = true;
      if (val === "") {
        res = false;
        errorSpan.classList.add("is-invalid");
      }
    }
    return res;
  };

  useEffect(() => {
    handleValidation("editor-type", editorType);
    handleValidation("xml-type", xmlType);
  }, [bookValidation]);

  const formSubmit = async () => {
    if (!productionDetailsShow) {
      setProductionDetails(true);
      setBookValidation(true);
    }
    const validation = inputValidation();
    if (validation) {
      props.loadingIcon("show");
      // new book - form submit

      const bodyRequest = {
        // general form data
        project_name: title,
        subtitle: subTitle,
        publisher,
        author,
        author_mailid: authorMailId,
        project_startDate: startDate,
        project_endDate: endDate,
        edition,
        bookcode: bookCode,
        isbn,
        project_id: projectID,
        production_editor: productionEditor,
        productioneditor_mailid: productionEditorMailId,
        project_manager: projectManager,
        type,
        currency_id: category,
        company_id: client,

        // metaData form data
        Imprint: imprint,
        series,
        volume,
        doi,
        hardback_isbn: hardbackIsbn,
        paperback_isbn: paperBackIsbn,
        ebook_set: ebookSet,
        bisacCode,
        subject,
        keywords: keyWords,
        orcidID,
        published_date: productionDate,
        binding,
        dac,
        paperback,
        ebook_master: ebookMaster,
        mobi_isbn: mobiIsbn,
        ebook_pdf: ebookPdf,
        epub_isbn: epubIsbn,
        epub2_isbn: epub2Isbn,
        project_description: dscription,

        // Invoicing form data
        po_number: poNo,
        po_number2: po2No,
        publisher_word_count: publisherWordCount,
        word_count: wordCount,
        publisherPageEstimate,
        pageEstimate,
        typesetPages,
        PM_Complexity: PMComplexity,
        CE_Complexity: CEComplexity,
        TS_Complexity: TSComplexity,
        Offshore_PM: OffshorePM,
        Offshore_CE: OffshoreCE,
        index_charge: indexCharge,
        index_type: indexType,
        indexInvoice,
        Indexer: indexer,
        origin,
        currency,
        other_cost: otherCost,
        other_cost_description: otherCostValue,
        legalTable,
        simpleRedraws,
        mediumRedraws,
        complexRedraws,
        relables,
        proof_reading: proofReading,
        bisac_code: "",
        bisac_value: "",
        altText,

        // production details
        trim_size: trimSize,
        typeface,
        template,
        abbreviation,
        coverDetails,
        new_lxe: editorType,
        equation,
        workflow,
        text_design: textDesign,
        textDesignNotes,
        Toc_abbr: tocAbbr,
        xml_type: xmlType,
        interior_colour: interiorColour,
        pantone,
        line_figures: lineFigures,
        half_tones: halfTones,
        tables,
        artWorkDetails,
        prrof,
        complexity,

        // checkbox
        multiple_author: multipleauthorStatus,
        isbn10,
        content_generation: contentGeneration,
        aitrigger,
        collect_footnote: collectFootnote,
        // radio
        deliverables_pdf: deliverablesPdf,
        deliverables_ebooks: deliverablesEbooks,
        deliverables_xml: deliverablesXml,
        projectStatus,
        userImg,
        projectactive: 1,
        project_hold: deliverablesXml === "hold" ? 1 : 0,
        fmbmisvisible: 1,
        equations: 1,
        chapter_wise: 1,
        pmbiefFlag: 1,
        marFlag: 1,
        coverFlag: 1,
        USD: 1,
        gbp: 1,
        CopyrightYear: "",
        height: "",
        bisac3: "",
        bisac2: "",
        bisac1: "",
        width: "",
        totalpages: "",
        originator_1_phone: "",
        originator_1_details: "",
        job_number: "",
        project_priority: "",
        tps: "",
        multipleauthor_status: "",
        offshore_indexing: "",
        page_count: "",
        projectType: "book",
      };
      await api
        .post("/configuration/create/project", { Projects: bodyRequest })
        .then((response) => {
          props.loadingIcon("hide");
          if (response.data.status === "success") {
            navigate(`/project/${response.data.project_data.id}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
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
              {avatar !== "" && <img src={avatar ? `${avatar}` : ""} />}
            </form>
          </div>
        </div>
        <div className="right-side">
          <div className="wrap-field-label hide">
            <label className="label-radio">Status</label>
            <div className="flex-side status-flex">
              <label className="pure-material-radio">
                <input
                  type="radio"
                  className="project-radio"
                  id="projectStatus"
                  value="Active"
                  name="projectStatus"
                  onChange={(e) => setProjectStatus(e.target.value)}
                />
                <span>Active</span>
              </label>
              <label className="pure-material-radio">
                <input
                  type="radio"
                  className="project-radio"
                  id="projectStatus"
                  value="Completed"
                  name="projectStatus"
                  onChange={(e) => setProjectStatus(e.target.value)}
                />
                <span>Completed</span>
              </label>
              <label className="pure-material-radio">
                <input
                  type="radio"
                  className="project-radio"
                  id="projectStatus"
                  value="Hold"
                  name="projectStatus"
                  onChange={(e) => setProjectStatus(e.target.value)}
                />
                <span>On-Hold</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="book-main-content full-info-grid">
        <div className="book-first-col">
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Title *</label>
              <input
                className="default-input-text"
                type="text"
                id="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleValidation("title", e.target.value);
                }}
              />
            </div>
            <span className="validation-error" id="title-validation">
              Title cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Subtitle</label>
              <input
                className="default-input-text"
                type="text"
                id="subtitle"
                onChange={(e) => setSubTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Publisher *</label>
              <input
                className="default-input-text"
                type="text"
                id="publisher"
                value={publisher}
                onChange={(e) => {
                  setPublisher(e.target.value);
                  handleValidation("publisher", e.target.value);
                }}
                readOnly
              />
            </div>
            <span className="validation-error" id="publisher-validation">
              Publisher cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="wrap-field-label mt-4 inputWithSpan">
              <fieldset className="dropdown w-100">
                <div className="DdWrapper">
                  <label htmlFor="clientSelect">Author or Editor</label>
                  <div className="styled-select">
                    <select
                      id="authororeditor"
                      onChange={(e) => setAuthor(e.target.value)}
                    >
                      <option value="">Select Author or Editor</option>
                      {authorEditorType.map((data) => {
                        return (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Author Mail ID</label>
              <input
                className="default-input-text"
                type="text"
                id="author-mail"
                onChange={(e) => setAuthorMailId(e.target.value)}
              />
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Start Date *</label>
              <input
                className="default-input-text"
                type="date"
                id="start-date"
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleValidation("start-date", e.target.value);
                }}
                min="1997-01-01"
                max="2030-12-31"
              />
            </div>
            <span className="validation-error" id="start-date-validation">
              Start Date cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Publisher End Date*</label>
              <input
                className="default-input-text"
                type="date"
                id="end-date"
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleValidation("end-date", e.target.value);
                }}
                min="1997-01-01"
                max="2030-12-31"
              />
            </div>
            <span className="validation-error" id="end-date-validation">
              Publisher End Date cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Edition</label>
              <input
                className="default-input-text"
                type="text"
                id="edition"
                onChange={(e) => setEdition(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="book-second-col">
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Book Code</label>
              <input
                className="default-input-text"
                type="text"
                id="bookcode"
                onChange={(e) => setBookCode(e.target.value)}
              />
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">ISBN *</label>
              <input
                className="default-input-text"
                type="text"
                id="isbn"
                onChange={(e) => {
                  setIsbn(e.target.value);
                  handleValidation("isbn", e.target.value);
                }}
              />
            </div>
            <span className="validation-error" id="isbn-validation">
              ISBN cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Project ID</label>
              <input
                className="default-input-text"
                type="text"
                id="project-id"
                onChange={(e) => setProjectID(e.target.value)}
                readOnly
              />
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Production Editor *</label>
              <input
                className="default-input-text"
                type="text"
                id="production-editor"
                onChange={(e) => {
                  setProductionEditor(e.target.value);
                  handleValidation("production-editor", e.target.value);
                }}
              />
            </div>
            <span
              className="validation-error"
              id="production-editor-validation"
            >
              Production Editor cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="inputWrapper">
              <label className="label-form">Production Editor Mail ID</label>
              <input
                className="default-input-text"
                type="text"
                id="production-editor-mail"
                onChange={(e) => setProductionEditorMailId(e.target.value)}
              />
            </div>
          </div>
          <div className="wrap-field-label">
            <div className="wrap-field-label mt-4 inputWithSpan">
              <fieldset className="dropdown w-100">
                <div className="DdWrapper">
                  <label htmlFor="clientSelect">Project Manager*</label>
                  <div className="styled-select">
                    <select
                      id="project-manager"
                      onChange={(e) => {
                        setProjectManager(e.target.value);
                        handleValidation("project-manager", e.target.value);
                      }}
                    >
                      <option value="">Select Project Manager</option>
                      {projectManagerList.map((data) => {
                        return (
                          <option value={data.id} key={data.id}>
                            {data.fullname}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
            <span className="validation-error" id="project-manager-validation">
              Project Manager cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="wrap-field-label mt-4 inputWithSpan">
              <fieldset className="dropdown w-100">
                <div className="DdWrapper">
                  <label htmlFor="clientSelect">Type *</label>
                  <div className="styled-select">
                    <select
                      id="type"
                      onChange={(e) => {
                        setType(e.target.value);
                        handleValidation("type", e.target.value);
                      }}
                    >
                      <option value="">Select Type</option>
                      {typeList.map((data) => {
                        return (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
            <span className="validation-error" id="type-validation">
              Type cannot be blank.
            </span>
          </div>
          <div className="wrap-field-label">
            <div className="wrap-field-label mt-4 inputWithSpan">
              <fieldset className="dropdown w-100">
                <div className="DdWrapper">
                  <label htmlFor="clientSelect">Category*</label>
                  <div className="styled-select">
                    <select
                      id="category"
                      onChange={(e) => {
                        setCategory(e.target.value);
                        handleValidation("category", e.target.value);
                      }}
                    >
                      <option value="">Select Category</option>
                      {categoryList.map((data) => {
                        return (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </fieldset>
            </div>
            <span className="validation-error" id="category-validation">
              Category cannot be blank.
            </span>
          </div>
        </div>
      </div>

      <div className="book-sub-menu" onClick={handleMetaaData}>
        <h3>Metadata</h3>
        <i className="material-icons-outlined">keyboard_arrow_down</i>
      </div>
      {metaDataShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Imprint</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="imprint"
                  onChange={(e) => setImprint(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Series</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="series"
                  onChange={(e) => setSeries(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Volume</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="volume"
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">DOI</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="doi"
                  onChange={(e) => setDoi(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Hardback ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="hardback-isbn"
                  onChange={(e) => setHardbackIsbn(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Paperback ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="paperback-isbn"
                  onChange={(e) => setPaperBackIsbn(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">E-Book set</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="ebook-set"
                  onChange={(e) => setEbookSet(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Bisac code</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="bisac-codede"
                  onChange={(e) => setBisacCode(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Subject</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="subject"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Key Words</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="key-words"
                  onChange={(e) => setKeyWords(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Orcid ID</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="orcid-id"
                  onChange={(e) => setOrcidID(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="book-second-col">
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Production Month</label>
                <input
                  className="default-input-text"
                  type="month"
                  id="production-date"
                  onChange={(e) => setProductionDate(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Binding</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="binding"
                  onChange={(e) => setBinding(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">DAC</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="dac"
                  onChange={(e) => setDac(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">New in Paperback</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="paperback"
                  onChange={(e) => setPaperback(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">E-Book master ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="ebookMaster"
                  onChange={(e) => setEbookMaster(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Mobi ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="mobi-isbn"
                  onChange={(e) => setMobiIsbn(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">E-Book PDF ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="ebook-pdf"
                  onChange={(e) => setEbookPdf(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">ePUB ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="epub-isbn"
                  onChange={(e) => setEpubIsbn(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">ePUB2 ISBN</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="epub2-isbn"
                  onChange={(e) => setEpub2Isbn(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Description</label>
                <textarea
                  className="default-input-text"
                  id="project-description"
                  onChange={(e) => setDscription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoicing start */}
      <div className="book-sub-menu mt-2" onClick={handleInvoicing}>
        <h3>Invoicing</h3>
        <i className="material-icons-outlined">keyboard_arrow_down</i>
      </div>
      {invoicingShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">PO Number</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="po-number"
                  onChange={(e) => setPoNo(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">PO Number2</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="po-number"
                  onChange={(e) => setPo2No(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Publisher Word count</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="word-count"
                  onChange={(e) => setPublisherWordCount(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Word count</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="word-count"
                  onChange={(e) => setWordCount(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Publisher Page Estimate</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="word-count"
                  onChange={(e) => setPublisherPageEstimate(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Page Estimate</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="word-count"
                  onChange={(e) => setPageEstimate(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No.of Typeset Pages</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="word-count"
                  onChange={(e) => setTypesetPages(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">PM Complexity</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setPMComplexity(e.target.value)}
                      >
                        <option value="">Select PM Complexity</option>
                        {complexityList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">CE Complexity</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setCEComplexity(e.target.value)}
                      >
                        <option value="">Select CE Complexity</option>
                        {complexityList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">TS Complexity</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setTSComplexity(e.target.value)}
                      >
                        <option value="">Select TS Complexity</option>
                        {complexityList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Offshore PM</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setOffshorePM(e.target.value)}
                      >
                        <option value="">Select Offshore PM</option>
                        {complexityList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Offshore CE</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setOffshoreCE(e.target.value)}
                      >
                        <option value="">Select Offshore CE</option>
                        {complexityList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Index Charge</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="index-charge"
                  onChange={(e) => setIndexCharge(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="book-second-col">
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Index Type</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setIndexType(e.target.value)}
                      >
                        <option value="">Select Index Type</option>
                        {indexTypeList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Index Invoice</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="index-invoice"
                  onChange={(e) => setIndexInvoice(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Indexer</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setIndexer(e.target.value)}
                      >
                        <option value="">Select Indexer</option>
                        {indexerList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Origin</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setOrigin(e.target.value)}
                      >
                        <option value="">Select Origin</option>
                        {originList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Currency</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="">Select Currency</option>
                        {currencyList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Additional Charges </label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost"
                  onChange={(e) => setOtherCost(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Additional Charge Value</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost-value"
                  onChange={(e) => setOtherCostValue(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Legal Table</label>
                    <div className="styled-select">
                      <select
                        id="legal-table"
                        onChange={(e) => setLegalTable(e.target.value)}
                      >
                        <option value="">Select Legal Table</option>
                        {legalTableList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No. of simple redraws</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost"
                  onChange={(e) => setSimpleRedraws(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No. of medium redraws</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost"
                  onChange={(e) => setMediumRedraws(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No. of complex redraws</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost"
                  onChange={(e) => setComplexRedraws(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No. of relables</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="other-cost"
                  onChange={(e) => setRelables(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Proofreading</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="proof-reading"
                  onChange={(e) => setProofReading(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Alt Text</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="alt-text"
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoicing end */}

      {/* Production Details start */}
      <div className="book-sub-menu mt-2" onClick={handleProductionDetails}>
        <h3>Production Details</h3>
        <i className="material-icons-outlined">keyboard_arrow_down</i>
      </div>
      {productionDetailsShow && (
        <div className="book-main-content full-info-grid">
          <div className="book-first-col">
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Trim Size/Format</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="trim-size"
                  onChange={(e) => setTrimSize(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Typeface</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="typeface"
                  onChange={(e) => setTypeface(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Template Name</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="template"
                  onChange={(e) => setTemplate(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Template Abbreviation</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="abbreviation"
                  onChange={(e) => setAbbreviation(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Cover Details</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="cover-details"
                  onChange={(e) => setCoverDetails(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Editor Type *</label>
                    <div className="styled-select">
                      <select
                        id="editor-type"
                        onChange={(e) => {
                          setEditorType(e.target.value);
                          handleValidation("editor-type", e.target.value);
                        }}
                      >
                        <option value="">Select Editor Type</option>
                        {editorTypeList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
              <span className="validation-error" id="editor-type-validation">
                Editor Type cannot be blank.
              </span>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">No of Equations</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="equation"
                  onChange={(e) => setEquation(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Workflow</label>
                    <div className="styled-select">
                      <select
                        id="workflow"
                        onChange={(e) => setWorkflow(e.target.value)}
                      >
                        <option value="">Select Workflow</option>
                        {workflowList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Text design</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="text-design"
                  onChange={(e) => setTextDesign(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Text design notes</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="text-design-notes"
                  onChange={(e) => setTextDesignNotes(e.target.value)}
                />
              </div>
            </div>
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
          </div>
          <div className="book-second-col">
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">TOC abbreviation</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="toc-abbr"
                  onChange={(e) => setTocAbbr(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">XML type *</label>
                    <div className="styled-select">
                      <select
                        id="xml-type"
                        onChange={(e) => {
                          setXmlType(e.target.value);
                          handleValidation("xml-type", e.target.value);
                        }}
                      >
                        <option value="">Select XML type*</option>
                        {xmlTypeList.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
              <span className="validation-error" id="xml-type-validation">
                XML Type cannot be blank.
              </span>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Interior colour</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="interior-colour"
                  onChange={(e) => setInteriorColour(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Pantone</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="pantone"
                  onChange={(e) => setPantone(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Nº of line figures</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="line-figures"
                  onChange={(e) => setLineFigures(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Nº of half tones</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="half-tones"
                  onChange={(e) => setHalfTones(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Nº of Tables</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="tables"
                  onChange={(e) => setTables(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Artwork Details</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="artwork-details"
                  onChange={(e) => setArtWorkDetails(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Proof</label>
                <input
                  className="default-input-text"
                  type="text"
                  id="Prrof"
                  onChange={(e) => setPrrof(e.target.value)}
                />
              </div>
            </div>
            <div className="wrap-field-label">
              <div className="wrap-field-label mt-4 inputWithSpan">
                <fieldset className="dropdown w-100">
                  <div className="DdWrapper">
                    <label htmlFor="clientSelect">Complexity</label>
                    <div className="styled-select">
                      <select
                        id="client"
                        onChange={(e) => setComplexity(e.target.value)}
                      >
                        <option value="">Select Complexity</option>
                        {complexityListType.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
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
                  onChange={(e) => setCollectFootnote(e.target.checked ? 1 : 0)}
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
        </div>
      )}
      {/* Production Details End */}
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
          onClick={formSubmit}
        >
          Save
        </button>
      </div>
    </>
  );
}
