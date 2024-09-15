import { IUser } from "../interfaces/IUser.js";

export class User implements IUser {
    uid: string;
    name: string;
    firstName: string;
    pictureURL: string;
    birthDate: Date;
    nosePosition?: { x: number, y: number};
    creationDate: Date;

    constructor(
        name: string,
        firstName: string,
        pictureURL: string,
        birthDate: Date,
    ) {
        this.uid = self.crypto.randomUUID();
        this.name = name;
        this.firstName = firstName;
        this.pictureURL = pictureURL;
        this.birthDate = birthDate;
        
        this.creationDate = new Date(Date.now());
    }

    toRow(index : number = 0) : HTMLTableRowElement {
        
        function createElement(type: string, innerText: string) {
            const el = document.createElement(type);
            el.innerHTML = innerText;
            return el;
        }

        const rowEl : HTMLTableRowElement = document.createElement('tr');

        rowEl.appendChild(createElement('td', index.toString()));
        rowEl.appendChild(createElement('td', this.name.toString()));
        rowEl.appendChild(createElement('td', this.firstName.toString()));
        rowEl.appendChild(createElement('td', this.birthDate.toDateString()));
        rowEl.appendChild(createElement('td', this.creationDate.toISOString()));
    
        rowEl.appendChild(createElement('td', "<span id='view'>👁️</span><span id='localize'>👃</span><span id='edit'>✍️</span><span id='delete'>❌</span>"));
        // console.log(rowEl.children.item(0).);
        rowEl.children.item(rowEl.children.length-1).childNodes.forEach((e) => (e as HTMLElement).style.padding = '0px 20px 0px 20px');
        (rowEl.children.item(rowEl.children.length-1) as HTMLElement).style.display = 'flex';
        (rowEl.children.item(rowEl.children.length-1) as HTMLElement).style.padding = '0px';
        return rowEl as HTMLTableRowElement;
    }

}


export {};
