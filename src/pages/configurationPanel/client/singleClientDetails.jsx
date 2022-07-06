import React from "react";
import { api } from "../../../services/api";
import ProjectList from "./projectList";
import JournalList from "./journalList";
import SingleUser from "../singleUser";
import AllUserDetails from "../allUserDetails";
import ClientTitle from "./clientTitle";
import ClientEditOptions from "./clientEditOption";
import AllProjectDeatails from "./allProjectDetails";
import NewBook from "../bookComponent/newBook";
import NewJournal from "../bookComponent/newJournal";

import ModalForm from "../../../components/ModalForm/modalForm";
import UserProfile from "../userProfile";

class SingleClientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSearch: "",
      fliterUser: [],
      isInviteModalOpen: false,
      projectShow: true,
      allUser: false,
      singleUser: false,
      roleView: false,
      allProject: false,
      newBook: false,
      newJournal: false,
      rolesList: [],
      typeList: [],
      bookCount: 0,
      journalCount: 0,
      editOption: "",
      userProfile: false,
      userId: "",
      userData: [],
    };
    this.viewAllUser = this.viewAllUser.bind(this);
    this.inviteNewUser = this.inviteNewUser.bind(this);
    this.userProfile = this.userProfile.bind(this);
    this.handldFilter = this.handldFilter.bind(this);
    this.showRole = this.showRole.bind(this);
    this.showTemplate = this.showTemplate.bind(this);
    this.projectDashboard = this.projectDashboard.bind(this);
    this.handleViewAllProject = this.handleViewAllProject.bind(this);
    this.handleNewBook = this.handleNewBook.bind(this);
    this.hideUsersProjects = this.hideUsersProjects.bind(this);
  }

  componentDidMount() {
    this.setState({
      fliterUser: this.props.clientData?.companyhasuserList,
      bookCount: this.props.clientData?.projectList?.length,
      journalCount: this.props.clientData?.journalList?.length,
    });
  }

  // showing all user in the client section
  viewAllUser() {
    this.setState({
      allUser: true,
      singleUser: false,
      projectShow: false,
      roleView: false,
      allProject: false,
      newBook: false,
      newJournal: false,
    });
  }

  // showing project and user list based on client
  projectDashboard() {
    this.setState({
      allUser: false,
      singleUser: false,
      projectShow: true,
      roleView: false,
      allProject: false,
      newBook: false,
      newJournal: false,
      userProfile: false,
    });
  }

  // showing books and journal page
  handleViewAllProject() {
    this.setState({
      allUser: false,
      singleUser: false,
      projectShow: false,
      roleView: false,
      allProject: true,
      newBook: false,
      newJournal: false,
    });
  }

  // showing New Book
  handleNewBook(bookId, bookFlag, journalId, journalFlag) {
    this.setState({
      allUser: false,
      singleUser: false,
      projectShow: false,
      roleView: false,
      allProject: false,
      [bookId]: bookFlag,
      [journalId]: journalFlag,
    });
  }

  inviteNewUser(action) {
    this.setState({
      isInviteModalOpen: action,
    });
  }

  handldFilter(searchVal) {
    searchVal = searchVal.toLowerCase();
    // filter names based on search value
    return this.props.clientData.companyhasuserList.filter((item) =>
      item.fullname.toLowerCase().includes(searchVal),
    );
  }

  async userProfile(id) {
    this.props.loadingIcon("show");
    // geting user details while clicking users
    await api
      .post("/configuration/user/detail", {
        userId: id,
      })
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
              // this.props.showHideClientUser(true, false);
              this.hideUsersProjects();
              this.props.loadingIcon("hide");
            },
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // showing project tempalte
  async showTemplate() {
    this.props.loadingIcon("show");
    const { id } = this.props.clientData;
    // geting type and template details while clicking users
    await api
      .post("/configuration/project/templatelist", {
        companyId: id,
        userId: this.state.userId,
      })
      .then((response) => {
        if (response.data.status === "success") {
          const type = response.data.projectTemplateList;
          this.setState(
            {
              userProfile: false,
              allUser: false,
              singleUser: false,
              roleView: true,
              typeList: type,
              projectShow: false,
              allProject: false,
              newBook: false,
              newJournal: false,
              editOption: "template",
            },
            () => {
              this.props.loadingIcon("hide");
            },
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async showRole() {
    this.props.loadingIcon("show");
    const { id } = this.props.clientData;
    // call configuration roles list based on client
    await api
      .get(`/client/${id}/roles`)
      .then((response) => {
        const { roles } = response.data;
        this.setState(
          {
            userProfile: false,
            allUser: false,
            singleUser: false,
            roleView: true,
            rolesList: roles,
            projectShow: false,
            allProject: false,
            newBook: false,
            newJournal: false,
            editOption: "role",
          },
          () => {
            this.props.loadingIcon("hide");
          },
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  hideUsersProjects() {
    this.setState({
      projectShow: false,
      allProject: false,
      allUser: false,
      roleView: false,
      newBook: false,
      newJournal: false,
    });
  }

  render() {
    return (
      <>
        {this.state.projectShow && (
          <>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle={this.props.pageTitle}
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.props.clientDashboard}
              showBack
              clientEdit
            />
            <div className="client-title-section">
              <div className="col-12 row mt-2">
                <h5 className="title-section">All Projects</h5>
                <div className="pt-1 ml-2">
                  {this.state.bookCount} Books & {this.state.journalCount}{" "}
                  Journals
                </div>
              </div>
              <div className="col-12 mt-2 client-menu">
                <span
                  className="client-view-all mb-0"
                  onClick={this.handleViewAllProject}
                >
                  <i className="material-icons-outlined mr-2">visibility</i>{" "}
                  View All
                </span>
                <button
                  className="add-new-project"
                  onClick={() =>
                    this.handleNewBook("newBook", true, "newJournal", false)
                  }
                >
                  <i className="material-icons-outlined">add</i>
                  Create New Book
                </button>
                <button
                  className="add-new-project"
                  onClick={() =>
                    this.handleNewBook("newBook", false, "newJournal", true)
                  }
                >
                  <i className="material-icons-outlined">add</i>
                  Create New Journal
                </button>
              </div>
              <div id="projects-card-container">
                <div className="row mt-4" id="projects-card-container">
                  {this.props.clientData?.projectList?.length > 0 &&
                    this.props.clientData?.projectList
                      .slice(0, 3)
                      .map((project, index) => (
                        <ProjectList key={index} project={project} />
                      ))}
                  {this.props.clientData?.projectList?.length === 0 &&
                    this.props.clientData?.journalList
                      .slice(0, 3)
                      .map((project, index) => (
                        <JournalList key={index} project={project} />
                      ))}
                </div>
              </div>
            </div>
          </>
        )}
        {this.state.allProject && (
          <AllProjectDeatails
            clientData={this.props.clientData}
            clientDashboard={this.projectDashboard}
            projectList={this.props.clientData.projectList}
            journalList={this.props.clientData.journalList}
            showBack
          />
        )}
        {this.state.projectShow && (
          <SingleUser
            usersList={this.props.clientData.companyhasuserList}
            viewAllUser={this.viewAllUser}
            inviteNewUser={this.inviteNewUser}
            userProfile={this.userProfile}
            handldFilter={this.handldFilter}
            clientView
          />
        )}
        {this.state.allUser && (
          <>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle={this.props.pageTitle}
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.projectDashboard}
              showBack
              clientEdit={false}
            />
            <AllUserDetails
              usersList={this.props.clientData.companyhasuserList}
              inviteNewUser={this.inviteNewUser}
              userProfile={this.userProfile}
              handldFilter={this.handldFilter}
              clientView
            />
          </>
        )}
        {this.state.roleView && (
          <ClientEditOptions
            rolesList={this.state.rolesList}
            typeList={this.state.typeList}
            loadingIcon={this.props.loadingIcon}
            clientData={this.props.clientData}
            pageTitle={this.props.pageTitle}
            showHideNewClient={this.props.showHideNewClient}
            clientDashboard={this.projectDashboard}
            editOption={this.state.editOption}
            clientList={this.props.clientList}
            userId={this.state.userId}
          />
        )}
        {this.state.projectShow && (
          <div className="col-12 mt-2 user-menu">
            <button className="add-new-user" onClick={this.showTemplate}>
              <i className="material-icons-outlined">edit</i>
              Edit Project Type & Project Templates (Categories)
            </button>
            <button className="add-new-user" onClick={this.showRole}>
              <i className="material-icons-outlined">edit</i>
              Edit Roles & Responsibilities
            </button>
            <button className="add-new-user">
              <i className="material-icons-outlined">edit</i>
              Style Editor
            </button>
            <button className="add-new-user">
              <i className="material-icons-outlined">edit</i>
              XSL Uploader
            </button>
          </div>
        )}

        {this.state.newBook && (
          <ModalForm show={this.state.newBook}>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle="Add Book"
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.projectDashboard}
              showBack
              clientEdit={false}
            />
            <NewBook
              clientData={this.props.clientData}
              loadingIcon={this.props.loadingIcon}
              clientDashboard={this.projectDashboard}
            />
          </ModalForm>
        )}

        {this.state.newJournal && (
          <ModalForm show={this.state.newJournal}>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle="Add Journal"
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.projectDashboard}
              showBack
              clientEdit={false}
            />
            <NewJournal
              clientData={this.props.clientData}
              loadingIcon={this.props.loadingIcon}
              clientDashboard={this.projectDashboard}
            />
          </ModalForm>
        )}

        {this.state.userProfile && (
          <>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle={this.props.pageTitle}
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.projectDashboard}
              showBack
              clientEdit={false}
            />
            <UserProfile
              userData={this.state.userData}
              rolesList={this.props.rolesList}
              userId={this.state.userId}
              loadingIcon={this.props.loadingIcon}
              updateUserList={this.props.updateUserList}
              isCreatingNewUser={false}
              permissions={this.props.permissions}
              userProfile={this.userProfile}
            />
          </>
        )}
      </>
    );
  }
}

export default SingleClientDetails;
