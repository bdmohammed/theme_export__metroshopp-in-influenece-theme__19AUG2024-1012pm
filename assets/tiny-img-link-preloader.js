let urlToPreload, mouseoverTimer, lastTouchTimestamp;
const prefetcher = document.createElement("link"),
  isSupported =
    prefetcher.relList &&
    prefetcher.relList.supports &&
    prefetcher.relList.supports("prefetch"),
  isDataSaverEnabled = navigator.connection && navigator.connection.saveData,
  allowQueryString = "instantAllowQueryString" in document.body.dataset,
  allowExternalLinks = "instantAllowExternalLinks" in document.body.dataset;
if (isSupported && !isDataSaverEnabled) {
  (prefetcher.rel = "prefetch"), document.head.appendChild(prefetcher);
  const e = { capture: !0, passive: !0 };
  document.addEventListener("touchstart", touchstartListener, e),
    document.addEventListener("mouseover", mouseoverListener, e);
}
function touchstartListener(e) {
  lastTouchTimestamp = performance.now();
  const t = e.target.closest("a");
  isPreloadable(t) &&
    (t.addEventListener("touchcancel", touchendAndTouchcancelListener, {
      passive: !0,
    }),
    t.addEventListener("touchend", touchendAndTouchcancelListener, {
      passive: !0,
    }),
    (urlToPreload = t.href),
    preload(t.href));
}
function touchendAndTouchcancelListener() {
  (urlToPreload = void 0), stopPreloading();
}
function mouseoverListener(e) {
  if (performance.now() - lastTouchTimestamp < 1100) return;
  const t = e.target.closest("a");
  isPreloadable(t) &&
    (t.addEventListener("mouseout", mouseoutListener, { passive: !0 }),
    (urlToPreload = t.href),
    (mouseoverTimer = setTimeout(() => {
      preload(t.href), (mouseoverTimer = void 0);
    }, 65)));
}
function mouseoutListener(e) {
  (e.relatedTarget && e.target.closest("a") == e.relatedTarget.closest("a")) ||
    (mouseoverTimer
      ? (clearTimeout(mouseoverTimer), (mouseoverTimer = void 0))
      : ((urlToPreload = void 0), stopPreloading()));
}
function isPreloadable(e) {
  if (!e || !e.href) return;
  if (urlToPreload == e.href) return;
  const t = new URL(e.href);
  return (
    !(
      !(
        allowExternalLinks ||
        t.origin == location.origin ||
        "instant" in e.dataset
      ) ||
      !["http:", "https:"].includes(t.protocol) ||
      ("http:" == t.protocol && "https:" == location.protocol) ||
      !(allowQueryString || !t.search || "instant" in e.dataset) ||
      (t.hash &&
        t.pathname + t.search == location.pathname + location.search) ||
      "noInstant" in e.dataset
    ) || void 0
  );
}
function preload(e) {
  prefetcher.href = e;
}
function stopPreloading() {
  prefetcher.removeAttribute("href");
}
