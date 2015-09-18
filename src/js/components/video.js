import doT from 'olado/doT'
import sticky from '../lib/sticky'
import autoplay from '../lib/autoplay'
import template from './templates/video.html!text'

const templateFn = doT.template(template);

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
    var durationEl = el.querySelector('.js-duration');

    // Controls (hide when mouse doesn't move)
    var timer;
    function showControls() {
        containerEl.setAttribute('data-controls', '');
        containerEl.addEventListener('mousemouse', () => clearTimeout(timer));
        timer = setTimeout(hideControls, 2000);
    }
    function hideControls() {
        containerEl.removeAttribute('data-controls');
        clearTimeout(timer);
    }

    containerEl.addEventListener('mouseover', showControls);
    containerEl.addEventListener('mouseout', hideControls);

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

    // Buttons
    function userPlay() {
        videoEl.muted = false;
        videoEl.play();
        hideControls();
    }
    if (options.type !== 'intro') {
        restartEl.addEventListener('click', () => videoEl.currentTime = 0);
        restartEl.addEventListener('click', userPlay);
        playEl.addEventListener('click', userPlay);
        pauseEl.addEventListener('click', () => videoEl.pause());

        videoEl.addEventListener('loadedmetadata', () => {
            var duration = videoEl.duration;
            var mins = Math.round(duration / 60);
            var secs = pad(Math.round(duration % 60));
            durationEl.textContent = '(' + mins + ':' + secs + ')';
        });
    }

    // Sticky video
    if (!options.type && window.innerWidth > 600) {
        sticky(el, containerEl);
        autoplay(el, isVisible => {
            if (videoEl.muted) {
                if (isVisible) {
                    videoEl.play();
                } else {
                    videoEl.pause();
                }
            }
        });
    }
}
