window.onload = function () {
    const isHomePage = location.pathname === '/' || location.pathname === '/index.html';
    if (isHomePage) {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            const randomImageUrl = `https://t.alcy.cc/moe?random=${Math.random()}`;
                card.style.backgroundImage = `url(${randomImageUrl})`;
        });
    };
    // 根据系统设置自动切换深色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = localStorage.getItem('theme');
        theme = prefersDark ? 'dark' : 'light';
        document.cookie = `theme=${theme}; path=/; max-age=3600`;
        localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('theme', theme);

    // 按钮显示逻辑
    const themeButton = document.querySelector('#dock-theme');
    if (themeButton) {
        if (theme === 'dark') {
            themeButton.querySelector('#light-button').style.display = 'none';
            themeButton.querySelector('#dark-button').style.display = 'flex';
        } else {
            themeButton.querySelector('#dark-button').style.display = 'none';
            themeButton.querySelector('#light-button').style.display = 'flex';
        }
    }
    // 设置 #banner 的背景图片
    const banner = document.querySelector('#banner');
    banner.style.backgroundImage = 'url("https://www.dmoe.cc/random.php?random=1")';
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        requestAnimationFrame(() => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-regular/font.css';
            link.media = 'print';
            link.onload = () => { link.media = 'all'; };
            document.head.appendChild(link);
            document.documentElement.style.fontFamily = '"975Maru SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
        });
    });
} else {
    requestAnimationFrame(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-regular/font.css';
        link.media = 'print';
        link.onload = () => { link.media = 'all'; };
        document.head.appendChild(link);
        document.documentElement.style.fontFamily = '"975Maru SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    });
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
/* // 图片懒加载，并用 /img/loading.png 占位
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = '/img/loading.png';
    });

    function lazyLoad(img) {
        if (img.getAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        }
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lazyLoad(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => observer.observe(img));

        // 监听属性变化，处理js动态修改data-src的情况
        const bodyObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-src') {
                    const img = mutation.target;
                    if (img.tagName === 'IMG' && img.hasAttribute('data-src')) {
                        observer.observe(img);
                        img.src = '/img/loading.png';
                    }
                }
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.tagName === 'IMG' && node.hasAttribute('data-src')) {
                            observer.observe(node);
                            node.src = '/img/loading.png';
                        }
                    });
                }
            });
        });
        bodyObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-src'], childList: true });
    } else {
        // Fallback: 直接加载所有图片
        images.forEach(lazyLoad);
    }
}); */