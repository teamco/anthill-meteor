import { TTimestamp } from "./common.type";

export interface IUser extends TTimestamp {
  _id: string;
  username?: string;
  services?: {
    password?: {
      bcrypt?: string;
    };
  };
}