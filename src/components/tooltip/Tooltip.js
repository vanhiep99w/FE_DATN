import "./Tooltip.css";
import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const Tooltip = (props) => {
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);
  const contentRef = useRef(null);

  const { direction, backgroundColor, arrowSize, css, maxWidth } = props;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setPosition = useCallback(() => {
    const tooltip = tooltipRef.current;
    const arrow = arrowRef.current;
    const pin = tooltipRef.current.previousElementSibling;
    if (pin === null)
      throw new Error(
        "Can't not find sibling to pin Tooltip ! please add sibling element"
      );
    const html = document.firstElementChild;

    if (html.offsetWidth < pin.offsetLeft + tooltip.offsetWidth / 2) {
      const extraLeft =
        html.offsetWidth - (pin.offsetLeft + tooltip.offsetWidth / 2);
      tooltip.style.left =
        pin.offsetLeft -
        tooltip.offsetWidth / 2 +
        extraLeft -
        pin.offsetWidth +
        "px";
    } else {
      tooltip.style.left =
        pin.offsetLeft - tooltip.offsetWidth / 2 + pin.offsetWidth / 2 + "px";
    }
    if (direction === "top") {
      tooltip.style.top =
        pin.offsetTop - arrow.offsetHeight / 2 - tooltip.offsetHeight + "px";
    } else {
      tooltip.style.top =
        pin.offsetTop + pin.offsetHeight + arrow.offsetHeight / 2 + "px";
    }
    arrow.style.left =
      pin.offsetLeft - tooltip.offsetLeft + pin.offsetWidth / 2 + "px";
  });

  useEffect(() => {
    setPosition();
    window.addEventListener("resize", setPosition);
  }, [setPosition]);

  return (
    <div
      className="tooltip"
      ref={tooltipRef}
      style={{
        backgroundColor,
        maxWidth,
        ...css,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <p
        className={`tooltip__arrow tooltip__arrow__${direction}`}
        ref={arrowRef}
        style={{
          border: `${arrowSize} solid transparent`,
          borderTopColor: direction === "top" ? backgroundColor : "transparent",
          borderBottomColor:
            direction === "bottom" ? backgroundColor : "transparent",
        }}
      ></p>
      <div className="tooltip__content" ref={contentRef}>
        {props.children}
      </div>
    </div>
  );
};
Tooltip.propTypes = {
  backgroundColor: PropTypes.string,
  direction: PropTypes.oneOf(["top", "bottom"]),
  arrowSize: PropTypes.string,
  maxWidth: PropTypes.string,
  css: PropTypes.object,
};
Tooltip.defaultProps = {
  backgroundColor: "white",
  direction: "bottom",
  arrowSize: "1rem",
  maxWidth: "15rem",
};
export default Tooltip;
