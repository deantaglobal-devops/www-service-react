import { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import AddEditTask from "../../addEditTask/addEditTask";

export function DropComponent({
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

  console.log("22222heree on milestone datails - taskEditing", taskEditing);

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
