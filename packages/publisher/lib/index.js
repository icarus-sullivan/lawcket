"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-unresolved
var pipe = require('@lawcket/fn').pipe;
var request = require('./request').default;
var sign = require('./sign').default;
exports.builder = function (_a) {
    var stage = _a.stage, domainName = _a.domainName, connectionId = _a.connectionId;
    return pipe(function (data) { return ({ data: data, stage: stage, domainName: domainName, connectionId: connectionId }); }, sign, request);
};
exports.default = (function (_a) {
    var requestContext = _a.requestContext;
    return requestContext && requestContext.eventType === 'MESSAGE'
        ? exports.builder(requestContext)
        : undefined;
});
