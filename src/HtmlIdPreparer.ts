/// <reference path="./SingleElementFinder.ts"/>

/**
  Ensures the html element of the page has an id attribute.
*/
class HtmlIdPreparer {
  private isOnlyWhitespace(s: string): boolean {
    return /^\s*$/.test(s);
  };

  private getDefaultHtmlId(): string {
    return 'solarizedHtml54321';
  }

  /** Assign an id to the html element if one is missing. */
  setHtmlIdIfMissing(): void {
    let htmlFinder: SingleElementFinder = new SingleElementFinder();
    let htmlId: string = htmlFinder.getHtmlId();

    if (!htmlId || this.isOnlyWhitespace(htmlId)) {
      htmlFinder.getHtmlElement().setAttribute('id', this.getDefaultHtmlId());
    }
  };
}
