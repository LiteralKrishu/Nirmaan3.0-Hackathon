/** Small, dependency-free DOM view layer. All rendering uses native browser nodes.
 * State belongs to a view's stable path; keyed reconciliation retains focus,
 * scroll positions, form controls, dialogs, and running animations on updates.
 */
export const Fragment = Symbol('fragment');
export const h = (type, props, ...children) => ({ type, props: props || {}, children });
export const Suspense = ({ children }) => children;
let current, cursor, rootView, rootNode, queued = false, effects = [], visited;
const instances = new Map();
const contexts = new Map();
let motionDriver = null;
export function registerMotion(driver) { motionDriver = driver; }
export function invalidate() {
  if (!queued && rootNode) { queued = true; queueMicrotask(render); }
}
export function useState(initial) {
  const owner = current, index = cursor++;
  if (!(index in owner.slots)) owner.slots[index] = typeof initial === 'function' ? initial() : initial;
  if (!owner.setters[index]) owner.setters[index] = value => {
    const next = typeof value === 'function' ? value(owner.slots[index]) : value;
    if (!Object.is(next, owner.slots[index])) { owner.slots[index] = next; invalidate(); }
  };
  return [owner.slots[index], owner.setters[index]];
}
export function useRef(value) { return useState(() => ({ current: value }))[0]; }
const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
export function useMemo(factory, deps) {
  const index = cursor++;
  const prev = current.slots[index];
  if (!prev || !same(prev.deps, deps)) current.slots[index] = { deps, value: factory() };
  return current.slots[index].value;
}
export const useCallback = (fn, deps) => useMemo(() => fn, deps);
export function useEffect(fn, deps) {
  const owner = current, index = cursor++;
  const prev = owner.slots[index];
  if (!prev || !same(prev.deps, deps)) {
    const entry = { deps, cleanup: prev?.cleanup };
    owner.slots[index] = entry;
    effects.push(() => { entry.cleanup?.(); entry.cleanup = fn(); });
  }
}
export function createContext(value) {
  const context = { value };
  context.Provider = { context };
  return context;
}
export const useContext = context => contexts.has(context) ? contexts.get(context) : context.value;
export const use = value => value;

function expand(node, path, inherited = {}) {
  if (node == null || typeof node === 'boolean') return [];
  if (Array.isArray(node)) return node.flatMap((n, i) => expand(n, `${path}/${n?.props?.key ?? i}`, inherited));
  if (typeof node !== 'object') return [{ type: '#text', text: String(node), path }];
  const { type, props, children } = node;
  if (type === Fragment) return expand(children, path, props.$presence ? { ...inherited, presence: props.$presence } : inherited);
  if (type?.context) {
    const { context } = type, previous = contexts.get(context), existed = contexts.has(context);
    contexts.set(context, props.value);
    const result = expand(children, path, inherited);
    if (existed) contexts.set(context, previous); else contexts.delete(context);
    return result;
  }
  if (typeof type === 'function') {
    const id = `${path}:${type.viewName || type.name}`;
    let instance = instances.get(id);
    if (!instance || instance.type !== type) {
      instance = { type, slots: [], setters: [] };
      instances.set(id, instance);
    }
    visited.add(id);
    const before = current, beforeCursor = cursor;
    current = instance; cursor = 0;
    let output;
    try { output = type({ ...props, children: children.length ? children : props.children }); }
    finally { current = before; cursor = beforeCursor; }
    return expand(output, id, inherited);
  }
  const nextProps = { ...props };
  if (inherited.presence) nextProps.$presence = inherited.presence;
  let nextInherited = inherited;
  if (props.$motion) {
    const config = { ...props.$motion };
    const initialLabel = typeof config.initial === 'string' ? config.initial : inherited.initial;
    const animateLabel = typeof config.animate === 'string' ? config.animate : inherited.animate;
    const viewLabel = typeof config.whileInView === 'string' ? config.whileInView : inherited.view;
    if (config.variants) {
      if (initialLabel) config.initial = config.variants[initialLabel];
      if (animateLabel) config.animate = config.variants[animateLabel];
      if (viewLabel) {
        config.whileInView = config.variants[viewLabel];
        config._inheritedView = !props.$motion.whileInView && Boolean(inherited.view);
      }
    }
    config.transition = { ...config.transition, ...config.animate?.transition, ...config.whileInView?.transition };
    if (config._inheritedView && inherited.sequence) {
      config._staggerDelay = inherited.sequence.delay + inherited.sequence.index++ * inherited.sequence.stagger;
    }
    nextProps.$motion = config;
    nextInherited = { initial: initialLabel, animate: animateLabel, view: viewLabel,
      sequence: config.transition.staggerChildren ? { delay: config.transition.delayChildren || 0, stagger: config.transition.staggerChildren, index: 0 } : inherited.sequence };
  }
  return [{ type, props: nextProps, path, children: expand(children, path, nextInherited) }];
}

const unitless = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order', 'scale', 'strokeWidth', 'strokeDashoffset', 'strokeDasharray', 'fillOpacity', 'strokeOpacity', 'aspectRatio', 'gridColumn', 'gridRow']);
const aliases = { className: 'class', htmlFor: 'for', tabIndex: 'tabindex', readOnly: 'readonly', autoFocus: 'autofocus', crossOrigin: 'crossorigin', fetchPriority: 'fetchpriority' };
function setProp(el, key, value, old) {
  if (key === 'key' || key === 'children' || key === '$motion' || key === '$presence') return;
  if (key === 'ref') {
    if (old && old !== value) typeof old === 'function' ? old(null) : old.current = null;
    if (value) typeof value === 'function' ? value(el) : value.current = el;
    return;
  }
  if (key.startsWith('on')) {
    let event = key.slice(2).toLowerCase();
    if (event === 'change' && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' && !['checkbox', 'radio', 'file'].includes(el.type))) event = 'input';
    const capture = event.endsWith('capture');
    if (capture) event = event.slice(0, -7);
    el._handlers ||= {};
    const id = event + capture;
    if (!el._handlers[id]) {
      const handler = e => el._props?.[key]?.(e);
      el.addEventListener(event, handler, capture);
      el._handlers[id] = handler;
    }
    return;
  }
  if (key === 'style') {
    for (const name of Object.keys({ ...old, ...value })) {
      const val = value?.[name];
      const formatted = val == null ? '' : typeof val === 'number' && !unitless.has(name) && !name.startsWith('--') ? `${val}px` : val;
      if (name.startsWith('--')) el.style.setProperty(name, formatted); else el.style[name] = formatted;
    }
    return;
  }
  if (key === 'dangerouslySetInnerHTML') {
    if (value?.__html !== old?.__html) {
      const template = document.createElement('template');
      template.innerHTML = value?.__html || '';
      template.content.querySelectorAll('script,iframe,object,embed').forEach(n => n.remove());
      template.content.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => {
        if (/^on/i.test(a.name) || /^(javascript|vbscript):/i.test(a.value)) n.removeAttribute(a.name);
      }));
      el.replaceChildren(template.content.cloneNode(true));
    }
    return;
  }
  if (key === 'value') {
    if (el.type !== 'file' && el.value !== String(value ?? '')) el.value = value ?? '';
    return;
  }
  if (key === 'checked' || key === 'selected' || key === 'muted') { el[key] = !!value; return; }
  if (key === 'defaultValue') { if (old === undefined) el.value = value ?? ''; return; }
  if (key === 'suppressHydrationWarning') return;
  let attr = aliases[key] || key;
  if (el.namespaceURI?.includes('svg') && !['viewBox', 'preserveAspectRatio', 'pathLength'].includes(attr)) attr = attr.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
  if (value == null || value === false && !attr.startsWith('aria-') && !attr.startsWith('data-')) el.removeAttribute(attr);
  else el.setAttribute(attr, value === true && !attr.startsWith('aria-') && !attr.startsWith('data-') ? '' : String(value));
}
function patchProps(el, props) {
  const old = el._props || {};
  el._props = props;
  for (const key of Object.keys({ ...old, ...props })) if (key !== 'value' && (props[key] !== old[key] || key === 'ref')) setProp(el, key, props[key], old[key]);
}
function removeNode(node) {
  if (node._exiting) return;
  node._exiting = true;
  motionDriver?.dispose?.(node);
  const pending = [];
  const walk = el => {
    if (el._props?.$motion?.exit) pending.push(motionDriver.exit(el, el._props.$motion));
    for (const child of el.children || []) walk(child);
  };
  walk(node);
  if (pending.length) {
    if (node._props?.$presence?.mode === 'popLayout' && node.style) {
      const parent = node.parentElement;
      const box = node._presenceBox || node.getBoundingClientRect();
      const parentBox = parent._presenceBox || parent.getBoundingClientRect();
      if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
      Object.assign(node.style, { position: 'absolute', margin: '0', boxSizing: 'border-box',
        left: `${box.left - parentBox.left + parent.scrollLeft - parent.clientLeft}px`,
        top: `${box.top - parentBox.top + parent.scrollTop - parent.clientTop}px`,
        width: `${box.width}px`, height: `${box.height}px` });
    }
    if (node.style) {
      node.style.pointerEvents = 'none';
      if (node.contains(document.activeElement)) document.activeElement.blur();
      node.inert = true;
      node.setAttribute('aria-hidden', 'true');
    }
    Promise.allSettled(pending).then(() => node.remove());
  } else node.remove();
}
function reconcile(parent, nodes, svg = false) {
  const old = new Map([...parent.childNodes].filter(n => !n._exiting).map(n => [n._path, n]));
  let position = parent.firstChild;
  for (const v of nodes) {
    let node = old.get(v.path);
    if (node && node._type !== v.type) {
      if (position === node) position = node.nextSibling;
      removeNode(node); node = null;
    }
    const fresh = !node;
    const isSvg = svg || v.type === 'svg';
    if (!node) node = v.type === '#text' ? document.createTextNode(v.text) : isSvg ? document.createElementNS('http://www.w3.org/2000/svg', v.type) : document.createElement(v.type);
    node._path = v.path; node._type = v.type;
    old.delete(v.path);
    if (node !== position) parent.insertBefore(node, position);
    position = node.nextSibling;
    if (v.type === '#text') { if (node.nodeValue !== v.text) node.nodeValue = v.text; continue; }
    const previous = node._props;
    patchProps(node, v.props);
    if (!v.props.dangerouslySetInnerHTML) reconcile(node, v.children, isSvg && v.type !== 'foreignObject');
    if ('value' in v.props) setProp(node, 'value', v.props.value);
    if (v.props.$motion) motionDriver?.update(node, v.props.$motion, previous?.$motion, fresh);
    if (fresh && v.props.autoFocus) queueMicrotask(() => node.focus());
  }
  old.forEach(removeNode);
}
function render() {
  queued = false; visited = new Set(); effects = [];
  const layouts = new Map();
  for (const element of rootNode.querySelectorAll('*')) {
    if (element._exiting) continue;
    if (element._props?.$presence?.mode === 'popLayout') {
      element._presenceBox = element.getBoundingClientRect();
      element.parentElement._presenceBox = element.parentElement.getBoundingClientRect();
    }
    if (element._props?.$motion?.layout) layouts.set(element, element.getBoundingClientRect());
  }
  const tree = expand(h(rootView, {}), 'app');
  reconcile(rootNode, tree);
  for (const [element, before] of layouts) {
    if (!element.isConnected || element._exiting) continue;
    motionDriver?.layout?.(element, before, element._props.$motion);
  }
  for (const [id, instance] of instances) if (!visited.has(id)) {
    for (const slot of instance.slots) slot?.cleanup?.();
    instances.delete(id);
  }
  const pending = effects;
  pending.forEach(effect => effect());
}
export function mount(view, target) { rootView = view; rootNode = target; render(); }
export default { createElement: h, Fragment };
