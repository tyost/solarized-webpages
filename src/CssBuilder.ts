/// <reference path="./CssSpecificityRaiser.ts"/>
/// <reference path="./CssSpecificity.ts"/>

/**
 *  Builds (combines) the CSS to output on the website.
 */
class CssBuilder {
  private cssFragments: string[];
  private specificityRaiser: CssSpecificityRaiser;

  public constructor() {
    this.cssFragments = [];
    this.specificityRaiser = new CssSpecificityRaiser();
  }


  /** Adds a fragment of CSS to the combined CSS with the desired specificity. */
  public add(cssFragment: string, specificity: CssSpecificity): void {
    this.cssFragments.push(
      this.specificityRaiser.raise(cssFragment, specificity)
    );
  }

  /** Returns the combined CSS fragments in the builder. */
  public combine(): string {
    return this.cssFragments.join('');
  }
}
