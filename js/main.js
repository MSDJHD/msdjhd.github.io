window.onload = function () {
    document.querySelectorAll('.post-card, #banner').forEach(card => {
        const randomImageUrl = `https://imgapi.cn/api.php?zd=pc&fl=dongman&gs=images&random=${Math.random()}`;
        card.style.backgroundImage = `url(${randomImageUrl})`;
    });
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('theme', 'dark');
    } else {
        document.documentElement.setAttribute('theme', 'light');
    }
    const themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
    if (themeCookie) {
        const theme = themeCookie.split('=')[1];
        document.documentElement.setAttribute('theme', theme);
    } else {
        const defaultTheme = 'light';
        document.documentElement.setAttribute('theme', defaultTheme);
        document.cookie = `theme=${defaultTheme}; path=/; max-age=31536000`;
    }
    const themeButton = document.querySelector('#dock-theme');
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        themeButton.querySelector('#light-button').style.display = 'none';
        themeButton.querySelector('#dark-button').style.display = 'flex';
    } else {
        themeButton.querySelector('#dark-button').style.display = 'none';
        themeButton.querySelector('#light-button').style.display = 'flex';
    }
}
function themeSwitch() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
function content() {
    const content = document.querySelector('#content');
    if (content) {
        content.scrollIntoView({ behavior: 'smooth' });
    }
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToComment() {
    const comment = document.querySelector('#utteranc-container');
    if (comment) {
        comment.scrollIntoView({ behavior: 'smooth' });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var lazyloadImages;
    if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll(".lazy");
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.classList.remove("lazy");
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = document.querySelectorAll(".lazy");

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function (img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                if (lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }
})
