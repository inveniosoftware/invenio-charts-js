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
 * Class representing a Line Graph.
 * @extends Graph
 */
class LineGraph extends Graph {
  /**
   * Create a line graph in the DOM.
   * @param {Array<object>} - The input data.
   * @return {Object} The SVG element containing the line graph.
   */
  render(data) {
    // If does not exist, create a container SVG element
    this.svg = d3.select('.container').empty() ? super.render() : d3.select('.container');

    // Get the keys for the X, Y axis
    this.keyX = this.config.axis.x.mapTo;
    this.keyY = this.config.axis.y.mapTo;

    // Parse input data
    data.forEach((d) => {
      if (this.config.axis.x.scaleType === 'scaleTime') {
        _.set(d, this.keyX, d3.timeParse('%d-%b-%y')(_.get(d, this.keyX)));
      }
      _.set(d, this.keyY, +_.get(d, this.keyY));
    });

    // Create the scale for the X axis
    const x = d3[this.config.axis.x.scaleType]();

    if (this.config.axis.x.scaleType === 'scaleTime') {
      x.range([0, this.config.width]);
      x.domain(d3.extent(data, d => _.get(d, this.keyX)));
    } else {
      x.range([this.config.width, 0]);
      x.domain(data.map(d => _.get(d, this.keyX)));
      x.padding(1);
    }

    // Create the scale for the Y Axis
    const y = d3[this.config.axis.y.scaleType]()
      .range([this.config.height, 0])
      .domain([0, d3.max(data, d => _.get(d, this.keyY))]);

    // Create the X Axis
    const xAxisOptions = this.config.axis.x.options;
    const xAxis = d3.axisBottom(x)
      .ticks(xAxisOptions.ticks.number)
      .tickSizeOuter(0);

    if (this.config.axis.x.scaleType === 'scaleTime') {
      xAxis.ticks(xAxisOptions.ticks.number);
    } else {
      xAxis.tickValues(
        x.domain().filter((d, i) => !(i % xAxisOptions.ticks.number)));
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

    // If specified, add gridlines along the X axis
    if (xAxisOptions.gridlines) {
      const gridlinesX = d3.axisBottom(x)
        .ticks(xAxisOptions.ticks.number)
        .tickSize(-this.config.height)
        .tickFormat(xAxisOptions.ticks.format);

      if (d3.select('.gridX').empty()) {
        this.svg.append('g')
          .attr('transform', `translate(0, ${this.config.height})`)
          .attr('class', 'gridX')
          .call(gridlinesX);
      } else {
        d3.select('.gridX')
          .transition()
          .duration(175)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(475)
          .call(gridlinesX)
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the X Axis
    if (xAxisOptions.label.visible) {
      if (d3.select('.labelX').empty()) {
        this.svg.append('text')
          .attr('class', 'labelX')
          .attr('transform',
            `translate(${(this.config.width / 2)}, ${this.config.height + this.config.margin.top})`)
          .attr('text-anchor', 'middle')
          .text(xAxisOptions.label.value);
      } else {
        d3.select('.labelX')
          .text(xAxisOptions.label.value);
      }
    }

    // If specified, hide the X axis line
    if (!xAxisOptions.line.visible) {
      d3.selectAll('.x.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!xAxisOptions.ticks.visible) {
      d3.selectAll('.x.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!xAxisOptions.tickLabels.visible) {
      d3.selectAll('.x.axis g.tick text')
        .attr('style', 'display: none;');
    }

    // Create the Y Axis
    const yAxisOptions = this.config.axis.y.options;
    const yAxis = d3.axisLeft(y)
      .ticks(yAxisOptions.ticks.number)
      .tickSizeOuter(0);

    // If specified, add gridlines along the Y axis
    if (yAxisOptions.gridlines) {
      const gridlinesY = d3.axisLeft(y)
        .ticks(yAxisOptions.ticks.number)
        .tickFormat(yAxisOptions.ticks.format)
        .tickSize(-this.config.width);

      if (d3.select('.gridY').empty()) {
        this.svg.append('g')
          .attr('class', 'gridY')
          .call(gridlinesY);
      } else {
        d3.select('.gridY')
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(175)
          .call(gridlinesY)
          .transition()
          .duration(475)
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the Y Axis
    if (yAxisOptions.label.visible) {
      if (d3.select('.labelY').empty()) {
        this.svg.append('text')
          .attr('class', 'labelY')
          .attr('transform',
            `translate(${-this.config.margin.right - 28},
            ${(this.config.height / 2) - this.config.margin.top})rotate(-90)`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.70em')
          .text(yAxisOptions.label.value);
      } else {
        d3.select('.labelY')
          .text(yAxisOptions.label.value);
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

    // If specified, hide the Y axis line
    if (!yAxisOptions.line.visible) {
      d3.selectAll('.y.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!yAxisOptions.ticks.visible) {
      d3.selectAll('.y.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!yAxisOptions.tickLabels.visible) {
      d3.selectAll('.y.axis g.tick text')
        .attr('style', 'display: none;');
    }

    // Create the line graph
    const line = d3[this.config.graph.type]()
      .x(d => x(_.get(d, this.keyX)))
      .y(d => y(_.get(d, this.keyY)));

    // If specified, use curve instead of straight line
    if (this.config.graph.options.curved) {
      line.curve(d3[this.config.graph.options.curveType]);
    }

    // If specified, add colored aera under the line
    if (this.config.graph.options.fillArea) {
      const area = d3.area()
        .curve(d3[this.config.graph.options.curveType])
        .x(d => x(_.get(d, this.keyX)))
        .y0(this.config.height)
        .y1(d => y(_.get(d, this.keyY)));

      // Add the line to the SVG element
      if (d3.select('.line').empty()) {
        this.svg.append('path')
          .attr('class', 'line')
          .attr('d', line(data));
      } else {
        d3.select('.line')
          .transition()
          .duration(650)
          .attr('d', line(data));
      }

      if (d3.select('.area').empty()) {
        this.svg.append('path')
          .attr('class', 'area')
          .attr('fill', this.config.graph.options.fillAreaColor)
          .attr('d', area(data));
      } else {
        d3.select('.area')
          .transition()
          .duration(650)
          .attr('d', area(data));
      }
    }

    // Define the linear gradient coloring of the line
    this.svg.append('linearGradient')
      .attr('id', 'value-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: `${this.config.color.thresholds[0].offset}%`,
          color: this.config.color.thresholds[0].value,
          opacity: `${this.config.color.thresholds[0].value}`
        },
        { offset: `${this.config.color.thresholds[1].offset}%`,
          color: this.config.color.thresholds[1].value,
          opacity: `${this.config.color.thresholds[1].value}`
        }
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.opacity);

    return this.svg;
  }
}

export default LineGraph;
