# ngraph.toprotobuf

Stores ngraph instance into protobuf format on disk

# usage

To save a graph:

``` js
// let's say `graph` is an instance of ngraph.graph
var toProtoBuf = require('ngraph.toprotobuf')

// this will save graph into 'data' folder
toProtoBuf(graph, {
  outDir: 'data'
});
```

# license

MIT
