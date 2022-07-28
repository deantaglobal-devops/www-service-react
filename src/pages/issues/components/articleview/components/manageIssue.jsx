import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { api } from "../../../../../services/api";
import "../../../styles/issues.styles.css";
import Dropdown from "../../../../../components/dropdown/dropdown";
import Input from "../../../../../components/input/input";
import { downloadFile } from "../../../../../utils/downloadFile";

export default function manageIssue() {
  const [linkedarticleData, setLinkedarticleData] = useState({});
  const [activeBlank, setActiveBlank] = useState("");
  const [isPdf, setIsPdf] = useState("");
  const [issueNo, setIssueNo] = useState();
  const [volumeNo, setVolumeNo] = useState();
  const [chapterId, setChapterId] = useState();

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
    setLinkedarticleData(data.issuesList.linkedArticleList);
  };

  const addBlank = async (e) => {
    // eslint-disable-next-line no-unused-expressions
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
        issueDataJson(newResponse);
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
      setIsPdf("generating");
    });
  };

  const handleDownloadPdf = async () => {
    const { projectId, issueId, firstId } = this.state;
    const bodyRequest = {
      projectId,
      issueId,
      chapterId: firstId,
    };
    await api
      .post("/issue/pdf/download", bodyRequest)
      .then(async (response) => {
        const { status } = response.data;
        const fileName = response.data.pdfName;
        const filePath = response.data.PDFPath;
        if (status === "success" && fileName !== "" && filePath !== "") {
          // Strip out "illegal" characters. Bug fix for Windows
          // fileName = fileName.replace(/([^a-z0-9\s]+(?=.*\.))/gi, "-");
          // document.location.href = `/download/file/?filePath=${filePath}&fileName=${fileName}`;

          if (filePath) {
            downloadFile(filePath);
          }
        }
      });
  };

  const updateStartPage = () => {};
  const getStartPage = () => {};

  const deleteBlank = (e, data) => {};

  const onDragEnd = (result) => {
    // const { destination, source } = result;
    // if (!destination) {
    //   return;
    // }
    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // ) {
    //   return;
    // }
    // const tocArray = Array.from(tocData);
    // tocArray.splice(source.index, 1);
    // tocArray.splice(destination.index, 0, tocData[source.index]);
    // setTocData(tocArray);
    // saveOrder(tocArray);
    // // reorderList(tocArray, source.index, destination.index);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
  });

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
        setChapterId(response[1].data?.linkedArticleList[0].chapterID);
        setIsPdf(response[1].data?.issuePdfStatus);
        const newData = {
          issuesList: response[1].data,
          projectId,
          issueId,
          volumeNo,
          issueNo,
        };
        issueDataJson(newData);
      })
      .catch();
  }, []);

  return (
    <>
      <div className="col-2 float-left blank-list">
        <Input
          label="Update start page"
          // name="isbn"
          // value={data?.isbn ? data?.isbn : ""}
          handleOnChange={(e) => getStartPage(e)}
          maxLength="255"
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
      {isPdf === "generate" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
          onClick={handleGeneratePdf}
        >
          Generate PDF
        </button>
      )}
      {isPdf === "download" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
          onClick={this.handleDownloadPdf}
        >
          Download PDF
        </button>
      )}
      {isPdf === "generating" && (
        <button
          type="button"
          className="btn btn-outline-primary mr-2 float-right"
        >
          Generating...
        </button>
      )}
      <button
        type="button"
        className="btn btn-outline-primary mr-2 float-right cstm-link-btn"
        onClick={handleDownloadPdf}
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
                        draggableId={chapterId}
                        index={index}
                        key={`key-${chapterId}`}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <td>
                              <i
                                {...provided.dragHandleProps}
                                className={
                                  "toc-dragger material-icons-outlined"
                                  // chapterSelected
                                  //   ? "toc-dragger material-icons-outlined"
                                  //   : "toc-dragger material-icons-outlined hidden"
                                }
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
                                onClick={() =>
                                  handleUnlinkModal(article.chapterID)
                                }
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
                            <i
                              className="material-icons-outlined cstm-del-style"
                              onClick={(e) => deleteBlank(e, article.issue_id)}
                            >
                              delete
                            </i>
                          </td>
                        </tr>
                      )}
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
    </>
  );
}
