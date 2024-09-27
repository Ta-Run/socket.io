import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private users;
    handleLogin(client: Socket, username: string): void;
    handleLogout(client: Socket): void;
    handleMessage(client: Socket, payload: {
        to: string;
        message: string;
    }): void;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
