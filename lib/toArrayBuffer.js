module.exports = toArrayBuffer;

/**
 * Converts node.js Buffer object to ArrayBuffer
 */
function toArrayBuffer(nodeBuffer) {
    var arrayBuffer = new ArrayBuffer(nodeBuffer.length);

    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < nodeBuffer.length; ++i) {
        view[i] = nodeBuffer[i];
    }
    return arrayBuffer;
}
