import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import Layout from "../../components/layout/Layout";
import ListAssets from "./components/ListAssets";
import Loading from "../../components/loader/Loading";

import "./styles/assets.styles.css";

export function AssetsMainPage() {
  const [project, setProject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [assets, setAssets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, permissions } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Digital Assets";

    handleData();
  }, []);

  const handleData = async () => {
    setIsLoading(true);
    const promiseProject = api.get(`/project/${projectId}`);
    if (chapterId) {
      const promiseChapterInfo = api.get(
        `/project/journal/${projectId}/detail/${chapterId}`,
      );
      const promiseAssetsChapter = api.get(
        `/project/assets/${projectId}/detail/${chapterId}`,
      );

      let milestones = null;
      let projectResponse = null;
      await Promise.all([
        promiseProject,
        promiseChapterInfo,
        promiseAssetsChapter,
      ])
        .then((response) => {
          milestones = response[1]?.data.milestone;

          projectResponse = response[0]?.data || [];
          setChapter(response[1]?.data || []);
          setAssets(response[2]?.data);

          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

      projectResponse = { ...projectResponse, milestones };

      setProject(projectResponse);
    } else {
      const promiseAssets = api.get(`/project/assets/${projectId}`);

      await Promise.all([promiseProject, promiseAssets])
        .then((response) => {
          setProject(response[0]?.data);
          setAssets(response[1]?.data);

          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  return (
    <Layout
      iconActive={chapter ? "Journals" : "Books"}
      permissions={permissions}
      user={user}
    >
      {isLoading && <Loading />}
      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        {chapter ? (
          <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
            <h3>
              {project?.client} - {project?.title}
            </h3>
            <h2>{chapter.chapter_title}</h2>
          </div>
        ) : (
          <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
            <h3>
              {project?.client} — Project Code {project?.bookcode}
            </h3>
            <h2>{project?.title}</h2>
          </div>
        )}

        {/* Back buttons */}
        <div className="d-flex col-4 col-sm-6 mr-auto align-items-right">
          <div className="d-flex mb-sm-0 mx-auto ml-sm-auto mr-sm-0">
            <button
              type="button"
              className="btn btn-outline-primary ml-2"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
        {/* Back buttons */}
      </div>
      {/* End Header */}

      <div className="project-information-box">
        {/* We need to fill info here */}
      </div>

      {/* Start NavTag */}

      {!chapter ? (
        <nav className="main-project-navigation">
          {!!parseInt(permissions?.milestones?.view) && (
            <Link to={`/project/${project?.projectId}`}>
              <i className="material-icons-outlined">view_day</i> Milestones
            </Link>
          )}

          {!!parseInt(permissions?.toc?.view) && (
            <Link to={`/project/toc/${project?.projectId}`}>
              <i className="material-icons-outlined">toc</i>
              TOC
            </Link>
          )}

          {!!parseInt(permissions?.vxe?.view) && (
            <Link to={`/vxe/${project?.projectId}`}>
              <i className="material-icons-outlined">format_shapes</i>
              PRO Editor
            </Link>
          )}

          {!!parseInt(permissions?.assets?.view) && (
            <Link
              to={`/project/assets/${project?.projectId}`}
              className="active"
            >
              <i className="material-icons-outlined">folder</i>
              Assets
            </Link>
          )}

          {!!parseInt(permissions?.gallery?.view) && (
            <Link to={`/project/gallery/${project?.projectId}`}>
              <i className="material-icons-outlined">collections</i>
              Gallery
            </Link>
          )}
          {!!parseInt(permissions?.books?.users?.view) && (
            <Link to={`/project/users/${project?.projectId}`}>
              <i className="material-icons-outlined">group</i> Users
            </Link>
          )}
        </nav>
      ) : (
        <nav className="main-project-navigation">
          {!!parseInt(permissions?.milestones?.view) && (
            <Link
              to={`/project/journal/${project?.projectId}/detail/${chapter?.chapter_id}`}
            >
              <i className="material-icons-outlined">view_day</i> Milestones
            </Link>
          )}

          {!!parseInt(permissions?.vxe?.view) && (
            <Link
              to={`/vxe/${project?.projectId}/detail/${chapter?.chapter_id}`}
            >
              <i className="material-icons-outlined">format_shapes</i>
              PRO Editor
            </Link>
          )}

          {!!parseInt(permissions?.assets?.view) && (
            <Link
              to={`/project/assets/${project?.projectId}/detail/${chapter?.chapter_id}`}
              className="active"
            >
              <i className="material-icons-outlined">folder</i>
              Assets
            </Link>
          )}

          {!!parseInt(permissions?.gallery?.view) && (
            <Link
              to={`/project/gallery/${project?.projectId}/detail/${chapter?.chapter_id}`}
            >
              <i className="material-icons-outlined">collections</i>
              Gallery
            </Link>
          )}

          {!!parseInt(permissions?.journals?.users?.view) && (
            <Link
              to={`/project/users/${project?.projectId}/detail/${chapter?.chapter_id}`}
            >
              <i className="material-icons-outlined">group</i> Users
            </Link>
          )}
        </nav>
      )}
      {/* End NavTag */}

      {assets && (
        <div className="row mt-4">
          <div className="col-lg-12">
            <ListAssets
              assets={assets}
              permissions={permissions}
              user={user}
              project={project}
              chapterInfo={chapter}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
