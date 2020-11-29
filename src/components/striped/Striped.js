import "./Striped.css";
import React from "react";

const Striped = ({
  stripedColor = "#3787D7",
  backgroundColor = "transparent",
  stripedSize = 5,
  stripedEmptySize = 5,
  rotateDeg = "0deg",
}) => {
  return (
    <div className="striped">
      <div
        style={{
          width: "100%",
          height: "100%",
          color: backgroundColor,
          backgroundImage: `repeating-linear-gradient(
          ${rotateDeg},
          ${stripedColor} 0,
          ${stripedColor} ${stripedSize}px,
          transparent ${stripedSize}px,
          transparent ${stripedSize + stripedEmptySize}px
        )`,
        }}
      ></div>
    </div>
  );
};

export default Striped;
