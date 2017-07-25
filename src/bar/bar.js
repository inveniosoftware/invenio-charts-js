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

    // Iterate over input data
    this.input.forEach((outer, i) => {
      const data = outer.data;

      // Create the bars
      const bars = d3.select(`.${this.classElement}`).select('g')
        .selectAll(`.igj-bar.bar_${i}`);

      if (bars.empty()) {
        // Add new bars
        bars
          .data(data)
          .enter().append('rect')
          .attr('class', `igj-bar bar_${i}`)
          .attr('x', d => this.x(_.get(d, this.keyX)))
          .attr('y', this.config.height)
          .attr('width', this.x.bandwidth())
          .attr('height', 0)
          .on('mouseover', this.tooltip.show)
          .on('mouseout', this.tooltip.hide)
          .attr('fill', (d, j) => this.colorScale(j))
          .transition()
          .duration(450)
          .delay(150)
          .attr('y', d => this.y(_.get(d, this.keyY)))
          .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)))
          .style('cursor', 'pointer');
      }
    });
  }

  update(newInput) {
    // Update the input data of the graph
    super.updateData(newInput);

    // Parse the current input data
    super.parseData();

    // Create the horizontal axis
    super.makeAxisX(0.1);

    // Create the vertical axis
    super.makeAxisY();

    this.input.forEach((outer, i) => {
      // Select already existing bars in the graph
      const bars = d3.select(`.${this.classElement}`).select('g')
        .selectAll(`.igj-bar.bar_${i}`);

      // Remove unneeded existing bars
      bars
        .data(outer.data)
        .exit()
        .transition()
        .duration(350)
        .attr('y', this.y(0))
        .attr('height', this.config.height - this.y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // Update existing bars with new values
      bars
        .data(outer.data)
        .transition()
        .duration(500)
        .attr('x', d => this.x(_.get(d, this.keyX)))
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('width', this.x.bandwidth())
        .attr('fill', (d, j) => this.colorScale(j))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)));

      // Add new bars
      bars
        .data(outer.data)
        .enter()
        .append('rect')
        .attr('class', () => `.igj-bar.bar_${i}`)
        .attr('x', d => this.x(_.get(d, this.keyX)))
        .attr('y', this.config.height)
        .attr('width', this.x.bandwidth())
        .attr('height', 0)
        .attr('fill', (d, j) => this.colorScale(j))
        .transition()
        .duration(500)
        .delay(300)
        .attr('y', d => this.y(_.get(d, this.keyY)))
        .attr('height', d => this.config.height - this.y(_.get(d, this.keyY)));
    });
  }
}

export default BarGraph;
