import { IsString } from "class-validator";
import { UserResponse } from "src/user/user.dto";
import { IdeaEntity } from "src/idea/idea.entity";

export class CommentDTO {
  @IsString()
  comment: string;
}
export class CommentResponse {
  id: string;
  created: Date;
  comment: string;
  author: UserResponse;
  idea: IdeaEntity;
}
