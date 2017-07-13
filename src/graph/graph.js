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
