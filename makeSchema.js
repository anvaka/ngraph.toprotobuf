var schemaChunks = require('./lib/schemaChunks.js');

module.exports = makeSchema;

function makeSchema(options) {
  options = options || {};
  var result = [];

  addBlock(schemaChunks.syntax);
  addBlock(schemaChunks.graph); // this can be configurable
  addBlock(schemaChunks.labels);

  if (options.saveLinksData) {
    addBlock(schemaChunks.linksData);
  }

  return result.join('\n');

  function addBlock(block) {
    result.push(block, '');
  }
}
