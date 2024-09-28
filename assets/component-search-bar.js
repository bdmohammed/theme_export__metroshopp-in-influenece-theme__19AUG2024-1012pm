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
class HeaderSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.button = this.querySelector('button[data-aid="header-search-submit-button"]');
    this.searchIcon = this.querySelector('svg.search-icon');
    this.closeIcon = this.querySelector('.close-icon');
  }

  connectedCallback() {
    if (!this.input || !this.button || !this.searchIcon) return;

    this.input.value.length ? this.closeIcon.classList.remove('hidden') : this.closeIcon.classList.add('hidden');

    if (this.input.value.length) {
      this.switchButtonColors();
    } else {
      this.resetButtonColors();
    }

    this.input.addEventListener('input', () => {
      this.input.value.length ? this.closeIcon.classList.remove('hidden') : this.closeIcon.classList.add('hidden');

      if (this.input.value.length) {
        this.switchButtonColors();
      } else {
        this.resetButtonColors();
      }
    });

    ['click', 'keypress'].forEach(ev => {
      this.closeIcon.addEventListener(ev, (e) => {
        if (e.type === 'click' || e.keyCode === 13) {
          this.input.value = '';
          this.input.focus();
          this.closeIcon.classList.add('hidden');
          this.button.classList.remove('bg-body', 'before:bg-page', 'border');
          this.button.classList.add('before:bg-body');
          this.searchIcon.classList.remove('text-page', 'hover:text-body', 'group-hover:text-body');
          this.searchIcon.classList.add('hover:text-page', 'group-hover:text-page');
        }
      });
    });
  }

  switchButtonColors() {
    this.button.classList.remove('before:bg-body');
    this.button.classList.add('bg-body', 'before:bg-page', 'border');
    this.searchIcon.classList.remove('hover:text-page', 'group-hover:text-page');
    this.searchIcon.classList.add('text-page', 'hover:text-body', 'group-hover:text-body');
  }

  resetButtonColors() {
    this.button.classList.add('before:bg-body');
    this.button.classList.remove('bg-body', 'before:bg-page', 'border');
    this.searchIcon.classList.add('hover:text-page', 'group-hover:text-page');
    this.searchIcon.classList.remove('text-page', 'hover:text-body', 'group-hover:text-body');
  }
}

window.customElements.define('search-bar', HeaderSearch);
/******/ })()
;