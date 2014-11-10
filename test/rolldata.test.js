describe('RollData Test', function() {
    var rollData1 = 'data1',
        rollData2 = ['a', 'b', 'c', 'd', 'e', 'f'],
        rollData3 = [100, 200, 300, 400, 500];

    var model1 = new ne.component.RollData({
            initNum: 1,
            isVariable: true
        }, rollData1),
        model2 = new ne.component.RollData({
            isVariable: false,
            isCircle: false
        }, rollData2),
        model3 = new ne.component.RollData({
            isVariable: false,
            isCircle: true
        }, rollData3);


    it('define model', function() {

        expect(model1).toBeDefined();
        expect(model2).toBeDefined();
        expect(model3).toBeDefined();

    });

    it('_makeData', function() {

        var list1 = model1._makeData(rollData1),
            list2 = model2._makeData(rollData2),
            list3 = model3._makeData(rollData3);

        list1 = model1._data;
        list2 = model2._datalist;
        list3 = model3._datalist;

        expect(list1.data).toBe('data1');
        expect(list2[1].data).toBe(rollData2[1]);
        expect(list3[2].data).toBe(rollData3[2]);
    });

    it('setData, getData 가변데이터', function() {
        var value1,
            value2,
            value3,
            value4;

        value1 = model1.getData();
        // 다음데이터 세팅
        model1.setData('next', 10);
        value2 = model1.getNextData();

        expect(value1).toBe('data1');
        expect(value2).toBe(10);

        //링크를 끊고, 대상을 데이터에 넣는다
        model1.severLink('next');
        value3 = model1.getData();

        expect(value3).toBe(10);

        // 이전데이터를 세팅하고 링크를 끊음
        model1.setData('prev', 100);
        model1.severLink('prev');
        value4 = model1.getData();

        expect(value4).toBe(100);

    });

    it('getNextData, getPrevData, getData 비가변 데이터', function() {
        // 설정하지 않으면 initNum으로 들어간 값을 기준으로 선택됨 현재 list1의 initNum은 1
        var value1,
            value2,
            value3;

        value1 = model2.getData();
        value2 = model2.getNextData();
        value3 = model2.getPrevData();

        expect(value1).toBe(/*rollData2[0]*/'a');
        expect(value2).toBe(/*rollData2[1]*/'b');
        expect(value3).toBe(/*rollData2[rollData2.length - 1]*/'f');

        value1 = model3.getData(3);
        value2 = model3.getNextData(3);
        value3 = model3.getPrevData(3);

        expect(value1).toBe(/*rollData3[3]*/400);
        expect(value2).toBe(/*rollData3[4]*/500);
        expect(value3).toBe(/*rollData3[2]*/300);
    });

    it('changeCurrent 순환 비순환 테스트', function() {
        var b1,
            b2,
            r1,
            r2;
        b1 = model2.getCurrent();
        b2 = model3.getCurrent();

        model2.changeCurrent('prev');
        model3.changeCurrent('prev');

        r1 = model2.getCurrent();
        r2 = model3.getCurrent();

        // 순환되지 않아 처음과 같은값
        expect(r1).toBe(b1);
        // 순환되어 값이 달라진다
        expect(r2).not.toBe(b2);
    });
});