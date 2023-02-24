/// <reference types="node" />
import Stripe from 'stripe';
import { StripeModuleConfig } from './stripe.interfaces';
export declare class StripePayloadService {
  private readonly config;
  private readonly stripeClient;
  private readonly stripeWebhookSecret;
  private readonly stripeConnectWebhookSecret;
  constructor(config: StripeModuleConfig, stripeClient: Stripe);
  tryHydratePayload(
    signature: string,
    payload: Buffer
  ): {
    type: string;
  };
}
//# sourceMappingURL=stripe.payload.service.d.ts.map
