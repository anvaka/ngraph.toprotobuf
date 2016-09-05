module.exports = {
  // labels[i] === node.id for the node at i'th position.
  labels: text(
    'message Labels {',
    '  repeated string labels = 1;',
    '}'
  ),

  // This allows to encode graphs with less than 2^32 nodes.
  graph: text(
    'message Graph {',
    '  repeated sint32 links = 1;',
    '}'
  ),

  // Each link by default can have one data argument, which is assumed
  // to be a positive number (link's weight). Of course, we may need to let
  // clients override this chunk, if they want to save custom objects in future.
  linksData: text(
    'message LinkData {',
    '  int32 fromId = 1;',
    '  int32 toId = 2;',
    '  int32 data = 3;',
    '}',
    '',
    'message LinksData {',
    '  repeated LinkData links = 1;',
    '}'
  ),

  syntax: text(
    'syntax = "proto3";'
  ),
};

function text() {
  var result = [];

  for (var i = 0; i < arguments.length; ++i) {
    var v = arguments[i];
    if (v !== undefined) result.push(v);
  }

  return result.join('\n');
}
