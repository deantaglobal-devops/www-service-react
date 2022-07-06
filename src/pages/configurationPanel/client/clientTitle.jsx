import React from 'react';

class ClientTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        {/* Dont need to display the client's name anymore - ticket 1686 - Check the figma link */}
        {/* {this.props.clientData && (
          <span className="client-title">{this.props.clientData.name}</span>
        )} */}
        <div className="page-header client-menu">
          <h3 className="page-title mb-4">{this.props.pageTitle}</h3>
          <div className="config-back-btn">
            {this.props.clientEdit && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => this.props.showHideNewClient(true)}
              >
                Edit Client Information
              </button>
            )}
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
      </>
    );
  }
}

export default ClientTitle;
