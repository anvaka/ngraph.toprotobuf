var test = require('tap').test
var path = require('path');

var readSavedGraph = require('../readPrimitive.js');
var makeProtoBufView = require('../lib/makeProtoBufView.js');
var createGraph = require('miserables').create;
var makeSchema = require('../makeSchema.js');
var fromCompactArray = require('../lib/fromCompactArray.js');
var toProtoBuf = require('../');

test('it can read and  save graph', function(t) {
  var graph = createGraph();

  var schema = makeSchema();
  var view = makeProtoBufView(graph, schema)
  var linksBuffer = view.getLinksBuffer();
  var labelsBuffer = view.getLabelsBuffer();

  var labels = view.Labels.decode(labelsBuffer).labels;
  var compactGraphArray = view.Graph.decode(linksBuffer).links;
  var restoredGraph = fromCompactArray(labels, compactGraphArray);

  verifyRestoredGraph(restoredGraph, graph, t);

  t.end();
});

test('it can read from disk without links data', function(t) {
  var graph = createGraph();
  var outDir = 'data/wolinks_data';
  toProtoBuf(graph, {
    outDir: outDir,
    saveLinksData: false
  });

  var graphDef = path.join(__dirname, '..', outDir, 'graph-def.json');
  var restoredGraph = readSavedGraph(graphDef).graph;
  var verifyLinkData = false;
  verifyRestoredGraph(restoredGraph, graph, t, verifyLinkData);

  t.end();
});

test('it can read from disk with links data', function(t) {
  var graph = createGraph();
  var outDir = 'data/wlinks_data';

  toProtoBuf(graph, {
    outDir: outDir,
    saveLinksData: true
  });

  var graphDef = path.join(__dirname, '..', outDir, 'graph-def.json');
  var restoredGraph = readSavedGraph(graphDef).graph;
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
  var restoredGraph = readSavedGraph(graphDef).graph;
  verifyRestoredGraph(restoredGraph, graph, t);
  t.end();
});

function verifyRestoredGraph(restoredGraph, srcGraph, t, verifyLinkData) {
  var nodes = restoredGraph.nodes;
  var links = restoredGraph.links;

  t.ok(nodes.length === srcGraph.getNodesCount(), 'Same number of nodes');
  t.ok(links.length === srcGraph.getLinksCount(), 'Same number of edges');

  links.forEach(function(link) {
    var fromId = parseInt(nodes[link.source].id, 10);
    var toId = parseInt(nodes[link.target].id, 10);

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
