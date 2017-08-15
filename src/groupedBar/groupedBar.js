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
import { GroupedBarGraphConfig } from '../config/';

/**
 * Class representing a grouped bar graph.
 * @extends Graph
 */
class GroupedBarGraph extends Graph {
  /**
   * Create a bar graph.
   * @constructor
   * @param {Object} input - The input data passed to the graph.
   * @param {String} classElement - The class of the DOM element placeholder.
   * @param {Object} config - The custom JSON configuration of the graph.
   */
  constructor(input, classElement, config = {}) {
    // Get the key_type from the input data
    const keyType = input[Object.keys(input)[0]].key_type;

    // Merge the configuration objects, in case the default one is overridden
    _.merge(GroupedBarGraphConfig[keyType], config);

    // Call the constructor of the parent class with the required params
    super(input, classElement, GroupedBarGraphConfig[keyType]);
  }

  /**
   * Instantiate and render a grouped bar graph.
   * @function
   * @returns {void}
   */
  render() {
    // Keep reference to the class context
    const that = this;

    // Initialize arrays for indexing and grouping
    const innerKeys = [];
    const data = [];

    // Initialize the SVG container element in the DOM
    super.initialize();

    // Parse the current input data
    super.parseData();

    // Transform parsed input data to fit a grouped graph
    this.input.forEach((set, i) => {
      innerKeys.push(set.label);
      set.data.forEach((inner, j) => {
        if (i === 0) { data[j] = {}; }
        _.set(data[j], this.keyX, _.get(inner, this.keyX));
        _.set(data[j], set.label, _.get(inner, this.keyY));
      });
    });

    // Create the outer scale of the X-axis (outerKeys)
    const x0 = d3.scaleBand()
      .paddingInner(0.1)
      .domain(this.input[0].data.map(d => _.get(d, this.keyX)))
      .rangeRound([0, this.config.width]);

    // Create the inner scale of the X-axis (multiple inner keys per outer key)
    const x1 = d3.scaleBand()
      .padding(0.05)
      .domain(innerKeys)
      .rangeRound([0, x0.bandwidth()]);

    // Add the horizontal axis, passing the desired padding and the outer scale
    super.makeAxisX(x0);

    // Add the vertical axis
    super.makeAxisY();

    // If configured, add a title to the graph
    if (this.config.title.visible) {
      super.makeTitle();
    }

    // If configured, add a legend to the graph
    if (this.config.legend.visible) {
      super.makeLegend();
    }

    // If configured, add a tooltip to the graph
    if (this.config.tooltip.enabled) {
      const tooltipKeys = ['metric', 'value'];
      const tooltipLabels = ['Metric', 'Value'];
      super.makeTooltip(tooltipKeys, tooltipLabels);
    }

    // If configured, enable resizing
    if (this.config.resize.enabled) {
      super.scaleOnResize(resized);
    }

    // Add multiple group elements, one for each outerKey
    const groups = this.svg.append('g')
      .attr('class', 'igj-groups')
      .selectAll('g')
      .data(data);

    /**
     * Bind transformed input data to multiple group elements
     * Correlate inner and outer keys with data
     */
    groups
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(_.get(d, this.keyX))}, 0)`)
      .attr('class', d => `igj-group group_${_.get(d, this.keyX)}`)
      .selectAll('rect')
      .data(d => innerKeys.map(k =>
        ({ outerKey: _.get(d, this.keyX), metric: k, value: d[k] })
      ))

      /**
       * Enter selection - add new bars to groups
       * The width of each rectangle depends on the inner scale bandwidth
       */
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
     * Handle resize events.
     * @private
     */
    function resized() {
      that.update();
    }
  }

  /**
   * Update the grouped bar graph.
   * Called when there is an update in either input data or dimensions.
   * @function
   * @param {Object=} [newData={}] - New data passed to the grouped bar graph.
   * @returns {void}
   */
  update(newData = {}) {
    const keys = [];
    const data = [];

    // Re-initialize the SVG container of the grouped bar graph
    super.initialize();

    // If needed, update the data of the grouped bar graph
    if (Object.keys(newData) > 0) {
      super.updateData(newData);
    }

    // Transform the parsed input data, after the update
    this.input.forEach((set, i) => {
      keys.push(_.get(set, 'label'));
      set.data.forEach((inner, j) => {
        if (i === 0) { data[j] = {}; }
        data[j].term = _.get(inner, this.keyX);
        data[j][set.label] = _.get(inner, this.keyY);
      });
    });

    // Create the updated outer scale of the X-axis (outerKeys)
    const x0 = d3.scaleBand()
      .rangeRound([0, this.config.width])
      .paddingInner(0.1)
      .domain(this.input[0].data.map(d => _.get(d, this.keyX)));

    // Create the updated inner scale of the X-axis (innerKeys per outerKey)
    const x1 = d3.scaleBand()
      .padding(0.05)
      .domain(keys).rangeRound([0, x0.bandwidth()]);

    // Update the horizontal axis, passing the desired padding and the new outer scale
    super.makeAxisX(x0);

    // Update the vertical axis
    super.makeAxisY();

    // If configured, update the title of the graph
    if (this.config.title.visible) {
      super.makeTitle();
    }

    // If configured, update the legend of the graph
    if (this.config.legend.visible) {
      super.makeLegend();
    }

    // Select all existing group elements and bind with the new data
    const groups = d3.select(`.${this.classElement}`)
      .select('.igj-groups')
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
        ({ outerKey: _.get(d, this.keyX), metric: key, value: d[key] })
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
