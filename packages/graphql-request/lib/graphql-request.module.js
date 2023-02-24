"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLRequestModule = void 0;
const nestjs_modules_1 = require("@golevelup/nestjs-modules");
const common_1 = require("@nestjs/common");
const graphql_request_1 = require("graphql-request");
const graphql_request_constants_1 = require("./graphql-request.constants");
let GraphQLRequestModule = class GraphQLRequestModule extends (0, nestjs_modules_1.createConfigurableDynamicRootModule)(graphql_request_constants_1.GraphQLClientConfigInject, {
    providers: [
        {
            provide: graphql_request_constants_1.GraphQLClientInject,
            useFactory: ({ endpoint, options }) => {
                return new graphql_request_1.GraphQLClient(endpoint, options);
            },
            inject: [graphql_request_constants_1.GraphQLClientConfigInject],
        },
    ],
    exports: [graphql_request_constants_1.GraphQLClientInject],
}) {
};
GraphQLRequestModule = __decorate([
    (0, common_1.Module)({})
], GraphQLRequestModule);
exports.GraphQLRequestModule = GraphQLRequestModule;
//# sourceMappingURL=graphql-request.module.js.map