module.exports = convertLabelsToIdLookup;

function convertLabelsToIdLookup(labels) {
  var nodeIdLookup = new Map()

  labels.forEach(function(element, i) {
    // +1 to avoid 0 uncertainty
    nodeIdLookup.set(element, i + 1);
  });

  return nodeIdLookup;
}
