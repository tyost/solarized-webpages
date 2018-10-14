/// <reference path="./CssSpecificity.ts"/>
/// <reference path="./CssSpecificityRaiser.ts"/>

/**
  Represents a single rule set of CSS code.
*/
class CssRuleSet {
  private cssSpecificityRaiser: CssSpecificityRaiser;
  private originalCss: string;
  private specificity: CssSpecificity;

  constructor(css: string, specificity: CssSpecificity) {
    this.originalCss = css;
    this.specificity = specificity;

    this.cssSpecificityRaiser = new CssSpecificityRaiser();
  }

  getFinalCss(): string {
    return this.cssSpecificityRaiser.raise(this.originalCss, this.specificity);
  }
}
