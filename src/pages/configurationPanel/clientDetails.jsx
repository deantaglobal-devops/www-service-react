import React from "react";
import { api } from "../../services/api";
import AllClientDetails from "./client/allClientDetails";
import CreateNewClient from "./client/createNewClient";
import SingleClient from "./client/singleClient";
import SingleClientDetails from "./client/singleClientDetails";

class ClientDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createClient: false,
      allClient: false,
      singleClient: true,
      clientDetails: false,
      clientData: [],
      clientId: "",
      selectedClient: [],
    };
    this.viewAllClient = this.viewAllClient.bind(this);
    this.showHideNewClient = this.showHideNewClient.bind(this);
    this.viewClientDetails = this.viewClientDetails.bind(this);
    this.handldFilter = this.handldFilter.bind(this);
    this.clientDashboard = this.clientDashboard.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.updateClientDetails = this.updateClientDetails.bind(this);
  }

  clientDashboard() {
    this.setState(
      {
        createClient: false,
        allClient: false,
        singleClient: true,
        clientDetails: false,
        clientData: [],
        clientId: "",
      },
      () => {
        // showing configuration main page client list and user list
        this.props.showHideClientUser(true, true, true);
      },
    );
  }

  viewAllClient() {
    this.setState(
      {
        allClient: true,
        createClient: false,
        singleClient: false,
        clientDetails: false,
        clientId: "",
      },
      () => {
        // showing main page only client list and disabled user list
        this.props.showHideClientUser(true, false, false);
      },
    );
  }

  showHideNewClient(action) {
    this.setState({
      createClient: action,
    });
  }

  async viewClientDetails(id, name) {
    this.props.loadingIcon("show");
    // get selected client data for client update
    const selectedClient = this.props.clientList.filter(function (item) {
      return +item.company_id === +id;
    })[0];
    // call configuration client view based on selected client

    let data = null;
    await api
      .post("/configuration/client/view", {
        companyId: id,
        name,
        limit: 0,
        userId: this.props.user.id,
      })
      .then((response) => {
        data = response.data;
      });

    let typelist = null;
    await api.get(`/project/typelist/company/${id}`).then((response) => {
      typelist = response.data;
    });

    data.id = id;
    data.name = name;

    let books = null;
    let journals = null;

    if (data?.projects?.projectList) {
      books = data?.projects?.projectList;
    }

    if (data?.projects?.journalList) {
      journals = data?.projects?.journalList;
    }

    data.projectList = books;
    data.journalList = journals;

    data.typeList = typelist.typeList;
    data.categoryList = typelist.categoryList;

    this.setState(
      {
        clientDetails: true,
        allClient: false,
        createClient: false,
        singleClient: false,
        clientData: data,
        clientId: id,
        selectedClient,
      },
      () => {
        // showing main page only client list and disabled user list
        this.props.showHideClientUser(true, false, false);
        this.props.loadingIcon("hide");
      },
    );
  }

  updateClientDetails(list) {
    this.setState(
      {
        selectedClient: list,
      },
      () => {
        // showing main page
        this.clientDashboard();
      },
    );
  }

  handldFilter(searchVal) {
    searchVal = searchVal.toLowerCase();
    // filter names based on search value
    return this.props.clientList.filter((item) =>
      item.company_name.toLowerCase().includes(searchVal),
    );
  }

  handleBack() {
    this.setState(
      {
        createClient: false,
        allClient: false,
        singleClient: true,
        clientDetails: false,
      },
      () => {
        // showing configuration main page client list and user list
        this.props.showHideClientUser(true, true, true);
      },
    );
  }

  render() {
    return (
      <>
        {this.state.allClient && (
          <div className="client-details">
            <AllClientDetails
              clientList={this.props.clientList}
              showHideNewClient={this.showHideNewClient}
              viewClientDetails={this.viewClientDetails}
              handldFilter={this.handldFilter}
              clientDashboard={this.clientDashboard}
              pageTitle={this.props.pageTitle}
              clientData={this.state.clientData}
            />
          </div>
        )}
        {this.state.createClient && (
          <div className="create-new-client-container">
            <CreateNewClient
              showHideNewClient={this.showHideNewClient}
              clientData={this.state.clientData}
              clientId={this.state.clientId}
              loadingIcon={this.props.loadingIcon}
              updateClientList={this.props.updateClientList}
              selectedClient={this.state.selectedClient}
              updateClientDetails={this.updateClientDetails}
              currencyList={this.props.currencyList}
              userId={this.props.user.id}
            />
          </div>
        )}
        {this.state.singleClient && (
          <SingleClient
            showHideNewClient={this.showHideNewClient}
            viewAllClient={this.viewAllClient}
            clientList={this.props.clientList}
            viewClientDetails={this.viewClientDetails}
            handldFilter={this.handldFilter}
          />
        )}
        {this.state.clientDetails && (
          <SingleClientDetails
            clientData={this.state.clientData}
            pageTitle={this.props.pageTitle}
            clientDashboard={this.clientDashboard}
            showHideNewClient={this.showHideNewClient}
            loadingIcon={this.props.loadingIcon}
            showHideClientUser={this.props.showHideClientUser}
            updateUserList={this.props.updateUserList}
            usersList={this.props.usersList}
            rolesList={this.props.rolesList}
            permissions={this.props.permissions}
            clientList={this.props.clientList}
          />
        )}
      </>
    );
  }
}

export default ClientDetails;
