/// <reference path="Greasemonkey.ts"/>

/** Initializes default configuration settings for the user. */
class ConfigurationDefaults {
  private greasemonkey: Greasemonkey;

  constructor() {
    this.greasemonkey = new Greasemonkey();
  }

  /** Initializes a setting to a default value if it does not exist. */
  private initializeSetting(setting: string, defaultValue: any): void {
    this.greasemonkey.setValue(
      setting,
      this.greasemonkey.getValue(setting, defaultValue)
    );
  };

  /** Sets defaults for user settings that do not exist. */
  initialize(): void {
    this.initializeSetting('colorTheme', 'dark');
  };
}
