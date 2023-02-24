import { EventHandlerService } from './hasura.event-handler.service';
import { HasuraEvent } from './hasura.interfaces';
export declare class EventHandlerController {
  private readonly eventHandlerService;
  constructor(eventHandlerService: EventHandlerService);
  handleEvent(evt: HasuraEvent): Promise<any>;
}
//# sourceMappingURL=hasura.event-handler.controller.d.ts.map
