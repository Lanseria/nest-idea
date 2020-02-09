import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  Body,
  Delete
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/shared/auth.guard";
import { ValidationPipe } from "src/shared/validation.pipe";
import { User } from "src/user/user.decorator";
import { CommentDTO } from "./comment.dto";

@Controller("comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get("idea/:id")
  showCommentsByIdea(@Param("id") ideaId: string) {
    return this.commentService.showByIdea(ideaId);
  }

  @Get("user/:id")
  showCommentsByUser(@Param("id") userId: string) {
    return this.commentService.showByUser(userId);
  }

  @Post("idea/:id")
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  createComment(
    @Param("id") ideaId: string,
    @User("id") userId: string,
    @Body() data: CommentDTO
  ) {
    return this.commentService.create(ideaId, userId, data);
  }

  @Get(":id")
  showComment(@Param("id") id: string) {
    return this.commentService.show(id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  destoryComment(@Param("id") id: string, @User("id") userId: string) {
    return this.commentService.destroy(id, userId);
  }
}
