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
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(845);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(273);
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__);




class CartCrossSells extends HTMLElement {
  constructor() {
    super();

    this.variance = 40;
    this.previousHighest = 0;

    this.sectionSelectHandler = this.sectionSelectHandler.bind(this);
    this.fetchRecs = this.fetchRecs.bind(this);
    this.fetchCallback = this.fetchCallback.bind(this);
    this.fixedHandler = this.fixedHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.dynamicButtonsUpdated = this.dynamicButtonsUpdated.bind(this);
    this.sectionFetchHandler = this.sectionFetchHandler.bind(this);
  }

  connectedCallback() {
    this.renderEl = this.querySelector('[data-armada-selector="cart-cross-sell-recommendations"]');
    this.footer = document.querySelector('footer');
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(() => this.init(true));
  }

  init(listeners = false) {
    this.cartWrap.setAttribute('data-cross-sells', true);
    const crossSellSection = this.cartWrap.querySelector('cart-cross-sells');
    if (crossSellSection) {
      this.matchingColorSchemes
        ? crossSellSection.classList.add(
            'xl:border-l',
            'xl:border-l-border-opacity-10',
            'border-t',
            'border-t-border-opacity-10',
            'xl:border-t-0'
          )
        : '';
    }

    if(this.isDesktop) {
      this.classList.add('overflow-hidden');
      this.classList.remove('w-full');
      this.parentNode.classList.add('overflow-hidden');
      window.addEventListener('scroll', this.fixedHandler, { passive: true });
    } else {
      window.removeEventListener('scroll', this.fixedHandler, { passive: true });
    }

    this.classList.add('flex');
    this.classList.remove('hidden');

    this.topSummary ? this.classList.add('xl:pt-[114px]') : '';

    window.eight.armada.elementRegistry.register({
      key: 'cart-cross-sells',
      assetPath: '/assets/engine-cart-cross-sells.min.js',
    });

    if(listeners) {
      this.setListeners();
    }
  }

  initSlider() {
    const slider = this.querySelector('slider-engine');

    // Tell the slider it can be safely loaded.
    if(slider && slider.getAttribute('load') === 'false') {
      slider.setAttribute('load', 'true');
    }
  }

  reInit(fetch = false) {
    this.init();

    if(fetch) {
      this.fetchRecs();
    }

    this.setDimensions();
    this.fixedHandler();
  }

  setListeners() {
    document.addEventListener('ARMADA:LOAD:CART', () => this.fetchRecs());
    document.addEventListener('ARMADA:SECTION:FETCH', (e) => this.sectionFetchHandler(e.detail));

    const debouncedResizeHandler = (0,_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(this.resizeHandler, 250);
    window.addEventListener('resize', debouncedResizeHandler);

    // Observe the dynamic payments element for changes.
    const dynamic = document.querySelector('#dynamic-checkout-cart');

    if(dynamic) {
      const debouncedMutationHandler = (0,_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(this.dynamicButtonsUpdated, 500);
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          debouncedMutationHandler();
        })
      });

      observer.observe(dynamic, {
        childList: true,
        attributes: true,
        subtree: true
      });
    }

    if(window.Shopify.designMode) {
      document.addEventListener('shopify:section:select', this.sectionSelectHandler);
      document.addEventListener('shopify:section:reorder', this.sectionSelectHandler);
    }

    window.addEventListener('load', () => {
      document.addEventListener('ARMADA:CART:COUNT:CHANGE', () => this.reInit(true));
    });
  }

  dynamicButtonsUpdated() {
    this.reInit();
  }

  fetchRecs() {
    // Do not fetch if cart is empty.
    if(Object.keys(window.eight.cartEngine.globalCart.highest).length === 0) {
      // The fallback collection will show.
      this.showTitle();
      this.showFallback();
      this.previousHighest = 0;
      return;
    }

    // Only fetch new recommendations if the base product has changed.
    if(this.previousHighest !== window.eight.cartEngine.globalCart.highest.product_id) {
      this.previousHighest = window.eight.cartEngine.globalCart.highest.product_id;
      const selector = '[data-armada-selector="cart-cross-sell-recommendations"]';
      window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(this.url, [this.sectionId], [this.renderEl], [selector], this.fetchCallback);
    }
  }

  setDimensions() {
    if(this.isDesktop) {
      this.style.width = `${this.parentNode.offsetWidth}px`;
      this.pinSummaryToBottom();
    }
  }

  pinSummaryToBottom() {
    this.summary?.classList.remove('absolute', 'bottom-0');

    if (
      this.cartHeight < this.offsetHeight - this.variance &&
      this.cartHeight < window.innerHeight &&
      window.eight.cartEngine?.globalCart?.cart.item_count > 1
    ) {
      this.summary?.classList.add('absolute', 'bottom-0');
    }
  }

  showFallback() {
    const fallbacks = this.querySelectorAll('.cart-cross-sell-fallback-slide');
    fallbacks.forEach(fallback => {
      fallback.classList.remove('js-invisible');
    });

    this.initSlider();
  }

  showTitle() {
    this.querySelector('[data-armada-selector="cart-cross-sells-heading"]').classList.remove('invisible');
  }

  fetchCallback() {
    this.showTitle();
    this.initSlider();
  }

  async sectionFetchHandler({ selectors }) {
    if(!selectors.includes('[data-armada-selector="cart-main-section"]')) return;

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

    this.setDimensions();
  }

  resizeHandler() {
    this.style.width = '';
    this.reInit();
  }

  fixedHandler() {
    if(!this.isDesktop) {
      this.unsetFixed();
      return;
    }

    if(this.cartHeight < (this.offsetHeight - this.variance) || window.eight.cartEngine?.globalCart?.cart.item_count === 0) return;

    const cartMainBounding = this.cartMain.getBoundingClientRect();

    if(cartMainBounding.bottom <= window.innerHeight) {
      this.atBottom();
    }
    else if(cartMainBounding.top > 0) {
      this.unsetFixed();
    }
    else {
      this.setFixed();
    }
  }

  atBottom() {
    this.classList.remove('fixed');
    this.classList.add('absolute', 'bottom-0');
  }

  unsetFixed() {
    this.classList.remove('absolute', 'fixed', 'bottom-0');
  }

  setFixed() {
    this.classList.remove('absolute');
    this.classList.add('fixed', 'bottom-0');
  }

  sectionSelectHandler() {
    this.fetchRecs();
    this.fixedHandler();
  }

  get cartSection() {
    return document.querySelector('[data-armada-selector="cart-empty-section"]');
  }

  get cartHeight() {
    return this.summary ? this.cartSection.offsetHeight + this.summary.offsetHeight : this.cartSection.offsetHeight;
  }

  get headerHeight() {
    const announcement = document.querySelector('#shopify-section-section-announcement-bar');
    const header = document.querySelector('#shopify-section-header');
    const aHeight = announcement ? announcement.offsetHeight : 0;
    const hHeight = header ? header.offsetHeight : 0;
    return aHeight + hHeight;
  }

  get matchingColorSchemes() {
    const colorScheme = this.dataset.colorScheme;
    const cartMainSection = document.querySelector('[data-armada-selector="cart-main-section"]');
    if(!cartMainSection) return false;
    const cartMainColorScheme = cartMainSection.dataset.colorScheme;
    return cartMainColorScheme == colorScheme;
  }

  get summary() {
    return document.querySelector('[data-cart-summary-wrapper]');
  }

  get topSummary() {
    const summaryContainer = document.querySelector('[data-cart-summary-container]');
    if (!summaryContainer) return;
    const topSummary = summaryContainer.dataset.stickySummary;
    return topSummary == 'true' ? true : false;
  }

  get isDesktop() {
    return window.eight.getCurrentBreakpoint() === 'xl' || window.eight.getCurrentBreakpoint() === '2xl';
  }

  get cartWrap() {
    return document.querySelector('[data-template-type="cart"]');
  }

  get cartMain() {
    return document.querySelector('.shopify-section.cart-main');
  }

  get numProducts() {
    return this.dataset.numProducts ? this.dataset.numProducts : 4;
  }

  get sectionId() {
    return this.dataset.sectionId ? this.dataset.sectionId : false;
  }

  get url() {
    return `/recommendations/products?product_id=${window.eight.cartEngine.globalCart.highest.product_id}&limit=${this.numProducts}`;
  }
}

customElements.define('cart-cross-sells', CartCrossSells);

})();

/******/ })()
;