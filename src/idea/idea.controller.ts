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

@Controller("idea")
export class IdeaController {
  private logger = new Logger("IdeaController");
  private logData(options: any) {
    options.userId &&
      this.logger.log(`USERID ${JSON.stringify(options.userId)}`);
    options.data && this.logger.log(`DATA ${JSON.stringify(options.data)}`);
    options.id && this.logger.log(`IDEA ${JSON.stringify(options.id)}`);
  }
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
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
}
