var test = require('tap').test
var path = require('path');

var readSavedGraph = require('../readPrimitive.js');
var makeProtoBufView = require('../lib/makeProtoBufView.js');
var createGraph = require('miserables').create;
var schema = require('../schema.js');
var restoreGraph = require('../lib/restoreGraph.js');
var toProtoBuf = require('../');

test('it can read and  save graph', function(t) {
  var graph = createGraph();

  var view = makeProtoBufView(graph, schema)
  var linksBuffer = view.getLinksBuffer();
  var labelsBuffer = view.getLabelsBuffer();

  var labels = view.Labels.decode(labelsBuffer).labels;
  var links = view.Graph.decode(linksBuffer).links;
  var restoredGraph = restoreGraph(labels, links);

  verifyRestoredGraph(restoredGraph, graph, t);

  t.end();
});

test('it can read from disk', function(t) {
  var graph = createGraph();
  toProtoBuf(graph, {
    outDir: 'data'
  });

  var graphDef = path.join(__dirname, '..', 'data', 'graph-def.json');
  var restoredGraph = readSavedGraph(graphDef);
  verifyRestoredGraph(restoredGraph, graph, t);
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
  var restoredGraph = readSavedGraph(graphDef);
  verifyRestoredGraph(restoredGraph, graph, t);
  t.end();
});

function verifyRestoredGraph(restoredGraph, srcGraph, t) {
  var nodes = restoredGraph.nodes;
  var links = restoredGraph.links;

  t.ok(nodes.length === srcGraph.getNodesCount(), 'Same number of nodes');
  t.ok(links.length === srcGraph.getLinksCount(), 'Same number of edges');

  links.forEach(function(link) {
    var fromId = parseInt(nodes[link.source].id, 10);
    var toId = parseInt(nodes[link.target].id, 10);
    t.ok(srcGraph.hasLink(fromId, toId), 'Link exists: ' + fromId + '->' + toId);
  });

  nodes.forEach(function(node) {
    var nodeId = parseInt(node.id, 10);
    t.ok(srcGraph.getNode(nodeId), 'Node exists: ' + nodeId);
  });
}
