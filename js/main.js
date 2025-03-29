//背景图片懒加载
if ('IntersectionObserver' in window) {
    document.addEventListener("DOMContentLoaded", function() {
  
      function handleIntersection(entries) {
        entries.map((entry) => {
          if (entry.isIntersecting) {
            // 元素已经穿过了我们的观察
            // 阈值 - 从data-src加载src
            entry.target.style.backgroundImage = "url('"+entry.target.dataset.bgimage+"')";
            // 这个元素的任务完成了 - 不需要再观察它了！
            observer.unobserve(entry.target);
          }
        });
      }
  
      const lazy = document.querySelectorAll('.lazy');
      const observer = new IntersectionObserver(
        handleIntersection,
        { rootMargin: "100px" }
      );
      lazy.forEach(lazyItem => observer.observe(lazyItem));
    });
  } else {
    // 没有交互支持？自动加载所有背景图片
    const lazy = document.querySelectorAll('.lazy');
    lazy.forEach(lazyItem => {
      lazyItem.style.backgroundImage = "url('"+lazyItem.dataset.bgimage+"')";
    });
  }
// 图片懒加载
  function handleIntersection(entries) {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        // 元素已经穿过了我们的观察
        // 阈值 - 从data-src加载src
        entry.target.src = entry.target.dataset.src;
        entry.target.classList.remove('lazyload');
        // 这个元素的任务完成了 - 不需要再观察它了！
        observer.unobserve(entry.target);
      }
    });
  }
  
  const images = document.querySelectorAll('.lazy');
  const observer = new IntersectionObserver(
    handleIntersection,
    { rootMargin: "100px" }
  );
  images.forEach(image => observer.observe(image));

document.querySelectorAll('img').forEach(img => {
    img.classList.add('lazy');
    img.dataset.src = '/img/loading.png';
});
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