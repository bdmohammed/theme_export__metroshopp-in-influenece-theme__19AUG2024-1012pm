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


class FilterForm extends HTMLElement {
  constructor() {
    super();

    this.filterPosition = this.getAttribute('filter-position');
    this.searchParamsInitial = window.location.search.slice(1);
    this.searchParamsPrev = window.location.search.slice(1);
    this.sectionId = this.getAttribute('section-id');
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
    this.activeFacetCountContainer = document.querySelector('[data-armada-selector="active-facet-count"]');
    this.formUnderlay = document.querySelector('[data-armada-selector="filter_underlay"]');
    this.isSidebarForm = this.classList.contains('sidebar-form');
    this.isSearchPage() ? this.gridSelector = document.querySelector('[data-armada-selector="search-grid-main"]') : this.gridSelector = document.querySelector('[data-armada-selector="collection-grid-main"]');

    // We don't want to submit the form unless the user is done with the changes
    const debounce = (func, timeout = 500) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);
  }

  connectedCallback() {
    //Return if there is no grid or form
    if (!this.gridSelector || !this.querySelector('form')) return;

    const formEls = this.querySelectorAll('form details');

    formEls.forEach(formEl => {
      formEl.addEventListener('toggle', this.handleDetailToggle);
    });

    //Add listeners
    this.querySelector('form').addEventListener('change', this.debouncedOnSubmit.bind(this));
    this.setListeners();

    //Remove topbar container when removing sidebar in editor
    if (window.Shopify.designMode && this.filterPosition !== 'sidebar') {
      this.removeTopbarContainer();
    }
    if (this.filterPosition == 'sidebar' && this.isSidebarForm) this.addTopbarContainer();
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.registerElement);
  }

  registerElement() {
    window.eight.armada.elementRegistry.register({key: 'filter-and-sort', assetPath: '/assets/engine-filter-and-sort.min.js'});
  }

  setListeners() {
    //Handle forward/back button presses in the browser (collection page only)
    if (!this.isSearchPage()) {
      const onHistoryChange = (event) => {
        const searchParams = event.state ? event.state.searchParams : this.searchParamsInitial;
        if (searchParams === this.searchParamsPrev) return;
        this.renderPage(searchParams, null, false);
      }
      window.addEventListener('popstate', onHistoryChange);
    }

    this.handleApplyBtn(this.isMobile());
    window.addEventListener('resize', () => this.handleApplyBtn(this.isMobile()));
  }

  handleApplyBtn(isMobile) {
    this.topbarForm = document.querySelector('[data-armada-selector="filter-topbar-form"]');
    this.applyFilterBtn = this.topbarForm.querySelector('[data-armada-selector="apply-filters"]');
    this.currentModal = this.topbarForm.closest('armada-modal[data-modal-id="filter-modal-trigger"]');

    if (!this.applyFilterBtn || !isMobile) return;

    // Make button sticky on mobile
    const observerRoot = this.currentModal.querySelector('[data-armada-selector="modal-container"]');
    const btnWrapper = this.topbarForm.querySelector('[data-armada-selector="filter_button_wrapper"]');
    const btnContainer = this.topbarForm.querySelector('[data-armada-selector="filter_button_container"]');

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (!btnContainer) return;
          if (entry.isIntersecting) {
            btnContainer.classList.remove('!fixed');
            btnContainer.removeAttribute('style');
            this.applyFilterBtn.classList.add('mb-3');
          } else {
            const formWrapper = document.querySelector('[data-armada-selector="filter-topbar-form"]');
            const modalInner = formWrapper.closest('[data-armada-selector="modal-inner"]');
            const modalInnerRect = modalInner.getBoundingClientRect();
            const formRect = formWrapper.getBoundingClientRect();
            btnContainer.classList.add('!fixed');
            btnContainer.style.width = `${formRect.width}px`;
            btnContainer.style.maxWidth = `100%`;
            btnContainer.style.padding = `16px`;
            btnContainer.style.top = `${modalInnerRect.top - 1}px`;
            btnContainer.style.left = `${formRect.left}px`;
            btnContainer.style.zIndex = `300`;
            this.applyFilterBtn.classList.remove('mb-3');
          }
        });
    }

    const observerOptions = {
      root: observerRoot,
      rootMargin: '0px',
      threshold: 0
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    observer.observe(btnWrapper);

    this.applyFilterBtn.addEventListener('click', () => window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:MODAL:CLOSE:ALL"]}`));
  }

  addTopbarContainer() {
    // Remove any existing topbar container
    this.removeTopbarContainer();
    // Add a div containing the active filters/sort dropdown
    // above the filters & product grid to keep the position of the form & grid consistent
    const filterEl = document.querySelector('[data-armada-selector="section-collection-filters"]') || document.querySelector('[data-armada-selector="section-search-filters"]');
    const facetContent = document.querySelector('[data-armada-selector="collection-top-bar-facets"]') || document.querySelector('[data-armada-selector="search-top-bar-facets"]');
    const colorScheme = filterEl.getAttribute('data-color-scheme');

    if (!filterEl || !facetContent) return;

    // Create a div and add the active facets/sort dropdown inside of it
    const newNode = document.createElement('div');
    newNode.setAttribute('class', 'w-full');
    newNode.classList.add('lg:min-h-[24px]', 'lg:px-6', 'bg-page');
    newNode.setAttribute('data-armada-selector', 'sidebar_facets');
    newNode.setAttribute('data-color-scheme', colorScheme);
    newNode.innerHTML = facetContent.outerHTML;
    newNode.firstChild.classList.add('lg:grid');

    const filterSectionId = filterEl.dataset.sectionId;
    const sectionSelector = document.querySelector(`#shopify-section-${filterSectionId}`);
    const sectionWrapper = sectionSelector.parentElement;

    // Insert the div above the filter & collection grid sections
    sectionWrapper.insertBefore(newNode, sectionSelector);
  }

  removeTopbarContainer() {
    const topbarContainer = document.querySelector('[data-armada-selector="sidebar_facets"]');
    if (topbarContainer) {
      topbarContainer.remove();
    }
  }

  handleDetailToggle() {
    if (this.open) {
      const getOpenEls = this.closest('form').querySelectorAll(`details[open]`);
      getOpenEls.forEach(el => {
        if (el !== this) {
          el.open = false;
        }
      })
    }
  }

  onSubmitHandler(event) {
    event.preventDefault();

    this.productCardWrapper = this.gridSelector.querySelector('[data-armada-selector="collection-card-grid"]');
    this.activeFacetContainer = this.querySelector('[data-armada-selector="active_facet_container"]');
    this.loadingState = this.querySelector('[data-armada-selector="facets-loading"]');
    if (this.productCardWrapper) this.productCardWrapper.classList.add('animate-pulse');
    if (this.activeFacetContainer) this.activeFacetContainer.classList.add('animate-pulse');
    if (this.loadingState && !this.activeFacetContainer) this.loadingState.classList.remove('hidden');

    //Get the form data when filters are changed
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();

    //Render the section from data
    if (this.isSearchPage()) {
      this.renderPage(searchParams, event, false);
    } else {
      this.renderPage(searchParams, event);
    }
  }

  renderPage(searchParams, event, updateURL = true) {
    //Set paramaters to current
    this.searchParamsPrev = searchParams;
    const sections = this.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;

      //Fetch the relevant sections
      this.renderSectionFromFetch(url, event);
    });

    //Update url
    if (updateURL) {
      this.updateURL(searchParams);
    }
  }

  renderSectionFromFetch(url) {
    let sectionsToFetch, els, selectors;

    if (this.isSearchPage()) {
      const searchGridId = document.querySelector('[data-armada-selector="search-grid-main"]').dataset.sectionId;
      const collectionFilterId = document.querySelector('[data-armada-selector="section-search-filters"]').dataset.sectionId;
      if (!searchGridId) return;

      sectionsToFetch = [collectionFilterId, searchGridId];
      els = [document.querySelector('[data-armada-selector="search-grid-main"]')];
      selectors = ['[data-armada-selector="search-grid-main"]'];

    } else {
      const collectionGridId = document.querySelector('[data-armada-selector="collection-grid-main"]').dataset.sectionId;
      const collectionFilterId = document.querySelector('[data-armada-selector="section-collection-filters"]').dataset.sectionId;
      if (!collectionGridId) return;

      sectionsToFetch = [collectionFilterId, collectionGridId];
      els = [document.querySelector('[data-armada-selector="collection-grid-main"]')];
      selectors = ['[data-armada-selector="collection-grid-main"]'];
    }

    //Fetch section
    window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(url, sectionsToFetch, els, selectors, (data) => {
      if (!data) return;

      //We don't want the filter/sort dropdowns to reload when filtering/sorting
      //so we manually have to pick out the bits we want to replace when filtering/sorting
      const formEls = document.querySelectorAll('[data-armada-selector="filter-main-form"]');
      const topbarCount = document.querySelector('[data-armada-selector="active-facet-count"]');
      const activeFacetSelector = '[data-armada-selector="filter-main-form"] .active-facets';
      const filterCountSelector = '[data-armada-selected-filters-count]';
      const inputSelector = '[data-armada-selector="filter_input_list"]';

      // Use regular expressions to find the data attributes containing the elements we need
      const Countregex = new RegExp(/data-armada-facet-count="([^"]*?)"/g);
      const returnedCount = data[0].match(Countregex);

      const detailsRegex = new RegExp(/data-armada-filter-form="([^"]*?)"/g);
      const returnedEls = data[0].match(detailsRegex);

      // Update the active facet count (topbar/mobile)
      if (returnedCount) {
        const removeCountPrefix = returnedCount[0].replace(/data-armada-facet-count=\"/g, "");
        const activeCount = removeCountPrefix.replace(/\"/g, "");

        if (topbarCount) {
          topbarCount.textContent = activeCount;
        }
      }

      if (returnedEls) {
        let filterFormArray = [];

        // Create an array from all regex matches
        returnedEls.map(function(val){
          const removeDetailsPrefix = val.replace(/data-armada-filter-form=\"/g, "");
          const detailsResult = removeDetailsPrefix.replace(/\"/g, "");
          filterFormArray.push(detailsResult);
       });

        // Update the form inputs to grey out unavailable filters
        // Update the selected filter counts
        if (formEls.length) {
          formEls.forEach((formEl, index) => {
            const divContainer = document.createElement('div');
            divContainer.innerHTML = filterFormArray[index];

            // Create a div with the contents of the array elements
            const containerHTML = document.createElement('div');
            containerHTML.innerHTML = divContainer.textContent;

            // Get the active facets
            const facetEl = containerHTML.querySelector(`${activeFacetSelector}`);
            let facetContainer = formEl.querySelector(`${activeFacetSelector}`);
            let facetContainerSidebar = document.querySelector('[data-armada-selector="sidebar_facets"] .active-facets');

            // Display the active facets
            if (facetEl && facetContainer) {
              facetContainer.innerHTML = facetEl.innerHTML;
            }

            if (facetContainerSidebar && facetEl) {
              facetContainerSidebar.innerHTML = facetEl.innerHTML;
            }

            // Get counts for selected filters
            const getCounts = containerHTML.querySelectorAll(`${filterCountSelector}`);
            const countContainers = formEl.querySelectorAll(`${filterCountSelector}`);

            // Update selected filter counts
            countContainers.forEach((containerEl, idx) => {
              containerEl.textContent = getCounts[idx].textContent;
            });

            // Get all filter option inputs
            const inputLists = containerHTML.querySelectorAll(`${inputSelector}`);
            const inputContainers = formEl.querySelectorAll(`${inputSelector}`);

            // Update the list of available filter values for each filter
            inputContainers.forEach((container, index) => {
              container.innerHTML = inputLists[index].innerHTML;
            });
          });
        }
      }

      this.productCardWrapper = this.gridSelector.querySelector('[data-armada-selector="collection-card-grid"]');
      this.activeFacetContainer = this.querySelector('[data-armada-selector="active_facet_container"]');
      this.loadingState = this.querySelector('[data-armada-selector="facets-loading"]');
      if (this.productCardWrapper) this.productCardWrapper.classList.remove('animate-pulse');
      if (this.activeFacetContainer) this.activeFacetContainer.classList.remove('animate-pulse');
      if (this.loadingState && !this.loadingState.classList.contains('hidden')) this.loadingState.classList.add('hidden');
    });
  }

  updateURL(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  onActiveFilterClick(event) {
    //Remove string from url when clicking on active filter facet,
    //remove all active filters when clicking "clear all"
    event.preventDefault();
    const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
    this.productCardWrapper = this.gridSelector.querySelector('[data-armada-selector="collection-card-grid"]');
    this.activeFacetContainer = this.querySelector('[data-armada-selector="active_facet_container"]');
    this.loadingState = this.querySelector('[data-armada-selector="facets-loading"]');
    if (this.productCardWrapper) this.productCardWrapper.classList.add('animate-pulse');
    if (this.activeFacetContainer) this.activeFacetContainer.classList.add('animate-pulse');
    if (this.loadingState && !this.activeFacetContainer) this.loadingState.classList.remove('hidden');
    
    this.renderPage(url);
  }

  getSections() {
    return [
      {
        section: document.querySelector('collection-grid').dataset.sectionId,
      }
    ]
  }

  isMobile() {
    return window.matchMedia('only screen and (max-width: 1023px)').matches;
  }

  isSearchPage() {
    return this.dataset.searchPage == 'true' ? true : false
  }
}
class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.filterForm = this.closest('facet-filter-form') || document.querySelector('facet-filter-form');
    this.clearAllBtn = this.querySelector('[data-armada-selector="filters_clear_all"]');
    this.formUnderlay = document.querySelector('[data-armada-selector="filter_underlay"]');
    this.isPriceFilter = this.dataset.priceFilterActive ? true : false;
    this.priceFilterMax = this.filterForm.querySelector('[data-armada-selector="filter_price_to"]');
    this.priceFilterMin = this.filterForm.querySelector('[data-armada-selector="filter_price_from"]');

    if (this.filterForm) this.filterPosition = this.filterForm.getAttribute('filter-position');
  }

  connectedCallback() {
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      if (this.isPriceFilter) {
        this.clearPriceFilterInputs();
      }
      const form = event.target.closest('facet-filter-form') || document.querySelector('facet-filter-form');
      form.onActiveFilterClick(event);
    });

    if (this.clearAllBtn) {
      this.clearAllBtn.addEventListener('click', () => {
        window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:MODAL:CLOSE:ALL"]}`);
        this.clearPriceFilterInputs();
      });
    }
  }

  clearPriceFilterInputs() {
    if (this.priceFilterMin || this.priceFilterMax) {
      this.priceFilterMax.value = '';
      this.priceFilterMin.value = '';
    }
  }

  isMobile() {
    return window.matchMedia('only screen and (max-width: 1023px)').matches;
  }
}

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const minInput = this.querySelector('[data-armada-selector="filter_price_from"]');
    const maxInput = this.querySelector('[data-armada-selector="filter_price_to"]');
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

class SortForm extends HTMLElement {
  constructor() {
    super();
    
    this.hiddenSortInputs = document.querySelectorAll('facet-filter-form [data-armada-selector="sort_by_value"]');
    this.sortByForm = this.querySelector('[data-armada-selector="sort_by_form"]');
    this.filterForms = document.querySelectorAll('facet-filter-form form');
  }

  connectedCallback() {
    this.init();
  }

  init() {
    if (this.hiddenSortInputs.length) {
      const evt = new Event('change');
  
      this.sortByForm.addEventListener('change', () => {
        //Change the value of the hidden 'sort' input on the filtering form
        //to the value of the selected option
        this.hiddenSortInputs.forEach(input => {
          input.value = this.sortByForm.querySelector('input:checked').value;
        });

        //Trigger the change event on the filtering form
        if (this.filterForms.length) {
          this.filterForms.forEach(form => form.dispatchEvent(evt));
        }
      });
    }
  }

}

customElements.define('price-range', PriceRange);
customElements.define('facet-remove', FacetRemove);
customElements.define('facet-filter-form', FilterForm);
customElements.define('sort-form', SortForm);

})();

/******/ })()
;