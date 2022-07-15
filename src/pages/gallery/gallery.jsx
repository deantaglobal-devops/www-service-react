import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import Layout from "../../components/layout/Layout";
import GalleryContent from "./components/galleryContent";
import Loading from "../../components/loader/Loading";

import "./styles/gallery.styles.css";

export function GalleryMainPage() {
  const [project, setProject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, permissions } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Gallery";
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

      let assetsGallery = null;
      let projectResponse = null;
      await Promise.all([
        promiseChapterInfo,
        promiseAssetsChapter,
        promiseProject,
      ])
        .then((response) => {
          projectResponse = response[2]?.data || [];
          assetsGallery = response[1]?.data.assetsGallery;
          setGallery(response[1]?.data);

          setChapter(response[0]?.data || []);

          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

      projectResponse = { ...projectResponse, assetsGallery };

      setProject(projectResponse);
    } else {
      const promiseAssets = api.get(`/project/assets/${projectId}`);

      let assetsGallery = null;
      let projectResponse = null;
      await Promise.all([promiseProject, promiseAssets])
        .then((response) => {
          projectResponse = response[0]?.data || [];
          assetsGallery = response[1]?.data.assetsGallery;

          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

      projectResponse = { ...projectResponse, assetsGallery };

      setProject(projectResponse);
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
              {project?.client} –{project?.title}
            </h3>
            <h2>{chapter.chapter_title}</h2>
          </div>
        ) : (
          <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
            <h3>
              {project?.client} — Project Code
              {project?.bookcode}
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
      </div>

      <div className="deanta-toast-alert hidden">
        <i className="material-icons-outlined hidden">success</i>
        <p className="deanta-toast-text" />
        <button type="button" className="deanta-toast-close">
          <i className="material-icons-outlined">close</i>
        </button>
      </div>

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
            <Link to={`/project/assets/${project?.projectId}`}>
              <i className="material-icons-outlined">folder</i>
              Assets
            </Link>
          )}

          {!!parseInt(permissions?.gallery?.view) && (
            <Link
              to={`/project/gallery/${project?.projectId}`}
              className="active"
            >
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
              to={`/project/journal/${project?.projectId}/detail/${chapter.chapter_id}`}
            >
              <i className="material-icons-outlined">view_day</i> Milestones
            </Link>
          )}

          {!!parseInt(permissions?.vxe?.view) && (
            <Link
              to={`/vxe/${project?.projectId}/detail/${chapter.chapter_id}`}
            >
              <i className="material-icons-outlined">format_shapes</i>
              PRO Editor
            </Link>
          )}

          {!!parseInt(permissions?.assets?.view) && (
            <Link
              to={`/project/assets/${project?.projectId}/detail/${chapter.chapter_id}`}
            >
              <i className="material-icons-outlined">folder</i>
              Assets
            </Link>
          )}

          {!!parseInt(permissions?.gallery?.view) && (
            <Link
              to={`/project/gallery/${project?.projectId}/detail/${chapter.chapter_id}`}
              className="active"
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

      {project && (
        <GalleryContent
          permissions={permissions}
          project={project}
          gallery={gallery}
          chapter={chapter}
        />
      )}
    </Layout>
  );
}
