// ==UserScript==
// @name        Solarized Webpages
// @namespace   tyost
// @description Adjusts websites to fit the Solarized color palette.
// @include     *
// @include     about:blank#solarized-config
// @version     1
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// ==/UserScript==

var onLoad = function() {
  'use strict';

  //======================================
  // Set defaults for missing configuration settings.
  //======================================

  var setDefault = function(setting, defaultValue) {
    GM_setValue(setting, GM_getValue(setting, defaultValue));
  };

  var setupDefaultConfiguration = function() {
    setDefault('colorTheme', 'dark');
  };

  setupDefaultConfiguration();

  //======================================
  // Mark elements on the page that cannot be selected by CSS alone.
  //======================================

  // Using data attributes rather than classes as they won't break brittle
  // class logic on sites.
  // For example, some sites might only use one class on a particular
  // element. As a result, they compare the entire class string against one
  // class name. That code would break if we added another class.

  var COLOR_GRADIENT_REGEX =
      /^(-(moz|ms|o|webkit)-)?(linear-gradient|repeating-linear-gradient|radial-gradient|repeating-radial-gradient)/;

  var isColorGradient = function(value) {
    return COLOR_GRADIENT_REGEX.test(value);
  };

  var setAttributeIfDifferent = function(element, attribute, value) {
    if (element.getAttribute(attribute) != value) {
      element.setAttribute(attribute, value);
    }
  };

  var markIfHasBackgroundColor = function(element, computedStyle) {
    var backgroundImage = computedStyle.getPropertyValue('background-image');

    if (backgroundImage && backgroundImage !== 'none' &&
          !isColorGradient(backgroundImage)) {
      return;
    }

    var backgroundColor = computedStyle.getPropertyValue('background-color');
    if (backgroundColor && backgroundColor !== 'transparent') {
      setAttributeIfDifferent(element, 'data-has-background-color-before-solarized', '');
    }
  };

  var markElementsForCss = function() {
    var allElements = document.getElementsByTagName('*');

    for (var i = allElements.length; i--;) {
      var element = allElements[i];
      var computedStyle = window.getComputedStyle(element, null);

      if (computedStyle) {
        markIfHasBackgroundColor(element, computedStyle);
      }
    }
  };

  markElementsForCss();

  //======================================
  // Functions for retrieving certain DOM elements.
  //======================================

  var getHtmlElement = function() {
    return document.getElementsByTagName('html')[0];
  };

  //======================================
  // Re-scan and mark the page when something changes that might affect styles.
  //======================================

  var registerForDomChange = function(callback) {
    var observer = new MutationObserver(callback);
    var observerSettings = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };
    observer.observe(getHtmlElement(), observerSettings);
  };

  // Time in miliseconds to wait before scanning and marking when scheduled.
  var REMARK_DELAY = 100;

  var remarkTimeoutId = false;

  var scheduleRemarking = function() {
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

  var setupRemarking = function() {
    registerForDomChange(scheduleRemarking);
  };

  setupRemarking();

  //======================================
  // Colors.
  //======================================

  var SOLARIZED_PALETTE = {
    BASE03:   '#002b36',   // Darker
    BASE02:   '#073642',
    BASE01:   '#586e75',
    BASE00:   '#657b83',
    BASE0:    '#839496',
    BASE1:    '#93a1a1',
    BASE2:    '#eee8d5',
    BASE3:    '#fdf6e3',   // Lighter
    BLUE:     '#268bd2',
    CYAN:     '#2aa198',
    GREEN:    '#859900',
    MAGENTA:  '#d33682',
    ORANGE:   '#cb4b16',
    RED:      '#dc322f',
    VIOLET:   '#6c71c4',
    YELLOW:   '#b58900'
  };

  // Base colors varying between light and dark.
  var COLOR_THEMES = {
    light: {
      BACKGROUND:           SOLARIZED_PALETTE.BASE3,
      BACKGROUND_HIGHLIGHT: SOLARIZED_PALETTE.BASE2,
      BODY_TEXT:            SOLARIZED_PALETTE.BASE00
    },
    dark: {
      BACKGROUND:           SOLARIZED_PALETTE.BASE03,
      BACKGROUND_HIGHLIGHT: SOLARIZED_PALETTE.BASE02,
      BODY_TEXT:            SOLARIZED_PALETTE.BASE0
    }
  };

  // Choose colors based on the user's theme setting.
  var COLORS = Object.assign({}, COLOR_THEMES[GM_getValue('colorTheme')]);

  // Color settings shared between light and dark.
  COLORS.HEADINGS = SOLARIZED_PALETTE.YELLOW;
  COLORS.HYPERLINKS = SOLARIZED_PALETTE.BLUE;
  COLORS.INTERACTIVE_ELEMENT_BORDER = SOLARIZED_PALETTE.CYAN;

  //======================================
  // Setup elements needed to control specificity (precedence) of CSS code.
  //======================================

  var getHtmlId = function() {
    return getHtmlElement().getAttribute('id');
  };

  var isOnlyWhitespace = function(s) {
    return /^\s*$/.test(s);
  };

  var DEFAULT_HTML_ID = 'solarizedHtml54321';

  var setHtmlIdIfMissing = function() {
    var htmlId = getHtmlId();

    if (!htmlId || isOnlyWhitespace(htmlId)) {
      getHtmlElement().setAttribute('id', DEFAULT_HTML_ID);
    }
  };

  setHtmlIdIfMissing();

  //======================================
  // Functions controlling the specificity (precedence) of CSS code.
  //======================================

  var buildIdSelector = function(id) {
    return '#' + id;
  };

  var buildIdSelectorWithSpecificity = function(id, amount) {
    return buildIdSelector(id).repeat(amount);
  };

  var getSubstringBefore = function(s, character) {
    return s.substring(0, s.indexOf(character));
  };

  var insertBeforeAllSelectors = function(css, extraSelector) {
    var selectorCss = getSubstringBefore(css, '{');
    var newSelectorCss = selectorCss.replace(/([^,]+)(,|$)/g, extraSelector + ' $1$2');
    return css.replace(selectorCss, newSelectorCss);
  };

  var increaseAllSpecificity = function(css, amount) {
    // Insert a repeated ID before each CSS selector to artificially raise
    // its specificity by the specified amount.
    // For example, #solarizedHtml54321#solarizedHtml54321 p
    // raises the id specificity by two.
    var extraSelector = buildIdSelectorWithSpecificity(getHtmlId(), amount);
    return insertBeforeAllSelectors(css, extraSelector);
  };

  //======================================
  // Recolor the page with CSS.
  //======================================

  var GENERIC_SPECIFICITY = 15;
  var HIGHLIGHT_SPECIFICITY = GENERIC_SPECIFICITY + 1;

  var getGenericCss = function() {
    var css = '* {' +
              ' border-color: ' + COLORS.BACKGROUND_HIGHLIGHT + ' !important;' +
              ' color: ' + COLORS.BODY_TEXT + ' !important;' +
              ' text-shadow: none !important;' +
              '}';
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  var getColoredBackgroundCss = function() {
    var css = 'body, ' +
              '[data-has-background-color-before-solarized] {' +
              ' background-color: ' + COLORS.BACKGROUND + ' !important;' +
              ' background-image: none !important;' +
              '}';
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  var getHeadingCss = function() {
    var css = 'h1, h2, h3, h4, h5, h6, header, hgroup, thead,' +
              'h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {' +
              ' color: ' + COLORS.HEADINGS + ' !important;' +
              '}';
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  var getHyperlinkCss = function() {
    var css = 'a {' +
              ' color: ' + COLORS.HYPERLINKS + ' !important;' +
              '}';
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  var getHighlightCss = function() {
    var css = 'a[data-has-background-color-before-solarized], ' +
              'applet, button, code, command, datalist, details, ' +
              'dialog, dir, frame, frameset, input, isindex, keygen, legend, ' +
              'listing, menu, menuitem, meter, optgroup, option, output, pre, progress, ' +
              'select, summary, textarea {' +
              ' background-color: ' + COLORS.BACKGROUND_HIGHLIGHT + ' !important;' +
              ' opacity: 1 !important;' +
              '}';
    return increaseAllSpecificity(css, HIGHLIGHT_SPECIFICITY);
  };

  var getInteractiveElementCss = function() {
    var css = 'a[data-has-background-color-before-solarized], ' +
              'applet, button, command, datalist, details, ' +
              'dialog, dir, input, isindex, keygen, ' +
              'listing, menu, menuitem, meter, optgroup, option, output, ' +
              'select, summary, textarea, ' +
              '[role="button"], [role="checkbox"], [role="radio"], ' +
              '[role="scrollbar"], [role="slider"], [role="spinbutton"], ' +
              '[role="switch"], [role="textbox"] {' +
              ' border: 1px dotted ' + COLORS.INTERACTIVE_ELEMENT_BORDER + ' !important;' +
              '}';
    return increaseAllSpecificity(css, HIGHLIGHT_SPECIFICITY);
  };

  var getAllCss = function() {
    return  getGenericCss() +
            getColoredBackgroundCss() +
            getHeadingCss() +
            getHyperlinkCss() +
            getHighlightCss() +
            getInteractiveElementCss();
  };

  GM_addStyle(getAllCss());

  //======================================
  // Configuration page to edit the script's settings.
  //======================================

  var createH1 = function(text) {
    var h1 = document.createElement('h1');

    h1.innerHTML = text;

    return h1;
  };

  var createLabel = function(forId, text) {
    var label = document.createElement('label');

    label.for = forId;
    label.innerHTML = text;

    return label;
  };

  var createSelect = function(id, defaultValue, options) {
    var select = document.createElement('select');

    for (var value in options) {
      var text = options[value];

      var option = document.createElement('option');

      option.value = value;
      option.text = text;

      if (value === defaultValue) {
        option.selected = true;
      }

      select.appendChild(option);
    }

    return select;
  };

  var getBody = function() {
    return document.getElementsByTagName('body')[0];
  };

  var appendToForm = function(elem) {
    getBody().appendChild(elem);
  };

  var setupcolorThemeSelect = function() {
    var colorThemeLabel = createLabel(
      'color-theme-select',
      'Color Theme'
    );
    appendToForm(colorThemeLabel);

    var colorThemeSelect = createSelect(
      'color-theme-select',
      GM_getValue('colorTheme'),
      {
        light:  'Light',
        dark:   'Dark'
      }
    );
    appendToForm(colorThemeSelect);

    colorThemeSelect.addEventListener('change', function() {
      GM_setValue('colorTheme', colorThemeSelect.value);
    });
  };

  var setupForm = function() {
    appendToForm(createH1('Solarized Webpages Configuration'));
    setupcolorThemeSelect();
  };


  var getUrl = function() {
    return content.document.location.href;
  };

  var scriptAlreadyRan = function() {
    return !!getBody().children.length;
  };


  var CONFIG_FORM_URL = 'about:blank#solarized-config';

  if (getUrl() === CONFIG_FORM_URL && !scriptAlreadyRan()) {
    setupForm();
  }
};
window.addEventListener("DOMContentLoaded", onLoad);
