import { hideForm } from "../../events/events.js";
import { User } from "../User.js";


export class UserCreationPopUp {
  private formElement: HTMLFormElement;
  overlay: HTMLDivElement;

  constructor(overlay: HTMLDivElement) {
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
        <input type="date" id="dateOfBirth" value="1990-01-01" required />

        <label for="photoFile">Photo (File) :</label>
        <input
          type="file"
          id="photoFile"
          placeholder="URL de la photo"
          required
        />
        `;
    this.formElement.appendChild(this.getButtons());
    this.formElement.style.display = "grid";
    document.body.appendChild(this.formElement);
  }

  public getElement(): HTMLFormElement {
    return this.formElement;
  }

  private getButtons() {
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
      await this.newUser(event);
      location.reload();
    });
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.append(...[submitBtn, cancelBtn]);
    return btnDiv;
  }

  private async newUser(event: SubmitEvent) {
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

    await User.createUser(
      inputElements["lastName"],
      inputElements["firstName"],
      inputElements["photoFile"],
      inputElements["dateOfBirth"],
    );
  }
}
