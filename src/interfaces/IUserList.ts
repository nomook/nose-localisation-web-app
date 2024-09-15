import { IUser } from "./IUser";

export interface IUserList {
    list: {id: number, data: IUser}[],
}