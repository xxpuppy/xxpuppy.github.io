// GSAP 动画系统
// 实现类似 asorn 模板的动效

// 动画配置
const ANIMATION_CONFIG = {
  // 默认缓动函数
  ease: {
    default: 'power2.out',
    smooth: 'power3.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.3)',
  },
  // 默认持续时间
  duration: {
    fast: 0.3,
    default: 0.6,
    slow: 1,
  },
  // 默认延迟
  delay: {
    fast: 0.1,
    default: 0.2,
    slow: 0.4,
  },
};

// 动画工具函数
export const animationUtils = {
  // 检查是否应该减少动画
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // 滚动触发动画
  initScrollAnimations() {
    if (this.prefersReducedMotion()) return;

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    animatedElements.forEach((el) => observer.observe(el));
  },

  // 卡片悬停效果
  initCardHoverEffects() {
    const cards = document.querySelectorAll('.magical');
    
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  },

  // 平滑滚动
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  },

  // 页面加载动画
  initPageLoadAnimation() {
    if (this.prefersReducedMotion()) return;

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        mainContent.style.transition = `opacity ${ANIMATION_CONFIG.duration.default}s ${ANIMATION_CONFIG.ease.default}, transform ${ANIMATION_CONFIG.duration.default}s ${ANIMATION_CONFIG.ease.default}`;
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
      });
    }
  },

  // 打字机效果
  initTypingEffect(element, texts, options = {}) {
    if (!element || !texts.length) return;

    const {
      typeSpeed = 100,
      deleteSpeed = 50,
      pauseTime = 2000,
    } = options;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentText.length) {
        speed = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }

    type();
  },

  // 数字计数动画
  initCountUpAnimation(element, target, duration = 2000) {
    if (!element) return;

    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);
      
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  },

  // 进度条动画
  initProgressBarAnimation() {
    const progressBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          
          requestAnimationFrame(() => {
            bar.style.transition = `width 1s ${ANIMATION_CONFIG.ease.default}`;
            bar.style.width = width;
          });
          
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach((bar) => observer.observe(bar));
  },

  // 初始化所有动画
  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  },

  setup() {
    // 初始化各种动画
    this.initScrollAnimations();
    this.initCardHoverEffects();
    this.initSmoothScroll();
    this.initPageLoadAnimation();
    this.initProgressBarAnimation();
    
    // 打字机效果（如果存在）
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
      this.initTypingEffect(typedElement, [
        '网络安全研究者',
        '渗透测试爱好者',
        '漏洞挖掘探索者',
        '安全技术分享者',
      ]);
    }
  },
};

// 自动初始化
animationUtils.init();

// 导出配置供外部使用
export { ANIMATION_CONFIG };
