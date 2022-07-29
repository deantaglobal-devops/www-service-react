import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { api } from "../../../../../services/api";
import "../../../styles/issues.styles.css";
import Dropdown from "../../../../../components/dropdown/dropdown";
import Input from "../../../../../components/input/input";
import { downloadFile } from "../../../../../utils/downloadFile";
import Modal from "../../../../../components/Modal/modal";

export default function manageIssue() {
  const [linkedarticleData, setLinkedarticleData] = useState({});
  const [activeBlank, setActiveBlank] = useState("");
  const [isPdf, setIsPdf] = useState("");
  const [issueNo, setIssueNo] = useState();
  const [volumeNo, setVolumeNo] = useState();
  const [chapterId, setChapterId] = useState();
  const [pageNum, setPageNum] = useState();
  const [pageNumError, setPageNumError] = useState();
  const [pdfPath, setPdfPath] = useState();
  const [unlinkData, setUnlinkData] = useState();
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);

  const { projectId, issueId } = useParams();

  const blankList = [
    {
      id: 1,
      value: "articleBlank",
      labelDropdown: "Article blank",
    },
    {
      id: 2,
      value: "issueBlank",
      labelDropdown: "Issue blank",
    },
  ];

  const issueDataJson = (data) => {
    setLinkedarticleData(data.linkedArticleList);
  };

  const getLastestIssueList = () => {
    api
      .get(`/project/journal/${projectId}/issues/${issueId}`)
      .then((response) => {
        issueDataJson(response.data);
      });
  };

  const addBlank = async (e) => {
    const selectedBlank = e?.currentTarget?.dataset?.value;
    const selectedVal = selectedBlank === "articleBlank" ? "article" : "issue";
    const bodyRequest = {
      issueId,
      projectId,
    };
    setActiveBlank(e?.currentTarget?.textContent);
    await api
      .post(`/journal/${selectedVal}/blank`, bodyRequest)
      .then((response) => {
        const newResponse = {
          issuesList: response.data,
          projectId,
          issueId,
        };
        issueDataJson(newResponse.issuesList);
      });
  };

  const handleGeneratePdf = () => {
    const bodyRequest = {
      projectId,
      issueId,
      chapterId,
      volumeNo,
      issueNo,
    };
    api.post("/issue/indesign/insert", bodyRequest).then(() => {
      setIsPdf("IN-PROGRESS");
    });
  };

  const handleDownloadPdf = () => {
    downloadFile(pdfPath);
  };

  const updateStartPage = () => {
    if (pageNum !== "") {
      const bodyRequest = {
        projectId,
        issueId,
        chapterId,
        startpage: pageNum,
      };

      api.post("/issue/pagination", bodyRequest).then((response) => {
        const newResponse = {
          issuesList: response?.data,
          projectId,
          issueId,
        };

        issueDataJson(newResponse.issuesList);
      });
    } else {
      setPageNumError("startpageError");
    }
  };

  const deleteBlank = (e, data) => {
    const bodyRequest = {
      id: data,
    };
    api.put("/delete/issue/blank", bodyRequest).then((response) => {
      if (response.data[0].status === "success") {
        getLastestIssueList();
      }
    });
  };

  const getStartPage = (e) => {
    const pageNum = e.target.value;
    let pageNumError = "startpageError";
    if (pageNum !== "") {
      pageNumError = "";
    }
    setPageNum(pageNum);
    setPageNumError(pageNumError);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      linkedarticleData,
      result.source.index,
      result.destination.index,
    );
    setLinkedarticleData(items);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
  });

  const linkUpdate = (articleId, action) => {
    const bodyRequest = {
      projectId,
      issueId,
      articleId,
      action,
    };
    api.post("/project/issue/linkarticle", bodyRequest).then((response) => {
      issueDataJson(response.data);
      setUnlinkData(response?.data?.unlinkedArticleList);
      setChapterId(response?.data?.linkedArticleList[0]?.chapterID);
    });
  };

  const handleUnlink = (articleId) => {
    linkUpdate(articleId, "delete");
  };

  const handleLinkArticle = (articleId) => {
    linkUpdate(articleId, "add");
  };

  const openLinkModal = () => {
    const isShow = !openModalConfirmation;
    setOpenModalConfirmation(isShow);
  };

  const closeModal = () => {
    setOpenModalConfirmation(false);
  };

  useEffect(() => {
    const issuesData = api.get(`/project/journal/${projectId}/issues`);
    const manageIssueList = api.get(
      `/project/journal/${projectId}/issues/${issueId}`,
    );
    Promise.all([issuesData, manageIssueList])
      .then((response) => {
        const issueList = response[0].data.issues;
        const selectedIssueData = issueList.filter(
          (data) => data.issue_id === issueId,
        );
        const volumeNo = selectedIssueData[0].volume_num;
        const issueNo = selectedIssueData[0].issue_num;
        setVolumeNo(volumeNo);
        setIssueNo(issueNo);
        setChapterId(response[1].data?.linkedArticleList[0]?.chapterID);
        setIsPdf(response[1].data?.issuePdfStatus?.message);
        setPdfPath(response[1].data?.issuePdfStatus?.pdf_path);
        const newData = {
          issuesList: response[1].data,
          projectId,
          issueId,
          volumeNo,
          issueNo,
        };
        issueDataJson(newData.issuesList);
        setUnlinkData(response[1].data?.unlinkedArticleList);
      })
      .catch();
  }, []);

  return (
    <>
      <div className="col-1 float-left blank-list">
        <Input
          label="Update start page"
          className={pageNumError}
          value={pageNum}
          handleOnChange={(e) => getStartPage(e)}
          maxLength="10"
        />
      </div>
      <button
        type="button"
        className="btn btn-outline-primary mr-2 py-1 px-2"
        onClick={updateStartPage}
      >
        <i className="material-icons-outlined" style={{ fontSize: "20px" }}>
          autorenew
        </i>
      </button>
      {isPdf === "NOT-STARTED" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
          onClick={handleGeneratePdf}
        >
          Generate PDF
        </button>
      )}
      {isPdf === "COMPLETED" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
          onClick={handleDownloadPdf}
        >
          Download PDF
        </button>
      )}
      {isPdf === "IN-PROGRESS" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
        >
          Generating...
        </button>
      )}
      <button
        type="button"
        className="float-right remove-btn-style"
        onClick={handleGeneratePdf}
      >
        <i
          className="material-icons-outlined float-right regenerate-pdf-btn"
          // onClick={handleGeneratePdf}
        >
          autorenew
        </i>
      </button>
      <button
        type="button"
        className="btn btn-outline-primary mr-2 float-right cstm-link-btn"
        onClick={openLinkModal}
      >
        <i className="material-icons-outlined cstm-link-icon">link</i> Link
        Article
      </button>
      <div className="col-2 float-right blank-list">
        <Dropdown
          label="Add Blank"
          name="projectManager"
          value={activeBlank}
          valuesDropdown={blankList}
          handleOnChange={(e) => addBlank(e)}
          iconName="keyboard_arrow_down"
          iconClassName="material-icons"
        />
      </div>
      <table className="table table-striped table-borderless table-oversize article-list-table">
        <thead>
          <tr>
            <th> </th>
            <th className="lanstad-grey ws">Article ID</th>
            <th className="lanstad-grey ws">Article Name</th>
            <th className="lanstad-grey ws">DOI</th>
            <th className="lanstad-grey ws">Author</th>
            <th className="lanstad-grey ws">
              Completed <br />
              Pages
            </th>
            <th className="lanstad-grey ws">
              Start <br />
              Page
            </th>
            <th className="lanstad-grey ws">
              End <br />
              Page
            </th>
            <th> </th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="column-1">
            {(provided, snapshot) => (
              <tbody
                className="row_drag"
                ref={provided.innerRef}
                {...provided.droppableProps}
                isdraggingover={snapshot.isDraggingOver.toString()}
                key="column-1"
              >
                {linkedarticleData.length > 0 ? (
                  Array.from(linkedarticleData).map((article, index) => (
                    // const url = `/project/journal/${projectId}/detail/${article.chapterID}`;
                    <>
                      <Draggable
                        draggableId={`drag-${index}`}
                        index={index}
                        key={`key-${index}`}
                      >
                        {(provided, snapshot) => (
                          <tr
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            isdragging={snapshot.isDragging.toString()}
                            className="issue-row"
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <td>
                              <i
                                {...provided.dragHandleProps}
                                className="toc-dragger material-icons-outlined"
                              >
                                drag_indicator
                              </i>
                            </td>
                            <td>{article.articleId}</td>
                            <td>
                              {/* <Link to={url} rel="noreferrer" className="no-style"> */}
                              {article.chapterTitle}
                              {/* </Link> */}
                            </td>
                            <td className="ws">{article.doi}</td>
                            <td>{article.author}</td>
                            <td>{article.taskcompletepages}</td>
                            <td>{article.startpage}</td>
                            <td>{article.endpage}</td>
                            <td className="link-unlink">
                              <button
                                type="button"
                                className="btn btn-outline-primary linked"
                                onClick={() => handleUnlink(article.chapterID)}
                              >
                                <i className="material-icons-outlined">
                                  link_off
                                </i>{" "}
                                Unlink
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                      {article.isArticleBlank === "true" && (
                        <tr>
                          <td colSpan="8" className="blankPage p-0 pl-4">
                            Blank page inserted.
                          </td>
                          <td className="blankPage p-0">
                            <button
                              type="button"
                              className="remove-btn-style"
                              onClick={(e) =>
                                deleteBlank(e, article.chapterIssueId)
                              }
                            >
                              <i className="material-icons-outlined cstm-del-style">
                                delete
                              </i>
                            </button>
                          </td>
                        </tr>
                      )}
                      {provided.placeholder}
                    </>
                  ))
                ) : (
                  <tr className="taskRow">
                    <td colSpan="8">No data found.</td>
                  </tr>
                )}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
      {openModalConfirmation && (
        <Modal
          displayModal
          closeModal={closeModal}
          title="Link articles to this issue"
          listData={unlinkData}
          linkArticle={(data) => handleLinkArticle(data)}
        />
      )}
    </>
  );
}
