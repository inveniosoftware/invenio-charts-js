/* eslint-disable */
import LineGraph from '../../src/line/line';
import config from '../../examples/line/config';
import { lineData } from '../data/data';

describe('D3 line testing', () => {

  function getLine() {
    return !d3.select('path.line').empty();
  };

  function getAxis() {
    return !d3.select('.x.axis').empty() && !d3.select('.y.axis').empty();
  }

  beforeAll(function() {
    const graph = new LineGraph(config);
    const lineSVG = graph.render(lineData);
  });

  afterAll(function() {
    d3.selectAll('svg').remove();
  });

  it('should have a line path', () => {
    expect(getLine()).toBe(true);
  });

  it('should have X and Y axis', () => {
    expect(getAxis()).toBe(true);
  });

});
