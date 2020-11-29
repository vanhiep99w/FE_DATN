import React from "react";
import "./App.css";
import "../assets/css/animation.css";
// import { Router as BrowserRouter } from "react-router-dom";
// import history from "../history";
// import Router from "./Router";
import TimeOffAdmin from "../pages/timeOffAdmin/TimeOffAdmin";
function App() {
  return (
    <div className="app">
      {/* <BrowserRouter history={history}>
        <Router />
      </BrowserRouter> */}
      <TimeOffAdmin />
    </div>
  );
}

export default App;
