// 高级声音可视化
document.addEventListener('DOMContentLoaded', function() {
    // 获取音频和Canvas元素
    const sharedAudio = document.getElementById('shared-audio');
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    
    // 创建音频上下文和分析器 - 延迟初始化
    let audioContext = null;
    let analyser = null;
    let source = null;
    let isConnected = false;
    let bufferLength;
    let dataArray;
    
    // 只有在需要时才初始化音频上下文
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 将音频上下文暴露给全局，供其他脚本调用
            window.audioVisualizerContext = audioContext;
            
            analyser = audioContext.createAnalyser();
            // 配置分析器 - 增加精度
            analyser.fftSize = 512; // 提高精度，原为256
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            console.log("Audio context initialized");
        }
        return audioContext;
    }
    
    // 粒子系统
    let particles = [];
    let particleCount = 100; // 增加粒子数量
    
    // 可视化模式
    let visualizationMode = 'particles'; // 默认为粒子模式
    const modes = ['wave', 'bars', 'circular', 'particles'];
    let animationId = null;
    
    // 颜色设置 - 增强色彩
    const gradientColors = {
        playing: [
            { stop: 0, color: 'rgba(0, 170, 255, 0.8)' },
            { stop: 0.5, color: 'rgba(113, 88, 255, 0.7)' },
            { stop: 1, color: 'rgba(219, 39, 119, 0.6)' }
        ],
        idle: [
            { stop: 0, color: 'rgba(66, 153, 225, 0.4)' },
            { stop: 0.5, color: 'rgba(113, 128, 150, 0.3)' },
            { stop: 1, color: 'rgba(160, 174, 192, 0.2)' }
        ]
    };
    
    // 改进音频连接逻辑
    function connectAudio() {
        if (!audioContext) {
            initAudioContext();
        }
        
        // 只在未连接状态下尝试连接
        if (!isConnected && audioContext) {
            try {
                source = audioContext.createMediaElementSource(sharedAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                isConnected = true;
                console.log("Audio connected successfully");
            } catch (e) {
                console.log('Error connecting audio:', e);
                
                // 特殊处理已连接的情况
                if (e.name === 'InvalidStateError') {
                    console.log('Audio element already connected. Using existing connection.');
                    isConnected = true;
                }
                
                // 处理CORS错误
                if (e.message && e.message.includes('CORS')) {
                    console.log('CORS error detected. Audio visualization may not work properly.');
                    
                    // 可视化器仍然会显示，但可能不会响应音频
                    drawStaticWave();
                }
            }
        }
        
        // 确保音频上下文处于运行状态
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    // 设置canvas尺寸
    function setupCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    // 创建渐变
    function createGradient(colorSet) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        colorSet.forEach(color => {
            gradient.addColorStop(color.stop, color.color);
        });
        return gradient;
    }
    
    // 初始化粒子
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 1,
                speed: Math.random() * 1 + 0.2,
                amplitude: Math.random() * 25 + 5,
                angle: Math.random() * Math.PI * 2,
                color: `hsla(${Math.random() * 60 + 200}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`
            });
        }
    }
    
    // 绘制提示文本
    function drawHint() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('音频可视化 - 点击更换效果', canvas.width / 2, canvas.height / 2);
    }
    
    // 波形可视化
    function drawWave() {
        analyser.getByteTimeDomainData(dataArray);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 设置波形样式
        ctx.lineWidth = 3;
        ctx.strokeStyle = createGradient(sharedAudio.paused ? gradientColors.idle : gradientColors.playing);
        
        ctx.beginPath();
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            // 将数据值（0-255）映射到画布高度
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        // 添加到画布底部的线，创建封闭路径
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.lineTo(0, canvas.height / 2);
        
        // 填充波形下方区域
        ctx.fillStyle = ctx.strokeStyle;
        ctx.globalAlpha = 0.1; // 低不透明度填充
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // 描边波形线
        ctx.stroke();
        
        // 添加反射效果
        ctx.save();
        ctx.scale(1, -1); // 翻转画布
        ctx.translate(0, -canvas.height); // 调整位置
        ctx.globalAlpha = 0.2; // 反射效果透明度
        ctx.strokeStyle = createGradient(sharedAudio.paused ? gradientColors.idle : gradientColors.playing);
        ctx.stroke();
        ctx.restore();
        
        // 添加光晕效果
        if (!sharedAudio.paused) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 153, 255, 0.5)';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    // 频谱柱状图可视化
    function drawBars() {
        analyser.getByteFrequencyData(dataArray);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / (bufferLength / 2.5);
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            // 让柱状图数据更有动态性
            const multiplier = 1 + Math.sin(i / 10) * 0.2;
            const barHeight = (dataArray[i] * multiplier) / 255 * canvas.height * 0.8;
            
            // 计算颜色 - 从蓝色到紫色到粉色的渐变
            const hue = 240 - (i / bufferLength) * 60;
            const saturation = 80 + (i / bufferLength) * 20;
            const lightness = 50 + (dataArray[i] / 255) * 30;
            
            ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${sharedAudio.paused ? 0.3 : 0.7})`;
            
            // 绘制圆角矩形
            roundRect(ctx, x, canvas.height - barHeight, barWidth * 0.8, barHeight, 4);
            
            x += barWidth;
        }
    }
    
    // 绘制圆角矩形
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
    
    // 圆形可视化
    function drawCircular() {
        analyser.getByteFrequencyData(dataArray);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        for (let i = 0; i < bufferLength; i++) {
            const amplitude = dataArray[i] / 255;
            const angle = (i / bufferLength) * Math.PI * 2;
            const innerRadius = radius * 0.4;
            const outerRadius = radius + amplitude * radius * 0.5;
            
            // 从内到外颜色渐变
            const hue = 200 + (i / bufferLength) * 120;
            const saturation = 70 + amplitude * 30;
            const lightness = 50 + amplitude * 20;
            const alpha = sharedAudio.paused ? 0.3 : (0.4 + amplitude * 0.4);
            
            ctx.beginPath();
            ctx.moveTo(
                innerRadius * Math.cos(angle),
                innerRadius * Math.sin(angle)
            );
            ctx.lineTo(
                outerRadius * Math.cos(angle),
                outerRadius * Math.sin(angle)
            );
            
            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // 添加光点
            if (amplitude > 0.5 && !sharedAudio.paused) {
                ctx.beginPath();
                ctx.arc(
                    outerRadius * Math.cos(angle),
                    outerRadius * Math.sin(angle),
                    2 + amplitude * 3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `hsla(${hue}, 100%, 80%, 0.8)`;
                ctx.fill();
            }
        }
        
        // 添加中心光环
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = createGradient(sharedAudio.paused ? gradientColors.idle : gradientColors.playing);
        ctx.stroke();
        
        ctx.restore();
    }
    
    // 粒子可视化
    function drawParticles() {
        analyser.getByteFrequencyData(dataArray);
        
        // 计算音频活跃度 - 所有频率的平均值
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength / 255; // 0-1之间的值
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制每个粒子
        particles.forEach((p, index) => {
            // 从音频数据中获取对应频率的幅度
            const frequencyBand = Math.floor((index / particles.length) * bufferLength);
            const freqValue = dataArray[frequencyBand] / 255; // 0-1之间的值
            
            // 更新粒子位置 - 添加由音频驱动的运动
            p.angle += p.speed * (0.01 + average * 0.05);
            p.y += Math.sin(p.angle) * p.amplitude * (average * 0.5 + 0.5);
            p.x += Math.cos(p.angle) * p.amplitude * 0.05;
            
            // 边界检查
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // 粒子大小受音频影响
            const size = p.size * (1 + freqValue * 2);
            
            // 绘制粒子
            ctx.beginPath();
            // 使用径向渐变使粒子发光
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
            const alpha = sharedAudio.paused ? 0.3 : (0.4 + freqValue * 0.6);
            
            // 解析HSL颜色
            const baseHue = parseInt(p.color.match(/hsla\((\d+)/)[1]);
            const hue = baseHue + freqValue * 30; // 根据音频改变色调
            
            gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, ${alpha})`);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // 如果音频很活跃，添加连接线
            if (average > 0.4 && !sharedAudio.paused) {
                particles.forEach((p2, j) => {
                    if (j <= index) return; // 避免重复连接
                    
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100) * 0.2 * average})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            }
        });
    }
    
    // 可视化循环
    function visualize() {
        if (!audioContext) {
            return;
        }
        
        animationId = requestAnimationFrame(visualize);
        
        // 获取音频数据
        analyser.getByteFrequencyData(dataArray);
        
        // 计算平均频率值，检测是否都是0（CORS失败的表现）
        let sum = 0;
        let allZeros = true;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
            if (dataArray[i] > 0) {
                allZeros = false;
            }
        }
        
        // 如果播放中但检测到所有频率数据都是0，可能是CORS问题
        if (!sharedAudio.paused && allZeros && isConnected) {
            // 使用替代可视化方法
            useBackupVisualization();
            return;
        }
        
        // 正常渲染可视化
        switch (visualizationMode) {
            case 'wave':
                drawWave();
                break;
            case 'bars':
                drawBars();
                break;
            case 'circular':
                drawCircular();
                break;
            case 'particles':
                drawParticles();
                break;
            default:
                drawParticles();
        }
    }
    
    // 备用可视化方法
    function useBackupVisualization() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 创建一个简单的动画效果，不依赖音频数据
        const time = Date.now() * 0.001;
        const centerY = canvas.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let x = 0; x < canvas.width; x++) {
            // 使用时间创建波形动画
            const y = centerY + Math.sin(x * 0.01 + time * 2) * 20;
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 添加提示文本
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('音频正在播放 (可视化受限)', canvas.width / 2, 20);
    }
    
    // 切换可视化模式
    canvas.addEventListener('click', function() {
        const currentIndex = modes.indexOf(visualizationMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        visualizationMode = modes[nextIndex];
        
        // 如果切换到粒子模式，初始化粒子
        if (visualizationMode === 'particles') {
            initParticles();
        }
    });
    
    // 播放按钮点击事件 - 确保元素存在
    const playBtn = document.getElementById('shared-play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            connectAudio(); // 确保音频已连接
            // 音频在tabs.js中控制播放/暂停
        });
    } else {
        console.warn('未找到播放按钮元素');
    }
    
    // 添加其他按钮事件监听器 - 确保元素存在
    const sampleBtn = document.getElementById('sample-voice-btn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', function() {
            connectAudio(); // 确保音频已连接
            // 示例音频在tabs.js中控制
        });
    }
    
    const generateBtn = document.getElementById('generate-voice');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            connectAudio(); // 确保音频已连接
        });
    }
    
    // 播放或暂停时更新可视化效果
    sharedAudio.addEventListener('play', function() {
        // 确保音频上下文已初始化
        connectAudio();
        
        // 确保再次检查连接是否成功
        if (audioContext) {
            // 开始可视化
            if (!animationId) {
                visualize();
            }
        }
        
        // 添加播放状态样式
        document.querySelector('.player-controls').classList.add('playing');
    });
    
    sharedAudio.addEventListener('pause', function() {
        // 移除播放状态样式
        document.querySelector('.player-controls').classList.remove('playing');
        // 不停止动画，保持视觉效果，但会因为音频暂停而减弱强度
    });
    
    // 修改音频源变化处理程序 - 添加null检查
    sharedAudio.addEventListener('loadeddata', function() {
        // 先检查audioContext是否已初始化
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        setupCanvas();
        if (visualizationMode === 'particles') {
            initParticles();
        }
    });
    
    // 初始设置 - 不要立即连接音频
    setupCanvas();
    initParticles();
    drawStaticWave(); // 绘制静态效果直到播放开始
});

// 绘制静态波形函数
function drawStaticWave() {
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    const center = canvas.height / 2;
    const amplitude = canvas.height * 0.05;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, center);
    
    for (let i = 0; i < canvas.width; i++) {
        // 生成低振幅的正弦波
        const y = center + Math.sin(i * 0.05) * amplitude;
        ctx.lineTo(i, y);
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
}