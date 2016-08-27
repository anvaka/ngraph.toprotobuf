module.exports = {
  // note: This is limiting use to int32 amount of nodes...
  graph: [
'syntax = "proto3";',
'',
'message Graph {',
'  repeated sint32 links = 1;',
'}',
'',
'message Labels {',
'  repeated string labels = 1;',
'}'
  
  ].join('\n')
};
