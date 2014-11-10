describe('roller', function() {
    var div1 = document.createElement('div'),
        div2 = document.createElement('div'),
        roller = new ne.component.Roller({
            element: div1
        }),
        roller2 = new ne.component.Roller({
            element: div2,
            direction: 'vertical'
        });
    // 시뮬레이션에서 width, height를 client로 잡으면 0으로 나오기 때문에, 스타일로 지정
    div1.style.width = '300px';
    div1.style.height = '100px';
    div2.style.width = '300px';
    div2.style.height = '100px';

    it('defined roller', function() {
        expect(roller).toBeDefined();
        expect(roller2).toBeDefined();
    });

    roller.init('data1');
    roller2.init('data2');

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
        pannel = roller.pannel;

    it('test move flow', function() {
        // roller._getMoveSet
        moveSet = roller._getMoveSet();
        expect(moveSet[0]).toBe(-roller._distance);
        expect(moveSet[1]).toBe(0);

        // roller._updatePannel(data, type);
        roller._updatePannel(data);
        expect(pannel[type].innerHTML).toBe(data);

        // roller._appendMoveData(type);
        roller._appendMoveData(type);
        moveElement = roller.movePannel;
        beforeCenter = pannel['center'].nextSibling;
        expect(moveElement).toBe(pannel[type]);
        expect(moveElement).toBe(beforeCenter);

        // 상태 초기화 후 무브 수행
        //roller.fix();
        roller.move(data, type);
        beforePos1 = parseInt(pannel['center'].style.left);
    });

    it('check move result', function(done) {
        setTimeout(function() {
            afterPos1 = parseInt(pannel['center'].style.left);
            expect(beforePos1).toBe(beforePos1);
            done();
        }, 3000);
    });

});