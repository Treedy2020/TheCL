// 滚动视差效果
class ParallaxScroll {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.images = document.querySelectorAll('.work-image img');
        
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll(); // 初始化
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // 为每个部分添加视差效果
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const distanceFromTop = scrollTop - sectionTop;
            
            if (distanceFromTop > -window.innerHeight && distanceFromTop < sectionHeight) {
                const title = section.querySelector('.section-title');
                if (title) {
                    title.style.transform = `translateY(${distanceFromTop * 0.1}px)`;
                    title.style.opacity = 1 - Math.abs(distanceFromTop) / (window.innerHeight / 2);
                }
            }
        });
        
        // 为作品图片添加视差效果
        this.images.forEach(img => {
            const card = img.closest('.work-item');
            if (!card) return;
            
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            const windowCenter = scrollTop + window.innerHeight / 2;
            const cardCenter = cardTop + cardHeight / 2;
            const distanceFromCenter = windowCenter - cardCenter;
            
            // 只在可见范围内应用视差
            if (Math.abs(distanceFromCenter) < window.innerHeight) {
                img.style.transform = `translateY(${distanceFromCenter * 0.03}px) scale(${1 + Math.abs(distanceFromCenter) * 0.0001})`;
            }
        });
        
        // 为英雄区域添加视差背景
        const hero = document.querySelector('#hero');
        if (hero) {
            hero.style.backgroundPositionY = `${scrollTop * 0.5}px`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxScroll();
}); 