import { useState, useEffect } from "react";
import TaskMembersPreviewSingle from "./taskMembersPreviewSingle";

export default function TaskMembersPreview({
  taskMemberListProps,
  taskid,
  newtask,
}) {
  const [taskMemberList, setTaskMemberList] = useState(
    taskMemberListProps != "" ? taskMemberListProps : [],
  );
  const [taskId, setTaskId] = useState(taskid);
  const [remainingTaskMembers, setRemainingTaskMembers] = useState(0);
  const [otherWord, setOtherWord] = useState("others");

  useEffect(() => {
    // This is to grab all users in this task using the taskid that was passed in.
    if (taskId) {
      getTaskMemberList(taskId);
    }

    const membersQty = taskMemberList.length - 4;
    setRemainingTaskMembers(membersQty);
    if (membersQty === 1) {
      setOtherWord("other");
    }

    return () => {
      setTaskId(0); // This worked for me
    };
  }, []);

  useEffect(() => {
    // it means the taskMembers list was updated
    if (taskMemberListProps != "") {
      getTaskMemberList(taskId);
    }
  }, [taskMemberListProps]);

  const getTaskMemberList = async (_taskId) => {
    const _taskMemberList = await fetch(`/call/task/${_taskId}/users`)
      .then((res) => res.json())
      .then(
        (result) => result,
        (error) => {
          // Todo: How are we going to show the errors
          console.log(error);
          return [];
        },
      );

    setTaskMemberList(_taskMemberList);
    // add this taskMemberList to state so we can use it on the render
  };

  const triggerModal = (e) => {
    e.preventDefault();
    // We want to add a User Management modal to this in the future.
  };

  return (
    <button className="task-members" onClick={(e) => triggerModal(e)}>
      {
        // Only for new Tasks
        newtask && (
          <div
            className="empty"
            title="To Add Users, please create the task first"
            data-original-title="To Add Users, please create the task first"
            data-toggle="tooltip"
            data-placement="top"
          />
        )
      }

      {/* // No Task Members on Task */}
      {taskMemberList.length === 0 && !newtask ? (
        <div
          className="empty"
          title="No users assigned to this task"
          data-original-title="No users assigned to this task"
          data-toggle="tooltip"
          data-placement="top"
        />
      ) : (
        ""
      )}

      {/* // If 5 or LESS Task Members on Task */}
      {taskMemberList.length <= 5 &&
        taskMemberList.map((user, index) => {
          if (index < 5) {
            return (
              <TaskMembersPreviewSingle
                key={index}
                id={user.id}
                avatar={user.avatar}
                name={user.name}
                lastname={user.lastname}
              />
            );
          }
        })}

      {/* // If MORE then 5 Task Members on Task */}
      {taskMemberList.length > 5 &&
        taskMemberList.map((user, index) => {
          if (index < 4) {
            return (
              <TaskMembersPreviewSingle
                key={index}
                id={user.id}
                avatar={user.avatar}
                name={user.name}
                lastname={user.lastname}
              />
            );
          }
          if (index === 5) {
            return (
              <TaskMembersPreviewSingle
                // className="overflow_item"
                // + 1 other
                // + 2 others
                key={index}
                overflow
                avatar={user.avatar}
                name={`+ ${remainingTaskMembers}`}
                lastname={otherWord}
              />
            );
          }
        })}
    </button>
  );
}
