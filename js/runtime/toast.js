let region;
function toast(message, options = {}) {
  if (!region) {
    region = document.createElement('div'); region.className = 'toast-region'; region.setAttribute('aria-live', 'polite'); document.body.append(region);
  }
  if (options.id) region.querySelector(`[data-id="${CSS.escape(options.id)}"]`)?.remove();
  const item = document.createElement('div'); item.className = 'toast-message'; item.textContent = message;
  if (options.id) item.dataset.id = options.id;
  region.append(item);
  item.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250 });
  setTimeout(() => { item.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).finished.then(() => item.remove()); }, options.duration || 3500);
}
toast.success = toast; toast.error = toast; toast.loading = toast;
toast.dismiss = () => region?.replaceChildren();
export const Toaster = () => null;
export default toast;
