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


class NavigationItem extends HTMLElement {
  constructor() {
    super();
    this.detailsElement = this.querySelector('[data-armada-selector="navigation-item-details"]');
    this.summaryElement = this.querySelector('[data-armada-selector="navigation-item-summary"]');
    this.navItems = this.querySelectorAll('[data-armada-selector="navigation-item-link"]');
    this.dropdown = this.querySelector('[data-armada-selector="navigation-item-dropdown"]');
    this.visualNav = this.querySelector('[data-armada-selector="navigation-item-visual"]');
    this.forceOpenDropdown = false;
    this.templateContent = this.querySelector('template').content;
    this.templateDrawer = this.templateContent.querySelector('[data-armada-selector="navigation-item-drawer"]');

    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

    this.currX = 0;
    this.currY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.interval = 100;
    this.sensitivity = 5; // Distance must be below this to trigger hoverintent.

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    this.attachEvents();
    this.setDropdownHeight();
    this.buildDrawer();
    this.setAriaAttributes();
  }

  attachEvents() {
    window.addEventListener('resize', this.setAriaAttributes.bind(this));

    document.addEventListener('ARMADA:NAVIGATION:DROPDOWN:CLOSE', this.closeNavDropdown.bind(this));
    document.addEventListener('ARMADA:NAVIGATION:MOBILE:CLOSE', this.closeAllDrawers.bind(this));

    this.summaryElement.addEventListener('mouseenter', this.mouseEnterHandler.bind(this));
    this.summaryElement.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this));
    this.summaryElement.addEventListener('focus', this.mouseEnterHandler.bind(this));

    this.addEventListener('mousemove', this.mouseMoveHandler);

    if(window.Shopify.designMode) {
      document.addEventListener('shopify:block:select', this.blockSelectHandler.bind(this));
      document.addEventListener('shopify:block:deselect', this.blockDeselectHandler.bind(this));
    }
  }

  openDropdown() {
    window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NAVIGATION:DROPDOWN:CLOSE"]}`);
    this.openNavDropdown();
  }

  mouseEnterHandler(ev) {
    // Set initial entry position
    this.prevX = ev.pageX;
    this.prevY = ev.pageY;

    if(this.detailsElement.hasAttribute('open')) return;

    // while mouse is over this element, check distance every 100ms
    this.pollTimer = setTimeout(() => {
      this.mouseCompare();
    }, this.interval);
  }

  mouseCompare() {
    const distX = this.prevX - this.currX;
    const distY = this.prevY - this.currY;
		const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < this.sensitivity) {
      this.openDropdown();
    } else {
      // Start the next loop to compare again in X seconds.
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.pollTimer = setTimeout(() => {
        this.mouseCompare();
      }, this.interval);
    }
  }

  mouseMoveHandler(ev) {
    this.currX = ev.pageX;
		this.currY = ev.pageY;

    if(this.detailsElement.hasAttribute('open')) return;
  }

  mouseLeaveHandler(ev) {
    clearTimeout(this.pollTimer);
  }

  openNavDropdown() {
    if(this.detailsElement.hasAttribute('open')) return;
    if(window.Shopify.designMode) this.themeEditorHideBlocks();
    this.detailsElement.open = true;
    this.summaryElement.classList.remove('lg:after:scale-x-0');
  }

  closeNavDropdown() {
    if(this.forceOpenDropdown) return;
    if(window.Shopify.designMode) this.themeEditorShowBlocks();
    this.detailsElement.open = false;
    this.summaryElement.classList.add('lg:after:scale-x-0');
    this.resetAnimation(this.dropdown); // Required for consistent animation on details/summary elements
  }

  setDropdownHeight() {
    const headerElement = this.closest('header');
    if(!headerElement) return;
    document.documentElement.style.setProperty('--header-bottom-position', `${headerElement.getBoundingClientRect().bottom}px`);
  }

  themeEditorHideBlocks() {
    // Temporarily close any forced-open dropdowns in theme editor.
    const forcedOpen = document.querySelectorAll('[data-editor-open="true"]');

    forcedOpen.forEach((item) => {
      // Don't close if we're trying to open THIS.
      if(item === this) return;
      item.detailsElement.open = false;
    });
  }

  themeEditorShowBlocks() {
    // Re-open any forced-open dropdowns in theme editor.
    const forcedOpen = document.querySelectorAll('[data-editor-open="true"]');

    forcedOpen.forEach((item) => {
      item.detailsElement.open = true;
    });
  }

  buildDrawer() {
    // Create a new drawer
    const drawer = this.templateDrawer.cloneNode(true);

    // If visual nav
    if(this.visualNav) {
      // Create a copy
      const visualNavClone = this.visualNav.cloneNode(true);
      // Append to drawer
      drawer.appendChild(visualNavClone);
    } else {
      // For each nav link
      this.navItems.forEach(navItem => {
        // Create a copy
        const navItemClone = navItem.cloneNode(true);
        // Build nested drawer for child link list
        this.buildNestedDrawer(navItemClone);
        // Append to drawer
        drawer.appendChild(navItemClone);
      });
    }

    // Set drawer id and close button text
    this.setDrawerId(drawer, this.summaryElement);

    // Attach open/close event listeners
    this.attachDrawerEvents(drawer, this.summaryElement);

    // Append drawer to nav item
    this.appendChild(drawer);
  }

  buildNestedDrawer(navItem) {
    if(navItem.dataset.hasChildLinks !== 'true') return;

    // Create a new drawer
    const drawer = this.templateDrawer.cloneNode(true);

    // Get list of child links
    const childLinkList = navItem.querySelector('[data-armada-selector="navigation-item-children"]');

    // Build nested drawer for each grandchild link list
    const childLinks = navItem.querySelectorAll('[data-armada-selector="navigation-item-child-link"]');
    childLinks.forEach(childLink => {
      this.buildNestedDrawer(childLink);
    });

    // Set drawer id and close button text
    const openBtn = navItem.querySelector('[data-armada-selector="navigation-item-parent"]');
    this.setDrawerId(drawer, openBtn);

    // Attach open/close event listeners
    this.attachDrawerEvents(drawer, openBtn);

    // Append list of child links to drawer
    drawer.appendChild(childLinkList);

    // Append drawer to nav item
    navItem.appendChild(drawer);
  }

  setDrawerId(drawer, openBtn) {
    const navigationName = openBtn.dataset.name;
    const closeBtn = drawer.querySelector('[data-armada-selector="navigation-item-close"]');
    closeBtn.textContent = navigationName;
    drawer.setAttribute('id', `navigation-item-drawer--${navigationName}`);
  }

  attachDrawerEvents(drawer, openBtn) {
    openBtn.addEventListener('click', (e) => {
      if(!this.isMobile()) return;
      e.preventDefault();
      drawer.classList.remove('translate-x-full', 'invisible');
      openBtn.setAttribute('aria-expanded', 'true');
    });

    const closeBtn = drawer.querySelector('[data-armada-selector="navigation-item-close"]');
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('translate-x-full', 'invisible');
      openBtn.setAttribute('aria-expanded', 'false');
    });
  }

  setAriaAttributes() {
    const openBtns = this.querySelectorAll('[data-armada-selector="navigation-item-summary"], [data-armada-selector="navigation-item-parent"]');
    openBtns.forEach(openBtn => {
      const navigationName = openBtn.dataset.name;
      const ariaAttributes = {
        'role': 'button',
        'aria-expanded': 'false',
        'aria-controls': `navigation-item-drawer--${navigationName}`
      }
      if(this.isMobile()) {
        for (let attribute in ariaAttributes) {
          openBtn.setAttribute(attribute, ariaAttributes[attribute]);
        }
      } else {
        for (let attribute in ariaAttributes) {
          openBtn.removeAttribute(attribute);
        }
      }
    });
  }

  closeAllDrawers() {
    const drawers = this.querySelectorAll('[data-armada-selector="navigation-item-drawer"]');
    drawers.forEach(drawer => {
      drawer.classList.add('translate-x-full', 'invisible');
    });

    const openBtns = this.querySelectorAll('[data-armada-selector="navigation-item-summary"], [data-armada-selector="navigation-item-parent"]');
    openBtns.forEach(openBtn => {
      openBtn.setAttribute('aria-expanded', 'false');
    });
  }

  resetAnimation(element) {
    if(!element) return;
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = null;
    const childEl = element.firstElementChild;
    const clonedEl = childEl.cloneNode(true);
    childEl.parentNode.replaceChild(clonedEl, childEl);
  }

  blockSelectHandler(e) {
    if(e.target == this) {
      this.forceOpenDropdown = true;
      this.setAttribute('data-editor-open', true);
      this.openNavDropdown();
    }
  }

  blockDeselectHandler(e) {
    if(e.target == this) {
      this.forceOpenDropdown = false;
      this.setAttribute('data-editor-open', false);
      this.closeNavDropdown();
    }
  }

  isMobile() {
    return window.matchMedia('only screen and (max-width: 1023px)').matches;
  }
}

customElements.define('navigation-item', NavigationItem);

})();

/******/ })()
;