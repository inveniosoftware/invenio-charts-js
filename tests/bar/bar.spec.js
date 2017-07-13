/* eslint-disable */
import BarGraph from '../../src/bar/bar';
import config from '../../examples/bar/config';
import { barData } from '../data/data';

describe('D3 bar testing', () => {

  function getBars() {
    return !d3.select('.container').select('g').selectAll('rect.bar').empty();
  };

  function getAxis() {
    return !d3.select('.x.axis').empty() && !d3.select('.y.axis').empty();
  }

  beforeAll(done => {
    setTimeout(() => {
      const graph = new BarGraph(config);
      const barSVG = graph.render(barData);
      done();
    }, 750);
  });

  afterAll(() => {
    d3.selectAll('svg').remove();
  });

  it('should have bars', () => {
    expect(getBars()).toBe(true);
  });

  it('should have X and Y axis', () => {
    expect(getAxis()).toBe(true);
  });

});
