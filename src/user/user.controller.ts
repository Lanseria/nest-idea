import { Controller, Get, Post, Body, UseGuards, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "./user.dto";
import { ValidationPipe } from "src/shared/validation.pipe";
import { User } from "./user.decorator";
import { AuthGuard } from "src/shared/auth.guard";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  showAllUsers(@Query("current") current: number, @Query("size") size: number) {
    return this.userService.showListByPage(current, size);
  }

  @Get("mine")
  @UseGuards(AuthGuard)
  mine(@User("username") username: string) {
    return this.userService.read(username);
  }

  @Post("login")
  login(@Body(new ValidationPipe()) data: UserDTO) {
    return this.userService.login(data);
  }

  @Post("register")
  register(@Body(new ValidationPipe()) data: UserDTO) {
    return this.userService.register(data);
  }
}
