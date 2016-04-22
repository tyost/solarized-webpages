/**
 *  Decides when to show the configuration page.
 */
class ConfigurationPageRouter {
  private scriptAlreadyRan(): boolean {
    var bodyFinder: SingleElementFinder = new SingleElementFinder();
    return !!bodyFinder.getBody().children.length;
  }

  private getConfigurationUrl(): string {
    return 'about:blank#solarized-config';;
  }

  route(location: Location): void {
    if (location.href === this.getConfigurationUrl() && !this.scriptAlreadyRan()) {
      new ConfigurationPage().setupForm();
    }
  }
}
