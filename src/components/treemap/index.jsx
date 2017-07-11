import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { select as d3Select } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
import { easeBackOut } from 'd3-ease';
import {
  stratify as d3Stratify,
  treemap as d3Treemap,
  treemapResquarify as d3TreemapResquarify
} from 'd3-hierarchy';
import { tooltip } from '../../utils/d3-tooltip';

import styles from './styles.css';

class Treemap extends Component {
  constructor() {
    super();
    this.onResize = this.onResize.bind(this);
  }

  componentDidUpdate() {
    if (!this.updateSelection) {
      setTimeout(() => {
        // need timeout to get responsive dimensions on next tick
        // TODO: refactor this to something less hacky
        this.create();
        this.bindEvents();
      }, 100);
    } else {
      this.update();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.update();
  }

  getDimensions() {
    const { width, height } = this.treemapElement.getBoundingClientRect();
    return {
      width,
      height
    };
  }

  getNodeData() {
    const { ukSeats } = this.props;
    // filter data based on selected year
    let activeData = ukSeats.map(item => {
      // since we have only one level of data we add parentNode properties to dataset
      const newItem = Object.assign({}, item);
      newItem.parent = 'root';
      return newItem;
    });
    // add parentnode needed for d3 hierachy layout
    const parentNode = { party: 'root', parent: '' };
    activeData = [parentNode, ...activeData];
    const { width, height } = this.getDimensions();
    // set up treemap
    const treemap = d3Treemap()
      .tile(d3TreemapResquarify.ratio(2))
      .size([width, height])
      .padding(1);
    // set up treemap data
    const stratify = d3Stratify().id(d => d.party).parentId(d => d.parent);
    const sizePadding = 8; // pad size to enlarge smaller nodes
    const root = stratify(activeData)
      .sum(
        d =>
          Number(d.seats) !== 0
            ? Number(d.seats) + sizePadding
            : Number(d.seats)
      )
      .sort((a, b) => b.height - a.height || b.seats - a.seats);
    treemap(root);
    return root.leaves();
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize);
  }

  create() {
    const { ukSeats, activeYear } = this.props;
    // draw chart
    const data = this.getNodeData(ukSeats, activeYear);
    // enter
    d3Select(this.chartElement)
      .selectAll('[data-selector="node"]')
      .data(data)
      .enter()
      .append('div')
      .attr('data-selector', 'node')
      .attr('class', styles.node);
    // exit
    d3Select(this.chartElement)
      .selectAll('[data-selector="node"]')
      .data(data)
      .exit()
      .remove();
    // draw
    this.updateSelection = d3Select(this.chartElement)
      .selectAll('[data-selector="node"]')
      .data(data)
      .attr('title', d => d.party)
      .style('left', d => `${d.x0}px`)
      .style('top', d => `${d.y0}px`)
      .style('width', 0)
      .style('height', d => `${d.y1 - d.y0}px`)
      .style('color', (d, i) => this.props.colorLabelList[i])
      .style('background', (d, i) => this.props.colorList[i]);
    // add text
    this.hideLabelAtValue = 45;
    this.updateSelection
      .append('div')
      .attr('data-selector', 'labels')
      .attr(
        'class',
        d =>
          Number(d.data.seats) > this.hideLabelAtValue
            ? styles.labels
            : styles.labelsHidden
      )
      .append('div')
      .attr('class', styles.nodeLabel)
      .text((d, i) => this.props.labelList[i])
      .append('div')
      .attr('class', styles.nodeValue)
      .text(d => d.data.seats);
    // transition
    this.updateSelection
      .transition()
      .duration(500)
      .ease(easeBackOut)
      .delay((d, i) => i * 100)
      .style('width', d => `${d.x1 - d.x0}px`);
    this.updateSelection.call(
      tooltip(
        d => d.data.itemLabel,
        d3Select(this.chartElement),
        this.props.labelList
      )
    );
  }

  update() {
    const { ukSeats, activeYear } = this.props;
    const data = this.getNodeData(ukSeats, activeYear);
    // update
    const updateSelection = d3Select(this.chartElement)
      .selectAll('[data-selector="node"]')
      .data(data);
    // exit & remove old elements
    updateSelection.exit().remove();
    updateSelection.selectAll('[data-selector="labels"]').remove();
    // add labels
    updateSelection
      .append('div')
      .attr('data-selector', 'labels')
      .attr(
        'class',
        d =>
          Number(d.data.seats) > this.hideLabelAtValue
            ? styles.labels
            : styles.labelsHidden
      )
      .append('div')
      .attr('class', styles.nodeLabel)
      .text((d, i) => this.props.labelList[i])
      .append('div')
      .attr('class', styles.nodeValue)
      .text(d => d.data.seats);
    // transition
    updateSelection
      .transition()
      .duration(500)
      .ease(easeBackOut)
      .attr('title', d => d.party)
      .style('left', d => `${d.x0}px`)
      .style('top', d => `${d.y0}px`)
      .style('width', d => `${d.x1 - d.x0}px`)
      .style('height', d => `${d.y1 - d.y0}px`);
  }

  render() {
    return (
      <div className={styles.treemap} ref={el => (this.treemapElement = el)}>
        <div
          className={styles.chart}
          ref={chart => {
            this.chartElement = chart;
          }}
        />
      </div>
    );
  }
}

Treemap.propTypes = {
  activeYear: string.isRequired,
  ukSeats: arrayOf(
    shape({
      year: string.isRequired,
      party: string.isRequired,
      seats: string.isRequired,
      totalSeats: string.isRequired
    })
  ).isRequired,
  colorList: arrayOf(string).isRequired,
  colorLabelList: arrayOf(string).isRequired,
  labelList: arrayOf(string).isRequired
};

Treemap.defaultProps = {};

export default Treemap;
