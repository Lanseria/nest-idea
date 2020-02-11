import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  Logger,
  Query,
  UseGuards
} from "@nestjs/common";
import { IdeaDTO } from "./idea.dto";
import { IdeaService } from "./idea.service";
import { ValidationPipe } from "src/shared/validation.pipe";
import { User } from "src/user/user.decorator";
import { AuthGuard } from "src/shared/auth.guard";
import { Votes } from "src/shared/votes.enum";

@Controller("idea")
export class IdeaController {
  private logger = new Logger("IdeaController");
  private logData(options: any) {
    options.userId &&
      this.logger.log(`USER_ID ${JSON.stringify(options.userId)}`);
    options.data && this.logger.log(`DATA ${JSON.stringify(options.data)}`);
    options.id && this.logger.log(`IDEA_ID ${JSON.stringify(options.id)}`);
  }
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas(@Query("current") current: number, @Query("size") size: number) {
    return this.ideaService.showListByPage(current, size);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  createIdea(@User("id") userId, @Body() data: IdeaDTO) {
    this.logData({ userId, data });
    return this.ideaService.create(userId, data);
  }

  @Get(":id")
  readIdea(@Param("id") id: string) {
    return this.ideaService.read(id);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  updateIdea(
    @User("id") userId,
    @Param("id") id: string,
    @Body() data: Partial<IdeaDTO>
  ) {
    this.logData({ id, userId, data });
    return this.ideaService.update(id, userId, data);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  destroyIdea(@User("id") userId, @Param("id") id: string) {
    this.logData({ id, userId });
    return this.ideaService.destroy(id, userId);
  }

  @Post(":id/bookmark")
  @UseGuards(AuthGuard)
  bookmarkIdea(@User("id") userId: string, @Param("id") id: string) {
    this.logData({ id, userId });
    return this.ideaService.bookmark(id, userId);
  }

  @Delete(":id/bookmark")
  @UseGuards(AuthGuard)
  unbookmark(@User("id") userId: string, @Param("id") id: string) {
    this.logData({ id, userId });
    return this.ideaService.unbookmark(id, userId);
  }

  @Post(":id/upvote")
  @UseGuards(AuthGuard)
  upvoteIdea(@User("id") userId: string, @Param("id") id: string) {
    this.logData({ id, userId });
    return this.ideaService.vote(id, userId, Votes.UP);
  }

  @Post(":id/downvote")
  @UseGuards(AuthGuard)
  downvoteIdea(@User("id") userId: string, @Param("id") id: string) {
    this.logData({ id, userId });
    return this.ideaService.vote(id, userId, Votes.DOWN);
  }
}
