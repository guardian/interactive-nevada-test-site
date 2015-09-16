import doT from 'olado/doT'
import template from './templates/map.html!text'

const templateFn = doT.template(template);

export default function map(el, options) {
    el.innerHTML += templateFn(options);
}
