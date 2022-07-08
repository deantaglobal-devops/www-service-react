import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { api } from "../../../../services/api";

import Modal from "../../../../components/Modal/modal";
import SideSlider from "../../../../components/sideSlider/SideSlider";
import Loading from "../../../../components/loader/Loading";

export default function ImageDetails({
  data,
  show,
  set,
  permissions,
  project,
}) {
  const [dataDetails, setDataDetails] = useState();
  const [nameChanged, setNameChanged] = useState();
  const [altChanged, setAltChanged] = useState("");
  const [keyChanged, setkeyChanged] = useState("");

  const [sliderHeader, setSliderHeader] = useState("Details");
  const [sliderWidth, setSliderWidth] = useState("");
  const [sliderStatus, setSliderStatus] = useState(false);

  const [editing, setEditing] = useState(false);
  const [showingRevisions, setShowingRevisions] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function getImage(image) {
      api
        .get(`/project/document/${image}`)
        .then((response) => {
          const newResponseObject = {
            name: response.data.document_name,
            src: response.data.document_path,
            type: response.data.document_type,
            task: response.data.document_description,
            updated: response.data.document_datetime,
            documentid: response.data.document_id,
            alttext: response.data.alttext,
            keywords: response.data.floatkeywords,
            revisionList: response.data.revisionList,
          };

          setDataDetails(newResponseObject);
          setAltChanged(newResponseObject?.alttext);
          setkeyChanged(newResponseObject?.keywords);
          setNameChanged(newResponseObject?.name);
          setSliderStatus(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getImage(data.document_id);
  }, [data, show, set]);

  async function handleSave() {
    await api
      .post("/project/assets/edit/filename", {
        documentId: data.document_id,
        documentName: nameChanged,
      })
      .then(() => {
        setEditing(false);
        return false;
      })
      .catch((err) => console.log(err));
  }

  function fileDownloadAction(_filePath) {
    let filePath = dataDetails?.src;

    if (_filePath) {
      filePath = _filePath;
    }
    const fileName = data.document_name;
    Lanstad.File.download(filePath, fileName);
  }

  function showRevision() {
    setSliderHeader("File History");
    setShowingRevisions(true);
  }

  function hideRevision() {
    setSliderHeader("Details");
    setShowingRevisions(false);
  }

  async function handleDelete() {
    await api
      .post("/project/gallery/delete", { documentid: [data?.document_id] })
      .then(() => {
        setOpenDeleteModal(false);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      {isLoading && <Loading loadingText="loading..." />}
      {sliderStatus && (
        <div id="side-slider-container">
          <SideSlider
            SIDESLIDER_PROPS={{
              SliderHeader: sliderHeader,
              SliderStatus: sliderStatus,
              SliderWidth: sliderWidth,
            }}
            showSlider={() => set(false)}
          >
            {!showingRevisions ? (
              <div id="image-details" className="image-details-hide">
                <div
                  className="content-details"
                  style={{ overflowY: "hidden", height: "auto" }}
                >
                  <div className="image-preview">
                    <img
                      alt="preview"
                      src={`${
                        import.meta.env.VITE_URL_API_SERVICE
                      }/file/src/?path=${dataDetails?.src}`}
                    />
                    <Link
                      href={`${
                        import.meta.env.VITE_URL_API_SERVICE
                      }/file/src/?path=${dataDetails?.src}`}
                      className="hide"
                      download
                    >
                      File
                    </Link>
                  </div>

                  <div className="action-image-details">
                    {editing ? (
                      !!parseInt(permissions?.gallery.delete) && (
                        <>
                          <a
                            href="#"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Cancel"
                            className="cancel-changes cancel-icon"
                            id="remove-Btn"
                            onClick={() => {
                              setEditing(false);
                            }}
                          >
                            <i className="material-icons-outlined">close</i>
                          </a>
                          <a
                            href="#"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Save"
                            className="save-changes save-icon"
                            id="save-Btn"
                            onClick={() => handleSave()}
                          >
                            <i className="material-icons-outlined">save</i>
                          </a>
                        </>
                      )
                    ) : (
                      <>
                        {!!parseInt(permissions?.gallery.download) && (
                          <a
                            href="#"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Download"
                            className="df download-file"
                            id="download-btn"
                            data-documentid={dataDetails?.documentid}
                            onClick={() => {
                              fileDownloadAction();
                            }}
                          >
                            <i className="material-icons-outlined">save_alt</i>
                          </a>
                        )}

                        {!!parseInt(permissions?.gallery.edit) && (
                          <a
                            href="#"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Edit"
                            className="df edit-item"
                            id="edit-Btn"
                            onClick={() => {
                              setEditing(true);
                            }}
                          >
                            <i className="material-icons-outlined">edit</i>
                          </a>
                        )}
                        {!!parseInt(permissions?.gallery.delete) && (
                          <a
                            href="#"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete"
                            className="df delete-item delete-icon"
                            id="delete-btn"
                            onClick={() => setOpenDeleteModal(true)}
                          >
                            <i className="material-icons-outlined">delete</i>
                          </a>
                        )}
                        <a
                          href="#"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Revisions"
                          className="df revisions"
                          id="revision-btn"
                          data-documentname="fig 1"
                          data-documentid="2686435"
                          data-projectid="243383"
                          data-chapterid="243383"
                          onClick={() => showRevision()}
                        >
                          <i className="material-icons-outlined">history</i>
                        </a>
                      </>
                    )}
                  </div>
                  <div className="general-infos">
                    <div className="name-file">
                      <p id="file-name-p">{!editing && nameChanged}</p>
                      <input
                        type="text"
                        className={editing ? "off name" : "off name hide"}
                        id="fileName"
                        defaultValue={dataDetails?.name}
                        onChange={(e) => {
                          setNameChanged(e.target.value);
                        }}
                      />
                      {!dataDetails?.name && (
                        <span className="error-msg">
                          File name can not be blank.
                        </span>
                      )}
                    </div>
                    <div className="flex-infos">
                      <div className="blocks-text">
                        <label>Task</label>
                        <p>{dataDetails?.task}</p>
                      </div>
                      <div className="blocks-text">
                        <label>Upload date</label>
                        <p>{moment(dataDetails?.updated).format("LLL")}</p>
                      </div>
                      <div className="blocks-text">
                        <label>Type</label>
                        <p>{dataDetails?.type}</p>
                      </div>
                      <div className="blocks-text">
                        <label>Alt Text</label>
                        <p id="alt-text-p">{!editing && altChanged}</p>
                        <input
                          type="text"
                          id="alttext"
                          defaultValue={dataDetails?.alttext}
                          className={editing ? "off" : "off hide"}
                          onChange={(e) => {
                            setAltChanged(e.target.value);
                          }}
                        />
                      </div>
                      <div className="blocks-text">
                        <label>Keywords</label>
                        <p id="keywords-p">{!editing && keyChanged}</p>
                        <input
                          type="text"
                          id="keywords"
                          defaultValue={dataDetails?.keywords}
                          className={editing ? "off" : "off hide"}
                          onChange={(e) => {
                            setkeyChanged(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="revisions-details">
                <div className="content-details">
                  <div className="image-preview">
                    <img
                      alt="detail"
                      src={`/file/src/?path=${dataDetails?.src}`}
                    />
                  </div>
                  <div className="action-image-details">
                    <a
                      href="#"
                      data-toggle="tooltip"
                      data-placement="left"
                      title="Back"
                      className="close-revisions on"
                      id="close-revisions-btn"
                      data-original-title="Back"
                      onClick={() => hideRevision()}
                    >
                      <i className="material-icons-outlined">replay</i>
                    </a>
                  </div>
                  <table className="table table-striped table-borderless table-oversize article-list-table">
                    <thead>
                      <tr>
                        <th className="lanstad-grey">Name</th>
                        <th className="lanstad-grey">Upload Date</th>
                        <th className="lanstad-grey">Task</th>
                        <th className="lanstad-grey" />
                      </tr>
                    </thead>
                    <tbody>
                      {dataDetails?.revisionList?.length > 0 &&
                        Array.from(dataDetails?.revisionList).map(
                          (revision, index) => (
                            <tr
                              className="taskRow revisionRow"
                              id="revision-row"
                              key={revision.document_name + index}
                            >
                              <td>{revision.document_name}</td>
                              <td>{revision.updatedDate}</td>
                              <td>{revision.document_description}</td>
                              <td>
                                <a
                                  href="#"
                                  className="download-revision"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title=""
                                  data-original-title="Download"
                                  onClick={() =>
                                    fileDownloadAction(revision.document_path)
                                  }
                                >
                                  <i className="material-icons-outlined saveRevision">
                                    save_alt
                                  </i>
                                </a>
                              </td>
                            </tr>
                          ),
                        )}
                      {dataDetails?.revisionList?.length === 0 && (
                        <tr className="taskRow revisionRow" id="revision-row">
                          <td colSpan="4">No revision files.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {openDeleteModal && (
              <Modal
                displayModal={openDeleteModal}
                closeModal={() => setOpenDeleteModal(false)}
                title="Confirmation"
                body="Are you sure you’d like to delete this image?"
                button1Text="Cancel"
                handleButton1Modal={() => setOpenDeleteModal(false)}
                Button2Text="Delete"
                handleButton2Modal={() => handleDelete()}
              />
            )}
          </SideSlider>
        </div>
      )}
      ;
    </>
  );
}
