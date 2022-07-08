import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Modal from "../../../../components/Modal/modal";
import { api } from "../../../../services/api";

export default function TasksList({ milestoneId }) {
  const [data, setData] = useState([]);
  const [addNewTask, setAddNewTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState("");
  const [modalTaskDelete, setModalTaskDelete] = useState(false);

  // Fields of form
  const attrInitial = {
    taskSkip: false,
    taskFinal: false,
    taskXMLUpload: false,
    taskEditProcess: false,
    taskEngine: false,
    taskBookEnd: false,
    taskLayout: false,
    taskpre_editing: false,
    taskQuality: false,
    taskStyleEditing: false,
    taskeProducts: false,
  };
  const [nameTask, setNameTask] = useState("");
  const [attrTask, setAtrrTask] = useState(attrInitial);
  const [typeTask, setTypeTask] = useState("");
  const [startTask, setStartTask] = useState(0);
  const [endTask, setEndTask] = useState(0);
  const [complexTask, setComplexTask] = useState("");
  const [errorEmpty, setErrorEmpty] = useState("");

  useEffect(() => {
    getData();
    setAddNewTask(false);
  }, [milestoneId]);

  async function getUser(userId) {
    await api
      .get(`/user/${userId}`)
      .then((response) => {
        return response.data.data.info;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function getData() {
    setLoading(true);
    await api
      .get(
        `${
          import.meta.env.VITE_URL_API_SERVICE
        }/task-template/list/${milestoneId}`,
      )
      .then((data) => {
        setData(data.data.tasklist);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deleteTask(id) {
    await api
      .post(`/task-template/delete/${id}`)
      .then(() => {
        getData();
        setModalTaskDelete(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function createTask() {
    const attrSelects = Object.keys(attrTask).reduce((o, key) => {
      attrTask[key] === true && (o[key] = attrTask[key]);
      return o;
    }, {});

    await api
      .post("/task-template/create", {
        milestone_id: milestoneId,
        taskName: nameTask,
        taskDescription: nameTask,
        taskAttr: Object.keys(attrSelects).map(function (x) {
          return x.replace("taskpre_editing", "taskpre-editing");
        }),
        tat_startDate: parseInt(startTask),
        tat_endDate: parseInt(endTask),
        task_type: parseInt(typeTask),
        task_complexity: complexTask,
        status_id: 1,
        order_id: 1,
      })
      .then(() => {
        getData();
        setAddNewTask(false);
        setErrorEmpty(false);
      })
      .catch((error) => {
        setErrorEmpty(true);
        console.log(error);
      });
  }

  async function updateTask() {
    const attrSelects = Object.keys(attrTask).reduce((o, key) => {
      attrTask[key] === true && (o[key] = attrTask[key]);
      return o;
    }, {});

    await api
      .put("/task-template/update", {
        taskId,
        taskName: nameTask,
        taskAttr: Object.keys(attrSelects).map(function (x) {
          return x.replace("taskpre_editing", "taskpre-editing");
        }),
        tat_startDate: parseInt(startTask),
        tat_endDate: parseInt(endTask),
        task_type: parseInt(typeTask),
        task_complexity: complexTask,
        status_id: 1,
      })
      .then(() => {
        getData();
        setEditTask(false);
        setErrorEmpty(false);
      })
      .catch((error) => {
        setErrorEmpty(true);
        console.log(error);
      });
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(data, result.source.index, result.destination.index);
    setData(items);

    items.map((item, index) => {
      if (parseInt(item.order_id) !== index + 1) {
        api
          .put("/task-template/order/update", {
            taskId: item.task_id,
            orderId: index + 1,
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging && "#f9f9f9",
    border: isDragging && "1px solid var(--primary)",
    borderRadius: isDragging && "5px",
    boxShadow: isDragging && "0 5px 15px -5px #ccc",
    ...draggableStyle,
  });

  return (
    <>
      {loading && data.length === 0 ? (
        <div className="skeleton-parent">
          <div className="skeleton-loading" />
          <div className="skeleton-loading" />
          <div className="skeleton-loading" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((item, index) => {
                  return (
                    <Draggable
                      key={item.task_id + index}
                      draggableId={item.task_id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="task-add task-details task-editing"
                          key={item.task_id + index}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <div className="item-mlstn-template item-task-template">
                            {!editTask && item.task_id !== taskId && (
                              <div className="m-avatar-col">
                                <div className="task-members">
                                  {item.user_id &&
                                  +item.user_id !== 0 &&
                                  getUser(item.user_id).avatar ? (
                                    <img
                                      className="avatar"
                                      src={`${
                                        import.meta.env.URL_API_SERVICE
                                      }/file/src/?path=${
                                        getUser(item.user_id).avatar
                                      }`}
                                    />
                                  ) : (
                                    <div className="avatar">
                                      <span className="material-icons-outlined">
                                        person
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="m-title-col">
                              {editTask && item.task_id == taskId ? (
                                <input
                                  type="text"
                                  id="newTaskName"
                                  name="taskName"
                                  placeholder="Type Task name here..."
                                  style={{ marginLeft: 0 }}
                                  onChange={(event) =>
                                    setNameTask(event.target.value)
                                  }
                                  defaultValue={item.task_name}
                                />
                              ) : (
                                <p className="daysTask">{item.task_name}</p>
                              )}

                              {errorEmpty &&
                                nameTask === "" &&
                                item.task_id == taskId && (
                                  <span className="msg-error">
                                    Enter Task Name
                                  </span>
                                )}
                            </div>
                            <div className="m-start-col">
                              {editTask && item.task_id == taskId ? (
                                <input
                                  type="number"
                                  id="tat_startDate"
                                  name="tat_startDate"
                                  placeholder="Type the start TAT days"
                                  style={{ marginLeft: 0 }}
                                  min="0"
                                  max="999"
                                  onChange={(event) =>
                                    setStartTask(event.target.value)
                                  }
                                  defaultValue={item.tat_taskStartdate}
                                />
                              ) : (
                                <p className="daysTask">
                                  Day {item.tat_taskStartdate}
                                </p>
                              )}
                              {errorEmpty &&
                                (startTask === "" || +startTask === 0) &&
                                item.task_id == taskId && (
                                  <span className="msg-error">
                                    Enter Start Date
                                  </span>
                                )}
                            </div>
                            <div className="m-due-col">
                              {editTask && item.task_id == taskId ? (
                                <input
                                  type="number"
                                  id="tat_endDate"
                                  name="tat_endDate"
                                  min="0"
                                  max="999"
                                  placeholder="Type the end TAT days"
                                  style={{ marginLeft: 0 }}
                                  onChange={(event) =>
                                    setEndTask(event.target.value)
                                  }
                                  defaultValue={item.tat_taskDuedate}
                                />
                              ) : (
                                <p className="daysTask">
                                  Day {item.tat_taskDuedate}
                                </p>
                              )}
                              {errorEmpty &&
                                (endTask === "" || +endTask === 0) &&
                                item.task_id == taskId && (
                                  <span className="msg-error">
                                    Enter End Date
                                  </span>
                                )}
                            </div>
                            {!editTask || item.task_id !== taskId ? (
                              <div className="m-actions-col">
                                <div className="actions-btns">
                                  <i
                                    className="material-icons-outlined"
                                    onClick={() => {
                                      setEditTask(true);
                                      setAddNewTask(false);
                                      setErrorEmpty("");
                                      setTaskId(item.task_id);
                                      setNameTask(item.task_name);
                                      setStartTask(item.tat_taskStartdate);
                                      setEndTask(item.tat_taskDuedate);
                                      setTypeTask(item.task_type);
                                      setComplexTask(item.task_complexity);
                                      setAtrrTask({
                                        ...attrTask,
                                        taskSkip: item.task_skipend === "1",
                                        taskEditProcess:
                                          item.engine_process === "1",
                                        taskXMLUpload: item.xml_upload === "1",
                                        taskLayout: item.tasks_layout === "1",
                                        taskEngine: item.engine_process === "1",
                                        taskStyleEditing:
                                          item.tasks_style_editing === "1",
                                        taskeProducts:
                                          item.tasks_e_products === "1",
                                        taskFinal: item.final_upload === "1",
                                        taskBookEnd: item.task_bookend === "1",
                                        taskpre_editing:
                                          item.tasks_pre_editing === "1",
                                        taskQuality: item.tasks_quality === "1",
                                      });
                                    }}
                                  >
                                    edit
                                  </i>
                                  <i
                                    className="material-icons-outlined"
                                    onClick={() => {
                                      setTaskId(item.task_id);
                                      setModalTaskDelete(true);
                                    }}
                                  >
                                    delete
                                  </i>
                                  <i
                                    className="material-icons-outlined drag-item"
                                    {...provided.dragHandleProps}
                                  >
                                    drag_indicator
                                  </i>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="actions-task actions-milestone align-right"
                                colSpan="2"
                              >
                                <a
                                  href="#"
                                  className="cancel-milestone cancel-icon"
                                  onClick={() => {
                                    setTaskId("");
                                    setEditTask(false);
                                    setErrorEmpty(false);
                                  }}
                                >
                                  <i className="material-icons-outlined ">
                                    close
                                  </i>
                                </a>
                                <i
                                  className="material-icons-outlined"
                                  onClick={() => {
                                    setTaskId(item.task_id);
                                    setModalTaskDelete(true);
                                  }}
                                >
                                  delete
                                </i>
                                <a
                                  onClick={() => updateTask()}
                                  className="save-milestone save-icon btn-icon"
                                >
                                  <i className="material-icons-outlined">
                                    save
                                  </i>
                                </a>
                              </div>
                            )}
                          </div>
                          {editTask && item.task_id === taskId && (
                            <>
                              <div>
                                <div className="milestone-label">
                                  Task Attributes
                                </div>
                                <div
                                  className="taskRow"
                                  style={{
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskSkip"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskSkip"
                                      name="taskSkip"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskSkip: !attrTask.taskSkip,
                                        });
                                      }}
                                      defaultChecked={item.task_skipend === "1"}
                                    />
                                    <span>Skip</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskEngine"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskEngine"
                                      name="taskEngine"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskEngine: !attrTask.taskEngine,
                                        });
                                      }}
                                      defaultChecked={
                                        item.engine_process === "1"
                                      }
                                    />
                                    <span>Engine Process</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskXMLUpload"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskXMLUpload"
                                      name="taskXMLUpload"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskXMLUpload:
                                            !attrTask.taskXMLUpload,
                                        });
                                      }}
                                      defaultChecked={item.xml_upload === "1"}
                                    />
                                    <span>XML Upload</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskEditProcess"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskEditProcess"
                                      name="taskEditProcess"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskEditProcess:
                                            !attrTask.taskEditProcess,
                                        });
                                      }}
                                      defaultChecked={
                                        item.editing_process === "1"
                                      }
                                    />
                                    <span>Edit Process</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskLayout"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskLayout"
                                      name="taskLayout"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskLayout: !attrTask.taskLayout,
                                        });
                                      }}
                                      defaultChecked={item.tasks_layout === "1"}
                                    />
                                    <span>Layout</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskStyleEditing"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskStyleEditing"
                                      name="taskStyleEditing"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskStyleEditing:
                                            !attrTask.taskStyleEditing,
                                        });
                                      }}
                                      defaultChecked={
                                        item.tasks_style_editing === "1"
                                      }
                                    />
                                    <span>Style Editing</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskeProducts"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskeProducts"
                                      name="taskeProducts"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskeProducts:
                                            !attrTask.taskeProducts,
                                        });
                                      }}
                                      defaultChecked={
                                        item.tasks_e_products === "1"
                                      }
                                    />
                                    <span>eProducts</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskFinal"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskFinal"
                                      name="taskFinal"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskFinal: !attrTask.taskFinal,
                                        });
                                      }}
                                      defaultChecked={item.final_upload === "1"}
                                    />
                                    <span>Final</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskBookEnd"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskBookEnd"
                                      name="taskBookEnd"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskBookEnd: !attrTask.taskBookEnd,
                                        });
                                      }}
                                      defaultChecked={item.task_bookend === "1"}
                                    />
                                    <span>Task Bookend</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskpre_editing"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskpre_editing"
                                      name="taskpre_editing"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskpre_editing:
                                            !attrTask.taskpre_editing,
                                        });
                                      }}
                                      defaultChecked={
                                        item.tasks_pre_editing === "1"
                                      }
                                    />
                                    <span>Pre-editing</span>
                                  </label>

                                  <label
                                    className="pure-material-checkbox"
                                    htmlFor="taskQuality"
                                  >
                                    <input
                                      type="checkbox"
                                      className="project-checkbox"
                                      id="taskQuality"
                                      name="taskQuality"
                                      onChange={() => {
                                        setAtrrTask({
                                          ...attrTask,
                                          taskQuality: !attrTask.taskQuality,
                                        });
                                      }}
                                      defaultChecked={
                                        item.tasks_quality === "1"
                                      }
                                    />
                                    <span>Quality</span>
                                  </label>
                                  {errorEmpty &&
                                    !Object.entries(attrTask).filter(
                                      ([key, value]) => value === true,
                                    ).length > 0 &&
                                    item.task_id == taskId && (
                                      <span className="msg-error">
                                        Select Task Attributes
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div
                                className="taskRow"
                                data-id="1"
                                id="milestoneRow-1"
                              >
                                <div
                                  className="milestone-type-col"
                                  onChange={(e) => {
                                    setTypeTask(e.target.value);
                                  }}
                                >
                                  <div className="milestone-label">
                                    Task Type
                                  </div>
                                  <div className="taskRow">
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="1"
                                        id="internal"
                                        name="taskType"
                                        defaultChecked={item.task_type === "1"}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="internal"
                                      >
                                        Internal
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="2"
                                        id="external"
                                        name="taskType"
                                        defaultChecked={item.task_type === "2"}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="external"
                                      >
                                        External
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="3"
                                        id="pm"
                                        name="taskType"
                                        defaultChecked={item.task_type === "3"}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="pm"
                                      >
                                        PM
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="4"
                                        id="both"
                                        name="taskType"
                                        defaultChecked={item.task_type === "4"}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="both"
                                      >
                                        Both
                                      </label>
                                    </div>
                                  </div>
                                  {errorEmpty &&
                                    (typeTask === "" || +typeTask === 0) &&
                                    item.task_id == taskId && (
                                      <span className="msg-error">
                                        Select Task Type
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="taskRow">
                                <div
                                  className="milestone-type-col milestone-complexity-col"
                                  onChange={(e) => {
                                    setComplexTask(e.target.value);
                                  }}
                                >
                                  <div className="milestone-label">
                                    Task Complexity
                                  </div>
                                  <div className="taskRow">
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="1"
                                        id="simple"
                                        name="taskComplexity"
                                        defaultChecked={
                                          item.task_complexity === "1"
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="simple"
                                      >
                                        Simple
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="2"
                                        id="Medium"
                                        name="taskComplexity"
                                        defaultChecked={
                                          item.task_complexity === "2"
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="Medium"
                                      >
                                        Medium
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="3"
                                        id="complex"
                                        name="taskComplexity"
                                        defaultChecked={
                                          item.task_complexity === "3"
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="complex"
                                      >
                                        Complex
                                      </label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        value="4"
                                        id="superComplex"
                                        name="taskComplexity"
                                        defaultChecked={
                                          item.task_complexity === "4"
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="superComplex"
                                      >
                                        Super Complex
                                      </label>
                                    </div>
                                  </div>
                                  {errorEmpty &&
                                    (complexTask === "" ||
                                      +complexTask === 0) &&
                                    item.task_id == taskId && (
                                      <span className="msg-error">
                                        Select Task Complexity
                                      </span>
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {addNewTask && (
        <div className="task-add task-details task-editing">
          <div className="taskRow " data-id="1" id="milestoneRow-1">
            <div className="m-title-col">
              <input
                type="text"
                id="newTaskName"
                name="taskName"
                placeholder="Type Task name here..."
                style={{ marginLeft: 0 }}
                onChange={(event) => setNameTask(event.target.value)}
                value={nameTask}
              />
              {errorEmpty && nameTask === "" && (
                <span className="msg-error">Enter Task Name</span>
              )}
            </div>
            <div className="m-start-col ws">
              <div className="content-date">
                <input
                  type="number"
                  id="tat_startDate"
                  name="tat_startDate"
                  placeholder="Type the start TAT days"
                  style={{ marginLeft: 0 }}
                  min="0"
                  onChange={(event) => setStartTask(event.target.value)}
                  value={startTask}
                />
              </div>
              {errorEmpty && (startTask === "" || +startTask === 0) && (
                <span className="msg-error">Enter Start Date</span>
              )}
            </div>
            <div className="m-due-col ws">
              <div className="content-date">
                {/* <div className="milestone-label">End Day</div> */}
                <input
                  type="number"
                  id="tat_endDate"
                  name="tat_endDate"
                  min="0"
                  placeholder="Type the end TAT days"
                  style={{ marginLeft: 0 }}
                  onChange={(event) => setEndTask(event.target.value)}
                  value={endTask}
                />
              </div>
              {errorEmpty && (endTask === "" || +endTask === 0) && (
                <span className="msg-error">Enter End Date</span>
              )}
            </div>
            <div
              className="actions-task  actions-milestone align-right"
              colSpan="2"
            >
              <a
                href="#"
                className="cancel-milestone cancel-icon"
                data-toggle="tooltip"
                data-placement="top"
                title="Cancel"
                onClick={() => {
                  setAddNewTask(false);
                  setErrorEmpty(false);
                }}
              >
                <i className="material-icons-outlined ">close</i>
              </a>
              <a
                onClick={() => createTask()}
                className="save-milestone save-icon"
                data-toggle="tooltip"
                data-placement="top"
                title="Save"
              >
                <i className="material-icons-outlined">save</i>
              </a>
            </div>
          </div>
          <div>
            <div className="milestone-label">Task Attributes</div>
            <div
              className="taskRow"
              style={{
                flexWrap: "wrap",
              }}
            >
              <label className="pure-material-checkbox" htmlFor="taskSkip">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskSkip"
                  name="taskSkip"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskSkip: !attrTask.taskSkip,
                    });
                  }}
                />
                <span>Skip</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskEngine">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskEngine"
                  name="taskEngine"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskEngine: !attrTask.taskEngine,
                    });
                  }}
                />
                <span>Engine Process</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskXMLUpload">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskXMLUpload"
                  name="taskXMLUpload"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskXMLUpload: !attrTask.taskXMLUpload,
                    });
                  }}
                />
                <span>XML Upload</span>
              </label>

              <label
                className="pure-material-checkbox"
                htmlFor="taskEditProcess"
              >
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskEditProcess"
                  name="taskEditProcess"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskEditProcess: !attrTask.taskEditProcess,
                    });
                  }}
                />
                <span>Edit Process</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskLayout">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskLayout"
                  name="taskLayout"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskLayout: !attrTask.taskLayout,
                    });
                  }}
                />
                <span>Layout</span>
              </label>

              <label
                className="pure-material-checkbox"
                htmlFor="taskStyleEditing"
              >
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskStyleEditing"
                  name="taskStyleEditing"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskStyleEditing: !attrTask.taskStyleEditing,
                    });
                  }}
                />
                <span>Style Editing</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskeProducts">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskeProducts"
                  name="taskeProducts"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskeProducts: !attrTask.taskeProducts,
                    });
                  }}
                />
                <span>eProducts</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskFinal">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskFinal"
                  name="taskFinal"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskFinal: !attrTask.taskFinal,
                    });
                  }}
                />
                <span>Final</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskBookEnd">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskBookEnd"
                  name="taskBookEnd"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskBookEnd: !attrTask.taskBookEnd,
                    });
                  }}
                />
                <span>Task Bookend</span>
              </label>

              <label
                className="pure-material-checkbox"
                htmlFor="taskpre_editing"
              >
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskpre_editing"
                  name="taskpre_editing"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskpre_editing: !attrTask.taskpre_editing,
                    });
                  }}
                />
                <span>Pre-editing</span>
              </label>

              <label className="pure-material-checkbox" htmlFor="taskQuality">
                <input
                  type="checkbox"
                  className="project-checkbox"
                  id="taskQuality"
                  name="taskQuality"
                  onChange={() => {
                    setAtrrTask({
                      ...attrTask,
                      taskQuality: !attrTask.taskQuality,
                    });
                  }}
                />
                <span>Quality</span>
              </label>
            </div>
            {errorEmpty &&
              !Object.entries(attrTask).filter(([key, value]) => value === true)
                .length > 0 && (
                <span className="msg-error">Select Task Attributes</span>
              )}
          </div>
          <div className="taskRow" data-id="1" id="milestoneRow-1">
            <div
              className="milestone-type-col"
              onChange={(e) => {
                setTypeTask(e.target.value);
              }}
            >
              <div className="milestone-label">Task Type</div>
              <div className="taskRow">
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="1"
                    id="internal"
                    name="taskType"
                  />
                  <label className="custom-control-label" htmlFor="internal">
                    Internal
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="2"
                    id="external"
                    name="taskType"
                  />
                  <label className="custom-control-label" htmlFor="external">
                    External
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="3"
                    id="pm"
                    name="taskType"
                  />
                  <label className="custom-control-label" htmlFor="pm">
                    PM
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="4"
                    id="both"
                    name="taskType"
                  />
                  <label className="custom-control-label" htmlFor="both">
                    Both
                  </label>
                </div>
              </div>
              {errorEmpty && (typeTask === "" || +typeTask === 0) && (
                <span className="msg-error">Select Task Type</span>
              )}
            </div>
          </div>
          <div className="taskRow">
            <div
              className="milestone-type-col milestone-complexity-col"
              onChange={(e) => {
                setComplexTask(e.target.value);
              }}
            >
              <div className="milestone-label">Task Complexity</div>
              <div className="taskRow">
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="1"
                    id="simple"
                    name="taskComplexity"
                    defaultChecked={complexTask === "1"}
                  />
                  <label className="custom-control-label" htmlFor="simple">
                    Simple
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="2"
                    id="Medium"
                    name="taskComplexity"
                    defaultChecked={complexTask === "2"}
                  />
                  <label className="custom-control-label" htmlFor="Medium">
                    Medium
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="3"
                    id="complex"
                    name="taskComplexity"
                    defaultChecked={complexTask === "3"}
                  />
                  <label className="custom-control-label" htmlFor="complex">
                    Complex
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="4"
                    id="superComplex"
                    name="taskComplexity"
                    defaultChecked={complexTask === "4"}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="superComplex"
                  >
                    Super Complex
                  </label>
                </div>
              </div>
              {errorEmpty && (complexTask === "" || +typeTask === 0) && (
                <span className="msg-error">Select Task Complexity</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="secondary-navigation">
        <button
          className="add-task"
          onClick={() => {
            setAddNewTask(true);
            setNameTask("");
            setTypeTask("");
            setComplexTask("");
            setStartTask("");
            setEndTask("");
            setEditTask(false);
          }}
        >
          <i className="material-icons-outlined">add</i>
          Add Task
        </button>
      </div>

      <Modal
        displayModal={modalTaskDelete}
        title="Confirmation"
        body="Are you sure that you want to delete this task?"
        button1Text="Cancel"
        handleButton1Modal={() => {
          setModalTaskDelete(false);
        }}
        closeModal={() => {
          setModalTaskDelete(false);
        }}
        Button2Text="Confirm"
        handleButton2Modal={() => {
          deleteTask(taskId);
        }}
      />
    </>
  );
}
