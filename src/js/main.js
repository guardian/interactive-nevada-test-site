import reqwest from 'reqwest'
import doT from 'olado/doT'
import share from './lib/share'
import testBandwidth from './lib/test-bandwidth'

import video from './components/video'
import map from './components/map'
import gallery from './components/gallery'

import bylineHTML from './templates/byline.html!text'
import headerHTML from './templates/header.html!text'
import textHTML from './templates/text.html!text'
import relatedHTML from './templates/related.html!text'

const contentURL = 'https://interactive.guim.co.uk/docsdata/1gqa6aP0y7Hu5eaP4gKecUJbAmNz_-8LoeK34-oMvRPw.json';

const templates = {
    'byline': doT.template(bylineHTML),
    'header': doT.template(headerHTML),
    'text': doT.template(textHTML),
    'related': doT.template(relatedHTML)
};

const components = {video, map, gallery};
const baseComponent = type => (el, options) => el.innerHTML = templates[type](options);


function app(bitrate, el, config, resp) {
    config.bitrate = bitrate;
    el.innerHTML = '';
    resp.blocks.forEach(block => {
        block.config = config;
        if (block.copy !== undefined) {
            block.copy = block.copy.replace(/[\r\n]+/g, '\n').trim().split('\n');
        }
        var componentEl = document.createElement('section');
        if (block.darkcolor) {
            componentEl.style.backgroundColor = block.darkcolor;
        }
        el.appendChild(componentEl);
        (components[block.block] || baseComponent(block.block))(componentEl, block);
    });

    var shareFn = share(resp.share.title, resp.share.shorturl, resp.share.hashtag);

    [].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}

export function init(el, context, config, mediator) {
    reqwest({
        url: contentURL,
        type: 'json',
        crossOrigin: true,
        success: resp => testBandwidth(bitrate => app(bitrate, el, config, resp))
    });
}
