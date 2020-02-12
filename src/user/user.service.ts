import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserDTO, UserResponse } from "./user.dto";
import { Page } from "src/shared/page.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  async read(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ["ideas", "bookmarks"]
    });
    return user.toResponseObject(false);
  }

  async showList(current: number = 1): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      relations: ["ideas", "bookmarks"],
      take: 10,
      skip: 10 * (current - 1),
      order: {
        created: "DESC"
      }
    });
    return users.map(user => user.toResponseObject(false));
  }

  async showListByPage(
    current: number = 1,
    size: number = 10
  ): Promise<Page<UserResponse>> {
    const [users, counts] = await this.userRepository.findAndCount({
      relations: ["ideas", "bookmarks"],
      take: size,
      skip: size * (current - 1),
      order: {
        created: "DESC"
      }
    });
    const usersPage = new Page(
      size,
      current,
      counts,
      users.map(user => user.toResponseObject(false))
    );
    return usersPage;
  }
  async login(data: UserDTO): Promise<UserResponse> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        "Invalid username/password",
        HttpStatus.BAD_REQUEST
      );
    }
    return user.toResponseObject();
  }
  async register(data: UserDTO): Promise<UserResponse> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
