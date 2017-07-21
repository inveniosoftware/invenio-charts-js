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
import { legendColor } from 'd3-svg-legend';
import Graph from '../graph/graph';

/**
 * Class representing a Line Graph.
 * @extends Graph
 */
class LineGraph extends Graph {
  /**
   * Create a line graph in the DOM.
   * @param {Array<Object>} - The input data.
   * @param {String} - The class of the SVG element.
   * @return {Object} - The SVG element containing the line graph.
   */
  render(data, classElement) {
    // If does not exist, create a container SVG element
    this.svg = d3.select(`.${classElement}`).empty() ?
      super.initialize(classElement) : d3.select(`.${classElement}`);

    const that = this;

    // Get the options for the X, Y axis
    const xAxisOptions = this.config.axis.x.options;
    const yAxisOptions = this.config.axis.y.options;

    // Parse input data
    data.forEach((d) => {
      if (this.config.axis.x.scale.type === 'scaleTime') {
        _.set(d, this.keyX, new Date(_.get(d, this.keyX)));
      }
      _.set(d, this.keyY, +_.get(d, this.keyY));
    });

    // // Define clip path to focus on domain
    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('transform', 'translate(-7.5, -7.5)')
      .attr('width', this.config.width + 15)
      .attr('height', this.config.height + 10);

    // Create the scale for the X axis
    const x = d3[this.config.axis.x.scale.type]();
    let altX = x;

    if (this.config.axis.x.scale.type === 'scaleTime') {
      x.range([0, this.config.width]);
      x.domain(d3.extent(data, d => _.get(d, this.keyX)));
    } else {
      x.range([this.config.width, 0]);
      x.domain(data.map(d => _.get(d, this.keyX)));
      x.padding(1);
    }

    // Create the X Axis
    const xAxis = d3.axisBottom(x)
      .tickSizeOuter(0);

    if (this.config.axis.x.scale.type === 'scaleTime') {
      xAxis.ticks(xAxisOptions.ticks.number);
      xAxis.tickFormat(d3.timeFormat(this.config.axis.x.scale.format));
    } else {
      xAxis.tickValues(
        x.domain().filter((d, i) => !(i % xAxisOptions.ticks.number)));
    }

    // Add the X Axis to the container element
    if (d3.select(`.${classElement}`).select('.x.axis').empty()) {
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.config.height})`)
        .attr('class', 'x axis')
        .call(xAxis);
    } else {
      d3.select(`.${classElement}`).select('.x.axis')
        .transition()
        .duration(500)
        .call(xAxis);
    }

    // If specified, add gridlines along the X axis
    if (xAxisOptions.gridlines) {
      if (d3.select(`.${classElement}`).select('.gridX').empty()) {
        this.svg.append('g')
          .attr('class', 'gridX')
          .attr('transform', `translate(0, ${this.config.height})`)
          .call(this.makeGridlinesX(x));
      } else {
        d3.select(`.${classElement}`).select('.gridX')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesX(x))
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, rotate the tick labels
    if (xAxisOptions.tickLabels.rotated) {
      d3.select(`.${classElement}`).selectAll('g.x.axis g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.8em')
        .attr('dy', '.85em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the X Axis
    if (xAxisOptions.label.visible) {
      if (d3.select(`.${classElement}`).select('.labelX').empty()) {
        this.svg.append('text')
          .attr('class', 'labelX')
          .attr('transform',
            `translate(${(this.config.width / 2)}, ${this.config.height + this.config.margin.bottom})`)
          .attr('text-anchor', 'middle')
          .text(xAxisOptions.label.value);
      } else {
        d3.select(`.${classElement}`).select('.labelX')
          .text(xAxisOptions.label.value);
      }
    }

    // If specified, hide the X axis line
    if (!xAxisOptions.line.visible) {
      d3.select(`.${classElement}`).selectAll('.x.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!xAxisOptions.ticks.visible) {
      d3.select(`.${classElement}`).selectAll('.x.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!xAxisOptions.tickLabels.visible) {
      d3.select(`.${classElement}`).selectAll('.x.axis g.tick text')
        .attr('style', 'display: none;');
    }

    // Create the scale for the Y Axis
    const y = d3[this.config.axis.y.scale.type]()
      .range([this.config.height, 0])
      .domain([0, d3.max(data, d => _.get(d, this.keyY))]);

    // Create the Y Axis
    const yAxis = d3.axisLeft(y)
      .ticks(yAxisOptions.ticks.number)
      .tickSizeOuter(0);

    // If specified, add gridlines along the Y axis
    if (yAxisOptions.gridlines) {
      if (d3.select(`.${classElement}`).select('.gridY').empty()) {
        this.svg.append('g')
          .attr('class', 'gridY')
          .call(this.makeGridlinesY(y));
      } else {
        d3.select(`.${classElement}`).select('.gridY')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesY(y))
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the Y Axis
    if (yAxisOptions.label.visible) {
      if (d3.select(`.${classElement}`).select('.labelY').empty()) {
        this.svg.append('text')
          .attr('class', 'labelY')
          .attr('transform',
            `translate(${-this.config.margin.right - 50},
            ${(this.config.height / 2) - this.config.margin.top})rotate(-90)`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.70em')
          .text(yAxisOptions.label.value);
      } else {
        d3.select(`.${classElement}`).select('.labelY')
          .text(yAxisOptions.label.value);
      }
    }

    // Add the Y Axis to the container element
    if (d3.select(`.${classElement}`).select('.y.axis').empty()) {
      this.svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    } else {
      d3.select(`.${classElement}`).select('.y.axis')
        .transition()
        .duration(550)
        .call(yAxis);
    }

    // If specified, hide the Y axis line
    if (!yAxisOptions.line.visible) {
      d3.select(`.${classElement}`).selectAll('.y.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!yAxisOptions.ticks.visible) {
      d3.select(`.${classElement}`).selectAll('.y.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!yAxisOptions.tickLabels.visible) {
      d3.select(`.${classElement}`).selectAll('.y.axis g.tick text')
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

    let area;
    // If specified, add colored aera under the line
    if (this.config.graph.options.fillArea) {
      area = d3.area()
        .curve(d3[this.config.graph.options.curveType])
        .x(d => x(_.get(d, this.keyX)))
        .y0(this.config.height)
        .y1(d => y(_.get(d, this.keyY)));

      if (d3.select(`.${classElement}`).select('.area').empty()) {
        this.svg.append('path')
          .data([data])
          .transition()
          .delay(400)
          .duration(500)
          .attr('class', 'area')
          .attr('fill', this.config.graph.options.fillAreaColor)
          .attr('d', area(data));
      } else {
        d3.select(`.${classElement}`).select('.area')
          .transition()
          .duration(500)
          .attr('d', area(data));
      }
    }

    // Add the line to the SVG element
    if (d3.select(`.${classElement}`).select('.line').empty()) {
      this.svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('stroke', `url(#${classElement})`)
        .attr('d', line(data));
    } else {
      d3.select(`.${classElement}`).select('.line')
        .transition()
        .delay(100)
        .duration(400)
        .attr('d', line(data));
    }

    // If specified, add tooltip
    const tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset((d) => {
        if (_.get(d, this.keyY) > (0.9 * d3.max(data, d1 => _.get(d1, this.keyY)))) {
          return [10, 0];
        }
        return [-10, 0];
      })
      .direction((d) => {
        if (_.get(d, this.keyY) > (0.9 * d3.max(data, d1 => _.get(d1, this.keyY)))) {
          d3.select('.d3-tip').attr('class', 'd3-tip top');
          return 's';
        }
        d3.select('.d3-tip').attr('class', 'd3-tip bottom');
        return 'n';
      })
      .html(d => `
        <strong>${this.config.axis.x.options.label.value}:</strong>
        ${d3.timeFormat(this.config.axis.x.scale.format)(_.get(d, this.keyX))}</br>
        <strong>${this.config.axis.y.options.label.value}:</strong>
        ${_.get(d, this.keyY)}
      `);

    if (d3.select('.d3-tip').empty()) {
      this.svg.call(tooltip);
    }

    const focus = d3.select(`.${classElement}`).select('g')
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('circle')
      .attr('stroke', this.config.circles.color)
      .attr('fill', this.config.circles.color);

    // If specified, add circles to the line
    const circles = this.svg.selectAll('.dot');
    if (circles.empty()) {
      circles.data(data)
        .enter().append('circle')
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
        .transition()
        .delay(250)
        .duration(500)
        .attr('class', 'dot')
        .attr('cx', d => x(_.get(d, this.keyX)))
        .attr('cy', d => y(_.get(d, this.keyY)))
        .attr('r', this.config.circles.radius)
        .attr('fill', this.config.circles.color)
        .attr('opacity', this.config.circles.visible ? 1 : 0);
    } else {
      circles
        .data(data)
        .transition()
        .delay(100)
        .duration(250)
        .style('fill-opacity', 1e-6)
        .remove();

      circles
        .data(data)
        .transition()
        .delay(100)
        .duration(400)
        .attr('cx', d => x(_.get(d, this.keyX)))
        .attr('cy', d => y(_.get(d, this.keyY)))
        .attr('r', this.config.circles.radius);
    }

    // Define the linear gradient coloring of the line
    if (this.svg.select(`#${classElement}`).empty()) {
      this.svg.append('linearGradient')
        .attr('id', `${classElement}`)
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
    }

    // If specified, add title to the graph
    if (this.config.title.visible) {
      const graphTitle = d3.select(`.${classElement}`).select('g').select('.title');
      if (graphTitle.empty()) {
        this.svg.append('text')
          .attr('x', (this.config.width / 2))
          .attr('y', 0 - (this.config.margin.top / 1.8))
          .attr('class', 'title')
          .attr('text-anchor', 'middle')
          .text(this.config.title.value);
      } else {
        graphTitle.text(this.config.title.value);
      }
    }

    function mousemove() {
      const x0 = altX.invert(d3.mouse(this)[0]);
      d3.select(`.${classElement}`).select('.focus').select('circle')
        .attr('opacity', 1);
      // Check if mouse is inside the SVG element
      if (d3.mouse(this)[0] <= that.config.width && d3.mouse(this)[1] <= that.config.height) {
        const i = d3.bisector(d => _.get(d, that.keyX)).left(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const point = x0 - _.get(d0, that.keyX) > _.get(d1, that.keyX) - x0 ? d1 : d0;
        focus.attr('transform', `translate(${altX(_.get(point, that.keyX))}, ${y(_.get(point, that.keyY))})`);
      }
    }

    this.svg
      .on('mouseover', () => {
        focus.style('display', null);
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
      })
      .on('mousemove', mousemove);

    // If specified, add legend to the graph
    if (this.config.legend.visible) {
      const legendScale = d3.scaleOrdinal()
        .domain([`${this.config.legend.value}`])
        .range([`${this.config.circles.color}`]);

      // Position the legend
      // TODO: Check this.config.legend.position
      this.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${this.config.width / 2},
          ${this.config.height + (this.config.margin.bottom / 1.75)})`);

      let toggleLegend = true;

      // Create the legend
      const legend = legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(200)())
        .shapePadding(12)
        .shapeWidth(30)
        .orient('horizontal')
        .scale(legendScale)
        .on('cellclick', () => {
          const l = d3.select(`.${classElement}`).select('.line');
          const f = d3.select(`.${classElement}`).select('.focus');
          const c = d3.select(`.${classElement}`).selectAll('circle.dot');
          toggleLegend = !toggleLegend;
          if (toggleLegend) {
            l.attr('opacity', 0);
            c.attr('display', 'none');
            f.attr('opacity', 0);
          } else {
            l.attr('opacity', 1);
            c.attr('display', null);
            f.attr('opacity', 1);
          }
        });

      // Add the legend to the SVG
      this.svg.select('.legend')
        .call(legend);
    }

    // // Define clip path to focus on domain
    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('transform', 'translate(-8, -8)')
      .attr('width', this.config.width + 15)
      .attr('height', this.config.height + 5);

    function zoomed() {
      altX = d3.event.transform.rescaleX(x);
      if (d3.event.transform.k > 1) {
        d3.select(`.${classElement}`).style('cursor', 'ew-resize');
        d3.select(`.${classElement}`).selectAll('.dot').style('cursor', 'auto');
      } else {
        d3.select(`.${classElement}`).style('cursor', 'auto');
      }
      d3.select(`.${classElement}`).select('.focus').select('circle')
        .attr('opacity', 0);
      d3.select(`.${classElement}`).select('g').select('.x.axis')
        .transition()
        .duration(75)
        .call(xAxis.scale(altX));
      d3.select(`.${classElement}`).select('.line')
        .transition()
        .duration(75)
        .attr('d', line.x(d => altX(d.time)));
      d3.select(`.${classElement}`).select('.area')
        .transition()
        .duration(75)
        .attr('d', area.x(d => altX(d.time)));
      d3.select(`.${classElement}`).selectAll('.dot')
        .transition()
        .duration(75)
        .attr('cx', d => altX(d.time));
      d3.select(`.${classElement}`).select('.gridX')
        .transition()
        .duration(75)
        .style('stroke-opacity', 1e-6)
        .transition()
        .duration(75)
        .call(that.makeGridlinesX(altX))
        .style('stroke-opacity', 0.7);
    }

    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [this.config.width, this.config.height]])
      .extent([[0, 0], [this.config.width, this.config.height]])
      .on('zoom', zoomed);

    d3.select(`.${classElement}`)
      .call(zoom);

    return this.svg;
  }
}

export default LineGraph;
