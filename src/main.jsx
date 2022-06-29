// import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  // disabled strict mode because of full calendar
  // waiting the issue about Maximum update depth exceeded error using React 18 to be finxed
  // then we can put the strict mode back again
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
