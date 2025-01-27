"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpConnection = void 0;
const common_1 = require("@nestjs/common");
const amqp_connection_manager_1 = require("amqp-connection-manager");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const crypto_1 = require("crypto");
const __1 = require("..");
const errorBehaviors_1 = require("./errorBehaviors");
const handlerResponses_1 = require("./handlerResponses");
const lodash_1 = require("lodash");
const DIRECT_REPLY_QUEUE = 'amq.rabbitmq.reply-to';
const defaultConfig = {
    name: 'default',
    prefetchCount: 10,
    defaultExchangeType: 'topic',
    defaultRpcErrorBehavior: errorBehaviors_1.MessageHandlerErrorBehavior.REQUEUE,
    defaultSubscribeErrorBehavior: errorBehaviors_1.MessageHandlerErrorBehavior.REQUEUE,
    exchanges: [],
    defaultRpcTimeout: 10000,
    connectionInitOptions: {
        wait: true,
        timeout: 5000,
        reject: true,
    },
    connectionManagerOptions: {},
    registerHandlers: true,
    enableDirectReplyTo: true,
    channels: {},
    handlers: {},
    enableControllerDiscovery: false,
};
class AmqpConnection {
    constructor(config) {
        this.messageSubject = new rxjs_1.Subject();
        this.initialized = new rxjs_1.Subject();
        this._managedChannels = {};
        this._channels = {};
        this._consumers = {};
        this.config = Object.assign(Object.assign({ deserializer: (message) => JSON.parse(message.toString()), serializer: (value) => Buffer.from(JSON.stringify(value)), logger: config.logger || new common_1.Logger(AmqpConnection.name) }, defaultConfig), config);
        this.logger = this.config.logger;
    }
    get channel() {
        if (!this._channel)
            throw new Error('channel is not available');
        return this._channel;
    }
    get connection() {
        if (!this._connection)
            throw new Error('connection is not available');
        return this._connection;
    }
    get managedChannel() {
        return this._managedChannel;
    }
    get managedConnection() {
        return this._managedConnection;
    }
    get configuration() {
        return this.config;
    }
    get channels() {
        return this._channels;
    }
    get managedChannels() {
        return this._managedChannels;
    }
    get connected() {
        return this._managedConnection.isConnected();
    }
    async init() {
        const options = Object.assign(Object.assign({}, defaultConfig.connectionInitOptions), this.config.connectionInitOptions);
        const { wait, timeout: timeoutInterval, reject } = options;
        const p = this.initCore();
        if (!wait)
            return p;
        return (0, rxjs_1.lastValueFrom)(this.initialized.pipe((0, operators_1.take)(1), (0, operators_1.timeout)({
            each: timeoutInterval,
            with: () => (0, rxjs_1.throwError)(() => new Error(`Failed to connect to a RabbitMQ broker within a timeout of ${timeoutInterval}ms`)),
        }), (0, operators_1.catchError)((err) => (reject ? (0, rxjs_1.throwError)(() => err) : rxjs_1.EMPTY))));
    }
    async initCore() {
        this.logger.log(`Trying to connect to RabbitMQ broker (${this.config.name})`);
        this._managedConnection = (0, amqp_connection_manager_1.connect)(Array.isArray(this.config.uri) ? this.config.uri : [this.config.uri], this.config.connectionManagerOptions);
        this._managedConnection.on('connect', ({ connection }) => {
            this._connection = connection;
            this.logger.log(`Successfully connected to RabbitMQ broker (${this.config.name})`);
        });
        this._managedConnection.on('disconnect', ({ err }) => {
            this.logger.error(`Disconnected from RabbitMQ broker (${this.config.name})`, err === null || err === void 0 ? void 0 : err.stack);
        });
        const defaultChannel = {
            name: AmqpConnection.name,
            config: {
                prefetchCount: this.config.prefetchCount,
                default: true,
            },
        };
        await Promise.all([
            Object.keys(this.config.channels).map(async (channelName) => {
                const config = this.config.channels[channelName];
                // Only takes the first channel specified as default so other ones get created.
                if (defaultChannel.name === AmqpConnection.name && config.default) {
                    defaultChannel.name = channelName;
                    defaultChannel.config.prefetchCount =
                        config.prefetchCount || this.config.prefetchCount;
                    return;
                }
                return this.setupManagedChannel(channelName, Object.assign(Object.assign({}, config), { default: false }));
            }),
            this.setupManagedChannel(defaultChannel.name, defaultChannel.config),
        ]);
    }
    async setupInitChannel(channel, name, config) {
        this._channels[name] = channel;
        await channel.prefetch(config.prefetchCount || this.config.prefetchCount);
        if (config.default) {
            this._channel = channel;
            // Always assert exchanges & rpc queue in default channel.
            this.config.exchanges.forEach((x) => {
                const { createExchangeIfNotExists = true } = x;
                if (createExchangeIfNotExists) {
                    return channel.assertExchange(x.name, x.type || this.config.defaultExchangeType, x.options);
                }
                return channel.checkExchange(x.name);
            });
            if (this.config.enableDirectReplyTo) {
                await this.initDirectReplyQueue(channel);
            }
            this.initialized.next();
        }
    }
    async initDirectReplyQueue(channel) {
        // Set up a consumer on the Direct Reply-To queue to facilitate RPC functionality
        await channel.consume(DIRECT_REPLY_QUEUE, async (msg) => {
            if (msg == null) {
                return;
            }
            // Check that the Buffer has content, before trying to parse it
            const message = msg.content.length > 0
                ? this.config.deserializer(msg.content)
                : undefined;
            const correlationMessage = {
                correlationId: msg.properties.correlationId.toString(),
                message: message,
            };
            this.messageSubject.next(correlationMessage);
        }, {
            noAck: true,
        });
    }
    async request(requestOptions) {
        const correlationId = requestOptions.correlationId || (0, crypto_1.randomUUID)();
        const timeout = requestOptions.timeout || this.config.defaultRpcTimeout;
        const payload = requestOptions.payload || {};
        const response$ = this.messageSubject.pipe((0, operators_1.filter)((x) => x.correlationId === correlationId), (0, operators_1.map)((x) => x.message), (0, operators_1.first)());
        await this.publish(requestOptions.exchange, requestOptions.routingKey, payload, {
            replyTo: DIRECT_REPLY_QUEUE,
            correlationId,
            headers: requestOptions.headers,
            expiration: requestOptions.expiration,
        });
        const timeout$ = (0, rxjs_1.interval)(timeout).pipe((0, operators_1.first)(), (0, operators_1.map)(() => {
            throw new Error(`Failed to receive response within timeout of ${timeout}ms for exchange "${requestOptions.exchange}" and routing key "${requestOptions.routingKey}"`);
        }));
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.race)(response$, timeout$));
    }
    async createSubscriber(handler, msgOptions, originalHandlerName) {
        return new Promise((res) => {
            var _a;
            let result;
            this.selectManagedChannel((_a = msgOptions === null || msgOptions === void 0 ? void 0 : msgOptions.queueOptions) === null || _a === void 0 ? void 0 : _a.channel)
                .addSetup(async (channel) => {
                const consumerTag = await this.setupSubscriberChannel(handler, msgOptions, channel, originalHandlerName);
                result = { consumerTag };
            })
                .then(() => {
                res(result);
            });
        });
    }
    async setupSubscriberChannel(handler, msgOptions, channel, originalHandlerName = 'unknown') {
        const queue = await this.setupQueue(msgOptions, channel);
        const { consumerTag } = await channel.consume(queue, async (msg) => {
            try {
                if ((0, lodash_1.isNull)(msg)) {
                    throw new Error('Received null message');
                }
                const response = await this.handleMessage(handler, msg, msgOptions.allowNonJsonMessages);
                if (response instanceof handlerResponses_1.Nack) {
                    channel.nack(msg, false, response.requeue);
                    return;
                }
                // developers should be responsible to avoid subscribers that return therefore
                // the request will be acknowledged
                if (response) {
                    this.logger.warn(`Received response: [${this.config.serializer(response)}] from subscribe handler [${originalHandlerName}]. Subscribe handlers should only return void`);
                }
                channel.ack(msg);
            }
            catch (e) {
                if ((0, lodash_1.isNull)(msg)) {
                    return;
                }
                else {
                    const errorHandler = msgOptions.errorHandler ||
                        (0, errorBehaviors_1.getHandlerForLegacyBehavior)(msgOptions.errorBehavior ||
                            this.config.defaultSubscribeErrorBehavior);
                    await errorHandler(channel, msg, e);
                }
            }
        });
        this.registerConsumerForQueue({
            type: 'subscribe',
            consumerTag,
            handler,
            msgOptions,
            channel,
        });
        return consumerTag;
    }
    async createRpc(handler, rpcOptions) {
        return new Promise((res) => {
            var _a;
            let result;
            this.selectManagedChannel((_a = rpcOptions === null || rpcOptions === void 0 ? void 0 : rpcOptions.queueOptions) === null || _a === void 0 ? void 0 : _a.channel)
                .addSetup(async (channel) => {
                const consumerTag = await this.setupRpcChannel(handler, rpcOptions, channel);
                result = { consumerTag };
                res({ consumerTag });
            })
                .then(() => {
                res(result);
            });
        });
    }
    async setupRpcChannel(handler, rpcOptions, channel) {
        const queue = await this.setupQueue(rpcOptions, channel);
        const { consumerTag } = await channel.consume(queue, async (msg) => {
            try {
                if (msg == null) {
                    throw new Error('Received null message');
                }
                const response = await this.handleMessage(handler, msg, rpcOptions.allowNonJsonMessages);
                if (response instanceof handlerResponses_1.Nack) {
                    channel.nack(msg, false, response.requeue);
                    return;
                }
                const { replyTo, correlationId, expiration, headers } = msg.properties;
                if (replyTo) {
                    await this.publish('', replyTo, response, {
                        correlationId,
                        expiration,
                        headers,
                    });
                }
                channel.ack(msg);
            }
            catch (e) {
                if (msg == null) {
                    return;
                }
                else {
                    const errorHandler = rpcOptions.errorHandler ||
                        (0, errorBehaviors_1.getHandlerForLegacyBehavior)(rpcOptions.errorBehavior ||
                            this.config.defaultSubscribeErrorBehavior);
                    await errorHandler(channel, msg, e);
                }
            }
        });
        this.registerConsumerForQueue({
            type: 'rpc',
            consumerTag,
            handler,
            rpcOptions,
            channel,
        });
        return consumerTag;
    }
    publish(exchange, routingKey, message, options) {
        // source amqplib channel is used directly to keep the behavior of throwing connection related errors
        if (!this.managedConnection.isConnected() || !this._channel) {
            throw new Error('AMQP connection is not available');
        }
        let buffer;
        if (message instanceof Buffer) {
            buffer = message;
        }
        else if (message instanceof Uint8Array) {
            buffer = Buffer.from(message);
        }
        else if (message != null) {
            buffer = this.config.serializer(message);
        }
        else {
            buffer = Buffer.alloc(0);
        }
        return new Promise((resolve, reject) => {
            this._channel.publish(exchange, routingKey, buffer, options, (err, ok) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(ok);
                }
            });
        });
    }
    handleMessage(handler, msg, allowNonJsonMessages) {
        let message = undefined;
        let headers = undefined;
        if (msg.content) {
            if (allowNonJsonMessages) {
                try {
                    message = this.config.deserializer(msg.content);
                }
                catch (_a) {
                    // Let handler handle parsing error, it has the raw message anyway
                    message = undefined;
                }
            }
            else {
                message = this.config.deserializer(msg.content);
            }
        }
        if (msg.properties && msg.properties.headers) {
            headers = msg.properties.headers;
        }
        return handler(message, msg, headers);
    }
    async setupQueue(subscriptionOptions, channel) {
        const { exchange, routingKey, createQueueIfNotExists = true, assertQueueErrorHandler = __1.defaultAssertQueueErrorHandler, queueOptions, queue: queueName = '', } = subscriptionOptions;
        let actualQueue;
        if (createQueueIfNotExists) {
            try {
                const { queue } = await channel.assertQueue(queueName, queueOptions);
                actualQueue = queue;
            }
            catch (error) {
                actualQueue = await assertQueueErrorHandler(channel, queueName, queueOptions, error);
            }
        }
        else {
            const { queue } = await channel.checkQueue(subscriptionOptions.queue || '');
            actualQueue = queue;
        }
        let bindQueueArguments;
        if (subscriptionOptions.queueOptions) {
            bindQueueArguments = subscriptionOptions.queueOptions.bindQueueArguments;
        }
        const routingKeys = Array.isArray(routingKey) ? routingKey : [routingKey];
        if (exchange && routingKeys) {
            await Promise.all(routingKeys.map((routingKey) => {
                if (routingKey != null) {
                    channel.bindQueue(actualQueue, exchange, routingKey, bindQueueArguments);
                }
            }));
        }
        return actualQueue;
    }
    setupManagedChannel(name, config) {
        const channel = this._managedConnection.createChannel({
            name,
        });
        this._managedChannels[name] = channel;
        if (config.default) {
            this._managedChannel = channel;
        }
        channel.on('connect', () => this.logger.log(`Successfully connected a RabbitMQ channel "${name}"`));
        channel.on('error', (err, { name }) => this.logger.log(`Failed to setup a RabbitMQ channel - name: ${name} / error: ${err.message} ${err.stack}`));
        channel.on('close', () => this.logger.log(`Successfully closed a RabbitMQ channel "${name}"`));
        return channel.addSetup((c) => this.setupInitChannel(c, name, config));
    }
    /**
     * Selects managed channel based on name, if not found uses default.
     * @param name name of the channel
     * @returns channel wrapper
     */
    selectManagedChannel(name) {
        if (!name)
            return this._managedChannel;
        const channel = this._managedChannels[name];
        if (!channel) {
            this.logger.warn(`Channel "${name}" does not exist, using default channel.`);
            return this._managedChannel;
        }
        return channel;
    }
    registerConsumerForQueue(consumer) {
        this._consumers[consumer.consumerTag] = consumer;
    }
    unregisterConsumerForQueue(consumerTag) {
        delete this._consumers[consumerTag];
    }
    getConsumer(consumerTag) {
        return this._consumers[consumerTag];
    }
    async cancelConsumer(consumerTag) {
        const consumer = this.getConsumer(consumerTag);
        if (consumer && consumer.channel) {
            await consumer.channel.cancel(consumerTag);
        }
    }
    async resumeConsumer(consumerTag) {
        const consumer = this.getConsumer(consumerTag);
        if (!consumer) {
            return null;
        }
        let newConsumerTag;
        if (consumer.type === 'rpc') {
            newConsumerTag = await this.setupRpcChannel(consumer.handler, consumer.rpcOptions, consumer.channel);
        }
        else {
            newConsumerTag = await this.setupSubscriberChannel(consumer.handler, consumer.msgOptions, consumer.channel);
        }
        // A new consumerTag was created, remove old
        this.unregisterConsumerForQueue(consumerTag);
        return newConsumerTag;
    }
}
exports.AmqpConnection = AmqpConnection;
//# sourceMappingURL=connection.js.map