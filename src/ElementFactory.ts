 /**
  *  Creates DOM elements.
  */
class ElementFactory {
  createH1(text: string): HTMLHeadingElement {
    let h1: HTMLHeadingElement = document.createElement('h1');

    h1.innerHTML = text;

    return h1;
  }

  createLabel(forId: string, text: string): HTMLLabelElement {
    let label: HTMLLabelElement = document.createElement('label');

    label.setAttribute('for', forId);
    label.innerHTML = text;

    return label;
  }

  createSelect(id: string, defaultValue: string, options: HtmlSelectOptions):
      HTMLSelectElement {

    let select: HTMLSelectElement = document.createElement('select');

    for (let value in options) {
      let text: string = options[value];
      let option: HTMLOptionElement = document.createElement('option');

      option.value = value;
      option.text = text;

      if (value === defaultValue) {
        option.selected = true;
      }

      select.appendChild(option);
    }

    return select;
  }
}

/**
 *  Specifies the option elements to create for the select element.
 *  Keys are the options' value attributes.
 *  Values are the visible text attributes.
 */
interface HtmlSelectOptions {
  // Keys and values must both be strings.
  [optionValue: string]: string;
}
