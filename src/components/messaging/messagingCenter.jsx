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

  const [loading, setLoading] = useState(false);
  const [slider, setSlider] = useState({
    SliderHeader: "",
    SliderWidth: "big",
    SliderStatus: true,
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
                updateMessages={() =>
                  getMessages(user.realCompanyId, props.taskId)
                }
                updateMembers={() => getMembers(props.taskId)}
                replyMsgId={replyMsgId}
                reply={reply}
                setReply={setReply}
                forward={forward}
                setForward={setForward}
                attachForm={attachForm}
                setAttachForm={setAttachForm}
              />
            </>
          ) : (
            <SliderLoading />
          )}
        </div>
      </SideSlider>
    );
  }
}
