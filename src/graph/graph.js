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
import isOut from '../util/util';

require('d3-extended')(d3);

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

    // Margin constants
    this.marginHorizontal = this.config.margin.left + this.config.margin.right;
    this.marginVertical = this.config.margin.top + this.config.margin.bottom;

    // Get axis configuration
    this.xAxisOptions = this.config.axis.x.options;
    this.yAxisOptions = this.config.axis.y.options;

    // Breakpoints for resizing
    this.breakPointX = this.config.resize.breakPointX;
    this.breakPointY = this.config.resize.breakPointY;
  }

  /**
   * Get the type of the graph.
   * @return {string} The type value.
   */
  getType() {
    return this.config.type;
  }

  /**
   * Get the scale of the horizontal axis.
   * @return {Function} - The the scale of the X axis.
   */
  getXScale() {
    return this.x;
  }

  /**
   * Get the scale of the vertical axis.
   * @return {Function} - The the scale of the Y axis.
   */
  getYScale() {
    return this.y;
  }

  /**
   * Append an empty SVG element to the DOM.
   */
  initialize() {
    let element = d3.select(`.${this.classElement}`);

    // Check if the specified element exists
    if (element.empty()) {
      element = d3.select('body')
        .append('div')
        .attr('class', `${this.classElement}`)
        .attr('style', 'width: 100vw; height:80vh;');
    }

    const father = element.node().getBoundingClientRect();

    // Calculate the dimensions of the SVG
    this.config.width = father.width - this.marginHorizontal;
    this.config.height = father.height - this.marginHorizontal;

    if (element.select('svg').empty()) {
      this.svg = element
        .append('svg')
        .attr('class', `${this.classElement}`)
        .attr('width', father.width)
        .attr('height', father.height)
        .append('g')
        .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);
    } else {
      this.svg = element.select('svg')
        .attr('width', father.width)
        .attr('height', father.height);
    }
  }

  /**
   * Update the input data
   */
  updateInput(newInput) {
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
  makeAxisX(padding = 0, x0) {
    // Create the scale for the X axis
    if (typeof (x0) !== 'undefined') {
      this.x = x0;
    } else {
      this.x = d3[this.config.axis.x.scale.type]()
        .range([0, this.config.width]);
    }

    // Add range and domain to the X axis
    if (this.config.axis.x.scale.type === 'scaleTime') {
      this.x.domain(d3.extent(this.input[0].data, d => _.get(d, this.keyX)));
      this.x.nice((2 * this.input[0].data.length));
    } else {
      this.x.domain(this.input[0].data.map(d => _.get(d, this.keyX)));
      this.x.padding(padding);
    }

    // Create the (horizontal) X Axis
    this.xAxis = d3.axisBottom(this.x);

    if (this.config.axis.x.scale.type === 'scaleTime') {
      if (this.config.width > this.breakPointX) {
        this.xAxis.ticks(this.xAxisOptions.ticks.number);
      } else {
        this.xAxis.ticks(d3.select(`.${this.classElement}`)
          .selectAll('g.igj-axisX g.tick text').size() / 2);
      }
      this.xAxis.tickFormat(d3.timeFormat(this.config.axis.x.scale.format));
    } else {
      this.xAxis.tickValues(
        this.x.domain().filter((d, i) => !(i % this.xAxisOptions.ticks.number)));
    }

    // Add the X Axis to the container element
    let axisX = d3.select(`.${this.classElement}`).select('.igj-axisX');
    if (axisX.empty()) {
      axisX = this.svg.append('g')
        .attr('class', 'igj-axisX')
        .call(this.xAxis);
    } else {
      axisX
        .transition()
        .delay(50)
        .duration(450)
        .call(this.xAxis);
    }
    // Place the X axis at the bottom of the graph
    axisX.attr('transform', `translate(0, ${this.config.height})`);

    // If specified, add gridlines along the X axis
    if (this.xAxisOptions.gridlines) {
      let gridX = d3.select(`.${this.classElement}`).select('.igj-gridX');
      if (gridX.empty()) {
        gridX = this.svg.append('g')
          .attr('class', 'igj-gridX')
          .call(this.makeGridlinesX(this.x));
      } else {
        gridX
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesX(this.x))
          .style('stroke-opacity', 0.7);
      }
      // Place the X gridlines at the bottom of the graph
      gridX.attr('transform', `translate(0, ${this.config.height})`);
    }

    // If specified, rotate the tick labels
    if (this.xAxisOptions.tickLabels.rotated) {
      d3.select(`.${this.classElement}`).selectAll('g.igj-axisX g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.8em')
        .attr('dy', '.85em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the X Axis
    if (this.xAxisOptions.label.visible) {
      let xAxisLabel = d3.select(`.${this.classElement}`).select('.igj-labelX');
      if (xAxisLabel.empty()) {
        xAxisLabel = this.svg.append('text')
          .attr('class', 'igj-labelX')
          .text(this.xAxisOptions.label.value)
          .attr('text-anchor', 'middle');
      }
      xAxisLabel
        .transition()
        .delay(100)
        .duration(250)
        .text(this.xAxisOptions.label.value)
        .attr('x', `${this.config.width / 2}`)
        .attr('y', `${this.config.height + (this.config.margin.bottom / 2)}`);
    }

    // If specified, hide the X axis line
    if (!this.xAxisOptions.line.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!this.xAxisOptions.ticks.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!this.xAxisOptions.tickLabels.visible) {
      d3.select(`.${this.classElement}`).selectAll('.igj-axisX g.tick text')
        .attr('style', 'display: none;');
    }
  }

  /**
   * Create the Y axis of the graph.
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
    this.yAxis = d3.axisLeft(this.y).tickPadding(5);

    if (this.config.height > this.breakPointY) {
      this.yAxis.ticks(this.yAxisOptions.ticks.number, 's');
    } else {
      this.yAxis.ticks(d3.select(`.${this.classElement}`)
        .selectAll('g.igj-axisY g.tick text').size() / 2, 's');
    }

    // Add the Y Axis to the container element
    let yAxis = d3.select(`.${this.classElement}`).select('.igj-axisY');
    if (yAxis.empty()) {
      yAxis = this.svg.append('g')
        .attr('class', 'igj-axisY')
        .call(this.yAxis);
    } else {
      yAxis
        .transition()
        .delay(50)
        .duration(450)
        .call(this.yAxis);
    }

    // If specified, add gridlines along the Y axis
    if (this.yAxisOptions.gridlines) {
      let gridY = d3.select(`.${this.classElement}`).select('.igj-gridY');
      if (gridY.empty()) {
        gridY = this.svg.append('g')
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

    // If specified, rotate the tick labels
    if (this.yAxisOptions.tickLabels.rotated) {
      d3.select(`.${this.classElement}`).selectAll('g.igj-axisY g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.85em')
        .attr('dy', '.25em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, add label to the Y Axis
    if (this.yAxisOptions.label.visible) {
      let yAxisLabel = d3.select(`.${this.classElement}`).select('.igj-labelY');
      if (yAxisLabel.empty()) {
        yAxisLabel = this.svg.append('text')
          .attr('class', 'igj-labelY')
          .text(this.yAxisOptions.label.value);
      }
      yAxisLabel
        .attr('transform',
          `translate(${-this.config.margin.left},
          ${(this.config.height / 2)})rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.70em');
    }

    // If specified, hide the Y axis line
    if (!this.yAxisOptions.line.visible) {
      yAxis.selectAll('path').attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!this.yAxisOptions.ticks.visible) {
      yAxis.selectAll('g.tick line').attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!this.yAxisOptions.tickLabels.visible) {
      yAxis.selectAll('g.tick text').attr('style', 'display: none;');
    }
  }

  /**
   * Create the legend of the graph.
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
      const colorLegend = legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(200)())
        .orient(this.config.legend.position === 'bottom' ? 'horizontal' : 'vertical')
        .shapePadding(this.config.legend.position === 'bottom' ? 40 : 15)
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
            .duration(200)
            .ease(d3.easeLinear)
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
          .attr('transform', `translate(
            ${(this.config.width - legendBox.width) / 2},
            ${this.config.height + (this.config.margin.bottom / 2)}
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
      const graphTitle = d3.select(`.${this.classElement}`).select('.igj-title');
      if (graphTitle.empty()) {
        this.svg.append('text')
          .attr('x', this.config.width / 2)
          .attr('y', -(this.config.margin.top / 1.8))
          .attr('class', 'igj-title')
          .attr('text-anchor', 'middle')
          .text(this.config.title.value);
      } else {
        graphTitle
          .text(this.config.title.value)
          .transition()
          .duration(250)
          .attr('x', `${this.config.width / 2}`);
      }
    }
  }

  /**
   * Create the tooltip the graph.
   */
  makeTooltip(
    keyX = this.keyX,
    keyY = this.keyY,
    labelX = this.xAxisOptions.label.value,
    labelY = this.xAxisOptions.label.value) {
    this.tooltip = d3.tip()
      .attr('class', `${this.classElement} igj-tip`)
      .offset((d) => {
        const offset = [0, 0];
        const out = isOut(this.x(_.get(d, keyX)), this.y(_.get(d, keyY)),
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
        const out = isOut(this.x(_.get(d, keyX)), this.y(_.get(d, keyY)),
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
   */
  enableZoom(f) {
    // Create the scale for the zoom on X axis
    this.altX = this.x;

    // Define clip path to focus on domain
    this.svg
      .append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('transform', 'translate(-5, -5)')
      .attr('width', this.config.width + this.marginHorizontal)
      .attr('height', this.config.height + this.marginVertical);

    this.zoom = d3.zoom()
      .scaleExtent([1, 16])
      .translateExtent([[0, 0], [this.config.width, this.config.height]])
      .extent([[0, 0], [this.config.width, this.config.height]])
      .on('zoom', f);

    d3.select(`.${this.classElement}`).select('g')
      .call(this.zoom);
  }

  /**
    * Listen to window resizing.
    */
  scaleOnResize(f) {
    d3.select(window).on('resize', f);
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
      if (this.config.width > this.breakPointX) {
        gridlinesX.ticks(this.config.axis.x.options.ticks.number);
      } else {
        gridlinesX.ticks(d3.select(`.${this.classElement}`)
          .selectAll('g.igj-axisX g.tick text').size() / 2);
      }
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
      .tickFormat(this.config.axis.y.options.ticks.format);

    if (this.config.height > this.breakPointY) {
      gridlinesY.ticks(this.config.axis.y.options.ticks.number);
    } else {
      gridlinesY.ticks(d3.select(`.${this.classElement}`)
        .selectAll('g.igj-axisY g.tick text').size() / 2);
    }
    return gridlinesY;
  }
}

export default Graph;
