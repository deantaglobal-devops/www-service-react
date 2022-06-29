import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../../../services/api";
import DatePicker from "../../../../components/datePicker/datePicker";
import TaskMembersPreview from "../../../../components/taskMembersPreview";
import ListUsersWrapper from "../../../../components/userList/listUsers-wrapper";
import Modal from "../../../../components/Modal/modal";
import SpecialInstructionsTaskModal from "../specialInstructionsTaskModal/specialInstructionsTaskModal";
import ModalForm from "../../../../components/ModalForm/modalForm";

export default function AddEditTask({
  task,
  data,
  chapterId,
  confirmReject,
  confirmFinish,
  taskStartClicked,
  changeTaskStatus,
  invoiceProcess,
  go2MessagingCenter,
  setIsLoading,
  milestoneData,
  setMilestoneData,
  setTaskEditing,
  taskEditing,
  setTaskId,
  taskId,
  project,
  newTask,
  setNewTask,
  toggleMilestone,
  getMilestoneData,
  dragHandleProps,
}) {
  const [openModalDeleteTask, setOpenModalDeleteTask] = useState(false);
  const [bodyModal, setBodyModal] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [openCheckListTaskModal, setOpenCheckListTaskModal] = useState(false);
  const [checkListTaskData, setCheckListTaskData] = useState([]);
  const [pdfModal, setPdfModal] = useState(false);

  const [finalXml, setFinalXml] = useState(0);
  const [filePack, setFilePack] = useState(0);
  const [imgPack, setImgPack] = useState(0);
  const [eBook, setEbook] = useState(0);
  const [digitalBundlePdfId, setDigitalBundlePdfId] = useState("");

  const [finalXmlZip, setFinalXmlZip] = useState("");
  const [filePackZip, setFilePackZip] = useState("");
  const [imgPackZip, setImgPackZip] = useState("");
  const [eBookZip, setEbookZip] = useState("");

  const [downloadModal, setDownloadModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [downloadCount, setDownloadCount] = useState(0);

  const [
    openSpecialInstructionsTaskModal,
    setOpenSpecialInstructionsTaskModal,
  ] = useState(false);
  const [specialInstructionsTaskData, setSpecialInstructionsTaskData] =
    useState([]);

  useEffect(() => {
    if (digitalBundlePdfId !== "") {
      const interval = setInterval(() => {
        api
          .post("/task/digital/status/process", {
            projectId: task.projectId,
            chapterId,
            milestoneId: milestoneData.milestoneId,
            taskId: task.taskId,
            userId: task.user.id,
            digitalId: digitalBundlePdfId,
            limit: "25",
          })
          .then((response) => {
            if (response.data.success === "success") {
              const { processName } = response.data.responce;
              const fileName = response.data.responce;
              if (processName === "Final XML Generation" && fileName !== null) {
                setFinalXmlZip(fileName);
              } else if (processName === "Image Package" && fileName !== null) {
                setFilePackZip(fileName);
              } else if (
                processName === "Application Files Package" &&
                fileName !== null
              ) {
                setImgPackZip(fileName);
              } else if (
                processName === "eBook Generation" &&
                fileName !== null
              ) {
                setEbookZip(fileName);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [digitalBundlePdfId]);

  useEffect(() => {
    if (finalXml < 100) {
      const interval = setInterval(() => {
        const incount = finalXml + 1;
        // if(!!finalXmlZip?.fileName){
        //   incount = 100;
        // }
        setFinalXml(incount);
      }, 2000);
      return () => clearInterval(interval);
    }
    if (finalXml === 100) {
      setFilePack(1);
    }
  }, [finalXml]);

  useEffect(() => {
    if (filePack > 0 && filePack < 100) {
      const interval = setInterval(() => {
        // setFilePack(filePack + 1);
        const incount = filePack + 1;
        // if(!!filePackZip?.fileName){
        //   incount = 100;
        // }
        setFilePack(incount);
      }, 2000);
      return () => clearInterval(interval);
    }
    if (filePack === 100) {
      setImgPack(1);
    }
  }, [filePack]);

  useEffect(() => {
    if (imgPack > 0 && imgPack < 100) {
      const interval = setInterval(() => {
        // setImgPack(imgPack + 1);
        const incount = imgPack + 1;
        // if(!!imgPackZip?.fileName){
        //   incount = 100;
        // }
        setImgPack(incount);
      }, 2000);
      return () => clearInterval(interval);
    }
    if (imgPack === 100) {
      setEbook(1);
    }
  }, [imgPack]);

  useEffect(() => {
    if (eBook > 0 && eBook < 100) {
      const interval = setInterval(() => {
        let incount = eBook + 1;
        if (incount > 100) {
          incount = 100;
        }
        setEbook(incount);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [eBook]);

  useEffect(() => {
    if (downloadCount > 0 && downloadCount < 100) {
      const interval = setInterval(() => {
        let incount = downloadCount + 1;
        if (incount > 100) {
          incount = 100;
        }
        setDownloadCount(incount);
        if (title === "First Proof XML") {
          if (incount === 20) {
            setText("Merging chapters");
          }
          if (incount === 40) {
            setText("BITS xml conversion");
          }
        }
        if (title === "First Proof ePUB") {
          if (incount === 20) {
            setText("Merging chapters");
          }
          if (incount === 40) {
            setText("ePUB generation");
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [downloadCount]);

  const handleOnChange = (e, _taskId, complexityValue) => {
    if (newTask) {
      const name = e.target.name.substr(0, e.target.name.indexOf("-"));

      let newTaskUpdated = {};

      if (e.target.type == "checkbox") {
        newTaskUpdated = { ...task, [e.target.name]: +e.target.checked }; // + => 'Convert true and false to 1 and 0'
      } else if (complexityValue !== undefined) {
        newTaskUpdated = {
          ...task,
          taskComplex: complexityValue,
        };
      } else if (name === "taskType") {
        newTaskUpdated = { ...task, statusType: parseInt(e.target.value) };
      } else {
        newTaskUpdated = { ...task, [e.target.name]: e.target.value };
      }

      setNewTask(newTaskUpdated);
    } else {
      const name = e.target.name.substr(0, e.target.name.indexOf("-"));

      const milestoneUpdated = milestoneData?.tasks?.map((task) => {
        if (task.taskId == _taskId) {
          if (e.target.type == "checkbox") {
            return { ...task, [e.target.name]: +e.target.checked }; // + => 'Convert true and false to 1 and 0'
          }
          if (complexityValue !== undefined) {
            return {
              ...task,
              taskComplex: complexityValue,
            };
          }
          if (name === "taskType") {
            return { ...task, statusType: parseInt(e.target.value) };
          }
          return { ...task, [e.target.name]: e.target.value };
        }
        return task;
      });

      setMilestoneData({ ...milestoneData, tasks: milestoneUpdated });
    }
  };

  const handleOnChangeDate = (e, _taskId) => {
    if (e) {
      if (newTask) {
        let newTaskUpdated = {};

        if (e.target.name === "taskEnd") {
          newTaskUpdated = {
            ...task,
            taskEnd: { ...task.taskEnd, value: e.target.value },
          };
        } else {
          newTaskUpdated = {
            ...task,
            taskStart: { ...task.taskStart, value: e.target.value },
          };
        }

        setNewTask(newTaskUpdated);
      } else {
        const milestoneUpdated = milestoneData?.tasks?.map((task) => {
          if (task.taskId === _taskId) {
            if (e.target.name === "taskEnd") {
              return {
                ...task,
                taskEnd: {
                  ...task.taskEnd,
                  value: moment(e.target.value).format("DD-MM-YYYY"),
                },
              };
            }
            return {
              ...task,
              taskStart: {
                ...task.taskStart,
                value: moment(e.target.value).format("DD-MM-YYYY"),
              },
            };
          }
          return task;
        });

        setMilestoneData({ ...milestoneData, tasks: milestoneUpdated });
      }
    }
  };

  const editTaskInformation = (e, _taskId) => {
    e.preventDefault();
    setTaskId(_taskId);
    setTaskEditing(true);
  };

  const cancelEditTaskInformation = (e, _taskId) => {
    e.preventDefault();

    if (newTask) {
      setNewTask({});
    } else {
      setTaskId(_taskId);
      setTaskEditing(false);
    }

    setErrorMessage(false);

    // Return the original value in case something was tried to be updated
    setMilestoneData(data);
  };

  const saveTaskInformation = async (e, _taskId, newTask) => {
    e.preventDefault();

    // This part is to get all the tasks attributes
    const taskAttibutes = [
      {
        taskBookEnd: task.taskBookEnd,
        taskEditProcess: task.taskEditProcess,
        taskEngine: task.taskEngine,
        taskFinal: task.taskFinal,
        taskLayout: task.taskLayout,
        taskQuality: task.taskQuality,
        taskSkip: task.taskSkip,
        taskStyleEditing: task.taskStyleEditing,
        taskXMLUpload: task.taskXMLUpload,
        taskeProducts: task.taskeProducts,
        taskpre_editing: task.taskpre_editing,
      },
    ];

    // This part is to get all the tasks attributes checked
    const taskAttr = [];
    for (const key in taskAttibutes[0]) {
      const value = taskAttibutes[0][key];
      if (value === 1) {
        if (key === "taskpre_editing") {
          taskAttr.push("taskpre-editing");
        } else {
          taskAttr.push(key);
        }
      }
    }

    if (
      task.taskName !== "" &&
      task.taskStart.value !== "" &&
      task.taskEnd.value !== ""
    ) {
      setIsLoading(true);
      setErrorMessage(false);
      if (newTask) {
        const formData = new FormData();
        formData.append("projectId", project.projectId);
        formData.append("companyId", data.companyId);
        formData.append("chapterId", chapterId !== undefined ? chapterId : "");
        formData.append("milestoneId", data.milestoneId);
        formData.append("taskName", task.taskName);
        formData.append(
          "orderId",
          milestoneData.tasks.length > 0 ? milestoneData.tasks.length + 5 : 1,
        ); // I do not know why is +5, just kept the same logic as before - OrderId 1 because is the first task of the milestone
        formData.append("startDate", task.taskStart.value);
        formData.append("endDate", task.taskEnd.value);
        taskAttr.map((attr) => formData.append("taskAttr[]", attr));
        formData.append("taskType", task.statusType);
        formData.append("taskComplexity", task.taskComplex);

        await fetch("/call/task/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
          mode: "no-cors",
        })
          .then((res) => res.json())
          .then(
            () => {
              setTaskEditing(false);
              setNewTask({});
            },
            (error) => {
              // Todo: How are we going to show the errors
              console.log(error);
            },
          );
      } else {
        const bodyRequest = {
          taskId: _taskId,
          taskName: task.taskName,
          startDate: task.taskStart.value,
          endDate: task.taskEnd.value,
          taskType: task.statusType,
          "taskEditAttr[]": taskAttr.map((attr) => attr),
          editComplexity:
            task.taskComplex === "Simple"
              ? 1
              : task.taskComplex === "Medium"
              ? 2
              : task.taskComplex === "Complex"
              ? 3
              : task.taskComplex === "Super Complex" && 4,
        };

        await api
          .post("/task/update", bodyRequest)
          .then(() => {
            setTaskEditing(false);
          })
          .catch((err) => console.log(err));
      }

      setIsLoading(false);
      // toggleMilestone(data.milestoneId);
      getMilestoneData(data.milestoneId, _taskId);
    } else {
      setTaskId(task.taskId);
      setErrorMessage(true);
    }
  };

  function deleteEditTaskInformation(e) {
    e.preventDefault();
    setBodyModal("Are you sure that you want to delete the task?");
    setOpenModalDeleteTask(true);
  }

  const deleteTaskInformation = async (_taskId) => {
    await api
      .post("/task/delete", { taskId: _taskId })
      .then(() => {
        setTaskEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // toggleMilestone(data.milestoneId);
    getMilestoneData(data.milestoneId);
    setOpenModalDeleteTask(false);
  };

  const closeModals = () => {
    setOpenModalDeleteTask(false);
    setOpenCheckListTaskModal(false);
    setOpenSpecialInstructionsTaskModal(false);
  };

  const showSpecialInstruction = async (_taskId) => {
    // Get the most up to date Checklists from the API
    const lastestSpecialInstructionItems = await api
      .get(`/si/${_taskId}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    setOpenSpecialInstructionsTaskModal(true);
    setSpecialInstructionsTaskData(lastestSpecialInstructionItems);
  };

  const showChecklist = async (_taskId) => {
    // Get the most up to date Checklists from the API
    const lastestChecklistItems = await api
      .get(`/checklist/${_taskId}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log(err));

    setOpenCheckListTaskModal(true);
    setCheckListTaskData(lastestChecklistItems);
  };

  const handleVXE = (projectId) => {
    setIsLoading(true);
    const interval = setInterval(() => {
      window.location.href = `/vxe/${projectId}`;
    }, 5000);
  };

  const handleInitaiate = (
    projectId,
    chapterId,
    milestoneId,
    taskId,
    userId,
    companyId,
    taskEngine,
  ) => {
    setIsLoading(true);
    api
      .post("/task/digital/bundle/intiate", {
        projectId,
        chapterId,
        milestoneId,
        taskId,
        userId,
        companyId,
        engineProcess: taskEngine,
      })
      .then((response) => {
        if (response.data.success === "success") {
          setDigitalBundlePdfId(response.data.digitalBundlePdfId);
          setPdfModal(true);
          setIsLoading(false);
          setFinalXml(1);
          setImgPack(0);
          setFilePack(0);
          setEbook(0);
        }
      })
      .catch((err) => console.log(err));
  };

  const fileDownload = (type) => {
    let fileName = "";
    let filePath = "";
    if (type === 1) {
      fileName = finalXmlZip?.fileName;
      filePath = finalXmlZip?.pdfPath;
    } else if (type === 2) {
      fileName = filePackZip?.fileName;
      filePath = filePackZip?.pdfPath;
    } else if (type === 3) {
      fileName = imgPackZip?.fileName;
      filePath = imgPackZip?.pdfPath;
    } else if (type === 4) {
      fileName = eBookZip?.fileName;
      filePath = eBookZip?.pdfPath;
    } else if (type === 5) {
      if (title === "First Proof XML") {
        fileName = "9780429280368.xml";
        filePath = "resources/24012022070852-23-0.333717001643008132.xml";
      }
      if (title === "First Proof ePUB") {
        fileName = "9781000033328_epub.epub";
        filePath = "resources/22012022112330-21-0.587729001642850610.epub";
      }
    }

    const getUrl = window.location;
    let currentURL = ""; // this will be populated in the switch below based on the url
    const liveVersion = "www.lanstad.site";
    const preStgVersion = "www.pre-lanstad.com";
    const StgVersion = "www.stg-lanstad.com";
    const locally = "localhost";
    switch (getUrl.host) {
      case liveVersion:
        currentURL = `${getUrl.protocol}//${liveVersion}`;
        break;
      case StgVersion:
        currentURL = `${getUrl.protocol}//${StgVersion}`;
        break;
      case preStgVersion:
        currentURL = `${getUrl.protocol}//${preStgVersion}`;
        break;
      case locally:
        currentURL = `${getUrl.protocol}//${locally}`;
        break;
      // code block
    }
    if (fileName !== null && filePath !== null) {
      setIsLoading(true);
      fetch("/call/download/digital/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          fileName,
        }),
        mode: "no-cors",
      })
        .then((res) => res.json())
        .then(
          (result) => {
            downloadFileNew(currentURL + result.filePath, result.fileName); // call function
            setIsLoading(false);
            return true;
          },
          (error) => {
            console.log(error);
          },
        );
    }
  };

  const downloadFileNew = (fileURL, fileName) => {
    // for non-IE
    if (!window.ActiveXObject) {
      const save = document.createElement("a");
      save.href = fileURL;
      save.target = "_blank";
      const filename = fileURL.substring(fileURL.lastIndexOf("/") + 1);
      save.download = fileName || filename;
      if (
        navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
        navigator.userAgent.search("Chrome") < 0
      ) {
        document.location = save.href;
        // window event not working here
      } else {
        const evt = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: false,
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
    }

    // for IE < 11
    else if (!!window.ActiveXObject && document.execCommand) {
      const _window = window.open(fileURL, "_blank");
      _window.document.close();
      _window.document.execCommand("SaveAs", true, fileName || fileURL);
      _window.close();
    }
  };

  const bitsXML = () => {
    setDownloadModal(true);
    setTitle("First Proof XML");
    setText("Cleanup");
    setDownloadCount(1);
  };

  const ePUB = () => {
    setDownloadModal(true);
    setTitle("First Proof ePUB");
    setText("Cleanup");
    setDownloadCount(1);
  };

  return (
    <>
      {openModalDeleteTask && (
        <Modal
          displayModal={openModalDeleteTask}
          closeModal={closeModals}
          title="Confirmation"
          body={bodyModal}
          button1Text="Cancel"
          handleButton1Modal={() => closeModals()}
          Button2Text="Confirm"
          handleButton2Modal={() => deleteTaskInformation(task.taskId)}
        />
      )}

      {(openSpecialInstructionsTaskModal || openCheckListTaskModal) && (
        <SpecialInstructionsTaskModal
          openSpecialInstructionsTaskModal={
            openSpecialInstructionsTaskModal || openCheckListTaskModal
          }
          handleOnCloseSpecialInstructionsTaskModal={() => closeModals()}
          data={
            openSpecialInstructionsTaskModal
              ? specialInstructionsTaskData
              : checkListTaskData
          }
          projectSpecialInstruction={
            openSpecialInstructionsTaskModal
              ? project?.special_instruction[0]
              : project?.checklist[0]
          }
          specialInstructions={!!openSpecialInstructionsTaskModal}
        />
      )}
      <div
        id="task-members"
        className="user-col task-members-wrapper task-members"
        data-projectid={task.projectId}
        data-newtask={newTask ? "true" : "false"}
        data-taskid={newTask ? "" : task.taskId}
      >
        {/* The data attributes are used to pass the info in to the React Component  */}

        {/* Maybe replace with some placeholder images? */}
        <div className="task-members">
          <TaskMembersPreview
            taskid={task.taskId}
            newtask={newTask}
            taskMemberListProps={milestoneData.taskMemberList}
          />
        </div>

        {/* editing */}
        {/* {!!parseInt(milestoneData?.permissions.tasks.users.add) && (
                    <a
                      data-task={task.taskId}
                      data-user={task.user.id}
                      className="gUsersList editing-user"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="User"
                    >
                      <div className="avatar-task">
                        <img
                          className="user-avatar rounded-circle"
                          src="https://eu.ui-avatars.com/api/?bold=true&color=fff&background=999&size=35&name=Anom+User"
                        />
                        <i className="material-icons">add</i>
                      </div>
                    </a>
                  )}
                  <div
                    id={`listUsers-${task.taskId}`}
                    className="listUsers hidden"
                  ></div> */}
      </div>
      <div className="title-col ml-2">
        <input
          type="text"
          value={task?.taskName ? task?.taskName : ""}
          disabled={
            (taskEditing && taskId === task.taskId) || newTask ? "" : "disabled"
          }
          id={`taskName-${task.taskId}`}
          name="taskName"
          className={
            taskEditing && taskId === task.taskId && !errorMessage
              ? ""
              : newTask && !errorMessage
              ? "newTask-name"
              : errorMessage && taskId === task.taskId
              ? "is-invalid"
              : "off"
          }
          onChange={(e) => handleOnChange(e, task.taskId)}
          placeholder="Type the task name here"
          required
        />

        <div className="is-invalid-text taskType-error hide">
          Please enter a Task Name
        </div>
      </div>
      <div className="due-col">
        {(taskEditing && taskId === task.taskId) || newTask ? (
          <>
            <DatePicker
              type="date"
              name="taskStart"
              id={`startDate-${task.taskId}`}
              defaultValue={task?.taskStart?.value
                .split("-")
                .reverse()
                .join("-")}
              getSelectedDate={(e) => handleOnChangeDate(e, task.taskId)}
              min={milestoneData?.milestoneStart?.value
                .split("-")
                .reverse()
                .join("-")}
              max={milestoneData?.milestoneEnd?.value
                .split("-")
                .reverse()
                .join("-")}
            />
            <div className="is-invalid-text taskType-error hide">
              Choose a Start Date
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className="form-control off datepicker"
              id={`startDate-${task.taskId}`}
              name="taskStart"
              disabled="disabled"
              value={task?.taskStart?.value ? task.taskStart.value : ""}
              // onChange={(e) => handleOnChange(e, task.taskId)}
            />

            <i className="material-icons-outlined">calendar_today</i>
          </>
        )}
      </div>
      <div className="due-col">
        {(taskEditing && taskId === task.taskId) || newTask ? (
          <>
            <DatePicker
              type="date"
              name="taskEnd"
              id={`endDate-${task.taskId}`}
              defaultValue={task?.taskEnd?.value.split("-").reverse().join("-")}
              getSelectedDate={(e) => handleOnChangeDate(e, task.taskId)}
              min={milestoneData?.milestoneStart?.value
                .split("-")
                .reverse()
                .join("-")}
              max={milestoneData?.milestoneEnd?.value
                .split("-")
                .reverse()
                .join("-")}
            />
            <div className="is-invalid-text taskType-error hide">
              Choose an End Date
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className="form-control off datepicker"
              id={`endDate-${task.taskId}`}
              name="taskEnd"
              disabled="disabled"
              value={task?.taskEnd?.value ? task?.taskEnd?.value : ""}
              // onChange={(e) => handleOnChange(e, task.taskId)}
            />

            <i className="material-icons-outlined">calendar_today</i>
          </>
        )}
      </div>
      {!newTask && (
        <div className="status-col">
          {(task.taskEngine === 6 || task.taskEngine === 4) && (
            <button
              type="button"
              className="btn-start-task"
              onClick={() => {
                handleInitaiate(
                  task.projectId,
                  chapterId,
                  milestoneData.milestoneId,
                  task.taskId,
                  task.user.id,
                  milestoneData?.companyId,
                  task.taskEngine,
                );
              }}
            >
              Initiate
            </button>
          )}
          {task.taskEngine === 10 && (
            <button
              type="button"
              className="btn-start-task"
              onClick={() => {
                handleVXE(task.projectId);
              }}
            >
              Initiate
            </button>
          )}
          {task.taskEngine === 11 && (
            <button
              type="button"
              className="btn-start-task"
              onClick={() => {
                bitsXML();
              }}
            >
              Initiate
            </button>
          )}

          {task.taskEngine === 12 && (
            <button
              type="button"
              className="btn-start-task"
              onClick={() => {
                ePUB();
              }}
            >
              Initiate
            </button>
          )}

          {task.taskEngine !== 10 &&
            task.taskEngine !== 11 &&
            task.taskEngine !== 12 &&
            task.taskEngine !== 6 &&
            task.taskEngine !== 4 &&
            (task.invoiceType == 1 && task.statusId != 4 ? (
              task.statusType == 3 ? (
                <button
                  type="button"
                  className="btn-start-task"
                  onClick={() => {
                    taskStartClicked(
                      task.taskId,
                      task.projectId,
                      task.taskName,
                      data.taskPath,
                      task.statusType,
                      milestoneData.milestoneId,
                    );
                  }}
                >
                  Click here to start
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-start-task"
                  onClick={() =>
                    invoiceProcess("start", task.projectId, task.taskId, "4")
                  }
                >
                  Click here to start
                </button>
              )
            ) : task.statusId == 1 ? (
              // If PM Task or Internal task, open communication panel if there's
              // any template
              task.statusType == 3 || task.statusType == 2 ? (
                <button
                  type="button"
                  className="btn-start-task"
                  onClick={() => {
                    taskStartClicked(
                      task.taskId,
                      task.projectId,
                      task.taskName,
                      data.taskPath,
                      task.statusType,
                      milestoneData.milestoneId,
                    );
                  }}
                >
                  Click here to start
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-start-task"
                  onClick={() => {
                    changeTaskStatus("start", `${task.taskId}`, "6");
                  }}
                >
                  Click here to start
                </button>
              )
            ) : task.statusId == 4 ? (
              <span className="finished">
                {`Finished on ${task.completionDate}`}

                <button
                  title="Reopen Task"
                  onClick={() =>
                    changeTaskStatus("start", `${task.taskId}`, "6")
                  }
                >
                  <i className="material-icons-outlined">history</i>
                </button>
              </span>
            ) : task.statusId == 6 ? (
              <div className="task-wip-options">
                <span>WIP</span>
                <a
                  href="#"
                  onClick={() => confirmReject(task.taskId)}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Reject"
                >
                  <i className="material-icons-outlined">close</i>
                </a>
                <a
                  href="#"
                  onClick={() =>
                    changeTaskStatus("hold", `${task.taskId}`, "9")
                  }
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Hold"
                >
                  <i className="material-icons-outlined">pause</i>
                </a>
                <a
                  href="#"
                  onClick={() =>
                    confirmFinish(
                      task.taskId,
                      task.projectId,
                      task.taskName,
                      data.taskPath,
                      task.statusType,
                    )
                  }
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Finish"
                >
                  <i className="material-icons-outlined">check</i>
                </a>
              </div>
            ) : (
              task.statusId == 8 ||
              (task.statusId == 9 && (
                <div className="task-wip-options">
                  <span>HOLD</span>
                  <a
                    href="#"
                    onClick={() => confirmReject(task.taskId)}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Reject"
                  >
                    <i className="material-icons-outlined">close</i>
                  </a>
                  <a
                    href="#"
                    onClick={() =>
                      changeTaskStatus("start", `${task.taskId}`, "6")
                    }
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Resume"
                  >
                    <i className="material-icons-outlined">play_arrow</i>
                  </a>
                  <a
                    href="#"
                    onClick={() =>
                      confirmFinish(
                        task.taskId,
                        task.projectId,
                        task.taskName,
                        data.taskPath,
                        task.statusType,
                      )
                    }
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Finish"
                  >
                    <i className="material-icons-outlined">check</i>
                  </a>
                </div>
              ))
            ))}
        </div>
      )}

      {!!parseInt(milestoneData?.permissions.chatroom.view) && (
        <button
          style={{ height: `${20}px` }}
          className="messaging-col"
          onClick={() =>
            go2MessagingCenter(
              task.taskId,
              task.projectId,
              task.taskName,
              milestoneData?.taskPath,
              "",
              true,
              milestoneData.milestoneId,
            )
          }
        >
          <i className="material-icons-outlined">message</i>
          {task.areUnreadMessages && <div className="messaging-circle" />}
          <div className="messaging-loading hide">
            <i className="material-icons">refresh</i>
          </div>
        </button>
      )}
      <div className="actions-task-col">
        <div className="task-toolbar default-toolbar active">
          {/* let just one checklist per task */}
          {project?.checklist
            ?.filter(
              (checklist, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.task_id === checklist.task_id &&
                    t.task_name === checklist.task_name,
                ),
            )
            .map((checkList) => {
              return (
                <React.Fragment key={checkList.checklist_id}>
                  {checkList.task_id == task.taskId && (
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#checklist-taskid"
                      className={`nolink show-checklist-icon show-checklist-icon-${task.taskId}`}
                      onClick={() => showChecklist(task.taskId)}
                    >
                      <i
                        className="material-icons-outlined"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Checklist"
                      >
                        playlist_add_check
                      </i>
                    </a>
                  )}
                </React.Fragment>
              );
            })}

          {/* let just one special instruction per task */}
          {project?.special_instruction
            ?.filter(
              (specialInstruction, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.task_id === specialInstruction.task_id &&
                    t.task_name === specialInstruction.task_name,
                ),
            )
            .map((specialInstruction) => {
              return (
                <React.Fragment key={specialInstruction.checklist_id}>
                  {specialInstruction.task_id == task.taskId && (
                    <a
                      href="#"
                      data-toggle="modal"
                      data-target="#special-instructions-taskid"
                      className={`nolink show-specialinstruction-icon show-specialinstruction-icon-${task.taskId}`}
                      onClick={() => showSpecialInstruction(task.taskId)}
                    >
                      <i
                        className="material-icons-outlined"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Special Instructions"
                      >
                        info
                      </i>
                    </a>
                  )}
                </React.Fragment>
              );
            })}

          {!!parseInt(milestoneData?.permissions.tasks.edit) && (
            <a
              href="#"
              onClick={(e) => editTaskInformation(e, task.taskId)}
              className="nolink"
            >
              <i
                className="material-icons-outlined"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit Task"
              >
                edit
              </i>
            </a>
          )}
        </div>
        <div className="task-toolbar edition-toolbar">
          <a
            href="#"
            onClick={(e) => cancelEditTaskInformation(e, task.taskId)}
            className="cancel-icon nolink"
          >
            <i
              className="material-icons-outlined"
              data-toggle="tooltip"
              data-placement="top"
              title="Cancel"
            >
              close
            </i>
          </a>

          {!!parseInt(milestoneData?.permissions.tasks.delete) && !newTask && (
            <a
              href="#"
              onClick={(e) => deleteEditTaskInformation(e)}
              className="nolink"
            >
              <i
                className="material-icons-outlined"
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
              >
                delete
              </i>
            </a>
          )}

          <a
            href="#"
            onClick={(e) => {
              newTask
                ? saveTaskInformation(e, 0, true)
                : saveTaskInformation(e, task.taskId, false);
            }}
            className="save-icon nolink"
          >
            <i
              className="material-icons-outlined"
              data-toggle="tooltip"
              data-placement="top"
              title={newTask ? "New task" : "Update"}
            >
              save
            </i>
          </a>
        </div>
      </div>
      {!!parseInt(milestoneData?.permissions.tasks.edit) && !newTask && (
        <div {...dragHandleProps} className="dragger-column">
          <i className="material-icons-outlined">drag_indicator</i>
        </div>
      )}
      {/* Start Edit task */}
      <div
        className={
          (taskEditing && taskId === task.taskId) || newTask
            ? "taskattibutes-col"
            : "taskattibutes-col task-edit-panel"
        }
      >
        {/* Task Attributes */}
        <div className="task-attribute-col">
          <div className="task-label">Task Attributes</div>
          <div className="task-checkboxes">
            <label
              htmlFor={`taskSkip-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskSkip-${task.taskId}`}
                name="taskSkip"
                value={task?.taskSkip ? task.taskSkip : ""}
                defaultChecked={task.taskSkip == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Skip</span>
            </label>

            <label
              htmlFor={`taskEngine-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskEngine-${task.taskId}`}
                name="taskEngine"
                value={task?.taskEngine ? task?.taskEngine : ""}
                defaultChecked={task.taskEngine == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Engine Process</span>
            </label>

            <label
              htmlFor={`taskXMLUpload-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskXMLUpload-${task.taskId}`}
                name="taskXMLUpload"
                value={task?.taskXMLUpload ? task.taskXMLUpload : ""}
                defaultChecked={task.taskXMLUpload == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">XML Upload</span>
            </label>
            <label
              htmlFor={`taskEditProcess-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskEditProcess-${task.taskId}`}
                name="taskEditProcess"
                value={task?.taskEditProcess ? task?.taskEditProcess : ""}
                defaultChecked={task.taskEditProcess == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Edit Process</span>
            </label>
            <label
              htmlFor={`taskLayout-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskLayout-${task.taskId}`}
                name="taskLayout"
                value={task?.taskLayout ? task.taskLayout : ""}
                defaultChecked={task.taskLayout == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Layout</span>
            </label>
            <label
              htmlFor={`taskStyleEditing-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskStyleEditing-${task.taskId}`}
                name="taskStyleEditing"
                value={task?.taskStyleEditing ? task.taskStyleEditing : ""}
                defaultChecked={task.taskStyleEditing == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Style Editing</span>
            </label>
            <label
              htmlFor={`taskeProducts-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskeProducts-${task.taskId}`}
                name="taskeProducts"
                value={task?.taskeProducts ? task.taskeProducts : ""}
                defaultChecked={task.taskeProducts == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">eProducts</span>
            </label>
            <label
              htmlFor={`taskFinal-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskFinal-${task.taskId}`}
                name="taskFinal"
                value={task.taskFinal ? task.taskFinal : ""}
                defaultChecked={task.taskFinal == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Final</span>
            </label>

            <label
              htmlFor={`taskBookEnd-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskBookEnd-${task.taskId}`}
                name="taskBookEnd"
                value={task?.taskBookEnd ? task.taskBookEnd : ""}
                defaultChecked={task.taskBookEnd == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Task Bookend</span>
            </label>
            <label
              id={`taskpre_editing-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskpre_editing-${task.taskId}`}
                name="taskpre_editing"
                value={task?.taskpre_editing ? task.taskpre_editing : ""}
                defaultChecked={task.taskpre_editing == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Pre-editing</span>
            </label>
            <label
              htmlFor={`taskQuality-${task.taskId}`}
              className="task-material-checkbox mr-4"
            >
              <input
                type="checkbox"
                className={`task-edit-${task.taskId}`}
                id={`taskQuality-${task.taskId}`}
                name="taskQuality"
                value={task?.taskQuality ? task.taskQuality : ""}
                defaultChecked={task.taskQuality == 1}
                onChange={(e) => handleOnChange(e, taskId)}
              />
              <span className="checkmark">Quality</span>
            </label>
          </div>
        </div>

        {/* Task type */}
        <div className="task-type-col mt-3">
          <div className="task-label">Task Type</div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="1"
              id={`internal-${task.taskId}`}
              name={`taskType-${task.taskId}`}
              defaultChecked={task.statusType == 1 ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId)}
            />
            <label
              className="custom-control-label"
              htmlFor={`internal-${task.taskId}`}
            >
              Internal
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="2"
              id={`external-${task.taskId}`}
              name={`taskType-${task.taskId}`}
              defaultChecked={task.statusType == 2 ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId)}
            />
            <label
              className="custom-control-label"
              htmlFor={`external-${task.taskId}`}
            >
              External
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="3"
              id={`pm-${task.taskId}`}
              name={`taskType-${task.taskId}`}
              defaultChecked={task.statusType == 3 ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId)}
            />
            <label
              className="custom-control-label"
              htmlFor={`pm-${task.taskId}`}
            >
              PM
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="0"
              id={`both-${task.taskId}`}
              name={`taskType-${task.taskId}`}
              defaultChecked={task.statusType == 0 ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId)}
            />
            <label
              className="custom-control-label"
              htmlFor={`both-${task.taskId}`}
            >
              Both
            </label>
          </div>
          <div className="is-invalid-text taskType-error hide">
            Please select Task Type
          </div>
        </div>

        {/* Task Complexity */}
        <div className="task-complexity-col mt-3">
          <div className="task-label" style={{ width: `${100}%` }}>
            Task Complexity
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="1"
              id={`simple-${task.taskId}`}
              name={`taskComplexity-${task.taskId}`}
              defaultChecked={task.taskComplex == "Simple" ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId, "Simple")}
            />
            <label
              className="custom-control-label"
              htmlFor={`simple-${task.taskId}`}
            >
              Simple
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="2"
              id={`medium-${task.taskId}`}
              name={`taskComplexity-${task.taskId}`}
              defaultChecked={task.taskComplex == "Medium" ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId, "Medium")}
            />
            <label
              className="custom-control-label"
              htmlFor={`medium-${task.taskId}`}
            >
              Medium
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="3"
              id={`complex-${task.taskId}`}
              name={`taskComplexity-${task.taskId}`}
              defaultChecked={task.taskComplex == "Complex" ? "checked" : ""}
              onChange={(e) => handleOnChange(e, task.taskId, "Complex")}
            />
            <label
              className="custom-control-label"
              htmlFor={`complex-${task.taskId}`}
            >
              Complex
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="4"
              id={`super-${task.taskId}`}
              name={`taskComplexity-${task.taskId}`}
              defaultChecked={
                task.taskComplex == "Super Complex" ? "checked" : ""
              }
              onChange={(e) => handleOnChange(e, task.taskId, "Super Complex")}
            />
            <label
              className="custom-control-label"
              htmlFor={`super-${task.taskId}`}
            >
              Super Complex
            </label>
          </div>
        </div>
        <div className="is-invalid-text taskType-error hide">
          Please select Task Complexity
        </div>

        {!!parseInt(milestoneData?.permissions.tasks.users.view) &&
          !newTask &&
          taskEditing &&
          taskId == task.taskId && (
            <div className="wrap-field-label mt-2">
              <label className="task-label">Task Members</label>
              <div className="content-select">
                {/* The data attributes are used to pass the info in to the React Component */}

                <div
                  className="member-management"
                  id="member-management"
                  data-level="task"
                >
                  <ListUsersWrapper
                    currentuserid={task.user.id}
                    taskid={task.taskId}
                    projectid={task.projectId}
                    projectclient={milestoneData?.projectClient}
                    companyid={milestoneData?.companyId}
                    realcompanyid={milestoneData?.realCompanyId}
                    permissions={{
                      delete: milestoneData?.permissions.tasks.users.delete,
                      add: milestoneData?.permissions.tasks.users.add,
                      invite: milestoneData?.permissions.tasks.users.invite,
                    }}
                    getMilestoneData={(_taskId) =>
                      getMilestoneData(data.milestoneId, _taskId)
                    }
                  />
                </div>

                <div
                  className={`member-modal-${task.taskId}`}
                  data-taskid={task.taskId}
                />
              </div>
            </div>
          )}
      </div>
      <ModalForm show={pdfModal}>
        <div className="general-forms" id="edit-special-instructions">
          <div className="modal-header">
            <h5 className="modal-title">Digital Bundle Process</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={(e) => setPdfModal(false)}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="modal-body">
            <div className="flex">
              <div className="singular-block-information file-download">
                <div>
                  {finalXml === 100 && (
                    <i
                      className="material-icons-outlined zipfile-download zipfile-enable"
                      onClick={(e) => fileDownload(1)}
                    >
                      download
                    </i>
                  )}
                  {finalXml !== 100 && (
                    <i className="material-icons-outlined zipfile-download zipfile-disable">
                      download
                    </i>
                  )}
                </div>
                <div className="w-100">
                  <label>Final XML Generation</label>
                  <div className="project-card-details w-100">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{finalXml}% completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${finalXml}%` }}
                          aria-valuenow={`${finalXml}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="singular-block-information file-download">
                <div>
                  {filePack === 100 && (
                    <i
                      className="material-icons-outlined zipfile-download zipfile-enable"
                      onClick={(e) => fileDownload(2)}
                    >
                      download
                    </i>
                  )}
                  {filePack !== 100 && (
                    <i className="material-icons-outlined zipfile-download zipfile-disable">
                      download
                    </i>
                  )}
                </div>
                <div className="w-100">
                  <label>Application Files Package</label>
                  <div className="project-card-details w-100">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{filePack}% completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${filePack}%` }}
                          aria-valuenow={`${filePack}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="singular-block-information file-download">
                <div>
                  {imgPack === 100 && (
                    <i
                      className="material-icons-outlined zipfile-download zipfile-enable"
                      onClick={(e) => fileDownload(3)}
                    >
                      download
                    </i>
                  )}
                  {imgPack !== 100 && (
                    <i className="material-icons-outlined zipfile-download zipfile-disable">
                      download
                    </i>
                  )}
                </div>
                <div className="w-100">
                  <label>Image Package</label>
                  <div className="project-card-details w-100">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{imgPack}% completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${imgPack}%` }}
                          aria-valuenow={`${imgPack}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="singular-block-information file-download">
                <div>
                  {eBook === 100 && (
                    <i
                      className="material-icons-outlined zipfile-download zipfile-enable"
                      onClick={(e) => fileDownload(4)}
                    >
                      download
                    </i>
                  )}
                  {eBook !== 100 && (
                    <i className="material-icons-outlined zipfile-download zipfile-disable">
                      download
                    </i>
                  )}
                </div>
                <div className="w-100">
                  <label>eBook Generation</label>
                  <div className="project-card-details w-100">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{eBook}% completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${eBook}%` }}
                          aria-valuenow={`${eBook}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalForm>
      <ModalForm show={downloadModal} className="download-modal">
        <div className="general-forms">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={(e) => setDownloadModal(false)}
            >
              <i className="material-icons">close</i>
            </button>
          </div>
          <div className="modal-body">
            <div className="flex">
              <div className="singular-block-information file-download">
                <div>
                  {downloadCount === 100 && (
                    <i
                      className="material-icons-outlined zipfile-download zipfile-enable"
                      onClick={(e) => fileDownload(5)}
                    >
                      download
                    </i>
                  )}
                  {downloadCount !== 100 && (
                    <i className="material-icons-outlined zipfile-download zipfile-disable">
                      download
                    </i>
                  )}
                </div>
                <div className="w-100">
                  <label>{text}</label>
                  <div className="project-card-details w-100">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{downloadCount}% completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${downloadCount}%` }}
                          aria-valuenow={`${downloadCount}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalForm>
    </>
  );
}
