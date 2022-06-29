/* 
TaskMembersPreviewSingle Component

Single Avatar used by TaskMembersPreview Component

*/
import React from "react";

class TaskMembersPreviewSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.overflow && "overflow"}>
        {this.props.avatar.slice(0, 5) === "/file" ? (
          <img
            className="main-user"
            key={this.props.id}
            src={`${import.meta.env.VITE_URL_API_SERVICE}/${this.props.avatar}`}
            alt={`${this.props.name} ${this.props.lastname}`}
            title={`${this.props.name} ${this.props.lastname}`}
            data-original-title={`${this.props.name} ${this.props.lastname}`}
            data-toggle="tooltip"
            data-placement="top"
          />
        ) : (
          <img
            className="main-user"
            key={this.props.id}
            src={this.props.avatar}
            alt={`${this.props.name} ${this.props.lastname}`}
            title={`${this.props.name} ${this.props.lastname}`}
            data-original-title={`${this.props.name} ${this.props.lastname}`}
            data-toggle="tooltip"
            data-placement="top"
          />
        )}
      </div>
    );
  }
}

export default TaskMembersPreviewSingle;
