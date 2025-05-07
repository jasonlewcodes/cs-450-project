import React, { Component } from "react";
import * as d3 from "d3";

class Visualization3 extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.tooltipRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("resize", this.drawChart);
    this.drawChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.drawChart();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawChart);
  }

  drawChart = () => {
    const data = this.props.data;
    if (!data || data.length === 0) {
      console.log("Data is empty or not loaded yet");
      return;
    }

    const container = this.svgRef.current.parentElement;
    const width = container.clientWidth || 800;
    const height = 600;
    const margin = { top: 70, right: 30, bottom: 100, left: 60 };

    const svg = d3.select(this.svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const depressedPeople = data.filter(d => d.depression === 1 || d.depression === "1");

    const rawDepressionCount = d3.rollup(
      depressedPeople,
      v => v.length,
      d => d.city
    );

    const filteredCounts = Array.from(rawDepressionCount.entries())
      .filter(([city, count]) =>
        count > 0 &&
        city &&
        isNaN(city) &&
        /^[A-Za-z\s-]+$/.test(city.trim())
      )
      .sort((a, b) => d3.descending(a[1], b[1]));

    const depressionCount = new Map(filteredCounts);
    const sortedCities = filteredCounts.map(d => d[0]);
    const countsArray = filteredCounts.map(d => d[1]);
    const yMax = countsArray.length > 0 ? d3.max(countsArray) : 0;

    const xScale = d3.scaleBand()
      .domain(sortedCities)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleSequential()
      .domain([0, yMax])
      .interpolator(d3.interpolateBlues);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Depression Count per City");

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2}, ${height - 40})`)
      .text("City");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(15, ${height / 2}) rotate(-90)`)
      .text("Number of People with Depression");

    const tooltip = d3.select(this.tooltipRef.current);

    svg.selectAll("rect")
      .data(sortedCities)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d))
      .attr("width", xScale.bandwidth())
      .attr("y", yScale(0))
      .attr("height", 0)
      .attr("fill", d => colorScale(depressionCount.get(d) || 0))
      .on("mouseover", (event, d) => {
        const count = depressionCount.get(d) || 0;
        const [x, y] = d3.pointer(event, this.svgRef.current);

        tooltip.style("opacity", 1)
          .html(`<strong>${d}</strong><br/>${count} people`)
          .style("left", `${x + 10}px`)
          .style("top", `${y - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr("y", d => yScale(depressionCount.get(d) || 0))
      .attr("height", d => height - margin.bottom - yScale(depressionCount.get(d) || 0));
  };

  render() {
    return (
      <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
        <svg ref={this.svgRef} style={{ display: "block", margin: "auto" }}></svg>
        <div
          ref={this.tooltipRef}
          style={{
            position: "absolute",
            textAlign: "center",
            width: "auto",
            height: "auto",
            padding: "6px",
            fontSize: "12px",
            background: "lightsteelblue",
            border: "1px solid #333",
            borderRadius: "4px",
            pointerEvents: "none",
            opacity: 0
          }}
        ></div>
      </div>
    );
  }
}

export default Visualization3;
