var ProtoBuf = require('protobufjs');
var breakGraphToPrimitives = require('./breakGraphToPrimitives.js');

module.exports = makeProtoBufView;

function makeProtoBufView(graph, schema) {
  var builder = ProtoBuf.protoFromString(schema.graph);
  var primitives = breakGraphToPrimitives(graph);
  var Graph = builder.build('Graph');
  var Labels = builder.build('Labels');

  var api = {
    getLinksBuffer: getLinksBuffer,
    getLabelsBuffer: getLabelsBuffer,
    Graph: Graph,
    Labels: Labels
  }

  return api;

  function getLinksBuffer() {
    return new Graph({links: primitives.links}).toArrayBuffer();
  }

  function getLabelsBuffer() {
    var labels = Array.from(primitives.idLookup.keys()).map(toString);
    return new Labels({labels: labels}).toArrayBuffer();
  }

  function toString(x) {
    return x.toString();
  }
}
