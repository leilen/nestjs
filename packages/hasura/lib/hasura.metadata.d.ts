import {
  HasuraEventHandlerConfig,
  HasuraModuleConfig,
  TrackedHasuraEventHandlerConfig,
  TrackedHasuraScheduledEventHandlerConfig,
} from './hasura.interfaces';
export declare const isTrackedHasuraEventHandlerConfig: (
  eventHandlerConfig: HasuraEventHandlerConfig | TrackedHasuraEventHandlerConfig
) => eventHandlerConfig is TrackedHasuraEventHandlerConfig;
export declare const updateEventTriggerMeta: (
  moduleConfig: HasuraModuleConfig,
  eventHandlerConfigs: TrackedHasuraEventHandlerConfig[]
) => void;
export declare const updateScheduledEventTriggerMeta: (
  moduleConfig: HasuraModuleConfig,
  scheduledEventHandlerConfigs: TrackedHasuraScheduledEventHandlerConfig[]
) => void;
//# sourceMappingURL=hasura.metadata.d.ts.map
