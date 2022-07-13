import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../../../services/api";
import { Tooltip } from "../../../../components/tooltip/tooltip";
import Loading from "../../../../components/loader/Loading";
import MilestoneDetails from "../milestoneDetails/milestoneDetails";
import Modal from "../../../../components/Modal/modal";
import DatePicker from "../../../../components/datePicker/datePicker";
import RescheduleDatesChoose from "../rescheduleDates";
import SpecialInstructionsModal from "../specialInstructionsModal/specialInstructionsModal";
import ChecklistModal from "../checklistModal/checklistModal";

export default function Milestone({
  project,
  user,
  permissions,
  chapter,
  skipEproofing,
  showFailToast,
}) {
  const [milestoneIdHover, setMilestoneIdHover] = useState(0);
  const [milestoneIdSelected, setMilestoneIdSelected] = useState(0);
  const [
    communicationSelectedLocalStorage,
    setCommunicationSelectedLocalStorage,
  ] = useState({
    milestoneId: 0,
    projectId: 0,
    taskId: 0,
    taskName: "",
    projectPath: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [milestoneData, setMilestoneData] = useState([]);
  const [toggleProgressButton, setToggleProgressButton] = useState(false);
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [editMilestone, setEditMilestone] = useState(false);
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [openDeleteMilestoneModal, setOpenDeleteMilestoneModal] =
    useState(false);
  const [projectData, setProjectData] = useState(project);
  const [originalProjectMilestoneData, setOriginalProjectMilestoneData] =
    useState([]);
  const [milestoneIdToBeDeleted, setMilestoneIdToBeDeleted] = useState(0);
  const [addNewMilestone, setAddNewMilestone] = useState(false);
  const [newMilestoneData, setNewMilestoneData] = useState({});
  const [openSpecialInstructionsModal, setOpenSpecialInstructionsModal] =
    useState(false);
  const [openChecklistModal, setOpenChecklistModal] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    getUserData();
    if (
      window.localStorage.getItem("notificationItemMilestoneId") &&
      window.localStorage.getItem("notificationItemMilestoneId") !== "null"
    ) {
      const milestoneId = window.localStorage.getItem(
        "notificationItemMilestoneId",
      );
      const projectId = window.localStorage.getItem(
        "notificationItemProjectId",
      );
      const taskId = window.localStorage.getItem("notificationItemTaskId");

      const taskName = window.localStorage.getItem("notificationItemTitle");

      let taskNameTrimmed = taskName.split("(s) on ");
      taskNameTrimmed = taskNameTrimmed[taskNameTrimmed.length - 1];

      // Extracted this out as it's needed by both conditionals below.
      const projectName = document.querySelector(".page-header h2").innerHTML;
      const publisherName =
        document.querySelectorAll(".page-header h3")[0].innerHTML;

      const projectPath = `${publisherName} / ${projectName}`;

      setCommunicationSelectedLocalStorage({
        milestoneId: parseInt(milestoneId),
        projectId: parseInt(projectId),
        taskId: parseInt(taskId),
        taskName: taskNameTrimmed,
        projectPath,
      });
      toggleMilestone(parseInt(milestoneId));
    }
  }, []);

  const toggleMilestone = async (selectedMilestoneID) => {
    // event?.stopPropagation();
    setIsLoading(true);
    setMilestoneIdSelected(selectedMilestoneID);

    // let selectedMilestoneID = event.currentTarget.closest('tr').dataset.id;
    const milestoneRow = document.querySelector(
      `#milestoneRow-${selectedMilestoneID}`,
    );

    // Check if the table is in editing mode. If it's not...
    if (!milestoneRow?.closest("table")?.classList?.contains("editing")) {
      // if Milestone is already open (contains .active)

      if (milestoneRow?.classList?.contains("active")) {
        setMilestoneIdSelected(0);
        setMilestoneData([]);
      } else {
        await getMilestoneData(selectedMilestoneID);
      }
    }

    setIsLoading(false);
  };

  const getUserData = async () => {
    const { projectId } = projectData;

    // This is the for users on the overall project
    await api
      .get(`${import.meta.env.VITE_URL_API_SERVICE}/project/${projectId}/users`)
      .then((response) => {
        const resultAvatars = response.data.map((avatar) => {
          if (!avatar.avatar.includes("eu.ui-avatars.com")) {
            return {
              ...avatar,
              avatar: `${import.meta.env.VITE_URL_API_SERVICE}/file/src/?path=${
                avatar.avatar
              }`,
            };
          }
          return avatar;
        });
        setUsersData(resultAvatars);
      })
      .catch((error) => {
        // Todo: How are we going to show the errors
        console.log(error);
        return [];
      });
  };

  const getMilestoneData = async (selectedMilestoneID, _taskId) => {
    const _milestoneData = await api
      .get(
        `${
          import.meta.env.VITE_URL_API_SERVICE
        }/milestone/${selectedMilestoneID}`,
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // Todo: How are we going to show the errors
        console.log(error);
        return [];
      });

    const projectCode =
      chapter?.chapter_id !== 0 && chapter?.chapter_id !== undefined
        ? `Article Number: ${chapter?.chapterNo}`
        : `Project Code: ${projectData.bookcode}`;

    const taskPath = `${projectData.client} — ${projectCode}
     / ${projectData.title} / ${_milestoneData.milestoneTitle}`;

    let taskMemberList = "";
    if (_taskId != undefined && _taskId != 0) {
      taskMemberList = await getTaskMemberList(_taskId);
    }

    setMilestoneData([
      {
        ..._milestoneData,
        realCompanyId: user.realCompanyId,
        projectClient: projectData.client,
        companyId: projectData.companyId,
        permissions,
        taskPath,
        projectName: _milestoneData.projectName,
        milestoneId: selectedMilestoneID,
        usersData,
        taskMemberList,
      },
    ]);
  };

  const getTaskMemberList = async (_taskId) => {
    const responseData = await fetch(`/task/${_taskId}/users/get`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    return responseData;
  };

  const _handleHover = (event, id) => {
    if (milestoneIdSelected === 0) {
      if (event.type === "mouseenter") {
        setMilestoneIdHover(id);
      } else {
        setMilestoneIdHover(0);
      }
    }
  };

  const changeTaskStatus = async (_action, _taskId, _status) => {
    setIsLoading(true);
    let isCompleted = false;
    await api
      .post("/task/change/status", {
        action: _action,
        taskId: _taskId,
        status: _status,
      })
      .then((response) => {
        const { milestoneId } = response.data;
        const milestoneRow = document.getElementById(
          `milestoneRow-${milestoneId}`,
        );

        milestoneRow.classList.remove("active");

        const milestoneStatusRow = milestoneRow.querySelector(".circle-status");
        const milestoneStatusCol = milestoneRow.querySelector(".m-status-col");
        let otherTasksOpen = false;

        const milestoneDetail = document.getElementById(
          `milestoneDetails-${milestoneId}`,
        );
        const tasksArray = [
          ...milestoneDetail.querySelector(".existing-tasks-wrapper").children,
        ];

        for (let i = 0; i < tasksArray.length; i++) {
          const taskArrayId = tasksArray[i].id.replace("taskId-", "");

          const taskArrayStatusIsClosed =
            tasksArray[i].classList.contains("status-task-4");
          if (taskArrayId != _taskId && !taskArrayStatusIsClosed) {
            otherTasksOpen = true;
          }
        }

        const isMilestoneClosedAlready =
          milestoneStatusRow.classList.contains("status-1");

        // if all tasks are complete and this status was also complete then mark the milestone as completed
        if (
          _status == 4 &&
          isMilestoneClosedAlready === false &&
          otherTasksOpen === false
        ) {
          milestoneStatusRow.classList.remove();

          milestoneStatusRow.classList.add("circle-status", "status-1");
          milestoneStatusRow.setAttribute("data-original-title", "Complete");

          const today = new Date();
          const finishedText = `Finished on ${today.getDate()}-${
            today.getMonth() + 1
          }-${today.getFullYear()}`;
          milestoneStatusCol[0].innerHTML = finishedText;
        }

        const listOfOpenedTasks = tasksArray.filter((taskOrdered) => {
          let taskOrderedId = taskOrdered.id;
          taskOrderedId = taskOrderedId.replace("taskId-", "");
          return (
            taskOrdered.classList.contains("status-task-6") ||
            taskOrderedId == _taskId
          );
        });

        // mark the milestone as waiting and update the current-task column if there's at least one open task.
        if (_status == 6) {
          milestoneStatusRow.classList.remove();
          milestoneStatusRow.classList.add("circle-status", "status-4");
          milestoneStatusRow.setAttribute("data-original-title", "Waiting");

          // milestoneStatusCol.innerHTML = '';

          // change the current task column name to the first ordered and active task
          if (listOfOpenedTasks.length === 0) {
            updateCurrentTaskCol(milestoneId, _taskId);
          } else {
            let activeTaskId = listOfOpenedTasks[0].id;
            activeTaskId = activeTaskId.replace("taskId-", "");
            updateCurrentTaskCol(milestoneId, activeTaskId);
          }
        }
        isCompleted = true;
        // toggleMilestone(milestoneId);
        getMilestoneData(milestoneId);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
    if(isCompleted && _action === 'finish') {
      api.post("task/ce/level/assess", {
        taskId: _taskId,
        projectId: projectData.projectId,
        chapterId:0 
      }).then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
    }
  };

  const confirmReject = (_taskId) => {
    setTaskId(_taskId);
    selectModal();
  };

  const selectModal = () => {
    setOpenModalConfirmation(!openModalConfirmation);
  };

  function handleConfirmationButton() {
    const rejectStatus = 1;
    changeTaskStatus("reject", taskId, rejectStatus);
    selectModal();
  }

  const updateCurrentTaskCol = (milestoneId, _taskId) => {
    const firstOpenedTask = document.getElementById(`taskId-${_taskId}`);
    const firstOpenedTaskName = firstOpenedTask
      .getElementsByClassName("title-col")[0]
      .getElementsByTagName("input")[0].value;
    const milestoneRow = document.getElementById(`milestoneRow-${milestoneId}`);
    const currentTaskCol = milestoneRow.getElementsByClassName("m-task-col")[0];
    currentTaskCol.innerHTML = firstOpenedTaskName;
  };

  const handleEditMilestone = (e) => {
    e.preventDefault();
    setOriginalProjectMilestoneData(projectData.milestones);
    setEditMilestone(true);
  };

  const handleCancelEditMilestone = (e) => {
    e.preventDefault();
    setEditMilestone(false);
    setProjectData({
      ...projectData,
      milestones: originalProjectMilestoneData,
    });
  };

  const milestoneReschedule = (e) => {
    e.preventDefault();
    setOpenRescheduleModal(true);
  };

  const closeModals = (e) => {
    // e.preventDefault();
    setOpenRescheduleModal(false);
    setOpenDeleteMilestoneModal(false);
    setOpenSpecialInstructionsModal(false);
    setOpenChecklistModal(false);
  };

  const handleOnChangeDate = (e, milestoneId) => {
    if (e) {
      e?.preventDefault();

      const projectDataUpdated = projectData?.milestones?.map((milestone) => {
        if (milestoneId == milestone.id) {
          return {
            ...milestone,
            [e.target.name]: {
              value: moment(e.target.value).format("DD-MM-YYYY"),
              reschedule: milestone?.[e.target.name].reschedule,
            },
          };
        }
        return milestone;
      });

      setProjectData({ ...projectData, milestones: projectDataUpdated });
    }
  };

  const handleOnChange = (e, milestoneId) => {
    e.preventDefault();

    const projectDataUpdated = projectData?.milestones?.map((milestone) => {
      if (milestoneId == milestone.id) {
        return {
          ...milestone,
          [e.target.name]: e.target.value,
        };
      }
      return milestone;
    });

    setProjectData({ ...projectData, milestones: projectDataUpdated });
  };

  const milestoneupdateinfo = async () => {
    setIsLoading(true);

    // Get the updated milestones
    const valuesEdited = [];
    projectData.milestones.map(function (value1) {
      originalProjectMilestoneData.map(function (value2) {
        if (value1.id === value2.id) {
          const isEqual = objectsEqual(value1, value2);
          if (!isEqual) {
            valuesEdited.push(value1);
          }
        }
      });
    });

    let milestoneUpdateArray = [];

    valuesEdited.map((milestoneEdited) => {
      milestoneUpdateArray = [
        ...milestoneUpdateArray,
        {
          milestoneid: milestoneEdited.id,
          milestoneName: milestoneEdited.milestoneTitle,
          startDate: milestoneEdited.milestoneStart.value,
          endDate: milestoneEdited.milestoneEnd.value,
        },
      ];
    });

    await api
      .post("/milestone/update", {
        milestoneUpdateArray,
        projectId: projectData.projectId,
        companyId: projectData?.companyId,
        chapterId: chapter?.chapter_id > 0 ? chapter?.chapter_id : 0,
      })
      .then(() => {
        setEditMilestone(false);
      })
      .catch((err) => console.log(err));

    setIsLoading(false);
  };

  const objectsEqual = (o1, o2) =>
    typeof o1 === "object" && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
      : o1 === o2;

  const deleteMilestoneInformation = (e, milestoneId) => {
    e.preventDefault();
    setOpenDeleteMilestoneModal(true);
    setMilestoneIdToBeDeleted(milestoneId);
  };

  const confirmDeleteMilestoneModal = async () => {
    if (milestoneIdToBeDeleted > 0) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("milestoneId", milestoneIdToBeDeleted);

      await api
        .post("/milestone/delete", {
          milestoneId: milestoneIdToBeDeleted,
        })
        .then(() => {
          setEditMilestone(false);

          const newProjectData = projectData?.milestones.filter(
            (milestone) => milestone.id !== milestoneIdToBeDeleted,
          );

          setProjectData({ ...projectData, milestones: newProjectData });
        })
        .catch((err) => console.log(err));

      setIsLoading(false);
      setMilestoneIdToBeDeleted(0);
      closeModals();
    }
  };

  const handleNewMilestone = (e) => {
    if (e) {
      e.preventDefault();
      setAddNewMilestone(true);
    }
  };

  const handleOnChangeNewTask = (e) => {
    if (e) {
      setNewMilestoneData({
        ...newMilestoneData,
        [e.target.name]: e.target.value,
        orderId: projectData?.milestones?.length + 1,
        projectId: projectData?.projectId,
        companyId: projectData?.companyId,
        chapterId: chapter?.chapter_id ? chapter?.chapter_id : 0,
      });
    }
  };

  const createMilestoneInformation = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const bodyRequest = {
      projectId: newMilestoneData.projectId,
      companyId: newMilestoneData.companyId,
      chapterId: newMilestoneData.chapterId,
      milestoneName: newMilestoneData.milestoneName,
      startDate: newMilestoneData.startDate,
      endDate: newMilestoneData.endDate,
      milestoneType: newMilestoneData.milestoneType,
      milestoneComplexity: newMilestoneData.milestoneComplexity,
      orderId: newMilestoneData.orderId,
    };
    await fetch("/milestone/create", bodyRequest)
      .then(() => {
        location.reload();
      })
      .catch((err) => console.log(err));

    setAddNewMilestone(false);
    setIsLoading(false);
  };

  const handleSpecialInstructionsModal = (e) => {
    e.preventDefault();
    setOpenSpecialInstructionsModal(true);
  };

  const handleChecklistModal = (e) => {
    e.preventDefault();
    setOpenChecklistModal(true);
  };

  return (
    <div className="row mt-4">
      {isLoading && <Loading loadingText="loading..." />}
      {openModalConfirmation && (
        <Modal
          displayModal={openModalConfirmation}
          closeModal={selectModal}
          title="Confirmation"
          body='Are you sure that you would like to mark this task as "Rejected"?'
          button1Text="Cancel"
          handleButton1Modal={() => selectModal()}
          Button2Text="Confirm"
          handleButton2Modal={() => handleConfirmationButton()}
        />
      )}

      {openDeleteMilestoneModal && (
        <Modal
          displayModal={openDeleteMilestoneModal}
          closeModal={closeModals}
          title="Confirmation"
          body="Are you sure that you want to delete the Milestone?"
          button1Text="Cancel"
          handleButton1Modal={() => closeModals()}
          Button2Text="Confirm"
          handleButton2Modal={() => confirmDeleteMilestoneModal()}
        />
      )}

      {openSpecialInstructionsModal && (
        <SpecialInstructionsModal
          openSpecialInstructionsModal={openSpecialInstructionsModal}
          handleOnCloseSpecialInstructionsModal={(e) => closeModals(e)}
          specialInstructionsValue={projectData?.special_instruction}
          setProjectData={(value) => setProjectData(value)}
          projectData={projectData}
          projectId={projectData?.projectId}
          chapterId={chapter?.chapter_id}
        />
      )}

      {openChecklistModal && (
        <ChecklistModal
          openChecklistModal={openChecklistModal}
          handleOnCloseChecklistModal={(e) => closeModals(e)}
          checklistValue={projectData?.checklist}
          setProjectData={(value) => setProjectData(value)}
          projectData={projectData}
          projectId={projectData?.projectId}
          chapterId={chapter?.chapter_id}
        />
      )}

      {openRescheduleModal && (
        <RescheduleDatesChoose
          openRescheduleModal={openRescheduleModal}
          closeRescheduleModal={() => setOpenRescheduleModal(false)}
          handleOnCloseRescheduleModal={(e) => closeModals(e)}
          projectId={projectData?.projectId}
          chapterId={chapter?.chapter_id}
          setIsLoading={setIsLoading}
          projectStartDate={projectData?.startDate}
          projectEndDate={projectData?.endDate}
          companyId={projectData?.companyId}
          showFailToast={(message) => showFailToast(message)}
        />
      )}
      <div className="col-lg-12">
        {projectData?.milestones?.length > 0 &&
        !!parseInt(permissions?.milestones?.view) ? (
          <>
            <table
              className={
                editMilestone
                  ? "table table-striped table-borderless table-oversize article-list-table milestone-table editing"
                  : "table table-striped table-borderless table-oversize article-list-table milestone-table"
              }
            >
              <thead>
                <tr>
                  <th />
                  <th>Milestones</th>
                  <th>Start Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Current Task</th>
                  <th
                    className={
                      toggleProgressButton && !editMilestone
                        ? "progress-title on"
                        : "progress-title"
                    }
                  >
                    Progress
                  </th>
                  <th
                    className="show-hide-progress"
                    onClick={() =>
                      setToggleProgressButton(!toggleProgressButton)
                    }
                  >
                    <Tooltip content="Progress report" direction="left">
                      <i className="material-icons-outlined">
                        {toggleProgressButton || editMilestone
                          ? "report_off"
                          : "report"}
                      </i>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectData?.milestones.map((milestone) => {
                  return (
                    <React.Fragment key={milestone.id}>
                      {/* milestone Type Check */}
                      {((milestone.milestoneType == 2 &&
                        !!parseInt(permissions.milestones.external)) ||
                        (milestone.milestoneType == 1 &&
                          !!parseInt(permissions.milestones.internal)) ||
                        (milestone.milestoneType == 0 &&
                          !!parseInt(permissions.milestones.external) &&
                          !!parseInt(permissions.milestones.internal))) && (
                        <>
                          <tr
                            className={
                              (milestoneIdHover === milestone.id &&
                                milestoneIdSelected === 0) ||
                              (milestoneIdHover === 0 &&
                                milestoneIdSelected === 0)
                                ? "milestoneRow"
                                : milestoneIdSelected > 0 &&
                                  milestoneIdSelected === milestone.id
                                ? "milestoneRow active clicked"
                                : "milestoneRow off"
                            }
                            data-id={milestone.id}
                            data-startdate={milestone.milestoneStart.value}
                            data-enddate={milestone.milestoneEnd.value}
                            id={`milestoneRow-${milestone.id}`}
                            onMouseEnter={(event) =>
                              _handleHover(event, milestone.id)
                            }
                            onMouseLeave={(event) =>
                              _handleHover(event, milestone.id)
                            }
                            onClick={() => {
                              // to close the milestone if it's already opened
                              if (milestoneIdSelected > 0) {
                                setMilestoneIdSelected(0);
                                setMilestoneData([]);
                              } else {
                                toggleMilestone(milestone.id);
                              }
                            }}
                          >
                            {/* we need to define the status names/colors */}
                            {milestone.completionDate ? (
                              <td className="m-color-col">
                                <div
                                  className="circle-status status-1"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Complete"
                                />
                              </td>
                            ) : (
                              <td className="m-color-col">
                                <div
                                  className="circle-status status-4"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Waiting"
                                />
                              </td>
                            )}

                            <td className="m-title-col">
                              <input
                                type="text"
                                name="milestoneTitle"
                                value={milestone.milestoneTitle}
                                id={`milestoneName-${milestone.id}`}
                                disabled={!editMilestone}
                                className={editMilestone ? "" : "off"}
                                onChange={(e) =>
                                  handleOnChange(e, milestone.id)
                                }
                              />
                            </td>
                            <td className="m-start-col ws">
                              <div className="content-datepicker">
                                {editMilestone ? (
                                  <DatePicker
                                    type="date"
                                    name="milestoneStart"
                                    id={`milestonestartdate-${milestone.id}`}
                                    defaultValue={milestone.milestoneStart.value
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                    getSelectedDate={(e) =>
                                      handleOnChangeDate(e, milestone.id)
                                    }
                                    min={moment(projectData?.startDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                    max={moment(projectData?.endDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    className="form-control off datepicker"
                                    id={`milestonestartdate-${milestone.id}`}
                                    disabled
                                    value={milestone.milestoneStart.value}
                                    // onchange="milestoneEditvalue('{{ milestone.id }}')"
                                  />
                                )}
                              </div>
                              <div
                                className="is-invalid-text taskType-error hide"
                                style={{ marginTop: `${5}px` }}
                              >
                                Start date cannot be after end date
                              </div>
                            </td>
                            <td className="m-due-col ws">
                              <div className="content-datepicker">
                                {editMilestone ? (
                                  <DatePicker
                                    type="date"
                                    name="milestoneEnd"
                                    id={`milestoneenddate-${milestone.id}`}
                                    defaultValue={milestone.milestoneEnd.value
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                    getSelectedDate={(e) =>
                                      handleOnChangeDate(e, milestone.id)
                                    }
                                    min={moment(projectData?.startDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                    max={moment(projectData?.endDate).format(
                                      "YYYY-DD-MM",
                                    )}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    className="form-control off datepicker"
                                    id={`milestoneenddate-${milestone.id}`}
                                    disabled
                                    value={milestone.milestoneEnd.value}
                                    // onchange="milestoneEditvalue('{{ milestone.id }}')"
                                  />
                                )}
                              </div>
                              <div
                                className="is-invalid-text taskType-error hide"
                                style={{ marginTop: `${5}px` }}
                              >
                                Due Date cannot be blank.
                              </div>
                            </td>
                            <td className="m-status-col ws">
                              {/* We will need a mix of status and date here. This code is temporary */}
                              {milestone.completionDate ? (
                                `Finished on ${milestone.completionDate}`
                              ) : (
                                <>Waiting</>
                              )}
                            </td>
                            <td className="m-task-col">{milestone.taskName}</td>
                            <td
                              className={
                                toggleProgressButton && !editMilestone
                                  ? "m-progress-col progress-content on"
                                  : "m-progress-col progress-content"
                              }
                            >
                              <div className="project-card-details min-width">
                                <div className="progress-status">
                                  <div className="label-bar-status">
                                    <label>
                                      {milestone.percentage}% Completed
                                    </label>
                                  </div>
                                  <div className="progress progress-sm">
                                    <div
                                      className="progress-bar bg-success"
                                      role="progressbar"
                                      style={{
                                        width: `${milestone.percentage}` + "%",
                                      }}
                                      aria-valuenow={`${milestone.percentage}`}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="m-arrow-col arrow-status open-milestone">
                              {!!parseInt(permissions.tasks.view) && (
                                <button
                                  title={
                                    milestoneIdSelected > 0
                                      ? "Close Milestone"
                                      : "Open Milestone"
                                  }
                                  className={
                                    editMilestone
                                      ? "open-item off"
                                      : "open-item"
                                  }
                                >
                                  <i className="material-icons-outlined">
                                    {milestoneIdSelected > 0
                                      ? "keyboard_arrow_up"
                                      : "keyboard_arrow_down"}
                                  </i>
                                </button>
                              )}
                              {!!parseInt(permissions.milestones.delete) && (
                                <i
                                  onClick={(e) =>
                                    deleteMilestoneInformation(e, milestone.id)
                                  }
                                  className={
                                    editMilestone
                                      ? "material-icons-outlined delete-icon delete-item"
                                      : "material-icons-outlined delete-icon delete-item off"
                                  }
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Delete"
                                >
                                  delete
                                </i>
                              )}
                            </td>
                          </tr>

                          {!!parseInt(permissions.tasks.view) && (
                            <tr
                              className={`tasks-space tasks-space-${milestone.id}`}
                              data-id={milestone.id}
                            >
                              <td
                                colSpan="8"
                                id={`milestoneDetails-${milestone.id}`}
                              >
                                {milestoneData.length > 0 &&
                                  milestoneIdSelected === milestone.id && (
                                    <MilestoneDetails
                                      data={milestoneData}
                                      project={projectData}
                                      user={user}
                                      chapterId={
                                        chapter?.chapter_id
                                          ? chapter?.chapter_id
                                          : 0
                                      }
                                      chapterNo={
                                        chapter?.chapterNo
                                          ? chapter?.chapterNo
                                          : 0
                                      }
                                      handleChangeTaskStatus={(
                                        _action,
                                        _taskId,
                                        _status,
                                      ) =>
                                        changeTaskStatus(
                                          _action,
                                          _taskId,
                                          _status,
                                        )
                                      }
                                      confirmReject={(_taskId) =>
                                        confirmReject(_taskId)
                                      }
                                      skipEproofing={skipEproofing}
                                      showFailToast={(message) =>
                                        showFailToast(message)
                                      }
                                      setIsLoading={setIsLoading}
                                      toggleMilestone={(milestoneId) =>
                                        toggleMilestone(milestoneId)
                                      }
                                      getMilestoneData={(
                                        milestoneId,
                                        _taskId,
                                      ) =>
                                        getMilestoneData(milestoneId, _taskId)
                                      }
                                      communicationSelectedLocalStorage={
                                        communicationSelectedLocalStorage
                                      }
                                      setCommunicationSelectedLocalStorage={
                                        setCommunicationSelectedLocalStorage
                                      }
                                    />
                                  )}
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
                {addNewMilestone && (
                  <tr className="milestoneRow" data-id="1" id="milestoneRow-1">
                    <td className="m-color-col">
                      <div className="circle-status" />
                    </td>
                    <td className="m-title-col">
                      <input
                        type="text"
                        id="newMilestoneName"
                        name="milestoneName"
                        placeholder="Type Milestone name here..."
                        onChange={(e) => handleOnChangeNewTask(e)}
                      />
                      <span className="error-msg mile-name">
                        Enter Milestone Name
                      </span>
                    </td>
                    <td className="m-start-col ws">
                      <div className="content-datepicker">
                        <DatePicker
                          type="date"
                          name="startDate"
                          id="newMilestoneStartDate"
                          defaultValue="dd-mm-yyyy"
                          getSelectedDate={(e) => handleOnChangeNewTask(e)}
                          min={moment(projectData?.startDate).format(
                            "YYYY-DD-MM",
                          )}
                          max={moment(projectData?.endDate).format(
                            "YYYY-DD-MM",
                          )}
                        />
                      </div>
                      <span className="error-msg strt-dte-err">
                        Enter Start Date
                      </span>
                    </td>
                    <td className="m-due-col ws">
                      <div className="content-datepicker">
                        <DatePicker
                          type="date"
                          name="endDate"
                          id="newMilestoneEndDate"
                          defaultValue="dd-mm-yyyy"
                          getSelectedDate={(e) => handleOnChangeNewTask(e)}
                          min={moment(projectData?.startDate).format(
                            "YYYY-DD-MM",
                          )}
                          max={moment(projectData?.endDate).format(
                            "YYYY-DD-MM",
                          )}
                        />
                      </div>
                      <span className="error-msg end-dte-err">
                        Enter End Date
                      </span>
                    </td>
                    <td>
                      <div className="milestone-type-col">
                        <div className="milestone-label">Milestone Type</div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            className="custom-control-input"
                            value="1"
                            id="internal"
                            name="milestoneType"
                            onChange={(e) => handleOnChangeNewTask(e)}
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
                            name="milestoneType"
                            onChange={(e) => handleOnChangeNewTask(e)}
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
                            name="milestoneType"
                            onChange={(e) => handleOnChangeNewTask(e)}
                          />
                          <label className="custom-control-label" htmlFor="pm">
                            PM
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            className="custom-control-input"
                            value="0"
                            id="both"
                            name="milestoneType"
                            onChange={(e) => handleOnChangeNewTask(e)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="both"
                          >
                            Both
                          </label>
                        </div>
                      </div>
                      <span className="error-msg mile-type-err">
                        Select Milestone Type
                      </span>
                    </td>
                    <td>
                      <div className="milestone-type-col milestone-complexity-col">
                        <div className="milestone-label">
                          Milestone Complexity
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            className="custom-control-input"
                            value="Simple"
                            id="simple"
                            name="milestoneComplexity"
                            onChange={(e) => handleOnChangeNewTask(e)}
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
                            value="Medium"
                            id="Medium"
                            name="milestoneComplexity"
                            onChange={(e) => handleOnChangeNewTask(e)}
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
                            value="Complex"
                            id="complex"
                            name="milestoneComplexity"
                            onChange={(e) => handleOnChangeNewTask(e)}
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
                            value="Super Complex"
                            id="superComplex"
                            name="milestoneComplexity"
                            onChange={(e) => handleOnChangeNewTask(e)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="superComplex"
                          >
                            Super Complex
                          </label>
                        </div>
                      </div>
                      <span className="error-msg mile-complex-err">
                        Select Milestone Complexity
                      </span>{" "}
                    </td>
                    <td className="actions-milestone align-right" colSpan="2">
                      {" "}
                      <div>
                        {" "}
                        <a
                          href="#"
                          className="cancel-milestone cancel-icon"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Cancel"
                          onClick={(e) => {
                            e.preventDefault();
                            setNewMilestoneData({});
                            setAddNewMilestone(false);
                          }}
                        >
                          <i className="material-icons-outlined ">close</i>
                        </a>{" "}
                        <a
                          href="#"
                          onClick={(e) => createMilestoneInformation(e)}
                          className="save-milestone save-icon"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Save"
                        >
                          <i className="material-icons-outlined">save</i>
                        </a>{" "}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Start Edit Milestone, Special Instructions, CheckList */}
            <div className="secondary-navigation">
              {!!parseInt(permissions.milestones.edit) && (
                <a
                  href="#"
                  className={
                    editMilestone
                      ? "edit-milestones df-sec-options off"
                      : "edit-milestones df-sec-options"
                  }
                  onClick={(event) => handleEditMilestone(event)}
                >
                  <i className="material-icons-outlined">edit</i> Edit
                  Milestones
                </a>
              )}

              {!!parseInt(permissions.milestones.create) && (
                <a
                  href="#"
                  className={
                    editMilestone
                      ? "add-milestones editing-sec-options hide"
                      : "add-milestones editing-sec-options"
                  }
                  onClick={(e) => handleNewMilestone(e)}
                >
                  <i className="material-icons-outlined">add</i>
                  Create Milestone
                </a>
              )}

              <a
                href="#"
                className={
                  editMilestone ? "df-sec-options off" : "df-sec-options"
                }
                data-toggle="modal"
                data-target="#edit-special-instructions"
                onClick={(e) => {
                  handleSpecialInstructionsModal(e);
                }}
              >
                <i className="material-icons-outlined">info</i> Special
                Instructions
              </a>
              <a
                href="#"
                className={
                  editMilestone ? "df-sec-options off" : "df-sec-options"
                }
                data-toggle="modal"
                data-target="#edit-checklists"
                onClick={(e) => {
                  handleChecklistModal(e);
                }}
              >
                <i className="material-icons-outlined">playlist_add_check</i>{" "}
                Checklists
              </a>

              {!!parseInt(permissions.milestones.edit) && (
                <>
                  <a
                    href="#"
                    onClick={(event) => milestoneReschedule(event)}
                    className={
                      editMilestone
                        ? "reschedule-milestones editing-sec-options"
                        : "reschedule-milestones editing-sec-options off"
                    }
                    data-toggle="modal"
                    data-target="#reschedule-dates"
                  >
                    <i className="material-icons-outlined">date_range</i>{" "}
                    Reschedule dates
                  </a>
                  <a
                    href="#"
                    className={
                      editMilestone
                        ? "cancel-update-milestones editing-sec-options cancel-icon"
                        : "cancel-update-milestones editing-sec-options off cancel-icon"
                    }
                    onClick={(event) => handleCancelEditMilestone(event)}
                  >
                    <i className="material-icons-outlined">close</i>Cancel
                    Editing
                  </a>
                  <a
                    href="#"
                    onClick={() => milestoneupdateinfo()}
                    className={
                      editMilestone
                        ? "update-milestones editing-sec-options save-icon"
                        : "update-milestones editing-sec-options off save-icon"
                    }
                  >
                    <i className="material-icons-outlined">save</i>Save Updates
                  </a>
                </>
              )}
            </div>
            {/* End Edit Milestone, Special Instructions, CheckList */}
          </>
        ) : (
          <div className="first-stage-milestones">
            {parseInt(permissions?.milestones?.view) ? (
              <>
                <div className="alert-milestones">
                  <p>
                    <i className="material-icons-outlined">error_outline</i>{" "}
                    This project has no milestones and tasks created yet.
                  </p>
                </div>
                <div className="milestones-options">
                  <p>
                    To start{" "}
                    <a href="#" className="add-by-template">
                      select from a template
                    </a>{" "}
                    or{" "}
                    <a href="#" className="create-new-ones">
                      create your own
                    </a>
                    .
                  </p>
                </div>
              </>
            ) : (
              <div className="alert-milestones">
                <p>
                  <i className="material-icons-outlined">error_outline</i> The
                  current user does not have access to this section yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
