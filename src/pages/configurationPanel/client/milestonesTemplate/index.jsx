import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { api } from "../../../../services/api";

import Modal from "../../../../components/Modal/modal";
import TasksList from "./tasksList";

function MilestoneList(props) {
  const { companyId, typeId, categoryId, indexId } = props;

  const [loading, setLoading] = useState(false);
  const [dataMilestones, setDataMilestones] = useState("");

  const [addNewMilestone, setAddNewMilestone] = useState(false);
  const [modalMilestoneDelete, setModalMilestoneDelete] = useState(false);
  const [milestoneIdSelected, setMilestoneIdSelected] = useState(0);
  const [editMilestone, setEditMilestone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getData();
    setAddNewMilestone(false);
    setEditMilestone(false);
    setMilestoneIdSelected(0);
  }, [indexId]);

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

    const items = reorder(
      dataMilestones,
      result.source.index,
      result.destination.index,
    );
    setDataMilestones(items);

    items.map((item, index) => {
      if (parseInt(item.order_id) !== index + 1) {
        api
          .put("/milestone-template/order/update", {
            milestone_id: item.milestone_id,
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
    padding: isDragging && "12px",
    margin: isDragging && "0 -12px",
    width: isDragging && "calc(100% + 24px)",
    borderRadius: isDragging && "5px",
    boxShadow: isDragging && "0 5px 15px -5px #ccc",
    ...draggableStyle,
  });

  async function getData() {
    setLoading("data");
    props.loader("show");
    await api
      .post(
        `${
          import.meta.env.VITE_URL_API_SERVICE
        }/configuration/project/templatelist`,
        {
          companyId,
        },
      )
      .then((data) => {
        const types = data.data.projectTemplateList.filter(function (item) {
          return +item.id === +typeId;
        })[0];
        const templates = types?.categoryList[indexId].templates;
        setDataMilestones(templates);
        setLoading("");
        props.loader("false");
      });
  }

  async function createMilestone(data) {
    setLoading("create");
    await api
      .post("/milestone-template/create", {
        milestone_title: data.milestone_title,
        tat_startDate: data.tat_startDate,
        tat_endDate: data.tat_endDate,
        milestone_type: parseInt(data.milestone_type),
        milestone_complexity: data.milestone_complexity,
        company_id: parseInt(companyId),
        type_id: parseInt(typeId),
        category_id: parseInt(categoryId),
        order_id: 1,
      })
      .then(() => {
        getData();
        setAddNewMilestone(false);
        setError({});
        reset({});
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading("");
      });
  }

  async function updateMilestone(data) {
    setLoading("update");
    for (let index = 0; index < dataMilestones.length; index++) {
      const elUpdate = data.milestone[index];
      const elOriginal = dataMilestones[index];

      if (
        elUpdate.milestone_title !== elOriginal.milestone_title ||
        elUpdate.tat_startDate !== elOriginal.tat_startDate ||
        elUpdate.tat_endDate !== elOriginal.tat_endDate
      ) {
        await api
          .put("/milestone-template/update", {
            milestone_name: elUpdate.milestone_title,
            milestone_id: elOriginal.milestone_id,
            start_tat_days: parseInt(elUpdate.tat_startDate),
            end_tat_days: parseInt(elUpdate.tat_endDate),
            milestone_type: elOriginal.milestone_type,
            milestone_complexity: elOriginal.milestone_complexity,
            order_id: elUpdate.order,
          })
          .then(() => {
            getData();
            setEditMilestone(false);
            setError({});
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading("");
          });
      }
    }
  }

  async function deleteMilestone(id) {
    await api
      .post(`/milestone-template/delete/${id}`)
      .then(() => {
        getData();
        setModalMilestoneDelete(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="milestonelisting">
        <h2 className="h2">Milestones</h2>
        <div className="primary-navigation secondary-navigation">
          {!editMilestone ? (
            <>
              <a
                href="#"
                className="add-milestones editing-sec-options"
                onClick={() => setAddNewMilestone(true)}
              >
                <i className="material-icons-outlined">add</i>
                Create Milestone
              </a>
              <a
                href="#"
                className="edit-milestones df-sec-options"
                onClick={() => {
                  setEditMilestone(true);
                  setAddNewMilestone(false);
                }}
              >
                <i className="material-icons-outlined">edit</i> Edit Milestones
              </a>
            </>
          ) : (
            <>
              <a
                href="#"
                className="edit-milestones df-sec-options"
                onClick={() => setEditMilestone(false)}
              >
                <i className="material-icons-outlined">close</i> Cancel Editing
              </a>
              <a
                href="#"
                className="edit-milestones df-sec-options"
                onClick={handleSubmit(updateMilestone)}
              >
                <i className="material-icons-outlined">save</i> Save Updates
              </a>
            </>
          )}
        </div>

        {addNewMilestone && (
          <div className="milestone-add">
            <div className="milestoneRow " data-id="1" id="milestoneRow-1">
              <div className="m-title-col" style={{ width: "100%" }}>
                <div className="milestone-label">Milestone Name</div>
                <input
                  type="text"
                  id="milestone_title"
                  name="milestone_title"
                  placeholder="Type Milestone name here..."
                  style={{ marginLeft: 0 }}
                  {...register("milestone_title", { required: true })}
                />
                {errors.milestone_title && (
                  <span className="msg-error">Enter Milestone Name</span>
                )}
              </div>
              <div className="m-start-col ws">
                <div className="content-date">
                  <div className="milestone-label">Start Day </div>
                  <input
                    type="number"
                    id="tat_startDate"
                    name="tat_startDate"
                    placeholder="Type the start TAT days"
                    style={{ marginLeft: 0 }}
                    min="0"
                    {...register("tat_startDate", { required: true })}
                  />
                </div>
                {errors.tat_startDate && (
                  <span className="msg-error">Enter Start Date</span>
                )}
              </div>
              <div className="m-due-col ws">
                <div className="content-date">
                  <div className="milestone-label">End Day</div>
                  <input
                    type="number"
                    id="tat_endDate"
                    name="tat_endDate"
                    min="0"
                    placeholder="Type the end TAT days"
                    style={{ marginLeft: 0 }}
                    {...register("tat_endDate", { required: true })}
                  />
                </div>
                {errors.tat_endDate && (
                  <span className="msg-error">Enter End Date</span>
                )}
              </div>
            </div>
            <div className="milestoneRow" data-id="1" id="milestoneRow-1">
              <div className="milestone-type-col">
                <div className="milestone-label">Milestone Type</div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="1"
                    id="internal"
                    name="milestone_type"
                    {...register("milestone_type", { required: true })}
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
                    name="milestone_type"
                    {...register("milestone_type", { required: true })}
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
                    name="milestone_type"
                    {...register("milestone_type", { required: true })}
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
                    name="milestone_type"
                    {...register("milestone_type", { required: true })}
                  />
                  <label className="custom-control-label" htmlFor="both">
                    Both
                  </label>
                </div>
                {errors.milestone_type && (
                  <span className="msg-error">Select Milestone Type</span>
                )}
              </div>
              <div className="milestone-type-col milestone-complexity-col">
                <div className="milestone-label">Milestone Complexity</div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    value="1"
                    id="simple"
                    name="milestone_complexity"
                    {...register("milestone_complexity", { required: true })}
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
                    name="milestone_complexity"
                    {...register("milestone_complexity", { required: true })}
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
                    name="milestone_complexity"
                    {...register("milestone_complexity", { required: true })}
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
                    name="milestone_complexity"
                    {...register("milestone_complexity", { required: true })}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="superComplex"
                  >
                    Super Complex
                  </label>
                </div>
                {errors.milestone_complexity && (
                  <span className="msg-error">Select Milestone Complexity</span>
                )}
              </div>
              <div className="actions-milestone align-right" colSpan="2">
                <a
                  href="#"
                  className="cancel-milestone cancel-icon"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Cancel"
                  onClick={() => {
                    setAddNewMilestone(false);
                    reset({});
                  }}
                >
                  <i className="material-icons-outlined ">close</i>
                </a>
                <a
                  href="#"
                  onClick={handleSubmit(createMilestone)}
                  className="save-milestone save-icon"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Save"
                >
                  <i className="material-icons-outlined">save</i>
                </a>
              </div>
            </div>
          </div>
        )}

        {dataMilestones.length > 0 && (
          <div
            className={
              editMilestone
                ? "table table-striped table-borderless table-oversize article-list-table milestone-table editing"
                : "table table-striped table-borderless table-oversize article-list-table milestone-table"
            }
          >
            <div>
              <div className="item-mlstn-template heading">
                <div className="m-title-col">Milestone Name</div>
                <div className="m-start-col">Start Day</div>
                <div className="m-due-col">End Day</div>
                <div className="m-actions-col" />
                <div />
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {dataMilestones.map((milestone, index) => {
                      return (
                        <Draggable
                          key={milestone.milestone_id + index}
                          draggableId={milestone.milestone_id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="item-mlstn-template"
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style,
                                )}
                              >
                                <div className="m-title-col">
                                  {!editMilestone ? (
                                    <span>{milestone.milestone_title}</span>
                                  ) : (
                                    <>
                                      <input
                                        type="text"
                                        name={`milestone[${index}]milestone_title`}
                                        defaultValue={milestone.milestone_title}
                                        {...register(
                                          `milestone.${index}.milestone_title`,
                                          { required: true },
                                        )}
                                      />

                                      {/* {errors.milestone[index]
                                          ?.milestone_title && (
                                          <span className="msg-error">
                                            Enter valid Milestone Name
                                          </span>
                                        )} */}
                                    </>
                                  )}
                                </div>

                                <div className="m-start-col">
                                  {!editMilestone ? (
                                    <span>Day {milestone.tat_startDate}</span>
                                  ) : (
                                    <>
                                      <input
                                        type="number"
                                        name={`milestone[${index}]tat_startDate`}
                                        min="0"
                                        max="999"
                                        defaultValue={`${milestone.tat_startDate}`}
                                        {...register(
                                          `milestone.${index}.tat_startDate`,
                                          { required: true },
                                        )}
                                      />

                                      {/* {errors.milestone[index]
                                            ?.tat_startDate && (
                                            <span className="msg-error">
                                              Enter valid end TAT day
                                            </span>
                                          )} */}
                                    </>
                                  )}
                                </div>

                                <div className="m-due-col">
                                  {!editMilestone ? (
                                    <span>Day {milestone.tat_endDate}</span>
                                  ) : (
                                    <>
                                      <input
                                        type="number"
                                        name={`milestone[${index}]tat_endDate`}
                                        defaultValue={milestone.tat_endDate}
                                        {...register(
                                          `milestone.${index}.tat_endDate`,
                                          { required: true },
                                        )}
                                        min="0"
                                        max="999"
                                      />
                                      {/* {errors.milestone[index]
                                            ?.tat_endDate && (
                                            <span className="msg-error">
                                              Enter valid start TAT day
                                            </span>
                                          )} */}
                                    </>
                                  )}
                                </div>

                                <div className="m-actions-col">
                                  {!editMilestone ? (
                                    <div className="actions-btns">
                                      <button
                                        type="button"
                                        className="open-item"
                                        onClick={() =>
                                          milestoneIdSelected ===
                                          milestone.milestone_id
                                            ? setMilestoneIdSelected("")
                                            : setMilestoneIdSelected(
                                                milestone.milestone_id,
                                              )
                                        }
                                      >
                                        <i className="material-icons-outlined">
                                          {milestoneIdSelected ===
                                          milestone.milestone_id
                                            ? "keyboard_arrow_up"
                                            : "keyboard_arrow_down"}
                                        </i>
                                      </button>
                                      <i
                                        className="material-icons-outlined drag-item"
                                        {...provided.dragHandleProps}
                                      >
                                        drag_indicator
                                      </i>
                                    </div>
                                  ) : (
                                    <i
                                      onClick={() => {
                                        setMilestoneIdSelected(
                                          milestone.milestone_id,
                                        );
                                        setModalMilestoneDelete(true);
                                      }}
                                      className="material-icons-outlined delete-icon delete-item"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title="Delete"
                                    >
                                      delete
                                    </i>
                                  )}
                                </div>
                              </div>
                              {milestoneIdSelected ===
                                milestone.milestone_id && (
                                <div className="tasks-space ">
                                  <div>
                                    <TasksList
                                      milestoneId={milestone.milestone_id}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>

      <Modal
        displayModal={modalMilestoneDelete}
        title="Confirmation"
        body="Are you sure that you want to delete the Milestone?"
        button1Text="Cancel"
        handleButton1Modal={() => {
          setModalMilestoneDelete(false);
        }}
        closeModal={() => {
          setModalMilestoneDelete(false);
        }}
        Button2Text="Confirm"
        handleButton2Modal={() => {
          deleteMilestone(milestoneIdSelected);
        }}
      />
    </>
  );
}

export default MilestoneList;
