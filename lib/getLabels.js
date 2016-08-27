module.exports = getLabels;

function getLabels(graph) {
  var labels = [];
  graph.forEachNode(saveNode);

  return labels;

  function saveNode(node) {
    labels.push(node.id);
  }
}
