### Load required files
```html
...
<script type="text/javascript" src="tui-code-snippet.js"></script>
<script type="text/javascript" src="tui-rolling.js"></script>
...
```

### Create flicking component

You can create rolling component with next options.

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

```html
<div id="rolling" class="rolling">
    <ul>
         <li class="panel"></li>
    </ul>
</div>
```

```javascript
// HTML data
    var htmlData = [
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>',
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>',
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>',
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>',
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>',
        '<span>Panel 1</span><span>Panel 2</span><span>Panel 3</span><span>Panel 4</span><span>Panel 5</span>'
    ];
// Create object
    var rolling1 = new tui.Rolling({
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

You can create rolling instance with this code.

### Control rolling

You can control rolling by add following code.

```html
<div class="btn-group" id="control">
    <button class="stop">멈춤</button>
    <button class="play">롤링</button>
</div>
<div class="btn-group" id="control2">
     <button class="left">전</button>
     <button class="right">후</button>
</div>
```

```javascript
// Add event
    var control = document.getElementById('control');
    control.onclick = function(e) {
        var e = e || window.event,
                target = e.target || e.srcElement,
                value;
        if (target.tagName.toLowerCase() !== 'button') {
            return;
        }
        className = target.className;
        if (className.indexOf('stop') > -1) {
            rolling1.stop();
        } else {
            rolling1.auto();
        }
    };
    var control = document.getElementById('control2');
    control.onclick = function(e) {
        var e = e || window.event,
                target = e.target || e.srcElement,
                value;
        if (target.tagName.toLowerCase() !== 'button') {
            return;
        }
        className = target.className;
        if (className.indexOf('left') > -1) {
            rolling1.roll(null, 'prev');
        } else if (className.indexOf('right') > -1) {
            rolling1.roll(null, 'next');
        }
    };
```

Now, you can control the rolling component move by buttons.

### Attach custom event

Before and after rolling add your custom event to component.

```javascript
// for this code you have to add status element in html

var statusElement = document.getElementById('status');
roll.on('beforeMove', function() {
    statusElement.style.backgroundColor = 'yellow';
    statusElement.innerHTML = 'state : move';
});
roll.on('afterMove', function() {
    statusElement.style.backgroundColor = 'green';
    statusElement.innerHTML = 'state : move end';
});
```

### Notice
* If isVariable is `true`, isCircular attribute could be ignored.
