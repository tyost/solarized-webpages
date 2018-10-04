declare var GM: any;

/** Wraps global Greasemonkey functions to expose them to TypeScript. */
class Greasemonkey {
  addStyle(css: string): void {
    GM.addStyle(css);
  };

  getValue(name: string, defaultValue: string = undefined):
      Promise<string> {
    return GM.getValue(name, defaultValue);
  }

  setValue(name: string, value: string): void {
    GM.setValue(name, value);
  };
}
