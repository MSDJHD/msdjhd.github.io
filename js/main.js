function lazyLoadBg() {
    const lazyElements = document.querySelectorAll(".lazy-bg");
    const PLACEHOLDER_STYLE = {
        backgroundImage: 'url("/img/loading.svg")',
        opacity: "0.5"
    };

    const LOADED_STYLE = {
        opacity: "0.9"
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
                        setElementStyle(element, `url(${FALLBACK_IMAGE})`, LOADED_STYLE.opacity);
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
                        setElementStyle(element, `url(${bgImage})`, LOADED_STYLE.opacity);
                        observer.unobserve(element);
                    }
                };
                img.onerror = () => {
                    if (!isImageLoaded) {
                        isImageLoaded = true;
                        clearTimeout(timer);
                        elementTimers.delete(element); // 清除引用
                        console.warn(`图片加载失败: ${bgImage}，使用替补图片`);
                        setElementStyle(element, `url(${FALLBACK_IMAGE})`, LOADED_STYLE.opacity);
                        observer.unobserve(element);
                    }
                };
                img.src = bgImage;
            }
        });
    }, OBSERVER_OPTIONS);

    lazyElements.forEach((el) => observer.observe(el));
}
// 避免阻塞页面渲染，使用 DOMContentLoaded 替代 window.onload
document.addEventListener('DOMContentLoaded', function () {
    // 根据系统设置自动切换深色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = localStorage.getItem('theme');
    theme = prefersDark ? 'dark' : 'light';
    document.cookie = `theme=${theme}; path=/; max-age=3600`;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('theme', theme);

    // 按钮显示逻辑
    const themeButton = document.querySelector('#sidebar-theme');
    if (themeButton) {
        if (theme === 'dark') {
            themeButton.querySelector('#light-button').style.display = 'none';
            themeButton.querySelector('#dark-button').style.display = 'flex';
        } else {
            themeButton.querySelector('#dark-button').style.display = 'none';
            themeButton.querySelector('#light-button').style.display = 'flex';
        }
    }
    // 延迟加载背景图，避免阻塞页面渲染
    lazyLoadBg();
});
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
function toc() {
    showArticleIndex();
    window.scrollBy({ top: 1, behavior: 'smooth' });
    const toc = document.querySelector('#toc');
    toc.style.display = toc.style.display === 'block' ? 'none' : 'block';
    if (toc.style.display === 'block') {
        toc.style.animation = 'toc-in 0.2s cubic-bezier(0,0,0,1) forwards';
    }
    else {
        toc.style.animation = 'toc-out 0.2s cubic-bezier(0,0,0,1) forwards';
    }
}
// 字体配置常量
const FONT_CONFIG = {
    CDN_URL: 'https://cdn.iocdn.cc/npm/cn-fontsource-975-maru-sc-regular/font.css',
    FONT_FAMILY: '"975Maru SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    FONT_NAME: '975Maru SC'
};

/**
 * 加载并应用自定义字体
 */
function loadCustomFont() {
    // 防止重复加载
    if (loadCustomFont.loaded) {
        console.warn('Custom font already loaded');
        return;
    }

    try {
        // 检查是否已经存在相同链接
        const existingLink = document.querySelector(`link[href="${FONT_CONFIG.CDN_URL}"]`);
        if (existingLink) {
            console.warn('Custom font already loaded');
            loadCustomFont.loaded = true;
            return;
        }

        // 创建字体链接元素
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = FONT_CONFIG.CDN_URL;

        // 提升加载性能
        link.onload = () => {
            console.log('Custom font loaded successfully');
            applyFontFamily();
        };

        link.onerror = () => {
            console.error('Failed to load custom font, using system fonts');
            applySystemFont();
        };

        // 提取字体 CDN 域名用于 preconnect
        const fontUrl = new URL(FONT_CONFIG.CDN_URL);
        const fontOrigin = `${fontUrl.protocol}//${fontUrl.host}`;

        // 预连接以提高加载性能（避免重复插入）
        let preconnect = document.querySelector(`link[rel="preconnect"][href="${fontOrigin}"]`);
        if (!preconnect) {
            preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = fontOrigin;
            preconnect.crossOrigin = 'anonymous';
            document.head.appendChild(preconnect);
        }

        // 添加字体链接到文档头部
        document.head.appendChild(link);
        loadCustomFont.loaded = true;

    } catch (error) {
        console.error('Error loading custom font:', error);
        applySystemFont();
    }
}

// 防止重复加载标志
loadCustomFont.loaded = false;

/**
 * 应用自定义字体族
 */
function applyFontFamily() {
    document.documentElement.style.fontFamily = FONT_CONFIG.FONT_FAMILY;
}

/**
 * 应用系统默认字体族（备选方案）
 */
function applySystemFont() {
    document.documentElement.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
}

// 执行字体加载
loadCustomFont();
function showArticleIndex() {
  // 先刷一遍文章有哪些节点，把 h1 h2 h3 加入列表，等下循环进行处理。
  // 如果不够，可以加上 h4 ,只是我个人觉得，前 3 个就够了，出现第 4 层就目录就太长了，太细节了。
  var h1List = h2List = h3List = [];
  var labelList = $("#article").children();
  for ( var i=0; i<labelList.length; i++ ) {
      if ( $(labelList[i]).is("h1") ) {
          h2List = new Array();
          h1List.push({node: $(labelList[i]), id: i, children: h2List});
      }

      if ( $(labelList[i]).is("h2") ) {
          h3List = new Array();
          h2List.push({node: $(labelList[i]), id: i, children: h3List});
      }

      if ( $(labelList[i]).is("h3") ) {
          h3List.push({node: $(labelList[i]), id: i, children: []});
      }
  }

  // 闭包递归，返回树状 html 格式的文章目录索引
  function show(tocList) {
      var content = "<ul>";
      tocList.forEach(function (toc) {
          toc.node.before('<span class="anchor" id="_label'+toc.id+'"></span>');
          if ( toc.children == 0 ) {
              content += '<li><a href="#_label'+toc.id+'">'+toc.node.text()+'</a></li>';
          }
          else {
              content += '<li><a href="#_label'+toc.id+'">'+toc.node.text()+'</a>'+show(toc.children)+'</li>';
          }
      });
      content += "</ul>"
      return content;
  }

// 最后组合成 div 方便 css 设计样式，添加到指定位置
  $("#toc").empty();
  $("#toc").append(show(h1List));

  // 点击目录索引链接，动画跳转过去，不是默认闪现过去
  $("#toc a").on("click", function(e){
      e.preventDefault();
      // 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
      var target = $(this.hash);
      $("body, html").animate(
          {'scrollTop': target.offset().top},
          500
      );
  });

  // 监听浏览器滚动条，当浏览过的标签，给他上色。
  $(window).on("scroll", function(e){
      var anchorList = $(".anchor");
      anchorList.each(function(){
          var tocLink = $('#toc a[href="#'+$(this).attr("id")+'"]');
          var anchorTop = $(this).offset().top;
          var windowTop = $(window).scrollTop();
          if ( anchorTop <= windowTop+50 ) {
              tocLink.addClass("read");
          }
          else {
              tocLink.removeClass("read");
          }
      });
  });
}
document.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('shown');
    } else {
        header.classList.remove('shown');
    }
});
