import { UserCreationPopUp } from "../component/popup/UserCreationPopUp.js";
import { UserList } from "../component/UserList.js";

export const showForm = function (this: HTMLButtonElement, users: UserList, overlay: HTMLDivElement) {
  new UserCreationPopUp(users, overlay).getElement();
};

export const hideForm = function (overlay: HTMLDivElement) {
  const form = document.querySelector('form');
  if (form){
    document.body.removeChild(form);
    overlay.style.display = "none";
  }
}

export function deleteUser(cellElement: HTMLTableCellElement, users: UserList) {
  users.remove(Number(cellElement?.parentNode?.childNodes.item(0).textContent));
}

export function drawTable(users: UserList) {
  const usersListElement = document.getElementById("userTable") as HTMLTableElement;
  usersListElement.querySelector("tbody").innerHTML = "";
  usersListElement.querySelector("tbody")?.append(...users.toRows(0));
}
