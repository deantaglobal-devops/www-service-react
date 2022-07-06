import React from "react";
import RolesPermissions from "./rolespermissions";
import ClientTemplate from "./clientTemplate";
import ClientTitle from "./clientTitle";

class ClientEditOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        {this.props.editOption === "role" && (
          <>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle={this.props.pageTitle}
              showHideNewClient={this.props.showHideNewClient}
              clientDashboard={this.props.clientDashboard}
              showBack
              clientEdit={false}
            />
            <RolesPermissions
              rolesList={this.props.rolesList}
              loadingIcon={this.props.loadingIcon}
              clientData={this.props.clientData}
              clientList={this.props.clientList}
              userId={this.props.userId}
            />
          </>
        )}

        {this.props.editOption === "template" && (
          <>
            <ClientTitle
              clientData={this.props.clientData}
              pageTitle={this.props.pageTitle}
              showHideNewClient="Project Templates"
              clientDashboard={this.props.clientDashboard}
              showBack
              clientEdit={false}
            />
            <ClientTemplate
              typeList={this.props.typeList}
              loadingIcon={this.props.loadingIcon}
              clientData={this.props.clientData}
            />
          </>
        )}
      </>
    );
  }
}

export default ClientEditOptions;
