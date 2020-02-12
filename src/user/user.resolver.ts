import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context
} from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "src/comment/comment.service";
import { UserDTO } from "./user.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";

@Resolver("User")
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService
  ) {}

  @Query()
  users(@Args("current") current: number) {
    return this.userService.showList(current);
  }

  @Query()
  user(@Args("username") username: string) {
    return this.userService.read(username);
  }

  @Query()
  @UseGuards(AuthGuard)
  mine(@Context("user") user: UserDTO) {
    const { username } = user;
    return this.userService.read(username);
  }

  @Mutation()
  login(
    @Args("username") username: string,
    @Args("password") password: string
  ) {
    const user: UserDTO = { username, password };
    return this.userService.login(user);
  }

  @Mutation()
  register(
    @Args("username") username: string,
    @Args("password") password: string
  ) {
    const user: UserDTO = { username, password };
    return this.userService.register(user);
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
