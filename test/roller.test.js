describe('roller', function() {

    jasmine.getFixtures().fixturesPath = "base/";
    jasmine.getStyleFixtures().fixturesPath = "base/";

    beforeEach(function() {
        loadFixtures("test/fixture/roller.html");
        loadStyleFixtures('test/fixture/fixedhtml.css');
    });

    describe('생성 및 확인', function() {
        var roller1,
            roller2,
            roller3,
            roller4,
            roller5;

        beforeEach(function() {
            var div1 = document.getElementById('roller1'),
                div2 = document.getElementById('roller2'),
                div3 = document.getElementById('roller3'),
                div4 = document.getElementById('roller4'),
                div5 = document.getElementById('roller5');

            roller1 = new tui.component.Rolling.Roller({
                element: div1,
                isVariable: true,
                wrapperTag: 'div.wrap'
            }, 'data1'),


                roller2 = new tui.component.Rolling.Roller({
                    element: div2,
                    direction: 'vertical',
                    panelTag: 'li',
                    motion: 'linear'
                }, 'dd');

            // width 300px; height:150px;
            roller3 = new tui.component.Rolling.Roller({
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
            roller4 = new tui.component.Rolling.Roller({
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
            roller5 = new tui.component.Rolling.Roller({
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
        it('defined roller', function() {
            expect(roller1).toBeDefined();
            expect(roller2).toBeDefined();
            expect(roller3).toBeDefined();
            expect(roller4).toBeDefined();
        });
        it('option.isDrawn : check itemcount', function() {
            var itemcount3 = roller3._itemcount,
                itemcount4 = roller4._itemcount;
            expect(itemcount3).toBe(3);
            expect(itemcount4).toBe(3);
        });

        it('_setUnitDistance called?', function() {
            var distance1 = roller1._distance,
                distance2 = roller2._distance,
                distance3 = roller3._distance,
                distance4 = roller4._distance;
            expect(distance1).toBe(300);
            expect(distance2).toBe(100);
            expect(distance3).toBe(300);
            expect(distance4).toBe(100);
        });

        var data = 'JsonCompare Nightmare',
            type = 'next',
            moveElement,
            beforeCenter,
            moveSet,
            beforePos1, beforePos2,
            afterPos1, afterPos2;

        it('test move flow (not isDrawn)', function() {
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
            beforeCenter = panel['center'].nextSibling;
            expect(moveElement).toBe(panel[type]);
            expect(moveElement).toBe(beforeCenter);

            // 상태 초기화 후 무브 수행;
            roller1.move(data, type);
            beforePos1 = parseInt(panel['center'].style.left);
        });

        it('getStartSet 시작점을 구해온다.', function() {
            var startPoint = roller1._getStartSet(),
                panels = roller1.panel,
                set1 = panels[roller1._flow === 'prev' ? 'prev' : 'center'],
                set2 = panels[roller1._flow === 'next' ? 'center' : 'next'];
            set1 = parseInt(set1.style[roller1._range], 10);
            set2 = parseInt(set2.style[roller1._range], 10);
            expect(startPoint[0]).toBe(set1);
            expect(startPoint[1]).toBe(set2);
        });

        it('_getMoveDistance 이동거리를 구한다.', function() {
            var distance = roller5._getMoveDistance('prev');
            expect(distance).toBe(0);
            var distance = roller5._getMoveDistance('next');
            expect(distance).toBe(-(roller5._distance * roller5._unitCount));
        });

        it('_moveWithoutMotion', function() {
            var before = roller5._container.style[roller5._range];
            roller5._moveWithoutMotion();
            expect(before).not.toBe(roller5._container.style[roller5._range]);
        });

        it('test move flow (isDrawn)', function() {
            var panels,
                moveset;

            // roller1._rotatePanel(type);
            roller3._rotatePanel('next');
            roller3._setPanel();

            panels = roller3._panels
            moveset = roller3._movePanelSet;
            expect(moveset.length).toBe(3);
            expect(panels[0]).toBe(moveset[0]);

        });

        it('Custom Event mixin', function() {
            expect(roller1.on).toBeDefined();
            expect(roller2.on).toBeDefined();
        });

        it('Custom Event test', function() {
            var a = 0;
            roller1.on('move', function() {
                a++;
                checkCustom();
            });
            roller1.fire('move');
            function checkCustom() {
                expect(a).toBe(1);
            }
        });

        it('changeMotion', function() {
            var motion = roller4._motion;
            roller4.changeMotion('easeIn');
            expect(motion).not.toBe(roller4._motion);
        });

        it('_isLimitPoint', function() {
            var prev = roller5._isLimitPoint('prev'),
                next = roller5._isLimitPoint('next');
            expect(prev).toBeTruthy();
            expect(next).toBeFalsy();
        });

        it('_checkPagePosition, moveTo', function() {
            var before = roller4._basis,
                dist1 = roller4._checkPagePosition(8),
                dist2 = roller5._checkPagePosition(4);
            roller4.moveTo(8);
            roller5.moveTo(5);

            expect(dist1).toBe(8);
            expect(before).not.toBe(roller1._basis);
            expect(dist2).toBe(4);
        });

    });

    describe('모션 테스트', function() {

        var roller1,
            roller2,
            roller3,
            roller4;

        beforeEach(function() {
            var div1 = document.getElementById('roller1'),
                div2 = document.getElementById('roller2'),
                div3 = document.getElementById('roller3'),
                div4 = document.getElementById('roller4');

            roller1 = new tui.component.Rolling.Roller({
                element: div1,
                isVariable: true,
                wrapperTag: 'div.wrap'
            }, 'data1'),

                roller2 = new tui.component.Rolling.Roller({
                    element: div2,
                    direction: 'vertical',
                    panelTag: 'li'
                }, 'dd');

            // width 300px; height:150px;
            roller3 = new tui.component.Rolling.Roller({
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
            roller4 = new tui.component.Rolling.Roller({
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
        });

        it('tui.component.Rolling.Roller.movePanelSet move', function() {
            var beforePanel = roller2.panel[roller2._flow],
                nextPanel;

            beforePanel = roller2.panel['center'];
            nextPanel = roller2.panel[roller2._flow];
            roller2.move('eee');
            expect(beforePanel).not.toBe(roller2.panel['center']);


            beforePanel = roller2.panel['center'];
            roller2.move('eee', 0, 'prev');
            expect(beforePanel).not.toBe(roller2.panel['center']);

        });

        it('tui.component.Rolling.Roller.moveContainerSet move', function(done) {
            var first = roller4._panels[0].innerHTML,
                last = roller4._panels[roller4._panels.length - 1].innerHTML;
            roller4.move();
            setTimeout(function() {
                expect(last).toBe(roller4._panels[0].innerHTML);
                done();
            }, 3500);
        });

        it('tui.component.Rolling.Roller motion linear', function(done) {
            var finalDelta;
            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.linear,
                step: tui.util.bind(function(delta) {
                    finalDelta = delta;
                }, roller1),
                complete: function() {
                    expect(finalDelta).toBe(1);
                    done();
                }
            });
        });

        it('tui.component.Rolling.Roller motion quad', function(done) {
            var finalDelta, finalDelta2, finalDelta3;
            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.quadEaseIn,
                step: tui.util.bind(function(delta) {
                    finalDelta = delta;
                }, roller1),
                complete: function() {

                }
            });

            setTimeout(function() {
                expect(finalDelta).toBe(1);
                //done();
            }, 3000);

            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.quadEaseOut,
                step: tui.util.bind(function(delta) {
                    finalDelta2 = delta;
                }, roller1),
                complete: function() {

                }
            });

            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.quadEaseInOut,
                step: tui.util.bind(function(delta) {
                    finalDelta3 = delta;
                }, roller1),
                complete: function() {

                }
            });

            setTimeout(function() {

                expect(finalDelta2).toBe(1);
                expect(finalDelta3).toBe(1);
                done();
            }, 4000);
        });

        it('tui.component.Rolling.Roller motion circ', function(done) {
            var finalDelta, finalDelta2, finalDelta3;
            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.circEaseIn,
                step: tui.util.bind(function(delta) {
                    finalDelta = delta;
                }, roller1),
                complete: function() {

                }
            });


            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.circEaseOut,
                step: tui.util.bind(function(delta) {
                    finalDelta2 = delta;
                }, roller1),
                complete: function() {

                }
            });


            roller1._animate({
                delay: 10,
                duration: 1000,
                delta: tui.component.Rolling.Roller.motion.circEaseInOut,
                step: tui.util.bind(function(delta) {
                    finalDelta3 = delta;
                }, roller1),
                complete: function() {

                }
            });

            setTimeout(function() {
                expect(finalDelta).toBe(1);
                expect(finalDelta2).toBe(1);
                expect(finalDelta3).toBe(1);
                done();
            }, 4000);
        });
    });
});
