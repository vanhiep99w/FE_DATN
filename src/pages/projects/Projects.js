import "./Projects.css";
import React from "react";
import { connect } from "react-redux";
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from "../../components/table/Table";
import { fetchProjects } from "../../redux/actions";

const cssHeader = {
    textAlign: "left",
};
const columns = {
    project: {
        key: "project",
        label: "project",
        width: "20%",
        cssHeader,
        cssData: {
        textTransform: "capitalize",
        },
        convertData: (project) => project.name,
    },
    client: {
        key: "client",
        label: "client",
        width: "20%",
        cssHeader,
        convertData: (project) => project.clientName,
    },
    tracktime: {
        key: "tracktime",
        label: "Tracked Time (h)",
        width: "20%",
        cssHeader,
        convertData: (project) => project.name,
    },
    members: {
        key: "members",
        label: "Members",
        width: "20%",
        cssHeader,
        convertData: (project) => project.name,
    },
    actions: {
        key: "actions",
        label: "actions",
        width: "20%",
        cssHeader,
        convertData: () => {
            const styleCom = {
                fontSize: "3rem",
            }
            return (
                <React.Fragment>
                    <EditIcon style={{...styleCom, marginRight: "5px"}}/>
                    <DeleteIcon style={{...styleCom}}/>
                </React.Fragment>
            )    
        },
    },
};

class Projects extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            txtSearch : ""
        }
    }

    componentDidMount = () => {
        this.props.fetchProjects(77);
    }

    onChange = (e) => {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name] : value
        })
    }

  render() {
    console.log(columns, this.props.projects);
    var {projects} = this.props;
    var {txtSearch} = this.state;
    if(txtSearch) {    
        projects = projects.filter((project) => {
            return project.name.toLowerCase().indexOf(txtSearch) !== -1;
        });
    }
    return (
        <div className="projects">
            <div className = "projects__title">
                <h1>Projects</h1>
            </div>
            <div className = "projects__content">
                <div className = "projects__search" >
                    <input
                        type="text"
                        name= "txtSearch"
                        onChange = {this.onChange}
                        placeholder="Searching your project"
                    ></input>
                    <SearchIcon onClick = {this.onSearch}/>
                </div>
                <button className = "projects__bt">
                    Create new project
                </button>
            </div>
            <Table
                columns={columns}
                data = {projects}
                onClickHandler={(element) => console.log(element)}
            />
        </div>
      );
  }
}

const mapStateToProp = (state) => {
    const { projects } = state.projects;
    console.log(projects)
    return {
      projects: projects.map((project) => {
        return { ...project, id: project.id };
      }),
    };
  };
  export default connect(mapStateToProp, {
    fetchProjects
  })(Projects);