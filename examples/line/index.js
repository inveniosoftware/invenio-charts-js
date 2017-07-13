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
import { LineGraph } from '../../src/index';
import { lineData1, lineData2 } from '../data/data';

let arr1 = _.cloneDeep(lineData1);
let arr2 = _.cloneDeep(lineData2);
let toggle = true;

const graph = new LineGraph(config);
graph.render(arr1);

function update() {
  toggle = !toggle;
  if (toggle) {
    arr1 = _.cloneDeep(lineData1);
    graph.render(arr1);
  } else {
    arr2 = _.cloneDeep(lineData2);
    graph.render(arr2);
  }
}

if (document.getElementById('option')) {
  document.getElementById('option').addEventListener('click', update);
}
