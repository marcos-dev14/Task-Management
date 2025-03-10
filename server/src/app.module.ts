import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [AuthModule, TasksModule],
  controllers: [AppController],
})
export class AppModule {}
