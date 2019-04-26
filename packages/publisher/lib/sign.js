"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws4 = require('aws4');
;
var headers = function (data) {
    return data && data instanceof Buffer
        ? { 'Content-Type': 'application/octet-stream' }
        : { 'Content-Type': 'application/json' };
};
var body = function (data) {
    return data && data instanceof Buffer
        ? data
        : JSON.stringify(data);
};
exports.default = (function (_a) {
    var data = _a.data, stage = _a.stage, domainName = _a.domainName, connectionId = _a.connectionId;
    return aws4.sign({
        path: "/" + stage + "/%40connections/" + encodeURIComponent(connectionId),
        headers: headers(data),
        body: body(data),
        host: domainName,
        method: 'POST',
    });
});
