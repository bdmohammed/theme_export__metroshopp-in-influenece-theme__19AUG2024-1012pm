(function (t) {
  var e;
  (t.d = t.d || {}),
    (t.d.scope = {}),
    (t.d.createTemplateTagFirstArg = function (t) {
      return (t.raw = t);
    }),
    (t.d.createTemplateTagFirstArgWithRaw = function (t, e) {
      return (t.raw = e), t;
    }),
    (t.d.getGlobal = function (t) {
      t = [
        "object" == typeof globalThis && globalThis,
        t,
        "object" == typeof window && window,
        "object" == typeof self && self,
        "object" == typeof global && global,
      ];
      for (var e = 0; e < t.length; ++e) {
        var i = t[e];
        if (i && i.Math == Math) return i;
      }
      throw Error("Cannot find global object");
    }),
    (t.d.global = t.d.getGlobal(this)),
    void 0 === e && (e = function () {}),
    (e.p = "");
}).call(this || window, (window.__wpcc = window.__wpcc || {})),
  function (t) {
    var e = function (t) {
        return r
          ? t instanceof HTMLElement
          : t &&
              "object" == typeof t &&
              null !== t &&
              1 === t.nodeType &&
              "string" == typeof t.nodeName;
      },
      i = function (t, e) {
        e.forEach(function (e) {
          t.classList.add(e);
        });
      },
      n = function (t, e) {
        e.forEach(function (e) {
          t.classList.remove(e);
        });
      },
      s = function () {
        throw Error("Missing parameter");
      },
      o = function (t) {
        this.isShowing = !1;
        var e = void 0 === t.namespace ? null : t.namespace,
          i = void 0 === t.zoomFactor ? s() : t.zoomFactor;
        (t = void 0 === t.containerEl ? s() : t.containerEl),
          (this.settings = { namespace: e, zoomFactor: i, containerEl: t }),
          (this.openClasses = this._buildClasses("open")),
          this._buildElement();
      },
      h = function (t) {
        (t = void 0 === t ? {} : t),
          (this._show = this._show.bind(this)),
          (this._hide = this._hide.bind(this)),
          (this._handleEntry = this._handleEntry.bind(this)),
          (this._handleMovement = this._handleMovement.bind(this));
        var e = void 0 === t.el ? s() : t.el,
          i = void 0 === t.zoomPane ? s() : t.zoomPane,
          n = void 0 === t.sourceAttribute ? s() : t.sourceAttribute,
          h = void 0 === t.handleTouch ? s() : t.handleTouch,
          a = void 0 === t.onShow ? null : t.onShow,
          l = void 0 === t.onHide ? null : t.onHide,
          r = void 0 === t.hoverDelay ? 0 : t.hoverDelay,
          d = void 0 === t.touchDelay ? 0 : t.touchDelay,
          c = void 0 === t.hoverBoundingBox ? s() : t.hoverBoundingBox,
          u = void 0 === t.touchBoundingBox ? s() : t.touchBoundingBox,
          p = void 0 === t.namespace ? null : t.namespace,
          m = void 0 === t.zoomFactor ? s() : t.zoomFactor,
          g = void 0 === t.boundingBoxContainer ? s() : t.boundingBoxContainer;
        (this.settings = {
          el: e,
          zoomPane: i,
          sourceAttribute: n,
          handleTouch: h,
          onShow: a,
          onHide: l,
          hoverDelay: r,
          touchDelay: d,
          hoverBoundingBox: c,
          touchBoundingBox: u,
          namespace: p,
          zoomFactor: m,
          boundingBoxContainer: g,
          passive: void 0 !== t.passive && t.passive,
        }),
          (this.settings.hoverBoundingBox || this.settings.touchBoundingBox) &&
            (this.boundingBox = new o({
              namespace: this.settings.namespace,
              zoomFactor: this.settings.zoomFactor,
              containerEl: this.settings.boundingBoxContainer,
            })),
          (this.enabled = !0),
          this._bindEvents();
      },
      a = function (t) {
        if (
          ((t = void 0 === t ? {} : t),
          (this.HAS_ANIMATION = !1),
          "undefined" != typeof document)
        ) {
          var e = document.createElement("div").style;
          this.HAS_ANIMATION = "animation" in e || "webkitAnimation" in e;
        }
        (this._completeShow = this._completeShow.bind(this)),
          (this._completeHide = this._completeHide.bind(this)),
          (this._handleLoad = this._handleLoad.bind(this)),
          (this.isShowing = !1),
          (e = void 0 === t.container ? null : t.container);
        var i = void 0 === t.zoomFactor ? s() : t.zoomFactor,
          n = void 0 === t.inline ? s() : t.inline,
          o = void 0 === t.namespace ? null : t.namespace,
          h =
            void 0 === t.showWhitespaceAtEdges ? s() : t.showWhitespaceAtEdges,
          a = void 0 === t.containInline ? s() : t.containInline;
        (this.settings = {
          container: e,
          zoomFactor: i,
          inline: n,
          namespace: o,
          showWhitespaceAtEdges: h,
          containInline: a,
          inlineOffsetX: void 0 === t.inlineOffsetX ? 0 : t.inlineOffsetX,
          inlineOffsetY: void 0 === t.inlineOffsetY ? 0 : t.inlineOffsetY,
          inlineContainer:
            void 0 === t.inlineContainer ? document.body : t.inlineContainer,
        }),
          (this.openClasses = this._buildClasses("open")),
          (this.openingClasses = this._buildClasses("opening")),
          (this.closingClasses = this._buildClasses("closing")),
          (this.inlineClasses = this._buildClasses("inline")),
          (this.loadingClasses = this._buildClasses("loading")),
          this._buildElement();
      },
      l = function (t, i) {
        if (
          ((i = void 0 === i ? {} : i),
          (this.VERSION = "1.4.5"),
          (this.triggerEl = t),
          (this.destroy = this.destroy.bind(this)),
          !e(this.triggerEl))
        )
          throw new TypeError(
            "`new Drift` requires a DOM element as its first argument.",
          );
        t = i.namespace || null;
        var n = i.showWhitespaceAtEdges || !1,
          s = i.containInline || !1,
          o = i.inlineOffsetX || 0,
          h = i.inlineOffsetY || 0,
          a = i.inlineContainer || document.body,
          l = i.sourceAttribute || "data-zoom",
          r = i.zoomFactor || 3,
          d = void 0 === i.paneContainer ? document.body : i.paneContainer,
          c = i.inlinePane || 375,
          u = !("handleTouch" in i && !i.handleTouch),
          p = i.onShow || null,
          m = i.onHide || null,
          g = !("injectBaseStyles" in i && !i.injectBaseStyles),
          f = i.hoverDelay || 0,
          v = i.touchDelay || 0,
          _ = i.hoverBoundingBox || !1,
          y = i.touchBoundingBox || !1,
          w = i.boundingBoxContainer || document.body;
        if (((i = i.passive || !1), !0 !== c && !e(d)))
          throw new TypeError(
            "`paneContainer` must be a DOM element when `inlinePane !== true`",
          );
        if (!e(a))
          throw new TypeError("`inlineContainer` must be a DOM element");
        (this.settings = {
          namespace: t,
          showWhitespaceAtEdges: n,
          containInline: s,
          inlineOffsetX: o,
          inlineOffsetY: h,
          inlineContainer: a,
          sourceAttribute: l,
          zoomFactor: r,
          paneContainer: d,
          inlinePane: c,
          handleTouch: u,
          onShow: p,
          onHide: m,
          injectBaseStyles: g,
          hoverDelay: f,
          touchDelay: v,
          hoverBoundingBox: _,
          touchBoundingBox: y,
          boundingBoxContainer: w,
          passive: i,
        }),
          this.settings.injectBaseStyles &&
            !document.querySelector(".drift-base-styles") &&
            (((i = document.createElement("style")).type = "text/css"),
            i.classList.add("drift-base-styles"),
            i.appendChild(
              document.createTextNode(
                ".drift-bounding-box,.drift-zoom-pane{position:absolute;pointer-events:none}@keyframes noop{0%{zoom:1 }}@-webkit-keyframes noop{0%{zoom:1 }}.drift-zoom-pane.drift-open{display:block}.drift-zoom-pane.drift-closing,.drift-zoom-pane.drift-opening{animation:noop 1ms;-webkit-animation:noop 1ms}.drift-zoom-pane{overflow:hidden;width:100%;height:100%;top:0;left:0}.drift-zoom-pane-loader{display:none}.drift-zoom-pane img{position:absolute;display:block;max-width:none;max-height:none}",
              ),
            ),
            (t = document.head).insertBefore(i, t.firstChild)),
          this._buildZoomPane(),
          this._buildTrigger();
      },
      r = "object" == typeof HTMLElement;
    (o.prototype._buildClasses = function (t) {
      var e = ["drift-" + t],
        i = this.settings.namespace;
      return i && e.push(i + "-" + t), e;
    }),
      (o.prototype._buildElement = function () {
        (this.el = document.createElement("div")),
          i(this.el, this._buildClasses("bounding-box"));
      }),
      (o.prototype.show = function (t, e) {
        (this.isShowing = !0), this.settings.containerEl.appendChild(this.el);
        var n = this.el.style;
        (n.width = Math.round(t / this.settings.zoomFactor) + "px"),
          (n.height = Math.round(e / this.settings.zoomFactor) + "px"),
          i(this.el, this.openClasses);
      }),
      (o.prototype.hide = function () {
        this.isShowing && this.settings.containerEl.removeChild(this.el),
          (this.isShowing = !1),
          n(this.el, this.openClasses);
      }),
      (o.prototype.setPosition = function (t, e, i) {
        var n = window.pageXOffset,
          s = window.pageYOffset;
        (t = i.left + t * i.width - this.el.clientWidth / 2 + n),
          (e = i.top + e * i.height - this.el.clientHeight / 2 + s),
          t < i.left + n
            ? (t = i.left + n)
            : t + this.el.clientWidth > i.left + i.width + n &&
              (t = i.left + i.width - this.el.clientWidth + n),
          e < i.top + s
            ? (e = i.top + s)
            : e + this.el.clientHeight > i.top + i.height + s &&
              (e = i.top + i.height - this.el.clientHeight + s),
          (this.el.style.left = t + "px"),
          (this.el.style.top = e + "px");
      }),
      (h.prototype._preventDefault = function (t) {
        t.preventDefault();
      }),
      (h.prototype._preventDefaultAllowTouchScroll = function (t) {
        (this.settings.touchDelay &&
          this._isTouchEvent(t) &&
          !this.isShowing) ||
          t.preventDefault();
      }),
      (h.prototype._isTouchEvent = function (t) {
        return !!t.touches;
      }),
      (h.prototype._bindEvents = function () {
        this.settings.el.addEventListener("mouseenter", this._handleEntry, !1),
          this.settings.el.addEventListener("mouseleave", this._hide, !1),
          this.settings.el.addEventListener(
            "mousemove",
            this._handleMovement,
            !1,
          );
        var t = { passive: this.settings.passive };
        this.settings.handleTouch
          ? (this.settings.el.addEventListener(
              "touchstart",
              this._handleEntry,
              t,
            ),
            this.settings.el.addEventListener("touchend", this._hide, !1),
            this.settings.el.addEventListener(
              "touchmove",
              this._handleMovement,
              t,
            ))
          : (this.settings.el.addEventListener(
              "touchstart",
              this._preventDefault,
              t,
            ),
            this.settings.el.addEventListener(
              "touchend",
              this._preventDefault,
              !1,
            ),
            this.settings.el.addEventListener(
              "touchmove",
              this._preventDefault,
              t,
            ));
      }),
      (h.prototype._unbindEvents = function () {
        this.settings.el.removeEventListener(
          "mouseenter",
          this._handleEntry,
          !1,
        ),
          this.settings.el.removeEventListener("mouseleave", this._hide, !1),
          this.settings.el.removeEventListener(
            "mousemove",
            this._handleMovement,
            !1,
          ),
          this.settings.handleTouch
            ? (this.settings.el.removeEventListener(
                "touchstart",
                this._handleEntry,
                !1,
              ),
              this.settings.el.removeEventListener("touchend", this._hide, !1),
              this.settings.el.removeEventListener(
                "touchmove",
                this._handleMovement,
                !1,
              ))
            : (this.settings.el.removeEventListener(
                "touchstart",
                this._preventDefault,
                !1,
              ),
              this.settings.el.removeEventListener(
                "touchend",
                this._preventDefault,
                !1,
              ),
              this.settings.el.removeEventListener(
                "touchmove",
                this._preventDefault,
                !1,
              ));
      }),
      (h.prototype._handleEntry = function (t) {
        this._preventDefaultAllowTouchScroll(t),
          (this._lastMovement = t),
          "mouseenter" == t.type && this.settings.hoverDelay
            ? (this.entryTimeout = setTimeout(
                this._show,
                this.settings.hoverDelay,
              ))
            : this.settings.touchDelay
              ? (this.entryTimeout = setTimeout(
                  this._show,
                  this.settings.touchDelay,
                ))
              : this._show();
      }),
      (h.prototype._show = function () {
        if (this.enabled) {
          var t = this.settings.onShow;
          t && "function" == typeof t && t(),
            this.settings.zoomPane.show(
              this.settings.el.getAttribute(this.settings.sourceAttribute),
              this.settings.el.clientWidth,
              this.settings.el.clientHeight,
            ),
            this._lastMovement &&
              (((t = this._lastMovement.touches) &&
                this.settings.touchBoundingBox) ||
                (!t && this.settings.hoverBoundingBox)) &&
              this.boundingBox.show(
                this.settings.zoomPane.el.clientWidth,
                this.settings.zoomPane.el.clientHeight,
              ),
            this._handleMovement();
        }
      }),
      (h.prototype._hide = function (t) {
        t && this._preventDefaultAllowTouchScroll(t),
          (this._lastMovement = null),
          this.entryTimeout && clearTimeout(this.entryTimeout),
          this.boundingBox && this.boundingBox.hide(),
          (t = this.settings.onHide) && "function" == typeof t && t(),
          this.settings.zoomPane.hide();
      }),
      (h.prototype._handleMovement = function (t) {
        if (t)
          this._preventDefaultAllowTouchScroll(t), (this._lastMovement = t);
        else {
          if (!this._lastMovement) return;
          t = this._lastMovement;
        }
        if (t.touches)
          var e = (t = t.touches[0]).clientX,
            i = t.clientY;
        else (e = t.clientX), (i = t.clientY);
        (e =
          (e - (t = this.settings.el.getBoundingClientRect()).left) /
          this.settings.el.clientWidth),
          (i = (i - t.top) / this.settings.el.clientHeight),
          this.boundingBox && this.boundingBox.setPosition(e, i, t),
          this.settings.zoomPane.setPosition(e, i, t);
      }),
      t.d.global.Object.defineProperties(h.prototype, {
        isShowing: {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return this.settings.zoomPane.isShowing;
          },
        },
      }),
      (a.prototype._buildClasses = function (t) {
        var e = ["drift-" + t],
          i = this.settings.namespace;
        return i && e.push(i + "-" + t), e;
      }),
      (a.prototype._buildElement = function () {
        (this.el = document.createElement("div")),
          i(this.el, this._buildClasses("zoom-pane"));
        var t = document.createElement("div");
        i(t, this._buildClasses("zoom-pane-loader")),
          this.el.appendChild(t),
          (this.imgEl = document.createElement("img")),
          this.el.appendChild(this.imgEl);
      }),
      (a.prototype._setImageURL = function (t) {
        this.imgEl.setAttribute("src", t);
      }),
      (a.prototype._setImageSize = function (t, e) {
        (this.imgEl.style.width = t * this.settings.zoomFactor + "px"),
          (this.imgEl.style.height = e * this.settings.zoomFactor + "px");
      }),
      (a.prototype.setPosition = function (t, e, i) {
        var n = this.imgEl.offsetWidth,
          s = this.imgEl.offsetHeight,
          o = this.el.offsetWidth,
          h = this.el.offsetHeight,
          a = o / 2 - n * t,
          l = h / 2 - s * e,
          r = o - n,
          d = h - s,
          c = 0 < r,
          u = 0 < d;
        (s = c ? r / 2 : 0),
          (n = u ? d / 2 : 0),
          (r = c ? r / 2 : r),
          (d = u ? d / 2 : d),
          this.el.parentElement === this.settings.inlineContainer &&
            ((u = window.pageXOffset),
            (c = window.pageYOffset),
            (t =
              i.left + t * i.width - o / 2 + this.settings.inlineOffsetX + u),
            (e =
              i.top + e * i.height - h / 2 + this.settings.inlineOffsetY + c),
            this.settings.containInline &&
              (t < i.left + u
                ? (t = i.left + u)
                : t + o > i.left + i.width + u &&
                  (t = i.left + i.width - o + u),
              e < i.top + c
                ? (e = i.top + c)
                : e + h > i.top + i.height + c &&
                  (e = i.top + i.height - h + c)),
            (this.el.style.left = t + "px"),
            (this.el.style.top = e + "px")),
          this.settings.showWhitespaceAtEdges ||
            (a > s ? (a = s) : a < r && (a = r),
            l > n ? (l = n) : l < d && (l = d)),
          (this.imgEl.style.transform = "translate(" + a + "px, " + l + "px)"),
          (this.imgEl.style.webkitTransform =
            "translate(" + a + "px, " + l + "px)");
      }),
      (a.prototype._removeListenersAndResetClasses = function () {
        this.el.removeEventListener("animationend", this._completeShow, !1),
          this.el.removeEventListener("animationend", this._completeHide, !1),
          this.el.removeEventListener(
            "webkitAnimationEnd",
            this._completeShow,
            !1,
          ),
          this.el.removeEventListener(
            "webkitAnimationEnd",
            this._completeHide,
            !1,
          ),
          n(this.el, this.openClasses),
          n(this.el, this.closingClasses);
      }),
      (a.prototype.show = function (t, e, n) {
        this._removeListenersAndResetClasses(),
          (this.isShowing = !0),
          i(this.el, this.openClasses),
          this.imgEl.getAttribute("src") != t &&
            (i(this.el, this.loadingClasses),
            this.imgEl.addEventListener("load", this._handleLoad, !1),
            this._setImageURL(t)),
          this._setImageSize(e, n),
          this._isInline ? this._showInline() : this._showInContainer(),
          this.HAS_ANIMATION &&
            (this.el.addEventListener("animationend", this._completeShow, !1),
            this.el.addEventListener(
              "webkitAnimationEnd",
              this._completeShow,
              !1,
            ),
            i(this.el, this.openingClasses));
      }),
      (a.prototype._showInline = function () {
        this.settings.inlineContainer.appendChild(this.el),
          i(this.el, this.inlineClasses);
      }),
      (a.prototype._showInContainer = function () {
        this.settings.container.appendChild(this.el);
      }),
      (a.prototype.hide = function () {
        this._removeListenersAndResetClasses(),
          (this.isShowing = !1),
          this.HAS_ANIMATION
            ? (this.el.addEventListener("animationend", this._completeHide, !1),
              this.el.addEventListener(
                "webkitAnimationEnd",
                this._completeHide,
                !1,
              ),
              i(this.el, this.closingClasses))
            : (n(this.el, this.openClasses), n(this.el, this.inlineClasses));
      }),
      (a.prototype._completeShow = function () {
        this.el.removeEventListener("animationend", this._completeShow, !1),
          this.el.removeEventListener(
            "webkitAnimationEnd",
            this._completeShow,
            !1,
          ),
          n(this.el, this.openingClasses);
      }),
      (a.prototype._completeHide = function () {
        this.el.removeEventListener("animationend", this._completeHide, !1),
          this.el.removeEventListener(
            "webkitAnimationEnd",
            this._completeHide,
            !1,
          ),
          n(this.el, this.openClasses),
          n(this.el, this.closingClasses),
          n(this.el, this.inlineClasses),
          (this.el.style.left = ""),
          (this.el.style.top = ""),
          this.el.parentElement === this.settings.container
            ? this.settings.container.removeChild(this.el)
            : this.el.parentElement === this.settings.inlineContainer &&
              this.settings.inlineContainer.removeChild(this.el);
      }),
      (a.prototype._handleLoad = function () {
        this.imgEl.removeEventListener("load", this._handleLoad, !1),
          n(this.el, this.loadingClasses);
      }),
      t.d.global.Object.defineProperties(a.prototype, {
        _isInline: {
          configurable: !0,
          enumerable: !0,
          get: function () {
            var t = this.settings.inline;
            return !0 === t || ("number" == typeof t && window.innerWidth <= t);
          },
        },
      }),
      (l.prototype._buildZoomPane = function () {
        this.zoomPane = new a({
          container: this.settings.paneContainer,
          zoomFactor: this.settings.zoomFactor,
          showWhitespaceAtEdges: this.settings.showWhitespaceAtEdges,
          containInline: this.settings.containInline,
          inline: this.settings.inlinePane,
          namespace: this.settings.namespace,
          inlineOffsetX: this.settings.inlineOffsetX,
          inlineOffsetY: this.settings.inlineOffsetY,
          inlineContainer: this.settings.inlineContainer,
        });
      }),
      (l.prototype._buildTrigger = function () {
        this.trigger = new h({
          el: this.triggerEl,
          zoomPane: this.zoomPane,
          handleTouch: this.settings.handleTouch,
          onShow: this.settings.onShow,
          onHide: this.settings.onHide,
          sourceAttribute: this.settings.sourceAttribute,
          hoverDelay: this.settings.hoverDelay,
          touchDelay: this.settings.touchDelay,
          hoverBoundingBox: this.settings.hoverBoundingBox,
          touchBoundingBox: this.settings.touchBoundingBox,
          namespace: this.settings.namespace,
          zoomFactor: this.settings.zoomFactor,
          boundingBoxContainer: this.settings.boundingBoxContainer,
          passive: this.settings.passive,
        });
      }),
      (l.prototype.setZoomImageURL = function (t) {
        this.zoomPane._setImageURL(t);
      }),
      (l.prototype.disable = function () {
        this.trigger.enabled = !1;
      }),
      (l.prototype.enable = function () {
        this.trigger.enabled = !0;
      }),
      (l.prototype.destroy = function () {
        this.trigger._hide(), this.trigger._unbindEvents();
      }),
      t.d.global.Object.defineProperties(l.prototype, {
        isShowing: {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return this.zoomPane.isShowing;
          },
        },
        zoomFactor: {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return this.settings.zoomFactor;
          },
          set: function (t) {
            (this.settings.zoomFactor = t),
              (this.zoomPane.settings.zoomFactor = t),
              (this.trigger.settings.zoomFactor = t),
              (this.boundingBox.settings.zoomFactor = t);
          },
        },
      }),
      Object.defineProperty(l.prototype, "isShowing", {
        get: function () {
          return this.isShowing;
        },
      }),
      Object.defineProperty(l.prototype, "zoomFactor", {
        get: function () {
          return this.zoomFactor;
        },
        set: function (t) {
          this.zoomFactor = t;
        },
      }),
      (l.prototype.setZoomImageURL = l.prototype.setZoomImageURL),
      (l.prototype.disable = l.prototype.disable),
      (l.prototype.enable = l.prototype.enable),
      (l.prototype.destroy = l.prototype.destroy),
      (window.Drift = l);
  }.call(this || window, (window.__wpcc = window.__wpcc || {})),
  (function (t) {
    "use strict";
    var e = t(window).width(),
      i = t("html");
    T4SThemeSP.ProductZoom = (function () {
      var n = {
          fade_media: "zoom_fade_media",
          fade_infor: "zoom_fade_info",
          enabled: "is-zoom-enabled",
        },
        s = "is--zoom_tp_";
      function o(e) {
        var o,
          h = ((o = e.attr("data-zoom-options")), JSON.parse(o || "{}")),
          a = e.find("[data-ts-zoom-media]"),
          l = e.find("[data-ts-zoom-info]"),
          r = h.isZoomPR
            ? e.find('[data-media-type="image"] [data-master]')
            : e.find("[data-zoom-target]"),
          d = l.find(".product__zoom-wrapper")[0],
          c = h.type,
          u = h.magnify,
          p = (h.touch, h.pr_type),
          m = "external" == c;
        e.addClass(s + c),
          "2" == c &&
            p &&
            ((c = "1"), i.removeClass(s + "external").addClass(s + "inner")),
          r.each(function () {
            var e = t(this),
              i = e[0];
            e.attr("width") || e.attr("data-width"),
              e.attr("width") || e.attr("data-height");
            new Drift(i, {
              sourceAttribute: "data-master",
              zoomFactor: u,
              inlinePane: !m && "inner2" == c,
              containInline: m,
              paneContainer: m ? d : e.parent()[0],
              hoverBoundingBox: m,
              handleTouch: !1,
              onShow: function () {
                a.addClass(n.fade_media), l.addClass(n.fade_infor);
              },
              onHide: function () {
                a.removeClass(n.fade_media), l.removeClass(n.fade_infor);
              },
            });
          });
      }
      return function () {
        var i = t("[data-ts-zoom-main]:not(." + n.enabled + ")");
        0 == i.length ||
          e < 1025 ||
          i.addClass(n.enabled).each(function () {
            o(t(this));
          });
      };
    })();
  })(jQuery_T4NT),
  jQuery_T4NT(document).ready(function () {
    T4SThemeSP.ProductZoom();
  });
