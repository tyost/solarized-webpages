/**
  Interprets CSS color values.
*/
class CssColorValues {
  private urlRegex: RegExp;

  constructor() {
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
}
