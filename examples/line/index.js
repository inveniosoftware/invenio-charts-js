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

import './styles.scss';
import config from './config';
import dataCDS from '../data/data-cds';
import { LineGraph } from '../../src/index';

let toggle = true;

const graphPageviews2 = new LineGraph(config.pageviewsVideosInterval1month);
graphPageviews2.render(dataCDS.pageviewsVIdeosInterval1month0, 'pageviews_month');

const graphPageviews = new LineGraph(config.pageviewsVideosInterval1day);
graphPageviews.render(dataCDS.pageviewsVideosInterval1day, 'pageviews_day');

const graphDownloads = new LineGraph(config.downloadVideosInterval1day);
graphDownloads.render(dataCDS.downloadVideosInterval1day, 'downloads');

function update() {
  toggle = !toggle;
  if (toggle) {
    graphPageviews2.render(dataCDS.pageviewsVIdeosInterval1month0, 'pageviews_month');
  } else {
    graphPageviews2.render(dataCDS.pageviewsVIdeosInterval1month1, 'pageviews_month');
  }
}

if (document.getElementById('toggle')) {
  document.getElementById('toggle').addEventListener('click', update);
}
