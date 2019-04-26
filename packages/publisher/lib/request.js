"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https = require('https');
;
;
exports.default = (function (options) { return new Promise(function (resolve) {
    var req = https.request(options, function (_a) {
        var statusCode = _a.statusCode;
        resolve(statusCode === 200);
    });
    req.on('error', function () { return resolve(false); });
    req.write(options.body);
    req.end();
}); });
