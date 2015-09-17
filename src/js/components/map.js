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
    return function (els) {
        var newRatio = mapRatio > window.innerWidth / window.innerHeight ? 'wider' : 'taller';
        if (newRatio !== lastRatio) {
            lastRatio = newRatio;
            for (let i = 0; i < mapEls.length; i++) {
                mapEls[i].setAttribute('data-ratio', newRatio);
            }
        }
    };
})();

var mapEls = [];

window.addEventListener('resize', () => rAF(setRatio.bind(null, mapEls)));

function translate(el, x, y) {
    var t = `translate(${x}px, ${y}px)`;
    el.style.transform = t;
    el.style.msTransform = t;
    el.style.webkitTransform = t;
}

export default function map(el, options) {
    options.tests = tests;
    el.innerHTML += templateFn(options);

    var mapEl = el.querySelector('.js-map');
    mapEls.push(mapEl);
    setRatio([mapEl]);

    var testEls = [].slice.call(el.querySelectorAll('.js-test'));
    var yearEl = el.querySelector('.js-year');

    var testI = 0;
    var timer;
    function addTest() {
        if (testI < tests.length - 1) {
            yearEl.textContent = tests[testI].year;
            translate(testEls[testI], 0, 0);
            testI++;
            timer = setTimeout(addTest, 20);
        }
    }

    el.querySelector('.js-restart').addEventListener('click', () => {
        for (var i = 0; i < testEls.length; i++) {
            translate(testEls[i], -1000, -1000);
        }
        testI = 0;
        clearTimeout(timer);
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
