import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import {
  DiscoveredClass,
  DiscoveredClassWithMeta,
  DiscoveredMethodWithMeta,
  Filter,
  MetaKey,
} from './discovery.interfaces';
/**
 * Attempts to retrieve meta information from a Nest DiscoveredClass component
 * @param key The meta key to retrieve data from
 * @param component The discovered component to retrieve meta from
 */
export declare function getComponentMetaAtKey<T>(
  key: MetaKey,
  component: DiscoveredClass
): T | undefined;
/**
 * A filter that can be used to search for DiscoveredClasses in an App that contain meta attached to a
 * certain key
 * @param key The meta key to search for
 */
export declare const withMetaAtKey: (key: MetaKey) => Filter<DiscoveredClass>;
export declare class DiscoveryService {
  private readonly modulesContainer;
  private readonly metadataScanner;
  private discoveredControllers?;
  private discoveredProviders?;
  constructor(
    modulesContainer: ModulesContainer,
    metadataScanner: MetadataScanner
  );
  /**
   * Discovers all providers in a Nest App that match a filter
   * @param filter
   */
  providers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]>;
  /**
   * Discovers all controller methods that either directly have a certain meta key attached to them
   * or belong to a controller that has the same meta key attached to them
   * @param metaKey The meta key to scan for
   * @param metaFilter An optional filter for the contents of the meta object
   */
  methodsAndControllerMethodsWithMetaAtKey<T>(
    metaKey: MetaKey,
    metaFilter?: Filter<T>
  ): Promise<DiscoveredMethodWithMeta<T>[]>;
  /**
   * Discovers all providers in an App that have meta at a specific key and returns the provider(s) and associated meta
   * @param metaKey The metakey to scan for
   */
  providersWithMetaAtKey<T>(
    metaKey: MetaKey
  ): Promise<DiscoveredClassWithMeta<T>[]>;
  /**
   * Discovers all controllers in a Nest App that match a filter
   * @param filter
   */
  controllers(filter: Filter<DiscoveredClass>): Promise<DiscoveredClass[]>;
  /**
   * Discovers all controllers in an App that have meta at a specific key and returns the controller(s) and associated meta
   * @param metaKey The metakey to scan for
   */
  controllersWithMetaAtKey<T>(
    metaKey: MetaKey
  ): Promise<DiscoveredClassWithMeta<T>[]>;
  /**
   * Discovers all method handlers matching a particular metakey from a Provider or Controller
   * @param component
   * @param metaKey
   */
  classMethodsWithMetaAtKey<T>(
    component: DiscoveredClass,
    metaKey: MetaKey
  ): DiscoveredMethodWithMeta<T>[];
  /**
   * Discovers all the methods that exist on providers in a Nest App that contain metadata under a specific key
   * @param metaKey The metakey to scan for
   * @param providerFilter A predicate used to limit the providers being scanned. Defaults to all providers in the app module
   */
  providerMethodsWithMetaAtKey<T>(
    metaKey: MetaKey,
    providerFilter?: Filter<DiscoveredClass>
  ): Promise<DiscoveredMethodWithMeta<T>[]>;
  /**
   * Discovers all the methods that exist on controllers in a Nest App that contain metadata under a specific key
   * @param metaKey The metakey to scan for
   * @param controllerFilter A predicate used to limit the controllers being scanned. Defaults to all providers in the app module
   */
  controllerMethodsWithMetaAtKey<T>(
    metaKey: MetaKey,
    controllerFilter?: Filter<DiscoveredClass>
  ): Promise<DiscoveredMethodWithMeta<T>[]>;
  private toDiscoveredClass;
  private extractMethodMetaAtKey;
  private discover;
}
//# sourceMappingURL=discovery.service.d.ts.map
