import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserResponse } from "./user.dto";
import { IdeaEntity } from "src/idea/idea.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: "text",
    unique: true
  })
  username: string;

  @Column("text")
  password: string;

  @OneToMany(
    type => IdeaEntity,
    idea => idea.author
  )
  ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, {
    cascade: true
  })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken = true) {
    const { id, created, username, token } = this;
    let responseObject: UserResponse = { id, created, username };
    if (showToken) {
      responseObject.token = token;
    }
    if (this.ideas) {
      responseObject.ideas = this.ideas;
    }
    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }
    return responseObject;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  private get token(): string {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username
      },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
  }
}
