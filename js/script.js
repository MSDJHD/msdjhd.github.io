function pjax_reload() {
    // 重置文章版权信息
    document.getElementsByClassName("post-copyright")[0].innerHTML = '<div class="post-copyright-content"><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></div><div class="post-copyright-text"><p>采用<a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>进行许可</p></div>';
    (() => {
        function a(b,c) {
            var d=document.createElement('link');
            d.rel='stylesheet';
            d.href=b;
            d.onerror=function(){ 
                if(typeof c==='function'){c();}};
                document.head.appendChild(d);
        }
        a('https://static.zeoseven.com/cn/190/main/result.css', function() {
        /* 当 CDN 不可用时直接由源服务器提供文件 */
        a('https://static-host.zeoseven.com/cn/190/main/result.css');
    });})();
}
document.addEventListener("pjax:complete", function () { pjax_reload(); });
document = pjax_reload();