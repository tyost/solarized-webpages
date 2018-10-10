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

  // Mark elements on the page that cannot be selected by CSS alone.
  let markers: AllElementMarkers = new AllElementMarkers();
  markers.markAllElements();

  window.addEventListener('load', () => {
    // Mark again after styles finish loading.
    markers.markAllElements();

    // After the page loads, start rescanning and marking elements that change.
    new DomWatch().callForAnyChange((element: Element) => {
      markers.markElement(element);
    });
  });

  // Obtain the configuration options or defaults from the database.
  ConfigurationData.createFromDatabase().then((data) => {
    // Recolor the page with CSS based on the user's configuration.
    const cssColorThemes = new CssColorThemes(data);
    new CssCode(cssColorThemes).outputCss();

    // Show the configuration page when needed.
    new ConfigurationPageRouter(data).route(window.location);
  });
};
window.addEventListener("DOMContentLoaded", onLoad);
