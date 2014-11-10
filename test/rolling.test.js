//describe('rolling 객체 테스트', function() {
//
//    var roll = new ne.component.Rolling(),
//        optionRoll = new ne.component.Rolling();
//
//    it('is roll created?', function() {
//        expect(roll).toBeDefined();
//        expect(optionRoll).toBeDefined();
//    });
//
//    it('after init(), is roller of rolling created well?', function() {
//
//        // 루트 앨리먼트를 생성한다.
//        var div1 = document.createElement('div');
//        var div2 = document.createElement('div');
//        var div3 = document.createElement('div');
//        div3.setAttribute('id', 'div3');
//        div3.style.width = '300px';
//        div3.style.height = '100px';
//        document.body.appendChild(div1);
//        document.body.appendChild(div2);
//        document.body.appendChild(div3);
//
//        var rollData = ['<li>item1</li>', '<li>item2</li>', '<li>item3</li>', '<li>item4</li>', '<li>item5</li>'];
//        // initialize
//        roll.init({
//            element: div1
//        }, rollData);
//        optionRoll.init({
//            element: div2,
//            initNum: 1,
//            direction: 'horizontal', // 'vertical | horizontal'
//            motion: 'easeIn'
//        }, rollData);
//
//        // rolling의 roller가 제대로 생성되었는가?
//        var roller = roll._roller,
//            optionRoller = optionRoll._roller;
//        expect(roller).toBeDefined();
//        expect(roller.constructor).toBe(ne.component.Roller);
//        expect(optionRoller).toBeDefined();
//        expect(optionRoller.constructor).toBe(ne.component.Roller);
//
//        // roller의 container가 제대로 생성/참조 되었는가?
//        var container1 = roller._container;
//        var container2 = optionRoller._container;
//        expect(container1).toBeDefined();
//        expect(container2).toBeDefined();
//        expect(ne.isHTMLElement(container1)).toBeTruthy();
//        expect(ne.isHTMLElement(container2)).toBeTruthy();
//
//        // 컨테이너 내부에 제대로 초기화 아이템이 뿌려졌는지
//        expect(container1.innerHTML).toBe(rollData[0]);
//        expect(container2.innerHTML).toBe(rollData[1]);
//    });
//});