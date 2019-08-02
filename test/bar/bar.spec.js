/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/* eslint-disable */
import testData from '../data/data';
import BarGraph from '../../src/bar/bar';
import { BarGraphConfig } from '../../src/config';

let graph = {};
const data = testData.bar;
const dataUpdate = testData.barUpdate;
const conf = BarGraphConfig.other;
const title = conf.title.value;
const labelX = conf.axis.x.options.label.value;
const labelY = conf.axis.y.options.label.value;
const marginVertical = conf.margin.top + conf.margin.bottom;
const testWidth = 600;
const testHeight = 450;
const className = 'count_per_country';
const style = `width: ${testWidth}px; height: ${testHeight}px;`;

describe('D3 Bar initial render', () => {

  function getSVG() {
    return d3.select(`.${className}`).select('svg');
  }

  function getAxis(n) {
    return d3.select(`.${className}`).select('svg').select(`.igj-axis${n}`);
  }

  function getBars() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-bar');
  }

  function getGrid(n) {
    return d3.select(`.${className}`).select('svg').select(`.igj-grid${n}`);
  }

  function getTitle() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-title');
  }

  function getLabel(n) {
    return d3.select(`.${className}`).select('svg').selectAll(`.igj-label${n}`);
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
      const fixture = `<div class="${className}" style="${style}"></div>`;
      const customConfig = {
        axis: {
          x: {
            options: {
              label: {
                visible: true
              }
            }
          },
          y: {
            options: {
              label: {
                visible: true
              }
            }
          }
        }
      }
      document.getElementsByTagName('body')[0].innerHTML += fixture;
      graph = new BarGraph(data, className, customConfig);
      spyOn(graph, 'update');
      graph.render();
      setTimeout(() => {
        done();
      }, 750);
  });

  it('should contain an SVG element', () => {
    expect(getSVG().node()).not.toBe(null);
  });

  it('should create X and Y gridlines', () => {
    expect(getGrid('X').size()).toEqual(1);
    expect(getGrid('Y').size()).toEqual(1);
  });

  it('should create X and Y labels', () => {
    expect(getLabel('X').node().textContent).toContain(labelX);
    expect(getLabel('Y').node().textContent).toContain(labelY);
  });

  it('should create X and Y axis', () => {
    expect(getAxis('X').size()).toEqual(1);
    expect(getAxis('Y').size()).toEqual(1);
  });

  it('should create 5 bars with correct height', () => {
    let yScale = graph.getYScale();
    expect(getBars().size()).toEqual(5);
    parseData(data).forEach((d, i) => {
      const bars = d3.select(`.${className}`).select('svg').selectAll(`.igj-bar.bar_${i}`);
      for (let idx = 0 ; idx < d.data.length; idx++) {
        expect(+bars.nodes()[idx].getAttribute('height'))
          .toEqual(testHeight - marginVertical - yScale(d.data[idx].value));
      }
    })
  });

  it('should listen to mouseover/mouseout events', () => {
    const tooltip = d3.select('body').select('.igj-tip').node();

    // The MouseEvent() constructor is not supported in PhantomJS
    // const event1 = new MouseEvent('mouseover');
    // Using initMouseEvent() instead - deprecated
    const event1 = document.createEvent('MouseEvent');
    event1.initMouseEvent('mouseover', true, true, window);
    getBars().nodes()[0].dispatchEvent(event1);
    expect(+tooltip.style.opacity).toEqual(1);

    // The MouseEvent() constructor is not supported in PhantomJS
    // const event2 = new MouseEvent('mouseout');
    // Using initMouseEvent() instead - deprecated
    const event2 = document.createEvent('MouseEvent');
    event2.initMouseEvent('mouseout', true, true, window);
    getBars().nodes()[0].dispatchEvent(event2);
    expect(+tooltip.style.opacity).toEqual(0);
  });

  it('should listen to zoom event', () => {
    // The MouseEvent() constructor is not supported in PhantomJS
    // const event = new MouseEvent('wheel');
    // Using initMouseEvent() instead - deprecated
    const event = document.createEvent('MouseEvent');
    event.initMouseEvent('wheel', true, true, window);
    getBars().nodes()[0].dispatchEvent(event);
    expect(graph.update).toHaveBeenCalled();
  });

  describe('D3 Bar update', () => {
    beforeAll(done => {
      graph.update(dataUpdate);
      setTimeout(() => {
        done();
      }, 750);
    });

    it('should call update', function() {
      expect(graph.update).toHaveBeenCalledWith(dataUpdate);
    });
  });

  afterAll(function() {
    d3.select(`${className}`).selectAll('svg').remove();
  });
});
