/**
  Interprets CSS color values.
*/
class CssColorValues {
  private colorGradientRegex: RegExp;

  constructor() {
    this.colorGradientRegex = new RegExp(
      '^(-(moz|ms|o|webkit)-)?' +
      '(linear-gradient|repeating-linear-gradient|radial-gradient|repeating-radial-gradient)'
    );
  }


  /** Returns true if the specified CSS value is a color gradient. */
  isColorGradient(cssValue: string): boolean {
    return this.colorGradientRegex.test(cssValue);
  };
}
