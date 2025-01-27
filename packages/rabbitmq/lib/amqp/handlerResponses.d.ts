export declare class Nack {
  private readonly _requeue;
  constructor(_requeue?: boolean);
  get requeue(): boolean;
}
export declare type RpcResponse<T> = T | Nack;
export declare type SubscribeResponse = Nack | undefined | void;
//# sourceMappingURL=handlerResponses.d.ts.map
