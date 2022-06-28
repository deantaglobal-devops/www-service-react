import React, { useEffect, useState } from "react";
import moment from "moment";
import ModalForm from "../../../../components/ModalForm/modalForm";
import Modal from "../../../../components/Modal/modal";
import DatePicker from "../../../../components/datePicker/datePicker";

import "./styles/reschedulesDates.styles.css";

export default function RescheduleDates({
  openRescheduleModal,
  handleOnCloseRescheduleModal,
  projectId,
  chapterId,
  setIsLoading,
  projectStartDate,
  projectEndDate,
  companyId,
  showFailToast,
}) {
  const [rescheduleData, setRescheduleData] = useState([]);
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [bodyModal, setbodyModal] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [reschedulePreviewParameters, setReschedulePreviewParameters] =
    useState({});
  const [removeRescheduleElem, setRemoveRescheduleElem] = useState(null);

  useEffect(() => {
    getRescheduleData();
  }, []);

  useEffect(() => {
    if (warningMessage !== "") {
      setOpenErrorModal(true);
    }
  }, [warningMessage]);

  const getRescheduleData = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("projectId", projectId);
    if (chapterId === undefined) {
      formData.append("chapterId", 0);
    } else {
      formData.append("chapterId", chapterId);
    }

    await fetch("/call/milestone/reshedule/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: formData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // return result;
          setRescheduleData(result);
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );
    setIsLoading(false);
  };

  const handleOnChangeDate = (
    e,
    milestoneId,
    columnName,
    tatColumn,
    templateId,
  ) => {
    if (e) {
      e?.preventDefault();

      let rescheduleMilestoneUpdated = {};
      if (columnName == "milestone_startdate") {
        rescheduleMilestoneUpdated = rescheduleData?.milestones?.map(
          (milestone) => {
            if (milestoneId == milestone.id) {
              return { ...milestone, milestoneStart: e.target.value };
            }
            return milestone;
          },
        );
      }

      setRescheduleData({
        ...rescheduleData,
        milestones: rescheduleMilestoneUpdated,
      });

      // Modal
      setbodyModal(`Are you sure you want to reschedule date using (${moment(
        e.target.value,
      ).format("DD/MM/YYYY")})?
                    Please note, you have to press the "Reschedule" button at the bottom of the next screen after pressing the "Continue" button below.`);

      setReschedulePreviewParameters({
        milestoneId,
        columnName,
        tatColumn,
        templateId,
        editVal: e.target.value,
      });
      setOpenModalConfirmation(true);
    }
  };

  const reschedulepreview = async () => {
    const formData = new FormData();
    formData.append("projectId", projectId);
    setOpenModalConfirmation(false);
    setIsLoading(true);
    if (chapterId === undefined) {
      formData.append("chapterId", 0);
    } else {
      formData.append("chapterId", chapterId);
    }

    formData.append("milestoneId", reschedulePreviewParameters?.milestoneId);
    formData.append("columnName", reschedulePreviewParameters?.columnName);
    formData.append("editVal", reschedulePreviewParameters?.editVal);
    formData.append("tatColumn", reschedulePreviewParameters?.tatColumn);
    formData.append("templateId", reschedulePreviewParameters?.templateId);
    formData.append("companyId", companyId);

    await fetch("/call/milestone/reshedule/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: formData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoading(false);
          if (result.status !== "ERROR") {
            setRescheduleData({
              ...rescheduleData,
              milestones: result.milestones,
            });
          } else {
            setWarningMessage(result.message);
          }
        },
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
        },
      );

    closeModals();
  };

  const closeModals = () => {
    setOpenModalConfirmation(false);
  };

  const rescheduleStop = (index) => {
    setRemoveRescheduleElem(index);
  };

  const resheduleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("projectId", projectId);

    if (chapterId === undefined) {
      formData.append("chapterId", 0);
    } else {
      formData.append("chapterId", chapterId);
    }

    rescheduleData.milestones.map((milestone, index) => {
      formData.append(`resheduleArray[${index}][id]`, milestone.id);
      formData.append(
        `resheduleArray[${index}][startdate]`,
        milestone.final_startDate,
      );
      formData.append(
        `resheduleArray[${index}][enddate]`,
        milestone.final_endDate,
      );

      milestone.tasks.map((task, indexTask) => {
        formData.append(
          `resheduleArray[${index}][tasks][${indexTask}][taskId]`,
          task.taskId,
        );
        formData.append(
          `resheduleArray[${index}][tasks][${indexTask}][taskStartDate]`,
          task.final_taskstartDate,
        );
        formData.append(
          `resheduleArray[${index}][tasks][${indexTask}][taskEndDate]`,
          task.final_taskendDate,
        );
      });
    });

    await fetch("/call/milestone/reshedule/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: formData,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          // return result;
          location.reload();
        },
        (error) => {
          // Todo: How are we going to show the errors
          // console.log(error);
          showFailToast({
            statusText: "The request could not be fulfilled.",
          });
        },
      );
    handleOnCloseRescheduleModal(e);
  };

  return (
    <>
      {openModalConfirmation && (
        <Modal
          displayModal={openModalConfirmation}
          closeModal={closeModals}
          title="Confirmation"
          body={bodyModal}
          button1Text="Cancel"
          handleButton1Modal={() => closeModals()}
          Button2Text="Confirm"
          handleButton2Modal={() => reschedulepreview()}
        />
      )}

      {openErrorModal && (
        <div
          className="deanta-modal"
          id="deanta-modal-error"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="ModalLabel"
          aria-hidden="true"
        >
          <div className="deanta-modal-dialog" role="document">
            <div className="deanta-modal-content">
              <div className="deanta-modal-header">
                <h5 className="deanta-modal-title" id="ModalLabel">
                  {" "}
                  Warning Message
                </h5>
                <button
                  onClick={() => setOpenErrorModal(false)}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons">close</i>
                </button>
              </div>
              <div className="deanta-modal-body">{warningMessage}</div>
            </div>
          </div>
        </div>
      )}

      {rescheduleData?.milestones?.length > 0 && (
        <ModalForm show={openRescheduleModal}>
          <div className="general-forms" id="reschedule-dates">
            <div className="modal-header">
              <h5 className="modal-title">Reschedule dates of the project</h5>
              <button
                type="button"
                className="close"
                onClick={(e) => handleOnCloseRescheduleModal(e)}
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="modal-body" id="reschedule-Details">
              <table className="table table-striped table-borderless table-oversize">
                <thead>
                  <tr>
                    <th>Milestones</th>
                    <th>Current Start Date</th>
                    <th>Current Due Date</th>
                    <th>New Start Date</th>
                    <th>New Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rescheduleData?.milestones?.map((milestone, index) => {
                    return (
                      <React.Fragment key={milestone.id}>
                        {(index <= removeRescheduleElem ||
                          removeRescheduleElem == null) && (
                          <>
                            <tr
                              className="resheduleMilestone"
                              id={milestone.id}
                            >
                              <td className="m-title-col">
                                <strong>{milestone.milestoneTitle}</strong>
                              </td>
                              <td className="ws">
                                <div className="content-datepicker">
                                  <DatePicker
                                    type="date"
                                    name="taskStart"
                                    id={`reshedulestartdate-${milestone.id}`}
                                    defaultValue={
                                      milestone.id ==
                                        rescheduleData.milestoneId &&
                                      rescheduleData.tatColumn ===
                                        "tat_startDate"
                                        ? rescheduleData.editDate
                                        : milestone.milestoneStart
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    }
                                    getSelectedDate={(e) =>
                                      handleOnChangeDate(
                                        e,
                                        milestone.id,
                                        "milestone_startdate",
                                        "tat_startDate",
                                        milestone.templateId,
                                      )
                                    }
                                    min={moment(projectStartDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                    max={moment(projectEndDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                  />
                                </div>
                              </td>
                              <td className="ws">
                                <div className="content-datepicker">
                                  <DatePicker
                                    type="date"
                                    name="taskStart"
                                    id={`reshedulestartend-${milestone.id}`}
                                    defaultValue={
                                      milestone.id ==
                                        rescheduleData?.milestoneId &&
                                      rescheduleData?.tatColumn == "tat_endDate"
                                        ? rescheduleData?.editDate
                                        : milestone.milestoneEnd
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    }
                                    getSelectedDate={(e) =>
                                      handleOnChangeDate(
                                        e,
                                        milestone.id,
                                        "milestone_duedate",
                                        "tat_endDate",
                                        milestone.templateId,
                                      )
                                    }
                                    min={moment(projectStartDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                    max={moment(projectEndDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                    disabled
                                  />
                                </div>
                              </td>
                              <td className="ws">
                                <div className="content-datepicker">
                                  {milestone.final_startDate != 0 ? (
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      id={`chg-startdate-${milestone.id}`}
                                      value={milestone.final_startDate.replace(
                                        /\-/g,
                                        "/",
                                      )}
                                      readOnly
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      placeholder="00/00/0000"
                                      readOnly
                                    />
                                  )}
                                  <i className="material-icons-outlined">
                                    calendar_today
                                  </i>
                                </div>
                              </td>
                              <td className="ws">
                                <div className="content-datepicker">
                                  {milestone.final_endDate != 0 ? (
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      id={`chg-enddate-${milestone.id}`}
                                      value={milestone.final_endDate.replace(
                                        /\-/g,
                                        "/",
                                      )}
                                      readOnly
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      placeholder="00/00/0000"
                                      readOnly
                                    />
                                  )}
                                  <i className="material-icons-outlined">
                                    calendar_today
                                  </i>
                                </div>
                              </td>
                            </tr>

                            {milestone?.tasks?.map((task) => (
                              <tr
                                className={`taskRow reshedule-${milestone.id}`}
                                id={task.taskId}
                                key={task.taskId}
                              >
                                <td className="m-title-col">{task.taskName}</td>
                                <td className="ws">
                                  <div className="content-datepicker">
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      id={`resh-startDate-${task.taskId}`}
                                      value={task.taskStart.replace(/\-/g, "/")}
                                      readOnly
                                    />
                                    <i className="material-icons-outlined">
                                      calendar_today
                                    </i>
                                  </div>
                                </td>
                                <td className="ws">
                                  <div className="content-datepicker">
                                    <input
                                      type="text"
                                      className="form-control off datepicker"
                                      id={`resh-endDate-${task.taskId}`}
                                      value={task.taskEnd.replace(/\-/g, "/")}
                                      readOnly
                                    />
                                    <i className="material-icons-outlined">
                                      calendar_today
                                    </i>
                                  </div>
                                </td>
                                <td className="ws">
                                  <div className="content-datepicker">
                                    {task.final_taskstartDate != 0 ? (
                                      <input
                                        type="text"
                                        className="form-control off datepicker"
                                        id={`chg-taskstart-${task.taskId}`}
                                        value={task.final_taskstartDate.replace(
                                          /\-/g,
                                          "/",
                                        )}
                                        readOnly
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="form-control off datepicker"
                                        placeholder="00/00/0000"
                                        readOnly
                                      />
                                    )}
                                    <i className="material-icons-outlined">
                                      calendar_today
                                    </i>
                                  </div>
                                </td>
                                <td className="ws">
                                  <div className="content-datepicker">
                                    {task.final_taskendDate != 0 ? (
                                      <input
                                        type="text"
                                        className="form-control off datepicker"
                                        id={`chg-taskend-${task.taskId}`}
                                        value={task.final_taskendDate.replace(
                                          /\-/g,
                                          "/",
                                        )}
                                        readOnly
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        className="form-control off datepicker"
                                        placeholder="00/00/0000"
                                        readOnly
                                      />
                                    )}
                                    <i className="material-icons-outlined">
                                      calendar_today
                                    </i>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="5" className="align-right">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary stop-changing-dates"
                                  id={`stop-changing-${milestone.id}`}
                                  onClick={() => rescheduleStop(index)}
                                >
                                  Stop changes here
                                </button>
                              </td>
                            </tr>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer cta-right">
              <button
                type="button"
                className="btn btn-outline-primary"
                data-dismiss="modal"
                onClick={(e) => handleOnCloseRescheduleModal(e)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={(e) => resheduleSubmit(e)}
              >
                Reschedule
              </button>
            </div>
          </div>
        </ModalForm>
      )}
    </>
  );
}
