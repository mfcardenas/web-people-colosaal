/*!
 * Tipped - A Complete Javascript Tooltip Solution - v4.5.7
 * (c) 2012-2016 Nick Stakenburg
 *
 * http://www.tippedjs.com
 *
 * License: http://www.tippedjs.com/license
 */
!function (a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof module && module.exports ? module.exports = b(require("jquery")) : a.Tipped = b(jQuery)
}(this, function ($) {
    function degrees(a) {
        return 180 * a / Math.PI
    }

    function radian(a) {
        return a * Math.PI / 180
    }

    function sec(a) {
        return 1 / Math.cos(a)
    }

    function sfcc(a) {
        return String.fromCharCode.apply(String, a.replace(" ", "").split(","))
    }

    function deepExtend(a, b) {
        for (var c in b)b[c] && b[c].constructor && b[c].constructor === Object ? (a[c] = $.extend({}, a[c]) || {}, deepExtend(a[c], b[c])) : a[c] = b[c];
        return a
    }

    function Spin() {
        return this.initialize.apply(this, _slice.call(arguments))
    }

    function Visible() {
        return this.initialize.apply(this, _slice.call(arguments))
    }

    function Skin() {
        this.initialize.apply(this, _slice.call(arguments))
    }

    function Stem() {
        this.initialize.apply(this, _slice.call(arguments))
    }

    function Tooltip() {
        this.initialize.apply(this, _slice.call(arguments))
    }

    function Collection() {
        this.initialize.apply(this, _slice.call(arguments))
    }

    var Tipped = {};
    $.extend(Tipped, {version: "4.5.7"}), Tipped.Skins = {
        base: {
            afterUpdate: !1,
            ajax: {},
            cache: !0,
            container: !1,
            containment: {selector: "viewport", padding: 5},
            close: !1,
            detach: !0,
            fadeIn: 200,
            fadeOut: 200,
            showDelay: 75,
            hideDelay: 25,
            hideAfter: !1,
            hideOn: {element: "mouseleave"},
            hideOthers: !1,
            position: "top",
            inline: !1,
            offset: {x: 0, y: 0},
            onHide: !1,
            onShow: !1,
            padding: !0,
            radius: !0,
            shadow: !0,
            showOn: {element: "mousemove"},
            size: "medium",
            spinner: !0,
            stem: !0,
            target: "element",
            voila: !0
        },
        reset: {
            ajax: !1,
            hideOn: {element: "mouseleave", tooltip: "mouseleave"},
            showOn: {element: "mouseenter", tooltip: "mouseenter"}
        }
    }, $.each("dark".split(" "), function (a, b) {
        Tipped.Skins[b] = {}
    });
    var Browser = function (a) {
        function b(b) {
            var c = new RegExp(b + "([\\d.]+)").exec(a);
            return c ? parseFloat(c[1]) : !0
        }

        return {
            IE: !(!window.attachEvent || -1 !== a.indexOf("Opera")) && b("MSIE "),
            Opera: a.indexOf("Opera") > -1 && (!!window.opera && opera.version && parseFloat(opera.version()) || 7.55),
            WebKit: a.indexOf("AppleWebKit/") > -1 && b("AppleWebKit/"),
            Gecko: a.indexOf("Gecko") > -1 && -1 === a.indexOf("KHTML") && b("rv:"),
            MobileSafari: !!a.match(/Apple.*Mobile.*Safari/),
            Chrome: a.indexOf("Chrome") > -1 && b("Chrome/"),
            ChromeMobile: a.indexOf("CrMo") > -1 && b("CrMo/"),
            Android: a.indexOf("Android") > -1 && b("Android "),
            IEMobile: a.indexOf("IEMobile") > -1 && b("IEMobile/")
        }
    }(navigator.userAgent), Support = function () {
        function a(a) {
            return c(a, "prefix")
        }

        function b(a, b) {
            for (var c in a)if (void 0 !== d.style[a[c]])return "prefix" == b ? a[c] : !0;
            return !1
        }

        function c(a, c) {
            var d = a.charAt(0).toUpperCase() + a.substr(1), f = (a + " " + e.join(d + " ") + d).split(" ");
            return b(f, c)
        }

        var d = document.createElement("div"), e = "Webkit Moz O ms Khtml".split(" ");
        return {
            css: {animation: c("animation"), transform: c("transform"), prefixed: a},
            shadow: c("boxShadow") && c("pointerEvents"),
            touch: function () {
                try {
                    return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
                } catch (a) {
                    return !1
                }
            }()
        }
    }(), _slice = Array.prototype.slice, _ = {
        wrap: function (a, b) {
            var c = a;
            return function () {
                var a = [$.proxy(c, this)].concat(_slice.call(arguments));
                return b.apply(this, a)
            }
        }, isElement: function (a) {
            return a && 1 == a.nodeType
        }, isText: function (a) {
            return a && 3 == a.nodeType
        }, isDocumentFragment: function (a) {
            return a && 11 == a.nodeType
        }, delay: function (a, b) {
            var c = _slice.call(arguments, 2);
            return setTimeout(function () {
                return a.apply(a, c)
            }, b)
        }, defer: function (a) {
            return _.delay.apply(this, [a, 1].concat(_slice.call(arguments, 1)))
        }, pointer: function (a) {
            return {x: a.pageX, y: a.pageY}
        }, element: {
            isAttached: function () {
                function a(a) {
                    for (var b = a; b && b.parentNode;)b = b.parentNode;
                    return b
                }

                return function (b) {
                    var c = a(b);
                    return !(!c || !c.body)
                }
            }()
        }
    }, getUID = function () {
        var a = 0, b = "_tipped-uid-";
        return function (c) {
            for (c = c || b, a++; document.getElementById(c + a);)a++;
            return c + a
        }
    }(), Position = {
        positions: ["topleft", "topmiddle", "topright", "righttop", "rightmiddle", "rightbottom", "bottomright", "bottommiddle", "bottomleft", "leftbottom", "leftmiddle", "lefttop"],
        regex: {
            toOrientation: /^(top|left|bottom|right)(top|left|bottom|right|middle|center)$/,
            horizontal: /^(top|bottom)/,
            isCenter: /(middle|center)/,
            side: /^(top|bottom|left|right)/
        },
        toDimension: function () {
            var a = {top: "height", left: "width", bottom: "height", right: "width"};
            return function (b) {
                return a[b]
            }
        }(),
        isCenter: function (a) {
            return !!a.toLowerCase().match(this.regex.isCenter)
        },
        isCorner: function (a) {
            return !this.isCenter(a)
        },
        getOrientation: function (a) {
            return a.toLowerCase().match(this.regex.horizontal) ? "horizontal" : "vertical"
        },
        getSide: function (a) {
            var b = null, c = a.toLowerCase().match(this.regex.side);
            return c && c[1] && (b = c[1]), b
        },
        split: function (a) {
            return a.toLowerCase().match(this.regex.toOrientation)
        },
        _flip: {top: "bottom", bottom: "top", left: "right", right: "left"},
        flip: function (a, b) {
            var c = this.split(a);
            return b ? this.inverseCornerPlane(this.flip(this.inverseCornerPlane(a))) : this._flip[c[1]] + c[2]
        },
        inverseCornerPlane: function (a) {
            if (Position.isCorner(a)) {
                var b = this.split(a);
                return b[2] + b[1]
            }
            return a
        },
        adjustOffsetBasedOnPosition: function (a, b, c) {
            var d = $.extend({}, a), e = {horizontal: "x", vertical: "y"}, f = {x: "y", y: "x"}, g = {
                top: {right: "x"},
                bottom: {left: "x"},
                left: {bottom: "y"},
                right: {top: "y"}
            }, h = Position.getOrientation(b);
            if (h == Position.getOrientation(c)) {
                if (Position.getSide(b) != Position.getSide(c)) {
                    var i = f[e[h]];
                    d[i] *= -1
                }
            } else {
                var j = d.x;
                d.x = d.y, d.y = j;
                var k = g[Position.getSide(b)][Position.getSide(c)];
                k && (d[k] *= -1), d[e[Position.getOrientation(c)]] = 0
            }
            return d
        },
        getBoxFromPoints: function (a, b, c, d) {
            var e = Math.min(a, c), f = Math.max(a, c), g = Math.min(b, d), h = Math.max(b, d);
            return {left: e, top: g, width: Math.max(f - e, 0), height: Math.max(h - g, 0)}
        },
        isPointWithinBox: function (a, b, c, d, e, f) {
            var g = this.getBoxFromPoints(c, d, e, f);
            return a >= g.left && a <= g.left + g.width && b >= g.top && b <= g.top + g.height
        },
        isPointWithinBoxLayout: function (a, b, c) {
            return this.isPointWithinBox(a, b, c.position.left, c.position.top, c.position.left + c.dimensions.width, c.position.top + c.dimensions.height)
        },
        getDistance: function (a, b, c, d) {
            return Math.sqrt(Math.pow(Math.abs(c - a), 2) + Math.pow(Math.abs(d - b), 2))
        },
        intersectsLine: function () {
            var a = function (a, b, c, d, e, f) {
                var g = (f - b) * (c - a) - (d - b) * (e - a);
                return g > 0 ? !0 : 0 > g ? !1 : !0
            };
            return function (b, c, d, e, f, g, h, i, j) {
                if (!j)return a(b, c, f, g, h, i) != a(d, e, f, g, h, i) && a(b, c, d, e, f, g) != a(b, c, d, e, h, i);
                var k, l, m, n;
                k = d - b, l = e - c, m = h - f, n = i - g;
                var o, p;
                if (o = (-l * (b - f) + k * (c - g)) / (-m * l + k * n), p = (m * (c - g) - n * (b - f)) / (-m * l + k * n), o >= 0 && 1 >= o && p >= 0 && 1 >= p) {
                    var q = b + p * k, r = c + p * l;
                    return {x: q, y: r}
                }
                return !1
            }
        }()
    }, Bounds = {
        viewport: function () {
            var a;
            return a = Browser.MobileSafari || Browser.Android && Browser.Gecko ? {
                width: window.innerWidth,
                height: window.innerHeight
            } : {height: $(window).height(), width: $(window).width()}
        }
    }, Mouse = {
        _buffer: {pageX: 0, pageY: 0},
        _dimensions: {width: 30, height: 30},
        _shift: {x: 2, y: 10},
        getPosition: function (a) {
            var b = this.getActualPosition(a);
            return {
                left: b.left - Math.round(.5 * this._dimensions.width) + this._shift.x,
                top: b.top - Math.round(.5 * this._dimensions.height) + this._shift.y
            }
        },
        getActualPosition: function (a) {
            var b = a && "number" == $.type(a.pageX) ? a : this._buffer;
            return {left: b.pageX, top: b.pageY}
        },
        getDimensions: function () {
            return this._dimensions
        }
    }, Color = function () {
        function a(a) {
            return ("0" + parseInt(a).toString(16)).slice(-2)
        }

        function b(b) {
            return b = b.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/), "#" + a(b[1]) + a(b[2]) + a(b[3])
        }

        var c = {
            _default: "#000000",
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00"
        };
        return {
            toRGB: function (a) {
                if (/^rgba?\(/.test(a))return b(a);
                c[a] && (a = c[a]);
                var d = a.replace("#", "");
                return /^(?:[0-9a-fA-F]{3}){1,2}$/.test(d) || c._default, 3 == d.length && (d = d.charAt(0) + d.charAt(0) + d.charAt(1) + d.charAt(1) + d.charAt(2) + d.charAt(2)), "#" + d
            }
        }
    }();
    Spin.supported = Support.css.transform && Support.css.animation, $.extend(Spin.prototype, {
        initialize: function () {
            this.options = $.extend({}, arguments[0] || {}), this.build(), this.start()
        }, build: function () {
            var a = 2 * (this.options.length + this.options.radius), b = {height: a, width: a};
            this.element = $("<div>").addClass("tpd-spin").css(b), this.element.append(this._rotate = $("<div>").addClass("tpd-spin-rotate")), this.element.css({
                "margin-left": -.5 * b.width,
                "margin-top": -.5 * b.height
            });
            for (var c = this.options.lines, d = 0; c > d; d++) {
                var e, f;
                this._rotate.append(e = $("<div>").addClass("tpd-spin-frame").append(f = $("<div>").addClass("tpd-spin-line"))), f.css({
                    "background-color": this.options.color,
                    width: this.options.width,
                    height: this.options.length,
                    "margin-left": -.5 * this.options.width,
                    "border-radius": Math.round(.5 * this.options.width)
                }), e.css({opacity: (1 / c * (d + 1)).toFixed(2)});
                var g = {};
                g[Support.css.prefixed("transform")] = "rotate(" + 360 / c * (d + 1) + "deg)", e.css(g)
            }
        }, start: function () {
            var a = {};
            a[Support.css.prefixed("animation")] = "tpd-spin 1s infinite steps(" + this.options.lines + ")", this._rotate.css(a)
        }, stop: function () {
            var a = {};
            a[Support.css.prefixed("animation")] = "none", this._rotate.css(a), this.element.detach()
        }
    }), $.extend(Visible.prototype, {
        initialize: function (a) {
            return a = "array" == $.type(a) ? a : [a], this.elements = a, this._restore = [], $.each(a, $.proxy(function (a, b) {
                var c = $(b).is(":visible");
                c || $(b).show(), this._restore.push({element: b, visible: c})
            }, this)), this
        }, restore: function () {
            $.each(this._restore, function (a, b) {
                b.visible || $(b.element).show()
            }), this._restore = null
        }
    });
    var AjaxCache = function () {
        var a = [];
        return {
            get: function (b) {
                for (var c = null, d = 0; d < a.length; d++)a[d] && a[d].url == b.url && (a[d].type || "GET").toUpperCase() == (b.type || "GET").toUpperCase() && $.param(a[d].data || {}) == $.param(b.data || {}) && (c = a[d]);
                return c
            }, set: function (b, c, d) {
                var e = this.get(b);
                e || (e = $.extend({callbacks: {}}, b), a.push(e)), e.callbacks[c] = d
            }, remove: function (b) {
                for (var c = 0; c < a.length; c++)a[c] && a[c].url == b && delete a[c]
            }, clear: function () {
                a = []
            }
        }
    }(), Voila = function (a) {
        function b(c, d, e) {
            if (!(this instanceof b))return new b(c, d, e);
            var f = a.type(arguments[1]), g = "object" === f ? arguments[1] : {}, h = "function" === f ? arguments[1] : "function" === a.type(arguments[2]) ? arguments[2] : !1;
            return this.options = a.extend({method: "onload"}, g), this.deferred = new jQuery.Deferred, h && this.always(h), this._processed = 0, this.images = [], this._add(c), this
        }

        a.extend(b.prototype, {
            _add: function (b) {
                var d = "string" == a.type(b) ? a(b) : b instanceof jQuery || b.length > 0 ? b : [b];
                a.each(d, a.proxy(function (b, d) {
                    var e = a(), f = a(d);
                    e = f.is("img") ? e.add(f) : e.add(f.find("img")), e.each(a.proxy(function (b, d) {
                        this.images.push(new c(d, a.proxy(function (a) {
                            this._progress(a)
                        }, this), a.proxy(function (a) {
                            this._progress(a)
                        }, this), this.options))
                    }, this))
                }, this)), this.images.length < 1 && setTimeout(a.proxy(function () {
                    this._resolve()
                }, this))
            }, abort: function () {
                this._progress = this._notify = this._reject = this._resolve = function () {
                }, a.each(this.images, function (a, b) {
                    b.abort()
                }), this.images = []
            }, _progress: function (a) {
                this._processed++, a.isLoaded || (this._broken = !0), this._notify(a), this._processed == this.images.length && this[this._broken ? "_reject" : "_resolve"]()
            }, _notify: function (a) {
                this.deferred.notify(this, a)
            }, _reject: function () {
                this.deferred.reject(this)
            }, _resolve: function () {
                this.deferred.resolve(this)
            }, always: function (a) {
                return this.deferred.always(a), this
            }, done: function (a) {
                return this.deferred.done(a), this
            }, fail: function (a) {
                return this.deferred.fail(a), this
            }, progress: function (a) {
                return this.deferred.progress(a), this
            }
        });
        var c = function (a) {
            var b = function () {
                return this.initialize.apply(this, Array.prototype.slice.call(arguments))
            };
            a.extend(b.prototype, {
                initialize: function () {
                    this.options = a.extend({
                        test: function () {
                        }, success: function () {
                        }, timeout: function () {
                        }, callAt: !1, intervals: [[0, 0], [1e3, 10], [2e3, 50], [4e3, 100], [2e4, 500]]
                    }, arguments[0] || {}), this._test = this.options.test, this._success = this.options.success, this._timeout = this.options.timeout, this._ipos = 0, this._time = 0, this._delay = this.options.intervals[this._ipos][1], this._callTimeouts = [], this.poll(), this._createCallsAt()
                }, poll: function () {
                    this._polling = setTimeout(a.proxy(function () {
                        if (this._test())return this.success(), void 0;
                        if (this._time += this._delay, this._time >= this.options.intervals[this._ipos][0]) {
                            if (!this.options.intervals[this._ipos + 1])return "function" == a.type(this._timeout) && this._timeout(), void 0;
                            this._ipos++, this._delay = this.options.intervals[this._ipos][1]
                        }
                        this.poll()
                    }, this), this._delay)
                }, success: function () {
                    this.abort(), this._success()
                }, _createCallsAt: function () {
                    this.options.callAt && a.each(this.options.callAt, a.proxy(function (b, c) {
                        var d = c[0], e = c[1], f = setTimeout(a.proxy(function () {
                            e()
                        }, this), d);
                        this._callTimeouts.push(f)
                    }, this))
                }, _stopCallTimeouts: function () {
                    a.each(this._callTimeouts, function (a, b) {
                        clearTimeout(b)
                    }), this._callTimeouts = []
                }, abort: function () {
                    this._stopCallTimeouts(), this._polling && (clearTimeout(this._polling), this._polling = null)
                }
            });
            var c = function () {
                return this.initialize.apply(this, Array.prototype.slice.call(arguments))
            };
            return a.extend(c.prototype, {
                supports: {
                    naturalWidth: function () {
                        return "naturalWidth" in new Image
                    }()
                }, initialize: function (b, c, d) {
                    return this.img = a(b)[0], this.successCallback = c, this.errorCallback = d, this.isLoaded = !1, this.options = a.extend({
                        method: "onload",
                        pollFallbackAfter: 1e3
                    }, arguments[3] || {}), "onload" != this.options.method && this.supports.naturalWidth ? (this.poll(), void 0) : (this.load(), void 0)
                }, poll: function () {
                    this._poll = new b({
                        test: a.proxy(function () {
                            return this.img.naturalWidth > 0
                        }, this), success: a.proxy(function () {
                            this.success()
                        }, this), timeout: a.proxy(function () {
                            this.error()
                        }, this), callAt: [[this.options.pollFallbackAfter, a.proxy(function () {
                            this.load()
                        }, this)]]
                    })
                }, load: function () {
                    this._loading = setTimeout(a.proxy(function () {
                        var b = new Image;
                        this._onloadImage = b, b.onload = a.proxy(function () {
                            b.onload = function () {
                            }, this.supports.naturalWidth || (this.img.naturalWidth = b.width, this.img.naturalHeight = b.height, b.naturalWidth = b.width, b.naturalHeight = b.height), this.success()
                        }, this), b.onerror = a.proxy(this.error, this), b.src = this.img.src
                    }, this))
                }, success: function () {
                    this._calledSuccess || (this._calledSuccess = !0, this.abort(), this.waitForRender(a.proxy(function () {
                        this.isLoaded = !0, this.successCallback(this)
                    }, this)))
                }, error: function () {
                    this._calledError || (this._calledError = !0, this.abort(), this._errorRenderTimeout = setTimeout(a.proxy(function () {
                        this.errorCallback && this.errorCallback(this)
                    }, this)))
                }, abort: function () {
                    this.stopLoading(), this.stopPolling(), this.stopWaitingForRender()
                }, stopPolling: function () {
                    this._poll && (this._poll.abort(), this._poll = null)
                }, stopLoading: function () {
                    this._loading && (clearTimeout(this._loading), this._loading = null), this._onloadImage && (this._onloadImage.onload = function () {
                    }, this._onloadImage.onerror = function () {
                    })
                }, waitForRender: function (a) {
                    this._renderTimeout = setTimeout(a)
                }, stopWaitingForRender: function () {
                    this._renderTimeout && (clearTimeout(this._renderTimeout), this._renderTimeout = null), this._errorRenderTimeout && (clearTimeout(this._errorRenderTimeout), this._errorRenderTimeout = null)
                }
            }), c
        }(jQuery);
        return b
    }(jQuery);
    Tipped.Behaviors = {
        hide: {
            showOn: {element: "mouseenter", tooltip: !1},
            hideOn: {element: "mouseleave", tooltip: "mouseenter"}
        },
        mouse: {
            showOn: {element: "mouseenter", tooltip: !1},
            hideOn: {element: "mouseleave", tooltip: "mouseenter"},
            target: "mouse",
            showDelay: 100,
            fadeIn: 0,
            hideDelay: 0,
            fadeOut: 0
        },
        sticky: {
            showOn: {element: "mouseenter", tooltip: "mouseenter"},
            hideOn: {element: "mouseleave", tooltip: "mouseleave"},
            showDelay: 150,
            target: "mouse",
            fixed: !0
        }
    };
    var Options = {
        create: function () {
            function a(b) {
                return e = Tipped.Skins.base, f = deepExtend($.extend({}, e), Tipped.Skins.reset), a = d, d(b)
            }

            function b(a) {
                return a.match(/^(top|left|bottom|right)$/) && (a += "middle"), a.replace("center", "middle").replace(" ", ""), a
            }

            function c(a) {
                var b, c;
                return b = a.behavior && (c = Tipped.Behaviors[a.behavior]) ? deepExtend($.extend({}, c), a) : a
            }

            function d(a) {
                var d = a.skin ? a.skin : Tooltips.options.defaultSkin, g = $.extend({}, Tipped.Skins[d] || {});
                g.skin || (g.skin = Tooltips.options.defaultSkin || "dark");
                var h = deepExtend($.extend({}, f), c(g)), i = deepExtend($.extend({}, h), c(a));
                i[sfcc("115,107,105,110")] = sfcc("100,97,114,107"), i.ajax && (f.ajax || {}, e.ajax, "boolean" == $.type(i.ajax) && (i.ajax = {}), i.ajax = !1);
                var j, k = k = i.position && i.position.target || "string" == $.type(i.position) && i.position || f.position && f.position.target || "string" == $.type(f.position) && f.position || e.position && e.position.target || e.position;
                k = b(k);
                var l = i.position && i.position.tooltip || f.position && f.position.tooltip || e.position && e.position.tooltip || Tooltips.Position.getInversedPosition(k);
                if (l = b(l), i.position ? "string" == $.type(i.position) ? (i.position = b(i.position), j = {
                        target: i.position,
                        tooltip: Tooltips.Position.getTooltipPositionFromTarget(i.position)
                    }) : (j = {
                        tooltip: l,
                        target: k
                    }, i.position.tooltip && (j.tooltip = b(i.position.tooltip)), i.position.target && (j.target = b(i.position.target))) : j = {
                        tooltip: l,
                        target: k
                    }, Position.isCorner(j.target) && Position.getOrientation(j.target) != Position.getOrientation(j.tooltip) && (j.target = Position.inverseCornerPlane(j.target)), "mouse" == i.target) {
                    var m = Position.getOrientation(j.target);
                    j.target = "horizontal" == m ? j.target.replace(/(left|right)/, "middle") : j.target.replace(/(top|bottom)/, "middle")
                }
                i.position = j;
                var n;
                if ("mouse" == i.target ? (n = $.extend({}, e.offset), $.extend(n, Tipped.Skins.reset.offset || {}), n = Position.adjustOffsetBasedOnPosition(e.offset, e.position, j.target, !0), a.offset && (n = $.extend(n, a.offset || {}))) : n = {
                        x: i.offset.x,
                        y: i.offset.y
                    }, i.offset = n, i.hideOn && "click-outside" == i.hideOn && (i.hideOnClickOutside = !0, i.hideOn = !1, i.fadeOut = 0), i.showOn) {
                    var o = i.showOn;
                    "string" == $.type(o) && (o = {element: o}), i.showOn = o
                }
                if (i.hideOn) {
                    var p = i.hideOn;
                    "string" == $.type(p) && (p = {element: p}), i.hideOn = p
                }
                return i.inline && "string" != $.type(i.inline) && (i.inline = !1), Browser.IE && Browser.IE < 9 && $.extend(i, {
                    fadeIn: 0,
                    fadeOut: 0,
                    hideDelay: 0
                }), i.spinner && (Spin.supported ? "boolean" == $.type(i.spinner) && (i.spinner = f.spinner || e.spinner || {}) : i.spinner = !1), i.container || (i.container = document.body), i.containment && "string" == $.type(i.containment) && (i.containment = {
                    selector: i.containment,
                    padding: f.containment && f.containment.padding || e.padding && e.containment.padding
                }), i.shadow && (i.shadow = Support.shadow), i
            }

            var e, f;
            return a
        }()
    };
    $.extend(Skin.prototype, {
        initialize: function (a) {
            this.tooltip = a, this.element = a._skin;
            var b = this.tooltip.options;
            this.tooltip._tooltip[(b.shadow ? "remove" : "add") + "Class"]("tpd-no-shadow")[(b.radius ? "remove" : "add") + "Class"]("tpd-no-radius")[(b.stem ? "remove" : "add") + "Class"]("tpd-no-stem");
            var c, d, e, f, g = Support.css.prefixed("borderTopLeftRadius");
            this.element.append(c = $("<div>").addClass("tpd-frames").append($("<div>").addClass("tpd-frame").append($("<div>").addClass("tpd-backgrounds").append(d = $("<div>").addClass("tpd-background").append(e = $("<div>").addClass("tpd-background-content")))))).append(f = $("<div>").addClass("tpd-spinner")), d.css({
                width: 999,
                height: 999,
                zoom: 1
            }), this._css = {
                border: parseFloat(d.css("border-top-width")),
                radius: parseFloat(g ? d.css(g) : 0),
                padding: parseFloat(a._content.css("padding-top")),
                borderColor: d.css("border-top-color"),
                backgroundColor: e.css("background-color"),
                backgroundOpacity: e.css("opacity"),
                spinner: {dimensions: {width: f.innerWidth(), height: f.innerHeight()}}
            }, f.remove(), c.remove(), this._side = Position.getSide(a.options.position.tooltip) || "top", this._vars = {}
        }, destroy: function () {
            this.frames && ($.each("top right bottom left".split(" "), $.proxy(function (a, b) {
                this["stem_" + b] && this["stem_" + b].destroy()
            }, this)), this.frames.remove(), this.frames = null)
        }, build: function () {
            this.frames || (this.element.append(this.frames = $("<div>").addClass("tpd-frames")), $.each("top right bottom left".split(" "), $.proxy(function (a, b) {
                this.insertFrame(b)
            }, this)), this._spinner || this.tooltip._tooltip.append(this._spinner = $("<div>").addClass("tpd-spinner").hide().append($("<div>").addClass("tpd-spinner-spin"))))
        }, _frame: function () {
            var a, b = $("<div>").addClass("tpd-frame").append(a = $("<div>").addClass("tpd-backgrounds").append($("<div>").addClass("tpd-background-shadow"))).append($("<div>").addClass("tpd-shift-stem").append($("<div>").addClass("tpd-shift-stem-side tpd-shift-stem-side-before")).append($("<div>").addClass("tpd-stem")).append($("<div>").addClass("tpd-shift-stem-side tpd-shift-stem-side-after")));
            return $.each("top right bottom left".split(" "), $.proxy(function (b, c) {
                a.append($("<div>").addClass("tpd-background-box tpd-background-box-" + c).append($("<div>").addClass("tpd-background-box-shift").append($("<div>").addClass("tpd-background-box-shift-further").append($("<div>").addClass("tpd-background").append($("<div>").addClass("tpd-background-title")).append($("<div>").addClass("tpd-background-content"))).append($("<div>").addClass("tpd-background tpd-background-loading")).append($("<div>").addClass("tpd-background-border-hack").hide()))))
            }, this)), b
        }(), _getFrame: function (a) {
            var b = this._frame.clone();
            b.addClass("tpd-frame-" + a), b.find(".tpd-background-shadow").css({"border-radius": this._css.radius}), this.tooltip.options.stem && b.find(".tpd-stem").attr("data-stem-position", a);
            var c = Math.max(this._css.radius - this._css.border, 0);
            b.find(".tpd-background-title").css({
                "border-top-left-radius": c,
                "border-top-right-radius": c
            }), b.find(".tpd-background-content").css({
                "border-bottom-left-radius": c,
                "border-bottom-right-radius": c
            }), b.find(".tpd-background-loading").css({"border-radius": c});
            var d = {backgroundColor: this._css.borderColor}, e = Position.getOrientation(a), f = "horizontal" == e;
            d[f ? "height" : "width"] = this._css.border + "px";
            var g = {top: "bottom", bottom: "top", left: "right", right: "left"};
            return d[g[a]] = 0, b.find(".tpd-shift-stem-side").css(d), b
        }, insertFrame: function (a) {
            var b = this["frame_" + a] = this._getFrame(a);
            if (this.frames.append(b), this.tooltip.options.stem) {
                var c = b.find(".tpd-stem");
                this["stem_" + a] = new Stem(c, this, {})
            }
        }, startLoading: function () {
            this.tooltip.supportsLoading && (this.build(), this._spinner || this.tooltip.is("resize-to-content") || this.setDimensions(this._css.spinner.dimensions), this._spinner && this._spinner.show())
        }, stopLoading: function () {
            this.tooltip.supportsLoading && this._spinner && (this.build(), this._spinner.hide())
        }, updateBackground: function () {
            var a = this._vars.frames[this._side], b = $.extend({}, a.background.dimensions);
            if (this.tooltip.title && !this.tooltip.is("loading")) {
                this.element.find(".tpd-background-title, .tpd-background-content").show(), this.element.find(".tpd-background").css({"background-color": "transparent"});
                var c = $.extend({}, b), d = Math.max(this._css.radius - this._css.border, 0), e = {
                    "border-top-left-radius": d,
                    "border-top-right-radius": d,
                    "border-bottom-left-radius": d,
                    "border-bottom-right-radius": d
                }, f = new Visible(this.tooltip._tooltip), g = this.tooltip._titleWrapper.innerHeight();
                c.height -= g, this.element.find(".tpd-background-title").css({
                    height: g,
                    width: b.width
                }), e["border-top-left-radius"] = 0, e["border-top-right-radius"] = 0, f.restore(), this.element.find(".tpd-background-content").css(c).css(e), this.element.find(".tpd-background-loading").css({"background-color": this._css.backgroundColor})
            } else this.element.find(".tpd-background-title, .tpd-background-content").hide(), this.element.find(".tpd-background").css({"background-color": this._css.backgroundColor});
            this._css.border && (this.element.find(".tpd-background").css({"border-color": "transparent"}), this.element.find(".tpd-background-border-hack").css({
                width: b.width,
                height: b.height,
                "border-radius": this._css.radius,
                "border-width": this._css.border,
                "border-color": this._css.borderColor
            }).show())
        }, paint: function () {
            if (!this._paintedDimensions || this._paintedDimensions.width != this._dimensions.width || this._paintedDimensions.height != this._dimensions.height || this._paintedStemPosition != this._stemPosition) {
                this._paintedDimensions = this._dimensions, this._paintedStemPosition = this._stemPosition, this.element.removeClass("tpd-visible-frame-top tpd-visible-frame-bottom tpd-visible-frame-left tpd-visible-frame-right").addClass("tpd-visible-frame-" + this._side);
                var a = this._vars.frames[this._side], b = $.extend({}, a.background.dimensions);
                this.element.find(".tpd-background").css(b), this.element.find(".tpd-background-shadow").css({
                    width: b.width + 2 * this._css.border,
                    height: b.height + 2 * this._css.border
                }), this.updateBackground(), this.element.find(".tpd-background-box-shift, .tpd-background-box-shift-further").removeAttr("style"), this.element.add(this.frames).add(this.tooltip._tooltip).css(a.dimensions);
                var c = this._side, d = this._vars.frames[c], e = this.element.find(".tpd-frame-" + this._side), f = this._vars.frames[c].dimensions;
                e.css(f), e.find(".tpd-backgrounds").css($.extend({}, d.background.position, {
                    width: f.width - d.background.position.left,
                    height: f.height - d.background.position.top
                }));
                var g = Position.getOrientation(c);
                if (this.tooltip.options.stem)if (e.find(".tpd-shift-stem").css($.extend({}, d.shift.dimensions, d.shift.position)), "vertical" == g) {
                    var h = e.find(".tpd-background-box-top, .tpd-background-box-bottom");
                    h.css({
                        height: this._vars.cut,
                        width: this._css.border
                    }), e.find(".tpd-background-box-bottom").css({top: d.dimensions.height - this._vars.cut}).find(".tpd-background-box-shift").css({"margin-top": -1 * d.dimensions.height + this._vars.cut});
                    var i = "right" == c ? d.dimensions.width - d.stemPx - this._css.border : 0;
                    h.css({left: i}).find(".tpd-background-box-shift").css({"margin-left": -1 * i}), e.find(".tpd-background-box-" + ("left" == c ? "left" : "right")).hide(), "right" == c ? e.find(".tpd-background-box-left").css({width: d.dimensions.width - d.stemPx - this._css.border}) : e.find(".tpd-background-box-right").css({"margin-left": this._css.border}).find(".tpd-background-box-shift").css({"margin-left": -1 * this._css.border});
                    var j = e.find(".tpd-background-box-" + this._side);
                    j.css({
                        height: d.dimensions.height - 2 * this._vars.cut,
                        "margin-top": this._vars.cut
                    }), j.find(".tpd-background-box-shift").css({"margin-top": -1 * this._vars.cut})
                } else {
                    var h = e.find(".tpd-background-box-left, .tpd-background-box-right");
                    h.css({
                        width: this._vars.cut,
                        height: this._css.border
                    }), e.find(".tpd-background-box-right").css({left: d.dimensions.width - this._vars.cut}).find(".tpd-background-box-shift").css({"margin-left": -1 * d.dimensions.width + this._vars.cut});
                    var i = "bottom" == c ? d.dimensions.height - d.stemPx - this._css.border : 0;
                    h.css({top: i}).find(".tpd-background-box-shift").css({"margin-top": -1 * i}), e.find(".tpd-background-box-" + ("top" == c ? "top" : "bottom")).hide(), "bottom" == c ? e.find(".tpd-background-box-top").css({height: d.dimensions.height - d.stemPx - this._css.border}) : e.find(".tpd-background-box-bottom").css({"margin-top": this._css.border}).find(".tpd-background-box-shift").css({"margin-top": -1 * this._css.border});
                    var j = e.find(".tpd-background-box-" + this._side);
                    j.css({
                        width: d.dimensions.width - 2 * this._vars.cut,
                        "margin-left": this._vars.cut
                    }), j.find(".tpd-background-box-shift").css({"margin-left": -1 * this._vars.cut})
                }
                var k = a.background, l = k.position, m = k.dimensions;
                this._spinner.css({
                    top: l.top + this._css.border + (.5 * m.height - .5 * this._css.spinner.dimensions.height),
                    left: l.left + this._css.border + (.5 * m.width - .5 * this._css.spinner.dimensions.width)
                })
            }
        }, getVars: function () {
            var a = (this._css.padding, this._css.radius, this._css.border), b = this._vars.maxStemHeight || 0, c = $.extend({}, this._dimensions || {}), d = {
                frames: {},
                dimensions: c,
                maxStemHeight: b
            };
            d.cut = Math.max(this._css.border, this._css.radius) || 0;
            var e = {width: 0, height: 0}, f = 0, g = 0;
            return this.tooltip.options.stem && (e = this.stem_top.getMath().dimensions.outside, f = this.stem_top._css.offset, g = Math.max(e.height - this._css.border, 0)), d.stemDimensions = e, d.stemOffset = f, Position.getOrientation(this._side), $.each("top right bottom left".split(" "), $.proxy(function (b, f) {
                var h = Position.getOrientation(f), i = "vertical" == h, j = {
                    width: c.width + 2 * a,
                    height: c.height + 2 * a
                }, k = j[i ? "height" : "width"] - 2 * d.cut, l = {
                    dimensions: j,
                    stemPx: g,
                    position: {top: 0, left: 0},
                    background: {dimensions: $.extend({}, c), position: {top: 0, left: 0}}
                };
                if (d.frames[f] = l, l.dimensions[i ? "width" : "height"] += g, ("top" == f || "left" == f) && (l.background.position[f] += g), $.extend(l, {
                        shift: {
                            position: {
                                top: 0,
                                left: 0
                            }, dimensions: {width: i ? e.height : k, height: i ? k : e.height}
                        }
                    }), Browser.IE && Browser.IE < 9) {
                    var m = l.shift.dimensions;
                    m.width = Math.round(m.width), m.height = Math.round(m.height)
                }
                switch (f) {
                    case"top":
                    case"bottom":
                        l.shift.position.left += d.cut, "bottom" == f && (l.shift.position.top += j.height - a - g);
                        break;
                    case"left":
                    case"right":
                        l.shift.position.top += d.cut, "right" == f && (l.shift.position.left += j.width - a - g)
                }
            }, this)), d.connections = {}, $.each(Position.positions, $.proxy(function (a, b) {
                d.connections[b] = this.getConnectionLayout(b, d)
            }, this)), d
        }, setDimensions: function (a) {
            this.build();
            var b = this._dimensions;
            b && b.width == a.width && b.height == a.height || (this._dimensions = a, this._vars = this.getVars())
        }, setSide: function (a) {
            this._side = a, this._vars = this.getVars()
        }, getConnectionLayout: function (a, b) {
            var c = Position.getSide(a), d = Position.getOrientation(a), e = (b.dimensions, b.cut), f = this["stem_" + c], g = b.stemOffset, h = this.tooltip.options.stem ? f.getMath().dimensions.outside.width : 0, i = e + g + .5 * h, j = {stem: {}}, k = {
                left: 0,
                right: 0,
                up: 0,
                down: 0
            }, l = {top: 0, left: 0}, m = {top: 0, left: 0}, n = b.frames[c], i = 0;
            if ("horizontal" == d) {
                var o = n.dimensions.width;
                this.tooltip.options.stem && (o = n.shift.dimensions.width, 2 * g > o - h && (g = Math.floor(.5 * (o - h)) || 0), i = e + g + .5 * h);
                var p = o - 2 * g, q = Position.split(a), r = g;
                switch (q[2]) {
                    case"left":
                        k.right = p - h, l.left = i;
                        break;
                    case"middle":
                        r += Math.round(.5 * p - .5 * h), k.left = r - g, k.right = r - g, l.left = m.left = Math.round(.5 * n.dimensions.width);
                        break;
                    case"right":
                        r += p - h, k.left = p - h, l.left = n.dimensions.width - i, m.left = n.dimensions.width
                }
                "bottom" == q[1] && (l.top += n.dimensions.height, m.top += n.dimensions.height), $.extend(j.stem, {
                    position: {left: r},
                    before: {width: r},
                    after: {left: r + h, width: o - r - h + 1}
                })
            } else {
                var s = n.dimensions.height;
                this.tooltip.options.stem && (s = n.shift.dimensions.height, 2 * g > s - h && (g = Math.floor(.5 * (s - h)) || 0), i = e + g + .5 * h);
                var t = s - 2 * g, q = Position.split(a), u = g;
                switch (q[2]) {
                    case"top":
                        k.down = t - h, l.top = i;
                        break;
                    case"middle":
                        u += Math.round(.5 * t - .5 * h), k.up = u - g, k.down = u - g, l.top = m.top = Math.round(.5 * n.dimensions.height);
                        break;
                    case"bottom":
                        u += t - h, k.up = t - h, l.top = n.dimensions.height - i, m.top = n.dimensions.height
                }
                "right" == q[1] && (l.left += n.dimensions.width, m.left += n.dimensions.width), $.extend(j.stem, {
                    position: {top: u},
                    before: {height: u},
                    after: {top: u + h, height: s - u - h + 1}
                })
            }
            return j.move = k, j.stem.connection = l, j.connection = m, j
        }, setStemPosition: function (a, b) {
            if (this._stemPosition != a) {
                this._stemPosition = a;
                var c = Position.getSide(a);
                this.setSide(c)
            }
            this.tooltip.options.stem && this.setStemShift(a, b)
        }, setStemShift: function (a, b) {
            var c = this._shift, d = this._dimensions;
            if (!c || c.stemPosition != a || c.shift.x != b.x || c.shift.y != b.y || !d || c.dimensions.width != d.width || c.dimensions.height != d.height) {
                this._shift = {stemPosition: a, shift: b, dimensions: d};
                var e = Position.getSide(a), f = {
                    horizontal: "x",
                    vertical: "y"
                }[Position.getOrientation(a)], g = {
                    x: {left: "left", width: "width"},
                    y: {left: "top", width: "height"}
                }[f], h = this["stem_" + e], i = deepExtend({}, this._vars.connections[a].stem);
                b && 0 !== b[f] && (i.before[g.width] += b[f], i.position[g.left] += b[f], i.after[g.left] += b[f], i.after[g.width] -= b[f]), h.element.css(i.position), h.element.siblings(".tpd-shift-stem-side-before").css(i.before), h.element.siblings(".tpd-shift-stem-side-after").css(i.after)
            }
        }
    }), $.extend(Stem.prototype, {
        initialize: function (a, b) {
            this.element = $(a), this.element[0] && (this.skin = b, this.element.removeClass("tpd-stem-reset"), this._css = $.extend({}, b._css, {
                width: this.element.innerWidth(),
                height: this.element.innerHeight(),
                offset: parseFloat(this.element.css("margin-left")),
                spacing: parseFloat(this.element.css("margin-top"))
            }), this.element.addClass("tpd-stem-reset"), this.options = $.extend({}, arguments[2] || {}), this._position = this.element.attr("data-stem-position") || "top", this._m = 100, this.build())
        }, destroy: function () {
            this.element.html("")
        }, build: function () {
            this.destroy();
            var a = this._css.backgroundColor, b = a.indexOf("rgba") > -1 && parseFloat(a.replace(/^.*,(.+)\)/, "$1")), c = b && 1 > b;
            this._useTransform = c && Support.css.transform, this._css.border || (this._useTransform = !1), this[(this._useTransform ? "build" : "buildNo") + "Transform"]()
        }, buildTransform: function () {
            this.element.append(this.spacer = $("<div>").addClass("tpd-stem-spacer").append(this.downscale = $("<div>").addClass("tpd-stem-downscale").append(this.transform = $("<div>").addClass("tpd-stem-transform").append(this.first = $("<div>").addClass("tpd-stem-side").append(this.border = $("<div>").addClass("tpd-stem-border")).append($("<div>").addClass("tpd-stem-border-corner")).append($("<div>").addClass("tpd-stem-triangle")))))), this.transform.append(this.last = this.first.clone().addClass("tpd-stem-side-inversed")), this.sides = this.first.add(this.last);
            var a = this.getMath(), b = a.dimensions, c = this._m, d = Position.getSide(this._position);
            if (this.element.find(".tpd-stem-spacer").css({
                    width: l ? b.inside.height : b.inside.width,
                    height: l ? b.inside.width : b.inside.height
                }), "top" == d || "left" == d) {
                var e = {};
                "top" == d ? (e.bottom = 0, e.top = "auto") : "left" == d && (e.right = 0, e.left = "auto"), this.element.find(".tpd-stem-spacer").css(e)
            }
            this.transform.css({width: b.inside.width * c, height: b.inside.height * c});
            var f = Support.css.prefixed("transform"), g = {
                "background-color": "transparent",
                "border-bottom-color": this._css.backgroundColor,
                "border-left-width": .5 * b.inside.width * c,
                "border-bottom-width": b.inside.height * c
            };
            g[f] = "translate(" + a.border * c + "px, 0)", this.element.find(".tpd-stem-triangle").css(g);
            var h = this._css.borderColor;
            alpha = h.indexOf("rgba") > -1 && parseFloat(h.replace(/^.*,(.+)\)/, "$1")), alpha && 1 > alpha ? h = (h.substring(0, h.lastIndexOf(",")) + ")").replace("rgba", "rgb") : alpha = 1;
            var i = {
                "background-color": "transparent",
                "border-right-width": a.border * c,
                width: a.border * c,
                "margin-left": -2 * a.border * c,
                "border-color": h,
                opacity: alpha
            };
            i[f] = "skew(" + a.skew + "deg) translate(" + a.border * c + "px, " + -1 * this._css.border * c + "px)", this.element.find(".tpd-stem-border").css(i);
            var h = this._css.borderColor;
            alpha = h.indexOf("rgba") > -1 && parseFloat(h.replace(/^.*,(.+)\)/, "$1")), alpha && 1 > alpha ? h = (h.substring(0, h.lastIndexOf(",")) + ")").replace("rgba", "rgb") : alpha = 1;
            var j = {
                width: a.border * c,
                "border-right-width": a.border * c,
                "border-right-color": h,
                background: h,
                opacity: alpha,
                "margin-left": -2 * a.border * c
            };
            if (j[f] = "skew(" + a.skew + "deg) translate(" + a.border * c + "px, " + (b.inside.height - this._css.border) * c + "px)", this.element.find(".tpd-stem-border-corner").css(j), this.setPosition(this._position), c > 1) {
                var k = {};
                k[f] = "scale(" + 1 / c + "," + 1 / c + ")", this.downscale.css(k)
            }
            var l = /^(left|right)$/.test(this._position);
            this._css.border || this.element.find(".tpd-stem-border, .tpd-stem-border-corner").hide(), this.element.css({
                width: l ? b.outside.height : b.outside.width,
                height: l ? b.outside.width : b.outside.height
            })
        }, buildNoTransform: function () {
            this.element.append(this.spacer = $("<div>").addClass("tpd-stem-spacer").append($("<div>").addClass("tpd-stem-notransform").append($("<div>").addClass("tpd-stem-border").append($("<div>").addClass("tpd-stem-border-corner")).append($("<div>").addClass("tpd-stem-border-center-offset").append($("<div>").addClass("tpd-stem-border-center-offset-inverse").append($("<div>").addClass("tpd-stem-border-center"))))).append($("<div>").addClass("tpd-stem-triangle"))));
            var a = this.getMath(), b = a.dimensions, c = /^(left|right)$/.test(this._position), d = /^(bottom)$/.test(this._position), e = /^(right)$/.test(this._position), f = Position.getSide(this._position);
            if (this.element.css({
                    width: c ? b.outside.height : b.outside.width,
                    height: c ? b.outside.width : b.outside.height
                }), this.element.find(".tpd-stem-notransform").add(this.element.find(".tpd-stem-spacer")).css({
                    width: c ? b.inside.height : b.inside.width,
                    height: c ? b.inside.width : b.inside.height
                }), "top" == f || "left" == f) {
                var g = {};
                "top" == f ? (g.bottom = 0, g.top = "auto") : "left" == f && (g.right = 0, g.left = "auto"), this.element.find(".tpd-stem-spacer").css(g)
            }
            this.element.find(".tpd-stem-border").css({width: "100%", background: "transparent"});
            var h = {opacity: Browser.IE && Browser.IE < 9 ? this._css.borderOpacity : 1};
            h[c ? "height" : "width"] = "100%", h[c ? "width" : "height"] = this._css.border, h[d ? "top" : "bottom"] = 0, $.extend(h, e ? {left: 0} : {right: 0}), this.element.find(".tpd-stem-border-corner").css(h);
            var i = {
                width: 0,
                "background-color": "transparent",
                opacity: Browser.IE && Browser.IE < 9 ? this._css.borderOpacity : 1
            }, j = .5 * b.inside.width + "px solid transparent", k = {"background-color": "transparent"};
            if (.5 * b.inside.width - a.border + "px solid transparent", c) {
                var l = {
                    left: "auto",
                    top: "50%",
                    "margin-top": -.5 * b.inside.width,
                    "border-top": j,
                    "border-bottom": j
                };
                if ($.extend(i, l), i[e ? "right" : "left"] = 0, i[e ? "border-left" : "border-right"] = b.inside.height + "px solid " + this._css.borderColor, $.extend(k, l), k[e ? "border-left" : "border-right"] = b.inside.height + "px solid " + this._css.backgroundColor, k[e ? "right" : "left"] = a.top, k[e ? "left" : "right"] = "auto", Browser.IE && Browser.IE < 8) {
                    var m = .5 * this._css.width + "px solid transparent";
                    $.extend(k, {
                        "margin-top": -.5 * this._css.width,
                        "border-top": m,
                        "border-bottom": m
                    }), k[e ? "border-left" : "border-right"] = this._css.height + "px solid " + this._css.backgroundColor
                }
                this.element.find(".tpd-stem-border-center-offset").css({"margin-left": -1 * this._css.border * (e ? -1 : 1)}).find(".tpd-stem-border-center-offset-inverse").css({"margin-left": this._css.border * (e ? -1 : 1)})
            } else {
                var l = {"margin-left": -.5 * b.inside.width, "border-left": j, "border-right": j};
                if ($.extend(i, l), i[d ? "border-top" : "border-bottom"] = b.inside.height + "px solid " + this._css.borderColor, $.extend(k, l), k[d ? "border-top" : "border-bottom"] = b.inside.height + "px solid " + this._css.backgroundColor, k[d ? "bottom" : "top"] = a.top, k[d ? "top" : "bottom"] = "auto", Browser.IE && Browser.IE < 8) {
                    var m = .5 * this._css.width + "px solid transparent";
                    $.extend(k, {
                        "margin-left": -.5 * this._css.width,
                        "border-left": m,
                        "border-right": m
                    }), k[d ? "border-top" : "border-bottom"] = this._css.height + "px solid " + this._css.backgroundColor
                }
                this.element.find(".tpd-stem-border-center-offset").css({"margin-top": -1 * this._css.border * (d ? -1 : 1)}).find(".tpd-stem-border-center-offset-inverse").css({"margin-top": this._css.border * (d ? -1 : 1)})
            }
            this.element.find(".tpd-stem-border-center").css(i), this.element.find(".tpd-stem-border-corner").css({"background-color": this._css.borderColor}), this.element.find(".tpd-stem-triangle").css(k), this._css.border || this.element.find(".tpd-stem-border").hide()
        }, setPosition: function (a) {
            this._position = a, this.transform.attr("class", "tpd-stem-transform tpd-stem-transform-" + a)
        }, getMath: function () {
            var a = this._css.height, b = this._css.width, c = this._css.border;
            this._useTransform && Math.floor(b) % 2 && (b = Math.max(Math.floor(b) - 1, 0));
            var d = degrees(Math.atan(.5 * b / a)), e = 90 - d, f = c / Math.cos((90 - e) * Math.PI / 180), g = c / Math.cos((90 - d) * Math.PI / 180), h = {
                width: b + 2 * f,
                height: a + g
            };
            Math.max(c, this._css.radius), a = h.height, b = .5 * h.width;
            var i = degrees(Math.atan(a / b)), j = 90 - i, k = c / Math.cos(j * Math.PI / 180), l = 180 * Math.atan(a / b) / Math.PI, m = -1 * (90 - l), n = 90 - l, o = c * Math.tan(n * Math.PI / 180), g = c / Math.cos((90 - n) * Math.PI / 180), p = $.extend({}, h), q = $.extend({}, h);
            q.height += this._css.spacing, q.height = Math.ceil(q.height);
            var r = !0;
            return 2 * c >= h.width && (r = !1), {
                enabled: r,
                outside: q,
                dimensions: {inside: p, outside: q},
                top: g,
                border: k,
                skew: m,
                corner: o
            }
        }
    });
    var Tooltips = {
        tooltips: {},
        options: {defaultSkin: "dark", startingZIndex: 999999},
        _emptyClickHandler: function () {
        },
        init: function () {
            this.reset(), this._resizeHandler = $.proxy(this.onWindowResize, this), $(window).bind("resize orientationchange", this._resizeHandler), Browser.MobileSafari && $("body").bind("click", this._emptyClickHandler)
        },
        reset: function () {
            Tooltips.removeAll(), this._resizeHandler && $(window).unbind("resize orientationchange", this._resizeHandler), Browser.MobileSafari && $("body").unbind("click", this._emptyClickHandler)
        },
        onWindowResize: function () {
            this._resizeTimer && (window.clearTimeout(this._resizeTimer), this._resizeTimer = null), this._resizeTimer = _.delay($.proxy(function () {
                var a = this.getVisible();
                $.each(a, function (a, b) {
                    b.clearUpdatedTo(), b.position()
                })
            }, this), 15)
        },
        _getTooltips: function (a, b) {
            var c, d = [], e = [];
            if (_.isElement(a) ? (c = $(a).data("tipped-uids")) && (d = d.concat(c)) : $(a).each(function (a, b) {
                    (c = $(b).data("tipped-uids")) && (d = d.concat(c))
                }), !d[0] && !b) {
                var f = this.getTooltipByTooltipElement($(a).closest(".tpd-tooltip")[0]);
                f && f.element && (c = $(f.element).data("tipped-uids") || [], c && (d = d.concat(c)))
            }
            return d.length > 0 && $.each(d, $.proxy(function (a, b) {
                var c;
                (c = this.tooltips[b]) && e.push(c)
            }, this)), e
        },
        findElement: function (a) {
            var b = [];
            return _.isElement(a) && (b = this._getTooltips(a)), b[0] && b[0].element
        },
        get: function (a) {
            var b = $.extend({api: !1}, arguments[1] || {}), c = [];
            return _.isElement(a) ? c = this._getTooltips(a) : a instanceof $ ? a.each($.proxy(function (a, b) {
                var d = this._getTooltips(b, !0);
                d.length > 0 && (c = c.concat(d))
            }, this)) : "string" == $.type(a) && $.each(this.tooltips, function (b, d) {
                d.element && $(d.element).is(a) && c.push(d)
            }), b.api && $.each(c, function (a, b) {
                b.is("api", !0)
            }), c
        },
        getTooltipByTooltipElement: function (a) {
            if (!a)return null;
            var b = null;
            return $.each(this.tooltips, function (c, d) {
                d.is("build") && d._tooltip[0] === a && (b = d)
            }), b
        },
        getBySelector: function (a) {
            var b = [];
            return $.each(this.tooltips, function (c, d) {
                d.element && $(d.element).is(a) && b.push(d)
            }), b
        },
        getNests: function () {
            var a = [];
            return $.each(this.tooltips, function (b, c) {
                c.is("nest") && a.push(c)
            }), a
        },
        show: function (a) {
            $(this.get(a)).each(function (a, b) {
                b.show(!1, !0)
            })
        },
        hide: function (a) {
            $(this.get(a)).each(function (a, b) {
                b.hide()
            })
        },
        toggle: function (a) {
            $(this.get(a)).each(function (a, b) {
                b.toggle()
            })
        },
        hideAll: function (a) {
            $.each(this.getVisible(), function (b, c) {
                a && a == c || c.hide()
            })
        },
        refresh: function (a) {
            var b;
            b = a ? $.grep(this.get(a), function (a) {
                return a.is("visible")
            }) : this.getVisible(), $.each(b, function (a, b) {
                b.refresh()
            })
        },
        getVisible: function () {
            var a = [];
            return $.each(this.tooltips, function (b, c) {
                c.visible() && a.push(c)
            }), a
        },
        isVisibleByElement: function (a) {
            var b = !1;
            return _.isElement(a) && $.each(this.getVisible() || [], function (c, d) {
                return d.element == a ? (b = !0, !1) : void 0
            }), b
        },
        getHighestTooltip: function () {
            var a, b = 0;
            return $.each(this.tooltips, function (c, d) {
                d.zIndex > b && (b = d.zIndex, a = d)
            }), a
        },
        resetZ: function () {
            this.getVisible().length <= 1 && $.each(this.tooltips, function (a, b) {
                b.is("build") && !b.options.zIndex && b._tooltip.css({zIndex: b.zIndex = +Tooltips.options.startingZIndex})
            })
        },
        clearAjaxCache: function () {
            $.each(this.tooltips, $.proxy(function (a, b) {
                b.options.ajax && (b._cache && b._cache.xhr && (b._cache.xhr.abort(), b._cache.xhr = null), b.is("updated", !1), b.is("updating", !1), b.is("sanitized", !1))
            }, this)), AjaxCache.clear()
        },
        add: function (a) {
            this.tooltips[a.uid] = a
        },
        remove: function (a) {
            var b = this._getTooltips(a);
            this.removeTooltips(b)
        },
        removeTooltips: function (a) {
            a && $.each(a, $.proxy(function (a, b) {
                var c = b.uid;
                delete this.tooltips[c], Browser.IE && Browser.IE < 9 ? _.defer(function () {
                    b.remove()
                }) : b.remove()
            }, this))
        },
        removeDetached: function () {
            var a = this.getNests(), b = [];
            a.length > 0 && $.each(a, function (a, c) {
                c.is("detached") && (b.push(c), c.attach())
            }), $.each(this.tooltips, $.proxy(function (a, b) {
                b.element && !_.element.isAttached(b.element) && this.remove(b.element)
            }, this)), $.each(b, function (a, b) {
                b.detach()
            })
        },
        removeAll: function () {
            $.each(this.tooltips, $.proxy(function (a, b) {
                b.element && this.remove(b.element)
            }, this)), this.tooltips = {}
        },
        setDefaultSkin: function (a) {
            this.options.defaultSkin = a || "dark"
        },
        setStartingZIndex: function (a) {
            this.options.startingZIndex = a || 0
        }
    };
    return Tooltips.Position = {
        inversedPosition: {
            left: "right",
            right: "left",
            top: "bottom",
            bottom: "top",
            middle: "middle",
            center: "center"
        }, getInversedPosition: function (a) {
            var b = Position.split(a), c = b[1], d = b[2], e = Position.getOrientation(a), f = $.extend({
                horizontal: !0,
                vertical: !0
            }, arguments[1] || {});
            return "horizontal" == e ? (f.vertical && (c = this.inversedPosition[c]), f.horizontal && (d = this.inversedPosition[d])) : (f.vertical && (d = this.inversedPosition[d]), f.horizontal && (c = this.inversedPosition[c])), c + d
        }, getTooltipPositionFromTarget: function (a) {
            var b = Position.split(a);
            return this.getInversedPosition(b[1] + this.inversedPosition[b[2]])
        }
    }, $.extend(Tooltip.prototype, {
        supportsLoading: Support.css.transform && Support.css.animation,
        initialize: function (element, content) {
            if (this.element = element, this.element) {
                var options;
                "object" != $.type(content) || _.isElement(content) || _.isText(content) || _.isDocumentFragment(content) || content instanceof $ ? options = arguments[2] || {} : (options = content, content = null);
                var dataOptions = $(element).data("tipped-options");
                dataOptions && (options = deepExtend($.extend({}, options), eval("({" + dataOptions + "})"))), this.options = Options.create(options), this._cache = {
                    dimensions: {
                        width: 0,
                        height: 0
                    }, events: [], timers: {}, layouts: {}, is: {}, fnCallFn: "", updatedTo: {}
                }, this.queues = {showhide: $({})};
                var title = $(element).attr("title") || $(element).data("tipped-restore-title");
                if (!content) {
                    var dt = $(element).attr("data-tipped");
                    if (dt ? content = dt : title && (content = title), content) {
                        var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
                        content = content.replace(SCRIPT_REGEX, "")
                    }
                }
                if ((!content || content instanceof $ && !content[0]) && !(this.options.ajax && this.options.ajax.url || this.options.inline))return this._aborted = !0, void 0;
                title && ($(element).data("tipped-restore-title", title), $(element)[0].setAttribute("title", "")), this.content = content, this.title = $(this.element).data("tipped-title"), "undefined" != $.type(this.options.title) && (this.title = this.options.title), this.zIndex = this.options.zIndex || +Tooltips.options.startingZIndex;
                var uids = $(element).data("tipped-uids");
                uids || (uids = []);
                var uid = getUID();
                this.uid = uid, uids.push(uid), $(element).data("tipped-uids", uids);
                var parentTooltipElement = $(this.element).closest(".tpd-tooltip")[0], parentTooltip;
                parentTooltipElement && (parentTooltip = Tooltips.getTooltipByTooltipElement(parentTooltipElement)) && parentTooltip.is("nest", !0);
                var target = this.options.target;
                this.target = "mouse" == target ? this.element : "element" != target && target ? _.isElement(target) ? target : target instanceof $ && target[0] ? target[0] : this.element : this.element, this.options.inline && (this.content = $("#" + this.options.inline)[0]), this.options.ajax && (this.__content = this.content), "function" == $.type(this.content) && (this._fn = this.content), this.preBuild(), Tooltips.add(this)
            }
        },
        remove: function () {
            this.unbind(), this.clearTimers(), this.restoreElementToMarker(), this.stopLoading(), this.abort(), this.is("build") && this._tooltip && (this._tooltip.remove(), this._tooltip = null);
            var a = $(this.element).data("tipped-uids") || [], b = $.inArray(this.uid, a);
            if (b > -1 && (a.splice(b, 1), $(this.element).data("tipped-uids", a)), a.length < 1) {
                var c, d = "tipped-restore-title";
                (c = $(this.element).data(d)) && ("" != !$(this.element)[0].getAttribute("title") && $(this.element).attr("title", c), $(this.element).removeData(d)), $(this.element).removeData("tipped-uids")
            }
            var e = $(this.element).attr("class") || "", f = e.replace(/(tpd-delegation-uid-)\d+/g, "").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
            $(this.element).attr("class", f)
        },
        detach: function () {
            this.options.detach && !this.is("detached") && (this._tooltip && this._tooltip.detach(), this.is("detached", !0))
        },
        attach: function () {
            if (this.is("detached")) {
                var a;
                if ("string" == $.type(this.options.container)) {
                    var b = this.target;
                    "mouse" == b && (b = this.element), a = $($(b).closest(this.options.container).first())
                } else a = $(this.options.container);
                a[0] || (a = $(document.body)), a.append(this._tooltip), this.is("detached", !1)
            }
        },
        preBuild: function () {
            this.is("detached", !0);
            var a = {left: "-10000px", top: "-10000px", opacity: 0, zIndex: this.zIndex};
            this._tooltip = $("<div>").addClass("tpd-tooltip").addClass("tpd-skin-" + Tooltips.options.defaultSkin).addClass("tpd-size-" + this.options.size).css(a).hide(), this.createPreBuildObservers()
        },
        build: function () {
            this.is("build") || (this.attach(), Browser.IE && Browser.IE < 7 && this._tooltip.append(this.iframeShim = $("<iframe>").addClass("tpd-iframeshim").attr({
                frameBorder: 0,
                src: "javascript:'';"
            })), this._tooltip.append(this._skin = $("<div>").addClass("tpd-skin")).append(this._contentWrapper = $("<div>").addClass("tpd-content-wrapper").append(this._contentSpacer = $("<div>").addClass("tpd-content-spacer").append(this._titleWrapper = $("<div>").addClass("tpd-title-wrapper").append(this._titleSpacer = $("<div>").addClass("tpd-title-spacer").append(this._titleRelative = $("<div>").addClass("tpd-title-relative").append(this._titleRelativePadder = $("<div>").addClass("tpd-title-relative-padder").append(this._title = $("<div>").addClass("tpd-title"))))).append(this._close = $("<div>").addClass("tpd-close").append($("<div>").addClass("tpd-close-icon").html("&times;")))).append(this._contentRelative = $("<div>").addClass("tpd-content-relative").append(this._contentRelativePadder = $("<div>").addClass("tpd-content-relative-padder").append(this._content = $("<div>").addClass("tpd-content"))).append(this._inner_close = $("<div>").addClass("tpd-close").append($("<div>").addClass("tpd-close-icon").html("&times;")))))), this.skin = new Skin(this), this._contentSpacer.css({"border-radius": Math.max(this.skin._css.radius - this.skin._css.border, 0)}), this.createPostBuildObservers(), this.is("build", !0))
        },
        createPostBuildObservers: function () {
            this._tooltip.delegate(".tpd-close, .close-tooltip", "click", $.proxy(function (a) {
                a.stopPropagation(), a.preventDefault(), this.is("api", !1), this.hide(!0)
            }, this))
        },
        createPreBuildObservers: function () {
            this.bind(this.element, "mouseenter", this.setActive), this.bind(this._tooltip, Support.touch && Browser.MobileSafari ? "touchstart" : "mouseenter", this.setActive), this.bind(this.element, "mouseleave", function (a) {
                this.setIdle(a)
            }), this.bind(this._tooltip, "mouseleave", function (a) {
                this.setIdle(a)
            }), this.options.showOn && ($.each(this.options.showOn, $.proxy(function (a, b) {
                var c, d = !1;
                switch (a) {
                    case"element":
                        c = this.element, this.options.hideOn && this.options.showOn && "click" == this.options.hideOn.element && "click" == this.options.showOn.element && (d = !0, this.is("toggleable", d));
                        break;
                    case"tooltip":
                        c = this._tooltip;
                        break;
                    case"target":
                        c = this.target
                }
                if (c && b) {
                    var e = b;
                    this.bind(c, e, "click" == b && d ? function () {
                        this.is("api", !1), this.toggle()
                    } : function () {
                        this.is("api", !1), this.showDelayed()
                    })
                }
            }, this)), Support.touch && Browser.MobileSafari && this.bind(this._tooltip, "touchend", function () {
                this._tooltipTouchEndTime = (new Date).getTime()
            })), this.options.hideOn && $.each(this.options.hideOn, $.proxy(function (a, b) {
                var c;
                switch (a) {
                    case"element":
                        if (this.is("toggleable") && "click" == b)return;
                        c = this.element;
                        break;
                    case"tooltip":
                        c = this._tooltip;
                        break;
                    case"target":
                        c = this.target
                }
                if (c && b) {
                    var d = b;
                    Support.touch && Browser.MobileSafari && /^(target|element)/.test(a) && /mouse(leave|out)/.test(d) ? this.bind(c, d, function (a) {
                        if (this._tooltipTouchEndTime && /^mouse(leave|out)$/.test(a.type)) {
                            var b = (new Date).getTime();
                            if (b - this._tooltipTouchEndTime < 450)return
                        }
                        this.is("api", !1), this.hideDelayed()
                    }) : this.bind(c, d, function () {
                        this.is("api", !1), this.hideDelayed()
                    })
                }
            }, this)), this.options.hideOnClickOutside && ($(this.element).addClass("tpd-hideOnClickOutside"), this.bind(document.documentElement, "click touchend", $.proxy(function (a) {
                if (this.visible()) {
                    var b = $(a.target).closest(".tpd-tooltip, .tpd-hideOnClickOutside")[0];
                    (!b || b && b != this._tooltip[0] && b != this.element) && this.hide()
                }
            }, this))), "mouse" == this.options.target && this.bind(this.element, "mouseenter mousemove", $.proxy(function (a) {
                this._cache.event = a
            }, this));
            var a = !1;
            this.options.showOn && "mouse" == this.options.target && !this.options.fixed && (a = !0), a && this.bind(this.element, "mousemove", function () {
                this.is("build") && (this.is("api", !1), this.position())
            })
        }
    }), $.extend(Tooltip.prototype, {
        stop: function () {
            if (this._tooltip) {
                var a = this.queues.showhide;
                a.queue([]), this._tooltip.stop(1, 0)
            }
        }, showDelayed: function () {
            this.is("disabled") || (this.clearTimer("hide"), this.is("visible") || this.getTimer("show") || this.setTimer("show", $.proxy(function () {
                this.clearTimer("show"), this.show()
            }, this), this.options.showDelay || 1))
        }, show: function () {
            if (this.clearTimer("hide"), !this.visible() && !this.is("disabled") && $(this.target).is(":visible")) {
                this.is("visible", !0), this.attach(), this.stop();
                var a = this.queues.showhide;
                this.is("updated") || this.is("updating") || a.queue($.proxy(function (a) {
                    this._onResizeDimensions = {width: 0, height: 0}, this.update($.proxy(function (b) {
                        return b ? (this.is("visible", !1), this.detach(), void 0) : (a(), void 0)
                    }, this))
                }, this)), a.queue($.proxy(function (a) {
                    this.is("sanitized") ? (this.stopLoading(), this._contentWrapper.css({visibility: "visible"}), this.is("resize-to-content", !0), a()) : (this._contentWrapper.css({visibility: "hidden"}), this.startLoading(), this.sanitize($.proxy(function () {
                        this.stopLoading(), this._contentWrapper.css({visibility: "visible"}), this.is("resize-to-content", !0), a()
                    }, this)))
                }, this)), a.queue($.proxy(function (a) {
                    this.position(), this.raise(), a()
                }, this)), a.queue($.proxy(function (a) {
                    if (this.is("updated") && "function" == $.type(this.options.onShow)) {
                        var b = new Visible(this._tooltip);
                        this.options.onShow(this._content[0], this.element), b.restore(), a()
                    } else a()
                }, this)), a.queue($.proxy(function (a) {
                    this._show(this.options.fadeIn, function () {
                        a()
                    })
                }, this))
            }
        }, _show: function (a, b) {
            a = ("number" == $.type(a) ? a : this.options.fadeIn) || 0, b = b || ("function" == $.type(arguments[0]) ? arguments[0] : !1), this.options.hideOthers && Tooltips.hideAll(this), this._tooltip.fadeTo(a, 1, $.proxy(function () {
                b && b()
            }, this))
        }, hideDelayed: function () {
            this.clearTimer("show"), this.getTimer("hide") || !this.visible() || this.is("disabled") || this.setTimer("hide", $.proxy(function () {
                this.clearTimer("hide"), this.hide()
            }, this), this.options.hideDelay || 1)
        }, hide: function (a, b) {
            if (this.clearTimer("show"), this.visible() && !this.is("disabled")) {
                this.is("visible", !1), this.stop();
                var c = this.queues.showhide;
                c.queue($.proxy(function (a) {
                    this.abort(), a()
                }, this)), c.queue($.proxy(function (b) {
                    this._hide(a, b)
                }, this)), c.queue(function (a) {
                    Tooltips.resetZ(), a()
                }), c.queue($.proxy(function (a) {
                    this.clearUpdatedTo(), a()
                }, this)), "function" == $.type(this.options.afterHide) && this.is("updated") && c.queue($.proxy(function (a) {
                    this.options.afterHide(this._content[0], this.element), a()
                }, this)), this.options.cache || !this.options.ajax && !this._fn || c.queue($.proxy(function (a) {
                    this.is("updated", !1), this.is("updating", !1), this.is("sanitized", !1), a()
                }, this)), "function" == $.type(b) && c.queue(function (a) {
                    b(), a()
                }), c.queue($.proxy(function (a) {
                    this.detach(), a()
                }, this))
            }
        }, _hide: function (a, b) {
            b = b || ("function" == $.type(arguments[0]) ? arguments[0] : !1), this.attach(), this._tooltip.fadeTo(a ? 0 : this.options.fadeOut, 0, $.proxy(function () {
                this.stopLoading(), this.is("resize-to-content", !1), this._tooltip.hide(), b && b()
            }, this))
        }, toggle: function () {
            this.is("disabled") || this[this.visible() ? "hide" : "show"]()
        }, raise: function () {
            if (this.is("build") && !this.options.zIndex) {
                var a = Tooltips.getHighestTooltip();
                a && a != this && this.zIndex <= a.zIndex && (this.zIndex = a.zIndex + 1, this._tooltip.css({"z-index": this.zIndex}), this._tooltipShadow && (this._tooltipShadow.css({"z-index": this.zIndex}), this.zIndex = a.zIndex + 2, this._tooltip.css({"z-index": this.zIndex})))
            }
        }
    }), $.extend(Tooltip.prototype, {
        createElementMarker: function () {
            !this.elementMarker && this.content && _.element.isAttached(this.content) && ($(this.content).data("tpd-restore-inline-display", $(this.content).css("display")), this.elementMarker = $("<div>").hide(), $(this.content).before($(this.elementMarker).hide()))
        }, restoreElementToMarker: function () {
            var a;
            this.content, this.elementMarker && this.content && ((a = $(this.content).data("tpd-restore-inline-display")) && $(this.content).css({display: a}), $(this.elementMarker).before(this.content).remove())
        }, startLoading: function () {
            this.is("loading") || (this.build(), this.is("loading", !0), this.options.spinner && (this._tooltip.addClass("tpd-is-loading"), this.skin.startLoading(), this.is("resize-to-content") || (this.position(), this.raise(), this._show())))
        }, stopLoading: function () {
            this.build(), this.is("loading", !1), this.options.spinner && (this._tooltip.removeClass("tpd-is-loading"), this.skin.stopLoading())
        }, abort: function () {
            this.abortAjax(), this.abortSanitize(), this.is("refreshed-before-sanitized", !1)
        }, abortSanitize: function () {
            this._cache.voila && (this._cache.voila.abort(), this._cache.voila = null)
        }, abortAjax: function () {
            this._cache.xhr && (this._cache.xhr.abort(), this._cache.xhr = null, this.is("updated", !1), this.is("updating", !1))
        }, update: function (a) {
            if (!this.is("updating")) {
                this.is("updating", !0), this.build();
                var b = this.options.inline ? "inline" : this.options.ajax ? "ajax" : _.isElement(this.content) || _.isText(this.content) || _.isDocumentFragment(this.content) ? "element" : this._fn ? "function" : "html";
                switch (this._contentWrapper.css({visibility: "hidden"}), b) {
                    case"html":
                    case"element":
                    case"inline":
                        if (this.is("updated"))return a && a(), void 0;
                        this._update(this.content, a);
                        break;
                    case"function":
                        if (this.is("updated"))return a && a(), void 0;
                        var c = this._fn(this.element);
                        if (!c)return this.is("updating", !1), a && a(!0), void 0;
                        this._update(c, a)
                }
            }
        }, _update: function (a, b) {
            var c = {title: this.options.title, close: this.options.close};
            "string" == $.type(a) || _.isElement(a) || _.isText(a) || _.isDocumentFragment(a) || a instanceof $ ? c.content = a : $.extend(c, a);
            var a = c.content, d = c.title, e = c.close;
            this.content = a, this.title = d, this.close = e, this.createElementMarker(), (_.isElement(a) || a instanceof $) && $(a).show(), this._content.html(this.content), this._title.html(d && "string" == $.type(d) ? d : ""), this._titleWrapper[d ? "show" : "hide"](), this._close[(this.title || this.options.title) && e ? "show" : "hide"]();
            var f = e && !(this.options.title || this.title), g = e && !(this.options.title || this.title) && "overlap" != e, h = e && (this.options.title || this.title) && "overlap" != e;
            this._inner_close[f ? "show" : "hide"](), this._tooltip[(g ? "add" : "remove") + "Class"]("tpd-has-inner-close"), this._tooltip[(h ? "add" : "remove") + "Class"]("tpd-has-title-close"), this._content[(this.options.padding ? "remove" : "add") + "Class"]("tpd-content-no-padding"), this.finishUpdate(b)
        }, sanitize: function (a) {
            return !this.options.voila || this._content.find("img").length < 1 ? (this.is("sanitized", !0), a && a(), void 0) : (this._cache.voila = Voila(this._content, {method: "onload"}, $.proxy(function (b) {
                this._markImagesAsSanitized(b.images), this.is("refreshed-before-sanitized") ? (this.is("refreshed-before-sanitized", !1), this.sanitize(a)) : (this.is("sanitized", !0), a && a())
            }, this)), void 0)
        }, _markImagesAsSanitized: function (a) {
            $.each(a, function (a, b) {
                var c = b.img;
                $(c).data("completed-src", b.img.src)
            })
        }, _hasAllImagesSanitized: function () {
            var a = !0;
            return this._content.find("img").each(function (b, c) {
                var d = $(c).data("completed-src");
                return d && c.src == d ? void 0 : (a = !1, !1)
            }), a
        }, refresh: function () {
            if (this.visible()) {
                if (!this.is("sanitized"))return this.is("refreshed-before-sanitized", !0), void 0;
                this.is("refreshing", !0), this.clearTimer("refresh-spinner"), !this.options.voila || this._content.find("img").length < 1 || this._hasAllImagesSanitized() ? (this.is("should-update-dimensions", !0), this.position(), this.is("refreshing", !1)) : (this.is("sanitized", !1), this._contentWrapper.css({visibility: "hidden"}), this.startLoading(), this.sanitize($.proxy(function () {
                    this._contentWrapper.css({visibility: "visible"}), this.stopLoading(), this.is("should-update-dimensions", !0), this.position(), this.is("refreshing", !1)
                }, this)))
            }
        }, finishUpdate: function (a) {
            if (this.is("updated", !0), this.is("updating", !1), "function" == $.type(this.options.afterUpdate)) {
                var b = this._contentWrapper.css("visibility");
                b && this._contentWrapper.css({visibility: "visible"}), this.options.afterUpdate(this._content[0], this.element), b && this._contentWrapper.css({visibility: "hidden"})
            }
            a && a()
        }
    }), $.extend(Tooltip.prototype, {
        clearUpdatedTo: function () {
            this._cache.updatedTo = {}
        }, updateDimensionsToContent: function (a, b) {
            this.skin.build();
            var c = this.is("loading"), d = this._cache.updatedTo;
            if ((this._maxWidthPass || this.is("api") || this.is("should-update-dimensions") || d.stemPosition != b || d.loading != c) && (!c || !this.is("resize-to-content"))) {
                this._cache.updatedTo = {
                    type: this.is("resize-to-content") ? "content" : "spinner",
                    loading: this.is("loading"),
                    stemPosition: b
                }, this.is("should-update-dimensions") && this.is("should-update-dimensions", !1);
                var a = a || this.options.position.target, b = b || this.options.position.tooltip, e = Position.getSide(b), f = Position.getOrientation(b), g = this.skin._css.border;
                this._tooltip.addClass("tpd-tooltip-measuring");
                var h = this._tooltip.attr("style");
                this._tooltip.removeAttr("style");
                var i = {top: g, right: g, bottom: g, left: g}, j = 0;
                if ("vertical" == Position.getOrientation(b)) {
                    this.options.stem && (i[e] = this.skin["stem_" + e].getMath().dimensions.outside.height);
                    var k = this.getMouseRoom();
                    k[Position._flip[e]] && (i[e] += k[Position._flip[e]]);
                    var l = this.getContainmentLayout(b), m = this.getPaddingLine(a), n = !1;
                    Position.isPointWithinBoxLayout(m.x1, m.y1, l) || Position.isPointWithinBoxLayout(m.x2, m.y2, l) ? n = !0 : $.each("top right bottom left".split(" "), $.proxy(function (a, b) {
                        var c = this.getSideLine(l, b);
                        return Position.intersectsLine(m.x1, m.y1, m.x2, m.y2, c.x1, c.y1, c.x2, c.y2) ? (n = !0, !1) : void 0
                    }, this)), n && (j = "left" == e ? m.x1 - l.position.left : l.position.left + l.dimensions.width - m.x1, i[e] += j)
                }
                if (this.options.offset && "vertical" == f) {
                    var o = Position.adjustOffsetBasedOnPosition(this.options.offset, this.options.position.target, a);
                    0 !== o.x && (i.right += Math.abs(o.x))
                }
                var j;
                this.options.containment && (j = this.options.containment.padding) && ($.each(i, function (a) {
                    i[a] += j
                }), "vertical" == f ? i["left" == e ? "left" : "right"] -= j : i["top" == e ? "top" : "bottom"] -= j);
                var p = Bounds.viewport(), q = this.close && "overlap" != this.close && !this.title, r = {
                    width: 0,
                    height: 0
                };
                q && (r = this._innerCloseDimensions || {
                        width: this._inner_close.outerWidth(!0),
                        height: this._inner_close.outerHeight(!0)
                    }, this._innerCloseDimensions = r), this._contentRelativePadder.css({"padding-right": r.width}), this._contentSpacer.css({width: p.width - i.left - i.right});
                var s = {
                    width: this._content.innerWidth() + r.width,
                    height: Math.max(this._content.innerHeight(), r.height || 0)
                }, t = {width: 0, height: 0};
                if (this.title) {
                    var u = {width: 0, height: 0};
                    this._titleWrapper.add(this._titleSpacer).css({
                        width: "auto",
                        height: "auto"
                    }), this.close && "overlap" != this.close && (u = {
                        width: this._close.outerWidth(!0),
                        height: this._close.outerHeight(!0)
                    }, this._close.hide()), this._maxWidthPass && s.width > this.options.maxWidth && this._titleRelative.css({width: s.width}), this._titleRelativePadder.css({"padding-right": u.width});
                    var v = parseFloat(this._titleWrapper.css("border-bottom-width"));
                    t = {
                        width: this.title ? this._titleWrapper.innerWidth() : 0,
                        height: Math.max(this.title ? this._titleWrapper.innerHeight() + v : 0, u.height + v)
                    }, t.width > p.width - i.left - i.right && (t.width = p.width - i.left - i.right, this._titleSpacer.css({width: t.width}), t.height = Math.max(this.title ? this._titleWrapper.innerHeight() + v : 0, u.height + v)), s.width = Math.max(t.width, s.width), s.height += t.height, this._titleWrapper.css({height: Math.max(this.title ? this._titleWrapper.innerHeight() : 0, u.height)}), this.close && this._close.show()
                }
                if (this.options.stem) {
                    var w = "vertical" == f ? "height" : "width", x = this.skin["stem_" + e].getMath(), y = x.outside.width + 2 * this.skin._css.radius;
                    s[w] < y && (s[w] = y)
                }
                if (this._contentSpacer.css({width: s.width}), s.height != Math.max(this._content.innerHeight(), r.height) + (this.title ? this._titleRelative.outerHeight() : 0) && s.width++, this.is("resize-to-content") || (s = this.skin._css.spinner.dimensions), this.setDimensions(s), i = {
                        top: g,
                        right: g,
                        bottom: g,
                        left: g
                    }, this.options.stem) {
                    var z = Position.getSide(b);
                    i[z] = this.skin.stem_top.getMath().dimensions.outside.height
                }
                this._contentSpacer.css({
                    "margin-top": i.top,
                    "margin-left": +i.left,
                    width: s.width
                }), (this.title || this.close) && this._titleWrapper.css({
                    height: this._titleWrapper.innerHeight(),
                    width: s.width
                }), this._tooltip.removeClass("tpd-tooltip-measuring"), this._tooltip.attr("style", h);
                var A = this._contentRelative.add(this._titleRelative);
                this.options.maxWidth && s.width > this.options.maxWidth && !this._maxWidthPass && this.is("resize-to-content") && (A.css({width: this.options.maxWidth}), this._maxWidthPass = !0, this.updateDimensionsToContent(a, b), this._maxWidthPass = !1, A.css({width: "auto"}))
            }
        }, setDimensions: function (a) {
            this.skin.setDimensions(a)
        }, getContainmentSpace: function (a, b) {
            var c = this.getContainmentLayout(a, b), d = this.getTargetLayout(), e = d.position, f = d.dimensions, g = c.position, h = c.dimensions, i = {
                top: Math.max(e.top - g.top, 0),
                bottom: Math.max(g.top + h.height - (e.top + f.height), 0),
                left: Math.max(e.left - g.left, 0),
                right: Math.max(g.left + h.width - (e.left + f.width), 0)
            };
            return e.top > g.top + h.height && (i.top -= e.top - (g.top + h.height)), e.top + f.height < g.top && (i.bottom -= g.top - (e.top + f.height)), e.left > g.left + h.width && g.left + h.width >= e.left && (i.left -= e.left - (g.left + h.width)), e.left + f.width < g.left && (i.right -= g.left - (e.left + f.width)), this._cache.layouts.containmentSpace = i, i
        }, position: function () {
            if (this.visible()) {
                this.is("positioning", !0), this._cache.layouts = {}, this._cache.dimensions;
                var a = this.options.position.target, b = this.options.position.tooltip, c = b, d = a;
                this.updateDimensionsToContent(d, c);
                var e = this.getPositionBasedOnTarget(d, c), f = deepExtend(e), g = [];
                if (this.options.containment) {
                    var h = !1, i = {};
                    if ($.each("top right bottom left".split(" "), $.proxy(function (a, b) {
                            (i[b] = this.isSideWithinContainment(b, c, !0)) && (h = !0)
                        }, this)), h || (f.contained = !0), f.contained)this.setPosition(f); else {
                        g.unshift({position: f, targetPosition: d, stemPosition: c});
                        var j = Position.flip(a);
                        if (d = j, c = Position.flip(b), i[Position.getSide(d)] ? (this.updateDimensionsToContent(d, c), f = this.getPositionBasedOnTarget(d, c)) : f.contained = !1, f.contained)this.setPosition(f, c); else {
                            g.unshift({position: f, targetPosition: d, stemPosition: c});
                            var k, l = a, m = this.getContainmentSpace(c, !0), n = "horizontal" == Position.getOrientation(l) ? ["left", "right"] : ["top", "bottom"];
                            k = m[n[0]] === m[n[1]] ? "horizontal" == Position.getOrientation(l) ? "left" : "top" : n[m[n[0]] > m[n[1]] ? 0 : 1];
                            var o = Position.split(l)[1], p = k + o, q = Position.flip(p);
                            if (d = p, c = q, i[Position.getSide(d)] ? (this.updateDimensionsToContent(d, c), f = this.getPositionBasedOnTarget(d, c)) : f.contained = !1, f.contained)this.setPosition(f, c); else {
                                g.unshift({position: f, targetPosition: d, stemPosition: c});
                                var r, s = [];
                                if ($.each(g, function (a, b) {
                                        if (b.position.top >= 0 && b.position.left >= 0)r = b; else {
                                            var c = b.position.top >= 0 ? 1 : Math.abs(b.position.top), d = b.position.left >= 0 ? 1 : Math.abs(b.position.left);
                                            s.push({result: b, negativity: c * d})
                                        }
                                    }), !r) {
                                    var t = s[s.length - 1];
                                    $.each(s, function (a, b) {
                                        b.negativity < t.negativity && (t = b)
                                    }), r = t.result
                                }
                                this.updateDimensionsToContent(r.targetPosition, r.stemPosition, !0), this.setPosition(r.position, r.stemPosition)
                            }
                        }
                    }
                } else this.setPosition(f);
                this._cache.dimensions = this.skin._vars.dimensions, this.skin.paint(), this.is("positioning", !1)
            }
        }, getPositionBasedOnTarget: function (a, b) {
            var b = b || this.options.position.tooltip, c = this.getTargetDimensions(), d = {
                left: 0,
                top: 0
            }, e = {left: 0, top: 0};
            Position.getSide(a);
            var f = this.skin._vars, g = f.frames[Position.getSide(b)], h = Position.getOrientation(a), i = Position.split(a);
            if ("horizontal" == h) {
                var j = Math.floor(.5 * c.width);
                switch (i[2]) {
                    case"left":
                        e.left = j;
                        break;
                    case"middle":
                        d.left = c.width - j, e.left = d.left;
                        break;
                    case"right":
                        d.left = c.width, e.left = c.width - j
                }
                "bottom" == i[1] && (d.top = c.height, e.top = c.height)
            } else {
                var j = Math.floor(.5 * c.height);
                switch (i[2]) {
                    case"top":
                        e.top = j;
                        break;
                    case"middle":
                        d.top = c.height - j, e.top = d.top;
                        break;
                    case"bottom":
                        e.top = c.height - j, d.top = c.height
                }
                "right" == i[1] && (d.left = c.width, e.left = c.width)
            }
            var k = this.getTargetPosition(), l = $.extend({}, c, {
                top: k.top,
                left: k.left,
                connection: d,
                max: e
            }), m = {
                width: g.dimensions.width,
                height: g.dimensions.height,
                top: 0,
                left: 0,
                connection: f.connections[b].connection,
                stem: f.connections[b].stem
            };
            if (m.top = l.top + l.connection.top, m.left = l.left + l.connection.left, m.top -= m.connection.top, m.left -= m.connection.left, this.options.stem) {
                var n = f.stemDimensions.width, o = {
                    stem: {
                        top: m.top + m.stem.connection.top,
                        left: m.left + m.stem.connection.left
                    },
                    connection: {top: l.top + l.connection.top, left: l.left + l.connection.left},
                    max: {top: l.top + l.max.top, left: l.left + l.max.left}
                };
                if (!Position.isPointWithinBox(o.stem.left, o.stem.top, o.connection.left, o.connection.top, o.max.left, o.max.top)) {
                    var o = {
                        stem: {top: m.top + m.stem.connection.top, left: m.left + m.stem.connection.left},
                        connection: {top: l.top + l.connection.top, left: l.left + l.connection.left},
                        max: {top: l.top + l.max.top, left: l.left + l.max.left}
                    }, p = {
                        connection: Position.getDistance(o.stem.left, o.stem.top, o.connection.left, o.connection.top),
                        max: Position.getDistance(o.stem.left, o.stem.top, o.max.left, o.max.top)
                    }, q = Math.min(p.connection, p.max), r = o[p.connection <= p.max ? "connection" : "max"], s = "horizontal" == Position.getOrientation(b) ? "left" : "top", t = Position.getDistance(o.connection.left, o.connection.top, o.max.left, o.max.top);
                    if (t >= n) {
                        var u = {top: 0, left: 0}, v = r[s] < o.stem[s] ? -1 : 1;
                        u[s] = q * v, u[s] += Math.floor(.5 * n) * v, m.left += u.left, m.top += u.top
                    } else {
                        $.extend(o, {
                            center: {
                                top: Math.round(l.top + .5 * c.height),
                                left: Math.round(l.left + .5 * c.left)
                            }
                        });
                        var w = {
                            connection: Position.getDistance(o.center.left, o.center.top, o.connection.left, o.connection.top),
                            max: Position.getDistance(o.center.left, o.center.top, o.max.left, o.max.top)
                        }, q = p[w.connection <= w.max ? "connection" : "max"], x = {
                            top: 0,
                            left: 0
                        }, v = r[s] < o.stem[s] ? -1 : 1;
                        x[s] = q * v, m.left += x.left, m.top += x.top
                    }
                }
            }
            if (this.options.offset) {
                var y = $.extend({}, this.options.offset);
                y = Position.adjustOffsetBasedOnPosition(y, this.options.position.target, a), m.top += y.y, m.left += y.x
            }
            var z = this.getContainment({top: m.top, left: m.left}, b), A = z.horizontal && z.vertical, B = {
                x: 0,
                y: 0
            }, C = Position.getOrientation(b);
            if (!z[C]) {
                var D = "horizontal" == C, E = D ? ["left", "right"] : ["up", "down"], F = D ? "x" : "y", G = D ? "left" : "top", H = z.correction[F], I = this.getContainmentLayout(b), J = I.position[D ? "left" : "top"];
                if (0 !== H) {
                    var K = f.connections[b].move, L = K[E[0 > -1 * H ? 0 : 1]], M = 0 > H ? -1 : 1;
                    if (L >= H * M && m[G] + H >= J)m[G] += H, B[F] = -1 * H, A = !0; else if (Position.getOrientation(a) == Position.getOrientation(b)) {
                        if (m[G] += L * M, B[F] = -1 * L * M, m[G] < J) {
                            var N = J - m[G], O = K[E[0]] + K[E[1]], N = Math.min(N, O);
                            m[G] += N;
                            var P = B[F] - N;
                            P >= f.connections[b].move[E[0]] && P <= f.connections[b].move[E[1]] && (B[F] -= N)
                        }
                        z = this.getContainment({top: m.top, left: m.left}, b);
                        var Q = z.correction[F], R = deepExtend({}, m);
                        this.options.offset && (R.left -= this.options.offset.x, R.top -= this.options.offset.y);
                        var o = {stem: {top: R.top + m.stem.connection.top, left: R.left + m.stem.connection.left}};
                        o.stem[G] += B[F];
                        var S = this.getTargetLayout(), n = f.stemDimensions.width, T = Math.floor(.5 * n), U = J + I.dimensions[D ? "width" : "height"];
                        if ("x" == F) {
                            var V = S.position.left + T;
                            Q > 0 && (V += S.dimensions.width - 2 * T), (0 > Q && o.stem.left + Q >= V && R.left + Q >= J || Q > 0 && o.stem.left + Q <= V && R.left + Q <= U) && (R.left += Q)
                        } else {
                            var W = S.position.top + T;
                            Q > 0 && (W += S.dimensions.height - 2 * T), (0 > Q && o.stem.top + Q >= W && R.top + Q >= J || Q > 0 && o.stem.top + Q <= W && R.top + Q <= U) && (R.top += Q)
                        }
                        m = R, this.options.offset && (m.left += this.options.offset.x, m.top += this.options.offset.y)
                    }
                }
                z = this.getContainment({top: m.top, left: m.left}, b), A = z.horizontal && z.vertical
            }
            return {top: m.top, left: m.left, contained: A, shift: B}
        }, setPosition: function (a, b) {
            var c = this._position;
            if (!c || c.top != a.top || c.left != a.left) {
                var d;
                if (this.options.container != document.body) {
                    if ("string" == $.type(this.options.container)) {
                        var e = this.target;
                        "mouse" == e && (e = this.element), d = $($(e).closest(this.options.container).first())
                    } else d = $(d);
                    if (d[0]) {
                        var f = $(d).offset(), g = {
                            top: Math.round(f.top),
                            left: Math.round(f.left)
                        }, h = {top: Math.round($(d).scrollTop()), left: Math.round($(d).scrollLeft())};
                        a.top -= g.top, a.top += h.top, a.left -= g.left, a.left += h.left
                    }
                }
                this._position = a, this._tooltip.css({top: a.top, left: a.left})
            }
            this.skin.setStemPosition(b || this.options.position.tooltip, a.shift || {x: 0, y: 0})
        }, getSideLine: function (a, b) {
            var c = a.position.left, d = a.position.top, e = a.position.left, f = a.position.top;
            switch (b) {
                case"top":
                    e += a.dimensions.width;
                    break;
                case"bottom":
                    d += a.dimensions.height, e += a.dimensions.width, f += a.dimensions.height;
                    break;
                case"left":
                    f += a.dimensions.height;
                    break;
                case"right":
                    c += a.dimensions.width, e += a.dimensions.width, f += a.dimensions.height
            }
            return {x1: c, y1: d, x2: e, y2: f}
        }, isSideWithinContainment: function (a, b, c) {
            var d = this.getContainmentLayout(b, c), e = this.getTargetLayout(), f = this.getSideLine(e, a);
            if (Position.isPointWithinBoxLayout(f.x1, f.y1, d) || Position.isPointWithinBoxLayout(f.x2, f.y2, d))return !0;
            var g = !1;
            return $.each("top right bottom left".split(" "), $.proxy(function (a, b) {
                var c = this.getSideLine(d, b);
                return Position.intersectsLine(f.x1, f.y1, f.x2, f.y2, c.x1, c.y1, c.x2, c.y2) ? (g = !0, !1) : void 0
            }, this)), g
        }, getContainment: function (a, b) {
            var c = {horizontal: !0, vertical: !0, correction: {y: 0, x: 0}};
            if (this.options.containment) {
                var d = this.getContainmentLayout(b), e = this.skin._vars.frames[Position.getSide(b)].dimensions;
                this.options.containment && ((a.left < d.position.left || a.left + e.width > d.position.left + d.dimensions.width) && (c.horizontal = !1, c.correction.x = a.left < d.position.left ? d.position.left - a.left : d.position.left + d.dimensions.width - (a.left + e.width)), (a.top < d.position.top || a.top + e.height > d.position.top + d.dimensions.height) && (c.vertical = !1, c.correction.y = a.top < d.position.top ? d.position.top - a.top : d.position.top + d.dimensions.height - (a.top + e.height)))
            }
            return c
        }, getContainmentLayout: function (a, b) {
            var c = {top: $(window).scrollTop(), left: $(window).scrollLeft()}, d = this.target;
            "mouse" == d && (d = this.element);
            var e, f = $(d).closest(this.options.containment.selector).first()[0];
            e = f && "viewport" != this.options.containment.selector ? {
                dimensions: {
                    width: $(f).innerWidth(),
                    height: $(f).innerHeight()
                }, position: $(f).offset()
            } : {dimensions: Bounds.viewport(), position: c};
            var g = this.options.containment.padding;
            if (g && !b) {
                var h = Math.max(e.dimensions.height, e.dimensions.width);
                if (2 * g > h && (g = Math.max(Math.floor(.5 * h), 0)), g) {
                    e.dimensions.width -= 2 * g, e.dimensions.height -= 2 * g, e.position.top += g, e.position.left += g;
                    var i = Position.getOrientation(a);
                    "vertical" == i ? (e.dimensions.width += g, "left" == Position.getSide(a) && (e.position.left -= g)) : (e.dimensions.height += g, "top" == Position.getSide(a) && (e.position.top -= g))
                }
            }
            return this._cache.layouts.containmentLayout = e, e
        }, getMouseRoom: function () {
            var a = {top: 0, left: 0, right: 0, bottom: 0};
            if ("mouse" == this.options.target && !this.is("api")) {
                var b = Mouse.getActualPosition(this._cache.event), c = $(this.element).offset(), d = {
                    width: $(this.element).innerWidth(),
                    height: $(this.element).innerHeight()
                };
                a = {
                    top: Math.max(0, b.top - c.top),
                    bottom: Math.max(0, c.top + d.height - b.top),
                    left: Math.max(0, b.left - c.left),
                    right: Math.max(0, c.left + d.width - b.left)
                }
            }
            return a
        }, getTargetPosition: function () {
            var a;
            if ("mouse" == this.options.target)if (this.is("api")) {
                var b = $(this.element).offset();
                a = {top: Math.round(b.top), left: Math.round(b.left)}
            } else a = Mouse.getPosition(this._cache.event); else {
                var b = $(this.target).offset();
                a = {top: Math.round(b.top), left: Math.round(b.left)}
            }
            return this._cache.layouts.targetPosition = a, a
        }, getTargetDimensions: function () {
            if (this._cache.layouts.targetDimensions)return this._cache.layouts.targetDimensions;
            var a;
            return a = "mouse" == this.options.target ? Mouse.getDimensions() : {
                width: $(this.target).innerWidth(),
                height: $(this.target).innerHeight()
            }, this._cache.layouts.targetDimensions = a, a
        }, getTargetLayout: function () {
            if (this._cache.layouts.targetLayout)return this._cache.layouts.targetLayout;
            var a = {position: this.getTargetPosition(), dimensions: this.getTargetDimensions()};
            return this._cache.layouts.targetLayout = a, a
        }, getPaddingLine: function (a) {
            var b = this.getTargetLayout(), c = "left";
            if ("vertical" == Position.getOrientation(a))return this.getSideLine(b, Position.getSide(a));
            if (Position.isCorner(a)) {
                var d = Position.inverseCornerPlane(a);
                return c = Position.getSide(d), this.getSideLine(b, c)
            }
            var e = this.getSideLine(b, c), f = Math.round(.5 * b.dimensions.width);
            return e.x1 += f, e.x2 += f, e
        }
    }), $.extend(Tooltip.prototype, {
        setActive: function () {
            this.is("active", !0), this.visible() && this.raise(), this.options.hideAfter && this.clearTimer("idle")
        }, setIdle: function () {
            this.is("active", !1), this.options.hideAfter && this.setTimer("idle", $.proxy(function () {
                this.clearTimer("idle"), this.is("active") || this.hide()
            }, this), this.options.hideAfter)
        }
    }), $.extend(Tooltip.prototype, {
        bind: function (a, b, c, d) {
            b = b;
            var e = $.proxy(c, d || this);
            this._cache.events.push({element: a, eventName: b, handler: e}), $(a).bind(b, e)
        }, unbind: function () {
            $.each(this._cache.events, function (a, b) {
                $(b.element).unbind(b.eventName, b.handler)
            }), this._cache.events = []
        }
    }), $.extend(Tooltip.prototype, {
        disable: function () {
            this.is("disabled") || this.is("disabled", !0)
        }, enable: function () {
            this.is("disabled") && this.is("disabled", !1)
        }
    }), $.extend(Tooltip.prototype, {
        is: function (a, b) {
            return "boolean" == $.type(b) && (this._cache.is[a] = b), this._cache.is[a]
        }, visible: function () {
            return this.is("visible")
        }
    }), $.extend(Tooltip.prototype, {
        setTimer: function (a, b, c) {
            this._cache.timers[a] = _.delay(b, c)
        }, getTimer: function (a) {
            return this._cache.timers[a]
        }, clearTimer: function (a) {
            this._cache.timers[a] && (clearTimeout(this._cache.timers[a]), delete this._cache.timers[a])
        }, clearTimers: function () {
            $.each(this._cache.timers, function (a, b) {
                clearTimeout(b)
            }), this._cache.timers = {}
        }
    }), $.extend(Tipped, {
        init: function () {
            Tooltips.init()
        }, create: function (a, b) {
            var c = $.extend({}, arguments[2] || {}), d = [];
            return _.isElement(a) ? d.push(new Tooltip(a, b, c)) : $(a).each(function (a, e) {
                d.push(new Tooltip(e, b, c))
            }), new Collection(d)
        }, get: function (a) {
            var b = Tooltips.get(a);
            return new Collection(b)
        }, findElement: function (a) {
            return Tooltips.findElement(a)
        }, refresh: function (a, b, c) {
            return Tooltips.refresh(a, b, c), this
        }, setStartingZIndex: function (a) {
            return Tooltips.setStartingZIndex(a), this
        }, remove: function (a) {
            return Tooltips.remove(a), this
        }
    }), $.extend(Collection.prototype, {
        initialize: function (a) {
            return this.tooltips = a, this
        }, items: function () {
            return $.each(this.tooltips, function (a, b) {
                b.is("api", !0)
            }), this.tooltips
        }, refresh: function () {
            return $.each(this._tooltips, function (a, b) {
                b.is("visible") && b.refresh()
            }), this
        }, remove: function () {
            return Tooltips.removeTooltips(this.tooltips), this.tooltips = [], this
        }
    }), Tipped.init(), Tipped
});