var makeSchema = require('./makeSchema.js');
var ProtoBuf = require('protobufjs');

var fs = require('fs');
var mkdirp = require('mkdirp');
var merge = require('ngraph.merge');
var path = require('path');

module.exports = save;
module.exports.read = require('./readPrimitive.js');

function save(graphs, options) {
  options = merge(options, {
    outDir: '.'
  });

  fixPaths();

  var schema = makeSchema();
  var builder = ProtoBuf.protoFromString(schema);

  var Graphs = builder.build('Graphs');
  var Graph = builder.build('Graph');
  var Node = builder.build('Node');
  var Link = builder.build('Link');

  if (!Array.isArray(graphs)) {
    graphs = [graphs];
  }

  var graphsToStore = graphs.map(toProtoGraph);
  writeGraphsToFile();

  fs.writeFileSync(options.meta, JSON.stringify({
    options: options,
    stats: graphsToStore.map(toStats)
  }, null, 2), 'utf8');

  fs.writeFileSync(options.protoFile, schema);

  // TODO: Save data for each node?
  return;

  function toStats(g) {
    return {
      nodes: g.nodes.length,
      edges: g.links.length
    }
  }

  function writeGraphsToFile() {
    var graphsCollection = new Graphs({graphs: graphsToStore});
    var arrayBuffer = graphsCollection.toArrayBuffer();
    saveArrayBuffer(options.graph, arrayBuffer);
  }

  function fixPaths() {
    if (!fs.existsSync(options.outDir)) {
      mkdirp.sync(options.outDir);
    }

    options.graph = path.join(options.outDir, 'graph.pb');
    options.protoFile = path.join(options.outDir, 'graph.pb.proto');
    options.meta = path.join(options.outDir, 'graph-def.json');
  }

  function toProtoGraph(graph) {
    var nodes = [];
    var links = [];
    var nodeIdToIndexLookup = new Map();

    graph.forEachNode(saveNode);
    graph.forEachLink(saveLink);

    return new Graph({links: links, nodes: nodes});

    function saveNode(node) {
      // TODO: build Node/Link based on properties and make it configurable
      nodeIdToIndexLookup.set(node.id, nodes.length);
      // todo: can this be streamed?
      nodes.push(new Node({id: node.id.toString()}));
    }

    function saveLink(link) {
      var from = nodeIdToIndexLookup.get(link.fromId);
      var to = nodeIdToIndexLookup.get(link.toId);
      var data = link.data === undefined ? 0 : link.data;
      links.push(new Link({from: from, to: to, data: data}))
    }
  }
}

function saveArrayBuffer(fileName, arrayBuffer) {
  // Turns out some node versions fail if arrayBuffer has 0 length.
  var buffer = (arrayBuffer.byteLength > 0) ? new Buffer(arrayBuffer) : new Buffer(0);
  fs.writeFileSync(fileName, buffer);
}
