/**
  Interprets CSS color values.
*/
class CssColorValues {
  private transparentColorRegex: RegExp;
  private urlRegex: RegExp;

  constructor() {
    this.transparentColorRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0/;
    this.urlRegex = new RegExp('url\\(');
  }


  /**
    Returns true if the specified CSS value contains a plain image
      (referencing a URL). CSS values with only pure gradients of color
      will return false.
  */
  hasPlainImage(cssValue: string): boolean {
    return this.urlRegex.test(cssValue);
  };


  /**
    Return true if the color (RGBA) is fully transparent.
      Example: rgba(5, 5, 5, 0)
  */
  isTransparentColor(cssValue: string): boolean {
    return this.transparentColorRegex.test(cssValue);
  }
}
