var fs = require('fs');
var ProtoBuf = require('protobufjs');

var toArrrayBuffer = require('./lib/toArrayBuffer.js');
var restoreGraph = require('./lib/restoreGraph.js');

module.exports = read;

read('./data/graph-def.json');

function read(graphDefFile) {
  var graphDefStr = fs.readFileSync(graphDefFile, 'utf8')
  var graphDef = JSON.parse(graphDefStr);

  var labelsBuffer = readBuffer(graphDef.options.labels)
  var linksBuffer= readBuffer(graphDef.options.links)

  var builder = ProtoBuf.protoFromString(graphDef.schema.graph);
  var Graph = builder.build('Graph');
  var Labels = builder.build('Labels');

  var labels = Labels.decode(labelsBuffer).labels;
  var links = Graph.decode(linksBuffer).links;

  var restoredGraph = restoreGraph(labels, links);

  return restoredGraph;
}

function readBuffer(name) {
  var buffer = fs.readFileSync(name);
  return toArrrayBuffer(buffer);
}
