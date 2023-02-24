declare const exampleEvent: {
  id: string;
  table: {
    schema: string;
    name: string;
  };
  trigger: {
    name: string;
  };
  event: {
    session_variables: {
      'x-hasura-role': string;
    };
    op: string;
    data: {
      old: null;
      new: ObjectConstructor[];
    };
  };
  delivery_info: {
    current_retry: number;
    max_retries: number;
  };
  created_at: string;
};
export declare type EventOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
declare type EventPayload = {
  session_variables: Record<string, string>;
  op: EventOperation;
  data: {
    old: unknown;
    new: unknown;
  };
};
export declare type TypedEventPayload<T> = Omit<EventPayload, 'data'> & {
  data: {
    old?: T;
    new: T;
  };
};
export declare type InsertEventPayload<T> = Omit<EventPayload, 'data'> & {
  data: {
    old: null;
    new: T;
  };
};
export declare type UpdateEventPayload<T> = Omit<EventPayload, 'data'> & {
  data: {
    old: T;
    new: T;
  };
};
export declare type DeleteEventPayload<T> = Omit<EventPayload, 'data'> & {
  data: {
    old: T;
    new: null;
  };
};
export declare type HasuraEvent = Omit<typeof exampleEvent, 'event'> & {
  event: EventPayload;
};
export declare type TypedHasuraEvent<T> = Omit<HasuraEvent, 'event'> & {
  event: TypedEventPayload<T>;
};
export declare type HasuraInsertEvent<T> = Omit<HasuraEvent, 'event'> & {
  event: InsertEventPayload<T>;
};
export declare type HasuraUpdateEvent<T> = Omit<HasuraEvent, 'event'> & {
  event: UpdateEventPayload<T>;
};
export declare type HasuraDeleteEvent<T> = Omit<HasuraEvent, 'event'> & {
  event: DeleteEventPayload<T>;
};
export interface HasuraEventHandlerConfig {
  /**
   * The name of the Hasura Trigger which created this event
   */
  triggerName: string;
}
declare type InsertDefinition = {
  type: 'insert';
};
declare type DeleteDefinition = {
  type: 'delete';
};
declare type UpdateDefinition = {
  type: 'update';
  columns?: string[];
};
export interface EventRetryConfig {
  numRetries: number;
  timeoutInSeconds: number;
  intervalInSeconds: number;
}
export interface ScheduledEventRetryConfig extends EventRetryConfig {
  toleranceSeconds: number;
}
export interface TrackedHasuraEventHandlerConfig {
  /**
   * Only necessary to provide this value if working with Metadata V3. Defaults to 'default'
   */
  databaseName?: string;
  schema?: string;
  tableName: string;
  triggerName: string;
  retryConfig?: EventRetryConfig;
  definition: InsertDefinition | DeleteDefinition | UpdateDefinition;
}
export interface TrackedHasuraScheduledEventHandlerConfig {
  name: string;
  cronSchedule: string;
  payload: any;
  comment?: string;
  retryConfig?: ScheduledEventRetryConfig;
}
export declare enum CommonCronSchedules {
  EveryMinute = '* * * * *',
  EveryTenMinutes = '*/10 * * * *',
  EveryMidnight = '0 0 * * *',
  EveryMonthStart = '0 0 1 * *',
  EveryFridayNoon = '0 12 * * 5',
}
export interface HasuraScheduledEventPayload<T = Record<string, any>> {
  scheduled_time: Date;
  payload: T;
  name?: string;
  comment?: string;
  created_at: Date;
  id: string;
}
export interface HasuraModuleConfig {
  /**
   * Configuration for validating webhooks from Hasura for Events and Actions
   */
  webhookConfig: {
    /**
     * The name of the Header that Hasura will send along with all event payloads
     */
    secretHeader: string;
    /**
     * The value of the secret Header. The Hasura module will ensure that incoming webhook payloads contain this
     * value in order to validate that it is a trusted request
     */
    secretFactory: (() => string) | string;
  };
  /**
   *  Important: This should only be enabled for local development
   *
   * Including this configuration will allow Table Event triggers and Scheduled Events to be
   * automatically managed inside of your Hasura metadata. This effectively makes the NestJS
   * application code the source of truth for their configuration and removes a significant
   * amount of boilerplate
   */
  managedMetaDataConfig?: {
    /**
     * The version of hasura metadata being targeted
     */
    metadataVersion?: 'v2' | 'v3';
    /**
     * The ENV key in which Hasura will store the secret header value used to validate event payloads
     */
    secretHeaderEnvName: string;
    /**
     * The ENV key in which Hasura will store the NestJS endpoint for delivering events
     */
    nestEndpointEnvName: string;
    /**
     * The path to the hasura metadata directory
     */
    dirPath: string;
    /**
     * Default retry configuration that will be used for events that do not specify their own retry config
     */
    defaultEventRetryConfig?: ScheduledEventRetryConfig;
  };
  enableEventLogs?: boolean;
  /**
   * The default controller prefix that will be used for exposing a Webhook that can be used by Hasura
   * to send events. Defaults to 'hasura'
   */
  controllerPrefix?: string;
  /**
   * An optional array of class decorators to apply to the `EventHandlerController`. These decorators can
   * only apply metadata that will be read at request time, and not read at start time (i.e. you cannot use
   * `@UseGuards()`, `@UseInterceptor()` or any other NestJS enhancer decorators)
   */
  decorators?: ClassDecorator[];
}
export declare type HasuraAction<T = Record<string, string>> = {
  action: {
    name: string;
  };
  session_variables: Record<string, string>;
  input: T;
};
export {};
//# sourceMappingURL=hasura.interfaces.d.ts.map
