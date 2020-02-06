import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IdeaDTO } from "./idea.dto";
import { IdeaEntity } from "./idea.entity";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>
  ) {}

  async showAll() {
    return await this.ideaRepository.find();
  }

  async create(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    return await this.ideaRepository.save(idea);
  }

  async read(id: string) {
    return await this._findById(id);
  }

  async update(id: string, data: Partial<IdeaDTO>) {
    let idea = await this._findById(id);
    await this.ideaRepository.update({ id }, data);
    idea = await this._findById(id);
    return idea;
  }

  async destroy(id: string) {
    const idea = await this._findById(id);
    await this.ideaRepository.delete({ id });
    return idea;
  }

  async _findById(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id }
    });
    if (!idea) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return idea;
  }
}
