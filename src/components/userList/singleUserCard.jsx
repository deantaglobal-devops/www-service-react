import React from "react";
import { api } from "../../services/api";

class SingleUserCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  removeUser(userId, taskId) {
    api
      .post("/task/remove/user", {
        userId,
        taskId,
      })
      .then(() => {
        this.props.updateUserList();
      })
      .catch((err) => {
        console.log(err);
        parentCard.classList.remove("removing");
      });
  }

  sendNewUsersToRemove(level, event) {
    // for fade out effect
    const whatWasClicked = event.target;
    const parentCard = whatWasClicked.closest("li");
    parentCard.classList.add("removing");

    if (level === "task") {
      this.removeUser(this.props.userId, this.props.taskid, parentCard);
    }
  }

  render() {
    return (
      <li
        // if Card is Simple - add class
        className={this.props.simplecard ? "user-card simple" : "user-card"}
      >
        <img
          src={this.props.userPhoto}
          alt={`${this.props.userFirstName} ${this.props.userLastName}`}
          title={`${this.props.userFirstName} ${this.props.userLastName}`}
        />

        <div>
          <h3>{`${this.props.userFirstName} ${this.props.userLastName}`}</h3>

          {
            // Only if "complex" card
            !this.props.simplecard && (
              <p className="role">{this.props.userRole}</p>
            )
          }
        </div>

        {/* If permission to delete user  */}
        {!!this.props.deletepermission && (
          <button
            type="button"
            onClick={() => this.sendNewUsersToRemove(this.props.level, event)}
            className="remove-user"
            title={`Remove from this ${this.props.level}`}
          >
            <i className="material-icons-outlined">delete</i>
          </button>
        )}
      </li>
    );
  }
}

export default SingleUserCard;
