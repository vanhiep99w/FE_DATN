import "./CreateProjectForm.css";
import { reduxForm, Field } from "redux-form";
import React from "react";

const renderInput = ({ input, meta, label, flexInput, ...attribute }) => {
  return (
    <div className="project_form_field">
      <label htmlFor={attribute.id}>{label}</label>
      <input {...attribute} {...input} style={{ flex: `${flexInput}` }} />
    </div>
  );
};

const renderProjectColor = (params) => {
  const { input, meta, label, flexInput, ...attribute } = params;
  return (
    <div className="project_form_field project_form_field__color">
      <label>{label}</label>
      <div style={{ flex: `${flexInput}` }}>
        <h4>Choose color ....</h4>
        <p>
          Each project will have a specific color that will help you team
          members recognize supper easily.
        </p>
      </div>
      <input {...attribute} {...input} />
    </div>
  );
};

const CreateProjectForm = (props) => {
  return (
    <form
      className="create_project_form"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field
        name="project_name"
        label="Project"
        placeholder="project name"
        component={renderInput}
        id="project"
        type="text"
        flexInput=".5"
      />
      <Field
        name="client_name"
        placeholder="client name "
        component={renderInput}
        type="text"
        flexInput=".3"
      />
      <Field
        name="project_color"
        label="Background Color"
        component={renderProjectColor}
        type="color"
        flexInput=".6"
      />
    </form>
  );
};

export default reduxForm({
  form: "createProjectForm",
})(CreateProjectForm);