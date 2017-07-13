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
   * Render an empty SVG element to the DOM.
   * @return {Object} The SVG container element.
   */
  render() {
    return d3.select('body')
      .append('svg')
      .attr('class', 'container')
      .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
      .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);
  }
}

export default Graph;
