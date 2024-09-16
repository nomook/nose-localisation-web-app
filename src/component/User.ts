import { deleteUser, drawTable } from "../events/events.js";
import { IUser } from "../interfaces/IUser.js";
import { UserCreationPopUp } from "./popup/UserCreationPopUp.js";
import { ConfirmationPopUp } from "./popup/ConfirmationPopUp.js";
import { UserList } from "./UserList.js";

export class User implements IUser {
  uid: string;
  name: string;
  firstName: string;
  pictureURL: string;
  birthDate: Date;
  nosePosition?: { x: number; y: number };
  creationDate: Date;

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

    this.creationDate = new Date(Date.now());
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
    rowEl.appendChild(createElement("td", this.creationDate.toISOString()));

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
          new UserCreationPopUp(users, document.getElementById("overlay") as HTMLDivElement);
        }
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
}

export {};
