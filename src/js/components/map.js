import doT from 'olado/doT'
import sticky from '../lib/sticky'
import template from './templates/map.html!text'
import tests from '../data/tests.json!json'

const templateFn = doT.template(template);

const mapWidth = 1555;
const mapHeight = 894;
const mapRatio = mapWidth / mapHeight;

var rAF = window.requestAnimationFrame || (fn => fn());

var setRatio = (function () {
    var lastRatio;
    return function (els, force) {
        var newRatio = mapRatio > window.innerWidth / window.innerHeight ? 'wider' : 'taller';
        if (newRatio !== lastRatio || force) {
            lastRatio = newRatio;
            for (let i = 0; i < mapEls.length; i++) {
                mapEls[i].setAttribute('data-ratio', newRatio);
            }
        }
    };
})();

var mapEls = [];

window.addEventListener('resize', () => rAF(setRatio.bind(null, mapEls)));

export default function map(el, options) {
    options.tests = tests;
    el.innerHTML += templateFn(options);

    var mapEl = el.querySelector('.js-map');
    mapEls.push(mapEl);
    setRatio([mapEl], true);

    var testEls = [].slice.call(el.querySelectorAll('.js-test'));
    var yearEl = el.querySelector('.js-year');
    var countEl = el.querySelector('.js-count');

    var testI = 0;
    var timer;
    function addTest() {
        if (testI < tests.length - 1) {
            rAF(() => {
                yearEl.textContent = tests[testI].year;
                countEl.textContent = testI + 1;
                testEls[testI].className += ' is-visible';
                testI++;
                timer = setTimeout(addTest, 20);
            });
        }
    }

    el.querySelector('.js-restart').addEventListener('click', () => {
        clearTimeout(timer);
        for (var i = 0; i < testEls.length; i++) {
            testEls[i].className = testEls[i].className.replace(/is-visible/g, '').trim();
        }
        testI = 0;
        addTest();
    });

    sticky(el, el.querySelector('.js-sticky'), isSticky => {
        if (isSticky) {
            addTest();
        } else {
            clearTimeout(timer);
        }
    });
}
