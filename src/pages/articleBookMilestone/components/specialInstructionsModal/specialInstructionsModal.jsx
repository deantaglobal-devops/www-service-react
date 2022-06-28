import { useState } from "react";
import ModalForm from "../../../../components/ModalForm/modalForm";

export default function SpecialInstructionsModal({
  openSpecialInstructionsModal,
  handleOnCloseSpecialInstructionsModal,
  specialInstructionsValue,
  setProjectData,
  projectData,
  projectId,
  chapterId,
}) {
  const [specialInstructionsData, setSpecialInstructionsData] = useState(
    specialInstructionsValue,
  );
  const [isEditable, setIsEditable] = useState({ id: 0, editable: false });
  const [isAddNew, setIsAddNew] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [addNewSpecialInstructionsData, setAddNewSpecialInstructionsData] =
    useState({ content: "", taskId: [] });

  const handleOnClickEdit = (e, id) => {
    e.preventDefault();
    setIsEditable({ id, editable: true });
  };

  const handleOnChange = (e, id) => {
    if (e) {
      e.preventDefault();

      const updatedValues = specialInstructionsData?.map((si) => {
        if (si.checklist_id === id) {
          return {
            ...si,
            [e.target.name]: e.target.value,
          };
        }
        return si;
      });

      setSpecialInstructionsData(updatedValues);
    }
  };

  const handleSaveSi = async (e, id) => {
    e.preventDefault();

    const valueUpdated = specialInstructionsData?.filter(
      (si) => si.checklist_id === id,
    );

    const newSpecialInstructionsData = specialInstructionsData.map((si) => {
      if (si.checklist_id === id) {
        return valueUpdated[0];
      }
      return si;
    });

    await fetch("/call/checklist/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        checklistId: valueUpdated[0].checklist_id,
        checklistTitle:
          valueUpdated[0].checklist_name === "" &&
          valueUpdated[0].checklist_name_neg === ""
            ? ""
            : valueUpdated[0].checklist_name !== ""
            ? valueUpdated[0].checklist_name
            : valueUpdated[0].checklist_name_neg,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // location.reload();
          setProjectData({
            ...projectData,
            special_instruction: newSpecialInstructionsData,
          });
          setSpecialInstructionsData(newSpecialInstructionsData);
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );

    setIsEditable({ id: 0, editable: false });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    await fetch(`/call/checklist/${id}/delete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const valueUpdated = specialInstructionsData.filter(
            (si) => si.checklist_id !== id,
          );

          setProjectData({ ...projectData, special_instruction: valueUpdated });
          setSpecialInstructionsData(valueUpdated);
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );

    setIsEditable({ id: 0, editable: false });
  };

  const handleAddNew = async (e) => {
    e.preventDefault();

    const _milestones = await fetch(`/call/project/${projectId}/taskslist`)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.milestones) {
            return result.milestones;
          }
          if (result.articles) {
            const filteredMilestoneList = [];

            result.articles.forEach((article) => {
              if (article.articleId == chapterId) {
                filteredMilestoneList.push(article.milestones);
              }
            });

            return filteredMilestoneList;
          }
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
          return [];
        },
      );

    setMilestones(_milestones);
    setIsAddNew(true);
  };

  const handleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownActive(!isDropdownActive);
  };

  const handleOnChangeAddNew = (e) => {
    const taskIdValues = addNewSpecialInstructionsData.taskId;
    if (e.target.name === "taskId") {
      const index = taskIdValues.indexOf(e.target.value);
      if (index < 0) {
        taskIdValues.push(e.target.value);
      } else {
        taskIdValues.splice(index, 1);
      }
    }

    setAddNewSpecialInstructionsData({
      ...addNewSpecialInstructionsData,
      [e.target.name]:
        e.target.name === "taskId" ? taskIdValues : e.target.value,
    });
  };

  const acceptSpecialInstructionsOptions = () => {
    // close drodown menu - special instructions
    const theSelectCont = document.querySelector(".content-select.active");
    theSelectCont.classList.remove("active");
    const theSelectElem = document.querySelector(".content-select-options");
    theSelectElem.style = "display: none;"; // the options
  };

  const handleSaveNewSpecialInstructions = async (e) => {
    e.preventDefault();

    await fetch("/call/checklist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify({
        projectId,
        taskId: addNewSpecialInstructionsData.taskId.join(","),
        content: addNewSpecialInstructionsData.content,
        isChecklist: false,
        chapterId: chapterId !== undefined ? chapterId : "0",
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          location.reload();
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );

    setIsAddNew(false);
    setAddNewSpecialInstructionsData({ content: "", taskId: [] });
  };

  return (
    <ModalForm show={openSpecialInstructionsModal}>
      <div className="general-forms" id="edit-special-instructions">
        <div className="modal-header">
          <h5 className="modal-title">Special Instructions</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={(e) => handleOnCloseSpecialInstructionsModal(e)}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-body">
          {specialInstructionsData?.map((si) => {
            return (
              <div
                className={
                  isEditable.editable && isEditable.id === si.checklist_id
                    ? "si-item-box"
                    : "si-item-box off"
                }
                id={si.checklist_id}
                key={si.checklist_id}
              >
                <h3>
                  {si.milestone_title} — {si.task_name}
                </h3>
                {si?.checklist_name ? (
                  <>
                    <div className="content-text">{si.checklist_name}</div>
                    <textarea
                      name="checklist_name"
                      disabled={
                        !(
                          isEditable.editable &&
                          isEditable.id === si.checklist_id
                        )
                      }
                      value={si.checklist_name}
                      onChange={(e) => handleOnChange(e, si.checklist_id)}
                    />
                  </>
                ) : (
                  <>
                    <div className="content-text">{si.checklist_name_neg}</div>
                    <textarea
                      name="checklist_name_neg"
                      value={si.checklist_name_neg}
                      onChange={(e) => handleOnChange(e, si.checklist_id)}
                      disabled={
                        !(
                          isEditable.editable &&
                          isEditable.id === si.checklist_id
                        )
                      }
                    />
                  </>
                )}
                <div className="si-interactions">
                  <div
                    className={
                      isEditable.editable && isEditable.id === si.checklist_id
                        ? "df-options off"
                        : "df-options"
                    }
                  >
                    <a
                      href="#"
                      className="delete-si delete-icon special-instructions-button"
                      onClick={(e) => handleDelete(e, si.checklist_id)}
                    >
                      <i className="material-icons-outlined">delete</i>
                    </a>
                    <a
                      href="#"
                      className="edit-si special-instructions-button"
                      onClick={(e) => handleOnClickEdit(e, si.checklist_id)}
                    >
                      <i className="material-icons-outlined">edit</i>
                    </a>
                  </div>
                  <div
                    className={
                      isEditable.editable && isEditable.id === si.checklist_id
                        ? "editing-options"
                        : "editing-options off"
                    }
                  >
                    <a
                      href="#"
                      className="close-si cancel-icon special-instructions-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditable({ id: 0, editable: false });
                      }}
                    >
                      <i className="material-icons-outlined">close</i>
                    </a>
                    <a
                      href="#"
                      className="save-si save-icon special-instructions-button"
                      onClick={(e) => handleSaveSi(e, si.checklist_id)}
                    >
                      <i className="material-icons-outlined">save</i>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="new-si">
            {isAddNew && (
              <div className="si-item-box">
                <div className="wrap-field-label">
                  <div
                    className={
                      isDropdownActive
                        ? "content-select active"
                        : "content-select"
                    }
                  >
                    <div
                      className="content-select-input"
                      onClick={(e) => handleDropdown(e)}
                    >
                      <input
                        className="default-input-select"
                        type="text"
                        disabled="disabled"
                        placeholder="Select milestone/task"
                      />
                      <span className="error-msg">Please choose a task.</span>
                      <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                    <div
                      className="content-select-options"
                      style={
                        isDropdownActive
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <button
                        className="acceptOptionsBtn"
                        onClick={() => acceptSpecialInstructionsOptions()}
                      >
                        Accept options
                      </button>
                      <ul className="options">
                        {milestones?.map((milestone) => {
                          return (
                            <li key={milestone.id}>
                              <p
                                id={milestone.id}
                                data-milestoneid={milestone.id}
                              >
                                <strong>{milestone.milestoneTitle}</strong>
                              </p>

                              {milestone.tasks.map((task) => (
                                <label key={task.taskId}>
                                  <input
                                    type="checkbox"
                                    className="task-dropdown-item"
                                    id={task.taskId}
                                    value={task.taskId}
                                    name="taskId"
                                    defaultChecked={
                                      !(
                                        addNewSpecialInstructionsData?.taskId?.indexOf(
                                          task.taskId.toString(),
                                        ) < 0
                                      )
                                    }
                                    onChange={(e) => handleOnChangeAddNew(e)}
                                  />
                                  {task.taskName}
                                </label>
                              ))}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <h3 className="off">Title</h3>
                <div className="si-interactions">
                  <div className="df-options off">
                    <a href="#" className="delete-si delete-icon">
                      <i className="material-icons-outlined">delete</i>
                    </a>
                    <a href="#" className="edit-si">
                      <i className="material-icons-outlined">edit</i>
                    </a>
                  </div>
                  <div className="editing-options">
                    <a
                      href="#"
                      className="cancel-si cancel-icon cancel-new-si "
                      onClick={(e) => {
                        e.preventDefault();
                        setIsAddNew(false);
                        setAddNewSpecialInstructionsData({
                          content: "",
                          taskId: [],
                        });
                      }}
                    >
                      <i className="material-icons-outlined">close</i>
                    </a>
                    <a
                      href="#"
                      className="save-new-si save-icon"
                      onClick={(e) => handleSaveNewSpecialInstructions(e)}
                    >
                      <i className="material-icons-outlined">save</i>
                    </a>
                  </div>
                </div>
                <div className="content-text" />
                <textarea
                  name="content"
                  value={addNewSpecialInstructionsData.content}
                  placeholder="Type the instruction here…"
                  onChange={(e) => handleOnChangeAddNew(e)}
                />
                <span className="error-msg">Please add an instruction</span>
              </div>
            )}
          </div>

          <div className="secondary-navigation">
            <a href="#" className="add-si" onClick={(e) => handleAddNew(e)}>
              <i className="material-icons-outlined">add</i> Add New
            </a>
          </div>
        </div>
        <div className="modal-footer cta-right">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-dismiss="modal"
            onClick={(e) => handleOnCloseSpecialInstructionsModal(e)}
          >
            Close Special Instructions
          </button>
        </div>
      </div>
    </ModalForm>
  );
}
