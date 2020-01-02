## Install

``` sh
# npm
$ npm install --save tui-rolling # Latest version
$ npm install --save tui-rolling@<version> # Specific version
```

It can also be installed by using bower or downloaded by CDN. Please refer to the [💾 Install](https://github.com/nhn/tui.rolling#-install).

## Usage

### Import a component

```javascript
// ES6
import Rolling from 'tui-rolling';
```

It can also be used by namespace or CommonJS module. Please refer to the [🔨 Usage](https://github.com/nhn/tui.rolling#-usage).

### Create an instance

* Create without HTML data

`li` elements will be rotated.

```html
<div id="rolling">
    <ul>
        <li class="panel">data1</li>
        <li class="panel">data2</li>
        <li class="panel">data3</li>
        ...
    </ul>
</div>
```

```javascript
const rolling = new Rolling({
    element: document.getElementById('rolling'),
    direction: 'horizontal',
    isVariable: false,
    isAuto: false,
    duration: 400,
    isCircular: true,
    isDrawn: true,
    initNum: 3,
    motion: 'linear',
    unit: 'page'
});
```

* Create with HTML data

`htmlData` will be rotated.

```html
<div id="rolling"></div>
```

```javascript
const htmlData = [
    '<div class="panel">data1</div>',
    '<div class="panel">data2</div>',
    '<div class="panel">data3</div>',
    ...
];

const rolling = new Rolling({
    element: document.getElementById('rolling'),
    direction: 'horizontal',
    isVariable: false,
    duration: 400,
    motion:'linear',
    isAuto: true,
    initNum: 3,
    isCircular: false
}, htmlData);
```

Information about each option is as follows:

| Name  | Feature   |
|-------|-----------|
| element | A root element |
| isVariable | Whether the data is changable or not [default value is false] |
| isCircular | Whether circular or not [default value is true but isVariable true case] |
| auto | Whether auto rolling or not [default value is false] |
| delayTime | A distance time of auto rolling. [defulat 3 second] |
| direction | The flow direction panel [default value is horizontal] |
| duration | A move duration |
| initNum | Initalize selected rolling panel number |
| motion | A effect name [default value is noeffect] |
| unit | A unit of rolling |
| wrapperTag | A tag name for panel warpper, connect tag name with class name by dots. [defualt value is ul] |
| panelTag | A tag name for panel, connect tag name with class by dots [default value is li] |
| data | A data for rolling component |

## Control rolling

To control the rolling component movement by buttons, please refer to the following codes.

```html
<div class="btn-group" id="control-play">
    <button class="stop">Stop</button>
    <button class="play">Play</button>
</div>
<div class="btn-group" id="control-move">
    <button class="left">Previous</button>
    <button class="right">Next</button>
</div>
```

```javascript
const controlPlay = document.getElementById('control-play');
controlPlay.onclick = function(ev) {
    const {target} = ev;
    if (target.tagName.toLowerCase() !== 'button') {
        return;
    }
    
    const {className} = target;
    if (className.indexOf('stop') > -1) {
        rolling.stop();
    } else {
        rolling.auto();
    }
};

const controlMove = document.getElementById('control-move');
controlMove.onclick = function(e) {
    const {target} = ev;
    if (target.tagName.toLowerCase() !== 'button') {
        return;
    }
    
    const {className} = target;
    if (className.indexOf('left') > -1) {
        rolling.roll(null, 'prev');
    } else if (className.indexOf('right') > -1) {
        rolling.roll(null, 'next');
    }
};
```

## Attach custom event

You can add your custom events to invoke before and after moving the rolling component.

```javascript
// Before apply this code, you should add a status element in HTML
const statusElement = document.getElementById('status');
rolling.on('beforeMove', function() {
    statusElement.style.backgroundColor = 'yellow';
    statusElement.innerHTML = 'state : move';
});
rolling.on('afterMove', function() {
    statusElement.style.backgroundColor = 'green';
    statusElement.innerHTML = 'state : move end';
});
```

## Notice

* If `isVariable` is `true`, `isCircular` attribute could be ignored.
