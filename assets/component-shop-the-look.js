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

class ShopTheLook extends HTMLElement {
  constructor() {
    super();

    this.mainImageOverlay = this.querySelector('[data-armada-image-overlay]');
    this.closeBtn = this.querySelector('[data-armada-close-btn]');
    this.markerBtns = this.querySelectorAll('[data-armada-marker]');
    this.desktopInfo = this.querySelector('[data-armada-desktop-layout]');
    this.mobileInfo = this.querySelector('[data-armada-mobile-layout]');
    this.stlCta = this.querySelector('[data-armada-stl-cta]');
    this.desktopAction = this.querySelector('[data-armada-stl-action] a');
    this.priceEl = this.querySelectorAll('[data-armada-item-price]');
    this.imgElements = this.querySelectorAll('[data-armada-product-img]');
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.setImageHeight();
    this.handleMarkerClick();
    window.eight.armada.elementRegistry.register({key: 'shop-the-look', assetPath: '/assets/component-shop-the-look.min.js'});
    window.addEventListener('resize', this.setImageHeight.bind(this));
    window.addEventListener('shopify:block:select', this.handleBlockSelect.bind(this));
    window.addEventListener('shopify:block:deselect', this.handleClose.bind(this));
  }

  setImageHeight() {
    //The product preview image should not be taller than the main image
    const mainImgHeight = this.mainImageOverlay.offsetHeight;

    this.imgElements.forEach(imgEl => {
      imgEl.style.height = `${mainImgHeight}px`;
      imgEl.style.maxHeight = `${mainImgHeight}px`;
    });
  }

  handleMarkerClick() {
    //Handle a click on the 'close' icon
    this.closeBtn.addEventListener('click', this.handleClose.bind(this));

    //Close the product info when clicking away from the element
    this.mobileInfo.addEventListener('click', this.handleClose.bind(this));

    //Clicking on the main image should close the product preview
    this.mainImageOverlay.addEventListener('click', this.handleClose.bind(this));

    this.markerBtns.forEach(marker => {
      marker.addEventListener('click', this.showProduct.bind(this, marker));
    });
  }

  showProduct(marker) {
    const productTitle = marker.getAttribute('data-armada-product-title');
    const productPrice = marker.getAttribute('data-armada-product-price');
    const productImgId = marker.getAttribute('data-armada-image-id');
    const productUrl = marker.getAttribute('data-armada-product-link');
    const clickedMarker = marker.getAttribute('data-armada-image-id');
    const inactiveMarkers = this.querySelectorAll(`[data-armada-marker]:not([data-armada-image-id="${clickedMarker}"])`);

    if (!productTitle || !productPrice) return;

    inactiveMarkers.forEach(inactiveMarker => {
      inactiveMarker.classList.remove('animate-radar');
      inactiveMarker.querySelector('span').classList.remove('scale-150');
    });

    if (clickedMarker == productImgId) {
      marker.classList.add('animate-radar');
      marker.querySelector('span').classList.add('scale-150');
    }

    //Set the link hrefs to the selected product's url
    this.stlCta.classList.remove('z-20');
    this.stlCta.classList.add('opacity-0', 'z-0');
    this.desktopAction.setAttribute('href', productUrl);
    this.mobileInfo.querySelector('a').setAttribute('href', productUrl);

    //Show the product info and CTA's on desktop
    this.desktopInfo.querySelector('h4').innerText = productTitle;
    this.desktopInfo.classList.remove('invisible', 'h-0');
    this.desktopInfo.classList.add('grid');
    this.desktopInfo.classList.add('z-20');

    //Show the product info and CTA's on mobile
    this.mobileInfo.querySelector('h4').innerText = productTitle;
    this.mobileInfo.classList.remove('invisible', 'h-0');
    this.mobileInfo.classList.add('md:invisible', 'md:h-0', 'z-20');
    this.mobileInfo.classList.add('flex');

    //Set the price for the selected product
    this.priceEl.forEach(price => {
      price.innerText = productPrice;
    });

    //Show the image linked to the clicked marker
    const getImg = this.querySelector(`[data-img-id="${productImgId}"]`);
    const inactiveImgs = this.querySelectorAll(`[data-armada-product-img]:not([data-img-id="${productImgId}"])`);

    getImg.classList.remove('opacity-0', 'z-0');
    getImg.classList.add('z-20', 'opacity-1');

    inactiveImgs.forEach(img => {
      img.classList.remove('z-20', 'opacity-1');
      img.classList.add('opacity-0', 'z-0');
    });
  }

  handleBlockSelect(e) {
    const getActiveMarker = this.querySelector(`[data-stl-block-id="${e.detail.blockId}"]`);
    if (!getActiveMarker) return;
    this.showProduct(getActiveMarker);
  }

  handleClose() {
    this.stlCta.classList.add('z-20');
    this.stlCta.classList.remove('opacity-0', 'z-0');
    this.desktopInfo.classList.add('invisible', 'h-0');
    this.mobileInfo.classList.remove('z-20');
    this.mobileInfo.classList.add('invisible', 'h-0');

    this.imgElements.forEach(imgEl => {
      imgEl.classList.remove('z-20');
      imgEl.classList.remove('opacity-1');
      imgEl.classList.add('opacity-0');
    });

    this.markerBtns.forEach(marker => {
      marker.classList.remove('animate-radar');
      marker.querySelector('span').classList.remove('scale-150');
    });

    this.closeBtn.removeEventListener('click', this.handleMarkerClick);
    this.mobileInfo.removeEventListener('click', this.handleMarkerClick);
  }
}

window.customElements.define('shop-the-look', ShopTheLook);

})();

/******/ })()
;