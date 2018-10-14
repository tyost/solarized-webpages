/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./AllElementMarkers.ts"/>
/// <reference path="./ConfigurationData.ts" />
/// <reference path="./ConfigurationPageRouter.ts" />
/// <reference path="./CssCode.ts"/>
/// <reference path="./CssColorThemes.ts"/>
/// <reference path="./DomWatch.ts"/>
/// <reference path="./SingleElementFinder.ts"/>


let onLoad = () => {
  'use strict';

  // Obtain the configuration options or defaults from the database.
  ConfigurationData.createFromDatabase().then((data) => {
    // Mark elements on the page that cannot be selected by CSS alone.
    let markers: AllElementMarkers = new AllElementMarkers();
    markers.markAllElements();

    // After the page loads, start rescanning and marking elements that change.
    if (data.getValue('domWatch') === 'enabled') {
      new DomWatch().callForAnyChange((element: Element) => {
        markers.markElement(element);
      });
    }

    // Recolor the page with CSS based on the user's configuration.
    const cssColorThemes = new CssColorThemes(data);
    new CssCode(cssColorThemes).outputCss();

    // Show the configuration page when needed.
    new ConfigurationPageRouter(data).route(window.location);
  });
};
window.addEventListener("load", onLoad);
