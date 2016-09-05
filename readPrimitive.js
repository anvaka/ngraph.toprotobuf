var fs = require('fs');
var ProtoBuf = require('protobufjs');

var toArrrayBuffer = require('./lib/toArrayBuffer.js');
var fromCompactArray = require('./lib/fromCompactArray.js');
var fromLinksData = require('./lib/fromLinksData.js');

module.exports = read;

function read(graphDefFile) {
  var graphDefStr = fs.readFileSync(graphDefFile, 'utf8')
  var graphDef = JSON.parse(graphDefStr);
  var options = graphDef.options;
  if (!options) {
    throw new Error('Graph definition file is not valid. Options are missing');
  }

  var labelsBuffer = readBuffer(options.labels)
  var builder = ProtoBuf.loadProtoFile(options.protoFile);
  var Labels = builder.build('Labels');
  var labels = Labels.decode(labelsBuffer).labels;

  var restoredGraph;

  if (options.linksData) {
    var linkDataBuffer = readBuffer(options.linksData)
    var LinksData = builder.build('LinksData');
    var linksData = LinksData.decode(linkDataBuffer).links;

    restoredGraph = fromLinksData(labels, linksData);
  } else {
    var linksBuffer = readBuffer(options.links)
    var Graph = builder.build('Graph');
    var links = Graph.decode(linksBuffer).links;

    restoredGraph = fromCompactArray(labels, links);
  }

  return restoredGraph;
}

function readBuffer(name) {
  var buffer = fs.readFileSync(name);
  return toArrrayBuffer(buffer);
}
