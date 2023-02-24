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
var HasuraModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasuraModule = void 0;
const nestjs_discovery_1 = require("@golevelup/nestjs-discovery");
const nestjs_modules_1 = require("@golevelup/nestjs-modules");
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const external_context_creator_1 = require("@nestjs/core/helpers/external-context-creator");
const lodash_1 = require("lodash");
const hasura_constants_1 = require("./hasura.constants");
const hasura_decorators_1 = require("./hasura.decorators");
const hasura_event_handler_controller_1 = require("./hasura.event-handler.controller");
const hasura_event_handler_guard_1 = require("./hasura.event-handler.guard");
const hasura_event_handler_service_1 = require("./hasura.event-handler.service");
const hasura_metadata_1 = require("./hasura.metadata");
function isHasuraEvent(value) {
    return ['trigger', 'table', 'event'].every((it) => it in value);
}
function isHasuraScheduledEventPayload(value) {
    return ['comment', 'scheduled_time', 'payload'].every((it) => it in value);
}
let HasuraModule = HasuraModule_1 = class HasuraModule extends (0, nestjs_modules_1.createConfigurableDynamicRootModule)(hasura_constants_1.HASURA_MODULE_CONFIG, {
    providers: [
        {
            provide: Symbol('CONTROLLER_HACK'),
            useFactory: (config) => {
                var _a;
                const controllerPrefix = config.controllerPrefix || 'hasura';
                Reflect.defineMetadata(constants_1.PATH_METADATA, controllerPrefix, hasura_event_handler_controller_1.EventHandlerController);
                (_a = config.decorators) === null || _a === void 0 ? void 0 : _a.forEach((deco) => {
                    deco(hasura_event_handler_controller_1.EventHandlerController);
                });
            },
            inject: [hasura_constants_1.HASURA_MODULE_CONFIG],
        },
        hasura_event_handler_service_1.EventHandlerService,
        hasura_event_handler_guard_1.HasuraEventHandlerHeaderGuard,
    ],
}) {
    constructor(discover, externalContextCreator, hasuraModuleConfig) {
        super();
        this.discover = discover;
        this.externalContextCreator = externalContextCreator;
        this.hasuraModuleConfig = hasuraModuleConfig;
        this.logger = new common_1.Logger(HasuraModule_1.name);
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async onModuleInit() {
        this.logger.log('Initializing Hasura Module');
        const eventHandlerMeta = await this.discover.providerMethodsWithMetaAtKey(hasura_constants_1.HASURA_EVENT_HANDLER);
        const trackedEventHandlerMeta = await this.discover.providerMethodsWithMetaAtKey(hasura_constants_1.HASURA_EVENT_HANDLER);
        const trackedScheduledEventHandlerMeta = await this.discover.providerMethodsWithMetaAtKey(hasura_constants_1.HASURA_SCHEDULED_EVENT_HANDLER);
        if (!eventHandlerMeta.length) {
            this.logger.log('No Hasura event handlers were discovered');
            return;
        }
        this.logger.log(`Discovered ${eventHandlerMeta.length} hasura event handlers`);
        if (this.hasuraModuleConfig.managedMetaDataConfig) {
            this.logger.log('Automatically syncing hasura metadata based on discovered event handlers. Remember to apply any changes to your Hasura instance using the CLI');
            (0, hasura_metadata_1.updateEventTriggerMeta)(this.hasuraModuleConfig, trackedEventHandlerMeta
                .filter((x) => (0, hasura_metadata_1.isTrackedHasuraEventHandlerConfig)(x.meta))
                .map((x) => x.meta));
            if (trackedScheduledEventHandlerMeta.length) {
                (0, hasura_metadata_1.updateScheduledEventTriggerMeta)(this.hasuraModuleConfig, trackedScheduledEventHandlerMeta.map((x) => x.meta));
            }
        }
        const grouped = (0, lodash_1.groupBy)(eventHandlerMeta, (x) => x.discoveredMethod.parentClass.name);
        const eventHandlers = (0, lodash_1.flatten)(Object.keys(grouped).map((x) => {
            this.logger.log(`Registering hasura event handlers from ${x}`);
            return grouped[x].map(({ discoveredMethod, meta: config }) => {
                return {
                    key: config.triggerName,
                    handler: this.externalContextCreator.create(discoveredMethod.parentClass.instance, discoveredMethod.handler, discoveredMethod.methodName, undefined, // metadataKey
                    undefined, // paramsFactory
                    undefined, // contextId
                    undefined, // inquirerId
                    undefined, // options
                    'hasura_event' // contextType
                    ),
                };
            });
        }));
        const [eventHandlerServiceInstance] = await (await this.discover.providers((x) => x.name === hasura_event_handler_service_1.EventHandlerService.name)).map((x) => x.instance);
        const eventHandlerService = eventHandlerServiceInstance;
        const handleEvent = (evt) => {
            var _a, _b, _c;
            const keys = isHasuraEvent(evt)
                ? [(_a = evt.trigger) === null || _a === void 0 ? void 0 : _a.name, `${(_b = evt === null || evt === void 0 ? void 0 : evt.table) === null || _b === void 0 ? void 0 : _b.schema}-${(_c = evt === null || evt === void 0 ? void 0 : evt.table) === null || _c === void 0 ? void 0 : _c.name}`]
                : isHasuraScheduledEventPayload(evt)
                    ? [evt.name || evt.comment]
                    : [evt.id];
            if (!keys)
                throw new Error('Not a Hasura Event');
            // TODO: this should use a map for faster lookups
            const handlers = eventHandlers.filter((x) => keys.includes(x.key));
            if (this.hasuraModuleConfig.enableEventLogs) {
                this.logger.log(`Received event for: ${keys}`);
            }
            if (handlers && handlers.length) {
                return Promise.all(handlers.map((x) => x.handler(evt)));
            }
            else {
                const errorMessage = `Handler not found for ${keys}`;
                this.logger.error(errorMessage);
                throw new common_1.BadRequestException(errorMessage);
            }
        };
        eventHandlerService.handleEvent = handleEvent;
    }
};
HasuraModule = HasuraModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_discovery_1.DiscoveryModule],
        controllers: [hasura_event_handler_controller_1.EventHandlerController],
    }),
    __param(2, (0, hasura_decorators_1.InjectHasuraConfig)()),
    __metadata("design:paramtypes", [nestjs_discovery_1.DiscoveryService,
        external_context_creator_1.ExternalContextCreator, Object])
], HasuraModule);
exports.HasuraModule = HasuraModule;
//# sourceMappingURL=hasura.module.js.map