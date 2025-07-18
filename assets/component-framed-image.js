/*!
 *
 * ------
 * Note: customizing files reduces the store's ability to auto-update the theme.
 *
 * Disclaimer:
 * This is a non minified version of a core js file, you can swap out the liquid / HTML link from the minified file if you choose to utilize this one. Any usage of these files is at the merchant/app/expert/agency's own risk, we take no responsibility for custom code changes. Support offerings from We Are Eight will be limited to rolling back to the latest theme version if these are utilized.
 *
 * License and acceptance of usage:
 *
 * Copyright (C) We Are Eight LTD  - All Rights Reserved
 * This file is part of Influence theme provided for usage on Shopify online stores only.
 * Unauthorized usage and or modification of this file outside of this Influence utilized on a Shopify store without a valid license, is strictly prohibited.
 * Unauthorized copying or distribution of this file, via any medium is strictly prohibited.
 * Proprietary and confidential
 *
 * More information and official contact details: weareeight.com
 * ------
 *
 */
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

    const changeSet = {
      "data-frame-type": "frameType",
      "data-frame-sides": "frameSides",
      "data-default-frame-classes": "defaultFrameClasses",
      "data-active-frame-classes": "activeFrameClasses",
    };
    class FramedImg extends HTMLElement {
      constructor() {
        super();
        this.targetSelector = this.dataset.armadaSelector;
        this.frameType = this.dataset.frameType;
        this.frameSides = this.dataset.frameSides;
        this.defaultFrameClasses = this.dataset.defaultFrameClasses;
        this.activeFrameClasses = this.dataset.activeFrameClasses;
        this.mobileDefaultFrameClasses = this.dataset.mobileDefaultFrameClasses;
        this.mobileActiveFrameClasses = this.dataset.mobileActiveFrameClasses;
        this.observerOptions = {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          root: null,
          rootMargin: "0px",
        };
        this.observer = new IntersectionObserver(
          (entries, observer) => this.observerCallback(entries, observer),
          this.observerOptions,
        );
        this.changeSet = changeSet;
      }
      connectedCallback() {
        this.observer.observe(this);
        (0,
        _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(
          this.init.bind(this),
        );
      }
      disconnectedCallback() {
        this.observer.unobserve(this);
      }
      static get observedAttributes() {
        return [...Object.keys(changeSet)];
      }
      attributeChangedCallback(name, oldValue, newValue) {
        const changeKeys = Object.keys(this.changeSet);
        if (changeKeys.includes(name) && oldValue !== newValue) {
          this[this.changeSet[name]] = newValue;
        }
      }
      init() {
        const overlayContentElement = document.querySelector(
          `[data-armada-selector="mobile-overlay-content-${this.targetSelector}" ]`,
        );
        const desktopContentElement = document.querySelector(
          `[data-armada-selector="desktop-overlay-${this.targetSelector}"]`,
        );
        desktopContentElement.innerHTML = overlayContentElement.innerHTML;
        window.eight.armada.elementRegistry.register({
          key: "framed-image",
          assetPath: "/assets/component-framed-image.min.js",
        });
      }
      observerCallback(entries, observer) {
        const entry = entries[0];
        const lessThanThreeQuarters = entry.intersectionRatio < 0.65;
        const lessThanHalf = entry.intersectionRatio < 0.55;
        if (this.frameType === "full-width") {
          this.setAttribute(
            "data-framed-out",
            lessThanThreeQuarters ? "true" : "false",
          );
          this.changeBorder(lessThanThreeQuarters);
        }
        if (this.frameType === "framed") {
          this.setAttribute("data-framed-out", lessThanHalf ? "true" : "false");
          this.changeBorder(lessThanHalf);
        }
      }
      changeBorder(change) {
        const contentContainer = this.querySelector(
          '[data-armada-selector="framed-content-container"]',
        );
        const mobileContainer = this.querySelector(
          `[data-armada-selector="mobile-overlay-content-${this.targetSelector}"]`,
        );
        if (change) {
          contentContainer.classList.add(...this.activeFrameClasses.split(" "));
          contentContainer.classList.remove(
            ...this.defaultFrameClasses.split(" "),
          );
          mobileContainer.classList.add(
            ...this.mobileActiveFrameClasses.split(" "),
          );
          mobileContainer.classList.remove(
            ...this.mobileDefaultFrameClasses.split(" "),
          );
        } else {
          contentContainer.classList.remove(
            ...this.activeFrameClasses.split(" "),
          );
          contentContainer.classList.add(
            ...this.defaultFrameClasses.split(" "),
          );
          mobileContainer.classList.remove(
            ...this.mobileActiveFrameClasses.split(" "),
          );
          mobileContainer.classList.add(
            ...this.mobileDefaultFrameClasses.split(" "),
          );
        }
        const allBlocks = document.querySelectorAll(
          '[data-only-display-active="true"]',
        );
        if (allBlocks.length > 0) {
          allBlocks.forEach((element) => {
            element.setAttribute(
              "data-display-status",
              change ? "true" : "false",
            );
          });
        }
      }
      isMobile() {
        return window.matchMedia("only screen and (max-width: 768px)").matches;
      }
    }
    window.customElements.define("framed-image", FramedImg);
  })();

  /******/
})();
