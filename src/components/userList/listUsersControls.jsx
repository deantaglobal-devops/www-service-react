/* ListUsersControls Component
 */
import React from "react";

class ListUsersControls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="secondary-navigation">
        {!!parseInt(this.props.permissions.add) && (
          <button
            onClick={() => this.props.openModal()}
            className="add-new-users"
          >
            <i className="material-icons-outlined">add</i>Add existing project
            member(s) to this task
          </button>
        )}

        {!!parseInt(this.props.permissions.invite) && (
          <button
            onClick={() => this.props.openInviteModal()}
            className="invite-new-users"
          >
            <i className="material-icons-outlined">add</i>Invite new user
          </button>
        )}
        <div
          id="modalContainer"
          className="inviteUsers listUsers modalContainer"
        />
      </div>
    );
  }
}

export default ListUsersControls;
