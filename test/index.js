var test = require('tap').test
var path = require('path');

var readSavedGraph = require('../readPrimitive.js');
var createGraph = require('miserables').create;
var toProtoBuf = require('../');

test('it can read from disk with links data', function(t) {
  var graph = createGraph();
  var outDir = 'data/wlinks_data';

  toProtoBuf(graph, {
    outDir: outDir
  });

  var graphDef = path.join(__dirname, '..', outDir, 'graph-def.json');
  var restoredGraph = readSavedGraph(graphDef).graphs[0];
  var verifyLinkData = true;

  verifyRestoredGraph(restoredGraph, graph, t, verifyLinkData);
  t.end();
});

test('it can store graph without links', function(t) {
  var graph = require('ngraph.graph')();
  graph.addNode(1);
  graph.addNode(2);

  var outDir = 'data/isolate';
  toProtoBuf(graph, {
    outDir: outDir
  });

  var graphDef = path.join(__dirname, '..', outDir, 'graph-def.json');
  var restoredGraph = readSavedGraph(graphDef).graphs[0];
  verifyRestoredGraph(restoredGraph, graph, t);
  t.end();
});

function verifyRestoredGraph(restoredGraph, srcGraph, t, verifyLinkData) {
  var nodes = restoredGraph.nodes;
  var links = restoredGraph.links;

  t.ok(nodes.length === srcGraph.getNodesCount(), 'Same number of nodes');
  t.ok(links.length === srcGraph.getLinksCount(), 'Same number of edges');

  links.forEach(function(link) {
    var fromId = parseInt(nodes[link.from].id, 10);
    var toId = parseInt(nodes[link.to].id, 10);

    var otherLink = srcGraph.getLink(fromId, toId);
    t.ok(otherLink, 'Link exists: ' + fromId + '->' + toId);

    if (verifyLinkData) {
      t.ok(otherLink.data === link.data, 'Link data is valid: ' + fromId + '->' + toId);
    }
  });

  nodes.forEach(function(node) {
    var nodeId = parseInt(node.id, 10);
    t.ok(srcGraph.getNode(nodeId), 'Node exists: ' + nodeId);
  });
}
