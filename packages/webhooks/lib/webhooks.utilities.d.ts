import { MiddlewareConsumer, Type } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
export declare const applyRawBodyWebhookMiddleware: (
  consumer: MiddlewareConsumer,
  rawBodyRoutes: (string | Type<any> | RouteInfo)[],
  jsonBodyRoutes: (string | Type<any> | RouteInfo)[]
) => void;
export declare const applyRawBodyOnlyTo: (
  consumer: MiddlewareConsumer,
  ...rawBodyRoutes: (string | RouteInfo)[]
) => void;
/**
 * Applies raw body middleware to routes that saves the raw body on the request object based on
 * the WebhooksModule configuration. Also adds JSON body parsing to supplied routes
 *
 * @param consumer Middleware consumer
 * @param rawBodyRoutes The routes that should have raw body processing added to them
 * @param jsonBodyRoutes The routes that should have JSON body processing added to them. Defaults to * (all routes)
 */
export declare const applyConfigurableRawBodyWebhookMiddleware: (
  consumer: MiddlewareConsumer,
  rawBodyRoutes: (string | Type<any> | RouteInfo)[],
  jsonBodyRoutes?: (string | Type<any> | RouteInfo)[]
) => void;
//# sourceMappingURL=webhooks.utilities.d.ts.map
