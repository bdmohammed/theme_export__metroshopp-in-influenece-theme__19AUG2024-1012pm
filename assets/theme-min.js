//done
// Function to create a common module
function createCommonjsModule(callback, path) {
  const config = {
    path,
    exports: {},
    require: () => commonjsRequire(),
  };
  callback(config, config.exports);
  return config.exports;
}

//done
function commonjsRequire() {
  throw new Error('Error commonjs');
}

function onYouTubeIframeAPIReady() {
  document.dispatchEvent(new CustomEvent('youtube:ready'));
}

/*!
 * Jarallax v2.2.1 (https://github.com/nk-o/jarallax)
 * Copyright 2024 nK <https://nkdev.info>
 * Licensed under MIT (https://github.com/nk-o/jarallax/blob/master/LICENSE)
 */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : ((e =
        'undefined' != typeof globalThis ? globalThis : e || self).jarallax =
        t());
})(window, function () {
  'use strict';
  function e(e) {
    'complete' === document.readyState || 'interactive' === document.readyState
      ? e()
      : document.addEventListener('DOMContentLoaded', e, {
          capture: !0,
          once: !0,
          passive: !0,
        });
  }
  let t;
  t =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : {};
  var i = t,
    o = {
      type: 'scroll',
      speed: 0.5,
      containerClass: 'jarallax-container',
      imgSrc: null,
      imgElement: '.jarallax-img',
      imgSize: 'cover',
      imgPosition: '50% 50%',
      imgRepeat: 'no-repeat',
      keepImg: !1,
      elementInViewport: null,
      zIndex: -100,
      disableParallax: !1,
      onScroll: null,
      onInit: null,
      onDestroy: null,
      onCoverImage: null,
      videoClass: 'jarallax-video',
      videoSrc: null,
      videoStartTime: 0,
      videoEndTime: 0,
      videoVolume: 0,
      videoLoop: !0,
      videoPlayOnlyVisible: !0,
      videoLazyLoading: !0,
      disableVideo: !1,
      onVideoInsert: null,
      onVideoWorkerInit: null,
    };
  const { navigator: n } = i,
    a = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      n.userAgent
    );
  let s, l, r;
  function c() {
    (s = i.innerWidth || document.documentElement.clientWidth),
      a
        ? (!r &&
            document.body &&
            ((r = document.createElement('div')),
            (r.style.cssText =
              'position: fixed; top: -9999px; left: 0; height: 100vh; width: 0;'),
            document.body.appendChild(r)),
          (l =
            (r ? r.clientHeight : 0) ||
            i.innerHeight ||
            document.documentElement.clientHeight))
        : (l = i.innerHeight || document.documentElement.clientHeight);
  }
  function p() {
    return { width: s, height: l };
  }
  c(),
    i.addEventListener('resize', c),
    i.addEventListener('orientationchange', c),
    i.addEventListener('load', c),
    e(() => {
      c();
    });
  const m = [];
  function d() {
    if (!m.length) return;
    const { width: e, height: t } = p();
    m.forEach((i, o) => {
      const { instance: n, oldData: a } = i;
      if (!n.isVisible()) return;
      const s = n.$item.getBoundingClientRect(),
        l = {
          width: s.width,
          height: s.height,
          top: s.top,
          bottom: s.bottom,
          wndW: e,
          wndH: t,
        },
        r =
          !a ||
          a.wndW !== l.wndW ||
          a.wndH !== l.wndH ||
          a.width !== l.width ||
          a.height !== l.height,
        c = r || !a || a.top !== l.top || a.bottom !== l.bottom;
      (m[o].oldData = l), r && n.onResize(), c && n.onScroll();
    }),
      i.requestAnimationFrame(d);
  }
  const g = new i.IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        e.target.jarallax.isElementInViewport = e.isIntersecting;
      });
    },
    { rootMargin: '50px' }
  );
  const { navigator: u } = i;
  let f = 0;
  class h {
    constructor(e, t) {
      const i = this;
      (i.instanceID = f), (f += 1), (i.$item = e), (i.defaults = { ...o });
      const n = i.$item.dataset || {},
        a = {};
      if (
        (Object.keys(n).forEach((e) => {
          const t = e.substr(0, 1).toLowerCase() + e.substr(1);
          t && void 0 !== i.defaults[t] && (a[t] = n[e]);
        }),
        (i.options = i.extend({}, i.defaults, a, t)),
        (i.pureOptions = i.extend({}, i.options)),
        Object.keys(i.options).forEach((e) => {
          'true' === i.options[e]
            ? (i.options[e] = !0)
            : 'false' === i.options[e] && (i.options[e] = !1);
        }),
        (i.options.speed = Math.min(
          2,
          Math.max(-1, parseFloat(i.options.speed))
        )),
        'string' == typeof i.options.disableParallax &&
          (i.options.disableParallax = new RegExp(i.options.disableParallax)),
        i.options.disableParallax instanceof RegExp)
      ) {
        const e = i.options.disableParallax;
        i.options.disableParallax = () => e.test(u.userAgent);
      }
      if ('function' != typeof i.options.disableParallax) {
        const e = i.options.disableParallax;
        i.options.disableParallax = () => !0 === e;
      }
      if (
        ('string' == typeof i.options.disableVideo &&
          (i.options.disableVideo = new RegExp(i.options.disableVideo)),
        i.options.disableVideo instanceof RegExp)
      ) {
        const e = i.options.disableVideo;
        i.options.disableVideo = () => e.test(u.userAgent);
      }
      if ('function' != typeof i.options.disableVideo) {
        const e = i.options.disableVideo;
        i.options.disableVideo = () => !0 === e;
      }
      let s = i.options.elementInViewport;
      s && 'object' == typeof s && void 0 !== s.length && ([s] = s),
        s instanceof Element || (s = null),
        (i.options.elementInViewport = s),
        (i.image = {
          src: i.options.imgSrc || null,
          $container: null,
          useImgTag: !1,
          position: 'fixed',
        }),
        i.initImg() && i.canInitParallax() && i.init();
    }
    css(e, t) {
      return (function (e, t) {
        return 'string' == typeof t
          ? i.getComputedStyle(e).getPropertyValue(t)
          : (Object.keys(t).forEach((i) => {
              e.style[i] = t[i];
            }),
            e);
      })(e, t);
    }
    extend(e, ...t) {
      return (function (e, ...t) {
        return (
          (e = e || {}),
          Object.keys(t).forEach((i) => {
            t[i] &&
              Object.keys(t[i]).forEach((o) => {
                e[o] = t[i][o];
              });
          }),
          e
        );
      })(e, ...t);
    }
    getWindowData() {
      const { width: e, height: t } = p();
      return { width: e, height: t, y: document.documentElement.scrollTop };
    }
    initImg() {
      const e = this;
      let t = e.options.imgElement;
      return (
        t && 'string' == typeof t && (t = e.$item.querySelector(t)),
        t instanceof Element ||
          (e.options.imgSrc
            ? ((t = new Image()), (t.src = e.options.imgSrc))
            : (t = null)),
        t &&
          (e.options.keepImg
            ? (e.image.$item = t.cloneNode(!0))
            : ((e.image.$item = t), (e.image.$itemParent = t.parentNode)),
          (e.image.useImgTag = !0)),
        !!e.image.$item ||
          (null === e.image.src &&
            ((e.image.src =
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
            (e.image.bgImage = e.css(e.$item, 'background-image'))),
          !(!e.image.bgImage || 'none' === e.image.bgImage))
      );
    }
    canInitParallax() {
      return !this.options.disableParallax();
    }
    init() {
      const e = this,
        t = {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        };
      let o = {
        pointerEvents: 'none',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      };
      if (!e.options.keepImg) {
        const t = e.$item.getAttribute('style');
        if (
          (t && e.$item.setAttribute('data-jarallax-original-styles', t),
          e.image.useImgTag)
        ) {
          const t = e.image.$item.getAttribute('style');
          t && e.image.$item.setAttribute('data-jarallax-original-styles', t);
        }
      }
      if (
        ('static' === e.css(e.$item, 'position') &&
          e.css(e.$item, { position: 'relative' }),
        'auto' === e.css(e.$item, 'z-index') && e.css(e.$item, { zIndex: 0 }),
        (e.image.$container = document.createElement('div')),
        e.css(e.image.$container, t),
        e.css(e.image.$container, { 'z-index': e.options.zIndex }),
        'fixed' === this.image.position &&
          e.css(e.image.$container, {
            '-webkit-clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }),
        e.image.$container.setAttribute(
          'id',
          `jarallax-container-${e.instanceID}`
        ),
        e.options.containerClass &&
          e.image.$container.setAttribute('class', e.options.containerClass),
        e.$item.appendChild(e.image.$container),
        e.image.useImgTag
          ? (o = e.extend(
              {
                'object-fit': e.options.imgSize,
                'object-position': e.options.imgPosition,
                'max-width': 'none',
              },
              t,
              o
            ))
          : ((e.image.$item = document.createElement('div')),
            e.image.src &&
              (o = e.extend(
                {
                  'background-position': e.options.imgPosition,
                  'background-size': e.options.imgSize,
                  'background-repeat': e.options.imgRepeat,
                  'background-image':
                    e.image.bgImage || `url("${e.image.src}")`,
                },
                t,
                o
              ))),
        ('opacity' !== e.options.type &&
          'scale' !== e.options.type &&
          'scale-opacity' !== e.options.type &&
          1 !== e.options.speed) ||
          (e.image.position = 'absolute'),
        'fixed' === e.image.position)
      ) {
        const t = (function (e) {
          const t = [];
          for (; null !== e.parentElement; )
            1 === (e = e.parentElement).nodeType && t.push(e);
          return t;
        })(e.$item).filter((e) => {
          const t = i.getComputedStyle(e),
            o = t['-webkit-transform'] || t['-moz-transform'] || t.transform;
          return (
            (o && 'none' !== o) ||
            /(auto|scroll)/.test(t.overflow + t['overflow-y'] + t['overflow-x'])
          );
        });
        e.image.position = t.length ? 'absolute' : 'fixed';
      }
      var n;
      (o.position = e.image.position),
        e.css(e.image.$item, o),
        e.image.$container.appendChild(e.image.$item),
        e.onResize(),
        e.onScroll(!0),
        e.options.onInit && e.options.onInit.call(e),
        'none' !== e.css(e.$item, 'background-image') &&
          e.css(e.$item, { 'background-image': 'none' }),
        (n = e),
        m.push({ instance: n }),
        1 === m.length && i.requestAnimationFrame(d),
        g.observe(n.options.elementInViewport || n.$item);
    }
    destroy() {
      const e = this;
      var t;
      (t = e),
        m.forEach((e, i) => {
          e.instance.instanceID === t.instanceID && m.splice(i, 1);
        }),
        g.unobserve(t.options.elementInViewport || t.$item);
      const i = e.$item.getAttribute('data-jarallax-original-styles');
      if (
        (e.$item.removeAttribute('data-jarallax-original-styles'),
        i ? e.$item.setAttribute('style', i) : e.$item.removeAttribute('style'),
        e.image.useImgTag)
      ) {
        const t = e.image.$item.getAttribute('data-jarallax-original-styles');
        e.image.$item.removeAttribute('data-jarallax-original-styles'),
          t
            ? e.image.$item.setAttribute('style', i)
            : e.image.$item.removeAttribute('style'),
          e.image.$itemParent && e.image.$itemParent.appendChild(e.image.$item);
      }
      e.image.$container &&
        e.image.$container.parentNode.removeChild(e.image.$container),
        e.options.onDestroy && e.options.onDestroy.call(e),
        delete e.$item.jarallax;
    }
    coverImage() {
      const e = this,
        { height: t } = p(),
        i = e.image.$container.getBoundingClientRect(),
        o = i.height,
        { speed: n } = e.options,
        a = 'scroll' === e.options.type || 'scroll-opacity' === e.options.type;
      let s = 0,
        l = o,
        r = 0;
      return (
        a &&
          (n < 0
            ? ((s = n * Math.max(o, t)), t < o && (s -= n * (o - t)))
            : (s = n * (o + t)),
          n > 1
            ? (l = Math.abs(s - t))
            : n < 0
            ? (l = s / n + Math.abs(s))
            : (l += (t - o) * (1 - n)),
          (s /= 2)),
        (e.parallaxScrollDistance = s),
        (r = a ? (t - l) / 2 : (o - l) / 2),
        e.css(e.image.$item, {
          height: `${l}px`,
          marginTop: `${r}px`,
          left: 'fixed' === e.image.position ? `${i.left}px` : '0',
          width: `${i.width}px`,
        }),
        e.options.onCoverImage && e.options.onCoverImage.call(e),
        { image: { height: l, marginTop: r }, container: i }
      );
    }
    isVisible() {
      return this.isElementInViewport || !1;
    }
    onScroll(e) {
      const t = this;
      if (!e && !t.isVisible()) return;
      const { height: i } = p(),
        o = t.$item.getBoundingClientRect(),
        n = o.top,
        a = o.height,
        s = {},
        l = Math.max(0, n),
        r = Math.max(0, a + n),
        c = Math.max(0, -n),
        m = Math.max(0, n + a - i),
        d = Math.max(0, a - (n + a - i)),
        g = Math.max(0, -n + i - a),
        u = 1 - ((i - n) / (i + a)) * 2;
      let f = 1;
      if (
        (a < i
          ? (f = 1 - (c || m) / a)
          : r <= i
          ? (f = r / i)
          : d <= i && (f = d / i),
        ('opacity' !== t.options.type &&
          'scale-opacity' !== t.options.type &&
          'scroll-opacity' !== t.options.type) ||
          ((s.transform = 'translate3d(0,0,0)'), (s.opacity = f)),
        'scale' === t.options.type || 'scale-opacity' === t.options.type)
      ) {
        let e = 1;
        t.options.speed < 0
          ? (e -= t.options.speed * f)
          : (e += t.options.speed * (1 - f)),
          (s.transform = `scale(${e}) translate3d(0,0,0)`);
      }
      if ('scroll' === t.options.type || 'scroll-opacity' === t.options.type) {
        let e = t.parallaxScrollDistance * u;
        'absolute' === t.image.position && (e -= n),
          (s.transform = `translate3d(0,${e}px,0)`);
      }
      t.css(t.image.$item, s),
        t.options.onScroll &&
          t.options.onScroll.call(t, {
            section: o,
            beforeTop: l,
            beforeTopEnd: r,
            afterTop: c,
            beforeBottom: m,
            beforeBottomEnd: d,
            afterBottom: g,
            visiblePercent: f,
            fromViewportCenter: u,
          });
    }
    onResize() {
      this.coverImage();
    }
  }
  const b = function (e, t, ...i) {
    ('object' == typeof HTMLElement
      ? e instanceof HTMLElement
      : e &&
        'object' == typeof e &&
        null !== e &&
        1 === e.nodeType &&
        'string' == typeof e.nodeName) && (e = [e]);
    const o = e.length;
    let n,
      a = 0;
    for (; a < o; a += 1)
      if (
        ('object' == typeof t || void 0 === t
          ? e[a].jarallax || (e[a].jarallax = new h(e[a], t))
          : e[a].jarallax && (n = e[a].jarallax[t].apply(e[a].jarallax, i)),
        void 0 !== n)
      )
        return n;
    return e;
  };
  b.constructor = h;
  const y = i.jQuery;
  if (void 0 !== y) {
    const e = function (...e) {
      Array.prototype.unshift.call(e, this);
      const t = b.apply(i, e);
      return 'object' != typeof t ? t : this;
    };
    e.constructor = b.constructor;
    const t = y.fn.jarallax;
    (y.fn.jarallax = e),
      (y.fn.jarallax.noConflict = function () {
        return (y.fn.jarallax = t), this;
      });
  }
  return (
    e(() => {
      b(document.querySelectorAll('[data-jarallax]'));
    }),
    b
  );
}); //# sourceMappingURL=jarallax.min.js.map

window.jQuery.fn.Jarallax = window.jQuery.fn.jarallax.noConflict();

//done
((factory) => {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jQuery_T4NT'], factory);
  } else {
    factory(window.jQuery);
  }
})(($) => {
  'use strict';
  class Countdown {
    countdownInstances = [];
    static dateRegexList = [
      /^[0-9]*$/,
      /([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/,
      /[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/,
    ];
    defaultOptions = {
      precision: 100,
      elapse: false,
      defer: false,
    };
    dateRegex = new RegExp(Countdown.dateRegexList.join('|'));

    timeUnits = {
      Y: 'years',
      m: 'months',
      n: 'daysToMonth',
      d: 'daysToWeek',
      w: 'weeks',
      W: 'weeksToMonth',
      H: 'hours',
      M: 'minutes',
      S: 'seconds',
      D: 'totalDays',
      I: 'totalHours',
      N: 'totalMinutes',
      T: 'totalSeconds',
    };

    el = null;
    $el = null;
    interval = null;
    offset = {};
    options = $.extend({}, this.defaultOptions);
    instanceNumber = 0;

    constructor(element, finalDate, options) {
      this.el = element;
      this.$el = $(element);
      this.interval = null;
      this.offset = {};
      this.countdownInstances.push(this);
      this.$el.data('countdown-instance', this.instanceNumber);

      if (options) {
        if (typeof options === 'function') {
          this.$el.on('update.countdown', options);
          this.$el.on('stoped.countdown', options);
          this.$el.on('finish.countdown', options);
        } else {
          this.options = $.extend({}, this.defaultOptions, options);
        }
      }
      this.setFinalDate(finalDate);
      if (!this.options.defer) {
        this.start();
      }
    }

    escapeRegex(string) {
      const regexSpecialChars = /([.?*+^$[\]\\(){}|-])/g;
      return new RegExp(string.toString().replace(regexSpecialChars, '\\$1'));
    }

    createFormatter(template) {
      let countdownInstance = this;
      return function (formattedString) {
        const matches = formattedString.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
        if (matches) {
          for (let match of matches) {
            const matchDetails = match.match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/);
            const regex = countdownInstance.escapeRegex(matchDetails[0]);
            const flag = matchDetails[1] || '';
            const formatSpec = matchDetails[3] || '';
            let value = null;
            const key = matchDetails[2];

            if (key in countdownInstance.timeUnits) {
              value = countdownInstance.timeUnits[key];
              value = Number(template[value]);
            }
            if (value !== null) {
              if (flag === '!') {
                value = countdownInstance.formatTimeUnit(formatSpec, value);
              }
              if (flag === '' && value < 10) {
                value = '0' + value.toString();
              }
              formattedString = formattedString.replace(
                regex,
                value.toString()
              );
            }
          }
        }
        return formattedString.replace(/%%/, '%');
      };
    }

    formatTimeUnit(formatSpec, value) {
      let unit = 's';
      let alternative = '';
      if (formatSpec) {
        const parts = formatSpec.replace(/(:|;|\s)/gi, '').split(/\,/);
        unit =
          parts.length === 1 ? parts[0] : ((alternative = parts[0]), parts[1]);
      }
      return Math.abs(value) > 1 ? unit : alternative;
    }

    start() {
      if (this.interval !== null) clearInterval(this.interval);
      this.update();
      this.interval = setInterval(() => this.update(), this.options.precision);
    }

    stop() {
      clearInterval(this.interval);
      this.interval = null;
      this.dispatchEvent('stoped');
    }

    toggle() {
      this.interval ? this.stop() : this.start();
    }

    pause() {
      this.stop();
    }

    resume() {
      this.start();
    }

    remove() {
      this.stop();
      this.countdownInstances[this.instanceNumber] = null;
      delete this.$el.data().countdownInstance;
    }

    setFinalDate(dateInput) {
      this.finalDate = this.parseDate(dateInput);
    }
    parseDate(dateInput) {
      if (dateInput instanceof Date) return dateInput;

      if (String(dateInput).match(this.dateRegex)) {
        if (/^[0-9]*$/.test(dateInput)) {
          dateInput = Number(dateInput);
        }
        if (String(dateInput).includes('-')) {
          dateInput = String(dateInput).replace(/-/g, '/');
        }
        return new Date(dateInput);
      }

      throw new Error(`Couldn't cast "${dateInput}" to a date object.`);
    }
    update() {
      if (this.$el.closest('html').length === 0) {
        this.remove();
        return;
      }

      const eventExists = typeof $._data(this.el, 'events') !== 'undefined';
      const currentTime = new Date();
      let timeDifference = this.finalDate.getTime() - currentTime.getTime();
      timeDifference = Math.ceil(timeDifference / 1000);
      timeDifference =
        !this.options.elapse && timeDifference < 0
          ? 0
          : Math.abs(timeDifference);

      if (this.totalSecsLeft !== timeDifference && eventExists) {
        this.totalSecsLeft = timeDifference;
        this.elapsed = currentTime >= this.finalDate;
        this.offset = {
          seconds: this.totalSecsLeft % 60,
          minutes: Math.floor(this.totalSecsLeft / 60) % 60,
          hours: Math.floor(this.totalSecsLeft / 3600) % 24,
          days: Math.floor(this.totalSecsLeft / 86400) % 7,
          daysToWeek: Math.floor(this.totalSecsLeft / 86400) % 7,
          daysToMonth: Math.floor((this.totalSecsLeft / 86400) % 30.4368),
          weeks: Math.floor(this.totalSecsLeft / 604800),
          weeksToMonth: Math.floor(this.totalSecsLeft / 604800) % 4,
          months: Math.floor(this.totalSecsLeft / 2629743),
          years: Math.abs(
            this.finalDate.getFullYear() - currentTime.getFullYear()
          ),
          totalDays: Math.floor(this.totalSecsLeft / 86400),
          totalHours: Math.floor(this.totalSecsLeft / 3600),
          totalMinutes: Math.floor(this.totalSecsLeft / 60),
          totalSeconds: this.totalSecsLeft,
        };

        if (this.options.elapse || this.totalSecsLeft !== 0) {
          this.dispatchEvent('update');
        } else {
          this.stop();
          this.dispatchEvent('finish');
        }
      }
    }
    dispatchEvent(eventName) {
      const event = $.Event(eventName + '.countdown');
      event.finalDate = this.finalDate;
      event.elapsed = this.elapsed;
      event.offset = $.extend({}, this.offset);
      event.strftime = this.createFormatter(this.offset);
      this.$el.trigger(event);
    }
  }

  $.fn.countdown = function () {
    const args = Array.prototype.slice.call(arguments, 0);
    return this.each(function () {
      const instanceIndex = $(this).data('countdown-instance');
      if (instanceIndex !== undefined) {
        const instance = this.countdownInstances[instanceIndex];
        const method = args[0];
        if (Countdown.prototype.hasOwnProperty(method)) {
          instance[method].apply(instance, args.slice(1));
        } else if (String(method).match(/^[$A-Z_][0-9A-Z_$]*$/i) === null) {
          instance.setFinalDate.call(instance, method);
          instance.start();
        } else {
          $.error(`Method ${method} does not exist on jQuery.countdown`);
        }
      } else {
        new Countdown(this, args[0], args[1]);
      }
    });
  };
});

//day.min.js
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t = 'undefined' != typeof globalThis ? globalThis : t || self).dayjs =
        e());
})(window, function () {
  'use strict';
  var t = 1e3,
    e = 6e4,
    n = 36e5,
    r = 'millisecond',
    i = 'second',
    s = 'minute',
    u = 'hour',
    a = 'day',
    o = 'week',
    c = 'month',
    f = 'quarter',
    h = 'year',
    d = 'date',
    l = 'Invalid Date',
    $ =
      /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
    y =
      /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
    M = {
      name: 'en',
      weekdays:
        'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      months:
        'January_February_March_April_May_June_July_August_September_October_November_December'.split(
          '_'
        ),
      ordinal: function (t) {
        var e = ['th', 'st', 'nd', 'rd'],
          n = t % 100;
        return '[' + t + (e[(n - 20) % 10] || e[n] || e[0]) + ']';
      },
    },
    m = function (t, e, n) {
      var r = String(t);
      return !r || r.length >= e ? t : '' + Array(e + 1 - r.length).join(n) + t;
    },
    v = {
      s: m,
      z: function (t) {
        var e = -t.utcOffset(),
          n = Math.abs(e),
          r = Math.floor(n / 60),
          i = n % 60;
        return (e <= 0 ? '+' : '-') + m(r, 2, '0') + ':' + m(i, 2, '0');
      },
      m: function t(e, n) {
        if (e.date() < n.date()) return -t(n, e);
        var r = 12 * (n.year() - e.year()) + (n.month() - e.month()),
          i = e.clone().add(r, c),
          s = n - i < 0,
          u = e.clone().add(r + (s ? -1 : 1), c);
        return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
      },
      a: function (t) {
        return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
      },
      p: function (t) {
        return (
          { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t] ||
          String(t || '')
            .toLowerCase()
            .replace(/s$/, '')
        );
      },
      u: function (t) {
        return void 0 === t;
      },
    },
    g = 'en',
    D = {};
  D[g] = M;
  var p = '$isDayjsObject',
    S = function (t) {
      return t instanceof _ || !(!t || !t[p]);
    },
    w = function t(e, n, r) {
      var i;
      if (!e) return g;
      if ('string' == typeof e) {
        var s = e.toLowerCase();
        D[s] && (i = s), n && ((D[s] = n), (i = s));
        var u = e.split('-');
        if (!i && u.length > 1) return t(u[0]);
      } else {
        var a = e.name;
        (D[a] = e), (i = a);
      }
      return !r && i && (g = i), i || (!r && g);
    },
    O = function (t, e) {
      if (S(t)) return t.clone();
      var n = 'object' == typeof e ? e : {};
      return (n.date = t), (n.args = arguments), new _(n);
    },
    b = v;
  (b.l = w),
    (b.i = S),
    (b.w = function (t, e) {
      return O(t, { locale: e.$L, utc: e.$u, x: e.$x, $offset: e.$offset });
    });
  var _ = (function () {
      function M(t) {
        (this.$L = w(t.locale, null, !0)),
          this.parse(t),
          (this.$x = this.$x || t.x || {}),
          (this[p] = !0);
      }
      var m = M.prototype;
      return (
        (m.parse = function (t) {
          (this.$d = (function (t) {
            var e = t.date,
              n = t.utc;
            if (null === e) return new Date(NaN);
            if (b.u(e)) return new Date();
            if (e instanceof Date) return new Date(e);
            if ('string' == typeof e && !/Z$/i.test(e)) {
              var r = e.match($);
              if (r) {
                var i = r[2] - 1 || 0,
                  s = (r[7] || '0').substring(0, 3);
                return n
                  ? new Date(
                      Date.UTC(
                        r[1],
                        i,
                        r[3] || 1,
                        r[4] || 0,
                        r[5] || 0,
                        r[6] || 0,
                        s
                      )
                    )
                  : new Date(
                      r[1],
                      i,
                      r[3] || 1,
                      r[4] || 0,
                      r[5] || 0,
                      r[6] || 0,
                      s
                    );
              }
            }
            return new Date(e);
          })(t)),
            this.init();
        }),
        (m.init = function () {
          var t = this.$d;
          (this.$y = t.getFullYear()),
            (this.$M = t.getMonth()),
            (this.$D = t.getDate()),
            (this.$W = t.getDay()),
            (this.$H = t.getHours()),
            (this.$m = t.getMinutes()),
            (this.$s = t.getSeconds()),
            (this.$ms = t.getMilliseconds());
        }),
        (m.$utils = function () {
          return b;
        }),
        (m.isValid = function () {
          return !(this.$d.toString() === l);
        }),
        (m.isSame = function (t, e) {
          var n = O(t);
          return this.startOf(e) <= n && n <= this.endOf(e);
        }),
        (m.isAfter = function (t, e) {
          return O(t) < this.startOf(e);
        }),
        (m.isBefore = function (t, e) {
          return this.endOf(e) < O(t);
        }),
        (m.$g = function (t, e, n) {
          return b.u(t) ? this[e] : this.set(n, t);
        }),
        (m.unix = function () {
          return Math.floor(this.valueOf() / 1e3);
        }),
        (m.valueOf = function () {
          return this.$d.getTime();
        }),
        (m.startOf = function (t, e) {
          var n = this,
            r = !!b.u(e) || e,
            f = b.p(t),
            l = function (t, e) {
              var i = b.w(
                n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t),
                n
              );
              return r ? i : i.endOf(a);
            },
            $ = function (t, e) {
              return b.w(
                n
                  .toDate()
                  [t].apply(
                    n.toDate('s'),
                    (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)
                  ),
                n
              );
            },
            y = this.$W,
            M = this.$M,
            m = this.$D,
            v = 'set' + (this.$u ? 'UTC' : '');
          switch (f) {
            case h:
              return r ? l(1, 0) : l(31, 11);
            case c:
              return r ? l(1, M) : l(0, M + 1);
            case o:
              var g = this.$locale().weekStart || 0,
                D = (y < g ? y + 7 : y) - g;
              return l(r ? m - D : m + (6 - D), M);
            case a:
            case d:
              return window.jQuery(v + 'Hours', 0);
            case u:
              return window.jQuery(v + 'Minutes', 1);
            case s:
              return window.jQuery(v + 'Seconds', 2);
            case i:
              return window.jQuery(v + 'Milliseconds', 3);
            default:
              return this.clone();
          }
        }),
        (m.endOf = function (t) {
          return this.startOf(t, !1);
        }),
        (m.$set = function (t, e) {
          var n,
            o = b.p(t),
            f = 'set' + (this.$u ? 'UTC' : ''),
            l = ((n = {}),
            (n[a] = f + 'Date'),
            (n[d] = f + 'Date'),
            (n[c] = f + 'Month'),
            (n[h] = f + 'FullYear'),
            (n[u] = f + 'Hours'),
            (n[s] = f + 'Minutes'),
            (n[i] = f + 'Seconds'),
            (n[r] = f + 'Milliseconds'),
            n)[o],
            $ = o === a ? this.$D + (e - this.$W) : e;
          if (o === c || o === h) {
            var y = this.clone().set(d, 1);
            y.$d[l]($),
              y.init(),
              (this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d);
          } else l && this.$d[l]($);
          return this.init(), this;
        }),
        (m.set = function (t, e) {
          return this.clone().$set(t, e);
        }),
        (m.get = function (t) {
          return this[b.p(t)]();
        }),
        (m.add = function (r, f) {
          var d,
            l = this;
          r = Number(r);
          var $ = b.p(f),
            y = function (t) {
              var e = O(l);
              return b.w(e.date(e.date() + Math.round(t * r)), l);
            };
          if ($ === c) return this.set(c, this.$M + r);
          if ($ === h) return this.set(h, this.$y + r);
          if ($ === a) return y(1);
          if ($ === o) return y(7);
          var M = ((d = {}), (d[s] = e), (d[u] = n), (d[i] = t), d)[$] || 1,
            m = this.$d.getTime() + r * M;
          return b.w(m, this);
        }),
        (m.subtract = function (t, e) {
          return this.add(-1 * t, e);
        }),
        (m.format = function (t) {
          var e = this,
            n = this.$locale();
          if (!this.isValid()) return n.invalidDate || l;
          var r = t || 'YYYY-MM-DDTHH:mm:ssZ',
            i = b.z(this),
            s = this.$H,
            u = this.$m,
            a = this.$M,
            o = n.weekdays,
            c = n.months,
            f = n.meridiem,
            h = function (t, n, i, s) {
              return (t && (t[n] || t(e, r))) || i[n].slice(0, s);
            },
            d = function (t) {
              return b.s(s % 12 || 12, t, '0');
            },
            $ =
              f ||
              function (t, e, n) {
                var r = t < 12 ? 'AM' : 'PM';
                return n ? r.toLowerCase() : r;
              };
          return r.replace(y, function (t, r) {
            return (
              r ||
              (function (t) {
                switch (t) {
                  case 'YY':
                    return String(e.$y).slice(-2);
                  case 'YYYY':
                    return b.s(e.$y, 4, '0');
                  case 'M':
                    return a + 1;
                  case 'MM':
                    return b.s(a + 1, 2, '0');
                  case 'MMM':
                    return h(n.monthsShort, a, c, 3);
                  case 'MMMM':
                    return h(c, a);
                  case 'D':
                    return e.$D;
                  case 'DD':
                    return b.s(e.$D, 2, '0');
                  case 'd':
                    return String(e.$W);
                  case 'dd':
                    return h(n.weekdaysMin, e.$W, o, 2);
                  case 'ddd':
                    return h(n.weekdaysShort, e.$W, o, 3);
                  case 'dddd':
                    return o[e.$W];
                  case 'H':
                    return String(s);
                  case 'HH':
                    return b.s(s, 2, '0');
                  case 'h':
                    return d(1);
                  case 'hh':
                    return d(2);
                  case 'a':
                    return window.jQuery(s, u, !0);
                  case 'A':
                    return window.jQuery(s, u, !1);
                  case 'm':
                    return String(u);
                  case 'mm':
                    return b.s(u, 2, '0');
                  case 's':
                    return String(e.$s);
                  case 'ss':
                    return b.s(e.$s, 2, '0');
                  case 'SSS':
                    return b.s(e.$ms, 3, '0');
                  case 'Z':
                    return i;
                }
                return null;
              })(t) ||
              i.replace(':', '')
            );
          });
        }),
        (m.utcOffset = function () {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }),
        (m.diff = function (r, d, l) {
          var $,
            y = this,
            M = b.p(d),
            m = O(r),
            v = (m.utcOffset() - this.utcOffset()) * e,
            g = this - m,
            D = function () {
              return b.m(y, m);
            };
          switch (M) {
            case h:
              $ = D() / 12;
              break;
            case c:
              $ = D();
              break;
            case f:
              $ = D() / 3;
              break;
            case o:
              $ = (g - v) / 6048e5;
              break;
            case a:
              $ = (g - v) / 864e5;
              break;
            case u:
              $ = g / n;
              break;
            case s:
              $ = g / e;
              break;
            case i:
              $ = g / t;
              break;
            default:
              $ = g;
          }
          return l ? $ : b.a($);
        }),
        (m.daysInMonth = function () {
          return this.endOf(c).$D;
        }),
        (m.$locale = function () {
          return D[this.$L];
        }),
        (m.locale = function (t, e) {
          if (!t) return this.$L;
          var n = this.clone(),
            r = w(t, e, !0);
          return r && (n.$L = r), n;
        }),
        (m.clone = function () {
          return b.w(this.$d, this);
        }),
        (m.toDate = function () {
          return new Date(this.valueOf());
        }),
        (m.toJSON = function () {
          return this.isValid() ? this.toISOString() : null;
        }),
        (m.toISOString = function () {
          return this.$d.toISOString();
        }),
        (m.toString = function () {
          return this.$d.toUTCString();
        }),
        M
      );
    })(),
    k = _.prototype;
  return (
    (O.prototype = k),
    [
      ['$ms', r],
      ['$s', i],
      ['$m', s],
      ['$H', u],
      ['$W', a],
      ['$M', c],
      ['$y', h],
      ['$D', d],
    ].forEach(function (t) {
      k[t[1]] = function (e) {
        return this.$g(e, t[0], t[1]);
      };
    }),
    (O.extend = function (t, e) {
      return t.$i || (t(e, _, O), (t.$i = !0)), O;
    }),
    (O.locale = w),
    (O.isDayjs = S),
    (O.unix = function (t) {
      return O(1e3 * t);
    }),
    (O.en = D[g]),
    (O.Ls = D),
    (O.p = {}),
    O
  );
});

//dayjs_plugin_utc
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t =
        'undefined' != typeof globalThis
          ? globalThis
          : t || self).dayjs_plugin_utc = e());
})(window, function () {
  'use strict';
  var t = 'minute',
    e = /[+-]\d\d(?::?\d\d)?/g,
    i = /([+-]|\d\d)/g;
  return function (a, n, o) {
    var s = n.prototype;
    (o.utc = function (t) {
      return new n({
        date: t,
        utc: !0,
        args: arguments,
      });
    }),
      (s.utc = function (e) {
        var i = o(this.toDate(), {
          locale: this.$L,
          utc: !0,
        });
        return e ? i.add(this.utcOffset(), t) : i;
      }),
      (s.local = function () {
        return o(this.toDate(), {
          locale: this.$L,
          utc: !1,
        });
      });
    var r = s.parse;
    s.parse = function (t) {
      t.utc && (this.$u = !0),
        this.$utils().u(t.$offset) || (this.$offset = t.$offset),
        r.call(this, t);
    };
    var d = s.init;
    s.init = function () {
      if (this.$u) {
        var t = this.$d;
        (this.$y = t.getUTCFullYear()),
          (this.$M = t.getUTCMonth()),
          (this.$D = t.getUTCDate()),
          (this.$W = t.getUTCDay()),
          (this.$H = t.getUTCHours()),
          (this.$m = t.getUTCMinutes()),
          (this.$s = t.getUTCSeconds()),
          (this.$ms = t.getUTCMilliseconds());
      } else d.call(this);
    };
    var l = s.utcOffset;
    s.utcOffset = function (a, n) {
      var o = this.$utils().u;
      if (o(a))
        return this.$u ? 0 : o(this.$offset) ? l.call(this) : this.$offset;
      if (
        'string' == typeof a &&
        null ===
          (a = (function (t) {
            void 0 === t && (t = '');
            var a = t.match(e);
            if (!a) return null;
            var n = ('' + a[0]).match(i) || ['-', 0, 0],
              o = 60 * +n[1] + +n[2];
            return 0 === o ? 0 : '+' === n[0] ? o : -o;
          })(a))
      )
        return this;
      var s = Math.abs(a) <= 16 ? 60 * a : a,
        r = this;
      if (n) return (r.$offset = s), (r.$u = 0 === a), r;
      if (0 !== a) {
        var d = this.$u
          ? this.toDate().getTimezoneOffset()
          : -1 * this.utcOffset();
        ((r = this.local().add(s + d, t)).$offset = s), (r.$x.$localOffset = d);
      } else r = this.utc();
      return r;
    };
    var c = s.format;
    (s.format = function (t) {
      var e = t || (this.$u ? 'YYYY-MM-DDTHH:mm:ss[Z]' : '');
      return c.call(this, e);
    }),
      (s.valueOf = function () {
        var t = this.$utils().u(this.$offset)
          ? 0
          : this.$offset +
            (this.$x.$localOffset || new Date().getTimezoneOffset());
        return this.$d.valueOf() - 6e4 * t;
      }),
      (s.isUTC = function () {
        return !!this.$u;
      }),
      (s.toISOString = function () {
        return this.toDate().toISOString();
      }),
      (s.toString = function () {
        return this.toDate().toUTCString();
      });
    var u = s.toDate;
    s.toDate = function (t) {
      return 's' === t && this.$offset
        ? o(this.format('YYYY-MM-DD HH:mm:ss:SSS')).toDate()
        : u.call(this);
    };
    var f = s.diff;
    s.diff = function (t, e, i) {
      if (t && this.$u === t.$u) return f.call(this, t, e, i);
      var a = this.local(),
        n = o(t).local();
      return f.call(a, n, e, i);
    };
  };
});

//dayjs_plugin_timezone
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t =
        'undefined' != typeof globalThis
          ? globalThis
          : t || self).dayjs_plugin_timezone = e());
})(window, function () {
  'use strict';
  var t = {
      year: 0,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
    },
    e = {};
  return function (i, a, n) {
    var o,
      s = function (t, i, a) {
        void 0 === a && (a = {});
        var n = new Date(t);
        return (function (t, i) {
          void 0 === i && (i = {});
          var a = i.timeZoneName || 'short',
            n = t + '|' + a,
            o = e[n];
          return (
            o ||
              ((o = new Intl.DateTimeFormat('en-US', {
                hour12: !1,
                timeZone: t,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: a,
              })),
              (e[n] = o)),
            o
          );
        })(i, a).formatToParts(n);
      },
      r = function (e, i) {
        for (var a = s(e, i), o = [], r = 0; r < a.length; r += 1) {
          var d = a[r],
            l = d.type,
            c = d.value,
            u = t[l];
          u >= 0 && (o[u] = parseInt(c, 10));
        }
        var f = o[3],
          p = 24 === f ? 0 : f,
          h =
            o[0] +
            '-' +
            o[1] +
            '-' +
            o[2] +
            ' ' +
            p +
            ':' +
            o[4] +
            ':' +
            o[5] +
            ':000',
          m = +e;
        return (n.utc(h).valueOf() - (m -= m % 1e3)) / 6e4;
      },
      d = a.prototype;
    (d.tz = function (t, e) {
      void 0 === t && (t = o);
      var i = this.utcOffset(),
        a = this.toDate(),
        s = a.toLocaleString('en-US', {
          timeZone: t,
        }),
        r = Math.round((a - new Date(s)) / 1e3 / 60),
        d = n(s)
          .$set('millisecond', this.$ms)
          .utcOffset(15 * -Math.round(a.getTimezoneOffset() / 15) - r, !0);
      if (e) {
        var l = d.utcOffset();
        d = d.add(i - l, 'minute');
      }
      return (d.$x.$timezone = t), d;
    }),
      (d.offsetName = function (t) {
        var e = this.$x.$timezone || n.tz.guess(),
          i = s(this.valueOf(), e, {
            timeZoneName: t,
          }).find(function (t) {
            return 'timezonename' === t.type.toLowerCase();
          });
        return i && i.value;
      });
    var l = d.startOf;
    (d.startOf = function (t, e) {
      if (!this.$x || !this.$x.$timezone) return l.call(this, t, e);
      var i = n(this.format('YYYY-MM-DD HH:mm:ss:SSS'));
      return l.call(i, t, e).tz(this.$x.$timezone, !0);
    }),
      (n.tz = function (t, e, i) {
        var a = i && e,
          s = i || e || o,
          d = r(+n(), s);
        if ('string' != typeof t) return n(t).tz(s);
        var l = (function (t, e, i) {
            var a = t - 60 * e * 1e3,
              n = r(a, i);
            if (e === n) return [a, e];
            var o = r((a -= 60 * (n - e) * 1e3), i);
            return n === o
              ? [a, n]
              : [t - 60 * Math.min(n, o) * 1e3, Math.max(n, o)];
          })(n.utc(t, a).valueOf(), d, s),
          c = l[0],
          u = l[1],
          f = n(c).utcOffset(u);
        return (f.$x.$timezone = s), f;
      }),
      (n.tz.guess = function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      }),
      (n.tz.setDefault = function (t) {
        o = t;
      });
  };
});

// Universal Module Definition (UMD) to support various module formats
dayjs.locale('en');
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

((define) => {
  if (typeof define === 'function' && define.amd) {
    define(['jQuery_T4NT'], define);
  } else {
    define(typeof exports === 'object'
      ? require('jQuery_T4NT')
      : window.jQuery);
  }
})((jQuery) => {
  let magnificPopup = null;

  // Initialize MagnificPopup if not already initialized
  const initMagnificPopup = () => {
    if (!jQuery.magnificPopupT4s.instance) {
      magnificPopup = new MagnificPopup();
      magnificPopup.init();
      jQuery.magnificPopupT4s.instance = magnificPopup;
    }
  };

  class MagnificPopup {
    eventHandlers = {};
    popupsCache = {};
    isOpen = false;
    isLowIE = false;
    isIE8 = false;
    isAndroid = false;
    isIOS = false;
    supportsTransition = false;
    probablyMobile = false;
    items = [];
    index = 0;
    types = [];
    currTemplate = {};
    currItem = null;
    bgOverlay = null;
    wrap = null;
    container = null;
    contentContainer = null;
    preloader = null;
    fixedContentPos = false;
    fixedBgPos = false;
    st = {};
    ev = null;
    _lastFocusedEl = null;
    wH = 0;
    statusClass = '';
    type = '';

    constructor() {}

    init() {
      const userAgent = navigator.userAgent;
      this.isLowIE = this.isIE8 = document.all && !document.addEventListener;
      this.isAndroid = /android/i.test(userAgent);
      this.isIOS = /iphone|ipad|ipod/i.test(userAgent);
      this.supportsTransition = this.checkTransitionSupport();
      this.probablyMobile =
        this.isAndroid || this.isIOS || this._isProbablyMobile();
      this.ev = $document;
      this.popupsCache = {};
    }

    _isProbablyMobile() {
      return /(Opera Mini|Kindle|webOS|BlackBerry|Opera Mobi|Windows Phone|IEMobile)/i.test(
        navigator.userAgent
      );
    }

    checkTransitionSupport() {
      const style = document.createElement('p').style;
      const prefixes = ['ms', 'O', 'Moz', 'Webkit'];
      if (style.transition !== undefined) return true;
      for (const prefix of prefixes) {
        if (prefix + 'Transition' in style) return true;
      }
      return false;
    }

    // Function to handle close button creation or retrieval
    createCloseButton(type) {
      if (type === currentType && this.currTemplate.closeBtn) {
        // Return the existing close button if the type matches and it already exists
        return this.currTemplate.closeBtn;
      }

      // Otherwise, create a new close button using the markup and store it
      this.currTemplate.closeBtn = $(
        this.st.closeMarkup.replace('%title%', this.st.tClose)
      );

      // Update the current type
      currentType = type;

      // Return the newly created close button
      return this.currTemplate.closeBtn;
    }

    open(options) {
      if (!options.isObj) {
        this.items = options.items.toArray();
        this.index = 0;
        const itemsLen = options.items.length;
        for (let i = 0; i < itemsLen; i++) {
          let item = options.items[i];
          item = item.parsed ? item.el[0] : item;
          if (item === options.el[0]) {
            this.index = i;
            break;
          }
        }
      } else {
        this.items = Array.isArray(options.items)
          ? options.items
          : [options.items];
        this.index = options.index || 0;
      }

      if (!this.isOpen) {
        this.types = [];
        this.classes = '';
        this.ev =
          options.mainEl && options.mainEl.length
            ? options.mainEl.eq(0)
            : $document;
        if(!this.popupsCache[options.key]) {
          this.popupsCache[options.key] = {};
        }
        this.currTemplate = options.key
          ? this.popupsCache[options.key]
          : {};
        this.st = jQuery.extend(
          true,
          {},
          jQuery.magnificPopupT4s.defaults,
          options
        );
        this.fixedContentPos =
          this.st.fixedContentPos === 'auto'
            ? !this.probablyMobile
            : this.st.fixedContentPos;

        if (this.st.modal) {
          this.st.closeOnContentClick = false;
          this.st.closeOnBgClick = false;
          this.st.showCloseBtn = false;
          this.st.enableEscapeKey = false;
        }

        if (!this.bgOverlay) {
          this.bgOverlay = createPlaceholder('bg').on('click.mfp', () =>
            this.close()
          );
          this.wrap = createPlaceholder('wrap')
            .attr('tabindex', -1)
            .on('click.mfp', (event) => {
              if (this._checkIfClose(event.target)) this.close();
            });
          this.container = createPlaceholder('container', this.wrap);
        }

        this.contentContainer = createPlaceholder('content');
        if (this.st.preloader) {
          this.preloader = createPlaceholder(
            'preloader',
            this.container,
            this.st.tLoading
          );
        }

        const modules = jQuery.magnificPopupT4s.modules;
        for (let module of modules) {
          const capitalizedModule =
            module.charAt(0).toUpperCase() + module.slice(1);
          this[`init${capitalizedModule}`].call(this);
        }

        createPlaceholder('BeforeOpen');
        if (this.st.showCloseBtn) {
          if (this.st.closeBtnInside) {
            registerEvent('MarkupParse', (event, element, item, type) => {
              item.close_replaceWith = this.createCloseButton(type);
            });
            this.classes += ' mfp-close-btn-in';
          } else {
            this.wrap.append(this.createCloseButton());
          }
        }

        this._applyClasses();
        this._prepareForOpen();
        return option;
      }

      this.updateItemHTML();
    }

    registerEvent(eventType, callback) {
      this.ev.on('mfp' + eventType + '.mfp', callback);
    }

    close() {
      if (!this.isOpen) return;
      this._triggerEvent('BeforeClose');
      this.isOpen = false;

      if (this.st.removalDelay && !this.isLowIE && this.supportsTransition) {
        this._addClassToMFP('mfp-removing');
        setTimeout(() => this._close(), this.st.removalDelay);
      } else {
        this._close();
      }
    }

    _close() {
      this._triggerEvent('Close');
      const classes = 'mfp-removing mfp-ready ';

      this.bgOverlay.detach();
      this.wrap.detach();
      this.container.empty();
      if (this.st.mainClass) {
        classes += e.st.mainClass + ' ';
      }
      this._removeClassFromMFP(classes);
      this._restoreBodyStyles();
      this._unbindEvents();

      this.currItem = null;
      this.content = null;
      this.currTemplate = null;
      this.prevHeight = 0;

      this._triggerEvent('AfterClose');
    }

    _restoreBodyStyles() {
      if (this.fixedContentPos) {
        const n = {
          marginRight: '',
        };
        this.isIE7 ? $('body, html').css('overflow', '') : (n.overflow = ''),
          $('html').css(n);
      }
    }

    _unbindEvents() {
      $document.off('keyup.mfp focusin.mfp');
      this.ev.off('.mfp');
      this.wrap.attr('class', 'mfp-wrap').removeAttr('style');
      this.bgOverlay.attr('class', 'mfp-bg');
      this.container.attr('class', 'mfp-container');
      if (
        !this.st.showCloseBtn ||
        (this.st.closeBtnInside &&
          !0 !== this.currTemplate[this.currItem.type]) ||
        this.currTemplate.closeBtn
      )
        this.currTemplate.closeBtn.detach();
      this.st.autoFocusLast &&
        this._lastFocusedEl &&
        jQuery(this._lastFocusedEl).focus();
    }

    updateSize(height) {
      if (this.isIOS) {
        const scaleFactor =
          document.documentElement.clientWidth / window.innerWidth;
        this.wH = window.innerHeight * scaleFactor;
        this.wrap.css('height', this.wH);
      } else {
        this.wH = height || $window.height();
      }

      if (!this.fixedContentPos) {
        this.wrap.css('height', this.wH);
      }

      this._triggerEvent('Resize');
    }

    updateItemHTML() {
      const item = this.items[this.index];
      this.contentContainer.detach();
      this.content && this.content.detach();

      if (!item.parsed) {
        this.parseEl(this.index);
      }

      const itemType = item.type;
      if (!this.currTemplate[itemType]) {
        const markup = this.st[itemType] && this.st[itemType].markup;
        this.currTemplate[itemType] = markup ? jQuery(markup) : null;
      }
      this.type &&
        this.type !== itemType &&
        this.container.removeClass('mfp-' + this.type + '-holder');
      const newContent = this[
        `get${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`
      ](item, this.currTemplate[itemType]);
      this.appendContent(newContent, itemType);
      item.preloaded = true;
      this._triggerEvent('Change', item);
      this.type = item.type;
      this.container.prepend(this.contentContainer);
      this._triggerEvent('AfterChange');
    }

    appendContent(content, type) {
      if (content === '' && type === 'ajax') return false;
      this.content = content;
      if (this.content) {
        if (
          this.st.showCloseBtn &&
          this.st.closeBtnInside &&
          this.currTemplate[type]
        ) {
          if (!this.content.find('.mfp-close').length) {
            this.content.append(this._createCloseButton());
          }
        } else {
          this.content = content;
        }
      } else {
        this.content = '';
      }

      this._triggerEvent('BeforeAppend');
      this.container.addClass(`mfp-${type}-holder`);
      this.contentContainer.append(this.content);
    }

    eventTrigger(event, data) {
      this.ev.triggerHandler(`mfp${event}`, data);

      if (this.st.callbacks) {
        const callbackKey = event.charAt(0).toLowerCase() + event.slice(1);
        if (this.st.callbacks[callbackKey]) {
          this.st.callbacks[callbackKey].apply(
            this,
            Array.isArray(data) ? data : [data]
          );
        }
      }
    }

    _applyClasses() {
      if (this.st.alignTop) this.classes += ' mfp-align-top';
      if (this.fixedContentPos) {
        this.wrap.css({
          overflow: this.st.overflowY,
          overflowX: 'hidden',
          overflowY: this.st.overflowY,
        });
      } else {
        this.wrap.css({
          top: this.dom.scrollTop(),
          position: 'absolute',
        });
      }

      if (
        this.st.fixedBgPos === false ||
        ('auto' === this.st.fixedBgPos && !this.fixedContentPos)
      ) {
        // this._hasScrollBar($(window).height())) {
        this.bgOverlay.css({
          height: this.dom.height(),
          position: 'absolute',
        });
      }
      if (this.st.enableEscapeKey) {
        $document.on('keyup.mfp', (e) => {
          if (e.keyCode === 27) this.close();
        });
      }
      $window.on('resize.mfp', () => {
        this.updateSize();
      });

      if (this.st.closeOnContentClick) {
        this.classes += ' mfp-auto-cursor';
      }

      if (this.classes) {
        this.wrap.addClass(this.classes);
      }
    }

    _prepareForOpen() {
      // Store the window height in variable 'windowHeight'
      this.wH = $window.height();
      const styleUpdates = {}; // Empty object for storing CSS styles

      // Check if there's a scrollbar and if so, handle margin adjustment
      if (this.fixedContentPos && this._hasScrollBar(this.wH)) {
        const scrollbarSize = this._getScrollbarSize();
        if (scrollbarSize) {
          styleUpdates.marginRight = scrollbarSize; // Add scrollbar size to marginRight
        }
      }

      // Handle overflow based on content position and IE7-specific handling
      if (this.fixedContentPos) {
        if (this.isIE8) {
          // For IE7, apply overflow hidden to both body and html elements
          $('body, html').css('overflow', 'hidden');
        } else {
          // Otherwise, just set overflow to hidden
          styleUpdates.overflow = 'hidden';
        }
      }

      // Handle the main class for the popup
      const mainPopupClass = this.st.mainClass;
      if (this.isIE8) {
        mainPopupClass += ' mfp-ie7'; // Add IE7 specific class
      }

      if (mainPopupClass) {
        this._addClassToMFP(mainPopupClass); // Add class to the popup element
      }

      this.updateItemHTML(); // Update popup content
      this.eventTrigger('BuildControls'); // Trigger 'BuildControls' event

      // Apply CSS updates to the 'html' element
      $html.css(styleUpdates);

      // Prepend background overlay and wrapper to the body or a custom container
      this.bgOverlay.add(this.wrap).prependTo(this.st.prependTo || $body);

      // Store the currently focused element
      this._lastFocusedEl = document.activeElement;

      // Initialize popup, set focus, and handle the 'ready' state
      setTimeout(function () {
        if (this.content) {
          this._addClassToMFP('mfp-ready'); // Mark popup as ready
          this._setFocus(); // Set focus on popup content
        } else {
          this.bgOverlay.addClass('mfp-ready'); // Mark background as ready
        }
        $document.on('focusin.mfp', this._onFocusIn); // Handle focus events inside popup
      }, 16);

      this.isOpen = true; // Set popup state to open
      this.updateSize(this.wH); // Update popup size based on window height
      triggerPopupEvent('open');
    }

    _createCloseButton() {
      return jQuery('<button type="button" class="mfp-close">×</button>');
    }

    _addClassToMFP(className) {
      this.bgOverlay.addClass(className);
      this.wrap.addClass(className);
    }

    _removeClassFromMFP(className) {
      this.bgOverlay.removeClass(className);
      this.wrap.removeClass(className);
    }

    _hasScrollBar(height) {
      return document.body.scrollHeight > (height || $window.height());
    }

    _getScrollbarSize() {
      if (this.scrollbarSize === undefined) {
        const div = document.createElement('div');
        div.style.cssText =
          'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(div);
        this.scrollbarSize = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
      }
      return this.scrollbarSize;
    }

    _checkIfClose(target) {
      return !$(target).closest('.mfp-content').length;
    }

    parseEl(index) {
      let elementType;
      let currentItem = this.items[index];

      if (currentItem.tagName) {
        currentItem = { el: jQuery(currentItem) };
      } else {
        elementType = currentItem.type;
        currentItem = { data: currentItem, src: currentItem.src };
      }

      if (currentItem.el) {
        const types = this.types;

        for (let i = 0; i < types.length; i++) {
          if (currentItem.el.hasClass(`mfp-${types[i]}`)) {
            elementType = types[i];
            break;
          }
        }

        currentItem.src =
          currentItem.el.attr('data-mfp-src') || currentItem.el.attr('href');
      }

      currentItem.type = elementType || this.st.type || 'inline';
      currentItem.index = index;
      currentItem.parsed = true;

      this.items[index] = currentItem;
      triggerPopupEvent('ElementParse', currentItem);

      return this.items[index];
    }

    addGroup(element, options = {}) {
      const instance = this;
      function onClick(event) {
        event.mfpEl = this;
        instance._openClick(event, element, options);
      }

      const eventNamespace = 'click.magnificPopupT4s';
      options.mainEl = element;

      if (options.items) {
        options.isObj = true;
        element.off(eventNamespace).on(eventNamespace, onClick);
      } else {
        options.isObj = false;

        if (options.delegate) {
          element
            .off(eventNamespace)
            .on(eventNamespace, options.delegate, onClick);
        } else {
          options.items = element;
          element.off(eventNamespace).on(eventNamespace, onClick);
        }
      }
    }
    _openClick(event, element, options) {
      const midClick =
        options.midClick ?? jQuery.magnificPopupT4s.defaults.midClick;

      if (
        midClick ||
        !(
          event.which === 2 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.shiftKey
        )
      ) {
        const disableOn =
          options.disableOn ?? jQuery.magnificPopupT4s.defaults.disableOn;

        if (disableOn) {
          if (jQuery.isFunction(disableOn)) {
            if (!disableOn.call(this)) return true;
          } else if ($window.width() < disableOn) {
            return true;
          }
        }

        if (event.type) {
          event.preventDefault();
          if (this.isOpen) event.stopPropagation();
        }

        options.el = jQuery(event.mfpEl);
        if (options.delegate) {
          options.items = element.find(options.delegate);
        }

        this.open(options);
      }
    }

    updateStatus(status, text) {
      if (this.preloader) {
        if (this.statusClass !== status) {
          this.container.removeClass(`mfp-s-${this.statusClass}`);
        }

        if (!text && status === 'loading') {
          text = this.st.tLoading;
        }

        const update = { status, text };
        triggerPopupEvent('UpdateStatus', update);

        this.preloader.html(update.text);
        this.preloader.find('a').on('click', (event) => {
          event.stopImmediatePropagation();
        });

        this.container.addClass(`mfp-s-${update.status}`);
        this.statusClass = update.status;
      }
    }

    _checkIfClose(element) {
      if (!jQuery(element).hasClass('mfp-prevent-close')) {
        const { closeOnContentClick, closeOnBgClick } = this.st;

        if (closeOnContentClick && closeOnBgClick) {
          return true;
        }

        if (
          !this.content ||
          jQuery(element).hasClass('mfp-close') ||
          (this.preloader && element === this.preloader[0])
        ) {
          return true;
        }

        if (
          element === this.content[0] ||
          jQuery.contains(this.content[0], element)
        ) {
          if (closeOnContentClick) {
            return true;
          }
        } else if (closeOnBgClick && jQuery.contains(document, element)) {
          return true;
        }

        return false;
      }
    }

    _addClassToMFP(className) {
      this.bgOverlay.addClass(className);
      this.wrap.addClass(className);
    }

    _removeClassFromMFP = (className) => {
      this.bgOverlay.removeClass(className);
      this.wrap.removeClass(className);
    };

    _hasScrollBar(height) {
      return (
        (this.isIE8 ? $document.height() : document.body.scrollHeight) >
        (height || $window.height())
      );
    }

    _setFocus = () => {
      const focusElement = this.st.focus
        ? this.content.find(this.st.focus).eq(0)
        : this.wrap;
      focusElement.focus();
    };

    _onFocusIn(event) {
      if (
        event.target !== this.wrap[0] &&
        !jQuery.contains(this.wrap[0], event.target)
      ) {
        this._setFocus();
        return false;
      }
    }

    _parseMarkup(element, markup, data) {
      if (data.data) {
        markup = jQuery.extend(data.data, markup);
      }

      triggerPopupEvent('MarkupParse', [element, markup, data]);

      jQuery.each(markup, (key, value) => {
        if (value === undefined || value === false) {
          return true;
        }

        const parts = key.split('_');

        if (parts.length > 1) {
          const selector = element.find(`.mfp-${parts[0]}`);

          if (selector.length > 0) {
            const action = parts[1];

            if (action === 'replaceWith') {
              if (selector[0] !== value[0]) {
                selector.replaceWith(value);
              }
            } else if (action === 'img') {
              if (selector.is('img')) {
                selector.attr('src', value);
              } else {
                selector.replaceWith(
                  jQuery('<img>')
                    .attr('src', value)
                    .attr('class', selector.attr('class'))
                );
              }
            } else {
              selector.attr(action, value);
            }
          }
        } else {
          element.find(`.mfp-${key}`).html(value);
        }
      });
    }

    _getScrollbarSize() {
      if (this.scrollbarSize === undefined) {
        const scrollbarDiv = document.createElement('div');
        scrollbarDiv.style.cssText =
          'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollbarDiv);
        this.scrollbarSize =
          scrollbarDiv.offsetWidth - scrollbarDiv.clientWidth;
        document.body.removeChild(scrollbarDiv);
      }
      return this.scrollbarSize;
    }
  }

  jQuery.magnificPopupT4s = {
    instance: null,
    proto: MagnificPopup.prototype,
    modules: [],

    open(obj = {}, index = 0) {
      initMagnificPopup();
      obj = { ...obj, isObj: true, index };
      return this.instance.open(obj);
    },

    close() {
      return jQuery.magnificPopupT4s.instance?.close();
    },

    registerModule(moduleName, module) {
      if (module.options) {
        jQuery.magnificPopupT4s.defaults[moduleName] = module.options;
      }
      Object.assign(this.proto, module.proto);
      this.modules.push(moduleName);
    },

    defaults: {
      disableOn: 0,
      key: null,
      midClick: false,
      mainClass: '',
      preloader: true,
      focus: '',
      closeOnContentClick: false,
      closeOnBgClick: true,
      closeBtnInside: true,
      showCloseBtn: true,
      enableEscapeKey: true,
      modal: false,
      alignTop: false,
      removalDelay: 0,
      prependTo: null,
      fixedContentPos: 'auto',
      fixedBgPos: 'auto',
      overflowY: 'auto',
      closeMarkup: `<button title="%title%" type="button" class="mfp-close">
                      <svg class="mfp-icon-close" role="presentation" viewBox="0 0 16 14">
                          <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                      </svg>
                   </button>`,
      tClose: 'Close (Esc)',
      tLoading: 'Loading...',
      autoFocusLast: true,
    },
  };
  jQuery.fn.magnificPopupT4s = function (options) {
    initMagnificPopup();
    const $this = jQuery(this);

    if (typeof options === 'string') {
      if (options === 'open') {
        let item;
        const instance = $this.data('magnificPopup');
        const index = parseInt(arguments[1], 10) || 0;

        if (instance.items) {
          item = instance.items[index];
        } else {
          item = $this;
          if (instance.delegate) item = item.find(instance.delegate);
          item = item.eq(index);
        }

        magnificPopup._openClick({ mfpEl: item }, $this, instance);
      } else if (
        magnificPopup.isOpen &&
        typeof magnificPopup[options] === 'function'
      ) {
        magnificPopup[options](...Array.from(arguments).slice(1));
      }
    } else {
      const settings = { ...options };
      $this.data('magnificPopup', settings);
      magnificPopup.addGroup($this, settings);
    }

    return $this;
  };

  let currentInlineElement, placeholderElement, hiddenClass;

  const cleanupInlineContent = () => {
    if (currentInlineElement) {
      placeholderElement
        .after(currentInlineElement.addClass(hiddenClass))
        .detach();
      currentInlineElement = null;
    }
  };

  const createPlaceholder = (className, wrapper, innerHTML, hasChild) => {
    const element = document.createElement('div');
    return (
      (element.className = 'mfp-' + className),
      innerHTML && (element.innerHTML = innerHTML),
      hasChild
        ? wrapper && wrapper.appendChild(element)
        : ((element = jQuery(element)), wrapper && element.appendTo(wrapper)),
      element
    );
  };

  jQuery.magnificPopupT4s.registerModule('inline', {
    options: {
      hiddenClass: 'hide',
      markup: '',
      tNotFound: 'Content not found',
    },
    proto: {
      initInline() {
        magnificPopup.types.push('inline');
        addEventListenerToPopup('Close.inline', cleanupInlineContent);
      },
      getInline(item, template) {
        cleanupInlineContent();
        if (item.src) {
          const inline = magnificPopup.st.inline;
          const inlineElement = jQuery(item.src);
          if (inlineElement.length) {
            const parentNode = inlineElement[0].parentNode;
            if (parentNode && parentNode.tagName) {
              if (!placeholderElement) {
                hiddenClass = inline.hiddenClass;
                placeholderElement = createPlaceholder(hiddenClass);
                hiddenClass = `mfp-${hiddenClass}`;
              }
              currentInlineElement = inlineElement
                .after(placeholderElement)
                .detach()
                .removeClass(hiddenClass);
            }
            magnificPopup.updateStatus('ready');
          } else {
            magnificPopup.updateStatus('error', inline.tNotFound);
            inlineElement = jQuery('<div>');
          }
          return (item.inlineElement = inlineElement), inlineElement;
        }
        magnificPopup.updateStatus('ready');
        magnificPopup._parseMarkup(template, {}, item);
        return template;
      },
    },
  });

  let currentCursorClass;

  const removeCursorClass = () => {
    if (currentCursorClass) {
      $body.removeClass(currentCursorClass);
    }
  };

  const abortRequest = () => {
    removeCursorClass();
    magnificPopup.ev.req && magnificPopup.ev.req.abort();
  };

  const addEventListenerToPopup = (event, callback) => {
    magnificPopup.ev.on(`mfp${event}.mfp`, callback);
  };

  const triggerPopupEvent = (eventName, callback) => {
    magnificPopup.ev.triggerHandler(`mfp${eventName}`, callback);
    if (magnificPopup.st.callbacks) {
      const formattedEventName =
        eventName.charAt(0).toLowerCase() + eventName.slice(1);
      if (magnificPopup.st.callbacks[formattedEventName]) {
        magnificPopup.st.callbacks[formattedEventName].apply(
          magnificPopup,
          Array.isArray(callback) ? callback : [callback]
        );
      }
    }
  };

  let ajaxCache = {};
  jQuery.magnificPopupT4s.registerModule('ajax', {
    options: {
      settings: null,
      cursor: 'mfp-ajax-cur',
      tError: '<a href="%url%">The content</a> could not be loaded.',
    },
    proto: {
      initAjax() {
        magnificPopup.ev.types.push('ajax');
        currentCursorClass = magnificPopup.ev.st.ajax.cursor;
        addEventListenerToPopup('Close.ajax', abortRequest);
        addEventListenerToPopup('BeforeChange.ajax', abortRequest);
      },
      getAjax(res) {
        if (currentCursorClass) {
          jQuery(document.body).addClass(currentCursorClass);
        }
        magnificPopup.updateStatus('loading');

        const storageId = jQuery(res.el).attr('data-storageid') || 'nt94';
        const ajaxRequestConfig = {
          url: res.src,
          success(data, status, xhr) {
            const ajaxResponse = { data, xhr };
            triggerPopupEvent('ParseAjax', ajaxResponse);
            magnificPopup.appendContent(jQuery(ajaxResponse.data), 'ajax');
            res.finished = true;
            removeCursorClass();
            magnificPopup._setFocus();
            setTimeout(() => {
              magnificPopup.wrap.addClass('mfp-ready');
            }, 16);
            magnificPopup.updateStatus('ready');
            triggerPopupEvent('AjaxContentAdded');
            ajaxCache[storageId] = data;
          },
          error() {
            removeCursorClass();
            res.finished = res.loadError = true;
            magnificPopup.updateStatus(
              'error',
              magnificPopup.st.ajax.tError.replace('%url%', res.src)
            );
          },
          ...magnificPopup.st.ajax.settings,
        };

        const cachedResponse = ajaxCache[storageId];
        if (cachedResponse !== undefined) {
          const cachedData = { data: cachedResponse };
          triggerPopupEvent('ParseAjax', cachedData);
          magnificPopup.appendContent(jQuery(cachedData.data), 'ajax');
          removeCursorClass();
          magnificPopup._setFocus();
          setTimeout(() => {
            magnificPopup.wrap.addClass('mfp-ready');
          }, 16);
          magnificPopup.updateStatus('ready');
          triggerPopupEvent('AjaxContentAdded');
        } else {
          magnificPopup.req = jQuery.ajax(ajaxRequestConfig);
        }
        return '';
      },
    },
  });

  let imageCheckInterval;

  jQuery.magnificPopupT4s.registerModule('image', {
    options: {
      markup: `
          <div class="mfp-figure">
            <div class="mfp-close"></div>
            <figure>
              <div class="mfp-img"></div>
              <figcaption>
                <div class="mfp-bottom-bar">
                  <div class="mfp-title"></div>
                  <div class="mfp-counter"></div>
                </div>
              </figcaption>
            </figure>
          </div>`,
      cursor: 'mfp-zoom-out-cur',
      titleSrc: 'title',
      verticalFit: true,
      tError: '<a href="%url%">The image</a> could not be loaded.',
    },
    proto: {
      initImage() {
        const imageSettings = magnificPopup.st.image;
        const imageEventNamespace = '.image';
        magnificPopup.types.push('image');
        addEventListenerToPopup(`Open${imageEventNamespace}`, () => {
          if (magnificPopup.currItem.type === 'image' && imageSettings.cursor) {
            $body.addClass(imageSettings.cursor);
          }
        });
        addEventListenerToPopup(`Close${imageEventNamespace}`, () => {
          if (imageSettings.cursor) {
            $body.removeClass(imageSettings.cursor);
            $window.off('resize.mfp');
          }
        });
        addEventListenerToPopup(
          `Resize${imageEventNamespace}`,
          magnificPopup.resizeImage
        );
        if (magnificPopup.isLowIE) {
          addEventListenerToPopup('AfterChange', magnificPopup.resizeImage);
        }
      },
      resizeImage() {
        const currentItem = magnificPopup.currItem;
        if (currentItem && jQuery.img && magnificPopup.st.image.verticalFit) {
          let paddingY = 0;
          if (magnificPopup.isLowIE) {
            paddingY =
              parseInt(jQuery.img.css('padding-top'), 10) +
              parseInt(jQuery.img.css('padding-bottom'), 10);
          }
          jQuery.img.css('max-height', magnificPopup.wH - paddingY);
        }
      },
      _onImageHasSize(callback) {
        if (jQuery.img) {
          jQuery.hasSize = true;
          if (imageCheckInterval) clearInterval(imageCheckInterval);
          jQuery.isCheckingImgSize = false;
          triggerPopupEvent('ImageHasSize', callback);
          if (jQuery.imgHidden) {
            magnificPopup.content &&
              magnificPopup.content.removeClass('mfp-loading');
            jQuery.imgHidden = false;
          }
        }
      },
      findImageSize(callback) {
        let attemptCount = 0;
        const imgElement = jQuery.img[0];
        const checkSize = (interval) => {
          if (imageCheckInterval) clearInterval(imageCheckInterval);
          imageCheckInterval = setInterval(() => {
            if (imgElement.naturalWidth > 0) {
              magnificPopup._onImageHasSize(callback);
            } else {
              if (attemptCount > 200) clearInterval(imageCheckInterval);
              if (++attemptCount === 3) checkSize(10);
              else if (attemptCount === 40) checkSize(50);
              else if (attemptCount === 100) checkSize(500);
            }
          }, interval);
        };
        checkSize(1);
      },
      getImage(item, template) {
        let attemptCount = 0;
        const imageSettings = magnificPopup.st.image;
        const imageContainer = template.find('.mfp-img');

        const handleLoadComplete = () => {
          if (item) {
            if (item.img[0].complete) {
              item.img.off('.mfploader');
              if (item === magnificPopup.currItem) {
                magnificPopup._onImageHasSize(item);
                magnificPopup.updateStatus('ready');
              }
              item.hasSize = true;
              item.loaded = true;
              triggerPopupEvent('ImageLoadComplete');
            } else if (++attemptCount < 200) {
              setTimeout(handleLoadComplete, 100);
            } else {
              handleLoadError();
            }
          }
        };
        const handleLoadError = () => {
          if (item) {
            item.img.off('.mfploader');
            if (item === magnificPopup.currItem) {
              magnificPopup._onImageHasSize(item);
              magnificPopup.updateStatus(
                'error',
                imageSettings.tError.replace('%url%', item.src)
              );
            }
            item.hasSize = true;
            item.loaded = true;
            item.loadError = true;
          }
        };

        if (imageContainer.length) {
          const imgElement = document.createElement('img');
          imgElement.className = 'mfp-img';
          if (item.el && item.el.find('img').length) {
            imgElement.alt = item.el.find('img').attr('alt');
          }
          item.img = window
            .jQuery(imgElement)
            .on('load.mfploader', handleLoadComplete)
            .on('error.mfploader', handleLoadError);
          imgElement.src = item.src;
          if (imageContainer.is('img')) {
            item.img = item.img.clone();
          }
          if (imgElement.naturalWidth > 0) {
            item.hasSize = true;
          } else {
            imgElement.width || (item.hasSize = false);
          }
        }
        magnificPopup._parseMarkup(
          template,
          {
            title: (currentItem) => {
              if (currentItem.data && currentItem.data.title !== undefined) {
                return currentItem.data.title;
              }
              const template = magnificPopup.st.image.titleSrc;
              if (template) {
                if (jQuery.isFunction(template)) {
                  return template.call(magnificPopup, currentItem);
                }
                if (currentItem.el) {
                  return currentItem.el.attr(template) || '';
                }
              }
              return '';
            },
            img_replaceWith: item.img,
          },
          item
        );
        magnificPopup.resizeImage();
        if (item.hasSize) {
          if (imageCheckInterval) clearInterval(imageCheckInterval);
          if (item.loadError) {
            template.addClass('mfp-loading');
            magnificPopup.updateStatus(
              'error',
              imageSettings.tError.replace('%url%', item.src)
            );
          } else {
            template.removeClass('mfp-loading');
            magnificPopup.updateStatus('ready');
          }
          return template;
        }
        magnificPopup.updateStatus('loading');
        item.loading = true;
        if (!item.hasSize) {
          item.imgHidden = true;
          template.addClass('mfp-loading');
          magnificPopup.findImageSize(item);
        }
        return template;
      },
    },
  });

  jQuery.magnificPopupT4s.registerModule('zoom', {
    options: {
      enabled: false,
      easing: 'ease-in-out',
      duration: 300,
      opener: (target) => (target.is('img') ? target : target.find('img')),
    },
    proto: {
      initZoom() {
        const { zoom } = magnificPopup.st;
        const transitionEvent = '.zoom';

        if (zoom.enabled && magnificPopup.supportsTransition) {
          const { duration, easing } = zoom;
          let zoomItem, clonedElement, timeout;

          const cloneAndStyle = (item) => {
            const clone = item
              .clone()
              .removeAttr('style')
              .removeAttr('class')
              .addClass('mfp-animated-image');

            const transitionStyle = `all ${duration / 1000}s ${easing}`;
            const cssStyles = {
              position: 'fixed',
              zIndex: 9999,
              left: 0,
              top: 0,
              '-webkit-backface-visibility': 'hidden',
              transition: transitionStyle,
              '-webkit-transition': transitionStyle,
              '-moz-transition': transitionStyle,
              '-o-transition': transitionStyle,
            };

            return clone.css(cssStyles);
          };

          const restoreVisibility = () =>
            magnificPopup.content.css('visibility', 'visible');

          addEventListenerToPopup('BuildControls' + transitionEvent, () => {
            if (!magnificPopup._allowZoom()) return restoreVisibility();

            clearTimeout(timeout);
            magnificPopup.content.css('visibility', 'hidden');

            zoomItem = magnificPopup._getItemToZoom();
            if (!zoomItem) return restoreVisibility();

            clonedElement = cloneAndStyle(zoomItem).css(
              magnificPopup._getOffset()
            );
            magnificPopup.wrap.append(clonedElement);

            timeout = setTimeout(() => {
              clonedElement.css(magnificPopup._getOffset(true));
              timeout = setTimeout(() => {
                restoreVisibility();
                setTimeout(() => {
                  clonedElement.remove();
                  zoomItem = clonedElement = null;
                  triggerPopupEvent('ZoomAnimationEnded');
                }, 16);
              }, duration);
            }, 16);
          });

          addEventListenerToPopup('BeforeClose' + transitionEvent, () => {
            if (!magnificPopup._allowZoom()) return;

            clearTimeout(timeout);
            magnificPopup.st.removalDelay = duration;

            zoomItem = zoomItem || magnificPopup._getItemToZoom();
            if (!zoomItem) return;

            clonedElement = cloneAndStyle(zoomItem);
            clonedElement.css(magnificPopup._getOffset(true));
            magnificPopup.wrap.append(clonedElement);
            magnificPopup.content.css('visibility', 'hidden');

            setTimeout(() => {
              clonedElement.css(magnificPopup._getOffset());
            }, 16);
          });

          addEventListenerToPopup('Close' + transitionEvent, () => {
            if (magnificPopup._allowZoom()) {
              restoreVisibility();
              if (clonedElement) clonedElement.remove();
              zoomItem = null;
            }
          });
        }
      },

      _allowZoom() {
        return magnificPopup.currItem.type === 'image';
      },

      _getItemToZoom() {
        return magnificPopup.currItem.hasSize
          ? magnificPopup.currItem.img
          : null;
      },

      _getOffset(applyZoom) {
        const item = applyZoom
          ? magnificPopup.currItem.img
          : magnificPopup.st.zoom.opener(
              magnificPopup.currItem.el || magnificPopup.currItem
            );
        const offset = item.offset();
        const paddingTop = parseInt(item.css('padding-top'), 10) || 0;
        const paddingBottom = parseInt(item.css('padding-bottom'), 10) || 0;

        const top = offset.top - $window.scrollTop() - paddingTop;
        const width = item.width();
        const height = item.innerHeight() - paddingTop - paddingBottom;

        const transformStyles = {
          width,
          height,
          transform: `translate(${offset.left}px, ${top}px)`,
        };

        return transformStyles;
      },
    },
  });

  const normalizeIndex = (index, length) =>
    index > length - 1 ? index - length : index < 0 ? length + index : index;

  const formatCounter = (template, current, total) =>
    template.replace(/%curr%/gi, current + 1).replace(/%total%/gi, total);

  jQuery.magnificPopupT4s.registerModule('gallery', {
    options: {
      enabled: false,
      arrowMarkup:
        '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: true,
      arrows: true,
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)',
      tCounter: '%curr% of %total%',
    },
    proto: {
      initGallery() {
        const gallery = magnificPopup.st.gallery;
        const eventNamespace = '.mfp-gallery';

        if (!gallery || !gallery.enabled) return false;

        magnificPopup.direction = true;
        magnificPopup.classes += ' mfp-gallery';

        addEventListenerToPopup(`Open${eventNamespace}`, () => {
          if (gallery.navigateByImgClick) {
            magnificPopup.wrap.on(`click${eventNamespace}`, '.mfp-img', () => {
              if (magnificPopup.items.length > 1) {
                magnificPopup.next();
                return false;
              }
            });
          }

          $document.on(`keydown${eventNamespace}`, (event) => {
            if (event.keyCode === 37) {
              magnificPopup.prev();
            } else if (event.keyCode === 39) {
              magnificPopup.next();
            }
          });
        });

        addEventListenerToPopup(
          `UpdateStatus${eventNamespace}`,
          (event, status) => {
            if (status.text) {
              status.text = formatCounter(
                status.text,
                magnificPopup.currItem.index,
                magnificPopup.items.length
              );
            }
          }
        );

        addEventListenerToPopup(
          `MarkupParse${eventNamespace}`,
          (event, template, values, item) => {
            const totalItems = magnificPopup.items.length;
            values.counter =
              totalItems > 1
                ? formatCounter(gallery.tCounter, item.index, totalItems)
                : '';
          }
        );

        addEventListenerToPopup(`BuildControls${eventNamespace}`, () => {
          if (
            magnificPopup.items.length > 1 &&
            gallery.arrows &&
            !magnificPopup.arrowLeft
          ) {
            const arrowMarkup = gallery.arrowMarkup;

            const arrowLeft = (magnificPopup.arrowLeft = jQuery(
              arrowMarkup
                .replace(/%title%/gi, gallery.tPrev)
                .replace(/%dir%/gi, 'left')
            ).addClass('mfp-prevent-close'));
            const arrowRight = (magnificPopup.arrowRight = jQuery(
              arrowMarkup
                .replace(/%title%/gi, gallery.tNext)
                .replace(/%dir%/gi, 'right')
            ).addClass('mfp-prevent-close'));

            arrowLeft.click(() => magnificPopup.prev());
            arrowRight.click(() => magnificPopup.next());

            magnificPopup.container.append(arrowLeft.add(arrowRight));
          }
        });

        addEventListenerToPopup(`Change${eventNamespace}`, () => {
          if (magnificPopup._preloadTimeout) {
            clearTimeout(magnificPopup._preloadTimeout);
          }
          magnificPopup._preloadTimeout = setTimeout(() => {
            magnificPopup.preloadNearbyImages();
            magnificPopup._preloadTimeout = null;
          }, 16);
        });

        addEventListenerToPopup(`Close${eventNamespace}`, () => {
          $document.off(eventNamespace);
          magnificPopup.wrap.off(`click${eventNamespace}`);
          magnificPopup.arrowRight = magnificPopup.arrowLeft = null;
        });
      },

      next() {
        magnificPopup.direction = true;
        magnificPopup.index = normalizeIndex(
          magnificPopup.index + 1,
          magnificPopup.items.length
        );
        magnificPopup.updateItemHTML();
      },

      prev() {
        magnificPopup.direction = false;
        magnificPopup.index = normalizeIndex(
          magnificPopup.index - 1,
          magnificPopup.items.length
        );
        magnificPopup.updateItemHTML();
      },

      goTo(index) {
        magnificPopup.direction = index >= e.index;
        magnificPopup.index = index;
        magnificPopup.updateItemHTML();
      },

      preloadNearbyImages() {
        const { preload } = magnificPopup.st.gallery;
        const preloadLeft = Math.min(preload[0], magnificPopup.items.length);
        const preloadRight = Math.min(preload[1], magnificPopup.items.length);

        for (
          let i = 1;
          i <= (magnificPopup.direction ? preloadRight : preloadLeft);
          i++
        ) {
          magnificPopup._preloadItem(magnificPopup.index + i);
        }
        for (
          let i = 1;
          i <= (magnificPopup.direction ? preloadLeft : preloadRight);
          i++
        ) {
          magnificPopup._preloadItem(magnificPopup.index - i);
        }
      },

      _preloadItem(index) {
        index = normalizeIndex(index, magnificPopup.items.length);
        if (!magnificPopup.items[index].preloaded) {
          let item = magnificPopup.items[index];
          if (!item.parsed) {
            item = magnificPopup.parseEl(index);
          }
          triggerPopupEvent('LazyLoad', item);

          if (item.type === 'image') {
            item.img = jQuery('<img class="mfp-img" />')
              .on('load.mfploader', () => {
                item.hasSize = true;
              })
              .on('error.mfploader', () => {
                item.hasSize = true;
                item.loadError = true;
                triggerPopupEvent('LazyLoadError', item);
              })
              .attr('src', item.src);
          }
          item.preloaded = true;
        }
      },
    },
  });

  jQuery.magnificPopupT4s.registerModule('retina', {
    options: {
      replaceSrc(src) {
        return src.replace(/\.\w+$/, (match) => `@2x${match}`);
      },
      ratio: 1,
    },
    proto: {
      initRetina() {
        if (window.devicePixelRatio > 1) {
          const retina = magnificPopup.st.retina;
          let ratio = retina.ratio;

          ratio = isNaN(ratio) ? ratio() : ratio;

          if (ratio > 1) {
            addEventListenerToPopup('ImageHasSize.retina', (event, item) => {
              item.img.css({
                'max-width': item.img[0].naturalWidth / ratio,
                width: '100%',
              });
            });

            addEventListenerToPopup('ElementParse.retina', (event, item) => {
              item.src = retina.replaceSrc(item, ratio);
            });
          }
        }
      },
    },
  });

  const updateIframeContent = (isVisible) => {
    if (magnificPopup.currTemplate.iframe) {
      const iframe = magnificPopup.currTemplate.iframe.find('iframe');
      if (iframe.length) {
        if (!isVisible) {
          iframe[0].src = 'about:blank';
        }
        if (magnificPopup.isIE8) {
          iframe.css('display', isVisible ? 'block' : 'none');
        }
      }
    }
  };

  // Registering Iframe Module
  jQuery.magnificPopupT4s.registerModule('iframe', {
    options: {
      markup:
        '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
      srcAction: 'iframe_src',
      patterns: {
        youtube: {
          index: 'youtube.com',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1',
        },
        vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1',
        },
        gmaps: {
          index: '//maps.google.',
          src: '%id%&output=embed',
        },
      },
    },
    proto: {
      initIframe() {
        magnificPopup.types.push('iframe');

        addEventListenerToPopup('BeforeChange', (event, prevType, newType) => {
          if (prevType !== newType) {
            prevType === 'iframe'
              ? updateIframeContent()
              : newType === 'iframe' && updateIframeContent(true);
          }
        });

        addEventListenerToPopup('Close.iframe', () => {
          updateIframeContent();
        });
      },

      getIframe(item, template) {
        let src = item.src;
        const { patterns, srcAction } = magnificPopup.st.iframe;

        jQuery.each(patterns, (key, pattern) => {
          if (src.indexOf(pattern.index) > -1) {
            src = pattern.src.replace(/%id%/g, src.split(pattern.id)[1]);
            return false;
          }
        });

        const parsedSrc = {};
        if (srcAction) parsedSrc[srcAction] = src;

        magnificPopup._parseMarkup(template, parsedSrc, item);
        magnificPopup.updateStatus('ready');

        return template;
      },
    },
  });

  initMagnificPopup();
});

// Fastdom Module
var fastdomT4s = createCommonjsModule((exports) => {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    ((callback) => setTimeout(callback, 16));

  class FastDOM {
    catch = null;
    constructor() {
      this.reads = [];
      this.writes = [];
      this.raf = requestAnimationFrame.bind(window);
    }

    scheduleTasks() {
      if (!this.scheduled) {
        this.scheduled = true;
        this.raf(() => {
          const { writes, reads } = this;
          let error;

          try {
            console.log('Flushing reads', reads, reads.length);
            this.flush(reads);
            console.log('Flushing writes', writes, writes.length);
            this.flush(writes);
          } catch (err) {
            error = err;
            console.log(err);
          }

          this.scheduled = false;

          if (reads.length || writes.length) {
            this.scheduleTasks();
          }

          if (error) {
            console.error('Task errored', error.message);
            if (!this.catch) throw error;
            this.catch(error);
          }
        });
      }
    }

    flush(tasks) {
      while (tasks.length) {
        tasks.shift()();
      }
    }

    clear(task) {
      return (
        this.removeTask(this.reads, task) || this.removeTask(this.writes, task)
      );
    }

    removeTask(tasks, task) {
      const index = tasks.indexOf(task);
      if (index !== -1) {
        tasks.splice(index, 1);
        return true;
      }
      return false;
    }

    extend(obj) {
      if (typeof obj !== 'object') {
        throw new Error('Expected an object');
      }

      const extended = Object.create(this);
      Object.assign(extended, obj);
      extended.fastdom = this;

      if (extended.initialize) {
        extended.initialize();
      }

      return extended;
    }

    measure(task, context) {
      const boundTask = context ? task.bind(context) : task;
      this.reads.push(boundTask);
      this.scheduleTasks(this);
      return boundTask;
    }

    mutate(task, context) {
      const boundTask = context ? task.bind(context) : task;
      this.writes.push(boundTask);
      this.scheduleTasks(this);
      return boundTask;
    }
  }

  const fastdomInstance = (window.fastdom = window.fastdom || new FastDOM());
  exports.exports = fastdomInstance;
});

//done
// Define the smoothscroll module as a CommonJS module
var smoothscroll = createCommonjsModule((module, exports) => {
  // Function to initiate the smooth scroll polyfill
  function initSmoothScroll() {
    // Constructor for Scroll Position
    function scrollPosition(left, top) {
      this.scrollLeft = left;
      this.scrollTop = top;
    }
    // Polyfill logic to define scroll methods if smooth scroll is unsupported
    const windowRef = window;
    const documentRef = document;
    const animationDuration = 468;
    const padding = navigator.userAgent.includes(['MSIE', 'Trident', 'Edge'])
      ? 1
      : 0;
    const getPerformanceInstance =
      windowRef.performance && windowRef.performance.now
        ? windowRef.performance.now.bind(windowRef.performance)
        : Date.now;

    if (
      !(
        'scrollBehavior' in documentRef.documentElement.style &&
        !windowRef.__forceSmoothScrollPolyfill__
      )
    ) {
      const HTMLElementPrototype = windowRef.HTMLElement || windowRef.Element;

      const config = {
        scroll: windowRef.scroll || windowRef.scrollTo,
        scrollBy: windowRef.scrollBy,
        elementScroll: HTMLElementPrototype.prototype.scroll || scrollPosition,
        scrollIntoView: HTMLElementPrototype.prototype.scrollIntoView,
      };
      // Define the scroll and scrollTo methods
      windowRef.scroll = windowRef.scrollTo = (options) => {
        if (arguments[0] !== undefined) {
          if (!validateScrollOptions(arguments[0])) {
            startScroll(
              documentRef.body,
              options.left !== undefined
                ? ~~options.left
                : windowRef.scrollX || window.pageXOffset,
              options.top !== undefined
                ? ~~options.top
                : windowRef.scrollY || window.pageYOffset
            );
          } else {
            // Native behavior
            config.scroll.call(
              windowRef,
              options.left !== undefined
                ? options.left
                : 'object' !== typeof arguments[0]
                ? arguments[0]
                : windowRef.scrollX || window.pageXOffset,
              options.top !== undefined
                ? options.top
                : arguments[1] !== undefined
                ? arguments[1]
                : windowRef.scrollY || window.pageYOffset
            );
          }
        }
      };

      windowRef.scrollBy = function (options) {
        if (arguments[0] !== undefined) {
          if (validateScrollOptions(arguments[0])) {
            startScroll(
              documentRef.body,
              ~~arguments[0].left + (windowRef.scrollX || window.pageXOffset),
              ~~arguments[0].top + (windowRef.scrollY || window.pageYOffset)
            );
          } else {
            config.scrollBy.call(
              windowRef,
              options.left !== undefined
                ? options[0].left
                : 'object' !== typeof arguments[0]
                ? arguments[0]
                : 0,
              options.top !== undefined
                ? options[0].top
                : arguments[1] !== undefined
                ? arguments[1]
                : 0
            );
          }
        }
      };

      // Extend HTMLElement prototype for scroll and scrollTo
      HTMLElementPrototype.prototype.scroll =
        HTMLElementPrototype.prototype.scrollTo = function (options) {
          if (arguments[0] !== undefined) {
            if (!validateScrollOptions(arguments[0])) {
              var targetX = options.left;
              var targetY = options.top;
              startScroll(
                this,
                targetX === undefined ? this.scrollLeft : ~~targetX,
                targetY === undefined ? this.scrollTop : ~~targetY
              );
            } else {
              if (
                typeof arguments[0] === 'number' &&
                arguments[1] === undefined
              ) {
                throw new SyntaxError('Value could not be converted');
              }
              config.elementScroll.call(
                this,
                options.left !== undefined
                  ? ~~options.left
                  : 'object' !== typeof arguments[0]
                  ? ~~arguments[0]
                  : this.scrollLeft,
                options.top !== undefined
                  ? ~~options.top
                  : arguments[1] !== undefined
                  ? ~~arguments[1]
                  : this.scrollTop
              );
            }
          }
        };

      // Extend HTMLElement prototype for scrollBy
      HTMLElementPrototype.prototype.scrollBy = function (options) {
        if (arguments[0] !== undefined) {
          if (!validateScrollOptions(arguments[0])) {
            this.scroll({
              left: ~~options.left + this.scrollLeft,
              top: ~~options.top + this.scrollTop,
              behavior: options.behavior,
            });
          } else {
            config.elementScroll.call(
              this,
              options.left !== undefined
                ? ~~options.left + this.scrollLeft
                : ~~options[0] + this.scrollLeft,
              options.top !== undefined
                ? ~~options.top + this.scrollTop
                : ~~options[1] + this.scrollTop
            );
          }
        }
      };

      // Extend HTMLElement prototype for scrollIntoView
      HTMLElementPrototype.prototype.scrollIntoView = function (options) {
        if (!validateScrollOptions(arguments[0])) {
          var parentElement = (function (element) {
            while (element !== documentRef.body && !canScroll(element)) {
              element = element.parentNode || element.host;
            }
            return element;
          })(this);

          var parentRect = parentElement.getBoundingClientRect();
          var elementRect = this.getBoundingClientRect();

          if (parentElement !== documentRef.body) {
            startScroll(
              this,
              parentElement.scrollLeft + elementRect.left - parentRect.left,
              parentElement.scrollTop + elementRect.top - parentRect.top
            );

            if (getComputedStyle(parentElement).position !== 'fixed') {
              windowRef.scrollBy({
                left: parentRect.left,
                top: parentRect.top,
                behavior: 'smooth',
              });
            }
          } else {
            windowRef.scrollBy({
              left: elementRect.left,
              top: elementRect.top,
              behavior: 'smooth',
            });
          }
        } else {
          config.scrollIntoView.call(
            this,
            options[0] === undefined || options[0]
          );
        }
      };
    }

    // Check if the given options are valid
    function validateScrollOptions(options) {
      if (
        options === null ||
        typeof options !== 'object' ||
        options.behavior === undefined ||
        options.behavior === 'auto' ||
        options.behavior === 'instant'
      ) {
        return true;
      }
      if (typeof options === 'object' && options.behavior === 'smooth') {
        return false; // Smooth behavior is not valid for polyfill
      }
      throw new TypeError(
        'Invalid value for ScrollOptions behavior: ' + options.behavior
      );
    }

    // Determine if scrolling is possible in the given direction
    function canScrollInDirection(element, direction) {
      return direction === 'Y'
        ? element.clientHeight + padding < element.scrollHeight
        : direction === 'X'
        ? element.clientWidth + padding < element.scrollWidth
        : undefined;
    }

    // Check if overflow is set to scroll or auto
    function hasScrollOverflow(element, direction) {
      const overflowStyle = getComputedStyle(element)['overflow' + direction];
      return overflowStyle === 'auto' || overflowStyle === 'scroll';
    }

    // Check if scrolling is possible in either direction
    function canScroll(element) {
      const verticalScroll =
        canScrollInDirection(element, 'Y') && hasScrollOverflow(element, 'Y');
      const horizontalScroll =
        canScrollInDirection(element, 'X') && hasScrollOverflow(element, 'X');
      return verticalScroll || horizontalScroll;
    }

    // Animation frame function for smooth scrolling
    function animateScroll(scrollData) {
      const progress =
        (getPerformanceInstance() - scrollData.startTime) / animationDuration;
      const easing = easeInOutCubic(progress > 1 ? 1 : progress);

      const currentX =
        scrollData.startX + (scrollData.targetX - scrollData.startX) * easing;
      const currentY =
        scrollData.startY + (scrollData.targetY - scrollData.startY) * easing;

      scrollData.method.call(scrollData.scrollable, currentX, currentY);

      // Continue animation if not yet reached target
      if (currentX !== scrollData.targetX || currentY !== scrollData.targetY) {
        requestAnimationFrame(animateScroll.bind(window, scrollData));
      }
    }

    // Start the smooth scroll process
    function startScroll(element, targetX, targetY) {
      let scrollable,
        method,
        startX,
        startY,
        currentTime = getPerformanceInstance();

      if (element === document.body) {
        scrollable = window;
        startX = window.scrollX || window.pageXOffset;
        startY = window.scrollY || window.pageYOffset;
        method = window.scroll; // Native scroll method
      } else {
        scrollable = element;
        startX = element.scrollLeft;
        startY = element.scrollTop;
        method = scrollPosition;
      }

      // Initiate animation
      animateScroll({
        scrollable: scrollable,
        method: method,
        startTime: currentTime,
        startX: startX,
        startY: startY,
        targetX: targetX,
        targetY: targetY,
      });
    }

    // Easing function for smooth animation
    function easeInOutCubic(power) {
      return 0.5 * (1 - Math.cos(Math.PI * power));
    }
  }

  // Export the smooth scroll polyfill
  exports.polyfill = initSmoothScroll;
});

//done
function updateMediaSizes(element) {
  const visibleMediaItems = element.find(
    '.product__media-item:not(.is--media-hide)'
  );
  let mediaCount = visibleMediaItems.length;

  mediaCount = mediaCount >= 4 ? 'normal' : mediaCount;

  element.attr('data-media-sizes', mediaCount);

  // Mark the last visible media item
  visibleMediaItems.last().addClass('is--media-last');

  // Clear the data-index attribute on all media items
  element.find('.product__media-item').attr('data-index', '');

  // Set the data-index attribute on visible media items
  visibleMediaItems.each((index, item) => {
    window.jQuery(item).attr('data-index', index);
  });
}

var $window = window.jQuery(window);
var $document = window.jQuery(document);
var windowWidth = $window.width();
var $html = window.jQuery('html');
var $body = window.jQuery('body');
var isMobile = windowWidth < 768;
var isTabletOrBelow = windowWidth <= 1024;
var isDesignMode = window.T4Srequest.design_mode;
var strings = window.T4Sstrings;
var cacheNameFirst = window.T4SThemeSP.cacheNameFirst;
var isTouchDevice = !!(
  'ontouchstart' in window ||
  (window.DocumentTouch && document instanceof DocumentTouch) ||
  window.navigator.maxTouchPoints ||
  window.navigator.msMaxTouchPoints
);

window.T4SThemeSP.isHover = $html.hasClass('p-hover');
window.T4SThemeSP.isTouch =
  isTouchDevice && (!window.T4SThemeSP.isHover || isTabletOrBelow);

document.addEventListener('theme:hover', () => {
  window.T4SThemeSP.isHover = true;
  window.T4SThemeSP.isTouch = false;
});

//done
window.T4SThemeSP.getToFetchSection = async (
  path,
  responseType = 'text',
  fallbackUrl = null
) => {
  const url = path ? `${window.T4SThemeSP.root_url}${path}` : fallbackUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.redirected) {
      return 'NVT_94';
    }

    return responseType === 'text' ? response.text() : response.json();
  } catch (error) {
    console.warn(error);
    return 'NVT_94';
  }
};

//done
window.T4SThemeSP.OverflowScroller = class {
  element = null;
  options = null;
  lastKnownY = 0;
  currentTop = 0;
  initialTopOffset = 0;
  initialTopOffsetCache = 0;
  constructor(element, options) {
    if (!element && windowWidth > 767) return;

    this.element = element;
    this.options = options;
    this.lastKnownY = window.scrollY;
    this.currentTop = 0;
    this.initialTopOffset =
      options.offsetTop ||
      parseInt(window.getComputedStyle(this.element).top, 10);
    this._attachListeners();

    if (options.updateOffsetTop) {
      this.initialTopOffsetCache = this.initialTopOffset;
      this._updateInitialTopOffset();
    }
  }

  _updateInitialTopOffset() {
    window.addEventListener('T4sHeaderReveal', () => {
      this.initialTopOffset = this.initialTopOffsetCache;
    });

    window.addEventListener('T4sHeaderHide', () => {
      this.initialTopOffset = 30;
    });
  }

  _attachListeners() {
    this._checkPositionListener = this._checkPosition.bind(this);
    window.addEventListener('scroll', this._checkPositionListener);
  }

  _checkPosition() {
    fastdomT4s.measure(() => {
      const rectTop =
        this.element.getBoundingClientRect().top +
        window.scrollY -
        this.element.offsetTop +
        this.initialTopOffset;
      const maxScroll =
        this.element.clientHeight -
        window.innerHeight +
        (this.options.offsetBottom || 0);

      if (window.scrollY < this.lastKnownY) {
        this.currentTop -= window.scrollY - this.lastKnownY;
      } else {
        this.currentTop += this.lastKnownY - window.scrollY;
      }

      this.currentTop = Math.min(
        Math.max(this.currentTop, -maxScroll),
        rectTop,
        this.initialTopOffset
      );
      this.lastKnownY = window.scrollY;
    });

    fastdomT4s.mutate(() => {
      this.element.style.top = `${this.currentTop}px`;
    });
  }

  destroy() {
    window.removeEventListener('scroll', this._checkPositionListener);
  }
};

var h = (() => {
  const swatchItemSelector = '[data-swatch-item]';
  const unavailableClass = 'is--unavailable';
  const soldOutClass = `is--soldout ${unavailableClass}`;
  const determineClass = (isSoldOut) =>
    isSoldOut ? soldOutClass : unavailableClass;

  const {
    unavailable: unavailableText,
    addToCart: addToCartText,
    soldOut: soldOutText,
    preOrder: preOrderText,
    replace_qs_atc: replaceQuickShopAtcText,
    replace_qs_pre: replaceQuickShopPreText,
    badgeSavePercent2: badgeSavePercentText,
    badgeSaveFixed2: badgeSaveFixedText,
  } = window.T4SProductStrings;

  const ariaAttributes = {
    disabled: 'aria-disabled',
  };
  class ProductForm {
    constructor(options) {
      this.$container = options.$container;
      this.variants = options.variants;
      this.productOptions = options.productOptions;
      this.productOptionSize = options.PrOptionsSize;
      this.formSelectorId = options.formSelectorId;
      this.$formSelectorId = window.jQuery(this.formSelectorId);
      this.$originalSelectorId = options.$originalSelectorId;
      this.originalSelectorId = this.$originalSelectorId[0];
      this.enableHistoryState = options.enableHistoryState;
      this.removeSoldout = options.removeSoldout;
      this.$options1 = options.$options1;
      this.$options2 = options.$options2;
      this.$options3 = options.$options3;
      this.isNoPick = options.isNoPick;
      this.isNoPickOriginal = options.isNoPick;
      this.hasSoldoutUnavailable = options.hasSoldoutUnavailable;
      this.canMediaGroup = options.canMediaGroup;
      this.badgesConfigs = options.badgesConfigs;
      this.$variantImg = options.$variantImg;
      this.disableVariantImage = options.disableVariantImage;
      this.swatchWidth = options.swatchWidth;
      this.$incomingMess = this.$formSelectorId.find('[data-incoming__mess]');
      this.isSticky = options.isSticky;
      this.useStickySelect = options.useStickySelect;
      this.isMainProduct = options.isMainProduct;
      this.$quantity = this.$formSelectorId.find('[data-quantity-value]');
      this.$mainMedia = this.$container.find('[data-main-media]');
      this.$mainNav = this.$container.find('.carousel__nav');
      this.clickedOptions = [];
      this.showFirstMedia = !this.isNoPickOriginal && options.showFirstMedia;
      this.oldVariant = {};
      this.currentVariant = {};
      this.mediaID = 0;
      this.eventClickedSwatch = false;
      this.variantState = {
        available: true,
        soldOut: false,
        onSale: false,
        preOrder: false,
        showUnitPrice: false,
      };
      this.$productPrice = this.$container.find('[data-product-price]');
      this.formatPrice =
        this.$productPrice.data('formartPrice') === 'ins-del'
          ? '<ins>money_ins</ins> <del>money_del</del>'
          : '<del>money_del</del> <ins>money_ins</ins>';
      this.saleType = this.$productPrice.data('saletype');

      this.$unit_price = this.$container
        .find('[data-product-unit-price]')
        .find('[data-unit-price]');
      this.$unit_base = this.$container
        .find('[data-product-unit-price]')
        .find('[data-unit-base]');
      this.productSingleBadge = this.$container.find(
        '[data-product-single-badge]'
      );
      this.badgeSelector = {
        $onSale: this.productSingleBadge.find('[data-badge-sale]'),
        $preOrder: this.$container.find('[data-badge-preorder]'),
        $soldOut: this.$container.find('[data-badge-soldout]'),
      };
      this.saleLabel =
        this.badgesConfigs.saleStyle === '2'
          ? this.badgesConfigs.texts.SavePercent
          : this.badgesConfigs.texts.sale;

      this.useComingMess = this.$incomingMess.length > 0;
      if (this.useComingMess) {
        this.$incomingAvailable = this.$incomingMess.find(
          '[data-incoming-available]'
        );
        this.$incomingSoldout = this.$incomingMess.find(
          '[data-incoming-soldout]'
        );
        this.$incomingAvailableDate = this.$incomingAvailable.find(
          '[data-incoming-date]'
        );
        this.$incomingSoldoutDate = this.$incomingSoldout.find(
          '[data-incoming-date]'
        );
      }

      this.$addToCartButton = this.$formSelectorId.find(
        '[type="submit"][name="add"]'
      );
      this.$quantityWrapper = this.$formSelectorId.find(
        '[data-quantity-wrapper]'
      );
      this.$paymentButton = this.$formSelectorId.find(
        '.shopify-payment-button'
      );
      this.$addToCartButtonText = this.$addToCartButton.find('.btn-atc_text');

      if (this.isSticky) {
        const $stickyCart = window.jQuery('[data-sticky-addtocart]');
        this.$stickyimg = $stickyCart.find('[data-sticky-img] img');
        this.$stickyVtitle = $stickyCart.find('[data-sticky-v-title]');
        this.$stickyPrice = $stickyCart.find('[data-sticky-price]');
        this.$stickyATC = $stickyCart.find('[data-action-atc]');
        this.$stickyATCText = this.$stickyATC.find('.btn-atc_text');
        this.$stickySelect = $stickyCart.find('[data-sticky-select]');
        this.stickyImgOriginal = this.$stickyimg.data('original');
        this.$stickyQuantityWrapper = $stickyCart.find(
          '[data-quantity-wrapper]'
        );
        this.$stickyQuantity = this.$stickyQuantityWrapper.find(
          '[data-quantity-value]'
        );
        this.isStickyChanging = false;

        this.$stickySelect.on('change:drop', (event, element, value) => {
          this.eventClickedSwatch = false;
          this.isStickyChanging = true;
          this.originalSelectorId.value = value;
          this.originalSelectorId.dispatchEvent(
            new Event('change', {
              bubbles: true,
              cancelable: true,
            })
          );
        });
      }

      if (window.T4SThemeSP.isEditCartReplace) {
        this.txt_addToCart = replaceQuickShopAtcText;
        this.txt_preOrder = replaceQuickShopAtcText;
      }

      this.unQuickShopInline = options.unQuickShopInline;
      this.isQuickShopForm = options.isQuickShopForm;
      this.$imgMainItem = this.$container.find('[data-main-img-change]');

      if (options.unQuickShopInline) {
        this.originalSelectorId.addEventListener(
          'change',
          this._onSelectChange.bind(this)
        );
        this._updateSwatchFromSizeOne();
        this.isNoPick
          ? (this.currentVariant = this._getVariantFromVariantid())
          : this.originalSelectorId.dispatchEvent(
              new Event('change', {
                bubbles: true,
                cancelable: true,
              })
            );
      } else {
        this.$container.one('replace:btnAtc', () => {
          this.$addToCartButton = this.$container.find('.pr-addtocart');
          this.$quantityWrapper = this.$container.find(
            '[data-quantity-wrapper]'
          );
          this.$addToCartButtonText = this.$addToCartButton.find('.text-pr');
        });
        this.productSingleBadge = this.$container.find('[data-product-badge]');
        this.badgeSelector = {
          $onSale: this.productSingleBadge.find('[data-badge-sale]'),
          $preOrder: this.productSingleBadge.find('[data-badge-preorder]'),
          $soldOut: this.productSingleBadge.find('[data-badge-soldout]'),
        };
        this.$dataHref = this.$container.find('[data-pr-href]');
        this.productHref = this.$dataHref.attr('href');
        this.currentVariant = this._getVariantFromVariantid();

        this.$originalSelectorId.on(
          'change',
          this._onQuickShopInlineChange.bind(this)
        );
        this._updateSwatchFromSizeOne();
      }
    }

    _onSelectChange() {
      if (!this.eventClickedSwatch) {
        this.oldVariant = this.currentVariant;
      }
      const variant = this.eventClickedSwatch
        ? this.currentVariant
        : this._getVariantFromVariantid();

      this._setVariantState(variant);
      this._updateSwatchSelector(
        variant,
        this.oldVariant,
        this.formSelectorId,
        this.hasSoldoutUnavailable
      );
      this._updatePrice(variant, this.oldVariant, this.$container);
      this._updateAddToCartButton(
        variant,
        this.oldVariant,
        this.$addToCartButton,
        this.$quantityWrapper,
        this.$paymentButton,
        this.$addToCartButtonText
      );
      this._updateAvailability(variant, this.oldVariant, this.$container);
      this._updateSKU(variant, this.oldVariant, this.$container);
      this._updateBarcode(variant, this.oldVariant, this.$container);
      this._updateMetafield(variant, this.oldVariant, this.$container);
      this._updateDelivery(variant, this.oldVariant, this.$container);
      this._updateInventoryQuantity(variant, this.oldVariant, this.$container);
      this._updatePickupAvailabilityContent(variant, this.$container);
      this._updateNotifyBackinStock(variant, this.$container);
      this._updateBadges();
      this._updateIncomingMess(variant);

      if (variant) {
        this.currentVariant = variant;
        if (this.canMediaGroup) {
          this._updateMediaFilter(variant, this.oldVariant, this.$container);
        }
        this._updateMedia(variant, this.oldVariant, this.$container);
        this._updateQuantity(variant);
        if (!this.disableVariantImage) {
          this._updateVariantImageSwatch(variant);
        }
        if (this.isSticky) {
          this._updateStickyATC(variant);
        }
        if (this.enableHistoryState) {
          this._updateHistoryState(variant);
        }
        this.$container.trigger({
          type: 'variant:changed',
          currentVariant: variant,
          oldVariant: this.oldVariant,
        });
      }
    }

    _onQuickShopInlineChange() {
      this.notSelected = true;
      if (!this.eventClickedSwatch) {
        this.oldVariant = this.currentVariant;
      }
      const variant = this.eventClickedSwatch
        ? this.currentVariant
        : this._getVariantFromVariantid();

      this._setVariantState(variant);
      this._updateSwatchSelector(
        variant,
        this.oldVariant,
        this.formSelectorId,
        this.hasSoldoutUnavailable
      );
      this._updatePrice(variant, this.oldVariant, this.$container);
      this._updateAtcBtnQSInline(
        variant,
        this.oldVariant,
        this.$addToCartButton,
        this.$quantityWrapper,
        this.$addToCartButtonText
      );
      this._updateBadges();

      if (variant) {
        this.currentVariant = variant;
        this._updateMedia(variant, this.oldVariant, this.$container);
        this._updateQuantity(variant);
        this.$dataHref.attr(
          'href',
          this._getUrlWithVariant(this.productHref, variant.id)
        );
        if (!this.disableVariantImage) {
          this._updateVariantImageSwatch(variant);
        }
        this.$container.trigger({
          type: 'variant:changed',
          currentVariant: variant,
          oldVariant: this.oldVariant,
        });
      }
    }

    _getVariantFromOptions() {
      const clickedOptions = this.clickedOptions;
      return (
        this.variants.find((variant) =>
          clickedOptions.every(
            (option) => variant[option.index] === option.value
          )
        ) || 'nathan'
      );
    }

    _getVariantFromSize() {
      const { variants, productOptionSize, removeSoldout } = this;
      const option1Value = this.clickedOptions[0].value;
      const option2 = this.clickedOptions[1];
      const currentValue = this.clickedCurrentValue;
      const currentIndex = this.clickedCurrentIndex;

      let matchingVariant;

      if (productOptionSize === 1) {
        matchingVariant = variants.filter((variant) => variant.available);
      } else if (productOptionSize === 3 && removeSoldout) {
        const option2Value = option2.value;
        matchingVariant =
          variants.filter(
            (variant) =>
              variant.option1 === option1Value &&
              variant.option2 === option2Value &&
              variant.available
          )[0] ||
          variants.filter(
            (variant) =>
              variant.available && variant[currentIndex] === currentValue
          );
      } else if (removeSoldout) {
        matchingVariant =
          variants.filter(
            (variant) => variant.option1 === option1Value && variant.available
          )[0] ||
          variants.filter(
            (variant) =>
              variant.available && variant[currentIndex] === currentValue
          );
      } else if (productOptionSize === 3) {
        const option2Value = option2.value;
        matchingVariant =
          variants.filter(
            (variant) =>
              variant.option1 === option1Value &&
              variant.option2 === option2Value
          )[0] ||
          variants.filter((variant) => variant[currentIndex] === currentValue);
      } else {
        matchingVariant =
          variants.filter((variant) => variant.option1 === option1Value)[0] ||
          variants.filter((variant) => variant[currentIndex] === currentValue);
      }

      return matchingVariant[0];
    }

    _getVariantFromVariantid() {
      const selectedVariantId = this.$originalSelectorId.val();
      return (
        this.variants.find((variant) => variant.id === selectedVariantId) ||
        null
      );
    }

    _getVariantFromOptionIndex(index, options) {
      const { option1, option2, option3 } = options;
      switch (index) {
        case 1:
          return this.variants.filter((variant) => variant.option1 === option1);
        case 2:
          return this.variants.filter((variant) => variant.option2 === option2);
        case 3:
          return this.variants.filter((variant) => variant.option3 === option3);
        case 1.2:
          return this.variants.filter(
            (variant) =>
              variant.option1 === option1 && variant.option2 === option2
          );
        default:
          return this.variants.filter((variant) => variant.available === 0);
      }
    }

    _updateMediaFilterNoPick() {
      if (
        this.clickedCurrentValue &&
        this.clickedCurrentIndex &&
        this.canMediaGroup
      ) {
        const optionIndex = this.clickedCurrentIndex.replace('option', '');
        const optionName =
          this.productOptions[parseInt(optionIndex) - 1]?.name || 'no';
        const optionValue = this.clickedCurrentValue || 'no';
        const mediaSelector = `[data-grname="${optionName.toLowerCase()}"][data-grpvl="${optionValue.toLowerCase()}"]`;

        const mediaItems = this.$mainMedia.find(mediaSelector);
        const navItems = this.$mainNav.find(mediaSelector);

        if (mediaItems.length !== 0) {
          this.$mainMedia.find('[data-main-slide]').addClass('is--media-hide');
          mediaItems.removeClass('is--media-hide');

          this.$mainNav.find('.carousel__nav-item').addClass('is--media-hide');
          navItems.removeClass('is--media-hide');

          if (this.$mainMedia.hasClass('flickity-enabled')) {
            this.$mainMedia.trigger('update.flickity');
            if (!navItems.hasClass('is-nav-selected')) {
              navItems.first().addClass('is-nav-selected');
            }
          } else if (this.$mainMedia.hasClass('isotope-enabled')) {
            this.$mainMedia.isotope();
          }
        }
      }
    }

    _updateSwatchFromSizeOne() {
      const optionSize = this.productOptionSize;
      const optionValues = this.productOptions;

      let optionsToUpdate;
      let optionsIndex = 0;

      if (
        optionSize === 1 ||
        (optionSize === 2 && optionValues[0]?.values?.length === 1)
      ) {
        optionsToUpdate = this.$options2;
        optionsIndex = 1;
      } else if (
        optionSize === 3 &&
        optionValues[0]?.values?.length === 1 &&
        optionValues[1]?.values?.length === 1
      ) {
        optionsToUpdate = this.$options3;
        optionsIndex = 2;
      } else {
        optionsToUpdate = this.$options1;
      }

      if (this.hasSoldoutUnavailable) {
        const optionList = optionValues[optionsIndex].values;
        const variantCount = this.variants.length;

        const swatchItems =
          this[`$options${optionsIndex + 1}`].find('[data-swatch-item]');

        optionList.forEach((optionValue, i) => {
          let isSoldout = true;
          for (let j = 0; j < variantCount; j++) {
            const variant = this.variants[j];
            if (
              variant.options[optionsIndex] === optionValue &&
              variant.available
            ) {
              isSoldout = false;
              break;
            }
          }
          if (isSoldout) {
            swatchItems.eq(i).addClass('is--soldout');
          }
        });
      }

      this.getProductSize = !!optionsToUpdate;
      this.$optionsOne = optionsToUpdate;
      this.$optionsOneIndex = optionsIndex;
    }

    _updateMediaFilter(currentVariant) {
      if (currentVariant && this.canMediaGroup) {
        let optionName;
        let optionValue;
        let mediaSelector;
        const productOptions = this.productOptions;
        const productOptionSize = this.productOptionSize;

        for (let i = 0; i < productOptionSize; i++) {
          optionName = productOptions[i]?.name || 'no';
          if (
            this.$mainMedia.find(`[data-grname="${optionName.toLowerCase()}"]`)
              .length !== 0
          ) {
            optionValue = currentVariant.options[i];
            mediaSelector = `[data-grname="${optionName.toLowerCase()}"][data-grpvl="${optionValue.toLowerCase()}"]`;
            break;
          }
        }

        const mediaItems = this.$mainMedia.find(mediaSelector);
        const navItems = this.$mainNav.find(mediaSelector);

        if (mediaItems.length !== 0 && optionValue !== this.groupValue) {
          this.groupValue = optionValue;
          this.$mainMedia.find('[data-main-slide]').addClass('is--media-hide');
          mediaItems.removeClass('is--media-hide');

          this.$mainNav.find('.carousel__nav-item').addClass('is--media-hide');
          navItems.removeClass('is--media-hide');

          if (this.$mainMedia.hasClass('flickity-enabled')) {
            this.$mainMedia.trigger('update.flickity');
            const featuredMediaIndex = currentVariant.featured_media
              ? this.$mainMedia
                  .find(
                    `[data-media-id="${currentVariant.featured_media.id}"]:visible`
                  )
                  .index()
              : 0;
            this.$mainMedia.flickity(
              'selectCell',
              Math.max(featuredMediaIndex, 0),
              false,
              false
            );
          } else if (this.$mainMedia.hasClass('isotope-enabled')) {
            this.$mainMedia.isotope();
          }
        }
      }
    }

    _updateSwatchSelector(currentVariant, $selector, isAvailable) {
      const swatchItems = $selector.find('.is--selected');
      swatchItems.removeClass('is--selected');
      $selector.find('[data-current-value]').html('');

      const productOptions = this.productOptions;
      const option1 = currentVariant.option1;
      const option2 = currentVariant.option2;
      const option3 = currentVariant.option3;

      this.$options1.find('[data-current-value]').html(option1);
      this.$options1
        .find(swatchItemSelector)
        .eq(productOptions[0].values.indexOf(option1))
        .addClass('is--selected');
      if (this.$options2[0]) {
        this.$options2.find('[data-current-value]').html(option2);
        this.$options2
          .find(swatchItemSelector)
          .eq(productOptions[1].values.indexOf(option2))
          .addClass('is--selected');
      }

      if (this.$options3[0]) {
        this.$options3.find('[data-current-value]').html(option3);
        this.$options3
          .find(swatchItemSelector)
          .eq(productOptions[2].values.indexOf(option3))
          .addClass('is--selected');
      }

      if (isAvailable) {
        switch (this.getProductSize || this.productOptionSize) {
          case 3: {
            let $option,
              optionVal,
              optionType1,
              optionType2,
              optionType,
              optionIndex;
            if (productOptions[2].values.length === 1) {
              $option = this.$options1;
              optionVal = productOptions[0].values;
              optionType1 = 'option3';
              optionType = option3;
              optionType2 = 'option1';
              optionIndex = 3;
            } else {
              $option = this.$options3;
              optionVal = productOptions[2].values;
              optionType1 = 'option1';
              optionType = option1;
              optionType2 = 'option3';
              optionIndex = 1;
            }

            const variants = this._getVariantFromOptionIndex(
              optionIndex,
              currentVariant
            );
            const variantLen = variants.length;
            $option.find(swatchItemSelector).addClass(soldOutClass);
            this.$options2[0].find(swatchItemSelector).addClass(soldOutClass);
            for (let i = 0; i < variantLen; i++) {
              const variant = variants[i];
              if (variant[optionType1] === optionType) {
                if (variant.available) {
                  this.$options2
                    .find(swatchItemSelector)
                    .eq(productOptions[1].values.indexOf(option2))
                    .removeClass(soldOutClass);
                  variant.option2 === option2 &&
                    $option
                      .find(swatchItemSelector)
                      .eq(optionVal.indexOf(variant[optionType2]))
                      .removeClass(soldOutClass);
                } else {
                  this.$options2
                    .find(swatchItemSelector)
                    .eq(productOptions[1].values.indexOf(option2))
                    .removeClass(unavailableClass);
                  variant.option2 === option2 &&
                    $option
                      .find(swatchItemSelector)
                      .eq(optionVal.indexOf(variant[optionType2]))
                      .removeClass(unavailableClass);
                }
              }
            }
            break;
          }
          case 2: {
            const variants = this._getVariantFromOptionIndex(1, currentVariant);
            const variantLen = variants.length;
            this.$options2.find(swatchItemSelector).addClass(soldOutClass);
            for (let i = 0; i < variantLen; i++) {
              const variant = variants[i];
              if (variant === option1) {
                this.$options2
                  .find(swatchItemSelector)
                  .eq(productOptions[1].values.indexOf(option2))
                  .removeClass(determineClass(currentVariant.available));
              }
            }
            break;
          }
          default:
            this.removeSoldout &&
              this.$optionsOne.find('.is--selected').is(':hidden') &&
              this.$optionsOne
                .find('[data-swatch-item]:visible:first')
                .trigger('click');
        }
      }
    }

    _updateMetafield(newMetafield, currentMetafield, container) {
      if (newMetafield && newMetafield.id !== currentMetafield.id) {
        // Hide all variant toggles
        container.find('[data-variant-toggle]').hide();

        // Show the specific variant toggle for the new metafield
        container.find(`[data-variant-toggle="${newMetafield.id}"]`).show();

        // If this is the main product, handle variant tabs
        if (this.isMainProduct) {
          window.jQuery('[data-variant-tab][data-variant-toggle]').hide();
          window
            .jQuery(
              `[data-variant-tab][data-variant-toggle="${newMetafield.id}"]`
            )
            .show();
        }
      }
    }

    _updateMedia(newData, oldData, container) {
      if (
        newData.featured_media &&
        JSON.stringify(newData.featured_media) !==
          JSON.stringify(oldData.featured_media) &&
        !this.showFirstMedia
      ) {
        if (!this.unQuickShopInline || this.isQuickShopForm) {
          const previewImage = newData.featured_media.preview_image;
          let shouldLoadImmediately = true;
          const lazyLoadDelay =
            this.$imgMainItem.hasClass('lazyloaded') && shouldLoadImmediately
              ? 0
              : 100;

          // Set the new image source after a delay
          setTimeout(() => {
            this.$imgMainItem.attr(
              'data-srcset',
              window.T4SThemeSP.Images.getNewImageUrl(previewImage.src, 1)
            );
            shouldLoadImmediately = false;
          }, lazyLoadDelay);

          // Update the container if not selected
          if (this.notSelected) {
            this.$container.addClass('colors-selected');
            this.notSelected = false;
          }
        }

        this.mediaID = newData.featured_media.id;
        const mediaElements = container.find('[data-main-media]');

        if (mediaElements.hasClass('flickity-enabled')) {
          const mediaIndex = mediaElements
            .find(`[data-media-id="${this.mediaID}"]:visible`)
            .index();
          mediaElements.flickity(
            'select',
            Math.max(mediaIndex, 0),
            false,
            true
          );
          this.eventClickedSwatch = false;
        } else if (!mediaElements.hasClass('of-scrollIntoView')) {
          const targetMedia = mediaElements.find(
            `[data-media-id="${this.mediaID}"]`
          )[0];

          if (
            !targetMedia ||
            window.T4SThemeSP.isVisible(window.jQuery(targetMedia)) ||
            this.isStickyChanging
          ) {
            return;
          }

          // Dispatch event to prevent header reveal
          if (!this.header) {
            this.header = document.querySelector('.section-header');
          }
          this.header.dispatchEvent(new Event('preventHeaderReveal'));

          // Scroll to the target media smoothly
          window.setTimeout(() => {
            mediaElements[0].scrollLeft = 0;
            targetMedia.scrollIntoView({ behavior: 'smooth' });
          });
        }
      } else {
        this.showFirstMedia = false;
      }
    }

    _updateMediaFirst(swatchElement) {
      // Return if QuickShopInline is enabled
      if (this.unQuickShopInline) return;

      // Find the closest swatch option
      const swatchOption = swatchElement.closest('[data-swatch-option]');

      // Exit if the swatch option is not a color style
      if (!swatchOption.hasClass('is-style__color')) return;

      const variantOptions = this.variants;
      const variantCount = variantOptions.length;
      const optionIndex = swatchOption.data('id');

      // Get the selected color or style value
      const selectedValue = (swatchElement.data('value') + '').toLowerCase();

      // Find the matching featured media based on the selected swatch
      const previewImage = (() => {
        for (let i = 0; i < variantCount; i++) {
          const variant = variantOptions[i];
          if (
            variant.featured_media &&
            (variant.options[optionIndex] + '').toLowerCase() === selectedValue
          ) {
            return variant.featured_media.preview_image;
          }
        }
      })();

      // Update the main image if a preview image is found
      if (previewImage) {
        this.$imgMainItem.attr(
          'data-srcset',
          window.T4SThemeSP.Images.getNewImageUrl(previewImage.src, 1)
        );
      }
    }

    _updatePrice(currentVariant, previousVariant) {
      if (!currentVariant) {
        this.$productPrice.hide();
        return;
      }

      const price = currentVariant.price;
      const comparePrice = currentVariant.compare_at_price;

      if (
        price === previousVariant.price &&
        comparePrice === previousVariant.compare_at_price
      ) {
        return;
      }

      this.$productPrice.show();
      const formattedPrice = window.T4SThemeSP.Currency.formatMoney(price);
      this.$productPrice.html(formattedPrice);

      if (currentVariant.onSale) {
        const formattedComparePrice =
          window.T4SThemeSP.Currency.formatMoney(comparePrice);
        this.$productPrice.html(
          `${formattedPrice} <span class="compare-price">${formattedComparePrice}</span>`
        );
      }
    }

    _updateQuantity(t) {
      const minQuantity = t.quantity_rule ? t.quantity_rule.min : 1;
      let maxQuantity = t.quantity_rule?.max ? t.quantity_rule.max : 9999;

      if (this.variantState.preOrder) {
        this.$quantity.attr({ min: minQuantity, max: maxQuantity });
        if (this.isSticky) {
          this.$stickyQuantity.attr({ min: minQuantity, max: maxQuantity });
        }
      } else if (
        t.inventory_management !== null &&
        t.inventory_policy !== 'continue'
      ) {
        let availableQuantity = t.inventory_quantity;
        if (availableQuantity < maxQuantity) maxQuantity = availableQuantity;
        this.$quantity.attr({ min: minQuantity, max: maxQuantity });
        if (this.isSticky) {
          this.$stickyQuantity.attr({ min: minQuantity, max: maxQuantity });
        }
        if (parseInt(this.$quantity.val()) > availableQuantity) {
          this.$quantity.attr('value', 1).val(1);
        }
        if (
          this.isSticky &&
          parseInt(this.$stickyQuantity.val()) > availableQuantity
        ) {
          this.$stickyQuantity.attr('value', 1).val(1);
        }
      } else {
        this.$quantity.attr({ min: minQuantity, max: maxQuantity });
        if (this.isSticky) {
          this.$stickyQuantity.attr({ min: minQuantity, max: maxQuantity });
        }
      }
    }

    _updateAvailability(t, e, i) {
      const availabilitySection = i.find('[data-product-available]');
      if (availabilitySection.length) {
        const availableStatus = availabilitySection.find(
          '[data-available-status]'
        );
        const soldOutStatus = availabilitySection.find('[data-soldout-status]');
        const inStockStatus = availabilitySection.find('[data-instock-status]');
        const preOrderStatus = availabilitySection.find(
          '[data-preorder-status]'
        );

        if (t) {
          availabilitySection.show();
          if (this.variantState.available) {
            availableStatus.show();
            soldOutStatus.hide();
            if (this.variantState.preOrder) {
              preOrderStatus.show();
              inStockStatus.hide();
            } else {
              inStockStatus.show();
              preOrderStatus.hide();
            }
          } else {
            soldOutStatus.show();
            availableStatus.hide();
          }
        } else {
          availabilitySection.hide();
        }
      }
    }

    _updateBarcode(t, e, i) {
      const barcodeSection = i.find('[data-product-barcode]');
      if (barcodeSection.length) {
        const barcodeNumber = barcodeSection.find(
          '[data-product__barcode-number]'
        );
        if (t && t.barcode) {
          if (e && e.barcode === t.barcode) return;
          barcodeNumber.text(t.barcode);
          barcodeSection.show(0);
        } else {
          barcodeSection.hide(0);
        }
      }
    }

    _updateSKU(t, e, i) {
      const skuSection = i.find('[data-product-sku]');
      if (skuSection.length) {
        const skuNumber = skuSection.find('[data-product__sku-number]');
        if (t && t.sku) {
          if (e && e.sku === t.sku) return;
          skuNumber.text(t.sku);
          skuSection.show(0);
        } else {
          skuSection.hide(0);
        }
      }
    }

    _updateAddToCartButton(
      variant,
      oldVariant,
      $addToCartButton,
      $quantityWrapper,
      $paymentButton,
      $addToCartButtonText
    ) {
      if ($addToCartButton.length || n.length) {
        if (
          window.T4SThemeSP.isEditCartReplace &&
          !$addToCartButton.is('[data-replace-item]')
        ) {
          $addToCartButton.attr('data-replace-item', '');
        }
        if (t && t !== 'nathan') {
          if (t.available) {
            const buttonText = this.variantState.preOrder
              ? this.txt_preOrder || p
              : this.txt_addToCart || u;
            a.show();
            $addToCartButton
              .removeAttr(`disabled ${y.disabled}`)
              .attr('data-atc-form', '');
            o.text(buttonText);
            n.show();
            if (this.isSticky) {
              this.$stickyQuantityWrapper.show();
              this.$stickyATC.removeAttr(`disabled ${y.disabled}`);
              this.$stickyATCText.text(buttonText);
            }
          } else {
            a.hide();
            $addToCartButton
              .attr('disabled', 'disabled')
              .attr(y.disabled, true)
              .removeAttr('data-atc-form', '');
            o.text(f);
            n.hide();
            if (this.isSticky) {
              this.$stickyQuantityWrapper.hide();
              this.$stickyATC
                .attr('disabled', 'disabled')
                .attr(y.disabled, true);
              this.$stickyATCText.text(f);
            }
          }
        } else {
          $addToCartButton
            .attr('disabled', 'disabled')
            .attr(y.disabled, true)
            .removeAttr('data-atc-form');
          o.text(c);
          a.hide();
          n.hide();
          if (this.isSticky) {
            this.$stickyQuantityWrapper.hide();
            this.$stickyATC.attr('disabled', 'disabled').attr(y.disabled, true);
            this.$stickyATCText.text(c);
          }
        }
      }
    }

    _updateAtcBtnQSInline(t, e, i, a, n) {
      if (i.length) {
        if (t && t !== 'nathan') {
          if (t.available) {
            const buttonText = this.variantState.preOrder
              ? this.txt_preOrder || p
              : this.txt_addToCart || u;
            a.show();
            i.removeAttr(`disabled ${y.disabled}`)
              .attr('data-action-atc', '')
              .attr('data-variant-id', t.id);
            n.text(buttonText);
          } else {
            a.hide();
            i.attr('disabled', 'disabled')
              .attr(y.disabled, true)
              .removeAttr('data-action-atc', '');
            n.text(f);
          }
        } else {
          i.attr('disabled', 'disabled')
            .attr(y.disabled, true)
            .removeAttr('data-action-atc');
          n.text(c);
          a.hide();
        }
      }
    }

    _updateDelivery(t, e, a) {
      const deliverySection = a.find('[data-order-delivery]');
      if (deliverySection.length) {
        if (t && t.available) {
          const deliveryMethod = i(deliverySection.attr('data-order-delivery'));
          if (this.variantState.preOrder && deliveryMethod.hideWithPreorder) {
            deliverySection.hide();
          } else {
            deliverySection.show();
          }
        } else {
          deliverySection.hide();
        }
      }
    }

    _updateInventoryQuantity(t, e, i) {
      const inventorySection = i.find('[data-inventory-qty]');
      if (inventorySection.length) {
        if (t && t.available) {
          inventorySection.trigger({
            type: 'variant:inventory',
            currentVariant: t,
            oldVariant: this.oldVariant,
          });
        } else {
          inventorySection.hide();
        }
      }
    }

    _updatePickupAvailabilityContent(t, e) {
      const eventType = t.available
        ? 'pickupAvailability:update'
        : 'pickupAvailability:clear';
      e.trigger({
        type: eventType,
        currentVariant: t,
      });
    }

    _updateNotifyBackinStock(t, e) {
      const eventType = this.variantState.available
        ? 'notifyBackinStock:hide'
        : 'notifyBackinStock:show';
      e.trigger({
        type: eventType,
        currentVariant: t,
      });
    }

    _updateBadges() {
      const { onSale, preOrder, soldOut } = this.variantState;
      const { $onSale, $preOrder, $soldOut } = this.badgeSelector;
      onSale ? $onSale.removeAttr('hidden') : $onSale.attr('hidden', true);
      preOrder
        ? $preOrder.removeAttr('hidden')
        : $preOrder.attr('hidden', true);
      soldOut ? $soldOut.removeAttr('hidden') : $soldOut.attr('hidden', true);
    }

    _setVariantState(t) {
      this.variantState = t
        ? {
            available: t.available,
            soldOut: !t.available,
            onSale: t.compare_at_price > t.price,
            showUnitPrice: !!t.unit_price,
            preOrder:
              t.inventory_management === 'shopify' &&
              t.inventory_quantity <= 0 &&
              t.available,
          }
        : { available: false };
    }

    _updateVariantImageSwatch(t) {
      if (!t.featured_image) return;
      const selectedImage = this.$variantImg.find('.is--selected');
      const imageElement = selectedImage.find('[data-img-el]') || selectedImage;
      imageElement.attr(
        'data-bg',
        window.T4SThemeSP.Images.getNewImageUrl(
          t.featured_image.src,
          this.swatchWidth
        )
      );
    }

    _updateIncomingMess(t) {
      if (!this.useComingMess) return;
      const {
        next_incoming_date: date,
        inventory_quantity: quantity,
        incoming,
        inventory_management: management,
      } = t;
      if (t && date && quantity <= 0 && incoming && management === 'shopify') {
        this.$incomingMess.removeAttr('hidden');
        if (this.variantState.available) {
          this.$incomingAvailableDate.html(date);
          this.$incomingSoldout.hide();
          this.$incomingAvailable.show();
        } else {
          this.$incomingSoldoutDate.html(date);
          this.$incomingAvailable.hide();
          this.$incomingSoldout.show();
        }
      } else {
        this.$incomingMess.attr('hidden', '');
      }
    }

    _updateStickyATC(t) {
      this.isStickyChanging = false;

      const imageSrc = t.featured_image
        ? window.T4SThemeSP.Images.lazyloadImagePath(t.featured_image.src)
        : this.stickyImgOriginal;

      this.$stickyimg.attr('data-src', imageSrc);

      if (this.useStickySelect) {
        if (t.available) {
          this.$stickyVtitle.find('[data-dropdown-open]>span').text(t.title);
          this.$stickySelect
            .find('[data-dropdown-item]')
            .removeClass('is--selected');
          this.$stickySelect
            .find(`[data-dropdown-item][data-value="${t.id}"]`)
            .addClass('is--selected');
        }
      } else {
        this.$stickyVtitle.html(t.title);
      }

      this.$stickyATC.attr('data-variant-id', t.id);
    }

    _updateHistoryState(t) {
      if (!history.replaceState || !t) return;

      const url = new URL(document.location);
      url.searchParams.set('variant', t.id);

      window.history.replaceState({ path: url.href }, '', url.href);
    }

    _getUrlWithVariant(url, variantId) {
      const variantParam = `variant=${variantId}`;
      if (/variant=/.test(url)) {
        return url.replace(/(variant=)[^&]+/, `$1${variantId}`);
      } else if (/\?/.test(url)) {
        return `${url}&${variantParam}`;
      } else {
        return `${url}?${variantParam}`;
      }
    }
  }

  return ProductForm;
})();

//done
var SalesInteraction = (() => {
  const ANIMATION_ATC = 'data-animation-atc';
  const TIMEZONE = window.T4Sconfigs.timezone;
  const DEFAULT_TIMEZONE = 'nt_guess';

  let guessedTimezone;
  try {
    guessedTimezone = dayjs.tz.guess();
  } catch (error) {
    guessedTimezone = DEFAULT_TIMEZONE;
  }

  const isDifferentTimezone =
    TIMEZONE !== 'not4' && guessedTimezone !== TIMEZONE;

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  function animateATC(t) {
    if (0 != t.length) {
      var e = JSON.parse(t.attr(n) || '{}'),
        a = e.ani;
      if ('none' != a) {
        var o = 'is--animated ' + a,
          s = parseInt(e.time),
          r = parseInt(e.animTime) || 1e3;
        setInterval(function () {
          t.addClass(o),
            setTimeout(function () {
              t.removeClass(o);
            }, r);
        }, s);
      }
    }
  }
  class SalesInteraction {
    $container = null;

    constructor($container) {
      this.$container = $container;
      this.BootSalesInt();
    }

    BootSalesInt() {
      this.liveView();
      this.flashSold();
      this.animateATC();
      this.orderDelivery();
      this.inventoryQuantity();
      this.countdown();
    }

    animateATC() {
      const $element = this.$container.find(`[${ANIMATION_ATC}]`);
      if ($element.length === 0) return;

      const animationData = JSON.parse($element.attr(ANIMATION_ATC) || '{}');
      const { ani, time, animTime = 1000 } = animationData;

      if (ani !== 'none') {
        const animationClass = `is--animated ${ani}`;
        const animationDuration = parseInt(animTime) || 1e3;
        const intervalTime = parseInt(time);

        setInterval(() => {
          $element.addClass(animationClass);
          setTimeout(() => {
            $element.removeClass(animationClass);
          }, animationDuration);
        }, intervalTime);
      }
    }

    liveView() {
      const $liveViewElement = this.$container.find('[data-live-view]');
      if ($liveViewElement.length === 0) return;

      const { min, max, interval } = JSON.parse(
        $liveViewElement.attr('data-live-view')
      );
      let currentCount = getRandomInt(min, max);
      const countArray = [
        '1',
        '2',
        '4',
        '3',
        '6',
        '10',
        '-1',
        '-3',
        '-2',
        '-4',
        '-6',
      ];
      const extraCountArray = ['10', '20', '15'];
      let randomCount = 0;
      let count = 0;
      let p = 0;

      const updateCount = () => {
        randomCount = getRandomInt(0, countArray.length - 1);
        count = countArray[randomCount];
        currentCount = parseInt(currentCount) + parseInt(count);
        if (min >= currentCount) {
          p = getRandomInt(0, extraCountArray.length - 1);
          currentCount += extraCountArray[p];
        }
        if (currentCount < min || currentCount > max) {
          currentCount = getRandomInt(min, max);
        }
        $liveViewElement.find('[data-count]').html(parseInt(currentCount));
      };

      updateCount();
      $liveViewElement.show();
      setInterval(updateCount, interval);
    }

    flashSold() {
      const $flashSoldElement = this.$container.find('[data-flash-sold]');
      if ($flashSoldElement.length === 0) return;

      const { mins, maxs, mint, maxt, id, time } = JSON.parse(
        $flashSoldElement.attr('data-flash-sold')
      );
      let soldCount =
        parseInt(sessionStorage.getItem(`soldS${id}`)) ||
        getRandomInt(mins, maxs);
      let timeCount =
        parseInt(sessionStorage.getItem(`soldT${id}`)) ||
        getRandomInt(mint, maxt);

      const updateSoldData = () => {
        if (soldCount > maxs) soldCount = getRandomInt(mins, maxs);
        if (timeCount > maxt) timeCount = getRandomInt(mint, maxt);
      };

      const setSoldData = () => {
        $flashSoldElement.find('[data-sold]').html(soldCount);
        $flashSoldElement.find('[data-hour]').html(Math.floor(timeCount));
        sessionStorage.setItem(`soldS${id}`, soldCount);
        sessionStorage.setItem(`soldT${id}`, timeCount);
      };

      updateSoldData();
      setSoldData();
      $flashSoldElement.show();

      setInterval(() => {
        soldCount += getRandomInt(1, 4);
        timeCount += parseFloat((Math.random() * (0.8 - 0.1) + 0.1).toFixed(1));
        updateSoldData();
        setSoldData();
      }, time);
    }

    orderDelivery() {
      const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const holidayDates = ['280/12', '100/01'];

      const uniqueValues = (arr) => [...new Set(arr)];
      const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1:
            return 'st';
          case 2:
            return 'nd';
          case 3:
            return 'rd';
          default:
            return 'th';
        }
      };

      // Helper function: Calculate delivery date
      const calculateDate = (date, extraDays, excludedDays, holidayList) => {
        let count = 0;
        while (count < extraDays) {
          date = date.add(1, 'day');
          const dayOfWeek = date.format('d');
          const formattedDate = date.format('DD/MM');
          if (
            excludedDays.includes(dayOfWeek) ||
            holidayList.includes(formattedDate)
          ) {
            continue;
          }
          count++;
        }
        return date;
      };

      // Helper function: Format delivery date
      const formatDeliveryDate = (date, dayNames, monthNames, format) => {
        const day = parseInt(date.format('D'));
        const dayWithSuffix = day + getDaySuffix(day);
        const monthName = monthNames[parseInt(date.format('M')) - 1];
        const dayName = dayNames[parseInt(date.format('d'))];
        return date
          .format(format)
          .replace('t44', dayName)
          .replace('t45', dayWithSuffix)
          .replace('t46', monthName);
      };

      const deliveryContainer = this.$container.find('[data-order-delivery]');
      if (deliveryContainer.length === 0) return;

      let {
        format_day,
        time,
        estimateStartDate = 0,
        estimateEndDate = 0,
        cut_day: cutDay,
        mode,
        timezone,
      } = JSON.parse(deliveryContainer.attr('data-order-delivery') || '{}');

      let startDate = dayjs();
      let endDate = dayjs();
      let currentDate = dayjs();
      let timeInZone;

      let dateFormate = dayJs.formate('HHmmss');
      let deliveryStartDate = window.dayjs().add(estimateStartDate, 'day');
      let deliveryEndDate = window.dayjs().add(estimateEndDate, 'day');

      time = time.replace('24:00:00', '23:59:59') || '19041994';
      const adjustedTime = time.replace(/ /g, '').replace(/:/g, '');

      const dayNames = window.T4SProductStrings.order_dayNames
        .replace(/ /g, '')
        .split(',');
      const monthNames = window.T4SProductStrings.order_monthNames
        .replace(/ /g, '')
        .split(',');
      cutDay = cutDay.replace(/ /g, '').split(',');

      let g = 0;
      let y = 0;

      if (isDifferentTimezone && timezone) {
        try {
          timeInZone = dayjs.tz(currentDate, timezone);
          currentDate = timeInZone;
          adjustedTime = timeInZone.format('HHmmss');
        } catch (err) {
          console.log(`Timezone error: ${TIMEZONE}`, err);
        }
      }

      if (parseInt(dateFormate) >= parseInt(adjustedTime)) {
        timeInZone = timeInZone.add(1, 'day');
        startDate = startDate.add(1, 'day');
        endDate = endDate.add(1, 'day');
        if (mode) {
          while (
            cutDay.includes(weekDays[startDate.format('d')]) ||
            holidayDates.includes(startDate.format('DD/MM'))
          ) {
            startDate = startDate.add(1, 'day');
          }

          while (g < estimateStartDate) {
            startDate = startDate.add(1, 'day');
            if (
              !(
                cutDay.includes(weekDays[startDate.format('d')]) ||
                holidayDates.includes(startDate.format('DD/MM'))
              )
            ) {
              g++;
            }
          }

          while (cutDay.includes(weekDays[endDate.format('d')])) {
            endDate = endDate.add(1, 'day');
          }

          while (y < estimateEndDate) {
            endDate = endDate.add(1, 'day');
            if (!cutDay.includes(weekDays[endDate.format('d')])) {
              y++;
            }
          }
        }
      } else {
        startDate = startDate.add(estimateStartDate, 'day');
        while (
          cutDay.includes(c[startDate.format('d')]) ||
          holidayDates.includes(startDate.format('DD/MM'))
        ) {
          startDate = startDate.add(1, 'day');
        }

        endDate = endDate.add(f, 'day');
        while (cutDay.includes(cutDay[endDate.format('d')])) {
          endDate = endDate.add(1, 'day');
        }
      }

      dayNames = getUniqueElements(order_dayNames);
      monthNames = getUniqueElements(monthNames);

      const calculateDeliveryDate = () => {
        while (
          cutDay.includes(weekDays[deliveryStartDate.day()]) ||
          holidayDates.includes(deliveryStartDate.format('DD/MM'))
        ) {
          deliveryStartDate = deliveryStartDate.add(1, 'day');
        }
        while (cutDay.includes(weekDays[deliveryEndDate.day()])) {
          deliveryEndDate = deliveryEndDate.add(1, 'day');
        }
      };

      calculateDeliveryDate();
      $orderDeliveryElement
        .find('[data-start-delivery]')
        .html(deliveryStartDate.format(format_day));
      $orderDeliveryElement
        .find('[data-end-delivery]')
        .html(deliveryEndDate.format(format_day));
    }

    inventoryQuantity() {
      const $inventoryElement = this.$container.find('[data-inventory-qty]');
      if ($inventoryElement.length === 0) return;

      let inventoryData = JSON.parse(
        $inventoryElement.attr('data-inventory-qty')
      );
      let { stock, qty, total, min, max, reduce, bgprocess, bgten, id } =
        inventoryData;
      let currentQty = getRandomInt(min, max);

      const updateInventory = () => {
        const percentage = (currentQty / total) * 100;
        const color = currentQty < 10 ? bgten : bgprocess;
        $inventoryElement
          .find('[data-progressbar] > div')
          .css({ width: `${percentage}%`, backgroundColor: color });
        $inventoryElement.find('[data-count]').html(currentQty);
      };

      updateInventory();
      $inventoryElement.show();
    }

    countdown() {
      const $countdownElement = this.$container.find('[data-countdown-pr]');
      if ($countdownElement.length === 0) return;

      const cdOptions = JSON.parse(
        $countdownElement.find('[data-cd-options]').attr('data-cd-options')
      );
      let countdownDate = dayjs();

      if (!cdOptions.isCountdownMeta) {
        const cdTimes = cdOptions.cd_date.split(',');
        let nearestTime;
        cdTimes.forEach((time) => {
          if (
            parseInt(time.replace(/:/g, '')) >=
            parseInt(countdownDate.format('HHmmss'))
          ) {
            nearestTime = time;
          }
        });
        countdownDate = countdownDate.format(`YYYY-MM-DD ${nearestTime}`);
        $countdownElement.attr('data-date', countdownDate);
      }

      $countdownElement.attr('data-countdown-ts', '');
      window.T4SThemeSP.Countdown();
    }
  }

  return {
    init: SalesInteraction,
    ani: animateATC,
  };
})();

//done
var g = (() => {
  const a = {};
  const hosts = {
    shopify: 'shopify',
    external: 'external',
  };
  const productMediaWrapper = '[data-product-single-media-wrapper]';
  const attributes = {
    enableVideoLooping: 'enable-video-looping',
    enableVideoMuting: 'enable-video-muting',
    enableVideoAutoplaying: 'enable-video-autoplaying',
    videoId: 'video-id',
  };

  function initMedia(container, sectionId) {
    if (container) {
      const mediaElement = container.querySelector('iframe, video');
      if (mediaElement) {
        const mediaId = container.getAttribute('data-nt-media-id');
        a[mediaId] = {
          mediaId,
          sectionId,
          host:
            mediaElement.tagName === 'VIDEO' ? hosts.shopify : hosts.external,
          container: container,
          element: mediaElement,
          ready() {
            initializeMedia(this);
          },
        };

        window.Shopify.loadFeatures([
          {
            name: 'video-ui',
            version: '2.0',
            onLoad: enableVideoUI,
          },
        ]);

        window.T4SThemeSP.LibraryLoader.load('plyrShopifyStyles');
      }
    }
  }

  function initializeMedia(mediaObj) {
    if (mediaObj.player) return;

    const container = mediaObj.container.closest(productMediaWrapper);
    const enableLooping =
      container.getAttribute(`data-${attributes.enableVideoLooping}`) ===
      'true';
    const enableMuting =
      container.getAttribute(`data-${attributes.enableVideoMuting}`) === 'true';
    const enableAutoplaying =
      container.getAttribute(`data-${attributes.enableVideoAutoplaying}`) ===
      'true';

    mediaObj.player = new Shopify.Video(mediaObj.element, {
      loop: { active: enableLooping },
      muted: enableMuting,
    });

    container.classList.add('is-media__initialized');

    const pausePlayer = () => {
      if (mediaObj.player) mediaObj.player.pause();
    };

    container.addEventListener('mediaHidden', pausePlayer);
    container.addEventListener('xrLaunch', pausePlayer);
    container.addEventListener('mediaVisible', () => {
      if (!window.T4SThemeSP.isTouch && enableAutoplaying && mediaObj.player) {
        mediaObj.player.play();
      }
    });
  }

  function enableVideoUI(isVideoUIEnabled) {
    if (isVideoUIEnabled) {
      enableNativeVideoControls();
    } else {
      initializeAllVideos();
    }
  }

  function enableNativeVideoControls() {
    for (const mediaId in a) {
      if (a.hasOwnProperty(mediaId)) {
        const mediaObj = a[mediaId];
        if (!mediaObj.nativeVideo && mediaObj.host === hosts.shopify) {
          mediaObj.element.setAttribute('controls', 'controls');
          mediaObj.nativeVideo = true;
        }
      }
    }
  }

  function initializeAllVideos() {
    for (const mediaId in a) {
      if (a.hasOwnProperty(mediaId)) {
        a[mediaId].ready();
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (const mediaId in a) {
      if (a.hasOwnProperty(mediaId)) {
        const mediaObj = a[mediaId];
        if (mediaObj.sectionId === sectionId) {
          if (mediaObj.player) {
            mediaObj.player.destroy();
          }
          delete a[mediaId];
        }
      }
    }
  }

  return {
    init: initMedia,
    hosts,
    loadVideos: initializeAllVideos,
    removeSectionVideos,
  };
})();

//done
var v = (() => {
  const models = {};
  const mediaContainers = {};
  const modelElements = {};

  const selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]',
  };

  function loadModels(event) {
    if (!event) return;
    if (window.ShopifyXR) {
      for (const key in models) {
        if (models[key].loaded) continue;

        const modelJson = document.querySelector(`#ModelJson-${key}`);
        window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
        models[key].loaded = true;
      }
      window.ShopifyXR.setupXRElements();
    } else {
      document.addEventListener('shopify_xr_initialized', loadModels);
    }
  }

  function setupModelViewer(modelObj) {
    if (!modelObj) return;
    if (!modelObj.modelViewerUi) {
      modelObj.modelViewerUi = new Shopify.ModelViewerUI(modelObj.element);
    }

    const { sectionId } = modelObj;
    const container = modelObj.container;

    container.classList.add('is-media__initialized');
    container.addEventListener('mediaVisible', () => {
      const modelData = modelElements[sectionId];
      if (modelData.element) {
        modelData.element.setAttribute(
          'data-shopify-model3d-id',
          modelObj.modelId
        );
      }
      if (!window.T4SThemeSP.isTouch) modelObj.modelViewerUi.play();
    });

    container.addEventListener('mediaHidden', () => {
      const modelData = modelElements[sectionId];
      if (modelData.element) {
        modelData.element.setAttribute(
          'data-shopify-model3d-id',
          modelData.defaultId
        );
      }
      modelObj.modelViewerUi.pause();
    });

    container.addEventListener('xrLaunch', () => {
      modelObj.modelViewerUi.pause();
    });
  }

  return {
    init: (elements, sectionId) => {
      models[sectionId] = { loaded: false };
      elements.forEach((element, index) => {
        const mediaId = element.getAttribute('data-nt-media-id');
        const modelViewer = element.querySelector('model-viewer');
        const modelId = modelViewer.getAttribute('data-model-id');

        if (index === 0) {
          const xrButton = element
            .closest(selectors.mediaGroup)
            .querySelector(selectors.xrButton);
          modelElements[sectionId] = { element: xrButton, defaultId: modelId };
        }

        mediaContainers[mediaId] = {
          modelId,
          sectionId,
          container: element,
          element: modelViewer,
        };
      });

      window.Shopify.loadFeatures([
        { name: 'shopify-xr', version: '1.0', onLoad: loadModels },
        { name: 'model-viewer-ui', version: '1.0', onLoad: setupModelViewer },
      ]);

      window.T4SThemeSP.LibraryLoader.load('modelViewerUiStyles');
    },

    removeSectionModels: (sectionId) => {
      for (const key in mediaContainers) {
        if (
          mediaContainers.hasOwnProperty(key) &&
          mediaContainers[key].sectionId === sectionId
        ) {
          mediaContainers[key].modelViewerUi.destroy();
          delete mediaContainers[key];
        }
      }
      delete models[sectionId];
    },
  };
})();

//done
var y = (() => {
  let isInitialized = false;

  const initialize360 = (elements, index) => {
    const element = elements[0];
    const json360Data = JSON.parse(
      document.querySelector(`#Json360-${index}`).innerHTML
    );
    const { imgArray } = json360Data;

    const minDevicePixelRatio =
      parseFloat(element.getAttribute('data-min')) || 1.194;
    const maxDevicePixelRatio =
      parseFloat(element.getAttribute('data-max')) || 2;
    const devicePixelRatio = Math.min(
      window.devicePixelRatio,
      maxDevicePixelRatio
    );
    const adjustedRatio = Math.max(devicePixelRatio, minDevicePixelRatio);
    const imageWidth = Math.round(element.clientWidth * adjustedRatio);

    json360Data.imgArray = imgArray.map((img) => `${img}&width=${imageWidth}`);

    json360Data.onReady = () => {
      const threeSixtyInstance = window
        .jQuery(element.querySelector('.threesixty'))
        .ThreeSixty(json360Data);
      setupMediaVisibilityEvents(threeSixtyInstance, element);
    };
  };

  const setupMediaVisibilityEvents = (threeSixtyInstance, element) => {
    element.classList.add('is-media__initialized');

    element.addEventListener('mediaVisible', () => {
      if (!window.T4SThemeSP.isTouch) {
        try {
          threeSixtyInstance.play();
          togglePlayButton(element, true);
        } catch (error) {
          console.error(error);
        }
      }
    });

    if (window.jQuery(element).hasClass('is-selected')) {
      threeSixtyInstance.play();
      setTimeout(() => {
        togglePlayButton(element, true);
      }, 50);
    }

    element.addEventListener('mediaHidden', () => {
      threeSixtyInstance.stop();
      togglePlayButton(element, false);
    });
  };

  const togglePlayButton = (element, isPlaying) => {
    const button = window.jQuery(
      element.querySelector(isPlaying ? '.nav_bar_play' : '.nav_bar_stop')
    );
    button
      .removeClass(isPlaying ? 'nav_bar_play' : 'nav_bar_stop')
      .addClass(isPlaying ? 'nav_bar_stop' : 'nav_bar_play');
  };

  return {
    init: (elements, index) => {
      if (isInitialized) {
        initialize360(elements, index);
      } else {
        window.$script(window.T4Sconfigs.script12b, () => {
          initialize360(elements, index);
          isInitialized = true;
        });
      }
    },
  };
})();

//done
var PopupHandler = class {
  static selectors = {
    pickupAvailabilityPopupOpen: '[data-pickup-availability-popup-open]',
    pickupAvailabilityPopupClose: '[data-pickup-availability-popup-close]',
  };

  static popupCloseText = strings.mfp_close;
  static popupLoadingText = strings.mfp_loading;
  static responsesCache = {};

  container = null;
  idPopup = null;
  hasOnlyDefaultVariant = false;
  rootUrl = '';
  variantId = null;

  constructor(eventEmitter, container) {
    this.container = container;
    this.idPopup = container.dataset.idPopup;
    this.hasOnlyDefaultVariant =
      container.dataset.hasOnlyDefaultVariant === 'true';
    this.rootUrl = container.dataset.rootUrl;
    this.variantId = container.dataset.variantId;

    eventEmitter.on('pickupAvailability:update', ({ currentVariant }) => {
      this.updateContent(currentVariant.id);
    });

    eventEmitter.on('pickupAvailability:clear', () => {
      this.clearContent();
    });
  }

  updateContent(variantId = this.variantId) {
    let url = this.rootUrl.endsWith('/') ? this.rootUrl : `${this.rootUrl}/`;
    const fetchUrl = `${url}variants/${variantId}/?section_id=pickup-availability`;
    const cacheKey = `${cacheNameFirst}pickup-availability${variantId}`;
    const openButton = this.container.querySelector(
      PopupHandler.selectors.pickupAvailabilityPopupOpen
    );

    this.container.style.opacity = 0.5;

    if (openButton) {
      openButton.disabled = true;
      openButton.setAttribute('aria-busy', true);
    }

    if (PopupHandler.responsesCache[cacheKey]) {
      this.updateResponse(PopupHandler.responsesCache[cacheKey]);
    } else {
      window.T4SThemeSP.getToFetchSection(null, 'text', fetchUrl).then(
        (response) => {
          if (response !== 'NVT_94') {
            PopupHandler.responsesCache[cacheKey] = response;
            this.updateResponse(response);
          }
        }
      );
    }
  }

  updateResponse(response) {
    if (response.trim()) {
      this.container.text(response);
      this.container.text(this.container.firstElementChild.innerHTML);
      this.container.style.opacity = 1;

      const openButton = this.container.find(
        PopupHandler.selectors.pickupAvailabilityPopupOpen
      );
      if (openButton) {
        this.container.find('#pickupAvailabilityPopup').id = this.idPopup;
        openButton.on('click', this._onClickModalOpen);
      }
    }
  }

  clearContent() {
    this.container.text('');
  }

  _onClickModalOpen() {
    window.jQuery.magnificPopupT4s.open({
      items: {
        src: `#${this.idPopup}`,
      },
      type: 'inline',
      removalDelay: 500,
      tClose: PopupHandler.popupCloseText,
      tLoading: PopupHandler.popupLoadingText,
      callbacks: {
        beforeOpen() {
          this.st.mainClass =
            'mfp-move-horizontal pickup-availability_pp_wrapper';
        },
        open: () => {
          $body.trigger('NTpopupInline:offClose');
          $body.trigger('currency:update');

          const closeButton = window.jQuery(
            `#${this.idPopup} ${PopupHandler.selectors.pickupAvailabilityPopupClose}`
          );
          if (closeButton) {
            closeButton.remove('click', this._onClickModalClose);
            closeButton.on('click', this._onClickModalClose);
          }
        },
        beforeClose: () => {
          console.log('beforeClose');
        },
        close: () => {
          console.log('close');
        },
        afterClose: () => {
          $body.trigger('NTpopupInline:onClose');
        },
      },
    });
  }

  _onClickModalClose() {
    window.jQuery.magnificPopupT4s.close();
  }
};

//done
var StickyAddToCart = class {
  static selectors = {
    actionInfoClose: '[data-action-info-close]',
    actionAtc: '[data-action-atc]',
    quantityWrapper: '[data-quantity-wrapper]',
    quantityValue: '[data-quantity-value]',
    stickyAtcProduct: '.sticky-atc__product',
    backToTop: '#backToTop',
    stickyAddToCart: '[data-sticky-addtocart]',
    stickyTitle: '[data-sticky-v-title]',
    actionDelay: 'data-action-delay',
  };

  static classes = {
    isShown: 'is--shown',
    isActive: 'sticky-is--active',
    isHiddenMobile: 'is-hidden--mobile',
    show: 'is--show',
  };

  static clickStickyTrigger = 'click.sticky';

  container = null;
  closeButton = null;
  scrollTimeout = null;
  stickyElement = null;
  previousHeight = 0;
  offsetBottom = 0;
  isSecondVariant = false;

  constructor(element, container, isSecondVariant) {
    if (!element[0]) return;

    this.isSecondVariant = container === '2';
    this.offsetBottom = element.offset().top + element.outerHeight();
    this.init(element, isSecondVariant);
  }

  init(element, isSecondVariant) {
    this.stickyElement = element;
    this._updateContent();

    this.closeButton = this.container.find(
      StickyAddToCart.selectors.actionInfoClose
    );

    SalesInteraction.ani(StickyAddToCart.selectors.actionInfoClose);
    this._stickyAddToCartToggle();
    if (!this.isSecondVariant) {
      this.container.addClass(StickyAddToCart.classes.show);
      $body.addClass(StickyAddToCart.classes.isActive);
    }

    this.setUpScrollListener(isSecondVariant);
    this.setUpStickyToggle();
    this.setUpResizeListener();
  }

  setUpStickyToggle() {
    const stickyAtcProduct = this.container.find(
      StickyAddToCart.selectors.stickyAtcProduct
    );
    const addToCartButton = this.container.find(
      StickyAddToCart.selectors.actionAtc
    );
    let isDelayedAction = true;

    this.container
      .find(
        `${StickyAddToCart.selectors.actionAtc}[${StickyAddToCart.selectors.actionDelay}]`
      )
      .on(StickyAddToCart.clickStickyTrigger, (event) => {
        if (
          !window
            .jQuery(event.currentTarget)[0]
            .hasAttribute(`${StickyAddToCart.selectors.actionDelay}`) ||
          $window.width() > 767
        )
          return;

        event.preventDefault();
        event.stopPropagation();

        stickyAtcProduct.slideDown({
          start: (e) => {
            window.jQuery(e.currentTarget).css({ display: 'flex' });
            addToCartButton.removeAttr(
              `${StickyAddToCart.selectors.actionDelay}`
            );
            window
              .jQuery(StickyAddToCart.selectors.backToTop)
              .removeClass(StickyAddToCart.classes.show);
          },
          complete: () => {
            this.updateStickyHeight();
            window
              .jQuery(StickyAddToCart.selectors.backToTop)
              .addClass(StickyAddToCart.classes.show);
          },
        });
      });

    this.closeButton.on(StickyAddToCart.clickStickyTrigger, (e) => {
      if (!isDelayedAction || $window.width() > 767) return;

      e.preventDefault();
      isDelayedAction = false;

      stickyAtcProduct.slideUp({
        start: () => {
          addToCartButton.attr(StickyAddToCart.selectors.actionDelay, '');
          window
            .jQuery(StickyAddToCart.selectors.backToTop)
            .removeClass(StickyAddToCart.classes.show);
        },
        complete: () => {
          this.updateStickyHeight();
          window
            .jQuery(StickyAddToCart.selectors.backToTop)
            .addClass(StickyAddToCart.classes.show);
        },
      });
    });
  }

  setUpScrollListener(isSecondVariant) {
    $window.scroll(() => {
      this.scrollTimeout && clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this._stickyAddToCartToggle(this.isSecondVariant);
      });
    });

    const quantityInput = this.container.find(
      `${StickyAddToCart.selectors.quantityWrapper} ${StickyAddToCart.selectors.quantityValue}`
    );
    const quantityValueInput = element.find(
      StickyAddToCart.selectors.quantityValue
    );

    quantityInput.change('change', () => {
      quantityValueInput.val(quantityInput.value);
    });

    quantityValueInput.on('change', () => {
      quantityInput.val(quantityValueInput.value);
    });

    if (!isSecondVariant) {
      this.container
        .find(StickyAddToCart.selectors.stickyTitle)
        .on(StickyAddToCart.clickStickyTrigger, (event) => {
          event.preventDefault();
          window.jQuery('html, body').animate({
            scrollTop: this.container.offset().top - 100,
          });
          this.closeButton.trigger(StickyAddToCart.clickStickyTrigger);
        });
    }
  }

  setUpResizeListener() {
    $window.on('resize.sticky', () => {
      this.updateStickyHeight();
    });
  }

  _stickyAddToCartToggle(isVariant) {
    const scrollPosition = $window.scrollTop();
    const windowHeight = $window.height();
    const documentHeight = $document.height();
    const pos = parseInt(scrollPosition + windowHeight) + 60;

    if (offsetBottom < scrollPosition && pos < documentHeight) {
      this.container.addClass(StickyAddToCart.classes.isShown);
      $body.addClass(StickyAddToCart.classes.isActive);
      this.updateStickyHeight();
    } else if (
      pos >= documentHeight ||
      (offsetBottom > scrollPosition && isVariant)
    ) {
      this.container.removeClass(StickyAddToCart.classes.isShown);
      $body.removeClass(StickyAddToCart.classes.isActive);
      this.container.find('[data-dropdown-open].is--clicked').click();
      this.closeButton.trigger(StickyAddToCart.clickStickyTrigger);
    }
  }

  _updateContent() {
    const templateHtml = window.jQuery('#sticky-atc-temp').html();
    window.T4SThemeSP.$appendComponent.after(templateHtml);
    this.container = window.jQuery(StickyAddToCart.selectors.stickyAddToCart);
  }

  updateStickyHeight() {
    const currentHeight = this.container.outerHeight();
    if (this.previousHeight !== currentHeight) {
      this.previousHeight = currentHeight;
      this.container.css({ '--stickyATC-height': `${currentHeight}px` });
    }
  }
};

//doubt
window.T4SThemeSP.Product = (function () {
  const PRODUCT_FEATURED_DATA_ATTR = 'data-product-featured';
  const isRemoveUnavailable = !$html.hasClass('is-remove-unavai-0');
  const isPswdDisabled = 'is-pswp-disable';
  const VARIANT_IMAGE_SELECTOR = '.color-mode__variant_image .is--first-color';
  const MAIN_MEDIA_SELECTOR = '[data-main-media]';
  const PICKUP_AVAILABILITY_CONTAINER_SELECTOR =
    '[data-pickup-availability-container]';
  const T4S_CONFIGS = window.T4Sconfigs;
  const T4S_PRODUCT_STRINGS = window.T4SProductStrings;
  const NOW_TIMESTAMP = T4S_CONFIGS.nowTimestamp;
  const NEW_DAY_INT = T4S_CONFIGS.new_day_int;
  const USE_SALE_BADGE = T4S_CONFIGS.use_sale_badge;
  const SALE_BADGE_STYLE = T4S_CONFIGS.label_sale_style;
  const USE_PREORDER_BADGE = T4S_CONFIGS.use_preorder_badge;
  const USE_NEW_BADGE = T4S_CONFIGS.use_new_badge;
  const USE_SOLDOUT_BADGE = T4S_CONFIGS.use_soldout_badge;
  const USE_CUSTOM_BADGE = T4S_CONFIGS.use_custom_badge;
  const BADGE_TEXTS = {
    sale: T4S_PRODUCT_STRINGS.badgeSale,
    new: T4S_PRODUCT_STRINGS.badgeNew,
    preOrder: T4S_PRODUCT_STRINGS.badgepreOrder,
    soldout: T4S_PRODUCT_STRINGS.badgeSoldout,
    SavePercent: T4S_PRODUCT_STRINGS.badgeSavePercent,
  };
  const BADGE_CONFIG = {
    texts: BADGE_TEXTS,
    saleStyle: SALE_BADGE_STYLE,
  };

  let u, f;

  return class {
    constructor(container) {
      this.$container = window.jQuery(container);

      if (this.$container.is('[data-product-options]')) {
        this._itemQuickShopInline();
        return;
      }

      this.productConfigs = this.getProductConfigs();
      this.productID = this.productConfigs.id;
      this.container = container;
      this.$mainMedia = this.$container.find(MAIN_MEDIA_SELECTOR);
      this.mainMedia = this.$mainMedia[0];
      this.sectionId = this.productConfigs.sectionId;
      this.disableSwatch = this.productConfigs.disableSwatch;
      this.isSticky = this.productConfigs.isSticky;
      this.isStickyMB = this.productConfigs.isStickyMB;
      this.stickyShow = this.productConfigs.stickyShow;
      this.useStickySelect = this.productConfigs.useStickySelect;
      this.$shortDes = this.$container.find('[data-des-height]');
      this.eventHandlers = {};

      this.initializeProduct();
      this.$container = container;
      this.productConfigs = {};
      this.Variants = null; // To be initialized later
      this.init();
    }

    getProductConfigs() {
      return JSON.parse(
        this.$container.attr(PRODUCT_FEATURED_DATA_ATTR) || '{}'
      );
    }

    _initBootSales() {
      this.BootSales = new SalesInteraction.init(this.$container);
    }

    _initNotifyBackinStock() {
      const notifyStockElement = this.$container.find('.product-notify-stock');
      const notifyStockButton = this.$container.find('[data-notify-stock-btn]');

      if (notifyStockElement[0] || notifyStockButton[0]) {
        if (notifyStockElement[0]) {
          this.$container.on('notifyBackInStock:show', (event) => {
            const notifyForm = window.$(
              `#ContactFormNotifyStock${this.productID}`
            );
            notifyStockElement.show();

            const productInfo = `${event.currentVariant.name.replace(
              '- ',
              '( '
            )} ) ${this.productConfigs.orgUrl}?variants=${
              event.currentVariant.id
            }`;
            notifyForm.find('[name="contact[product]"]').text(productInfo);
          });

          this.$container.on('notifyBackInStock:hide', () => {
            notifyStockElement.hide();
          });
        } else {
          const buttonElement = this.$container.find('[data-notify-stock-btn]');
          let rootUrl = buttonElement.data('root-url');
          let notifyUrl = '';

          // Ensure root URL ends with a slash
          rootUrl = rootUrl.endsWith('/') ? rootUrl : `${rootUrl}/`;

          notifyUrl = `${rootUrl}variants/${buttonElement.data(
            'variant-id'
          )}/?section_id=back-in-stock`;

          buttonElement
            .attr('data-mfp-src', notifyUrl)
            .hide()
            .removeClass('d-none');

          if (
            !this.productConfigs.available &&
            this.productConfigs.disableSwatch
          ) {
            buttonElement.show();
            return;
          }

          this.$container.on('notifyBackInStock:show', (event) => {
            notifyUrl = `${rootUrl}variants/${event.currentVariant.id}/?section_id=back-in-stock`;
            buttonElement
              .attr({
                'data-mfp-src': notifyUrl,
                'data-storageid': `notify-stock${event.currentVariant.id}`,
              })
              .show();
          });

          this.$container.on('notifyBackInStock:hide', () => {
            buttonElement.hide();
          });
        }
      }
    }

    initializeProduct() {
      this._createBadgesProduct();
      this._initBootSales();
      this._initSubmit();

      if (!this.productConfigs.id) return;

      this.$variantImg = this.$container.find(VARIANT_IMAGE_SELECTOR);
      this.disableVariantImage = !this.$variantImg[0];
      this.$formSelectorId = this.$container.find(this.productConfigs.formID);
      this.$formSelectorIdLength = this.$formSelectorId.length;
      this.pickupAvailabilityContainer = this.$container.find(
        PICKUP_AVAILABILITY_CONTAINER_SELECTOR
      )[0];
      if (this.pickupAvailabilityContainer && this.$formSelectorIdLength > 0) {
        this._initPickupAvailability();
        if (this.disableSwatch) this.pickupAvailability.updateContent();
      }

      this._initNotifyBackinStock();
      this.adjustStickySettings();

      if (!this.disableSwatch && this.$formSelectorIdLength > 0) {
        this.initializeSwatches();
      }

      this._initVariants();
      this._swatchesEventListeners();
      this._changeMediaSlider();

      if (!this.disableVariantImage) {
        this._updateVariantImageSwatchFirst();
      }

      this.setupMediaAndOverflowScroller();
    }

    _updateVariantImageSwatchFirst() {
      const { Variants, colorOptionIndex, $variantImgItems, swatchWidth } =
        this;
      const variants = Variants.variants;
      const variantsCount = variants.length;

      $variantImgItems.each((_, element) => {
        const $swatch = window.$(element);

        // Function to find the featured image for a given color option
        const getFeaturedImage = (colorValue) => {
          const lowerCaseColor = (colorValue + '').toLowerCase();

          for (let i = 0; i < variantsCount; i++) {
            const variant = variants[i];
            if (
              variant.featured_image &&
              (variant.options[colorOptionIndex] + '').toLowerCase() ===
                lowerCaseColor
            ) {
              return variant.featured_image;
            }
          }
          return null;
        };

        // Get the featured image for the swatch
        const featuredImage = getFeaturedImage($swatch.data('value'));

        if (!featuredImage) return;

        // Update the swatch with the new image URL
        const $imageElement = $swatch.find('[data-img-el]');
        const $targetElement = $imageElement[0] ? $imageElement : $swatch;

        $targetElement.attr(
          'data-bg',
          window.T4SThemeSP.Images.getNewImageUrl(
            featuredImage.src,
            swatchWidth
          )
        );
      });
    }

    _changeMediaSlider() {
      if (
        this.PrOptionsSize &&
        this.productConfigs.changeVariantByImg &&
        this.$container.find(
          '.flickity[data-main-media] .product__media-item--variant'
        ).length
      ) {
        this.$container
          .find('.flickity[data-main-media]')
          .off('select.flickity')
          .on('select.flickity', (event, selectedIndex) => {
            const element = window.$(event.target.currentTarget);
            element.trigger('select.carousel');
            const selectedSlide = element
              .find('.flickity-slider>[data-main-slide]')
              .eq(selectedIndex);
            if (
              selectedSlide.hasClass('product__media-item--variant') &&
              !this.Variants.eventClickedSwatch
            ) {
              const mediaId = selectedSlide.data('media-id');
              const currentOption = this.$originalSelectorId.val();
              const newOption = this.$originalSelectorId
                .find(`option[data-mdid="${mediaId}"]:not(:disabled)`)
                .val();
              if (
                newOption !== undefined &&
                currentOption !== newOption &&
                !this.Variants.isNoPick &&
                this.Variants.mediaID !== mediaId
              ) {
                this.$originalSelectorId.val(newOption);
                this.$originalSelectorId[0].dispatchEvent(
                  new Event('change', {
                    bubbles: true,
                    cancelable: true,
                  })
                );
              }
            }
          });
      }
    }

    adjustStickySettings() {
      if (isMobile && !this.isStickyMB) {
        this.isSticky = false;
      }

      if (this.isSticky) {
        this._initStickyAddToCart();
      }
    }

    initializeSwatches() {
      this.$originalSelectorId = this.$formSelectorId.find('select[name="id"]');
      this.$options1 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="0"]'
      );
      this.$options2 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="1"]'
      );
      this.$options3 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="2"]'
      );

      if (!this.disableVariantImage) {
        this.$variantImgItems = this.$variantImg.find('[data-swatch-item]');
        this.colorOptionIndex = this.$variantImg.data('id');
        this.swatchWidth = 2 * this.$variantImgItems.outerWidth();
      }
    }

    setupMediaAndOverflowScroller() {
      if (this.mainMedia) {
        this._initProductIsotope();
        setTimeout(() => {
          if (this.mainMedia) this._initLoadContent();
          setTimeout(() => {
            this.initializeMediaLibraries();
            this.setupOverflowScroller();
          }, 100);
        }, 1000);

        if (this.productConfigs.main_click != 'none' && this.mainMedia) {
          if (
            (window.T4SThemeSP.isTouch &&
              this.productConfigs.enable_zoom_click_mb) ||
            (window.T4SThemeSP.isHover &&
              'pswp' == this.productConfigs.main_click)
          ) {
            const continer = this.$mainMedia.find('.' + isPswdDisabled);
            continer.removeClass(isPswdDisabled);
            window.T4SThemeSP.isTouch &&
              this.productConfigs.enable_zoom_click_mb &&
              windowWidth > 1024 &&
              document.addEventListener('theme:hover', (t) => {
                continer.addClass(isPswdDisabled);
              });
          }
          this.setupShortDescription();
        }
      }
    }

    _initProductIsotope() {
      if (!isMobile && this.productConfigs.hasIsotope) {
        updateMediaSizes(this.$mainMedia);
        window.T4SThemeSP.Isotopet4s.init(this.$mainMedia);
        $window.on('resize.prIstope', () => {
          $window.width() < 768 && this.$mainMedia.hasClass('isotope-enabled')
            ? this.$mainMedia.isotope('destroy').removeClass('isotope-enabled')
            : $window.width() >= 768 &&
              !this.$mainMedia.hasClass('isotope-enabled') &&
              setTimeout(() => {
                window.T4SThemeSP.Isotopet4s.init(this.$mainMedia);
              }, 500);
        });
      }
    }

    initializeMediaLibraries() {
      this._initProductVideo();
      this._initModelViewerLibraries();
      this._initShopifyXrLaunch();
      this._init360ViewerLibraries();
    }

    _initModelViewerLibraries() {
      const model = this.mainMedia.querySelectorAll(
        '[data-media-type="model"]'
      );
      model.length < 1 || v.init(model, this.sectionId);
    }

    _initShopifyXrLaunch() {
      this.eventHandlers.initShopifyXrLaunchHandler =
        this._initShopifyXrLaunchHandler.bind(this);
      document.addEventListener(
        'shopify_xr_launch',
        this.eventHandlers.initShopifyXrLaunchHandler
      );
    }

    _init360ViewerLibraries() {
      const model = this.mainMedia.querySelectorAll('[data-media-type="360"]');
      model.length < 1 || y.init(model, this.sectionId);
    }

    _initShopifyXrLaunchHandler() {
      this.mainMedia
        .querySelector('[data-product-single-media-wrapper]')
        .dispatchEvent(
          new CustomEvent('xrLaunch', {
            bubbles: true,
            cancelable: true,
          })
        );
    }

    setupOverflowScroller() {
      const stickyInfoContainer = this.container.querySelector(
        '.product__info-container--sticky'
      );
      if (stickyInfoContainer && this.productConfigs.infoOverflowScroller) {
        this.infoOverflowScroller = new window.T4SThemeSP.OverflowScroller(
          stickyInfoContainer,
          {
            offsetTop: 109,
            offsetBottom: 30,
            updateOffsetTop: true,
          }
        );
      }
    }

    setupShortDescription() {
      if (this.$shortDes) {
        this.$shortDes.each((index, element) => {
          window
            .jQuery(element)
            .parent()
            .css('--full-h', window.jQuery(element).height() + 'px');
        });

        this.$shortDes.on('click', function () {
          window
            .jQuery(this)
            .parent()
            .css('--full-h', window.jQuery(this).height() + 'px');
        });
      }
    }
    init() {
      this._itemQuickShopInline();
      this._initSubmit();
      this._initProductVideo();
      this._initLoadContent();
      this._initPickupAvailability();
      this._createBadgesProduct();
      this._initStickyAddToCart();
    }

    _itemQuickShopInline() {
      this.$qsInline = this.$container.find('[data-qs-inl]');
      this.$formSelectorId = this.$qsInline.find('form');
      this.$originalSelectorId = this.$formSelectorId.find('select[name="id"]');
      this.$options1 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="0"]'
      );
      this.$options2 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="1"]'
      );
      this.$options3 = this.$formSelectorId.find(
        '[data-swatch-option][data-id="2"]'
      );
      this.productConfigs = this._parseProductConfig(
        this.$originalSelectorId.attr('data-product-featured')
      );
      this.productID = this.productConfigs.id;
      this.$variantImg = this.$qsInline.find(VARIANT_IMAGE_SELECTOR);
      this.disableVariantImage = !this.$variantImg[0];
      if (!this.disableVariantImage) {
        this.$variantImgItems = this.$variantImg.find('[data-swatch-item]');
        this.colorOptionIndex = this.$variantImg.data('id');
        this.swatchWidth = 2 * this.$variantImgItems.outerWidth();
      }
      this._initVariants();
      this._swatchesEventListeners();
      this._initSubmit();
      if (!this.disableVariantImage) {
        this._updateVariantImageSwatchFirst();
      }
    }

    _parseProductConfig($originalSelectorId) {
      return JSON.parse($originalSelectorId);
    }

    _initVariants() {
      const productConfigs = this.productConfigs;

      // Check if the product is grouped
      if (productConfigs.isGrouped) {
        productConfigs.isGrouped =
          this.$container.find('form[data-groups-pr-form]').length > 0;
      }

      if (!productConfigs.isGrouped) {
        let variants, options;

        // If the product's data already exists, reuse it
        if (u[this.productID]) {
          variants = u[this.productID];
          options = f[this.productID];
          this.PrOptionsSize = options.length;
        } else {
          try {
            // Parse variants JSON
            variants = JSON.parse(
              this.$container.find('.pr_variants_json').html()
            );

            // Map additional data to each variant
            this.$originalSelectorId.find('> option').each((index, element) => {
              const option = $(element);
              variants[index] = {
                ...variants[index],
                incoming: option.data('incoming'),
                nextIncomingDate: option.data('nextincomingdate') || null,
                inventoryPolicy: option.data('inventorypolicy') || null,
                inventoryQuantity: option.data('inventoryquantity') || null,
              };
            });

            // Cache variants and options data
            u[this.productID] = variants;
            options = JSON.parse(
              this.$container.find('.pr_options_json').html()
            );
            f[this.productID] = options;
            this.PrOptionsSize = options.length;
          } catch (error) {
            console.log('Error parsing variants or options JSON:', error);
            return;
          }
        }

        // Set default value for `unQuickShopInline`
        if (typeof productConfigs.unQuickShopInline !== 'boolean') {
          productConfigs.unQuickShopInline = true;
        }

        // Configuration for the Variants class
        const variantConfig = {
          enableHistoryState: productConfigs.enableHistoryState || false,
          $container: this.$container,
          formSelectorId: this.$formSelectorId,
          $originalSelectorId: this.$originalSelectorId,
          $options1: this.$options1,
          $options2: this.$options2,
          $options3: this.$options3,
          variants,
          productOptions: options,
          PrOptionsSize: this.PrOptionsSize,
          removeSoldout: productConfigs.removeSoldout,
          isNoPick: productConfigs.isNoPick,
          hasSoldoutUnavailable: productConfigs.hasSoldoutUnavailable,
          canMediaGroup: productConfigs.canMediaGroup,
          isMainProduct: productConfigs.isMainProduct,
          oldVariant: {},
          badgesConfigs: BADGE_CONFIG,
          $variantImg: this.$variantImg,
          disableVariantImage: this.disableVariantImage,
          swatchWidth: this.swatchWidth,
          isSticky: this.isSticky,
          useStickySelect: this.useStickySelect,
          showFirstMedia: productConfigs.showFirstMedia,
          unQuickShopInline: productConfigs.unQuickShopInline,
          isQuickShopForm: productConfigs.isQuickShopForm,
        };

        // Initialize the Variants class with the configuration
        this.Variants = new h(variantConfig);
      }
    }

    _getVariantsData(productID) {
      // Logic to get variants data
      // You can fetch or calculate variants here based on your data structure
      // Return an object with variants and productOptions
      return {
        variants: [],
        productOptions: [],
        PrOptionsSize: 0,
      };
    }

    _swatchesEventListeners() {
      if (this.PrOptionsSize) {
        let variantId, currentVariant, optionIndex;
        let firstInteraction = true;
        const isFormT4sPrItem = this.$formSelectorId.hasClass('is-form-pritem');

        // Add event listener for swatch item clicks
        this.$formSelectorId.on(
          'click',
          '[data-swatch-item]:not(.is--selected)',
          (event) => {
            event.preventDefault();
            const swatchItem = window.$(event.target.currentTarget);

            // Mark the clicked swatch as selected and update the UI
            swatchItem
              .addClass('is--selected')
              .siblings()
              .removeClass('is--selected');
            swatchItem
              .closest('[data-swatch-option]')
              .find('[data-current-value]')
              .html(swatchItem.data('value'));

            // Show hidden options if this is the first interaction
            if (isFormT4sPrItem && firstInteraction) {
              this.$formSelectorId.addClass('product-swatched');
              this.$formSelectorId
                .find(
                  '[data-swatch-option][data-id="0"] [data-swatch-name], [data-swatch-option][data-id="1"], [data-swatch-option][data-id="2"]'
                )
                .show(150);
              firstInteraction = false;
            }

            // Update selected swatch data in the Variants object
            this.Variants.clickedCurrentValue = `${swatchItem.data('value')}`;
            optionIndex = swatchItem.closest('[data-swatch-option]').data('id');
            this.Variants.clickedCurrentIndex = `option${++optionIndex}`;

            // Handle incomplete option selections
            if (
              this.$formSelectorId.find('.is--selected').length <
                this.PrOptionsSize &&
              this.Variants.isNoPick
            ) {
              this.Variants._updateMediaFilterNoPick();
              this.Variants._updateMediaFirst(swatchItem);
              return;
            }

            // Update clicked options in the Variants object
            this.Variants.eventClickedSwatch = true;
            this.Variants.clickedOptions = [];
            this.$formSelectorId
              .find('[data-swatch-option] .is--selected')
              .each((index, element) => {
                this.Variants.clickedOptions.push({
                  value: `${window.$(element).data('value')}`,
                  index: `option${index + 1}`,
                });
              });

            // Handle the "No Pick" state
            if (!this.Variants.isNoPick) {
              this.Variants.oldVariant = this.Variants.currentVariant;
            } else {
              $body.trigger('hide.ts.notices');
              if (this.isSticky) {
                window.$('[data-sticky-addtocart]').removeAttr('hidden');
              }
              this.Variants.isNoPick = false;
              this.$container.trigger('replace:btnAtc');
            }

            // Fetch the new variant based on selected options
            currentVariant = this.Variants._getVariantFromOptions();
            this.$originalSelectorId.val(currentVariant.id);
            variantId = this.$originalSelectorId.val();

            // Handle size-based variant selection fallback
            if (
              isRemoveUnavailable &&
              (variantId === null || variantId === '')
            ) {
              currentVariant = this.Variants._getVariantFromSize();
              this.$originalSelectorId.val(currentVariant.id);
              variantId = this.$originalSelectorId.val();
            }

            // Update the current variant in the Variants object
            this.Variants.currentVariant = currentVariant;

            // Trigger the "change" event on the original selector
            this.$originalSelectorId[0].dispatchEvent(
              new Event('change', {
                bubbles: true,
                cancelable: true,
              })
            );
          }
        );
      }
    }

    _handleSwatchSelection(selectedSwatch, $originalSelectorId) {
      const $selected = window.jQuery(selectedSwatch);
      $selected.addClass('is--selected').siblings().removeClass('is--selected');

      // More logic to handle swatch selection
      // This will include updating variants based on the selected swatch
    }

    _initSubmit() {
      $document.trigger({
        type: 'submitAtc:t4s',
        $container: this.$container,
      });
    }

    _initProductVideo() {
      const videos = this.$container.querySelectorAll(
        '[data-media-type="video"], [data-media-type="external_video"]'
      );
      videos.forEach((video) => g.init(video, this.productID));
    }

    _initLoadContent() {
      const deferredMedia = this.$container.querySelectorAll(
        '[data-deferred-media]'
      );
      deferredMedia.forEach((media) => {
        media.classList.add('is--adding');
        this.loadContent(media.querySelector('.pr'));
      });
    }

    loadContent(mediaElement) {
      if (mediaElement.getAttribute('loaded')) return;
      const divElement = document.createElement('div');
      const template = mediaElement.querySelector('template');
      divElement.appendChild(
        template.content.firstElementChild.cloneNode(true)
      );
      mediaElement.setAttribute('loaded', true);
      mediaElement.appendChild(
        divElement.querySelector('video, model-viewer, iframe')
      );
      template.remove();
    }

    _initPickupAvailability() {
      this.pickupAvailability = new PickupAvailability(
        this.$container,
        this.pickupAvailabilityContainer
      );
    }

    _createBadgesProduct() {
      const badgesContainer = this.$container.find(
        '[data-product-single-badge]'
      );
      const sortOrder = (badgesContainer.attr('data-sort') || '')
        .replace(/ /g, '')
        .split(',');
      const badgesMarkup = this._generateBadgesMarkup(sortOrder);

      badgesContainer.html(badgesMarkup);
    }

    _generateBadgesMarkup(sortOrder) {
      const {
        compare_at_price,
        price,
        available,
        isPreorder,
        dateStart,
        customBadge,
        customBadgeHandle,
      } = this.productConfigs;
      let badges = '';

      sortOrder.forEach((type) => {
        switch (type) {
          case 'sale':
            if (!USE_SALE_BADGE) break;

            if (compare_at_price <= price) {
              badges += `<span data-badge-sale class="badge-item badge-sale"></span>`;
              break;
            }
            let finalPrice;
            if (SALE_BADGE_STYLE == '2') {
              const o = (100 * (compare_at_price - price)) / compare_at_price;
              finalPrice = BADGE_TEXTS.SavePercent.replace(
                '[sale]',
                Math.round(o)
              );
            } else if (SALE_BADGE_STYLE == '3') {
              const r = compare_at_price - price;
              finalPrice = window.T4SThemeSP.Currency.formatMoney(r);
            } else {
              finalPrice = BADGE_TEXTS[type];
            }
            badges += `<span data-badge-sale class="badge-item badge-sale">${finalPrice}</span>`;
            break;
          case 'preOrder':
            if (USE_PREORDER_BADGE) {
              badges += `<span data-badge-preorder class="badge-item badge-preorder" ${
                isPreorder ? '' : ' hidden'
              }>${BADGE_TEXTS[type]}</span>`;
            }
            break;
          case 'new':
            const date = NOW_TIMESTAMP - dateStart;
            const hr = Math.floor(Math.floor(date / 3600) / 24);
            if (hr >= NEW_DAY_INT || !USE_NEW_BADGE) break;
            badges += `<span class="badge-item badge-new">
                ${BADGE_TEXTS[type]}
              </span>`;
            break;
          case 'soldout':
            if (USE_SOLDOUT_BADGE) {
              badges += `<span data-badge-soldout class="badge-item badge-soldout" ${
                available ? ' hidden' : ''
              }>${BADGE_TEXTS[type]}</span>`;
            }
            break;
          default:
            if (!customBadge || !USE_CUSTOM_BADGE) break;
            customBadge.forEach((badge, index) => {
              badges += `<span class="badge-item badge-custom badge-${customBadgeHandle[index]}">${badge}</span>`;
            });
            break;
        }
      });

      return badges;
    }

    _initStickyAddToCart() {
      this.stickyAddToCart = new StickyAddToCart(
        this.$formSelectorId,
        this.stickyShow,
        this.useStickySelect
      );
    }
  };
})();

//done
window.T4SThemeSP._initProducts = (function () {
  const productAttribute = 'data-product-featured';
  const enabledClass = 'initProducts__enabled';

  return () => {
    window
      .jQuery(`[${productAttribute}]:not(.${enabledClass})`)
      .each((_, product) => {
        window.jQuery(product).addClass(enabledClass);
        new window.T4SThemeSP.Product(product);
      });
  };
})();

//done
window.T4SThemeSP._initBundlePrs = (function () {
  const productAttribute = 'data-product-bundles';
  const enabledClass = 'initBundles__enabled';
  const hoverPinClass = 'has--hover-pin';
  const hoverClass = 'is--hover';
  const triggerHoverClass = 'is--trigger-hover';

  const initBundles = () => {
    const bundles = window.jQuery(
      `[${productAttribute}]:not(.${enabledClass})`
    );

    bundles.each((_, bundle) => {
      const bundleElement = bundle;
      bundleElement.addClass(enabledClass);

      SalesInteraction.ani(bundleElement.querySelector('[data-atc-form]'));

      const handleHoverIntent = (element) => {
        if (window.T4SThemeSP.isTouch || element.length === 0) return;

        const bundleForm = element.find('[data-bundles-pr-form]');
        const bundleImage = element.find('[data-bundle-image]');

        element.hoverIntent(element, {
          selector: '[data-bundle-pin]',
          sensitivity: 6,
          interval: 40,
          timeout: 40,
          over: (event) => {
            const $element = window.jQuery(event.currentTarget);
            bundleImage.addClass(hoverPinClass);
            bundleForm.addClass(hoverPinClass);
            $element.addClass(hoverClass);
            window.jQuery($element.data('trigger')).addClass(triggerHoverClass);
          },
          out: () => {
            bundleImage.removeClass(hoverPinClass);
            bundleForm.removeClass(hoverPinClass);
            bundleImage.find(`.${hoverClass}`).removeClass(hoverClass);
            bundleForm
              .find(`.${triggerHoverClass}`)
              .removeClass(triggerHoverClass);
          },
        });
      };

      handleHoverIntent(bundleElement);
    });
  };

  return initBundles;
})();

//done
window.T4SThemeSP.Cookies = (() => {
  function testCookie() {
    document.cookie = 'testcookie';
    const isCookieSet = document.cookie.includes('testcookie');
    // Clean up the test cookie
    document.cookie =
      'testcookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return isCookieSet;
  }
  const checkCookiesEnabled = () => {
    const cookiesEnabled = navigator.cookieEnabled || testCookie();

    if (!cookiesEnabled) {
      $html.classList.add('not--cookies');
    }
  };

  return checkCookiesEnabled;
})();

//doubt
window.T4SThemeSP.isVisible = (
  elements,
  checkBounds,
  checkCondition,
  visibilityType = 'both',
  referenceElement
) => {
  if (elements.length < 1) return false;

  const reference = referenceElement
    ? window.jQuery(referenceElement)
    : $window;
  const refPosition = referenceElement
    ? reference.position()
    : { top: 0, left: 0 };
  const targetElement = elements.length > 1 ? elements.eq(0) : elements.get(0);

  const isConditionMet =
    checkCondition !== true ||
    targetElement.offsetWidth * targetElement.offsetHeight;
  const targetRect = targetElement.getBoundingClientRect();

  //doubt
  const isInsideViewport = () => {
    const isVisibleVertically =
      targetRect.top >= refPosition.top &&
      targetRect.bottom <= refPosition.top + reference.outerHeight();
    const isVisibleHorizontally =
      targetRect.left >= refPosition.left &&
      targetRect.right <= refPosition.left + reference.outerWidth();

    return {
      vertical: isVisibleVertically,
      horizontal: isVisibleHorizontally,
    };
  };

  const visibility = isInsideViewport(checkBounds);
  const isFullyVisible = visibility.vertical && visibility.horizontal;

  if (visibilityType === 'both') return isConditionMet && isFullyVisible;
  if (visibilityType === 'vertical')
    return isConditionMet && visibility.vertical;
  if (visibilityType === 'horizontal')
    return isConditionMet && visibility.horizontal;

  return false;
};

//done
window.T4SThemeSP.Tabs = (() => {
  const ENABLED_CLASS = 'tabs-enabled';
  const SIMPLE_ENABLED_CLASS = 'tabs-simple-enabled';
  const ACCORDION_ENABLED_CLASS = 'tabs-accordion-enabled';
  const ACTIVE_CLASS = 'active';
  const ANIMATION_DURATION = 300;
  const COLLAPSE_DURATION = 150;

  return {
    Default() {
      const selector = '[data-ts-tabs]';
      const itemSelector = '[data-ts-tab-ul] [data-ts-tab-item]';
      const tabs = window.jQuery(`${selector}:not(.${ENABLED_CLASS}`);
      if (tabs.length > 0) {
        tabs.addClass(ENABLED_CLASS);
        tabs.on('click', itemSelector, (event) => {
          event.preventDefault();
          const currentTab = window.jQuery(event.currentTarget);
          const tabContainer = currentTab.closest(selector);
          const targetTabId =
            currentTab.attr('href') || currentTab.data('id-tab');
          const targetTab = tabContainer.find(targetTabId);
          const flickityInstance = targetTab.find('.flickity');
          const isotopInstance = targetTab.find('.isotope');

          tabContainer.find(`.${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS);
          tabContainer.find('[data-ts-tab-content]').hide();
          currentTab.addClass(ACTIVE_CLASS);
          targetTab.show().addClass(ACTIVE_CLASS);
          targetTab.closest('[data-ts-tab-wrapper]').addClass(ACTIVE_CLASS);

          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            if (flickityInstance.hasClass('flickity-enabled')) {
              flickityInstance.flickity('resize');
            } else if (isotopInstance.hasClass('isotope-enabled')) {
              isotopInstance.isotope('layout');
            }
          }, 200);
        });
      }
    },
    Simple() {
      const selector = '[data-ts-tabs]';
      const itemSelector = '[data-ts-tab-ul2] [data-ts-tab-item]';
      const tabs = window.jQuery(`${selector}:not(.${SIMPLE_ENABLED_CLASS}`);
      if (tabs.length > 0) {
        tabs.addClass(SIMPLE_ENABLED_CLASS);
        tabs.on('click', itemSelector, (event) => {
          event.preventDefault();
          const currentTab = window.jQuery(event.currentTarget);
          const tabContainer = currentTab.closest(selector);
          const targetTabId =
            currentTab.attr('href') || currentTab.data('id-tab');
          const targetTab = tabContainer.find(targetTabId);

          tabContainer.find(`.${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS);
          currentTab.addClass(ACTIVE_CLASS);
          targetTab.addClass(ACTIVE_CLASS);
          targetTab.closest('[data-ts-tab-wrapper]').addClass(ACTIVE_CLASS);
          targetTab
            .closest('[data-ts-tabs2]')
            .addClass('data-tab-active', targetTabId.replace('#', ''));
          if (currentTab.is('[data-triger-btns-tab]')) {
            targetTab.hasClass('flickity flickity-enabled')
              ? targetTab.trigger('updateBtnTab.flickity')
              : targetTab
                  .find('.flickity.flickity-enabled')
                  .trigger('updateBtnTab.flickity');
          }
        });
      }
    },
    Accordion() {
      const accordionTabs = window.jQuery(
        `[data-ts-tabs]:not(.${ACCORDION_ENABLED_CLASS})`
      );
      if (accordionTabs.length > 0) {
        accordionTabs.addClass(ACCORDION_ENABLED_CLASS);
        window
          .jQuery('.type-accordion, [data-ts-accordion-pr]')
          .find(`.${ACTIVE_CLASS} [data-ts-tab-content]`)
          .css('display', 'block');

        accordionTabs.on(
          'click',
          '[data-ts-tab-wrapper] [data-ts-tab-item]',
          (event) => {
            event.preventDefault();
            const currentTab = window.jQuery(event.currentTarget);
            const tabContainer = currentTab.closest('[data-ts-tabs]');
            const tabList = tabContainer.find('[data-ts-tab-ul]');
            const openTab = tabContainer.find(
              `[data-ts-tab-wrapper]:not([data-no-auto-close]).${ACTIVE_CLASS}`
            );
            const openTabContent = openTab.find('[data-ts-tab-content]');
            const currentTabWrapper = currentTab.closest(
              '[data-ts-tab-wrapper]'
            );
            const currentTabContent = currentTabWrapper.find(
              '[data-ts-tab-content]'
            );
            const section = currentTab.closest('.section');
            const flickityInstance = currentTabContent.find('.flickity');
            const isotopInstance = currentTabContent.find('.isotope');

            if (section.length === 0) {
              section = currentTab.closest('.section, .shopify-section');
            }

            if (currentTabWrapper.hasClass(ACTIVE_CLASS)) {
              tabList.find(`.${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS);
              currentTabWrapper.removeClass(ACTIVE_CLASS);
              currentTabContent
                .slideUp(ANIMATION_DURATION)
                .removeClass(ACTIVE_CLASS);
            } else {
              openTab.removeClass(ACTIVE_CLASS);
              tabList.find(`.${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS);
              currentTabWrapper.addClass(ACTIVE_CLASS);
              tabList
                .find(
                  `a[href="${currentTab.attr(
                    'href'
                  )}"], [data-href="${currentTab.attr('href')}"]`
                )
                .addClass(ACTIVE_CLASS);
              openTabContent
                .slideUp(COLLAPSE_DURATION)
                .removeClass(ACTIVE_CLASS);
              currentTabContent
                .stop(true, true)
                .slideDown(ANIMATION_DURATION, () => {
                  if (flickityInstance.hasClass('flickity-enabled')) {
                    flickityInstance.flickity('resize');
                  } else if (isotopInstance.hasClass('isotope-enabled')) {
                    isotopInstance.isotope('layout');
                  }
                  if (!window.T4SThemeSP.isVisible(currentTab, true)) {
                    const headerHeight =
                      window.jQuery('.section-header').height() || 0;
                    const offsetTop =
                      section.find(`.tab-wrapper.${ACTIVE_CLASS}`).offset()
                        .top -
                      headerHeight -
                      10;
                    window
                      .jQuery('body,html')
                      .animate({ scrollTop: offsetTop });
                  }
                })
                .addClass(ACTIVE_CLASS);
            }
          }
        );
      }
    },
  };
})();

//done
window.T4SThemeSP.RenderRefresh = (() => {
  const updateComponents = (component) => {
    $body.trigger('currency:update');

    const flickityElements = component.find('.flickity');
    const isotopElements = component.find('.isotope');

    // Reinitialize product grid items if present
    if (
      component.find('.products').length > 0 &&
      typeof window.T4SThemeSP.reinitProductGridItem === 'function'
    ) {
      window.T4SThemeSP.reinitProductGridItem();
    }

    // Initialize isotop and flickity if present
    if (isotopElements.length > 0) {
      window.T4SThemeSP.Isotopet4s.init(isotopElements);
    }
    if (flickityElements.length > 0) {
      flickityElements[0].flickityt4s = new window.T4SThemeSP.Carousel(
        flickityElements[0]
      );
    }

    // Call resize observer and initLoadMore if defined
    window.T4SThemeSP.ProductItem.resizeObserver();
    if (window.T4SThemeSP.initLoadMore === 'function') {
      window.T4SThemeSP.initLoadMore();
    }
  };

  return () => {
    const lazyComponents = window.jQuery('[data-render-lazy-component]');
    if (lazyComponents.length > 0) {
      // Process components that have already been lazy-loaded
      window
        .jQuery('[data-render-lazy-component].lazyloaded')
        .each((_, element) => {
          updateComponents(window.jQuery(element));
        });

      // Set up event for components that are about to be lazy-loaded
      lazyComponents.not('.lazyloaded').one('lazyincluded', (event) => {
        const targetComponent = window.jQuery(event.target)[0];
        updateComponents(window.jQuery(targetComponent));
      });

      // Add class to mark components for lazy-loading
      lazyComponents.not('.lazyload').addClass('lazyload');
    }
  };
})();

//done
window.T4SThemeSP.ParallaxInt = function () {
  const parallaxElements = window.jQuery(
    '[data-parallax-true]:not(.parallax_enabled)'
  );

  if (parallaxElements.length > 0) {
    parallaxElements.each((_, elem) => {
      const element = window.jQuery(elem);
      const imgSelector =
        element.attr('data-imgsl') ||
        element.find('.parallax-img:visible').first() ||
        '.parallax-img';

      // Check if the image elements exist or if the background is already lazy-loaded
      if (
        element.find(imgSelector).length > 0 ||
        element.is('.parallax-bg.lazyloaded')
      ) {
        element.addClass('parallax_enabled').Jarallax({
          speed: parseFloat(element.attr('data-speed')) || 0.8,
          imgElement: imgSelector,
        });
      }
    });
  }
};

//done
window.T4SThemeSP.Countdown = (() => {
  const timezone = window.T4Sconfigs.timezone;
  let a = 'nt_guess';

  try {
    a = dayjs.tz.guess();
  } catch(error) {
    console.error(error);
  }
  const initCountdown = () => {
    const countdownElements = window.jQuery(
      '[data-countdown-ts]:not(.countdown-enabled)'
    );

    if (countdownElements.length > 0) {
      countdownElements.each(function () {
        const element = window.jQuery(this);
        const keyIdContent =
          window.jQuery(element.attr('data-keyid')).html() ||
          window.jQuery.trim(element.html()) ||
          '%D days %H:%M:%S';
        const isRefreshOwl = element.is('[data-refresh-owl]');
        let loop = element.data('loop');
        const date = element.data('date');
        const dayLimit = parseInt(element.data('dayl'));
        let currentDate = dayjs();
        let formattedDate = date.replace(/\//g, '').replace(/-/g, '') + '';
        const dateInt = parseInt(formattedDate);
        const dateFormat =
          formattedDate.length < 9 ? 'YYYYMMDD' : 'YYYYMMDDHHmmss';

        // Determine if countdown should loop
        if (
          (dateInt > parseInt(currentDate.format(dateFormat)) ||
            dayLimit < 1) &&
          !loop
        ) {
          loop = false;
        }

        if (loop || loop === 'true') {
          const timePart = dayjs(date).format(' HH:mm:ss');
          const remainingDays =
            dayLimit -
            (currentDate.diff(date.replace(/\//g, '-'), 'days') % dayLimit);
          date =
            (currentDate = currentDate.add(remainingDays, 'day')).format(
              'YYYY/MM/DD'
            ) + timePart;
          element.attr('data-dateloop', date);
        }

        // Start the countdown
        element
          .countdown(
            ((dateToCount) => {
              if (dateToCount) {
                let adjustedDate = dateToCount.replace('24:00:00', '23:59:59');
                if (timezone !== 'not4' && a !== timezone) {
                  try {
                    adjustedDate = dayjs
                      .tz(adjustedDate.replace(/\//g, '-'), timezone)
                      .toDate();
                  } catch {
                    console.log('Timezone error: ' + timezone);
                  }
                } else {
                  adjustedDate = new Date(adjustedDate);
                }
                return adjustedDate;
              }
            })(date),
            {
              elapse: true,
            }
          )
          .on('update.countdown', (event) => {
            if (event.elapsed) {
              element
                .html('')
                .addClass('expired_cd')
                .closest('[data-countdown-wrap]')
                .html('')
                .addClass('expired_cd');
            } else {
              const totalHours =
                24 * event.offset.totalDays + event.offset.hours;
              element.html(
                event.strftime(keyIdContent.replace('[totalHours]', totalHours))
              );
            }
          })
          .addClass('countdown-enabled')
          .closest('[data-countdown-wrap]')
          .addClass('countdown-enabled');

        if (isRefreshOwl) {
          const m = setTimeout(() => {
            element.closest('.flickity-enabled').flickity('resize');
          }, 600);
          clearTimeout(m);
        }
      });
    }
  };

  return initCountdown;
})();

//done
var Counter = class {
  static defaultOptions = {
    from: 0,
    to: 0,
    speed: 1000,
    refreshInterval: 100,
    decimals: 0,
    formatter: (value, options) => value.toFixed(options.decimals),
    onUpdate: null,
    onComplete: null,
  };

  constructor(element, options = {}) {
    this.$element = window.jQuery(element);
    this.options = {
      ...window.Counter.defaultOptions,
      ...this._dataOptions(),
      ...options,
    };
    this._init();
  }

  _dataOptions() {
    const dataOptions = {
      from: this.$element.data('from'),
      to: this.$element.data('to'),
      speed: this.$element.data('speed'),
      refreshInterval: this.$element.data('refresh-interval'),
      decimals: this.$element.data('decimals'),
    };

    return Object.fromEntries(
      Object.entries(dataOptions).filter(([, value]) => value !== undefined)
    );
  }

  _init() {
    this.value = this.options.from;
    this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
    this.loopCount = 0;
    this.increment = (this.options.to - this.options.from) / this.loops;
    this._start();
  }

  _update() {
    this.value += this.increment;
    this.loopCount++;
    this._render();

    if (typeof this.options.onUpdate === 'function') {
      this.options.onUpdate.call(this.$element, this.value);
    }

    if (this.loopCount >= this.loops) {
      this._stop();
      this.value = this.options.to;

      if (typeof this.options.onComplete === 'function') {
        this.options.onComplete.call(this.$element, this.value);
      }
    }
  }

  _render() {
    const formattedValue = this.options.formatter.call(
      this.$element,
      this.value,
      this.options
    );
    this.$element.text(formattedValue);
  }

  _start() {
    this._stop(); // Stop any existing intervals
    this._render();
    this.interval = setInterval(
      this._update.bind(this),
      this.options.refreshInterval
    );
  }

  _stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null; // Clear reference to the interval
    }
  }
};

//done
window.T4SThemeSP.AnimateOnScroll = (() => {
  const animationDelay = window.T4Sconfigs.timeani || 200;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;
      if (entry.isIntersecting && !target.classList.contains('animated')) {
        setTimeout(() => {
          target.classList.add('animated');
          if (window.jQuery(target).is('[data-count-to]')) {
            entry.countTo = new window.Counter(target);
          }
        }, animationDelay);
        observer.unobserve(target);
      }
    });
  });

  return () => {
    const elementsToAnimate = window.jQuery(
      '[data-ts-animate]:not(.animate-init)'
    );
    if (elementsToAnimate.length > 0 && window.IntersectionObserver) {
      elementsToAnimate.each((_, element) => {
        observer.observe(element);
        window.jQuery(element).addClass('animate-init');
      });
    }
  };
})();

//done
window.T4SThemeSP.PopupMFP = (() => {
  const magnificPopup = window.jQuery.fn.magnificPopupT4s;
  const closeText = strings.mfp_close;
  const loadingText = strings.mfp_loading;

  const inlinePopupElements = window.jQuery(
    '[data-open-mfp-inline]:not(.mfp-enabled)'
  );
  const iframePopupElements = window.jQuery(
    '[data-open-mfp-iframe]:not(.mfp-enabled)'
  );
  const videoPopupElements = window.jQuery(
    '[data-open-mfp-video]:not(.mfp-enabled)'
  );
  const ajaxPopupElements = window.jQuery(
    '[data-open-mfp-ajax]:not(.mfp-enabled)'
  );
  const openPopupElements = window.jQuery('[data-open-mfp]');

  const popupClass = 'is-opening-mfp';

  function initializeInlinePopup() {
    if (inlinePopupElements.length === 0) return;

    inlinePopupElements
      .magnificPopupT4s({
        type: 'inline',
        removalDelay: 500,
        tClose: closeText,
        tLoading: loadingText,
        callbacks: {
          beforeOpen() {
            $html.addClass(popupClass);
            this.st.mainClass =
              'mfp-move-horizontal inline-popup-wrapper rte ' +
              (window.jQuery(this.st.el).data('id') || '');
          },
          open() {
            $body.trigger('NTpopupInline:offClose');
            $body.trigger('currency:update');
          },
          afterClose() {
            $body.trigger('NTpopupInline:onClose');
            $html.removeClass(popupClass);
          },
        },
      })
      .addClass('mfp-enabled');
  }

  function initializeIframePopup() {
    if (iframePopupElements.length === 0) return;

    iframePopupElements
      .magnificPopupT4s({
        type: 'iframe',
        tClose: closeText,
        tLoading: loadingText,
        iframe: {
          markup:
            '<div class="mfp-iframe-scaler pr mfp-iframe"><div class="mfp-close"></div><iframe class="mfp-iframe" allow="autoplay; encrypted-media" frameborder="0" allowfullscreen></iframe></div>',
          patterns: {
            youtube: {
              index: 'youtube.com/',
              id: 'v=',
              src: '//www.youtube.com/embed/%id%?enablejsapi=1&autoplay=0&rel=0&playlist=%id%&loop=1',
            },
            vimeo: {
              index: 'vimeo.com/',
              id: '/',
              src: '//player.vimeo.com/video/%id%?autoplay=0&loop=1',
            },
            gmaps: {
              index: '//maps.google.',
              src: '%id%&output=embed',
            },
          },
          srcAction: 'iframe_src',
        },
        callbacks: {
          beforeOpen() {
            $html.addClass(popupClass);
            this.st.mainClass =
              'iframe-popup-wrapper ' +
              (window.jQuery(this.st.el).data('id') || '');
          },
          change() {
            console.log('change');
          },
          open() {
            const element = window.jQuery(this.st.el);
            const iframe = window.jQuery('.mfp-iframe').find('.mfp-iframe');
            let src = iframe.attr('src');

            if (element.is('[data-autoplay-true]')) {
              src = src.replace('autoplay=0', 'autoplay=1');
            }
            if (element.is('[data-loop-false]')) {
              src = src.split('&playlist=')[0].replace('loop=1', 'loop=0');
            }

            iframe.attr('src', src);
          },
          afterClose() {
            $html.removeClass(popupClass);
          },
        },
      })
      .addClass('mfp-enabled');
  }

  function initializeVideoPopup() {
    if (videoPopupElements.length === 0) return;

    videoPopupElements.on('click', (event) => {
      event.preventDefault();
      const element = window.jQuery(event.currentTarget);
      const options = JSON.parse(element.attr('data-options') || '{}');
      const { type, vid, autoplay, loop, accent_color } = options;

      let content;
      const iframeTemplate = `<iframe src="src" class="class" title="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      const videoTypes = {
        html5: 'html5',
        youtube: 'youtube',
        vimeo: 'vimeo',
      };

      switch (type) {
        case videoTypes.html5:
          const videoId = options.id;
          const videoContent =
            videoId && window.jQuery(videoId)[0]
              ? window.jQuery(videoId).html()
              : `<video class="mfp-video" src="${
                  options.srcDefault
                }" preload="auto" controls ${autoplay ? 'autoplay' : ''} ${
                  loop ? 'loop' : ''
                } playsinline></video>`;
          content = `<div class="mfp-video-scaler relative mfp-video">${videoContent.replace(
            '<video',
            '<video class="mfp-video"'
          )}</div>`;
          break;
        case videoTypes.youtube:
          content = iframeTemplate
            .replace(
              'src',
              `//www.youtube.com/embed/${vid}?enablejsapi=1&showinfo=0&controls=1&modestbranding=1&autoplay=${+autoplay}&rel=0${
                loop ? `&playlist=${vid}&loop=1` : ''
              }`
            )
            .replace('class', 'js-youtube');
          content = `<div class="mfp-iframe-scaler relative mfp-iframe">${content}</div>`;
          break;
        case videoTypes.vimeo:
          content = iframeTemplate
            .replace(
              'src',
              `//player.vimeo.com/video/${vid}?&portrait=0&byline=0&color=${accent_color}&autoplay=${+autoplay}&loop=${+loop}`
            )
            .replace('class', 'js-vimeo');
          content = `<div class="mfp-iframe-scaler relative mfp-iframe">${content}</div>`;
          break;
      }

      window.jQuery.magnificPopupT4s.open({
        items: {
          src: content,
          type: 'inline',
        },
        tClose: closeText,
        tLoading: loadingText,
        callbacks: {
          beforeOpen() {
            $html.addClass(popupClass);
            this.st.mainClass = `video-popup-wrapper mfp-video-holder ${
              element.data('id') || ''
            }`;
          },
          open() {
            element.addClass('mfp-enabled');
          },
          afterClose() {
            element.removeClass('mfp-enabled');
            $html.removeClass(popupClass);
          },
        },
      });
    });
  }

  function initializeAjaxPopup() {
    if (ajaxPopupElements.length === 0) return;

    ajaxPopupElements
      .magnificPopupT4s({
        type: 'ajax',
        removalDelay: 500,
        tClose: closeText,
        tLoading:
          '<div class="loading-spin spin-centered spin-dark spin-medium"></div>',
        callbacks: {
          parseAjax(data) {
            const element = window.jQuery(this.st.el);
            const id = element.data('id') || '';
            const className = element.data('class') || '';
            const style = element.data('style') || '';
            const content = data.data;
            data.data = `<div class="mfp-with-anim mfp-popup rte ${className}" id="${id}" style="${style}">${
              content.split('[splitlz]')[1] || content
            }</div>`;
          },
          ajaxContentAdded() {
            console.log('ajaxContentAdded');
          },
          beforeOpen() {
            $html.addClass(popupClass);
            this.st.mainClass = 'mfp-move-horizontal ajax-popup-wrapper';
          },
          open() {
            const customData = window.jQuery(this.st.el).data('custom');
            const phoneData = window.jQuery(this.st.el).data('phone');
            const ajaxContent = window.jQuery(
              '.ajax-popup-wrapper:not(.mfp-bg) .mfp-content'
            );

            $body.trigger('NTpopupInline:offClose');
            $body.trigger('currency:update');

            if (phoneData === 0) {
              ajaxContent.find('#ContactFormAsk__phone').remove();
              setTimeout(() => {
                ajaxContent.find('#ContactFormAsk__phone').remove();
              }, 400);
            }

            if (customData) {
              const customItems = customData.split('||');
              customItems.forEach((item) => {
                const [selector, html] = item.split('=>');
                ajaxContent.find(selector).html(html);
              });
              setTimeout(() => {
                customItems.forEach((item) => {
                  const [selector, html] = item.split('=>');
                  ajaxContent.find(selector).html(html);
                });
              }, 400);
            }
          },
          afterClose() {
            $body.trigger('NTpopupInline:onClose');
            $html.removeClass(popupClass);
          },
        },
      })
      .addClass('mfp-enabled');
  }

  function initializeOpenPopup() {
    if (openPopupElements.length === 0) return;

    $body.on('click', '[data-open-mfp]', (event) => {
      event.preventDefault();
      const element = window.jQuery(event.currentTarget);
      const data = element.data();
      const {
        opennt,
        color,
        bg,
        pos,
        remove,
        className,
        ani = 'has_ntcanvas',
        close = false,
        focuslast = false,
      } = data;
      const dataFocus = element.attr('data-focus');
      element.addClass('current_clicked');

      window.jQuery.magnificPopupT4s.open({
        items: {
          src: opennt,
          type: 'inline',
          tLoading: '<div class="loading-spin dark"></div>',
        },
        tClose: nt_settings.close,
        removalDelay: 300,
        closeBtnInside: close,
        focus: dataFocus,
        autoFocusLast: focuslast,
        callbacks: {
          beforeOpen() {
            this.st.mainClass = `${ani} ${color} ${ani}_${pos}`;
            $html.addClass(popupClass);
          },
          open() {
            $html.addClass(ani);
            $html.addClass(`${ani}_${pos}`);
            className && window.jQuery('.mfp-content').addClass(className);
            bg && window.jQuery('.mfp-bg').addClass(bg);
            $body.on('click', '.close_pp', (event) => {
              event.preventDefault();
              window.jQuery.magnificPopup.close();
            });
            if (!window.pageYOffset) return;
            window.jQuery('html, body').scrollTop(window.pageYOffset);
          },
          beforeClose() {
            $html.removeClass(ani);
          },
          afterClose() {
            $html.removeClass(`${ani}_${pos}`);
            window.jQuery('.current_clicked').removeClass('current_clicked');
            remove && window.jQuery(opennt).removeClass('mfp-hide');
            $html.removeClass(popupClass);
          },
        },
      });
    });
  }

  function initialize() {
    if (magnificPopup !== 0) {
      initializeInlinePopup();
      initializeIframePopup();
      initializeVideoPopup();
      initializeAjaxPopup();
      initializeOpenPopup();
    }
  }

  return initialize;
})();

//done
window.T4SThemeSP.NTpopupInline = (() => {
  let modalClass = 'modal--is-active';
  let openedClass = 'modal-opened';
  let modalContent = window.jQuery('#temp_modal').html();

  const events = {
    trigger: 'modal:trigger',
    opened: 'modal:opened',
    closed: 'modal:closed',
    destroy: 'modal:destroy',
    click: 'click.qv',
    keyup: 'keyup.qv',
    transition: 'transitionend webkitTransitionEnd oTransitionEnd',
  };
  const n = (event) => {
    const $element = window.jQuery(event.target);
    if (
      $element.parents().is('.modal__inner') ||
      $element.parents().is('.mfp-ready') ||
      $element.is('#notices__wrapper') ||
      $element.parents().is('#notices__wrapper')
    )
      return;
    event.preventDefault();
    $body.trigger(events.closed);
  };
  const initModal = (
    htmlContent,
    _,
    onOpenCallback,
    onCloseCallback = null
  ) => {
    const closeModal = () => {
      if (isModalOpened()) {
        closeAndCleanUp(onCloseCallback);
      }
    };

    $body.off(events.trigger).on(events.trigger, () => {
      isModalOpened()
        ? $body.trigger(events.closed)
        : $body.trigger(events.opened);
    });

    $body.off(events.opened).on(events.opened, () => {
      if (!isModalOpened()) {
        openModal(htmlContent, onOpenCallback, onCloseCallback);
      }
    });

    $body.off(events.closed).on(events.closed, closeModal);
    $body.off(events.destroy).on(events.destroy, cleanUp);

    $body.on(events.click, '[data-ts-modal-close]', (event) => {
      event.preventDefault();
      $body.trigger(events.closed);
    });

    $body.on(events.click, n);
    $body.on(events.keyup, handleEscapeKey);
    $body.on('NTpopupInline:offClose', offCloseHandlers);
    $body.on('NTpopupInline:onClose', onCloseHandlers);
  };

  const isModalOpened = () => {
    return $html.hasClass(openedClass);
  };

  const handleEscapeKey = (event) => {
    if (event.keyCode === 27) {
      $body.trigger(events.closed);
    }
  };

  const offCloseHandlers = () => {
    $body.off(events.keyup).off(events.click);
  };

  const onCloseHandlers = () => {
    $body.on(events.keyup, handleEscapeKey);
    $body.on(events.click, (event) => {
      event.preventDefault();
      closeModal();
    });
  };

  const openModal = (htmlContent, onOpenCallback, onCloseCallback) => {
    window.T4SThemeSP.$appendComponent.after(modalContent);

    if (onCloseCallback) {
      $html.addClass(onCloseCallback);
    }

    window.jQuery('.modal__content').html(htmlContent);

    $html.addClass(openedClass);
    $html.css({
      'margin-right': window.T4SThemeSP.scrollbarWidth,
    });
    const $model = window.jQuery('.modal');
    $model.addClass(modalClass);
    $model.on(events.transition, (event) => {
      window.jQuery(event.currentTarget).focus().off(events.transition);
    });

    setTimeout(() => {
      $model.focus();
    }, 500);

    onOpenCallback();
  };

  const closeAndCleanUp = (onCloseCallback) => {
    window.jQuery('.modal .flickity-enabled').trigger('destroy.ts');
    $html.css({
      'margin-right': '',
    });
    $html.removeClass(openedClass).addClass('modal-closing');
    const $model = window.jQuery('.modal');
    $model.removeClass(modalClass).addClass('modal--is-closing');

    setTimeout(() => {
      $model.remove();
      onCloseCallback && $html.removeClass(onCloseCallback);
      window.T4SThemeSP.isEditCartReplace = false;
    }, 500);

    $body.trigger(events.destroy);
    $body.trigger('ts:hideTooltip');
  };

  const cleanUp = () => {
    $body
      .off(events.trigger)
      .off(events.opened)
      .off(events.closed)
      .off(events.destroy)
      .off(events.click)
      .off(events.keyup);
  };

  return initModal;
})();

//done
window.T4SThemeSP.Currency = (() => {
  const defaultFormat = '${{amount}}';
  const isSuperScriptEnabled =
    window.T4SThemeSP.settings && window.T4SThemeSP.settings.superScriptPrice;
  const moneyFormat = window.T4Sconfigs.moneyFormat;

  const formatMoney = (amount, format) => {
    const formatAmount = (
      amount,
      decimals = 2,
      thousandsSep = ',',
      decimalSep = '.'
    ) => {
      if (isNaN(amount) || amount == null) return 0;

      const formattedAmount = (amount / 100).toFixed(decimals).split('.');
      const integerPart = formattedAmount[0].replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        `$1${thousandsSep}`
      );
      const decimalPart = formattedAmount[1]
        ? decimalSep + formattedAmount[1]
        : '';

      return integerPart + decimalPart;
    };

    const formatMap = {
      amount: () => {
        let result = formatAmount(amount, 2);
        if (isSuperScriptEnabled && result?.includes('.')) {
          result = result.replace('.', '<sup>') + '</sup>';
        }
        return result;
      },
      amount_no_decimals: () => formatAmount(amount, 0),
      amount_with_comma_separator: () => {
        let result = formatAmount(amount, 2, '.', ',');
        if (isSuperScriptEnabled && result?.includes(',')) {
          result = result.replace(',', '<sup>') + '</sup>';
        }
        return result;
      },
      amount_no_decimals_with_comma_separator: () =>
        formatAmount(amount, 0, '.', ','),
      amount_no_decimals_with_space_separator: () =>
        formatAmount(amount, 0, ' '),
      amount_with_apostrophe_separator: () => formatAmount(amount, 2, "'"),
    };

    format = format || moneyFormat;
    if (typeof amount === 'string') {
      amount = amount.replace('.', '');
    }

    const formatKey = format.match(/\{\{\s*(\w+)\s*\}\}/)[1];
    return formatMap[formatKey]
      ? format.replace(/\{\{\s*(\w+)\s*\}\}/, formatMap[formatKey]())
      : format;
  };

  const getBaseUnit = (item) => {
    if (
      item &&
      item.unit_price_measurement &&
      item.unit_price_measurement.reference_value
    ) {
      const referenceValue = item.unit_price_measurement.reference_value;
      const referenceUnit = item.unit_price_measurement.reference_unit;
      return referenceValue === 1
        ? referenceUnit
        : `${referenceValue}${referenceUnit}`;
    }
  };

  return {
    formatMoney,
    getBaseUnit,
  };
})();

//done
window.T4SThemeSP.slate = {
  utils: {
    getParameterByName: (name, url = window.location.href) => {
      name = name.replace(/[[\]]/g, '\\$&');
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`).exec(url);
      return regex
        ? regex[2]
          ? decodeURIComponent(regex[2].replace(/\+/g, ' '))
          : ''
        : null;
    },
    removeParameterByName: (name, url = window.location.href) => {
      name = name.replace(/[[\]]/g, '\\$&');
      const baseUrl = url.split('?')[0];
      const queryString = url.split('?')?.[1] || '';

      if (queryString) {
        const params = queryString
          .split('&')
          .filter((param) => param.split('=')[0] !== name);
        return params.length ? `${baseUrl}?${params.join('&')}` : baseUrl;
      }
      return baseUrl;
    },
    resizeSelects: (selectElements) => {
      selectElements.each((_, element) => {
        const select = window.jQuery(element);
        const selectedText = select.find('option:selected').text();
        const tempSpan = window
          .jQuery('<span>')
          .html(selectedText)
          .appendTo('body');
        const width = tempSpan.width();
        tempSpan.remove();
        select.width(width + 10);
      });
    },
    keyboardKeys: {
      TAB: 9,
      ENTER: 13,
      ESCAPE: 27,
      LEFTARROW: 37,
      RIGHTARROW: 39,
    },
  },
  rte: {
    wrapTable: (tableData) => {
      tableData.$tables.wrap(
        `<div class="${tableData.tableWrapperClass}"></div>`
      );
    },
    wrapIframe: (iframeData) => {
      iframeData.$iframes.each((_, element) => {
        window
          .jQuery(element)
          .wrap(`<div class="${iframeData.iframeWrapperClass}"></div>`);
        element.src = element.src; // Reassigning to trigger iframe reload
      });
    },
  },
  a11y: {
    pageLinkFocus: (elements) => {
      const hiddenClass = 'js-focus-hidden';
      elements
        .first()
        .attr('tabIndex', '-1')
        .focus()
        .addClass(hiddenClass)
        .one('blur', () => {
          elements.first().removeClass(hiddenClass).removeAttr('tabindex');
        });
    },
    focusHash: () => {
      const hash = window.location.hash;
      if (hash && document.getElementById(hash.slice(1))) {
        this.pageLinkFocus(window.jQuery(hash));
      }
    },
    bindInPageLinks: () => {
      window.jQuery('a[href*=#]').on('click', (event) => {
        this.pageLinkFocus(
          window.jQuery(event.currentTarget.hash).bind(event.currentTarget)
        );
      });
    },
    trapFocus: (options) => {
      const events = {
        focusin: options.namespace ? `focusin.${options.namespace}` : 'focusin',
        focusout: options.namespace
          ? `focusout.${options.namespace}`
          : 'focusout',
        keydown: options.namespace
          ? `keydown.${options.namespace}`
          : 'keydown.handleFocus',
      };

      const focusableElements = options.$container.find(
        window
          .jQuery(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
          )
          .filter(':visible')
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      options.$elementToFocus = options.$elementToFocus || options.$container;
      options.$container.attr('tabindex', '-1');
      options.$elementToFocus.focus();

      $document.off('focusin');
      $document.on(events.focusout, () => {
        $document.off(events.keydown);
      });

      $document.on(events.focusin, (event) => {
        if (event.target === lastElement || event.target === firstElement) {
          $document.on(events.keydown, (keyEvent) => {
            if (keyEvent.keyCode === this.utils.keyboardKeys.TAB) {
              if (keyEvent.target === lastElement && !keyEvent.shiftKey) {
                keyEvent.preventDefault();
                firstElement.focus();
              } else if (
                keyEvent.target === firstElement &&
                keyEvent.shiftKey
              ) {
                keyEvent.preventDefault();
                lastElement.focus();
              }
            }
          });
        }
      });
    },
    removeTrapFocus: (options) => {
      const eventNamespace = options.namespace
        ? `focusin.${options.namespace}`
        : 'focusin';
      if (options.$container && options.$container.length) {
        options.$container.removeAttr('tabindex');
      }
      $document.off(eventNamespace);
    },
    accessibleLinks: (options) => {
      const ariaLabels = {
        newWindow: 'a11y-new-window-message',
        external: 'a11y-external-message',
        newWindowExternal: 'a11y-new-window-external-message',
      };

      if (!options.$links.jquery) {
        options.$links = window.jQuery('a[href]:not([aria-describedby])');
      }

      options.$links.each((_, $link) => {
        const link = window.jQuery($link);
        const target = link.attr('target');
        const rel = link.attr('rel');
        const isExternal = link[0].hostname !== window.location.hostname;
        const isNewWindow = target === '_blank';

        if (isExternal) {
          link.attr('aria-describedby', ariaLabels.external);
        }
        if (isNewWindow) {
          if (!rel || !rel.includes('noopener')) {
            link.attr('rel', (rel ? `${rel} ` : '') + 'noopener');
          }
          link.attr('aria-describedby', ariaLabels.newWindow);
        }
        if (isExternal && isNewWindow) {
          link.attr('aria-describedby', ariaLabels.newWindowExternal);
        }
      });

      const messages = {
        newWindow: 'Opens in a new window.',
        external: 'Opens external website.',
        newWindowExternal: 'Opens external website in a new window.',
        ...options.messages,
      };

      const messageList = document.createElement('ul');
      let messageItems = '';
      for (const key in messages) {
        messageItems += `<li id="${ariaLabels[key]}">${messages[key]}</li>`;
      }
      messageList.setAttribute('hidden', true);
      messageList.innerHTML = messageItems;
      $body[0].appendChild(messageList);
    },
  },
};

//done
window.T4SThemeSP.LinkMyltiLang = (function () {
  const rootUrl = window.T4SThemeSP.root_url;
  const hostname = window.location.hostname;
  const routesRootUrl = window.T4Sroutes.root_url;
  const checkedLinkClass = 'is--checked-link';
  const fullUrl = `${hostname}${routesRootUrl}`;

  return function () {
    if (rootUrl !== '/') {
      window
        .jQuery(
          `a[href*="${hostname}"]:not(.${checkedLinkClass}):not([href*="@"])`
        )
        .each((_, element) => {
          const link = window.jQuery(element);
          const href = link.attr('href');

          link.addClass(checkedLinkClass);

          if (
            href.indexOf(`${hostname}${rootUrl}`) >= 0 &&
            href !== '/' &&
            !href.includes('preview_theme_id=')
          ) {
            link.attr(
              'href',
              href !== '/' ? href.replace(hostname, fullUrl) : routesRootUrl
            );
          }
        });
    }
  };
})();

//done
var Slider = class {
  constructor(element) {
    this.$slider = window.jQuery(element);
    this.slideWrap = this.$slider.closest('[data-slide-wrap]')[0] || element;

    if (!this.slideWrap) return;

    this.sliderOptions = JSON.parse(this.$slider.attr('data-options') || '{}');
    this.slider = element;
    this.sliderItems = element.querySelectorAll('.slider__slide');
    this.pageCount = this.slideWrap.querySelector('.slider-counter--current');
    this.pageTotal = this.slideWrap.querySelector('.slider-counter--total');
    this.prevButton = this.slideWrap.querySelector('.slider__slide-prev');
    this.nextButton = this.slideWrap.querySelector('.slider__slide-next');

    if (!this.slider || !this.nextButton) return;

    new ResizeObserver(() => this._initPages()).observe(this.slider);
    this.slider.addEventListener('scroll', this._update);
    this.prevButton.addEventListener('click', this._onButtonClick);
    this.nextButton.addEventListener('click', this._onButtonClick);
  }

  _initPages() {
    this.slider.classList.remove('is--active');

    if (this.sliderItems.length > 0) {
      this.slider.classList.add('is--active');
      this.slidesPerPage = Math.floor(
        this.slider.clientWidth / this.sliderItems[0].clientWidth
      );
      this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
      this._update();
    }
  }

  _update() {
    if (this.pageCount && this.pageTotal) {
      this.currentPage =
        Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) +
        1;
      if (1 === this.currentPage) {
        this.prevButton.setAttribute('disabled', true);
      } else {
        this.prevButton.removeAttribute('disabled');
      }

      if (this.currentPage === this.totalPages) {
        this.nextButton.setAttribute('disabled', true);
      } else {
        this.nextButton.removeAttribute('disabled');
      }

      this.pageCount.textContent = this.currentPage;
      this.pageTotal.textContent = this.totalPages;
    }
  }

  _onButtonClick(event) {
    event.preventDefault();
    const scrollAmount = this.sliderItems[0].clientWidth;
    const newScrollLeft =
      event.currentTarget.name === 'next'
        ? this.slider.scrollLeft + scrollAmount
        : this.slider.scrollLeft - scrollAmount;

    this.slider.scrollTo({ left: newScrollLeft });
  }
};

//done
window.T4SThemeSP.SliderComponentInit = (() => {
  const sliders = window.jQuery('.slider:not(.enabled)');

  if (sliders.length > 0) {
    sliders.each((_, element) => {
      element.classList.add('enabled');
      element.sliderComponent = new Slider(element);
    });
  }
})();

//done
window.T4SThemeSP.LibraryLoader = (() => {
  const elementTypes = {
    link: 'link',
    script: 'script',
  };

  const statuses = {
    requested: 'requested',
    loaded: 'loaded',
  };

  const cdnBase = 'https://cdn.shopify.com/shopifycloud/';

  const libraries = {
    youtubeSdk: {
      tagId: 'youtube-sdk',
      src: 'https://www.youtube.com/iframe_api',
      type: elementTypes.script,
    },
    vimeoSdk: {
      tagId: 'vimeo-sdk',
      src: 'https://player.vimeo.com/api/player.js',
      type: elementTypes.script,
    },
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: `${cdnBase}plyr/v2.0/shopify-plyr.css`,
      type: elementTypes.link,
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: `${cdnBase}model-viewer-ui/assets/v1.0/model-viewer-ui.css`,
      type: elementTypes.link,
    },
  };
  function loadLibrary(libraryName, callback) {
    const library = libraries[libraryName];

    if (library) {
      // Handle YouTube SDK case
      if (isDesignMode && libraryName === 'youtubeSdk' && window.YT) {
        callback();
        return $document.trigger('youtube:ready');
      }

      // Check library status
      if (library.status !== statuses.requested) {
        callback = callback || function () {};

        if (library.status !== statuses.loaded) {
          library.status = statuses.requested;
          let element;

          switch (library.type) {
            case elementTypes.script:
              element = createScriptElement(library, callback);
              break;
            case elementTypes.link:
              element = createLinkElement(library, callback);
              break;
          }

          element.id = library.tagId;
          library.element = element;

          const firstElement = document.getElementsByTagName(library.type)[0];
          firstElement.parentNode.insertBefore(element, firstElement);
        } else {
          callback();
        }
      }
    }
  }

  function createScriptElement(library, callback) {
    const script = document.createElement('script');
    script.src = library.src;
    script.addEventListener('load', () => {
      library.status = statuses.loaded;
      callback();
    });
    return script;
  }

  function createLinkElement(library, callback) {
    const link = document.createElement('link');
    link.href = library.src;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.addEventListener('load', function () {
      library.status = statuses.loaded;
      callback();
    });
    return link;
  }

  return {
    load: loadLibrary,
  };
})();

//done
var VideoBackground = class {
  static videoTypes = {
    html5: 'html5',
    youtube: 'youtube',
    vimeo: 'vimeo',
  };

  isYouTubeLoaded = false;
  isVimeoLoaded = false;
  constructor(element) {
    this.$video = window.jQuery(element);
    this.video_options = JSON.parse(this.$video.attr('data-options') || '{}');
    this.video_type = this.video_options.type;
    this.video_mute = this.video_options.mute;
    this.$videoInsert = this.$video.find('[data-bgvideo-insert]');
    this.$elementToInsert = this.$videoInsert.length
      ? this.$videoInsert
      : this.$video;
    this.elementToInsert = this.$elementToInsert[0];
    this.$video.attr('loaded', true);

    this.initializeVideo();
  }

  initializeVideo() {
    switch (this.video_type) {
      case VideoBackground.videoTypes.html5:
        this._setupBgHtml5Video();
        break;
      case VideoBackground.videoTypes.youtube:
        if (window.YT) {
          this._setupBgYouTubeVideo();
        } else {
          this._triggerBgYouTubeVideo();
          if (!this.isYouTubeLoaded) {
            window.T4SThemeSP.LibraryLoader.load('youtubeSdk');
            this.isYouTubeLoaded = true;
          }
        }
        break;
      case VideoBackground.videoTypes.vimeo:
        if (window.Vimeo) {
          this._setupBgVimeoVideo();
        } else {
          this._triggerBgVimeoVideo();
          if (!this.isVimeoLoaded) {
            window.T4SThemeSP.LibraryLoader.load(
              'vimeoSdk',
              this._loadedVimeoSDK.bind(this)
            );
            this.isVimeoLoaded = true;
          }
        }
        break;
    }
  }

  _triggerBgYouTubeVideo() {
    $document.on('youtube:ready', () => {
      this._setupBgYouTubeVideo();
    });
  }

  _loadedVimeoSDK() {
    $document.trigger('vimeo:ready');
  }

  _triggerBgVimeoVideo() {
    $document.on('vimeo:ready', () => {
      this._setupBgVimeoVideo();
    });
  }

  _setupBgHtml5Video() {
    const videoId = this.video_options.id;
    const videoHtml =
      videoId && window.jQuery(videoId)[0]
        ? window.jQuery(videoId).html()
        : `<video class="bg_vid_html5" src="${
            this.video_options.srcDefault
          }" preload="auto" playsinline autoplay ${
            this.video_mute ? 'muted' : ''
          } loop></video>`;

    this.$elementToInsert.replaceWith(videoHtml);
    this.$video.find('.bg_vid_html5').on('playing', () => {
      this.$video.addClass('bgvideo-playing');
    });
  }

  _setupBgYouTubeVideo() {
    if (window.YT) {
      this.player = new window.YT.Player(this.elementToInsert, {
        videoId: this.video_options.vid,
        playerVars: {
          iv_load_policy: 3,
          enablejsapi: 1,
          disablekb: 1,
          autoplay: 0,
          controls: 0,
          rel: 0,
          loop: 0,
          playsinline: 1,
          modestbranding: 1,
          autohide: 1,
          branding: 0,
          cc_load_policy: 0,
          fs: 0,
          quality: 'hd1080',
          wmode: 'transparent',
          height: '100%',
          width: '100%',
          origin: this.video_options.requestHost,
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
        },
      });

      this.resizeVideoBackground();
      $window.on(
        'resize',
        window.T4SThemeSP.debounce(300, () => {
          this.resizeVideoBackground();
        })
      );
    }
  }

  onPlayerReady(event) {
    if (this.video_mute) {
      this.player.mute();
    }
    this.player.playVideo();
  }

  onPlayerStateChange(event) {
    if (event.data === window.YT.PlayerState.PLAYING) {
      this.$video.addClass('bgvideo-playing');
    } else if (event.data === window.YT.PlayerState.ENDED) {
      this.player.playVideo();
    }
  }

  _setupBgVimeoVideo() {
    if (window.Vimeo) {
      this.player = new window.Vimeo.Player(this.elementToInsert.parentNode, {
        id: this.video_options.vid,
        autoplay: true,
        autopause: false,
        muted: true,
        background: true,
        loop: this.video_mute,
      });

      this.$videoInsert.remove();
      this.resizeVideoBackground();

      $window.on(
        'resize',
        window.T4SThemeSP.debounce(300, (event) => {
          this.resizeVideoBackground();
        })
      );

      this.player.on('play', () => {
        this.$video.addClass('bgvideo-playing');
      });

      this.player.on('ended', () => {
        console.log('ended');
      });
    }
  }

  resizeVideoBackground() {
    const videoContainer = this.$video;
    const containerWidth = videoContainer.innerWidth();
    const containerHeight = videoContainer.innerHeight();
    let videoWidth, videoHeight, marginLeft, marginTop;

    if (containerWidth / containerHeight < 16 / 9) {
      videoHeight = containerHeight;
      videoWidth = videoHeight * (16 / 9);
      marginLeft = -Math.round((videoWidth - containerWidth) / 2) + 'px';
      marginTop = -Math.round((videoHeight - containerHeight) / 2) + 'px';
    } else {
      videoWidth = containerWidth;
      videoHeight = videoWidth * (9 / 16);
      marginTop = -Math.round((videoHeight - containerHeight) / 2) + 'px';
      marginLeft = -Math.round((videoWidth - containerWidth) / 2) + 'px';
    }

    videoContainer.find('iframe').css({
      maxWidth: '1000%',
      marginLeft: marginLeft,
      marginTop: marginTop,
      width: videoWidth + 'px',
      height: videoHeight + 'px',
    });
  }
};

//done
window.T4SThemeSP.BgVideo = () => {
  const elements = window.jQuery(
    '[data-video-background]:not([loaded="true"])'
  );

  if (elements.length !== 0) {
    elements.each((_, element) => {
      element.bgVideo = new VideoBackground(element);
    });
  }
};

//done
window.T4SThemeSP.Footer = () => {
  const footerOpenedClass = 'is--footer_opened';
  const animationDuration = 200;
  function onFooterResize() {
    // Unbind any previous click events and set a new click handler on elements with data-footer-open attribute
    window
      .jQuery('[data-footer-open]')
      .off('click')
      .on('click', (event) => {
        const parentElement = window.jQuery(event.currentTarget).parent(); // Get the parent element of the clicked element
        const footerContent = parentElement.find('> [data-footer-content]'); // Find the content inside the footer

        // Toggle the "opened" state of the footer
        if (parentElement.hasClass(footerOpenedClass)) {
          // If the footer is already open, close it
          parentElement.removeClass(footerOpenedClass);
          footerContent.stop().slideUp(animationDuration); // Slide up the content to hide it
        } else {
          // If the footer is closed, open it
          parentElement.addClass(footerOpenedClass);
          footerContent.stop().slideDown(animationDuration); // Slide down the content to show it
        }
      });

    // Remove the resize event listener to avoid duplicate bindings
    $window.off('resize.FooterCollapse');
  }

  function initialize() {
    // Attach a resize event listener to the window
    $window.on('resize.FooterCollapse', onFooterResize);

    // If the window width is less than 768px and there is a collapsible footer, run the function to toggle the footer
    if (
      windowWidth < 768 &&
      window.jQuery('.is--footer-collapse-true').length > 0
    ) {
      onFooterResize();
    }
  }

  return initialize;
};

//done
window.T4SThemeSP.Notices = () => {
  const noticesWrapper = window.jQuery('#notices__wrapper');
  const noticesTemplate = window.jQuery('#notices__tmp');
  let noticesMess, noticesProgressbar, noticesProgressbarSpan;
  const animationDuration = window.T4Sconfigs.timeOutNotices;
  const autoHide = window.T4Sconfigs.autoHideNotices;
  const isShowClass = 'is--show';
  const isActiveNoticesClass = 'is--active-notices';
  const noticesClickClass = 'click.notices';
  const hideNoticesClass = 'hide.ts.notices';
  let isInitialized = false;
  let timeoutId = null;

  // Remove the template from the DOM
  noticesTemplate.remove();

  // Show notice function
  const showNotice = (message, status = 'warning') => {
    if (!isInitialized) {
      initializeNotices();
    }

    // Set notice status
    noticesWrapper.attr('data-notices-status', status);

    // Handle message type
    if (typeof message === 'object') {
      noticesMess.html('');
      Object.values(message).forEach(([text]) => {
        noticesMess.append(`<span class="d-block">${text}</span>`);
      });
    } else {
      noticesMess.html(message);
    }

    // Show/hide progress bar
    autoHide ? noticesProgressbar.show() : noticesProgressbar.hide();

    // Add animation class after a delay
    setTimeout(() => {
      noticesWrapper.addClass(isShowClass);
      $html.addClass(isActiveNoticesClass);
    }, 200);

    // Auto-hide notice if enabled
    if (autoHide) {
      timeoutId = setTimeout(hideNotice, animationDuration + 200);
    }

    // Event listeners for closing notice
    noticesWrapper.on(noticesClickClass, hideNotice);
    $body.on(hideNoticesClass, hideNotice);
  };

  const initializeNotices = () => {
    window.T4SThemeSP.$appendComponent.after(noticesTemplate.html());
    noticesMess = noticesWrapper.find('.notices__mess');
    noticesProgressbar = noticesWrapper.find('.notices__progressbar');
    noticesProgressbarSpan = noticesWrapper.show().find('>span');
    isInitialized = true;
    noticesProgressbarSpan.css('animation-duration', `${animationDuration}ms`);
  };

  // Hide notice function
  const hideNotice = () => {
    noticesProgressbar.hide();
    clearTimeout(timeoutId);
    noticesWrapper.removeClass(isShowClass);
    $html.removeClass(isActiveNoticesClass);
    noticesWrapper.off(noticesClickClass).off(hideNoticesClass);
  };

  return showNotice;
};

//done
window.T4SThemeSP.FormShopifyMessSuccess = () => {
  // Store form submission ID in localStorage on form submit
  $document.on('submit', 'form[action^="/contact"]', (event) => {
    localStorage.setItem(
      'recentform',
      window.jQuery(event.currentTarget).attr('id')
    );
  });

  // Retrieve current page URL and form ID from localStorage
  const currentUrl = window.location.href;
  const recentFormId = localStorage.getItem('recentform') || '';

  // Check if the URL contains "contact_posted=true" and handle form success messages
  if (currentUrl.includes('contact_posted=true') && recentFormId !== '') {
    if (
      currentUrl.includes('contact_posted=true#ContactFormNotifyStock') ||
      recentFormId.includes('ContactFormNotifyStock')
    ) {
      window.T4SThemeSP.Notices(strings.frm_notify_stock_success, 'success');
    } else if (
      currentUrl.includes('contact_posted=true#ContactFormAsk') ||
      recentFormId.includes('ContactFormAsk')
    ) {
      window.T4SThemeSP.Notices(strings.frm_contact_ask_success, 'success');
    } else if (
      currentUrl.includes('contact_posted=true#NewsletterFormPopup') ||
      recentFormId.includes('NewsletterFormPopup')
    ) {
      window.T4SThemeSP.Notices(
        strings.frm_newsletter_popup_success,
        'success'
      );
    }
  }
};

//done
window.T4SThemeSP.PreloadStylePopup = () => {
  const stylePopup = window.jQuery('#style-popup');

  if (stylePopup) {
    window.jQuery('#assets-pre').html(stylePopup.html());
  }
};

//done
window.T4SThemeSP.BtnMore = class {
  static BtnMoreClassNames = {
    enabled: 'is--enabled',
    btn: '[data-btn-toggle]',
    open: 'is--open',
  };
  constructor(element) {
    this.el = element;
    this.$el = window.jQuery(element);
    this.clickHandler();
    this.$el.addClass(window.T4SThemeSP.BtnMore.BtnMoreClassNames.enabled);
    this.selector = this.$el.data('selector');
    this.tMore = this.$el.data('tmore');
    this.tLess = this.$el.data('tless');
    this.hasIsotope = this.$el.hasClass('isotope');
  }

  clickHandler() {
    this.$el.on(
      'click.more',
      window.T4SThemeSP.BtnMore.BtnMoreClassNames.btn,
      (event) => {
        event.preventDefault();

        const $button = window.jQuery(event.currentTarget);
        $button.parent().find(this.selector).slideToggle(200);
        $button.toggleClass(window.T4SThemeSP.BtnMore.BtnMoreClassNames.open);
        $button.hasClass(window.T4SThemeSP.BtnMore.BtnMoreClassNames.open)
          ? $button.html(this.tLess)
          : $button.html(this.tMore);

        if (this.hasIsotope) {
          this.$el.isotope('layout');
          setTimeout(() => {
            this.$el.isotope('layout');
          }, 219);
        }
      }
    );
  }
};

//done
window.T4SThemeSP.initBtnMore = () => {
  const elements = window.jQuery('[data-wrap-toggle]:not(.is--enabled)');

  if (elements.length > 0) {
    elements.each((_, element) => {
      element.btnMore = new window.T4SThemeSP.BtnMore(element);
    });
  }
};

//done
window.T4SThemeSP.fixHand = () => {
  const isWindowsPhone = navigator.userAgent.includes('Windows Phone');
  const isiOSDevice =
    /iP(ad|hone|od)/.test(navigator.userAgent) && !isWindowsPhone;

  if (!isiOSDevice || windowWidth > 1199) {
    window.$script(window.T4Sconfigs.script12c, () => {
      window.T4SThemeSP.FastClick.attach(document.body);

      if (!window.T4Sconfigs.disFlashyApp) {
        const bodyElement = document.querySelector('body');

        new MutationObserver(() => {
          const flashyPopup = document.querySelector('flashy-popup');

          if (flashyPopup && !flashyPopup.classList.contains('needsclick')) {
            flashyPopup.classList.add('needsclick');
          }
        }).observe(bodyElement, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    });
  }
};

//done
window.jQuery(document).ready(($) => {
  smoothscroll.polyfill();
  window.T4SThemeSP.FormShopifyMessSuccess();
  window.T4SThemeSP.BgVideo();
  window.T4SThemeSP.ParallaxInt();
  window.jQuery('.parallax-bg:not(.lazyloaded)').on('lazyloaded', () => {
    window.T4SThemeSP.ParallaxInt();
  });
  window.T4SThemeSP.Countdown();
  window.T4SThemeSP.AnimateOnScroll();
  window.T4SThemeSP._initProducts();
  window.T4SThemeSP.slate.a11y.accessibleLinks({
    $links: window.jQuery('a[href]:not([aria-describedby])'),
  });
  window.T4SThemeSP.Tabs.Default();
  window.T4SThemeSP.Tabs.Simple();
  window.T4SThemeSP.Tabs.Accordion();
  window.T4SThemeSP.Footer();
  window.T4SThemeSP.PopupMFP();
  window.T4SThemeSP.Cookies();
  window.T4SThemeSP.fixHand();
  window.$script([window.T4Sconfigs.script3, window.T4Sconfigs.script6]);
  setTimeout(() => {
    window.T4SThemeSP.LinkMyltiLang();
  }, 500);
  setTimeout(() => {
    window.T4SThemeSP.PreloadStylePopup();
  }, 1500);
});
