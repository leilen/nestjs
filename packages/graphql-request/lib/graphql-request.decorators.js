"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectGraphQLClient = exports.InjectGraphQLConfig = void 0;
const nestjs_common_1 = require("@golevelup/nestjs-common");
const graphql_request_constants_1 = require("./graphql-request.constants");
/**
 * Injects the GraphQL client configuration from this module into a service/controller
 */
exports.InjectGraphQLConfig = (0, nestjs_common_1.makeInjectableDecorator)(graphql_request_constants_1.GraphQLClientConfigInject);
/**
 * Injects the GraphQL client provided by this module into a service/controller
 */
exports.InjectGraphQLClient = (0, nestjs_common_1.makeInjectableDecorator)(graphql_request_constants_1.GraphQLClientInject);
//# sourceMappingURL=graphql-request.decorators.js.map