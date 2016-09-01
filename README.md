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

Note: This module does not oficially support reading from the protobuf, but you can 
take a look how it could be done, by following [readPrimitive.js](https://github.com/anvaka/ngraph.toprotobuf/blob/90006966341eed5b23f1ac395a3d21992b817766/readPrimitive.js) code.

# license

MIT
