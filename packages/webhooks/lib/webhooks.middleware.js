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
exports.ConfigurableRawBodyMiddleware = exports.RawBodyMiddleware = exports.JsonBodyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const body_parser_1 = require("body-parser");
const webhooks_decorators_1 = require("./webhooks.decorators");
// https://stackoverflow.com/questions/54346465/access-raw-body-of-stripe-webhook-in-nest-js
/**
 * Wraps the default json bodyParser behavior
 */
let JsonBodyMiddleware = class JsonBodyMiddleware {
    use(req, res, next) {
        (0, body_parser_1.json)()(req, res, next);
    }
};
JsonBodyMiddleware = __decorate([
    (0, common_1.Injectable)()
], JsonBodyMiddleware);
exports.JsonBodyMiddleware = JsonBodyMiddleware;
/**
 * Wraps the default bodyParser raw behavior
 */
let RawBodyMiddleware = class RawBodyMiddleware {
    use(req, res, next) {
        (0, body_parser_1.raw)({ type: '*/*' })(req, res, next);
    }
};
RawBodyMiddleware = __decorate([
    (0, common_1.Injectable)()
], RawBodyMiddleware);
exports.RawBodyMiddleware = RawBodyMiddleware;
/**
 * Copies the raw buffer from the request body onto a configurable request object property  (Defaults to 'rawBody')
 * Can be combined with regular JSON parsing to make both the raw and JSON body values consumable
 * This allows the raw body to be accessed in other middlewares or controllers
 */
let ConfigurableRawBodyMiddleware = class ConfigurableRawBodyMiddleware {
    constructor(config) {
        this.config = config;
    }
    use(req, res, next) {
        (0, body_parser_1.json)({
            verify: (req, res, buffer, encoding) => {
                if (Buffer.isBuffer(buffer)) {
                    const rawBody = Buffer.from(buffer);
                    req[this.config.requestRawBodyProperty] = rawBody;
                }
                return true;
            },
        })(req, res, next);
    }
};
ConfigurableRawBodyMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, webhooks_decorators_1.InjectWebhookConfig)()),
    __metadata("design:paramtypes", [Object])
], ConfigurableRawBodyMiddleware);
exports.ConfigurableRawBodyMiddleware = ConfigurableRawBodyMiddleware;
//# sourceMappingURL=webhooks.middleware.js.map