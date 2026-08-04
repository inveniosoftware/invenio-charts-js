/*
 * SPDX-FileCopyrightText: 2017 CERN.
 * SPDX-License-Identifier: MIT
 */

import _ from 'lodash';

// Export default configuration object
const BarGraphConfig = {};

// For keyType : other
BarGraphConfig.other = {
  graph: {
    type: 'bar'
  },
  margin: {
    top: 50,
    right: 40,
    bottom: 70,
    left: 60
  },
  axis: {
    x: {
      mapTo: 'key',
      scale: {
        type: 'scaleBand',
        format: null
      },
      options: {
        padding: 0.05,
        label: {
          value: 'LabelX',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          visible: false
        },
        tickLabels: {
          visible: true,
          rotated: false
        },
        gridlines: true
      }
    },
    y: {
      mapTo: 'value',
      scale: {
        type: 'scaleLinear',
        format: ''
      },
      options: {
        label: {
          value: 'LabelY',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          visible: false
        },
        tickLabels: {
          visible: true,
          rotated: false
        },
        gridlines: true
      }
    }
  },
  title: {
    value: 'Title',
    visible: false
  },
  colorScale: 'schemeCategory20',
  tooltip: {
    enabled: true
  },
  legend: {
    visible: false,
    position: 'side'
  },
  zoom: {
    enabled: true
  },
  resize: {
    enabled: true,
    breakPointX: 550,
    breakPointY: 275
  }
};

// For keyType : date
BarGraphConfig.date = _.cloneDeep(BarGraphConfig.other);
BarGraphConfig.date.axis.x.scale.format = '%d %b %Y';

export default BarGraphConfig;
