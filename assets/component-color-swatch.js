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


class ColorSwatch extends HTMLElement {
  constructor() {
    super();

    this.swatches = this.querySelectorAll('[data-name="swatch-option"] input[type="radio"]');
    this.labels = this.querySelectorAll('[data-name="swatch-option"] label');

    const handlers = [
      'attachEvents',
      'changeHandler',
    ];

    handlers.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  connectedCallback() {
    if(!this.swatches || this.swatches.length < 1 || !this.getAttribute('product-variants')) return;

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.attachEvents();
    window.eight.armada.elementRegistry.register({key: 'color-swatch', assetPath: '/assets/component-color-swatch.min.js'});
  }

  attachEvents() {
    this.swatches.forEach(swatch => {
      swatch.addEventListener('click', this.changeHandler);
    });

    if (this.changeOnHover) {
      this.labels.forEach(label => {
        label.addEventListener('mouseenter', this.handleMouseenter);
      });
    }
  }

  changeHandler(e) {
    const swatchValue = e.target.value;
    const variant = this.identifyVariant(swatchValue);

    if(window.eight.eventsEngine) {
      window.eight.eventsEngine.namedEvents.changeVariant(this.productId, variant.id, variant);
    }
  }

  handleMouseenter(e) {
    // Select swatch on hover
    e.target.click();
  }

  identifyVariant(swatchValue) {
    if(this.variants.length == 1) return this.variants[0];

    return this.variants.find(variant => {
      // Case insensitive matching.
      return variant.options[this.optionIndex].localeCompare(swatchValue, undefined, { sensitivity: 'base' }) === 0;
    });
  }

  get optionIndex() {
    return this.getAttribute('option-index') ? this.getAttribute('option-index') : false;
  }

  get productId() {
    return this.getAttribute('product-id') ? Number(this.getAttribute('product-id')) : false;
  }

  get variants() {
    return window.eight.safeJSONParse(this.getAttribute('product-variants'));
  }

  get changeOnHover() {
    return this.dataset.changeOnHover === 'true';
  }
}

window.customElements.define('color-swatch', ColorSwatch);

})();

/******/ })()
;