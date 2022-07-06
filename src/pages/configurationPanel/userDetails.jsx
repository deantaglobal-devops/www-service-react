import React from "react";
import { api } from "../../services/api";
import SingleUser from "./singleUser";
import AllUserDetails from "./allUserDetails";
import InviteNewUserForm from "./inviteUser";
import UserProfile from "./userProfile";

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allUser: false,
      singleUser: true,
      isInviteModalOpen: false,
      userProfile: false,
      userData: [],
      userId: "",
      isCreatingNewUser: false,
    };
    this.viewAllUser = this.viewAllUser.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.inviteNewUser = this.inviteNewUser.bind(this);
    this.userProfile = this.userProfile.bind(this);
    this.handldFilter = this.handldFilter.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  viewAllUser() {
    this.setState(
      {
        allUser: true,
        singleUser: false,
      },
      () => {
        this.props.showHideClientUser(false, true, true);
      },
    );
  }

  createNewUser(action, isCreatingNewUser) {
    this.setState(
      {
        allUser: false,
        singleUser: !action,
        userProfile: action,
        userId: "",
        userData: [],
        isCreatingNewUser,
      },
      () => {
        this.props.showHideClientUser(!action, true, true);
      },
    );
  }

  inviteNewUser(action) {
    this.setState({
      isInviteModalOpen: action,
    });
  }

  handldFilter(searchVal) {
    searchVal = searchVal.toLowerCase();
    // filter names based on search value
    return this.props.usersList.filter((item) =>
      item.fullname.toLowerCase().includes(searchVal),
    );
  }

  async userProfile(id) {
    this.props.loadingIcon("show");

    await api
      .post("/configuration/user/detail", { userId: id })
      .then((response) => {
        if (response.data.success === "success") {
          this.setState(
            {
              userProfile: true,
              allUser: false,
              singleUser: false,
              userData: response.data,
              userId: id,
            },
            () => {
              this.props.showHideClientUser(false, true, true);
              this.props.loadingIcon("hide");
            },
          );
        }
      })
      .catch((err) => console.log(err));
  }

  handleBack() {
    this.setState(
      {
        allUser: false,
        singleUser: true,
        userProfile: false,
      },
      () => {
        this.props.showHideClientUser(true, true, true);
      },
    );
  }

  render() {
    return (
      <>
        {this.state.singleUser && (
          <SingleUser
            usersList={this.props.usersList}
            viewAllUser={this.viewAllUser}
            createNewUser={this.createNewUser}
            inviteNewUser={this.inviteNewUser}
            userProfile={this.userProfile}
            handldFilter={this.handldFilter}
          />
        )}
        {this.state.allUser && (
          <AllUserDetails
            usersList={this.props.usersList}
            createNewUser={this.createNewUser}
            inviteNewUser={this.inviteNewUser}
            userProfile={this.userProfile}
            handldFilter={this.handldFilter}
          />
        )}
        {this.state.isInviteModalOpen && (
          <div
            className="deanta-modal"
            id="deanta-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="ModalLabel"
            aria-hidden="true"
          >
            <div className="deanta-modal-dialog" role="document">
              <div className="deanta-modal-content" ref={this.setModalWrapper}>
                <div className="deanta-modal-header">
                  <h5 className="deanta-modal-title" id="ModalLabel">
                    Invite New User
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      this.inviteNewUser(false);
                    }}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="material-icons">close</i>
                  </button>
                </div>
                <div className="deanta-modal-body">
                  <InviteNewUserForm
                    userId={this.state.userId}
                    inviteNewUser={this.inviteNewUser}
                    clientList={this.props.clientList}
                    rolesList={this.props.rolesList}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.userProfile && (
          <UserProfile
            userData={this.state.userData}
            rolesList={this.props.rolesList}
            userId={this.state.userId}
            createNewUser={this.createNewUser}
            loadingIcon={this.props.loadingIcon}
            updateUserList={this.props.updateUserList}
            isCreatingNewUser={this.state.isCreatingNewUser}
            permissions={this.props.permissions}
            userProfile={this.userProfile}
            usersList={this.props.usersList}
            clientList={this.props.clientList}
          />
        )}
      </>
    );
  }
}

export default UserDetails;
