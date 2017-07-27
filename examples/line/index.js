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
import dataCDS from '../data/data';
import { LineGraph } from '../../src/index';

const cfg1 = config.pageviewsVideosInterval1month;
const data1 = dataCDS.pageviewsVideosInterval1month;
const data1Update = dataCDS.pageviewsVideosInterval1monthUpdate;
const class1 = 'pageviews_month';
// const cfg2 = config.downloadVideosInterval1day;
// const data2 = dataCDS.downloadVideosInterval1day;
// const class2 = 'downloads_day';

// LineGraph 1
const g1 = new LineGraph(cfg1, data1, class1);
g1.render();
setTimeout(() => g1.update(data1Update), 3000);

// LineGraph 2
// const g2 = new LineGraph(cfg2, data2, class2);
// g2.render();
