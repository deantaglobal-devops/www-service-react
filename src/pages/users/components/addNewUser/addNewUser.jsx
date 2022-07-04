import UserList from "../../../../components/userList";

export default function AddNewUser(props) {
  return (
    <div className="popover fade bs-popover-right show with-scroll">
      <div className="arrow" />
      <div className="popover-header">
        <h3 className="title-popover">Add Users</h3>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => props?.closeModal()}
        >
          <i className="material-icons">close</i>
        </button>
      </div>

      <div className="popover-body" id="popover-body">
        <UserList
          completeUsersList={props?.completeUsersList}
          level={props?.level}
          projectId={props?.projectId}
          projectUserList={props?.projectUserList}
          showCancelButton
          taskId={props?.taskId}
          taskList={props?.taskMemberList}
          updateUserList={props?.updateUserList}
          closeModal={props?.closeModal}
        />
      </div>
    </div>
  );
}
