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
 * Class representing a Bar Graph.
 * @extends Graph
 */
class BarGraph extends Graph {
  /**
   * Instantiate a Bar Graph.
   */
  render() {
    // Class context reference
    const that = this;

    // Initialize the container element
    super.initialize();

    // Parse the current input data
    super.parseData();

    // Create the horizontal axis
    super.makeAxisX(0.05);

    // Create the vertical axis
    super.makeAxisY();

    // Add title
    super.makeTitle();

    // Add legend
    super.makeLegend();

    // Add tooltip
    super.makeTooltip();

    // Enable zoom
    if (this.config.zoom.enabled) {
      super.enableZoom(zoomed);
    }

    // Scale when resizing window
    super.scaleOnResize(resized);

    // Iterate over input data
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
     * Handle container resize events.
     * @private
     */
    function resized() {
      that.update();
    }

    /**
     * Handle zoom events.
     * @private
     */
    function zoomed() {
      // Rescale horizontal axis based on point of zoom
      that.altX = (that.x.rangeRound([0, that.config.width * d3.event.transform.k]));
      const el = d3.select(`.${that.classElement}`);

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

    // Return the SVG element containing the graph
    return d3.select(`.${this.classElement}`).select('svg').node();
  }

  /**
   * Update the input data of the Line Graph.
   * @param {Array<Object>} - The updated data.
   */
  update(newData) {
    // Re-initialize the container of the graph
    super.initialize();

    // Update the input data of the graph
    if (typeof (newData) !== 'undefined') {
      super.updateData(newData);
    }

    // Create the horizontal axis
    super.makeAxisX(0.05);

    // Create the vertical axis
    super.makeAxisY();

    // Create the title
    super.makeTitle();

    // Create the legend
    super.makeLegend();

    // Update dimension of the clip path
    this.svg.select('#clip').select('rect')
      .attr('width', this.config.width + 10)
      .attr('height', this.config.height + this.marginVertical);

    this.input.forEach((outer, i) => {
      // Select already existing bars
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

      // Update selection - update existing bars
      bars
        .transition()
        .delay(50)
        .duration(450)
        .attr('x', d => this.x(_.get(d, this.keyX)))
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('width', this.x.bandwidth())
        .attr('fill', (d, j) => this.colorScale(j))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)));

      // Enter selection - add new bars
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
