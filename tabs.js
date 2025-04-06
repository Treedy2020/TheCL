// 处理标签页切换逻辑
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const sharedAudio = document.getElementById('shared-audio');
    const sharedPlayBtn = document.getElementById('shared-play-btn');
    const sampleVoiceBtn = document.getElementById('sample-voice-btn');
    const downloadLink = document.getElementById('download-link');
    
    let isPlaying = false;
    let currentAudioSource = '';
    const sampleAudioPath = 'public/audio.wav'; // 个人示例音频路径
    
    // 标签切换事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabTarget = this.getAttribute('data-tab');
            
            // 更新按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新内容面板
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabTarget + '-tab') {
                    pane.classList.add('active');
                }
            });
            
            // 如果切换到关于我标签，默认设置示例音频
            if (tabTarget === 'profile') {
                resetPlayerForSample();
            }
        });
    });
    
    // 设置播放器为示例音频
    function resetPlayerForSample() {
        if (currentAudioSource !== sampleAudioPath) {
            sharedAudio.src = sampleAudioPath;
            currentAudioSource = sampleAudioPath;
            sharedAudio.pause();
            isPlaying = false;
            sharedPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            downloadLink.href = sampleAudioPath;
        }
    }
    
    // 示例按钮点击事件
    sampleVoiceBtn.addEventListener('click', function() {
        resetPlayerForSample();
        sharedAudio.play();
        sharedPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    });
    
    // 播放/暂停控制
    sharedPlayBtn.addEventListener('click', function() {
        if (isPlaying) {
            sharedAudio.pause();
            sharedPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            sharedAudio.play();
            sharedPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });
    
    // 音频结束事件
    sharedAudio.addEventListener('ended', function() {
        sharedPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    });
    
    // 初始化为示例音频
    resetPlayerForSample();
}); 