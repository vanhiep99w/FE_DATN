import "./SectionDesign.css";
import React from "react";

const SectionDesign = ({ title, children }) => {
  return (
    <div className="section_design">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default SectionDesign;
