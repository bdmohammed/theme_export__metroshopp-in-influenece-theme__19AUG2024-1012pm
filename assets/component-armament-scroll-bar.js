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


class ScrollBar extends HTMLElement {
  constructor() {
    super();

    this.count = 1;
    this.dragThreshold = 20;

    const handlers = [
      'touchstartHandler',
      'touchendHandler',
      'touchmoveHandler',
      'mousedownHandler',
      'mouseupHandler',
      'mouseleaveHandler',
      'mousemoveHandler',
    ];

    handlers.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  get indicator() {
    return this.dataset.indicator ? this.dataset.indicator : 'full';
  }

  get itemCount() {
    return this.dataset.itemCount ? Number(this.dataset.itemCount) : 1;
  }

  get initialWidth() {
    return 100 / this.itemCount;
  }

  get paused() {
    return this.dataset?.paused === 'true' ? true : false;
  }

  get pausedForward() {
    return this.dataset?.pausedForward === 'true' ? true : false;
  }

  get loopForward() {
    return this.dataset?.loopForward === 'true' ? true : false;
  }

  get loopBackward() {
    return this.dataset?.loopBackward === 'true' ? true : false;
  }

  connectedCallback() {
    this.rangeIndicator = this.querySelector('.scroll-range');
    this.parent = this.closest(`${this.dataset.parent}`);

    this.dataset.target = this.dataset.target ? this.dataset.target : 'scrollbar-target';
    this.dataset.navLeft = this.dataset.navLeft ? this.dataset.navLeft : 'icon-prev';
    this.dataset.navRight = this.dataset.navRight ? this.dataset.navRight : 'icon-next';

    if(!this.parent) {
      console.warn('Could not find scrollbar parent', this.parent);
      return;
    }

    this.target = this.parent.querySelector(`[data-name="${this.dataset.target}"]`);
    this.navLeft = this.parent.querySelector(`[data-name="${this.dataset.navLeft}"]`);
    this.navRight = this.parent.querySelector(`[data-name="${this.dataset.navRight}"]`);

    if(!this.target) {
      console.warn('Could not find scrollbar target', this.dataset.target, 'in', this.parent);
      return;
    }

    this.setIndicatorWidth();

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.setEventListeners.bind(this));
  }

  setEventListeners() {
    this.pointerDown = false;
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: false,
    };

    this.target.addEventListener('mousedown', this.mousedownHandler);
    this.target.addEventListener('mouseup', this.mouseupHandler);
    this.target.addEventListener('mouseleave', this.mouseleaveHandler);
    this.target.addEventListener('mousemove', this.mousemoveHandler);

    this.target.addEventListener('touchstart', this.touchstartHandler, { passive: true });
    this.target.addEventListener('touchend', this.touchendHandler, { passive: true });
    this.target.addEventListener('touchmove', this.touchmoveHandler, { passive: true });

    if(this.navLeft) this.navLeft.addEventListener('click', this.decreaseProgress.bind(this));
    if(this.navRight) this.navRight.addEventListener('click', this.increaseProgress.bind(this));

    window.eight.armada.elementRegistry.register({key: 'scroll-bar', assetPath: '/assets/component-armament-scroll-bar.min.js'});
  }

  setIndicatorWidth() {
    // Set the width of the indicator according to the amount of items it needs to cycle through
    this.rangeIndicator.style.width = this.initialWidth + '%';
  };

  clearDrag() {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    };
  }

  updateAfterDrag() {
    const movement = 1 * (this.drag.endX - this.drag.startX);
    const movementDistance = Math.abs(movement);

    if (movement > 0 && movementDistance > this.dragThreshold) {
      this.decreaseProgress();
    }
    else if (movement < 0 && movementDistance > this.dragThreshold) {
      this.increaseProgress();
    }
  }

  mousedownHandler(e) {
    if(this.paused) return;

    // Prevent swiping on inputs, selects and buttons
    const ignore = ['OPTION', 'INPUT', 'SELECT', 'BUTTON', 'MODEL-VIEWER'].indexOf(e.target.nodeName) !== -1;
    if (ignore) return;

    e.preventDefault();
    e.stopPropagation();

    this.pointerDown = true;
    this.drag.startX = e.pageX;
  }

  mouseupHandler(e) {
    if(this.paused) return;

    e.stopPropagation();
    this.pointerDown = false;

    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }

  mouseleaveHandler(e) {
    if(this.paused) return;

    if (this.pointerDown) {
      this.pointerDown = false;
      this.drag.endX = e.pageX;
      this.drag.preventClick = false;
      this.updateAfterDrag();
      this.clearDrag();
    }
  }

  mousemoveHandler(e) {
    if(this.paused) return;
    // Prevent dragging / swiping on inputs, selects and buttons
    const ignore = ['OPTION', 'INPUT', 'SELECT', 'BUTTON', 'MODEL-VIEWER'].indexOf(e.target.nodeName) !== -1;
    if (ignore) return;

    e.preventDefault();

    if (this.pointerDown) {
      if (e.target.nodeName === 'A') {
        this.drag.preventClick = true;
      }

      this.drag.endX = e.pageX;
    }
  }

  touchstartHandler(e) {
    if(this.paused) return;

    // Prevent swiping on inputs, selects and buttons
    const ignore = ['OPTION', 'INPUT', 'SELECT', 'BUTTON', 'MODEL-VIEWER'].indexOf(e.target.nodeName) !== -1;
    if (ignore) return;

    this.pointerDown = true;
    this.drag.startX = e.touches[0].pageX;
    this.drag.startY = e.touches[0].pageY;
  }

  touchendHandler(e) {
    if(this.paused) return;
    this.pointerDown = false;
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }

  touchmoveHandler(e) {
    if(this.paused) return;

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
    }

    if (this.pointerDown && this.drag.letItGo) {
      this.drag.endX = e.touches[0].pageX;
    }
  }

  increaseProgress() {
    if (this.pausedForward) return;

    if (this.count <= this.itemCount - 1) {
      this.count += 1;
      let newWidth = this.initialWidth * this.count;

      if(this.indicator === 'progress') {
        newWidth = (this.initialWidth * (this.count - 1));
        this.rangeIndicator.style.left = newWidth + '%';
      }
      else {
        this.rangeIndicator.style.width = newWidth + '%';
      }
    } else {
      this.resetScrollbar();
    }
  };

  decreaseProgress() {
    if (this.count >= 2) {
      this.count -= 1;
      let newWidth = this.initialWidth * this.count;

      if(this.indicator === 'progress') {
        newWidth = (this.initialWidth * (this.count - 1));
        this.rangeIndicator.style.left = newWidth + '%';
      }
      else {
        this.rangeIndicator.style.width = newWidth + '%';
      }
    } else {
      this.scrollToEnd();
    }
  };

  resetScrollbar() {
    if (!this.loopForward) return;

    this.count = 1;
    if (this.indicator === 'progress') {
      this.rangeIndicator.style.left = '0';
    } else {
      this.rangeIndicator.style.width = '0';
    }
  }

  scrollToEnd() {
    if (!this.loopBackward) return;

    this.count = this.itemCount;
    if (this.indicator === 'progress') {
      let newWidth = this.initialWidth * (this.count - 1);
      this.rangeIndicator.style.left = newWidth + '%';
    } else {
      this.rangeIndicator.style.width = '100%'
    }
  }
}

customElements.define('scroll-bar', ScrollBar);

})();

/******/ })()
;