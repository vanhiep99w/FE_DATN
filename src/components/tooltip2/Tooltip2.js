import "./Tooltip2.css";
import ReactDOM from "react-dom";
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

const Tooltip2 = ({ children }) => {
  const [show, setShow] = useState(false);

  const pinRef = useRef(null);
  const tooltipRef = useRef(null);
  const renderTooltip = () => {
    if (show) {
      const { top, left } = pinRef.current.getBoundingClientRect();
      console.log(window.innerHeight, window.innerWidth, left);

      return ReactDOM.createPortal(
        <div
          className="tooltip_v2"
          ref={tooltipRef}
          style={{
            bottom: `${window.innerHeight - top - window.scrollY}px`,
            left: `${left + window.scrollX}px`,
          }}
        >
          <div className="tooltip_v2__arrow"></div>
          <div className="tooltip_v2__content"></div>
        </div>,
        document.getElementById("tooltip")
      );
    }
    return null;
  };

  const pin = (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      ref={pinRef}
      key={0}
    >
      {children}
    </span>
  );
  return [pin, renderTooltip()];
};

export default Tooltip2;

Tooltip2.propTypes = {
  children: PropTypes.node.isRequired,
};
