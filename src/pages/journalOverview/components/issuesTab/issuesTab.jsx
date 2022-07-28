import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../../services/api";
import EditIssue from "./Modals/editIssue/editIssue";

import GenericCover from "../../../../assets/covers/generic.png";

export function IssuesTab(props) {
  const [issues, setIssues] = useState(props?.issues);
  // const [issuesProps, setIssuesProps] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [issueData, setIssueData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);

  const getIssue = async (issueId) => {
    const bodyRequest = {
      issueId,
    };

    await api.post("/get/issueinfo", bodyRequest).then((response) => {
      setIssueData(response.data.issue[0]);
      setOpenEditModal(true);
    });
  };

  const convertDate = (date) => {
    let today = new Date(date);

    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    today = `${dd}/${mm}/${yyyy}`;

    return today;
  };

  const closeModal = () => {
    setOpenEditModal(false);
  };

  const handleDeleteIssue = (issueId) => {
    const removeIssue = issues?.filter((issue) => issue.issue_id !== issueId);
    setIssues(removeIssue);
  };

  const updateIssue = (issueUpdated) => {
    const newIssues = issues.map((issue) => {
      if (issue.issue_id === issueUpdated.issueId) {
        const newIssue = {
          ISSN: issueUpdated?.ISSN_update,
          end_date: issueUpdated?.end_date_update,
          end_time: issueUpdated?.end_time_update,
          issue_id: issueUpdated?.issueId,
          issue_image: issueUpdated?.issue_image,
          issue_num: issueUpdated?.issue_num_update,
          project_id: issueUpdated?.project_id,
          publish_month: issueUpdated?.publish_month_update,
          receive_date: issueUpdated?.start_date_update,
          start_time: issueUpdated?.start_time_update,
          volume_num: issueUpdated?.volume_num_update,
        };
        return newIssue;
      }

      return issue;
    });

    setIssues(newIssues);
  };

  return (
    <>
      {openEditModal && (
        <EditIssue
          show={openEditModal}
          handleClose={() => closeModal()}
          issueData={issueData}
          handleDeleteIssue={(issue_id) => handleDeleteIssue(issue_id)}
          updateIssue={(issueUpdated) => updateIssue(issueUpdated)}
        />
      )}
      {props?.permissions?.journals?.issues?.view && (
        <div
          className={
            props.navTag === "Issues"
              ? "issues-list body-tab-content active"
              : "issues-list body-tab-content"
          }
        >
          <div className="row">
            <div className="issues-wrapper">
              {/* flip-card-container */}
              {issues?.map((issue) => {
                return (
                  // flip-card
                  <div className="flip-card-container" key={issue.issue_id}>
                    <div className="card card-small pl-4 pb-4 pr-4 card-rotating flip-card-front">
                      <div className="card-body p-0">
                        <div className="row mt-4 pb-0">
                          <div className="col-sm-12 col-lg-3 pr-0">
                            {issue?.issue_image ? (
                              <a href="#">
                                <img
                                  alt="project thumb"
                                  className="project-thumb-list"
                                  id={`img-${issue.issue_id}`}
                                  src={`${
                                    import.meta.env.VITE_URL_API_SERVICE
                                  }/file/src/?path=/epublishing/${
                                    props?.project?.projectId
                                  }/projectAssets/${
                                    issue?.issue_image
                                  }&storage=blob`}
                                />
                              </a>
                            ) : (
                              <a href="#">
                                <img
                                  alt="projet thumb"
                                  src={GenericCover}
                                  className="project-thumb-list"
                                />
                              </a>
                            )}
                          </div>
                          <div className="col-lg-9">
                            <div className="project-card-details">
                              <h3>
                                <a href="#">
                                  Volume {issue.volume_num}, Issue{" "}
                                  {issue.issue_num} — {issue.publish_month}
                                </a>
                              </h3>
                              <div className="flex-list-blocks">
                                <div className="list-info-singular">
                                  <label>ISSN</label>
                                  <p>{issue.ISSN}</p>
                                </div>
                                <div className="list-info-singular">
                                  <label>RECEIVED DATE</label>
                                  {/* <p>{issue.receive_date}</p> */}
                                  <p>{convertDate(issue?.receive_date)}</p>
                                </div>
                                <div className="list-info-singular">
                                  <label>TARGET DATE</label>
                                  <p>{convertDate(issue?.end_date)}</p>
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
                                85% completed — Target Date: 12/12/2020
                              </label>
                            </div>
                            <div className="progress progress-sm">
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${85}%` }}
                                aria-valuenow="85"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              />
                            </div>
                          </div>
                          <div className="actions-available">
                            {
                              // eslint-disable-next-line react/destructuring-assignment
                              props?.permissions?.journals?.articles?.edit && (
                                <Link
                                  // eslint-disable-next-line react/destructuring-assignment
                                  to={`/project/journal/list/${props?.project?.projectId}/issues/${issue.issue_id}`}
                                >
                                  Manage
                                </Link>
                              )
                            }
                            {props?.permissions?.journals?.issues?.edit && (
                              <a
                                onClick={() => getIssue(issue.issue_id)}
                                className="action-bottom"
                                // href="#"
                                data-toggle="modal"
                                data-target="#edit-issue"
                              >
                                <i className="material-icons-outlined">edit</i>{" "}
                                Edit
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
