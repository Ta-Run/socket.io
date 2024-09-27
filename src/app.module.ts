import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway'; // Adjust the path accordingly

@Module({
  providers: [ChatGateway],
})
export class AppModule {}
  