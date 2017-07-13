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
