import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { api } from "../../services/api";
import Loading from "../../components/loader/Loading";

import lanstadLogo from "../../assets/lanstad_v2-logo.png";
import favIcon from "../../assets/favicon.png";

import "../../styles/bootstrap/bootstrap.min.css";
import "../../styles/shards-dashboards.1.3.1.min.css";
import "../../styles/style.css";
import "./styles/resetPassword.styles.css";

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isToggleViewPassword, setIsToggleViewPassword] = useState(false);
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lanstad — Reset Password";

    if (!token) {
      navigate("/login");
    }

    const handleMagicLink = async () => {
      const responseMagicLink = await api.get(`/magic-link/${token}`);

      if (!responseMagicLink.data) {
        navigate("/login");
      }

      const responseTokenDecode = await api.post("/token/decode", {
        token: responseMagicLink?.data[0].token,
      });

      const userName = responseTokenDecode?.data?.payload?.user?.email;
      setUsername(userName);

      const responseUserId = await api.get(`/user/getId/${userName}`);
      setUserId(responseUserId?.data?.userId);
    };

    handleMagicLink();
  }, []);

  function toggleViewPassword() {
    setIsToggleViewPassword(!isToggleViewPassword);
  }

  function updatePassword() {
    const passwordEl = document.querySelector("#password");

    if (newPassword !== "") {
      setIsLoading(true);
      passwordEl.classList.remove("is-invalid");

      api
        .post("/token/passwordsubmit", {
          password: newPassword,
          userId,
        })
        .then(() => {
          api
            .post(`/magic-link/used/${token}`)
            .then(async () => {
              localStorage.setItem("passwordJustReset", "true");

              const isSignInSuccessfully = await signIn({
                username,
                password: newPassword,
              }).catch(() => setIsLoading(false));

              setIsLoading(false);

              if (isSignInSuccessfully) {
                navigate("/dashboard");
              }
            })
            .catch(() => setIsLoading(false));
        })
        .catch(() => setIsLoading(false));
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className="password-reset-container">
        <div className="card shadow card-login-text">
          <div className="card-body">
            <img
              className="auth-form__logo d-table mx-auto mb-3"
              src={favIcon}
              alt="Lanstad"
            />
            <img
              className="auth-form__logo2 d-table mx-auto mb-5"
              src={lanstadLogo}
              alt="Lanstad"
            />

            <div className="form-group form-group-container">
              <div className="input-group input-group-seamless password-field">
                <label htmlFor="password">
                  <span>New Password</span>
                  <input
                    type={isToggleViewPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    maxLength="32"
                    placeholder="Type a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    title={
                      isToggleViewPassword ? "Show Password" : "Hide Password"
                    }
                    onClick={() => toggleViewPassword()}
                  >
                    <i className="material-icons-outlined">
                      {isToggleViewPassword ? "visibility_off" : "visibility"}
                    </i>
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-accent d-table mx-auto signinbtn signinbtn-reset-password"
                onClick={() => updatePassword()}
              >
                <i id="spinner" className="fa fa-pulse fa-fw" />
                Reset Password
              </button>
            </div>

            <div className="expired" hidden>
              <p>This password reset link has expired.</p>
              <p>
                If you'd still like to reset your password, you can do so on the
                <Link to="/login">log in page</Link>.
              </p>
            </div>
            <div className="expired" id="statusmsg" style={{ display: "none" }}>
              <p className="successmsg">
                Your password has been changed sucessfully.
              </p>
              <p>
                Please use the link to Login
                <Link to="/login">log in page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
