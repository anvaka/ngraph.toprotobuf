module.exports = fromLinksData;

function fromLinksData(labels, linksData) {
  var nodes = [];
  var links = [];

  labels.forEach(addNode)
  linksData.forEach(addLink);

  return {
    nodes: nodes,
    links: links
  };

  function addNode(label) {
    nodes.push({ id: label })
  }

  function addLink(link) {
    links.push({
      source: link.fromId - 1,
      target: link.toId - 1,
      data: link.data
    });
  }
}
