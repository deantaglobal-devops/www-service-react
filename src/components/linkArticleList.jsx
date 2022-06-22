import React from "react";
import { api } from "../services/api";
import Modal from "./modal";
import BasicButtonsSet from "./basicButtonsSet";
import IssueCoverUpload from "./issueCoverUpload";

class LinkArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SIDESLIDER_PROPS: {
        SliderHeader: "Manage Issue",
        SliderWidth: "",
        SliderStatus: true,
      },
      ISSUE_PROPS: props.ISSUE_PROPS,
      linkedarticleData: [],
      unlinkedarticleData: [],
      projectId: "",
      issueId: "",
      articleId: "",
      selectedArticle: "",
      action: "",
      pageNum: "",
      firstId: "",
      volumeNum: "",
      issueNum: "",
      pageNumError: "",
      pdfDownload: "",
      articleList: true,
    };
    this.handleUnlinkModal = this.handleUnlinkModal.bind(this);
    this.handleUnlink = this.handleUnlink.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.InputArticleRef = React.createRef();
    this.InputPagenumRef = React.createRef();
    this.changeArticle = this.changeArticle.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleArticleBlank = this.handleArticleBlank.bind(this);
    this.handleIssueBlank = this.handleIssueBlank.bind(this);
    this.handleGeneratePdf = this.handleGeneratePdf.bind(this);
    this.handleDownloadPdf = this.handleDownloadPdf.bind(this);
    this.handleCoverUpload = this.handleCoverUpload.bind(this);
  }

  componentDidMount() {
    // let data = JSON.parse(this.state.ISSUE_PROPS);
    const data = this.state.ISSUE_PROPS;
    this.setState({
      volumeNum: data.volumeNum,
      issueNum: data.issueNum,
    });
    this.issueDataJson(data);
  }

  issueDataJson(data) {
    const len = data.issuesList.linkedArticleList.length;
    let firstId = "";
    let pdfDownload = "";
    if (len > 0) {
      firstId = data.issuesList.linkedArticleList[0].chapterID;
      const pdfStatus = data.issuesList.linkedArticleList[0].issuePdfStatus;
      if (pdfStatus == "-1") {
        pdfDownload = "error";
      }
      if (pdfStatus == "0") {
        pdfDownload = "hide";
      }
    }
    this.setState({
      linkedarticleData: data.issuesList.linkedArticleList,
      unlinkedarticleData: data.issuesList.unlinkedArticleList,
      projectId: data.projectId,
      issueId: data.issueId,
      firstId,
      articleId: "",
      action: "",
      selectedArticle: "",
      deleteModal: false,
      pageNumError: "",
      pageNum: "",
      pdfDownload,
    });
  }

  handleUnlinkModal(articleId) {
    const modalFooter = (
      <BasicButtonsSet
        loadingButtonAction={false}
        cancelButtonAction={this.closeModal}
        buttonAction={this.handleUnlink}
        actionText="Yes"
      />
    );
    this.setState({
      deleteModal: true,
      deleteModalTitle: "Confirmation",
      deleteModalBody: "Are you sure you’d like to unlink this Article?",
      deleteModalFooter: modalFooter,
      articleId,
      action: "delete",
    });
  }

  closeModal() {
    this.setState({
      deleteModal: false,
      articleId: "",
    });
  }

  handleUnlink() {
    const { projectId, issueId, articleId, action } = this.state;

    const bodyRequest = {
      projectId,
      issueId,
      articleId,
      action,
    };
    api.post("/project/issue/linkarticle", bodyRequest).then((response) => {
      this.issueDataJson({
        issuesList: response.data,
        projectId,
        issueId,
      });
    });
  }

  changeArticle(e) {
    const selectAr = e.target.value;
    const articleId = e.target.value;
    if (selectAr !== "") {
      // this.InputArticleRef.value = selectAr;
      // this.InputArticleRef.innerHTML = selectAr;
      const modalFooter = (
        <BasicButtonsSet
          loadingButtonAction={false}
          cancelButtonAction={this.closeModal}
          buttonAction={this.handleUnlink}
          actionText="Yes"
        />
      );
      this.setState({
        deleteModal: true,
        deleteModalTitle: "Confirmation",
        deleteModalBody: "Are you sure you’d like to link this Article?",
        deleteModalFooter: modalFooter,
        articleId,
        selectedArticle: selectAr,
        action: "add",
      });
    }
  }

  async handlePagination() {
    const { pageNum, projectId, issueId, firstId } = this.state;
    if (pageNum !== "") {
      const bodyRequest = {
        projectId,
        issueId,
        chapterId: firstId,
        startpage: pageNum,
      };

      await api.post("/issue/pagination", bodyRequest).then((response) => {
        const newResponse = {
          issuesList: response?.data,
          projectId,
          issueId,
        };

        this.issueDataJson(newResponse);
      });
    } else {
      this.setState({
        pageNumError: "startpageError",
      });
    }
  }

  changeInput(e) {
    const pageNum = e.target.value;
    let pageNumError = "startpageError";
    if (pageNum !== "") {
      pageNumError = "";
    }
    this.setState({
      pageNum,
      pageNumError,
    });
  }

  async handleArticleBlank() {
    const { issueId, projectId } = this.state;
    const bodyRequest = {
      issueId,
      projectId,
    };
    await api.post("/journal/article/blank", bodyRequest).then((response) => {
      const newResponse = {
        issuesList: response.data,
        projectId,
        issueId,
      };
      this.issueDataJson(newResponse);
    });
  }

  async handleIssueBlank() {
    const { issueId, projectId } = this.state;
    const bodyRequest = {
      issueId,
      projectId,
    };
    await api.post("/journal/issue/blank", bodyRequest).then((response) => {
      const newResponse = {
        issuesList: response.data,
        projectId,
        issueId,
      };
      this.issueDataJson(newResponse);
    });
  }

  async handleGeneratePdf() {
    const { projectId, issueId, firstId, volumeNum, issueNum } = this.state;
    const bodyRequest = {
      projectId,
      issueId,
      chapterId: firstId,
      volumeNo: volumeNum,
      issueNo: issueNum,
    };
    await api.post("/issue/indesign/insert", bodyRequest).then(() => {
      this.setState({
        deleteModal: true,
        deleteModalTitle: "Your PDF is generating",
        deleteModalBody:
          "Your chapter PDF is currently being generated and this process can take up to 10 minutes depending on the file size.",
        deleteModalFooter: "",
        pdfDownload: "hide",
      });
    });
  }

  async handleDownloadPdf() {
    const { projectId, issueId, firstId } = this.state;
    const bodyRequest = {
      projectId,
      issueId,
      chapterId: firstId,
    };
    await api.post("/issue/pdf/download", bodyRequest).then((response) => {
      const { status } = response.data;
      const fileName = response.data.pdfName;
      const filePath = response.data.pdfName;
      if (status === "success" && fileName !== "" && filePath !== "") {
        // Strip out "illegal" characters. Bug fix for Windows
        // fileName = fileName.replace(/([^a-z0-9\s]+(?=.*\.))/gi, "-");
        // document.location.href = `/download/file/?filePath=${filePath}&fileName=${fileName}`;

        console.log("response", response.data);
        // Lanstad.File.download(filePath, fileName);
      }
    });
  }

  handleCoverUpload(action) {
    this.setState({
      articleList: action,
    });
  }

  render() {
    const linkedarticlesList = this.state.linkedarticleData;
    const unlinkedarticlesList = this.state.unlinkedarticleData;
    if (this.state.SIDESLIDER_PROPS.SliderStatus) {
      return (
        <>
          {this.state.articleList && (
            <>
              <div>
                <div className="row pl-3">
                  <a
                    href="#"
                    className="add-new uploadCoverFile"
                    onClick={() => this.handleCoverUpload(false)}
                  >
                    <i className="material-icons-outlined">
                      add_photo_alternate
                    </i>
                    Upload Cover
                  </a>
                  <div className="issue-pdf-btn">
                    {this.state.pdfDownload === "error" && (
                      <button
                        type="button"
                        className="btn btn-outline-warning mr-2 pdf-warning"
                      >
                        Error
                      </button>
                    )}
                    {this.state.pdfDownload === "" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary mr-2"
                        onClick={this.handleDownloadPdf}
                      >
                        Download PDF
                      </button>
                    )}
                    {this.state.pdfDownload === "hide" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary mr-2"
                      >
                        Generating...
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2"
                      onClick={this.handleGeneratePdf}
                    >
                      Generate PDF
                    </button>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="start-page-controls">
                    <div className="wrap-field-label">
                      <div className="inputWrapper">
                        <label
                          className={`label-form ${this.state.pageNumError}`}
                        >
                          Start Page
                        </label>
                        <input
                          className={`default-input-text ${this.state.pageNumError}`}
                          ref={this.InputPagenumRef}
                          type="text"
                          id="name"
                          value={this.state.pageNum}
                          onChange={this.changeInput}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2"
                      onClick={(e) => this.handlePagination()}
                    >
                      Update Start Page
                    </button>
                  </div>
                  <div className="blank-button-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2"
                      onClick={this.handleArticleBlank}
                    >
                      Article Blank
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary mr-2"
                      onClick={this.handleIssueBlank}
                    >
                      Issue Blank
                    </button>
                  </div>
                </div>
              </div>
              <div className="articleTile">Manage Articles</div>
              {unlinkedarticlesList.length > 0 && (
                <div className="wrap-field-label last-f mt-3">
                  <fieldset className="chooseRole dropdown">
                    <div className="DdWrapper">
                      <label htmlFor="roleSelect">Add Article</label>
                      <div className="styled-select">
                        <select
                          id="selectlinkarticle"
                          required
                          ref={this.InputArticleRef}
                          onChange={this.changeArticle}
                          value={this.state.selectedArticle}
                        >
                          <option value="">Select Article</option>
                          {unlinkedarticlesList.map((article) => (
                            <option
                              key={article.chapterID}
                              value={article.chapterID}
                            >
                              {article.chapterTitle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}
              <table className="table table-striped table-borderless table-oversize article-list-table">
                <thead>
                  <tr>
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
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {linkedarticlesList.length > 0 &&
                    Array.from(linkedarticlesList).map((article, index) => {
                      const url = `/project/journal/${this.state.projectId}/detail/${article.chapterID}`;
                      return (
                        <React.Fragment key={index}>
                          <tr className="taskRow">
                            <td>
                              <a
                                href={url}
                                className="no-style"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {article.chapterTitle}
                              </a>
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
                                  this.handleUnlinkModal(article.chapterID)
                                }
                              >
                                <i className="material-icons-outlined">
                                  link_off
                                </i>{" "}
                                Unlink
                              </button>
                            </td>
                          </tr>
                          {article.isArticleBlank === "true" && (
                            <tr>
                              <td colSpan="7" className="blankPage">
                                Blank page inserted.
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  {linkedarticlesList.length === 0 && (
                    <tr className="taskRow">
                      <td colSpan="7">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {this.state.deleteModal && (
                <Modal
                  modalInSlider
                  title={this.state.deleteModalTitle}
                  body={this.state.deleteModalBody}
                  footer={this.state.deleteModalFooter}
                  closeModal={this.closeModal}
                />
              )}
            </>
          )}
          {!this.state.articleList && (
            <IssueCoverUpload
              handleCoverUpload={this.handleCoverUpload}
              projectId={this.state.projectId}
              issueId={this.state.issueId}
              handleIssue={this.props.handleIssue}
            />
          )}
        </>
      );
    }
    return <></>;
  }
}

export default LinkArticleList;
