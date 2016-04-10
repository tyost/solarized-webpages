/// <reference path="../lib/es6-shim.d.ts" />
/// <reference path="./Greasemonkey.ts" />

let onLoad = function() {
  'use strict';

  //======================================
  // Greasemonkey
  //======================================

  let greasemonkey = new Greasemonkey();

  //======================================
  // Set defaults for missing configuration settings.
  //======================================

  let setDefault = function(setting, defaultValue) {
    greasemonkey.setValue(setting, greasemonkey.getValue(setting, defaultValue));
  };

  let setupDefaultConfiguration = function() {
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
  // Functions for retrieving certain DOM elements.
  //======================================

  let getHtmlElement = function() {
    return document.getElementsByTagName('html')[0];
  };

  //======================================
  // Re-scan and mark the page when something changes that might affect styles.
  //======================================

  let registerForDomChange = function(callback) {
    let observer = new MutationObserver(callback);
    let observerSettings = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };
    observer.observe(getHtmlElement(), observerSettings);
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

  //======================================
  // Colors.
  //======================================

  let SOLARIZED_PALETTE = {
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

  // Base colors letying between light and dark.
  let COLOR_THEMES = {
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
  let COLORS = Object.assign({}, COLOR_THEMES[greasemonkey.getValue('colorTheme')]);

  // Color settings shared between light and dark.
  COLORS.HEADINGS = SOLARIZED_PALETTE.YELLOW;
  COLORS.HYPERLINKS = SOLARIZED_PALETTE.BLUE;
  COLORS.INTERACTIVE_ELEMENT_BORDER = SOLARIZED_PALETTE.CYAN;

  //======================================
  // Setup elements needed to control specificity (precedence) of CSS code.
  //======================================

  let getHtmlId = function() {
    return getHtmlElement().getAttribute('id');
  };

  let isOnlyWhitespace = function(s) {
    return /^\s*$/.test(s);
  };

  let DEFAULT_HTML_ID = 'solarizedHtml54321';

  let setHtmlIdIfMissing = function() {
    let htmlId = getHtmlId();

    if (!htmlId || isOnlyWhitespace(htmlId)) {
      getHtmlElement().setAttribute('id', DEFAULT_HTML_ID);
    }
  };

  setHtmlIdIfMissing();

  //======================================
  // Functions controlling the specificity (precedence) of CSS code.
  //======================================

  let buildIdSelector = function(id) {
    return '#' + id;
  };

  let buildIdSelectorWithSpecificity = function(id, amount) {
    return buildIdSelector(id).repeat(amount);
  };

  let getSubstringBefore = function(s, character) {
    return s.substring(0, s.indexOf(character));
  };

  let insertBeforeAllSelectors = function(css, extraSelector) {
    let selectorCss = getSubstringBefore(css, '{');
    let newSelectorCss = selectorCss.replace(/([^,]+)(,|$)/g, extraSelector + ' $1$2');
    return css.replace(selectorCss, newSelectorCss);
  };

  let increaseAllSpecificity = function(css, amount) {
    // Insert a repeated ID before each CSS selector to artificially raise
    // its specificity by the specified amount.
    // For example, #solarizedHtml54321#solarizedHtml54321 p
    // raises the id specificity by two.
    let extraSelector = buildIdSelectorWithSpecificity(getHtmlId(), amount);
    return insertBeforeAllSelectors(css, extraSelector);
  };

  //======================================
  // Recolor the page with CSS.
  //======================================

  let GENERIC_SPECIFICITY = 15;
  let HIGHLIGHT_SPECIFICITY = GENERIC_SPECIFICITY + 1;

  let getGenericCss = function() {
    let css = `
        * {
          border-color: ${COLORS.BACKGROUND_HIGHLIGHT} !important;
          color: ${COLORS.BODY_TEXT} !important;
          text-shadow: none !important;
        }
    `;
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  let getColoredBackgroundCss = function() {
    let css = `
        body,
        [data-has-background-color-before-solarized] {
          background-color: ${COLORS.BACKGROUND} !important;
          background-image: none !important;
        }
    `;
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  let getHeadingCss = function() {
    let css = `
        h1, h2, h3, h4, h5, h6, header, hgroup, thead,
        h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {
          color: ${COLORS.HEADINGS} !important;
        }
    `;
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  let getHyperlinkCss = function() {
    let css = `
        a {
          color: ${COLORS.HYPERLINKS} !important;
        }
    `;
    return increaseAllSpecificity(css, GENERIC_SPECIFICITY);
  };

  let getHighlightCss = function() {
    let css = `
        a[data-has-background-color-before-solarized],
        applet, button, code, command, datalist, details,
        dialog, dir, frame, frameset, input, isindex, keygen, legend,
        listing, menu, menuitem, meter, optgroup, option, output, pre, progress,
        select, summary, textarea {
          background-color: ${COLORS.BACKGROUND_HIGHLIGHT} !important;
          opacity: 1 !important;
        }
    `;
    return increaseAllSpecificity(css, HIGHLIGHT_SPECIFICITY);
  };

  let getInteractiveElementCss = function() {
    let css = `
        a[data-has-background-color-before-solarized],
        applet, button, command, datalist, details,
        dialog, dir, input, isindex, keygen,
        listing, menu, menuitem, meter, optgroup, option, output,
        select, summary, textarea,
        [role="button"], [role="checkbox"], [role="radio"],
        [role="scrollbar"], [role="slider"], [role="spinbutton"],
        [role="switch"], [role="textbox"] {
          border: 1px dotted ${COLORS.INTERACTIVE_ELEMENT_BORDER} !important;
        }
    `;
    return increaseAllSpecificity(css, HIGHLIGHT_SPECIFICITY);
  };

  let getAllCss = function() {
    return  getGenericCss() +
            getColoredBackgroundCss() +
            getHeadingCss() +
            getHyperlinkCss() +
            getHighlightCss() +
            getInteractiveElementCss();
  };

  greasemonkey.addStyle(getAllCss());

  //======================================
  // Configuration page to edit the script's settings.
  //======================================

  let createH1 = function(text) {
    let h1 = document.createElement('h1');

    h1.innerHTML = text;

    return h1;
  };

  let createLabel = function(forId, text) {
    let label = document.createElement('label');

    label.setAttribute('for', forId);
    label.innerHTML = text;

    return label;
  };

  let createSelect = function(id, defaultValue, options) {
    let select = document.createElement('select');

    for (let value in options) {
      let text = options[value];

      let option = document.createElement('option');

      option.value = value;
      option.text = text;

      if (value === defaultValue) {
        option.selected = true;
      }

      select.appendChild(option);
    }

    return select;
  };

  let getBody = function() {
    return document.getElementsByTagName('body')[0];
  };

  let appendToForm = function(elem) {
    getBody().appendChild(elem);
  };

  let setupcolorThemeSelect = function() {
    let colorThemeLabel = createLabel(
      'color-theme-select',
      'Color Theme'
    );
    appendToForm(colorThemeLabel);

    let colorThemeSelect = createSelect(
      'color-theme-select',
      greasemonkey.getValue('colorTheme'),
      {
        light:  'Light',
        dark:   'Dark'
      }
    );
    appendToForm(colorThemeSelect);

    colorThemeSelect.addEventListener('change', function() {
      greasemonkey.setValue('colorTheme', colorThemeSelect.value);
    });
  };

  let setupForm = function() {
    appendToForm(createH1('Solarized Webpages Configuration'));
    setupcolorThemeSelect();
  };


  let getUrl = function() {
    return window.location.href;
  };

  let scriptAlreadyRan = function() {
    return !!getBody().children.length;
  };


  let CONFIG_FORM_URL = 'about:blank#solarized-config';

  if (getUrl() === CONFIG_FORM_URL && !scriptAlreadyRan()) {
    setupForm();
  }
};
window.addEventListener("DOMContentLoaded", onLoad);
