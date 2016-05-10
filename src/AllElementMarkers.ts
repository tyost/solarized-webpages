/// <reference path="./BackgroundColorMarker.ts"/>

/** Marks certain elements that cannot be selected by CSS alone. */
class AllElementMarkers {
  private backgroundColorMarker: ElementMarker;

  constructor() {
    this.backgroundColorMarker = new BackgroundColorMarker();
  }


  markElementsForCss(): void {
    let allElements: NodeListOf<Element> = document.getElementsByTagName('*');

    for (let i: number = allElements.length; i--;) {
      let element: Element = allElements[i];
      let computedStyle: CSSStyleDeclaration =
          window.getComputedStyle(element, undefined);

      if (computedStyle) {
        this.backgroundColorMarker.requestMark(element, computedStyle);
      }
    }
  };
}
