// 音波流动背景效果
class WaveEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'wave-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resizeCanvas();
        this.setupWaves();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setupWaves();
    }
    
    setupWaves() {
        this.waves = [];
        const colors = ['rgba(108, 92, 231, 0.1)', 'rgba(162, 155, 254, 0.1)', 'rgba(253, 121, 168, 0.1)'];
        
        for (let i = 0; i < 3; i++) {
            this.waves.push({
                color: colors[i],
                length: Math.random() * 150 + 200,
                amplitude: Math.random() * 25 + 10,
                speed: Math.random() * 0.02 + 0.01,
                offset: Math.random() * 500,
                points: Math.ceil(window.innerWidth / 10)
            });
        }
    }
    
    drawWave(wave, time) {
        const { ctx } = this;
        const height = this.canvas.height * 0.5;
        const width = this.canvas.width;
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let i = 0; i <= wave.points; i++) {
            const x = i * (width / wave.points);
            const y = height + Math.sin((i / wave.points * wave.length) + time * wave.speed + wave.offset) * wave.amplitude;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
    }
    
    animate() {
        const { ctx, canvas } = this;
        let time = 0;
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.waves.forEach(wave => {
                this.drawWave(wave, time);
            });
            
            time += 1;
            requestAnimationFrame(render);
        };
        
        render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WaveEffect();
}); 