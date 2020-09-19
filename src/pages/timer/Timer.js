import React from "react";
import "./Timer.css";
import Time from "../../components/time/Time";
import ProjectList from "../../components/projects/ProjectList";

class Timer extends React.Component {
  render() {
    return (
      <div className="timer">
        <Time />
        <ProjectList />
      </div>
    );
  }
}

export default Timer;