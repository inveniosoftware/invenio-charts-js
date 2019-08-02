/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/* eslint-disable */
import testData from '../data/data';
import GroupedBarGraph from '../../src/groupedBar/groupedBar';
import { GroupedBarGraphConfig } from '../../src/config';

let graph = {};
const data = testData.groupedBar;
const dataUpdate = testData.groupedBarUpdate;
const conf = GroupedBarGraphConfig.other;
const title = conf.title.value;
const labelX = conf.axis.x.options.label.value;
const labelY = conf.axis.y.options.label.value;
const testWidth = 600;
const testHeight = 450;
const className = 'stats_per_country';
const style = `width: ${testWidth}px; height: ${testHeight}px;`;

describe('D3 GroupedBar initial render', () => {

  function getSVG() {
    return d3.select(`.${className}`).select('svg');
  }

  function getAxis(n) {
    return d3.select(`.${className}`).select('svg').select(`.igj-axis${n}`);
  }

  function getBars() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-bar');
  }

  function getBarsOfGroup(el) {
    return d3.select(el).selectAll('.igj-bar');
  }

  function getGroups() {
    return d3.select(`.${className}`).select('svg').selectAll('.igj-group');
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
        },
        title: {
          visible: true
        }
      }
      document.getElementsByTagName('body')[0].innerHTML += fixture;
      graph = new GroupedBarGraph(data, className, customConfig);
      graph.render();
      setTimeout(() => {
        done();
      }, 750);
  });

  // Only succeeds in Chrome browser
  // it('should create a specific SVG element', () => {
  //   expect(getSVG().node().parentNode.innerHTML).toBe(validSVG);
  // });

  it('should contain an SVG element', () => {
    expect(getSVG().node()).not.toBe(null);
  });

  it('should create X and Y gridlines', () => {
    expect(getGrid('Y').size()).toEqual(1);
  });

  it('should create title', () => {
    expect(getTitle().node().textContent).toContain(title);
  });

  it('should create X and Y labels', () => {
    expect(getLabel('X').node().textContent).toContain(labelX);
    expect(getLabel('Y').node().textContent).toContain(labelY);
  });

  it('should create X and Y axis', () => {
    expect(getAxis('X').size()).toEqual(1);
    expect(getAxis('Y').size()).toEqual(1);
  });

  it('should create 3 groups with 5 bars each', () => {
    const yScale = graph.getYScale();
    const barGroups = getGroups().nodes();
    expect(getGroups().size()).toEqual(5);
    barGroups.forEach(d => expect(getBarsOfGroup(d).size()).toEqual(3));
    // data.forEach((d, i) => {
    //   const bars = d3.select(`.${className}`).select('svg').selectAll(`.igj-bar.bar_${i}`);
    //   for (let idx = 0 ; idx < d.data.length; idx++) {
    //     expect(+bars.nodes()[idx].getAttribute('height'))
    //       .toEqual(testHeight - conf.margin.top - conf.margin.bottom - yScale(d.data[idx].value));
    //   }
    // })
  });

  describe('D3 Bar update', () => {
    beforeAll(done => {
      spyOn(graph, 'update');
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
