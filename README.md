# TOAST UI Component : Rolling
> Components that rotates and displays items such as a slideshow.

[![GitHub release](https://img.shields.io/github/release/nhn/tui.rolling.svg)](https://github.com/nhn/tui.rolling/releases/latest)
[![npm](https://img.shields.io/npm/v/tui-rolling.svg)](https://www.npmjs.com/package/tui-rolling)
[![GitHub license](https://img.shields.io/github/license/nhn/tui.rolling.svg)](https://github.com/nhn/tui.rolling/blob/production/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhn/tui.project-name/labels/help%20wanted)
[![code with hearth by NHN](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN-ff1414.svg)](https://github.com/nhn)


<p><a href="https://nhn.github.io/tui.rolling/latest/"><img src="https://user-images.githubusercontent.com/8615506/64505560-33e31100-d30f-11e9-89ea-f2af6bb71da6.gif" /></a></p>


## 🚩 Table of Contents
- [TOAST UI Component : Rolling](#toast-ui-component--rolling)
  - [🚩 Table of Contents](#-table-of-contents)
  - [Collect statistics on the use of open source](#collect-statistics-on-the-use-of-open-source)
  - [📙 Documents](#-documents)
  - [🎨 Features](#-features)
  - [🐾 Examples](#-examples)
  - [💾 Install](#-install)
    - [Via Package Manager](#via-package-manager)
      - [npm](#npm)
      - [bower](#bower)
    - [Via Contents Delivery Network (CDN)](#via-contents-delivery-network-cdn)
    - [Download Source Files](#download-source-files)
  - [🔨 Usage](#-usage)
    - [HTML](#html)
    - [JavaScript](#javascript)
      - [Using namespace in browser environment](#using-namespace-in-browser-environment)
      - [Using module format in node environment](#using-module-format-in-node-environment)
  - [🌏 Browser Support](#-browser-support)
  - [🔧 Pull Request Steps](#-pull-request-steps)
    - [Setup](#setup)
    - [Develop](#develop)
      - [Run webpack-dev-server](#run-webpack-dev-server)
      - [Run karma test](#run-karma-test)
    - [Pull Request](#pull-request)
  - [💬 Contributing](#-contributing)
  - [🍞 TOAST UI Family](#-toast-ui-family)
  - [📜 License](#-license)

## Collect statistics on the use of open source
 TOAST UI Rolling applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Rolling is used throughout the world.
It also serves as important index to determine the future course of projects.
`location.hostname` (e.g. > “ui.toast.com") is to be collected and the sole purpose is nothing but to measure statistics on the usage.
 To disable GA, use the following `usageStatistics` option when creating the instance.

```js
const options = {
  element: document.getElementById('rolling'),
  //...
  usageStatistics: false
}

const instance = new Rolling(options);
```

Or, include [`tui-code-snippet`](https://github.com/nhn/tui.code-snippet)(**v2.2.0** or **later**) and then immediately write the options as follows:

```js
tui.usageStatistics = false;
```


## 📙 Documents
* [Getting Started](https://github.com/nhn/tui.rolling/blob/production/docs/getting-started.md)
* [Tutorials](https://github.com/nhn/tui.rolling/tree/production/docs)
* [APIs](https://nhn.github.io/tui.rolling/latest)

You can also see the older versions of API page on the [releases page](https://github.com/nhn/tui.rolling/releases).


## 🎨 Features
* Supports vertical/horizontal rolling.
* Supports circular/non-circular rolling.
* Supports auto rolling.
* Supports easing animations for rolling items.
* Supports custom events.


## 🐾 Examples
* [Basic](https://nhn.github.io/tui.rolling/latest/tutorial-example01-basic) : Example of using default options.
* [Using animation](https://nhn.github.io/tui.rolling/latest/tutorial-example06-effect) : Example of applying easing animation to rolling items.

More examples can be found on the left sidebar of each example page, and have fun with it.


## 💾 Install

TOAST UI products can be used by using the package manager or downloading the source directly.
However, we highly recommend using the package manager.

### Via Package Manager

TOAST UI products are registered in two package managers, [npm](https://www.npmjs.com/) and [bower](https://bower.io/).
You can conveniently install it using the commands provided by each package manager.
When using npm, be sure to use it in the environment [Node.js](https://nodejs.org/ko/) is installed.

#### npm

``` sh
$ npm install --save tui-rolling # Latest version
$ npm install --save tui-rolling@<version> # Specific version
```

#### bower

``` sh
$ bower install tui-rolling # Latest version
$ bower install tui-rolling#<tag> # Specific version
```

### Via Contents Delivery Network (CDN)
TOAST UI products are available over a CDN powered by [TOAST Cloud](https://www.toast.com).

You can use CDN as below.

```html
<script src="https://uicdn.toast.com/tui.rolling/latest/tui-rolling.js"></script>
```

If you want to use a specific version, use the tag name instead of `latest` in the url's path.

The CDN directory has the following structure.

```
tui.rolling/
├─ latest
│  ├─ tui-rolling.js
│  ├─ tui-rolling.min.js
├─ v2.0.0/
│  ├─ ...
```

### Download Source Files
* [Download bundle files](https://github.com/nhn/tui.rolling/tree/production/dist)
* [Download all sources for each version](https://github.com/nhn/tui.rolling/releases)


## 🔨 Usage

### HTML

Add the container element with children elements to create the component.
See [here](https://nhn.github.io/tui.rolling/latest/tutorial-example01-basic) for information about the added element.

### JavaScript

This can be used by creating an instance with the constructor function.
To get the constructor function, you should import the module using one of the following ways depending on your environment.

#### Using namespace in browser environment
``` javascript
const Rolling = tui.Rolling;
```

#### Using module format in node environment
``` javascript
const Rolling = require('tui-rolling'); /* CommonJS */
```

``` javascript
import Rolling from 'tui-rolling'; /* ES6 */
```

You can create an instance with [options](https://nhn.github.io/tui.rolling/latest/Rolling) and call various APIs after creating an instance.

``` javascript
const instance = new Rolling({
  element: document.getElementById('rolling'),
  ...
});

instance.roll( ... );
```

For more information about the API, please see [here](https://nhn.github.io/tui.rolling/latest/Rolling).


## 🌏 Browser Support
| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| Yes | 8+ | Yes | Yes | Yes |


## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues.
Run npm scripts and develop yourself with the following process.

### Setup

Fork `develop` branch into your personal repository.
Clone it to local computer. Install node modules.
Before starting development, you should check to haveany errors.

``` sh
$ git clone https://github.com/{your-personal-repo}/tui.rolling.git
$ cd tui.rolling
$ npm install
$ npm run test
```

### Develop

Let's start development!
You can see your code is reflected as soon as you saving the codes by running a server.
Don't miss adding test cases and then make green rights.

#### Run webpack-dev-server

``` sh
$ npm run serve
$ npm run serve:ie8 # Run on Internet Explorer 8
```

#### Run karma test

``` sh
$ npm run test
```

### Pull Request

Before PR, check to test lastly and then check any errors.
If it has no error, commit and then push it!

For more information on PR's step, please see links of Contributing section.


## 💬 Contributing
* [Code of Conduct](https://github.com/nhn/tui.rolling/blob/production/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhn/tui.rolling/blob/production/CONTRIBUTING.md)
* [Issue guideline](https://github.com/nhn/tui.rolling/blob/production/docs/ISSUE_TEMPLATE.md)
* [Commit convention](https://github.com/nhn/tui.rolling/blob/production/docs/COMMIT_MESSAGE_CONVENTION.md)


## 🍞 TOAST UI Family

* [TOAST UI Editor](https://github.com/nhn/tui.editor)
* [TOAST UI Calendar](https://github.com/nhn/tui.calendar)
* [TOAST UI Chart](https://github.com/nhn/tui.chart)
* [TOAST UI Image-Editor](https://github.com/nhn/tui.image-editor)
* [TOAST UI Grid](https://github.com/nhn/tui.grid)
* [TOAST UI Components](https://github.com/nhn)


## 📜 License

This software is licensed under the [MIT](https://github.com/nhn/tui.rolling/blob/production/LICENSE) © [NHN](https://github.com/nhn).
