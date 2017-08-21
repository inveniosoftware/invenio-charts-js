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

/* eslint-disable */
import testData from '../data/data';
import LineGraph from '../../src/line/line';
import { LineGraphConfig } from '../../src/config';

let graph = {};
const data = testData.line;
const dataUpdate = testData.lineUpdate;
const conf = LineGraphConfig.date;
const title = conf.title.value;
const testWidth = 600;
const testHeight = 450;
const className = 'stats_per_week';
const style = `width: ${testWidth}px; height: ${testHeight}px;`;

describe('D3 Line initial render', () => {
  function getSVG() {
    return d3.select(`.${className}`).select('svg');
  }

  function getAxis(n) {
    return d3.select(`.${className}`).select('svg').select(`.igj-axis${n}`);
  }

  function getAreas() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-area');
  }

  function getCircles() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-dot');
  }

  function getLines() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-line');
  }

  function getTitle() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-title');
  }

  function getLegend() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-legend');
  }

  function getGrid(n) {
    return d3.select(`.${className}`).select('svg').select(`.igj-grid${n}`);
  }

  function parseData(originalData) {
    const parsed = [];
    Object.keys(originalData).forEach((k) => {
      const obj = {};
      obj.label = k;
      obj.data = originalData[k].buckets;
      parsed.push(obj);
    });
    return parsed;
  }

  beforeAll(done => {
      const fixture = `<div class='${className}' style='${style}'></div>`;
      const customConfig = {
        title: {
          visible: true
        }
      }
      document.getElementsByTagName('body')[0].innerHTML += fixture;

      graph = new LineGraph(data, className,customConfig);
      spyOn(graph, 'update');
      graph.render();
      setTimeout(() => {
        done();
      }, 500);
  });

  it('should contain an SVG element', () => {
    expect(getSVG().node()).not.toBe(null);
  });

  it('should create two line paths', () => {
    expect(getLines().size()).toEqual(2);
  });

  it('should create two area paths', () => {
    expect(getAreas().size()).toEqual(2);
  });

  it('should create legend', () => {
    expect(getLegend().size()).toEqual(1);
  });

  it('should create title', () => {
    expect(getTitle().node().textContent).toContain(title);
  });

  it('should create X and Y axis', () => {
    expect(getAxis('X').size()).toEqual(1);
    expect(getAxis('Y').size()).toEqual(1);
  });

  it('should create X and Y gridlines', () => {
    expect(getGrid('X').size()).toEqual(1);
    expect(getGrid('Y').size()).toEqual(1);
  });

  it('should create circles at correct points', () => {
    let xScale = graph.getXScale();
    let yScale = graph.getYScale();
    let parsed = parseData(data);
    expect(getCircles().size()).toEqual(2 * parsed[0].data.length);
    parsed.forEach((d, i) => {
      let circles = d3.select(`.${className}`).select('svg').selectAll(`.igj-dot.dot_${i}`);
      for (let idx = 0 ; idx < d.data.length; idx++) {
        expect(xScale(d.data[idx].key)).toEqual(+circles.nodes()[idx].getAttribute('cx'));
        expect(yScale(d.data[idx].value)).toEqual(+circles.nodes()[idx].getAttribute('cy'));
      }
    });
  });

  it('should listen to mousemove event', () => {
    // The MouseEvent() constructor is not supported in PhantomJS
    // const event = new MouseEvent('mousemove');
    // Using initMouseEvent() instead - deprecated
    const event = document.createEvent('MouseEvent');
    event.initMouseEvent('mousemove', true, true, window);
    getSVG().select('g').node().dispatchEvent(event);
  });

  it('should listen to mouseover/mouseout events', () => {
    const focusElement = getSVG().select('.igj-focus').node();
    const tooltip = d3.select('body').select('.igj-tip').node();

    // The MouseEvent() constructor is not supported in PhantomJS
    // const event1 = new MouseEvent('mouseover');
    // Using initMouseEvent() instead - deprecated
    const event1 = document.createEvent('MouseEvent');
    event1.initMouseEvent('mouseover', true, true, window);
    getCircles().nodes()[0].dispatchEvent(event1);
    expect(focusElement.style.display).toEqual('');
    // expect(+tooltip.style.opacity).toEqual(1);

    // The MouseEvent() constructor is not supported in PhantomJS
    // const event2 = new MouseEvent('mouseout');
    // Using initMouseEvent() instead - deprecated
    const event2 = document.createEvent('MouseEvent');
    event2.initMouseEvent('mouseout', true, true, window);
    getCircles().nodes()[0].dispatchEvent(event2);
    expect(focusElement.style.display).toEqual('none');
    // expect(+tooltip.style.opacity).toEqual(0);
  });

  it('should listen to zoom event', () => {
    // The MouseEvent() constructor is not supported in PhantomJS
    // const event = new MouseEvent('wheel');
    // Using initMouseEvent() instead - deprecated
    const event = document.createEvent('MouseEvent');
    event.initMouseEvent('wheel', true, true, window);
    getCircles().nodes()[0].dispatchEvent(event);
    expect(graph.update).toHaveBeenCalled();
  });

  it('should listen to legend click event', () => {
    // The MouseEvent() constructor is not supported in PhantomJS
    // const event = new MouseEvent('wheel');
    // Using initMouseEvent() instead - deprecated
    const event = document.createEvent('MouseEvent');
    event.initMouseEvent('click', true, true, window);
    getLegend().selectAll('.cell').nodes()[0].dispatchEvent(event);
  });

  describe('D3 Line update', () => {
    beforeAll(done => {
      let parsedUpdate = parseData(dataUpdate);
      graph.update(parsedUpdate);
      setTimeout(() => {
        done();
      }, 500);
    });

    it('should call update', function() {
      let parsedUpdate = parseData(dataUpdate);
      expect(graph.update).toHaveBeenCalledWith(parsedUpdate);
    });
  });

  afterAll(function() {
    d3.select(`${className}`).selectAll('svg').remove();
  });
});
