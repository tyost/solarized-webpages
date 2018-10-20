/// <reference path="./CssColorValues.ts"/>

/**
  Interprets CSS style declarations.
*/
class CssStyleDeclarations {
  private cssColorValues: CssColorValues;

  constructor() {
    this.cssColorValues = new CssColorValues();
  }


  /**
    Return true if the style declaration has a background image set that is
      not a color gradient.
  */
  hasNonColorBackgroundImage(computedStyle: CSSStyleDeclaration): boolean {
    let backgroundImage: string = computedStyle.getPropertyValue('background-image');

    return backgroundImage &&
        backgroundImage !== 'none' &&
        this.cssColorValues.hasPlainImage(backgroundImage);
  }

  /**
    Return true if the style declaration has a background color set that is
      not transparent.
  */
  hasVisibleBackgroundColor(computedStyle: CSSStyleDeclaration): boolean {
    let backgroundColor: string = computedStyle.getPropertyValue('background-color');
    return backgroundColor
        && backgroundColor !== 'transparent'
        && !this.cssColorValues.isTransparentColor(backgroundColor);
  }
}
