/*
 * SPDX-FileCopyrightText: 2017 CERN.
 * SPDX-License-Identifier: MIT
 */

import dataCDS from '../data/data';
import { LineGraph } from '../../src/index';

// Initialize parameters
const data = dataCDS.response1;
const elementClass = 'line-graph';

// Line Graph
new LineGraph(data, elementClass).render();
