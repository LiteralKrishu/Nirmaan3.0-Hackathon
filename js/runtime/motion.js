/** DOM animations powered by Motion 12.38, the source site's animation engine.
 * Original transition objects, spring constants, keyframes, and easing are kept.
 */
import { h, Fragment, registerMotion } from './dom.js';
import { animate } from '../vendor/motion.js';
const tags = new Map();
const motionKeys = ['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'variants', 'layout', 'layoutId'];
export const motion = new Proxy({}, { get(_, tag) {
  if (!tags.has(tag)) {
    const view = ({ children, ...props }) => {
      const config = {};
      for (const key of motionKeys) { if (key in props) { config[key] = props[key]; delete props[key]; } }
      return h(tag, { ...props, $motion: config }, children);
    };
    view.viewName = `motion.${tag}`; tags.set(tag, view);
  }
  return tags.get(tag);
} });
export const AnimatePresence = ({ children, mode = "sync" }) => h(Fragment, { $presence: { mode } }, children);
const plainTarget = target => Object.fromEntries(Object.entries(target || {}).filter(([k]) => k !== 'transition' && k !== 'transitionEnd'));
function play(el, target, transition = {}) {
  if (!target || typeof target !== 'object') return Promise.resolve();
  const props = plainTarget(target);
  if (!Object.keys(props).length) return Promise.resolve();
  const options = { ...transition, ...target.transition };
  const controls = animate(el, props, options);
  return Promise.resolve(controls).then(() => {
    if (target.transitionEnd) Object.assign(el.style, target.transitionEnd);
  });
}
function setInitial(el, values) {
  if (!values || typeof values !== 'object') return;
  const transform = [];
  for (const [key, value] of Object.entries(plainTarget(values))) {
    const first = Array.isArray(value) ? value[0] : value;
    if (key === 'x' || key === 'y') transform.push(`translate${key.toUpperCase()}(${typeof first === 'number' ? first+'px' : first})`);
    else if (['scale','scaleX','scaleY','rotate','rotateX','rotateY'].includes(key)) transform.push(`${key}(${first}${key.startsWith('rotate') ? 'deg' : ''})`);
    else if (key === 'pathLength') { el.setAttribute('pathLength', '1'); el.style.strokeDasharray = '1'; el.style.strokeDashoffset = String(1-Number(first)); }
    else el.style[key] = typeof first === 'number' && ['height','width','top','left'].includes(key) ? first+'px' : first;
  }
  if (transform.length) el.style.transform = transform.join(' ');
}
const equivalent = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function update(el, config, previous, fresh) {
  if (fresh) {
    el._motionConfig = config;
    setInitial(el, config.initial === false ? config.animate : config.initial);
    const start = () => {
      if (!el.isConnected || el._exiting) return;
      if (config.whileInView) {
        if (config._inheritedView) {
          let parent = el.parentElement;
          while (parent && !parent._motionConfig?.variants) parent = parent.parentElement;
          if (parent) {
            (parent._variantChildren ||= []).push(el);
            if (parent._inView) play(el, { ...config.whileInView, transition: { ...config.whileInView.transition, delay: config._staggerDelay || 0 } }, config.transition);
            return;
          }
        }
        el._observer = new IntersectionObserver(entries => {
          for (const entry of entries) if (entry.isIntersecting) {
            el._inView = true;
            play(el, config.whileInView, config.transition);
            for (const child of el._variantChildren || []) {
              const childConfig = child._motionConfig;
              play(child, { ...childConfig.whileInView, transition: { ...childConfig.whileInView?.transition, delay: childConfig._staggerDelay || 0 } }, childConfig.transition);
            }
            if (config.viewport?.once) el._observer.disconnect();
          } else if (!config.viewport?.once) play(el, config.initial, config.transition);
        }, { threshold: config.viewport?.amount === 'all' ? 1 : typeof config.viewport?.amount === 'number' ? config.viewport.amount : 0, rootMargin: config.viewport?.margin || '0px' });
        el._observer.observe(el);
      }
      if (config.animate && config.initial !== false) play(el, config.animate, config.transition);
    };
    requestAnimationFrame(start);
    const baseFor = target => Object.fromEntries(Object.keys(target || {}).map(key => [key, el._motionConfig.animate?.[key] ?? (key.startsWith('scale') ? 1 : key === 'boxShadow' ? '0px 0px 0px 0px rgba(0,0,0,0)' : 0)]));
    el.addEventListener('pointerenter', () => { const c = el._motionConfig; if (c.whileHover) play(el, c.whileHover, c.transition); });
    el.addEventListener('pointerleave', () => { const c = el._motionConfig; if (c.whileHover) play(el, baseFor(c.whileHover), c.transition); });
    el.addEventListener('pointerdown', () => { const c = el._motionConfig; if (c.whileTap) { play(el, c.whileTap, c.transition); const end = () => play(el, el.matches(':hover') && c.whileHover ? c.whileHover : baseFor(c.whileTap), c.transition); window.addEventListener('pointerup', end, { once: true }); window.addEventListener('pointercancel', end, { once: true }); } });
  } else {
    el._motionConfig = config;
    if (!equivalent(config.animate, previous?.animate)) play(el, config.animate, config.transition);
  }
}
function layout(el, before, config) {
  el._layoutAnimation?.stop();
  el.style.translate = ''; el.style.scale = '';
  const after = el.getBoundingClientRect();
  if (!after.width || !after.height || !before.width || !before.height) return;
  const dx = before.left - after.left, dy = before.top - after.top;
  const sx = config.layout === 'position' ? 1 : before.width / after.width;
  const sy = config.layout === 'position' ? 1 : before.height / after.height;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.005 && Math.abs(sy - 1) < 0.005) return;
  const origin = el._layoutOrigin ?? el.style.transformOrigin;
  el._layoutOrigin = origin;
  el.style.transformOrigin = '0 0';
  const project = progress => {
    el.style.translate = `${dx * (1 - progress)}px ${dy * (1 - progress)}px`;
    el.style.scale = `${1 + (sx - 1) * (1 - progress)} ${1 + (sy - 1) * (1 - progress)}`;
  };
  project(0);
  const transition = config.transition?.layout || config.transition || {};
  const controls = animate(0, 1, { duration: 0.45, ease: [0.4, 0, 0.1, 1], ...transition,
    delay: 0, onUpdate: project, onComplete: () => {
      if (el._layoutAnimation !== controls) return;
      el.style.translate = ''; el.style.scale = ''; el.style.transformOrigin = origin;
      el._layoutAnimation = null; el._layoutOrigin = null;
    } });
  el._layoutAnimation = controls;
}
registerMotion({ update, layout, exit: (el, config) => play(el, config.exit, config.transition), dispose: el => { el._layoutAnimation?.stop(); el._observer?.disconnect(); el.querySelectorAll?.('*').forEach(n => n._observer?.disconnect()); } });
