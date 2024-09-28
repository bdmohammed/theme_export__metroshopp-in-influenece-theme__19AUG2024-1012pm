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
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 273:
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={};return((e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.debounce=void 0,t.debounce=(e,t,o)=>{let n;return function(){let u=this,r=arguments;const a=()=>{n=null,o||e.apply(u,r)};o&&!n&&e.apply(u,r),clearTimeout(n),n=setTimeout(a,t)}},t.default=t.debounce})(0,e),e})()}));

/***/ }),

/***/ 845:
/***/ ((module) => {

!function(e,d){ true?module.exports=d():0}(self,(function(){return(()=>{"use strict";var e={};return((e,d)=>{Object.defineProperty(d,"__esModule",{value:!0}),d.isArmadaLoaded=void 0,d.isArmadaLoaded=e=>{var d,o;const a=!0===(null===(o=null===(d=window.eight)||void 0===d?void 0:d.armada)||void 0===o?void 0:o.loaded);if(!e)return a;a?e():document.addEventListener("ARMADA:LOADED",e)},d.default=d.isArmadaLoaded})(0,e),e})()}));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(845);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__);



class CartSummary extends HTMLElement {
  constructor() {
    super();

    // Return if the sticky summary functionality is disabled
    if(!this.cartSummaryWrapper) return;
    if(!this.stickySummary) return;
    if(!this.stickySummaryMobile) return;
    if(!this.emptyEl) return;

    this.loaded = false;

    this.init = this.init.bind(this);
    this.handleStickySummary = this.handleStickySummary.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSectionFetch = this.handleSectionFetch.bind(this);
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__.isArmadaLoaded)(this.handleLoaded.bind(this));
  }

  handleLoaded() {
    const returnedFunction = (0,_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_0__.debounce)(this.handleResize, 250);
    window.addEventListener('resize', returnedFunction);
    document.addEventListener('ARMADA:CART:COUNT:CHANGE', () => this.init());
    document.addEventListener('ARMADA:SECTION:FETCH', (e) => this.handleSectionFetch(e.detail));
    this.init();

    window.eight.armada.elementRegistry.register({key: 'component-cart-summary', assetPath: '/assets/component-cart-summary.min.js'});
  }

  init() {
    if(this.cartMainInner?.offsetHeight > window.innerHeight || window.Shopify.designMode) {
      this.handleStickySummary();
    }
    else {
      this.hideSticky();
    }
  }

  async handleSectionFetch({ selectors }) {
    if (
      !selectors.includes('[data-armada-selector="cart-cross-sell-recommendations"]') &&
      !selectors.includes('[data-armada-selector="cart-main-section"]')
    ) {
      return;
    }

    // Await images loading before resetting dimensions.
    const images = document.querySelectorAll('[data-armada-selector="cart-main-section"] img');

    const promises = Array.from(images).map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = image.src;
      });
    });

    await Promise.all(promises);
    this.init();
  }

  handleResize() {
    this.stickySummary.style.width = `${this.cartSummaryWrapper.offsetWidth}px`;
    this.stickySummaryMobile.style.width = `${this.cartSummaryWrapper.offsetWidth}px`;

    if(this.cartMainInner?.offsetHeight <= window.innerHeight) {
      this.hideSticky();
    }
  }

  handleStickySummary() {
    if (this.emptyEl) this.emptyEl.classList.remove('hidden');

    // Set the price container to flex to center the text vertically
    if(!this.isMobile()) {
      if (this.emptyEl) this.emptyEl.querySelector('[data-armada-selector="regular-price-container"]').classList.add('flex');
    }

    const summaryObserverCallback = (elementsToObserve, cartSummaryObserver) => {
      if(!elementsToObserve[0].isIntersecting) {
        // Don't show the sticky summary if we're above that element.
        const windowTop = window.pageYOffset;
        const elementRect = elementsToObserve[0].target.getBoundingClientRect();
        if(windowTop < elementRect.top) return;

        this.handleResize();

        // If on desktop, set the position of the sticky summary container to fixed,
        // else if on mobile, set the mobile summary to fixed.
        if(!this.isMobile()) {
          this.stickySummary.style.position = 'fixed';
          this.stickySummary.style.top = '0px';
          this.stickySummary.querySelector('[data-armada-selector="regular-price-container"]').classList.add('flex');
          this.stickySummary.classList.remove('hidden');
        } else {
          this.stickySummaryMobile.style.position = 'fixed';
          this.stickySummaryMobile.style.top = '0px';
          this.stickySummaryMobile.classList.remove('hidden');
        }
      }
      else {
        // Hide sticky summaries if the top or bottom summary is intersecting
        this.hideSticky();
      }
    }

    const staticSummary = this.isMobile()
    ? document.querySelector('[data-armada-selector="cart-summary-sticky-mobile"]')
    : document.querySelector('[data-armada-selector="cart-summary-static-top"]');

    let heightForMargin = staticSummary ? staticSummary.offsetHeight : 60;
    heightForMargin = window.Shopify.designMode ? heightForMargin * 2 : heightForMargin;

    const cartSummaryObserver = new IntersectionObserver(summaryObserverCallback, {
      root: null,
      rootMargin: `-${heightForMargin}px`
    });

    if(!this.loaded) {
      if (!this.emptyEl || !this.checkoutButton) return;
      cartSummaryObserver.observe(this.emptyEl);
      cartSummaryObserver.observe(this.checkoutButton);
      this.loaded = true;
    }
  }

  hideSticky() {
    if(!this.isMobile()) {
      this.stickySummary.classList.add('hidden');
    } else {
      this.stickySummaryMobile.classList.add('hidden');
    }
  }

  isMobile() {
    return window.matchMedia('only screen and (max-width: 768px)').matches;
  }

  get checkoutButton() {
    return this.querySelector('[data-armada-selector="cart-summary-static-bottom"] [data-armada-selector="checkout-button"]');
  }

  get emptyEl() {
    return document.querySelector('[data-cart-summary-placeholder]');
  }

  get cartSummaryWrapper() {
    return this.parentElement;
  }

  get stickySummary() {
    return this.querySelector('[data-armada-selector="cart-summary-sticky"]');
  }

  get stickySummaryMobile() {
    return this.querySelector('[data-armada-selector="cart-summary-sticky-mobile"]');
  }

  get lineItemsWrapper() {
    return document.querySelector('[data-armada-selector="cart-line-items-wrapper"]');
  }

  get cartMainSection() {
    return document.querySelector('[data-armada-selector="cart-main-section"]');
  }

  get cartMainInner() {
    return document.querySelector('[data-armada-selector="cart-main-inner"]');
  }
}

customElements.define('cart-summary', CartSummary);

})();

/******/ })()
;