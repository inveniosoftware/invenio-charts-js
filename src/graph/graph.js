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
import { legendColor } from 'd3-svg-legend';
import d3Tip from 'd3-tip';
import * as util from '../util/util';

d3.tip = d3Tip;

/** Class representing an abstract Graph. */
class Graph {
  /**
   * Create a graph.
   * @param {Object} config - The configuration of the graph.
   * @param {Array<Object>} - The input data.
   * @param {String} - The class of the SVG element.
   */
  constructor(config, input, classElement) {
    // Setters
    this.config = config;
    this.input = input;
    this.classElement = classElement;

    // Get the keys for the X, Y axis
    this.keyX = this.config.axis.x.mapTo;
    this.keyY = this.config.axis.y.mapTo;

    // Set the colorScale of the graph
    this.colorScale = d3.scaleOrdinal(d3[`${this.config.colorScale}`]);
  }

  /**
   * Get the type of the graph.
   * @return {string} The type value.
   */
  getType() {
    return this.config.type;
  }

  /**
   * Render an empty SVG element to the DOM.
   */
  initialize() {
    // Check if the specified element exists
    let element = d3.select(`.${this.classElement}`);
    const totalWidth = this.config.width + this.config.margin.left + this.config.margin.right;
    const totalHeight = this.config.height + this.config.margin.top + this.config.margin.bottom;
    this.ratio = totalWidth / totalHeight;

    if (element.empty()) {
      element = d3.select('body')
        .append('div')
        .attr('class', `${this.classElement}`);
    }

    if (element.select('svg').empty()) {
      this.svg = element
        .append('svg')
        .attr('class', `${this.classElement}`)
        .attr('width', totalWidth)
        .attr('height', totalHeight)
        .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .append('g')
        .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);
    } else {
      this.svg = element;
    }
  }

  /**
   * Update the input data
   */
  updateData(newInput) {
    this.input = newInput;
  }

  /**
   * Parse the input data
   */
  // TODO: Parser
  parseData() {
    this.input.forEach((outer) => {
      outer.data.forEach((inner) => {
        if (this.config.axis.x.scale.type === 'scaleTime') {
          _.set(inner, this.keyX, new Date(_.get(inner, this.keyX)));
        }
        _.set(inner.data, this.keyY, +_.get(inner.data, this.keyY));
      });
    });
  }

  /**
   * Create the X axis of the graph.
   * @param padding {number}: optional padding.
   */
  makeAxisX(padding) {
    const xAxisOptions = this.config.axis.x.options;
    this.altX = this.x;

    // Create the scale for the X axis
    this.x = d3[this.config.axis.x.scale.type]()
      .range([0, this.config.width]);

    // Create the scale for the zoom on X axis
    this.altX = this.x;

    // Add range and domain to the X axis
    if (this.config.axis.x.scale.type === 'scaleTime') {
      this.x.domain(d3.extent(this.input[0].data, d => _.get(d, this.keyX)));
    } else {
      this.x.domain(this.input[0].data.map(d => _.get(d, this.keyX)));
      this.x.padding(padding);
    }

    // Create the (horizontal) X Axis
    this.xAxis = d3.axisBottom(this.x)
      .tickSizeOuter(0);

    if (this.config.axis.x.scale.type === 'scaleTime') {
      this.xAxis.ticks(xAxisOptions.ticks.number);
      this.xAxis.tickFormat(d3.timeFormat(this.config.axis.x.scale.format));
    } else {
      this.xAxis.tickValues(
        this.x.domain().filter((d, i) => !(i % xAxisOptions.ticks.number)));
    }

    // Add the X Axis to the container element
    if (d3.select(`.${this.classElement}`).select('.igj-axisX').empty()) {
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.config.height})`)
        .attr('class', 'igj-axisX')
        .call(this.xAxis);
    } else {
      d3.select(`.${this.classElement}`).select('.igj-axisX')
        .transition()
        .duration(500)
        .call(this.xAxis);
    }

    // If specified, add gridlines along the X axis
    if (xAxisOptions.gridlines) {
      if (d3.select(`.${this.classElement}`).select('.igj-gridX').empty()) {
        this.svg.append('g')
          .attr('class', 'igj-gridX')
          .attr('transform', `translate(0, ${this.config.height})`)
          .call(this.makeGridlinesX(this.x));
      } else {
        d3.select(`.${this.classElement}`).select('.igj-gridX')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesX(this.x))
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, rotate the tick labels
    if (xAxisOptions.tickLabels.rotated) {
      d3.select(`.${this.classElement}`).selectAll('g.igj-axisX g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.8em')
        .attr('dy', '.85em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the X Axis
    if (xAxisOptions.label.visible) {
      if (d3.select(`.${this.classElement}`).select('.igj-labelX').empty()) {
        this.svg.append('text')
          .attr('class', 'igj-labelX')
          .attr('transform', `translate(
            ${(this.config.width / 2)},
            ${this.config.height + (this.config.margin.bottom / 2)})`)
          .attr('text-anchor', 'middle')
          .text(xAxisOptions.label.value);
      } else {
        d3.select(`.${this.classElement}`).select('.igj-labelX')
          .text(xAxisOptions.label.value);
      }
    }

    // If specified, hide the X axis line
    if (!xAxisOptions.line.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!xAxisOptions.ticks.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!xAxisOptions.tickLabels.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX g.tick text')
        .attr('style', 'display: none;');
    }
  }

  /**
   * Create the Y axis of the graph.
   */
  makeAxisY() {
    const yAxisOptions = this.config.axis.y.options;
    const maxValuesY = [];

    this.input.forEach(arr =>
      maxValuesY.push(d3.max(arr.data, d => _.get(d, this.keyY)))
    );

    // Create the scale for the Y Axis
    this.y = d3[this.config.axis.y.scale.type]()
      .range([this.config.height, 0])
      .domain([0, _.max(maxValuesY)]);

    // Create the Y Axis
    this.yAxis = d3.axisLeft(this.y)
      .ticks(yAxisOptions.ticks.number, 's')
      .tickSizeOuter(0);

    // If specified, add gridlines along the Y axis
    if (yAxisOptions.gridlines) {
      if (d3.select(`.${this.classElement}`).select('.igj-gridY').empty()) {
        this.svg.append('g')
          .attr('class', 'igj-gridY')
          .call(this.makeGridlinesY(this.y));
      } else {
        d3.select(`.${this.classElement}`).select('.igj-gridY')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesY(this.y))
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the Y Axis
    if (yAxisOptions.label.visible) {
      if (d3.select(`.${this.classElement}`).select('.igj-labelY').empty()) {
        this.svg.append('text')
          .attr('class', 'igj-labelY')
          .attr('transform',
            `translate(${-this.config.margin.right - 50},
            ${(this.config.height / 2) - this.config.margin.top})rotate(-90)`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.70em')
          .text(yAxisOptions.label.value);
      } else {
        d3.select(`.${this.classElement}`).select('.igj-labelY')
          .text(yAxisOptions.label.value);
      }
    }

    // Add the Y Axis to the container element
    if (d3.select(`.${this.classElement}`).select('.igj-axisY').empty()) {
      this.svg.append('g')
        .attr('class', 'igj-axisY')
        .call(this.yAxis);
    } else {
      d3.select(`.${this.classElement}`).select('.igj-axisY')
        .transition()
        .duration(550)
        .call(this.yAxis);
    }

    // If specified, hide the Y axis line
    if (!yAxisOptions.line.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisY path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!yAxisOptions.ticks.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisY line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!yAxisOptions.tickLabels.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisY g.tick text')
        .attr('style', 'display: none;');
    }
  }

  /**
   * Create the legend of the graph.
   */
  makeLegend() {
    const legendValues = [];
    let toggleLegend = true;

    // Parse legend values
    this.input.forEach(outer => legendValues.push(outer.label));

    // If specified, add legend to the graph
    if (this.config.legend.visible) {
      const legendScale = d3.scaleOrdinal()
        .domain(legendValues)
        .range(this.input.map((d, i) => this.colorScale(i)));

      // Create the legend
      const legend = legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(200)())
        .shapePadding(40)
        .orient(this.config.legend.position === 'bottom' ? 'horizontal' : 'vertical')
        .scale(legendScale)
        .on('cellclick', (d) => {
          const idx = legendValues.indexOf(d);
          const el = d3.select(`.${this.classElement}`)
            .selectAll(`.igj-line.line_${idx}, .igj-area.area_${idx},
                        .igj-focus.focus_${idx}, .igj-dot.dot_${idx},
                        .igj-bar.bar_${idx}`);
          toggleLegend = !toggleLegend;
          el.attr('display', toggleLegend ? null : 'none');
        });

      // Add the legend to the graph and change cursor
      this.svg.append('g')
        .attr('class', 'igj-legend')
        .style('cursor', 'pointer')
        .call(legend);

      // Get the dimensions of the current legend
      const legendBox = this.svg.select('.igj-legend').node().getBBox();

      // Position the legend
      if (this.config.legend.position === 'bottom') {
        this.svg.select('.igj-legend')
          .attr('transform', `translate(
            ${(this.config.width - legendBox.width) / 2},
            ${this.config.height + (this.config.margin.bottom / 1.75)}
          )`);
      } else {
        this.svg.select('.igj-legend')
          .attr('transform', `translate(
            ${this.config.width - legendBox.width},
            ${this.config.margin.top}
          )`);
      }
    }
  }

  /**
   * Create the title of the graph.
   */
  makeTitle() {
    if (this.config.title.visible) {
      const graphTitle = d3.select(`.${this.classElement}`).select('g').select('.igj-title');
      if (graphTitle.empty()) {
        this.svg.append('text')
          .attr('x', (this.config.width / 2))
          .attr('y', 0 - (this.config.margin.top / 1.8))
          .attr('class', 'igj-title')
          .attr('text-anchor', 'middle')
          .text(this.config.title.value);
      } else {
        graphTitle.text(this.config.title.value);
      }
    }
  }

  /**
   * Create the tooltip the graph.
   */
  makeTooltip() {
    this.tooltip = d3.tip()
      .attr('class', `${this.classElement} igj-tip`)
      .offset((d) => {
        const offset = [0, 0];
        const out = util.isOut(this.x(_.get(d, this.keyX)), this.y(_.get(d, this.keyY)),
          this.config.width, this.config.height);
        if (out.top) {
          offset[0] = 10;
        } else {
          offset[0] = -10;
        }
        if (out.left) {
          offset[0] = 5;
          offset[1] = 10;
        } else if (out.right) {
          offset[0] = -5;
          offset[1] = -10;
        }
        return offset;
      })
      .direction((d) => {
        let dir = '';
        const out = util.isOut(this.x(_.get(d, this.keyX)), this.y(_.get(d, this.keyY)),
          this.config.width, this.config.height);
        if (out.top) {
          dir = 's';
          d3.select(`.${this.classElement}.igj-tip`)
            .attr('class', `${this.classElement} igj-tip top`);
        } else {
          dir = 'n';
          d3.select(`.${this.classElement}.igj-tip`)
            .attr('class', `${this.classElement} igj-tip bottom`);
        }
        if (out.left) {
          dir = 'e';
          d3.select(`.${this.classElement}.igj-tip`)
            .attr('class', `${this.classElement} igj-tip left`);
        } else if (out.right) {
          dir = 'w';
          d3.select(`.${this.classElement}.igj-tip`)
            .attr('class', `${this.classElement} igj-tip right`);
        }
        return dir;
      })
      .html(d => `
        <strong>${this.config.axis.x.options.label.value}:</strong>
        ${_.get(d, this.keyX)}</br>
        <strong>${this.config.axis.y.options.label.value}:</strong>
        ${_.get(d, this.keyY)}
      `);

    // Register the tooltip to the graph
    this.svg.call(this.tooltip);
  }

  /**
   * Enable zoom in the graph.
   */
  enableZoom(f) {
    // Define clip path to focus on domain
    this.svg
      .append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('transform', 'translate(-8, -8)')
      .attr('width', this.config.width + 15)
      .attr('height', this.config.height + 10);

    this.zoom = d3.zoom()
      .scaleExtent([1, 16])
      .translateExtent([[0, 0], [this.config.width, this.config.height]])
      .extent([[0, 0], [this.config.width, this.config.height]])
      .on('zoom', f);

    d3.select(`.${this.classElement}`).select('g')
      .call(this.zoom);
  }

  /**
   * Create the gridlines for the horizontal axis.
   * @param {Function} xScale - The scale of the X axis.
   * @return {Function} gridlinesX - The gridlines of the X axis.
   */
  makeGridlinesX(xScale) {
    const gridlinesX = d3.axisBottom(xScale)
      .tickSize(-this.config.height)
      .tickFormat(this.config.axis.x.options.ticks.format);

    if (this.config.axis.x.scale.type === 'scaleTime') {
      gridlinesX.ticks(this.config.axis.x.options.ticks.number);
    } else {
      gridlinesX.tickValues(
        xScale.domain()
          .filter((d, i) => !(i % this.config.axis.x.options.ticks.number)));
    }
    return gridlinesX;
  }

  /**
  * Create the gridlines for the vertical axis.
   * @param {Function} yScale - The scale of the Y axis.
   * @return {Function} gridlinesY - The gridlines of the Y axis.
   */
  makeGridlinesY(yScale) {
    const gridlinesY = d3.axisLeft(yScale)
      .tickSize(-this.config.width)
      .ticks(this.config.axis.y.options.ticks.number)
      .tickFormat(this.config.axis.y.options.ticks.format);

    return gridlinesY;
  }
}

export default Graph;
