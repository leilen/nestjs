import { AmqpConnection } from './connection';
export declare class AmqpConnectionManager {
  private connections;
  addConnection(connection: AmqpConnection): void;
  getConnection(name: string): AmqpConnection | undefined;
  getConnections(): AmqpConnection[];
  clearConnections(): void;
}
//# sourceMappingURL=connectionManager.d.ts.map
