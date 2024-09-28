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


class StickyProductForm extends HTMLElement {
  constructor() {
    super();

    this.productProperties = this.mainProductForm.querySelectorAll('[name^=properties]:not([disabled]):not([type="hidden"])');
    this.stickyForm = this.querySelector('form');
    if(!this.getAttribute('product-id')) return;
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.productProperties.forEach(property => {
      property.addEventListener('change', (e) => this.handleCustomProperties(e));
    });

    // Show or hide the sticky product form
    this.handleVisibility();

    // Remove the no-js utility from the single select, we want to use it here.
    const selectWrap = this.querySelector('[data-armada-selector="select-wrap"]');
    if(selectWrap) {
      selectWrap.parentNode.classList.remove('no-js-show');
    }

    // Show the single selector for options (rather than up to 3 select elements).
    const form = this.querySelector('[data-name="basic-product-form"] form');
    form.classList.add('w-full');

    const select = form.querySelector('select');
    if(select) select.classList.remove('no-js-show');

    window.eight.armada.elementRegistry.register({key: 'product-form-sticky', assetPath: '/assets/component-product-form-sticky.min.js'});
  }

  handleVisibility() {
    const stickyFormObserverCallback = (itemsToObserve) => {
      // Hide the sticky form if the header or product form is in view, else show the sticky form
      if (!itemsToObserve[0].isIntersecting && itemsToObserve[0].boundingClientRect.top < 0) {
        this.removeAttribute("hidden");

        if (this.selectEls) {
          this.selectEls[0].focus();
        } else if (this.button) {
          this.button.focus();
        }
      } else {
        this.setAttribute("hidden", "");
      }
    }

    const stickyFormObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const stickyFormObserver = new IntersectionObserver(
      stickyFormObserverCallback,
      stickyFormObserverOptions
    );

    // Observe the product form
    if (this.mainProductForm) {
      stickyFormObserver.observe(this.mainProductForm);
    }
  }

  handleCustomProperties(e) {
    const prop = e.target.cloneNode(true);
    const isSelect = e.target.nodeName == 'SELECT';

    if (prop && this.stickyForm) {
      const existingNode = this.stickyForm.querySelector(`[name="${prop.name}"]`);
      if (existingNode) existingNode.remove();

      prop.classList.add('hidden');

      if (isSelect) {
        const selectedOption = e.target.options[e.target.selectedIndex].value;
        const getMatchingOption = prop.querySelector(`option[value="${selectedOption}"]`);
        if (getMatchingOption) getMatchingOption.setAttribute('selected', '');
      }

      this.stickyForm.appendChild(prop);
    }
  }

  get button() {
    return this.querySelector('[data-name="product-submit"]');
  }

  get selectEls() {
    return this.querySelectorAll('[data-armada-selector="select-wrap"] select');
  }

  get sectionId() {
    return this.dataset.sectionId ? this.dataset.sectionId : false;
  }

  get productId() {
    return this.getAttribute('product-id') ? this.getAttribute('product-id') : false;
  }

  get childForm() {
    return this.querySelector(`[data-name="main-product-form"][section-id="${this.sectionId}"]`);
  }

  get childFormTemplate() {
    return this.childForm.querySelector(`template#product-form-${this.sectionId}-${this.productId}`).content;
  }

  get product() {
    if(!this.childForm) return false;
    return window.eight.safeJSONParse(this.childForm.getAttribute('product'));
  }

  get mainProductForm() {
    return document.querySelector(`[data-name="main-product-form"]`);
  }

  get headerSection() {
    return document.querySelector('[data-aid="header-section"]');
  }
}

customElements.define('product-form-sticky', StickyProductForm);

})();

/******/ })()
;