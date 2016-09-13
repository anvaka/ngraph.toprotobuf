var fs = require('fs');
var ProtoBuf = require('protobufjs');

var toJSBuffer = require('./lib/toJSBuffer.js');

module.exports = read;

function read(graphDefFile) {
  var graphDefStr = fs.readFileSync(graphDefFile, 'utf8')
  var graphDef = JSON.parse(graphDefStr);
  var options = graphDef.options;
  if (!options) {
    throw new Error('Graph definition file is not valid. Options are missing');
  }

  var builder = ProtoBuf.loadProtoFile(options.protoFile);
  var Graphs = builder.build('Graphs');
  var graphBuffer = readBuffer(options.graph)
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
