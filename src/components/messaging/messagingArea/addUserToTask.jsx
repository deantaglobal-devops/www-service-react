import { useState } from "react";
import { api } from "../../../services/api";

export default function AddUserToTask({ ...props }) {
  const [loading, setLoading] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const uniqueUser = [];
  const users = props.users.filter((element) => {
    const isDuplicate = uniqueUser.includes(element.id);
    if (!isDuplicate) {
      uniqueUser.push(element.id);
      return true;
    }
    return false;
  });

  async function addUsersToTask() {
    setLoading(true);

    const usersToAddToTaskIds = users.map((user) => {
      return user.id;
    });

    await Promise.all(
      usersToAddToTaskIds.map(async (id) => {
        const response = await api
          .post("/task/assign", {
            taskId: props.taskId,
            taskUser: id,
          })
          .then((result) => {
            if (result.data.status === "success") {
              props.close();
              setStatusMsg("success");
            } else {
              setStatusMsg("Unable to add user(s) to task.");
            }
          })
          .catch((error) => {
            console.log(error);
            setStatusMsg("Unable to add user(s) to task.");
          })
          .finally(() => {
            setLoading(false);
          });

        return response;
      }),
    ).then(() => {
      props.finish();
    });
  }

  return (
    <>
      <span>
        The user(s) below are member(s) of the project, but are not currently
        member(s) of this task:
      </span>

      <ul className="projectuser-not-task">
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>

      <p>
        Before sending this message as an email, would you like to add the
        user(s) to this task?
      </p>
      <p
        className={`text-warning pb-footer ${
          statusMsg.includes("success") ? "text-success" : "text-error"
        }`}
      >
        {statusMsg}
      </p>
      <div className="col-md-12 p-0 deanta-button-container">
        <button
          className="deanta-button-outlined save-users "
          onClick={() => {
            props.finish();
            props.close();
          }}
        >
          Don't Add
        </button>
        <button
          className="deanta-button-outlined save-users "
          disabled={loading}
          onClick={() => addUsersToTask()}
        >
          {!loading ? (
            "Add"
          ) : (
            <>
              <i className="material-icons-outlined loading-icon-button">
                sync
              </i>{" "}
              Adding
            </>
          )}
        </button>
      </div>
    </>
  );
}
