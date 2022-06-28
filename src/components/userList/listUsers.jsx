/* UserList Component (Parent of SingleUserCard.js)
 */
import React from "react";
import SingleUserCard from "./singleUserCard";
import ListUsersControls from "./listUsersControls";

class ListUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {}

  render() {
    const howManyMembers = this.props.taskMemberList.length;
    let removeDuplicatedUsers = this.props.taskMemberList;

    removeDuplicatedUsers = removeDuplicatedUsers.filter(
      (user, index, self) =>
        index ===
        self.findIndex((t) => t.id === user.id && t.name === user.name),
    );

    return (
      <>
        {howManyMembers !== 0 && this.props.membersLoaded === true && (
          <ul
            className={
              this.props.simplecard === true
                ? "member-list simple"
                : "member-list"
            }
          >
            {removeDuplicatedUsers.map((user) => {
              return (
                <SingleUserCard
                  {...this.props}
                  {...this.state}
                  key={user.id}
                  userId={user.id}
                  userFirstName={user.name}
                  userLastName={user.lastname}
                  userRole={user.permissions.rol}
                  deletepermission={this.props.permissions.delete}
                  userPhoto={user.avatar}
                ></SingleUserCard>
              );
            })}
          </ul>
        )}

        {howManyMembers === 0 && this.props.membersLoaded === true ? (
          <p>No Task Members</p>
        ) : (
          ""
        )}

        {this.props.membersLoaded === false && <p>Loading...</p>}

        {this.props.membersLoaded === true && (
          <ListUsersControls
            {...this.props}
            {...this.state}
            permissions={this.props.permissions}
          />
        )}

        {/* }End if */}
      </>
    );
  }
}

export default ListUsers;
