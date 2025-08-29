class Lightbox {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.startX = 0;
        this.startY = 0;
        this.startTranslateX = 0;
        this.startTranslateY = 0;
        this.isDragging = false;
        this.animationDuration = 300;
        // 添加自动隐藏相关属性
        this.autoHideTimeout = null;
        this.autoHideDelay = 3000; // 3秒无操作后隐藏UI
        
        this.init();
    }

    init() {
        this.createLightbox();
        this.bindEvents();
        this.collectImages();
    }

    collectImages() {
        // 修改: 直接遍历#article中的所有图片，不再使用data-lightbox属性
        const article = document.getElementById('article');
        if (article) {
            const imageElements = article.querySelectorAll('img');
            this.images = Array.from(imageElements);
        } else {
            // 如果没有找到#article，则回退到原来的方式
            this.images = Array.from(document.querySelectorAll('img'));
        }
        
        this.images.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
        });
    }

    createLightbox() {
        // 创建灯箱HTML结构
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        
        // 修改: 使用Bootstrap图标并调整按钮位置
        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <div class="lightbox-content">
                    <div class="lightbox-image-wrapper">
                        <img class="lightbox-image" src="" alt="">
                    </div>
                    <button class="lightbox-btn lightbox-btn-prev">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="lightbox-btn lightbox-btn-next">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <button class="lightbox-btn lightbox-btn-close">
                        <i class="bi bi-x-lg"></i>
                    </button>
                    <div class="lightbox-counter">
                        <span class="current-index">1</span> / <span class="total-count">0</span>
                    </div>
                </div>
                <div class="lightbox-thumbnails">
                    <div class="thumbnails-wrapper"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.lightbox);
        
        // 缓存元素引用
        this.overlay = this.lightbox.querySelector('.lightbox-overlay');
        this.container = this.lightbox.querySelector('.lightbox-container');
        this.imageWrapper = this.lightbox.querySelector('.lightbox-image-wrapper');
        this.image = this.lightbox.querySelector('.lightbox-image');
        this.thumbnailsWrapper = this.lightbox.querySelector('.thumbnails-wrapper');
        this.currentIndexEl = this.lightbox.querySelector('.current-index');
        this.totalCountEl = this.lightbox.querySelector('.total-count');
    }

    bindEvents() {
        // 控制按钮事件
        this.lightbox.querySelector('.lightbox-btn-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });
        this.lightbox.querySelector('.lightbox-btn-next').addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });
        this.lightbox.querySelector('.lightbox-btn-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        
        // 修改: 点击背景关闭
        this.overlay.addEventListener('click', () => this.close());
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            this.showUI(); // 有操作时显示UI
            this.resetAutoHideTimer(); // 重置自动隐藏计时器
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
        
        // 添加鼠标移动事件来显示/隐藏UI
        this.lightbox.addEventListener('mousemove', (e) => {
            this.showUI();
            this.resetAutoHideTimer();
        });
        
        // 添加触摸事件支持
        this.lightbox.addEventListener('touchstart', (e) => {
            this.showUI();
            this.resetAutoHideTimer();
        });
        
        // 手势事件
        this.imageWrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.imageWrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.imageWrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        this.imageWrapper.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // 图片加载事件
        this.image.addEventListener('load', () => {
            this.resetTransform();
        });
        
        // 添加PJAX事件监听
        document.addEventListener('pjax:start', () => {
            if (this.isOpen) {
                this.close();
            }
        });
        
        document.addEventListener('pjax:end', () => {
            this.collectImages();
        });
    }

    open(index = 0) {
        if (this.images.length === 0) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
        this.isOpen = true;
        
        // 更新图片源
        const imgSrc = this.images[this.currentIndex].src;
        this.image.src = imgSrc;
        
        // 更新计数器
        this.currentIndexEl.textContent = this.currentIndex + 1;
        this.totalCountEl.textContent = this.images.length;
        
        // 生成缩略图
        this.generateThumbnails();
        
        // 显示灯箱
        this.lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
        
        // 初始化UI显示状态
        this.showUI();
        this.resetAutoHideTimer();
    }

    close() {
        this.isOpen = false;
        this.lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
        document.body.style.overflow = '';
        
        // 清除自动隐藏计时器
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
            this.autoHideTimeout = null;
        }
        
        // 重置变换
        this.resetTransform();
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateImage();
        }
    }

    next() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateImage();
        }
    }

    updateImage() {
        if (!this.isOpen) return;
        
        const imgSrc = this.images[this.currentIndex].src;
        this.image.src = imgSrc;
        
        // 更新计数器
        this.currentIndexEl.textContent = this.currentIndex + 1;
        
        // 高亮当前缩略图
        this.highlightCurrentThumbnail();
    }

    generateThumbnails() {
        this.thumbnailsWrapper.innerHTML = '';
        
        this.images.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.className = 'lightbox-thumbnail';
            thumbnail.src = img.src;
            thumbnail.alt = img.alt || `Image ${index + 1}`;
            
            if (index === this.currentIndex) {
                thumbnail.classList.add('active');
            }
            
            thumbnail.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentIndex = index;
                this.updateImage();
            });
            
            this.thumbnailsWrapper.appendChild(thumbnail);
        });
    }

    highlightCurrentThumbnail() {
        const thumbnails = this.thumbnailsWrapper.querySelectorAll('.lightbox-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentIndex) {
                thumb.classList.add('active');
                // 滚动到当前缩略图
                thumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    resetTransform() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        this.image.style.transform = `translate3d(${this.translateX}px, ${this.translateY}px, 0) scale(${this.scale})`;
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            // 单指触摸 - 拖拽
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.startTranslateX = this.translateX;
            this.startTranslateY = this.translateY;
            
            this.imageWrapper.classList.add('dragging');
        } else if (e.touches.length === 2) {
            // 双指触摸 - 缩放
            this.isDragging = false;
            this.pinchStartDistance = this.getDistanceBetweenTouches(e.touches);
        }
        
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.isDragging && e.touches.length !== 2) return;
        
        if (this.isDragging && e.touches.length === 1) {
            // 拖拽操作
            const deltaX = e.touches[0].clientX - this.startX;
            const deltaY = e.touches[0].clientY - this.startY;
            
            this.translateX = this.startTranslateX + deltaX;
            this.translateY = this.startTranslateY + deltaY;
            
            this.updateTransform();
        } else if (e.touches.length === 2) {
            // 缩放操作
            const currentDistance = this.getDistanceBetweenTouches(e.touches);
            const scale = currentDistance / this.pinchStartDistance;
            
            this.scale = Math.max(0.5, Math.min(scale * this.scale, 5));
            this.updateTransform();
        }
        
        e.preventDefault();
    }

    handleTouchEnd(e) {
        this.isDragging = false;
        this.imageWrapper.classList.remove('dragging');
        
        // 如果缩放小于1，则重置
        if (this.scale < 1) {
            this.resetTransform();
        }
        
        // 检查是否为关闭手势（向下 swipe）
        if (this.scale === 1 && Math.abs(this.translateY) > 100) {
            this.close();
        }
    }

    handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.scale = Math.max(0.5, Math.min(this.scale + delta, 5));
        
        this.updateTransform();
    }

    getDistanceBetweenTouches(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 显示UI元素
    showUI() {
        this.lightbox.classList.remove('auto-hide');
    }

    // 隐藏UI元素
    hideUI() {
        this.lightbox.classList.add('auto-hide');
    }

    // 重置自动隐藏计时器
    resetAutoHideTimer() {
        // 清除现有的计时器
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }
        
        // 设置新的计时器
        this.autoHideTimeout = setTimeout(() => {
            this.hideUI();
        }, this.autoHideDelay);
    }
    
    // 销毁灯箱实例的方法
    destroy() {
        if (this.lightbox && this.lightbox.parentNode) {
            this.lightbox.parentNode.removeChild(this.lightbox);
        }
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
        }
    }
}

// 初始化灯箱
document.addEventListener('DOMContentLoaded', () => {
    window.lightbox = new Lightbox();
});

// 添加PJAX兼容性支持
document.addEventListener('pjax:send', () => {
    if (window.lightbox && window.lightbox.isOpen) {
        window.lightbox.close();
    }
});

document.addEventListener('pjax:complete', () => {
    if (window.lightbox) {
        window.lightbox.collectImages();
    } else {
        window.lightbox = new Lightbox();
    }
});