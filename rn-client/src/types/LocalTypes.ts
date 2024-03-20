import {User} from "./DBTypes";

export type Values = Pick<User, "email" | "password">;
