import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/Auth";
import ForgotPassword from "./ForgotPassword";
import Loading from "../../../components/loader/Loading";

import LanstadBetaLogo from "../../../assets/lanstad_beta_logo.svg";

import "../styles/LoginReactJS.styles.css";

export function LoginReactJS() {
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isShowStatus, setIsShowStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  // update the error message part of the component when needed
  const updateErrorMsg = (msg) => {
    const node = document.querySelectorAll("#errorMsg")[0];
    node.innerHTML = msg;
  };

  const hideLoader = () => {
    const spinnerClass = document.querySelector("#spinner");
    spinnerClass.classList.remove("fa-spinner");
  };

  const errorClass = (id) => {
    const usernameClass = document.querySelector(`#${id}`);
    usernameClass.classList.add("is-invalid");
    hideLoader();
  };

  const handleSignInSubmit = async () => {
    updateErrorMsg("");
    setIsLoading(true);
    if (loginValue === "" && passwordValue === "") {
      errorClass("username");
      errorClass("password");
      updateErrorMsg("Login is mandatory");
      setIsLoading(false);
      return false;
    }
    if (loginValue === "") {
      errorClass("username");
      updateErrorMsg("Please enter an email address");
      setIsLoading(false);
      return false;
    }
    if (passwordValue === "") {
      errorClass("password");
      updateErrorMsg("Please enter a password");
      setIsLoading(false);
      return false;
    }

    try {
      const isSignInSuccessfully = await signIn({
        username: loginValue,
        password: passwordValue,
      }).catch(() => setIsLoading(false));

      setIsLoading(false);
      if (isSignInSuccessfully?.user?.permissions?.rol === "Journal Editor") {
        navigate("/dashboard/journals");
      } else if (isSignInSuccessfully?.user) {
        navigate("/dashboard");
      } else {
        const node = document.querySelectorAll("#errorMsg")[0];
        node.innerHTML = "Invalid Username or Password.";
        document.querySelector("#username").classList.remove("is-valid");
        document.querySelector("#username").classList.add("is-invalid");
        document.querySelector("#password").classList.remove("is-valid");
        document.querySelector("#password").classList.add("is-invalid");
        document.querySelector("#spinner").classList.remove("fa-spinner");
      }
    } catch (err) {
      const node = document.querySelectorAll("#errorMsg")[0];
      node.innerHTML = "Invalid Username or Password.";
      document.querySelector("#username").classList.remove("is-valid");
      document.querySelector("#username").classList.add("is-invalid");
      document.querySelector("#password").classList.remove("is-valid");
      document.querySelector("#password").classList.add("is-invalid");
      document.querySelector("#spinner").classList.remove("fa-spinner");
    }
  };

  const successClass = (id) => {
    const usernameClass = document.querySelector(`#${id}`);
    usernameClass.classList.remove("is-invalid");
  };

  // enter key function
  const enterPressed = (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      // 13 is the enter keycode
      handleSignInSubmit();
    }
  };

  const toggleViewPassword = () => {
    const passwordInput = document.querySelector("input#password");
    const viewPasswordButton = document.querySelector(
      "input#password ~ button",
    );
    const viewPasswordIcon = viewPasswordButton.querySelector("i");

    if (passwordInput.type === "password") {
      // toggle to be text
      passwordInput.type = "text";
      viewPasswordButton.title = "Hide Password";
      viewPasswordIcon.innerHTML = "visibility_off";
    } else {
      // toggle to be password
      passwordInput.type = "password";
      viewPasswordButton.title = "Show Password";
      viewPasswordIcon.innerHTML = "visibility";
    }
  };

  // update the login component value
  const updateLoginValue = (evt) => {
    setLoginValue(evt.target.value);
    successClass("username");
  };

  // update the password component value
  const updatePasswordValue = (evt) => {
    const keycode = evt.keyCode;

    setPasswordValue(evt.target.value);

    if (keycode === 13) {
      handleSignInSubmit();
    }
    successClass("password");
  };

  const showStatus = () => {
    setIsShowStatus(!isShowStatus);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="rightSideContainer">
        <div className="card-body-login">
          <img
            className="img-fluid"
            src={LanstadBetaLogo}
            alt="Lanstad"
            style={{
              // width: '85%',
              width: `${200}px`,
              // marginBottom: '2rem',
              alignSelf: "center",
              marginBottom: `${56}px`,
            }}
          />
          <div className="form-group w-100">
            <div className="input-group input-group-seamless password-field">
              <label htmlFor="username">
                <span>Username</span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Email"
                  onChange={(e) => updateLoginValue(e)}
                  onKeyPress={(e) => enterPressed(e)}
                  // autoFocus
                />
              </label>
            </div>
          </div>
          <div className="form-group w-100">
            <div className="input-group input-group-seamless password-field">
              <label htmlFor="password">
                <span>Password</span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Type your password"
                  maxLength="32"
                  onChange={(event) => updatePasswordValue(event)}
                  onKeyUp={(event) => updatePasswordValue(event)}
                />
                <button
                  type="button"
                  title="Show Password"
                  onClick={() => toggleViewPassword()}
                >
                  <i className="material-icons-outlined">visibility</i>
                </button>
              </label>
            </div>
          </div>
          <div className="flex-column form-group w-100">
            <button
              type="submit"
              className="btn-login btn-accent d-table mx-auto signinbtn"
              onClick={() => handleSignInSubmit()}
            >
              <i id="spinner" className="fa fa-pulse fa-fw" /> Sign In
            </button>
            <div id="errorMsg" />
          </div>

          <div className="auth-form__meta d-flex mt-4">
            {/* <a href="#">Request Access</a> */}
            <button
              type="button"
              className="forgot-password"
              onClick={() => showStatus()}
            >
              Forgot your password?
            </button>
          </div>

          {isShowStatus && (
            <ForgotPassword
              emailPrefilled={loginValue}
              showStatus={isShowStatus}
            />
          )}
        </div>
      </div>
    </>
  );
}
