import type { Socket, DefaultEventsMap, Server } from 'socket.io';

interface WebSocketData {
  userId: string;
}

export type Socket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  WebSocketData
>;

export type Server = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  WebSocketData
>;
