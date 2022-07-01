function ListTasks({
  selectMilestone,
  setSelectTask,
  crumbUpdate,
  setStep,
  ...props
}) {
  const { project, permissions } = props.props;

  return (
    <>
      {project?.milestones
        .filter((id) => id.id === selectMilestone)
        .map((milestone, index) => (
          <table
            className={`table table-striped table-borderless table-oversize assets-list-table stages table-milestone-${milestone.id}`}
            key={milestone.id + index + 0}
          >
            <thead>
              <tr>
                <th>Tasks</th>
                <th>Kind</th>
                <th>Modified</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {milestone.tasks.map((task, index) => (
                <tr
                  data-name={task.taskName}
                  data-level="task"
                  data-task={task.taskId}
                  key={task.taskId + index + 1}
                  onClick={() => {
                    setStep(3);
                    setSelectTask(task.taskId);
                    crumbUpdate(2, task.taskName);
                  }}
                >
                  <td className="navigation-area">
                    <img src="/assets/icons/folder.svg" className="icon-line" />
                    {task.taskName}
                  </td>
                  <td>Folder</td>
                  <td>{task.taskStart.value}</td>
                  {!!parseInt(permissions.assets.download) && (
                    <td>
                      <a
                        href="#"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Download all"
                      >
                        <i className="material-icons-outlined">save_alt</i>
                      </a>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </>
  );
}

export default ListTasks;
