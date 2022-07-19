import { useEffect, useRef, useState } from "react";

import "./styles/reschedulesDates.styles.css";

import moment from "moment";
import { useForm } from "react-hook-form";

// Components
import ModalForm from "../../../../components/ModalForm/modalForm";
import Modal from "../../../../components/Modal/modal";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import { api } from "../../../../services/api";

export default function RescheduleManual({
  openModal,
  handleOnCloseRescheduleModal,
  projectId,
  chapterId,
  setIsLoading,
  projectStartDate,
  projectEndDate,
  showFailToast,
}) {
  const [rescheduleData, setRescheduleData] = useState([]);
  const [datesOld, setDatesOld] = useState([]);
  const [tasksChange, setTasksChange] = useState([]);
  const prevName = useRef("");
  const [loading, setLoading] = useState("loading");
  const { register, watch, handleSubmit, setValue, getValues } = useForm();

  const [modalConfirmation, setModalConfirm] = useState(false);
  const [modalLaterDate, setModalLaterDate] = useState(false);
  const [modalChangeDetected, setModalChangeDetected] = useState(false);
  const [stopHere, setStopHere] = useState(0);

  const setDifDay = (e) => {
    const ids = e.target.id.split(".");
    let newDateStart = "";
    let newDateEnd = "";
    let newDateEndCurrent = "";
    const differentDays =
      moment(e.target.value).diff(moment(prevName.current), "days") || 0;

    if (
      differentDays &&
      differentDays !== 0 &&
      prevName.current &&
      prevName.current !== e.target.value &&
      Math.abs(differentDays) < 10000
    ) {
      // Rescheduling in cascade starting in middle of task
      if (ids[1] && datesOld[+ids[0]]) {
        for (
          let indexTask = +ids[1];
          indexTask < datesOld[+ids[0]].tasks.length - 1;
          indexTask += 1
        ) {
          let newDateTaskStart = "";
          let newDateTaskEnd = "";
          let newDateTaskEndCurrent = "";

          const element = datesOld[+ids[0]].tasks[indexTask + 1];
          const iniDateTaskStart = element?.taskStartDate;
          const iniDateTaskEnd = element?.taskEndDate;
          const currentDateTaskEnd =
            datesOld[+ids[0]].tasks[indexTask + 1].taskEndDate;

          if (differentDays < 0) {
            let daysStart = differentDays;
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD");
            while (daysStart < 0) {
              newDateTaskStart = newDateTaskStart.subtract(1, "d");
              if (
                moment(newDateTaskStart).isoWeekday() !== 6 &&
                moment(newDateTaskStart).isoWeekday() !== 7
              ) {
                daysStart += 1;
              }
            }

            let daysEnd = differentDays;
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD");
            while (daysEnd < 0) {
              newDateTaskEnd = newDateTaskEnd.subtract(1, "d");
              if (
                moment(newDateTaskEnd).isoWeekday() !== 6 &&
                moment(newDateTaskEnd).isoWeekday() !== 7
              ) {
                daysEnd += 1;
              }
            }

            let daysEndCurrent = differentDays;
            newDateTaskEndCurrent = moment(currentDateTaskEnd, "YYYY-MM-DD");
            while (daysEndCurrent < 0) {
              newDateTaskEndCurrent = newDateTaskEndCurrent.subtract(1, "d");
              if (
                moment(newDateTaskEndCurrent).isoWeekday() !== 6 &&
                moment(newDateTaskEndCurrent).isoWeekday() !== 7
              ) {
                daysEndCurrent += 1;
              }
            }
          } else {
            let daysStart = differentDays;
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD");
            while (daysStart > 0) {
              newDateTaskStart = newDateTaskStart.add(1, "d");
              if (
                moment(newDateTaskStart).isoWeekday() !== 6 &&
                moment(newDateTaskStart).isoWeekday() !== 7
              ) {
                daysStart -= 1;
              }
            }

            let daysEnd = differentDays;
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD");
            while (daysEnd > 0) {
              newDateTaskEnd = newDateTaskEnd.add(1, "d");
              if (
                moment(newDateTaskEnd).isoWeekday() !== 6 &&
                moment(newDateTaskEnd).isoWeekday() !== 7
              ) {
                daysEnd -= 1;
              }
            }

            let daysEndCurrent = differentDays;
            newDateTaskEndCurrent = moment(currentDateTaskEnd, "YYYY-MM-DD");
            while (daysEndCurrent > 0) {
              newDateTaskEndCurrent = newDateTaskEndCurrent.add(1, "d");
              if (
                moment(newDateTaskEndCurrent).isoWeekday() !== 6 &&
                moment(newDateTaskEndCurrent).isoWeekday() !== 7
              ) {
                daysEndCurrent -= 1;
              }
            }
          }

          setValue(
            `milestones[${+ids[0]}].tasks.${indexTask + 1}.taskEndDate`,
            newDateTaskEnd.format("YYYY-MM-DD"),
          );
          setValue(
            `milestones[${+ids[0]}].tasks.${indexTask + 1}.taskStartDate`,
            newDateTaskStart.format("YYYY-MM-DD"),
          );

          if (e.target.name.includes("taskStartDate")) {
            setValue(
              `milestones[${+ids[0]}].tasks.${indexTask}.taskEndDate`,
              newDateTaskEndCurrent.format("YYYY-MM-DD"),
            );
          }
        }
      }

      // Auto reschedule to milestones
      for (
        let indexMilestone = +ids[0];
        indexMilestone < datesOld.length - 1;
        indexMilestone += 1
      ) {
        const element = datesOld[indexMilestone + 1];
        const startDay = element?.startDate;
        const endDay = element?.endDate;
        const endDayCurrent = datesOld[indexMilestone].endDate;

        if (differentDays < 0) {
          let daysStart = differentDays;
          newDateStart = moment(startDay, "YYYY-MM-DD");
          while (daysStart < 0) {
            newDateStart = newDateStart.subtract(1, "d");
            if (
              moment(newDateStart).isoWeekday() !== 6 &&
              moment(newDateStart).isoWeekday() !== 7
            ) {
              daysStart += 1;
            }
          }

          let daysEnd = differentDays;
          newDateEnd = moment(endDay, "YYYY-MM-DD");
          while (daysEnd < 0) {
            newDateEnd = newDateEnd.subtract(1, "d");
            if (
              moment(newDateEnd).isoWeekday() !== 6 &&
              moment(newDateEnd).isoWeekday() !== 7
            ) {
              daysEnd += 1;
            }
          }

          let daysEndCurr = differentDays;
          newDateEndCurrent = moment(endDayCurrent, "YYYY-MM-DD");
          while (daysEndCurr < 0) {
            newDateEndCurrent = newDateEndCurrent.subtract(1, "d");
            if (
              moment(newDateEndCurrent).isoWeekday() !== 6 &&
              moment(newDateEndCurrent).isoWeekday() !== 7
            ) {
              daysEndCurr += 1;
            }
          }
        } else {
          let daysStart = differentDays;
          newDateStart = moment(startDay, "YYYY-MM-DD");
          while (daysStart > 0) {
            newDateStart = newDateStart.add(1, "d");

            if (
              moment(newDateStart).isoWeekday() !== 6 &&
              moment(newDateStart).isoWeekday() !== 7
            ) {
              daysStart -= 1;
            }
          }

          let daysEnd = differentDays;
          newDateEnd = moment(endDay, "YYYY-MM-DD");
          while (daysEnd > 0) {
            newDateEnd = newDateEnd.add(1, "d");
            if (
              moment(newDateEnd).isoWeekday() !== 6 &&
              moment(newDateEnd).isoWeekday() !== 7
            ) {
              daysEnd -= 1;
            }
          }

          let daysEndCurr = differentDays;
          newDateEndCurrent = moment(endDayCurrent, "YYYY-MM-DD");
          while (daysEndCurr > 0) {
            newDateEndCurrent = newDateEndCurrent.add(1, "d");
            if (
              moment(newDateEndCurrent).isoWeekday() !== 6 &&
              moment(newDateEndCurrent).isoWeekday() !== 7
            ) {
              daysEndCurr -= 1;
            }
          }
        }

        if (e.target.name.includes("startDate")) {
          setValue(
            `milestones[${indexMilestone}].endDate`,
            newDateEndCurrent.format("YYYY-MM-DD"),
          );
        }

        setValue(
          `milestones[${indexMilestone + 1}].endDate`,
          newDateEnd.format("YYYY-MM-DD"),
        );
        setValue(
          `milestones[${indexMilestone + 1}].startDate`,
          newDateStart.format("YYYY-MM-DD"),
        );

        // Auto reschedule to next tasks of milestones
        const index = !ids[1] ? indexMilestone : indexMilestone + 1;
        for (
          let indexTask = 0;
          indexTask < datesOld[index].tasks.length;
          indexTask += 1
        ) {
          let newDateTaskStart = "";
          let newDateTaskEnd = "";

          const element = datesOld[index].tasks[indexTask];
          const iniDateTaskStart = element?.taskStartDate;
          const iniDateTaskEnd = element?.taskEndDate;

          if (differentDays < 0) {
            let daysStart = differentDays;
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD");
            while (daysStart < 0) {
              newDateTaskStart = newDateTaskStart.subtract(1, "d");
              if (
                moment(newDateTaskStart).isoWeekday() !== 6 &&
                moment(newDateTaskStart).isoWeekday() !== 7
              ) {
                daysStart += 1;
              }
            }

            let daysEnd = differentDays;
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD");
            while (daysEnd < 0) {
              newDateTaskEnd = newDateTaskEnd.subtract(1, "d");
              if (
                moment(newDateTaskEnd).isoWeekday() !== 6 &&
                moment(newDateTaskEnd).isoWeekday() !== 7
              ) {
                daysEnd += 1;
              }
            }
          } else {
            let daysStart = differentDays;
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD");
            while (daysStart > 0) {
              newDateTaskStart = newDateTaskStart.add(1, "d");
              if (
                moment(newDateTaskStart).isoWeekday() !== 6 &&
                moment(newDateTaskStart).isoWeekday() !== 7
              ) {
                daysStart -= 1;
              }
            }

            let daysEnd = differentDays;
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD");
            while (daysEnd > 0) {
              newDateTaskEnd = newDateTaskEnd.add(1, "d");
              if (
                moment(newDateTaskEnd).isoWeekday() !== 6 &&
                moment(newDateTaskEnd).isoWeekday() !== 7
              ) {
                daysEnd -= 1;
              }
            }
          }

          setValue(
            `milestones[${index}].tasks.${indexTask}.taskEndDate`,
            newDateTaskEnd.format("YYYY-MM-DD"),
          );
          setValue(
            `milestones[${index}].tasks.${indexTask}.taskStartDate`,
            newDateTaskStart.format("YYYY-MM-DD"),
          );
        }
      }
    }
  };

  const prevDate = (e) => {
    prevName.current = e.target.value;
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (watch(name) > projectEndDate?.split("/").reverse().join("-")) {
        setModalLaterDate(true);
      }
      setTasksChange((oldArray) => [...oldArray, name]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getRescheduleData = async () => {
    setIsLoading(true);
    setLoading("loading");
    await api
      .post("/milestone/reshedule/view", {
        chapterId: chapterId === undefined ? 0 : chapterId,
        projectId,
      })
      .then((result) => {
        setRescheduleData(result.data);
        setDatesOld(getValues().milestones);
        setStopHere(result.data.milestones.length);
        setLoading("");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resheduleSubmit = async (data) => {
    setLoading("sending");

    api
      .post("/milestone/reshedule/submit", {
        chapterId: chapterId === undefined ? 0 : chapterId,
        projectId,
        resheduleArray: data?.milestones?.slice(0, stopHere),
      })
      .then(() => {
        handleOnCloseRescheduleModal();
        setIsLoading(true);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
        showFailToast({
          statusText: "The request could not be fulfilled.",
        });
      })
      .finally(() => {
        setLoading("");
      });
  };

  useEffect(() => {
    getRescheduleData();
  }, [projectId]);

  return (
    <>
      {modalConfirmation && (
        <Modal
          displayModal={modalConfirmation}
          closeModal={() => setModalConfirm(false)}
          title="Reschedule Dates"
          body="Please verify all New Dates are correct before proceeding."
          button1Text="Cancel"
          handleButton1Modal={() => {
            setModalConfirm(false);
            handleOnCloseRescheduleModal();
          }}
          loading={loading === "sending"}
          Button2Text="Continue"
          handleButton2Modal={handleSubmit(resheduleSubmit)}
        />
      )}

      {modalChangeDetected && (
        <Modal
          displayModal={modalChangeDetected}
          closeModal={() => setModalChangeDetected(false)}
          title="Reschedule Dates"
          body="<p>Date changes have been made.</p><p>Please verify all New Dates are correct before continuing.</p>"
          button1Text="Cancel"
          handleButton1Modal={() => {
            setModalChangeDetected(false);
            handleOnCloseRescheduleModal();
          }}
          Button2Text="Reschedule"
          handleButton2Modal={handleSubmit(resheduleSubmit)}
        />
      )}

      {modalLaterDate && (
        <Modal
          displayModal={modalLaterDate}
          closeModal={() => setModalLaterDate(false)}
          title="Warning!"
          body="This date is later than the publisher end date."
          button1Text="Dismiss"
          handleButton1Modal={() => {
            setModalLaterDate(false);
          }}
        />
      )}

      {rescheduleData?.milestones?.length > 0 && (
        <ModalForm show={openModal}>
          <div className="general-forms" id="reschedule-dates">
            <div className="modal-header">
              <h5 className="modal-title">
                Reschedule dates of the project{" "}
                <span className="tag">Auto Mode</span>
                <Tooltip
                  direction="bottom"
                  content={
                    <span>
                      Any date change will have a cascading effect. E.g., if I
                      <br />
                      add two days to the start date of the first task, two days
                      <br />
                      will be added to all dates.
                    </span>
                  }
                >
                  <i
                    className="material-icons-outlined"
                    style={{ cursor: "help", fontSize: 14 }}
                  >
                    info
                  </i>
                </Tooltip>
              </h5>

              <button
                type="button"
                className="close"
                onClick={(e) => {
                  if (tasksChange.length > 0) {
                    setModalChangeDetected(true);
                  } else {
                    handleOnCloseRescheduleModal(e);
                  }
                }}
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            <div className="modal-body" id="reschedule-Details">
              <div className="body-scrollable">
                <div className="flex dir-col">
                  <div className="flex dir-row  flex-head">
                    <h5 className="w-40">Milestones</h5>
                    <h5 className="w-15">Current Start Date</h5>
                    <h5 className="w-15">Current Due Date</h5>
                    <h5 className="w-15">New Start Date</h5>
                    <h5 className="w-15">New Due Date</h5>
                  </div>
                  {/* Collapse list */}

                  {loading !== "loading" &&
                    rescheduleData?.milestones
                      ?.slice(0, stopHere)
                      .map((milestone, id) => (
                        <div className="line-three" key={milestone.id}>
                          <div
                            className={`flex dir-row flex-subhead  ${
                              tasksChange.filter(
                                (item) =>
                                  item.includes(`milestones.${id}.endDate`) ||
                                  item.includes(`milestones.${id}.startDate`) ||
                                  item.includes(`milestones[${id}]`),
                              ).length > 0
                                ? "changed-task"
                                : ""
                            }`}
                          >
                            <p className="w-40">
                              <strong>{milestone.milestoneTitle}</strong>
                            </p>
                            <p className="w-15 ">
                              {milestone.milestoneStart
                                .replace(/-/g, "/")
                                .replace("00-00-0000", "-")}
                            </p>
                            <p className="w-15">
                              {milestone.milestoneEnd
                                .replace(/-/g, "/")
                                .replace("00-00-0000", "-")}
                            </p>
                            <p className="w-15">
                              <input
                                type="string"
                                defaultValue={milestone.id}
                                hidden
                                name={`milestones[${id}]id`}
                                {...register(`milestones.${id}.id`)}
                              />
                              <input
                                type="date"
                                className="datepicker-hover "
                                id={id}
                                name={`milestones[${id}]startDate`}
                                defaultValue={milestone.milestoneStart
                                  .split("-")
                                  .reverse()
                                  .join("-")}
                                min={moment(projectStartDate).format(
                                  "YYYY-DD-MM",
                                )}
                                onClick={(e) => {
                                  prevDate(e);
                                }}
                                {...register(`milestones.${id}.startDate`, {
                                  onChange: (e) => {
                                    setDifDay(e);
                                  },
                                })}
                              />
                            </p>
                            <p className="w-15">
                              <input
                                type="date"
                                className="datepicker-hover "
                                // ${
                                //   tasksChange.filter(
                                //     (item) =>
                                //       item.includes(`milestones.${id}.endDate`) ||
                                //       item.includes(`milestones[${id}]`),
                                //   ).length > 0
                                //     ? "changed-task"
                                //     : ""
                                // }
                                id={id}
                                name={`milestones[${id}]endDate`}
                                min={watch(`milestones.${id}.startDate`)}
                                defaultValue={milestone.milestoneEnd
                                  .split("-")
                                  .reverse()
                                  .join("-")}
                                onClick={(e) => {
                                  prevDate(e);
                                }}
                                {...register(`milestones.${id}.endDate`, {
                                  onChange: (e) => {
                                    setDifDay(e);
                                  },
                                })}
                              />
                            </p>
                          </div>

                          {milestone.tasks.map((task, index) => (
                            <div
                              className={`flex dir-row flex-list ${
                                tasksChange.filter(
                                  (item) =>
                                    item.includes(
                                      `milestones.${id}.tasks.${index}.taskEndDate`,
                                    ) ||
                                    item.includes(
                                      `milestones.${id}.tasks.${index}.taskStartDate`,
                                    ),
                                ).length > 0
                                  ? "changed-task"
                                  : ""
                              }`}
                              key={task.taskId}
                            >
                              <p className="w-40 space-first">
                                {task.taskName}
                              </p>
                              <p className="w-15">
                                {task.taskStart.replace(/-/g, "/")}
                              </p>
                              <p className="w-15">
                                {task.taskEnd.replace(/-/g, "/")}
                              </p>
                              <p className="w-15">
                                <input
                                  type="string"
                                  defaultValue={task.taskId}
                                  hidden
                                  name={`milestones[${id}]tasks[${index}]taskId`}
                                  {...register(
                                    `milestones.${id}.tasks.${index}.taskId`,
                                  )}
                                />
                                <input
                                  type="date"
                                  id={`${id}.${index}`}
                                  className="datepicker-hover"
                                  name={`milestones[${id}]tasks[${index}]taskStartDate`}
                                  defaultValue={task.taskStart
                                    .split("-")
                                    .reverse()
                                    .join("-")}
                                  onClick={(e) => {
                                    prevDate(e);
                                  }}
                                  {...register(
                                    `milestones.${id}.tasks.${index}.taskStartDate`,
                                    {
                                      onChange: (e) => {
                                        setDifDay(e);
                                      },
                                    },
                                  )}
                                />
                              </p>
                              <p className="w-15">
                                <input
                                  type="date"
                                  id={`${id}.${index}`}
                                  className="datepicker-hover"
                                  name={`milestones[${id}]tasks[${index}]taskEndDate`}
                                  min={watch(
                                    `milestones.${id}.tasks.${index}.taskStartDate`,
                                  )}
                                  defaultValue={task.taskEnd
                                    .split("-")
                                    .reverse()
                                    .join("-")}
                                  onClick={(e) => {
                                    prevDate(e);
                                  }}
                                  {...register(
                                    `milestones.${id}.tasks.${index}.taskEndDate`,
                                    {
                                      onChange: (e) => {
                                        setDifDay(e);
                                      },
                                    },
                                  )}
                                />
                              </p>
                            </div>
                          ))}
                          <div style={{ textAlign: "right", paddingTop: 20 }}>
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                setStopHere(id + 1);
                              }}
                            >
                              Stop changes here
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
            <div className="modal-footer cta-right">
              <button
                type="button"
                className="btn btn-outline-primary"
                data-dismiss="modal"
                onClick={(e) => {
                  if (tasksChange.length > 0) {
                    setModalChangeDetected(true);
                  } else {
                    handleOnCloseRescheduleModal(e);
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setModalConfirm(true)}
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
