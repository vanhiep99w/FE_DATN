import "./TagItem.css";
import React, { useState, useRef, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Transition } from "react-transition-group";

const TagItem = ({ data, convertData, onRemoveItem }) => {
  const [isShow, setIsShow] = useState(true);
  const tagItemRef = useRef(null);
  useEffect(() => {
    console.log(1);
    setIsShow(data ? true : false);
  }, [data]);
  console.log(isShow, data);
  return (
    <Transition
      in={isShow}
      timeout={{ enter: 500, exit: 1000 }}
      mountOnEnter
      unmountOnExit
    >
      {(state) => {
        const tagItemDom = tagItemRef.current;
        if (state === "entered" && tagItemDom) {
          const { style, scrollWidth } = tagItemDom;
          style.maxWidth = scrollWidth + "px";
          style.opacity = "1";
        }
        if (state === "exiting") {
          const { style } = tagItemDom;
          style.opacity = "0";
          style.maxWidth = 0;
          style.marginRight = 0;
        }
        return (
          <div
            className="tag_item"
            ref={tagItemRef}
            // style={{
            //   animationDelay: `${(index - 1) * 0.1}s`,
            //   transitionDelay: `${(index - 1) * 0.1}s`,
            // }}
          >
            <div className="tag_item__content"></div>
          </div>
        );
      }}
    </Transition>
  );
};

export default TagItem;