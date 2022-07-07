import React from "react";

import "./styles/notificationTab.styles.css";

class NotificationTab extends React.Component {
  constructor(props) {
    super(props);
  }

  storeInLocalStorage(event) {
    // event.preventDefault();

    const notificationInfo = {
      title: this.props.listofItems.title,
      project_id: this.props.listofItems.project_id,
      task_id: this.props.listofItems.task_id,
      milestone_id: this.props.listofItems.milestone_id,

      // task_id : this.props.listofItems.task_id
    };

    // console.log("stored!");
    // console.log(notificationInfo);
    // console.log(notificationInfo.title);

    window.localStorage.setItem(
      "notificationItemTitle",
      notificationInfo.title,
    );
    window.localStorage.setItem(
      "notificationItemProjectId",
      notificationInfo.project_id,
    );
    window.localStorage.setItem(
      "notificationItemTaskId",
      notificationInfo.task_id,
    );
    window.localStorage.setItem(
      "notificationItemMilestoneId",
      notificationInfo.milestone_id,
    );
  }

  onClick(event) {
    /// /
    ///
    // Below is just a nice error handling function
    if (typeof this.props.onClick !== "function") {
      console.error(
        `You need to pass a function as a Prop.
			eg. () => myFunction()
			
			eg. <MenuTab onClick={() => myFunction()}/>
			`,
      );
      return;
    }

    // event.preventDefault();
    this.storeInLocalStorage();

    // Bounce the onClick function back to parent
    this.props.onClick();
  }

  render() {
    return (
      <a
        href={this.props.link}
        onClick={(event) => this.onClick(event)}
        target="_blank"
        className="notificationTab notification-tab"
        rel="noopener noreferrer"
      >
        <div>
          <time dateTime={`${this.props.date} ${this.props.time}`}>
            {this.props.date}
            <span>{this.props.time}</span>
          </time>

          <p>{this.props.title}</p>
        </div>

        <svg
          className={`icon ${this.props.read !== 1 ? "unread" : ""}`}
          fill={`${this.props.read !== 1 ? "#0067F4" : "#D4D4D4"}`}
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </a>
    );
  }
}

export default NotificationTab;
