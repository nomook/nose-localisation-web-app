import { User } from "./component/User.js";
import { UserList } from "./component/UserList.js";
import { deleteUser, drawTable, newUser, showForm } from "./events/events.js";

const users: UserList = new UserList([]);

let usersListElement = document.getElementById("userTable") as HTMLTableElement;
const addUserButton: HTMLButtonElement = document.getElementById(
  "addUserButton"
) as HTMLButtonElement;

const formCancelButton = document.querySelector("#myForm button[type=button]");

console.log(formCancelButton);

addUserButton?.addEventListener("click", showForm.bind(addUserButton, 'myForm'));
formCancelButton?.addEventListener("click", showForm.bind(formCancelButton, 'myForm'));

document.getElementById("myForm")?.addEventListener("submit", (event) => {
  newUser(event, users);
  drawTable(usersListElement, users);
});

for (let index = 0; index < 15; index++) {
  const user1 = new User(
    "Mouquet",
    "Noé",
    "/data/face1.jpg",
    new Date(Date.now())
  );
  users.add(user1);
}

usersListElement.querySelector("tbody").append(...users.toRows(0));

