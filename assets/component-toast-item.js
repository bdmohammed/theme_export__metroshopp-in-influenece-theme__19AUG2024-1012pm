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

/***/ 845:
/***/ ((module) => {

!function(e,d){ true?module.exports=d():0}(self,(function(){return(()=>{"use strict";var e={};return((e,d)=>{Object.defineProperty(d,"__esModule",{value:!0}),d.isArmadaLoaded=void 0,d.isArmadaLoaded=e=>{var d,o;const a=!0===(null===(o=null===(d=window.eight)||void 0===d?void 0:d.armada)||void 0===o?void 0:o.loaded);if(!e)return a;a?e():document.addEventListener("ARMADA:LOADED",e)},d.default=d.isArmadaLoaded})(0,e),e})()}));

/***/ }),

/***/ 808:
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={};return(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.removeTrapFocus=t.trapFocus=void 0;const o={};t.trapFocus=(e,t=e)=>{const n=Array.from(e.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe")),r=n[0];let a=n[n.length-1];const d=e.querySelector("details:last-of-type summary");d&&(a=d,e.addEventListener("keypress",(e=>{"ENTER"===e.code.toUpperCase()&&(e.target==d?d.toggleAttribute("data-expanded"):d.removeAttribute("data-expanded"),a=void 0!==d.dataset.expanded?n[n.length-1]:d)}))),o.focusin=t=>{t.target!==e&&t.target!==a&&t.target!==r&&"radio"!==t.target.type||document.addEventListener("keydown",o.keydown)},o.focusout=function(){document.removeEventListener("keydown",o.keydown)},o.keydown=function(t){"TAB"===t.code.toUpperCase()&&((t.target===a&&!t.shiftKey||"radio"===t.target.type&&!t.shiftKey)&&(t.preventDefault(),r.focus()),t.target!==e&&t.target!==r||!t.shiftKey||(t.preventDefault(),a.focus()))},document.addEventListener("focusout",o.focusout),document.addEventListener("focusin",o.focusin),t.focus()},t.removeTrapFocus=(e=null)=>{document.removeEventListener("focusin",o.focusin),document.removeEventListener("focusout",o.focusout),document.removeEventListener("keydown",o.keydown),e&&e.focus()}})(),e})()}));

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
/* harmony import */ var _weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(808);
/* harmony import */ var _weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(845);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__);



class ToastItem extends HTMLElement {
  constructor() {
    super();
    this.heading = this.querySelector('[data-armada-selector="toast-heading"]');
    this.infoContainer = this.querySelector('[data-armada-selector="toast-info"]');
    this.htmlContainer = this.querySelector('[data-armada-selector="toast-html-container"]');
    this.closeButton = this.querySelector('[data-armada-selector="toast-close"]');
    this.cartItemContainer = this.querySelector('[data-armada-selector="toast-cart-item"]');
    this.cartTypePage = document.querySelector('body').getAttribute('data-armada-cart-type-page');
    this.animationHeading = this.querySelector('[data-armada-selector="toast-animate-heading"]');
    this.animationContent = this.querySelector('[data-armada-selector="toast-animate-content"]');
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__.isArmadaLoaded)(this.init.bind(this));
  }

  attachEvents() {
    if (this.isDismissible) {
      this.addEventListener('mouseenter', () => this.pauseTimer());
      this.addEventListener('keydown', () => this.pauseTimer());
      this.addEventListener('mouseleave', () => this.resumeTimer());
    }

    this.closeButton.addEventListener('click', () => this.removeToast(this.id));
  }

  init() {
    this.handleMessage(this.message, this.heading);
    this.handleInfo(this.info, this.infoContainer);
    this.handleHtml(this.html, this.htmlContainer);
    this.handleDisplay(this.type, this.cartItemId, this.cartItemContainer);
    window.eight.armada.elementRegistry.register({key: 'component-toast-item', assetPath: '/assets/component-toast-item.min.js'});
  }

  handleMessage(message, targetElement) {
    if (!message) return;
    // Toast heading and aria label
    targetElement.textContent = message;
    this.setAttribute('aria-label', message);
  }

  handleInfo(info, targetContainer) {
    if (!info) return;
    if(typeof info !== 'string') return;
    // Toast additional info
    targetContainer.innerHTML = info;
    targetContainer.classList.add('mt-3');
  }

  handleHtml(html, targetContainer) {
    if (!html) return;
    targetContainer.innerHTML = html;
  }

  handleDisplay(type, cartItemId, cartItemContainer) {
    if (type == 'atc' && this.cartTypePage) return;
    // If atc, add cart line item content then display toast, otherwise display toast
    if (type == 'atc' && cartItemId && window.eight.getCurrentBreakpoint() != 'sm') {
      this.handleAtcContent(cartItemId, cartItemContainer);
    } else {
      this.displayToast();
    }
  }

  handleAtcContent(id, container) {
    const selector = `[data-armada-selector="toast-cart-item--${id}"]`;
    window.eight.sectionsEngine.sectionRenderingEngine.fetchSection('?', ['toast-cart-item'], [container], [selector], () => this.displayToast());
  }

  displayToast() {
    this.classList.remove('invisible');
    (0,_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__.trapFocus)(this, this.closeButton);
    this.animateToast();
    this.parentElement.scrollTop = 0; // Prevents scrolling to latest toast
  }

  animateToast() {
    const transformValue = this.isMobile ? '100%' : '-100%';
    const duration = this.isMobile ? 300 : 500;
    const toastAnimation = this.animate(
      [
        { transform: `translateY(${transformValue})` },
        { transform: 'translateY(0%)' }
      ],
      {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );
    toastAnimation.onfinish = () => {
      this.classList.remove('-z-[1]');
      this.animateHeading();
      this.animateContent();
    }
  }

  animateHeading() {
    if (!this.animationHeading) return;
    const headingAnimation = this.animationHeading.animate(
      [
        { transform: `translateY(20px)`, opacity: 0 },
        { transform: 'translateY(0px)', opacity: 100 }
      ],
      {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );
  }

  animateContent() {
    if (!this.animationContent) {
      this.initiateDismissible();
      this.attachEvents();
      return;
    }
    const contentAnimation = this.animationContent.animate(
      [
        { transform: `translateY(20px)`, opacity: 0 },
        { transform: 'translateY(0px)', opacity: 100 }
      ],
      {
        delay: 150,
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );
    contentAnimation.onfinish = () => {
      setTimeout(() => {
        this.initiateDismissible();
        this.attachEvents();
      }, 500);
    }
  }

  initiateDismissible() {
    if (!this.isDismissible) return;
    this.remainingTime = this.duration;
    this.animateProgressBar();
    this.setTimer();
  }

  animateProgressBar() {
    this.querySelector('progress-bar').setAttribute('data-progress-play', true);
  }

  pauseProgressBar() {
    window.eight.eventsEngine.emit(`${window.eight.constants.events["ARMADA:PROGRESSBAR:PAUSE"]}`, { 'element': this });
  }

  resumeProgressBar() {
    window.eight.eventsEngine.emit(`${window.eight.constants.events["ARMADA:PROGRESSBAR:PLAY"]}`, { 'element': this });
  }

  setTimer() {
    this.startTime = Date.now();
    this.timer = setTimeout(() => {
      this.removeToast(this.id);
    }, this.remainingTime);
  }

  pauseTimer() {
    this.pauseProgressBar();
    clearTimeout(this.timer);
    this.stopTime = Date.now();
    this.remainingTime = this.remainingTime - (this.stopTime - this.startTime);
  }

  resumeTimer() {
    if (!this.stopTime) return;
    this.resumeProgressBar();
    this.setTimer();
  }

  removeToast(id) {
    window.eight.notifications.removeFromList(id);
    (0,_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__.removeTrapFocus)();
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
  }

  get notification() {
    return window.eight.safeJSONParse(this.getAttribute('notification'));
  }

  get id() {
    return this.notification.id;
  }

  get type() {
    return this.notification.type;
  }

  get message() {
    return this.notification.message;
  }

  get isDismissible() {
    return this.notification.dismissible;
  }

  get duration() {
    return this.getAttribute('duration');
  }

  get info() {
    return this.notification.data ? this.notification.data.info : null;
  }

  get cartItemId() {
    return this.notification.data ? this.notification.data.cart_item_id : null;
  }

  get html() {
    return this.notification.data ? this.notification.data.html : null;
  }

  get isMobile() {
    return window.eight.getCurrentBreakpoint() == 'sm';
  }
}

customElements.define('toast-item', ToastItem);

})();

/******/ })()
;