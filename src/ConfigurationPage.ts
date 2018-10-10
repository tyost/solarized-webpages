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
        label: '<b>Color Theme</b>',
        options: {
          light: 'Light',
          dark: 'Dark'
        }
      },
      {
        data: 'domWatch',
        label: '<b>DOM Watch</b><br>Recolor the page as it changes.'
            + ' Disable to improve performance.',
        options: {
          enabled: 'Enabled',
          disabled: 'Disabled'
        }
      },
    ];
  }

  private appendToForm(elem: Element): void {
    this.bodyFinder.getBody().appendChild(elem);
  };

  private createOptionElements(): void {
    this.getConfigurationOptions().forEach((option) => {
      let div: HTMLDivElement = document.createElement('div');
      div.style.marginBottom = '20px';

      let label: HTMLLabelElement = this.elementFactory.createLabel(
        option.data,
        option.label
      );
      label.style.display = 'block';
      label.style.maxWidth = '500px';
      div.appendChild(label);

      let select: HTMLSelectElement = this.elementFactory.createSelect(
        option.data,
        this.data.getValue(option.data),
        option.options
      );
      select.style.marginLeft = '10px';
      div.appendChild(select);

      this.appendToForm(div);

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
