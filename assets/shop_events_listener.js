(() => {
  const createModule = (moduleFactory) => {
    const module = { exports: {} };
    moduleFactory.call(module.exports, module, module.exports);
    return module.exports;
  };

  const defineProperties = (target, props) => {
    for (const prop of props) {
      prop.enumerable = prop.enumerable || false;
      prop.configurable = true;
      if ("value" in prop) prop.writable = true;
      Object.defineProperty(target, prop.key, prop);
    }
  };

  const classCallCheck = (instance, Constructor) => {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  const toArray = (iterable) => {
    return Array.isArray(iterable) ? [...iterable] : Array.from(iterable);
  };

  createModule((module, exports) => {
    "use strict";

    const handleBulkItemCartAddResponse = (payload, response) => {
      if (payload.length !== response.length) {
        throw Error("Payload body and response have different number of items");
      }
      payload.forEach((item, index) => {
        let quantity = 1;
        try {
          quantity = parseInt(response[index].quantity, 10) || 1;
        } catch (error) {
          console?.warn(
            `[shop_events_listener] Error in handleBulkItemCartAddResponse: ${error.message}`,
          );
        }
        addItemToCart(item, quantity);
      });
    };

    const parsePayload = (queryString, expectedLength) => {
      const parsed = Array.from({ length: expectedLength }, () => ({}));
      const params = decodeURI(queryString).split("&");

      params.forEach((param) => {
        const [key, value] = param.split("=");
        const match = key.match(/items\[(\d+)\]\[(\w+)\].*/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (field === "quantity") {
            parsed[index].quantity = value;
          } else if (field === "id") {
            parsed[index].id = value;
          }
        }
      });

      return parsed;
    };

    const getQuantityFromInput = (input) => {
      if (!input) return 1;
      try {
        return JSON.parse(input).quantity || 1;
      } catch {
        if (input instanceof FormData) {
          return input.get("quantity") || 1;
        }
        const params = input.split("&");
        for (const param of params) {
          const [key, value] = param.split("=");
          if (key === "quantity") return value;
        }
      }
      return 1;
    };

    const addItemToCart = (item, quantity) => {
      const cartToken = getCookieValue("cart");
      const eventData = {
        variantId: String(item.id),
        productId: item.product_id,
        currency: window.ShopifyAnalytics.meta.currency,
        quantity: String(quantity || 1),
        price: item.presentment_price,
        name: item.title,
        sku: item.sku,
        brand: item.vendor,
        variant: item.variant_title,
        category: item.product_type,
        ...getPageMetaData(),
      };

      window.ShopifyAnalytics.lib.track("Added Product", {
        cartToken,
        ...eventData,
      });
      window.ShopifyAnalytics.lib.track(
        "monorail://trekkie_storefront_track_added_product/1.1",
        {
          referer: window.location.href,
          ...eventData,
        },
      );
    };

    const getPageMetaData = () => {
      if (window.ShopifyAnalytics.meta.page) {
        return {
          pageType: window.ShopifyAnalytics.meta.page.pageType,
          resourceType: window.ShopifyAnalytics.meta.page.resourceType,
          resourceId: window.ShopifyAnalytics.meta.page.resourceId,
        };
      }
      return {};
    };

    const mergeObjects = (target, source) => {
      return { ...target, ...source };
    };

    const getCookieValue = (cookieName) => {
      try {
        const regex = new RegExp(`(${cookieName})=([^;]+)`);
        const match = regex.exec(document.cookie);
        return match ? unescape(match[2]) : null;
      } catch {
        return null;
      }
    };

    class XHRHandler {
      constructor(xhr, url, method, body) {
        classCallCheck(this, XHRHandler);
        this.xhr = xhr;
        this.url = url;
        this.method = method;
        this.body = body;
      }

      static handleXhrOpen() {}

      onReadyStateChange() {
        if (this.xhr.readyState === XMLHttpRequest.DONE) {
          XHRHandler.handleXhrDone({
            method: this.method,
            url: this.url,
            body: this.body,
            xhr: this.xhr,
          });
          if (this.oldOnReadyStateChange) {
            this.oldOnReadyStateChange();
          }
        }
      }

      static async handleXhrDone({ method, url, body, xhr }) {
        try {
          const link = document.createElement("a");
          link.href = url;
          const pathname = link.pathname || url;
          if (XHRHandler.ADD_TO_CART_REGEX.test(pathname)) {
            const responsePayload =
              xhr.response instanceof Blob
                ? await parseBlobToJson(xhr.response)
                : xhr.responseText;

            if (responsePayload) {
              const parsedResponse = JSON.parse(responsePayload);
              if (parsedResponse.items && parsedResponse.items.length) {
                handleBulkItemCartAddResponse(
                  parsedResponse.items,
                  parsedResponse.items,
                );
              } else {
                addItemToCart(parsedResponse, getQuantityFromInput(body));
              }
            }
          }
        } catch (error) {
          console?.warn(
            `[shop_events_listener] Error in handleXhrDone: ${error.message}`,
          );
        }
      }

      static async parseBlobToJson(blob) {
        const fileReader = new FileReader();
        return new Promise((resolve) => {
          fileReader.onloadend = () => {
            const json = JSON.parse(
              String.fromCharCode.apply(
                String,
                toArray(new Uint8Array(fileReader.result)),
              ),
            );
            resolve(json);
          };
          fileReader.readAsArrayBuffer(blob);
        });
      }
    }

    XHRHandler.ADD_TO_CART_REGEX =
      /^(?:\/[a-zA-Z]+(?:-[a-zA-Z]+)?)?\/cart\/add(?:\.js|\.json)?$/;

    exports.default = XHRHandler;

    const setupEventListeners = () => {
      const attachEvent = (element, eventType, callback) => {
        if (window.jQuery && window.jQuery(element).bind) {
          window.jQuery(element).bind(eventType, callback);
        } else if (element.addEventListener) {
          element.addEventListener(eventType, callback);
        } else if (element.attachEvent) {
          element.attachEvent(`on${eventType}`, callback);
        }
      };

      const handleSubmitCartAdd = (event) => {
        const { target } = event;
        if (
          !(
            event.defaultPrevented ||
            (event.isDefaultPrevented && event.isDefaultPrevented())
          )
        ) {
          const action =
            target.getAttribute("action") || target.getAttribute("href");
          if (action) {
            try {
              let selectedOption;
              const id = target.id || target.elements.id;
              selectedOption = id.options ? id.options[id.selectedIndex] : id;
              const cartToken = getCookieValue("cart");
              const cartData = parseCartItem(selectedOption.value);
              cartData.quantity = String(
                target.quantity ? target.quantity.value : 1,
              );
              const eventData = {
                cartToken,
                ...cartData,
              };

              window.ShopifyAnalytics.lib.track("Added Product", eventData);
              window.ShopifyAnalytics.lib.track(
                "monorail://trekkie_storefront_track_added_product/1.1",
                eventData,
              );
            } catch (error) {
              console?.warn(
                `[shop_events_listener] Error in handleSubmitCartAdd: ${error.message}`,
              );
            }
          }
        }
      };

      const handlePaymentAdd = (event) => {
        const { target } = event;
        if (
          target &&
          target.getAttribute("action") &&
          target.getAttribute("data-payment-form")
        ) {
          try {
            window.ShopifyAnalytics.lib.track("Added Payment", {
              currency: window.ShopifyAnalytics.meta.currency,
              total: window.ShopifyAnalytics.meta.checkout.payment_due / 100,
            });
          } catch (error) {
            console?.warn(
              `[shop_events_listener] Error in handleSubmitToPaymentAdd: ${error.message}`,
            );
          }
        }
      };

      const trackViewedProductVariant = (event) => {
        const { currentTarget } = event;
        try {
          const id = currentTarget.id || currentTarget.elements.id;
          const selectedOption =
            id.options && id.options[id.selectedIndex]
              ? id.options[id.selectedIndex]
              : id;
          const variantData = parseCartItem(selectedOption.value);

          window.ShopifyAnalytics.lib.track("Viewed Variant", {
            variantId: String(variantData.id),
            productId: variantData.product_id,
            name: variantData.title,
            price: variantData.presentment_price,
            ...getPageMetaData(),
          });
        } catch (error) {
          console?.warn(
            `[shop_events_listener] Error in trackViewedProductVariant: ${error.message}`,
          );
        }
      };

      const trackProductAddedToCart = (event) => {
        const { currentTarget } = event;
        const isAddToCartButton =
          currentTarget.classList.contains("btn-add-to-cart");
        if (isAddToCartButton) {
          handleSubmitCartAdd(event);
        }
      };

      const forms = document.querySelectorAll("form[action$='/cart/add']");
      forms.forEach((form) =>
        attachEvent(form, "submit", trackProductAddedToCart),
      );

      const paymentForms = document.querySelectorAll("[data-payment-form]");
      paymentForms.forEach((form) =>
        attachEvent(form, "submit", handlePaymentAdd),
      );

      const productVariants = document.querySelectorAll(".variant-selector");
      productVariants.forEach((variant) =>
        attachEvent(variant, "change", trackViewedProductVariant),
      );
    };

    setupEventListeners();
  });
})();
