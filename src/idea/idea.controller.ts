import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  Logger
} from "@nestjs/common";
import { IdeaDTO } from "./idea.dto";
import { IdeaService } from "./idea.service";
import { ValidationPipe } from "src/shared/validation.pipe";

@Controller("idea")
export class IdeaController {
  private logger = new Logger("IdeaController");
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createIdea(@Body() data: IdeaDTO) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.create(data);
  }

  @Get(":id")
  readIdea(@Param("id") id: string) {
    return this.ideaService.read(id);
  }

  @Put(":id")
  @UsePipes(ValidationPipe)
  updateIdea(@Param("id") id: string, @Body() data: Partial<IdeaDTO>) {
    this.logger.log(JSON.stringify(data));
    return this.ideaService.update(id, data);
  }

  @Delete(":id")
  destroyIdea(@Param("id") id: string) {
    return this.ideaService.destroy(id);
  }
}
