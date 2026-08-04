/*
 * SPDX-FileCopyrightText: 2017 CERN.
 * SPDX-License-Identifier: MIT
 */

import dataCDS from '../data/data';
import { BarGraph } from '../../src/index';

// Initialize parameters
const data = dataCDS.response2;
const elementClass = 'bar-graph';

// Bar Graph
new BarGraph(data, elementClass).render();
