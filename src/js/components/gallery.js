import doT from 'olado/doT'
import sticky from '../lib/sticky'
import template from './templates/gallery.html!text'

const templateFn = doT.template(template);
export default function (el, options) {
    el.innerHTML = templateFn(options);

    var photoEls = [].slice.call(el.querySelectorAll('.js-photo'));
    var prevEl = el.querySelector('.js-prev');
    var nextEl = el.querySelector('.js-next');
    var photoI = 0;

    function show(i) {
        if (i >= 0 && i < photoEls.length) {
            photoEls[photoI].removeAttribute('data-visible');
            photoEls[i].setAttribute('data-visible', '');

            prevEl.disabled = i === 0;
            nextEl.disabled = i === photoEls.length - 1;

            photoI = i;
        }
    }

    prevEl.addEventListener('click', () => show(photoI - 1));
    nextEl.addEventListener('click', () => show(photoI + 1));

    show(photoI);

    if (window.innerWidth > 600) {
        sticky(el, el.querySelector('.js-sticky'));
    }
}
