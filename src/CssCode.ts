/// <reference path="./BackgroundColorMarker.ts"/>
/// <reference path="./CssBuilder.ts"/>
/// <reference path="./CssColorThemes.ts"/>
/// <reference path="./Greasemonkey.ts"/>

/** Generates the CSS code to the page. */
class CssCode {
  private backgroundColorMarker: BackgroundColorMarker;
  private cssBuilder: CssBuilder;
  private colorThemes: CssColorThemes;
  private greasemonkey: Greasemonkey;

  constructor() {
    this.backgroundColorMarker = new BackgroundColorMarker();
    this.cssBuilder = new CssBuilder();
    this.colorThemes = new CssColorThemes();
    this.greasemonkey = new Greasemonkey();
  }


  private getGenericCss(): string {
    return `
      * {
        border-color: ${this.colorThemes.getBackgroundHighlight()} !important;
        color: ${this.colorThemes.getBodyText()} !important;
        text-shadow: none !important;
      }
    `;
  };

  private getColoredBackgroundCss(): string {
    return `
      body,
      [${this.backgroundColorMarker.getAttributeName()}] {
        background-color: ${this.colorThemes.getBackground()} !important;
        background-image: none !important;
      }
    `;
  };

  private getHeadingCss(): string {
    return `
      h1, h2, h3, h4, h5, h6, header, hgroup, thead,
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {
        color: ${this.colorThemes.getHeading()} !important;
      }
    `;
  };

  private getHyperlinkCss(): string {
    return `
      a {
        color: ${this.colorThemes.getHyperlink()} !important;
      }
    `;
  };

  private getHighlightCss(): string {
    return `
      a[${this.backgroundColorMarker.getAttributeName()}],
      applet, button, code, command, datalist, details,
      dialog, dir, frame, frameset, input, isindex, keygen, legend,
      listing, menu, menuitem, meter, optgroup, option, output, pre, progress,
      select, summary, textarea {
        background-color: ${this.colorThemes.getBackgroundHighlight()} !important;
        opacity: 1 !important;
      }
    `;
  };

  private getInteractiveElementCss(): string {
    return `
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
    `;
  };

  /** Output all of the CSS to the page. */
  public outputCss(): void {
    this.cssBuilder.add(this.getGenericCss(), CssSpecificity.Base);
    this.cssBuilder.add(this.getColoredBackgroundCss(), CssSpecificity.Base);
    this.cssBuilder.add(this.getHeadingCss(), CssSpecificity.Base);
    this.cssBuilder.add(this.getHyperlinkCss(), CssSpecificity.Base);
    this.cssBuilder.add(this.getHighlightCss(), CssSpecificity.Highlight);
    this.cssBuilder.add(this.getInteractiveElementCss(), CssSpecificity.Highlight);

    this.greasemonkey.addStyle(this.cssBuilder.combine());
  };
}
