import { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import { Tooltip } from "../../../../components/tooltip/tooltip";

function useWindowSize() {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export function ArticlesTab({ permissions, navTag, articles, project }) {
  const handleTooltip = (e) => {
    const tooltip = document.getElementById("tooltip-black");
    if (e.type === "mouseenter") {
      const title = "Complete";
      tooltip.style.display = "block";
      document.getElementById("tooltip-title-black").textContent = "";
      document.getElementById("tooltip-title-black").textContent += title;

      createPopper(e.target, tooltip, {
        placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 6],
            },
          },
        ],
      });
    } else {
      tooltip.style.display = "none";
    }
  };

  return (
    parseInt(permissions?.journals?.articles?.view) && (
      <div
        className={
          navTag === "Articles"
            ? "article-list body-tab-content active"
            : "article-list body-tab-content"
        }
      >
        <table className="table table-striped table-borderless table-oversize article-list-table">
          <thead>
            <tr>
              <th className="lanstad-grey ws" />
              <th className="lanstad-grey ws">Article ID</th>
              <th className="lanstad-grey ws th-full">Article Name</th>
              <th className="lanstad-grey ws">DOI</th>
              <th className="lanstad-grey ws">Cor. Author</th>
              <th className="lanstad-grey ws">Received date</th>
              <th className="lanstad-grey ws">Target date</th>
              {!!parseInt(permissions?.journals?.article_status) &&
                articles?.some(
                  (item) => parseInt(item.articleStatus) !== 0,
                ) && <th className="lanstad-grey ws">Status</th>}
              <th className="lanstad-grey ws">Stage</th>
              <th className="lanstad-grey ws">Percentage</th>
              <th className="lanstad-grey" />
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <tr className="taskRow-journal-overview" key={article.chapterID}>
                {/* we need to define the status names/colors */}
                <td className="m-color-col">
                  <div
                    onMouseEnter={(e) => handleTooltip(e)}
                    onMouseLeave={(e) => handleTooltip(e)}
                    className={`circle-status status-1 ${article.chapterNo}`}
                  />
                </td>
                <td className="ws">{article.chapterNo}</td>
                <td>
                  {article.chapterTitle?.length > 140 &&
                  useWindowSize() <= 1464 ? (
                    <Tooltip
                      direction="bottom-title-large"
                      content={article.chapterTitle}
                    >
                      <Link
                        to={`/project/journal/${project.projectId}/detail/${article.chapterID}`}
                        className="no-style short-text-3"
                      >
                        {article.chapterTitle}
                      </Link>
                    </Tooltip>
                  ) : (
                    <Link
                      to={`/project/journal/${project.projectId}/detail/${article.chapterID}`}
                      className="no-style short-text-3"
                    >
                      {article.chapterTitle}
                    </Link>
                  )}
                </td>
                <td className="ws">{article.doi}</td>
                <td>{article.author}</td>
                <td className="ws">{article.startDate.slice(0, 10)}</td>
                <td className="ws">{article.endDate.slice(0, 10)}</td>
                {!!parseInt(permissions?.journals?.article_status) &&
                  article.articleStatus !== 0 && (
                    <td className="ws">
                      {article?.articleStatus === "Overdue" && (
                        <div className="article-status-dot">
                          <span className="material-icons dot red-dot">
                            {" "}
                            fiber_manual_record
                          </span>{" "}
                          Overdue
                        </div>
                      )}
                      {article?.articleStatus === "Ready for review" && (
                        <div className="article-status-dot">
                          <span className="material-icons dot green-dot">
                            {" "}
                            fiber_manual_record
                          </span>{" "}
                          Ready for review
                        </div>
                      )}
                      {article?.articleStatus === "No articles ready" && (
                        <div className="article-status-dot">
                          <span className="material-icons dot gray-dot">
                            {" "}
                            fiber_manual_record
                          </span>{" "}
                          No articles ready
                        </div>
                      )}
                    </td>
                  )}
                <td className="ws">
                  {article.stage?.length > 18 ? (
                    <Tooltip direction="bottom" content={article.stage}>
                      <p className="short-text">{article.stage}</p>
                    </Tooltip>
                  ) : (
                    <p className="short-text">{article.stage}</p>
                  )}
                </td>

                <td className="ws">
                  <div className="project-card-details min-width">
                    <div className="progress-status">
                      <div className="label-bar-status">
                        <label>{article.percentage} Completed</label>
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: article.percentage }}
                          aria-valuenow={`${article.percentage}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="open-default-link">
                  <a
                    href={`/project/journal/${project.projectId}/detail/${article.chapterID}`}
                  >
                    <i className="material-icons">open_in_new</i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}
