// ==UserScript==
// @name        Solarized All The Things
// @namespace   tyost
// @description Adjusts websites to fit the Solarized color palette.
// @include     *
// @include     about:blank#solarized-config
// @version     1
// @grant       GM_addStyle
// ==/UserScript==

var USE_LIGHT = false;

var SOLARIZED_PALETTE = {
  BASE03:     '#002b36'   // Darker
  , BASE02:   '#073642'
  , BASE01:   '#586e75'
  , BASE00:   '#657b83'
  , BASE0:    '#839496'
  , BASE1:    '#93a1a1'
  , BASE2:    '#eee8d5'
  , BASE3:    '#fdf6e3'   // Lighter
  , BLUE:     '#268bd2'
  , CYAN:     '#2aa198'
  , GREEN:    '#859900'
  , MAGENTA:  '#d33682'
  , ORANGE:   '#cb4b16'
  , RED:      '#dc322f'
  , VIOLET:   '#6c71c4'
  , YELLOW:   '#b58900'
};

// Base colors varying between light and dark.
var DARK_COLORS = {
  BACKGROUND: SOLARIZED_PALETTE.BASE03
  , BACKGROUND_HIGHLIGHT: SOLARIZED_PALETTE.BASE02
  , BODY_TEXT: SOLARIZED_PALETTE.BASE0
}
var LIGHT_COLORS = {
  BACKGROUND: SOLARIZED_PALETTE.BASE3
  , BACKGROUND_HIGHLIGHT: SOLARIZED_PALETTE.BASE2
  , BODY_TEXT: SOLARIZED_PALETTE.BASE00
}

var COLORS = Object.assign({}, USE_LIGHT ? LIGHT_COLORS : DARK_COLORS);

// Color settings shared between light and dark.
COLORS.HEADINGS = SOLARIZED_PALETTE.YELLOW;
COLORS.HYPERLINKS = SOLARIZED_PALETTE.BLUE;

GM_addStyle(
  '* {' +
  ' background-color: ' + COLORS.BACKGROUND + ' !important;' +
  ' border-color: rgba(0, 0, 0, 0) !important;' +
  ' color: ' + COLORS.BODY_TEXT + ' !important;' +
  '}' +

  'div[background-color], button, input {' +
  ' background-color: ' + COLORS.BACKGROUND_HIGHLIGHT + ' !important;' +
  '}' +

  'h1, h2, h3, h4, h5, h6, header, hgroup, thead,' +
  'h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, header *, hgroup *, thead * {' +
  ' color: ' + COLORS.HEADINGS + ' !important;' +
  '}' +

  'a {' +
  ' color: ' + COLORS.HYPERLINKS + ' !important;' +
  '}'
);
