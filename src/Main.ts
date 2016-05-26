/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./AllElementMarkers.ts"/>
/// <reference path="./ConfigurationDefaults.ts" />
/// <reference path="./ConfigurationPageRouter.ts" />
/// <reference path="./CssCode.ts"/>
/// <reference path="./DomWatch.ts"/>
/// <reference path="./SingleElementFinder.ts"/>


let onLoad = () => {
  'use strict';

  // Set defaults for missing configuration settings.
  new ConfigurationDefaults().initialize();

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

  // Recolor the page with CSS.
  new CssCode().outputCss();

  // Show the configuration page when needed.
  new ConfigurationPageRouter().route(window.location);
};
window.addEventListener("DOMContentLoaded", onLoad);
