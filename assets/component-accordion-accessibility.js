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


class DetailsAccordion extends HTMLDetailsElement {
  constructor () {
    super();
    this.summaryElement = this.querySelector('summary');
    this.content = this.querySelector('.animate-details-content');
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  static get observedAttributes() {
    return ['open'];
  }

  attributeChangedCallback() {
    this.handleAccordion();
  }

  init() {
    this.handleAccordion();
    window.addEventListener('resize', this.handleAccordion.bind(this));
    window.eight.armada.elementRegistry.register({key: 'accordion-accessibility', assetPath: '/assets/component-accordion-accessibility.min.js'});
    if (window.Shopify.designMode && this.blockId) {
      document.addEventListener('shopify:block:select', this.blockSelectHandler.bind(this));
      document.addEventListener('shopify:block:deselect', this.blockDeselectHandler.bind(this));
    }
  }

  handleAccordion() {
    this.isOpen = this.hasAttribute('open');

    if (this.isOpen) {
      this.summaryElement.setAttribute('aria-expanded', 'true');
      this.setDetailsOpenHeight();

    } else {
      this.summaryElement.setAttribute('aria-expanded', 'false');
      this.setDetailsClosedHeight();
    }
  }

  setDetailsClosedHeight() {
    if (!this.animate) return;
    this.style.height = `${this.summaryElement.offsetHeight}px`;
    this.resetAnimation(this.content); // Required for consistent animation on details/summary elements
  }

  setDetailsOpenHeight() {
    if (!this.animate) return;
    const openHeight = this.summaryElement.offsetHeight + this.content.offsetHeight;
    this.style.height = `${openHeight}px`;
  }

  resetAnimation(element) {
    if(!element) return;
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = null;
  }

  blockSelectHandler(e) {
    if (e.detail.blockId != this.blockId) return;
    if (e.detail.load) {
      this.style.transition = 'none';
    }
    this.open = true;
  }

  blockDeselectHandler(e) {
    if (e.detail.blockId != this.blockId) return;
    this.style.transition = '';
    this.open = false;
  }

  get animate() {
    return this.getAttribute('animate') === 'true';
  }

  get blockId() {
    return this.getAttribute('block-id') ? this.getAttribute('block-id') : null;
  }
}

window.customElements.define('details-accordion', DetailsAccordion, { extends: 'details' });

})();

/******/ })()
;