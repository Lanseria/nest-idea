import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTO } from "./user.dto";
import { ValidationPipe } from "src/shared/validation.pipe";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  showAllUsers() {
    return this.userService.showAll();
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
