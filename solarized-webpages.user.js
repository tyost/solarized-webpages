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
// ==/UserScript==

(function() {
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

  var markIfHasBackgroundColor = function(element, computedStyle) {
    var backgroundImage = computedStyle.getPropertyValue('background-image');
    if (backgroundImage && backgroundImage !== 'none') {
      return;
    }

    if (computedStyle.getPropertyValue('background-color')) {
      element.setAttribute('data-has-background-color-before-solarized', '');
    }
  };

  var markElementsForCSS = function() {
    var allElements = document.getElementsByTagName('*');

    for (var i = allElements.length; i--;) {
      var element = allElements[i];
      markIfHasBackgroundColor(element, window.getComputedStyle(element, null));
    }
  };

  markElementsForCSS();

  //======================================
  // Recolor the page with CSS.
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

  GM_addStyle(
    '* {' +
    ' border-color: rgba(0, 0, 0, 0) !important;' +
    ' color: ' + COLORS.BODY_TEXT + ' !important;' +
    ' text-shadow: none !important;' +
    '}' +

    'html body, ' +
    '[data-has-background-color-before-solarized] {' +
    ' background-color: ' + COLORS.BACKGROUND + ' !important;' +
    '}' +

    'applet, button, code, command, datalist, details, ' +
    'dialog, dir, frame, frameset, input, isindex, keygen, legend, ' +
    'listing, menu, menuitem, meter, optgroup, option, output, pre, progress, ' +
    'select, summary, textarea {' +
    ' background-color: ' + COLORS.BACKGROUND_HIGHLIGHT + ' !important;' +
    ' opacity: 1 !important;' +
    '}' +

    'h1, h2, h3, h4, h5, h6, header, hgroup, thead,' +
    'h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {' +
    ' color: ' + COLORS.HEADINGS + ' !important;' +
    '}' +

    'a {' +
    ' color: ' + COLORS.HYPERLINKS + ' !important;' +
    '}'
  );

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

})();
