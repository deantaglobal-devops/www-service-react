import React from 'react';

class ClientList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let client = this.props.client;
    return (
      <>
        <div className="gallery-itens" id={client.company_id}>
          <div className="gallery-image-content">
            <img
              className="gallery-image"
              src={`/file/src/?path=${client.clientImage}`}
            />
          </div>
          <div className="client-name">{client.company_name}</div>
          <div className="flex-infos">
            <div className="blocks-text">
              <label>#OF PROJECTS</label>
              <div>{client.project_count ? client.project_count : 0}</div>
            </div>
            <div className="blocks-text">
              <label>#OF USERS</label>
              <div>{client.user_count ? client.user_count : 0}</div>
            </div>
          </div>
          <div className="float-right">
            <button
              className="btn dashboard-box-button"
              onClick={() =>
                this.props.viewClientDetails(
                  client.company_id,
                  client.company_name
                )
              }
            >
              View Client
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default ClientList;
