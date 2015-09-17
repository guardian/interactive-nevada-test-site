import doT from 'olado/doT'
import template from './templates/map.html!text'

const templateFn = doT.template(template);

const mapWidth = 1555;
const mapHeight = 894;
const mapRatio = mapWidth / mapHeight;

var mapEls = [];

var lastRatio;
function setRatio(els) {
    var newRatio = mapRatio > window.innerWidth / window.innerHeight ? 'wider' : 'taller';
    if (newRatio !== lastRatio) {
        lastRatio = newRatio;
        for (let i = 0; i < mapEls.length; i++) {
            mapEls[i].setAttribute('data-ratio', newRatio);
        }
    }
}

window.addEventListener('resize', setRatio.bind(null, mapEls));

export default function map(el, options) {
    el.innerHTML += templateFn(options);

    var mapEl = el.querySelector('.js-map');
    mapEls.push(mapEl);

    setRatio([mapEl]);
}
