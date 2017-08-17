!function (e, t, a, l) {
	var n, s, i, o, r, c, u, h, g, f, d, p = "mPageScroll2id", _ = "mPS2id", C = ".m_PageScroll2id,a[rel~='m_PageScroll2id'],.page-scroll-to-id,a[rel~='page-scroll-to-id'],._ps2id", v = { scrollSpeed: 1300, autoScrollSpeed: !0, scrollEasing: "easeInOutExpo", scrollingEasing: "easeInOutCirc", pageEndSmoothScroll: !0, layout: "vertical", offset: 0, highlightSelector: !1, clickedClass: _ + "-clicked", targetClass: _ + "-target", highlightClass: _ + "-highlight", forceSingleHighlight: !1, keepHighlightUntilNext: !1, highlightByNextTarget: !1, disablePluginBelow: !1, clickEvents: !0, onStart: function () { }, onComplete: function () { }, defaultSelector: !1, live: !0, liveSelector: !1 }, m = 0, I = {
		init: function (c) {
			var c = e.extend(!0, {}, v, c)
			if (e(a).data(_, c), s = e(a).data(_), !this.selector) {
				var u = "__" + _
				this.each(function () {
					var t = e(this)
					t.hasClass(u) || t.addClass(u)
				}), this.selector = "." + u
			} s.liveSelector && (this.selector += "," + s.liveSelector), n = n ? n + "," + this.selector : this.selector, s.defaultSelector && ("object" != typeof e(n) || 0 === e(n).length) && (n = C), s.clickEvents && e(a).undelegate("." + _).delegate(n, "click." + _, function (t) {
				if (O._isDisabled.call(null)) return O._removeClasses.call(null), l
				var a = e(this), n = a.attr("href"), s = a.prop("href")
				n && -1 !== n.indexOf("#/") || (O._reset.call(null), f = a.data("ps2id-offset") || 0, O._isValid.call(null, n, s) && O._findTarget.call(null, n) && (t.preventDefault(), o = "selector", r = a, O._setClasses.call(null, !0), O._scrollTo.call(null)))
			}), e(t).unbind("." + _).bind("scroll." + _ + " resize." + _, function () {
				if (O._isDisabled.call(null)) return O._removeClasses.call(null), l
				var t = e("._" + _ + "-t")
				t.each(function (a) {
					var l = e(this), n = l.attr("id"), s = O._findHighlight.call(null, n)
					O._setClasses.call(null, !1, l, s), a == t.length - 1 && O._extendClasses.call(null)
				})
			}), i = !0, O._setup.call(null), O._live.call(null)
		}, scrollTo: function (t, a) {
			if (O._isDisabled.call(null)) return O._removeClasses.call(null), l
			if (t && l !== t) {
				O._isInit.call(null)
				var n = { layout: s.layout, offset: s.offset, clicked: !1 }, a = e.extend(!0, {}, n, a)
				O._reset.call(null), h = a.layout, g = a.offset, t = -1 !== t.indexOf("#") ? t : "#" + t, O._isValid.call(null, t) && O._findTarget.call(null, t) && (o = "scrollTo", r = a.clicked, r && O._setClasses.call(null, !0), O._scrollTo.call(null))
			}
		}, destroy: function () { e(t).unbind("." + _), e(a).undelegate("." + _).removeData(_), e("._" + _ + "-t").removeData(_), O._removeClasses.call(null, !0) }
	}, O = {
		_isDisabled: function () {
			var e = t, l = "inner", n = s.disablePluginBelow instanceof Array ? [s.disablePluginBelow[0] || 0, s.disablePluginBelow[1] || 0] : [s.disablePluginBelow || 0, 0]
			return "innerWidth" in t || (l = "client", e = a.documentElement || a.body), e[l + "Width"] <= n[0] || e[l + "Height"] <= n[1]
		}, _isValid: function (e, a) {
			if (e) {
				a = a ? a : e
				var l = -1 !== a.indexOf("#/") ? a.split("#/")[0] : a.split("#")[0], n = ("" + t.location).split("#")[0]
				return "#" !== e && -1 !== e.indexOf("#") && ("" === l || l === n)
			}
		}, _setup: function () {
			var t = O._highlightSelector(), a = 1, l = 0
			return e(t).each(function () {
				var n = e(this), i = n.attr("href"), o = n.prop("href")
				if (O._isValid.call(null, i, o)) {
					var r = -1 !== i.indexOf("#/") ? i.split("#/")[1] : i.split("#")[1], c = e("#" + r)
					if (c.length > 0) {
						s.highlightByNextTarget && c !== l && (l ? l.data(_, { tn: c }) : c.data(_, { tn: "0" }), l = c), c.hasClass("_" + _ + "-t") || c.addClass("_" + _ + "-t"), c.data(_, { i: a }), n.hasClass("_" + _ + "-h") || n.addClass("_" + _ + "-h")
						var u = O._findHighlight.call(null, r)
						O._setClasses.call(null, !1, c, u), m = a, a++ , a == e(t).length && O._extendClasses.call(null)
					}
				}
			})
		}, _highlightSelector: function () { return s.highlightSelector && "" !== s.highlightSelector ? s.highlightSelector : n }, _findTarget: function (t) {
			var a = -1 !== t.indexOf("#/") ? t.split("#/")[1] : t.split("#")[1], l = e("#" + a)
			if (l.length < 1 || "fixed" === l.css("position")) {
				if ("top" !== a) return
				l = e("body")
			} return c = l, h || (h = s.layout), g = O._setOffset.call(null), u = ["" + (l.offset().top - g[0]), "" + (l.offset().left - g[1])], u[0] = u[0] < 0 ? 0 : u[0], u[1] = u[1] < 0 ? 0 : u[1], u
		}, _setOffset: function () {
			g || (g = s.offset ? s.offset : 0), f && (g = f)
			var t, a, l, n
			switch (typeof g) {
				case "object": case "string": t = [g.y ? g.y : g, g.x ? g.x : g], a = [t[0] instanceof jQuery ? t[0] : e(t[0]), t[1] instanceof jQuery ? t[1] : e(t[1])], a[0].length > 0 ? (l = a[0].height(), "fixed" === a[0].css("position") && (l += a[0][0].offsetTop)) : l = !isNaN(parseFloat(t[0])) && isFinite(t[0]) ? parseInt(t[0]) : 0, a[1].length > 0 ? (n = a[1].width(), "fixed" === a[1].css("position") && (n += a[1][0].offsetLeft)) : n = !isNaN(parseFloat(t[1])) && isFinite(t[1]) ? parseInt(t[1]) : 0
					break
				case "function": t = g.call(null), t instanceof Array ? (l = t[0], n = t[1]) : l = n = t
					break
				default: l = n = parseInt(g)
			}return [l, n]
		}, _findHighlight: function (a) {
			var l = ("" + t.location).split("#")[0], n = e("._" + _ + "-h[href='#" + a + "']"), s = e("._" + _ + "-h[href='" + l + "#" + a + "']"), i = e("._" + _ + "-h[href='#/" + a + "']"), o = e("._" + _ + "-h[href='" + l + "#/" + a + "']")
			return n = n.length > 0 ? n : s, i = i.length > 0 ? i : o, i.length > 0 ? i : n
		}, _setClasses: function (t, a, l) {
			var n = s.clickedClass, i = s.targetClass, o = s.highlightClass
			t && n && "" !== n ? (e("." + n).removeClass(n), r.addClass(n)) : a && i && "" !== i && l && o && "" !== o && (O._currentTarget.call(null, a) ? (a.addClass(i), l.addClass(o)) : (!s.keepHighlightUntilNext || e("." + o).length > 1) && (a.removeClass(i), l.removeClass(o)))
		}, _extendClasses: function () {
			var t = s.targetClass, a = s.highlightClass, l = e("." + t), n = e("." + a), i = t + "-first", o = t + "-last", r = a + "-first", c = a + "-last"
			e("._" + _ + "-t").removeClass(i + " " + o), e("._" + _ + "-h").removeClass(r + " " + c), s.forceSingleHighlight ? s.keepHighlightUntilNext && l.length > 1 ? (l.slice(0, 1).removeClass(t), n.slice(0, 1).removeClass(a)) : (l.slice(1).removeClass(t), n.slice(1).removeClass(a)) : (l.slice(0, 1).addClass(i).end().slice(-1).addClass(o), n.slice(0, 1).addClass(r).end().slice(-1).addClass(c))
		}, _removeClasses: function (t) { e("." + s.clickedClass).removeClass(s.clickedClass), e("." + s.targetClass).removeClass(s.targetClass + " " + s.targetClass + "-first " + s.targetClass + "-last"), e("." + s.highlightClass).removeClass(s.highlightClass + " " + s.highlightClass + "-first " + s.highlightClass + "-last"), t && (e("._" + _ + "-t").removeClass("_" + _ + "-t"), e("._" + _ + "-h").removeClass("_" + _ + "-h")) }, _currentTarget: function (a) {
			var n = s["target_" + a.data(_).i], i = a.data("ps2id-target"), o = i ? e(i)[0].getBoundingClientRect() : a[0].getBoundingClientRect()
			if (l !== n) {
				var r = a.offset().top, c = a.offset().left, u = n.from ? n.from + r : r, h = n.to ? n.to + r : r, g = n.fromX ? n.fromX + c : c, f = n.toX ? n.toX + c : c
				return o.top >= h && o.top <= u && o.left >= f && o.left <= g
			} var d = e(t).height(), p = e(t).width(), C = i ? e(i).height() : a.height(), v = i ? e(i).width() : a.width(), m = 1 + C / d, I = m, O = d > C ? m * (d / C) : m, S = 1 + v / p, M = S, b = p > v ? S * (p / v) : S, w = [o.top <= d / I, o.bottom >= d / O, o.left <= p / M, o.right >= p / b]
			if (s.highlightByNextTarget) {
				var y = a.data(_).tn
				if (y) {
					var k = y[0].getBoundingClientRect()
					"vertical" === s.layout ? w = [o.top <= d / 2, k.top > d / 2, 1, 1] : "horizontal" === s.layout && (w = [1, 1, o.left <= p / 2, k.left > p / 2])
				}
			} return w[0] && w[1] && w[2] && w[3]
		}, _scrollTo: function () {
			s.scrollSpeed = parseInt(s.scrollSpeed), u = s.pageEndSmoothScroll ? O._pageEndSmoothScroll.call(null) : u
			var a = e("html,body"), l = s.autoScrollSpeed ? O._autoScrollSpeed.call(null) : s.scrollSpeed, n = a.is(":animated") ? s.scrollingEasing : s.scrollEasing, i = e(t).scrollTop(), o = e(t).scrollLeft()
			switch (h) {
				case "horizontal": o != u[1] && (O._callbacks.call(null, "onStart"), a.stop().animate({ scrollLeft: u[1] }, l, n).promise().then(function () { O._callbacks.call(null, "onComplete") }))
					break
				case "auto": if (i != u[0] || o != u[1]) if (O._callbacks.call(null, "onStart"), navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
					var r
					a.stop().animate({ pageYOffset: u[0], pageXOffset: u[1] }, { duration: l, easing: n, step: function (e, a) { "pageXOffset" == a.prop ? r = e : "pageYOffset" == a.prop && t.scrollTo(r, e) } }).promise().then(function () { O._callbacks.call(null, "onComplete") })
				} else a.stop().animate({ scrollTop: u[0], scrollLeft: u[1] }, l, n).promise().then(function () { O._callbacks.call(null, "onComplete") })
					break
				default: i != u[0] && (O._callbacks.call(null, "onStart"), a.stop().animate({ scrollTop: u[0] }, l, n).promise().then(function () { O._callbacks.call(null, "onComplete") }))
			}
		}, _pageEndSmoothScroll: function () {
			var l = e(a).height(), n = e(a).width(), s = e(t).height(), i = e(t).width()
			return [l - u[0] < s ? l - s : u[0], n - u[1] < i ? n - i : u[1]]
		}, _autoScrollSpeed: function () {
			var l = e(t).scrollTop(), n = e(t).scrollLeft(), i = e(a).height(), o = e(a).width(), r = [s.scrollSpeed + s.scrollSpeed * Math.floor(Math.abs(u[0] - l) / i * 100) / 100, s.scrollSpeed + s.scrollSpeed * Math.floor(Math.abs(u[1] - n) / o * 100) / 100]
			return Math.max.apply(Math, r)
		}, _callbacks: function (e) {
			if (s) switch (this[_] = { trigger: o, clicked: r, target: c, scrollTo: { y: u[0], x: u[1] } }, e) {
				case "onStart": s.onStart.call(null, this[_])
					break
				case "onComplete": s.onComplete.call(null, this[_])
			}
		}, _reset: function () { h = g = f = !1 }, _isInit: function () { i || I.init.apply(this) }, _live: function () { d = setTimeout(function () { s.live ? e(O._highlightSelector()).length !== m && O._setup.call(null) : d && clearTimeout(d), O._live.call(null) }, 1e3) }, _easing: function () {
			function t(e) {
				var t = 7.5625, a = 2.75
				return 1 / a > e ? t * e * e : 2 / a > e ? t * (e -= 1.5 / a) * e + .75 : 2.5 / a > e ? t * (e -= 2.25 / a) * e + .9375 : t * (e -= 2.625 / a) * e + .984375
			} e.easing.easeInQuad = e.easing.easeInQuad || function (e) { return e * e }, e.easing.easeOutQuad = e.easing.easeOutQuad || function (e) { return 1 - (1 - e) * (1 - e) }, e.easing.easeInOutQuad = e.easing.easeInOutQuad || function (e) { return .5 > e ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2 }, e.easing.easeInCubic = e.easing.easeInCubic || function (e) { return e * e * e }, e.easing.easeOutCubic = e.easing.easeOutCubic || function (e) { return 1 - Math.pow(1 - e, 3) }, e.easing.easeInOutCubic = e.easing.easeInOutCubic || function (e) { return .5 > e ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2 }, e.easing.easeInQuart = e.easing.easeInQuart || function (e) { return e * e * e * e }, e.easing.easeOutQuart = e.easing.easeOutQuart || function (e) { return 1 - Math.pow(1 - e, 4) }, e.easing.easeInOutQuart = e.easing.easeInOutQuart || function (e) { return .5 > e ? 8 * e * e * e * e : 1 - Math.pow(-2 * e + 2, 4) / 2 }, e.easing.easeInQuint = e.easing.easeInQuint || function (e) { return e * e * e * e * e }, e.easing.easeOutQuint = e.easing.easeOutQuint || function (e) { return 1 - Math.pow(1 - e, 5) }, e.easing.easeInOutQuint = e.easing.easeInOutQuint || function (e) { return .5 > e ? 16 * e * e * e * e * e : 1 - Math.pow(-2 * e + 2, 5) / 2 }, e.easing.easeInExpo = e.easing.easeInExpo || function (e) { return 0 === e ? 0 : Math.pow(2, 10 * e - 10) }, e.easing.easeOutExpo = e.easing.easeOutExpo || function (e) { return 1 === e ? 1 : 1 - Math.pow(2, -10 * e) }, e.easing.easeInOutExpo = e.easing.easeInOutExpo || function (e) { return 0 === e ? 0 : 1 === e ? 1 : .5 > e ? Math.pow(2, 20 * e - 10) / 2 : (2 - Math.pow(2, -20 * e + 10)) / 2 }, e.easing.easeInSine = e.easing.easeInSine || function (e) { return 1 - Math.cos(e * Math.PI / 2) }, e.easing.easeOutSine = e.easing.easeOutSine || function (e) { return Math.sin(e * Math.PI / 2) }, e.easing.easeInOutSine = e.easing.easeInOutSine || function (e) { return -(Math.cos(Math.PI * e) - 1) / 2 }, e.easing.easeInCirc = e.easing.easeInCirc || function (e) { return 1 - Math.sqrt(1 - Math.pow(e, 2)) }, e.easing.easeOutCirc = e.easing.easeOutCirc || function (e) { return Math.sqrt(1 - Math.pow(e - 1, 2)) }, e.easing.easeInOutCirc = e.easing.easeInOutCirc || function (e) { return .5 > e ? (1 - Math.sqrt(1 - Math.pow(2 * e, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * e + 2, 2)) + 1) / 2 }, e.easing.easeInElastic = e.easing.easeInElastic || function (e) { return 0 === e ? 0 : 1 === e ? 1 : -Math.pow(2, 10 * e - 10) * Math.sin((10 * e - 10.75) * (2 * Math.PI / 3)) }, e.easing.easeOutElastic = e.easing.easeOutElastic || function (e) { return 0 === e ? 0 : 1 === e ? 1 : Math.pow(2, -10 * e) * Math.sin((10 * e - .75) * (2 * Math.PI / 3)) + 1 }, e.easing.easeInOutElastic = e.easing.easeInOutElastic || function (e) { return 0 === e ? 0 : 1 === e ? 1 : .5 > e ? -(Math.pow(2, 20 * e - 10) * Math.sin((20 * e - 11.125) * (2 * Math.PI / 4.5))) / 2 : Math.pow(2, -20 * e + 10) * Math.sin((20 * e - 11.125) * (2 * Math.PI / 4.5)) / 2 + 1 }, e.easing.easeInBack = e.easing.easeInBack || function (e) { return 2.70158 * e * e * e - 1.70158 * e * e }, e.easing.easeOutBack = e.easing.easeOutBack || function (e) { return 1 + 2.70158 * Math.pow(e - 1, 3) + 1.70158 * Math.pow(e - 1, 2) }, e.easing.easeInOutBack = e.easing.easeInOutBack || function (e) { return .5 > e ? Math.pow(2 * e, 2) * (7.189819 * e - 2.5949095) / 2 : (Math.pow(2 * e - 2, 2) * (3.5949095 * (2 * e - 2) + 2.5949095) + 2) / 2 }, e.easing.easeInBounce = e.easing.easeInBounce || function (e) { return 1 - t(1 - e) }, e.easing.easeOutBounce = e.easing.easeOutBounce || t, e.easing.easeInOutBounce = e.easing.easeInOutBounce || function (e) { return .5 > e ? (1 - t(1 - 2 * e)) / 2 : (1 + t(2 * e - 1)) / 2 }
		}
	}
	O._easing.call(), e.fn[p] = function (t) { return I[t] ? I[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? (e.error("Method " + t + " does not exist"), l) : I.init.apply(this, arguments) }, e[p] = function (t) { return I[t] ? I[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? (e.error("Method " + t + " does not exist"), l) : I.init.apply(this, arguments) }, e[p].defaults = v
}(jQuery, window, document)
