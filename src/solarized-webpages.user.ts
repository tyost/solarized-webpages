/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./ConfigurationDefaults.ts" />
/// <reference path="./ConfigurationPageRouter.ts" />
/// <reference path="./CssCode.ts"/>
/// <reference path="./SingleElementFinder.ts"/>

let onLoad = function() {
  'use strict';

  // Set defaults for missing configuration settings.
  new ConfigurationDefaults().initialize();

  //======================================
  // Mark elements on the page that cannot be selected by CSS alone.
  //======================================

  // Using data attributes rather than classes as they won't break brittle
  // class logic on sites.
  // For example, some sites might only use one class on a particular
  // element. As a result, they compare the entire class string against one
  // class name. That code would break if we added another class.

  let COLOR_GRADIENT_REGEX =
      /^(-(moz|ms|o|webkit)-)?(linear-gradient|repeating-linear-gradient|radial-gradient|repeating-radial-gradient)/;

  let isColorGradient = function(value) {
    return COLOR_GRADIENT_REGEX.test(value);
  };

  let setAttributeIfDifferent = function(element, attribute, value) {
    if (element.getAttribute(attribute) != value) {
      element.setAttribute(attribute, value);
    }
  };

  let markIfHasBackgroundColor = function(element, computedStyle) {
    let backgroundImage = computedStyle.getPropertyValue('background-image');

    if (backgroundImage && backgroundImage !== 'none' &&
          !isColorGradient(backgroundImage)) {
      return;
    }

    let backgroundColor = computedStyle.getPropertyValue('background-color');
    if (backgroundColor && backgroundColor !== 'transparent') {
      setAttributeIfDifferent(element, 'data-has-background-color-before-solarized', '');
    }
  };

  let getComputedStylePropertyRgb = function(computedStyle, property) {
    let color = computedStyle.getPropertyCSSValue('color');
    return color ? color.getRGBColorValue() : null;
  };

  let markElementsForCss = function() {
    let allElements = document.getElementsByTagName('*');

    for (let i = allElements.length; i--;) {
      let element = allElements[i];
      let computedStyle = window.getComputedStyle(element, null);

      if (computedStyle) {
        markIfHasBackgroundColor(element, computedStyle);
      }
    }
  };

  markElementsForCss();

  // Scan again after styles finish loading.
  window.addEventListener("load", markElementsForCss);

  //======================================
  // Re-scan and mark the page when something changes that might affect styles.
  //======================================

  let registerForDomChange = function(callback) {
    let htmlFinder: SingleElementFinder = new SingleElementFinder();
    let observer = new MutationObserver(callback);
    let observerSettings = {
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
          markElementsForCss();
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
