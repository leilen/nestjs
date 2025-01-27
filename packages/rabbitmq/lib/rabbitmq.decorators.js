"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitRequest = exports.RabbitHeader = exports.RabbitPayload = exports.createPipesRpcParamDecorator = exports.InjectRabbitMQConfig = exports.RabbitRPC = exports.RabbitSubscribe = exports.RabbitHandler = exports.makeRabbitDecorator = void 0;
const nestjs_common_1 = require("@golevelup/nestjs-common");
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const rabbitmq_constants_1 = require("./rabbitmq.constants");
const makeRabbitDecorator = (input) => (config) => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(rabbitmq_constants_1.RABBIT_HANDLER, Object.assign(Object.assign({}, input), config)));
exports.makeRabbitDecorator = makeRabbitDecorator;
const RabbitHandler = (config) => (target, key, descriptor) => (0, common_1.SetMetadata)(rabbitmq_constants_1.RABBIT_HANDLER, config)(target, key, descriptor);
exports.RabbitHandler = RabbitHandler;
exports.RabbitSubscribe = (0, exports.makeRabbitDecorator)({ type: 'subscribe' });
exports.RabbitRPC = (0, exports.makeRabbitDecorator)({ type: 'rpc' });
exports.InjectRabbitMQConfig = (0, nestjs_common_1.makeInjectableDecorator)(rabbitmq_constants_1.RABBIT_CONFIG_TOKEN);
const createPipesRpcParamDecorator = (data, type = rabbitmq_constants_1.RABBIT_PARAM_TYPE, ...pipes) => (target, key, index) => {
    const args = Reflect.getMetadata(rabbitmq_constants_1.RABBIT_ARGS_METADATA, target.constructor, key) || {};
    const hasParamData = (0, lodash_1.isString)(data);
    const paramData = hasParamData ? data : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];
    Reflect.defineMetadata(rabbitmq_constants_1.RABBIT_ARGS_METADATA, (0, common_1.assignMetadata)(args, type, index, paramData, ...paramPipes), target.constructor, key);
};
exports.createPipesRpcParamDecorator = createPipesRpcParamDecorator;
function RabbitPayload(propertyOrPipe, ...pipes) {
    return (0, exports.createPipesRpcParamDecorator)(propertyOrPipe, rabbitmq_constants_1.RABBIT_PARAM_TYPE, ...pipes);
}
exports.RabbitPayload = RabbitPayload;
function RabbitHeader(propertyOrPipe, ...pipes) {
    return (0, exports.createPipesRpcParamDecorator)(propertyOrPipe, rabbitmq_constants_1.RABBIT_HEADER_TYPE, ...pipes);
}
exports.RabbitHeader = RabbitHeader;
function RabbitRequest(propertyOrPipe, ...pipes) {
    return (0, exports.createPipesRpcParamDecorator)(propertyOrPipe, rabbitmq_constants_1.RABBIT_REQUEST_TYPE, ...pipes);
}
exports.RabbitRequest = RabbitRequest;
//# sourceMappingURL=rabbitmq.decorators.js.map