import 'reflect-metadata';
import { PipeTransform, Type } from '@nestjs/common';
import { RabbitHandlerConfig } from './rabbitmq.interfaces';
export declare const makeRabbitDecorator: <
  T extends Partial<RabbitHandlerConfig>
>(
  input: T
) => (
  config: Pick<
    RabbitHandlerConfig,
    | Exclude<'queue', keyof T>
    | Exclude<'type', keyof T>
    | Exclude<'name', keyof T>
    | Exclude<'connection', keyof T>
    | Exclude<'exchange', keyof T>
    | Exclude<'routingKey', keyof T>
    | Exclude<'createQueueIfNotExists', keyof T>
    | Exclude<'assertQueueErrorHandler', keyof T>
    | Exclude<'queueOptions', keyof T>
    | Exclude<'errorBehavior', keyof T>
    | Exclude<'errorHandler', keyof T>
    | Exclude<'allowNonJsonMessages', keyof T>
  >
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
export declare const RabbitHandler: (
  config: RabbitHandlerConfig
) => (
  target: any,
  key: any,
  descriptor: any
) => void | TypedPropertyDescriptor<unknown>;
export declare const RabbitSubscribe: (
  config: Pick<
    RabbitHandlerConfig,
    | 'queue'
    | 'name'
    | 'connection'
    | 'exchange'
    | 'routingKey'
    | 'createQueueIfNotExists'
    | 'assertQueueErrorHandler'
    | 'queueOptions'
    | 'errorBehavior'
    | 'errorHandler'
    | 'allowNonJsonMessages'
  >
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
export declare const RabbitRPC: (
  config: Pick<
    RabbitHandlerConfig,
    | 'queue'
    | 'name'
    | 'connection'
    | 'exchange'
    | 'routingKey'
    | 'createQueueIfNotExists'
    | 'assertQueueErrorHandler'
    | 'queueOptions'
    | 'errorBehavior'
    | 'errorHandler'
    | 'allowNonJsonMessages'
  >
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
export declare const InjectRabbitMQConfig: () => ParameterDecorator;
export declare const createPipesRpcParamDecorator: (
  data?: any,
  type?: number,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => ParameterDecorator;
export declare function RabbitPayload(): ParameterDecorator;
export declare function RabbitPayload(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export declare function RabbitPayload(
  propertyKey?: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export declare function RabbitHeader(): ParameterDecorator;
export declare function RabbitHeader(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export declare function RabbitHeader(
  propertyKey?: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export declare function RabbitRequest(): ParameterDecorator;
export declare function RabbitRequest(
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
export declare function RabbitRequest(
  propertyKey?: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;
//# sourceMappingURL=rabbitmq.decorators.d.ts.map
