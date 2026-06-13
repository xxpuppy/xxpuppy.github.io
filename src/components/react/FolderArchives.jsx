import { useState, useRef, useEffect } from 'react';
import './FolderArchives.css';

/* ── Color helpers ── */
const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  const num = parseInt(color, 16);
  let r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 0xff) * (1 - percent))));
  let g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0xff) * (1 - percent))));
  let b = Math.max(0, Math.min(255, Math.floor((num & 0xff) * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/* ── Single Folder (ported from react-bits) ── */
const FolderItem = ({ color = '#5227FF', size = 1.6, items = [], label, count }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) papers.push(null);

  const [open, setOpen] = useState(false);
  const folderRef = useRef(null);

  const handleFolderClick = (e) => {
    // 不要阻止 paper 上的链接点击
    if (e.target.closest('.paper-link')) return;
    setOpen(prev => !prev);
  };

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (folderRef.current && !folderRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor('#ffffff', 0.1);
  const paper2 = darkenColor('#ffffff', 0.05);
  const paper3 = '#ffffff';

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3
  };

  return (
    <div className="folder-item" ref={folderRef}>
      <div style={{ transform: `scale(${size})` }}>
        <div
          className={`folder ${open ? 'open' : ''}`}
          style={folderStyle}
          onClick={handleFolderClick}
        >
          <div className="folder__back">
            {papers.map((item, i) => (
              <div key={i} className={`paper paper-${i + 1}`}>
                {item}
              </div>
            ))}
            <div className="folder__front"></div>
            <div className="folder__front right"></div>
          </div>
        </div>
      </div>
      <div className="folder-label">{label}</div>
      <div className="folder-count">{count} 篇</div>
    </div>
  );
};

/* ── Category color palette ── */
const categoryColors = [
  '#6361DC', '#A29CD3', '#E8BFAC', '#5227FF',
  '#7C5CFC', '#FF6B6B', '#4ECDC4', '#45B7D1'
];

/* ── Main component ── */
const FolderArchives = ({ categories, className = '' }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={`folder-grid ${className}`}>
      {categories.map((cat, i) => {
        const color = categoryColors[i % categoryColors.length];
        const paperItems = cat.posts.slice(0, 3).map((post) => (
          <a key={post.slug} href={`/blog/${post.slug}`} className="paper-link" onClick={(e) => e.stopPropagation()}>
            <div className="paper-content">
              <div className="paper-title">{post.title}</div>
              <div className="paper-date">
                {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </div>
            </div>
          </a>
        ));

        return (
          <FolderItem
            key={i}
            color={color}
            size={1.8}
            items={paperItems}
            label={cat.name}
            count={cat.count}
          />
        );
      })}
    </div>
  );
};

export default FolderArchives;
