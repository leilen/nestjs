import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HasuraModuleConfig } from './hasura.interfaces';
export declare class HasuraEventHandlerHeaderGuard implements CanActivate {
  private readonly hasuraConfig;
  private readonly apiSecret;
  constructor(hasuraConfig: HasuraModuleConfig);
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean>;
}
//# sourceMappingURL=hasura.event-handler.guard.d.ts.map
