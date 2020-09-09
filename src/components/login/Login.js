import "./Login.css";
import React from "react";
import { Field, reduxForm } from "redux-form";
import LeftSign from "../sign/leftSign/LeftSign";
import RightSign from "../sign/rightSign/RightSign";
import { connect } from "react-redux";
import { authentication } from "../../redux/actions";

class Login extends React.Component {
  renderInput({ input, meta, label, ...attributes }) {
    return (
      <div className="login__field">
        <label htmlFor={label}>{label}</label>
        <input {...input} {...attributes} id={label} />
      </div>
    );
  }

  onFormSubmit = ({ email, password }) => {
    console.log("1");
    this.props.authentication(email, password);
  };

  render() {
    const header = { p: "Don't have account?", button: "Get Started" };
    const title = { h3: "Sign in to TimeCloud", p: "Enter your detail below" };
    return (
      <div className="login">
        <div className="login__left">
          <LeftSign></LeftSign>
        </div>
        <div className="login__right">
          <RightSign header={header} title={title}>
            <form
              className="login__form"
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
            >
              <Field
                name="email"
                type="text"
                placeholder="juile@gmail.com"
                component={this.renderInput}
                label="email"
              />
              <Field
                name="password"
                type="password"
                placeholder="6+ character"
                component={this.renderInput}
                label="password"
              />
              <button className="login__submit">Sign In</button>
            </form>
          </RightSign>
        </div>
      </div>
    );
  }
}

const loginForm = reduxForm({
  form: "loginForm",
})(Login);

export default connect(null, {
  authentication,
})(loginForm);
