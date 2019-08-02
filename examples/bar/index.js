/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import dataCDS from '../data/data';
import { BarGraph } from '../../src/index';

// Initialize parameters
const data = dataCDS.response2;
const elementClass = 'bar-graph';

// Bar Graph
new BarGraph(data, elementClass).render();
