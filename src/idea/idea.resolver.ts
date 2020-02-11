import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent
} from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { CommentService } from "src/comment/comment.service";

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
  @ResolveProperty()
  comments(@Parent() idea) {
    const { id } = idea;
    return this.commentService.showByIdea(id);
  }
}
