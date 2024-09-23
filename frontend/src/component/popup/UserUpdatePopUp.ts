import { BACKEND_URL, inputElement } from "../../service/utils.js";
import { drawTable, hideForm } from "../../events/events.js";
import { User } from "../User.js";
import { UserList } from "../UserList.js";

export class UserUpdatePopUp {
  private formElement: HTMLFormElement;
  private user: User;
  overlay: HTMLDivElement;

  constructor(user: User, users: UserList, overlay: HTMLDivElement) {
    this.user = user;
    this.formElement = document.createElement("form");
    this.createForm(users);
    overlay.style.display = "grid";
    this.overlay = overlay;
    this.formElement.id = "updateForm";
    this.formElement.className = "popup";
    this.formElement.style.display = "grid";
    document.body.appendChild(this.formElement);
  }

  public get getUser(): User {
    return this.user;
  }

  public getElement(): HTMLFormElement {
    return this.formElement;
  }

  private createForm(users: UserList): void {
    this.formElement.append(
      ...inputElement("lastName", "Nom :", true, "text", this.user.name)
    );
    this.formElement.append(
      ...inputElement(
        "firstName",
        "Prénom :",
        true,
        "text",
        this.user.firstName
      )
    );
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    this.formElement.append(
      ...inputElement(
        "dateOfBirth",
        "Date de naissance :",
        false,
        "date",
        `${this.user.birthDate.getFullYear()}-${zeroPad(
          this.user.birthDate.getMonth() + 1,
          2
        )}-${zeroPad(this.user.birthDate.getDate(), 2)}`
      )
    );
    this.formElement.append(
      ...inputElement(
        "photoFile",
        "URL de la photo",
        false,
        "file",
        this.user.pictureURL
      )
    );
    this.formElement.appendChild(this.getButtons(users));
  }

  private getButtons(users) {
    const btnDiv = document.createElement("div") as HTMLDivElement;
    btnDiv.className = "buttons";
    const submitBtn = document.createElement("button") as HTMLButtonElement;
    const cancelBtn = document.createElement("button") as HTMLButtonElement;

    submitBtn.type = "submit";
    submitBtn.innerText = "Add";

    cancelBtn.type = "button";
    cancelBtn.innerText = "Cancel";

    this.formElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.updateUser(event);
      location.reload();
    });
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.append(...[submitBtn, cancelBtn]);
    return btnDiv;
  }

  private async updateUser(event: SubmitEvent) {
    event.preventDefault();
    const inputElements: object = Array.from(
      this.formElement.querySelectorAll("input")
    ).reduce((obj, el) => {
      if (el.id == 'photoFile') {
        obj[el.id] = el as HTMLInputElement;
        return obj;
      }
      obj[el.id] = el.value;
      return obj;
    }, {});

    await User.updateUser(
      this.user.uid,
      inputElements["lastName"],
      inputElements["firstName"],
      inputElements["photoFile"],
      inputElements["dateOfBirth"],
    );
  }
}
