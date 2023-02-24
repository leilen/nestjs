import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { OnModuleInit } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { HasuraModuleConfig } from './hasura.interfaces';
declare const HasuraModule_base: import('@golevelup/nestjs-modules').IConfigurableDynamicRootModule<
  HasuraModule,
  HasuraModuleConfig
>;
export declare class HasuraModule
  extends HasuraModule_base
  implements OnModuleInit
{
  private readonly discover;
  private readonly externalContextCreator;
  private readonly hasuraModuleConfig;
  private readonly logger;
  constructor(
    discover: DiscoveryService,
    externalContextCreator: ExternalContextCreator,
    hasuraModuleConfig: HasuraModuleConfig
  );
  onModuleInit(): Promise<void>;
}
export {};
//# sourceMappingURL=hasura.module.d.ts.map
