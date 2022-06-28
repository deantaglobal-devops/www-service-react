import React from "react";
import ReactDOM from "react-dom";
import ModalPopOver from "../modalPopOver";
import UserList from "../userList";
import InviteNewUserForm from "../inviteNewUserForm";

class ListUsersPortal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ListUsersPortalElement = document.querySelector(
      `.member-modal-${this.props.taskid}`,
    );

    return ListUsersPortalElement ? (
      ReactDOM.createPortal(
        // passing in data attributes from HTML element as props to the components inside the render method

        <>
          {this.props.isModalOpen && (
            <ModalPopOver
              modalTitle="Add Users"
              closeModal={this.props.closeModal}
            >
              <UserList
                showCancelButton
                completeUsersList={this.props.completeUsersList}
                level={this.props.level}
                projectId={this.props.projectid}
                projectUsersList={this.props.completeMemberList}
                taskId={this.props.taskid}
                taskList={this.props.taskMemberList}
                closeModal={this.props.closeModal}
                updateUserList={this.props.updateUserList}
              />
            </ModalPopOver>
          )}

          {this.props.isInviteModalOpen && (
            <ModalPopOver
              modalTitle="Invite New User"
              closeModal={this.props.closeModal}
            >
              <InviteNewUserForm
                userId={this.props.userId}
                hideHeader
                projectId={this.props.projectid}
                taskId={this.props.taskid}
                client={this.props.client}
                clientId={this.props.clientId}
                companyId={this.props.companyId}
                // updateUserList={this.props.updateUserList}
              />
            </ModalPopOver>
          )}
        </>,
        ListUsersPortalElement,
      )
    ) : (
      <></>
    );
  }
}

export default ListUsersPortal;

// const InnerPortal = styled.div`
// background: rgba(0,0,0,0.2);
// width: 600px;
// display: flex;
// flex-direction: column;
// `;
