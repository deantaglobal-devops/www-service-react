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
  const { user } = useAuth();

  const [messageList, setMessageList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [reply, setReply] = useState("");
  const [replyMsgId, setReplyMsgId] = useState("");
  const [forward, setForward] = useState("");
  const [attachForm, setAttachForm] = useState("");

  const [lastTimeRetrieved, setLastTimeRetrieved] = useState(
    Math.floor(Date.now() / 1000),
  );
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState({
    SliderHeader: "",
    SliderWidth: "big",
    SliderStatus: true,
  });

  // Clean message status
  useEffect(() => {
    setTimeout(() => {
      setStatusMsg("");
    }, 5000);
  }, [statusMsg]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      reloadMessages(user.realCompanyId, props.taskId, lastTimeRetrieved);
      const timeUpdated = Math.floor(Date.now() / 1000);
      setLastTimeRetrieved(timeUpdated);
      updateUserLastLogin(
        user.realCompanyId,
        props.taskId,
        user.id,
        timeUpdated,
      );
    }, 7500);

    return () => clearInterval(intervalId);
  });

  useEffect(() => {
    getMessages(user.realCompanyId, props.taskId);
    getMembers(props.taskId);
  }, [props.taskId]);

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

  async function getNewMessages(companyId, taskId, lastTimeRetrieved) {
    return api
      .get(`/messages/${companyId}/${taskId}/${lastTimeRetrieved}`)
      .then((response) => {
        if (
          response.data.length !== 0 &&
          response.data.failure_data.failure_id !== undefined &&
          response.data.failure_data.failure_id !== null
        ) {
          updateFailureNotifications(response.data);
        }
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }

  function updateFailureNotifications(failureEmailData) {
    const description = `Delivery has failed to these recipients or groups ${failureEmailData.failure_data.failure_id}`;

    const date = Date.now();

    const msg = {
      company_id: failureEmailData.failure_data.company_id,
      creation_date: date,
      description,
      link: `${window.location.origin}/project/${failureEmailData.failure_data.project_id}`,
      milestone_id: failureEmailData.failure_data.milestone_id,
      type: "Communications",
      project_id: failureEmailData.failure_data.project_id,
      seen: "0",
      task_id: failureEmailData.failure_data.task_id,
      title: description,
      update_date: date,
      user_id: failureEmailData.failure_data.user_id,
      category: failureEmailData.failure_data.project_name,
    };

    const currentURL = window.location.pathname;
    if (currentURL.includes("/journal/")) {
      msg.link = `${window.location.origin}/project/journal/${failureEmailData.failure_data.project_id}/detail/${failureEmailData.failure_data.chapter_id}`;
    }

    const bodyRequest = {
      userId: failureEmailData.failure_data.user_id,
      companyId: failureEmailData.failure_data.company_id,
      milestoneId: failureEmailData.failure_data.milestone_id,
      taskId: failureEmailData.failure_data.task_id,
      channel: "communications-broadcast",
    };
    api.post("/notifications/add", bodyRequest);
    // fetch(`/push/notifications/communications`, {
    //   method: 'POST',
    //   mode: 'no-cors',
    //   body: JSON.stringify(msg),
    // })
    //   .then((res) => res.json())
    //   .catch((err) => console.log(err));
  }

  async function reloadMessages(companyId, taskId, lastTimeRetrieved) {
    const newMessages = await getNewMessages(
      companyId,
      taskId,
      lastTimeRetrieved,
    );
    const mergedArray = [...newMessages, ...messageList];

    const noDuplicanciesArray = mergedArray.filter(
      (message, index, self) =>
        self.findIndex((t) => t.id === message.id) === index,
    );

    if (newMessages.length > 0) {
      const messagesTop = document.getElementsByClassName("messages-list-item");
      const firstMessage = messagesTop[0];
      firstMessage?.scrollIntoView();
    }

    setMessageList(noDuplicanciesArray);
  }

  function updateMessages(time) {
    const newTime = time || lastTimeRetrieved;
    reloadMessages(user.realCompanyId, props.taskId, newTime);
    setLastTimeRetrieved(Math.floor(Date.now() / 1000));
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

  async function updateUserLastLogin(companyId, taskId, userId, timeUpdated) {
    const body = {
      companyId,
      taskId,
      userId,
      timeUpdated,
    };

    try {
      const response = await api.post("/messages/updateUserLastLogin", body);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  if (slider.SliderStatus) {
    return (
      <SideSlider
        SIDESLIDER_PROPS={slider}
        showSlider={() => {
          setSlider({ ...slider, SliderStatus: false });
          props.handleCloseModal();
        }}
        draggable
        toolTipMsgIntro="This button allow you resize this modal horizontally"
      >
        <div id="messaging-room">
          {!loading ? (
            <>
              <MessagingHeader
                memberList={memberList}
                updateMembers={() => getMembers(props.taskId)}
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
                  getMessages(user.realCompanyId, props.taskId);
                  updateMessages(lastTimeRetrieved);
                }}
                updateMembers={() => getMembers(props.taskId)}
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
