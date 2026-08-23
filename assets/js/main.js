// Reveals elements with the `.reveal` class as they enter/exit the viewport.
(function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach(function (el) {
            el.classList.add('in-view');
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('in-view', entry.isIntersecting);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    targets.forEach(function (el) {
        observer.observe(el);
    });
})();
