// AI 试音功能实现
document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const voiceTextarea = document.getElementById('voice-text');
  const charCount = document.getElementById('char-count');
  const generateBtn = document.getElementById('generate-voice');
  const voiceOptions = document.querySelectorAll('.voice-option');
  const resultStatus = document.getElementById('result-status');
  const playerContainer = document.getElementById('audio-player');
  const resultAudio = document.getElementById('shared-audio');
  const requestsLeft = document.getElementById('requests-left');
  const cooldownTimer = document.getElementById('cooldown-timer');

  // 变量初始化
  let requestCount = 0;
  let cooldownEndTime = 0;
  let cooldownInterval = null;

  // 从localStorage加载请求计数和冷却时间
  function loadRequestData() {
    const savedData = localStorage.getItem('aiVoiceRequests');
    if (savedData) {
      const data = JSON.parse(savedData);
      requestCount = data.count || 0;
      cooldownEndTime = data.cooldownEnd || 0;

      // 检查是否仍在冷却期
      const now = new Date().getTime();
      if (cooldownEndTime > now) {
        startCooldownTimer(cooldownEndTime);
      } else if (requestCount >= 5) {
        // 如果冷却已结束但计数未重置，重置计数
        resetRequestCount();
      } else {
        updateRequestsLeft();
      }
    } else {
      resetRequestCount();
    }
  }

  // 保存请求数据到localStorage
  function saveRequestData() {
    const data = {
      count: requestCount,
      cooldownEnd: cooldownEndTime
    };
    localStorage.setItem('aiVoiceRequests', JSON.stringify(data));
  }

  // 更新剩余请求次数显示
  function updateRequestsLeft() {
    const left = 5 - requestCount;
    requestsLeft.textContent = `剩余请求次数: ${left}`;
  }

  // 重置请求计数
  function resetRequestCount() {
    requestCount = 0;
    cooldownEndTime = 0;
    clearInterval(cooldownInterval);
    cooldownTimer.textContent = '';
    updateRequestsLeft();
    saveRequestData();
    checkTextValidity();
  }

  // 启动冷却定时器
  function startCooldownTimer(endTime) {
    // 立即禁用生成按钮
    generateBtn.disabled = true;
    cooldownEndTime = endTime; // Ensure cooldownEndTime is set immediately

    function updateTimer() {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        clearInterval(cooldownInterval);
        cooldownTimer.textContent = '';
        // Cooldown finished, reset count and re-check validity
        resetRequestCount(); // This will also save data and update UI
        checkTextValidity(); // Re-enable button if text is valid
      } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        cooldownTimer.textContent = `冷却时间: ${minutes}分${seconds.toString().padStart(2, '0')}秒`;
        // Keep button disabled during cooldown
        generateBtn.disabled = true;
      }
    }

    // Clear any existing timer before starting a new one
    clearInterval(cooldownInterval);
    updateTimer(); // Run immediately
    cooldownInterval = setInterval(updateTimer, 1000);
  }

  // 增加请求计数，如果达到限制则启动冷却
  function incrementRequestCount() {
    requestCount++;

    if (requestCount >= 5) {
      const now = new Date().getTime();
      cooldownEndTime = now + (30 * 60 * 1000); // 30分钟冷却
      startCooldownTimer(cooldownEndTime);
    }

    updateRequestsLeft();
    saveRequestData();
  }

  // 检查文本有效性并更新按钮状态
  function checkTextValidity() {
    const text = voiceTextarea.value.trim();
    const isValidLength = text.length >= 20 && text.length <= 300;
    const now = new Date().getTime();
    const isCoolingDown = cooldownEndTime > now;

    // 更新字符计数
    charCount.textContent = text.length;

    // 只有在长度有效且不在冷却期时才启用按钮
    if (isValidLength && !isCoolingDown) {
      generateBtn.disabled = false;
    } else {
      generateBtn.disabled = true;
    }
  }

  // 设置初始状态
  function setInitialState() {
    if (resultStatus) {
      resultStatus.innerHTML = '在上方输入文本，点击"生成试音"按钮<br>体验AI声音合成';
      resultStatus.className = 'result-status';
    }
  }

  // 生成语音
  async function generateVoice() {
    const text = voiceTextarea.value.trim();

    // 显示加载状态
    generateBtn.classList.add('loading');
    resultStatus.textContent = '正在生成语音，请稍候...';
    resultStatus.className = 'result-status';
    playerContainer.classList.add('generating');
    
    // 添加倒计时提示
    let timeLeft = 30;
    const timerElement = document.getElementById('generation-timer');
    timerElement.textContent = `预计需要 ${timeLeft} 秒`;
    
    const countdownTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        timerElement.textContent = '生成中，即将完成...';
      } else {
        timerElement.textContent = `预计需要 ${timeLeft} 秒`;
      }
    }, 1000);
    
    try {
      const apiUrl = 'http://localhost:8000/clone';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          speaker_id: 'S_pA3TM7Qn1'
        })
      });
      
      // 处理请求限制逻辑
      updateRequestCounter();
      
      // 检查响应
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 使用原始URL，不进行代理
      const audioUrl = data.public_url;
      
      // 显示成功结果
      resultStatus.textContent = '语音生成成功！点击播放按钮收听。';
      resultStatus.className = 'result-status success';
      
      // 停止之前的播放
      if (window.audioPlayerInfo && window.audioPlayerInfo.isPlaying()) {
        window.audioPlayerInfo.stopAudio();
      }
      
      // 设置音频源
      if (window.audioPlayerInfo) {
        window.audioPlayerInfo.setAudioSource(audioUrl);
        
        // 延迟一点再播放，避免重复播放问题
        setTimeout(() => {
          if (resultAudio) {
            resultAudio.play().then(() => {
              window.audioPlayerInfo.updatePlayState(true);
            }).catch(err => {
              console.log('自动播放失败:', err);
              window.audioPlayerInfo.updatePlayState(false);
            });
          }
        }, 100);
      }

    } catch (error) {
      console.error('生成语音出错:', error);
      resultStatus.textContent = `生成失败: ${error.message || '未知错误'}`;
      resultStatus.className = 'result-status error';
    } finally {
      // 清除倒计时
      clearInterval(countdownTimer);
      
      // 恢复按钮状态
      generateBtn.classList.remove('loading');
      playerContainer.classList.remove('generating');
    }
  }

  // 音频播放控制
  function setupAudioControl() {
    // 获取按钮元素 - 确保元素存在
    const resultPlayBtn = document.getElementById('shared-play-btn');
    const resultAudio = document.getElementById('shared-audio');
    
    if (!resultPlayBtn || !resultAudio) {
        console.warn('播放控件未找到，跳过播放控制初始化');
        return; // 如果元素不存在，直接返回
    }
    
    resultPlayBtn.addEventListener('click', function() {
        const isPlaying = window.audioPlayerInfo ? window.audioPlayerInfo.isPlaying() : false;
        
        if (isPlaying) {
            resultAudio.pause();
            window.audioPlayerInfo.updatePlayState(false);
        } else {
            resultAudio.play();
            window.audioPlayerInfo.updatePlayState(true);
        }
    });
  }

  // 初始化事件监听器
  function initEventListeners() {
    // 文本输入监听
    voiceTextarea.addEventListener('input', checkTextValidity);

    // 声音选择监听
    voiceOptions.forEach(option => {
      option.addEventListener('click', function () {
        voiceOptions.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        selectedSpeaker = this.getAttribute('data-speaker');
      });
    });

    // 生成按钮点击
    generateBtn.addEventListener('click', generateVoice);
  }

  // 初始化
  function init() {
    // setInitialState(); // This might be redundant if loadRequestData handles defaults
    loadRequestData(); // Load first, it sets initial state including cooldown
    setupAudioControl();
    initEventListeners();
    checkTextValidity(); // Initial check after loading state
  }

  // 启动功能
  init();

  // 修复 updateRequestCounter 函数，确保它存在
  function updateRequestCounter() {
    // 如果使用的是 incrementRequestCount 函数，替换为正确的引用
    if (typeof incrementRequestCount === 'function') {
      incrementRequestCount();
    } else {
      console.log('Request counter update function not found');
      // 添加备用计数逻辑如果需要
    }
  }
}); 
