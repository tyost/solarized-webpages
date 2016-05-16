# Solarized Webpages

An **experimental** (mad science!) Greasemonkey userscript to recolor websites
to fit the
[Solarized light and dark color palette](http://ethanschoonover.com/solarized).

It may work in userscript extensions for browsers other than Firefox, but it
hasn't been tested much with them.

Some parts of websites recolor poorly, especially parts that rely on color as
the only way of presenting information.

## Install

1. Install
   [Greasemonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
   or a similar userscript extension for other browsers.
2. [Download the latest version of Solarized Webpages](https://github.com/tyost/solarized-webpages-releases/raw/master/solarized-webpages.user.js).
3. Upon trying to visit the previous link, a new window should appear.
   Choose to install the script.

## Switch light and dark

Once installed, visit
[about:blank#solarized-config](about:blank#solarized-config)
to switch between the light and dark color themes. Pages must be reloaded
to see the new changes.

## Disable recoloring for certain websites

Browser extensions like Greasemonkey provide a way to control on which
websites this userscript runs.

Disabling this userscript for a website in Greasemonkey:
1. Go to the [about:addons](about:addons) page.
2. Click on the _User Scrips_ tab.
3. Click on _Preferences_ for _Solarized Webpages_.
4. On the _User Settings_ tab, click on the _Add_ button next
   to _Excluded Pages_.
5. Enter a pattern to match the website where recoloring should be disabled.
   For example, to block all github.com pages, enter:

    ```*github.com/*```

6. Press _Okay_ twice.

## Developer information

### Build from source

The source code is written in TypeScript and then compiled into a single
JavaScript file to install in the browser.

Building has been tested only with the Atom editor's TypeScript package.

#### 1. Get TypeScript compiler

A recent TypeScript compiler is required:

* Atom editor users can install the
[Atom TypeScript](https://atom.io/packages/atom-typescript)
package.

#### 2. Build using tsconfig.json

Building produces a single userscript file (solarized-webpages.user.js)
in the root of the directory.

* Atom editor users can save a TypeScript file or run the _TypeScript: Build_
  command to build the userscript.

## License

Released under the
[MIT (X11) License](https://github.com/tyost/solarized-webpages/blob/master/LICENSE).
