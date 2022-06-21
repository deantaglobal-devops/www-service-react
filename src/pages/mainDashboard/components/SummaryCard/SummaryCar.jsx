export function SummaryCard({
  title,
  projects,
  type,
  milestones,
  tasks,
  permissions,
  buttonLabel,
  calendar,
  handleOnClickButton,
}) {
  return (
    <div className="dashboard-box">
      <div className="d-flex">
        <h6 className="dashboard-box-head-line">{title}</h6>
      </div>
      {type !== "calendar" ? (
        <div className="d-flex dashboard-box-body dashboard-box-innerbody">
          <table cellSpacing="5" cellPadding="5" border="0" width="100%">
            <tbody>
              <tr>
                <td width="10%" align="right">
                  <span className="dashboard-box-number">{projects}</span>
                </td>
                <td align="left">
                  <span className="dashboard-box-legend">
                    {type === "book" ? "Books" : "Journals"}
                  </span>
                </td>
              </tr>
              {permissions?.milestones?.view && (
                <tr>
                  <td align="right">
                    <span className="dashboard-box-number">{milestones}</span>
                  </td>
                  <td align="left">
                    <span className="dashboard-box-legend">Milestones</span>
                  </td>
                </tr>
              )}

              {permissions?.tasks?.view && (
                <tr>
                  <td align="right">
                    <span className="dashboard-box-number">{tasks}</span>
                  </td>
                  <td align="left">
                    <span className="dashboard-box-legend">Tasks</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dashboard-box-body dashboard-box-innerbody">
          {calendar ? (
            calendar?.map((date) => (
              <div className="dashboard-box-calendar-item" key={date.id}>
                <p className="wrap-names">{date.title}</p>
              </div>
            ))
          ) : (
            <p>No tasks today!</p>
          )}
        </div>
      )}

      <div className="d-flex dashboard-box-body">
        <button
          type="button"
          className="btn dashboard-box-button"
          onClick={(e) => {
            handleOnClickButton(e, type);
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
