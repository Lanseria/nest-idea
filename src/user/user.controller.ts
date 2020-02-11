import { Controller, Get, Post, Body, UseGuards, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "./user.dto";
import { ValidationPipe } from "src/shared/validation.pipe";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  showAllUsers(@Query("current") current: number, @Query("size") size: number) {
    return this.userService.showListByPage(current, size);
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
