import { BACKEND_URL } from "../service/utils.js";
import { UserList } from "../component/UserList.js";

export const hideForm = function (overlay: HTMLDivElement) {
  const form = document.querySelector('.popup');
  if (form){
    document.body.removeChild(form);
    overlay.style.display = "none";
  }
}

export async function deleteUser(user_id: string) {
  console.log(`Will erase ${user_id}`);
  await fetch(`${BACKEND_URL}/user?${new URLSearchParams([['_id', user_id]]).toString()}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json());
  location.reload();
}

export function drawTable(users: UserList) {
  const usersListElement = document.getElementById("userTable") as HTMLTableElement;
  usersListElement.querySelector("tbody").innerHTML = "";
  usersListElement.querySelector("tbody")?.append(...users.toRows(0));
}
