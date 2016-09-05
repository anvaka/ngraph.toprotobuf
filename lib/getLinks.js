/**
 * Converts each link in the graph into compacted adjacency array.
 *
 * Compacted adjacency array fully describes all connections in the graph.
 * Each node in the graph is encoded as a number between 1 to N.
 *
 * If element in the compacted array is a negative number, then all following positive
 * numbers are outgoing connections for this element. E.g. the graph:
 *
 * 1 <-> 2 -> 3
 *
 * Can be encoded as:
 *
 * [-1, 2, -2, 1, 3]
 *
 * 1 is connected to 2, and 2 is connected to 3 and 1.
 */
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
