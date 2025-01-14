import { ChannelWrapper, AmqpConnectionManager } from 'amqp-connection-manager';
import {
  ConsumeMessage,
  Channel,
  Connection,
  ConfirmChannel,
  Options,
} from 'amqplib';
import { Replies } from 'amqplib/properties';
import {
  MessageHandlerOptions,
  RabbitMQConfig,
  RequestOptions,
} from '../rabbitmq.interfaces';
import { RpcResponse, SubscribeResponse } from './handlerResponses';
export declare type ConsumerTag = string;
export declare type SubscriberHandler<T = unknown> = (
  msg: T | undefined,
  rawMessage?: ConsumeMessage,
  headers?: any
) => Promise<SubscribeResponse>;
export interface CorrelationMessage {
  correlationId: string;
  message: Record<string, unknown>;
}
export interface SubscriptionResult {
  consumerTag: ConsumerTag;
}
export declare type BaseConsumerHandler = {
  consumerTag: string;
  channel: ConfirmChannel;
};
export declare type ConsumerHandler<T, U> =
  | (BaseConsumerHandler & {
      type: 'subscribe';
      msgOptions: MessageHandlerOptions;
      handler: (
        msg: T | undefined,
        rawMessage?: ConsumeMessage,
        headers?: any
      ) => Promise<SubscribeResponse>;
    })
  | (BaseConsumerHandler & {
      type: 'rpc';
      rpcOptions: MessageHandlerOptions;
      handler: (
        msg: T | undefined,
        rawMessage?: ConsumeMessage,
        headers?: any
      ) => Promise<RpcResponse<U>>;
    });
export declare class AmqpConnection {
  private readonly messageSubject;
  private readonly logger;
  private readonly initialized;
  private _managedConnection;
  /**
   * Will now specify the default managed channel.
   */
  private _managedChannel;
  private _managedChannels;
  /**
   * Will now specify the default channel.
   */
  private _channel;
  private _channels;
  private _connection?;
  private _consumers;
  private readonly config;
  constructor(config: RabbitMQConfig);
  get channel(): Channel;
  get connection(): Connection;
  get managedChannel(): ChannelWrapper;
  get managedConnection(): AmqpConnectionManager;
  get configuration(): Required<RabbitMQConfig>;
  get channels(): Record<string, ConfirmChannel>;
  get managedChannels(): Record<string, ChannelWrapper>;
  get connected(): boolean;
  init(): Promise<void>;
  private initCore;
  private setupInitChannel;
  private initDirectReplyQueue;
  request<T>(requestOptions: RequestOptions): Promise<T>;
  createSubscriber<T>(
    handler: SubscriberHandler<T>,
    msgOptions: MessageHandlerOptions,
    originalHandlerName: string
  ): Promise<SubscriptionResult>;
  private setupSubscriberChannel;
  createRpc<T, U>(
    handler: (
      msg: T | undefined,
      rawMessage?: ConsumeMessage,
      headers?: any
    ) => Promise<RpcResponse<U>>,
    rpcOptions: MessageHandlerOptions
  ): Promise<SubscriptionResult>;
  setupRpcChannel<T, U>(
    handler: (
      msg: T | undefined,
      rawMessage?: ConsumeMessage,
      headers?: any
    ) => Promise<RpcResponse<U>>,
    rpcOptions: MessageHandlerOptions,
    channel: ConfirmChannel
  ): Promise<ConsumerTag>;
  publish<T = any>(
    exchange: string,
    routingKey: string,
    message: T,
    options?: Options.Publish
  ): Promise<Replies.Empty>;
  private handleMessage;
  private setupQueue;
  private setupManagedChannel;
  /**
   * Selects managed channel based on name, if not found uses default.
   * @param name name of the channel
   * @returns channel wrapper
   */
  private selectManagedChannel;
  private registerConsumerForQueue;
  private unregisterConsumerForQueue;
  private getConsumer;
  cancelConsumer(consumerTag: ConsumerTag): Promise<void>;
  resumeConsumer<T, U>(consumerTag: ConsumerTag): Promise<ConsumerTag | null>;
}
//# sourceMappingURL=connection.d.ts.map
