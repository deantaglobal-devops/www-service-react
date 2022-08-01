import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/Modal/modal";
import AddNewUser from "./components/addNewUser/addNewUser";
import InviteUsers from "./components/InviteUsers/inviteUsers";
import Loading from "../../components/loader/Loading";
import { Tooltip } from "../../components/tooltip/tooltip";

import "./styles/users.styles.css";

export function Users() {
  const [project, setProject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [projectUsers, setProjectUsers] = useState();
  const [openExistingUserModal, setOpenExistingUserModal] = useState(false);
  const [openInviteUsersModal, setOpenInviteUsersModal] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [companyUserList, setCompanyUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const [userIdDeleted, setUserIdDeleted] = useState(0);

  const { user, permissions } = useAuth();
  const { projectId, chapterId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Users";

    handleData();
  }, []);

  const handleData = async () => {
    setIsLoading(true);
    const promiseProject = api.get(`/project/${projectId}`);
    if (chapterId) {
      const promiseChapterInfo = api.get(
        `/project/journal/${projectId}/detail/${chapterId}`,
      );
      const promiseProjectUsers = api.get(`/project/${projectId}/users`);

      await Promise.all([
        promiseProject,
        promiseChapterInfo,
        promiseProjectUsers,
      ])
        .then((response) => {
          setProject(response[0].data);
          setChapter(response[1].data);
          const resultArr = response[2].data.map(function (item) {
            if (!item.avatar.includes("eu.ui-avatars.com")) {
              return {
                ...item,
                avatar: `/file/src/?path=${item.avatar}`,
              };
            }
            return item;
          });

          // remove duplicates users
          const usersNotDuplicates = resultArr?.filter(
            (thing, index, self) =>
              index === self.findIndex((t) => t.id === thing.id),
          );

          setProjectUsers(usersNotDuplicates);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      const promiseProjectUsers = api.get(`/project/${projectId}/users`);

      await Promise.all([promiseProject, promiseProjectUsers])
        .then((response) => {
          setProject(response[0].data);

          const resultArr = response[1].data.map(function (item) {
            if (!item.avatar.includes("eu.ui-avatars.com")) {
              return {
                ...item,
                avatar: `/file/src/?path=${item.avatar}`,
              };
            }
            return item;
          });

          // remove duplicates users
          const usersNotDuplicates = resultArr?.filter(
            (thing, index, self) =>
              index === self.findIndex((t) => t.id === thing.id),
          );

          setProjectUsers(usersNotDuplicates);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  const getAddUserModal = async () => {
    await api
      .get(`/project/${project.projectId}/users`)
      .then((response) => {
        const resultArr = response.data.map(function (item) {
          if (!item.avatar.includes("eu.ui-avatars.com")) {
            return {
              ...item,
              avatar: `/file/src/?path=${item.avatar}`,
            };
          }
          return item;
        });

        setUsersData(resultArr);
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
    setOpenExistingUserModal(true);
  };

  const handleOpenExistingUser = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await api
      .get(`/company/users/${project?.companyId}`)
      .then((response) => {
        setCompanyUserList(response.data.users);
        getAddUserModal(response.data.users);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenInviteUser = (e) => {
    e.preventDefault();

    setOpenInviteUsersModal(true);
  };

  const handleCloseModal = () => {
    setOpenExistingUserModal(false);
    setOpenInviteUsersModal(false);
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

  const showWarningToast = (message) => {
    document.querySelector(".deanta-toast-alert").classList.remove("hidden");

    if (message.statusText !== "") {
      document.querySelector(".deanta-toast-text").innerHTML =
        message.statusText;
    }
    // warning | success | fail
    if (message.statusType !== "") {
      document
        .querySelector(".deanta-toast-alert")
        .classList.add(message.statusType);
    } else {
      document.querySelector(".deanta-toast-alert").classList.add("warning");
    }

    if (message.statusIcon !== "") {
      document.querySelector(".deanta-toast-alert > i").innerHTML =
        message.statusIcon;
      document
        .querySelector(".deanta-toast-alert > i")
        .classList.remove("hidden");
    } else {
      document.querySelector(".deanta-toast-alert > i").innerHTML = "warning";
      document
        .querySelector(".deanta-toast-alert > i")
        .classList.remove("hidden");
    }

    document
      .querySelector(".deanta-toast-close")
      .addEventListener("click", () => {
        document.querySelector(".deanta-toast-alert").classList.add("hidden");
      });
  };

  const openDeleteUsersModal = (userId) => {
    setOpenModalConfirmation(true);
    setUserIdDeleted(userId);
  };

  const handleConfirmationButton = async () => {
    await api
      .post("/project/remove/user", {
        userId: userIdDeleted,
        projectId: project?.projectId,
      })
      .then(() => {
        const users = projectUsers?.filter((user) => user.id !== userIdDeleted);
        setProjectUsers(users);
      })
      .catch((err) => console.log(err));

    setOpenModalConfirmation(false);
  };

  return (
    user &&
    permissions && (
      <Layout
        iconActive={chapter ? "Journals" : "Books"}
        permissions={permissions}
        user={user}
      >
        {isLoading && <Loading />}

        {openModalConfirmation && (
          <Modal
            displayModal={openModalConfirmation}
            closeModal={() => setOpenModalConfirmation(false)}
            title="Confirmation"
            body="Are you sure that you would like to remove this user from the project?"
            button1Text="Cancel"
            handleButton1Modal={() => setOpenModalConfirmation(false)}
            Button2Text="Confirm"
            handleButton2Modal={() => handleConfirmationButton()}
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
                <h2>{chapter.chapter_title}</h2>
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
        {chapter ? (
          <nav className="main-project-navigation">
            {!!parseInt(permissions?.milestones?.view) && (
              <Link
                to={`/project/journal/${project?.projectId}/detail/${chapter?.chapter_id}`}
              >
                <i className="material-icons-outlined">view_day</i> Milestones
              </Link>
            )}

            {!!parseInt(permissions?.vxe?.view) &&
              (project.project_id === "4897" &&
              chapter.chapter_id === "8302" ? (
                <Link
                  to={`/vxe/${project.project_id}/detail/${chapter.chapter_id}`}
                >
                  Manage Issue Articles
                </Link>
              ) : (
                <Link
                  to={`/vxe/${project?.projectId}/detail/${chapter?.chapter_id}`}
                >
                  <i className="material-icons-outlined">format_shapes</i>
                  PRO Editor
                </Link>
              ))}

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
              >
                <i className="material-icons-outlined">collections</i>
                Gallery
              </Link>
            )}

            {!!parseInt(permissions?.books?.users?.view) && (
              <Link
                to={`/project/users/${project?.projectId}/detail/${chapter.chapter_id}`}
                className="active"
              >
                <i className="material-icons-outlined">group</i> Users
              </Link>
            )}
          </nav>
        ) : (
          <nav className="main-project-navigation">
            {!!parseInt(permissions?.milestones?.view) && (
              <Link to={`/project/${project?.projectId}`}>
                <i className="material-icons-outlined">view_day</i> Milestones
              </Link>
            )}

            {!!parseInt(permissions?.toc?.view) && project?.isbn10 == 1 && (
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
              <Link to={`/project/gallery/${project?.projectId}`}>
                <i className="material-icons-outlined">collections</i>
                Gallery
              </Link>
            )}

            {!!parseInt(permissions?.books?.users?.view) && (
              <Link
                to={`/project/users/${project?.projectId}`}
                className="active"
              >
                <i className="material-icons-outlined">group</i> Users
              </Link>
            )}
          </nav>
        )}
        {/* End NavTag */}

        <div className="deanta-toast-alert hidden">
          <i className="material-icons-outlined hidden" />
          <p className="deanta-toast-text" />
          <button type="button" className="deanta-toast-close">
            <i className="material-icons-outlined">close</i>
          </button>
        </div>
        <div className="row mt-4">
          <div className="col-sm-12 col-lg-12 mb15">
            <div className="container-content-page mt-4 container-users">
              <div className="users-on-project">
                {projectUsers?.map((user) => (
                  <div className="content-user" id={user.id} key={user.id}>
                    <div className="align-infos">
                      <img
                        alt="avatar"
                        className="user-avatar rounded-circle mr-2"
                        src={
                          user?.avatar.includes("/file/src/?path=")
                            ? `${import.meta.env.VITE_URL_API_SERVICE}${
                                user.avatar
                              }`
                            : `https://eu.ui-avatars.com/api/?bold=true&color=fff&background=999&size=35&name=${user.name}+${user.lastname}`
                        }
                      />
                      <div className="user-info">
                        <p>
                          {user.name} {user.lastname}
                        </p>
                        <p className="role">{user.permissions?.rol}</p>
                      </div>
                    </div>
                    {((!chapter &&
                      !!parseInt(permissions?.journals.users.delete)) ||
                      (chapter &&
                        !!parseInt(permissions?.journals.users.delete))) && (
                      <Tooltip content="Remove user" direction="top">
                        <a
                          href="#"
                          onClick={() => openDeleteUsersModal(user.id)}
                        >
                          <i className="material-icons-outlined delete-icon">
                            delete
                          </i>
                        </a>
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>

              {((chapter && !!parseInt(permissions?.journals?.users.add)) ||
                !!parseInt(permissions?.books?.users.add)) && (
                <div className="secondary-navigation">
                  <button
                    type="button"
                    className="add-new-users"
                    onClick={(e) => {
                      handleOpenExistingUser(e);
                    }}
                  >
                    <i className="material-icons-outlined">add</i>
                    Add existing {project?.client} user
                  </button>

                  <button
                    type="button"
                    className="invite-new-users"
                    onClick={(e) => {
                      handleOpenInviteUser(e);
                    }}
                  >
                    <i className="material-icons-outlined">add</i> Invite new
                    user
                  </button>
                  <div
                    id="modalContainer"
                    className="inviteUsers listUsers modalContainer unsetClass"
                  >
                    {openExistingUserModal && (
                      <AddNewUser
                        completeUsersList={companyUserList}
                        level="project"
                        projectId={project?.projectId}
                        projectUserList={usersData}
                        taskId=""
                        taskMemberList=""
                        updateUserList=""
                        closeModal={() => handleCloseModal()}
                      />
                    )}

                    {openInviteUsersModal && (
                      <InviteUsers
                        userId={user.id}
                        level="project"
                        projectId={project?.projectId}
                        client={project?.client}
                        clientId={project?.companyId}
                        companyId={user.realCompanyId}
                        closeModal={() => handleCloseModal()}
                        showFailToast={showFailToast}
                        showWarningToast={showWarningToast}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  );
}
