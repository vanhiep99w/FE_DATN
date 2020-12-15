import "./Budget.css";
import Input from "../common/input/Input";
import React from "react";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DoubleButton from "../common/doubleButton/DoubleButton";

const Budget = ({ haveBudget, setHaveBudget, budget, setBudget }) => {
  const noBudgetHandler = () => {
    setHaveBudget(false);
  };

  return (
    <div className="budget">
      <div className="budget__header">
        <div className="budget__header__left">Budget</div>
        <div className="budget__header__center">
          <p>Do it have budget?</p>
          <p>
            Budget will have you keep track you budget, never lost any coin...
          </p>
        </div>
        <div className="budget__header__right">
          <DoubleButton
            titleLeft="Yes"
            titleRight="No"
            defaultSelectIndex={haveBudget ? 1 : 2}
            onButtonLeftClick={() => setHaveBudget(true)}
            onButtonRightClick={noBudgetHandler}
          />
        </div>
      </div>
      {haveBudget && (
        <Input
          id="budget"
          label="We budget by"
          placeholder="0.00"
          widthInput="22rem"
          type="number"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
        >
          <AttachMoneyIcon />
        </Input>
      )}
    </div>
  );
};

export default Budget;
