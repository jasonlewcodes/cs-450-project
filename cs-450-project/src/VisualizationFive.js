import { Component } from "react";
import * as d3 from "d3";

class Visualization5 extends Component {
  componentDidMount() {
    const data = this.props.data;

    const grouped = d3.rollups(
      data.filter(
        (d) =>
          d.workStudyHours &&
          d.suicidalIdeation &&
          d.suicidalIdeation.toLowerCase() === "yes"
      ),
      (v) => v.length,
      (d) => d.workStudyHours
    ).sort((a, b) => a[0] - b[0]);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const margin = {
      top: height * 0.1,
      right: width * 0.05,
      bottom: height * 0.15,
      left: width * 0.08,
    };

    const svg = d3
      .select("#vis5")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(grouped, (d) => d[0]))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(grouped, (d) => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "6px 10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "14px")
      .style("opacity", 0);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top * 0.4)
      .attr("text-anchor", "middle")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .text("Visualization 5: Work/Study Hours vs Suicidal Thoughts");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top * 0.8)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("fill", "#555")
      .text(
        "This line chart shows how increasing study/work hours may correlate with suicidal thoughts."
      );

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#ddd");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(6)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#ddd");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "16px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom * 0.3)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .text("Work/Study Hours");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "16px");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left * 0.3)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .text("Number of Students with Suicidal Thoughts");

    const line = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    svg
      .append("path")
      .datum(grouped)
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 4)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(grouped)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", 6)
      .attr("fill", "#1f77b4")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `Hours: <strong>${d[0]}</strong><br/>Count: <strong>${d[1]}</strong>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }

  render() {
    return (
      <div>
        <svg id="vis5" style={{ display: "block", margin: "auto" }} />
      </div>
    );
  }
}

export default Visualization5;
