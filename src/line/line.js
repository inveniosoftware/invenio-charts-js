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
 * Class representing a Line Graph.
 * @extends Graph
 */
class LineGraph extends Graph {
  /**
   * Instantiate a Line Graph.
   */
  render() {
    // Initialize the container element
    super.initialize();

    // Parse the current input data
    super.parseData();

    // Create the horizontal axis
    super.makeAxisX();

    // Create the vertical axis
    super.makeAxisY();

    // Add title
    super.makeTitle();

    // Add legend
    super.makeLegend();

    // Add tooltip
    super.makeTooltip();

    // Add zoom functionality
    super.enableZoom(zoomed);

    // Class context reference
    const that = this;

    // Iterate over input data
    this.input.forEach((outer, i) => {
      const data = outer.data;

      // Add a line to the SVG element
      if (d3.select(`.${this.classElement}`).select(`.igj-line.line_${i}`).empty()) {
        this.line = d3[this.config.graph.type]()
          .x(d => this.x(_.get(d, this.keyX)))
          .y(d => this.y(_.get(d, this.keyY)))
          .curve(d3[this.config.graph.options.curveType]);

        this.svg.append('path')
          .data([data])
          .attr('class', `igj-line line_${i}`)
          .attr('stroke', () => this.colorScale(i))
          .attr('d', this.line(data));
      }

      // If specified, add a colored aera under the line
      if (this.config.graph.options.fillArea) {
        if (d3.select(`.${this.classElement}`).select(`.igj-area.area_${i}`).empty()) {
          this.area = d3.area()
            .curve(d3[this.config.graph.options.curveType])
            .x(d => this.x(_.get(d, this.keyX)))
            .y0(this.config.height)
            .y1(d => this.y(_.get(d, this.keyY)));

          this.svg.append('path')
            .data([data])
            .transition()
            .delay(100)
            .duration(400)
            .attr('class', `igj-area area_${i}`)
            .attr('fill', () => this.colorScale(i))
            .attr('d', this.area(data));
        }
      }

      // Add focus circle over line
      // Call this before circles
      d3.select(`.${this.classElement}`).select('g')
        .append('g')
        .attr('class', `igj-focus focus_${i}`)
        .style('display', 'none')
        .append('circle')
        .attr('stroke', () => this.colorScale(i));

      // If specified, add circles to the line
      const circles = this.svg.selectAll(`igj-dot dot_${i}`);
      if (circles.empty()) {
        // Add new circles
        circles.data(data)
          .enter()
          .append('circle')
          .on('mouseover', this.tooltip.show)
          .on('mouseout', this.tooltip.hide)
          .attr('class', `igj-dot dot_${i}`)
          .attr('cx', d => this.x(_.get(d, this.keyX)))
          .attr('cy', d => this.y(_.get(d, this.keyY)))
          .attr('r', this.config.circles.radius)
          .attr('fill', () => this.colorScale(i))
          .attr('opacity', this.config.circles.visible ? 1 : 0)
          .style('cursor', 'pointer');
      }
    });

    // Listen to mouseover movement on the graph
    this.svg
      .on('mouseover', () => this.svg.selectAll('.igj-focus')
        .style('display', null))
      .on('mouseout', () => this.svg.selectAll('.igj-focus')
        .style('display', 'none'))
      .on('mousemove', mousemove);

    // Handler function on mouse movement
    function mousemove() {
      // Map the x-value of the mouse movement
      const x0 = that.altX.invert(d3.mouse(this)[0]);

      // Reveal the focus element
      d3.select(`.${that.classElement}`).selectAll('.igj-focus').select('circle')
        .attr('opacity', 1);

      // Calculate new position of focus element for all lines
      that.input.forEach((set, k) => {
        // Check if mouse moved inside the SVG element
        if (d3.mouse(this)[0] <= that.config.width && d3.mouse(this)[1] <= that.config.height) {
          const idx = d3.bisector(d => _.get(d, that.keyX)).left(set.data, x0, 1);
          const d0 = set.data[idx - 1];
          const d1 = set.data[idx];
          const point = x0 - _.get(d0, that.keyX) > _.get(d1, that.keyX) - x0 ? d1 : d0;

          // Translate the focus element to the corret position
          d3.select(`.${that.classElement}`).select(`.igj-focus.focus_${k}`)
            .attr('transform', `translate(
              ${that.altX(_.get(point, that.keyX))},
              ${that.y(_.get(point, that.keyY))})`);
        }
      });
    }

    // Handler function when zooming
    function zoomed() {
      // Rescale horizontal axis based on point of zoom
      that.altX = d3.event.transform.rescaleX(that.x);
      const el = d3.select(`.${that.classElement}`);

      // If zoomed, transform the cursor icon except for dots and legend
      if (d3.event.transform.k > 1) {
        el.style('cursor', 'ew-resize');
      } else {
        el.style('cursor', 'auto');
      }
      el.selectAll('.igj-dot', '.legendCells')
        .style('cursor', 'pointer');

      // Hide the focus element when just zoomed
      el.selectAll('.igj-focus').select('circle')
        .attr('opacity', 0);

      // Update the x axis
      el.select('g').select('.igj-axisX')
        .call(that.xAxis.scale(that.altX));

      // Update the x-values of all lines
      el.selectAll('.igj-line')
        .attr('d', that.line.x(d => that.altX(_.get(d, that.keyX))));

      // Update the x-values of all areas
      if (that.config.graph.options.fillArea) {
        el.selectAll('.igj-area')
          .attr('d', that.area.x(d => that.altX(_.get(d, that.keyX))));
      }

      // Update the x-values of all dots
      el.selectAll('.igj-dot')
        .attr('cx', d => that.altX(_.get(d, that.keyX)));

      // Update the x-values of the x-gridlines
      el.select('.igj-gridX')
        .style('stroke-opacity', 1e-6)
        .transition()
        .duration(75)
        .call(that.makeGridlinesX(that.altX))
        .style('stroke-opacity', 0.7);
    }
  }

  /**
   * Update the input data of the Line Graph.
   * @param {Array<Object>} - The updated data.
   */
  update(newInput) {
    // Update the input data of the graph
    super.updateData(newInput);

    // Parse the current input data
    super.parseData();

    // Create the horizontal axis
    super.makeAxisX();

    // Create the vertical axis
    super.makeAxisY();

    this.input.forEach((outer, i) => {
      // Update already existing lines
      d3.select(`.${this.classElement}`).select('g').select(`.igj-line.line_${i}`)
        .data([outer.data])
        .transition()
        .delay(100)
        .duration(350)
        .attr('d', this.line(outer.data));

      // Update already existing areas
      d3.select(`.${this.classElement}`).select('g').select(`.igj-area.area_${i}`)
        .data([outer.data])
        .transition()
        .delay(100)
        .duration(350)
        .attr('d', this.area(outer.data));

      // Select already existing circles in the graph
      const circles = d3.select(`.${this.classElement}`).select('g')
        .selectAll(`.igj-dot.dot_${i}`);

      // Add new circles
      circles
        .data(outer.data)
        .enter()
        .append('circle')
        .on('mouseover', this.tooltip.show)
        .on('mouseout', this.tooltip.hide)
        .attr('class', `igj-dot dot_${i}`)
        .attr('cx', d => this.x(_.get(d, this.keyX)))
        .attr('cy', d => this.y(_.get(d, this.keyY)))
        .attr('r', this.config.circles.radius)
        .attr('fill', () => this.colorScale(i))
        .attr('opacity', this.config.circles.visible ? 1 : 0)
        .style('cursor', 'pointer');

      // Remove unneeded existing circles
      circles
        .data(outer.data)
        .exit()
        .transition()
        .delay(100)
        .duration(350)
        .style('fill-opacity', 1e-6)
        .remove();

      // Update existing circles with new values
      circles
        .data(outer.data)
        .transition()
        .delay(100)
        .duration(350)
        .attr('cx', d => this.x(_.get(d, this.keyX)))
        .attr('cy', d => this.y(_.get(d, this.keyY)))
        .attr('r', this.config.circles.radius);
    });
  }
}

export default LineGraph;
