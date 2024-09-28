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
class CommentPagination extends HTMLElement {
	constructor() {
    super();

    this.prevBtn = this.querySelector('[data-armada-selector="previous_comment"]');
    this.nextBtn = this.querySelector('[data-armada-selector="next_comment"]');
    this.sectionId = 'section-article-comments';
    this.selector = '[data-armada-selector="comment_wrapper"]';
  }

  connectedCallback() {
    this.setListeners();
  }

  setListeners() {
    ['click', 'keypress'].forEach(ev => {
      if (this.prevBtn) this.prevBtn.addEventListener(ev, this.fetchPrevComments.bind(this));
      if (this.nextBtn) this.nextBtn.addEventListener(ev, this.fetchNextComments.bind(this));
    });
  }

  fetchPrevComments() {
    window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(this.prevBtn.dataset.prevUrl, [this.sectionId], [this.parentElement], [this.selector], this.showContent.bind(this));
  }

  fetchNextComments() {
    window.eight.sectionsEngine.sectionRenderingEngine.fetchSection(this.nextBtn.dataset.nextUrl, [this.sectionId], [this.parentElement], [this.selector], this.showContent.bind(this));
  }

  showContent(data) {
    if (!data) return;
  }
}

window.customElements.define('article-comments', CommentPagination);
/******/ })()
;