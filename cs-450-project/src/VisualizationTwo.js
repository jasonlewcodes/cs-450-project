import React, { Component } from "react";
import * as d3 from "d3";

class Visualization2 extends Component {
  constructor(props){
    super(props);
    this.state = {
      buckets: 1
    };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
      this.renderChart();
    }
  
  groupDataByAgeBucket = (data, buckets) => {
    const grouped = {};
    const minAge = d3.min(data, d => +d.age);
    for (let age = Math.floor(minAge/buckets)*buckets;age <= 40;age+=buckets) {
      const key = `${age}-${age + buckets}`;
      grouped[key] = { ageGroup:key, depression: 0, no_depression:0};
    }

    data.forEach(d => {
      const age = +d.age;
      const bucket = Math.floor(age/buckets)*buckets;
      const key = `${bucket}-${bucket + buckets}`;
      const depressed = +d.depression > 0 ? "depression":"no_depression";

      if (grouped[key]) {
        grouped[key][depressed]++;
      }
    });

    return Object.values(grouped).sort((a, b) => {
      const aVal =+a.ageGroup.split("-")[0];
      const bVal =+b.ageGroup.split("-")[0];
      return aVal-bVal;
    });
  };

  renderChart = () => {
    const data = this.groupDataByAgeBucket(this.props.data, this.state.buckets);
    const keys = ["no_depression", "depression"];

    const margin = { top: 50, right: 150, bottom: 70, left: 60 };
    const width = 1500;
    const height = 650;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#vis2");
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    svg.append("text").attr("x", width / 2).attr("y", margin.top/2).attr("text-anchor", "middle").style("font-size", "16px").style("font-weight", "bold")
    .text("Depression Count Per Age Group");

    const innerChart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map(d => d.ageGroup)).range([0, innerWidth]).padding(0.2);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.depression + d.no_depression)]).range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(["blue", "orange"]);

    const stackedData = d3.stack().keys(keys)(data);

    innerChart.append("g").selectAll("g").data(stackedData).join("g").attr("fill", d => color(d.key)).selectAll("rect")
      .data(d => d).join("rect").attr("x", d => x(d.data.ageGroup)).attr("y", d => y(d[1])).attr("height", d => y(d[0])-y(d[1]))
      .attr("width", x.bandwidth());

    innerChart.append("g").attr("transform", `translate(0, ${innerHeight})`).call(d3.axisBottom(x));

    innerChart.append("g").call(d3.axisLeft(y));

    innerChart.append("text").attr("x", innerWidth/2).attr("y", innerHeight + 50).attr("text-anchor", "middle").style("font-size", "14px")
      .text("Age Group");

    innerChart.append("text").attr("transform", "rotate(-90)").attr("x", -innerHeight/2).attr("y", -45).attr("text-anchor", "middle").style("font-size", "14px")
      .text("Number of People");

    const legendData = [{label: "No Depression", color: "blue"},{label: "Depression", color: "orange"} ];

    const legend = svg.append("g").attr("transform",`translate(${width-margin.right+20}, ${margin.top})`);

    legend.selectAll("rect").data(legendData).enter().append("rect").attr("x", 0).attr("y", (d,i)=>i*25)
    .attr("width", 18).attr("height", 18).style("fill", d => d.color);

    legend.selectAll("text").data(legendData).enter().append("text").attr("x", 25)
    .attr("y", (d, i) => i*25+9).text(d=> d.label).style("font-size", "14px").attr("alignment-baseline", "middle");
  };

  handleSliderChange =(e)=> {
    this.setState({ buckets: +e.target.value });
  };

  render() {
    return (
      <div>
        <svg id="vis2"></svg>
        <div>
          <label>
            Age Bucket Size: {this.state.buckets}
            <input type="range" min="1" max="10" step="1"
              value={this.state.buckets}
              onChange={this.handleSliderChange}style={{marginLeft:"10px"}} />
          </label>
        </div>
      </div>
    );
  }
}

export default Visualization2;
