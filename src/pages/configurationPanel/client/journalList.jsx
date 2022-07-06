import React from "react";
import "./styles/client.styles.css";

class JournalList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFlip = this.toggleFlip.bind(this);
  }

  toggleFlip(id) {
    const flipCard = document.getElementById(`flip-card-container-${id}`);
    if (flipCard) {
      flipCard.classList.toggle("flipped");
    }
  }

  render() {
    const { project } = this.props;
    const projectPercentage = `${project.percent}%`;
    return (
      <div className="project-box-configuration-panel mb15 project-box">
        <div
          className="flip-card-container"
          id={`flip-card-container-${project.id}`}
        >
          <div className="flip-card">
            <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-front">
              <div className="card-body p-0">
                <div className="row mt-4 pb-0">
                  <div className="col-sm-12 col-lg-3 pr-0">
                    <a
                      href={`/project/${project.id}`}
                      className="project-thumb-list-wrapper"
                    >
                      <img
                        src={`/file/src/?path=/epublishing/books/${project.projectImage}&storage=blob`}
                        className="project-thumb-list"
                      />
                    </a>
                  </div>
                  <div className="col-lg-9">
                    <div className="project-card-details">
                      <h3>
                        <a href={`/project/${project.id}`}>{project.name}</a>
                      </h3>
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-0">
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
                        style={{ width: projectPercentage }}
                        role="progressbar"
                        aria-valuenow={project.percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                  <div className="actions-available">
                    <a
                      className="flip-card-toogle action-bottom pr-2"
                      onClick={() => this.toggleFlip(project.id)}
                    >
                      <i className="material-icons">flip</i> Flip
                    </a>
                    <a
                      className="action-bottom"
                      href={`/project/${project.id}`}
                    >
                      <i className="material-icons">open_in_new</i> Open
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-back">
              <div className="card-body p-0">
                <div className="row mt-4">
                  <div className="col-lg-12">
                    <div className="project-card-details">
                      <h3>Project Status</h3>
                      {project.milestoneList &&
                        project.milestoneList.length > 0 &&
                        project.milestoneList.map((milestone) => {
                          <div className="progress-status mb-2">
                            <div className="label-bar-status">
                              <label>
                                {milestone.milestoneTitle} —{" "}
                                {milestone.percentage}% Completed — End Date:
                                11-05-2020
                              </label>
                            </div>
                            <div className="progress progress-sm">
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: milestone.percentage }}
                                role="progressbar"
                                aria-valuenow={milestone.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                          </div>;
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer p-0">
                <div className="actions-available">
                  <a
                    className="flip-card-toogle action-bottom pr-2 active"
                    onClick={() => this.toggleFlip(project.id)}
                  >
                    <i className="material-icons">flip</i> Flip
                  </a>
                  <a className="action-bottom" href={`/project/${project.id}`}>
                    <i className="material-icons">open_in_new</i> Open
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JournalList;
