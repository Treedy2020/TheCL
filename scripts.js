// 使用配置数据填充个人信息
document.addEventListener('DOMContentLoaded', function() {
    // 填充个人资料
    if (voiceActorData && voiceActorData.profile) {
        const profile = voiceActorData.profile;
        document.getElementById('profile-intro').textContent = 
            `我是${profile.name}，专业独立声优，拥有超过${profile.years}的配音经验。曾为多部知名${profile.specialties.join('、')}献声。`;
        
        document.getElementById('profile-characteristics').textContent = 
            `我的声线特点是${profile.voiceCharacteristics}。`;
        
        document.getElementById('profile-languages').textContent = 
            `除了${profile.languages[0]}母语，我还能提供${profile.languages.slice(1).join('和')}的配音服务，满足国际项目的需求。`;
    }
    
    // 生成作品列表
    generateWorks();
    
    // 生成年份导航
    generateYearNavigation();
    
    // 初始化动画
    initializeAnimations();
    
    // 设置平滑滚动
    setupSmoothScrolling();
    
    // 设置表单提交事件
    setupFormSubmit();
    
    // 添加页面过渡效果
    setupPageTransitions();
    
    // 生成类型导航（可选）
    generateTypeNavigation();
});

// 生成年份导航
function generateYearNavigation() {
    if (!voiceActorData || !voiceActorData.works) return;
    
    const yearsSet = new Set();
    voiceActorData.works.forEach(work => yearsSet.add(work.year));
    
    // 将年份数组排序（降序）
    const years = Array.from(yearsSet).sort((a, b) => b - a);
    
    const yearNav = document.querySelector('.year-navigation');
    
    // 添加"全部"按钮
    const allBtn = document.createElement('button');
    allBtn.classList.add('year-btn', 'active');
    allBtn.setAttribute('data-year', 'all');
    allBtn.textContent = '全部';
    yearNav.appendChild(allBtn);
    
    // 添加年份按钮
    years.forEach(year => {
        const yearBtn = document.createElement('button');
        yearBtn.classList.add('year-btn');
        yearBtn.setAttribute('data-year', year);
        yearBtn.textContent = year;
        yearNav.appendChild(yearBtn);
    });
    
    // 添加年份按钮点击事件
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            
            // 更新活跃状态
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品
            filterWorksByYear(year);
        });
    });
}

// 根据年份筛选作品
function filterWorksByYear(year) {
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
        const itemYear = item.getAttribute('data-year');
        
        if (year === 'all' || itemYear === year) {
            // 显示匹配的项目，并添加二阶跳动特效
            item.classList.remove('hidden');
            setTimeout(() => {
                item.classList.add('visible');
                // 添加二阶跳动动画
                item.classList.add('second-jump');
                // 动画结束后移除动画类
                setTimeout(() => {
                    item.classList.remove('second-jump');
                }, 1000);
            }, 50);
        } else {
            // 隐藏不匹配的项目
            item.classList.remove('visible', 'second-jump');
            item.classList.add('hidden');
        }
    });
}

// 生成作品列表
function generateWorks() {
    if (!voiceActorData || !voiceActorData.works) return;
    
    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = ''; // 清空原有内容
    
    voiceActorData.works.forEach(work => {
        const workItem = document.createElement('div');
        workItem.classList.add('work-item', 'visible');
        workItem.setAttribute('data-year', work.year);
        workItem.setAttribute('data-type', work.type); // 添加类型属性
        
        // 处理特殊标记
        let specialMark = '';
        if (work.description && work.description.includes('🔥')) {
            specialMark = '<span class="special-mark popular-mark">🔥</span>';
        } else if (work.description && work.description.includes('👑')) {
            specialMark = '<span class="special-mark official-mark">👑</span>';
        }
        
        // 创建链接按钮HTML
        const linkButtonHTML = work.link ? 
            `<div class="work-link-container">
                <a href="${work.link}" class="work-link" target="_blank">
                    <span>${work.linkText || '了解更多'}</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>` : '';
        
        workItem.innerHTML = `
            <div class="work-date">
                <span>${work.year}</span>
            </div>
            <div class="work-content">
                <div class="work-tag ${work.type}">${work.typeName}${specialMark}</div>
                <h3>${work.title}</h3>
                <div class="work-details">
                    <div class="work-image">
                        <img src="${work.image}" alt="${work.title}" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=图片加载中'">
                        ${work.link ? `<div class="image-overlay">
                            <a href="${work.link}" target="_blank" class="view-button">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>` : ''}
                    </div>
                    <div class="work-description">
                        <p>配音角色：${work.role}</p>
                        <p>作品简介：${work.description.replace(/[🔥👑]/g, '')}</p>
                        <p>${work.details}</p>
                        ${linkButtonHTML}
                    </div>
                </div>
            </div>
        `;
        
        timeline.appendChild(workItem);
        
        // 为整个卡片添加点击事件（可选）
        if (work.link) {
            const workContent = workItem.querySelector('.work-content');
            workContent.classList.add('clickable');
            
            workContent.addEventListener('click', e => {
                // 确保不是点击在已有的链接或按钮上
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    window.open(work.link, '_blank');
                }
            });
        } else {
            // 对于没有外部链接的作品，点击显示详情模态框
            const workContent = workItem.querySelector('.work-content');
            workContent.classList.add('clickable');
            
            workContent.addEventListener('click', e => {
                // 确保不是点击在已有的链接或按钮上
                if (!e.target.closest('a') && !e.target.closest('button')) {
                    showWorkDetail(work);
                }
            });
        }
    });
    
    // 添加3D卡片效果
    setupCardHoverEffects();
}

// 初始化动画
function initializeAnimations() {
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // 触发初始滚动检查
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 200);
}

// 滚动动画
window.addEventListener('scroll', function() {
    const workItems = document.querySelectorAll('.work-item:not(.hidden)');
    const scrollPosition = window.scrollY + window.innerHeight * 0.8;
    
    workItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top + window.scrollY;
        
        if (scrollPosition > itemPosition) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
});

// 设置平滑滚动
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 设置表单提交事件
function setupFormSubmit() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我会尽快回复。');
            this.reset();
        });
    }
}

function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.work-content');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardHover);
        card.addEventListener('mouseleave', resetCardPosition);
    });
    
    function handleCardHover(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算旋转角度
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 5; // 最大5度
        const rotateX = ((centerY - y) / centerY) * 5; // 最大5度
        
        // 应用变换
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
        
        // 添加光影效果
        const gradientStrength = 0.1;
        card.style.background = `linear-gradient(
            ${135 + (x / rect.width) * 30}deg,
            rgba(255, 255, 255, ${gradientStrength + (y / rect.height) * 0.1}),
            rgba(255, 255, 255, 0) 60%
        ), white`;
        
        // 添加悬停光晕效果到图片
        const image = card.querySelector('.work-image img');
        if (image) {
            image.style.boxShadow = `
                0 ${10 - (y / rect.height) * 20}px 20px rgba(0, 0, 0, 0.1),
                ${(x / rect.width) * 10 - 5}px 0 15px rgba(0, 0, 0, 0.05)
            `;
        }
        
        // 链接按钮悬浮效果
        const linkBtn = card.querySelector('.work-link');
        if (linkBtn) {
            linkBtn.style.transform = `translateZ(30px)`;
        }
    }
    
    function resetCardPosition() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        this.style.background = 'white';
        this.style.transition = 'transform 0.5s ease, background 0.5s ease';
        
        const image = this.querySelector('.work-image img');
        if (image) {
            image.style.boxShadow = 'none';
            image.style.transition = 'box-shadow 0.5s ease';
        }
    }
}

// 在scripts.js中添加页面过渡代码
function setupPageTransitions() {
    // 为需要动画的元素添加类
    const animatedElements = [
        ...document.querySelectorAll('h1, h2, .hero-content p, .about-content > div, .year-navigation, .contact-content > div')
    ];
    
    // 添加初始类
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in-element');
        el.classList.add(`fade-delay-${Math.min(index % 5 + 1, 5)}`);
    });
    
    // 设置交叉观察器，当元素进入视口时添加可见类
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一旦显示，不再观察
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 观察所有动画元素
    animatedElements.forEach(el => observer.observe(el));
}

// 初始化作品详情对话框
function setupWorkDetailModal() {
    // 创建模态对话框元素
    const modal = document.createElement('div');
    modal.className = 'work-detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 添加关闭事件
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
    
    // 点击模态对话框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    // 按ESC关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    return modal;
}

// 显示作品详情
function showWorkDetail(work) {
    const modal = document.querySelector('.work-detail-modal') || setupWorkDetailModal();
    const modalBody = modal.querySelector('.modal-body');
    
    // 填充内容
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-tag ${work.type}">${work.typeName}</div>
            <h2>${work.title}</h2>
            <div class="modal-year">${work.year}</div>
        </div>
        <div class="modal-image">
            <img src="${work.image}" alt="${work.title}" loading="lazy">
        </div>
        <div class="modal-info">
            <div class="info-item">
                <h3>配音角色</h3>
                <p>${work.role}</p>
            </div>
            <div class="info-item">
                <h3>作品简介</h3>
                <p>${work.description}</p>
            </div>
            <div class="info-item">
                <h3>角色详情</h3>
                <p>${work.details}</p>
            </div>
            ${work.link ? `
            <div class="modal-actions">
                <a href="${work.link}" class="modal-link" target="_blank">
                    ${work.linkText || '访问作品'}
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>` : ''}
        </div>
    `;
    
    // 显示模态对话框
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

// 添加一个按类型筛选的功能（可选）
function generateTypeNavigation() {
    if (!voiceActorData || !voiceActorData.works) return;
    
    const typesSet = new Set();
    voiceActorData.works.forEach(work => typesSet.add(work.type));
    
    // 将类型数组转换为对象，包含类型ID和显示名称
    const types = Array.from(typesSet).map(type => {
        const work = voiceActorData.works.find(w => w.type === type);
        return {
            id: type,
            name: work ? work.typeName : type
        };
    });
    
    const typeNav = document.createElement('div');
    typeNav.className = 'type-navigation';
    
    // 添加"全部"按钮
    const allBtn = document.createElement('button');
    allBtn.classList.add('type-btn', 'active');
    allBtn.setAttribute('data-type', 'all');
    allBtn.textContent = '全部类型';
    typeNav.appendChild(allBtn);
    
    // 添加类型按钮
    types.forEach(type => {
        const typeBtn = document.createElement('button');
        typeBtn.classList.add('type-btn', type.id);
        typeBtn.setAttribute('data-type', type.id);
        typeBtn.textContent = type.name;
        typeNav.appendChild(typeBtn);
    });
    
    // 将导航插入到年份导航之后
    const yearNav = document.querySelector('.year-navigation');
    if (yearNav && yearNav.parentNode) {
        yearNav.parentNode.insertBefore(typeNav, yearNav.nextSibling);
    }
    
    // 添加类型按钮点击事件
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // 更新活跃状态
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选作品
            filterWorksByType(type);
        });
    });
}

// 根据类型筛选作品
function filterWorksByType(type) {
    const workItems = document.querySelectorAll('.work-item');
    
    workItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        
        if (type === 'all' || itemType === type) {
            // 显示匹配的项目
            item.classList.remove('hidden');
            
            // 添加二阶跳动特效
            setTimeout(() => {
                item.classList.add('second-jump');
                setTimeout(() => {
                    item.classList.remove('second-jump');
                }, 1000);
            }, 50);
        } else {
            // 隐藏不匹配的项目
            item.classList.add('hidden');
        }
    });
} 