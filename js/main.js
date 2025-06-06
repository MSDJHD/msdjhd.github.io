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
    showArticleIndex();
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
