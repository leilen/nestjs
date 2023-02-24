"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackedHasuraScheduledEventHandler = exports.TrackedHasuraEventHandler = exports.InjectHasuraConfig = exports.HasuraEventHandler = void 0;
const nestjs_common_1 = require("@golevelup/nestjs-common");
const common_1 = require("@nestjs/common");
const hasura_constants_1 = require("./hasura.constants");
const HasuraEventHandler = (config) => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(hasura_constants_1.HASURA_EVENT_HANDLER, config));
exports.HasuraEventHandler = HasuraEventHandler;
exports.InjectHasuraConfig = (0, nestjs_common_1.makeInjectableDecorator)(hasura_constants_1.HASURA_MODULE_CONFIG);
const TrackedHasuraEventHandler = (config) => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(hasura_constants_1.HASURA_EVENT_HANDLER, config));
exports.TrackedHasuraEventHandler = TrackedHasuraEventHandler;
const TrackedHasuraScheduledEventHandler = (config) => (0, common_1.applyDecorators)((0, common_1.SetMetadata)(hasura_constants_1.HASURA_SCHEDULED_EVENT_HANDLER, config), (0, common_1.SetMetadata)(hasura_constants_1.HASURA_EVENT_HANDLER, { triggerName: config.name }));
exports.TrackedHasuraScheduledEventHandler = TrackedHasuraScheduledEventHandler;
//# sourceMappingURL=hasura.decorators.js.map