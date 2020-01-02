'use strict';

var bind = require('../src/js/util').bind;

var Roller = require('../src/js/roller');
var motion = require('../src/js/motion');

describe('Roller', function() {
  jasmine.getFixtures().fixturesPath = 'base/';
  jasmine.getStyleFixtures().fixturesPath = 'base/';

  beforeEach(function() {
    loadFixtures('test/fixtures/roller.html');
    loadStyleFixtures('test/fixtures/fixedhtml.css');
  });

  describe('instance', function() {
    var roller1, roller2, roller3, roller4, roller5;
    var data = 'JsonCompare Nightmare',
      type = 'next',
      moveElement,
      beforeCenter,
      moveSet;

    beforeEach(function() {
      var div1 = document.getElementById('roller1'),
        div2 = document.getElementById('roller2'),
        div3 = document.getElementById('roller3'),
        div4 = document.getElementById('roller4');

      roller1 = new Roller(
        {
          element: div1,
          isVariable: true,
          wrapperTag: 'div.wrap'
        },
        'data1',
        {
          invoke: function() {},
          fire: function() {}
        }
      );

      roller2 = new Roller(
        {
          element: div2,
          direction: 'vertical',
          panelTag: 'li',
          motion: 'linear'
        },
        'dd'
      );

      // width 300px; height:150px;
      roller3 = new Roller({
        element: div3,
        direction: 'horizontal',
        isVariable: false,
        isAuto: false,
        duration: 400,
        isCircular: true,
        isDrawn: true,
        unit: 'page'
      });

      // width 150px, height: 300px;
      roller4 = new Roller({
        element: div4,
        direction: 'vertical',
        isVariable: false,
        isAuto: false,
        duration: 400,
        isCircular: true,
        isDrawn: true,
        flow: 'prev',
        motion: 'linear',
        unit: 'item'
      });

      // width 150px, height: 300px;
      roller5 = new Roller({
        element: div4,
        direction: 'vertical',
        isVariable: false,
        isAuto: false,
        duration: 400,
        isCircular: false,
        isDrawn: true,
        flow: 'next',
        motion: 'linear',
        unit: 'item'
      });
    });

    it('should calculate itemcount when options.isDrawn is true', function() {
      var itemcount3 = roller3._itemcount,
        itemcount4 = roller4._itemcount;
      expect(itemcount3).toBe(3);
      expect(itemcount4).toBe(3);
    });

    it('should return the distance without an unit', function() {
      var distance1 = roller1._distance,
        distance2 = roller2._distance,
        distance3 = roller3._distance,
        distance4 = roller4._distance;
      expect(distance1).toBe(300);
      expect(distance2).toBe(100);
      expect(distance3).toBe(300);
      expect(distance4).toBe(100);
    });

    it('should move when isDrawn is false', function() {
      var panel = roller1.panel;

      // roller1._getMoveSet
      moveSet = roller1._getMoveSet();
      expect(moveSet[0]).toBe(-roller1._distance);
      expect(moveSet[1]).toBe(0);

      roller1._flow = 'prev';
      moveSet = roller1._getMoveSet();
      expect(moveSet[0]).toBe(0);
      expect(moveSet[1]).toBe(roller1._distance);

      roller1._flow = 'next';

      // roller1._updatePanel(data, type);
      roller1._updatePanel(data);
      expect(panel[type].innerHTML).toBe(data);

      // roller1._appendMoveData(type);
      roller1._appendMoveData(type);
      moveElement = roller1.movePanel;
      beforeCenter = panel.center.nextSibling;
      expect(moveElement).toBe(panel[type]);
      expect(moveElement).toBe(beforeCenter);

      // Move after initialize the status
      roller1.move(data, type);
    });

    it('should get a starting point by getStartSet', function() {
      var startPoint = roller1._getStartSet(),
        panels = roller1.panel,
        set1 = panels[roller1._flow === 'prev' ? 'prev' : 'center'],
        set2 = panels[roller1._flow === 'next' ? 'center' : 'next'];
      set1 = parseInt(set1.style[roller1._range], 10);
      set2 = parseInt(set2.style[roller1._range], 10);
      expect(startPoint[0]).toBe(set1);
      expect(startPoint[1]).toBe(set2);
    });

    it('should get the distance to travel by _getMoveDistance', function() {
      var distance = roller5._getMoveDistance('prev');
      expect(distance).toBe(0);
      distance = roller5._getMoveDistance('next');
      expect(distance).toBe(-(roller5._distance * roller5._unitCount));
    });

    it('should change the position after executing _moveWithoutMotion', function() {
      var before = roller5._container.style[roller5._range];
      roller5._moveWithoutMotion();
      expect(before).not.toBe(roller5._container.style[roller5._range]);
    });

    it('should move when isDrawn is true', function() {
      var panels, moveset;

      // roller1._rotatePanel(type);
      roller3._rotatePanel('next');
      roller3._setPanel();

      panels = roller3._panels;
      moveset = roller3._movePanelSet;
      expect(moveset.length).toBe(3);
      expect(panels[0]).toBe(moveset[0]);
    });

    it('should change the animation effect by changeMotion', function() {
      var roller = roller4._motion;
      roller4.changeMotion('easeIn');
      expect(roller).not.toBe(roller4._motion);
    });

    it('should distinguish whether a flow is inside of the area or not', function() {
      var prev = roller5._isLimitPoint('prev'),
        next = roller5._isLimitPoint('next');
      expect(prev).toBeTruthy();
      expect(next).toBeFalsy();
    });

    it('should get the distance between current index and selected page by _checkPagePosition and move a panel by moveTo', function() {
      var before = roller4._basis,
        dist1 = roller4._checkPagePosition(8),
        dist2 = roller5._checkPagePosition(4);
      roller4.moveTo(8);

      expect(dist1).toBe(8);
      expect(before).not.toBe(roller4._basis);
      expect(dist2).toBe(4);
    });
  });

  describe('motion', function() {
    var roller1, roller2, roller4;

    beforeEach(function() {
      var div1 = document.getElementById('roller1'),
        div2 = document.getElementById('roller2'),
        div4 = document.getElementById('roller4');

      roller1 = new Roller(
        {
          element: div1,
          isVariable: true,
          wrapperTag: 'div.wrap'
        },
        'data1'
      );

      roller2 = new Roller(
        {
          element: div2,
          direction: 'vertical',
          panelTag: 'li'
        },
        'dd',
        {
          invoke: function() {},
          fire: function() {}
        }
      );

      // width 150px, height: 300px;
      roller4 = new Roller(
        {
          element: div4,
          direction: 'vertical',
          isVariable: false,
          isAuto: false,
          duration: 400,
          isCircular: true,
          isDrawn: true,
          flow: 'prev',
          motion: 'linear',
          unit: 'item'
        },
        '',
        {
          invoke: function() {},
          fire: function() {}
        }
      );
    });

    it('should move fixed panel by Roller.movePanelSet', function() {
      var beforePanel = roller2.panel[roller2._flow];

      spyOn(roller2._rolling, 'invoke').and.returnValue(true);

      beforePanel = roller2.panel.center;
      roller2.move('eee');
      expect(beforePanel).not.toBe(roller2.panel.center);

      beforePanel = roller2.panel.center;
      roller2.move('eee', 0, 'prev');
      expect(beforePanel).not.toBe(roller2.panel.center);
    });

    it('should move the container by Roller.moveContainerSet', function(done) {
      var last = roller4._panels[roller4._panels.length - 1].innerHTML;
      var callback = function() {
        expect(last).toBe(roller4._panels[0].innerHTML);
        done();
      };

      spyOn(roller4._rolling, 'invoke').and.returnValue(true);

      roller4.move();

      setTimeout(callback, 500);
    });

    it('should move with no acceleration or deceleration (=linear)', function(done) {
      var finalDelta;
      roller1._animate({
        delay: 10,
        duration: 500,
        delta: motion.linear,
        step: bind(function(delta) {
          finalDelta = delta;
        }, roller1),
        complete: function() {
          expect(finalDelta).toBe(1);
          done();
        }
      });
    });

    it('should move with a power of 1 (=quad)', function(done) {
      var finalDelta, finalDelta2, finalDelta3;
      roller1._animate({
        delay: 10,
        duration: 500,
        delta: motion.quadEaseIn,
        step: bind(function(delta) {
          finalDelta = delta;
        }, roller1),
        complete: function() {}
      });

      setTimeout(function() {
        expect(finalDelta).toBe(1);
        // done();
      }, 1100);

      roller1._animate({
        delay: 10,
        duration: 400,
        delta: motion.quadEaseOut,
        step: bind(function(delta) {
          finalDelta2 = delta;
        }, roller1),
        complete: function() {}
      });

      roller1._animate({
        delay: 10,
        duration: 400,
        delta: motion.quadEaseInOut,
        step: bind(function(delta) {
          finalDelta3 = delta;
        }, roller1),
        complete: function() {}
      });

      setTimeout(function() {
        expect(finalDelta2).toBe(1);
        expect(finalDelta3).toBe(1);
        done();
      }, 2000);
    });

    it('should move with an abrupt change in velocity (=circ)', function(done) {
      var finalDelta, finalDelta2, finalDelta3;
      roller1._animate({
        delay: 10,
        duration: 100,
        delta: motion.circEaseIn,
        step: bind(function(delta) {
          finalDelta = delta;
        }, roller1),
        complete: function() {}
      });

      roller1._animate({
        delay: 10,
        duration: 100,
        delta: motion.circEaseOut,
        step: bind(function(delta) {
          finalDelta2 = delta;
        }, roller1),
        complete: function() {}
      });

      roller1._animate({
        delay: 10,
        duration: 100,
        delta: motion.circEaseInOut,
        step: bind(function(delta) {
          finalDelta3 = delta;
        }, roller1),
        complete: function() {}
      });

      setTimeout(function() {
        expect(finalDelta).toBe(1);
        expect(finalDelta2).toBe(1);
        expect(finalDelta3).toBe(1);
        done();
      }, 500);
    });
  });
});
