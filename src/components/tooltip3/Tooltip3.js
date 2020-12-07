import "./Tooltip3.css";
import React from "react";
import ReactDOM from "react-dom";
import { v4 } from "uuid";
import PropTypes from "prop-types";

class Tooltip3 extends React.Component {
  state = {
    show: true,
  };
  constructor(props) {
    super(props);

    if (!props.children) throw new Error("Need pin element !");
    React.Children.map(props.children, (child) => {
      console.log(child);
    });
    this.domNode = document.createElement("div");
    this.domNode.setAttribute("id", v4());
    document.body.appendChild(this.domNode);
  }

  componentDidMount() {
    const a = this.props.children;
    console.log(a);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    document.body.removeChild(this.domNode);
  }

  renderTooltip = () => {
    if (this.state.show) {
      return ReactDOM.createPortal(<h2>Tooltip3</h2>, this.domNode);
    } else return null;
  };

  render() {
    return [this.renderTooltip(), this.props.children];
  }
}
export default Tooltip3;

Tooltip3.propTypes = {
  children: PropTypes.element,
};
