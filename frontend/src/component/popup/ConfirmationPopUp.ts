import { hideForm } from "../../events/events.js";


export class ConfirmationPopUp {
  private formElement: HTMLFormElement;
  overlay: HTMLDivElement;
  yesAction: (this: HTMLFormElement, ev: SubmitEvent) => void;

  constructor(
    textToAsk: string,
    overlay: HTMLDivElement,
    yesActionfn: (this: HTMLFormElement, ev: SubmitEvent) => void
  ) {
    this.overlay = overlay;
    this.overlay.style.display = "grid";

    this.yesAction = yesActionfn;

    this.formElement = document.createElement("form");
    this.formElement.id = "confirmationPopup";
    this.formElement.className = "popup";
    this.formElement.innerHTML = textToAsk;

    this.formElement.appendChild(this.getButtons(this.yesAction));
    document.body.appendChild(this.formElement);
  }

  public getElement(): HTMLFormElement {
    return this.formElement;
  }

  private getButtons(yesAction): HTMLDivElement {
    const btnDiv = document.createElement("div") as HTMLDivElement;
    btnDiv.className = "buttons";
    const submitBtn = document.createElement("button") as HTMLButtonElement;
    const cancelBtn = document.createElement("button") as HTMLButtonElement;

    submitBtn.type = "submit";
    submitBtn.innerText = "Yes";

    cancelBtn.type = "button";
    cancelBtn.innerText = "Cancel";

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      yesAction(event);
      hideForm(this.overlay);
    });
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.append(...[submitBtn, cancelBtn]);
    return btnDiv;
  }
}
