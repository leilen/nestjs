import { WebhooksModuleProvidedConfig } from './webhooks.interfaces';
declare const WebhooksModule_base: import('@golevelup/nestjs-modules').IConfigurableDynamicRootModule<
  WebhooksModule,
  WebhooksModuleProvidedConfig
>;
/**
 * Module that allows for configuration of the ConfigurableRawBodyMiddleware. Use the
 * module to specify which property on the request object that the raw body will be available on.
 * If not set, the property will default to "rawBody"
 */
export declare class WebhooksModule extends WebhooksModule_base {}
export {};
//# sourceMappingURL=webhooks.module.d.ts.map
