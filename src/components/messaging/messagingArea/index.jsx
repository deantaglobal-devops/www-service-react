import { useEffect, useRef, useState } from "react";
import { EditorState, ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import { useForm, useWatch } from "react-hook-form";
import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/Auth";

import Modal from "../../modal";
import SliderLoading from "../../sliderLoading/SliderLoading";
import { Tooltip } from "../../tooltip/tooltip";

import AddUserToTask from "./addUserToTask";
import { EditorText } from "./editorText";
import SendMessagePmTaskModal from "./sendMessagePmTaskModal";

function messagingArea({ ...props }) {
  const {
    projectCode,
    projectName,
    taskName,
    taskId,
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
  } = props;

  const { user } = useAuth();
  const moreOpt = useRef(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [signature, setSignature] = useState(
    JSON.parse(localStorage.getItem("signature")) || "",
  );
  const [oldSignature, setOldSignature] = useState(signature);
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
  const [statusMsg, setStatusMsg] = useState("");
  const [showMoreOpt, setShowMoreOpt] = useState(false);

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
    if (hasMessage === 0) {
      setShowMoreOpt(true);
      setValue("template", templatesList[0]?.templateId);
      applyTemplate(templatesList[0]?.templateId);
    } else {
      setShowMoreOpt(false);
      setValue("template", "");
    }
  }, [taskId, hasMessage]);

  const updateSignature = () => {
    updateContentEditor(stateToHTML(editorState.getCurrentContent()));
  };

  // Update Signature
  useEffect(() => {
    updateSignature();
  }, [signature]);

  // Clean message status
  useEffect(() => {
    setTimeout(() => {
      setStatusMsg("");
    }, 5000);
  }, [statusMsg]);

  // Get all emails (CC and To) to reply
  useEffect(() => {
    if (reply !== "") {
      const replyList = reply?.split(",") || [];
      const addReply = replyList
        .filter(Boolean)
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
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
    const array = ccList.split(",");

    const checkCcMe = array.includes(user.email);
    checkCcMe ? setValue("ccMeField", true) : setValue("ccMeField", false);
  }, [ccs]);
  useEffect(() => {
    const ccList = watch("ccs");
    const array = ccList.split(",");
    const checkCcMe = array.includes(user.email);

    const removeMySelf = array
      .filter(Boolean)
      .filter((item) => item !== user.email);
    const addMySelf = array.filter(Boolean).concat([user.email]);

    ccMeField
      ? !checkCcMe && setValue("ccs", addMySelf.join(","))
      : setValue("ccs", removeMySelf.join(","));
  }, [ccMeField]);

  function updateContentEditor(content) {
    const contentState = content ?? "";
    const contentDataState = stateFromHTML(contentState);
    const editorDataState = EditorState.createWithContent(contentDataState);
    setEditorState(editorDataState);
    setOldSignature(signature);
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
        always_cc: watch("ccMeField") ? 1 : 0,
        user_id: user.id,
      })
      .then(() => {
        setValue("ccMeField", true);
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
        setTemplatesList(result.data.templates);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(""));
  }

  async function applyTemplate(selectedTemplateId) {
    setLoading("usetemplate");

    if (selectedTemplateId && taskId) {
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

    setLoading("send");

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
      } else if (arrTo.some((item) => arrCC.includes(item))) {
        setLoading("");

        setError(
          "to",
          {
            type: "focus",
            message:
              "The same email address is in the To and Cc fields. Please remove one.",
          },
          { shouldFocus: true },
        );
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
          } else if (taskStatusType !== "") {
            setIsHandlePmTaskModal(true);
          } else if (+permissions.add === 1) {
            // Check if the users are already in the task
            // remove the duplicate email
            const membersToInclude = memberProjectList.filter(
              ({ id: id1 }) => !memberList.some(({ id: id2 }) => id2 === id1),
            );
            const emailsOfMembers = membersToInclude.filter(
              (item) =>
                arrTo.includes(item.email?.toLowerCase()) ||
                (arrCC.includes(item.email?.toLowerCase()) && item.email),
            );
            if (emailsOfMembers.length > 0) {
              setUsersToAdd(emailsOfMembers);
              setAddUsersToTaskModal(true);
            }
          } else {
            sendChat(data, true);
          }
        });
      }
    } else if (data.alertMembers) {
      sendChat(data, true);
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
        attachmentsMerge.map(async (file) => {
          return parseInt(file.id ?? file.document_id);
        }),
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
        mail && sendMail(data, attachments, messageId);
      })
      .catch((error) => {
        setStatusMsg("Something got wrong! Please try again.");
        console.log(error);
      })
      .finally(() => {
        setLoading("");
        resetFields();
        updateMessages();
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
    const ccsAddress = handleStrArr(data.ccs);
    const bccsAddress = handleStrArr(data.bccs);
    let toAddress = handleStrArr(data.to);
    if (data.alertMembers) {
      toAddress = toAddress.concat(memberList.map((user) => user.email));
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
          creator_name: `${user.name} ${user.lastname}`,
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
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading("");
        updateAlwaysCC();
      });
  }

  async function getAttachs(attachIds) {
    setLoading("attchforward");
    const attachments = await Promise.all(
      attachIds.map(async (fileId) => {
        const response =
          fileId !== "" &&
          (await api
            .get(`/project/document/${fileId.replace(/\s/g, "").split(",")}`)
            .then((result) => {
              return result.data;
            })
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
    await api.get(`/file/get?path=${filePath}`).then((response) => {
      const a = document.createElement("a"); // Create <a>
      a.href = `data:application/octet-stream;base64,${response.data.content}`; // File Base64 Goes here
      a.download = response.data.file_name; // File name Here
      a.click(); // Downloaded file
    });
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
            updateSignature={updateSignature}
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
                  {attachmentList?.map((attachment, index) => {
                    return (
                      <li key={index} className="attachments-uploaded-item">
                        <div
                          alt={attachment.name ?? attachment.document_name}
                          className={`attachments-uploaded-card ${
                            attachment.upload === "uploaded"
                              ? "loaded-attachment"
                              : "load-attachment"
                          } ${attachment.error && "loaderror-attachment"}`}
                        >
                          <span
                            className="name"
                            onClick={() =>
                              attachment.file_path &&
                              handleDownload(attachment.file_path)
                            }
                          >
                            {attachment.name ?? attachment.document_name}
                          </span>
                          {attachment.name?.length > 11 && (
                            <span className="name">{attachment.ext ?? ""}</span>
                          )}{" "}
                          {attachment.error && (
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
                    );
                  })}
                  {attachsAssetList?.map((attachment, index) => {
                    return (
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
                                const newAttachmentList =
                                  attachsAssetList.filter((item) => {
                                    return item.id !== attachment.id;
                                  });
                                setAttachsAssetList(newAttachmentList);
                              }}
                              title="Remove"
                            >
                              close
                            </i>
                          </button>
                        </div>
                      </li>
                    );
                  })}
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

              <div className="options-template">
                <label htmlFor="template">Use a template?</label>
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
              </div>
              {loading === "usetemplate" || loading === "templatelist" ? (
                <SliderLoading fitLoad />
              ) : (
                <div className="options-checkbox">
                  <div className="options-comms-div">
                    <div className="chck-center options-comms-divisor max-wdt-ext">
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
                      <>
                        <div className="options-email-subject flex-bas-subj">
                          <label>Subject:</label>
                          <input
                            id="subject"
                            name="subject"
                            type="text"
                            {...register("subject")}
                          />
                        </div>
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
                        <div className="chck-center">
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
                        <div className="chck-center">
                          <input
                            id="reminderDate"
                            type="checkbox"
                            name="reminderDate"
                            disabled
                            {...register("reminderDate")}
                          />
                          <label htmlFor="reminder">Set a reminder date?</label>{" "}
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
                      </>
                    )}
                  </div>
                  {watch("emailExternal") && (
                    <div className="emails-fields">
                      <div className="options-email-to">
                        <label>To:</label>
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
                        {errors.to && (
                          <p className="text-warning text-error">
                            {errors.to.message}
                          </p>
                        )}
                      </div>
                      <div className="options-email-ccs">
                        <label>Cc:</label>
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
                        {errors.ccs && (
                          <p className="text-warning text-error">
                            {errors.ccs.message}
                          </p>
                        )}
                      </div>
                      {watch("addBccField") && (
                        <div className="options-email-ccs">
                          <label>Bcc:</label>
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
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {statusMsg && (
        <p
          className={`sent-warning ${
            statusMsg.includes("successfully") ? "text-success" : "text-error"
          }`}
        >
          {statusMsg}
        </p>
      )}

      {isHandlePmTaskModal && (
        <Modal
          modalInSlider
          closeModal={() => {
            setIsHandlePmTaskModal(false);
          }}
          title="Send Message"
          body={
            <SendMessagePmTaskModal
              send={() => {
                sendChat(getValues(), true);
              }}
              finish={() => {
                changeTaskStatus("finish", taskId, 4);
              }}
              close={() => {
                setIsHandlePmTaskModal(false);
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
          }}
          title="Add users to task?"
          body={
            <AddUserToTask
              taskId={taskId}
              close={() => setAddUsersToTaskModal(false)}
              finish={() => {
                updateMembers();
                sendChat(getValues(), true);
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
