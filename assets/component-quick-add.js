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


class QuickAdd extends HTMLElement {
  constructor() {
    super();

    this.buttonWrap = this.querySelector('[data-name="product-submit-wrapper"]');
    this.cartTypePage = document.querySelector('body').getAttribute('data-armada-cart-type-page');
    this.cartPageUrl = document.querySelector('body').getAttribute('data-cart-url');
    if (!this.buttonWrap || !this.getAttribute('product')) return;

    const handlers = [
      'init',
      'handleButtonClick',
      'handleOptionChange',
      'atcSuccess',
      'atcError',
    ];

    handlers.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init);
    document.addEventListener('ARMADA:TRANSLATION:SYNC', this.init);
  }

  init() {
    this.currentVariant = window.eight.productEngine.firstAvailableVariant(this.product);

    this.templateContent = this.querySelector(`template#quick-add-${this.sectionId}-${this.product.id}`).content;
    this.templateOptionsWrap = this.templateContent.querySelector('[data-name="quick-add-options"]');
    this.loadingButtonHtml = this.templateContent.querySelector('[data-button-loading]').outerHTML;

    this.render();
    this.button = this.querySelector('[data-name^="button-"]');
    if(this.button) {
      this.button.addEventListener('click', this.handleButtonClick);
    }

    window.eight.armada.elementRegistry.register({key: 'quick-add', assetPath: '/assets/components-quick-add.js'})
  }

  render() {
    // Keep the passed-in tailwind styles.
    this._classList = this.templateContent.querySelector('[data-name="product-submit"]') ? this.templateContent.querySelector('[data-name="product-submit"]').classList : '';
    this.buttonWrap = this.querySelector('[data-name="product-submit-wrapper"]');

    // Change button to 'choose' state.
    this.buttonWrap.innerHTML = this.getButton();
  }

  loadingButton() {
    return `
      <div>
        ${this.loadingButtonHtml}
        <span class="sr-only">${window.eight.translationEngine.strings.adding}</span>
      </div>
    `;
  }

  buttonHtml(type = 'add') {
    if (!type) return '';

    // Choose (shown until all options chosen)
    // Add (all options chosen or only 1 option)
    // Sold out (all options chosen, selected variant is unavailable)
    // Added (after successful cart add event)

    const { addToCart, choose, soldOut, added, unavailable, isSoldOut, chooseVariant } = window.eight.translationEngine.strings;

    const labels = {
      'add': addToCart,
      'choose': choose,
      'sold-out': soldOut,
      'added': added,
      'unavailable': unavailable
    };

    if (!labels[type]) return '';

    const ariaLabels = {
      'add': addToCart,
      'choose': chooseVariant,
      'sold-out': `'${this.currentVariant.title}' ${isSoldOut}`,
      'added': `${added} '${this.currentVariant.title}'`,
      'unavailable': unavailable
    };

    return `
      <button
        type="button"
        data-name="button-${type}"
        aria-label="${ariaLabels[type]}"
        class="${this._classList}"
        ${type !== 'add' && type !== 'choose' ? 'disabled' : ''}
      >
        ${labels[type]}
      </button>
    `;
  }

  getButton() {
    // Variant doesn't exist.
    if(!this.currentVariant) {
      return this.buttonHtml('unavailable');
    }

    // Options are visible but current variant is sold out.
    if (!this.currentVariant.available) {
      return this.buttonHtml('sold-out');
    }

    // If product has variants, one must be chosen before adding to cart.
    if (
      window.eight.productEngine.hasVariants(this.product) &&
      !this.allOptionsChosen
    ) {
      return this.buttonHtml('choose');
    }

    // If we have a variant selected, show 'Add to cart'.
    return this.buttonHtml('add');
  }

  handleButtonClick(e) {
    if (!('name' in e.target.dataset) || e.target.disabled) return;

    const action = e.target.dataset.name.replace('button-', '');

    if (action === 'choose') {
      // Print option dropdowns.
      this.insertBefore(
        this.templateOptionsWrap,
        this.querySelector('[data-name="basic-product-form"]')
      );

      this.selects = this.querySelectorAll('[data-name="quick-add-options"] select');

      this.selects.forEach((select, index) => {
        select.addEventListener('change', this.handleOptionChange);

        // Focus on the first <select>.
        if(index === 0) select.focus();
      });

      // Disable button until all options chosen.
      this.button.disabled = true;
      this.button.classList.add('opacity-20');
    }
    else {
      // Loading spinner.
      const btnContent = this.loadingButton();
      this.setButton(btnContent, false);

      // Add to cart.
      const formData = {
        items: [
          {
            id: this.currentVariant.id,
            quantity: 1,
          },
        ],
      };

      window.eight.cartEngine.addToCart(
        formData,
        'items',
        this.atcSuccess,
        this.atcError
      );
    }
  }

  handleOptionChange(e) {
    // Do we have a selection in all options?
    if (!this.allOptionsChosen) return;

    const prevTitle = this.currentVariant.title;

    // Find a product variant based on the chosen options.
    this.currentVariant = window.eight.productEngine.findVariant(this.product, this.selectValIndexes);

    const content = this.getButton();
    this.setButton(content);

    if(!this.currentVariant) return;

    // Armada event emit.
    if(window.eight.eventsEngine && this.currentVariant.title !== prevTitle) {
      window.eight.eventsEngine.namedEvents.changeVariant(this.product.id, this.currentVariant.id, this.currentVariant);
    }
  }

  atcSuccess(data) {
    // Display 'added' for X seconds.
    const added = this.buttonHtml('added');
    this.setButton(added, false);

    // Go to the cart page if the "Add to cart" action is "page"
    if (this.cartTypePage) {
      window.location = this.cartPageUrl;
    }

    // Change button back to 'add'.
    const addBtn = this.getButton();
    setTimeout(() => {
      this.setButton(addBtn);
    }, window.eight.product.addedTimeout);
  }

  atcError(data) {
    console.warn('Quick add error', data);

    // Change button back to 'add'.
    const addBtn = this.getButton();
    setTimeout(() => {
      this.setButton(addBtn);
    }, window.eight.product.addedTimeout);
  }

  setButton(content, setEvent = true) {
    this.buttonWrap.innerHTML = content;
    this.button = this.querySelector('[data-name^="button-"]');
    if (!this.button) return;

    if (this.currentVariant.available && setEvent) {
      this.button.addEventListener('click', this.handleButtonClick);
    } else {
      this.button.classList.add('opacity-20');
    }
  }

  get sectionId() {
    return this.getAttribute('section-id') ? this.getAttribute('section-id') : '1';
  }

  get product() {
    return window.eight.safeJSONParse(this.getAttribute('product'));
  }

  get selectVals() {
    return this.selects ? Array.from(this.selects).map((s) => s.value) : false;
  }

  get selectValIndexes() {
    if(!this.selects) return false;

    let indexes = [];

    Array.from(this.selects).forEach(s => {
      // Disregard disabled option, that is the 'label inside select' feature.
      const selIndex = s.options[0].disabled === true ? s.selectedIndex-1 : s.selectedIndex;
      indexes.push(selIndex);
    });

    return indexes;
  }

  get allOptionsChosen() {
    return this.selectVals ? !this.selectVals.some((v) => v === '') : false;
  }
}

window.customElements.define('quick-add', QuickAdd);

})();

/******/ })()
;