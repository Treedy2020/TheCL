// 魔法粒子跟随效果
class ParticleEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'particle-canvas';
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.createParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.min(window.innerWidth / 10, 100);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, 0.8)`,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                maxSpeed: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        const { ctx, canvas } = this;
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                // 计算与鼠标的距离
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    // 在鼠标影响范围内，粒子受到推力
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    
                    particle.speedX += directionX * force * 0.2;
                    particle.speedY += directionY * force * 0.2;
                }
                
                // 限制最大速度
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > particle.maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * particle.maxSpeed;
                    particle.speedY = (particle.speedY / speed) * particle.maxSpeed;
                }
                
                // 应用阻力
                particle.speedX *= 0.96;
                particle.speedY *= 0.96;
                
                // 更新位置
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // 边界处理
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // 绘制粒子
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            requestAnimationFrame(render);
        };
        
        render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) { // 仅在大屏上启用
        new ParticleEffect();
    }
}); 