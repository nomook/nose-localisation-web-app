export const PAGE_MAX_LENGTH = 20;

export function inputElement(id: string, textContent: string, required: boolean = false, data_type: string = 'text') : HTMLElement[] {
    const lastNameLabel = document.createElement('label');
    lastNameLabel.htmlFor = id;
    lastNameLabel.textContent = textContent;

    const lastNameInput = document.createElement('input');
    lastNameInput.type = data_type;
    lastNameInput.id = id;
    lastNameInput.required = required;

    return [lastNameLabel, lastNameInput, document.createElement('br')];
  }