import { useEffect, useRef, useState } from "react";

import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import { useForm, useWatch } from "react-hook-form";

import Modal from "../../modal";
import SliderLoading from "../../sliderLoading/SliderLoading";
import { Tooltip } from "../../tooltip/tooltip";

import AddMemberModal from "./addMemberModal";
import FinishTaskModal from "./finishTaskModal";
import { EditorText } from "./editorText";

import { useAuth } from "../../../hooks/Auth";
import { api } from "../../../services/api";
import { downloadFile } from "../../../utils/downloadFile";

function messagingArea({ ...props }) {
  const {
    projectCode,
    projectName,
    taskName,
    taskId,
    milestoneId,
    projectId,
    chapterId,
    reply,
    forward,
    replyMsgId,
    attachForm,
    hasMessage,
    taskStatusType,
    permissions,
    memberList,
    updateMessages,
    changeTaskStatus,
    updateMembers,
    setForward,
    setAttachForm,
    setReply,
    setStatusMsg,
  } = props;

  const { user } = useAuth();
  const moreOpt = useRef(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [signature, setSignature] = useState(
    JSON.parse(localStorage.getItem("signature")) || "",
  );

  const [textareaRows, setTextareaRows] = useState([
    { currentRows: 1 },
    { currentRows: 1 },
    { currentRows: 1 },
  ]);

  // List states
  const [memberProjectList, setMemberProjectList] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [attachsAssetList, setAttachsAssetList] = useState([]);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [emailsInvalid, setEmailsInvalid] = useState([]);

  // Modal states control
  const [invalidEmailsModal, setInvalidEmailsModal] = useState(false);
  const [isHandlePmTaskModal, setIsHandlePmTaskModal] = useState(false);
  const [addUsersToTaskModal, setAddUsersToTaskModal] = useState(false);

  // Status states control
  const [loading, setLoading] = useState("");
  const [showMoreOpt, setShowMoreOpt] = useState(false);

  // It will be remove when the username list is done in backend
  const userNameList = [
    {
      id: 1,
      name: "OIKOS",
      senderName: [
        {
          id: 1,
          name: "Lindbergia",
        },
        {
          id: 2,
          name: "Journal of Avian Biology",
        },
        {
          id: 3,
          name: "Nordic Journal of Botany",
        },
        {
          id: 4,
          name: "Ecography",
        },
        {
          id: 5,
          name: "Wildlife Biology",
        },
        {
          id: 6,
          name: "OIKOS",
        },
      ],
    },
    {
      id: 2,
      name: "Bioscientifica",
      senderName: [
        {
          id: 1,
          name: "EO-prod",
        },
        {
          id: 2,
          name: "JME-prod",
        },
        {
          id: 3,
          name: "EDM-prod",
        },
        {
          id: 4,
          name: "ERP-prod",
        },
        {
          id: 5,
          name: "VB-prod",
        },
        {
          id: 6,
          name: "EC-prod",
        },
        {
          id: 7,
          name: "ERC-prod",
        },
        {
          id: 8,
          name: "REP-prod",
        },
        {
          id: 9,
          name: "EJE-prod",
        },
        {
          id: 10,
          name: "JOE-prod",
        },
        {
          id: 11,
          name: "RAF-prod",
        },
        {
          id: 12,
          name: "ETJ-prod",
        },
        {
          id: 13,
          name: "EOR-prod",
        },
      ],
    },
  ];

  // Form controls
  const defaultForm = {
    ccs: "",
    bccs: "",
    to: "",
    subject: `${projectCode} / ${projectName} / ${taskName}`,
    date: "",
    addBccField: false,
    alertMembers: false,
    emailExternal: false,
    reminderDate: false,
    template: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    getValues,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: defaultForm,
  });
  const [ccMeField, ccs] = useWatch({
    control,
    name: ["ccMeField", "ccs"],
  });

  // Get all data
  useEffect(() => {
    getTemplates(taskId);
    getMembersProject(projectId);
    getAlwaysCC();
    updateContentEditor("");
  }, []);

  useEffect(() => {
    if (hasMessage === 0 && loading === "") {
      setShowMoreOpt(true);
      setValue("template", templatesList[0]?.templateId);
      applyTemplate(templatesList[0]?.templateId);
    } else {
      setShowMoreOpt(false);
      setValue("template", "");
    }
  }, [templatesList, hasMessage]);

  // Get all emails (CC and To) to reply
  useEffect(() => {
    if (reply !== "") {
      const replyList = reply?.split(",") || [];
      const addReply = replyList
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index);
      setValue("to", addReply.join(","));
      setShowMoreOpt(true);
      setValue("emailExternal", true);
      setReply("");
    }
  }, [reply]);

  // Get the message to forward
  useEffect(() => {
    if (forward !== "") {
      const messageFormat = `<br>---<br>Original message sent by ${user.name} ${user.lastname}${forward}`;
      setShowMoreOpt(true);
      resetFields();
      setValue("emailExternal", true);
      updateContentEditor(messageFormat);
      setForward("");
    }
    if (attachForm !== "") {
      setAttachmentList([]);
      setAttachsAssetList([]);
      getAttachs(attachForm.split(","));
      setAttachForm("");
    }
  }, [forward, attachForm]);

  // Logical to managed "Always CC Myself"
  useEffect(() => {
    const ccList = watch("ccs");
    const array = ccList.replace(" ", "").split(",");

    const checkCcMe = array.includes(user.email);
    checkCcMe ? setValue("ccMeField", true) : setValue("ccMeField", false);
  }, [ccs]);

  useEffect(() => {
    const ccList = watch("ccs");
    const array = ccList.replace(" ", "").split(",");
    const checkCcMe = array.includes(user.email);

    const removeMySelf = array
      .filter(Boolean)
      .filter((item) => item !== user.email);
    const addMySelf = array.filter(Boolean).concat([user.email]);

    ccMeField
      ? !checkCcMe && setValue("ccs", addMySelf.join(","))
      : setValue("ccs", removeMySelf.join(","));
  }, [ccMeField]);

  useEffect(() => {
    const contentEditor = convertToRaw(editorState.getCurrentContent());
    const keys = signature?.blocks?.map((item) => item.key);

    const removeOldSignature = contentEditor?.blocks?.filter(
      (el) => !keys?.includes(el.key),
    );

    updateContentEditor(
      stateToHTML(
        convertFromRaw({
          blocks: removeOldSignature,
          entityMap: contentEditor.entityMap,
        }),
      ),
    );
  }, [signature]);

  function updateContentEditor(content) {
    const contentState = content ?? "";

    const currentBlocksArr = stateFromHTML(contentState).getBlocksAsArray();
    const signatureDataState =
      signature && convertFromRaw(signature).getBlocksAsArray();
    const newBlocksArr = signature
      ? currentBlocksArr.concat(signatureDataState)
      : currentBlocksArr;
    const newContentState = ContentState.createFromBlockArray(newBlocksArr);
    const editorDataState = EditorState.createWithContent(newContentState);
    setEditorState(editorDataState);
  }

  async function getMembersProject(projectId) {
    await api
      .get(`/project/${projectId}/users`)
      .then((result) => setMemberProjectList(result.data))
      .catch((error) => console.log(error));
  }

  function getAlwaysCC() {
    api
      .get(`/user/always-cc/${user.id}`)
      .then((result) => {
        if (result.data.always_cc === 1) {
          setValue("ccMeField", true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateAlwaysCC() {
    api
      .post("/user/always-cc", {
        always_cc: ccMeField ? 1 : 0,
        user_id: user.id,
      })
      .then(() => {
        getAlwaysCC();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getTemplates(taskId) {
    setLoading("templatelist");
    await api
      .get(`/task/${taskId}/templates`)
      .then((result) => {
        setTemplatesList(result.data.templates ?? []);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(""));
  }

  async function applyTemplate(selectedTemplateId) {
    if (selectedTemplateId) {
      setLoading("usetemplate");
      await api
        .post("/task/template/eproofing", {
          taskId,
          templateId: parseInt(selectedTemplateId),
        })
        .then((result) => {
          getAlwaysCC();
          setValue("template", selectedTemplateId);
          setAttachmentList((attachmentList) => [
            ...attachmentList,
            ...result.data.otherAsset,
            ...result.data.bookPDF,
          ]);
          setValue("emailExternal", true);
          result.data.remainderDate &&
            (setValue("date", result.data.remainderDate),
            setValue("reminderDate", true));

          setValue(
            "ccs",
            result.data.default_cc?.map((email) => email.user_email).join(", "),
          );
          setValue(
            "to",
            result.data.default_to?.map((email) => email.user_email).join(", "),
          );
          setValue(
            "bccs",
            result.data.default_bcc
              ?.map((email) => email.user_email)
              .join(", "),
          );
          setValue("subject", result.data.subject);

          updateContentEditor(result.data.template.replace(/\n/g, "<br />"));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setLoading(""));
    }
  }

  const onSubmit = async (data) => {
    setLoading("send");

    const handleFieldArr = (arr) => {
      if (arr) {
        return arr?.toLowerCase().replace(/\s/g, "").split(",");
      }
      return [];
    };

    const arrTo = handleFieldArr(data.to);
    const arrCC = handleFieldArr(data.ccs);
    const arrBCC = handleFieldArr(data.bccs);

    const emailsMerge = [...arrTo, ...arrCC, ...arrBCC];

    const membersToInclude = memberProjectList.filter(
      ({ id: id1 }) => !memberList.some(({ id: id2 }) => id2 === id1),
    );
    const emailsOfMembers = membersToInclude.filter(
      (item) =>
        arrTo.includes(item.email?.toLowerCase()) ||
        (arrCC.includes(item.email?.toLowerCase()) && item.email),
    );
    emailsOfMembers.length > 0 && setUsersToAdd(emailsOfMembers);

    if (data.emailExternal) {
      if (data.to === "") {
        setLoading("");
        setError(
          "to",
          {
            type: "focus",
            message: "Please enter an email address",
          },
          { shouldFocus: true },
        );
        moreOpt.current.scrollIntoView({ block: "center", behavior: "smooth" });
      } else {
        validateEmail(emailsMerge.filter(Boolean)).then((result) => {
          if (result) {
            if (result.filter((item) => arrTo.includes(item)).length > 0) {
              setError(
                "to",
                {
                  type: "focus",
                  message: "Please enter a valid email adress",
                },
                { shouldFocus: true },
              );
            }
            if (result.filter((item) => arrCC.includes(item)).length > 0) {
              setError(
                "ccs",
                {
                  type: "focus",
                  message: "Please enter a valid email adress",
                },
                { shouldFocus: true },
              );
            }
            if (result.filter((item) => arrBCC.includes(item)).length > 0) {
              setError(
                "bccs",
                {
                  type: "focus",
                  message: "Please enter a valid email adress",
                },
                { shouldFocus: true },
              );
            }
            moreOpt.current.scrollIntoView({
              block: "end",
              behavior: "smooth",
            });
          } else if (
            taskStatusType !== "" ||
            (+permissions.tasks.users.add === 1 && emailsOfMembers.length > 0)
          ) {
            if (
              +permissions.tasks.users.add === 1 &&
              emailsOfMembers.length > 0
            ) {
              setAddUsersToTaskModal(true);
            }
            if (taskStatusType !== "") {
              setIsHandlePmTaskModal(true);
            }
          } else {
            sendChat(data, true);
          }
        });
      }
    } else if (taskStatusType !== "") {
      setIsHandlePmTaskModal(true);
    } else {
      sendChat(data);
    }
  };

  async function validateEmail(emails) {
    const response = await api
      .post("/validate-emails", emails)
      .then((res) => {
        const invalid = Object.entries(res.data).filter(
          ([key, value]) => value === "Invalid",
        );
        if (invalid.length > 0) {
          const arrInvalidEmails = invalid
            .flat()
            .filter((item) => item !== "Invalid");
          setEmailsInvalid(arrInvalidEmails);
          setInvalidEmailsModal(true);
          setLoading("");

          return arrInvalidEmails;
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return response;
  }

  async function sendChat(data, mail) {
    let messageId = "";
    let attachments = [];
    let attachmentsIds = [];

    const attachmentsMerge = [...attachmentList, ...attachsAssetList];
    if (attachmentsMerge.length > 0) {
      await uploadLocalFiles(attachmentsMerge);
      attachments = await Promise.all(
        attachmentsMerge.map(async (file) => {
          const fileCopy = {};
          fileCopy.id = parseInt(file.id ?? file.document_id);
          fileCopy.name = file.name ?? file.document_name;
          fileCopy.file_path = file.file_path
            ? file.file_path.replace("/resources/", "")
            : file.document_path.replace("resources/", "");
          return fileCopy;
        }),
      );
      attachmentsIds = await Promise.all(
        attachmentsMerge.map(async (file) =>
          parseInt(file.id ?? file.document_id),
        ),
      );
    }

    await api
      .post("/messages/add", {
        companyId: user.realCompanyId,
        taskId,
        content: stateToHTML(editorState.getCurrentContent()),
        creatorId: user.id,
        attachments: attachmentsIds,
        emailTo: data.to.replace(" ", ""),
        emailCC: data.ccs.replace(" ", ""),
        alertedIds: memberList.map((user) => user.id).join(","),
        message_id_related: replyMsgId,
        is_reply: replyMsgId ? "1" : "0",
      })
      .then((result) => {
        messageId = result.data.chatroomId;
        sendtoNotificationsService();
        mail && sendMail(data, attachments, messageId);
      })
      .catch((error) => {
        setStatusMsg("Something got wrong! Please try again.");
        console.log(error);
      })
      .finally(() => {
        updateMessages();
        setLoading("");
        resetFields();
        updateMembers();
      });
  }

  async function sendMail(data, attachments, messageId) {
    setLoading("send");

    // Handling address emails
    function handleStrArr(arr) {
      if (arr) {
        return arr?.replace(/\s/g, "").split(",").filter(Boolean);
      }
      return [];
    }

    let ccsAddress = handleStrArr(data.ccs);
    const bccsAddress = handleStrArr(data.bccs);
    let toAddress = handleStrArr(data.to);

    if (data.alertMembers) {
      toAddress = toAddress.concat(memberList.map((user) => user.email));
    }

    if (toAddress.some((item) => ccsAddress.includes(item))) {
      ccsAddress = ccsAddress.filter(
        (email) =>
          !toAddress.some((itemToBeRemoved) => itemToBeRemoved === email),
      );
    }

    await api
      .post("/mail", {
        header: {
          reply_title: data.subject,
          chapter_id: chapterId,
          company_id: user.realCompanyId,
          project_id: projectId,
          task_id: taskId,
          creator_id: user.id,
          creator_name: data.senderName,
          message_id: messageId,
          template_id: parseInt(data.template),
        },
        content: {
          body: stateToHTML(editorState.getCurrentContent()),
          to: toAddress.length > 0 ? toAddress : "",
          cc: ccsAddress.length > 0 ? ccsAddress : "",
          bcc: bccsAddress.length > 0 ? bccsAddress : "",
          from: user.email,
          subject: data.subject,
        },
        attachments,
      })
      .then((res) => {
        if (res.data.status === "sent" || res.data.status === "OK") {
          setStatusMsg("Message sent successfully");
        } else {
          setStatusMsg("Message wasn't send. Something got wrong!");
        }
      })
      .catch((err) => {
        setStatusMsg("Message wasn't send. Something got wrong!");
        console.log(err);
      })
      .finally(() => {
        setLoading("");
        updateAlwaysCC();
      });
  }

  function sendtoNotificationsService() {
    let description = `New message(s) on ${taskName}`;

    const date = Date.now();

    const msg = {
      companyId: user.realCompanyId,
      creation_date: date,
      description,
      link: `${window.location.origin}/project/${projectId}`,
      milestoneId,
      type: "Communications",
      projectId,
      seen: "0",
      taskId,
      title: description,
      update_date: date,
      userId: user.id,
      category: projectName,
      channel: "communications-broadcast",
    };

    const currentURL = window.location.pathname;
    if (currentURL.includes("/journal/")) {
      msg.link = `${window.location.origin}/project/journal/${projectId}/detail/${chapterId}`;

      const articleTitle = document.querySelector(".page-header h2").innerHTML;
      const articleTitleTruncated = articleTitle.substring(0, 15);

      const categoryName = `${projectCode}/${projectName}/${taskName}`;
      const categoryNameSplit = categoryName.split(" / ");
      const journalName = categoryNameSplit[1];

      const categoryNameSplitJoined = `${journalName} / ${articleTitleTruncated}...`;
      const milestoneName = categoryNameSplit[2];

      msg.category = categoryNameSplitJoined;

      description = `New message(s) on ${milestoneName} / ${projectName}`;
      msg.description = description;
      msg.title = description;
    }

    const bodyRequest = {
      userId: user.id,
      companyId: user.realCompanyId,
      milestoneId,
      taskId,
      channel: "communications-broadcast",
      type: "Communications",
      description,
      category: projectName,
      title: description,
      projectId,
    };
    api.post("/notifications/add", msg);

    // fetch("/push/notifications/communications", {
    //   method: "POST",
    //   mode: "no-cors",
    //   body: JSON.stringify(msg),
    // })
    //   .then((res) => res.json())
    //   .then((result) => result)
    //   .catch((err) => console.log(err));
  }

  async function getAttachs(attachIds) {
    setLoading("attchforward");
    const attachments = await Promise.all(
      attachIds.map(async (fileId) => {
        const response =
          fileId !== "" &&
          (await api
            .get(`/project/document/${fileId.replace(/\s/g, "").split(",")}`)
            .then((result) => result.data)
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              setLoading("");
            }));
        return response;
      }),
    ).finally(() => {
      setLoading("");
    });

    setAttachmentList(attachments !== undefined ? attachments : []);
    setAttachsAssetList([]);
  }

  async function uploadLocalFiles(files) {
    const newArrayOfFiles = await Promise.all(
      files.map(async (file) => {
        if (file.upload) {
          const newId = await addAssetInProject(file.file_path, file.name);
          file.id = newId;
          return file;
        }
        return file;
      }),
    );
    setAttachmentList(newArrayOfFiles);
  }

  async function addAssetInProject(filePath, file) {
    const extDot = file.lastIndexOf(".");
    const fileExt = file.substring(extDot + 1);
    return await api
      .post("/project/assets/add", {
        projectId,
        chapterId,
        taskId,
        filePath,
        fileName: file,
        fileExt,
      })
      .then((response) => {
        if (response.data.newFileId) {
          return response.data.newFileId;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const resetFields = () => {
    reset(defaultForm);
    setEditorState(
      EditorState.push(editorState, ContentState.createFromText("")),
    );
    setAttachmentList([]);
    setAttachsAssetList([]);
  };

  const textareaIncrease = (event, i) => {
    const textareaLineHeight = 22;
    const previousRows = event.target.rows;
    event.target.rows = 1;
    const markers = [...textareaRows];

    const currentRows = Math.round(
      event.target.scrollHeight / textareaLineHeight,
    );

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= 4) {
      event.target.rows = 4;
      event.target.scrollTop = event.target.scrollHeight;
    }

    const limitRows = 4;
    currentRows <= limitRows && (markers[i] = { ...markers[i], currentRows });
    setTextareaRows(markers);
  };

  const handleDownload = async (filePath) => {
    if (filePath) {
      downloadFile(filePath);
    }
  };

  return (
    <div className="messaging-body" id="messaging-body">
      <div id="composerArea">
        <div>
          <EditorText
            editorState={editorState}
            setEditorState={setEditorState}
            attachsAssetList={attachsAssetList}
            setAttachsAssetList={setAttachsAssetList}
            attachmentList={attachmentList}
            setAttachmentList={setAttachmentList}
            setSignature={setSignature}
            setStatusMsg={setStatusMsg}
            {...props}
          />
          {loading === "attchforward" ? (
            <div className="attachments-uploaded">
              <div
                className="flex-gap"
                style={{ color: "var(--beau-blue-mod)" }}
              >
                <i className="material-icons-outlined loading-icon-button">
                  sync
                </i>{" "}
                <span>Adding the attachments ...</span>
              </div>
            </div>
          ) : (
            (attachmentList.length > 0 || attachsAssetList.length > 0) && (
              <div className="attachments-uploaded">
                <ul className="attachments-uploaded-list">
                  {attachmentList?.map((attachment, index) => (
                    <li key={index} className="attachments-uploaded-item">
                      <div
                        alt={attachment?.name ?? attachment?.document_name}
                        className={`attachments-uploaded-card ${
                          attachment.upload === "uploaded"
                            ? "loaded-attachment"
                            : "load-attachment"
                        } ${attachment.error && "loaderror-attachment"}`}
                      >
                        <span
                          className="name"
                          onClick={() =>
                            attachment?.file_path &&
                            handleDownload(attachment?.file_path)
                          }
                        >
                          {attachment?.name ?? attachment?.document_name}
                        </span>
                        {attachment?.name?.length > 11 && (
                          <span className="name">{attachment?.ext ?? ""}</span>
                        )}{" "}
                        {attachment?.error && (
                          <span className="error-filesize">
                            – {attachment.error}
                          </span>
                        )}
                        {attachment.upload !== "uploading" && (
                          <button type="button" className="deanta-button">
                            <i
                              className="material-icons-outlined remove-attachment"
                              onClick={() => {
                                const removeItem = attachmentList.filter(
                                  (item) => item !== attachment,
                                );
                                setAttachmentList(removeItem);
                              }}
                              title="Remove"
                            >
                              close
                            </i>
                          </button>
                        )}
                        <span className="progress-bar" />
                      </div>
                    </li>
                  ))}
                  {attachsAssetList?.map((attachment, index) => (
                    <li key={index} className="attachments-uploaded-item">
                      <div className="attachments-uploaded-card">
                        <span
                          className="name"
                          onClick={() => handleDownload(attachment.file_path)}
                        >
                          {attachment.name}
                        </span>
                        <button type="button" className="deanta-button">
                          <i
                            className="material-icons-outlined remove-attachment"
                            onClick={() => {
                              const newAttachmentList = attachsAssetList.filter(
                                (item) => item.id !== attachment.id,
                              );
                              setAttachsAssetList(newAttachmentList);
                            }}
                            title="Remove"
                          >
                            close
                          </i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          <div className="composer-tools">
            <div className="composer-tools-other deanta-button-container">
              <button
                className={`deanta-button composer-tools-options ${
                  showMoreOpt && "active"
                }`}
                type="button"
                onClick={() => {
                  setShowMoreOpt(!showMoreOpt);
                }}
              >
                <i className="material-icons-outlined">
                  {showMoreOpt ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                </i>
                More Options
              </button>
              <div className="flex-gap">
                {editorState.getCurrentContent().hasText() && (
                  <button
                    type="button"
                    className="deanta-button composer-tools-send deanta-button-outlined"
                    onClick={() => {
                      resetFields();
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={
                    !!(
                      loading === "send" ||
                      !editorState.getCurrentContent().hasText() ||
                      attachmentList.filter(
                        (item) => item.upload === "uploading",
                      ).length > 0
                    )
                  }
                  className={`deanta-button composer-tools-send deanta-button-outlined ${
                    loading === "send" && "loading"
                  }`}
                >
                  {loading === "send" ? (
                    <>
                      <i className="material-icons-outlined loading-icon-button">
                        sync
                      </i>{" "}
                      Sending
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>
          {showMoreOpt && (
            <div className="options" ref={moreOpt}>
              <div className="chck-center options-alert options-checkbox">
                <input
                  disabled={!memberList?.length > 0}
                  id="alertMembers"
                  type="checkbox"
                  name="alertMembers"
                  {...register("alertMembers")}
                />
                <label htmlFor="alertMembers">
                  Also alert members on this task by email
                </label>
                {!memberList?.length > 0 && (
                  <span> (Please assign users to the task first)</span>
                )}
              </div>

              <div className="inputs-flex-50">
                <div className="options-template">
                  <div className="wrap-field-label">
                    <label htmlFor="template" className="label-form">
                      Use a template?
                    </label>
                    <select
                      name="template"
                      {...register("template")}
                      onChange={(event) => {
                        event.target.value !== ""
                          ? applyTemplate(event.target.value)
                          : resetFields();
                      }}
                    >
                      <option value="">No Template</option>
                      {loading !== "templatelist" ? (
                        templatesList?.length > 0 ? (
                          templatesList.map((template, i) => (
                            <option
                              key={template.templateId + i}
                              value={template.templateId}
                            >
                              {template.template_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            There isn't template yet
                          </option>
                        )
                      ) : (
                        <option value="" disabled>
                          Loading ...
                        </option>
                      )}
                    </select>
                    <i className="material-icons-outlined select-chevron">
                      expand_more
                    </i>
                  </div>
                </div>

                <div className="options-template">
                  <div className="wrap-field-label">
                    <label htmlFor="senderName" className="label-form">
                      Sender name:
                    </label>
                    <select name="senderName" {...register("senderName")}>
                      <option value={`${user.name} ${user.lastname}`}>
                        {`${user.name} ${user.lastname}`}
                      </option>
                      {+permissions?.chatroom?.sender_name_selection === 1 &&
                        userNameList?.length > 0 &&
                        userNameList.map((group) => (
                          <optgroup label={group.name} key={group.id}>
                            {group.senderName.map((user) => (
                              <option key={user.id} value={user.name}>
                                {user.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                    </select>
                    <i className="material-icons-outlined select-chevron">
                      expand_more
                    </i>
                  </div>
                </div>
              </div>

              {loading === "usetemplate" || loading === "templatelist" ? (
                <SliderLoading fitLoad />
              ) : (
                <div className="options-checkbox">
                  <div className="inputs-flex-50">
                    <div className="chck-center options-comms-divisor">
                      <input
                        id="email"
                        type="checkbox"
                        name="emailExternal"
                        {...register("emailExternal")}
                      />
                      <label htmlFor="email" id="labelEmail">
                        Also send message to other email address(es)?
                      </label>
                    </div>
                    {watch("emailExternal") && (
                      <div className="options-email-subject ">
                        <div className="wrap-field-label">
                          <label className="label-form">Subject:</label>
                          <input
                            id="subject"
                            name="subject"
                            type="text"
                            {...register("subject")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {watch("emailExternal") && (
                    <>
                      <div className="inputs-flex-50 options-reminder">
                        <div className="inputs-flex-50">
                          <div className="chck-center">
                            <input
                              id="ccMeField"
                              type="checkbox"
                              name="ccMeField"
                              {...register("ccMeField")}
                            />
                            <label htmlFor="ccMeField" id="ccMeFieldLabel">
                              Always cc myself
                            </label>
                            <Tooltip
                              direction="top"
                              content={
                                <span>
                                  Checking this box will insert your own email
                                  <br />
                                  address into the cc: line of the email. This
                                  <br />
                                  will remain switched on for all messages you
                                  <br />
                                  send on Lanstad until you switch it off.
                                </span>
                              }
                            >
                              <span className="material-icons-outlined infoicon">
                                info
                              </span>
                            </Tooltip>
                          </div>
                          <div
                            className="chck-center"
                            style={{ justifyContent: "center" }}
                          >
                            <input
                              id="addBccField"
                              type="checkbox"
                              name="addBccField"
                              {...register("addBccField")}
                            />
                            <label
                              htmlFor="addBccField"
                              id="addBccField"
                              onClick={() => {
                                setTimeout(() => {
                                  setFocus("bccs");
                                }, 200);
                              }}
                            >
                              Add Bcc field
                            </label>
                          </div>
                        </div>
                        <div className="chck-center">
                          <input
                            id="reminderDate"
                            type="checkbox"
                            name="reminderDate"
                            disabled
                            {...register("reminderDate")}
                          />
                          <label htmlFor="reminder">Set a reminder date?</label>
                          <Tooltip
                            direction="top"
                            content={
                              <span>
                                Automated reminder email will be sent to the
                                <br />
                                recipient/s every day from the date chosen until
                                <br />
                                the corrections have been submitted.
                              </span>
                            }
                          >
                            <span className="material-icons-outlined infoicon">
                              info
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="emails-fields inputs-flex-50">
                        <div className="options-email-to">
                          <div className="wrap-field-label">
                            <label className="label-form">To:</label>
                            <textarea
                              id="to"
                              name="to"
                              rows={textareaRows[0].currentRows}
                              onKeyPress={(event) => {
                                textareaIncrease(event, 0);
                              }}
                              onClick={(event) => {
                                textareaIncrease(event, 0);
                              }}
                              {...register("to")}
                              className={errors.to && "is-invalid"}
                            />
                          </div>
                          {errors.to && (
                            <p className="text-warning text-error">
                              {errors.to.message}
                            </p>
                          )}
                        </div>
                        <div className="options-email-ccs">
                          <div className="wrap-field-label">
                            <label className="label-form">Cc:</label>
                            <textarea
                              id="ccs"
                              name="ccs"
                              rows={textareaRows[0].currentRows}
                              onKeyPress={(event) => {
                                textareaIncrease(event, 0);
                              }}
                              onClick={(event) => {
                                textareaIncrease(event, 0);
                              }}
                              {...register("ccs")}
                              className={errors.ccs && "is-invalid"}
                            />
                          </div>
                          {errors.ccs && (
                            <p className="text-warning text-error">
                              {errors.ccs.message}
                            </p>
                          )}
                        </div>
                        {watch("addBccField") && (
                          <div className="options-email-ccs">
                            <div className="wrap-field-label">
                              <label className="label-form">Bcc:</label>
                              <textarea
                                id="bccs"
                                name="bccs"
                                defaultValue=""
                                rows={textareaRows[2].currentRows}
                                onKeyPress={(event) => {
                                  textareaIncrease(event, 2);
                                }}
                                {...register("bccs")}
                                className={errors.bccs && "is-invalid"}
                              />
                            </div>
                            {errors.bccs && (
                              <p className="text-warning text-error">
                                {errors.bccs.message}
                              </p>
                            )}
                          </div>
                        )}
                        {/* {watch('reminderDate') === true && (
                        <div className="options-reminder-date">
                          <label>Reminder Date</label>
                          <input
                            disabled
                            id="date"
                            name="date"
                            type="date"
                            min={moment().format('YYYY-MM-DD')}
                            {...register('date')}
                          />
                        </div>
                      )} */}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isHandlePmTaskModal && (
        <Modal
          modalInSlider
          closeModal={() => {
            setIsHandlePmTaskModal(false);
            setLoading("");
          }}
          title="Send Message"
          body={
            <FinishTaskModal
              finish={() => changeTaskStatus("finish", taskId, 4)}
              send={() => sendChat(getValues(), watch("emailExternal"))}
              close={() => {
                setAddUsersToTaskModal(false);
              }}
            />
          }
        />
      )}

      {addUsersToTaskModal && (
        <Modal
          modalInSlider
          closeModal={() => {
            setAddUsersToTaskModal(false);
            setLoading("");
          }}
          title="Add users to task?"
          body={
            <AddMemberModal
              taskId={taskId}
              close={() => {
                setAddUsersToTaskModal(false);
              }}
              finish={() => {
                if (!isHandlePmTaskModal) {
                  sendChat(getValues(), watch("emailExternal"));
                }
              }}
              users={usersToAdd}
            />
          }
        />
      )}

      {invalidEmailsModal && (
        <Modal
          modalInSlider
          closeModal={() => setInvalidEmailsModal(false)}
          title="Invalid Email Address"
          body={
            <span>
              <span className="text-warning text-error">
                {emailsInvalid?.join(", ")}
              </span>{" "}
              do not appear to be a valid email address. Please verify and try
              again.
            </span>
          }
          footer={
            <div className="col-md-12 p-0">
              <button
                type="button"
                className="deanta-button deanta-button-outlined float-right"
                onClick={() => {
                  setInvalidEmailsModal(false);
                }}
              >
                Dismiss
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}

export default messagingArea;
