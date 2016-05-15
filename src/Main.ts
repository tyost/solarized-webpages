/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./AllElementMarkers.ts"/>
/// <reference path="./ConfigurationDefaults.ts" />
/// <reference path="./ConfigurationPageRouter.ts" />
/// <reference path="./CssCode.ts"/>
/// <reference path="./DelayedAllElementMarkers.ts" />
/// <reference path="./DomWatch.ts"/>
/// <reference path="./SingleElementFinder.ts"/>


let onLoad = function() {
  'use strict';

  // Set defaults for missing configuration settings.
  new ConfigurationDefaults().initialize();

  // Mark elements on the page that cannot be selected by CSS alone.
  let markers: AllElementMarkers = new AllElementMarkers();
  markers.markElementsForCss();

  // Mark again after styles finish loading.
  window.addEventListener("load", () => {markers.markElementsForCss()});

  // Re-scan and mark the page when something changes that might affect styles.
  let delayedMarkers: DelayedAllElementMarkers = new DelayedAllElementMarkers();
  new DomWatch().callForAnyChange(() => {
    delayedMarkers.markElementsForCss()
  });

  // Recolor the page with CSS.
  new CssCode().outputCss();

  // Show the configuration page when needed.
  new ConfigurationPageRouter().route(window.location);
};
window.addEventListener("DOMContentLoaded", onLoad);
