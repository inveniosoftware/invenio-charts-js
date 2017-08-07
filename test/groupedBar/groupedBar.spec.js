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
import GroupedBarGraph from '../../src/groupedBar/groupedBar';
import config from '../../examples/groupedBar/config';
// import validSVG from './validator';

let graph = {};
const data = testData.groupedBar;
const dataUpdate = testData.groupedBarUpdate;
const conf = config.other;
const title = conf.title.value;
const labelX = conf.axis.x.options.label.value;
const labelY = conf.axis.y.options.label.value;
const testWidth = 600;
const testHeight = 450;
const className = 'multi_country';
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
      let fixture = `<div class="${className}" style="${style}"></div>`;
      document.getElementsByTagName('body')[0].innerHTML += fixture;
      graph = new GroupedBarGraph(conf, data, className);
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
