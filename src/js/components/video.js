import doT from 'olado/doT'
import template from './templates/video.html!text'

const templateFn = doT.template(template);

export default function video(el, options) {
    el.innerHTML += templateFn(options);
}
