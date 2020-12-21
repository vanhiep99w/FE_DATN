import React from "react";
import Collapse from "../../../components/collapse/Collapse";
import ViewUsersByTask from "./viewUsersByTask/ViewUsersByTask";
import "./ProjectDetailTask.css";

class ProjectDetailTask extends React.Component {
  getUnavailableUser = (taskId) => {
    const { unavailableUsers } = this.props;
    const temp = unavailableUsers.filter((ele) =>
      ele.tasks?.some((e) => e === taskId)
    );
    return temp.map((ele) => ele.user);
  };

  render() {
    return (
      <div className="project_detail_task">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Task</th>
              <th>Tracked (h)</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <Collapse>
          {this.props.tasks.map((task) => {
            return (
              <ViewUsersByTask
                task={task}
                key={task.id}
                oldUsers={this.getUnavailableUser(task.id)?.map((ele) => {
                  return { ...ele, isDoing: false };
                })}
              />
            );
          })}
        </Collapse>
      </div>
    );
  }
}

export default ProjectDetailTask;
