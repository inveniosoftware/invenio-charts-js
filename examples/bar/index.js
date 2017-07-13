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

import _ from 'lodash';
import config from './config';
import './styles.scss';
import { BarGraph } from '../../src/index';
import { barData1, barData2 } from '../data/data';

let data1 = _.cloneDeep(barData1);
let data2 = _.cloneDeep(barData2);
let toggle = true;

const graph = new BarGraph(config);
graph.render(data1);

function update() {
  toggle = !toggle;
  if (toggle) {
    data1 = _.cloneDeep(barData1);
    graph.render(data1);
  } else {
    data2 = _.cloneDeep(barData2);
    graph.render(data2);
  }
}

if (document.getElementById('option')) {
  document.getElementById('option').addEventListener('click', update);
}
