function ListMilestones({
  crumbUpdate,
  setStep,
  setSelectMilestone,
  ...props
}) {
  const { project, permissions } = props.props;

  return (
    <table className="table table-striped table-borderless table-oversize assets-list-table stages milestone-asset">
      <thead>
        <tr>
          <th>Milestones</th>
          <th>Kind</th>
          <th>Modified</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {project?.milestones.map((milestone, index) => (
          <tr
            key={milestone.id + index + 3}
            onClick={() => {
              setSelectMilestone(milestone.id);
              setStep(2);
              crumbUpdate(1, milestone.milestoneTitle);
            }}
          >
            <td className="navigation-area">
              <img src="/assets/icons/folder.svg" className="icon-line" />
              {milestone.milestoneTitle}
            </td>
            <td>Folder</td>
            <td>{milestone.taskStart.value}</td>
            {!!parseInt(permissions.assets.download) && (
              <td>
                <a href="#" title="Download all">
                  <i className="material-icons-outlined">save_alt</i>
                </a>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ListMilestones;
