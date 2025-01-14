import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import {
  DynamicModule,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { AmqpConnection } from './amqp/connection';
import { AmqpConnectionManager } from './amqp/connectionManager';
import { RabbitRpcParamsFactory } from './rabbitmq.factory';
import { RabbitMQConfig } from './rabbitmq.interfaces';
declare const RabbitMQModule_base: IConfigurableDynamicRootModule<
  RabbitMQModule,
  RabbitMQConfig
>;
export declare class RabbitMQModule
  extends RabbitMQModule_base
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly discover;
  private readonly externalContextCreator;
  private readonly rpcParamsFactory;
  private readonly connectionManager;
  private readonly logger;
  private static connectionManager;
  private static bootstrapped;
  constructor(
    discover: DiscoveryService,
    externalContextCreator: ExternalContextCreator,
    rpcParamsFactory: RabbitRpcParamsFactory,
    connectionManager: AmqpConnectionManager
  );
  static AmqpConnectionFactory(config: RabbitMQConfig): Promise<AmqpConnection>;
  static build(config: RabbitMQConfig): DynamicModule;
  static attach(connection: AmqpConnection): DynamicModule;
  onApplicationShutdown(): Promise<void>;
  onApplicationBootstrap(): Promise<void>;
}
export {};
//# sourceMappingURL=rabbitmq.module.d.ts.map
