import React from "react";
import Collapse from "../../../components/collapse/Collapse";
import ShowUser from "./showUsers/ShowUsers";
import { v4 } from "uuid";
import "./ProjectDetailTeam.css";

class ProjectDetailTeam extends React.Component {
  getUnavailableTasks(userId) {
    const temp = this.props.unavailableUsers.find(
      (ele) => ele.user?.id === userId
    );
    if (temp && temp.tasks) {
      return temp.tasks;
    }
    return [];
  }

  render() {
    var { project, projectUsers } = this.props;
    console.log(projectUsers);
    // var { projectUsers } = this.state;
    return (
      <div className="project_detail_team">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Tracked (h)</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <Collapse>
          {projectUsers
            .sort((user1, user2) =>
              user1.user.name <= user2.user.name ? -1 : 1
            )
            .map((projectUser, index) => {
              return (
                <ShowUser
                  project={project}
                  user={projectUser.user}
                  isDoing={projectUser.isDoing}
                  unavailableTasks={this.getUnavailableTasks(
                    projectUser.user.id
                  )}
                  index={index}
                  key={v4()}
                />
              );
            })}
        </Collapse>
      </div>
    );
  }
}

export default ProjectDetailTeam;
