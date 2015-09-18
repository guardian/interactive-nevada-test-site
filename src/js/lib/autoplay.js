var rAF = window.requestAnimationFrame || (fn => fn());

function getOffset(el) {
    return el ? el.offsetTop + getOffset(el.offsetParent) : 0;
}

export default function autoplay(el, cb) {
    var isVisible;

    window.addEventListener('scroll', () => {
        rAF(() => {
            var pageY = window.pageYOffset;
            var elTop = getOffset(el);
            var tolerance = el.clientHeight / 2;

            var newVisible = pageY >= elTop - tolerance && pageY <= elTop + tolerance;

            if (isVisible !== newVisible) {
                isVisible = newVisible;
                cb(isVisible);
            }
        });
    });
}
