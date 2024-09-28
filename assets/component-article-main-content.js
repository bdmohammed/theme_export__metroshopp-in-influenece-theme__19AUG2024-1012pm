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
var __webpack_exports__ = {};
class ArticlePagination extends HTMLElement {
	constructor() {
    super();
  }

  connectedCallback() {
    const observerCallback = (watchEntry, observer) => {
      if (!watchEntry[0].isIntersecting && watchEntry[0].intersectionRatio > 0 && watchEntry[0].boundingClientRect.top < 0) {
        this.classList.add('fixed', 'top-0', 'left-0', 'px-3', 'md:px-6', 'z-50', 'py-4', 'shadow-lg');
      } else {
        this.classList.remove('fixed', 'top-0', 'left-0', 'px-3', 'md:px-6', 'z-50', 'py-4', 'shadow-lg');
      }
    }
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1
    }
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    observer.observe(this.parentElement);
  }
}

window.customElements.define('article-pagination', ArticlePagination);

/******/ })()
;