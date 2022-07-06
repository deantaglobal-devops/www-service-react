import React from 'react';

class SingleUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSearch: '',
      fliterUser: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      fliterUser: this.props.usersList,
    });
  }

  handleSearch(event) {
    let id = event.target.id;
    let val = event.target.value;
    let list = this.props.handldFilter(val);
    this.setState({
      [id]: val,
      fliterUser: list,
    });
  }

  render() {
    return (
      <>
        <div className="user-title-section">
          <div className="col-12 row mt-5">
            <h5 className="title-section">Users</h5>
            <span className="user-view-all" onClick={this.props.viewAllUser}>
              <i className="material-icons-outlined mr-2">visibility</i> View
              All
            </span>
          </div>
          <div className="col-12 mt-2 user-menu">
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
                onClick={() => this.props.createNewUser(true, true)}
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
          {this.state.fliterUser.length > 0 && (
            <div className="col-sm-12 col-lg-12 mb15">
              <div className="container-content-page mt-4 container-users">
                <div className="users-on-project">
                  {/* By default its showing 32 records in dashboard view. */}
                  {this.state.fliterUser.slice(0, 32).map((user, index) => {
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
          {this.state.fliterUser.length === 0 && <span>No data found</span>}
        </div>
      </>
    );
  }
}

export default SingleUser;
