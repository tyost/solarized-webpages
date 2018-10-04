/// <reference path="./SolarizedColor.ts"/>

/** Finds the CSS colors that should be used by the script. */
class CssColorThemes {
  private colors: any;

  public constructor(data: ConfigurationData) {
    // Base colors varying between light and dark.
    let colorThemes = {
      light: {
        background: SolarizedColor.Base3,
        backgroundHighlight: SolarizedColor.Base2,
        bodyText: SolarizedColor.Base00
      },
      dark: {
        background: SolarizedColor.Base03,
        backgroundHighlight: SolarizedColor.Base02,
        bodyText: SolarizedColor.Base0
      }
    };

    // Choose colors based on the user's theme setting.
    let colorTheme = colorThemes[data.getValue('colorTheme')];
    this.colors = Object.assign({}, colorTheme);
  }

  public getBackground(): string {
    return this.colors.background;
  }

  public getBackgroundHighlight(): string {
    return this.colors.backgroundHighlight;
  }

  public getBodyText(): string {
    return this.colors.bodyText;
  }

  public getHeading(): string {
    return SolarizedColor.Yellow;
  }

  public getHyperlink(): string {
    return SolarizedColor.Blue;
  }

  public getInteractiveElementBorder(): string {
    return SolarizedColor.Cyan;
  }
}
