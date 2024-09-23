import { BACKEND_URL } from "../../service/utils.js";
import { hideForm } from "../../events/events.js";
import { IPosition } from "../../interface/IUser.js";
import { User } from "../User.js";

var POINT_COLOR: string = "#db4d34"

export class NoseSelectionPopup {
  private popupElement: HTMLDivElement;
  private overlay: HTMLDivElement;
  private user: User;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private clickPosition: IPosition | null;
  private img: HTMLImageElement | null;

  constructor(overlay: HTMLDivElement, user: User) {
    this.user = user;
    this.clickPosition = user.nosePosition;
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
              ${this.getNosePositionHTML(this.user.nosePosition)}
          </div>
      `;

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 500; // Set canvas size as per your requirements
    this.canvas.height = 500;

    this.context = this.canvas.getContext("2d");

    // Load the image onto the canvas
    this.img = new Image();
    this.img.src = this.user.pictureURL;
    this.img.onload = () => {
      if (this.context) {
        this.context.drawImage(
          this.img,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        if (this.clickPosition) {
            this.context.fillStyle = POINT_COLOR;
            this.context.beginPath();
            this.context.ellipse(this.clickPosition.x, this.clickPosition.y, 5, 5, 2 * Math.PI, 0, 2 * Math.PI);
            this.context.fill();
        }
      }
    };

    // Add click event listener on the canvas to register position
    this.canvas.addEventListener("click", (event: MouseEvent) =>
      this.handleCanvasClick(event)
    );

    this.popupElement.appendChild(this.canvas);
    this.popupElement.appendChild(this.getButtons()); // Add buttons for confirmation and cancel
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

  // Handle canvas click to get the position
  private handleCanvasClick(event: MouseEvent): void {
    if (this.clickPosition) {
      this.context.drawImage(
        this.img,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.clickPosition = { x, y };

    if (this.context) {
      this.context.fillStyle = POINT_COLOR;
      this.context.beginPath();
      this.context.ellipse(x, y, 5, 5, 2 * Math.PI, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  private getButtons(): HTMLDivElement {
    const btnDiv = document.createElement("div");
    btnDiv.className = "buttons";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.innerText = "Confirm";
    confirmBtn.addEventListener("click", async () => await this.sendNosePosition());

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.innerText = "Cancel";
    cancelBtn.addEventListener("click", () => hideForm(this.overlay));

    btnDiv.appendChild(confirmBtn);
    btnDiv.appendChild(cancelBtn);

    return btnDiv;
  }

  private async sendNosePosition(): Promise<void> {
    if (this.clickPosition) {
        await fetch(`${BACKEND_URL}/user?${new URLSearchParams([['_id', this.user.uid]]).toString()}`,
        {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                nosePosition: {x: this.clickPosition.x, y: this.clickPosition.y}
            })
        }).then(async res => await res.json())
        this.user.nosePosition = this.clickPosition;
        hideForm(this.overlay);
    } else {
      console.log("No position clicked yet.");
    }
  }

  public getElement(): HTMLDivElement {
    return this.popupElement;
  }
}
