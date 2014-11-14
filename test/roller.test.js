describe('roller', function() {
    var div1 = document.createElement('div'),
        div2 = document.createElement('div');
    // 시뮬레이션에서 width, height를 client로 잡으면 0으로 나오기 때문에, 스타일로 지정
        div1.style.width = '300px';
        div1.style.height = '100px';
        div2.style.width = '300px';
        div2.style.height = '100px';
        var roller = new ne.component.Rolling.Roller({
            element: div1
        }, 'data1'),
        roller2 = new ne.component.Rolling.Roller({
            element: div2,
            direction: 'vertical'
        }, 'data2');

    it('defined roller', function() {
        expect(roller).toBeDefined();
        expect(roller2).toBeDefined();
    });
    it('_setUnitDistance called?', function() {
        var distance1 = roller._distance,
            distance2 = roller2._distance;
        expect(distance1).toBe('300');
        expect(distance2).toBe('100');
    });

    var data = 'JsonCompare Nightmare',
        // default
        type = 'next',
        moveElement,
        beforeCenter,
        moveSet,
        beforePos1, beforePos2,
        afterPos1, afterPos2,
        panel = roller.panel;

    it('test move flow', function() {
        // roller._getMoveSet
        moveSet = roller._getMoveSet();
        expect(moveSet[0]).toBe(-roller._distance);
        expect(moveSet[1]).toBe(0);

        // roller._updatePanel(data, type);
        roller._updatePanel(data);
        expect(panel[type].innerHTML).toBe(data);

        // roller._appendMoveData(type);
        roller._appendMoveData(type);
        moveElement = roller.movePanel;
        beforeCenter = panel['center'].nextSibling;
        expect(moveElement).toBe(panel[type]);
        expect(moveElement).toBe(beforeCenter);

        // 상태 초기화 후 무브 수행
        //roller.fix();
        roller.move(data, type);
        beforePos1 = parseInt(panel['center'].style.left);
    });

    it('check move result', function(done) {
        setTimeout(function() {
            afterPos1 = parseInt(panel['center'].style.left);
            expect(beforePos1).toBe(beforePos1);
            done();
        }, 3000);
    });

    it('Custom Event mixin', function() {
        expect(roller.on).toBeDefined();
        expect(roller2.on).toBeDefined();
    });

    it('Custom Event test', function() {
        var a = 0;
        roller.on('move', function() {
            a++;
            checkCustom();
        });
        roller.fire('move');
        function checkCustom() {
            expect(a).toBe(1);
        }
    });


});