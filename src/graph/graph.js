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

/** Class representing an abstract Graph. */
class Graph {
  /**
   * Create a graph.
   * @param {Object} config - The configuration of the graph.
   */
  constructor(config) {
    this.config = config;

    // Get the keys for the X, Y axis
    this.keyX = this.config.axis.x.mapTo;
    this.keyY = this.config.axis.y.mapTo;
  }

  /**
   * Get the type of the graph.
   * @return {string} The type value.
   */
  getType() {
    return this.config.type;
  }

  /**
   * Get the type of the graph.
   * @return {number} The area value.
   */
  getArea() {
    return this.config.height * this.config.width;
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

  /**
   * Render an empty SVG element to the DOM.
   * @param {String} - The class of the SVG element.
   * @return {Object} - The SVG container element.
   */
  initialize(classElement) {
    return d3.select('body')
      .append('svg')
      .attr('class', `${classElement}`)
      .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
      .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);
  }
}

export default Graph;
