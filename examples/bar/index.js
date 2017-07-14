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
import './styles.scss';
import config from './config';
import dataCDS from '../data/data-cds';
import { BarGraph } from '../../src/index';

console.log(dataCDS);

let toggle = true;
const d1 = _.cloneDeep(dataCDS.pageviewsVideosPerCountry);
const d2 = dataCDS.pageviewsVideosPerCountry.filter((d, i) => i % 2);

const pageviewsPerCountry = new BarGraph(config.pageviewsVideosPerCountry);
pageviewsPerCountry.render(dataCDS.pageviewsVideosPerCountry, 'pageviews');

function update() {
  toggle = !toggle;
  if (toggle) {
    pageviewsPerCountry.render(d1, 'pageviews');
  } else {
    pageviewsPerCountry.render(d2, 'pageviews');
  }
}

if (document.getElementById('toggle')) {
  document.getElementById('toggle').addEventListener('click', update);
}
