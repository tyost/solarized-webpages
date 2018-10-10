/// <reference path="./Greasemonkey.ts" />
/// <reference path="./ElementFactory.ts" />

/**
 *  Creates the Configuration Page.
 */
class ConfigurationPage {
  private bodyFinder: SingleElementFinder;
  private data: ConfigurationData;

  constructor(data: ConfigurationData) {
    this.bodyFinder = new SingleElementFinder();
    this.data = data;
  }


  private appendToForm(elem: Element): void {
    this.bodyFinder.getBody().appendChild(elem);
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
      this.data.getValue('colorTheme'),
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

  private clearBody() {
    this.bodyFinder.getBody().innerHTML = '';
  }

  setupForm(): void {
    this.clearBody();

    let elementFactory: ElementFactory = new ElementFactory();
    this.appendToForm(elementFactory.createH1('Solarized Webpages Configuration'));
    this.setupcolorThemeSelect();
  };
}
