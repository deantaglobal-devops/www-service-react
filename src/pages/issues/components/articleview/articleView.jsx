import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../../../hooks/Auth";
import Layout from "../../../../components/layout/Layout";
import Loading from "../../../../components/loader/Loading";
import ManageIssue from "./components/manageIssue";
import { api } from "../../../../services/api";

import "../../../../styles/milestones.css";

export default function ArticleView(props) {
  const [project, setProject] = useState({});
  const [chapter, setChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toggleInformation, setToggleInformation] = useState(false);
  const [collapseSupportingInformation, setCollapseSupportingInformation] =
    useState(true);
  const [mimeType, setMimeType] = useState("");

  const { user, permissions } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  const handleData = async () => {
    setIsLoading(true);
    let responseProject;

    // if journals, then call this endpoint
    if (chapterId) {
      responseProject = await api
        .get(`/project/journal/${projectId}/detail/${chapterId}`)
        .then((response) => {
          setChapter(response.data);
          setProject(response.data);
          return response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      responseProject = await api
        .get(`/project/${projectId}`)
        .then((response) => {
          setProject(response.data);
          return response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (responseProject.pmbriefLink) {
      await api
        .get(`/file/get?path=${responseProject.pmbriefLink}`)
        .then((response) => {
          setMimeType(response.data.mimetype);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (chapterId) {
      document.title = "Lanstad — Article/Journal Overview";
    } else {
      document.title = "Lanstad — Book Overview";
    }
    handleData();
  }, []);

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

  return (
    <Layout iconActive="Journals" permissions={permissions} user={user}>
      {isLoading && <Loading loadingText="loading..." />}

      {Object.keys(project).length > 0 && (
        <>
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
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleOpenEditArticleBookModal()}
                >
                  {/* Edit */}
                  Edit issue
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary ml-2"
                  onClick={() => navigate(-1)}
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
                  className="toggle-project-information"
                  onClick={() => setToggleInformation(!toggleInformation)}
                >
                  Less information
                  <i className="material-icons-outlined">visibility_off</i>
                </a>
              ) : (
                <a
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
                            // src={`/file/src/?path=/epublishing/books/${project.projectImage}&storage=blob`}
                            src={`${
                              import.meta.env.VITE_URL_API_SERVICE
                            }/file/src/?path=/epublishing/books/${
                              project.projectImage
                            }&storage=blob`}
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
                                        <a>Project Manager Brief</a>
                                      </li>
                                    ) : (
                                      <a
                                        href="#"
                                        onClick={() => {
                                          handleDownload(project.pmbriefLink);
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
          <nav className="main-project-navigation issueTab">
            <Link to={`/project/${project.projectId}`}>
              <i className="material-icons-outlined">view_day</i> Milestones
            </Link>
            <Link to={`/project/toc/${project.projectId}`} className="active">
              Manage Issue Articles
            </Link>
            <Link to={`/project/assets/${project.projectId}`}>
              <i className="material-icons-outlined">folder</i>
              Assets
            </Link>
            <Link to={`/project/gallery/${project.projectId}`}>
              <i className="material-icons-outlined">collections</i>
              Gallery
            </Link>
            <Link to={`/project/users/${project.projectId}`}>
              <i className="material-icons-outlined">group</i> Users
            </Link>
          </nav>
          {/* End NavTag */}
          <ManageIssue />
        </>
      )}
    </Layout>
  );
}
