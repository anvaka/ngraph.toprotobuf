var getLinks = require('./getLnks.js');
var getLabels = require('./getLabels.js');
var convertLabelsToIdLookup = require('./convertLabelsToIdLookup.js');

module.exports = breakGraphToPrimitives;

function breakGraphToPrimitives(graph) {
  var labels = getLabels(graph);
  var idLookup = convertLabelsToIdLookup(labels);
  var links = getLinks(graph, idLookup);

  return {
    labels: labels,
    idLookup: idLookup,
    links: links
  }
}
