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

/***/ 273:
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={};return((e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.debounce=void 0,t.debounce=(e,t,o)=>{let n;return function(){let u=this,r=arguments;const a=()=>{n=null,o||e.apply(u,r)};o&&!n&&e.apply(u,r),clearTimeout(n),n=setTimeout(a,t)}},t.default=t.debounce})(0,e),e})()}));

/***/ }),

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
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(273);
/* harmony import */ var _weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__);



class sliderEngine extends HTMLElement {
  constructor() {
    super();

    this.templateContent = this.querySelector(':scope > template') ? this.querySelector(':scope > template').content : null;

    this.timeout = false;
    this.dragThreshold = 20;
    this.easing = this.animationDuration < 0 ? 'ease' : '';

    const handlers = [
      'resizeHandler',
      'touchstartHandler',
      'touchendHandler',
      'touchmoveHandler',
      'mousedownHandler',
      'mouseupHandler',
      'mouseleaveHandler',
      'mousemoveHandler',
      'clickHandler',
      'keyHandler',
      'setBreakpoints',
      'handleVariantChange',
      'next',
      'prev',
      'enableTransition',
      'nextArrowHandler',
      'prevArrowHandler',
      'blockSelectHandler',
      'blockDeselectHandler',
      'hoverDetails',
      'hoverDetailsOut',
      'autoSlideInit'
    ];

    handlers.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  static get observedAttributes() {
    return ['mode', 'load'];
  }

  attributeChangedCallback(attribute, oldVal, newVal) {
    // This runs on page load, so we want to check that both values are present.
    // If this is running at buildtime, oldVal won't be set.
    if(!oldVal || !newVal || oldVal === newVal) return;

    if(attribute === 'mode') {
      if(oldVal === 'vertical') {
        this.sliderWrap.style.maxHeight = '100%';
        this.sliderWrap.classList.remove('max-h-0');
      }

      // Re-init with the new mode.
      this.init();
    }
    else if(attribute === 'load' && newVal === 'true') {
      // Components may init their slider when they are ready.
      this.init();
    }
  }

  connectedCallback() {
    this.sliderFrame = this.querySelector('[data-name="slider"]');
    this.sliderWrap = this.querySelector('[data-name="slider-wrap"]');
    if(!this.sliderFrame || !this.sliderWrap) return;

    (0,_weareeight_armada_dist_utils_isArmadaLoaded__WEBPACK_IMPORTED_MODULE_0__.isArmadaLoaded)(this.init.bind(this));
  }

  init() {
    if(this.noInit) {
      return;
    }

    if(this.loop && this.isHorizontal) {
      this.createLoopClones();
    }

    this.slideElems = [].slice.call(this.querySelectorAll('[data-name="slide"]'));
    this.totalSlides = this.slideElems.length;

    this.setStageBounds();
    if(this.totalSlides <= 1 && !this.isPeep) return;

    // No init if combined height of slides is less than the stage height.
    if(this.isVertical && this.sliderFrame.innerHeight <= this.stageHeight) return;
    if(this.isHorizontal && this.sliderFrame.innerWidth <= this.stageWidth) return;

    if(this.pid) {
      document.addEventListener(`${window.eight.constants.events["ARMADA:VARIANT:CHANGE"]}`, this.handleVariantChange);
    }

    if(this.grabCursor) this.sliderFrame.style.cursor = '-webkit-grab';
    this.setBreakpoints();
    this.resolveVisibleSlides();
    this.enableTransition();

    this.currentSlide = Math.max(0, Math.min(0, this.totalSlides - this.visibleSlides));

    this.render();
    this.attachEvents();
    this.setArrowOpacity();
    this.scrollBarsItemCount();

    if(this.loop && this.isHorizontal) {
      this.disableTransition();
      this.slideVisible(false, true);
    }
    else {
      this.slideToCurrent();
    }

    this.previewNextSlide();
    this.setActive();
    this.setAutoHeight();

    if(this.autoplay) this.autoSlideInit();
    window.eight.armada.elementRegistry.register({key: 'slider-engine', assetPath: '/assets/engine-slider.min.js'});
  }

  render() {
    if(this.arrows && this.templateContent) {
      const prevIcon = this.templateContent.querySelector('[data-name="icon-prev"]').cloneNode(true);
      const nextIcon = this.templateContent.querySelector('[data-name="icon-next"]').cloneNode(true);

      this.appendChild(prevIcon);
      this.appendChild(nextIcon);
    }

    this.nextArrows = this.querySelectorAll('[data-name="icon-next"]');
    this.prevArrows = this.querySelectorAll('[data-name="icon-prev"]');

    const navExists = this.querySelector('[data-name="counter"]');

    if(this.counter && this.templateContent && !navExists) {
      const counterElems = this.templateContent.querySelector('[data-name="counter"]').cloneNode(true);
      this.appendChild(counterElems);
    }

    this.counterWraps = this.querySelectorAll('[data-name="counter"]');
    this.counterCurrents = this.querySelectorAll('[data-name="counter-current"]');
    this.counterSeparators = this.querySelectorAll('[data-name="counter-separator"]');
    this.counterTotals = this.querySelectorAll('[data-name="counter-total"]');

    const indicatorExists = this.querySelector('[data-name="mobile-indicator"]');

    if(this.mobileIndicator && this.templateContent && !indicatorExists) {
      const mobileIndicator = this.templateContent.querySelector('[data-name="mobile-indicator"]');

      if(mobileIndicator) {
        const mobileBar = mobileIndicator.cloneNode(true);
        this.appendChild(mobileBar);
      }
    }

    this.setSlideDimensions();
    this.setNavAndProgressWidth();
  }

  setStageBounds() {
    // this.stageWidth = this.selector.offsetWidth;
    // This is more precise than this.selector.offsetWidth, trying to avoid rounding
    // errors where you see a tiny amount of the next slide..
    this.selectorBounds = this.sliderFrame.getBoundingClientRect();
    this.stageWidth = this.selectorBounds.width;
    this.stageHeight = this.selectorBounds.height;

    if(this.isVertical) {
      if(this.match) {
        // Match height of specified element.
        const matchElemBounds = this.match.getBoundingClientRect();
        this.stageHeight = matchElemBounds.height;

        // Make sure a tailwind class of max-h-0 is added in liquid to prevent CLS in vertical mode.
        this.sliderWrap.style.maxHeight = this.stageHeight + 'px';
      }
      else if(this.sliderFrame.innerHeight <= this.stageHeight) {
        // If the combined height of slides is less than the stage, show everything.
        this.sliderWrap.style.maxHeight = '100%';
        this.sliderWrap.classList.remove('max-h-0');
      }
    }
  }

  attachEvents() {
    if (this.totalSlides <= 1 && !this.isPeep) return;

    // Keep track pointer hold and dragging distance
    this.pointerDown = false;
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0,
      startY: 0,
      letItGo: null,
      preventClick: false,
    };

    const returnedFunction = (0,_weareeight_armada_dist_utils_debounce__WEBPACK_IMPORTED_MODULE_1__.debounce)(this.resizeHandler, 250);
    window.addEventListener('resize', returnedFunction);

    this.sliderWrap.addEventListener('touchstart', this.touchstartHandler, { passive: true });
    this.sliderWrap.addEventListener('touchend', this.touchendHandler, { passive: true });
    this.sliderWrap.addEventListener('touchmove', this.touchmoveHandler, { passive: true });

    this.sliderFrame.addEventListener('mousedown', this.mousedownHandler);
    this.sliderFrame.addEventListener('mouseup', this.mouseupHandler);
    this.sliderFrame.addEventListener('mouseleave', this.mouseleaveHandler);
    this.sliderFrame.addEventListener('mousemove', this.mousemoveHandler);

    this.sliderFrame.addEventListener('click', this.clickHandler);
    this.addEventListener('keydown', this.keyHandler);

    if(this.arrows) {
      if(this.nextArrows) {
        this.nextArrows.forEach(next => next.addEventListener('click', this.nextArrowHandler));

        if(this.autoplay) {
          this.nextArrows.forEach(next => {
            next.addEventListener('mouseover', this.hoverDetails);
            next.addEventListener('mouseleave', this.hoverDetailsOut);
          });
        }
      }

      if(this.prevArrows) {
        this.prevArrows.forEach(prev => prev.addEventListener('click', this.prevArrowHandler));

        if(this.autoplay) {
          this.prevArrows.forEach(prev => {
            prev.addEventListener('mouseover', this.hoverDetails);
            prev.addEventListener('mouseleave', this.hoverDetailsOut);
          });
        }
      }
    }

    // Show slide when block selected in theme editor.
    if(this.blocks && window.Shopify.designMode) {
      document.addEventListener('shopify:block:select', this.blockSelectHandler);
      document.addEventListener('shopify:block:deselect', this.blockDeselectHandler);
    }

    if(this.autoplay) {
      // Pause when hovering text content.
      this.slideContents = this.querySelectorAll('[data-name="slide-content"]');

      this.slideContents.forEach(slideContent => {
        slideContent.addEventListener('mouseover', this.hoverDetails);
        slideContent.addEventListener('mouseleave', this.hoverDetailsOut);
      });
    }
  }

  detachEvents() {
    window.removeEventListener('resize', this.resizeHandler);

    this.sliderWrap.removeEventListener('touchstart', this.touchstartHandler);
    this.sliderWrap.removeEventListener('touchend', this.touchendHandler);
    this.sliderWrap.removeEventListener('touchmove', this.touchmoveHandler);

    this.sliderFrame.removeEventListener('mousedown', this.mousedownHandler);
    this.sliderFrame.removeEventListener('mouseup', this.mouseupHandler);
    this.sliderFrame.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.sliderFrame.removeEventListener('mousemove', this.mousemoveHandler);

    this.sliderFrame.removeEventListener('click', this.clickHandler);
    this.removeEventListener('keydown', this.keyHandler);

    if(this.nextArrows) this.nextArrows.forEach(next => next.removeEventListener('click', this.nextArrowHandler));
    if(this.prevArrows) this.prevArrows.forEach(prev => prev.removeEventListener('click', this.prevArrowHandler));

    if(this.blocks && window.Shopify.designMode) {
      document.removeEventListener('shopify:block:select', this.blockSelectHandler);
      document.removeEventListener('shopify:block:deselect', this.blockDeselectHandler);
    }
  }

  setSlideDimensions() {
    if(this.totalSlides > this.visibleSlides && this.visibleSlides > 0) {
      this.slideWidth = Math.ceil(this.stageWidth / this.visibleSlides);

      this.slideElems.forEach(slideElem => {
        if (this.isMobile && this.visibleSlides === 1) {
          slideElem.style.minWidth = this.slideWidth - 1 + 'px';
        } else {
          slideElem.style.minWidth = this.slideWidth + 'px';
        }
      });

      if(this.loop) {
        const clones = this.sliderFrame.querySelectorAll('[data-cloned="true"]');

        clones.forEach(clone => {
          if (this.isMobile && this.visibleSlides === 1) {
            clone.style.minWidth = this.slideWidth - 1 + 'px';
          } else {
            clone.style.minWidth = this.slideWidth + 'px';
          }
        });
      }
    }
  }

  setNavAndProgressWidth() {
    this.slideElems.forEach(slideElem => {
      // Progress bar width to match the content box width.
      const navAndProgress = slideElem.querySelector('[data-armada-selector="slider-navigation-and-progress"]');
      const slideContents = slideElem.querySelector('[data-name="slide-content"]');
      if(navAndProgress && slideContents) {
        navAndProgress.style.width = `${slideContents.offsetWidth}px`;
      }
    });
  }

  setBreakpoints() {
    if(window.eight.tailwind) {
      this.breakpoints = window.eight.tailwind.screens;
    }
  }

  // For simpilicity we'll only allow looping in the forward direction.
  createLoopClones() {
    const slideElems = [].slice.call(this.querySelectorAll('[data-name="slide"]'));
    const visibleSlidesAttr = this.getAttribute('visible-slides');

    if(slideElems.length <= 1 || visibleSlidesAttr === 1) return;

    this.cloneFirst = slideElems[0].cloneNode(true);
    this.cloneFirst.dataset.cloned = 'true';

    // First slide clone goes after the last 'real' slide.
    this.sliderFrame.appendChild(this.cloneFirst);
  }

  loopBack() {
    // We've landed on the cloned first slide, aka the end of the ride.
    // Transition back to the 'real' first slide so the loop starts again.
    this.disableTransition();
    this.currentSlide = 0;
    this.slideVisible(false, true);
    this.autoSlideInit();
  }

  // Advance to the next slide automatically at a set interval.
  autoSlideInit() {
    if(!this.autoplay) return;
    if(this.totalSlides < 2) return;

    // Clear any existing animations, we don't want to stack them.
    this.stopAutoSlide();

    this.currentAnimation = setInterval(this.next, this.slideDuration);
  }

  stopAutoSlide(hover = false) {
    if(this.currentAnimation) {
      clearInterval(this.currentAnimation);
    }

    if(hover) {
      window.eight.eventsEngine.emit(`${window.eight.constants.events["ARMADA:PROGRESSBAR:PAUSE"]}`, { 'element': this.slideElems[this.currentSlide] });
    }
  }

  prev(e) {
    if (this.totalSlides <= 1 & !this.isPeep) return;

    this.progressBarReset();

    if(e && e.type == 'click') {
      e.preventDefault();
      this.enableTransition();
    }

    if(this.isVertical) {
      this.slideToCurrent('previous');
    }
    else {
      const beforeChange = this.currentSlide;
      this.currentSlide = Math.max(this.currentSlide - 1, 0);

      if (beforeChange !== this.currentSlide) {
        this.slideToCurrent('previous');
      }
      else {
        // At start, make first slide fully visible.
        this.disableTransition(100);
        this.slideVisible(false, true);
      }
    }

    if(this.prevOnChange) clearTimeout(this.prevOnChange);

    this.prevOnChange = setTimeout(() => {
      this.onChange.call(this);
    }, this.animationDuration);

    this.setArrowOpacity();
    this.unsetActive();
    this.setAutoHeight();
  }

  next(e) {
    if (this.totalSlides <= 1 && !this.isPeep) return;

    this.progressBarReset();

    if(e && e.type == 'click') {
      e.preventDefault();
      this.enableTransition();
    }

    if(this.isVertical) {
      this.slideToCurrent('next');
    }
    else {
      const beforeChange = this.currentSlide;
      this.currentSlide = Math.min(this.currentSlide + 1, this.totalSlides - this.visibleSlides);

      if (beforeChange !== this.currentSlide) {
        this.slideToCurrent('next');
      }
      else {
        // At end, translate back to final slide.
        this.slideToCurrent();
      }
    }

    if(this.nextOnChange) clearTimeout(this.nextOnChange);

    this.nextOnChange = setTimeout(() => {
      this.onChange.call(this);
    }, this.animationDuration);

    this.setArrowOpacity();
    this.unsetActive();
    this.setAutoHeight();
  }

  // Event handlers.
  mousedownHandler(e) {
    // Prevent dragging / swiping on inputs, selects and buttons
    const ignore = ['OPTION', 'INPUT', 'SELECT', 'BUTTON', 'MODEL-VIEWER'].indexOf(e.target.nodeName) !== -1;
    if (ignore) return;

    e.preventDefault();

    // Allow event to filter through to scrollBars.
    if(!this.scrollBars) {
      e.stopPropagation();
    }

    this.stopAutoSlide();

    this.pointerDown = true;
    this.drag.startX = e.pageX;
    this.drag.startY = e.pageY;
  }

  mouseupHandler(e) {
    if(!this.scrollBars) {
      e.stopPropagation();
    }

    this.pointerDown = false;

    if(this.grabCursor) this.sliderFrame.style.cursor = '-webkit-grab';

    this.enableTransition();

    if (this.isVertical && this.drag.endY || this.isHorizontal && this.drag.endX) {
      this.updateAfterDrag();
    }

    this.clearDrag();

    // Re-enable autosliding after an interaction takes over.
    if(this.autoplay) this.autoSlideInit();
  }

  mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.drag.endX = e.pageX;
      this.drag.endY = e.pageY;
      this.drag.preventClick = false;

      if(this.grabCursor) this.sliderFrame.style.cursor = '-webkit-grab';

      this.enableTransition();
      this.updateAfterDrag();
      this.clearDrag();

      if(this.autoplay) this.autoSlideInit();
    }
  }

  mousemoveHandler(e) {
    e.preventDefault();

    // This does the 'interim' movement of the slider, e.g. the response to
    // the drag. When released the 'actual' slide will happen.
    if(this.pointerDown) {
      const isInLink = e.target.closest('a');

      if(isInLink) this.drag.preventClick = true;
      this.setAttribute('dragging', true);
      if(this.grabCursor) {
        this.toDrag.style.cursor = '-webkit-grabbing';
      }

      this.toDrag.style.transition = this.isPeep ? `all 500ms ${this.easing}` : `all 0ms ${this.easing}`;
      this.drag.endX = e.pageX;
      this.drag.endY = e.pageY;

      // Simulate the drag prior to 'actually' moving to the next slide.
      // This causes all kinds of havoc in vertical mode. A future nice-to-have maybe.
      if(this.isHorizontal) {
        const currentOffset = this.currentSlide * (this.stageWidth / this.visibleSlides);
        const dragOffset = (this.drag.endX - this.drag.startX);
        let offset = currentOffset - dragOffset;

        if(this.isPeep) {
          offset = 0 - dragOffset;
        }

        // Don't drag if there is no slide animation.
        if(this.animationDuration > 0) {
          this.toDrag.style['transform'] = `translate3d(${(-1) * offset}px, 0, 0)`;
        }
      }
    }
  }

  touchstartHandler(e) {
    // Prevent dragging / swiping on inputs, selects and buttons
    const ignore = ['OPTION', 'INPUT', 'SELECT', 'BUTTON', 'MODEL-VIEWER'].indexOf(e.target.nodeName) !== -1;
    if (ignore) return;

    // e.stopPropagation();
    e.stopImmediatePropagation();

    this.pointerDown = true;
    this.drag.startX = e.touches[0].pageX;
    this.drag.startY = e.touches[0].pageY;

    this.stopAutoSlide();

    // Try as I might, I cannot find a solution to stop the screen moving around here that is anywhere near as solid as preventDefault :(
    // We may need to revisit this if the knockon to the Lighthouse score is sufficiently affected by the non-passive event listener.
    // e.preventDefault();
  }

  touchmoveHandler(e) {
    if (this.drag.letItGo === null) {
      if(this.isVertical) {
        this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) > Math.abs(this.drag.startX - e.touches[0].pageX);
      }
      else if(this.isHorizontal) {
        this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
      }
    }

    if (this.pointerDown && this.drag.letItGo) {
      // So that we don't have to use preventDefault in touchmoveHandler to
      // prevent the screen from moving on swipe. Then we can set touchmove
      // listener as passive.
      document.documentElement.classList.add('overflow-hidden');

      this.drag.endX = e.touches[0].pageX;
      this.drag.endY = e.touches[0].pageY;

      this.toDrag.style.transition = this.isPeep ? `all 500ms ${this.easing}` : `all 0ms ${this.easing}`;

      // This causes all kinds of havoc in vertical mode. A future nice-to-have maybe.
      if(this.isHorizontal) {
        const currentOffset = this.currentSlide * (this.stageWidth / this.visibleSlides);
        const dragOffset = (this.drag.endX - this.drag.startX);
        let offset = currentOffset - dragOffset;

        if(this.isPeep) {
          offset = 0 - dragOffset;
        }

        this.toDrag.style['transform'] = `translate3d(${(-1) * offset}px, 0, 0)`;
      }
    }
  }

  touchendHandler(e) {
    let self = this;
    e.stopPropagation();
    this.pointerDown = false;
    this.enableTransition();

    if (this.isVertical && this.drag.endY || this.isHorizontal && this.drag.endX) {
      this.updateAfterDrag();
    }

    this.clearDrag();

    if(this.clearOverflow) {
      clearTimeout(this.clearOverflow);
    }

    // Debounce the removal of overflow-hidden to avoid any jerky motion.
    this.clearOverflow = setTimeout(() => {
      // Try as I might, I cannot find a solution to stop the screen moving around here that is anywhere near as solid as preventDefault :(
      // We may need to revisit this if the knockon to the Lighthouse score is sufficiently affected by the non-passive event listener.
      document.documentElement.classList.remove('overflow-hidden');

      // Re-enable autosliding after an interaction takes over.
      if(self.autoplay) self.autoSlideInit();
    }, 250);
  }

  clickHandler(e) {
    // Prevent browsers from folowing dragged link
    if (this.drag.preventClick) {
      e.preventDefault();
    }

    this.drag.preventClick = false;
    setTimeout(() => this.setAttribute('dragging', false), 100);
  }

  hoverDetails(e) {
    this.stopAutoSlide(true);
  }

  hoverDetailsOut(e) {
    this.autoSlideInit();

    window.eight.eventsEngine.emit(`${window.eight.constants.events["ARMADA:PROGRESSBAR:PLAY"]}`, { 'element': this.slideElems[this.currentSlide] });
  }

  nextArrowHandler(e) {
    e.preventDefault();

    // Stop further clicks until animation is done.
    this.nextArrows.forEach(next => next.removeEventListener('click', this.nextArrowHandler));

    this.stopAutoSlide();
    this.next(e);
  }

  prevArrowHandler(e) {
    e.preventDefault();

    // Stop further clicks until animation is done.
    this.prevArrows.forEach(prev => prev.removeEventListener('click', this.prevArrowHandler));

    this.stopAutoSlide();
    this.prev(e);
  }

  // Slide to selected block.
  blockSelectHandler(e) {
    const slideIndex = this.slideElems.findIndex((slide) => slide.dataset.blockId === e.detail.blockId);
    if (slideIndex == -1) return;
    if (slideIndex > this.totalSlides - this.visibleSlides) {
      this.currentSlide = this.totalSlides - this.visibleSlides;
    } else {
      this.currentSlide = slideIndex;
    }
    this.slideVisible(false, true);
    if(this.autoplay) this.stopAutoSlide();
    this.setActive();
  }

  blockDeselectHandler() {
    if(this.autoplay) this.autoSlideInit();
  }

  keyHandler(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.stopAutoSlide();
        this.next(e);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.stopAutoSlide();
        this.prev(e);
        break;
    }
  }

  resizeHandler() {
    this.resolveVisibleSlides();

    // prevent hiding items when browser width increases
    if (this.isHorizontal && (this.currentSlide + this.visibleSlides > this.totalSlides)) {
      this.currentSlide = this.totalSlides <= this.visibleSlides ? 0 : this.totalSlides - this.visibleSlides;
    }

    this.setStageBounds();
    this.scrollBarsItemCount();
    this.disableTransition();
    this.setSlideDimensions();
    this.setNavAndProgressWidth();
    this.slideToCurrent();
    this.setAutoHeight();
  }

  handleVariantChange(event) {
    const { productId, variant, scopeId } = event.detail;

    // Return early if we don't have this productID in our slider, or if outside of scope.
    if(this.pid !== productId || !variant) return;
    if(this.scopeId != scopeId) return;

    const mediaId = variant.featured_media ? variant.featured_media.id : this.featuredImageId;

    this.slideToMediaId(mediaId, true);
  }

  slideToMediaId(mediaId, disableAnimation = false) {
    // Find slide index by mediaID
    this.currentSlide = this.slideElems.findIndex((slide) => parseInt(slide.getAttribute('media-id')) == mediaId);

    if(disableAnimation) this.disableTransition();

    this.slideVisible(false, true);
  }

  // Slider functions.
  clearDrag() {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    };
  }

  slideToCurrent(direction = false, force = false) {
    const atEnd = this.atEnd();

    // Reset to the start.
    if(!direction && !atEnd || force) {
      if(force) {
        this.disableTransition();
      }

      this.sliderFrame.style['transform'] = 'translate3d(0, 0, 0)';
      return;
    }

    // TODO: test this in horizontal mode with variable width slides.
    this.slideVisible(direction);
  }

  slideVisible(direction = false, reEnableTransition = false) {
    let offset = 0;
    const atEnd = this.atEnd();

    if(this.isVertical) {
      offset = this.getOffset(direction);

      if(direction == 'next' && !atEnd || direction == 'previous') {
        this.sliderFrame.style['transform'] = `translate3d(0, -${offset}px, 0)`;
      }
    }
    else if(this.isHorizontal) {
      offset = (-1) * this.currentSlide * (this.stageWidth / this.visibleSlides);
      this.sliderFrame.style['transform'] = `translate3d(${offset}px, 0, 0)`;

      if(reEnableTransition) {
        setTimeout(this.enableTransition, this.animationDuration);
      }
    }
  }

  getTranslate3d(element) {
    const values = element.style.transform.split(/\w+\(|\);?/);
    const transform = values[1].split(/,\s?/g).map(numStr => parseInt(numStr));

    return {
      x: transform[0],
      y: transform[1]
    };
  }

  getOffset(direction) {
    if(!direction) return 0;

    const currentTransform = this.getTranslate3d(this.sliderFrame);
    const currentOffset = (this.isVertical) ? currentTransform.y : currentTransform.x;
    let offset = 0;
    // Offset cannot be calculated by num of visible slides since that
    // is variable, and slides could be partially off stage.

    // Get the dimensions of the first visible slide.
    for (const slideElem of this.slideElems) {
      const isVisible = this.isVisible(slideElem);

      if(isVisible) {
        let newBounds;

        if(direction == 'next' && slideElem.nextElementSibling) {
          newBounds = slideElem.nextElementSibling.getBoundingClientRect();

          if(this.isVertical) {
            // next slide vertically
            offset = ((-1) * currentOffset) + newBounds.height;
          }
          else {
            // next slide horizontally
            offset = ((-1) * currentOffset) + newBounds.width;
          }
        }
        else if(direction == 'previous') {
          if(slideElem.previousElementSibling) {
            newBounds = slideElem.previousElementSibling.getBoundingClientRect();

            if(this.isVertical) {
              // prev slide vertically
              offset = ((-1) * currentOffset) - newBounds.height;
            }
            else if (this.isHorizontal) {
              // prev slide horizontally
              offset = ((-1) * currentOffset) - newBounds.width;
            }
          }
        }
        break;
      }
    };

    return offset;
  }

  getEventDirection(e) {
    let direction;

    if(this.isVertical) {
      direction = (e.clientY - window.innerHeight / 2) > 0 ? 'previous' : 'next';
    }
    else {
      direction = (e.clientX - window.innerWidth / 2) > 0 ? 'previous' : 'next';
    }

    return direction;
  }

  isVisible(element, full = false) {
    const stageBounds = this.sliderWrap.getBoundingClientRect();
    const elBounds = element.getBoundingClientRect();

    if(!full) {
      // Is any part of element visible?
      if(this.isVertical && elBounds.bottom <= stageBounds.top) {
        return false;
      }
      else if(this.isHorizontal && elBounds.left <= stageBounds.right) {
        return false;
      }

      return true;
    }
    else {
      // Is element completely off the stage?
      if(this.isVertical && elBounds.top >= stageBounds.top && elBounds.bottom <= stageBounds.bottom) {
        return true;
      }
      else if(this.isHorizontal && elBounds.left >= stageBounds.left && elBounds.right <= stageBounds.right) {
        return true;
      }

      return false;
    }
  }

  previewNextSlide() {
    if(this.mode !== 'preview' || !window.hasOwnProperty('Animation') || this.isVertical) return;

    const currentSlideOffset = (-1) * this.currentSlide * (this.stageWidth / this.visibleSlides);
    const nextSlideOffset = (-1) * (this.currentSlide + 1) * (this.stageWidth / this.visibleSlides);
    const previewDecimal = 0.5; // Proportion of next slide to preview
    const previewOffset = (nextSlideOffset + currentSlideOffset) * previewDecimal;
    const currentBreakpoint = window.eight.getCurrentBreakpoint();
    const self = this;

    const previewAnimation = this.sliderFrame.animate(
      [
        { transform: `translate3d(${currentSlideOffset}px, 0, 0)` },
        { transform: `translate3d(${previewOffset}px, 0, 0)` }
      ],
      {
        delay: 2000,
        duration: 1000,
        direction: 'alternate',
        iterations: 2,
        easing: this.easing
      }
    )

    if (currentBreakpoint == 'sm' || currentBreakpoint == 'md') {
      return;
    }

    previewAnimation.ready.then(function() {
      setTimeout(function(){
        self.showNextArrow();
      }, previewAnimation.effect.getTiming().delay);
    })

    previewAnimation.onfinish = this.hideNextArrow.bind(this);
  }

  // Decide whether to advance slide based on drag data.
  updateAfterDrag() {
    let movement = 0;
    if(this.totalSlides === 1 && !this.isPeep) return;

    if(this.isVertical) {
      movement = 1 * (this.drag.endY - this.drag.startY);
    }
    else {
      movement = 1 * (this.drag.endX - this.drag.startX);
    }

    const movementDistance = Math.abs(movement);
    const direction = movement > 0 ? 'previous' : 'next';

    if(movementDistance > this.dragThreshold) {

      if(this.isPeep && direction === 'next') {
        if(!this.peepTextOverImage) {
          // Move the peep text into view and leave it there.
          this.toDrag.style['cursor'] = '';
          this.toDrag.style['transform'] = '';
          this.toDrag.style['left'] = '0';

          this.peepTextOverImage = true;
        }
        else {
          // The text is partially out of view.
          this.peepTextOverImage = false;
        }

        if(this.scrollBars.length) {
          this.scrollBars[0].dataset.pausedForward = !this.peepTextOverImage;
        }

        // Don't move the whole slide on, we've just moved the text over the image.
        if(this.peepTextOverImage) return;
      }

      if (this.isPeep && direction === 'previous') {
        if(this.scrollBars.length) {
          this.scrollBars[0].dataset.pausedForward = true;
        }
      }

      if (direction === 'previous') {
        this.prev();
      }
      else if (direction === 'next') {
        this.next();
      }
    }
    else {
      // Go back to start of current slide if drag threshold not reached.
      this.slideVisible(direction);

      // Move text box back to slightly out of view.
      if(this.isPeep) {
        this.peepTextOverImage = false;
        this.toDrag.style['transform'] = 'translate3d(0, 0, 0)';
        this.toDrag.style['left'] = '';
      }
    }
  }

  disableTransition(duration = 0) {
    this.sliderFrame.style.transition = `all ${duration}ms ${this.easing}`;
  }

  enableTransition() {
    this.sliderFrame.style.transition = `all ${this.animationDuration}ms ${this.easing}`;
  }

  setArrowOpacity() {
    if(!this.arrows || !this.prevArrows || !this.nextArrows) return;

    this.nextArrows.forEach(next => {
      next.classList.remove('opacity-0');
      next.ariaDisabled = 'false';
    });

    this.prevArrows.forEach(prev => {
      prev.classList.remove('opacity-0');
      prev.ariaDisabled = 'false';
    });

    if(this.atStart()) {
      this.prevArrows.forEach(prev => {
        prev.classList.remove('opacity-100', 'group-hover:opacity-100', 'group-focus:opacity-100');
        prev.classList.add('opacity-0');
        prev.ariaDisabled = 'true';
      });
    }
    else if (this.atEnd() && !this.loop) {
      this.nextArrows.forEach(next => {
        next.classList.remove('opacity-100', 'group-hover:opacity-100', 'group-focus:opacity-100');
        next.classList.add('opacity-0');
        next.ariaDisabled = 'true';
      });
    }

    // Grab section colour scheme if one exists.
    this.scheme = this.slideElems[this.currentSlide].dataset.colorScheme;

    if(this.scheme) {
      this.dataset.colorScheme = this.scheme;
    }
    else {
      this.dataset.colorScheme = '';
    }
  }

  showNextArrow() {
    this.nextArrows.forEach(next => {
      next.classList.remove('opacity-0', '-right-6');
      next.classList.add('-right-0');
    });

    this.classList.add('overflow-visible');
  }

  hideNextArrow() {
    this.nextArrows.forEach(next => {
      next.classList.add('opacity-0', '-right-6');
      next.classList.remove('-right-0');
    });

    this.classList.add('overflow-visible');
  }

  // Reset all progress bars to empty.
  progressBarReset() {
    if(this.progressBars) {
      this.progressBars.forEach(bar => {
        bar.querySelector('[data-name="bar"]').classList.remove('bg-body', 'bg-page');
        bar.dataset.progressPlay = false;
      });
    }
  }

  scrollBarsItemCount() {
    if(!this.scrollBars || this.scrollBars.length > 1) return;

    // scrollBars should display position based on the number of visible slides
    // e.g. when there are 5 slides with 2 visible, data-item-count on the scroll-bar
    // should be 4 as there are 4 moves to be made in the slider.

    const moves = this.visibleSlides > 1 || this.visibleSlides.sm > 1 || this.isMobile ? (this.totalSlides - this.visibleSlides) + 1 : this.scrollBars[0].dataset.itemCount;
    this.scrollBars[0].dataset.itemCount = moves;
    // Make sure the indicator width is correct
    const trackIndicator = this.scrollBars[0].querySelector('.scroll-range');
    if (!trackIndicator) return;
    trackIndicator.style.width = `${(100 / moves)}%`;
  }

  unsetActive() {
    this.slideElems.forEach(slideElem => slideElem.removeAttribute('data-slide-active'));
  }

  setActive() {
    this.slideElems[this.currentSlide].setAttribute('data-slide-active', '')
  }

  atStart() {
    return this.currentSlide === 0;
  }

  atEnd() {
    if(this.isVertical) {
      const lastSlide = this.slideElems[this.slideElems.length - 1];
      const lastSlideVisible = this.isVisible(lastSlide, true);

      if(lastSlideVisible) return true;
      return false;
    }

    // Horizontal mode.
    return (this.currentSlide + this.visibleSlides) == this.totalSlides;
  }

  // Event callbacks.
  onChange() {
    this.autoSlideInit();

    // Looping: If we land on the cloned slide then go back to it's 'real'
    // version to continue the loop.
    if(this.loop && this.isHorizontal) {
      if(this.slideElems[this.currentSlide].dataset.cloned == 'true') {
        this.loopBack();
      }
    }

    // Allow nav arrows to be clicked again following animation.
    if(this.arrows) {
      this.nextArrows.forEach(next => next.addEventListener('click', this.nextArrowHandler));
      this.prevArrows.forEach(prev => prev.addEventListener('click', this.prevArrowHandler));
    }

    const currentSlide = this.visibleSlides === 1 ? this.currentSlide : false;

    // There is a difference between progress-bar and scroll-bar armaments. See comments in the getters.
    if(this.progressBars && currentSlide !== false) {
      // Try to get a progress bar from the current slide element's children.
      // E.g. there is a progress bar for each slide.
      const barForThisSlide = this.slideElems[currentSlide].querySelector('progress-bar');

      if(barForThisSlide) {
        // Start animating this progress bar.
        this.progressBars[currentSlide].dataset.progressPlay = true;

        const thisBar = this.progressBars[currentSlide].querySelector('[data-name="bar"]');

        if(thisBar) {
          if(this.slideElems[currentSlide].dataset.slideType === 'slide_link') {
            thisBar.classList.add('bg-page');
          }
          else {
            thisBar.classList.add('bg-body');
          }
        }
      }
      else if(this.progressBars.length === 1) {
        // There is one progress bar for the whole slider.
        const globalBar = this.progressBars[0];

        globalBar.dataset.progressPlay = true;

        if(globalBar.dataset.steps && globalBar.dataset.steps > 1) {
          globalBar.dataset.currentStep = currentSlide + 1;
        }
      }

      // If neither of these conditions are met, the markup needs revisiting!
    }

    if(this.scheme && this.counterWraps.length) {
      this.nextArrows.forEach(next => next.classList.remove('opacity-0'));
      this.prevArrows.forEach(prev => prev.classList.remove('opacity-0'));
      this.counterWraps.forEach(wrap => wrap.classList.remove('opacity-0'));
    }

    // Remove any peep-mode animations so the text box is always slightly out of view.
    if(this.isPeep) {
      this.slideElems.forEach((elem) => {
        const hasText = elem.querySelector('[data-name="peep-text"]');
        if(hasText) {
          hasText.style['transform'] = '';
          hasText.style['transition'] = '';
          hasText.style['cursor'] = '';
          hasText.style['left'] = '';
        }
      });
    }

    if(window.eight.eventsEngine) {
      window.eight.eventsEngine.emit(`${window.eight.constants.events["ARMADA:SLIDER:CHANGE"]}`, {
        slider: this,
        visibleSlides: this.visibleSlides,
        atEnd: this.atEnd(),
        atStart: this.atStart(),
        currentSlide: currentSlide
      });
    }

    this.setActive();
  }

  setAutoHeight() {
    if (!this.isAutoHeight) return;

    // The <li>s will all have the same height due to flex, so check the content height.
    const currentSlideElem = this.slideElems[this.currentSlide];
    const activeSlideContent = currentSlideElem.querySelector('div:not([hidden])');
    const activeSlideHeight = activeSlideContent.offsetHeight;
    const hasHeight = currentSlideElem.style.height ? true : false

    if(this.isMobile) {
      this.slideElems.forEach(slideElem => slideElem.style.height = `${activeSlideHeight}px`);
    }
    else if(hasHeight) {
      this.slideElems.forEach(slideElem => slideElem.style.height = '');
    }
  }

  resolveVisibleSlides() {
    const visibleSlidesAttr = this.getAttribute('visible-slides');

    // visible-slides:
    // Integer = Always that number visible. Slides will shrink when viewport shrinks.
    // Object = Display X slides at Y Tailwind breakpoint. { "s": 2, "lg": 4, "xl": 6 }.
    // Null = Sets visibleSlides to 0. Initial layout should be taken care of in liquid.

    this.visibleSlides = 1;

    if(!visibleSlidesAttr) {
      // Variable dimension slides.
      this.visibleSlides = 0;
    }
    else if(typeof visibleSlidesAttr === 'number') {
      this.visibleSlides = parseInt(visibleSlidesAttr);
    }
    else {
      const visibleObject = window.eight.safeJSONParse(this.getAttribute('visible-slides'));
      if(!visibleObject) return;

      if(typeof visibleObject === 'object') {
        const currentBreakpoint = window.eight.getCurrentBreakpoint();
        let currentSlides = 1;

        // If we're below all of the breakpoints, fall back to a single slide.
        if(currentBreakpoint !== '') {

          // If we're at 'X' breakpoint and there is no match in visibleObject,
          // pick the next screen size down.
          if(!visibleObject[currentBreakpoint]) {
            const breakpointPxValue = window.eight.getBreakpointValue(currentBreakpoint);

            const nextBreakpoint = Object.keys(visibleObject).reduce((a, b) => {
              const aPxValue = window.eight.getBreakpointValue(a);
              const bPxValue = window.eight.getBreakpointValue(b);

              const aDiff = Math.abs(aPxValue - breakpointPxValue);
              const bDiff = Math.abs(bPxValue - breakpointPxValue);

              if (aDiff === bDiff) {
                  return a > b ? a : b;
              } else {
                  return bDiff < aDiff ? b : a;
              }
            });

            currentSlides = parseInt(visibleObject[nextBreakpoint]);
          }
          else {
            currentSlides = parseInt(visibleObject[currentBreakpoint]);
          }
        }

        this.visibleSlides = currentSlides;
      }
    }

    return;
  }

  // Getters.
  get aspectRatio() {
    return this.getAttribute('aspect');
  }

  get pid() {
    return this.getAttribute('product-id') ? parseInt(this.getAttribute('product-id')) : false;
  }

  get featuredImageId() {
    return this.getAttribute('featured-image-id') ? parseInt(this.getAttribute('featured-image-id')) : false;
  }

  get scopeId() {
    return this.getAttribute('scope-id');
  }

  get toDrag() {
    return this.isPeep ? this.slideElems[this.currentSlide].querySelector('[data-name="peep-text"]') : this.sliderFrame;
  }

  get isPeep() {
    return this.mode === 'peep' && this.isMobile;
  }

  get isMobile() {
    return window.eight.getCurrentBreakpoint() === 'sm' || window.eight.getCurrentBreakpoint() === 'md';
  }

  get isVertical() {
    return this.mode === 'vertical';
  }

  get isHorizontal() {
    return !this.isVertical;
  }

  get isAutoHeight() {
    return this.getAttribute('auto-height') === 'true' && this.isHorizontal && this.getAttribute('visible-slides') == 1;
  }

  get autoplay() {
    return this.getAttribute('autoplay') === 'true';
  }

  get animationDuration() {
    const animationDurationVar = getComputedStyle(document.documentElement).getPropertyValue('--slider-animation-duration');
    return animationDurationVar ? animationDurationVar.split('ms')[0] : 300;
  }

  get slideDuration() {
    return this.getAttribute('slide-duration') ? parseInt(this.getAttribute('slide-duration')) : 1000;
  }

  get loop() {
    return this.getAttribute('loop');
  }

  get arrows() {
    return this.getAttribute('arrows') === 'true';
  }

  get counter() {
    return this.getAttribute('counter') === 'true';
  }

  get grabCursor() {
    return this.getAttribute('grab-cursor') === 'true';
  }

  get mobileIndicator() {
    return this.getAttribute('mobile-indicator') === 'true';
  }

  get mode() {
    return this.getAttribute('mode') ? this.getAttribute('mode') : false;
  }

  get blocks() {
    return this.getAttribute('blocks') === 'true';
  }

  get match() {
    const match = this.getAttribute('match') ? this.getAttribute('match') : false;

    if(match) {
      return document.querySelector(match);
    }

    return false;
  }

  get scrollBars() {
    // Scroll bar = show the current position of the slider.
    // A visual representation of 'you are on slide X of Y'. Used for the slider globally.
    const bars = this.querySelectorAll('scroll-bar');
    if(bars && bars.length > 0) return bars;
    return false;
  }

  get progressBars() {
    // Progress bar = display the time left for the current slide.
    // Animates a bar based on time interval. Mainly used per-slide, but can be used globally
    // using the 'steps' attribute to show both slider position and time left to view current
    // slide.
    const bars = this.querySelectorAll('progress-bar');
    if(bars && bars.length > 0) return bars;
    return false;
  }

  get noInit() {
    // If 'load' is FALSE we don't want to initialise straight away, a component may wish to
    // delay loading of its slider.

    const attr = this.getAttribute('load');
    return attr && attr === 'false';
  }

  disconnectedCallback() {
    this.detachEvents();
  }
}

customElements.define('slider-engine', sliderEngine);

})();

/******/ })()
;