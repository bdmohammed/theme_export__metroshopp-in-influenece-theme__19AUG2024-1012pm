/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ 845: /***/ (module) => {
      !(function (e, d) {
        true ? (module.exports = d()) : 0;
      })(self, function () {
        return (() => {
          "use strict";
          var e = {};
          return (
            ((e, d) => {
              Object.defineProperty(d, "__esModule", { value: !0 }),
                (d.isArmadaLoaded = void 0),
                (d.isArmadaLoaded = (e) => {
                  var d, o;
                  const a =
                    !0 ===
                    (null ===
                      (o =
                        null === (d = window.eight) || void 0 === d
                          ? void 0
                          : d.armada) || void 0 === o
                      ? void 0
                      : o.loaded);
                  if (!e) return a;
                  a ? e() : document.addEventListener("ARMADA:LOADED", e);
                }),
                (d.default = d.isArmadaLoaded);
            })(0, e),
            e
          );
        })();
      });

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__,
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat get default export */
  /******/ (() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = (module) => {
      /******/ var getter =
        module && module.__esModule
          ? /******/ () => module["default"]
          : /******/ () => module;
      /******/ __webpack_require__.d(getter, { a: getter });
      /******/ return getter;
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be in strict mode.
  (() => {
    "use strict";
    /* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__ =
      __webpack_require__(845);
    /* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0___default =
      /*#__PURE__*/ __webpack_require__.n(
        _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__,
      );

    class ResponsiveImage extends HTMLImageElement {
      constructor() {
        super();

        this.allImages = document.querySelectorAll('[is="responsive-image"]');
      }

      connectedCallback() {
        (0,
        _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(
          this.init.bind(this),
        );
      }

      init() {
        this.lazyLoadHandling();
        window.eight.armada.elementRegistry.register({
          key: "responsive-image",
          assetPath: "/assets/component-responsive-image.min.js",
        });
      }

      lazyLoadHandling() {
        const observerCallback = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) return;
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          });
        };

        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0,
        };

        const observer = new IntersectionObserver(
          observerCallback,
          observerOptions,
        );

        this.allImages.forEach((imageEl) => {
          observer.observe(imageEl);
        });
      }

      loadImage(imageElement) {
        imageElement.setAttribute("loading", "lazy");
      }
    }

    window.customElements.define("responsive-image", ResponsiveImage, {
      extends: "img",
    });
  })();

  /******/
})();
