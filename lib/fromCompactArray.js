module.exports = fromCompactArray;

function fromCompactArray(labels, compactArray) {
  var nodes = [];
  var links = [];

  var srcIndex;

  labels.forEach(addNode)
  compactArray.forEach(processLink);

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
