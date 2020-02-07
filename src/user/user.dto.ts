import { IsNotEmpty } from "class-validator";
import { IdeaEntity } from "src/idea/idea.entity";

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserResponse {
  id: string;
  username: string;
  created: Date;
  token?: string;
  ideas?: IdeaEntity[];
}
