import Message from "./messageItem";

export default function MessagingBodyNew({ ...props }) {
  const { messageList } = props;

  return (
    <>
      {messageList.length > 0 ? (
        <div id="historyArea">
          <ul className="messages-list">
            {messageList
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((message, index) => {
                return (
                  <li
                    key={index}
                    id={message.id}
                    className="messages-list-item "
                  >
                    <Message message={message} {...props} />
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        <div>
          <div className="empty-msg">
            <span className="material-icons-outlined icon">inbox</span>
            <span>No message yet</span>
          </div>
        </div>
      )}
    </>
  );
}
