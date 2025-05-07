import { Component } from "react";
import * as d3 from "d3";

class Visualization6 extends Component {
  componentDidMount() {
    const data = this.props.data;

    const clean = str =>
      str
        .replace(/['"]+/g, "")
        .trim()
        .replace(/\s+/g, " ");
    const cleanData = data.map(d => ({
      ...d,
      sleep: clean(d.sleepDuration),
      diet:  clean(d.dietaryHabits),
      depression: d.depression
    }));

    const sleepCategories = Array.from(new Set(cleanData.map(d => d.sleep))).sort();
    const dietCategories  = Array.from(new Set(cleanData.map(d => d.diet))).sort();

    const xOrder = [
      "Less than 5 hours",
      ...sleepCategories.filter(d => d !== "Less than 5 hours")
    ];

    const nested = d3.rollup(
      cleanData.filter(d => d.depression > 0),
      v => {
        const counts = {};
        dietCategories.forEach(cat => {
          counts[cat] = v.filter(d => d.diet === cat).length;
        });
        return counts;
      },
      d => d.sleep
    );

    const stackedData = xOrder.map(sleep => {
      const entry = { sleep };
      dietCategories.forEach(cat => {
        entry[cat] = nested.get(sleep)?.[cat] || 0;
      });
      return entry;
    });

    console.group("🔍 stackedData");
    console.table(
      stackedData.map(r => {
        const obj = { Sleep: r.sleep };
        dietCategories.forEach(cat => (obj[cat] = r[cat]));
        return obj;
      })
    );
    console.groupEnd();

    const width  = window.innerWidth;
    const height = window.innerHeight;
    const margin = {
      top:    height * 0.1,
      right:  width  * 0.05,
      bottom: height * 0.15,
      left:   width  * 0.08,
    };
    const svg = d3.select("#vis6")
      .attr("width",  width)
      .attr("height", height)
      .html("");

    const x = d3.scaleBand()
      .domain(xOrder)
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([
        0,
        d3.max(stackedData, d =>
          dietCategories.reduce((sum, cat) => sum + d[cat], 0)
        )
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const customColors = {
      Healthy:   "#6a0dad",
      Moderate:  "#7b68ee",
      Others:    "#4169e1",
      Unhealthy: "#00bfff"
    };

    const color = d3.scaleOrdinal()
      .domain(dietCategories)
      .range(dietCategories.map(label => customColors[label]));

    const series = d3.stack().keys(dietCategories)(stackedData);

    const tooltip = d3.select("body")
      .append("div")
      .style("position",      "absolute")
      .style("background",    "#fff")
      .style("padding",       "8px")
      .style("border",        "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events","none")
      .style("font-size",     "14px")
      .style("box-shadow",    "0 2px 6px rgba(0,0,0,0.2)")
      .style("opacity",       0);

    svg.append("text")
      .attr("x", width/2).attr("y", margin.top*0.4)
      .attr("text-anchor","middle").attr("font-size","28px").attr("font-weight","bold")
      .text("Visualization 6: Sleep Duration vs Diet & Depression");

    svg.append("text")
      .attr("x", width/2).attr("y", margin.top*0.8)
      .attr("text-anchor","middle").attr("font-size","16px").attr("fill","#555")
      .text("Stacked bar chart showing depression cases grouped by sleep duration and dietary habits");

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text").style("font-size","14px");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text").style("font-size","14px");

    svg.append("text")
      .attr("x", width/2).attr("y", height - margin.bottom*0.3)
      .attr("text-anchor","middle").attr("font-size","16px")
      .text("Sleep Duration");

    svg.append("text")
      .attr("transform","rotate(-90)")
      .attr("x",-height/2).attr("y", margin.left*0.3)
      .attr("text-anchor","middle").attr("font-size","16px")
      .text("Number of Students with Depression");

    svg.selectAll("g.layer")
      .data(series)
      .enter()
      .append("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d.map(item => ({ ...item, key: d.key })))
      .enter()
      .append("rect")
        .attr("x",      d => x(d.data.sleep))
        .attr("y",      d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",  x.bandwidth())
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(`
              <strong>Sleep Duration:</strong> ${d.data.sleep}<br/>
              <strong>Diet:</strong> ${d.key}<br/>
              <strong>Count:</strong> ${d.data[d.key]}
            `);
          d3.select(event.currentTarget).attr("stroke","#333").attr("stroke-width",1.5);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX+10}px`)
            .style("top",  `${event.pageY-28}px`);
        })
        .on("mouseout", (event) => {
          tooltip.style("opacity", 0);
          d3.select(event.currentTarget).attr("stroke","none");
        });

    const legend = svg.selectAll(".legend")
      .data(dietCategories)
      .enter()
      .append("g")
        .attr("transform", (d,i) => `translate(${width - margin.right - 150},${margin.top + i*25})`);

    legend.append("rect")
      .attr("width",20).attr("height",20)
      .attr("fill", d => color(d));

    legend.append("text")
      .attr("x",28).attr("y",15)
      .attr("font-size","14px")
      .text(d => d);
  }

  render() {
    return (
      <div>
        <svg id="vis6" style={{ display: "block", margin: "auto" }} />
      </div>
    );
  }
}

export default Visualization6;
