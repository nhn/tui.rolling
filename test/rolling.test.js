describe('rolling 객체 테스트', function() {
    var div1 = document.createElement('div'),
        div2 = document.createElement('div');
    // 시뮬레이션에서 width, height를 client로 잡으면 0으로 나오기 때문에, 스타일로 지정
    div1.style.width = '300px';
    div1.style.height = '100px';
    div2.style.width = '300px';
    div2.style.height = '100px';

    var rolling1 = new ne.component.Rolling({
        element: div1
    }, ['a1', 'a2', 'a3']),
        rolling2 = new ne.component.Rolling({
            element: div2,
            direction: 'vertical',
            isVariable: true
        }, 'initData');

    it('define', function() {
        expect(rolling1).toBeDefined();
        expect(rolling2).toBeDefined();
    });

    it('roll , 롤링 작동확인', function() {
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