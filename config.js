// 配置文件，可以根据不同环境构建不同版本
const config = {
  apiBaseUrl: 'http://localhost:8000', // 开发环境
  // apiBaseUrl: 'https://your-production-api.com', // 生产环境
};

// 导出配置以供其他文件使用
window.appConfig = config; 