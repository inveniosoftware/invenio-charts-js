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

import * as d3 from 'd3';
import _ from 'lodash';
import '../styles/styles.scss';
import isOut from '../util/util';

require('d3-extended')(d3);

/**
 * Class representing a graph.
 */
class Graph {
  /**
   * Create a general purpose graph.
   * @constructor
   * @param {Object} input - The input data passed to the graph.
   * @param {String} classElement - The class of the DOM element placeholder.
   * @param {Object} config - The JSON configuration of the graph.
   */
  constructor(input, classElement, config) {
    // Setters
    this.classElement = classElement;
    this.config = config;
    this.input = input;

    // Set the keys for the axis based on the given configuration
    this.keyX = this.config.axis.x.mapTo;
    this.keyY = this.config.axis.y.mapTo;

    // Set the colorScale of the graph based on the given configuration
    this.colorScale = d3.scaleOrdinal(d3[`${this.config.colorScale}`]);

    // Set the margins of the graph based on the given configuration
    this.marginHorizontal = this.config.margin.left + this.config.margin.right;
    this.marginVertical = this.config.margin.top + this.config.margin.bottom;

    // Set the axis options based on the given configuration
    this.xAxisOptions = this.config.axis.x.options;
    this.yAxisOptions = this.config.axis.y.options;

    // Set the breakpoints for resizing based on the given configuration
    this.breakPointX = this.config.resize.breakPointX;
    this.breakPointY = this.config.resize.breakPointY;
  }

  /**
   * Get the type of the graph.
   * @returns {string} - The type of the instantiated graph.
   */
  getType() {
    return this.config.type;
  }

  /**
   * Get the scale of the horizontal axis.
   * @returns {function} - The scale of the X axis.
   */
  getXScale() {
    return this.x;
  }

  /**
   * Get the scale of the vertical axis.
   * @returns {function} - The scale of the Y axis.
   */
  getYScale() {
    return this.y;
  }

  /**
   * Append an empty SVG element to the DOM.
   * @returns {void}
   */
  initialize() {
    let element = d3.select(`.${this.classElement}`);

    // Check if the specified element exists
    if (element.empty()) {
      element = d3.select('body')
        .append('div')
        .attr('class', `${this.classElement}`)
        .attr('style', 'width: 95vw; height: 95vh;');
    }

    // Get the dimensions of the parent node in the DOM
    const parentElement = element.node().getBoundingClientRect();

    // Calculate the dimensions of the SVG
    this.config.width = parentElement.width - this.marginHorizontal;
    this.config.height = parentElement.height - this.marginVertical;

    if (element.select('svg').empty()) {
      this.svg = element
        .append('svg')
        .attr('class', `${this.classElement}`)
        .attr('width', parentElement.width)
        .attr('height', parentElement.height)
        .append('g')
        .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);
    } else {
      this.svg = element.select('svg')
        .attr('width', parentElement.width)
        .attr('height', parentElement.height);
    }
  }

  /**
   * Update the input data
   * @param {object} data - the new data of the graph
   * @returns {void}
   */
  updateData(data) {
    this.input = data;
    this.parseData();
  }

  /**
   * Update the dimensions of the clip path to match the resized graph ones
   * @returns {void}
   */
  resizeClipPath() {
    this.svg.select('#clip').select('rect')
      .attr('width', this.config.width + this.config.margin.right)
      .attr('height', this.config.height + this.marginVertical);
  }

  /**
   * Parse the input data
   * @returns {void}
   */
  parseData() {
    const parsed = [];
    Object.keys(this.input).forEach((k) => {
      const obj = {};
      obj.label = k;
      obj.data = this.input[k].buckets;
      parsed.push(obj);
    });

    this.input = parsed;

    // If timeScale in X axis, parse miliseconds into Date
    // Make sure for number value in Y axis
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
   * @param {function} [x0] - optional scale for the axis
   * @returns {void}
   */
  makeAxisX(x0) {
    // Create the scale for the X axis
    if (typeof (x0) !== 'undefined') {
      this.x = x0;
    } else {
      this.x = d3[this.config.axis.x.scale.type]()
        .range([0, this.config.width]);
    }

    // Create the scale for the zoom on X axis
    this.altX = this.x;

    // Add range and domain to the X axis
    if (this.config.axis.x.scale.type === 'scaleTime') {
      this.x.range([0, this.config.width]);
      this.x.domain(d3.extent(this.input[0].data, d => _.get(d, this.keyX)));
    } else {
      this.x.domain(this.input[0].data.map(d => _.get(d, this.keyX)));
      this.x.rangeRound([0, this.config.width]);
      this.x.padding(this.config.axis.x.options.padding);
    }

    // Create the X-axis (horizontal)
    this.xAxis = d3.axisBottom(this.x);

    // If timescale, set the format of the ticks
    if (this.config.axis.x.scale.type === 'scaleTime') {
      this.xAxis.tickFormat(d3.timeFormat(this.config.axis.x.scale.format));
    }

    // While resizing, if graph gets small enough, remove some ticks
    if (this.config.width < this.breakPointX) {
      if (this.config.axis.x.scale.type === 'scaleTime') {
        this.xAxis.ticks(d3[this.config.axis.x.scale.interval]);
      } else {
        this.xAxis.tickValues(this.x.domain().filter((d, i) => !(i % 3)));
      }
    }

    // Add the X Axis to the container element
    let axisHoriz = d3.select(`.${this.classElement}`).select('.igj-horiz');
    if (axisHoriz.empty()) {
      axisHoriz = this.svg.append('g')
        .attr('class', 'igj-horiz')
        .attr('clip-path', "url('#clip')");
    }
    let axisX = axisHoriz.select('.igj-axisX');
    if (axisX.empty()) {
      axisX = axisHoriz.append('g')
        .attr('class', 'igj-axisX')
        .call(this.xAxis);
    } else {
      axisX
        .transition()
        .delay(50)
        .duration(250)
        .call(this.xAxis);
    }
    // Place the X axis at the bottom of the graph
    axisX
      .transition()
      .delay(50)
      .duration(250);

    // When zero-padded in band scale, move ticks to the left to align
    if (this.config.axis.x.options.padding === 0 && this.config.axis.x.scale.type === 'scaleBand') {
      axisX.attr('transform', `translate(-${this.x.step() / 2}, ${this.config.height})`);
    } else {
      axisX.attr('transform', `translate(0, ${this.config.height})`);
    }

    // If specified, add gridlines along the X axis
    if (this.xAxisOptions.gridlines) {
      let gridX = axisHoriz.select('.igj-gridX');
      if (gridX.empty()) {
        gridX = axisHoriz.append('g')
          .attr('class', 'igj-gridX')
          .call(this.makeGridlinesX());
      } else {
        gridX
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesX())
          .style('stroke-opacity', 0.7);
      }
      // Place the X gridlines at the bottom of the graph
      gridX.attr('transform', `translate(0, ${this.config.height})`);

      // Translate to the left to align ticks, when padding is not specified
      if (this.config.axis.x.options.padding === 0 && this.config.axis.x.scale.type === 'scaleBand') {
        gridX.attr('transform', `translate(-${this.x.step() / 2}, ${this.config.height})`);
      }
    }

    // If specified, rotate the tick labels
    if (this.xAxisOptions.tickLabels.rotated) {
      axisHoriz.selectAll('g.igj-axisX g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.8em')
        .attr('dy', '.85em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the X Axis
    if (this.xAxisOptions.label.visible) {
      let xAxisLabel = this.svg.select('.igj-labelX');
      if (xAxisLabel.empty()) {
        xAxisLabel = this.svg.append('text')
          .attr('class', 'igj-labelX')
          .text(this.xAxisOptions.label.value)
          .attr('text-anchor', 'middle');
      }
      xAxisLabel
        .transition()
        .delay(50)
        .duration(200)
        .text(this.xAxisOptions.label.value)
        .attr('x', `${this.config.width / 2}`)
        .attr('y', `${this.config.height + (this.config.margin.bottom / 2)}`);
    }

    // If specified, hide the X axis line
    if (!this.xAxisOptions.line.visible) {
      axisX.select('path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!this.xAxisOptions.ticks.visible) {
      axisX.selectAll('g.tick line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!this.xAxisOptions.tickLabels.visible) {
      axisX.selectAll('g.tick text')
        .attr('style', 'display: none;');
    }
  }

  /**
   * Create the Y axis of the graph.
   * @returns {void}
   */
  makeAxisY() {
    const maxValuesY = [];

    this.input.forEach(arr =>
      maxValuesY.push(d3.max(arr.data, d => _.get(d, this.keyY)))
    );

    // Create the scale for the Y Axis
    this.y = d3[this.config.axis.y.scale.type]()
      .range([this.config.height, 0])
      .domain([0, _.max(maxValuesY)]);

    // Create the Y Axis
    this.yAxis = d3.axisLeft(this.y);
    this.yAxis.ticks(null, 's');

    if (this.config.height < this.breakPointY) {
      const maxY = this.y.domain()[1];
      this.yAxis.tickValues(
        [0, Math.round(0.25 * maxY), Math.round(0.5 * maxY), Math.round(0.75 * maxY), maxY]
      );
    }

    // Add the Y Axis to the container element
    let axisVert = d3.select(`.${this.classElement}`).select('.igj-vert');
    if (axisVert.empty()) {
      axisVert = this.svg.append('g')
        .attr('class', 'igj-vert');
    }

    let axisY = axisVert.select('.igj-axisY');
    if (axisY.empty()) {
      axisY = axisVert.append('g')
        .attr('class', 'igj-axisY')
        .call(this.yAxis);
    } else {
      axisY
        .transition()
        .delay(50)
        .duration(250)
        .call(this.yAxis);
    }

    // If specified, add gridlines along the Y axis
    if (this.yAxisOptions.gridlines) {
      let gridY = axisVert.select('.igj-gridY');
      if (gridY.empty()) {
        gridY = axisVert.append('g')
          .attr('class', 'igj-gridY')
          .call(this.makeGridlinesY());
      } else {
        gridY
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesY())
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, rotate the tick labels
    if (this.yAxisOptions.tickLabels.rotated) {
      axisVert.selectAll('g.igj-axisY g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.85em')
        .attr('dy', '.25em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the Y Axis
    if (this.yAxisOptions.label.visible) {
      let yAxisLabel = this.svg.select('.igj-labelY');
      if (yAxisLabel.empty()) {
        yAxisLabel = this.svg.append('text')
          .attr('class', 'igj-labelY')
          .text(this.yAxisOptions.label.value);
      }
      yAxisLabel
        .transition()
        .delay(50)
        .duration(250)
        .attr('transform',
          `translate(${-this.config.margin.left},
          ${(this.config.height / 2)})rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.70em');
    }

    // If specified, hide the Y axis line
    if (!this.yAxisOptions.line.visible) {
      axisY.select('path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!this.yAxisOptions.ticks.visible) {
      axisY.selectAll('g.tick line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!this.yAxisOptions.tickLabels.visible) {
      axisY.selectAll('g.tick text')
        .attr('style', 'display: none;');
    }
  }

  /**
   * Create the legend of the graph.
   * @returns {void}
   */
  makeLegend() {
    let toggleLegend = true;
    const legendValues = [];

    // Parse legend values
    this.input.forEach(outer => legendValues.push(outer.label));

    // If specified, add legend to the graph
    if (this.config.legend.visible) {
      const legendScale = d3.scaleOrdinal()
        .domain(legendValues)
        .range(this.input.map((d, i) => this.colorScale(i)));

      // Create the legend
      const colorLegend = d3.legendColor()
        .shape('rect')
        .shapeWidth(this.config.width > this.config.resize.breakPointX ? 30 : 20)
        .orient(this.config.legend.position === 'bottom' ? 'horizontal' : 'vertical')
        .shapePadding(this.config.legend.position === 'bottom' ? 35 : 15)
        .scale(legendScale)
        .on('cellclick', (d) => {
          const idx = legendValues.indexOf(d);
          const selectedElements = d3.select(`.${this.classElement}`)
            .selectAll(`.igj-line.line_${idx}, .igj-area.area_${idx},
                        .igj-focus.focus_${idx}, .igj-dot.dot_${idx},
                        .igj-bar.bar_${idx}, .igj-bar.bar_${d}`);
          toggleLegend = !toggleLegend;
          selectedElements
            .transition()
            .duration(250)
            .attr('style', toggleLegend ? 'opacity: 1' : 'opacity: 0.3');
        });

      // Add the legend to the graph and change cursor
      const legend = d3.select(`.${this.classElement}`).select('.igj-legend');
      if (legend.empty()) {
        this.svg.append('g')
          .attr('class', 'igj-legend')
          .style('cursor', 'pointer')
          .call(colorLegend);
      }

      // Get the dimensions of the current legend
      const legendBox = this.svg.select('.igj-legend').node().getBBox();

      // Position the legend
      if (this.config.legend.position === 'bottom') {
        this.svg.select('.igj-legend')
          .transition()
          .delay(50)
          .duration(200)
          .attr('transform', `translate(
            ${(this.config.width - legendBox.width) / 2},
            ${this.config.height + (this.config.margin.bottom / 2)}
          )`);
      } else if (this.config.legend.position === 'side') {
        this.svg.select('.igj-legend')
          .transition()
          .delay(50)
          .duration(200)
          .attr('transform', `translate(
            ${this.config.width - legendBox.width},
            ${this.config.margin.top}
          )`);
      }
    }
  }

  /**
   * Create the title of the graph.
   * @returns {void}
   */
  makeTitle() {
    const graphTitle = d3.select(`.${this.classElement}`).select('.igj-title');
    if (graphTitle.empty()) {
      this.svg.append('text')
        .attr('x', `${this.config.width / 2}`)
        .attr('y', -(this.config.margin.top / 1.8))
        .attr('class', 'igj-title')
        .attr('text-anchor', 'middle')
        .text(this.config.title.value);
    }

    graphTitle
      .text(this.config.title.value)
      .transition()
      .delay(50)
      .duration(250)
      .attr('x', `${this.config.width / 2}`);
  }

  /**
   * Create the tooltip the graph.
   * @returns {void}
   * @param {array} [keys=[]] - the keys to retrieve X Y values
   * @param {array} [labels=[]] - the labels of the tooltip
   */
  makeTooltip(keys = [], labels = []) {
    let keyX = this.keyX;
    let keyY = this.keyY;
    let labelX = this.xAxisOptions.label.value;
    let labelY = this.yAxisOptions.label.value;

    // Possibly override keys and labels for tooltip
    if (keys.length > 0 && labels.length > 0) {
      keyX = keys[0];
      keyY = keys[1];
      labelX = labels[0];
      labelY = labels[1];
    }

    this.tooltip = d3.tip()
      .attr('class', `${this.classElement} igj-tip`)
      .offset((d) => {
        let out = {};
        const offset = [0, 0];
        if (keys.length > 0) {
          out = isOut(this.x(d.outerKey), this.y(_.get(d, keyY)),
            this.config.width, this.config.height);
        } else {
          out = isOut(this.x(_.get(d, keyX)), this.y(_.get(d, keyY)),
            this.config.width, this.config.height);
        }
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
        let out = {};
        if (keys.length > 0) {
          out = isOut(this.x(d.outerKey), this.y(_.get(d, keyY)),
            this.config.width, this.config.height);
        } else {
          out = isOut(this.x(_.get(d, keyX)), this.y(_.get(d, keyY)),
            this.config.width, this.config.height);
        }
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
      .html((d) => {
        let res = '';
        if (this.config.axis.x.scale.type === 'scaleTime') {
          res = `
            <strong>${labelX}:</strong>
            ${d3.timeFormat(this.config.axis.x.scale.format)(_.get(d, keyX))}</br>
          `;
        } else {
          res = `
              <strong>${labelX}:</strong>
              ${_.get(d, keyX)}</br>`;
        }
        res += `
          <strong>${labelY}:</strong>
          ${_.get(d, keyY)} `;
        return res;
      });

    // Register the tooltip to the graph
    this.svg.call(this.tooltip);
  }

  /**
   * Enable zoom in the graph.
   * @param {function} f - the zoom handler function.
   * @returns {void}
   */
  enableZoom(f) {
    // Define path to clip content when zooming
    this.svg
      .append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('transform', 'translate(-5, -5)')
      .attr('width', this.config.width + this.config.margin.right)
      .attr('height', this.config.height + this.marginVertical);

    this.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [this.config.width, this.config.height]])
      .extent([[0, 0], [this.config.width, this.config.height]])
      .on('zoom', f);

    d3.select(`.${this.classElement}`).select('g')
      .call(this.zoom);
  }

  /**
    * Listen to window resizing.
    * @param {function} f - the window resize handler function.
    * @returns {void}
    */
  scaleOnResize(f) {
    Graph.resizeHandlers.push(f);
    d3.select(window).on('resize', () => {
      Graph.resizeHandlers.forEach(h => h());
    });
  }

  /**
   * Create the gridlines for the horizontal axis.
   * @param {function} [scale = this.x] - The X axis scale.
   * @return {function} - The gridlines of the X axis.
   */
  makeGridlinesX(scale = this.x) {
    const gridlinesX = d3.axisBottom(scale)
      .tickSize(-this.config.height)
      .tickFormat('');

    if (this.config.width < this.breakPointX) {
      if (this.config.axis.x.scale.type === 'scaleTime') {
        gridlinesX.ticks(d3[this.config.axis.x.scale.interval]);
      } else {
        gridlinesX.tickValues(scale.domain().filter((d, i) => !(i % 3)));
      }
    }
    return gridlinesX;
  }

  /**
   * Create the gridlines for the vertical axis.
   * @param {function} [scale = this.y] - The Y axis scale.
   * @return {function} - The gridlines of the Y axis.
   */
  makeGridlinesY(scale = this.y) {
    const gridlinesY = d3.axisLeft(scale)
      .ticks(null)
      .tickSize(-this.config.width)
      .tickFormat('');

    if (this.config.height < this.breakPointY) {
      const maxY = scale.domain()[1];
      gridlinesY.tickValues(
        [0, Math.round(0.25 * maxY), Math.round(0.5 * maxY), Math.round(0.75 * maxY), maxY]
      );
    }
    return gridlinesY;
  }
}

// Create a static member for registering resize event handlers
Graph.resizeHandlers = [];

export default Graph;
