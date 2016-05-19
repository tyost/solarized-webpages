/// <reference path="./Greasemonkey.ts" />
/// <reference path="./ElementFactory.ts" />

/**
 *  Creates the Configuration Page.
 */
class ConfigurationPage {
  private appendToForm(elem: Element): void {
    var bodyFinder: SingleElementFinder = new SingleElementFinder();
    bodyFinder.getBody().appendChild(elem);
  };

  private setupcolorThemeSelect(): void {
    let elementFactory: ElementFactory = new ElementFactory();

    let colorThemeLabel: HTMLLabelElement = elementFactory.createLabel(
      'color-theme-select',
      'Color Theme'
    );
    this.appendToForm(colorThemeLabel);

    let greasemonkey: Greasemonkey = new Greasemonkey();

    let colorThemeSelect: HTMLSelectElement = elementFactory.createSelect(
      'color-theme-select',
      greasemonkey.getValue('colorTheme'),
      {
        light:  'Light',
        dark:   'Dark'
      }
    );
    this.appendToForm(colorThemeSelect);

    colorThemeSelect.addEventListener('change', () => {
      greasemonkey.setValue('colorTheme', colorThemeSelect.value);
    });
  };

  setupForm(): void {
    let elementFactory: ElementFactory = new ElementFactory();
    this.appendToForm(elementFactory.createH1('Solarized Webpages Configuration'));
    this.setupcolorThemeSelect();
  };
}
