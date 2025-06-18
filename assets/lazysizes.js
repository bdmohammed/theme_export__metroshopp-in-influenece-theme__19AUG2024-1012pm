window.lazySizesT4Config = window.lazySizesT4Config || {
  init: true,
  loadMode: true,
  loadHidden: false,
  hFac: 0.5,
  expFactor: 2,
  ricTimeout: 150,
  lazyClass: "lazyload",
  loadingClass: "lazyloading",
  loadedClass: "lazyloaded",
  preloadClass: "lazypreload",
};

((window, callback) => {
  const lazyUnveilReadHandler = function () {
    callback(window.lazySizesT4);
    window.removeEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  };

  callback = callback.bind(null, window, window.document);

  // CommonJS module handling
  if (typeof module === "object" && module.exports) {
    callback(require("lazySizesT4"));
  } else if (window.lazySizesT4) {
    lazyUnveilReadHandler();
  } else {
    window.addEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  }
})(globalThis, (lazySizesT4, document, instance) => {
  "use strict";

  const loadedScripts = {};

  const loadResource = (url, isStylesheet) => {
    if (!loadedScripts[url]) {
      const element = document.createElement(isStylesheet ? "link" : "script");
      const firstScript = document.getElementsByTagName("script")[0];

      if (isStylesheet) {
        element.rel = "stylesheet";
        element.href = url;
      } else {
        element.src = url;
      }

      loadedScripts[url] = true;
      loadedScripts[element.src || element.href] = true;
      firstScript.parentNode.insertBefore(element, firstScript);
    }
  };

  // Load images and handle their events
  const preloadImage = (url, callback) => {
    const img = document.createElement("img");
    img.onload = function () {
      img.onload = null;
      img.onerror = null;
      callback();
    };
    img.onerror = img.onload;
    img.src = url;

    // Trigger onload immediately if the image is already cached
    if (img.complete && img.onload) {
      img.onload();
    }
  };

  // Lazy load handling
  document.addEventListener(
    "lazybeforeunveil",
    (event) => {
      if (event.detail.instance === instance) {
        if (!event.defaultPrevented) {
          const target = event.target;

          // Set preload attribute if it's none
          if (target.preload === "none") {
            target.preload = "auto";
          }

          // Handle autoplay behavior
          if (target.hasAttribute("data-autoplay")) {
            if (target.hasAttribute("data-expand") && !target.autoplay) {
              try {
                target.play();
              } catch (e) {}
            } else {
              requestAnimationFrame(() => {
                target.setAttribute("data-expand", "-10");
                instance.aC(target, instance.cfg.lazyClass);
              });
            }
          }

          // Load additional resources
          let resourceUrl;

          if ((resourceUrl = target.getAttribute("data-link"))) {
            loadResource(resourceUrl, true);
          }
          if ((resourceUrl = target.getAttribute("data-script"))) {
            loadResource(resourceUrl);
          }
          if ((resourceUrl = target.getAttribute("data-require"))) {
            if (instance.cfg.requireJs) {
              instance.cfg.requireJs([resourceUrl]);
            } else {
              loadResource(resourceUrl);
            }
          }

          // Handle background images
          const backgroundImageUrl = target.getAttribute("data-bg");
          if (backgroundImageUrl) {
            event.detail.firesLoad = true;
            preloadImage(backgroundImageUrl, () => {
              target.style.backgroundImage = `url(${
                /\(|\)|\s|'/.test(backgroundImageUrl)
                  ? JSON.stringify(backgroundImageUrl)
                  : backgroundImageUrl
              })`;
              event.detail.firesLoad = false;
              instance.fire(target, "_lazyloaded", {}, true, true);
            });
          }

          // Handle poster images
          const posterUrl = target.getAttribute("data-poster");
          if (posterUrl) {
            event.detail.firesLoad = true;
            preloadImage(posterUrl, () => {
              target.poster = posterUrl;
              event.detail.firesLoad = false;
              instance.fire(target, "_lazyloaded", {}, true, true);
            });
          }
        }
      }
    },
    false,
  );
});

((window, callback) => {
  const lazyUnveilReadHandler = () => {
    callback(window.lazySizesT4);
    window.removeEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  };

  callback = callback.bind(null, window, window.document);

  // Module loading support
  if (typeof module === "object" && module.exports) {
    callback(require("lazySizesT4"));
  } else if (typeof define === "function" && define.amd) {
    define(["lazySizesT4"], callback);
  } else if (window.lazySizesT4) {
    lazyUnveilReadHandler();
  } else {
    window.addEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  }
})(globalThis, (lazySizesT4, document, instance) => {
  "use strict";

  addEventListener(
    "lazybeforeunveil",
    (event) => {
      const target = event.target;
      const bgSetAttr = target.getAttribute("data-bgset");
      const isNotWidthOne = "1" !== new URLSearchParams(bgSetAttr).get("width");

      if (
        !(
          event.defaultPrevented ||
          !bgSetAttr ||
          bgSetAttr.indexOf("_1x1.") < 0 ||
          isNotWidthOne
        )
      ) {
        let ratios = target.getAttribute("data-ratio") || 0;
        const hasHash = target.hasAttribute("data-hash");
        let url = bgSetAttr;
        let processedBgSet = "";

        // Set of default widths
        const defaultWidths = target.hasAttribute("data-widths")
          ? JSON.parse(target.getAttribute("data-widths"))
          : target.hasAttribute("data-wiis")
            ? [180, 360, 540, 720, 900, 1080]
            : [
                180, 360, 540, 720, 900, 1080, 1296, 1512, 1728, 1950, 2100,
                2260, 2450, 2700, 3000, 3350, 3750, 4100,
              ];

        const length = defaultWidths.length;
        const splitUrl = hasHash ? url.split("_1x1.") : url.split("width=1");
        const baseUrl = hasHash ? `${splitUrl[0]}x.` : `${splitUrl[0]}width=`;
        const suffix = splitUrl[1];

        // Construct the data-bgset attribute based on conditions
        if (hasHash && ratios > 0) {
          for (let i = 0; i < length; i++) {
            processedBgSet += `${baseUrl}_${defaultWidths[i]}${suffix} ${
              defaultWidths[i]
            }w ${Math.round(defaultWidths[i] * ratios)}h, `;
          }
        } else {
          for (let i = 0; i < length; i++) {
            processedBgSet += `${baseUrl}_${defaultWidths[i]}${suffix} ${defaultWidths[i]}w, `;
          }
        }

        // Remove the trailing comma and space
        processedBgSet = processedBgSet.slice(0, -2);
        target.setAttribute("data-bgset", processedBgSet);
      }
    },
    true,
  );
});

((window, callback) => {
  const lazyUnveilReadHandler = function () {
    callback(window.lazySizesT4);
    window.removeEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  };

  callback = callback.bind(null, window, window.document);

  // Module loading support
  if (typeof module === "object" && module.exports) {
    callback(require("lazySizesT4"));
  } else if (window.lazySizesT4) {
    lazyUnveilReadHandler();
  } else {
    window.addEventListener("lazyunveilread", lazyUnveilReadHandler, true);
  }
})(globalThis, (lazySizesT4, document, instance) => {
  "use strict";
  const config = instance.cfg;
  const spaceRegex = /\s+/g;
  const pipeRegex = /\s*\|\s+|\s+\|\s*/g;
  const bgsetPattern = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/;
  const typePattern = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/;
  const singleQuotesPattern = /\(|\)|'/;
  const fitModes = { contain: 1, cover: 1 };

  const setMediaOrType = (element, type) => {
    if (type) {
      const match = type.match(typePattern);
      if (match && match[1]) {
        element.setAttribute("type", match[1]);
      } else {
        element.setAttribute("media", config.customMedia[type] || type);
      }
    }
  };

  const loadBackgroundImage = (event) => {
    const target = event.target;
    const lazyBgSet = target._lazybgset;
    const currentSrc = target.currentSrc || target.src;

    if (lazyBgSet && currentSrc) {
      const result = instance.fire(lazyBgSet, "bgsetproxy", {
        src: currentSrc,
        useSrc: singleQuotesPattern.test(currentSrc)
          ? JSON.stringify(currentSrc)
          : currentSrc,
      });

      if (!result.defaultPrevented) {
        lazyBgSet.style.backgroundImage = `url(${result.detail.useSrc})`;
      }
    }

    if (target._lazybgsetLoading) {
      instance.fire(lazyBgSet, "_lazyloaded", {}, false, true);
      delete target._lazybgsetLoading;
    }
  };

  addEventListener("lazybeforeunveil", (event) => {
    if (!event.defaultPrevented) {
      const bgsetAttribute = event.target.getAttribute("data-bgset");
      if (bgsetAttribute) {
        const targetElement = event.target;
        const imgElement = document.createElement("img");
        imgElement.alt = "";
        imgElement._lazybgsetLoading = true;
        event.detail.firesLoad = true;

        const handleLazyBgSet = (bgset, target, img) => {
          const pictureElement = document.createElement("picture");
          const sizes = target.getAttribute(config.sizesAttr);
          const ratio = target.getAttribute("data-ratio");
          const optimumX = target.getAttribute("data-optimumx");
          const sizesScale = target.getAttribute("data-sizes-scale");

          if (target._lazybgset && target._lazybgset.parentNode === target) {
            target.removeChild(target._lazybgset);
          }

          Object.defineProperty(img, "_lazybgset", {
            value: target,
            writable: true,
          });
          Object.defineProperty(target, "_lazybgset", {
            value: pictureElement,
            writable: true,
          });

          const sources = bgset.replace(spaceRegex, " ").split(pipeRegex);
          pictureElement.style.display = "none";
          img.className = config.lazyClass;

          if (sources.length === 1 && !sizes) {
            sizes = "auto";
          }

          sources.forEach((src) => {
            const sourceElement = document.createElement("source");
            if (sizes && sizes !== "auto") {
              sourceElement.setAttribute("sizes", sizes);
            }

            const match = src.match(bgsetPattern);
            if (match) {
              sourceElement.setAttribute(config.srcsetAttr, match[1]);
              setMediaOrType(sourceElement, match[2]);
              setMediaOrType(sourceElement, match[3]);
            } else {
              sourceElement.setAttribute(config.srcsetAttr, src);
            }

            pictureElement.appendChild(sourceElement);
          });

          if (sizes) {
            img.setAttribute(config.sizesAttr, sizes);
            target.removeAttribute(config.sizesAttr);
            target.removeAttribute("sizes");
          }
          if (optimumX) {
            img.setAttribute("data-optimumx", optimumX);
          }
          if (ratio) {
            img.setAttribute("data-ratio", ratio);
          }
          if (sizesScale) {
            img.setAttribute("data-sizes-scale", sizesScale);
          }

          pictureElement.appendChild(img);
          target.appendChild(pictureElement);
        };

        handleLazyBgSet(bgsetAttribute, targetElement, imgElement);

        setTimeout(() => {
          instance.loader.unveil(imgElement);
          instance.rAF(() => {
            instance.fire(imgElement, "_lazyloaded", {}, true, true);
            imgElement.complete && loadBackgroundImage({ target: imgElement });
          });
        });
      }
    }
  });

  document.addEventListener("load", loadBackgroundImage, true);

  // Handle resizing logic
  addEventListener(
    "lazybeforesizes",
    function (event) {
      if (
        event.detail.instance === instance &&
        event.target._lazybgset &&
        event.detail.dataAttr
      ) {
        const lazyBgSet = event.target._lazybgset;
        const parentFit =
          lazyBgSet.dataset.parentFit ||
          (() => {
            const style = getComputedStyle(lazyBgSet) || {
              getPropertyValue: () => {},
            };
            let fit = style.getPropertyValue("background-size");

            if (!fitModes[fit] && fitModes[lazyBgSet.style.backgroundSize]) {
              fit = lazyBgSet.style.backgroundSize;
            }
            return fit;
          })();

        if (fitModes[parentFit]) {
          event.target._lazySizesT4ParentFit = parentFit;
          instance.rAF(() => {
            event.target.setAttribute("data-parent-fit", parentFit);
            event.target._lazySizesT4ParentFit &&
              delete event.target._lazySizesT4ParentFit;
          });
        }
      }
    },
    true,
  );

  document.addEventListener("lazybeforesizes", function (event) {
    if (
      !event.defaultPrevented &&
      event.target._lazybgset &&
      event.detail.instance === instance
    ) {
      event.detail.width = (() => {
        const width = instance.gW(event.target, event.target.parentNode);
        if (
          !event.target._lazySizesT4Width ||
          width > event.target._lazySizesT4Width
        ) {
          event.target._lazySizesT4Width = width;
        }
        return event.target._lazySizesT4Width;
      })();
    }
  });
});

((global, initModule) => {
  // Self-invoking function to initialize lazy loading with either AMD, CommonJS, or regular inclusion
  const lazyLoadInit = () => {
    initModule(global.lazySizesT4);
    global.removeEventListener("lazyunveilread", lazyLoadInit, true);
  };

  // Bind the initialization function to the global window object
  initModule = initModule.bind(null, global, global.document);

  // Check for module system support, initialize accordingly
  if (typeof module === "object" && module.exports) {
    initModule(require("lazySizesT4"));
  } else if (typeof define === "function" && define.amd) {
    define(["lazySizesT4"], initModule);
  } else if (global.lazySizesT4) {
    lazyLoadInit();
  } else {
    global.addEventListener("lazyunveilread", lazyLoadInit, true);
  }
})(globalThis, (global, document, lazySizesInstance) => {
  "use strict";

  // Constants and Regex patterns used in parsing and conditions
  const CONDITION_PATTERN = /(.+)\s+(\(\s*(.+)\s*\))/;
  const MATCH_URL_PATTERN = /^(amd|css|module):(.+)/i;
  const SPACE_DELIMITER = /\s+/;
  const URL_SEPARATOR = /\s*,+\s+/;
  const QUOTE_PATTERN = /['"]/g;
  let conditionTypes = lazySizesInstance && lazySizesInstance.cfg;
  conditionTypes.include = conditionTypes.include || {};
  let urlMap = conditionTypes.include;
  urlMap.contentElement = urlMap.contentElement || "html";
  urlMap.conditions = urlMap.conditions || {};
  urlMap.map = urlMap.map || {};
  const readyStateTypes = { complete: 1, loaded: 1 };
  let mediaCache = {};
  let mediaElement = null;
  const resourceLoaders = {};
  const lazyConditionalElements = document.getElementsByClassName(
    "lazyconditionalinclude",
  );
  const rootRoute = Shopify.routes.root;

  function parseURL(url) {
    const matchResult = url.match(MATCH_URL_PATTERN);
    if (matchResult) {
      this.urls[matchResult[1]] = urlMap[matchResult[2]] || matchResult[2];
    } else {
      this.urls.include = urlMap.map[url] || url;
    }
  }

  function parseCondition(conditionString) {
    let parsedData, condition, name;
    conditionString = conditionString.trim();
    conditionString = urlMap.map[conditionString] || conditionString;
    parsedData = conditionString.match(CONDITION_PATTERN);

    if (parsedData) {
      name = parsedData[1];
      condition = {
        condition:
          conditionTypes.include.conditions[parsedData[1]] ||
          conditionTypes.customMedia[parsedData[1]] ||
          parsedData[2] ||
          null,
        name: name,
      };
    } else {
      name = conditionString;
      condition = {
        condition: null,
        name: "",
      };
    }

    condition.urls = {};
    (urlMap.map[name] || name)
      .split(SPACE_DELIMITER)
      .forEach(parseURL, condition);

    if (!condition.urls.include && condition.urls.amd) {
      this.saved = true;
      condition.initial = this;
    }
    return condition;
  }

  function getElementStyle(element, pseudoElement) {
    let view = element.ownerDocument.defaultView;
    view = view.opener ? view : global;
    return (
      view.getComputedStyle(element, pseudoElement || null) || {
        getPropertyValue: function () {},
        isNull: true,
      }
    );
  }

  function checkCondition(element, conditionData) {
    const isConditionMet = !conditionData.condition;
    if (!isConditionMet) {
      let content;
      if (mediaCache || mediaElement) {
        mediaElement = document.querySelector(urlMap.contentElement);
      }

      if (mediaCache) {
        content = (
          getElementStyle(mediaElement, ":after").getPropertyValue("content") ||
          "none"
        ).replace(QUOTE_PATTERN, "");
        mediaCache = {};
        if (content) {
          mediaCache[content] = 1;
        }
        content = (
          getElementStyle(mediaElement, ":before").getPropertyValue(
            "content",
          ) || "none"
        ).replace(QUOTE_PATTERN, "");
        mediaCache[content] = 1;
      } else {
        mediaCache = {};
      }
    }
    if (mediaCache[conditionData.name]) {
      isConditionMet = true;
    } else {
      if (global.matchMedia && "string" == typeof conditionData.condition) {
        isConditionMet = (matchMedia(a.condition) || {}).matches;
      } else {
        if ("function" == typeof conditionData.condition) {
          isConditionMet = conditionData.condition(element, conditionData);
        }
      }
    }
    return isConditionMet;
  }

  function loadConditionalResource(element) {
    let condition,
      candidate,
      resource = element.lazyInclude;
    if (resource && resource.candidates) {
      for (condition = 0; condition < resource.candidates.length; condition++) {
        candidate = resource.candidates[condition];
        if (checkCondition(element, candidate)) break;
      }
    }
    return candidate && candidate !== resource.current ? candidate : null;
  }

  // Main function to load resources based on the evaluated conditions
  function loadResource(url, isScript, callback) {
    if (resourceLoaders[url]) {
      if (callback) {
        if (resourceLoaders[url]) {
          setTimeout(callback);
        } else {
          resourceLoaders[url].push(callback);
        }
      }
    } else {
      let element = document.createElement(isScript ? "script" : "link");
      let firstScript = document.getElementsByTagName("script")[0];

      if (isScript) {
        element.src = url;
        element.async = false;
      } else {
        element.rel = "stylesheet";
        element.href = url;
      }

      resourceLoaders[url] = [];
      resourceLoaders[element.href] = resourceLoaders[url];
      if (callback) {
        setupEventListeners(element, url, callback);
      }
      firstScript.parentNode.insertBefore(element, firstScript);
    }
  }

  function setupEventListeners(element, url, callback) {
    let interval;
    let onLoad = function (event) {
      if (
        event.type !== "readystatechange" ||
        readyStateTypes[event.target.readyState]
      ) {
        let callbacks = resourceLoaders[url];

        element.removeEventListener("load", onLoad);
        element.removeEventListener("error", onLoad);
        element.removeEventListener("readystatechange", onLoad);
        element.removeEventListener("loadcssdefined", onLoad);
        interval && clearInterval(interval);
        resourceLoaders[url] = true;
        resourceLoaders[element.href] = true;

        while (callbacks.length) {
          callbacks.shift()();
        }
      }
    };

    resourceLoaders[element.href][0] = callback;
    if (!isScript) {
      interval = setInterval(function () {
        if (isStyleSheetLoaded(element)) {
          onLoad({});
        }
      }, 60);
    }

    element.addEventListener("load", onLoad);
    element.addEventListener("error", onLoad);
    element.addEventListener("readystatechange", onLoad);
    element.addEventListener("loadcssdefined", onLoad);
  }

  function isStyleSheetLoaded(element) {
    let isLoaded = false;
    let styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      if (styleSheets[i].href === element.href) {
        isLoaded = true;
        break;
      }
    }
    return isLoaded;
  }

  function applyLazyTransform(element) {
    if (element && typeof element.lazytransform === "function") {
      element.lazytransform(this);
    }
  }

  function applyLazyUnload(element) {
    if (element && typeof element.lazyunload === "function") {
      element.lazyunload(this);
    }
  }

  function applyLazyLoad(element) {
    if (element && typeof element.lazyload === "function") {
      element.lazyload(this);
    }
  }

  function lazyIncludeHandler(element, candidate) {
    let handleResponse,
      xhrInstance,
      moduleArray,
      cssPending,
      lazyIncludeCallback;
    const currentInclude = element.lazyInclude.current || null;

    const lazyIncludeConfig = {
      candidate: candidate,
      openArgs: ["GET", candidate.urls.include, true],
      sendData: null,
      xhrModifier: null,
      content: candidate.content?.content || candidate.content,
      oldCandidate: currentInclude,
    };

    // Check if lazy load event is prevented
    if (
      lazySizesInstance.fire(element, "lazyincludeload", lazyIncludeConfig)
        .defaultPrevented
    ) {
      LazyLoadQueue.d();
      return;
    }

    // Function to check and proceed once conditions are met
    lazyIncludeCallback = function () {
      if (xhrInstance && moduleArray && !cssPending) handleResponse();
    };

    // Function to handle the response
    handleResponse = function () {
      const status = xhrInstance.status;
      const responseContent = xhrInstance.content || xhrInstance.responseText;
      const isEmptyContent =
        !responseContent && currentInclude && currentInclude.urls.include;

      const responseDetails = {
        candidate: candidate,
        content: responseContent,
        text: xhrInstance.responseText || xhrInstance.content,
        response: xhrInstance.response,
        xml: xhrInstance.responseXML,
        isSuccess:
          !("status" in xhrInstance) ||
          (status >= 200 && status < 300) ||
          status === 304,
        oldCandidate: currentInclude,
        insert: true,
        resetHTML: isEmptyContent,
      };

      const eventDetail = {
        target: element,
        details: responseDetails,
        detail: responseDetails,
      };

      // Process lazy unload and transform if modules exist
      candidate.modules = moduleArray;
      if (currentInclude?.modules) {
        currentInclude.modules?.forEach(applyLazyUnload, eventDetail);
        currentInclude.modules = null;

        if (
          responseDetails.resetHTML &&
          responseDetails.content === null &&
          candidate.initial?.saved
        ) {
          responseDetails.content = candidate.initial.content;
        }
      }

      moduleArray.forEach(applyLazyTransform, eventDetail);

      // Trigger lazy load event
      const lazyLoadEvent = lazySizesInstance.fire(
        element,
        "lazyincludeloaded",
        responseDetails,
      );

      if (
        responseDetails.insert &&
        responseDetails.isSuccess &&
        !lazyLoadEvent.defaultPrevented &&
        responseDetails.content !== null &&
        responseDetails.content !== element.innerHTML
      ) {
        element.innerHTML = responseDetails.content;
      }

      LazyLoadQueue.d();
      moduleArray.forEach(applyLazyLoad, eventDetail);

      setTimeout(() =>
        lazySizesInstance.fire(element, "lazyincluded", responseDetails),
      );

      // Clear references to avoid memory leaks
      xhrInstance = null;
      moduleArray = null;
    };

    // Set the current include candidate and update attribute
    element.lazyInclude.current = candidate;
    element.setAttribute("data-currentrender", candidate.name);

    // Process CSS URLs
    if (candidate.urls.css) {
      cssPending = true;
      loadCss(candidate.urls.css, () => {
        cssPending = false;
        lazyIncludeCallback();
      });
    }

    // Handle content loading via XHR if content is not already available
    if (lazyIncludeConfig.content === null && candidate.urls.include) {
      loadContentWithXHR(lazyIncludeConfig, (xhr) => {
        xhrInstance = xhr;
        lazyIncludeCallback();
      });
    } else {
      xhrInstance = lazyIncludeConfig;
    }

    // Load modules or AMD if specified
    if (candidate.urls.amd || candidate.urls.module) {
      const moduleLoadCallback = function () {
        moduleArray = Array.prototype.slice.call(arguments);
        lazyIncludeCallback();
      };

      if (candidate.urls.amd) {
        loadAmdModules(candidate.urls.amd, moduleLoadCallback);
      } else {
        loadModule(candidate.urls.module, moduleLoadCallback);
      }
    } else {
      moduleArray = [];
    }

    // Initial call to check if everything is ready
    lazyIncludeCallback();
  }

  // Helper functions for specific actions

  function loadCss(cssUrls, callback) {
    const urls = cssUrls.split("|,|");
    const lastIndex = urls.length - 1;
    urls.forEach((url, index) => {
      loadResource(url, false, index === lastIndex ? callback : null);
    });
  }

  function loadContentWithXHR(config, callback) {
    const xhr = new t4sXMLHttpRequest();
    xhr.addEventListener(
      "readystatechange",
      function () {
        if (xhr.readyState === xhr.DONE) {
          callback(xhr);
          xhr = null;
        }
      },
      false,
    );
    xhr.open.apply(xhr, config.openArgs);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (config.xhrModifier) config.xhrModifier(xhr, config.candidate);
    xhr.send(config.sendData);
  }

  function loadAmdModules(amdUrls, callback) {
    const urls = amdUrls.split("|,|");
    const lastIndex = urls.length - 1;
    if (lazySizesInstance.cfg.requireJs) {
      lazySizesInstance.cfg.requireJs(urls, callback);
    } else {
      urls.forEach((url, index) => {
        loadResource(url, index === lastIndex ? callback : null);
      });
    }
  }

  function loadModule(moduleUrl, callback) {
    if (lazySizesInstance.cfg.systemJs) {
      lazySizesInstance.cfg.systemJs(moduleUrl, callback);
    } else {
      loadResource(moduleUrl, callback);
    }
  }

  const lazyLoadHandler = (() => {
    let debounceTimer;

    // Function to process elements
    const processLazyElements = () => {
      for (let i = 0; i < lazyConditionalElements.length; i++) {
        const element = lazyConditionalElements[i];
        if (
          !lazySizesInstance.hC(element, conditionTypes.lazyClass) &&
          loadConditionalResource(element)
        ) {
          lazySizesInstance.aC(element, conditionTypes.lazyClass);
        }
      }
    };

    // Debounced function for handling events like resize or scroll
    return (event) => {
      clearTimeout(debounceTimer);
      mediaCache = null;
      const delay = event.type === "resize" ? 31 : 0;
      debounceTimer = setTimeout(processLazyElements, delay);
    };
  })();

  function loadLazyContent(element) {
    let candidate;

    function prepareLazyInclude(element) {
      let candidateURL,
        inlineURL = element.getAttribute("data-seturl") || "";

      // Construct the URL based on the element's attributes
      if (element.hasAttribute("data-qs-inl")) {
        candidateURL =
          rootRoute +
          "products/" +
          (element.getAttribute("data-render") || "") +
          "/?section_id=qs_inline";
      } else {
        candidateURL = (element.getAttribute("data-render") || "") + inlineURL;
      }

      let lazyIncludeData = element.lazyInclude;

      // Check if a reload is required, or if lazyInclude data needs to be set up
      if (
        !lazyIncludeData ||
        lazyIncludeData.str !== candidateURL ||
        !urlMap.allowReload
      ) {
        const initialContent = {
          saved: false,
          content: null,
        };

        lazyIncludeData = {
          str: candidateURL,
          candidates: (urlMap[candidateURL] || candidateURL)
            .split(URL_SEPARATOR)
            .map(parseCondition, initialContent),
        };

        const lastCandidate =
          lazyIncludeData.candidates[lazyIncludeData.candidates.length - 1];

        // Check if the last candidate has a condition; if not, save the initial content
        if (!lastCandidate.condition) {
          initialContent.saved = true;
          lazyIncludeData.candidates.push({
            urls: {},
            condition: null,
            name: "initial",
            content: initialContent,
          });
        } else if (
          initialContent.saved &&
          lazyIncludeData.candidates.length === 1
        ) {
          initialContent.saved = false;
        }

        lazyIncludeData.initialContent = initialContent;

        // Save the current HTML content if initial content is marked as saved
        if (initialContent.saved) {
          initialContent.content = element.innerHTML;
        }

        // Update the element's lazyInclude data
        element.lazyInclude = lazyIncludeData;

        // Toggle the lazy conditional include class based on the number of candidates
        if (lazyIncludeData.candidates.length > 1) {
          lazySizesInstance.aC(element, "lazyconditionalinclude");
        } else {
          lazySizesInstance.rC(element, "lazyconditionalinclude");
        }
      }

      return lazyIncludeData;
    }

    // Check if there are candidates and the element is visible on the page
    if (
      prepareLazyInclude(element).candidates.length &&
      document.documentElement.contains(element)
    ) {
      // Retrieve the first eligible candidate and load it
      candidate = loadConditionalResource(element);
      if (candidate) {
        lazyIncludeHandler(element, candidate);
      }
      return true;
    }
  }

  // Lazy queue management for handling resource load conditions
  const LazyLoadQueue = (function () {
    let maxConcurrent = 2, // Default max concurrent tasks
      activeCount = 0, // Current active tasks
      priorityCount = 0, // Items without 'data-lazyqueue' attribute
      queue = []; // Queue to hold elements

    // Debounce function to prevent excessive queue processing
    const debounce = (function () {
      let timer;
      const resetActive = () => {
        if (queue.length) activeCount = 0;
      };
      return function () {
        clearTimeout(timer);
        timer = setTimeout(resetActive, 999);
      };
    })();

    function enqueue(item) {
      const isPriority = item.getAttribute("data-lazyqueue") === null;
      if (isPriority) {
        priorityCount++;
        maxConcurrent = 3; // Increase concurrent limit for priority items
      }

      // Add to the front for priority or back for regular items
      if (activeCount > maxConcurrent) {
        queue[isPriority ? "unshift" : "push"](item);
      } else if (loadLazyContent(item)) {
        activeCount++;
        debounce();
      }
    }

    function dequeue() {
      if (activeCount > 0) activeCount--;

      if (priorityCount > 0 && --priorityCount === 0) {
        maxConcurrent = 2; // Reset max concurrent if no priority items left
      }

      // Process items if the active count allows
      while (queue.length && activeCount <= maxConcurrent) {
        const nextItem = queue.shift();
        if (loadLazyContent(nextItem)) {
          activeCount++;
          break;
        }
      }

      debounce();
    }
    return {
      q: enqueue,
      d: dequeue,
    };
  })();

  // Additional initialization and event listeners for lazy load events
  document.addEventListener(
    "lazybeforeunveil",
    (event) => {
      if (
        event.detail.instance === lazySizesInstance &&
        !event.defaultPrevented
      ) {
        let target = event.target;
        if (target.getAttribute("data-render")) {
          LazyLoadQueue.q(target);
          event.detail.firesLoad = true;
        }
      }
    },
    false,
  );

  document.addEventListener("resize", lazyLoadHandler, false);
  document.addEventListener("lazyrefreshincludes", lazyLoadHandler, false);
});

((globalContext, loadLazySizes) => {
  let lazyLoadHandler = () => {
    loadLazySizes(globalContext.lazySizesT4);
    globalContext.removeEventListener("lazyunveilread", lazyLoadHandler, true);
  };

  loadLazySizes = loadLazySizes.bind(
    null,
    globalContext,
    globalContext.document,
  );

  if (typeof module === "object" && module.exports) {
    loadLazySizes(require("lazySizesT4"));
  } else if (typeof define === "function" && define.amd) {
    define(["lazySizesT4"], loadLazySizes);
  } else if (globalContext.lazySizesT4) {
    lazyLoadHandler();
  } else {
    globalContext.addEventListener("lazyunveilread", lazyLoadHandler, true);
  }
})(globalThis, (globalContext, document, lazySizesInstance) => {
  "use strict";

  // Lazy load functionality setup
  const initLazyLoading = function () {
    let mutationObserver, enableObserver, disableObserver;
    const config = lazySizesInstance.cfg;
    let observerDisconnected = false;
    let mutationCache = [];

    const lazyClassRegex = new RegExp(
      `(\\s|^)(${config.loadedClass}|${config.unloadedClass || ""}|${
        config.loadingClass
      })(\\s|$)`,
    );

    const observedAttributes = {
      "data-bgset": true,
      "data-include": true,
      "data-poster": true,
      "data-bg": true,
      "data-script": true,
      [config.srcAttr]: true,
      [config.srcsetAttr]: true,
    };
    function handleMutations(mutations) {
      const len = mutations.length;
      for (let i = 0; i < len; i++) {
        let attribute = mutations[i];
        let targetElement = attribute.target;

        if (
          targetElement.getAttribute(attribute.attributeName) &&
          targetElement.localName === "source" &&
          targetElement.parentNode
        ) {
          targetElement = targetElement.parentNode.querySelector("img");
        }

        if (targetElement && lazyClassRegex.test(targetElement.className)) {
          loadLazyResource(targetElement);
        }
      }
    }

    function loadLazyResource(element) {
      lazySizesInstance.rAF(() => {
        lazySizesInstance.rC(element, config.loadedClass);
        config.unloadedClass &&
          lazySizesInstance.rC(element, config.unloadedClass);
        lazySizesInstance.aC(element, config.lazyClass);
        if (
          "none" == element.style.display ||
          (element.parentNode && "none" == element.parentNode.style.display)
        ) {
          setTimeout(() => {
            lazySizesInstance.loader.unveil(element);
          }, 0);
        }
      });
    }

    function applyLazyLoading() {
      handleMutations(mutationCache);
      observerDisconnected = false;
      mutationCache = [];
    }

    // Check for MutationObserver support and set up observers
    if (globalContext.MutationObserver) {
      mutationObserver = new MutationObserver(handleMutations);

      enableObserver = function () {
        if (!observerDisconnected) {
          mutationObserver.observe(document.documentElement, {
            subtree: true,
            attributes: true,
            attributeFilter: Object.keys(observedAttributes),
          });
        }
      };

      disableObserver = function () {
        if (observerDisconnected) {
          mutationObserver.disconnect();
        }
      };
    } else {
      // Fallback for browsers without MutationObserver
      document.documentElement.addEventListener(
        "DOMAttrModified",
        function (event) {
          if (
            observerDisconnected &&
            observedAttributes[event.attrName] &&
            event.newValue
          ) {
            mutationCache.push({
              target: event.target,
              attributeName: event.attrName,
            });
            if (!observerDisconnected) {
              setTimeout(applyLazyLoading);
              observerDisconnected = true;
            }
          }
        },
        true,
      );

      enableObserver = function () {
        observerDisconnected = true;
      };
      disableObserver = function () {
        observerDisconnected = false;
      };
    }

    // Event listeners for lazy loading and size management
    addEventListener("lazybeforeunveil", disableObserver, true);
    addEventListener("lazybeforeunveil", enableObserver);
    addEventListener("lazybeforesizes", disableObserver, true);
    addEventListener("lazybeforesizes", enableObserver);
    enableObserver();
    removeEventListener("lazybeforeunveil", initLazyLoading);
  };

  addEventListener("lazybeforeunveil", initLazyLoading);
});

// Self-invoking function to initialize lazy sizes
((global, callback) => {
  const init = () => {
    callback(global.lazySizesT4);
    global.removeEventListener("lazyunveilread", init, true);
  };

  callback = callback.bind(null, global, global.document);

  if (typeof module === "object" && module.exports) {
    callback(require("lazySizesT4"));
  } else if (typeof define === "function" && define.amd) {
    define(["lazySizesT4"], callback);
  } else if (global.lazySizesT4) {
    init();
  } else {
    global.addEventListener("lazyunveilread", init, true);
  }
})(globalThis, (window, document, lazySizesConfig) => {
  "use strict";

  const parentFitRegex = /\s+(\d+)(w|h)\s+(\d+)(w|h)/;
  const PARENT_FIT_ATTR_REGEX =
    /parent-fit["']*\s*:\s*["']*(contain|cover|width)/;
  const parentContainerRegex =
    /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/;
  const PICTURE_REGEX = /^picture$/i;

  const lazyLoader = {
    getParent(element, selector) {
      let currentElement = element;
      let parentElement = element.parentNode;

      if (
        selector &&
        selector !== "prev" &&
        parentElement &&
        PICTURE_REGEX.test(parentElement.nodeName || "")
      ) {
        parentElement = parentElement.parentNode;
      }

      if (selector !== "self") {
        currentElement =
          selector === "prev"
            ? element.previousElementSibling
            : selector && (parentElement.closest || window.jQuery)
              ? parentElement.closest
                ? parentElement.closest(selector)
                : jQuery(parentElement).closest(selector)[0]
              : parentElement;
      }

      return currentElement;
    },

    getFit(element) {
      const computedStyle = getComputedStyle(element, null) || {};
      const content = computedStyle.content || computedStyle.fontFamily;
      const fitConfig = {
        fit:
          element._lazySizesT4ParentFit ||
          element.getAttribute("data-parent-fit"),
      };

      if (!fitConfig.fit && content) {
        const match = content.match(PARENT_FIT_ATTR_REGEX);
        if (match) fitConfig.fit = match[1];
      }

      if (fitConfig.fit) {
        let parentContainer =
          element._lazySizesT4ParentContainer ||
          element.getAttribute("data-parent-container");
        if (!parentContainer && content) {
          const match = content.match(parentContainerRegex);
          if (match) parentContainer = match[1];
        }
        fitConfig.parent = this.getParent(element, parentContainer);
      } else {
        fitConfig.fit = computedStyle.objectFit;
      }

      return fitConfig;
    },

    getImageRatio(element) {
      const parentNode = element.parentNode;
      const sources =
        parentNode && PICTURE_REGEX.test(parentNode.nodeName || "")
          ? parentNode.querySelectorAll("source, img")
          : [element];

      for (const source of sources) {
        const srcSet =
          source.getAttribute(lazySizesConfig.cfg.srcsetAttr) ||
          source.getAttribute("srcset") ||
          source.getAttribute("data-pfsrcset") ||
          source.getAttribute("data-risrcset") ||
          "";
        const media = source._lsMedia || source.getAttribute("media");
        const resolvedMedia =
          lazySizesConfig.cfg.customMedia[
            source.getAttribute("data-media") || media
          ] || media;

        if (
          srcSet &&
          (!resolvedMedia ||
            ((window.matchMedia && matchMedia(resolvedMedia)) || {}).matches)
        ) {
          let aspectRatio = parseFloat(source.getAttribute("data-aspectratio"));
          if (!aspectRatio) {
            const match = srcSet.match(parentFitRegex);
            const width = match
              ? match[2] === "w"
                ? match[1]
                : match[3]
              : source.getAttribute("width") || source.getAttribute("height");
            aspectRatio =
              width /
              (match
                ? match[2] === "h"
                  ? match[1]
                  : match[3]
                : source.getAttribute("height"));
          }
          return aspectRatio;
        }
      }
      return undefined;
    },

    calculateSize(element, width) {
      let { fit, parent } = this.getFit(element);
      let calculatedWidth = width;

      if (fit === "width" || fit === "contain" || fit === "cover") {
        const aspectRatio = this.getImageRatio(element);
        if (aspectRatio) {
          if (parent) {
            calculatedWidth = parent.clientWidth;
          } else {
            parent = element;
            if (fit === "width") {
              return calculatedWidth;
            }

            const height = parent.clientHeight;
            const ratio = calculatedWidth / height;

            if (
              (fit === "cover" && ratio < aspectRatio) ||
              (fit === "contain" && aspectRatio < ratio)
            ) {
              return calculatedWidth * (aspectRatio / ratio);
            } else {
              return calculatedWidth;
            }
          }
        } else {
          return calculatedWidth;
        }
      }
    },
  };

  lazySizesConfig.parentFit = lazyLoader;

  // Event listener for resizing
  document.addEventListener("lazybeforesizes", (event) => {
    if (!event.defaultPrevented && event.detail.instance === lazySizesConfig) {
      const target = event.target;
      event.detail.width = lazyLoader.calculateSize(target, event.detail.width);
    }
  });
});

((window, callback) => {
  callback = callback.bind(null, window, window.document);

  const onLazyUnveilRead = () => {
    callback(window.lazySizesT4);
    window.removeEventListener("lazyunveilread", onLazyUnveilRead, true);
  };

  if (typeof module === "object" && module.exports) {
    callback(require("lazySizesT4"));
  } else if (typeof define === "function" && define.amd) {
    define(["lazySizesT4"], callback);
  } else if (window.lazySizesT4) {
    onLazyUnveilRead();
  } else {
    window.addEventListener("lazyunveilread", onLazyUnveilRead, true);
  }
})(globalThis, (window, document, lazySizes) => {
  "use strict";
  const defaults = {
    string: 1,
    number: 1,
  };
  const PICTURE_REGEX = /^picture$/i;
  const WIDTH_REGEX = /\s*\{\s*width\s*\}\s*/i;
  const HEIGHT_REGEX = /\s*\{\s*height\s*\}\s*/i;
  const VARIABLE_REGEX = /\s*\{\s*([a-z0-9]+)\s*\}\s*/gi;
  const JSON_REGEX = /^\[.*\]|\{.*\}$/;
  const PIXEL_VALUE_REGEX = /^(?:auto|\d+(px)?)$/;
  const SIGN_DECIMAL_REGEX = /^\-*\+*\d+\.*\d*$/;
  const urlLink = window.document.createElement("a");
  const imgElement = window.document.createElement("img");
  const supportsSrcSet = "srcset" in imgElement && !("sizes" in imgElement);
  const supportsPictureElement = !!window.HTMLPictureElement && !supportsSrcSet;
  // Set default values for configuration options
  const defaultConfig = {
    prefix: "",
    postfix: "",
    srcAttr: "data-src",
    absUrl: false,
    modifyOptions: () => {},
    widthmap: {},
    ratio: false,
    traditionalRatio: false,
    aspectratio: false,
    widths: [],
  };

  // Get the main configuration object, or create one if it doesn't exist
  const config = lazySizes && lazySizes.cfg ? lazySizes.cfg : {};

  // Define a function to check supported types if it doesn't already exist
  config.supportsType =
    config.supportsType ||
    function (type) {
      return !type;
    };

  // Initialize or set up the responsive image attribute settings in configuration
  config.rias = config.rias || {};

  // Add default width values if they don't exist in the rias config
  if (!("widths" in config.rias)) {
    config.rias.widths = [];

    // Populate widths with a sequence of increasing values
    (function populateWidths(widthsArray) {
      let width,
        index = 0;
      while (!width || width < 3000) {
        index += index > 30 ? 6 : 5; // Increment more after 30 iterations
        width = 36 * index;
        widthsArray.push(width);
      }
    })(config.rias.widths);
  }

  // Copy properties from the defaultConfig to config.rias if they don’t already exist
  for (const key in defaultConfig) {
    if (!(key in config.rias)) {
      config.rias[key] = defaultConfig[key];
    }
  }

  function parseAttributes(element, attributeString, attributeOptions) {
    let parentNode,
      customAttributes = {};
    const defaultStyle = window.getComputedStyle(element);

    // Clone the attribute options if provided, else initialize as empty object
    if (attributeOptions) {
      customAttributes = { ...attributeOptions };
    } else {
      // Determine if the element has a parent that is a <picture> element
      parentNode = element.parentNode;
      customAttributes.isPicture =
        parentNode && PICTURE_REGEX.test(parentNode.nodeName);
    }

    // Helper function to set and parse individual attributes
    const parseAttribute = (attrName, isConditional) => {
      let attrValue = element.getAttribute("data-" + attrName);

      // Attempt to retrieve CSS custom property if data attribute is missing
      if (!attrValue) {
        const cssCustomProperty = defaultStyle.getPropertyValue(
          "--ls-" + attrName,
        );
        if (cssCustomProperty) attrValue = cssCustomProperty.trim();
      }

      // Parse attribute value if available
      if (attrValue) {
        if (attrValue === "true") {
          attrValue = true;
        } else if (attrValue === "false") {
          attrValue = false;
        } else if (SIGN_DECIMAL_REGEX.test(attrValue)) {
          attrValue = parseFloat(attrValue);
        } else if (typeof defaultConfig[attrName] === "function") {
          attrValue = defaultConfig[attrName](element, attrValue);
        } else if (JSON_REGEX.test(attrValue)) {
          try {
            attrValue = JSON.parse(attrValue);
          } catch (error) {}
        }
        customAttributes[attrName] = attrValue;
      } else {
        // Use default attribute value if available
        if (
          attrName in defaultConfig &&
          typeof defaultConfig[attrName] !== "function" &&
          !customAttributes[attrName]
        ) {
          customAttributes[attrName] = defaultConfig[attrName];
        } else if (
          isConditional &&
          typeof defaultConfig[attrName] === "function"
        ) {
          customAttributes[attrName] = defaultConfig[attrName](
            element,
            attrValue,
          );
        }
      }
    };

    // Parse each attribute defined in defaultConfig
    for (const attr in defaultConfig) {
      parseAttribute(attr);
    }

    // Replace placeholders in attributeString with parsed attributes
    attributeString.replace(VARIABLE_REGEX, (match, attrName) => {
      if (!(attrName in customAttributes)) parseAttribute(attrName, true);
    });

    return customAttributes;
  }

  const calculateRatio = (src, options, referenceElement) => {
    let width = 0;
    let height = 0;

    if (src) {
      if (options.ratio === "container") {
        do {
          width = referenceElement.scrollWidth;
          height = referenceElement.scrollHeight;
          referenceElement = referenceElement.parentNode;
        } while (
          !((width && height) || referenceElement === document) &&
          referenceElement
        );

        options.ratio = options.traditionalRatio
          ? height / width
          : width / height;
      }
      const calculateSrcSet = (src, options) => {
        const array = [];
        array.srcset = [];
        if (options.absUrl) {
          urlLink.setAttribute("href", src);
          src = urlLink.href;
        }

        const finalSrc = `${options.prefix || ""}${src}${
          options.postfix || ""
        }`.replace(VARIABLE_REGEX, (match, variable) => {
          return defaults[typeof options[variable]] ? options[variable] : match;
        });

        options.widths.forEach((widthValue) => {
          const mappedWidth = options.widthmap[widthValue] || widthValue;
          const aspectRatio = options.aspectratio || options.ratio;
          const traditionalRatio =
            !options.aspectratio && defaultConfig.traditionalRatio;

          const result = {
            u: finalSrc
              .replace(WIDTH_REGEX, mappedWidth)
              .replace(
                HEIGHT_REGEX,
                aspectRatio
                  ? traditionalRatio
                    ? Math.round(widthValue * aspectRatio)
                    : Math.round(widthValue / aspectRatio)
                  : "",
              ),
            w: widthValue,
          };
          array.push(result);
          array.srcset.push((result.c = `${result.u} ${widthValue}w`));
        });
        return array;
      };

      const srcsetAttributes = calculateSrcSet(src, options);
      srcsetAttributes.isPicture = options.isPicture;
      if (supportsSrcSet && referenceElement.nodeName.toUpperCase() === "IMG") {
        referenceElement.removeAttribute(config.srcsetAttr);
      } else {
        referenceElement.setAttribute(
          config.srcsetAttr,
          srcsetAttributes.srcset.join(", "),
        );
      }

      Object.defineProperty(referenceElement, "_lazyrias", {
        value: srcsetAttributes,
        writable: true,
      });
    }
  };

  const getSource = (element) => {
    const srcAttr =
      element.getAttribute(
        element.getAttribute("data-srcattr") || defaultConfig.srcAttr,
      ) ||
      element.getAttribute(config.srcsetAttr) ||
      element.getAttribute("src") ||
      element.getAttribute("data-pfsrcset") ||
      "";
    return srcAttr
      .replace("_1x1.", "_{width}x.")
      .replace("width=1", "width={width}");
  };

  const handleLazyBeforeSizes = (event) => {
    if (event.detail.instance === lazySizes) {
      const target = event.target;
      let node;
      let E;
      if (
        event.detail.dataAttr &&
        !event.defaultPrevented &&
        !defaultConfig.disabled
      ) {
        const sizesAttr =
          target.getAttribute(config.sizesAttr) || target.getAttribute("sizes");
        if (sizesAttr && PIXEL_VALUE_REGEX.test(sizesAttr)) {
          const srcset = getSource(target);
          const modifiedOptions = ((target, srcset) => {
            const attributes = parseAttributes(target, srcset);
            defaultConfig.modifyOptions.call(target, {
              target,
              details: attributes,
              detail: attributes,
            });
            // Emit an event for modification
            lazySizes.fire(target, "lazyriasmodifyoptions", attributes);
            return attributes;
          })(target, srcset);
          const isWidthPrefix =
            WIDTH_REGEX.test(modifiedOptions.prefix) ||
            WIDTH_REGEX.test(modifiedOptions.postfix);
          if (modifiedOptions.isPicture) {
            node = target.parentNode;
            let sourceElement = node.getElementsByTagName("source");
            const Len = sourceElement.length;
            for (let i = 0; i < Len; i++) {
              let src = getSource(sourceElement[i]);
              if (isWidthPrefix || WIDTH_REGEX.test(src)) {
                calculateRatio(
                  src,
                  parseAttributes(sourceElement[i], src, modifiedOptions),
                  sourceElement[i],
                );
              }
              E = true;
            }
          }
          let w;
          if (isWidthPrefix || WIDTH_REGEX.test(srcset)) {
            calculateRatio(srcset, modifiedOptions, target);
            E = false;
          } else {
            if (E) {
              w = [];
              w.srcAttr = [];
              w.isPicture = true;
              Object.defineProperty(target, "_lazyrias", {
                value: w,
                writable: true,
              });
            }
          }

          let m = {};

          if (E) {
            if (supportsPictureElement) {
              target.removeAttribute(config.rias.srcAttr);
            } else {
              if ("auto" != sizesAttr) {
                m.width = parseInt(sizesAttr, 10);
              }
              setupLazyRias({
                target: target,
                detail: m,
              });
            }
          }
        }
      }
    }
  };

  const setupLazyRias = (() => {
    // Helper function to sort by width
    const sortByWidth = function (a, b) {
      return a.w - b.w;
    };

    // Checks if lazySizes has already parsed the `srcset` attribute for the element
    const getParsedSrcset = (element, isPicture) => {
      let parsedSrcset;
      if (!element._lazyrias && lazySizes.pWS) {
        parsedSrcset = lazySizes.pWS(
          element.getAttribute(config.rias.srcsetAttr || ""),
        );
        if (parsedSrcset.length) {
          Object.defineProperty(element, "_lazyrias", {
            value: parsedSrcset,
            writable: true,
          });

          if (isPicture && element.parentNode) {
            parsedSrcset.isPicture =
              element.parentNode.nodeName.toUpperCase() === "PICTURE";
          }
        }
      }
      return element._lazyrias;
    };

    // Main resize handler
    const onResize = function (event) {
      if (event.detail.instance === lazySizes) {
        let optimalSrc,
          target = event.target;

        if (!window.respimage && !window.picturefill && !config.pf) {
          if (
            "_lazyrias" in target ||
            (event.detail.dataAttr && getParsedSrcset(target, true))
          ) {
            optimalSrc = ((element, targetWidth) => {
              let source,
                optimalSource,
                mediaSource,
                mediaQueryMatch,
                parsedSrcset;

              // Retrieve parsed srcset data
              parsedSrcset = element._lazyrias;
              if (parsedSrcset.isPicture && window.matchMedia) {
                // Check for the best matching source for the picture element
                const sources =
                  element.parentNode.getElementsByTagName("source");
                for (let i = 0; i < sources.length; i++) {
                  if (
                    getParsedSrcset(sources[i]) &&
                    !sources[i].getAttribute("type") &&
                    (!(mediaSource = sources[i].getAttribute("media")) ||
                      (matchMedia(mediaSource) || {}).matches)
                  ) {
                    parsedSrcset = sources[i]._lazyrias;
                    break;
                  }
                }
              }

              // Update the width and density if necessary
              if (!parsedSrcset.w || parsedSrcset.w < targetWidth) {
                parsedSrcset.w = targetWidth;
                parsedSrcset.d = (function (element) {
                  const devicePixelRatio = window.devicePixelRatio || 1;
                  const customDensity =
                    lazySizes.getX && lazySizes.getX(element);
                  return Math.min(
                    customDensity || devicePixelRatio,
                    2.4,
                    devicePixelRatio,
                  );
                })(element);

                // Select the best source based on density
                optimalSource = ((srcset) => {
                  const len = srcset.length;
                  let selectedSource = srcset[len - 1];

                  for (let i = 0; i < len; i++) {
                    selectedSource = srcset[i];
                    selectedSource.d = selectedSource.w / srcset.w;

                    if (selectedSource.d >= srcset.d) {
                      const prevSource = srcset[i - 1];
                      if (
                        !selectedSource.cached &&
                        prevSource &&
                        prevSource.d > srcset.d - 0.13 * Math.pow(srcset.d, 2.2)
                      ) {
                        const adjustmentFactor = Math.pow(
                          prevSource.d - 0.6,
                          1.6,
                        );
                        prevSource.cached &&
                          (prevSource.d += 0.15 * adjustmentFactor);

                        if (
                          prevSource.d +
                            (selectedSource.d - srcset.d) * adjustmentFactor >
                          srcset.d
                        ) {
                          selectedSource = prevSource;
                        }
                      }
                      break;
                    }
                  }
                  return selectedSource;
                })(parsedSrcset.sort(sortByWidth));
              }
              return optimalSource;
            })(target, event.detail.width);

            // Apply the optimal source if it has changed
            if (
              optimalSrc &&
              optimalSrc.u &&
              target._lazyrias.cur !== optimalSrc.u
            ) {
              target._lazyrias.cur = optimalSrc.u;
              optimalSrc.cached = true;
              lazySizes.rAF(function () {
                target.setAttribute(config.srcAttr, optimalSrc.u);
                target.setAttribute("src", optimalSrc.u);
              });
            }
          } else {
            // Remove event listener if lazySizes is not active
            window.removeEventListener("lazybeforesizes", onResize);
          }
        }
      }
    };

    // Initialize event listener unless `b` is true
    if (!supportsPictureElement) {
      window.addEventListener("lazybeforesizes", onResize);
    }

    return onResize;
  })();

  window.addEventListener("lazybeforesizes", handleLazyBeforeSizes, true);
});

((global) => {
  //   t = document
  // e = window
  // r = document.documentElement
  // s = window.HTMLPictureElement
  // o = addEventListener
  // l = setTimeoutFn
  // d = requestAnimationFrameFn
  // u = requestIdleCallbackFn
  // v = Array.prototype.forEach
  // n = configDefaults
  // a = lazyLoadSettings
  // i = config
  // c = PICTURE_REGEX
  // f = eventTypes
  // g = hasClass
  // p = addClass
  // z = removeClass
  // m = manageEventListeners
  // h = dispatchCustomEvent
  // b = setImageSource
  // A = getStyleProperty
  // E = calculateWidthWithMinSize
  // w = createTaskQueue
  // L = createDebouncedFunction
  // C = createThrottledFunction
  // S = lazyLoadHandler
  // T = resizeAndSizeUpdater
  // _ = initializeLazyLoad

  const lazySizes = ((window, document, Date) => {
    "use strict";

    const configDefaults = {
      lazyClass: "lazyload",
      loadedClass: "lazyloaded",
      loadingClass: "lazyloading",
      preloadClass: "lazypreload",
      errorClass: "lazyerror",
      autosizesClass: "lazyautosizes",
      srcAttr: "data-src",
      srcsetAttr: "data-srcset",
      sizesAttr: "data-sizes",
      minSize: 40,
      customMedia: {},
      init: true,
      expFactor: 1.5,
      hFac: 0.8,
      loadMode: 2,
      loadHidden: true,
      ricTimeout: 0,
      throttleDelay: 125,
    };

    let lazyLoadSettings = {};

    const config = { ...(window.lazySizesT4Config || {}), ...configDefaults };
    const addEventListener = window.addEventListener.bind(window);
    const setTimeoutFn = window.setTimeout;
    const requestAnimationFrameFn =
      window.requestAnimationFrame || setTimeoutFn;
    const requestIdleCallbackFn = window.requestIdleCallback;
    const classRegexCache = {};
    const PICTURE_REGEX = /^picture$/i;
    const eventTypes = ["load", "error", "lazyincluded", "_lazyloaded"];

    if (!document || !document.getElementsByClassName) {
      return {
        init: function () {},
        cfg: config,
        noSupport: true,
      };
    }
    // A utility function to check if an element has a specific class
    const hasClass = (element, className) => {
      // Check if the class regex exists in cache; if not, create and cache it
      if (!classRegexCache[className]) {
        classRegexCache[className] = new RegExp(
          "(\\s|^)" + className + "(\\s|$)",
        );
      }
      // Check if the class name exists in the element's class attribute
      const classAttribute = element.getAttribute("class") || "";
      return (
        classRegexCache[className].test(classAttribute) &&
        classRegexCache[className]
      );
    };
    const addClass = (elem, className) => {
      if (!hasClass(elem, className)) {
        elem.setAttribute(
          "class",
          (elem.getAttribute("class") || "").trim() + " " + className,
        );
      }
    };

    const removeClass = (elem, className) => {
      const cls = hasClass(elem, className);
      elem.setAttribute(
        "class",
        (elem.getAttribute("class") || "").replace(cls, " "),
      );
    };

    const manageEventListeners = (element, handler, shouldAdd) => {
      const action = shouldAdd ? "addEventListener" : "removeEventListener";

      // Add a recursive call if adding listeners to ensure they’re set correctly
      if (shouldAdd) {
        manageEventListeners(element, handler);
      }

      // Apply the specified action to each event type in the `eventTypes` array
      eventTypes.forEach(function (eventType) {
        element[action](eventType, handler);
      });
    };

    const dispatchCustomEvent = (
      element,
      eventName,
      eventData = {},
      isBubbling = false,
      isCancelable = false,
    ) => {
      // Create a new event using the "Event" interface
      const customEvent = document.createEvent("Event");

      // Add instance data to event detail if necessary
      eventData.instance = lazyLoadSettings;

      // Initialize the event with type, bubbling, and cancelable properties
      customEvent.initEvent(eventName, !isBubbling, !isCancelable);

      // Attach any additional data to the event detail
      customEvent.detail = eventData;

      // Dispatch the event on the specified element
      element.dispatchEvent(customEvent);

      return customEvent;
    };

    // Function to handle image source setting with or without Picturefill (a config for responsive images)
    const setImageSource = (imageElement, imageData) => {
      const picturefillInstance = window.picturefill;

      // Check if Picturefill is not disabled and available, or use a config instance if it exists
      if (!document.HTMLPictureElement && (picturefillInstance || config.pf)) {
        // If imageData contains a src and imageElement lacks a srcset attribute, add the srcset from imageData
        if (
          imageData &&
          imageData.src &&
          !imageElement.getAttribute("srcset")
        ) {
          imageElement.setAttribute("srcset", imageData.src);
        }

        // Use Picturefill to reevaluate the image element
        picturefillInstance({
          reevaluate: true,
          elements: [imageElement],
        });
      } else if (imageData && imageData.src) {
        // If Picturefill is unavailable, simply set the src attribute
        imageElement.src = imageData.src;
      }
    };

    // Function to get computed style property for a given element and property name
    const getStyleProperty = (element, propertyName) => {
      // Return the computed style of the specified property, or an empty object if not found
      return (getComputedStyle(element, null) || {})[propertyName];
    };

    // Function to calculate the width of an element, considering a minimum size requirement
    const calculateWidthWithMinSize = (
      element,
      parentElement,
      elementWidth = element.offsetWidth,
    ) => {
      // Loop to ensure the width meets the minimum size requirement
      while (
        elementWidth < config.minSize &&
        parentElement &&
        !element._lazySizesT4Width
      ) {
        elementWidth = parentElement.offsetWidth;
        parentElement = parentElement.parentNode;
      }
      return elementWidth;
    };

    const createTaskQueue = (() => {
      // Declare variables for managing the task queue
      let isExecutingTasks = false;
      let isScheduled = false;
      const primaryQueue = [];
      const secondaryQueue = [];
      let currentQueue = primaryQueue;

      // Function to execute tasks in the current queue
      const executeTasks = () => {
        const tasksToExecute = currentQueue;
        currentQueue = primaryQueue.length ? secondaryQueue : primaryQueue; // Swap to the other queue if there are pending tasks
        isExecutingTasks = true;
        isScheduled = false;

        // Execute each task in the queue
        while (tasksToExecute.length) {
          tasksToExecute.shift()(); // Remove and execute each task
        }

        isExecutingTasks = false;
      };

      // Function to add a task to the queue, with an option to execute immediately
      function addTask(task, immediate = false) {
        if (isExecutingTasks && !immediate) {
          // If currently executing tasks, queue the task for later
          currentQueue.push(task);
          if (!isScheduled) {
            isScheduled = true;
            // Schedule execution based on the document visibility
            (document.hidden ? scheduleMicrotask : scheduleMacrotask)(
              executeTasks,
            );
          }
        } else {
          task.apply(this, arguments); // Execute task immediately if not currently executing
        }
      }

      // Attach the executeTasks function as a flush method for immediate execution
      addTask._lsFlush = executeTasks;
      return addTask;
    })();

    // `createDebouncedFunction` sets up a debounced version of the given function `func`
    // When `immediate` is true, it calls `func` immediately, otherwise it delays execution.
    const createDebouncedFunction = (func, immediate) => {
      return immediate
        ? function () {
            // Immediate execution
            createTaskQueue(func);
          }
        : function () {
            // Delayed execution with preserved context and arguments
            const context = this;
            const args = arguments; //arguments dosn't work in Arrow Function
            createTaskQueue(() => {
              func.apply(context, args);
            });
          };
    };

    // `createThrottledFunction` controls the rate at which `func` is called, ensuring it's executed
    // only after the specified delay (99 ms) has passed since the last call.
    const createThrottledFunction = function (func) {
      let timeoutId = null;
      let lastCallTime;

      // Throttle wrapper function
      const execute = () => {
        timeoutId = null;
        func();
      };

      const throttledCall = () => {
        const timeElapsed = performance.now() - lastCallTime;
        if (timeElapsed < 99) {
          // If less than 99 ms passed, delay the execution
          setTimeout(throttledCall, 99 - timeElapsed);
        } else {
          (requestAnimationFrame || execute)(execute); // Fallback if requestAnimationFrame not available
        }
      };

      return () => {
        lastCallTime = performance.now();
        if (!timeoutId) {
          timeoutId = setTimeout(throttledCall, 99);
        }
      };
    };

    // Main Lazy Load Handler
    const lazyLoadHandler = (() => {
      let scrollingElements,
        isInitialLoad = false,
        srcReplacementTimeout,
        lazyloadMode,
        startTime,
        viewportWidth,
        viewportHeight,
        viewportState;
      const IMAGE_REGEX = /^img$/i;
      const IFRAME_REGEX = /^iframe$/i;
      const isScrollEventSupported =
        "onscroll" in window && !/(gle|ing)bot/.test(navigator.userAgent);
      let loadAttempts = 0;
      let lazyLoadIndex = 0;
      let initialVisibilityCheck = -1;

      // Track loading status and reset if needed
      const handleScrollEvent = (event) => {
        lazyLoadIndex--;
        if (!event || lazyLoadIndex < 0 || !event.target) {
          lazyLoadIndex = 0;
        }
      };

      // Check if an element is hidden by visibility CSS properties
      const checkElementVisible = (element) => {
        if (!viewportState) {
          viewportState =
            "hidden" === getStyleProperty(document.body, "visibility");
        }
        return (
          !viewportState ||
          !(
            "hidden" === getStyleProperty(element.parentNode, "visibility") &&
            "hidden" === getStyleProperty(element, "visibility")
          )
        );
      };

      const checkVisibility = (element, offset) => {
        let rect,
          currentElement = element,
          isElementVisible = checkElementVisible(element);
        let { top, bottom, left, right } = element.getBoundingClientRect();
        top -= offset;
        bottom += offset;
        left -= offset;
        right += offset;

        while (
          isElementVisible &&
          (currentElement = currentElement.offsetParent) &&
          currentElement != document.body &&
          currentElement != window.documentElement
        ) {
          isElementVisible =
            (getStyleProperty(currentElement, "opacity") || 1) > 0 &&
            "visible" != getStyleProperty(currentElement, "overflow");

          if (isElementVisible) {
            rect = currentElement.getBoundingClientRect();
            return (
              right > rect.left &&
              left < rect.right &&
              bottom > rect.top - 1 &&
              top < rect.bottom + 1
            );
          }
        }

        return isElementVisible;
      };

      const processElements = () => {
        let elementsCount,
          index,
          lastElement,
          elementFound,
          expandDistance,
          viewportTop,
          expandAttribute,
          previousExpandDistance,
          calculatedExpandDistance,
          calculatedFactor,
          hFactor,
          elements = lazyLoadSettings.elements;
        lazyloadMode = config.loadMode;
        elementsCount = elements.length;
        if (lazyloadMode && lazyLoadIndex < 8 && elementsCount) {
          for (
            index = 0, initialVisibilityCheck++;
            index < elementsCount;
            index++
          ) {
            if (elements[index] && !elements[index]._lazyRace) {
              if (
                !isScrollEventSupported ||
                (lazyLoadSettings.prematureUnveil &&
                  lazyLoadSettings.prematureUnveil(elements[index]))
              ) {
                handleLazyRace(elements[index]);
                continue;
              }
              expandAttribute = elements[index].getAttribute("data-expand");
              expandDistance = expandAttribute
                ? 1 * expandAttribute
                : loadAttempts;
              if (!calculatedExpandDistance) {
                calculatedExpandDistance =
                  !config.expand || config.expand < 1
                    ? document.documentElement.clientHeight > 500 &&
                      document.documentElement.clientWidth > 500
                      ? 500
                      : 370
                    : config.expand;
                lazyLoadSettings._defEx = calculatedExpandDistance;
                calculatedFactor = calculatedExpandDistance * config.expFactor;
                hFactor = config.hFac;
                viewportState = null;
                if (
                  loadAttempts < calculatedFactor &&
                  lazyLoadIndex < 1 &&
                  initialVisibilityCheck > 2 &&
                  lazyloadMode > 2 &&
                  !config.hidden
                ) {
                  loadAttempts = calculatedFactor;
                  initialVisibilityCheck = 0;
                } else {
                  loadAttempts =
                    lazyloadMode > 1 &&
                    initialVisibilityCheck > 1 &&
                    lazyLoadIndex < 6
                      ? calculatedExpandDistance
                      : 0;
                }
              }

              if (previousExpandDistance !== expandDistance) {
                viewportWidth = innerWidth + expandDistance * hFactor;
                viewportHeight = innerHeight + expandDistance;
                viewportTop = -1 * expandDistance;
                previousExpandDistance = expandDistance;
              }
              const { top, bottom, left, right } =
                elements[index].getBoundingClientRect();

              if (
                bottom >= viewportTop &&
                top <= viewportHeight &&
                right >= viewportTop * hFactor &&
                left <= viewportWidth &&
                (top || bottom || left || right) &&
                (config.loadHidden || checkElementVisible(elements[index])) &&
                ((isInitialLoad &&
                  lazyLoadIndex < 3 &&
                  !expandAttribute &&
                  (lazyloadMode < 3 || initialVisibilityCheck < 4)) ||
                  checkVisibility(elements[index], expandDistance))
              ) {
                handleLazyRace(elements[index]);
                elementFound = !0;
                if (lazyLoadIndex > 9) break;
              } else {
                !elementFound &&
                  isInitialLoad &&
                  !lastElement &&
                  lazyLoadIndex < 4 &&
                  initialVisibilityCheck < 4 &&
                  lazyloadMode > 2 &&
                  (scrollingElements[0] || config.preloadAfterLoad) &&
                  (scrollingElements[0] ||
                    (!expandAttribute &&
                      (bottom ||
                        right ||
                        left ||
                        top ||
                        "auto" !=
                          elements[index].getAttribute(config.sizesAttr)))) &&
                  (lastElement = scrollingElements[0] || elements[index]);
              }
            }
          }
          lastElement && !elementFound && handleLazyRace(lastElement);
        }
      };

      // Define a throttled or rate-limited function execution mechanism
      const createThrottledFunction = (callback) => {
        let isScheduled = false,
          lastRun = 0,
          throttleDelay = config.throttleDelay,
          requestIdleCallbackTimeout = config.ricTimeout;

        // Function to execute the callback immediately
        const executeCallback = () => {
          isScheduled = false;
          lastRun = Date.now(); // Update last execution time
          callback(); // Run the provided callback
        };

        // Decide whether to use requestIdleCallback (if supported) or a standard timeout
        let scheduleExecution =
          requestIdleCallbackFn && requestIdleCallbackTimeout > 49
            ? () => {
                requestIdleCallbackFn(executeCallback, {
                  timeout: requestIdleCallbackTimeout,
                });
                // Update timeout if it's been changed in the config
                if (requestIdleCallbackTimeout !== config.ricTimeout) {
                  requestIdleCallbackTimeout = config.ricTimeout;
                }
              }
            : throttle(() => {
                setTimeoutFn(executeCallback);
              }, true);

        // Return a throttled version of the provided callback function
        return (forceImmediate) => {
          if (forceImmediate === true) {
            requestIdleCallbackTimeout = 33; // Use a faster timeout for immediate requests
          }

          if (!isScheduled) {
            isScheduled = true;
            let timeSinceLastRun = throttleDelay - (Date.now() - lastRun);

            if (timeSinceLastRun < 0) {
              timeSinceLastRun = 0;
            }

            if (forceImmediate || timeSinceLastRun < 9) {
              scheduleExecution(); // Schedule immediately if forced or within delay threshold
            } else {
              setTimeoutFn(scheduleExecution, timeSinceLastRun); // Otherwise, schedule after delay
            }
          }
        };
      };

      // Usage of the throttled function
      const throttledCallback = createThrottledFunction(processElements);

      const handleLazyLoadEvent = (event) => {
        let targetElement = event.target;

        // Check if the element is already cached
        if (targetElement._lazyCache) {
          // If it is cached, remove the cache property and exit
          delete targetElement._lazyCache;
        } else {
          // Otherwise, process the lazy load actions
          handleScrollEvent(event); // Function to remove event listeners for cleanup
          addClass(targetElement, config.loadedClass); // Mark the element as loaded
          removeClass(targetElement, config.loadingClass); // Remove the loading class
          manageEventListeners(targetElement, processLazyLoadTarget); // Emit a "lazyloaded" event
          dispatchCustomEvent(targetElement, "lazyloaded"); // Remove temporary event listeners
        }
      };

      const lazyLoadEvent = createDebouncedFunction(handleLazyLoadEvent);
      const processLazyLoadTarget = (event) => {
        lazyLoadEvent({
          target: event.target,
        });
      };

      const updateMediaAndSrcset = (element) => {
        const attr =
          config.customMedia[
            element.getAttribute("data-media") || element.getAttribute("media")
          ];
        const srcset = element.getAttribute(config.srcsetAttr);
        if (attr) {
          element.setAttribute("media", document);
        }
        srcset && element.setAttribute("srcset", srcset);
      };

      const lazyLoadElement = createDebouncedFunction(
        (element, eventDetails, isAutoSize, sizeValue, hasParentPicture) => {
          let preventDefaultEvent, srcSet, src, parentIsPicture, firesLoadEvent;

          preventDefaultEvent = dispatchCustomEvent(
            element,
            "lazybeforeunveil",
            eventDetails,
          );
          if (preventDefaultEvent.defaultPrevented) {
            // Clean up lazy race flag and add lazy class
            delete element._lazyRace;
            removeClass(element, config.lazyClass);

            // Run after-load tasks
            createTaskQueue(() => {
              let isCached = element.complete && element.naturalWidth > 1;
              if (firesLoadEvent && !isCached) return;

              if (isCached) addClass(element, "ls-is-cached");

              handleLazyLoadedEvent({ target: element });
              element._lazyCache = true;

              createTaskQueue(() => {
                delete element._lazyCache;
              }, 9);

              if (element.loading === "lazy") lazyLoadCounter--;
            }, true);
            return;
          }

          // Apply 'autosizes' class if needed
          if (sizeValue) {
            isAutoSize
              ? addClass(element, config.autosizesClass)
              : element.setAttribute("sizes", sizeValue);
          }

          srcSet = element.getAttribute(config.srcsetAttr);
          src = element.getAttribute(config.srcAttr);
          if (hasParentPicture) {
            parentIsPicture =
              element.parentNode &&
              PICTURE_REGEX.test(element.parentNode.nodeName || "");
          }

          firesLoadEvent =
            eventDetails.firesLoad ||
            ("src" in element && (srcSet || src || parentIsPicture));

          // Add loading class
          addClass(element, config.loadingClass);

          if (firesLoadEvent) {
            clearTimeout(srcReplacementTimeout);
            srcReplacementTimeout = setTimeoutFn(handleScrollEvent, 2500);
            manageEventListeners(element, processLazyLoadTarget, true);
          }

          if (parentIsPicture) {
            element.parentNode
              .getElementsByTagName("source")
              .forEach(updateMediaAndSrcset);
          }

          if (srcSet) {
            element.setAttribute("srcset", srcSet);
          } else if (src && !parentIsPicture) {
            if (IFRAME_REGEX.test(element.nodeName)) {
              try {
                element.contentWindow.location.replace(src);
              } catch (error) {
                element.src = src;
              }
            } else {
              element.src = src;
            }
          }

          if (hasParentPicture && (srcSet || parentIsPicture)) {
            setImageSource(element, { src });
          }
        },
      );

      // // Check if element is within viewport based on computed boundaries
      // const isInViewport = (element, expandBy) => {
      //   let isVisible = isElementVisible(element);
      //   let parentElement = element;

      //   viewportHeight -= expandBy;
      //   viewportWidth += expandBy;

      //   while (
      //     isVisible &&
      //     (parentElement = parentElement.offsetParent) &&
      //     parentElement !== document.body
      //   ) {
      //     isVisible = parseFloat(getComputedStyle(parentElement).opacity) > 0;
      //     const boundingRect = parentElement.getBoundingClientRect();
      //     isVisible =
      //       isVisible &&
      //       viewportWidth > boundingRect.left &&
      //       viewportHeight < boundingRect.bottom &&
      //       viewportWidth < boundingRect.right &&
      //       viewportHeight > boundingRect.top;
      //   }
      //   return isVisible;
      // };

      // // Process and load elements that are currently in the viewport
      // const loadElementsInViewport = () => {
      //   let lazyElements = document.querySelectorAll('.lazy-load');

      //   if (lazyElements.length) {
      //     for (let i = 0; i < lazyElements.length; i++) {
      //       const currentElement = lazyElements[i];

      //       if (isInViewport(currentElement, 100)) {
      //         loadElement(currentElement);
      //         elementsLoaded++;
      //         if (elementsLoaded > 10) break;
      //       }
      //     }
      //   }
      // };

      // Throttle the loadElementsInViewport function to optimize performance
      // const throttledLoad = throttle(loadElementsInViewport, 250);

      // Throttle function to limit the rate of loadElementsInViewport execution
      function throttle(fn, delay) {
        let lastCall = 0;
        return function () {
          const now = Date.now();
          if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, arguments);
          }
        };
      }

      function ee() {
        if (!isInitialLoad) {
          if (Date.now() - startTime < 999) {
            setTimeoutFn(ee, 999);
          } else {
            isInitialLoad = true;
            config.loadMode = 3;
            throttledCallback();
            addEventListener("scroll", handleLoadMode, !0);
          }
        }
      }
      function initializeLazyLoading() {
        // Initialize current timestamp and lazy elements
        startTime = Date.now();
        lazyLoadSettings.elements = document.getElementsByClassName(
          config.lazyClass,
        );
        scrollingElements = document.getElementsByClassName(
          config.lazyClass + " " + config.preloadClass,
        );

        // Add event listeners for scroll, resize, and pageshow events
        addEventListener("scroll", throttledCallback, true);
        addEventListener("resize", throttledCallback, true);
        addEventListener("pageshow", function (event) {
          // Handle pageshow event, specifically for elements in loading state
          if (event.persisted) {
            const loadingElements = document.querySelectorAll(
              "." + config.loadingClass,
            );
            if (loadingElements.length) {
              requestIdleCallbackFn(() => {
                loadingElements.forEach(function (element) {
                  if (element.complete) {
                    handleLazyRace(element);
                  }
                });
              });
            }
          }
        });

        // Use MutationObserver if available, otherwise use fallback methods
        if (window.MutationObserver) {
          new MutationObserver(throttledCallback).observe(
            document.documentElement,
            {
              childList: true,
              subtree: true,
              attributes: true,
            },
          );
        } else {
          document.documentElement.addEventListener(
            "DOMNodeInserted",
            throttledCallback,
            true,
          );
          document.documentElement.addEventListener(
            "DOMAttrModified",
            throttledCallback,
            true,
          );
          setInterval(throttledCallback, 999);
        }

        // Register event listener for hash changes
        addEventListener("hashchange", throttledCallback, true);

        // Add various events to trigger element processing
        [
          "focus",
          "mouseover",
          "click",
          "load",
          "transitionend",
          "animationend",
        ].forEach((event) => {
          document.addEventListener(event, throttledCallback, true);
        });

        // Ensure lazy loading is triggered on page load if it's not fully loaded yet
        if (/d$|^c/.test(document.readyState)) {
          ee();
        } else {
          addEventListener("load", ee);
          document.addEventListener("DOMContentLoaded", throttledCallback);
          setTimeoutFn(ee, 20000); // Timeout after 20 seconds
        }

        // If there are elements to process, trigger processing and flush actions
        if (lazyLoadSettings.elements.length) {
          processElements(); // Process elements
          createTaskQueue._lsFlush(); // Flush any remaining lazy load actions
        } else {
          throttledCallback(); // Fallback to check elements
        }
      }

      const handleLazyRace = (elem) => {
        if (!elem._lazyRace) {
          let event;
          let isPictureNode = IMAGE_REGEX.test(elem.nodeName);
          let sizes = isPictureNode
            ? elem.getAttribute(config.sizesAttr) || elem.getAttribute("sizes")
            : null;
          let isAutoSize = sizes === "auto";

          if (
            (!isAutoSize && isInitialLoad) ||
            !isPictureNode ||
            (!elem.getAttribute("src") && !elem.srcset) ||
            elem.complete ||
            hasClass(elem, config.errorClass) ||
            !hasClass(elem, config.lazyClass)
          ) {
            event = dispatchCustomEvent(elem, "lazyunveilread").detail;
            isAutoSize &&
              resizeAndSizeUpdater.updateElem(elem, true, elem.offsetWidth);
          }

          elem._lazyRace = true;
          lazyLoadIndex++;
          lazyLoadElement(elem, event, isAutoSize, sizes, isPictureNode);
        }
      };

      const handleLoadMode = () => {
        if (3 == config.loadMode) {
          config.loadMode = 2;
        }
        createThrottledFunction(() => {
          config.loadMode = 3;
          throttledCallback();
        });
      };

      // Public API for initializing and checking elements
      return {
        _: initializeLazyLoading,
        checkElems: throttledCallback,
        unveil: handleLazyRace,
        _aLSL: handleLoadMode,
      };
    })();

    const resizeAndSizeUpdater = (() => {
      let elements,
        updateSizes = createDebouncedFunction(
          (element, container, event, width) => {
            // Adjust width based on scale factor
            width *= parseFloat(element.getAttribute("data-sizes-scale") || 1);
            element._lazySizesT4Width = width;
            width += "px";
            element.setAttribute("sizes", width);

            if (PICTURE_REGEX.test(container.nodeName || "")) {
              let sourceElements = container.getElementsByTagName("source");
              let Len = sourceElements.length;
              for (let i = 0, Len; i < Len; i++) {
                sourceElements[i].setAttribute("sizes", width);
              }
            }
            if (!event.detail.dataAttr) {
              setImageSource(element, event.detail);
            }
          },
        ),
        resizeElements = (element, container, isDataAttr) => {
          let parent = element.parentNode;
          if (parent) {
            // Update the size based on the parent container and the data attribute
            let newWidth = calculateWidthWithMinSize(
              element,
              parent,
              isDataAttr,
            );
            let event = dispatchCustomEvent(element, "lazybeforesizes", {
              width: newWidth,
              dataAttr: !!container,
            });
            if (!event.defaultPrevented) {
              // Only update if the width has changed
              if (newWidth && newWidth !== element._lazySizesT4Width) {
                updateSizes(element, parent, event, newWidth);
              }
            }
          }
        },
        onResize = createThrottledFunction(function () {
          let len = elements.length;
          for (let i = 0; i < len; i++) {
            resizeElements(elements[i]);
          }
        });

      return {
        // Initialize auto size functionality
        _: () => {
          elements = document.getElementsByClassName(config.autosizesClass);
          addEventListener("resize", onResize);
        },
        checkElems: onResize, // Method to check the elements for resizing
        updateElem: resizeElements, // Method to update an individual element's size
      };
    })();

    const initializeLazyLoad = () => {
      if (!initializeLazyLoad.i && document.getElementsByClassName) {
        initializeLazyLoad.i = true;
        resizeAndSizeUpdater._();
        lazyLoadHandler._();
      }
    };
    setTimeoutFn(() => {
      if (config.init) initializeLazyLoad();
    });
    lazyLoadSettings = {
      cfg: config,
      autoSizer: resizeAndSizeUpdater,
      loader: lazyLoadHandler,
      init: initializeLazyLoad,
      uP: setImageSource,
      aC: addClass,
      rC: removeClass,
      hC: hasClass,
      fire: dispatchCustomEvent,
      gW: calculateWidthWithMinSize,
      rAF: createTaskQueue,
    };

    return lazyLoadSettings;
  })(window, window.document, Date);

  global.lazySizesT4 = lazySizes;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = lazySizes;
  }
})(globalThis);

globalThis.document.addEventListener("lazyincludeloaded", function (event) {
  if (event.detail.content && event.detail.content.indexOf("[splitlz]") > -1) {
    const event = event.detail.content.split("[splitlz]")[1];
    event.detail.content = event;
  }
});

globalThis.document.dispatchEvent(new CustomEvent("lazysize:loaded"));

globalThis.document.addEventListener("lazyloaded", (event) => {
  let parentNode = event.target.parentNode;
  if (parentNode && parentNode.classList.contains("bg-11")) {
    parentNode.classList.add("child-lazyloaded");
  }
});
