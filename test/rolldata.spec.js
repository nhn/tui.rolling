'use strict';

var Data = require('../src/js/rolldata');

describe('RollData', function() {
  var rollData1 = 'data1',
    rollData2 = ['a', 'b', 'c', 'd', 'e', 'f'],
    rollData3 = [100, 200, 300, 400, 500];

  var model1 = new Data(
      {
        initNum: 1,
        isVariable: true
      },
      rollData1
    ),
    model2 = new Data(
      {
        isVariable: false,
        isCircular: false
      },
      rollData2
    ),
    model3 = new Data(
      {
        isVariable: false,
        isCircular: true
      },
      rollData3
    );

  it('should define a model.', function() {
    expect(model1).toBeDefined();
    expect(model2).toBeDefined();
    expect(model3).toBeDefined();
  });

  it('should initialize data by _initData.', function() {
    var list1, list2, list3;

    model1._initData(rollData1);
    model2._initData(rollData2);
    model3._initData(rollData3);

    list1 = model1._data;
    list2 = model2._datalist;
    list3 = model3._datalist;

    expect(list1.data).toBe('data1');
    expect(list2[1].data).toBe(rollData2[0]);
    expect(list3[2].data).toBe(rollData3[1]);
  });

  it('should set and get data (handle changeable data).', function() {
    var value1, value2, value3, value4;

    value1 = model1.getData();
    // Set next data
    model1.setData('next', 10);
    value2 = model1.getNextData();

    expect(value1).toBe('data1');
    expect(value2).toBe(10);

    // Disconnect the link
    model1.severLink('next');
    value3 = model1.getData();

    expect(value3).toBe(10);

    // Set previous data and disconnect the link
    model1.setData('prev', 100);
    model1.severLink('prev');
    value4 = model1.getData();

    expect(value4).toBe(100);
  });

  it('should get next, previous data (handle unchangeable data).', function() {
    // list1's initNum = 1
    var value1, value2, value3;

    value1 = model2.getData();
    value2 = model2.getNextData();
    value3 = model2.getPrevData();

    expect(value1).toBe('a'); // rollData2[0]
    expect(value2).toBe('b'); // rollData2[1]
    expect(value3).toBe('f'); // rollData2[rollData2.length - 1]

    value1 = model3.getData(4);
    value2 = model3.getNextData(4);
    value3 = model3.getPrevData(4);

    expect(value1).toBe(400); // rollData3[3]
    expect(value2).toBe(500); // rollData3[4]
    expect(value3).toBe(300); // rollData3[2]
  });

  it('should rotate by changeCurrent.', function() {
    var b1, b2, r1, r2;
    b1 = model2.getCurrent();
    b2 = model3.getCurrent();

    model2.changeCurrent('prev');
    model3.changeCurrent('prev');

    r1 = model2.getCurrent();
    r2 = model3.getCurrent();

    // initial value because it does not rotate
    expect(r1).toBe(b1);
    // value changes becuase it rotates
    expect(r2).not.toBe(b2);
  });

  it('getDataListLength', function() {
    var length = model2.getDataListLength();
    expect(length).toEqual(6);
  });
});
