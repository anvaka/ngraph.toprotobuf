var fs = require('fs');
var path = require('path');
var ProtoBuf = require('protobufjs');

var toJSBuffer = require('./lib/toJSBuffer.js');

module.exports = read;

function read(graphDefFile) {
  var graphDefStr = fs.readFileSync(graphDefFile, 'utf8')
  var graphDef = JSON.parse(graphDefStr);

  var dirName = path.dirname(graphDefFile);
  var protoFile = path.join(dirName, 'graph.pb.proto')
  var builder = ProtoBuf.loadProtoFile(protoFile);

  var Graphs = builder.build('Graphs');

  var graph = path.join(dirName, 'graph.pb')
  var graphBuffer = readBuffer(graph)
  var restoredGraphs = Graphs.decode(graphBuffer).graphs;

  return {
    graphs: restoredGraphs,
    def: graphDef
  };
}

function readBuffer(name) {
  var buffer = fs.readFileSync(name);
  return toJSBuffer(buffer);
}
