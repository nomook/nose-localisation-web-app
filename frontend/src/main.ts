import { UserCreationPopUp } from "./component/popup/UserCreationPopUp.js";
import { User } from "./component/User.js";
import { UserList } from "./component/UserList.js";
import { hideForm } from "./events/events.js";
import { BACKEND_URL } from "./service/utils.js";


const users: UserList = new UserList([]);
const usersdb = fetch(`${BACKEND_URL}/users?${new URLSearchParams([['limit', '10'], ['offset', '0']]).toString()}`).then((rep) => rep.json());

const usersListElement = document.getElementById("userTable") as HTMLTableElement;
const addUserButton: HTMLButtonElement = document.getElementById(
  "addUserButton"
) as HTMLButtonElement;

const overlay = document.getElementById('overlay') as HTMLDivElement;
addUserButton?.addEventListener("click", () => new UserCreationPopUp(overlay));
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === "Escape" && document.querySelector('.popup') !== null) {
    hideForm(overlay);
  }
});

(await usersdb)?.users.forEach(element => {
  users.add(new User(
    element?._id,
    element?.name,
    element?.firstName,
    element?.pictureURL,
    element?.nosePosition,
    new Date(Date.parse(element?.lastUpdateDate)),
    new Date(Date.parse(element?.birthDate)),
  ));
});

usersListElement.querySelector("tbody").append(...users.toRows(0));

