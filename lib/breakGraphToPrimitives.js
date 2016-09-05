/**
 * Converts a graph into primitives:
 *  - a map from string node id, to 0-based integer id.
 *  - an array of strings for reverse lookup (array index -> string node id)
 *  - compact adjacency array (see ./toCompactArray.js)
 */
var toCompactArray = require('./toCompactArray.js');

module.exports = breakGraphToPrimitives;

function breakGraphToPrimitives(graph) {
  var labels = getLabels(graph);
  var idLookup = convertLabelsToIdLookup(labels);
  var links = toCompactArray(graph, idLookup);

  return {
    labels: labels,
    idLookup: idLookup,
    links: links
  }
}

function convertLabelsToIdLookup(labels) {
  var nodeIdLookup = new Map()

  labels.forEach(function(element, i) {
    // +1 to avoid 0 uncertainty
    nodeIdLookup.set(element, i + 1);
  });

  return nodeIdLookup;
}

function getLabels(graph) {
  var labels = [];

  graph.forEachNode(saveNode);

  return labels;

  function saveNode(node) {
    labels.push(node.id);
  }
}
