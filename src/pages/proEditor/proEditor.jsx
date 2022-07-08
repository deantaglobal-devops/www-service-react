import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/Auth";
import Layout from "../../components/layout/Layout";
import { Tooltip } from "../../components/tooltip/tooltip";
import Loading from "../../components/loader/Loading";
import Toast from "../../components/toast/toast";

import {
  blockFullScreenHide,
  blockFullScreenShow,
  fullScreenToggle,
} from "../../utils/resizeScreen";

import "./styles/proEditor.styles.css";

export function ProEditorPage() {
  const [project, setProject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    text: "",
    type: "",
  });
  const [userMagicCode, setUserMagicCode] = useState(null);
  const [permissionsMagicCode, setPermissionsMagicCode] = useState(null);

  const { user, permissions } = useAuth();
  const { projectId, chapterId, magicCode } = useParams();

  useEffect(
    () => {
      document.title = "Lanstad — PRO Editor";

      if (magicCode) {
        // first we need to clean up localStorage
        localStorage.removeItem("lanstad-token");
        localStorage.removeItem("lanstad-user");
        localStorage.removeItem("magic-code");

        // now we can continue
        handleDataMagicCode();
      } else {
        handleData();
      }

      window.addEventListener("message", (event) => {
        if (event.data === "fullScreen") {
          fullScreenToggle();
        } else if (event.data === "setToken") {
          const token = window.localStorage.getItem("lanstad-token");
          const iframe = document.getElementById("iframe-id");
          iframe.contentWindow.postMessage(
            {
              action: "set",
              key: "lanstad-token",
              value: token,
            },
            "*",
          );
        } else if (event.data === "getMagicCode") {
          // Sending magic-code to iframe
          if (magicCode) {
            const iframe = document.getElementById("iframe-id");
            iframe.contentWindow.postMessage(
              {
                action: "set",
                key: "magic-code",
                value: magicCode,
              },
              "*",
            );
          }
        } else if (event.data === "submitReload") {
          window.location.reload();
        } else if (event.data === "blockFullScreenHide") {
          blockFullScreenHide();
        } else if (event.data === "blockFullScreenShow") {
          blockFullScreenShow();
        }
      });

      /* Add class to header on VXE page - for styling purposes */
      const pageWrapper = document.querySelector("#main-content");
      if (pageWrapper) {
        pageWrapper.classList.add("pro-editor");
      }
    },
    () => {
      if (magicCode) {
        // first we need to clean up localStorage
        localStorage.removeItem("lanstad-token");
        localStorage.removeItem("lanstad-user");
        localStorage.removeItem("magic-code");
      }
    },
    [],
  );

  const handleData = async () => {
    setIsLoading(true);

    let projectResponse = null;
    await api
      .get(`/project/${projectId}`)
      .then((response) => {
        projectResponse = response?.data;
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    if (chapterId) {
      let milestones = null;
      await api
        .get(`/project/journal/${projectId}/detail/${chapterId}`)
        .then((response) => {
          milestones = response?.data;
          setChapter(response?.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });

      projectResponse = { ...projectResponse, milestones };
    }

    setProject(projectResponse);
    setIsLoading(false);
  };

  const handleDataMagicCode = async () => {
    setIsLoading(true);

    const tokenInfo = await fetch(
      `${import.meta.env.VITE_URL_API_SERVICE}/magic-link/${magicCode}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then(
        (data) => {
          return data;
        },
        (error) => {
          // Todo: should we add a fail toast to show the error?
          console.log(error);
          setIsLoading(false);
        },
      );

    if (tokenInfo?.length > 0) {
      const { token } = tokenInfo[0];

      const projectDetails = await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/passkey/${magicCode}`,
        {
          method: "GET",
        },
      )
        .then((res) => res.json())
        .then(
          (data) => {
            return data;
          },
          (error) => {
            // Todo: should we add a fail toast to show the error?
            console.log(error);
          },
        );

      const premissionResponse = await api
        .post("/token/decode", {
          token,
        })
        .then((response) => response.data);

      const permissionMC = premissionResponse.payload.user.permissions;
      const userMC = premissionResponse.payload.user;

      if (projectDetails) {
        const projectInfo = await fetch(
          `${import.meta.env.VITE_URL_API_SERVICE}/project/${
            projectDetails[0].project_id
          }`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              "Lanstad-Token": token,
            },
          },
        )
          .then((res) => res.json())
          .then(
            (data) => {
              return data;
            },
            (error) => {
              // Todo: should we add a fail toast to show the error?
              console.log(error);
            },
          );

        const projectAccess = await fetch(
          `${import.meta.env.VITE_URL_API_SERVICE}/access-xmlfeed/${
            projectDetails[0].project_id
          }/${projectDetails[0].chapter_id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              "Lanstad-Token": token,
            },
          },
        )
          .then((res) => res.json())
          .then(
            (data) => {
              return data;
            },
            (error) => {
              // Todo: should we add a fail toast to show the error?
              console.log(error);
            },
          );

        if (projectDetails[0].chapter_id !== 0) {
          const chapterInfo = await fetch(
            `${import.meta.env.VITE_URL_API_SERVICE}/project/journal/${
              projectDetails[0].project_id
            }/detail/${projectDetails[0].chapter_id}`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                "Lanstad-Token": token,
              },
            },
          )
            .then((res) => res.json())
            .then(
              (data) => {
                return data;
              },
              (error) => {
                // Todo: should we add a fail toast to show the error?
                console.log(error);
              },
            );

          setChapter(chapterInfo);
        }

        if (projectAccess.status === "AL" || projectAccess.status === "PL") {
          setToast({
            text: "You have already submitted feedback on this project and can no longer view the project. Please contact the Project Manager if you require access again.",
            type: "warning",
          });
          setUserMagicCode(userMC);
          setPermissionsMagicCode(permissionMC);
        } else {
          setUserMagicCode(userMC);
          setPermissionsMagicCode(permissionMC);
          setProject(projectInfo);

          localStorage.setItem("lanstad-token", token);
          localStorage.setItem("lanstad-user", JSON.stringify(userMC));
          localStorage.setItem("magic-code", magicCode);
        }
      } else {
        setToast({
          text: "You have already submitted feedback on this project and can no longer view the project. Please contact the Project Manager if you require access again.",
          type: "warning",
        });
      }
    } else {
      setToast({
        text: "Your time duration has been expired. Please contact the Project Manager if you require access again.",
        type: "warning",
      });
    }
    setIsLoading(false);
  };

  const handleToastOnClick = () => {
    setToast({
      text: "",
      type: "",
    });
  };

  return (
    <>
      <Layout
        iconActive={chapter ? "Journals" : "Books"}
        permissions={permissionsMagicCode || permissions}
        user={userMagicCode || user}
      >
        {isLoading && <Loading />}
        {/* Header */}

        {toast.text !== "" ? (
          <Toast
            type={toast.type}
            text={toast.text}
            handleToastOnClick={() => handleToastOnClick()}
            time={180000}
          />
        ) : (
          <>
            <div className="page-header row no-gutters pt-4">
              {chapter ? (
                <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
                  <h3>
                    {project?.client} — {project?.title}
                  </h3>
                  {chapter?.chapter_title.length > 110 ? (
                    <Tooltip
                      direction="bottom-title"
                      content={chapter?.chapter_title}
                    >
                      <h2 className="title-pro-editor">
                        {chapter?.chapter_title}
                      </h2>
                    </Tooltip>
                  ) : (
                    <h2 className="title-pro-editor">
                      {chapter?.chapter_title}
                    </h2>
                  )}
                </div>
              ) : (
                <div className="col-12 col-sm-6 text-center text-sm-left mb-4 mb-sm-0">
                  <h3>
                    {project?.client} — Project Code {project?.bookcode}
                  </h3>
                  {project?.title.length > 110 ? (
                    <Tooltip direction="bottom-title" content={project?.title}>
                      <h2 className="title-pro-editor">{project?.title}</h2>
                    </Tooltip>
                  ) : (
                    <h2 className="title-pro-editor">{project?.title}</h2>
                  )}
                </div>
              )}
            </div>
            {/* End Header */}

            {/* Start NavTag */}

            {!chapter ? (
              <nav className="main-project-navigation open">
                {!!parseInt(
                  permissionsMagicCode?.milestones?.view ||
                    permissions?.milestones?.view,
                ) && (
                  <Link to={`/project/${project?.projectId}`}>
                    <i className="material-icons-outlined">view_day</i>{" "}
                    Milestones
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.toc?.view || permissions?.toc?.view,
                ) && (
                  <Link to={`/project/toc/${project?.projectId}`}>
                    <i className="material-icons-outlined">toc</i>
                    TOC
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.vxe?.view || permissions?.vxe?.view,
                ) && (
                  <Link to={`/vxe/${project?.projectId}`} className="active">
                    <i className="material-icons-outlined">format_shapes</i>
                    PRO Editor
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.assets?.view ||
                    permissions?.assets?.view,
                ) && (
                  <Link to={`/project/assets/${project?.projectId}`}>
                    <i className="material-icons-outlined">folder</i>
                    Assets
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.gallery?.view ||
                    permissions?.gallery?.view,
                ) && (
                  <Link to={`/project/gallery/${project?.projectId}`}>
                    <i className="material-icons-outlined">collections</i>
                    Gallery
                  </Link>
                )}
                {!!parseInt(
                  permissionsMagicCode?.books?.users?.view ||
                    permissions?.books?.users?.view,
                ) && (
                  <Link to={`/project/users/${project?.projectId}`}>
                    <i className="material-icons-outlined">group</i> Users
                  </Link>
                )}
              </nav>
            ) : (
              <nav className="main-project-navigation open">
                {!!parseInt(
                  permissionsMagicCode?.milestones?.view ||
                    permissions?.milestones?.view,
                ) && (
                  <Link
                    to={`/project/journal/${project?.projectId}/detail/${chapter.chapter_id}`}
                  >
                    <i className="material-icons-outlined">view_day</i>{" "}
                    Milestones
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.vxe?.view || permissions?.vxe?.view,
                ) && (
                  <Link
                    to={`/vxe/${project?.projectId}/detail/${chapter.chapter_id}`}
                    className="active"
                  >
                    <i className="material-icons-outlined">format_shapes</i>
                    PRO Editor
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.assets?.view ||
                    permissions?.assets?.view,
                ) && (
                  <Link
                    to={`/project/assets/${project?.projectId}/detail/${chapter.chapter_id}`}
                  >
                    <i className="material-icons-outlined">folder</i>
                    Assets
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode?.gallery?.view ||
                    permissions?.gallery?.view,
                ) && (
                  <Link
                    to={`/project/gallery/${project?.projectId}/detail/${chapter.chapter_id}`}
                  >
                    <i className="material-icons-outlined">collections</i>
                    Gallery
                  </Link>
                )}

                {!!parseInt(
                  permissionsMagicCode.journals?.users?.view ||
                    permissions?.journals?.users?.view,
                ) && (
                  <Link
                    to={`/project/users/${project?.projectId}/detail/${chapter.chapter_id}`}
                  >
                    <i className="material-icons-outlined">group</i> Users
                  </Link>
                )}
              </nav>
            )}
            {/* End NavTag */}

            {project &&
              (chapter ? (
                <>
                  {/* <iframe
              title="iFrame Journals Pro Editor"
              src={`http://vxe-journals.lanstad.docker:3232/vxe/${project?.projectId}/${chapter?.chapter_id}`}
              frameBorder="0"
              id="iframe-id"
            ></iframe> */}
                  {/* <iframe
              title="iFrame Journals Pro Editor"
              src={`http://localhost:3131/vxe/${project?.projectId}/${chapter?.chapter_id}`}
              frameBorder="0"
              id="iframe-id"
            /> */}
                  <iframe
                    title="iFrame Journals Pro Editor"
                    src={`${import.meta.env.VITE_VXE_JNL_SERVICE}/vxe/${
                      project?.projectId
                    }/${chapter?.chapter_id}`}
                    frameBorder="0"
                    id="iframe-id"
                  />
                </>
              ) : (
                <>
                  {/* <iframe
              title="iFrame Books Pro Editor"
              src={`http://vxe.lanstad.docker:3131/vxe/${project?.projectId}`}
              frameBorder="0"
              id="iframe-id"
            ></iframe> */}
                  {/* <iframe
              title="iFrame Books Pro Editor"
              src={`http://localhost:3131/vxe/${project?.projectId}`}
              frameBorder="0"
              id="iframe-id"
            ></iframe>  */}
                  <iframe
                    title="iFrame Books Pro Editor"
                    src={`${import.meta.env.VITE_VXE_SERVICE}/vxe/${
                      project?.projectId
                    }`}
                    frameBorder="0"
                    id="iframe-id"
                  />
                </>
              ))}
          </>
        )}
      </Layout>
      <div className="deanta-toast-alert warning hidden">
        <i className="material-icons-outlined">warning</i>
        <p className="deanta-toast-text" />
        <button type="button" className="deanta-toast-close">
          <i className="material-icons-outlined">close</i>
        </button>
      </div>
    </>
  );
}
