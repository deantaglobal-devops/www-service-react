import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { api } from "../../../../services/api";
import MessagingCenter from "../../../../components/messaging/messagingCenter";
import Modal from "../../../../components/Modal/modal";
import FinishTemplateModal from "../../../../components/finishTemplateModal";
import AddEditTask from "../addEditTask/addEditTask";
import converterChar from "../../../../utils/converterChar";
import InvoiceModal from "../invoiceModal/invoiceModal";

export default function MilestoneDetails({
  data,
  project,
  user,
  chapterId,
  chapterNo,
  handleChangeTaskStatus,
  confirmReject,
  skipEproofing,
  showFailToast,
  setIsLoading,
  toggleMilestone,
  getMilestoneData,
  communicationSelectedLocalStorage,
  setCommunicationSelectedLocalStorage,
}) {
  const [taskId, setTaskId] = useState(0);
  const [milestoneId, setMilestoneId] = useState(0);
  const [projectId, setProjectId] = useState(0);
  const [taskName, setTaskName] = useState(0);
  const [taskPath, setTaskPath] = useState(0);
  const [taskStatusType, setTaskStatusType] = useState(0);
  const [openMessageCenter, setOpenMessageCenter] = useState(false);
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const [openFinishTemplateModal, setOpenFinishTemplateModal] = useState(false);
  const [bodyModal, setBodyModal] = useState("");
  const [templateData, setTemplateData] = useState({});
  const [finishTemplateList, setFinishTemplateList] = useState([]);
  const [taskEditing, setTaskEditing] = useState(false);
  const [milestoneData, setMilestoneData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [openByCommunicationButton, setOpenByCommunicationButton] =
    useState(false);

  useEffect(() => {
    // Create a new array of tasks and fixing some properties names,
    let _projectId = 0;
    if (data[0]?.tasks?.length > 0) {
      const tasks = data[0]?.tasks
        ?.filter((task) => {
          if (
            // external
            (task.statusType == 2 &&
              !!parseInt(data[0]?.permissions?.tasks?.external)) ||
            // internal
            (task.statusType == 1 &&
              !!parseInt(data[0]?.permissions?.tasks?.internal)) ||
            // not assigned or both
            ((task.statusType == 0 || task.statusType == 4) &&
              !!parseInt(data[0]?.permissions?.tasks?.external) &&
              !!parseInt(data[0]?.permissions?.tasks?.internal)) ||
            // Pm task
            (task.statusType == 3 &&
              !!parseInt(data[0]?.permissions?.tasks?.pm))
          ) {
            return task;
          }
        })
        .map((task) => {
          _projectId = task.projectId;

          return {
            areUnreadMessages: task.areUnreadMessages,
            completionDate: task.completionDate,
            invoiceType: task.invoiceType,
            projectId: task.projectId,
            status: task.status,
            statusId: task.statusId,
            statusType: task.statusType,
            taskComplex: task.taskComplex,
            taskEnd: task.taskEnd,
            taskId: task.taskId,
            taskName: task.taskName,
            taskStart: task.taskStart,
            user: task.user,
            taskFinal: task.FinalUpload,
            taskXMLUpload: task.XmlUpload,
            taskEditProcess: task.editingProcess,
            taskEngine: task.engineProcess,
            taskBookEnd: task.taskBookend,
            taskLayout: task.taskLayout,
            taskpre_editing: task.taskPreediting,
            taskQuality: task.taskQuality,
            taskSkip: task.taskSkipend,
            taskStyleEditing: task.taskStyleEditing,
            taskeProducts: task.taskeProducts,
          };
        });
      data[0].tasks = tasks;

      setProjectId(_projectId);
    }

    setMilestoneData(data[0]);

    if (
      communicationSelectedLocalStorage?.projectPath !== "" &&
      communicationSelectedLocalStorage?.projectPath !== undefined
    ) {
      go2MessagingCenter(
        communicationSelectedLocalStorage.taskId,
        communicationSelectedLocalStorage.projectId,
        communicationSelectedLocalStorage.taskName,
        communicationSelectedLocalStorage.projectPath,
        "",
        true,
        communicationSelectedLocalStorage.milestoneId,
      );

      window.localStorage.removeItem("notificationItemTitle");
      window.localStorage.removeItem("notificationItemProjectId");
      window.localStorage.removeItem("notificationItemTaskId");
      window.localStorage.removeItem("notificationItemMilestoneId");

      window.scrollTo(0, document.body.scrollHeight);

      setCommunicationSelectedLocalStorage({});
    }
  }, [data]);

  const go2MessagingCenter = (
    _taskId,
    _projectId,
    _taskName,
    _taskPath,
    _taskStatusType,
    _openByCommunicationButton,
    _milestoneId,
  ) => {
    setTaskId(_taskId);
    setMilestoneId(_milestoneId);
    setProjectId(_projectId);
    setTaskName(_taskName);
    setTaskPath(_taskPath);
    setTaskStatusType(_taskStatusType);
    setOpenByCommunicationButton(_openByCommunicationButton || false);
    setOpenMessageCenter(true);
  };

  const handleMessagingCenterModal = () => {
    setTemplateData({});
    setOpenMessageCenter(false);
  };

  const changeTaskStatus = (_action, _taskId, _status) => {
    handleChangeTaskStatus(_action, _taskId, _status);
  };

  const confirmFinish = async (
    _taskId,
    _projectId,
    _taskName,
    _taskPath,
    _statusType,
  ) => {
    setIsLoading(true);
    const userId = user.id;
    setTaskStatusType(_statusType);
    setTaskId(_taskId);
    const _finishTemplateList = await api
      .get(`/task/${_taskId}/templates`)
      .then((response) => {
        // If skip eProofing is toggled, wipe the eProofing template array
        if (skipEproofing === true) {
          return [];
        }

        return response.data.templates ? response.data.templates : [];
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    const checklistItems = [];

    await api
      .get(`/checklist/${_taskId}`)
      .then((response) => {
        // there's items in the array...
        if (response.data.length > 0) {
          response.data.forEach((item) => {
            checklistItems.push(item.checklist_name);
          });
        }

        displayChecklistInFinishModal(
          checklistItems,
          _finishTemplateList,
          _statusType,
        );
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    function displayChecklistInFinishModal(
      _checklistItems,
      _finishTemplateList,
      _statusType,
    ) {
      setIsLoading(false);

      const checklistItemsArray = [];
      let checkListContent = null;
      const OLwrapper = document.createElement("ol");

      const checkListConfirmationString =
        "Please ensure you've consulted the below checks before proceeding.";

      // If we've Checklist items, combine the confirmation message and messages in one El.
      if (_checklistItems.length > 0) {
        _checklistItems.forEach((item) => {
          checklistItemsArray.push(`<li>${item}</li>`);
        });

        checklistItemsArray.forEach((item) => {
          OLwrapper.insertAdjacentHTML("beforeend", item);
        });
        checkListContent = `<p><b>${checkListConfirmationString}</b></p> ${OLwrapper.outerHTML}`;
      } else {
        // wipe the content if there is no items to show
        // conditional rendering wasn't woking in below section.
        checkListContent = "";
      }

      // _statusType == 1 -> Internal Task
      // Internal task that has template does not need to open the communication panel
      // when user wants to finish the task
      // LV - 2423 so removed internal task options from if
      if (_finishTemplateList.length === 1) {
        go2MessagingCenterWithFinishTemplate(
          _finishTemplateList[0],
          _taskId,
          _projectId,
          _taskName,
          _taskPath,
          _statusType,
        );
      } else if (_finishTemplateList.length > 1) {
        showFinishTemplateModal(
          _taskId,
          _finishTemplateList,
          _projectId,
          _taskName,
          _taskPath,
          userId,
        );
      } else {
        setBodyModal(
          `Are you sure that you would like to mark this task as "Finished"?${checkListContent}`,
        );
        selectModal();
      }
    }
  };

  const go2MessagingCenterWithFinishTemplate = async (
    finishTemplate,
    taskId,
    projectId,
    taskName,
    taskPath,
    _statusType,
  ) => {
    const templateData = await api
      .post("/task/template/eproofing", {
        taskId,
        templateId: finishTemplate?.templateId
          ? finishTemplate.templateId
          : finishTemplate,
      })
      .then((response) => response.data)
      .catch((err) => console.log(err));

    if (templateData && templateData.Message) {
      // open modal if user wants to finish the task
      setBodyModal(
        'Are you sure that you would like to mark this task as "Finished"?',
      );
      selectModal();
    } else if (templateData) {
      templateData.template = converterChar(templateData.template);
      setTemplateData(templateData);
      go2MessagingCenter(
        taskId,
        projectId,
        taskName,
        taskPath,
        _statusType,
        false,
      );
    } else {
      showFailToast("error");
    }
  };

  const showFinishTemplateModal = (
    _taskId,
    _finishTemplateList,
    _projectId,
    _taskName,
    _taskPath,
    userId,
  ) => {
    setTaskId(_taskId);
    setProjectId(_projectId);
    setTaskName(_taskName);
    setTaskPath(_taskPath);
    setFinishTemplateList(_finishTemplateList);
    setOpenFinishTemplateModal(true);

    document.querySelector(".lanstadModal").style.display = "block";
  };

  const selectModal = () => {
    setOpenModalConfirmation(!openModalConfirmation);
  };

  function handleConfirmationButton() {
    changeTaskStatus("finish", taskId, 4);
    selectModal();
  }

  const addNewTask = (event) => {
    const newTaskData = {
      areUnreadMessages: false,
      completionDate: "",
      projectId,
      taskBookEnd: 0,
      taskComplex: "",
      taskEditProcess: 0,
      taskEnd: data[0].milestoneEnd,
      taskStart: data[0].milestoneStart,
      taskEngine: 0,
      taskFinal: 0,
      taskId: 0,
      taskLayout: 0,
      taskName: "",
      taskQuality: 0,
      taskSkip: 0,
      taskStyleEditing: 0,
      taskXMLUpload: 0,
      taskeProducts: 0,
      taskpre_editing: 0,
      user: {
        id: user.id,
        username: `${user.name} ${user.lastname}`,
      },
    };
    setTaskId(0);
    setNewTask(newTaskData);
  };

  async function taskStartClicked(
    _taskId,
    _projectId,
    _taskName,
    _taskPath,
    _statusType,
    _milestoneId,
  ) {
    // _statusType = 3 -> PM Tasks

    // We're not using the skip eproofing button anymore.
    // We'll get rid of this button from the screen in the future
    // skipEproofing
    //   ? confirmFinish(_taskId, _projectId, _taskName, _taskPath)
    //   : go2MessagingCenter(
    //       _taskId,
    //       _projectId,
    //       _taskName,
    //       _taskPath,
    //       _statusType
    //     );

    // LV-1676 (Following this flow for PM Tasks)
    const _templateData = await api
      .get(`/task/${_taskId}/templates`)
      .then((response) => response.data)
      .catch((err) => console.log(err));
    // the task has eproofing configured
    if (_templateData.templates && _statusType != 1) {
      changeTaskStatus("start", _taskId, "6");
      go2MessagingCenter(
        _taskId,
        _projectId,
        _taskName,
        _taskPath,
        _statusType,
        false,
        _milestoneId,
      );
    } else {
      changeTaskStatus("start", _taskId, "6");
    }
  }

  /** Invoice process  */
  const invoiceProcess = async (_action, _projectId, _taskId, _status) => {
    const bodyRequest = {
      action: _action,
      taskId: _taskId,
      status: _status,
      projectId: _projectId,
    };

    const _invoiceData = await api
      .post("/task/invoice/process", bodyRequest)
      .then((response) => response.data)
      .catch((err) => console.log(err));

    setInvoiceData(_invoiceData);
    setIsLoading(false);
    setOpenInvoiceModal(true);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const mileArray = Array.from(milestoneData?.tasks);
    mileArray.splice(source.index, 1);
    mileArray.splice(destination.index, 0, milestoneData?.tasks[source.index]);

    setMilestoneData({ ...milestoneData, tasks: mileArray });

    reorderList(mileArray, source.index, destination.index);
  };

  const reorderList = async (newTask) => {
    setIsLoading(true);

    let reorderedList = [];

    newTask?.map((task, index) => {
      reorderedList = [
        ...reorderedList,
        {
          orderId: index + 1,
          taskId: task.taskId,
        },
      ];
    });

    await api
      .post("/milestone/reordertasks", { reorderedList })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="existing-tasks-wrapper">
        {openMessageCenter && taskId !== 0 && taskId !== undefined && (
          <div id="side-slider-container" hidden>
            <MessagingCenter
              userId={user.id}
              chapterId={chapterId}
              chapterNo={chapterNo}
              taskId={taskId}
              projectId={projectId}
              taskPath={taskPath}
              taskName={taskName}
              taskStatusType={taskStatusType}
              permissions={milestoneData.permissions}
              projectAbbreviation={project.abbreviation}
              projectCode={project.bookcode}
              projectClient={project.client}
              articleName={milestoneData.projectName}
              projectName={milestoneData.projectName}
              templateData={templateData}
              handleCloseModal={() => handleMessagingCenterModal()}
              showFailToast={(message) => showFailToast(message)}
              changeTaskStatus={(_action, _taskId, _status) =>
                changeTaskStatus(_action, _taskId, _status)
              }
              milestoneData={milestoneData}
              getMilestoneData={(_taskId) =>
                getMilestoneData(milestoneData.milestoneId, _taskId)
              }
              openByCommunicationButton={openByCommunicationButton}
              milestoneId={milestoneId}
            />
          </div>
        )}

        {openModalConfirmation && (
          <Modal
            displayModal={openModalConfirmation}
            closeModal={selectModal}
            title="Confirmation"
            body={bodyModal}
            button1Text="Cancel"
            handleButton1Modal={() => selectModal()}
            Button2Text="Confirm"
            handleButton2Modal={() => handleConfirmationButton()}
          />
        )}

        {openFinishTemplateModal && (
          <div id="lanstadModal" className="lanstadModal">
            <FinishTemplateModal
              taskId={taskId}
              finishTemplateList={finishTemplateList}
              taskName={taskName}
              taskPath={taskPath}
              projectId={projectId}
              userId={user.id}
              go2MessagingCenterWithFinishTemplate={(
                finishTemplate,
                taskId,
                projectId,
                taskName,
                taskPath,
              ) =>
                go2MessagingCenterWithFinishTemplate(
                  finishTemplate,
                  taskId,
                  projectId,
                  taskName,
                  taskPath,
                )
              }
              closeTemplateModal={() => {
                setOpenFinishTemplateModal(false);
              }}
            />
          </div>
        )}

        {openInvoiceModal && (
          <InvoiceModal
            openInvoiceModal={openInvoiceModal}
            handleOnCloseInvoiceModal={() => setOpenInvoiceModal(false)}
            data={invoiceData}
            setIsLoading={setIsLoading}
          />
        )}

        {milestoneData?.tasks?.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <DropComponent
              milestoneData={milestoneData}
              getMilestoneData={getMilestoneData}
              toggleMilestone={toggleMilestone}
              setNewTask={setNewTask}
              project={project}
              setTaskId={setTaskId}
              setTaskEditing={setTaskEditing}
              setMilestoneData={setMilestoneData}
              setIsLoading={setIsLoading}
              data={data}
              chapterId={chapterId}
              confirmReject={confirmReject}
              taskStartClicked={taskStartClicked}
              changeTaskStatus={changeTaskStatus}
              go2MessagingCenter={go2MessagingCenter}
              invoiceProcess={invoiceProcess}
            />
          </DragDropContext>
        )}
      </div>
      {!!parseInt(milestoneData?.permissions?.tasks?.create) && (
        <>
          <div className="new-tasks">
            {Object.keys(newTask).length !== 0 &&
              newTask.constructor === Object && (
                <div className="task-details task-editing">
                  <AddEditTask
                    task={newTask}
                    data={data[0]}
                    confirmReject={(_taskId) => confirmReject(_taskId)}
                    confirmFinish={(
                      _taskId,
                      _projectId,
                      _taskName,
                      _taskPath,
                      _statusType,
                    ) =>
                      confirmFinish(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _statusType,
                      )
                    }
                    taskStartClicked={(
                      _taskId,
                      _projectId,
                      _taskName,
                      _taskPath,
                      _statusType,
                      _milestoneId,
                    ) =>
                      taskStartClicked(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _statusType,
                        _milestoneId,
                      )
                    }
                    changeTaskStatus={(_action, _taskId, _status) =>
                      changeTaskStatus(_action, _taskId, _status)
                    }
                    go2MessagingCenter={(
                      _taskId,
                      _projectId,
                      _taskName,
                      _taskPath,
                      _taskStatusType,
                      _openByCommunicatioButton,
                      _milestoneId,
                    ) =>
                      go2MessagingCenter(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _taskStatusType,
                        _openByCommunicatioButton,
                        _milestoneId,
                      )
                    }
                    invoiceProcess={(_action, _projectId, _taskId, _status) =>
                      invoiceProcess(_action, _projectId, _taskId, _status)
                    }
                    setIsLoading={(value) => setIsLoading(value)}
                    milestoneData={milestoneData}
                    setMilestoneData={(value) => setMilestoneData(value)}
                    setTaskEditing={(value) => setTaskEditing(value)}
                    taskEditing={taskEditing}
                    setTaskId={(value) => setTaskId(value)}
                    taskId={taskId}
                    project={project}
                    newTask
                    setNewTask={(value) => setNewTask(value)}
                    toggleMilestone={(milestoneId) =>
                      toggleMilestone(milestoneId)
                    }
                    getMilestoneData={(milestoneId, _taskId) =>
                      getMilestoneData(milestoneId, _taskId)
                    }
                  />
                </div>
              )}
          </div>

          <div className="secondary-navigation">
            <button className="add-task" onClick={(event) => addNewTask(event)}>
              <i className="material-icons-outlined">add</i>
              Add Task
            </button>
          </div>
        </>
      )}
    </>
  );
}

function DropComponent({
  milestoneData,
  taskEditing,
  taskId,
  getMilestoneData,
  toggleMilestone,
  setNewTask,
  project,
  setTaskId,
  setTaskEditing,
  setMilestoneData,
  setIsLoading,
  data,
  chapterId,
  confirmReject,
  taskStartClicked,
  changeTaskStatus,
  go2MessagingCenter,
  invoiceProcess,
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
    <Droppable droppableId="column-1">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          isdraggingover={snapshot.isDraggingOver.toString()}
          key="column-1"
        >
          {milestoneData?.tasks?.map((task, index) => (
            <Draggable
              draggableId={task.taskId.toString()}
              index={index}
              key={task.taskId}
            >
              {(provided, snapshot) => (
                <div
                  {...provided.draggableProps}
                  ref={provided.innerRef}
                  isdragging={snapshot.isDragging.toString()}
                >
                  <div
                    id={`taskId-${task.taskId}`}
                    className={
                      taskEditing && taskId === task.taskId
                        ? `task-details task-details-milestones status-task-${task.statusId} task-editing`
                        : `task-details task-details-milestones status-task-${task.statusId}`
                    }
                  >
                    <AddEditTask
                      task={task}
                      data={data[0]}
                      chapterId={chapterId}
                      confirmReject={(_taskId) => confirmReject(_taskId)}
                      confirmFinish={(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _statusType,
                      ) =>
                        confirmFinish(
                          _taskId,
                          _projectId,
                          _taskName,
                          _taskPath,
                          _statusType,
                        )
                      }
                      taskStartClicked={(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _statusType,
                        _milestoneId,
                      ) =>
                        taskStartClicked(
                          _taskId,
                          _projectId,
                          _taskName,
                          _taskPath,
                          _statusType,
                          _milestoneId,
                        )
                      }
                      changeTaskStatus={(_action, _taskId, _status) =>
                        changeTaskStatus(_action, _taskId, _status)
                      }
                      go2MessagingCenter={(
                        _taskId,
                        _projectId,
                        _taskName,
                        _taskPath,
                        _taskStatusType,
                        _openByCommunicatioButton,
                        _milestoneId,
                      ) =>
                        go2MessagingCenter(
                          _taskId,
                          _projectId,
                          _taskName,
                          _taskPath,
                          _taskStatusType,
                          _openByCommunicatioButton,
                          _milestoneId,
                        )
                      }
                      invoiceProcess={(_action, _projectId, _taskId, _status) =>
                        invoiceProcess(_action, _projectId, _taskId, _status)
                      }
                      setIsLoading={(value) => setIsLoading(value)}
                      milestoneData={milestoneData}
                      setMilestoneData={(value) => setMilestoneData(value)}
                      setTaskEditing={(value) => setTaskEditing(value)}
                      taskEditing={taskEditing}
                      setTaskId={(value) => setTaskId(value)}
                      taskId={taskId}
                      project={project}
                      newTask={false}
                      setNewTask={(value) => setNewTask(value)}
                      toggleMilestone={(milestoneId) =>
                        toggleMilestone(milestoneId)
                      }
                      getMilestoneData={(milestoneId, _taskId) =>
                        getMilestoneData(milestoneId, _taskId)
                      }
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
