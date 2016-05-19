/// <reference path="./BackgroundColorMarker.ts"/>
/// <reference path="./CssColorThemes.ts"/>
/// <reference path="./CssRuleSet.ts"/>
/// <reference path="./Greasemonkey.ts"/>

/** Generates the CSS code to the page. */
class CssCode {
  private backgroundColorMarker: BackgroundColorMarker;
  private colorThemes: CssColorThemes;
  private greasemonkey: Greasemonkey;

  constructor() {
    this.backgroundColorMarker = new BackgroundColorMarker();
    this.colorThemes = new CssColorThemes();
    this.greasemonkey = new Greasemonkey();
  }


  private getGenericCss(): CssRuleSet {
    return new CssRuleSet(`
      * {
        border-color: ${this.colorThemes.getBackgroundHighlight()} !important;
        color: ${this.colorThemes.getBodyText()} !important;
        text-shadow: none !important;
      }
    `, CssSpecificity.Base);
  };

  private getColoredBackgroundCss(): CssRuleSet {
    return new CssRuleSet(`
      body,
      [${this.backgroundColorMarker.getAttributeName()}] {
        background-color: ${this.colorThemes.getBackground()} !important;
        background-image: none !important;
      }
    `, CssSpecificity.Base);
  };

  private getHeadingCss(): CssRuleSet {
    return new CssRuleSet(`
      h1, h2, h3, h4, h5, h6, header, hgroup, thead,
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {
        color: ${this.colorThemes.getHeading()} !important;
      }
    `, CssSpecificity.Base);
  };

  private getHyperlinkCss(): CssRuleSet {
    return new CssRuleSet(`
      a {
        color: ${this.colorThemes.getHyperlink()} !important;
      }
    `, CssSpecificity.Base);
  };

  private getHighlightCss(): CssRuleSet {
    return new CssRuleSet(`
      a[${this.backgroundColorMarker.getAttributeName()}],
      applet, button, code, command, datalist, details,
      dialog, dir, frame, frameset, input, isindex, keygen, legend,
      listing, menu, menuitem, meter, optgroup, option, output, pre, progress,
      select, summary, textarea {
        background-color: ${this.colorThemes.getBackgroundHighlight()} !important;
        opacity: 1 !important;
      }
    `, CssSpecificity.Highlight);
  };

  private getInteractiveElementCss(): CssRuleSet {
    return new CssRuleSet(`
      a[${this.backgroundColorMarker.getAttributeName()}],
      applet, button, command, datalist, details,
      dialog, dir, input, isindex, keygen,
      listing, menu, menuitem, meter, optgroup, option, output,
      select, summary, textarea,
      [role="button"], [role="checkbox"], [role="radio"],
      [role="scrollbar"], [role="slider"], [role="spinbutton"],
      [role="switch"], [role="textbox"] {
        border: 1px dotted ${this.colorThemes.getInteractiveElementBorder()} !important;
      }
    `, CssSpecificity.Highlight);
  };

  /** Output all of the CSS to the page. */
  public outputCss(): void {
    let cssRuleSets: CssRuleSet[] = [
      this.getGenericCss(),
      this.getColoredBackgroundCss(),
      this.getHeadingCss(),
      this.getHyperlinkCss(),
      this.getHighlightCss(),
      this.getInteractiveElementCss()
    ];

    let finalCssStrings: string[] = cssRuleSets.map((ruleSet) => {
      return ruleSet.getFinalCss()
    });

    this.greasemonkey.addStyle(finalCssStrings.join(''));
  };
}
