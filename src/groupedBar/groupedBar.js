/*
 * This file is part of Invenio.
 * Copyright (C) 2017 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import _ from 'lodash';
import * as d3 from 'd3';
import Graph from '../graph/graph';

/**
 * Class representing a grouped Bar Graph.
 * @extends Graph
 */
class GroupedBarGraph extends Graph {
  /**
   * Instantiate a grouped Bar Graph.
   */
  render() {
    // Class context reference
    const that = this;

    // Initialize arrays for indexing and grouping
    const innerKeys = [];
    const data = [];

    // Initialize the container element
    super.initialize();

    // Parse the current input data
    super.parseData();

    this.input.forEach((set, i) => {
      innerKeys.push(set.label);
      set.data.forEach((inner, j) => {
        if (i === 0) {
          data[j] = {};
        }
        _.set(data[j], this.keyX, _.get(inner, this.keyX));
        _.set(data[j], set.label, _.get(inner, this.keyY));
      });
    });

    // Create the outer scale of the X-axis (outerKeys)
    const x0 = d3.scaleBand()
      .paddingInner(0.1)
      .domain(this.input[0].data.map(d => _.get(d, this.keyX)))
      .rangeRound([0, this.config.width]);

    // Create the inner scale of the X-axis (innerKeys per outerKey)
    const x1 = d3.scaleBand()
      .padding(0.05)
      .domain(innerKeys)
      .rangeRound([0, x0.bandwidth()]);

    // Add the horizontal axis, passing the outer scale
    super.makeAxisX(0.1, x0);

    // Add the vertical axis
    super.makeAxisY();

    // Add the title
    super.makeTitle();

    // Add the legend
    super.makeLegend();

    // Add the tooltip
    const tooltipKeys = ['metric', 'value'];
    const tooltipLabels = ['Metric', 'Value'];
    super.makeTooltip(tooltipKeys, tooltipLabels);

    // Scale when resizing window
    super.scaleOnResize(resized);

    this.svg.append('g')
      .attr('class', 'igj-groups')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(_.get(d, this.keyX))}, 0)`)
      .attr('class', d => `igj-group group_${_.get(d, this.keyX)}`)
      .selectAll('rect')
      .data(d => innerKeys.map(k =>
        ({ outerKey: _.get(d, this.keyX), metric: k, value: d[k] })
      ))
      .enter()
      .append('rect')
      .on('mouseover', this.tooltip.show)
      .on('mouseout', this.tooltip.hide)
      .attr('class', d => `igj-bar bar_${d.metric}`)
      .attr('x', d => x1(d.metric))
      .attr('y', this.config.height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => this.colorScale(i))
      .transition()
      .delay(150)
      .duration(450)
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.config.height - this.y(d.value))
      .style('cursor', 'pointer');

    /**
     * Handle container resize events.
     * @private
     */
    function resized() {
      that.update();
    }

    // Return the SVG element containing the graph
    return d3.select(`.${this.classElement}`).select('svg').node();
  }

  update(newData) {
    const keys = [];
    const data = [];

    // Re-initialize the container of the graph
    super.initialize();

    // Update the input data of the graph
    if (typeof (newData) !== 'undefined') {
      super.updateData(newData);
    }

    this.input.forEach((set, i) => {
      keys.push(_.get(set, 'label'));
      set.data.forEach((inner, j) => {
        if (i === 0) {
          data[j] = {};
        }
        data[j].term = _.get(inner, this.keyX);
        data[j][set.label] = _.get(inner, this.keyY);
      });
    });

    const x0 = d3.scaleBand()
      .rangeRound([0, this.config.width])
      .paddingInner(0.1)
      .domain(this.input[0].data.map(d => _.get(d, this.keyX)));

    const x1 = d3.scaleBand()
      .padding(0.05)
      .domain(keys).rangeRound([0, x0.bandwidth()]);

    // Create the horizontal axis
    super.makeAxisX(0.1, x0);

    // Create the vertical axis
    super.makeAxisY();

    // Create the title
    super.makeTitle();

    // Create the legend
    super.makeLegend();

    // Select existing groups of bars
    const groups = d3.select(`.${this.classElement}`).select('.igj-groups')
      .selectAll('g')
      .data(data);

    // Exit selection - remove unneeded bars
    groups
      .exit()
      .selectAll('rect')
      .transition()
      .duration(350)
      .attr('y', this.y(0))
      .attr('height', this.config.height - this.y(0))
      .style('fill-opacity', 1e-6)
      .remove();

    // Update selection - update existing bars
    groups
      .transition()
      .duration(450)
      .attr('transform', d => `translate(${x0(_.get(d, this.keyX))}, 0)`);

    groups
      .selectAll('rect')
      .data(d => keys.map(key =>
        ({ metric: key, value: d[key] })
      ))
      .transition()
      .delay(50)
      .duration(350)
      .attr('x', d => x1(d.metric))
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.config.height - this.y(d.value))
      .attr('width', x1.bandwidth());

    // Enter selection - add new bars
    groups
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(_.get(d, this.keyX))}, 0)`)
      .attr('class', d => `igj-group group_${_.get(d, this.keyX)}`)
      .selectAll('rect')
      .data(d => keys.map(key =>
        ({ metric: key, value: d[key] })
      ))
      .enter()
      .append('rect')
      .on('mouseover', this.tooltip.show)
      .on('mouseout', this.tooltip.hide)
      .attr('class', d => `igj-bar bar_${d.metric}`)
      .attr('x', d => x1(d.metric))
      .attr('y', this.config.height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => this.colorScale(i))
      .transition()
      .duration(450)
      .delay(150)
      .attr('y', d => this.y(d.value))
      .attr('height', d => this.config.height - this.y(d.value))
      .style('cursor', 'pointer');
  }
}

export default GroupedBarGraph;
