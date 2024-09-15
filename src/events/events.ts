import { User } from "../component/User.js";
import { UserList } from "../component/UserList.js";

export const showForm = function (this: HTMLButtonElement, formName: string): void {
  const form = document.getElementById(formName);
  const overlay = document.getElementById("overlay");

  if (!form.offsetParent && !overlay.offsetParent) {
    form.style.display = "grid";
    overlay.style.display = "block";
  } else {
    form.style.display = "none";
    overlay.style.display = "none";
  }

};

export function newUser(event: SubmitEvent, users: UserList): any {
  event.preventDefault();
  const form = document.getElementById("myForm") as HTMLFormElement;
  const overlay = document.getElementById("overlay");

  const inputElements: object = Array.from(
    form.querySelectorAll("input")
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
  form.style.display = "none";
  overlay.style.display = "none";
}
export function deleteUser(test: HTMLElement, users: UserList) {
  
  users.remove(Number(test.parentNode.childNodes.item(0).textContent));
}

export function drawTable(usersListElement: HTMLTableElement, users: UserList) {
  usersListElement.querySelector("tbody").innerHTML = "";
  usersListElement.querySelector("tbody").append(...users.toRows(0));
}
