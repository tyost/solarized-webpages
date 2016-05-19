/**
  Enumeration of the CSS colors making up the Solarized palette.
  See: http://ethanschoonover.com/solarized
*/
type SolarizedColor =
  '#002b36' |
  '#073642' |
  '#586e75' |
  '#657b83' |
  '#839496' |
  '#93a1a1' |
  '#eee8d5' |
  '#fdf6e3' |
  '#268bd2' |
  '#2aa198' |
  '#859900' |
  '#d33682' |
  '#cb4b16' |
  '#dc322f' |
  '#6c71c4' |
  '#b58900';

/*
  This odd way of coding is a result of TypeScript not supporting string enums.
  When language support allows, this type should become a single enum.
  See: http://stackoverflow.com/a/35257367.
*/
const SolarizedColor = {
  Base03: '#002b36' as SolarizedColor,  // Darker
  Base02: '#073642' as SolarizedColor,
  Base01: '#586e75' as SolarizedColor,
  Base00: '#657b83' as SolarizedColor,
  Base0: '#839496' as SolarizedColor,
  Base1: '#93a1a1' as SolarizedColor,
  Base2: '#eee8d5' as SolarizedColor,
  Base3: '#fdf6e3' as SolarizedColor,  // Lighter
  Blue: '#268bd2' as SolarizedColor,
  Cyan: '#2aa198' as SolarizedColor,
  Green: '#859900' as SolarizedColor,
  Magenta: '#d33682' as SolarizedColor,
  Orange: '#cb4b16' as SolarizedColor,
  Red: '#dc322f' as SolarizedColor,
  Violet: '#6c71c4' as SolarizedColor,
  Yellow: '#b58900' as SolarizedColor
}
