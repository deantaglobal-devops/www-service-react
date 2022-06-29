import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import Layout from "../../components/layout/Layout";
import TocContent from "./components/tocContent/tocContent";
import Loading from "../../components/loader/Loading";

export function TocMainPage() {
  const [project, setProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { user, permissions } = useAuth();
  const { projectId } = useParams();

  useEffect(() => {
    document.title = "Lanstad — TOC";

    handleTocData();
  }, []);

  const handleTocData = async () => {
    setIsLoading(true);
    await api
      .get(`/project/${projectId}/toc`)
      .then((response) => {
        setProject(response.data);
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  };

  return (
    <Layout iconActive="Books" permissions={permissions} user={user}>
      {isLoading && <Loading />}

      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
          <h3>
            {project?.client} — Project Code {project?.bookcode}
          </h3>
          <h2>{project?.title}</h2>
        </div>

        {/* Back buttons */}
        <div className="d-flex col-4 col-sm-6 mr-auto align-items-right">
          <div className="d-flex mb-sm-0 mx-auto ml-sm-auto mr-sm-0">
            <button
              type="button"
              className="btn btn-outline-primary ml-2"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>
        </div>
        {/* Back buttons */}
      </div>
      {/* End Header */}

      <div className="project-information-box toc">
        {/* We need to fill info here */}
      </div>

      {/* Start NavTag */}
      <nav className="main-project-navigation toc">
        {!!parseInt(permissions?.milestones?.view) && (
          <Link to={`/project/${project?.projectId}`}>
            <i className="material-icons-outlined">view_day</i> Milestones
          </Link>
        )}

        {!!parseInt(permissions?.toc?.view) && (
          <Link to={`/project/toc/${project?.projectId}`} className="active">
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
      {/* End NavTag */}

      {Object.keys(project).length > 0 && (
        <TocContent permissions={permissions} project={project} />
      )}
    </Layout>
  );
}
