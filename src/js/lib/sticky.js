const scrollTolerance = 40;

var rAF = window.requestAnimationFrame || (fn => fn());

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

export default function sticky(anchorEl, stickyEl) {
    var isSticky = false, isBottom = false;

    window.addEventListener('scroll', () => {
        rAF(() => {
            var pageY = window.pageYOffset;
            var anchorTop = getOffset(anchorEl);

            var newBottom = pageY > anchorTop + scrollTolerance;
            var newSticky = pageY >= anchorTop && !newBottom;

            if (isSticky !== newSticky) {
                isSticky = toggleClass(stickyEl, newSticky, 'is-sticky');
            }
            if (isBottom !== newBottom) {
                isBottom = toggleClass(stickyEl, newBottom, 'is-bottom');
            }
        });
    });
}
