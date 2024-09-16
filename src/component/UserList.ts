import { IUserList } from "src/interfaces/IUserList";
import { User } from "./User";
import { PAGE_MAX_LENGTH } from "../services/utils.js";

export class UserList implements IUserList {
  list: { id: number; data: User }[];
  protected maxId: number;

  constructor(users: User[]) {
    this.list = users.map((user, index) => ({ id: index, data: user }));
    this.maxId = users.length > 0 ? users.length : 0;
  }

  add(user: User) {
    this.list.push({ id: this.maxId, data: user });
    this.maxId++;
  }

  public remove(id: number): { id: number; data: User }[] | undefined {
    for (let index = 0; index < this.list.length; index++) {
      if (this.list.at(index).id == id) {
        return this.list.splice(index, 1);
      }
    }
    return undefined;
  }

  get(id: number): { id: number; data: User } | undefined {
    for (let index = 0; index < this.list.length; index++) {
      if (this.list.at(index).id == id) {
        return this.list.at(index);
      }
    }
    return undefined;
  }

  toRows(page: number = 0): HTMLTableRowElement[] {
    const res: HTMLTableRowElement[] = [];
    for (
      let index = page * PAGE_MAX_LENGTH;
      index <
      Math.min(this.list.length, page * PAGE_MAX_LENGTH + PAGE_MAX_LENGTH);
      index++
    ) {
      res.push(this.list[index].data.toRow(this.list[index].id, this));
    }

    return res;
  }
}
