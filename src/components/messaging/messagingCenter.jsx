import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";

import MessagingHeader from "./messagingHeader/index";
import MessagingBodyNew from "./messagingBody/index";
import MessagingArea from "./messagingArea/index";

import SideSlider from "../sideSlider/SideSlider";
import SliderLoading from "../sliderLoading/SliderLoading";

import "../../styles/style-messaging.css";

export default function MessagingCenter(props) {
  const { taskId, handleCloseModal } = props;
  const { user } = useAuth();

  const [messageList, setMessageList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [reply, setReply] = useState("");
  const [replyMsgId, setReplyMsgId] = useState("");
  const [forward, setForward] = useState("");
  const [attachForm, setAttachForm] = useState("");

  // const [lastTimeRetrieved, setLastTimeRetrieved] = useState(
  //   Math.floor(Date.now() / 1000),
  // );
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState({
    SliderHeader: "",
    SliderWidth: "big",
    SliderStatus: true,
  });

  async function getMessages(companyId, taskId) {
    setLoading(true);
    await api
      .get(`/messages/${companyId}/${taskId}`)
      .then((result) => {
        setMessageList(result.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function updateMessages() {
    getMessages(user.realCompanyId, taskId);
    // setLastTimeRetrieved(Math.floor(Date.now() / 1000));
  }

  async function getMembers(taskId) {
    setLoading(true);
    if (taskId !== undefined) {
      await api
        .get(`/task/${taskId}/users`)
        .then((result) =>
          setMemberList(
            result.data?.filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.id === value.id),
            ),
          ),
        )
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }

  // Clean message status
  useEffect(() => {
    setTimeout(() => {
      setStatusMsg("");
    }, 5000);
  }, [statusMsg]);

  useEffect(() => {
    getMessages(user.realCompanyId, taskId);
    getMembers(taskId);
  }, [taskId]);

  // async function getNewMessages(companyId, taskId, lastTimeRetrieved) {
  //   return api
  //     .get(`/messages/${companyId}/${taskId}/${lastTimeRetrieved}`)
  //     .then((response) => {
  //       if (
  //         response.data.length !== 0 &&
  //         response.data.failure_data.failure_id !== undefined &&
  //         response.data.failure_data.failure_id !== null
  //       ) {
  //         updateFailureNotifications(response.data);
  //       }
  //       return response.data;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       return [];
  //     });
  // }

  // function updateFailureNotifications(failureEmailData) {
  //   const description = `Delivery has failed to these recipients or groups ${failureEmailData.failure_data.failure_id}`;

  //   const date = Date.now();

  //   const msg = {
  //     company_id: failureEmailData.failure_data.company_id,
  //     creation_date: date,
  //     description,
  //     link: `${window.location.origin}/project/${failureEmailData.failure_data.project_id}`,
  //     milestone_id: failureEmailData.failure_data.milestone_id,
  //     type: "Communications",
  //     project_id: failureEmailData.failure_data.project_id,
  //     seen: "0",
  //     task_id: failureEmailData.failure_data.task_id,
  //     title: description,
  //     update_date: date,
  //     user_id: failureEmailData.failure_data.user_id,
  //     category: failureEmailData.failure_data.project_name,
  //   };

  //   const currentURL = window.location.pathname;
  //   if (currentURL.includes("/journal/")) {
  //     msg.link = `${window.location.origin}/project/journal/${failureEmailData.failure_data.project_id}/detail/${failureEmailData.failure_data.chapter_id}`;
  //   }

  //   const bodyRequest = {
  //     userId: failureEmailData.failure_data.user_id,
  //     companyId: failureEmailData.failure_data.company_id,
  //     milestoneId: failureEmailData.failure_data.milestone_id,
  //     taskId: failureEmailData.failure_data.task_id,
  //     channel: "communications-broadcast",
  //     type: "Communications",
  //     description,
  //     category: projectName,
  //     title: description,
  //     projectId,
  //   };
  //   api.post("/notifications/add", bodyRequest);
  //   // fetch(`/push/notifications/communications`, {
  //   //   method: 'POST',
  //   //   mode: 'no-cors',
  //   //   body: JSON.stringify(msg),
  //   // })
  //   //   .then((res) => res.json())
  //   //   .catch((err) => console.log(err));
  // }

  // async function updateUserLastLogin(companyId, taskId, userId, timeUpdated) {
  //   await api
  //     .post("/messages/updateUserLastLogin", {
  //       companyId,
  //       taskId,
  //       userId,
  //       timeUpdated,
  //     })
  //     .then((res) => {
  //       return res.data;
  //     });
  // }

  // useEffect(() => {
  // const intervalId = setInterval(() => {
  // const timeUpdated = Math.floor(Date.now() / 1000);
  // setLastTimeRetrieved(timeUpdated);
  // updateUserLastLogin(user.realCompanyId, taskId, user.id, timeUpdated);
  // }, 7500);

  // return () => clearInterval(intervalId);
  // });

  if (slider.SliderStatus) {
    return (
      <SideSlider
        SIDESLIDER_PROPS={slider}
        showSlider={() => {
          setSlider({ ...slider, SliderStatus: false });
          handleCloseModal();
        }}
        draggable
        toolTipMsgIntro="This button allow you resize this modal horizontally"
      >
        <div id="messaging-room">
          {!loading ? (
            <>
              <MessagingHeader
                memberList={memberList}
                updateMembers={() => getMembers(taskId)}
                {...props}
              />
              <MessagingBodyNew
                {...props}
                memberList={memberList}
                messageList={messageList}
                reply={(to) => setReply(to)}
                replyMsgId={(id) => setReplyMsgId(id)}
                forward={(message, _attach) => {
                  setForward(message);
                  setAttachForm(_attach);
                }}
              />

              <MessagingArea
                {...props}
                memberList={memberList}
                hasMessage={messageList.length}
                updateMessages={() => {
                  getMessages(user.realCompanyId, taskId);
                  updateMessages();
                }}
                updateMembers={() => getMembers(taskId)}
                replyMsgId={replyMsgId}
                reply={reply}
                setReply={setReply}
                forward={forward}
                setForward={setForward}
                attachForm={attachForm}
                setAttachForm={setAttachForm}
                setStatusMsg={setStatusMsg}
              />
            </>
          ) : (
            <SliderLoading />
          )}
          {statusMsg && (
            <p
              className={`sent-warning ${
                statusMsg.includes("successfully")
                  ? "text-success"
                  : "text-error"
              }`}
            >
              {statusMsg}
            </p>
          )}
        </div>
      </SideSlider>
    );
  }
}
