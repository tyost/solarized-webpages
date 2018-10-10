/// <reference path="./Greasemonkey.ts" />
/// <reference path="./ElementFactory.ts" />

/**
 *  Creates the Configuration Page.
 */
class ConfigurationPage {
  private bodyFinder: SingleElementFinder;
  private elementFactory: ElementFactory;
  private data: ConfigurationData;
  private greasemonkey: Greasemonkey;

  constructor(data: ConfigurationData) {
    this.bodyFinder = new SingleElementFinder();
    this.elementFactory = new ElementFactory();
    this.greasemonkey = new Greasemonkey();
    this.data = data;
  }


  private getConfigurationOptions(): any[] {
    return [
      {
        data: 'colorTheme',
        label: 'Color Theme',
        options: {
          light: 'Light',
          dark: 'Dark'
        }
      }
    ];
  }

  private appendToForm(elem: Element): void {
    this.bodyFinder.getBody().appendChild(elem);
  };

  private createOptionElements(): void {
    this.getConfigurationOptions().forEach((option) => {
      let label: HTMLLabelElement = this.elementFactory.createLabel(
        option.data,
        option.label
      );
      this.appendToForm(label);

      let select: HTMLSelectElement = this.elementFactory.createSelect(
        option.data,
        this.data.getValue(option.data),
        option.options
      );
      this.appendToForm(select);

      select.addEventListener('change', () => {
        this.greasemonkey.setValue(option.data, select.value);
      });
    });
  };

  private clearBody() {
    this.bodyFinder.getBody().innerHTML = '';
  }

  setupForm(): void {
    this.clearBody();

    this.appendToForm(this.elementFactory.createH1('Solarized Webpages Configuration'));
    this.createOptionElements();
  };
}
