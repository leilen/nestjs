"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduledEventTriggerMeta = exports.updateEventTriggerMeta = exports.isTrackedHasuraEventHandlerConfig = void 0;
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const event_triggers_1 = require("./metadata/event-triggers");
const utf8 = 'utf-8';
const MISSING_META_CONFIG = 'No configuration for meta available';
const defaultHasuraRetryConfig = {
    intervalInSeconds: 10,
    numRetries: 3,
    timeoutInSeconds: 60,
    toleranceSeconds: 21600,
};
const isTrackedHasuraEventHandlerConfig = (eventHandlerConfig) => {
    return 'definition' in eventHandlerConfig;
};
exports.isTrackedHasuraEventHandlerConfig = isTrackedHasuraEventHandlerConfig;
const updateEventTriggerMetaV2 = (moduleConfig, eventHandlerConfigs) => {
    var _a;
    const { managedMetaDataConfig } = moduleConfig;
    if (!managedMetaDataConfig) {
        throw new Error(MISSING_META_CONFIG);
    }
    const defaultRetryConfig = (_a = managedMetaDataConfig.defaultEventRetryConfig) !== null && _a !== void 0 ? _a : defaultHasuraRetryConfig;
    const tablesYamlPath = `${managedMetaDataConfig.dirPath}/tables.yaml`;
    const tablesMeta = (0, fs_1.readFileSync)(tablesYamlPath, utf8);
    const tableEntries = (0, js_yaml_1.load)(tablesMeta);
    (0, lodash_1.orderBy)(eventHandlerConfigs, (x) => x.triggerName).forEach((config) => {
        const { schema = 'public', tableName } = config;
        const matchingTable = tableEntries.find((x) => x.table.schema === schema && x.table.name === tableName);
        if (!matchingTable) {
            throw new Error(`Table '${tableName}' from schema '${schema}' not found in tables metadata`);
        }
        matchingTable.event_triggers = (0, event_triggers_1.mergeEventHandlerConfig)(config, moduleConfig, defaultRetryConfig, matchingTable);
    });
    const yamlString = (0, js_yaml_1.dump)(tableEntries);
    (0, fs_1.writeFileSync)(tablesYamlPath, yamlString, utf8);
};
const updateEventTriggerMetaV3 = (moduleConfig, eventHandlerConfigs) => {
    var _a;
    const { managedMetaDataConfig } = moduleConfig;
    if (!managedMetaDataConfig) {
        throw new Error(MISSING_META_CONFIG);
    }
    const defaultRetryConfig = (_a = managedMetaDataConfig.defaultEventRetryConfig) !== null && _a !== void 0 ? _a : defaultHasuraRetryConfig;
    eventHandlerConfigs.forEach((config) => {
        const { schema = 'public', databaseName = 'default', tableName } = config;
        const tableYamlPath = `${managedMetaDataConfig.dirPath}/databases/${databaseName}/tables/${schema}_${tableName}.yaml`;
        const tableMeta = (0, fs_1.readFileSync)(tableYamlPath, utf8);
        const tableEntry = (0, js_yaml_1.load)(tableMeta);
        tableEntry.event_triggers = (0, event_triggers_1.mergeEventHandlerConfig)(config, moduleConfig, defaultRetryConfig, tableEntry);
        const yamlString = (0, js_yaml_1.dump)(tableEntry);
        (0, fs_1.writeFileSync)(tableYamlPath, yamlString, utf8);
    });
};
const updateEventTriggerMeta = (moduleConfig, eventHandlerConfigs) => {
    const { managedMetaDataConfig } = moduleConfig;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { metadataVersion = 'v2' } = moduleConfig.managedMetaDataConfig;
    if (!managedMetaDataConfig) {
        throw new Error(MISSING_META_CONFIG);
    }
    if (metadataVersion === 'v2') {
        updateEventTriggerMetaV2(moduleConfig, eventHandlerConfigs);
    }
    else if (metadataVersion === 'v3') {
        updateEventTriggerMetaV3(moduleConfig, eventHandlerConfigs);
    }
    else {
        throw new Error(`Invalid Hasura metadata version: ${metadataVersion}`);
    }
};
exports.updateEventTriggerMeta = updateEventTriggerMeta;
const updateScheduledEventTriggerMeta = (moduleConfig, scheduledEventHandlerConfigs) => {
    var _a, _b;
    const { managedMetaDataConfig } = moduleConfig;
    if (!managedMetaDataConfig) {
        throw new Error(MISSING_META_CONFIG);
    }
    const cronTriggersYamlPath = `${managedMetaDataConfig.dirPath}/cron_triggers.yaml`;
    const cronTriggersMeta = (0, fs_1.readFileSync)(cronTriggersYamlPath, utf8);
    const cronEntries = ((_a = (0, js_yaml_1.load)(cronTriggersMeta)) !== null && _a !== void 0 ? _a : []);
    const managedCronTriggerNames = scheduledEventHandlerConfigs.map((x) => x.name);
    const defaultRetryConfig = (_b = managedMetaDataConfig.defaultEventRetryConfig) !== null && _b !== void 0 ? _b : defaultHasuraRetryConfig;
    const managedCronTriggers = scheduledEventHandlerConfigs.map(({ name, payload, comment, cronSchedule, retryConfig = defaultRetryConfig, }) => {
        return {
            name,
            webhook: `{{${managedMetaDataConfig.nestEndpointEnvName}}}`,
            schedule: cronSchedule,
            include_in_metadata: true,
            payload,
            retry_conf: {
                num_retries: retryConfig.numRetries,
                timeout_seconds: retryConfig.timeoutInSeconds,
                tolerance_seconds: retryConfig.toleranceSeconds,
                retry_interval_seconds: retryConfig.intervalInSeconds,
            },
            headers: [
                {
                    name: moduleConfig.webhookConfig.secretHeader,
                    value_from_env: managedMetaDataConfig.secretHeaderEnvName,
                },
            ],
            comment,
        };
    });
    const newCronEntries = [
        ...cronEntries.filter((x) => !managedCronTriggerNames.includes(x.name)),
        ...managedCronTriggers,
    ];
    const yamlString = (0, js_yaml_1.dump)(newCronEntries);
    (0, fs_1.writeFileSync)(cronTriggersYamlPath, yamlString, utf8);
};
exports.updateScheduledEventTriggerMeta = updateScheduledEventTriggerMeta;
//# sourceMappingURL=hasura.metadata.js.map