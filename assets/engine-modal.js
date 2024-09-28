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

/***/ }),

/***/ 808:
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={};return(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.removeTrapFocus=t.trapFocus=void 0;const o={};t.trapFocus=(e,t=e)=>{const n=Array.from(e.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe")),r=n[0];let a=n[n.length-1];const d=e.querySelector("details:last-of-type summary");d&&(a=d,e.addEventListener("keypress",(e=>{"ENTER"===e.code.toUpperCase()&&(e.target==d?d.toggleAttribute("data-expanded"):d.removeAttribute("data-expanded"),a=void 0!==d.dataset.expanded?n[n.length-1]:d)}))),o.focusin=t=>{t.target!==e&&t.target!==a&&t.target!==r&&"radio"!==t.target.type||document.addEventListener("keydown",o.keydown)},o.focusout=function(){document.removeEventListener("keydown",o.keydown)},o.keydown=function(t){"TAB"===t.code.toUpperCase()&&((t.target===a&&!t.shiftKey||"radio"===t.target.type&&!t.shiftKey)&&(t.preventDefault(),r.focus()),t.target!==e&&t.target!==r||!t.shiftKey||(t.preventDefault(),a.focus()))},document.addEventListener("focusout",o.focusout),document.addEventListener("focusin",o.focusin),t.focus()},t.removeTrapFocus=(e=null)=>{document.removeEventListener("focusin",o.focusin),document.removeEventListener("focusout",o.focusout),document.removeEventListener("keydown",o.keydown),e&&e.focus()}})(),e})()}));

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
/* harmony import */ var _weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(808);
/* harmony import */ var _weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(845);
/* harmony import */ var _weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__);



class ArmadaModal extends HTMLElement {
  constructor() {
    super();
    this.modalId = this.dataset.modalId;
    this.modalUrl = this.dataset.modalUrl;
    this.modalSection = this.dataset.modalSection;
    this.modalUnderlayClasses = this.dataset.modalUnderlayClasses;
    this.modalHeading = this.dataset.modalHeading;
    this.defaultClasses = ['invisible', 'opacity-0'];
    this.transitionClasses = ['opacity-0', 'translate-y-[30px]'];
    this.themeEditorOnly = this.dataset.themeEditorOnly;
    this.limitWidthToContent = this.dataset.contentWidth;
    this.customHeaderClasses = this.dataset.headerClasses;
    this.customBtnClasses = this.dataset.buttonClasses;

    this.limitWidthToContent === 'true' ? this.elementWidth = 'max-w-max' : this.elementWidth = 'max-w-[980px]';
    this.customHeaderClasses ? this.customHeaderClasses : '';
    this.customBtnClasses ? this.customBtnClasses : '';

    this.modalHtml = `
      <div data-armada-selector="modal-container" class="fixed top-0 bottom-0 left-0 right-0 z-[300] p-4 md:p-6 flex">
        <div data-armada-modal-close data-armada-selector-alt="modal-underlay" class="fixed top-0 bottom-0 left-0 right-0 -z-[1]"></div>
        <div data-armada-selector="modal-inner" class="w-full ${this.elementWidth} max-h-[80%] lg:max-h-full m-auto overflow-x-auto bg-page relative transition-all duration-500">
          <div data-armada-selector="modal-header" class="flex items-center relative ${this.customHeaderClasses}"></div>
          <div data-armada-selector="modal-content-wrapper"></div>
        </div>
      </div>
    `;
    this.closeButtonHtml = `
      <button data-armada-modal-close data-armada-selector-alt="modal-close-button" type="button" aria-label="Close modal" class="w-44 h-44 absolute top-0 right-0 flex justify-center items-center text-body z-[1] group ${this.customBtnClasses}">
        <svg data-aid="icon-cancel" width="16" height="16" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="no-touch-hover:group-hover:[transform:scale(1.125)] transition-transform duration-200">
          <path class="fill-current" fill-rule="evenodd" clip-rule="evenodd" d="M0.0732422 5.3765C-0.0244141 5.47416 -0.0244141 5.63242 0.0732422 5.73008C0.170898 5.82771 0.329224 5.82771 0.426758 5.73008L2.90173 3.25517L5.37659 5.73008C5.43066 5.78413 5.5033 5.80827 5.57397 5.8025C5.63098 5.79783 5.68665 5.77369 5.73022 5.73008C5.82788 5.63245 5.82788 5.47416 5.73022 5.37653L3.25525 2.90159L5.7301 0.426765C5.82776 0.32914 5.82776 0.170845 5.7301 0.0732193C5.63245 -0.0244064 5.47424 -0.0244064 5.37659 0.0732193L2.90173 2.54807L0.42688 0.0732498C0.329224 -0.0244064 0.171021 -0.0244064 0.0733643 0.0732498C-0.024292 0.170876 -0.024292 0.32917 0.0733643 0.426796L2.54822 2.90162L0.0732422 5.3765Z"></path>
        </svg>
      </button>
    `;
    this.headingHtml = `
      <h2 data-armada-selector="modal-heading" class="text-h4 font-heading heading-case text-body"></h2>
    `;
  }

  connectedCallback() {
    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_1__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    document.addEventListener("ARMADA:MODAL:OPEN", (e) => this.handleOpen(e.detail));
    document.addEventListener("ARMADA:MODAL:CLOSE:ALL", this.closeModal.bind(this));

    if (this.themeEditorOnly && window.Shopify.designMode) {
      document.addEventListener("shopify:block:select", (e) => this.blockSelectHandler(e));
      document.addEventListener("shopify:block:deselect", (e) => this.editorCloseHandler(e, e.detail.blockId, true));
      document.addEventListener("shopify:section:select", (e) => this.sectionSelectHandler(e));
      document.addEventListener("shopify:section:deselect", (e) => this.editorCloseHandler(e, e.detail.sectionId, false));
    }
    
    this.buildModal();
    window.eight.armada.elementRegistry.register({key: 'armada-modal', assetPath: '/assets/engine-modal.min.js'});
  }

  blockSelectHandler(e) {
    // Hide the section modal on block select
    const sectionModal = this.parentElement.querySelector(`[data-modal-id="${e.detail.sectionId}"]`);
    if (sectionModal) sectionModal.classList.add('!invisible');

    // Show the block preview modal
    this.handleOpen(e.detail.blockId);
  }

  sectionSelectHandler(e) {
    // Show the section preview modal
    this.handleOpen(e.detail.sectionId);
  }

  editorCloseHandler(e, id, isBlock) {
    // To avoid closing all open modals, only close the one that's currently open
    if (id !== this.modalId) return;
    const currentModal = document.querySelector(`[data-modal-id="${id}"]`);
    currentModal.setAttribute('open', false);
    currentModal.removeAttribute('tabindex');
    currentModal.classList.add(...this.defaultClasses);
    currentModal.addTransitionClasses();
    (0,_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__.removeTrapFocus)();

    if (isBlock) {
      // Workaround when theme editor has two sidebars (shopify:section:select) only fires once
      const sectionModal = this.parentElement.querySelector(`[data-modal-id="${e.detail.sectionId}"]`);
      if (sectionModal) sectionModal.classList.remove('!invisible');
    }
  }

  handleOpen(id) {
    if (id !== this.modalId) return;

    // If using section rendering, get content before opening modal
    if (this.modalSection) {
      const modalContentWrapper = this.querySelector('[data-armada-selector="modal-content-wrapper"]');
      const url = this.modalUrl ? this.modalUrl : '?';
      window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(url, [this.modalSection], [modalContentWrapper], [undefined], this.openModal.bind(this));
    } else {
      this.openModal();
    }
  }

  openModal() {
    this.setAttribute('open', true);
    this.setAttribute('tabindex', '0');
    this.classList.remove(...this.defaultClasses);
    this.removeTransitionClasses();
    this.initPaymentButtons();
    (0,_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__.trapFocus)(this);
  }

  closeModal() {
    this.setAttribute('open', false);
    this.removeAttribute('tabindex');
    this.classList.add(...this.defaultClasses);
    this.addTransitionClasses();
    (0,_weareeight_armada_dist_utils_trapFocus__WEBPACK_IMPORTED_MODULE_0__.removeTrapFocus)();
  }

  buildModal() {
    // Get any static content included in markup
    const staticContentContainer = document.createElement('div');
    if (this.innerHTML) {
      staticContentContainer.innerHTML = this.innerHTML;
      this.innerHTML = '';
    }

    // Add modal html to component
    const modalContainer = new DOMParser().parseFromString(this.modalHtml, 'text/html').querySelector('[data-armada-selector="modal-container"]');
    this.appendChild(modalContainer);

    // Add close button and heading if modal is dismissable
    if (this.isDismissable) {
      const modalHeader = this.querySelector('[data-armada-selector="modal-header"]');
      if (this.modalHeading) {
        const heading = new DOMParser().parseFromString(this.headingHtml, 'text/html').querySelector('[data-armada-selector="modal-heading"]');
        heading.textContent = this.modalHeading;
        modalHeader.appendChild(heading);
        modalHeader.classList.add('p-2', 'md:p-3');
      }
      const closeButton = new DOMParser().parseFromString(this.closeButtonHtml, 'text/html').querySelector('[data-armada-selector-alt="modal-close-button"]');
      modalHeader.appendChild(closeButton);
    }

    // Add any static content included in markup
    if (staticContentContainer.innerHTML) {
      const modalContentWrapper = this.querySelector('[data-armada-selector="modal-content-wrapper"]');
      modalContentWrapper.appendChild(staticContentContainer);
    }

    // Add close event listeners
    const closeElements = this.querySelectorAll('[data-armada-modal-close]');
    closeElements.forEach(closeElement => {
      closeElement.addEventListener('click', this.closeModal.bind(this));
    })

    // Add transition classes
    this.addTransitionClasses();

    // Add underlay classes
    if (this.modalUnderlayClasses) {
      const underlay = this.querySelector('[data-armada-selector-alt="modal-underlay"]');
      this.modalUnderlayClasses.split(' ').forEach(underlayClass => {
        underlay.classList.add(underlayClass);
      });
    }
  }

  removeTransitionClasses() {
    const modalInner = this.querySelector('[data-armada-selector="modal-inner"]');
    this.transitionClasses.forEach(transitionClass => {
      modalInner.classList.remove(transitionClass);
    })
  }

  addTransitionClasses() {
    const modalInner = this.querySelector('[data-armada-selector="modal-inner"]');
    this.transitionClasses.forEach(transitionClass => {
      modalInner.classList.add(transitionClass);
    })
  }

  initPaymentButtons() {
    if(window.Shopify?.PaymentButton) {
      window.Shopify.PaymentButton.init();
    }
  }

  get isDismissable() {
    return this.dataset.modalDismissable === "true"
  }
}

customElements.define('armada-modal', ArmadaModal);

})();

/******/ })()
;