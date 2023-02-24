"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasuraEventHandlerHeaderGuard = void 0;
const common_1 = require("@nestjs/common");
const hasura_decorators_1 = require("./hasura.decorators");
let HasuraEventHandlerHeaderGuard = class HasuraEventHandlerHeaderGuard {
    constructor(hasuraConfig) {
        this.hasuraConfig = hasuraConfig;
        this.apiSecret =
            typeof hasuraConfig.webhookConfig.secretFactory === 'function'
                ? hasuraConfig.webhookConfig.secretFactory()
                : hasuraConfig.webhookConfig.secretFactory;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const secretRequestHeader = request.headers[this.hasuraConfig.webhookConfig.secretHeader];
        return secretRequestHeader === this.apiSecret;
    }
};
HasuraEventHandlerHeaderGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, hasura_decorators_1.InjectHasuraConfig)()),
    __metadata("design:paramtypes", [Object])
], HasuraEventHandlerHeaderGuard);
exports.HasuraEventHandlerHeaderGuard = HasuraEventHandlerHeaderGuard;
//# sourceMappingURL=hasura.event-handler.guard.js.map