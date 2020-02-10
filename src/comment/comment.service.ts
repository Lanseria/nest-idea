import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./comment.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { IdeaEntity } from "src/idea/idea.entity";
import { CommentDTO, CommentResponse } from "./comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  private async _findById(id: string, relations: string[] = []) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations
    });
    if (!comment) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  private async _findIdeaById(id: string, relations: string[] = []) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations
    });
    if (!idea) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return idea;
  }

  private async _findUserById(id: string, relations: string[] = []) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations
    });
    if (!user) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
    return user;
  }

  private _toResponseObject(comment: CommentEntity) {
    const responseObject: CommentResponse = {
      ...comment,
      author: comment.author.toResponseObject(false)
    };
    return responseObject;
  }

  async showByIdea(ideaId: string) {
    const comments = await this.commentRepository.find({
      where: {
        author: { id: ideaId }
      },
      relations: ["author"]
    });
    return comments.map(comment => this._toResponseObject(comment));
  }

  async showByUser(userId: string) {
    const comments = await this.commentRepository.find({
      where: {
        author: { id: userId }
      },
      relations: ["author"]
    });
    return comments.map(comment => this._toResponseObject(comment));
  }

  async show(id: string) {
    const comment = await this._findById(id, ["author", "idea"]);
    return comment;
  }

  async create(ideaId: string, userId: string, data: CommentDTO) {
    const idea = await this._findIdeaById(ideaId);
    const user = await this._findUserById(userId);
    const comment = this.commentRepository.create({
      ...data,
      idea,
      author: user
    });
    await this.commentRepository.save(comment);
    return this._toResponseObject(comment);
  }

  async destroy(id: string, userId: string) {
    const comment = await this._findById(id, ["author", "idea"]);
    if (comment.author.id !== userId) {
      throw new HttpException(
        "You do not own this comment",
        HttpStatus.UNAUTHORIZED
      );
    }
    await this.commentRepository.remove(comment);
    return this._toResponseObject(comment);
  }
}
