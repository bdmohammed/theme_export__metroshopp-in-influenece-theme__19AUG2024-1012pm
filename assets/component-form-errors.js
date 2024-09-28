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
/*
Triggers a form error message notification. Example usage:
{% if form.errors %}
  <form-errors data-form-type="customer" data-form-name="Newsletter" data-errors='{{ form.errors | default_errors }}'></form-errors>
  <script src="{{ 'component-form-errors.min.js' | asset_url }}" defer="defer" type="module"></script>
{% endif %}
*/



class FormErrors extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.onFormSubmit(this.formType, this.errors);
    document.addEventListener("ARMADA:NOTIFICATIONS:LOADED", () => this.onFormSubmit(this.formType, this.errors));
  }

  onFormSubmit(formType, errors) {
    const submittedFormType = new URLSearchParams(window.location.search).get('form_type');
    // If a different form type was submitted, do nothing
    if (submittedFormType && formType != submittedFormType) return;

    // Find the first form of the type submitted and handle notification
    const formError = document.querySelector(`[data-form-type=${formType}]`);
    const formName = formError.dataset.formName;
    const form = formError.closest('form');
    this.handleNotification(formName, errors, form);
  }

  handleNotification(formName, errors, form) {
    if (!errors) return;
    this.showNotification(formName, errors);
    const formID = form.id;
    const searchQuery = 'armada-modal #' + formID;
    const notInModal = document.querySelector(searchQuery) == null
    if(notInModal)
      this.scrollToForm(form);
  }

  showNotification(formName, errors) {
    const message = `Error(s) in ${formName} form`;
    this.clearList(); // Prevents duplicate notifications when multiple forms of same type on one page
    window.eight.notifications.addToList({
      type: 'error',
      message: message,
      data: {
        info: errors
      },
      dismissible: false,
      error: true
    })
  }

  scrollToForm(form) {
    setTimeout(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear error notification when focus on form
      form.addEventListener('focusin', () => this.clearErrors());
    }, 500)
  }

  clearErrors() {
    window.eight.notifications.clearErrors();
  }

  clearList() {
    window.eight.notifications.clearList();
  }

  get formType() {
    return this.getAttribute('data-form-type');
  }

  get errors() {
    return this.getAttribute('data-errors');
  }
}

customElements.define('form-errors', FormErrors);

})();

/******/ })()
;