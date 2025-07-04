!(function (t) {
  "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
      ? (module.exports = t())
      : (window.noUiSlider = t());
})(function () {
  "use strict";
  var t = "14.6.0";
  function e(t) {
    t.parentElement.removeChild(t);
  }
  function r(t) {
    return null != t;
  }
  function n(t) {
    t.preventDefault();
  }
  function i(t) {
    return "number" == typeof t && !isNaN(t) && isFinite(t);
  }
  function o(t, e, r) {
    0 < r &&
      (u(t, e),
      setTimeout(function () {
        c(t, e);
      }, r));
  }
  function s(t) {
    return Math.max(Math.min(t, 100), 0);
  }
  function a(t) {
    return Array.isArray(t) ? t : [t];
  }
  function l(t) {
    var e = (t = String(t)).split(".");
    return 1 < e.length ? e[1].length : 0;
  }
  function u(t, e) {
    t.classList && !/\s/.test(e)
      ? t.classList.add(e)
      : (t.className += " " + e);
  }
  function c(t, e) {
    t.classList && !/\s/.test(e)
      ? t.classList.remove(e)
      : (t.className = t.className.replace(
          new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"),
          " ",
        ));
  }
  function p(t) {
    var e = void 0 !== window.pageXOffset,
      r = "CSS1Compat" === (t.compatMode || "");
    return {
      x: e
        ? window.pageXOffset
        : r
          ? t.documentElement.scrollLeft
          : t.body.scrollLeft,
      y: e
        ? window.pageYOffset
        : r
          ? t.documentElement.scrollTop
          : t.body.scrollTop,
    };
  }
  function f(t, e) {
    return 100 / (e - t);
  }
  function d(t, e, r) {
    return (100 * e) / (t[r + 1] - t[r]);
  }
  function h(t, e) {
    for (var r = 1; t >= e[r]; ) r += 1;
    return r;
  }
  function m(e, r, n) {
    var o;
    if (("number" == typeof r && (r = [r]), !Array.isArray(r)))
      throw new Error(
        "noUiSlider (" + t + "): 'range' contains invalid value.",
      );
    if (
      !i((o = "min" === e ? 0 : "max" === e ? 100 : parseFloat(e))) ||
      !i(r[0])
    )
      throw new Error("noUiSlider (" + t + "): 'range' value isn't numeric.");
    n.xPct.push(o),
      n.xVal.push(r[0]),
      o
        ? n.xSteps.push(!isNaN(r[1]) && r[1])
        : isNaN(r[1]) || (n.xSteps[0] = r[1]),
      n.xHighestCompleteStep.push(0);
  }
  function g(t, e, r) {
    if (e)
      if (r.xVal[t] !== r.xVal[t + 1]) {
        r.xSteps[t] =
          d([r.xVal[t], r.xVal[t + 1]], e, 0) / f(r.xPct[t], r.xPct[t + 1]);
        var n = (r.xVal[t + 1] - r.xVal[t]) / r.xNumSteps[t],
          i = Math.ceil(Number(n.toFixed(3)) - 1),
          o = r.xVal[t] + r.xNumSteps[t] * i;
        r.xHighestCompleteStep[t] = o;
      } else r.xSteps[t] = r.xHighestCompleteStep[t] = r.xVal[t];
  }
  function v(t, e, r) {
    var n;
    (this.xPct = []),
      (this.xVal = []),
      (this.xSteps = [r || !1]),
      (this.xNumSteps = [!1]),
      (this.xHighestCompleteStep = []),
      (this.snap = e);
    var i = [];
    for (n in t) t.hasOwnProperty(n) && i.push([t[n], n]);
    for (
      i.length && "object" == typeof i[0][0]
        ? i.sort(function (t, e) {
            return t[0][0] - e[0][0];
          })
        : i.sort(function (t, e) {
            return t[0] - e[0];
          }),
        n = 0;
      n < i.length;
      n++
    )
      m(i[n][1], i[n][0], this);
    for (
      this.xNumSteps = this.xSteps.slice(0), n = 0;
      n < this.xNumSteps.length;
      n++
    )
      g(n, this.xNumSteps[n], this);
  }
  (v.prototype.getDistance = function (e) {
    var r,
      n = [];
    for (r = 0; r < this.xNumSteps.length - 1; r++) {
      var i = this.xNumSteps[r];
      if (i && (e / i) % 1 != 0)
        throw new Error(
          "noUiSlider (" +
            t +
            "): 'limit', 'margin' and 'padding' of " +
            this.xPct[r] +
            "% range must be divisible by step.",
        );
      n[r] = d(this.xVal, e, r);
    }
    return n;
  }),
    (v.prototype.getAbsoluteDistance = function (t, e, r) {
      var n,
        i = 0;
      if (t < this.xPct[this.xPct.length - 1])
        for (; t > this.xPct[i + 1]; ) i++;
      else t === this.xPct[this.xPct.length - 1] && (i = this.xPct.length - 2);
      r || t !== this.xPct[i + 1] || i++;
      var o = 1,
        s = e[i],
        a = 0,
        l = 0,
        u = 0,
        c = 0;
      for (
        n = r
          ? (t - this.xPct[i]) / (this.xPct[i + 1] - this.xPct[i])
          : (this.xPct[i + 1] - t) / (this.xPct[i + 1] - this.xPct[i]);
        0 < s;

      )
        (a = this.xPct[i + 1 + c] - this.xPct[i + c]),
          100 < e[i + c] * o + 100 - 100 * n
            ? ((l = a * n), (o = (s - 100 * n) / e[i + c]), (n = 1))
            : ((l = ((e[i + c] * a) / 100) * o), (o = 0)),
          r
            ? ((u -= l), 1 <= this.xPct.length + c && c--)
            : ((u += l), 1 <= this.xPct.length - c && c++),
          (s = e[i + c] * o);
      return t + u;
    }),
    (v.prototype.toStepping = function (t) {
      return (function (t, e, r) {
        if (r >= t.slice(-1)[0]) return 100;
        var n,
          i,
          o = h(r, t),
          s = t[o - 1],
          a = t[o],
          l = e[o - 1],
          u = e[o];
        return (
          l +
          ((i = r),
          d((n = [s, a]), n[0] < 0 ? i + Math.abs(n[0]) : i - n[0], 0) /
            f(l, u))
        );
      })(this.xVal, this.xPct, t);
    }),
    (v.prototype.fromStepping = function (t) {
      return (function (t, e, r) {
        if (100 <= r) return t.slice(-1)[0];
        var n,
          i = h(r, e),
          o = t[i - 1],
          s = t[i],
          a = e[i - 1];
        return (
          (n = [o, s]), ((r - a) * f(a, e[i]) * (n[1] - n[0])) / 100 + n[0]
        );
      })(this.xVal, this.xPct, t);
    }),
    (v.prototype.getStep = function (t) {
      return (function (t, e, r, n) {
        if (100 === n) return n;
        var i,
          o,
          s = h(n, t),
          a = t[s - 1],
          l = t[s];
        return r
          ? (l - a) / 2 < n - a
            ? l
            : a
          : e[s - 1]
            ? t[s - 1] +
              ((i = n - t[s - 1]), (o = e[s - 1]), Math.round(i / o) * o)
            : n;
      })(this.xPct, this.xSteps, this.snap, t);
    }),
    (v.prototype.getDefaultStep = function (t, e, r) {
      var n = h(t, this.xPct);
      return (
        (100 === t || (e && t === this.xPct[n - 1])) &&
          (n = Math.max(n - 1, 1)),
        (this.xVal[n] - this.xVal[n - 1]) / r
      );
    }),
    (v.prototype.getNearbySteps = function (t) {
      var e = h(t, this.xPct);
      return {
        stepBefore: {
          startValue: this.xVal[e - 2],
          step: this.xNumSteps[e - 2],
          highestStep: this.xHighestCompleteStep[e - 2],
        },
        thisStep: {
          startValue: this.xVal[e - 1],
          step: this.xNumSteps[e - 1],
          highestStep: this.xHighestCompleteStep[e - 1],
        },
        stepAfter: {
          startValue: this.xVal[e],
          step: this.xNumSteps[e],
          highestStep: this.xHighestCompleteStep[e],
        },
      };
    }),
    (v.prototype.countStepDecimals = function () {
      var t = this.xNumSteps.map(l);
      return Math.max.apply(null, t);
    }),
    (v.prototype.convert = function (t) {
      return this.getStep(this.toStepping(t));
    });
  var b = {
      to: function (t) {
        return void 0 !== t && t.toFixed(2);
      },
      from: Number,
    },
    x = {
      target: "target",
      base: "base",
      origin: "origin",
      handle: "handle",
      handleLower: "handle-lower",
      handleUpper: "handle-upper",
      touchArea: "touch-area",
      horizontal: "horizontal",
      vertical: "vertical",
      background: "background",
      connect: "connect",
      connects: "connects",
      ltr: "ltr",
      rtl: "rtl",
      textDirectionLtr: "txt-dir-ltr",
      textDirectionRtl: "txt-dir-rtl",
      draggable: "draggable",
      drag: "state-drag",
      tap: "state-tap",
      active: "active",
      tooltip: "tooltip",
      pips: "pips",
      pipsHorizontal: "pips-horizontal",
      pipsVertical: "pips-vertical",
      marker: "marker",
      markerHorizontal: "marker-horizontal",
      markerVertical: "marker-vertical",
      markerNormal: "marker-normal",
      markerLarge: "marker-large",
      markerSub: "marker-sub",
      value: "value",
      valueHorizontal: "value-horizontal",
      valueVertical: "value-vertical",
      valueNormal: "value-normal",
      valueLarge: "value-large",
      valueSub: "value-sub",
    };
  function S(e) {
    if (
      "object" == typeof (r = e) &&
      "function" == typeof r.to &&
      "function" == typeof r.from
    )
      return !0;
    var r;
    throw new Error(
      "noUiSlider (" + t + "): 'format' requires 'to' and 'from' methods.",
    );
  }
  function w(e, r) {
    if (!i(r))
      throw new Error("noUiSlider (" + t + "): 'step' is not numeric.");
    e.singleStep = r;
  }
  function y(e, r) {
    if (!i(r))
      throw new Error(
        "noUiSlider (" + t + "): 'keyboardPageMultiplier' is not numeric.",
      );
    e.keyboardPageMultiplier = r;
  }
  function E(e, r) {
    if (!i(r))
      throw new Error(
        "noUiSlider (" + t + "): 'keyboardDefaultStep' is not numeric.",
      );
    e.keyboardDefaultStep = r;
  }
  function C(e, r) {
    if ("object" != typeof r || Array.isArray(r))
      throw new Error("noUiSlider (" + t + "): 'range' is not an object.");
    if (void 0 === r.min || void 0 === r.max)
      throw new Error(
        "noUiSlider (" + t + "): Missing 'min' or 'max' in 'range'.",
      );
    if (r.min === r.max)
      throw new Error(
        "noUiSlider (" + t + "): 'range' 'min' and 'max' cannot be equal.",
      );
    e.spectrum = new v(r, e.snap, e.singleStep);
  }
  function P(e, r) {
    if (((r = a(r)), !Array.isArray(r) || !r.length))
      throw new Error("noUiSlider (" + t + "): 'start' option is incorrect.");
    (e.handles = r.length), (e.start = r);
  }
  function N(e, r) {
    if ("boolean" != typeof (e.snap = r))
      throw new Error(
        "noUiSlider (" + t + "): 'snap' option must be a boolean.",
      );
  }
  function k(e, r) {
    if ("boolean" != typeof (e.animate = r))
      throw new Error(
        "noUiSlider (" + t + "): 'animate' option must be a boolean.",
      );
  }
  function U(e, r) {
    if ("number" != typeof (e.animationDuration = r))
      throw new Error(
        "noUiSlider (" + t + "): 'animationDuration' option must be a number.",
      );
  }
  function A(e, r) {
    var n,
      i = [!1];
    if (
      ("lower" === r ? (r = [!0, !1]) : "upper" === r && (r = [!1, !0]),
      !0 === r || !1 === r)
    ) {
      for (n = 1; n < e.handles; n++) i.push(r);
      i.push(!1);
    } else {
      if (!Array.isArray(r) || !r.length || r.length !== e.handles + 1)
        throw new Error(
          "noUiSlider (" +
            t +
            "): 'connect' option doesn't match handle count.",
        );
      i = r;
    }
    e.connect = i;
  }
  function V(e, r) {
    switch (r) {
      case "horizontal":
        e.ort = 0;
        break;
      case "vertical":
        e.ort = 1;
        break;
      default:
        throw new Error(
          "noUiSlider (" + t + "): 'orientation' option is invalid.",
        );
    }
  }
  function D(e, r) {
    if (!i(r))
      throw new Error(
        "noUiSlider (" + t + "): 'margin' option must be numeric.",
      );
    0 !== r && (e.margin = e.spectrum.getDistance(r));
  }
  function M(e, r) {
    if (!i(r))
      throw new Error(
        "noUiSlider (" + t + "): 'limit' option must be numeric.",
      );
    if (((e.limit = e.spectrum.getDistance(r)), !e.limit || e.handles < 2))
      throw new Error(
        "noUiSlider (" +
          t +
          "): 'limit' option is only supported on linear sliders with 2 or more handles.",
      );
  }
  function O(e, r) {
    var n;
    if (!i(r) && !Array.isArray(r))
      throw new Error(
        "noUiSlider (" +
          t +
          "): 'padding' option must be numeric or array of exactly 2 numbers.",
      );
    if (Array.isArray(r) && 2 !== r.length && !i(r[0]) && !i(r[1]))
      throw new Error(
        "noUiSlider (" +
          t +
          "): 'padding' option must be numeric or array of exactly 2 numbers.",
      );
    if (0 !== r) {
      for (
        Array.isArray(r) || (r = [r, r]),
          e.padding = [
            e.spectrum.getDistance(r[0]),
            e.spectrum.getDistance(r[1]),
          ],
          n = 0;
        n < e.spectrum.xNumSteps.length - 1;
        n++
      )
        if (e.padding[0][n] < 0 || e.padding[1][n] < 0)
          throw new Error(
            "noUiSlider (" +
              t +
              "): 'padding' option must be a positive number(s).",
          );
      var o = r[0] + r[1],
        s = e.spectrum.xVal[0];
      if (1 < o / (e.spectrum.xVal[e.spectrum.xVal.length - 1] - s))
        throw new Error(
          "noUiSlider (" +
            t +
            "): 'padding' option must not exceed 100% of the range.",
        );
    }
  }
  function L(e, r) {
    switch (r) {
      case "ltr":
        e.dir = 0;
        break;
      case "rtl":
        e.dir = 1;
        break;
      default:
        throw new Error(
          "noUiSlider (" + t + "): 'direction' option was not recognized.",
        );
    }
  }
  function z(e, r) {
    if ("string" != typeof r)
      throw new Error(
        "noUiSlider (" +
          t +
          "): 'behaviour' must be a string containing options.",
      );
    var n = 0 <= r.indexOf("tap"),
      i = 0 <= r.indexOf("drag"),
      o = 0 <= r.indexOf("fixed"),
      s = 0 <= r.indexOf("snap"),
      a = 0 <= r.indexOf("hover"),
      l = 0 <= r.indexOf("unconstrained");
    if (o) {
      if (2 !== e.handles)
        throw new Error(
          "noUiSlider (" +
            t +
            "): 'fixed' behaviour must be used with 2 handles",
        );
      D(e, e.start[1] - e.start[0]);
    }
    if (l && (e.margin || e.limit))
      throw new Error(
        "noUiSlider (" +
          t +
          "): 'unconstrained' behaviour cannot be used with margin or limit",
      );
    e.events = {
      tap: n || s,
      drag: i,
      fixed: o,
      snap: s,
      hover: a,
      unconstrained: l,
    };
  }
  function H(e, r) {
    if (!1 !== r)
      if (!0 === r) {
        e.tooltips = [];
        for (var n = 0; n < e.handles; n++) e.tooltips.push(!0);
      } else {
        if (((e.tooltips = a(r)), e.tooltips.length !== e.handles))
          throw new Error(
            "noUiSlider (" + t + "): must pass a formatter for all handles.",
          );
        e.tooltips.forEach(function (e) {
          if (
            "boolean" != typeof e &&
            ("object" != typeof e || "function" != typeof e.to)
          )
            throw new Error(
              "noUiSlider (" +
                t +
                "): 'tooltips' must be passed a formatter or 'false'.",
            );
        });
      }
  }
  function j(t, e) {
    S((t.ariaFormat = e));
  }
  function F(t, e) {
    S((t.format = e));
  }
  function R(e, r) {
    if ("boolean" != typeof (e.keyboardSupport = r))
      throw new Error(
        "noUiSlider (" + t + "): 'keyboardSupport' option must be a boolean.",
      );
  }
  function T(t, e) {
    t.documentElement = e;
  }
  function B(e, r) {
    if ("string" != typeof r && !1 !== r)
      throw new Error(
        "noUiSlider (" + t + "): 'cssPrefix' must be a string or `false`.",
      );
    e.cssPrefix = r;
  }
  function q(e, r) {
    if ("object" != typeof r)
      throw new Error(
        "noUiSlider (" + t + "): 'cssClasses' must be an object.",
      );
    if ("string" == typeof e.cssPrefix)
      for (var n in ((e.cssClasses = {}), r))
        r.hasOwnProperty(n) && (e.cssClasses[n] = e.cssPrefix + r[n]);
    else e.cssClasses = r;
  }
  function X(e) {
    var n = {
        margin: 0,
        limit: 0,
        padding: 0,
        animate: !0,
        animationDuration: 300,
        ariaFormat: b,
        format: b,
      },
      i = {
        step: { r: !1, t: w },
        keyboardPageMultiplier: { r: !1, t: y },
        keyboardDefaultStep: { r: !1, t: E },
        start: { r: !0, t: P },
        connect: { r: !0, t: A },
        direction: { r: !0, t: L },
        snap: { r: !1, t: N },
        animate: { r: !1, t: k },
        animationDuration: { r: !1, t: U },
        range: { r: !0, t: C },
        orientation: { r: !1, t: V },
        margin: { r: !1, t: D },
        limit: { r: !1, t: M },
        padding: { r: !1, t: O },
        behaviour: { r: !0, t: z },
        ariaFormat: { r: !1, t: j },
        format: { r: !1, t: F },
        tooltips: { r: !1, t: H },
        keyboardSupport: { r: !0, t: R },
        documentElement: { r: !1, t: T },
        cssPrefix: { r: !0, t: B },
        cssClasses: { r: !0, t: q },
      },
      o = {
        connect: !1,
        direction: "ltr",
        behaviour: "tap",
        orientation: "horizontal",
        keyboardSupport: !0,
        cssPrefix: "noUi-",
        cssClasses: x,
        keyboardPageMultiplier: 5,
        keyboardDefaultStep: 10,
      };
    e.format && !e.ariaFormat && (e.ariaFormat = e.format),
      Object.keys(i).forEach(function (s) {
        if (!r(e[s]) && void 0 === o[s]) {
          if (i[s].r)
            throw new Error("noUiSlider (" + t + "): '" + s + "' is required.");
          return !0;
        }
        i[s].t(n, r(e[s]) ? e[s] : o[s]);
      }),
      (n.pips = e.pips);
    var s = document.createElement("div"),
      a = void 0 !== s.style.msTransform,
      l = void 0 !== s.style.transform;
    return (
      (n.transformRule = l
        ? "transform"
        : a
          ? "msTransform"
          : "webkitTransform"),
      (n.style = [
        ["left", "top"],
        ["right", "bottom"],
      ][n.dir][n.ort]),
      n
    );
  }
  return {
    __spectrum: v,
    version: t,
    cssClasses: x,
    create: function (r, i) {
      if (!r || !r.nodeName)
        throw new Error(
          "noUiSlider (" + t + "): create requires a single element, got: " + r,
        );
      if (r.noUiSlider)
        throw new Error(
          "noUiSlider (" + t + "): Slider was already initialized.",
        );
      var l = (function (r, i, l) {
        var f,
          d,
          h,
          m,
          g,
          v,
          b,
          x,
          S = window.navigator.pointerEnabled
            ? { start: "pointerdown", move: "pointermove", end: "pointerup" }
            : window.navigator.msPointerEnabled
              ? {
                  start: "MSPointerDown",
                  move: "MSPointerMove",
                  end: "MSPointerUp",
                }
              : {
                  start: "mousedown touchstart",
                  move: "mousemove touchmove",
                  end: "mouseup touchend",
                },
          w =
            window.CSS &&
            CSS.supports &&
            CSS.supports("touch-action", "none") &&
            (function () {
              var t = !1;
              try {
                var e = Object.defineProperty({}, "passive", {
                  get: function () {
                    t = !0;
                  },
                });
                window.addEventListener("test", null, e);
              } catch (t) {}
              return t;
            })(),
          y = r,
          E = i.spectrum,
          C = [],
          P = [],
          N = [],
          k = 0,
          U = {},
          A = r.ownerDocument,
          V = i.documentElement || A.documentElement,
          D = A.body,
          M = -1,
          O = 0,
          L = 1,
          z = 2,
          H = "rtl" === A.dir || 1 === i.ort ? 0 : 100;
        function j(t, e) {
          var r = A.createElement("div");
          return e && u(r, e), t.appendChild(r), r;
        }
        function F(t, e) {
          var r = j(t, i.cssClasses.origin),
            n = j(r, i.cssClasses.handle);
          return (
            j(n, i.cssClasses.touchArea),
            n.setAttribute("data-handle", e),
            i.keyboardSupport &&
              (n.setAttribute("tabindex", "0"),
              n.addEventListener("keydown", function (t) {
                return (function (t, e) {
                  if (B() || q(e)) return !1;
                  var r = ["Left", "Right"],
                    n = ["Down", "Up"],
                    o = ["PageDown", "PageUp"],
                    s = ["Home", "End"];
                  i.dir && !i.ort
                    ? r.reverse()
                    : i.ort && !i.dir && (n.reverse(), o.reverse());
                  var a,
                    l = t.key.replace("Arrow", ""),
                    u = l === o[0],
                    c = l === o[1],
                    p = l === n[0] || l === r[0] || u,
                    f = l === n[1] || l === r[1] || c,
                    d = l === s[1];
                  if (!(p || f || l === s[0] || d)) return !0;
                  if ((t.preventDefault(), f || p)) {
                    var h = i.keyboardPageMultiplier,
                      m = p ? 0 : 1,
                      g = mt(e)[m];
                    if (null === g) return !1;
                    !1 === g &&
                      (g = E.getDefaultStep(P[e], p, i.keyboardDefaultStep)),
                      (c || u) && (g *= h),
                      (g = Math.max(g, 1e-7)),
                      (g *= p ? -1 : 1),
                      (a = C[e] + g);
                  } else
                    a = d
                      ? i.spectrum.xVal[i.spectrum.xVal.length - 1]
                      : i.spectrum.xVal[0];
                  return (
                    ct(e, E.toStepping(a), !0, !0),
                    it("slide", e),
                    it("update", e),
                    it("change", e),
                    it("set", e),
                    !1
                  );
                })(t, e);
              })),
            n.setAttribute("role", "slider"),
            n.setAttribute(
              "aria-orientation",
              i.ort ? "vertical" : "horizontal",
            ),
            0 === e
              ? u(n, i.cssClasses.handleLower)
              : e === i.handles - 1 && u(n, i.cssClasses.handleUpper),
            r
          );
        }
        function R(t, e) {
          return !!e && j(t, i.cssClasses.connect);
        }
        function T(t, e) {
          return !!i.tooltips[e] && j(t.firstChild, i.cssClasses.tooltip);
        }
        function B() {
          return y.hasAttribute("disabled");
        }
        function q(t) {
          return d[t].hasAttribute("disabled");
        }
        function Y() {
          g &&
            (nt("update.tooltips"),
            g.forEach(function (t) {
              t && e(t);
            }),
            (g = null));
        }
        function _() {
          Y(),
            (g = d.map(T)),
            rt("update.tooltips", function (t, e, r) {
              if (g[e]) {
                var n = t[e];
                !0 !== i.tooltips[e] && (n = i.tooltips[e].to(r[e])),
                  (g[e].innerHTML = n);
              }
            });
        }
        function I(t, e, r) {
          var n = A.createElement("div"),
            o = [];
          (o[O] = i.cssClasses.valueNormal),
            (o[L] = i.cssClasses.valueLarge),
            (o[z] = i.cssClasses.valueSub);
          var s = [];
          (s[O] = i.cssClasses.markerNormal),
            (s[L] = i.cssClasses.markerLarge),
            (s[z] = i.cssClasses.markerSub);
          var a = [i.cssClasses.valueHorizontal, i.cssClasses.valueVertical],
            l = [i.cssClasses.markerHorizontal, i.cssClasses.markerVertical];
          function c(t, e) {
            var r = e === i.cssClasses.value,
              n = r ? o : s;
            return e + " " + (r ? a : l)[i.ort] + " " + n[t];
          }
          return (
            u(n, i.cssClasses.pips),
            u(
              n,
              0 === i.ort
                ? i.cssClasses.pipsHorizontal
                : i.cssClasses.pipsVertical,
            ),
            Object.keys(t).forEach(function (o) {
              !(function (t, o, s) {
                if ((s = e ? e(o, s) : s) !== M) {
                  var a = j(n, !1);
                  (a.className = c(s, i.cssClasses.marker)),
                    (a.style[i.style] = t + "%"),
                    O < s &&
                      (((a = j(n, !1)).className = c(s, i.cssClasses.value)),
                      a.setAttribute("data-value", o),
                      (a.style[i.style] = t + "%"),
                      (a.innerHTML = r.to(o)));
                }
              })(o, t[o][0], t[o][1]);
            }),
            n
          );
        }
        function W() {
          m && (e(m), (m = null));
        }
        function $(e) {
          W();
          var r,
            n,
            i,
            o,
            s,
            a,
            l,
            u,
            c,
            p = e.mode,
            f = e.density || 1,
            d = e.filter || !1,
            h = (function (e, r, n) {
              if ("range" === e || "steps" === e) return E.xVal;
              if ("count" === e) {
                if (r < 2)
                  throw new Error(
                    "noUiSlider (" +
                      t +
                      "): 'values' (>= 2) required for mode 'count'.",
                  );
                var i = r - 1,
                  o = 100 / i;
                for (r = []; i--; ) r[i] = i * o;
                r.push(100), (e = "positions");
              }
              return "positions" === e
                ? r.map(function (t) {
                    return E.fromStepping(n ? E.getStep(t) : t);
                  })
                : "values" === e
                  ? n
                    ? r.map(function (t) {
                        return E.fromStepping(E.getStep(E.toStepping(t)));
                      })
                    : r
                  : void 0;
            })(p, e.values || !1, e.stepped || !1),
            g =
              ((r = f),
              (n = p),
              (i = h),
              (o = {}),
              (s = E.xVal[0]),
              (a = E.xVal[E.xVal.length - 1]),
              (u = l = !1),
              (c = 0),
              (i = i
                .slice()
                .sort(function (t, e) {
                  return t - e;
                })
                .filter(function (t) {
                  return !this[t] && (this[t] = !0);
                }, {}))[0] !== s && (i.unshift(s), (l = !0)),
              i[i.length - 1] !== a && (i.push(a), (u = !0)),
              i.forEach(function (t, e) {
                var s,
                  a,
                  p,
                  f,
                  d,
                  h,
                  m,
                  g,
                  v,
                  b,
                  x = t,
                  S = i[e + 1],
                  w = "steps" === n;
                if (
                  (w && (s = E.xNumSteps[e]),
                  s || (s = S - x),
                  !1 !== x && void 0 !== S)
                )
                  for (
                    s = Math.max(s, 1e-7), a = x;
                    a <= S;
                    a = (a + s).toFixed(7) / 1
                  ) {
                    for (
                      g = (d = (f = E.toStepping(a)) - c) / r,
                        b = d / (v = Math.round(g)),
                        p = 1;
                      p <= v;
                      p += 1
                    )
                      o[(h = c + p * b).toFixed(5)] = [E.fromStepping(h), 0];
                    (m = -1 < i.indexOf(a) ? L : w ? z : O),
                      !e && l && a !== S && (m = 0),
                      (a === S && u) || (o[f.toFixed(5)] = [a, m]),
                      (c = f);
                  }
              }),
              o),
            v = e.format || { to: Math.round };
          return (m = y.appendChild(I(g, d, v)));
        }
        function G() {
          var t = f.getBoundingClientRect(),
            e = "offset" + ["Width", "Height"][i.ort];
          return 0 === i.ort ? t.width || f[e] : t.height || f[e];
        }
        function J(t, e, r, n) {
          var o = function (o) {
              return (
                !!(o = (function (t, e, r) {
                  var n,
                    i,
                    o = 0 === t.type.indexOf("touch"),
                    s = 0 === t.type.indexOf("mouse"),
                    a = 0 === t.type.indexOf("pointer");
                  if ((0 === t.type.indexOf("MSPointer") && (a = !0), o)) {
                    var l = function (t) {
                      return (
                        t.target === r ||
                        r.contains(t.target) ||
                        (t.target.shadowRoot && t.target.shadowRoot.contains(r))
                      );
                    };
                    if ("touchstart" === t.type) {
                      var u = Array.prototype.filter.call(t.touches, l);
                      if (1 < u.length) return !1;
                      (n = u[0].pageX), (i = u[0].pageY);
                    } else {
                      var c = Array.prototype.find.call(t.changedTouches, l);
                      if (!c) return !1;
                      (n = c.pageX), (i = c.pageY);
                    }
                  }
                  return (
                    (e = e || p(A)),
                    (s || a) && ((n = t.clientX + e.x), (i = t.clientY + e.y)),
                    (t.pageOffset = e),
                    (t.points = [n, i]),
                    (t.cursor = s || a),
                    t
                  );
                })(o, n.pageOffset, n.target || e)) &&
                !(B() && !n.doNotReject) &&
                ((s = y),
                (a = i.cssClasses.tap),
                !(
                  (s.classList
                    ? s.classList.contains(a)
                    : new RegExp("\\b" + a + "\\b").test(s.className)) &&
                  !n.doNotReject
                ) &&
                  !(t === S.start && void 0 !== o.buttons && 1 < o.buttons) &&
                  (!n.hover || !o.buttons) &&
                  (w || o.preventDefault(),
                  (o.calcPoint = o.points[i.ort]),
                  void r(o, n)))
              );
              var s, a;
            },
            s = [];
          return (
            t.split(" ").forEach(function (t) {
              e.addEventListener(t, o, !!w && { passive: !0 }), s.push([t, o]);
            }),
            s
          );
        }
        function K(t) {
          var e,
            r,
            n,
            o,
            a,
            l,
            u =
              (100 *
                (t -
                  ((e = f),
                  (r = i.ort),
                  (n = e.getBoundingClientRect()),
                  (a = (o = e.ownerDocument).documentElement),
                  (l = p(o)),
                  /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) &&
                    (l.x = 0),
                  r
                    ? n.top + l.y - a.clientTop
                    : n.left + l.x - a.clientLeft))) /
              G();
          return (u = s(u)), i.dir ? 100 - u : u;
        }
        function Q(t, e) {
          "mouseout" === t.type &&
            "HTML" === t.target.nodeName &&
            null === t.relatedTarget &&
            tt(t, e);
        }
        function Z(t, e) {
          if (
            -1 === navigator.appVersion.indexOf("MSIE 9") &&
            0 === t.buttons &&
            0 !== e.buttonsProperty
          )
            return tt(t, e);
          var r = (i.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
          at(0 < r, (100 * r) / e.baseSize, e.locations, e.handleNumbers);
        }
        function tt(t, e) {
          e.handle && (c(e.handle, i.cssClasses.active), (k -= 1)),
            e.listeners.forEach(function (t) {
              V.removeEventListener(t[0], t[1]);
            }),
            0 === k &&
              (c(y, i.cssClasses.drag),
              ut(),
              t.cursor &&
                ((D.style.cursor = ""),
                D.removeEventListener("selectstart", n))),
            e.handleNumbers.forEach(function (t) {
              it("change", t), it("set", t), it("end", t);
            });
        }
        function et(t, e) {
          if (e.handleNumbers.some(q)) return !1;
          var r;
          1 === e.handleNumbers.length &&
            ((r = d[e.handleNumbers[0]].children[0]),
            (k += 1),
            u(r, i.cssClasses.active)),
            t.stopPropagation();
          var o = [],
            s = J(S.move, V, Z, {
              target: t.target,
              handle: r,
              listeners: o,
              startCalcPoint: t.calcPoint,
              baseSize: G(),
              pageOffset: t.pageOffset,
              handleNumbers: e.handleNumbers,
              buttonsProperty: t.buttons,
              locations: P.slice(),
            }),
            a = J(S.end, V, tt, {
              target: t.target,
              handle: r,
              listeners: o,
              doNotReject: !0,
              handleNumbers: e.handleNumbers,
            }),
            l = J("mouseout", V, Q, {
              target: t.target,
              handle: r,
              listeners: o,
              doNotReject: !0,
              handleNumbers: e.handleNumbers,
            });
          o.push.apply(o, s.concat(a, l)),
            t.cursor &&
              ((D.style.cursor = getComputedStyle(t.target).cursor),
              1 < d.length && u(y, i.cssClasses.drag),
              D.addEventListener("selectstart", n, !1)),
            e.handleNumbers.forEach(function (t) {
              it("start", t);
            });
        }
        function rt(t, e) {
          (U[t] = U[t] || []),
            U[t].push(e),
            "update" === t.split(".")[0] &&
              d.forEach(function (t, e) {
                it("update", e);
              });
        }
        function nt(t) {
          var e = t && t.split(".")[0],
            r = e && t.substring(e.length);
          Object.keys(U).forEach(function (t) {
            var n = t.split(".")[0],
              i = t.substring(n.length);
            (e && e !== n) || (r && r !== i) || delete U[t];
          });
        }
        function it(t, e, r) {
          Object.keys(U).forEach(function (n) {
            var o = n.split(".")[0];
            t === o &&
              U[n].forEach(function (t) {
                t.call(
                  v,
                  C.map(i.format.to),
                  e,
                  C.slice(),
                  r || !1,
                  P.slice(),
                  v,
                );
              });
          });
        }
        function ot(t, e, r, n, o, a) {
          var l;
          return (
            1 < d.length &&
              !i.events.unconstrained &&
              (n &&
                0 < e &&
                ((l = E.getAbsoluteDistance(t[e - 1], i.margin, 0)),
                (r = Math.max(r, l))),
              o &&
                e < d.length - 1 &&
                ((l = E.getAbsoluteDistance(t[e + 1], i.margin, 1)),
                (r = Math.min(r, l)))),
            1 < d.length &&
              i.limit &&
              (n &&
                0 < e &&
                ((l = E.getAbsoluteDistance(t[e - 1], i.limit, 0)),
                (r = Math.min(r, l))),
              o &&
                e < d.length - 1 &&
                ((l = E.getAbsoluteDistance(t[e + 1], i.limit, 1)),
                (r = Math.max(r, l)))),
            i.padding &&
              (0 === e &&
                ((l = E.getAbsoluteDistance(0, i.padding[0], 0)),
                (r = Math.max(r, l))),
              e === d.length - 1 &&
                ((l = E.getAbsoluteDistance(100, i.padding[1], 1)),
                (r = Math.min(r, l)))),
            !((r = s((r = E.getStep(r)))) === t[e] && !a) && r
          );
        }
        function st(t, e) {
          var r = i.ort;
          return (r ? e : t) + ", " + (r ? t : e);
        }
        function at(t, e, r, n) {
          var i = r.slice(),
            o = [!t, t],
            s = [t, !t];
          (n = n.slice()),
            t && n.reverse(),
            1 < n.length
              ? n.forEach(function (t, r) {
                  var n = ot(i, t, i[t] + e, o[r], s[r], !1);
                  !1 === n ? (e = 0) : ((e = n - i[t]), (i[t] = n));
                })
              : (o = s = [!0]);
          var a = !1;
          n.forEach(function (t, n) {
            a = ct(t, r[t] + e, o[n], s[n]) || a;
          }),
            a &&
              n.forEach(function (t) {
                it("update", t), it("slide", t);
              });
        }
        function lt(t, e) {
          return i.dir ? 100 - t - e : t;
        }
        function ut() {
          N.forEach(function (t) {
            var e = 50 < P[t] ? -1 : 1,
              r = 3 + (d.length + e * t);
            d[t].style.zIndex = r;
          });
        }
        function ct(t, e, r, n) {
          return (
            !1 !== (e = ot(P, t, e, r, n, !1)) &&
            ((function (t, e) {
              (P[t] = e), (C[t] = E.fromStepping(e));
              var r = "translate(" + st(10 * (lt(e, 0) - H) + "%", "0") + ")";
              (d[t].style[i.transformRule] = r), pt(t), pt(t + 1);
            })(t, e),
            !0)
          );
        }
        function pt(t) {
          if (h[t]) {
            var e = 0,
              r = 100;
            0 !== t && (e = P[t - 1]), t !== h.length - 1 && (r = P[t]);
            var n = r - e,
              o = "translate(" + st(lt(e, n) + "%", "0") + ")",
              s = "scale(" + st(n / 100, "1") + ")";
            h[t].style[i.transformRule] = o + " " + s;
          }
        }
        function ft(t, e) {
          return null === t || !1 === t || void 0 === t
            ? P[e]
            : ("number" == typeof t && (t = String(t)),
              (t = i.format.from(t)),
              !1 === (t = E.toStepping(t)) || isNaN(t) ? P[e] : t);
        }
        function dt(t, e) {
          var r = a(t),
            n = void 0 === P[0];
          (e = void 0 === e || !!e),
            i.animate && !n && o(y, i.cssClasses.tap, i.animationDuration),
            N.forEach(function (t) {
              ct(t, ft(r[t], t), !0, !1);
            });
          for (var s = 1 === N.length ? 0 : 1; s < N.length; ++s)
            N.forEach(function (t) {
              ct(t, P[t], !0, !0);
            });
          ut(),
            N.forEach(function (t) {
              it("update", t), null !== r[t] && e && it("set", t);
            });
        }
        function ht() {
          var t = C.map(i.format.to);
          return 1 === t.length ? t[0] : t;
        }
        function mt(t) {
          var e = P[t],
            r = E.getNearbySteps(e),
            n = C[t],
            o = r.thisStep.step,
            s = null;
          if (i.snap)
            return [
              n - r.stepBefore.startValue || null,
              r.stepAfter.startValue - n || null,
            ];
          !1 !== o &&
            n + o > r.stepAfter.startValue &&
            (o = r.stepAfter.startValue - n),
            (s =
              n > r.thisStep.startValue
                ? r.thisStep.step
                : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep),
            100 === e ? (o = null) : 0 === e && (s = null);
          var a = E.countStepDecimals();
          return (
            null !== o && !1 !== o && (o = Number(o.toFixed(a))),
            null !== s && !1 !== s && (s = Number(s.toFixed(a))),
            [s, o]
          );
        }
        return (
          u((b = y), i.cssClasses.target),
          0 === i.dir ? u(b, i.cssClasses.ltr) : u(b, i.cssClasses.rtl),
          0 === i.ort
            ? u(b, i.cssClasses.horizontal)
            : u(b, i.cssClasses.vertical),
          u(
            b,
            "rtl" === getComputedStyle(b).direction
              ? i.cssClasses.textDirectionRtl
              : i.cssClasses.textDirectionLtr,
          ),
          (f = j(b, i.cssClasses.base)),
          (function (t, e) {
            var r = j(e, i.cssClasses.connects);
            (d = []), (h = []).push(R(r, t[0]));
            for (var n = 0; n < i.handles; n++)
              d.push(F(e, n)), (N[n] = n), h.push(R(r, t[n + 1]));
          })(i.connect, f),
          (x = i.events).fixed ||
            d.forEach(function (t, e) {
              J(S.start, t.children[0], et, { handleNumbers: [e] });
            }),
          x.tap &&
            J(
              S.start,
              f,
              function (t) {
                if (!t.buttons && !t.touches) return !1;
                t.stopPropagation();
                var e,
                  r,
                  n,
                  s = K(t.calcPoint),
                  a =
                    ((e = s),
                    (n = !(r = 100)),
                    d.forEach(function (t, i) {
                      if (!q(i)) {
                        var o = P[i],
                          s = Math.abs(o - e);
                        (s < r ||
                          (s <= r && o < e) ||
                          (100 === s && 100 === r)) &&
                          ((n = i), (r = s));
                      }
                    }),
                    n);
                if (!1 === a) return !1;
                i.events.snap || o(y, i.cssClasses.tap, i.animationDuration),
                  ct(a, s, !0, !0),
                  ut(),
                  it("slide", a, !0),
                  it("update", a, !0),
                  it("change", a, !0),
                  it("set", a, !0),
                  i.events.snap && et(t, { handleNumbers: [a] });
              },
              {},
            ),
          x.hover &&
            J(
              S.move,
              f,
              function (t) {
                var e = K(t.calcPoint),
                  r = E.getStep(e),
                  n = E.fromStepping(r);
                Object.keys(U).forEach(function (t) {
                  "hover" === t.split(".")[0] &&
                    U[t].forEach(function (t) {
                      t.call(v, n);
                    });
                });
              },
              { hover: !0 },
            ),
          x.drag &&
            h.forEach(function (t, e) {
              if (!1 !== t && 0 !== e && e !== h.length - 1) {
                var r = d[e - 1],
                  n = d[e],
                  o = [t];
                u(t, i.cssClasses.draggable),
                  x.fixed && (o.push(r.children[0]), o.push(n.children[0])),
                  o.forEach(function (t) {
                    J(S.start, t, et, {
                      handles: [r, n],
                      handleNumbers: [e - 1, e],
                    });
                  });
              }
            }),
          dt(i.start),
          i.pips && $(i.pips),
          i.tooltips && _(),
          rt("update", function (t, e, r, n, o) {
            N.forEach(function (t) {
              var e = d[t],
                n = ot(P, t, 0, !0, !0, !0),
                s = ot(P, t, 100, !0, !0, !0),
                a = o[t],
                l = i.ariaFormat.to(r[t]);
              (n = E.fromStepping(n).toFixed(1)),
                (s = E.fromStepping(s).toFixed(1)),
                (a = E.fromStepping(a).toFixed(1)),
                e.children[0].setAttribute("aria-valuemin", n),
                e.children[0].setAttribute("aria-valuemax", s),
                e.children[0].setAttribute("aria-valuenow", a),
                e.children[0].setAttribute("aria-valuetext", l);
            });
          }),
          (v = {
            destroy: function () {
              for (var t in i.cssClasses)
                i.cssClasses.hasOwnProperty(t) && c(y, i.cssClasses[t]);
              for (; y.firstChild; ) y.removeChild(y.firstChild);
              delete y.noUiSlider;
            },
            steps: function () {
              return N.map(mt);
            },
            on: rt,
            off: nt,
            get: ht,
            set: dt,
            setHandle: function (e, r, n) {
              if (!(0 <= (e = Number(e)) && e < N.length))
                throw new Error(
                  "noUiSlider (" + t + "): invalid handle number, got: " + e,
                );
              ct(e, ft(r, e), !0, !0), it("update", e), n && it("set", e);
            },
            reset: function (t) {
              dt(i.start, t);
            },
            __moveHandles: function (t, e, r) {
              at(t, e, P, r);
            },
            options: l,
            updateOptions: function (t, e) {
              var r = ht(),
                n = [
                  "margin",
                  "limit",
                  "padding",
                  "range",
                  "animate",
                  "snap",
                  "step",
                  "format",
                  "pips",
                  "tooltips",
                ];
              n.forEach(function (e) {
                void 0 !== t[e] && (l[e] = t[e]);
              });
              var o = X(l);
              n.forEach(function (e) {
                void 0 !== t[e] && (i[e] = o[e]);
              }),
                (E = o.spectrum),
                (i.margin = o.margin),
                (i.limit = o.limit),
                (i.padding = o.padding),
                i.pips ? $(i.pips) : W(),
                i.tooltips ? _() : Y(),
                (P = []),
                dt(t.start || r, e);
            },
            target: y,
            removePips: W,
            removeTooltips: Y,
            getTooltips: function () {
              return g;
            },
            getOrigins: function () {
              return d;
            },
            pips: $,
          })
        );
      })(r, X(i), i);
      return (r.noUiSlider = l);
    },
  };
});
