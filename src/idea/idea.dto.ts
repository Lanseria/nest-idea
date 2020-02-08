import { IsString } from "class-validator";
import { UserResponse } from "src/user/user.dto";
export class IdeaDTO {
  @IsString()
  idea: string;

  @IsString()
  description: string;
}

export class IdeaResponse {
  id?: string;
  updated: Date;
  created: Date;
  idea: string;
  description: string;
  author?: UserResponse;
  upvotes?: number;
  downvotes?: number;
}
