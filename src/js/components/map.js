import doT from 'olado/doT'
import template from './templates/map.html!text'

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

export default function map(el, options) {
    el.innerHTML += templateFn(options);

    var mapEl = el.querySelector('.js-map');
    mapEls.push(mapEl);

    setRatio([mapEl]);
}
