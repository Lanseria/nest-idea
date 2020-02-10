import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IdeaDTO, IdeaResponse } from "./idea.dto";
import { IdeaEntity } from "./idea.entity";
import { UserEntity } from "src/user/user.entity";
import { Votes } from "src/shared/votes.enum";
import { Page } from "src/shared/page.dto";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  private async _findById(id: string, relations: string[] = []) {
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

  private _toResponseObject(idea: IdeaEntity): IdeaResponse {
    const responseObject: IdeaResponse = {
      ...idea,
      upvotes: idea.upvotes?.length,
      downvotes: idea.downvotes?.length,
      author: idea.author?.toResponseObject(false)
    };
    return responseObject;
  }

  private _ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author?.id !== userId) {
      throw new HttpException("Incorrect user", HttpStatus.UNAUTHORIZED);
    }
  }

  private async _vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const operate = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    const voteUserIds = {
      [Votes.UP]: idea[Votes.UP].map(m => m.id),
      [Votes.DOWN]: idea[Votes.DOWN].map(m => m.id)
    };
    if (
      !voteUserIds[Votes.UP].includes(user.id) &&
      !voteUserIds[Votes.DOWN].includes(user.id)
    ) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else if (voteUserIds[vote].includes(user.id)) {
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (!voteUserIds[vote].includes(user.id)) {
      idea[operate] = idea[operate].filter(voter => voter.id !== user.id);
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException("Unabled to case vote", HttpStatus.BAD_REQUEST);
    }
    return this._toResponseObject(idea);
  }

  async showAll(
    current: number = 1,
    size: number = 10
  ): Promise<Page<IdeaResponse>> {
    const [ideas, counts] = await this.ideaRepository.findAndCount({
      relations: ["author", "upvotes", "downvotes", "comments"],
      take: size,
      skip: size * (current - 1)
    });
    const ideasPage = new Page(
      size,
      current,
      counts,
      ideas.map(idea => this._toResponseObject(idea))
    );
    return ideasPage;
  }

  async create(userId: string, data: IdeaDTO): Promise<IdeaResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    });
    const idea = this.ideaRepository.create({
      ...data,
      author: user
    });
    await this.ideaRepository.save(idea);
    return this._toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaResponse> {
    const idea = await this._findById(id, [
      "author",
      "upvotes",
      "downvotes",
      "comments"
    ]);
    return this._toResponseObject(idea);
  }

  async update(id: string, userId: string, data: Partial<IdeaDTO>) {
    let idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    this._ensureOwnership(idea, userId);
    await this.ideaRepository.update({ id }, data);
    idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    return this._toResponseObject(idea);
  }

  async destroy(id: string, userId: string) {
    const idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    this._ensureOwnership(idea, userId);
    await this.ideaRepository.delete({ id });
    return this._toResponseObject(idea);
  }

  async bookmark(id: string, userId: string) {
    const idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    const user = await this._findUserById(userId, ["bookmarks"]);
    const userBookmarkedIds = user.bookmarks.map(m => m.id);
    if (!userBookmarkedIds.includes(idea.id)) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException(
        "Idea already bookmarked",
        HttpStatus.BAD_REQUEST
      );
    }
    return user.toResponseObject();
  }

  async unbookmark(id: string, userId: string) {
    const idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    const user = await this._findUserById(userId, ["bookmarks"]);
    const userBookmarkedIds = user.bookmarks.map(m => m.id);
    if (userBookmarkedIds.includes(idea.id)) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id
      );
      await this.userRepository.save(user);
    } else {
      throw new HttpException("Idea not bookmarked", HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  async vote(id: string, userId: string, vote: Votes) {
    const idea = await this._findById(id, ["author", "upvotes", "downvotes"]);
    const user = await this._findUserById(userId, []);
    return await this._vote(idea, user, vote);
  }
}
