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

/* JavaScript Client Detection * (C) viazenetti GmbH (Christian Ludwig) 
https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
http://jsfiddle.net/ChristianL/AVyND/ */
(function (window) {
  'use strict';
  // const getScreenResolutions = () => {
  //   const width = screen.width || '';
  //   const height = screen.height || '';
  //   return `${width} x ${height}`;
  // };

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
      { name: 'Windows 10', regix: /(Windows 10.0|Windows NT 10.0)/ },
      { name: 'Windows 8.1', regix: /(Windows 8.1|Windows NT 6.3)/ },
      { name: 'Windows 8', regix: /(Windows 8|Windows NT 6.2)/ },
      { name: 'Windows 7', regix: /(Windows 7|Windows NT 6.1)/ },
      { name: 'Windows Vista', regix: /Windows NT 6.0/ },
      { name: 'Windows Server 2003', regix: /Windows NT 5.2/ },
      { name: 'Windows XP', regix: /(Windows NT 5.1|Windows XP)/ },
      { name: 'Windows 2000', regix: /(Windows NT 5.0|Windows 2000)/ },
      { name: 'Windows ME', regix: /(Win 9x 4.90|Windows ME)/ },
      { name: 'Windows 98', regix: /(Windows 98|Win98)/ },
      { name: 'Windows 95', regix: /(Windows 95|Win95|Windows_95)/ },
      {
        name: 'Windows NT 4.0',
        regix: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
      },
      { name: 'Windows CE', regix: /Windows CE/ },
      { name: 'Windows 3.11', regix: /Win16/ },
      { name: 'Android', regix: /Android/ },
      { name: 'Open BSD', regix: /OpenBSD/ },
      { name: 'Sun OS', regix: /SunOS/ },
      { name: 'Linux', regix: /(Linux|X11)/ },
      { name: 'iOS', regix: /(iPhone|iPad|iPod)/ },
      { name: 'Mac OS X', regix: /Mac OS X/ },
      { name: 'Mac OS', regix: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { name: 'QNX', regix: /QNX/ },
      { name: 'UNIX', regix: /UNIX/ },
      { name: 'BeOS', regix: /BeOS/ },
      { name: 'OS/2', regix: /OS\/2/ },
      {
        name: 'Search Bot',
        regix:
          /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
      },
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

  // flash (you'll need to include swfobject)
  /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
  // const getFlashVersion = () => {
  //   if (typeof swfobject !== 'undefined' && swfobject.getFlashPlayerVersion) {
  //     const { major, minor, release } = swfobject.getFlashPlayerVersion();
  //     return major > 0 ? `${major}.${minor} r${release}` : 'Not Installed';
  //   }
  //   return 'No Flash';
  // };

  const systemInfo = {
    // screen: getScreenResolutions(),
    ...getBrowserInfo(),
    os: getOperatingSystem(),
    mobile: isMobileDevice(),
    // flashVersion: getFlashVersion(),
    // osVersion: '-',
  };

  // Expose the system information in a global variable
  window.jscd = systemInfo;
})(window);
//https://github.com/faisalman/ua-parser-js/blob/master/dist/ua-parser.min.js
// (function (window, undefined) { "use strict"; var LIBVERSION = "2.0.3", UA_MAX_LENGTH = 500, USER_AGENT = "user-agent", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", UA_BROWSER = "browser", UA_CPU = "cpu", UA_DEVICE = "device", UA_ENGINE = "engine", UA_OS = "os", UA_RESULT = "result", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", MAJOR = "major", MODEL = "model", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", XR = "xr", EMBEDDED = "embedded", INAPP = "inapp", BRANDS = "brands", FORMFACTORS = "formFactors", FULLVERLIST = "fullVersionList", PLATFORM = "platform", PLATFORMVER = "platformVersion", BITNESS = "bitness", CH_HEADER = "sec-ch-ua", CH_HEADER_FULL_VER_LIST = CH_HEADER + "-full-version-list", CH_HEADER_ARCH = CH_HEADER + "-arch", CH_HEADER_BITNESS = CH_HEADER + "-" + BITNESS, CH_HEADER_FORM_FACTORS = CH_HEADER + "-form-factors", CH_HEADER_MOBILE = CH_HEADER + "-" + MOBILE, CH_HEADER_MODEL = CH_HEADER + "-" + MODEL, CH_HEADER_PLATFORM = CH_HEADER + "-" + PLATFORM, CH_HEADER_PLATFORM_VER = CH_HEADER_PLATFORM + "-version", CH_ALL_VALUES = [BRANDS, FULLVERLIST, MOBILE, MODEL, PLATFORM, PLATFORMVER, ARCHITECTURE, FORMFACTORS, BITNESS], AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", GOOGLE = "Google", HUAWEI = "Huawei", LENOVO = "Lenovo", HONOR = "Honor", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", NVIDIA = "Nvidia", ONEPLUS = "OnePlus", OPPO = "OPPO", SAMSUNG = "Samsung", SHARP = "Sharp", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", CHROME = "Chrome", CHROMIUM = "Chromium", CHROMECAST = "Chromecast", EDGE = "Edge", FIREFOX = "Firefox", OPERA = "Opera", FACEBOOK = "Facebook", SOGOU = "Sogou", PREFIX_MOBILE = "Mobile ", SUFFIX_BROWSER = " Browser", WINDOWS = "Windows"; var isWindow = typeof window !== UNDEF_TYPE, NAVIGATOR = isWindow && window.navigator ? window.navigator : undefined, NAVIGATOR_UADATA = NAVIGATOR && NAVIGATOR.userAgentData ? NAVIGATOR.userAgentData : undefined; var extend = function (defaultRgx, extensions) { var mergedRgx = {}; var extraRgx = extensions; if (!isExtensions(extensions)) { extraRgx = {}; for (var i in extensions) { for (var j in extensions[i]) { extraRgx[j] = extensions[i][j].concat(extraRgx[j] ? extraRgx[j] : []) } } } for (var k in defaultRgx) { mergedRgx[k] = extraRgx[k] && extraRgx[k].length % 2 === 0 ? extraRgx[k].concat(defaultRgx[k]) : defaultRgx[k] } return mergedRgx }, enumerize = function (arr) { var enums = {}; for (var i = 0; i < arr.length; i++) { enums[arr[i].toUpperCase()] = arr[i] } return enums }, has = function (str1, str2) { if (typeof str1 === OBJ_TYPE && str1.length > 0) { for (var i in str1) { if (lowerize(str1[i]) == lowerize(str2)) return true } return false } return isString(str1) ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false }, isExtensions = function (obj, deep) { for (var prop in obj) { return /^(browser|cpu|device|engine|os)$/.test(prop) || (deep ? isExtensions(obj[prop]) : false) } }, isString = function (val) { return typeof val === STR_TYPE }, itemListToArray = function (header) { if (!header) return undefined; var arr = []; var tokens = strip(/\\?\"/g, header).split(","); for (var i = 0; i < tokens.length; i++) { if (tokens[i].indexOf(";") > -1) { var token = trim(tokens[i]).split(";v="); arr[i] = { brand: token[0], version: token[1] } } else { arr[i] = trim(tokens[i]) } } return arr }, lowerize = function (str) { return isString(str) ? str.toLowerCase() : str }, majorize = function (version) { return isString(version) ? strip(/[^\d\.]/g, version).split(".")[0] : undefined }, setProps = function (arr) { for (var i in arr) { var propName = arr[i]; if (typeof propName == OBJ_TYPE && propName.length == 2) { this[propName[0]] = propName[1] } else { this[propName] = undefined } } return this }, strip = function (pattern, str) { return isString(str) ? str.replace(pattern, EMPTY) : str }, stripQuotes = function (str) { return strip(/\\?\"/g, str) }, trim = function (str, len) { if (isString(str)) { str = strip(/^\s\s*/, str); return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH) } }; var rgxMapper = function (ua, arrays) { if (!ua || !arrays) return; var i = 0, j, k, p, q, matches, match; while (i < arrays.length && !matches) { var regex = arrays[i], props = arrays[i + 1]; j = k = 0; while (j < regex.length && !matches) { if (!regex[j]) { break } matches = regex[j++].exec(ua); if (!!matches) { for (p = 0; p < props.length; p++) { match = matches[++k]; q = props[p]; if (typeof q === OBJ_TYPE && q.length > 0) { if (q.length === 2) { if (typeof q[1] == FUNC_TYPE) { this[q[0]] = q[1].call(this, match) } else { this[q[0]] = q[1] } } else if (q.length === 3) { if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) { this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined } else { this[q[0]] = match ? match.replace(q[1], q[2]) : undefined } } else if (q.length === 4) { this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined } } else { this[q] = match ? match : undefined } } } } i += 2 } }, strMapper = function (str, map) { for (var i in map) { if (typeof map[i] === OBJ_TYPE && map[i].length > 0) { for (var j = 0; j < map[i].length; j++) { if (has(map[i][j], str)) { return i === UNKNOWN ? undefined : i } } } else if (has(map[i], str)) { return i === UNKNOWN ? undefined : i } } return map.hasOwnProperty("*") ? map["*"] : str }; var windowsVersionMap = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, formFactorsMap = { embedded: "Automotive", mobile: "Mobile", tablet: ["Tablet", "EInk"], smarttv: "TV", wearable: "Watch", xr: ["VR", "XR"], "?": ["Desktop", "Unknown"], "*": undefined }; var defaultRegexes = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [VERSION, [NAME, PREFIX_MOBILE + "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [VERSION, [NAME, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [NAME, VERSION], [/opios[\/ ]+([\w\.]+)/i], [VERSION, [NAME, OPERA + " Mini"]], [/\bop(?:rg)?x\/([\w\.]+)/i], [VERSION, [NAME, OPERA + " GX"]], [/\bopr\/([\w\.]+)/i], [VERSION, [NAME, OPERA]], [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i], [VERSION, [NAME, "Baidu"]], [/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i], [VERSION, [NAME, "Maxthon"]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i, /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:lg |qute)browser)\/([-\w\.]+)/i, /(heytap|ovi|115|surf)browser\/([\d\.]+)/i, /(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i], [NAME, VERSION], [/quark(?:pc)?\/([-\w\.]+)/i], [VERSION, [NAME, "Quark"]], [/\bddg\/([\w\.]+)/i], [VERSION, [NAME, "DuckDuckGo"]], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [VERSION, [NAME, "UCBrowser"]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i, /micromessenger\/([\w\.]+)/i], [VERSION, [NAME, "WeChat"]], [/konqueror\/([\w\.]+)/i], [VERSION, [NAME, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [VERSION, [NAME, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [VERSION, [NAME, "Yandex"]], [/slbrowser\/([\w\.]+)/i], [VERSION, [NAME, "Smart " + LENOVO + SUFFIX_BROWSER]], [/(avast|avg)\/([\w\.]+)/i], [[NAME, /(.+)/, "$1 Secure" + SUFFIX_BROWSER], VERSION], [/\bfocus\/([\w\.]+)/i], [VERSION, [NAME, FIREFOX + " Focus"]], [/\bopt\/([\w\.]+)/i], [VERSION, [NAME, OPERA + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [VERSION, [NAME, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [VERSION, [NAME, "Dolphin"]], [/coast\/([\w\.]+)/i], [VERSION, [NAME, OPERA + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [VERSION, [NAME, "MIUI" + SUFFIX_BROWSER]], [/fxios\/([\w\.-]+)/i], [VERSION, [NAME, PREFIX_MOBILE + FIREFOX]], [/\bqihoobrowser\/?([\w\.]*)/i], [VERSION, [NAME, "360"]], [/\b(qq)\/([\w\.]+)/i], [[NAME, /(.+)/, "$1Browser"], VERSION], [/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i], [[NAME, /(.+)/, "$1" + SUFFIX_BROWSER], VERSION], [/samsungbrowser\/([\w\.]+)/i], [VERSION, [NAME, SAMSUNG + " Internet"]], [/metasr[\/ ]?([\d\.]+)/i], [VERSION, [NAME, SOGOU + " Explorer"]], [/(sogou)mo\w+\/([\d\.]+)/i], [[NAME, SOGOU + " Mobile"], VERSION], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i], [NAME, VERSION], [/(lbbrowser|rekonq)/i], [NAME], [/ome\/([\w\.]+) \w* ?(iron) saf/i, /ome\/([\w\.]+).+qihu (360)[es]e/i], [VERSION, NAME], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[NAME, FACEBOOK], VERSION, [TYPE, INAPP]], [/(Klarna)\/([\w\.]+)/i, /(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /(daum)apps[\/ ]([\w\.]+)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(alipay)client\/([\w\.]+)/i, /(twitter)(?:and| f.+e\/([\w\.]+))/i, /(instagram|snapchat)[\/ ]([-\w\.]+)/i], [NAME, VERSION, [TYPE, INAPP]], [/\bgsa\/([\w\.]+) .*safari\//i], [VERSION, [NAME, "GSA"], [TYPE, INAPP]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [VERSION, [NAME, "TikTok"], [TYPE, INAPP]], [/\[(linkedin)app\]/i], [NAME, [TYPE, INAPP]], [/(chromium)[\/ ]([-\w\.]+)/i], [NAME, VERSION], [/headlesschrome(?:\/([\w\.]+)| )/i], [VERSION, [NAME, CHROME + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[NAME, CHROME + " WebView"], VERSION], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [VERSION, [NAME, "Android" + SUFFIX_BROWSER]], [/chrome\/([\w\.]+) mobile/i], [VERSION, [NAME, PREFIX_MOBILE + "Chrome"]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [NAME, VERSION], [/version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i], [VERSION, [NAME, PREFIX_MOBILE + "Safari"]], [/iphone .*mobile(?:\/\w+ | ?)safari/i], [[NAME, PREFIX_MOBILE + "Safari"]], [/version\/([\w\.\,]+) .*(safari)/i], [VERSION, NAME], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [NAME, [VERSION, "1"]], [/(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [/(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i], [[NAME, PREFIX_MOBILE + FIREFOX], VERSION], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[NAME, "Netscape"], VERSION], [/(wolvic|librewolf)\/([\w\.]+)/i], [NAME, VERSION], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [VERSION, [NAME, FIREFOX + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /\b(links) \(([\w\.]+)/i], [NAME, [VERSION, /_/g, "."]], [/(cobalt)\/([\w\.]+)/i], [NAME, [VERSION, /[^\d\.]+./, EMPTY]]], cpu: [[/\b((amd|x|x86[-_]?|wow|win)64)\b/i], [[ARCHITECTURE, "amd64"]], [/(ia32(?=;))/i, /\b((i[346]|x)86)(pc)?\b/i], [[ARCHITECTURE, "ia32"]], [/\b(aarch64|arm(v?[89]e?l?|_?64))\b/i], [[ARCHITECTURE, "arm64"]], [/\b(arm(v[67])?ht?n?[fl]p?)\b/i], [[ARCHITECTURE, "armhf"]], [/( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i], [[ARCHITECTURE, "arm"]], [/((ppc|powerpc)(64)?)( mac|;|\))/i], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [/ sun4\w[;\)]/i], [[ARCHITECTURE, "sparc"]], [/\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i], [[ARCHITECTURE, lowerize]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]((?!sm-[lr])[-\w]+)/i, /sec-(sgh\w+)/i], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [/(macintosh);/i], [MODEL, [VENDOR, APPLE]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [/\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i], [MODEL, [VENDOR, HONOR], [TYPE, TABLET]], [/honor([-\w ]+)[;\)]/i], [MODEL, [VENDOR, HONOR], [TYPE, MOBILE]], [/\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [/(?:huawei)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [/oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i, /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i], [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, TABLET]], [/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i, / ([\w ]+) miui\/v?\d/i], [[MODEL, /_/g, " "], [VENDOR, XIAOMI], [TYPE, MOBILE]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [MODEL, [VENDOR, OPPO], [TYPE, MOBILE]], [/\b(opd2(\d{3}a?))(?: bui|\))/i], [MODEL, [VENDOR, strMapper, { OnePlus: ["304", "403", "203"], "*": OPPO }], [TYPE, TABLET]], [/(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i], [MODEL, [VENDOR, "BLU"], [TYPE, MOBILE]], [/; vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]], [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i], [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto(?! 360)[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch))(\w+)/i, /\blg-?([\d\w]+) bui/i], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [/(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i, /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i], [MODEL, [VENDOR, LENOVO], [TYPE, TABLET]], [/(nokia) (t[12][01])/i], [VENDOR, MODEL, [TYPE, TABLET]], [/(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i, /nokia[-_ ]?(([-\w\. ]*))/i], [[MODEL, /_/g, " "], [TYPE, MOBILE], [VENDOR, "Nokia"]], [/(pixel (c|tablet))\b/i], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [/droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[MODEL, "Xperia Tablet"], [VENDOR, SONY], [TYPE, TABLET]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [MODEL, [VENDOR, ONEPLUS], [TYPE, MOBILE]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[MODEL, /(.+)/g, "Fire Phone $1"], [VENDOR, AMAZON], [TYPE, MOBILE]], [/(playbook);[-\w\),; ]+(rim)/i], [MODEL, VENDOR, [TYPE, TABLET]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [/(nexus 9)/i], [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]], [/tcl (xess p17aa)/i, /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i], [MODEL, [VENDOR, "TCL"], [TYPE, TABLET]], [/droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i], [MODEL, [VENDOR, "TCL"], [TYPE, MOBILE]], [/(itel) ((\w+))/i], [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { tablet: ["p10001l", "w7001"], "*": "mobile" }]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]], [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i], [MODEL, [VENDOR, "Ulefone"], [TYPE, MOBILE]], [/; (energy ?\w+)(?: bui|\))/i, /; energizer ([\w ]+)(?: bui|\))/i], [MODEL, [VENDOR, "Energizer"], [TYPE, MOBILE]], [/; cat (b35);/i, /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i], [MODEL, [VENDOR, "Cat"], [TYPE, MOBILE]], [/((?:new )?andromax[\w- ]+)(?: bui|\))/i], [MODEL, [VENDOR, "Smartfren"], [TYPE, MOBILE]], [/droid.+; (a(?:015|06[35]|142p?))/i], [MODEL, [VENDOR, "Nothing"], [TYPE, MOBILE]], [/; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i, /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i], [MODEL, [VENDOR, "Archos"], [TYPE, TABLET]], [/archos ([\w ]+)( b|\))/i, /; (ac[3-6]\d\w{2,8})( b|\))/i], [MODEL, [VENDOR, "Archos"], [TYPE, MOBILE]], [/(imo) (tab \w+)/i, /(infinix) (x1101b?)/i], [VENDOR, MODEL, [TYPE, TABLET]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|infinix|tecno|micromax|advan)[-_ ]?([-\w]*)/i, /; (blu|hmd|imo|tcl)[_ ]([\w\+ ]+?)(?: bui|\)|; r)/i, /(hp) ([\w ]+\w)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i, /(oppo) ?([\w ]+) bui/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/(kobo)\s(ereader|touch)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i], [VENDOR, MODEL, [TYPE, TABLET]], [/(surface duo)/i], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]], [/((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i], [MODEL, [VENDOR, NVIDIA], [TYPE, TABLET]], [/(sprint) (\w+)/i], [VENDOR, MODEL, [TYPE, MOBILE]], [/(kin\.[onetw]{3})/i], [[MODEL, /\./g, " "], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [/droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [/smart-tv.+(samsung)/i], [VENDOR, [TYPE, SMARTTV]], [/hbbtv.+maple;(\d+)/i], [[MODEL, /^/, "SmartTV"], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [/tcast.+(lg)e?. ([-\w]+)/i], [VENDOR, MODEL, [TYPE, SMARTTV]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[VENDOR, LG], [TYPE, SMARTTV]], [/(apple) ?tv/i], [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]], [/crkey.*devicetype\/chromecast/i], [[MODEL, CHROMECAST + " Third Generation"], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [/crkey.*devicetype\/([^/]*)/i], [[MODEL, /^/, "Chromecast "], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [/fuchsia.*crkey/i], [[MODEL, CHROMECAST + " Nest Hub"], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [/crkey/i], [[MODEL, CHROMECAST], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [/(portaltv)/i], [MODEL, [VENDOR, FACEBOOK], [TYPE, SMARTTV]], [/droid.+aft(\w+)( bui|\))/i], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [/(shield \w+ tv)/i], [MODEL, [VENDOR, NVIDIA], [TYPE, SMARTTV]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]], [/(bravia[\w ]+)( bui|\))/i], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [/(mi(tv|box)-?\w+) bui/i], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [/Hbbtv.*(technisat) (.*);/i], [VENDOR, MODEL, [TYPE, SMARTTV]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [/droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i], [MODEL, [TYPE, SMARTTV]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[TYPE, SMARTTV]], [/(ouya)/i, /(nintendo) (\w+)/i], [VENDOR, MODEL, [TYPE, CONSOLE]], [/droid.+; (shield)( bui|\))/i], [MODEL, [VENDOR, NVIDIA], [TYPE, CONSOLE]], [/(playstation \w+)/i], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [/\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i], [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]], [/((pebble))app/i, /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i], [VENDOR, MODEL, [TYPE, WEARABLE]], [/(ow(?:19|20)?we?[1-3]{1,3})/i], [MODEL, [VENDOR, OPPO], [TYPE, WEARABLE]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [/(opwwe\d{3})/i], [MODEL, [VENDOR, ONEPLUS], [TYPE, WEARABLE]], [/(moto 360)/i], [MODEL, [VENDOR, MOTOROLA], [TYPE, WEARABLE]], [/(smartwatch 3)/i], [MODEL, [VENDOR, SONY], [TYPE, WEARABLE]], [/(g watch r)/i], [MODEL, [VENDOR, LG], [TYPE, WEARABLE]], [/droid.+; (wt63?0{2,3})\)/i], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [/droid.+; (glass) \d/i], [MODEL, [VENDOR, GOOGLE], [TYPE, XR]], [/(pico) (4|neo3(?: link|pro)?)/i], [VENDOR, MODEL, [TYPE, XR]], [/(quest( \d| pro)?s?).+vr/i], [MODEL, [VENDOR, FACEBOOK], [TYPE, XR]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [VENDOR, [TYPE, EMBEDDED]], [/(aeobc)\b/i], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [/(homepod).+mac os/i], [MODEL, [VENDOR, APPLE], [TYPE, EMBEDDED]], [/windows iot/i], [[TYPE, EMBEDDED]], [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i], [MODEL, [TYPE, strMapper, { mobile: "Mobile", xr: "VR", "*": TABLET }]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[TYPE, TABLET]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[TYPE, MOBILE]], [/droid .+?; ([\w\. -]+)( bui|\))/i], [MODEL, [VENDOR, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [VERSION, [NAME, EDGE + "HTML"]], [/(arkweb)\/([\w\.]+)/i], [NAME, VERSION], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [VERSION, [NAME, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [NAME, VERSION], [/ladybird\//i], [[NAME, "LibWeb"]], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [VERSION, NAME]], os: [[/microsoft (windows) (vista|xp)/i], [NAME, VERSION], [/(windows (?:phone(?: os)?|mobile|iot))[\/ ]?([\d\.\w ]*)/i], [NAME, [VERSION, strMapper, windowsVersionMap]], [/windows nt 6\.2; (arm)/i, /windows[\/ ]([ntce\d\. ]+\w)(?!.+xbox)/i, /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[VERSION, strMapper, windowsVersionMap], [NAME, WINDOWS]], [/[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i, /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[VERSION, /_/g, "."], [NAME, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[NAME, "macOS"], [VERSION, /_/g, "."]], [/android ([\d\.]+).*crkey/i], [VERSION, [NAME, CHROMECAST + " Android"]], [/fuchsia.*crkey\/([\d\.]+)/i], [VERSION, [NAME, CHROMECAST + " Fuchsia"]], [/crkey\/([\d\.]+).*devicetype\/smartspeaker/i], [VERSION, [NAME, CHROMECAST + " SmartSpeaker"]], [/linux.*crkey\/([\d\.]+)/i], [VERSION, [NAME, CHROMECAST + " Linux"]], [/crkey\/([\d\.]+)/i], [VERSION, [NAME, CHROMECAST]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [VERSION, NAME], [/(ubuntu) ([\w\.]+) like android/i], [[NAME, /(.+)/, "$1 Touch"], VERSION], [/(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen|webos)\w*[-\/\.; ]?([\d\.]*)/i], [NAME, VERSION], [/\(bb(10);/i], [VERSION, [NAME, BLACKBERRY]], [/(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i], [VERSION, [NAME, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [VERSION, [NAME, FIREFOX + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [VERSION, [NAME, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [VERSION, [NAME, "watchOS"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[NAME, "Chrome OS"], VERSION], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) (\w+)/i, /(xbox); +xbox ([^\);]+)/i, /(pico) .+os([\w\.]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux)(?: arm\w*| x86\w*| ?)([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [NAME, VERSION], [/(sunos) ?([\w\.\d]*)/i], [[NAME, "Solaris"], VERSION], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [NAME, VERSION]] }; var defaultProps = function () { var props = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} }; setProps.call(props.init, [[UA_BROWSER, [NAME, VERSION, MAJOR, TYPE]], [UA_CPU, [ARCHITECTURE]], [UA_DEVICE, [TYPE, MODEL, VENDOR]], [UA_ENGINE, [NAME, VERSION]], [UA_OS, [NAME, VERSION]]]); setProps.call(props.isIgnore, [[UA_BROWSER, [VERSION, MAJOR]], [UA_ENGINE, [VERSION]], [UA_OS, [VERSION]]]); setProps.call(props.isIgnoreRgx, [[UA_BROWSER, / ?browser$/i], [UA_OS, / ?os$/i]]); setProps.call(props.toString, [[UA_BROWSER, [NAME, VERSION]], [UA_CPU, [ARCHITECTURE]], [UA_DEVICE, [VENDOR, MODEL]], [UA_ENGINE, [NAME, VERSION]], [UA_OS, [NAME, VERSION]]]); return props }(); var createIData = function (item, itemType) { var init_props = defaultProps.init[itemType], is_ignoreProps = defaultProps.isIgnore[itemType] || 0, is_ignoreRgx = defaultProps.isIgnoreRgx[itemType] || 0, toString_props = defaultProps.toString[itemType] || 0; function IData() { setProps.call(this, init_props) } IData.prototype.getItem = function () { return item }; IData.prototype.withClientHints = function () { if (!NAVIGATOR_UADATA) { return item.parseCH().get() } return NAVIGATOR_UADATA.getHighEntropyValues(CH_ALL_VALUES).then(function (res) { return item.setCH(new UACHData(res, false)).parseCH().get() }) }; IData.prototype.withFeatureCheck = function () { return item.detectFeature().get() }; if (itemType != UA_RESULT) { IData.prototype.is = function (strToCheck) { var is = false; for (var i in this) { if (this.hasOwnProperty(i) && !has(is_ignoreProps, i) && lowerize(is_ignoreRgx ? strip(is_ignoreRgx, this[i]) : this[i]) == lowerize(is_ignoreRgx ? strip(is_ignoreRgx, strToCheck) : strToCheck)) { is = true; if (strToCheck != UNDEF_TYPE) break } else if (strToCheck == UNDEF_TYPE && is) { is = !is; break } } return is }; IData.prototype.toString = function () { var str = EMPTY; for (var i in toString_props) { if (typeof this[toString_props[i]] !== UNDEF_TYPE) { str += (str ? " " : EMPTY) + this[toString_props[i]] } } return str || UNDEF_TYPE } } if (!NAVIGATOR_UADATA) { IData.prototype.then = function (cb) { var that = this; var IDataResolve = function () { for (var prop in that) { if (that.hasOwnProperty(prop)) { this[prop] = that[prop] } } }; IDataResolve.prototype = { is: IData.prototype.is, toString: IData.prototype.toString }; var resolveData = new IDataResolve; cb(resolveData); return resolveData } } return new IData }; function UACHData(uach, isHttpUACH) { uach = uach || {}; setProps.call(this, CH_ALL_VALUES); if (isHttpUACH) { setProps.call(this, [[BRANDS, itemListToArray(uach[CH_HEADER])], [FULLVERLIST, itemListToArray(uach[CH_HEADER_FULL_VER_LIST])], [MOBILE, /\?1/.test(uach[CH_HEADER_MOBILE])], [MODEL, stripQuotes(uach[CH_HEADER_MODEL])], [PLATFORM, stripQuotes(uach[CH_HEADER_PLATFORM])], [PLATFORMVER, stripQuotes(uach[CH_HEADER_PLATFORM_VER])], [ARCHITECTURE, stripQuotes(uach[CH_HEADER_ARCH])], [FORMFACTORS, itemListToArray(uach[CH_HEADER_FORM_FACTORS])], [BITNESS, stripQuotes(uach[CH_HEADER_BITNESS])]]) } else { for (var prop in uach) { if (this.hasOwnProperty(prop) && typeof uach[prop] !== UNDEF_TYPE) this[prop] = uach[prop] } } } function UAItem(itemType, ua, rgxMap, uaCH) { this.get = function (prop) { if (!prop) return this.data; return this.data.hasOwnProperty(prop) ? this.data[prop] : undefined }; this.set = function (prop, val) { this.data[prop] = val; return this }; this.setCH = function (ch) { this.uaCH = ch; return this }; this.detectFeature = function () { if (NAVIGATOR && NAVIGATOR.userAgent == this.ua) { switch (this.itemType) { case UA_BROWSER: if (NAVIGATOR.brave && typeof NAVIGATOR.brave.isBrave == FUNC_TYPE) { this.set(NAME, "Brave") } break; case UA_DEVICE: if (!this.get(TYPE) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[MOBILE]) { this.set(TYPE, MOBILE) } if (this.get(MODEL) == "Macintosh" && NAVIGATOR && typeof NAVIGATOR.standalone !== UNDEF_TYPE && NAVIGATOR.maxTouchPoints && NAVIGATOR.maxTouchPoints > 2) { this.set(MODEL, "iPad").set(TYPE, TABLET) } break; case UA_OS: if (!this.get(NAME) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[PLATFORM]) { this.set(NAME, NAVIGATOR_UADATA[PLATFORM]) } break; case UA_RESULT: var data = this.data; var detect = function (itemType) { return data[itemType].getItem().detectFeature().get() }; this.set(UA_BROWSER, detect(UA_BROWSER)).set(UA_CPU, detect(UA_CPU)).set(UA_DEVICE, detect(UA_DEVICE)).set(UA_ENGINE, detect(UA_ENGINE)).set(UA_OS, detect(UA_OS)) } } return this }; this.parseUA = function () { if (this.itemType != UA_RESULT) { rgxMapper.call(this.data, this.ua, this.rgxMap) } if (this.itemType == UA_BROWSER) { this.set(MAJOR, majorize(this.get(VERSION))) } return this }; this.parseCH = function () { var uaCH = this.uaCH, rgxMap = this.rgxMap; switch (this.itemType) { case UA_BROWSER: case UA_ENGINE: var brands = uaCH[FULLVERLIST] || uaCH[BRANDS], prevName; if (brands) { for (var i in brands) { var brandName = brands[i].brand || brands[i], brandVersion = brands[i].version; if (this.itemType == UA_BROWSER && !/not.a.brand/i.test(brandName) && (!prevName || /chrom/i.test(prevName) && brandName != CHROMIUM)) { brandName = strMapper(brandName, { Chrome: "Google Chrome", Edge: "Microsoft Edge", "Chrome WebView": "Android WebView", "Chrome Headless": "HeadlessChrome", "Huawei Browser": "HuaweiBrowser", "MIUI Browser": "Miui Browser", "Opera Mobi": "OperaMobile", Yandex: "YaBrowser" }); this.set(NAME, brandName).set(VERSION, brandVersion).set(MAJOR, majorize(brandVersion)); prevName = brandName } if (this.itemType == UA_ENGINE && brandName == CHROMIUM) { this.set(VERSION, brandVersion) } } } break; case UA_CPU: var archName = uaCH[ARCHITECTURE]; if (archName) { if (archName && uaCH[BITNESS] == "64") archName += "64"; rgxMapper.call(this.data, archName + ";", rgxMap) } break; case UA_DEVICE: if (uaCH[MOBILE]) { this.set(TYPE, MOBILE) } if (uaCH[MODEL]) { this.set(MODEL, uaCH[MODEL]); if (!this.get(TYPE) || !this.get(VENDOR)) { var reParse = {}; rgxMapper.call(reParse, "droid 9; " + uaCH[MODEL] + ")", rgxMap); if (!this.get(TYPE) && !!reParse.type) { this.set(TYPE, reParse.type) } if (!this.get(VENDOR) && !!reParse.vendor) { this.set(VENDOR, reParse.vendor) } } } if (uaCH[FORMFACTORS]) { var ff; if (typeof uaCH[FORMFACTORS] !== "string") { var idx = 0; while (!ff && idx < uaCH[FORMFACTORS].length) { ff = strMapper(uaCH[FORMFACTORS][idx++], formFactorsMap) } } else { ff = strMapper(uaCH[FORMFACTORS], formFactorsMap) } this.set(TYPE, ff) } break; case UA_OS: var osName = uaCH[PLATFORM]; if (osName) { var osVersion = uaCH[PLATFORMVER]; if (osName == WINDOWS) osVersion = parseInt(majorize(osVersion), 10) >= 13 ? "11" : "10"; this.set(NAME, osName).set(VERSION, osVersion) } if (this.get(NAME) == WINDOWS && uaCH[MODEL] == "Xbox") { this.set(NAME, "Xbox").set(VERSION, undefined) } break; case UA_RESULT: var data = this.data; var parse = function (itemType) { return data[itemType].getItem().setCH(uaCH).parseCH().get() }; this.set(UA_BROWSER, parse(UA_BROWSER)).set(UA_CPU, parse(UA_CPU)).set(UA_DEVICE, parse(UA_DEVICE)).set(UA_ENGINE, parse(UA_ENGINE)).set(UA_OS, parse(UA_OS)) }return this }; setProps.call(this, [["itemType", itemType], ["ua", ua], ["uaCH", uaCH], ["rgxMap", rgxMap], ["data", createIData(this, itemType)]]); return this } function UAParser(ua, extensions, headers) { if (typeof ua === OBJ_TYPE) { if (isExtensions(ua, true)) { if (typeof extensions === OBJ_TYPE) { headers = extensions } extensions = ua } else { headers = ua; extensions = undefined } ua = undefined } else if (typeof ua === STR_TYPE && !isExtensions(extensions, true)) { headers = extensions; extensions = undefined } if (headers && typeof headers.append === FUNC_TYPE) { var kv = {}; headers.forEach(function (v, k) { kv[k] = v }); headers = kv } if (!(this instanceof UAParser)) { return new UAParser(ua, extensions, headers).getResult() } var userAgent = typeof ua === STR_TYPE ? ua : headers && headers[USER_AGENT] ? headers[USER_AGENT] : NAVIGATOR && NAVIGATOR.userAgent ? NAVIGATOR.userAgent : EMPTY, httpUACH = new UACHData(headers, true), regexMap = extensions ? extend(defaultRegexes, extensions) : defaultRegexes, createItemFunc = function (itemType) { if (itemType == UA_RESULT) { return function () { return new UAItem(itemType, userAgent, regexMap, httpUACH).set("ua", userAgent).set(UA_BROWSER, this.getBrowser()).set(UA_CPU, this.getCPU()).set(UA_DEVICE, this.getDevice()).set(UA_ENGINE, this.getEngine()).set(UA_OS, this.getOS()).get() } } else { return function () { return new UAItem(itemType, userAgent, regexMap[itemType], httpUACH).parseUA().get() } } }; setProps.call(this, [["getBrowser", createItemFunc(UA_BROWSER)], ["getCPU", createItemFunc(UA_CPU)], ["getDevice", createItemFunc(UA_DEVICE)], ["getEngine", createItemFunc(UA_ENGINE)], ["getOS", createItemFunc(UA_OS)], ["getResult", createItemFunc(UA_RESULT)], ["getUA", function () { return userAgent }], ["setUA", function (ua) { if (isString(ua)) userAgent = ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua; return this }]]).setUA(userAgent); return this } UAParser.VERSION = LIBVERSION; UAParser.BROWSER = enumerize([NAME, VERSION, MAJOR, TYPE]); UAParser.CPU = enumerize([ARCHITECTURE]); UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]); UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]); if (typeof exports !== UNDEF_TYPE) { if (typeof module !== UNDEF_TYPE && module.exports) { exports = module.exports = UAParser } exports.UAParser = UAParser } else { if (typeof define === FUNC_TYPE && define.amd) { define(function () { return UAParser }) } else if (isWindow) { window.UAParser = UAParser } } var $ = isWindow && (window.jQuery || window.Zepto); if ($ && !$.ua) { var parser = new UAParser; $.ua = parser.getResult(); $.ua.get = function () { return parser.getUA() }; $.ua.set = function (ua) { parser.setUA(ua); var result = parser.getResult(); for (var prop in result) { $.ua[prop] = result[prop] } } } })(typeof window === "object" ? window : this);

var jsBdT4s = document.getElementsByTagName('HTML')[0];
var RtlT4s = jsBdT4s.classList.contains('rtl_true');
var LtrT4s = !RtlT4s;
!(function (t, e) {
  'function' == typeof define && define.amd
    ? define(
        'jQuery_T4NT-bridget/jQuery_T4NT-bridget',
        ['jQuery_T4NT'],
        function (i) {
          return e(t, i);
        }
      )
    : 'object' == typeof module && module.exports
    ? (module.exports = e(t, require('jQuery_T4NT')))
    : (t.jQuery_T4NTBridget = e(t, t.jQuery_T4NT));
})(window, function (t, e) {
  'use strict';
  function i(i, o, a) {
    (a = a || e || t.jQuery_T4NT) &&
      (o.prototype.option ||
        (o.prototype.option = function (t) {
          a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t));
        }),
      (a.fn[i] = function (t) {
        return 'string' == typeof t
          ? (function (t, e, n) {
              var s,
                o = '$().' + i + '("' + e + '")';
              return (
                t.each(function (t, h) {
                  var l = a.data(h, i);
                  if (l) {
                    var u = l[e];
                    if (u && '_' != e.charAt(0)) {
                      var c = u.apply(l, n);
                      s = void 0 === s ? c : s;
                    } else r(o + ' is not a valid method');
                  } else r(i + ' not initialized. Cannot call methods, i.e. ' + o);
                }),
                void 0 !== s ? s : t
              );
            })(this, t, s.call(arguments, 1))
          : ((function (t, e) {
              t.each(function (t, n) {
                var s = a.data(n, i);
                s
                  ? (s.option(e), s._init())
                  : ((s = new o(n, e)), a.data(n, i, s));
              });
            })(this, t),
            this);
      }),
      n(a));
  }
  function n(t) {
    !t || (t && t.bridget) || (t.bridget = i);
  }
  var s = Array.prototype.slice,
    o = t.console,
    r =
      void 0 === o
        ? function () {}
        : function (t) {
            o.error(t);
          };
  return n(e || t.jQuery_T4NT), i;
}),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('ev-emitter/ev-emitter', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })('undefined' != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            n = (i[t] = i[t] || []);
          return -1 == n.indexOf(e) && n.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var n = i.indexOf(e);
          return -1 != n && i.splice(n, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var n = this._onceEvents && this._onceEvents[t], s = 0;
            s < i.length;
            s++
          ) {
            var o = i[s];
            n && n[o] && (this.off(t, o), delete n[o]), o.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('get-size/get-size', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    'use strict';
    function t(t) {
      var e = parseFloat(t);
      return -1 == t.indexOf('%') && !isNaN(e) && e;
    }
    function e(t) {
      var e = getComputedStyle(t);
      return (
        e ||
          o(
            'Style returned ' +
              e +
              '. Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1'
          ),
        e
      );
    }
    function i() {
      if (!h) {
        h = !0;
        var i = document.createElement('div');
        (i.style.width = '200px'),
          (i.style.padding = '1px 2px 3px 4px'),
          (i.style.borderStyle = 'solid'),
          (i.style.borderWidth = '1px 2px 3px 4px'),
          (i.style.boxSizing = 'border-box');
        var o = document.body || document.documentElement;
        o.appendChild(i);
        var r = e(i);
        (s = 200 == Math.round(t(r.width))),
          (n.isBoxSizeOuter = s),
          o.removeChild(i);
      }
    }
    function n(n) {
      if (
        (i(),
        'string' == typeof n && (n = document.querySelector(n)),
        n && 'object' == typeof n && n.nodeType)
      ) {
        var o = e(n);
        if ('none' == o.display)
          return (function () {
            for (
              var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0,
                },
                e = 0;
              e < a;
              e++
            )
              t[r[e]] = 0;
            return t;
          })();
        var h = {};
        (h.width = n.offsetWidth), (h.height = n.offsetHeight);
        for (
          var l = (h.isBorderBox = 'border-box' == o.boxSizing), u = 0;
          u < a;
          u++
        ) {
          var c = r[u],
            d = o[c],
            f = parseFloat(d);
          h[c] = isNaN(f) ? 0 : f;
        }
        var p = h.paddingLeft + h.paddingRight,
          m = h.paddingTop + h.paddingBottom,
          g = h.marginLeft + h.marginRight,
          y = h.marginTop + h.marginBottom,
          v = h.borderLeftWidth + h.borderRightWidth,
          _ = h.borderTopWidth + h.borderBottomWidth,
          x = l && s,
          b = t(o.width);
        !1 !== b && (h.width = b + (x ? 0 : p + v));
        var S = t(o.height);
        return (
          !1 !== S && (h.height = S + (x ? 0 : m + _)),
          (h.innerWidth = h.width - (p + v)),
          (h.innerHeight = h.height - (m + _)),
          (h.outerWidth = h.width + g),
          (h.outerHeight = h.height + y),
          h
        );
      }
    }
    var s,
      o =
        'undefined' == typeof console
          ? function () {}
          : function (t) {
              console.error(t);
            },
      r = [
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
      ],
      a = r.length,
      h = !1;
    return n;
  }),
  (function (t, e) {
    'use strict';
    'function' == typeof define && define.amd
      ? define('desandro-matches-selector/matches-selector', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    'use strict';
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return 'matches';
      if (t.matchesSelector) return 'matchesSelector';
      for (var e = ['webkit', 'moz', 'ms', 'o'], i = 0; i < e.length; i++) {
        var n = e[i] + 'MatchesSelector';
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'fizzy-ui-utils/utils',
          ['desandro-matches-selector/matches-selector'],
          function (i) {
            return e(t, i);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('desandro-matches-selector')))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {
        extend: function (t, e) {
          for (var i in e) t[i] = e[i];
          return t;
        },
        modulo: function (t, e) {
          return ((t % e) + e) % e;
        },
      },
      n = Array.prototype.slice;
    (i.makeArray = function (t) {
      return Array.isArray(t)
        ? t
        : null == t
        ? []
        : 'object' == typeof t && 'number' == typeof t.length
        ? n.call(t)
        : [t];
    }),
      (i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        -1 != i && t.splice(i, 1);
      }),
      (i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), e(t, i))) return t;
      }),
      (i.getQueryElement = function (t) {
        return 'string' == typeof t ? document.querySelector(t) : t;
      }),
      (i.handleEvent = function (t) {
        var e = 'on' + t.type;
        this[e] && this[e](t);
      }),
      (i.filterFindElements = function (t, n) {
        t = i.makeArray(t);
        var s = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement) {
              if (!n) return void s.push(t);
              e(t, n) && s.push(t);
              for (var i = t.querySelectorAll(n), o = 0; o < i.length; o++)
                s.push(i[o]);
            }
          }),
          s
        );
      }),
      (i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var n = t.prototype[e],
          s = e + 'Timeout';
        t.prototype[e] = function () {
          var t = this[s];
          clearTimeout(t);
          var e = arguments,
            o = this;
          this[s] = setTimeout(function () {
            n.apply(o, e), delete o[s];
          }, i);
        };
      }),
      (i.docReady = function (t) {
        var e = document.readyState;
        'complete' == e || 'interactive' == e
          ? setTimeout(t)
          : document.addEventListener('DOMContentLoaded', t);
      }),
      (i.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + '-' + i;
          })
          .toLowerCase();
      });
    var s = t.console;
    return (
      (i.htmlInit = function (e, n) {
        i.docReady(function () {
          var o = i.toDashed(n),
            r = 'data-' + o,
            a = document.querySelectorAll('[' + r + ']'),
            h = document.querySelectorAll('.js-' + o),
            l = i.makeArray(a).concat(i.makeArray(h)),
            u = r + '-options',
            c = t.jQuery_T4NT;
          l.forEach(function (t) {
            var i,
              o = t.getAttribute(r) || t.getAttribute(u);
            try {
              i = o && JSON.parse(o);
            } catch (e) {
              return void (
                s &&
                s.error('Error parsing ' + r + ' on ' + t.className + ': ' + e)
              );
            }
            var a = new e(t, i);
            c && c.data(t, n, a);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'outlayer/item',
          ['ev-emitter/ev-emitter', 'get-size/get-size'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('ev-emitter'), require('get-size')))
      : ((t.Outlayer = {}), (t.Outlayer.Item = e(t.EvEmitter, t.getSize)));
  })(window, function (t, e) {
    'use strict';
    function i(t, e) {
      t &&
        ((this.element = t),
        (this.layout = e),
        (this.position = { x: 0, y: 0 }),
        this._create());
    }
    var n = document.documentElement.style,
      s = 'string' == typeof n.transition ? 'transition' : 'WebkitTransition',
      o = 'string' == typeof n.transform ? 'transform' : 'WebkitTransform',
      r = {
        WebkitTransition: 'webkitTransitionEnd',
        transition: 'transitionend',
      }[s],
      a = {
        transform: o,
        transition: s,
        transitionDuration: s + 'Duration',
        transitionProperty: s + 'Property',
        transitionDelay: s + 'Delay',
      },
      h = (i.prototype = Object.create(t.prototype));
    (h.constructor = i),
      (h._create = function () {
        (this._transn = { ingProperties: {}, clean: {}, onEnd: {} }),
          this.css({ position: 'absolute' });
      }),
      (h.handleEvent = function (t) {
        var e = 'on' + t.type;
        this[e] && this[e](t);
      }),
      (h.getSize = function () {
        this.size = e(this.element);
      }),
      (h.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
          e[a[i] || i] = t[i];
        }
      }),
      (h.getPosition = function () {
        var t = getComputedStyle(this.element),
          e = LtrThe4,
          i = this.layout._getOption('originTop'),
          n = t[e ? 'left' : 'right'],
          s = t[i ? 'top' : 'bottom'],
          o = parseFloat(n),
          r = parseFloat(s),
          a = this.layout.size;
        -1 != n.indexOf('%') && (o = (o / 100) * a.width),
          -1 != s.indexOf('%') && (r = (r / 100) * a.height),
          (o = isNaN(o) ? 0 : o),
          (r = isNaN(r) ? 0 : r),
          (o -= e ? a.paddingLeft : a.paddingRight),
          (r -= i ? a.paddingTop : a.paddingBottom),
          (this.position.x = o),
          (this.position.y = r);
      }),
      (h.layoutPosition = function () {
        var t = this.layout.size,
          e = {},
          i = LtrThe4,
          n = this.layout._getOption('originTop'),
          s = i ? 'paddingLeft' : 'paddingRight',
          o = i ? 'left' : 'right',
          r = i ? 'right' : 'left',
          a = this.position.x + t[s];
        (e[o] = this.getXValue(a)), (e[r] = '');
        var h = n ? 'paddingTop' : 'paddingBottom',
          l = n ? 'top' : 'bottom',
          u = n ? 'bottom' : 'top',
          c = this.position.y + t[h];
        (e[l] = this.getYValue(c)),
          (e[u] = ''),
          this.css(e),
          this.emitEvent('layout', [this]);
      }),
      (h.getXValue = function (t) {
        var e = this.layout._getOption('horizontal');
        return this.layout.options.percentPosition && !e
          ? (t / this.layout.size.width) * 100 + '%'
          : t + 'px';
      }),
      (h.getYValue = function (t) {
        var e = this.layout._getOption('horizontal');
        return this.layout.options.percentPosition && e
          ? (t / this.layout.size.height) * 100 + '%'
          : t + 'px';
      }),
      (h._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x,
          n = this.position.y,
          s = t == this.position.x && e == this.position.y;
        if ((this.setPosition(t, e), !s || this.isTransitioning)) {
          var o = t - i,
            r = e - n,
            a = {};
          (a.transform = this.getTranslate(o, r)),
            this.transition({
              to: a,
              onTransitionEnd: { transform: this.layoutPosition },
              isCleaning: !0,
            });
        } else this.layoutPosition();
      }),
      (h.getTranslate = function (t, e) {
        return (
          'translate3d(' +
          (t = LtrThe4 ? t : -t) +
          'px, ' +
          (e = this.layout._getOption('originTop') ? e : -e) +
          'px, 0)'
        );
      }),
      (h.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition();
      }),
      (h.moveTo = h._transitionTo),
      (h.setPosition = function (t, e) {
        (this.position.x = parseFloat(t)), (this.position.y = parseFloat(e));
      }),
      (h._nonTransition = function (t) {
        for (var e in (this.css(t.to),
        t.isCleaning && this._removeStyles(t.to),
        t.onTransitionEnd))
          t.onTransitionEnd[e].call(this);
      }),
      (h.transition = function (t) {
        if (parseFloat(this.layout.options.transitionDuration)) {
          var e = this._transn;
          for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
          for (i in t.to)
            (e.ingProperties[i] = !0), t.isCleaning && (e.clean[i] = !0);
          if (t.from) {
            this.css(t.from);
            this.element.offsetHeight;
            null;
          }
          this.enableTransition(t.to),
            this.css(t.to),
            (this.isTransitioning = !0);
        } else this._nonTransition(t);
      });
    var l =
      'opacity,' +
      (function (t) {
        return t.replace(/([A-Z])/g, function (t) {
          return '-' + t.toLowerCase();
        });
      })(o);
    (h.enableTransition = function () {
      if (!this.isTransitioning) {
        var t = this.layout.options.transitionDuration;
        (t = 'number' == typeof t ? t + 'ms' : t),
          this.css({
            transitionProperty: l,
            transitionDuration: t,
            transitionDelay: this.staggerDelay || 0,
          }),
          this.element.addEventListener(r, this, !1);
      }
    }),
      (h.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t);
      }),
      (h.onotransitionend = function (t) {
        this.ontransitionend(t);
      });
    var u = { '-webkit-transform': 'transform' };
    (h.ontransitionend = function (t) {
      if (t.target === this.element) {
        var e = this._transn,
          i = u[t.propertyName] || t.propertyName;
        if (
          (delete e.ingProperties[i],
          (function (t) {
            for (var e in t) return !1;
            return !0;
          })(e.ingProperties) && this.disableTransition(),
          i in e.clean &&
            ((this.element.style[t.propertyName] = ''), delete e.clean[i]),
          i in e.onEnd)
        )
          e.onEnd[i].call(this), delete e.onEnd[i];
        this.emitEvent('transitionEnd', [this]);
      }
    }),
      (h.disableTransition = function () {
        this.removeTransitionStyles(),
          this.element.removeEventListener(r, this, !1),
          (this.isTransitioning = !1);
      }),
      (h._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = '';
        this.css(e);
      });
    var c = {
      transitionProperty: '',
      transitionDuration: '',
      transitionDelay: '',
    };
    return (
      (h.removeTransitionStyles = function () {
        this.css(c);
      }),
      (h.stagger = function (t) {
        (t = isNaN(t) ? 0 : t), (this.staggerDelay = t + 'ms');
      }),
      (h.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.css({ display: '' }),
          this.emitEvent('remove', [this]);
      }),
      (h.remove = function () {
        return s && parseFloat(this.layout.options.transitionDuration)
          ? (this.once('transitionEnd', function () {
              this.removeElem();
            }),
            void this.hide())
          : void this.removeElem();
      }),
      (h.reveal = function () {
        delete this.isHidden, this.css({ display: '' });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty('visibleStyle')] =
          this.onRevealTransitionEnd),
          this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (h.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent('reveal');
      }),
      (h.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return 'opacity';
        for (var i in e) return i;
      }),
      (h.hide = function () {
        (this.isHidden = !0), this.css({ display: '' });
        var t = this.layout.options,
          e = {};
        (e[this.getHideRevealTransitionEndProperty('hiddenStyle')] =
          this.onHideTransitionEnd),
          this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e,
          });
      }),
      (h.onHideTransitionEnd = function () {
        this.isHidden &&
          (this.css({ display: 'none' }), this.emitEvent('hide'));
      }),
      (h.destroy = function () {
        this.css({
          position: '',
          left: '',
          right: '',
          top: '',
          bottom: '',
          transition: '',
          transform: '',
        });
      }),
      i
    );
  }),
  (function (t, e) {
    'use strict';
    'function' == typeof define && define.amd
      ? define(
          'outlayer/outlayer',
          [
            'ev-emitter/ev-emitter',
            'get-size/get-size',
            'fizzy-ui-utils/utils',
            './item',
          ],
          function (i, n, s, o) {
            return e(t, i, n, s, o);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          t,
          require('ev-emitter'),
          require('get-size'),
          require('fizzy-ui-utils'),
          require('./item')
        ))
      : (t.Outlayer = e(
          t,
          t.EvEmitter,
          t.getSize,
          t.fizzyUIUtils,
          t.Outlayer.Item
        ));
  })(window, function (t, e, i, n, s) {
    'use strict';
    function o(t, e) {
      var i = n.getQueryElement(t);
      if (i) {
        (this.element = i),
          h && (this.$element = h(this.element)),
          (this.options = n.extend({}, this.constructor.defaults)),
          this.option(e);
        var s = ++u;
        (this.element.outlayerGUID = s),
          (c[s] = this),
          this._create(),
          this._getOption('initLayout') && this.layout();
      } else a && a.error('Bad element for ' + this.constructor.namespace + ': ' + (i || t));
    }
    function r(t) {
      function e() {
        t.apply(this, arguments);
      }
      return (
        (e.prototype = Object.create(t.prototype)),
        (e.prototype.constructor = e),
        e
      );
    }
    var a = t.console,
      h = t.jQuery_T4NT,
      l = function () {},
      u = 0,
      c = {};
    (o.namespace = 'outlayer'),
      (o.Item = s),
      (o.defaults = {
        containerStyle: { position: 'relative' },
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: '0.4s',
        hiddenStyle: { opacity: 0, transform: 'scale(0.001)' },
        visibleStyle: { opacity: 1, transform: 'scale(1)' },
      });
    var d = o.prototype;
    n.extend(d, e.prototype),
      (d.option = function (t) {
        n.extend(this.options, t);
      }),
      (d._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e]
          ? this.options[e]
          : this.options[t];
      }),
      (o.compatOptions = {
        initLayout: 'isInitLayout',
        horizontal: 'isHorizontal',
        layoutInstant: 'isLayoutInstant',
        originLeft: 'isOriginLeft',
        originTop: 'isOriginTop',
        resize: 'isResizeBound',
        resizeContainer: 'isResizingContainer',
      }),
      (d._create = function () {
        this.reloadItems(),
          (this.stamps = []),
          this.stamp(this.options.stamp),
          n.extend(this.element.style, this.options.containerStyle),
          this._getOption('resize') && this.bindResize();
      }),
      (d.reloadItems = function () {
        this.items = this._itemize(this.element.children);
      }),
      (d._itemize = function (t) {
        for (
          var e = this._filterFindItemElements(t),
            i = this.constructor.Item,
            n = [],
            s = 0;
          s < e.length;
          s++
        ) {
          var o = new i(e[s], this);
          n.push(o);
        }
        return n;
      }),
      (d._filterFindItemElements = function (t) {
        return n.filterFindElements(t, this.options.itemSelector);
      }),
      (d.getItemElements = function () {
        return this.items.map(function (t) {
          return t.element;
        });
      }),
      (d.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption('layoutInstant'),
          e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), (this._isLayoutInited = !0);
      }),
      (d._init = d.layout),
      (d._resetLayout = function () {
        this.getSize();
      }),
      (d.getSize = function () {
        this.size = i(this.element);
      }),
      (d._getMeasurement = function (t, e) {
        var n,
          s = this.options[t];
        s
          ? ('string' == typeof s
              ? (n = this.element.querySelector(s))
              : s instanceof HTMLElement && (n = s),
            (this[t] = n ? i(n)[e] : s))
          : (this[t] = 0);
      }),
      (d.layoutItems = function (t, e) {
        (t = this._getItemsForLayout(t)),
          this._layoutItems(t, e),
          this._postLayout();
      }),
      (d._getItemsForLayout = function (t) {
        return t.filter(function (t) {
          return !t.isIgnored;
        });
      }),
      (d._layoutItems = function (t, e) {
        if ((this._emitCompleteOnItems('layout', t), t && t.length)) {
          var i = [];
          t.forEach(function (t) {
            var n = this._getItemLayoutPosition(t);
            (n.item = t), (n.isInstant = e || t.isLayoutInstant), i.push(n);
          }, this),
            this._processLayoutQueue(i);
        }
      }),
      (d._getItemLayoutPosition = function () {
        return { x: 0, y: 0 };
      }),
      (d._processLayoutQueue = function (t) {
        this.updateStagger(),
          t.forEach(function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e);
          }, this);
      }),
      (d.updateStagger = function () {
        var t = this.options.stagger;
        return null == t
          ? void (this.stagger = 0)
          : ((this.stagger = (function (t) {
              if ('number' == typeof t) return t;
              var e = t.match(/(^\d*\.?\d*)(\w*)/),
                i = e && e[1],
                n = e && e[2];
              return i.length ? (i = parseFloat(i)) * (f[n] || 1) : 0;
            })(t)),
            this.stagger);
      }),
      (d._positionItem = function (t, e, i, n, s) {
        n ? t.goTo(e, i) : (t.stagger(s * this.stagger), t.moveTo(e, i));
      }),
      (d._postLayout = function () {
        this.resizeContainer();
      }),
      (d.resizeContainer = function () {
        if (this._getOption('resizeContainer')) {
          var t = this._getContainerSize();
          t &&
            (this._setContainerMeasure(t.width, !0),
            this._setContainerMeasure(t.height, !1));
        }
      }),
      (d._getContainerSize = l),
      (d._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
          var i = this.size;
          i.isBorderBox &&
            (t += e
              ? i.paddingLeft +
                i.paddingRight +
                i.borderLeftWidth +
                i.borderRightWidth
              : i.paddingBottom +
                i.paddingTop +
                i.borderTopWidth +
                i.borderBottomWidth),
            (t = Math.max(t, 0)),
            (this.element.style[e ? 'width' : 'height'] = t + 'px');
        }
      }),
      (d._emitCompleteOnItems = function (t, e) {
        function i() {
          s.dispatchEvent(t + 'Complete', null, [e]);
        }
        function n() {
          ++r == o && i();
        }
        var s = this,
          o = e.length;
        if (e && o) {
          var r = 0;
          e.forEach(function (e) {
            e.once(t, n);
          });
        } else i();
      }),
      (d.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, n), h))
          if (((this.$element = this.$element || h(this.element)), e)) {
            var s = h.Event(e);
            (s.type = t), this.$element.trigger(s, i);
          } else this.$element.trigger(t, i);
      }),
      (d.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0);
      }),
      (d.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored;
      }),
      (d.stamp = function (t) {
        (t = this._find(t)) &&
          ((this.stamps = this.stamps.concat(t)), t.forEach(this.ignore, this));
      }),
      (d.unstamp = function (t) {
        (t = this._find(t)) &&
          t.forEach(function (t) {
            n.removeFrom(this.stamps, t), this.unignore(t);
          }, this);
      }),
      (d._find = function (t) {
        if (t)
          return (
            'string' == typeof t && (t = this.element.querySelectorAll(t)),
            n.makeArray(t)
          );
      }),
      (d._manageStamps = function () {
        this.stamps &&
          this.stamps.length &&
          (this._getBoundingRect(),
          this.stamps.forEach(this._manageStamp, this));
      }),
      (d._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(),
          e = this.size;
        this._boundingRect = {
          left: t.left + e.paddingLeft + e.borderLeftWidth,
          top: t.top + e.paddingTop + e.borderTopWidth,
          right: t.right - (e.paddingRight + e.borderRightWidth),
          bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth),
        };
      }),
      (d._manageStamp = l),
      (d._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(),
          n = this._boundingRect,
          s = i(t);
        return {
          left: e.left - n.left - s.marginLeft,
          top: e.top - n.top - s.marginTop,
          right: n.right - e.right - s.marginRight,
          bottom: n.bottom - e.bottom - s.marginBottom,
        };
      }),
      (d.handleEvent = n.handleEvent),
      (d.bindResize = function () {
        t.addEventListener('resize', this), (this.isResizeBound = !0);
      }),
      (d.unbindResize = function () {
        t.removeEventListener('resize', this), (this.isResizeBound = !1);
      }),
      (d.onresize = function () {
        this.resize();
      }),
      n.debounceMethod(o, 'onresize', 100),
      (d.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout();
      }),
      (d.needsResizeLayout = function () {
        var t = i(this.element);
        return this.size && t && t.innerWidth !== this.size.innerWidth;
      }),
      (d.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e;
      }),
      (d.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e));
      }),
      (d.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
          var i = this.items.slice(0);
          (this.items = e.concat(i)),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(e, !0),
            this.reveal(e),
            this.layoutItems(i);
        }
      }),
      (d.reveal = function (t) {
        if ((this._emitCompleteOnItems('reveal', t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.reveal();
          });
        }
      }),
      (d.hide = function (t) {
        if ((this._emitCompleteOnItems('hide', t), t && t.length)) {
          var e = this.updateStagger();
          t.forEach(function (t, i) {
            t.stagger(i * e), t.hide();
          });
        }
      }),
      (d.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e);
      }),
      (d.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e);
      }),
      (d.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
          var i = this.items[e];
          if (i.element == t) return i;
        }
      }),
      (d.getItems = function (t) {
        t = n.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getItem(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (d.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems('remove', e),
          e &&
            e.length &&
            e.forEach(function (t) {
              t.remove(), n.removeFrom(this.items, t);
            }, this);
      }),
      (d.destroy = function () {
        var t = this.element.style;
        (t.height = ''),
          (t.position = ''),
          (t.width = ''),
          this.items.forEach(function (t) {
            t.destroy();
          }),
          this.unbindResize();
        var e = this.element.outlayerGUID;
        delete c[e],
          delete this.element.outlayerGUID,
          h && h.removeData(this.element, this.constructor.namespace);
      }),
      (o.data = function (t) {
        var e = (t = n.getQueryElement(t)) && t.outlayerGUID;
        return e && c[e];
      }),
      (o.create = function (t, e) {
        var i = r(o);
        return (
          (i.defaults = n.extend({}, o.defaults)),
          n.extend(i.defaults, e),
          (i.compatOptions = n.extend({}, o.compatOptions)),
          (i.namespace = t),
          (i.data = o.data),
          (i.Item = r(s)),
          n.htmlInit(i, t),
          h && h.bridget && h.bridget(t, i),
          i
        );
      });
    var f = { ms: 1, s: 1e3 };
    return (o.Item = s), o;
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('isotopet4s-layout/js/item', ['outlayer/outlayer'], e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('outlayer')))
      : ((t.isotopet4s = t.isotopet4s || {}),
        (t.isotopet4s.Item = e(t.Outlayer)));
  })(window, function (t) {
    'use strict';
    function e() {
      t.Item.apply(this, arguments);
    }
    var i = (e.prototype = Object.create(t.Item.prototype)),
      n = i._create;
    (i._create = function () {
      (this.id = this.layout.itemGUID++), n.call(this), (this.sortData = {});
    }),
      (i.updateSortData = function () {
        if (!this.isIgnored) {
          (this.sortData.id = this.id),
            (this.sortData['original-order'] = this.id),
            (this.sortData.random = Math.random());
          var t = this.layout.options.getSortData,
            e = this.layout._sorters;
          for (var i in t) {
            var n = e[i];
            this.sortData[i] = n(this.element, this);
          }
        }
      });
    var s = i.destroy;
    return (
      (i.destroy = function () {
        s.apply(this, arguments), this.css({ display: '' });
      }),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'isotopet4s-layout/js/layout-mode',
          ['get-size/get-size', 'outlayer/outlayer'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('get-size'), require('outlayer')))
      : ((t.isotopet4s = t.isotopet4s || {}),
        (t.isotopet4s.LayoutMode = e(t.getSize, t.Outlayer)));
  })(window, function (t, e) {
    'use strict';
    function i(t) {
      (this.isotopet4s = t),
        t &&
          ((this.options = t.options[this.namespace]),
          (this.element = t.element),
          (this.items = t.filteredItems),
          (this.size = t.size));
    }
    var n = i.prototype;
    return (
      [
        '_resetLayout',
        '_getItemLayoutPosition',
        '_manageStamp',
        '_getContainerSize',
        '_getElementOffset',
        'needsResizeLayout',
        '_getOption',
      ].forEach(function (t) {
        n[t] = function () {
          return e.prototype[t].apply(this.isotopet4s, arguments);
        };
      }),
      (n.needsVerticalResizeLayout = function () {
        var e = t(this.isotopet4s.element);
        return (
          this.isotopet4s.size &&
          e &&
          e.innerHeight != this.isotopet4s.size.innerHeight
        );
      }),
      (n._getMeasurement = function () {
        this.isotopet4s._getMeasurement.apply(this, arguments);
      }),
      (n.getColumnWidth = function () {
        this.getSegmentSize('column', 'Width');
      }),
      (n.getRowHeight = function () {
        this.getSegmentSize('row', 'Height');
      }),
      (n.getSegmentSize = function (t, e) {
        var i = t + e,
          n = 'outer' + e;
        if ((this._getMeasurement(i, n), !this[i])) {
          var s = this.getFirstItemSize();
          this[i] = (s && s[n]) || this.isotopet4s.size['inner' + e];
        }
      }),
      (n.getFirstItemSize = function () {
        var e = this.isotopet4s.filteredItems[0];
        return e && e.element && t(e.element);
      }),
      (n.layout = function () {
        this.isotopet4s.layout.apply(this.isotopet4s, arguments);
      }),
      (n.getSize = function () {
        this.isotopet4s.getSize(), (this.size = this.isotopet4s.size);
      }),
      (i.modes = {}),
      (i.create = function (t, e) {
        function s() {
          i.apply(this, arguments);
        }
        return (
          (s.prototype = Object.create(n)),
          (s.prototype.constructor = s),
          e && (s.options = e),
          (s.prototype.namespace = t),
          (i.modes[t] = s),
          s
        );
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'masonry-layout/masonry',
          ['outlayer/outlayer', 'get-size/get-size'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('outlayer'), require('get-size')))
      : (t.Masonry = e(t.Outlayer, t.getSize));
  })(window, function (t, e) {
    var i = t.create('masonry');
    i.compatOptions.fitWidth = 'isFitWidth';
    var n = i.prototype;
    return (
      (n._resetLayout = function () {
        this.getSize(),
          this._getMeasurement('columnWidth', 'outerWidth'),
          this._getMeasurement('gutter', 'outerWidth'),
          this.measureColumns(),
          (this.colYs = []);
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (n.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var t = this.items[0],
            i = t && t.element;
          this.columnWidth = (i && e(i).outerWidth) || this.containerWidth;
        }
        var n = (this.columnWidth += this.gutter),
          s = this.containerWidth + this.gutter,
          o = s / n,
          r = n - (s % n);
        (o = Math[r && r < 1 ? 'round' : 'floor'](o)),
          (this.cols = Math.max(o, 1));
      }),
      (n.getContainerWidth = function () {
        var t = this._getOption('fitWidth')
            ? this.element.parentNode
            : this.element,
          i = e(t);
        this.containerWidth = i && i.innerWidth;
      }),
      (n._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
          i = Math[e && e < 1 ? 'round' : 'ceil'](
            t.size.outerWidth / this.columnWidth
          );
        i = Math.min(i, this.cols);
        for (
          var n = this[
              this.options.horizontalOrder
                ? '_getHorizontalColPosition'
                : '_getTopColPosition'
            ](i, t),
            s = { x: this.columnWidth * n.col, y: n.y },
            o = n.y + t.size.outerHeight,
            r = i + n.col,
            a = n.col;
          a < r;
          a++
        )
          this.colYs[a] = o;
        return s;
      }),
      (n._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t),
          i = Math.min.apply(Math, e);
        return { col: e.indexOf(i), y: i };
      }),
      (n._getTopColGroup = function (t) {
        if (t < 2) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; n < i; n++)
          e[n] = this._getColGroupY(n, t);
        return e;
      }),
      (n._getColGroupY = function (t, e) {
        if (e < 2) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i);
      }),
      (n._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols;
        i = t > 1 && i + t > this.cols ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return (
          (this.horizontalColIndex = n ? i + t : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, t) }
        );
      }),
      (n._manageStamp = function (t) {
        var i = e(t),
          n = this._getElementOffset(t),
          s = this._getOption('originLeft') ? n.left : n.right,
          o = s + i.outerWidth,
          r = Math.floor(s / this.columnWidth);
        r = Math.max(0, r);
        var a = Math.floor(o / this.columnWidth);
        (a -= o % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
        for (
          var h =
              (this._getOption('originTop') ? n.top : n.bottom) + i.outerHeight,
            l = r;
          l <= a;
          l++
        )
          this.colYs[l] = Math.max(h, this.colYs[l]);
      }),
      (n._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = { height: this.maxY };
        return (
          this._getOption('fitWidth') &&
            (t.width = this._getContainerFitWidth()),
          t
        );
      }),
      (n._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e]; ) t++;
        return (this.cols - t) * this.columnWidth - this.gutter;
      }),
      (n.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth;
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'isotopet4s-layout/js/layout-modes/masonry',
          ['../layout-mode', 'masonry-layout/masonry'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          require('../layout-mode'),
          require('masonry-layout')
        ))
      : e(t.isotopet4s.LayoutMode, t.Masonry);
  })(window, function (t, e) {
    'use strict';
    var i = t.create('masonry'),
      n = i.prototype,
      s = { _getElementOffset: !0, layout: !0, _getMeasurement: !0 };
    for (var o in e.prototype) s[o] || (n[o] = e.prototype[o]);
    var r = n.measureColumns;
    n.measureColumns = function () {
      (this.items = this.isotopet4s.filteredItems), r.call(this);
    };
    var a = n._getOption;
    return (
      (n._getOption = function (t) {
        return 'fitWidth' == t
          ? void 0 !== this.options.isFitWidth
            ? this.options.isFitWidth
            : this.options.fitWidth
          : a.apply(this.isotopet4s, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'isotopet4s-layout/js/layout-modes/fit-rows',
          ['../layout-mode'],
          e
        )
      : 'object' == typeof exports
      ? (module.exports = e(require('../layout-mode')))
      : e(t.isotopet4s.LayoutMode);
  })(window, function (t) {
    'use strict';
    var e = t.create('fitRows'),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        (this.x = 0),
          (this.y = 0),
          (this.maxY = 0),
          this._getMeasurement('gutter', 'outerWidth');
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth + this.gutter,
          i = this.isotopet4s.size.innerWidth + this.gutter;
        0 !== this.x && e + this.x > i && ((this.x = 0), (this.y = this.maxY));
        var n = { x: this.x, y: this.y };
        return (
          (this.maxY = Math.max(this.maxY, this.y + t.size.outerHeight)),
          (this.x += e),
          n
        );
      }),
      (i._getContainerSize = function () {
        return { height: this.maxY };
      }),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'isotopet4s-layout/js/layout-modes/vertical',
          ['../layout-mode'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('../layout-mode')))
      : e(t.isotopet4s.LayoutMode);
  })(window, function (t) {
    'use strict';
    var e = t.create('vertical', { horizontalAlignment: 0 }),
      i = e.prototype;
    return (
      (i._resetLayout = function () {
        this.y = 0;
      }),
      (i._getItemLayoutPosition = function (t) {
        t.getSize();
        var e =
            (this.isotopet4s.size.innerWidth - t.size.outerWidth) *
            this.options.horizontalAlignment,
          i = this.y;
        return (this.y += t.size.outerHeight), { x: e, y: i };
      }),
      (i._getContainerSize = function () {
        return { height: this.y };
      }),
      e
    );
  }),
  (function (t, e) {
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
          function (i, n, s, o, r, a) {
            return e(t, i, n, s, o, r, a);
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
      : (t.isotopet4s = e(
          t,
          t.Outlayer,
          t.getSize,
          t.matchesSelector,
          t.fizzyUIUtils,
          t.isotopet4s.Item,
          t.isotopet4s.LayoutMode
        ));
  })(window, function (t, e, i, n, s, o, r) {
    var a = t.jQuery_T4NT,
      h = String.prototype.trim
        ? function (t) {
            return t.trim();
          }
        : function (t) {
            return t.replace(/^\s+|\s+$/g, '');
          },
      l = e.create('isotopet4s', {
        layoutMode: 'masonry',
        isjQuery_T4NTFiltering: !0,
        sortAscending: !0,
      });
    (l.Item = o), (l.LayoutMode = r);
    var u = l.prototype;
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
        ) {
          t[i].id = this.itemGUID++;
        }
        return this._updateItemsSortData(t), t;
      }),
      (u._initLayoutMode = function (t) {
        var e = r.modes[t],
          i = this.options[t] || {};
        (this.options[t] = e.options ? s.extend(e.options, i) : i),
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
            s.dispatchEvent('arrangeComplete', null, [s.filteredItems]);
        }
        var e,
          i,
          n,
          s = this;
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
          var i = [], n = [], s = [], o = this._getFilterTest(e), r = 0;
          r < t.length;
          r++
        ) {
          var a = t[r];
          if (!a.isIgnored) {
            var h = o(a);
            h && i.push(a),
              h && a.isHidden ? n.push(a) : h || a.isHidden || s.push(a);
          }
        }
        return { matches: i, needReveal: n, needHide: s };
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
        t ? ((t = s.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
          this._getSorters(),
          this._updateItemsSortData(e);
      }),
      (u._getSorters = function () {
        var t = this.options.getSortData;
        for (var e in t) {
          var i = t[e];
          this._sorters[e] = c(i);
        }
      }),
      (u._updateItemsSortData = function (t) {
        for (var e = t && t.length, i = 0; e && i < e; i++) {
          t[i].updateSortData();
        }
      });
    var c = (function () {
      return function (t) {
        if ('string' != typeof t) return t;
        var e = h(t).split(' '),
          i = e[0],
          n = i.match(/^\[(.+)\]$/),
          s = (function (t, e) {
            return t
              ? function (e) {
                  return e.getAttribute(t);
                }
              : function (t) {
                  var i = t.querySelector(e);
                  return i && i.textContent;
                };
          })(n && n[1], i),
          o = l.sortDataParsers[e[1]];
        return o
          ? function (t) {
              return t && o(s(t));
            }
          : function (t) {
              return t && s(t);
            };
      };
    })();
    (l.sortDataParsers = {
      parseInt: function (t) {
        return parseInt(t, 10);
      },
      parseFloat: function (t) {
        return parseFloat(t);
      },
    }),
      (u._sort = function () {
        if (this.options.sortBy) {
          var t = s.makeArray(this.options.sortBy);
          this._getIsSameSortBy(t) ||
            (this.sortHistory = t.concat(this.sortHistory));
          var e = (function (t, e) {
            return function (i, n) {
              for (var s = 0; s < t.length; s++) {
                var o = t[s],
                  r = i.sortData[o],
                  a = n.sortData[o];
                if (r > a || r < a)
                  return (
                    (r > a ? 1 : -1) * ((void 0 !== e[o] ? e[o] : e) ? 1 : -1)
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
            s = e.length;
          for (i = 0; i < s; i++)
            (n = e[i]), this.element.appendChild(n.element);
          var o = this._filter(e).matches;
          for (i = 0; i < s; i++) e[i].isLayoutInstant = !0;
          for (this.arrange(), i = 0; i < s; i++) delete e[i].isLayoutInstant;
          this.reveal(o);
        }
      });
    var d = u.remove;
    return (
      (u.remove = function (t) {
        t = s.makeArray(t);
        var e = this.getItems(t);
        d.call(this, t);
        for (var i = e && e.length, n = 0; i && n < i; n++) {
          var o = e[n];
          s.removeFrom(this.filteredItems, o);
        }
      }),
      (u.shuffle = function () {
        for (var t = 0; t < this.items.length; t++) {
          this.items[t].sortData.random = Math.random();
        }
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
      l
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('packery/js/rect', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : ((t.Packery = t.Packery || {}), (t.Packery.Rect = e()));
  })(window, function () {
    function t(e) {
      for (var i in t.defaults) this[i] = t.defaults[i];
      for (i in e) this[i] = e[i];
    }
    t.defaults = { x: 0, y: 0, width: 0, height: 0 };
    var e = t.prototype;
    return (
      (e.contains = function (t) {
        var e = t.width || 0,
          i = t.height || 0;
        return (
          this.x <= t.x &&
          this.y <= t.y &&
          this.x + this.width >= t.x + e &&
          this.y + this.height >= t.y + i
        );
      }),
      (e.overlaps = function (t) {
        var e = this.x + this.width,
          i = this.y + this.height,
          n = t.x + t.width,
          s = t.y + t.height;
        return this.x < n && e > t.x && this.y < s && i > t.y;
      }),
      (e.getMaximalFreeRects = function (e) {
        if (!this.overlaps(e)) return !1;
        var i,
          n = [],
          s = this.x + this.width,
          o = this.y + this.height,
          r = e.x + e.width,
          a = e.y + e.height;
        return (
          this.y < e.y &&
            ((i = new t({
              x: this.x,
              y: this.y,
              width: this.width,
              height: e.y - this.y,
            })),
            n.push(i)),
          s > r &&
            ((i = new t({
              x: r,
              y: this.y,
              width: s - r,
              height: this.height,
            })),
            n.push(i)),
          o > a &&
            ((i = new t({ x: this.x, y: a, width: this.width, height: o - a })),
            n.push(i)),
          this.x < e.x &&
            ((i = new t({
              x: this.x,
              y: this.y,
              width: e.x - this.x,
              height: this.height,
            })),
            n.push(i)),
          n
        );
      }),
      (e.canFit = function (t) {
        return this.width >= t.width && this.height >= t.height;
      }),
      t
    );
  }),
  (function (t, e) {
    if ('function' == typeof define && define.amd)
      define('packery/js/packer', ['./rect'], e);
    else if ('object' == typeof module && module.exports)
      module.exports = e(require('./rect'));
    else {
      var i = (t.Packery = t.Packery || {});
      i.Packer = e(i.Rect);
    }
  })(window, function (t) {
    function e(t, e, i) {
      (this.width = t || 0),
        (this.height = e || 0),
        (this.sortDirection = i || 'downwardLeftToRight'),
        this.reset();
    }
    var i = e.prototype;
    (i.reset = function () {
      this.spaces = [];
      var e = new t({ x: 0, y: 0, width: this.width, height: this.height });
      this.spaces.push(e),
        (this.sorter = n[this.sortDirection] || n.downwardLeftToRight);
    }),
      (i.pack = function (t) {
        for (var e = 0; e < this.spaces.length; e++) {
          var i = this.spaces[e];
          if (i.canFit(t)) {
            this.placeInSpace(t, i);
            break;
          }
        }
      }),
      (i.columnPack = function (t) {
        for (var e = 0; e < this.spaces.length; e++) {
          var i = this.spaces[e];
          if (
            i.x <= t.x &&
            i.x + i.width >= t.x + t.width &&
            i.height >= t.height - 0.01
          ) {
            (t.y = i.y), this.placed(t);
            break;
          }
        }
      }),
      (i.rowPack = function (t) {
        for (var e = 0; e < this.spaces.length; e++) {
          var i = this.spaces[e];
          if (
            i.y <= t.y &&
            i.y + i.height >= t.y + t.height &&
            i.width >= t.width - 0.01
          ) {
            (t.x = i.x), this.placed(t);
            break;
          }
        }
      }),
      (i.placeInSpace = function (t, e) {
        (t.x = e.x), (t.y = e.y), this.placed(t);
      }),
      (i.placed = function (t) {
        for (var e = [], i = 0; i < this.spaces.length; i++) {
          var n = this.spaces[i],
            s = n.getMaximalFreeRects(t);
          s ? e.push.apply(e, s) : e.push(n);
        }
        (this.spaces = e), this.mergeSortSpaces();
      }),
      (i.mergeSortSpaces = function () {
        e.mergeRects(this.spaces), this.spaces.sort(this.sorter);
      }),
      (i.addSpace = function (t) {
        this.spaces.push(t), this.mergeSortSpaces();
      }),
      (e.mergeRects = function (t) {
        var e = 0,
          i = t[e];
        t: for (; i; ) {
          for (var n = 0, s = t[e + n]; s; ) {
            if (s == i) n++;
            else {
              if (s.contains(i)) {
                t.splice(e, 1), (i = t[e]);
                continue t;
              }
              i.contains(s) ? t.splice(e + n, 1) : n++;
            }
            s = t[e + n];
          }
          i = t[++e];
        }
        return t;
      });
    var n = {
      downwardLeftToRight: function (t, e) {
        return t.y - e.y || t.x - e.x;
      },
      rightwardTopToBottom: function (t, e) {
        return t.x - e.x || t.y - e.y;
      },
    };
    return e;
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('packery/js/item', ['outlayer/outlayer', './rect'], e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('outlayer'), require('./rect')))
      : (t.Packery.Item = e(t.Outlayer, t.Packery.Rect));
  })(window, function (t, e) {
    var i =
        'string' == typeof document.documentElement.style.transform
          ? 'transform'
          : 'WebkitTransform',
      n = function () {
        t.Item.apply(this, arguments);
      },
      s = (n.prototype = Object.create(t.Item.prototype)),
      o = s._create;
    s._create = function () {
      o.call(this), (this.rect = new e());
    };
    var r = s.moveTo;
    return (
      (s.moveTo = function (t, e) {
        var i = Math.abs(this.position.x - t),
          n = Math.abs(this.position.y - e);
        return this.layout.dragItemCount &&
          !this.isPlacing &&
          !this.isTransitioning &&
          1 > i &&
          1 > n
          ? void this.goTo(t, e)
          : void r.apply(this, arguments);
      }),
      (s.enablePlacing = function () {
        this.removeTransitionStyles(),
          this.isTransitioning && i && (this.element.style[i] = 'none'),
          (this.isTransitioning = !1),
          this.getSize(),
          this.layout._setRectSize(this.element, this.rect),
          (this.isPlacing = !0);
      }),
      (s.disablePlacing = function () {
        this.isPlacing = !1;
      }),
      (s.removeElem = function () {
        this.element.parentNode.removeChild(this.element),
          this.layout.packer.addSpace(this.rect),
          this.emitEvent('remove', [this]);
      }),
      (s.showDropPlaceholder = function () {
        var t = this.dropPlaceholder;
        t ||
          (((t = this.dropPlaceholder =
            document.createElement('div')).className =
            'packery-drop-placeholder'),
          (t.style.position = 'absolute')),
          (t.style.width = this.size.width + 'px'),
          (t.style.height = this.size.height + 'px'),
          this.positionDropPlaceholder(),
          this.layout.element.appendChild(t);
      }),
      (s.positionDropPlaceholder = function () {
        this.dropPlaceholder.style[i] =
          'translate(' + this.rect.x + 'px, ' + this.rect.y + 'px)';
      }),
      (s.hideDropPlaceholder = function () {
        this.layout.element.removeChild(this.dropPlaceholder);
      }),
      n
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'packery/js/packery',
          [
            'get-size/get-size',
            'outlayer/outlayer',
            './rect',
            './packer',
            './item',
          ],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          require('get-size'),
          require('outlayer'),
          require('./rect'),
          require('./packer'),
          require('./item')
        ))
      : (t.Packery = e(
          t.getSize,
          t.Outlayer,
          t.Packery.Rect,
          t.Packery.Packer,
          t.Packery.Item
        ));
  })(window, function (t, e, i, n, s) {
    function o(t, e) {
      return t.position.y - e.position.y || t.position.x - e.position.x;
    }
    function r(t, e) {
      return t.position.x - e.position.x || t.position.y - e.position.y;
    }
    i.prototype.canFit = function (t) {
      return this.width >= t.width - 1 && this.height >= t.height - 1;
    };
    var a = e.create('packery');
    a.Item = s;
    var h = a.prototype;
    (h._create = function () {
      e.prototype._create.call(this),
        (this.packer = new n()),
        (this.shiftPacker = new n()),
        (this.isEnabled = !0),
        (this.dragItemCount = 0);
      var t = this;
      (this.handleDraggabilly = {
        dragStart: function () {
          t.itemDragStart(this.element);
        },
        dragMove: function () {
          t.itemDragMove(this.element, this.position.x, this.position.y);
        },
        dragEnd: function () {
          t.itemDragEnd(this.element);
        },
      }),
        (this.handleUIDraggable = {
          start: function (e, i) {
            i && t.itemDragStart(e.currentTarget);
          },
          drag: function (e, i) {
            i &&
              t.itemDragMove(e.currentTarget, i.position.left, i.position.top);
          },
          stop: function (e, i) {
            i && t.itemDragEnd(e.currentTarget);
          },
        });
    }),
      (h._resetLayout = function () {
        var t, e, i;
        this.getSize(),
          this._getMeasurements(),
          this._getOption('horizontal')
            ? ((t = 1 / 0),
              (e = this.size.innerHeight + this.gutter),
              (i = 'rightwardTopToBottom'))
            : ((t = this.size.innerWidth + this.gutter),
              (e = 1 / 0),
              (i = 'downwardLeftToRight')),
          (this.packer.width = this.shiftPacker.width = t),
          (this.packer.height = this.shiftPacker.height = e),
          (this.packer.sortDirection = this.shiftPacker.sortDirection = i),
          this.packer.reset(),
          (this.maxY = 0),
          (this.maxX = 0);
      }),
      (h._getMeasurements = function () {
        this._getMeasurement('columnWidth', 'width'),
          this._getMeasurement('rowHeight', 'height'),
          this._getMeasurement('gutter', 'width');
      }),
      (h._getItemLayoutPosition = function (t) {
        if (
          (this._setRectSize(t.element, t.rect),
          this.isShifting || this.dragItemCount > 0)
        ) {
          var e = this._getPackMethod();
          this.packer[e](t.rect);
        } else this.packer.pack(t.rect);
        return this._setMaxXY(t.rect), t.rect;
      }),
      (h.shiftLayout = function () {
        (this.isShifting = !0), this.layout(), delete this.isShifting;
      }),
      (h._getPackMethod = function () {
        return this._getOption('horizontal') ? 'rowPack' : 'columnPack';
      }),
      (h._setMaxXY = function (t) {
        (this.maxX = Math.max(t.x + t.width, this.maxX)),
          (this.maxY = Math.max(t.y + t.height, this.maxY));
      }),
      (h._setRectSize = function (e, i) {
        var n = t(e),
          s = n.outerWidth,
          o = n.outerHeight;
        (s || o) &&
          ((s = this._applyGridGutter(s, this.columnWidth)),
          (o = this._applyGridGutter(o, this.rowHeight))),
          (i.width = Math.min(s, this.packer.width)),
          (i.height = Math.min(o, this.packer.height));
      }),
      (h._applyGridGutter = function (t, e) {
        if (!e) return t + this.gutter;
        var i = t % (e += this.gutter);
        return Math[i && 1 > i ? 'round' : 'ceil'](t / e) * e;
      }),
      (h._getContainerSize = function () {
        return this._getOption('horizontal')
          ? { width: this.maxX - this.gutter }
          : { height: this.maxY - this.gutter };
      }),
      (h._manageStamp = function (t) {
        var e,
          n = this.getItem(t);
        if (n && n.isPlacing) e = n.rect;
        else {
          var s = this._getElementOffset(t);
          e = new i({
            x: this._getOption('originLeft') ? s.left : s.right,
            y: this._getOption('originTop') ? s.top : s.bottom,
          });
        }
        this._setRectSize(t, e), this.packer.placed(e), this._setMaxXY(e);
      }),
      (h.sortItemsByPosition = function () {
        var t = this._getOption('horizontal') ? r : o;
        this.items.sort(t);
      }),
      (h.fit = function (t, e, i) {
        var n = this.getItem(t);
        n &&
          (this.stamp(n.element),
          n.enablePlacing(),
          this.updateShiftTargets(n),
          (e = void 0 === e ? n.rect.x : e),
          (i = void 0 === i ? n.rect.y : i),
          this.shift(n, e, i),
          this._bindFitEvents(n),
          n.moveTo(n.rect.x, n.rect.y),
          this.shiftLayout(),
          this.unstamp(n.element),
          this.sortItemsByPosition(),
          n.disablePlacing());
      }),
      (h._bindFitEvents = function (t) {
        function e() {
          2 == ++n && i.dispatchEvent('fitComplete', null, [t]);
        }
        var i = this,
          n = 0;
        t.once('layout', e), this.once('layoutComplete', e);
      }),
      (h.resize = function () {
        this.isResizeBound &&
          this.needsResizeLayout() &&
          (this.options.shiftPercentResize
            ? this.resizeShiftPercentLayout()
            : this.layout());
      }),
      (h.needsResizeLayout = function () {
        var e = t(this.element),
          i = this._getOption('horizontal') ? 'innerHeight' : 'innerWidth';
        return e[i] != this.size[i];
      }),
      (h.resizeShiftPercentLayout = function () {
        var e = this._getItemsForLayout(this.items),
          i = this._getOption('horizontal'),
          n = i ? 'y' : 'x',
          s = i ? 'height' : 'width',
          o = i ? 'rowHeight' : 'columnWidth',
          r = i ? 'innerHeight' : 'innerWidth',
          a = this[o];
        if ((a = a && a + this.gutter)) {
          this._getMeasurements();
          var h = this[o] + this.gutter;
          e.forEach(function (t) {
            var e = Math.round(t.rect[n] / a);
            t.rect[n] = e * h;
          });
        } else {
          var l = t(this.element)[r] + this.gutter,
            u = this.packer[s];
          e.forEach(function (t) {
            t.rect[n] = (t.rect[n] / u) * l;
          });
        }
        this.shiftLayout();
      }),
      (h.itemDragStart = function (t) {
        if (this.isEnabled) {
          this.stamp(t);
          var e = this.getItem(t);
          e &&
            (e.enablePlacing(),
            e.showDropPlaceholder(),
            this.dragItemCount++,
            this.updateShiftTargets(e));
        }
      }),
      (h.updateShiftTargets = function (t) {
        this.shiftPacker.reset(), this._getBoundingRect();
        var e = this._getOption('originLeft'),
          n = this._getOption('originTop');
        this.stamps.forEach(function (t) {
          var s = this.getItem(t);
          if (!s || !s.isPlacing) {
            var o = this._getElementOffset(t),
              r = new i({ x: e ? o.left : o.right, y: n ? o.top : o.bottom });
            this._setRectSize(t, r), this.shiftPacker.placed(r);
          }
        }, this);
        var s = this._getOption('horizontal'),
          o = s ? 'rowHeight' : 'columnWidth',
          r = s ? 'height' : 'width';
        (this.shiftTargetKeys = []), (this.shiftTargets = []);
        var a,
          h = this[o];
        if ((h = h && h + this.gutter)) {
          var l = Math.ceil(t.rect[r] / h),
            u = Math.floor((this.shiftPacker[r] + this.gutter) / h);
          a = (u - l) * h;
          for (var c = 0; u > c; c++) this._addShiftTarget(c * h, 0, a);
        } else
          (a = this.shiftPacker[r] + this.gutter - t.rect[r]),
            this._addShiftTarget(0, 0, a);
        var d = this._getItemsForLayout(this.items),
          f = this._getPackMethod();
        d.forEach(function (t) {
          var e = t.rect;
          this._setRectSize(t.element, e),
            this.shiftPacker[f](e),
            this._addShiftTarget(e.x, e.y, a);
          var i = s ? e.x + e.width : e.x,
            n = s ? e.y : e.y + e.height;
          if ((this._addShiftTarget(i, n, a), h))
            for (var o = Math.round(e[r] / h), l = 1; o > l; l++) {
              var u = s ? i : e.x + h * l,
                c = s ? e.y + h * l : n;
              this._addShiftTarget(u, c, a);
            }
        }, this);
      }),
      (h._addShiftTarget = function (t, e, i) {
        var n = this._getOption('horizontal') ? e : t;
        if (!(0 !== n && n > i)) {
          var s = t + ',' + e;
          -1 != this.shiftTargetKeys.indexOf(s) ||
            (this.shiftTargetKeys.push(s),
            this.shiftTargets.push({ x: t, y: e }));
        }
      }),
      (h.shift = function (t, e, i) {
        var n,
          s = 1 / 0,
          o = { x: e, y: i };
        this.shiftTargets.forEach(function (t) {
          var e = (function (t, e) {
            var i = e.x - t.x,
              n = e.y - t.y;
            return Math.sqrt(i * i + n * n);
          })(t, o);
          s > e && ((n = t), (s = e));
        }),
          (t.rect.x = n.x),
          (t.rect.y = n.y);
      });
    (h.itemDragMove = function (t, e, i) {
      function n() {
        o.shift(s, e, i), s.positionDropPlaceholder(), o.layout();
      }
      var s = this.isEnabled && this.getItem(t);
      if (s) {
        (e -= this.size.paddingLeft), (i -= this.size.paddingTop);
        var o = this,
          r = new Date();
        this._itemDragTime && r - this._itemDragTime < 120
          ? (clearTimeout(this.dragTimeout),
            (this.dragTimeout = setTimeout(n, 120)))
          : (n(), (this._itemDragTime = r));
      }
    }),
      (h.itemDragEnd = function (t) {
        function e() {
          2 == ++n &&
            (i.element.classList.remove('is-positioning-post-drag'),
            i.hideDropPlaceholder(),
            s.dispatchEvent('dragItemPositioned', null, [i]));
        }
        var i = this.isEnabled && this.getItem(t);
        if (i) {
          clearTimeout(this.dragTimeout),
            i.element.classList.add('is-positioning-post-drag');
          var n = 0,
            s = this;
          i.once('layout', e),
            this.once('layoutComplete', e),
            i.moveTo(i.rect.x, i.rect.y),
            this.layout(),
            (this.dragItemCount = Math.max(0, this.dragItemCount - 1)),
            this.sortItemsByPosition(),
            i.disablePlacing(),
            this.unstamp(i.element);
        }
      }),
      (h.bindDraggabillyEvents = function (t) {
        this._bindDraggabillyEvents(t, 'on');
      }),
      (h.unbindDraggabillyEvents = function (t) {
        this._bindDraggabillyEvents(t, 'off');
      }),
      (h._bindDraggabillyEvents = function (t, e) {
        var i = this.handleDraggabilly;
        t[e]('dragStart', i.dragStart),
          t[e]('dragMove', i.dragMove),
          t[e]('dragEnd', i.dragEnd);
      }),
      (h.bindUIDraggableEvents = function (t) {
        this._bindUIDraggableEvents(t, 'on');
      }),
      (h.unbindUIDraggableEvents = function (t) {
        this._bindUIDraggableEvents(t, 'off');
      }),
      (h._bindUIDraggableEvents = function (t, e) {
        var i = this.handleUIDraggable;
        t[e]('dragstart', i.start)[e]('drag', i.drag)[e]('dragstop', i.stop);
      });
    var l = h.destroy;
    return (
      (h.destroy = function () {
        l.apply(this, arguments), (this.isEnabled = !1);
      }),
      (a.Rect = i),
      (a.Packer = n),
      a
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(['isotopet4s-layout/js/layout-mode', 'packery/js/packery'], e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          require('isotopet4s-layout/js/layout-mode'),
          require('packery')
        ))
      : e(t.isotopet4s.LayoutMode, t.Packery);
  })(window, function (t, e) {
    var i = t.create('packery'),
      n = i.prototype,
      s = { _getElementOffset: !0, _getMeasurement: !0 };
    for (var o in e.prototype) s[o] || (n[o] = e.prototype[o]);
    var r = n._resetLayout;
    n._resetLayout = function () {
      (this.packer = this.packer || new e.Packer()),
        (this.shiftPacker = this.shiftPacker || new e.Packer()),
        r.apply(this, arguments);
    };
    var a = n._getItemLayoutPosition;
    n._getItemLayoutPosition = function (t) {
      return (t.rect = t.rect || new e.Rect()), a.call(this, t);
    };
    var h = n.needsResizeLayout;
    n.needsResizeLayout = function () {
      return this._getOption('horizontal')
        ? this.needsVerticalResizeLayout()
        : h.call(this);
    };
    var l = n._getOption;
    return (
      (n._getOption = function (t) {
        return 'horizontal' == t
          ? void 0 !== this.options.isHorizontal
            ? this.options.isHorizontal
            : this.options.horizontal
          : l.apply(this.isotopet4s, arguments);
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('jquery-bridget/jquery-bridget', ['jquery'], function (i) {
          return e(t, i);
        })
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('jquery')))
      : (t.jQuery_T4NTBridget = e(t, t.jQuery_T4NT));
  })(window, function (t, e) {
    'use strict';
    var i = Array.prototype.slice,
      n = t.console,
      s =
        void 0 === n
          ? function () {}
          : function (t) {
              n.error(t);
            };
    function o(n, o, a) {
      (a = a || e || t.jQuery_T4NT) &&
        (o.prototype.option ||
          (o.prototype.option = function (t) {
            a.isPlainObject(t) &&
              (this.options = a.extend(!0, this.options, t));
          }),
        (a.fn[n] = function (t) {
          var e;
          return 'string' == typeof t
            ? (function (t, e, i) {
                var o,
                  r = '$().' + n + '("' + e + '")';
                return (
                  t.each(function (t, h) {
                    var l = a.data(h, n);
                    if (l) {
                      var u = l[e];
                      if (u && '_' != e.charAt(0)) {
                        var c = u.apply(l, i);
                        o = void 0 === o ? c : o;
                      } else s(r + ' is not a valid method');
                    } else s(n + ' not initialized. Cannot call methods, i.e. ' + r);
                  }),
                  void 0 !== o ? o : t
                );
              })(this, t, i.call(arguments, 1))
            : ((e = t),
              this.each(function (t, i) {
                var s = a.data(i, n);
                s
                  ? (s.option(e), s._init())
                  : ((s = new o(i, e)), a.data(i, n, s));
              }),
              this);
        }),
        r(a));
    }
    function r(t) {
      !t || (t && t.bridget) || (t.bridget = o);
    }
    return r(e || t.jQuery_T4NT), o;
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('ev-emitter/ev-emitter', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.EvEmitter = e());
  })('undefined' != typeof window ? window : this, function () {
    function t() {}
    var e = t.prototype;
    return (
      (e.on = function (t, e) {
        if (t && e) {
          var i = (this._events = this._events || {}),
            n = (i[t] = i[t] || []);
          return -1 == n.indexOf(e) && n.push(e), this;
        }
      }),
      (e.once = function (t, e) {
        if (t && e) {
          this.on(t, e);
          var i = (this._onceEvents = this._onceEvents || {});
          return ((i[t] = i[t] || {})[e] = !0), this;
        }
      }),
      (e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          var n = i.indexOf(e);
          return -1 != n && i.splice(n, 1), this;
        }
      }),
      (e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
          (i = i.slice(0)), (e = e || []);
          for (
            var n = this._onceEvents && this._onceEvents[t], s = 0;
            s < i.length;
            s++
          ) {
            var o = i[s];
            n && n[o] && (this.off(t, o), delete n[o]), o.apply(this, e);
          }
          return this;
        }
      }),
      (e.allOff = function () {
        delete this._events, delete this._onceEvents;
      }),
      t
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('get-size/get-size', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.getSize = e());
  })(window, function () {
    'use strict';
    function t(t) {
      var e = parseFloat(t);
      return -1 == t.indexOf('%') && !isNaN(e) && e;
    }
    var e =
        'undefined' == typeof console
          ? function () {}
          : function (t) {
              console.error(t);
            },
      i = [
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
      ],
      n = i.length;
    function s(t) {
      var i = getComputedStyle(t);
      return (
        i ||
          e(
            'Style returned ' +
              i +
              '. Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1'
          ),
        i
      );
    }
    var o,
      r = !1;
    return function e(a) {
      if (
        ((function () {
          if (!r) {
            r = !0;
            var i = document.createElement('div');
            (i.style.width = '200px'),
              (i.style.padding = '1px 2px 3px 4px'),
              (i.style.borderStyle = 'solid'),
              (i.style.borderWidth = '1px 2px 3px 4px'),
              (i.style.boxSizing = 'border-box');
            var n = document.body || document.documentElement;
            n.appendChild(i);
            var a = s(i);
            (o = 200 == Math.round(t(a.width))),
              (e.isBoxSizeOuter = o),
              n.removeChild(i);
          }
        })(),
        'string' == typeof a && (a = document.querySelector(a)),
        a && 'object' == typeof a && a.nodeType)
      ) {
        var h = s(a);
        if ('none' == h.display)
          return (function () {
            for (
              var t = {
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  outerWidth: 0,
                  outerHeight: 0,
                },
                e = 0;
              e < n;
              e++
            )
              t[i[e]] = 0;
            return t;
          })();
        var l = {};
        (l.width = a.offsetWidth), (l.height = a.offsetHeight);
        for (
          var u = (l.isBorderBox = 'border-box' == h.boxSizing), c = 0;
          c < n;
          c++
        ) {
          var d = i[c],
            f = h[d],
            p = parseFloat(f);
          l[d] = isNaN(p) ? 0 : p;
        }
        var m = l.paddingLeft + l.paddingRight,
          g = l.paddingTop + l.paddingBottom,
          y = l.marginLeft + l.marginRight,
          v = l.marginTop + l.marginBottom,
          _ = l.borderLeftWidth + l.borderRightWidth,
          x = l.borderTopWidth + l.borderBottomWidth,
          b = u && o,
          S = t(h.width);
        !1 !== S && (l.width = S + (b ? 0 : m + _));
        var E = t(h.height);
        return (
          !1 !== E && (l.height = E + (b ? 0 : g + x)),
          (l.innerWidth = l.width - (m + _)),
          (l.innerHeight = l.height - (g + x)),
          (l.outerWidth = l.width + y),
          (l.outerHeight = l.height + v),
          l
        );
      }
    };
  }),
  (function (t, e) {
    'use strict';
    'function' == typeof define && define.amd
      ? define('desandro-matches-selector/matches-selector', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : (t.matchesSelector = e());
  })(window, function () {
    'use strict';
    var t = (function () {
      var t = window.Element.prototype;
      if (t.matches) return 'matches';
      if (t.matchesSelector) return 'matchesSelector';
      for (var e = ['webkit', 'moz', 'ms', 'o'], i = 0; i < e.length; i++) {
        var n = e[i] + 'MatchesSelector';
        if (t[n]) return n;
      }
    })();
    return function (e, i) {
      return e[t](i);
    };
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'fizzy-ui-utils/utils',
          ['desandro-matches-selector/matches-selector'],
          function (i) {
            return e(t, i);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('desandro-matches-selector')))
      : (t.fizzyUIUtils = e(t, t.matchesSelector));
  })(window, function (t, e) {
    var i = {
        extend: function (t, e) {
          for (var i in e) t[i] = e[i];
          return t;
        },
        modulo: function (t, e) {
          return ((t % e) + e) % e;
        },
      },
      n = Array.prototype.slice;
    (i.makeArray = function (t) {
      return Array.isArray(t)
        ? t
        : null == t
        ? []
        : 'object' == typeof t && 'number' == typeof t.length
        ? n.call(t)
        : [t];
    }),
      (i.removeFrom = function (t, e) {
        var i = t.indexOf(e);
        -1 != i && t.splice(i, 1);
      }),
      (i.getParent = function (t, i) {
        for (; t.parentNode && t != document.body; )
          if (((t = t.parentNode), e(t, i))) return t;
      }),
      (i.getQueryElement = function (t) {
        return 'string' == typeof t ? document.querySelector(t) : t;
      }),
      (i.handleEvent = function (t) {
        var e = 'on' + t.type;
        this[e] && this[e](t);
      }),
      (i.filterFindElements = function (t, n) {
        t = i.makeArray(t);
        var s = [];
        return (
          t.forEach(function (t) {
            if (t instanceof HTMLElement)
              if (n) {
                e(t, n) && s.push(t);
                for (var i = t.querySelectorAll(n), o = 0; o < i.length; o++)
                  s.push(i[o]);
              } else s.push(t);
          }),
          s
        );
      }),
      (i.debounceMethod = function (t, e, i) {
        i = i || 100;
        var n = t.prototype[e],
          s = e + 'Timeout';
        t.prototype[e] = function () {
          var t = this[s];
          clearTimeout(t);
          var e = arguments,
            o = this;
          this[s] = setTimeout(function () {
            n.apply(o, e), delete o[s];
          }, i);
        };
      }),
      (i.docReady = function (t) {
        var e = document.readyState;
        'complete' == e || 'interactive' == e
          ? setTimeout(t)
          : document.addEventListener('DOMContentLoaded', t);
      }),
      (i.toDashed = function (t) {
        return t
          .replace(/(.)([A-Z])/g, function (t, e, i) {
            return e + '-' + i;
          })
          .toLowerCase();
      });
    var s = t.console;
    return (
      (i.htmlInit = function (e, n) {
        i.docReady(function () {
          var o = i.toDashed(n),
            r = 'data-' + o,
            a = document.querySelectorAll('[' + r + ']'),
            h = document.querySelectorAll('.js-' + o),
            l = i.makeArray(a).concat(i.makeArray(h)),
            u = r + '-options',
            c = t.jQuery_T4NT;
          l.forEach(function (t) {
            var i,
              o = t.getAttribute(r) || t.getAttribute(u);
            try {
              i = o && JSON.parse(o);
            } catch (e) {
              return void (
                s &&
                s.error('Error parsing ' + r + ' on ' + t.className + ': ' + e)
              );
            }
            var a = new e(t, i);
            c && c.data(t, n, a);
          });
        });
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('flickityt4s/js/cell', ['get-size/get-size'], function (i) {
          return e(t, i);
        })
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('get-size')))
      : ((t.Flickityt4s = t.Flickityt4s || {}),
        (t.Flickityt4s.Cell = e(t, t.getSize)));
  })(window, function (t, e) {
    function i(t, e) {
      (this.element = t), (this.parent = e), this.create();
    }
    var n = i.prototype;
    return (
      (n.create = function () {
        (this.element.style.position = 'absolute'),
          this.element.setAttribute('aria-hidden', 'true'),
          (this.x = 0),
          (this.shift = 0),
          (this.element.style[this.parent.originSide] = 0);
      }),
      (n.destroy = function () {
        this.unselect(), (this.element.style.position = '');
        var t = this.parent.originSide;
        (this.element.style[t] = ''),
          (this.element.style.transform = ''),
          this.element.removeAttribute('aria-hidden');
      }),
      (n.getSize = function () {
        this.size = e(this.element);
      }),
      (n.setPosition = function (t) {
        (this.x = t), this.updateTarget(), this.renderPosition(t);
      }),
      (n.updateTarget = n.setDefaultTarget =
        function () {
          var t =
            'left' == this.parent.originSide ? 'marginLeft' : 'marginRight';
          this.target =
            this.x + this.size[t] + this.size.width * this.parent.cellAlign;
        }),
      (n.renderPosition = function (t) {
        var e = 'left' === this.parent.originSide ? 1 : -1,
          i = this.parent.options.percentPosition
            ? t * e * (this.parent.size.innerWidth / this.size.width)
            : t * e;
        this.element.style.transform =
          'translateX(' + this.parent.getPositionValue(i) + ')';
      }),
      (n.select = function () {
        this.element.classList.add('is-selected'),
          this.element.removeAttribute('aria-hidden');
      }),
      (n.unselect = function () {
        this.element.classList.remove('is-selected'),
          this.element.setAttribute('aria-hidden', 'true');
      }),
      (n.wrapShift = function (t) {
        (this.shift = t),
          this.renderPosition(this.x + this.parent.slideableWidth * t);
      }),
      (n.remove = function () {
        this.element.parentNode.removeChild(this.element);
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define('flickityt4s/js/slide', e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e())
      : ((t.Flickityt4s = t.Flickityt4s || {}), (t.Flickityt4s.Slide = e()));
  })(window, function () {
    'use strict';
    function t(t) {
      (this.parent = t),
        (this.isOriginLeft = 'left' == t.originSide),
        (this.cells = []),
        (this.outerWidth = 0),
        (this.height = 0);
    }
    var e = t.prototype;
    return (
      (e.addCell = function (t) {
        if (
          (this.cells.push(t),
          (this.outerWidth += t.size.outerWidth),
          (this.height = Math.max(t.size.outerHeight, this.height)),
          1 == this.cells.length)
        ) {
          this.x = t.x;
          var e = this.isOriginLeft ? 'marginLeft' : 'marginRight';
          this.firstMargin = t.size[e];
        }
      }),
      (e.updateTarget = function () {
        var t = this.isOriginLeft ? 'marginRight' : 'marginLeft',
          e = this.getLastCell(),
          i = e ? e.size[t] : 0,
          n = this.outerWidth - (this.firstMargin + i);
        this.target = this.x + this.firstMargin + n * this.parent.cellAlign;
      }),
      (e.getLastCell = function () {
        return this.cells[this.cells.length - 1];
      }),
      (e.select = function () {
        this.cells.forEach(function (t) {
          t.select();
        });
      }),
      (e.unselect = function () {
        this.cells.forEach(function (t) {
          t.unselect();
        });
      }),
      (e.getCellElements = function () {
        return this.cells.map(function (t) {
          return t.element;
        });
      }),
      t
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/animate',
          ['fizzy-ui-utils/utils'],
          function (i) {
            return e(t, i);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('fizzy-ui-utils')))
      : ((t.Flickityt4s = t.Flickityt4s || {}),
        (t.Flickityt4s.animatePrototype = e(t, t.fizzyUIUtils)));
  })(window, function (t, e) {
    return {
      startAnimation: function () {
        this.isAnimating ||
          ((this.isAnimating = !0), (this.restingFrames = 0), this.animate());
      },
      animate: function () {
        this.applyDragForce(), this.applySelectedAttraction();
        var t = this.x;
        if (
          (this.integratePhysics(),
          this.positionSlider(),
          this.settle(t),
          this.isAnimating)
        ) {
          var e = this;
          requestAnimationFrame(function () {
            e.animate();
          });
        }
      },
      positionSlider: function () {
        var t = this.x;
        this.options.wrapAround &&
          this.cells.length > 1 &&
          ((t = e.modulo(t, this.slideableWidth)),
          (t -= this.slideableWidth),
          this.shiftWrapCells(t)),
          this.setTranslateX(t, this.isAnimating),
          this.dispatchScrollEvent();
      },
      setTranslateX: function (t, e) {
        (t += this.cursorPosition), (t = RtlThe4 ? -t : t);
        var i = this.getPositionValue(t);
        this.slider.style.transform = e
          ? 'translate3d(' + i + ',0,0)'
          : 'translateX(' + i + ')';
      },
      dispatchScrollEvent: function () {
        var t = this.slides[0];
        if (t) {
          var e = -this.x - t.target,
            i = e / this.slidesWidth;
          this.dispatchEvent('scroll', null, [i, e]);
        }
      },
      positionSliderAtSelected: function () {
        this.cells.length &&
          ((this.x = -this.selectedSlide.target),
          (this.velocity = 0),
          this.positionSlider());
      },
      getPositionValue: function (t) {
        return this.options.percentPosition
          ? 0.01 * Math.round((t / this.size.innerWidth) * 1e4) + '%'
          : Math.round(t) + 'px';
      },
      settle: function (t) {
        !this.isPointerDown &&
          Math.round(100 * this.x) == Math.round(100 * t) &&
          this.restingFrames++,
          this.restingFrames > 2 &&
            ((this.isAnimating = !1),
            delete this.isFreeScrolling,
            this.positionSlider(),
            this.dispatchEvent('settle', null, [this.selectedIndex]));
      },
      shiftWrapCells: function (t) {
        var e = this.cursorPosition + t;
        this._shiftCells(this.beforeShiftCells, e, -1);
        var i =
          this.size.innerWidth -
          (t + this.slideableWidth + this.cursorPosition);
        this._shiftCells(this.afterShiftCells, i, 1);
      },
      _shiftCells: function (t, e, i) {
        for (var n = 0; n < t.length; n++) {
          var s = t[n],
            o = e > 0 ? i : 0;
          s.wrapShift(o), (e -= s.size.outerWidth);
        }
        this._checkVisibility();
      },
      _unshiftCells: function (t) {
        if (t && t.length) for (var e = 0; e < t.length; e++) t[e].wrapShift(0);
      },
      integratePhysics: function () {
        (this.x += this.velocity), (this.velocity *= this.getFrictionFactor());
      },
      applyForce: function (t) {
        this.velocity += t;
      },
      getFrictionFactor: function () {
        return (
          1 -
          this.options[this.isFreeScrolling ? 'freeScrollFriction' : 'friction']
        );
      },
      getRestingPosition: function () {
        return this.x + this.velocity / (1 - this.getFrictionFactor());
      },
      applyDragForce: function () {
        if (this.isDraggable && this.isPointerDown) {
          var t = this.dragX - this.x - this.velocity;
          this.applyForce(t);
        }
      },
      applySelectedAttraction: function () {
        if (
          (!this.isDraggable || !this.isPointerDown) &&
          !this.isFreeScrolling &&
          this.slides.length
        ) {
          var t =
            (-1 * this.selectedSlide.target - this.x) *
            this.options.selectedAttraction;
          this.applyForce(t);
        }
      },
    };
  }),
  (function (t, e) {
    if ('function' == typeof define && define.amd)
      define('flickityt4s/js/flickityt4s', [
        'ev-emitter/ev-emitter',
        'get-size/get-size',
        'fizzy-ui-utils/utils',
        './cell',
        './slide',
        './animate',
      ], function (i, n, s, o, r, a) {
        return e(t, i, n, s, o, r, a);
      });
    else if ('object' == typeof module && module.exports)
      module.exports = e(
        t,
        require('ev-emitter'),
        require('get-size'),
        require('fizzy-ui-utils'),
        require('./cell'),
        require('./slide'),
        require('./animate')
      );
    else {
      var i = t.Flickityt4s;
      t.Flickityt4s = e(
        t,
        t.EvEmitter,
        t.getSize,
        t.fizzyUIUtils,
        i.Cell,
        i.Slide,
        i.animatePrototype
      );
    }
  })(window, function (t, e, i, n, s, o, r) {
    var a = t.jQuery_T4NT,
      h = t.getComputedStyle,
      l = t.console;
    function u(t, e) {
      for (t = n.makeArray(t); t.length; ) e.appendChild(t.shift());
    }
    var c = 0,
      d = {};
    function f(t, e) {
      var i = n.getQueryElement(t);
      if (i) {
        if (((this.element = i), this.element.flickityt4sGUID)) {
          var s = d[this.element.flickityt4sGUID];
          return s && s.option(e), s;
        }
        switch (
          (a && (this.$element = a(this.element)),
          (this.options = n.extend({}, this.constructor.defaults)),
          (e.originwrapAround = e.wrapAround),
          (e.rightToLeft =
            'rtl' == document.documentElement.getAttribute('dir')),
          e.arrowIcon)
        ) {
          case '1':
            e.arrowShape = 'M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z';
            break;
          case '2':
            e.arrowShape = 'M 10,50 L 60,100 L 65,95 L 20,50  L 65,5 L 60,0 Z';
            break;
          case '3':
            e.arrowShape =
              'M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z';
        }
        this.option(e), this._create();
      } else l && l.error('Bad element for Flickityt4s: ' + (i || t));
    }
    (f.defaults = {
      accessibility: !0,
      cellAlign: 'center',
      freeScrollFriction: 0.075,
      friction: 0.28,
      namespaceJQueryEvents: !0,
      percentPosition: !0,
      resize: !0,
      selectedAttraction: 0.025,
      setGallerySize: !0,
      setPrevNextButtons: !1,
      checkVisibility: !1,
      sync: !1,
    }),
      (f.createMethods = []);
    var p = f.prototype;
    n.extend(p, e.prototype),
      (p._create = function () {
        var e = (this.guid = ++c);
        for (var i in ((this.element.flickityt4sGUID = e),
        (d[e] = this),
        (this.selectedIndex = 0),
        (this.restingFrames = 0),
        (this.x = 0),
        (this.velocity = 0),
        (this.originSide = RtlThe4 ? 'right' : 'left'),
        (this.viewport = document.createElement('div')),
        (this.viewport.className = 'flickityt4s-viewport'),
        this._createSlider(),
        (this.options.resize || this.options.watchCSS) &&
          t.addEventListener('resize', this),
        this.options.on)) {
          var n = this.options.on[i];
          this.on(i, n);
        }
        f.createMethods.forEach(function (t) {
          this[t]();
        }, this),
          this.options.watchCSS ? this.watchCSS() : this.activate();
      }),
      (p.option = function (t) {
        n.extend(this.options, t);
      }),
      (p.activate = function () {
        this.isActive ||
          ((this.isActive = !0),
          this.element.classList.add('flickityt4s-enabled'),
          RtlThe4 && this.element.classList.add('flickityt4s-rtl'),
          this.getSize(),
          u(this._filterFindCellElements(this.element.children), this.slider),
          this.viewport.appendChild(this.slider),
          this.element.appendChild(this.viewport),
          this.reloadCells(),
          this.options.accessibility &&
            ((this.element.tabIndex = 0),
            this.element.addEventListener('keydown', this)),
          this.emitEvent('activate'),
          this.selectInitialIndex(),
          (this.isInitActivated = !0),
          this.dispatchEvent('ready'));
      }),
      (p._createSlider = function () {
        var t = document.createElement('div');
        (t.className = 'flickityt4s-slider'),
          (t.style[this.originSide] = 0),
          (this.slider = t);
      }),
      (p._filterFindCellElements = function (t) {
        return n.filterFindElements(t, this.options.cellSelector);
      }),
      (p.reloadCells = function () {
        (this.cells = this._makeCells(this.slider.children)),
          this.positionCells(),
          this._getWrapShiftCells(),
          this.setGallerySize(),
          this.setPrevNextButtons();
      }),
      (p._makeCells = function (t) {
        return this._filterFindCellElements(t).map(function (t) {
          return new s(t, this);
        }, this);
      }),
      (p.getLastCell = function () {
        return this.cells[this.cells.length - 1];
      }),
      (p.getLastSlide = function () {
        return this.slides[this.slides.length - 1];
      }),
      (p.positionCells = function () {
        this._sizeCells(this.cells), this._positionCells(0);
      }),
      (p._positionCells = function (t) {
        (t = t || 0), (this.maxCellHeight = (t && this.maxCellHeight) || 0);
        var e = 0;
        if (t > 0) {
          var i = this.cells[t - 1];
          e = i.x + i.size.outerWidth;
        }
        for (var n = this.cells.length, s = t; s < n; s++) {
          var o = this.cells[s];
          o.setPosition(e),
            (e += o.size.outerWidth),
            (this.maxCellHeight = Math.max(
              o.size.outerHeight,
              this.maxCellHeight
            ));
        }
        (this.slideableWidth = e),
          this.updateSlides(),
          this._containSlides(),
          (this.slidesWidth = n
            ? this.getLastSlide().target - this.slides[0].target
            : 0),
          (this.maxVisibilityHeight = 0);
      }),
      (p._sizeCells = function (t) {
        t.forEach(function (t) {
          t.getSize();
        });
      }),
      (p.updateSlides = function () {
        if (((this.slides = []), this.cells.length)) {
          var t = new o(this);
          this.slides.push(t);
          var e = 'left' == this.originSide ? 'marginRight' : 'marginLeft',
            i = this._getCanCellFit();
          this.cells.forEach(function (n, s) {
            if (t.cells.length) {
              var r =
                t.outerWidth - t.firstMargin + (n.size.outerWidth - n.size[e]);
              i.call(this, s, r)
                ? t.addCell(n)
                : (t.updateTarget(),
                  (t = new o(this)),
                  this.slides.push(t),
                  t.addCell(n));
            } else t.addCell(n);
          }, this),
            t.updateTarget(),
            this.updateSelectedSlide();
        }
      }),
      (p._getCanCellFit = function () {
        var t = this.options.groupCells;
        if (!t)
          return function () {
            return !1;
          };
        if ('number' == typeof t) {
          var e = parseInt(t, 10);
          return function (t) {
            return t % e != 0;
          };
        }
        var i = 'string' == typeof t && t.match(/^(\d+)%$/),
          n = i ? parseInt(i[1], 10) / 100 : 1;
        return function (t, e) {
          return e <= (this.size.innerWidth + 1) * n;
        };
      }),
      (p._init = p.reposition =
        function () {
          this.positionCells(), this.positionSliderAtSelected();
        }),
      (p.getSize = function () {
        (this.size = i(this.element)),
          this.setCellAlign(),
          (this.cursorPosition = this.size.innerWidth * this.cellAlign);
      });
    var m = {
      center: { left: 0.5, right: 0.5 },
      left: { left: 0, right: 1 },
      right: { right: 0, left: 1 },
    };
    return (
      (p.setCellAlign = function () {
        var t = m[this.options.cellAlign];
        this.cellAlign = t ? t[this.originSide] : this.options.cellAlign;
      }),
      (p.setGallerySize = function () {
        if (this.options.setGallerySize) {
          var t =
            this.options.adaptiveHeight && this.selectedSlide
              ? this.selectedSlide.height
              : this.maxCellHeight;
          (t =
            this.maxVisibilityHeight && this.maxVisibilityHeight > t
              ? this.maxVisibilityHeight
              : t),
            (this.viewport.style.height = t + 'px');
        }
      }),
      (p.setPrevNextButtons = function () {
        if (this.options.setPrevNextButtons) {
          var t = this.viewport.querySelector('.is-selected [data-cacl-slide]');
          if (null !== t) {
            var e = t.offsetHeight / 2;
            this.element.style.setProperty('--prev-next-top', e + 'px');
          }
        }
      }),
      (p._checkVisibility = function () {
        if (this.options.checkVisibility && this.options.adaptiveHeight)
          for (
            var t = this.viewport.getBoundingClientRect().x,
              e = this.viewport.offsetWidth,
              i = this.cells.length,
              n = 0;
            n < i;
            n++
          ) {
            var s = this.cells[n],
              o = s.element.getBoundingClientRect().x - t;
            (o + s.size.innerWidth > t && o + s.size.innerWidth < e) ||
            (o > t && o < e)
              ? ((this.maxVisibilityHeight = Math.max(
                  s.size.outerHeight,
                  this.maxVisibilityHeight
                )),
                s.element.classList.add('is-t4s-visible'),
                s.element.removeAttribute('aria-hidden'))
              : (s.element.classList.remove('is-t4s-visible'),
                s.element.setAttribute('aria-hidden', !0));
          }
      }),
      (p._getWrapShiftCells = function () {
        if (this.options.originwrapAround)
          if (this.slides.length < 2) this.options.wrapAround = !1;
          else {
            (this.options.wrapAround = !0),
              this._unshiftCells(this.beforeShiftCells),
              this._unshiftCells(this.afterShiftCells);
            var t = this.cursorPosition,
              e = this.cells.length - 1;
            (this.beforeShiftCells = this._getGapCells(t, e, -1)),
              (t = this.size.innerWidth - this.cursorPosition),
              (this.afterShiftCells = this._getGapCells(t, 0, 1));
          }
      }),
      (p._getGapCells = function (t, e, i) {
        for (var n = []; t > 0; ) {
          var s = this.cells[e];
          if (!s) break;
          n.push(s), (e += i), (t -= s.size.outerWidth);
        }
        return n;
      }),
      (p._containSlides = function () {
        if (
          this.options.contain &&
          !this.options.wrapAround &&
          this.cells.length
        ) {
          var t = RtlThe4 ? 'marginRight' : 'marginLeft',
            e = RtlThe4 ? 'marginLeft' : 'marginRight',
            i = this.slideableWidth - this.getLastCell().size[e],
            n = i < this.size.innerWidth,
            s = this.cursorPosition + this.cells[0].size[t],
            o = i - this.size.innerWidth * (1 - this.cellAlign);
          this.slides.forEach(function (t) {
            n
              ? (t.target = i * this.cellAlign)
              : ((t.target = Math.max(t.target, s)),
                (t.target = Math.min(t.target, o)));
          }, this);
        }
      }),
      (p.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if ((this.emitEvent(t, n), a && this.$element)) {
          var s = (t += this.options.namespaceJQueryEvents
            ? '.flickityt4s'
            : '');
          if (e) {
            var o = new a.Event(e);
            (o.type = t), (s = o);
          }
          this.$element.trigger(s, i);
        }
      }),
      (p.select = function (t, e, i) {
        if (
          this.isActive &&
          ((t = parseInt(t, 10)),
          this._wrapSelect(t),
          (this.options.wrapAround || e) &&
            (t = n.modulo(t, this.slides.length)),
          this.slides[t])
        ) {
          var s = this.selectedIndex;
          (this.selectedIndex = t),
            this.updateSelectedSlide(),
            i ? this.positionSliderAtSelected() : this.startAnimation(),
            this.options.adaptiveHeight && this.setGallerySize(),
            this.setPrevNextButtons(),
            this.dispatchEvent('select', null, [t]),
            t != s && this.dispatchEvent('change', null, [t]),
            this.dispatchEvent('cellSelect');
        }
      }),
      (p._wrapSelect = function (t) {
        var e = this.slides.length;
        if (!(this.options.wrapAround && e > 1)) return t;
        var i = n.modulo(t, e),
          s = Math.abs(i - this.selectedIndex),
          o = Math.abs(i + e - this.selectedIndex),
          r = Math.abs(i - e - this.selectedIndex);
        !this.isDragSelect && o < s
          ? (t += e)
          : !this.isDragSelect && r < s && (t -= e),
          t < 0
            ? (this.x -= this.slideableWidth)
            : t >= e && (this.x += this.slideableWidth);
      }),
      (p.previous = function (t, e) {
        this.select(this.selectedIndex - 1, t, e);
      }),
      (p.next = function (t, e) {
        this.select(this.selectedIndex + 1, t, e);
      }),
      (p.updateSelectedSlide = function () {
        var t = this.slides[this.selectedIndex];
        t &&
          (this.unselectSelectedSlide(),
          (this.selectedSlide = t),
          t.select(),
          (this.selectedCells = t.cells),
          (this.selectedElements = t.getCellElements()),
          (this.selectedCell = t.cells[0]),
          (this.selectedElement = this.selectedElements[0]));
      }),
      (p.unselectSelectedSlide = function () {
        this.selectedSlide && this.selectedSlide.unselect();
      }),
      (p.selectInitialIndex = function () {
        var t = this.options.initialIndex;
        if (this.isInitActivated) this.select(this.selectedIndex, !1, !0);
        else {
          if (t && 'string' == typeof t && this.queryCell(t))
            return void this.selectCell(t, !1, !0);
          var e = 0;
          t && this.slides[t] && (e = t), this.select(e, !1, !0);
        }
      }),
      (p.selectCell = function (t, e, i) {
        var n = this.queryCell(t);
        if (n) {
          var s = this.getCellSlideIndex(n);
          this.select(s, e, i);
        }
      }),
      (p.getCellSlideIndex = function (t) {
        for (var e = 0; e < this.slides.length; e++)
          if (-1 != this.slides[e].cells.indexOf(t)) return e;
      }),
      (p.getCell = function (t) {
        for (var e = 0; e < this.cells.length; e++) {
          var i = this.cells[e];
          if (i.element == t) return i;
        }
      }),
      (p.getCells = function (t) {
        t = n.makeArray(t);
        var e = [];
        return (
          t.forEach(function (t) {
            var i = this.getCell(t);
            i && e.push(i);
          }, this),
          e
        );
      }),
      (p.getCellElements = function () {
        return this.cells.map(function (t) {
          return t.element;
        });
      }),
      (p.getParentCell = function (t) {
        return (
          this.getCell(t) ||
          ((t = n.getParent(t, '.flickityt4s-slider > *')), this.getCell(t))
        );
      }),
      (p.getAdjacentCellElements = function (t, e) {
        if (!t) return this.selectedSlide.getCellElements();
        e = void 0 === e ? this.selectedIndex : e;
        var i = this.slides.length;
        if (1 + 2 * t >= i) return this.getCellElements();
        for (var s = [], o = e - t; o <= e + t; o++) {
          var r = this.options.wrapAround ? n.modulo(o, i) : o,
            a = this.slides[r];
          a && (s = s.concat(a.getCellElements()));
        }
        return s;
      }),
      (p.queryCell = function (t) {
        if ('number' == typeof t) return this.cells[t];
        if ('string' == typeof t) {
          if (t.match(/^[#.]?[\d/]/)) return;
          t = this.element.querySelector(t);
        }
        return this.getCell(t);
      }),
      (p.uiChange = function () {
        this.emitEvent('uiChange');
      }),
      (p.childUIPointerDown = function (t) {
        'touchstart' != t.type && t.preventDefault(), this.focus();
      }),
      (p.onresize = function () {
        this.watchCSS(), this.resize();
      }),
      n.debounceMethod(f, 'onresize', 150),
      (p.resize = function () {
        if (this.isActive && !this.isAnimating && !this.isDragging) {
          this.getSize(),
            this.options.wrapAround &&
              (this.x = n.modulo(this.x, this.slideableWidth)),
            this.positionCells(),
            this._getWrapShiftCells(),
            this.setGallerySize(),
            this.setPrevNextButtons(),
            this.emitEvent('resize');
          var t = this.selectedElements && this.selectedElements[0];
          this.selectCell(t, !1, !0);
        }
      }),
      (p.watchCSS = function () {
        this.options.watchCSS &&
          (-1 != h(this.element, ':after').content.indexOf('flickityt4s')
            ? this.activate()
            : this.deactivate());
      }),
      (p.onkeydown = function (t) {
        var e =
          document.activeElement && document.activeElement != this.element;
        if (this.options.accessibility && !e) {
          var i = f.keyboardHandlers[t.keyCode];
          i && i.call(this);
        }
      }),
      (f.keyboardHandlers = {
        37: function () {
          var t = RtlThe4 ? 'next' : 'previous';
          this.uiChange(), this[t]();
        },
        39: function () {
          var t = RtlThe4 ? 'previous' : 'next';
          this.uiChange(), this[t]();
        },
      }),
      (p.focus = function () {
        var e = t.pageYOffset;
        this.element.focus({ preventScroll: !0 }),
          t.pageYOffset != e && t.scrollTo(t.pageXOffset, e);
      }),
      (p.deactivate = function () {
        this.isActive &&
          (this.element.classList.remove('flickityt4s-enabled'),
          this.element.classList.remove('flickityt4s-rtl'),
          this.unselectSelectedSlide(),
          this.cells.forEach(function (t) {
            t.destroy();
          }),
          this.element.removeChild(this.viewport),
          u(this.slider.children, this.element),
          this.options.accessibility &&
            (this.element.removeAttribute('tabIndex'),
            this.element.removeEventListener('keydown', this)),
          (this.isActive = !1),
          this.emitEvent('deactivate'));
      }),
      (p.destroy = function () {
        this.deactivate(),
          t.removeEventListener('resize', this),
          this.allOff(),
          this.emitEvent('destroy'),
          a && this.$element && a.removeData(this.element, 'flickityt4s'),
          delete this.element.flickityt4sGUID,
          delete d[this.guid];
      }),
      n.extend(p, r),
      (f.data = function (t) {
        var e = (t = n.getQueryElement(t)) && t.flickityt4sGUID;
        return e && d[e];
      }),
      n.htmlInit(f, 'flickityt4s'),
      a && a.bridget && a.bridget('flickityt4s', f),
      (f.setJQuery = function (t) {
        a = t;
      }),
      (f.Cell = s),
      (f.Slide = o),
      f
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'unipointer/unipointer',
          ['ev-emitter/ev-emitter'],
          function (i) {
            return e(t, i);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('ev-emitter')))
      : (t.Unipointer = e(t, t.EvEmitter));
  })(window, function (t, e) {
    function i() {}
    var n = (i.prototype = Object.create(e.prototype));
    (n.bindStartEvent = function (t) {
      this._bindStartEvent(t, !0);
    }),
      (n.unbindStartEvent = function (t) {
        this._bindStartEvent(t, !1);
      }),
      (n._bindStartEvent = function (e, i) {
        var n = (i = void 0 === i || i)
            ? 'addEventListener'
            : 'removeEventListener',
          s = 'mousedown';
        'ontouchstart' in t
          ? (s = 'touchstart')
          : t.PointerEvent && (s = 'pointerdown'),
          e[n](s, this);
      }),
      (n.handleEvent = function (t) {
        var e = 'on' + t.type;
        this[e] && this[e](t);
      }),
      (n.getTouch = function (t) {
        for (var e = 0; e < t.length; e++) {
          var i = t[e];
          if (i.identifier == this.pointerIdentifier) return i;
        }
      }),
      (n.onmousedown = function (t) {
        var e = t.button;
        (e && 0 !== e && 1 !== e) || this._pointerDown(t, t);
      }),
      (n.ontouchstart = function (t) {
        this._pointerDown(t, t.changedTouches[0]);
      }),
      (n.onpointerdown = function (t) {
        this._pointerDown(t, t);
      }),
      (n._pointerDown = function (t, e) {
        t.button ||
          this.isPointerDown ||
          ((this.isPointerDown = !0),
          (this.pointerIdentifier =
            void 0 !== e.pointerId ? e.pointerId : e.identifier),
          this.pointerDown(t, e));
      }),
      (n.pointerDown = function (t, e) {
        this._bindPostStartEvents(t), this.emitEvent('pointerDown', [t, e]);
      });
    var s = {
      mousedown: ['mousemove', 'mouseup'],
      touchstart: ['touchmove', 'touchend', 'touchcancel'],
      pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
    };
    return (
      (n._bindPostStartEvents = function (e) {
        if (e) {
          var i = s[e.type];
          i.forEach(function (e) {
            t.addEventListener(e, this);
          }, this),
            (this._boundPointerEvents = i);
        }
      }),
      (n._unbindPostStartEvents = function () {
        this._boundPointerEvents &&
          (this._boundPointerEvents.forEach(function (e) {
            t.removeEventListener(e, this);
          }, this),
          delete this._boundPointerEvents);
      }),
      (n.onmousemove = function (t) {
        this._pointerMove(t, t);
      }),
      (n.onpointermove = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerMove(t, t);
      }),
      (n.ontouchmove = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerMove(t, e);
      }),
      (n._pointerMove = function (t, e) {
        this.pointerMove(t, e);
      }),
      (n.pointerMove = function (t, e) {
        this.emitEvent('pointerMove', [t, e]);
      }),
      (n.onmouseup = function (t) {
        this._pointerUp(t, t);
      }),
      (n.onpointerup = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerUp(t, t);
      }),
      (n.ontouchend = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerUp(t, e);
      }),
      (n._pointerUp = function (t, e) {
        this._pointerDone(), this.pointerUp(t, e);
      }),
      (n.pointerUp = function (t, e) {
        this.emitEvent('pointerUp', [t, e]);
      }),
      (n._pointerDone = function () {
        this._pointerReset(), this._unbindPostStartEvents(), this.pointerDone();
      }),
      (n._pointerReset = function () {
        (this.isPointerDown = !1), delete this.pointerIdentifier;
      }),
      (n.pointerDone = function () {}),
      (n.onpointercancel = function (t) {
        t.pointerId == this.pointerIdentifier && this._pointerCancel(t, t);
      }),
      (n.ontouchcancel = function (t) {
        var e = this.getTouch(t.changedTouches);
        e && this._pointerCancel(t, e);
      }),
      (n._pointerCancel = function (t, e) {
        this._pointerDone(), this.pointerCancel(t, e);
      }),
      (n.pointerCancel = function (t, e) {
        this.emitEvent('pointerCancel', [t, e]);
      }),
      (i.getPointerPoint = function (t) {
        return { x: t.pageX, y: t.pageY };
      }),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'unidragger/unidragger',
          ['unipointer/unipointer'],
          function (i) {
            return e(t, i);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(t, require('unipointer')))
      : (t.Unidragger = e(t, t.Unipointer));
  })(window, function (t, e) {
    function i() {}
    var n = (i.prototype = Object.create(e.prototype));
    (n.bindHandles = function () {
      this._bindHandles(!0);
    }),
      (n.unbindHandles = function () {
        this._bindHandles(!1);
      }),
      (n._bindHandles = function (e) {
        for (
          var i = (e = void 0 === e || e)
              ? 'addEventListener'
              : 'removeEventListener',
            n = e ? this._touchActionValue : '',
            s = 0;
          s < this.handles.length;
          s++
        ) {
          var o = this.handles[s];
          this._bindStartEvent(o, e),
            o[i]('click', this),
            t.PointerEvent && (o.style.touchAction = n);
        }
      }),
      (n._touchActionValue = 'none'),
      (n.pointerDown = function (t, e) {
        this.okayPointerDown(t) &&
          ((this.pointerDownPointer = { pageX: e.pageX, pageY: e.pageY }),
          t.preventDefault(),
          this.pointerDownBlur(),
          this._bindPostStartEvents(t),
          this.emitEvent('pointerDown', [t, e]));
      });
    var s = { TEXTAREA: !0, INPUT: !0, SELECT: !0, OPTION: !0 },
      o = {
        radio: !0,
        checkbox: !0,
        button: !0,
        submit: !0,
        image: !0,
        file: !0,
      };
    return (
      (n.okayPointerDown = function (t) {
        var e = s[t.target.nodeName],
          i = o[t.target.type],
          n = !e || i;
        return n || this._pointerReset(), n;
      }),
      (n.pointerDownBlur = function () {
        var t = document.activeElement;
        t && t.blur && t != document.body && t.blur();
      }),
      (n.pointerMove = function (t, e) {
        var i = this._dragPointerMove(t, e);
        this.emitEvent('pointerMove', [t, e, i]), this._dragMove(t, e, i);
      }),
      (n._dragPointerMove = function (t, e) {
        var i = {
          x: e.pageX - this.pointerDownPointer.pageX,
          y: e.pageY - this.pointerDownPointer.pageY,
        };
        return (
          !this.isDragging && this.hasDragStarted(i) && this._dragStart(t, e), i
        );
      }),
      (n.hasDragStarted = function (t) {
        return Math.abs(t.x) > 3 || Math.abs(t.y) > 3;
      }),
      (n.pointerUp = function (t, e) {
        this.emitEvent('pointerUp', [t, e]), this._dragPointerUp(t, e);
      }),
      (n._dragPointerUp = function (t, e) {
        this.isDragging ? this._dragEnd(t, e) : this._staticClick(t, e);
      }),
      (n._dragStart = function (t, e) {
        (this.isDragging = !0),
          (this.isPreventingClicks = !0),
          this.dragStart(t, e);
      }),
      (n.dragStart = function (t, e) {
        this.emitEvent('dragStart', [t, e]);
      }),
      (n._dragMove = function (t, e, i) {
        this.isDragging && this.dragMove(t, e, i);
      }),
      (n.dragMove = function (t, e, i) {
        t.preventDefault(), this.emitEvent('dragMove', [t, e, i]);
      }),
      (n._dragEnd = function (t, e) {
        (this.isDragging = !1),
          setTimeout(
            function () {
              delete this.isPreventingClicks;
            }.bind(this)
          ),
          this.dragEnd(t, e);
      }),
      (n.dragEnd = function (t, e) {
        this.emitEvent('dragEnd', [t, e]);
      }),
      (n.onclick = function (t) {
        this.isPreventingClicks && t.preventDefault();
      }),
      (n._staticClick = function (t, e) {
        (this.isIgnoringMouseUp && 'mouseup' == t.type) ||
          (this.staticClick(t, e),
          'mouseup' != t.type &&
            ((this.isIgnoringMouseUp = !0),
            setTimeout(
              function () {
                delete this.isIgnoringMouseUp;
              }.bind(this),
              400
            )));
      }),
      (n.staticClick = function (t, e) {
        this.emitEvent('staticClick', [t, e]);
      }),
      (i.getPointerPoint = e.getPointerPoint),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/drag',
          ['./flickityt4s', 'unidragger/unidragger', 'fizzy-ui-utils/utils'],
          function (i, n, s) {
            return e(t, i, n, s);
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
    n.extend(e.defaults, { draggable: '>1', dragThreshold: 3 }),
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
            (this.pointerDownScroll = r()),
            t.addEventListener('scroll', this),
            this._pointerDownDefault(e, i))
          : this._pointerDownDefault(e, i);
      }),
      (s._pointerDownDefault = function (t, e) {
        (this.pointerDownPointer = { pageX: e.pageX, pageY: e.pageY }),
          this._bindPostStartEvents(t),
          this.dispatchEvent('pointerDown', t, [e]);
      });
    var o = { INPUT: !0, TEXTAREA: !0, SELECT: !0 };
    function r() {
      return { x: t.pageXOffset, y: t.pageYOffset };
    }
    return (
      (s.pointerDownFocus = function (t) {
        o[t.target.nodeName] || this.focus();
      }),
      (s._pointerDownPreventDefault = function (t) {
        var e = 'touchstart' == t.type,
          i = 'touch' == t.pointerType,
          n = o[t.target.nodeName];
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
          var n = RtlThe4 ? -1 : 1;
          this.options.wrapAround && (i.x %= this.slideableWidth);
          var s = this.dragStartPosition + i.x * n;
          if (!this.options.wrapAround && this.slides.length) {
            var o = Math.max(-this.slides[0].target, this.dragStartPosition);
            s = s > o ? 0.5 * (s + o) : s;
            var r = Math.min(
              -this.getLastSlide().target,
              this.dragStartPosition
            );
            s = s < r ? 0.5 * (s + r) : s;
          }
          (this.dragX = s),
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
            s = 1 / 0,
            o =
              this.options.contain && !this.options.wrapAround
                ? function (t, e) {
                    return t <= e;
                  }
                : function (t, e) {
                    return t < e;
                  };
          o(e, s) &&
          ((n += i), (s = e), null !== (e = this.getSlideDistance(-t, n)));

        )
          e = Math.abs(e);
        return { distance: s, index: n - i };
      }),
      (s.getSlideDistance = function (t, e) {
        var i = this.slides.length,
          s = this.options.wrapAround && i > 1,
          o = s ? n.modulo(e, i) : e,
          r = this.slides[o];
        if (!r) return null;
        var a = s ? this.slideableWidth * Math.floor(e / i) : 0;
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
          s = i && this.cells.indexOf(i);
        this.dispatchEvent('staticClick', t, [e, n, s]);
      }),
      (s.onscroll = function () {
        var t = r(),
          e = this.pointerDownScroll.x - t.x,
          i = this.pointerDownScroll.y - t.y;
        (Math.abs(e) > 3 || Math.abs(i) > 3) && this._pointerDone();
      }),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/prev-next-button',
          ['./flickityt4s', 'unipointer/unipointer', 'fizzy-ui-utils/utils'],
          function (i, n, s) {
            return e(t, i, n, s);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          t,
          require('./flickityt4s'),
          require('unipointer'),
          require('fizzy-ui-utils')
        ))
      : e(t, t.Flickityt4s, t.Unipointer, t.fizzyUIUtils);
  })(window, function (t, e, i, n) {
    'use strict';
    var s = 'http://www.w3.org/2000/svg';
    function o(t, e) {
      (this.direction = t), (this.parent = e), this._create();
    }
    (o.prototype = Object.create(i.prototype)),
      (o.prototype._create = function () {
        (this.isEnabled = !0), (this.isPrevious = -1 == this.direction);
        var t = this.parent.options.rightToLeft ? 1 : -1;
        this.isLeft = this.direction == t;
        var e = (this.element = document.createElement('button'));
        (e.className = 'flickityt4s-button flickityt4s-prev-next-button'),
          (e.className += this.isPrevious ? ' previous' : ' next'),
          e.setAttribute('type', 'button'),
          this.disable(),
          e.setAttribute('aria-label', this.isPrevious ? 'Previous' : 'Next');
        var i = this.createSVG();
        e.appendChild(i),
          this.parent.on('select', this.update.bind(this)),
          this.on(
            'pointerDown',
            this.parent.childUIPointerDown.bind(this.parent)
          );
      }),
      (o.prototype.activate = function () {
        this.bindStartEvent(this.element),
          this.element.addEventListener('click', this),
          this.parent.element.appendChild(this.element);
      }),
      (o.prototype.deactivate = function () {
        this.parent.element.removeChild(this.element),
          this.unbindStartEvent(this.element),
          this.element.removeEventListener('click', this);
      }),
      (o.prototype.createSVG = function () {
        var t = document.createElementNS(s, 'svg');
        t.setAttribute('class', 'flickityt4s-button-icon'),
          t.setAttribute('viewBox', '0 0 100 100');
        var e = document.createElementNS(s, 'path'),
          i = (function (t) {
            return 'string' == typeof t
              ? t
              : 'M ' +
                  t.x0 +
                  ',50 L ' +
                  t.x1 +
                  ',' +
                  (t.y1 + 50) +
                  ' L ' +
                  t.x2 +
                  ',' +
                  (t.y2 + 50) +
                  ' L ' +
                  t.x3 +
                  ',50  L ' +
                  t.x2 +
                  ',' +
                  (50 - t.y2) +
                  ' L ' +
                  t.x1 +
                  ',' +
                  (50 - t.y1) +
                  ' Z';
          })(this.parent.options.arrowShape);
        return (
          e.setAttribute('d', i),
          e.setAttribute('class', 'arrow'),
          this.isLeft ||
            e.setAttribute('transform', 'translate(100, 100) rotate(180) '),
          t.appendChild(e),
          t
        );
      }),
      (o.prototype.handleEvent = n.handleEvent),
      (o.prototype.onclick = function () {
        if (this.isEnabled) {
          this.parent.uiChange();
          var t = this.isPrevious ? 'previous' : 'next';
          this.parent[t]();
        }
      }),
      (o.prototype.enable = function () {
        this.isEnabled || ((this.element.disabled = !1), (this.isEnabled = !0));
      }),
      (o.prototype.disable = function () {
        this.isEnabled && ((this.element.disabled = !0), (this.isEnabled = !1));
      }),
      (o.prototype.update = function () {
        var t = this.isPrevious ? 'prev_' : 'next_';
        this.parent.element.classList.remove(
          'flickityt4s_' + t + 'disable',
          'flickityt4s_' + t + 'enable'
        );
        var e = this.parent.slides;
        if (this.parent.options.wrapAround && e.length > 1) this.enable();
        else {
          var i = e.length ? e.length - 1 : 0,
            n = this.isPrevious ? 0 : i,
            s = this.parent.selectedIndex == n ? 'disable' : 'enable';
          this[s](), this.parent.element.classList.add('flickityt4s_' + t + s);
        }
      }),
      (o.prototype.destroy = function () {
        this.deactivate(), this.allOff();
      }),
      n.extend(e.defaults, {
        prevNextButtons: !0,
        arrowShape: { x0: 10, x1: 60, y1: 50, x2: 70, y2: 40, x3: 30 },
      }),
      e.createMethods.push('_createPrevNextButtons');
    var r = e.prototype;
    return (
      (r._createPrevNextButtons = function () {
        this.options.prevNextButtons &&
          ((this.prevButton = new o(-1, this)),
          (this.nextButton = new o(1, this)),
          this.on('activate', this.activatePrevNextButtons));
      }),
      (r.activatePrevNextButtons = function () {
        this.prevButton.activate(),
          this.nextButton.activate(),
          this.on('deactivate', this.deactivatePrevNextButtons);
      }),
      (r.deactivatePrevNextButtons = function () {
        this.prevButton.deactivate(),
          this.nextButton.deactivate(),
          this.off('deactivate', this.deactivatePrevNextButtons);
      }),
      (e.PrevNextButton = o),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/page-dots',
          ['./flickityt4s', 'unipointer/unipointer', 'fizzy-ui-utils/utils'],
          function (i, n, s) {
            return e(t, i, n, s);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          t,
          require('./flickityt4s'),
          require('unipointer'),
          require('fizzy-ui-utils')
        ))
      : e(t, t.Flickityt4s, t.Unipointer, t.fizzyUIUtils);
  })(window, function (t, e, i, n) {
    function s(t) {
      (this.parent = t), this._create();
    }
    (s.prototype = Object.create(i.prototype)),
      (s.prototype._create = function () {
        (this.holder = document.createElement('ol')),
          (this.holder.className = 'flickityt4s-page-dots'),
          (this.dots = []),
          (this.handleClick = this.onClick.bind(this)),
          this.on(
            'pointerDown',
            this.parent.childUIPointerDown.bind(this.parent)
          );
      }),
      (s.prototype.activate = function () {
        this.setDots(),
          this.holder.addEventListener('click', this.handleClick),
          this.bindStartEvent(this.holder),
          this.parent.element.appendChild(this.holder);
      }),
      (s.prototype.deactivate = function () {
        this.holder.removeEventListener('click', this.handleClick),
          this.unbindStartEvent(this.holder),
          this.parent.element.removeChild(this.holder);
      }),
      (s.prototype.setDots = function () {
        var t = this.parent.slides.length - this.dots.length;
        t > 0 ? this.addDots(t) : t < 0 && this.removeDots(-t);
      }),
      (s.prototype.addDots = function (t) {
        for (
          var e = document.createDocumentFragment(),
            i = [],
            n = this.dots.length,
            s = n + t,
            o = n;
          o < s;
          o++
        ) {
          var r = document.createElement('li');
          (r.className = 'dot'),
            r.setAttribute('aria-label', 'Page dot ' + (o + 1)),
            e.appendChild(r),
            i.push(r);
        }
        this.holder.appendChild(e), (this.dots = this.dots.concat(i));
      }),
      (s.prototype.removeDots = function (t) {
        this.dots.splice(this.dots.length - t, t).forEach(function (t) {
          this.holder.removeChild(t);
        }, this);
      }),
      (s.prototype.updateSelected = function () {
        this.selectedDot &&
          ((this.selectedDot.className = 'dot'),
          this.selectedDot.removeAttribute('aria-current')),
          this.dots.length &&
            ((this.selectedDot = this.dots[this.parent.selectedIndex]),
            (this.selectedDot.className = 'dot is-selected'),
            this.selectedDot.setAttribute('aria-current', 'step'));
      }),
      (s.prototype.onTap = s.prototype.onClick =
        function (t) {
          var e = t.target;
          if ('LI' == e.nodeName) {
            this.parent.uiChange();
            var i = this.dots.indexOf(e);
            this.parent.select(i);
          }
        }),
      (s.prototype.destroy = function () {
        this.deactivate(), this.allOff();
      }),
      (e.PageDots = s),
      n.extend(e.defaults, { pageDots: !0 }),
      e.createMethods.push('_createPageDots');
    var o = e.prototype;
    return (
      (o._createPageDots = function () {
        this.options.pageDots &&
          ((this.pageDots = new s(this)),
          this.on('activate', this.activatePageDots),
          this.on('select', this.updateSelectedPageDots),
          this.on('cellChange', this.updatePageDots),
          this.on('resize', this.updatePageDots),
          this.on('deactivate', this.deactivatePageDots));
      }),
      (o.activatePageDots = function () {
        this.pageDots.activate();
      }),
      (o.updateSelectedPageDots = function () {
        this.pageDots.updateSelected();
      }),
      (o.updatePageDots = function () {
        this.pageDots.setDots();
      }),
      (o.deactivatePageDots = function () {
        this.pageDots.deactivate();
      }),
      (e.PageDots = s),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/player',
          ['ev-emitter/ev-emitter', 'fizzy-ui-utils/utils', './flickityt4s'],
          function (t, i, n) {
            return e(t, i, n);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          require('ev-emitter'),
          require('fizzy-ui-utils'),
          require('./flickityt4s')
        ))
      : e(t.EvEmitter, t.fizzyUIUtils, t.Flickityt4s);
  })(window, function (t, e, i) {
    function n(t) {
      (this.parent = t),
        (this.state = 'stopped'),
        (this.onVisibilityChange = this.visibilityChange.bind(this)),
        (this.onVisibilityPlay = this.visibilityPlay.bind(this));
    }
    (n.prototype = Object.create(t.prototype)),
      (n.prototype.play = function () {
        'playing' != this.state &&
          (document.hidden
            ? document.addEventListener(
                'visibilitychange',
                this.onVisibilityPlay
              )
            : ((this.state = 'playing'),
              document.addEventListener(
                'visibilitychange',
                this.onVisibilityChange
              ),
              this.tick()));
      }),
      (n.prototype.tick = function () {
        if ('playing' == this.state) {
          var t = this.parent.options.autoPlay;
          t = 'number' == typeof t ? t : 3e3;
          var e = this;
          this.clear(),
            (this.timeout = setTimeout(function () {
              e.parent.next(!0), e.tick();
            }, t));
        }
      }),
      (n.prototype.stop = function () {
        (this.state = 'stopped'),
          this.clear(),
          document.removeEventListener(
            'visibilitychange',
            this.onVisibilityChange
          );
      }),
      (n.prototype.clear = function () {
        clearTimeout(this.timeout);
      }),
      (n.prototype.pause = function () {
        'playing' == this.state && ((this.state = 'paused'), this.clear());
      }),
      (n.prototype.unpause = function () {
        'paused' == this.state && this.play();
      }),
      (n.prototype.visibilityChange = function () {
        this[document.hidden ? 'pause' : 'unpause']();
      }),
      (n.prototype.visibilityPlay = function () {
        this.play(),
          document.removeEventListener(
            'visibilitychange',
            this.onVisibilityPlay
          );
      }),
      e.extend(i.defaults, { pauseAutoPlayOnHover: !0 }),
      i.createMethods.push('_createPlayer');
    var s = i.prototype;
    return (
      (s._createPlayer = function () {
        (this.player = new n(this)),
          this.on('activate', this.activatePlayer),
          this.on('uiChange', this.stopPlayer),
          this.on('pointerDown', this.stopPlayer),
          this.on('deactivate', this.deactivatePlayer);
      }),
      (s.activatePlayer = function () {
        this.options.autoPlay &&
          (this.player.play(),
          this.element.addEventListener('mouseenter', this));
      }),
      (s.playPlayer = function () {
        this.player.play();
      }),
      (s.stopPlayer = function () {
        this.player.stop();
      }),
      (s.pausePlayer = function () {
        this.player.pause();
      }),
      (s.unpausePlayer = function () {
        this.player.unpause();
      }),
      (s.deactivatePlayer = function () {
        this.player.stop(),
          this.element.removeEventListener('mouseenter', this);
      }),
      (s.onmouseenter = function () {
        this.options.pauseAutoPlayOnHover &&
          (this.player.pause(),
          this.element.addEventListener('mouseleave', this));
      }),
      (s.onmouseleave = function () {
        this.player.unpause(),
          this.element.removeEventListener('mouseleave', this);
      }),
      (i.Player = n),
      i
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/add-remove-cell',
          ['./flickityt4s', 'fizzy-ui-utils/utils'],
          function (i, n) {
            return e(t, i, n);
          }
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(
          t,
          require('./flickityt4s'),
          require('fizzy-ui-utils')
        ))
      : e(t, t.Flickityt4s, t.fizzyUIUtils);
  })(window, function (t, e, i) {
    var n = e.prototype;
    return (
      (n.insert = function (t, e) {
        var i = this._makeCells(t);
        if (i && i.length) {
          var n = this.cells.length;
          e = void 0 === e ? n : e;
          var s = (function (t) {
              var e = document.createDocumentFragment();
              return (
                t.forEach(function (t) {
                  e.appendChild(t.element);
                }),
                e
              );
            })(i),
            o = e == n;
          if (o) this.slider.appendChild(s);
          else {
            var r = this.cells[e].element;
            this.slider.insertBefore(s, r);
          }
          if (0 === e) this.cells = i.concat(this.cells);
          else if (o) this.cells = this.cells.concat(i);
          else {
            var a = this.cells.splice(e, n - e);
            this.cells = this.cells.concat(i).concat(a);
          }
          this._sizeCells(i), this.cellChange(e, !0);
        }
      }),
      (n.append = function (t) {
        this.insert(t, this.cells.length);
      }),
      (n.prepend = function (t) {
        this.insert(t, 0);
      }),
      (n.remove = function (t) {
        var e = this.getCells(t);
        if (e && e.length) {
          var n = this.cells.length - 1;
          e.forEach(function (t) {
            t.remove();
            var e = this.cells.indexOf(t);
            (n = Math.min(e, n)), i.removeFrom(this.cells, t);
          }, this),
            this.cellChange(n, !0);
        }
      }),
      (n.cellSizeChange = function (t) {
        var e = this.getCell(t);
        if (e) {
          e.getSize();
          var i = this.cells.indexOf(e);
          this.cellChange(i);
        }
      }),
      (n.cellChange = function (t, e) {
        var i = this.selectedElement;
        this._positionCells(t),
          this._getWrapShiftCells(),
          this.setGallerySize(),
          this.setPrevNextButtons();
        var n = this.getCell(i);
        n && (this.selectedIndex = this.getCellSlideIndex(n)),
          (this.selectedIndex = Math.min(
            this.slides.length - 1,
            this.selectedIndex
          )),
          this.emitEvent('cellChange', [t]),
          this.select(this.selectedIndex),
          e && this.positionSliderAtSelected();
      }),
      e
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s/js/index',
          [
            './flickityt4s',
            './drag',
            './prev-next-button',
            './page-dots',
            './player',
            './add-remove-cell',
            './lazyload',
          ],
          e
        )
      : 'object' == typeof module &&
        module.exports &&
        (module.exports = e(
          require('./flickityt4s'),
          require('./drag'),
          require('./prev-next-button'),
          require('./page-dots'),
          require('./player'),
          require('./add-remove-cell'),
          require('./lazyload')
        ));
  })(window, function (t) {
    return t;
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(
          'flickityt4s-as-nav-for/as-nav-for',
          ['flickityt4s/js/index', 'fizzy-ui-utils/utils'],
          e
        )
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('flickityt4s'), require('fizzy-ui-utils')))
      : (t.Flickityt4s = e(t.Flickityt4s, t.fizzyUIUtils));
  })(window, function (t, e) {
    t.createMethods.push('_createAsNavFor');
    var i = t.prototype;
    return (
      (i._createAsNavFor = function () {
        this.on('activate', this.activateAsNavFor),
          this.on('deactivate', this.deactivateAsNavFor),
          this.on('destroy', this.destroyAsNavFor);
        var t = this.options.asNavFor;
        if (t) {
          var e = this;
          setTimeout(function () {
            e.setNavCompanion(t);
          });
        }
      }),
      (i.setNavCompanion = function (i) {
        i = e.getQueryElement(i);
        var n = t.data(i);
        if (n && n != this) {
          this.navCompanion = n;
          var s = this;
          (this.onNavCompanionSelect = function () {
            s.navCompanionSelect();
          }),
            n.on('select', this.onNavCompanionSelect),
            this.on('staticClick', this.onNavStaticClick),
            this.navCompanionSelect(!0);
        }
      }),
      (i.navCompanionSelect = function (t) {
        var e = this.navCompanion && this.navCompanion.selectedCells;
        if (e) {
          var i,
            n = e[0],
            s = this.navCompanion.cells.indexOf(n),
            o = s + e.length - 1,
            r = Math.floor((o - (i = s)) * this.navCompanion.cellAlign + i);
          if (
            (this.selectCell(r, !1, t),
            this.removeNavSelectedElements(),
            !(r >= this.cells.length))
          ) {
            var a = this.cells.slice(s, o + 1);
            (this.navSelectedElements = a.map(function (t) {
              return t.element;
            })),
              this.changeNavSelectedClass('add');
          }
        }
      }),
      (i.changeNavSelectedClass = function (t) {
        this.navSelectedElements.forEach(function (e) {
          e.classList[t]('is-nav-selected');
        });
      }),
      (i.activateAsNavFor = function () {
        this.navCompanionSelect(!0);
      }),
      (i.removeNavSelectedElements = function () {
        this.navSelectedElements &&
          (this.changeNavSelectedClass('remove'),
          delete this.navSelectedElements);
      }),
      (i.onNavStaticClick = function (t, e, i, n) {
        'number' == typeof n && this.navCompanion.selectCell(n);
      }),
      (i.deactivateAsNavFor = function () {
        this.removeNavSelectedElements();
      }),
      (i.destroyAsNavFor = function () {
        this.navCompanion &&
          (this.navCompanion.off('select', this.onNavCompanionSelect),
          this.off('staticClick', this.onNavStaticClick),
          delete this.navCompanion);
      }),
      t
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('flickityt4s'), require('fizzy-ui-utils')))
      : e(t.Flickityt4s, t.fizzyUIUtils);
  })(this, function (t, e) {
    var i = t.Slide,
      n = i.prototype.updateTarget;
    (i.prototype.updateTarget = function () {
      if ((n.apply(this, arguments), this.parent.options.fade)) {
        var t = this.target - this.x,
          e = this.cells[0].x;
        this.cells.forEach(function (i) {
          var n = i.x - e - t;
          i.renderPosition(n);
        });
      }
    }),
      (i.prototype.setOpacity = function (t) {
        this.cells.forEach(function (e) {
          e.element.style.opacity = t;
        });
      });
    var s = t.prototype;
    t.createMethods.push('_createFade'),
      (s._createFade = function () {
        (this.fadeIndex = this.selectedIndex),
          (this.prevSelectedIndex = this.selectedIndex),
          this.on('select', this.onSelectFade),
          this.on('dragEnd', this.onDragEndFade),
          this.on('settle', this.onSettleFade),
          this.on('activate', this.onActivateFade),
          this.on('deactivate', this.onDeactivateFade);
      });
    var o = s.updateSlides;
    (s.updateSlides = function () {
      o.apply(this, arguments), this.options.fade;
    }),
      (s.onSelectFade = function () {
        (this.fadeIndex = Math.min(
          this.prevSelectedIndex,
          this.slides.length - 1
        )),
          (this.prevSelectedIndex = this.selectedIndex);
      }),
      (s.onSettleFade = function () {
        delete this.didDragEnd, this.options.fade;
      }),
      (s.onDragEndFade = function () {
        this.didDragEnd = !0;
      }),
      (s.onActivateFade = function () {
        this.options.fade && this.element.classList.add('is-fade');
      }),
      (s.onDeactivateFade = function () {
        this.options.fade &&
          (this.element.classList.remove('is-fade'),
          this.slides.forEach(function (t) {
            t.setOpacity('');
          }));
      });
    var r = s.positionSlider;
    s.positionSlider = function () {
      this.options.fade
        ? (this.fadeSlides(), this.dispatchScrollEvent())
        : r.apply(this, arguments);
    };
    var a = s.positionSliderAtSelected;
    (s.positionSliderAtSelected = function () {
      this.options.fade && this.setTranslateX(0), a.apply(this, arguments);
    }),
      (s.fadeSlides = function () {
        this.slides.length;
      }),
      (s.getFadeIndexes = function () {
        return this.isDragging || this.didDragEnd
          ? this.options.wrapAround
            ? this.getFadeDragWrapIndexes()
            : this.getFadeDragLimitIndexes()
          : { a: this.fadeIndex, b: this.selectedIndex };
      }),
      (s.getFadeDragWrapIndexes = function () {
        var t = this.slides.map(function (t, e) {
            return this.getSlideDistance(-this.x, e);
          }, this),
          i = t.map(function (t) {
            return Math.abs(t);
          }),
          n = Math.min.apply(Math, i),
          s = i.indexOf(n),
          o = t[s],
          r = this.slides.length,
          a = o >= 0 ? 1 : -1;
        return { a: s, b: e.modulo(s + a, r) };
      }),
      (s.getFadeDragLimitIndexes = function () {
        for (var t = 0, e = 0; e < this.slides.length - 1; e++) {
          var i = this.slides[e];
          if (-this.x < i.target) break;
          t = e;
        }
        return { a: t, b: t + 1 };
      }),
      (s.wrapDifference = function (t, e) {
        var i = e - t;
        if (!this.options.wrapAround) return i;
        var n = i + this.slideableWidth,
          s = i - this.slideableWidth;
        return (
          Math.abs(n) < Math.abs(i) && (i = n),
          Math.abs(s) < Math.abs(i) && (i = s),
          i
        );
      });
    var h = s._getWrapShiftCells;
    s._getWrapShiftCells = function () {
      this.options.fade || h.apply(this, arguments);
    };
    var l = s.shiftWrapCells;
    return (
      (s.shiftWrapCells = function () {
        this.options.fade || l.apply(this, arguments);
      }),
      t
    );
  }),
  (function (t, e) {
    'function' == typeof define && define.amd
      ? define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], e)
      : 'object' == typeof module && module.exports
      ? (module.exports = e(require('flickityt4s'), require('fizzy-ui-utils')))
      : (t.Flickityt4s = e(t.Flickityt4s, t.fizzyUIUtils));
  })(window, function (t, e) {
    'use strict';
    return (
      t.createMethods.push('_createSync'),
      (t.prototype._createSync = function () {
        this.syncers = {};
        var t = this.options.sync;
        if ((this.on('destroy', this.unsyncAll), t)) {
          var e = this;
          setTimeout(function () {
            e.sync(t);
          });
        }
      }),
      (t.prototype.sync = function (i) {
        i = e.getQueryElement(i);
        var n = t.data(i);
        n && (this._syncCompanion(n), n._syncCompanion(this));
      }),
      (t.prototype._syncCompanion = function (t) {
        var e = this;
        function i() {
          var i = e.selectedIndex;
          t.selectedIndex != i && t.select(i);
        }
        this.on('select', i),
          (this.syncers[t.guid] = { flickityt4s: t, listener: i });
      }),
      (t.prototype.unsync = function (i) {
        i = e.getQueryElement(i);
        var n = t.data(i);
        this._unsync(n);
      }),
      (t.prototype._unsync = function (t) {
        t && (this._unsyncCompanion(t), t._unsyncCompanion(this));
      }),
      (t.prototype._unsyncCompanion = function (t) {
        var e = t.guid,
          i = this.syncers[e];
        this.off('select', i.listener), delete this.syncers[e];
      }),
      (t.prototype.unsyncAll = function () {
        for (var t in this.syncers) {
          var e = this.syncers[t];
          this._unsync(e.flickityt4s);
        }
      }),
      t
    );
  });
// var jsBdThe4=document.getElementsByTagName("HTML")[0],RtlThe4=jsBdThe4.classList.contains("rtl_true"),LtrThe4=!RtlThe4;!function(t,e){"function"==typeof define&&define.amd?define("jQuery_T4NT-bridget/jQuery_T4NT-bridget",["jQuery_T4NT"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jQuery_T4NT")):t.jQuery_T4NTBridget=e(t,t.jQuery_T4NT)}(window,function(t,e){"use strict";function i(i,o,a){(a=a||e||t.jQuery_T4NT)&&(o.prototype.option||(o.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){return"string"==typeof t?function(t,e,n){var s,o="$()."+i+'("'+e+'")';return t.each(function(t,h){var l=a.data(h,i);if(l){var c=l[e];if(c&&"_"!=e.charAt(0)){var u=c.apply(l,n);s=void 0===s?u:s}else r(o+" is not a valid method")}else r(i+" not initialized. Cannot call methods, i.e. "+o)}),void 0!==s?s:t}(this,t,s.call(arguments,1)):(function(t,e){t.each(function(t,n){var s=a.data(n,i);s?(s.option(e),s._init()):(s=new o(n,e),a.data(n,i,s))})}(this,t),this)},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var s=Array.prototype.slice,o=t.console,r=void 0===o?function(){}:function(t){o.error(t)};return n(e||t.jQuery_T4NT),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{};return(i[t]=i[t]||{})[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],s=0;s<i.length;s++){var o=i[s];n&&n[o]&&(this.off(t,o),delete n[o]),o.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t);return-1==t.indexOf("%")&&!isNaN(e)&&e}function e(t){var e=getComputedStyle(t);return e||o("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function i(){if(!h){h=!0;var i=document.createElement("div");i.style.width="200px",i.style.padding="1px 2px 3px 4px",i.style.borderStyle="solid",i.style.borderWidth="1px 2px 3px 4px",i.style.boxSizing="border-box";var o=document.body||document.documentElement;o.appendChild(i);var r=e(i);s=200==Math.round(t(r.width)),n.isBoxSizeOuter=s,o.removeChild(i)}}function n(n){if(i(),"string"==typeof n&&(n=document.querySelector(n)),n&&"object"==typeof n&&n.nodeType){var o=e(n);if("none"==o.display)return function(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<a;e++)t[r[e]]=0;return t}();var h={};h.width=n.offsetWidth,h.height=n.offsetHeight;for(var l=h.isBorderBox="border-box"==o.boxSizing,c=0;c<a;c++){var u=r[c],d=o[u],f=parseFloat(d);h[u]=isNaN(f)?0:f}var p=h.paddingLeft+h.paddingRight,m=h.paddingTop+h.paddingBottom,g=h.marginLeft+h.marginRight,y=h.marginTop+h.marginBottom,v=h.borderLeftWidth+h.borderRightWidth,_=h.borderTopWidth+h.borderBottomWidth,x=l&&s,b=t(o.width);!1!==b&&(h.width=b+(x?0:p+v));var S=t(o.height);return!1!==S&&(h.height=S+(x?0:m+_)),h.innerWidth=h.width-(p+v),h.innerHeight=h.height-(m+_),h.outerWidth=h.width+g,h.outerHeight=h.height+y,h}}var s,o="undefined"==typeof console?function(){}:function(t){console.error(t)},r=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],a=r.length,h=!1;return n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i]+"MatchesSelector";if(t[n])return n}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={extend:function(t,e){for(var i in e)t[i]=e[i];return t},modulo:function(t,e){return(t%e+e)%e}},n=Array.prototype.slice;i.makeArray=function(t){return Array.isArray(t)?t:null==t?[]:"object"==typeof t&&"number"==typeof t.length?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var s=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void s.push(t);e(t,n)&&s.push(t);for(var i=t.querySelectorAll(n),o=0;o<i.length;o++)s.push(i[o])}}),s},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];clearTimeout(t);var e=arguments,o=this;this[s]=setTimeout(function(){n.apply(o,e),delete o[s]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var s=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var o=i.toDashed(n),r="data-"+o,a=document.querySelectorAll("["+r+"]"),h=document.querySelectorAll(".js-"+o),l=i.makeArray(a).concat(i.makeArray(h)),c=r+"-options",u=t.jQuery_T4NT;l.forEach(function(t){var i,o=t.getAttribute(r)||t.getAttribute(c);try{i=o&&JSON.parse(o)}catch(e){return void(s&&s.error("Error parsing "+r+" on "+t.className+": "+e))}var a=new e(t,i);u&&u.data(t,n,a)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var n=document.documentElement.style,s="string"==typeof n.transition?"transition":"WebkitTransition",o="string"==typeof n.transform?"transform":"WebkitTransform",r={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],a={transform:o,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},h=i.prototype=Object.create(t.prototype);h.constructor=i,h._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},h.getSize=function(){this.size=e(this.element)},h.css=function(t){var e=this.element.style;for(var i in t){e[a[i]||i]=t[i]}},h.getPosition=function(){var t=getComputedStyle(this.element),e=LtrThe4,i=this.layout._getOption("originTop"),n=t[e?"left":"right"],s=t[i?"top":"bottom"],o=parseFloat(n),r=parseFloat(s),a=this.layout.size;-1!=n.indexOf("%")&&(o=o/100*a.width),-1!=s.indexOf("%")&&(r=r/100*a.height),o=isNaN(o)?0:o,r=isNaN(r)?0:r,o-=e?a.paddingLeft:a.paddingRight,r-=i?a.paddingTop:a.paddingBottom,this.position.x=o,this.position.y=r},h.layoutPosition=function(){var t=this.layout.size,e={},i=LtrThe4,n=this.layout._getOption("originTop"),s=i?"paddingLeft":"paddingRight",o=i?"left":"right",r=i?"right":"left",a=this.position.x+t[s];e[o]=this.getXValue(a),e[r]="";var h=n?"paddingTop":"paddingBottom",l=n?"top":"bottom",c=n?"bottom":"top",u=this.position.y+t[h];e[l]=this.getYValue(u),e[c]="",this.css(e),this.emitEvent("layout",[this])},h.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},h.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},h._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,s=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),!s||this.isTransitioning){var o=t-i,r=e-n,a={};a.transform=this.getTranslate(o,r),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})}else this.layoutPosition()},h.getTranslate=function(t,e){return"translate3d("+(t=LtrThe4?t:-t)+"px, "+(e=this.layout._getOption("originTop")?e:-e)+"px, 0)"},h.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},h.moveTo=h._transitionTo,h.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},h._nonTransition=function(t){for(var e in this.css(t.to),t.isCleaning&&this._removeStyles(t.to),t.onTransitionEnd)t.onTransitionEnd[e].call(this)},h.transition=function(t){if(parseFloat(this.layout.options.transitionDuration)){var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);this.element.offsetHeight;null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0}else this._nonTransition(t)};var l="opacity,"+function(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}(o);h.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(r,this,!1)}},h.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},h.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};h.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],function(t){for(var e in t)return!1;return!0}(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd)e.onEnd[i].call(this),delete e.onEnd[i];this.emitEvent("transitionEnd",[this])}},h.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(r,this,!1),this.isTransitioning=!1},h._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var u={transitionProperty:"",transitionDuration:"",transitionDelay:""};return h.removeTransitionStyles=function(){this.css(u)},h.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},h.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},h.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},h.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},h.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},h.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},h.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},h.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},h.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},i}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,s,o){return e(t,i,n,s,o)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,s){"use strict";function o(t,e){var i=n.getQueryElement(t);if(i){this.element=i,h&&(this.$element=h(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var s=++c;this.element.outlayerGUID=s,u[s]=this,this._create(),this._getOption("initLayout")&&this.layout()}else a&&a.error("Bad element for "+this.constructor.namespace+": "+(i||t))}function r(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}var a=t.console,h=t.jQuery_T4NT,l=function(){},c=0,u={};o.namespace="outlayer",o.Item=s,o.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var d=o.prototype;n.extend(d,e.prototype),d.option=function(t){n.extend(this.options,t)},d._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},o.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},d._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle),this._getOption("resize")&&this.bindResize()},d.reloadItems=function(){this.items=this._itemize(this.element.children)},d._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],s=0;s<e.length;s++){var o=new i(e[s],this);n.push(o)}return n},d._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},d.getItemElements=function(){return this.items.map(function(t){return t.element})},d.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},d._init=d.layout,d._resetLayout=function(){this.getSize()},d.getSize=function(){this.size=i(this.element)},d._getMeasurement=function(t,e){var n,s=this.options[t];s?("string"==typeof s?n=this.element.querySelector(s):s instanceof HTMLElement&&(n=s),this[t]=n?i(n)[e]:s):this[t]=0},d.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},d._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},d._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},d._getItemLayoutPosition=function(){return{x:0,y:0}},d._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},d.updateStagger=function(){var t=this.options.stagger;return null==t?void(this.stagger=0):(this.stagger=function(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];return i.length?(i=parseFloat(i))*(f[n]||1):0}(t),this.stagger)},d._positionItem=function(t,e,i,n,s){n?t.goTo(e,i):(t.stagger(s*this.stagger),t.moveTo(e,i))},d._postLayout=function(){this.resizeContainer()},d.resizeContainer=function(){if(this._getOption("resizeContainer")){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},d._getContainerSize=l,d._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},d._emitCompleteOnItems=function(t,e){function i(){s.dispatchEvent(t+"Complete",null,[e])}function n(){++r==o&&i()}var s=this,o=e.length;if(e&&o){var r=0;e.forEach(function(e){e.once(t,n)})}else i()},d.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),h)if(this.$element=this.$element||h(this.element),e){var s=h.Event(e);s.type=t,this.$element.trigger(s,i)}else this.$element.trigger(t,i)},d.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},d.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},d.stamp=function(t){(t=this._find(t))&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},d.unstamp=function(t){(t=this._find(t))&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},d._find=function(t){if(t)return"string"==typeof t&&(t=this.element.querySelectorAll(t)),n.makeArray(t)},d._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},d._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},d._manageStamp=l,d._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,s=i(t);return{left:e.left-n.left-s.marginLeft,top:e.top-n.top-s.marginTop,right:n.right-e.right-s.marginRight,bottom:n.bottom-e.bottom-s.marginBottom}},d.handleEvent=n.handleEvent,d.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},d.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},d.onresize=function(){this.resize()},n.debounceMethod(o,"onresize",100),d.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},d.needsResizeLayout=function(){var t=i(this.element);return this.size&&t&&t.innerWidth!==this.size.innerWidth},d.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},d.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},d.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},d.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},d.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},d.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},d.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},d.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},d.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},d.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},d.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete u[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},o.data=function(t){var e=(t=n.getQueryElement(t))&&t.outlayerGUID;return e&&u[e]},o.create=function(t,e){var i=r(o);return i.defaults=n.extend({},o.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},o.compatOptions),i.namespace=t,i.data=o.data,i.Item=r(s),n.htmlInit(i,t),h&&h.bridget&&h.bridget(t,i),i};var f={ms:1,s:1e3};return o.Item=s,o}),function(t,e){"function"==typeof define&&define.amd?define("isotopet4s-layout/js/item",["outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer")):(t.isotopet4s=t.isotopet4s||{},t.isotopet4s.Item=e(t.Outlayer))}(window,function(t){"use strict";function e(){t.Item.apply(this,arguments)}var i=e.prototype=Object.create(t.Item.prototype),n=i._create;i._create=function(){this.id=this.layout.itemGUID++,n.call(this),this.sortData={}},i.updateSortData=function(){if(!this.isIgnored){this.sortData.id=this.id,this.sortData["original-order"]=this.id,this.sortData.random=Math.random();var t=this.layout.options.getSortData,e=this.layout._sorters;for(var i in t){var n=e[i];this.sortData[i]=n(this.element,this)}}};var s=i.destroy;return i.destroy=function(){s.apply(this,arguments),this.css({display:""})},e}),function(t,e){"function"==typeof define&&define.amd?define("isotopet4s-layout/js/layout-mode",["get-size/get-size","outlayer/outlayer"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer")):(t.isotopet4s=t.isotopet4s||{},t.isotopet4s.LayoutMode=e(t.getSize,t.Outlayer))}(window,function(t,e){"use strict";function i(t){this.isotopet4s=t,t&&(this.options=t.options[this.namespace],this.element=t.element,this.items=t.filteredItems,this.size=t.size)}var n=i.prototype;return["_resetLayout","_getItemLayoutPosition","_manageStamp","_getContainerSize","_getElementOffset","needsResizeLayout","_getOption"].forEach(function(t){n[t]=function(){return e.prototype[t].apply(this.isotopet4s,arguments)}}),n.needsVerticalResizeLayout=function(){var e=t(this.isotopet4s.element);return this.isotopet4s.size&&e&&e.innerHeight!=this.isotopet4s.size.innerHeight},n._getMeasurement=function(){this.isotopet4s._getMeasurement.apply(this,arguments)},n.getColumnWidth=function(){this.getSegmentSize("column","Width")},n.getRowHeight=function(){this.getSegmentSize("row","Height")},n.getSegmentSize=function(t,e){var i=t+e,n="outer"+e;if(this._getMeasurement(i,n),!this[i]){var s=this.getFirstItemSize();this[i]=s&&s[n]||this.isotopet4s.size["inner"+e]}},n.getFirstItemSize=function(){var e=this.isotopet4s.filteredItems[0];return e&&e.element&&t(e.element)},n.layout=function(){this.isotopet4s.layout.apply(this.isotopet4s,arguments)},n.getSize=function(){this.isotopet4s.getSize(),this.size=this.isotopet4s.size},i.modes={},i.create=function(t,e){function s(){i.apply(this,arguments)}return s.prototype=Object.create(n),s.prototype.constructor=s,e&&(s.options=e),s.prototype.namespace=t,i.modes[t]=s,s},i}),function(t,e){"function"==typeof define&&define.amd?define("masonry-layout/masonry",["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,s=this.containerWidth+this.gutter,o=s/n,r=n-s%n;o=Math[r&&r<1?"round":"floor"](o),this.cols=Math.max(o,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth")?this.element.parentNode:this.element,i=e(t);this.containerWidth=i&&i.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=Math[e&&e<1?"round":"ceil"](t.size.outerWidth/this.columnWidth);i=Math.min(i,this.cols);for(var n=this[this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition"](i,t),s={x:this.columnWidth*n.col,y:n.y},o=n.y+t.size.outerHeight,r=i+n.col,a=n.col;a<r;a++)this.colYs[a]=o;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(t<2)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;n<i;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(e<2)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols;i=t>1&&i+t>this.cols?0:i;var n=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=n?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),s=this._getOption("originLeft")?n.left:n.right,o=s+i.outerWidth,r=Math.floor(s/this.columnWidth);r=Math.max(0,r);var a=Math.floor(o/this.columnWidth);a-=o%this.columnWidth?0:1,a=Math.min(this.cols-1,a);for(var h=(this._getOption("originTop")?n.top:n.bottom)+i.outerHeight,l=r;l<=a;l++)this.colYs[l]=Math.max(h,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i}),function(t,e){"function"==typeof define&&define.amd?define("isotopet4s-layout/js/layout-modes/masonry",["../layout-mode","masonry-layout/masonry"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode"),require("masonry-layout")):e(t.isotopet4s.LayoutMode,t.Masonry)}(window,function(t,e){"use strict";var i=t.create("masonry"),n=i.prototype,s={_getElementOffset:!0,layout:!0,_getMeasurement:!0};for(var o in e.prototype)s[o]||(n[o]=e.prototype[o]);var r=n.measureColumns;n.measureColumns=function(){this.items=this.isotopet4s.filteredItems,r.call(this)};var a=n._getOption;return n._getOption=function(t){return"fitWidth"==t?void 0!==this.options.isFitWidth?this.options.isFitWidth:this.options.fitWidth:a.apply(this.isotopet4s,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("isotopet4s-layout/js/layout-modes/fit-rows",["../layout-mode"],e):"object"==typeof exports?module.exports=e(require("../layout-mode")):e(t.isotopet4s.LayoutMode)}(window,function(t){"use strict";var e=t.create("fitRows"),i=e.prototype;return i._resetLayout=function(){this.x=0,this.y=0,this.maxY=0,this._getMeasurement("gutter","outerWidth")},i._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth+this.gutter,i=this.isotopet4s.size.innerWidth+this.gutter;0!==this.x&&e+this.x>i&&(this.x=0,this.y=this.maxY);var n={x:this.x,y:this.y};return this.maxY=Math.max(this.maxY,this.y+t.size.outerHeight),this.x+=e,n},i._getContainerSize=function(){return{height:this.maxY}},e}),function(t,e){"function"==typeof define&&define.amd?define("isotopet4s-layout/js/layout-modes/vertical",["../layout-mode"],e):"object"==typeof module&&module.exports?module.exports=e(require("../layout-mode")):e(t.isotopet4s.LayoutMode)}(window,function(t){"use strict";var e=t.create("vertical",{horizontalAlignment:0}),i=e.prototype;return i._resetLayout=function(){this.y=0},i._getItemLayoutPosition=function(t){t.getSize();var e=(this.isotopet4s.size.innerWidth-t.size.outerWidth)*this.options.horizontalAlignment,i=this.y;return this.y+=t.size.outerHeight,{x:e,y:i}},i._getContainerSize=function(){return{height:this.y}},e}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","desandro-matches-selector/matches-selector","fizzy-ui-utils/utils","isotopet4s-layout/js/item","isotopet4s-layout/js/layout-mode","isotopet4s-layout/js/layout-modes/masonry","isotopet4s-layout/js/layout-modes/fit-rows","isotopet4s-layout/js/layout-modes/vertical"],function(i,n,s,o,r,a){return e(t,i,n,s,o,r,a)}):"object"==typeof module&&module.exports?module.exports=e(t,require("outlayer"),require("get-size"),require("desandro-matches-selector"),require("fizzy-ui-utils"),require("isotopet4s-layout/js/item"),require("isotopet4s-layout/js/layout-mode"),require("isotopet4s-layout/js/layout-modes/masonry"),require("isotopet4s-layout/js/layout-modes/fit-rows"),require("isotopet4s-layout/js/layout-modes/vertical")):t.isotopet4s=e(t,t.Outlayer,t.getSize,t.matchesSelector,t.fizzyUIUtils,t.isotopet4s.Item,t.isotopet4s.LayoutMode)}(window,function(t,e,i,n,s,o,r){var a=t.jQuery_T4NT,h=String.prototype.trim?function(t){return t.trim()}:function(t){return t.replace(/^\s+|\s+$/g,"")},l=e.create("isotopet4s",{layoutMode:"masonry",isjQuery_T4NTFiltering:!0,sortAscending:!0});l.Item=o,l.LayoutMode=r;var c=l.prototype;c._create=function(){for(var t in this.itemGUID=0,this._sorters={},this._getSorters(),e.prototype._create.call(this),this.modes={},this.filteredItems=this.items,this.sortHistory=["original-order"],r.modes)this._initLayoutMode(t)},c.reloadItems=function(){this.itemGUID=0,e.prototype.reloadItems.call(this)},c._itemize=function(){for(var t=e.prototype._itemize.apply(this,arguments),i=0;i<t.length;i++){t[i].id=this.itemGUID++}return this._updateItemsSortData(t),t},c._initLayoutMode=function(t){var e=r.modes[t],i=this.options[t]||{};this.options[t]=e.options?s.extend(e.options,i):i,this.modes[t]=new e(this)},c.layout=function(){return!this._isLayoutInited&&this._getOption("initLayout")?void this.arrange():void this._layout()},c._layout=function(){var t=this._getIsInstant();this._resetLayout(),this._manageStamps(),this.layoutItems(this.filteredItems,t),this._isLayoutInited=!0},c.arrange=function(t){this.option(t),this._getIsInstant();var e=this._filter(this.items);this.filteredItems=e.matches,this._bindArrangeComplete(),this._isInstant?this._noTransition(this._hideReveal,[e]):this._hideReveal(e),this._sort(),this._layout()},c._init=c.arrange,c._hideReveal=function(t){this.reveal(t.needReveal),this.hide(t.needHide)},c._getIsInstant=function(){var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;return this._isInstant=e,e},c._bindArrangeComplete=function(){function t(){e&&i&&n&&s.dispatchEvent("arrangeComplete",null,[s.filteredItems])}var e,i,n,s=this;this.once("layoutComplete",function(){e=!0,t()}),this.once("hideComplete",function(){i=!0,t()}),this.once("revealComplete",function(){n=!0,t()})},c._filter=function(t){var e=this.options.filter;e=e||"*";for(var i=[],n=[],s=[],o=this._getFilterTest(e),r=0;r<t.length;r++){var a=t[r];if(!a.isIgnored){var h=o(a);h&&i.push(a),h&&a.isHidden?n.push(a):h||a.isHidden||s.push(a)}}return{matches:i,needReveal:n,needHide:s}},c._getFilterTest=function(t){return a&&this.options.isjQuery_T4NTFiltering?function(e){return a(e.element).is(t)}:"function"==typeof t?function(e){return t(e.element)}:function(e){return n(e.element,t)}},c.updateSortData=function(t){var e;t?(t=s.makeArray(t),e=this.getItems(t)):e=this.items,this._getSorters(),this._updateItemsSortData(e)},c._getSorters=function(){var t=this.options.getSortData;for(var e in t){var i=t[e];this._sorters[e]=u(i)}},c._updateItemsSortData=function(t){for(var e=t&&t.length,i=0;e&&i<e;i++){t[i].updateSortData()}};var u=function(){return function(t){if("string"!=typeof t)return t;var e=h(t).split(" "),i=e[0],n=i.match(/^\[(.+)\]$/),s=function(t,e){return t?function(e){return e.getAttribute(t)}:function(t){var i=t.querySelector(e);return i&&i.textContent}}(n&&n[1],i),o=l.sortDataParsers[e[1]];return o?function(t){return t&&o(s(t))}:function(t){return t&&s(t)}}}();l.sortDataParsers={parseInt:function(t){return parseInt(t,10)},parseFloat:function(t){return parseFloat(t)}},c._sort=function(){if(this.options.sortBy){var t=s.makeArray(this.options.sortBy);this._getIsSameSortBy(t)||(this.sortHistory=t.concat(this.sortHistory));var e=function(t,e){return function(i,n){for(var s=0;s<t.length;s++){var o=t[s],r=i.sortData[o],a=n.sortData[o];if(r>a||r<a)return(r>a?1:-1)*((void 0!==e[o]?e[o]:e)?1:-1)}return 0}}(this.sortHistory,this.options.sortAscending);this.filteredItems.sort(e)}},c._getIsSameSortBy=function(t){for(var e=0;e<t.length;e++)if(t[e]!=this.sortHistory[e])return!1;return!0},c._mode=function(){var t=this.options.layoutMode,e=this.modes[t];if(!e)throw new Error("No layout mode: "+t);return e.options=this.options[t],e},c._resetLayout=function(){e.prototype._resetLayout.call(this),this._mode()._resetLayout()},c._getItemLayoutPosition=function(t){return this._mode()._getItemLayoutPosition(t)},c._manageStamp=function(t){this._mode()._manageStamp(t)},c._getContainerSize=function(){return this._mode()._getContainerSize()},c.needsResizeLayout=function(){return this._mode().needsResizeLayout()},c.appended=function(t){var e=this.addItems(t);if(e.length){var i=this._filterRevealAdded(e);this.filteredItems=this.filteredItems.concat(i)}},c.prepended=function(t){var e=this._itemize(t);if(e.length){this._resetLayout(),this._manageStamps();var i=this._filterRevealAdded(e);this.layoutItems(this.filteredItems),this.filteredItems=i.concat(this.filteredItems),this.items=e.concat(this.items)}},c._filterRevealAdded=function(t){var e=this._filter(t);return this.hide(e.needHide),this.reveal(e.matches),this.layoutItems(e.matches,!0),e.matches},c.insert=function(t){var e=this.addItems(t);if(e.length){var i,n,s=e.length;for(i=0;i<s;i++)n=e[i],this.element.appendChild(n.element);var o=this._filter(e).matches;for(i=0;i<s;i++)e[i].isLayoutInstant=!0;for(this.arrange(),i=0;i<s;i++)delete e[i].isLayoutInstant;this.reveal(o)}};var d=c.remove;return c.remove=function(t){t=s.makeArray(t);var e=this.getItems(t);d.call(this,t);for(var i=e&&e.length,n=0;i&&n<i;n++){var o=e[n];s.removeFrom(this.filteredItems,o)}},c.shuffle=function(){for(var t=0;t<this.items.length;t++){this.items[t].sortData.random=Math.random()}this.options.sortBy="random",this._sort(),this._layout()},c._noTransition=function(t,e){var i=this.options.transitionDuration;this.options.transitionDuration=0;var n=t.apply(this,e);return this.options.transitionDuration=i,n},c.getFilteredItemElements=function(){return this.filteredItems.map(function(t){return t.element})},l}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/rect",e):"object"==typeof module&&module.exports?module.exports=e():(t.Packery=t.Packery||{},t.Packery.Rect=e())}(window,function(){function t(e){for(var i in t.defaults)this[i]=t.defaults[i];for(i in e)this[i]=e[i]}t.defaults={x:0,y:0,width:0,height:0};var e=t.prototype;return e.contains=function(t){var e=t.width||0,i=t.height||0;return this.x<=t.x&&this.y<=t.y&&this.x+this.width>=t.x+e&&this.y+this.height>=t.y+i},e.overlaps=function(t){var e=this.x+this.width,i=this.y+this.height,n=t.x+t.width,s=t.y+t.height;return this.x<n&&e>t.x&&this.y<s&&i>t.y},e.getMaximalFreeRects=function(e){if(!this.overlaps(e))return!1;var i,n=[],s=this.x+this.width,o=this.y+this.height,r=e.x+e.width,a=e.y+e.height;return this.y<e.y&&(i=new t({x:this.x,y:this.y,width:this.width,height:e.y-this.y}),n.push(i)),s>r&&(i=new t({x:r,y:this.y,width:s-r,height:this.height}),n.push(i)),o>a&&(i=new t({x:this.x,y:a,width:this.width,height:o-a}),n.push(i)),this.x<e.x&&(i=new t({x:this.x,y:this.y,width:e.x-this.x,height:this.height}),n.push(i)),n},e.canFit=function(t){return this.width>=t.width&&this.height>=t.height},t}),function(t,e){if("function"==typeof define&&define.amd)define("packery/js/packer",["./rect"],e);else if("object"==typeof module&&module.exports)module.exports=e(require("./rect"));else{var i=t.Packery=t.Packery||{};i.Packer=e(i.Rect)}}(window,function(t){function e(t,e,i){this.width=t||0,this.height=e||0,this.sortDirection=i||"downwardLeftToRight",this.reset()}var i=e.prototype;i.reset=function(){this.spaces=[];var e=new t({x:0,y:0,width:this.width,height:this.height});this.spaces.push(e),this.sorter=n[this.sortDirection]||n.downwardLeftToRight},i.pack=function(t){for(var e=0;e<this.spaces.length;e++){var i=this.spaces[e];if(i.canFit(t)){this.placeInSpace(t,i);break}}},i.columnPack=function(t){for(var e=0;e<this.spaces.length;e++){var i=this.spaces[e];if(i.x<=t.x&&i.x+i.width>=t.x+t.width&&i.height>=t.height-.01){t.y=i.y,this.placed(t);break}}},i.rowPack=function(t){for(var e=0;e<this.spaces.length;e++){var i=this.spaces[e];if(i.y<=t.y&&i.y+i.height>=t.y+t.height&&i.width>=t.width-.01){t.x=i.x,this.placed(t);break}}},i.placeInSpace=function(t,e){t.x=e.x,t.y=e.y,this.placed(t)},i.placed=function(t){for(var e=[],i=0;i<this.spaces.length;i++){var n=this.spaces[i],s=n.getMaximalFreeRects(t);s?e.push.apply(e,s):e.push(n)}this.spaces=e,this.mergeSortSpaces()},i.mergeSortSpaces=function(){e.mergeRects(this.spaces),this.spaces.sort(this.sorter)},i.addSpace=function(t){this.spaces.push(t),this.mergeSortSpaces()},e.mergeRects=function(t){var e=0,i=t[e];t:for(;i;){for(var n=0,s=t[e+n];s;){if(s==i)n++;else{if(s.contains(i)){t.splice(e,1),i=t[e];continue t}i.contains(s)?t.splice(e+n,1):n++}s=t[e+n]}i=t[++e]}return t};var n={downwardLeftToRight:function(t,e){return t.y-e.y||t.x-e.x},rightwardTopToBottom:function(t,e){return t.x-e.x||t.y-e.y}};return e}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/item",["outlayer/outlayer","./rect"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("./rect")):t.Packery.Item=e(t.Outlayer,t.Packery.Rect)}(window,function(t,e){var i="string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform",n=function(){t.Item.apply(this,arguments)},s=n.prototype=Object.create(t.Item.prototype),o=s._create;s._create=function(){o.call(this),this.rect=new e};var r=s.moveTo;return s.moveTo=function(t,e){var i=Math.abs(this.position.x-t),n=Math.abs(this.position.y-e);return this.layout.dragItemCount&&!this.isPlacing&&!this.isTransitioning&&1>i&&1>n?void this.goTo(t,e):void r.apply(this,arguments)},s.enablePlacing=function(){this.removeTransitionStyles(),this.isTransitioning&&i&&(this.element.style[i]="none"),this.isTransitioning=!1,this.getSize(),this.layout._setRectSize(this.element,this.rect),this.isPlacing=!0},s.disablePlacing=function(){this.isPlacing=!1},s.removeElem=function(){this.element.parentNode.removeChild(this.element),this.layout.packer.addSpace(this.rect),this.emitEvent("remove",[this])},s.showDropPlaceholder=function(){var t=this.dropPlaceholder;t||((t=this.dropPlaceholder=document.createElement("div")).className="packery-drop-placeholder",t.style.position="absolute"),t.style.width=this.size.width+"px",t.style.height=this.size.height+"px",this.positionDropPlaceholder(),this.layout.element.appendChild(t)},s.positionDropPlaceholder=function(){this.dropPlaceholder.style[i]="translate("+this.rect.x+"px, "+this.rect.y+"px)"},s.hideDropPlaceholder=function(){this.layout.element.removeChild(this.dropPlaceholder)},n}),function(t,e){"function"==typeof define&&define.amd?define("packery/js/packery",["get-size/get-size","outlayer/outlayer","./rect","./packer","./item"],e):"object"==typeof module&&module.exports?module.exports=e(require("get-size"),require("outlayer"),require("./rect"),require("./packer"),require("./item")):t.Packery=e(t.getSize,t.Outlayer,t.Packery.Rect,t.Packery.Packer,t.Packery.Item)}(window,function(t,e,i,n,s){function o(t,e){return t.position.y-e.position.y||t.position.x-e.position.x}function r(t,e){return t.position.x-e.position.x||t.position.y-e.position.y}i.prototype.canFit=function(t){return this.width>=t.width-1&&this.height>=t.height-1};var a=e.create("packery");a.Item=s;var h=a.prototype;h._create=function(){e.prototype._create.call(this),this.packer=new n,this.shiftPacker=new n,this.isEnabled=!0,this.dragItemCount=0;var t=this;this.handleDraggabilly={dragStart:function(){t.itemDragStart(this.element)},dragMove:function(){t.itemDragMove(this.element,this.position.x,this.position.y)},dragEnd:function(){t.itemDragEnd(this.element)}},this.handleUIDraggable={start:function(e,i){i&&t.itemDragStart(e.currentTarget)},drag:function(e,i){i&&t.itemDragMove(e.currentTarget,i.position.left,i.position.top)},stop:function(e,i){i&&t.itemDragEnd(e.currentTarget)}}},h._resetLayout=function(){var t,e,i;this.getSize(),this._getMeasurements(),this._getOption("horizontal")?(t=1/0,e=this.size.innerHeight+this.gutter,i="rightwardTopToBottom"):(t=this.size.innerWidth+this.gutter,e=1/0,i="downwardLeftToRight"),this.packer.width=this.shiftPacker.width=t,this.packer.height=this.shiftPacker.height=e,this.packer.sortDirection=this.shiftPacker.sortDirection=i,this.packer.reset(),this.maxY=0,this.maxX=0},h._getMeasurements=function(){this._getMeasurement("columnWidth","width"),this._getMeasurement("rowHeight","height"),this._getMeasurement("gutter","width")},h._getItemLayoutPosition=function(t){if(this._setRectSize(t.element,t.rect),this.isShifting||this.dragItemCount>0){var e=this._getPackMethod();this.packer[e](t.rect)}else this.packer.pack(t.rect);return this._setMaxXY(t.rect),t.rect},h.shiftLayout=function(){this.isShifting=!0,this.layout(),delete this.isShifting},h._getPackMethod=function(){return this._getOption("horizontal")?"rowPack":"columnPack"},h._setMaxXY=function(t){this.maxX=Math.max(t.x+t.width,this.maxX),this.maxY=Math.max(t.y+t.height,this.maxY)},h._setRectSize=function(e,i){var n=t(e),s=n.outerWidth,o=n.outerHeight;(s||o)&&(s=this._applyGridGutter(s,this.columnWidth),o=this._applyGridGutter(o,this.rowHeight)),i.width=Math.min(s,this.packer.width),i.height=Math.min(o,this.packer.height)},h._applyGridGutter=function(t,e){if(!e)return t+this.gutter;var i=t%(e+=this.gutter);return Math[i&&1>i?"round":"ceil"](t/e)*e},h._getContainerSize=function(){return this._getOption("horizontal")?{width:this.maxX-this.gutter}:{height:this.maxY-this.gutter}},h._manageStamp=function(t){var e,n=this.getItem(t);if(n&&n.isPlacing)e=n.rect;else{var s=this._getElementOffset(t);e=new i({x:this._getOption("originLeft")?s.left:s.right,y:this._getOption("originTop")?s.top:s.bottom})}this._setRectSize(t,e),this.packer.placed(e),this._setMaxXY(e)},h.sortItemsByPosition=function(){var t=this._getOption("horizontal")?r:o;this.items.sort(t)},h.fit=function(t,e,i){var n=this.getItem(t);n&&(this.stamp(n.element),n.enablePlacing(),this.updateShiftTargets(n),e=void 0===e?n.rect.x:e,i=void 0===i?n.rect.y:i,this.shift(n,e,i),this._bindFitEvents(n),n.moveTo(n.rect.x,n.rect.y),this.shiftLayout(),this.unstamp(n.element),this.sortItemsByPosition(),n.disablePlacing())},h._bindFitEvents=function(t){function e(){2==++n&&i.dispatchEvent("fitComplete",null,[t])}var i=this,n=0;t.once("layout",e),this.once("layoutComplete",e)},h.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&(this.options.shiftPercentResize?this.resizeShiftPercentLayout():this.layout())},h.needsResizeLayout=function(){var e=t(this.element),i=this._getOption("horizontal")?"innerHeight":"innerWidth";return e[i]!=this.size[i]},h.resizeShiftPercentLayout=function(){var e=this._getItemsForLayout(this.items),i=this._getOption("horizontal"),n=i?"y":"x",s=i?"height":"width",o=i?"rowHeight":"columnWidth",r=i?"innerHeight":"innerWidth",a=this[o];if(a=a&&a+this.gutter){this._getMeasurements();var h=this[o]+this.gutter;e.forEach(function(t){var e=Math.round(t.rect[n]/a);t.rect[n]=e*h})}else{var l=t(this.element)[r]+this.gutter,c=this.packer[s];e.forEach(function(t){t.rect[n]=t.rect[n]/c*l})}this.shiftLayout()},h.itemDragStart=function(t){if(this.isEnabled){this.stamp(t);var e=this.getItem(t);e&&(e.enablePlacing(),e.showDropPlaceholder(),this.dragItemCount++,this.updateShiftTargets(e))}},h.updateShiftTargets=function(t){this.shiftPacker.reset(),this._getBoundingRect();var e=this._getOption("originLeft"),n=this._getOption("originTop");this.stamps.forEach(function(t){var s=this.getItem(t);if(!s||!s.isPlacing){var o=this._getElementOffset(t),r=new i({x:e?o.left:o.right,y:n?o.top:o.bottom});this._setRectSize(t,r),this.shiftPacker.placed(r)}},this);var s=this._getOption("horizontal"),o=s?"rowHeight":"columnWidth",r=s?"height":"width";this.shiftTargetKeys=[],this.shiftTargets=[];var a,h=this[o];if(h=h&&h+this.gutter){var l=Math.ceil(t.rect[r]/h),c=Math.floor((this.shiftPacker[r]+this.gutter)/h);a=(c-l)*h;for(var u=0;c>u;u++)this._addShiftTarget(u*h,0,a)}else a=this.shiftPacker[r]+this.gutter-t.rect[r],this._addShiftTarget(0,0,a);var d=this._getItemsForLayout(this.items),f=this._getPackMethod();d.forEach(function(t){var e=t.rect;this._setRectSize(t.element,e),this.shiftPacker[f](e),this._addShiftTarget(e.x,e.y,a);var i=s?e.x+e.width:e.x,n=s?e.y:e.y+e.height;if(this._addShiftTarget(i,n,a),h)for(var o=Math.round(e[r]/h),l=1;o>l;l++){var c=s?i:e.x+h*l,u=s?e.y+h*l:n;this._addShiftTarget(c,u,a)}},this)},h._addShiftTarget=function(t,e,i){var n=this._getOption("horizontal")?e:t;if(!(0!==n&&n>i)){var s=t+","+e;-1!=this.shiftTargetKeys.indexOf(s)||(this.shiftTargetKeys.push(s),this.shiftTargets.push({x:t,y:e}))}},h.shift=function(t,e,i){var n,s=1/0,o={x:e,y:i};this.shiftTargets.forEach(function(t){var e=function(t,e){var i=e.x-t.x,n=e.y-t.y;return Math.sqrt(i*i+n*n)}(t,o);s>e&&(n=t,s=e)}),t.rect.x=n.x,t.rect.y=n.y};h.itemDragMove=function(t,e,i){function n(){o.shift(s,e,i),s.positionDropPlaceholder(),o.layout()}var s=this.isEnabled&&this.getItem(t);if(s){e-=this.size.paddingLeft,i-=this.size.paddingTop;var o=this,r=new Date;this._itemDragTime&&r-this._itemDragTime<120?(clearTimeout(this.dragTimeout),this.dragTimeout=setTimeout(n,120)):(n(),this._itemDragTime=r)}},h.itemDragEnd=function(t){function e(){2==++n&&(i.element.classList.remove("is-positioning-post-drag"),i.hideDropPlaceholder(),s.dispatchEvent("dragItemPositioned",null,[i]))}var i=this.isEnabled&&this.getItem(t);if(i){clearTimeout(this.dragTimeout),i.element.classList.add("is-positioning-post-drag");var n=0,s=this;i.once("layout",e),this.once("layoutComplete",e),i.moveTo(i.rect.x,i.rect.y),this.layout(),this.dragItemCount=Math.max(0,this.dragItemCount-1),this.sortItemsByPosition(),i.disablePlacing(),this.unstamp(i.element)}},h.bindDraggabillyEvents=function(t){this._bindDraggabillyEvents(t,"on")},h.unbindDraggabillyEvents=function(t){this._bindDraggabillyEvents(t,"off")},h._bindDraggabillyEvents=function(t,e){var i=this.handleDraggabilly;t[e]("dragStart",i.dragStart),t[e]("dragMove",i.dragMove),t[e]("dragEnd",i.dragEnd)},h.bindUIDraggableEvents=function(t){this._bindUIDraggableEvents(t,"on")},h.unbindUIDraggableEvents=function(t){this._bindUIDraggableEvents(t,"off")},h._bindUIDraggableEvents=function(t,e){var i=this.handleUIDraggable;t[e]("dragstart",i.start)[e]("drag",i.drag)[e]("dragstop",i.stop)};var l=h.destroy;return h.destroy=function(){l.apply(this,arguments),this.isEnabled=!1},a.Rect=i,a.Packer=n,a}),function(t,e){"function"==typeof define&&define.amd?define(["isotopet4s-layout/js/layout-mode","packery/js/packery"],e):"object"==typeof module&&module.exports?module.exports=e(require("isotopet4s-layout/js/layout-mode"),require("packery")):e(t.isotopet4s.LayoutMode,t.Packery)}(window,function(t,e){var i=t.create("packery"),n=i.prototype,s={_getElementOffset:!0,_getMeasurement:!0};for(var o in e.prototype)s[o]||(n[o]=e.prototype[o]);var r=n._resetLayout;n._resetLayout=function(){this.packer=this.packer||new e.Packer,this.shiftPacker=this.shiftPacker||new e.Packer,r.apply(this,arguments)};var a=n._getItemLayoutPosition;n._getItemLayoutPosition=function(t){return t.rect=t.rect||new e.Rect,a.call(this,t)};var h=n.needsResizeLayout;n.needsResizeLayout=function(){return this._getOption("horizontal")?this.needsVerticalResizeLayout():h.call(this)};var l=n._getOption;return n._getOption=function(t){return"horizontal"==t?void 0!==this.options.isHorizontal?this.options.isHorizontal:this.options.horizontal:l.apply(this.isotopet4s,arguments)},i}),function(t,e){"function"==typeof define&&define.amd?define("jQuery_T4NT-bridget/jQuery_T4NT-bridget",["jQuery_T4NT"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jQuery_T4NT")):t.jQuery_T4NTBridget=e(t,t.jQuery_T4NT)}(window,function(t,e){"use strict";var i=Array.prototype.slice,n=t.console,s=void 0===n?function(){}:function(t){n.error(t)};function o(n,o,a){(a=a||e||t.jQuery_T4NT)&&(o.prototype.option||(o.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[n]=function(t){var e;return"string"==typeof t?function(t,e,i){var o,r="$()."+n+'("'+e+'")';return t.each(function(t,h){var l=a.data(h,n);if(l){var c=l[e];if(c&&"_"!=e.charAt(0)){var u=c.apply(l,i);o=void 0===o?u:o}else s(r+" is not a valid method")}else s(n+" not initialized. Cannot call methods, i.e. "+r)}),void 0!==o?o:t}(this,t,i.call(arguments,1)):(e=t,this.each(function(t,i){var s=a.data(i,n);s?(s.option(e),s._init()):(s=new o(i,e),a.data(i,n,s))}),this)},r(a))}function r(t){!t||t&&t.bridget||(t.bridget=o)}return r(e||t.jQuery_T4NT),o}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{};return(i[t]=i[t]||{})[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],s=0;s<i.length;s++){var o=i[s];n&&n[o]&&(this.off(t,o),delete n[o]),o.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t);return-1==t.indexOf("%")&&!isNaN(e)&&e}var e="undefined"==typeof console?function(){}:function(t){console.error(t)},i=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],n=i.length;function s(t){var i=getComputedStyle(t);return i||e("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),i}var o,r=!1;return function e(a){if(function(){if(!r){r=!0;var i=document.createElement("div");i.style.width="200px",i.style.padding="1px 2px 3px 4px",i.style.borderStyle="solid",i.style.borderWidth="1px 2px 3px 4px",i.style.boxSizing="border-box";var n=document.body||document.documentElement;n.appendChild(i);var a=s(i);o=200==Math.round(t(a.width)),e.isBoxSizeOuter=o,n.removeChild(i)}}(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var h=s(a);if("none"==h.display)return function(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<n;e++)t[i[e]]=0;return t}();var l={};l.width=a.offsetWidth,l.height=a.offsetHeight;for(var c=l.isBorderBox="border-box"==h.boxSizing,u=0;u<n;u++){var d=i[u],f=h[d],p=parseFloat(f);l[d]=isNaN(p)?0:p}var m=l.paddingLeft+l.paddingRight,g=l.paddingTop+l.paddingBottom,y=l.marginLeft+l.marginRight,v=l.marginTop+l.marginBottom,_=l.borderLeftWidth+l.borderRightWidth,x=l.borderTopWidth+l.borderBottomWidth,b=c&&o,S=t(h.width);!1!==S&&(l.width=S+(b?0:m+_));var E=t(h.height);return!1!==E&&(l.height=E+(b?0:g+x)),l.innerWidth=l.width-(m+_),l.innerHeight=l.height-(g+x),l.outerWidth=l.width+y,l.outerHeight=l.height+v,l}}}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i]+"MatchesSelector";if(t[n])return n}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={extend:function(t,e){for(var i in e)t[i]=e[i];return t},modulo:function(t,e){return(t%e+e)%e}},n=Array.prototype.slice;i.makeArray=function(t){return Array.isArray(t)?t:null==t?[]:"object"==typeof t&&"number"==typeof t.length?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var s=[];return t.forEach(function(t){if(t instanceof HTMLElement)if(n){e(t,n)&&s.push(t);for(var i=t.querySelectorAll(n),o=0;o<i.length;o++)s.push(i[o])}else s.push(t)}),s},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],s=e+"Timeout";t.prototype[e]=function(){var t=this[s];clearTimeout(t);var e=arguments,o=this;this[s]=setTimeout(function(){n.apply(o,e),delete o[s]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var s=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var o=i.toDashed(n),r="data-"+o,a=document.querySelectorAll("["+r+"]"),h=document.querySelectorAll(".js-"+o),l=i.makeArray(a).concat(i.makeArray(h)),c=r+"-options",u=t.jQuery_T4NT;l.forEach(function(t){var i,o=t.getAttribute(r)||t.getAttribute(c);try{i=o&&JSON.parse(o)}catch(e){return void(s&&s.error("Error parsing "+r+" on "+t.className+": "+e))}var a=new e(t,i);u&&u.data(t,n,a)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/cell",["get-size/get-size"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("get-size")):(t.Flickityt4s=t.Flickityt4s||{},t.Flickityt4s.Cell=e(t,t.getSize))}(window,function(t,e){function i(t,e){this.element=t,this.parent=e,this.create()}var n=i.prototype;return n.create=function(){this.element.style.position="absolute",this.element.setAttribute("aria-hidden","true"),this.x=0,this.shift=0,this.element.style[this.parent.originSide]=0},n.destroy=function(){this.unselect(),this.element.style.position="";var t=this.parent.originSide;this.element.style[t]="",this.element.style.transform="",this.element.removeAttribute("aria-hidden")},n.getSize=function(){this.size=e(this.element)},n.setPosition=function(t){this.x=t,this.updateTarget(),this.renderPosition(t)},n.updateTarget=n.setDefaultTarget=function(){var t="left"==this.parent.originSide?"marginLeft":"marginRight";this.target=this.x+this.size[t]+this.size.width*this.parent.cellAlign},n.renderPosition=function(t){var e="left"===this.parent.originSide?1:-1,i=this.parent.options.percentPosition?t*e*(this.parent.size.innerWidth/this.size.width):t*e;this.element.style.transform="translateX("+this.parent.getPositionValue(i)+")"},n.select=function(){this.element.classList.add("is-selected"),this.element.removeAttribute("aria-hidden")},n.unselect=function(){this.element.classList.remove("is-selected"),this.element.setAttribute("aria-hidden","true")},n.wrapShift=function(t){this.shift=t,this.renderPosition(this.x+this.parent.slideableWidth*t)},n.remove=function(){this.element.parentNode.removeChild(this.element)},i}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/slide",e):"object"==typeof module&&module.exports?module.exports=e():(t.Flickityt4s=t.Flickityt4s||{},t.Flickityt4s.Slide=e())}(window,function(){"use strict";function t(t){this.parent=t,this.isOriginLeft="left"==t.originSide,this.cells=[],this.outerWidth=0,this.height=0}var e=t.prototype;return e.addCell=function(t){if(this.cells.push(t),this.outerWidth+=t.size.outerWidth,this.height=Math.max(t.size.outerHeight,this.height),1==this.cells.length){this.x=t.x;var e=this.isOriginLeft?"marginLeft":"marginRight";this.firstMargin=t.size[e]}},e.updateTarget=function(){var t=this.isOriginLeft?"marginRight":"marginLeft",e=this.getLastCell(),i=e?e.size[t]:0,n=this.outerWidth-(this.firstMargin+i);this.target=this.x+this.firstMargin+n*this.parent.cellAlign},e.getLastCell=function(){return this.cells[this.cells.length-1]},e.select=function(){this.cells.forEach(function(t){t.select()})},e.unselect=function(){this.cells.forEach(function(t){t.unselect()})},e.getCellElements=function(){return this.cells.map(function(t){return t.element})},t}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/animate",["fizzy-ui-utils/utils"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("fizzy-ui-utils")):(t.Flickityt4s=t.Flickityt4s||{},t.Flickityt4s.animatePrototype=e(t,t.fizzyUIUtils))}(window,function(t,e){return{startAnimation:function(){this.isAnimating||(this.isAnimating=!0,this.restingFrames=0,this.animate())},animate:function(){this.applyDragForce(),this.applySelectedAttraction();var t=this.x;if(this.integratePhysics(),this.positionSlider(),this.settle(t),this.isAnimating){var e=this;requestAnimationFrame(function(){e.animate()})}},positionSlider:function(){var t=this.x;this.options.wrapAround&&this.cells.length>1&&(t=e.modulo(t,this.slideableWidth),t-=this.slideableWidth,this.shiftWrapCells(t)),this.setTranslateX(t,this.isAnimating),this.dispatchScrollEvent()},setTranslateX:function(t,e){t+=this.cursorPosition,t=this.options.rightToLeft?-t:t;var i=this.getPositionValue(t);this.slider.style.transform=e?"translate3d("+i+",0,0)":"translateX("+i+")"},dispatchScrollEvent:function(){var t=this.slides[0];if(t){var e=-this.x-t.target,i=e/this.slidesWidth;this.dispatchEvent("scroll",null,[i,e])}},positionSliderAtSelected:function(){this.cells.length&&(this.x=-this.selectedSlide.target,this.velocity=0,this.positionSlider())},getPositionValue:function(t){return this.options.percentPosition?.01*Math.round(t/this.size.innerWidth*1e4)+"%":Math.round(t)+"px"},settle:function(t){!this.isPointerDown&&Math.round(100*this.x)==Math.round(100*t)&&this.restingFrames++,this.restingFrames>2&&(this.isAnimating=!1,delete this.isFreeScrolling,this.positionSlider(),this.dispatchEvent("settle",null,[this.selectedIndex]))},shiftWrapCells:function(t){var e=this.cursorPosition+t;this._shiftCells(this.beforeShiftCells,e,-1);var i=this.size.innerWidth-(t+this.slideableWidth+this.cursorPosition);this._shiftCells(this.afterShiftCells,i,1)},_shiftCells:function(t,e,i){for(var n=0;n<t.length;n++){var s=t[n],o=e>0?i:0;s.wrapShift(o),e-=s.size.outerWidth}this._checkVisibility()},_unshiftCells:function(t){if(t&&t.length)for(var e=0;e<t.length;e++)t[e].wrapShift(0)},integratePhysics:function(){this.x+=this.velocity,this.velocity*=this.getFrictionFactor()},applyForce:function(t){this.velocity+=t},getFrictionFactor:function(){return 1-this.options[this.isFreeScrolling?"freeScrollFriction":"friction"]},getRestingPosition:function(){return this.x+this.velocity/(1-this.getFrictionFactor())},applyDragForce:function(){if(this.isDraggable&&this.isPointerDown){var t=this.dragX-this.x-this.velocity;this.applyForce(t)}},applySelectedAttraction:function(){if((!this.isDraggable||!this.isPointerDown)&&!this.isFreeScrolling&&this.slides.length){var t=(-1*this.selectedSlide.target-this.x)*this.options.selectedAttraction;this.applyForce(t)}}}}),function(t,e){if("function"==typeof define&&define.amd)define("flickityt4s/js/flickityt4s",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./cell","./slide","./animate"],function(i,n,s,o,r,a){return e(t,i,n,s,o,r,a)});else if("object"==typeof module&&module.exports)module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./cell"),require("./slide"),require("./animate"));else{var i=t.Flickityt4s;t.Flickityt4s=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,i.Cell,i.Slide,i.animatePrototype)}}(window,function(t,e,i,n,s,o,r){var a=t.jQuery_T4NT,h=t.getComputedStyle,l=t.console;function c(t,e){for(t=n.makeArray(t);t.length;)e.appendChild(t.shift())}var u=0,d={};function f(t,e){var i=n.getQueryElement(t);if(i){if(this.element=i,this.element.flickityt4sGUID){var s=d[this.element.flickityt4sGUID];return s&&s.option(e),s}switch(a&&(this.$element=a(this.element)),this.options=n.extend({},this.constructor.defaults),e.originwrapAround=e.wrapAround,e.rightToLeft="rtl"==document.documentElement.getAttribute("dir"),e.arrowIcon){case"1":e.arrowShape="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z";break;case"2":e.arrowShape="M 10,50 L 60,100 L 65,95 L 20,50  L 65,5 L 60,0 Z";break;case"3":e.arrowShape="M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z"}this.option(e),this._create()}else l&&l.error("Bad element for Flickityt4s: "+(i||t))}f.defaults={accessibility:!0,cellAlign:"center",freeScrollFriction:.075,friction:.28,namespacejQuery_T4NTEvents:!0,percentPosition:!0,resize:!0,selectedAttraction:.025,setGallerySize:!0,setPrevNextButtons:!1,checkVisibility:!1,sync:!1},f.createMethods=[];var p=f.prototype;n.extend(p,e.prototype),p._create=function(){var e=this.guid=++u;for(var i in this.element.flickityt4sGUID=e,d[e]=this,this.selectedIndex=0,this.restingFrames=0,this.x=0,this.velocity=0,this.originSide=this.options.rightToLeft?"right":"left",this.viewport=document.createElement("div"),this.viewport.className="flickityt4s-viewport",this._createSlider(),(this.options.resize||this.options.watchCSS)&&t.addEventListener("resize",this),this.options.on){var n=this.options.on[i];this.on(i,n)}f.createMethods.forEach(function(t){this[t]()},this),this.options.watchCSS?this.watchCSS():this.activate()},p.option=function(t){n.extend(this.options,t)},p.activate=function(){this.isActive||(this.isActive=!0,this.element.classList.add("flickityt4s-enabled"),this.options.rightToLeft&&this.element.classList.add("flickityt4s-rtl"),this.getSize(),c(this._filterFindCellElements(this.element.children),this.slider),this.viewport.appendChild(this.slider),this.element.appendChild(this.viewport),this.reloadCells(),this.options.accessibility&&(this.element.tabIndex=0,this.element.addEventListener("keydown",this)),this.emitEvent("activate"),this.selectInitialIndex(),this.isInitActivated=!0,this.dispatchEvent("ready"))},p._createSlider=function(){var t=document.createElement("div");t.className="flickityt4s-slider",t.style[this.originSide]=0,this.slider=t},p._filterFindCellElements=function(t){return n.filterFindElements(t,this.options.cellSelector)},p.reloadCells=function(){this.cells=this._makeCells(this.slider.children),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize(),this.setPrevNextButtons()},p._makeCells=function(t){return this._filterFindCellElements(t).map(function(t){return new s(t,this)},this)},p.getLastCell=function(){return this.cells[this.cells.length-1]},p.getLastSlide=function(){return this.slides[this.slides.length-1]},p.positionCells=function(){this._sizeCells(this.cells),this._positionCells(0)},p._positionCells=function(t){t=t||0,this.maxCellHeight=t&&this.maxCellHeight||0;var e=0;if(t>0){var i=this.cells[t-1];e=i.x+i.size.outerWidth}for(var n=this.cells.length,s=t;s<n;s++){var o=this.cells[s];o.setPosition(e),e+=o.size.outerWidth,this.maxCellHeight=Math.max(o.size.outerHeight,this.maxCellHeight)}this.slideableWidth=e,this.updateSlides(),this._containSlides(),this.slidesWidth=n?this.getLastSlide().target-this.slides[0].target:0,this.maxVisibilityHeight=0},p._sizeCells=function(t){t.forEach(function(t){t.getSize()})},p.updateSlides=function(){if(this.slides=[],this.cells.length){var t=new o(this);this.slides.push(t);var e="left"==this.originSide?"marginRight":"marginLeft",i=this._getCanCellFit();this.cells.forEach(function(n,s){if(t.cells.length){var r=t.outerWidth-t.firstMargin+(n.size.outerWidth-n.size[e]);i.call(this,s,r)?t.addCell(n):(t.updateTarget(),t=new o(this),this.slides.push(t),t.addCell(n))}else t.addCell(n)},this),t.updateTarget(),this.updateSelectedSlide()}},p._getCanCellFit=function(){var t=this.options.groupCells;if(!t)return function(){return!1};if("number"==typeof t){var e=parseInt(t,10);return function(t){return t%e!=0}}var i="string"==typeof t&&t.match(/^(\d+)%$/),n=i?parseInt(i[1],10)/100:1;return function(t,e){return e<=(this.size.innerWidth+1)*n}},p._init=p.reposition=function(){this.positionCells(),this.positionSliderAtSelected()},p.getSize=function(){this.size=i(this.element),this.setCellAlign(),this.cursorPosition=this.size.innerWidth*this.cellAlign};var m={center:{left:.5,right:.5},left:{left:0,right:1},right:{right:0,left:1}};return p.setCellAlign=function(){var t=m[this.options.cellAlign];this.cellAlign=t?t[this.originSide]:this.options.cellAlign},p.setGallerySize=function(){if(this.options.setGallerySize){var t=this.options.adaptiveHeight&&this.selectedSlide?this.selectedSlide.height:this.maxCellHeight;t=this.maxVisibilityHeight&&this.maxVisibilityHeight>t?this.maxVisibilityHeight:t,this.viewport.style.height=t+"px"}},p.setPrevNextButtons=function(){if(this.options.setPrevNextButtons){var t=this.viewport.querySelector(".is-selected [data-cacl-slide]");if(null!==t){var e=t.offsetHeight/2;this.element.style.setProperty("--prev-next-top",e+"px")}}},p._checkVisibility=function(){if(this.options.checkVisibility&&this.options.adaptiveHeight)for(var t=this.viewport.getBoundingClientRect().x,e=this.viewport.offsetWidth,i=this.cells.length,n=0;n<i;n++){var s=this.cells[n],o=s.element.getBoundingClientRect().x-t;o+s.size.innerWidth>t&&o+s.size.innerWidth<e||o>t&&o<e?(this.maxVisibilityHeight=Math.max(s.size.outerHeight,this.maxVisibilityHeight),s.element.classList.add("is-t4s-visible"),s.element.removeAttribute("aria-hidden")):(s.element.classList.remove("is-t4s-visible"),s.element.setAttribute("aria-hidden",!0))}},p._getWrapShiftCells=function(){if(this.options.originwrapAround)if(this.slides.length<2)this.options.wrapAround=!1;else{this.options.wrapAround=!0,this._unshiftCells(this.beforeShiftCells),this._unshiftCells(this.afterShiftCells);var t=this.cursorPosition,e=this.cells.length-1;this.beforeShiftCells=this._getGapCells(t,e,-1),t=this.size.innerWidth-this.cursorPosition,this.afterShiftCells=this._getGapCells(t,0,1)}},p._getGapCells=function(t,e,i){for(var n=[];t>0;){var s=this.cells[e];if(!s)break;n.push(s),e+=i,t-=s.size.outerWidth}return n},p._containSlides=function(){if(this.options.contain&&!this.options.wrapAround&&this.cells.length){var t=this.options.rightToLeft,e=t?"marginRight":"marginLeft",i=t?"marginLeft":"marginRight",n=this.slideableWidth-this.getLastCell().size[i],s=n<this.size.innerWidth,o=this.cursorPosition+this.cells[0].size[e],r=n-this.size.innerWidth*(1-this.cellAlign);this.slides.forEach(function(t){s?t.target=n*this.cellAlign:(t.target=Math.max(t.target,o),t.target=Math.min(t.target,r))},this)}},p.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),a&&this.$element){var s=t+=this.options.namespacejQuery_T4NTEvents?".flickityt4s":"";if(e){var o=new a.Event(e);o.type=t,s=o}this.$element.trigger(s,i)}},p.select=function(t,e,i){if(this.isActive&&(t=parseInt(t,10),this._wrapSelect(t),(this.options.wrapAround||e)&&(t=n.modulo(t,this.slides.length)),this.slides[t])){var s=this.selectedIndex;this.selectedIndex=t,this.updateSelectedSlide(),i?this.positionSliderAtSelected():this.startAnimation(),this.options.adaptiveHeight&&this.setGallerySize(),this.setPrevNextButtons(),this.dispatchEvent("select",null,[t]),t!=s&&this.dispatchEvent("change",null,[t]),this.dispatchEvent("cellSelect")}},p._wrapSelect=function(t){var e=this.slides.length;if(!(this.options.wrapAround&&e>1))return t;var i=n.modulo(t,e),s=Math.abs(i-this.selectedIndex),o=Math.abs(i+e-this.selectedIndex),r=Math.abs(i-e-this.selectedIndex);!this.isDragSelect&&o<s?t+=e:!this.isDragSelect&&r<s&&(t-=e),t<0?this.x-=this.slideableWidth:t>=e&&(this.x+=this.slideableWidth)},p.previous=function(t,e){this.select(this.selectedIndex-1,t,e)},p.next=function(t,e){this.select(this.selectedIndex+1,t,e)},p.updateSelectedSlide=function(){var t=this.slides[this.selectedIndex];t&&(this.unselectSelectedSlide(),this.selectedSlide=t,t.select(),this.selectedCells=t.cells,this.selectedElements=t.getCellElements(),this.selectedCell=t.cells[0],this.selectedElement=this.selectedElements[0])},p.unselectSelectedSlide=function(){this.selectedSlide&&this.selectedSlide.unselect()},p.selectInitialIndex=function(){var t=this.options.initialIndex;if(this.isInitActivated)this.select(this.selectedIndex,!1,!0);else{if(t&&"string"==typeof t&&this.queryCell(t))return void this.selectCell(t,!1,!0);var e=0;t&&this.slides[t]&&(e=t),this.select(e,!1,!0)}},p.selectCell=function(t,e,i){var n=this.queryCell(t);if(n){var s=this.getCellSlideIndex(n);this.select(s,e,i)}},p.getCellSlideIndex=function(t){for(var e=0;e<this.slides.length;e++)if(-1!=this.slides[e].cells.indexOf(t))return e},p.getCell=function(t){for(var e=0;e<this.cells.length;e++){var i=this.cells[e];if(i.element==t)return i}},p.getCells=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getCell(t);i&&e.push(i)},this),e},p.getCellElements=function(){return this.cells.map(function(t){return t.element})},p.getParentCell=function(t){return this.getCell(t)||(t=n.getParent(t,".flickityt4s-slider > *"),this.getCell(t))},p.getAdjacentCellElements=function(t,e){if(!t)return this.selectedSlide.getCellElements();e=void 0===e?this.selectedIndex:e;var i=this.slides.length;if(1+2*t>=i)return this.getCellElements();for(var s=[],o=e-t;o<=e+t;o++){var r=this.options.wrapAround?n.modulo(o,i):o,a=this.slides[r];a&&(s=s.concat(a.getCellElements()))}return s},p.queryCell=function(t){if("number"==typeof t)return this.cells[t];if("string"==typeof t){if(t.match(/^[#.]?[\d/]/))return;t=this.element.querySelector(t)}return this.getCell(t)},p.uiChange=function(){this.emitEvent("uiChange")},p.childUIPointerDown=function(t){"touchstart"!=t.type&&t.preventDefault(),this.focus()},p.onresize=function(){this.watchCSS(),this.resize()},n.debounceMethod(f,"onresize",150),p.resize=function(){if(this.isActive&&!this.isAnimating&&!this.isDragging){this.getSize(),this.options.wrapAround&&(this.x=n.modulo(this.x,this.slideableWidth)),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize(),this.setPrevNextButtons(),this.emitEvent("resize");var t=this.selectedElements&&this.selectedElements[0];this.selectCell(t,!1,!0)}},p.watchCSS=function(){this.options.watchCSS&&(-1!=h(this.element,":after").content.indexOf("flickityt4s")?this.activate():this.deactivate())},p.onkeydown=function(t){var e=document.activeElement&&document.activeElement!=this.element;if(this.options.accessibility&&!e){var i=f.keyboardHandlers[t.keyCode];i&&i.call(this)}},f.keyboardHandlers={37:function(){var t=this.options.rightToLeft?"next":"previous";this.uiChange(),this[t]()},39:function(){var t=this.options.rightToLeft?"previous":"next";this.uiChange(),this[t]()}},p.focus=function(){var e=t.pageYOffset;this.element.focus({preventScroll:!0}),t.pageYOffset!=e&&t.scrollTo(t.pageXOffset,e)},p.deactivate=function(){this.isActive&&(this.element.classList.remove("flickityt4s-enabled"),this.element.classList.remove("flickityt4s-rtl"),this.unselectSelectedSlide(),this.cells.forEach(function(t){t.destroy()}),this.element.removeChild(this.viewport),c(this.slider.children,this.element),this.options.accessibility&&(this.element.removeAttribute("tabIndex"),this.element.removeEventListener("keydown",this)),this.isActive=!1,this.emitEvent("deactivate"))},p.destroy=function(){this.deactivate(),t.removeEventListener("resize",this),this.allOff(),this.emitEvent("destroy"),a&&this.$element&&a.removeData(this.element,"flickityt4s"),delete this.element.flickityt4sGUID,delete d[this.guid]},n.extend(p,r),f.data=function(t){var e=(t=n.getQueryElement(t))&&t.flickityt4sGUID;return e&&d[e]},n.htmlInit(f,"flickityt4s"),a&&a.bridget&&a.bridget("flickityt4s",f),f.setjQuery_T4NT=function(t){a=t},f.Cell=s,f.Slide=o,f}),function(t,e){"function"==typeof define&&define.amd?define("unipointer/unipointer",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.Unipointer=e(t,t.EvEmitter)}(window,function(t,e){function i(){}var n=i.prototype=Object.create(e.prototype);n.bindStartEvent=function(t){this._bindStartEvent(t,!0)},n.unbindStartEvent=function(t){this._bindStartEvent(t,!1)},n._bindStartEvent=function(e,i){var n=(i=void 0===i||i)?"addEventListener":"removeEventListener",s="mousedown";"ontouchstart"in t?s="touchstart":t.PointerEvent&&(s="pointerdown"),e[n](s,this)},n.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},n.getTouch=function(t){for(var e=0;e<t.length;e++){var i=t[e];if(i.identifier==this.pointerIdentifier)return i}},n.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t)},n.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0])},n.onpointerdown=function(t){this._pointerDown(t,t)},n._pointerDown=function(t,e){t.button||this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e))},n.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])};var s={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"]};return n._bindPostStartEvents=function(e){if(e){var i=s[e.type];i.forEach(function(e){t.addEventListener(e,this)},this),this._boundPointerEvents=i}},n._unbindPostStartEvents=function(){this._boundPointerEvents&&(this._boundPointerEvents.forEach(function(e){t.removeEventListener(e,this)},this),delete this._boundPointerEvents)},n.onmousemove=function(t){this._pointerMove(t,t)},n.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t)},n.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e)},n._pointerMove=function(t,e){this.pointerMove(t,e)},n.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e])},n.onmouseup=function(t){this._pointerUp(t,t)},n.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t)},n.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e)},n._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e)},n.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e])},n._pointerDone=function(){this._pointerReset(),this._unbindPostStartEvents(),this.pointerDone()},n._pointerReset=function(){this.isPointerDown=!1,delete this.pointerIdentifier},n.pointerDone=function(){},n.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t)},n.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e)},n._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e)},n.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e])},i.getPointerPoint=function(t){return{x:t.pageX,y:t.pageY}},i}),function(t,e){"function"==typeof define&&define.amd?define("unidragger/unidragger",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("unipointer")):t.Unidragger=e(t,t.Unipointer)}(window,function(t,e){function i(){}var n=i.prototype=Object.create(e.prototype);n.bindHandles=function(){this._bindHandles(!0)},n.unbindHandles=function(){this._bindHandles(!1)},n._bindHandles=function(e){for(var i=(e=void 0===e||e)?"addEventListener":"removeEventListener",n=e?this._touchActionValue:"",s=0;s<this.handles.length;s++){var o=this.handles[s];this._bindStartEvent(o,e),o[i]("click",this),t.PointerEvent&&(o.style.touchAction=n)}},n._touchActionValue="none",n.pointerDown=function(t,e){this.okayPointerDown(t)&&(this.pointerDownPointer={pageX:e.pageX,pageY:e.pageY},t.preventDefault(),this.pointerDownBlur(),this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e]))};var s={TEXTAREA:!0,INPUT:!0,SELECT:!0,OPTION:!0},o={radio:!0,checkbox:!0,button:!0,submit:!0,image:!0,file:!0};return n.okayPointerDown=function(t){var e=s[t.target.nodeName],i=o[t.target.type],n=!e||i;return n||this._pointerReset(),n},n.pointerDownBlur=function(){var t=document.activeElement;t&&t.blur&&t!=document.body&&t.blur()},n.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,i]),this._dragMove(t,e,i)},n._dragPointerMove=function(t,e){var i={x:e.pageX-this.pointerDownPointer.pageX,y:e.pageY-this.pointerDownPointer.pageY};return!this.isDragging&&this.hasDragStarted(i)&&this._dragStart(t,e),i},n.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},n.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e)},n._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e)},n._dragStart=function(t,e){this.isDragging=!0,this.isPreventingClicks=!0,this.dragStart(t,e)},n.dragStart=function(t,e){this.emitEvent("dragStart",[t,e])},n._dragMove=function(t,e,i){this.isDragging&&this.dragMove(t,e,i)},n.dragMove=function(t,e,i){t.preventDefault(),this.emitEvent("dragMove",[t,e,i])},n._dragEnd=function(t,e){this.isDragging=!1,setTimeout(function(){delete this.isPreventingClicks}.bind(this)),this.dragEnd(t,e)},n.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e])},n.onclick=function(t){this.isPreventingClicks&&t.preventDefault()},n._staticClick=function(t,e){this.isIgnoringMouseUp&&"mouseup"==t.type||(this.staticClick(t,e),"mouseup"!=t.type&&(this.isIgnoringMouseUp=!0,setTimeout(function(){delete this.isIgnoringMouseUp}.bind(this),400)))},n.staticClick=function(t,e){this.emitEvent("staticClick",[t,e])},i.getPointerPoint=e.getPointerPoint,i}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/drag",["./flickityt4s","unidragger/unidragger","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickityt4s"),require("unidragger"),require("fizzy-ui-utils")):t.Flickityt4s=e(t,t.Flickityt4s,t.Unidragger,t.fizzyUIUtils)}(window,function(t,e,i,n){n.extend(e.defaults,{draggable:">1",dragThreshold:3}),e.createMethods.push("_createDrag");var s=e.prototype;n.extend(s,i.prototype),s._touchActionValue="pan-y",s._createDrag=function(){this.on("activate",this.onActivateDrag),this.on("uiChange",this._uiChangeDrag),this.on("deactivate",this.onDeactivateDrag),this.on("cellChange",this.updateDraggable)},s.onActivateDrag=function(){this.handles=[this.viewport],this.bindHandles(),this.updateDraggable()},s.onDeactivateDrag=function(){this.unbindHandles(),this.element.classList.remove("is-draggable")},s.updateDraggable=function(){">1"==this.options.draggable?this.isDraggable=this.slides.length>1:"smart"==this.options.draggable?(this.viewport,this.isDraggable=this.viewport.scrollWidth>this.viewport.offsetWidth):this.isDraggable=this.options.draggable,this.isDraggable?this.element.classList.add("is-draggable"):this.element.classList.remove("is-draggable")},s.bindDrag=function(){this.options.draggable=!0,this.updateDraggable()},s.unbindDrag=function(){this.options.draggable=!1,this.updateDraggable()},s._uiChangeDrag=function(){delete this.isFreeScrolling},s.pointerDown=function(e,i){this.isDraggable?this.okayPointerDown(e)&&(this._pointerDownPreventDefault(e),this.pointerDownFocus(e),document.activeElement!=this.element&&this.pointerDownBlur(),this.dragX=this.x,this.viewport.classList.add("is-pointer-down"),this.pointerDownScroll=r(),t.addEventListener("scroll",this),this._pointerDownDefault(e,i)):this._pointerDownDefault(e,i)},s._pointerDownDefault=function(t,e){this.pointerDownPointer={pageX:e.pageX,pageY:e.pageY},this._bindPostStartEvents(t),this.dispatchEvent("pointerDown",t,[e])};var o={INPUT:!0,TEXTAREA:!0,SELECT:!0};function r(){return{x:t.pageXOffset,y:t.pageYOffset}}return s.pointerDownFocus=function(t){o[t.target.nodeName]||this.focus()},s._pointerDownPreventDefault=function(t){var e="touchstart"==t.type,i="touch"==t.pointerType,n=o[t.target.nodeName];e||i||n||t.preventDefault()},s.hasDragStarted=function(t){return Math.abs(t.x)>this.options.dragThreshold},s.pointerUp=function(t,e){delete this.isTouchScrolling,this.viewport.classList.remove("is-pointer-down"),this.dispatchEvent("pointerUp",t,[e]),this._dragPointerUp(t,e)},s.pointerDone=function(){t.removeEventListener("scroll",this),delete this.pointerDownScroll},s.dragStart=function(e,i){this.isDraggable&&(this.dragStartPosition=this.x,this.startAnimation(),t.removeEventListener("scroll",this),this.dispatchEvent("dragStart",e,[i]))},s.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.dispatchEvent("pointerMove",t,[e,i]),this._dragMove(t,e,i)},s.dragMove=function(t,e,i){if(this.isDraggable){t.preventDefault(),this.previousDragX=this.dragX;var n=this.options.rightToLeft?-1:1;this.options.wrapAround&&(i.x%=this.slideableWidth);var s=this.dragStartPosition+i.x*n;if(!this.options.wrapAround&&this.slides.length){var o=Math.max(-this.slides[0].target,this.dragStartPosition);s=s>o?.5*(s+o):s;var r=Math.min(-this.getLastSlide().target,this.dragStartPosition);s=s<r?.5*(s+r):s}this.dragX=s,this.dragMoveTime=new Date,this.dispatchEvent("dragMove",t,[e,i])}},s.dragEnd=function(t,e){if(this.isDraggable){this.options.freeScroll&&(this.isFreeScrolling=!0);var i=this.dragEndRestingSelect();if(this.options.freeScroll&&!this.options.wrapAround){var n=this.getRestingPosition();this.isFreeScrolling=-n>this.slides[0].target&&-n<this.getLastSlide().target}else this.options.freeScroll||i!=this.selectedIndex||(i+=this.dragEndBoostSelect());delete this.previousDragX,this.isDragSelect=this.options.wrapAround,this.select(i),delete this.isDragSelect,this.dispatchEvent("dragEnd",t,[e])}},s.dragEndRestingSelect=function(){var t=this.getRestingPosition(),e=Math.abs(this.getSlideDistance(-t,this.selectedIndex)),i=this._getClosestResting(t,e,1),n=this._getClosestResting(t,e,-1);return i.distance<n.distance?i.index:n.index},s._getClosestResting=function(t,e,i){for(var n=this.selectedIndex,s=1/0,o=this.options.contain&&!this.options.wrapAround?function(t,e){return t<=e}:function(t,e){return t<e};o(e,s)&&(n+=i,s=e,null!==(e=this.getSlideDistance(-t,n)));)e=Math.abs(e);return{distance:s,index:n-i}},s.getSlideDistance=function(t,e){var i=this.slides.length,s=this.options.wrapAround&&i>1,o=s?n.modulo(e,i):e,r=this.slides[o];if(!r)return null;var a=s?this.slideableWidth*Math.floor(e/i):0;return t-(r.target+a)},s.dragEndBoostSelect=function(){if(void 0===this.previousDragX||!this.dragMoveTime||new Date-this.dragMoveTime>100)return 0;var t=this.getSlideDistance(-this.dragX,this.selectedIndex),e=this.previousDragX-this.dragX;return t>0&&e>0?1:t<0&&e<0?-1:0},s.staticClick=function(t,e){var i=this.getParentCell(t.target),n=i&&i.element,s=i&&this.cells.indexOf(i);this.dispatchEvent("staticClick",t,[e,n,s])},s.onscroll=function(){var t=r(),e=this.pointerDownScroll.x-t.x,i=this.pointerDownScroll.y-t.y;(Math.abs(e)>3||Math.abs(i)>3)&&this._pointerDone()},e}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/prev-next-button",["./flickityt4s","unipointer/unipointer","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickityt4s"),require("unipointer"),require("fizzy-ui-utils")):e(t,t.Flickityt4s,t.Unipointer,t.fizzyUIUtils)}(window,function(t,e,i,n){"use strict";var s="http://www.w3.org/2000/svg";function o(t,e){this.direction=t,this.parent=e,this._create()}o.prototype=Object.create(i.prototype),o.prototype._create=function(){this.isEnabled=!0,this.isPrevious=-1==this.direction;var t=this.parent.options.rightToLeft?1:-1;this.isLeft=this.direction==t;var e=this.element=document.createElement("button");e.className="flickityt4s-button flickityt4s-prev-next-button",e.className+=this.isPrevious?" previous":" next",e.setAttribute("type","button"),this.disable(),e.setAttribute("aria-label",this.isPrevious?"Previous":"Next");var i=this.createSVG();e.appendChild(i),this.parent.on("select",this.update.bind(this)),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},o.prototype.activate=function(){this.bindStartEvent(this.element),this.element.addEventListener("click",this),this.parent.element.appendChild(this.element)},o.prototype.deactivate=function(){this.parent.element.removeChild(this.element),this.unbindStartEvent(this.element),this.element.removeEventListener("click",this)},o.prototype.createSVG=function(){var t=document.createElementNS(s,"svg");t.setAttribute("class","flickityt4s-button-icon"),t.setAttribute("viewBox","0 0 100 100");var e=document.createElementNS(s,"path"),i=function(t){return"string"==typeof t?t:"M "+t.x0+",50 L "+t.x1+","+(t.y1+50)+" L "+t.x2+","+(t.y2+50)+" L "+t.x3+",50  L "+t.x2+","+(50-t.y2)+" L "+t.x1+","+(50-t.y1)+" Z"}(this.parent.options.arrowShape);return e.setAttribute("d",i),e.setAttribute("class","arrow"),this.isLeft||e.setAttribute("transform","translate(100, 100) rotate(180) "),t.appendChild(e),t},o.prototype.handleEvent=n.handleEvent,o.prototype.onclick=function(){if(this.isEnabled){this.parent.uiChange();var t=this.isPrevious?"previous":"next";this.parent[t]()}},o.prototype.enable=function(){this.isEnabled||(this.element.disabled=!1,this.isEnabled=!0)},o.prototype.disable=function(){this.isEnabled&&(this.element.disabled=!0,this.isEnabled=!1)},o.prototype.update=function(){var t=this.isPrevious?"prev_":"next_";this.parent.element.classList.remove("flickityt4s_"+t+"disable","flickityt4s_"+t+"enable");var e=this.parent.slides;if(this.parent.options.wrapAround&&e.length>1)this.enable();else{var i=e.length?e.length-1:0,n=this.isPrevious?0:i,s=this.parent.selectedIndex==n?"disable":"enable";this[s](),this.parent.element.classList.add("flickityt4s_"+t+s)}},o.prototype.destroy=function(){this.deactivate(),this.allOff()},n.extend(e.defaults,{prevNextButtons:!0,arrowShape:{x0:10,x1:60,y1:50,x2:70,y2:40,x3:30}}),e.createMethods.push("_createPrevNextButtons");var r=e.prototype;return r._createPrevNextButtons=function(){this.options.prevNextButtons&&(this.prevButton=new o(-1,this),this.nextButton=new o(1,this),this.on("activate",this.activatePrevNextButtons))},r.activatePrevNextButtons=function(){this.prevButton.activate(),this.nextButton.activate(),this.on("deactivate",this.deactivatePrevNextButtons)},r.deactivatePrevNextButtons=function(){this.prevButton.deactivate(),this.nextButton.deactivate(),this.off("deactivate",this.deactivatePrevNextButtons)},e.PrevNextButton=o,e}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/page-dots",["./flickityt4s","unipointer/unipointer","fizzy-ui-utils/utils"],function(i,n,s){return e(t,i,n,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickityt4s"),require("unipointer"),require("fizzy-ui-utils")):e(t,t.Flickityt4s,t.Unipointer,t.fizzyUIUtils)}(window,function(t,e,i,n){function s(t){this.parent=t,this._create()}s.prototype=Object.create(i.prototype),s.prototype._create=function(){this.holder=document.createElement("ol"),this.holder.className="flickityt4s-page-dots",this.dots=[],this.handleClick=this.onClick.bind(this),this.on("pointerDown",this.parent.childUIPointerDown.bind(this.parent))},s.prototype.activate=function(){this.setDots(),this.holder.addEventListener("click",this.handleClick),this.bindStartEvent(this.holder),this.parent.element.appendChild(this.holder)},s.prototype.deactivate=function(){this.holder.removeEventListener("click",this.handleClick),this.unbindStartEvent(this.holder),this.parent.element.removeChild(this.holder)},s.prototype.setDots=function(){var t=this.parent.slides.length-this.dots.length;t>0?this.addDots(t):t<0&&this.removeDots(-t)},s.prototype.addDots=function(t){for(var e=document.createDocumentFragment(),i=[],n=this.dots.length,s=n+t,o=n;o<s;o++){var r=document.createElement("li");r.className="dot",r.setAttribute("aria-label","Page dot "+(o+1)),e.appendChild(r),i.push(r)}this.holder.appendChild(e),this.dots=this.dots.concat(i)},s.prototype.removeDots=function(t){this.dots.splice(this.dots.length-t,t).forEach(function(t){this.holder.removeChild(t)},this)},s.prototype.updateSelected=function(){this.selectedDot&&(this.selectedDot.className="dot",this.selectedDot.removeAttribute("aria-current")),this.dots.length&&(this.selectedDot=this.dots[this.parent.selectedIndex],this.selectedDot.className="dot is-selected",this.selectedDot.setAttribute("aria-current","step"))},s.prototype.onTap=s.prototype.onClick=function(t){var e=t.target;if("LI"==e.nodeName){this.parent.uiChange();var i=this.dots.indexOf(e);this.parent.select(i)}},s.prototype.destroy=function(){this.deactivate(),this.allOff()},e.PageDots=s,n.extend(e.defaults,{pageDots:!0}),e.createMethods.push("_createPageDots");var o=e.prototype;return o._createPageDots=function(){this.options.pageDots&&(this.pageDots=new s(this),this.on("activate",this.activatePageDots),this.on("select",this.updateSelectedPageDots),this.on("cellChange",this.updatePageDots),this.on("resize",this.updatePageDots),this.on("deactivate",this.deactivatePageDots))},o.activatePageDots=function(){this.pageDots.activate()},o.updateSelectedPageDots=function(){this.pageDots.updateSelected()},o.updatePageDots=function(){this.pageDots.setDots()},o.deactivatePageDots=function(){this.pageDots.deactivate()},e.PageDots=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/player",["ev-emitter/ev-emitter","fizzy-ui-utils/utils","./flickityt4s"],function(t,i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("fizzy-ui-utils"),require("./flickityt4s")):e(t.EvEmitter,t.fizzyUIUtils,t.Flickityt4s)}(window,function(t,e,i){function n(t){this.parent=t,this.state="stopped",this.onVisibilityChange=this.visibilityChange.bind(this),this.onVisibilityPlay=this.visibilityPlay.bind(this)}n.prototype=Object.create(t.prototype),n.prototype.play=function(){"playing"!=this.state&&(document.hidden?document.addEventListener("visibilitychange",this.onVisibilityPlay):(this.state="playing",document.addEventListener("visibilitychange",this.onVisibilityChange),this.tick()))},n.prototype.tick=function(){if("playing"==this.state){var t=this.parent.options.autoPlay;t="number"==typeof t?t:3e3;var e=this;this.clear(),this.timeout=setTimeout(function(){e.parent.next(!0),e.tick()},t)}},n.prototype.stop=function(){this.state="stopped",this.clear(),document.removeEventListener("visibilitychange",this.onVisibilityChange)},n.prototype.clear=function(){clearTimeout(this.timeout)},n.prototype.pause=function(){"playing"==this.state&&(this.state="paused",this.clear())},n.prototype.unpause=function(){"paused"==this.state&&this.play()},n.prototype.visibilityChange=function(){this[document.hidden?"pause":"unpause"]()},n.prototype.visibilityPlay=function(){this.play(),document.removeEventListener("visibilitychange",this.onVisibilityPlay)},e.extend(i.defaults,{pauseAutoPlayOnHover:!0}),i.createMethods.push("_createPlayer");var s=i.prototype;return s._createPlayer=function(){this.player=new n(this),this.on("activate",this.activatePlayer),this.on("uiChange",this.stopPlayer),this.on("pointerDown",this.stopPlayer),this.on("deactivate",this.deactivatePlayer)},s.activatePlayer=function(){this.options.autoPlay&&(this.player.play(),this.element.addEventListener("mouseenter",this))},s.playPlayer=function(){this.player.play()},s.stopPlayer=function(){this.player.stop()},s.pausePlayer=function(){this.player.pause()},s.unpausePlayer=function(){this.player.unpause()},s.deactivatePlayer=function(){this.player.stop(),this.element.removeEventListener("mouseenter",this)},s.onmouseenter=function(){this.options.pauseAutoPlayOnHover&&(this.player.pause(),this.element.addEventListener("mouseleave",this))},s.onmouseleave=function(){this.player.unpause(),this.element.removeEventListener("mouseleave",this)},i.Player=n,i}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/add-remove-cell",["./flickityt4s","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickityt4s"),require("fizzy-ui-utils")):e(t,t.Flickityt4s,t.fizzyUIUtils)}(window,function(t,e,i){var n=e.prototype;return n.insert=function(t,e){var i=this._makeCells(t);if(i&&i.length){var n=this.cells.length;e=void 0===e?n:e;var s=function(t){var e=document.createDocumentFragment();return t.forEach(function(t){e.appendChild(t.element)}),e}(i),o=e==n;if(o)this.slider.appendChild(s);else{var r=this.cells[e].element;this.slider.insertBefore(s,r)}if(0===e)this.cells=i.concat(this.cells);else if(o)this.cells=this.cells.concat(i);else{var a=this.cells.splice(e,n-e);this.cells=this.cells.concat(i).concat(a)}this._sizeCells(i),this.cellChange(e,!0)}},n.append=function(t){this.insert(t,this.cells.length)},n.prepend=function(t){this.insert(t,0)},n.remove=function(t){var e=this.getCells(t);if(e&&e.length){var n=this.cells.length-1;e.forEach(function(t){t.remove();var e=this.cells.indexOf(t);n=Math.min(e,n),i.removeFrom(this.cells,t)},this),this.cellChange(n,!0)}},n.cellSizeChange=function(t){var e=this.getCell(t);if(e){e.getSize();var i=this.cells.indexOf(e);this.cellChange(i)}},n.cellChange=function(t,e){var i=this.selectedElement;this._positionCells(t),this._getWrapShiftCells(),this.setGallerySize(),this.setPrevNextButtons();var n=this.getCell(i);n&&(this.selectedIndex=this.getCellSlideIndex(n)),this.selectedIndex=Math.min(this.slides.length-1,this.selectedIndex),this.emitEvent("cellChange",[t]),this.select(this.selectedIndex),e&&this.positionSliderAtSelected()},e}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/lazyload",["./flickityt4s","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("./flickityt4s"),require("fizzy-ui-utils")):e(t,t.Flickityt4s,t.fizzyUIUtils)}(window,function(t,e,i){"use strict";e.createMethods.push("_createLazyload");var n=e.prototype;function s(t,e){this.img=t,this.flickityt4s=e,this.load()}return n._createLazyload=function(){this.on("select",this.lazyLoad)},n.lazyLoad=function(){var t=this.options.lazyLoad;if(t){var e="number"==typeof t?t:0,n=this.getAdjacentCellElements(e),o=[];n.forEach(function(t){var e=function(t){if("IMG"==t.nodeName){var e=t.getAttribute("data-flickityt4s-lazyload"),n=t.getAttribute("data-flickityt4s-lazyload-src"),s=t.getAttribute("data-flickityt4s-lazyload-srcset");if(e||n||s)return[t]}var o=t.querySelectorAll("img[data-flickityt4s-lazyload], img[data-flickityt4s-lazyload-src], img[data-flickityt4s-lazyload-srcset]");return i.makeArray(o)}(t);o=o.concat(e)}),o.forEach(function(t){new s(t,this)},this)}},s.prototype.handleEvent=i.handleEvent,s.prototype.load=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this);var t=this.img.getAttribute("data-flickityt4s-lazyload")||this.img.getAttribute("data-flickityt4s-lazyload-src"),e=this.img.getAttribute("data-flickityt4s-lazyload-srcset");this.img.src=t,e&&this.img.setAttribute("srcset",e),this.img.removeAttribute("data-flickityt4s-lazyload"),this.img.removeAttribute("data-flickityt4s-lazyload-src"),this.img.removeAttribute("data-flickityt4s-lazyload-srcset")},s.prototype.onload=function(t){this.complete(t,"flickityt4s-lazyloaded")},s.prototype.onerror=function(t){this.complete(t,"flickityt4s-lazyerror")},s.prototype.complete=function(t,e){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this);var i=this.flickityt4s.getParentCell(this.img),n=i&&i.element;this.flickityt4s.cellSizeChange(n),this.img.classList.add(e),this.flickityt4s.dispatchEvent("lazyLoad",t,n)},e.LazyLoader=s,e}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s/js/index",["./flickityt4s","./drag","./prev-next-button","./page-dots","./player","./add-remove-cell","./lazyload"],e):"object"==typeof module&&module.exports&&(module.exports=e(require("./flickityt4s"),require("./drag"),require("./prev-next-button"),require("./page-dots"),require("./player"),require("./add-remove-cell"),require("./lazyload")))}(window,function(t){return t}),function(t,e){"function"==typeof define&&define.amd?define("flickityt4s-as-nav-for/as-nav-for",["flickityt4s/js/index","fizzy-ui-utils/utils"],e):"object"==typeof module&&module.exports?module.exports=e(require("flickityt4s"),require("fizzy-ui-utils")):t.Flickityt4s=e(t.Flickityt4s,t.fizzyUIUtils)}(window,function(t,e){t.createMethods.push("_createAsNavFor");var i=t.prototype;return i._createAsNavFor=function(){this.on("activate",this.activateAsNavFor),this.on("deactivate",this.deactivateAsNavFor),this.on("destroy",this.destroyAsNavFor);var t=this.options.asNavFor;if(t){var e=this;setTimeout(function(){e.setNavCompanion(t)})}},i.setNavCompanion=function(i){i=e.getQueryElement(i);var n=t.data(i);if(n&&n!=this){this.navCompanion=n;var s=this;this.onNavCompanionSelect=function(){s.navCompanionSelect()},n.on("select",this.onNavCompanionSelect),this.on("staticClick",this.onNavStaticClick),this.navCompanionSelect(!0)}},i.navCompanionSelect=function(t){var e=this.navCompanion&&this.navCompanion.selectedCells;if(e){var i,n=e[0],s=this.navCompanion.cells.indexOf(n),o=s+e.length-1,r=Math.floor((o-(i=s))*this.navCompanion.cellAlign+i);if(this.selectCell(r,!1,t),this.removeNavSelectedElements(),!(r>=this.cells.length)){var a=this.cells.slice(s,o+1);this.navSelectedElements=a.map(function(t){return t.element}),this.changeNavSelectedClass("add")}}},i.changeNavSelectedClass=function(t){this.navSelectedElements.forEach(function(e){e.classList[t]("is-nav-selected")})},i.activateAsNavFor=function(){this.navCompanionSelect(!0)},i.removeNavSelectedElements=function(){this.navSelectedElements&&(this.changeNavSelectedClass("remove"),delete this.navSelectedElements)},i.onNavStaticClick=function(t,e,i,n){"number"==typeof n&&this.navCompanion.selectCell(n)},i.deactivateAsNavFor=function(){this.removeNavSelectedElements()},i.destroyAsNavFor=function(){this.navCompanion&&(this.navCompanion.off("select",this.onNavCompanionSelect),this.off("staticClick",this.onNavStaticClick),delete this.navCompanion)},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("imagesloaded/imagesloaded",["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}("undefined"!=typeof window?window:this,function(t,e){var i=t.jQuery_T4NT,n=t.console;function s(t,e){for(var i in e)t[i]=e[i];return t}var o=Array.prototype.slice;function r(t,e,a){if(!(this instanceof r))return new r(t,e,a);var h,l=t;"string"==typeof t&&(l=document.querySelectorAll(t)),l?(this.elements=(h=l,Array.isArray(h)?h:"object"==typeof h&&"number"==typeof h.length?o.call(h):[h]),this.options=s({},this.options),"function"==typeof e?a=e:s(this.options,e),a&&this.on("always",a),this.getImages(),i&&(this.jqDeferred=new i.Deferred),setTimeout(this.check.bind(this))):n.error("Bad element for imagesLoaded "+(l||t))}r.prototype=Object.create(e.prototype),r.prototype.options={},r.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},r.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&a[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var s=i[n];this.addImage(s)}if("string"==typeof this.options.background){var o=t.querySelectorAll(this.options.background);for(n=0;n<o.length;n++){var r=o[n];this.addElementBackgroundImages(r)}}}};var a={1:!0,9:!0,11:!0};function h(t){this.img=t}function l(t,e){this.url=t,this.element=e,this.img=new Image}return r.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var s=n&&n[2];s&&this.addBackground(s,t),n=i.exec(e.backgroundImage)}},r.prototype.addImage=function(t){var e=new h(t);this.images.push(e)},r.prototype.addBackground=function(t,e){var i=new l(t,e);this.images.push(i)},r.prototype.check=function(){var t=this;function e(e,i,n){setTimeout(function(){t.progress(e,i,n)})}this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?this.images.forEach(function(t){t.once("progress",e),t.check()}):this.complete()},r.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&n&&n.log("progress: "+i,t,e)},r.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},h.prototype=Object.create(e.prototype),h.prototype.check=function(){this.getIsImageComplete()?this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.src)},h.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},h.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},h.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},h.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},l.prototype=Object.create(h.prototype),l.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},l.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},l.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},r.makejQuery_T4NTPlugin=function(e){(e=e||t.jQuery_T4NT)&&((i=e).fn.imagesLoaded=function(t,e){return new r(this,t,e).jqDeferred.promise(i(this))})},r.makejQuery_T4NTPlugin(),r}),function(t,e){"function"==typeof define&&define.amd?define(["flickityt4s/js/index","imagesloaded/imagesloaded"],function(i,n){return e(t,i,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("flickityt4s"),require("imagesloaded")):t.Flickityt4s=e(t,t.Flickityt4s,t.imagesLoaded)}(window,function(t,e,i){"use strict";e.createMethods.push("_createImagesLoaded");var n=e.prototype;return n._createImagesLoaded=function(){this.on("activate",this.imagesLoaded)},n.imagesLoaded=function(){if(this.options.imagesLoaded){var t=this;i(this.slider).on("progress",function(e,i){var n=t.getParentCell(i.img);t.cellSizeChange(n&&n.element),t.options.freeScroll||t.positionSliderAtSelected()})}},e}),function(t,e){"function"==typeof define&&define.amd?define(["flickityt4s/js/index","fizzy-ui-utils/utils"],e):"object"==typeof module&&module.exports?module.exports=e(require("flickityt4s"),require("fizzy-ui-utils")):e(t.Flickityt4s,t.fizzyUIUtils)}(this,function(t,e){var i=t.Slide,n=i.prototype.updateTarget;i.prototype.updateTarget=function(){if(n.apply(this,arguments),this.parent.options.fade){var t=this.target-this.x,e=this.cells[0].x;this.cells.forEach(function(i){var n=i.x-e-t;i.renderPosition(n)})}},i.prototype.setOpacity=function(t){this.cells.forEach(function(e){e.element.style.opacity=t})};var s=t.prototype;t.createMethods.push("_createFade"),s._createFade=function(){this.fadeIndex=this.selectedIndex,this.prevSelectedIndex=this.selectedIndex,this.on("select",this.onSelectFade),this.on("dragEnd",this.onDragEndFade),this.on("settle",this.onSettleFade),this.on("activate",this.onActivateFade),this.on("deactivate",this.onDeactivateFade)};var o=s.updateSlides;s.updateSlides=function(){o.apply(this,arguments),this.options.fade},s.onSelectFade=function(){this.fadeIndex=Math.min(this.prevSelectedIndex,this.slides.length-1),this.prevSelectedIndex=this.selectedIndex},s.onSettleFade=function(){delete this.didDragEnd,this.options.fade},s.onDragEndFade=function(){this.didDragEnd=!0},s.onActivateFade=function(){this.options.fade&&this.element.classList.add("is-fade")},s.onDeactivateFade=function(){this.options.fade&&(this.element.classList.remove("is-fade"),this.slides.forEach(function(t){t.setOpacity("")}))};var r=s.positionSlider;s.positionSlider=function(){this.options.fade?(this.fadeSlides(),this.dispatchScrollEvent()):r.apply(this,arguments)};var a=s.positionSliderAtSelected;s.positionSliderAtSelected=function(){this.options.fade&&this.setTranslateX(0),a.apply(this,arguments)},s.fadeSlides=function(){this.slides.length},s.getFadeIndexes=function(){return this.isDragging||this.didDragEnd?this.options.wrapAround?this.getFadeDragWrapIndexes():this.getFadeDragLimitIndexes():{a:this.fadeIndex,b:this.selectedIndex}},s.getFadeDragWrapIndexes=function(){var t=this.slides.map(function(t,e){return this.getSlideDistance(-this.x,e)},this),i=t.map(function(t){return Math.abs(t)}),n=Math.min.apply(Math,i),s=i.indexOf(n),o=t[s],r=this.slides.length,a=o>=0?1:-1;return{a:s,b:e.modulo(s+a,r)}},s.getFadeDragLimitIndexes=function(){for(var t=0,e=0;e<this.slides.length-1;e++){var i=this.slides[e];if(-this.x<i.target)break;t=e}return{a:t,b:t+1}},s.wrapDifference=function(t,e){var i=e-t;if(!this.options.wrapAround)return i;var n=i+this.slideableWidth,s=i-this.slideableWidth;return Math.abs(n)<Math.abs(i)&&(i=n),Math.abs(s)<Math.abs(i)&&(i=s),i};var h=s._getWrapShiftCells;s._getWrapShiftCells=function(){this.options.fade||h.apply(this,arguments)};var l=s.shiftWrapCells;return s.shiftWrapCells=function(){this.options.fade||l.apply(this,arguments)},t}),function(t,e){"function"==typeof define&&define.amd?define(["Flickityt4s/js/index","fizzy-ui-utils/utils"],e):"object"==typeof module&&module.exports?module.exports=e(require("Flickityt4s"),require("fizzy-ui-utils")):t.Flickityt4s=e(t.Flickityt4s,t.fizzyUIUtils)}(window,function(t,e){"use strict";return t.createMethods.push("_createSync"),t.prototype._createSync=function(){this.syncers={};var t=this.options.sync;if(this.on("destroy",this.unsyncAll),t){var e=this;setTimeout(function(){e.sync(t)})}},t.prototype.sync=function(i){i=e.getQueryElement(i);var n=t.data(i);n&&(this._syncCompanion(n),n._syncCompanion(this))},t.prototype._syncCompanion=function(t){var e=this;function i(){var i=e.selectedIndex;t.selectedIndex!=i&&t.select(i)}this.on("select",i),this.syncers[t.guid]={Flickityt4s:t,listener:i}},t.prototype.unsync=function(i){i=e.getQueryElement(i);var n=t.data(i);this._unsync(n)},t.prototype._unsync=function(t){t&&(this._unsyncCompanion(t),t._unsyncCompanion(this))},t.prototype._unsyncCompanion=function(t){var e=t.guid,i=this.syncers[e];this.off("select",i.listener),delete this.syncers[e]},t.prototype.unsyncAll=function(){for(var t in this.syncers){var e=this.syncers[t];this._unsync(e.Flickityt4s)}},t});

// ((global, factory) => {
//   'use strict';

//   // AMD module definition
//   if (typeof define === 'function' && define.amd) {
//     define('jQuery_T4NT-bridget/jQuery_T4NT-bridget', ['jQuery_T4NT'], (i) =>
//       factory(global, i));
//   }
//   // CommonJS module definition
//   else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(global, require('jQuery_T4NT'));
//   }
//   // Global definition for browsers
//   else {
//     global.jQuery_T4NTBridget = factory(global, global.$ || global.jQuary);
//   }
// })(window, (global, $) => {
//   'use strict';

//   // Bridget function - allows jQuery plugins to be defined
//   const bridget = (pluginName, PluginClass, jquery = $) => {
//     if (!jquery) return;

//     // Add an option method if PluginClass doesn't have it
//     if (!PluginClass.prototype.option) {
//       PluginClass.prototype.option = (options) => {
//         if (jquery.isPlainObject(options)) {
//           this.options = jquery.extend(true, this.options, options);
//         }
//       };
//     }

//     // Extend jQuery with the plugin
//     jquery.fn[pluginName] = function (arg) {
//       if (typeof arg === 'string') {
//         // Handle method calls on plugin instances
//         return callPluginMethod(
//           this,
//           pluginName,
//           arg,
//           Array.prototype.slice.call(arguments, 1)
//         );
//       } else {
//         // Initialize the plugin or update its options
//         return initPlugin(this, pluginName, PluginClass, arg);
//       }
//     };

//     // Register `bridget` globally if not already defined
//     registerBridget(jquery);
//   };

//   // Handle method calls on plugin instances
//   const callPluginMethod = (elements, pluginName, methodName, args) => {
//     let returnValue;

//     elements.each((index, element) => {
//       const instance = $.data(element, pluginName);
//       if (!instance) {
//         logError(
//           `${pluginName} not initialized. Cannot call methods like ${methodName}.`
//         );
//         return;
//       }

//       const method = instance[methodName];
//       if (!method || methodName.charAt(0) === '_') {
//         logError(`${methodName} is not a valid method for ${pluginName}.`);
//         return;
//       }

//       const result = method.apply(instance, args);
//       returnValue = returnValue === undefined ? result : returnValue;
//     });

//     return returnValue !== undefined ? returnValue : elements;
//   };

//   // Initialize the plugin or update its options
//   const initPlugin = (elements, pluginName, PluginClass, options) => {
//     elements.each((index, element) => {
//       let instance = $.data(element, pluginName);
//       if (instance) {
//         instance.option(options);
//         instance._init();
//       } else {
//         instance = new PluginClass(element, options);
//         $.data(element, pluginName, instance);
//       }
//     });

//     return elements;
//   };

//   // Register the Bridget function globally if it doesn't exist
//   const registerBridget = ($) => {
//     if (!$ || $.bridget) return;
//     $.bridget = bridget;
//   };

//   // Utility function to log errors
//   const logError = (message) => {
//     if (global.console && global.console.error) {
//       global.console.error(message);
//     }
//   };

//   // Register Bridget with jQuery_T4NT if available
//   registerBridget($);

//   // Return the Bridget function
//   return bridget;
// });
// /**
//  * EvEmitter v2.1.1
//  * Lil' event emitter
//  * MIT License
//  */

// (function (global, factory) {
//   'use strict';

//   // universal module definition
//   if (typeof module == 'object' && module.exports) {
//     // CommonJS - Browserify, Webpack
//     module.exports = factory();
//   } else {
//     // Browser globals
//     global.EvEmitter = factory();
//   }
// })(typeof window != 'undefined' ? window : this, function () {
//   'use strict';

//   function EvEmitter() {}

//   let proto = EvEmitter.prototype;

//   proto.on = function (eventName, listener) {
//     if (!eventName || !listener) return this;

//     // set events hash
//     let events = (this._events = this._events || {});
//     // set listeners array
//     let listeners = (events[eventName] = events[eventName] || []);
//     // only add once
//     if (!listeners.includes(listener)) {
//       listeners.push(listener);
//     }

//     return this;
//   };

//   proto.once = function (eventName, listener) {
//     if (!eventName || !listener) return this;

//     // add event
//     this.on(eventName, listener);
//     // set once flag
//     // set onceEvents hash
//     let onceEvents = (this._onceEvents = this._onceEvents || {});
//     // set onceListeners object
//     let onceListeners = (onceEvents[eventName] = onceEvents[eventName] || {});
//     // set flag
//     onceListeners[listener] = true;

//     return this;
//   };

//   proto.off = function (eventName, listener) {
//     let listeners = this._events && this._events[eventName];
//     if (!listeners || !listeners.length) return this;

//     let index = listeners.indexOf(listener);
//     if (index != -1) {
//       listeners.splice(index, 1);
//     }

//     return this;
//   };

//   proto.emitEvent = function (eventName, args) {
//     let listeners = this._events && this._events[eventName];
//     if (!listeners || !listeners.length) return this;

//     // copy over to avoid interference if .off() in listener
//     listeners = listeners.slice(0);
//     args = args || [];
//     // once stuff
//     let onceListeners = this._onceEvents && this._onceEvents[eventName];

//     for (let listener of listeners) {
//       let isOnce = onceListeners && onceListeners[listener];
//       if (isOnce) {
//         // remove listener
//         // remove before trigger to prevent recursion
//         this.off(eventName, listener);
//         // unset once flag
//         delete onceListeners[listener];
//       }
//       // trigger listener
//       listener.apply(this, args);
//     }

//     return this;
//   };

//   proto.allOff = function () {
//     delete this._events;
//     delete this._onceEvents;
//   };

//   return EvEmitter;
// });

// /*!
//  * Infinite Scroll v2.0.4
//  * measure size of elements
//  * MIT license
//  */

// (function (window, factory) {
//   'use strict';

//   if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory();
//   } else {
//     // browser global
//     window.getSize = factory();
//   }
// })(window, function factory() {
//   'use strict';

//   // -------------------------- helpers -------------------------- //

//   // get a number from a string, not a percentage
//   function getStyleSize(value) {
//     let num = parseFloat(value);
//     // not a percent like '100%', and a number
//     let isValid = value.indexOf('%') == -1 && !isNaN(num);
//     return isValid && num;
//   }

//   // -------------------------- measurements -------------------------- //

//   let measurements = [
//     'paddingLeft',
//     'paddingRight',
//     'paddingTop',
//     'paddingBottom',
//     'marginLeft',
//     'marginRight',
//     'marginTop',
//     'marginBottom',
//     'borderLeftWidth',
//     'borderRightWidth',
//     'borderTopWidth',
//     'borderBottomWidth',
//   ];

//   let measurementsLength = measurements.length;

//   function getZeroSize() {
//     let size = {
//       width: 0,
//       height: 0,
//       innerWidth: 0,
//       innerHeight: 0,
//       outerWidth: 0,
//       outerHeight: 0,
//     };
//     measurements.forEach((measurement) => {
//       size[measurement] = 0;
//     });
//     return size;
//   }

//   // -------------------------- getSize -------------------------- //

//   function getSize(elem) {
//     // use querySeletor if elem is string
//     if (typeof elem == 'string') elem = document.querySelector(elem);

//     // do not proceed on non-objects
//     let isElement = elem && typeof elem == 'object' && elem.nodeType;
//     if (!isElement) return;

//     let style = getComputedStyle(elem);

//     // if hidden, everything is 0
//     if (style.display == 'none') return getZeroSize();

//     let size = {};
//     size.width = elem.offsetWidth;
//     size.height = elem.offsetHeight;

//     let isBorderBox = (size.isBorderBox = style.boxSizing == 'border-box');

//     // get all measurements
//     measurements.forEach((measurement) => {
//       let value = style[measurement];
//       let num = parseFloat(value);
//       // any 'auto', 'medium' value will be 0
//       size[measurement] = !isNaN(num) ? num : 0;
//     });

//     let paddingWidth = size.paddingLeft + size.paddingRight;
//     let paddingHeight = size.paddingTop + size.paddingBottom;
//     let marginWidth = size.marginLeft + size.marginRight;
//     let marginHeight = size.marginTop + size.marginBottom;
//     let borderWidth = size.borderLeftWidth + size.borderRightWidth;
//     let borderHeight = size.borderTopWidth + size.borderBottomWidth;

//     // overwrite width and height if we can get it from style
//     let styleWidth = getStyleSize(style.width);
//     if (styleWidth !== false) {
//       size.width =
//         styleWidth +
//         // add padding and border unless it's already including it
//         (isBorderBox ? 0 : paddingWidth + borderWidth);
//     }

//     let styleHeight = getStyleSize(style.height);
//     if (styleHeight !== false) {
//       size.height =
//         styleHeight +
//         // add padding and border unless it's already including it
//         (isBorderBox ? 0 : paddingHeight + borderHeight);
//     }

//     size.innerWidth = size.width - (paddingWidth + borderWidth);
//     size.innerHeight = size.height - (paddingHeight + borderHeight);

//     size.outerWidth = size.width + marginWidth;
//     size.outerHeight = size.height + marginHeight;

//     return size;
//   }

//   return getSize;
// });

// /**
//  * matchesSelector v2.0.2
//  * matchesSelector( element, '.selector' )
//  * MIT license
//  */

// /*jshint browser: true, strict: true, undef: true, unused: true */

// (function (window, factory) {
//   /*global define: false, module: false */
//   'use strict';
//   // universal module definition
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory();
//   } else {
//     // browser global
//     window.matchesSelector = factory();
//   }
// })(window, function factory() {
//   'use strict';

//   var matchesMethod = (function () {
//     var ElemProto = window.Element.prototype;
//     // check for the standard method name first
//     if (ElemProto.matches) {
//       return 'matches';
//     }
//     // check un-prefixed
//     if (ElemProto.matchesSelector) {
//       return 'matchesSelector';
//     }
//     // check vendor prefixes
//     var prefixes = ['webkit', 'moz', 'ms', 'o'];

//     for (var i = 0; i < prefixes.length; i++) {
//       var prefix = prefixes[i];
//       var method = prefix + 'MatchesSelector';
//       if (ElemProto[method]) {
//         return method;
//       }
//     }
//   })();

//   return function matchesSelector(elem, selector) {
//     return elem[matchesMethod](selector);
//   };
// });

// /**
//  * Fizzy UI utils v3.0.0
//  * MIT license
//  */

// (function (global, factory) {
//   'use strict';

//   // universal module definition
//   if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(global);
//   } else {
//     // browser global
//     global.fizzyUIUtils = factory(global);
//   }
// })(window, function factory(global) {
//   'use strict';

//   let utils = {};

//   // ----- extend ----- //

//   // extends objects
//   utils.extend = function (a, b) {
//     return Object.assign(a, b);
//   };

//   // ----- modulo ----- //

//   utils.modulo = function (num, div) {
//     return ((num % div) + div) % div;
//   };

//   // ----- makeArray ----- //

//   // turn element or nodeList into an array
//   utils.makeArray = function (obj) {
//     // use object if already an array
//     if (Array.isArray(obj)) return obj;

//     // return empty array if undefined or null. #6
//     if (obj === null || obj === undefined) return [];

//     let isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
//     // convert nodeList to array
//     if (isArrayLike) return [...obj];

//     // array of single index
//     return [obj];
//   };

//   // ----- removeFrom ----- //

//   utils.removeFrom = function (ary, obj) {
//     let index = ary.indexOf(obj);
//     if (index != -1) {
//       ary.splice(index, 1);
//     }
//   };

//   // ----- getParent ----- //

//   utils.getParent = function (elem, selector) {
//     while (elem.parentNode && elem != document.body) {
//       elem = elem.parentNode;
//       if (elem.matches(selector)) return elem;
//     }
//   };

//   // ----- getQueryElement ----- //

//   // use element as selector string
//   utils.getQueryElement = function (elem) {
//     if (typeof elem == 'string') {
//       return document.querySelector(elem);
//     }
//     return elem;
//   };

//   // ----- handleEvent ----- //

//   // enable .ontype to trigger from .addEventListener( elem, 'type' )
//   utils.handleEvent = function (event) {
//     let method = 'on' + event.type;
//     if (this[method]) {
//       this[method](event);
//     }
//   };

//   // ----- filterFindElements ----- //

//   utils.filterFindElements = function (elems, selector) {
//     // make array of elems
//     elems = utils.makeArray(elems);

//     return (
//       elems
//         // check that elem is an actual element
//         .filter((elem) => elem instanceof HTMLElement)
//         .reduce((ffElems, elem) => {
//           // add elem if no selector
//           if (!selector) {
//             ffElems.push(elem);
//             return ffElems;
//           }
//           // filter & find items if we have a selector
//           // filter
//           if (elem.matches(selector)) {
//             ffElems.push(elem);
//           }
//           // find children
//           let childElems = elem.querySelectorAll(selector);
//           // concat childElems to filterFound array
//           ffElems = ffElems.concat(...childElems);
//           return ffElems;
//         }, [])
//     );
//   };

//   // ----- debounceMethod ----- //

//   utils.debounceMethod = function (_class, methodName, threshold) {
//     threshold = threshold || 100;
//     // original method
//     let method = _class.prototype[methodName];
//     let timeoutName = methodName + 'Timeout';

//     _class.prototype[methodName] = function () {
//       clearTimeout(this[timeoutName]);

//       let args = arguments;
//       this[timeoutName] = setTimeout(() => {
//         method.apply(this, args);
//         delete this[timeoutName];
//       }, threshold);
//     };
//   };

//   // ----- docReady ----- //

//   utils.docReady = function (onDocReady) {
//     let readyState = document.readyState;
//     if (readyState == 'complete' || readyState == 'interactive') {
//       // do async to allow for other scripts to run. metafizzy/flickity#441
//       setTimeout(onDocReady);
//     } else {
//       document.addEventListener('DOMContentLoaded', onDocReady);
//     }
//   };

//   // ----- htmlInit ----- //

//   // http://bit.ly/3oYLusc
//   utils.toDashed = function (str) {
//     return str
//       .replace(/(.)([A-Z])/g, function (match, $1, $2) {
//         return $1 + '-' + $2;
//       })
//       .toLowerCase();
//   };

//   let console = global.console;

//   // allow user to initialize classes via [data-namespace] or .js-namespace class
//   // htmlInit( Widget, 'widgetName' )
//   // options are parsed from data-namespace-options
//   utils.htmlInit = function (WidgetClass, namespace) {
//     utils.docReady(function () {
//       let dashedNamespace = utils.toDashed(namespace);
//       let dataAttr = 'data-' + dashedNamespace;
//       let dataAttrElems = document.querySelectorAll(`[${dataAttr}]`);
//       let jQuery = global.jQuery;

//       [...dataAttrElems].forEach((elem) => {
//         let attr = elem.getAttribute(dataAttr);
//         let options;
//         try {
//           options = attr && JSON.parse(attr);
//         } catch (error) {
//           // log error, do not initialize
//           if (console) {
//             console.error(
//               `Error parsing ${dataAttr} on ${elem.className}: ${error}`
//             );
//           }
//           return;
//         }
//         // initialize
//         let instance = new WidgetClass(elem, options);
//         // make available via $().data('namespace')
//         if (jQuery) {
//           jQuery.data(elem, namespace, instance);
//         }
//       });
//     });
//   };

//   // -----  ----- //

//   return utils;
// });

// /**
//  * Outlayer Item
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD - RequireJS
//     define(['ev-emitter/ev-emitter', 'get-size/get-size'], factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS - Browserify, Webpack
//     module.exports = factory(require('ev-emitter'), require('get-size'));
//   } else {
//     // browser global
//     window.Outlayer = {};
//     window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
//   }
// })(window, function factory(EvEmitter, getSize) {
//   'use strict';

//   // ----- helpers ----- //

//   function isEmptyObj(obj) {
//     for (var prop in obj) {
//       return false;
//     }
//     prop = null;
//     return true;
//   }

//   // -------------------------- CSS3 support -------------------------- //

//   var docElemStyle = document.documentElement.style;

//   var transitionProperty =
//     typeof docElemStyle.transition == 'string'
//       ? 'transition'
//       : 'WebkitTransition';
//   var transformProperty =
//     typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

//   var transitionEndEvent = {
//     WebkitTransition: 'webkitTransitionEnd',
//     transition: 'transitionend',
//   }[transitionProperty];

//   // cache all vendor properties that could have vendor prefix
//   var vendorProperties = {
//     transform: transformProperty,
//     transition: transitionProperty,
//     transitionDuration: transitionProperty + 'Duration',
//     transitionProperty: transitionProperty + 'Property',
//     transitionDelay: transitionProperty + 'Delay',
//   };

//   // -------------------------- Item -------------------------- //

//   function Item(element, layout) {
//     if (!element) {
//       return;
//     }

//     this.element = element;
//     // parent layout class, $window.e. Masonry, Isotope, or Packery
//     this.layout = layout;
//     this.position = {
//       x: 0,
//       y: 0,
//     };

//     this._create();
//   }

//   // inherit EvEmitter
//   var proto = (Item.prototype = Object.create(EvEmitter.prototype));
//   proto.constructor = Item;

//   proto._create = function () {
//     // transition objects
//     this._transn = {
//       ingProperties: {},
//       clean: {},
//       onEnd: {},
//     };

//     this.css({
//       position: 'absolute',
//     });
//   };

//   // trigger specified handler for event type
//   proto.handleEvent = function (event) {
//     var method = 'on' + event.type;
//     if (this[method]) {
//       this[method](event);
//     }
//   };

//   proto.getSize = function () {
//     this.size = getSize(this.element);
//   };

//   /**
//    * apply CSS styles to element
//    * @param {Object} style
//    */
//   proto.css = function (style) {
//     var elemStyle = this.element.style;

//     for (var prop in style) {
//       // use vendor property if available
//       var supportedProp = vendorProperties[prop] || prop;
//       elemStyle[supportedProp] = style[prop];
//     }
//   };

//   // measure position, and sets it
//   proto.getPosition = function () {
//     var style = getComputedStyle(this.element);
//     var isOriginLeft = LtrT4s;
//     var isOriginTop = this.layout._getOption('originTop');
//     var xValue = style[isOriginLeft ? 'left' : 'right'];
//     var yValue = style[isOriginTop ? 'top' : 'bottom'];
//     var x = parseFloat(xValue);
//     var y = parseFloat(yValue);
//     // convert percent to pixels
//     var layoutSize = this.layout.size;
//     if (xValue.indexOf('%') != -1) {
//       x = (x / 100) * layoutSize.width;
//     }
//     if (yValue.indexOf('%') != -1) {
//       y = (y / 100) * layoutSize.height;
//     }
//     // clean up 'auto' or other non-integer values
//     x = isNaN(x) ? 0 : x;
//     y = isNaN(y) ? 0 : y;
//     // remove padding from measurement
//     x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
//     y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

//     this.position.x = x;
//     this.position.y = y;
//   };

//   // set settled position, apply padding
//   proto.layoutPosition = function () {
//     var layoutSize = this.layout.size;
//     var style = {};
//     var isOriginLeft = LtrT4s;
//     var isOriginTop = this.layout._getOption('originTop');

//     // x
//     var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
//     var xProperty = isOriginLeft ? 'left' : 'right';
//     var xResetProperty = isOriginLeft ? 'right' : 'left';

//     var x = this.position.x + layoutSize[xPadding];
//     // set in percentage or pixels
//     style[xProperty] = this.getXValue(x);
//     // reset other property
//     style[xResetProperty] = '';

//     // y
//     var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
//     var yProperty = isOriginTop ? 'top' : 'bottom';
//     var yResetProperty = isOriginTop ? 'bottom' : 'top';

//     var y = this.position.y + layoutSize[yPadding];
//     // set in percentage or pixels
//     style[yProperty] = this.getYValue(y);
//     // reset other property
//     style[yResetProperty] = '';

//     this.css(style);
//     this.emitEvent('layout', [this]);
//   };

//   proto.getXValue = function (x) {
//     var isHorizontal = this.layout._getOption('horizontal');
//     return this.layout.options.percentPosition && !isHorizontal
//       ? (x / this.layout.size.width) * 100 + '%'
//       : x + 'px';
//   };

//   proto.getYValue = function (y) {
//     var isHorizontal = this.layout._getOption('horizontal');
//     return this.layout.options.percentPosition && isHorizontal
//       ? (y / this.layout.size.height) * 100 + '%'
//       : y + 'px';
//   };

//   proto._transitionTo = function (x, y) {
//     this.getPosition();
//     // get current x & y from top/left
//     var curX = this.position.x;
//     var curY = this.position.y;

//     var didNotMove = x == this.position.x && y == this.position.y;

//     // save end position
//     this.setPosition(x, y);

//     // if did not move and not transitioning, just go to layout
//     if (didNotMove && !this.isTransitioning) {
//       this.layoutPosition();
//       return;
//     }

//     var transX = x - curX;
//     var transY = y - curY;
//     var transitionStyle = {};
//     transitionStyle.transform = this.getTranslate(transX, transY);

//     this.transition({
//       to: transitionStyle,
//       onTransitionEnd: {
//         transform: this.layoutPosition,
//       },
//       isCleaning: true,
//     });
//   };

//   proto.getTranslate = function (x, y) {
//     // flip cooridinates if origin on right or bottom
//     var isOriginLeft = LtrT4s;
//     var isOriginTop = this.layout._getOption('originTop');
//     x = isOriginLeft ? x : -x;
//     y = isOriginTop ? y : -y;
//     return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
//   };

//   // non transition + transform support
//   proto.goTo = function (x, y) {
//     this.setPosition(x, y);
//     this.layoutPosition();
//   };

//   proto.moveTo = proto._transitionTo;

//   proto.setPosition = function (x, y) {
//     this.position.x = parseFloat(x);
//     this.position.y = parseFloat(y);
//   };

//   // ----- transition ----- //

//   /**
//    * @param {Object} style - CSS
//    * @param {Function} onTransitionEnd
//    */

//   // non transition, just trigger callback
//   proto._nonTransition = function (args) {
//     this.css(args.to);
//     if (args.isCleaning) {
//       this._removeStyles(args.to);
//     }
//     for (var prop in args.onTransitionEnd) {
//       args.onTransitionEnd[prop].call(this);
//     }
//   };

//   /**
//    * proper transition
//    * @param {Object} args - arguments
//    *   @param {Object} to - style to transition to
//    *   @param {Object} from - style to start transition from
//    *   @param {Boolean} isCleaning - removes transition styles after transition
//    *   @param {Function} onTransitionEnd - callback
//    */
//   proto.transition = function (args) {
//     // redirect to nonTransition if no transition duration
//     if (!parseFloat(this.layout.options.transitionDuration)) {
//       this._nonTransition(args);
//       return;
//     }

//     var _transition = this._transn;
//     // keep track of onTransitionEnd callback by css property
//     for (var prop in args.onTransitionEnd) {
//       _transition.onEnd[prop] = args.onTransitionEnd[prop];
//     }
//     // keep track of properties that are transitioning
//     for (prop in args.to) {
//       _transition.ingProperties[prop] = true;
//       // keep track of properties to clean up when transition is done
//       if (args.isCleaning) {
//         _transition.clean[prop] = true;
//       }
//     }

//     // set from styles
//     if (args.from) {
//       this.css(args.from);
//       // force redraw. http://blog.alexmaccaw.com/css-transitions
//       var h = this.element.offsetHeight;
//       // hack for JSHint to hush about unused var
//       h = null;
//     }
//     // enable transition
//     this.enableTransition(args.to);
//     // set styles that are transitioning
//     this.css(args.to);

//     this.isTransitioning = true;
//   };

//   // dash before all cap letters, including first for
//   // WebkitTransform => -webkit-transform
//   function toDashedAll(str) {
//     return str.replace(/([A-Z])/g, function ($1) {
//       return '-' + $1.toLowerCase();
//     });
//   }

//   var transitionProps = 'opacity,' + toDashedAll(transformProperty);

//   proto.enableTransition = function (/* style */) {
//     // HACK changing transitionProperty during a transition
//     // will cause transition to jump
//     if (this.isTransitioning) {
//       return;
//     }

//     // make `transition: foo, bar, baz` from style object
//     // HACK un-comment this when enableTransition can work
//     // while a transition is happening
//     // var transitionValues = [];
//     // for ( var prop in style ) {
//     //   // dash-ify camelCased properties like WebkitTransition
//     //   prop = vendorProperties[ prop ] || prop;
//     //   transitionValues.push( toDashedAll( prop ) );
//     // }
//     // munge number to millisecond, to match stagger
//     var duration = this.layout.options.transitionDuration;
//     duration = typeof duration == 'number' ? duration + 'ms' : duration;
//     // enable transition styles
//     this.css({
//       transitionProperty: transitionProps,
//       transitionDuration: duration,
//       transitionDelay: this.staggerDelay || 0,
//     });
//     // listen for transition end event
//     this.element.addEventListener(transitionEndEvent, this, false);
//   };

//   // ----- events ----- //

//   proto.onwebkitTransitionEnd = function (event) {
//     this.ontransitionend(event);
//   };

//   proto.onotransitionend = function (event) {
//     this.ontransitionend(event);
//   };

//   // properties that I munge to make my life easier
//   var dashedVendorProperties = {
//     '-webkit-transform': 'transform',
//   };

//   proto.ontransitionend = function (event) {
//     // disregard bubbled events from children
//     if (event.target !== this.element) {
//       return;
//     }
//     var _transition = this._transn;
//     // get property name of transitioned property, convert to prefix-free
//     var propertyName =
//       dashedVendorProperties[event.propertyName] || event.propertyName;

//     // remove property that has completed transitioning
//     delete _transition.ingProperties[propertyName];
//     // check if any properties are still transitioning
//     if (isEmptyObj(_transition.ingProperties)) {
//       // all properties have completed transitioning
//       this.disableTransition();
//     }
//     // clean style
//     if (propertyName in _transition.clean) {
//       // clean up style
//       this.element.style[event.propertyName] = '';
//       delete _transition.clean[propertyName];
//     }
//     // trigger onTransitionEnd callback
//     if (propertyName in _transition.onEnd) {
//       var onTransitionEnd = _transition.onEnd[propertyName];
//       onTransitionEnd.call(this);
//       delete _transition.onEnd[propertyName];
//     }

//     this.emitEvent('transitionEnd', [this]);
//   };

//   proto.disableTransition = function () {
//     this.removeTransitionStyles();
//     this.element.removeEventListener(transitionEndEvent, this, false);
//     this.isTransitioning = false;
//   };

//   /**
//    * removes style property from element
//    * @param {Object} style
//    **/
//   proto._removeStyles = function (style) {
//     // clean up transition styles
//     var cleanStyle = {};
//     for (var prop in style) {
//       cleanStyle[prop] = '';
//     }
//     this.css(cleanStyle);
//   };

//   var cleanTransitionStyle = {
//     transitionProperty: '',
//     transitionDuration: '',
//     transitionDelay: '',
//   };

//   proto.removeTransitionStyles = function () {
//     // remove transition
//     this.css(cleanTransitionStyle);
//   };

//   // ----- stagger ----- //

//   proto.stagger = function (delay) {
//     delay = isNaN(delay) ? 0 : delay;
//     this.staggerDelay = delay + 'ms';
//   };

//   // ----- show/hide/remove ----- //

//   // remove element from DOM
//   proto.removeElem = function () {
//     this.element.parentNode.removeChild(this.element);
//     // remove display: none
//     this.css({ display: '' });
//     this.emitEvent('remove', [this]);
//   };

//   proto.remove = function () {
//     // just remove element if no transition support or no transition
//     if (
//       !transitionProperty ||
//       !parseFloat(this.layout.options.transitionDuration)
//     ) {
//       this.removeElem();
//       return;
//     }

//     // start transition
//     this.once('transitionEnd', function () {
//       this.removeElem();
//     });
//     this.hide();
//   };

//   proto.reveal = function () {
//     delete this.isHidden;
//     // remove display: none
//     this.css({ display: '' });

//     var options = this.layout.options;

//     var onTransitionEnd = {};
//     var transitionEndProperty =
//       this.getHideRevealTransitionEndProperty('visibleStyle');
//     onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;

//     this.transition({
//       from: options.hiddenStyle,
//       to: options.visibleStyle,
//       isCleaning: true,
//       onTransitionEnd: onTransitionEnd,
//     });
//   };

//   proto.onRevealTransitionEnd = function () {
//     // check if still visible
//     // during transition, item may have been hidden
//     if (!this.isHidden) {
//       this.emitEvent('reveal');
//     }
//   };

//   /**
//    * get style property use for hide/reveal transition end
//    * @param {String} styleProperty - hiddenStyle/visibleStyle
//    * @returns {String}
//    */
//   proto.getHideRevealTransitionEndProperty = function (styleProperty) {
//     var optionStyle = this.layout.options[styleProperty];
//     // use opacity
//     if (optionStyle.opacity) {
//       return 'opacity';
//     }
//     // get first property
//     for (var prop in optionStyle) {
//       return prop;
//     }
//   };

//   proto.hide = function () {
//     // set flag
//     this.isHidden = true;
//     // remove display: none
//     this.css({ display: '' });

//     var options = this.layout.options;

//     var onTransitionEnd = {};
//     var transitionEndProperty =
//       this.getHideRevealTransitionEndProperty('hiddenStyle');
//     onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;

//     this.transition({
//       from: options.visibleStyle,
//       to: options.hiddenStyle,
//       // keep hidden stuff hidden
//       isCleaning: true,
//       onTransitionEnd: onTransitionEnd,
//     });
//   };

//   proto.onHideTransitionEnd = function () {
//     // check if still hidden
//     // during transition, item may have been un-hidden
//     if (this.isHidden) {
//       this.css({ display: 'none' });
//       this.emitEvent('hide');
//     }
//   };

//   proto.destroy = function () {
//     this.css({
//       position: '',
//       left: '',
//       right: '',
//       top: '',
//       bottom: '',
//       transition: '',
//       transform: '',
//     });
//   };

//   return Item;
// });

// /*!
//  * Outlayer v2.1.1
//  * the brains and guts of a layout library
//  * MIT license
//  */

// (function (window, factory) {
//   'use strict';
//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD - RequireJS
//     define([
//       'ev-emitter/ev-emitter',
//       'get-size/get-size',
//       'fizzy-ui-utils/utils',
//       './item',
//     ], function (EvEmitter, getSize, utils, Item) {
//       return factory(window, EvEmitter, getSize, utils, Item);
//     });
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS - Browserify, Webpack
//     module.exports = factory(
//       window,
//       require('ev-emitter'),
//       require('get-size'),
//       require('fizzy-ui-utils'),
//       require('./item')
//     );
//   } else {
//     // browser global
//     window.Outlayer = factory(
//       window,
//       window.EvEmitter,
//       window.getSize,
//       window.fizzyUIUtils,
//       window.Outlayer.Item
//     );
//   }
// })(window, function factory(window, EvEmitter, getSize, utils, Item) {
//   'use strict';

//   // ----- vars ----- //

//   var console = window.console;
//   var jQuery = window.jQuery;
//   var noop = function () {};

//   // -------------------------- Outlayer -------------------------- //

//   // globally unique identifiers
//   var GUID = 0;
//   // internal store of all Outlayer intances
//   var instances = {};

//   /**
//    * @param {Element, String} element
//    * @param {Object} options
//    * @constructor
//    */
//   function Outlayer(element, options) {
//     var queryElement = utils.getQueryElement(element);
//     if (!queryElement) {
//       if (console) {
//         console.error(
//           'Bad element for ' +
//             this.constructor.namespace +
//             ': ' +
//             (queryElement || element)
//         );
//       }
//       return;
//     }
//     this.element = queryElement;
//     // add jQuery
//     if (jQuery) {
//       this.$element = jQuery(this.element);
//     }

//     // options
//     this.options = utils.extend({}, this.constructor.defaults);
//     this.option(options);

//     // add id for Outlayer.getFromElement
//     var id = ++GUID;
//     this.element.outlayerGUID = id; // expando
//     instances[id] = this; // associate via id

//     // kick it off
//     this._create();

//     var isInitLayout = this._getOption('initLayout');
//     if (isInitLayout) {
//       this.layout();
//     }
//   }

//   // settings are for internal use only
//   Outlayer.namespace = 'outlayer';
//   Outlayer.Item = Item;

//   // default options
//   Outlayer.defaults = {
//     containerStyle: {
//       position: 'relative',
//     },
//     initLayout: true,
//     originLeft: true,
//     originTop: true,
//     resize: true,
//     resizeContainer: true,
//     // item options
//     transitionDuration: '0.4s',
//     hiddenStyle: {
//       opacity: 0,
//       transform: 'scale(0.001)',
//     },
//     visibleStyle: {
//       opacity: 1,
//       transform: 'scale(1)',
//     },
//   };

//   var proto = Outlayer.prototype;
//   // inherit EvEmitter
//   utils.extend(proto, EvEmitter.prototype);

//   /**
//    * set options
//    * @param {Object} opts
//    */
//   proto.option = function (opts) {
//     utils.extend(this.options, opts);
//   };

//   /**
//    * get backwards compatible option value, check old name
//    */
//   proto._getOption = function (option) {
//     var oldOption = this.constructor.compatOptions[option];
//     return oldOption && this.options[oldOption] !== undefined
//       ? this.options[oldOption]
//       : this.options[option];
//   };

//   Outlayer.compatOptions = {
//     // currentName: oldName
//     initLayout: 'isInitLayout',
//     horizontal: 'isHorizontal',
//     layoutInstant: 'isLayoutInstant',
//     originLeft: 'isOriginLeft',
//     originTop: 'isOriginTop',
//     resize: 'isResizeBound',
//     resizeContainer: 'isResizingContainer',
//   };

//   proto._create = function () {
//     // get items from children
//     this.reloadItems();
//     // elements that affect layout, but are not laid out
//     this.stamps = [];
//     this.stamp(this.options.stamp);
//     // set container style
//     utils.extend(this.element.style, this.options.containerStyle);

//     // bind resize method
//     var canBindResize = this._getOption('resize');
//     if (canBindResize) {
//       this.bindResize();
//     }
//   };

//   // goes through all children again and gets bricks in proper order
//   proto.reloadItems = function () {
//     // collection of item elements
//     this.items = this._itemize(this.element.children);
//   };

//   /**
//    * turn elements into Outlayer.Items to be used in layout
//    * @param {Array or NodeList or $html} elems
//    * @returns {Array} items - collection of new Outlayer Items
//    */
//   proto._itemize = function (elems) {
//     var itemElems = this._filterFindItemElements(elems);
//     var Item = this.constructor.Item;

//     // create new Outlayer Items for collection
//     var items = [];
//     for (var i = 0; i < itemElems.length; i++) {
//       var elem = itemElems[i];
//       var item = new Item(elem, this);
//       items.push(item);
//     }

//     return items;
//   };

//   /**
//    * get item elements to be used in layout
//    * @param {Array or NodeList or $html} elems
//    * @returns {Array} items - item elements
//    */
//   proto._filterFindItemElements = function (elems) {
//     return utils.filterFindElements(elems, this.options.itemSelector);
//   };

//   /**
//    * getter method for getting item elements
//    * @returns {Array} elems - collection of item elements
//    */
//   proto.getItemElements = function () {
//     return this.items.map(function (item) {
//       return item.element;
//     });
//   };

//   // ----- init & layout ----- //

//   /**
//    * lays out all items
//    */
//   proto.layout = function () {
//     this._resetLayout();
//     this._manageStamps();

//     // don't animate first layout
//     var layoutInstant = this._getOption('layoutInstant');
//     var isInstant =
//       layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
//     this.layoutItems(this.items, isInstant);

//     // flag for initalized
//     this._isLayoutInited = true;
//   };

//   // _init is alias for layout
//   proto._init = proto.layout;

//   /**
//    * logic before any new layout
//    */
//   proto._resetLayout = function () {
//     this.getSize();
//   };

//   proto.getSize = function () {
//     this.size = getSize(this.element);
//   };

//   /**
//    * get measurement from option, for columnWidth, rowHeight, gutter
//    * if option is String -> get element from selector string, & get size of element
//    * if option is Element -> get size of element
//    * else use option as a number
//    *
//    * @param {String} measurement
//    * @param {String} size - width or height
//    * @private
//    */
//   proto._getMeasurement = function (measurement, size) {
//     var option = this.options[measurement];
//     var elem;
//     if (!option) {
//       // default to 0
//       this[measurement] = 0;
//     } else {
//       // use option as an element
//       if (typeof option == 'string') {
//         elem = this.element.querySelector(option);
//       } else if (option instanceof $html) {
//         elem = option;
//       }
//       // use size of element, if element
//       this[measurement] = elem ? getSize(elem)[size] : option;
//     }
//   };

//   /**
//    * layout a collection of item elements
//    * @api public
//    */
//   proto.layoutItems = function (items, isInstant) {
//     items = this._getItemsForLayout(items);

//     this._layoutItems(items, isInstant);

//     this._postLayout();
//   };

//   /**
//    * get the items to be laid out
//    * you may want to skip over some items
//    * @param {Array} items
//    * @returns {Array} items
//    */
//   proto._getItemsForLayout = function (items) {
//     return items.filter(function (item) {
//       return !item.isIgnored;
//     });
//   };

//   /**
//    * layout items
//    * @param {Array} items
//    * @param {Boolean} isInstant
//    */
//   proto._layoutItems = function (items, isInstant) {
//     this._emitCompleteOnItems('layout', items);

//     if (!items || !items.length) {
//       // no items, emit event with empty array
//       return;
//     }

//     var queue = [];

//     items.forEach(function (item) {
//       // get x/y object from method
//       var position = this._getItemLayoutPosition(item);
//       // enqueue
//       position.item = item;
//       position.isInstant = isInstant || item.isLayoutInstant;
//       queue.push(position);
//     }, this);

//     this._processLayoutQueue(queue);
//   };

//   /**
//    * get item layout position
//    * @param {Outlayer.Item} item
//    * @returns {Object} x and y position
//    */
//   proto._getItemLayoutPosition = function (/* item */) {
//     return {
//       x: 0,
//       y: 0,
//     };
//   };

//   /**
//    * iterate over array and position each item
//    * Reason being - separating this logic prevents 'layout invalidation'
//    * thx @paul_irish
//    * @param {Array} queue
//    */
//   proto._processLayoutQueue = function (queue) {
//     this.updateStagger();
//     queue.forEach(function (obj, i) {
//       this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
//     }, this);
//   };

//   // set stagger from option in milliseconds number
//   proto.updateStagger = function () {
//     var stagger = this.options.stagger;
//     if (stagger === null || stagger === undefined) {
//       this.stagger = 0;
//       return;
//     }
//     this.stagger = getMilliseconds(stagger);
//     return this.stagger;
//   };

//   /**
//    * Sets position of item in DOM
//    * @param {Outlayer.Item} item
//    * @param {Number} x - horizontal position
//    * @param {Number} y - vertical position
//    * @param {Boolean} isInstant - disables transitions
//    */
//   proto._positionItem = function (item, x, y, isInstant, i) {
//     if (isInstant) {
//       // if not transition, just set CSS
//       item.goTo(x, y);
//     } else {
//       item.stagger(i * this.stagger);
//       item.moveTo(x, y);
//     }
//   };

//   /**
//    * Any logic you want to do after each layout,
//    * $window.e. size the container
//    */
//   proto._postLayout = function () {
//     this.resizeContainer();
//   };

//   proto.resizeContainer = function () {
//     var isResizingContainer = this._getOption('resizeContainer');
//     if (!isResizingContainer) {
//       return;
//     }
//     var size = this._getContainerSize();
//     if (size) {
//       this._setContainerMeasure(size.width, true);
//       this._setContainerMeasure(size.height, false);
//     }
//   };

//   /**
//    * Sets width or height of container if returned
//    * @returns {Object} size
//    *   @param {Number} width
//    *   @param {Number} height
//    */
//   proto._getContainerSize = noop;

//   /**
//    * @param {Number} measure - size of width or height
//    * @param {Boolean} isWidth
//    */
//   proto._setContainerMeasure = function (measure, isWidth) {
//     if (measure === undefined) {
//       return;
//     }

//     var elemSize = this.size;
//     // add padding and border width if border box
//     if (elemSize.isBorderBox) {
//       measure += isWidth
//         ? elemSize.paddingLeft +
//           elemSize.paddingRight +
//           elemSize.borderLeftWidth +
//           elemSize.borderRightWidth
//         : elemSize.paddingBottom +
//           elemSize.paddingTop +
//           elemSize.borderTopWidth +
//           elemSize.borderBottomWidth;
//     }

//     measure = Math.max(measure, 0);
//     this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
//   };

//   /**
//    * emit eventComplete on a collection of items events
//    * @param {String} eventName
//    * @param {Array} items - Outlayer.Items
//    */
//   proto._emitCompleteOnItems = function (eventName, items) {
//     var _this = this;
//     function onComplete() {
//       _this.dispatchEvent(eventName + 'Complete', null, [items]);
//     }

//     var count = items.length;
//     if (!items || !count) {
//       onComplete();
//       return;
//     }

//     var doneCount = 0;
//     function tick() {
//       doneCount++;
//       if (doneCount == count) {
//         onComplete();
//       }
//     }

//     // bind callback
//     items.forEach(function (item) {
//       item.once(eventName, tick);
//     });
//   };

//   /**
//    * emits events via EvEmitter and jQuery events
//    * @param {String} type - name of event
//    * @param {Event} event - original event
//    * @param {Array} args - extra arguments
//    */
//   proto.dispatchEvent = function (type, event, args) {
//     // add original event to arguments
//     var emitArgs = event ? [event].concat(args) : args;
//     this.emitEvent(type, emitArgs);

//     if (jQuery) {
//       // set this.$element
//       this.$element = this.$element || jQuery(this.element);
//       if (event) {
//         // create jQuery event
//         var $event = jQuery.Event(event);
//         $event.type = type;
//         this.$element.trigger($event, args);
//       } else {
//         // just trigger with type if no event available
//         this.$element.trigger(type, args);
//       }
//     }
//   };

//   // -------------------------- ignore & stamps -------------------------- //

//   /**
//    * keep item in collection, but do not lay it out
//    * ignored items do not get skipped in layout
//    * @param {Element} elem
//    */
//   proto.ignore = function (elem) {
//     var item = this.getItem(elem);
//     if (item) {
//       item.isIgnored = true;
//     }
//   };

//   /**
//    * return item to layout collection
//    * @param {Element} elem
//    */
//   proto.unignore = function (elem) {
//     var item = this.getItem(elem);
//     if (item) {
//       delete item.isIgnored;
//     }
//   };

//   /**
//    * adds elements to stamps
//    * @param {NodeList, Array, Element, or String} elems
//    */
//   proto.stamp = function (elems) {
//     elems = this._find(elems);
//     if (!elems) {
//       return;
//     }

//     this.stamps = this.stamps.concat(elems);
//     // ignore
//     elems.forEach(this.ignore, this);
//   };

//   /**
//    * removes elements to stamps
//    * @param {NodeList, Array, or Element} elems
//    */
//   proto.unstamp = function (elems) {
//     elems = this._find(elems);
//     if (!elems) {
//       return;
//     }

//     elems.forEach(function (elem) {
//       // filter out removed stamp elements
//       utils.removeFrom(this.stamps, elem);
//       this.unignore(elem);
//     }, this);
//   };

//   /**
//    * finds child elements
//    * @param {NodeList, Array, Element, or String} elems
//    * @returns {Array} elems
//    */
//   proto._find = function (elems) {
//     if (!elems) {
//       return;
//     }
//     // if string, use argument as selector string
//     if (typeof elems == 'string') {
//       elems = this.element.querySelectorAll(elems);
//     }
//     elems = utils.makeArray(elems);
//     return elems;
//   };

//   proto._manageStamps = function () {
//     if (!this.stamps || !this.stamps.length) {
//       return;
//     }

//     this._getBoundingRect();

//     this.stamps.forEach(this._manageStamp, this);
//   };

//   // update boundingLeft / Top
//   proto._getBoundingRect = function () {
//     // get bounding rect for container element
//     var boundingRect = this.element.getBoundingClientRect();
//     var size = this.size;
//     this._boundingRect = {
//       left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
//       top: boundingRect.top + size.paddingTop + size.borderTopWidth,
//       right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
//       bottom:
//         boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth),
//     };
//   };

//   /**
//    * @param {Element} stamp
//    **/
//   proto._manageStamp = noop;

//   /**
//    * get x/y position of element relative to container element
//    * @param {Element} elem
//    * @returns {Object} offset - has left, top, right, bottom
//    */
//   proto._getElementOffset = function (elem) {
//     var boundingRect = elem.getBoundingClientRect();
//     var thisRect = this._boundingRect;
//     var size = getSize(elem);
//     var offset = {
//       left: boundingRect.left - thisRect.left - size.marginLeft,
//       top: boundingRect.top - thisRect.top - size.marginTop,
//       right: thisRect.right - boundingRect.right - size.marginRight,
//       bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom,
//     };
//     return offset;
//   };

//   // -------------------------- resize -------------------------- //

//   // enable event handlers for listeners
//   // $window.e. resize -> onresize
//   proto.handleEvent = utils.handleEvent;

//   /**
//    * Bind layout to window resizing
//    */
//   proto.bindResize = function () {
//     window.addEventListener('resize', this);
//     this.isResizeBound = true;
//   };

//   /**
//    * Unbind layout to window resizing
//    */
//   proto.unbindResize = function () {
//     window.removeEventListener('resize', this);
//     this.isResizeBound = false;
//   };

//   proto.onresize = function () {
//     this.resize();
//   };

//   utils.debounceMethod(Outlayer, 'onresize', 100);

//   proto.resize = function () {
//     // don't trigger if size did not change
//     // or if resize was unbound. See #9
//     if (!this.isResizeBound || !this.needsResizeLayout()) {
//       return;
//     }

//     this.layout();
//   };

//   /**
//    * check if layout is needed post layout
//    * @returns Boolean
//    */
//   proto.needsResizeLayout = function () {
//     var size = getSize(this.element);
//     // check that this.size and size are there
//     // IE8 triggers resize on body size change, so they might not be
//     var hasSizes = this.size && size;
//     return hasSizes && size.innerWidth !== this.size.innerWidth;
//   };

//   // -------------------------- methods -------------------------- //

//   /**
//    * add items to Outlayer instance
//    * @param {Array or NodeList or Element} elems
//    * @returns {Array} items - Outlayer.Items
//    **/
//   proto.addItems = function (elems) {
//     var items = this._itemize(elems);
//     // add items to collection
//     if (items.length) {
//       this.items = this.items.concat(items);
//     }
//     return items;
//   };

//   /**
//    * Layout newly-appended item elements
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.appended = function (elems) {
//     var items = this.addItems(elems);
//     if (!items.length) {
//       return;
//     }
//     // layout and reveal just the new items
//     this.layoutItems(items, true);
//     this.reveal(items);
//   };

//   /**
//    * Layout prepended elements
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.prepended = function (elems) {
//     var items = this._itemize(elems);
//     if (!items.length) {
//       return;
//     }
//     // add items to beginning of collection
//     var previousItems = this.items.slice(0);
//     this.items = items.concat(previousItems);
//     // start new layout
//     this._resetLayout();
//     this._manageStamps();
//     // layout new stuff without transition
//     this.layoutItems(items, true);
//     this.reveal(items);
//     // layout previous items
//     this.layoutItems(previousItems);
//   };

//   /**
//    * reveal a collection of items
//    * @param {Array of Outlayer.Items} items
//    */
//   proto.reveal = function (items) {
//     this._emitCompleteOnItems('reveal', items);
//     if (!items || !items.length) {
//       return;
//     }
//     var stagger = this.updateStagger();
//     items.forEach(function (item, i) {
//       item.stagger(i * stagger);
//       item.reveal();
//     });
//   };

//   /**
//    * hide a collection of items
//    * @param {Array of Outlayer.Items} items
//    */
//   proto.hide = function (items) {
//     this._emitCompleteOnItems('hide', items);
//     if (!items || !items.length) {
//       return;
//     }
//     var stagger = this.updateStagger();
//     items.forEach(function (item, i) {
//       item.stagger(i * stagger);
//       item.hide();
//     });
//   };

//   /**
//    * reveal item elements
//    * @param {Array}, {Element}, {NodeList} items
//    */
//   proto.revealItemElements = function (elems) {
//     var items = this.getItems(elems);
//     this.reveal(items);
//   };

//   /**
//    * hide item elements
//    * @param {Array}, {Element}, {NodeList} items
//    */
//   proto.hideItemElements = function (elems) {
//     var items = this.getItems(elems);
//     this.hide(items);
//   };

//   /**
//    * get Outlayer.Item, given an Element
//    * @param {Element} elem
//    * @param {Function} callback
//    * @returns {Outlayer.Item} item
//    */
//   proto.getItem = function (elem) {
//     // loop through items to get the one that matches
//     for (var i = 0; i < this.items.length; i++) {
//       var item = this.items[i];
//       if (item.element == elem) {
//         // return item
//         return item;
//       }
//     }
//   };

//   /**
//    * get collection of Outlayer.Items, given Elements
//    * @param {Array} elems
//    * @returns {Array} items - Outlayer.Items
//    */
//   proto.getItems = function (elems) {
//     elems = utils.makeArray(elems);
//     var items = [];
//     elems.forEach(function (elem) {
//       var item = this.getItem(elem);
//       if (item) {
//         items.push(item);
//       }
//     }, this);

//     return items;
//   };

//   /**
//    * remove element(s) from instance and DOM
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.remove = function (elems) {
//     var removeItems = this.getItems(elems);

//     this._emitCompleteOnItems('remove', removeItems);

//     // bail if no items to remove
//     if (!removeItems || !removeItems.length) {
//       return;
//     }

//     removeItems.forEach(function (item) {
//       item.remove();
//       // remove item from collection
//       utils.removeFrom(this.items, item);
//     }, this);
//   };

//   // ----- destroy ----- //

//   // remove and disable Outlayer instance
//   proto.destroy = function () {
//     // clean up dynamic styles
//     var style = this.element.style;
//     style.height = '';
//     style.position = '';
//     style.width = '';
//     // destroy items
//     this.items.forEach(function (item) {
//       item.destroy();
//     });

//     this.unbindResize();

//     var id = this.element.outlayerGUID;
//     delete instances[id]; // remove reference to instance by id
//     delete this.element.outlayerGUID;
//     // remove data for jQuery
//     if (jQuery) {
//       jQuery.removeData(this.element, this.constructor.namespace);
//     }
//   };

//   // -------------------------- data -------------------------- //

//   /**
//    * get Outlayer instance from element
//    * @param {Element} elem
//    * @returns {Outlayer}
//    */
//   Outlayer.data = function (elem) {
//     elem = utils.getQueryElement(elem);
//     var id = elem && elem.outlayerGUID;
//     return id && instances[id];
//   };

//   // -------------------------- create Outlayer class -------------------------- //

//   /**
//    * create a layout class
//    * @param {String} namespace
//    */
//   Outlayer.create = function (namespace, options) {
//     // sub-class Outlayer
//     var Layout = subclass(Outlayer);
//     // apply new options and compatOptions
//     Layout.defaults = utils.extend({}, Outlayer.defaults);
//     utils.extend(Layout.defaults, options);
//     Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);

//     Layout.namespace = namespace;

//     Layout.data = Outlayer.data;

//     // sub-class Item
//     Layout.Item = subclass(Item);

//     // -------------------------- declarative -------------------------- //

//     utils.htmlInit(Layout, namespace);

//     // -------------------------- jQuery bridge -------------------------- //

//     // make into jQuery plugin
//     if (jQuery && jQuery.bridget) {
//       jQuery.bridget(namespace, Layout);
//     }

//     return Layout;
//   };

//   function subclass(Parent) {
//     function SubClass() {
//       Parent.apply(this, arguments);
//     }

//     SubClass.prototype = Object.create(Parent.prototype);
//     SubClass.prototype.constructor = SubClass;

//     return SubClass;
//   }

//   // ----- helpers ----- //

//   // how many milliseconds are in each unit
//   var msUnits = {
//     ms: 1,
//     s: 1000,
//   };

//   // munge time-like parameter into millisecond number
//   // '0.4s' -> 40
//   function getMilliseconds(time) {
//     if (typeof time == 'number') {
//       return time;
//     }
//     var matches = time.match(/(^\d*\.?\d*)(\w*)/);
//     var num = matches && matches[1];
//     var unit = matches && matches[2];
//     if (!num.length) {
//       return 0;
//     }
//     num = parseFloat(num);
//     var mult = msUnits[unit] || 1;
//     return num * mult;
//   }

//   // ----- fin ----- //

//   // back in global
//   Outlayer.Item = Item;

//   return Outlayer;
// });

// (function (t, e) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('isotopet4s-layout/js/item', ['outlayer/outlayer'], e);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = e(require('outlayer'));
//   } else {
//     t.isotope = t.isotope || {};
//     t.isotope.Item = e(t.Outlayer);
//   }
// })(window, function (Outlayer) {
//   'use strict';

//   // Define the Item function that extends Outlayer.Item
//   function Item() {
//     Outlayer.Item.apply(this, arguments); // Call the parent constructor
//     this.id = this.layout.itemGUID++; // Set the unique id
//     this.sortData = {}; // Initialize sortData
//   }

//   // Inherit from Outlayer.Item
//   Item.prototype = Object.create(Outlayer.Item.prototype);
//   Item.prototype.constructor = Item;

//   // Update the sort data for the item
//   Item.prototype.updateSortData = function () {
//     if (!this.isIgnored) {
//       this.sortData.id = this.id;
//       this.sortData['original-order'] = this.id;
//       this.sortData.random = Math.random();

//       const sortDataOptions = this.layout.options.getSortData;
//       const sorters = this.layout._sorters;

//       for (const key in sortDataOptions) {
//         const sorter = sorters[key];
//         this.sortData[key] = sorter(this.element, this);
//       }
//     }
//   };

//   // Destroy the item
//   Item.prototype.destroy = function () {
//     Outlayer.Item.prototype.destroy.apply(this, arguments); // Call the parent destroy method
//     this.css({ display: '' }); // Reset CSS display property
//   };

//   return Item; // Export the Item function
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('isotopet4s-layout/js/layout-mode', [
//       'get-size/get-size',
//       'outlayer/outlayer',
//     ], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(require('get-size'), require('outlayer'));
//   } else {
//     global.isotope = global.isotope || {};
//     global.isotope.LayoutMode = factory(global.getSize, global.Outlayer);
//   }
// })(window, function (getSize, Outlayer) {
//   'use strict';

//   class LayoutMode {
//     static modes = {};
//     isotope = {};

//     constructor(isotope) {
//       this.isotope = isotope;
//       if (isotope) {
//         this.options = isotope.options[this.namespace];
//         this.element = isotope.element;
//         this.items = isotope.filteredItems;
//         this.size = isotope.size;
//       }
//     }

//     create(name, options) {
//       class Mode extends LayoutMode {
//         constructor(...args) {
//           super(...args);
//         }
//       }

//       if (options) {
//         Mode.options = options;
//       }

//       Mode.prototype.namespace = name;
//       LayoutMode.modes[name] = Mode;
//       return Mode;
//     }

//     needsVerticalResizeLayout() {
//       const elementSize = getSize(this.isotope.element);
//       return (
//         this.isotope.size &&
//         elementSize &&
//         elementSize.innerHeight !== this.isotope.size.innerHeight
//       );
//     }

//     _getMeasurement(...args) {
//       this.isotope._getMeasurement.apply(this, args);
//     }

//     getColumnWidth() {
//       this.getSegmentSize('column', 'Width');
//     }

//     getRowHeight() {
//       this.getSegmentSize('row', 'Height');
//     }

//     getSegmentSize(segment, dimension) {
//       const measurement = `${segment}${dimension}`;
//       const outerMeasurement = `outer${dimension}`;

//       this._getMeasurement(measurement, outerMeasurement);

//       if (!this[measurement]) {
//         const firstItemSize = this.getFirstItemSize();
//         this[measurement] =
//           (firstItemSize && firstItemSize[outerMeasurement]) ||
//           this.isotope.size[`inner${dimension}`];
//       }
//     }

//     getFirstItemSize() {
//       const firstItem = this.isotope.filteredItems[0];
//       return firstItem && firstItem.element && getSize(firstItem.element);
//     }

//     layout(...args) {
//       this.isotope.layout.apply(this.isotope, args);
//     }

//     getSize() {
//       this.isotope.getSize();
//       this.size = this.isotope.size;
//     }
//   }

//   const methods = [
//     '_resetLayout',
//     '_getItemLayoutPosition',
//     '_manageStamp',
//     '_getContainerSize',
//     '_getElementOffset',
//     'needsResizeLayout',
//     '_getOption',
//   ];

//   methods.forEach((method) => {
//     LayoutMode.prototype[method] = function (...args) {
//       return Outlayer.prototype[method].apply(this.isotope, args);
//     };
//   });

//   return LayoutMode;
// });

// /*!
//  * Masonry v4.2.2
//  * Cascading grid layout library
//  * https://masonry.desandro.com
//  * MIT License
//  * by David DeSandro
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /*globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(['outlayer/outlayer', 'get-size/get-size'], factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(require('outlayer'), require('get-size'));
//   } else {
//     // browser global
//     window.Masonry = factory(window.Outlayer, window.getSize);
//   }
// })(window, function factory(Outlayer, getSize) {
//   'use strict';

//   // -------------------------- masonryDefinition -------------------------- //

//   // create an Outlayer layout class
//   var Masonry = Outlayer.create('masonry');
//   // isFitWidth -> fitWidth
//   Masonry.compatOptions.fitWidth = 'isFitWidth';

//   var proto = Masonry.prototype;

//   proto._resetLayout = function () {
//     this.getSize();
//     this._getMeasurement('columnWidth', 'outerWidth');
//     this._getMeasurement('gutter', 'outerWidth');
//     this.measureColumns();

//     // reset column Y
//     this.colYs = [];
//     for (var i = 0; i < this.cols; i++) {
//       this.colYs.push(0);
//     }

//     this.maxY = 0;
//     this.horizontalColIndex = 0;
//   };

//   proto.measureColumns = function () {
//     this.getContainerWidth();
//     // if columnWidth is 0, default to outerWidth of first item
//     if (!this.columnWidth) {
//       var firstItem = this.items[0];
//       var firstItemElem = firstItem && firstItem.element;
//       // columnWidth fall back to item of first element
//       this.columnWidth =
//         (firstItemElem && getSize(firstItemElem).outerWidth) ||
//         // if first elem has no width, default to size of container
//         this.containerWidth;
//     }

//     var columnWidth = (this.columnWidth += this.gutter);

//     // calculate columns
//     var containerWidth = this.containerWidth + this.gutter;
//     var cols = containerWidth / columnWidth;
//     // fix rounding errors, typically with gutters
//     var excess = columnWidth - (containerWidth % columnWidth);
//     // if overshoot is less than a pixel, round up, otherwise floor it
//     var mathMethod = excess && excess < 1 ? 'round' : 'floor';
//     cols = Math[mathMethod](cols);
//     this.cols = Math.max(cols, 1);
//   };

//   proto.getContainerWidth = function () {
//     // container is parent if fit width
//     var isFitWidth = this._getOption('fitWidth');
//     var container = isFitWidth ? this.element.parentNode : this.element;
//     // check that this.size and size are there
//     // IE8 triggers resize on body size change, so they might not be
//     var size = getSize(container);
//     this.containerWidth = size && size.innerWidth;
//   };

//   proto._getItemLayoutPosition = function (item) {
//     item.getSize();
//     // how many columns does this brick span
//     var remainder = item.size.outerWidth % this.columnWidth;
//     var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
//     // round if off by 1 pixel, otherwise use ceil
//     var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
//     colSpan = Math.min(colSpan, this.cols);
//     // use horizontal or top column position
//     var colPosMethod = this.options.horizontalOrder
//       ? '_getHorizontalColPosition'
//       : '_getTopColPosition';
//     var colPosition = this[colPosMethod](colSpan, item);
//     // position the brick
//     var position = {
//       x: this.columnWidth * colPosition.col,
//       y: colPosition.y,
//     };
//     // apply setHeight to necessary columns
//     var setHeight = colPosition.y + item.size.outerHeight;
//     var setMax = colSpan + colPosition.col;
//     for (var i = colPosition.col; i < setMax; i++) {
//       this.colYs[i] = setHeight;
//     }

//     return position;
//   };

//   proto._getTopColPosition = function (colSpan) {
//     var colGroup = this._getTopColGroup(colSpan);
//     // get the minimum Y value from the columns
//     var minimumY = Math.min.apply(Math, colGroup);

//     return {
//       col: colGroup.indexOf(minimumY),
//       y: minimumY,
//     };
//   };

//   /**
//    * @param {Number} colSpan - number of columns the element spans
//    * @returns {Array} colGroup
//    */
//   proto._getTopColGroup = function (colSpan) {
//     if (colSpan < 2) {
//       // if brick spans only one column, use all the column Ys
//       return this.colYs;
//     }

//     var colGroup = [];
//     // how many different places could this brick fit horizontally
//     var groupCount = this.cols + 1 - colSpan;
//     // for each group potential horizontal position
//     for (var i = 0; i < groupCount; i++) {
//       colGroup[i] = this._getColGroupY(i, colSpan);
//     }
//     return colGroup;
//   };

//   proto._getColGroupY = function (col, colSpan) {
//     if (colSpan < 2) {
//       return this.colYs[col];
//     }
//     // make an array of colY values for that one group
//     var groupColYs = this.colYs.slice(col, col + colSpan);
//     // and get the max value of the array
//     return Math.max.apply(Math, groupColYs);
//   };

//   // get column position based on horizontal index. #873
//   proto._getHorizontalColPosition = function (colSpan, item) {
//     var col = this.horizontalColIndex % this.cols;
//     var isOver = colSpan > 1 && col + colSpan > this.cols;
//     // shift to next row if item can't fit on current row
//     col = isOver ? 0 : col;
//     // don't let zero-size items take up space
//     var hasSize = item.size.outerWidth && item.size.outerHeight;
//     this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

//     return {
//       col: col,
//       y: this._getColGroupY(col, colSpan),
//     };
//   };

//   proto._manageStamp = function (stamp) {
//     var stampSize = getSize(stamp);
//     var offset = this._getElementOffset(stamp);
//     // get the columns that this stamp affects
//     var isOriginLeft = this._getOption('originLeft');
//     var firstX = isOriginLeft ? offset.left : offset.right;
//     var lastX = firstX + stampSize.outerWidth;
//     var firstCol = Math.floor(firstX / this.columnWidth);
//     firstCol = Math.max(0, firstCol);
//     var lastCol = Math.floor(lastX / this.columnWidth);
//     // lastCol should not go over if multiple of columnWidth #425
//     lastCol -= lastX % this.columnWidth ? 0 : 1;
//     lastCol = Math.min(this.cols - 1, lastCol);
//     // set colYs to bottom of the stamp

//     var isOriginTop = this._getOption('originTop');
//     var stampMaxY =
//       (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
//     for (var i = firstCol; i <= lastCol; i++) {
//       this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
//     }
//   };

//   proto._getContainerSize = function () {
//     this.maxY = Math.max.apply(Math, this.colYs);
//     var size = {
//       height: this.maxY,
//     };

//     if (this._getOption('fitWidth')) {
//       size.width = this._getContainerFitWidth();
//     }

//     return size;
//   };

//   proto._getContainerFitWidth = function () {
//     var unusedCols = 0;
//     // count unused columns
//     var i = this.cols;
//     while (--i) {
//       if (this.colYs[i] !== 0) {
//         break;
//       }
//       unusedCols++;
//     }
//     // fit container to columns that have been used
//     return (this.cols - unusedCols) * this.columnWidth - this.gutter;
//   };

//   proto.needsResizeLayout = function () {
//     var previousWidth = this.containerWidth;
//     this.getContainerWidth();
//     return previousWidth != this.containerWidth;
//   };

//   return Masonry;
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('isotopet4s-layout/js/layout-modes/masonry', [
//       '../layout-mode',
//       'masonry-layout/masonry',
//     ], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       require('../layout-mode'),
//       require('masonry-layout')
//     );
//   } else {
//     factory(global.isotope.LayoutMode, global.Masonry);
//   }
// })(window, function (LayoutMode, Masonry) {
//   'use strict';

//   const MasonryLayout = new LayoutMode().create('masonry');
//   const prototype = MasonryLayout.prototype;

//   // Override methods to integrate with Isotope
//   const ignoredMethods = {
//     _getElementOffset: true,
//     layout: true,
//     _getMeasurement: true,
//   };

//   // Copy prototype methods from Masonry while ignoring specified methods
//   for (const method in Masonry.prototype) {
//     if (!ignoredMethods[method]) {
//       prototype[method] = Masonry.prototype[method];
//     }
//   }

//   // Override measureColumns to use filtered items
//   const originalMeasureColumns = prototype.measureColumns;
//   prototype.measureColumns = function () {
//     this.items = this.isotope.filteredItems;
//     originalMeasureColumns.call(this);
//   };

//   // Override _getOption for specific behavior with fitWidth option
//   const originalGetOption = prototype._getOption;
//   prototype._getOption = function (option) {
//     if (option === 'fitWidth') {
//       return this.options.isFitWidth !== undefined
//         ? this.options.isFitWidth
//         : this.options.fitWidth;
//     }
//     return originalGetOption.apply(this.isotope, arguments);
//   };

//   return MasonryLayout;
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('isotopet4s-layout/js/layout-modes/fit-rows', [
//       '../layout-mode',
//     ], factory);
//   } else if (typeof exports === 'object') {
//     module.exports = factory(require('../layout-mode'));
//   } else {
//     factory(global.isotope.LayoutMode);
//   }
// })(window, function (LayoutMode) {
//   'use strict';

//   const FitRowsLayout = new LayoutMode().create('fitRows');
//   const prototype = FitRowsLayout.prototype;

//   // Reset layout dimensions
//   prototype._resetLayout = function () {
//     this.x = 0;
//     this.y = 0;
//     this.maxY = 0;
//     this._getMeasurement('gutter', 'outerWidth');
//   };

//   // Calculate the position of an item in the layout
//   prototype._getItemLayoutPosition = function (item) {
//     item.getSize();
//     const itemWidth = item.size.outerWidth + this.gutter;
//     const containerWidth = this.isotope.size.innerWidth + this.gutter;

//     // Move to the next row if the current item exceeds the container width
//     if (this.x !== 0 && itemWidth + this.x > containerWidth) {
//       this.x = 0;
//       this.y = this.maxY;
//     }

//     const position = {
//       x: this.x,
//       y: this.y,
//     };

//     this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
//     this.x += itemWidth;

//     return position;
//   };

//   // Get the overall container size
//   prototype._getContainerSize = function () {
//     return {
//       height: this.maxY,
//     };
//   };

//   return FitRowsLayout;
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('isotopet4s-layout/js/layout-modes/vertical', [
//       '../layout-mode',
//     ], factory);
//   } else if (typeof module === 'object') {
//     module.exports = factory(require('../layout-mode'));
//   } else {
//     factory(global.isotope.LayoutMode);
//   }
// })(window, function (LayoutMode) {
//   'use strict';

//   const VerticalLayout = new LayoutMode().create('vertical', {
//     horizontalAlignment: 0,
//   });

//   const prototype = VerticalLayout.prototype;

//   // Reset layout position
//   prototype._resetLayout = function () {
//     this.y = 0;
//   };

//   // Calculate the position of an item in the layout
//   prototype._getItemLayoutPosition = function (item) {
//     item.getSize();

//     const alignmentOffset =
//       (this.isotope.size.innerWidth - item.size.outerWidth) *
//       this.options.horizontalAlignment;
//     const positionY = this.y;

//     this.y += item.size.outerHeight;

//     return {
//       x: alignmentOffset,
//       y: positionY,
//     };
//   };

//   // Get the overall container size
//   prototype._getContainerSize = function () {
//     return {
//       height: this.y,
//     };
//   };

//   return VerticalLayout;
// });

// /*!
//  * Outlayer v2.1.1
//  * the brains and guts of a layout library
//  * MIT license
//  */

// (function (window, factory) {
//   'use strict';
//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD - RequireJS
//     define([
//       'ev-emitter/ev-emitter',
//       'get-size/get-size',
//       'fizzy-ui-utils/utils',
//       './item',
//     ], function (EvEmitter, getSize, utils, Item) {
//       return factory(window, EvEmitter, getSize, utils, Item);
//     });
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS - Browserify, Webpack
//     module.exports = factory(
//       window,
//       require('ev-emitter'),
//       require('get-size'),
//       require('fizzy-ui-utils'),
//       require('./item')
//     );
//   } else {
//     // browser global
//     window.Outlayer = factory(
//       window,
//       window.EvEmitter,
//       window.getSize,
//       window.fizzyUIUtils,
//       window.Outlayer.Item
//     );
//   }
// })(window, function factory(window, EvEmitter, getSize, utils, Item) {
//   'use strict';

//   // ----- vars ----- //

//   var console = window.console;
//   var jQuery = window.jQuery;
//   var noop = function () {};

//   // -------------------------- Outlayer -------------------------- //

//   // globally unique identifiers
//   var GUID = 0;
//   // internal store of all Outlayer intances
//   var instances = {};

//   /**
//    * @param {Element, String} element
//    * @param {Object} options
//    * @constructor
//    */
//   function Outlayer(element, options) {
//     var queryElement = utils.getQueryElement(element);
//     if (!queryElement) {
//       if (console) {
//         console.error(
//           'Bad element for ' +
//             this.constructor.namespace +
//             ': ' +
//             (queryElement || element)
//         );
//       }
//       return;
//     }
//     this.element = queryElement;
//     // add jQuery
//     if (jQuery) {
//       this.$element = jQuery(this.element);
//     }

//     // options
//     this.options = utils.extend({}, this.constructor.defaults);
//     this.option(options);

//     // add id for Outlayer.getFromElement
//     var id = ++GUID;
//     this.element.outlayerGUID = id; // expando
//     instances[id] = this; // associate via id

//     // kick it off
//     this._create();

//     var isInitLayout = this._getOption('initLayout');
//     if (isInitLayout) {
//       this.layout();
//     }
//   }

//   // settings are for internal use only
//   Outlayer.namespace = 'outlayer';
//   Outlayer.Item = Item;

//   // default options
//   Outlayer.defaults = {
//     containerStyle: {
//       position: 'relative',
//     },
//     initLayout: true,
//     originLeft: true,
//     originTop: true,
//     resize: true,
//     resizeContainer: true,
//     // item options
//     transitionDuration: '0.4s',
//     hiddenStyle: {
//       opacity: 0,
//       transform: 'scale(0.001)',
//     },
//     visibleStyle: {
//       opacity: 1,
//       transform: 'scale(1)',
//     },
//   };

//   var proto = Outlayer.prototype;
//   // inherit EvEmitter
//   utils.extend(proto, EvEmitter.prototype);

//   /**
//    * set options
//    * @param {Object} opts
//    */
//   proto.option = function (opts) {
//     utils.extend(this.options, opts);
//   };

//   /**
//    * get backwards compatible option value, check old name
//    */
//   proto._getOption = function (option) {
//     var oldOption = this.constructor.compatOptions[option];
//     return oldOption && this.options[oldOption] !== undefined
//       ? this.options[oldOption]
//       : this.options[option];
//   };

//   Outlayer.compatOptions = {
//     // currentName: oldName
//     initLayout: 'isInitLayout',
//     horizontal: 'isHorizontal',
//     layoutInstant: 'isLayoutInstant',
//     originLeft: 'isOriginLeft',
//     originTop: 'isOriginTop',
//     resize: 'isResizeBound',
//     resizeContainer: 'isResizingContainer',
//   };

//   proto._create = function () {
//     // get items from children
//     this.reloadItems();
//     // elements that affect layout, but are not laid out
//     this.stamps = [];
//     this.stamp(this.options.stamp);
//     // set container style
//     utils.extend(this.element.style, this.options.containerStyle);

//     // bind resize method
//     var canBindResize = this._getOption('resize');
//     if (canBindResize) {
//       this.bindResize();
//     }
//   };

//   // goes through all children again and gets bricks in proper order
//   proto.reloadItems = function () {
//     // collection of item elements
//     this.items = this._itemize(this.element.children);
//   };

//   /**
//    * turn elements into Outlayer.Items to be used in layout
//    * @param {Array or NodeList or $html} elems
//    * @returns {Array} items - collection of new Outlayer Items
//    */
//   proto._itemize = function (elems) {
//     var itemElems = this._filterFindItemElements(elems);
//     var Item = this.constructor.Item;

//     // create new Outlayer Items for collection
//     var items = [];
//     for (var i = 0; i < itemElems.length; i++) {
//       var elem = itemElems[i];
//       var item = new Item(elem, this);
//       items.push(item);
//     }

//     return items;
//   };

//   /**
//    * get item elements to be used in layout
//    * @param {Array or NodeList or $html} elems
//    * @returns {Array} items - item elements
//    */
//   proto._filterFindItemElements = function (elems) {
//     return utils.filterFindElements(elems, this.options.itemSelector);
//   };

//   /**
//    * getter method for getting item elements
//    * @returns {Array} elems - collection of item elements
//    */
//   proto.getItemElements = function () {
//     return this.items.map(function (item) {
//       return item.element;
//     });
//   };

//   // ----- init & layout ----- //

//   /**
//    * lays out all items
//    */
//   proto.layout = function () {
//     this._resetLayout();
//     this._manageStamps();

//     // don't animate first layout
//     var layoutInstant = this._getOption('layoutInstant');
//     var isInstant =
//       layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
//     this.layoutItems(this.items, isInstant);

//     // flag for initalized
//     this._isLayoutInited = true;
//   };

//   // _init is alias for layout
//   proto._init = proto.layout;

//   /**
//    * logic before any new layout
//    */
//   proto._resetLayout = function () {
//     this.getSize();
//   };

//   proto.getSize = function () {
//     this.size = getSize(this.element);
//   };

//   /**
//    * get measurement from option, for columnWidth, rowHeight, gutter
//    * if option is String -> get element from selector string, & get size of element
//    * if option is Element -> get size of element
//    * else use option as a number
//    *
//    * @param {String} measurement
//    * @param {String} size - width or height
//    * @private
//    */
//   proto._getMeasurement = function (measurement, size) {
//     var option = this.options[measurement];
//     var elem;
//     if (!option) {
//       // default to 0
//       this[measurement] = 0;
//     } else {
//       // use option as an element
//       if (typeof option == 'string') {
//         elem = this.element.querySelector(option);
//       } else if (option instanceof $html) {
//         elem = option;
//       }
//       // use size of element, if element
//       this[measurement] = elem ? getSize(elem)[size] : option;
//     }
//   };

//   /**
//    * layout a collection of item elements
//    * @api public
//    */
//   proto.layoutItems = function (items, isInstant) {
//     items = this._getItemsForLayout(items);

//     this._layoutItems(items, isInstant);

//     this._postLayout();
//   };

//   /**
//    * get the items to be laid out
//    * you may want to skip over some items
//    * @param {Array} items
//    * @returns {Array} items
//    */
//   proto._getItemsForLayout = function (items) {
//     return items.filter(function (item) {
//       return !item.isIgnored;
//     });
//   };

//   /**
//    * layout items
//    * @param {Array} items
//    * @param {Boolean} isInstant
//    */
//   proto._layoutItems = function (items, isInstant) {
//     this._emitCompleteOnItems('layout', items);

//     if (!items || !items.length) {
//       // no items, emit event with empty array
//       return;
//     }

//     var queue = [];

//     items.forEach(function (item) {
//       // get x/y object from method
//       var position = this._getItemLayoutPosition(item);
//       // enqueue
//       position.item = item;
//       position.isInstant = isInstant || item.isLayoutInstant;
//       queue.push(position);
//     }, this);

//     this._processLayoutQueue(queue);
//   };

//   /**
//    * get item layout position
//    * @param {Outlayer.Item} item
//    * @returns {Object} x and y position
//    */
//   proto._getItemLayoutPosition = function (/* item */) {
//     return {
//       x: 0,
//       y: 0,
//     };
//   };

//   /**
//    * iterate over array and position each item
//    * Reason being - separating this logic prevents 'layout invalidation'
//    * thx @paul_irish
//    * @param {Array} queue
//    */
//   proto._processLayoutQueue = function (queue) {
//     this.updateStagger();
//     queue.forEach(function (obj, i) {
//       this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
//     }, this);
//   };

//   // set stagger from option in milliseconds number
//   proto.updateStagger = function () {
//     var stagger = this.options.stagger;
//     if (stagger === null || stagger === undefined) {
//       this.stagger = 0;
//       return;
//     }
//     this.stagger = getMilliseconds(stagger);
//     return this.stagger;
//   };

//   /**
//    * Sets position of item in DOM
//    * @param {Outlayer.Item} item
//    * @param {Number} x - horizontal position
//    * @param {Number} y - vertical position
//    * @param {Boolean} isInstant - disables transitions
//    */
//   proto._positionItem = function (item, x, y, isInstant, i) {
//     if (isInstant) {
//       // if not transition, just set CSS
//       item.goTo(x, y);
//     } else {
//       item.stagger(i * this.stagger);
//       item.moveTo(x, y);
//     }
//   };

//   /**
//    * Any logic you want to do after each layout,
//    * $window.e. size the container
//    */
//   proto._postLayout = function () {
//     this.resizeContainer();
//   };

//   proto.resizeContainer = function () {
//     var isResizingContainer = this._getOption('resizeContainer');
//     if (!isResizingContainer) {
//       return;
//     }
//     var size = this._getContainerSize();
//     if (size) {
//       this._setContainerMeasure(size.width, true);
//       this._setContainerMeasure(size.height, false);
//     }
//   };

//   /**
//    * Sets width or height of container if returned
//    * @returns {Object} size
//    *   @param {Number} width
//    *   @param {Number} height
//    */
//   proto._getContainerSize = noop;

//   /**
//    * @param {Number} measure - size of width or height
//    * @param {Boolean} isWidth
//    */
//   proto._setContainerMeasure = function (measure, isWidth) {
//     if (measure === undefined) {
//       return;
//     }

//     var elemSize = this.size;
//     // add padding and border width if border box
//     if (elemSize.isBorderBox) {
//       measure += isWidth
//         ? elemSize.paddingLeft +
//           elemSize.paddingRight +
//           elemSize.borderLeftWidth +
//           elemSize.borderRightWidth
//         : elemSize.paddingBottom +
//           elemSize.paddingTop +
//           elemSize.borderTopWidth +
//           elemSize.borderBottomWidth;
//     }

//     measure = Math.max(measure, 0);
//     this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
//   };

//   /**
//    * emit eventComplete on a collection of items events
//    * @param {String} eventName
//    * @param {Array} items - Outlayer.Items
//    */
//   proto._emitCompleteOnItems = function (eventName, items) {
//     var _this = this;
//     function onComplete() {
//       _this.dispatchEvent(eventName + 'Complete', null, [items]);
//     }

//     var count = items.length;
//     if (!items || !count) {
//       onComplete();
//       return;
//     }

//     var doneCount = 0;
//     function tick() {
//       doneCount++;
//       if (doneCount == count) {
//         onComplete();
//       }
//     }

//     // bind callback
//     items.forEach(function (item) {
//       item.once(eventName, tick);
//     });
//   };

//   /**
//    * emits events via EvEmitter and jQuery events
//    * @param {String} type - name of event
//    * @param {Event} event - original event
//    * @param {Array} args - extra arguments
//    */
//   proto.dispatchEvent = function (type, event, args) {
//     // add original event to arguments
//     var emitArgs = event ? [event].concat(args) : args;
//     this.emitEvent(type, emitArgs);

//     if (jQuery) {
//       // set this.$element
//       this.$element = this.$element || jQuery(this.element);
//       if (event) {
//         // create jQuery event
//         var $event = jQuery.Event(event);
//         $event.type = type;
//         this.$element.trigger($event, args);
//       } else {
//         // just trigger with type if no event available
//         this.$element.trigger(type, args);
//       }
//     }
//   };

//   // -------------------------- ignore & stamps -------------------------- //

//   /**
//    * keep item in collection, but do not lay it out
//    * ignored items do not get skipped in layout
//    * @param {Element} elem
//    */
//   proto.ignore = function (elem) {
//     var item = this.getItem(elem);
//     if (item) {
//       item.isIgnored = true;
//     }
//   };

//   /**
//    * return item to layout collection
//    * @param {Element} elem
//    */
//   proto.unignore = function (elem) {
//     var item = this.getItem(elem);
//     if (item) {
//       delete item.isIgnored;
//     }
//   };

//   /**
//    * adds elements to stamps
//    * @param {NodeList, Array, Element, or String} elems
//    */
//   proto.stamp = function (elems) {
//     elems = this._find(elems);
//     if (!elems) {
//       return;
//     }

//     this.stamps = this.stamps.concat(elems);
//     // ignore
//     elems.forEach(this.ignore, this);
//   };

//   /**
//    * removes elements to stamps
//    * @param {NodeList, Array, or Element} elems
//    */
//   proto.unstamp = function (elems) {
//     elems = this._find(elems);
//     if (!elems) {
//       return;
//     }

//     elems.forEach(function (elem) {
//       // filter out removed stamp elements
//       utils.removeFrom(this.stamps, elem);
//       this.unignore(elem);
//     }, this);
//   };

//   /**
//    * finds child elements
//    * @param {NodeList, Array, Element, or String} elems
//    * @returns {Array} elems
//    */
//   proto._find = function (elems) {
//     if (!elems) {
//       return;
//     }
//     // if string, use argument as selector string
//     if (typeof elems == 'string') {
//       elems = this.element.querySelectorAll(elems);
//     }
//     elems = utils.makeArray(elems);
//     return elems;
//   };

//   proto._manageStamps = function () {
//     if (!this.stamps || !this.stamps.length) {
//       return;
//     }

//     this._getBoundingRect();

//     this.stamps.forEach(this._manageStamp, this);
//   };

//   // update boundingLeft / Top
//   proto._getBoundingRect = function () {
//     // get bounding rect for container element
//     var boundingRect = this.element.getBoundingClientRect();
//     var size = this.size;
//     this._boundingRect = {
//       left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
//       top: boundingRect.top + size.paddingTop + size.borderTopWidth,
//       right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
//       bottom:
//         boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth),
//     };
//   };

//   /**
//    * @param {Element} stamp
//    **/
//   proto._manageStamp = noop;

//   /**
//    * get x/y position of element relative to container element
//    * @param {Element} elem
//    * @returns {Object} offset - has left, top, right, bottom
//    */
//   proto._getElementOffset = function (elem) {
//     var boundingRect = elem.getBoundingClientRect();
//     var thisRect = this._boundingRect;
//     var size = getSize(elem);
//     var offset = {
//       left: boundingRect.left - thisRect.left - size.marginLeft,
//       top: boundingRect.top - thisRect.top - size.marginTop,
//       right: thisRect.right - boundingRect.right - size.marginRight,
//       bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom,
//     };
//     return offset;
//   };

//   // -------------------------- resize -------------------------- //

//   // enable event handlers for listeners
//   // $window.e. resize -> onresize
//   proto.handleEvent = utils.handleEvent;

//   /**
//    * Bind layout to window resizing
//    */
//   proto.bindResize = function () {
//     window.addEventListener('resize', this);
//     this.isResizeBound = true;
//   };

//   /**
//    * Unbind layout to window resizing
//    */
//   proto.unbindResize = function () {
//     window.removeEventListener('resize', this);
//     this.isResizeBound = false;
//   };

//   proto.onresize = function () {
//     this.resize();
//   };

//   utils.debounceMethod(Outlayer, 'onresize', 100);

//   proto.resize = function () {
//     // don't trigger if size did not change
//     // or if resize was unbound. See #9
//     if (!this.isResizeBound || !this.needsResizeLayout()) {
//       return;
//     }

//     this.layout();
//   };

//   /**
//    * check if layout is needed post layout
//    * @returns Boolean
//    */
//   proto.needsResizeLayout = function () {
//     var size = getSize(this.element);
//     // check that this.size and size are there
//     // IE8 triggers resize on body size change, so they might not be
//     var hasSizes = this.size && size;
//     return hasSizes && size.innerWidth !== this.size.innerWidth;
//   };

//   // -------------------------- methods -------------------------- //

//   /**
//    * add items to Outlayer instance
//    * @param {Array or NodeList or Element} elems
//    * @returns {Array} items - Outlayer.Items
//    **/
//   proto.addItems = function (elems) {
//     var items = this._itemize(elems);
//     // add items to collection
//     if (items.length) {
//       this.items = this.items.concat(items);
//     }
//     return items;
//   };

//   /**
//    * Layout newly-appended item elements
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.appended = function (elems) {
//     var items = this.addItems(elems);
//     if (!items.length) {
//       return;
//     }
//     // layout and reveal just the new items
//     this.layoutItems(items, true);
//     this.reveal(items);
//   };

//   /**
//    * Layout prepended elements
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.prepended = function (elems) {
//     var items = this._itemize(elems);
//     if (!items.length) {
//       return;
//     }
//     // add items to beginning of collection
//     var previousItems = this.items.slice(0);
//     this.items = items.concat(previousItems);
//     // start new layout
//     this._resetLayout();
//     this._manageStamps();
//     // layout new stuff without transition
//     this.layoutItems(items, true);
//     this.reveal(items);
//     // layout previous items
//     this.layoutItems(previousItems);
//   };

//   /**
//    * reveal a collection of items
//    * @param {Array of Outlayer.Items} items
//    */
//   proto.reveal = function (items) {
//     this._emitCompleteOnItems('reveal', items);
//     if (!items || !items.length) {
//       return;
//     }
//     var stagger = this.updateStagger();
//     items.forEach(function (item, i) {
//       item.stagger(i * stagger);
//       item.reveal();
//     });
//   };

//   /**
//    * hide a collection of items
//    * @param {Array of Outlayer.Items} items
//    */
//   proto.hide = function (items) {
//     this._emitCompleteOnItems('hide', items);
//     if (!items || !items.length) {
//       return;
//     }
//     var stagger = this.updateStagger();
//     items.forEach(function (item, i) {
//       item.stagger(i * stagger);
//       item.hide();
//     });
//   };

//   /**
//    * reveal item elements
//    * @param {Array}, {Element}, {NodeList} items
//    */
//   proto.revealItemElements = function (elems) {
//     var items = this.getItems(elems);
//     this.reveal(items);
//   };

//   /**
//    * hide item elements
//    * @param {Array}, {Element}, {NodeList} items
//    */
//   proto.hideItemElements = function (elems) {
//     var items = this.getItems(elems);
//     this.hide(items);
//   };

//   /**
//    * get Outlayer.Item, given an Element
//    * @param {Element} elem
//    * @param {Function} callback
//    * @returns {Outlayer.Item} item
//    */
//   proto.getItem = function (elem) {
//     // loop through items to get the one that matches
//     for (var i = 0; i < this.items.length; i++) {
//       var item = this.items[i];
//       if (item.element == elem) {
//         // return item
//         return item;
//       }
//     }
//   };

//   /**
//    * get collection of Outlayer.Items, given Elements
//    * @param {Array} elems
//    * @returns {Array} items - Outlayer.Items
//    */
//   proto.getItems = function (elems) {
//     elems = utils.makeArray(elems);
//     var items = [];
//     elems.forEach(function (elem) {
//       var item = this.getItem(elem);
//       if (item) {
//         items.push(item);
//       }
//     }, this);

//     return items;
//   };

//   /**
//    * remove element(s) from instance and DOM
//    * @param {Array or NodeList or Element} elems
//    */
//   proto.remove = function (elems) {
//     var removeItems = this.getItems(elems);

//     this._emitCompleteOnItems('remove', removeItems);

//     // bail if no items to remove
//     if (!removeItems || !removeItems.length) {
//       return;
//     }

//     removeItems.forEach(function (item) {
//       item.remove();
//       // remove item from collection
//       utils.removeFrom(this.items, item);
//     }, this);
//   };

//   // ----- destroy ----- //

//   // remove and disable Outlayer instance
//   proto.destroy = function () {
//     // clean up dynamic styles
//     var style = this.element.style;
//     style.height = '';
//     style.position = '';
//     style.width = '';
//     // destroy items
//     this.items.forEach(function (item) {
//       item.destroy();
//     });

//     this.unbindResize();

//     var id = this.element.outlayerGUID;
//     delete instances[id]; // remove reference to instance by id
//     delete this.element.outlayerGUID;
//     // remove data for jQuery
//     if (jQuery) {
//       jQuery.removeData(this.element, this.constructor.namespace);
//     }
//   };

//   // -------------------------- data -------------------------- //

//   /**
//    * get Outlayer instance from element
//    * @param {Element} elem
//    * @returns {Outlayer}
//    */
//   Outlayer.data = function (elem) {
//     elem = utils.getQueryElement(elem);
//     var id = elem && elem.outlayerGUID;
//     return id && instances[id];
//   };

//   // -------------------------- create Outlayer class -------------------------- //

//   /**
//    * create a layout class
//    * @param {String} namespace
//    */
//   Outlayer.create = function (namespace, options) {
//     // sub-class Outlayer
//     var Layout = subclass(Outlayer);
//     // apply new options and compatOptions
//     Layout.defaults = utils.extend({}, Outlayer.defaults);
//     utils.extend(Layout.defaults, options);
//     Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);

//     Layout.namespace = namespace;

//     Layout.data = Outlayer.data;

//     // sub-class Item
//     Layout.Item = subclass(Item);

//     // -------------------------- declarative -------------------------- //

//     utils.htmlInit(Layout, namespace);

//     // -------------------------- jQuery bridge -------------------------- //

//     // make into jQuery plugin
//     if (jQuery && jQuery.bridget) {
//       jQuery.bridget(namespace, Layout);
//     }

//     return Layout;
//   };

//   function subclass(Parent) {
//     function SubClass() {
//       Parent.apply(this, arguments);
//     }

//     SubClass.prototype = Object.create(Parent.prototype);
//     SubClass.prototype.constructor = SubClass;

//     return SubClass;
//   }

//   // ----- helpers ----- //

//   // how many milliseconds are in each unit
//   var msUnits = {
//     ms: 1,
//     s: 1000,
//   };

//   // munge time-like parameter into millisecond number
//   // '0.4s' -> 40
//   function getMilliseconds(time) {
//     if (typeof time == 'number') {
//       return time;
//     }
//     var matches = time.match(/(^\d*\.?\d*)(\w*)/);
//     var num = matches && matches[1];
//     var unit = matches && matches[2];
//     if (!num.length) {
//       return 0;
//     }
//     num = parseFloat(num);
//     var mult = msUnits[unit] || 1;
//     return num * mult;
//   }

//   // ----- fin ----- //

//   // back in global
//   Outlayer.Item = Item;

//   return Outlayer;
// });

// /**
//  * Rect
//  * low-level utility class for basic geometry
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /* globals define, module */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory();
//   } else {
//     // browser global
//     window.Packery = window.Packery || {};
//     window.Packery.Rect = factory();
//   }
// })(window, function factory() {
//   'use strict';

//   // -------------------------- Rect -------------------------- //

//   function Rect(props) {
//     // extend properties from defaults
//     for (var prop in Rect.defaults) {
//       this[prop] = Rect.defaults[prop];
//     }

//     for (prop in props) {
//       this[prop] = props[prop];
//     }
//   }

//   Rect.defaults = {
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   };

//   var proto = Rect.prototype;

//   /**
//    * Determines whether or not this rectangle wholly encloses another rectangle or point.
//    * @param {Rect} rect
//    * @returns {Boolean}
//    **/
//   proto.contains = function (rect) {
//     // points don't have width or height
//     var otherWidth = rect.width || 0;
//     var otherHeight = rect.height || 0;
//     return (
//       this.x <= rect.x &&
//       this.y <= rect.y &&
//       this.x + this.width >= rect.x + otherWidth &&
//       this.y + this.height >= rect.y + otherHeight
//     );
//   };

//   /**
//    * Determines whether or not the rectangle intersects with another.
//    * @param {Rect} rect
//    * @returns {Boolean}
//    **/
//   proto.overlaps = function (rect) {
//     var thisRight = this.x + this.width;
//     var thisBottom = this.y + this.height;
//     var rectRight = rect.x + rect.width;
//     var rectBottom = rect.y + rect.height;

//     // http://stackoverflow.com/a/306332
//     return (
//       this.x < rectRight &&
//       thisRight > rect.x &&
//       this.y < rectBottom &&
//       thisBottom > rect.y
//     );
//   };

//   /**
//    * @param {Rect} rect - the overlapping rect
//    * @returns {Array} freeRects - rects representing the area around the rect
//    **/
//   proto.getMaximalFreeRects = function (rect) {
//     // if no intersection, return false
//     if (!this.overlaps(rect)) {
//       return false;
//     }

//     var freeRects = [];
//     var freeRect;

//     var thisRight = this.x + this.width;
//     var thisBottom = this.y + this.height;
//     var rectRight = rect.x + rect.width;
//     var rectBottom = rect.y + rect.height;

//     // top
//     if (this.y < rect.y) {
//       freeRect = new Rect({
//         x: this.x,
//         y: this.y,
//         width: this.width,
//         height: rect.y - this.y,
//       });
//       freeRects.push(freeRect);
//     }

//     // right
//     if (thisRight > rectRight) {
//       freeRect = new Rect({
//         x: rectRight,
//         y: this.y,
//         width: thisRight - rectRight,
//         height: this.height,
//       });
//       freeRects.push(freeRect);
//     }

//     // bottom
//     if (thisBottom > rectBottom) {
//       freeRect = new Rect({
//         x: this.x,
//         y: rectBottom,
//         width: this.width,
//         height: thisBottom - rectBottom,
//       });
//       freeRects.push(freeRect);
//     }

//     // left
//     if (this.x < rect.x) {
//       freeRect = new Rect({
//         x: this.x,
//         y: this.y,
//         width: rect.x - this.x,
//         height: this.height,
//       });
//       freeRects.push(freeRect);
//     }

//     return freeRects;
//   };

//   proto.canFit = function (rect) {
//     return this.width >= rect.width && this.height >= rect.height;
//   };

//   return Rect;
// });

// /**
//  * Packer
//  * bin-packing algorithm
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(['./rect'], factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(require('./rect'));
//   } else {
//     // browser global
//     var Packery = (window.Packery = window.Packery || {});
//     Packery.Packer = factory(Packery.Rect);
//   }
// })(window, function factory(Rect) {
//   'use strict';

//   // -------------------------- Packer -------------------------- //

//   /**
//    * @param {Number} width
//    * @param {Number} height
//    * @param {String} sortDirection
//    *   topLeft for vertical, leftTop for horizontal
//    */
//   function Packer(width, height, sortDirection) {
//     this.width = width || 0;
//     this.height = height || 0;
//     this.sortDirection = sortDirection || 'downwardLeftToRight';

//     this.reset();
//   }

//   var proto = Packer.prototype;

//   proto.reset = function () {
//     this.spaces = [];

//     var initialSpace = new Rect({
//       x: 0,
//       y: 0,
//       width: this.width,
//       height: this.height,
//     });

//     this.spaces.push(initialSpace);
//     // set sorter
//     this.sorter = sorters[this.sortDirection] || sorters.downwardLeftToRight;
//   };

//   // change x and y of rect to fit with in Packer's available spaces
//   proto.pack = function (rect) {
//     for (var i = 0; i < this.spaces.length; i++) {
//       var space = this.spaces[i];
//       if (space.canFit(rect)) {
//         this.placeInSpace(rect, space);
//         break;
//       }
//     }
//   };

//   proto.columnPack = function (rect) {
//     for (var i = 0; i < this.spaces.length; i++) {
//       var space = this.spaces[i];
//       var canFitInSpaceColumn =
//         space.x <= rect.x &&
//         space.x + space.width >= rect.x + rect.width &&
//         space.height >= rect.height - 0.01; // fudge number for rounding error
//       if (canFitInSpaceColumn) {
//         rect.y = space.y;
//         this.placed(rect);
//         break;
//       }
//     }
//   };

//   proto.rowPack = function (rect) {
//     for (var i = 0; i < this.spaces.length; i++) {
//       var space = this.spaces[i];
//       var canFitInSpaceRow =
//         space.y <= rect.y &&
//         space.y + space.height >= rect.y + rect.height &&
//         space.width >= rect.width - 0.01; // fudge number for rounding error
//       if (canFitInSpaceRow) {
//         rect.x = space.x;
//         this.placed(rect);
//         break;
//       }
//     }
//   };

//   proto.placeInSpace = function (rect, space) {
//     // place rect in space
//     rect.x = space.x;
//     rect.y = space.y;

//     this.placed(rect);
//   };

//   // update spaces with placed rect
//   proto.placed = function (rect) {
//     // update spaces
//     var revisedSpaces = [];
//     for (var i = 0; i < this.spaces.length; i++) {
//       var space = this.spaces[i];
//       var newSpaces = space.getMaximalFreeRects(rect);
//       // add either the original space or the new spaces to the revised spaces
//       if (newSpaces) {
//         revisedSpaces.push.apply(revisedSpaces, newSpaces);
//       } else {
//         revisedSpaces.push(space);
//       }
//     }

//     this.spaces = revisedSpaces;

//     this.mergeSortSpaces();
//   };

//   proto.mergeSortSpaces = function () {
//     // remove redundant spaces
//     Packer.mergeRects(this.spaces);
//     this.spaces.sort(this.sorter);
//   };

//   // add a space back
//   proto.addSpace = function (rect) {
//     this.spaces.push(rect);
//     this.mergeSortSpaces();
//   };

//   // -------------------------- utility functions -------------------------- //

//   /**
//    * Remove redundant rectangle from array of rectangles
//    * @param {Array} rects: an array of Rects
//    * @returns {Array} rects: an array of Rects
//    **/
//   Packer.mergeRects = function (rects) {
//     var i = 0;
//     var rect = rects[i];

//     rectLoop: while (rect) {
//       var j = 0;
//       var compareRect = rects[i + j];

//       while (compareRect) {
//         if (compareRect == rect) {
//           j++; // next
//         } else if (compareRect.contains(rect)) {
//           // remove rect
//           rects.splice(i, 1);
//           rect = rects[i]; // set next rect
//           continue rectLoop; // bail on compareLoop
//         } else if (rect.contains(compareRect)) {
//           // remove compareRect
//           rects.splice(i + j, 1);
//         } else {
//           j++;
//         }
//         compareRect = rects[i + j]; // set next compareRect
//       }
//       i++;
//       rect = rects[i];
//     }

//     return rects;
//   };

//   // -------------------------- sorters -------------------------- //

//   // functions for sorting rects in order
//   var sorters = {
//     // top down, then left to right
//     downwardLeftToRight: function (a, b) {
//       return a.y - b.y || a.x - b.x;
//     },
//     // left to right, then top down
//     rightwardTopToBottom: function (a, b) {
//       return a.x - b.x || a.y - b.y;
//     },
//   };

//   // --------------------------  -------------------------- //

//   return Packer;
// });

// /**
//  * Packery Item Element
//  **/

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(['outlayer/outlayer', './rect'], factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(require('outlayer'), require('./rect'));
//   } else {
//     // browser global
//     window.Packery.Item = factory(window.Outlayer, window.Packery.Rect);
//   }
// })(window, function factory(Outlayer, Rect) {
//   'use strict';

//   // -------------------------- Item -------------------------- //

//   var docElemStyle = document.documentElement.style;

//   var transformProperty =
//     typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

//   // sub-class Item
//   var Item = function PackeryItem() {
//     Outlayer.Item.apply(this, arguments);
//   };

//   var proto = (Item.prototype = Object.create(Outlayer.Item.prototype));

//   var __create = proto._create;
//   proto._create = function () {
//     // call default _create logic
//     __create.call(this);
//     this.rect = new Rect();
//   };

//   var _moveTo = proto.moveTo;
//   proto.moveTo = function (x, y) {
//     // don't shift 1px while dragging
//     var dx = Math.abs(this.position.x - x);
//     var dy = Math.abs(this.position.y - y);

//     var canHackGoTo =
//       this.layout.dragItemCount &&
//       !this.isPlacing &&
//       !this.isTransitioning &&
//       dx < 1 &&
//       dy < 1;
//     if (canHackGoTo) {
//       this.goTo(x, y);
//       return;
//     }
//     _moveTo.apply(this, arguments);
//   };

//   // -------------------------- placing -------------------------- //

//   proto.enablePlacing = function () {
//     this.removeTransitionStyles();
//     // remove transform property from transition
//     if (this.isTransitioning && transformProperty) {
//       this.element.style[transformProperty] = 'none';
//     }
//     this.isTransitioning = false;
//     this.getSize();
//     this.layout._setRectSize(this.element, this.rect);
//     this.isPlacing = true;
//   };

//   proto.disablePlacing = function () {
//     this.isPlacing = false;
//   };

//   // -----  ----- //

//   // remove element from DOM
//   proto.removeElem = function () {
//     var parent = this.element.parentNode;
//     if (parent) {
//       parent.removeChild(this.element);
//     }
//     // add space back to packer
//     this.layout.packer.addSpace(this.rect);
//     this.emitEvent('remove', [this]);
//   };

//   // ----- dropPlaceholder ----- //

//   proto.showDropPlaceholder = function () {
//     var dropPlaceholder = this.dropPlaceholder;
//     if (!dropPlaceholder) {
//       // create dropPlaceholder
//       dropPlaceholder = this.dropPlaceholder = document.createElement('div');
//       dropPlaceholder.className = 'packery-drop-placeholder';
//       dropPlaceholder.style.position = 'absolute';
//     }

//     dropPlaceholder.style.width = this.size.width + 'px';
//     dropPlaceholder.style.height = this.size.height + 'px';
//     this.positionDropPlaceholder();
//     this.layout.element.appendChild(dropPlaceholder);
//   };

//   proto.positionDropPlaceholder = function () {
//     this.dropPlaceholder.style[transformProperty] =
//       'translate(' + this.rect.x + 'px, ' + this.rect.y + 'px)';
//   };

//   proto.hideDropPlaceholder = function () {
//     // only remove once, #333
//     var parent = this.dropPlaceholder.parentNode;
//     if (parent) {
//       parent.removeChild(this.dropPlaceholder);
//     }
//   };

//   // -----  ----- //

//   return Item;
// });

// !(function (t, e) {
//   'function' == typeof define && define.amd
//     ? define(
//         [
//           'outlayer/outlayer',
//           'get-size/get-size',
//           'desandro-matches-selector/matches-selector',
//           'fizzy-ui-utils/utils',
//           'isotopet4s-layout/js/item',
//           'isotopet4s-layout/js/layout-mode',
//           'isotopet4s-layout/js/layout-modes/masonry',
//           'isotopet4s-layout/js/layout-modes/fit-rows',
//           'isotopet4s-layout/js/layout-modes/vertical',
//         ],
//         function (i, n, o, s, r, a) {
//           return e(t, i, n, o, s, r, a);
//         }
//       )
//     : 'object' == typeof module && module.exports
//     ? (module.exports = e(
//         t,
//         require('outlayer'),
//         require('get-size'),
//         require('desandro-matches-selector'),
//         require('fizzy-ui-utils'),
//         require('isotopet4s-layout/js/item'),
//         require('isotopet4s-layout/js/layout-mode'),
//         require('isotopet4s-layout/js/layout-modes/masonry'),
//         require('isotopet4s-layout/js/layout-modes/fit-rows'),
//         require('isotopet4s-layout/js/layout-modes/vertical')
//       ))
//     : (t.isotope = e(
//         t,
//         t.Outlayer,
//         t.getSize,
//         t.matchesSelector,
//         t.fizzyUIUtils,
//         t.isotope.Item,
//         t.isotope.LayoutMode
//       ));
// })(window, function (t, e, i, n, o, s, r) {
//   var a = t.jQuery_T4NT,
//     l = String.prototype.trim
//       ? function (t) {
//           return t.trim();
//         }
//       : function (t) {
//           return t.replace(/^\s+|\s+$/g, '');
//         },
//     c = e.create('isotope', {
//       layoutMode: 'masonry',
//       isjQuery_T4NTFiltering: !0,
//       sortAscending: !0,
//     });
//   (c.Item = s), (c.LayoutMode = r);
//   var u = c.prototype;
//   (u._create = function () {
//     for (var t in ((this.itemGUID = 0),
//     (this._sorters = {}),
//     this._getSorters(),
//     e.prototype._create.call(this),
//     (this.modes = {}),
//     (this.filteredItems = this.items),
//     (this.sortHistory = ['original-order']),
//     r.modes))
//       this._initLayoutMode(t);
//   }),
//     (u.reloadItems = function () {
//       (this.itemGUID = 0), e.prototype.reloadItems.call(this);
//     }),
//     (u._itemize = function () {
//       for (
//         var t = e.prototype._itemize.apply(this, arguments), i = 0;
//         i < t.length;
//         i++
//       )
//         t[i].id = this.itemGUID++;
//       return this._updateItemsSortData(t), t;
//     }),
//     (u._initLayoutMode = function (t) {
//       var e = r.modes[t],
//         i = this.options[t] || {};
//       (this.options[t] = e.options ? o.extend(e.options, i) : i),
//         (this.modes[t] = new e(this));
//     }),
//     (u.layout = function () {
//       return !this._isLayoutInited && this._getOption('initLayout')
//         ? void this.arrange()
//         : void this._layout();
//     }),
//     (u._layout = function () {
//       var t = this._getIsInstant();
//       this._resetLayout(),
//         this._manageStamps(),
//         this.layoutItems(this.filteredItems, t),
//         (this._isLayoutInited = !0);
//     }),
//     (u.arrange = function (t) {
//       this.option(t), this._getIsInstant();
//       var e = this._filter(this.items);
//       (this.filteredItems = e.matches),
//         this._bindArrangeComplete(),
//         this._isInstant
//           ? this._noTransition(this._hideReveal, [e])
//           : this._hideReveal(e),
//         this._sort(),
//         this._layout();
//     }),
//     (u._init = u.arrange),
//     (u._hideReveal = function (t) {
//       this.reveal(t.needReveal), this.hide(t.needHide);
//     }),
//     (u._getIsInstant = function () {
//       var t = this._getOption('layoutInstant'),
//         e = void 0 !== t ? t : !this._isLayoutInited;
//       return (this._isInstant = e), e;
//     }),
//     (u._bindArrangeComplete = function () {
//       function t() {
//         e &&
//           i &&
//           n &&
//           o.dispatchEvent('arrangeComplete', null, [o.filteredItems]);
//       }
//       var e,
//         i,
//         n,
//         o = this;
//       this.once('layoutComplete', function () {
//         (e = !0), t();
//       }),
//         this.once('hideComplete', function () {
//           (i = !0), t();
//         }),
//         this.once('revealComplete', function () {
//           (n = !0), t();
//         });
//     }),
//     (u._filter = function (t) {
//       var e = this.options.filter;
//       e = e || '*';
//       for (
//         var i = [], n = [], o = [], s = this._getFilterTest(e), r = 0;
//         r < t.length;
//         r++
//       ) {
//         var a = t[r];
//         if (!a.isIgnored) {
//           var l = s(a);
//           l && i.push(a),
//             l && a.isHidden ? n.push(a) : l || a.isHidden || o.push(a);
//         }
//       }
//       return {
//         matches: i,
//         needReveal: n,
//         needHide: o,
//       };
//     }),
//     (u._getFilterTest = function (t) {
//       return a && this.options.isjQuery_T4NTFiltering
//         ? function (e) {
//             return a(e.element).is(t);
//           }
//         : 'function' == typeof t
//         ? function (e) {
//             return t(e.element);
//           }
//         : function (e) {
//             return n(e.element, t);
//           };
//     }),
//     (u.updateSortData = function (t) {
//       var e;
//       t ? ((t = o.makeArray(t)), (e = this.getItems(t))) : (e = this.items),
//         this._getSorters(),
//         this._updateItemsSortData(e);
//     }),
//     (u._getSorters = function () {
//       var t = this.options.getSortData;
//       for (var e in t) {
//         var i = t[e];
//         this._sorters[e] = h(i);
//       }
//     }),
//     (u._updateItemsSortData = function (t) {
//       for (var e = t && t.length, i = 0; e && i < e; i++) t[i].updateSortData();
//     });
//   var h = function (t) {
//     if ('string' != typeof t) return t;
//     var e = l(t).split(' '),
//       i = e[0],
//       n = i.match(/^\[(.+)\]$/),
//       o = (function (t, e) {
//         return t
//           ? function (e) {
//               return e.getAttribute(t);
//             }
//           : function (t) {
//               var i = t.querySelector(e);
//               return i && i.textContent;
//             };
//       })(n && n[1], i),
//       s = c.sortDataParsers[e[1]];
//     return s
//       ? function (t) {
//           return t && s(o(t));
//         }
//       : function (t) {
//           return t && o(t);
//         };
//   };
//   (c.sortDataParsers = {
//     parseInt: function (t) {
//       return parseInt(t, 10);
//     },
//     parseFloat: function (t) {
//       return parseFloat(t);
//     },
//   }),
//     (u._sort = function () {
//       if (this.options.sortBy) {
//         var t = o.makeArray(this.options.sortBy);
//         this._getIsSameSortBy(t) ||
//           (this.sortHistory = t.concat(this.sortHistory));
//         var e = (function (t, e) {
//           return function (i, n) {
//             for (var o = 0; o < t.length; o++) {
//               var s = t[o],
//                 r = i.sortData[s],
//                 a = n.sortData[s];
//               if (r > a || r < a)
//                 return (
//                   (r > a ? 1 : -1) * ((void 0 !== e[s] ? e[s] : e) ? 1 : -1)
//                 );
//             }
//             return 0;
//           };
//         })(this.sortHistory, this.options.sortAscending);
//         this.filteredItems.sort(e);
//       }
//     }),
//     (u._getIsSameSortBy = function (t) {
//       for (var e = 0; e < t.length; e++)
//         if (t[e] != this.sortHistory[e]) return !1;
//       return !0;
//     }),
//     (u._mode = function () {
//       var t = this.options.layoutMode,
//         e = this.modes[t];
//       if (!e) throw new Error('No layout mode: ' + t);
//       return (e.options = this.options[t]), e;
//     }),
//     (u._resetLayout = function () {
//       e.prototype._resetLayout.call(this), this._mode()._resetLayout();
//     }),
//     (u._getItemLayoutPosition = function (t) {
//       return this._mode()._getItemLayoutPosition(t);
//     }),
//     (u._manageStamp = function (t) {
//       this._mode()._manageStamp(t);
//     }),
//     (u._getContainerSize = function () {
//       return this._mode()._getContainerSize();
//     }),
//     (u.needsResizeLayout = function () {
//       return this._mode().needsResizeLayout();
//     }),
//     (u.appended = function (t) {
//       var e = this.addItems(t);
//       if (e.length) {
//         var i = this._filterRevealAdded(e);
//         this.filteredItems = this.filteredItems.concat(i);
//       }
//     }),
//     (u.prepended = function (t) {
//       var e = this._itemize(t);
//       if (e.length) {
//         this._resetLayout(), this._manageStamps();
//         var i = this._filterRevealAdded(e);
//         this.layoutItems(this.filteredItems),
//           (this.filteredItems = i.concat(this.filteredItems)),
//           (this.items = e.concat(this.items));
//       }
//     }),
//     (u._filterRevealAdded = function (t) {
//       var e = this._filter(t);
//       return (
//         this.hide(e.needHide),
//         this.reveal(e.matches),
//         this.layoutItems(e.matches, !0),
//         e.matches
//       );
//     }),
//     (u.insert = function (t) {
//       var e = this.addItems(t);
//       if (e.length) {
//         var i,
//           n,
//           o = e.length;
//         for (i = 0; i < o; i++) (n = e[i]), this.element.appendChild(n.element);
//         var s = this._filter(e).matches;
//         for (i = 0; i < o; i++) e[i].isLayoutInstant = !0;
//         for (this.arrange(), i = 0; i < o; i++) delete e[i].isLayoutInstant;
//         this.reveal(s);
//       }
//     });
//   var d = u.remove;
//   return (
//     (u.remove = function (t) {
//       t = o.makeArray(t);
//       var e = this.getItems(t);
//       d.call(this, t);
//       for (var i = e && e.length, n = 0; i && n < i; n++) {
//         var s = e[n];
//         o.removeFrom(this.filteredItems, s);
//       }
//     }),
//     (u.shuffle = function () {
//       for (var t = 0; t < this.items.length; t++)
//         this.items[t].sortData.random = Math.random();
//       (this.options.sortBy = 'random'), this._sort(), this._layout();
//     }),
//     (u._noTransition = function (t, e) {
//       var i = this.options.transitionDuration;
//       this.options.transitionDuration = 0;
//       var n = t.apply(this, e);
//       return (this.options.transitionDuration = i), n;
//     }),
//     (u.getFilteredItemElements = function () {
//       return this.filteredItems.map(function (t) {
//         return t.element;
//       });
//     }),
//     c
//   );
// });

// /*!
//  * Packery v2.1.2
//  * Gapless, draggable grid layouts
//  *
//  * Licensed GPLv3 for open source use
//  * or Packery Commercial License for commercial use
//  *
//  * http://packery.metafizzy.co
//  * Copyright 2013-2018 Metafizzy
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /* globals define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define([
//       'get-size/get-size',
//       'outlayer/outlayer',
//       './rect',
//       './packer',
//       './item',
//     ], factory);
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(
//       require('get-size'),
//       require('outlayer'),
//       require('./rect'),
//       require('./packer'),
//       require('./item')
//     );
//   } else {
//     // browser global
//     window.Packery = factory(
//       window.getSize,
//       window.Outlayer,
//       window.Packery.Rect,
//       window.Packery.Packer,
//       window.Packery.Item
//     );
//   }
// })(window, function factory(getSize, Outlayer, Rect, Packer, Item) {
//   'use strict';

//   // ----- Rect ----- //

//   // allow for pixel rounding errors IE8-IE11 & Firefox; #227
//   Rect.prototype.canFit = function (rect) {
//     return this.width >= rect.width - 1 && this.height >= rect.height - 1;
//   };

//   // -------------------------- Packery -------------------------- //

//   // create an Outlayer layout class
//   var Packery = Outlayer.create('packery');
//   Packery.Item = Item;

//   var proto = Packery.prototype;

//   proto._create = function () {
//     // call super
//     Outlayer.prototype._create.call(this);

//     // initial properties
//     this.packer = new Packer();
//     // packer for drop targets
//     this.shiftPacker = new Packer();
//     this.isEnabled = true;

//     this.dragItemCount = 0;

//     // create drag handlers
//     var _this = this;
//     this.handleDraggabilly = {
//       dragStart: function () {
//         _this.itemDragStart(this.element);
//       },
//       dragMove: function () {
//         _this.itemDragMove(this.element, this.position.x, this.position.y);
//       },
//       dragEnd: function () {
//         _this.itemDragEnd(this.element);
//       },
//     };

//     this.handleUIDraggable = {
//       start: function handleUIDraggableStart(event, ui) {
//         // HTML5 may trigger dragstart, dismiss HTML5 dragging
//         if (!ui) {
//           return;
//         }
//         _this.itemDragStart(event.currentTarget);
//       },
//       drag: function handleUIDraggableDrag(event, ui) {
//         if (!ui) {
//           return;
//         }
//         _this.itemDragMove(
//           event.currentTarget,
//           ui.position.left,
//           ui.position.top
//         );
//       },
//       stop: function handleUIDraggableStop(event, ui) {
//         if (!ui) {
//           return;
//         }
//         _this.itemDragEnd(event.currentTarget);
//       },
//     };
//   };

//   // ----- init & layout ----- //

//   /**
//    * logic before any new layout
//    */
//   proto._resetLayout = function () {
//     this.getSize();

//     this._getMeasurements();

//     // reset packer
//     var width, height, sortDirection;
//     // packer settings, if horizontal or vertical
//     if (this._getOption('horizontal')) {
//       width = Infinity;
//       height = this.size.innerHeight + this.gutter;
//       sortDirection = 'rightwardTopToBottom';
//     } else {
//       width = this.size.innerWidth + this.gutter;
//       height = Infinity;
//       sortDirection = 'downwardLeftToRight';
//     }

//     this.packer.width = this.shiftPacker.width = width;
//     this.packer.height = this.shiftPacker.height = height;
//     this.packer.sortDirection = this.shiftPacker.sortDirection = sortDirection;

//     this.packer.reset();

//     // layout
//     this.maxY = 0;
//     this.maxX = 0;
//   };

//   /**
//    * update columnWidth, rowHeight, & gutter
//    * @private
//    */
//   proto._getMeasurements = function () {
//     this._getMeasurement('columnWidth', 'width');
//     this._getMeasurement('rowHeight', 'height');
//     this._getMeasurement('gutter', 'width');
//   };

//   proto._getItemLayoutPosition = function (item) {
//     this._setRectSize(item.element, item.rect);
//     if (this.isShifting || this.dragItemCount > 0) {
//       var packMethod = this._getPackMethod();
//       this.packer[packMethod](item.rect);
//     } else {
//       this.packer.pack(item.rect);
//     }

//     this._setMaxXY(item.rect);
//     return item.rect;
//   };

//   proto.shiftLayout = function () {
//     this.isShifting = true;
//     this.layout();
//     delete this.isShifting;
//   };

//   proto._getPackMethod = function () {
//     return this._getOption('horizontal') ? 'rowPack' : 'columnPack';
//   };

//   /**
//    * set max X and Y value, for size of container
//    * @param {Packery.Rect} rect
//    * @private
//    */
//   proto._setMaxXY = function (rect) {
//     this.maxX = Math.max(rect.x + rect.width, this.maxX);
//     this.maxY = Math.max(rect.y + rect.height, this.maxY);
//   };

//   /**
//    * set the width and height of a rect, applying columnWidth and rowHeight
//    * @param {Element} elem
//    * @param {Packery.Rect} rect
//    */
//   proto._setRectSize = function (elem, rect) {
//     var size = getSize(elem);
//     var w = size.outerWidth;
//     var h = size.outerHeight;
//     // size for columnWidth and rowHeight, if available
//     // only check if size is non-zero, #177
//     if (w || h) {
//       w = this._applyGridGutter(w, this.columnWidth);
//       h = this._applyGridGutter(h, this.rowHeight);
//     }
//     // rect must fit in packer
//     rect.width = Math.min(w, this.packer.width);
//     rect.height = Math.min(h, this.packer.height);
//   };

//   /**
//    * fits item to columnWidth/rowHeight and adds gutter
//    * @param {Number} measurement - item width or height
//    * @param {Number} gridSize - columnWidth or rowHeight
//    * @returns measurement
//    */
//   proto._applyGridGutter = function (measurement, gridSize) {
//     // just add gutter if no gridSize
//     if (!gridSize) {
//       return measurement + this.gutter;
//     }
//     gridSize += this.gutter;
//     // fit item to columnWidth/rowHeight
//     var remainder = measurement % gridSize;
//     var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
//     measurement = Math[mathMethod](measurement / gridSize) * gridSize;
//     return measurement;
//   };

//   proto._getContainerSize = function () {
//     if (this._getOption('horizontal')) {
//       return {
//         width: this.maxX - this.gutter,
//       };
//     } else {
//       return {
//         height: this.maxY - this.gutter,
//       };
//     }
//   };

//   // -------------------------- stamp -------------------------- //

//   /**
//    * makes space for element
//    * @param {Element} elem
//    */
//   proto._manageStamp = function (elem) {
//     var item = this.getItem(elem);
//     var rect;
//     if (item && item.isPlacing) {
//       rect = item.rect;
//     } else {
//       var offset = this._getElementOffset(elem);
//       rect = new Rect({
//         x: this._getOption('originLeft') ? offset.left : offset.right,
//         y: this._getOption('originTop') ? offset.top : offset.bottom,
//       });
//     }

//     this._setRectSize(elem, rect);
//     // save its space in the packer
//     this.packer.placed(rect);
//     this._setMaxXY(rect);
//   };

//   // -------------------------- methods -------------------------- //

//   function verticalSorter(a, b) {
//     return a.position.y - b.position.y || a.position.x - b.position.x;
//   }

//   function horizontalSorter(a, b) {
//     return a.position.x - b.position.x || a.position.y - b.position.y;
//   }

//   proto.sortItemsByPosition = function () {
//     var sorter = this._getOption('horizontal')
//       ? horizontalSorter
//       : verticalSorter;
//     this.items.sort(sorter);
//   };

//   /**
//    * Fit item element in its current position
//    * Packery will position elements around it
//    * useful for expanding elements
//    *
//    * @param {Element} elem
//    * @param {Number} x - horizontal destination position, optional
//    * @param {Number} y - vertical destination position, optional
//    */
//   proto.fit = function (elem, x, y) {
//     var item = this.getItem(elem);
//     if (!item) {
//       return;
//     }

//     // stamp item to get it out of layout
//     this.stamp(item.element);
//     // set placing flag
//     item.enablePlacing();
//     this.updateShiftTargets(item);
//     // fall back to current position for fitting
//     x = x === undefined ? item.rect.x : x;
//     y = y === undefined ? item.rect.y : y;
//     // position it best at its destination
//     this.shift(item, x, y);
//     this._bindFitEvents(item);
//     item.moveTo(item.rect.x, item.rect.y);
//     // layout everything else
//     this.shiftLayout();
//     // return back to regularly scheduled programming
//     this.unstamp(item.element);
//     this.sortItemsByPosition();
//     item.disablePlacing();
//   };

//   /**
//    * emit event when item is fit and other items are laid out
//    * @param {Packery.Item} item
//    * @private
//    */
//   proto._bindFitEvents = function (item) {
//     var _this = this;
//     var ticks = 0;
//     function onLayout() {
//       ticks++;
//       if (ticks != 2) {
//         return;
//       }
//       _this.dispatchEvent('fitComplete', null, [item]);
//     }
//     // when item is laid out
//     item.once('layout', onLayout);
//     // when all items are laid out
//     this.once('layoutComplete', onLayout);
//   };

//   // -------------------------- resize -------------------------- //

//   // debounced, layout on resize
//   proto.resize = function () {
//     // don't trigger if size did not change
//     // or if resize was unbound. See #285, outlayer#9
//     if (!this.isResizeBound || !this.needsResizeLayout()) {
//       return;
//     }

//     if (this.options.shiftPercentResize) {
//       this.resizeShiftPercentLayout();
//     } else {
//       this.layout();
//     }
//   };

//   /**
//    * check if layout is needed post layout
//    * @returns Boolean
//    */
//   proto.needsResizeLayout = function () {
//     var size = getSize(this.element);
//     var innerSize = this._getOption('horizontal')
//       ? 'innerHeight'
//       : 'innerWidth';
//     return size[innerSize] != this.size[innerSize];
//   };

//   proto.resizeShiftPercentLayout = function () {
//     var items = this._getItemsForLayout(this.items);

//     var isHorizontal = this._getOption('horizontal');
//     var coord = isHorizontal ? 'y' : 'x';
//     var measure = isHorizontal ? 'height' : 'width';
//     var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
//     var innerSize = isHorizontal ? 'innerHeight' : 'innerWidth';

//     // proportional re-align items
//     var previousSegment = this[segmentName];
//     previousSegment = previousSegment && previousSegment + this.gutter;

//     if (previousSegment) {
//       this._getMeasurements();
//       var currentSegment = this[segmentName] + this.gutter;
//       items.forEach(function (item) {
//         var seg = Math.round(item.rect[coord] / previousSegment);
//         item.rect[coord] = seg * currentSegment;
//       });
//     } else {
//       var currentSize = getSize(this.element)[innerSize] + this.gutter;
//       var previousSize = this.packer[measure];
//       items.forEach(function (item) {
//         item.rect[coord] = (item.rect[coord] / previousSize) * currentSize;
//       });
//     }

//     this.shiftLayout();
//   };

//   // -------------------------- drag -------------------------- //

//   /**
//    * handle an item drag start event
//    * @param {Element} elem
//    */
//   proto.itemDragStart = function (elem) {
//     if (!this.isEnabled) {
//       return;
//     }
//     this.stamp(elem);
//     // this.ignore( elem );
//     var item = this.getItem(elem);
//     if (!item) {
//       return;
//     }

//     item.enablePlacing();
//     item.showDropPlaceholder();
//     this.dragItemCount++;
//     this.updateShiftTargets(item);
//   };

//   proto.updateShiftTargets = function (dropItem) {
//     this.shiftPacker.reset();

//     // pack stamps
//     this._getBoundingRect();
//     var isOriginLeft = this._getOption('originLeft');
//     var isOriginTop = this._getOption('originTop');
//     this.stamps.forEach(function (stamp) {
//       // ignore dragged item
//       var item = this.getItem(stamp);
//       if (item && item.isPlacing) {
//         return;
//       }
//       var offset = this._getElementOffset(stamp);
//       var rect = new Rect({
//         x: isOriginLeft ? offset.left : offset.right,
//         y: isOriginTop ? offset.top : offset.bottom,
//       });
//       this._setRectSize(stamp, rect);
//       // save its space in the packer
//       this.shiftPacker.placed(rect);
//     }, this);

//     // reset shiftTargets
//     var isHorizontal = this._getOption('horizontal');
//     var segmentName = isHorizontal ? 'rowHeight' : 'columnWidth';
//     var measure = isHorizontal ? 'height' : 'width';

//     this.shiftTargetKeys = [];
//     this.shiftTargets = [];
//     var boundsSize;
//     var segment = this[segmentName];
//     segment = segment && segment + this.gutter;

//     if (segment) {
//       var segmentSpan = Math.ceil(dropItem.rect[measure] / segment);
//       var segs = Math.floor(
//         (this.shiftPacker[measure] + this.gutter) / segment
//       );
//       boundsSize = (segs - segmentSpan) * segment;
//       // add targets on top
//       for (var i = 0; i < segs; i++) {
//         var initialX = isHorizontal ? 0 : i * segment;
//         var initialY = isHorizontal ? i * segment : 0;
//         this._addShiftTarget(initialX, initialY, boundsSize);
//       }
//     } else {
//       boundsSize =
//         this.shiftPacker[measure] + this.gutter - dropItem.rect[measure];
//       this._addShiftTarget(0, 0, boundsSize);
//     }

//     // pack each item to measure where shiftTargets are
//     var items = this._getItemsForLayout(this.items);
//     var packMethod = this._getPackMethod();
//     items.forEach(function (item) {
//       var rect = item.rect;
//       this._setRectSize(item.element, rect);
//       this.shiftPacker[packMethod](rect);

//       // add top left corner
//       this._addShiftTarget(rect.x, rect.y, boundsSize);
//       // add bottom left / top right corner
//       var cornerX = isHorizontal ? rect.x + rect.width : rect.x;
//       var cornerY = isHorizontal ? rect.y : rect.y + rect.height;
//       this._addShiftTarget(cornerX, cornerY, boundsSize);

//       if (segment) {
//         // add targets for each column on bottom / row on right
//         var segSpan = Math.round(rect[measure] / segment);
//         for (var i = 1; i < segSpan; i++) {
//           var segX = isHorizontal ? cornerX : rect.x + segment * i;
//           var segY = isHorizontal ? rect.y + segment * i : cornerY;
//           this._addShiftTarget(segX, segY, boundsSize);
//         }
//       }
//     }, this);
//   };

//   proto._addShiftTarget = function (x, y, boundsSize) {
//     var checkCoord = this._getOption('horizontal') ? y : x;
//     if (checkCoord !== 0 && checkCoord > boundsSize) {
//       return;
//     }
//     // create string for a key, easier to keep track of what targets
//     var key = x + ',' + y;
//     var hasKey = this.shiftTargetKeys.indexOf(key) != -1;
//     if (hasKey) {
//       return;
//     }
//     this.shiftTargetKeys.push(key);
//     this.shiftTargets.push({ x: x, y: y });
//   };

//   // -------------------------- drop -------------------------- //

//   proto.shift = function (item, x, y) {
//     var shiftPosition;
//     var minDistance = Infinity;
//     var position = { x: x, y: y };
//     this.shiftTargets.forEach(function (target) {
//       var distance = getDistance(target, position);
//       if (distance < minDistance) {
//         shiftPosition = target;
//         minDistance = distance;
//       }
//     });
//     item.rect.x = shiftPosition.x;
//     item.rect.y = shiftPosition.y;
//   };

//   function getDistance(a, b) {
//     var dx = b.x - a.x;
//     var dy = b.y - a.y;
//     return Math.sqrt(dx * dx + dy * dy);
//   }

//   // -------------------------- drag move -------------------------- //

//   var DRAG_THROTTLE_TIME = 120;

//   /**
//    * handle an item drag move event
//    * @param {Element} elem
//    * @param {Number} x - horizontal change in position
//    * @param {Number} y - vertical change in position
//    */
//   proto.itemDragMove = function (elem, x, y) {
//     var item = this.isEnabled && this.getItem(elem);
//     if (!item) {
//       return;
//     }

//     x -= this.size.paddingLeft;
//     y -= this.size.paddingTop;

//     var _this = this;
//     function onDrag() {
//       _this.shift(item, x, y);
//       item.positionDropPlaceholder();
//       _this.layout();
//     }

//     // throttle
//     var now = new Date();
//     var isThrottled =
//       this._itemDragTime && now - this._itemDragTime < DRAG_THROTTLE_TIME;
//     if (isThrottled) {
//       clearTimeout(this.dragTimeout);
//       this.dragTimeout = setTimeout(onDrag, DRAG_THROTTLE_TIME);
//     } else {
//       onDrag();
//       this._itemDragTime = now;
//     }
//   };

//   // -------------------------- drag end -------------------------- //

//   /**
//    * handle an item drag end event
//    * @param {Element} elem
//    */
//   proto.itemDragEnd = function (elem) {
//     var item = this.isEnabled && this.getItem(elem);
//     if (!item) {
//       return;
//     }

//     clearTimeout(this.dragTimeout);
//     item.element.classList.add('is-positioning-post-drag');

//     var completeCount = 0;
//     var _this = this;
//     function onDragEndLayoutComplete() {
//       completeCount++;
//       if (completeCount != 2) {
//         return;
//       }
//       // reset drag item
//       item.element.classList.remove('is-positioning-post-drag');
//       item.hideDropPlaceholder();
//       _this.dispatchEvent('dragItemPositioned', null, [item]);
//     }

//     item.once('layout', onDragEndLayoutComplete);
//     this.once('layoutComplete', onDragEndLayoutComplete);
//     item.moveTo(item.rect.x, item.rect.y);
//     this.layout();
//     this.dragItemCount = Math.max(0, this.dragItemCount - 1);
//     this.sortItemsByPosition();
//     item.disablePlacing();
//     this.unstamp(item.element);
//   };

//   /**
//    * binds Draggabilly events
//    * @param {Draggabilly} draggie
//    */
//   proto.bindDraggabillyEvents = function (draggie) {
//     this._bindDraggabillyEvents(draggie, 'on');
//   };

//   proto.unbindDraggabillyEvents = function (draggie) {
//     this._bindDraggabillyEvents(draggie, 'off');
//   };

//   proto._bindDraggabillyEvents = function (draggie, method) {
//     var handlers = this.handleDraggabilly;
//     draggie[method]('dragStart', handlers.dragStart);
//     draggie[method]('dragMove', handlers.dragMove);
//     draggie[method]('dragEnd', handlers.dragEnd);
//   };

//   /**
//    * binds jQuery UI Draggable events
//    * @param {jQuery} $elems
//    */
//   proto.bindUIDraggableEvents = function ($elems) {
//     this._bindUIDraggableEvents($elems, 'on');
//   };

//   proto.unbindUIDraggableEvents = function ($elems) {
//     this._bindUIDraggableEvents($elems, 'off');
//   };

//   proto._bindUIDraggableEvents = function ($elems, method) {
//     var handlers = this.handleUIDraggable;
//     $elems[method]('dragstart', handlers.start)
//       [method]('drag', handlers.drag)
//       [method]('dragstop', handlers.stop);
//   };

//   // ----- destroy ----- //

//   var _destroy = proto.destroy;
//   proto.destroy = function () {
//     _destroy.apply(this, arguments);
//     // disable flag; prevent drag events from triggering. #72
//     this.isEnabled = false;
//   };

//   // -----  ----- //

//   Packery.Rect = Rect;
//   Packery.Packer = Packer;

//   return Packery;
// });

// (function (global, factory) {
//   'use strict';

//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define(['isotopet4s-layout/js/layout-mode', 'packery/js/packery'], factory);
//   } else if (isCommonJS) {
//     module.exports = factory(
//       require('isotopet4s-layout/js/layout-mode'),
//       require('packery')
//     );
//   } else {
//     factory(global.isotope.LayoutMode, global.Packery);
//   }
// })(window, function (LayoutMode, Packery) {
//   'use strict';

//   const PackeryLayoutMode = new LayoutMode().create('packery');
//   const prototype = PackeryLayoutMode.prototype;

//   // Copy prototype methods from Packery, except for the specified keys
//   const excludedMethods = {
//     _getElementOffset: true,
//     _getMeasurement: true,
//   };

//   for (const method in Packery.prototype) {
//     if (!excludedMethods[method]) {
//       prototype[method] = Packery.prototype[method];
//     }
//   }

//   // Override _resetLayout
//   const originalResetLayout = prototype._resetLayout;
//   prototype._resetLayout = function () {
//     this.packer = this.packer || new Packery.Packer();
//     this.shiftPacker = this.shiftPacker || new Packery.Packer();
//     originalResetLayout.apply(this, arguments);
//   };

//   // Override _getItemLayoutPosition
//   const originalGetItemLayoutPosition = prototype._getItemLayoutPosition;
//   prototype._getItemLayoutPosition = function (item) {
//     item.rect = item.rect || new Packery.Rect();
//     return originalGetItemLayoutPosition.call(this, item);
//   };

//   // Override needsResizeLayout
//   const originalNeedsResizeLayout = prototype.needsResizeLayout;
//   prototype.needsResizeLayout = function () {
//     return this._getOption('horizontal')
//       ? this.needsVerticalResizeLayout()
//       : originalNeedsResizeLayout.call(this);
//   };

//   // Override _getOption
//   const originalGetOption = prototype._getOption;
//   prototype._getOption = function (key) {
//     if (key === 'horizontal') {
//       return this.options.isHorizontal !== undefined
//         ? this.options.isHorizontal
//         : this.options.horizontal;
//     }
//     return originalGetOption.apply(this.isotope, arguments);
//   };

//   return PackeryLayoutMode;
// });
// /**
//  * Bridget makes jQuery widgets
//  * v3.0.1
//  * MIT license
//  */

// (function (window, factory) {
//   'use strict';

//   // module definition
//   if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(window, require('jquery'));
//   } else {
//     // browser global
//     window.jQueryBridget = factory(window, window.jQuery);
//   }
// })(window, function factory(window, jQuery) {
//   'use strict';

//   // ----- utils ----- //

//   // helper function for logging errors
//   // $.error breaks jQuery chaining
//   let console = window.console;
//   let logError =
//     typeof console == 'undefined'
//       ? function () {}
//       : function (message) {
//           console.error(message);
//         };

//   // ----- jQueryBridget ----- //

//   function jQueryBridget(namespace, PluginClass, $) {
//     $ = $ || jQuery || window.jQuery;
//     if (!$) {
//       return;
//     }

//     // add option method -> $().plugin('option', {...})
//     if (!PluginClass.prototype.option) {
//       // option setter
//       PluginClass.prototype.option = function (opts) {
//         if (!opts) return;

//         this.options = Object.assign(this.options || {}, opts);
//       };
//     }

//     // make jQuery plugin
//     $.fn[namespace] = function (arg0, ...args) {
//       if (typeof arg0 == 'string') {
//         // method call $().plugin( 'methodName', { options } )
//         return methodCall(this, arg0, args);
//       }
//       // just $().plugin({ options })
//       plainCall(this, arg0);
//       return this;
//     };

//     // $().plugin('methodName')
//     function methodCall($elems, methodName, args) {
//       let returnValue;
//       let pluginMethodStr = `$().${namespace}("${methodName}")`;

//       $elems.each(function (i, elem) {
//         // get instance
//         let instance = $.data(elem, namespace);
//         if (!instance) {
//           logError(
//             `${namespace} not initialized.` +
//               ` Cannot call method ${pluginMethodStr}`
//           );
//           return;
//         }

//         let method = instance[methodName];
//         if (!method || methodName.charAt(0) == '_') {
//           logError(`${pluginMethodStr} is not a valid method`);
//           return;
//         }

//         // apply method, get return value
//         let value = method.apply(instance, args);
//         // set return value if value is returned, use only first value
//         returnValue = returnValue === undefined ? value : returnValue;
//       });

//       return returnValue !== undefined ? returnValue : $elems;
//     }

//     function plainCall($elems, options) {
//       $elems.each(function (i, elem) {
//         let instance = $.data(elem, namespace);
//         if (instance) {
//           // set options & init
//           instance.option(options);
//           instance._init();
//         } else {
//           // initialize new instance
//           instance = new PluginClass(elem, options);
//           $.data(elem, namespace, instance);
//         }
//       });
//     }
//   }

//   // -----  ----- //

//   return jQueryBridget;
// });

// (function (global, factory) {
//   'use strict';

//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('get-size/get-size', factory);
//   } else if (isCommonJS) {
//     module.exports = factory();
//   } else {
//     global.getSize = factory();
//   }
// })(window, function () {
//   'use strict';

//   const logError =
//     typeof console === 'undefined'
//       ? () => {}
//       : (message) => console.error(message);

//   const boxModelProperties = [
//     'paddingLeft',
//     'paddingRight',
//     'paddingTop',
//     'paddingBottom',
//     'marginLeft',
//     'marginRight',
//     'marginTop',
//     'marginBottom',
//     'borderLeftWidth',
//     'borderRightWidth',
//     'borderTopWidth',
//     'borderBottomWidth',
//   ];

//   let isBoxSizeOuter = false;

//   function parsePercentage(value) {
//     const parsedValue = parseFloat(value);
//     return value.indexOf('%') === -1 && !isNaN(parsedValue)
//       ? parsedValue
//       : false;
//   }

//   function getComputedStyleSafe(element) {
//     const style = getComputedStyle(element);
//     if (!style) {
//       logError(
//         'Style returned ' +
//           style +
//           '. Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1'
//       );
//     }
//     return style;
//   }

//   function initBoxSizeOuter() {
//     if (!isBoxSizeOuter) {
//       isBoxSizeOuter = true;
//       const testElement = document.createElement('div');
//       testElement.style.width = '200px';
//       testElement.style.padding = '1px 2px 3px 4px';
//       testElement.style.borderStyle = 'solid';
//       testElement.style.borderWidth = '1px 2px 3px 4px';
//       testElement.style.boxSizing = 'border-box';

//       const body = document.body || document.documentElement;
//       body.appendChild(testElement);

//       const style = getComputedStyleSafe(testElement);
//       const width = parsePercentage(style.width);
//       if (width) {
//         isBoxSizeOuter = 200 === Math.round(width);
//       }
//       body.removeChild(testElement);
//     }
//   }

//   return function getSize(element) {
//     initBoxSizeOuter();

//     if (typeof element === 'string') {
//       element = document.querySelector(element);
//     }

//     if (element && element.nodeType === 1) {
//       // Check if it is an element node
//       const style = getComputedStyleSafe(element);
//       if (style.display === 'none') {
//         return boxModelProperties.reduce(
//           (size, property) => {
//             size[property] = 0;
//             return size;
//           },
//           {
//             width: 0,
//             height: 0,
//             innerWidth: 0,
//             innerHeight: 0,
//             outerWidth: 0,
//             outerHeight: 0,
//           }
//         );
//       }

//       const size = {
//         width: element.offsetWidth,
//         height: element.offsetHeight,
//         isBorderBox: style.boxSizing === 'border-box',
//       };

//       boxModelProperties.forEach((property) => {
//         const value = parseFloat(style[property]) || 0;
//         size[property] = value;
//       });

//       const {
//         paddingLeft,
//         paddingRight,
//         marginLeft,
//         marginRight,
//         borderLeftWidth,
//         borderRightWidth,
//         paddingTop,
//         paddingBottom,
//         marginTop,
//         marginBottom,
//         borderTopWidth,
//         borderBottomWidth,
//       } = size;
//       const isBorderBox = size.isBorderBox && isBoxSizeOuter;

//       const widthFromStyle = parsePercentage(style.width);
//       if (widthFromStyle !== false) {
//         size.width =
//           widthFromStyle +
//           (isBorderBox
//             ? 0
//             : paddingLeft + paddingRight + borderLeftWidth + borderRightWidth);
//       }

//       const heightFromStyle = parsePercentage(style.height);
//       if (heightFromStyle !== false) {
//         size.height =
//           heightFromStyle +
//           (isBorderBox
//             ? 0
//             : paddingTop + paddingBottom + borderTopWidth + borderBottomWidth);
//       }

//       size.innerWidth =
//         size.width -
//         (paddingLeft + paddingRight + borderLeftWidth + borderRightWidth);
//       size.innerHeight =
//         size.height -
//         (paddingTop + paddingBottom + borderTopWidth + borderBottomWidth);
//       size.outerWidth = size.width + (marginLeft + marginRight);
//       size.outerHeight = size.height + (marginTop + marginBottom);

//       return size;
//     }
//   };
// });

// (function (global, factory) {
//   'use strict';
//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('desandro-matches-selector/matches-selector', factory);
//   } else if (isCommonJS) {
//     module.exports = factory();
//   } else {
//     global.matchesSelector = factory();
//   }
// })(window, function () {
//   'use strict';

//   const getMatchesSelectorMethod = () => {
//     const elementPrototype = window.Element.prototype;

//     if (elementPrototype.matches) {
//       return 'matches';
//     }
//     if (elementPrototype.matchesSelector) {
//       return 'matchesSelector';
//     }

//     const prefixes = ['webkit', 'moz', 'ms', 'o'];
//     for (const prefix of prefixes) {
//       const methodName = `${prefix}MatchesSelector`;
//       if (elementPrototype[methodName]) {
//         return methodName;
//       }
//     }
//     return null; // Return null if no method is found
//   };

//   const matchesSelectorMethod = getMatchesSelectorMethod();

//   return (element, selector) => {
//     if (!matchesSelectorMethod) {
//       throw new Error('No suitable matches selector method found.');
//     }
//     return element[matchesSelectorMethod](selector);
//   };
// });

// (function (global, factory) {
//   'use strict';
//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('fizzy-ui-utils/utils', [
//       'desandro-matches-selector/matches-selector',
//     ], (matchesSelector) => {
//       return factory(global, matchesSelector);
//     });
//   } else if (isCommonJS) {
//     module.exports = factory(global, require('desandro-matches-selector'));
//   } else {
//     global.fizzyUIUtils = factory(global, global.matchesSelector);
//   }
// })(window, function (global, matchesSelector) {
//   'use strict';

//   const utils = {
//     extend(target, source) {
//       Object.assign(target, source);
//       return target;
//     },

//     modulo(value, divisor) {
//       return ((value % divisor) + divisor) % divisor;
//     },

//     makeArray(item) {
//       if (Array.isArray(item)) return item;
//       if (item == null) return [];
//       if (typeof item === 'object' && typeof item.length === 'number') {
//         return Array.prototype.slice.call(item);
//       }
//       return [item];
//     },

//     removeFrom(array, item) {
//       const index = array.indexOf(item);
//       if (index !== -1) array.splice(index, 1);
//     },

//     getParent(element, selector) {
//       while (element.parentNode && element !== document.body) {
//         element = element.parentNode;
//         if (matchesSelector(element, selector)) return element;
//       }
//     },

//     getQueryElement(selector) {
//       return typeof selector === 'string'
//         ? document.querySelector(selector)
//         : selector;
//     },

//     handleEvent(event) {
//       const handler = `on${event.type}`;
//       if (this[handler]) {
//         this[handler](event);
//       }
//     },

//     filterFindElements(elements, selector) {
//       const matchedElements = [];
//       const elementArray = this.makeArray(elements);

//       elementArray.forEach((element) => {
//         if (element instanceof HTMLElement) {
//           if (selector) {
//             if (matchesSelector(element, selector)) {
//               matchedElements.push(element);
//             }
//             matchedElements.push(...element.querySelectorAll(selector));
//           } else {
//             matchedElements.push(element);
//           }
//         }
//       });

//       return matchedElements;
//     },

//     debounceMethod(Class, methodName, timeout = 100) {
//       const originalMethod = Class.prototype[methodName];
//       const timeoutKey = `${methodName}Timeout`;

//       Class.prototype[methodName] = function (...args) {
//         const previousTimeout = this[timeoutKey];
//         clearTimeout(previousTimeout);

//         this[timeoutKey] = setTimeout(() => {
//           originalMethod.apply(this, args);
//           delete this[timeoutKey];
//         }, timeout);
//       };
//     },

//     docReady(callback) {
//       const readyState = document.readyState;
//       if (readyState === 'complete' || readyState === 'interactive') {
//         setTimeout(callback);
//       } else {
//         document.addEventListener('DOMContentLoaded', callback);
//       }
//     },

//     toDashed(string) {
//       return string
//         .replace(/(.)([A-Z])/g, (match, p1, p2) => `${p1}-${p2}`)
//         .toLowerCase();
//     },

//     htmlInit(Class, name) {
//       this.docReady(() => {
//         const dashedName = this.toDashed(name);
//         const dataAttribute = `data-${dashedName}`;
//         const dataOptionsAttribute = `${dataAttribute}-options`;
//         const elements = document.querySelectorAll(
//           `[${dataAttribute}], .js-${dashedName}`
//         );
//         const optionsElements = Array.from(elements);
//         const jQueryInstance = global.jquery;

//         optionsElements.forEach((element) => {
//           const optionsString =
//             element.getAttribute(dataAttribute) ||
//             element.getAttribute(dataOptionsAttribute);
//           let options;

//           try {
//             options = optionsString && JSON.parse(optionsString);
//           } catch (error) {
//             if (console) {
//               console.error(
//                 `Error parsing ${dataAttribute} on ${element.className}: ${error}`
//               );
//             }
//             return;
//           }

//           const instance = new Class(element, options);
//           if (jQueryInstance) {
//             jQueryInstance.data(element, name, instance);
//           }
//         });
//       });
//     },
//   };

//   return utils;
// });

// (function (global, factory) {
//   'use strict';
//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('flickityt4s/js/cell', ['get-size/get-size'], (getSize) => {
//       return factory(global, getSize);
//     });
//   } else if (isCommonJS) {
//     module.exports = factory(global, require('get-size'));
//   } else {
//     global.Flickityt4s = global.Flickityt4s || {};
//     global.Flickityt4s.Cell = factory(global, global.getSize);
//   }
// })(window, function (global, getSize) {
//   'use strict';

//   class Cell {
//     constructor(element, parent) {
//       if (!element) return;
//       this.element = element;
//       this.parent = parent;
//       this.create();
//     }

//     create() {
//       this.element.style.position = 'absolute';
//       this.element.setAttribute('aria-hidden', 'true');
//       this.x = 0;
//       this.shift = 0;
//       this.element.style[this.parent.originSide] = 0;
//     }

//     destroy() {
//       this.unselect();
//       this.element.style.position = '';
//       const originSide = this.parent.originSide;
//       this.element.style[originSide] = '';
//       this.element.style.transform = '';
//       this.element.removeAttribute('aria-hidden');
//     }

//     getSize() {
//       this.size = getSize(this.element);
//     }

//     setPosition(x) {
//       this.x = x;
//       this.updateTarget();
//       this.renderPosition(x);
//     }

//     updateTarget() {
//       const sideProperty =
//         this.parent.originSide === 'left' ? 'marginLeft' : 'marginRight';
//       this.target =
//         this.x +
//         this.size[sideProperty] +
//         this.size.width * this.parent.cellAlign;
//     }

//     renderPosition(x) {
//       const direction = this.parent.originSide === 'left' ? 1 : -1;
//       const position = this.parent.options.percentPosition
//         ? x * direction * (this.parent.size.innerWidth / this.size.width)
//         : x * direction;
//       this.element.style.transform = `translateX(${this.parent.getPositionValue(
//         position
//       )})`;
//     }

//     select() {
//       this.element.classList.add('is-selected');
//       this.element.removeAttribute('aria-hidden');
//     }

//     unselect() {
//       this.element.classList.remove('is-selected');
//       this.element.setAttribute('aria-hidden', 'true');
//     }

//     wrapShift(shift) {
//       this.shift = shift;
//       this.renderPosition(this.x + this.parent.slideableWidth * shift);
//     }

//     remove() {
//       this.element.parentNode.removeChild(this.element);
//     }
//   }

//   return Cell;
// });

// (function (global, factory) {
//   'use strict';
//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('flickityt4s/js/slide', factory);
//   } else if (isCommonJS) {
//     module.exports = factory();
//   } else {
//     global.Flickityt4s = global.Flickityt4s || {};
//     global.Flickityt4s.Slide = factory();
//   }
// })(window, function () {
//   'use strict';

//   class Slide {
//     constructor(parent) {
//       this.parent = parent;
//       this.isOriginLeft = this.parent.originSide === 'left';
//       this.cells = [];
//       this.outerWidth = 0;
//       this.height = 0;
//     }

//     addCell(cell) {
//       this.cells.push(cell);
//       this.outerWidth += cell.size.outerWidth;
//       this.height = Math.max(cell.size.outerHeight, this.height);

//       if (this.cells.length === 1) {
//         this.x = cell.x;
//         const marginProperty = this.isOriginLeft ? 'marginLeft' : 'marginRight';
//         this.firstMargin = cell.size[marginProperty];
//       }
//     }

//     updateTarget() {
//       const marginProperty = this.isOriginLeft ? 'marginRight' : 'marginLeft';
//       const lastCell = this.getLastCell();
//       const lastCellMargin = lastCell ? lastCell.size[marginProperty] : 0;
//       const targetOffset =
//         this.outerWidth - (this.firstMargin + lastCellMargin);
//       this.target =
//         this.x + this.firstMargin + targetOffset * this.parent.cellAlign;
//     }

//     getLastCell() {
//       return this.cells[this.cells.length - 1];
//     }

//     select() {
//       this.cells.forEach((cell) => cell.select());
//     }

//     unselect() {
//       this.cells.forEach((cell) => cell.unselect());
//     }

//     getCellElements() {
//       return this.cells.map((cell) => cell.element);
//     }
//   }

//   return Slide;
// });

// //done
// (function (global, factory) {
//   'use strict';

//   const isAMD = typeof define === 'function' && define.amd;
//   const isCommonJS = typeof module === 'object' && module.exports;

//   if (isAMD) {
//     define('flickityt4s/js/animate', ['fizzy-ui-utils/utils'], factory);
//   } else if (isCommonJS) {
//     module.exports = factory(global, require('fizzy-ui-utils'));
//   } else {
//     global.Flickityt4s = global.Flickityt4s || {};
//     global.Flickityt4s.animatePrototype = factory(global, global.fizzyUIUtils);
//   }
// })(window, function (t, fizzyUIUtils) {
//   'use strict';

//   return {
//     startAnimation() {
//       if (!this.isAnimating) {
//         this.isAnimating = true;
//         this.restingFrames = 0;
//         this.animate();
//       }
//     },
//     animate() {
//       this.applyDragForce();
//       this.applySelectedAttraction();

//       const initialPosition = this.x;
//       this.integratePhysics();
//       this.positionSlider();
//       this.settle(initialPosition);

//       if (this.isAnimating) {
//         requestAnimationFrame(() => this.animate());
//       }
//     },
//     positionSlider() {
//       let position = this.x;
//       if (this.options.wrapAround && this.cells.length > 1) {
//         position = fizzyUIUtils.modulo(position, this.slideableWidth);
//         position -= this.slideableWidth;
//         this.shiftWrapCells(position);
//       }
//       this.setTranslateX(position, this.isAnimating);
//       this.dispatchScrollEvent();
//     },
//     setTranslateX(position, isAnimating) {
//       position += this.cursorPosition;
//       position = RtlT4s ? -position : position;

//       const translateValue = this.getPositionValue(position);
//       this.slider.style.transform = isAnimating
//         ? `translate3d(${translateValue}, 0, 0)`
//         : `translateX(${translateValue})`;
//     },
//     dispatchScrollEvent() {
//       const firstSlide = this.slides[0];
//       if (firstSlide) {
//         const distance = -this.x - firstSlide.target;
//         const scrollProgress = distance / this.slidesWidth;
//         this.dispatchEvent('scroll', null, [scrollProgress, distance]);
//       }
//     },
//     positionSliderAtSelected() {
//       if (this.cells.length) {
//         this.x = -this.selectedSlide.target;
//         this.velocity = 0;
//         this.positionSlider();
//       }
//     },
//     getPositionValue(position) {
//       return this.options.percentPosition
//         ? `${(
//             0.01 * Math.round((position / this.size.innerWidth) * 10000)
//           ).toFixed(2)}%`
//         : `${Math.round(position)}px`;
//     },
//     settle(initialPosition) {
//       if (
//         !this.isPointerDown &&
//         Math.round(100 * this.x) === Math.round(100 * initialPosition)
//       ) {
//         this.restingFrames++;
//       }
//       if (this.restingFrames > 2) {
//         this.isAnimating = false;
//         delete this.isFreeScrolling;
//         this.positionSlider();
//         this.dispatchEvent('settle', null, [this.selectedIndex]);
//       }
//     },
//     shiftWrapCells(position) {
//       const newCursorPosition = this.cursorPosition + position;
//       this._shiftCells(this.beforeShiftCells, newCursorPosition, -1);

//       const remainingWidth =
//         this.size.innerWidth -
//         (position + this.slideableWidth + this.cursorPosition);
//       this._shiftCells(this.afterShiftCells, remainingWidth, 1);
//     },
//     _shiftCells(cells, remainingWidth, direction) {
//       for (let i = 0; i < cells.length; i++) {
//         const cell = cells[i];
//         const shiftDirection = remainingWidth > 0 ? direction : 0;
//         cell.wrapShift(shiftDirection);
//         remainingWidth -= cell.size.outerWidth;
//       }
//       this._checkVisibility();
//     },
//     _unshiftCells(cells) {
//       if (cells && cells.length) {
//         cells.forEach((cell) => cell.wrapShift(0));
//       }
//     },
//     integratePhysics() {
//       this.x += this.velocity;
//       this.velocity *= this.getFrictionFactor();
//     },
//     applyForce(force) {
//       this.velocity += force;
//     },
//     getFrictionFactor() {
//       return (
//         1 -
//         this.options[this.isFreeScrolling ? 'freeScrollFriction' : 'friction']
//       );
//     },
//     getRestingPosition() {
//       return this.x + this.velocity / (1 - this.getFrictionFactor());
//     },
//     applyDragForce() {
//       if (this.isDraggable && this.isPointerDown) {
//         const dragForce = this.dragX - this.x - this.velocity;
//         this.applyForce(dragForce);
//       }
//     },
//     applySelectedAttraction() {
//       if (
//         (!this.isDraggable || !this.isPointerDown) &&
//         !this.isFreeScrolling &&
//         this.slides.length
//       ) {
//         const attractionForce =
//           (-1 * this.selectedSlide.target - this.x) *
//           this.options.selectedAttraction;
//         this.applyForce(attractionForce);
//       }
//     },
//   };
// });

// /*!
//  * Unipointer v2.4.0
//  * base class for doing one thing with pointer event
//  * MIT license
//  */

// /*jshint browser: true, undef: true, unused: true, strict: true */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   /* jshint strict: false */ /*global define, module, require */
//   if (typeof define == 'function' && define.amd) {
//     // AMD
//     define(['ev-emitter/ev-emitter'], function (EvEmitter) {
//       return factory(window, EvEmitter);
//     });
//   } else if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(window, require('ev-emitter'));
//   } else {
//     // browser global
//     window.Unipointer = factory(window, window.EvEmitter);
//   }
// })(window, function factory(window, EvEmitter) {
//   'use strict';

//   function noop() {}

//   function Unipointer() {}

//   // inherit EvEmitter
//   var proto = (Unipointer.prototype = Object.create(EvEmitter.prototype));

//   proto.bindStartEvent = function (elem) {
//     this._bindStartEvent(elem, true);
//   };

//   proto.unbindStartEvent = function (elem) {
//     this._bindStartEvent(elem, false);
//   };

//   /**
//    * Add or remove start event
//    * @param {Boolean} isAdd - remove if falsey
//    */
//   proto._bindStartEvent = function (elem, isAdd) {
//     // munge isAdd, default to true
//     isAdd = isAdd === undefined ? true : isAdd;
//     var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

//     // default to mouse events
//     var startEvent = 'mousedown';
//     if ('ontouchstart' in window) {
//       // HACK prefer Touch Events as you can preventDefault on touchstart to
//       // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
//       startEvent = 'touchstart';
//     } else if (window.PointerEvent) {
//       // Pointer Events
//       startEvent = 'pointerdown';
//     }
//     elem[bindMethod](startEvent, this);
//   };

//   // trigger handler methods for events
//   proto.handleEvent = function (event) {
//     var method = 'on' + event.type;
//     if (this[method]) {
//       this[method](event);
//     }
//   };

//   // returns the touch that we're keeping track of
//   proto.getTouch = function (touches) {
//     for (var i = 0; i < touches.length; i++) {
//       var touch = touches[i];
//       if (touch.identifier == this.pointerIdentifier) {
//         return touch;
//       }
//     }
//   };

//   // ----- start event ----- //

//   proto.onmousedown = function (event) {
//     // dismiss clicks from right or middle buttons
//     var button = event.button;
//     if (button && button !== 0 && button !== 1) {
//       return;
//     }
//     this._pointerDown(event, event);
//   };

//   proto.ontouchstart = function (event) {
//     this._pointerDown(event, event.changedTouches[0]);
//   };

//   proto.onpointerdown = function (event) {
//     this._pointerDown(event, event);
//   };

//   /**
//    * pointer start
//    * @param {Event} event
//    * @param {Event or Touch} pointer
//    */
//   proto._pointerDown = function (event, pointer) {
//     // dismiss right click and other pointers
//     // button = 0 is okay, 1-4 not
//     if (event.button || this.isPointerDown) {
//       return;
//     }

//     this.isPointerDown = true;
//     // save pointer identifier to match up touch events
//     this.pointerIdentifier =
//       pointer.pointerId !== undefined
//         ? // pointerId for pointer events, touch.indentifier for touch events
//           pointer.pointerId
//         : pointer.identifier;

//     this.pointerDown(event, pointer);
//   };

//   proto.pointerDown = function (event, pointer) {
//     this._bindPostStartEvents(event);
//     this.emitEvent('pointerDown', [event, pointer]);
//   };

//   // hash of events to be bound after start event
//   var postStartEvents = {
//     mousedown: ['mousemove', 'mouseup'],
//     touchstart: ['touchmove', 'touchend', 'touchcancel'],
//     pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
//   };

//   proto._bindPostStartEvents = function (event) {
//     if (!event) {
//       return;
//     }
//     // get proper events to match start event
//     var events = postStartEvents[event.type];
//     // bind events to node
//     events.forEach(function (eventName) {
//       window.addEventListener(eventName, this);
//     }, this);
//     // save these arguments
//     this._boundPointerEvents = events;
//   };

//   proto._unbindPostStartEvents = function () {
//     // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
//     if (!this._boundPointerEvents) {
//       return;
//     }
//     this._boundPointerEvents.forEach(function (eventName) {
//       window.removeEventListener(eventName, this);
//     }, this);

//     delete this._boundPointerEvents;
//   };

//   // ----- move event ----- //

//   proto.onmousemove = function (event) {
//     this._pointerMove(event, event);
//   };

//   proto.onpointermove = function (event) {
//     if (event.pointerId == this.pointerIdentifier) {
//       this._pointerMove(event, event);
//     }
//   };

//   proto.ontouchmove = function (event) {
//     var touch = this.getTouch(event.changedTouches);
//     if (touch) {
//       this._pointerMove(event, touch);
//     }
//   };

//   /**
//    * pointer move
//    * @param {Event} event
//    * @param {Event or Touch} pointer
//    * @private
//    */
//   proto._pointerMove = function (event, pointer) {
//     this.pointerMove(event, pointer);
//   };

//   // public
//   proto.pointerMove = function (event, pointer) {
//     this.emitEvent('pointerMove', [event, pointer]);
//   };

//   // ----- end event ----- //

//   proto.onmouseup = function (event) {
//     this._pointerUp(event, event);
//   };

//   proto.onpointerup = function (event) {
//     if (event.pointerId == this.pointerIdentifier) {
//       this._pointerUp(event, event);
//     }
//   };

//   proto.ontouchend = function (event) {
//     var touch = this.getTouch(event.changedTouches);
//     if (touch) {
//       this._pointerUp(event, touch);
//     }
//   };

//   /**
//    * pointer up
//    * @param {Event} event
//    * @param {Event or Touch} pointer
//    * @private
//    */
//   proto._pointerUp = function (event, pointer) {
//     this._pointerDone();
//     this.pointerUp(event, pointer);
//   };

//   // public
//   proto.pointerUp = function (event, pointer) {
//     this.emitEvent('pointerUp', [event, pointer]);
//   };

//   // ----- pointer done ----- //

//   // triggered on pointer up & pointer cancel
//   proto._pointerDone = function () {
//     this._pointerReset();
//     this._unbindPostStartEvents();
//     this.pointerDone();
//   };

//   proto._pointerReset = function () {
//     // reset properties
//     this.isPointerDown = false;
//     delete this.pointerIdentifier;
//   };

//   proto.pointerDone = noop;

//   // ----- pointer cancel ----- //

//   proto.onpointercancel = function (event) {
//     if (event.pointerId == this.pointerIdentifier) {
//       this._pointerCancel(event, event);
//     }
//   };

//   proto.ontouchcancel = function (event) {
//     var touch = this.getTouch(event.changedTouches);
//     if (touch) {
//       this._pointerCancel(event, touch);
//     }
//   };

//   /**
//    * pointer cancel
//    * @param {Event} event
//    * @param {Event or Touch} pointer
//    * @private
//    */
//   proto._pointerCancel = function (event, pointer) {
//     this._pointerDone();
//     this.pointerCancel(event, pointer);
//   };

//   // public
//   proto.pointerCancel = function (event, pointer) {
//     this.emitEvent('pointerCancel', [event, pointer]);
//   };

//   // -----  ----- //

//   // utility function for getting x/y coords from event
//   Unipointer.getPointerPoint = function (pointer) {
//     return {
//       x: pointer.pageX,
//       y: pointer.pageY,
//     };
//   };

//   // -----  ----- //

//   return Unipointer;
// });

// /*!
//  * Unidragger v3.0.1
//  * Draggable base class
//  * MIT license
//  */

// (function (window, factory) {
//   'use strict';

//   // universal module definition
//   if (typeof module == 'object' && module.exports) {
//     // CommonJS
//     module.exports = factory(window, require('ev-emitter'));
//   } else {
//     // browser global
//     window.Unidragger = factory(window, window.EvEmitter);
//   }
// })(
//   typeof window != 'undefined' ? window : this,
//   function factory(window, EvEmitter) {
//     function Unidragger() {}

//     // inherit EvEmitter
//     let proto = (Unidragger.prototype = Object.create(EvEmitter.prototype));

//     // ----- bind start ----- //

//     // trigger handler methods for events
//     proto.handleEvent = function (event) {
//       let method = 'on' + event.type;
//       if (this[method]) {
//         this[method](event);
//       }
//     };

//     let startEvent, activeEvents;
//     if ('ontouchstart' in window) {
//       // HACK prefer Touch Events as you can preventDefault on touchstart to
//       // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
//       startEvent = 'touchstart';
//       activeEvents = ['touchmove', 'touchend', 'touchcancel'];
//     } else if (window.PointerEvent) {
//       // Pointer Events
//       startEvent = 'pointerdown';
//       activeEvents = ['pointermove', 'pointerup', 'pointercancel'];
//     } else {
//       // mouse events
//       startEvent = 'mousedown';
//       activeEvents = ['mousemove', 'mouseup'];
//     }

//     // prototype so it can be overwriteable by Flickity
//     proto.touchActionValue = 'none';

//     proto.bindHandles = function () {
//       this._bindHandles('addEventListener', this.touchActionValue);
//     };

//     proto.unbindHandles = function () {
//       this._bindHandles('removeEventListener', '');
//     };

//     /**
//      * Add or remove start event
//      * @param {String} bindMethod - addEventListener or removeEventListener
//      * @param {String} touchAction - value for touch-action CSS property
//      */
//     proto._bindHandles = function (bindMethod, touchAction) {
//       this.handles.forEach((handle) => {
//         handle[bindMethod](startEvent, this);
//         handle[bindMethod]('click', this);
//         // touch-action: none to override browser touch gestures. metafizzy/flickity#540
//         if (window.PointerEvent) handle.style.touchAction = touchAction;
//       });
//     };

//     proto.bindActivePointerEvents = function () {
//       activeEvents.forEach((eventName) => {
//         window.addEventListener(eventName, this);
//       });
//     };

//     proto.unbindActivePointerEvents = function () {
//       activeEvents.forEach((eventName) => {
//         window.removeEventListener(eventName, this);
//       });
//     };

//     // ----- event handler helpers ----- //

//     // trigger method with matching pointer
//     proto.withPointer = function (methodName, event) {
//       if (event.pointerId === this.pointerIdentifier) {
//         this[methodName](event, event);
//       }
//     };

//     // trigger method with matching touch
//     proto.withTouch = function (methodName, event) {
//       let touch;
//       for (let changedTouch of event.changedTouches) {
//         if (changedTouch.identifier === this.pointerIdentifier) {
//           touch = changedTouch;
//         }
//       }
//       if (touch) this[methodName](event, touch);
//     };

//     // ----- start event ----- //

//     proto.onmousedown = function (event) {
//       this.pointerDown(event, event);
//     };

//     proto.ontouchstart = function (event) {
//       this.pointerDown(event, event.changedTouches[0]);
//     };

//     proto.onpointerdown = function (event) {
//       this.pointerDown(event, event);
//     };

//     // nodes that have text fields
//     const cursorNodes = ['TEXTAREA', 'INPUT', 'SELECT', 'OPTION'];
//     // input types that do not have text fields
//     const clickTypes = [
//       'radio',
//       'checkbox',
//       'button',
//       'submit',
//       'image',
//       'file',
//     ];

//     /**
//      * any time you set `event, pointer` it refers to:
//      * @param {Event} event
//      * @param {Event | Touch} pointer
//      */
//     proto.pointerDown = function (event, pointer) {
//       // dismiss multi-touch taps, right clicks, and clicks on text fields
//       let isCursorNode = cursorNodes.includes(event.target.nodeName);
//       let isClickType = clickTypes.includes(event.target.type);
//       let isOkayElement = !isCursorNode || isClickType;
//       let isOkay = !this.isPointerDown && !event.button && isOkayElement;
//       if (!isOkay) return;

//       this.isPointerDown = true;
//       // save pointer identifier to match up touch events
//       this.pointerIdentifier =
//         pointer.pointerId !== undefined
//           ? // pointerId for pointer events, touch.indentifier for touch events
//             pointer.pointerId
//           : pointer.identifier;
//       // track position for move
//       this.pointerDownPointer = {
//         pageX: pointer.pageX,
//         pageY: pointer.pageY,
//       };

//       this.bindActivePointerEvents();
//       this.emitEvent('pointerDown', [event, pointer]);
//     };

//     // ----- move ----- //

//     proto.onmousemove = function (event) {
//       this.pointerMove(event, event);
//     };

//     proto.onpointermove = function (event) {
//       this.withPointer('pointerMove', event);
//     };

//     proto.ontouchmove = function (event) {
//       this.withTouch('pointerMove', event);
//     };

//     proto.pointerMove = function (event, pointer) {
//       let moveVector = {
//         x: pointer.pageX - this.pointerDownPointer.pageX,
//         y: pointer.pageY - this.pointerDownPointer.pageY,
//       };
//       this.emitEvent('pointerMove', [event, pointer, moveVector]);
//       // start drag if pointer has moved far enough to start drag
//       let isDragStarting = !this.isDragging && this.hasDragStarted(moveVector);
//       if (isDragStarting) this.dragStart(event, pointer);
//       if (this.isDragging) this.dragMove(event, pointer, moveVector);
//     };

//     // condition if pointer has moved far enough to start drag
//     proto.hasDragStarted = function (moveVector) {
//       return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
//     };

//     // ----- drag ----- //

//     proto.dragStart = function (event, pointer) {
//       this.isDragging = true;
//       this.isPreventingClicks = true; // set flag to prevent clicks
//       this.emitEvent('dragStart', [event, pointer]);
//     };

//     proto.dragMove = function (event, pointer, moveVector) {
//       this.emitEvent('dragMove', [event, pointer, moveVector]);
//     };

//     // ----- end ----- //

//     proto.onmouseup = function (event) {
//       this.pointerUp(event, event);
//     };

//     proto.onpointerup = function (event) {
//       this.withPointer('pointerUp', event);
//     };

//     proto.ontouchend = function (event) {
//       this.withTouch('pointerUp', event);
//     };

//     proto.pointerUp = function (event, pointer) {
//       this.pointerDone();
//       this.emitEvent('pointerUp', [event, pointer]);

//       if (this.isDragging) {
//         this.dragEnd(event, pointer);
//       } else {
//         // pointer didn't move enough for drag to start
//         this.staticClick(event, pointer);
//       }
//     };

//     proto.dragEnd = function (event, pointer) {
//       this.isDragging = false; // reset flag
//       // re-enable clicking async
//       setTimeout(() => delete this.isPreventingClicks);

//       this.emitEvent('dragEnd', [event, pointer]);
//     };

//     // triggered on pointer up & pointer cancel
//     proto.pointerDone = function () {
//       this.isPointerDown = false;
//       delete this.pointerIdentifier;
//       this.unbindActivePointerEvents();
//       this.emitEvent('pointerDone');
//     };

//     // ----- cancel ----- //

//     proto.onpointercancel = function (event) {
//       this.withPointer('pointerCancel', event);
//     };

//     proto.ontouchcancel = function (event) {
//       this.withTouch('pointerCancel', event);
//     };

//     proto.pointerCancel = function (event, pointer) {
//       this.pointerDone();
//       this.emitEvent('pointerCancel', [event, pointer]);
//     };

//     // ----- click ----- //

//     // handle all clicks and prevent clicks when dragging
//     proto.onclick = function (event) {
//       if (this.isPreventingClicks) event.preventDefault();
//     };

//     // triggered after pointer down & up with no/tiny movement
//     proto.staticClick = function (event, pointer) {
//       // ignore emulated mouse up clicks
//       let isMouseup = event.type === 'mouseup';
//       if (isMouseup && this.isIgnoringMouseUp) return;

//       this.emitEvent('staticClick', [event, pointer]);

//       // set flag for emulated clicks 300ms after touchend
//       if (isMouseup) {
//         this.isIgnoringMouseUp = true;
//         // reset flag after 400ms
//         setTimeout(() => {
//           delete this.isIgnoringMouseUp;
//         }, 400);
//       }
//     };

//     // -----  ----- //

//     return Unidragger;
//   }
// );

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/flickityt4s', [
//       'ev-emitter/ev-emitter',
//       'get-size/get-size',
//       'fizzy-ui-utils/utils',
//       './cell',
//       './slide',
//       './animate',
//     ], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       global,
//       require('ev-emitter'),
//       require('get-size'),
//       require('fizzy-ui-utils'),
//       require('./cell'),
//       require('./slide'),
//       require('./animate')
//     );
//   } else {
//     const Flickityt4s = factory(
//       window.jQuary || window.$,
//       global,
//       global.EvEmitter,
//       global.getSize,
//       global.fizzyUIUtils,
//       global.Flickityt4s.Cell,
//       global.Flickityt4s.Slide,
//       global.Flickityt4s.animatePrototype
//     );
//     global.Flickityt4s = Flickityt4s;
//   }
// })(
//   window,
//   (jQuary, global, EvEmitter, getSize, utils, Cell, Slide, Animate) => {
//     'use strict';

//     // Helper function to append elements
//     const appendElements = (elements, target) => {
//       const elementsArray = utils.makeArray(elements);
//       while (elementsArray.length) {
//         target.appendChild(elementsArray.shift());
//       }
//     };

//     class Flickityt4s {
//       static alignment = {
//         center: {
//           left: 0.5,
//           right: 0.5,
//         },
//         left: {
//           left: 0,
//           right: 1,
//         },
//         right: {
//           right: 0,
//           left: 1,
//         },
//       };

//       static defaults = {
//         accessibility: true,
//         cellAlign: 'center',
//         freeScrollFriction: 0.075,
//         friction: 0.28,
//         namespaceJQueryEvents: true,
//         percentPosition: true,
//         resize: true,
//         selectedAttraction: 0.025,
//         setGallerySize: true,
//         setPrevNextButtons: false,
//         checkVisibility: false,
//         sync: false,
//         guid: 0,
//       };
//       static guid = 0;
//       static selectedSlide = {};
//       static createMethods = [];
//       static cell = [];
//       static slides = [];
//       static Cell = Cell;
//       static Slide = Slide;

//       instances = {};

//       constructor(element, options = {}) {
//         const queryElement = utils.getQueryElement(element);
//         if (!queryElement) {
//           console.error(`Bad element for Flickity: ${element}`);
//           return;
//         }
//         this.element = queryElement;
//         if (this.element.flickityt4sGUID) {
//           const instance = this.instances[this.element.flickityt4sGUID];
//           instance?.option(options);
//           return instance;
//         }

//         this.$element = jQuary(this.element);

//         // Default options
//         this.options = utils.extend({}, Flickityt4s.defaults);
//         options.originwrapAround = options.wrapAround;
//         options.rightToLeft =
//           document.documentElement.getAttribute('dir') === 'rtl';
//         // Set arrow shapes based on option
//         if (options.arrowIcon) {
//           options.arrowShape = this.getArrowShape(options.arrowIcon);
//         }
//         this.option(options);
//         this._create();
//       }

//       option(options) {
//         utils.extend(this.options, options);
//       }

//       getArrowShape(arrowIcon) {
//         switch (arrowIcon) {
//           case '1':
//             return 'M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z';
//           case '2':
//             return 'M 10,50 L 60,100 L 65,95 L 20,50 L 65,5 L 60,0 Z';
//           case '3':
//             return 'M 0,50 L 60,0 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z';
//           default:
//             return '';
//         }
//       }

//       _create() {
//         this.guid = ++Flickityt4s.guid;
//         this.element.flickityt4sGUID = this.guid;
//         this.instances[this.guid] = this;
//         this.selectedIndex = 0;
//         this.restingFrames = 0;
//         this.x = 0;
//         this.velocity = 0;
//         this.originSide = window.RtlT4s ? 'right' : 'left';
//         this.viewport = document.createElement('div');
//         this.viewport.className = 'flickity-viewport';
//         this._createSlider();

//         // Add event listeners
//         if (this.options.resize || this.options.watchCSS) {
//           global.addEventListener('resize', this);
//         }
//         for (const id in this.element.flickityt4sGUID) {
//           if (this.options.on) {
//             this.on(id, this.options.on[id]);
//           }
//         }

//         Flickityt4s.createMethods.forEach((t) => this[t]());
//         this.options.watchCSS ? this.watchCSS() : this.activate();
//       }

//       _createSlider() {
//         this.slider = document.createElement('div');
//         this.slider.className =
//           'flickity-slider d-flex justify-content-center align-items-center';
//         this.slider.style[this.originSide] = 0;
//       }

//       _filterFindCellElements(children) {
//         return utils.filterFindElements(children, this.options.cellSelector);
//       }

//       reloadCells() {
//         this.cells = this._makeCells(this.slider.children);
//         this.positionCells();
//         this._getWrapShiftCells();
//         this.setGallerySize();
//         this.setPrevNextButtons();
//       }

//       _makeCells(cell) {
//         return this._filterFindCellElements(cell).map((c) => new Cell(c, this));
//       }

//       getLastCell() {
//         return this.cells[this.cells.length - 1];
//       }

//       getLastSlide() {
//         return this.slides[this.slides.length - 1];
//       }

//       positionCells() {
//         this._sizeCells(this.cells), this._positionCells(0);
//       }

//       _positionCells(startIndex = 0) {
//         this.maxCellHeight = (startIndex && this.maxCellHeight) || 0;
//         let positionX = 0;

//         if (startIndex > 0) {
//           const prevCell = this.cells[startIndex - 1];
//           positionX = prevCell.x + prevCell.size.outerWidth;
//         }

//         const numCells = this.cells.length;

//         for (let index = startIndex; index < numCells; index++) {
//           const cell = this.cells[index];
//           cell.setPosition(positionX);
//           positionX += cell.size.outerWidth;
//           this.maxCellHeight = Math.max(
//             cell.size.outerHeight,
//             this.maxCellHeight
//           );
//         }

//         this.slideableWidth = positionX;
//         this.updateSlides();
//         this._containSlides();
//         this.slidesWidth = numCells
//           ? this.getLastSlide().target - this.slides[0].target
//           : 0;
//         this.maxVisibilityHeight = 0;
//       }

//       _sizeCells(cells) {
//         cells.forEach((cell) => {
//           cell.getSize();
//         });
//       }

//       updateSlides() {
//         this.slides = [];

//         if (this.cells.length) {
//           let currentSlide = new Slide(this);
//           this.slides.push(currentSlide);

//           const marginProperty =
//             this.originSide === 'left' ? 'marginRight' : 'marginLeft';
//           const canCellFit = this._getCanCellFit();

//           this.cells.forEach((cell, index) => {
//             if (currentSlide.cells.length) {
//               const remainingWidth =
//                 currentSlide.outerWidth -
//                 currentSlide.firstMargin +
//                 (cell.size.outerWidth - cell.size[marginProperty]);

//               if (canCellFit.call(this, index, remainingWidth)) {
//                 currentSlide.addCell(cell);
//               } else {
//                 currentSlide.updateTarget();
//                 currentSlide = new Slide(this);
//                 this.slides.push(currentSlide);
//                 currentSlide.addCell(cell);
//               }
//             } else {
//               currentSlide.addCell(cell);
//             }
//           });

//           currentSlide.updateTarget();
//           this.updateSelectedSlide();
//         }
//       }

//       _getCanCellFit() {
//         const groupCells = this.options.groupCells;

//         if (!groupCells) {
//           return () => false;
//         }

//         if (typeof groupCells === 'number') {
//           const cellCount = parseInt(groupCells, 10);
//           return (index) => index % cellCount !== 0;
//         }

//         const match =
//           typeof groupCells === 'string' && groupCells.match(/^(\d+)%$/);
//         const percentage = match ? parseInt(match[1], 10) / 100 : 1;

//         return (index, elementWidth) =>
//           elementWidth <= (this.size.innerWidth + 1) * percentage;
//       }

//       _init() {
//         this.positionCells();
//         this.positionSliderAtSelected();
//       }

//       setCellAlign() {
//         const align = {
//           center: {
//             left: 0.5,
//             right: 0.5,
//           },
//           left: {
//             left: 0,
//             right: 1,
//           },
//           right: {
//             right: 0,
//             left: 1,
//           },
//         };
//         const cellAlign = align[this.options.cellAlign];
//         this.cellAlign = cellAlign
//           ? cellAlign[this.originSide]
//           : this.options.cellAlign;
//       }

//       setGallerySize() {
//         if (this.options.setGallerySize) {
//           let size =
//             this.options.adaptiveHeight && this.selectedSlide
//               ? this.selectedSlide.height
//               : this.maxCellHeight;
//           size =
//             this.maxVisibilityHeight && this.maxVisibilityHeight > size
//               ? this.maxVisibilityHeight
//               : size;
//           this.viewport.style.height = `${size}px`;
//         }
//       }

//       setPrevNextButtons() {
//         if (this.options.setPrevNextButtons) {
//           const element = this.viewport.querySelector(
//             '.is-selected [data-cacl-slide]'
//           );
//           if (element) {
//             const size = element.offsetHeight / 2;
//             this.element.style.setProperty('--prev-next-top', size + 'px');
//           }
//         }
//       }

//       _checkVisibility() {
//         if (this.options.checkVisibility && this.options.adaptiveHeight) {
//           const dimension = this.viewport.getBoundingClientRect().x;
//           const offsetWidth = this.viewport.offsetWidth;
//           const cellLengths = this.cells.length;

//           for (let i = 0; i < cellLengths; i++) {
//             const cell = this.cells[i];
//             const size = cell.element.getBoundingClientRect().x - dimension;

//             if (
//               (size + cell.size.outerWidth > dimension &&
//                 size + cell.size.outerWidth < offsetWidth) ||
//               (size > dimension && size < offsetWidth)
//             ) {
//               this.maxVisibilityHeight = Math.max(
//                 cell.size.outerHeight,
//                 this.maxVisibilityHeight
//               );
//               cell.element.classList.add('is-visible');
//               cell.element.removeAttribute('aria-hidden');
//             } else {
//               cell.element.classList.remove('is-visible');
//               cell.element.setAttribute('aria-hidden', 'true');
//             }
//           }
//         }
//       }

//       _getWrapShiftCells() {
//         if (this.options.originwrapAround) {
//           if (this.slides.length < 2) {
//             this.options.wrapAround = false;
//           } else {
//             this.options.wrapAround = true;
//             this._unshiftCells(this.beforeShiftCells);
//             this._unshiftCells(this.afterShiftCells);

//             let cursorPosition = this.cursorPosition;
//             const cellLen = this.cells.length - 1;
//             this.beforeShiftCells = this._getGapCells(
//               cursorPosition,
//               cellLen,
//               -1
//             );
//             cursorPosition = this.size.innerWidth - this.cursorPosition;
//             this.afterShiftCells = this._getGapCells(cursorPosition, 0, 1);
//           }
//         }
//       }

//       _getGapCells(cursorPosition, index, cellLen) {
//         const cells = [];
//         while (cursorPosition > 0) {
//           const cell = this.cells[index];
//           if (!cell) return cells;
//           cells.push(cell);
//           index += cellLen;
//           cursorPosition -= cell.size.outerWidth;
//         }
//         return cells;
//       }

//       _containSlides() {
//         if (
//           this.options.contain &&
//           !this.options.wrapAround &&
//           this.cells.length
//         ) {
//           const marginRight = RtlT4s ? 'marginRight' : 'marginLeft';
//           const marginLeft = RtlT4s ? 'marginLeft' : 'marginRight';
//           const lastCellSize = this.getLastCell().size[marginLeft];
//           const totalWidth = this.slideableWidth - lastCellSize;
//           const isSmallerThanContainer = totalWidth < this.size.innerWidth;
//           const cursorOffset =
//             this.cursorPosition + this.cells[0].size[marginRight];
//           const maxTarget =
//             totalWidth - this.size.innerWidth * (1 - this.cellAlign);

//           this.slides.forEach((slide) => {
//             if (isSmallerThanContainer) {
//               slide.target = totalWidth * this.cellAlign;
//             } else {
//               slide.target = Math.max(slide.target, cursorOffset);
//               slide.target = Math.min(slide.target, maxTarget);
//             }
//           });
//         }
//       }

//       getLastCell() {
//         return this.cells[this.cells.length - 1]; // Adjust as necessary
//       }

//       dispatchEvent(eventType, eventData, additionalData) {
//         const eventPayload = eventData
//           ? [eventData, ...additionalData]
//           : additionalData;

//         // Emit the event
//         this.emitEvent(eventType, eventPayload);

//         // Trigger jQuery event if applicable
//         if (jQuary && this.$element) {
//           let eventWithNamespace =
//             eventType + (this.options.namespaceJQueryEvents ? '.flickity' : '');

//           if (eventData) {
//             const jQueryEvent = new jQuary.Event(eventData);
//             jQueryEvent.type = eventWithNamespace;
//             eventWithNamespace = jQueryEvent;
//           }
//           this.$element.trigger(eventWithNamespace, additionalData);
//         }
//       }

//       select(index, useWrap = false, shouldAnimate = false) {
//         if (this.isActive) {
//           index = parseInt(index, 10);
//           this._wrapSelect(index);

//           // Apply wrapping if options allow
//           if (this.options.wrapAround || useWrap) {
//             index = utils.modulo(index, this.slides.length);
//           }

//           if (this.slides[index]) {
//             const previousIndex = this.selectedIndex;
//             this.selectedIndex = index;

//             this.updateSelectedSlide();

//             // Position or animate based on the flag
//             shouldAnimate
//               ? this.positionSliderAtSelected()
//               : this.startAnimation();

//             // Adjust height if needed
//             if (this.options.adaptiveHeight) {
//               this.setGallerySize();
//             }

//             // Set previous/next buttons and dispatch events
//             this.setPrevNextButtons();
//             this.dispatchEvent('select', null, [index]);

//             if (index !== previousIndex) {
//               this.dispatchEvent('change', null, [index]);
//             }

//             this.dispatchEvent('cellSelect');
//           }
//         }
//       }
//       _wrapSelect(index) {
//         const slideCount = this.slides.length;

//         // If wrapAround is not enabled or only one slide exists, return the index
//         if (!(this.options.wrapAround && slideCount > 1)) {
//           return index;
//         }

//         const wrappedIndex = utils.modulo(index, slideCount);
//         const distanceToSelected = Math.abs(wrappedIndex - this.selectedIndex);
//         const distanceToNextWrap = Math.abs(
//           wrappedIndex + slideCount - this.selectedIndex
//         );
//         const distanceToPrevWrap = Math.abs(
//           wrappedIndex - slideCount - this.selectedIndex
//         );

//         // Adjust the index based on drag selection and distances
//         if (!this.isDragSelect) {
//           if (distanceToNextWrap < distanceToSelected) {
//             index += slideCount;
//           } else if (distanceToPrevWrap < distanceToSelected) {
//             index -= slideCount;
//           }
//         }

//         // Adjust x position based on the new index
//         if (index < 0) {
//           this.x -= this.slideableWidth;
//         } else if (index >= slideCount) {
//           this.x += this.slideableWidth;
//         }

//         return index; // Return the adjusted index if needed
//       }

//       previous(useWrap, shouldAnimate) {
//         this.select(this.selectedIndex - 1, useWrap, shouldAnimate);
//       }

//       next(useWrap, shouldAnimate) {
//         this.select(this.selectedIndex + 1, useWrap, shouldAnimate);
//       }

//       updateSelectedSlide() {
//         const slide = this.slides[this.selectedIndex];
//         if (slide) {
//           this.unselectSelectedSlide();
//           this.selectedSlide = slide;
//           slide.select();
//           this.selectedCells = slide.cells;
//           this.selectedElements = slide.getCellElements();
//           this.selectedCell = slide.cells[0];
//           this.selectedElement = this.selectedElements[0];
//         }
//       }

//       unselectSelectedSlide() {
//         if (this.selectedSlide) {
//           this.selectedSlide.unselect();
//         }
//       }

//       selectInitialIndex() {
//         const initialIndex = this.options.initialIndex;

//         if (this.isInitActivated) {
//           this.select(this.selectedIndex, false, true);
//         } else {
//           if (
//             initialIndex &&
//             typeof initialIndex === 'string' &&
//             this.queryCell(initialIndex)
//           ) {
//             this.selectCell(initialIndex, false, true);
//             return;
//           }

//           let indexToSelect = 0;
//           if (initialIndex && this.slides[initialIndex]) {
//             indexToSelect = initialIndex;
//           }
//           this.select(indexToSelect, false, true);
//         }
//       }

//       selectCell(cellIdentifier, shouldAnimate = false, shouldUpdate = false) {
//         const cell = this.queryCell(cellIdentifier);

//         if (cell) {
//           const slideIndex = this.getCellSlideIndex(cell);
//           this.select(slideIndex, shouldAnimate, shouldUpdate);
//         }
//       }

//       getCellSlideIndex(cell) {
//         for (let index = 0; index < this.slides.length; index++) {
//           if (this.slides[index].cells.includes(cell)) {
//             return index; // Return the index of the slide containing the cell
//           }
//         }
//         return -1; // Return -1 if the cell is not found in any slide
//       }

//       getCell(element) {
//         for (const i = 0; i < this.cells.length; i++) {
//           const cell = this.cells[e];
//           if (cell.element == element) return i;
//         }
//       }

//       getCells(input) {
//         const cellsArray = []; // Array to hold the cells
//         const elements = this.utils.makeArray(input); // Assuming this.utils.makeArray is a utility function

//         elements.forEach((element) => {
//           const cell = this.getCell(element); // Get cell for the element
//           if (cell) {
//             cellsArray.push(cell); // Add the cell to the array if it exists
//           }
//         });

//         return cellsArray; // Return the array of cells
//       }

//       getCellElements = function () {
//         return this.cells.map((c) => c.element);
//       };

//       getParentCell(element) {
//         let cell = this.getCell(element); // Try to get the cell directly
//         if (!cell) {
//           // If not found, try to get the parent element with a specific selector
//           const parentElement = this.utils.getParent(
//             element,
//             '.flickity-slider > *'
//           );
//           cell = this.getCell(parentElement); // Attempt to get the cell from the parent
//         }
//         return cell; // Return the found cell or undefined
//       }

//       getAdjacentCellElements(t, e) {
//         if (!t) {
//           return this.selectedSlide.getCellElements(); // Return cell elements of the selected slide
//         }

//         e = typeof e === 'undefined' ? this.selectedIndex : e; // Default to selectedIndex if e is not provided
//         const i = this.slides.length; // Total number of slides

//         // If the range exceeds total slides, return all cell elements
//         if (1 + 2 * t >= i) {
//           return this.getCellElements(); // Assuming getCellElements is another method that returns all cell elements
//         }

//         const adjacentCells = []; // Array to hold adjacent cell elements

//         // Get cell elements from the adjacent slides
//         for (let s = e - t; s <= e + t; s++) {
//           const r = this.options.wrapAround ? this.utils.modulo(s, i) : s; // Handle wrapping
//           const slide = this.slides[r]; // Get the slide at the computed index
//           if (slide) {
//             adjacentCells.push(...slide.getCellElements()); // Concatenate cell elements
//           }
//         }

//         return adjacentCells; // Return the array of adjacent cell elements
//       }

//       queryCell(t) {
//         if (typeof t === 'number') {
//           return this.cells[t]; // Return cell by index
//         }
//         if (typeof t === 'string') {
//           if (t.match(/^[#.]?[\d/]/)) {
//             return; // Invalid query
//           }
//           t = this.element.querySelector(t); // Query cell element
//         }
//         return this.getCell(t); // Assume getCell is defined elsewhere
//       }

//       uiChange() {
//         this.emitEvent('uiChange');
//       }

//       childUIPointerDown(t) {
//         if (t.type !== 'touchstart') {
//           t.preventDefault();
//         }
//         this.focus();
//       }

//       onresize() {
//         this.watchCSS();
//         this.resize();
//       }

//       resize() {
//         if (this.isActive && !this.isAnimating && !this.isDragging) {
//           this.getSize();
//           if (this.options.wrapAround) {
//             this.x = this.utils.modulo(this.x, this.slideableWidth);
//           }
//           this.positionCells(); // Assume defined elsewhere
//           this._getWrapShiftCells(); // Assume defined elsewhere
//           this.setGallerySize(); // Assume defined elsewhere
//           this.setPrevNextButtons(); // Assume defined elsewhere
//           this.emitEvent('resize');
//           const t = this.selectedElements && this.selectedElements[0];
//           this.selectCell(t, false, true); // Assume defined elsewhere
//         }
//       }

//       keyboardHandlers = {
//         37: () => {
//           const step = RtlT4s ? 'next' : 'previous';
//           this.uiChange();
//           this[step]();
//         },
//         39: () => {
//           const step = RtlT4s ? 'previous' : 'next';
//           this.uiChange();
//           this[step]();
//         },
//       };

//       watchCSS() {
//         if (this.options.watchCSS) {
//           if (
//             window
//               .getComputedStyle(this.element, ':after')
//               .content.indexOf('flickity') !== -1
//           ) {
//             this.activate(); // Assume defined elsewhere
//           } else {
//             this.deactivate();
//           }
//         }
//       }

//       onkeydown(t) {
//         const e =
//           document.activeElement && document.activeElement !== this.element;
//         if (this.options.accessibility && !e) {
//           const handler = this.keyboardHandlers[t.keyCode];
//           if (handler) {
//             handler.call(this); // Call the keyboard handler
//           }
//         }
//       }

//       focus() {
//         const val = global.pageYOffset;
//         this.element.focus({ preventScroll: true });
//         if (global.pageYOffset !== val) {
//           global.scrollTo(global.pageXOffset, val); // Scroll back to the original position
//         }
//       }

//       deactivate() {
//         if (this.isActive) {
//           this.element.classList.remove('flickity-enabled');
//           this.element.classList.remove('flickity-rtl');
//           this.unselectSelectedSlide();
//           this.cells.forEach((cell) => cell.destroy());
//           this.element.removeChild(this.viewport);
//           appendElements(this.slider.children, this.element);
//           if (this.options.accessibility) {
//             this.element.removeAttribute('tabIndex');
//             this.element.removeEventListener('keydown', this);
//           }
//           this.isActive = false;
//           this.emitEvent('deactivate');
//         }
//       }

//       destroy() {
//         this.deactivate();
//         jquery.removeEventListener('resize', this);
//         this.allOff();
//         this.emitEvent('destroy');
//         this.$element && jquery.removeData(this.element, 'flickity');
//         delete this.element.flickityt4sGUID;
//         delete this.instances[this.guid]; // Assuming an instances object to track Flickity instances
//       }

//       data(elem) {
//         const element = utils.getQueryElement(elem);
//         return element && element.flickityt4sGUID
//           ? this.instances[element.flickityt4sGUID]
//           : null;
//       }

//       activate() {
//         if (!this.isActive) {
//           this.isActive = true;
//           this.element.classList.add('flickity-enabled');
//           if (window.RtlT4s) {
//             this.element.classList.add('flickity-rtl');
//           }

//           // Set size and position cells
//           this.getSize();
//           appendElements(
//             this._filterFindCellElements(this.element.children),
//             this.slider
//           );
//           this.viewport.appendChild(this.slider);
//           this.element.appendChild(this.viewport);

//           // Reload cells and setup accessibility
//           this.reloadCells();
//           if (this.options.accessibility) {
//             this.element.tabIndex = 0;
//             this.element.addEventListener('keydown', this);
//           }

//           this.emitEvent('activate');
//           this.selectInitialIndex();
//           this.isInitActivated = true;
//           this.dispatchEvent('ready');
//         }
//       }

//       getSize() {
//         this.size = getSize(this.element);
//         this.setCellAlign();
//         this.cursorPosition = this.size.innerWidth * this.cellAlign;
//       }

//       setCellAlign() {
//         const alignments = {
//           center: { left: 0.5, right: 0.5 },
//           left: { left: 0, right: 1 },
//           right: { right: 0, left: 1 },
//         };

//         this.cellAlign =
//           alignments[this.options.cellAlign]?.[this.originSide] ??
//           this.options.cellAlign;
//       }

//       resize() {
//         if (this.isActive && !this.isAnimating && !this.isDragging) {
//           this.getSize();
//           if (this.options.wrapAround) {
//             this.x = utils.modulo(this.x, this.slideableWidth);
//           }
//           this.positionCells();
//           this.setGallerySize();
//           this.setPrevNextButtons();
//           this.emitEvent('resize');
//         }
//       }
//     }

//     utils.extend(Flickityt4s.prototype, EvEmitter.prototype);
//     utils.extend(Flickityt4s.prototype, Animate);
//     utils.htmlInit(Flickityt4s, 'flickity');

//     if (jQuary && jQuary.bridget) {
//       jQuary.bridget('flickity', Flickityt4s);
//     }

//     return Flickityt4s;
//   }
// );

// (function (t, e) {
//   'function' == typeof define && define.amd
//     ? define(
//         'flickityt4s/js/drag',
//         ['./flickityt4s', 'unidragger/unidragger', 'fizzy-ui-utils/utils'],
//         function (i, n, o) {
//           return e(t, i, n, o);
//         }
//       )
//     : 'object' == typeof module && module.exports
//     ? (module.exports = e(
//         t,
//         require('./flickityt4s'),
//         require('unidragger'),
//         require('fizzy-ui-utils')
//       ))
//     : (t.Flickityt4s = e(t, t.Flickityt4s, t.Unidragger, t.fizzyUIUtils));
// })(window, function (t, e, i, n) {
//   function o() {
//     return {
//       x: t.pageXOffset,
//       y: t.pageYOffset,
//     };
//   }
//   n.extend(e.defaults, {
//     draggable: '>1',
//     dragThreshold: 3,
//   }),
//     e.createMethods.push('_createDrag');
//   var s = e.prototype;
//   n.extend(s, i.prototype),
//     (s._touchActionValue = 'pan-y'),
//     (s._createDrag = function () {
//       this.on('activate', this.onActivateDrag),
//         this.on('uiChange', this._uiChangeDrag),
//         this.on('deactivate', this.onDeactivateDrag),
//         this.on('cellChange', this.updateDraggable);
//     }),
//     (s.onActivateDrag = function () {
//       (this.handles = [this.viewport]),
//         this.bindHandles(),
//         this.updateDraggable();
//     }),
//     (s.onDeactivateDrag = function () {
//       this.unbindHandles(), this.element.classList.remove('is-draggable');
//     }),
//     (s.updateDraggable = function () {
//       '>1' == this.options.draggable
//         ? (this.isDraggable = this.slides.length > 1)
//         : 'smart' == this.options.draggable
//         ? (this.viewport,
//           (this.isDraggable =
//             this.viewport.scrollWidth > this.viewport.offsetWidth))
//         : (this.isDraggable = this.options.draggable),
//         this.isDraggable
//           ? this.element.classList.add('is-draggable')
//           : this.element.classList.remove('is-draggable');
//     }),
//     (s.bindDrag = function () {
//       (this.options.draggable = !0), this.updateDraggable();
//     }),
//     (s.unbindDrag = function () {
//       (this.options.draggable = !1), this.updateDraggable();
//     }),
//     (s._uiChangeDrag = function () {
//       delete this.isFreeScrolling;
//     }),
//     (s.pointerDown = function (e, i) {
//       this.isDraggable
//         ? this.okayPointerDown(e) &&
//           (this._pointerDownPreventDefault(e),
//           this.pointerDownFocus(e),
//           document.activeElement != this.element && this.pointerDownBlur(),
//           (this.dragX = this.x),
//           this.viewport.classList.add('is-pointer-down'),
//           (this.pointerDownScroll = o()),
//           t.addEventListener('scroll', this),
//           this._pointerDownDefault(e, i))
//         : this._pointerDownDefault(e, i);
//     }),
//     (s._pointerDownDefault = function (t, e) {
//       (this.pointerDownPointer = {
//         pageX: e.pageX,
//         pageY: e.pageY,
//       }),
//         this._bindPostStartEvents(t),
//         this.dispatchEvent('pointerDown', t, [e]);
//     });
//   var r = {
//     INPUT: !0,
//     TEXTAREA: !0,
//     SELECT: !0,
//   };
//   return (
//     (s.pointerDownFocus = function (t) {
//       r[t.target.nodeName] || this.focus();
//     }),
//     (s._pointerDownPreventDefault = function (t) {
//       var e = 'touchstart' == t.type,
//         i = 'touch' == t.pointerType,
//         n = r[t.target.nodeName];
//       e || i || n || t.preventDefault();
//     }),
//     (s.hasDragStarted = function (t) {
//       return Math.abs(t.x) > this.options.dragThreshold;
//     }),
//     (s.pointerUp = function (t, e) {
//       delete this.isTouchScrolling,
//         this.viewport.classList.remove('is-pointer-down'),
//         this.dispatchEvent('pointerUp', t, [e]),
//         this._dragPointerUp(t, e);
//     }),
//     (s.pointerDone = function () {
//       t.removeEventListener('scroll', this), delete this.pointerDownScroll;
//     }),
//     (s.dragStart = function (e, i) {
//       this.isDraggable &&
//         ((this.dragStartPosition = this.x),
//         this.startAnimation(),
//         t.removeEventListener('scroll', this),
//         this.dispatchEvent('dragStart', e, [i]));
//     }),
//     (s.pointerMove = function (t, e) {
//       var i = this._dragPointerMove(t, e);
//       this.dispatchEvent('pointerMove', t, [e, i]), this._dragMove(t, e, i);
//     }),
//     (s.dragMove = function (t, e, i) {
//       if (this.isDraggable) {
//         t.preventDefault(), (this.previousDragX = this.dragX);
//         var n = RtlT4s ? -1 : 1;
//         this.options.wrapAround && (i.x %= this.slideableWidth);
//         var o = this.dragStartPosition + i.x * n;
//         if (!this.options.wrapAround && this.slides.length) {
//           var s = Math.max(-this.slides[0].target, this.dragStartPosition);
//           o = o > s ? 0.5 * (o + s) : o;
//           var r = Math.min(-this.getLastSlide().target, this.dragStartPosition);
//           o = o < r ? 0.5 * (o + r) : o;
//         }
//         (this.dragX = o),
//           (this.dragMoveTime = new Date()),
//           this.dispatchEvent('dragMove', t, [e, i]);
//       }
//     }),
//     (s.dragEnd = function (t, e) {
//       if (this.isDraggable) {
//         this.options.freeScroll && (this.isFreeScrolling = !0);
//         var i = this.dragEndRestingSelect();
//         if (this.options.freeScroll && !this.options.wrapAround) {
//           var n = this.getRestingPosition();
//           this.isFreeScrolling =
//             -n > this.slides[0].target && -n < this.getLastSlide().target;
//         } else
//           this.options.freeScroll ||
//             i != this.selectedIndex ||
//             (i += this.dragEndBoostSelect());
//         delete this.previousDragX,
//           (this.isDragSelect = this.options.wrapAround),
//           this.select(i),
//           delete this.isDragSelect,
//           this.dispatchEvent('dragEnd', t, [e]);
//       }
//     }),
//     (s.dragEndRestingSelect = function () {
//       var t = this.getRestingPosition(),
//         e = Math.abs(this.getSlideDistance(-t, this.selectedIndex)),
//         i = this._getClosestResting(t, e, 1),
//         n = this._getClosestResting(t, e, -1);
//       return i.distance < n.distance ? i.index : n.index;
//     }),
//     (s._getClosestResting = function (t, e, i) {
//       for (
//         var n = this.selectedIndex,
//           o = 1 / 0,
//           s =
//             this.options.contain && !this.options.wrapAround
//               ? function (t, e) {
//                   return t <= e;
//                 }
//               : function (t, e) {
//                   return t < e;
//                 };
//         s(e, o) &&
//         ((n += i), (o = e), null !== (e = this.getSlideDistance(-t, n)));

//       )
//         e = Math.abs(e);
//       return {
//         distance: o,
//         index: n - i,
//       };
//     }),
//     (s.getSlideDistance = function (t, e) {
//       var i = this.slides.length,
//         o = this.options.wrapAround && i > 1,
//         s = o ? n.modulo(e, i) : e,
//         r = this.slides[s];
//       if (!r) return null;
//       var a = o ? this.slideableWidth * Math.floor(e / i) : 0;
//       return t - (r.target + a);
//     }),
//     (s.dragEndBoostSelect = function () {
//       if (
//         void 0 === this.previousDragX ||
//         !this.dragMoveTime ||
//         new Date() - this.dragMoveTime > 100
//       )
//         return 0;
//       var t = this.getSlideDistance(-this.dragX, this.selectedIndex),
//         e = this.previousDragX - this.dragX;
//       return t > 0 && e > 0 ? 1 : t < 0 && e < 0 ? -1 : 0;
//     }),
//     (s.staticClick = function (t, e) {
//       var i = this.getParentCell(t.target),
//         n = i && i.element,
//         o = i && this.cells.indexOf(i);
//       this.dispatchEvent('staticClick', t, [e, n, o]);
//     }),
//     (s.onscroll = function () {
//       var t = o(),
//         e = this.pointerDownScroll.x - t.x,
//         i = this.pointerDownScroll.y - t.y;
//       (Math.abs(e) > 3 || Math.abs(i) > 3) && this._pointerDone();
//     }),
//     e
//   );
// });

// (function (window, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/prev-next-button', [
//       './flickityt4s',
//       'unipointer/unipointer',
//       'fizzy-ui-utils/utils',
//     ], (flickity, unipointer, utils) =>
//       factory(window, flickity, unipointer, utils));
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       window,
//       require('./flickityt4s'),
//       require('unipointer'),
//       require('fizzy-ui-utils')
//     );
//   } else {
//     factory(window, window.Flickityt4s, window.Unipointer, window.fizzyUIUtils);
//   }
// })(window, (window, Flickity, Unipointer, utils) => {
//   'use strict';

//   class PrevNextButton extends Unipointer {
//     constructor(direction, parent) {
//       super();
//       this.direction = direction;
//       this.parent = parent;
//       this._create();
//     }

//     static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

//     _create() {
//       this.isEnabled = true;
//       this.isPrevious = this.direction === -1;
//       const t = this.parent.options.rightToLeft ? 1 : -1;
//       this.isLeft = this.direction === t;

//       this.element = document.createElement('button');
//       this.element.className = `flickity-button flickity-prev-next-button ${
//         this.isPrevious ? 'previous' : 'next'
//       }`;
//       this.element.setAttribute('type', 'button');
//       this.disable();
//       this.element.setAttribute(
//         'aria-label',
//         this.isPrevious ? 'Previous' : 'Next'
//       );

//       const svgElement = this.createSVG();
//       this.element.appendChild(svgElement);

//       this.parent.on('select', this.update.bind(this));
//       this.on('pointerDown', this.parent.childUIPointerDown.bind(this.parent));
//     }

//     activate() {
//       this.bindStartEvent(this.element);
//       this.element.addEventListener('click', this);
//       this.parent.element.appendChild(this.element);
//     }

//     deactivate() {
//       this.parent.element.removeChild(this.element);
//       this.unbindStartEvent(this.element);
//       this.element.removeEventListener('click', this);
//     }

//     createSVG() {
//       const svg = document.createElementNS(PrevNextButton.SVG_NAMESPACE, 'svg');
//       svg.setAttribute('class', 'flickity-button-icon');
//       svg.setAttribute('viewBox', '0 0 100 100');

//       const path = document.createElementNS(
//         PrevNextButton.SVG_NAMESPACE,
//         'path'
//       );
//       const d = this.createPathData(this.parent.options.arrowShape);
//       path.setAttribute('d', d);
//       path.setAttribute('class', 'arrow');
//       if (!this.isLeft) {
//         path.setAttribute('transform', 'translate(100, 100) rotate(180)');
//       }
//       svg.appendChild(path);
//       return svg;
//     }

//     createPathData(shape) {
//       return typeof shape === 'string'
//         ? shape
//         : `M ${shape.x0},50 L ${shape.x1},${shape.y1 + 50} L ${shape.x2},${
//             shape.y2 + 50
//           } L ${shape.x3},50 L ${shape.x2},${50 - shape.y2} L ${shape.x1},${
//             50 - shape.y1
//           } Z`;
//     }

//     handleEvent(event) {
//       utils.handleEvent.bind(this)(event);
//     }

//     onclick() {
//       if (this.isEnabled) {
//         this.parent.uiChange();
//         const action = this.isPrevious ? 'previous' : 'next';
//         this.parent[action]();
//       }
//     }

//     enable() {
//       if (!this.isEnabled) {
//         this.element.disabled = false;
//         this.isEnabled = true;
//       }
//     }

//     disable() {
//       if (this.isEnabled) {
//         this.element.disabled = true;
//         this.isEnabled = false;
//       }
//     }

//     update() {
//       const prefix = this.isPrevious ? 'prev_' : 'next_';
//       this.parent.element.classList.remove(
//         `flickity_${prefix}disable`,
//         `flickity_${prefix}enable`
//       );

//       const slides = this.parent.slides;
//       if (this.parent.options.wrapAround && slides.length > 1) {
//         this.enable();
//       } else {
//         const lastIndex = slides.length ? slides.length - 1 : 0;
//         const boundaryIndex = this.isPrevious ? 0 : lastIndex;
//         const state =
//           this.parent.selectedIndex === boundaryIndex ? 'disable' : 'enable';
//         this[state]();
//         this.parent.element.classList.add(`flickity_${prefix}${state}`);
//       }
//     }

//     destroy() {
//       this.deactivate();
//       this.allOff();
//     }
//   }

//   // Extending defaults
//   utils.extend(Flickity.defaults, {
//     prevNextButtons: true,
//     arrowShape: {
//       x0: 10,
//       x1: 60,
//       y1: 50,
//       x2: 70,
//       y2: 40,
//       x3: 30,
//     },
//   });

//   Flickity.createMethods.push('_createPrevNextButtons');

//   const flickityPrototype = Flickity.prototype;

//   flickityPrototype._createPrevNextButtons = function () {
//     if (this.options.prevNextButtons) {
//       this.prevButton = new PrevNextButton(-1, this);
//       this.nextButton = new PrevNextButton(1, this);
//       this.on('activate', this.activatePrevNextButtons);
//     }
//   };

//   flickityPrototype.activatePrevNextButtons = function () {
//     this.prevButton.activate();
//     this.nextButton.activate();
//     this.on('deactivate', this.deactivatePrevNextButtons);
//   };

//   flickityPrototype.deactivatePrevNextButtons = function () {
//     this.prevButton.deactivate();
//     this.nextButton.deactivate();
//     this.off('deactivate', this.deactivatePrevNextButtons);
//   };

//   Flickity.PrevNextButton = PrevNextButton;
//   return Flickity;
// });

// (function (window, factory) {
//   'use strict';
//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/page-dots', [
//       './flickityt4s',
//       'unipointer/unipointer',
//       'fizzy-ui-utils/utils',
//     ], (flickity, unipointer, utils) =>
//       factory(window, flickity, unipointer, utils));
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       window,
//       require('./flickityt4s'),
//       require('unipointer'),
//       require('fizzy-ui-utils')
//     );
//   } else {
//     factory(window, window.Flickityt4s, window.Unipointer, window.fizzyUIUtils);
//   }
// })(window, (window, Flickity, Unipointer, utils) => {
//   'use strict';

//   class PageDots extends Unipointer {
//     constructor(parent) {
//       super();
//       this.parent = parent;
//       this._create();
//     }

//     _create() {
//       this.holder = document.createElement('ol');
//       this.holder.className = 'flickity-page-dots';
//       this.dots = [];
//       this.handleClick = this.onClick.bind(this);
//       this.on('pointerDown', this.parent.childUIPointerDown.bind(this.parent));
//     }

//     activate() {
//       this.setDots();
//       this.holder.addEventListener('click', this.handleClick);
//       this.bindStartEvent(this.holder);
//       this.parent.element.appendChild(this.holder);
//     }

//     deactivate() {
//       this.holder.removeEventListener('click', this.handleClick);
//       this.unbindStartEvent(this.holder);
//       this.parent.element.removeChild(this.holder);
//     }

//     setDots() {
//       const dotDifference = this.parent.slides.length - this.dots.length;
//       if (dotDifference > 0) {
//         this.addDots(dotDifference);
//       } else if (dotDifference < 0) {
//         this.removeDots(-dotDifference);
//       }
//     }

//     addDots(count) {
//       const fragment = document.createDocumentFragment();
//       const newDots = [];
//       const currentCount = this.dots.length;

//       for (let i = currentCount; i < currentCount + count; i++) {
//         const dot = document.createElement('li');
//         dot.className = 'dot';
//         dot.setAttribute('aria-label', `Page dot ${i + 1}`);
//         fragment.appendChild(dot);
//         newDots.push(dot);
//       }

//       this.holder.appendChild(fragment);
//       this.dots = [...this.dots, ...newDots];
//     }

//     removeDots(count) {
//       this.dots.splice(this.dots.length - count, count).forEach((dot) => {
//         this.holder.removeChild(dot);
//       });
//     }

//     updateSelected() {
//       if (this.selectedDot) {
//         this.selectedDot.className = 'dot';
//         this.selectedDot.removeAttribute('aria-current');
//       }

//       if (this.dots.length) {
//         this.selectedDot = this.dots[this.parent.selectedIndex];
//         this.selectedDot.className = 'dot is-selected';
//         this.selectedDot.setAttribute('aria-current', 'step');
//       }
//     }

//     onClick(event) {
//       const target = event.target;
//       if (target.nodeName === 'LI') {
//         this.parent.uiChange();
//         const index = this.dots.indexOf(target);
//         this.parent.select(index);
//       }
//     }

//     destroy() {
//       this.deactivate();
//       this.allOff();
//     }
//   }

//   // Extending defaults
//   utils.extend(Flickity.defaults, {
//     pageDots: true,
//   });

//   Flickity.createMethods.push('_createPageDots');

//   const flickityPrototype = Flickity.prototype;

//   flickityPrototype._createPageDots = function () {
//     if (this.options.pageDots) {
//       this.pageDots = new PageDots(this);
//       this.on('activate', this.activatePageDots);
//       this.on('select', this.updateSelectedPageDots);
//       this.on('cellChange', this.updatePageDots);
//       this.on('resize', this.updatePageDots);
//       this.on('deactivate', this.deactivatePageDots);
//     }
//   };

//   flickityPrototype.activatePageDots = function () {
//     this.pageDots.activate();
//   };

//   flickityPrototype.updateSelectedPageDots = function () {
//     this.pageDots.updateSelected();
//   };

//   flickityPrototype.updatePageDots = function () {
//     this.pageDots.setDots();
//   };

//   flickityPrototype.deactivatePageDots = function () {
//     this.pageDots.deactivate();
//   };

//   Flickity.PageDots = PageDots;
//   return Flickity;
// });

// (function (window, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/player', [
//       'ev-emitter/ev-emitter',
//       'fizzy-ui-utils/utils',
//       './flickityt4s',
//     ], (evEmitter, utils, flickity) => factory(evEmitter, utils, flickity));
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       require('ev-emitter'),
//       require('fizzy-ui-utils'),
//       require('./flickityt4s')
//     );
//   } else {
//     factory(window.EvEmitter, window.fizzyUIUtils, window.Flickityt4s);
//   }
// })(window, (EvEmitter, utils, Flickity) => {
//   'use strict';

//   class Player {
//     constructor(parent) {
//       this.parent = parent;
//       this.state = 'stopped';
//       this.onVisibilityChange = this.visibilityChange.bind(this);
//       this.onVisibilityPlay = this.visibilityPlay.bind(this);
//     }

//     play() {
//       if (this.state !== 'playing') {
//         if (document.hidden) {
//           document.addEventListener('visibilitychange', this.onVisibilityPlay);
//         } else {
//           this.state = 'playing';
//           document.addEventListener(
//             'visibilitychange',
//             this.onVisibilityChange
//           );
//           this.tick();
//         }
//       }
//     }

//     tick() {
//       if (this.state === 'playing') {
//         const autoPlayDuration =
//           typeof this.parent.options.autoPlay === 'number'
//             ? this.parent.options.autoPlay
//             : 3000;
//         this.clear();

//         this.timeout = setTimeout(() => {
//           this.parent.next(true);
//           this.tick();
//         }, autoPlayDuration);
//       }
//     }

//     stop() {
//       this.state = 'stopped';
//       this.clear();
//       document.removeEventListener('visibilitychange', this.onVisibilityChange);
//     }

//     clear() {
//       clearTimeout(this.timeout);
//     }

//     pause() {
//       if (this.state === 'playing') {
//         this.state = 'paused';
//         this.clear();
//       }
//     }

//     unpause() {
//       if (this.state === 'paused') {
//         this.play();
//       }
//     }

//     visibilityChange() {
//       this[document.hidden ? 'pause' : 'unpause']();
//     }

//     visibilityPlay() {
//       this.play();
//       document.removeEventListener('visibilitychange', this.onVisibilityPlay);
//     }
//   }

//   // Extending defaults
//   utils.extend(Flickity.defaults, {
//     pauseAutoPlayOnHover: true,
//   });

//   Flickity.createMethods.push('_createPlayer');

//   const flickityPrototype = Flickity.prototype;

//   flickityPrototype._createPlayer = function () {
//     this.player = new Player(this);
//     this.on('activate', this.activatePlayer);
//     this.on('uiChange', this.stopPlayer);
//     this.on('pointerDown', this.stopPlayer);
//     this.on('deactivate', this.deactivatePlayer);
//   };

//   flickityPrototype.activatePlayer = function () {
//     if (this.options.autoPlay) {
//       this.player.play();
//       this.element.addEventListener('mouseenter', this);
//     }
//   };

//   flickityPrototype.playPlayer = function () {
//     this.player.play();
//   };

//   flickityPrototype.stopPlayer = function () {
//     this.player.stop();
//   };

//   flickityPrototype.pausePlayer = function () {
//     this.player.pause();
//   };

//   flickityPrototype.unpausePlayer = function () {
//     this.player.unpause();
//   };

//   flickityPrototype.deactivatePlayer = function () {
//     this.player.stop();
//     this.element.removeEventListener('mouseenter', this);
//   };

//   flickityPrototype.onmouseenter = function () {
//     if (this.options.pauseAutoPlayOnHover) {
//       this.player.pause();
//       this.element.addEventListener('mouseleave', this);
//     }
//   };

//   flickityPrototype.onmouseleave = function () {
//     this.player.unpause();
//     this.element.removeEventListener('mouseleave', this);
//   };

//   Flickity.Player = Player;
//   return Flickity;
// });

// (function (window, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/add-remove-cell', [
//       './flickityt4s',
//       'fizzy-ui-utils/utils',
//     ], (flickity, utils) => factory(window, flickity, utils));
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       window,
//       require('./flickityt4s'),
//       require('fizzy-ui-utils')
//     );
//   } else {
//     factory(window, window.Flickityt4s, window.fizzyUIUtils);
//   }
// })(window, (window, Flickity, utils) => {
//   'use strict';

//   const flickityPrototype = Flickity.prototype;

//   flickityPrototype.insert = function (elements, index) {
//     const cells = this._makeCells(elements);
//     if (cells && cells.length) {
//       const totalCells = this.cells.length;
//       index = index === undefined ? totalCells : index;

//       const fragment = document.createDocumentFragment();
//       cells.forEach((cell) => fragment.appendChild(cell.element));

//       const isAtEnd = index === totalCells;

//       if (isAtEnd) {
//         this.slider.appendChild(fragment);
//       } else {
//         const referenceCell = this.cells[index].element;
//         this.slider.insertBefore(fragment, referenceCell);
//       }

//       if (index === 0) {
//         this.cells = cells.concat(this.cells);
//       } else if (isAtEnd) {
//         this.cells = this.cells.concat(cells);
//       } else {
//         const splicedCells = this.cells.splice(index, totalCells - index);
//         this.cells = this.cells.concat(cells).concat(splicedCells);
//       }

//       this._sizeCells(cells);
//       this.cellChange(index, true);
//     }
//   };

//   flickityPrototype.append = function (elements) {
//     this.insert(elements, this.cells.length);
//   };

//   flickityPrototype.prepend = function (elements) {
//     this.insert(elements, 0);
//   };

//   flickityPrototype.remove = function (elements) {
//     const cellsToRemove = this.getCells(elements);
//     if (cellsToRemove && cellsToRemove.length) {
//       let lastCellIndex = this.cells.length - 1;
//       cellsToRemove.forEach((cell) => {
//         cell.remove();
//         const index = this.cells.indexOf(cell);
//         lastCellIndex = Math.min(index, lastCellIndex);
//         utils.removeFrom(this.cells, cell);
//       });
//       this.cellChange(lastCellIndex, true);
//     }
//   };

//   flickityPrototype.cellSizeChange = function (cell) {
//     const targetCell = this.getCell(cell);
//     if (targetCell) {
//       targetCell.getSize();
//       const index = this.cells.indexOf(targetCell);
//       this.cellChange(index);
//     }
//   };

//   flickityPrototype.cellChange = function (index, shouldPosition) {
//     const selectedElement = this.selectedElement;
//     this._positionCells(index);
//     this._getWrapShiftCells();
//     this.setGallerySize();
//     this.setPrevNextButtons();

//     const currentCell = this.getCell(selectedElement);
//     if (currentCell) {
//       this.selectedIndex = this.getCellSlideIndex(currentCell);
//     }
//     this.selectedIndex = Math.min(this.slides.length - 1, this.selectedIndex);
//     this.emitEvent('cellChange', [index]);
//     this.select(this.selectedIndex);

//     if (shouldPosition) {
//       this.positionSliderAtSelected();
//     }
//   };

//   return Flickity;
// });

// (function (window, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s/js/index', [
//       './flickityt4s',
//       './drag',
//       './prev-next-button',
//       './page-dots',
//       './player',
//       './add-remove-cell',
//       './lazyload',
//     ], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(
//       require('./flickityt4s'),
//       require('./drag'),
//       require('./prev-next-button'),
//       require('./page-dots'),
//       require('./player'),
//       require('./add-remove-cell'),
//       require('./lazyload')
//     );
//   }
// })(window, (Flickity) => {
//   return Flickity;
// });

// (function (window, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define('flickityt4s-as-nav-for/as-nav-for', [
//       'flickityt4s/js/index',
//       'fizzy-ui-utils/utils',
//     ], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
//   } else {
//     window.Flickityt4s = factory(window.Flickityt4s, window.fizzyUIUtils);
//   }
// })(window, (Flickity, fizzyUIUtils) => {
//   'use strict';

//   Flickity.createMethods.push('_createAsNavFor');

//   const prototype = Flickity.prototype;

//   prototype._createAsNavFor = function () {
//     this.on('activate', this.activateAsNavFor);
//     this.on('deactivate', this.deactivateAsNavFor);
//     this.on('destroy', this.destroyAsNavFor);

//     const asNavFor = this.options.asNavFor;
//     if (asNavFor) {
//       setTimeout(() => this.setNavCompanion(asNavFor));
//     }
//   };

//   prototype.setNavCompanion = function (navFor) {
//     navFor = fizzyUIUtils.getQueryElement(navFor);
//     const navData = Flickity.data(navFor);

//     if (navData && navData !== this) {
//       this.navCompanion = navData;

//       this.onNavCompanionSelect = () => this.navCompanionSelect();
//       navData.on('select', this.onNavCompanionSelect);
//       this.on('staticClick', this.onNavStaticClick);
//       this.navCompanionSelect(true);
//     }
//   };

//   prototype.navCompanionSelect = function (isInitial) {
//     const selectedCells = this.navCompanion && this.navCompanion.selectedCells;

//     if (selectedCells) {
//       const firstCellIndex = this.navCompanion.cells.indexOf(selectedCells[0]);
//       const lastCellIndex = firstCellIndex + selectedCells.length - 1;
//       const cellIndex = Math.floor(
//         (lastCellIndex - firstCellIndex) * this.navCompanion.cellAlign +
//           firstCellIndex
//       );

//       if (this.selectCell(cellIndex, false, isInitial)) {
//         this.removeNavSelectedElements();

//         if (cellIndex < this.cells.length) {
//           const navCells = this.cells.slice(firstCellIndex, lastCellIndex + 1);
//           this.navSelectedElements = navCells.map((cell) => cell.element);
//           this.changeNavSelectedClass('add');
//         }
//       }
//     }
//   };

//   prototype.changeNavSelectedClass = function (action) {
//     this.navSelectedElements.forEach((element) => {
//       element.classList[action]('is-nav-selected');
//     });
//   };

//   prototype.activateAsNavFor = function () {
//     this.navCompanionSelect(true);
//   };

//   prototype.removeNavSelectedElements = function () {
//     if (this.navSelectedElements) {
//       this.changeNavSelectedClass('remove');
//       delete this.navSelectedElements;
//     }
//   };

//   prototype.onNavStaticClick = function (event, pointer, cell, index) {
//     if (typeof index === 'number') {
//       this.navCompanion.selectCell(index);
//     }
//   };

//   prototype.deactivateAsNavFor = function () {
//     this.removeNavSelectedElements();
//   };

//   prototype.destroyAsNavFor = function () {
//     if (this.navCompanion) {
//       this.navCompanion.off('select', this.onNavCompanionSelect);
//       this.off('staticClick', this.onNavStaticClick);
//       delete this.navCompanion;
//     }
//   };

//   return Flickity;
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
//   } else {
//     factory(global.Flickityt4s, global.fizzyUIUtils);
//   }
// })(window, (Flickity, fizzyUIUtils) => {
//   'use strict';

//   const Slide = Flickity.Slide;
//   const originalUpdateTarget = Slide.prototype.updateTarget;

//   Slide.prototype.updateTarget = function () {
//     originalUpdateTarget.apply(this, arguments);
//     if (this.parent.options.fade) {
//       const offset = this.target - this.x;
//       const firstCellX = this.cells[0].x;

//       this.cells.forEach((cell) => {
//         const position = cell.x - firstCellX - offset;
//         cell.renderPosition(position);
//       });
//     }
//   };

//   Slide.prototype.setOpacity = function (opacity) {
//     this.cells.forEach((cell) => {
//       cell.element.style.opacity = opacity;
//     });
//   };

//   const FlickityProto = Flickity.prototype;
//   Flickity.createMethods.push('_createFade');

//   FlickityProto._createFade = function () {
//     this.fadeIndex = this.selectedIndex;
//     this.prevSelectedIndex = this.selectedIndex;

//     this.on('select', this.onSelectFade);
//     this.on('dragEnd', this.onDragEndFade);
//     this.on('settle', this.onSettleFade);
//     this.on('activate', this.onActivateFade);
//     this.on('deactivate', this.onDeactivateFade);
//   };

//   const originalUpdateSlides = FlickityProto.updateSlides;

//   FlickityProto.updateSlides = function () {
//     originalUpdateSlides.apply(this, arguments);
//     if (this.options.fade) {
//       // Additional fade logic can be added here if necessary
//     }
//   };

//   FlickityProto.onSelectFade = function () {
//     this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
//     this.prevSelectedIndex = this.selectedIndex;
//   };

//   FlickityProto.onSettleFade = function () {
//     delete this.didDragEnd;
//     if (this.options.fade) {
//       // Additional settle logic can be added here if necessary
//     }
//   };

//   FlickityProto.onDragEndFade = function () {
//     this.didDragEnd = true;
//   };

//   FlickityProto.onActivateFade = function () {
//     if (this.options.fade) {
//       this.element.classList.add('is-fade');
//     }
//   };

//   FlickityProto.onDeactivateFade = function () {
//     if (this.options.fade) {
//       this.element.classList.remove('is-fade');
//       this.slides.forEach((slide) => slide.setOpacity(''));
//     }
//   };

//   const originalPositionSlider = FlickityProto.positionSlider;

//   FlickityProto.positionSlider = function () {
//     if (this.options.fade) {
//       this.fadeSlides();
//       this.dispatchScrollEvent();
//     } else {
//       originalPositionSlider.apply(this, arguments);
//     }
//   };

//   const originalPositionSliderAtSelected =
//     FlickityProto.positionSliderAtSelected;

//   FlickityProto.positionSliderAtSelected = function () {
//     if (this.options.fade) {
//       this.setTranslateX(0);
//     }
//     originalPositionSliderAtSelected.apply(this, arguments);
//   };

//   FlickityProto.fadeSlides = function () {
//     // Logic for fading slides can be implemented here if needed
//     if (this.slides.length) {
//       // Fading logic implementation
//     }
//   };

//   FlickityProto.getFadeIndexes = function () {
//     return this.isDragging || this.didDragEnd
//       ? this.options.wrapAround
//         ? this.getFadeDragWrapIndexes()
//         : this.getFadeDragLimitIndexes()
//       : { a: this.fadeIndex, b: this.selectedIndex };
//   };

//   FlickityProto.getFadeDragWrapIndexes = function () {
//     const distances = this.slides.map((slide, index) =>
//       this.getSlideDistance(-this.x, index)
//     );
//     const absoluteDistances = distances.map(Math.abs);
//     const minDistance = Math.min(...absoluteDistances);
//     const minIndex = absoluteDistances.indexOf(minDistance);
//     const slideDistance = distances[minIndex];
//     const totalSlides = this.slides.length;
//     const direction = slideDistance >= 0 ? 1 : -1;

//     return {
//       a: minIndex,
//       b: fizzyUIUtils.modulo(minIndex + direction, totalSlides),
//     };
//   };

//   FlickityProto.getFadeDragLimitIndexes = function () {
//     let lastVisibleIndex = 0;
//     for (let i = 0; i < this.slides.length - 1; i++) {
//       if (-this.x < this.slides[i].target) {
//         break;
//       }
//       lastVisibleIndex = i;
//     }
//     return {
//       a: lastVisibleIndex,
//       b: lastVisibleIndex + 1,
//     };
//   };

//   FlickityProto.wrapDifference = function (a, b) {
//     let difference = b - a;
//     if (!this.options.wrapAround) {
//       return difference;
//     }

//     const wrappedPlus = difference + this.slideableWidth;
//     const wrappedMinus = difference - this.slideableWidth;

//     if (Math.abs(wrappedPlus) < Math.abs(difference)) {
//       difference = wrappedPlus;
//     }
//     if (Math.abs(wrappedMinus) < Math.abs(difference)) {
//       difference = wrappedMinus;
//     }

//     return difference;
//   };

//   const originalGetWrapShiftCells = FlickityProto._getWrapShiftCells;

//   FlickityProto._getWrapShiftCells = function () {
//     if (!this.options.fade) {
//       originalGetWrapShiftCells.apply(this, arguments);
//     }
//   };

//   const originalShiftWrapCells = FlickityProto.shiftWrapCells;

//   FlickityProto.shiftWrapCells = function () {
//     if (!this.options.fade) {
//       originalShiftWrapCells.apply(this, arguments);
//     }
//   };

//   return Flickity;
// });

// (function (global, factory) {
//   'use strict';

//   if (typeof define === 'function' && define.amd) {
//     define(['flickityt4s/js/index', 'fizzy-ui-utils/utils'], factory);
//   } else if (typeof module === 'object' && module.exports) {
//     module.exports = factory(require('flickityt4s'), require('fizzy-ui-utils'));
//   } else {
//     global.Flickityt4s = factory(global.Flickityt4s, global.fizzyUIUtils);
//   }
// })(window, (Flickity, fizzyUIUtils) => {
//   'use strict';

//   Flickity.createMethods.push('_createSync');

//   Flickity.prototype._createSync = function () {
//     this.syncers = {};
//     const syncOption = this.options.sync;

//     this.on('destroy', this.unsyncAll);

//     if (syncOption) {
//       setTimeout(() => {
//         this.sync(syncOption);
//       });
//     }
//   };

//   Flickity.prototype.sync = function (syncElement) {
//     syncElement = fizzyUIUtils.getQueryElement(syncElement);
//     const syncFlickity = Flickity.data(syncElement);

//     if (syncFlickity) {
//       this._syncCompanion(syncFlickity);
//       syncFlickity._syncCompanion(this);
//     }
//   };

//   Flickity.prototype._syncCompanion = function (companion) {
//     const selectListener = () => {
//       const currentIndex = this.selectedIndex;
//       if (companion.selectedIndex !== currentIndex) {
//         companion.select(currentIndex);
//       }
//     };

//     this.on('select', selectListener);
//     this.syncers[companion.guid] = {
//       flickityt4s: companion,
//       listener: selectListener,
//     };
//   };

//   Flickity.prototype.unsync = function (syncElement) {
//     syncElement = fizzyUIUtils.getQueryElement(syncElement);
//     const syncFlickity = Flickity.data(syncElement);
//     this._unsync(syncFlickity);
//   };

//   Flickity.prototype._unsync = function (companion) {
//     if (companion) {
//       this._unsyncCompanion(companion);
//       companion._unsyncCompanion(this);
//     }
//   };

//   Flickity.prototype._unsyncCompanion = function (companion) {
//     const guid = companion.guid;
//     const syncData = this.syncers[guid];

//     this.off('select', syncData.listener);
//     delete this.syncers[guid];
//   };

//   Flickity.prototype.unsyncAll = function () {
//     for (const key in this.syncers) {
//       if (Object.prototype.hasOwnProperty.call(this.syncers, key)) {
//         const { flickityt4s } = this.syncers[key];
//         this._unsync(flickityt4s);
//       }
//     }
//   };

//   return Flickity;
// });

/*!
 * $script.js JS loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz 2014 | License MIT
 */
(function (e, t) {
  typeof module != 'undefined' && module.exports
    ? (module.exports = t())
    : typeof define == 'function' && define.amd
    ? define(t)
    : (this[e] = t());
})('$script', function () {
  function p(e, t) {
    for (var n = 0, i = e.length; n < i; ++n) if (!t(e[n])) return r;
    return 1;
  }
  function d(e, t) {
    p(e, function (e) {
      return t(e), 1;
    });
  }
  function v(e, t, n) {
    function g(e) {
      return e.call ? e() : u[e];
    }
    function y() {
      if (!--h) {
        (u[o] = 1), s && s();
        for (var e in f) p(e.split('|'), g) && !d(f[e], g) && (f[e] = []);
      }
    }
    e = e[i] ? e : [e];
    var r = t && t.call,
      s = r ? t : n,
      o = r ? e.join('') : t,
      h = e.length;
    return (
      setTimeout(function () {
        d(e, function t(e, n) {
          if (e === null) return y();
          !n &&
            !/^https?:\/\//.test(e) &&
            c &&
            (e = e.indexOf('.js') === -1 ? c + e + '.js' : c + e);
          if (l[e])
            return (
              o && (a[o] = 1),
              l[e] == 2
                ? y()
                : setTimeout(function () {
                    t(e, !0);
                  }, 0)
            );
          (l[e] = 1), o && (a[o] = 1), m(e, y);
        });
      }, 0),
      v
    );
  }
  function m(n, r) {
    var i = e.createElement('script'),
      u;
    (i.onload =
      i.onerror =
      i[o] =
        function () {
          if ((i[s] && !/^c|loade/.test(i[s])) || u) return;
          (i.onload = i[o] = null), (u = 1), (l[n] = 2), r();
        }),
      (i.async = 1),
      (i.src = h ? n + (n.indexOf('?') === -1 ? '?' : '&') + h : n),
      t.insertBefore(i, t.lastChild);
  }
  var e = document,
    t = e.getElementsByTagName('head')[0],
    n = 'string',
    r = !1,
    i = 'push',
    s = 'readyState',
    o = 'onreadystatechange',
    u = {},
    a = {},
    f = {},
    l = {},
    c,
    h;
  return (
    (v.get = m),
    (v.order = function (e, t, n) {
      (function r(i) {
        (i = e.shift()), e.length ? v(i, r) : v(i, t, n);
      })();
    }),
    (v.path = function (e) {
      c = e;
    }),
    (v.urlArgs = function (e) {
      h = e;
    }),
    (v.ready = function (e, t, n) {
      e = e[i] ? e : [e];
      var r = [];
      return (
        !d(e, function (e) {
          u[e] || r[i](e);
        }) &&
        p(e, function (e) {
          return u[e];
        })
          ? t()
          : !(function (e) {
              (f[e] = f[e] || []), f[e][i](t), n && n(r);
            })(e.join('|')),
        v
      );
    }),
    (v.done = function (e) {
      v([null], e);
    }),
    v
  );
});
// (function (global, factory) {
//   'use strict';
//   if (typeof module !== 'undefined' && module.exports) {
//     module.exports = factory();
//   } else if (typeof define === 'function' && define.amd) {
//     define(factory);
//   } else {
//     global.$script = factory();
//   }
// })(window, () => {
//   'use strict';

//   const scriptRegistry = {};
//   const scriptStatus = {};
//   const activeScripts = {};
//   const scriptLoadQueue = {};
//   let basePath, urlArgs;
//   const documentHead = document.getElementsByTagName('head')[0];

//   const loadScript = (scripts, onComplete, finalCallback) => {
//     scripts = Array.isArray(scripts) ? scripts : [scripts];
//     const hasOnCompleteCallback = onComplete && onComplete.call;
//     const finalCallbackReference = hasOnCompleteCallback
//       ? onComplete
//       : finalCallback;
//     const combinedKey = hasOnCompleteCallback ? scripts.join('') : onComplete;
//     let remainingScripts = scripts.length;

//     const resolveItem = (item) =>
//       typeof item.call === 'function' ? item() : scriptRegistry[item];

//     const checkCompletion = () => {
//       if (--remainingScripts === 0) {
//         scriptRegistry[combinedKey] = true;
//         if (finalCallbackReference) finalCallbackReference();
//         for (const key in scriptLoadQueue) {
//           if (
//             key.split('|').every((item) => resolveItem(item)) &&
//             !scriptLoadQueue[key].forEach((item) => resolveItem(item))
//           ) {
//             scriptLoadQueue[key] = [];
//           }
//         }
//       }
//     };
//     setTimeout(() => {
//       scripts.forEach((scriptUrl, index) => {
//         if (scriptUrl === null) {
//           checkCompletion();
//         } else {
//           if (!index && !/^https?:\/\//.test(scriptUrl) && basePath) {
//             scriptUrl =
//               scriptUrl.indexOf('.js') === -1
//                 ? `${basePath}${scriptUrl}.js`
//                 : `${basePath}${scriptUrl}`;
//           }
//           if (activeScripts[scriptUrl]) {
//             if (combinedKey) scriptStatus[combinedKey] = true;
//             if (activeScripts[scriptUrl] === 2) {
//               checkCompletion();
//             } else {
//               setTimeout(() => {
//                 scriptUrl.every((item) => item[false]);
//               }, 0);
//             }
//           } else {
//             activeScripts[scriptUrl] = true;
//             if (combinedKey) scriptStatus[combinedKey] = true;
//             fetchScript(scriptUrl, checkCompletion);
//           }
//         }
//       });
//     }, 0);

//     return loadScript;
//   };

//   const fetchScript = (src, onLoad) => {
//     let called = false;
//     const scriptElement = document.createElement('script');

//     scriptElement.onload =
//       scriptElement.onerror =
//       scriptElement.onreadystatechange =
//         () => {
//           if (
//             scriptElement.readyState &&
//             !/^c|loade/.test(scriptElement.readyState || called)
//           ) {
//             scriptElement.onload = scriptElement.onreadystatechange = null;
//             called = true;
//             activeScripts[src] = 2;
//             onLoad();
//           }
//         };

//     scriptElement.async = true;
//     scriptElement.src = urlArgs
//       ? `${src}${src.indexOf('?') === -1 ? '?' : '&'}${urlArgs}`
//       : src;
//     documentHead.insertBefore(scriptElement, documentHead.lastChild);
//   };

//   loadScript.get = fetchScript;

//   loadScript.order = (scripts, onComplete, finalCallback) => {
//     (function loadNext() {
//       const nextScript = scripts.shift();
//       if (scripts.length) {
//         loadScript(nextScript, loadNext);
//       } else {
//         loadScript(nextScript, onComplete, finalCallback);
//       }
//     })();
//   };

//   loadScript.path = (path) => {
//     basePath = path;
//   };

//   loadScript.urlArgs = (args) => {
//     urlArgs = args;
//   };

//   loadScript.ready = (dependencies, onReady, onNotReady) => {
//     const unresolved = [];

//     if (
//       !(dependencies = Array.isArray(dependencies)
//         ? dependencies
//         : [dependencies]).forEach((dependency) => {
//         scriptRegistry[dependency] || unresolved.push(dependency);
//       }) &&
//       dependencies.every((dependency) => scriptRegistry[dependency])
//     ) {
//       onReady();
//     } else {
//       unresolved.forEach((dependency) => {
//         scriptLoadQueue[dependency] = scriptLoadQueue[dependency] || [];
//         scriptLoadQueue[dependency].push(onReady);
//         if (onNotReady) onNotReady(unresolved);
//       });
//     }

//     return loadScript;
//   };

//   loadScript.done = function (callback) {
//     loadScript([null], callback);
//   };

//   return loadScript;
// });

/*! js-cookie v3.0.1 | MIT
 * https://github.com/js-cookie/js-cookie
 */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : ((e = e || self),
      (function () {
        var n = e.Cookies,
          o = (e.Cookies = t());
        o.noConflict = function () {
          return (e.Cookies = n), o;
        };
      })());
})(this, function () {
  'use strict';
  function e(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var o in n) e[o] = n[o];
    }
    return e;
  }
  return (function t(n, o) {
    function r(t, r, i) {
      if ('undefined' != typeof document) {
        'number' == typeof (i = e({}, o, i)).expires &&
          (i.expires = new Date(Date.now() + 864e5 * i.expires)),
          i.expires && (i.expires = i.expires.toUTCString()),
          (t = encodeURIComponent(t)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape));
        var c = '';
        for (var u in i)
          i[u] &&
            ((c += '; ' + u), !0 !== i[u] && (c += '=' + i[u].split(';')[0]));
        return (document.cookie = t + '=' + n.write(r, t) + c);
      }
    }
    return Object.create(
      {
        set: r,
        get: function (e) {
          if ('undefined' != typeof document && (!arguments.length || e)) {
            for (
              var t = document.cookie ? document.cookie.split('; ') : [],
                o = {},
                r = 0;
              r < t.length;
              r++
            ) {
              var i = t[r].split('='),
                c = i.slice(1).join('=');
              try {
                var u = decodeURIComponent(i[0]);
                if (((o[u] = n.read(c, u)), e === u)) break;
              } catch (e) {}
            }
            return e ? o[e] : o;
          }
        },
        remove: function (t, n) {
          r(t, '', e({}, n, { expires: -1 }));
        },
        withAttributes: function (n) {
          return t(this.converter, e({}, this.attributes, n));
        },
        withConverter: function (n) {
          return t(e({}, this.converter, n), this.attributes);
        },
      },
      {
        attributes: { value: Object.freeze(o) },
        converter: { value: Object.freeze(n) },
      }
    );
  })(
    {
      read: function (e) {
        return (
          '"' === e[0] && (e = e.slice(1, -1)),
          e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
        );
      },
      write: function (e) {
        return encodeURIComponent(e).replace(
          /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
          decodeURIComponent
        );
      },
    },
    { path: '/' }
  );
});
var CookiesT4 = Cookies.noConflict();
// (function (global = global || self, factory) {
//   if (typeof exports === 'object' && typeof module !== 'undefined') {
//     module.exports = factory();
//   } else if (typeof define === 'function' && define.amd) {
//     define(factory);
//   } else {
//     const previousCookies = global.Cookies;
//     global.Cookies = factory();
//     global.Cookies.noConflict = function () {
//       global.Cookies = previousCookies;
//       return factory();
//     };
//   }
// })(window, function () {
//   'use strict';

//   function extend(target, ...sources) {
//     sources.forEach((source) => {
//       for (const key in source) {
//         target[key] = source[key];
//       }
//     });
//     return target;
//   }

//   return (function createCookies(converter, attributes) {
//     function setCookie(name, value, options) {
//       if (typeof document !== 'undefined') {
//         options = extend({}, attributes, options);
//         if (typeof options.expires === 'number') {
//           options.expires = new Date(Date.now() + 864e5 * options.expires);
//         }
//         if (options.expires) {
//           options.expires = options.expires.toUTCString();
//         }
//         name = encodeURIComponent(name)
//           .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
//           .replace(/[()]/g, escape);
//         let cookieString = '';

//         for (const key in options) {
//           if (options[key]) {
//             cookieString += `; ${key}`;
//             if (options[key] !== true) {
//               cookieString += `=${options[key].split(';')[0]}`;
//             }
//           }
//         }
//         document.cookie = `${name}=${converter.write(
//           value,
//           name
//         )}${cookieString}`;
//       }
//     }

//     return Object.create(
//       {
//         set: setCookie,
//         get(name) {
//           if (typeof document !== 'undefined' && (!arguments.length || name)) {
//             const cookiesArray = document.cookie
//               ? document.cookie.split('; ')
//               : [];
//             const cookiesObject = {};

//             cookiesArray.forEach((cookie) => {
//               const [key, ...rest] = cookie.split('=');
//               const value = rest.join('=');
//               try {
//                 const decodedKey = decodeURIComponent(key);
//                 cookiesObject[decodedKey] = converter.read(value, decodedKey);
//                 if (name === decodedKey) {
//                   return cookiesObject[name]; // Break loop if we found the desired cookie
//                 }
//               } catch (error) {
//                 // Handle decoding error if needed
//               }
//             });
//             return name ? cookiesObject[name] : cookiesObject;
//           }
//         },
//         remove(name, options) {
//           setCookie(name, '', extend({}, options, { expires: -1 }));
//         },
//         withAttributes(attrs) {
//           return createCookies(
//             this.converter,
//             extend({}, this.attributes, attrs)
//           );
//         },
//         withConverter(converter) {
//           return createCookies(
//             extend({}, this.converter, converter),
//             this.attributes
//           );
//         },
//       },
//       {
//         attributes: {
//           value: Object.freeze(attributes),
//         },
//         converter: {
//           value: Object.freeze(converter),
//         },
//       }
//     );
//   })(
//     {
//       read(value) {
//         return value.startsWith('"')
//           ? value.slice(1, -1)
//           : value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
//       },
//       write(value) {
//         return encodeURIComponent(value).replace(
//           /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
//           decodeURIComponent
//         );
//       },
//     },
//     {
//       path: '/',
//     }
//   );
// });

// // Exporting the noConflict version of the cookies
// window.CookiesT4 = window.Cookies.noConflict();

!(function ($) {
  'use strict';

  function checkStorage(type, isDesignModeEnabled = true) {
    // Return false if we are in an iframe without access to sessionStorage
    // window.self !== window.top
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

  const $window = window.$(window);
  const $document = window.$(document);
  const $body = window.$('body');
  const $html = window.$('html');
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
  window.T4SThemeSP.$appendComponent = window.$('#append-component');
  window.T4SThemeSP.cacheNameFirst = cacheName;
  window.T4SThemeSP.root_url = rootUrl !== '/' ? `${rootUrl}/` : '/';

  // Ensure Shopify is defined
  if (typeof window.Shopify === 'undefined') {
    window.Shopify = {};
  }

  // Shopify utility functions
  window.Shopify.bind = (fn, context) => {
    return function () {
      return fn.apply(context, arguments);
    };
  };

  //done
  window.Shopify.setSelectorByValue = (selectElement, value) => {
    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];
      if (value === option.value || value === option.innerHTML) {
        selectElement.selectedIndex = i;
        return i;
      }
    }
  };

  //done
  window.Shopify.addListener = (target, eventName, callback) => {
    if (target.addEventListener) {
      target.addEventListener(eventName, callback, false);
    } else {
      target.attachEvent(`on${eventName}`, callback);
    }
  };

  //done
  window.Shopify.postLink = (url, options = {}) => {
    const method = options.method || 'post';
    const params = options.parameters || {};
    const form = document.createElement('form');

    form.setAttribute('method', method);
    form.setAttribute('action', url);

    for (const key in params) {
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  //done
  // Country and Province Selector
  window.Shopify.CountryProvinceSelector = class {
    constructor(countryDomId, provinceDomId, options) {
      this.countryEl = document.getElementById(countryDomId);
      this.provinceEl = document.getElementById(provinceDomId);
      this.provinceContainer = document.getElementById(
        options.hideElement || provinceDomId
      );

      window.Shopify.addListener(
        this.countryEl,
        'change',
        window.Shopify.bind(this.countryHandler, this)
      );
      this.initCountry();
      this.initProvince();
    }

    initCountry() {
      const defaultCountry = this.countryEl.getAttribute('data-default');
      window.Shopify.setSelectorByValue(this.countryEl, defaultCountry);
      this.countryHandler();
    }

    initProvince() {
      const defaultProvince = this.provinceEl.getAttribute('data-default');
      if (defaultProvince && this.provinceEl.options.length > 0) {
        window.Shopify.setSelectorByValue(this.provinceEl, defaultProvince);
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
      // This doesn't work in Internet Explorer, where you'll have to do the longhand:
      window.dispatchEvent(new Event('resize'));
    } catch {
      // Fixed in Internet Explorer
      const element = window.document.createEvent('UIEvents');
      element.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(element);
    }
  };

  //done
  // Debounce function
  window.T4SThemeSP.debounce = (delay, fn, immediate) => {
    let timeoutId;
    return function (...args) {
      const context = this;
      const callNow = immediate && !timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!immediate) fn.apply(context, args);
      }, delay);
      if (callNow) fn.apply(context, args);
    };
  };

  //done
  // Retrieve currency from storage
  window.T4SThemeSP.storageCurrency = () => {
    return isStorageSpdLocal ? localStorage.getItem('T4Currency') : null;
  };

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * fullHeight firt Section js
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  //done
  // Set full height for the first section
  window.T4SThemeSP.fullHeightFirtSe = () => {
    const $parent = window.$('#MainContent > .section:first').find('ratio_fh');
    if ($parent.length) {
      const windowHeight = $window.height();
      const elementOffset = $parent.offset().top;
      if (elementOffset < windowHeight) {
        const aspectRatio = 100 - elementOffset / (windowHeight / 100);
        $parent.css('--ts-aspect-ratio-fh', `${aspectRatio}vh`);
        //$element.css("min-height", fullHeight + "vh");
      }
    }
  };

  // T4SThemeSP.preventOverflow = (function() {

  // 	const classAddedHidden = 'is-added-hidden',
  // 	classAddedPadding      = 'is-added-padding',
  // 	resizeEvent            = 'resize.preventOh';

  // 	// if ( $window.scrollTop() > $('#MainContent').offset().top ) {
  // 	// 	$('.t4s-section-header').addClass('shopify-section-header-hidden animate');
  // 	// }

  // 	$body.append(`<style>.${classAddedPadding}{padding-left:var(--pdl-fx) !important;padding-right:var(--pdr-fx) !important}.${classAddedHidden}{overflow-x:hidden !important}body:not(.${classAddedHidden}){overflow-x:visible !important}</style>`);

  // 	function int() {

  //    	const windowWidth2 = viewportWidth;
  //    	$body.addClass(classAddedHidden);
  // 		$(`.${classAddedHidden},.${classAddedPadding}`).removeClass(classAddedHidden+' '+classAddedPadding);

  // 		$('.t4s-section-inner > .t4s-row, .t4s-section-inner >.t4s-container > .t4s-row').each(function( index ) {
  // 			 let $this = $(this),
  // 			 currentWidth = $this.width(),
  // 			 diffWidth = currentWidth - windowWidth2;

  // 			 if ( diffWidth <= 0 ) return;

  // 			 //let $parent = $this.closest('.t4s-container-fluid,.t4s-container-wrap,.t4s-container');
  // 			 let $parent = $this.closest('.t4s-container-fluid,.t4s-container');

  // 			 if ($parent.hasClass('is-not-overflow-important') || ($parent.hasClass('is-not-overflow') && windowWidth2 > 767) ) {
  // 				$parent.addClass(classAddedPadding);
  // 				$parent.css({
  // 				   '--pdl-fx' : diffWidth/2,
  // 				   '--pdr-fx' : diffWidth/2
  // 				});

  // 			 } else {
  // 			 	$parent.addClass(classAddedHidden);
  // 			 }
  // 		});
  //    	$body.removeClass(classAddedHidden);
  // 	}

  //    $window.on(resizeEvent, T4SThemeSP.debounce(300, function() {
  //      int();
  //    }.bind(this)));

  // 	return int;
  // })();

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * flickity js
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  // https://codepen.io/sarus/pen/rNmLBKe
  // https://flickity.metafizzy.co/options.html#selectedattraction-friction
  // T4SThemeSP.Flickityt4s = (function () {

  //    function initEach() {
  //    	return false;
  //    	var $Flickityt4s = $('.flickityt4s:not(.flickityt4s-later):not(.flickityt4s-enabled)');
  //    	if ($Flickityt4s.length == 0) return;

  // $Flickityt4s.each(function() {
  // 	init($(this));
  // });
  //    }

  //    function init(_this) {

  // if (windowWidth <= 1024 && _this.hasClass('disable-owl-mb-true') || _this.length == 0) return;

  // var $carousel    = _this,
  // option           = JSON.parse($carousel.attr("data-flickityt4s-js") || '{}'),
  // Isthumb          = option.isThum || false,
  // IsthumbVertical  = option.IsthumbVertical || false,
  // IdSlider         = option.t4sid || '19041994',
  // $previousButton  = $('.btn__prev--'+IdSlider),
  // $carouselNav     = $('.carousel__nav--'+IdSlider),
  // $nextButton      = $('.btn__next--'+IdSlider),
  // $cellButtonGroup = $('.btn_group--cells'+IdSlider),
  // $cellButtons     = $cellButtonGroup.find('.btn_dott4s'),
  // isWrapAround     = option.wrapAround || false,
  // isWrapAround     = option.wrapAround || false;

  //       // effect slider slide fade parallax distortion
  //       // add fade effect and rtl to option
  //       option.fade = $carousel.hasClass('t4s-slide-eff-fade');
  //       option.rightToLeft = isThemeRTL;

  // // bind event listener first
  // $carousel.on( 'ready.flickityt4s', function() {
  //   //console.log('Flickity ready');
  //   $document.trigger('T4sFlickityEnabled');
  //   if ($carousel.hasClass('slide-ani-distortion')) {
  //   	$document.trigger('T4sFlickityWebgl');
  //   }
  // });

  // // initialize Flickity
  //     $carousel.flickityt4s(option);

  //     var flkty = $carousel.data('flickityt4s');
  // setTimeout(function() {
  // 	$carousel.addClass('t4s-enabled');
  // }, 100);

  //       // custom thums
  //       if (Isthumb || IsthumbVertical) {
  //        $carouselNav.on( 'click', '.t4s-carousel__nav--item', function( event ) {
  //           $carousel.flickityt4s( 'select', $(this).index() );
  //        });
  //       }

  //       // custom navigation UI with jQuery, disabled prev/next buttons
  //       if ($nextButton.length || $cellButtonGroup.length) {
  //      // previous
  //      $previousButton.on( 'click', function() {
  //         $carousel.flickityt4s('previous');
  //      });

  //      // next
  //      $nextButton.on( 'click', function() {
  //         $carousel.flickityt4s('next');
  //      });

  //        // update selected cellButtons
  //        $carousel.on( 'select.flickityt4s', function() {
  //            //console.log('select.flickityt4s')
  //            // update dot selected
  //            $cellButtons.filter('.is-selected').removeClass('is-selected');
  //            $cellButtons.eq( flkty.selectedIndex ).addClass('is-selected');

  //            // enable/disable previous/next buttons
  //            if ( !flkty.cells[ flkty.selectedIndex - 1 ] && !isWrapAround) {
  //              $previousButton.attr( 'disabled', 'disabled' );
  //              $nextButton.removeAttr('disabled'); // <-- remove disabled from the next
  //            } else if ( !flkty.cells[ flkty.selectedIndex +1 ] && !isWrapAround) {
  //              $nextButton.attr( 'disabled', 'disabled' );
  //              $previousButton.removeAttr('disabled'); //<-- remove disabled from the prev
  //            } else {
  //              $previousButton.removeAttr('disabled');
  //              $nextButton.removeAttr('disabled');
  //            }
  //        });

  //        // select cell on button click
  //        $cellButtonGroup.on( 'click', '.btn_dott4s', function() {
  //            $carousel.flickityt4s( 'select', $(this).index() );
  //        });

  //       } // end if

  //       // https://codepen.io/Skoulix/pen/BRJRPd
  //       // Filter flickity: https://codepen.io/jeffglenn/pen/YYwMao
  // if ($carousel.hasClass('slide-eff-parallax')) {

  // 	if (IsScreen767Smaller) {
  //           var img_str = '.t4s-slide .t4s-img-as-bg.t4s-d-md-none';
  // 	} else {
  //           var img_str = '.t4s-slide .t4s-img-as-bg.t4s-d-md-block';
  // 	}

  //          var $imgs =  $carousel.find(img_str);
  //          if ($imgs.length == 0) return

  // 	$carousel.on('scroll.flickityt4s', function(event, progress) {

  // 		flkty.slides.forEach(function(e, i) {
  // 			var img = $imgs[i];

  // 			// var x = 0 === i
  // 			// 	? Math.abs(flkty.x) > flkty.slidesWidth
  // 			// 		? flkty.slidesWidth + flkty.x + flkty.slides[flkty.slides.length - 1].outerWidth + e.target
  // 			// 		: e.target + flkty.x
  // 			// 	: i === flkty.slides.length - 1 && Math.abs(flkty.x) + flkty.slides[i].outerWidth < flkty.slidesWidth
  // 			// 		? e.target - flkty.slidesWidth + flkty.x - flkty.slides[i].outerWidth
  // 			// 		: e.target + flkty.x;

  // 			// img.style.transform = 'translateX( ' + x  + 'px)';
  // 			var x = ( e.target + flkty.x ) * -1/3;
  // 			img.style.transform = 'translateX( ' + x  + 'px)';

  // 		});

  // 	  // flkty.slides.forEach(function (slide, i) {
  // 	  //   var img = $imgs[i];
  // 	  //   var x = (slide.target + flkty.x) * -1/3;
  // 	  //   img.style.backgroundPosition = x + 'px';
  // 	  // });

  // 	  // flkty.slides.forEach( function( slide, i ) {
  // 	  //   var img = $imgs[i];
  // 	  //   var x = ( slide.target + flkty.x ) * -1/3;
  // 	  //   img.style.transform = 'translateX( ' + x  + 'px)';
  // 	  // });

  // 	});
  // } // end if

  //       /**
  //        * https://codepen.io/desandro/pen/bNyrqy
  //        */
  // var $galleryStatus = $('.carousel--status'+IdSlider);

  // if ($galleryStatus.length > 0) {

  // 	var $currentSlide = $galleryStatus.find('[data-current-slide]'),
  // 	$totalNumber      = $galleryStatus.find('[data-total-number]'),
  // 	optionPad         = option.pad || false;

  // 	function updateStatus() {

  // 	  var cellNumber = flkty.selectedIndex + 1,
  // 	      totalNumber = flkty.slides.length;
  // 	  if (optionPad) {
  // 	  	 cellNumber =  pad(cellNumber, 2);
  // 	  	 totalNumber =  pad(totalNumber, 2);
  // 	  }
  // 	  $currentSlide.text( cellNumber );
  // 	  $totalNumber.text( totalNumber );
  // 	}

  // 	// https://stackoverflow.com/questions/6466135/adding-extra-zeros-in-front-of-a-number-using-jquery
  // 	function pad (str, max) {
  // 	  str = str.toString();
  // 	  return str.length < max ? pad("0" + str, max) : str;
  // 	}
  //        updateStatus();
  // 	$carousel.on( 'select.flickityt4s', updateStatus );

  // }

  //    } // end fuction int

  //    return {
  //      initEach: initEach,
  //      init: init
  //    };

  // })();
  //

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Init Helper
   * https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
   * https://www.educative.io/answers/how-to-escape-unescape-html-characters-in-string-in-javascript
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
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

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Init Images
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  //done
  // Images utility
  window.T4SThemeSP.Images = {
    // Preload images
    preloadImages(images) {
      window.$(images).each((_, img) => {
        window.$('<img/>')[0].src = img;
        // Alternatively you could use:
        // (new Image()).src = this;
      });
    },

    /**
     * Find the Shopify image attribute size
     */
    // function imageSize(src) {
    //    if (!src) {
    //      return '620x'; // default based on theme
    //    }

    //    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    //    if (match !== null) {
    //      return match[1];
    //    } else {
    //      return null;
    //    }
    // }

    /**
     * Adds a Shopify size attribute to a URL
     */
    // function getSizedImageUrl(src, size) {
    //    if (!src) {
    //      return src;
    //    }

    //    if (size == null) {
    //      return src;
    //    }

    //    if (size === 'master') {
    //      return this.removeProtocol(src);
    //    }

    //    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    //    if (match != null) {
    //      var prefix = src.split(match[0]);
    //      var suffix = match[0];

    //      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    //    }

    //    return null;
    // }

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

    // function lazyloadImagePath(string) {

    //    if ( string.indexOf('_1x1.') > -1 ) {
    //      return string;
    //    }

    //    var image;
    //    if (string !== null) {
    //      image = string.replace(/(\.[^.]*)$/, "_1x1$1");
    //    }

    //    return image;
    // }

    // Lazy load image path with a width parameter
    lazyloadImagePath(url) {
      return this.removeProtocol(`${url}&width=1`);
    },
  };

  /**
    Follow Impulse
  */
  // http://rocha.la/JavaScript-bitwise-operators-in-practice
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
    eventNameSpaces = {
      select: 'select.carousel',
      clickNavUI: 'click.nav',
      clickDotUI: 'click.dot',
      clickThumb: 'click.thumb',
      destroy: 'destroy.ts',
      resize: '',
    };

    // Support check for smooth scrolling
    supportsSmoothScroll = window.CSS.supports('scroll-behavior', 'smooth');

    // Cell alignment mapping
    cellAlign = {
      start: 'left',
      end: 'right',
    };

    addedThumbIcons = false;
    //done
    constructor(element) {
      this.el = element;
      this.$el = window.$(element);
      this.UID = window.T4SThemeSP.getUID();
      this.eventNamespace.resize = `resize.carousel${this.UID}`;
      const dataOptions = JSON.parse(this.$el.attr('data-flickity-js') || '{}');
      this.args = { ...this.defaultOptions, ...dataOptions };

      this.initialize();
    }

    init() {
      this.currentSlide = this.el.querySelector(this.args.currentSlide);
      this.args.autoPlayT4 && this.autoPlayT4();
      this.$pauseBtn.addClass(this.args.isPlaying);
      if (this.args.callbacks?.onInit) {
        this.args.callbacks.onInit(this.currentSlide);
      }
    }

    slideChange(newIndex) {
      // Match index with child nav
      this.args.thumbNav && this.thumbnailsGoto(newIndex);

      // Optional onChange callback
      if (this.args.callbacks?.onChange) {
        this.args.callbacks.onChange(newIndex);
      }

      // Show/hide arrows depending on selected index
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
      this.args.autoPlayT4 && this.autoPlayT4();

      // Update carousel navigation buttons data attributes
      this.$carousel && this.updateNavButtonDataAttributes();
    }

    autoPlayT4() {
      if (!this.time) {
        this.wrapper?.style.setProperty(
          '--play-carousel-speed',
          `${this.args.autoPlayT4}ms`
        );
        this.time = {};
      }
      // get current time format milliseconds
      const startTime = Date.now();
      // current tim milliseconds plus sale.stayTime
      this.time.START = startTime.getTime();
      this.time.END = startTime + this.args.autoPlayT4;

      this.$pauseBtn.removeClass(this.classNames.isPlaying);
      if (this.isPlaying) {
        clearTimeout(this.stayTimeout);
        this.stayTimeout = setTimeout(() => {
          // console.log('unloadSalesPopup run');
          this.actionsAPI('next', true);
        }, this.args.autoPlayT4);

        //self.$pauseBtn.removeClass(classes.isPlaying)
        clearTimeout(this.pauseBtnTimeout);
        this.pauseBtnTimeout = setTimeout(() => {
          this.$pauseBtn.addClass(this.classNames.isPlaying);
        }, 20);
      }
      this.time.REMAINING = this.args.autoPlayT4;
    }

    afterChange() {
      this.args.thumbNav && this.thumbnailsGoto(this.flkty.selectedIndex);
    }

    destroy() {
      this.$carouselNav
        ?.find(`.${this.classNames.isNavActive}`)
        .remove(this.classNames.isNavActive);
      this.actionsAPI('destroy');
      this.$el.off(this.eventNamespace.destroy);
      $window.off(this.eventNamespace.resize);
    }

    _togglePause() {
      const pauseTitle = this.$pauseBtn.data('pause-title');
      const playTitle = this.$pauseBtn.data('play-title');

      const isPaused = this.pauseBtn.classList.contains(
        this.classNames.isPaused
      );
      if (isPaused) {
        this.pauseBtn.classList.remove(this.classNames.isPaused);
        this.wrapper.classList.remove(this.classNames.isPaused);
        this.updateTooltip(pauseTitle);
        this.isPlaying = true;

        if (this.args.autoPlayT4) {
          this.time.END = Date.now() + this.time.REMAINING;
          this.stayTimeout = setTimeout(() => {
            this.actionsAPI('next', true);
          }, this.time.REMAINING);
        }
      } else {
        this.wrapper.classList.add(this.classNames.isPaused);
        this.pauseBtn.classList.add(this.classNames.isPaused);
        this.updateTooltip(playTitle);
        this.isPlaying = false;

        if (this.args.autoPlayT4) {
          clearTimeout(this.stayTimeout);
          this.time.REMAINING = this.time.END - Date.now();
        }
      }
      this.isPlaying && this.$pauseBtn.addClass(this.classNames.isPlaying);
    }

    actionsAPI(action, force = false) {
      this.$carousel.flickity(action, force);
    }

    _selectChange(t) {
      this.$carousel.on('select.flickity', () => {
        this.$carousel.trigger(this.eventNameSpaces.select);
      });
    }

    // Additional methods can be refactored similarly...

    // Helper functions
    updateTooltip(title) {
      window.$('.tooltip .tooltip-inner').text(title);
      this.$pauseBtn.setAttribute('data-original-title', title);
    }

    pauseAllVideos() {
      const videos = this.$carousel.find('video[autoplay]').length;
      if (videos > 0) {
        this.$carousel.find('video').each((_, video) => video.pause());
      }
    }

    playVideoForCurrentSlide() {
      window.$(this.currentSlide).each((_, element) => {
        const video = window.$(element).find('video')[0];
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

      // standardization start to left, end to right
      this.args.cellAlign = this.cellAlign[cellAlign] || cellAlign;
      this.args.cellAlignLG = this.cellAlign[cellAlignLG] || cellAlignLG;
      // end standardization

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

      // Fix cuon anh khi loop o mobile
      // https://app.clickup.com/t/865bf8pyz
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
      this.$pauseBtn = window.$(this.pauseBtn);
      this.isPlaying = this.args.autoPlay || this.args.autoPlayT4;
      this.args.cellAlignOriginal = this.args.cellAlign;

      this.setupDimensions();
      // Initialize Flickity
      this.$carousel = this.$el.flickity(this.args);
      // get instance
      this.flkty = this.$carousel.data('flickity');
      this.selectedIndex = this.flkty.selectedIndex;

      this.initializeEventListeners();
    }

    slideSelect(index) {}

    // Set flickity-viewport height to first element to
    // avoid awkward page reflows while initializing.
    // Must be added in a `style` tag because element does not exist yet.
    // Slideshow element must have an ID
    avoidReflow(element) {
      if (element.id) {
        let firstChild = element.firstChild;
        while (firstChild && firstChild.nodeType === 3) {
          firstChild = firstChild.nextSibling;
        }
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `#${element.id} .flickity-viewport { height: ${firstChild.offsetHeight}px; }`;
        document.head.appendChild(styleElement);
      }
    }

    setupDimensions() {
      // check cell align responsive
      this.hasMWLG = this.args.minWidthLG !== 19041994;
      if (this.hasMWLG && this.args.minWidthLG <= viewportWidth) {
        this.args.cellAlign = this.args.cellAlignLG;
      }

      // check center slide
      // if (this.args.centerSlide && this.args.wrapAround && this.$el.width() > windowWidth) {
      if (this.args.centerSlide && this.args.wrapAround) {
        this.args.cellAlign = 'center';
        this.args.cellAlignOriginal = 'center';
      }
    }

    initializeEventListeners() {
      // setTimeout(() => this.actionsAPI('resize'), 0);
      setTimeout(() => {
        this.$el.addClass('enabled');
        if (this.args.isSimple) {
          this.actionsAPI('resize');
          setTimeout(() => this.actionsAPI('resize'), 150);
        }
        // Initialize thumb
        //if (self.args.thumbNav) self._initCarouselNav();
      }, 100);

      this._selectChange();

      if (this.isPlaying && this.wrapper && this.pauseBtn) {
        //this.$pauseBtn = $(this.pauseBtn);
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

      // custom navigation UI with jQuery, disabled prev/next buttons
      if (navUI) this._customNavUI();
      // custom dot UI with jQuery
      if (dotUI) this._customDotUI();
      // Parallax Effect
      if (parallax) this._parallaxEffect();
      // Status - eg:1/5
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
      // Reset dimensions on resize
      const thumbVerticalEnabled = this.args.thumbVertical;
      if (viewportWidth < 1025 && thumbVerticalEnabled) {
        this.args.thumbVertical = false;
      }
    }

    _customNavUI($prevButton, $nextButton) {
      const wrapAroundEnabled = this.args.wrapAround || false;

      // Set default selectors for prev and next buttons if not provided
      $prevButton = $prevButton || window.$('.btn__prev--' + this.IdSlider);
      $nextButton = $nextButton || window.$('.btn__next--' + this.IdSlider);

      if ($nextButton.length !== 0) {
        // Customize icons for navigation buttons
        this._customIcon($prevButton, $nextButton);

        // Set up click event for the previous button
        $prevButton
          .off(this.eventNameSpaces.clickNavUI)
          .on(this.eventNameSpaces.clickNavUI, () => {
            this.actionsAPI('previous');
          });

        // Set up click event for the next button
        $nextButton
          .off(this.eventNameSpaces.clickNavUI)
          .on(this.eventNameSpaces.clickNavUI, () => {
            this.actionsAPI('next');
          });

        // Initialize button status based on wrap-around setting
        this._setButtonStatus(wrapAroundEnabled, $prevButton, $nextButton);

        // Update button status on each carousel selection change
        this.$carousel.on(this.eventNameSpaces.select, function () {
          this._setButtonStatus(wrapAroundEnabled, $prevButton, $nextButton);
        });
      }
    }

    _scrollbarDraggableCarousel() {}

    _setButtonStatus(wrapAround, $prevButton, $nextButton) {
      // https://codepen.io/desandro/pen/VLPJqO
      // https://github.com/metafizzy/flickity/issues/289
      // enable/disable previous/next buttons
      // console.log(this.flkty.slides)
      let $carouselParent = $nextButton.closest('[data-tab-active]'),
        currentTarget = this.flkty.selectedCell.target;
      $carouselParent.addClass('prev_next_added'),
        $carouselParent.removeClass('tab_prev_next_disable'),
        this.flkty.slides.length < 2
          ? ($carouselParent.addClass('tab_prev_next_disable'),
            $prevButton.attr('disabled', 'disabled'),
            $nextButton.attr('disabled', 'disabled'))
          : currentTarget !== this.flkty.cells[0].target || wrapAround
          ? currentTarget !== this.flkty.getLastCell().target || wrapAround
            ? ($prevButton.removeAttr('disabled'),
              $nextButton.removeAttr('disabled'))
            : ($nextButton.attr('disabled', 'disabled'),
              $prevButton.removeAttr('disabled'))
          : ($prevButton.attr('disabled', 'disabled'),
            $nextButton.removeAttr('disabled'));
    }

    _customDotUI() {
      const $dotContainer = window.$('.btn_group--cells' + this.IdSlider);

      if ($dotContainer.data('build')) {
        let dotsMarkup = '';
        for (let i = 0; i < this.flkty.slides.length; i++)
          dotsMarkup += `<li class="dot btn_dot" aria-label="${i + 1}"></li>`;
        $dotContainer.html(dotsMarkup);
      }

      const dots = $dotContainer.find('.btn_dot');
      if (dots.length !== 0) {
        dots.eq(this.flkty.selectedIndex).addClass(this.classNames.selected),
          $dotContainer.on(
            this.eventNameSpaces.clickDotUI,
            '.btn_dot',
            (event) => {
              this.$carousel.flickity(
                'select',
                window.$(event.currentTarget).index()
              );
            }
          ),
          this.$carousel.on(this.eventNameSpaces.select, function () {
            dots
              .filter(`.${this.classNames.selected}`)
              .removeClass(this.classNames.selected),
              dots
                .eq(this.flkty.selectedIndex)
                .addClass(this.classNames.selected);
          });
      }
    }

    _parallaxEffect() {
      // https://codepen.io/Skoulix/pen/BRJRPd
      // Filter flickity: https://codepen.io/jeffglenn/pen/YYwMao
      if (this.$carousel.hasClass('slide-eff-parallax')) {
        let imageSelector;
        if (isMobile) imageSelector = '.slide .img-as-bg.d-md-none';
        else imageSelector = '.slide .img-as-bg.d-md-block';

        const backgroundImages = this.$carousel.find(imageSelector);
        if (backgroundImages.length !== 0)
          this.$carousel.on('scroll.flickity', () => {
            this.flkty.slides.forEach((slide, index) => {
              const image = backgroundImages[index];
              const parallaxOffset = (-1 * (slide.target + this.flkty.x)) / 3;
              image.style.transform = 'translateX( ' + parallaxOffset + 'px)';
            });
          });
      }
    }

    // https://codepen.io/desandro/pen/bNyrqy
    _status() {
      const statusContainer = window.$('.carousel--status' + this.IdSlider);
      let currentSlideElement = null;
      let totalSlidesElement = null;
      let padWithZeros = false;
      let currentSlideIndex = 0;
      let totalSlides = 0;

      const updateStatus = () => {
        if (this.flkty.slides !== undefined) {
          currentSlideIndex = this.flkty.selectedIndex + 1;
          totalSlides = this.flkty.slides.length;
          if (padWithZeros) {
            currentSlideIndex = padWithLeadingZeros(currentSlideIndex, 2);
            totalSlides = padWithLeadingZeros(totalSlides, 2);
          }
          currentSlideElement.text(currentSlideIndex);
          totalSlidesElement.text(totalSlides);
        }
      };

      // https://stackoverflow.com/questions/6466135/adding-extra-zeros-in-front-of-a-number-using-jquery
      const padWithLeadingZeros = (value, length) => {
        return (value = value.toString()).length < length
          ? padWithLeadingZeros('0' + value, length)
          : value;
      };

      if (statusContainer.length !== 0) {
        currentSlideElement = statusContainer.find('[data-current-slide]');
        totalSlidesElement = statusContainer.find('[data-total-number]');
        padWithZeros = this.args.pad || false;
        currentSlideIndex = 0;
        totalSlides = 0;

        updateStatus();
        this.$carousel.on(this.eventNameSpaces.select, updateStatus);
      }
    }

    _customIcon($prevButton, $nextButton) {
      const arrowPrev = window.$(
        '<svg class="icon icon--prev"><use href="#icon-arrow-left"></use></svg>'
      );
      const arrowNext = window.$(
        '<svg class="icon icon--next"><use href="#icon-arrow-right"></use></svg>'
      );
      $prevButton.html(arrowPrev);
      $nextButton.html(arrowNext);
    }

    _initCarouselNav() {
      // Initialize carousel navigation element with ID-based selector
      this.$carouselNav = window.$('.carousel__nav--' + this.IdSlider);

      // Check if carousel navigation element exists
      if (this.$carouselNav.length > 0) {
        // Add thumbnails and initial styling if not already done
        if (!this.addedThumbIcons) this.addThumbIcons();

        // Generate thumbnails markup
        this.thumbnailsMarkup();

        // Set initial active class for the selected navigation link
        this.$carouselNavLinks
          .eq(this.args.initialIndex)
          .addClass(this.classNames.isNavActive);

        // Setup previous and next navigation buttons
        this.$carouselNavPrev = window.$(
          `[data-thumb-btn__prev="${this.IdSlider}"]`
        );
        this.$carouselNavNext = window.$(
          `[data-thumb-btn__next="${this.IdSlider}"]`
        );

        // Bind click events to navigation buttons if they exist
        if (this.$carouselNavPrev.length || this.$carouselNavNext.length) {
          this.$carouselNavPrev.on(this.eventNameSpaces.clickThumb, () => {
            this.actionsAPI('previous');
          });
          this.$carouselNavNext.on(this.eventNameSpaces.clickThumb, () => {
            this.actionsAPI('next');
          });
        }

        // Add event listeners for clicking on navigation items
        if (this.args.isFilter) {
          // For filtered view, only select visible navigation items
          this.$carouselNav.on(
            this.eventNameSpaces.clickThumb,
            '.' + this.navItem,
            (event) => {
              let index = this.$carouselNav
                .find(`.${this.classNames.navItem}:visible`)
                .index(window.$(event.currentTarget));
              this.$carousel.flickity('select', index);
            }
          );
        } else {
          // Select item based on index
          this.$carouselNav.on(
            this.eventNameSpaces.clickThumb,
            '.' + this.classNames.navItem,
            (event) => {
              this.$carousel.flickity(
                'select',
                window.$(event.currentTarget).index()
              );
            }
          );
        }
      }
    }

    addThumbIcons() {
      const tmpIcons = window.$('template[data-icons-thumb]');
      // Check if thumbnail icon template exists and append it if necessary
      if (tmpIcons.length > 0) {
        window.T4SThemeSP.$appendComponent.after(tmpIcons.html());
        this.addedThumbIcons = true;
      }
    }

    thumbnailsMarkup() {
      const thumbnailMarkup = '';

      // Generate markup for each main slide element
      this.$el.find('[data-main-slide]').each((_, el) => {
        const $slideElement = window.$(el);
        const isMediaHidden = $slideElement.hasClass('is--media-hide')
          ? 'is--media-hide'
          : '';
        const mediaType = $slideElement.data('media-type');
        const videoHost = $slideElement.data('vhost') || '';
        const groupName = $slideElement.data('grname') || '';
        const groupValue = $slideElement.data('grpvl') || '';
        const imageStyle = $slideElement.find('.ratio').attr('style');
        const imageElement = $slideElement.find('img');
        const imagePath = window.T4SThemeSP.Images.lazyloadImagePath(
          imageElement.attr('data-master') || imageElement.attr('data-src')
        );
        const badge = this.mediaIcons[mediaType + videoHost] || '';

        // Assemble thumbnail markup
        thumbnailMarkup += `<div class="col-item ${
          this.classNames.navItem
        } ${isMediaHidden}" data-grname="${groupName}" data-grpvl="${groupValue}" data-mdtype="${mediaType}" data-vhost="${videoHost}"><div class="ratio carousel__nav-inner bg-11" style="${imageStyle};background: url(${imagePath})"><img alt="${window.T4SThemeSP.escapeHtml(
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
        `.${this.classNames.navItem}:not(.is--media-hide):visible`
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
      const $navContainer = this.$carouselNav.parents('.parent-nav');
      const itemHeight = this.$carouselNav
        .find('.col-item:not(.is--media-hide):visible')
        .outerHeight();

      // Check if navigation needs to be active
      if ($navContainer.outerHeight() + 20 < itemHeight * visibleSlidesCount) {
        $navContainer.addClass('thumb-nav-active');
      } else {
        $navContainer.removeClass('thumb-nav-active');
      }
    }
    _adjustHorizontalNav(visibleSlidesCount) {
      const $navContainer = this.$carouselNav.parents('.parent-nav');
      const itemWidth = this.$carouselNav
        .find('.col-item:not(.is--media-hide):visible')
        .outerWidth();

      // Check if navigation needs to be active
      if ($navContainer.outerWidth() + 20 < itemWidth * visibleSlidesCount) {
        $navContainer.addClass('thumb-nav-active');
      } else {
        $navContainer.removeClass('thumb-nav-active');
      }
    }

    thumbnailsGoto(index) {
      if (this.$carouselNavLinks !== undefined) {
        const navLink = this.$carouselNavLinks.eq(index)[0];
        const scrollDuration = isBehaviorSmooth ? 0 : 350;

        this.$carouselNavScroller = window.$(
          `[data-thumb__scroller="${this.IdSlider}"]`
        );
        this.$carouselNav
          .find(`.${this.classNames.isNavActive}`)
          .removeClass(this.classNames.isNavActive);
        this.$carouselNavLinks.eq(index).addClass(this.classNames.isNavActive);

        if (this.args.thumbVertical) {
          const offsetTop = navLink.offsetTop;
          if (this.supportsSmoothScroll) {
            this.$carouselNavScroller[0].scrollTop = offsetTop - 100;
          } else {
            this.$carouselNavScroller
              .stop()
              .animate({ scrollTop: offsetTop - 100 }, scrollDuration);
          }
        } else {
          const offsetLeft = navLink.offsetLeft;
          if (this.supportsSmoothScroll) {
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
        .find(`.flickity-slider ${this.selectors.productMediaWrapper}`)
        .eq(this.selectedIndex);
      const selectedMedia = this.$el
        .find(`.flickity-slider ${this.selectors.productMediaWrapper}`)
        .eq(e);

      this.selectedIndex = this.flkty.selectedIndex;
      this.$groupBtn.removeAttr('hidden');
      this.$mediaGroup.removeClass(this.classNames.isXrShowing);
      this.flkty.options.draggable = true;

      window.$(this.selectors.productMediaPlay).each((_, el) => {
        el.dispatchEvent(
          new CustomEvent('mediaHidden', { bubbles: true, cancelable: true })
        );
        el.removeAttr(this.selectors.dataMediaPlay);
      });

      if (
        selectedMedia.is('[data-deferred-media]') ||
        selectedMedia.is("[data-media-type='360']")
      ) {
        this.flkty.options.draggable = false;
        this.flkty.updateDraggable();
        if (selectedMedia.is('[data-media-type="model"]')) {
          this.$mediaGroup.addClass(this.classNames.isXrShowing);
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
      this.$carousel.on('update.flickity', (event) => {
        window
          .$(event.currentTarget)
          .flickity('deactivate')
          .flickity('activate');
        if (event.currentTarget.$carouselNav)
          event.currentTarget.thumbnailsMarkup('update');
      });
    }

    // update button next prev when trigger carousel
    _updateBtnTab() {
      const $prevButton = window.$(
        `#btn-tab-smart__prev--${this.args.t4sidTab}`
      );
      const $nextButton = window.$(
        `#btn-tab-smart__next--${this.args.t4sidTab}`
      );

      if ($nextButton.length == 0) return;

      this.$carousel.on('updateBtnTab.flickity', () => {
        $prevButton.off(this.eventNameSpaces.clickNavUI);
        $nextButton.off(this.eventNameSpaces.clickNavUI);
        this._customNavUI($prevButton, $nextButton);
        this._customIcon($prevButton, $nextButton);
      });

      if (this.args.activeTab) {
        this.$carousel.trigger('updateBtnTab.flickity');
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
      const carouselItems = window.$(`[data-carousel-id="${this.IdSlider}"]`);
      if (carouselItems.length === 0) return;

      carouselItems.on('click', (event) => {
        this.$carousel.flickity('select', $(event.currentTarget).index);
      });

      const flickityLinks = this.$carousel.find('[data-flickity-link]');
      this.$carousel.on(this.eventNameSpaces.select, () => {
        carouselItems
          .filter(`.${this.classNames.isActive}`)
          .removeClass(this.classNames.isActive);
        carouselItems
          .eq(this.flkty.selectedIndex)
          .addClass(this.classNames.isActive);

        const url = window.$(this.flkty.selectedElement).data('url');
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
        this.eventNameSpaces.resizeEvent,
        window.T4SThemeSP.debounce(300, () => {
          // check cell align self.flkty.options
          // console.log(self.flkty.options)
          if (this.hasMWLG) {
            this.args.cellAlign =
              this.args.minWidthLG <= viewportWidth
                ? this.args.cellAlignLG
                : this.args.cellAlignOriginal;
          }
          this.actionsAPI('resize');

          if (viewportWidth < 1025 && thumbVertical) {
            this.args.thumbVertical = false;
          } else if (viewportWidth > 1024 && thumbVertical) {
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
      flickityElements.each((_, el) => {
        el.flickity = new window.T4SThemeSP.Carousel(el);
      });
    }
  };

  //done
  // Initialize when an element is visible, then disable observer
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

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * isotope js
   * T4SThemeSP.Isotopet4s.init
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  // https://isotope.metafizzy.co/events.html#isotope-events
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
            initIsotope(window.$(element));
          });
          setupFilters();
        }
      },
      init: initIsotope,
      filter: setupFilters,
    };
  })();

  //done
  // Mobile responsive table
  window.T4SThemeSP.T4SWrappTable = () => {
    window
      .$("table:not('.table-res')")
      .wrap("<div class='table-res-df'></div>");
  };

  //done
  // Accordion mobile interaction
  window.T4SThemeSP.AccordionMobileInt = () => {
    const $accordionElements = window.$('.accordion-mb-true');
    if ($accordionElements.length === 0) return;

    const toggleWidth = $accordionElements.data('w-toggle') || 1024;
    const isMobile = viewportWidth <= toggleWidth;

    $accordionElements
      .toggleClass('type-tabs', !isMobile)
      .toggleClass('type-accordion', isMobile);
  };

  //done
  // Remove cart attributes
  window.T4SThemeSP.CartAttrHidden = () => {
    const $hiddenCartAttrs = window.$('[data-cart-attr-rm]');
    let count = 0;

    if (
      $hiddenCartAttrs.length === 0 ||
      T4Swindow.T4Sconfigsconfigs.CartAttrHidden
    )
      return;
    const intervalId = setInterval(() => {
      $hiddenCartAttrs.val('');
      if (++count === 15) clearInterval(intervalId);
    }, 500);

    $body.on('click', 'button[type=submit][name="checkout"]', () => {
      $hiddenCartAttrs.val('');
    });
  };

  //done
  window.T4SThemeSP.announcement = () => {
    const announcementConfig = {
      bar: '.announcement-bar',
      btnClose: '.announcement-bar__close',
    };

    const $announcementBar = window.$(announcementConfig.bar);
    const version = $announcementBar.attr('data-ver');
    const theme = window.T4Sconfigs.theme;
    const cookieKey = `announcement_${theme}_${version}`;
    const expirationDate = parseInt($announcementBar.attr('data-date'));

    if (
      $announcementBar.length === 0 ||
      window.CookiesT4.get(cookieKey) !== 'closed'
    )
      return;
    const alternateCookieKey = `announcement_${theme}_${
      version === '1_nt' ? '2_nt' : '1_nt'
    }`;
    if (window.CookiesT4.get(alternateCookieKey) === 'closed') {
      window.CookiesT4.remove(alternateCookieKey);
    }

    window.$(announcementConfig.btnClose).on('click', () => {
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
  };

  /**
   *-------------------------------------------------------------------------------------------------------------------------------------------
   * Marquee3k js
   * https://minion-theme-vertical.myshopify.com/
   * https://habitat-main.myshopify.com/
   * 3/0 = Infinity
   * co the tham khao sau: https://github.com/ezekielaquino/Marquee3000/blob/master/marquee3k.js https://bullet1-openthinking.myshopify.com/
   *-------------------------------------------------------------------------------------------------------------------------------------------
   */
  //done
  // Define the Marquee3k class
  window.T4SThemeSP.Marquee3k = class {
    el = null;
    $el = null;
    width = 0;
    UID = 0;
    resizeEvent = '';

    Marquee3kClass = {
      enabled: 'marquee-enabled',
      animation: 'marquee--animation',
      duplicate: 'marquee--duplicate',
    };

    constructor(element) {
      this.el = element;
      this.$el = window.$(element);
      this.UID = window.T4SThemeSP.getUID();
      this.resizeEvent = `resize.marquee${this.UID}`;
      this.marquee3kItem = element.querySelector('.marquee__item');

      // Set a timeout to handle resizing in design mode
      IsDesignMode
        ? setTimeout(this.resizeHandler.bind(this), 100)
        : this.resizeHandler();

      this.$el.addClass(this.Marquee3kClass.enabled);

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
        this.marquee3kItem.classList.remove(this.Marquee3kClass.animation);

        const duplicates = this.el.querySelectorAll(
          `.${this.Marquee3kClass.duplicate}`
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
            this.Marquee3kClass.duplicate,
            this.Marquee3kClass.animation
          );
          this.el.append(clone);
        }

        this.marquee3kItem.classList.add(this.Marquee3kClass.animation);
      }
    }
  };

  //done
  window.T4SThemeSP.initMarquee3k = () => {
    const marquees = window.$('.marquee:not(.marquee-enabled)');
    if (marquees.length > 0) {
      marquees.each((_, el) => {
        el.marquee3k = new window.T4SThemeSP.Marquee3k(el);
      });
    }
  };

  //done
  window.T4SThemeSP.initVarHeight = () => {
    const elements = window.$('[data-get-height]:not(.var-css-enabled)');
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
        const $el = window.$(element);
        $el.closest('.section').css('--var-ts-height', `${$el.height()}px`);
      });
    }
  };

  // Handle form response visibility
  if (window.location.search.includes('_posted=true')) $;
  const recentFormId = localStorage.getItem('recentform') || 'xyz';
  window
    .$(`form:not(${window.location.hash}):not(#${recentFormId})`)
    .each((_, element) => {
      window.$(element).find('[data-ts-response-form]').hide();
    });

  // Hide preview bar if needed
  if (!window.location.href.includes(window.T4Sconfigs.preViewBar)) {
    $html.addClass('is--hidden-previewbar');
  }

  //done
  // Define helper functions
  window.T4SThemeSP.Helpers = {
    // var touchDevice = false;

    // var classes = {
    //   preventScrolling: 'prevent-scrolling'
    // };

    // var scrollPosition = window.pageYOffset;

    // function setTouch() {
    //   touchDevice = true;
    // }

    // function isTouch() {
    //   return touchDevice;
    // }

    // function enableScrollLock() {
    //   scrollPosition = window.pageYOffset;
    //   document.body.style.top = '-' + scrollPosition + 'px';
    //   document.body.classList.add(classes.preventScrolling);
    // }

    // function disableScrollLock() {
    //   document.body.classList.remove(classes.preventScrolling);
    //   document.body.style.removeProperty('top');
    //   window.scrollTo(0, scrollPosition);
    // }

    // function lockMobileScrolling(namespace, element) {
    //   var el = element ? element : $document;
    //   $html.addClass('lock-scroll');
    //   $document.on('touchmove.' + namespace, function(e) {
    //     e.preventDefault();
    //     return true;
    //   });
    // }
    // // T4SThemeSP.Helpers.lockMobileScrolling(namespace);

    // function unlockMobileScrolling(namespace, element) {
    //   $html.removeClass('lock-scroll');
    //   var el = element ? element : $document;
    //   $document.off('touchmove.' + namespace);
    // }
    // function lockMobileScrolling(namespace, element) {
    //   var el = element ? element : document.documentElement;
    //   document.documentElement.classList.add('lock-scroll');
    //   el.on('touchmove' + namespace, function() {
    //     return true;
    //   });
    // }

    // function unlockMobileScrolling(namespace, element) {
    //   document.documentElement.classList.remove('lock-scroll');
    //   var el = element ? element : document.documentElement;
    //   el.off('touchmove' + namespace);
    // }

    // https://gist.github.com/thuijssoon/fd238517b487a45ce78d8f7ddfa7fee9
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
          // The element at the top of its scroll,
          // and the user scrolls down
          if (scrollableElement.scrollTop === 0 && deltaY > 0) {
            event.preventDefault();
          }

          // The element at the bottom of its scroll,
          // and the user scrolls up
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
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
        window.$.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true,
        });
      }
    },

    /* Based on the prepareTransition by Jonathan Snook */
    /* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
    prepareTransition(element) {
      const transitionEndHandler = (event) => {
        event.currentTarget.classList.remove('is-transitioning');
      };

      window.$.addEventListener('transitionend', transitionEndHandler, {
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

    /*!
     * Serialize all form data into a SearchParams string
     * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param  {Node}   form The form to serialize
     * @return {String}      The serialized form data
     */
    // function serialize(form) {
    //     var arr = [];
    //     Array.prototype.slice.call(form.elements).forEach(function(field) {
    //       if (
    //         !field.name ||
    //         field.disabled ||
    //         ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
    //       )
    //         return;
    //       if (field.type === 'select-multiple') {
    //         Array.prototype.slice.call(field.options).forEach(function(option) {
    //           if (!option.selected) return;
    //           arr.push(
    //             encodeURIComponent(field.name) +
    //               '=' +
    //               encodeURIComponent(option.value)
    //           );
    //         });
    //         return;
    //       }
    //       if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
    //         return;
    //       arr.push(
    //         encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
    //       );
    //     });
    //     return arr.join('&');

    // }
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
      // '/assets/mini-cart.css?v=94263984409177095751671607407' to mini-cart.css
      // var stylesheetUrl = stylesheet || theme.stylesheet;
      // https://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
      // https://stackoverflow.com/questions/37807568/get-only-the-image-filename-from-a-url-with-regex [\w-]+.(jpg|png|txt)/g
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
    const closeOverlayElement = window.$('.close-overlay');
    const bodyScrollTarget = '[data-ts-scroll-me]';

    // Open drawer
    const openDrawer = (event, trigger, immediate = false) => {
      if (!isOpen) {
        event && event.preventDefault();
        const options = parseOptions(trigger.attr(drawerOptionsAttr));
        const drawer = immediate ? trigger : window.$(options.id);
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
        let drawer = window.$('.drawer[aria-hidden=false]');
        if (drawer.length > 1) {
          drawer = window.$(trigger.attr('data-drawer-target')) || drawer;
        }
        drawer.attr('aria-hidden', 'true');
        if (window.$('.drawer[aria-hidden=false]').length <= 1) {
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
          openDrawer(event, window.$(event.currentTarget));
          bindCloseEvents();
        }
      );

      // Sidebar trigger
      bindSidebarTrigger();
    };

    // Bind sidebar trigger
    const bindSidebarTrigger = () => {
      const sidebarTrigger = window.$('[data-sidebar-trigger]');
      const sidebarButton = window.$('.btn-sidebar');
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
        closeDrawer(event, window.$(event.currentTarget));
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
        window
          .$(`[${drawerOptionsAttr}*="#${id}"]`)
          .removeAttr(drawerDelayAttr);
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

  //    class tickerHandler extends HTMLElement {
  //   constructor() {
  //     super();
  //     this.width = 0;
  //     this.ticker = this.querySelector('.ticker__container');
  //     Shopify.designMode ? setTimeout(this.resizeHandler.bind(this), 100) : this.resizeHandler();
  //     window.addEventListener("resize", this.resizeHandler.bind(this), false);
  //   }
  //   resizeHandler(){
  //     if(this.width == window.innerWidth) return;
  // 	this.width = window.innerWidth;
  //     this.ticker.classList.remove('ticker--animation');
  //     var boxes = this.querySelectorAll('.ticker--clone');
  //     if(boxes.length){
  //       boxes.forEach(e => e.remove());
  //     }
  //     var length = window.innerWidth / this.ticker.offsetWidth,
  //         clone = false;
  //     length = length==Infinity?5:length;
  //     for(var i=0; i < length; i++){
  //       clone = this.ticker.cloneNode(true);
  //       clone.classList.add('ticker--clone');
  //       clone.classList.add('ticker--animation');
  //       this.append(clone);
  //     }
  //     this.ticker.classList.add('ticker--animation');
  //   }
  // }
  // customElements.define('ticker-section', tickerHandler);
})(window.jQuery || window.$);

// jQuery document ready function
window.$(document).ready(($) => {
  // lazySizesT4 load with 'async' need check loaded to run it
  // if (typeof lazySizesT4 != 'undefined') {
  // 	lazySizesT4.init();
  // } else {

  //    document.addEventListener('lazysizet4s:loaded', function(evt) {
  // 	  // console.log(evt.detail);
  //      lazySizesT4.init();
  //    });
  // }
  // $(document).on('lazyloaded', function(e){
  // 	if ( $(e.target).hasClass('img_first_js') ) {
  //        $(e.target).parent().addClass('t4s-img-loaded')
  // 	}
  // });
  //setTimeout(function(){ $('.img_first_js').addClass('lazyloadt4s') }, 1000);
  // T4SThemeSP.preventOverflow();
  $html.addClass(`browser-${window.jscd.browser} platform-${window.jscd.os}`);
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

  if (window.$('[data-ts-type]').length > 0) {
    window.$script(window.T4Sconfigs.script12d);
  }

  if ('ontouchend' in document) {
    let t = 0;
    const e = () => {
      ++t > 1 && document.removeEventListener('touchend', e);
    };
    document.addEventListener('touchend', e);
  }
});

//done
// Handle window resize event
$window.on('resize', () => {
  window.T4SThemeSP.AccordionMobileInt();
});
