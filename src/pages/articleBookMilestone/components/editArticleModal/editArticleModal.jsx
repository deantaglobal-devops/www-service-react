import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../services/api";
import ModalForm from "../../../../components/ModalForm/modalForm";
import Loading from "../../../../components/loader/Loading";

import "./styles/editArticleModal.styles.css";

export default function EditArticleModal({
  openEditArticleModal,
  handleOnCloseEditArticleModal,
  chapter,
}) {
  const articleData = chapter?.article_edit_data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: articleData });

  const [isLoading, setIsLoading] = useState(false);
  const [isChaptActive, setIsChaptActive] = useState(false);

  const referenceEditingList = [
    { id: "1", value: "APA" },
    { id: "2", value: "AMA" },
    { id: "3", value: "Bioscientifica" },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);

    await api.put("/configuration/update/article", data);
    location.reload();
    setIsLoading(false);
  };

  const changeArticleStatus = (isChaptActive) => {
    setIsChaptActive(!isChaptActive);
  };

  useEffect(() => {
    articleData?.chapterActive === "1"
      ? setIsChaptActive(true)
      : setIsChaptActive(false);
  }, []);

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      <ModalForm show={openEditArticleModal}>
        <div className="modal-header">
          <h5 className="modal-title">Edit Article</h5>
          <button
            type="button"
            className="close"
            onClick={() => handleOnCloseEditArticleModal()}
          >
            <i className="material-icons">close</i>
          </button>
        </div>

        {/* Task type */}
        <div className="task-type-col mt-3 d-flex justify-content-end hide">
          <div className="d-flex flex-column">
            <div className="task-label-status">Status</div>
            <div className="w-100">
              <div className="custom-control-inline w-auto">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  name="chapterActive"
                  checked={!!isChaptActive}
                  {...register("chapterActive")}
                  onChange={() => changeArticleStatus(isChaptActive)}
                />
                <label className="">Active</label>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            {/* Title */}
            <div className="wrap-field-label">
              <label className="label-form">Title*</label>
              <input
                type="text"
                name="title"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <div className="cstm-error">Please enter the Title.</div>
              )}
            </div>

            {/* Article ID */}
            <div className="wrap-field-label">
              <label className="label-form">Article ID*</label>
              <input
                type="text"
                name="articleId"
                {...register("articleId", { required: true })}
              />
              {errors.articleId && (
                <div className="cstm-error">Please enter the Article ID.</div>
              )}
            </div>

            {/* Author */}
            <div className="wrap-field-label">
              <label className="label-form">Author*</label>
              <input
                type="text"
                name="author"
                {...register("author", { required: true })}
              />
              {errors.author && (
                <div className="cstm-error">Please enter the Author Name.</div>
              )}
            </div>

            {/* Article ID */}
            <div className="wrap-field-label">
              <label className="label-form">Author Mail ID</label>
              <input
                type="text"
                name="authorMailId"
                {...register("authorMailId")}
              />
            </div>

            {/* Start date */}
            <div className="wrap-field-label">
              <label className="label-form">Start Date*</label>
              <input
                type="date"
                className="default-input-text form-control"
                name="startDate"
                {...register("startDate", { required: true })}
              />
              {errors.startDate && (
                <div className="cstm-error">Please choose start date.</div>
              )}
            </div>

            {/* End Date */}
            <div className="wrap-field-label">
              <label className="label-form">End Date*</label>
              <input
                type="date"
                className="default-input-text form-control"
                name="endDate"
                {...register("endDate", { required: true })}
              />
              {errors.endDate && (
                <div className="cstm-error">Please choose start date.</div>
              )}
            </div>

            {/* Author Affiliation */}
            <div className="wrap-field-label">
              <label className="label-form">Author Affiliation</label>
              <input
                type="text"
                name="authorAffiliation"
                {...register("authorAffiliation")}
              />
            </div>

            {/* Funder Information */}
            <div className="wrap-field-label">
              <label className="label-form">Funder Information</label>
              <input
                type="text"
                name="title"
                {...register("funderInformation")}
              />
            </div>

            {/* Page Number */}
            <div className="wrap-field-label">
              <label className="label-form">Page Number</label>
              <input
                type="text"
                name="pageNumber"
                {...register("pageNumber")}
              />
              {errors.pageNumber && (
                <div className="cstm-error">Please enter the Title.</div>
              )}
            </div>

            {/* Ref Editing STD */}
            <div className="wrap-field-label" style={{ position: "relative" }}>
              <label className="label-form">
                Reference Editing Standard Set
              </label>

              <select
                name="referenceEditingStandardSet"
                {...register("referenceEditingStandardSet")}
              >
                {referenceEditingList?.map((data, index) => (
                  <option value={data.id} key={index}>
                    {data.value}
                  </option>
                ))}
              </select>
              <i
                className="material-icons"
                style={{ position: "absolute", right: "5px", top: "25px" }}
              >
                keyboard_arrow_down
              </i>
            </div>

            {/* DOI */}
            <div className="wrap-field-label">
              <label className="label-form">DOI</label>
              <input type="text" name="DOI" {...register("DOI")} />
            </div>

            {/* Publication Type */}
            <div className="wrap-field-label">
              <label className="label-form">Publication Type</label>
              <input
                type="text"
                name="publicationType"
                {...register("publicationType")}
              />
            </div>
          </div>
          <div className="col">
            {/* Received Date */}
            <div className="wrap-field-label">
              <label className="label-form">Received Date</label>
              <input
                type="date"
                className="default-input-text form-control"
                name="receivedDate"
                {...register("receivedDate")}
              />
            </div>

            {/* Revised Date */}
            <div className="wrap-field-label">
              <label className="label-form">Revised Date</label>
              <input
                type="date"
                className="default-input-text form-control"
                name="revisedDate"
                {...register("revisedDate")}
              />
            </div>

            {/* Accepted Date */}
            <div className="wrap-field-label">
              <label className="label-form">Accepted Date</label>
              <input
                type="date"
                className="default-input-text form-control"
                {...register("acceptedDate")}
                name="acceptedDate"
              />
            </div>

            {/* Abstract */}
            <div className="wrap-field-label">
              <label className="label-form">Abstract</label>
              <input type="text" {...register("abstract")} name="abstract" />
            </div>

            {/* Keywords */}
            <div className="wrap-field-label">
              <label className="label-form">Keywords</label>
              <input type="text" {...register("keywords")} name="keywords" />
            </div>

            {/* Open Access Licence */}
            <div className="wrap-field-label">
              <label className="label-form">Open Access Licence</label>
              <input
                type="text"
                {...register("openAccessLicence")}
                name="openAccessLicence"
              />
            </div>

            {/* Volume Number */}
            <div className="wrap-field-label">
              <label className="label-form">Volume Number</label>
              <input
                type="text"
                {...register("volumeNumber")}
                name="volumeNumber"
              />
            </div>

            {/* Issue Number */}
            <div className="wrap-field-label">
              <label className="label-form">Issue Number</label>
              <input
                type="text"
                {...register("issueNumber")}
                name="issueNumber"
              />
            </div>

            {/* Word count without references */}
            <div className="wrap-field-label">
              <label className="label-form">
                Word count without references
              </label>
              <input type="text" {...register("wordCount")} name="wordCount" />
            </div>

            {/* Reference word count */}
            <div className="wrap-field-label">
              <label className="label-form">Reference word count</label>
              <input
                type="text"
                {...register("referenceWordCount")}
                name="referenceWordCount"
              />
            </div>

            {/* Description */}
            <div className="wrap-field-label">
              <div className="inputWrapper">
                <label className="label-form">Description</label>
                <textarea
                  {...register("description")}
                  name="description"
                  className="default-input-text"
                  id="description"
                />
              </div>
            </div>

            <div className="wrap-field-label">
              <label className="label-radio">Disclosure Statement</label>
              <div className="flex-side-closure">
                <label className="pure-material-radio">
                  <input
                    type="radio"
                    className="project-radio"
                    id="disclosureStatement"
                    value="Yes"
                    name="disclosureStatement"
                    {...register("disclosureStatement")}
                  />
                  <span>Yes</span>
                </label>
                <label className="pure-material-radio">
                  <input
                    type="radio"
                    className="project-radio"
                    id="disclosureStatement"
                    value="No"
                    name="disclosureStatement"
                    {...register("disclosureStatement")}
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
            onClick={() => handleOnCloseEditArticleModal()}
          >
            Delete Article
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => handleOnCloseEditArticleModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleSubmit(onSubmit)}
          >
            Update
          </button>
        </div>
      </ModalForm>
    </>
  );
}
