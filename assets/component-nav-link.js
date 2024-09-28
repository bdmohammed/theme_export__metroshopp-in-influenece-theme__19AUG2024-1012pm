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
class NavLink extends HTMLElement {
  constructor() {
    super();

    // Hoverintent config.
    this.currX = 0;
    this.currY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.interval = 100;
    this.sensitivity = 3; // Distance must be below this to trigger hoverintent.
  }

  connectedCallback() {
    this.attachEvents();
  }

  attachEvents() {
    this.addEventListener('mouseenter', this.mouseEnterHandler.bind(this));
    this.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this));
    this.addEventListener('focus', this.mouseEnterHandler.bind(this));
    this.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
  }

  closeAll() {
    window.eight.eventsEngine.emit(`${eight.constants.events["ARMADA:NAVIGATION:DROPDOWN:CLOSE"]}`);
  }

  mouseEnterHandler(ev) {
    // Set initial entry position
    this.prevX = ev.pageX;
    this.prevY = ev.pageY;

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
      this.closeAll();
    }
    else {
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
  }

  mouseLeaveHandler(ev) {
    clearTimeout(this.pollTimer);
  }
}

customElements.define('nav-link', NavLink);

/******/ })()
;