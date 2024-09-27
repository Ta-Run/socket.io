import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Server, Socket } from 'socket.io';
  
  interface User {
    id: string;
    username: string;
    socketId: string;
  }
  
  @WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');
    private users: User[] = [];   
    @SubscribeMessage('login')
    handleLogin(client: Socket, username: string) {
      const user = this.users.find((user) => user.username === username);
      if (!user) {
        this.users.push({ id: client.id, username, socketId: client.id });
        this.server.emit('users', this.users);
        client.emit('loginSuccess', `Welcome ${username}`);
        this.logger.log(`User logged in: ${username}`);
      } else {
        client.emit('loginFailed', `Username ${username} is already taken.`);
      }
    }
  
    @SubscribeMessage('logout')
    handleLogout(client: Socket) {
      this.users = this.users.filter((user) => user.socketId !== client.id);
      this.server.emit('users', this.users);
      client.emit('logoutSuccess', 'You have been logged out');
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  

    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: { to: string; message: string }) {
      const sender = this.users.find((user) => user.socketId === client.id);
      const recipient = this.users.find((user) => user.username === payload.to);
  
      if (recipient) {
        this.server.to(recipient.socketId).emit('receiveMessage', {
          from: sender.username,
          message: payload.message,
        });
        client.emit('messageSent', {
          to: recipient.username,
          message: payload.message,
        });
        this.logger.log(`Message from ${sender.username} to ${recipient.username}`);
      } else {
        client.emit('error', `User ${payload.to} is not connected.`);
      }
    }
  
    afterInit(server: Server) {
      this.logger.log('Initialized!');
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.users = this.users.filter((user) => user.socketId !== client.id);
      this.server.emit('users', this.users);
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }
  