import { UserCreationPopUp } from "./component/popup/UserCreationPopUp.js";
import { User } from "./component/User.js";
import { UserList } from "./component/UserList.js";
import { hideForm } from "./events/events.js";

const users: UserList = new UserList([]);

const usersListElement = document.getElementById("userTable") as HTMLTableElement;
const addUserButton: HTMLButtonElement = document.getElementById(
  "addUserButton"
) as HTMLButtonElement;

const overlay = document.getElementById('overlay') as HTMLDivElement;
addUserButton?.addEventListener("click", () => new UserCreationPopUp(users, overlay));
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === "Escape" && document.querySelector('.popup') !== null) {
    hideForm(overlay);
  }
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

