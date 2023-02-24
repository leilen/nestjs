"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeEventHandlerConfig = void 0;
const HasuraMetadataV2_1 = require("../hasura-metadata-dist/HasuraMetadataV2");
const convertEventTriggerDefinition = (configDef) => {
    var _a;
    if (configDef.type === 'insert') {
        return {
            enable_manual: false,
            insert: {
                columns: HasuraMetadataV2_1.Columns.Empty,
            },
        };
    }
    if (configDef.type === 'delete') {
        return {
            enable_manual: false,
            delete: {
                columns: HasuraMetadataV2_1.Columns.Empty,
            },
        };
    }
    return {
        enable_manual: false,
        update: {
            columns: (_a = configDef.columns) !== null && _a !== void 0 ? _a : HasuraMetadataV2_1.Columns.Empty,
        },
    };
};
const mergeEventHandlerConfig = (config, moduleConfig, defaultRetryConfig, existingTableEntry) => {
    var _a;
    const { managedMetaDataConfig } = moduleConfig;
    const { triggerName, definition, retryConfig = defaultRetryConfig } = config;
    const eventTriggers = ((_a = existingTableEntry.event_triggers) !== null && _a !== void 0 ? _a : []).filter((x) => x.name !== triggerName);
    const { intervalInSeconds, numRetries, timeoutInSeconds } = retryConfig;
    return [
        ...eventTriggers,
        {
            name: triggerName,
            definition: convertEventTriggerDefinition(definition),
            retry_conf: {
                num_retries: numRetries,
                interval_sec: intervalInSeconds,
                timeout_sec: timeoutInSeconds,
            },
            webhook_from_env: managedMetaDataConfig === null || managedMetaDataConfig === void 0 ? void 0 : managedMetaDataConfig.nestEndpointEnvName,
            headers: [
                {
                    name: moduleConfig.webhookConfig.secretHeader,
                    value_from_env: managedMetaDataConfig === null || managedMetaDataConfig === void 0 ? void 0 : managedMetaDataConfig.secretHeaderEnvName,
                },
            ],
        },
    ];
};
exports.mergeEventHandlerConfig = mergeEventHandlerConfig;
//# sourceMappingURL=event-triggers.js.map