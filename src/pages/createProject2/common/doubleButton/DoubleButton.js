import "./DoubleButton.css";

import React, { useRef, useState, useEffect } from "react";

// *index : left-1 right-2
const DoubleButton = ({
  titleLeft,
  titleRight,
  defaultSelectIndex = 1,
  onButtonLeftClick,
  onButtonRightClick,
}) => {
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(defaultSelectIndex);
  useEffect(() => {
    if (button1Ref.current.offsetWidth >= button2Ref.current.offsetWidth) {
      setMaxWidth(button1Ref.current.offsetWidth);
    } else {
      setMaxWidth(button2Ref.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    setActiveIndex(defaultSelectIndex);
  }, [defaultSelectIndex]);

  const getStyle = () => {
    if (maxWidth === 0) {
      return { visibility: "hidden" };
    } else {
      return { width: maxWidth };
    }
  };

  const onClickHandler = (index) => {
    setActiveIndex(index);
  };
  const getClassName = (index) => {
    if (index === activeIndex) {
      return "active";
    }
    return "";
  };

  const onClickButtonLeftHandler = () => {
    onClickHandler(1);
    onButtonLeftClick();
  };
  const onClickButtonRightHandler = () => {
    onClickHandler(2);
    onButtonRightClick();
  };

  return (
    <div className="double-button">
      <button
        ref={button1Ref}
        style={getStyle()}
        className={getClassName(1)}
        onClick={onClickButtonLeftHandler}
      >
        {titleLeft}
      </button>
      <button
        ref={button2Ref}
        style={getStyle()}
        className={getClassName(2)}
        onClick={onClickButtonRightHandler}
      >
        {titleRight}
      </button>
    </div>
  );
};

export default DoubleButton;
