import doT from 'olado/doT'
import sticky from '../lib/sticky'
import template from './templates/gallery.html!text'

const templateFn = doT.template(template);
export default function (el, options) {
    el.innerHTML = templateFn(options);
}
