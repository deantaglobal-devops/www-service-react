import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import Modal from "../../modal";
import UserList from "../../userList";

export default function MessagingHeader({ ...props }) {
  const {
    taskId,
    projectId,
    projectName,
    taskName,
    projectCode,
    permissions,
    memberList,
  } = props;
  const [usersProject, setUsersProject] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUsersProject, setShowUsersProject] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers(projectId);
  }, [taskId, projectId]);

  async function getUsers(projectId) {
    setLoading(true);
    if (projectId !== undefined) {
      await api
        .get(`/project/${projectId}/users`)
        .then((result) => {
          setUsersProject(result.data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }

  const loadingSkeleton = [];
  for (let i = 0; i < 3; i++) {
    loadingSkeleton.push(
      <li className="member-list-item" key={i}>
        <div className="avatar-skeleton" />
        <div className="user-skeleton" />
      </li>,
    );
  }

  return (
    <>
      <div id="messaging-header">
        <p>{`${
          projectCode ? `${projectCode} /` : ""
        } ${projectName} / ${taskName}`}</p>
        <div className="message-header">
          <button
            className="deanta-button messaging-header-members"
            onClick={() => setShowModal(true)}
          >
            <i className="material-icons-outlined">people</i>
            {memberList.length}
          </button>
          <h3>{taskName}</h3>
        </div>
      </div>

      {showModal && (
        <Modal
          modalInSlider
          title="Task Members"
          closeModal={() => setShowModal(false)}
          body={
            <div id="memberListModal">
              <ul className="member-list">
                {!loading
                  ? memberList?.length > 0
                    ? memberList?.map((member) => (
                        <li
                          className="member-list-item"
                          id={member.id}
                          key={member.id}
                        >
                          <img
                            src={member.avatar}
                            className="user-avatar-messaging"
                          />
                          <p className="user-name">
                            {member.name} {member.lastname}
                          </p>
                        </li>
                      ))
                    : "No Members"
                  : loadingSkeleton}
              </ul>
              {+permissions.tasks.users.add === 1 && (
                <>
                  <button
                    className="deanta-button member-add"
                    onClick={() => {
                      setShowUsersProject(!showUsersProject);
                    }}
                  >
                    <i className="material-icons-outlined">
                      {showUsersProject ? "remove" : "add"}
                    </i>
                    Add existing project member(s) to this task
                  </button>
                  {showUsersProject && (
                    <UserList
                      isMessagingArea
                      level="task"
                      taskList={memberList}
                      completeUsersList={usersProject}
                      taskId={taskId}
                      update={() => {
                        props.updateMembers();
                        setShowUsersProject(false);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          }
        />
      )}
    </>
  );
}
