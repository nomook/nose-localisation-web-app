import { deleteUser, drawTable } from "../events/events.js";
import { IUser } from "../interface/IUser.js";
import { ConfirmationPopUp } from "./popup/ConfirmationPopUp.js";
import { UserList } from "./UserList.js";
import { UserUpdatePopUp } from "./popup/UserUpdatePopUp.js";

export class User implements IUser {
  uid: string;
  name: string;
  firstName: string;
  pictureURL: string;
  birthDate: Date;
  nosePosition?: { x: number; y: number };
  lastUpdateDate: Date;

  constructor(
    name: string,
    firstName: string,
    pictureURL: string,
    birthDate: Date
  ) {
    this.uid = self.crypto.randomUUID();
    this.name = name;
    this.firstName = firstName;
    this.pictureURL = pictureURL;
    this.birthDate = birthDate;

    this.lastUpdateDate = new Date(Date.now());
  }

  toRow(index: number = 0, users: UserList): HTMLTableRowElement {
    function createElement(type: string, innerText: string) {
      const el = document.createElement(type);
      el.innerHTML = innerText;
      return el;
    }

    const rowEl: HTMLTableRowElement = document.createElement("tr");

    rowEl.appendChild(createElement("td", index.toString()));
    rowEl.appendChild(createElement("td", this.name.toString()));
    rowEl.appendChild(createElement("td", this.firstName.toString()));
    rowEl.appendChild(createElement("td", this.birthDate.toDateString()));
    rowEl.appendChild(createElement("td", this.lastUpdateDate.toISOString()));

    rowEl.appendChild(this.getActionsSpan(index, users));

    return rowEl as HTMLTableRowElement;
  }
  private getActionsSpan(index: number, users: UserList) {
    const tableCellElement = document.createElement(
      "td"
    ) as HTMLTableCellElement;

    tableCellElement.style.display = "flex";

    const actions: object = {
      view: { innerText: "👁️" },
      localize: { innerText: "👃" },
      edit: {
        innerText: "✍️",
        eventFn: () => {
          new UserUpdatePopUp(
            this,
            users,
            document.getElementById("overlay") as HTMLDivElement
          );
        },
      },
      delete: {
        innerText: "❌",
        eventFn: () => {
          new ConfirmationPopUp(
            `<p for="confirmationButtons">Are you sure that you want to delete user ${index.toString()} ?</p>`,
            document.getElementById("overlay") as HTMLDivElement,
            () => {
              deleteUser(tableCellElement, users);
              drawTable(users);
            }
          );
        },
      },
    };

    for (const [actionId, actionData] of Object.entries(actions)) {
      const spanElement = document.createElement("span") as HTMLSpanElement;
      spanElement.id = actionId;
      spanElement.innerText = actionData?.innerText;
      spanElement.addEventListener("mousedown", actionData?.eventFn);
      spanElement.style.padding = "0px 20px 0px 20px";
      tableCellElement.appendChild(spanElement);
    }
    return tableCellElement;
  }

  public set setName(v: string) {
    this.name = v;
  }
  public set setFistName(v: string) {
    this.firstName = v;
  }

  public set setBirthDate(v: Date) {
    this.birthDate = v;
  }

  public set setPhoto(v: string) {
    this.pictureURL = v;
  }

  public set setNosePosition(v: { x: number; y: number }) {
    this.nosePosition = v;
  }
}

export {};
