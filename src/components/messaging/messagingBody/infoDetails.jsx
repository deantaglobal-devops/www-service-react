import moment from "moment";

function InfoDetails({ ...props }) {
  const { message, memberList } = props;

  const toEmailedList = message?.toAddresses?.split(",") || [];
  const ccEmailedList = message?.ccAddresses?.split(",") || [];

  return (
    <div className="deanta-modal-messageInfo">
      <p className="messageInfo-paragraph">
        Sent at {moment(message.createdAt).format("HH:mm [on] DD/MM/YYYY ")} to:
      </p>
      <ul className="messageInfo-list">
        <li className="messageInfo-list-item">
          <h4 className="messageInfo-subtitle">Task members:</h4>
          <ul className="messageInfo-list">
            {memberList?.length > 0
              ? memberList.map((member, index) => (
                  <li key={index} className="messageInfo-sublist-item">
                    {member.name} {member.lastname}
                  </li>
                ))
              : "No members"}
          </ul>
        </li>

        {toEmailedList.length > 0 && (
          <li className="messageInfo-list-item">
            <h4 className="messageInfo-subtitle">Emailed to:</h4>
            <ul className="messageInfo-list">
              {toEmailedList.map((to, index) => {
                return (
                  <li key={index} className="messageInfo-sublist-item">
                    {to}
                  </li>
                );
              })}
            </ul>
          </li>
        )}
        {ccEmailedList.length > 0 && (
          <li className="messageInfo-list-item">
            <h4 className="messageInfo-subtitle">CC'd:</h4>
            <ul className="messageInfo-list">
              {ccEmailedList.map((cc, index) => {
                return (
                  <li key={index} className="messageInfo-sublist-item">
                    {cc}
                  </li>
                );
              })}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}

export default InfoDetails;
