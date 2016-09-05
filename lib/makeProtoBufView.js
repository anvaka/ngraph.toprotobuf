/**
 * Converts ngraph.graph to protobuf buffers
 */
var ProtoBuf = require('protobufjs');
var breakGraphToPrimitives = require('./breakGraphToPrimitives.js');

module.exports = makeProtoBufView;

function makeProtoBufView(graph, schema) {
  var builder = ProtoBuf.protoFromString(schema);
  var primitives = breakGraphToPrimitives(graph);

  var Graph = builder.build('Graph');
  var Labels = builder.build('Labels');
  var LinkData;
  var LinksData;

  var api = {
    getLinksBuffer: getLinksBuffer,
    getLabelsBuffer: getLabelsBuffer,
    getLinksDataBuffer: getLinksDataBuffer,
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

  function getLinksDataBuffer() {
    // NOTE: We may want to let clients override this function in future
    // if we want to support custom data serialization.
    if (!LinkData) {
      LinkData = builder.build('LinkData');
      LinksData = builder.build('LinksData');
    }

    var links = [];

    graph.forEachLink(function(link) {
      var linkData = new LinkData();

      linkData.fromId = primitives.idLookup.get(link.fromId);
      linkData.toId = primitives.idLookup.get(link.toId);
      var data =  parseInt(link.data, 10);
      if (Number.isNaN(data)) throw new Error('What is your use case? I do not support this now, but email ;)');

      linkData.data = data;

      links.push(linkData);
    });

    return new LinksData({links: links}).toArrayBuffer();
  }
}
