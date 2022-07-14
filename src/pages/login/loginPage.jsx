import { useEffect } from "react";
import { DeantaRational } from "./components/DeantaRational";
import { LoginReactJS } from "./components/LoginReactJS";

import "../../styles/bootstrap/bootstrap.min.css";
import "../../styles/shards-dashboards.1.3.1.min.css";
import "../../styles/style.css";
import "./styles/LoginPage.styles.css";

export function LoginPage() {
  useEffect(() => {
    document.title = "Test Lanstad — Login";
  }, []);

  return (
    <div className="login-container row-login d-flex w-100">
      <div className="col-lg-9 m-0 p-0" id="leftSide">
        <DeantaRational />
      </div>
      <div className="col m-0 p-0" id="rightSide">
        <LoginReactJS />
      </div>
    </div>
  );
}
