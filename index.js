var makeSchema = require('./makeSchema.js');
var makeProtoBufView = require('./lib/makeProtoBufView.js');

var fs = require('fs');
var mkdirp = require('mkdirp');
var merge = require('ngraph.merge');
var path = require('path');

module.exports = save;
module.exports.read = require('./readPrimitive.js');

function save(graph, options) {
  options = merge(options, {
    outDir: '.',
    labels: 'labels.pb',
    links: 'links.pb',
    saveLinksData: false
  });

  fixPaths();

  var schema = makeSchema(options);
  var protoBufView = makeProtoBufView(graph, schema);

  var labelsBuffer = protoBufView.getLabelsBuffer();
  saveArrayBuffer(options.labels, labelsBuffer);

  if (options.saveLinksData) {
    var linksData = protoBufView.getLinksDataBuffer();
    saveArrayBuffer(options.linksData, linksData);
  } else {
    // TODO: Do I need this at all?
    var linksBuffer = protoBufView.getLinksBuffer();
    saveArrayBuffer(options.links, linksBuffer);
  }

  fs.writeFileSync(options.meta, JSON.stringify({
    options: options,
    stats: {
      nodes: graph.getNodesCount(),
      edges: graph.getLinksCount()
    }
  }, null, 2), 'utf8');

  fs.writeFileSync(options.protoFile, schema);

  // TODO: Save data for each node?
  return;

  function fixPaths() {
    if (!fs.existsSync(options.outDir)) {
      mkdirp.sync(options.outDir);
    }

    options.labels = path.join(options.outDir, options.labels);
    options.links = path.join(options.outDir, options.links);
    options.protoFile = path.join(options.outDir, 'graph.proto');
    options.meta = path.join(options.outDir, 'graph-def.json');

    if (options.saveLinksData) {
      options.linksData = path.join(options.outDir, 'linksData.pb');
    }
  }
}


function saveArrayBuffer(fileName, arrayBuffer) {
  // Turns out some node versions fail if arrayBuffer has 0 length.
  var buffer = (arrayBuffer.byteLength > 0) ? new Buffer(arrayBuffer) : new Buffer(0);
  fs.writeFileSync(fileName, buffer);
}
