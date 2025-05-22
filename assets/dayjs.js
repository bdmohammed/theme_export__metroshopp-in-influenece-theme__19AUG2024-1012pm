    !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).dayjs=e()}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return b},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O}));


!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.dayjsPluginUTC=e():t.dayjsPluginUTC=e()}(this,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){var e;switch(o(t)){case"string":return/Z$/.test(t)?0:(e=/([+-])(\d{2}):?(\d{2})/.exec(t))&&(+e[3]+60*e[2])*("+"===e[1]?1:-1);case"number":return Number.isNaN(t)?null:Math.abs(t)<16?60*t:t;default:return null}}n.r(e);var i=function(t,e,n){var o=String(t);return!o||o.length>=e?t:"".concat(Array(e+1-o.length).join(n)).concat(t)},s=function(t){var e=Math.abs(t),n=Math.floor(e/60),o=e%60;return"".concat(t<=0?"+":"-").concat(i(n,2,"0"),":").concat(i(o,2,"0"))};function u(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var f=(new Date).getTimezoneOffset(),a=Date.prototype;function c(t){return 6e4*(t-(arguments.length>1&&void 0!==arguments[1]?arguments[1]:f))}var l=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.getTimezoneOffset();!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.$d=new Date(e.getTime()-c(n)),this.$timezoneOffset=n}var e,n,o;return e=t,(n=[{key:"getTimezoneOffset",value:function(){return this.$timezoneOffset}},{key:"setTimezoneOffset",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.$timezoneOffset;this.$d.setTime(this.$d.getTime()+c(this.$timezoneOffset,t)),this.$timezoneOffset=t}}])&&u(e.prototype,n),o&&u(e,o),t}();["toDateString","toLocaleString","toLocaleDateString","toLocaleTimeString","setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth","setSeconds","setTime","setYear","getDate","getDay","getFullYear","getHours","getMilliseconds","getMinutes","getMonth","getSeconds","getYear"].forEach(function(t){l.prototype[t]=function(){return a[t].apply(this.$d,arguments)}}),["toISOString","toUTCString","toGMTString","toJSON","getUTCDate","getUTCDay","getUTCFullYear","getUTCHours","getUTCMilliseconds","getUTCMinutes","getUTCMonth","getUTCSeconds","valueOf","getTime"].forEach(function(t){l.prototype[t]=function(){return a[t].apply(new Date(this.$d.getTime()+c(this.$timezoneOffset)),arguments)}}),["setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds","setUTCMinutes","setUTCMonth","setUTCSeconds"].forEach(function(t){l.prototype[t]=function(){var e=new Date(this.$d.getTime()+c(this.$timezoneOffset));a[t].apply(e,arguments),e.setTime(e.getTime()-c(this.$timezoneOffset)),this.$d=e}}),["toString","toTimeString"].forEach(function(t){l.prototype[t]=function(){return a[t].apply(this.$d,arguments).replace(/GMT(.*)$/,"GMT".concat(s(this.$timezoneOffset)))}});var d=l,p=!1,h=function(t,e){["clone","add","subtract","startOf"].forEach(function(n){t[n]=function(){var t=this.utcOffset();return e[n].apply(this,arguments).utcOffset(t)}}),t.utc=function(){return this.utcOffset(0)},t.local=function(){return this.utcOffset(-f)},t.utcOffset=function(t){if(void 0===t){var e=this.$d.getTimezoneOffset();return 0===e?0:-e}return null!==r(t)&&(this.$d.setTimezoneOffset(-r(t)),this.init()),this},t.toDate=function(){return new Date(this.$d.getTime())},t.isLocal=function(){return this.$d.getTimezoneOffset()===f},t.isUTC=function(){return 0===this.$d.getTimezoneOffset()},t.$set=function(){for(var t,n=this.$d.getTimezoneOffset(),o=arguments.length,r=new Array(o),i=0;i<o;i++)r[i]=arguments[i];return(t=e.$set).call.apply(t,[this].concat(r)),this.$d instanceof Date&&(this.$d=new d(this.$d,n)),this},t.parse=function(t){e.parse.call(this,t);var n=this.$d,o="string"==typeof t.date?r(t.date):null;this.$d=new d(n,null===o?f:-o),p&&this.local(),this.init()}};e.default=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;p=!!t.parseToLocal;var o=e.prototype,i=function(){};i.prototype=o;var s=new i;h(s,o),s.constructor=e.constructor,e.prototype=s,n.utc=function(t){var e=this(t);return"string"==typeof t&&null===r(t)&&(e.$d.$timezoneOffset=0),e.utc()}}}])});

!function(t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = e()
}(this, function() {
  "use strict";
  var t = "minute"
    , e = /[+-]\d\d(?::?\d\d)?/g
    , i = /([+-]|\d\d)/g;
  return function(a, n, o) {
      var s = n.prototype;
      o.utc = function(t) {
          return new n({
              date: t,
              utc: !0,
              args: arguments
          })
      }
      ,
      s.utc = function(e) {
          var i = o(this.toDate(), {
              locale: this.$L,
              utc: !0
          });
          return e ? i.add(this.utcOffset(), t) : i
      }
      ,
      s.local = function() {
          return o(this.toDate(), {
              locale: this.$L,
              utc: !1
          })
      }
      ;
      var r = s.parse;
      s.parse = function(t) {
          t.utc && (this.$u = !0),
          this.$utils().u(t.$offset) || (this.$offset = t.$offset),
          r.call(this, t)
      }
      ;
      var d = s.init;
      s.init = function() {
          if (this.$u) {
              var t = this.$d;
              this.$y = t.getUTCFullYear(),
              this.$M = t.getUTCMonth(),
              this.$D = t.getUTCDate(),
              this.$W = t.getUTCDay(),
              this.$H = t.getUTCHours(),
              this.$m = t.getUTCMinutes(),
              this.$s = t.getUTCSeconds(),
              this.$ms = t.getUTCMilliseconds()
          } else
              d.call(this)
      }
      ;
      var l = s.utcOffset;
      s.utcOffset = function(a, n) {
          var o = this.$utils().u;
          if (o(a))
              return this.$u ? 0 : o(this.$offset) ? l.call(this) : this.$offset;
          if ("string" == typeof a && null === (a = function(t) {
              void 0 === t && (t = "");
              var a = t.match(e);
              if (!a)
                  return null;
              var n = ("" + a[0]).match(i) || ["-", 0, 0]
                , o = 60 * +n[1] + +n[2];
              return 0 === o ? 0 : "+" === n[0] ? o : -o
          }(a)))
              return this;
          var s = Math.abs(a) <= 16 ? 60 * a : a
            , r = this;
          if (n)
              return r.$offset = s,
              r.$u = 0 === a,
              r;
          if (0 !== a) {
              var d = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
              (r = this.local().add(s + d, t)).$offset = s,
              r.$x.$localOffset = d
          } else
              r = this.utc();
          return r
      }
      ;
      var c = s.format;
      s.format = function(t) {
          var e = t || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return c.call(this, e)
      }
      ,
      s.valueOf = function() {
          var t = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || (new Date).getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t
      }
      ,
      s.isUTC = function() {
          return !!this.$u
      }
      ,
      s.toISOString = function() {
          return this.toDate().toISOString()
      }
      ,
      s.toString = function() {
          return this.toDate().toUTCString()
      }
      ;
      var u = s.toDate;
      s.toDate = function(t) {
          return "s" === t && this.$offset ? o(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : u.call(this)
      }
      ;
      var f = s.diff;
      s.diff = function(t, e, i) {
          if (t && this.$u === t.$u)
              return f.call(this, t, e, i);
          var a = this.local()
            , n = o(t).local();
          return f.call(a, n, e, i)
      }
  }
});