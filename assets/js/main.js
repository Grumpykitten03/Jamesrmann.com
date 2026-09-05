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

// YouTube gallery cards: play selected videos in an in-page modal.
(function () {
    var modal = document.getElementById('video-modal');
    var cards = document.querySelectorAll('.youtube-card');

    if (!modal || cards.length === 0) {
        return;
    }

    var player = document.getElementById('youtube-player');
    var title = document.getElementById('video-modal-title');
    var closeBtn = modal.querySelector('.video-modal-close');
    var lastFocused = null;

    function close() {
        modal.hidden = true;
        player.src = '';
        if (lastFocused) {
            lastFocused.focus();
        }
    }

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            var videoId = card.getAttribute('data-youtube-id');
            lastFocused = document.activeElement;
            title.textContent = card.getAttribute('data-video-title') || 'Enough Talk video';
            player.title = title.textContent;
            player.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&origin=https%3A%2F%2Fjamesrmann.com&widget_referrer=https%3A%2F%2Fjamesrmann.com%2FEnoughTalk.html';
            modal.hidden = false;
            closeBtn.focus();
        });
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            close();
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modal.hidden) {
            close();
        }
    });
})();

// Hero carousel: cycles slides on a timer, with prev/next/dot controls and pause-on-hover/focus.
(function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.hero-carousel').forEach(function (carousel) {
        var track = carousel.querySelector('.carousel-track');
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-dot'));
        var prevBtn = carousel.querySelector('.carousel-btn.prev');
        var nextBtn = carousel.querySelector('.carousel-btn.next');
        var current = 0;
        var timer = null;
        var autoplayDelay = 5000;

        if (!track || slides.length === 0) {
            return;
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            slides.forEach(function (slide, i) {
                slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
            });
            dots.forEach(function (dot, i) {
                dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
            });
        }

        function next() {
            goTo(current + 1);
        }

        function prev() {
            goTo(current - 1);
        }

        function startAutoplay() {
            if (prefersReducedMotion || slides.length < 2) {
                return;
            }
            stopAutoplay();
            timer = window.setInterval(next, autoplayDelay);
        }

        function stopAutoplay() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                prev();
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                next();
                startAutoplay();
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                goTo(i);
                startAutoplay();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);

        goTo(0);
        startAutoplay();
    });
})();

// Gallery lightbox: enlarges a clicked gallery image in place with its caption.
(function () {
    var lightbox = document.getElementById('gallery-lightbox');
    var links = document.querySelectorAll('.gallery-link');

    if (!lightbox || links.length === 0) {
        return;
    }

    var image = document.getElementById('lightbox-image');
    var caption = document.getElementById('lightbox-caption');
    var projectLink = document.getElementById('lightbox-link');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var lastFocused = null;

    function open(trigger) {
        var fullSrc = trigger.getAttribute('data-full-src');
        var captionText = trigger.getAttribute('data-caption') || '';
        var thumbImg = trigger.querySelector('img');
        var projectHref = trigger.getAttribute('data-link');

        image.src = fullSrc;
        image.alt = thumbImg ? thumbImg.alt : captionText;
        caption.textContent = captionText;

        if (projectLink) {
            if (projectHref) {
                projectLink.href = projectHref;
                projectLink.textContent = trigger.getAttribute('data-link-label') || 'View full project \u2192';
                projectLink.hidden = false;
            } else {
                projectLink.hidden = true;
            }
        }

        lastFocused = document.activeElement;
        lightbox.hidden = false;
        closeBtn.focus();
        document.addEventListener('keydown', onKeydown);
    }

    function close() {
        lightbox.hidden = true;
        image.src = '';
        document.removeEventListener('keydown', onKeydown);
        if (lastFocused) {
            lastFocused.focus();
        }
    }

    function onKeydown(event) {
        if (event.key === 'Escape') {
            close();
        }
    }

    links.forEach(function (link) {
        link.addEventListener('click', function () {
            open(link);
        });
    });

    closeBtn.addEventListener('click', close);

    lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) {
            close();
        }
    });
})();
