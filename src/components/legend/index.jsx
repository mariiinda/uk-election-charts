import React, { Component } from 'react';
import { scaleOrdinal as d3ScaleOrdinal } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { arrayOf, string } from 'prop-types';
import { legendColor } from 'd3-svg-legend';

import styles from './styles.css';

class Legend extends Component {
  componentDidUpdate() {
    this.create();
  }

  create() {
    this.updateSelection = true;

    const ordinal = d3ScaleOrdinal()
      .domain(this.props.labelList)
      .range(this.props.colorList);

    const svg = d3Select(this.node);

    svg
      .append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(0,0)');

    const legendOrdinal = legendColor()
      .shapeWidth('54')
      .shapeHeight('10')
      .shapePadding(1)
      .orient('horizontal')
      .scale(ordinal);

    svg.select('.legendOrdinal').call(legendOrdinal);
  }

  render() {
    return (
      <div className={styles.legend}>
        <svg className={styles.svg} ref={node => (this.node = node)} />
      </div>
    );
  }
}

Legend.propTypes = {
  labelList: arrayOf(string).isRequired,
  colorList: arrayOf(string).isRequired
};

Legend.defaultProps = {};

export default Legend;
