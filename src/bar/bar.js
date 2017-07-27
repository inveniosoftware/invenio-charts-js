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
    super.makeAxisX(0.1);

    // Create the vertical axis
    super.makeAxisY();

    // Add title
    super.makeTitle();

    // Add legend
    super.makeLegend();

    // Add tooltip
    super.makeTooltip();

    // Scale when resizing window
    super.scaleOnResize(resized);

    // Iterate over input data
    this.input.forEach((outer, i) => {
      // Bind data to multiple elements
      const bars = d3.select(`.${this.classElement}`).select('g')
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

    // Handler function on window resize
    function resized() {
      that.update(that.input);
    }
  }

  update(newInput) {
    // Re-initialize the container of the graph
    super.initialize();

    // Update the input data of the graph
    super.updateInput(newInput);

    // Parse the current input data
    super.parseData();

    // Create the horizontal axis
    super.makeAxisX(0.1);

    // Create the vertical axis
    super.makeAxisY();

    // Create the title
    super.makeTitle();

    // Create the legend
    super.makeLegend();

    this.input.forEach((outer, i) => {
      // Select already existing bars
      const bars = d3.select(`.${this.classElement}`).select('g')
        .selectAll(`.igj-bar.bar_${i}`)
        .data(outer.data);

      // Exit selection - remove unneeded bars
      bars
        .exit()
        .transition()
        .duration(350)
        .attr('y', this.y(0))
        .attr('height', this.config.height - this.y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // Update selection - update existing bars
      bars
        .transition()
        .duration(500)
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
        .duration(450)
        .delay(250)
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)))
        .style('cursor', 'pointer');
    });
  }
}

export default BarGraph;
