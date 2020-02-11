import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent
} from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "src/comment/comment.service";

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

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
