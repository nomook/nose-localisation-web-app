import { hideForm } from "../../events/events.js";
import { IPosition } from "../../interface/IUser.js";
import { User } from "../User.js";

export class UserInfoPopup {
  private popupElement: HTMLDivElement;
  private overlay: HTMLDivElement;
  private user: User;

  constructor(overlay: HTMLDivElement, user: User) {
    this.user = user;
    this.popupElement = document.createElement("div");
    this.showUserInfo();
    overlay.style.display = "grid";
    this.overlay = overlay;
    this.popupElement.className = "popup user-info-popup";
    this.popupElement.style.display = "grid";
    document.body.appendChild(this.popupElement);
  }

  private showUserInfo(): void {
    this.popupElement.innerHTML = `
          <h2>User Information</h2>
          <div class="user-info-container">
              <img src="${this.user.pictureURL}" alt="${this.user.firstName} ${
      this.user.name
    }" class="user-picture">
              <div class="user-details">
                  <p><strong>Name:</strong> ${this.user.name}</p>
                  <p><strong>First Name:</strong> ${this.user.firstName}</p>
                  <p><strong>Birth Date:</strong> ${this.formatDate(
                    this.user.birthDate
                  )}</p>
                  <p><strong>Last Update:</strong> ${this.formatDate(
                    this.user.lastUpdateDate
                  )}</p>
                  ${this.getNosePositionHTML(this.user.nosePosition)}
              </div>
          </div>
      `;
    this.popupElement.appendChild(this.getCloseButton());
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  private getNosePositionHTML(position?: IPosition): string {
    if (position) {
      return `
          <p><strong>Nose Position:</strong></p>
          <p>X: ${position.x}, Y: ${position.y}</p>
        `;
    }
    return "";
  }

  private getCloseButton(): HTMLDivElement {
    const btnDiv = document.createElement("div") as HTMLDivElement;
    btnDiv.className = "buttons";
    const cancelBtn = document.createElement("button") as HTMLButtonElement;

    cancelBtn.type = "button";
    cancelBtn.innerText = "Cancel";
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));
    btnDiv.appendChild(cancelBtn);
    return btnDiv;
  }

  public getElement(): HTMLDivElement {
    return this.popupElement;
  }
}
