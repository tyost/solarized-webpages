/**
  Provides operations to simplify working with an element's attributes.
*/
class ElementAttributes {
  /**
    Set a DOM element's attribute to a new value only if the new value is
      different than the old value. This function avoids unnecessary DOM
      changes which can be expensive.
  */
  setAttributeLazy(element: Element, attribute: string, value: string): void {
    if (element.getAttribute(attribute) != value) {
      element.setAttribute(attribute, value);
    }
  };
}
