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


class Toast extends HTMLElement {
  constructor() {
    super();
    this.toastTemplate = this.querySelector('template').content;

    const handlers = [
      'handleNotifications',
      'handleAddToCart',
      'handleCartError'
    ]

    handlers.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.attachEvents();
    window.eight.armada.elementRegistry.register({key: 'component-toast', assetPath: '/assets/component-toast.min.js'});
    window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NOTIFICATIONS:LOADED"]}`);
    if (window.Shopify.designMode) {
      setTimeout(() => this.runTestMode(this.testModeSuccess, this.testModeError), 100);
    }
  }

  attachEvents() {
    document.addEventListener("ARMADA:NOTIFICATIONS:EVENT", this.handleNotifications);
    document.addEventListener("ARMADA:CART:ADD", this.handleAddToCart);
    document.addEventListener("ARMADA:CART:ERROR", this.handleCartError);
  }

  handleNotifications(e) {
    const { list, type, id } = e.detail;
    if (!type) return;
    this.clearAll(type);
    this.clearErrors(type);

    if (!id) return;
    this.addNotification(type, list, id, this.toastTemplate);
    this.removeNotification(type, id);
  }

  addNotification(type, list, id, toastTemplate) {
    if (type != 'add') return;
    const notification = list.filter(notification => notification.id == id);
    this.clearAllOnMobile(); // Prevent toasts stacking on mobile
    this.createNewToast(...notification, toastTemplate);
  }

  removeNotification(type, id) {
    if (type != 'remove') return;
    const toastToRemove = this.querySelector(`[data-id="${id}"]`);
    if (toastToRemove) {
      this.removeChild(toastToRemove);
    }
  }

  clearAll(type) {
    if (type != 'clear') return;
    const toasts = this.querySelectorAll('toast-item');
    toasts.forEach(toast => {
      this.removeChild(toast);
    })
  }

  clearErrors(type) {
    if (type != 'clear_errors') return;
    const errorToasts = this.querySelectorAll(`[data-armada-selector="toast-error"]`);
    errorToasts.forEach(errorToast => {
      this.removeChild(errorToast);
    })
  }

  clearAllOnMobile() {
    if (window.eight.getCurrentBreakpoint() != 'sm') return;
    window.eight.notifications.clearList();
  }

  createNewToast(notification, toastTemplate) {
    const newToast = toastTemplate.querySelector(`[data-armada-selector="toast-${notification.type}"]`).cloneNode(true);
    newToast.setAttribute('notification', JSON.stringify(notification));
    newToast.setAttribute('data-id', notification.id);
    this.appendChild(newToast);
  }

  handleAddToCart(e) {
    const { response, quantity } = e.detail;
    const message = quantity > 1 ? `${quantity} ${this.itemsAddedMessage}` : `1 ${this.itemAddedMessage}`;
    const cartItem = response.items[0];
    const sellingPlanId = cartItem.selling_plan_allocation ? cartItem.selling_plan_allocation.selling_plan.id : '';
    const cart_item_id = `${cartItem.id}--${sellingPlanId}`;
    window.eight.notifications.addToList({
      type: 'atc',
      message: message,
      data: {
        cart_item_id: cart_item_id
      },
      dismissible: true,
      error: false
    })
  }

  handleCartError(e) {
    const { error } = e.detail;
    const message = error.data.message;
    const info = error.data.description;
    window.eight.notifications.addToList({
      type: 'error',
      message: message,
      data: {
        info: info
      },
      dismissible: false,
      error: true
    })
  }

  runTestMode(success, error) {
    if (success) {
      window.eight.notifications.addToList({
        type: 'form-submit',
        message: "Success notification",
        data: {
          info: "Notification details"
        },
        dismissible: true,
        error: false
      })
    }
    if (error) {
      window.eight.notifications.addToList({
        type: 'error',
        message: "Error notification",
        data: {
          info: "Notification details"
        },
        dismissible: false,
        error: true
      })
    }
  }

  get testModeSuccess() {
    return this.getAttribute('data-test-mode-success') === 'true'
  }

  get testModeError() {
    return this.getAttribute('data-test-mode-error') === 'true'
  }

  get itemAddedMessage() {
    return this.getAttribute('data-item-added-message');
  }

  get itemsAddedMessage() {
    return this.getAttribute('data-items-added-message');
  }

  detachEvents() {
    document.removeEventListener("ARMADA:NOTIFICATIONS:EVENT", this.handleNotifications);
    document.removeEventListener("ARMADA:CART:ADD", this.handleAddToCart);
    document.removeEventListener("ARMADA:CART:ERROR", this.handleCartError);
    document.removeEventListener('click', this.clicked);
  }

  disconnectedCallback() {
    this.detachEvents();
  }
}

customElements.define('armada-toast', Toast);

})();

/******/ })()
;