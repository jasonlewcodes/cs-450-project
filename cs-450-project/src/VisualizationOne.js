import React, { Component } from "react";
import * as d3 from "d3";

class Visualization1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depressionFilter: "All",
      genderFilter: "All"
    };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
      this.renderChart();
  }

  UpdateDepressionFilter =(event) => {
    this.setState({depressionFilter: event.target.value });
  };

  UpdateGenderFilter =(event) =>{
    this.setState({genderFilter: event.target.value });
  };

  getFilteredData =()=> {
    const { data } = this.props;
    const { depressionFilter, genderFilter}=this.state;
  
    return data.filter((d) => {
      const depressionMatch = depressionFilter === "All" ||(depressionFilter === "depression" && +d.depression>0) 
      || (depressionFilter === "no_depression" && +d.depression === 0);

      const genderMatch=genderFilter === "All" || (genderFilter === "male" && d.gender.toLowerCase() === "male") ||
  (genderFilter === "female" && d.gender.toLowerCase() === "female");
      return depressionMatch && genderMatch;
    });
  };

  renderChart = () => {
    const data = this.getFilteredData();

    const margin = { top: 80, right: 70, bottom: 50, left: 50 };
    const width = 1400;
    const height = 650;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#vis1");
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    svg.append("text").attr("x", width/2).attr("y", margin.top/2).attr("text-anchor", "middle").style("font-size", "16px").style("font-weight", "bold").text("Academic Pressure vs. CGPA");

    const innerChart = svg.append("g").attr("transform",`translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, 5]).range([20,innerWidth-20]);
    const yScale = d3.scaleLinear().domain([0, 10]).range([innerHeight-10, 20]);

    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    innerChart.append("g").attr("transform", `translate(0, ${innerHeight})`).call(xAxis);
    innerChart.append("g").call(yAxis);

    innerChart.append("text").attr("x", innerWidth/2).attr("y", innerHeight+40).attr("text-anchor", "middle").style("font-size", "16px")
    .text("Academic Pressure");

    innerChart.append("text").attr("x", -innerHeight/2).attr("y",-35).attr("text-anchor", "middle").attr("transform", "rotate(-90)").style("font-size", "16px")
    .text("CGPA");

    const colorScale = d3.scaleOrdinal().domain(["male-yes", "male-no", "female-yes", "female-no"])
    .range(["red", "blue", "green", "yellow"]);

    const getCategory = (d)=>{
      var gender = d.gender.toLowerCase();
      var hasDepression = Number(d.depression) >0 ? "yes":"no";
      return `${gender}-${hasDepression}`;
    };

    innerChart.selectAll("circle").data(data).join("circle").attr("r", 2)
      .attr("fill", (d) => colorScale(getCategory(d))).attr("opacity", 0.6)
      .attr("cx", (d) => xScale(d.academicPressure) + (Math.random() - 0.5) * 60)
      .attr("cy", (d) => yScale(d.cgpa) + (Math.random() - 0.5) * 60);
  };

render() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <svg id="vis1" />
      <div style={{ marginLeft: "10px", marginTop: "80px"}}>
     <div style={{ marginBottom: "20px"}}>
      <div><span style={{display: "inline-block", width: "12px", height: "12px", backgroundColor: "red", marginRight: "6px"}}></span>
        Male (Depression)</div>
      <div>
      <span style={{ display: "inline-block", width: "12px", height: "12px", backgroundColor: "blue", marginRight: "6px" }}></span>
     Male (No Depression)</div>
    <div>
     <span style={{display: "inline-block", width: "12px", height: "12px", backgroundColor: "green", marginRight: "6px" }}></span>
      Female (Depression)</div>
      <div>
      <span style={{ display: "inline-block", width: "12px", height: "12px", backgroundColor: "yellow", marginRight: "6px"}}></span>
      Female (No Depression)</div>
      </div>
        <div style={{ marginBottom: "20px" }}>
        <strong>Depression Filter:</strong><br/>
          <label>
          <input type="radio" name="depressionFilter" value="All"
          checked={this.state.depressionFilter === "All"}
          onChange={this.UpdateDepressionFilter}/>All
         </label><br/>

          <label>
          <input type="radio" name="depressionFilter" value="depression" checked={this.state.depressionFilter === "depression"}
                onChange={this.UpdateDepressionFilter}/>Depression
          </label><br />
          <label>
        <input type="radio" name="depressionFilter" value="no_depression"
         checked={this.state.depressionFilter === "no_depression"} onChange={this.UpdateDepressionFilter}/> No Depression
            </label>
          </div>
        <div>
   <strong>Gender Filter:</strong><br />
     <label>
      <input type="radio" name="genderFilter" value="All"
         checked={this.state.genderFilter === "All"}
       onChange={this.UpdateGenderFilter}/>All</label><br/>
       <label>
        <input type="radio" name="genderFilter" value="male"
       checked={this.state.genderFilter === "male"}
      onChange={this.UpdateGenderFilter}/>Male
        </label><br/>
    <label>
      <input type="radio" name="genderFilter" value="female"
         checked={this.state.genderFilter === "female"} onChange={this.UpdateGenderFilter}/>Female
            </label>
          </div>
        </div>
      </div>
    );
  }
  
}

export default Visualization1;
