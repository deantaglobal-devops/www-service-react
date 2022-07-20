import { useState, useEffect } from "react";
import ListUsersControls from "./listUsersControls";
import SingleUserCard from "./singleUserCard";

export function ListUsers(props) {
  const [removedDuplicatedUsers, setRemovedDuplicatedUsers] = useState([]);

  useEffect(() => {
    const membersList = props?.taskMemberList.filter(
      (user, index, self) =>
        index ===
        self.findIndex((t) => t.id === user.id && t.name === user.name),
    );

    setRemovedDuplicatedUsers(membersList);
  }, [props]);

  return (
    <>
      {removedDuplicatedUsers.length !== 0 && props?.membersLoaded === true && (
        <ul
          className={
            props?.simplecard === true ? "member-list simple" : "member-list"
          }
        >
          {removedDuplicatedUsers.map((user) => {
            return (
              <SingleUserCard
                {...props}
                key={user.id}
                userId={user.id}
                userFirstName={user.name}
                userLastName={user.lastname}
                userRole={user.permissions.rol}
                deletepermission={props?.permissions.delete}
                userPhoto={user.avatar}
              />
            );
          })}
        </ul>
      )}

      {removedDuplicatedUsers.length === 0 && <p>No Task Members</p>}

      {props?.membersLoaded === false &&
        removedDuplicatedUsers.length !== 0 && <p>Loading...</p>}

      {props?.membersLoaded === true && (
        <ListUsersControls {...props} permissions={props.permissions} />
      )}

      {/* }End if */}
    </>
  );
}
