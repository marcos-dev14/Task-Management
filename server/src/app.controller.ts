import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedRoute() {
    return { message: 'This route is protected by JWT' };
  }
}