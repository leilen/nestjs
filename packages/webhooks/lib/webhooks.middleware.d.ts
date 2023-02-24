import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhooksModuleConfig } from './webhooks.interfaces';
/**
 * Wraps the default json bodyParser behavior
 */
export declare class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any): void;
}
/**
 * Wraps the default bodyParser raw behavior
 */
export declare class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any): void;
}
/**
 * Copies the raw buffer from the request body onto a configurable request object property  (Defaults to 'rawBody')
 * Can be combined with regular JSON parsing to make both the raw and JSON body values consumable
 * This allows the raw body to be accessed in other middlewares or controllers
 */
export declare class ConfigurableRawBodyMiddleware implements NestMiddleware {
  private readonly config;
  constructor(config: WebhooksModuleConfig);
  use(req: Request, res: Response, next: () => any): void;
}
//# sourceMappingURL=webhooks.middleware.d.ts.map
