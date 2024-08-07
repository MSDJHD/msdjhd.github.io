function pjax_reload() {
    // 重置文章版权信息
    document.getElementsByClassName("post-copyright")[0].innerHTML = '<div class="post-copyright-content"><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></div><div class="post-copyright-text"><p>采用<a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>进行许可</p></div>';
}
document.addEventListener("pjax:complete", function () { pjax_reload(); });
document = pjax_reload();