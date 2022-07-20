/* UserList Component (wrapper for ListUsersWrapper.js)

Literally a wrapper that renders a ListUsers.js component to a specified element.
Doing this because props need to be passed in by the data attributes of the element

*/
import React from "react";
import { api } from "../../services/api";
import { ListUsers } from "./listUsers";
import ListUsersPortal from "./listUsersPortal";

class ListUsersWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskMemberList: [],
      isModalOpen: false,
      isInviteModalOpen: false,
      membersLoaded: false,
    };

    // need to bind it so children components can use this function.
    this.updateUserList = this.updateUserList.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openInviteModal = this.openInviteModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.updateUserList();
  // }

  async updateUserList() {
    const taskMemberList = await this.getTaskUsers();
    this.setState({ taskMemberList });
    this.props.getMilestoneData(this.props.taskid);
    this.closeModal();
  }

  async getTaskUsers() {
    const responseData = await api
      .get(`/task/${this.props.taskid}/users/get`)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
        return [];
      });

    return responseData;
  }

  async componentDidMount() {
    // Fetch Task Members
    let memberList = [];
    if (this.props.taskid) {
      memberList = await this.getTaskUsers();
    }

    // Fetch Project Members
    const projectMemberList = await api
      .get(`/project/${this.props.projectid}/users`)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
        return [];
      });

    this.setState({
      // add this to state so we can use it on the render
      completeUsersList: projectMemberList,
      membersLoaded: true,
      taskMemberList: memberList,
    });
  }

  // componentWillUnmount() {
  //   // fix Warning: Can't perform a React state update on an unmounted component
  //   this.setState = (state, callback) => {};
  // }

  async openModal() {
    this.setState({ isModalOpen: true });

    // Get Updated List when Toggle the Modal
    const taskMemberList = await this.getTaskUsers();

    this.setState({ taskMemberList });
  }

  openInviteModal() {
    this.setState({
      isInviteModalOpen: true,
    });
  }

  closeModal() {
    this.setState({ isModalOpen: false, isInviteModalOpen: false });
  }

  render() {
    return (
      <>
        <ListUsers
          {...this.props}
          {...this.state}
          isModalOpen={this.state.isModalOpen}
          isInviteModalOpen={this.state.isInviteModalOpen}
          openModal={this.openModal}
          openInviteModal={this.openInviteModal}
          closeModal={this.closeModal}
          updateUserList={this.updateUserList}
          level="task"
          taskMemberList={this.state.taskMemberList}
          permissions={this.props.permissions}
        />

        <ListUsersPortal
          {...this.props}
          {...this.state}
          userId={this.props.currentuserid}
          isModalOpen={this.state.isModalOpen}
          isInviteModalOpen={this.state.isInviteModalOpen}
          openModal={this.openModal}
          openInviteModal={this.openInviteModal}
          closeModal={this.closeModal}
          projectId={this.props.projectid}
          taskId={this.props.taskid}
          updateUserList={this.updateUserList}
          level="task"
          taskMemberList={this.state.taskMemberList}
          client={this.props.projectclient}
          clientId={this.props.companyid}
          companyId={this.props.realcompanyid}
        />
      </>
    );
  }
}

export default ListUsersWrapper;
