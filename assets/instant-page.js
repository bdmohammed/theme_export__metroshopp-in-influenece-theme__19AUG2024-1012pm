(() => {
  let prefetchTimeout, lastEventTime;
  const prefetchUrls = new Set();
  const linkElement = document.createElement('link');
  const supportsPrefetch =
    linkElement.relList?.supports?.('prefetch') &&
    window.IntersectionObserver &&
    'isIntersecting' in IntersectionObserverEntry.prototype;

  const allowQueryStringPrefetch =
    'instantAllowQueryString' in document.body.dataset;
  const allowExternalLinksPrefetch =
    'instantAllowExternalLinks' in document.body.dataset;
  const allowInstantWhitelist = 'instantWhitelist' in document.body.dataset;
  const allowMousedownShortcut =
    'instantMousedownShortcut' in document.body.dataset;
  const delayThreshold = 1111;
  let prefetchDelay = 65;
  let enableMousedownPrefetch = false;
  let mousedownOnly = false;
  let enableViewportPrefetch = false;

  // Disable instant prefetch for certain links (e.g., logout or cart actions)
  const excludedLinks = document.querySelectorAll(
    'a[href*="logout"], a[href*="/cart/add/"]'
  );
  if (excludedLinks) {
    excludedLinks.forEach((link) => {
      link.setAttribute('data-no-instant', '');
    });
  }

  // Check intensity levels for prefetching
  if ('instantIntensity' in document.body.dataset) {
    const intensity = document.body.dataset.instantIntensity;
    if (intensity?.startsWith('mousedown')) {
      enableMousedownPrefetch = true;
      if (intensity === 'mousedown-only') mousedownOnly = true;
    } else if (intensity?.startsWith('viewport')) {
      const isLowDataConnection =
        navigator.connection?.saveData ||
        (navigator.connection?.effectiveType?.includes('2g'));

      if (!isLowDataConnection) {
        const isSmallViewport =
          document.documentElement.clientWidth *
            document.documentElement.clientHeight <
          450000;

        enableViewportPrefetch =
          (intensity === 'viewport' && isSmallViewport) ||
          intensity === 'viewport-all';
      }
    } else {
      const parsedDelay = parseInt(intensity, 10);
      if (!isNaN(parsedDelay)) prefetchDelay = parsedDelay;
    }
  }

  if (supportsPrefetch) {
    const eventOptions = { capture: true, passive: true };

    // Touch start event for mobile
    if (!mousedownOnly) {
      document.addEventListener(
        'touchstart',
        (event) => {
          lastEventTime = performance.now();
          const link = event.target.closest('a');
          if (!shouldPrefetch(link)) return;
          prefetch(link.href);
        },
        eventOptions
      );
    }

    // Mousedown event for immediate prefetching
    if (enableMousedownPrefetch) {
      if (!allowMousedownShortcut) {
        document.addEventListener(
          'mousedown',
          (event) => {
            const link = event.target.closest('a');
            if (!shouldPrefetch(link)) return;
            prefetch(link.href);
          },
          eventOptions
        );
      }
    } else {
      // Mouseover event for hover prefetching
      document.addEventListener(
        'mouseover',
        (event) => {
          if (performance.now() - lastEventTime < delayThreshold) return;
          if (!event.target) return;
          const link = event.target.closest('a');
          if (!shouldPrefetch(link)) return;

          link.addEventListener('mouseout', clearPrefetchTimeout, {
            passive: true,
          });

          prefetchTimeout = setTimeout(() => {
            prefetch(link.href);
            prefetchTimeout = undefined;
          }, prefetchDelay);
        },
        eventOptions
      );
    }

    // Mousedown shortcut event handling
    if (allowMousedownShortcut) {
      document.addEventListener(
        'mousedown',
        (event) => {
          if (performance.now() - lastEventTime < delayThreshold) return;
          if (!event.target) return;
          const link = event.target.closest('a');
          if (event.which > 1 || event.metaKey || event.ctrlKey) return;
          if (!link) return;

          link.addEventListener(
            'click',
            (e) => {
              if (e.detail !== 1337) e.preventDefault();
            },
            { capture: true, passive: false, once: true }
          );

          const simulatedClick = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false,
            detail: 1337,
          });
          link.dispatchEvent(simulatedClick);
        },
        eventOptions
      );
    }

    // Idle time prefetching using IntersectionObserver
    if (enableViewportPrefetch) {
      (window.requestIdleCallback
        ? (callback) => requestIdleCallback(callback, { timeout: 1500 })
        : (callback) => callback())(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const link = entry.target;
              observer.unobserve(link);
              prefetch(link.href);
            }
          });
        });

        document.querySelectorAll('a').forEach((link) => {
          if (shouldPrefetch(link)) observer.observe(link);
        });
      });
    }
  }

  function clearPrefetchTimeout(event) {
    if (
      event.relatedTarget?.closest('a') !== event.target.closest('a') &&
      prefetchTimeout
    ) {
      clearTimeout(prefetchTimeout);
      prefetchTimeout = undefined;
    }
  }

  function shouldPrefetch(link) {
    return (
      link?.href &&
      (!allowInstantWhitelist || 'instant' in link.dataset) &&
      (allowExternalLinksPrefetch ||
        link.origin === location.origin ||
        'instant' in link.dataset) &&
      ['http:', 'https:'].includes(link.protocol) &&
      (link.protocol !== 'http:' || location.protocol !== 'https:') &&
      (allowQueryStringPrefetch || !link.search || 'instant' in link.dataset) &&
      !(
        (link.hash &&
          link.pathname + link.search ===
            location.pathname + location.search) ||
        'noInstant' in link.dataset
      )
    );
  }

  function prefetch(url) {
    if (!prefetchUrls.has(url)) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prefetch';
      linkElement.href = url;
      document.head.appendChild(linkElement);
      prefetchUrls.add(url);
    }
  }
})();
