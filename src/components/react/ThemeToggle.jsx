import { useState, useEffect, useRef } from 'react';
import { toggleTheme, getCurrentTheme, onThemeChange } from '../../scripts/theme-toggle';
import './ThemeToggle.css';

/**
 * 日月主题切换按钮
 * 带有旋转动画效果
 */
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  const buttonRef = useRef(null);
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  useEffect(() => {
    // 初始化状态
    setIsDark(getCurrentTheme() === 'dark');
    
    // 监听主题变化
    const unsubscribe = onThemeChange((theme) => {
      setIsDark(theme === 'dark');
    });
    
    return unsubscribe;
  }, []);

  const handleClick = (e) => {
    // 添加旋转动画类
    const button = buttonRef.current;
    button.classList.add('theme-toggle--rotating');
    
    // 切换主题
    toggleTheme(e);
    
    // 动画完成后移除类
    setTimeout(() => {
      button.classList.remove('theme-toggle--rotating');
    }, 600);
  };

  return (
    <button 
      ref={buttonRef}
      className="theme-toggle"
      onClick={handleClick}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <div className="theme-toggle__icon-wrapper">
        {/* 太阳图标 */}
        <svg 
          ref={sunRef}
          className={`theme-toggle__sun ${!isDark ? 'theme-toggle__sun--visible' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* 中心圆 */}
          <circle cx="12" cy="12" r="5" />
          {/* 光线 */}
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* 月亮图标 */}
        <svg 
          ref={moonRef}
          className={`theme-toggle__moon ${isDark ? 'theme-toggle__moon--visible' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
