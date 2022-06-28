import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";
import { Tooltip } from "../../components/tooltip/tooltip";
import { EditBookModal } from "./components/editBookModal/editBookModal";
import EditArticleModal from "./components/editArticleModal/editArticleModal";
import Milestone from "./components/milestone/milestone";

import BriefViewer from "./components/briefViewer";

import "../../styles/milestones.css";
import "./styles/milestone.styles.css";

export function ArticleBookMilestone() {
  const [project, setProject] = useState({});
  const [chapter, setChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toggleInformation, setToggleInformation] = useState(false);
  const [skipEproofing, setSkipEproofing] = useState(false);
  const [collapseSupportingInformation, setCollapseSupportingInformation] =
    useState(true);
  const [openEditBookModal, setOpenEditBookModal] = useState(false);
  const [openEditArticleModal, setOpenEditArticleModal] = useState(false);
  const [modalBrief, setModalBrief] = useState(false);

  const [file64, setFile64] = useState("");
  const [mimeType, setMimeType] = useState("");

  const { user, permissions } = useAuth();
  const { projectId, chapterId } = useParams();

  useEffect(() => {
    if (chapterId) {
      document.title = "Lanstad — Article/Journal Overview";
    } else {
      document.title = "Lanstad — Book Overview";
    }
    handleData();
  }, []);

  async function handleData() {
    setIsLoading(true);
    const responseProject = await api
      .get(`/project/${projectId}`)
      .then((response) => {
        setProject(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    // if journals, then call this endpoint
    if (chapterId) {
      await api
        .get(`/project/journal/${projectId}/detail/${chapterId}`)
        .then((response) => {
          setChapter(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    await api
      .get(`/file/get?path=${responseProject.pmbriefLink}`)
      .then((response) => {
        setFile64(response.data.content);
        setMimeType(response.data.mimetype);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  }

  const downloadFileNew = (fileURL, fileName) => {
    // for non-IE
    if (!window.ActiveXObject) {
      const save = document.createElement("a");
      save.href = fileURL;
      save.target = "_blank";
      const filename = fileURL.substring(fileURL.lastIndexOf("/") + 1);
      save.download = fileName || filename;
      if (
        navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
        navigator.userAgent.search("Chrome") < 0
      ) {
        document.location = save.href;
        // window event not working here
      } else {
        const evt = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: false,
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
    }

    // for IE < 11
    else if (!!window.ActiveXObject && document.execCommand) {
      const isWindow = window.open(fileURL, "_blank");
      isWindow.document.close();
      isWindow.document.execCommand("SaveAs", true, fileName || fileURL);
      isWindow.close();
    }
  };

  const handleSupportingInformation = (event) => {
    event.preventDefault();
    const supportingInfo = document.querySelector(
      ".accordion-toggle.supporting-info",
    );

    if (supportingInfo.classList.contains("collapsed")) {
      setCollapseSupportingInformation(false);
    } else {
      setCollapseSupportingInformation(true);
    }
  };

  const handleSkipEproofing = (e) => {
    setSkipEproofing(e.target.checked);
  };

  const showFailToast = (message) => {
    document.querySelector(".deanta-toast-alert").classList.remove("hidden");
    document.querySelector(".deanta-toast-alert").classList.add("fail");
    document
      .querySelector(".deanta-toast-close")
      .addEventListener("click", () => {
        document.querySelector(".deanta-toast-alert").classList.add("hidden");
      });
    if (message === "error" || message.status === 400) {
      document.querySelector(".deanta-toast-text").innerHTML =
        "Due to connectivity issues the request could not be fulfilled. Please, try again.";
    } else {
      document.querySelector(".deanta-toast-text").innerHTML =
        message.statusText;
    }
  };

  const handleOpenEditArticleBookModal = () => {
    if (chapterId !== undefined) {
      setOpenEditArticleModal(true);
    } else {
      setOpenEditBookModal(true);
    }
  };

  const closeModals = () => {
    setOpenEditBookModal(false);
    setOpenEditArticleModal(false);
  };

  return (
    <Layout
      iconActive={chapter ? "Journals" : "Books"}
      permissions={permissions}
      user={user}
    >
      {isLoading && <Loading loadingText="loading..." />}

      {Object.keys(project).length > 0 && (
        <>
          {openEditBookModal && (
            <EditBookModal
              openEditBookModal={openEditBookModal}
              handleOnCloseEditBookModal={() => closeModals()}
              project={project}
              permissions={permissions}
            />
          )}

          {openEditArticleModal && (
            <EditArticleModal
              openEditArticleModal={openEditArticleModal}
              handleOnCloseEditArticleModal={() => closeModals()}
              chapter={chapter}
            />
          )}

          {/* Header */}
          <div className="page-header row no-gutters pt-4">
            <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
              {/* Journals (Article) */}
              {chapter ? (
                <>
                  <h3>
                    {project?.client} — {project?.title}
                  </h3>
                  <h2>{chapter?.chapter_title}</h2>
                </>
              ) : (
                // Books
                <>
                  <h3>
                    {project?.client} — Project Code {project?.bookcode}
                  </h3>
                  <h2>{project?.title}</h2>
                </>
              )}
            </div>

            {/* Edit / Back buttons */}
            <div className="d-flex col-4 col-sm-6 mr-auto align-items-right">
              <div className="d-flex mb-sm-0 mx-auto ml-sm-auto mr-sm-0">
                {!!parseInt(permissions?.books?.edit) && (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleOpenEditArticleBookModal()}
                  >
                    {/* Edit */}
                    Details
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-outline-primary ml-2"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
              </div>
            </div>
            {/* End Edit / Add / Create / Back buttons */}
          </div>
          {/* End Header */}

          {/* Information */}
          <div className="project-information-box">
            <div className="deanta-toast-alert hidden">
              <i className="material-icons-outlined hidden" />
              <p className="deanta-toast-text" />
              <button type="button" className="deanta-toast-close">
                <i className="material-icons-outlined">close</i>
              </button>
            </div>
            <div className="show-hide-information-block">
              {!toggleInformation ? (
                <a
                  href="#"
                  className="toggle-project-information"
                  onClick={() => setToggleInformation(!toggleInformation)}
                >
                  Less information
                  <i className="material-icons-outlined">visibility_off</i>
                </a>
              ) : (
                <a
                  href="#"
                  className="toggle-project-information"
                  onClick={() => setToggleInformation(!toggleInformation)}
                >
                  More information
                  <i className="material-icons-outlined">visibility</i>
                </a>
              )}

              <div
                className={
                  !toggleInformation
                    ? "content-block-information slider"
                    : "content-block-information slider closed"
                }
              >
                <div className="inline-block-position">
                  {chapter ? (
                    // Journals (Article)
                    <div className="project-information-blocks full-size">
                      <div className="singular-block-information">
                        <label>ARTICLE ID</label>
                        <p>{chapter?.chapterNo}</p>
                      </div>
                      <div className="singular-block-information">
                        <label>AUTHOR</label>
                        <p>{chapter?.author}</p>
                      </div>
                      <div className="singular-block-information">
                        <label>DOI</label>
                        <p>{chapter?.DOI}</p>
                      </div>
                      <div className="singular-block-information">
                        <label>START DATE</label>
                        <p>{moment(chapter?.startDate).format("DD/MM/YYYY")}</p>
                      </div>
                      <div className="singular-block-information">
                        <label>TARGET DATE</label>
                        <p>{moment(chapter?.endDate).format("DD/MM/YYYY")}</p>
                      </div>
                      <div className="singular-block-information">
                        <label>PROGRESS</label>
                        <div className="project-card-details">
                          <div className="progress-status">
                            <div className="label-bar-status">
                              <label>{chapter?.percent}% completed</label>
                            </div>
                            <div className="progress progress-sm">
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${chapter?.percent}%` }}
                                aria-valuenow={`${chapter?.percent}`}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Books
                    <>
                      <div className="project-information-thumbnail project-cover-wrapper">
                        {project?.projectImage !== "" && (
                          <img
                            alt="Projet"
                            src={`/file/src/?path=/epublishing/books/${project.projectImage}&storage=blob`}
                          />
                        )}
                      </div>
                      <div className="project-information-blocks">
                        <div className="singular-block-information">
                          <label>AUTHOR</label>
                          <p>{project.author}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>PROJECT MANAGER</label>
                          <p>{project.projectManager}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>PRODUCTION EDITOR</label>
                          <p>{project.productionEditor}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>ISBN</label>
                          <p>{project.isbn}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>START DATE</label>
                          <p>{project.startDate}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>TARGET DATE</label>
                          <p>{project.endDate}</p>
                        </div>
                        <div className="singular-block-information">
                          <label>PROGRESS</label>
                          <div className="project-card-details">
                            <div className="progress-status">
                              <div className="label-bar-status">
                                <label>{project.percent}% completed</label>
                              </div>
                              <div className="progress progress-sm">
                                <div
                                  className="progress-bar bg-success"
                                  role="progressbar"
                                  style={{ width: `${project.percent}%` }}
                                  aria-valuenow={`${project.percent}`}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {(project.pmbriefLink || project.marSheetLink) && (
                          <div
                            className="singular-block-information"
                            id="accordion"
                            role="tablist"
                            aria-multiselectable="true"
                          >
                            <label>Supporting Information</label>
                            <div className="panel panel-default">
                              <div
                                className="panel-heading"
                                role="tab"
                                id="headingOne"
                              >
                                <a
                                  className={
                                    collapseSupportingInformation
                                      ? "accordion-toggle supporting-info collapsed"
                                      : "accordion-toggle supporting-info"
                                  }
                                  role="button"
                                  data-toggle="collapse"
                                  data-parent="#accordion"
                                  href="#collapseOne"
                                  aria-expanded="true"
                                  aria-controls="collapseOne"
                                  onClick={(e) =>
                                    handleSupportingInformation(e)
                                  }
                                >
                                  {collapseSupportingInformation ? (
                                    <>
                                      Supporting Information
                                      <i
                                        className="material-icons-outlined"
                                        style={{ verticalAlign: "middle" }}
                                      >
                                        keyboard_arrow_down
                                      </i>
                                    </>
                                  ) : (
                                    <>
                                      Hide Supporting Information
                                      <i
                                        className="material-icons-outlined"
                                        style={{ verticalAlign: "middle" }}
                                      >
                                        keyboard_arrow_up
                                      </i>
                                    </>
                                  )}
                                </a>
                              </div>
                              <div
                                id="collapseOne"
                                className="panel-collapse collapse in"
                                role="tabpanel"
                                aria-labelledby="headingOne"
                              >
                                <div className="panel-body">
                                  <ul>
                                    {project.pmbriefLink &&
                                    mimeType.includes("pdf") ? (
                                      <li
                                        onClick={() => {
                                          setModalBrief(true);
                                        }}
                                      >
                                        <a href="#">Project Manager Brief</a>
                                      </li>
                                    ) : (
                                      <a
                                        href="#"
                                        onClick={() => {
                                          Lanstad.File.download(
                                            project.pmbriefLink,
                                            project.pmbrief,
                                          );
                                        }}
                                      >
                                        Project Manager Brief
                                      </a>
                                    )}

                                    {project.marSheetLink && (
                                      <li>
                                        <a
                                          href={`/file/src/?download=1&path=${project.marSheetLink}`}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Material Analysis Report
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* End Information */}

          {/* Start NavTag */}
          {chapter ? (
            <nav className="main-project-navigation">
              {!!parseInt(permissions?.milestones?.view) && (
                <a
                  href={`/project/journal/${project.projectId}/detail/${chapter.chapter_id}`}
                  className="active"
                >
                  <i className="material-icons-outlined">view_day</i> Milestones
                </a>
              )}

              {!!parseInt(permissions?.vxe?.view) && (
                <a
                  href={`/vxe/${project.projectId}/detail/${chapter.chapter_id}`}
                >
                  <i className="material-icons-outlined">format_shapes</i>
                  PRO Editor
                </a>
              )}

              {!!parseInt(permissions?.assets?.view) && (
                <a
                  href={`/project/assets/${project.projectId}/detail/${chapter.chapter_id}`}
                >
                  <i className="material-icons-outlined">folder</i>
                  Assets
                </a>
              )}

              {!!parseInt(permissions?.gallery?.view) && (
                <a
                  href={`/project/gallery/${project.projectId}/detail/${chapter.chapter_id}`}
                >
                  <i className="material-icons-outlined">collections</i>
                  Gallery
                </a>
              )}

              {!!parseInt(permissions?.books?.users?.view) && (
                <a
                  href={`/project/users/${project.projectId}/detail/${chapter.chapter_id}`}
                >
                  <i className="material-icons-outlined">group</i> Users
                </a>
              )}
            </nav>
          ) : (
            <nav className="main-project-navigation">
              {!!parseInt(permissions?.milestones?.view) && (
                <a href={`/project/${project.projectId}`} className="active">
                  <i className="material-icons-outlined">view_day</i> Milestones
                </a>
              )}

              {!!parseInt(permissions?.toc?.view) && project.isbn10 == 1 && (
                <a href={`/project/toc/${project.projectId}`}>
                  <i className="material-icons-outlined">toc</i>
                  TOC
                </a>
              )}

              {!!parseInt(permissions?.vxe?.view) && (
                <a href={`/vxe/${project.projectId}`}>
                  <i className="material-icons-outlined">format_shapes</i>
                  PRO Editor
                </a>
              )}

              {!!parseInt(permissions?.assets?.view) && (
                <a href={`/project/assets/${project.projectId}`}>
                  <i className="material-icons-outlined">folder</i>
                  Assets
                </a>
              )}

              {!!parseInt(permissions?.gallery?.view) && (
                <a href={`/project/gallery/${project.projectId}`}>
                  <i className="material-icons-outlined">collections</i>
                  Gallery
                </a>
              )}

              {!!parseInt(permissions?.books?.users?.view) && (
                <a href={`/project/users/${project.projectId}`}>
                  <i className="material-icons-outlined">group</i> Users
                </a>
              )}
            </nav>
          )}
          {/* End NavTag */}

          {/* Start Skip Eproofing */}
          <div className="skip-eproofing">
            <Tooltip
              content="Skip eProofing on Tasks that normally require it."
              direction="left"
            >
              <label
                htmlFor="skipEproof"
                className="task-material-checkbox mr-4"
              >
                <input
                  type="checkbox"
                  checked={skipEproofing}
                  onChange={(event) => handleSkipEproofing(event)}
                  id="skipEproof"
                />
                <span className="checkmark">Skip eProofing</span>
              </label>
            </Tooltip>
          </div>
          {/* End Skip Eproofing */}

          {/* Milestone accordion */}
          <Milestone
            project={project}
            user={user}
            permissions={permissions}
            chapter={chapter}
            skipEproofing={skipEproofing}
            showFailToast={(message) => showFailToast(message)}
          />

          {/* Modal Brief Viewer */}
          {modalBrief && (
            <BriefViewer
              setModalBrief={setModalBrief}
              modalBrief={modalBrief}
              download={downloadFileNew}
              file={project.pmbriefLink}
              fileName={project.pmbrief}
              file64={file64}
              mimeType={mimeType}
            />
          )}
        </>
      )}
    </Layout>
  );
}