"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let ChatGateway = class ChatGateway {
    constructor() {
        this.logger = new common_1.Logger('ChatGateway');
        this.users = [];
    }
    handleLogin(client, username) {
        const user = this.users.find((user) => user.username === username);
        if (!user) {
            this.users.push({ id: client.id, username, socketId: client.id });
            this.server.emit('users', this.users);
            client.emit('loginSuccess', `Welcome ${username}`);
            this.logger.log(`User logged in: ${username}`);
        }
        else {
            client.emit('loginFailed', `Username ${username} is already taken.`);
        }
    }
    handleLogout(client) {
        this.users = this.users.filter((user) => user.socketId !== client.id);
        this.server.emit('users', this.users);
        client.emit('logoutSuccess', 'You have been logged out');
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(client, payload) {
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
        }
        else {
            client.emit('error', `User ${payload.to} is not connected.`);
        }
    }
    afterInit(server) {
        this.logger.log('Initialized!');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.users = this.users.filter((user) => user.socketId !== client.id);
        this.server.emit('users', this.users);
        this.logger.log(`Client disconnected: ${client.id}`);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLogout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map