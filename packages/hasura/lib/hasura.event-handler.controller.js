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
exports.EventHandlerController = void 0;
const common_1 = require("@nestjs/common");
const hasura_event_handler_guard_1 = require("./hasura.event-handler.guard");
const hasura_event_handler_service_1 = require("./hasura.event-handler.service");
let EventHandlerController = class EventHandlerController {
    constructor(eventHandlerService) {
        this.eventHandlerService = eventHandlerService;
    }
    async handleEvent(evt) {
        const response = await this.eventHandlerService.handleEvent(evt);
        return response == undefined ? { success: true } : response;
    }
};
__decorate([
    (0, common_1.UseGuards)(hasura_event_handler_guard_1.HasuraEventHandlerHeaderGuard),
    (0, common_1.Post)('/events'),
    (0, common_1.HttpCode)(202),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventHandlerController.prototype, "handleEvent", null);
EventHandlerController = __decorate([
    (0, common_1.Controller)('/hasura'),
    __metadata("design:paramtypes", [hasura_event_handler_service_1.EventHandlerService])
], EventHandlerController);
exports.EventHandlerController = EventHandlerController;
//# sourceMappingURL=hasura.event-handler.controller.js.map