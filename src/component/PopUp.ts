import { extname } from "path";

class PopUp extends HTMLFormElement {
    formElement: HTMLFormElement;
    
    constructor(elements: HTMLElement[]) {
        super()
        this.formElement = document.createElement('form');
        this.formElement.append(...elements);
    }

}

export class ConfirmationPopUp {
    private formElement: HTMLFormElement;
  
    constructor(data: string) {
      this.formElement = document.createElement('form');
      this.formElement.id = 'confirmationPopup';
      this.formElement.innerHTML = `
        <label for="confirmationButtons">Are you sure that you want to delete user ${data} ?</label>
        <div class="buttons" id="confirmationButtons>
          <button type="button" action="yes">Yes</button>
          <button type="button" action="no">Cancel</button>
        </div>
      `;
    }
  
    public getElement(): HTMLFormElement {
      return this.formElement;
    }
}
  