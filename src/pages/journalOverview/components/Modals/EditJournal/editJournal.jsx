import { useState, useEffect } from "react";
import { api } from "../../../../../services/api";
import ModalForm from "../../../../../components/ModalForm/modalForm";
import Input from "../../../../../components/input/input";
import Dropdown from "../../../../../components/dropdown/dropdown";
import Loading from "../../../../../components/loader/Loading";

const xmlTypeDropdown = [
  {
    id: 1,
    value: "DOCBOOK",
    labelDropdown: "DOCBOOK",
  },
  {
    id: 2,
    value: "NLM",
    labelDropdown: "NLM",
  },
  {
    id: 3,
    value: "DOCBOOK/MathML",
    labelDropdown: "DOCBOOK/MathML",
  },
  {
    id: 4,
    value: "NLM/MathML",
    labelDropdown: "NLM/MathML",
  },
];

export function EditJournal({ show, permissions, journalData, handleClose }) {
  const [data, setData] = useState(journalData);
  const [journalImageUpdated, setJournalImageUpdated] = useState("");
  const [journalImageFile, setJournalImageFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorList, setEditorList] = useState(journalData.journalEditorList);
  const [validateForm, setValidateForm] = useState({
    title: false,
    abbreviation: false,
    author: false,
    productionEditor: false,
  });

  useEffect(() => {
    if (data?.xmlType?.id !== "" && data?.xmlType?.id !== undefined) {
      xmlTypeDropdown.map((val) => {
        if (val.id === data?.xmlType?.id) {
          return (data.xmlType.value = val.value);
        }
      });
    }
    handlingData();
  }, []);

  const journalEditorField = (e) => {
    const editorListUpdated = editorList.map((data) => {
      if (data.uniq_id === e.target.name) {
        return { ...data, full_name: e.target.value };
      }
      return data;
    });
    setEditorList(editorListUpdated);
  };

  const handleAddNew = () => {
    const uniqueCode = Date.parse(new Date());
    setEditorList([
      ...editorList,
      { id: "", full_name: "", uniq_id: uniqueCode.toString() },
    ]);
  };

  const deleteEditorRow = (e) => {
    const selectedUniId = e.target.parentElement
      .querySelector("input")
      .getAttribute("name");
    const selectedId = e.target.parentElement
      .querySelector("input")
      .getAttribute("id");
    if (selectedId !== "") {
      const editorListUpdated = editorList.filter(
        (val) => selectedUniId !== val.uniq_id,
      );
      setEditorList(editorListUpdated);

      return api.delete(`/journal/editor/delete/${selectedId}`);
    }

    return false;
  };

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (name === "author") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, author: true });
          } else {
            setValidateForm({ ...validateForm, author: false });
          }
        } else if (name === "productionEditor") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, productionEditor: true });
          } else {
            setValidateForm({ ...validateForm, productionEditor: false });
          }
        } else if (name === "title") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, title: true });
          } else {
            setValidateForm({ ...validateForm, title: false });
          }
        } else if (name === "abbreviation") {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, abbreviation: true });
          } else {
            setValidateForm({ ...validateForm, abbreviation: false });
          }
        }

        if (name === "tps") {
          // Allow only numbers to be typed on input
          const re = /^[0-9\b]+$/;
          if (value === "" || re.test(value)) {
            setData((prevState) => ({
              ...prevState,
              [name]: value || "",
            }));
          }
        } else {
          setData((prevState) => ({
            ...prevState,
            [name]: value || "",
          }));
        }
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = e.target.getAttribute("data-value");
        const keyValue = JSON.parse(e.target.getAttribute("data-id"));

        if (
          eleName === "companyId" ||
          eleName === "projectManager" ||
          eleName === "projectPriority" ||
          eleName === "typeCategory" ||
          eleName === "category" ||
          eleName === "xmlType" ||
          eleName === "pmComplexity"
        ) {
          if (eleName === "companyId") {
            setData((prevState) => ({
              ...prevState,
              [eleName]: keyValue.id ? keyValue.id : "",
              client: keyValue.value ? keyValue.value : "",
            }));
          } else if (eleName === "projectManager") {
            setData((prevState) => ({
              ...prevState,
              [eleName]: keyValue.value ? keyValue.value : "",
              projectManagerId: keyValue.id ? keyValue.id : "",
            }));
          } else {
            setData((prevState) => ({
              ...prevState,
              [eleName]: keyValue || "",
            }));
          }
        } else {
          setData((prevState) => ({
            ...prevState,
            [eleName]: eleValue || "",
          }));
        }
      }
    }
  };

  const handlingData = () => {
    // Company dropdown
    const newCompanyList = data?.companyList.map(
      ({ company_id, company_name, ...rest }) => ({
        ...rest,
        id: company_id,
        value: company_name,
      }),
    );

    // Type dropdown
    const newTypeList = data?.TypeList.map(
      ({ type_id, type_name, ...rest }) => ({
        ...rest,
        id: type_id,
        value: type_name,
      }),
    );

    // Category dropdown
    const newCategoryList = data?.CategoryList.map(
      ({ category_id, category_name, ...rest }) => ({
        ...rest,
        id: category_id,
        value: category_name,
      }),
    );

    // PM dropdown
    const newPMList = data?.PMList.map(({ user_id, username, ...rest }) => ({
      ...rest,
      id: user_id,
      value: username,
    }));

    setData({
      ...data,
      PMList: newPMList,
      companyList: newCompanyList,
      TypeList: newTypeList,
      CategoryList: newCategoryList,
    });
  };

  const handleJournalImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      setJournalImageUpdated(URL.createObjectURL(img));
      setJournalImageFile(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(Object.values(validateForm).indexOf(true) > -1)) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("cover-image", journalImageFile);
      formData.append("journalcoverFlag", journalImageUpdated ? 0 : 1);
      formData.append("Journals[title]", data?.title);
      formData.append("Journals[project_id]", data?.projectId);
      formData.append("Journals[subTitle]", data?.subtitle);
      formData.append("Journals[client]", data?.companyId);
      formData.append("Journals[abbreviation]", data?.abbreviation);
      formData.append("Journals[production_editor]", data?.productionEditor);
      formData.append("Journals[project_manager]", data?.projectManagerId);
      formData.append("Journals[type]", data?.typeCategory?.id);
      formData.append("Journals[category]:", data?.category?.id);
      formData.append("Journals[description]", data?.description);
      formData.append("Journals[xmlType]", data?.xmlType?.id);
      formData.append("Journals[doi]", data?.isbn);
      formData.append("Journals[printISSN]:", data?.print_issn);
      formData.append("Journals[onlineISSN]", data?.online_issn);
      formData.append("Journals[templateName]", data?.template);
      formData.append("Journals[issueFrequency]", data?.issueFrequency);
      formData.append("Journals[chief]", data?.author);
      formData.append("Journals[project_priority]", data?.projectPriority.id);
      formData.append("Journals[projectactive]", data?.projectActive);
      formData.append("Journals[journalList]", JSON.stringify(editorList));

      const token = localStorage.getItem("lanstad-token");

      const requestOptions = {
        method: "PUT",
        headers: { "Lanstad-token": token },
        body: formData,
        // mode: "no-cors",
      };
      const response = await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/journal/update`,
        requestOptions,
      );
      const responseData = await response.json();

      if (responseData) {
        setIsLoading(false);
        // window.location.reload();
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <ModalForm show={show}>
        <form
          action="#"
          className="general-forms"
          id="journal-updateform"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="modal-header">
            <h5 className="modal-title">Edit Journal</h5>
            <button
              type="button"
              className="close"
              onClick={() => handleClose()}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="modal-body">
            <h3>General</h3>
            <div className="general-info">
              <div className="left-side flex-side">
                <div className="thumb-project" id="thumb-journal">
                  {journalImageUpdated === "" ? (
                    <img
                      alt="Issue cover"
                      className="profile-image"
                      id="IssuecoverImage"
                      src={`${
                        import.meta.env.VITE_URL_API_SERVICE
                      }/file/src/?path=/epublishing/books/${
                        data?.projectImage
                      }&storage=blob`}
                    />
                  ) : (
                    <img
                      alt="Journal cover"
                      className="profile-image"
                      id="JournalcoverImage"
                      src={journalImageUpdated}
                    />
                  )}

                  <i className="material-icons-outlined">add_photo_alternate</i>
                  <input
                    type="file"
                    className="image-file-input"
                    id="cover-image"
                    name="cover-image"
                    onChange={handleJournalImage}
                  />
                </div>
              </div>
            </div>

            {/* Settings/Additional Information */}
            {/* <h3>Settings/Additional Information</h3> */}
            <div className="full-info-grid">
              <div className="col-6">
                {/* Name */}
                <Input
                  label="Title *"
                  name="title"
                  value={data?.title ? data?.title : ""}
                  titleError="Please enter the Project Title."
                  hasError={validateForm?.title}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="200"
                />

                {/* Subtitle */}
                <Input
                  label="Subtitle"
                  name="subtitle"
                  value={data?.subtitle ? data?.subtitle : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="255"
                />

                {/* Publisher */}
                <Input
                  label="Publisher *"
                  name="publisher"
                  value={data?.client ? data?.client : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="255"
                  disabled
                />

                {/* Abbreviations */}
                <Input
                  label="Abbreviations *"
                  name="abbreviation"
                  value={data?.abbreviation ? data?.abbreviation : ""}
                  titleError="Please enter an Abbreviation."
                  hasError={validateForm?.abbreviation}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="255"
                />

                {/* Production editor */}
                <Input
                  label="Production editor *"
                  name="productionEditor"
                  value={data?.productionEditor ? data?.productionEditor : ""}
                  titleError="Please enter the Production Editor."
                  hasError={validateForm?.productionEditor}
                  handleOnChange={(e) => handleOnChange(e)}
                />

                {/* Project manager */}
                {permissions?.journals?.edit_project_manager ? (
                  <Dropdown
                    label="Project manager *"
                    name="projectManager"
                    value={data?.projectManager ? data?.projectManager : ""}
                    valuesDropdown={data?.PMList}
                    handleOnChange={(e) => handleOnChange(e)}
                    iconName="keyboard_arrow_down"
                    iconClassName="material-icons"
                  />
                ) : (
                  <>
                    <label className="label-form">Project manager</label>
                    <input
                      readOnly="readonly"
                      type="text"
                      className="form-control"
                      name="projectManager"
                      value={data?.projectManager ? data?.projectManager : ""}
                    />
                  </>
                )}

                {/* Type */}
                <Dropdown
                  label="Type *"
                  name="typeCategory"
                  id="selectedEndTime"
                  value={
                    data?.typeCategory?.value ? data?.typeCategory?.value : ""
                  }
                  valuesDropdown={data?.TypeList}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Category */}
                <Dropdown
                  label="Category *"
                  name="category"
                  value={data?.category?.value ? data?.category?.value : ""}
                  valuesDropdown={data?.CategoryList}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* Descritption */}
                <div className="wrap-field-label">
                  <label className="label-form">Description</label>
                  <textarea
                    className="default-textarea"
                    name="description"
                    value={data?.description ? data?.description : ""}
                    onChange={(e) => handleOnChange(e)}
                  />
                </div>
              </div>
              <div className="col-6">
                {/* XML type */}
                <Dropdown
                  label="XML type"
                  name="xmlType"
                  value={data?.xmlType?.value ? data?.xmlType?.value : ""}
                  valuesDropdown={xmlTypeDropdown}
                  handleOnChange={(e) => handleOnChange(e)}
                  iconName="keyboard_arrow_down"
                  iconClassName="material-icons"
                />

                {/* DOI */}
                <Input
                  label="DOI"
                  name="isbn"
                  value={data?.isbn ? data?.isbn : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="255"
                />

                {/* Print ISSN */}
                <Input
                  label="Print ISSN"
                  name="print_issn"
                  value={data?.print_issn ? data?.print_issn : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="200"
                />

                {/* Online ISSN */}
                <Input
                  label="Online ISSN"
                  name="online_issn"
                  value={data?.online_issn ? data?.online_issn : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                  maxLength="20"
                />

                {/* Template Name */}
                <Input
                  label="Template Name"
                  name="template"
                  value={data?.template ? data?.template : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                />

                {/* Template Name */}
                <Input
                  label="Issue Frequency"
                  name="issueFrequency"
                  value={data?.issueFrequency ? data?.issueFrequency : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                />

                {/* Project Priority */}
                <Input
                  label="Editor-in-Chief"
                  name="author"
                  value={data?.author ? data?.author : ""}
                  handleOnChange={(e) => handleOnChange(e)}
                />

                {/* JE Dynamic Fields */}
                {editorList?.map((dataItem) => (
                  <div className="jour-fields" key={dataItem?.id}>
                    <Input
                      label="Journal Editor"
                      name={dataItem?.uniq_id ? dataItem?.uniq_id : ""}
                      value={dataItem?.full_name ? dataItem?.full_name : ""}
                      id={dataItem?.id ? dataItem?.id : ""}
                      handleOnChange={(e) => journalEditorField(e)}
                    />
                    <i
                      className="material-icons-outlined"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                      onClick={(e) => deleteEditorRow(e)}
                    >
                      delete
                    </i>
                  </div>
                ))}

                <div className="secondary-navigation">
                  <a
                    // href="#"
                    className="add-si"
                    onClick={(e) => handleAddNew(e)}
                  >
                    <i className="material-icons-outlined">add</i> Add New
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer cta-right">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleClose()}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="journal-update-btn"
              className="btn btn-outline-primary"
            >
              Update
            </button>
          </div>
        </form>
      </ModalForm>
    </>
  );
}
