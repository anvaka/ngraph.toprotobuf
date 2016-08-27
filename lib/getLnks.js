module.exports = getLinks;

function getLinks(graph, nodeIdLookup) {
  var buf = []

  graph.forEachNode(function(node) {
    var startWriten = false;
    var start = nodeIdLookup.get(node.id);

    graph.forEachLinkedNode(node.id, saveLink, true);

    function saveLink(node) {
      if (!startWriten) {
        startWriten = true;
        buf.push(-start);
      }

      var other = nodeIdLookup.get(node.id);
      buf.push(other);
    }
  });

  return buf;
}
