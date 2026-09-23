/** Observe real exposure; mounting or opening a background tab is not a view. */
export function observeVisibleOnce(element: Element, onVisible: () => void) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  let finished = false;
  const observer = new IntersectionObserver(entries => {
    if (finished || document.hidden || !entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) return;
    finished = true;
    cleanup();
    onVisible();
  }, { threshold: 0.25 });
  const resume = () => {
    if (!document.hidden && !finished) {
      observer.unobserve(element);
      observer.observe(element);
    }
  };
  function cleanup() {
    finished = true;
    observer.disconnect();
    document.removeEventListener('visibilitychange', resume);
  }
  observer.observe(element);
  document.addEventListener('visibilitychange', resume);
  return cleanup;
}
