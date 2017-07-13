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

import * as d3 from 'd3';
import _ from 'lodash';
import Graph from '../graph/graph';

/**
 * Class representing a Bar Graph.
 * @extends Graph
 */
class BarGraph extends Graph {
  /**
   * Create a bar graph in the DOM.
   * @param {Array<Object>} - The input data.
   * @return {Object} The SVG element containing the bar graph.
   */
  render(data) {
    // If does not exist, create a container SVG element
    this.svg = d3.select('.container').empty() ? super.render() : d3.select('.container');

    // Get the keys for the X, Y axis
    this.keyX = this.config.axis.x.mapTo;
    this.keyY = this.config.axis.y.mapTo;

    // Parse input data
    data.forEach((d) => {
      _.set(d, this.keyY, +_.get(d, this.keyY));
    });

    // Create the scale for the X axis
    const x = d3[this.config.axis.x.scaleType]()
      .range([this.config.width, 0])
      .domain(data.map(d => _.get(d, this.keyX)))
      .padding(0.1);

    // Create the scale for the Y Axis
    const y = d3[this.config.axis.y.scaleType]()
      .range([this.config.height, 0])
      .domain([0, d3.max(data, d => _.get(d, this.keyY))]);

    // Create the X Axis
    const xAxis = d3.axisBottom(x);

    // If specified, add gridlines along the X axis
    if (this.config.gridlines.x) {
      const gridlinesX = d3.axisBottom(x)
        .tickFormat(this.config.axis.x.ticksFormat)
        .tickSize(-this.config.height);

      if (this.config.axis.x.scaleType === 'scaleTime') {
        gridlinesX.ticks(this.config.axis.x.ticks);
      } else {
        gridlinesX.tickValues(
          x.domain().filter((d, i) => !(i % this.config.axis.x.ticks))
        );
      }

      if (d3.select('.gridX').empty()) {
        this.svg.append('g')
          .attr('transform', `translate(0, ${this.config.height})`)
          .attr('class', 'gridX')
          .call(gridlinesX);
      } else {
        d3.select('.gridX')
          .transition()
          .duration(350)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(400)
          .call(gridlinesX)
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the X Axis
    if (this.config.label.x.length > 0) {
      if (d3.select('.labelX').empty()) {
        this.svg.append('text')
          .attr('class', 'labelX')
          .attr('transform',
            `translate(${(this.config.width / 2)},
            ${this.config.height + this.config.margin.top})`)
          .attr('text-anchor', 'middle')
          .text(this.config.label.x);
      } else {
        d3.select('.labelX')
          .text(this.config.label.x);
      }
    }

    // Add the X Axis to the container element
    if (d3.select('.x.axis').empty()) {
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.config.height})`)
        .attr('class', 'x axis')
        .call(xAxis);
    } else {
      d3.select('.x.axis')
        .transition()
        .duration(550)
        .call(xAxis);
    }

    // If specified, hide the X axis path
    if (!this.config.axis.x.visible) {
      d3.selectAll('.x.axis path')
        .attr('style', 'display: none;');
      d3.selectAll('.x.axis line')
        .attr('style', 'display: none;');
    }

    // Create the Y Axis
    const yAxis = d3.axisLeft(y)
      .tickSizeOuter(0);

    // If specified, add gridlines along the Y axis
    if (this.config.gridlines.y) {
      const gridlinesY = d3.axisLeft(y)
        .ticks(this.config.axis.y.ticks)
        .tickFormat(this.config.axis.y.ticksFormat)
        .tickSize(-this.config.width);

      if (d3.select('.gridY').empty()) {
        this.svg.append('g')
          .attr('class', 'gridY')
          .call(gridlinesY);
      } else {
        d3.select('.gridY')
          .transition()
          .duration(150)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(500)
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the Y Axis
    if (this.config.label.y.length > 0) {
      if (d3.select('.labelY').empty()) {
        this.svg.append('text')
          .attr('class', 'labelY')
          .attr('transform',
            `translate(${-this.config.margin.right - 28},
            ${(this.config.height / 2) - this.config.margin.top})rotate(-90)`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.70em')
          .text(this.config.label.y);
      } else {
        d3.select('.labelY')
          .text(this.config.label.y);
      }
    }

    // Add the Y Axis to the container element
    if (d3.select('.y.axis').empty()) {
      this.svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    } else {
      d3.select('.y.axis')
        .transition()
        .duration(550)
        .call(yAxis);
    }

    // If specified, hide the Y axis path
    if (!this.config.axis.y.visible) {
      d3.selectAll('.y.axis path')
        .attr('style', 'display: none;');
      d3.selectAll('.y.axis line')
        .attr('style', 'display: none;');
    }

    const bars = d3.select('.container').select('g').selectAll('.bar');
    if (bars.empty()) {
      bars
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(_.get(d, this.keyX)))
        .attr('y', d => y(_.get(d, this.keyY)))
        .attr('width', x.bandwidth())
        .attr('height', d => this.config.height - y(_.get(d, this.keyY)));
    } else {
      bars
        .data(data)
        .transition()
        .duration(650)
        .attr('x', d => x(_.get(d, this.keyX)))
        .attr('y', d => y(_.get(d, this.keyY)))
        .attr('width', x.bandwidth())
        .attr('height', d => this.config.height - y(_.get(d, this.keyY)));
    }
    return this.svg;
  }
}

export default BarGraph;
