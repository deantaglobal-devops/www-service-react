import React from "react";
import { api } from "../../../services/api";
import { generateMagicLink } from "../../../utils/magicLinksMethods";
import Loading from "../../../components/loader/Loading";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationStatus: false,
      isLoading: false,
    };

    this.showConfirmationStatus = this.showConfirmationStatus.bind(this);

    this.emailInput = React.createRef();
  }

  componentDidMount() {
    // when this mounts, prefill with the Forgot Password input with what's in the other email input
    // don't want to set = state, as it wouldn't be editable then - We just want
    // it as a starting point

    const { emailPrefilled } = this.props;
    const secondEmailInput = document.querySelector(".second_input");
    secondEmailInput.value = emailPrefilled;
  }

  showConfirmationStatus() {
    this.setState({ showConfirmationStatus: true });
  }

  async sendEmail() {
    this.setState({ isLoading: true });
    const isEmailValid = await this.validateEmail();
    if (isEmailValid) {
      const data = {
        email: this.emailInput.current.value,
      };
      const generatedMagicLink = await generateMagicLink(
        data,
        "password-reset",
      );
      const body = {
        header: {
          company_id: null,
          task_id: null,
          creator_id: null,
          reply_title: null,
          message_id: null,
        },
        content: {
          to: this.emailInput.current.value,
          cc: [],
          subject: "Link to reset your password",
          body: `<div><p>A password reset has been requested.</p><p>You can reset it by following this link: <a href='${generatedMagicLink}'>${generatedMagicLink}</a></p><p>This link will expire after 6 hours. You can request another on our <a href='${
            import.meta.env.VITE_URL_SERVICE
          }/login'>Log In page</a> if required.</p></div>`,
        },
      };

      return api
        .post("/send", body)
        .then(() => {
          this.showConfirmationStatus();
          this.setState({ isLoading: false });
        })
        .catch(() => this.setState({ isLoading: false }));
    }
    this.setState({ isLoading: false });
  }

  async validateEmail() {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      this.emailInput.current.value !== "" &&
      this.emailInput.current.value.match(mailFormat)
    ) {
      const validUserEmail = await api
        .get(`user/${this.emailInput.current.value}/reset-password/existence`)
        .then((response) => {
          if (response.data.userStatus === "currentLanstadUser") {
            return true;
          }
          this.showConfirmationStatus();
        })
        .catch(() => {
          this.showConfirmationStatus();
        });

      if (validUserEmail === true) {
        this.removeInvalidEmailStyle();
        return true;
      }
      if (validUserEmail === false) {
        this.addInvalidEmailStyle();
        return false;
      }
    } else {
      this.addInvalidEmailStyle();
      return false;
    }
  }

  addInvalidEmailStyle() {
    if (!this.emailInput.current.classList.contains("is-invalid")) {
      this.emailInput.current.classList.add("is-invalid");
    }

    document
      .querySelector(".input-group .validation-error")
      .classList.add("is-invalid");
  }

  removeInvalidEmailStyle() {
    this.emailInput.current.classList.remove("is-invalid");
    document
      .querySelector(".input-group .validation-error")
      .classList.remove("is-invalid");
  }

  render() {
    const { showConfirmationStatus, isLoading } = this.state;
    return (
      <div className="reset-password w-100">
        {isLoading && <Loading />}
        <h2>Reset Your Password</h2>

        <form className="general-forms editable-hidden w-100">
          <div className="form-group w-100">
            <div className="input-group input-group-seamless password-field">
              <label htmlFor="username">
                <span>Username</span>
                <input
                  ref={this.emailInput}
                  type="email"
                  className="form-control second_input"
                  id="username"
                  placeholder="Email"
                  autoComplete="off"
                />
                <span className="validation-error">
                  Please enter a valid email adress
                </span>
              </label>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => this.sendEmail()}
          >
            Send Password Reset Email
          </button>
        </form>

        {showConfirmationStatus === true && (
          <p className="confirmation-message">
            If there’s an account with that email address, a password reset
            email should arrive shortly.
          </p>
        )}
      </div>
    );
  }
}

export default ForgotPassword;
