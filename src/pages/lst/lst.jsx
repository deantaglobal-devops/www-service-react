import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import Layout from "../../components/layout/Layout";

export function LstPage() {
  const { user, permissions } = useAuth();
  const { projectType } = useParams();

  useEffect(() => {
    document.title =
      projectType === "books"
        ? "Lanstad — LST Books"
        : "Lanstad — LST Journals";

    window.addEventListener("message", (event) => {
      if (event.data === "setToken") {
        const token = window.localStorage.getItem("lanstad-token");
        const iframe = document.getElementById("iframe-id");
        iframe.contentWindow.postMessage(
          {
            action: "set",
            value: token,
          },
          "*",
        );
      }
    });
  });

  return (
    <Layout
      iconActive={projectType === "journals" ? "Journals" : "Books"}
      permissions={permissions}
      user={user}
    >
      {/* Header */}
      <div className="page-header row no-gutters pt-4">
        {projectType === "journals" ? (
          <div className="page-title">
            Journals
            <span className="page-subtitle lanstad-subtitle">
              <span />
            </span>
          </div>
        ) : (
          <div className="page-title">
            Books
            <span className="page-subtitle lanstad-subtitle">
              <span />
            </span>
          </div>
        )}
      </div>
      {/* End Header */}

      <div className="nav-tags mt12">
        <Link
          to={
            projectType === "books" ? "/dashboard/books" : "/dashboard/journals"
          }
        >
          Active
        </Link>
        <Link
          to={projectType === "books" ? "/lst/books" : "/lst/journals"}
          className="active"
        >
          Report
        </Link>
      </div>

      {projectType === "journals" ? (
        <>
          {/* <iframe title="iFrame Journals LST" src={`http://localhost:3131/lst/journals`} frameBorder="0" id="iframe-id" /> */}
          <iframe
            title="iFrame Journals LST"
            src={`${import.meta.env.VITE_LST_SERVICE}/lst/journals`}
            frameBorder="0"
            id="iframe-id"
          />
        </>
      ) : (
        <>
          {/* <iframe title="iFrame Books LST" src={`http://localhost:3131/lst/books`} frameBorder="0" id="iframe-id" /> */}
          <iframe
            title="iFrame Books LST"
            src={`${import.meta.env.VITE_LST_SERVICE}/lst/books`}
            frameBorder="0"
            id="iframe-id"
          />
        </>
      )}
    </Layout>
  );
}
