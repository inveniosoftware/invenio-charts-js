/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import dataCDS from '../data/data';
import { LineGraph } from '../../src/index';

// Initialize parameters
const data = dataCDS.response1;
const elementClass = 'line-graph';

// Line Graph
new LineGraph(data, elementClass).render();
