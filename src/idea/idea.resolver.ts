import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context
} from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { CommentService } from "src/comment/comment.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";
import { UserResponse } from "src/user/user.dto";
import { IdeaDTO } from "./idea.dto";
import { Votes } from "src/shared/votes.enum";

@Resolver("Idea")
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService
  ) {}

  @Query()
  ideas(@Args("current") current: number, @Args("newest") newest: boolean) {
    return this.ideaService.showList(current, newest);
  }

  @Query()
  idea(@Args("id") id: string) {
    return this.ideaService.read(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  createIdea(
    @Args("idea") idea: string,
    @Args("description") description: string,
    @Context("user") user: UserResponse
  ) {
    const data: IdeaDTO = { idea, description };
    const { id: userId } = user;
    return this.ideaService.create(userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  updateIdea(
    @Args("id") id: string,
    @Args("idea") idea: string,
    @Args("description") description: string,
    @Context("user") user: UserResponse
  ) {
    const data: IdeaDTO = { idea, description };
    const { id: userId } = user;
    return this.ideaService.update(id, userId, data);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteIdea(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.ideaService.destroy(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  upvote(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.ideaService.vote(id, userId, Votes.UP);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  downvote(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.ideaService.vote(id, userId, Votes.DOWN);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  bookmark(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.ideaService.bookmark(id, userId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  unbookmark(@Args("id") id: string, @Context("user") user: UserResponse) {
    const { id: userId } = user;
    return this.ideaService.unbookmark(id, userId);
  }

  @ResolveProperty()
  comments(@Parent() idea) {
    const { id } = idea;
    return this.commentService.showByIdea(id);
  }
}
