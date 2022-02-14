import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async registerAccount(@Body() payload: any): Promise<any> {
    return await this.appService.register(payload);
  }

  @Post('login')
  async loginAccount(@Body() payload: any): Promise<any> {
    return await this.appService.login(payload);
  }

  @Post('verify')
  async verifyAccount(@Body() payload: any): Promise<any> {
    return await this.appService.verify(payload);
  }
}
