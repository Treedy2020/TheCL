// AI 试音功能实现
document.addEventListener('DOMContentLoaded', function () {
  // 获取DOM元素
  const voiceTextarea = document.getElementById('voice-text');
  const charCount = document.getElementById('char-count');
  const generateBtn = document.getElementById('generate-voice');
  const voiceOptions = document.querySelectorAll('.voice-option');
  const resultStatus = document.getElementById('result-status');
  
  // 共享播放器元素
  const sharedAudio = document.getElementById('shared-audio');
  const sharedPlayBtn = document.getElementById('shared-play-btn');
  const downloadLink = document.getElementById('download-link');
  
  // 请求限制相关元素
  const requestsLeft = document.getElementById('requests-left');
  const cooldownTimer = document.getElementById('cooldown-timer');

  // 变量初始化
  let selectedSpeaker = '1'; // 默认选择第一个声音
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
  }

  // 启动冷却定时器
  function startCooldownTimer(endTime) {
    // 禁用生成按钮
    generateBtn.disabled = true;

    function updateTimer() {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        clearInterval(cooldownInterval);
        cooldownTimer.textContent = '';
        resetRequestCount();

        // 检查文本是否有效以启用按钮
        checkTextValidity();
      } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        cooldownTimer.textContent = `冷却时间: ${minutes}分${seconds.toString().padStart(2, '0')}秒`;
      }
    }

    // 立即更新一次，然后每秒更新
    updateTimer();
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

  // 检查文本是否有效
  function checkTextValidity() {
    const text = voiceTextarea.value.trim();
    const length = text.length;
    charCount.textContent = length;

    // 如果在冷却期，保持按钮禁用
    if (cooldownEndTime > new Date().getTime()) {
      generateBtn.disabled = true;
      return;
    }

    // 检查文本长度
    if (length >= 20 && length <= 300) {
      generateBtn.disabled = false;
    } else {
      generateBtn.disabled = true;
    }
  }

  // 设置初始状态
  function setInitialState() {
    resultStatus.innerHTML = '在左侧输入文本，点击"生成试音"按钮<br>体验AI声音合成';
    resultStatus.className = 'result-status';
  }

  // 生成语音
  async function generateVoice() {
    const text = voiceTextarea.value.trim();
    console.log(text)
    // 显示加载状态
    generateBtn.classList.add('loading');
    resultStatus.textContent = '正在生成语音，请稍候...';
    resultStatus.className = 'result-status';

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

      incrementRequestCount();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '生成语音失败');
      }

      const data = await response.json();

      // 显示成功结果
      resultStatus.textContent = '语音生成成功！点击下方播放按钮收听。';
      resultStatus.className = 'result-status success';

      // 设置共享音频播放器的源和下载链接
      sharedAudio.src = data.public_url;
      downloadLink.href = data.public_url;
      
      // 自动播放生成的音频
      sharedAudio.play();
      sharedPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
      window.isPlaying = true;

    } catch (error) {
      console.error('生成语音出错:', error);
      resultStatus.textContent = `生成失败: ${error.message || '未知错误'}`;
      resultStatus.className = 'result-status error';
    } finally {
      // 恢复按钮状态
      generateBtn.classList.remove('loading');
    }
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
    setInitialState();
    loadRequestData();
    initEventListeners();
    checkTextValidity();
  }

  // 启动功能
  init();
}); 
