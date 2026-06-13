import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwapArchives.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card-swap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});
const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwapArchives = ({
  width = 320,
  height = 420,
  cardDistance = 40,
  verticalDistance = 50,
  delay = 4000,
  pauseOnHover = true,
  skewAmount = 4,
  easing = 'elastic',
  categories
}) => {
  const config =
    easing === 'elastic'
      ? { ease: 'elastic.out(0.6,0.9)', durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: 'power1.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const children = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.map((cat, i) => (
      <Card key={i}>
        <div className="card-inner">
          <div className="card-category-name">{cat.name}</div>
          <div className="card-category-count">{cat.count} 篇</div>
          <div className="card-posts-list">
            {cat.posts.slice(0, 4).map((post, j) => (
              <div key={j} className="card-post-item">
                <span className="card-post-date">
                  {new Date(post.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                </span>
                <span className="card-post-title">{post.title}</span>
              </div>
            ))}
          </div>
          {cat.count > 4 && (
            <div className="card-more">+{cat.count - 4} 篇更多 →</div>
          )}
        </div>
      </Card>
    ));
  }, [categories]);

  const refs = useMemo(() => children.map(() => React.createRef()), [children.length]);
  const order = useRef(Array.from({ length: children.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    if (refs.length < 2) return;
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
      tl.call(() => { order.current = [...rest, front]; });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => { tlRef.current?.pause(); clearInterval(intervalRef.current); };
      const resume = () => { tlRef.current?.play(); intervalRef.current = window.setInterval(swap, delay); };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = children.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            if (categories && categories[i]) {
              window.location.href = `/blog?category=${encodeURIComponent(categories[i].name)}`;
            }
          }
        })
      : child
  );

  if (children.length === 0) return null;

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwapArchives;
