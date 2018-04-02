# TOAST UI Component : Rolling
> Components that rotates and displays items such as a slideshow.

[![GitHub release](https://img.shields.io/github/release/nhnent/tui.rolling.svg)](https://github.com/nhnent/tui.rolling/releases/latest)
[![npm](https://img.shields.io/npm/v/tui-rolling.svg)](https://www.npmjs.com/package/tui-rolling)
[![GitHub license](https://img.shields.io/github/license/nhnent/tui.rolling.svg)](https://github.com/nhnent/tui.rolling/blob/production/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/tui.project-name/labels/help%20wanted)
[![code with hearth by NHN Entertainment](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN%20Entertainment-ff1414.svg)](https://github.com/nhnent)


## 🚩 Table of Contents
* [Browser Support](#-browser-support)
* [Features](#-features)
* [Examples](#-examples)
* [Install](#-install)
    * [Via Package Manager](#via-package-manager)
    * [Download Source Files](#download-source-files)
* [Usage](#-usage)
    * [HTML](#html)
    * [JavaScript](#javascript)
* [Pull Request Steps](#-pull-request-steps)
    * [Setup](#setup)
    * [Develop](#develop)
    * [Pull Request Steps](#pull-request)
* [Documents](#-documents)
* [Contributing](#-contributing)
* [Dependency](#-dependency)
* [License](#-license)


## 🌏 Browser Support
| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| Yes | Yes | Yes | Yes | 8+ |


## 🎨 Features
* Supports vertical/horizontal rolling.
* Supports circular/non-circular rolling.
* Supports auto rolling.
* Supports easing animations for rolling items.
* Supports custom events.


## 🐾 Examples
* [Basic](https://nhnent.github.io/tui.rolling/latest/tutorial-example01-basic.html) : Example of using default options.
* [Using animation](https://nhnent.github.io/tui.rolling/latest/tutorial-example06-effect.html) : Example of applying easing animation to rolling items.

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

### Download Source Files
* [Download bundle files](https://github.com/nhnent/tui.rolling/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.rolling/releases)


### Via Contents Delivery Network (CDN)
TOAST UI Component: Rolling is available over a CDN.

- You can use cdn as below.

```html
<script src="https://uicdn.toast.com/tui.rolling/latest/tui-rolling.min.js"></script>
```

- Within the download you'll find the following directories

```
tui.rolling/
├─ latest
│  ├─ tui-rolling.js
│  ├─ tui-rolling.min.js
```



## 🔨 Usage

### HTML

Add the container element with children elements to create the component.
See [here](https://nhnent.github.io/tui.rolling/latest/tutorial-example01-basic.html#) for information about the added element.

### JavaScript

This can be used by creating an instance with the constructor function.
To get the constructor function, you should import the module using one of the following ways depending on your environment.

#### Using namespace in browser environment
``` javascript
var Rolling = tui.Rolling;
```

#### Using module format in node environment
``` javascript
var Rolling = require('tui-rolling'); /* CommonJS */
```

``` javascript
import {Rolling} from 'tui-rolling'; /* ES6 */
```

You can create an instance with [options](https://nhnent.github.io/tui.gesture-reader/latest/Reader.html) and call various APIs after creating an instance.

``` javascript
var instance = new Rolling({
    element: document.getElementById('rolling'),
    ...
});

instance.roll( ... );
```

For more information about the API, please see [here](https://nhnent.github.io/tui.rolling/latest/Rolling.html).


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


## 📙 Documents
* [Getting Started](https://github.com/nhnent/tui.rolling/blob/production/docs/getting-started.md)
* [Tutorials](https://github.com/nhnent/tui.rolling/tree/production/docs)
* [APIs](https://nhnent.github.io/tui.rolling/latest)

You can also see the older versions of API page on the [releases page](https://github.com/nhnent/tui.rolling/releases).


## 💬 Contributing
* [Code of Conduct](https://github.com/nhnent/tui.rolling/blob/production/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhnent/tui.rolling/blob/production/CONTRIBUTING.md)
* [Issue guideline](https://github.com/nhnent/tui.rolling/blob/production/docs/ISSUE_TEMPLATE.md)
* [Commit convention](https://github.com/nhnent/tui.rolling/blob/production/docs/COMMIT_MESSAGE_CONVENTION.md)


## 🔩 Dependency
* [tui-code-snippet](https://github.com/nhnent/tui.code-snippet) >=1.2.5


## 📜 License

This software is licensed under the [MIT](https://github.com/nhnent/tui.rolling/blob/production/LICENSE) © [NHN Entertainment](https://github.com/nhnent).
