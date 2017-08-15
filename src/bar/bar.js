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

/* eslint valid-jsdoc: "error" */
/* eslint-env es6 */

import _ from 'lodash';
import * as d3 from 'd3';
import Graph from '../graph/graph';
import { BarGraphConfig } from '../config/';

/**
 * Class representing a bar graph.
 * @extends Graph
 */
class BarGraph extends Graph {
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
    _.merge(BarGraphConfig[keyType], config);

    // Call the constructor of the parent class with the required params
    super(input, classElement, BarGraphConfig[keyType]);
  }

  /**
   * Instantiate and render a bar graph.
   * @function
   * @returns {void}
   */
  render() {
    // Keep reference to the class context
    const that = this;

    // Initialize the SVG container element in the DOM
    super.initialize();

    // Parse the current input data
    super.parseData();

    // Add the horizontal axis, passing the desired padding
    super.makeAxisX();

    // Add the vertical axis
    super.makeAxisY();

    // If configured, add a title to the graph
    if (this.config.title.visible) super.makeTitle();

    // If configured, add a legend to the graph
    if (this.config.legend.visible) super.makeLegend();

    // If configured, add a tooltip to the graph
    if (this.config.tooltip.enabled) super.makeTooltip();

    /**
     * If configured, enable zooming and panning
     * Pass the desired zoom handler function as parameter
     */
    if (this.config.zoom.enabled) super.enableZoom(zoomed);

    /**
     * If configured, enable resizing
     * Pass the desired resize handler function as parameter
     */
    if (this.config.resize.enabled) super.scaleOnResize(resized);

    // Iterate over the input data array
    this.input.forEach((outer, i) => {
      // Bind data to multiple elements
      const bars = this.svg
        .append('g')
        .attr('class', '.igj-bars')
        .attr('clip-path', "url('#clip')")
        .selectAll(`.igj-bar.bar_${i}`)
        .data(outer.data);

      if (bars.empty()) {
        // Enter selection - add new bars
        bars
          .enter().append('rect')
          .on('mouseover', this.tooltip.show)
          .on('mouseout', this.tooltip.hide)
          .attr('class', `igj-bar bar_${i}`)
          .attr('x', d => this.x(_.get(d, this.keyX)))
          .attr('y', this.config.height)
          .attr('width', this.x.bandwidth())
          .attr('height', 0)
          .attr('fill', (d, j) => this.colorScale(j))
          .transition()
          .duration(450)
          .delay(150)
          .attr('y', d => this.y(_.get(d, this.keyY)))
          .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)))
          .style('cursor', 'pointer');
      }
    });

    /**
     * Handle resize events.
     * @private
     * @returns {void}
     */
    function resized() {
      that.update();
    }

    /**
     * Handle zoom events.
     * @private
     * @returns {void}
     */
    function zoomed() {
      // Rescale horizontal axis based on point of zoom
      const el = d3.select(`.${that.classElement}`);
      that.altX = (that.x.rangeRound([0, that.config.width * d3.event.transform.k]));

      el.selectAll('.igj-bar')
        .transition()
        .duration(50)
        .attr('transform', `translate(${d3.event.transform.x}, 0) scale(${d3.event.transform.k}, 1)`);

      // If zoomed, transform the cursor icon except for dots and legend
      if (d3.event.transform.k > 1) {
        el.style('cursor', 'ew-resize');
      } else {
        el.style('cursor', 'auto');
      }

      // Change cursor icon over external elements of the graph
      el.selectAll('.legendCells')
        .style('cursor', 'pointer');

      // Update the x axis
      el.select('g').select('.igj-axisX')
        .transition()
        .duration(50)
        .attr('transform', `translate(${d3.event.transform.x}, ${that.config.height})`)
        .call(that.xAxis.scale(that.altX));

      // Update the x-values of the x-gridlines
      el.select('.igj-gridX')
        .style('stroke-opacity', 1e-6)
        .transition()
        .duration(50)
        .attr('transform', `translate(${d3.event.transform.x}, ${that.config.height})`)
        .call(that.makeGridlinesX(that.altX))
        .style('stroke-opacity', 0.7);
    }
  }

  /**
   * Update the bar graph.
   * Called when there is an update in either data or dimensions.
   * @function
   * @param {Object=} [newData={}] - New data passed to the bar graph.
   * @returns {void}
   */
  update(newData = {}) {
    // Re-initialize the container of the bar graph
    super.initialize();

    // If needed, update the data of the bar graph
    if (Object.keys(newData) > 0) super.updateData(newData);

    // Update the horizontal axis, passing the desired padding
    super.makeAxisX();

    // Update the vertical axis
    super.makeAxisY();

    // If configured, update the title of the graph
    if (this.config.title.visible) super.makeTitle();

    // If configured, update the legend of the graph
    if (this.config.legend.visible) super.makeLegend();

    // If configured, update the dimensions of the clip path element
    if (this.config.zoom.enabled) super.resizeClipPath();

    // Select already existing bars
    this.input.forEach((outer, i) => {
      const bars = d3.select(`.${this.classElement}`).select('g')
        .selectAll(`.igj-bar.bar_${i}`)
        .data(outer.data);

      // Exit selection - remove unneeded bars
      bars
        .exit()
        .transition()
        .delay(50)
        .duration(350)
        .attr('y', this.y(0))
        .attr('height', this.config.height - this.y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // Update selection - update the values for existing bars
      bars
        .transition()
        .delay(50)
        .duration(450)
        .attr('x', d => this.x(_.get(d, this.keyX)))
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('width', this.x.bandwidth())
        .attr('fill', (d, j) => this.colorScale(j))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)));

      // Enter selection - possibly add new bars
      bars
        .enter()
        .append('rect')
        .on('mouseover', this.tooltip.show)
        .on('mouseout', this.tooltip.hide)
        .attr('class', `igj-bar bar_${i}`)
        .attr('x', d => this.x(_.get(d, this.keyX)))
        .attr('y', this.config.height)
        .attr('width', this.x.bandwidth())
        .attr('height', 0)
        .attr('fill', (d, j) => this.colorScale(j))
        .transition()
        .delay(150)
        .duration(450)
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)))
        .style('cursor', 'pointer');
    });
  }
}

export default BarGraph;
