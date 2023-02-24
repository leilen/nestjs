import {
  HasuraEventHandlerConfig,
  TrackedHasuraEventHandlerConfig,
  TrackedHasuraScheduledEventHandlerConfig,
} from './hasura.interfaces';
export declare const HasuraEventHandler: (
  config: HasuraEventHandlerConfig
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
export declare const InjectHasuraConfig: () => ParameterDecorator;
export declare const TrackedHasuraEventHandler: (
  config: TrackedHasuraEventHandlerConfig
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
export declare const TrackedHasuraScheduledEventHandler: (
  config: TrackedHasuraScheduledEventHandlerConfig
) => <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined
) => void;
//# sourceMappingURL=hasura.decorators.d.ts.map
