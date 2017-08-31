## **Simple Line Graph with default configuration**
In this example we are going to create a simple line graph using the default configuration.

### 1. Before rendering
This is how the `HTML` document looks before rendering the line graph. In this example, the `div` element
classed as `simple-line-graph` is the placeholder of our `SVG` graph and has fixed dimensions.

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
    <div class="simple-line-graph" style="width: 600px; height: 450px;"></div>
    <script src="./simple-line-graph.js"></script>
  </body>
</html>
```

### 2. Fetching the data
Assuming that we are working with `invenio-stats` as our backend, we have the following API and we'd like to
display retrieved data using the `invenio-charts-js`.

```bash
# Fetch the number of downloads for a specific file in a given time window
# The JSON response will serve as input for the line graph

# Request
$ curl -v -XGET localhost:5000/stats -H "Content-Type: application/json" -d '{"mystat": {"stat": "bucket-file-download-histogram", "params": {"start_date":"2016-12-18", "end_date":"2016-12-20", "interval": "day", "bucket_id": 20, "file_key": "file1.txt"}}}'

# Response: a JSON object with a single entry => single line
{
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
        "value": 12.0
      }
    ],
    "bucket_id": "20",
    "file_key": "file1.txt",
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  }
}

```
### 3. Setting the configuration
Since we are using the default configuration, no options regarding the line graph need to be specified.
Here we present the structure of the default configuration object for the line graph, for time series data:

```javascript
{
  graph: {
    type: 'line',  // the type of the graph
    options: {
      curveType: 'curveLinear',  // specify the line interpolation
      fillArea: true,  // possibly add a colored area under the line
      circles: {
        visible: true,  // possibly add circles at the data points
        radius: 5  // specify the radius
      }
    }
  },
  // specify the margins of the graph inside the SVG
  margin: {
    top: 40,
    right: 30,
    bottom: 75,
    left: 60
  },
  axis: {
    //  configure the horizontal axis
    x: {
      mapTo: 'key',  // specify the identifier/key associated with the axis
      scale: {
        type: 'scaleTime',  // specify the type of the axis scale
        // only for 'scaleTime'
        interval: 'timeWeek',  // specify the interval of the axis ticks
        format: '%d %b %Y'  // specify the format of the axis ticks
      },
      options: {
        label: {
          value: 'Date',  // specify the label of the axis
          visible: false  // specify the visibility of the axis label
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
        gridlines: true   // possibly add gridlines to the axis
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
          visible: false  // specify the visibility of the axis label
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
    value: 'Stats per week', // specify the title of the graph
    visible: false  // specify the visibility of the graph title
  },
  colorScale: 'schemeCategory10',  // specify the scale for the line coloring
  tooltip: {
    enabled: true  // enable or disable the tooltip functionality
  },
  legend: {
    visible: true,  // specify the visibility of the graph legend
    position: 'bottom'  // specify the position of the graph legend('bottom', 'side')
  },
  zoom: {
    enabled: true  // enable or disable the zooming/panning functionality
  },
  resize: {
    enabled: true,  // enable or disable the resizing functionality
    breakPointX: 550,  // horizontal threshold point to hide some elements
    breakPointY: 275  // vertical threshold point to hide some elements
  }
};
```

### 4. Instantiating the line graph
Assuming that the script we are working on is `simple-line-graph.js`:

```javascript
import { LineGraph } from 'invenio-statistics';

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

// Render a line graph to the DOM, using the default configuration
new LineGraph(data, 'simple-line-graph').render();

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
    <div class="simple-line-graph" style="width: 600px; height: 450px;">
      <svg class="simple-line-graph" width="600px" height="450px">
    </div>
    <script src="./simple-line-graph.js"></script>
  </body>
</html>
```

**Note**: By convention, the `SVG` element holding the graph has the same `class` with the `div` container.

## **Multi Line Graph with custom configuration**
In this example we are going to create a multi line graph, overriding the default configuration with custom options.

### 1. Before rendering
This is how the `HTML` document looks before rendering the line graph. In this example, the `div` element
classed as `multi-line-graph` is the placeholder of our `SVG` graph and has fixed dimensions.

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
    <div class="multi-line-graph" style="width: 600px; height: 450px;"></div>
    <script src="./multi-line-graph.js"></script>
  </body>
</html>
```

### 2. Fetching the data
Assuming that we are working with `invenio-stats` as our backend, we have the following API and we'd like to
display retrieved data using the `invenio-charts-js`.

```bash
# Fetch the number of downloads and number of views for a specific file in a given time window
# The JSON response will serve as input for the multi line graph

# Request
$ curl -v -XGET localhost:5000/stats -H "Content-Type: application/json" -d '{"mystat1": {"stat": "bucket-file-download-histogram", "params": {"start_date":"2016-12-18", "end_date":"2016-12-20", "interval": "day", "bucket_id": 20, "file_key": "file1.txt"}}, "mystat2": {"stat": "bucket-file-views-histogram", "params": {"start_date":"2016-12-18", "end_date":"2016-12-20", "interval": "day", "bucket_id": 20, "file_key": "file1.txt"}}}'

# Response: a JSON object with multiple entries => multiple lines
const data_multi = {
  "mystat1": {
    "buckets": [
      {
        "key": 1482019200000,
        "value": 4.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482105600000,
        "value": 8.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482192000000,
        "value": 12.0
      }
    ],
    "bucket_id": "20",
    "file_key": "file1.txt",
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  },
  "mystat2": {
    "buckets": [
      {
        "key": 1482019200000,
        "value": 12.0
      },
      {
        "key": 1482105600000,
        "value": 14.0
      },
      {
        "key": 1482192000000,
        "value": 7.0
      }
    ],
    "bucket_id": "20",
    "file_key": "file1.txt",
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  }
}

```
### 3. Setting the configuration
In order to override the default configuration object, we only need to define a `JSON`
object that will set the specific attributes of our custom configuration. This object will
be passed as a parameter to the constructor of the graph and get merged with the default
`JSON` configuration object.

Assuming that we want to change the type of the curve, add a title to the graph and make all
the elements of the vertical axis visible, we need to define a `JSON` like the one below. As
expected, this object is a subset of the default configuration object:

```javascript
{
  axis: {
    graph: {
      options: {
        curveType: 'curveMonotoneX',  // specify the line interpolation
      }
    }
    y: {
      options: {
        label: {
          value: 'Count',  // specify the label of the axis
          visible: true  // specify the visibility of the axis label
        },
        line: {
          visible: true  // specify the visibility of the main axis line
        },
        ticks: {
          visible: true  // specify the visibility of the axis ticks
        }
      }
    }
  },
  title: {
    value: 'Desired graph title'
    visible: true
  }  
}
```

### 4. Instantiating the line graph
Assuming that the script we are working on is `multi-line-graph.js`:

```javascript
import { LineGraph } from 'invenio-statistics';

/**
  * This is mock data
  * Normally this is a JSON response from an HTTP API call
 */
const data_multi = {
  "mystat1": {
    "buckets": [
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482019200000,
        "value": 4.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482105600000,
        "value": 8.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482192000000,
        "value": 8.0
      }
    ],
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  },
  "mystat2": {
    "buckets": [
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482019200000,
        "value": 12.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482105600000,
        "value": 14.0
      },
      {
        "bucket_id": "20",
        "file_key": "file1.txt",
        "key": 1482192000000,
        "value": 7.0
      }
    ],
    "interval": "day",
    "key_type": "date",
    "type": "bucket"
  }
}

const config = {
  axis: {
    graph: {
      options: {
        curveType: 'curveMonotoneX',
      }
    }
    y: {
      options: {
        label: {
          value: 'Count',
          visible: true
        },
        line: {
          visible: true
        },
        ticks: {
          visible: true
        },
      }
    }
  },
  title: {
    value: 'Desired graph title'
    visible: true
  }  
}

// Render a multi line graph to the DOM, using the default configuration
new LineGraph(data_multi, 'multi-line-graph', config).render();

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
    <div class="multi-line-graph" style="width: 800px; height: 550px;">
      <svg class="multi-line-graph" width="800px" height="550px">
    </div>
    <script src="./multi-line-graph.js"></script>
  </body>
</html>
```
