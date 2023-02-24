import { GraphQLClient } from 'graphql-request';
declare type GraphQLClientConstructorParams = ConstructorParameters<
  typeof GraphQLClient
>;
export interface GraphQLRequestModuleConfig {
  endpoint: GraphQLClientConstructorParams[0];
  options?: GraphQLClientConstructorParams[1];
}
declare const GraphQLRequestModule_base: import('@golevelup/nestjs-modules').IConfigurableDynamicRootModule<
  GraphQLRequestModule,
  GraphQLRequestModuleConfig
>;
export declare class GraphQLRequestModule extends GraphQLRequestModule_base {}
export {};
//# sourceMappingURL=graphql-request.module.d.ts.map
