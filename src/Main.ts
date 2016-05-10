/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./AllElementMarkers.ts"/>
/// <reference path="./ConfigurationDefaults.ts" />
/// <reference path="./ConfigurationPageRouter.ts" />
/// <reference path="./CssCode.ts"/>
/// <reference path="./SingleElementFinder.ts"/>


let onLoad = function() {
  'use strict';

  // Set defaults for missing configuration settings.
  new ConfigurationDefaults().initialize();

  // Mark elements on the page that cannot be selected by CSS alone.
  let marker: AllElementMarkers = new AllElementMarkers();
  marker.markElementsForCss();

  // Mark again after styles finish loading.
  window.addEventListener("load", () => {marker.markElementsForCss()});


  //======================================
  // Re-scan and mark the page when something changes that might affect styles.
  //======================================

  let registerForDomChange = function(callback) {
    let htmlFinder: SingleElementFinder = new SingleElementFinder();
    let observer: MutationObserver = new MutationObserver(callback);
    let observerSettings: MutationObserverInit = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };
    observer.observe(htmlFinder.getHtmlElement(), observerSettings);
  };

  // Time in miliseconds to wait before scanning and marking when scheduled.
  let REMARK_DELAY = 100;

  let remarkTimeoutId: boolean|number = false;

  let scheduleRemarking = function() {
    if (!remarkTimeoutId) {
      remarkTimeoutId = window.setTimeout(
        function() {
          marker.markElementsForCss();
          remarkTimeoutId = false;
        },
        REMARK_DELAY
      );
    }
  };

  let setupRemarking = function() {
    registerForDomChange(scheduleRemarking);
  };

  setupRemarking();


  // Recolor the page with CSS.
  new CssCode().outputCss();

  // Show the configuration page when needed.
  new ConfigurationPageRouter().route(window.location);
};
window.addEventListener("DOMContentLoaded", onLoad);
