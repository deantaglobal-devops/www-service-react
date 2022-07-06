import React from "react";
import ClientList from "./clientList";

class SingleClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientSearch: "",
      filterClient: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      filterClient: this.props.clientList,
    });
  }

  handleSearch(event) {
    const { id } = event.target;
    const val = event.target.value;
    const list = this.props.handldFilter(val);
    this.setState({
      [id]: val,
      filterClient: list,
    });
  }

  render() {
    return (
      <>
        <div className="client-title-section">
          <div className="col-12 row mt-5">
            <h5 className="title-section">Clients</h5>
            <span
              className="client-view-all"
              onClick={this.props.viewAllClient}
            >
              <i className="material-icons-outlined mr-2">visibility</i> View
              All
            </span>
          </div>
          <div className="col-12 mt-2 client-menu">
            <button
              className="add-new-client"
              onClick={() => this.props.showHideNewClient(true)}
            >
              <i className="material-icons-outlined">add</i>Create New Client
            </button>
            <div className="wrap-field-label client-search">
              <div className="inputWrapper">
                <label className="label-form">Search</label>
                <input
                  className="default-input-text"
                  maxLength="45"
                  type="text"
                  id="clientSearch"
                  value={this.state.clientSearch}
                  onChange={this.handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="client-list gallery-card-container">
          {this.state.filterClient.length > 0 && (
            <div className="row mt-4 pl-3" id="deanta-client-list">
              {this.state.filterClient.slice(0, 5).map((client, index) => {
                return (
                  <ClientList
                    key={index}
                    client={client}
                    viewClientDetails={this.props.viewClientDetails}
                  />
                );
              })}
            </div>
          )}
          {this.state.filterClient.length === 0 && <span>No data found</span>}
        </div>
      </>
    );
  }
}

export default SingleClient;
