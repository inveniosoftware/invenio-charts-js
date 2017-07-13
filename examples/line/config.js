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

// Export configuration object
const config = {
  width: 800,
  height: 400,
  margin: {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  graph: {
    type: 'line',
    options: {
      curved: true,
      curveType: 'curveCardinal',
      fillArea: true,
      fillAreaColor: '#E8F5E9'
    }
  },
  axis: {
    x: {
      mapTo: 'date',
      scaleType: 'scaleTime',
      ticks: 5,
      ticksFormat: '',
      visible: false
    },
    y: {
      mapTo: 'value',
      scaleType: 'scaleLinear',
      ticks: 5,
      ticksFormat: '',
      visible: false
    }
  },
  data: module.exports.myData,
  tooltip: false,
  gridlines: {
    x: true,
    y: true
  },
  title: 'Downloads',
  label: {
    x: 'Date',
    y: 'Downloads'
  },
  color: {
    scale: 'linearGradient',
    thresholds: [
      {
        offset: 0,
        value: '#4CAF50',
        opacity: 0.9
      },
      {
        offset: 100,
        value: '#C8E6C9',
        opacity: 0.9
      }
    ]
  }
};

export default config;
