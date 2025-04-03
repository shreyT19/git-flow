import { IBaseResponseSchema } from "./types";

export type IUser = {
  id?: string;
  emailAddress: string;
  imageURL?: string;
  firstName?: string | null;
  lastName?: string | null;
  credits?: number;
};

export type IUserResponse = {
  user: IUser & IBaseResponseSchema;
  projectId: string;
};
