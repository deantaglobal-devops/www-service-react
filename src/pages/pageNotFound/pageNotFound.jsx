import { Link, useLocation } from "react-router-dom";
import lanstadLogo from "../../assets/lanstadLogo.svg";
import graphic from "../../assets/graphic.svg";

import "./styles/pageNotFound.styles.css";

export function PageNotFound() {
  const location = useLocation();

  const { pathname } = location;
  return (
    <div className="page-not-found-container">
      <div className="page-not-found-message-container">
        <img className="page-not-found-logo" src={lanstadLogo} alt="Lanstad" />

        {pathname === "/error" ? (
          <>
            <span className="page-not-found-error-code">
              <strong>503</strong>
              Service unavailable
            </span>

            <strong className="page-not-found-first-message">
              Undergoing maintenance
            </strong>

            <span className="page-not-found-error-message">
              the server is temporarily unable to complete your request due to
              regular maintenance. Please try again later
            </span>
          </>
        ) : (
          <>
            <span className="page-not-found-error-code">
              <strong>404</strong>
              Page not found
            </span>

            <strong className="page-not-found-first-message">
              Ooops! You weren't supposed to see this
            </strong>

            <span className="page-not-found-second-message">
              The link you followed probably broken, or the page has been
              removed. Return to the <Link to="/login">homepage.</Link>
            </span>
          </>
        )}
      </div>

      <img className="graphic-image" src={graphic} alt="Lanstad" />
    </div>
  );
}
