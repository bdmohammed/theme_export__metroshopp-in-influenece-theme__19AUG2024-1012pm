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

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.initialBlocks = this.querySelector('[data-armada-selector="predictive-search-blocks"]');
    this.activeResults = this.querySelector('[data-armada-selector="predictive-search-results"]');
    this.loadingState = this.querySelector('[data-armada-selector="results-loading"]');
    this.clearSearch = this.querySelector('[data-armada-selector="clear-search"]');
    this.closeIconInitial = this.querySelector('.close-icon-blocks');
    this.input = this.querySelector('input[type="search"]');

    if (this.activeResults) this.loadingStateHtml = this.activeResults.innerHTML;

    const debounce = (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }

    this.debouncedOnSubmit = debounce((event) => {
      this.onChange(event);
    }, 300);

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.attachEvents.bind(this));
  }

  attachEvents() {
    if (!this.input) return;

    // Add listeners
    this.input.addEventListener('input', this.debouncedOnSubmit.bind(this));
    document.addEventListener('mouseup', this.closeSearch.bind(this));

    ['click', 'keypress'].forEach(evt => {
      if (this.closeIconInitial) this.closeIconInitial.addEventListener(evt, this.close.bind(this, this.initialBlocks));
      if (this.clearSearch) this.clearSearch.addEventListener(evt, this.handleSearchClear.bind(this));
    });

    if(window.Shopify.designMode) {
      document.addEventListener('shopify:section:select', this.sectionSelectHandler.bind(this));
      document.addEventListener('shopify:section:deselect', this.sectionDeselectHandler.bind(this));
    }
  }

  sectionSelectHandler(e) {
    if(!e.target.contains(this)) return;
    this.openSearch();
  }

  sectionDeselectHandler(e) {
    if(!e.target.contains(this)) return;
    this.closeSearch();
  }

  onChange() {
    // Define the url, query and section id
    const url = `${this.dataset.routesUrl}?q=${encodeURIComponent(this.input.value.trim())}&resources[type]=product,collection,query&resources[limit]=4&resources[limit_scope]=each`;
    const sectionId = 'section-predictive-search';

    // Get search suggestions and show/hide containers
    if (this.input.value != '' || this.input.value.length) {
      if (this.initialBlocks) this.hideResultContainer(this.initialBlocks);
      if (this.activeResults) this.showResultContainer(this.activeResults);
      this.fetchResults(url, sectionId);
    } else {
      if (this.initialBlocks) this.showResultContainer(this.initialBlocks);
      if (this.activeResults) this.hideResultContainer(this.activeResults);
      if (this.loadingState) this.showEl(this.loadingState);
      this.resetResults();
    }
  }

  fetchResults(url, sectionId) {
    window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(url, [sectionId], [this.querySelector('[data-armada-selector="predictive-search-results"]')], ['[data-armada-selector="predictive-search-results"]'], function(data) {
      // Return if no data is returned
      if (!data) return;

      // Hide loading icon
      this.hideEl(this.loadingState);

      if (!this.activeResults) return;

      ['click', 'keypress'].forEach(evt => {
        //Add event listener to the close icon
        const closeIcon = this.querySelector('.close-icon-results');

        if (!closeIcon) return;
        closeIcon.addEventListener(evt, this.close.bind(this, this.activeResults));
      });

      // If the result container is hidden, show it
      if (this.activeResults.classList.contains('h-0', 'opacity-0', 'overflow-hidden')) {
        this.showResultContainer(this.activeResults);
      }

    }.bind(this));
  }

  closeSearch(e) {
    const headerCTA = document.querySelector('[data-armada-selector="header-cta-container"]');
    const mobileSearchCTA = document.querySelector('.header-mobile-search');
    if (this.closest('search-bar').contains(e?.target) || headerCTA.contains(e?.target) || mobileSearchCTA.contains(e?.target)) return;
    this.closest('search-bar').classList.add('h-0', 'opacity-0', 'invisible');
    this.closest('search-bar').classList.remove('animate-menu-up-open');
  }

  openSearch() {
    const searchBar = document.querySelector('search-bar');
    const searchInput = document.querySelector('search-bar input[type="search"]');
    const searchResults = document.querySelector('[data-armada-selector="predictive-search-results"]');
    const searchBlocks = document.querySelector('[data-armada-selector="predictive-search-blocks"]');

    if (!searchBar || !searchInput) return;

    //Show the search bar if it is closed or hide if it is open
    searchBar.classList.remove('h-0');
    searchBar.classList.remove('opacity-0');
    searchBar.classList.remove('invisible');
    searchBar.classList.add('animate-menu-up-open');

    // If there are active search results, show them when search is open
    if (searchResults && searchInput.value.length) {
      searchResults.classList.remove('hidden');
      searchResults.classList.add('grid');
    }

    // If there are no active search results, show the initial search content
    if(searchBlocks && !searchInput.value.length) {
      searchBlocks.classList.remove('hidden');
    }
  }

  handleSearchClear() {
    // If the search results are cleared, show the custom blocks again if they were closed
    if (this.initialBlocks) { this.initialBlocks.classList.remove('hidden') }
    if (this.loadingState) this.showEl(this.loadingState);
    if (this.activeResults) this.hideResultContainer(this.activeResults);

    // Reset the content of the result containers to avoid showing anything that doesn't match the search terms
    this.resetResults();
  }

  populateResults(source, destination) {
    if (!source || !destination) return;
    destination.innerHTML = source.innerHTML;
  }

  resetResults() {
    if (this.activeResults) this.activeResults.innerHTML = this.loadingStateHtml;
  }

  close(el) {
    // Close the results container on "click" or "return key"
    if (!el || !this.input) return;
    el.classList.add('hidden');
    this.closest('search-bar').classList.add('h-0', 'opacity-0', 'invisible');
    this.closest('search-bar').classList.remove('animate-menu-up-open');
  }

  hideResultContainer(el) {
    if (el) { el.classList.add('hidden') }
  }

  showResultContainer(el) {
    if (el) {
      el.classList.remove('hidden');
      if(el == this.activeResults) el.classList.add('grid');
    }
  }

  hideEl(el) {
    el.classList.remove('flex');
    el.classList.add('hidden');
  }

  showEl(el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }
}

window.customElements.define('predictive-search', PredictiveSearch);

})();

/******/ })()
;