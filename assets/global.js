window.T4SThemeSP = {};
var isStorageSpSession = false;
var isStorageSpSessionAll = false;
var isStorageSpdLocal = false;
var isStorageSpdLocalAll = false;
var IsDesignMode = window.T4Srequest.design_mode;
var isThemeRTL = 'rtl' == document.documentElement.getAttribute('dir');
var T4stt_var = {
  HoverInterval: 35,
  HoverTimeout: 150,
  dragThreshold: 10,
  prevOnHref: false,
};

!(function (window) {
  'use strict';
  const getScreenResolutions = () => {
    const width = screen.width || '';
    const height = screen.height || '';
    return `${width} x ${height}`;
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = navigator.appName;
    let browserVersion = '' + parseFloat(navigator.appVersion);
    let browserMajorVersion = parseInt(navigator.appVersion, 10);

    const browsers = [
      { name: 'Opera', regex: /Opera|OPR/ },
      { name: 'Edge', regex: /Edge/ },
      { name: 'Internet Explorer', regex: /MSIE|Trident/ },
      { name: 'Chrome', regex: /Chrome/ },
      { name: 'Safari', regex: /Safari/ },
      { name: 'Firefox', regex: /Firefox/ },
    ];

    for (const { name, regex } of browsers) {
      const match = userAgent.match(regex);
      if (match) {
        browserName = name;
        const versionIndex = userAgent.indexOf(match[0]) + match[0].length;
        browserVersion = userAgent
          .substring(versionIndex)
          .split(' ')[0]
          .replace('/', '');
        break;
      }
    }

    browserMajorVersion =
      parseInt(browserVersion.split('.')[0], 10) || browserMajorVersion;

    return { browser: browserName, browserVersion, browserMajorVersion };
  };

  const getOperatingSystem = () => {
    const osList = [
      { name: 'Windows 10', regex: /(Windows 10.0|Windows NT 10.0)/ },
      { name: 'Windows 8.1', regex: /(Windows 8.1|Windows NT 6.3)/ },
      { name: 'Windows 8', regex: /(Windows 8|Windows NT 6.2)/ },
      { name: 'Windows 7', regex: /(Windows 7|Windows NT 6.1)/ },
      { name: 'Windows Vista', regex: /Windows NT 6.0/ },
      { name: 'Windows Server 2003', regex: /Windows NT 5.2/ },
      { name: 'Windows XP', regex: /(Windows NT 5.1|Windows XP)/ },
      { name: 'Windows 2000', regex: /(Windows NT 5.0|Windows 2000)/ },
      { name: 'Android', regex: /Android/ },
      { name: 'Linux', regex: /(Linux|X11)/ },
      { name: 'iOS', regex: /(iPhone|iPad|iPod)/ },
      { name: 'Mac OS X', regex: /Mac OS X/ },
      { name: 'Mac OS', regex: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { name: 'QNX', regex: /QNX/ },
      { name: 'UNIX', regex: /UNIX/ },
    ];

    const { userAgent } = navigator;
    for (const { name, regex } of osList) {
      if (regex.test(userAgent)) {
        return name;
      }
    }

    return 'Unknown OS';
  };

  const isMobileDevice = () => {
    const mobileRegex = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/;
    return mobileRegex.test(navigator.userAgent);
  };

  const getFlashVersion = () => {
    if (typeof swfobject !== 'undefined' && swfobject.getFlashPlayerVersion) {
      const { major, minor, release } = swfobject.getFlashPlayerVersion();
      return major > 0 ? `${major}.${minor} r${release}` : 'Not Installed';
    }
    return 'No Flash';
  };

  const systemInfo = {
    screen: getScreenResolutions(),
    ...getBrowserInfo(),
    os: getOperatingSystem(),
    mobile: isMobileDevice(),
    flashVersion: getFlashVersion(),
    osVersion: '-',
  };

  // Expose the system information in a global variable
  window.jscd = systemInfo;
})(window);

var jsBdT4s = document.getElementsByTagName('HTML')[0];
var RtlT4s = jsBdT4s.classList.contains('rtl_true');
var LtrT4s = !RtlT4s;

((global, factory) => {
  'use strict';

  // AMD module definition
  if (typeof define === 'function' && define.amd) {
    define('jQuery_T4NT-bridget/jQuery_T4NT-bridget', ['jQuery_T4NT'], (i) =>
      factory(global, i));
  }
  // CommonJS module definition
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(global, require('jQuery_T4NT'));
  }
  // Global definition for browsers
  else {
    global.jQuery_T4NTBridget = factory(global, global.$ || global.jQuary);
  }
})(window, (global, $) => {
  'use strict';

  // Bridget function - allows jQuery plugins to be defined
  const bridget = (pluginName, PluginClass, jquery = $) => {
    if (!jquery) return;

    // Add an option method if PluginClass doesn't have it
    if (!PluginClass.prototype.option) {
      PluginClass.prototype.option = (options) => {
        if (jquery.isPlainObject(options)) {
          this.options = jquery.extend(true, this.options, options);
        }
      };
    }

    // Extend jQuery with the plugin
    jquery.fn[pluginName] = function (arg) {
      if (typeof arg === 'string') {
        // Handle method calls on plugin instances
        return callPluginMethod(
          this,
          pluginName,
          arg,
          Array.prototype.slice.call(arguments, 1)
        );
      } else {
        // Initialize the plugin or update its options
        return initPlugin(this, pluginName, PluginClass, arg);
      }
    };

    // Register `bridget` globally if not already defined
    registerBridget(jquery);
  };

  // Handle method calls on plugin instances
  const callPluginMethod = (elements, pluginName, methodName, args) => {
    let returnValue;

    elements.each((index, element) => {
      const instance = $.data(element, pluginName);
      if (!instance) {
        logError(
          `${pluginName} not initialized. Cannot call methods like ${methodName}.`
        );
        return;
      }

      const method = instance[methodName];
      if (!method || methodName.charAt(0) === '_') {
        logError(`${methodName} is not a valid method for ${pluginName}.`);
        return;
      }

      const result = method.apply(instance, args);
      returnValue = returnValue === undefined ? result : returnValue;
    });

    return returnValue !== undefined ? returnValue : elements;
  };

  // Initialize the plugin or update its options
  const initPlugin = (elements, pluginName, PluginClass, options) => {
    elements.each((index, element) => {
      let instance = $.data(element, pluginName);
      if (instance) {
        instance.option(options);
        instance._init();
      } else {
        instance = new PluginClass(element, options);
        $.data(element, pluginName, instance);
      }
    });

    return elements;
  };

  // Register the Bridget function globally if it doesn't exist
  const registerBridget = ($) => {
    if (!$ || $.bridget) return;
    $.bridget = bridget;
  };

  // Utility function to log errors
  const logError = (message) => {
    if (global.console && global.console.error) {
      global.console.error(message);
    }
  };

  // Register Bridget with jQuery_T4NT if available
  registerBridget($);

  // Return the Bridget function
  return bridget;
});
/**
 * EvEmitter v2.1.1
 * Lil' event emitter
 * MIT License
 */

(function (global, factory) {
  'use strict';

  // universal module definition
  if (typeof module == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }
})(typeof window != 'undefined' ? window : this, function () {
  'use strict';

  function EvEmitter() {}

  let proto = EvEmitter.prototype;

  proto.on = function (eventName, listener) {
    if (!eventName || !listener) return this;

    // set events hash
    let events = (this._events = this._events || {});
    // set listeners array
    let listeners = (events[eventName] = events[eventName] || []);
    // only add once
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }

    return this;
  };

  proto.once = function (eventName, listener) {
    if (!eventName || !listener) return this;

    // add event
    this.on(eventName, listener);
    // set once flag
    // set onceEvents hash
    let onceEvents = (this._onceEvents = this._onceEvents || {});
    // set onceListeners object
    let onceListeners = (onceEvents[eventName] = onceEvents[eventName] || {});
    // set flag
    onceListeners[listener] = true;

    return this;
  };

  proto.off = function (eventName, listener) {
    let listeners = this._events && this._events[eventName];
    if (!listeners || !listeners.length) return this;

    let index = listeners.indexOf(listener);
    if (index != -1) {
      listeners.splice(index, 1);
    }

    return this;
  };

  proto.emitEvent = function (eventName, args) {
    let listeners = this._events && this._events[eventName];
    if (!listeners || !listeners.length) return this;

    // copy over to avoid interference if .off() in listener
    listeners = listeners.slice(0);
    args = args || [];
    // once stuff
    let onceListeners = this._onceEvents && this._onceEvents[eventName];

    for (let listener of listeners) {
      let isOnce = onceListeners && onceListeners[listener];
      if (isOnce) {
        // remove listener
        // remove before trigger to prevent recursion
        this.off(eventName, listener);
        // unset once flag
        delete onceListeners[listener];
      }
      // trigger listener
      listener.apply(this, args);
    }

    return this;
  };

  proto.allOff = function () {
    delete this._events;
    delete this._onceEvents;
  };

  return EvEmitter;
});

/*!
 * Infinite Scroll v2.0.4
 * measure size of elements
 * MIT license
 */

(function (window, factory) {
  'use strict';

  if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }
})(window, function factory() {
  'use strict';

  // -------------------------- helpers -------------------------- //

  // get a number from a string, not a percentage
  function getStyleSize(value) {
    let num = parseFloat(value);
    // not a percent like '100%', and a number
    let isValid = value.indexOf('%') == -1 && !isNaN(num);
    return isValid && num;
  }

  // -------------------------- measurements -------------------------- //

  let measurements = [
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth',
  ];

  let measurementsLength = measurements.length;

  function getZeroSize() {
    let size = {
      width: 0,
      height: 0,
      innerWidth: 0,
      innerHeight: 0,
      outerWidth: 0,
      outerHeight: 0,
    };
    measurements.forEach((measurement) => {
      size[measurement] = 0;
    });
    return size;
  }

  // -------------------------- getSize -------------------------- //

  function getSize(elem) {
    // use querySeletor if elem is string
    if (typeof elem == 'string') elem = document.querySelector(elem);

    // do not proceed on non-objects
    let isElement = elem && typeof elem == 'object' && elem.nodeType;
    if (!isElement) return;

    let style = getComputedStyle(elem);

    // if hidden, everything is 0
    if (style.display == 'none') return getZeroSize();

    let size = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;

    let isBorderBox = (size.isBorderBox = style.boxSizing == 'border-box');

    // get all measurements
    measurements.forEach((measurement) => {
      let value = style[measurement];
      let num = parseFloat(value);
      // any 'auto', 'medium' value will be 0
      size[measurement] = !isNaN(num) ? num : 0;
    });

    let paddingWidth = size.paddingLeft + size.paddingRight;
    let paddingHeight = size.paddingTop + size.paddingBottom;
    let marginWidth = size.marginLeft + size.marginRight;
    let marginHeight = size.marginTop + size.marginBottom;
    let borderWidth = size.borderLeftWidth + size.borderRightWidth;
    let borderHeight = size.borderTopWidth + size.borderBottomWidth;

    // overwrite width and height if we can get it from style
    let styleWidth = getStyleSize(style.width);
    if (styleWidth !== false) {
      size.width =
        styleWidth +
        // add padding and border unless it's already including it
        (isBorderBox ? 0 : paddingWidth + borderWidth);
    }

    let styleHeight = getStyleSize(style.height);
    if (styleHeight !== false) {
      size.height =
        styleHeight +
        // add padding and border unless it's already including it
        (isBorderBox ? 0 : paddingHeight + borderHeight);
    }

    size.innerWidth = size.width - (paddingWidth + borderWidth);
    size.innerHeight = size.height - (paddingHeight + borderHeight);

    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;

    return size;
  }

  return getSize;
});

/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

(function (window, factory) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }
})(window, function factory() {
  'use strict';

  var matchesMethod = (function () {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if (ElemProto.matches) {
      return 'matches';
    }
    // check un-prefixed
    if (ElemProto.matchesSelector) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if (ElemProto[method]) {
        return method;
      }
    }
  })();

  return function matchesSelector(elem, selector) {
    return elem[matchesMethod](selector);
  };
});

/**
 * Fizzy UI utils v3.0.0
 * MIT license
 */

(function (global, factory) {
  'use strict';

  // universal module definition
  if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(global);
  } else {
    // browser global
    global.fizzyUIUtils = factory(global);
  }
})(window, function factory(global) {
  'use strict';

  let utils = {};

  // ----- extend ----- //

  // extends objects
  utils.extend = function (a, b) {
    return Object.assign(a, b);
  };

  // ----- modulo ----- //

  utils.modulo = function (num, div) {
    return ((num % div) + div) % div;
  };

  // ----- makeArray ----- //

  // turn element or nodeList into an array
  utils.makeArray = function (obj) {
    // use object if already an array
    if (Array.isArray(obj)) return obj;

    // return empty array if undefined or null. #6
    if (obj === null || obj === undefined) return [];

    let isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
    // convert nodeList to array
    if (isArrayLike) return [...obj];

    // array of single index
    return [obj];
  };

  // ----- removeFrom ----- //

  utils.removeFrom = function (ary, obj) {
    let index = ary.indexOf(obj);
    if (index != -1) {
      ary.splice(index, 1);
    }
  };

  // ----- getParent ----- //

  utils.getParent = function (elem, selector) {
    while (elem.parentNode && elem != document.body) {
      elem = elem.parentNode;
      if (elem.matches(selector)) return elem;
    }
  };

  // ----- getQueryElement ----- //

  // use element as selector string
  utils.getQueryElement = function (elem) {
    if (typeof elem == 'string') {
      return document.querySelector(elem);
    }
    return elem;
  };

  // ----- handleEvent ----- //

  // enable .ontype to trigger from .addEventListener( elem, 'type' )
  utils.handleEvent = function (event) {
    let method = 'on' + event.type;
    if (this[method]) {
      this[method](event);
    }
  };

  // ----- filterFindElements ----- //

  utils.filterFindElements = function (elems, selector) {
    // make array of elems
    elems = utils.makeArray(elems);

    return (
      elems
        // check that elem is an actual element
        .filter((elem) => elem instanceof HTMLElement)
        .reduce((ffElems, elem) => {
          // add elem if no selector
          if (!selector) {
            ffElems.push(elem);
            return ffElems;
          }
          // filter & find items if we have a selector
          // filter
          if (elem.matches(selector)) {
            ffElems.push(elem);
          }
          // find children
          let childElems = elem.querySelectorAll(selector);
          // concat childElems to filterFound array
          ffElems = ffElems.concat(...childElems);
          return ffElems;
        }, [])
    );
  };

  // ----- debounceMethod ----- //

  utils.debounceMethod = function (_class, methodName, threshold) {
    threshold = threshold || 100;
    // original method
    let method = _class.prototype[methodName];
    let timeoutName = methodName + 'Timeout';

    _class.prototype[methodName] = function () {
      clearTimeout(this[timeoutName]);

      let args = arguments;
      this[timeoutName] = setTimeout(() => {
        method.apply(this, args);
        delete this[timeoutName];
      }, threshold);
    };
  };

  // ----- docReady ----- //

  utils.docReady = function (onDocReady) {
    let readyState = document.readyState;
    if (readyState == 'complete' || readyState == 'interactive') {
      // do async to allow for other scripts to run. metafizzy/flickity#441
      setTimeout(onDocReady);
    } else {
      document.addEventListener('DOMContentLoaded', onDocReady);
    }
  };

  // ----- htmlInit ----- //

  // http://bit.ly/3oYLusc
  utils.toDashed = function (str) {
    return str
      .replace(/(.)([A-Z])/g, function (match, $1, $2) {
        return $1 + '-' + $2;
      })
      .toLowerCase();
  };

  let console = global.console;

  // allow user to initialize classes via [data-namespace] or .js-namespace class
  // htmlInit( Widget, 'widgetName' )
  // options are parsed from data-namespace-options
  utils.htmlInit = function (WidgetClass, namespace) {
    utils.docReady(function () {
      let dashedNamespace = utils.toDashed(namespace);
      let dataAttr = 'data-' + dashedNamespace;
      let dataAttrElems = document.querySelectorAll(`[${dataAttr}]`);
      let jQuery = global.jQuery;

      [...dataAttrElems].forEach((elem) => {
        let attr = elem.getAttribute(dataAttr);
        let options;
        try {
          options = attr && JSON.parse(attr);
        } catch (error) {
          // log error, do not initialize
          if (console) {
            console.error(
              `Error parsing ${dataAttr} on ${elem.className}: ${error}`
            );
          }
          return;
        }
        // initialize
        let instance = new WidgetClass(elem, options);
        // make available via $().data('namespace')
        if (jQuery) {
          jQuery.data(elem, namespace, instance);
        }
      });
    });
  };

  // -----  ----- //

  return utils;
});

/**
 * Outlayer Item
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD - RequireJS
    define(['ev-emitter/ev-emitter', 'get-size/get-size'], factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(require('ev-emitter'), require('get-size'));
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
  }
})(window, function factory(EvEmitter, getSize) {
  'use strict';

  // ----- helpers ----- //

  function isEmptyObj(obj) {
    for (var prop in obj) {
      return false;
    }
    prop = null;
    return true;
  }

  // -------------------------- CSS3 support -------------------------- //

  var docElemStyle = document.documentElement.style;

  var transitionProperty =
    typeof docElemStyle.transition == 'string'
      ? 'transition'
      : 'WebkitTransition';
  var transformProperty =
    typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

  var transitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    transition: 'transitionend',
  }[transitionProperty];

  // cache all vendor properties that could have vendor prefix
  var vendorProperties = {
    transform: transformProperty,
    transition: transitionProperty,
    transitionDuration: transitionProperty + 'Duration',
    transitionProperty: transitionProperty + 'Property',
    transitionDelay: transitionProperty + 'Delay',
  };

  // -------------------------- Item -------------------------- //

  function Item(element, layout) {
    if (!element) {
      return;
    }

    this.element = element;
    // parent layout class, $window.e. Masonry, Isotope, or Packery
    this.layout = layout;
    this.position = {
      x: 0,
      y: 0,
    };

    this._create();
  }

  // inherit EvEmitter
  var proto = (Item.prototype = Object.create(EvEmitter.prototype));
  proto.constructor = Item;

  proto._create = function () {
    // transition objects
    this._transn = {
      ingProperties: {},
      clean: {},
      onEnd: {},
    };

    this.css({
      position: 'absolute',
    });
  };

  // trigger specified handler for event type
  proto.handleEvent = function (event) {
    var method = 'on' + event.type;
    if (this[method]) {
      this[method](event);
    }
  };

  proto.getSize = function () {
    this.size = getSize(this.element);
  };

  /**
   * apply CSS styles to element
   * @param {Object} style
   */
  proto.css = function (style) {
    var elemStyle = this.element.style;

    for (var prop in style) {
      // use vendor property if available
      var supportedProp = vendorProperties[prop] || prop;
      elemStyle[supportedProp] = style[prop];
    }
  };

  // measure position, and sets it
  proto.getPosition = function () {
    var style = getComputedStyle(this.element);
    var isOriginLeft = LtrT4s;
    var isOriginTop = this.layout._getOption('originTop');
    var xValue = style[isOriginLeft ? 'left' : 'right'];
    var yValue = style[isOriginTop ? 'top' : 'bottom'];
    var x = parseFloat(xValue);
    var y = parseFloat(yValue);
    // convert percent to pixels
    var layoutSize = this.layout.size;
    if (xValue.indexOf('%') != -1) {
      x = (x / 100) * layoutSize.width;
    }
    if (yValue.indexOf('%') != -1) {
      y = (y / 100) * layoutSize.height;
    }
    // clean up 'auto' or other non-integer values
    x = isNaN(x) ? 0 : x;
    y = isNaN(y) ? 0 : y;
    // remove padding from measurement
    x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
    y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

    this.position.x = x;
    this.position.y = y;
  };

  // set settled position, apply padding
  proto.layoutPosition = function () {
    var layoutSize = this.layout.size;
    var style = {};
    var isOriginLeft = LtrT4s;
    var isOriginTop = this.layout._getOption('originTop');

    // x
    var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
    var xProperty = isOriginLeft ? 'left' : 'right';
    var xResetProperty = isOriginLeft ? 'right' : 'left';

    var x = this.position.x + layoutSize[xPadding];
    // set in percentage or pixels
    style[xProperty] = this.getXValue(x);
    // reset other property
    style[xResetProperty] = '';

    // y
    var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
    var yProperty = isOriginTop ? 'top' : 'bottom';
    var yResetProperty = isOriginTop ? 'bottom' : 'top';

    var y = this.position.y + layoutSize[yPadding];
    // set in percentage or pixels
    style[yProperty] = this.getYValue(y);
    // reset other property
    style[yResetProperty] = '';

    this.css(style);
    this.emitEvent('layout', [this]);
  };

  proto.getXValue = function (x) {
    var isHorizontal = this.layout._getOption('horizontal');
    return this.layout.options.percentPosition && !isHorizontal
      ? (x / this.layout.size.width) * 100 + '%'
      : x + 'px';
  };

  proto.getYValue = function (y) {
    var isHorizontal = this.layout._getOption('horizontal');
    return this.layout.options.percentPosition && isHorizontal
      ? (y / this.layout.size.height) * 100 + '%'
      : y + 'px';
  };

  proto._transitionTo = function (x, y) {
    this.getPosition();
    // get current x & y from top/left
    var curX = this.position.x;
    var curY = this.position.y;

    var didNotMove = x == this.position.x && y == this.position.y;

    // save end position
    this.setPosition(x, y);

    // if did not move and not transitioning, just go to layout
    if (didNotMove && !this.isTransitioning) {
      this.layoutPosition();
      return;
    }

    var transX = x - curX;
    var transY = y - curY;
    var transitionStyle = {};
    transitionStyle.transform = this.getTranslate(transX, transY);

    this.transition({
      to: transitionStyle,
      onTransitionEnd: {
        transform: this.layoutPosition,
      },
      isCleaning: true,
    });
  };

  proto.getTranslate = function (x, y) {
    // flip cooridinates if origin on right or bottom
    var isOriginLeft = LtrT4s;
    var isOriginTop = this.layout._getOption('originTop');
    x = isOriginLeft ? x : -x;
    y = isOriginTop ? y : -y;
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  };

  // non transition + transform support
  proto.goTo = function (x, y) {
    this.setPosition(x, y);
    this.layoutPosition();
  };

  proto.moveTo = proto._transitionTo;

  proto.setPosition = function (x, y) {
    this.position.x = parseFloat(x);
    this.position.y = parseFloat(y);
  };

  // ----- transition ----- //

  /**
   * @param {Object} style - CSS
   * @param {Function} onTransitionEnd
   */

  // non transition, just trigger callback
  proto._nonTransition = function (args) {
    this.css(args.to);
    if (args.isCleaning) {
      this._removeStyles(args.to);
    }
    for (var prop in args.onTransitionEnd) {
      args.onTransitionEnd[prop].call(this);
    }
  };

  /**
   * proper transition
   * @param {Object} args - arguments
   *   @param {Object} to - style to transition to
   *   @param {Object} from - style to start transition from
   *   @param {Boolean} isCleaning - removes transition styles after transition
   *   @param {Function} onTransitionEnd - callback
   */
  proto.transition = function (args) {
    // redirect to nonTransition if no transition duration
    if (!parseFloat(this.layout.options.transitionDuration)) {
      this._nonTransition(args);
      return;
    }

    var _transition = this._transn;
    // keep track of onTransitionEnd callback by css property
    for (var prop in args.onTransitionEnd) {
      _transition.onEnd[prop] = args.onTransitionEnd[prop];
    }
    // keep track of properties that are transitioning
    for (prop in args.to) {
      _transition.ingProperties[prop] = true;
      // keep track of properties to clean up when transition is done
      if (args.isCleaning) {
        _transition.clean[prop] = true;
      }
    }

    // set from styles
    if (args.from) {
      this.css(args.from);
      // force redraw. http://blog.alexmaccaw.com/css-transitions
      var h = this.element.offsetHeight;
      // hack for JSHint to hush about unused var
      h = null;
    }
    // enable transition
    this.enableTransition(args.to);
    // set styles that are transitioning
    this.css(args.to);

    this.isTransitioning = true;
  };

  // dash before all cap letters, including first for
  // WebkitTransform => -webkit-transform
  function toDashedAll(str) {
    return str.replace(/([A-Z])/g, function ($1) {
      return '-' + $1.toLowerCase();
    });
  }

  var transitionProps = 'opacity,' + toDashedAll(transformProperty);

  proto.enableTransition = function (/* style */) {
    // HACK changing transitionProperty during a transition
    // will cause transition to jump
    if (this.isTransitioning) {
      return;
    }

    // make `transition: foo, bar, baz` from style object
    // HACK un-comment this when enableTransition can work
    // while a transition is happening
    // var transitionValues = [];
    // for ( var prop in style ) {
    //   // dash-ify camelCased properties like WebkitTransition
    //   prop = vendorProperties[ prop ] || prop;
    //   transitionValues.push( toDashedAll( prop ) );
    // }
    // munge number to millisecond, to match stagger
    var duration = this.layout.options.transitionDuration;
    duration = typeof duration == 'number' ? duration + 'ms' : duration;
    // enable transition styles
    this.css({
      transitionProperty: transitionProps,
      transitionDuration: duration,
      transitionDelay: this.staggerDelay || 0,
    });
    // listen for transition end event
    this.element.addEventListener(transitionEndEvent, this, false);
  };

  // ----- events ----- //

  proto.onwebkitTransitionEnd = function (event) {
    this.ontransitionend(event);
  };

  proto.onotransitionend = function (event) {
    this.ontransitionend(event);
  };

  // properties that I munge to make my life easier
  var dashedVendorProperties = {
    '-webkit-transform': 'transform',
  };

  proto.ontransitionend = function (event) {
    // disregard bubbled events from children
    if (event.target !== this.element) {
      return;
    }
    var _transition = this._transn;
    // get property name of transitioned property, convert to prefix-free
    var propertyName =
      dashedVendorProperties[event.propertyName] || event.propertyName;

    // remove property that has completed transitioning
    delete _transition.ingProperties[propertyName];
    // check if any properties are still transitioning
    if (isEmptyObj(_transition.ingProperties)) {
      // all properties have completed transitioning
      this.disableTransition();
    }
    // clean style
    if (propertyName in _transition.clean) {
      // clean up style
      this.element.style[event.propertyName] = '';
      delete _transition.clean[propertyName];
    }
    // trigger onTransitionEnd callback
    if (propertyName in _transition.onEnd) {
      var onTransitionEnd = _transition.onEnd[propertyName];
      onTransitionEnd.call(this);
      delete _transition.onEnd[propertyName];
    }

    this.emitEvent('transitionEnd', [this]);
  };

  proto.disableTransition = function () {
    this.removeTransitionStyles();
    this.element.removeEventListener(transitionEndEvent, this, false);
    this.isTransitioning = false;
  };

  /**
   * removes style property from element
   * @param {Object} style
   **/
  proto._removeStyles = function (style) {
    // clean up transition styles
    var cleanStyle = {};
    for (var prop in style) {
      cleanStyle[prop] = '';
    }
    this.css(cleanStyle);
  };

  var cleanTransitionStyle = {
    transitionProperty: '',
    transitionDuration: '',
    transitionDelay: '',
  };

  proto.removeTransitionStyles = function () {
    // remove transition
    this.css(cleanTransitionStyle);
  };

  // ----- stagger ----- //

  proto.stagger = function (delay) {
    delay = isNaN(delay) ? 0 : delay;
    this.staggerDelay = delay + 'ms';
  };

  // ----- show/hide/remove ----- //

  // remove element from DOM
  proto.removeElem = function () {
    this.element.parentNode.removeChild(this.element);
    // remove display: none
    this.css({ display: '' });
    this.emitEvent('remove', [this]);
  };

  proto.remove = function () {
    // just remove element if no transition support or no transition
    if (
      !transitionProperty ||
      !parseFloat(this.layout.options.transitionDuration)
    ) {
      this.removeElem();
      return;
    }

    // start transition
    this.once('transitionEnd', function () {
      this.removeElem();
    });
    this.hide();
  };

  proto.reveal = function () {
    delete this.isHidden;
    // remove display: none
    this.css({ display: '' });

    var options = this.layout.options;

    var onTransitionEnd = {};
    var transitionEndProperty =
      this.getHideRevealTransitionEndProperty('visibleStyle');
    onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;

    this.transition({
      from: options.hiddenStyle,
      to: options.visibleStyle,
      isCleaning: true,
      onTransitionEnd: onTransitionEnd,
    });
  };

  proto.onRevealTransitionEnd = function () {
    // check if still visible
    // during transition, item may have been hidden
    if (!this.isHidden) {
      this.emitEvent('reveal');
    }
  };

  /**
   * get style property use for hide/reveal transition end
   * @param {String} styleProperty - hiddenStyle/visibleStyle
   * @returns {String}
   */
  proto.getHideRevealTransitionEndProperty = function (styleProperty) {
    var optionStyle = this.layout.options[styleProperty];
    // use opacity
    if (optionStyle.opacity) {
      return 'opacity';
    }
    // get first property
    for (var prop in optionStyle) {
      return prop;
    }
  };

  proto.hide = function () {
    // set flag
    this.isHidden = true;
    // remove display: none
    this.css({ display: '' });

    var options = this.layout.options;

    var onTransitionEnd = {};
    var transitionEndProperty =
      this.getHideRevealTransitionEndProperty('hiddenStyle');
    onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;

    this.transition({
      from: options.visibleStyle,
      to: options.hiddenStyle,
      // keep hidden stuff hidden
      isCleaning: true,
      onTransitionEnd: onTransitionEnd,
    });
  };

  proto.onHideTransitionEnd = function () {
    // check if still hidden
    // during transition, item may have been un-hidden
    if (this.isHidden) {
      this.css({ display: 'none' });
      this.emitEvent('hide');
    }
  };

  proto.destroy = function () {
    this.css({
      position: '',
      left: '',
      right: '',
      top: '',
      bottom: '',
      transition: '',
      transform: '',
    });
  };

  return Item;
});

/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

(function (window, factory) {
  'use strict';
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD - RequireJS
    define([
      'ev-emitter/ev-emitter',
      'get-size/get-size',
      'fizzy-ui-utils/utils',
      './item',
    ], function (EvEmitter, getSize, utils, Item) {
      return factory(window, EvEmitter, getSize, utils, Item);
    });
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }
})(window, function factory(window, EvEmitter, getSize, utils, Item) {
  'use strict';

  // ----- vars ----- //

  var console = window.console;
  var jQuery = window.jQuery;
  var noop = function () {};

  // -------------------------- Outlayer -------------------------- //

  // globally unique identifiers
  var GUID = 0;
  // internal store of all Outlayer intances
  var instances = {};

  /**
   * @param {Element, String} element
   * @param {Object} options
   * @constructor
   */
  function Outlayer(element, options) {
    var queryElement = utils.getQueryElement(element);
    if (!queryElement) {
      if (console) {
        console.error(
          'Bad element for ' +
            this.constructor.namespace +
            ': ' +
            (queryElement || element)
        );
      }
      return;
    }
    this.element = queryElement;
    // add jQuery
    if (jQuery) {
      this.$element = jQuery(this.element);
    }

    // options
    this.options = utils.extend({}, this.constructor.defaults);
    this.option(options);

    // add id for Outlayer.getFromElement
    var id = ++GUID;
    this.element.outlayerGUID = id; // expando
    instances[id] = this; // associate via id

    // kick it off
    this._create();

    var isInitLayout = this._getOption('initLayout');
    if (isInitLayout) {
      this.layout();
    }
  }

  // settings are for internal use only
  Outlayer.namespace = 'outlayer';
  Outlayer.Item = Item;

  // default options
  Outlayer.defaults = {
    containerStyle: {
      position: 'relative',
    },
    initLayout: true,
    originLeft: true,
    originTop: true,
    resize: true,
    resizeContainer: true,
    // item options
    transitionDuration: '0.4s',
    hiddenStyle: {
      opacity: 0,
      transform: 'scale(0.001)',
    },
    visibleStyle: {
      opacity: 1,
      transform: 'scale(1)',
    },
  };

  var proto = Outlayer.prototype;
  // inherit EvEmitter
  utils.extend(proto, EvEmitter.prototype);

  /**
   * set options
   * @param {Object} opts
   */
  proto.option = function (opts) {
    utils.extend(this.options, opts);
  };

  /**
   * get backwards compatible option value, check old name
   */
  proto._getOption = function (option) {
    var oldOption = this.constructor.compatOptions[option];
    return oldOption && this.options[oldOption] !== undefined
      ? this.options[oldOption]
      : this.options[option];
  };

  Outlayer.compatOptions = {
    // currentName: oldName
    initLayout: 'isInitLayout',
    horizontal: 'isHorizontal',
    layoutInstant: 'isLayoutInstant',
    originLeft: 'isOriginLeft',
    originTop: 'isOriginTop',
    resize: 'isResizeBound',
    resizeContainer: 'isResizingContainer',
  };

  proto._create = function () {
    // get items from children
    this.reloadItems();
    // elements that affect layout, but are not laid out
    this.stamps = [];
    this.stamp(this.options.stamp);
    // set container style
    utils.extend(this.element.style, this.options.containerStyle);

    // bind resize method
    var canBindResize = this._getOption('resize');
    if (canBindResize) {
      this.bindResize();
    }
  };

  // goes through all children again and gets bricks in proper order
  proto.reloadItems = function () {
    // collection of item elements
    this.items = this._itemize(this.element.children);
  };

  /**
   * turn elements into Outlayer.Items to be used in layout
   * @param {Array or NodeList or $html} elems
   * @returns {Array} items - collection of new Outlayer Items
   */
  proto._itemize = function (elems) {
    var itemElems = this._filterFindItemElements(elems);
    var Item = this.constructor.Item;

    // create new Outlayer Items for collection
    var items = [];
    for (var i = 0; i < itemElems.length; i++) {
      var elem = itemElems[i];
      var item = new Item(elem, this);
      items.push(item);
    }

    return items;
  };

  /**
   * get item elements to be used in layout
   * @param {Array or NodeList or $html} elems
   * @returns {Array} items - item elements
   */
  proto._filterFindItemElements = function (elems) {
    return utils.filterFindElements(elems, this.options.itemSelector);
  };

  /**
   * getter method for getting item elements
   * @returns {Array} elems - collection of item elements
   */
  proto.getItemElements = function () {
    return this.items.map(function (item) {
      return item.element;
    });
  };

  // ----- init & layout ----- //

  /**
   * lays out all items
   */
  proto.layout = function () {
    this._resetLayout();
    this._manageStamps();

    // don't animate first layout
    var layoutInstant = this._getOption('layoutInstant');
    var isInstant =
      layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
    this.layoutItems(this.items, isInstant);

    // flag for initalized
    this._isLayoutInited = true;
  };

  // _init is alias for layout
  proto._init = proto.layout;

  /**
   * logic before any new layout
   */
  proto._resetLayout = function () {
    this.getSize();
  };

  proto.getSize = function () {
    this.size = getSize(this.element);
  };

  /**
   * get measurement from option, for columnWidth, rowHeight, gutter
   * if option is String -> get element from selector string, & get size of element
   * if option is Element -> get size of element
   * else use option as a number
   *
   * @param {String} measurement
   * @param {String} size - width or height
   * @private
   */
  proto._getMeasurement = function (measurement, size) {
    var option = this.options[measurement];
    var elem;
    if (!option) {
      // default to 0
      this[measurement] = 0;
    } else {
      // use option as an element
      if (typeof option == 'string') {
        elem = this.element.querySelector(option);
      } else if (option instanceof $html) {
        elem = option;
      }
      // use size of element, if element
      this[measurement] = elem ? getSize(elem)[size] : option;
    }
  };

  /**
   * layout a collection of item elements
   * @api public
   */
  proto.layoutItems = function (items, isInstant) {
    items = this._getItemsForLayout(items);

    this._layoutItems(items, isInstant);

    this._postLayout();
  };

  /**
   * get the items to be laid out
   * you may want to skip over some items
   * @param {Array} items
   * @returns {Array} items
   */
  proto._getItemsForLayout = function (items) {
    return items.filter(function (item) {
      return !item.isIgnored;
    });
  };

  /**
   * layout items
   * @param {Array} items
   * @param {Boolean} isInstant
   */
  proto._layoutItems = function (items, isInstant) {
    this._emitCompleteOnItems('layout', items);

    if (!items || !items.length) {
      // no items, emit event with empty array
      return;
    }

    var queue = [];

    items.forEach(function (item) {
      // get x/y object from method
      var position = this._getItemLayoutPosition(item);
      // enqueue
      position.item = item;
      position.isInstant = isInstant || item.isLayoutInstant;
      queue.push(position);
    }, this);

    this._processLayoutQueue(queue);
  };

  /**
   * get item layout position
   * @param {Outlayer.Item} item
   * @returns {Object} x and y position
   */
  proto._getItemLayoutPosition = function (/* item */) {
    return {
      x: 0,
      y: 0,
    };
  };

  /**
   * iterate over array and position each item
   * Reason being - separating this logic prevents 'layout invalidation'
   * thx @paul_irish
   * @param {Array} queue
   */
  proto._processLayoutQueue = function (queue) {
    this.updateStagger();
    queue.forEach(function (obj, i) {
      this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
    }, this);
  };

  // set stagger from option in milliseconds number
  proto.updateStagger = function () {
    var stagger = this.options.stagger;
    if (stagger === null || stagger === undefined) {
      this.stagger = 0;
      return;
    }
    this.stagger = getMilliseconds(stagger);
    return this.stagger;
  };

  /**
   * Sets position of item in DOM
   * @param {Outlayer.Item} item
   * @param {Number} x - horizontal position
   * @param {Number} y - vertical position
   * @param {Boolean} isInstant - disables transitions
   */
  proto._positionItem = function (item, x, y, isInstant, i) {
    if (isInstant) {
      // if not transition, just set CSS
      item.goTo(x, y);
    } else {
      item.stagger(i * this.stagger);
      item.moveTo(x, y);
    }
  };

  /**
   * Any logic you want to do after each layout,
   * $window.e. size the container
   */
  proto._postLayout = function () {
    this.resizeContainer();
  };

  proto.resizeContainer = function () {
    var isResizingContainer = this._getOption('resizeContainer');
    if (!isResizingContainer) {
      return;
    }
    var size = this._getContainerSize();
    if (size) {
      this._setContainerMeasure(size.width, true);
      this._setContainerMeasure(size.height, false);
    }
  };

  /**
   * Sets width or height of container if returned
   * @returns {Object} size
   *   @param {Number} width
   *   @param {Number} height
   */
  proto._getContainerSize = noop;

  /**
   * @param {Number} measure - size of width or height
   * @param {Boolean} isWidth
   */
  proto._setContainerMeasure = function (measure, isWidth) {
    if (measure === undefined) {
      return;
    }

    var elemSize = this.size;
    // add padding and border width if border box
    if (elemSize.isBorderBox) {
      measure += isWidth
        ? elemSize.paddingLeft +
          elemSize.paddingRight +
          elemSize.borderLeftWidth +
          elemSize.borderRightWidth
        : elemSize.paddingBottom +
          elemSize.paddingTop +
          elemSize.borderTopWidth +
          elemSize.borderBottomWidth;
    }

    measure = Math.max(measure, 0);
    this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
  };

  /**
   * emit eventComplete on a collection of items events
   * @param {String} eventName
   * @param {Array} items - Outlayer.Items
   */
  proto._emitCompleteOnItems = function (eventName, items) {
    var _this = this;
    function onComplete() {
      _this.dispatchEvent(eventName + 'Complete', null, [items]);
    }

    var count = items.length;
    if (!items || !count) {
      onComplete();
      return;
    }

    var doneCount = 0;
    function tick() {
      doneCount++;
      if (doneCount == count) {
        onComplete();
      }
    }

    // bind callback
    items.forEach(function (item) {
      item.once(eventName, tick);
    });
  };

  /**
   * emits events via EvEmitter and jQuery events
   * @param {String} type - name of event
   * @param {Event} event - original event
   * @param {Array} args - extra arguments
   */
  proto.dispatchEvent = function (type, event, args) {
    // add original event to arguments
    var emitArgs = event ? [event].concat(args) : args;
    this.emitEvent(type, emitArgs);

    if (jQuery) {
      // set this.$element
      this.$element = this.$element || jQuery(this.element);
      if (event) {
        // create jQuery event
        var $event = jQuery.Event(event);
        $event.type = type;
        this.$element.trigger($event, args);
      } else {
        // just trigger with type if no event available
        this.$element.trigger(type, args);
      }
    }
  };

  // -------------------------- ignore & stamps -------------------------- //

  /**
   * keep item in collection, but do not lay it out
   * ignored items do not get skipped in layout
   * @param {Element} elem
   */
  proto.ignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      item.isIgnored = true;
    }
  };

  /**
   * return item to layout collection
   * @param {Element} elem
   */
  proto.unignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      delete item.isIgnored;
    }
  };

  /**
   * adds elements to stamps
   * @param {NodeList, Array, Element, or String} elems
   */
  proto.stamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }

    this.stamps = this.stamps.concat(elems);
    // ignore
    elems.forEach(this.ignore, this);
  };

  /**
   * removes elements to stamps
   * @param {NodeList, Array, or Element} elems
   */
  proto.unstamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }

    elems.forEach(function (elem) {
      // filter out removed stamp elements
      utils.removeFrom(this.stamps, elem);
      this.unignore(elem);
    }, this);
  };

  /**
   * finds child elements
   * @param {NodeList, Array, Element, or String} elems
   * @returns {Array} elems
   */
  proto._find = function (elems) {
    if (!elems) {
      return;
    }
    // if string, use argument as selector string
    if (typeof elems == 'string') {
      elems = this.element.querySelectorAll(elems);
    }
    elems = utils.makeArray(elems);
    return elems;
  };

  proto._manageStamps = function () {
    if (!this.stamps || !this.stamps.length) {
      return;
    }

    this._getBoundingRect();

    this.stamps.forEach(this._manageStamp, this);
  };

  // update boundingLeft / Top
  proto._getBoundingRect = function () {
    // get bounding rect for container element
    var boundingRect = this.element.getBoundingClientRect();
    var size = this.size;
    this._boundingRect = {
      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
      top: boundingRect.top + size.paddingTop + size.borderTopWidth,
      right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
      bottom:
        boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth),
    };
  };

  /**
   * @param {Element} stamp
   **/
  proto._manageStamp = noop;

  /**
   * get x/y position of element relative to container element
   * @param {Element} elem
   * @returns {Object} offset - has left, top, right, bottom
   */
  proto._getElementOffset = function (elem) {
    var boundingRect = elem.getBoundingClientRect();
    var thisRect = this._boundingRect;
    var size = getSize(elem);
    var offset = {
      left: boundingRect.left - thisRect.left - size.marginLeft,
      top: boundingRect.top - thisRect.top - size.marginTop,
      right: thisRect.right - boundingRect.right - size.marginRight,
      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom,
    };
    return offset;
  };

  // -------------------------- resize -------------------------- //

  // enable event handlers for listeners
  // $window.e. resize -> onresize
  proto.handleEvent = utils.handleEvent;

  /**
   * Bind layout to window resizing
   */
  proto.bindResize = function () {
    window.addEventListener('resize', this);
    this.isResizeBound = true;
  };

  /**
   * Unbind layout to window resizing
   */
  proto.unbindResize = function () {
    window.removeEventListener('resize', this);
    this.isResizeBound = false;
  };

  proto.onresize = function () {
    this.resize();
  };

  utils.debounceMethod(Outlayer, 'onresize', 100);

  proto.resize = function () {
    // don't trigger if size did not change
    // or if resize was unbound. See #9
    if (!this.isResizeBound || !this.needsResizeLayout()) {
      return;
    }

    this.layout();
  };

  /**
   * check if layout is needed post layout
   * @returns Boolean
   */
  proto.needsResizeLayout = function () {
    var size = getSize(this.element);
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.size && size;
    return hasSizes && size.innerWidth !== this.size.innerWidth;
  };

  // -------------------------- methods -------------------------- //

  /**
   * add items to Outlayer instance
   * @param {Array or NodeList or Element} elems
   * @returns {Array} items - Outlayer.Items
   **/
  proto.addItems = function (elems) {
    var items = this._itemize(elems);
    // add items to collection
    if (items.length) {
      this.items = this.items.concat(items);
    }
    return items;
  };

  /**
   * Layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  proto.appended = function (elems) {
    var items = this.addItems(elems);
    if (!items.length) {
      return;
    }
    // layout and reveal just the new items
    this.layoutItems(items, true);
    this.reveal(items);
  };

  /**
   * Layout prepended elements
   * @param {Array or NodeList or Element} elems
   */
  proto.prepended = function (elems) {
    var items = this._itemize(elems);
    if (!items.length) {
      return;
    }
    // add items to beginning of collection
    var previousItems = this.items.slice(0);
    this.items = items.concat(previousItems);
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // layout new stuff without transition
    this.layoutItems(items, true);
    this.reveal(items);
    // layout previous items
    this.layoutItems(previousItems);
  };

  /**
   * reveal a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.reveal = function (items) {
    this._emitCompleteOnItems('reveal', items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.reveal();
    });
  };

  /**
   * hide a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.hide = function (items) {
    this._emitCompleteOnItems('hide', items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.hide();
    });
  };

  /**
   * reveal item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.revealItemElements = function (elems) {
    var items = this.getItems(elems);
    this.reveal(items);
  };

  /**
   * hide item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.hideItemElements = function (elems) {
    var items = this.getItems(elems);
    this.hide(items);
  };

  /**
   * get Outlayer.Item, given an Element
   * @param {Element} elem
   * @param {Function} callback
   * @returns {Outlayer.Item} item
   */
  proto.getItem = function (elem) {
    // loop through items to get the one that matches
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.element == elem) {
        // return item
        return item;
      }
    }
  };

  /**
   * get collection of Outlayer.Items, given Elements
   * @param {Array} elems
   * @returns {Array} items - Outlayer.Items
   */
  proto.getItems = function (elems) {
    elems = utils.makeArray(elems);
    var items = [];
    elems.forEach(function (elem) {
      var item = this.getItem(elem);
      if (item) {
        items.push(item);
      }
    }, this);

    return items;
  };

  /**
   * remove element(s) from instance and DOM
   * @param {Array or NodeList or Element} elems
   */
  proto.remove = function (elems) {
    var removeItems = this.getItems(elems);

    this._emitCompleteOnItems('remove', removeItems);

    // bail if no items to remove
    if (!removeItems || !removeItems.length) {
      return;
    }

    removeItems.forEach(function (item) {
      item.remove();
      // remove item from collection
      utils.removeFrom(this.items, item);
    }, this);
  };

  // ----- destroy ----- //

  // remove and disable Outlayer instance
  proto.destroy = function () {
    // clean up dynamic styles
    var style = this.element.style;
    style.height = '';
    style.position = '';
    style.width = '';
    // destroy items
    this.items.forEach(function (item) {
      item.destroy();
    });

    this.unbindResize();

    var id = this.element.outlayerGUID;
    delete instances[id]; // remove reference to instance by id
    delete this.element.outlayerGUID;
    // remove data for jQuery
    if (jQuery) {
      jQuery.removeData(this.element, this.constructor.namespace);
    }
  };

  // -------------------------- data -------------------------- //

  /**
   * get Outlayer instance from element
   * @param {Element} elem
   * @returns {Outlayer}
   */
  Outlayer.data = function (elem) {
    elem = utils.getQueryElement(elem);
    var id = elem && elem.outlayerGUID;
    return id && instances[id];
  };

  // -------------------------- create Outlayer class -------------------------- //

  /**
   * create a layout class
   * @param {String} namespace
   */
  Outlayer.create = function (namespace, options) {
    // sub-class Outlayer
    var Layout = subclass(Outlayer);
    // apply new options and compatOptions
    Layout.defaults = utils.extend({}, Outlayer.defaults);
    utils.extend(Layout.defaults, options);
    Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);

    Layout.namespace = namespace;

    Layout.data = Outlayer.data;

    // sub-class Item
    Layout.Item = subclass(Item);

    // -------------------------- declarative -------------------------- //

    utils.htmlInit(Layout, namespace);

    // -------------------------- jQuery bridge -------------------------- //

    // make into jQuery plugin
    if (jQuery && jQuery.bridget) {
      jQuery.bridget(namespace, Layout);
    }

    return Layout;
  };

  function subclass(Parent) {
    function SubClass() {
      Parent.apply(this, arguments);
    }

    SubClass.prototype = Object.create(Parent.prototype);
    SubClass.prototype.constructor = SubClass;

    return SubClass;
  }

  // ----- helpers ----- //

  // how many milliseconds are in each unit
  var msUnits = {
    ms: 1,
    s: 1000,
  };

  // munge time-like parameter into millisecond number
  // '0.4s' -> 40
  function getMilliseconds(time) {
    if (typeof time == 'number') {
      return time;
    }
    var matches = time.match(/(^\d*\.?\d*)(\w*)/);
    var num = matches && matches[1];
    var unit = matches && matches[2];
    if (!num.length) {
      return 0;
    }
    num = parseFloat(num);
    var mult = msUnits[unit] || 1;
    return num * mult;
  }

  // ----- fin ----- //

  // back in global
  Outlayer.Item = Item;

  return Outlayer;
});

(function (t, e) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('isotopet4s-layout/js/item', ['outlayer/outlayer'], e);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = e(require('outlayer'));
  } else {
    t.isotope = t.isotope || {};
    t.isotope.Item = e(t.Outlayer);
  }
})(window, function (Outlayer) {
  'use strict';

  // Define the Item function that extends Outlayer.Item
  function Item() {
    Outlayer.Item.apply(this, arguments); // Call the parent constructor
    this.id = this.layout.itemGUID++; // Set the unique id
    this.sortData = {}; // Initialize sortData
  }

  // Inherit from Outlayer.Item
  Item.prototype = Object.create(Outlayer.Item.prototype);
  Item.prototype.constructor = Item;

  // Update the sort data for the item
  Item.prototype.updateSortData = function () {
    if (!this.isIgnored) {
      this.sortData.id = this.id;
      this.sortData['original-order'] = this.id;
      this.sortData.random = Math.random();

      const sortDataOptions = this.layout.options.getSortData;
      const sorters = this.layout._sorters;

      for (const key in sortDataOptions) {
        const sorter = sorters[key];
        this.sortData[key] = sorter(this.element, this);
      }
    }
  };

  // Destroy the item
  Item.prototype.destroy = function () {
    Outlayer.Item.prototype.destroy.apply(this, arguments); // Call the parent destroy method
    this.css({ display: '' }); // Reset CSS display property
  };

  return Item; // Export the Item function
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('isotopet4s-layout/js/layout-mode', [
      'get-size/get-size',
      'outlayer/outlayer',
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('get-size'), require('outlayer'));
  } else {
    global.isotope = global.isotope || {};
    global.isotope.LayoutMode = factory(global.getSize, global.Outlayer);
  }
})(window, function (getSize, Outlayer) {
  'use strict';

  class LayoutMode {
    static modes = {};
    isotope = {};

    constructor(isotope) {
      this.isotope = isotope;
      if (isotope) {
        this.options = isotope.options[this.namespace];
        this.element = isotope.element;
        this.items = isotope.filteredItems;
        this.size = isotope.size;
      }
    }

    create(name, options) {
      class Mode extends LayoutMode {
        constructor(...args) {
          super(...args);
        }
      }

      if (options) {
        Mode.options = options;
      }

      Mode.prototype.namespace = name;
      LayoutMode.modes[name] = Mode;
      return Mode;
    }

    needsVerticalResizeLayout() {
      const elementSize = getSize(this.isotope.element);
      return (
        this.isotope.size &&
        elementSize &&
        elementSize.innerHeight !== this.isotope.size.innerHeight
      );
    }

    _getMeasurement(...args) {
      this.isotope._getMeasurement.apply(this, args);
    }

    getColumnWidth() {
      this.getSegmentSize('column', 'Width');
    }

    getRowHeight() {
      this.getSegmentSize('row', 'Height');
    }

    getSegmentSize(segment, dimension) {
      const measurement = `${segment}${dimension}`;
      const outerMeasurement = `outer${dimension}`;

      this._getMeasurement(measurement, outerMeasurement);

      if (!this[measurement]) {
        const firstItemSize = this.getFirstItemSize();
        this[measurement] =
          (firstItemSize && firstItemSize[outerMeasurement]) ||
          this.isotope.size[`inner${dimension}`];
      }
    }

    getFirstItemSize() {
      const firstItem = this.isotope.filteredItems[0];
      return firstItem && firstItem.element && getSize(firstItem.element);
    }

    layout(...args) {
      this.isotope.layout.apply(this.isotope, args);
    }

    getSize() {
      this.isotope.getSize();
      this.size = this.isotope.size;
    }
  }

  const methods = [
    '_resetLayout',
    '_getItemLayoutPosition',
    '_manageStamp',
    '_getContainerSize',
    '_getElementOffset',
    'needsResizeLayout',
    '_getOption',
  ];

  methods.forEach((method) => {
    LayoutMode.prototype[method] = function (...args) {
      return Outlayer.prototype[method].apply(this.isotope, args);
    };
  });

  return LayoutMode;
});

/*!
 * Masonry v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(['outlayer/outlayer', 'get-size/get-size'], factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('outlayer'), require('get-size'));
  } else {
    // browser global
    window.Masonry = factory(window.Outlayer, window.getSize);
  }
})(window, function factory(Outlayer, getSize) {
  'use strict';

  // -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');
  // isFitWidth -> fitWidth
  Masonry.compatOptions.fitWidth = 'isFitWidth';

  var proto = Masonry.prototype;

  proto._resetLayout = function () {
    this.getSize();
    this._getMeasurement('columnWidth', 'outerWidth');
    this._getMeasurement('gutter', 'outerWidth');
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for (var i = 0; i < this.cols; i++) {
      this.colYs.push(0);
    }

    this.maxY = 0;
    this.horizontalColIndex = 0;
  };

  proto.measureColumns = function () {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if (!this.columnWidth) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth =
        (firstItemElem && getSize(firstItemElem).outerWidth) ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = (this.columnWidth += this.gutter);

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - (containerWidth % columnWidth);
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[mathMethod](cols);
    this.cols = Math.max(cols, 1);
  };

  proto.getContainerWidth = function () {
    // container is parent if fit width
    var isFitWidth = this._getOption('fitWidth');
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize(container);
    this.containerWidth = size && size.innerWidth;
  };

  proto._getItemLayoutPosition = function (item) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
    colSpan = Math.min(colSpan, this.cols);
    // use horizontal or top column position
    var colPosMethod = this.options.horizontalOrder
      ? '_getHorizontalColPosition'
      : '_getTopColPosition';
    var colPosition = this[colPosMethod](colSpan, item);
    // position the brick
    var position = {
      x: this.columnWidth * colPosition.col,
      y: colPosition.y,
    };
    // apply setHeight to necessary columns
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for (var i = colPosition.col; i < setMax; i++) {
      this.colYs[i] = setHeight;
    }

    return position;
  };

  proto._getTopColPosition = function (colSpan) {
    var colGroup = this._getTopColGroup(colSpan);
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply(Math, colGroup);

    return {
      col: colGroup.indexOf(minimumY),
      y: minimumY,
    };
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  proto._getTopColGroup = function (colSpan) {
    if (colSpan < 2) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for (var i = 0; i < groupCount; i++) {
      colGroup[i] = this._getColGroupY(i, colSpan);
    }
    return colGroup;
  };

  proto._getColGroupY = function (col, colSpan) {
    if (colSpan < 2) {
      return this.colYs[col];
    }
    // make an array of colY values for that one group
    var groupColYs = this.colYs.slice(col, col + colSpan);
    // and get the max value of the array
    return Math.max.apply(Math, groupColYs);
  };

  // get column position based on horizontal index. #873
  proto._getHorizontalColPosition = function (colSpan, item) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    // shift to next row if item can't fit on current row
    col = isOver ? 0 : col;
    // don't let zero-size items take up space
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

    return {
      col: col,
      y: this._getColGroupY(col, colSpan),
    };
  };

  proto._manageStamp = function (stamp) {
    var stampSize = getSize(stamp);
    var offset = this._getElementOffset(stamp);
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption('originLeft');
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor(firstX / this.columnWidth);
    firstCol = Math.max(0, firstCol);
    var lastCol = Math.floor(lastX / this.columnWidth);
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min(this.cols - 1, lastCol);
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption('originTop');
    var stampMaxY =
      (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
    for (var i = firstCol; i <= lastCol; i++) {
      this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
    }
  };

  proto._getContainerSize = function () {
    this.maxY = Math.max.apply(Math, this.colYs);
    var size = {
      height: this.maxY,
    };

    if (this._getOption('fitWidth')) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  proto._getContainerFitWidth = function () {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while (--i) {
      if (this.colYs[i] !== 0) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return (this.cols - unusedCols) * this.columnWidth - this.gutter;
  };

  proto.needsResizeLayout = function () {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };

  return Masonry;
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('isotopet4s-layout/js/layout-modes/masonry', [
      '../layout-mode',
      'masonry-layout/masonry',
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../layout-mode'),
      require('masonry-layout')
    );
  } else {
    factory(global.isotope.LayoutMode, global.Masonry);
  }
})(window, function (LayoutMode, Masonry) {
  'use strict';

  const MasonryLayout = new LayoutMode().create('masonry');
  const prototype = MasonryLayout.prototype;

  // Override methods to integrate with Isotope
  const ignoredMethods = {
    _getElementOffset: true,
    layout: true,
    _getMeasurement: true,
  };

  // Copy prototype methods from Masonry while ignoring specified methods
  for (const method in Masonry.prototype) {
    if (!ignoredMethods[method]) {
      prototype[method] = Masonry.prototype[method];
    }
  }

  // Override measureColumns to use filtered items
  const originalMeasureColumns = prototype.measureColumns;
  prototype.measureColumns = function () {
    this.items = this.isotope.filteredItems;
    originalMeasureColumns.call(this);
  };

  // Override _getOption for specific behavior with fitWidth option
  const originalGetOption = prototype._getOption;
  prototype._getOption = function (option) {
    if (option === 'fitWidth') {
      return this.options.isFitWidth !== undefined
        ? this.options.isFitWidth
        : this.options.fitWidth;
    }
    return originalGetOption.apply(this.isotope, arguments);
  };

  return MasonryLayout;
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('isotopet4s-layout/js/layout-modes/fit-rows', [
      '../layout-mode',
    ], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('../layout-mode'));
  } else {
    factory(global.isotope.LayoutMode);
  }
})(window, function (LayoutMode) {
  'use strict';

  const FitRowsLayout = new LayoutMode().create('fitRows');
  const prototype = FitRowsLayout.prototype;

  // Reset layout dimensions
  prototype._resetLayout = function () {
    this.x = 0;
    this.y = 0;
    this.maxY = 0;
    this._getMeasurement('gutter', 'outerWidth');
  };

  // Calculate the position of an item in the layout
  prototype._getItemLayoutPosition = function (item) {
    item.getSize();
    const itemWidth = item.size.outerWidth + this.gutter;
    const containerWidth = this.isotope.size.innerWidth + this.gutter;

    // Move to the next row if the current item exceeds the container width
    if (this.x !== 0 && itemWidth + this.x > containerWidth) {
      this.x = 0;
      this.y = this.maxY;
    }

    const position = {
      x: this.x,
      y: this.y,
    };

    this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
    this.x += itemWidth;

    return position;
  };

  // Get the overall container size
  prototype._getContainerSize = function () {
    return {
      height: this.maxY,
    };
  };

  return FitRowsLayout;
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('isotopet4s-layout/js/layout-modes/vertical', [
      '../layout-mode',
    ], factory);
  } else if (typeof module === 'object') {
    module.exports = factory(require('../layout-mode'));
  } else {
    factory(global.isotope.LayoutMode);
  }
})(window, function (LayoutMode) {
  'use strict';

  const VerticalLayout = new LayoutMode().create('vertical', {
    horizontalAlignment: 0,
  });

  const prototype = VerticalLayout.prototype;

  // Reset layout position
  prototype._resetLayout = function () {
    this.y = 0;
  };

  // Calculate the position of an item in the layout
  prototype._getItemLayoutPosition = function (item) {
    item.getSize();

    const alignmentOffset =
      (this.isotope.size.innerWidth - item.size.outerWidth) *
      this.options.horizontalAlignment;
    const positionY = this.y;

    this.y += item.size.outerHeight;

    return {
      x: alignmentOffset,
      y: positionY,
    };
  };

  // Get the overall container size
  prototype._getContainerSize = function () {
    return {
      height: this.y,
    };
  };

  return VerticalLayout;
});

/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

(function (window, factory) {
  'use strict';
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD - RequireJS
    define([
      'ev-emitter/ev-emitter',
      'get-size/get-size',
      'fizzy-ui-utils/utils',
      './item',
    ], function (EvEmitter, getSize, utils, Item) {
      return factory(window, EvEmitter, getSize, utils, Item);
    });
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./item')
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }
})(window, function factory(window, EvEmitter, getSize, utils, Item) {
  'use strict';

  // ----- vars ----- //

  var console = window.console;
  var jQuery = window.jQuery;
  var noop = function () {};

  // -------------------------- Outlayer -------------------------- //

  // globally unique identifiers
  var GUID = 0;
  // internal store of all Outlayer intances
  var instances = {};

  /**
   * @param {Element, String} element
   * @param {Object} options
   * @constructor
   */
  function Outlayer(element, options) {
    var queryElement = utils.getQueryElement(element);
    if (!queryElement) {
      if (console) {
        console.error(
          'Bad element for ' +
            this.constructor.namespace +
            ': ' +
            (queryElement || element)
        );
      }
      return;
    }
    this.element = queryElement;
    // add jQuery
    if (jQuery) {
      this.$element = jQuery(this.element);
    }

    // options
    this.options = utils.extend({}, this.constructor.defaults);
    this.option(options);

    // add id for Outlayer.getFromElement
    var id = ++GUID;
    this.element.outlayerGUID = id; // expando
    instances[id] = this; // associate via id

    // kick it off
    this._create();

    var isInitLayout = this._getOption('initLayout');
    if (isInitLayout) {
      this.layout();
    }
  }

  // settings are for internal use only
  Outlayer.namespace = 'outlayer';
  Outlayer.Item = Item;

  // default options
  Outlayer.defaults = {
    containerStyle: {
      position: 'relative',
    },
    initLayout: true,
    originLeft: true,
    originTop: true,
    resize: true,
    resizeContainer: true,
    // item options
    transitionDuration: '0.4s',
    hiddenStyle: {
      opacity: 0,
      transform: 'scale(0.001)',
    },
    visibleStyle: {
      opacity: 1,
      transform: 'scale(1)',
    },
  };

  var proto = Outlayer.prototype;
  // inherit EvEmitter
  utils.extend(proto, EvEmitter.prototype);

  /**
   * set options
   * @param {Object} opts
   */
  proto.option = function (opts) {
    utils.extend(this.options, opts);
  };

  /**
   * get backwards compatible option value, check old name
   */
  proto._getOption = function (option) {
    var oldOption = this.constructor.compatOptions[option];
    return oldOption && this.options[oldOption] !== undefined
      ? this.options[oldOption]
      : this.options[option];
  };

  Outlayer.compatOptions = {
    // currentName: oldName
    initLayout: 'isInitLayout',
    horizontal: 'isHorizontal',
    layoutInstant: 'isLayoutInstant',
    originLeft: 'isOriginLeft',
    originTop: 'isOriginTop',
    resize: 'isResizeBound',
    resizeContainer: 'isResizingContainer',
  };

  proto._create = function () {
    // get items from children
    this.reloadItems();
    // elements that affect layout, but are not laid out
    this.stamps = [];
    this.stamp(this.options.stamp);
    // set container style
    utils.extend(this.element.style, this.options.containerStyle);

    // bind resize method
    var canBindResize = this._getOption('resize');
    if (canBindResize) {
      this.bindResize();
    }
  };

  // goes through all children again and gets bricks in proper order
  proto.reloadItems = function () {
    // collection of item elements
    this.items = this._itemize(this.element.children);
  };

  /**
   * turn elements into Outlayer.Items to be used in layout
   * @param {Array or NodeList or $html} elems
   * @returns {Array} items - collection of new Outlayer Items
   */
  proto._itemize = function (elems) {
    var itemElems = this._filterFindItemElements(elems);
    var Item = this.constructor.Item;

    // create new Outlayer Items for collection
    var items = [];
    for (var i = 0; i < itemElems.length; i++) {
      var elem = itemElems[i];
      var item = new Item(elem, this);
      items.push(item);
    }

    return items;
  };

  /**
   * get item elements to be used in layout
   * @param {Array or NodeList or $html} elems
   * @returns {Array} items - item elements
   */
  proto._filterFindItemElements = function (elems) {
    return utils.filterFindElements(elems, this.options.itemSelector);
  };

  /**
   * getter method for getting item elements
   * @returns {Array} elems - collection of item elements
   */
  proto.getItemElements = function () {
    return this.items.map(function (item) {
      return item.element;
    });
  };

  // ----- init & layout ----- //

  /**
   * lays out all items
   */
  proto.layout = function () {
    this._resetLayout();
    this._manageStamps();

    // don't animate first layout
    var layoutInstant = this._getOption('layoutInstant');
    var isInstant =
      layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
    this.layoutItems(this.items, isInstant);

    // flag for initalized
    this._isLayoutInited = true;
  };

  // _init is alias for layout
  proto._init = proto.layout;

  /**
   * logic before any new layout
   */
  proto._resetLayout = function () {
    this.getSize();
  };

  proto.getSize = function () {
    this.size = getSize(this.element);
  };

  /**
   * get measurement from option, for columnWidth, rowHeight, gutter
   * if option is String -> get element from selector string, & get size of element
   * if option is Element -> get size of element
   * else use option as a number
   *
   * @param {String} measurement
   * @param {String} size - width or height
   * @private
   */
  proto._getMeasurement = function (measurement, size) {
    var option = this.options[measurement];
    var elem;
    if (!option) {
      // default to 0
      this[measurement] = 0;
    } else {
      // use option as an element
      if (typeof option == 'string') {
        elem = this.element.querySelector(option);
      } else if (option instanceof $html) {
        elem = option;
      }
      // use size of element, if element
      this[measurement] = elem ? getSize(elem)[size] : option;
    }
  };

  /**
   * layout a collection of item elements
   * @api public
   */
  proto.layoutItems = function (items, isInstant) {
    items = this._getItemsForLayout(items);

    this._layoutItems(items, isInstant);

    this._postLayout();
  };

  /**
   * get the items to be laid out
   * you may want to skip over some items
   * @param {Array} items
   * @returns {Array} items
   */
  proto._getItemsForLayout = function (items) {
    return items.filter(function (item) {
      return !item.isIgnored;
    });
  };

  /**
   * layout items
   * @param {Array} items
   * @param {Boolean} isInstant
   */
  proto._layoutItems = function (items, isInstant) {
    this._emitCompleteOnItems('layout', items);

    if (!items || !items.length) {
      // no items, emit event with empty array
      return;
    }

    var queue = [];

    items.forEach(function (item) {
      // get x/y object from method
      var position = this._getItemLayoutPosition(item);
      // enqueue
      position.item = item;
      position.isInstant = isInstant || item.isLayoutInstant;
      queue.push(position);
    }, this);

    this._processLayoutQueue(queue);
  };

  /**
   * get item layout position
   * @param {Outlayer.Item} item
   * @returns {Object} x and y position
   */
  proto._getItemLayoutPosition = function (/* item */) {
    return {
      x: 0,
      y: 0,
    };
  };

  /**
   * iterate over array and position each item
   * Reason being - separating this logic prevents 'layout invalidation'
   * thx @paul_irish
   * @param {Array} queue
   */
  proto._processLayoutQueue = function (queue) {
    this.updateStagger();
    queue.forEach(function (obj, i) {
      this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
    }, this);
  };

  // set stagger from option in milliseconds number
  proto.updateStagger = function () {
    var stagger = this.options.stagger;
    if (stagger === null || stagger === undefined) {
      this.stagger = 0;
      return;
    }
    this.stagger = getMilliseconds(stagger);
    return this.stagger;
  };

  /**
   * Sets position of item in DOM
   * @param {Outlayer.Item} item
   * @param {Number} x - horizontal position
   * @param {Number} y - vertical position
   * @param {Boolean} isInstant - disables transitions
   */
  proto._positionItem = function (item, x, y, isInstant, i) {
    if (isInstant) {
      // if not transition, just set CSS
      item.goTo(x, y);
    } else {
      item.stagger(i * this.stagger);
      item.moveTo(x, y);
    }
  };

  /**
   * Any logic you want to do after each layout,
   * $window.e. size the container
   */
  proto._postLayout = function () {
    this.resizeContainer();
  };

  proto.resizeContainer = function () {
    var isResizingContainer = this._getOption('resizeContainer');
    if (!isResizingContainer) {
      return;
    }
    var size = this._getContainerSize();
    if (size) {
      this._setContainerMeasure(size.width, true);
      this._setContainerMeasure(size.height, false);
    }
  };

  /**
   * Sets width or height of container if returned
   * @returns {Object} size
   *   @param {Number} width
   *   @param {Number} height
   */
  proto._getContainerSize = noop;

  /**
   * @param {Number} measure - size of width or height
   * @param {Boolean} isWidth
   */
  proto._setContainerMeasure = function (measure, isWidth) {
    if (measure === undefined) {
      return;
    }

    var elemSize = this.size;
    // add padding and border width if border box
    if (elemSize.isBorderBox) {
      measure += isWidth
        ? elemSize.paddingLeft +
          elemSize.paddingRight +
          elemSize.borderLeftWidth +
          elemSize.borderRightWidth
        : elemSize.paddingBottom +
          elemSize.paddingTop +
          elemSize.borderTopWidth +
          elemSize.borderBottomWidth;
    }

    measure = Math.max(measure, 0);
    this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
  };

  /**
   * emit eventComplete on a collection of items events
   * @param {String} eventName
   * @param {Array} items - Outlayer.Items
   */
  proto._emitCompleteOnItems = function (eventName, items) {
    var _this = this;
    function onComplete() {
      _this.dispatchEvent(eventName + 'Complete', null, [items]);
    }

    var count = items.length;
    if (!items || !count) {
      onComplete();
      return;
    }

    var doneCount = 0;
    function tick() {
      doneCount++;
      if (doneCount == count) {
        onComplete();
      }
    }

    // bind callback
    items.forEach(function (item) {
      item.once(eventName, tick);
    });
  };

  /**
   * emits events via EvEmitter and jQuery events
   * @param {String} type - name of event
   * @param {Event} event - original event
   * @param {Array} args - extra arguments
   */
  proto.dispatchEvent = function (type, event, args) {
    // add original event to arguments
    var emitArgs = event ? [event].concat(args) : args;
    this.emitEvent(type, emitArgs);

    if (jQuery) {
      // set this.$element
      this.$element = this.$element || jQuery(this.element);
      if (event) {
        // create jQuery event
        var $event = jQuery.Event(event);
        $event.type = type;
        this.$element.trigger($event, args);
      } else {
        // just trigger with type if no event available
        this.$element.trigger(type, args);
      }
    }
  };

  // -------------------------- ignore & stamps -------------------------- //

  /**
   * keep item in collection, but do not lay it out
   * ignored items do not get skipped in layout
   * @param {Element} elem
   */
  proto.ignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      item.isIgnored = true;
    }
  };

  /**
   * return item to layout collection
   * @param {Element} elem
   */
  proto.unignore = function (elem) {
    var item = this.getItem(elem);
    if (item) {
      delete item.isIgnored;
    }
  };

  /**
   * adds elements to stamps
   * @param {NodeList, Array, Element, or String} elems
   */
  proto.stamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }

    this.stamps = this.stamps.concat(elems);
    // ignore
    elems.forEach(this.ignore, this);
  };

  /**
   * removes elements to stamps
   * @param {NodeList, Array, or Element} elems
   */
  proto.unstamp = function (elems) {
    elems = this._find(elems);
    if (!elems) {
      return;
    }

    elems.forEach(function (elem) {
      // filter out removed stamp elements
      utils.removeFrom(this.stamps, elem);
      this.unignore(elem);
    }, this);
  };

  /**
   * finds child elements
   * @param {NodeList, Array, Element, or String} elems
   * @returns {Array} elems
   */
  proto._find = function (elems) {
    if (!elems) {
      return;
    }
    // if string, use argument as selector string
    if (typeof elems == 'string') {
      elems = this.element.querySelectorAll(elems);
    }
    elems = utils.makeArray(elems);
    return elems;
  };

  proto._manageStamps = function () {
    if (!this.stamps || !this.stamps.length) {
      return;
    }

    this._getBoundingRect();

    this.stamps.forEach(this._manageStamp, this);
  };

  // update boundingLeft / Top
  proto._getBoundingRect = function () {
    // get bounding rect for container element
    var boundingRect = this.element.getBoundingClientRect();
    var size = this.size;
    this._boundingRect = {
      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
      top: boundingRect.top + size.paddingTop + size.borderTopWidth,
      right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
      bottom:
        boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth),
    };
  };

  /**
   * @param {Element} stamp
   **/
  proto._manageStamp = noop;

  /**
   * get x/y position of element relative to container element
   * @param {Element} elem
   * @returns {Object} offset - has left, top, right, bottom
   */
  proto._getElementOffset = function (elem) {
    var boundingRect = elem.getBoundingClientRect();
    var thisRect = this._boundingRect;
    var size = getSize(elem);
    var offset = {
      left: boundingRect.left - thisRect.left - size.marginLeft,
      top: boundingRect.top - thisRect.top - size.marginTop,
      right: thisRect.right - boundingRect.right - size.marginRight,
      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom,
    };
    return offset;
  };

  // -------------------------- resize -------------------------- //

  // enable event handlers for listeners
  // $window.e. resize -> onresize
  proto.handleEvent = utils.handleEvent;

  /**
   * Bind layout to window resizing
   */
  proto.bindResize = function () {
    window.addEventListener('resize', this);
    this.isResizeBound = true;
  };

  /**
   * Unbind layout to window resizing
   */
  proto.unbindResize = function () {
    window.removeEventListener('resize', this);
    this.isResizeBound = false;
  };

  proto.onresize = function () {
    this.resize();
  };

  utils.debounceMethod(Outlayer, 'onresize', 100);

  proto.resize = function () {
    // don't trigger if size did not change
    // or if resize was unbound. See #9
    if (!this.isResizeBound || !this.needsResizeLayout()) {
      return;
    }

    this.layout();
  };

  /**
   * check if layout is needed post layout
   * @returns Boolean
   */
  proto.needsResizeLayout = function () {
    var size = getSize(this.element);
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.size && size;
    return hasSizes && size.innerWidth !== this.size.innerWidth;
  };

  // -------------------------- methods -------------------------- //

  /**
   * add items to Outlayer instance
   * @param {Array or NodeList or Element} elems
   * @returns {Array} items - Outlayer.Items
   **/
  proto.addItems = function (elems) {
    var items = this._itemize(elems);
    // add items to collection
    if (items.length) {
      this.items = this.items.concat(items);
    }
    return items;
  };

  /**
   * Layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  proto.appended = function (elems) {
    var items = this.addItems(elems);
    if (!items.length) {
      return;
    }
    // layout and reveal just the new items
    this.layoutItems(items, true);
    this.reveal(items);
  };

  /**
   * Layout prepended elements
   * @param {Array or NodeList or Element} elems
   */
  proto.prepended = function (elems) {
    var items = this._itemize(elems);
    if (!items.length) {
      return;
    }
    // add items to beginning of collection
    var previousItems = this.items.slice(0);
    this.items = items.concat(previousItems);
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // layout new stuff without transition
    this.layoutItems(items, true);
    this.reveal(items);
    // layout previous items
    this.layoutItems(previousItems);
  };

  /**
   * reveal a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.reveal = function (items) {
    this._emitCompleteOnItems('reveal', items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.reveal();
    });
  };

  /**
   * hide a collection of items
   * @param {Array of Outlayer.Items} items
   */
  proto.hide = function (items) {
    this._emitCompleteOnItems('hide', items);
    if (!items || !items.length) {
      return;
    }
    var stagger = this.updateStagger();
    items.forEach(function (item, i) {
      item.stagger(i * stagger);
      item.hide();
    });
  };

  /**
   * reveal item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.revealItemElements = function (elems) {
    var items = this.getItems(elems);
    this.reveal(items);
  };

  /**
   * hide item elements
   * @param {Array}, {Element}, {NodeList} items
   */
  proto.hideItemElements = function (elems) {
    var items = this.getItems(elems);
    this.hide(items);
  };

  /**
   * get Outlayer.Item, given an Element
   * @param {Element} elem
   * @param {Function} callback
   * @returns {Outlayer.Item} item
   */
  proto.getItem = function (elem) {
    // loop through items to get the one that matches
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.element == elem) {
        // return item
        return item;
      }
    }
  };

  /**
   * get collection of Outlayer.Items, given Elements
   * @param {Array} elems
   * @returns {Array} items - Outlayer.Items
   */
  proto.getItems = function (elems) {
    elems = utils.makeArray(elems);
    var items = [];
    elems.forEach(function (elem) {
      var item = this.getItem(elem);
      if (item) {
        items.push(item);
      }
    }, this);

    return items;
  };

  /**
   * remove element(s) from instance and DOM
   * @param {Array or NodeList or Element} elems
   */
  proto.remove = function (elems) {
    var removeItems = this.getItems(elems);

    this._emitCompleteOnItems('remove', removeItems);

    // bail if no items to remove
    if (!removeItems || !removeItems.length) {
      return;
    }

    removeItems.forEach(function (item) {
      item.remove();
      // remove item from collection
      utils.removeFrom(this.items, item);
    }, this);
  };

  // ----- destroy ----- //

  // remove and disable Outlayer instance
  proto.destroy = function () {
    // clean up dynamic styles
    var style = this.element.style;
    style.height = '';
    style.position = '';
    style.width = '';
    // destroy items
    this.items.forEach(function (item) {
      item.destroy();
    });

    this.unbindResize();

    var id = this.element.outlayerGUID;
    delete instances[id]; // remove reference to instance by id
    delete this.element.outlayerGUID;
    // remove data for jQuery
    if (jQuery) {
      jQuery.removeData(this.element, this.constructor.namespace);
    }
  };

  // -------------------------- data -------------------------- //

  /**
   * get Outlayer instance from element
   * @param {Element} elem
   * @returns {Outlayer}
   */
  Outlayer.data = function (elem) {
    elem = utils.getQueryElement(elem);
    var id = elem && elem.outlayerGUID;
    return id && instances[id];
  };

  // -------------------------- create Outlayer class -------------------------- //

  /**
   * create a layout class
   * @param {String} namespace
   */
  Outlayer.create = function (namespace, options) {
    // sub-class Outlayer
    var Layout = subclass(Outlayer);
    // apply new options and compatOptions
    Layout.defaults = utils.extend({}, Outlayer.defaults);
    utils.extend(Layout.defaults, options);
    Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);

    Layout.namespace = namespace;

    Layout.data = Outlayer.data;

    // sub-class Item
    Layout.Item = subclass(Item);

    // -------------------------- declarative -------------------------- //

    utils.htmlInit(Layout, namespace);

    // -------------------------- jQuery bridge -------------------------- //

    // make into jQuery plugin
    if (jQuery && jQuery.bridget) {
      jQuery.bridget(namespace, Layout);
    }

    return Layout;
  };

  function subclass(Parent) {
    function SubClass() {
      Parent.apply(this, arguments);
    }

    SubClass.prototype = Object.create(Parent.prototype);
    SubClass.prototype.constructor = SubClass;

    return SubClass;
  }

  // ----- helpers ----- //

  // how many milliseconds are in each unit
  var msUnits = {
    ms: 1,
    s: 1000,
  };

  // munge time-like parameter into millisecond number
  // '0.4s' -> 40
  function getMilliseconds(time) {
    if (typeof time == 'number') {
      return time;
    }
    var matches = time.match(/(^\d*\.?\d*)(\w*)/);
    var num = matches && matches[1];
    var unit = matches && matches[2];
    if (!num.length) {
      return 0;
    }
    num = parseFloat(num);
    var mult = msUnits[unit] || 1;
    return num * mult;
  }

  // ----- fin ----- //

  // back in global
  Outlayer.Item = Item;

  return Outlayer;
});

/**
 * Rect
 * low-level utility class for basic geometry
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /* globals define, module */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.Packery = window.Packery || {};
    window.Packery.Rect = factory();
  }
})(window, function factory() {
  'use strict';

  // -------------------------- Rect -------------------------- //

  function Rect(props) {
    // extend properties from defaults
    for (var prop in Rect.defaults) {
      this[prop] = Rect.defaults[prop];
    }

    for (prop in props) {
      this[prop] = props[prop];
    }
  }

  Rect.defaults = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  var proto = Rect.prototype;

  /**
   * Determines whether or not this rectangle wholly encloses another rectangle or point.
   * @param {Rect} rect
   * @returns {Boolean}
   **/
  proto.contains = function (rect) {
    // points don't have width or height
    var otherWidth = rect.width || 0;
    var otherHeight = rect.height || 0;
    return (
      this.x <= rect.x &&
      this.y <= rect.y &&
      this.x + this.width >= rect.x + otherWidth &&
      this.y + this.height >= rect.y + otherHeight
    );
  };

  /**
   * Determines whether or not the rectangle intersects with another.
   * @param {Rect} rect
   * @returns {Boolean}
   **/
  proto.overlaps = function (rect) {
    var thisRight = this.x + this.width;
    var thisBottom = this.y + this.height;
    var rectRight = rect.x + rect.width;
    var rectBottom = rect.y + rect.height;

    // http://stackoverflow.com/a/306332
    return (
      this.x < rectRight &&
      thisRight > rect.x &&
      this.y < rectBottom &&
      thisBottom > rect.y
    );
  };

  /**
   * @param {Rect} rect - the overlapping rect
   * @returns {Array} freeRects - rects representing the area around the rect
   **/
  proto.getMaximalFreeRects = function (rect) {
    // if no intersection, return false
    if (!this.overlaps(rect)) {
      return false;
    }

    var freeRects = [];
    var freeRect;

    var thisRight = this.x + this.width;
    var thisBottom = this.y + this.height;
    var rectRight = rect.x + rect.width;
    var rectBottom = rect.y + rect.height;

    // top
    if (this.y < rect.y) {
      freeRect = new Rect({
        x: this.x,
        y: this.y,
        width: this.width,
        height: rect.y - this.y,
      });
      freeRects.push(freeRect);
    }

    // right
    if (thisRight > rectRight) {
      freeRect = new Rect({
        x: rectRight,
        y: this.y,
        width: thisRight - rectRight,
        height: this.height,
      });
      freeRects.push(freeRect);
    }

    // bottom
    if (thisBottom > rectBottom) {
      freeRect = new Rect({
        x: this.x,
        y: rectBottom,
        width: this.width,
        height: thisBottom - rectBottom,
      });
      freeRects.push(freeRect);
    }

    // left
    if (this.x < rect.x) {
      freeRect = new Rect({
        x: this.x,
        y: this.y,
        width: rect.x - this.x,
        height: this.height,
      });
      freeRects.push(freeRect);
    }

    return freeRects;
  };

  proto.canFit = function (rect) {
    return this.width >= rect.width && this.height >= rect.height;
  };

  return Rect;
});

/**
 * Packer
 * bin-packing algorithm
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(['./rect'], factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('./rect'));
  } else {
    // browser global
    var Packery = (window.Packery = window.Packery || {});
    Packery.Packer = factory(Packery.Rect);
  }
})(window, function factory(Rect) {
  'use strict';

  // -------------------------- Packer -------------------------- //

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {String} sortDirection
   *   topLeft for vertical, leftTop for horizontal
   */
  function Packer(width, height, sortDirection) {
    this.width = width || 0;
    this.height = height || 0;
    this.sortDirection = sortDirection || 'downwardLeftToRight';

    this.reset();
  }

  var proto = Packer.prototype;

  proto.reset = function () {
    this.spaces = [];

    var initialSpace = new Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });

    this.spaces.push(initialSpace);
    // set sorter
    this.sorter = sorters[this.sortDirection] || sorters.downwardLeftToRight;
  };

  // change x and y of rect to fit with in Packer's available spaces
  proto.pack = function (rect) {
    for (var i = 0; i < this.spaces.length; i++) {
      var space = this.spaces[i];
      if (space.canFit(rect)) {
        this.placeInSpace(rect, space);
        break;
      }
    }
  };

  proto.columnPack = function (rect) {
    for (var i = 0; i < this.spaces.length; i++) {
      var space = this.spaces[i];
      var canFitInSpaceColumn =
        space.x <= rect.x &&
        space.x + space.width >= rect.x + rect.width &&
        space.height >= rect.height - 0.01; // fudge number for rounding error
      if (canFitInSpaceColumn) {
        rect.y = space.y;
        this.placed(rect);
        break;
      }
    }
  };

  proto.rowPack = function (rect) {
    for (var i = 0; i < this.spaces.length; i++) {
      var space = this.spaces[i];
      var canFitInSpaceRow =
        space.y <= rect.y &&
        space.y + space.height >= rect.y + rect.height &&
        space.width >= rect.width - 0.01; // fudge number for rounding error
      if (canFitInSpaceRow) {
        rect.x = space.x;
        this.placed(rect);
        break;
      }
    }
  };

  proto.placeInSpace = function (rect, space) {
    // place rect in space
    rect.x = space.x;
    rect.y = space.y;

    this.placed(rect);
  };

  // update spaces with placed rect
  proto.placed = function (rect) {
    // update spaces
    var revisedSpaces = [];
    for (var i = 0; i < this.spaces.length; i++) {
      var space = this.spaces[i];
      var newSpaces = space.getMaximalFreeRects(rect);
      // add either the original space or the new spaces to the revised spaces
      if (newSpaces) {
        revisedSpaces.push.apply(revisedSpaces, newSpaces);
      } else {
        revisedSpaces.push(space);
      }
    }

    this.spaces = revisedSpaces;

    this.mergeSortSpaces();
  };

  proto.mergeSortSpaces = function () {
    // remove redundant spaces
    Packer.mergeRects(this.spaces);
    this.spaces.sort(this.sorter);
  };

  // add a space back
  proto.addSpace = function (rect) {
    this.spaces.push(rect);
    this.mergeSortSpaces();
  };

  // -------------------------- utility functions -------------------------- //

  /**
   * Remove redundant rectangle from array of rectangles
   * @param {Array} rects: an array of Rects
   * @returns {Array} rects: an array of Rects
   **/
  Packer.mergeRects = function (rects) {
    var i = 0;
    var rect = rects[i];

    rectLoop: while (rect) {
      var j = 0;
      var compareRect = rects[i + j];

      while (compareRect) {
        if (compareRect == rect) {
          j++; // next
        } else if (compareRect.contains(rect)) {
          // remove rect
          rects.splice(i, 1);
          rect = rects[i]; // set next rect
          continue rectLoop; // bail on compareLoop
        } else if (rect.contains(compareRect)) {
          // remove compareRect
          rects.splice(i + j, 1);
        } else {
          j++;
        }
        compareRect = rects[i + j]; // set next compareRect
      }
      i++;
      rect = rects[i];
    }

    return rects;
  };

  // -------------------------- sorters -------------------------- //

  // functions for sorting rects in order
  var sorters = {
    // top down, then left to right
    downwardLeftToRight: function (a, b) {
      return a.y - b.y || a.x - b.x;
    },
    // left to right, then top down
    rightwardTopToBottom: function (a, b) {
      return a.x - b.x || a.y - b.y;
    },
  };

  // --------------------------  -------------------------- //

  return Packer;
});

/**
 * Packery Item Element
 **/

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(['outlayer/outlayer', './rect'], factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('outlayer'), require('./rect'));
  } else {
    // browser global
    window.Packery.Item = factory(window.Outlayer, window.Packery.Rect);
  }
})(window, function factory(Outlayer, Rect) {
  'use strict';

  // -------------------------- Item -------------------------- //

  var docElemStyle = document.documentElement.style;

  var transformProperty =
    typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

  // sub-class Item
  var Item = function PackeryItem() {
    Outlayer.Item.apply(this, arguments);
  };

  var proto = (Item.prototype = Object.create(Outlayer.Item.prototype));

  var __create = proto._create;
  proto._create = function () {
    // call default _create logic
    __create.call(this);
    this.rect = new Rect();
  };

  var _moveTo = proto.moveTo;
  proto.moveTo = function (x, y) {
    // don't shift 1px while dragging
    var dx = Math.abs(this.position.x - x);
    var dy = Math.abs(this.position.y - y);

    var canHackGoTo =
      this.layout.dragItemCount &&
      !this.isPlacing &&
      !this.isTransitioning &&
      dx < 1 &&
      dy < 1;
    if (canHackGoTo) {
      this.goTo(x, y);
      return;
    }
    _moveTo.apply(this, arguments);
  };

  // -------------------------- placing -------------------------- //

  proto.enablePlacing = function () {
    this.removeTransitionStyles();
    // remove transform property from transition
    if (this.isTransitioning && transformProperty) {
      this.element.style[transformProperty] = 'none';
    }
    this.isTransitioning = false;
    this.getSize();
    this.layout._setRectSize(this.element, this.rect);
    this.isPlacing = true;
  };

  proto.disablePlacing = function () {
    this.isPlacing = false;
  };

  // -----  ----- //

  // remove element from DOM
  proto.removeElem = function () {
    var parent = this.element.parentNode;
    if (parent) {
      parent.removeChild(this.element);
    }
    // add space back to packer
    this.layout.packer.addSpace(this.rect);
    this.emitEvent('remove', [this]);
  };

  // ----- dropPlaceholder ----- //

  proto.showDropPlaceholder = function () {
    var dropPlaceholder = this.dropPlaceholder;
    if (!dropPlaceholder) {
      // create dropPlaceholder
      dropPlaceholder = this.dropPlaceholder = document.createElement('div');
      dropPlaceholder.className = 'packery-drop-placeholder';
      dropPlaceholder.style.position = 'absolute';
    }

    dropPlaceholder.style.width = this.size.width + 'px';
    dropPlaceholder.style.height = this.size.height + 'px';
    this.positionDropPlaceholder();
    this.layout.element.appendChild(dropPlaceholder);
  };

  proto.positionDropPlaceholder = function () {
    this.dropPlaceholder.style[transformProperty] =
      'translate(' + this.rect.x + 'px, ' + this.rect.y + 'px)';
  };

  proto.hideDropPlaceholder = function () {
    // only remove once, #333
    var parent = this.dropPlaceholder.parentNode;
    if (parent) {
      parent.removeChild(this.dropPlaceholder);
    }
  };

  // -----  ----- //

  return Item;
});

!(function (t, e) {
  'function' == typeof define && define.amd
    ? define(
        [
          'outlayer/outlayer',
          'get-size/get-size',
          'desandro-matches-selector/matches-selector',
          'fizzy-ui-utils/utils',
          'isotopet4s-layout/js/item',
          'isotopet4s-layout/js/layout-mode',
          'isotopet4s-layout/js/layout-modes/masonry',
          'isotopet4s-layout/js/layout-modes/fit-rows',
          'isotopet4s-layout/js/layout-modes/vertical',
        ],
        function (i, n, o, s, r, a) {
          return e(t, i, n, o, s, r, a);
        }
      )
    : 'object' == typeof module && module.exports
    ? (module.exports = e(
        t,
        require('outlayer'),
        require('get-size'),
        require('desandro-matches-selector'),
        require('fizzy-ui-utils'),
        require('isotopet4s-layout/js/item'),
        require('isotopet4s-layout/js/layout-mode'),
        require('isotopet4s-layout/js/layout-modes/masonry'),
        require('isotopet4s-layout/js/layout-modes/fit-rows'),
        require('isotopet4s-layout/js/layout-modes/vertical')
      ))
    : (t.isotope = e(
        t,
        t.Outlayer,
        t.getSize,
        t.matchesSelector,
        t.fizzyUIUtils,
        t.isotope.Item,
        t.isotope.LayoutMode
      ));
})(window, function (t, e, i, n, o, s, r) {
  var a = t.jQuery_T4NT,
    l = String.prototype.trim
      ? function (t) {
          return t.trim();
        }
      : function (t) {
          return t.replace(/^\s+|\s+$/g, '');
        },
    c = e.create('isotope', {
      layoutMode: 'masonry',
      isjQuery_T4NTFiltering: !0,
      sortAscending: !0,
    });
  (c.Item = s), (c.LayoutMode = r);
  var u = c.prototype;
  (u._create = function () {
    for (var t in ((this.itemGUID = 0),
    (this._sorters = {}),
    this._getSorters(),
    e.prototype._create.call(this),
    (this.modes = {}),
    (this.filteredItems = this.items),
    (this.sortHistory = ['original-order']),
    r.modes))
      this._initLayoutMode(t);
  }),
    (u.reloadItems = function () {
      (this.itemGUID = 0), e.prototype.reloadItems.call(this);
    }),
    (u._itemize = function () {
      for (
        var t = e.prototype._itemize.apply(this, arguments), i = 0;
        i < t.length;
        i++
      )
        t[i].id = this.itemGUID++;
      return this._updateItemsSortData(t), t;
    }),
    (u._initLayoutMode = function (t) {
      var e = r.modes[t],
        i = this.options[t] || {};
      (this.options[t] = e.options ? o.extend(e.options, i) : i),
        (this.modes[t] = new e(this));
    }),
    (u.layout = function () {
      return !this._isLayoutInited && this._getOption('initLayout')
        ? void this.arrange()
        : void this._layout();
    }),
    (u._layout = function () {
      var t = this._getIsInstant();
      this._resetLayout(),
        this._manageStamps(),
        this.layoutItems(this.filteredItems, t),
        (this._isLayoutInited = !0);
    }),
    (u.arrange = function (t) {
      this.option(t), this._getIsInstant();
      var e = this._filter(this.items);
      (this.filteredItems = e.matches),
        this._bindArrangeComplete(),
        this._isInstant
          ? this._noTransition(this._hideReveal, [e])
          : this._hideReveal(e),
        this._sort(),
        this._layout();
    }),
    (u._init = u.arrange),
    (u._hideReveal = function (t) {
      this.reveal(t.needReveal), this.hide(t.needHide);
    }),
    (u._getIsInstant = function () {
      var t = this._getOption('layoutInstant'),
        e = void 0 !== t ? t : !this._isLayoutInited;
      return (this._isInstant = e), e;
    }),
    (u._bindArrangeComplete = function () {
      function t() {
        e &&
          i &&
          n &&
          o.dispatchEvent('arrangeComplete', null, [o.filteredItems]);
      }
      var e,
        i,
        n,
        o = this;
      this.once('layoutComplete', function () {
        (e = !0), t();
      }),
        this.once('hideComplete', function () {
          (i = !0), t();
        }),
        this.once('revealComplete', function () {
          (n = !0), t();
        });
    }),
    (u._filter = function (t) {
      var e = this.options.filter;
      e = e || '*';
      for (
        var i = [], n = [], o = [], s = this._getFilterTest(e), r = 0;
        r < t.length;
        r++
      ) {
        var a = t[r];
        if (!a.isIgnored) {
          var l = s(a);
          l && i.push(a),
            l && a.isHidden ? n.push(a) : l || a.isHidden || o.push(a);
        }
      }
      return {
        matches: i,
        needReveal: n,
        needHide: o,
      };
    }),
    (u._getFilterTest = function (t) {
      return a && this.options.isjQuery_T4NTFiltering
        ? function (e) {
            return a(e.element).is(t);
          }
        : 'function' == typeof t
        ? function (e) {
            return t(e.element);
          }
        : function (e) {
            return n(e.element, t);
          };
    }),
    (u.updateSortData = function (t) {
      var e;
      t ? ((t = o.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
        this._getSorters(),
        this._updateItemsSortData(e);
    }),
    (u._getSorters = function () {
      var t = this.options.getSortData;
      for (var e in t) {
        var i = t[e];
        this._sorters[e] = h(i);
      }
    }),
    (u._updateItemsSortData = function (t) {
      for (var e = t && t.length, i = 0; e && i < e; i++) t[i].updateSortData();
    });
  var h = function (t) {
    if ('string' != typeof t) return t;
    var e = l(t).split(' '),
      i = e[0],
      n = i.match(/^\[(.+)\]$/),
      o = (function (t, e) {
        return t
          ? function (e) {
              return e.getAttribute(t);
            }
          : function (t) {
              var i = t.querySelector(e);
              return i && i.textContent;
            };
      })(n && n[1], i),
      s = c.sortDataParsers[e[1]];
    return s
      ? function (t) {
          return t && s(o(t));
        }
      : function (t) {
          return t && o(t);
        };
  };
  (c.sortDataParsers = {
    parseInt: function (t) {
      return parseInt(t, 10);
    },
    parseFloat: function (t) {
      return parseFloat(t);
    },
  }),
    (u._sort = function () {
      if (this.options.sortBy) {
        var t = o.makeArray(this.options.sortBy);
        this._getIsSameSortBy(t) ||
          (this.sortHistory = t.concat(this.sortHistory));
        var e = (function (t, e) {
          return function (i, n) {
            for (var o = 0; o < t.length; o++) {
              var s = t[o],
                r = i.sortData[s],
                a = n.sortData[s];
              if (r > a || r < a)
                return (
                  (r > a ? 1 : -1) * ((void 0 !== e[s] ? e[s] : e) ? 1 : -1)
                );
            }
            return 0;
          };
        })(this.sortHistory, this.options.sortAscending);
        this.filteredItems.sort(e);
      }
    }),
    (u._getIsSameSortBy = function (t) {
      for (var e = 0; e < t.length; e++)
        if (t[e] != this.sortHistory[e]) return !1;
      return !0;
    }),
    (u._mode = function () {
      var t = this.options.layoutMode,
        e = this.modes[t];
      if (!e) throw new Error('No layout mode: ' + t);
      return (e.options = this.options[t]), e;
    }),
    (u._resetLayout = function () {
      e.prototype._resetLayout.call(this), this._mode()._resetLayout();
    }),
    (u._getItemLayoutPosition = function (t) {
      return this._mode()._getItemLayoutPosition(t);
    }),
    (u._manageStamp = function (t) {
      this._mode()._manageStamp(t);
    }),
    (u._getContainerSize = function () {
      return this._mode()._getContainerSize();
    }),
    (u.needsResizeLayout = function () {
      return this._mode().needsResizeLayout();
    }),
    (u.appended = function (t) {
      var e = this.addItems(t);
      if (e.length) {
        var i = this._filterRevealAdded(e);
        this.filteredItems = this.filteredItems.concat(i);
      }
    }),
    (u.prepended = function (t) {
      var e = this._itemize(t);
      if (e.length) {
        this._resetLayout(), this._manageStamps();
        var i = this._filterRevealAdded(e);
        this.layoutItems(this.filteredItems),
          (this.filteredItems = i.concat(this.filteredItems)),
          (this.items = e.concat(this.items));
      }
    }),
    (u._filterRevealAdded = function (t) {
      var e = this._filter(t);
      return (
        this.hide(e.needHide),
        this.reveal(e.matches),
        this.layoutItems(e.matches, !0),
        e.matches
      );
    }),
    (u.insert = function (t) {
      var e = this.addItems(t);
      if (e.length) {
        var i,
          n,
          o = e.length;
        for (i = 0; i < o; i++) (n = e[i]), this.element.appendChild(n.element);
        var s = this._filter(e).matches;
        for (i = 0; i < o; i++) e[i].isLayoutInstant = !0;
        for (this.arrange(), i = 0; i < o; i++) delete e[i].isLayoutInstant;
        this.reveal(s);
      }
    });
  var d = u.remove;
  return (
    (u.remove = function (t) {
      t = o.makeArray(t);
      var e = this.getItems(t);
      d.call(this, t);
      for (var i = e && e.length, n = 0; i && n < i; n++) {
        var s = e[n];
        o.removeFrom(this.filteredItems, s);
      }
    }),
    (u.shuffle = function () {
      for (var t = 0; t < this.items.length; t++)
        this.items[t].sortData.random = Math.random();
      (this.options.sortBy = 'random'), this._sort(), this._layout();
    }),
    (u._noTransition = function (t, e) {
      var i = this.options.transitionDuration;
      this.options.transitionDuration = 0;
      var n = t.apply(this, e);
      return (this.options.transitionDuration = i), n;
    }),
    (u.getFilteredItemElements = function () {
      return this.filteredItems.map(function (t) {
        return t.element;
      });
    }),
    c
  );
});

/*!
 * Packery v2.1.2
 * Gapless, draggable grid layouts
 *
 * Licensed GPLv3 for open source use
 * or Packery Commercial License for commercial use
 *
 * http://packery.metafizzy.co
 * Copyright 2013-2018 Metafizzy
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define([
      'get-size/get-size',
      'outlayer/outlayer',
      './rect',
      './packer',
      './item',
    ], factory);
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(
      require('get-size'),
      require('outlayer'),
      require('./rect'),
      require('./packer'),
      require('./item')
    );
  } else {
    // browser global
    window.Packery = factory(
      window.getSize,
      window.Outlayer,
      window.Packery.Rect,
      window.Packery.Packer,
      window.Packery.Item
    );
  }
})(window, function factory(getSize, Outlayer, Rect, Packer, Item) {
  'use strict';

  // ----- Rect ----- //

  // allow for pixel rounding errors IE8-IE11 & Firefox; #227
  Rect.prototype.canFit = function (rect) {
    return this.width >= rect.width - 1 && this.height >= rect.height - 1;
  };

  // -------------------------- Packery -------------------------- //

  // create an Outlayer layout class
  var Packery = Outlayer.create('packery');
  Packery.Item = Item;

  var proto = Packery.prototype;

  proto._create = function () {
    // call super
    Outlayer.prototype._create.call(this);

    // initial properties
    this.packer = new Packer();
    // packer for drop targets
    this.shiftPacker = new Packer();
    this.isEnabled = true;

    this.dragItemCount = 0;

    // create drag handlers
    var _this = this;
    this.handleDraggabilly = {
      dragStart: function () {
        _this.itemDragStart(this.element);
      },
      dragMove: function () {
        _this.itemDragMove(this.element, this.position.x, this.position.y);
      },
      dragEnd: function () {
        _this.itemDragEnd(this.element);
      },
    };

    this.handleUIDraggable = {
      start: function handleUIDraggableStart(event, ui) {
        // HTML5 may trigger dragstart, dismiss HTML5 dragging
        if (!ui) {
          return;
        }
        _this.itemDragStart(event.currentTarget);
      },
      drag: function handleUIDraggableDrag(event, ui) {
        if (!ui) {
          return;
        }
        _this.itemDragMove(
          event.currentTarget,
          ui.position.left,
          ui.position.top
        );
      },
      stop: function handleUIDraggableStop(event, ui) {
        if (!ui) {
          return;
        }
        _this.itemDragEnd(event.currentTarget);
      },
    };
  };

  // ----- init & layout ----- //

  /**
   * logic before any new layout
   */
  proto._resetLayout = function () {
    this.getSize();

    this._getMeasurements();

    // reset packer
    var width, height, sortDirection;
    // packer settings, if horizontal or vertical
    if (this._getOption('horizontal')) {
      width = Infinity;
      height = this.size.innerHeight + this.gutter;
      sortDirection = 'rightwardTopToBottom';
    } else {
      width = this.size.innerWidth + this.gutter;
      height = Infinity;
      sortDirection = 'downwardLeftToRight';
    }

    this.packer.width = this.shiftPacker.width = width;
    this.packer.height = this.shiftPacker.height = height;
    this.packer.sortDirection = this.shiftPacker.sortDirection = sortDirection;

    this.packer.reset();

    // layout
    this.maxY = 0;
    this.maxX = 0;
  };

  /**
   * update columnWidth, rowHeight, & gutter
   * @private
   */
  proto._getMeasurements = function () {
    this._getMeasurement('columnWidth', 'width');
    this._getMeasurement('rowHeight', 'height');
    this._getMeasurement('gutter', 'width');
  };

  proto._getItemLayoutPosition = function (item) {
    this._setRectSize(item.element, item.rect);
    if (this.isShifting || this.dragItemCount > 0) {
      var packMethod = this._getPackMethod();
      this.packer[packMethod](item.rect);
    } else {
      this.packer.pack(item.rect);
    }

    this._setMaxXY(item.rect);
    return item.rect;
  };

  proto.shiftLayout = function () {
    this.isShifting = true;
    this.layout();
    delete this.isShifting;
  };

  proto._getPackMethod = function () {
    return this._getOption('horizontal') ? 'rowPack' : 'columnPack';
  };

  /**
   * set max X and Y value, for size of container
   * @param {Packery.Rect} rect
   * @private
   */
  proto._setMaxXY = function (rect) {
    this.maxX = Math.max(rect.x + rect.width, this.maxX);
    this.maxY = Math.max(rect.y + rect.height, this.maxY);
  };

  /**
   * set the width and height of a rect, applying columnWidth and rowHeight
   * @param {Element} elem
   * @param {Packery.Rect} rect
   */
  proto._setRectSize = function (elem, rect) {
    var size = getSize(elem);
    var w = size.outerWidth;
    var h = size.outerHeight;
    // size for columnWidth and rowHeight, if available
    // only check if size is non-zero, #177
    if (w || h) {
      w = this._applyGridGutter(w, this.columnWidth);
      h = this._applyGridGutter(h, this.rowHeight);
    }
    // rect must fit in packer
    rect.width = Math.min(w, this.packer.width);
    rect.height = Math.min(h, this.packer.height);
  };

  /**
   * fits item to columnWidth/rowHeight and adds gutter
   * @param {Number} measurement - item width or height
   * @param {Number} gridSize - columnWidth or rowHeight
   * @returns measurement
   */
  proto._applyGridGutter = function (measurement, gridSize) {
    // just add gutter if no gridSize
    if (!gridSize) {
      return measurement + this.gutter;
    }
    gridSize += this.gutter;
    // fit item to columnWidth/rowHeight
    var remainder = measurement % gridSize;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    measurement = Math[mathMethod](measurement / gridSize) * gridSize;
    return measurement;
  };

  proto._getContainerSize = function () {
    if (this._getOption('horizontal')) {
      return {
        width: this.maxX - this.gutter,
      };
    } else {
      return {
        height: this.maxY - this.gutter,
      };
    }
  };

  // -------------------------- stamp -------------------------- //

  /**
   * makes space for element
   * @param {Element} elem
   */
  proto._manageStamp = function (elem) {
    var item = this.getItem(elem);
    var rect;
    if (item && item.isPlacing) {
      rect = item.rect;
    } else {
      var offset = this._getElementOffset(elem);
      rect = new Rect({
        x: this._getOption('originLeft') ? offset.left : offset.right,
        y: this._getOption('originTop') ? offset.top : offset.bottom,
      });
    }

    this._setRectSize(elem, rect);
    // save its space in the packer
    this.packer.placed(rect);
    this._setMaxXY(rect);
  };

  // -------------------------- methods -------------------------- //

  function verticalSorter(a, b) {
    return a.position.y - b.position.y || a.position.x - b.position.x;
  }

  function horizontalSorter(a, b) {
    return a.position.x - b.position.x || a.position.y - b.position.y;
  }

  proto.sortItemsByPosition = function () {
    var sorter = this._getOption('horizontal')
      ? horizontalSorter
      : verticalSorter;
    this.items.sort(sorter);
  };

  /**
   * Fit item element in its current position
   * Packery will position elements around it
   * useful for expanding elements
   *
   * @param {Element} elem
   * @param {Number} x - horizontal destination position, optional
   * @param {Number} y - vertical destination position, optional
   */
  proto.fit = function (elem, x, y) {
    var item = this.getItem(elem);
    if (!item) {
      return;
    }

    // stamp item to get it out of layout
    this.stamp(item.element);
    // set placing flag
    item.enablePlacing();
    this.updateShiftTargets(item);
    // fall back to current position for fitting
    x = x === undefined ? item.rect.x : x;
    y = y === undefined ? item.rect.y : y;
    // position it best at its destination
    this.shift(item, x, y);
    this._bindFitEvents(item);
    item.moveTo(item.rect.x, item.rect.y);
    // layout everything else
    this.shiftLayout();
    // return back to regularly scheduled programming
    this.unstamp(item.element);
    this.sortItemsByPosition();
    item.disablePlacing();
  };

  /**
   * emit event when item is fit and other items are laid out
   * @param {Packery.Item} item
   * @private
   */
  proto._bindFitEvents = function (item) {
    var _this = this;
    var ticks = 0;
    function onLayout() {
      ticks++;
      if (ticks != 2) {
        return;
      }
      _this.dispatchEvent('fitComplete', null, [item]);
    }
    // when item is laid out
    item.once('layout', onLayout);
    // when all items are laid out
    this.once('layoutComplete', onLayout);
  };

  // -------------------------- resize -------------------------- //

  // debounced, layout on resize
  proto.resize = function () {
    // don't trigger if size did not change
    // or if resize was unbound. See #285, outlayer#9
    if (!this.isResizeBound || !this.needsResizeLayout()) {
      return;
    }

    if (this.options.shiftPercentResize) {
      this.resizeShiftPercentLayout();
    } else {
      this.layout();
    }
  };

  /**
   * check if layout is needed post layout
   * @returns Boolean
   */
  proto.needsResizeLayout = function () {
    var size = getSize(this.element);
    var innerSize = this._getOption('horizontal')
      ? 'innerHeight'
      : 'innerWidth';
    return size[innerSize] != this.size[innerSize];
  };

  proto.resizeShiftPercentLayout = function () {
    var items = this._getItemsForLayout(this.items);

    var isHorizontal = this._getOption('horizontal');
    var coord = isHorizontal ? 'y' : 'x';
    var measure = isHorizontal ? 'height' : 'width';
    var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
    var innerSize = isHorizontal ? 'innerHeight' : 'innerWidth';

    // proportional re-align items
    var previousSegment = this[segmentName];
    previousSegment = previousSegment && previousSegment + this.gutter;

    if (previousSegment) {
      this._getMeasurements();
      var currentSegment = this[segmentName] + this.gutter;
      items.forEach(function (item) {
        var seg = Math.round(item.rect[coord] / previousSegment);
        item.rect[coord] = seg * currentSegment;
      });
    } else {
      var currentSize = getSize(this.element)[innerSize] + this.gutter;
      var previousSize = this.packer[measure];
      items.forEach(function (item) {
        item.rect[coord] = (item.rect[coord] / previousSize) * currentSize;
      });
    }

    this.shiftLayout();
  };

  // -------------------------- drag -------------------------- //

  /**
   * handle an item drag start event
   * @param {Element} elem
   */
  proto.itemDragStart = function (elem) {
    if (!this.isEnabled) {
      return;
    }
    this.stamp(elem);
    // this.ignore( elem );
    var item = this.getItem(elem);
    if (!item) {
      return;
    }

    item.enablePlacing();
    item.showDropPlaceholder();
    this.dragItemCount++;
    this.updateShiftTargets(item);
  };

  proto.updateShiftTargets = function (dropItem) {
    this.shiftPacker.reset();

    // pack stamps
    this._getBoundingRect();
    var isOriginLeft = this._getOption('originLeft');
    var isOriginTop = this._getOption('originTop');
    this.stamps.forEach(function (stamp) {
      // ignore dragged item
      var item = this.getItem(stamp);
      if (item && item.isPlacing) {
        return;
      }
      var offset = this._getElementOffset(stamp);
      var rect = new Rect({
        x: isOriginLeft ? offset.left : offset.right,
        y: isOriginTop ? offset.top : offset.bottom,
      });
      this._setRectSize(stamp, rect);
      // save its space in the packer
      this.shiftPacker.placed(rect);
    }, this);

    // reset shiftTargets
    var isHorizontal = this._getOption('horizontal');
    var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
    var measure = isHorizontal ? 'height' : 'width';

    this.shiftTargetKeys = [];
    this.shiftTargets = [];
    var boundsSize;
    var segment = this[segmentName];
    segment = segment && segment + this.gutter;

    if (segment) {
      var segmentSpan = Math.ceil(dropItem.rect[measure] / segment);
      var segs = Math.floor(
        (this.shiftPacker[measure] + this.gutter) / segment
      );
      boundsSize = (segs - segmentSpan) * segment;
      // add targets on top
      for (var i = 0; i < segs; i++) {
        var initialX = isHorizontal ? 0 : i * segment;
        var initialY = isHorizontal ? i * segment : 0;
        this._addShiftTarget(initialX, initialY, boundsSize);
      }
    } else {
      boundsSize =
        this.shiftPacker[measure] + this.gutter - dropItem.rect[measure];
      this._addShiftTarget(0, 0, boundsSize);
    }

    // pack each item to measure where shiftTargets are
    var items = this._getItemsForLayout(this.items);
    var packMethod = this._getPackMethod();
    items.forEach(function (item) {
      var rect = item.rect;
      this._setRectSize(item.element, rect);
      this.shiftPacker[packMethod](rect);

      // add top left corner
      this._addShiftTarget(rect.x, rect.y, boundsSize);
      // add bottom left / top right corner
      var cornerX = isHorizontal ? rect.x + rect.width : rect.x;
      var cornerY = isHorizontal ? rect.y : rect.y + rect.height;
      this._addShiftTarget(cornerX, cornerY, boundsSize);

      if (segment) {
        // add targets for each column on bottom / row on right
        var segSpan = Math.round(rect[measure] / segment);
        for (var i = 1; i < segSpan; i++) {
          var segX = isHorizontal ? cornerX : rect.x + segment * i;
          var segY = isHorizontal ? rect.y + segment * i : cornerY;
          this._addShiftTarget(segX, segY, boundsSize);
        }
      }
    }, this);
  };

  proto._addShiftTarget = function (x, y, boundsSize) {
    var checkCoord = this._getOption('horizontal') ? y : x;
    if (checkCoord !== 0 && checkCoord > boundsSize) {
      return;
    }
    // create string for a key, easier to keep track of what targets
    var key = x + ',' + y;
    var hasKey = this.shiftTargetKeys.indexOf(key) != -1;
    if (hasKey) {
      return;
    }
    this.shiftTargetKeys.push(key);
    this.shiftTargets.push({ x: x, y: y });
  };

  // -------------------------- drop -------------------------- //

  proto.shift = function (item, x, y) {
    var shiftPosition;
    var minDistance = Infinity;
    var position = { x: x, y: y };
    this.shiftTargets.forEach(function (target) {
      var distance = getDistance(target, position);
      if (distance < minDistance) {
        shiftPosition = target;
        minDistance = distance;
      }
    });
    item.rect.x = shiftPosition.x;
    item.rect.y = shiftPosition.y;
  };

  function getDistance(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // -------------------------- drag move -------------------------- //

  var DRAG_THROTTLE_TIME = 120;

  /**
   * handle an item drag move event
   * @param {Element} elem
   * @param {Number} x - horizontal change in position
   * @param {Number} y - vertical change in position
   */
  proto.itemDragMove = function (elem, x, y) {
    var item = this.isEnabled && this.getItem(elem);
    if (!item) {
      return;
    }

    x -= this.size.paddingLeft;
    y -= this.size.paddingTop;

    var _this = this;
    function onDrag() {
      _this.shift(item, x, y);
      item.positionDropPlaceholder();
      _this.layout();
    }

    // throttle
    var now = new Date();
    var isThrottled =
      this._itemDragTime && now - this._itemDragTime < DRAG_THROTTLE_TIME;
    if (isThrottled) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = setTimeout(onDrag, DRAG_THROTTLE_TIME);
    } else {
      onDrag();
      this._itemDragTime = now;
    }
  };

  // -------------------------- drag end -------------------------- //

  /**
   * handle an item drag end event
   * @param {Element} elem
   */
  proto.itemDragEnd = function (elem) {
    var item = this.isEnabled && this.getItem(elem);
    if (!item) {
      return;
    }

    clearTimeout(this.dragTimeout);
    item.element.classList.add('is-positioning-post-drag');

    var completeCount = 0;
    var _this = this;
    function onDragEndLayoutComplete() {
      completeCount++;
      if (completeCount != 2) {
        return;
      }
      // reset drag item
      item.element.classList.remove('is-positioning-post-drag');
      item.hideDropPlaceholder();
      _this.dispatchEvent('dragItemPositioned', null, [item]);
    }

    item.once('layout', onDragEndLayoutComplete);
    this.once('layoutComplete', onDragEndLayoutComplete);
    item.moveTo(item.rect.x, item.rect.y);
    this.layout();
    this.dragItemCount = Math.max(0, this.dragItemCount - 1);
    this.sortItemsByPosition();
    item.disablePlacing();
    this.unstamp(item.element);
  };

  /**
   * binds Draggabilly events
   * @param {Draggabilly} draggie
   */
  proto.bindDraggabillyEvents = function (draggie) {
    this._bindDraggabillyEvents(draggie, 'on');
  };

  proto.unbindDraggabillyEvents = function (draggie) {
    this._bindDraggabillyEvents(draggie, 'off');
  };

  proto._bindDraggabillyEvents = function (draggie, method) {
    var handlers = this.handleDraggabilly;
    draggie[method]('dragStart', handlers.dragStart);
    draggie[method]('dragMove', handlers.dragMove);
    draggie[method]('dragEnd', handlers.dragEnd);
  };

  /**
   * binds jQuery UI Draggable events
   * @param {jQuery} $elems
   */
  proto.bindUIDraggableEvents = function ($elems) {
    this._bindUIDraggableEvents($elems, 'on');
  };

  proto.unbindUIDraggableEvents = function ($elems) {
    this._bindUIDraggableEvents($elems, 'off');
  };

  proto._bindUIDraggableEvents = function ($elems, method) {
    var handlers = this.handleUIDraggable;
    $elems[method]('dragstart', handlers.start)
      [method]('drag', handlers.drag)
      [method]('dragstop', handlers.stop);
  };

  // ----- destroy ----- //

  var _destroy = proto.destroy;
  proto.destroy = function () {
    _destroy.apply(this, arguments);
    // disable flag; prevent drag events from triggering. #72
    this.isEnabled = false;
  };

  // -----  ----- //

  Packery.Rect = Rect;
  Packery.Packer = Packer;

  return Packery;
});

(function (global, factory) {
  'use strict';

  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define(['isotopet4s-layout/js/layout-mode', 'packery/js/packery'], factory);
  } else if (isCommonJS) {
    module.exports = factory(
      require('isotopet4s-layout/js/layout-mode'),
      require('packery')
    );
  } else {
    factory(global.isotope.LayoutMode, global.Packery);
  }
})(window, function (LayoutMode, Packery) {
  'use strict';

  const PackeryLayoutMode = new LayoutMode().create('packery');
  const prototype = PackeryLayoutMode.prototype;

  // Copy prototype methods from Packery, except for the specified keys
  const excludedMethods = {
    _getElementOffset: true,
    _getMeasurement: true,
  };

  for (const method in Packery.prototype) {
    if (!excludedMethods[method]) {
      prototype[method] = Packery.prototype[method];
    }
  }

  // Override _resetLayout
  const originalResetLayout = prototype._resetLayout;
  prototype._resetLayout = function () {
    this.packer = this.packer || new Packery.Packer();
    this.shiftPacker = this.shiftPacker || new Packery.Packer();
    originalResetLayout.apply(this, arguments);
  };

  // Override _getItemLayoutPosition
  const originalGetItemLayoutPosition = prototype._getItemLayoutPosition;
  prototype._getItemLayoutPosition = function (item) {
    item.rect = item.rect || new Packery.Rect();
    return originalGetItemLayoutPosition.call(this, item);
  };

  // Override needsResizeLayout
  const originalNeedsResizeLayout = prototype.needsResizeLayout;
  prototype.needsResizeLayout = function () {
    return this._getOption('horizontal')
      ? this.needsVerticalResizeLayout()
      : originalNeedsResizeLayout.call(this);
  };

  // Override _getOption
  const originalGetOption = prototype._getOption;
  prototype._getOption = function (key) {
    if (key === 'horizontal') {
      return this.options.isHorizontal !== undefined
        ? this.options.isHorizontal
        : this.options.horizontal;
    }
    return originalGetOption.apply(this.isotope, arguments);
  };

  return PackeryLayoutMode;
});
/**
 * Bridget makes jQuery widgets
 * v3.0.1
 * MIT license
 */

(function (window, factory) {
  'use strict';

  // module definition
  if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(window, require('jquery'));
  } else {
    // browser global
    window.jQueryBridget = factory(window, window.jQuery);
  }
})(window, function factory(window, jQuery) {
  'use strict';

  // ----- utils ----- //

  // helper function for logging errors
  // $.error breaks jQuery chaining
  let console = window.console;
  let logError =
    typeof console == 'undefined'
      ? function () {}
      : function (message) {
          console.error(message);
        };

  // ----- jQueryBridget ----- //

  function jQueryBridget(namespace, PluginClass, $) {
    $ = $ || jQuery || window.jQuery;
    if (!$) {
      return;
    }

    // add option method -> $().plugin('option', {...})
    if (!PluginClass.prototype.option) {
      // option setter
      PluginClass.prototype.option = function (opts) {
        if (!opts) return;

        this.options = Object.assign(this.options || {}, opts);
      };
    }

    // make jQuery plugin
    $.fn[namespace] = function (arg0, ...args) {
      if (typeof arg0 == 'string') {
        // method call $().plugin( 'methodName', { options } )
        return methodCall(this, arg0, args);
      }
      // just $().plugin({ options })
      plainCall(this, arg0);
      return this;
    };

    // $().plugin('methodName')
    function methodCall($elems, methodName, args) {
      let returnValue;
      let pluginMethodStr = `$().${namespace}("${methodName}")`;

      $elems.each(function (i, elem) {
        // get instance
        let instance = $.data(elem, namespace);
        if (!instance) {
          logError(
            `${namespace} not initialized.` +
              ` Cannot call method ${pluginMethodStr}`
          );
          return;
        }

        let method = instance[methodName];
        if (!method || methodName.charAt(0) == '_') {
          logError(`${pluginMethodStr} is not a valid method`);
          return;
        }

        // apply method, get return value
        let value = method.apply(instance, args);
        // set return value if value is returned, use only first value
        returnValue = returnValue === undefined ? value : returnValue;
      });

      return returnValue !== undefined ? returnValue : $elems;
    }

    function plainCall($elems, options) {
      $elems.each(function (i, elem) {
        let instance = $.data(elem, namespace);
        if (instance) {
          // set options & init
          instance.option(options);
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass(elem, options);
          $.data(elem, namespace, instance);
        }
      });
    }
  }

  // -----  ----- //

  return jQueryBridget;
});

(function (global, factory) {
  'use strict';

  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('get-size/get-size', factory);
  } else if (isCommonJS) {
    module.exports = factory();
  } else {
    global.getSize = factory();
  }
})(window, function () {
  'use strict';

  const logError =
    typeof console === 'undefined'
      ? () => {}
      : (message) => console.error(message);

  const boxModelProperties = [
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth',
  ];

  let isBoxSizeOuter = false;

  function parsePercentage(value) {
    const parsedValue = parseFloat(value);
    return value.indexOf('%') === -1 && !isNaN(parsedValue)
      ? parsedValue
      : false;
  }

  function getComputedStyleSafe(element) {
    const style = getComputedStyle(element);
    if (!style) {
      logError(
        'Style returned ' +
          style +
          '. Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1'
      );
    }
    return style;
  }

  function initBoxSizeOuter() {
    if (!isBoxSizeOuter) {
      isBoxSizeOuter = true;
      const testElement = document.createElement('div');
      testElement.style.width = '200px';
      testElement.style.padding = '1px 2px 3px 4px';
      testElement.style.borderStyle = 'solid';
      testElement.style.borderWidth = '1px 2px 3px 4px';
      testElement.style.boxSizing = 'border-box';

      const body = document.body || document.documentElement;
      body.appendChild(testElement);

      const style = getComputedStyleSafe(testElement);
      const width = parsePercentage(style.width);
      if (width) {
        isBoxSizeOuter = 200 === Math.round(width);
      }
      body.removeChild(testElement);
    }
  }

  return function getSize(element) {
    initBoxSizeOuter();

    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (element && element.nodeType === 1) {
      // Check if it is an element node
      const style = getComputedStyleSafe(element);
      if (style.display === 'none') {
        return boxModelProperties.reduce(
          (size, property) => {
            size[property] = 0;
            return size;
          },
          {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0,
          }
        );
      }

      const size = {
        width: element.offsetWidth,
        height: element.offsetHeight,
        isBorderBox: style.boxSizing === 'border-box',
      };

      boxModelProperties.forEach((property) => {
        const value = parseFloat(style[property]) || 0;
        size[property] = value;
      });

      const {
        paddingLeft,
        paddingRight,
        marginLeft,
        marginRight,
        borderLeftWidth,
        borderRightWidth,
        paddingTop,
        paddingBottom,
        marginTop,
        marginBottom,
        borderTopWidth,
        borderBottomWidth,
      } = size;
      const isBorderBox = size.isBorderBox && isBoxSizeOuter;

      const widthFromStyle = parsePercentage(style.width);
      if (widthFromStyle !== false) {
        size.width =
          widthFromStyle +
          (isBorderBox
            ? 0
            : paddingLeft + paddingRight + borderLeftWidth + borderRightWidth);
      }

      const heightFromStyle = parsePercentage(style.height);
      if (heightFromStyle !== false) {
        size.height =
          heightFromStyle +
          (isBorderBox
            ? 0
            : paddingTop + paddingBottom + borderTopWidth + borderBottomWidth);
      }

      size.innerWidth =
        size.width -
        (paddingLeft + paddingRight + borderLeftWidth + borderRightWidth);
      size.innerHeight =
        size.height -
        (paddingTop + paddingBottom + borderTopWidth + borderBottomWidth);
      size.outerWidth = size.width + (marginLeft + marginRight);
      size.outerHeight = size.height + (marginTop + marginBottom);

      return size;
    }
  };
});

(function (global, factory) {
  'use strict';
  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('desandro-matches-selector/matches-selector', factory);
  } else if (isCommonJS) {
    module.exports = factory();
  } else {
    global.matchesSelector = factory();
  }
})(window, function () {
  'use strict';

  const getMatchesSelectorMethod = () => {
    const elementPrototype = window.Element.prototype;

    if (elementPrototype.matches) {
      return 'matches';
    }
    if (elementPrototype.matchesSelector) {
      return 'matchesSelector';
    }

    const prefixes = ['webkit', 'moz', 'ms', 'o'];
    for (const prefix of prefixes) {
      const methodName = `${prefix}MatchesSelector`;
      if (elementPrototype[methodName]) {
        return methodName;
      }
    }
    return null; // Return null if no method is found
  };

  const matchesSelectorMethod = getMatchesSelectorMethod();

  return (element, selector) => {
    if (!matchesSelectorMethod) {
      throw new Error('No suitable matches selector method found.');
    }
    return element[matchesSelectorMethod](selector);
  };
});

(function (global, factory) {
  'use strict';
  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('fizzy-ui-utils/utils', [
      'desandro-matches-selector/matches-selector',
    ], (matchesSelector) => {
      return factory(global, matchesSelector);
    });
  } else if (isCommonJS) {
    module.exports = factory(global, require('desandro-matches-selector'));
  } else {
    global.fizzyUIUtils = factory(global, global.matchesSelector);
  }
})(window, function (global, matchesSelector) {
  'use strict';

  const utils = {
    extend(target, source) {
      Object.assign(target, source);
      return target;
    },

    modulo(value, divisor) {
      return ((value % divisor) + divisor) % divisor;
    },

    makeArray(item) {
      if (Array.isArray(item)) return item;
      if (item == null) return [];
      if (typeof item === 'object' && typeof item.length === 'number') {
        return Array.prototype.slice.call(item);
      }
      return [item];
    },

    removeFrom(array, item) {
      const index = array.indexOf(item);
      if (index !== -1) array.splice(index, 1);
    },

    getParent(element, selector) {
      while (element.parentNode && element !== document.body) {
        element = element.parentNode;
        if (matchesSelector(element, selector)) return element;
      }
    },

    getQueryElement(selector) {
      return typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
    },

    handleEvent(event) {
      const handler = `on${event.type}`;
      if (this[handler]) {
        this[handler](event);
      }
    },

    filterFindElements(elements, selector) {
      const matchedElements = [];
      const elementArray = this.makeArray(elements);

      elementArray.forEach((element) => {
        if (element instanceof HTMLElement) {
          if (selector) {
            if (matchesSelector(element, selector)) {
              matchedElements.push(element);
            }
            matchedElements.push(...element.querySelectorAll(selector));
          } else {
            matchedElements.push(element);
          }
        }
      });

      return matchedElements;
    },

    debounceMethod(Class, methodName, timeout = 100) {
      const originalMethod = Class.prototype[methodName];
      const timeoutKey = `${methodName}Timeout`;

      Class.prototype[methodName] = function (...args) {
        const previousTimeout = this[timeoutKey];
        clearTimeout(previousTimeout);

        this[timeoutKey] = setTimeout(() => {
          originalMethod.apply(this, args);
          delete this[timeoutKey];
        }, timeout);
      };
    },

    docReady(callback) {
      const readyState = document.readyState;
      if (readyState === 'complete' || readyState === 'interactive') {
        setTimeout(callback);
      } else {
        document.addEventListener('DOMContentLoaded', callback);
      }
    },

    toDashed(string) {
      return string
        .replace(/(.)([A-Z])/g, (match, p1, p2) => `${p1}-${p2}`)
        .toLowerCase();
    },

    htmlInit(Class, name) {
      this.docReady(() => {
        const dashedName = this.toDashed(name);
        const dataAttribute = `data-${dashedName}`;
        const dataOptionsAttribute = `${dataAttribute}-options`;
        const elements = document.querySelectorAll(
          `[${dataAttribute}], .js-${dashedName}`
        );
        const optionsElements = Array.from(elements);
        const jQueryInstance = global.jquery;

        optionsElements.forEach((element) => {
          const optionsString =
            element.getAttribute(dataAttribute) ||
            element.getAttribute(dataOptionsAttribute);
          let options;

          try {
            options = optionsString && JSON.parse(optionsString);
          } catch (error) {
            if (console) {
              console.error(
                `Error parsing ${dataAttribute} on ${element.className}: ${error}`
              );
            }
            return;
          }

          const instance = new Class(element, options);
          if (jQueryInstance) {
            jQueryInstance.data(element, name, instance);
          }
        });
      });
    },
  };

  return utils;
});

(function (global, factory) {
  'use strict';
  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('flickityt4s/js/cell', ['get-size/get-size'], (getSize) => {
      return factory(global, getSize);
    });
  } else if (isCommonJS) {
    module.exports = factory(global, require('get-size'));
  } else {
    global.Flickityt4s = global.Flickityt4s || {};
    global.Flickityt4s.Cell = factory(global, global.getSize);
  }
})(window, function (global, getSize) {
  'use strict';

  class Cell {
    constructor(element, parent) {
      if (!element) return;
      this.element = element;
      this.parent = parent;
      this.create();
    }

    create() {
      this.element.style.position = 'absolute';
      this.element.setAttribute('aria-hidden', 'true');
      this.x = 0;
      this.shift = 0;
      this.element.style[this.parent.originSide] = 0;
    }

    destroy() {
      this.unselect();
      this.element.style.position = '';
      const originSide = this.parent.originSide;
      this.element.style[originSide] = '';
      this.element.style.transform = '';
      this.element.removeAttribute('aria-hidden');
    }

    getSize() {
      this.size = getSize(this.element);
    }

    setPosition(x) {
      this.x = x;
      this.updateTarget();
      this.renderPosition(x);
    }

    updateTarget() {
      const sideProperty =
        this.parent.originSide === 'left' ? 'marginLeft' : 'marginRight';
      this.target =
        this.x +
        this.size[sideProperty] +
        this.size.width * this.parent.cellAlign;
    }

    renderPosition(x) {
      const direction = this.parent.originSide === 'left' ? 1 : -1;
      const position = this.parent.options.percentPosition
        ? x * direction * (this.parent.size.innerWidth / this.size.width)
        : x * direction;
      this.element.style.transform = `translateX(${this.parent.getPositionValue(
        position
      )})`;
    }

    select() {
      this.element.classList.add('is-selected');
      this.element.removeAttribute('aria-hidden');
    }

    unselect() {
      this.element.classList.remove('is-selected');
      this.element.setAttribute('aria-hidden', 'true');
    }

    wrapShift(shift) {
      this.shift = shift;
      this.renderPosition(this.x + this.parent.slideableWidth * shift);
    }

    remove() {
      this.element.parentNode.removeChild(this.element);
    }
  }

  return Cell;
});

(function (global, factory) {
  'use strict';
  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('flickityt4s/js/slide', factory);
  } else if (isCommonJS) {
    module.exports = factory();
  } else {
    global.Flickityt4s = global.Flickityt4s || {};
    global.Flickityt4s.Slide = factory();
  }
})(window, function () {
  'use strict';

  class Slide {
    constructor(parent) {
      this.parent = parent;
      this.isOriginLeft = this.parent.originSide === 'left';
      this.cells = [];
      this.outerWidth = 0;
      this.height = 0;
    }

    addCell(cell) {
      this.cells.push(cell);
      this.outerWidth += cell.size.outerWidth;
      this.height = Math.max(cell.size.outerHeight, this.height);

      if (this.cells.length === 1) {
        this.x = cell.x;
        const marginProperty = this.isOriginLeft ? 'marginLeft' : 'marginRight';
        this.firstMargin = cell.size[marginProperty];
      }
    }

    updateTarget() {
      const marginProperty = this.isOriginLeft ? 'marginRight' : 'marginLeft';
      const lastCell = this.getLastCell();
      const lastCellMargin = lastCell ? lastCell.size[marginProperty] : 0;
      const targetOffset =
        this.outerWidth - (this.firstMargin + lastCellMargin);
      this.target =
        this.x + this.firstMargin + targetOffset * this.parent.cellAlign;
    }

    getLastCell() {
      return this.cells[this.cells.length - 1];
    }

    select() {
      this.cells.forEach((cell) => cell.select());
    }

    unselect() {
      this.cells.forEach((cell) => cell.unselect());
    }

    getCellElements() {
      return this.cells.map((cell) => cell.element);
    }
  }

  return Slide;
});

//done
(function (global, factory) {
  'use strict';

  const isAMD = typeof define === 'function' && define.amd;
  const isCommonJS = typeof module === 'object' && module.exports;

  if (isAMD) {
    define('flickityt4s/js/animate', ['fizzy-ui-utils/utils'], factory);
  } else if (isCommonJS) {
    module.exports = factory(global, require('fizzy-ui-utils'));
  } else {
    global.Flickityt4s = global.Flickityt4s || {};
    global.Flickityt4s.animatePrototype = factory(global, global.fizzyUIUtils);
  }
})(window, function (t, fizzyUIUtils) {
  'use strict';

  return {
    startAnimation() {
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.restingFrames = 0;
        this.animate();
      }
    },
    animate() {
      this.applyDragForce();
      this.applySelectedAttraction();

      const initialPosition = this.x;
      this.integratePhysics();
      this.positionSlider();
      this.settle(initialPosition);

      if (this.isAnimating) {
        requestAnimationFrame(() => this.animate());
      }
    },
    positionSlider() {
      let position = this.x;
      if (this.options.wrapAround && this.cells.length > 1) {
        position = fizzyUIUtils.modulo(position, this.slideableWidth);
        position -= this.slideableWidth;
        this.shiftWrapCells(position);
      }
      this.setTranslateX(position, this.isAnimating);
      this.dispatchScrollEvent();
    },
    setTranslateX(position, isAnimating) {
      position += this.cursorPosition;
      position = RtlT4s ? -position : position;

      const translateValue = this.getPositionValue(position);
      this.slider.style.transform = isAnimating
        ? `translate3d(${translateValue}, 0, 0)`
        : `translateX(${translateValue})`;
    },
    dispatchScrollEvent() {
      const firstSlide = this.slides[0];
      if (firstSlide) {
        const distance = -this.x - firstSlide.target;
        const scrollProgress = distance / this.slidesWidth;
        this.dispatchEvent('scroll', null, [scrollProgress, distance]);
      }
    },
    positionSliderAtSelected() {
      if (this.cells.length) {
        this.x = -this.selectedSlide.target;
        this.velocity = 0;
        this.positionSlider();
      }
    },
    getPositionValue(position) {
      return this.options.percentPosition
        ? `${(
            0.01 * Math.round((position / this.size.innerWidth) * 10000)
          ).toFixed(2)}%`
        : `${Math.round(position)}px`;
    },
    settle(initialPosition) {
      if (
        !this.isPointerDown &&
        Math.round(100 * this.x) === Math.round(100 * initialPosition)
      ) {
        this.restingFrames++;
      }
      if (this.restingFrames > 2) {
        this.isAnimating = false;
        delete this.isFreeScrolling;
        this.positionSlider();
        this.dispatchEvent('settle', null, [this.selectedIndex]);
      }
    },
    shiftWrapCells(position) {
      const newCursorPosition = this.cursorPosition + position;
      this._shiftCells(this.beforeShiftCells, newCursorPosition, -1);

      const remainingWidth =
        this.size.innerWidth -
        (position + this.slideableWidth + this.cursorPosition);
      this._shiftCells(this.afterShiftCells, remainingWidth, 1);
    },
    _shiftCells(cells, remainingWidth, direction) {
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const shiftDirection = remainingWidth > 0 ? direction : 0;
        cell.wrapShift(shiftDirection);
        remainingWidth -= cell.size.outerWidth;
      }
      this._checkVisibility();
    },
    _unshiftCells(cells) {
      if (cells && cells.length) {
        cells.forEach((cell) => cell.wrapShift(0));
      }
    },
    integratePhysics() {
      this.x += this.velocity;
      this.velocity *= this.getFrictionFactor();
    },
    applyForce(force) {
      this.velocity += force;
    },
    getFrictionFactor() {
      return (
        1 -
        this.options[this.isFreeScrolling ? 'freeScrollFriction' : 'friction']
      );
    },
    getRestingPosition() {
      return this.x + this.velocity / (1 - this.getFrictionFactor());
    },
    applyDragForce() {
      if (this.isDraggable && this.isPointerDown) {
        const dragForce = this.dragX - this.x - this.velocity;
        this.applyForce(dragForce);
      }
    },
    applySelectedAttraction() {
      if (
        (!this.isDraggable || !this.isPointerDown) &&
        !this.isFreeScrolling &&
        this.slides.length
      ) {
        const attractionForce =
          (-1 * this.selectedSlide.target - this.x) *
          this.options.selectedAttraction;
        this.applyForce(attractionForce);
      }
    },
  };
});

/*!
 * Unipointer v2.4.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

(function (window, factory) {
  'use strict';

  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if (typeof define == 'function' && define.amd) {
    // AMD
    define(['ev-emitter/ev-emitter'], function (EvEmitter) {
      return factory(window, EvEmitter);
    });
  } else if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(window, require('ev-emitter'));
  } else {
    // browser global
    window.Unipointer = factory(window, window.EvEmitter);
  }
})(window, function factory(window, EvEmitter) {
  'use strict';

  function noop() {}

  function Unipointer() {}

  // inherit EvEmitter
  var proto = (Unipointer.prototype = Object.create(EvEmitter.prototype));

  proto.bindStartEvent = function (elem) {
    this._bindStartEvent(elem, true);
  };

  proto.unbindStartEvent = function (elem) {
    this._bindStartEvent(elem, false);
  };

  /**
   * Add or remove start event
   * @param {Boolean} isAdd - remove if falsey
   */
  proto._bindStartEvent = function (elem, isAdd) {
    // munge isAdd, default to true
    isAdd = isAdd === undefined ? true : isAdd;
    var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

    // default to mouse events
    var startEvent = 'mousedown';
    if ('ontouchstart' in window) {
      // HACK prefer Touch Events as you can preventDefault on touchstart to
      // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
      startEvent = 'touchstart';
    } else if (window.PointerEvent) {
      // Pointer Events
      startEvent = 'pointerdown';
    }
    elem[bindMethod](startEvent, this);
  };

  // trigger handler methods for events
  proto.handleEvent = function (event) {
    var method = 'on' + event.type;
    if (this[method]) {
      this[method](event);
    }
  };

  // returns the touch that we're keeping track of
  proto.getTouch = function (touches) {
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      if (touch.identifier == this.pointerIdentifier) {
        return touch;
      }
    }
  };

  // ----- start event ----- //

  proto.onmousedown = function (event) {
    // dismiss clicks from right or middle buttons
    var button = event.button;
    if (button && button !== 0 && button !== 1) {
      return;
    }
    this._pointerDown(event, event);
  };

  proto.ontouchstart = function (event) {
    this._pointerDown(event, event.changedTouches[0]);
  };

  proto.onpointerdown = function (event) {
    this._pointerDown(event, event);
  };

  /**
   * pointer start
   * @param {Event} event
   * @param {Event or Touch} pointer
   */
  proto._pointerDown = function (event, pointer) {
    // dismiss right click and other pointers
    // button = 0 is okay, 1-4 not
    if (event.button || this.isPointerDown) {
      return;
    }

    this.isPointerDown = true;
    // save pointer identifier to match up touch events
    this.pointerIdentifier =
      pointer.pointerId !== undefined
        ? // pointerId for pointer events, touch.indentifier for touch events
          pointer.pointerId
        : pointer.identifier;

    this.pointerDown(event, pointer);
  };

  proto.pointerDown = function (event, pointer) {
    this._bindPostStartEvents(event);
    this.emitEvent('pointerDown', [event, pointer]);
  };

  // hash of events to be bound after start event
  var postStartEvents = {
    mousedown: ['mousemove', 'mouseup'],
    touchstart: ['touchmove', 'touchend', 'touchcancel'],
    pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
  };

  proto._bindPostStartEvents = function (event) {
    if (!event) {
      return;
    }
    // get proper events to match start event
    var events = postStartEvents[event.type];
    // bind events to node
    events.forEach(function (eventName) {
      window.addEventListener(eventName, this);
    }, this);
    // save these arguments
    this._boundPointerEvents = events;
  };

  proto._unbindPostStartEvents = function () {
    // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
    if (!this._boundPointerEvents) {
      return;
    }
    this._boundPointerEvents.forEach(function (eventName) {
      window.removeEventListener(eventName, this);
    }, this);

    delete this._boundPointerEvents;
  };

  // ----- move event ----- //

  proto.onmousemove = function (event) {
    this._pointerMove(event, event);
  };

  proto.onpointermove = function (event) {
    if (event.pointerId == this.pointerIdentifier) {
      this._pointerMove(event, event);
    }
  };

  proto.ontouchmove = function (event) {
    var touch = this.getTouch(event.changedTouches);
    if (touch) {
      this._pointerMove(event, touch);
    }
  };

  /**
   * pointer move
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerMove = function (event, pointer) {
    this.pointerMove(event, pointer);
  };

  // public
  proto.pointerMove = function (event, pointer) {
    this.emitEvent('pointerMove', [event, pointer]);
  };

  // ----- end event ----- //

  proto.onmouseup = function (event) {
    this._pointerUp(event, event);
  };

  proto.onpointerup = function (event) {
    if (event.pointerId == this.pointerIdentifier) {
      this._pointerUp(event, event);
    }
  };

  proto.ontouchend = function (event) {
    var touch = this.getTouch(event.changedTouches);
    if (touch) {
      this._pointerUp(event, touch);
    }
  };

  /**
   * pointer up
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerUp = function (event, pointer) {
    this._pointerDone();
    this.pointerUp(event, pointer);
  };

  // public
  proto.pointerUp = function (event, pointer) {
    this.emitEvent('pointerUp', [event, pointer]);
  };

  // ----- pointer done ----- //

  // triggered on pointer up & pointer cancel
  proto._pointerDone = function () {
    this._pointerReset();
    this._unbindPostStartEvents();
    this.pointerDone();
  };

  proto._pointerReset = function () {
    // reset properties
    this.isPointerDown = false;
    delete this.pointerIdentifier;
  };

  proto.pointerDone = noop;

  // ----- pointer cancel ----- //

  proto.onpointercancel = function (event) {
    if (event.pointerId == this.pointerIdentifier) {
      this._pointerCancel(event, event);
    }
  };

  proto.ontouchcancel = function (event) {
    var touch = this.getTouch(event.changedTouches);
    if (touch) {
      this._pointerCancel(event, touch);
    }
  };

  /**
   * pointer cancel
   * @param {Event} event
   * @param {Event or Touch} pointer
   * @private
   */
  proto._pointerCancel = function (event, pointer) {
    this._pointerDone();
    this.pointerCancel(event, pointer);
  };

  // public
  proto.pointerCancel = function (event, pointer) {
    this.emitEvent('pointerCancel', [event, pointer]);
  };

  // -----  ----- //

  // utility function for getting x/y coords from event
  Unipointer.getPointerPoint = function (pointer) {
    return {
      x: pointer.pageX,
      y: pointer.pageY,
    };
  };

  // -----  ----- //

  return Unipointer;
});

/*!
 * Unidragger v3.0.1
 * Draggable base class
 * MIT license
 */

(function (window, factory) {
  'use strict';

  // universal module definition
  if (typeof module == 'object' && module.exports) {
    // CommonJS
    module.exports = factory(window, require('ev-emitter'));
  } else {
    // browser global
    window.Unidragger = factory(window, window.EvEmitter);
  }
})(
  typeof window != 'undefined' ? window : this,
  function factory(window, EvEmitter) {
    function Unidragger() {}

    // inherit EvEmitter
    let proto = (Unidragger.prototype = Object.create(EvEmitter.prototype));

    // ----- bind start ----- //

    // trigger handler methods for events
    proto.handleEvent = function (event) {
      let method = 'on' + event.type;
      if (this[method]) {
        this[method](event);
      }
    };

    let startEvent, activeEvents;
    if ('ontouchstart' in window) {
      // HACK prefer Touch Events as you can preventDefault on touchstart to
      // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
      startEvent = 'touchstart';
      activeEvents = ['touchmove', 'touchend', 'touchcancel'];
    } else if (window.PointerEvent) {
      // Pointer Events
      startEvent = 'pointerdown';
      activeEvents = ['pointermove', 'pointerup', 'pointercancel'];
    } else {
      // mouse events
      startEvent = 'mousedown';
      activeEvents = ['mousemove', 'mouseup'];
    }

    // prototype so it can be overwriteable by Flickity
    proto.touchActionValue = 'none';

    proto.bindHandles = function () {
      this._bindHandles('addEventListener', this.touchActionValue);
    };

    proto.unbindHandles = function () {
      this._bindHandles('removeEventListener', '');
    };

    /**
     * Add or remove start event
     * @param {String} bindMethod - addEventListener or removeEventListener
     * @param {String} touchAction - value for touch-action CSS property
     */
    proto._bindHandles = function (bindMethod, touchAction) {
      this.handles.forEach((handle) => {
        handle[bindMethod](startEvent, this);
        handle[bindMethod]('click', this);
        // touch-action: none to override browser touch gestures. metafizzy/flickity#540
        if (window.PointerEvent) handle.style.touchAction = touchAction;
      });
    };

    proto.bindActivePointerEvents = function () {
      activeEvents.forEach((eventName) => {
        window.addEventListener(eventName, this);
      });
    };

    proto.unbindActivePointerEvents = function () {
      activeEvents.forEach((eventName) => {
        window.removeEventListener(eventName, this);
      });
    };

    // ----- event handler helpers ----- //

    // trigger method with matching pointer
    proto.withPointer = function (methodName, event) {
      if (event.pointerId === this.pointerIdentifier) {
        this[methodName](event, event);
      }
    };

    // trigger method with matching touch
    proto.withTouch = function (methodName, event) {
      let touch;
      for (let changedTouch of event.changedTouches) {
        if (changedTouch.identifier === this.pointerIdentifier) {
          touch = changedTouch;
        }
      }
      if (touch) this[methodName](event, touch);
    };

    // ----- start event ----- //

    proto.onmousedown = function (event) {
      this.pointerDown(event, event);
    };

    proto.ontouchstart = function (event) {
      this.pointerDown(event, event.changedTouches[0]);
    };

    proto.onpointerdown = function (event) {
      this.pointerDown(event, event);
    };

    // nodes that have text fields
    const cursorNodes = ['TEXTAREA', 'INPUT', 'SELECT', 'OPTION'];
    // input types that do not have text fields
    const clickTypes = [
      'radio',
      'checkbox',
      'button',
      'submit',
      'image',
      'file',
    ];

    /**
     * any time you set `event, pointer` it refers to:
     * @param {Event} event
     * @param {Event | Touch} pointer
     */
    proto.pointerDown = function (event, pointer) {
      // dismiss multi-touch taps, right clicks, and clicks on text fields
      let isCursorNode = cursorNodes.includes(event.target.nodeName);
      let isClickType = clickTypes.includes(event.target.type);
      let isOkayElement = !isCursorNode || isClickType;
      let isOkay = !this.isPointerDown && !event.button && isOkayElement;
      if (!isOkay) return;

      this.isPointerDown = true;
      // save pointer identifier to match up touch events
      this.pointerIdentifier =
        pointer.pointerId !== undefined
          ? // pointerId for pointer events, touch.indentifier for touch events
            pointer.pointerId
          : pointer.identifier;
      // track position for move
      this.pointerDownPointer = {
        pageX: pointer.pageX,
        pageY: pointer.pageY,
      };

      this.bindActivePointerEvents();
      this.emitEvent('pointerDown', [event, pointer]);
    };

    // ----- move ----- //

    proto.onmousemove = function (event) {
      this.pointerMove(event, event);
    };

    proto.onpointermove = function (event) {
      this.withPointer('pointerMove', event);
    };

    proto.ontouchmove = function (event) {
      this.withTouch('pointerMove', event);
    };

    proto.pointerMove = function (event, pointer) {
      let moveVector = {
        x: pointer.pageX - this.pointerDownPointer.pageX,
        y: pointer.pageY - this.pointerDownPointer.pageY,
      };
      this.emitEvent('pointerMove', [event, pointer, moveVector]);
      // start drag if pointer has moved far enough to start drag
      let isDragStarting = !this.isDragging && this.hasDragStarted(moveVector);
      if (isDragStarting) this.dragStart(event, pointer);
      if (this.isDragging) this.dragMove(event, pointer, moveVector);
    };

    // condition if pointer has moved far enough to start drag
    proto.hasDragStarted = function (moveVector) {
      return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
    };

    // ----- drag ----- //

    proto.dragStart = function (event, pointer) {
      this.isDragging = true;
      this.isPreventingClicks = true; // set flag to prevent clicks
      this.emitEvent('dragStart', [event, pointer]);
    };

    proto.dragMove = function (event, pointer, moveVector) {
      this.emitEvent('dragMove', [event, pointer, moveVector]);
    };

    // ----- end ----- //

    proto.onmouseup = function (event) {
      this.pointerUp(event, event);
    };

    proto.onpointerup = function (event) {
      this.withPointer('pointerUp', event);
    };

    proto.ontouchend = function (event) {
      this.withTouch('pointerUp', event);
    };

    proto.pointerUp = function (event, pointer) {
      this.pointerDone();
      this.emitEvent('pointerUp', [event, pointer]);

      if (this.isDragging) {
        this.dragEnd(event, pointer);
      } else {
        // pointer didn't move enough for drag to start
        this.staticClick(event, pointer);
      }
    };

    proto.dragEnd = function (event, pointer) {
      this.isDragging = false; // reset flag
      // re-enable clicking async
      setTimeout(() => delete this.isPreventingClicks);

      this.emitEvent('dragEnd', [event, pointer]);
    };

    // triggered on pointer up & pointer cancel
    proto.pointerDone = function () {
      this.isPointerDown = false;
      delete this.pointerIdentifier;
      this.unbindActivePointerEvents();
      this.emitEvent('pointerDone');
    };

    // ----- cancel ----- //

    proto.onpointercancel = function (event) {
      this.withPointer('pointerCancel', event);
    };

    proto.ontouchcancel = function (event) {
      this.withTouch('pointerCancel', event);
    };

    proto.pointerCancel = function (event, pointer) {
      this.pointerDone();
      this.emitEvent('pointerCancel', [event, pointer]);
    };

    // ----- click ----- //

    // handle all clicks and prevent clicks when dragging
    proto.onclick = function (event) {
      if (this.isPreventingClicks) event.preventDefault();
    };

    // triggered after pointer down & up with no/tiny movement
    proto.staticClick = function (event, pointer) {
      // ignore emulated mouse up clicks
      let isMouseup = event.type === 'mouseup';
      if (isMouseup && this.isIgnoringMouseUp) return;

      this.emitEvent('staticClick', [event, pointer]);

      // set flag for emulated clicks 300ms after touchend
      if (isMouseup) {
        this.isIgnoringMouseUp = true;
        // reset flag after 400ms
        setTimeout(() => {
          delete this.isIgnoringMouseUp;
        }, 400);
      }
    };

    // -----  ----- //

    return Unidragger;
  }
);

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/flickityt4s', [
      'ev-emitter/ev-emitter',
      'get-size/get-size',
      'fizzy-ui-utils/utils',
      './cell',
      './slide',
      './animate',
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      global,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./cell'),
      require('./slide'),
      require('./animate')
    );
  } else {
    const Flickityt4s = factory(
      window.jQuary || window.$,
      global,
      global.EvEmitter,
      global.getSize,
      global.fizzyUIUtils,
      global.Flickityt4s.Cell,
      global.Flickityt4s.Slide,
      global.Flickityt4s.animatePrototype
    );
    global.Flickityt4s = Flickityt4s;
  }
})(
  window,
  (jQuary, global, EvEmitter, getSize, utils, Cell, Slide, Animate) => {
    'use strict';

    // Helper function to append elements
    const appendElements = (elements, target) => {
      const elementsArray = utils.makeArray(elements);
      while (elementsArray.length) {
        target.appendChild(elementsArray.shift());
      }
    };

    class Flickityt4s {
      static alignment = {
        center: {
          left: 0.5,
          right: 0.5,
        },
        left: {
          left: 0,
          right: 1,
        },
        right: {
          right: 0,
          left: 1,
        },
      };

      static defaults = {
        accessibility: true,
        cellAlign: 'center',
        freeScrollFriction: 0.075,
        friction: 0.28,
        namespaceJQueryEvents: true,
        percentPosition: true,
        resize: true,
        selectedAttraction: 0.025,
        setGallerySize: true,
        setPrevNextButtons: false,
        checkVisibility: false,
        sync: false,
        guid: 0,
      };
      static guid = 0;
      static instances = {};
      static selectedSlide = {};
      static createMethods = [];
      static cell = [];
      static slides = [];
      static Cell = Cell;
      static Slide = Slide;

      constructor(element, options = {}) {
        const queryElement = utils.getQueryElement(element);
        if (!queryElement) {
          console.error(`Bad element for Flickity: ${element}`);
          return;
        }
        this.element = queryElement;
        if (this.element.flickityt4sGUID) {
          const instance = Flickityt4s.instances[this.element.flickityt4sGUID];
          return instance ? instance.option(options) : instance;
        }

        // jQuery support
        this.$element = jQuary(this.element);

        // Default options
        this.options = utils.extend({}, Flickityt4s.defaults);
        options.originwrapAround = options.wrapAround;
        options.rightToLeft =
          document.documentElement.getAttribute('dir') === 'rtl';
        // Set arrow shapes based on option
        if (options.arrowIcon) {
          options.arrowShape = this.getArrowShape(options.arrowIcon);
        }
        this.option(options);
        this._create();
      }

      option(options) {
        utils.extend(this.options, options);
      }

      getArrowShape(arrowIcon) {
        switch (arrowIcon) {
          case '1':
            return 'M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z';
          case '2':
            return 'M 10,50 L 60,100 L 65,95 L 20,50 L 65,5 L 60,0 Z';
          case '3':
            return 'M 0,50 L 60,0 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z';
          default:
            return '';
        }
      }

      _create() {
        this.guid = ++Flickityt4s.guid;
        this.element.flickityt4sGUID = this.guid;
        Flickityt4s.instances[this.guid] = this;

        // Initialize properties
        this.selectedIndex = 0;
        this.restingFrames = 0;
        this.x = 0;
        this.velocity = 0;

        // Create viewport and slider
        this.originSide = window.RtlT4s ? 'right' : 'left';
        this.viewport = document.createElement('div');
        this.viewport.className = 'flickity-viewport';
        this._createSlider();

        // Add event listeners
        if (this.options.resize || this.options.watchCSS) {
          global.addEventListener('resize', this);
        }
        for (const i in this.element.flickityt4sGUID) {
          if (this.options.on) {
            this.on(i, this.options.on[i]);
          }
        }

        Flickityt4s.createMethods.forEach((t) => this[t]());
        this.options.watchCSS ? this.watchCSS() : this.activate();
      }

      _createSlider() {
        this.slider = document.createElement('div');
        this.slider.className = 'flickity-slider';
        this.slider.style[this.originSide] = 0;
      }

      _filterFindCellElements(children) {
        return utils.filterFindElements(children, this.options.cellSelector);
      }

      reloadCells() {
        this.cells = this._makeCells(this.slider.children);
        this.positionCells();
        this._getWrapShiftCells();
        this.setGallerySize();
        this.setPrevNextButtons();
      }

      _makeCells(cell) {
        return this._filterFindCellElements(cell).map((c) => new Cell(c, this));
      }

      getLastCell() {
        return this.cells[this.cells.length - 1];
      }

      getLastSlide() {
        return this.slides[this.slides.length - 1];
      }

      positionCells() {
        this._sizeCells(this.cells), this._positionCells(0);
      }

      _positionCells(startIndex = 0) {
        this.maxCellHeight = (startIndex && this.maxCellHeight) || 0;
        let positionX = 0;

        if (startIndex > 0) {
          const prevCell = this.cells[startIndex - 1];
          positionX = prevCell.x + prevCell.size.outerWidth;
        }

        const numCells = this.cells.length;

        for (let index = startIndex; index < numCells; index++) {
          const cell = this.cells[index];
          cell.setPosition(positionX);
          positionX += cell.size.outerWidth;
          this.maxCellHeight = Math.max(
            cell.size.outerHeight,
            this.maxCellHeight
          );
        }

        this.slideableWidth = positionX;
        this.updateSlides();
        this._containSlides();
        this.slidesWidth = numCells
          ? this.getLastSlide().target - this.slides[0].target
          : 0;
        this.maxVisibilityHeight = 0;
      }

      _sizeCells(cells) {
        cells.forEach((cell) => {
          cell.getSize();
        });
      }

      updateSlides() {
        this.slides = [];

        if (this.cells.length) {
          let currentSlide = new Slide(this);
          this.slides.push(currentSlide);

          const marginProperty =
            this.originSide === 'left' ? 'marginRight' : 'marginLeft';
          const canCellFit = this._getCanCellFit();

          this.cells.forEach((cell, index) => {
            if (currentSlide.cells.length) {
              const remainingWidth =
                currentSlide.outerWidth -
                currentSlide.firstMargin +
                (cell.size.outerWidth - cell.size[marginProperty]);

              if (canCellFit.call(this, index, remainingWidth)) {
                currentSlide.addCell(cell);
              } else {
                currentSlide.updateTarget();
                currentSlide = new Slide(this);
                this.slides.push(currentSlide);
                currentSlide.addCell(cell);
              }
            } else {
              currentSlide.addCell(cell);
            }
          });

          currentSlide.updateTarget();
          this.updateSelectedSlide();
        }
      }

      _getCanCellFit() {
        const groupCells = this.options.groupCells;

        if (!groupCells) {
          return () => false;
        }

        if (typeof groupCells === 'number') {
          const cellCount = parseInt(groupCells, 10);
          return (index) => index % cellCount !== 0;
        }

        const match =
          typeof groupCells === 'string' && groupCells.match(/^(\d+)%$/);
        const percentage = match ? parseInt(match[1], 10) / 100 : 1;

        return (index, elementWidth) =>
          elementWidth <= (this.size.innerWidth + 1) * percentage;
      }

      _init() {
        this.positionCells();
        this.positionSliderAtSelected();
      }

      getSize() {
        this.size = getSize(this.element);
        this.setCellAlign();
        this.cursorPosition = this.size.innerWidth * this.cellAlign;
      }

      setCellAlign() {
        const align = {
          center: {
            left: 0.5,
            right: 0.5,
          },
          left: {
            left: 0,
            right: 1,
          },
          right: {
            right: 0,
            left: 1,
          },
        };
        const cellAlign = align[this.options.cellAlign];
        this.cellAlign = cellAlign
          ? cellAlign[this.originSide]
          : this.options.cellAlign;
      }

      setGallerySize() {
        if (this.options.setGallerySize) {
          let size =
            this.options.adaptiveHeight && this.selectedSlide
              ? this.selectedSlide.height
              : this.maxCellHeight;
          size =
            this.maxVisibilityHeight && this.maxVisibilityHeight > size
              ? this.maxVisibilityHeight
              : size;
          this.viewport.style.height = `${size}px`;
        }
      }

      setPrevNextButtons() {
        if (this.options.setPrevNextButtons) {
          const element = this.viewport.querySelector(
            '.is-selected [data-cacl-slide]'
          );
          if (element) {
            const size = element.offsetHeight / 2;
            this.element.style.setProperty('--prev-next-top', size + 'px');
          }
        }
      }

      _checkVisibility() {
        if (this.options.checkVisibility && this.options.adaptiveHeight) {
          const dimension = this.viewport.getBoundingClientRect().x;
          const offsetWidth = this.viewport.offsetWidth;
          const cellLengths = this.cells.length;

          for (let i = 0; i < cellLengths; i++) {
            const cell = this.cells[i];
            const size = cell.element.getBoundingClientRect().x - dimension;

            if (
              (size + cell.size.outerWidth > dimension &&
                size + cell.size.outerWidth < offsetWidth) ||
              (size > dimension && size < offsetWidth)
            ) {
              this.maxVisibilityHeight = Math.max(
                cell.size.outerHeight,
                this.maxVisibilityHeight
              );
              cell.element.classList.add('is-visible');
              cell.element.removeAttribute('aria-hidden');
            } else {
              cell.element.classList.remove('is-visible');
              cell.element.setAttribute('aria-hidden', 'true');
            }
          }
        }
      }

      _getWrapShiftCells() {
        if (this.options.originwrapAround) {
          if (this.slides.length < 2) {
            this.options.wrapAround = false;
          } else {
            this.options.wrapAround = true;
            this._unshiftCells(this.beforeShiftCells);
            this._unshiftCells(this.afterShiftCells);

            let cursorPosition = this.cursorPosition;
            const cellLen = this.cells.length - 1;
            this.beforeShiftCells = this._getGapCells(
              cursorPosition,
              cellLen,
              -1
            );
            cursorPosition = this.size.innerWidth - this.cursorPosition;
            this.afterShiftCells = this._getGapCells(cursorPosition, 0, 1);
          }
        }
      }

      _getGapCells(cursorPosition, index, cellLen) {
        const cells = [];
        while (cursorPosition > 0) {
          const cell = this.cells[index];
          if (!cell) return cells;
          cells.push(cell);
          index += cellLen;
          cursorPosition -= cell.size.outerWidth;
        }
        return cells;
      }

      _containSlides() {
        if (
          this.options.contain &&
          !this.options.wrapAround &&
          this.cells.length
        ) {
          const marginRight = RtlT4s ? 'marginRight' : 'marginLeft';
          const marginLeft = RtlT4s ? 'marginLeft' : 'marginRight';
          const lastCellSize = this.getLastCell().size[marginLeft];
          const totalWidth = this.slideableWidth - lastCellSize;
          const isSmallerThanContainer = totalWidth < this.size.innerWidth;
          const cursorOffset =
            this.cursorPosition + this.cells[0].size[marginRight];
          const maxTarget =
            totalWidth - this.size.innerWidth * (1 - this.cellAlign);

          this.slides.forEach((slide) => {
            if (isSmallerThanContainer) {
              slide.target = totalWidth * this.cellAlign;
            } else {
              slide.target = Math.max(slide.target, cursorOffset);
              slide.target = Math.min(slide.target, maxTarget);
            }
          });
        }
      }

      getLastCell() {
        return this.cells[this.cells.length - 1]; // Adjust as necessary
      }

      dispatchEvent(eventType, eventData, additionalData) {
        const eventPayload = eventData
          ? [eventData, ...additionalData]
          : additionalData;

        // Emit the event
        this.emitEvent(eventType, eventPayload);

        // Trigger jQuery event if applicable
        if (jQuary && this.$element) {
          let eventWithNamespace =
            eventType + (this.options.namespaceJQueryEvents ? '.flickity' : '');

          if (eventData) {
            const jQueryEvent = new jQuary.Event(eventData);
            jQueryEvent.type = eventWithNamespace;
            eventWithNamespace = jQueryEvent;
          }
          this.$element.trigger(eventWithNamespace, additionalData);
        }
      }

      select(index, useWrap = false, shouldAnimate = false) {
        if (this.isActive) {
          index = parseInt(index, 10);
          this._wrapSelect(index);

          // Apply wrapping if options allow
          if (this.options.wrapAround || useWrap) {
            index = utils.modulo(index, this.slides.length);
          }

          if (this.slides[index]) {
            const previousIndex = this.selectedIndex;
            this.selectedIndex = index;

            this.updateSelectedSlide();

            // Position or animate based on the flag
            shouldAnimate
              ? this.positionSliderAtSelected()
              : this.startAnimation();

            // Adjust height if needed
            if (this.options.adaptiveHeight) {
              this.setGallerySize();
            }

            // Set previous/next buttons and dispatch events
            this.setPrevNextButtons();
            this.dispatchEvent('select', null, [index]);

            if (index !== previousIndex) {
              this.dispatchEvent('change', null, [index]);
            }

            this.dispatchEvent('cellSelect');
          }
        }
      }
      _wrapSelect(index) {
        const slideCount = this.slides.length;

        // If wrapAround is not enabled or only one slide exists, return the index
        if (!(this.options.wrapAround && slideCount > 1)) {
          return index;
        }

        const wrappedIndex = utils.modulo(index, slideCount);
        const distanceToSelected = Math.abs(wrappedIndex - this.selectedIndex);
        const distanceToNextWrap = Math.abs(
          wrappedIndex + slideCount - this.selectedIndex
        );
        const distanceToPrevWrap = Math.abs(
          wrappedIndex - slideCount - this.selectedIndex
        );

        // Adjust the index based on drag selection and distances
        if (!this.isDragSelect) {
          if (distanceToNextWrap < distanceToSelected) {
            index += slideCount;
          } else if (distanceToPrevWrap < distanceToSelected) {
            index -= slideCount;
          }
        }

        // Adjust x position based on the new index
        if (index < 0) {
          this.x -= this.slideableWidth;
        } else if (index >= slideCount) {
          this.x += this.slideableWidth;
        }

        return index; // Return the adjusted index if needed
      }

      previous(useWrap, shouldAnimate) {
        this.select(this.selectedIndex - 1, useWrap, shouldAnimate);
      }

      next(useWrap, shouldAnimate) {
        this.select(this.selectedIndex + 1, useWrap, shouldAnimate);
      }

      updateSelectedSlide() {
        const slide = this.slides[this.selectedIndex];
        if (slide) {
          this.unselectSelectedSlide();
          this.selectedSlide = slide;
          slide.select();
          this.selectedCells = slide.cells;
          this.selectedElements = slide.getCellElements();
          this.selectedCell = slide.cells[0];
          this.selectedElement = this.selectedElements[0];
        }
      }

      unselectSelectedSlide() {
        if (this.selectedSlide) {
          this.selectedSlide.unselect();
        }
      }

      selectInitialIndex() {
        const initialIndex = this.options.initialIndex;

        if (this.isInitActivated) {
          this.select(this.selectedIndex, false, true);
        } else {
          if (
            initialIndex &&
            typeof initialIndex === 'string' &&
            this.queryCell(initialIndex)
          ) {
            this.selectCell(initialIndex, false, true);
            return;
          }

          let indexToSelect = 0;
          if (initialIndex && this.slides[initialIndex]) {
            indexToSelect = initialIndex;
          }
          this.select(indexToSelect, false, true);
        }
      }

      selectCell(cellIdentifier, shouldAnimate = false, shouldUpdate = false) {
        const cell = this.queryCell(cellIdentifier);

        if (cell) {
          const slideIndex = this.getCellSlideIndex(cell);
          this.select(slideIndex, shouldAnimate, shouldUpdate);
        }
      }

      getCellSlideIndex(cell) {
        for (let index = 0; index < this.slides.length; index++) {
          if (this.slides[index].cells.includes(cell)) {
            return index; // Return the index of the slide containing the cell
          }
        }
        return -1; // Return -1 if the cell is not found in any slide
      }

      getCell(element) {
        for (const i = 0; i < this.cells.length; i++) {
          const cell = this.cells[e];
          if (cell.element == element) return i;
        }
      }

      getCells(input) {
        const cellsArray = []; // Array to hold the cells
        const elements = this.utils.makeArray(input); // Assuming this.utils.makeArray is a utility function

        elements.forEach((element) => {
          const cell = this.getCell(element); // Get cell for the element
          if (cell) {
            cellsArray.push(cell); // Add the cell to the array if it exists
          }
        });

        return cellsArray; // Return the array of cells
      }

      getCellElements = function () {
        return this.cells.map((c) => c.element);
      };

      getParentCell(element) {
        let cell = this.getCell(element); // Try to get the cell directly
        if (!cell) {
          // If not found, try to get the parent element with a specific selector
          const parentElement = this.utils.getParent(
            element,
            '.flickity-slider > *'
          );
          cell = this.getCell(parentElement); // Attempt to get the cell from the parent
        }
        return cell; // Return the found cell or undefined
      }

      getAdjacentCellElements(t, e) {
        if (!t) {
          return this.selectedSlide.getCellElements(); // Return cell elements of the selected slide
        }

        e = typeof e === 'undefined' ? this.selectedIndex : e; // Default to selectedIndex if e is not provided
        const i = this.slides.length; // Total number of slides

        // If the range exceeds total slides, return all cell elements
        if (1 + 2 * t >= i) {
          return this.getCellElements(); // Assuming getCellElements is another method that returns all cell elements
        }

        const adjacentCells = []; // Array to hold adjacent cell elements

        // Get cell elements from the adjacent slides
        for (let s = e - t; s <= e + t; s++) {
          const r = this.options.wrapAround ? this.utils.modulo(s, i) : s; // Handle wrapping
          const slide = this.slides[r]; // Get the slide at the computed index
          if (slide) {
            adjacentCells.push(...slide.getCellElements()); // Concatenate cell elements
          }
        }

        return adjacentCells; // Return the array of adjacent cell elements
      }

      queryCell(t) {
        if (typeof t === 'number') {
          return this.cells[t]; // Return cell by index
        }
        if (typeof t === 'string') {
          if (t.match(/^[#.]?[\d/]/)) {
            return; // Invalid query
          }
          t = this.element.querySelector(t); // Query cell element
        }
        return this.getCell(t); // Assume getCell is defined elsewhere
      }

      uiChange() {
        this.emitEvent('uiChange');
      }

      childUIPointerDown(t) {
        if (t.type !== 'touchstart') {
          t.preventDefault();
        }
        this.focus();
      }

      onresize() {
        this.watchCSS();
        this.resize();
      }

      resize() {
        if (this.isActive && !this.isAnimating && !this.isDragging) {
          this.getSize();
          if (this.options.wrapAround) {
            this.x = this.utils.modulo(this.x, this.slideableWidth);
          }
          this.positionCells(); // Assume defined elsewhere
          this._getWrapShiftCells(); // Assume defined elsewhere
          this.setGallerySize(); // Assume defined elsewhere
          this.setPrevNextButtons(); // Assume defined elsewhere
          this.emitEvent('resize');
          const t = this.selectedElements && this.selectedElements[0];
          this.selectCell(t, false, true); // Assume defined elsewhere
        }
      }

      keyboardHandlers = {
        37: () => {
          const step = RtlT4s ? 'next' : 'previous';
          this.uiChange();
          this[step]();
        },
        39: () => {
          const step = RtlT4s ? 'previous' : 'next';
          this.uiChange();
          this[step]();
        },
      };

      watchCSS() {
        if (this.options.watchCSS) {
          if (
            window
              .getComputedStyle(this.element, ':after')
              .content.indexOf('flickity') !== -1
          ) {
            this.activate(); // Assume defined elsewhere
          } else {
            this.deactivate();
          }
        }
      }

      onkeydown(t) {
        const e =
          document.activeElement && document.activeElement !== this.element;
        if (this.options.accessibility && !e) {
          const handler = this.keyboardHandlers[t.keyCode];
          if (handler) {
            handler.call(this); // Call the keyboard handler
          }
        }
      }

      focus() {
        const val = global.pageYOffset;
        this.element.focus({ preventScroll: true });
        if (global.pageYOffset !== val) {
          global.scrollTo(global.pageXOffset, val); // Scroll back to the original position
        }
      }

      deactivate() {
        if (this.isActive) {
          this.element.classList.remove('flickity-enabled');
          this.element.classList.remove('flickity-rtl');
          this.unselectSelectedSlide();
          this.cells.forEach((cell) => cell.destroy());
          this.element.removeChild(this.viewport);
          appendElements(this.slider.children, this.element);
          if (this.options.accessibility) {
            this.element.removeAttribute('tabIndex');
            this.element.removeEventListener('keydown', this);
          }
          this.isActive = false;
          this.emitEvent('deactivate');
        }
      }

      destroy() {
        this.deactivate();
        jquery.removeEventListener('resize', this);
        this.allOff();
        this.emitEvent('destroy');
        this.$element && jquery.removeData(this.element, 'flickity');
        delete this.element.flickityt4sGUID;
        delete this.instances[this.guid]; // Assuming an instances object to track Flickity instances
      }

      data(elem) {
        const element = utils.getQueryElement(elem);
        return element && element.flickityt4sGUID
          ? this.instances[element.flickityt4sGUID]
          : null;
      }

      activate() {
        if (!this.isActive) {
          this.isActive = true;
          this.element.classList.add('flickity-enabled');
          if (RtlT4s) {
            this.element.classList.add('flickity-rtl');
          }

          // Set size and position cells
          this.getSize();
          appendElements(
            this._filterFindCellElements(this.element.children),
            this.slider
          );
          this.viewport.appendChild(this.slider);
          this.element.appendChild(this.viewport);

          // Reload cells and setup accessibility
          this.reloadCells();
          if (this.options.accessibility) {
            this.element.tabIndex = 0;
            this.element.addEventListener('keydown', this);
          }

          this.emitEvent('activate');
          this.selectInitialIndex();
          this.isInitActivated = true;
          this.dispatchEvent('ready');
        }
      }

      getSize() {
        this.size = getSize(this.element);
        this.setCellAlign();
        this.cursorPosition = this.size.innerWidth * this.cellAlign;
      }

      setCellAlign() {
        const alignments = {
          center: { left: 0.5, right: 0.5 },
          left: { left: 0, right: 1 },
          right: { right: 0, left: 1 },
        };

        this.cellAlign =
          alignments[this.options.cellAlign]?.[this.originSide] ??
          this.options.cellAlign;
      }

      resize() {
        if (this.isActive && !this.isAnimating && !this.isDragging) {
          this.getSize();
          if (this.options.wrapAround) {
            this.x = utils.modulo(this.x, this.slideableWidth);
          }
          this.positionCells();
          this.setGallerySize();
          this.setPrevNextButtons();
          this.emitEvent('resize');
        }
      }
    }

    utils.extend(Flickityt4s.prototype, EvEmitter.prototype);
    utils.extend(Flickityt4s.prototype, Animate);
    utils.htmlInit(Flickityt4s, 'flickity');

    if (jQuary && jQuary.bridget) {
      jQuary.bridget('flickity', Flickityt4s);
    }

    return Flickityt4s;
  }
);

(function (t, e) {
  'function' == typeof define && define.amd
    ? define(
        'flickityt4s/js/drag',
        ['./flickityt4s', 'unidragger/unidragger', 'fizzy-ui-utils/utils'],
        function (i, n, o) {
          return e(t, i, n, o);
        }
      )
    : 'object' == typeof module && module.exports
    ? (module.exports = e(
        t,
        require('./flickityt4s'),
        require('unidragger'),
        require('fizzy-ui-utils')
      ))
    : (t.Flickityt4s = e(t, t.Flickityt4s, t.Unidragger, t.fizzyUIUtils));
})(window, function (t, e, i, n) {
  function o() {
    return {
      x: t.pageXOffset,
      y: t.pageYOffset,
    };
  }
  n.extend(e.defaults, {
    draggable: '>1',
    dragThreshold: 3,
  }),
    e.createMethods.push('_createDrag');
  var s = e.prototype;
  n.extend(s, i.prototype),
    (s._touchActionValue = 'pan-y'),
    (s._createDrag = function () {
      this.on('activate', this.onActivateDrag),
        this.on('uiChange', this._uiChangeDrag),
        this.on('deactivate', this.onDeactivateDrag),
        this.on('cellChange', this.updateDraggable);
    }),
    (s.onActivateDrag = function () {
      (this.handles = [this.viewport]),
        this.bindHandles(),
        this.updateDraggable();
    }),
    (s.onDeactivateDrag = function () {
      this.unbindHandles(), this.element.classList.remove('is-draggable');
    }),
    (s.updateDraggable = function () {
      '>1' == this.options.draggable
        ? (this.isDraggable = this.slides.length > 1)
        : 'smart' == this.options.draggable
        ? (this.viewport,
          (this.isDraggable =
            this.viewport.scrollWidth > this.viewport.offsetWidth))
        : (this.isDraggable = this.options.draggable),
        this.isDraggable
          ? this.element.classList.add('is-draggable')
          : this.element.classList.remove('is-draggable');
    }),
    (s.bindDrag = function () {
      (this.options.draggable = !0), this.updateDraggable();
    }),
    (s.unbindDrag = function () {
      (this.options.draggable = !1), this.updateDraggable();
    }),
    (s._uiChangeDrag = function () {
      delete this.isFreeScrolling;
    }),
    (s.pointerDown = function (e, i) {
      this.isDraggable
        ? this.okayPointerDown(e) &&
          (this._pointerDownPreventDefault(e),
          this.pointerDownFocus(e),
          document.activeElement != this.element && this.pointerDownBlur(),
          (this.dragX = this.x),
          this.viewport.classList.add('is-pointer-down'),
          (this.pointerDownScroll = o()),
          t.addEventListener('scroll', this),
          this._pointerDownDefault(e, i))
        : this._pointerDownDefault(e, i);
    }),
    (s._pointerDownDefault = function (t, e) {
      (this.pointerDownPointer = {
        pageX: e.pageX,
        pageY: e.pageY,
      }),
        this._bindPostStartEvents(t),
        this.dispatchEvent('pointerDown', t, [e]);
    });
  var r = {
    INPUT: !0,
    TEXTAREA: !0,
    SELECT: !0,
  };
  return (
    (s.pointerDownFocus = function (t) {
      r[t.target.nodeName] || this.focus();
    }),
    (s._pointerDownPreventDefault = function (t) {
      var e = 'touchstart' == t.type,
        i = 'touch' == t.pointerType,
        n = r[t.target.nodeName];
      e || i || n || t.preventDefault();
    }),
    (s.hasDragStarted = function (t) {
      return Math.abs(t.x) > this.options.dragThreshold;
    }),
    (s.pointerUp = function (t, e) {
      delete this.isTouchScrolling,
        this.viewport.classList.remove('is-pointer-down'),
        this.dispatchEvent('pointerUp', t, [e]),
        this._dragPointerUp(t, e);
    }),
    (s.pointerDone = function () {
      t.removeEventListener('scroll', this), delete this.pointerDownScroll;
    }),
    (s.dragStart = function (e, i) {
      this.isDraggable &&
        ((this.dragStartPosition = this.x),
        this.startAnimation(),
        t.removeEventListener('scroll', this),
        this.dispatchEvent('dragStart', e, [i]));
    }),
    (s.pointerMove = function (t, e) {
      var i = this._dragPointerMove(t, e);
      this.dispatchEvent('pointerMove', t, [e, i]), this._dragMove(t, e, i);
    }),
    (s.dragMove = function (t, e, i) {
      if (this.isDraggable) {
        t.preventDefault(), (this.previousDragX = this.dragX);
        var n = RtlT4s ? -1 : 1;
        this.options.wrapAround && (i.x %= this.slideableWidth);
        var o = this.dragStartPosition + i.x * n;
        if (!this.options.wrapAround && this.slides.length) {
          var s = Math.max(-this.slides[0].target, this.dragStartPosition);
          o = o > s ? 0.5 * (o + s) : o;
          var r = Math.min(-this.getLastSlide().target, this.dragStartPosition);
          o = o < r ? 0.5 * (o + r) : o;
        }
        (this.dragX = o),
          (this.dragMoveTime = new Date()),
          this.dispatchEvent('dragMove', t, [e, i]);
      }
    }),
    (s.dragEnd = function (t, e) {
      if (this.isDraggable) {
        this.options.freeScroll && (this.isFreeScrolling = !0);
        var i = this.dragEndRestingSelect();
        if (this.options.freeScroll && !this.options.wrapAround) {
          var n = this.getRestingPosition();
          this.isFreeScrolling =
            -n > this.slides[0].target && -n < this.getLastSlide().target;
        } else
          this.options.freeScroll ||
            i != this.selectedIndex ||
            (i += this.dragEndBoostSelect());
        delete this.previousDragX,
          (this.isDragSelect = this.options.wrapAround),
          this.select(i),
          delete this.isDragSelect,
          this.dispatchEvent('dragEnd', t, [e]);
      }
    }),
    (s.dragEndRestingSelect = function () {
      var t = this.getRestingPosition(),
        e = Math.abs(this.getSlideDistance(-t, this.selectedIndex)),
        i = this._getClosestResting(t, e, 1),
        n = this._getClosestResting(t, e, -1);
      return i.distance < n.distance ? i.index : n.index;
    }),
    (s._getClosestResting = function (t, e, i) {
      for (
        var n = this.selectedIndex,
          o = 1 / 0,
          s =
            this.options.contain && !this.options.wrapAround
              ? function (t, e) {
                  return t <= e;
                }
              : function (t, e) {
                  return t < e;
                };
        s(e, o) &&
        ((n += i), (o = e), null !== (e = this.getSlideDistance(-t, n)));

      )
        e = Math.abs(e);
      return {
        distance: o,
        index: n - i,
      };
    }),
    (s.getSlideDistance = function (t, e) {
      var i = this.slides.length,
        o = this.options.wrapAround && i > 1,
        s = o ? n.modulo(e, i) : e,
        r = this.slides[s];
      if (!r) return null;
      var a = o ? this.slideableWidth * Math.floor(e / i) : 0;
      return t - (r.target + a);
    }),
    (s.dragEndBoostSelect = function () {
      if (
        void 0 === this.previousDragX ||
        !this.dragMoveTime ||
        new Date() - this.dragMoveTime > 100
      )
        return 0;
      var t = this.getSlideDistance(-this.dragX, this.selectedIndex),
        e = this.previousDragX - this.dragX;
      return t > 0 && e > 0 ? 1 : t < 0 && e < 0 ? -1 : 0;
    }),
    (s.staticClick = function (t, e) {
      var i = this.getParentCell(t.target),
        n = i && i.element,
        o = i && this.cells.indexOf(i);
      this.dispatchEvent('staticClick', t, [e, n, o]);
    }),
    (s.onscroll = function () {
      var t = o(),
        e = this.pointerDownScroll.x - t.x,
        i = this.pointerDownScroll.y - t.y;
      (Math.abs(e) > 3 || Math.abs(i) > 3) && this._pointerDone();
    }),
    e
  );
});

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/prev-next-button', [
      './flickityt4s',
      'unipointer/unipointer',
      'fizzy-ui-utils/utils',
    ], (flickity, unipointer, utils) =>
      factory(window, flickity, unipointer, utils));
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      window,
      require('./flickityt4s'),
      require('unipointer'),
      require('fizzy-ui-utils')
    );
  } else {
    factory(window, window.Flickityt4s, window.Unipointer, window.fizzyUIUtils);
  }
})(window, (window, Flickity, Unipointer, utils) => {
  'use strict';

  class PrevNextButton extends Unipointer {
    constructor(direction, parent) {
      super();
      this.direction = direction;
      this.parent = parent;
      this._create();
    }

    static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    _create() {
      this.isEnabled = true;
      this.isPrevious = this.direction === -1;
      const t = this.parent.options.rightToLeft ? 1 : -1;
      this.isLeft = this.direction === t;

      this.element = document.createElement('button');
      this.element.className = `flickity-button flickity-prev-next-button ${
        this.isPrevious ? 'previous' : 'next'
      }`;
      this.element.setAttribute('type', 'button');
      this.disable();
      this.element.setAttribute(
        'aria-label',
        this.isPrevious ? 'Previous' : 'Next'
      );

      const svgElement = this.createSVG();
      this.element.appendChild(svgElement);

      this.parent.on('select', this.update.bind(this));
      this.on('pointerDown', this.parent.childUIPointerDown.bind(this.parent));
    }

    activate() {
      this.bindStartEvent(this.element);
      this.element.addEventListener('click', this);
      this.parent.element.appendChild(this.element);
    }

    deactivate() {
      this.parent.element.removeChild(this.element);
      this.unbindStartEvent(this.element);
      this.element.removeEventListener('click', this);
    }

    createSVG() {
      const svg = document.createElementNS(PrevNextButton.SVG_NAMESPACE, 'svg');
      svg.setAttribute('class', 'flickity-button-icon');
      svg.setAttribute('viewBox', '0 0 100 100');

      const path = document.createElementNS(
        PrevNextButton.SVG_NAMESPACE,
        'path'
      );
      const d = this.createPathData(this.parent.options.arrowShape);
      path.setAttribute('d', d);
      path.setAttribute('class', 'arrow');
      if (!this.isLeft) {
        path.setAttribute('transform', 'translate(100, 100) rotate(180)');
      }
      svg.appendChild(path);
      return svg;
    }

    createPathData(shape) {
      return typeof shape === 'string'
        ? shape
        : `M ${shape.x0},50 L ${shape.x1},${shape.y1 + 50} L ${shape.x2},${
            shape.y2 + 50
          } L ${shape.x3},50 L ${shape.x2},${50 - shape.y2} L ${shape.x1},${
            50 - shape.y1
          } Z`;
    }

    handleEvent(event) {
      utils.handleEvent.bind(this)(event);
    }

    onclick() {
      if (this.isEnabled) {
        this.parent.uiChange();
        const action = this.isPrevious ? 'previous' : 'next';
        this.parent[action]();
      }
    }

    enable() {
      if (!this.isEnabled) {
        this.element.disabled = false;
        this.isEnabled = true;
      }
    }

    disable() {
      if (this.isEnabled) {
        this.element.disabled = true;
        this.isEnabled = false;
      }
    }

    update() {
      const prefix = this.isPrevious ? 'prev_' : 'next_';
      this.parent.element.classList.remove(
        `flickity_${prefix}disable`,
        `flickity_${prefix}enable`
      );

      const slides = this.parent.slides;
      if (this.parent.options.wrapAround && slides.length > 1) {
        this.enable();
      } else {
        const lastIndex = slides.length ? slides.length - 1 : 0;
        const boundaryIndex = this.isPrevious ? 0 : lastIndex;
        const state =
          this.parent.selectedIndex === boundaryIndex ? 'disable' : 'enable';
        this[state]();
        this.parent.element.classList.add(`flickity_${prefix}${state}`);
      }
    }

    destroy() {
      this.deactivate();
      this.allOff();
    }
  }

  // Extending defaults
  utils.extend(Flickity.defaults, {
    prevNextButtons: true,
    arrowShape: {
      x0: 10,
      x1: 60,
      y1: 50,
      x2: 70,
      y2: 40,
      x3: 30,
    },
  });

  Flickity.createMethods.push('_createPrevNextButtons');

  const flickityPrototype = Flickity.prototype;

  flickityPrototype._createPrevNextButtons = function () {
    if (this.options.prevNextButtons) {
      this.prevButton = new PrevNextButton(-1, this);
      this.nextButton = new PrevNextButton(1, this);
      this.on('activate', this.activatePrevNextButtons);
    }
  };

  flickityPrototype.activatePrevNextButtons = function () {
    this.prevButton.activate();
    this.nextButton.activate();
    this.on('deactivate', this.deactivatePrevNextButtons);
  };

  flickityPrototype.deactivatePrevNextButtons = function () {
    this.prevButton.deactivate();
    this.nextButton.deactivate();
    this.off('deactivate', this.deactivatePrevNextButtons);
  };

  Flickity.PrevNextButton = PrevNextButton;
  return Flickity;
});

(function (window, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/page-dots', [
      './flickityt4s',
      'unipointer/unipointer',
      'fizzy-ui-utils/utils',
    ], (flickity, unipointer, utils) =>
      factory(window, flickity, unipointer, utils));
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      window,
      require('./flickityt4s'),
      require('unipointer'),
      require('fizzy-ui-utils')
    );
  } else {
    factory(window, window.Flickityt4s, window.Unipointer, window.fizzyUIUtils);
  }
})(window, (window, Flickity, Unipointer, utils) => {
  'use strict';

  class PageDots extends Unipointer {
    constructor(parent) {
      super();
      this.parent = parent;
      this._create();
    }

    _create() {
      this.holder = document.createElement('ol');
      this.holder.className = 'flickity-page-dots';
      this.dots = [];
      this.handleClick = this.onClick.bind(this);
      this.on('pointerDown', this.parent.childUIPointerDown.bind(this.parent));
    }

    activate() {
      this.setDots();
      this.holder.addEventListener('click', this.handleClick);
      this.bindStartEvent(this.holder);
      this.parent.element.appendChild(this.holder);
    }

    deactivate() {
      this.holder.removeEventListener('click', this.handleClick);
      this.unbindStartEvent(this.holder);
      this.parent.element.removeChild(this.holder);
    }

    setDots() {
      const dotDifference = this.parent.slides.length - this.dots.length;
      if (dotDifference > 0) {
        this.addDots(dotDifference);
      } else if (dotDifference < 0) {
        this.removeDots(-dotDifference);
      }
    }

    addDots(count) {
      const fragment = document.createDocumentFragment();
      const newDots = [];
      const currentCount = this.dots.length;

      for (let i = currentCount; i < currentCount + count; i++) {
        const dot = document.createElement('li');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Page dot ${i + 1}`);
        fragment.appendChild(dot);
        newDots.push(dot);
      }

      this.holder.appendChild(fragment);
      this.dots = [...this.dots, ...newDots];
    }

    removeDots(count) {
      this.dots.splice(this.dots.length - count, count).forEach((dot) => {
        this.holder.removeChild(dot);
      });
    }

    updateSelected() {
      if (this.selectedDot) {
        this.selectedDot.className = 'dot';
        this.selectedDot.removeAttribute('aria-current');
      }

      if (this.dots.length) {
        this.selectedDot = this.dots[this.parent.selectedIndex];
        this.selectedDot.className = 'dot is-selected';
        this.selectedDot.setAttribute('aria-current', 'step');
      }
    }

    onClick(event) {
      const target = event.target;
      if (target.nodeName === 'LI') {
        this.parent.uiChange();
        const index = this.dots.indexOf(target);
        this.parent.select(index);
      }
    }

    destroy() {
      this.deactivate();
      this.allOff();
    }
  }

  // Extending defaults
  utils.extend(Flickity.defaults, {
    pageDots: true,
  });

  Flickity.createMethods.push('_createPageDots');

  const flickityPrototype = Flickity.prototype;

  flickityPrototype._createPageDots = function () {
    if (this.options.pageDots) {
      this.pageDots = new PageDots(this);
      this.on('activate', this.activatePageDots);
      this.on('select', this.updateSelectedPageDots);
      this.on('cellChange', this.updatePageDots);
      this.on('resize', this.updatePageDots);
      this.on('deactivate', this.deactivatePageDots);
    }
  };

  flickityPrototype.activatePageDots = function () {
    this.pageDots.activate();
  };

  flickityPrototype.updateSelectedPageDots = function () {
    this.pageDots.updateSelected();
  };

  flickityPrototype.updatePageDots = function () {
    this.pageDots.setDots();
  };

  flickityPrototype.deactivatePageDots = function () {
    this.pageDots.deactivate();
  };

  Flickity.PageDots = PageDots;
  return Flickity;
});

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/player', [
      'ev-emitter/ev-emitter',
      'fizzy-ui-utils/utils',
      './flickityt4s',
    ], (evEmitter, utils, flickity) => factory(evEmitter, utils, flickity));
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('ev-emitter'),
      require('fizzy-ui-utils'),
      require('./flickityt4s')
    );
  } else {
    factory(window.EvEmitter, window.fizzyUIUtils, window.Flickityt4s);
  }
})(window, (EvEmitter, utils, Flickity) => {
  'use strict';

  class Player {
    constructor(parent) {
      this.parent = parent;
      this.state = 'stopped';
      this.onVisibilityChange = this.visibilityChange.bind(this);
      this.onVisibilityPlay = this.visibilityPlay.bind(this);
    }

    play() {
      if (this.state !== 'playing') {
        if (document.hidden) {
          document.addEventListener('visibilitychange', this.onVisibilityPlay);
        } else {
          this.state = 'playing';
          document.addEventListener(
            'visibilitychange',
            this.onVisibilityChange
          );
          this.tick();
        }
      }
    }

    tick() {
      if (this.state === 'playing') {
        const autoPlayDuration =
          typeof this.parent.options.autoPlay === 'number'
            ? this.parent.options.autoPlay
            : 3000;
        this.clear();

        this.timeout = setTimeout(() => {
          this.parent.next(true);
          this.tick();
        }, autoPlayDuration);
      }
    }

    stop() {
      this.state = 'stopped';
      this.clear();
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    clear() {
      clearTimeout(this.timeout);
    }

    pause() {
      if (this.state === 'playing') {
        this.state = 'paused';
        this.clear();
      }
    }

    unpause() {
      if (this.state === 'paused') {
        this.play();
      }
    }

    visibilityChange() {
      this[document.hidden ? 'pause' : 'unpause']();
    }

    visibilityPlay() {
      this.play();
      document.removeEventListener('visibilitychange', this.onVisibilityPlay);
    }
  }

  // Extending defaults
  utils.extend(Flickity.defaults, {
    pauseAutoPlayOnHover: true,
  });

  Flickity.createMethods.push('_createPlayer');

  const flickityPrototype = Flickity.prototype;

  flickityPrototype._createPlayer = function () {
    this.player = new Player(this);
    this.on('activate', this.activatePlayer);
    this.on('uiChange', this.stopPlayer);
    this.on('pointerDown', this.stopPlayer);
    this.on('deactivate', this.deactivatePlayer);
  };

  flickityPrototype.activatePlayer = function () {
    if (this.options.autoPlay) {
      this.player.play();
      this.element.addEventListener('mouseenter', this);
    }
  };

  flickityPrototype.playPlayer = function () {
    this.player.play();
  };

  flickityPrototype.stopPlayer = function () {
    this.player.stop();
  };

  flickityPrototype.pausePlayer = function () {
    this.player.pause();
  };

  flickityPrototype.unpausePlayer = function () {
    this.player.unpause();
  };

  flickityPrototype.deactivatePlayer = function () {
    this.player.stop();
    this.element.removeEventListener('mouseenter', this);
  };

  flickityPrototype.onmouseenter = function () {
    if (this.options.pauseAutoPlayOnHover) {
      this.player.pause();
      this.element.addEventListener('mouseleave', this);
    }
  };

  flickityPrototype.onmouseleave = function () {
    this.player.unpause();
    this.element.removeEventListener('mouseleave', this);
  };

  Flickity.Player = Player;
  return Flickity;
});

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/add-remove-cell', [
      './flickityt4s',
      'fizzy-ui-utils/utils',
    ], (flickity, utils) => factory(window, flickity, utils));
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      window,
      require('./flickityt4s'),
      require('fizzy-ui-utils')
    );
  } else {
    factory(window, window.Flickityt4s, window.fizzyUIUtils);
  }
})(window, (window, Flickity, utils) => {
  'use strict';

  const flickityPrototype = Flickity.prototype;

  flickityPrototype.insert = function (elements, index) {
    const cells = this._makeCells(elements);
    if (cells && cells.length) {
      const totalCells = this.cells.length;
      index = index === undefined ? totalCells : index;

      const fragment = document.createDocumentFragment();
      cells.forEach((cell) => fragment.appendChild(cell.element));

      const isAtEnd = index === totalCells;

      if (isAtEnd) {
        this.slider.appendChild(fragment);
      } else {
        const referenceCell = this.cells[index].element;
        this.slider.insertBefore(fragment, referenceCell);
      }

      if (index === 0) {
        this.cells = cells.concat(this.cells);
      } else if (isAtEnd) {
        this.cells = this.cells.concat(cells);
      } else {
        const splicedCells = this.cells.splice(index, totalCells - index);
        this.cells = this.cells.concat(cells).concat(splicedCells);
      }

      this._sizeCells(cells);
      this.cellChange(index, true);
    }
  };

  flickityPrototype.append = function (elements) {
    this.insert(elements, this.cells.length);
  };

  flickityPrototype.prepend = function (elements) {
    this.insert(elements, 0);
  };

  flickityPrototype.remove = function (elements) {
    const cellsToRemove = this.getCells(elements);
    if (cellsToRemove && cellsToRemove.length) {
      let lastCellIndex = this.cells.length - 1;
      cellsToRemove.forEach((cell) => {
        cell.remove();
        const index = this.cells.indexOf(cell);
        lastCellIndex = Math.min(index, lastCellIndex);
        utils.removeFrom(this.cells, cell);
      });
      this.cellChange(lastCellIndex, true);
    }
  };

  flickityPrototype.cellSizeChange = function (cell) {
    const targetCell = this.getCell(cell);
    if (targetCell) {
      targetCell.getSize();
      const index = this.cells.indexOf(targetCell);
      this.cellChange(index);
    }
  };

  flickityPrototype.cellChange = function (index, shouldPosition) {
    const selectedElement = this.selectedElement;
    this._positionCells(index);
    this._getWrapShiftCells();
    this.setGallerySize();
    this.setPrevNextButtons();

    const currentCell = this.getCell(selectedElement);
    if (currentCell) {
      this.selectedIndex = this.getCellSlideIndex(currentCell);
    }
    this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
    this.emitEvent('cellChange', [index]);
    this.select(this.selectedIndex);

    if (shouldPosition) {
      this.positionSliderAtSelected();
    }
  };

  return Flickity;
});

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s/js/index', [
      './flickityt4s',
      './drag',
      './prev-next-button',
      './page-dots',
      './player',
      './add-remove-cell',
      './lazyload',
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./flickityt4s'),
      require('./drag'),
      require('./prev-next-button'),
      require('./page-dots'),
      require('./player'),
      require('./add-remove-cell'),
      require('./lazyload')
    );
  }
})(window, (Flickity) => {
  return Flickity;
});

(function (window, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define('flickityt4s-as-nav-for/as-nav-for', [
      'flickityt4s/js/index',
      'fizzy-ui-utils/utils',
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
  } else {
    window.Flickityt4s = factory(window.Flickityt4s, window.fizzyUIUtils);
  }
})(window, (Flickity, fizzyUIUtils) => {
  'use strict';

  Flickity.createMethods.push('_createAsNavFor');

  const prototype = Flickity.prototype;

  prototype._createAsNavFor = function () {
    this.on('activate', this.activateAsNavFor);
    this.on('deactivate', this.deactivateAsNavFor);
    this.on('destroy', this.destroyAsNavFor);

    const asNavFor = this.options.asNavFor;
    if (asNavFor) {
      setTimeout(() => this.setNavCompanion(asNavFor));
    }
  };

  prototype.setNavCompanion = function (navFor) {
    navFor = fizzyUIUtils.getQueryElement(navFor);
    const navData = Flickity.data(navFor);

    if (navData && navData !== this) {
      this.navCompanion = navData;

      this.onNavCompanionSelect = () => this.navCompanionSelect();
      navData.on('select', this.onNavCompanionSelect);
      this.on('staticClick', this.onNavStaticClick);
      this.navCompanionSelect(true);
    }
  };

  prototype.navCompanionSelect = function (isInitial) {
    const selectedCells = this.navCompanion && this.navCompanion.selectedCells;

    if (selectedCells) {
      const firstCellIndex = this.navCompanion.cells.indexOf(selectedCells[0]);
      const lastCellIndex = firstCellIndex + selectedCells.length - 1;
      const cellIndex = Math.floor(
        (lastCellIndex - firstCellIndex) * this.navCompanion.cellAlign +
          firstCellIndex
      );

      if (this.selectCell(cellIndex, false, isInitial)) {
        this.removeNavSelectedElements();

        if (cellIndex < this.cells.length) {
          const navCells = this.cells.slice(firstCellIndex, lastCellIndex + 1);
          this.navSelectedElements = navCells.map((cell) => cell.element);
          this.changeNavSelectedClass('add');
        }
      }
    }
  };

  prototype.changeNavSelectedClass = function (action) {
    this.navSelectedElements.forEach((element) => {
      element.classList[action]('is-nav-selected');
    });
  };

  prototype.activateAsNavFor = function () {
    this.navCompanionSelect(true);
  };

  prototype.removeNavSelectedElements = function () {
    if (this.navSelectedElements) {
      this.changeNavSelectedClass('remove');
      delete this.navSelectedElements;
    }
  };

  prototype.onNavStaticClick = function (event, pointer, cell, index) {
    if (typeof index === 'number') {
      this.navCompanion.selectCell(index);
    }
  };

  prototype.deactivateAsNavFor = function () {
    this.removeNavSelectedElements();
  };

  prototype.destroyAsNavFor = function () {
    if (this.navCompanion) {
      this.navCompanion.off('select', this.onNavCompanionSelect);
      this.off('staticClick', this.onNavStaticClick);
      delete this.navCompanion;
    }
  };

  return Flickity;
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
  } else {
    factory(global.Flickityt4s, global.fizzyUIUtils);
  }
})(window, (Flickity, fizzyUIUtils) => {
  'use strict';

  const Slide = Flickity.Slide;
  const originalUpdateTarget = Slide.prototype.updateTarget;

  Slide.prototype.updateTarget = function () {
    originalUpdateTarget.apply(this, arguments);
    if (this.parent.options.fade) {
      const offset = this.target - this.x;
      const firstCellX = this.cells[0].x;

      this.cells.forEach((cell) => {
        const position = cell.x - firstCellX - offset;
        cell.renderPosition(position);
      });
    }
  };

  Slide.prototype.setOpacity = function (opacity) {
    this.cells.forEach((cell) => {
      cell.element.style.opacity = opacity;
    });
  };

  const FlickityProto = Flickity.prototype;
  Flickity.createMethods.push('_createFade');

  FlickityProto._createFade = function () {
    this.fadeIndex = this.selectedIndex;
    this.prevSelectedIndex = this.selectedIndex;

    this.on('select', this.onSelectFade);
    this.on('dragEnd', this.onDragEndFade);
    this.on('settle', this.onSettleFade);
    this.on('activate', this.onActivateFade);
    this.on('deactivate', this.onDeactivateFade);
  };

  const originalUpdateSlides = FlickityProto.updateSlides;

  FlickityProto.updateSlides = function () {
    originalUpdateSlides.apply(this, arguments);
    if (this.options.fade) {
      // Additional fade logic can be added here if necessary
    }
  };

  FlickityProto.onSelectFade = function () {
    this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
    this.prevSelectedIndex = this.selectedIndex;
  };

  FlickityProto.onSettleFade = function () {
    delete this.didDragEnd;
    if (this.options.fade) {
      // Additional settle logic can be added here if necessary
    }
  };

  FlickityProto.onDragEndFade = function () {
    this.didDragEnd = true;
  };

  FlickityProto.onActivateFade = function () {
    if (this.options.fade) {
      this.element.classList.add('is-fade');
    }
  };

  FlickityProto.onDeactivateFade = function () {
    if (this.options.fade) {
      this.element.classList.remove('is-fade');
      this.slides.forEach((slide) => slide.setOpacity(''));
    }
  };

  const originalPositionSlider = FlickityProto.positionSlider;

  FlickityProto.positionSlider = function () {
    if (this.options.fade) {
      this.fadeSlides();
      this.dispatchScrollEvent();
    } else {
      originalPositionSlider.apply(this, arguments);
    }
  };

  const originalPositionSliderAtSelected =
    FlickityProto.positionSliderAtSelected;

  FlickityProto.positionSliderAtSelected = function () {
    if (this.options.fade) {
      this.setTranslateX(0);
    }
    originalPositionSliderAtSelected.apply(this, arguments);
  };

  FlickityProto.fadeSlides = function () {
    // Logic for fading slides can be implemented here if needed
    if (this.slides.length) {
      // Fading logic implementation
    }
  };

  FlickityProto.getFadeIndexes = function () {
    return this.isDragging || this.didDragEnd
      ? this.options.wrapAround
        ? this.getFadeDragWrapIndexes()
        : this.getFadeDragLimitIndexes()
      : { a: this.fadeIndex, b: this.selectedIndex };
  };

  FlickityProto.getFadeDragWrapIndexes = function () {
    const distances = this.slides.map((slide, index) =>
      this.getSlideDistance(-this.x, index)
    );
    const absoluteDistances = distances.map(Math.abs);
    const minDistance = Math.min(...absoluteDistances);
    const minIndex = absoluteDistances.indexOf(minDistance);
    const slideDistance = distances[minIndex];
    const totalSlides = this.slides.length;
    const direction = slideDistance >= 0 ? 1 : -1;

    return {
      a: minIndex,
      b: fizzyUIUtils.modulo(minIndex + direction, totalSlides),
    };
  };

  FlickityProto.getFadeDragLimitIndexes = function () {
    let lastVisibleIndex = 0;
    for (let i = 0; i < this.slides.length - 1; i++) {
      if (-this.x < this.slides[i].target) {
        break;
      }
      lastVisibleIndex = i;
    }
    return {
      a: lastVisibleIndex,
      b: lastVisibleIndex + 1,
    };
  };

  FlickityProto.wrapDifference = function (a, b) {
    let difference = b - a;
    if (!this.options.wrapAround) {
      return difference;
    }

    const wrappedPlus = difference + this.slideableWidth;
    const wrappedMinus = difference - this.slideableWidth;

    if (Math.abs(wrappedPlus) < Math.abs(difference)) {
      difference = wrappedPlus;
    }
    if (Math.abs(wrappedMinus) < Math.abs(difference)) {
      difference = wrappedMinus;
    }

    return difference;
  };

  const originalGetWrapShiftCells = FlickityProto._getWrapShiftCells;

  FlickityProto._getWrapShiftCells = function () {
    if (!this.options.fade) {
      originalGetWrapShiftCells.apply(this, arguments);
    }
  };

  const originalShiftWrapCells = FlickityProto.shiftWrapCells;

  FlickityProto.shiftWrapCells = function () {
    if (!this.options.fade) {
      originalShiftWrapCells.apply(this, arguments);
    }
  };

  return Flickity;
});

(function (global, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
  } else {
    global.Flickityt4s = factory(global.Flickityt4s, global.fizzyUIUtils);
  }
})(window, (Flickity, fizzyUIUtils) => {
  'use strict';

  Flickity.createMethods.push('_createSync');

  Flickity.prototype._createSync = function () {
    this.syncers = {};
    const syncOption = this.options.sync;

    this.on('destroy', this.unsyncAll);

    if (syncOption) {
      setTimeout(() => {
        this.sync(syncOption);
      });
    }
  };

  Flickity.prototype.sync = function (syncElement) {
    syncElement = fizzyUIUtils.getQueryElement(syncElement);
    const syncFlickity = Flickity.data(syncElement);

    if (syncFlickity) {
      this._syncCompanion(syncFlickity);
      syncFlickity._syncCompanion(this);
    }
  };

  Flickity.prototype._syncCompanion = function (companion) {
    const selectListener = () => {
      const currentIndex = this.selectedIndex;
      if (companion.selectedIndex !== currentIndex) {
        companion.select(currentIndex);
      }
    };

    this.on('select', selectListener);
    this.syncers[companion.guid] = {
      flickityt4s: companion,
      listener: selectListener,
    };
  };

  Flickity.prototype.unsync = function (syncElement) {
    syncElement = fizzyUIUtils.getQueryElement(syncElement);
    const syncFlickity = Flickity.data(syncElement);
    this._unsync(syncFlickity);
  };

  Flickity.prototype._unsync = function (companion) {
    if (companion) {
      this._unsyncCompanion(companion);
      companion._unsyncCompanion(this);
    }
  };

  Flickity.prototype._unsyncCompanion = function (companion) {
    const guid = companion.guid;
    const syncData = this.syncers[guid];

    this.off('select', syncData.listener);
    delete this.syncers[guid];
  };

  Flickity.prototype.unsyncAll = function () {
    for (const key in this.syncers) {
      if (Object.prototype.hasOwnProperty.call(this.syncers, key)) {
        const { flickityt4s } = this.syncers[key];
        this._unsync(flickityt4s);
      }
    }
  };

  return Flickity;
});

(function (global, factory) {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.$script = factory();
  }
})(window, () => {
  'use strict';

  const scriptRegistry = {};
  const scriptStatus = {};
  const activeScripts = {};
  const scriptLoadQueue = {};
  let basePath, urlArgs;
  const documentHead = document.getElementsByTagName('head')[0];

  const loadScript = (scripts, onComplete, finalCallback) => {
    scripts = Array.isArray(scripts) ? scripts : [scripts];
    const hasOnCompleteCallback = onComplete && onComplete.call;
    const finalCallbackReference = hasOnCompleteCallback
      ? onComplete
      : finalCallback;
    const combinedKey = hasOnCompleteCallback ? scripts.join('') : onComplete;
    let remainingScripts = scripts.length;

    const resolveItem = (item) =>
      typeof item.call === 'function' ? item() : scriptRegistry[item];

    const checkCompletion = () => {
      if (--remainingScripts === 0) {
        scriptRegistry[combinedKey] = true;
        if (finalCallbackReference) finalCallbackReference();
        for (const key in scriptLoadQueue) {
          if (
            key.split('|').every((item) => resolveItem(item)) &&
            !scriptLoadQueue[key].forEach((item) => resolveItem(item))
          ) {
            scriptLoadQueue[key] = [];
          }
        }
      }
    };
    setTimeout(() => {
      scripts.forEach((scriptUrl, index) => {
        if (scriptUrl === null) {
          checkCompletion();
        } else {
          if (!index && !/^https?:\/\//.test(scriptUrl) && basePath) {
            scriptUrl =
              scriptUrl.indexOf('.js') === -1
                ? `${basePath}${scriptUrl}.js`
                : `${basePath}${scriptUrl}`;
          }
          if (activeScripts[scriptUrl]) {
            if (combinedKey) scriptStatus[combinedKey] = true;
            if (activeScripts[scriptUrl] === 2) {
              checkCompletion();
            } else {
              setTimeout(() => {
                scriptUrl.every((item) => item[false]);
              }, 0);
            }
          } else {
            activeScripts[scriptUrl] = true;
            if (combinedKey) scriptStatus[combinedKey] = true;
            fetchScript(scriptUrl, checkCompletion);
          }
        }
      });
    }, 0);

    return loadScript;
  };

  const fetchScript = (src, onLoad) => {
    let called = false;
    const scriptElement = document.createElement('script');

    scriptElement.onload =
      scriptElement.onerror =
      scriptElement.onreadystatechange =
        () => {
          if (
            scriptElement.readyState &&
            !/^c|loade/.test(scriptElement.readyState || called)
          ) {
            scriptElement.onload = scriptElement.onreadystatechange = null;
            called = true;
            activeScripts[src] = 2;
            onLoad();
          }
        };

    scriptElement.async = true;
    scriptElement.src = urlArgs
      ? `${src}${src.indexOf('?') === -1 ? '?' : '&'}${urlArgs}`
      : src;
    documentHead.insertBefore(scriptElement, documentHead.lastChild);
  };

  loadScript.get = fetchScript;

  loadScript.order = (scripts, onComplete, finalCallback) => {
    (function loadNext() {
      const nextScript = scripts.shift();
      if (scripts.length) {
        loadScript(nextScript, loadNext);
      } else {
        loadScript(nextScript, onComplete, finalCallback);
      }
    })();
  };

  loadScript.path = (path) => {
    basePath = path;
  };

  loadScript.urlArgs = (args) => {
    urlArgs = args;
  };

  loadScript.ready = (dependencies, onReady, onNotReady) => {
    const unresolved = [];

    if (
      !(dependencies = Array.isArray(dependencies)
        ? dependencies
        : [dependencies]).forEach((dependency) => {
        scriptRegistry[dependency] || unresolved.push(dependency);
      }) &&
      dependencies.every((dependency) => scriptRegistry[dependency])
    ) {
      onReady();
    } else {
      unresolved.forEach((dependency) => {
        scriptLoadQueue[dependency] = scriptLoadQueue[dependency] || [];
        scriptLoadQueue[dependency].push(onReady);
        if (onNotReady) onNotReady(unresolved);
      });
    }

    return loadScript;
  };

  loadScript.done = function (callback) {
    loadScript([null], callback);
  };

  return loadScript;
});

(function (global = global || self, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    const previousCookies = global.Cookies;
    global.Cookies = factory();
    global.Cookies.noConflict = function () {
      global.Cookies = previousCookies;
      return factory();
    };
  }
})(window, function () {
  'use strict';

  function extend(target, ...sources) {
    sources.forEach((source) => {
      for (const key in source) {
        target[key] = source[key];
      }
    });
    return target;
  }

  return (function createCookies(converter, attributes) {
    function setCookie(name, value, options) {
      if (typeof document !== 'undefined') {
        options = extend({}, attributes, options);
        if (typeof options.expires === 'number') {
          options.expires = new Date(Date.now() + 864e5 * options.expires);
        }
        if (options.expires) {
          options.expires = options.expires.toUTCString();
        }
        name = encodeURIComponent(name)
          .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
          .replace(/[()]/g, escape);
        let cookieString = '';

        for (const key in options) {
          if (options[key]) {
            cookieString += `; ${key}`;
            if (options[key] !== true) {
              cookieString += `=${options[key].split(';')[0]}`;
            }
          }
        }
        document.cookie = `${name}=${converter.write(
          value,
          name
        )}${cookieString}`;
      }
    }

    return Object.create(
      {
        set: setCookie,
        get(name) {
          if (typeof document !== 'undefined' && (!arguments.length || name)) {
            const cookiesArray = document.cookie
              ? document.cookie.split('; ')
              : [];
            const cookiesObject = {};

            cookiesArray.forEach((cookie) => {
              const [key, ...rest] = cookie.split('=');
              const value = rest.join('=');
              try {
                const decodedKey = decodeURIComponent(key);
                cookiesObject[decodedKey] = converter.read(value, decodedKey);
                if (name === decodedKey) {
                  return cookiesObject[name]; // Break loop if we found the desired cookie
                }
              } catch (error) {
                // Handle decoding error if needed
              }
            });
            return name ? cookiesObject[name] : cookiesObject;
          }
        },
        remove(name, options) {
          setCookie(name, '', extend({}, options, { expires: -1 }));
        },
        withAttributes(attrs) {
          return createCookies(
            this.converter,
            extend({}, this.attributes, attrs)
          );
        },
        withConverter(converter) {
          return createCookies(
            extend({}, this.converter, converter),
            this.attributes
          );
        },
      },
      {
        attributes: {
          value: Object.freeze(attributes),
        },
        converter: {
          value: Object.freeze(converter),
        },
      }
    );
  })(
    {
      read(value) {
        return value.startsWith('"')
          ? value.slice(1, -1)
          : value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      },
      write(value) {
        return encodeURIComponent(value).replace(
          /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
          decodeURIComponent
        );
      },
    },
    {
      path: '/',
    }
  );
});

// Exporting the noConflict version of the cookies
window.CookiesT4 = window.Cookies.noConflict();

!(function ($) {
  'use strict';

  function checkStorage(type, isDesignModeEnabled = true) {
    if (IsDesignMode && isDesignModeEnabled) return false;

    const storage =
      type === 'session' ? window.sessionStorage : window.localStorage;
    try {
      storage.setItem('ts', 'test');
      storage.removeItem('ts');
      return true;
    } catch (e) {
      return false;
    }
  }

  const $window = $(window);
  const $document = $(document);
  const $body = $('body');
  const $html = $('html');
  const rootUrl = window.T4Sroutes.root_url;
  const viewportWidth = $window.width();
  const cacheName = `${window.T4Sconfigs.cacheName}${window.T4Sconfigs.cartCurrency}${Shopify.country}${rootUrl}`;
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth < 1025;

  // Storage capability checks
  isStorageSpSession = checkStorage('session');
  isStorageSpSessionAll = checkStorage('session', false);
  isStorageSpdLocal = checkStorage('local');
  isStorageSpdLocalAll = checkStorage('local', false);

  // Clear session storage in development mode
  if (Shopify.theme.role === 'development' && isStorageSpSessionAll) {
    sessionStorage.clear();
  }

  // Set up window.T4SThemeSP
  window.T4SThemeSP.$appendComponent = $('#append-component');
  window.T4SThemeSP.cacheNameFirst = cacheName;
  window.T4SThemeSP.root_url = rootUrl !== '/' ? `${rootUrl}/` : '/';

  // Ensure Shopify is defined
  if (typeof window.Shopify === 'undefined') {
    window.Shopify = {};
  }

  // Shopify utility functions
  Shopify.bind = (func, context) => {
    return function () {
      return func.apply(context, arguments);
    };
  };

  //done
  Shopify.setSelectorByValue = (selectElement, value) => {
    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];
      if (value === option.value || value === option.innerHTML) {
        selectElement.selectedIndex = i;
        return i;
      }
    }
  };

  //done
  Shopify.addListener = (element, event, handler) => {
    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else {
      element.attachEvent(`on${event}`, handler);
    }
  };

  //done
  Shopify.postLink = (url, options = {}) => {
    const method = options.method || 'post';
    const params = options.parameters || {};
    const form = document.createElement('form');

    form.setAttribute('method', method);
    form.setAttribute('action', url);

    for (const key in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', params[key]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  //done
  // Country and Province Selector
  Shopify.CountryProvinceSelector = class {
    constructor(countryId, provinceId, options) {
      this.countryEl = document.getElementById(countryId);
      this.provinceEl = document.getElementById(provinceId);
      this.provinceContainer = document.getElementById(
        options.hideElement || provinceId
      );

      Shopify.addListener(
        this.countryEl,
        'change',
        Shopify.bind(this.countryHandler, this)
      );
      this.initCountry();
      this.initProvince();
    }

    initCountry() {
      const defaultCountry = this.countryEl.getAttribute('data-default');
      Shopify.setSelectorByValue(this.countryEl, defaultCountry);
      this.countryHandler();
    }

    initProvince() {
      const defaultProvince = this.provinceEl.getAttribute('data-default');
      if (defaultProvince && this.provinceEl.options.length > 0) {
        Shopify.setSelectorByValue(this.provinceEl, defaultProvince);
      }
    }

    countryHandler() {
      const selectedCountry =
        this.countryEl.options[this.countryEl.selectedIndex];
      const provincesData = JSON.parse(
        selectedCountry.getAttribute('data-provinces') || '[]'
      );

      this.clearOptions(this.provinceEl);
      if (provincesData.length === 0) {
        this.provinceContainer.style.display = 'none';
      } else {
        provincesData.forEach((province) => {
          const option = document.createElement('option');
          option.value = province[0];
          option.innerHTML = province[1];
          this.provinceEl.appendChild(option);
        });
        this.provinceContainer.style.display = '';
      }
    }

    clearOptions(selectElement) {
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
    }

    setOptions(selectElement, optionsArray) {
      optionsArray.forEach((optionValue) => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.innerHTML = optionValue;
        selectElement.appendChild(option);
      });
    }
  };

  //done
  // Resize event function
  window.T4SThemeSP.resizeEventT4 = () => {
    try {
      window.dispatchEvent(new Event('resize'));
    } catch {
      const element = window.document.createEvent('UIEvents');
      element.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(element);
    }
  };

  //done
  // Debounce function
  window.T4SThemeSP.debounce = (delay, func, immediate) => {
    let timeoutId;
    return function (...args) {
      const context = this;
      const callNow = immediate && !timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!immediate) func.apply(context, args);
      }, delay);
      if (callNow) func.apply(context, args);
    };
  };

  //done
  // Retrieve currency from storage
  window.T4SThemeSP.storageCurrency = () => {
    return isStorageSpdLocal ? localStorage.getItem('T4Currency') : null;
  };

  //done
  // Set full height for the first section
  window.T4SThemeSP.fullHeightFirtSe = () => {
    const e = $('#MainContent > .section:first').find('ratio_fh');
    if (e.length) {
      const windowHeight = $window.height();
      const elementOffset = e.offset().top;
      if (elementOffset < windowHeight) {
        const aspectRatio = 100 - elementOffset / (windowHeight / 100);
        e.css('--ts-aspect-ratio-fh', `${aspectRatio}vh`);
      }
    }
  };

  //done
  // Handle string for URL or class naming
  window.T4SThemeSP.handle = (input) => {
    const sanitized = (input + '')
      .toLowerCase()
      .replace(/'|"|\(|\)|\[|\]/g, '')
      .replace(/[\s\x21-\x2f\x3a-\x40\x7b-\x7f^`\\[\]]+/g, '-')
      .replace(/\W+/g, '-')
      .replace(/^-+|-+$/g, '');
    return sanitized || input;
  };

  //done
  // Handle string for ID or internal naming
  window.T4SThemeSP._handle = (input) => {
    const sanitized = (input + '')
      .toLowerCase()
      .replace(/'|"|\(|\)|\[|\]/g, '')
      .replace(/[\s\x21-\x2f\x3a-\x40\x7b-\x7f^`\\[\]]+/g, '_')
      .replace(/\W+/g, '_')
      .replace(/^-+|-+$/g, '');
    return sanitized || input;
  };

  //done
  // Escape HTML entities
  window.T4SThemeSP.escapeHtml = (input) => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  //done
  // Unescape HTML entities
  window.T4SThemeSP.descapeHtml = (input) => {
    return input
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  };

  //done
  // Images utility
  window.T4SThemeSP.Images = {
    // Preload images
    preloadImages(images) {
      $(images).each((_, img) => {
        $('<img/>')[0].src = img;
      });
    },

    // Get a new image URL with specified width and height
    getNewImageUrl(url, width = 0, height = 0) {
      if (width || height) {
        if (width) url += `&width=${width}`;
        if (height) url += `&height=${height}`;
        return this.removeProtocol(url);
      }
      return null;
    },

    // Remove protocol (http or https) from the URL
    removeProtocol(url) {
      return url.replace(/http(s)?:/, '');
    },

    // Lazy load image path with a width parameter
    lazyloadImagePath(url) {
      return this.removeProtocol(`${url}&width=1`);
    },
  };

  //done
  // Generate a unique ID
  window.T4SThemeSP.getUID = (baseID = 0) => {
    let uniqueID = baseID;
    do {
      uniqueID += Math.floor(1e6 * Math.random()); // Append random number to the baseID
    } while (document.getElementById(uniqueID)); // Check for uniqueness
    return uniqueID;
  };

  //doubt
  window.T4SThemeSP.Carousel = class {
    // Default options for the carousel
    defaultOptions = {
      adaptiveHeight: false,
      autoPlay: false,
      avoidReflow: false,
      thumbNav: false,
      thumbVertical: false,
      navUI: false,
      dotUI: false,
      parallax: false,
      status: false,
      isMedia: false,
      id: '19041994',
      tsidTab: '19041994',
      selectWithSelector: false,
      scrollbar: false,
      scrollbarDraggable: false,
      fullwidthSide: false,
      centerSlide: false,
      isSimple: false,
      minWidthLG: 19041994,
      cellAlign: 'center',
      cellAlignLG: 'left',
      btnSmartTab: false,
      activeTab: false,
      customIcon: 0,
      viewBox: '0 0 100 100',
      checkVisibility: true,
      autoPlayT4: false,
      dragThreshold: 7,
      fade: false,
      friction: 0.8,
      initialIndex: 0,
      pageDots: false,
      pauseAutoPlayOnHover: false,
      prevNextButtons: false,
      selectedAttraction: 0.14,
    };

    // Other constants and configuration
    classNames = {
      animateOut: 'animate-out',
      isPlaying: 'is--playing',
      isPaused: 'is--paused',
      isActive: 'is--active',
      isNavActive: 'is-nav-selected',
      isXrShowing: 'is-shopify-xr__showing',
      navItem: 'carousel__nav-item',
      selected: 'is-selected',
      destroy: 'destroy.ts',
    };

    selectors = {
      currentSlide: `.${this.classNames.selected}`,
      wrapper: '.carousel-wrapper',
      pauseButton: '.carousel__pause',
      productMediaWrapper: '[data-product-single-media-wrapper]',
      mediaGroup: '[data-product-single-media-group]',
      dataMediaPlay: 'data-is-mediaPlay',
      productMediaPlay: '[data-is-mediaPlay]',
    };

    // SVG icons for different media types
    mediaIcons = {
      video: '<svg viewBox="0 0 384 512"><use href="#icon-thumb-video"/></svg>',
      external_video_youtube:
        '<svg viewBox="0 0 576 512"><use href="#icon-external-youtube"/></svg>',
      external_video_vimeo:
        '<svg viewBox="0 0 448 512"><use href="#icon-external-vimeo"/></svg>',
      model: '<svg viewBox="0 0 512 512"><use href="#icon-thumb-model"/></svg>',
      360: '<svg viewBox="0 0 640 512"><use href="#icon-thumb-360"/></svg>',
    };

    // Event namespaces
    eventNamespaces = {
      select: 'select.carousel',
      clickNavUI: 'click.nav',
      clickDotUI: 'click.dot',
      clickThumb: 'click.thumb',
    };

    // Support check for smooth scrolling
    supportsSmoothScroll = window.CSS.supports('scroll-behavior', 'smooth');

    // Cell alignment mapping
    cellAlign = {
      start: 'left',
      end: 'right',
    };
    //done
    constructor(element) {
      this.el = element;
      this.$el = window.$(element);
      this.UID = window.T4SThemeSP.getUID();
      this.eventNamespace = `resize.carousel${this.UID}`;
      const dataOptions = JSON.parse(this.$el.attr('data-flickity-js') || '{}');
      this.args = { ...this.defaultOptions, ...dataOptions };

      this.initialize();
    }

    init() {
      this.currentSlide = this.el.querySelector(this.options.currentSlide);
      this.options.autoPlayT4 && this.autoPlayT4();
      this.$pauseBtn.classList.add(this.options.isPlaying);
      if (this.options.callbacks?.onInit) {
        this.options.callbacks.onInit(this.currentSlide);
      }
    }

    slideChange(newIndex) {
      this.args.thumbNav && this.thumbnailsGoto(newIndex);
      if (this.options.callbacks?.onChange) {
        this.options.callbacks.onChange(newIndex);
      }

      // Toggle navigation buttons visibility
      this.$carouselNavPrev?.length > 0 &&
        this.$carouselNavPrev[0]?.classList.toggle('is--hide', newIndex === 0);
      this.$carouselNavNext?.length > 0 &&
        this.$carouselNavNext[0]?.classList.toggle(
          'is--hide',
          newIndex === this.$carouselNavLinks.length - 1
        );

      // Pause and play videos
      this.pauseAllVideos();
      this.playVideoForCurrentSlide();

      // Additional media switch logic
      this.isMedia && this._switchMedia(newIndex);
      this.options.autoPlayT4 && this.autoPlayT4();

      // Update carousel navigation buttons data attributes
      this.$carousel && this.updateNavButtonDataAttributes();
    }

    autoPlayT4() {
      if (!this.time) {
        this.wrapper?.style.setProperty(
          '--play-carousel-speed',
          `${this.options.autoPlayT4}ms`
        );
        this.time = {};
      }

      const startTime = Date.now();
      this.time.START = startTime;
      this.time.END = startTime + this.options.autoPlayT4;

      this.$pauseBtn.classList.remove(this.options.isPlaying);
      if (this.isPlaying) {
        clearTimeout(this.stayTimeout);
        this.stayTimeout = setTimeout(() => {
          this.actionsAPI('next', true);
        }, this.options.autoPlayT4);

        clearTimeout(this.pauseBtnTimeout);
        this.pauseBtnTimeout = setTimeout(() => {
          this.$pauseBtn.classList.add(this.options.isPlaying);
        }, 20);
      }
      this.time.REMAINING = this.options.autoPlayT4;
    }

    afterChange() {
      this.options.thumbNav && this.thumbnailsGoto(this.flkty.selectedIndex);
    }

    destroy() {
      this.$carouselNav
        ?.find(`.${this.options.isNavActive}`)
        .remove(this.options.isNavActive);
      this.actionsAPI('destroy');
      this.$el.off(this.eventNamespace);
      $window.off(this.eventNamespace);
    }

    _togglePause() {
      const pauseTitle = this.$pauseBtn.data('pause-title');
      const playTitle = this.$pauseBtn.data('play-title');

      const isPaused = this.pauseBtn.classList.contains(this.options.isPaused);
      if (isPaused) {
        this.pauseBtn.classList.remove(this.options.isPaused);
        this.wrapper.classList.remove(this.options.isPaused);
        this.updateTooltip(pauseTitle);
        this.isPlaying = true;

        if (this.options.autoPlayT4) {
          this.time.END = Date.now() + this.time.REMAINING;
          this.stayTimeout = setTimeout(() => {
            this.actionsAPI('next', true);
          }, this.time.REMAINING);
        }
      } else {
        this.wrapper.classList.add(this.options.isPaused);
        this.pauseBtn.classList.add(this.options.isPaused);
        this.updateTooltip(playTitle);
        this.isPlaying = false;

        if (this.options.autoPlayT4) {
          clearTimeout(this.stayTimeout);
          this.time.REMAINING = this.time.END - Date.now();
        }
      }
      this.isPlaying && this.$pauseBtn.classList.add(this.options.isPlaying);
    }

    actionsAPI(action, force = false) {
      this.$carousel.flickity(action, force);
    }

    _selectChange(t) {
      this.$carousel.on('select.flickity', () => {
        this.$carousel.trigger(this.eventNamespaces.select);
      });
    }

    // Additional methods can be refactored similarly...

    // Helper functions
    updateTooltip(title) {
      $('.tooltip .tooltip-inner').text(title);
      this.$pauseBtn.setAttribute('data-original-title', title);
    }

    pauseAllVideos() {
      const videos = this.$carousel.find('video[autoplay]').length;
      if (videos > 0) {
        this.$carousel.find('video').each((_, video) => video.pause());
      }
    }

    playVideoForCurrentSlide() {
      $(this.currentSlide).each(() => {
        const video = $(this).find('video')[0];
        if (video) video?.play();
      });
    }

    updateNavButtonDataAttributes() {
      if (this.flkty.prevButton) {
        const prevIndex =
          this.flkty.selectedIndex - 1 < 0
            ? this.flkty.cells.length - 1
            : this.flkty.selectedIndex - 1;
        this.flkty.prevButton.element.setAttribute('data-imgkey', prevIndex);
      }
      if (this.flkty.nextButton) {
        const nextIndex =
          this.flkty.selectedIndex + 1 >= this.flkty.cells.length
            ? 0
            : this.flkty.selectedIndex + 1;
        this.flkty.nextButton.element.setAttribute('data-imgkey', nextIndex);
      }
    }

    // Other methods...

    initialize() {
      const {
        cellAlign,
        cellAlignLG,
        id,
        fade,
        rightToLeft,
        isMedia,
        thumbNav,
        avoidReflow,
      } = this.args;

      this.args.cellAlign = this.cellAlign[cellAlign] || cellAlign;
      this.args.cellAlignLG = this.cellAlign[cellAlignLG] || cellAlignLG;
      this.IdSlider = id;
      this.args.fade = this.$el.hasClass('slide-eff-fade') || fade;
      this.args.rightToLeft = isThemeRTL;

      this.$deferredMedia = this.$el.find(this.selectors.productMediaWrapper);
      if (isMedia) {
        this.isMedia =
          this.$el.find('[data-deferred-media]').length > 0 ||
          this.$el.find('[data-media-type="360"]').length > 0;
        if (this.isMedia) {
          this.$groupBtn = window.$(`[data-ts-group-btns="${id}"]`);
          this.$mediaGroup = this.$el.closest(this.selectors.mediaGroup);
        }
      }

      if (this.args.wrapAround && isTablet) {
        this.args.dragThreshold = 55;
      }

      this.args.on = {
        ready: this.init.bind(this),
        change: this.slideChange.bind(this),
        select: this.slideSelect.bind(this),
        settle: this.afterChange.bind(this),
      };

      if (thumbNav) this._initCarouselNav();
      if (avoidReflow) this.avoidReflow(this.el);

      this.$wrapper = this.$el.closest(this.selectors.wrapper);
      this.wrapper = this.$wrapper[0];
      this.pauseBtn = this.wrapper
        ? this.wrapper.querySelector(this.selectors.pauseButton)
        : null;
      this.$pauseBtn = $(this.pauseBtn);
      this.isPlaying = this.args.autoPlay || this.args.autoPlayT4;

      this.setupDimensions();
      this.$carousel = this.$el.flickity(this.args);
      this.flkty = this.$carousel.data('flickity');
      this.selectedIndex = this.flkty.selectedIndex;

      this.initializeEventListeners();
    }

    slideSelect() {}
    avoidReflow(element) {
      if (element.id) {
        let child = element.firstChild;
        while (child && child.nodeType === 3) {
          child = child.nextSibling;
        }
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `#${element.id} .flickity-viewport { height: ${child.offsetHeight}px; }`;
        document.head.appendChild(styleElement);
      }
    }

    setupDimensions() {
      this.args.cellAlignOriginal = this.args.cellAlign;
      this.hasMWLG = this.args.minWidthLG !== 19041994;
      if (this.hasMWLG && this.args.minWidthLG <= $window.width()) {
        this.args.cellAlign = this.args.cellAlignLG;
      }
      if (this.args.centerSlide && this.args.wrapAround) {
        this.args.cellAlign = 'center';
        this.args.cellAlignOriginal = 'center';
      }
    }

    initializeEventListeners() {
      setTimeout(() => this.actionsAPI('resize'), 0);
      setTimeout(() => {
        this.$el.addClass('enabled');
        if (this.args.isSimple) {
          this.actionsAPI('resize');
          setTimeout(() => this.actionsAPI('resize'), 150);
        }
      }, 100);

      this._selectChange();

      if (this.isPlaying && this.wrapper && this.pauseBtn) {
        this.pauseBtn.addEventListener('click', this._togglePause.bind(this));
      }

      this.setupUIFeatures();
      this.handleResizeEvents();

      this.$el.on(this.classNames.destroy, this.destroy.bind(this));
    }

    setupUIFeatures() {
      const {
        navUI,
        dotUI,
        parallax,
        status,
        isFilter,
        btnSmartTab,
        prevNextButtons,
      } = this.args;

      if (navUI) this._customNavUI();
      if (dotUI) this._customDotUI();
      if (parallax) this._parallaxEffect();
      if (status) this._status();
      if (isFilter) this._updateCarousel();
      if (btnSmartTab) this._updateBtnTab();
      if (prevNextButtons) {
        this._customIcon(
          this.$carousel.find('.flickity-button.previous'),
          this.$carousel.find('.flickity-button.next')
        );
      }
      if (this.args.selectWithSelector) this._selectWithSelector();
      if (this.args.scrollbar) {
        if (!this.args.scrollbarDraggable) {
          this._scrollbarCarousel();
        } else {
          this._scrollbarDraggableCarousel();
        }
      }

      const thumbVerticalEnabled = this.args.thumbVertical;
      if ($window.width() < 1025 && thumbVerticalEnabled) {
        this.args.thumbVertical = false;
      }
    }

    _customNavUI(prevButton, nextButton) {
      const wrapAroundEnabled = this.args.wrapAround || false;

      // Set default selectors for prev and next buttons if not provided
      prevButton = prevButton || $('.btn__prev--' + this.IdSlider);
      nextButton = nextButton || $('.btn__next--' + this.IdSlider);

      if (nextButton.length !== 0) {
        // Customize icons for navigation buttons
        this.customizeIcon(prevButton, nextButton);

        // Set up click event for the previous button
        prevButton.off(a.clickNavUI).on(a.clickNavUI, function () {
          this.actionsAPI('previous');
        });

        // Set up click event for the next button
        nextButton.off(a.clickNavUI).on(a.clickNavUI, function () {
          this.actionsAPI('next');
        });

        // Initialize button status based on wrap-around setting
        this._setButtonStatus(wrapAroundEnabled, prevButton, nextButton);

        // Update button status on each carousel selection change
        this.$carousel.on(a.select, function () {
          this._setButtonStatus(wrapAroundEnabled, prevButton, nextButton);
        });
      }
    }

    _scrollbarDraggableCarousel() {}

    _setButtonStatus(wrapAround, prevButton, nextButton) {
      let carouselParent = nextButton.closest('[data-tab-active]'),
        currentTarget = this.flkty.selectedCell.target;
      carouselParent.addClass('prev_next_added'),
        carouselParent.removeClass('tab_prev_next_disable'),
        this.flkty.slides.length < 2
          ? (carouselParent.addClass('tab_prev_next_disable'),
            prevButton.attr('disabled', 'disabled'),
            nextButton.attr('disabled', 'disabled'))
          : currentTarget !== this.flkty.cells[0].target || wrapAround
          ? currentTarget !== this.flkty.getLastCell().target || wrapAround
            ? (prevButton.removeAttr('disabled'),
              nextButton.removeAttr('disabled'))
            : (nextButton.attr('disabled', 'disabled'),
              prevButton.removeAttr('disabled'))
          : (prevButton.attr('disabled', 'disabled'),
            nextButton.removeAttr('disabled'));
    }
    _customDotUI() {
      const dotContainer = $('.btn_group--cells' + this.IdSlider);

      if (dotContainer.data('build')) {
        let dotsMarkup = '';
        for (let i = 0; i < this.flkty.slides.length; i++)
          dotsMarkup +=
            '<li class="dot btn_dot" aria-label="' + (i + 1) + '"></li>';
        dotContainer.html(dotsMarkup);
      }

      const dots = dotContainer.find('.btn_dot');
      if (dots.length !== 0) {
        dots.eq(this.flkty.selectedIndex).addClass(o.selected),
          dotContainer.on(a.clickdotUI, '.btn_dot', (event) => {
            this.$carousel.flickity('select', $(event.target).index());
          }),
          this.$carousel.on(a.select, function () {
            dots.filter(`.${o.selected}`).removeClass(o.selected),
              dots.eq(this.flkty.selectedIndex).addClass(o.selected);
          });
      }
    }
    _parallaxEffect() {
      if (this.$carousel.hasClass('slide-eff-parallax')) {
        let imageSelector;
        if (isMobile) imageSelector = '.slide .img-as-bg.d-md-none';
        else imageSelector = '.slide .img-as-bg.d-md-block';

        const backgroundImages = this.$carousel.find(imageSelector);
        if (backgroundImages.length !== 0)
          this.$carousel.on('scroll.flickity', function (e, scrollProgress) {
            this.flkty.slides.forEach(function (slide, index) {
              var image = backgroundImages[index],
                parallaxOffset = (-1 * (slide.target + this.flkty.x)) / 3;
              image.style.transform = 'translateX( ' + parallaxOffset + 'px)';
            });
          });
      }
    }
    _status() {
      function updateStatus() {
        if (this.flkty.slides !== undefined) {
          (currentSlideIndex = this.flkty.selectedIndex + 1),
            (totalSlides = this.flkty.slides.length),
            padWithZeros &&
              ((currentSlideIndex = padWithLeadingZeros(currentSlideIndex, 2)),
              (totalSlides = padWithLeadingZeros(totalSlides, 2))),
            currentSlideElement.text(currentSlideIndex),
            totalSlidesElement.text(totalSlides);
        }
      }
      function padWithLeadingZeros(value, length) {
        return (value = value.toString()).length < length
          ? padWithLeadingZeros('0' + value, length)
          : value;
      }
      var carouselInstance = this,
        statusContainer = $('.carousel--status' + this.IdSlider);

      if (statusContainer.length !== 0) {
        var currentSlideElement = statusContainer.find('[data-current-slide]'),
          totalSlidesElement = statusContainer.find('[data-total-number]'),
          padWithZeros = this.args.pad || false,
          currentSlideIndex = 0,
          totalSlides = 0;

        updateStatus(), this.$carousel.on(this.selectors.select, updateStatus);
      }
    }

    _customIcon(prevButton, nextButton) {
      const arrowPrev = $(
        '<svg class="icon icon--prev"><use href="#icon-arrow-left"></use></svg>'
      );
      const arrowNext = $(
        '<svg class="icon icon--next"><use href="#icon-arrow-right"></use></svg>'
      );
      prevButton.html(arrowPrev);
      nextButton.html(arrowNext);
    }

    _initCarouselNav() {
      // Initialize carousel navigation element with ID-based selector
      this.$carouselNav = $('.carousel__nav--' + this.IdSlider);

      // Check if carousel navigation element exists
      if (this.$carouselNav.length > 0) {
        // Add thumbnails and initial styling if not already done
        if (!p) this.addThumbIcons();

        // Generate thumbnails markup
        this.thumbnailsMarkup();

        // Set initial active class for the selected navigation link
        this.$carouselNavLinks
          .eq(this.args.initialIndex)
          .addClass(this.isNavActive);

        // Setup previous and next navigation buttons
        this.$carouselNavPrev = $(`[data-thumb-btn__prev="${this.IdSlider}"]`);
        this.$carouselNavNext = $(`[data-thumb-btn__next="${this.IdSlider}"]`);

        // Bind click events to navigation buttons if they exist
        if (this.$carouselNavPrev.length || this.$carouselNavNext.length) {
          this.$carouselNavPrev.on(this.clickThumb, function () {
            this.actionsAPI('previous');
          });
          this.$carouselNavNext.on(this.clickThumb, function () {
            this.actionsAPI('next');
          });
        }

        // Add event listeners for clicking on navigation items
        if (this.args.isFilter) {
          // For filtered view, only select visible navigation items
          this.$carouselNav.on(this.clickThumb, '.' + this.navItem, (event) => {
            let index = this.$carouselNav
              .find(`.${this.navItem}:visible`)
              .index($(this));
            this.$carousel.flickity('select', index);
          });
        } else {
          // Select item based on index
          this.$carouselNav.on(
            this.clickThumb,
            '.' + this.navItem,
            function (event) {
              this.$carousel.flickity('select', $(this).index());
            }
          );
        }
      }
    }

    addThumbIcons() {
      const templateElement = $('template[data-icons-thumb]');
      // Check if thumbnail icon template exists and append it if necessary
      if (templateElement.length > 0) {
        T4SThemeSP.$appendComponent.after(templateElement.html());
        _p = true;
      }
    }

    thumbnailsMarkup() {
      const thumbnailMarkup = '';

      // Generate markup for each main slide element
      this.$el.find('[data-main-slide]').each(function () {
        const slideElement = $(this);
        const isMediaHidden = slideElement.hasClass('is--media-hide')
          ? 'is--media-hide'
          : '';
        const mediaType = slideElement.data('media-type');
        const videoHost = slideElement.data('vhost') || '';
        const groupName = slideElement.data('grname') || '';
        const groupValue = slideElement.data('grpvl') || '';
        const imageStyle = slideElement.find('.ratio').attr('style');
        const imageElement = slideElement.find('img');
        const imagePath = window.T4SThemeSP.Images.lazyloadImagePath(
          imageElement.attr('data-master') || imageElement.attr('data-src')
        );
        const badge = u[mediaType + videoHost] || '';

        // Assemble thumbnail markup
        thumbnailMarkup += `<div class="col-item ${
          o.navItem
        } ${isMediaHidden}" data-grname="${groupName}" data-grpvl="${groupValue}" data-mdtype="${mediaType}" data-vhost="${videoHost}"><div class="ratio carousel__nav-inner bg-11" style="${imageStyle};background: url(${imagePath})"><img alt="${T4SThemeSP.escapeHtml(
          imageElement.attr('alt')
        )}" loading="lazy" class="lazyload" data-src="${imagePath}" data-widths="[80, 120, 160 ,180, 360, 540]" data-optimumx="1.8" data-sizes="auto" src="${imagePath}"><span class="thumbnail__badge not-style opacity-0" aria-hidden="true">${badge}</span></div></div>`;
      });

      // Append generated markup and apply visibility styling
      this.$carouselNav
        .empty()
        .append(thumbnailMarkup)
        .addClass('is--nav-ready');

      var visibleSlidesCount = this.$el.find(
        '[data-main-slide]:visible'
      ).length;
      this.$carouselNavLinks = this.$carouselNav.find(
        `.${o.navItem}:not(.is--media-hide):visible`
      );

      // Adjust navigation visibility for vertical or horizontal thumbnails
      if (this.args.thumbVertical) {
        this._adjustVerticalNav(visibleSlidesCount);
      } else {
        this._adjustHorizontalNav(visibleSlidesCount);
      }

      // Add class to the last visible thumbnail item
      this.$carouselNavLinks
        .eq(this.$carouselNavLinks.length - 1)
        .addClass('thumb-nav-visible-last');
    }

    _adjustVerticalNav(visibleSlidesCount) {
      var navContainer = this.$carouselNav.parents('.parent-nav');
      var itemHeight = this.$carouselNav
        .find('.col-item:not(.is--media-hide):visible')
        .outerHeight();

      // Check if navigation needs to be active
      if (navContainer.outerHeight() + 20 < itemHeight * visibleSlidesCount) {
        navContainer.addClass('thumb-nav-active');
      } else {
        navContainer.removeClass('thumb-nav-active');
      }
    }
    _adjustHorizontalNav(visibleSlidesCount) {
      var navContainer = this.$carouselNav.parents('.parent-nav');
      var itemWidth = this.$carouselNav
        .find('.col-item:not(.is--media-hide):visible')
        .outerWidth();

      // Check if navigation needs to be active
      if (navContainer.outerWidth() + 20 < itemWidth * visibleSlidesCount) {
        navContainer.addClass('thumb-nav-active');
      } else {
        navContainer.removeClass('thumb-nav-active');
      }
    }

    thumbnailsGoto(e) {
      if (this.$carouselNavLinks !== undefined) {
        const navLink = this.$carouselNavLinks.eq(e)[0];
        const scrollDuration = isBehaviorSmooth ? 0 : 350;

        this.$carouselNavScroller = $(
          `[data-thumb__scroller="${this.IdSlider}"]`
        );
        this.$carouselNav.find(`.${o.isNavActive}`).removeClass(o.isNavActive);
        this.$carouselNavLinks.eq(e).classList.add(o.isNavActive);

        if (this.args.thumbVertical) {
          const offsetTop = navLink.offsetTop;
          if (g) {
            this.$carouselNavScroller[0].scrollTop = offsetTop - 100;
          } else {
            this.$carouselNavScroller
              .stop()
              .animate({ scrollTop: offsetTop - 100 }, scrollDuration);
          }
        } else {
          const offsetLeft = navLink.offsetLeft;
          if (g) {
            this.$carouselNavScroller[0].scrollLeft = offsetLeft - 100;
          } else {
            this.$carouselNavScroller
              .stop()
              .animate({ scrollLeft: offsetLeft - 100 }, scrollDuration);
          }
        }
      }
    }

    _switchMedia(e) {
      this.$el
        .find(`.flickity-slider ${s.productMediaWrapper}`)
        .eq(this.selectedIndex);
      const selectedMedia = this.$el
        .find(`.flickity-slider ${s.productMediaWrapper}`)
        .eq(e);

      this.selectedIndex = this.flkty.selectedIndex;
      this.$groupBtn.removeAttr('hidden');
      this.$mediaGroup.removeClass(o.isXrShowing);
      this.flkty.options.draggable = true;

      $(s.productMediaPlay).each(() => {
        this.dispatchEvent(
          new CustomEvent('mediaHidden', { bubbles: true, cancelable: true })
        );
        this.removeAttr(s.dataMediaPlay);
      });

      if (
        selectedMedia.is('[data-deferred-media]') ||
        selectedMedia.is("[data-media-type='360']")
      ) {
        this.flkty.options.draggable = false;
        this.flkty.updateDraggable();
        if (selectedMedia.is('[data-media-type="model"]')) {
          this.$mediaGroup.addClass(o.isXrShowing);
        } else {
          this.$groupBtn.setAttribute('hidden', true);
        }
        selectedMedia.attr(s.dataMediaPlay, '');
        selectedMedia.dispatchEvent(
          new CustomEvent('mediaVisible', { bubbles: true, cancelable: true })
        );
      } else {
        this.flkty.updateDraggable();
      }
    }

    _updateCarousel() {
      this.$carousel.on('update.flickity', () => {
        $(this).flickity('deactivate').flickity('activate');
        if (this.$carouselNav) this.thumbnailsMarkup('update');
      });
    }

    _updateBtnTab() {
      const prevButton = $(`#btn-tab-smart__prev--${this.args.t4sidTab}`);
      const nextButton = $(`#btn-tab-smart__next--${this.args.t4sidTab}`);

      if (nextButton) {
        this.$carousel.on('updateBtnTab.flickity', () => {
          prevButton.off(a.clicknavUI);
          nextButton.off(a.clicknavUI);
          this._customNavUI(prevButton, nextButton);
          this._customIcon(prevButton, nextButton);
        });

        if (this.args.activeTab) {
          this.$carousel.trigger('updateBtnTab.flickity');
        }
      }
    }

    _customIcon(prevButton, nextButton) {
      const iconType = this.args.customIcon;
      if (!iconType) return;

      const prevIcon = `
            <svg viewBox="${this.args.viewBox}" class="flickity-button-icon cus-icon-slider is--cus-ic-${iconType}">
                <use href="#svg-slider-btn___prev-${iconType}"></use>
            </svg>
            <span class="flicky-btn-text">${window.T4Sstrings.btn_prev}</span>
        `;

      const nextIcon = `
            <svg viewBox="${this.args.viewBox}" class="flickity-button-icon cus-icon-slider is--cus-ic-${iconType}">
                <use href="#svg-slider-btn___next-${iconType}"></use>
            </svg>
            <span class="flicky-btn-text">${window.T4Sstrings.btn_next}</span>
        `;

      prevButton.text(prevIcon);
      nextButton.text(nextIcon);
    }

    _selectWithSelector() {
      const carouselItems = $(`[data-carousel-id="${this.IdSlider}"]`);
      if (carouselItems.length === 0) return;

      carouselItems.on('click', () => {
        this.$carousel.flickity('select', $(this).index);
      });

      const flickityLinks = this.$carousel.find('[data-flickity-link]');
      this.$carousel.on(a.select, () => {
        carouselItems.filter(`.${o.isActive}`).removeClass(o.isActive);
        carouselItemseq(e.flkty.selectedIndex).addClass(o.isActive);

        const url = $(this.flkty.selectedElement).data('url');
        if (flickityLinks[0] && url) flickityLinks[0].attr('href', url);
      });
    }

    _scrollbarCarousel() {
      const updateScrollbarSize = () => {
        clearTimeout(this.recalculateScrollSizeTimeout);
        this.recalculateScrollSizeTimeout = setTimeout(() => {
          this.$scrollbar.style.setProperty(
            '--width',
            `${this.flkty.size.width ** 2 / this.flkty.slideableWidth}px`
          );
          this.$scrollbar.classList.toggle(
            'is--hidden',
            this.flkty.size.width >= this.flkty.slideableWidth
          );
          this.scrollInnerSize =
            this.$scrollbarDrag.offsetWidth / this.$scrollbar.offsetWidth;
        }, 155);
      };

      this.$scrollbar = $(`.carousel-scrollbar--${this.IdSlider}`);
      if (this.$scrollbar[0]) {
        this.$scrollbarDrag = this.$scrollbar.find('.carousel-scrollbar__drag');
        this.scrollInnerSize = 0;
        updateScrollbarSize();

        $window.on(
          `resize.scrollbar${n.IdSlider}`,
          window.T4SThemeSP.debounce(400, updateScrollbarSize)
        );
        this.$carousel.on('scroll.flickity', (event, scrollPercent) => {
          this.$scrollbar.css({
            '--left': `${scrollPercent * (1 - this.scrollInnerSize) * 100}%`,
          });
        });
      }
    }

    handleResizeEvents() {
      const { thumbVertical } = this.args;

      $window.on(
        this.eventNamespace,
        window.T4SThemeSP.debounce(300, () => {
          if (this.hasMWLG) {
            this.args.cellAlign =
              this.args.minWidthLG <= $window.width()
                ? this.args.cellAlignLG
                : this.args.cellAlignOriginal;
          }
          this.actionsAPI('resize');

          if ($window.width() < 1025 && thumbVertical) {
            this.args.thumbVertical = false;
          } else if ($window.width() > 1024 && thumbVertical) {
            this.args.thumbVertical = true;
          }
        }).bind(this)
      );
    }
  };

  //done
  // Utility to get the window width
  window.liquidWindowWidth = () => window.innerWidth;

  //done
  // Initialize carousel function
  window.T4SThemeSP.initCarousel = () => {
    const flickityElements = $(
      '.flickity:not(.flickity-later):not(.flickity-enabled)'
    );
    if (flickityElements.length > 0) {
      flickityElements.each((_, element) => {
        element.flickity = new window.T4SThemeSP.Carousel(element);
      });
    }
  };

  //done
  // Initialize when an element is visible
  window.T4SThemeSP.initWhenVisible = (options) => {
    const threshold = options.threshold || 0;
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof options.callback === 'function') {
            options.callback();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      }
    ).observe(options.element);
  };

  //done
  // Isotope functionality
  window.T4SThemeSP.Isotopet4s = (() => {
    const initIsotope = (element) => {
      element.removeClass('isotope-later');
      const isotopeOptions = JSON.parse(
        element.attr('data-isotope-js') || '{}'
      );
      const isotopeInstance = element
        .isotope(isotopeOptions)
        .addClass('isotope-enabled');

      $window.on(
        'resize',
        window.T4SThemeSP.debounce(555, () => {
          if (element.hasClass('isotope-enabled')) {
            isotopeInstance.isotope('layout');
          }
        })
      );
    };

    const setupFilters = () => {
      const filterElements = $('[data-isotope-filter]');
      if (filterElements.length > 0) {
        const buttonSelector = IsDesignMode
          ? '[data-isotope-filter]>button'
          : '>button';
        const targetElements = IsDesignMode ? $body : filterElements;

        targetElements.on('click', buttonSelector, (event) => {
          const button = $(event.currentTarget);
          const filterContainer = button.closest('[data-isotope-filter]');
          const gridSelector = filterContainer.data('grid');
          const targetGrid = gridSelector
            ? $(gridSelector)
            : filterContainer.next();

          filterContainer.find('.is--active').removeClass('is--active');
          button.addClass('is--active');
          targetGrid.isotope({
            filter: button.attr('data-filter'),
          });
        });
      }
    };

    return {
      initEach: () => {
        const elements = $(
          '.isotope:not(.isotope-later):not(.isotope-enabled)'
        );
        if (elements.length > 0) {
          elements.each((_, element) => {
            initIsotope($(element));
          });
          setupFilters();
        }
      },
      init: initIsotope,
      filter: setupFilters,
    };
  })();

  //done
  // Wrapper table
  window.T4SThemeSP.T4SWrappTable = () => {
    $("table:not('.table-res')").wrap("<div class='table-res-df'></div>");
  };

  //done
  // Accordion mobile interaction
  window.T4SThemeSP.AccordionMobileInt = () => {
    const accordionElements = $('.accordion-mb-true');
    if (accordionElements.length === 0) return;

    const toggleWidth = accordionElements.data('w-toggle') || 1024;
    const isMobile = $(window).width() <= toggleWidth;

    accordionElements
      .toggleClass('type-tabs', !isMobile)
      .toggleClass('type-accordion', isMobile);
  };

  //done
  // Remove cart attributes
  window.T4SThemeSP.CartAttrHidden = () => {
    const hiddenCartAttrs = $('[data-cart-attr-rm]');
    let count = 0;

    if (
      hiddenCartAttrs.length > 0 &&
      !T4Swindow.T4Sconfigsconfigs.CartAttrHidden
    ) {
      const intervalId = setInterval(() => {
        hiddenCartAttrs.val('');
        if (++count === 15) clearInterval(intervalId);
      }, 500);

      $body.on('click', 'button[type=submit][name="checkout"]', () => {
        hiddenCartAttrs.val('');
      });
    }
  };

  //done
  window.T4SThemeSP.announcement = () => {
    const announcementConfig = {
      bar: '.announcement-bar',
      btnClose: '.announcement-bar__close',
    };

    const announcementBar = $(announcementConfig.bar);
    const version = announcementBar.attr('data-ver');
    const theme = window.T4Sconfigs.theme;
    const cookieKey = `announcement_${theme}_${version}`;
    const expirationDate = parseInt(announcementBar.attr('data-date'));

    if (
      announcementBar.length > 0 &&
      window.CookiesT4.get(cookieKey) !== 'closed'
    ) {
      const alternateCookieKey = `announcement_${theme}_${
        version === '1_nt' ? '2_nt' : '1_nt'
      }`;
      if (window.CookiesT4.get(alternateCookieKey) === 'closed') {
        window.CookiesT4.remove(alternateCookieKey);
      }

      $(announcementConfig.btnClose).on('click', () => {
        announcementBar
          .css('min-height', 'auto')
          .attr('aria-hidden', true)
          .slideUp();
        $html.css('--announcement-height', '');

        if (!IsDesignMode) {
          window.CookiesT4.set(cookieKey, 'closed', {
            expires: expirationDate,
            path: '/',
          });
        }
      });
    }
  };

  //done
  // Define the Marquee3k class
  window.T4SThemeSP.Marquee3k = class {
    el = null;
    $el = null;
    width = 0;
    UID = 0;
    resizeEvent = null;

    Marquee3kClass = {
      enabled: 'marquee-enabled',
      animation: 'marquee--animation',
      duplicate: 'marquee--duplicate',
    };

    constructor(element) {
      this.el = element;
      this.$el = $(element);
      // this.width = 0;
      this.UID = window.T4SThemeSP.getUID();
      this.resizeEvent = `resize.marquee${this.UID}`;
      this.marquee3kItem = element.querySelector('.marquee__item');

      // Set a timeout to handle resizing in design mode
      IsDesignMode
        ? setTimeout(this.resizeHandler.bind(this), 100)
        : this.resizeHandler();

      this.$el.addClass(window.T4SThemeSP.Marquee3k.Marquee3kClass.enabled);

      // Debounce the resize event
      $window.on(
        this.resizeEvent,
        window.T4SThemeSP.debounce(300, () => this.resizeHandler())
      );
    }

    // Define the resize handler method
    resizeHandler() {
      if (this.width !== window.innerWidth) {
        this.width = window.innerWidth;
        this.marquee3kItem.classList.remove(
          window.T4SThemeSP.Marquee3k.Marquee3kClass.animation
        );

        const duplicates = this.el.querySelectorAll(
          `.${window.T4SThemeSP.Marquee3k.Marquee3kClass.duplicate}`
        );
        duplicates.forEach((duplicate) => duplicate.remove());

        let itemCount = Math.max(
          Math.floor(window.innerWidth / this.marquee3kItem.offsetWidth),
          5
        );
        for (let i = 0; i < itemCount; i++) {
          const clone = this.marquee3kItem.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.classList.add(
            window.T4SThemeSP.Marquee3k.Marquee3kClass.duplicate,
            window.T4SThemeSP.Marquee3k.Marquee3kClass.animation
          );
          this.el.append(clone);
        }

        this.marquee3kItem.classList.add(
          window.T4SThemeSP.Marquee3k.Marquee3kClass.animation
        );
      }
    }
  };

  //done
  window.T4SThemeSP.initMarquee3k = function () {
    const marquees = $('.marquee:not(.marquee-enabled)');
    if (marquees.length > 0) {
      marquees.each((_, element) => {
        element.marquee3k = new window.T4SThemeSP.Marquee3k(element);
      });
    }
  };

  //done
  window.T4SThemeSP.initVarHeight = function () {
    const elements = $('[data-get-height]:not(.var-css-enabled)');
    if (elements.length > 0) {
      updateHeight();
      $window.on(
        'resize.varHeight',
        window.T4SThemeSP.debounce(550, () => {
          updateHeight();
        })
      );
    }

    // Function to update the height
    function updateHeight() {
      elements.each((_, element) => {
        $(element)
          .closest('.section')
          .css('--var-ts-height', `${$(element).height()}px`);
      });
    }
  };

  // Handle form response visibility
  if (window.location.search.includes('_posted=true')) $;
  const recentFormId = localStorage.getItem('recentform') || 'xyz';
  $(`form:not(${window.location.hash}):not(#${recentFormId})`).each(
    (_, element) => {
      $(element).find('[data-ts-response-form]').hide();
    }
  );

  // Hide preview bar if needed
  if (!window.location.href.includes(window.T4Sconfigs.preViewBar)) {
    $html.addClass('is--hidden-previewbar');
  }

  //done
  // Define helper functions
  window.T4SThemeSP.Helpers = {
    disableBodyScroll() {
      let clientY = null;
      let targetSelector = null;
      let scrollableElement = null;

      // Polyfill for matches and closest
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      }

      if (!Element.prototype.closest) {
        Element.prototype.closest = function (selector) {
          let element = this;
          while (element && !element.matches(selector)) {
            element = element.parentElement;
          }
          return element;
        };
      }

      // Prevent default scrolling behavior
      const preventDefaultScroll = (event) => {
        if (!isScrollDisabled || !event.target.closest(targetSelector)) {
          event.preventDefault();
        }
      };

      // Handle touch start event
      const handleTouchStart = (event) => {
        if (event.targetTouches.length === 1) {
          clientY = event.targetTouches[0].clientY;
        }
      };

      // Handle touch move event
      const handleTouchMove = (event) => {
        if (event.targetTouches.length === 1) {
          const deltaY = event.targetTouches[0].clientY - clientY;
          if (scrollableElement.scrollTop === 0 && deltaY > 0) {
            event.preventDefault();
          }

          if (
            scrollableElement.scrollHeight - scrollableElement.scrollTop <=
              scrollableElement.clientHeight &&
            deltaY < 0
          ) {
            event.preventDefault();
          }
        }
      };

      return (enable, selector) => {
        if (selector !== undefined) {
          targetSelector = selector;
          scrollableElement = document.querySelector(selector);
        }

        if (enable) {
          if (scrollableElement) {
            scrollableElement.addEventListener(
              'touchstart',
              handleTouchStart,
              false
            );
            scrollableElement.addEventListener(
              'touchmove',
              handleTouchMove,
              false
            );
          }
          document.body.addEventListener(
            'touchmove',
            preventDefaultScroll,
            false
          );
        } else {
          if (scrollableElement) {
            scrollableElement.removeEventListener(
              'touchstart',
              handleTouchStart,
              false
            );
            scrollableElement.removeEventListener(
              'touchmove',
              handleTouchMove,
              false
            );
          }
          document.body.removeEventListener(
            'touchmove',
            preventDefaultScroll,
            false
          );
        }
      };
    },

    debounce(func, wait, immediate) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);

        if (callNow) func.apply(context, args);
      };
    },

    getScript(url, callback) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;

        // On load or error, resolve or reject the promise
        const onLoadOrError = (event, type) => {
          if (
            type ||
            !script.readyState ||
            /loaded|complete/.test(script.readyState)
          ) {
            script.onload = null;
            script.onreadystatechange = null;
            script = undefined;
            if (type) {
              reject(new Error(`Script load error: ${url}`));
            } else {
              resolve();
            }
          }
        };

        script.onload = onLoadOrError;
        script.onreadystatechange = onLoadOrError;
        script.src = url;

        document.head.appendChild(script);
      });
    },

    loadScript(url, callback) {
      if (url) {
        $.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true,
        });
      }
    },

    prepareTransition(element) {
      const transitionEndHandler = (event) => {
        event.currentTarget.classList.remove('is-transitioning');
      };

      $.addEventListener('transitionend', transitionEndHandler, {
        once: true,
      });

      // Calculate the duration of the transition
      let duration = 0;
      const transitionDurations = [
        'transition-duration',
        '-moz-transition-duration',
        '-webkit-transition-duration',
        '-o-transition-duration',
      ];
      transitionDurations.forEach((property) => {
        const durationValue = getComputedStyle(element)[property];
        if (durationValue) {
          const numericValue = parseFloat(durationValue);
          if (numericValue > duration) {
            duration = numericValue;
          }
        }
      });

      if (duration > 0) {
        element.classList.add('is-transitioning');
        element.offsetWidth; // Trigger reflow
      }
    },

    cookiesEnabled() {
      let enabled = navigator.cookieEnabled;
      if (!enabled) {
        document.cookie = 'testcookie';
        enabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return enabled;
    },

    promiseStylesheet(url) {
      const stylesheetName = url.match(/[\w-]+\.(css)/g)[0];
      if (!window.T4SThemeSP.stylesheetPromise[stylesheetName]) {
        window.T4SThemeSP.stylesheetPromise[stylesheetName] = new Promise(
          (resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            document.head.appendChild(link);

            link.onload = () => setTimeout(resolve, 100);
          }
        );
      }
      return window.T4SThemeSP.stylesheetPromise[stylesheetName];
    },
  };

  //done
  window.T4SThemeSP.stylesheetPromise = {};

  //done
  // Get scrollbar width and update CSS variable
  window.T4SThemeSP.getScrollbar = () => {
    const updateScrollbarWidth = () => {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      if (scrollbarWidth >= 0) {
        $html.css({
          '--scroll-w': `${scrollbarWidth}px`,
        });
        window.T4SThemeSP.scrollbarWidth = scrollbarWidth;
      }
    };

    updateScrollbarWidth();

    // Handle window resize
    window.addEventListener('resize', function () {
      let animationFrameId = null;
      animationFrameId = requestAnimationFrame(() => {
        updateScrollbarWidth();
        cancelAnimationFrame(animationFrameId);
      });
    });
  };

  //done
  window.T4SThemeSP.Drawer = (() => {
    let isOpen = false;
    const clickEvent = 'click.drawer';
    const keyupEvent = 'keyup.drawer';
    const drawerOptionsAttr = 'data-drawer-options';
    const drawerDelayAttr = 'data-drawer-delay';
    const openClass = ' is--opend-drawer';
    const overlayVisibleClass = 'is--visible';
    const lockScrollClass = 'lock-scroll';
    const scrollbarWidth = window.T4SThemeSP.scrollbarWidth;
    const closeOverlayElement = $('.close-overlay');
    const bodyScrollTarget = '[data-ts-scroll-me]';

    // Open drawer
    const openDrawer = (event, trigger, immediate = false) => {
      if (!isOpen) {
        event && event.preventDefault();
        const options = parseOptions(trigger.attr(drawerOptionsAttr));
        const drawer = immediate ? trigger : $(options.id);
        drawer.trigger('opendDrawer');
        drawer.attr('aria-hidden', 'false');
        closeOverlayElement.addClass(overlayVisibleClass);
        isOpen = true;
        $html.addClass(lockScrollClass + openClass);
        $html.css({ 'margin-right': scrollbarWidth });
        window.T4SThemeSP.Helpers.disableBodyScroll(true, bodyScrollTarget);
      }
    };

    // Close drawer
    const closeDrawer = (event, trigger) => {
      if (isOpen) {
        event && event.preventDefault();
        let drawer = $('.drawer[aria-hidden=false]');
        if (drawer.length > 1) {
          drawer = $(trigger.attr('data-drawer-target')) || drawer;
        }
        drawer.attr('aria-hidden', 'true');
        if ($('.drawer[aria-hidden=false]').length <= 1) {
          closeOverlayElement.removeClass(overlayVisibleClass);
          isOpen = false;
          drawer.one('transitionend', () => {
            $html.removeClass(lockScrollClass + openClass);
            $html.css({ 'margin-right': '' });
            window.T4SThemeSP.Helpers.disableBodyScroll(
              false,
              bodyScrollTarget
            );
          });
          closeOverlayElement.off(clickEvent);
          $html.off(clickEvent);
          $html.off(keyupEvent);
        }
      }
    };

    const parseOptions = (optionsString, fallback = '{}') => {
      return JSON.parse(optionsString || fallback);
    };

    const init = () => {
      // Bind click event to drawer open elements
      $document.on(
        clickEvent,
        `[${drawerOptionsAttr}]:not([${drawerDelayAttr}])`,
        (event) => {
          openDrawer(event, $(event.currentTarget));
          bindCloseEvents();
        }
      );

      // Sidebar trigger
      bindSidebarTrigger();
    };

    // Bind sidebar trigger
    const bindSidebarTrigger = () => {
      const sidebarTrigger = $('[data-sidebar-trigger]');
      const sidebarButton = $('.btn-sidebar');
      if (sidebarTrigger.length && sidebarButton.length) {
        sidebarTrigger.on(clickEvent, (event) => {
          event.preventDefault();
          sidebarButton.trigger(clickEvent);
        });
      }
    };

    // Bind close events
    const bindCloseEvents = () => {
      closeOverlayElement.on(clickEvent, closeDrawer);
      $html.on(clickEvent, '[data-drawer-close]', (event) => {
        closeDrawer(event, $(event.currentTarget));
      });
      $html.on(keyupEvent, (event) => {
        if (event.keyCode === 27) {
          closeDrawer(event);
          if (window.closeCustomKey) window.closeCustomKey();
        }
      });
    };

    return {
      init,
      opend: (trigger) => {
        isOpen = false;
        openDrawer(null, trigger, true);
        bindCloseEvents();
      },
      close: closeDrawer,
      remove: (id) => {
        $(`[${drawerOptionsAttr}*="#${id}"]`).removeAttr(drawerDelayAttr);
      },
    };
  })();

  //done
  window.T4SThemeSP.Reveal = (() => {
    const revealClass = 'hdt-reveal';
    const offscreenClass = `${revealClass}--offscreen`;
    const cancelClass = `${revealClass}--cancel`;

    // Handle the animation end event
    const handleAnimationEnd = (event) => {
      const target = event.target;
      if (target.isAnimationend) {
        target.setAttribute('animationend', '');
        target.removeEventListener('animationend', handleAnimationEnd);
      }
    };

    // Intersection observer callback
    const observerCallback = (entries, observer) => {
      entries.forEach((entry, index) => {
        const target = entry.target;
        target.setAttribute('observed', '');

        if (entry.isIntersecting) {
          // If the element is in view
          if (target.classList.contains(offscreenClass)) {
            target.classList.remove(offscreenClass);
            if (target.hasAttribute('timeline')) {
              target.style.setProperty('--animation-order', index);
            }
          }
          observer.unobserve(target);
        } else {
          // If the element is out of view
          target.classList.add(offscreenClass);
          target.classList.remove(cancelClass);
        }

        target.isAnimationend = true;
        target.addEventListener('animationend', handleAnimationEnd);
      });
    };

    // Main reveal function
    return (context = document, designMode = false) => {
      const elements = Array.from(
        context.querySelectorAll(`[${revealClass}]:not([observed])`)
      );

      if (elements.length === 0) {
        return;
      }

      // Handle design mode
      if (designMode) {
        elements.forEach((element) => {
          element.classList.add(`${revealClass}--design-mode`);
        });
        return;
      }

      // Set up intersection observer
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '0px 0px -50px 0px',
      });

      // Observe each element
      elements.forEach((element) => observer.observe(element));
    };
  })();
})(window.jQuery || window.$);

// Check if revealInView is enabled and prefers-reduced-motion is no-preference
if (
  window.T4Sconfigs.revealInView &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches
) {
  documentElement.classList.add('hdt-reveal-in-view');

  // Initialize the reveal function on DOMContentLoaded
  window.addEventListener('DOMContentLoaded', () => window.T4SThemeSP.Reveal());

  // Handle Shopify design mode events
  if (Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) =>
      window.T4SThemeSP.Reveal(event.target, true)
    );
    document.addEventListener('shopify:section:reorder', () =>
      window.T4SThemeSP.Reveal(document, true)
    );
  }
}

// jQuery document ready function
$(document).ready(($) => {
  $('html').addClass(
    'browser-' + window.jscd.browser + ' platform-' + window.jscd.os
  );
  window.T4SThemeSP.fullHeightFirtSe();
  window.T4SThemeSP.initVarHeight();
  window.T4SThemeSP.initMarquee3k();
  window.T4SThemeSP.initCarousel();
  window.T4SThemeSP.Isotopet4s.initEach();
  window.T4SThemeSP.announcement();
  window.T4SThemeSP.T4SWrappTable();
  window.T4SThemeSP.CartAttrHidden();
  window.T4SThemeSP.Drawer.init();
  window.T4SThemeSP.getScrollbar();

  // Load scripts based on feature availability
  const scriptLoader = () => {
    if (IsDesignMode) window.$script(window.T4Sconfigs.script9);
    window.$script(window.T4Sconfigs.script10);
  };

  if (
    'fetch' in window &&
    'assign' in Object &&
    'ResizeObserver' in window &&
    'IntersectionObserver' in window &&
    'DateTimeFormat' in Intl
  ) {
    window.$script(window.T4Sconfigs.script2, scriptLoader);
  } else {
    window.$script(window.T4Sconfigs.script1, () => {
      window.$script(window.T4Sconfigs.script2, scriptLoader);
    });
  }

  if ($('[data-ts-type]').length > 0) {
    window.$script(window.T4Sconfigs.script12d);
  }
});

//done
// Handle window resize event
$(window).on('resize', () => {
  window.T4SThemeSP.AccordionMobileInt();
});
