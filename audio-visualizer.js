// 音频可视化效果
class AudioVisualizer {
    constructor() {
        this.audioElement = document.getElementById('voice-sample');
        if (!this.audioElement) return;
        
        this.playButton = document.getElementById('play-btn');
        this.canvas = document.getElementById('audio-visualizer');
        this.progressBar = document.querySelector('.progress-bar');
        this.timeDisplay = document.querySelector('.time-display');
        this.ctx = this.canvas.getContext('2d');
        
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.animationId = null;
        this.isPlaying = false;
        
        this.setupEventListeners();
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = 80;
    }
    
    setupEventListeners() {
        this.playButton.addEventListener('click', () => {
            if (!this.audioContext) {
                this.initAudio();
            }
            
            if (this.isPlaying) {
                this.audioElement.pause();
                this.playButton.innerHTML = '<i class="fas fa-play"></i>';
                this.isPlaying = false;
                cancelAnimationFrame(this.animationId);
            } else {
                this.audioElement.play();
                this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
                this.isPlaying = true;
                this.visualize();
            }
        });
        
        this.audioElement.addEventListener('ended', () => {
            this.playButton.innerHTML = '<i class="fas fa-play"></i>';
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
        });
        
        this.audioElement.addEventListener('timeupdate', () => {
            const current = this.audioElement.currentTime;
            const duration = this.audioElement.duration || 1;
            const progressPercent = (current / duration) * 100;
            this.progressBar.style.width = `${progressPercent}%`;
            
            // 更新时间显示
            const currentMin = Math.floor(current / 60);
            const currentSec = Math.floor(current % 60);
            this.timeDisplay.textContent = `${currentMin.toString().padStart(2, '0')}:${currentSec.toString().padStart(2, '0')}`;
        });
    }
    
    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
    }
    
    visualize() {
        if (!this.isPlaying) return;
        
        this.analyser.getByteFrequencyData(this.dataArray);
        this.drawVisualizer();
        
        this.animationId = requestAnimationFrame(() => this.visualize());
    }
    
    drawVisualizer() {
        const { ctx, canvas, dataArray } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / dataArray.length * 2.5;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
            
            // 创建基于高度的渐变色
            const hue = 250 + (i / dataArray.length) * 60; // 从紫色到蓝色
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.7)`;
            
            // 绘制圆角柱状
            this.drawRoundedBar(x, canvas.height - barHeight, barWidth - 1, barHeight, 4);
            
            x += barWidth;
        }
    }
    
    drawRoundedBar(x, y, width, height, radius) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioVisualizer();
}); 