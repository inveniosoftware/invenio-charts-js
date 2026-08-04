/*
 * SPDX-FileCopyrightText: 2017 CERN.
 * SPDX-License-Identifier: MIT
 */

import dataCDS from '../data/data';
import { GroupedBarGraph } from '../../src/index';

// Initialize parameters
const data = dataCDS.response3;
const elementClass = 'grouped-bar-graph';

// Grouped Bar Graph
new GroupedBarGraph(data, elementClass).render();
