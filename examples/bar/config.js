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
    type: 'bar'
  },
  axis: {
    x: {
      mapTo: 'user',
      scaleType: 'scaleBand',
      ticks: null,
      ticksFormat: '',
      visible: false
    },
    y: {
      mapTo: 'downloads',
      scaleType: 'scaleLinear',
      ticks: null,
      ticksFormat: '',
      visible: false
    }
  },
  tooltip: false,
  gridlines: {
    x: false,
    y: true
  },
  title: 'Downloads',
  label: {
    x: 'Users',
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
