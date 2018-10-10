/// <reference path="../lib/es6-shim.d.ts"/>
/// <reference path="./Greasemonkey.ts"/>

/** Represents the configuration options set by the user. */
class ConfigurationData {
  private optionMap: Map<string, string>;

  constructor(optionMap: Map<string, string>) {
    this.optionMap = optionMap;
  }


  private static getDefaultOptionMap(): Map<string, string> {
    const optionMap = new Map<string, string>();

    optionMap.set('colorTheme', 'dark');
    optionMap.set('domWatch', 'enabled');

    return optionMap;
  }

  /** Return an instance loaded from the user's settings. */
  public static createFromDatabase(): Promise<ConfigurationData> {
    return new Promise((resolve) => {
      const greasemonkey = new Greasemonkey();
      const optionMap = new Map<string, string>();
      const optionPromises: Promise<string>[] = [];

      ConfigurationData
          .getDefaultOptionMap()
          .forEach((defaultValue, optionName) => {
            const getValuePromise =
                greasemonkey.getValue(optionName, defaultValue);

            getValuePromise.then((value) => {
              optionMap[optionName] = value;
            });

            optionPromises.push(getValuePromise);
          });

      Promise.all(optionPromises).then(() => {
        resolve(new ConfigurationData(optionMap));
      });
    });
  }

  /** Return the value of an option. */
  public getValue(optionName: string): string {
    return this.optionMap[optionName];
  }
}
