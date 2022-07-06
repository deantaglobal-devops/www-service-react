import React from "react";
import { api } from "../../services/api";
import SingleSelectorSet from "../../components/singleSelectorSet";
import { generateMagicLink } from "../../utils/magicLinksMethods";

class InviteNewUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUserName: "",
      newUserEmail: "",
      selectableRoles: [],
      selectableClients: [],
      loadingButtonAction: false,
      clientOptionsVisibility: false,
      clientsSelected: [],
      isClientInvalid: false,
      isRoleInvalid: false,
    };
    this.emailInputRef = React.createRef();
    this.emailValidationErrorRef = React.createRef();
    this.emailExistingErrorRef = React.createRef();
    this.clientInputRef = React.createRef();
    this.multiSelectorRef = React.createRef();
    this.singleSelectorRef = React.createRef();
    this.validateEmail = this.validateEmail.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addInvalidEmailStyle = this.addInvalidEmailStyle.bind(this);
    this.removeInvalidEmailStyle = this.removeInvalidEmailStyle.bind(this);
    this.loadingButtonStatus = this.loadingButtonStatus.bind(this);
  }

  componentDidMount() {
    const roles = this.props.rolesList;
    const clients = this.props.clientList;
    const selectableRoles = roles.map((item, i) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    const selectableClients = clients.map((item, i) => {
      return {
        id: item.company_id,
        name: item.company_name,
      };
    });
    this.setState({
      selectableRoles,
      selectableClients,
    });
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

  loadingButtonStatus(bool) {
    this.setState({
      loadingButtonAction: bool,
    });
  }

  async submitForm(e) {
    e.preventDefault();
    const isEmailValid = this.validateEmail();
    const role = this.getOptionSelected();
    const clients = this.getOptionsSelected();
    if (!isEmailValid || role.name === "" || clients.name === "") {
      if (!isEmailValid) {
        this.addInvalidEmailStyle();
      }
      this.setState({
        isRoleInvalid: role.name === "",
        isClientInvalid: clients.name === "",
        loadingButtonAction: false,
      });
    } else {
      this.loadingButtonStatus(true);
      this.removeInvalidEmailStyle();
      const email = this.emailInputRef.current.value;
      // checking mail id with lanstad database if exits or not

      const emailExistenceType = await api
        .get(`/user/${email}/existence/${clients.id}`)
        .then((response) => {
          return response.data.userStatus;
        })
        .catch((err) => console.log(err));

      // checking user type
      switch (emailExistenceType) {
        case "newUser":
          const emailObject = {
            clients,
            role,
            email: {
              to: email,
              subject: `Join ${clients.name} on Lanstad`,
              body: "",
            },
          };
          const invitationId = await this.addInvitedUserToList(emailObject);
          const data = { invitationId };
          // generating magiclink based on user added
          const generatedMagicLink = await generateMagicLink(
            data,
            "invite-user",
          );
          emailObject.email = {
            ...emailObject.email,
            body: `<div><p>You’ve been invited to join Lanstad by ${clients.name}.</p><p>You can sign up by following this link: <a href='${generatedMagicLink}'>${generatedMagicLink}</a></p><p>This link will expire after 7 days.</p></div>`,
          };
          this.sendEmailInvitation(emailObject);

          break;
        case "currentCompanyUser":
          // show error of that address corresponds to a user already in your organisation
          this.addInvalidExistingEmailStyle();
          this.loadingButtonStatus(false);

          break;
        case "otherCompanyUser":
          this.loadingButtonStatus(false);

          break;
        default:
          this.showErrorToast("The request could not be fulfilled.");
          this.loadingButtonStatus(false);
      }
    }
  }

  showErrorToast(errorMessage) {
    window.showFailToast({ statusText: errorMessage });
  }

  // sending invitation mail to user.
  async sendEmailInvitation(emailObject) {
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
      attachments: [],
    };
    return api
      .post("/send", bodyRequest)
      .then((response) => {
        if (response.data.status === "OK") {
          this.loadingButtonStatus(false);
          this.resetEmailInput();
          this.showWarningToast("The invitation email has been sent.");
          this.props.inviteNewUser(false);
        } else {
          this.showErrorToast("The request could not be fulfilled.");
          this.loadingButtonStatus(false);
          this.props.inviteNewUser(false);
        }
      })
      .catch((err) => {
        console.log(err);
        this.showErrorToast("The request could not be fulfilled.");
        this.loadingButtonStatus(false);
        this.props.inviteNewUser(false);
      });
  }

  resetEmailInput() {
    this.emailInputRef.current.value = "";
  }

  showWarningToast(message) {
    window.showWarningToast({
      statusType: "success",
      statusIcon: "check",
      statusText: message,
    });
  }

  // Adding user to lanstad database
  async addInvitedUserToList(emailObject) {
    const clientRoles = [
      {
        clientName: emailObject.clients.name,
        clientId: emailObject.clients.id,
        roleName: emailObject.role.name,
        roleId: emailObject.role.id,
      },
    ];
    const invitationObject = {
      email: emailObject.email.to,
      companyId: [emailObject.clients.id],
      clientRoles,
      projectIds: [],
      taskIds: [],
      companyRole: 1,
    };

    return api
      .post("/user/invitations/add", invitationObject)
      .then((response) => {
        return response.data.invitedUserId;
      })
      .catch((err) => console.log(err));
  }

  // functionality to get the options selected from the MultiSelectorSet component
  getOptionsSelected() {
    const multiOptions = this.multiSelectorRef.current.getOptionSelected();
    return multiOptions;
  }

  // functionality to get the option selected from the SingleSelectorSet component
  getOptionSelected() {
    const singleOption = this.singleSelectorRef.current.getOptionSelected();
    return singleOption;
  }

  render() {
    return (
      <div id="inviteNewUserForm">
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
            <SingleSelectorSet
              ref={this.multiSelectorRef}
              isInvalid={this.state.isClientInvalid}
              optionsList={this.state.selectableClients}
              typeSelector="client"
            />
          </div>

          <div className="invite-form-section">
            <SingleSelectorSet
              ref={this.singleSelectorRef}
              isInvalid={this.state.isRoleInvalid}
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
