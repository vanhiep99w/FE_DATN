import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Login from "../pages/login/Login";
import Timer from "../pages/timer/Timer";
import SignUp from "../pages/signup/SignUp";
import Header from "../components/header/Header";
import { checkAuth, setRedirectPath, fetchUser } from "../redux/actions";
import { USER_ID } from "../utils/localStorageContact";
class Router extends React.Component {
  componentDidMount() {
    this.props.checkAuth();
    const userId = localStorage.getItem(USER_ID);
    if (userId) {
      this.props.fetchUser(userId);
    }
  }

  router = () => {
    return;
  };
  render() {
    return (
      <React.Fragment>
        {this.props.isLogin ? (
          <React.Fragment>
            <Header />
            <Switch>
              <Route path="/timer" component={Timer} />
              <Redirect from="" to="/timer" />
            </Switch>
          </React.Fragment>
        ) : (
          <Switch>
            <Route path="/signup" component={SignUp} />

            <Route path="/login" component={Login} />
            <Redirect from="*" to="/login" />
          </Switch>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.auth.token ? true : false,
    authRedirectPath: state.auth.authRedirectPath,
  };
};
export default connect(mapStateToProps, {
  checkAuth,
  setRedirectPath,
  fetchUser,
})(Router);
