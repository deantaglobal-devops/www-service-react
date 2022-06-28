import { useState } from "react";
import { api } from "../../../../services/api";
import ModalForm from "../../../../components/ModalForm/modalForm";

export default function ChecklistModal({
  openChecklistModal,
  handleOnCloseChecklistModal,
  checklistValue,
  setProjectData,
  projectData,
  projectId,
  chapterId,
}) {
  const [checklistData, setChecklistData] = useState(checklistValue);
  const [isEditable, setIsEditable] = useState({ id: 0, editable: false });
  const [isAddNew, setIsAddNew] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [addNewChecklistData, setAddNewChecklistData] = useState({
    content: "",
    taskId: [],
  });

  const handleOnClickEdit = (e, id) => {
    e.preventDefault();
    setIsEditable({ id, editable: true });
  };

  const handleOnChange = (e, id) => {
    if (e) {
      e.preventDefault();

      const updatedValues = checklistData?.map((si) => {
        if (si.checklist_id === id) {
          return {
            ...si,
            [e.target.name]: e.target.value,
          };
        }
        return si;
      });

      setChecklistData(updatedValues);
    }
  };

  const handleSaveSi = async (e, id) => {
    e.preventDefault();

    const valueUpdated = checklistData?.filter((si) => si.checklist_id === id);

    const newChecklistData = checklistData.map((si) => {
      if (si.checklist_id === id) {
        return valueUpdated[0];
      }
      return si;
    });

    await api
      .post(`/checklist/${valueUpdated[0].checklist_id}/update`, {
        content:
          valueUpdated[0].checklist_name === "" &&
          valueUpdated[0].checklist_name_neg === ""
            ? ""
            : valueUpdated[0].checklist_name !== ""
            ? valueUpdated[0].checklist_name
            : valueUpdated[0].checklist_name_neg,
      })
      .then(() => {
        setProjectData({
          ...projectData,
          checklist: newChecklistData,
        });
        setChecklistData(newChecklistData);
      })
      .catch((err) => console.log(err));

    setIsEditable({ id: 0, editable: false });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();

    await api
      .get(`checklist/${id}/delete`)
      .then(() => {
        const valueUpdated = checklistData.filter(
          (si) => si.checklist_id !== id,
        );

        setProjectData({ ...projectData, checklist: valueUpdated });
        setChecklistData(valueUpdated);
      })
      .catch((err) => console.log(err));

    setIsEditable({ id: 0, editable: false });
  };

  const handleAddNew = async (e) => {
    e.preventDefault();

    const milestonesResponse = await api
      .get(`/project/${projectId}/explain`)
      .then((response) => {
        if (response.data.milestones) {
          return response.data.milestones;
        }
        if (response.data.articles) {
          const filteredMilestoneList = [];

          response.data.articles.forEach((article) => {
            if (article.articleId == chapterId) {
              filteredMilestoneList.push(article.milestones);
            }
          });

          return filteredMilestoneList;
        }

        return response.data;
      })
      .catch((err) => console.log(err));

    setMilestones(milestonesResponse);
    setIsAddNew(true);
  };

  const handleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownActive(!isDropdownActive);
  };

  const handleOnChangeAddNew = (e) => {
    const taskIdValues = addNewChecklistData.taskId;
    if (e.target.name === "taskId") {
      const index = taskIdValues.indexOf(e.target.value);
      if (index < 0) {
        taskIdValues.push(e.target.value);
      } else {
        taskIdValues.splice(index, 1);
      }
    }

    setAddNewChecklistData({
      ...addNewChecklistData,
      [e.target.name]:
        e.target.name === "taskId" ? taskIdValues : e.target.value,
    });
  };

  const acceptChecklistOptions = () => {
    // close drodown menu - special instructions
    const theSelectCont = document.querySelector(".content-select.active");
    theSelectCont.classList.remove("active");
    const theSelectElem = document.querySelector(".content-select-options");
    theSelectElem.style = "display: none;"; // the options
  };

  const handleSaveNewChecklist = async (e) => {
    e.preventDefault();

    await api
      .post("/checklist/add", {
        projectId,
        taskId: addNewChecklistData.taskId.join(","),
        content: addNewChecklistData.content,
        isChecklist: true,
        chapterId: chapterId !== undefined ? chapterId : "0",
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => console.log(err));

    setIsAddNew(false);
    setAddNewChecklistData({ content: "", taskId: [] });
  };

  return (
    <ModalForm show={openChecklistModal}>
      <div className="general-forms" id="edit-special-instructions">
        <div className="modal-header">
          <h5 className="modal-title">Checklist</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={(e) => handleOnCloseChecklistModal(e)}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-body">
          {checklistData?.map((ch) => {
            return (
              <div
                className={
                  isEditable.editable && isEditable.id === ch.checklist_id
                    ? "si-item-box"
                    : "si-item-box off"
                }
                id={ch.checklist_id}
                key={ch.checklist_id}
              >
                <h3>
                  {ch.milestone_title} — {ch.task_name}
                </h3>
                {ch?.checklist_name ? (
                  <>
                    <div className="content-text">{ch.checklist_name}</div>
                    <textarea
                      name="checklist_name"
                      disabled={
                        !(
                          isEditable.editable &&
                          isEditable.id === ch.checklist_id
                        )
                      }
                      value={ch.checklist_name}
                      onChange={(e) => handleOnChange(e, ch.checklist_id)}
                    />
                  </>
                ) : (
                  <>
                    <div className="content-text">{ch.checklist_name_neg}</div>
                    <textarea
                      name="checklist_name_neg"
                      value={ch.checklist_name_neg}
                      onChange={(e) => handleOnChange(e, ch.checklist_id)}
                      disabled={
                        !(
                          isEditable.editable &&
                          isEditable.id === ch.checklist_id
                        )
                      }
                    />
                  </>
                )}
                <div className="si-interactions">
                  <div
                    className={
                      isEditable.editable && isEditable.id === ch.checklist_id
                        ? "df-options off"
                        : "df-options"
                    }
                  >
                    <a
                      href="#"
                      className="delete-si delete-icon special-instructions-button"
                      onClick={(e) => handleDelete(e, ch.checklist_id)}
                    >
                      <i className="material-icons-outlined">delete</i>
                    </a>
                    <a
                      href="#"
                      className="edit-si special-instructions-button"
                      onClick={(e) => handleOnClickEdit(e, ch.checklist_id)}
                    >
                      <i className="material-icons-outlined">edit</i>
                    </a>
                  </div>
                  <div
                    className={
                      isEditable.editable && isEditable.id === ch.checklist_id
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
                      onClick={(e) => handleSaveSi(e, ch.checklist_id)}
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
                        onClick={() => acceptChecklistOptions()}
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
                                        addNewChecklistData?.taskId?.indexOf(
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
                        setAddNewChecklistData({
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
                      onClick={(e) => handleSaveNewChecklist(e)}
                    >
                      <i className="material-icons-outlined">save</i>
                    </a>
                  </div>
                </div>
                <div className="content-text" />
                <textarea
                  name="content"
                  value={addNewChecklistData.content}
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
            onClick={(e) => handleOnCloseChecklistModal(e)}
          >
            Close Checklist
          </button>
        </div>
      </div>
    </ModalForm>
  );
}
