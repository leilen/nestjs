import { Channel, ConsumeMessage } from 'amqplib';
import { QueueOptions } from '../rabbitmq.interfaces';
export declare enum MessageHandlerErrorBehavior {
  ACK = 'ACK',
  NACK = 'NACK',
  REQUEUE = 'REQUEUE',
}
export declare type MessageErrorHandler = (
  channel: Channel,
  msg: ConsumeMessage,
  error: any
) => Promise<void> | void;
/**
 * An error handler that will ack the message which caused an error during processing
 */
export declare const ackErrorHandler: MessageErrorHandler;
/**
 * An error handler that will nack and requeue a message which created an error during processing
 */
export declare const requeueErrorHandler: MessageErrorHandler;
/**
 * An error handler that will nack a message which created an error during processing
 */
export declare const defaultNackErrorHandler: MessageErrorHandler;
export declare const getHandlerForLegacyBehavior: (
  behavior: MessageHandlerErrorBehavior
) => MessageErrorHandler;
export declare type AssertQueueErrorHandler = (
  channel: Channel,
  queueName: string,
  queueOptions: QueueOptions | undefined,
  error: any
) => Promise<string> | string;
/**
 * Just rethrows the error
 */
export declare const defaultAssertQueueErrorHandler: AssertQueueErrorHandler;
/**
 * Tries to delete the queue and to redeclare it with the provided options
 */
export declare const forceDeleteAssertQueueErrorHandler: AssertQueueErrorHandler;
//# sourceMappingURL=errorBehaviors.d.ts.map
