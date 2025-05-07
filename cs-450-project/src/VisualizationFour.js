import React, { Component } from 'react';
import * as d3 from 'd3';

class VisualizationFour extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.drawChart);
    this.drawChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.drawChart();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart);
  }

  drawChart = () => {
    const data = this.props.data;
    if (!data || data.length === 0) return;

    const svg = d3.select(this.svgRef.current);
    svg.selectAll('*').remove();

    const container = this.svgRef.current.parentElement;
    const width = container.clientWidth || 800;
    const height = 400;
    const margin = { top: 40, right: 180, bottom: 50, left: 60 };

    svg.attr('width', width).attr('height', height);

    const groupedData = d3.group(
      data,
      d => d.financialStress,
      d => d.familyHistory
    );

    const financialStressValues = Array.from(new Set(data.map(d => d.financialStress))).sort(d3.ascending);

    const lineData = { true: [], false: [] };

    financialStressValues.forEach(stress => {
      const stressGroup = groupedData.get(stress);

      if (stressGroup) {
        const withHistory = stressGroup.get(true);
        const withHistorySum = withHistory ? d3.sum(withHistory, d => d.depression) : 0;
        lineData.true.push({ x: stress, y: withHistorySum });

        const withoutHistory = stressGroup.get(false);
        const withoutHistorySum = withoutHistory ? d3.sum(withoutHistory, d => d.depression) : 0;
        lineData.false.push({ x: stress, y: withoutHistorySum });
      }
    });

    const maxDepression = d3.max([
      ...lineData.true.map(d => d.y),
      ...lineData.false.map(d => d.y)
    ]);

    const xScale = d3.scaleLinear()
      .domain([d3.min(financialStressValues), d3.max(financialStressValues)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, maxDepression * 1.1])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .defined(d => d.x !== undefined && d.y !== undefined && d.y !== null && !isNaN(d.y) && d.y > 0)
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const colors = { true: 'blue', false: 'orange' };
    const labels = { true: 'Family History: Yes', false: 'Family History: No' };

    Object.entries(lineData).forEach(([key, values]) => {
      const filteredValues = values.filter(d => d.x !== undefined && d.y !== undefined && d.y !== null && !isNaN(d.y) && d.y > 0);

      svg.append('path')
        .datum(filteredValues)
        .attr('fill', 'none')
        .attr('stroke', colors[key])
        .attr('stroke-width', 2.5)
        .attr('d', line);

      svg.selectAll(`circle-${key}`)
        .data(filteredValues)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 4)
        .attr('fill', colors[key])
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    });

    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d => Math.round(d));
    const yAxis = d3.axisLeft(yScale).ticks(6);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Financial Stress');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Depression Count');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Depression Count by Financial Stress and Family History');

    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 10},${margin.top})`);

    Object.keys(colors).forEach((key, i) => {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', i * 25)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colors[key]);

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 25 + 9)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .text(labels[key]);
    });
  };

  render() {
    return (
      <div style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
        <svg ref={this.svgRef} style={{ display: 'block', margin: 'auto' }}></svg>
      </div>
    );
  }
}

export default VisualizationFour;
