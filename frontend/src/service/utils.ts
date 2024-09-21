export const PAGE_MAX_LENGTH = 20;

export function inputElement(id: string, labelText: string, required: boolean = false, data_type: string = 'text', placeHolder: any = null) : HTMLElement[] {
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = labelText;

    const inputElement = document.createElement('input') as HTMLInputElement;
    inputElement.type = data_type;
    inputElement.id = id;
    inputElement.required = required;
    inputElement.setAttribute('value', placeHolder);

    return [labelElement, inputElement, document.createElement('br')];
  }