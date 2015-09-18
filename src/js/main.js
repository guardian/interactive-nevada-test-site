import reqwest from 'reqwest'
import doT from 'olado/doT'
import share from './lib/share'

import video from './components/video'
import map from './components/map'

import headerHTML from './templates/header.html!text'
import photoHTML from './templates/photo.html!text'
import textHTML from './templates/text.html!text'
import galleryHTML from './templates/gallery.html!text'

const contentURL = '//interactive.guim.co.uk/docsdata-test/1gqa6aP0y7Hu5eaP4gKecUJbAmNz_-8LoeK34-oMvRPw.json';

const templates = {
    'header': doT.template(headerHTML),
    'photo': doT.template(photoHTML),
    'text': doT.template(textHTML),
    'gallery': doT.template(galleryHTML)
};

const components = {video, map};
const baseComponent = type => (el, options) => el.innerHTML += templates[type](options);

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    reqwest({
        url: contentURL,
        type: 'json',
        crossOrigin: true,
        success: resp => {
            el.innerHTML = '';
            resp.blocks.forEach(block => {
                block.config = config;
                if (block.copy) {
                    block.copy = block.copy.replace(/[\r\n]+/g, '\n').trim().split('\n');
                }
                var componentEl = document.createElement('section');
                if (block.darkcolor) {
                    componentEl.style.backgroundColor = block.darkcolor;
                }
                el.appendChild(componentEl);
                (components[block.block] || baseComponent(block.block))(componentEl, block);
            });
        }
    });

    /*[].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });*/
}
