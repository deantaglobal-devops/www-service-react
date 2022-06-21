import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import { ArticlesTab } from "./components/articlesTab/articlesTab";
import { IssuesTab } from "./components/issuesTab/issuesTab";
import { EditJournal } from "./components/Modals/EditJournal/editJournal";
import { NewIssue } from "./components/Modals/NewIssue/newIssue";
import { NewArticle } from "./components/Modals/NewArticle/newArticle";
import Layout from "../../components/layout/Layout";
import Loading from "../../components/loader/Loading";

import "./styles/journalOverview.styles.css";

export function JournalOverview() {
  const [navTag, setNavTag] = useState("Articles");
  const [toggleInformation, setToggleInformation] = useState(false);
  const [project, setProject] = useState([]);
  const [issues, setIssues] = useState([]);
  const [articles, setArticles] = useState([]);

  const [openEditJournalModal, setOpenEditJournalModal] = useState(false);
  const [openNewIssueModal, setOpenNewIssueModal] = useState(false);
  const [openNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, permissions } = useAuth();
  const { projectId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Journal Overview";

    // fetching data to display it on dashboard page
    handleData();
  }, []);

  const handleData = async () => {
    setIsLoading(true);

    const projectData = api.get(`/project/${projectId}`);
    const articlesData = api.get(`/project/journal/list/${projectId}`);
    const issuesData = api.get(`/project/journal/${projectId}/issues`);

    Promise.all([projectData, articlesData, issuesData])
      .then((response) => {
        setProject(response[0]?.data || []);
        setArticles(response[1]?.data?.articleList || []);
        setIssues(response[2]?.data?.issues || []);

        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleClose = () => {
    setOpenEditJournalModal(false);
    setOpenNewIssueModal(false);
    setOpenNewArticleModal(false);
  };

  return (
    <Layout iconActive="Journals" permissions={permissions} user={user}>
      {isLoading && <Loading />}
      {openEditJournalModal && (
        <EditJournal
          show={openEditJournalModal}
          permissions={permissions}
          journalData={project}
          handleClose={() => handleClose()}
        />
      )}
      {openNewIssueModal && (
        <NewIssue
          show={openNewIssueModal}
          handleClose={() => handleClose()}
          project_id={project?.projectId}
        />
      )}
      {openNewArticleModal && (
        <NewArticle
          show={openNewArticleModal}
          handleClose={() => handleClose()}
          projectId={project?.projectId}
        />
      )}
      {/* ToolTip when hovering the green circle */}
      <div id="tooltip-black" style={{ display: "none" }}>
        <span id="tooltip-title-black" />
        <div id="arrow-black" data-popper-arrow />
      </div>
      {/* End ToolTip */}

      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
          <h3>{project?.subtitle}</h3>
          <h2>{project?.title}</h2>
        </div>

        {/* Edit / Add / Create / Back buttons */}
        <div className="d-flex col-4 col-sm-6 mr-auto align-items-right">
          <div
            className="d-flex mb-sm-0 mx-auto ml-sm-auto mr-sm-0"
            // style={{ width: "56%" }}
          >
            {permissions?.journals?.edit && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setOpenEditJournalModal(true)}
              >
                {/* Edit Journal */}
                Details
              </button>
            )}

            {permissions?.journals?.articles?.edit && (
              <button
                type="button"
                className="btn btn-outline-primary ml-2"
                onClick={() => setOpenNewArticleModal(true)}
              >
                Add Article
              </button>
            )}

            {permissions?.journals?.issues?.edit && (
              <button
                type="button"
                className="btn btn-outline-primary ml-2"
                onClick={() => setOpenNewIssueModal(true)}
              >
                Create Issue
              </button>
            )}
            <button
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
              <div className="project-information-thumbnail project-cover-wrapper">
                {project?.projectImage !== "" && (
                  <img
                    alt="project"
                    src={`${
                      import.meta.env.VITE_URL_API_SERVICE
                    }/file/src/?path=/epublishing/books/${
                      project?.projectImage
                    }&storage=blob`}
                  />
                )}
              </div>
              <div className="project-information-blocks">
                <div className="singular-block-information">
                  <label>ABBREVIATION</label>
                  <p>{project?.abbreviation}</p>
                </div>
                <div className="singular-block-information">
                  <label>PRODUCTION EDITOR</label>
                  <p>{project?.productionEditor}</p>
                </div>
                <div className="singular-block-information">
                  <label>EDITOR</label>
                  <p>{project?.author}</p>
                </div>
              </div>
              <div className="project-information-blocks">
                <div className="singular-block-information">
                  <label>CLIENT NAME</label>
                  <p>{project?.client}</p>
                </div>
                <div className="singular-block-information">
                  <label>PROJECT MANAGER</label>
                  <p>{project?.projectManager}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Information */}

      {/* NavTags */}
      <div className="nav-tags mt12">
        {permissions?.journals?.articles?.view && (
          <a
            className={navTag === "Articles" ? "active" : ""}
            onClick={() => setNavTag("Articles")}
          >
            Articles
          </a>
        )}
        {issues.length > 0 && permissions?.journals?.issues?.view && (
          <a
            className={navTag === "Issues" ? "active" : ""}
            onClick={() => setNavTag("Issues")}
          >
            Issues
          </a>
        )}
      </div>
      {/* End NavTags */}

      <div className="row mt-4">
        <div className="col-sm-12 col-lg-12 mb15">
          <div className="container-content-page mt-4">
            {navTag === "Articles" ? (
              // Articles
              <ArticlesTab
                permissions={permissions}
                articles={articles}
                project={project}
                navTag={navTag}
              />
            ) : (
              // Issues
              <IssuesTab
                permissions={permissions}
                issues={issues}
                project={project}
                navTag={navTag}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
