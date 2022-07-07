import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { api } from "../../../services/api";
import Modal from "../../modal";
import ForwardTask from "./forwardTask";
import ForwardAttach from "./forwardAttach";
import InfoDetails from "./infoDetails";

export default function Message({ ...props }) {
  const [infoDetailsModal, setInfoDetailsModal] = useState(false);
  const [sendTaskModal, setSendTaskModal] = useState(false);
  const [forwardAttachmentsModal, setForwardAttachmentsModal] = useState(false);

  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAttachs();
  }, []);

  async function getAttachs() {
    setLoading(true);
    const attachIds = props.message?.attachments?.split(/\s*,\s*/) || [];

    const attachments = await Promise.all(
      attachIds.map(async (fileId) => {
        const response =
          fileId !== "" &&
          (await api
            .get(`/project/document/${fileId}`)
            .then((result) => {
              return result.data;
            })
            .catch((error) => {
              console.log(error);
            }));
        return response;
      }),
    ).finally(() => {
      setLoading(false);
    });

    setAttachmentsList(attachments !== undefined ? attachments : []);
  }

  async function fileDownloadAction(filePath, fileName) {
    await api.get(`/file/get?path=${filePath}`).then((response) => {
      const a = document.createElement("a"); // Create <a>
      a.href = `data:application/octet-stream;base64,${response.data.content}`; // File Base64 Goes here
      a.download = response.data.file_name; // File name Here
      a.click(); // Downloaded file
    });
  }

  return (
    <div className="message" id={props.message.id}>
      <div className="message-header header-actions-msg">
        <div className="message-header">
          {props.message.creatorData.avatar ? (
            <img
              className="avatar-thumb"
              src={`/file/src/?path=${props.message.creatorData.avatar}`}
            />
          ) : (
            <div className="no-avatar">
              {props.message.creatorData.name.slice(0, 1)}
              {props.message.creatorData.lastname.slice(0, 1)}
            </div>
          )}

          <div>
            <div className="sender-name">
              {props.message.externalFrom !== ""
                ? props.message.externalFrom
                : `${props.message.creatorData.name} ${props.message.creatorData.lastname}`}
            </div>

            <div className="sender-timestamp">
              {moment(new Date(props.message.createdAt)).format(
                "DD/MM/yyyy HH:mm",
              )}
            </div>
          </div>
        </div>

        <div className="message-header">
          <button
            className="message-header-info deanta-button"
            title="More info"
            onClick={() => {
              setInfoDetailsModal(true);
            }}
          >
            <i className="material-icons-outlined">info</i>
          </button>
          {!loading ? (
            <>
              {props.message.toAddresses !== "" && (
                <React.Fragment key={props.message.id}>
                  <button
                    type="button"
                    className="message-header-reply deanta-button"
                    title="Reply"
                    onClick={() => {
                      props.reply(props.message.toAddresses);
                      props.replyMsgId(props.message.id);
                    }}
                  >
                    <i className="material-icons-outlined">reply</i>
                  </button>
                  <button
                    type="button"
                    className="message-header-reply-all deanta-button"
                    title="Reply All"
                    onClick={() => {
                      props.reply(
                        `${props.message.ccAddresses},${props.message.toAddresses}`,
                      );
                      props.replyMsgId(props.message.id);
                    }}
                  >
                    <i className="material-icons-outlined">reply_all</i>
                  </button>
                  <button
                    className="message-header-reply-all deanta-button"
                    title="Forward"
                    onClick={() => {
                      props.forward(
                        props.message.content,
                        props.message.attachments,
                      );
                    }}
                  >
                    <i className="material-icons-outlined">forward</i>
                  </button>
                </React.Fragment>
              )}
              <button
                className="message-header-info deanta-button"
                title="Send to another task"
                onClick={() => {
                  setSendTaskModal(true);
                }}
              >
                <i className="material-icons-outlined">forward_to_inbox</i>
              </button>

              {props.message.attachments &&
                props.message.attachments.length > 0 && (
                  <div className="message-header-attachments">
                    <button
                      className="deanta-button formatting-button formatting-attachment"
                      onClick={() => {
                        setShowAttachments(!showAttachments);
                      }}
                    >
                      <i className="material-icons-outlined">attach_file</i>{" "}
                      {!showAttachments ? "Show" : "Hide"}{" "}
                      {attachmentsList.length} Attachment
                      {attachmentsList.length > 1 && "s"}
                    </button>
                  </div>
                )}
            </>
          ) : (
            <i className="material-icons-outlined loading-icon-button">sync</i>
          )}
        </div>
      </div>
      <div className="message-body">
        {props.message.isReply === "1" && (
          <div className="message-body-reply">
            <p>
              In reply to{" "}
              <Link to={`#${props.message.messageIdRelated}`}>
                this message
              </Link>
            </p>
          </div>
        )}
        {props.message.subject !== null && props.message.subject !== "" && (
          <p className="message-subject">Subject : {props.message.subject}</p>
        )}
        <p
          className="message-paragraph"
          dangerouslySetInnerHTML={{ __html: props.message.content }}
        />
        {showAttachments && (
          <div className="message-body-attachments">
            <ul className="message-attachments-list">
              {attachmentsList?.map((element) => {
                return (
                  <li
                    key={element.document_id + element.document_name}
                    className="message-attachments-item"
                  >
                    <a
                      href="#"
                      onClick={() =>
                        fileDownloadAction(
                          element.document_path,
                          element.document_name,
                        )
                      }
                    >
                      <i className="material-icons-outlined">attach_file</i>
                      {element.document_name}
                    </a>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => {
                setForwardAttachmentsModal(!forwardAttachmentsModal);
              }}
              className="deanta-button forward-attachment"
            >
              <i className="material-icons-outlined">keyboard_arrow_right</i>
              Send above attachment
              {attachmentsList.length > 1 && "s"} to another task
            </button>
          </div>
        )}
      </div>

      {sendTaskModal && (
        <Modal
          modalInSlider
          title="Send message to task"
          body={<ForwardTask {...props} />}
          closeModal={() => {
            setSendTaskModal(false);
          }}
        />
      )}

      {forwardAttachmentsModal && (
        <Modal
          modalInSlider
          title="Forward attachments"
          body={<ForwardAttach {...props} attachments={attachmentsList} />}
          closeModal={() => {
            setForwardAttachmentsModal(false);
          }}
        />
      )}

      {infoDetailsModal && (
        <Modal
          modalInSlider
          title="Message Recipients"
          body={<InfoDetails {...props} />}
          footer={
            <div className="deanta-button-container">
              <button
                className="deanta-button deanta-button-outlined"
                onClick={() => setInfoDetailsModal(false)}
              >
                Dismiss
              </button>
            </div>
          }
          closeModal={() => {
            setInfoDetailsModal(false);
          }}
        />
      )}
    </div>
  );
}
