module.exports = restoreGraph;

function restoreGraph(labels, srcLinksArray) {
  var nodes = [];
  var links = [];

  var srcIndex;

  labels.forEach(addNode)
  srcLinksArray.forEach(processLink);

  return {
    nodes: nodes,
    links: links
  };

  function addNode(label) {
    nodes.push({ id: label })
  }

  function processLink(link) {
    if (link < 0) {
      srcIndex = -link - 1;
    } else {
      var destIndex = link - 1;

      links.push({
        source: srcIndex,
        target: destIndex
      });
    }
  }
}
