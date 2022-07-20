import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import Modal from "../../../../components/Modal/modal";
import { api } from "../../../../services/api";

export default function TasksList({ milestoneId }) {
  const [data, setData] = useState([]);
  const [addNewTask, setAddNewTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState("");
  const [lastOrderId, setLastOrderId] = useState(0);
  const [modalTaskDelete, setModalTaskDelete] = useState(false);
  const taskInput = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getUser = async (userId) => {
    await api
      .get(`/user/${userId}`)
      .then((response) => {
        return response.data.data.info;
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
        setLastOrderId(data.data.tasklist.length);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData();
    setAddNewTask(false);
  }, [milestoneId]);

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

  async function createTask(data) {
    await api
      .post("/task-template/create", {
        milestone_id: milestoneId,
        taskName: data.task_name,
        taskDescription: data.task_name,
        taskAttr: data.taskAttr,
        tat_startDate: parseInt(data.tat_taskStartdate, 10),
        tat_endDate: parseInt(data.tat_taskDuedate, 10),
        task_type: data.task_type,
        task_complexity: data.task_complexity,
        status_id: 1,
        order_id: lastOrderId,
      })
      .then(() => {
        getData();
        setAddNewTask(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function updateTask(data) {
    await api
      .put("/task-template/update", {
        taskId,
        taskName: data.task_name,
        taskAttr: data.taskAttr,
        tat_startDate: parseInt(data.tat_taskStartdate, 10),
        tat_endDate: parseInt(data.tat_taskDuedate, 10),
        task_type: data.task_type,
        task_complexity: data.task_complexity,
        status_id: 1,
      })
      .then(() => {
        getData();
        setAddNewTask(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const scrollToTaskInput = () => {
    taskInput.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
      if (parseInt(item.order_id, 10) !== index + 1) {
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
          <DropComponent
            data={data}
            getItemStyle={getItemStyle}
            setTaskId={setTaskId}
            setAddNewTask={setAddNewTask}
            setEditTask={setEditTask}
            reset={reset}
            getUser={getUser}
            setModalTaskDelete={setModalTaskDelete}
            scrollToTaskInput={scrollToTaskInput}
          />
        </DragDropContext>
      )}

      <div ref={taskInput}>
        {addNewTask && (
          <div className="task-add task-details task-editing">
            <div className="taskRow " data-id="1" id="milestoneRow-1">
              <div className="m-title-col">
                <input
                  type="text"
                  id="newTaskName"
                  name="task_name"
                  placeholder="Type Task name here..."
                  style={{ marginLeft: 0 }}
                  {...register("task_name", { required: true })}
                />
                {errors.task_name && (
                  <span className="msg-error">Enter Task Name</span>
                )}
              </div>
              <div className="m-start-col ws">
                <div className="content-date">
                  <input
                    type="number"
                    id="tat_startDate"
                    name="tat_taskStartdate"
                    placeholder="Type the start TAT days"
                    style={{ marginLeft: 0 }}
                    min="0"
                    {...register("tat_taskStartdate", { required: true })}
                  />
                </div>
                {errors.tat_taskStartdate && (
                  <span className="msg-error">Enter Start Date</span>
                )}
              </div>
              <div className="m-due-col ws">
                <div className="content-date">
                  {/* <div className="milestone-label">End Day</div> */}
                  <input
                    type="number"
                    id="tat_endDate"
                    name="tat_taskDuedate"
                    min="0"
                    placeholder="Type the end TAT days"
                    style={{ marginLeft: 0 }}
                    {...register("tat_taskDuedate", { required: true })}
                  />
                </div>
                {errors.tat_taskDuedate && (
                  <span className="msg-error">Enter End Date</span>
                )}
              </div>
              <div
                className="actions-task  actions-milestone align-right"
                colSpan="2"
              >
                <button
                  type="button"
                  className="cancel-milestone cancel-icon"
                  onClick={() => {
                    setAddNewTask(false);
                  }}
                >
                  <i className="material-icons-outlined ">close</i>
                </button>
                {!editTask ? (
                  <button
                    type="button"
                    onClick={handleSubmit(createTask)}
                    className="save-milestone save-icon"
                  >
                    <i className="material-icons-outlined">save</i>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(updateTask)}
                    className="save-milestone save-icon"
                  >
                    <i className="material-icons-outlined">save</i>
                  </button>
                )}
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
                    name="taskAttr[0]"
                    value="taskSkip"
                    {...register("taskAttr")}
                  />
                  <span>Skip</span>
                </label>

                <label className="pure-material-checkbox" htmlFor="taskEngine">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="taskEngine"
                    name="taskAttr[1]"
                    value="taskEngine"
                    {...register("taskAttr")}
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
                    name="taskAttr[2]"
                    value="taskXMLUpload"
                    {...register("taskAttr")}
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
                    name="taskAttr[3]"
                    value="taskEditProcess"
                    {...register("taskAttr")}
                  />
                  <span>Edit Process</span>
                </label>

                <label className="pure-material-checkbox" htmlFor="taskLayout">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="taskLayout"
                    name="taskAttr[4]"
                    value="taskLayout"
                    {...register("taskAttr")}
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
                    name="taskAttr[5]"
                    value="taskStyleEditing"
                    {...register("taskAttr")}
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
                    name="taskAttr[6]"
                    value="taskeProducts"
                    {...register("taskAttr")}
                  />
                  <span>eProducts</span>
                </label>

                <label className="pure-material-checkbox" htmlFor="taskFinal">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="taskFinal"
                    name="taskAttr[7]"
                    value="taskFinal"
                    {...register("taskAttr")}
                  />
                  <span>Final</span>
                </label>

                <label className="pure-material-checkbox" htmlFor="taskBookEnd">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="taskBookEnd"
                    name="taskAttr[8]"
                    value="taskBookEnd"
                    {...register("taskAttr")}
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
                    name="taskAttr[9]"
                    value="taskpre-editing"
                    {...register("taskAttr")}
                  />
                  <span>Pre-editing</span>
                </label>

                <label className="pure-material-checkbox" htmlFor="taskQuality">
                  <input
                    type="checkbox"
                    className="project-checkbox"
                    id="taskQuality"
                    name="taskAttr[10]"
                    {...register("taskAttr")}
                  />
                  <span>Quality</span>
                </label>
              </div>
              {errors.taskAttr && (
                <span className="msg-error">Select Task Attributes</span>
              )}
            </div>
            <div className="taskRow" data-id="1" id="milestoneRow-1">
              <div className="milestone-type-col">
                <div className="milestone-label">Task Type</div>
                <div className="taskRow">
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      value="1"
                      id="internal"
                      name="task_type"
                      {...register("task_type", { required: true })}
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
                      name="task_type"
                      {...register("task_type", { required: true })}
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
                      name="task_type"
                      {...register("task_type", { required: true })}
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
                      name="task_type"
                      {...register("task_type", { required: true })}
                    />
                    <label className="custom-control-label" htmlFor="both">
                      Both
                    </label>
                  </div>
                </div>
                {errors.task_type && (
                  <span className="msg-error">Select Task Type</span>
                )}
              </div>
            </div>
            <div className="taskRow">
              <div className="milestone-type-col milestone-complexity-col">
                <div className="milestone-label">Task Complexity</div>
                <div className="taskRow">
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      value={1}
                      id="simple"
                      name="task_complexity"
                      {...register("task_complexity", { required: true })}
                    />
                    <label className="custom-control-label" htmlFor="simple">
                      Simple
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      value={2}
                      id="Medium"
                      name="task_complexity"
                      {...register("task_complexity", { required: true })}
                    />
                    <label className="custom-control-label" htmlFor="Medium">
                      Medium
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      value={3}
                      id="complex"
                      name="task_complexity"
                      {...register("task_complexity", { required: true })}
                    />
                    <label className="custom-control-label" htmlFor="complex">
                      Complex
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      value={4}
                      id="superComplex"
                      name="task_complexity"
                      {...register("task_complexity", { required: true })}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="superComplex"
                    >
                      Super Complex
                    </label>
                  </div>
                </div>
                {errors.task_complexity && (
                  <span className="msg-error">Select Task Complexity</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="secondary-navigation">
        <button
          type="button"
          className="add-task"
          onClick={() => {
            setAddNewTask(true);
            setEditTask(false);
            reset({
              task_name: "",
              tat_taskStartdate: "",
              tat_taskDuedate: "",
              task_type: "",
              task_complexity: "",
            });
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

function DropComponent({
  data,
  getItemStyle,
  getUser,
  setTaskId,
  setEditTask,
  setAddNewTask,
  setModalTaskDelete,
  reset,
  scrollToTaskInput,
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId="droppableID">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {data.map((item, index) => {
            return (
              <Draggable
                key={item.task_id}
                draggableId={item.task_id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className="task-add task-details task-editing"
                    key={item.task_id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                    )}
                  >
                    <div className="item-mlstn-template item-task-template">
                      <div className="m-avatar-col">
                        <div className="task-members">
                          {item.user_id &&
                          +item.user_id !== 0 &&
                          getUser(item.user_id).avatar ? (
                            <img
                              alt={item.task.user_id}
                              className="avatar"
                              src={`${
                                import.meta.env.URL_API_SERVICE
                              }/file/src/?path=${getUser(item.user_id).avatar}`}
                            />
                          ) : (
                            <div className="avatar">
                              <i className="material-icons-outlined">person</i>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="m-title-col">
                        <p className="daysTask">{item.task_name}</p>
                      </div>
                      <div className="m-start-col">
                        <p className="daysTask">Day {item.tat_taskStartdate}</p>
                      </div>
                      <div className="m-due-col">
                        <p className="daysTask">Day {item.tat_taskDuedate}</p>
                      </div>
                      <div className="m-actions-col">
                        <div className="actions-btns">
                          <button
                            onClick={() => {
                              setAddNewTask(true);
                              setEditTask(true);
                              reset({
                                ...item,
                                taskAttr: [
                                  item.tasks_pre_editing !== "0" &&
                                    "taskpre-editing",
                                  item.tasks_layout !== "0" && "taskLayout",
                                  item.task_skipend !== "0" && "taskSkip",
                                  item.engine_process !== "0" &&
                                    "taskEditProcess",
                                  item.xml_upload !== "0" && "taskXMLUpload",
                                  item.engine_process !== "0" && "taskEngine",
                                  item.tasks_style_editing !== "0" &&
                                    "taskStyleEditing",
                                  item.tasks_e_products !== "0" &&
                                    "taskeProducts",
                                  item.task_bookend !== "0" && "taskBookEnd",
                                  item.tasks_quality !== "0" && "taskQuality",
                                ],
                              });
                              scrollToTaskInput();
                              setTaskId(item.task_id);
                            }}
                            type="button"
                          >
                            <i className="material-icons-outlined">edit</i>
                          </button>
                          <button
                            onClick={() => {
                              setTaskId(item.task_id);
                              setModalTaskDelete(true);
                            }}
                            type="button"
                          >
                            <i className="material-icons-outlined">delete</i>
                          </button>

                          <i
                            className="material-icons-outlined drag-item"
                            {...provided.dragHandleProps}
                          >
                            drag_indicator
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
