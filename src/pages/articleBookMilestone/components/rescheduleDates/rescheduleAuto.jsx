import { useEffect, useRef, useState } from "react";

import moment from "moment";
import { useForm } from "react-hook-form";

// Components
import ModalForm from "../../../../components/ModalForm/modalForm";
import Modal from "../../../../components/Modal/modal";

import { api } from "../../../../services/api";
import "./styles/reschedulesDates.styles.css";
import { Tooltip } from "../../../../components/tooltip/tooltip";

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
  const [loading, setLoading] = useState(false);
  const { register, watch, handleSubmit, setValue, getValues } = useForm();

  const [modalConfirmation, setModalConfirm] = useState(false);
  const [modalLaterDate, setModalLaterDate] = useState(false);
  const [modalChangeDetected, setModalChangeDetected] = useState(false);

  const setDifDay = (e) => {
    const ids = e.target.id.split(".");
    let newDateStart = "";
    let newDateEnd = "";
    let newDateEndCurrent = "";
    const differentDays =
      moment(e.target.value, "YYYY-MM-DD").diff(
        moment(prevName.current, "YYYY-MM-DD"),
      ) / 8.64e7;

    if (
      differentDays &&
      differentDays !== 0 &&
      prevName.current &&
      prevName.current !== e.target.value
    ) {
      for (
        let indexMilestone = +ids[0];
        indexMilestone < datesOld.length - 1;
        indexMilestone++
      ) {
        const element = datesOld[indexMilestone + 1];
        const startDay = element.startDate;
        const endDay = element.endDate;
        const endDayCurrent = datesOld[indexMilestone].endDate;

        if (differentDays < 0) {
          newDateStart = moment(startDay, "YYYY-MM-DD")
            .subtract(Math.abs(differentDays), "d")
            .format("YYYY-MM-DD");

          newDateEnd = moment(endDay, "YYYY-MM-DD")
            .subtract(Math.abs(differentDays), "d")
            .format("YYYY-MM-DD");

          newDateEndCurrent = moment(endDayCurrent, "YYYY-MM-DD")
            .subtract(Math.abs(differentDays), "d")
            .format("YYYY-MM-DD");
        } else {
          newDateStart = moment(startDay, "YYYY-MM-DD")
            .add(differentDays, "d")
            .format("YYYY-MM-DD");

          newDateEnd = moment(endDay, "YYYY-MM-DD")
            .add(differentDays, "d")
            .format("YYYY-MM-DD");

          newDateEndCurrent = moment(endDayCurrent, "YYYY-MM-DD")
            .add(differentDays, "d")
            .format("YYYY-MM-DD");
        }

        if (e.target.name.includes("startDate")) {
          setValue(`milestones[${indexMilestone}].endDate`, newDateEndCurrent);
        }

        setValue(`milestones[${indexMilestone + 1}].endDate`, newDateEnd);
        setValue(`milestones[${indexMilestone + 1}].startDate`, newDateStart);

        let index = 0;
        let { length } = datesOld[indexMilestone].tasks;
        if (ids[1]) {
          index = +ids[1];
          length = datesOld[indexMilestone].tasks.length - 1;
        }
        for (let indexTask = index; indexTask < length; indexTask++) {
          let newDateTaskStart = "";
          let newDateTaskEnd = "";
          let newDateTaskEndCurrent = "";
          const element = ids[1]
            ? datesOld[indexMilestone].tasks[indexTask + 1]
            : datesOld[indexMilestone].tasks[indexTask];
          const iniDateTaskStart = element.taskStartDate;
          const iniDateTaskEnd = element.taskEndDate;
          const currentDateTaskEnd =
            datesOld[indexMilestone].tasks[indexTask].taskEndDate;

          if (differentDays < 0) {
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD")
              .subtract(Math.abs(differentDays), "d")
              .format("YYYY-MM-DD");
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD")
              .subtract(Math.abs(differentDays), "d")
              .format("YYYY-MM-DD");
            newDateTaskEndCurrent = moment(currentDateTaskEnd, "YYYY-MM-DD")
              .subtract(Math.abs(differentDays), "d")
              .format("YYYY-MM-DD");
          } else {
            newDateTaskStart = moment(iniDateTaskStart, "YYYY-MM-DD")
              .add(differentDays, "d")
              .format("YYYY-MM-DD");
            newDateTaskEnd = moment(iniDateTaskEnd, "YYYY-MM-DD")
              .add(differentDays, "d")
              .format("YYYY-MM-DD");
            newDateTaskEndCurrent = moment(currentDateTaskEnd, "YYYY-MM-DD")
              .add(differentDays, "d")
              .format("YYYY-MM-DD");
          }
          if (ids[1]) {
            if (e.target.name.includes("taskStartDate")) {
              setValue(
                `milestones[${indexMilestone}].tasks.${indexTask}.taskEndDate`,
                newDateTaskEndCurrent,
              );
            }
            setValue(
              `milestones[${indexMilestone}].tasks.${
                indexTask + 1
              }.taskEndDate`,
              newDateTaskEnd,
            );
            setValue(
              `milestones[${indexMilestone}].tasks.${
                indexTask + 1
              }.taskStartDate`,
              newDateTaskStart,
            );
          } else {
            setValue(
              `milestones[${indexMilestone}].tasks.${indexTask}.taskEndDate`,
              newDateTaskEnd,
            );
            setValue(
              `milestones[${indexMilestone}].tasks.${indexTask}.taskStartDate`,
              newDateTaskStart,
            );
          }
        }
      }
    }
  };

  const prevDate = (e) => {
    prevName.current = e.target.value;
  };

  useEffect(() => {
    setDatesOld(getValues().milestones);
  }, [rescheduleData]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        watch(name) >
        projectEndDate.split("/").reverse().join("/").replace(/\//, "-")
      ) {
        setModalLaterDate(true);
      }
      setTasksChange((oldArray) => [...oldArray, name]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getRescheduleData = async () => {
    setIsLoading(true);

    await api
      .post("/milestone/reshedule/view", {
        chapterId: chapterId === undefined ? 0 : chapterId,
        projectId,
      })
      .then((result) => {
        setRescheduleData(result.data);
        setDatesOld(getValues().milestones);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resheduleSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    api
      .post("/milestone/reshedule/submit", {
        chapterId: chapterId === undefined ? 0 : chapterId,
        projectId,
        resheduleArray: data.milestones,
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
        setLoading(false);
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
          loading={loading}
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
                  tasksChange.length > 0
                    ? setModalChangeDetected(true)
                    : handleOnCloseRescheduleModal(e);
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
                  {rescheduleData?.milestones?.map((milestone, id) => (
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
                            min={moment(projectStartDate).format("YYYY-DD-MM")}
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
                            min={moment(projectStartDate).format("YYYY-DD-MM")}
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
                          <p className="w-40 space-first">{task.taskName}</p>
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
                              min={moment(projectStartDate).format(
                                "YYYY-DD-MM",
                              )}
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
                              min={moment(projectStartDate).format(
                                "YYYY-DD-MM",
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
                  tasksChange.length > 0
                    ? setModalChangeDetected(true)
                    : handleOnCloseRescheduleModal(e);
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
