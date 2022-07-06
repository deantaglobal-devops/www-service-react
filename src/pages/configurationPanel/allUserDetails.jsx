import React from "react";
import UserPagination from "./userPagination";

class AllUserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      limit: 50,
      currentPage: 1,
      userSearch: "",
      filterUser: [],
    };
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      filterUser: this.props.usersList,
    });
  }

  handleSearch(event) {
    const { id } = event.target;
    const val = event.target.value;
    const list = this.props.handldFilter(val);
    this.setState({
      [id]: val,
      filterUser: list,
      start: 0,
      limit: 50,
      currentPage: 1,
    });
  }

  // click on pagination button and getting pages
  handleNextPage(currentPage, pageClicked, start, limit) {
    const defaultLimit = this.state.limit;
    let newStartPage = 0;
    let newLimitPage = defaultLimit - 1;
    if (currentPage === pageClicked) {
      return true;
    }
    if (pageClicked > currentPage) {
      newStartPage = start + (pageClicked - currentPage) * defaultLimit;
      newLimitPage = limit + defaultLimit * (pageClicked - currentPage);
    } else {
      newStartPage = start - defaultLimit * (currentPage - pageClicked);
      newLimitPage = pageClicked * defaultLimit - 1;
    }
    this.setState({
      start: newStartPage,
      currentPage: pageClicked,
    });
  }

  render() {
    const { start, limit } = this.state;
    return (
      <>
        <div className="client-title-section">
          <div className="col-12 mt-4 user-menu">
            <h5 className="title-section">All Users</h5>
            <button
              className="add-new-user"
              onClick={() => this.props.inviteNewUser(true)}
            >
              <i className="material-icons-outlined">add</i>Invite New User
            </button>
            {(this.props.clientView == false ||
              this.props.clientView == undefined) && (
              <button
                className="add-new-user"
                onClick={() => this.props.createNewUser(true)}
              >
                <i className="material-icons-outlined">add</i>Create New User
              </button>
            )}

            <div className="wrap-field-label user-search">
              <div className="inputWrapper">
                <label className="label-form">Search</label>
                <input
                  className="default-input-text"
                  maxLength="45"
                  type="text"
                  id="userSearch"
                  value={this.state.userSearch}
                  onChange={this.handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="user-list">
          {this.state.filterUser.length > 0 && (
            <div className="col-sm-12 col-lg-12 mb15">
              <div className="container-content-page mt-4 container-users">
                <div className="users-on-project">
                  {/* Getting records based on page nuber with limits. */}
                  {this.state.filterUser
                    .slice(start, start + limit)
                    .map((user, index) => {
                      return (
                        <div key={index} className="content-user" id={user.id}>
                          <div
                            className="align-infos"
                            onClick={() => this.props.userProfile(user.id)}
                          >
                            <img
                              className="user-avatar rounded-circle mr-2 user-avatar-40"
                              src={user.avatar}
                            />
                            <div className="user-info">
                              <p>{user.fullname}</p>
                              <p className="role">{user.role}</p>
                            </div>
                          </div>
                          <a
                            href="#"
                            data-user="123"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Remove user"
                          >
                            <i className="material-icons-outlined delete-icon">
                              delete
                            </i>
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
          {this.state.filterUser.length === 0 && <span>No data found</span>}
        </div>
        {this.state.filterUser.length > this.state.limit && (
          <UserPagination
            dataLength={this.state.filterUser.length}
            start={this.state.start}
            limit={this.state.limit}
            currentPage={this.state.currentPage}
            handleNextPage={this.handleNextPage}
          />
        )}
      </>
    );
  }
}
export default AllUserDetails;
