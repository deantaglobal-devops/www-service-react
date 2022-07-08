import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/Auth";
import { api } from "../../../services/api";
import SliderLoading from "../../sliderLoading/SliderLoading";

export default function ForwardTask({ ...props }) {
  const {
    userId,
    message,
    chapterId,
    taskName,
    taskId,
    milestoneId,
    projectId,
    projectName,
  } = props;
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [milestonesFiltered, setMilestonesFiltered] = useState([]);
  const [listOfDestinations, setlistOfDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    getMilestones(projectId);
  }, [projectId]);

  async function getMilestones(projectId) {
    setLoadingData(true);
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
            .finally(() => setLoadingData(false));
        });
      })
      .catch((error) => console.log(error));
  }

  function searchTask(e) {
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

  function sendMessageTask(destinationIds) {
    if (listOfDestinations.length > 0) {
      setStatusMsg("");
      setLoading(true);
      api
        .post("/messages/mapto", {
          userId: "",
          taskId: destinationIds.length > 0 && destinationIds.join(","),
          messageId: message.id,
          projectId,
          chapterId,
        })
        .then(() => {
          destinationIds.map((taskId) => {
            const description = `New message forwarded from ${taskName}`;
            let link = "";
            let category = "";

            if (+chapterId !== 0) {
              const articleTitle =
                document.querySelector(".page-header h2").innerHTML;
              link = `${
                import.meta.env.VITE_URL_SERVICE
              }/project/journal/${projectId}/detail/${chapterId}`;
              category = `${projectName} / ${articleTitle.substring(0, 15)}...`;
            } else {
              link = `${import.meta.env.VITE_URL_SERVICE}/project/${projectId}`;
              category = projectName;
            }

            api
              .post(
                `${
                  import.meta.env.VITE_URL_PUSH_SERVICE
                }/notifications/communications`,
                {
                  company_id: user.realCompanyId,
                  creation_date: Date.now(),
                  description,
                  link,
                  milestone_id: milestoneId,
                  type: "Communications",
                  project_id: projectId,
                  seen: "0",
                  task_id: taskId,
                  title: description,
                  update_date: Date.now(),
                  user_id: userId,
                  category,
                },
                {
                  headers: { "Access-Control-Allow-Origin": "*" },
                },
              )
              .then((res) => {
                setStatusMsg("Task sent successfully");
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
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
          Choose which tasks you'd like to send this message to. Attachments
          will also be sent.
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
            onChange={(e) => searchTask(e)}
          />
        </div>
        {loadingData ? (
          <SliderLoading />
        ) : (
          <div className="file-list">
            <ul>
              {milestonesFiltered?.length === 0
                ? "Sorry, no tasks found"
                : milestonesFiltered?.map((milestone, i) => {
                    return (
                      <li
                        key={milestone.milestoneTitle + i}
                        className="file-list-item"
                      >
                        <h4 className="file-milestone">
                          {milestone.milestoneTitle}
                        </h4>
                        <ul className="file-task-list">
                          {milestone.tasks.length > 0 &&
                            milestone.tasks.map((task, index) => {
                              return (
                                task.taskId !== taskId && (
                                  <li
                                    key={task.taskName + index}
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
                                )
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
          disabled={loading}
          onClick={() => sendMessageTask(listOfDestinations)}
        >
          {!loading ? (
            "Send"
          ) : (
            <>
              <i className="material-icons-outlined loading-icon-button">
                sync
              </i>{" "}
              Sending
            </>
          )}
        </button>
      </div>
    </div>
  );
}
