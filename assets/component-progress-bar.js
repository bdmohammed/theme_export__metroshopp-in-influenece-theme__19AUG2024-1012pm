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


class ProgressBar extends HTMLElement {
  constructor() {
    super();

    this.previousStep = this.dataset.currentStep ? this.dataset.currentStep : 0;
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.attachEventListeners();
    window.eight.armada.elementRegistry.register({key: 'progress-bar', assetPath: '/assets/component-progress-bar.min.js'});
  }

  static get observedAttributes() {
    return ['data-progress-play', 'data-current-step'];
  }

  animateBar() {
    this.bar.style.opacity = 1;

    this.animation = this.bar.animate(
      [
        { width: this.prevStepPercent },
        { width: this.currentStepPercent }
      ],
      {
        duration: this.interval,
        fill: 'forwards'
      }
    )
  }

  attributeChangedCallback() {
    if(this.dataset.progressPlay === 'true') {
      this.animateBar();
    }
    else if(this.hideOnFull) {
      // Visually hide the bar, used e.g. during slideshow animations.
      this.hideBar();
    }
  }

  attachEventListeners() {
    document.addEventListener('ARMADA:PROGRESSBAR:PAUSE', this.handlePause.bind(this));
    document.addEventListener('ARMADA:PROGRESSBAR:PLAY', this.handlePlay.bind(this));
  }

  handlePause(e) {
    if(!e.detail || !e.detail.element) return;

    // Find progress bar within the given wrapper element.
    const hasBar = e.detail.element.querySelector('progress-bar')

    if(hasBar === this) {
      this.animation.pause();
    }
  }

  handlePlay(e) {
    if(!e.detail || !e.detail.element) return;

    // Find progress bar within the given wrapper element.
    const hasBar = e.detail.element.querySelector('progress-bar')

    if(hasBar === this) {
      this.animation.play();
    }
  }

  hideBar() {
    this.bar.style.opacity = 0;
  }

  get bar() {
    return this.querySelector('[data-name="bar"]');
  }

  get prevStepPercent() {
    if(this.steps && this.dataset.currentStep) {
      return (100 / this.steps) * parseInt(this.dataset.previousStep) + '%';
    }
    return '0%';
  }

  get currentStepPercent() {
    if(this.steps && this.dataset.currentStep) {
      return (100 / this.steps) * parseInt(this.dataset.currentStep) + '%';
    }
    return '100%';
  }

  get hideBar() {
    return this.dataset.hideOnFull ? this.dataset.hideOnFull : false;
  }

  get interval() {
    return +this.dataset.progressInterval;
  }

  get steps() {
    return this.dataset.steps ? parseInt(this.dataset.steps) : false;
  }
}

customElements.define('progress-bar', ProgressBar);

})();

/******/ })()
;