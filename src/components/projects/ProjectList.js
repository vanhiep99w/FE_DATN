import React from "react";
import "./ProjectList.css";
import { fetchProjects } from "../../redux/actions";
import { connect } from "react-redux";
import ProjectItem from "./projectItem/ProjectItem";
import TaskList from "../tasks/TaskList";
import { randomNumber, randomColorArray } from "../../utils/Utils";
import Skeleton from "../loading/skeleton/Skeleton";

class ProjectList extends React.Component {
  componentDidMount() {
    this.props.fetchProjects(this.props.userId);
  }

  renderProjectList() {
    if (this.props.isFetching) {
      return <Skeleton />;
    }
    return this.props.projects.map((project) => {
      return (
        <ProjectItem
          project={project}
          key={project.id}
          color={randomColorArray[randomNumber(randomColorArray.length)]}
        >
          <TaskList projectId={project.id} />
        </ProjectItem>
      );
    });
  }
  render() {
    return <div className="project_list">{this.renderProjectList()}</div>;
  }
}

const mapStateToProps = (state) => {
  const { projects, auth } = state;
  const { isFetching } = projects;
  const { userId } = auth;
  return {
    projects: projects["projects"],
    isFetching: isFetching,
    userId,
  };
};

export default connect(mapStateToProps, {
  fetchProjects,
})(ProjectList);
