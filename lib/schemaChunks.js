module.exports = {
  // This allows to encode graphs with less than 2^32 nodes.
  graph: text(
    'syntax = "proto3";',
    '',
    'message Link {',
    '  int32 from = 1;',
    '  int32 to = 2;',
    '  int32 data = 3;',
    '}',
    '',
    'message Node {',
    '  string id = 1;',
    '}',
    '',
    'message Graph {',
    '  repeated Node nodes = 1;',
    '  repeated Link links = 2;',
    '}',
    '',
    'message Graphs {',
    '  repeated Graph graphs = 1;',
    '}'
  )
};

function text() {
  var result = [];

  for (var i = 0; i < arguments.length; ++i) {
    var v = arguments[i];
    if (v !== undefined) result.push(v);
  }

  return result.join('\n');
}
