import "./Input.css";

import React from "react";

const Input = ({ label, css, id, widthInput, children, ...otherProps }) => {
  return (
    <div className="cp_input" style={{ ...css }}>
      <label htmlFor="id">{label}</label>
      <input
        id={id}
        {...otherProps}
        style={{ width: widthInput }}
        autoComplete="off"
      />
      {children}
    </div>
  );
};

export default Input;
