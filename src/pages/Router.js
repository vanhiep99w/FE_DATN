import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import withAsyncComponent from "../hoc/withAsyncComponent";
import { checkAuth, setRedirectPath, fetchUser } from "../redux/actions";
import Header from "../components/header/Header";
import NotFound from "./notFound/NotFound";

const Login = withAsyncComponent(() => {
  return import("../pages/login/Login");
});

const SignUp = withAsyncComponent(() => {
  return import("./signup/SignUp");
});

const Timer = withAsyncComponent(() => {
  return import("./timer/Timer");
});

const Manage = withAsyncComponent(() => {
  return import("./manage/Manage");
});
const CreateProject = withAsyncComponent(() => {
  return import("./createProject2/CreateProject2");
});
const Report = withAsyncComponent(() => {
  return import("./report/Report");
});
const Projects = withAsyncComponent(() => {
  return import("./../pages/companyProjects/Projects");
});
const ProjectDetail = withAsyncComponent(() => {
  return import("./projectDetail/ProjectDetail");
});
const Profile = withAsyncComponent(() => {
  return import("./profile/Profile");
});
const ReportAdmin = withAsyncComponent(() => {
  return import("./report/reportadmin/ReportAdmin");
});
const Discussion = withAsyncComponent(() => {
  return import("../pages/discussion/Discussion");
});
const CreateRequestTimeOff = withAsyncComponent(() => {
  return import("../pages/createRequestTimeOff/CreateRequestTimeOff");
});
const TimeOffAdmin = withAsyncComponent(() => {
  return import("../pages/timeOffAdmin/TimeOffAdmin");
});
const TimeOff = withAsyncComponent(() => {
  return import("../pages/timeOff/TimeOff");
});

const AllRequest = withAsyncComponent(() => {
  return import("../pages/allRequest/AllRequest");
});

const Payroll = withAsyncComponent(() => {
  return import("../pages/payroll/Payroll");
});

class Router extends React.Component {
  componentDidMount() {
    this.props.checkAuth();
  }

  render() {
    const { user, isLogin, managedProjects, permissionProjects } = this.props;
    let routes;
    if (user?.roles?.some((ele) => ele.id === 1)) {
      routes = (
        <Switch>
          <Redirect from="/" exact to="/timer" />
          <Route path="/timer" component={Timer} />
          <Route path="/report" exact component={ReportAdmin} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/report/:id" component={Report} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/time-off" component={TimeOffAdmin} />
          <Route path="/manage" component={Manage} />
          <Route path="/create_project" component={CreateProject} />
          <Route path="/edit_project/:id" component={CreateProject} />
          <Route path="/projects" exact component={Projects} />
          <Route path="/projects/:id" exact component={ProjectDetail} />
          <Route
            path="/create-request-time-off"
            component={CreateRequestTimeOff}
          />
          <Route path="/all-request" component={AllRequest} />
          <Route path="/discussion" component={Discussion}></Route>
          <Route path="/projects/:id/payroll" component={Payroll}></Route>
          <Route component={NotFound} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Redirect from="/" exact to="/timer" />
          <Route path="/timer" component={Timer} />
          <Route path="/report" component={Report} />
          <Route
            path="/create-request-time-off"
            component={CreateRequestTimeOff}
            exact
          />
          <Route path="/projects/:id/payroll" component={Payroll}></Route>
          <Route
            path="/create-request-time-off/:id"
            component={CreateRequestTimeOff}
          />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/discussion" component={Discussion} />
          {user?.roles && <Route path="/time-off" component={TimeOff} />}
          {(managedProjects.length || permissionProjects.length) && (
            <>
              <Route
                path="/projects"
                exact
                render={() => (
                  <Projects
                    adminMode={true}
                    managedProjects={managedProjects}
                    permissionProjects={permissionProjects}
                  />
                )}
              />
              <Route path="/edit_project/:id" component={CreateProject} />
              <Route path="/projects/:id" component={ProjectDetail} />
            </>
          )}

          {user?.roles ? <Route component={NotFound} /> : null}
        </Switch>
      );
    }
    return (
      <React.Fragment>
        {isLogin ? (
          <React.Fragment>
            <Header />
            {routes}
          </React.Fragment>
        ) : (
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { token, user, managedProjects, permissionProjects } = state.auth;
  return {
    isLogin: token ? true : false,
    user,
    managedProjects,
    permissionProjects,
  };
};
export default connect(mapStateToProps, {
  checkAuth,
  setRedirectPath,
  fetchUser,
})(Router);
