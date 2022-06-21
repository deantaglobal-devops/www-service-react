import { BrowserRouter as Router } from "react-router-dom";
import AppProvider from "./hooks/index";
import { LanstadRoutes } from "./routes";

import "./styles/global.css";

export function App() {
  return (
    <Router>
      <AppProvider>
        <LanstadRoutes />
      </AppProvider>
    </Router>
  );
}
