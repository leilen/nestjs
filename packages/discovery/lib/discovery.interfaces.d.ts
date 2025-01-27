import { Type } from '@nestjs/common';
export interface DiscoveredModule<T = object> {
  name: string;
  instance: T;
  injectType?: Function | Type<any>;
  dependencyType: Type<T>;
}
export interface DiscoveredClass extends DiscoveredModule {
  parentModule: DiscoveredModule;
}
export interface DiscoveredMethod {
  handler: (...args: any[]) => any;
  methodName: string;
  parentClass: DiscoveredClass;
}
export interface DiscoveredMethodWithMeta<T> {
  discoveredMethod: DiscoveredMethod;
  meta: T;
}
export interface DiscoveredClassWithMeta<T> {
  discoveredClass: DiscoveredClass;
  meta: T;
}
export declare type MetaKey = string | number | symbol;
export declare type Filter<T> = (item: T) => boolean;
//# sourceMappingURL=discovery.interfaces.d.ts.map
