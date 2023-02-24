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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEventHandlerService = exports.copyCleanTemplateYamlFile = exports.getVersionedMetadataPathAndConfig = exports.yamlFileToJson = exports.baseConfig = exports.metadataVersion = void 0;
const common_1 = require("@nestjs/common");
const hasura_decorators_1 = require("../hasura.decorators");
const hasura_interfaces_1 = require("../hasura.interfaces");
const path = require("path");
const fs = require("fs");
const zod_1 = require("zod");
const js_yaml_1 = require("js-yaml");
exports.metadataVersion = zod_1.z.enum(['v2', 'v3']);
exports.baseConfig = {
    webhookConfig: {
        secretFactory: 'secret',
        secretHeader: 'NESTJS_SECRET_HEADER',
    },
    managedMetaDataConfig: {
        secretHeaderEnvName: 'NESTJS_WEBHOOK_SECRET_HEADER_VALUE',
        nestEndpointEnvName: 'NESTJS_EVENT_WEBHOOK_ENDPOINT',
        defaultEventRetryConfig: {
            intervalInSeconds: 15,
            numRetries: 3,
            timeoutInSeconds: 100,
            toleranceSeconds: 21600,
        },
    },
};
const yamlFileToJson = (filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return (0, js_yaml_1.load)(fileContents);
};
exports.yamlFileToJson = yamlFileToJson;
const getVersionedMetadataPathAndConfig = (v) => {
    const version = exports.metadataVersion.parse(v);
    const metadataPath = path.join(__dirname, `../../test/__fixtures__/hasura/${version}/metadata`);
    const { managedMetaDataConfig } = exports.baseConfig;
    return [
        metadataPath,
        Object.assign(Object.assign({}, exports.baseConfig), { managedMetaDataConfig: Object.assign({ dirPath: metadataPath, metadataVersion: version }, managedMetaDataConfig) }),
    ];
};
exports.getVersionedMetadataPathAndConfig = getVersionedMetadataPathAndConfig;
const copyCleanTemplateYamlFile = (yamlPath) => {
    if (fs.existsSync(yamlPath)) {
        fs.unlinkSync(yamlPath);
    }
    fs.copyFileSync(`${yamlPath}.tmpl`, yamlPath);
};
exports.copyCleanTemplateYamlFile = copyCleanTemplateYamlFile;
let TestEventHandlerService = class TestEventHandlerService {
    defaultHandler() {
        console.log('default');
    }
    additionalHandler() {
        console.log('additional');
    }
    scheduled() {
        console.log('scheduled');
    }
};
__decorate([
    (0, hasura_decorators_1.TrackedHasuraEventHandler)({
        tableName: 'default_table',
        triggerName: 'default_table_event_handler',
        definition: {
            type: 'insert',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEventHandlerService.prototype, "defaultHandler", null);
__decorate([
    (0, hasura_decorators_1.TrackedHasuraEventHandler)({
        databaseName: 'additional',
        tableName: 'additional_table',
        triggerName: 'additional_table_event_handler',
        definition: {
            type: 'delete',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEventHandlerService.prototype, "additionalHandler", null);
__decorate([
    (0, hasura_decorators_1.TrackedHasuraScheduledEventHandler)({
        cronSchedule: hasura_interfaces_1.CommonCronSchedules.EveryMinute,
        name: 'scheduled',
        payload: { message: 'hello' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestEventHandlerService.prototype, "scheduled", null);
TestEventHandlerService = __decorate([
    (0, common_1.Injectable)()
], TestEventHandlerService);
exports.TestEventHandlerService = TestEventHandlerService;
//# sourceMappingURL=hasura.metadata.spec-utils.js.map