import React from 'react';
import ProjectList from './projectList';
import JournalList from './journalList';

class AllProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookSearch: '',
      journalSearch: '',
      bookList: [],
      journalList: [],
    };
    this.bookFilter = this.bookFilter.bind(this);
    this.journalFilter = this.journalFilter.bind(this);
  }

  componentDidMount() {
    this.setState({
      bookList: this.props.projectList,
      journalList: this.props.journalList,
    });
  }
  // book filter based on name
  bookFilter(event) {
    let val = event.target.value;
    let searchVal = val.toLowerCase();
    let list = this.props.projectList.filter((item) =>
      item.name.toLowerCase().includes(searchVal)
    );
    this.setState({
      bookList: list,
      bookSearch: val,
    });
  }
  // journal filter based on name
  journalFilter(event) {
    let val = event.target.value;
    let searchVal = val.toLowerCase();
    let list = this.props.journalList.filter((item) =>
      item.name.toLowerCase().includes(searchVal)
    );
    this.setState({
      journalList: list,
      journalSearch: val,
    });
  }
  render() {
    return (
      <>
        <div className="client-menu mb-2">
          <span className="client-title">{this.props.clientData.name}</span>
          <div className="config-back-btn">
            {this.props.showBack && (
              <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.props.clientDashboard}
              >
                Back
              </button>
            )}
          </div>
        </div>
        {this.props.projectList && this.props.projectList.length > 0 && (
          <>
            <div className="page-header client-menu">
              <h3 className="page-title">Books</h3>
              <div className="wrap-field-label user-search">
                <div className="inputWrapper">
                  <label className="label-form">Search</label>
                  <input
                    className="default-input-text"
                    maxLength="45"
                    type="text"
                    id="bookSearch"
                    value={this.state.bookSearch}
                    onChange={this.bookFilter}
                  />
                </div>
              </div>
            </div>
            <div id="projects-card-container">
              <div className="row mt-4" id="projects-card-container">
                {/* showing first 25 project here remaining we can search and get */}
                {this.state.bookList.slice(0, 25).map((project) => {
                  return <ProjectList project={project} />;
                })}
                {this.state.bookList.length === 0 && <div>No Book found.</div>}
              </div>
            </div>
          </>
        )}
        {this.props.journalList && this.props.journalList.length > 0 && (
          <>
            <div className="page-header client-menu">
              <h3 className="page-title">Journals</h3>
              <div className="wrap-field-label user-search">
                <div className="inputWrapper">
                  <label className="label-form">Search</label>
                  <input
                    className="default-input-text"
                    maxLength="45"
                    type="text"
                    id="journalSearch"
                    value={this.state.journalSearch}
                    onChange={this.journalFilter}
                  />
                </div>
              </div>
            </div>
            <div id="projects-card-container">
              <div className="row mt-4" id="projects-card-container">
                {/* showing first 25 project here remaining we can search and get */}
                {this.state.journalList.slice(0, 25).map((project) => {
                  return <JournalList project={project} />;
                })}
                {this.state.journalList.length === 0 && (
                  <div>No Journal found.</div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default AllProjectDetails;
