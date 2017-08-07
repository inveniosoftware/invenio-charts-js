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
    // Class context reference
    const that = this;

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

    // Enable zoom
    if (this.config.zoom.enabled) {
      super.enableZoom(zoomed);
    }

    // Scale when resizing window
    super.scaleOnResize(resized);

    // Iterate over input data
    this.input.forEach((outer, i) => {
    // Add a line to the SVG element
      if (d3.select(`.${this.classElement}`).select(`.igj-line.line_${i}`).empty()) {
        this.line = d3.line()
          .x(d => this.x(_.get(d, this.keyX)))
          .y(d => this.y(_.get(d, this.keyY)))
          .curve(d3[this.config.graph.options.curveType]);

        // Bind all data to one element
        this.svg.append('path')
          .data([outer.data])
          .attr('class', `igj-line line_${i}`)
          .attr('stroke', () => this.colorScale(i))
          .attr('d', this.line(outer.data));
      }

      // If specified, add a colored aera under the line
      if (this.config.graph.options.fillArea) {
        if (d3.select(`.${this.classElement}`).select(`.igj-area.area_${i}`).empty()) {
          this.area = d3.area()
            .x(d => this.x(_.get(d, this.keyX)))
            .y1(d => this.y(_.get(d, this.keyY)))
            .y0(this.y(0))
            .curve(d3[this.config.graph.options.curveType]);

          // Bind all data to one element
          this.svg.append('path')
            .data([outer.data])
            .transition()
            .delay(100)
            .duration(400)
            .attr('class', `igj-area area_${i}`)
            .attr('fill', () => this.colorScale(i))
            .attr('d', this.area(outer.data));
        }
      }

      // Add focus circle over line
      d3.select(`.${this.classElement}`).select('g')
        .append('g')
        .attr('class', `igj-focus focus_${i}`)
        .style('display', 'none')
        .append('circle')
        .attr('r', 6)
        .attr('stroke', () => this.colorScale(i));

      // If specified, add circles to the line
      // Bind data to multiple elements
      const circles = this.svg.selectAll(`.igj-dot.dot_${i}`).data(outer.data);
      if (circles.empty()) {
        // Enter selection - add new circles
        circles
          .enter()
          .append('circle')
          .on('mouseover', this.tooltip.show)
          .on('mouseout', this.tooltip.hide)
          .attr('class', `igj-dot dot_${i}`)
          .attr('cx', d => this.x(_.get(d, this.keyX)))
          .attr('cy', d => this.y(_.get(d, this.keyY)))
          .attr('r', this.config.graph.options.circles.radius)
          .attr('fill', () => this.colorScale(i))
          .attr('opacity', this.config.graph.options.circles.visible ? 1 : 0)
          .style('cursor', 'pointer');
      }

      // Move all circle elements to the outer layer for tooltip
      circles.moveToFront();
    });

    this.svg.selectAll('.igj-dot').moveToFront();

    // Listen to mouseover movement on the graph
    this.svg
      .on('mouseover', () => this.svg.selectAll('.igj-focus').style('display', null))
      .on('mouseout', () => this.svg.selectAll('.igj-focus').style('display', 'none'))
      .on('mousemove', mousemove);

    /**
     * Mousemove event handler function
     * @private
     */
    function mousemove() {
      // Reveal the focus element
      d3.select(`.${that.classElement}`).selectAll('.igj-focus').select('circle')
        .attr('opacity', 1);

      // Calculate new position of focus element for all lines
      that.input.forEach((set, k) => {
        // Check if mouse moved inside the SVG element
        if (d3.mouse(this)[0] <= that.config.width && d3.mouse(this)[1] <= that.config.height) {
          let point = {};
          if (that.config.axis.x.scale.type === 'scaleTime') {
            // Get the x-value of the current mouse position
            const x0 = that.altX.invert(d3.mouse(this)[0]);
            const idx = d3.bisector(d => _.get(d, that.keyX)).left(set.data, x0, 1);
            const d0 = set.data[idx - 1];
            const d1 = set.data[idx];
            point = x0 - _.get(d0, that.keyX) > _.get(d1, that.keyX) - x0 ? d1 : d0;
          } else {
            const eachBand = that.altX.step();
            let index = Math.floor((d3.mouse(this)[0] / eachBand));

            // Make sure index is inside the domain
            if (index < 0) {
              index = 0;
            } else if (index > that.input[0].data.length - 1) {
              index = that.input[0].data.length - 1;
            }
            point = set.data[index];
          }
          // Translate the focus element to the correct position
          d3.select(`.${that.classElement}`).select(`.igj-focus.focus_${k}`)
            .attr('transform', `translate(
              ${that.altX(_.get(point, that.keyX))},
              ${that.y(_.get(point, that.keyY))})`);
        }
      });
    }

    /**
     * Handle zoom events.
     * @private
     */
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

      // Update the x-values of the x-gridlines
      el.select('.igj-gridX')
        .style('stroke-opacity', 1e-6)
        .call(that.makeGridlinesX(that.altX))
        .style('stroke-opacity', 0.7);

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
    }

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
    super.makeAxisX();

    // Create the vertical axis
    super.makeAxisY();

    // Create the title
    super.makeTitle();

    // Create the legend
    super.makeLegend();

    // Update dimension of the clip path
    d3.select(`.${this.classElement}`).select('#clip').select('rect')
      .attr('width', this.config.width + 10)
      .attr('height', this.config.height + this.marginVertical);

    this.input.forEach((outer, i) => {
      // Update already existing lines
      d3.select(`.${this.classElement}`).select(`.igj-line.line_${i}`)
        .data([outer.data])
        .transition()
        .delay(100)
        .duration(350)
        .attr('d', this.line(outer.data));

      // Update already existing areas
      if (this.config.graph.options.fillArea) {
        this.area
          .y1(d => this.y(_.get(d, this.keyY)))
          .y0(this.y(0));

        d3.select(`.${this.classElement}`).select(`.igj-area.area_${i}`)
          .data([outer.data])
          .transition()
          .delay(100)
          .duration(350)
          .attr('d', this.area(outer.data));
      }

      // Select already existing circles in the graph
      const circles = d3.select(`.${this.classElement}`)
        .selectAll(`.igj-dot.dot_${i}`)
        .data(outer.data);

      // Add new circles
      circles
        .enter()
        .append('circle')
        .on('mouseover', this.tooltip.show)
        .on('mouseout', this.tooltip.hide)
        .attr('class', `igj-dot dot_${i}`)
        .attr('cx', d => this.x(_.get(d, this.keyX)))
        .attr('cy', d => this.y(_.get(d, this.keyY)))
        .attr('r', this.config.graph.options.circles.radius)
        .attr('fill', this.colorScale(i))
        .attr('opacity', this.config.graph.options.circles.visible ? 1 : 0)
        .style('cursor', 'pointer');

      // Remove unneeded existing circles
      circles
        .exit()
        .transition()
        .delay(100)
        .duration(350)
        .style('fill-opacity', 1e-6)
        .remove();

      // Update existing circles with new values
      circles
        .transition()
        .delay(100)
        .duration(350)
        .attr('cx', d => this.x(_.get(d, this.keyX)))
        .attr('cy', d => this.y(_.get(d, this.keyY)))
        .attr('r', this.config.graph.options.circles.radius);

      // Move all circle elements to the outer layer for tooltip
      circles.moveToFront();
    });
  }

  getScaleX() {
    return this.x;
  }
}

export default LineGraph;
