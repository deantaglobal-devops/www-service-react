import React from "react";
import ClientList from "./clientList";
import ClientTitle from "./clientTitle";

class AllClientDetails extends React.Component {
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
        <ClientTitle
          clientData={this.props.clientData}
          pageTitle={this.props.pageTitle}
          showHideNewClient={this.props.showHideNewClient}
          clientDashboard={this.props.clientDashboard}
          showBack
          clientEdit={false}
        />
        <div className="client-title-section">
          <div className="col-12 mt-4 client-menu">
            <h5 className="title-section">All Clients</h5>
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
          <div className="row mt-4 pl-3" id="deanta-client-list">
            {this.state.filterClient.map((client, index) => {
              return (
                <ClientList
                  key={index}
                  client={client}
                  viewClientDetails={this.props.viewClientDetails}
                />
              );
            })}
            <div className="gallery-itens create-new-client">
              <button
                className="add-new-client"
                onClick={() => this.props.showHideNewClient(true)}
              >
                <i className="material-icons-outlined">add</i>Create New Client
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AllClientDetails;
