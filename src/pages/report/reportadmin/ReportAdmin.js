import React, { useEffect, useState } from "react";
import "./ReportAdmin.css";
import TimeCloudAPI from "../../../apis/timeCloudAPI";
import ReportAdminUserItem from "./reportadminuseritem/ReportAdminUserItem";
import ReportAdminProjectItem from "./reportadminprojectitem/ReportAdminProjectItem";
import PageDesign from "../../../components/pageDesign/PageDesign";
import { connect } from "react-redux";

const ReportAdmin = ({ members }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  let newUsers = [];

  useEffect(() => {
    setUsers([...members]);
  }, [members]);

  useEffect(() => {
    TimeCloudAPI()
      .get(`companies/52/projects-available`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {});
  }, []);

  users.filter(function (user) {
    let i = newUsers.findIndex((x) => x.id === user.id);
    if (i <= -1) {
      newUsers.push(user);
    }
    return null;
  });

  return (
    <PageDesign title="Report" css={{ paddingBottom: "10rem" }}>
      <div className="report_admin_user">
        <h1>People</h1>
        <div className="report_admin_user_header">
          <h1>Names</h1>
          <p>Hours</p>
        </div>
      </div>
      {newUsers
        .sort((user1, user2) => (user1.name <= user2.name ? -1 : 1))
        .map((user) => (
          <ReportAdminUserItem key={user.id} user={user} />
        ))}

      <div className="report_admin_project">
        <h1>Projects</h1>
        <div className="report_admin_project_header">
          <h1>Names</h1>
          <p>Hours</p>
        </div>
      </div>
      {projects
        .sort((project1, project2) => (project1.name <= project2.name ? -1 : 1))
        .map((project) => (
          <ReportAdminProjectItem key={project.id} project={project} />
        ))}
    </PageDesign>
  );
};
const mapStateToProps = (state) => {
  return {
    members: state.members.members.map((member) => member.user),
  };
};
export default connect(mapStateToProps)(ReportAdmin);
