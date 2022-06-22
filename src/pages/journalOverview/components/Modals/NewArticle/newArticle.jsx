import { useState } from "react";
import { api } from "../../../../../services/api";
import ModalForm from "../../../../../components/ModalForm/modalForm";
import DatePicker from "../../../../../components/datePicker/datePicker";
import Input from "../../../../../components/input/input";
import Loading from "../../../../../components/loader/Loading";
import Dropdown from "../../../../../components/dropdown/dropdown";

import "./styles/newArticle.styles.css";

export function NewArticle({ show, handleClose, projectId }) {
  const [data, setData] = useState({
    title: "",
    articleId: "",
    author: "",
    authorMailId: "",
    authorAffiliation: "",
    funderInformation: "",
    disclosureStatement: "",
    pageNumber: "",
    referenceEditingStandardSet: { id: "", value: "" },
    DOI: "",
    reviewers: "",
    publicationType: "",
    abstract: "",
    keywords: "",
    reviewerComments: "",
    contributorContact: "",
    openAccessLicence: "",
    volumeNumber: "",
    issueNumber: "",
    startDate: "",
    endDate: "",
    receivedDate: "",
    revisedDate: "",
    acceptedDate: "",
  });
  const [disclosureStatement, setDisclosureStatement] = useState("");
  const [description, setDescription] = useState("");
  const referenceEditingList = [
    { id: "1", value: "APA" },
    { id: "2", value: "AMA" },
    { id: "3", value: "Bioscientifica" },
  ];
  const [validateForm, setValidateForm] = useState({
    title: false,
    articleId: false,
    author: false,
    startDate: false,
    endDate: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    if (e) {
      const { name, value } = e?.target;
      if (name) {
        if (
          name === "title" ||
          name === "articleId" ||
          name === "author" ||
          name === "startDate" ||
          name === "endDate"
        ) {
          if (value === "" || value === null) {
            setValidateForm({ ...validateForm, [name]: true });
          } else {
            setValidateForm({ ...validateForm, [name]: false });
          }
        }
        setData((prevState) => ({
          ...prevState,
          [name]: value || "",
        }));
      } else {
        const eleName = e.target.getAttribute("name");
        const eleValue = JSON.parse(e.target.getAttribute("data-id"));
        setData((prevState) => ({
          ...prevState,
          [eleName]: eleValue || "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = await defaultValidation();
    if (!validation) {
      setIsLoading(true);
      // new article - form submit
      const bodyRequest = {
        title: data.title,
        articleId: data.articleId,
        author: data.author,
        authorMailId: data.authorMailId,
        authorAffiliation: data.authorAffiliation,
        funderInformation: data.funderInformation,
        disclosureStatement,
        pageNumber: data.pageNumber,
        referenceEditingStandardSet: data.referenceEditingStandardSet.id,
        DOI: data.DOI,
        publicationType: data.publicationType,
        abstract: data.abstract,
        keywords: data.keywords,
        openAccessLicence: data.openAccessLicence,
        volumeNumber: data.volumeNumber,
        issueNumber: data.issueNumber,
        startDate: data.startDate,
        endDate: data.endDate,
        receivedDate: data.receivedDate,
        revisedDate: data.revisedDate,
        acceptedDate: data.acceptedDate,
        description,
        projectId,
      };
      await api
        .post("/configuration/create/article", bodyRequest)
        .then((response) => {
          setIsLoading(false);
          if (response.data.status === "success") {
            document.location.href = `/project/journal/${projectId}/detail/${response.data.lastInsertedId}`;
          }
        });
    }

    // setIsLoading(false);
  };

  // checking validation while click submit buttion
  const defaultValidation = () => {
    const validateFormObject = {
      title: data.title === "",
      articleId: data.articleId === "",
      author: data.author === "",
      startDate: data.startDate === "",
      endDate: data.endDate === "",
    };

    const res = Object.values(validateFormObject).indexOf(true) > -1;

    setValidateForm((prevState) => ({
      ...prevState,
      title: data.title === "",
      articleId: data.articleId === "",
      author: data.author === "",
      startDate: data.startDate === "",
      endDate: data.endDate === "",
    }));

    return res;
  };

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <ModalForm show={show}>
        <form action="#" className="general-forms">
          <div className="modal-header">
            <h5 className="modal-title">Add Article</h5>
            <button
              type="button"
              className="close"
              onClick={() => handleClose()}
            >
              <i className="material-icons">close</i>
            </button>
          </div>

          {/* Task type */}
          <div className="task-type-col mt-3 d-flex justify-content-end hide">
            <div className="d-flex flex-column">
              <div className="task-label-status">Status</div>
              <div className="w-100">
                <div className="custom-control custom-radio custom-control-inline w-auto">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="1"
                    // id={`internal-${task.taskId}`}
                    // name={`taskType-${task.taskId}`}
                    // defaultChecked={task.statusType == 1 ? 'checked' : ''}
                    // onChange={(e) => handleOnChange(e, task.taskId)}
                    id="active"
                    defaultChecked="checked"
                  />
                  <label
                    className="custom-control-label status-value"
                    // htmlFor={`internal-${task.taskId}`}
                  >
                    Active
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline w-auto">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="2"
                    // id={`external-${task.taskId}`}
                    // name={`taskType-${task.taskId}`}
                    // defaultChecked={task.statusType == 2 ? 'checked' : ''}
                    // onChange={(e) => handleOnChange(e, task.taskId)}
                    id="completed"
                  />
                  <label
                    className="custom-control-label status-value"
                    // htmlFor={`external-${task.taskId}`}
                  >
                    Completed
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline w-auto">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="3"
                    // id={`pm-${task.taskId}`}
                    // name={`taskType-${task.taskId}`}
                    // defaultChecked={task.statusType == 3 ? 'checked' : ''}
                    // onChange={(e) => handleOnChange(e, task.taskId)}
                    id="onHold"
                  />
                  <label
                    className="custom-control-label status-value"
                    // htmlFor={`pm-${task.taskId}`}
                  >
                    On-hold
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col">
              {/* Title */}
              <Input
                label="Title*"
                name="title"
                id="title"
                value={data?.title}
                titleError="Please enter the Title."
                hasError={validateForm?.title}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Article ID */}
              <Input
                label="Article ID*"
                name="articleId"
                id="articleId"
                value={data?.articleId}
                titleError="Please enter the Article ID."
                hasError={validateForm?.articleId}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Author */}
              <Input
                label="Author*"
                name="author"
                id="author"
                value={data?.author}
                titleError="Please enter the Author."
                hasError={validateForm?.author}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Author Mail ID */}
              <Input
                label="Author Mail ID"
                name="authorMailId"
                id="authorMailId"
                value={data?.authorMailId}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Start date */}
              <DatePicker
                type="date"
                name="startDate"
                id="startDate"
                label="Start Date*"
                defaultValue={data?.startDate}
                getSelectedDate={(event) => handleOnChange(event)}
                titleError="Please select Start date."
                hasError={validateForm?.startDate}
              />

              {/* End Date */}
              <DatePicker
                type="date"
                name="endDate"
                id="endDate"
                label="End Date*"
                defaultValue={data?.endDate}
                getSelectedDate={(event) => handleOnChange(event)}
                titleError="Please select End date."
                hasError={validateForm?.endDate}
              />

              {/* Author Affiliation */}
              <Input
                label="Author Affiliation"
                name="authorAffiliation"
                id="authorAffiliation"
                value={data?.authorAffiliation}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Funder Information */}
              <Input
                label="Funder Information"
                name="funderInformation"
                id="funderInformation"
                value={data?.funderInformation}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Page Number */}
              <Input
                label="Page Number"
                name="pageNumber"
                id="pageNumber"
                value={data?.pageNumber}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Type */}
              <Dropdown
                label="Reference Editing Standard Set"
                name="referenceEditingStandardSet"
                value={data?.referenceEditingStandardSet?.value}
                valuesDropdown={referenceEditingList}
                handleOnChange={(e) => handleOnChange(e)}
                iconName="keyboard_arrow_down"
                iconClassName="material-icons"
              />

              {/* DOI */}
              <Input
                label="DOI"
                name="DOI"
                id="DOI"
                value={data?.DOI}
                handleOnChange={(e) => handleOnChange(e)}
              />
            </div>
            <div className="col">
              {/* Publication Type */}
              <Input
                label="Publication Type"
                name="publicationType"
                id="publicationType"
                value={data?.publicationType}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Received Date */}
              <DatePicker
                type="date"
                name="receivedDate"
                id="receivedDate"
                label="Received Date"
                defaultValue={data?.receivedDate}
                getSelectedDate={(event) => handleOnChange(event)}
              />

              {/* Revised Date */}
              <DatePicker
                type="date"
                name="revisedDate"
                id="revisedDate"
                label="Revised Date"
                defaultValue={data?.revisedDate}
                getSelectedDate={(event) => handleOnChange(event)}
              />

              {/* Accepted Date */}
              <DatePicker
                type="date"
                name="acceptedDate"
                id="acceptedDate"
                label="Accepted Date"
                defaultValue={data?.acceptedDate}
                getSelectedDate={(event) => handleOnChange(event)}
              />

              {/* Abstract */}
              <Input
                label="Abstract"
                name="abstract"
                id="abstract"
                value={data?.abstract}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Keywords */}
              <Input
                label="Keywords"
                name="keywords"
                id="keywords"
                value={data?.keywords}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Open Access Licence */}
              <Input
                label="Open Access Licence"
                name="openAccessLicence"
                id="openAccessLicence"
                value={data?.openAccessLicence}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Volume Number */}
              <Input
                label="Volume Number"
                name="volumeNumber"
                id="volumeNumber"
                value={data?.volumeNumber}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Issue Number */}
              <Input
                label="Issue Number"
                name="issueNumber"
                id="issueNumber"
                value={data?.issueNumber}
                handleOnChange={(e) => handleOnChange(e)}
              />

              {/* Description */}
              <div className="wrap-field-label">
                <div className="inputWrapper">
                  <label className="label-form">Description</label>
                  <textarea
                    className="default-input-text"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="wrap-field-label">
                <label className="label-radio">Disclosure Statement</label>
                <div className="flex-side-closure">
                  <label
                    htmlFor="disclosureStatement"
                    className="pure-material-radio"
                  >
                    <input
                      type="radio"
                      className="project-radio"
                      id="disclosureStatement"
                      value="Yes"
                      name="disclosureStatement"
                      onChange={(e) => setDisclosureStatement(e.target.value)}
                    />
                    <span>Yes</span>
                  </label>
                  <label
                    htmlFor="disclosureStatement"
                    className="pure-material-radio"
                  >
                    <input
                      type="radio"
                      className="project-radio"
                      id="disclosureStatement"
                      value="No"
                      name="disclosureStatement"
                      onChange={(e) => setDisclosureStatement(e.target.value)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer cta-right mt-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleClose()}
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
        </form>
      </ModalForm>
    </>
  );
}
