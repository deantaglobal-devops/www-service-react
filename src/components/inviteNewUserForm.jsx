import React from "react";
import { api } from "../services/api";

import MultiSelectorSet from "./multiSelectorSet";
import SingleSelectorSet from "./singleSelectorSet";
import { generateMagicLink } from "../utils/magicLinksMethods";

class InviteNewUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUserName: "",
      newUserEmail: "",
      selectableRoles: [],
      loadingButtonAction: false,
      clientOptionsVisibility: false,
      clientsSelected: [],
      isClientInvalid: false,
      isRoleInvalid: false,
    };

    this.validateEmail = this.validateEmail.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addInvalidEmailStyle = this.addInvalidEmailStyle.bind(this);
    this.removeInvalidEmailStyle = this.removeInvalidEmailStyle.bind(this);
    this.loadingButtonStatus = this.loadingButtonStatus.bind(this);

    this.emailInputRef = React.createRef();
    this.emailValidationErrorRef = React.createRef();
    this.emailExistingErrorRef = React.createRef();
    this.clientInputRef = React.createRef();
    this.multiSelectorRef = React.createRef();
    this.singleSelectorRef = React.createRef();
  }

  async componentDidMount() {
    // For the time being, as we do not have role by client, we are going to get them here. Once we have the role-by-client we´ll need to do the call after a client has been selected by the user

    let allRoles = [];

    if (this.props.companyId && this.props.userId) {
      allRoles = await api
        .get(`/roles/${this.props.companyId}/${this.props.userId}`)
        .then(
          (response) => {
            if (response.data.roles) {
              return response.data.roles;
            }
            return [];
          },
          (error) => {
            // Todo: should we add a fail toast to show the error?
            console.log(error);
            return [];
          },
        );
    }

    this.setState({
      selectableRoles: allRoles,
    });
  }

  resetEmailInput() {
    this.emailInputRef.current.value = "";
  }

  async submitForm(e) {
    e.preventDefault();

    const isEmailValid = this.validateEmail();
    const role = this.getOptionSelected();
    const clients =
      this.clientInputRef.current && this.clientInputRef.current.value
        ? [
            {
              clientName: this.clientInputRef.current.value,
              clientId: this.clientInputRef.current.id,
            },
          ]
        : this.getOptionsSelected();
    if (!isEmailValid || role.name === "" || clients.length === 0) {
      if (!isEmailValid) {
        this.addInvalidEmailStyle();
      }

      this.setState({
        isRoleInvalid: role.name === "",
        isClientInvalid: clients.length === 0,
        loadingButtonAction: false,
      });
    } else {
      this.loadingButtonStatus(true);
      this.removeInvalidEmailStyle();
      const email = this.emailInputRef.current.value;
      // to discuss with Jose: company can be a false if there were an error during the company petition, should we throw it as an error and don't send the invitation?
      const company = await this.getCompany(this.props.userId);

      const emailExistenceType = await api
        .get(`/user/${email}/existence/${company.id}`)
        .then(
          (response) => {
            return response.data.userStatus;
          },
          (error) => {
            // Todo: How are we going to show the errors: return false?
            console.log(error);
          },
        );

      switch (emailExistenceType) {
        case "newUser":
          const { taskId } = this.props;
          const { projectId } = this.props;
          const emailObject = {
            userId: this.props.userId,
            companyId: company.id,
            projectId,
            taskId,
            clients,
            role,
            email: {
              to: email,
              subject: `Join ${company.name} on Lanstad`,
              body: "",
            },
          };
          const invitationId = await this.addInvitedUserToList(emailObject);
          const data = { invitationId };
          const generatedMagicLink = await generateMagicLink(
            data,
            "invite-user",
          );
          emailObject.email = {
            ...emailObject.email,
            body: `<div><p>You’ve been invited to join Lanstad by ${company.name}.</p><p>You can sign up by following this link: <a href='${generatedMagicLink}'>${generatedMagicLink}</a></p><p>This link will expire after 7 days.</p></div>`,
          };
          this.sendEmailInvitation(emailObject);

          break;
        case "currentCompanyUser":
          // show error of that address corresponds to a user already in your organisation
          this.addInvalidExistingEmailStyle();
          this.loadingButtonStatus(false);

          break;
        case "otherCompanyUser":
          // todo: To review with Sean the flow for a user in another company, i.e. add that user to this company and send an informative email? or send the informative email with an "accept" button and after accepting add to the company?
          this.loadingButtonStatus(false);

          break;
        default:
          // todo: what's going to happen if the response is different? should here go the error fallback?
          this.showErrorToast("The request could not be fulfilled.");
          this.loadingButtonStatus(false);
      }
    }
  }

  showErrorToast(errorMessage) {
    this.props.showFailToast({ statusText: errorMessage });
  }

  loadingButtonStatus(bool) {
    this.setState({
      loadingButtonAction: bool,
    });
  }

  getUserData(userId) {
    return api.get(`/user/${userId}`).then(
      (response) => {
        if (response.data && response.data.info) {
          return response.data.info;
        }
        return false;
      },
      () => {
        return false;
      },
    );
  }

  getCompany(userId) {
    return api.get(`/user/${userId}/company`).then(
      (response) => {
        return response.data[0];
      },
      (error) => {
        console.log(error);
        return false;
      },
    );
  }

  validateEmail() {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const email = this.emailInputRef.current.value;
    return email !== "" && email.match(mailFormat);
  }

  addInvalidEmailStyle() {
    if (!this.emailInputRef.current.classList.contains("is-invalid")) {
      this.emailInputRef.current.classList.add("is-invalid");
    }

    this.emailValidationErrorRef.current.classList.add("is-invalid");
  }

  addInvalidExistingEmailStyle() {
    if (!this.emailInputRef.current.classList.contains("is-invalid")) {
      this.emailInputRef.current.classList.add("is-invalid");
    }
    this.emailExistingErrorRef.current.classList.add("is-invalid");
  }

  removeInvalidEmailStyle() {
    this.emailInputRef.current.classList.remove("is-invalid");

    this.emailValidationErrorRef.current.classList.remove("is-invalid");
    this.emailExistingErrorRef.current.classList.remove("is-invalid");
  }

  sendEmailInvitation(emailObject) {
    const bodyRequest = {
      header: {
        company_id: null,
        task_id: null,
        creator_id: null,
        reply_title: null,
        message_id: null,
      },
      content: {
        to: emailObject.email.to,
        cc: [],
        subject: emailObject.email.subject,
        body: emailObject.email.body,
      },
    };
    return api
      .post("/send", bodyRequest)
      .then((response) => {
        if (response.data.status === "OK") {
          this.loadingButtonStatus(false);
          this.resetEmailInput();
          this.showWarningToast("The invitation email has been sent.");
        } else {
          this.showErrorToast("The request could not be fulfilled.");
          this.loadingButtonStatus(false);
        }
      })
      .catch((err) => {
        console.log(err);
        this.showErrorToast("The request could not be fulfilled.");
        this.loadingButtonStatus(false);
      });
  }

  showWarningToast(message) {
    this.props.showWarningToast({
      statusType: "success",
      statusIcon: "check",
      statusText: message,
    });
  }

  addInvitedUserToList(emailObject) {
    const clientRoles = emailObject.clients.map((client) => {
      return {
        clientName: client.clientName,
        clientId: client.clientId,
        roleName: emailObject.role.name,
        roleId: emailObject.role.id,
      };
    });
    const invitationObject = {
      email: emailObject.email.to,
      companyIds: [this.props.companyId],
      clientRoles,
      projectIds: emailObject.projectId ? [emailObject.projectId] : [],
      taskIds: emailObject.taskId ? [emailObject.taskId] : [],
      companyRole: 1,
    };

    return api
      .post("/user/invitations/add", invitationObject)
      .then((response) => {
        return response.data.invitedUserId;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // functionality to get the options selected from the MultiSelectorSet component
  getOptionsSelected() {
    const multiOptions = this.multiSelectorRef.current.getOptionsSelected();
    return multiOptions;
  }

  // functionality to get the option selected from the SingleSelectorSet component
  getOptionSelected() {
    const singleOption = this.singleSelectorRef.current.getOptionSelected();
    return singleOption;
  }

  render() {
    const { hideHeader } = this.props;
    return (
      <div id="inviteNewUserForm">
        {/* If displayHeader === True then display */}
        {hideHeader ? "" : <h3 className="title-popover">Invite New User</h3>}

        <div className="invite-form">
          <div className="invite-form-section">
            <label htmlFor="email-address">Email Address</label>
            <input
              ref={this.emailInputRef}
              required
              id="email-address"
              type="text"
              maxLength="45"
              onChange={() => {
                this.emailInputRef.current.classList.contains("is-invalid")
                  ? this.removeInvalidEmailStyle()
                  : null;
              }}
              style={{ pointerEvents: "all" }}
            />

            <span
              ref={this.emailValidationErrorRef}
              className="validation-error"
            >
              Please enter a valid email adress
            </span>
            <span
              ref={this.emailExistingErrorRef}
              className="existing-email-error"
            >
              This email address already exists in your organisation
            </span>
          </div>

          <div className="invite-form-section">
            {this.props.client ? (
              <>
                <label htmlFor="client">Client</label>
                <div className="client-wrapper">
                  <input
                    name="client"
                    defaultValue={this.props.client}
                    ref={this.clientInputRef}
                    required
                    id={this.props.clientId}
                    type="text"
                    readOnly
                  />
                </div>
              </>
            ) : (
              <MultiSelectorSet
                ref={this.multiSelectorRef}
                isInvalid={this.state.isClientInvalid}
                // TODO: this list should be given by the backend service to be always up-to-date with that company clients
                optionsList={["Bloom & Co.", "T & F", "Bloomsbury"]}
                typeSelector="client"
              />
            )}
          </div>

          <div className="invite-form-section">
            <SingleSelectorSet
              ref={this.singleSelectorRef}
              isInvalid={this.state.isRoleInvalid}
              // TODO: this list should be given by the backend service to be always up-to-date with that company/client roles
              optionsList={this.state.selectableRoles}
              typeSelector="role"
            />
          </div>
        </div>

        <div className="invite-button deanta-button-container">
          <button
            className={`deanta-button deanta-button-outlined invite-users ${
              this.state.loadingButtonAction ? "deanta-button-loading" : ""
            }`}
            onClick={(e) =>
              !this.state.loadingButtonAction ? this.submitForm(e) : null
            }
          >
            {this.state.loadingButtonAction ? (
              <>
                <i className="material-icons">refresh</i> Sending
              </>
            ) : (
              "Invite User"
            )}
          </button>
        </div>
      </div>
    );
  }
}

export default InviteNewUserForm;
