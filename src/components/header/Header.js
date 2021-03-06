import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import Logo from "../logo/Logo";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { connect } from "react-redux";
import { logout } from "../../redux/actions";
import { NavLink } from "react-router-dom";
import UserInfo from "../../components/userInfo/UserInfo";
import history from "../../history/index";

const Header = ({ user, logout, managedProjects, permissionProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  function onClickHandler() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    let isMounted = true;
    window.addEventListener("mouseup", (event) => {
      if (
        event.target.parentElement !==
        dropDownRef.current?.previousElementSibling
      ) {
        if (isMounted) setIsOpen(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const onProfile = () => {
    history.push(`/profile/${localStorage.getItem("userId")}`);
  };

  const features = user?.roles?.some((ele) => ele.id === 1) ? (
    <React.Fragment>
      <NavLink to="/timer" activeClassName="header__feature__active">
        Your timer
      </NavLink>
      <NavLink to="/time-off" activeClassName="header__feature__active">
        Time off
      </NavLink>
      <NavLink
        to={{
          pathname: "/report",
          state: localStorage.getItem("userId"),
        }}
        activeClassName="header__feature__active"
      >
        Report
      </NavLink>
      <NavLink to="/manage" activeClassName="header__feature__active">
        Manage
      </NavLink>
      <NavLink to="/projects" activeClassName="header__feature__active">
        Projects
      </NavLink>
      <NavLink to="/discussion" activeClassName="header__feature__active">
        Discussion
      </NavLink>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <NavLink to="/timer" activeClassName="header__feature__active">
        Your timer
      </NavLink>
      <NavLink to="/time-off" activeClassName="header__feature__active">
        Time off
      </NavLink>
      <NavLink
        to={{
          pathname: "/report",
          state: localStorage.getItem("userId"),
        }}
        activeClassName="header__feature__active"
      >
        Report
      </NavLink>
      {(managedProjects.length > 0 || permissionProjects.length > 0) && (
        <NavLink to="/projects" activeClassName="header__feature__active">
          Projects
        </NavLink>
      )}
      <NavLink to="/discussion" activeClassName="header__feature__active">
        Discussion
      </NavLink>
    </React.Fragment>
  );

  return (
    <div className="header">
      <div className="header__logo" onClick={() => history.push("/timer")}>
        <Logo />
        TimeCloud
      </div>
      <div className="header__feature">{features}</div>
      <div className="header__account">
        <UserInfo
          avatar={user?.avatar ? user.avatar : null}
          primaryInfo={user?.name}
          cssForPrimaryInfo={{
            color: "white",
            paddingTop: ".85rem",
            fontSize: "1.6rem",
          }}
        />
        <button onClick={onClickHandler}>
          <ArrowDropDownIcon />
        </button>
        <div
          className={`header__drop_down ${isOpen ? "active" : ""}`}
          ref={dropDownRef}
        >
          <p onClick={() => onProfile()}>Profile</p>
          <p
            onClick={() => {
              logout();
            }}
          >
            Log Out
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { user, managedProjects, permissionProjects } = state.auth;
  return {
    user,
    managedProjects,
    permissionProjects,
  };
};

export default connect(mapStateToProps, {
  logout,
})(Header);
