import { deleteUser } from "../events/events.js";
import { IUser } from "../interface/IUser.js";
import { ConfirmationPopUp } from "./popup/ConfirmationPopUp.js";
import { UserList } from "./UserList.js";
import { UserUpdatePopUp } from "./popup/UserUpdatePopUp.js";
import { BACKEND_URL } from "../service/utils.js";
import { UserInfoPopup } from "./popup/UserInfoPopUp.js";
import { NoseSelectionPopup } from "./popup/NoseSelectionPopUp.js";

export class User implements IUser {
  uid: string;
  name: string;
  firstName: string;
  pictureURL: string;
  birthDate: Date;
  nosePosition?: { x: number; y: number };
  lastUpdateDate: Date;

  constructor(
    uid: string,
    name: string,
    firstName: string,
    pictureURL: string,
    nosePosition: { x: number; y: number },
    lastUpdateDate: Date,
    birthDate: Date
  ) {
    this.uid = uid;
    this.name = name;
    this.firstName = firstName;
    this.pictureURL = pictureURL;
    this.nosePosition = nosePosition;
    this.lastUpdateDate = lastUpdateDate;
    this.birthDate = birthDate;
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
      view: {
        innerText: "👁️",
        eventFn: () => {
          new UserInfoPopup(
            document.getElementById("overlay") as HTMLDivElement,
            this
          );
        },
      },
      localize: { innerText: "👃",
        eventFn: () => {
          new NoseSelectionPopup(
            document.getElementById("overlay") as HTMLDivElement,
            this,
          );
        }
      },
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
              deleteUser(this.uid);
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

  static async createUser(
    lastName: string,
    firstName: string,
    imgFile: HTMLInputElement,
    dateOfBirth: string
  ) {
    const imgUrl = await User.uploadImg(imgFile);

    const userCreationResponse = await fetch(`${BACKEND_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: lastName,
        firstName: firstName,
        pictureURL: imgUrl,
        birthDate: dateOfBirth,
      }),
    }).then(async (rep) => await rep.json());

    await userCreationResponse;
  }

  static async updateUser(
    uid: string,
    lastName: string,
    firstName: string,
    imgFile: HTMLInputElement,
    dateOfBirth: string
  ) {
    let imgUrl: string;
    console.log(imgFile?.value);
    if (imgFile?.value !== "") {
      imgUrl = await User.uploadImg(imgFile);
    }
    console.log(uid);
    const userCreationResponse = await fetch(
      `${BACKEND_URL}/user?${new URLSearchParams([["_id", uid]]).toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          await imgUrl ? {
                name: lastName,
                firstName: firstName,
                pictureURL: await imgUrl,
                birthDate: dateOfBirth,
              }
            : {
                name: lastName,
                firstName: firstName,
                birthDate: dateOfBirth,
              }
        ),
      }
    ).then(async (rep) => await rep.json());

    await userCreationResponse;
  }

  private static async uploadImg(imgFile: HTMLInputElement) {
    const uploadResponse = await fetch(`${BACKEND_URL}/uploadImg`, {
      method: "POST",
      headers: {
        "Content-Type": imgFile.files[0].type,
      },
      body: imgFile.files[0],
    }).then((rep) => rep.json());

    const imgUrl = `${BACKEND_URL}${uploadResponse.fileURL}`;
    return imgUrl;
  }
}

export {};
