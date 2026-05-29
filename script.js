// 开场动画结束后隐藏，并自动播放音乐
const intro = document.getElementById('intro');
const bgMusic = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const musicPlayer = document.getElementById('musicPlayer');

let isPlaying = false;

// 开场动画点击后播放音乐
intro.addEventListener('click', () => {
    bgMusic.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        musicPlayer.classList.add('playing');
    }).catch(() => {
        // 浏览器阻止自动播放，需要用户手动点击
    });
});

setTimeout(() => {
    intro.style.display = 'none';
    // 尝试自动播放音乐
    bgMusic.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        musicPlayer.classList.add('playing');
    }).catch(() => {
        // 浏览器阻止，等待用户点击播放按钮
        isPlaying = false;
    });
}, 3000);

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// 轮播图功能
const carousel = document.getElementById('photoCarousel');
let slides = carousel.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = carousel.querySelector('.carousel-prev');
const nextBtn = carousel.querySelector('.carousel-next');

let currentSlide = 0;
let autoPlayTimer = null;

// 生成指示点
slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
});

function showSlide(index) {
    const total = slides.length;
    // 清除所有状态类
    slides.forEach(s => {
        s.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');
    });
    dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

    // 计算每张 slide 相对于当前的偏移量
    slides.forEach((s, i) => {
        let offset = i - index;
        // 处理循环偏移：确保偏移在 [-total/2, total/2] 范围内
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        if (offset === 0) s.classList.add('active');
        else if (offset === -1) s.classList.add('prev');
        else if (offset === 1) s.classList.add('next');
        else if (offset === -2) s.classList.add('prev-2');
        else if (offset === 2) s.classList.add('next-2');
    });

    currentSlide = index;
    dotsContainer.children[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

// 自动轮播（每4秒）
function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
    clearInterval(autoPlayTimer);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// hover 时暂停
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// 触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
    startAutoPlay();
});

// 点击 slide 打开 lightbox
slides.forEach(slide => {
    slide.addEventListener('click', () => {
        const img = slide.querySelector('img');
        lightboxImg.src = img.src;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// 初始化：显示第一张并开始自动播放
showSlide(0);
startAutoPlay();

// 将提交的照片加入轮播图
const carouselTrack = carousel.querySelector('.carousel-track');

function addSlideToCarousel(photo) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption || '美好瞬间'}" onerror="this.src='https://via.placeholder.com/800x600?text=图片加载失败'">
        <div class="slide-caption">${photo.caption || '美好瞬间'} ${photo.name ? '— ' + photo.name : ''}</div>
    `;
    slide.addEventListener('click', () => {
        lightboxImg.src = photo.url;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    carouselTrack.appendChild(slide);

    // 更新 slides 引用并添加对应的 dot
    slides = carousel.querySelectorAll('.carousel-slide');
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
        const newIndex = Array.from(slides).indexOf(slide);
        showSlide(newIndex);
        resetAutoPlay();
    });
    dotsContainer.appendChild(dot);

    // 重新显示当前 slide
    showSlide(currentSlide);
}

// Lightbox 关闭
document.querySelector('.close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 浮动爱心
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = ['❤', '💕', '💗', '💖', '♥', '✿'][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 15 + 10 + 'px';
    heart.style.animationDuration = Math.random() * 10 + 10 + 's';
    heart.style.color = `rgba(212, 165, 165, ${Math.random() * 0.3 + 0.2})`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 20000);
}

// 定时创建爱心
setInterval(createFloatingHeart, 3000);

// 初始创建一些爱心
for (let i = 0; i < 3; i++) {
    setTimeout(createFloatingHeart, i * 500);
}

// 时间轴滚动动画
const timelineItems = document.querySelectorAll('.timeline-item');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// 提交照片功能
const submitForm = document.getElementById('submitForm');
const submitSuccess = document.getElementById('submitSuccess');
const submittedList = document.getElementById('submittedList');

// 从 localStorage 加载已提交的照片
let submittedPhotos = JSON.parse(localStorage.getItem('submittedPhotos') || '[]');

// 页面加载时把已提交的照片加到轮播
submittedPhotos.forEach(photo => addSlideToCarousel(photo));

// 显示已提交的照片
function displaySubmittedPhotos() {
    submittedList.innerHTML = '';
    submittedPhotos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'submitted-card';
        card.innerHTML = `
            <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='https://via.placeholder.com/200x150?text=图片加载失败'">
            <div class="caption">${photo.caption || '美好瞬间'}</div>
            <div class="sender">来自: ${photo.name || '匿名'}</div>
        `;
        card.addEventListener('click', () => {
            lightboxImg.src = photo.url;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        submittedList.appendChild(card);
    });
}

// 初始显示
displaySubmittedPhotos();

// 表单提交处理
submitForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(submitForm);
    const photoUrl = formData.get('photoUrl');
    const photoCaption = formData.get('photoCaption');
    const senderName = formData.get('senderName');
    const message = formData.get('message');

    // 添加到列表
    const newPhoto = {
        url: photoUrl,
        caption: photoCaption,
        name: senderName,
        message: message,
        time: new Date().toLocaleString()
    };

    submittedPhotos.unshift(newPhoto);
    localStorage.setItem('submittedPhotos', JSON.stringify(submittedPhotos));

    // 显示成功提示
    submitForm.style.display = 'none';
    submitSuccess.classList.add('show');

    // 更新显示列表
    displaySubmittedPhotos();

    // 加入轮播图
    addSlideToCarousel(newPhoto);

    // 3秒后恢复表单
    setTimeout(() => {
        submitForm.style.display = 'block';
        submitSuccess.classList.remove('show');
        submitForm.reset();
    }, 3000);
});

// 日记留言板功能
const diaryForm = document.getElementById('diaryForm');
const diaryList = document.getElementById('diaryList');
const todayDateEl = document.getElementById('todayDate');

// 显示今天的日期
function showTodayDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    todayDateEl.textContent = now.toLocaleDateString('zh-CN', options);
}
showTodayDate();

// 从 localStorage 加载日记
let diaries = JSON.parse(localStorage.getItem('loveDiaries') || '[]');

// 显示日记列表
function displayDiaries() {
    diaryList.innerHTML = '';

    // 按日期分组
    const groupedDiaries = {};
    diaries.forEach(diary => {
        const dateKey = diary.date.split(' ')[0]; // 只取日期部分
        if (!groupedDiaries[dateKey]) {
            groupedDiaries[dateKey] = [];
        }
        groupedDiaries[dateKey].push(diary);
    });

    // 显示每个日期的日记
    Object.keys(groupedDiaries).sort((a, b) => new Date(b) - new Date(a)).forEach(dateKey => {
        const dayDiaries = groupedDiaries[dateKey];

        // 日期标题
        const dateHeader = document.createElement('div');
        dateHeader.className = 'diary-date-header';
        dateHeader.innerHTML = `<span class="date-title">📅 ${dateKey}</span><span class="diary-count">${dayDiaries.length} 条日记</span>`;
        diaryList.appendChild(dateHeader);

        // 该日期的所有日记
        dayDiaries.forEach(diary => {
            const entry = document.createElement('div');
            entry.className = 'diary-entry';
            entry.innerHTML = `
                <div class="diary-header">
                    <div class="diary-date">${diary.time || ''}</div>
                    <div class="diary-mood">${diary.mood}</div>
                </div>
                <div class="diary-author">来自: ${diary.author || '匿名'}</div>
                <div class="diary-content">${diary.content}</div>
            `;
            diaryList.appendChild(entry);
        });
    });

    // 如果没有日记，显示提示
    if (diaries.length === 0) {
        diaryList.innerHTML = `
            <div class="diary-empty">
                <div class="empty-icon">📝</div>
                <p>还没有日记，快来写下第一篇吧！</p>
            </div>
        `;
    }
}

// 初始显示日记
displayDiaries();

// 提交日记
diaryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(diaryForm);
    const content = formData.get('diaryContent');
    const author = formData.get('author');
    const mood = formData.get('mood');

    const now = new Date();
    const newDiary = {
        content: content,
        author: author,
        mood: mood,
        date: now.toLocaleDateString('zh-CN'),
        time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    diaries.unshift(newDiary);
    localStorage.setItem('loveDiaries', JSON.stringify(diaries));

    // 更新显示
    displayDiaries();

    // 清空表单
    diaryForm.reset();

    // 显示成功效果
    const btn = diaryForm.querySelector('.diary-btn');
    btn.innerHTML = '<span>✓</span><span>已保存！</span>';
    btn.style.background = 'linear-gradient(135deg, #a5d4a5, #a0c9a0)';

    setTimeout(() => {
        btn.innerHTML = '<span>✍️</span><span>写下今日心情</span>';
        btn.style.background = 'linear-gradient(135deg, #d4a5a5 0%, #c9a0a0 100%)';
    }, 2000);
});

// 音乐播放器功能
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');

// 播放/暂停
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        playBtn.textContent = '▶';
        musicPlayer.classList.remove('playing');
    } else {
        bgMusic.play();
        playBtn.textContent = '⏸';
        musicPlayer.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// 更新进度条
bgMusic.addEventListener('timeupdate', () => {
    const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
    progress.style.width = percent + '%';

    // 显示当前时间
    const minutes = Math.floor(bgMusic.currentTime / 60);
    const seconds = Math.floor(bgMusic.currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// 点击进度条跳转
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    bgMusic.currentTime = percent * bgMusic.duration;
});

// 音乐结束后重置
bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 0;
    progress.style.width = '0%';
    playBtn.textContent = '▶';
    musicPlayer.classList.remove('playing');
    isPlaying = false;
});

// 爱情清单功能
const wishlistForm = document.getElementById('wishlistForm');
const wishlistList = document.getElementById('wishlistList');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');

// 预设的甜蜜清单
const defaultWishes = [
    { text: '一起看一场电影', completed: false },
    { text: '一起去海边散步', completed: false },
    { text: '一起做一顿饭', completed: false },
    { text: '一起去旅游', completed: false },
    { text: '一起拍合照', completed: false },
    { text: '一起看日出', completed: false },
    { text: '一起过生日', completed: false },
    { text: '一起牵手逛街', completed: false }
];

// 从 localStorage 加载清单
let wishes = JSON.parse(localStorage.getItem('loveWishlist') || '[]');

// 如果没有清单，使用预设清单
if (wishes.length === 0) {
    wishes = defaultWishes;
    localStorage.setItem('loveWishlist', JSON.stringify(wishes));
}

// 更新进度
function updateProgress() {
    const total = wishes.length;
    const completed = wishes.filter(w => w.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    progressFill.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
    completedCount.textContent = completed;
    totalCount.textContent = total;
}

// 显示清单列表
function displayWishlist() {
    wishlistList.innerHTML = '';

    if (wishes.length === 0) {
        wishlistList.innerHTML = `
            <div class="wishlist-empty">
                <div class="wishlist-empty-icon">💌</div>
                <p>还没有甜蜜约定，快来添加吧！</p>
            </div>
        `;
    } else {
        wishes.forEach((wish, index) => {
            const item = document.createElement('div');
            item.className = `wishlist-item ${wish.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="wishlist-checkbox" data-index="${index}">
                    <span class="check-icon">✓</span>
                </div>
                <span class="wishlist-text">${wish.text}</span>
                <button class="wishlist-delete" data-index="${index}">×</button>
            `;
            wishlistList.appendChild(item);
        });
    }

    updateProgress();

    // 绑定点击事件
    document.querySelectorAll('.wishlist-checkbox').forEach(el => {
        el.addEventListener('click', toggleWish);
    });

    document.querySelectorAll('.wishlist-delete').forEach(el => {
        el.addEventListener('click', deleteWish);
    });
}

// 切换完成状态
function toggleWish(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    wishes[index].completed = !wishes[index].completed;
    localStorage.setItem('loveWishlist', JSON.stringify(wishes));
    displayWishlist();

    // 完成时的动画效果
    if (wishes[index].completed) {
        const item = wishlistList.children[index];
        item.style.animation = 'none';
        item.offsetHeight; // 触发重绘
        item.style.animation = 'fadeIn 0.5s ease';
    }
}

// 删除清单项
function deleteWish(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    wishes.splice(index, 1);
    localStorage.setItem('loveWishlist', JSON.stringify(wishes));
    displayWishlist();
}

// 添加新清单
wishlistForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(wishlistForm);
    const wishText = formData.get('wishItem');

    if (wishText.trim()) {
        wishes.push({
            text: wishText.trim(),
            completed: false
        });
        localStorage.setItem('loveWishlist', JSON.stringify(wishes));
        displayWishlist();
        wishlistForm.reset();

        // 显示添加成功效果
        const btn = wishlistForm.querySelector('.add-btn');
        btn.innerHTML = '<span>✓</span><span>已添加</span>';
        setTimeout(() => {
            btn.innerHTML = '<span>✨</span><span>添加</span>';
        }, 1500);
    }
});

// 初始显示清单
displayWishlist();

// 加载恋爱故事图片
function loadStoryImages() {
    const story1Grid = document.getElementById('story1Grid');
    const story2Grid = document.getElementById('story2Grid');
    const story3Grid = document.getElementById('story3Grid');

    // 恋爱小记2 (47张图片中的前部分)
    const story1Images = [];
    for (let i = 1; i <= 47; i++) {
        story1Images.push(`images/doc-images/image${i}.jpeg`);
    }

    // 随机选择图片展示
    const showImages = (grid, images, count) => {
        const selected = images.slice(0, Math.min(count, images.length));
        selected.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.onerror = () => img.style.display = 'none';
            img.addEventListener('click', () => {
                lightboxImg.src = src;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
            grid.appendChild(img);
        });
    };

    // 分配图片到三个故事区域
    showImages(story1Grid, story1Images.slice(0, 20), 12);
    showImages(story2Grid, story1Images.slice(20, 40), 12);
    showImages(story3Grid, story1Images.slice(40, 47), 5);
}

loadStoryImages();