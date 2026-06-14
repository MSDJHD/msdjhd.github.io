function lazyLoadBg() {
    const lazyElements = document.querySelectorAll(".lazy-bg");
    const PLACEHOLDER_STYLE = {
        backgroundImage: 'url("/img/loading.svg")',
    };

    const FALLBACK_IMAGE = '/img/loadFailed.svg';
    const TIMEOUT_DURATION = 5000;
    const OBSERVER_OPTIONS = { rootMargin: "100px" };

    // 用于存储每个元素的定时器，防止内存泄漏
    const elementTimers = new Map();

    function setElementStyle(el, bgImage, opacity) {
        el.style.backgroundImage = bgImage;
        el.style.opacity = opacity;
    }

    // 设置占位图
    lazyElements.forEach((el) => {
        setElementStyle(el, PLACEHOLDER_STYLE.backgroundImage, PLACEHOLDER_STYLE.opacity);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgImage = element.dataset.bg;

                // 检查 data-bg 属性是否存在
                if (!bgImage) {
                    observer.unobserve(element);
                    return;
                }

                let isImageLoaded = false;

                // 添加超时处理
                const timer = setTimeout(() => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        setElementStyle(element, `url(${FALLBACK_IMAGE})`);
                        observer.unobserve(element);
                        elementTimers.delete(element); // 清除引用
                    }
                }, TIMEOUT_DURATION);

                elementTimers.set(element, timer); // 存储定时器引用

                const img = new Image();
                img.onload = () => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        clearTimeout(timer);
                        elementTimers.delete(element); // 清除引用
                        setElementStyle(element, `url(${bgImage})`);
                        observer.unobserve(element);
                    }
                };
                img.onerror = () => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        clearTimeout(timer);
                        elementTimers.delete(element); // 清除引用
                        console.warn(`图片加载失败: ${bgImage}，使用替补图片`);
                        setElementStyle(element, `url(${FALLBACK_IMAGE})`);
                        observer.unobserve(element);
                    }
                };
                img.src = bgImage;
            }
        });
    }, OBSERVER_OPTIONS);

    lazyElements.forEach((el) => observer.observe(el));
}
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll(".lazy-img");
    const PLACEHOLDER_IMAGE = "/img/loading.svg";
    const FALLBACK_IMAGE = '/img/loadFailed.svg';
    const TIMEOUT_DURATION = 5000;
    const OBSERVER_OPTIONS = { rootMargin: "50px" };

    // 用于存储每个元素的定时器，防止内存泄漏
    const imageTimers = new Map();

    // 设置占位图
    lazyImages.forEach((img) => {
        img.src = PLACEHOLDER_IMAGE;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const imgSrc = img.dataset.src;

                // 检查 data-src 属性是否存在
                if (!imgSrc) {
                    observer.unobserve(img);
                    return;
                }

                let isImageLoaded = false;

                // 添加超时处理
                const timer = setTimeout(() => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        img.src = FALLBACK_IMAGE;
                        observer.unobserve(img);
                        imageTimers.delete(img); // 清除引用
                    }
                }, TIMEOUT_DURATION);

                imageTimers.set(img, timer); // 存储定时器引用

                const imageLoader = new Image();
                imageLoader.onload = () => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        clearTimeout(timer);
                        imageTimers.delete(img); // 清除引用
                        img.src = imgSrc;
                        observer.unobserve(img);
                    }
                };
                imageLoader.onerror = () => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        clearTimeout(timer);
                        imageTimers.delete(img); // 清除引用
                        console.warn(`图片加载失败: ${imgSrc}，使用替补图片`);
                        img.src = FALLBACK_IMAGE;
                        observer.unobserve(img);
                    }
                };
                imageLoader.src = imgSrc;
            }
        });
    }, OBSERVER_OPTIONS);

    lazyImages.forEach((img) => observer.observe(img));
}

function themeButton() {
    const themeButton = document.querySelector('#sidebar-theme-toggle');
    let theme = localStorage.getItem('theme');
    if (themeButton) {
        if (theme === 'dark') {
            themeButton.querySelector('#light-button').style.display = 'none';
            themeButton.querySelector('#dark-button').style.display = 'flex';
        } else {
            themeButton.querySelector('#dark-button').style.display = 'none';
            themeButton.querySelector('#light-button').style.display = 'flex';
        }
    }
}
// 避免阻塞页面渲染，使用 DOMContentLoaded 替代 window.onload
document.addEventListener('DOMContentLoaded', function () {
    // 根据系统设置自动切换深色模式
    let theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        };
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    };

    // 按钮显示逻辑
    themeButton();
    // 延迟加载背景图，避免阻塞页面渲染
    lazyLoadBg();
    lazyLoadImages();
    // 为#main中的所有img外包一层a标签，href即为src
    const main = document.querySelector('#main');
    if (main) {
        const images = main.querySelectorAll('img');
        images.forEach(img => {
            // 检查img是否已经包裹了a标签
            if (img.parentElement.tagName !== 'A') {
                const link = document.createElement('a');
                link.href = img.src;
                link.setAttribute('data-caption', img.alt || '');
                img.parentNode.insertBefore(link, img);
                link.appendChild(img);
            }
        });
    }
    baguetteBox.run('#main', {
                // Custom options
                async: true,
                captions: function (element) {
                    return element.getElementsByTagName('img')[0].alt;
                },
                animation: 'fadeIn',
                noScrollbars: true
            });
});
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleSettings() {
    const settingsPanel = document.querySelector('#settings-panel');
    if (settingsPanel.classList.contains('show')) {
        settingsPanel.classList.remove('show');
    }
    else {
        settingsPanel.classList.add('show');
    }
}
document.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > window.innerHeight * 0.50) {
        header.classList.add('shown');
    } else {
        header.classList.remove('shown');
    }
});
function changeFontSize(size){
    size = size + 'px';
    document.getElementById('main').style.fontSize = size;
}
function toggleDarkMode(){
    let theme = localStorage.getItem('theme');
    if (theme && theme === 'dark') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeButton();
    }
    else if (theme && theme === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeButton();
    }
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
        themeButton();
    }
    else {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
        themeButton();
    }
}
document.addEventListener('pjax:send', function() {});