import React, { useEffect, useState } from "react";

import moment from "moment";
import { useForm } from "react-hook-form";

// Components
import ModalForm from "../../../../components/ModalForm/modalForm";
import Modal from "../../../../components/Modal/modal";

import { api } from "../../../../services/api";
import "./styles/reschedulesDates.styles.css";

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
  const [tasksChange, setTasksChange] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, watch, handleSubmit, setValue } = useForm();

  const [modalConfirmation, setModalConfirm] = useState(false);
  const [modalLaterDate, setModalLaterDate] = useState(false);
  const [modalChangeDetected, setModalChangeDetected] = useState(false);

  useEffect(() => {
    getRescheduleData();
  }, [projectId]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const milestoneId = name
        .slice(0, name.indexOf(".tasks."))
        .replace("milestone.", "");

      if (watch(name) > value?.milestone[milestoneId]?.endDate) {
        setValue(`milestone[${milestoneId}].endDate`, watch(name));
      }

      if (
        watch(name) >
        projectEndDate.split("/").reverse().join("/").replace(/\//, "-")
      ) {
        setModalLaterDate(true);
      }

      setTasksChange((oldArray) => [...oldArray, name]);
    });
    console.log(tasksChange, loading);
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

    api
      .post("/milestone/reshedule/submit", {
        chapterId: chapterId === undefined ? 0 : chapterId,
        projectId,
        resheduleArray: data.milestone,
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
                              item.includes(`milestone.${id}.endDate`) ||
                              item.includes(`milestone.${id}.startDate`) ||
                              item.includes(`milestone[${id}]`),
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
                            name={`milestone[${id}]id`}
                            {...register(`milestone.${id}.id`)}
                          />
                          <input
                            type="date"
                            className={`datepicker-hover ${
                              tasksChange.filter((item) =>
                                item.includes(`milestone.${id}.startDate`),
                              ).length > 0
                                ? "changed-task"
                                : ""
                            }`}
                            name={`milestone[${id}]startDate`}
                            defaultValue={milestone.milestoneStart
                              .split("-")
                              .reverse()
                              .join("-")}
                            min={moment(projectStartDate).format("YYYY-DD-MM")}
                            {...register(`milestone.${id}.startDate`)}
                          />
                        </p>
                        <p className="w-15">
                          <input
                            type="date"
                            className={`datepicker-hover ${
                              tasksChange.filter(
                                (item) =>
                                  item.includes(`milestone.${id}.endDate`) ||
                                  item.includes(`milestone[${id}]`),
                              ).length > 0
                                ? "changed-task"
                                : ""
                            }`}
                            name={`milestone[${id}]endDate`}
                            min={moment(projectStartDate).format("YYYY-DD-MM")}
                            defaultValue={milestone.milestoneEnd
                              .split("-")
                              .reverse()
                              .join("-")}
                            {...register(`milestone.${id}.endDate`)}
                          />
                        </p>
                      </div>

                      {milestone.tasks.map((task, index) => (
                        <div
                          className={`flex dir-row flex-list ${
                            tasksChange.filter(
                              (item) =>
                                item.includes(
                                  `milestone.${id}.tasks.${index}.taskEndDate`,
                                ) ||
                                item.includes(
                                  `milestone.${id}.tasks.${index}.taskStartDate`,
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
                              name={`milestone[${id}]tasks[${index}]taskId`}
                              {...register(
                                `milestone.${id}.tasks.${index}.taskId`,
                              )}
                            />
                            <input
                              type="date"
                              className={`datepicker-hover ${
                                tasksChange.filter((item) =>
                                  item.includes(
                                    `milestone.${id}.tasks.${index}.taskStartDate`,
                                  ),
                                ).length > 0
                                  ? "changed-task"
                                  : ""
                              }`}
                              name={`milestone[${id}]tasks[${index}]taskStartDate`}
                              min={moment(projectStartDate).format(
                                "YYYY-DD-MM",
                              )}
                              defaultValue={task.taskStart
                                .split("-")
                                .reverse()
                                .join("-")}
                              {...register(
                                `milestone.${id}.tasks.${index}.taskStartDate`,
                              )}
                            />
                          </p>
                          <p className="w-15">
                            <input
                              type="date"
                              className={`datepicker-hover ${
                                tasksChange.filter((item) =>
                                  item.includes(
                                    `milestone.${id}.tasks.${index}.taskEndDate`,
                                  ),
                                ).length > 0
                                  ? "changed-task"
                                  : ""
                              }`}
                              name={`milestone[${id}]tasks[${index}]taskEndDate`}
                              min={moment(projectStartDate).format(
                                "YYYY-DD-MM",
                              )}
                              defaultValue={task.taskEnd
                                .split("-")
                                .reverse()
                                .join("-")}
                              {...register(
                                `milestone.${id}.tasks.${index}.taskEndDate`,
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
