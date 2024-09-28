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
Implementation:

1) Wrap your grid with:
{% if settings.enable_animations %}
<loadin-animation>
{% endif %}
--GRID--
{% if settings.enable_animations %}
</loadin-animation>
<safe-load-scripts>
  <script src="{{ 'engine-loadin-animation.min.js' | asset_url }}" defer="defer" type="module" data-armada-load-key="loadin-animation"></script>
</safe-load-scripts>
{% endif %}

If needed, you can set the threshold at which you want to trigger the animation by adding "data-loadin-animation-threshold" attr and set it to any key on this.thresholds. E.g.: <loadin-animation data-loadin-animation-threshold="0,10,25">

2) Add `loadin-animation-elm loadin-animation-delay` to the wrapper of the elm you're rendering in the forloop. E.g:
{% for block in blocks %}
  <li loadin-animation-elm loadin-animation-delay>
    {% render 'ship-visual-card' with ... %}

 */

class LoadinAnimation extends HTMLElement {
  constructor() {
    super();

    this.thresholds = {
      '0': 0,
      '10': 0.1,
      '15': 0.15,
      '25': 0.25,
      '50': 0.5,
      '100': 1
    }

    // get the value of data-loadin-animation-threshold. If it exists, remove whitespaces from string. If not, do nothing.
    this.dataThreshold = this.dataset.loadinAnimationThreshold ? this.dataset.loadinAnimationThreshold.replace(/\s+/g, '') : '';
    const defaultThreshold = this.thresholds['10'];

    // have we passed a threshold value? if so, call Fn to get an arr with valid items. If not, use default threshold.
    const thresholdValues = this.dataThreshold ? this.setThresholdValues(this.dataThreshold) : defaultThreshold;

    this.observerOptions = {
      root: null,
      threshold: thresholdValues
    };

    this.observer = new IntersectionObserver((entries, observer) =>
      this.observerCallback(entries, observer),
      this.observerOptions
    );
  }

  setThresholdValues(item) {
    if(!this.dataThreshold) return;

    // converts string data into arr
    const thresholdArr = this.dataThreshold.split(',');

    // evaluates array items against this.thresholds keys, removing invalid values
    let filteredThresholds = thresholdArr.filter( thresholdItem => this.thresholds.hasOwnProperty(thresholdItem) );

    // avoids empty array (created by passing invalid values through this.dataThreshold)
    filteredThresholds = filteredThresholds.length > 0 ? filteredThresholds : ['0'];

    // gets the value from obj' key-val pair
    const thresholdVal = filteredThresholds.map( item => this.thresholds[item] );

    return thresholdVal
  }

  connectedCallback() {
    // Observer
    this.observer.observe(this);
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  disconnectedCallback() {
    this.observer.unobserve(this);
  }

  static get observedAttributes() {
    return ['reload'];
  }

  attributeChangedCallback() {
    this.loadInAnimation();
  }

  init() {
    window.eight.armada.elementRegistry.register({key: 'loadin-animation', assetPath: '/assets/engine-loadin-animation.min.js'});
  }

  observerCallback(entry, observer) {
    if (entry[0].isIntersecting) {
      this.loadInAnimation();

      this.setAttribute('data-loadin-animated', `${entry[0].isIntersecting}`);
      this.observer.unobserve(this)

    }
  }

  loadInAnimation() {
    const animateElms = this.querySelectorAll('[loadin-animation-delay]');
    if (!animateElms) return;

    if (animateElms.length > 0) {
      animateElms.forEach((animateElm, elmIndex) => {
        const offsetTime = 400;
        let forloopIndex = animateElm.dataset.loadinAnimationIndex;
        let index = forloopIndex || elmIndex;

        if (index > 0) {
          let animDelay = offsetTime * index
          animateElm.style = `animation-delay: ${animDelay}ms;`
        }
      })
    }
  }
}

window.customElements.define('loadin-animation', LoadinAnimation);

})();

/******/ })()
;