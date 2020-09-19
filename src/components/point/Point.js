import "./Point.css";
import React from "react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import PropTypes from "prop-types";

const Point = (props) => {
  const { pointSize, color, title } = props;
  return (
    <div className="point">
      <FiberManualRecordIcon
        style={{
          fontSize: `${pointSize ? pointSize : "10"}px`,
          color: `#${color}`,
        }}
      />
      {title ? <p className="title">{title}</p> : null}

      {props.children}
    </div>
  );
};

export default Point;

Point.propTypes = {
  color: PropTypes.string,
  pointSize: PropTypes.string,
  title: PropTypes.string.isRequired,
};
