import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert
} from "typeorm";
import { Logger } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserResponse } from "./user.dto";

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
    return responseObject;
  }

  async comparePassword(password: string) {
    // Logger.log(
    //   `${JSON.stringify({
    //     1: password,
    //     2: this.password
    //   })}`,
    //   "UserEntity"
    // );
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
