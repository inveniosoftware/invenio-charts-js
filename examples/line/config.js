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
