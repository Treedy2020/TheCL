// 播放器控制和音频可视化
document.addEventListener('DOMContentLoaded', function() {
    // 播放器元素
    const sharedAudio = document.getElementById('shared-audio');
    const sharedPlayBtn = document.getElementById('shared-play-btn');
    const timeDisplay = document.querySelector('.time-display');
    const sampleVoiceBtn = document.getElementById('sample-voice-btn');
    const downloadLink = document.getElementById('download-link');
    
    // 状态变量
    let isPlaying = false;
    let currentAudioSource = ''; // Initialize with no source
    const sampleAudioPath = 'public/audio.wav'; // 个人示例音频路径
    
    // 停止任何正在播放的音频
    function stopAudio() {
        if (isPlaying) {
            sharedAudio.pause();
            sharedAudio.currentTime = 0; // 重置到开始位置
            // Update button state via audioPlayerInfo
            if (window.audioPlayerInfo) {
                window.audioPlayerInfo.updatePlayState(false);
            }
            isPlaying = false; // Update local state *after* calling updatePlayState
        }
    }
    
    // 设置播放器为示例音频 - ONLY called by sample button
    function setPlayerToSample() {
        // 先停止当前播放
        stopAudio();
        
        // Set source only if it's not already the sample
        if (currentAudioSource !== sampleAudioPath) {
            sharedAudio.src = sampleAudioPath;
            sharedAudio.load(); // Load the new source
            currentAudioSource = sampleAudioPath;
            downloadLink.href = sampleAudioPath; // Update download link for sample
            downloadLink.style.display = 'inline-flex'; // Make sure download is visible for sample
            timeDisplay.textContent = formatTime(0); // Reset time display
        }
    }
    
    // 格式化时间显示 (秒 -> MM:SS)
    function formatTime(seconds) {
        // Handle potential NaN or Infinity
        if (!isFinite(seconds)) {
            return '00:00';
        }
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 更新时间显示
    function updateTimeDisplay() {
        // Only update if duration is valid
        if (sharedAudio.duration && isFinite(sharedAudio.duration)) {
            timeDisplay.textContent = formatTime(sharedAudio.currentTime);
        } else {
            timeDisplay.textContent = '00:00'; // Default if no valid duration
        }
    }
    
    // 示例按钮点击事件
    sampleVoiceBtn.addEventListener('click', function() {
        // If playing the sample, stop it.
        if (isPlaying && currentAudioSource === sampleAudioPath) {
            stopAudio();
            return;
        }
        
        // Set player to sample source
        setPlayerToSample();
        
        // Attempt to play
        sharedAudio.play().then(() => {
            isPlaying = true;
            if (window.audioPlayerInfo) {
                window.audioPlayerInfo.updatePlayState(true);
            }
        }).catch(err => {
            console.error("Sample play failed:", err);
            isPlaying = false;
            if (window.audioPlayerInfo) {
                window.audioPlayerInfo.updatePlayState(false);
            }
        });
    });
    
    // 播放/暂停控制
    sharedPlayBtn.addEventListener('click', function() {
        // Get the src attribute value directly
        const currentSrc = sharedAudio.getAttribute('src');

        // More robust check: Check if src is null, empty string, or the page URL itself
        if (!currentSrc || currentSrc === '' || currentSrc === window.location.href) {
             console.warn("Play button clicked, but no valid audio source is set. Current src attribute:", currentSrc);
             // Optionally, provide visual feedback to the user here (e.g., shake the button)
             return; // Stop execution, do not attempt to play
        }

        // --- Existing Play/Pause Logic ---
        if (isPlaying) {
            sharedAudio.pause(); // Pause directly
            // Let the 'pause' event handler update the state via audioPlayerInfo
        } else {
            // Resume or start playing
            sharedAudio.play().then(() => {
                 // Let the 'play' event handler update the state via audioPlayerInfo
            }).catch(err => {
                console.error("Play failed:", err);
                // Ensure state is updated if play fails
                isPlaying = false;
                if (window.audioPlayerInfo) {
                    window.audioPlayerInfo.updatePlayState(false);
                }
            });
        }
    });
    
    // --- Event Listeners for Audio Element ---
    
    sharedAudio.addEventListener('play', () => {
        isPlaying = true;
        if (window.audioPlayerInfo) {
            window.audioPlayerInfo.updatePlayState(true);
        }
        // Connect visualizer if needed
        if (window.audioVisualizerContext && window.audioVisualizerContext.state === 'suspended') {
            window.audioVisualizerContext.resume();
        }
        if (typeof connectAudio === 'function') { // Check if visualizer function exists
            connectAudio();
        }
    });
    
    sharedAudio.addEventListener('pause', () => {
        isPlaying = false;
        if (window.audioPlayerInfo) {
            window.audioPlayerInfo.updatePlayState(false);
        }
    });
    
    sharedAudio.addEventListener('ended', () => {
        isPlaying = false;
        if (window.audioPlayerInfo) {
            window.audioPlayerInfo.updatePlayState(false);
        }
        // Optionally reset time display, or let it show the end time
        // timeDisplay.textContent = formatTime(0);
    });
    
    sharedAudio.addEventListener('timeupdate', updateTimeDisplay);
    
    sharedAudio.addEventListener('loadedmetadata', function() {
        updateTimeDisplay(); // Update time display once metadata is loaded
    });
    
    sharedAudio.addEventListener('error', (e) => {
        console.error("Audio Error:", sharedAudio.error);
        stopAudio(); // Stop playback on error
        timeDisplay.textContent = 'Error';
        // Maybe disable play button or show an error message
    });
    
    // --- Initialization ---
    // Don't load sample initially
    timeDisplay.textContent = '00:00';
    downloadLink.removeAttribute('href'); // No download initially
    downloadLink.style.display = 'none'; // Hide download link initially
    
    // --- window.audioPlayerInfo ---
    // (Keep existing functions: isPlaying, getCurrentSource, stopAudio)
    
    // Add播放状态切换逻辑
    function togglePlayState(playing) {
        if (sharedPlayBtn) {
            if (playing) {
                sharedPlayBtn.classList.add('playing');
                sharedPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                sharedPlayBtn.classList.remove('playing');
                sharedPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }
    
    window.audioPlayerInfo = {
        isPlaying: () => isPlaying,
        getCurrentSource: () => currentAudioSource,
        setAudioSource: (src) => {
            // If trying to set the same source, do nothing unless it's paused
            if (currentAudioSource === src && sharedAudio.currentTime > 0 && !sharedAudio.paused) {
                 console.log("Audio source already set and playing:", src);
                 return;
            }
            
            console.log("Setting audio source:", src);
            stopAudio(); // Stop current playback before setting new source
            
            sharedAudio.src = src;
            sharedAudio.load(); // Important: load the new source
            currentAudioSource = src;
            downloadLink.href = src; // Update download link
            downloadLink.style.display = 'inline-flex'; // Show download link
            timeDisplay.textContent = '00:00'; // Reset time display
            
            // Reset visualizer or handle potential CORS issues if necessary
            if (src.startsWith('http') && typeof useBackupVisualization === 'function') {
                // Reset CORS flag if visualizer handles it
            }
        },
        updatePlayState: (playing) => {
            // This function primarily updates the button UI
            togglePlayState(playing);
            // Note: The actual isPlaying state is now managed by 'play'/'pause' event listeners
        },
        stopAudio: () => { // Make sure this is exposed correctly
            stopAudio();
        }
    };
}); 