import { Component } from "react";
import * as d3 from "d3";

class Visualization2 extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // console.log(this.props.data)
  }
  render() {
    return <svg id="vis2"></svg>;
  }
}

export default Visualization2;
