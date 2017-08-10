## **Bar Graph with default configuration**
In this example we are going to create a simple bar graph using the default configuration.

### 1. Before rendering
This is how the `HTML` document looks before rendering the line graph. In this example, the `div` element
classed as `simple-bar-graph` is the placeholder of our `SVG` graph and has fixed dimensions.

```html
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <script src="../node_modules/d3/build/d3.min.js"></script>
    <script src="../node_modules/d3-svg-legend/d3-legend.min.js"></script>
    <script src="../node_modules/d3-tip/index.js"></script>
    <script src="../node_modules/lodash/lodash.min.js"></script>
    <style type="text/css"></style>
  </head>
  <body>
    <div class="simple-bar-graph" style="width: 600px; height: 450px;"></div>
    <script src="./simple-bar-graph.js"></script>
  </body>
</html>
```

### 2. Fetching the data
Assuming that we are working with `invenio-stats` as our backend, we have the following API and we'd like to
display retrieved data using the `invenio-statistics-js`.

```bash
# Fetch the total number of downloads for each individual file of a specific record in a given time window
# The JSON response will serve as input for the bar graph

# Request
$ curl -v -XGET localhost:5000/stats -H "Content-Type: application/json" -d '{"mystat": {"stat": "bucket-file-download-total", "params": {"start_date":"2016-12-18", "end_date":"2016-12-19", "bucket_id": 20}}}'

# Response: JSON object with a single entry => single bar per file
{
  "mystat": {
    "buckets": [
      {
        "key": "file1.txt",
        "value": 10.0
      },
      {
        "key": "file2.txt",
        "value": 4.0
      },
      {
        "key": "file3.txt",
        "value": 18.0
      }
    ],
    "field": "file_key",
    "key_type": "terms",
    "type": "bucket"
  }
}


```
### 3. Setting the configuration
Since we are using the default configuration, no options regarding the bar graph need to be specified.
Here we present the structure of the default configuration object for the bar graph:

```javascript
{
  graph: {
    type: 'bar'  // the type of the graph
  },
  // specify the margins of the graph inside the SVG
  margin: {
    top: 50,
    right: 40,
    bottom: 70,
    left: 60
  },
  axis: {
    //  configure the horizontal axis
    x: {
      mapTo: 'key',  // specify the identifier/key associated with the axis
      scale: {
        type: 'scaleBand',  // specify the type of the axis scale
        format: null  //specify the format of the axis ticks
      },
      options: {
        label: {
          value: 'Country',  // specify the label of the axis
          visible: true   // specify the visibility of the axis label
        },
        line: {
          visible: false  // specify the visibility of the main axis line
        },
        ticks: {
          visible: false  // specify the visibility of the axis ticks
        },
        tickLabels: {
          visible: true,  // specify the visibility of the axis tick labels
          rotated: false  // specify the rotation of the axis tick labels
        },
        gridlines: true  // possibly add gridlines to the axis
      }
    },
    //  configure the vertical axis
    y: {
      mapTo: 'value',  // specify the identifier/key associated with the axis
      scale: {
        type: 'scaleLinear',  // specify the type of the axis scale
        format: ''  // specify the format of the axis ticks
      },
      options: {
        label: {
          value: 'Count',  // specify the label of the axis
          visible: true  // specify the visibility of the axis label
        },
        line: {
          visible: false  // specify the visibility of the main axis line
        },
        ticks: {
          visible: false  // specify the visibility of the axis ticks
        },
        tickLabels: {
          visible: true,  // specify the visibility of the axis tick labels
          rotated: false  // specify the rotation of the axis tick labels
        },
        gridlines: true  // possibly add gridlines to the axis
      }
    }
  },
  title: {
    value: 'Count per Country',  // specify the title of the graph
    visible: true  // specify the title of the graph
  },
  colorScale: 'schemeCategory20',  // specify the scale for the bar coloring
  tooltip: {
    enabled: true  // enable or disable the tooltip functionality
  },
  legend: {
    visible: false,  // specify the visibility of the graph legend
    position: 'side'  // specify the position of the graph legend('bottom', 'side')
  },
  zoom: {
    enabled: true  // enable or disable the zooming/panning functionality
  },
  resize: {
    enabled: true,  // enable or disable the resizing functionality
    breakPointX: 550,  // horizontal threshold point to hide some elements
    breakPointY: 275  // vertical threshold point to hide some elements
  }
}
```

### 4. Instantiating the line graph
Assuming that the script we are working on is `simple-line-graph.js`:

```javascript
import { BarGraph } from 'invenio-statistics';

/**
  * This is mock data
  * Normally this is a JSON response from an HTTP API call
 */
const data = {
  "mystat": {
    "buckets": [
      {
        "key": 1482019200000,
        "value": 4.0
      },
      {
        "key": 1482105600000,
        "value": 8.0
      },
      {
        "key": 1482192000000,
        "value": 8.0
      }
    ],
    "bucket_id": "20",
    "file_key": "file1.txt",
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  }
}

// Render a bar graph to the DOM, using the default configuration
new BarGraph(data, 'simple-bar-graph').render();

```

### 5. After rendering
```html
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <script src="../node_modules/d3/build/d3.min.js"></script>
    <script src="../node_modules/d3-svg-legend/d3-legend.min.js"></script>
    <script src="../node_modules/d3-tip/index.js"></script>
    <script src="../node_modules/lodash/lodash.min.js"></script>
    <style type="text/css"></style>
  </head>
  <body>
    <div class="simple-bar-graph" style="width: 600px; height: 450px;">
      <svg class="simple-bar-graph" width="600px" height="450px">
    </div>
    <script src="./simple-bar-graph.js"></script>
  </body>
</html>
```

**Note**: By convention, the `SVG` element holding the graph has the same `class` with the `div` container.
