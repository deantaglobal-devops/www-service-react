import { useState } from "react";
import { Link } from "react-router-dom";

import "./styles/dashboardCard.styles.css";

export default function DashboardCard({
  project,
  permissions,
  handleHover,
  cardHovered,
  isBook,
  userId,
}) {
  const [flip, setFlip] = useState(false);

  const handleFlip = () => setFlip(!flip);

  const _handleHover = (id, status) => handleHover(id, status);

  let articleStatus = project?.status;
  let readyArticle = 0;
  let overdueArticle = 0;
  let showStatus = false;
  if (!!articleStatus && articleStatus.length > 0) {
    showStatus = true;
    articleStatus = articleStatus[0];
    readyArticle = articleStatus.article_ready;
    overdueArticle = articleStatus.article_overdue;
  }

  return (
    <div
      className={
        cardHovered === project.id || cardHovered === 0
          ? "col-sm-4 col-lg-4 mb15 project-box"
          : "col-sm-4 col-lg-4 mb15 project-box off"
      }
      key={project.id}
      onMouseEnter={() => _handleHover(project.id, "enter")}
      onMouseLeave={() => _handleHover(project.id, "leave")}
    >
      {/* flip-card-container */}
      <div
        className={flip ? "flip-card-container flipped" : "flip-card-container"}
        id={`flip-card-container-${project.id}`}
      >
        {/* flip-card */}
        <div className="flip-card">
          <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-front">
            <div className="card-body p-0">
              <div className="card-content">
                <div className="col-sm-12 col-lg-3 pr-0">
                  <Link
                    to={
                      isBook
                        ? `/project/${project.id}`
                        : `/project/journal/list/${project.id}`
                    }
                    className="project-thumb-list-wrapper"
                  >
                    {project.projectImage != "" && userId !== 15331 ? (
                      <img
                        src={`${
                          import.meta.env.VITE_URL_API_SERVICE
                        }/file/src/?path=/epublishing/books/${
                          project.projectImage
                        }&storage=blob`}
                        className="project-thumb-list"
                        alt="project"
                      />
                    ) : (
                      // remove it after demo
                      <img
                        alt="project"
                        src={project.projectImage}
                        className="project-thumb-list"
                      />
                    )}
                  </Link>
                </div>
                <div className="col-lg-9">
                  <div className="project-card-details">
                    <h3>
                      <Link
                        to={
                          isBook
                            ? `/project/${project.id}`
                            : `/project/journal/list/${project.id}`
                        }
                      >
                        {project.title}
                      </Link>
                    </h3>
                    {isBook ? (
                      <div className="flex-list-blocks">
                        <div className="list-info-singular">
                          <label>PROJECT CODE</label>
                          <p>{project.bookcode}</p>
                        </div>
                        <div className="list-info-singular">
                          <label>PRODUCTION EDITOR</label>
                          <p>{project.productionEditor}</p>
                        </div>
                        <div className="list-info-singular">
                          <label>ISBN</label>
                          <p>{project.isbn}</p>
                        </div>
                        <div className="list-info-singular">
                          <label>PROJECT MANAGER</label>
                          <p>{project.projectManager}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-list-blocks">
                        <div className="list-info-singular">
                          <label>PROJECT MANAGER</label>
                          <p>{project.projectManager}</p>
                        </div>
                        <div className="list-info-singular">
                          <label>PRODUCTION EDITOR</label>
                          <p>{project.productionEditor}</p>
                        </div>
                        <div className="list-info-singular">
                          <label>CLIENT NAME</label>
                          <p>{project.client}</p>
                        </div>
                        {!!parseInt(permissions?.journals?.article_status) && (
                          <div className="list-info-singular">
                            <label>STATUS</label>
                            <ul className="article-status">
                              {showStatus && (
                                <>
                                  <li>
                                    <span className="material-icons dot green-dot">
                                      fiber_manual_record
                                    </span>{" "}
                                    {readyArticle} Articles Ready
                                  </li>
                                  <li>
                                    <span className="material-icons dot red-dot">
                                      fiber_manual_record
                                    </span>{" "}
                                    {overdueArticle} article Overdue
                                  </li>
                                </>
                              )}
                              {!showStatus && (
                                <li>
                                  <span className="material-icons dot gray-dot">
                                    fiber_manual_record
                                  </span>
                                  No articles ready
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer p-0">
              {isBook ? (
                <div className="project-card-details">
                  <div className="progress-status">
                    <div className="label-bar-status">
                      <label>
                        {project.percent}% completed — Target Date:{" "}
                        {project.endDate}
                      </label>
                    </div>
                    <div className="progress progress-sm">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${project.percent}%` }}
                        aria-valuenow={`${project.percent}`}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                  <div className="actions-available">
                    {!!parseInt(permissions?.milestones?.view) && (
                      <a
                        className="flip-card-toogle action-bottom pr-2"
                        data-id={`${project.id}`}
                        onClick={handleFlip}
                      >
                        <i className="material-icons">flip</i> Flip
                      </a>
                    )}
                    <Link
                      to={`/project/${project.id}`}
                      className="action-bottom"
                    >
                      <i className="material-icons">open_in_new</i> Open
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="actions-available">
                  {!!parseInt(permissions?.journals?.issues?.view) && (
                    <a
                      className="flip-card-toogle action-bottom pr-2"
                      data-id={`${project.id}`}
                      onClick={handleFlip}
                    >
                      <i className="material-icons">flip</i> Flip
                    </a>
                  )}
                  <Link
                    to={`/project/journal/list/${project.id}`}
                    className="action-bottom"
                  >
                    <i className="material-icons">open_in_new</i> Open
                  </Link>
                </div>
              )}
            </div>
          </div>
          {!!parseInt(permissions?.milestones?.view) && isBook && (
            <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-back">
              <div className="card-body p-0">
                <div className="row mt-4">
                  <div className="col-lg-12">
                    <div className="project-card-details">
                      <h3>Project Status</h3>
                      {project?.milestones?.map((milestone) => {
                        return (
                          <div
                            className="progress-status mb-2"
                            key={milestone.id}
                          >
                            <div className="label-bar-status">
                              <label>
                                {milestone.milestoneTitle} —{" "}
                                {milestone.percentage}% Completed — End Date:{" "}
                                {milestone.milestoneEnd}
                              </label>
                            </div>
                            <div className="progress progress-sm">
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${milestone.percentage}%` }}
                                aria-valuenow={milestone.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-0">
                <div className="actions-available">
                  <a
                    className="flip-card-toogle action-bottom pr-2 active"
                    data-id={`${project.id}`}
                    onClick={handleFlip}
                  >
                    <i className="material-icons">flip</i> Flip
                  </a>
                  <Link to={`/project/${project.id}`} className="action-bottom">
                    <i className="material-icons">open_in_new</i> Open
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!!parseInt(permissions?.journals?.issues?.view) && !isBook && (
            <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-back">
              <div className="card-body p-0">
                <div className="row mt-4">
                  <div className="col-lg-12">
                    <div className="project-card-details">
                      <h3>Issues</h3>

                      {project?.issues?.length <= 0 ? (
                        <p>No issues found.</p>
                      ) : (
                        project?.issues?.map((issue) => {
                          return (
                            <div
                              className="progress-status mb-2"
                              key={issue.issue_id}
                            >
                              <div className="label-bar-status">
                                <label>
                                  Volume {issue.volume_num}, Issue{" "}
                                  {issue.issue_num} — 85% Completed — End date:{" "}
                                  {`${new Intl.DateTimeFormat("en", {
                                    month: "short",
                                  }).format(
                                    new Date(issue.end_date),
                                  )} ${new Intl.DateTimeFormat("en", {
                                    year: "numeric",
                                  }).format(new Date(issue.end_date))}`}
                                </label>
                              </div>
                              <div className="progress progress-sm">
                                <div
                                  className="progress-bar bg-success"
                                  role="progressbar"
                                  style={{ width: "85%" }}
                                  aria-valuenow="85"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-0">
                <div className="actions-available">
                  <a
                    className="flip-card-toogle action-bottom pr-2 active"
                    data-id={`${project.id}`}
                    onClick={handleFlip}
                  >
                    <i className="material-icons">flip</i> Flip
                  </a>
                  <Link
                    to={`/project/journal/list/${project.id}`}
                    className="action-bottom"
                  >
                    <i className="material-icons">open_in_new</i> Open
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* flip-card */}
      </div>
      {/* flip-card-container */}
    </div>
  );
}
