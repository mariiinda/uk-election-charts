import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { axisBottom as d3AxisBottom } from "d3-axis";
import { arrayOf, string, number, shape } from "prop-types";
import { transition } from "d3-transition";
import { easeExpOut } from "d3-ease";

import styles from "./styles.css";

class BarChart extends Component {
  constructor() {
    super();
    this.barHeight = 10;
    this.barPadding = 2;
  }

  componentDidUpdate() {
    if (!this.props.data.length > 0) {
      return;
    }
    if (!this.updateSelection) {
      this.createBarChart();
    } else {
      this.update();
    }
  }

  setAxes({ xScale }) {
    const majority = this.props.max / 2 + 1;
    this.xAxis = d3AxisBottom(xScale)
      .tickValues([majority, this.props.max])
      .tickSize(this.props.height)
      .tickSizeOuter(0)
      .tickPadding(5);
  }

  setScales() {
    const { width } = this.props;
    this.xScale = scaleLinear()
      .domain([0, this.props.max + 20])
      .range([0, width]);
  }

  createAxes() {
    d3Select(this.node).append("g").attr("class", "x-axis");
  }

  drawAxes() {
    this.setAxes({ xScale: this.xScale });
    const xAxisSelection = d3Select(this.node).selectAll(".x-axis");
    xAxisSelection.call(this.xAxis);
    xAxisSelection.selectAll(".tick text").attr("y", 5);
  }

  createBarChart() {
    const { width, height } = this.props;
    this.updateSelection = true;
    this.setScales();
    // set viewbox
    let node = this.node;
    node.setAttribute("width", "100%");
    node.setAttribute("viewBox", `0 0 ${width} ${height}`);
    this.createAxes();
    // set margin
    node = d3Select(node)
      .append("g")
      .attr(
        "transform",
        `translate(${this.props.margin.left}, ${this.props.margin.top})`
      );
    // enter
    node.selectAll("rect").data(this.props.data).enter().append("rect");
    // update
    const updateSelection = node
      .selectAll("rect")
      .data(this.props.data)
      .filter(d => d !== 0)
      .attr("y", (d, i) => i * (this.barHeight + this.barPadding))
      .attr("x", 0)
      .attr("width", 0)
      .attr("height", this.barHeight)
      .style("fill", d => this.props.colorList[this.props.data.indexOf(d)]);
    // transition
    updateSelection
      .transition()
      .delay(200)
      .duration(300)
      .ease(easeExpOut)
      .attr("x", 0)
      .attr("width", d => this.xScale(d));
    this.drawAxes();
  }

  update() {
    this.setScales();
    this.drawAxes();
    const node = this.node;
    // update
    const updateSelection = d3Select(node)
      .selectAll("rect")
      .data(this.props.data);
    updateSelection
      .filter(d => d !== 0)
      .attr("y", (d, i) => i * (this.barHeight + this.barPadding))
      .attr("x", 0)
      .attr("height", this.barHeight)
      .style("fill", d => this.props.colorList[this.props.data.indexOf(d)]);
    // exit
    updateSelection.exit().remove();
    // transition
    updateSelection
      .transition()
      .duration(300)
      .ease(easeExpOut)
      .attr("width", d => this.xScale(d));
  }

  render() {
    return (
      <div className={styles.barChart}>
        <svg className={styles.svg} ref={node => (this.node = node)} />
      </div>
    );
  }
}

BarChart.propTypes = {
  data: arrayOf(number).isRequired,
  max: number.isRequired,
  width: number,
  height: number,
  colorList: arrayOf(string).isRequired,
  margin: shape({
    top: number,
    right: number,
    bottom: number,
    left: number
  })
};

BarChart.defaultProps = {
  width: 500,
  height: 80,
  margin: { top: 15, right: 0, bottom: 0, left: 0 }
};

export default BarChart;
