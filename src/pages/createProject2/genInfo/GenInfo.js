import "./GenInfo.css";
import React from "react";
import Input from "../common/input/Input";
import FlipCameraAndroidIcon from "@material-ui/icons/FlipCameraAndroid";
import { randomColorArray, randomNumber } from "../../../utils/Utils";

const GenInfo = ({
  projectName,
  setProjectName,
  clientName,
  setClientName,
  color,
  setColor,
}) => {
  const randomColor = () => {
    setColor(randomColorArray[randomNumber(randomColorArray.length)]);
  };
  return (
    <div className="gen-info">
      <div className="gen-info__left">
        <Input
          id="name"
          label="project"
          placeholder="Project name"
          widthInput="40rem"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          maxLength={40}
        />
        <Input
          id="client"
          label="client"
          placeholder="Client name"
          widthInput="20rem"
          css={{ marginBottom: "1rem" }}
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
          maxLength={40}
        />
      </div>
      <div className="gen-info__right">
        <input
          id="color"
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />
        <label htmlFor="color">Color</label>
        <button onClick={randomColor}>
          <FlipCameraAndroidIcon />
        </button>
      </div>
    </div>
  );
};

export default GenInfo;
