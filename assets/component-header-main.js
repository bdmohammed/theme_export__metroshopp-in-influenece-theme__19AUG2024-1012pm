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


class HeaderMain extends HTMLElement {
  constructor() {
    super();
    this.navigationToggle = this.querySelector('[data-armada-selector="navigation-toggle"]');
    this.navigation = this.querySelector('[data-armada-selector="main-navigation"]');
    this.mobileMenuOpenIcon = this.querySelector('[data-armada-selector="mobile-menu-open-icon"]');
    this.mobileMenuCloseIcon = this.querySelector('[data-armada-selector="mobile-menu-close-icon"]');
    this.localeSelectors = this.querySelector('[data-armada-selector="header-locale-selectors"]');
    this.searchToggles = this.querySelectorAll('[data-armada-selector="search_toggle"]');

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    ['click', 'focusin', 'mouseleave'].forEach(event => {
      this.addEventListener(event, (e) => this.handleNavDropdown(e));
    });

    this.navigationToggle.addEventListener('click', this.toggleMobileNavigation.bind(this));
    document.addEventListener('ARMADA:NAVIGATION:MOBILE:OPEN', this.openMobileNavigation.bind(this));
    document.addEventListener('ARMADA:NAVIGATION:MOBILE:CLOSE', this.closeMobileNavigation.bind(this));

    this.buildLocaleSelectors();

    this.searchToggles.forEach(toggle => {
      ['click', 'keypress'].forEach(ev => {
        toggle.addEventListener(ev, this.handleSearchToggle.bind(this));
      });
    });

    document.addEventListener("ARMADA:SEARCH:TOGGLE", this.triggerSearchToggle.bind(this));
  }

  triggerSearchToggle() {
    // Toggle search on custom search toggle event
    this.searchToggles[0].click();
  }

  handleSearchToggle(e) {
    if (e.type === 'click' || e.keyCode === 13 ) {
      const searchBar = document.querySelector('search-bar');
      const searchInput = document.querySelector('search-bar input[type="search"]');
      const searchResults = document.querySelector('[data-armada-selector="predictive-search-results"]');
      const searchBlocks = document.querySelector('[data-armada-selector="predictive-search-blocks"]');

      if (!searchBar || !searchInput) return;

      //Show the search bar if it is closed or hide if it is open
      searchBar.classList.toggle('h-0');
      searchBar.classList.toggle('opacity-0');
      searchBar.classList.toggle('invisible');
      searchBar.classList.toggle('animate-menu-up-open');

      //Focus on the input when the search bar is shown
      searchBar.classList.contains('h-0', 'opacity-0', 'invisible') ? e.currentTarget.focus() : searchInput.focus();

      //If there are active search results, show them when search is open
      if (searchResults && searchInput.value.length) {
         searchResults.classList.remove('hidden');
         searchResults.classList.add('grid');
      }

      //If there are no active search results, show the initial search content
      if (searchBlocks && !searchInput.value.length) {
        searchBlocks.classList.remove('hidden');
     }
    }
  }

  handleNavDropdown(e) {
    if (e.target.closest('[data-armada-selector="navigation-item-details"]')) return;
    window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NAVIGATION:DROPDOWN:CLOSE"]}`);
  }

  toggleMobileNavigation() {
    const isOpen = this.navigationToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NAVIGATION:MOBILE:CLOSE"]}`);
      this.navigationToggle.setAttribute('aria-expanded', 'false');
      this.navigationToggle.setAttribute('aria-label', 'Open navigation');
    } else {
      window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NAVIGATION:MOBILE:OPEN"]}`);
      this.navigationToggle.setAttribute('aria-expanded', 'true');
      this.navigationToggle.setAttribute('aria-label', 'Close navigation');
    }
  }

  openMobileNavigation() {
    this.navigation.classList.remove('opacity-0', 'invisible');
    this.navigation.classList.add('animate-menu-right-open');
    this.mobileMenuOpenIcon.classList.add('hidden');
    this.mobileMenuCloseIcon.classList.remove('hidden');
    document.documentElement.style.setProperty('--header-bottom-position', `${this.getBoundingClientRect().bottom}px`);
  }

  closeMobileNavigation() {
    this.navigation.classList.add('opacity-0', 'invisible');
    this.navigation.classList.remove('animate-menu-right-open');
    this.mobileMenuCloseIcon.classList.add('hidden');
    this.mobileMenuOpenIcon.classList.remove('hidden');
  }

  buildLocaleSelectors() {
    // Add locale selectors to mobile menu
    const localeSelectorsClone = this.localeSelectors.cloneNode(true);
    localeSelectorsClone.classList.remove('hidden');
    localeSelectorsClone.classList.add('flex', 'lg:hidden');
    const navAnimationCount = this.navigation.querySelectorAll('.animate-menu-right').length;
    if (navAnimationCount < 10) {
      localeSelectorsClone.classList.add('animate-menu-right', `animate-menu-right-delay-${navAnimationCount + 1}`);
    }
    this.navigation.appendChild(localeSelectorsClone);
  }
}

customElements.define('header-main', HeaderMain);

})();

/******/ })()
;