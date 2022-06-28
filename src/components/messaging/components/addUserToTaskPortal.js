import React from "react";
import ReactDOM from "react-dom";
import { api } from "../../../services/api";
import Modal from "../../modal";
import BasicButtonsSet from "../../basicButtonsSet";

class AddUserToTaskPortal extends React.Component {
  constructor(props) {
    super(props);

    this.sendEmailWithoutAddingUsers =
      this.sendEmailWithoutAddingUsers.bind(this);
    this.sendEmailAfterAddingUsers = this.sendEmailAfterAddingUsers.bind(this);
    this.addUsersToTask = this.addUsersToTask.bind(this);
  }

  sendEmailWithoutAddingUsers() {
    this.props.hideAddUsersToTaskModal();
    this.props.sendComposedMessage(this.props.sendEmailAndFinishTask);
  }

  async sendEmailAfterAddingUsers() {
    const addingUserToTaskResults = await this.addUsersToTask();

    // If all were successful
    if (!addingUserToTaskResults.includes("fail")) {
      this.props.hideAddUsersToTaskModal();
      this.props.sendComposedMessage();

      this.props.updateUsersInStateFunc();
    } else {
    }
  }

  async addUsersToTask() {
    const usersToAddToTaskIds = this.props.usersToAddToTask.map((user) => {
      return user.id;
    });

    const membersAdded = await Promise.all(
      usersToAddToTaskIds.map(async (id) => {
        const body = { taskId: this.props.taskId, taskUser: id };
        const response = await api
          .post("/task/assign", body)
          .then((response) => {
            if (response.data.status === "success") {
              return "success";
            }
            return "fail";
          })
          .catch((err) => console.log(err));
        return response;
      }),
    );

    return membersAdded;
  }

  render() {
    const addUserToTaskPortalEl = document.querySelector(
      "#messagingRoomModalContainer",
    );

    let userEmails = this.props.usersToAddToTask.map((user) => {
      return user.email.toLowerCase();
    });

    userEmails = userEmails.join(", ");

    // Multiple Users Boolean
    const multipleUsers = this.props.usersToAddToTask.length > 1;

    if (multipleUsers) {
      // if multiple users on the list, add "&" for last one

      // find index of last commma
      const intIndex = userEmails.lastIndexOf(",");
      userEmails = `${userEmails.substring(
        0,
        intIndex,
      )} & ${userEmails.substring(intIndex + 1)}`;
    }

    // Conditionally render content based on number of people
    const title = `Add ${multipleUsers ? "Users" : "User"} to task?`;
    const body = (
      <>
        <p>
          The {multipleUsers ? "users" : "user"}, {userEmails},{" "}
          {multipleUsers ? "are members" : "is a member"} of this project but{" "}
          {multipleUsers ? "are" : "is"} not currently{" "}
          {multipleUsers ? "members" : "a member"} of this task.
        </p>

        <p>
          Before sending this message as an email, would you like to add them to
          this task?
        </p>
      </>
    );

    const cancelButtonText = `Dont Add ${multipleUsers ? "Users" : "User"}`;
    const actionText = `Add ${multipleUsers ? "Users" : "User"} to Task`;

    return addUserToTaskPortalEl ? (
      ReactDOM.createPortal(
        // Prompts a modal if user(s) are part of the project but NOT part of the task currently.

        <Modal
          modalInSlider
          closeModal={this.props.hideAddUsersToTaskModal}
          title={title}
          body={body}
          footer={
            <BasicButtonsSet
              loadingButtonAction={false}
              disableButtonAction={false}
              cancelButtonText={cancelButtonText}
              cancelButtonAction={this.sendEmailWithoutAddingUsers}
              actionText={actionText}
              buttonAction={this.sendEmailAfterAddingUsers}
            />
          }
        />,
        addUserToTaskPortalEl,
      )
    ) : (
      <></>
    );
  }
}

export default AddUserToTaskPortal;
