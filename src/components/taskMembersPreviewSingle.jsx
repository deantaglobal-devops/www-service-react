/* 
TaskMembersPreviewSingle Component

Single Avatar used by TaskMembersPreview Component

*/
import React from 'react';
import 'regenerator-runtime/runtime.js';

class TaskMembersPreviewSingle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.overflow && 'overflow'}>
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
      </div>
    );
  }
}

export default TaskMembersPreviewSingle;
