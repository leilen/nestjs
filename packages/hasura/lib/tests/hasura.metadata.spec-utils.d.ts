import { HasuraModuleConfig } from '../hasura.interfaces';
import { z } from 'zod';
export declare const metadataVersion: z.ZodEnum<['v2', 'v3']>;
export declare const baseConfig: {
  webhookConfig: {
    secretFactory: string;
    secretHeader: string;
  };
  managedMetaDataConfig: {
    secretHeaderEnvName: string;
    nestEndpointEnvName: string;
    defaultEventRetryConfig: {
      intervalInSeconds: number;
      numRetries: number;
      timeoutInSeconds: number;
      toleranceSeconds: number;
    };
  };
};
export declare const yamlFileToJson: (filePath: string) => any;
export declare const getVersionedMetadataPathAndConfig: (
  v: string
) => [string, HasuraModuleConfig];
export declare const copyCleanTemplateYamlFile: (yamlPath: string) => void;
export declare class TestEventHandlerService {
  defaultHandler(): void;
  additionalHandler(): void;
  scheduled(): void;
}
//# sourceMappingURL=hasura.metadata.spec-utils.d.ts.map
