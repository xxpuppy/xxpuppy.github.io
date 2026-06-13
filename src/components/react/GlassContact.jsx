import './GlassContact.css';

const gradientMapping = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

// 邮箱 SVG 图标
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// 消息/QQ SVG 图标
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// GitHub SVG 图标
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// 图标映射
const iconMap = {
  mail: MailIcon,
  message: MessageIcon,
  github: GitHubIcon,
};

const GlassContact = ({ items, className }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const handleClick = (e, item) => {
    if (item.value && !item.onClick) {
      // 复制到剪贴板并显示反馈
      navigator.clipboard.writeText(item.value);
      const btn = e.currentTarget;
      const label = btn.querySelector('.icon-btn__label');
      const orig = item.label;
      label.textContent = '已复制!';
      label.style.opacity = '1';
      label.style.transform = 'translateY(20%)';
      setTimeout(() => {
        label.textContent = orig;
        label.style.opacity = '';
        label.style.transform = '';
      }, 1500);
    } else if (item.onClick) {
      item.onClick(e);
    }
  };

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => {
        const IconComponent = iconMap[item.iconType];
        return (
          <button
            key={index}
            className={`icon-btn ${item.customClass || ''}`}
            aria-label={item.label}
            type="button"
            onClick={(e) => handleClick(e, item)}
          >
            <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">
                {IconComponent ? <IconComponent /> : null}
              </span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
            {item.value && <span className="icon-btn__value">{item.value}</span>}
          </button>
        );
      })}
    </div>
  );
};

export { MailIcon, MessageIcon, GitHubIcon, iconMap };
export default GlassContact;
