import { drawTable, hideForm } from "../../events/events.js";
import { User } from "../User.js";
import { UserList } from "../UserList.js";


export class UserCreationPopUp {
  private formElement: HTMLFormElement;
  overlay: HTMLDivElement;

  constructor(users, overlay: HTMLDivElement) {
    this.formElement = document.createElement("form");
    overlay.style.display = "grid";
    this.overlay = overlay;
    this.formElement.id = "myForm";
    this.formElement.className = "popup";
    this.formElement.innerHTML = `
        <label for="lastName">Nom :</label>
        <input type="text" id="lastName" required />
        
        <label for="firstName">Prénom :</label>
        <input type="text" id="firstName" required />


        <label for="dateOfBirth">Date de naissance :</label>
        <input type="date" id="dateOfBirth" />

        <label for="photoUrl">Photo (URL) :</label>
        <input
          type="file"
          id="photoUrl"
          placeholder="URL de la photo"
        />
        `;
    this.formElement.appendChild(this.getButtons(users));
    this.formElement.style.display = "grid";
    document.body.appendChild(this.formElement);
  }

  public getElement(): HTMLFormElement {
    return this.formElement;
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
      this.newUser(event, users);
      drawTable(users);
    });
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.append(...[submitBtn, cancelBtn]);
    return btnDiv;
  }

  private newUser(event: SubmitEvent, users: UserList) {
    const inputElements: object = Array.from(
      this.formElement.querySelectorAll("input")
    ).reduce((obj, el) => {
      obj[el.id] = el.value;
      return obj;
    }, {});

    const us = new User(
      inputElements["lastName"],
      inputElements["firstName"],
      inputElements["photoUrl"],
      new Date(inputElements["dateOfBirth"])
    );

    users.add(us);
    hideForm(this.overlay);
  }
}
