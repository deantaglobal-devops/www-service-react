import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import SliderLoading from "../../sliderLoading/SliderLoading";

export default function ForwardAttach({ ...props }) {
  const { attachments, projectId } = props;
  const [milestones, setMilestones] = useState([]);
  const [milestonesFiltered, setMilestonesFiltered] = useState([]);
  const [listOfDestinations, setlistOfDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    getMilestones(projectId);
  }, [projectId]);

  async function getMilestones(projectId) {
    setLoadingData("list");
    await api
      .get(`/project/${projectId}`)
      .then((result) => {
        result.data.milestones.map(async (milestone) => {
          await api
            .get(`/milestone/${milestone.id}`)
            .then((result) => {
              setMilestones((state) => [...state, result.data]);
              setMilestonesFiltered((state) => [...state, result.data]);
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => setLoadingData(""));
        });
      })
      .catch((error) => console.log(error));
  }

  function startSearching(e) {
    const input = e.currentTarget.value.toLowerCase();
    const allMilestones = [...milestones];
    const firstFilteredResult = allMilestones.map((milestone) => {
      const milestoneCopy = { ...milestone };
      const tasksCopy = [...milestoneCopy.tasks];
      const tasksFiltered = tasksCopy.filter((task) => {
        return task.taskName && task.taskName.toLowerCase().includes(input);
      });
      milestoneCopy.tasks = tasksFiltered;
      return milestoneCopy;
    });
    const secondFilteredResult = firstFilteredResult.filter((milestone) => {
      const milestoneCopy = { ...milestone };
      return milestoneCopy.tasks.length > 0;
    });
    setMilestonesFiltered(secondFilteredResult);
  }

  function addTaskToDestinations(e, taskId) {
    const addDestination = e.currentTarget.checked;
    if (addDestination) {
      const newListOfDestinations = [...listOfDestinations];
      newListOfDestinations.push(taskId);
      setlistOfDestinations(newListOfDestinations);
    } else {
      const newListOfDestinations = listOfDestinations.filter((id) => {
        return id !== taskId;
      });
      setlistOfDestinations(newListOfDestinations);
    }
  }

  function sendAttachments(destinationIds) {
    setLoading("send");
    setStatusMsg("");

    const attachmentsIds = attachments?.map((file) => {
      return file.document_id;
    });

    if (listOfDestinations.length > 0) {
      api
        .post("/project/assets/copy", {
          data: {
            taskId: destinationIds,
            documentId: attachmentsIds,
          },
        })
        .then(() => {
          setStatusMsg("Attachs sent successfully");
        })
        .catch((error) => {
          setStatusMsg("Error sending attachs");
          console.log(error);
        })
        .finally(() => {
          setLoading("");
        });
    } else {
      setStatusMsg("Please select at least one task");
      setLoading(false);
    }
  }

  return (
    <div className="txt-editor-popup">
      <div>
        <p className="file-disclaimer">
          NB: Only file attachments will be sent to the chosen tasks - not
          messages.
        </p>
      </div>
      <div id="fileList">
        <div className="file-search">
          <i className="material-icons">search</i>
          <input
            className="navbar-search form-control"
            type="text"
            placeholder="Search for task..."
            aria-label="Search"
            onChange={(e) => startSearching(e)}
          />
        </div>
        {loading === "list" ? (
          <SliderLoading />
        ) : (
          <div className="file-list">
            <ul>
              {milestonesFiltered.length === 0
                ? "Sorry, no tasks found"
                : milestonesFiltered.map((milestone, i) => {
                    return (
                      <li
                        key={milestone.milestoneTitle + i}
                        className="file-list-item"
                      >
                        <h4 className="file-milestone">{milestone.name}</h4>
                        <ul className="file-task-list">
                          {milestone.tasks.length > 0 &&
                            milestone.tasks.map((task) => {
                              return (
                                <li
                                  key={task.taskId}
                                  className="file-task-item options-checkbox"
                                >
                                  <label htmlFor={`file-task-${task.taskId}`}>
                                    <input
                                      id={`file-task-${task.taskId}`}
                                      type="checkbox"
                                      value="fileTask"
                                      name="fileTask"
                                      onChange={(e) => {
                                        addTaskToDestinations(e, task.taskId);
                                      }}
                                    />
                                    {task.taskName}
                                  </label>
                                </li>
                              );
                            })}
                        </ul>
                      </li>
                    );
                  })}
            </ul>
          </div>
        )}
      </div>
      <div className="col-md-12 p-0 deanta-button-container flex-between">
        <p
          className={`text-warning ${
            statusMsg.includes("success") ? "text-success" : "text-error"
          }`}
        >
          {statusMsg}
        </p>
        <button
          className="deanta-button-outlined save-users "
          disabled={loading === "send"}
          onClick={() => sendAttachments(listOfDestinations)}
        >
          {loading === "send" ? (
            <>
              <i className="material-icons-outlined loading-icon-button">
                sync
              </i>{" "}
              Sending
            </>
          ) : (
            "Send Attachments"
          )}
        </button>
      </div>
    </div>
  );
}
