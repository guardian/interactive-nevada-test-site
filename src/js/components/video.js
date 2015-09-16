import doT from 'olado/doT'
import template from './templates/video.html!text'

const templateFn = doT.template(template);

const scrollTolerance = 50;

var first = true;

function getOffset(el) {
    return el ? el.offsetTop + getOffset(el.offsetParent) : 0;
}

function toggleClass(el, toggle, className) {
    if (toggle) {
        el.className += ' ' + className;
    } else {
        el.className = el.className.replace(new RegExp(className, 'g'), '').trim();
    }
    return toggle;
}

function pad(n) {
    return (n < 10 ? '0' : '') + n;
}

export default function video(el, options) {
    el.innerHTML += templateFn(options);

    var containerEl = el.querySelector('.js-video-container');
    var videoEl = el.querySelector('.js-video');

    var restartEl = el.querySelector('.js-restart');
    var playEl = el.querySelector('.js-play');
    var pauseEl = el.querySelector('.js-pause');

    videoEl.addEventListener('loadedmetadata', () => {
        var duration = videoEl.duration;
        var mins = Math.round(duration / 60);
        var secs = pad(Math.round(duration % 60));
        el.querySelector('.js-duration').textContent = '(' + mins + ':' + secs + ')';
    });

    // Video state
    videoEl.addEventListener('play', () => containerEl.setAttribute('data-playing', ''));
    videoEl.addEventListener('pause', () => containerEl.removeAttribute('data-playing'));
    videoEl.addEventListener('volumechange', () => {
        if (videoEl.muted) {
            containerEl.setAttribute('data-muted', '');
        } else {
            containerEl.removeAttribute('data-muted');
        }
    });

    // Controls (hide when mouse doesn't move)
    var timer;
    function hideControls() {
        containerEl.removeAttribute('data-controls');
        clearTimeout(timer);
    }
    function showControls() {
        containerEl.setAttribute('data-controls', '');
    }

    containerEl.addEventListener('mouseover', () => {
        showControls();
        containerEl.addEventListener('mousemouse', () => clearTimeout(timer));
        timer = setTimeout(hideControls, 2000);
    });

    containerEl.addEventListener('mouseout', hideControls);

    // Buttons
    restartEl.addEventListener('click', () => {
        videoEl.muted = false;
        videoEl.currentTime = 0;
        videoEl.play();
    });

    playEl.addEventListener('click', () => {
        videoEl.muted = false;
        videoEl.play();
    });

    pauseEl.addEventListener('click', () => videoEl.pause());

    // Sticky video
    var isSticky = false, isBottom = false;
    window.addEventListener('scroll', () => {
        var pageY = window.pageYOffset;
        var containerTop = getOffset(el);

        var newBottom = pageY > containerTop + scrollTolerance;
        var newSticky = pageY >= containerTop && !newBottom;

        if (isSticky !== newSticky) {
            isSticky = toggleClass(containerEl, newSticky, 'is-sticky');
            if (isSticky) {
                videoEl.play();
            } else {
                videoEl.pause();
            }
        }
        if (isBottom !== newBottom) {
            isBottom = toggleClass(containerEl, newBottom, 'is-bottom');
        }
    });
}
