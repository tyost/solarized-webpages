declare var GM_addStyle: any;
declare var GM_getValue: any;
declare var GM_setValue: any;

/** Wraps global Greasemonkey functions to expose them to TypeScript. */
class Greasemonkey {
  addStyle(css: string): void {
    GM_addStyle(css);
  };

  getValue(name: string, defaultValue: any = undefined): any {
    return GM_getValue(name, defaultValue);
  }

  setValue(name: string, value: string|number|boolean): void {
    GM_setValue(name, value);
  };
}
