/**
 * 主题切换核心逻辑
 * 处理深色/亮色模式切换、localStorage 持久化、圆形扩散动画
 */

// 主题状态
let currentTheme = 'dark';
let isTransitioning = false;

/**
 * 初始化主题（页面加载时调用，防止 FOUC）
 */
export function initTheme() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'dark';
  }
  const savedTheme = localStorage.getItem('theme') || 'dark';
  currentTheme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
  return savedTheme;
}

/**
 * 获取当前主题
 */
export function getCurrentTheme() {
  return currentTheme;
}

/**
 * 切换主题
 * @param {MouseEvent} event - 点击事件，用于计算圆形扩散中心
 * @returns {string} 新的主题
 */
export function toggleTheme(event) {
  if (isTransitioning || typeof window === 'undefined') return currentTheme;
  
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const x = event ? event.clientX : window.innerWidth / 2;
  const y = event ? event.clientY : window.innerHeight / 2;
  
  // 创建圆形扩散动画
  createRippleTransition(x, y, newTheme);
  
  // 更新状态
  currentTheme = newTheme;
  localStorage.setItem('theme', newTheme);
  
  return newTheme;
}

/**
 * 创建圆形扩散过渡动画
 */
function createRippleTransition(x, y, newTheme) {
  isTransitioning = true;
  
  // 添加过渡标记（禁用全局过渡）
  document.body.classList.add('theme-transitioning');
  
  // 创建圆形扩散元素
  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple';
  
  // 计算需要覆盖整个屏幕的尺寸
  const maxDim = Math.max(window.innerWidth, window.innerHeight);
  const size = maxDim * 2.5;
  
  // 设置初始位置和大小
  ripple.style.cssText = `
    position: fixed;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    transform: scale(0);
    pointer-events: none;
    z-index: 99999;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: ${newTheme === 'light' ? '#ffffff' : '#0E0E13'};
  `;
  
  document.body.appendChild(ripple);
  
  // 触发动画
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(1)';
    });
  });
  
  // 动画中途切换主题
  setTimeout(() => {
    document.documentElement.setAttribute('data-theme', newTheme);
  }, 350);
  
  // 动画完成后清理
  setTimeout(() => {
    ripple.remove();
    document.body.classList.remove('theme-transitioning');
    isTransitioning = false;
    
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: newTheme } 
    }));
  }, 850);
}

/**
 * 添加主题变化监听器
 * @param {Function} callback - 主题变化时的回调函数
 * @returns {Function} 取消监听的函数
 */
export function onThemeChange(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail.theme);
  window.addEventListener('themechange', handler);
  return () => window.removeEventListener('themechange', handler);
}

// 立即初始化（防止 FOUC，仅客户端）
if (typeof window !== 'undefined') {
  initTheme();
}
