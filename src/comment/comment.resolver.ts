import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { CommentService } from "./comment.service";
import { AuthGuard } from "src/shared/auth.guard";
import { UserResponse } from "src/user/user.dto";
import { CommentDTO } from "./comment.dto";

@Resolver("Comment")
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args("id") id: string) {
    return this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  createComment(
    @Args("ideaId") ideaId: string,
    @Args("comment") comment: string,
    @Context("user") user: UserResponse
  ) {
    const data: CommentDTO = { comment };
    const { id: userId } = user;
    return this.commentService.create(ideaId, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteComment(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.commentService.destroy(id, userId);
  }
}
