'use strict';

var Rolling = require('../src/js/rolling');
var util = require('../src/js/util');

describe('Rolling', function() {
  jasmine.getFixtures().fixturesPath = 'base';

  beforeEach(function() {
    loadFixtures('test/fixtures/rolling.html');
  });

  describe('instance', function() {
    var rolling1, rolling2, rolling3, rolling4;

    beforeEach(function() {
      var div1 = document.getElementById('rolling1'),
        div2 = document.getElementById('rolling2'),
        div3 = document.getElementById('rolling3'),
        div4 = document.getElementById('rolling4');

      rolling1 = new Rolling(
        {
          element: div1,
          isAuto: true
        },
        ['a1', 'a2', 'a3']
      );

      rolling2 = new Rolling(
        {
          element: div2,
          direction: 'vertical',
          isVariable: true
        },
        'initData'
      );

      // width 300px; height:150px;
      rolling3 = new Rolling({
        element: div3,
        direction: 'horizontal',
        isVariable: false,
        isAuto: false,
        duration: 400,
        isCircle: true,
        isDrawn: true,
        unit: 'page'
      });
      // width 150px, height: 300px;
      rolling4 = new Rolling({
        element: div4,
        direction: 'vertical',
        isVariable: false,
        isAuto: false,
        duration: 400,
        isCircle: true,
        isDrawn: true,
        unit: 'item'
      });
    });

    it('should be defined.', function() {
      expect(rolling1).toBeDefined();
      expect(rolling2).toBeDefined();
      expect(rolling3).toBeDefined();
      expect(rolling4).toBeDefined();
    });

    it('should have a model depending on isDrawn (if isDrawn is true, it has a model).', function() {
      // !isDrawn
      expect(rolling1._model).toBeDefined();
      expect(rolling2._model).toBeDefined();
      // isDrawn
      expect(rolling3._model).toBe(null);
      expect(rolling4._model).toBe(null);
    });

    it('should have a roller.', function() {
      expect(rolling1._roller).toBeDefined();
      expect(rolling2._roller).toBeDefined();
      expect(rolling3._roller).toBeDefined();
      expect(rolling4._roller).toBeDefined();
    });

    it('should roll even if isDrawn is false.', function() {
      var rollNum1 = rolling1._model.getCurrent();
      var rollNum2;

      rolling1.roll();
      rollNum2 = rolling1._model.getCurrent();
      expect(rollNum1).not.toBe(rollNum2);
    });

    it('should move to the specific page.', function() {
      var error = false;
      rolling1.moveTo(3);
      expect(rolling1._model.getCurrent()).toBe(3);
      try {
        rolling1.moveTo();
      } catch (e) {
        error = e.toString();
      }
      expect(error).not.toBeFalsy();
      error = false;
      try {
        rolling1._options.isVariable = true;
        rolling1.moveTo(3);
      } catch (e) {
        rolling1._options.isVariable = false;
        error = e.toString();
      }
      expect(error).not.toBeFalsy();
    });

    it('should have a timer to stop and run if setting auto.', function() {
      rolling1.auto();
      expect(rolling1._timer).toBeDefined();
    });

    it('should not set idle after calling roll.', function() {
      var move = false;
      var error = false;
      var handler = function() {
        move = true;
      };
      rolling1.on('beforeMove', handler);
      rolling1._roller.status = 'run';
      rolling1.roll();
      expect(move).toBeFalsy();

      rolling1._roller.status = 'idle';
      rolling1._options.isVariable = true;
      try {
        rolling1.roll();
      } catch (e) {
        error = e.toString();
      }
      expect(error).not.toBeFalsy();

      rolling1.roll('data');
    });

    it('should be a Custom Event mixin.', function() {
      expect(rolling1.on).toBeDefined();
      expect(rolling2.on).toBeDefined();
    });

    it('should bind custom events.', function() {
      var beforeMoveHandler = jasmine.createSpy('before move event handler');
      var afterMoveHandler = jasmine.createSpy('after move event handler');

      rolling1.on('beforeMove', beforeMoveHandler);
      rolling1.on('afterMove', afterMoveHandler);

      rolling1.roll('data');

      expect(beforeMoveHandler).toHaveBeenCalled();
      expect(afterMoveHandler).toHaveBeenCalled();
    });
  });

  describe('usageStatistics', function() {
    beforeEach(function() {
      spyOn(util, 'sendHostName');
    });

    it('should send a hostname by default.', function() {
      var rolling = new Rolling(
        {
          element: document.getElementById('rolling1'),
          isAuto: true
        },
        ['a1', 'a2', 'a3']
      );
      rolling.roll('data');

      expect(util.sendHostName).toHaveBeenCalled();
    });

    it('should not send a hostname when usageStatistics option is false.', function() {
      var rolling = new Rolling(
        {
          element: document.getElementById('rolling1'),
          isAuto: true,
          usageStatistics: false
        },
        ['a1', 'a2', 'a3']
      );
      rolling.roll('data');

      expect(util.sendHostName).not.toHaveBeenCalled();
    });
  });
});
