module.exports = toJSBuffer;

/**
 * Converts node.js Buffer object to array that can be consumed in the browser
 */
function toJSBuffer(nodeBuffer) {
    var arrayBuffer = new ArrayBuffer(nodeBuffer.length);

    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < nodeBuffer.length; ++i) {
        view[i] = nodeBuffer[i];
    }

    return view;
}
