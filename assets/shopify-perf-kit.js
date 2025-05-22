// Constants and variables
let J;
const z = {};
const THRESHOLDS_A = [2500, 4000];
const THRESHOLDS_F = [800, 1800];
const THRESHOLDS_P = [200, 500];
const interactionEntries = [];
const interactionMap = {};
let minInteractionId = Infinity;
let maxInteractionId = 0;
let interactionCount = 0;
let performanceObserver;

// Initialize performance observer if necessary
const initializePerformanceObserver = () => {
  if (!('interactionCount' in performance) && !performanceObserver) {
    performanceObserver = createPerformanceObserver(
      'event',
      handleEventInteraction,
      {
        type: 'event',
        buffered: true,
        durationThreshold: 0,
      }
    );
  }
};

// Handle performance changes based on event interactions
const handleEventInteraction = (entries) => {
  entries.forEach(({ interactionId, duration }) => {
    if (interactionId) {
      minInteractionId = Math.min(minInteractionId, interactionId);
      maxInteractionId = Math.max(maxInteractionId, interactionId);
      interactionCount = maxInteractionId
        ? (maxInteractionId - minInteractionId) / 7 + 1
        : 0;
    }
  });
};

// Measure Time to First Byte (TTFB)
const measureTTFB = (event, options = {}) => {
  const ttfbMetric = createPerformanceMetrics('TTFB');
  const handleChange = handlePerformanceChange(
    event,
    ttfbMetric,
    THRESHOLDS_F,
    options.reportAllChanges
  );

  waitForPageLoad(() => {
    const navigationEntry = performanceNavigation();
    if (navigationEntry) {
      const responseStart = navigationEntry.responseStart;
      if (responseStart <= 0 || responseStart > performance.now()) return;

      ttfbMetric.value = Math.max(responseStart - getActivationStart(), 0);
      ttfbMetric.entries = [navigationEntry];
      handleChange(true);

      addPageshowListener(() => {
        ttfbMetric.value = 0;
        handleChange(true);
      });
    }
  });
};

// Wait for the page to load or for the document to be complete
const waitForPageLoad = (callback) => {
  if (document.prerendering) {
    requestAnimationFrame(() => waitForPageLoad(callback));
  } else if (document.readyState !== 'complete') {
    addEventListener('load', () => callback(), { once: true });
  } else {
    setTimeout(callback, 0);
  }
};

// Record interaction events
const recordInteractionEvent = (event) => {
  const lastEntry = interactionEntries[interactionEntries.length - 1];
  const existingInteraction = interactionMap[event.interactionId];

  if (
    existingInteraction ||
    interactionEntries.length < 10 ||
    event.duration > lastEntry.latency
  ) {
    if (existingInteraction) {
      existingInteraction.entries.push(event);
      existingInteraction.latency = Math.max(
        existingInteraction.latency,
        event.duration
      );
    } else {
      const newInteraction = {
        id: event.interactionId,
        latency: event.duration,
        entries: [event],
      };
      interactionMap[newInteraction.id] = newInteraction;
      interactionEntries.push(newInteraction);
    }

    interactionEntries.sort((a, b) => b.latency - a.latency);
    // Keep only the top 10 interactions
    interactionEntries
      .splice(10)
      .forEach(({ id }) => delete interactionMap[id]);
  }
};

// Get the current interaction count
const getInteractionCount = () => {
  return performance ? interactionCount : performance.interactionCount || 0;
};

// Calculate the difference in interaction counts
const getInteractionDifference = () => {
  return getInteractionCount() - interactionCount;
};

// Initialization
// initializePerformanceObserver();

const performanceNavigation = () => {
  return window.performance?.getEntriesByType('navigation')[0] || null;
};

const getDocumentState = (timestamp) => {
  const state = document.readyState;
  if (state === 'loading') return 'loading';

  const navEntry = performanceNavigation();
  if (navEntry) {
    if (timestamp < navEntry.domInteractive) return 'loading';
    if (
      navEntry.domContentLoadedEventStart === 0 ||
      timestamp < navEntry.domContentLoadedEventStart
    )
      return 'dom-interactive';
    if (navEntry.domComplete === 0 || timestamp < navEntry.domComplete)
      return 'dom-content-loaded';
  }
  return 'complete';
};

const getNodeName = (node) => {
  return node.nodeType === 1
    ? node.nodeName.toLowerCase()
    : node.nodeName.toUpperCase().replace(/^#/, '');
};

const getSelectorPath = (element, maxLength = 100) => {
  let selector = '';
  try {
    while (element && element.nodeType !== 9) {
      const nodeName = getNodeName(element);
      const id = element.id ? `#${element.id}` : '';
      const classes = element.classList?.value.trim().replace(/\s+/g, '.')
        ? `.${element.classList.value.trim()}`
        : '';
      const combinedSelector =
        id || (classes ? `${nodeName}${classes}` : nodeName);

      if (selector.length + combinedSelector.length > maxLength - 1) {
        return selector || combinedSelector;
      }

      selector = selector
        ? `${combinedSelector}>${selector}`
        : combinedSelector;
      if (element.id) break;
      element = element.parentNode;
    }
  } catch (error) {
    console.error(error);
  }
  return selector;
};

let interactionId = -1;

const getInteractionId = () => interactionId;

const addPageshowListener = (callback) => {
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        interactionId = event.timeStamp;
        callback(event);
      }
    },
    { once: true }
  );
};

const getActivationStart = () => {
  const navEntry = performanceNavigation();
  return navEntry?.activationStart || 0;
};

const createPerformanceMetrics = (name, value) => {
  const navType =
    getInteractionId() >= 0 ? 'back-forward-cache' : getDocumentState();
  return {
    name,
    value: value === undefined ? -1 : value,
    rating: 'good',
    delta: 0,
    entries: [],
    id: `v3-${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`,
    navigationType: navType,
  };
};

const createPerformanceObserver = (entryType, callback, options = {}) => {
  if (PerformanceObserver.supportedEntryTypes.includes(entryType)) {
    const observer = new PerformanceObserver((list) => {
      Promise.resolve().then(() => {
        callback(list.getEntries());
      });
    });
    observer.observe({ type: entryType, buffered: true, ...options });
    return observer;
  }
};

const handlePerformanceChange = (
  callback,
  metric,
  thresholds,
  reportAllChanges
) => {
  let previousValue;
  return (isForced) => {
    if (metric.value >= 0 && (isForced || reportAllChanges)) {
      const delta = metric.value - (previousValue || 0);
      if (delta || previousValue === undefined) {
        previousValue = metric.value;
        metric.delta = delta;
        metric.rating =
          metric.value > thresholds[1]
            ? 'poor'
            : metric.value > thresholds[0]
            ? 'needs-improvement'
            : 'good';
        callback(metric);
      }
    }
  };
};

const requestAnimationFrameTwoTimes = (callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
};

const visibilityChangeHandler = (callback) => {
  const handler = (event) => {
    if (event.type !== 'pagehide' && document.visibilityState !== 'hidden') {
      callback(event);
    }
  };
  window.addEventListener('visibilitychange', handler, { capture: true });
  window.addEventListener('pagehide', handler, { capture: true });
};
const p = function (e) {
  var t = !1; // This variable tracks whether the function has been called
  return function (n) {
    if (!t) {
      // Check if the function has not been called yet
      e(n); // Call the provided function with argument n
      t = !0; // Set t to true to prevent further calls
    }
  };
};
let visibilityState = -1;
const handleVisibilityChange = (callback) => {
  return () => {
    if (document.visibilityState === 'hidden' && visibilityState > -1) {
      visibilityState = 'visibilitychange' === event.type ? event.timeStamp : 0;
      callback();
    }
  };
};
const _ = (e) => {
  if (document.prerendering)
    addEventListener(
      'prerenderingchange',
      () => {
        return e();
      },
      true
    );
  else e();
};
const registerVisibilityChangeListeners = () => {
  window.addEventListener('visibilitychange', handleVisibilityChange, {
    capture: true,
  });
  window.addEventListener('prerenderingchange', handleVisibilityChange, {
    capture: true,
  });
};

const getFirstHiddenTime = () => {
  if (visibilityState < 0) {
    visibilityState = document.visibilityState === 'hidden' ? 0 : Infinity;
    registerVisibilityChangeListeners();
    addPageshowListener(() => {
      setTimeout(() => {
        visibilityState = document.visibilityState === 'hidden' ? 0 : Infinity;
        registerVisibilityChangeListeners();
      }, 0);
    });
  }
  return {
    get firstHiddenTime() {
      return visibilityState;
    },
  };
};

const loadPerformanceMetrics = (callback, options = {}) => {
  const thresholds = [1800, 3000];
  getFirstHiddenTime();

  const metrics = createPerformanceMetrics('FCP');
  const observer = createPerformanceObserver('paint', (entries) => {
    entries.forEach((entry) => {
      if (
        entry.name === 'first-contentful-paint' &&
        entry.startTime < metrics.firstHiddenTime
      ) {
        metrics.value = Math.max(entry.startTime - getActivationStart(), 0);
        metrics.entries.push(entry);
        callback(true);
      }
    });
  });

  if (observer) {
    const handleTimeout = (event) => {
      metrics = createPerformanceMetrics('FCP');
      const handleMetricChange = handlePerformanceChange(
        callback,
        metrics,
        thresholds,
        options.reportAllChanges
      );
      requestAnimationFrameTwoTimes(() => {
        metrics.value = performance.now() - event.timeStamp;
        handleMetricChange(true);
      });
    };
    addPageshowListener(handleTimeout);
  }
};

// Define more constants, variables, and functions similarly...

const config = {
  shop_domain: `${window.location.origin}/.well-known/shopify/monorail/v1/produce`,
  global: 'https://monorail-edge.shopifysvc.com/v1/produce',
  canada: 'https://monorail-edge-ca.shopifycloud.com/v1/produce',
  staging: 'https://monorail-edge-staging.shopifycloud.com/v1/produce',
};

// More code...

function sendMonorailData({ monorailRegion, schema, rawData }) {
  const timestamp = Date.now();
  const payload =
    schema === schemaMap.OnUnload
      ? formatUnloadData(rawData)
      : formatRawData(rawData);

  const data = {
    schema_id: schema,
    payload,
    metadata: {
      event_created_at_ms: timestamp,
      event_sent_at_ms: timestamp,
    },
  };

  try {
    const endpoint = config[monorailRegion || ''];
    if (!endpoint) {
      console.debug('📡 Monorail: ', JSON.stringify(data, null, 2));
      return;
    }

    if (
      typeof window.navigator.sendBeacon === 'function' &&
      typeof window.Blob === 'function'
    ) {
      const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
      window.navigator.sendBeacon(endpoint, blob);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Content-type', 'text/plain');
      xhr.send(JSON.stringify(data));
    }
  } catch (error) {
    console.error(error);
  }
}

!(function (e) {
  e.OnInteraction = 'perf_kit_on_interaction/3.0';
  e.OnUnload = 'perf_kit_on_unload/3.1';
})(J || (J = {}));

const V =
  'https://cdn.shopify.com/shopifycloud/privacy-banner/storefront-banner.js';
const X =
  'https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js';

const loadConsentScript = async () => {
  try {
    const scripts = Array.from(document.scripts);
    if (scripts.some((script) => script.src === V || script.src === X)) {
      return true;
    }

    return await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = X;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Could not load consent script'));
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error(error);
  }
  return false;
};

const G = 'xxxx-4xxx-xxxx-xxxxxxxxxxxx';

const generateUniqueId = () => {
  let uniqueId = '';
  try {
    const crypto = window.crypto;
    const randomValues = new Uint16Array(31);
    crypto.getRandomValues(randomValues);
    let r = 0;

    uniqueId = G.replace(/[x]/g, (match) => {
      const t = randomValues[r] % 16;
      r++;
      return (match === 'x' ? t : (3 & t) | 8).toString(16);
    }).toUpperCase();
  } catch (error) {
    uniqueId = G.replace(/[x]/g, () => {
      const t = Math.floor(Math.random() * 16);
      return (t === 'x' ? t : (3 & t) | 8).toString(16);
    }).toUpperCase();
  }

  const getCurrentTime = () => {
    let currentTime = 0,
      performanceTime = 0;
    currentTime = Date.now() >>> 0;

    try {
      performanceTime = performance.now() >>> 0;
    } catch (error) {
      performanceTime = 0;
    }
    return Math.abs(currentTime + performanceTime)
      .toString(16)
      .toLowerCase()
      .padStart(8, '0');
  };

  return `${getCurrentTime()}-${uniqueId}`;
};

let W = true;
let Y = false;
let ee = null;
let te = false;

class PerformanceKit {
  constructor(config) {
    const shopifySessionId = this.getCookieValue('_shopify_s');
    const shopifyUserId = this.getCookieValue('_shopify_y');

    this.config = config;
    this.info = {
      perfKitInit: Date.now(),
      perfKitVersion: '1.0.0',
      url: window.location.href,
      referrer: document.referrer || undefined,
      microSessionId: generateUniqueId(),
      microSessionCount: 0,
      sessionToken: shopifySessionId,
      uniqueToken: shopifyUserId,
    };

    performance.setResourceTimingBufferSize(1000);
    this.performanceMetrics = this.getPerformanceMetrics(this.info.perfKitInit);

    this.initialize();
  }

  getCookieValue(cookieName) {
    const cookieRegex = new RegExp(`${cookieName}=([^;]*)`);
    const match = document.cookie.match(cookieRegex);
    return match ? match[1] : undefined;
  }

  getPerformanceMetrics(initTime) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length === 0) return {};

    const navigation = navigationEntries[0];
    const navigationBad = this.checkBadNavigation(navigation, initTime);

    return {
      encodedBodySize: navigation.encodedBodySize,
      decodedBodySize: navigation.decodedBodySize,
      navigationStart: Math.round(navigation.startTime),
      navigationType: navigation.type,
      navigationBad,
      responseStart: Math.round(navigation.responseStart),
      responseEnd: Math.round(navigation.responseEnd),
      workerStart: Math.round(navigation.workerStart),
      connectStart: Math.round(navigation.connectStart),
      connectEnd: Math.round(navigation.connectEnd),
      domainLookupStart: Math.round(navigation.domainLookupStart),
      domainLookupEnd: Math.round(navigation.domainLookupEnd),
      fetchStart: Math.round(navigation.fetchStart),
      redirectStart: Math.round(navigation.redirectStart),
      redirectEnd: Math.round(navigation.redirectEnd),
      requestStart: Math.round(navigation.requestStart),
      secureConnectionStart: Math.round(navigation.secureConnectionStart),
      nextHopProtocol: navigation.nextHopProtocol,
      serverTiming: JSON.stringify(navigation.serverTiming),
      domInteractive: Math.round(navigation.domInteractive),
      domComplete: Math.round(navigation.domComplete),
      domContentLoadedEventStart: Math.round(
        navigation.domContentLoadedEventStart
      ),
      domContentLoadedEventEnd: Math.round(navigation.domContentLoadedEventEnd),
      redirectCount: navigation.redirectCount,
      initiatorType: navigation.initiatorType,
      transferSize: navigation.transferSize,
    };
  }

  checkBadNavigation(navigation, initTime) {
    return (
      (navigation.requestStart &&
        navigation.startTime &&
        navigation.requestStart < navigation.startTime) ||
      (navigation.responseStart &&
        navigation.startTime &&
        navigation.responseStart < navigation.startTime) ||
      (navigation.responseStart &&
        navigation.fetchStart &&
        navigation.responseStart < navigation.fetchStart) ||
      (navigation.startTime && navigation.fetchStart < navigation.startTime) ||
      (navigation.responseEnd && navigation.responseEnd > initTime + 86400000)
    );
  }

  async initialize() {
    const { Shopify } = window;
    if (Shopify && Shopify.customerPrivacy) {
      return;
    }
    await loadConsentScript();
  }
}

const re = new Set();
function oe() {
  if (ee !== null) {
    if (se() && re.size > 0) {
      let mergedData = {};
      for (const item of re) {
        mergedData = {
          ...mergedData,
          ...item,
        };
      }

      re.clear();
      ee.info.microSessionCount += 1;

      const resourceTimingData = getResourceTimingData(
        ee.config.resourceTimingSamplingRate
      );
      K({
        monorailRegion: ee.config.monorailRegion,
        schema: J.OnUnload,
        rawData: {
          ...ee.info,
          ...ee.config.storefrontData,
          ...ee.performanceMetrics,
          ...mergedData,
          resourceTiming: resourceTimingData,
          paintTimingHidden: te,
        },
      });
    }
  } else {
    console.debug('⛔️ Shopify/perf-kit is not initialized');
  }
}

let ie, ae;

function se() {
  return window?.Shopify?.customerPrivacy?.analyticsProcessingAllowed();
}

ie = function ({ attribution, value }) {
  re.add({
    cumulativeLayoutShift: value,
    cumulativeLayoutShiftTarget: attribution.largestShiftTarget,
  });
};

function monitorLayoutShift(element, options) {
  options = options || {};
  loadPerformanceMetrics(
    p(() => {
      let n,
        r = createPerformanceMetrics('CLS', 0),
        cumulativeShift = 0,
        entries = [];

      const recordShift = (entriesList) => {
        entriesList.forEach((entry) => {
          if (!entry.hadRecentInput) {
            const firstEntry = entries[0];
            const lastEntry = entries[entries.length - 1];

            if (
              cumulativeShift &&
              entry.startTime - lastEntry.startTime < 1000 &&
              entry.startTime - firstEntry.startTime < 5000
            ) {
              cumulativeShift += entry.value;
              entries.push(entry);
            } else {
              cumulativeShift = entry.value;
              entries = [entry];
            }
          }
        });

        if (cumulativeShift > r.value) {
          r.value = cumulativeShift;
          r.entries = entries;
          n();
        }
      };

      const layoutShiftObserver = createPerformanceObserver(
        'layout-shift',
        recordShift
      );
      if (layoutShiftObserver) {
        n = handlePerformanceChange(element, r, C, options.reportAllChanges);
        visibilityChangeHandler(() => {
          recordShift(layoutShiftObserver.takeRecords());
          n(true);
        });
        addPageshowListener(() => {
          cumulativeShift = 0;
          r = createPerformanceMetrics('CLS', 0);
          n = handlePerformanceChange(element, r, C, options.reportAllChanges);
          l(() => n());
        });

        setTimeout(n, 0);
      }
    })
  );
}

function processEntry(entry) {
  if (entry.entries.length) {
    const highestValueEntry = entry.entries.reduce((prev, curr) =>
      prev && prev.value > curr.value ? prev : curr
    );

    if (
      highestValueEntry &&
      highestValueEntry.sources &&
      highestValueEntry.sources.length
    ) {
      const validSource =
        highestValueEntry.sources.find(
          (source) => source.node && source.node.nodeType === 1
        ) || highestValueEntry.sources[0];

      if (validSource) {
        entry.attribution = {
          largestShiftTarget: o(validSource.node),
          largestShiftTime: highestValueEntry.startTime,
          largestShiftValue: highestValueEntry.value,
          largestShiftSource: validSource,
          largestShiftEntry: highestValueEntry,
          loadState: n(highestValueEntry.startTime),
        };
        return;
      }
    }
  }
  entry.attribution = {};
}

function initializeMonitoring(e) {
  processEntry(e);
  ie(e);
}

(function (callback) {
  callback(function (e) {
    initializeMonitoring(e);
  }, ae);
})(function (callback) {
  monitorLayoutShift(callback);
});

(function (e, n) {
  (function (callback, options) {
    options = options || {};

    _(() => {
      let n,
        r = getFirstHiddenTime(),
        o = createPerformanceMetrics('LCP');

      const handleLargestContentfulPaint = (entries) => {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.startTime < r.firstHiddenTime) {
          o.value = Math.max(lastEntry.startTime - getActivationStart(), 0);
          o.entries = [lastEntry];
          n();
        }
      };

      const observer = createPerformanceObserver(
        'largest-contentful-paint',
        handleLargestContentfulPaint
      );
      if (observer) {
        n = handlePerformanceChange(
          e,
          o,
          THRESHOLDS_A,
          options.reportAllChanges
        );

        const triggerUpdate = p(() => {
          if (!z[o.id]) {
            handleLargestContentfulPaint(observer.takeRecords());
            observer.disconnect();
            z[o.id] = true;
            n(true);
          }
        });

        ['keydown', 'click'].forEach((eventType) => {
          addEventListener(eventType, () => setTimeout(triggerUpdate, 0), true);
        });

        visibilityChangeHandler(triggerUpdate);
        addPageshowListener((r) => {
          o = createPerformanceMetrics('LCP');
          n = handlePerformanceChange(e, o, A, options.reportAllChanges);
          l(() => {
            o.value = performance.now() - r.timeStamp;
            z[o.id] = true;
            n(true);
          });
        });
      }
    });
  })(function (n) {
    (function (entry) {
      if (entry.entries.length) {
        const navigationEntry = t();
        if (navigationEntry) {
          const activationStart = navigationEntry.activationStart || 0;
          const lastEntry = entry.entries[entry.entries.length - 1];
          const resourceEntry =
            lastEntry.url &&
            performance
              .getEntriesByType('resource')
              .find((e) => e.name === lastEntry.url);

          const timeToFirstByte = Math.max(
            0,
            navigationEntry.responseStart - activationStart
          );
          const resourceLoadDelay = Math.max(
            timeToFirstByte,
            resourceEntry
              ? (resourceEntry.requestStart || resourceEntry.startTime) -
                  activationStart
              : 0
          );
          const resourceLoadTime = Math.max(
            resourceLoadDelay,
            resourceEntry ? resourceEntry.responseEnd - activationStart : 0
          );
          const elementRenderDelay = Math.max(
            resourceLoadTime,
            lastEntry ? lastEntry.startTime - activationStart : 0
          );

          const attributionData = {
            element: o(lastEntry.element),
            timeToFirstByte,
            resourceLoadDelay: resourceLoadDelay - timeToFirstByte,
            resourceLoadTime: resourceLoadTime - resourceLoadDelay,
            elementRenderDelay: elementRenderDelay - resourceLoadTime,
            navigationEntry,
            lcpEntry: lastEntry,
          };

          if (lastEntry.url) attributionData.url = lastEntry.url;
          if (resourceEntry) attributionData.lcpResourceEntry = resourceEntry;

          entry.attribution = attributionData;
        }
      }

      entry.attribution = {
        timeToFirstByte: 0,
        resourceLoadDelay: 0,
        resourceLoadTime: 0,
        elementRenderDelay: entry.value,
      };
    })(n);
    e(n);
  }, n);
})(function (e) {
  const { attribution, value } = e;
  re.add({
    largestContentfulPaint: Math.round(value),
    largestContentfulPaintTarget: attribution.element,
  });
});

(function (callback, options) {
  loadPerformanceMetrics(function (entry) {
    (function (entry) {
      if (entry.entries.length) {
        const navigationEntry = t();
        const lastEntry = entry.entries[entry.entries.length - 1];
        if (navigationEntry) {
          const activationStart = navigationEntry.activationStart || 0;
          const timeToFirstByte = Math.max(
            0,
            navigationEntry.responseStart - activationStart
          );
          entry.attribution = {
            timeToFirstByte,
            firstByteToFCP: entry.value - timeToFirstByte,
            loadState: n(entry.entries[0].startTime),
            navigationEntry,
            fcpEntry: lastEntry,
          };
        }
      } else {
        entry.attribution = {
          timeToFirstByte: 0,
          firstByteToFCP: entry.value,
          loadState: n(a()),
        };
      }
    })(entry);
    callback(entry);
  }, options);
})(function (entry) {
  const { value } = entry;
  re.add({
    firstContentfulPaint: Math.round(value),
  });
});

(function (callback, options) {
  (function (options) {
    options = options || {};
    _(() => {
      let interactionId;
      initializePerformanceObserver();
      let report,
        input = createPerformanceMetrics('INP');

      const handleInputEntries = (entries) => {
        entries.forEach((entry) => {
          if (entry.interactionId) {
            recordInteractionEvent(entry);
          }
          if (
            entry.entryType === 'first-input' &&
            !interactionEntries.some((t) =>
              t.entries.some(
                (t) =>
                  entry.duration === t.duration &&
                  entry.startTime === t.startTime
              )
            )
          ) {
            recordInteractionEvent(entry);
          }
        });

        const index = Math.min(
          interactionEntries.length - 1,
          Math.floor(getInteractionDifference() / 50)
        );
        const currentEntry = interactionEntries[index];
        if (currentEntry && currentEntry.latency !== input.value) {
          input.value = currentEntry.latency;
          input.entries = currentEntry.entries;
          report();
        }
      };

      const eventObserver = createPerformanceObserver(
        'event',
        handleInputEntries,
        {
          durationThreshold: options.durationThreshold ?? 40,
        }
      );

      report = handlePerformanceChange(
        callback,
        input,
        THRESHOLDS_P,
        options.reportAllChanges
      );

      if (eventObserver) {
        if (
          'PerformanceEventTiming' in window &&
          'interactionId' in PerformanceEventTiming.prototype
        ) {
          eventObserver.observe({
            type: 'first-input',
            buffered: true,
          });
        }

        visibilityChangeHandler(() => {
          handleInputEntries(eventObserver.takeRecords());
          if (input.value < 0 && getInteractionDifference() > 0) {
            input.value = 0;
            input.entries = [];
          }
          report(true);
        });

        addPageshowListener(() => {
          N = [];
          B = getInteractionCount();
          input = createPerformanceMetrics('INP');
          report = handlePerformanceChange(
            callback,
            input,
            P,
            options.reportAllChanges
          );
        });
      }
    });
  })(function (event) {
    (function (entry) {
      if (entry.entries.length) {
        const sortedEntries = entry.entries.sort((a, b) => {
          return (
            b.duration - a.duration ||
            b.processingEnd -
              b.processingStart -
              (a.processingEnd - a.processingStart)
          );
        });
        const mainEntry = sortedEntries[0];
        const eventTargetEntry = entry.entries.find((e) => e.target);

        entry.attribution = {
          eventTarget: o(eventTargetEntry?.target),
          eventType: mainEntry.name,
          eventTime: mainEntry.startTime,
          eventEntry: mainEntry,
          loadState: n(mainEntry.startTime),
        };
      } else {
        entry.attribution = {};
      }
    })(event);
    callback(event);
  }, options);
})(
  function (event) {
    const { attribution, value } = event;
    if (ee !== null) {
      if (se()) {
        ee.info.microSessionCount += 1;
        K({
          monorailRegion: ee.config.monorailRegion,
          schema: J.OnInteraction,
          rawData: {
            ...ee.info,
            ...ee.config.storefrontData,
            ...ee.performanceMetrics,
            interactionToNextPaint: Math.round(value),
            interactionToNextPaintTarget: attribution.eventTarget,
          },
        });
      }
    } else {
      console.debug('⛔️ Shopify/perf-kit is not initialized');
    }
  },
  { reportAllChanges: true }
);

(function (callback, options) {
  measureTTFB(function (event) {
    (function (entry) {
      if (entry.entries.length) {
        const firstEntry = entry.entries[0];
        const activationStart = firstEntry.activationStart || 0;

        const waitingTime = Math.max(
          firstEntry.domainLookupStart - activationStart,
          0
        );
        const dnsTime =
          Math.max(firstEntry.connectStart - activationStart, 0) - waitingTime;
        const connectionTime =
          Math.max(firstEntry.requestStart - activationStart, 0) -
          waitingTime -
          dnsTime;
        const requestTime = entry.value - firstEntry.requestStart;

        entry.attribution = {
          waitingTime,
          dnsTime,
          connectionTime,
          requestTime,
          navigationEntry: firstEntry,
        };
      } else {
        entry.attribution = {
          waitingTime: 0,
          dnsTime: 0,
          connectionTime: 0,
          requestTime: 0,
        };
      }
    })(event);

    callback(event);
  }, options);
})(function (event) {
  const { value } = event;
  re.add({
    timeToFirstByte: Math.round(value),
  });
});

addEventListener('DOMContentLoaded', () => {
  te = document.visibilityState === 'hidden';
});

addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    oe();
  }
});

(function initializePerfKit() {
  const { dataset } = document.currentScript;

  try {
    t = validateConfig(dataset);
    ee = new ne(t);

    if (t.spaMode) {
      window.PerfKit = {
        navigate: () => {
          if (!W) {
            if (!Y) {
              oe();
              ee = new ne(t);
              Y = true;
            }
          } else {
            W = false;
          }
        },
        setPageType: (pageType) => {
          t.storefrontData.pageType = pageType;
        },
      };
    }
  } catch (error) {
    console.error('🚫 Error initializing PerfKit:', error.message);
  }

  let t;

  function validateConfig(config) {
    if (!config.application) {
      throw new Error('Application is missing');
    }

    const applicationType = config.application.toLowerCase();
    if (!['storefront-renderer', 'hydrogen'].includes(applicationType)) {
      throw new Error('Invalid application type');
    }

    if (!config.shopId) {
      throw new Error('shopId is missing');
    }

    if (!config.themeInstanceId && !config.storefrontId) {
      throw new Error(
        'Either `themeInstanceId` or `storefrontId` must be defined'
      );
    }

    ['shopId', 'humannessScore', 'themeInstanceId', 'storefrontId'].forEach(
      (key) => {
        if (config[key] && isNaN(Number(config[key]))) {
          throw new Error(`Invalid ${key}`);
        }
      }
    );

    if (
      config.monorailRegion &&
      !['shop_domain', 'global', 'staging', 'canada'].includes(
        config.monorailRegion.toLowerCase()
      )
    ) {
      throw new Error('Invalid monorail region');
    }

    if (
      config.resourceTimingSamplingRate &&
      (isNaN(Number(config.resourceTimingSamplingRate)) ||
        Number(config.resourceTimingSamplingRate) < H ||
        Number(config.resourceTimingSamplingRate) > 100)
    ) {
      throw new Error('Invalid resource timing sampling rate');
    }

    return {
      storefrontData: {
        application: applicationType,
        shopId: Number(config.shopId),
        renderRegion: config.renderRegion,
        pageType: config.pageType,
        seoBot: config.seoBot === 'true',
        humannessScore: Number(config.humannessScore) || undefined,
        ja3Fingerprint: config.ja3Fingerprint,
        themeInstanceId: Number(config.themeInstanceId) || undefined,
        storefrontId: Number(config.storefrontId) || undefined,
      },
      monorailRegion: config.monorailRegion,
      resourceTimingSamplingRate:
        Number(config.resourceTimingSamplingRate) || undefined,
      spaMode: config.spaMode === 'true',
    };
  }
})();


// !function() {
//   "use strict";
//   var e, t = function() {
//       return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
//   }, n = function(e) {
//       if ("loading" === document.readyState)
//           return "loading";
//       var n = t();
//       if (n) {
//           if (e < n.domInteractive)
//               return "loading";
//           if (0 === n.domContentLoadedEventStart || e < n.domContentLoadedEventStart)
//               return "dom-interactive";
//           if (0 === n.domComplete || e < n.domComplete)
//               return "dom-content-loaded"
//       }
//       return "complete"
//   }, r = function(e) {
//       var t = e.nodeName;
//       return 1 === e.nodeType ? t.toLowerCase() : t.toUpperCase().replace(/^#/, "")
//   }, o = function(e, t) {
//       var n = "";
//       try {
//           for (; e && 9 !== e.nodeType; ) {
//               var o = e
//                 , i = o.id ? "#" + o.id : r(o) + (o.classList && o.classList.value && o.classList.value.trim() && o.classList.value.trim().length ? "." + o.classList.value.trim().replace(/\s+/g, ".") : "");
//               if (n.length + i.length > (t || 100) - 1)
//                   return n || i;
//               if (n = n ? i + ">" + n : i,
//               o.id)
//                   break;
//               e = o.parentNode
//           }
//       } catch (e) {}
//       return n
//   }, i = -1, a = function() {
//       return i
//   }, s = function(e) {
//       addEventListener("pageshow", (function(t) {
//           t.persisted && (i = t.timeStamp,
//           e(t))
//       }
//       ), !0)
//   }, c = function() {
//       var e = t();
//       return e && e.activationStart || 0
//   }, u = function(e, n) {
//       var r = t()
//         , o = "navigate";
//       return a() >= 0 ? o = "back-forward-cache" : r && (document.prerendering || c() > 0 ? o = "prerender" : document.wasDiscarded ? o = "restore" : r.type && (o = r.type.replace(/_/g, "-"))),
//       {
//           name: e,
//           value: void 0 === n ? -1 : n,
//           rating: "good",
//           delta: 0,
//           entries: [],
//           id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12),
//           navigationType: o
//       }
//   }, d = function(e, t, n) {
//       try {
//           if (PerformanceObserver.supportedEntryTypes.includes(e)) {
//               var r = new PerformanceObserver((function(e) {
//                   Promise.resolve().then((function() {
//                       t(e.getEntries())
//                   }
//                   ))
//               }
//               ));
//               return r.observe(Object.assign({
//                   type: e,
//                   buffered: !0
//               }, n || {})),
//               r
//           }
//       } catch (e) {}
//   }, f = function(e, t, n, r) {
//       var o, i;
//       return function(a) {
//           t.value >= 0 && (a || r) && ((i = t.value - (o || 0)) || void 0 === o) && (o = t.value,
//           t.delta = i,
//           t.rating = function(e, t) {
//               return e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good"
//           }(t.value, n),
//           e(t))
//       }
//   }, l = function(e) {
//       requestAnimationFrame((function() {
//           return requestAnimationFrame((function() {
//               return e()
//           }
//           ))
//       }
//       ))
//   }, m = function(e) {
//       var t = function(t) {
//           "pagehide" !== t.type && "hidden" !== document.visibilityState || e(t)
//       };
//       addEventListener("visibilitychange", t, !0),
//       addEventListener("pagehide", t, !0)
//   }, p = function(e) {
//       var t = !1;
//       return function(n) {
//           t || (e(n),
//           t = !0)
//       }
//   }, g = -1, h = function() {
//       return "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0
//   }, v = function(e) {
//       "hidden" === document.visibilityState && g > -1 && (g = "visibilitychange" === e.type ? e.timeStamp : 0,
//       S())
//   }, y = function() {
//       addEventListener("visibilitychange", v, !0),
//       addEventListener("prerenderingchange", v, !0)
//   }, S = function() {
//       removeEventListener("visibilitychange", v, !0),
//       removeEventListener("prerenderingchange", v, !0)
//   }, T = function() {
//       return g < 0 && (g = h(),
//       y(),
//       s((function() {
//           setTimeout((function() {
//               g = h(),
//               y()
//           }
//           ), 0)
//       }
//       ))),
//       {
//           get firstHiddenTime() {
//               return g
//           }
//       }
//   }, _ = function(e) {
//       document.prerendering ? addEventListener("prerenderingchange", (function() {
//           return e()
//       }
//       ), !0) : e()
//   }, w = [1800, 3e3], E = function(e, t) {
//       t = t || {},
//       _((function() {
//           var n, r = T(), o = u("FCP"), i = d("paint", (function(e) {
//               e.forEach((function(e) {
//                   "first-contentful-paint" === e.name && (i.disconnect(),
//                   e.startTime < r.firstHiddenTime && (o.value = Math.max(e.startTime - c(), 0),
//                   o.entries.push(e),
//                   n(!0)))
//               }
//               ))
//           }
//           ));
//           i && (n = f(e, o, w, t.reportAllChanges),
//           s((function(r) {
//               o = u("FCP"),
//               n = f(e, o, w, t.reportAllChanges),
//               l((function() {
//                   o.value = performance.now() - r.timeStamp,
//                   n(!0)
//               }
//               ))
//           }
//           )))
//       }
//       ))
//   }, C = [.1, .25], b = 0, x = 1 / 0, I = 0, M = function(e) {
//       e.forEach((function(e) {
//           e.interactionId && (x = Math.min(x, e.interactionId),
//           I = Math.max(I, e.interactionId),
//           b = I ? (I - x) / 7 + 1 : 0)
//       }
//       ))
//   }, L = function() {
//       return e ? b : performance.interactionCount || 0
//   }, k = function() {
//       "interactionCount"in performance || e || (e = d("event", M, {
//           type: "event",
//           buffered: !0,
//           durationThreshold: 0
//       }))
//   }, P = [200, 500], B = 0, R = function() {
//       return L() - B
//   }, N = [], O = {}, q = function(e) {
//       var t = N[N.length - 1]
//         , n = O[e.interactionId];
//       if (n || N.length < 10 || e.duration > t.latency) {
//           if (n)
//               n.entries.push(e),
//               n.latency = Math.max(n.latency, e.duration);
//           else {
//               var r = {
//                   id: e.interactionId,
//                   latency: e.duration,
//                   entries: [e]
//               };
//               O[r.id] = r,
//               N.push(r)
//           }
//           N.sort((function(e, t) {
//               return t.latency - e.latency
//           }
//           )),
//           N.splice(10).forEach((function(e) {
//               delete O[e.id]
//           }
//           ))
//       }
//   }, A = [2500, 4e3], z = {}, F = [800, 1800], D = function e(t) {
//       document.prerendering ? _((function() {
//           return e(t)
//       }
//       )) : "complete" !== document.readyState ? addEventListener("load", (function() {
//           return e(t)
//       }
//       ), !0) : setTimeout(t, 0)
//   }, j = function(e, n) {
//       n = n || {};
//       var r = u("TTFB")
//         , o = f(e, r, F, n.reportAllChanges);
//       D((function() {
//           var i = t();
//           if (i) {
//               var a = i.responseStart;
//               if (a <= 0 || a > performance.now())
//                   return;
//               r.value = Math.max(a - c(), 0),
//               r.entries = [i],
//               o(!0),
//               s((function() {
//                   r = u("TTFB", 0),
//                   (o = f(e, r, F, n.reportAllChanges))(!0)
//               }
//               ))
//           }
//       }
//       ))
//   };
//   const H = 10;
//   const U = Object.freeze({
//       shop_domain: `${window.location.origin}/.well-known/shopify/monorail/v1/produce`,
//       global: "https://monorail-edge.shopifysvc.com/v1/produce",
//       canada: "https://monorail-edge-ca.shopifycloud.com/v1/produce",
//       staging: "https://monorail-edge-staging.shopifycloud.com/v1/produce"
//   });
//   var J;
//   function K({monorailRegion: e, schema: t, rawData: n}) {
//       const r = Date.now()
//         , o = {
//           schema_id: t,
//           payload: t === J.OnUnload ? $(n) : (i = n,
//           {
//               url: i.url,
//               page_type: i.pageType,
//               shop_id: i.shopId,
//               application: i.application,
//               storefront_id: i.storefrontId,
//               theme_instance_id: i.themeInstanceId,
//               session_token: i.sessionToken,
//               unique_token: i.uniqueToken,
//               micro_session_id: i.microSessionId,
//               micro_session_count: i.microSessionCount,
//               interaction_to_next_paint: i.interactionToNextPaint,
//               interaction_to_next_paint_target: i.interactionToNextPaintTarget,
//               seo_bot: i.seoBot,
//               humanness_score: i.humannessScore,
//               ja3_fingerprint: i.ja3Fingerprint,
//               referrer: i.referrer,
//               worker_start: i.workerStart,
//               next_hop_protocol: i.nextHopProtocol,
//               navigation_bad: i.navigationBad
//           }),
//           metadata: {
//               event_created_at_ms: r,
//               event_sent_at_ms: r
//           }
//       };
//       var i;
//       try {
//           const t = U[e || ""];
//           if (!t)
//               return void console.debug("📡 Monorail: ", JSON.stringify(o, null, 2));
//           if ("function" != typeof window.navigator.sendBeacon || "function" != typeof window.Blob || function() {
//               const {userAgent: e} = window.navigator;
//               return -1 !== e.lastIndexOf("iPhone; CPU iPhone OS 12_") || -1 !== e.lastIndexOf("iPad; CPU OS 12_")
//           }()) {
//               const e = new XMLHttpRequest;
//               e.open("POST", t),
//               e.setRequestHeader("Content-type", "text/plain"),
//               e.send(JSON.stringify(o))
//           } else {
//               const e = new window.Blob([JSON.stringify(o)],{
//                   type: "text/plain"
//               });
//               window.navigator.sendBeacon(t, e)
//           }
//       } catch (e) {}
//   }
//   function $(e) {
//       const t = ["domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "firstPaint", "visuallyReady", "initiatorType", "redirectCount"].reduce(( (t, n) => {
//           var r;
//           return e[n] && (t[(r = n,
//           r.replace(/[A-Z]/g, (e => `_${e.toLowerCase()}`)))] = e[n] || null),
//           t
//       }
//       ), {});
//       return {
//           perf_kit_init: e.perfKitInit,
//           perf_kit_version: e.perfKitVersion,
//           url: e.url,
//           page_type: e.pageType,
//           shop_id: e.shopId,
//           application: e.application,
//           storefront_id: e.storefrontId,
//           theme_instance_id: e.themeInstanceId,
//           session_token: e.sessionToken,
//           unique_token: e.uniqueToken,
//           micro_session_id: e.microSessionId,
//           micro_session_count: e.microSessionCount,
//           cumulative_layout_shift: e.cumulativeLayoutShift,
//           cumulative_layout_shift_target: e.cumulativeLayoutShiftTarget,
//           first_contentful_paint: e.firstContentfulPaint,
//           largest_contentful_paint: e.largestContentfulPaint,
//           largest_contentful_paint_target: e.largestContentfulPaintTarget,
//           time_to_first_byte: e.timeToFirstByte,
//           seo_bot: e.seoBot,
//           humanness_score: e.humannessScore,
//           ja3_fingerprint: e.ja3Fingerprint,
//           navigation_start: e.navigationStart,
//           navigation_type: e.navigationType,
//           navigation_bad: e.navigationBad,
//           encoded_body_size: e.encodedBodySize,
//           decoded_body_size: e.decodedBodySize,
//           transfer_size: e.transferSize,
//           response_start: e.responseStart,
//           response_end: e.responseEnd,
//           worker_start: e.workerStart,
//           connect_start: e.connectStart,
//           connect_end: e.connectEnd,
//           domain_lookup_start: e.domainLookupStart,
//           domain_lookup_end: e.domainLookupEnd,
//           fetch_start: e.fetchStart,
//           redirect_start: e.redirectStart,
//           redirect_end: e.redirectEnd,
//           request_start: e.requestStart,
//           secure_connection_start: e.secureConnectionStart,
//           next_hop_protocol: e.nextHopProtocol,
//           server_timing: e.serverTiming,
//           paint_timing_hidden: e.paintTimingHidden,
//           referrer: e.referrer,
//           render_region: e.renderRegion,
//           resource_timing: e.resourceTiming,
//           other_metrics: JSON.stringify(t)
//       }
//   }
//   !function(e) {
//       e.OnInteraction = "perf_kit_on_interaction/3.0",
//       e.OnUnload = "perf_kit_on_unload/3.1"
//   }(J || (J = {}));
//   const V = "https://cdn.shopify.com/shopifycloud/privacy-banner/storefront-banner.js"
//     , X = "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js";
//   async function Z() {
//       try {
//           return Array.from(document.scripts).some((e => e.src === V || e.src === X)) ? Promise.resolve(!0) : await new Promise(( (e, t) => {
//               const n = document.createElement("script");
//               n.type = "text/javascript",
//               n.src = X,
//               n.onload = () => {
//                   e(!0)
//               }
//               ,
//               n.onerror = () => {
//                   t(new Error("Could not load consent script"))
//               }
//               ,
//               document.head.appendChild(n)
//           }
//           ))
//       } catch (e) {}
//       return Promise.resolve(!1)
//   }
//   const G = "xxxx-4xxx-xxxx-xxxxxxxxxxxx";
//   function Q() {
//       let e = "";
//       try {
//           const t = window.crypto
//             , n = new Uint16Array(31);
//           t.getRandomValues(n);
//           let r = 0;
//           e = G.replace(/[x]/g, (e => {
//               const t = n[r] % 16;
//               return r++,
//               ("x" === e ? t : 3 & t | 8).toString(16)
//           }
//           )).toUpperCase()
//       } catch (t) {
//           e = G.replace(/[x]/g, (e => {
//               const t = 16 * Math.random() | 0;
//               return ("x" === e ? t : 3 & t | 8).toString(16)
//           }
//           )).toUpperCase()
//       }
//       return `${function() {
//           lete = 0
//             , t = 0;
//           e = (new Date).getTime() >>> 0;
//           try {
//               t = performance.now() >>> 0
//           } catch (e) {
//               t = 0
//           }
//           return Math.abs(e + t).toString(16).toLowerCase().padStart(8, "0")
//       }()}-${e}`
//   }
//   let W = !0
//     , Y = !1
//     , ee = null
//     , te = !1;
//   class ne {
//       info;
//       config;
//       performanceMetrics;
//       constructor(e) {
//           const t = /_shopify_s=([^;]*)/.exec(document.cookie)
//             , n = t ? t[1] : void 0
//             , r = /_shopify_y=([^;]*)/.exec(document.cookie)
//             , o = r ? r[1] : void 0;
//           this.config = e,
//           this.info = {
//               perfKitInit: Date.now(),
//               perfKitVersion: "1.0.0",
//               url: window.location.href,
//               referrer: document.referrer || void 0,
//               microSessionId: Q(),
//               microSessionCount: 0,
//               sessionToken: n,
//               uniqueToken: o
//           },
//           performance.setResourceTimingBufferSize(1e3),
//           this.performanceMetrics = function(e) {
//               const t = performance.getEntriesByType("navigation");
//               if (0 === t.length)
//                   return {};
//               const n = t[0];
//               let r = !1;
//               return (n.requestStart && n.startTime && n.requestStart < n.startTime || n.responseStart && n.startTime && n.responseStart < n.startTime || n.responseStart && n.fetchStart && n.responseStart < n.fetchStart || n.startTime && n.fetchStart < n.startTime || n.responseEnd && n.responseEnd > e + 864e5) && (r = !0),
//               {
//                   encodedBodySize: n.encodedBodySize,
//                   decodedBodySize: n.decodedBodySize,
//                   navigationStart: Math.round(n.startTime),
//                   navigationType: n.type,
//                   navigationBad: r,
//                   responseStart: Math.round(n.responseStart),
//                   responseEnd: Math.round(n.responseEnd),
//                   workerStart: Math.round(n.workerStart),
//                   connectStart: Math.round(n.connectStart),
//                   connectEnd: Math.round(n.connectEnd),
//                   domainLookupStart: Math.round(n.domainLookupStart),
//                   domainLookupEnd: Math.round(n.domainLookupEnd),
//                   fetchStart: Math.round(n.fetchStart),
//                   redirectStart: Math.round(n.redirectStart),
//                   redirectEnd: Math.round(n.redirectEnd),
//                   requestStart: Math.round(n.requestStart),
//                   secureConnectionStart: Math.round(n.secureConnectionStart),
//                   nextHopProtocol: n.nextHopProtocol,
//                   serverTiming: JSON.stringify(n.serverTiming),
//                   domInteractive: Math.round(n.domInteractive),
//                   domComplete: Math.round(n.domComplete),
//                   domContentLoadedEventStart: Math.round(n.domContentLoadedEventStart),
//                   domContentLoadedEventEnd: Math.round(n.domContentLoadedEventEnd),
//                   redirectCount: n.redirectCount,
//                   initiatorType: n.initiatorType,
//                   transferSize: n.transferSize
//               }
//           }(this.info.perfKitInit),
//           async function() {
//               const {Shopify: e} = window;
//               e && e.customerPrivacy || await Z()
//           }()
//       }
//   }
//   const re = new Set;
//   function oe() {
//       if (null !== ee) {
//           if (se() && re.size > 0) {
//               let e = {};
//               for (const t of re)
//                   e = {
//                       ...e,
//                       ...t
//                   };
//               re.clear(),
//               ee.info.microSessionCount += 1;
//               const t = function(e) {
//                   if (!(100 * Math.random() > (e || H)))
//                       return performance.getEntriesByType("resource").map((e => {
//                           const t = Object.entries(e.toJSON()).map(( ([e,t]) => "number" == typeof t ? [e, Math.round(t)] : [e, t]));
//                           return JSON.stringify(Object.fromEntries(t))
//                       }
//                       ))
//               }(ee.config.resourceTimingSamplingRate);
//               K({
//                   monorailRegion: ee.config.monorailRegion,
//                   schema: J.OnUnload,
//                   rawData: {
//                       ...ee.info,
//                       ...ee.config.storefrontData,
//                       ...ee.performanceMetrics,
//                       ...e,
//                       resourceTiming: t,
//                       paintTimingHidden: te
//                   }
//               })
//           }
//       } else
//           console.debug("⛔️ Shopify/perf-kit is not initialized")
//   }
//   var ie, ae;
//   function se() {
//       return window?.Shopify?.customerPrivacy?.analyticsProcessingAllowed()
//   }
//   ie = function(e) {
//       const {attribution: t, value: n} = e;
//       re.add({
//           cumulativeLayoutShift: n,
//           cumulativeLayoutShiftTarget: t.largestShiftTarget
//       })
//   }
//   ,
//   function(e, t) {
//       t = t || {},
//       E(p((function() {
//           var n, r = u("CLS", 0), o = 0, i = [], a = function(e) {
//               e.forEach((function(e) {
//                   if (!e.hadRecentInput) {
//                       var t = i[0]
//                         , n = i[i.length - 1];
//                       o && e.startTime - n.startTime < 1e3 && e.startTime - t.startTime < 5e3 ? (o += e.value,
//                       i.push(e)) : (o = e.value,
//                       i = [e])
//                   }
//               }
//               )),
//               o > r.value && (r.value = o,
//               r.entries = i,
//               n())
//           }, c = d("layout-shift", a);
//           c && (n = f(e, r, C, t.reportAllChanges),
//           m((function() {
//               a(c.takeRecords()),
//               n(!0)
//           }
//           )),
//           s((function() {
//               o = 0,
//               r = u("CLS", 0),
//               n = f(e, r, C, t.reportAllChanges),
//               l((function() {
//                   return n()
//               }
//               ))
//           }
//           )),
//           setTimeout(n, 0))
//       }
//       )))
//   }((function(e) {
//       !function(e) {
//           if (e.entries.length) {
//               var t = e.entries.reduce((function(e, t) {
//                   return e && e.value > t.value ? e : t
//               }
//               ));
//               if (t && t.sources && t.sources.length) {
//                   var r = (i = t.sources).find((function(e) {
//                       return e.node && 1 === e.node.nodeType
//                   }
//                   )) || i[0];
//                   if (r)
//                       return void (e.attribution = {
//                           largestShiftTarget: o(r.node),
//                           largestShiftTime: t.startTime,
//                           largestShiftValue: t.value,
//                           largestShiftSource: r,
//                           largestShiftEntry: t,
//                           loadState: n(t.startTime)
//                       })
//               }
//           }
//           var i;
//           e.attribution = {}
//       }(e),
//       ie(e)
//   }
//   ), ae),
//   function(e, n) {
//       !function(e, t) {
//           t = t || {},
//           _((function() {
//               var n, r = T(), o = u("LCP"), i = function(e) {
//                   var t = e[e.length - 1];
//                   t && t.startTime < r.firstHiddenTime && (o.value = Math.max(t.startTime - c(), 0),
//                   o.entries = [t],
//                   n())
//               }, a = d("largest-contentful-paint", i);
//               if (a) {
//                   n = f(e, o, A, t.reportAllChanges);
//                   var g = p((function() {
//                       z[o.id] || (i(a.takeRecords()),
//                       a.disconnect(),
//                       z[o.id] = !0,
//                       n(!0))
//                   }
//                   ));
//                   ["keydown", "click"].forEach((function(e) {
//                       addEventListener(e, (function() {
//                           return setTimeout(g, 0)
//                       }
//                       ), !0)
//                   }
//                   )),
//                   m(g),
//                   s((function(r) {
//                       o = u("LCP"),
//                       n = f(e, o, A, t.reportAllChanges),
//                       l((function() {
//                           o.value = performance.now() - r.timeStamp,
//                           z[o.id] = !0,
//                           n(!0)
//                       }
//                       ))
//                   }
//                   ))
//               }
//           }
//           ))
//       }((function(n) {
//           !function(e) {
//               if (e.entries.length) {
//                   var n = t();
//                   if (n) {
//                       var r = n.activationStart || 0
//                         , i = e.entries[e.entries.length - 1]
//                         , a = i.url && performance.getEntriesByType("resource").filter((function(e) {
//                           return e.name === i.url
//                       }
//                       ))[0]
//                         , s = Math.max(0, n.responseStart - r)
//                         , c = Math.max(s, a ? (a.requestStart || a.startTime) - r : 0)
//                         , u = Math.max(c, a ? a.responseEnd - r : 0)
//                         , d = Math.max(u, i ? i.startTime - r : 0)
//                         , f = {
//                           element: o(i.element),
//                           timeToFirstByte: s,
//                           resourceLoadDelay: c - s,
//                           resourceLoadTime: u - c,
//                           elementRenderDelay: d - u,
//                           navigationEntry: n,
//                           lcpEntry: i
//                       };
//                       return i.url && (f.url = i.url),
//                       a && (f.lcpResourceEntry = a),
//                       void (e.attribution = f)
//                   }
//               }
//               e.attribution = {
//                   timeToFirstByte: 0,
//                   resourceLoadDelay: 0,
//                   resourceLoadTime: 0,
//                   elementRenderDelay: e.value
//               }
//           }(n),
//           e(n)
//       }
//       ), n)
//   }((function(e) {
//       const {attribution: t, value: n} = e;
//       re.add({
//           largestContentfulPaint: Math.round(n),
//           largestContentfulPaintTarget: t.element
//       })
//   }
//   )),
//   function(e, r) {
//       E((function(r) {
//           !function(e) {
//               if (e.entries.length) {
//                   var r = t()
//                     , o = e.entries[e.entries.length - 1];
//                   if (r) {
//                       var i = r.activationStart || 0
//                         , s = Math.max(0, r.responseStart - i);
//                       return void (e.attribution = {
//                           timeToFirstByte: s,
//                           firstByteToFCP: e.value - s,
//                           loadState: n(e.entries[0].startTime),
//                           navigationEntry: r,
//                           fcpEntry: o
//                       })
//                   }
//               }
//               e.attribution = {
//                   timeToFirstByte: 0,
//                   firstByteToFCP: e.value,
//                   loadState: n(a())
//               }
//           }(r),
//           e(r)
//       }
//       ), r)
//   }((function(e) {
//       const {value: t} = e;
//       re.add({
//           firstContentfulPaint: Math.round(t)
//       })
//   }
//   )),
//   function(e, t) {
//       !function(e, t) {
//           t = t || {},
//           _((function() {
//               var n;
//               k();
//               var r, o = u("INP"), i = function(e) {
//                   e.forEach((function(e) {
//                       e.interactionId && q(e),
//                       "first-input" === e.entryType && !N.some((function(t) {
//                           return t.entries.some((function(t) {
//                               return e.duration === t.duration && e.startTime === t.startTime
//                           }
//                           ))
//                       }
//                       )) && q(e)
//                   }
//                   ));
//                   var t, n = (t = Math.min(N.length - 1, Math.floor(R() / 50)),
//                   N[t]);
//                   n && n.latency !== o.value && (o.value = n.latency,
//                   o.entries = n.entries,
//                   r())
//               }, a = d("event", i, {
//                   durationThreshold: null !== (n = t.durationThreshold) && void 0 !== n ? n : 40
//               });
//               r = f(e, o, P, t.reportAllChanges),
//               a && ("PerformanceEventTiming"in window && "interactionId"in PerformanceEventTiming.prototype && a.observe({
//                   type: "first-input",
//                   buffered: !0
//               }),
//               m((function() {
//                   i(a.takeRecords()),
//                   o.value < 0 && R() > 0 && (o.value = 0,
//                   o.entries = []),
//                   r(!0)
//               }
//               )),
//               s((function() {
//                   N = [],
//                   B = L(),
//                   o = u("INP"),
//                   r = f(e, o, P, t.reportAllChanges)
//               }
//               )))
//           }
//           ))
//       }((function(t) {
//           !function(e) {
//               if (e.entries.length) {
//                   var t = e.entries.sort((function(e, t) {
//                       return t.duration - e.duration || t.processingEnd - t.processingStart - (e.processingEnd - e.processingStart)
//                   }
//                   ))[0]
//                     , r = e.entries.find((function(e) {
//                       return e.target
//                   }
//                   ));
//                   e.attribution = {
//                       eventTarget: o(r && r.target),
//                       eventType: t.name,
//                       eventTime: t.startTime,
//                       eventEntry: t,
//                       loadState: n(t.startTime)
//                   }
//               } else
//                   e.attribution = {}
//           }(t),
//           e(t)
//       }
//       ), t)
//   }((function(e) {
//       const {attribution: t, value: n} = e;
//       null !== ee ? se() && (ee.info.microSessionCount += 1,
//       K({
//           monorailRegion: ee.config.monorailRegion,
//           schema: J.OnInteraction,
//           rawData: {
//               ...ee.info,
//               ...ee.config.storefrontData,
//               ...ee.performanceMetrics,
//               interactionToNextPaint: Math.round(n),
//               interactionToNextPaintTarget: t.eventTarget
//           }
//       })) : console.debug("⛔️ Shopify/perf-kit is not initialized")
//   }
//   ), {
//       reportAllChanges: !0
//   }),
//   function(e, t) {
//       j((function(t) {
//           !function(e) {
//               if (e.entries.length) {
//                   var t = e.entries[0]
//                     , n = t.activationStart || 0
//                     , r = Math.max(t.domainLookupStart - n, 0)
//                     , o = Math.max(t.connectStart - n, 0)
//                     , i = Math.max(t.requestStart - n, 0);
//                   e.attribution = {
//                       waitingTime: r,
//                       dnsTime: o - r,
//                       connectionTime: i - o,
//                       requestTime: e.value - i,
//                       navigationEntry: t
//                   }
//               } else
//                   e.attribution = {
//                       waitingTime: 0,
//                       dnsTime: 0,
//                       connectionTime: 0,
//                       requestTime: 0
//                   }
//           }(t),
//           e(t)
//       }
//       ), t)
//   }((function(e) {
//       const {value: t} = e;
//       re.add({
//           timeToFirstByte: Math.round(t)
//       })
//   }
//   )),
//   addEventListener("DOMContentLoaded", ( () => {
//       te = "hidden" === document.visibilityState
//   }
//   )),
//   addEventListener("visibilitychange", ( () => {
//       "hidden" === document.visibilityState && oe()
//   }
//   )),
//   function() {
//       const {dataset: e} = document.currentScript;
//       try {
//           t = function(e) {
//               if (!e.application)
//                   throw new Error("Application is missing");
//               if (!["storefront-renderer", "hydrogen"].includes(e.application.toLowerCase()))
//                   throw new Error("Invalid application type");
//               if (!e.shopId)
//                   throw new Error("shopId is missing");
//               if (!e.themeInstanceId && !e.storefrontId)
//                   throw new Error("Either `themeInstanceId` or `storefrontId` must be defined");
//               for (const t of ["shopId", "humannessScore", "themeInstanceId", "storefrontId"])
//                   if (e[t] && isNaN(Number(e[t])))
//                       throw new Error(`Invalid ${t}`);
//               if (e.monorailRegion && !["shop_domain", "global", "staging", "canada"].includes(e.monorailRegion.toLowerCase()))
//                   throw new Error("Invalid monorail region");
//               if (e.resourceTimingSamplingRate && (isNaN(Number(e.resourceTimingSamplingRate)) || Number(e.resourceTimingSamplingRate) < H || Number(e.resourceTimingSamplingRate) > 100))
//                   throw new Error("Invalid resource timing sampling rate");
//               return {
//                   storefrontData: {
//                       application: e.application.toLowerCase(),
//                       shopId: Number(e.shopId),
//                       renderRegion: e.renderRegion,
//                       pageType: e.pageType,
//                       seoBot: "true" === e.seoBot,
//                       humannessScore: Number(e.humannessScore) || void 0,
//                       ja3Fingerprint: e.ja3Fingerprint,
//                       themeInstanceId: Number(e.themeInstanceId) || void 0,
//                       storefrontId: Number(e.storefrontId) || void 0
//                   },
//                   monorailRegion: e.monorailRegion,
//                   resourceTimingSamplingRate: Number(e.resourceTimingSamplingRate) || void 0,
//                   spaMode: "true" === e.spaMode
//               }
//           }(e),
//           ee = new ne(t),
//           t.spaMode && (window.PerfKit = {
//               navigate: () => {
//                   W ? W = !1 : Y || (oe(),
//                   ee = new ne(t),
//                   Y = !0)
//               }
//               ,
//               setPageType: e => {
//                   t.storefrontData.pageType = e
//               }
//           })
//       } catch (e) {
//           console.error("🚫 Error initializing PerfKit:", e.message)
//       }
//       var t
//   }()
// }();
