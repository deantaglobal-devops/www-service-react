import React from "react";
import { api } from "../services/api";

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsersList: [],
      completeUsersList: this.props.completeUsersList,
      searchEmpty: true,
      loading: false,

      // Who's already in the project or task
      usersAlreadyIn:
        this.props.level === "project"
          ? this.props.projectUserList
          : this.props.taskList,
      usersListFiltered: [],
    };
  }

  componentDidMount() {
    // List of Users to actually show in the selectable list.
    // Remove people Who are already on the project / task

    if (this.state.completeUsersList) {
      let userListToShow = this.state.completeUsersList.filter(
        (user) => !this.state.usersAlreadyIn.find(({ id }) => user.id === id),
      );

      userListToShow = userListToShow.filter(
        (user, index, self) =>
          index ===
          self.findIndex((t) => t.id === user.id && t.name === user.name),
      );

      this.setState({
        completeUsersList: userListToShow,
        usersListFiltered: userListToShow,
        // searchEmpty: true
      });
    }
  }

  // Searching through list
  activateElement(e) {
    this.setState({
      validationMessage: false,
    });

    const element = e.currentTarget;
    const userId = element.getAttribute("id");
    const completeUsersListCopy = [...this.state.completeUsersList];
    const newUser = completeUsersListCopy.filter((user) => {
      if (user.id === userId) {
        return user;
      }
    });
    const newUsersListCopy = [...this.state.newUsersList];
    if (element.classList.contains("active")) {
      element.classList.remove("active");
      const newUsersListWithoutUser = newUsersListCopy.filter((user) => {
        if (user.id !== userId) {
          return user;
        }
      });
      this.setState({
        newUsersList: newUsersListWithoutUser,
      });
    } else {
      element.classList.add("active");
      newUsersListCopy.push(newUser[0]);
      this.setState({
        newUsersList: newUsersListCopy,
      });
    }
  }

  // What to do when hit "Add User"
  sendNewUsersToAdd(level) {
    if (this.state.newUsersList.length === 0) {
      this.setState({
        validationMessage: true,
      });
      return;
    }

    this.setState({ loading: true });

    if (this.state.newUsersList.length > 0) {
      this.state.newUsersList.forEach((newUser, index) => {
        const body =
          level === "task"
            ? { taskId: this.props.taskId, taskUser: newUser.id }
            : { projectId: this.props.projectId, userId: newUser.id };

        if (level === "task") {
          api
            .post("/task/assign", body)
            .then(() => {
              if (index === this.state.newUsersList.length - 1) {
                // this.setState = this.state;
                // this.props.updateUserList(); - WIP - can't do this
                // this.props.showModal("added");  // - WIP - throwing an error
                this.props.update();
                this.setState({ loading: false });

                if (this.props.updateUserList) {
                  this.props.updateUserList();
                  if (this.props.showModal) {
                    this.props.showModal("added");
                  }
                } else if (!this.props.isMessagingArea) {
                  window.location.reload();
                } else {
                  this.props.showModal("added");
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          api
            .post("/project/assign/user", body)
            .then(() => {
              if (index === this.state.newUsersList.length - 1) {
                window.location.reload();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  }

  startSearching(e) {
    const input = e.currentTarget.value.toLowerCase();
    if (input !== "") {
      this.setState({
        searchEmpty: false,
        validationMessage: false,
      });
    } else {
      this.setState({
        searchEmpty: true,
        validationMessage: false,
      });
    }

    // we are forcing the result to be updated with the filtered list by changing it to an empty array first so we avoid the cached data
    this.setState(
      {
        usersListFiltered: [],
        searchTerm: input,
      },
      () => {
        const filteredResult = this.state.completeUsersList.filter((user) => {
          if (
            (user.name && user.name.toLowerCase().includes(input)) ||
            (user.surname && user.surname.toLowerCase().includes(input)) ||
            (user.lastname && user.lastname.toLowerCase().includes(input))
          ) {
            return true;
          }
        });
        this.setState({
          usersListFiltered: filteredResult,
        });
      },
    );
  }

  clearSearch(e) {
    const userListToShow = this.state.completeUsersList.filter(
      (user) => !this.state.usersAlreadyIn.find(({ id }) => user.id === id),
    );

    this.setState({
      searchEmpty: true,
      searchTerm: "",
      completeUsersList: userListToShow,
      usersListFiltered: userListToShow,
    });
  }

  render() {
    const { showCancelButton } = this.props;
    return (
      <div id="userList">
        <div className="user-search">
          {this.state.searchEmpty === true ? (
            <i className="material-icons">search</i>
          ) : (
            <button
              className="deanta-button clear-search"
              title="Clear Search"
              aria-label="Clear Search"
              onClick={() => this.clearSearch()}
            >
              <i className="material-icons">close</i>
            </button>
          )}

          <input
            className="navbar-search form-control"
            type="text"
            placeholder="Search for someone..."
            aria-label="Search"
            value={this.state.searchTerm ?? ""}
            onChange={(e) => this.startSearching(e)}
          />
        </div>
        {this.state.validationMessage === true && (
          <div style={{ color: "var(--danger)" }}>
            Please select at least one user to add
          </div>
        )}
        <div className="user-list">
          <ul>
            {this.state.usersListFiltered.length > 0
              ? this.state.usersListFiltered.map((user) => {
                  return (
                    <li
                      key={user.id}
                      className="user-card"
                      id={user.id}
                      onClick={(e) => this.activateElement(e)}
                    >
                      <div className="user-card-image">
                        <img
                          src={
                            user.avatar.includes("eu.ui-avatars.com")
                              ? user.avatar
                              : `${
                                  import.meta.env.VITE_URL_API_SERVICE
                                }/file/src/?path=${user.avatar}`
                          }
                        />
                      </div>
                      <div className="user-card-info">
                        <p className="user-card-name">
                          {user.name}{" "}
                          {user.surname ? user.surname : user.lastname}
                        </p>
                        {user.permissions && (
                          <p className="user-card-role">
                            {user.permissions.rol}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })
              : ""}

            {this.state.usersListFiltered.length === 0 && (
              <li>No users found</li>
            )}
          </ul>
        </div>

        <div className="save-button">
          {showCancelButton && (
            <button
              type="button"
              onClick={() => this.props.closeModal()}
              className="cancel btn btn-outline-primary"
            >
              Cancel
            </button>
          )}
          <button
            className="deanta-button-outlined save-users "
            disabled={this.state.loading}
            onClick={() => this.sendNewUsersToAdd(this.props.level)}
          >
            {!this.state.loading ? (
              `Add ${this.state.newUsersList.length <= 1 ? "User" : " Users"}`
            ) : (
              <i className="material-icons-outlined loading-icon-button">
                sync
              </i>
            )}
          </button>
        </div>
      </div>
    );
  }
}

export default UserList;
