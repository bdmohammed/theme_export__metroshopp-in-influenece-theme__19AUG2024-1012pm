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


class productBadges extends HTMLElement {
  constructor() {
    super();

    this.onsale = this.dataset.onsale === 'true'
    this.available = this.dataset.available === 'true'
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    // key value pairs
    this.customBadges = window.eight.safeJSONParse(this.dataset.customBadges);

    // error check badges
    const fixedBadges = {}

    if(this.onsale) {
      fixedBadges['badge_sale'] = this.onsale
    }

    if(!this.available) {
      fixedBadges['badge_sold_out'] = !this.available
    }

    // all badges that are relevant.
    this.allBadges = Object.assign({}, fixedBadges, {...this.customBadges})
    this.badges = []

    // limits the number of badges displayed
    this.limit = window.eight.badgeEngine ? window.eight.badgeEngine.limit : 1
    const order = window.eight.badgeEngine.order.map(badge => badge.type === 'badge_custom' ? badge.text : badge.type)

    // loop over the badges and return static and dynamic values into an array
    // referenced in this.badges
    order.forEach(key => {
      if(Object.keys(this.allBadges).includes(key)) {
        let badgeObject = window.eight.badgeEngine.order.find(raw => raw.text === key || raw.type === key)

        if(badgeObject) {
          // handle metafield value
          if(badgeObject.type === 'badge_custom') {
            badgeObject = Object.assign({}, badgeObject, { text: this.customBadges[badgeObject.text] })
          }
          // set the badge value with dynamic text before referencing it.
          return this.badges.push(badgeObject)
        }
      }
    })

    this.renderBadges();
  }

  renderBadges() {
    if (this.hasBadges) return;
    // this will loop over this.badges and create a list of badges based on the limit setting.
    this.badges.forEach((badge, index) => {
      // check the index against the limit value
      if((index + 1) <= this.limit) {
        // render a product-badge
        // possibly move to a liquid pass in down the line and use a template literal.
        const badgeElement = this.appendChild(document.createElement('product-badge'))
        badgeElement.setAttribute('class', 'bg-page text-body block px-3 py-2 leading-none w-max')
        badgeElement.dataset.colorScheme = badge.colors
        const span = badgeElement.appendChild(document.createElement('span'))
        span.setAttribute('class', 'text-xs text-headings font-heading heading-case')
        span.innerHTML = badge.text
        this.setAttribute('has-badges', true);
      }
    })
  }

  get hasBadges() {
    // Denotes whether badges have been appended to the badge container
    return this.getAttribute('has-badges') === 'true';
  }
}

class productBadge extends HTMLElement {
  constructor() {
    super();

    this.productData = window.eight.safeJSONParse(this.getAttribute('product'));
    // product.available, product.compare_at_price
  }
}

class badgePreview extends HTMLElement {
  constructor() {
    super();

    if (!window.Shopify.designMode) return;
  }

  connectedCallback() {
    document.addEventListener('shopify:block:select', this.handleBlockSelect.bind(this));
    document.addEventListener('shopify:block:deselect', this.handleBlockDeselect);
  }

  handleBlockSelect(e) {
    const selectedBlock = e.detail.blockId;
    const getMatchingBlock = this.querySelector(`[data-block-id="${selectedBlock}"]`);
    if (getMatchingBlock) getMatchingBlock.classList.remove('hidden');
  }

  handleBlockDeselect(e) {
    const selectedBlock = e.detail.blockId;
    const getMatchingBlock = this.querySelector(`[data-block-id="${selectedBlock}"]`);
    if (getMatchingBlock) getMatchingBlock.classList.add('hidden');
  }
}

customElements.define('product-badge', productBadge,  { extends: 'li' });
customElements.define('product-badges', productBadges);
customElements.define('badge-preview', badgePreview);

})();

/******/ })()
;