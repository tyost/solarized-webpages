/**
 *  Decides when to show the configuration page.
 */
class ConfigurationPageRouter {
  private getConfigurationUrls(): string[] {
    return [
      'about:blank#solarized-config',
      'https://github.com/tyost/solarized-webpages/blob/master/config.html',
      'https://github.com/tyost/solarized-webpages/blob/develop/config.html',
      'https://github.com/tyost/solarized-webpages/blob/private-chrome-config-page/config.html'
    ];
  }

  private isConfigurationPage(location: Location): boolean {
    return this.getConfigurationUrls().indexOf(location.href) !== -1;
  }

  route(location: Location): void {
    if (this.isConfigurationPage(location)) {
      new ConfigurationPage().setupForm();
    }
  }
}
