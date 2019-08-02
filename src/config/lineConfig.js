/*
 * This file is part of Invenio.
 * Copyright (C) 2017-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

// Export default configuration object
const LineGraphConfig = {};

// For keyType : date
LineGraphConfig.date = {
  graph: {
    type: 'line',
    options: {
      curveType: 'curveLinear',
      fillArea: true,
      circles: {
        visible: true,
        radius: 5
      }
    }
  },
  margin: {
    top: 40,
    right: 30,
    bottom: 75,
    left: 60
  },
  axis: {
    x: {
      mapTo: 'key',
      scale: {
        type: 'scaleTime',
        interval: 'timeWeek',
        format: '%d %b %Y'
      },
      options: {
        padding: 1,
        label: {
          value: 'Date',
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
  colorScale: 'schemeCategory10',
  tooltip: {
    enabled: true
  },
  legend: {
    visible: true,
    position: 'bottom'
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

// For keyType : other
LineGraphConfig.other = {
  graph: {
    type: 'line',
    options: {
      curveType: 'curveLinear',
      fillArea: true,
      circles: {
        visible: true,
        radius: 5
      }
    }
  },
  margin: {
    top: 40,
    right: 30,
    bottom: 75,
    left: 60
  },
  axis: {
    x: {
      mapTo: 'key',
      scale: {
        type: 'scaleBand',
        padding: 0.2,
        format: null
      },
      options: {
        padding: 0,
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
        format: null
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
  colorScale: 'schemeCategory10',
  tooltip: {
    enabled: true
  },
  legend: {
    visible: true,
    position: 'bottom'
  },
  zoom: {
    enabled: false
  },
  resize: {
    enabled: true,
    breakPointX: 550,
    breakPointY: 275
  }
};

export default LineGraphConfig;
