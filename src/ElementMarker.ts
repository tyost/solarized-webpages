/**
  Places a "mark" on DOM elements. The mark signals something about
    that element. For example, a mark might signal that an element originally
    had a background color.

  Marks are used tell CSS things that cannot be determined through pure CSS.

  Marks might be implemented as data attributes on marked elements.
*/
interface ElementMarker {
  /**
    Mark an element if the element needs to be marked according to the rules
      of the particular ElementMarker.
  */
  requestMark(element: Element, computedStyle: CSSStyleDeclaration): void;
}
