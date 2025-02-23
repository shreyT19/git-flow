import { IQuestionBase } from "@/utils/question.utils";
import { IBaseResponseSchema } from "./types";
import { IUser } from "./user.types";

export interface IQuestionResponse extends IQuestionBase, IBaseResponseSchema {
  user: IUser;
}
