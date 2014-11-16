describe('rolling 객체 테스트', function() {

    jasmine.getFixtures().fixturesPath = "base";

    beforeEach(function() {
        loadFixtures("test/fixture/rolling.html");
    });

    var rolling1,
        rolling2,
        rolling3,
        rolling4;

    it('롤링 생성', function() {
        var div1 = document.getElementById('rolling1'),
            div2 = document.getElementById('rolling2'),
            div3 = document.getElementById('rolling3'),
            div4 = document.getElementById('rolling4');

        rolling1 = new ne.component.Rolling({
            element: div1
        }, ['a1', 'a2', 'a3']),
        rolling2 = new ne.component.Rolling({
            element: div2,
            direction: 'vertical',
            isVariable: true
        }, 'initData');
        // width 300px; height:150px;
        rolling3 = new ne.component.Rolling({
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
        rolling4 = new ne.component.Rolling({
            element: div4,
            direction: 'vertical',
            isVariable: false,
            isAuto: false,
            duration: 400,
            isCircle: true,
            isDrawn: true,
            unit: 'item'
        });

        expect(rolling1).toBeDefined();
        expect(rolling2).toBeDefined();
        expect(rolling3).toBeDefined();
        expect(rolling4).toBeDefined();

    });

    it('isDrawn 에 따른 모델 존재', function() {
        // !isDrawn
        expect(rolling1._model).toBeDefined();
        expect(rolling2._model).toBeDefined();
        // isDrawn
        expect(rolling3._model).toBe(null);
        expect(rolling4._model).toBe(null);
    });

    it('is Defined roller', function() {
        expect(rolling1._roller).toBeDefined();
        expect(rolling2._roller).toBeDefined();
        expect(rolling3._roller).toBeDefined();
        expect(rolling4._roller).toBeDefined();
    });

    it('roll , 롤링 작동확인 (!isDrwan)', function() {
        var rollNum1, rollNum2,
        rollNum1 = rolling1._model.getCurrent();
        rolling1.roll();
        rollNum2 = rolling1._model.getCurrent();
        expect(rollNum1).not.toBe(rollNum2);
    });

    it('beforeMove, afterMove 동작 확인', function() {
        var num = 1;
        rolling1.attach('beforeMove', function() {
            num++;
        });
        rolling1.attach('afterMove', function() {
            num++;
        });
        // 이동하면 beforeMove, afterMove가 실행되어야한다
        rolling1.roll();
        expect(num).toBe(3);
    });
});