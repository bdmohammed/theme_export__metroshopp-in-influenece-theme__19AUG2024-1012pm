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
class Model extends HTMLElement {
  constructor() {
    super();

    if (!this.button) return;
  }

  connectedCallback() {
    this.button.addEventListener('click', this.loadModel.bind(this));
  }

  async loadModel() {
    this.setPadding();
    this.pauseAll();

    if (!this.getAttribute('loaded')) {
      await this.moveModelIntoDOM();
      this.setAttribute('loaded', true);
      this.loadViewerUI();
    }
  }

  loadViewerUI() {
    window.Shopify.loadFeatures(
      [
        {
          name: 'model-viewer-ui',
          version: '1.0',
        },
      ],
      function () {
        this.controller = new Shopify.ModelViewerUI(this.querySelector('model-viewer'));

        // Don't interact with the rest of the page when model is active.
        this.controller.viewer.parentElement.addEventListener('mouseup', function (e) { e.stopPropagation = function () {} }.bind(this), { capture: true });

        // Prevent activating the viewer right after it was paused when clicked
        // in position of the button.
        this.controller.elements.controlButton.addEventListener('click', function (e) { e.stopImmediatePropagation() }.bind(this), { capture: true });

        window.ProductModel.loadShopifyXR();
      }.bind(this)
    );
  }

  async moveModelIntoDOM() {
    const content = document.createElement('div');
    content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
    const newContent = content.querySelector('model-viewer');
    this.appendChild(newContent);
    this.querySelector('model-viewer')?.focus();
    return;
  }

  setPadding() {
    const i = this.getBoundingClientRect();
    const aspectRatio = i.width / i.height;
    const padding = (1 / aspectRatio) * 100 + '%';
    this.style.paddingTop = padding;
  }

  pauseAll() {
    document.querySelectorAll('model-viewer').forEach((model) => {
      if (model.modelViewerUI) modelViewerUI.pause();
    });
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this.loadModel);
  }

  get button() {
    return this.querySelector('button[data-action="play"]');
  }
}

window.ProductModel = {
  loadShopifyXR() {
    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: this.setupShopifyXR.bind(this),
      },
    ]);
  },

  setupShopifyXR(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', () =>
        this.setupShopifyXR()
      );
      return;
    }

    document.querySelectorAll('[id^="productModelJSON-"]').forEach((modelJSON) => {
      window.ShopifyXR.addModels(window.eight.safeJSONParse(modelJSON.textContent));
      modelJSON.remove();
    });

    window.ShopifyXR.setupXRElements();
  },
};

window.customElements.define('model-3d', Model);

/******/ })()
;