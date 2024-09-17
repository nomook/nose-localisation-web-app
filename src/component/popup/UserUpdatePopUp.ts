import { inputElement } from "../../services/utils.js";
import { drawTable, hideForm } from "../../events/events.js";
import { User } from "../User.js";
import { UserList } from "../UserList.js";


export class UserUpdatePopUp {
  private formElement: HTMLFormElement;
  private user: User;
  overlay: HTMLDivElement;

  constructor(user: User, users: UserList, overlay: HTMLDivElement) {
    this.user = user;
    this.formElement = document.createElement('form');
    this.createForm(users);
    overlay.style.display = "grid";
    this.overlay = overlay;
    this.formElement.id = "updateForm";
    this.formElement.className = "popup";
    this.formElement.style.display = "grid";
    document.body.appendChild(this.formElement);
  }

  public get getUser() : User {
    return this.user;
  }
  

  public getElement(): HTMLFormElement {
    return this.formElement;
  }

  private createForm(users: UserList): void {
    this.formElement.append(...inputElement('lastName', 'Nom :', true, 'text'));
    this.formElement.append(...inputElement('firstName', 'Prénom :', true, 'text'));
    this.formElement.append(...inputElement('dateOfBirth', 'Date de naissance :', false, 'date'));
    this.formElement.append(...inputElement('photoUrl', 'URL de la photo', false, 'file'));
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

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.updateUser(event, users);
      drawTable(users);
    });
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.append(...[submitBtn, cancelBtn]);
    return btnDiv;
  }

  private updateUser(event: SubmitEvent, users: UserList) {
    const inputElements: object = Array.from(
      this.formElement.querySelectorAll("input")
    ).reduce((obj: object, el: HTMLInputElement) => {
      obj[el.id] = el.value;
      return obj;
    }, {});

    // users.get(1).data.update(us);
    hideForm(this.overlay);
  }
}
