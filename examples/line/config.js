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
const config = {};
config.downloadVideosInterval1day = {
  width: 1000,
  height: 450,
  margin: {
    top: 30,
    right: 80,
    bottom: 80,
    left: 80
  },
  graph: {
    type: 'line',
    options: {
      curveType: 'curveLinear',
      fillArea: true
    }
  },
  axis: {
    x: {
      mapTo: 'time',
      scale: {
        type: 'scaleTime',
        format: '%b-%Y'
      },
      options: {
        label: {
          value: 'Date',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: 5,
          format: '',
          visible: true
        },
        tickLabels: {
          visible: true,
          rotated: false
        },
        gridlines: false
      }
    },
    y: {
      mapTo: 'count',
      scale: {
        type: 'scaleLinear',
        format: ''
      },
      options: {
        label: {
          value: 'Downloads',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: 5,
          format: '',
          visible: true
        },
        tickLabels: {
          visible: true
        },
        gridlines: false
      }
    }
  },
  colorScale: 'schemeCategory20b',
  tooltip: false,
  legend: {
    visible: true,
    position: 'side'
  },
  circles: {
    visible: true,
    radius: 5.5
  },
  title: {
    visible: true,
    value: 'Video Downloads per day'
  }
};

config.pageviewsVideosInterval1day = {
  width: 1000,
  height: 450,
  margin: {
    top: 30,
    right: 30,
    bottom: 60,
    left: 85
  },
  graph: {
    type: 'line',
    options: {
      curveType: 'curveMonotoneX',
      fillArea: true
    }
  },
  axis: {
    x: {
      mapTo: 'time',
      scale: {
        type: 'scaleTime',
        format: '%d-%b-%y'
      },
      options: {
        label: {
          value: 'Date',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: 5,
          format: '',
          visible: false
        },
        tickLabels: {
          visible: true,
          rotated: true
        },
        gridlines: true
      }
    },
    y: {
      mapTo: 'count',
      scale: {
        type: 'scaleLinear',
        format: ''
      },
      options: {
        label: {
          value: 'Pageviews',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: 5,
          format: '',
          visible: false
        },
        tickLabels: {
          visible: true
        },
        gridlines: true
      }
    }
  },
  colorScale: 'schemeCategory10',
  tooltip: false,
  legend: {
    visible: true,
    position: 'side'
  },
  circles: {
    visible: true,
    radius: 5.5
  },
  title: {
    visible: true,
    value: 'Pageviews per day'
  }
};

config.pageviewsVideosInterval1month = {
  width: 1000,
  height: 450,
  margin: {
    top: 30,
    right: 30,
    bottom: 60,
    left: 85
  },
  graph: {
    type: 'line',
    options: {
      curveType: 'curveMonotoneX',
      fillArea: true
    }
  },
  axis: {
    x: {
      mapTo: 'time',
      scale: {
        type: 'scaleTime',
        format: '%d %b %Y'
      },
      options: {
        label: {
          value: 'Date',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: null,
          format: '',
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
      mapTo: 'count',
      scale: {
        type: 'scaleLinear',
        format: ''
      },
      options: {
        label: {
          value: 'Pageviews',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          number: null,
          format: '',
          visible: false
        },
        tickLabels: {
          visible: true
        },
        gridlines: true
      }
    }
  },
  title: {
    visible: true,
    value: 'Pageviews per month'
  },
  colorScale: 'schemeCategory10',
  tooltip: true,
  legend: {
    visible: true,
    position: 'bottom'
  },
  circles: {
    visible: true,
    radius: 5.5
  }
};

export default config;
