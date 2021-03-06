import "./Projects.css";
import React from "react";
import Table from "../../components/table/Table";
import Point from "../../components/point/Point";
import history from "../../history";
import TrackTime from "./TrackTime/TrackTime";
import UserColumn from "./ProjectUser/UserColumn";
import PageDesign from "../../components/pageDesign/PageDesign";
import ActionColumn from "./actionColumn/ActionColumn";
import timeCloudAPI from "../../apis/timeCloudAPI";
import Axios from "axios";

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txtSearch: "",
      projects: [],
    };
    this.cancelSource = Axios.CancelToken.source();
    this.cssHeader = {
      textAlign: "left",
    };
    this.columns = {
      project: {
        key: "project",
        label: "project",
        width: "20%",
        cssHeader: { ...this.cssHeader, paddingLeft: "1rem" },
        cssData: {
          textTransform: "capitalize",
          verticalAlign: "middle",
          cursor: "pointer",
          paddingLeft: "1rem",
        },
        convertData: (project) => (
          <Point
            color={project.color}
            pointSize="15"
            title={project.name}
            key={project.id}
          />
        ),
      },
      client: {
        key: "client",
        label: "client",
        width: "25%",
        cssHeader: this.cssHeader,
        cssData: {
          verticalAlign: "sub",
          cursor: "pointer",
          minHeight: "3.7rem",
        },
        convertData: (project) => project.clientName,
      },
      tracktime: {
        key: "tracktime",
        label: "Tracked Time (h)",
        width: "20%",
        cssHeader: this.cssHeader,
        cssData: {
          verticalAlign: "middle",
          cursor: "pointer",
        },
        convertData: (project) => <TrackTime projectId={project.id} />,
      },
      members: {
        key: "members",
        label: "Members",
        width: "23%",
        cssHeader: this.cssHeader,
        cssData: {
          verticalAlign: "middle",
          cursor: "pointer",
        },
        convertData: (project) => <UserColumn project={project} />,
      },
      actions: {
        key: "actions",

        width: "10%",
        cssHeader: this.cssHeader,
        cssData: {
          verticalAlign: "middle",
          cursor: "pointer",
        },
        convertData: (project) => {
          return (
            <ActionColumn
              project={project}
              onEdit={this.onEdit}
              deleteProject={this.deleteProject}
            />
          );
        },
      },
    };
  }

  deleteProject = (project) => {
    this.setState({
      projects: this.state.projects.map((ele) => {
        if (project.id === ele.id) {
          return { ...ele, done: true };
        } else {
          return ele;
        }
      }),
    });
  };

  fetchAllProject = async () => {
    const res = await timeCloudAPI().get("projects");
    this.setState({ projects: res.data });
  };

  componentDidMount = () => {
    if (!this.props.adminMode) {
      this.fetchAllProject();
    } else {
      this.setState({
        projects: [
          ...this.props.managedProjects,
          ...this.props.permissionProjects
            .filter(
              (ele) => !this.props.managedProjects.some((e) => e.id === ele.id)
            )
            .map((ele) => {
              return { ...ele, permissionProject: true };
            }),
        ],
      });
    }
  };

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onCreateProject = () => {
    history.push("/create_project");
  };

  onEdit = (project) => {
    history.push({
      pathname: `/edit_project/${project.id}`,
    });
  };

  onSortProjects = (projects) => {
    return projects.sort((first, second) => {
      if (first.done) {
        if (second.done) return first.name.localeCompare(second.name);
        return 1;
      } else {
        if (second.done) return -1;
        return first.name.localeCompare(second.name);
      }
      // if (first.done < second.done) return -1;
      // else if (first.done > second.done) return 1;
      // else return 0;
    });
  };

  cssCondition(project) {
    if (project.done) {
      return { backgroundColor: "#ece7e7" };
    }
  }

  render() {
    var { txtSearch, projects } = this.state;
    const { adminMode } = this.props;
    projects = this.onSortProjects(projects);
    if (txtSearch) {
      projects = projects.filter((project) => {
        return project.name.toLowerCase().indexOf(txtSearch) !== -1;
      });
    }
    return (
      <PageDesign title="Projects" css={{ marginBottom: "10rem" }}>
        <div className="projects__content">
          <div className="projects__search">
            <input
              type="text"
              value={txtSearch}
              name="txtSearch"
              onChange={this.onChange}
              placeholder="Searching your project"
              className="page_design__animate__left"
            ></input>
          </div>
          {adminMode || (
            <button
              className="projects__bt page_design__animate__right"
              onClick={this.onCreateProject}
            >
              Create new project
            </button>
          )}
        </div>
        <Table
          columns={this.columns}
          cssCondition={this.cssCondition}
          data={projects}
          skeletonLoading={projects.length ? false : true}
          onClickHandler={(element) =>
            history.push({
              pathname: `/projects/${element.id}`,
            })
          }
        />
      </PageDesign>
    );
  }
}

export default Projects;
