/// <reference path="./CssStyleDeclarations.ts"/>
/// <reference path="./ElementAttributes.ts"/>
/// <reference path="./ElementMarker.ts"/>

/**
  Marks an element for CSS to indicate an element had a background color set
    prior to recoloring.
*/
class BackgroundColorMarker implements ElementMarker {
  private cssStyleDeclarations: CssStyleDeclarations;
  private elementAttributes: ElementAttributes;

  constructor() {
    this.cssStyleDeclarations = new CssStyleDeclarations();
    this.elementAttributes = new ElementAttributes();
  }


  /** Return the attribute name used to mark DOM elements. */
  getAttributeName(): string {
    return 'data-has-background-color-before-solarized';
  }


  /** Mark a DOM element with this mark. */
  private mark(element: Element): void {
    this.elementAttributes.setAttributeLazy(
      element,
      this.getAttributeName(),
      ''
     );
  }

  requestMark(element: Element, computedStyle: CSSStyleDeclaration): void {
    if (this.cssStyleDeclarations.hasNonColorBackgroundImage(computedStyle) ||
        !this.cssStyleDeclarations.hasVisibleBackgroundColor(computedStyle)) {
      return;
    }

    this.mark(element);
  }
}
