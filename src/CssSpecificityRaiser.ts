/// <reference path="./HtmlIdPreparer.ts"/>
/// <reference path="./SingleElementFinder.ts" />

/**
 *  Increases the specificity (priority) of fragments of CSS code.
 */
class CssSpecificityRaiser {
  private buildIdSelector(id: string): string {
    return '#' + id;
  };

  private buildIdSelectorWithSpecificity(id: string, amount: number): string {
    return this.buildIdSelector(id).repeat(amount);
  };

  private getSubstringBefore(s: string, character: string): string {
    return s.substring(0, s.indexOf(character));
  };

  private insertBeforeAllSelectors(css: string, extraSelector: string): string {
    let selectorCss: string = this.getSubstringBefore(css, '{');
    let newSelectorCss: string =
      selectorCss.replace(/([^,]+)(,|$)/g, extraSelector + ' $1$2');
    return css.replace(selectorCss, newSelectorCss);
  };

  raise(css: string, amount: number): string {
    // An id attribute is needed on the html element to make raising specificity
    // possible.
    new HtmlIdPreparer().setHtmlIdIfMissing();

    // Insert a repeated ID before each CSS selector to artificially raise
    // its specificity by the specified amount.
    // For example, #solarizedHtml54321#solarizedHtml54321 p
    // raises the id specificity by two.
    let elementFinder: SingleElementFinder = new SingleElementFinder();
    let extraSelector: string =
      this.buildIdSelectorWithSpecificity(elementFinder.getHtmlId(), amount);
    return this.insertBeforeAllSelectors(css, extraSelector);
  };
}
