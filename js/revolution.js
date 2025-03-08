/*
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.9
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.skinkers.com/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function(a) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], a)
    } else {
        a(jQuery)
    }
}(function(f) {
    var y = "1.6.9",
        p = "left",
        o = "right",
        e = "up",
        x = "down",
        c = "in",
        A = "out",
        m = "none",
        s = "auto",
        l = "swipe",
        t = "pinch",
        B = "tap",
        j = "doubletap",
        b = "longtap",
        z = "hold",
        E = "horizontal",
        u = "vertical",
        i = "all",
        r = 10,
        g = "start",
        k = "move",
        h = "end",
        q = "cancel",
        a = "ontouchstart" in window,
        v = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled,
        d = window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        C = "TouchSwipe";
    var n = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null,
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: "label, button, input, select, textarea, a, .noSwipe",
        preventDefaultEvents: true
    };
    f.fn.swipetp = function(H) {
        var G = f(this),
            F = G.data(C);
        if (F && typeof H === "string") {
            if (F[H]) {
                return F[H].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                f.error("Method " + H + " does not exist on jQuery.swipetp")
            }
        } else {
            if (!F && (typeof H === "object" || !H)) {
                return w.apply(this, arguments)
            }
        }
        return G
    };
    f.fn.swipetp.version = y;
    f.fn.swipetp.defaults = n;
    f.fn.swipetp.phases = {
        PHASE_START: g,
        PHASE_MOVE: k,
        PHASE_END: h,
        PHASE_CANCEL: q
    };
    f.fn.swipetp.directions = {
        LEFT: p,
        RIGHT: o,
        UP: e,
        DOWN: x,
        IN: c,
        OUT: A
    };
    f.fn.swipetp.pageScroll = {
        NONE: m,
        HORIZONTAL: E,
        VERTICAL: u,
        AUTO: s
    };
    f.fn.swipetp.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        ALL: i
    };

    function w(F) {
        if (F && (F.allowPageScroll === undefined && (F.swipe !== undefined || F.swipeStatus !== undefined))) {
            F.allowPageScroll = m
        }
        if (F.click !== undefined && F.tap === undefined) {
            F.tap = F.click
        }
        if (!F) {
            F = {}
        }
        F = f.extend({}, f.fn.swipetp.defaults, F);
        return this.each(function() {
            var H = f(this);
            var G = H.data(C);
            if (!G) {
                G = new D(this, F);
                H.data(C, G)
            }
        })
    }

    function D(a5, aw) {
        var aA = (a || d || !aw.fallbackToMouseEvents),
            K = aA ? (d ? (v ? "MSPointerDown" : "pointerdown") : "touchstart") : "mousedown",
            az = aA ? (d ? (v ? "MSPointerMove" : "pointermove") : "touchmove") : "mousemove",
            V = aA ? (d ? (v ? "MSPointerUp" : "pointerup") : "touchend") : "mouseup",
            T = aA ? null : "mouseleave",
            aE = (d ? (v ? "MSPointerCancel" : "pointercancel") : "touchcancel");
        var ah = 0,
            aQ = null,
            ac = 0,
            a2 = 0,
            a0 = 0,
            H = 1,
            ar = 0,
            aK = 0,
            N = null;
        var aS = f(a5);
        var aa = "start";
        var X = 0;
        var aR = null;
        var U = 0,
            a3 = 0,
            a6 = 0,
            ae = 0,
            O = 0;
        var aX = null,
            ag = null;
        try {
            aS.bind(K, aO);
            aS.bind(aE, ba)
        } catch (al) {
            f.error("events not supported " + K + "," + aE + " on jQuery.swipetp")
        }
        this.enable = function() {
            aS.bind(K, aO);
            aS.bind(aE, ba);
            return aS
        };
        this.disable = function() {
            aL();
            return aS
        };
        this.destroy = function() {
            aL();
            aS.data(C, null);
            aS = null
        };
        this.option = function(bd, bc) {
            if (aw[bd] !== undefined) {
                if (bc === undefined) {
                    return aw[bd]
                } else {
                    aw[bd] = bc
                }
            } else {
                f.error("Option " + bd + " does not exist on jQuery.swipetp.options")
            }
            return null
        };

        function aO(be) {
            if (aC()) {
                return
            }
            if (f(be.target).closest(aw.excludedElements, aS).length > 0) {
                return
            }
            var bf = be.originalEvent ? be.originalEvent : be;
            var bd, bg = bf.touches,
                bc = bg ? bg[0] : bf;
            aa = g;
            if (bg) {
                X = bg.length
            } else {
                be.preventDefault()
            }
            ah = 0;
            aQ = null;
            aK = null;
            ac = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            ar = 0;
            aR = ak();
            N = ab();
            S();
            if (!bg || (X === aw.fingers || aw.fingers === i) || aY()) {
                aj(0, bc);
                U = au();
                if (X == 2) {
                    aj(1, bg[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start)
                }
                if (aw.swipeStatus || aw.pinchStatus) {
                    bd = P(bf, aa)
                }
            } else {
                bd = false
            }
            if (bd === false) {
                aa = q;
                P(bf, aa);
                return bd
            } else {
                if (aw.hold) {
                    ag = setTimeout(f.proxy(function() {
                        aS.trigger("hold", [bf.target]);
                        if (aw.hold) {
                            bd = aw.hold.call(aS, bf, bf.target)
                        }
                    }, this), aw.longTapThreshold)
                }
                ap(true)
            }
            return null
        }

        function a4(bf) {
            var bi = bf.originalEvent ? bf.originalEvent : bf;
            if (aa === h || aa === q || an()) {
                return
            }
            var be, bj = bi.touches,
                bd = bj ? bj[0] : bi;
            var bg = aI(bd);
            a3 = au();
            if (bj) {
                X = bj.length
            }
            if (aw.hold) {
                clearTimeout(ag)
            }
            aa = k;
            if (X == 2) {
                if (a2 == 0) {
                    aj(1, bj[1]);
                    a2 = a0 = av(aR[0].start, aR[1].start)
                } else {
                    aI(bj[1]);
                    a0 = av(aR[0].end, aR[1].end);
                    aK = at(aR[0].end, aR[1].end)
                }
                H = a8(a2, a0);
                ar = Math.abs(a2 - a0)
            }
            if ((X === aw.fingers || aw.fingers === i) || !bj || aY()) {
                aQ = aM(bg.start, bg.end);
                am(bf, aQ);
                ah = aT(bg.start, bg.end);
                ac = aN();
                aJ(aQ, ah);
                if (aw.swipeStatus || aw.pinchStatus) {
                    be = P(bi, aa)
                }
                if (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave) {
                    var bc = true;
                    if (aw.triggerOnTouchLeave) {
                        var bh = aZ(this);
                        bc = F(bg.end, bh)
                    }
                    if (!aw.triggerOnTouchEnd && bc) {
                        aa = aD(k)
                    } else {
                        if (aw.triggerOnTouchLeave && !bc) {
                            aa = aD(h)
                        }
                    }
                    if (aa == q || aa == h) {
                        P(bi, aa)
                    }
                }
            } else {
                aa = q;
                P(bi, aa)
            }
            if (be === false) {
                aa = q;
                P(bi, aa)
            }
        }

        function M(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc,
                be = bd.touches;
            if (be) {
                if (be.length) {
                    G();
                    return true
                }
            }
            if (an()) {
                X = ae
            }
            a3 = au();
            ac = aN();
            if (bb() || !ao()) {
                aa = q;
                P(bd, aa)
            } else {
                if (aw.triggerOnTouchEnd || (aw.triggerOnTouchEnd == false && aa === k)) {
                    bc.preventDefault();
                    aa = h;
                    P(bd, aa)
                } else {
                    if (!aw.triggerOnTouchEnd && a7()) {
                        aa = h;
                        aG(bd, aa, B)
                    } else {
                        if (aa === k) {
                            aa = q;
                            P(bd, aa)
                        }
                    }
                }
            }
            ap(false);
            return null
        }

        function ba() {
            X = 0;
            a3 = 0;
            U = 0;
            a2 = 0;
            a0 = 0;
            H = 1;
            S();
            ap(false)
        }

        function L(bc) {
            var bd = bc.originalEvent ? bc.originalEvent : bc;
            if (aw.triggerOnTouchLeave) {
                aa = aD(h);
                P(bd, aa)
            }
        }

        function aL() {
            aS.unbind(K, aO);
            aS.unbind(aE, ba);
            aS.unbind(az, a4);
            aS.unbind(V, M);
            if (T) {
                aS.unbind(T, L)
            }
            ap(false)
        }

        function aD(bg) {
            var bf = bg;
            var be = aB();
            var bd = ao();
            var bc = bb();
            if (!be || bc) {
                bf = q
            } else {
                if (bd && bg == k && (!aw.triggerOnTouchEnd || aw.triggerOnTouchLeave)) {
                    bf = h
                } else {
                    if (!bd && bg == h && aw.triggerOnTouchLeave) {
                        bf = q
                    }
                }
            }
            return bf
        }

        function P(be, bc) {
            var bd, bf = be.touches;
            if ((J() || W()) || (Q() || aY())) {
                if (J() || W()) {
                    bd = aG(be, bc, l)
                }
                if ((Q() || aY()) && bd !== false) {
                    bd = aG(be, bc, t)
                }
            } else {
                if (aH() && bd !== false) {
                    bd = aG(be, bc, j)
                } else {
                    if (aq() && bd !== false) {
                        bd = aG(be, bc, b)
                    } else {
                        if (ai() && bd !== false) {
                            bd = aG(be, bc, B)
                        }
                    }
                }
            }
            if (bc === q) {
                ba(be)
            }
            if (bc === h) {
                if (bf) {
                    if (!bf.length) {
                        ba(be)
                    }
                } else {
                    ba(be)
                }
            }
            return bd
        }

        function aG(bf, bc, be) {
            var bd;
            if (be == l) {
                aS.trigger("swipeStatus", [bc, aQ || null, ah || 0, ac || 0, X, aR]);
                if (aw.swipeStatus) {
                    bd = aw.swipeStatus.call(aS, bf, bc, aQ || null, ah || 0, ac || 0, X, aR);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && aW()) {
                    aS.trigger("swipe", [aQ, ah, ac, X, aR]);
                    if (aw.swipe) {
                        bd = aw.swipe.call(aS, bf, aQ, ah, ac, X, aR);
                        if (bd === false) {
                            return false
                        }
                    }
                    switch (aQ) {
                        case p:
                            aS.trigger("swipeLeft", [aQ, ah, ac, X, aR]);
                            if (aw.swipeLeft) {
                                bd = aw.swipeLeft.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case o:
                            aS.trigger("swipeRight", [aQ, ah, ac, X, aR]);
                            if (aw.swipeRight) {
                                bd = aw.swipeRight.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case e:
                            aS.trigger("swipeUp", [aQ, ah, ac, X, aR]);
                            if (aw.swipeUp) {
                                bd = aw.swipeUp.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break;
                        case x:
                            aS.trigger("swipeDown", [aQ, ah, ac, X, aR]);
                            if (aw.swipeDown) {
                                bd = aw.swipeDown.call(aS, bf, aQ, ah, ac, X, aR)
                            }
                            break
                    }
                }
            }
            if (be == t) {
                aS.trigger("pinchStatus", [bc, aK || null, ar || 0, ac || 0, X, H, aR]);
                if (aw.pinchStatus) {
                    bd = aw.pinchStatus.call(aS, bf, bc, aK || null, ar || 0, ac || 0, X, H, aR);
                    if (bd === false) {
                        return false
                    }
                }
                if (bc == h && a9()) {
                    switch (aK) {
                        case c:
                            aS.trigger("pinchIn", [aK || null, ar || 0, ac || 0, X, H, aR]);
                            if (aw.pinchIn) {
                                bd = aw.pinchIn.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR)
                            }
                            break;
                        case A:
                            aS.trigger("pinchOut", [aK || null, ar || 0, ac || 0, X, H, aR]);
                            if (aw.pinchOut) {
                                bd = aw.pinchOut.call(aS, bf, aK || null, ar || 0, ac || 0, X, H, aR)
                            }
                            break
                    }
                }
            }
            if (be == B) {
                if (bc === q || bc === h) {
                    clearTimeout(aX);
                    clearTimeout(ag);
                    if (Z() && !I()) {
                        O = au();
                        aX = setTimeout(f.proxy(function() {
                            O = null;
                            aS.trigger("tap", [bf.target]);
                            if (aw.tap) {
                                bd = aw.tap.call(aS, bf, bf.target)
                            }
                        }, this), aw.doubleTapThreshold)
                    } else {
                        O = null;
                        aS.trigger("tap", [bf.target]);
                        if (aw.tap) {
                            bd = aw.tap.call(aS, bf, bf.target)
                        }
                    }
                }
            } else {
                if (be == j) {
                    if (bc === q || bc === h) {
                        clearTimeout(aX);
                        O = null;
                        aS.trigger("doubletap", [bf.target]);
                        if (aw.doubleTap) {
                            bd = aw.doubleTap.call(aS, bf, bf.target)
                        }
                    }
                } else {
                    if (be == b) {
                        if (bc === q || bc === h) {
                            clearTimeout(aX);
                            O = null;
                            aS.trigger("longtap", [bf.target]);
                            if (aw.longTap) {
                                bd = aw.longTap.call(aS, bf, bf.target)
                            }
                        }
                    }
                }
            }
            return bd
        }

        function ao() {
            var bc = true;
            if (aw.threshold !== null) {
                bc = ah >= aw.threshold
            }
            return bc
        }

        function bb() {
            var bc = false;
            if (aw.cancelThreshold !== null && aQ !== null) {
                bc = (aU(aQ) - ah) >= aw.cancelThreshold
            }
            return bc
        }

        function af() {
            if (aw.pinchThreshold !== null) {
                return ar >= aw.pinchThreshold
            }
            return true
        }

        function aB() {
            var bc;
            if (aw.maxTimeThreshold) {
                if (ac >= aw.maxTimeThreshold) {
                    bc = false
                } else {
                    bc = true
                }
            } else {
                bc = true
            }
            return bc
        }

        function am(bc, bd) {
            if (aw.preventDefaultEvents === false) {
                return
            }
            if (aw.allowPageScroll === m) {
                bc.preventDefault()
            } else {
                var be = aw.allowPageScroll === s;
                switch (bd) {
                    case p:
                        if ((aw.swipeLeft && be) || (!be && aw.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case o:
                        if ((aw.swipeRight && be) || (!be && aw.allowPageScroll != E)) {
                            bc.preventDefault()
                        }
                        break;
                    case e:
                        if ((aw.swipeUp && be) || (!be && aw.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break;
                    case x:
                        if ((aw.swipeDown && be) || (!be && aw.allowPageScroll != u)) {
                            bc.preventDefault()
                        }
                        break
                }
            }
        }

        function a9() {
            var bd = aP();
            var bc = Y();
            var be = af();
            return bd && bc && be
        }

        function aY() {
            return !!(aw.pinchStatus || aw.pinchIn || aw.pinchOut)
        }

        function Q() {
            return !!(a9() && aY())
        }

        function aW() {
            var bf = aB();
            var bh = ao();
            var be = aP();
            var bc = Y();
            var bd = bb();
            var bg = !bd && bc && be && bh && bf;
            return bg
        }

        function W() {
            return !!(aw.swipe || aw.swipeStatus || aw.swipeLeft || aw.swipeRight || aw.swipeUp || aw.swipeDown)
        }

        function J() {
            return !!(aW() && W())
        }

        function aP() {
            return ((X === aw.fingers || aw.fingers === i) || !a)
        }

        function Y() {
            return aR[0].end.x !== 0
        }

        function a7() {
            return !!(aw.tap)
        }

        function Z() {
            return !!(aw.doubleTap)
        }

        function aV() {
            return !!(aw.longTap)
        }

        function R() {
            if (O == null) {
                return false
            }
            var bc = au();
            return (Z() && ((bc - O) <= aw.doubleTapThreshold))
        }

        function I() {
            return R()
        }

        function ay() {
            return ((X === 1 || !a) && (isNaN(ah) || ah < aw.threshold))
        }

        function a1() {
            return ((ac > aw.longTapThreshold) && (ah < r))
        }

        function ai() {
            return !!(ay() && a7())
        }

        function aH() {
            return !!(R() && Z())
        }

        function aq() {
            return !!(a1() && aV())
        }

        function G() {
            a6 = au();
            ae = event.touches.length + 1
        }

        function S() {
            a6 = 0;
            ae = 0
        }

        function an() {
            var bc = false;
            if (a6) {
                var bd = au() - a6;
                if (bd <= aw.fingerReleaseThreshold) {
                    bc = true
                }
            }
            return bc
        }

        function aC() {
            return !!(aS.data(C + "_intouch") === true)
        }

        function ap(bc) {
            if (bc === true) {
                aS.bind(az, a4);
                aS.bind(V, M);
                if (T) {
                    aS.bind(T, L)
                }
            } else {
                aS.unbind(az, a4, false);
                aS.unbind(V, M, false);
                if (T) {
                    aS.unbind(T, L, false)
                }
            }
            aS.data(C + "_intouch", bc === true)
        }

        function aj(bd, bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            aR[bd].identifier = be;
            aR[bd].start.x = aR[bd].end.x = bc.pageX || bc.clientX;
            aR[bd].start.y = aR[bd].end.y = bc.pageY || bc.clientY;
            return aR[bd]
        }

        function aI(bc) {
            var be = bc.identifier !== undefined ? bc.identifier : 0;
            var bd = ad(be);
            bd.end.x = bc.pageX || bc.clientX;
            bd.end.y = bc.pageY || bc.clientY;
            return bd
        }

        function ad(bd) {
            for (var bc = 0; bc < aR.length; bc++) {
                if (aR[bc].identifier == bd) {
                    return aR[bc]
                }
            }
        }

        function ak() {
            var bc = [];
            for (var bd = 0; bd <= 5; bd++) {
                bc.push({
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    identifier: 0
                })
            }
            return bc
        }

        function aJ(bc, bd) {
            bd = Math.max(bd, aU(bc));
            N[bc].distance = bd
        }

        function aU(bc) {
            if (N[bc]) {
                return N[bc].distance
            }
            return undefined
        }

        function ab() {
            var bc = {};
            bc[p] = ax(p);
            bc[o] = ax(o);
            bc[e] = ax(e);
            bc[x] = ax(x);
            return bc
        }

        function ax(bc) {
            return {
                direction: bc,
                distance: 0
            }
        }

        function aN() {
            return a3 - U
        }

        function av(bf, be) {
            var bd = Math.abs(bf.x - be.x);
            var bc = Math.abs(bf.y - be.y);
            return Math.round(Math.sqrt(bd * bd + bc * bc))
        }

        function a8(bc, bd) {
            var be = (bd / bc) * 1;
            return be.toFixed(2)
        }

        function at() {
            if (H < 1) {
                return A
            } else {
                return c
            }
        }

        function aT(bd, bc) {
            return Math.round(Math.sqrt(Math.pow(bc.x - bd.x, 2) + Math.pow(bc.y - bd.y, 2)))
        }

        function aF(bf, bd) {
            var bc = bf.x - bd.x;
            var bh = bd.y - bf.y;
            var be = Math.atan2(bh, bc);
            var bg = Math.round(be * 180 / Math.PI);
            if (bg < 0) {
                bg = 360 - Math.abs(bg)
            }
            return bg
        }

        function aM(bd, bc) {
            var be = aF(bd, bc);
            if ((be <= 45) && (be >= 0)) {
                return p
            } else {
                if ((be <= 360) && (be >= 315)) {
                    return p
                } else {
                    if ((be >= 135) && (be <= 225)) {
                        return o
                    } else {
                        if ((be > 45) && (be < 135)) {
                            return x
                        } else {
                            return e
                        }
                    }
                }
            }
        }

        function au() {
            var bc = new Date();
            return bc.getTime()
        }

        function aZ(bc) {
            bc = f(bc);
            var be = bc.offset();
            var bd = {
                left: be.left,
                right: be.left + bc.outerWidth(),
                top: be.top,
                bottom: be.top + bc.outerHeight()
            };
            return bd
        }

        function F(bc, bd) {
            return (bc.x > bd.left && bc.x < bd.right && bc.y > bd.top && bc.y < bd.bottom)
        }
    }
}));

if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = console.groupCollapsed = function() {};
}

if (window.tplogs == true)
    try {
        console.groupCollapsed("ThemePunch GreenSocks Logs");
    } catch (e) {}


var oldgs = window.GreenSockGlobals;
oldgs_queue = window._gsQueue;

var punchgs = window.GreenSockGlobals = {};

if (window.tplogs == true)
    try {
        console.info("Build GreenSock SandBox for ThemePunch Plugins");
        console.info("GreenSock TweenLite Engine Initalised by ThemePunch Plugin");
    } catch (e) {}

    /*!
     * VERSION: 1.18.2
     * DATE: 2015-12-22
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     *
     * @author: Jack Doyle, jack@greensock.com
     */
    ! function(a, b) {
        "use strict";
        var c = a.GreenSockGlobals = a.GreenSockGlobals || a;
        if (!c.TweenLite) {
            var d, e, f, g, h, i = function(a) {
                    var b, d = a.split("."),
                        e = c;
                    for (b = 0; b < d.length; b++) e[d[b]] = e = e[d[b]] || {};
                    return e
                },
                j = i("com.greensock"),
                k = 1e-10,
                l = function(a) {
                    var b, c = [],
                        d = a.length;
                    for (b = 0; b !== d; c.push(a[b++]));
                    return c
                },
                m = function() {},
                n = function() {
                    var a = Object.prototype.toString,
                        b = a.call([]);
                    return function(c) {
                        return null != c && (c instanceof Array || "object" == typeof c && !!c.push && a.call(c) === b)
                    }
                }(),
                o = {},
                p = function(d, e, f, g) {
                    this.sc = o[d] ? o[d].sc : [], o[d] = this, this.gsClass = null, this.func = f;
                    var h = [];
                    this.check = function(j) {
                        for (var k, l, m, n, q, r = e.length, s = r; --r > -1;)(k = o[e[r]] || new p(e[r], [])).gsClass ? (h[r] = k.gsClass, s--) : j && k.sc.push(this);
                        if (0 === s && f)
                            for (l = ("com.greensock." + d).split("."), m = l.pop(), n = i(l.join("."))[m] = this.gsClass = f.apply(f, h), g && (c[m] = n, q = "undefined" != typeof module && module.exports, !q && "function" == typeof define && define.amd ? define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + d.split(".").pop(), [], function() {
                                    return n
                                }) : d === b && q && (module.exports = n)), r = 0; r < this.sc.length; r++) this.sc[r].check()
                    }, this.check(!0)
                },
                q = a._gsDefine = function(a, b, c, d) {
                    return new p(a, b, c, d)
                },
                r = j._class = function(a, b, c) {
                    return b = b || function() {}, q(a, [], function() {
                        return b
                    }, c), b
                };
            q.globals = c;
            var s = [0, 0, 1, 1],
                t = [],
                u = r("easing.Ease", function(a, b, c, d) {
                    this._func = a, this._type = c || 0, this._power = d || 0, this._params = b ? s.concat(b) : s
                }, !0),
                v = u.map = {},
                w = u.register = function(a, b, c, d) {
                    for (var e, f, g, h, i = b.split(","), k = i.length, l = (c || "easeIn,easeOut,easeInOut").split(","); --k > -1;)
                        for (f = i[k], e = d ? r("easing." + f, null, !0) : j.easing[f] || {}, g = l.length; --g > -1;) h = l[g], v[f + "." + h] = v[h + f] = e[h] = a.getRatio ? a : a[h] || new a
                };
            for (f = u.prototype, f._calcEnd = !1, f.getRatio = function(a) {
                    if (this._func) return this._params[0] = a, this._func.apply(null, this._params);
                    var b = this._type,
                        c = this._power,
                        d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
                    return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *= d * d * d : 4 === c && (d *= d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
                }, d = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], e = d.length; --e > -1;) f = d[e] + ",Power" + e, w(new u(null, null, 1, e), f, "easeOut", !0), w(new u(null, null, 2, e), f, "easeIn" + (0 === e ? ",easeNone" : "")), w(new u(null, null, 3, e), f, "easeInOut");
            v.linear = j.easing.Linear.easeIn, v.swing = j.easing.Quad.easeInOut;
            var x = r("events.EventDispatcher", function(a) {
                this._listeners = {}, this._eventTarget = a || this
            });
            f = x.prototype, f.addEventListener = function(a, b, c, d, e) {
                e = e || 0;
                var f, i, j = this._listeners[a],
                    k = 0;
                for (null == j && (this._listeners[a] = j = []), i = j.length; --i > -1;) f = j[i], f.c === b && f.s === c ? j.splice(i, 1) : 0 === k && f.pr < e && (k = i + 1);
                j.splice(k, 0, {
                    c: b,
                    s: c,
                    up: d,
                    pr: e
                }), this !== g || h || g.wake()
            }, f.removeEventListener = function(a, b) {
                var c, d = this._listeners[a];
                if (d)
                    for (c = d.length; --c > -1;)
                        if (d[c].c === b) return void d.splice(c, 1)
            }, f.dispatchEvent = function(a) {
                var b, c, d, e = this._listeners[a];
                if (e)
                    for (b = e.length, c = this._eventTarget; --b > -1;) d = e[b], d && (d.up ? d.c.call(d.s || c, {
                        type: a,
                        target: c
                    }) : d.c.call(d.s || c))
            };
            var y = a.requestAnimationFrame,
                z = a.cancelAnimationFrame,
                A = Date.now || function() {
                    return (new Date).getTime()
                },
                B = A();
            for (d = ["ms", "moz", "webkit", "o"], e = d.length; --e > -1 && !y;) y = a[d[e] + "RequestAnimationFrame"], z = a[d[e] + "CancelAnimationFrame"] || a[d[e] + "CancelRequestAnimationFrame"];
            r("Ticker", function(a, b) {
                var c, d, e, f, i, j = this,
                    l = A(),
                    n = b !== !1 && y ? "auto" : !1,
                    o = 500,
                    p = 33,
                    q = "tick",
                    r = function(a) {
                        var b, g, h = A() - B;
                        h > o && (l += h - p), B += h, j.time = (B - l) / 1e3, b = j.time - i, (!c || b > 0 || a === !0) && (j.frame++, i += b + (b >= f ? .004 : f - b), g = !0), a !== !0 && (e = d(r)), g && j.dispatchEvent(q)
                    };
                x.call(j), j.time = j.frame = 0, j.tick = function() {
                    r(!0)
                }, j.lagSmoothing = function(a, b) {
                    o = a || 1 / k, p = Math.min(b, o, 0)
                }, j.sleep = function() {
                    null != e && (n && z ? z(e) : clearTimeout(e), d = m, e = null, j === g && (h = !1))
                }, j.wake = function(a) {
                    null !== e ? j.sleep() : a ? l += -B + (B = A()) : j.frame > 10 && (B = A() - o + 5), d = 0 === c ? m : n && y ? y : function(a) {
                        return setTimeout(a, 1e3 * (i - j.time) + 1 | 0)
                    }, j === g && (h = !0), r(2)
                }, j.fps = function(a) {
                    return arguments.length ? (c = a, f = 1 / (c || 60), i = this.time + f, void j.wake()) : c
                }, j.useRAF = function(a) {
                    return arguments.length ? (j.sleep(), n = a, void j.fps(c)) : n
                }, j.fps(a), setTimeout(function() {
                    "auto" === n && j.frame < 5 && "hidden" !== document.visibilityState && j.useRAF(!1)
                }, 1500)
            }), f = j.Ticker.prototype = new j.events.EventDispatcher, f.constructor = j.Ticker;
            var C = r("core.Animation", function(a, b) {
                if (this.vars = b = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(b.delay) || 0, this._timeScale = 1, this._active = b.immediateRender === !0, this.data = b.data, this._reversed = b.reversed === !0, V) {
                    h || g.wake();
                    var c = this.vars.useFrames ? U : V;
                    c.add(this, c._time), this.vars.paused && this.paused(!0)
                }
            });
            g = C.ticker = new j.Ticker, f = C.prototype, f._dirty = f._gc = f._initted = f._paused = !1, f._totalTime = f._time = 0, f._rawPrevTime = -1, f._next = f._last = f._onUpdate = f._timeline = f.timeline = null, f._paused = !1;
            var D = function() {
                h && A() - B > 2e3 && g.wake(), setTimeout(D, 2e3)
            };
            D(), f.play = function(a, b) {
                return null != a && this.seek(a, b), this.reversed(!1).paused(!1)
            }, f.pause = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!0)
            }, f.resume = function(a, b) {
                return null != a && this.seek(a, b), this.paused(!1)
            }, f.seek = function(a, b) {
                return this.totalTime(Number(a), b !== !1)
            }, f.restart = function(a, b) {
                return this.reversed(!1).paused(!1).totalTime(a ? -this._delay : 0, b !== !1, !0)
            }, f.reverse = function(a, b) {
                return null != a && this.seek(a || this.totalDuration(), b), this.reversed(!0).paused(!1)
            }, f.render = function(a, b, c) {}, f.invalidate = function() {
                return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
            }, f.isActive = function() {
                var a, b = this._timeline,
                    c = this._startTime;
                return !b || !this._gc && !this._paused && b.isActive() && (a = b.rawTime()) >= c && a < c + this.totalDuration() / this._timeScale
            }, f._enabled = function(a, b) {
                return h || g.wake(), this._gc = !a, this._active = this.isActive(), b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
            }, f._kill = function(a, b) {
                return this._enabled(!1, !1)
            }, f.kill = function(a, b) {
                return this._kill(a, b), this
            }, f._uncache = function(a) {
                for (var b = a ? this : this.timeline; b;) b._dirty = !0, b = b.timeline;
                return this
            }, f._swapSelfInParams = function(a) {
                for (var b = a.length, c = a.concat(); --b > -1;) "{self}" === a[b] && (c[b] = this);
                return c
            }, f._callback = function(a) {
                var b = this.vars;
                b[a].apply(b[a + "Scope"] || b.callbackScope || this, b[a + "Params"] || t)
            }, f.eventCallback = function(a, b, c, d) {
                if ("on" === (a || "").substr(0, 2)) {
                    var e = this.vars;
                    if (1 === arguments.length) return e[a];
                    null == b ? delete e[a] : (e[a] = b, e[a + "Params"] = n(c) && -1 !== c.join("").indexOf("{self}") ? this._swapSelfInParams(c) : c, e[a + "Scope"] = d), "onUpdate" === a && (this._onUpdate = b)
                }
                return this
            }, f.delay = function(a) {
                return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
            }, f.duration = function(a) {
                return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
            }, f.totalDuration = function(a) {
                return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
            }, f.time = function(a, b) {
                return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(a > this._duration ? this._duration : a, b)) : this._time
            }, f.totalTime = function(a, b, c) {
                if (h || g.wake(), !arguments.length) return this._totalTime;
                if (this._timeline) {
                    if (0 > a && !c && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                        this._dirty && this.totalDuration();
                        var d = this._totalDuration,
                            e = this._timeline;
                        if (a > d && !c && (a = d), this._startTime = (this._paused ? this._pauseTime : e._time) - (this._reversed ? d - a : a) / this._timeScale, e._dirty || this._uncache(!1), e._timeline)
                            for (; e._timeline;) e._timeline._time !== (e._startTime + e._totalTime) / e._timeScale && e.totalTime(e._totalTime, !0), e = e._timeline
                    }
                    this._gc && this._enabled(!0, !1), (this._totalTime !== a || 0 === this._duration) && (I.length && X(), this.render(a, b, !1), I.length && X())
                }
                return this
            }, f.progress = f.totalProgress = function(a, b) {
                var c = this.duration();
                return arguments.length ? this.totalTime(c * a, b) : c ? this._time / c : this.ratio
            }, f.startTime = function(a) {
                return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
            }, f.endTime = function(a) {
                return this._startTime + (0 != a ? this.totalDuration() : this.duration()) / this._timeScale
            }, f.timeScale = function(a) {
                if (!arguments.length) return this._timeScale;
                if (a = a || k, this._timeline && this._timeline.smoothChildTiming) {
                    var b = this._pauseTime,
                        c = b || 0 === b ? b : this._timeline.totalTime();
                    this._startTime = c - (c - this._startTime) * this._timeScale / a
                }
                return this._timeScale = a, this._uncache(!1)
            }, f.reversed = function(a) {
                return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
            }, f.paused = function(a) {
                if (!arguments.length) return this._paused;
                var b, c, d = this._timeline;
                return a != this._paused && d && (h || a || g.wake(), b = d.rawTime(), c = b - this._pauseTime, !a && d.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = this.isActive(), !a && 0 !== c && this._initted && this.duration() && (b = d.smoothChildTiming ? this._totalTime : (b - this._startTime) / this._timeScale, this.render(b, b === this._totalTime, !0))), this._gc && !a && this._enabled(!0, !1), this
            };
            var E = r("core.SimpleTimeline", function(a) {
                C.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming = !0
            });
            f = E.prototype = new C, f.constructor = E, f.kill()._gc = !1, f._first = f._last = f._recent = null, f._sortChildren = !1, f.add = f.insert = function(a, b, c, d) {
                var e, f;
                if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), e = this._last, this._sortChildren)
                    for (f = a._startTime; e && e._startTime > f;) e = e._prev;
                return e ? (a._next = e._next, e._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = e, this._recent = a, this._timeline && this._uncache(!0), this
            }, f._remove = function(a, b) {
                return a.timeline === this && (b || a._enabled(!1, !0), a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev), a._next = a._prev = a.timeline = null, a === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
            }, f.render = function(a, b, c) {
                var d, e = this._first;
                for (this._totalTime = this._time = this._rawPrevTime = a; e;) d = e._next, (e._active || a >= e._startTime && !e._paused) && (e._reversed ? e.render((e._dirty ? e.totalDuration() : e._totalDuration) - (a - e._startTime) * e._timeScale, b, c) : e.render((a - e._startTime) * e._timeScale, b, c)), e = d
            }, f.rawTime = function() {
                return h || g.wake(), this._totalTime
            };
            var F = r("TweenLite", function(b, c, d) {
                    if (C.call(this, c, d), this.render = F.prototype.render, null == b) throw "Cannot tween a null target.";
                    this.target = b = "string" != typeof b ? b : F.selector(b) || b;
                    var e, f, g, h = b.jquery || b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType),
                        i = this.vars.overwrite;
                    if (this._overwrite = i = null == i ? T[F.defaultOverwrite] : "number" == typeof i ? i >> 0 : T[i], (h || b instanceof Array || b.push && n(b)) && "number" != typeof b[0])
                        for (this._targets = g = l(b), this._propLookup = [], this._siblings = [], e = 0; e < g.length; e++) f = g[e], f ? "string" != typeof f ? f.length && f !== a && f[0] && (f[0] === a || f[0].nodeType && f[0].style && !f.nodeType) ? (g.splice(e--, 1), this._targets = g = g.concat(l(f))) : (this._siblings[e] = Y(f, this, !1), 1 === i && this._siblings[e].length > 1 && $(f, this, null, 1, this._siblings[e])) : (f = g[e--] = F.selector(f), "string" == typeof f && g.splice(e + 1, 1)) : g.splice(e--, 1);
                    else this._propLookup = {}, this._siblings = Y(b, this, !1), 1 === i && this._siblings.length > 1 && $(b, this, null, 1, this._siblings);
                    (this.vars.immediateRender || 0 === c && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -k, this.render(-this._delay))
                }, !0),
                G = function(b) {
                    return b && b.length && b !== a && b[0] && (b[0] === a || b[0].nodeType && b[0].style && !b.nodeType)
                },
                H = function(a, b) {
                    var c, d = {};
                    for (c in a) S[c] || c in b && "transform" !== c && "x" !== c && "y" !== c && "width" !== c && "height" !== c && "className" !== c && "border" !== c || !(!P[c] || P[c] && P[c]._autoCSS) || (d[c] = a[c], delete a[c]);
                    a.css = d
                };
            f = F.prototype = new C, f.constructor = F, f.kill()._gc = !1, f.ratio = 0, f._firstPT = f._targets = f._overwrittenProps = f._startAt = null, f._notifyPluginsOfEnabled = f._lazy = !1, F.version = "1.18.2", F.defaultEase = f._ease = new u(null, null, 1, 1), F.defaultOverwrite = "auto", F.ticker = g, F.autoSleep = 120, F.lagSmoothing = function(a, b) {
                g.lagSmoothing(a, b)
            }, F.selector = a.$ || a.jQuery || function(b) {
                var c = a.$ || a.jQuery;
                return c ? (F.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
            };
            var I = [],
                J = {},
                K = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
                L = function(a) {
                    for (var b, c = this._firstPT, d = 1e-6; c;) b = c.blob ? a ? this.join("") : this.start : c.c * a + c.s, c.r ? b = Math.round(b) : d > b && b > -d && (b = 0), c.f ? c.fp ? c.t[c.p](c.fp, b) : c.t[c.p](b) : c.t[c.p] = b, c = c._next
                },
                M = function(a, b, c, d) {
                    var e, f, g, h, i, j, k, l = [a, b],
                        m = 0,
                        n = "",
                        o = 0;
                    for (l.start = a, c && (c(l), a = l[0], b = l[1]), l.length = 0, e = a.match(K) || [], f = b.match(K) || [], d && (d._next = null, d.blob = 1, l._firstPT = d), i = f.length, h = 0; i > h; h++) k = f[h], j = b.substr(m, b.indexOf(k, m) - m), n += j || !h ? j : ",", m += j.length, o ? o = (o + 1) % 5 : "rgba(" === j.substr(-5) && (o = 1), k === e[h] || e.length <= h ? n += k : (n && (l.push(n), n = ""), g = parseFloat(e[h]), l.push(g), l._firstPT = {
                        _next: l._firstPT,
                        t: l,
                        p: l.length - 1,
                        s: g,
                        c: ("=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * parseFloat(k.substr(2)) : parseFloat(k) - g) || 0,
                        f: 0,
                        r: o && 4 > o
                    }), m += k.length;
                    return n += b.substr(m), n && l.push(n), l.setRatio = L, l
                },
                N = function(a, b, c, d, e, f, g, h) {
                    var i, j, k = "get" === c ? a[b] : c,
                        l = typeof a[b],
                        m = "string" == typeof d && "=" === d.charAt(1),
                        n = {
                            t: a,
                            p: b,
                            s: k,
                            f: "function" === l,
                            pg: 0,
                            n: e || b,
                            r: f,
                            pr: 0,
                            c: m ? parseInt(d.charAt(0) + "1", 10) * parseFloat(d.substr(2)) : parseFloat(d) - k || 0
                        };
                    return "number" !== l && ("function" === l && "get" === c && (j = b.indexOf("set") || "function" != typeof a["get" + b.substr(3)] ? b : "get" + b.substr(3), n.s = k = g ? a[j](g) : a[j]()), "string" == typeof k && (g || isNaN(k)) ? (n.fp = g, i = M(k, d, h || F.defaultStringFilter, n), n = {
                        t: i,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 2,
                        pg: 0,
                        n: e || b,
                        pr: 0
                    }) : m || (n.s = parseFloat(k), n.c = parseFloat(d) - n.s || 0)), n.c ? ((n._next = this._firstPT) && (n._next._prev = n), this._firstPT = n, n) : void 0
                },
                O = F._internals = {
                    isArray: n,
                    isSelector: G,
                    lazyTweens: I,
                    blobDif: M
                },
                P = F._plugins = {},
                Q = O.tweenLookup = {},
                R = 0,
                S = O.reservedProps = {
                    ease: 1,
                    delay: 1,
                    overwrite: 1,
                    onComplete: 1,
                    onCompleteParams: 1,
                    onCompleteScope: 1,
                    useFrames: 1,
                    runBackwards: 1,
                    startAt: 1,
                    onUpdate: 1,
                    onUpdateParams: 1,
                    onUpdateScope: 1,
                    onStart: 1,
                    onStartParams: 1,
                    onStartScope: 1,
                    onReverseComplete: 1,
                    onReverseCompleteParams: 1,
                    onReverseCompleteScope: 1,
                    onRepeat: 1,
                    onRepeatParams: 1,
                    onRepeatScope: 1,
                    easeParams: 1,
                    yoyo: 1,
                    immediateRender: 1,
                    repeat: 1,
                    repeatDelay: 1,
                    data: 1,
                    paused: 1,
                    reversed: 1,
                    autoCSS: 1,
                    lazy: 1,
                    onOverwrite: 1,
                    callbackScope: 1,
                    stringFilter: 1
                },
                T = {
                    none: 0,
                    all: 1,
                    auto: 2,
                    concurrent: 3,
                    allOnStart: 4,
                    preexisting: 5,
                    "true": 1,
                    "false": 0
                },
                U = C._rootFramesTimeline = new E,
                V = C._rootTimeline = new E,
                W = 30,
                X = O.lazyRender = function() {
                    var a, b = I.length;
                    for (J = {}; --b > -1;) a = I[b], a && a._lazy !== !1 && (a.render(a._lazy[0], a._lazy[1], !0), a._lazy = !1);
                    I.length = 0
                };
            V._startTime = g.time, U._startTime = g.frame, V._active = U._active = !0, setTimeout(X, 1), C._updateRoot = F.render = function() {
                var a, b, c;
                if (I.length && X(), V.render((g.time - V._startTime) * V._timeScale, !1, !1), U.render((g.frame - U._startTime) * U._timeScale, !1, !1), I.length && X(), g.frame >= W) {
                    W = g.frame + (parseInt(F.autoSleep, 10) || 120);
                    for (c in Q) {
                        for (b = Q[c].tweens, a = b.length; --a > -1;) b[a]._gc && b.splice(a, 1);
                        0 === b.length && delete Q[c]
                    }
                    if (c = V._first, (!c || c._paused) && F.autoSleep && !U._first && 1 === g._listeners.tick.length) {
                        for (; c && c._paused;) c = c._next;
                        c || g.sleep()
                    }
                }
            }, g.addEventListener("tick", C._updateRoot);
            var Y = function(a, b, c) {
                    var d, e, f = a._gsTweenID;
                    if (Q[f || (a._gsTweenID = f = "t" + R++)] || (Q[f] = {
                            target: a,
                            tweens: []
                        }), b && (d = Q[f].tweens, d[e = d.length] = b, c))
                        for (; --e > -1;) d[e] === b && d.splice(e, 1);
                    return Q[f].tweens
                },
                Z = function(a, b, c, d) {
                    var e, f, g = a.vars.onOverwrite;
                    return g && (e = g(a, b, c, d)), g = F.onOverwrite, g && (f = g(a, b, c, d)), e !== !1 && f !== !1
                },
                $ = function(a, b, c, d, e) {
                    var f, g, h, i;
                    if (1 === d || d >= 4) {
                        for (i = e.length, f = 0; i > f; f++)
                            if ((h = e[f]) !== b) h._gc || h._kill(null, a, b) && (g = !0);
                            else if (5 === d) break;
                        return g
                    }
                    var j, l = b._startTime + k,
                        m = [],
                        n = 0,
                        o = 0 === b._duration;
                    for (f = e.length; --f > -1;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (j = j || _(b, 0, o), 0 === _(h, j, o) && (m[n++] = h)) : h._startTime <= l && h._startTime + h.totalDuration() / h._timeScale > l && ((o || !h._initted) && l - h._startTime <= 2e-10 || (m[n++] = h)));
                    for (f = n; --f > -1;)
                        if (h = m[f], 2 === d && h._kill(c, a, b) && (g = !0), 2 !== d || !h._firstPT && h._initted) {
                            if (2 !== d && !Z(h, b)) continue;
                            h._enabled(!1, !1) && (g = !0)
                        }
                    return g
                },
                _ = function(a, b, c) {
                    for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
                        if (f += d._startTime, e *= d._timeScale, d._paused) return -100;
                        d = d._timeline
                    }
                    return f /= e, f > b ? f - b : c && f === b || !a._initted && 2 * k > f - b ? k : (f += a.totalDuration() / a._timeScale / e) > b + k ? 0 : f - b - k
                };
            f._init = function() {
                var a, b, c, d, e, f = this.vars,
                    g = this._overwrittenProps,
                    h = this._duration,
                    i = !!f.immediateRender,
                    j = f.ease;
                if (f.startAt) {
                    this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), e = {};
                    for (d in f.startAt) e[d] = f.startAt[d];
                    if (e.overwrite = !1, e.immediateRender = !0, e.lazy = i && f.lazy !== !1, e.startAt = e.delay = null, this._startAt = F.to(this.target, 0, e), i)
                        if (this._time > 0) this._startAt = null;
                        else if (0 !== h) return
                } else if (f.runBackwards && 0 !== h)
                    if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
                    else {
                        0 !== this._time && (i = !1), c = {};
                        for (d in f) S[d] && "autoCSS" !== d || (c[d] = f[d]);
                        if (c.overwrite = 0, c.data = "isFromStart", c.lazy = i && f.lazy !== !1, c.immediateRender = i, this._startAt = F.to(this.target, 0, c), i) {
                            if (0 === this._time) return
                        } else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
                    }
                if (this._ease = j = j ? j instanceof u ? j : "function" == typeof j ? new u(j, f.easeParams) : v[j] || F.defaultEase : F.defaultEase, f.easeParams instanceof Array && j.config && (this._ease = j.config.apply(j, f.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
                    for (a = this._targets.length; --a > -1;) this._initProps(this._targets[a], this._propLookup[a] = {}, this._siblings[a], g ? g[a] : null) && (b = !0);
                else b = this._initProps(this.target, this._propLookup, this._siblings, g);
                if (b && F._onPluginEvent("_onInitAllProps", this), g && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), f.runBackwards)
                    for (c = this._firstPT; c;) c.s += c.c, c.c = -c.c, c = c._next;
                this._onUpdate = f.onUpdate, this._initted = !0
            }, f._initProps = function(b, c, d, e) {
                var f, g, h, i, j, k;
                if (null == b) return !1;
                J[b._gsTweenID] && X(), this.vars.css || b.style && b !== a && b.nodeType && P.css && this.vars.autoCSS !== !1 && H(this.vars, b);
                for (f in this.vars)
                    if (k = this.vars[f], S[f]) k && (k instanceof Array || k.push && n(k)) && -1 !== k.join("").indexOf("{self}") && (this.vars[f] = k = this._swapSelfInParams(k, this));
                    else if (P[f] && (i = new P[f])._onInitTween(b, this.vars[f], this)) {
                    for (this._firstPT = j = {
                            _next: this._firstPT,
                            t: i,
                            p: "setRatio",
                            s: 0,
                            c: 1,
                            f: 1,
                            n: f,
                            pg: 1,
                            pr: i._priority
                        }, g = i._overwriteProps.length; --g > -1;) c[i._overwriteProps[g]] = this._firstPT;
                    (i._priority || i._onInitAllProps) && (h = !0), (i._onDisable || i._onEnable) && (this._notifyPluginsOfEnabled = !0), j._next && (j._next._prev = j)
                } else c[f] = N.call(this, b, f, "get", k, f, 0, null, this.vars.stringFilter);
                return e && this._kill(e, b) ? this._initProps(b, c, d, e) : this._overwrite > 1 && this._firstPT && d.length > 1 && $(b, this, c, this._overwrite, d) ? (this._kill(c, b), this._initProps(b, c, d, e)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (J[b._gsTweenID] = !0), h)
            }, f.render = function(a, b, c) {
                var d, e, f, g, h = this._time,
                    i = this._duration,
                    j = this._rawPrevTime;
                if (a >= i - 1e-7) this._totalTime = this._time = i, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (d = !0, e = "onComplete", c = c || this._timeline.autoRemoveChildren), 0 === i && (this._initted || !this.vars.lazy || c) && (this._startTime === this._timeline._duration && (a = 0), (0 > j || 0 >= a && a >= -1e-7 || j === k && "isPause" !== this.data) && j !== a && (c = !0, j > k && (e = "onReverseComplete")), this._rawPrevTime = g = !b || a || j === a ? a : k);
                else if (1e-7 > a) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== h || 0 === i && j > 0) && (e = "onReverseComplete", d = this._reversed), 0 > a && (this._active = !1, 0 === i && (this._initted || !this.vars.lazy || c) && (j >= 0 && (j !== k || "isPause" !== this.data) && (c = !0), this._rawPrevTime = g = !b || a || j === a ? a : k)), this._initted || (c = !0);
                else if (this._totalTime = this._time = a, this._easeType) {
                    var l = a / i,
                        m = this._easeType,
                        n = this._easePower;
                    (1 === m || 3 === m && l >= .5) && (l = 1 - l), 3 === m && (l *= 2), 1 === n ? l *= l : 2 === n ? l *= l * l : 3 === n ? l *= l * l * l : 4 === n && (l *= l * l * l * l), 1 === m ? this.ratio = 1 - l : 2 === m ? this.ratio = l : .5 > a / i ? this.ratio = l / 2 : this.ratio = 1 - l / 2
                } else this.ratio = this._ease.getRatio(a / i);
                if (this._time !== h || c) {
                    if (!this._initted) {
                        if (this._init(), !this._initted || this._gc) return;
                        if (!c && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = h, this._rawPrevTime = j, I.push(this), void(this._lazy = [a, b]);
                        this._time && !d ? this.ratio = this._ease.getRatio(this._time / i) : d && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                    }
                    for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== h && a >= 0 && (this._active = !0), 0 === h && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : e || (e = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === i) && (b || this._callback("onStart"))), f = this._firstPT; f;) f.f ? f.t[f.p](f.c * this.ratio + f.s) : f.t[f.p] = f.c * this.ratio + f.s, f = f._next;
                    this._onUpdate && (0 > a && this._startAt && a !== -1e-4 && this._startAt.render(a, b, c), b || (this._time !== h || d) && this._callback("onUpdate")), e && (!this._gc || c) && (0 > a && this._startAt && !this._onUpdate && a !== -1e-4 && this._startAt.render(a, b, c), d && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[e] && this._callback(e), 0 === i && this._rawPrevTime === k && g !== k && (this._rawPrevTime = 0))
                }
            }, f._kill = function(a, b, c) {
                if ("all" === a && (a = null), null == a && (null == b || b === this.target)) return this._lazy = !1, this._enabled(!1, !1);
                b = "string" != typeof b ? b || this._targets || this.target : F.selector(b) || b;
                var d, e, f, g, h, i, j, k, l, m = c && this._time && c._startTime === this._startTime && this._timeline === c._timeline;
                if ((n(b) || G(b)) && "number" != typeof b[0])
                    for (d = b.length; --d > -1;) this._kill(a, b[d], c) && (i = !0);
                else {
                    if (this._targets) {
                        for (d = this._targets.length; --d > -1;)
                            if (b === this._targets[d]) {
                                h = this._propLookup[d] || {}, this._overwrittenProps = this._overwrittenProps || [], e = this._overwrittenProps[d] = a ? this._overwrittenProps[d] || {} : "all";
                                break
                            }
                    } else {
                        if (b !== this.target) return !1;
                        h = this._propLookup, e = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
                    }
                    if (h) {
                        if (j = a || h, k = a !== e && "all" !== e && a !== h && ("object" != typeof a || !a._tempKill), c && (F.onOverwrite || this.vars.onOverwrite)) {
                            for (f in j) h[f] && (l || (l = []), l.push(f));
                            if ((l || !a) && !Z(this, c, b, l)) return !1
                        }
                        for (f in j)(g = h[f]) && (m && (g.f ? g.t[g.p](g.s) : g.t[g.p] = g.s, i = !0), g.pg && g.t._kill(j) && (i = !0), g.pg && 0 !== g.t._overwriteProps.length || (g._prev ? g._prev._next = g._next : g === this._firstPT && (this._firstPT = g._next), g._next && (g._next._prev = g._prev), g._next = g._prev = null), delete h[f]), k && (e[f] = 1);
                        !this._firstPT && this._initted && this._enabled(!1, !1)
                    }
                }
                return i
            }, f.invalidate = function() {
                return this._notifyPluginsOfEnabled && F._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], C.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -k, this.render(-this._delay)), this
            }, f._enabled = function(a, b) {
                if (h || g.wake(), a && this._gc) {
                    var c, d = this._targets;
                    if (d)
                        for (c = d.length; --c > -1;) this._siblings[c] = Y(d[c], this, !0);
                    else this._siblings = Y(this.target, this, !0)
                }
                return C.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? F._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
            }, F.to = function(a, b, c) {
                return new F(a, b, c)
            }, F.from = function(a, b, c) {
                return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new F(a, b, c)
            }, F.fromTo = function(a, b, c, d) {
                return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new F(a, b, d)
            }, F.delayedCall = function(a, b, c, d, e) {
                return new F(b, 0, {
                    delay: a,
                    onComplete: b,
                    onCompleteParams: c,
                    callbackScope: d,
                    onReverseComplete: b,
                    onReverseCompleteParams: c,
                    immediateRender: !1,
                    lazy: !1,
                    useFrames: e,
                    overwrite: 0
                })
            }, F.set = function(a, b) {
                return new F(a, 0, b)
            }, F.getTweensOf = function(a, b) {
                if (null == a) return [];
                a = "string" != typeof a ? a : F.selector(a) || a;
                var c, d, e, f;
                if ((n(a) || G(a)) && "number" != typeof a[0]) {
                    for (c = a.length, d = []; --c > -1;) d = d.concat(F.getTweensOf(a[c], b));
                    for (c = d.length; --c > -1;)
                        for (f = d[c], e = c; --e > -1;) f === d[e] && d.splice(c, 1)
                } else
                    for (d = Y(a).concat(), c = d.length; --c > -1;)(d[c]._gc || b && !d[c].isActive()) && d.splice(c, 1);
                return d
            }, F.killTweensOf = F.killDelayedCallsTo = function(a, b, c) {
                "object" == typeof b && (c = b, b = !1);
                for (var d = F.getTweensOf(a, b), e = d.length; --e > -1;) d[e]._kill(c, a)
            };
            var aa = r("plugins.TweenPlugin", function(a, b) {
                this._overwriteProps = (a || "").split(","), this._propName = this._overwriteProps[0], this._priority = b || 0, this._super = aa.prototype
            }, !0);
            if (f = aa.prototype, aa.version = "1.18.0", aa.API = 2, f._firstPT = null, f._addTween = N, f.setRatio = L, f._kill = function(a) {
                    var b, c = this._overwriteProps,
                        d = this._firstPT;
                    if (null != a[this._propName]) this._overwriteProps = [];
                    else
                        for (b = c.length; --b > -1;) null != a[c[b]] && c.splice(b, 1);
                    for (; d;) null != a[d.n] && (d._next && (d._next._prev = d._prev), d._prev ? (d._prev._next = d._next, d._prev = null) : this._firstPT === d && (this._firstPT = d._next)), d = d._next;
                    return !1
                }, f._roundProps = function(a, b) {
                    for (var c = this._firstPT; c;)(a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")]) && (c.r = b), c = c._next
                }, F._onPluginEvent = function(a, b) {
                    var c, d, e, f, g, h = b._firstPT;
                    if ("_onInitAllProps" === a) {
                        for (; h;) {
                            for (g = h._next, d = e; d && d.pr > h.pr;) d = d._next;
                            (h._prev = d ? d._prev : f) ? h._prev._next = h: e = h, (h._next = d) ? d._prev = h : f = h, h = g
                        }
                        h = b._firstPT = e
                    }
                    for (; h;) h.pg && "function" == typeof h.t[a] && h.t[a]() && (c = !0), h = h._next;
                    return c
                }, aa.activate = function(a) {
                    for (var b = a.length; --b > -1;) a[b].API === aa.API && (P[(new a[b])._propName] = a[b]);
                    return !0
                }, q.plugin = function(a) {
                    if (!(a && a.propName && a.init && a.API)) throw "illegal plugin definition.";
                    var b, c = a.propName,
                        d = a.priority || 0,
                        e = a.overwriteProps,
                        f = {
                            init: "_onInitTween",
                            set: "setRatio",
                            kill: "_kill",
                            round: "_roundProps",
                            initAll: "_onInitAllProps"
                        },
                        g = r("plugins." + c.charAt(0).toUpperCase() + c.substr(1) + "Plugin", function() {
                            aa.call(this, c, d), this._overwriteProps = e || []
                        }, a.global === !0),
                        h = g.prototype = new aa(c);
                    h.constructor = g, g.API = a.API;
                    for (b in f) "function" == typeof a[b] && (h[f[b]] = a[b]);
                    return g.version = a.version, aa.activate([g]), g
                }, d = a._gsQueue) {
                for (e = 0; e < d.length; e++) d[e]();
                for (f in o) o[f].func || a.console.log("GSAP encountered missing dependency: com.greensock." + f)
            }
            h = !1
        }
    }("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");


/*!
 * VERSION: 1.18.2
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(a, b, c) {
            var d = function(a) {
                    b.call(this, a), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
                    var c, d, e = this.vars;
                    for (d in e) c = e[d], i(c) && -1 !== c.join("").indexOf("{self}") && (e[d] = this._swapSelfInParams(c));
                    i(e.tweens) && this.add(e.tweens, 0, e.align, e.stagger)
                },
                e = 1e-10,
                f = c._internals,
                g = d._internals = {},
                h = f.isSelector,
                i = f.isArray,
                j = f.lazyTweens,
                k = f.lazyRender,
                l = _gsScope._gsDefine.globals,
                m = function(a) {
                    var b, c = {};
                    for (b in a) c[b] = a[b];
                    return c
                },
                n = function(a, b, c) {
                    var d, e, f = a.cycle;
                    for (d in f) e = f[d], a[d] = "function" == typeof e ? e.call(b[c], c) : e[c % e.length];
                    delete a.cycle
                },
                o = g.pauseCallback = function() {},
                p = function(a) {
                    var b, c = [],
                        d = a.length;
                    for (b = 0; b !== d; c.push(a[b++]));
                    return c
                },
                q = d.prototype = new b;
            return d.version = "1.18.2", q.constructor = d, q.kill()._gc = q._forcingPlayhead = q._hasPause = !1, q.to = function(a, b, d, e) {
                var f = d.repeat && l.TweenMax || c;
                return b ? this.add(new f(a, b, d), e) : this.set(a, d, e)
            }, q.from = function(a, b, d, e) {
                return this.add((d.repeat && l.TweenMax || c).from(a, b, d), e)
            }, q.fromTo = function(a, b, d, e, f) {
                var g = e.repeat && l.TweenMax || c;
                return b ? this.add(g.fromTo(a, b, d, e), f) : this.set(a, e, f)
            }, q.staggerTo = function(a, b, e, f, g, i, j, k) {
                var l, o, q = new d({
                        onComplete: i,
                        onCompleteParams: j,
                        callbackScope: k,
                        smoothChildTiming: this.smoothChildTiming
                    }),
                    r = e.cycle;
                for ("string" == typeof a && (a = c.selector(a) || a), a = a || [], h(a) && (a = p(a)), f = f || 0, 0 > f && (a = p(a), a.reverse(), f *= -1), o = 0; o < a.length; o++) l = m(e), l.startAt && (l.startAt = m(l.startAt), l.startAt.cycle && n(l.startAt, a, o)), r && n(l, a, o), q.to(a[o], b, l, o * f);
                return this.add(q, g)
            }, q.staggerFrom = function(a, b, c, d, e, f, g, h) {
                return c.immediateRender = 0 != c.immediateRender, c.runBackwards = !0, this.staggerTo(a, b, c, d, e, f, g, h)
            }, q.staggerFromTo = function(a, b, c, d, e, f, g, h, i) {
                return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, this.staggerTo(a, b, d, e, f, g, h, i)
            }, q.call = function(a, b, d, e) {
                return this.add(c.delayedCall(0, a, b, d), e)
            }, q.set = function(a, b, d) {
                return d = this._parseTimeOrLabel(d, 0, !0), null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused), this.add(new c(a, 0, b), d)
            }, d.exportRoot = function(a, b) {
                a = a || {}, null == a.smoothChildTiming && (a.smoothChildTiming = !0);
                var e, f, g = new d(a),
                    h = g._timeline;
                for (null == b && (b = !0), h._remove(g, !0), g._startTime = 0, g._rawPrevTime = g._time = g._totalTime = h._time, e = h._first; e;) f = e._next, b && e instanceof c && e.target === e.vars.onComplete || g.add(e, e._startTime - e._delay), e = f;
                return h.add(g, 0), g
            }, q.add = function(e, f, g, h) {
                var j, k, l, m, n, o;
                if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)), !(e instanceof a)) {
                    if (e instanceof Array || e && e.push && i(e)) {
                        for (g = g || "normal", h = h || 0, j = f, k = e.length, l = 0; k > l; l++) i(m = e[l]) && (m = new d({
                            tweens: m
                        })), this.add(m, j), "string" != typeof m && "function" != typeof m && ("sequence" === g ? j = m._startTime + m.totalDuration() / m._timeScale : "start" === g && (m._startTime -= m.delay())), j += h;
                        return this._uncache(!0)
                    }
                    if ("string" == typeof e) return this.addLabel(e, f);
                    if ("function" != typeof e) throw "Cannot add " + e + " into the timeline; it is not a tween, timeline, function, or string.";
                    e = c.delayedCall(0, e)
                }
                if (b.prototype.add.call(this, e, f), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                    for (n = this, o = n.rawTime() > e._startTime; n._timeline;) o && n._timeline.smoothChildTiming ? n.totalTime(n._totalTime, !0) : n._gc && n._enabled(!0, !1), n = n._timeline;
                return this
            }, q.remove = function(b) {
                if (b instanceof a) {
                    this._remove(b, !1);
                    var c = b._timeline = b.vars.useFrames ? a._rootFramesTimeline : a._rootTimeline;
                    return b._startTime = (b._paused ? b._pauseTime : c._time) - (b._reversed ? b.totalDuration() - b._totalTime : b._totalTime) / b._timeScale, this
                }
                if (b instanceof Array || b && b.push && i(b)) {
                    for (var d = b.length; --d > -1;) this.remove(b[d]);
                    return this
                }
                return "string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
            }, q._remove = function(a, c) {
                b.prototype._remove.call(this, a, c);
                var d = this._last;
                return d ? this._time > d._startTime + d._totalDuration / d._timeScale && (this._time = this.duration(), this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
            }, q.append = function(a, b) {
                return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
            }, q.insert = q.insertMultiple = function(a, b, c, d) {
                return this.add(a, b || 0, c, d)
            }, q.appendMultiple = function(a, b, c, d) {
                return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
            }, q.addLabel = function(a, b) {
                return this._labels[a] = this._parseTimeOrLabel(b), this
            }, q.addPause = function(a, b, d, e) {
                var f = c.delayedCall(0, o, d, e || this);
                return f.vars.onComplete = f.vars.onReverseComplete = b, f.data = "isPause", this._hasPause = !0, this.add(f, a)
            }, q.removeLabel = function(a) {
                return delete this._labels[a], this
            }, q.getLabelTime = function(a) {
                return null != this._labels[a] ? this._labels[a] : -1
            }, q._parseTimeOrLabel = function(b, c, d, e) {
                var f;
                if (e instanceof a && e.timeline === this) this.remove(e);
                else if (e && (e instanceof Array || e.push && i(e)))
                    for (f = e.length; --f > -1;) e[f] instanceof a && e[f].timeline === this && this.remove(e[f]);
                if ("string" == typeof c) return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
                if (c = c || 0, "string" != typeof b || !isNaN(b) && null == this._labels[b]) null == b && (b = this.duration());
                else {
                    if (f = b.indexOf("="), -1 === f) return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c : c : this._labels[b] + c;
                    c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)), b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
                }
                return Number(b) + c
            }, q.seek = function(a, b) {
                return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), b !== !1)
            }, q.stop = function() {
                return this.paused(!0)
            }, q.gotoAndPlay = function(a, b) {
                return this.play(a, b)
            }, q.gotoAndStop = function(a, b) {
                return this.pause(a, b)
            }, q.render = function(a, b, c) {
                this._gc && this._enabled(!0, !1);
                var d, f, g, h, i, l, m, n = this._dirty ? this.totalDuration() : this._totalDuration,
                    o = this._time,
                    p = this._startTime,
                    q = this._timeScale,
                    r = this._paused;
                if (a >= n - 1e-7) this._totalTime = this._time = n, this._reversed || this._hasPausedChild() || (f = !0, h = "onComplete", i = !!this._timeline.autoRemoveChildren, 0 === this._duration && (0 >= a && a >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === e) && this._rawPrevTime !== a && this._first && (i = !0, this._rawPrevTime > e && (h = "onReverseComplete"))), this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e, a = n + 1e-4;
                else if (1e-7 > a)
                    if (this._totalTime = this._time = 0, (0 !== o || 0 === this._duration && this._rawPrevTime !== e && (this._rawPrevTime > 0 || 0 > a && this._rawPrevTime >= 0)) && (h = "onReverseComplete", f = this._reversed), 0 > a) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (i = f = !0, h = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (i = !0), this._rawPrevTime = a;
                    else {
                        if (this._rawPrevTime = this._duration || !b || a || this._rawPrevTime === a ? a : e, 0 === a && f)
                            for (d = this._first; d && 0 === d._startTime;) d._duration || (f = !1), d = d._next;
                        a = 0, this._initted || (i = !0)
                    }
                else {
                    if (this._hasPause && !this._forcingPlayhead && !b) {
                        if (a >= o)
                            for (d = this._first; d && d._startTime <= a && !l;) d._duration || "isPause" !== d.data || d.ratio || 0 === d._startTime && 0 === this._rawPrevTime || (l = d), d = d._next;
                        else
                            for (d = this._last; d && d._startTime >= a && !l;) d._duration || "isPause" === d.data && d._rawPrevTime > 0 && (l = d), d = d._prev;
                        l && (this._time = a = l._startTime, this._totalTime = a + this._cycle * (this._totalDuration + this._repeatDelay))
                    }
                    this._totalTime = this._time = this._rawPrevTime = a
                }
                if (this._time !== o && this._first || c || i || l) {
                    if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== o && a > 0 && (this._active = !0), 0 === o && this.vars.onStart && 0 !== this._time && (b || this._callback("onStart")), m = this._time, m >= o)
                        for (d = this._first; d && (g = d._next, m === this._time && (!this._paused || r));)(d._active || d._startTime <= m && !d._paused && !d._gc) && (l === d && this.pause(), d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)), d = g;
                    else
                        for (d = this._last; d && (g = d._prev, m === this._time && (!this._paused || r));) {
                            if (d._active || d._startTime <= o && !d._paused && !d._gc) {
                                if (l === d) {
                                    for (l = d._prev; l && l.endTime() > this._time;) l.render(l._reversed ? l.totalDuration() - (a - l._startTime) * l._timeScale : (a - l._startTime) * l._timeScale, b, c), l = l._prev;
                                    l = null, this.pause()
                                }
                                d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)
                            }
                            d = g
                        }
                    this._onUpdate && (b || (j.length && k(), this._callback("onUpdate"))), h && (this._gc || (p === this._startTime || q !== this._timeScale) && (0 === this._time || n >= this.totalDuration()) && (f && (j.length && k(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[h] && this._callback(h)))
                }
            }, q._hasPausedChild = function() {
                for (var a = this._first; a;) {
                    if (a._paused || a instanceof d && a._hasPausedChild()) return !0;
                    a = a._next
                }
                return !1
            }, q.getChildren = function(a, b, d, e) {
                e = e || -9999999999;
                for (var f = [], g = this._first, h = 0; g;) g._startTime < e || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g), a !== !1 && (f = f.concat(g.getChildren(!0, b, d)), h = f.length))), g = g._next;
                return f
            }, q.getTweensOf = function(a, b) {
                var d, e, f = this._gc,
                    g = [],
                    h = 0;
                for (f && this._enabled(!0, !0), d = c.getTweensOf(a), e = d.length; --e > -1;)(d[e].timeline === this || b && this._contains(d[e])) && (g[h++] = d[e]);
                return f && this._enabled(!1, !0), g
            }, q.recent = function() {
                return this._recent
            }, q._contains = function(a) {
                for (var b = a.timeline; b;) {
                    if (b === this) return !0;
                    b = b.timeline
                }
                return !1
            }, q.shiftChildren = function(a, b, c) {
                c = c || 0;
                for (var d, e = this._first, f = this._labels; e;) e._startTime >= c && (e._startTime += a), e = e._next;
                if (b)
                    for (d in f) f[d] >= c && (f[d] += a);
                return this._uncache(!0)
            }, q._kill = function(a, b) {
                if (!a && !b) return this._enabled(!1, !1);
                for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1;) c[d]._kill(a, b) && (e = !0);
                return e
            }, q.clear = function(a) {
                var b = this.getChildren(!1, !0, !0),
                    c = b.length;
                for (this._time = this._totalTime = 0; --c > -1;) b[c]._enabled(!1, !1);
                return a !== !1 && (this._labels = {}), this._uncache(!0)
            }, q.invalidate = function() {
                for (var b = this._first; b;) b.invalidate(), b = b._next;
                return a.prototype.invalidate.call(this)
            }, q._enabled = function(a, c) {
                if (a === this._gc)
                    for (var d = this._first; d;) d._enabled(a, !0), d = d._next;
                return b.prototype._enabled.call(this, a, c)
            }, q.totalTime = function(b, c, d) {
                this._forcingPlayhead = !0;
                var e = a.prototype.totalTime.apply(this, arguments);
                return this._forcingPlayhead = !1, e
            }, q.duration = function(a) {
                return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
            }, q.totalDuration = function(a) {
                if (!arguments.length) {
                    if (this._dirty) {
                        for (var b, c, d = 0, e = this._last, f = 999999999999; e;) b = e._prev, e._dirty && e.totalDuration(), e._startTime > f && this._sortChildren && !e._paused ? this.add(e, e._startTime - e._delay) : f = e._startTime, e._startTime < 0 && !e._paused && (d -= e._startTime, this._timeline.smoothChildTiming && (this._startTime += e._startTime / this._timeScale), this.shiftChildren(-e._startTime, !1, -9999999999), f = 0), c = e._startTime + e._totalDuration / e._timeScale, c > d && (d = c), e = b;
                        this._duration = this._totalDuration = d, this._dirty = !1
                    }
                    return this._totalDuration
                }
                return a && this.totalDuration() ? this.timeScale(this._totalDuration / a) : this
            }, q.paused = function(b) {
                if (!b)
                    for (var c = this._first, d = this._time; c;) c._startTime === d && "isPause" === c.data && (c._rawPrevTime = 0), c = c._next;
                return a.prototype.paused.apply(this, arguments)
            }, q.usesFrames = function() {
                for (var b = this._timeline; b._timeline;) b = b._timeline;
                return b === a._rootFramesTimeline
            }, q.rawTime = function() {
                return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
            }, d
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(a) {
        "use strict";
        var b = function() {
            return (_gsScope.GreenSockGlobals || _gsScope)[a]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("./TweenLite.js"), module.exports = b())
    }("TimelineLite");


/*!
 * VERSION: 1.15.3
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(a) {
            var b, c, d, e = _gsScope.GreenSockGlobals || _gsScope,
                f = e.com.greensock,
                g = 2 * Math.PI,
                h = Math.PI / 2,
                i = f._class,
                j = function(b, c) {
                    var d = i("easing." + b, function() {}, !0),
                        e = d.prototype = new a;
                    return e.constructor = d, e.getRatio = c, d
                },
                k = a.register || function() {},
                l = function(a, b, c, d, e) {
                    var f = i("easing." + a, {
                        easeOut: new b,
                        easeIn: new c,
                        easeInOut: new d
                    }, !0);
                    return k(f, a), f
                },
                m = function(a, b, c) {
                    this.t = a, this.v = b, c && (this.next = c, c.prev = this, this.c = c.v - b, this.gap = c.t - a)
                },
                n = function(b, c) {
                    var d = i("easing." + b, function(a) {
                            this._p1 = a || 0 === a ? a : 1.70158, this._p2 = 1.525 * this._p1
                        }, !0),
                        e = d.prototype = new a;
                    return e.constructor = d, e.getRatio = c, e.config = function(a) {
                        return new d(a)
                    }, d
                },
                o = l("Back", n("BackOut", function(a) {
                    return (a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
                }), n("BackIn", function(a) {
                    return a * a * ((this._p1 + 1) * a - this._p1)
                }), n("BackInOut", function(a) {
                    return (a *= 2) < 1 ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
                })),
                p = i("easing.SlowMo", function(a, b, c) {
                    b = b || 0 === b ? b : .7, null == a ? a = .7 : a > 1 && (a = 1), this._p = 1 !== a ? b : 0, this._p1 = (1 - a) / 2, this._p2 = a, this._p3 = this._p1 + this._p2, this._calcEnd = c === !0
                }, !0),
                q = p.prototype = new a;
            return q.constructor = p, q.getRatio = function(a) {
                var b = a + (.5 - a) * this._p;
                return a < this._p1 ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
            }, p.ease = new p(.7, .7), q.config = p.config = function(a, b, c) {
                return new p(a, b, c)
            }, b = i("easing.SteppedEase", function(a) {
                a = a || 1, this._p1 = 1 / a, this._p2 = a + 1
            }, !0), q = b.prototype = new a, q.constructor = b, q.getRatio = function(a) {
                return 0 > a ? a = 0 : a >= 1 && (a = .999999999), (this._p2 * a >> 0) * this._p1
            }, q.config = b.config = function(a) {
                return new b(a)
            }, c = i("easing.RoughEase", function(b) {
                b = b || {};
                for (var c, d, e, f, g, h, i = b.taper || "none", j = [], k = 0, l = 0 | (b.points || 20), n = l, o = b.randomize !== !1, p = b.clamp === !0, q = b.template instanceof a ? b.template : null, r = "number" == typeof b.strength ? .4 * b.strength : .4; --n > -1;) c = o ? Math.random() : 1 / l * n, d = q ? q.getRatio(c) : c, "none" === i ? e = r : "out" === i ? (f = 1 - c, e = f * f * r) : "in" === i ? e = c * c * r : .5 > c ? (f = 2 * c, e = f * f * .5 * r) : (f = 2 * (1 - c), e = f * f * .5 * r), o ? d += Math.random() * e - .5 * e : n % 2 ? d += .5 * e : d -= .5 * e, p && (d > 1 ? d = 1 : 0 > d && (d = 0)), j[k++] = {
                    x: c,
                    y: d
                };
                for (j.sort(function(a, b) {
                        return a.x - b.x
                    }), h = new m(1, 1, null), n = l; --n > -1;) g = j[n], h = new m(g.x, g.y, h);
                this._prev = new m(0, 0, 0 !== h.t ? h : h.next)
            }, !0), q = c.prototype = new a, q.constructor = c, q.getRatio = function(a) {
                var b = this._prev;
                if (a > b.t) {
                    for (; b.next && a >= b.t;) b = b.next;
                    b = b.prev
                } else
                    for (; b.prev && a <= b.t;) b = b.prev;
                return this._prev = b, b.v + (a - b.t) / b.gap * b.c
            }, q.config = function(a) {
                return new c(a)
            }, c.ease = new c, l("Bounce", j("BounceOut", function(a) {
                return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
            }), j("BounceIn", function(a) {
                return (a = 1 - a) < 1 / 2.75 ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
            }), j("BounceInOut", function(a) {
                var b = .5 > a;
                return a = b ? 1 - 2 * a : 2 * a - 1, a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375, b ? .5 * (1 - a) : .5 * a + .5
            })), l("Circ", j("CircOut", function(a) {
                return Math.sqrt(1 - (a -= 1) * a)
            }), j("CircIn", function(a) {
                return -(Math.sqrt(1 - a * a) - 1)
            }), j("CircInOut", function(a) {
                return (a *= 2) < 1 ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
            })), d = function(b, c, d) {
                var e = i("easing." + b, function(a, b) {
                        this._p1 = a >= 1 ? a : 1, this._p2 = (b || d) / (1 > a ? a : 1), this._p3 = this._p2 / g * (Math.asin(1 / this._p1) || 0), this._p2 = g / this._p2
                    }, !0),
                    f = e.prototype = new a;
                return f.constructor = e, f.getRatio = c, f.config = function(a, b) {
                    return new e(a, b)
                }, e
            }, l("Elastic", d("ElasticOut", function(a) {
                return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * this._p2) + 1
            }, .3), d("ElasticIn", function(a) {
                return -(this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2))
            }, .3), d("ElasticInOut", function(a) {
                return (a *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * this._p2) * .5 + 1
            }, .45)), l("Expo", j("ExpoOut", function(a) {
                return 1 - Math.pow(2, -10 * a)
            }), j("ExpoIn", function(a) {
                return Math.pow(2, 10 * (a - 1)) - .001
            }), j("ExpoInOut", function(a) {
                return (a *= 2) < 1 ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
            })), l("Sine", j("SineOut", function(a) {
                return Math.sin(a * h)
            }), j("SineIn", function(a) {
                return -Math.cos(a * h) + 1
            }), j("SineInOut", function(a) {
                return -.5 * (Math.cos(Math.PI * a) - 1)
            })), i("easing.EaseLookup", {
                find: function(b) {
                    return a.map[b]
                }
            }, !0), k(e.SlowMo, "SlowMo", "ease,"), k(c, "RoughEase", "ease,"), k(b, "SteppedEase", "ease,"), o
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function() {
        "use strict";
        var a = function() {
            return _gsScope.GreenSockGlobals || _gsScope
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], a) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = a())
    }();


/*!
 * VERSION: 1.18.2
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
        "use strict";
        _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(a, b) {
            var c, d, e, f, g = function() {
                    a.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = g.prototype.setRatio
                },
                h = _gsScope._gsDefine.globals,
                i = {},
                j = g.prototype = new a("css");
            j.constructor = g, g.version = "1.18.2", g.API = 2, g.defaultTransformPerspective = 0, g.defaultSkewType = "compensated", g.defaultSmoothOrigin = !0, j = "px", g.suffixMap = {
                top: j,
                right: j,
                bottom: j,
                left: j,
                width: j,
                height: j,
                fontSize: j,
                padding: j,
                margin: j,
                perspective: j,
                lineHeight: ""
            };
            var k, l, m, n, o, p, q = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
                r = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
                s = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
                t = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
                u = /(?:\d|\-|\+|=|#|\.)*/g,
                v = /opacity *= *([^)]*)/i,
                w = /opacity:([^;]*)/i,
                x = /alpha\(opacity *=.+?\)/i,
                y = /^(rgb|hsl)/,
                z = /([A-Z])/g,
                A = /-([a-z])/gi,
                B = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
                C = function(a, b) {
                    return b.toUpperCase()
                },
                D = /(?:Left|Right|Width)/i,
                E = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
                F = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
                G = /,(?=[^\)]*(?:\(|$))/gi,
                H = Math.PI / 180,
                I = 180 / Math.PI,
                J = {},
                K = document,
                L = function(a) {
                    return K.createElementNS ? K.createElementNS("http://www.w3.org/1999/xhtml", a) : K.createElement(a)
                },
                M = L("div"),
                N = L("img"),
                O = g._internals = {
                    _specialProps: i
                },
                P = navigator.userAgent,
                Q = function() {
                    var a = P.indexOf("Android"),
                        b = L("a");
                    return m = -1 !== P.indexOf("Safari") && -1 === P.indexOf("Chrome") && (-1 === a || Number(P.substr(a + 8, 1)) > 3), o = m && Number(P.substr(P.indexOf("Version/") + 8, 1)) < 6, n = -1 !== P.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(P) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(P)) && (p = parseFloat(RegExp.$1)), b ? (b.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(b.style.opacity)) : !1
                }(),
                R = function(a) {
                    return v.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
                },
                S = function(a) {
                    window.console && console.log(a)
                },
                T = "",
                U = "",
                V = function(a, b) {
                    b = b || M;
                    var c, d, e = b.style;
                    if (void 0 !== e[a]) return a;
                    for (a = a.charAt(0).toUpperCase() + a.substr(1), c = ["O", "Moz", "ms", "Ms", "Webkit"], d = 5; --d > -1 && void 0 === e[c[d] + a];);
                    return d >= 0 ? (U = 3 === d ? "ms" : c[d], T = "-" + U.toLowerCase() + "-", U + a) : null
                },
                W = K.defaultView ? K.defaultView.getComputedStyle : function() {},
                X = g.getStyle = function(a, b, c, d, e) {
                    var f;
                    return Q || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || W(a)) ? f = c[b] || c.getPropertyValue(b) || c.getPropertyValue(b.replace(z, "-$1").toLowerCase()) : a.currentStyle && (f = a.currentStyle[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : R(a)
                },
                Y = O.convertToPixels = function(a, c, d, e, f) {
                    if ("px" === e || !e) return d;
                    if ("auto" === e || !d) return 0;
                    var h, i, j, k = D.test(c),
                        l = a,
                        m = M.style,
                        n = 0 > d;
                    if (n && (d = -d), "%" === e && -1 !== c.indexOf("border")) h = d / 100 * (k ? a.clientWidth : a.clientHeight);
                    else {
                        if (m.cssText = "border:0 solid red;position:" + X(a, "position") + ";line-height:0;", "%" !== e && l.appendChild && "v" !== e.charAt(0) && "rem" !== e) m[k ? "borderLeftWidth" : "borderTopWidth"] = d + e;
                        else {
                            if (l = a.parentNode || K.body, i = l._gsCache, j = b.ticker.frame, i && k && i.time === j) return i.width * d / 100;
                            m[k ? "width" : "height"] = d + e
                        }
                        l.appendChild(M), h = parseFloat(M[k ? "offsetWidth" : "offsetHeight"]), l.removeChild(M), k && "%" === e && g.cacheWidths !== !1 && (i = l._gsCache = l._gsCache || {}, i.time = j, i.width = h / d * 100), 0 !== h || f || (h = Y(a, c, d, e, !0))
                    }
                    return n ? -h : h
                },
                Z = O.calculateOffset = function(a, b, c) {
                    if ("absolute" !== X(a, "position", c)) return 0;
                    var d = "left" === b ? "Left" : "Top",
                        e = X(a, "margin" + d, c);
                    return a["offset" + d] - (Y(a, b, parseFloat(e), e.replace(u, "")) || 0)
                },
                $ = function(a, b) {
                    var c, d, e, f = {};
                    if (b = b || W(a, null))
                        if (c = b.length)
                            for (; --c > -1;) e = b[c], (-1 === e.indexOf("-transform") || za === e) && (f[e.replace(A, C)] = b.getPropertyValue(e));
                        else
                            for (c in b)(-1 === c.indexOf("Transform") || ya === c) && (f[c] = b[c]);
                    else if (b = a.currentStyle || a.style)
                        for (c in b) "string" == typeof c && void 0 === f[c] && (f[c.replace(A, C)] = b[c]);
                    return Q || (f.opacity = R(a)), d = La(a, b, !1), f.rotation = d.rotation, f.skewX = d.skewX, f.scaleX = d.scaleX, f.scaleY = d.scaleY, f.x = d.x, f.y = d.y, Ba && (f.z = d.z, f.rotationX = d.rotationX, f.rotationY = d.rotationY, f.scaleZ = d.scaleZ), f.filters && delete f.filters, f
                },
                _ = function(a, b, c, d, e) {
                    var f, g, h, i = {},
                        j = a.style;
                    for (g in c) "cssText" !== g && "length" !== g && isNaN(g) && (b[g] !== (f = c[g]) || e && e[g]) && -1 === g.indexOf("Origin") && ("number" == typeof f || "string" == typeof f) && (i[g] = "auto" !== f || "left" !== g && "top" !== g ? "" !== f && "auto" !== f && "none" !== f || "string" != typeof b[g] || "" === b[g].replace(t, "") ? f : 0 : Z(a, g), void 0 !== j[g] && (h = new oa(j, g, j[g], h)));
                    if (d)
                        for (g in d) "className" !== g && (i[g] = d[g]);
                    return {
                        difs: i,
                        firstMPT: h
                    }
                },
                aa = {
                    width: ["Left", "Right"],
                    height: ["Top", "Bottom"]
                },
                ba = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
                ca = function(a, b, c) {
                    var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight),
                        e = aa[b],
                        f = e.length;
                    for (c = c || W(a, null); --f > -1;) d -= parseFloat(X(a, "padding" + e[f], c, !0)) || 0, d -= parseFloat(X(a, "border" + e[f] + "Width", c, !0)) || 0;
                    return d
                },
                da = function(a, b) {
                    if ("contain" === a || "auto" === a || "auto auto" === a) return a + " ";
                    (null == a || "" === a) && (a = "0 0");
                    var c = a.split(" "),
                        d = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : c[0],
                        e = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : c[1];
                    return null == e ? e = "center" === d ? "50%" : "0" : "center" === e && (e = "50%"), ("center" === d || isNaN(parseFloat(d)) && -1 === (d + "").indexOf("=")) && (d = "50%"), a = d + " " + e + (c.length > 2 ? " " + c[2] : ""), b && (b.oxp = -1 !== d.indexOf("%"), b.oyp = -1 !== e.indexOf("%"), b.oxr = "=" === d.charAt(1), b.oyr = "=" === e.charAt(1), b.ox = parseFloat(d.replace(t, "")), b.oy = parseFloat(e.replace(t, "")), b.v = a), b || a
                },
                ea = function(a, b) {
                    return "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b)
                },
                fa = function(a, b) {
                    return null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) + b : parseFloat(a)
                },
                ga = function(a, b, c, d) {
                    var e, f, g, h, i, j = 1e-6;
                    return null == a ? h = b : "number" == typeof a ? h = a : (e = 360, f = a.split("_"), i = "=" === a.charAt(1), g = (i ? parseInt(a.charAt(0) + "1", 10) * parseFloat(f[0].substr(2)) : parseFloat(f[0])) * (-1 === a.indexOf("rad") ? 1 : I) - (i ? 0 : b), f.length && (d && (d[c] = b + g), -1 !== a.indexOf("short") && (g %= e, g !== g % (e / 2) && (g = 0 > g ? g + e : g - e)), -1 !== a.indexOf("_cw") && 0 > g ? g = (g + 9999999999 * e) % e - (g / e | 0) * e : -1 !== a.indexOf("ccw") && g > 0 && (g = (g - 9999999999 * e) % e - (g / e | 0) * e)), h = b + g), j > h && h > -j && (h = 0), h
                },
                ha = {
                    aqua: [0, 255, 255],
                    lime: [0, 255, 0],
                    silver: [192, 192, 192],
                    black: [0, 0, 0],
                    maroon: [128, 0, 0],
                    teal: [0, 128, 128],
                    blue: [0, 0, 255],
                    navy: [0, 0, 128],
                    white: [255, 255, 255],
                    fuchsia: [255, 0, 255],
                    olive: [128, 128, 0],
                    yellow: [255, 255, 0],
                    orange: [255, 165, 0],
                    gray: [128, 128, 128],
                    purple: [128, 0, 128],
                    green: [0, 128, 0],
                    red: [255, 0, 0],
                    pink: [255, 192, 203],
                    cyan: [0, 255, 255],
                    transparent: [255, 255, 255, 0]
                },
                ia = function(a, b, c) {
                    return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a, 255 * (1 > 6 * a ? b + (c - b) * a * 6 : .5 > a ? c : 2 > 3 * a ? b + (c - b) * (2 / 3 - a) * 6 : b) + .5 | 0
                },
                ja = g.parseColor = function(a, b) {
                    var c, d, e, f, g, h, i, j, k, l, m;
                    if (a)
                        if ("number" == typeof a) c = [a >> 16, a >> 8 & 255, 255 & a];
                        else {
                            if ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), ha[a]) c = ha[a];
                            else if ("#" === a.charAt(0)) 4 === a.length && (d = a.charAt(1), e = a.charAt(2), f = a.charAt(3), a = "#" + d + d + e + e + f + f), a = parseInt(a.substr(1), 16), c = [a >> 16, a >> 8 & 255, 255 & a];
                            else if ("hsl" === a.substr(0, 3))
                                if (c = m = a.match(q), b) {
                                    if (-1 !== a.indexOf("=")) return a.match(r)
                                } else g = Number(c[0]) % 360 / 360, h = Number(c[1]) / 100, i = Number(c[2]) / 100, e = .5 >= i ? i * (h + 1) : i + h - i * h, d = 2 * i - e, c.length > 3 && (c[3] = Number(a[3])), c[0] = ia(g + 1 / 3, d, e), c[1] = ia(g, d, e), c[2] = ia(g - 1 / 3, d, e);
                            else c = a.match(q) || ha.transparent;
                            c[0] = Number(c[0]), c[1] = Number(c[1]), c[2] = Number(c[2]), c.length > 3 && (c[3] = Number(c[3]))
                        }
                    else c = ha.black;
                    return b && !m && (d = c[0] / 255, e = c[1] / 255, f = c[2] / 255, j = Math.max(d, e, f), k = Math.min(d, e, f), i = (j + k) / 2, j === k ? g = h = 0 : (l = j - k, h = i > .5 ? l / (2 - j - k) : l / (j + k), g = j === d ? (e - f) / l + (f > e ? 6 : 0) : j === e ? (f - d) / l + 2 : (d - e) / l + 4, g *= 60), c[0] = g + .5 | 0, c[1] = 100 * h + .5 | 0, c[2] = 100 * i + .5 | 0), c
                },
                ka = function(a, b) {
                    var c, d, e, f = a.match(la) || [],
                        g = 0,
                        h = f.length ? "" : a;
                    for (c = 0; c < f.length; c++) d = f[c], e = a.substr(g, a.indexOf(d, g) - g), g += e.length + d.length, d = ja(d, b), 3 === d.length && d.push(1), h += e + (b ? "hsla(" + d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : "rgba(" + d.join(",")) + ")";
                    return h
                },
                la = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
            for (j in ha) la += "|" + j + "\\b";
            la = new RegExp(la + ")", "gi"), g.colorStringFilter = function(a) {
                var b, c = a[0] + a[1];
                la.lastIndex = 0, la.test(c) && (b = -1 !== c.indexOf("hsl(") || -1 !== c.indexOf("hsla("), a[0] = ka(a[0], b), a[1] = ka(a[1], b))
            }, b.defaultStringFilter || (b.defaultStringFilter = g.colorStringFilter);
            var ma = function(a, b, c, d) {
                    if (null == a) return function(a) {
                        return a
                    };
                    var e, f = b ? (a.match(la) || [""])[0] : "",
                        g = a.split(f).join("").match(s) || [],
                        h = a.substr(0, a.indexOf(g[0])),
                        i = ")" === a.charAt(a.length - 1) ? ")" : "",
                        j = -1 !== a.indexOf(" ") ? " " : ",",
                        k = g.length,
                        l = k > 0 ? g[0].replace(q, "") : "";
                    return k ? e = b ? function(a) {
                        var b, m, n, o;
                        if ("number" == typeof a) a += l;
                        else if (d && G.test(a)) {
                            for (o = a.replace(G, "|").split("|"), n = 0; n < o.length; n++) o[n] = e(o[n]);
                            return o.join(",")
                        }
                        if (b = (a.match(la) || [f])[0], m = a.split(b).join("").match(s) || [], n = m.length, k > n--)
                            for (; ++n < k;) m[n] = c ? m[(n - 1) / 2 | 0] : g[n];
                        return h + m.join(j) + j + b + i + (-1 !== a.indexOf("inset") ? " inset" : "")
                    } : function(a) {
                        var b, f, m;
                        if ("number" == typeof a) a += l;
                        else if (d && G.test(a)) {
                            for (f = a.replace(G, "|").split("|"), m = 0; m < f.length; m++) f[m] = e(f[m]);
                            return f.join(",")
                        }
                        if (b = a.match(s) || [], m = b.length, k > m--)
                            for (; ++m < k;) b[m] = c ? b[(m - 1) / 2 | 0] : g[m];
                        return h + b.join(j) + i
                    } : function(a) {
                        return a
                    }
                },
                na = function(a) {
                    return a = a.split(","),
                        function(b, c, d, e, f, g, h) {
                            var i, j = (c + "").split(" ");
                            for (h = {}, i = 0; 4 > i; i++) h[a[i]] = j[i] = j[i] || j[(i - 1) / 2 >> 0];
                            return e.parse(b, h, f, g)
                        }
                },
                oa = (O._setPluginRatio = function(a) {
                    this.plugin.setRatio(a);
                    for (var b, c, d, e, f, g = this.data, h = g.proxy, i = g.firstMPT, j = 1e-6; i;) b = h[i.v], i.r ? b = Math.round(b) : j > b && b > -j && (b = 0), i.t[i.p] = b, i = i._next;
                    if (g.autoRotate && (g.autoRotate.rotation = h.rotation), 1 === a || 0 === a)
                        for (i = g.firstMPT, f = 1 === a ? "e" : "b"; i;) {
                            if (c = i.t, c.type) {
                                if (1 === c.type) {
                                    for (e = c.xs0 + c.s + c.xs1, d = 1; d < c.l; d++) e += c["xn" + d] + c["xs" + (d + 1)];
                                    c[f] = e
                                }
                            } else c[f] = c.s + c.xs0;
                            i = i._next
                        }
                }, function(a, b, c, d, e) {
                    this.t = a, this.p = b, this.v = c, this.r = e, d && (d._prev = this, this._next = d)
                }),
                pa = (O._parseToProxy = function(a, b, c, d, e, f) {
                    var g, h, i, j, k, l = d,
                        m = {},
                        n = {},
                        o = c._transform,
                        p = J;
                    for (c._transform = null, J = b, d = k = c.parse(a, b, d, e), J = p, f && (c._transform = o, l && (l._prev = null, l._prev && (l._prev._next = null))); d && d !== l;) {
                        if (d.type <= 1 && (h = d.p, n[h] = d.s + d.c, m[h] = d.s, f || (j = new oa(d, "s", h, j, d.r), d.c = 0), 1 === d.type))
                            for (g = d.l; --g > 0;) i = "xn" + g, h = d.p + "_" + i, n[h] = d.data[i], m[h] = d[i], f || (j = new oa(d, i, h, j, d.rxp[i]));
                        d = d._next
                    }
                    return {
                        proxy: m,
                        end: n,
                        firstMPT: j,
                        pt: k
                    }
                }, O.CSSPropTween = function(a, b, d, e, g, h, i, j, k, l, m) {
                    this.t = a, this.p = b, this.s = d, this.c = e, this.n = i || b, a instanceof pa || f.push(this.n), this.r = j, this.type = h || 0, k && (this.pr = k, c = !0), this.b = void 0 === l ? d : l, this.e = void 0 === m ? d + e : m, g && (this._next = g, g._prev = this)
                }),
                qa = function(a, b, c, d, e, f) {
                    var g = new pa(a, b, c, d - c, e, -1, f);
                    return g.b = c, g.e = g.xs0 = d, g
                },
                ra = g.parseComplex = function(a, b, c, d, e, f, g, h, i, j) {
                    c = c || f || "", g = new pa(a, b, 0, 0, g, j ? 2 : 1, null, !1, h, c, d), d += "";
                    var l, m, n, o, p, s, t, u, v, w, x, y, z, A = c.split(", ").join(",").split(" "),
                        B = d.split(", ").join(",").split(" "),
                        C = A.length,
                        D = k !== !1;
                    for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (A = A.join(" ").replace(G, ", ").split(" "), B = B.join(" ").replace(G, ", ").split(" "), C = A.length), C !== B.length && (A = (f || "").split(" "), C = A.length), g.plugin = i, g.setRatio = j, la.lastIndex = 0, l = 0; C > l; l++)
                        if (o = A[l], p = B[l], u = parseFloat(o), u || 0 === u) g.appendXtra("", u, ea(p, u), p.replace(r, ""), D && -1 !== p.indexOf("px"), !0);
                        else if (e && la.test(o)) y = "," === p.charAt(p.length - 1) ? ")," : ")", z = -1 !== p.indexOf("hsl") && Q, o = ja(o, z), p = ja(p, z), v = o.length + p.length > 6, v && !Q && 0 === p[3] ? (g["xs" + g.l] += g.l ? " transparent" : "transparent", g.e = g.e.split(B[l]).join("transparent")) : (Q || (v = !1), z ? g.appendXtra(v ? "hsla(" : "hsl(", o[0], ea(p[0], o[0]), ",", !1, !0).appendXtra("", o[1], ea(p[1], o[1]), "%,", !1).appendXtra("", o[2], ea(p[2], o[2]), v ? "%," : "%" + y, !1) : g.appendXtra(v ? "rgba(" : "rgb(", o[0], p[0] - o[0], ",", !0, !0).appendXtra("", o[1], p[1] - o[1], ",", !0).appendXtra("", o[2], p[2] - o[2], v ? "," : y, !0), v && (o = o.length < 4 ? 1 : o[3], g.appendXtra("", o, (p.length < 4 ? 1 : p[3]) - o, y, !1))), la.lastIndex = 0;
                    else if (s = o.match(q)) {
                        if (t = p.match(r), !t || t.length !== s.length) return g;
                        for (n = 0, m = 0; m < s.length; m++) x = s[m], w = o.indexOf(x, n), g.appendXtra(o.substr(n, w - n), Number(x), ea(t[m], x), "", D && "px" === o.substr(w + x.length, 2), 0 === m), n = w + x.length;
                        g["xs" + g.l] += o.substr(n)
                    } else g["xs" + g.l] += g.l ? " " + p : p;
                    if (-1 !== d.indexOf("=") && g.data) {
                        for (y = g.xs0 + g.data.s, l = 1; l < g.l; l++) y += g["xs" + l] + g.data["xn" + l];
                        g.e = y + g["xs" + l]
                    }
                    return g.l || (g.type = -1, g.xs0 = g.e), g.xfirst || g
                },
                sa = 9;
            for (j = pa.prototype, j.l = j.pr = 0; --sa > 0;) j["xn" + sa] = 0, j["xs" + sa] = "";
            j.xs0 = "", j._next = j._prev = j.xfirst = j.data = j.plugin = j.setRatio = j.rxp = null, j.appendXtra = function(a, b, c, d, e, f) {
                var g = this,
                    h = g.l;
                return g["xs" + h] += f && h ? " " + a : a || "", c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new pa(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {
                    s: b + c
                }, g.rxp = {}, g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
            };
            var ta = function(a, b) {
                    b = b || {}, this.p = b.prefix ? V(a) || a : a, i[a] = i[this.p] = this, this.format = b.formatter || ma(b.defaultValue, b.color, b.collapsible, b.multi), b.parser && (this.parse = b.parser), this.clrs = b.color, this.multi = b.multi, this.keyword = b.keyword, this.dflt = b.defaultValue, this.pr = b.priority || 0
                },
                ua = O._registerComplexSpecialProp = function(a, b, c) {
                    "object" != typeof b && (b = {
                        parser: c
                    });
                    var d, e, f = a.split(","),
                        g = b.defaultValue;
                    for (c = c || [g], d = 0; d < f.length; d++) b.prefix = 0 === d && b.prefix, b.defaultValue = c[d] || g, e = new ta(f[d], b)
                },
                va = function(a) {
                    if (!i[a]) {
                        var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                        ua(a, {
                            parser: function(a, c, d, e, f, g, j) {
                                var k = h.com.greensock.plugins[b];
                                return k ? (k._cssRegister(), i[d].parse(a, c, d, e, f, g, j)) : (S("Error: " + b + " js file not loaded."), f)
                            }
                        })
                    }
                };
            j = ta.prototype, j.parseComplex = function(a, b, c, d, e, f) {
                var g, h, i, j, k, l, m = this.keyword;
                if (this.multi && (G.test(c) || G.test(b) ? (h = b.replace(G, "|").split("|"), i = c.replace(G, "|").split("|")) : m && (h = [b], i = [c])), i) {
                    for (j = i.length > h.length ? i.length : h.length, g = 0; j > g; g++) b = h[g] = h[g] || this.dflt, c = i[g] = i[g] || this.dflt, m && (k = b.indexOf(m), l = c.indexOf(m), k !== l && (-1 === l ? h[g] = h[g].split(m).join("") : -1 === k && (h[g] += " " + m)));
                    b = h.join(", "), c = i.join(", ")
                }
                return ra(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
            }, j.parse = function(a, b, c, d, f, g, h) {
                return this.parseComplex(a.style, this.format(X(a, this.p, e, !1, this.dflt)), this.format(b), f, g)
            }, g.registerSpecialProp = function(a, b, c) {
                ua(a, {
                    parser: function(a, d, e, f, g, h, i) {
                        var j = new pa(a, e, 0, 0, g, 2, e, !1, c);
                        return j.plugin = h, j.setRatio = b(a, d, f._tween, e), j
                    },
                    priority: c
                })
            }, g.useSVGTransformAttr = m || n;
            var wa, xa = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
                ya = V("transform"),
                za = T + "transform",
                Aa = V("transformOrigin"),
                Ba = null !== V("perspective"),
                Ca = O.Transform = function() {
                    this.perspective = parseFloat(g.defaultTransformPerspective) || 0, this.force3D = g.defaultForce3D !== !1 && Ba ? g.defaultForce3D || "auto" : !1
                },
                Da = window.SVGElement,
                Ea = function(a, b, c) {
                    var d, e = K.createElementNS("http://www.w3.org/2000/svg", a),
                        f = /([a-z])([A-Z])/g;
                    for (d in c) e.setAttributeNS(null, d.replace(f, "$1-$2").toLowerCase(), c[d]);
                    return b.appendChild(e), e
                },
                Fa = K.documentElement,
                Ga = function() {
                    var a, b, c, d = p || /Android/i.test(P) && !window.chrome;
                    return K.createElementNS && !d && (a = Ea("svg", Fa), b = Ea("rect", a, {
                        width: 100,
                        height: 50,
                        x: 100
                    }), c = b.getBoundingClientRect().width, b.style[Aa] = "50% 50%", b.style[ya] = "scaleX(0.5)", d = c === b.getBoundingClientRect().width && !(n && Ba), Fa.removeChild(a)), d
                }(),
                Ha = function(a, b, c, d, e) {
                    var f, h, i, j, k, l, m, n, o, p, q, r, s, t, u = a._gsTransform,
                        v = Ka(a, !0);
                    u && (s = u.xOrigin, t = u.yOrigin), (!d || (f = d.split(" ")).length < 2) && (m = a.getBBox(), b = da(b).split(" "), f = [(-1 !== b[0].indexOf("%") ? parseFloat(b[0]) / 100 * m.width : parseFloat(b[0])) + m.x, (-1 !== b[1].indexOf("%") ? parseFloat(b[1]) / 100 * m.height : parseFloat(b[1])) + m.y]), c.xOrigin = j = parseFloat(f[0]), c.yOrigin = k = parseFloat(f[1]), d && v !== Ja && (l = v[0], m = v[1], n = v[2], o = v[3], p = v[4], q = v[5], r = l * o - m * n, h = j * (o / r) + k * (-n / r) + (n * q - o * p) / r, i = j * (-m / r) + k * (l / r) - (l * q - m * p) / r, j = c.xOrigin = f[0] = h, k = c.yOrigin = f[1] = i), u && (e || e !== !1 && g.defaultSmoothOrigin !== !1 ? (h = j - s, i = k - t, u.xOffset += h * v[0] + i * v[2] - h, u.yOffset += h * v[1] + i * v[3] - i) : u.xOffset = u.yOffset = 0), a.setAttribute("data-svg-origin", f.join(" "))
                },
                Ia = function(a) {
                    return !!(Da && "function" == typeof a.getBBox && a.getCTM && (!a.parentNode || a.parentNode.getBBox && a.parentNode.getCTM))
                },
                Ja = [1, 0, 0, 1, 0, 0],
                Ka = function(a, b) {
                    var c, d, e, f, g, h = a._gsTransform || new Ca,
                        i = 1e5;
                    if (ya ? d = X(a, za, null, !0) : a.currentStyle && (d = a.currentStyle.filter.match(E), d = d && 4 === d.length ? [d[0].substr(4), Number(d[2].substr(4)), Number(d[1].substr(4)), d[3].substr(4), h.x || 0, h.y || 0].join(",") : ""), c = !d || "none" === d || "matrix(1, 0, 0, 1, 0, 0)" === d, (h.svg || a.getBBox && Ia(a)) && (c && -1 !== (a.style[ya] + "").indexOf("matrix") && (d = a.style[ya], c = 0), e = a.getAttribute("transform"), c && e && (-1 !== e.indexOf("matrix") ? (d = e, c = 0) : -1 !== e.indexOf("translate") && (d = "matrix(1,0,0,1," + e.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")", c = 0))), c) return Ja;
                    for (e = (d || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], sa = e.length; --sa > -1;) f = Number(e[sa]), e[sa] = (g = f - (f |= 0)) ? (g * i + (0 > g ? -.5 : .5) | 0) / i + f : f;
                    return b && e.length > 6 ? [e[0], e[1], e[4], e[5], e[12], e[13]] : e
                },
                La = O.getTransform = function(a, c, d, f) {
                    if (a._gsTransform && d && !f) return a._gsTransform;
                    var h, i, j, k, l, m, n = d ? a._gsTransform || new Ca : new Ca,
                        o = n.scaleX < 0,
                        p = 2e-5,
                        q = 1e5,
                        r = Ba ? parseFloat(X(a, Aa, c, !1, "0 0 0").split(" ")[2]) || n.zOrigin || 0 : 0,
                        s = parseFloat(g.defaultTransformPerspective) || 0;
                    if (n.svg = !(!a.getBBox || !Ia(a)), n.svg && (Ha(a, X(a, Aa, e, !1, "50% 50%") + "", n, a.getAttribute("data-svg-origin")), wa = g.useSVGTransformAttr || Ga), h = Ka(a), h !== Ja) {
                        if (16 === h.length) {
                            var t, u, v, w, x, y = h[0],
                                z = h[1],
                                A = h[2],
                                B = h[3],
                                C = h[4],
                                D = h[5],
                                E = h[6],
                                F = h[7],
                                G = h[8],
                                H = h[9],
                                J = h[10],
                                K = h[12],
                                L = h[13],
                                M = h[14],
                                N = h[11],
                                O = Math.atan2(E, J);
                            n.zOrigin && (M = -n.zOrigin, K = G * M - h[12], L = H * M - h[13], M = J * M + n.zOrigin - h[14]), n.rotationX = O * I, O && (w = Math.cos(-O), x = Math.sin(-O), t = C * w + G * x, u = D * w + H * x, v = E * w + J * x, G = C * -x + G * w, H = D * -x + H * w, J = E * -x + J * w, N = F * -x + N * w, C = t, D = u, E = v), O = Math.atan2(-A, J), n.rotationY = O * I, O && (w = Math.cos(-O), x = Math.sin(-O), t = y * w - G * x, u = z * w - H * x, v = A * w - J * x, H = z * x + H * w, J = A * x + J * w, N = B * x + N * w, y = t, z = u, A = v), O = Math.atan2(z, y), n.rotation = O * I, O && (w = Math.cos(-O), x = Math.sin(-O), y = y * w + C * x, u = z * w + D * x, D = z * -x + D * w, E = A * -x + E * w, z = u), n.rotationX && Math.abs(n.rotationX) + Math.abs(n.rotation) > 359.9 && (n.rotationX = n.rotation = 0, n.rotationY = 180 - n.rotationY), n.scaleX = (Math.sqrt(y * y + z * z) * q + .5 | 0) / q, n.scaleY = (Math.sqrt(D * D + H * H) * q + .5 | 0) / q, n.scaleZ = (Math.sqrt(E * E + J * J) * q + .5 | 0) / q, n.skewX = 0, n.perspective = N ? 1 / (0 > N ? -N : N) : 0, n.x = K, n.y = L, n.z = M, n.svg && (n.x -= n.xOrigin - (n.xOrigin * y - n.yOrigin * C), n.y -= n.yOrigin - (n.yOrigin * z - n.xOrigin * D))
                        } else if ((!Ba || f || !h.length || n.x !== h[4] || n.y !== h[5] || !n.rotationX && !n.rotationY) && (void 0 === n.x || "none" !== X(a, "display", c))) {
                            var P = h.length >= 6,
                                Q = P ? h[0] : 1,
                                R = h[1] || 0,
                                S = h[2] || 0,
                                T = P ? h[3] : 1;
                            n.x = h[4] || 0, n.y = h[5] || 0, j = Math.sqrt(Q * Q + R * R), k = Math.sqrt(T * T + S * S), l = Q || R ? Math.atan2(R, Q) * I : n.rotation || 0, m = S || T ? Math.atan2(S, T) * I + l : n.skewX || 0, Math.abs(m) > 90 && Math.abs(m) < 270 && (o ? (j *= -1, m += 0 >= l ? 180 : -180, l += 0 >= l ? 180 : -180) : (k *= -1, m += 0 >= m ? 180 : -180)), n.scaleX = j, n.scaleY = k, n.rotation = l, n.skewX = m, Ba && (n.rotationX = n.rotationY = n.z = 0, n.perspective = s, n.scaleZ = 1), n.svg && (n.x -= n.xOrigin - (n.xOrigin * Q + n.yOrigin * S), n.y -= n.yOrigin - (n.xOrigin * R + n.yOrigin * T))
                        }
                        n.zOrigin = r;
                        for (i in n) n[i] < p && n[i] > -p && (n[i] = 0)
                    }
                    return d && (a._gsTransform = n, n.svg && (wa && a.style[ya] ? b.delayedCall(.001, function() {
                        Pa(a.style, ya)
                    }) : !wa && a.getAttribute("transform") && b.delayedCall(.001, function() {
                        a.removeAttribute("transform")
                    }))), n
                },
                Ma = function(a) {
                    var b, c, d = this.data,
                        e = -d.rotation * H,
                        f = e + d.skewX * H,
                        g = 1e5,
                        h = (Math.cos(e) * d.scaleX * g | 0) / g,
                        i = (Math.sin(e) * d.scaleX * g | 0) / g,
                        j = (Math.sin(f) * -d.scaleY * g | 0) / g,
                        k = (Math.cos(f) * d.scaleY * g | 0) / g,
                        l = this.t.style,
                        m = this.t.currentStyle;
                    if (m) {
                        c = i, i = -j, j = -c, b = m.filter, l.filter = "";
                        var n, o, q = this.t.offsetWidth,
                            r = this.t.offsetHeight,
                            s = "absolute" !== m.position,
                            t = "progid:DXImageTransform.Microsoft.Matrix(M11=" + h + ", M12=" + i + ", M21=" + j + ", M22=" + k,
                            w = d.x + q * d.xPercent / 100,
                            x = d.y + r * d.yPercent / 100;
                        if (null != d.ox && (n = (d.oxp ? q * d.ox * .01 : d.ox) - q / 2, o = (d.oyp ? r * d.oy * .01 : d.oy) - r / 2, w += n - (n * h + o * i), x += o - (n * j + o * k)), s ? (n = q / 2, o = r / 2, t += ", Dx=" + (n - (n * h + o * i) + w) + ", Dy=" + (o - (n * j + o * k) + x) + ")") : t += ", sizingMethod='auto expand')", -1 !== b.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.filter = b.replace(F, t) : l.filter = t + " " + b, (0 === a || 1 === a) && 1 === h && 0 === i && 0 === j && 1 === k && (s && -1 === t.indexOf("Dx=0, Dy=0") || v.test(b) && 100 !== parseFloat(RegExp.$1) || -1 === b.indexOf(b.indexOf("Alpha")) && l.removeAttribute("filter")), !s) {
                            var y, z, A, B = 8 > p ? 1 : -1;
                            for (n = d.ieOffsetX || 0, o = d.ieOffsetY || 0, d.ieOffsetX = Math.round((q - ((0 > h ? -h : h) * q + (0 > i ? -i : i) * r)) / 2 + w), d.ieOffsetY = Math.round((r - ((0 > k ? -k : k) * r + (0 > j ? -j : j) * q)) / 2 + x), sa = 0; 4 > sa; sa++) z = ba[sa], y = m[z], c = -1 !== y.indexOf("px") ? parseFloat(y) : Y(this.t, z, parseFloat(y), y.replace(u, "")) || 0, A = c !== d[z] ? 2 > sa ? -d.ieOffsetX : -d.ieOffsetY : 2 > sa ? n - d.ieOffsetX : o - d.ieOffsetY, l[z] = (d[z] = Math.round(c - A * (0 === sa || 2 === sa ? 1 : B))) + "px"
                        }
                    }
                },
                Na = O.set3DTransformRatio = O.setTransformRatio = function(a) {
                    var b, c, d, e, f, g, h, i, j, k, l, m, o, p, q, r, s, t, u, v, w, x, y, z = this.data,
                        A = this.t.style,
                        B = z.rotation,
                        C = z.rotationX,
                        D = z.rotationY,
                        E = z.scaleX,
                        F = z.scaleY,
                        G = z.scaleZ,
                        I = z.x,
                        J = z.y,
                        K = z.z,
                        L = z.svg,
                        M = z.perspective,
                        N = z.force3D;
                    if (((1 === a || 0 === a) && "auto" === N && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !N) && !K && !M && !D && !C && 1 === G || wa && L || !Ba) return void(B || z.skewX || L ? (B *= H, x = z.skewX * H, y = 1e5, b = Math.cos(B) * E, e = Math.sin(B) * E, c = Math.sin(B - x) * -F, f = Math.cos(B - x) * F, x && "simple" === z.skewType && (s = Math.tan(x), s = Math.sqrt(1 + s * s), c *= s, f *= s, z.skewY && (b *= s, e *= s)), L && (I += z.xOrigin - (z.xOrigin * b + z.yOrigin * c) + z.xOffset, J += z.yOrigin - (z.xOrigin * e + z.yOrigin * f) + z.yOffset, wa && (z.xPercent || z.yPercent) && (p = this.t.getBBox(), I += .01 * z.xPercent * p.width, J += .01 * z.yPercent * p.height), p = 1e-6, p > I && I > -p && (I = 0), p > J && J > -p && (J = 0)), u = (b * y | 0) / y + "," + (e * y | 0) / y + "," + (c * y | 0) / y + "," + (f * y | 0) / y + "," + I + "," + J + ")", L && wa ? this.t.setAttribute("transform", "matrix(" + u) : A[ya] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + u) : A[ya] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix(" : "matrix(") + E + ",0,0," + F + "," + I + "," + J + ")");
                    if (n && (p = 1e-4, p > E && E > -p && (E = G = 2e-5), p > F && F > -p && (F = G = 2e-5), !M || z.z || z.rotationX || z.rotationY || (M = 0)), B || z.skewX) B *= H, q = b = Math.cos(B), r = e = Math.sin(B), z.skewX && (B -= z.skewX * H, q = Math.cos(B), r = Math.sin(B), "simple" === z.skewType && (s = Math.tan(z.skewX * H), s = Math.sqrt(1 + s * s), q *= s, r *= s, z.skewY && (b *= s, e *= s))), c = -r, f = q;
                    else {
                        if (!(D || C || 1 !== G || M || L)) return void(A[ya] = (z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) translate3d(" : "translate3d(") + I + "px," + J + "px," + K + "px)" + (1 !== E || 1 !== F ? " scale(" + E + "," + F + ")" : ""));
                        b = f = 1, c = e = 0
                    }
                    j = 1, d = g = h = i = k = l = 0, m = M ? -1 / M : 0, o = z.zOrigin, p = 1e-6, v = ",", w = "0", B = D * H, B && (q = Math.cos(B), r = Math.sin(B), h = -r, k = m * -r, d = b * r, g = e * r, j = q, m *= q, b *= q, e *= q), B = C * H, B && (q = Math.cos(B), r = Math.sin(B), s = c * q + d * r, t = f * q + g * r, i = j * r, l = m * r, d = c * -r + d * q, g = f * -r + g * q, j *= q, m *= q, c = s, f = t), 1 !== G && (d *= G, g *= G, j *= G, m *= G), 1 !== F && (c *= F, f *= F, i *= F, l *= F), 1 !== E && (b *= E, e *= E, h *= E, k *= E), (o || L) && (o && (I += d * -o, J += g * -o, K += j * -o + o), L && (I += z.xOrigin - (z.xOrigin * b + z.yOrigin * c) + z.xOffset, J += z.yOrigin - (z.xOrigin * e + z.yOrigin * f) + z.yOffset), p > I && I > -p && (I = w), p > J && J > -p && (J = w), p > K && K > -p && (K = 0)), u = z.xPercent || z.yPercent ? "translate(" + z.xPercent + "%," + z.yPercent + "%) matrix3d(" : "matrix3d(", u += (p > b && b > -p ? w : b) + v + (p > e && e > -p ? w : e) + v + (p > h && h > -p ? w : h), u += v + (p > k && k > -p ? w : k) + v + (p > c && c > -p ? w : c) + v + (p > f && f > -p ? w : f), C || D || 1 !== G ? (u += v + (p > i && i > -p ? w : i) + v + (p > l && l > -p ? w : l) + v + (p > d && d > -p ? w : d), u += v + (p > g && g > -p ? w : g) + v + (p > j && j > -p ? w : j) + v + (p > m && m > -p ? w : m) + v) : u += ",0,0,0,0,1,0,", u += I + v + J + v + K + v + (M ? 1 + -K / M : 1) + ")", A[ya] = u
                };
            j = Ca.prototype, j.x = j.y = j.z = j.skewX = j.skewY = j.rotation = j.rotationX = j.rotationY = j.zOrigin = j.xPercent = j.yPercent = j.xOffset = j.yOffset = 0, j.scaleX = j.scaleY = j.scaleZ = 1, ua("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
                parser: function(a, b, c, d, f, h, i) {
                    if (d._lastParsedTransform === i) return f;
                    d._lastParsedTransform = i;
                    var j, k, l, m, n, o, p, q, r, s, t = a._gsTransform,
                        u = a.style,
                        v = 1e-6,
                        w = xa.length,
                        x = i,
                        y = {},
                        z = "transformOrigin";
                    if (i.display ? (m = X(a, "display"), u.display = "block", j = La(a, e, !0, i.parseTransform), u.display = m) : j = La(a, e, !0, i.parseTransform), d._transform = j, "string" == typeof x.transform && ya) m = M.style, m[ya] = x.transform, m.display = "block", m.position = "absolute", K.body.appendChild(M), k = La(M, null, !1), K.body.removeChild(M), k.perspective || (k.perspective = j.perspective), null != x.xPercent && (k.xPercent = fa(x.xPercent, j.xPercent)), null != x.yPercent && (k.yPercent = fa(x.yPercent, j.yPercent));
                    else if ("object" == typeof x) {
                        if (k = {
                                scaleX: fa(null != x.scaleX ? x.scaleX : x.scale, j.scaleX),
                                scaleY: fa(null != x.scaleY ? x.scaleY : x.scale, j.scaleY),
                                scaleZ: fa(x.scaleZ, j.scaleZ),
                                x: fa(x.x, j.x),
                                y: fa(x.y, j.y),
                                z: fa(x.z, j.z),
                                xPercent: fa(x.xPercent, j.xPercent),
                                yPercent: fa(x.yPercent, j.yPercent),
                                perspective: fa(x.transformPerspective, j.perspective)
                            }, q = x.directionalRotation, null != q)
                            if ("object" == typeof q)
                                for (m in q) x[m] = q[m];
                            else x.rotation = q;
                        "string" == typeof x.x && -1 !== x.x.indexOf("%") && (k.x = 0, k.xPercent = fa(x.x, j.xPercent)), "string" == typeof x.y && -1 !== x.y.indexOf("%") && (k.y = 0, k.yPercent = fa(x.y, j.yPercent)), k.rotation = ga("rotation" in x ? x.rotation : "shortRotation" in x ? x.shortRotation + "_short" : "rotationZ" in x ? x.rotationZ : j.rotation, j.rotation, "rotation", y), Ba && (k.rotationX = ga("rotationX" in x ? x.rotationX : "shortRotationX" in x ? x.shortRotationX + "_short" : j.rotationX || 0, j.rotationX, "rotationX", y), k.rotationY = ga("rotationY" in x ? x.rotationY : "shortRotationY" in x ? x.shortRotationY + "_short" : j.rotationY || 0, j.rotationY, "rotationY", y)), k.skewX = null == x.skewX ? j.skewX : ga(x.skewX, j.skewX), k.skewY = null == x.skewY ? j.skewY : ga(x.skewY, j.skewY), (l = k.skewY - j.skewY) && (k.skewX += l, k.rotation += l)
                    }
                    for (Ba && null != x.force3D && (j.force3D = x.force3D, p = !0), j.skewType = x.skewType || j.skewType || g.defaultSkewType, o = j.force3D || j.z || j.rotationX || j.rotationY || k.z || k.rotationX || k.rotationY || k.perspective, o || null == x.scale || (k.scaleZ = 1); --w > -1;) c = xa[w], n = k[c] - j[c], (n > v || -v > n || null != x[c] || null != J[c]) && (p = !0, f = new pa(j, c, j[c], n, f), c in y && (f.e = y[c]), f.xs0 = 0, f.plugin = h, d._overwriteProps.push(f.n));
                    return n = x.transformOrigin, j.svg && (n || x.svgOrigin) && (r = j.xOffset, s = j.yOffset, Ha(a, da(n), k, x.svgOrigin, x.smoothOrigin), f = qa(j, "xOrigin", (t ? j : k).xOrigin, k.xOrigin, f, z), f = qa(j, "yOrigin", (t ? j : k).yOrigin, k.yOrigin, f, z), (r !== j.xOffset || s !== j.yOffset) && (f = qa(j, "xOffset", t ? r : j.xOffset, j.xOffset, f, z), f = qa(j, "yOffset", t ? s : j.yOffset, j.yOffset, f, z)), n = wa ? null : "0px 0px"), (n || Ba && o && j.zOrigin) && (ya ? (p = !0, c = Aa, n = (n || X(a, c, e, !1, "50% 50%")) + "", f = new pa(u, c, 0, 0, f, -1, z), f.b = u[c], f.plugin = h, Ba ? (m = j.zOrigin, n = n.split(" "), j.zOrigin = (n.length > 2 && (0 === m || "0px" !== n[2]) ? parseFloat(n[2]) : m) || 0, f.xs0 = f.e = n[0] + " " + (n[1] || "50%") + " 0px", f = new pa(j, "zOrigin", 0, 0, f, -1, f.n), f.b = m, f.xs0 = f.e = j.zOrigin) : f.xs0 = f.e = n) : da(n + "", j)), p && (d._transformType = j.svg && wa || !o && 3 !== this._transformType ? 2 : 3), f
                },
                prefix: !0
            }), ua("boxShadow", {
                defaultValue: "0px 0px 0px 0px #999",
                prefix: !0,
                color: !0,
                multi: !0,
                keyword: "inset"
            }), ua("borderRadius", {
                defaultValue: "0px",
                parser: function(a, b, c, f, g, h) {
                    b = this.format(b);
                    var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
                        z = a.style;
                    for (q = parseFloat(a.offsetWidth), r = parseFloat(a.offsetHeight), i = b.split(" "), j = 0; j < y.length; j++) this.p.indexOf("border") && (y[j] = V(y[j])), m = l = X(a, y[j], e, !1, "0px"), -1 !== m.indexOf(" ") && (l = m.split(" "), m = l[0], l = l[1]), n = k = i[j], o = parseFloat(m), t = m.substr((o + "").length), u = "=" === n.charAt(1), u ? (p = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), p *= parseFloat(n), s = n.substr((p + "").length - (0 > p ? 1 : 0)) || "") : (p = parseFloat(n), s = n.substr((p + "").length)), "" === s && (s = d[c] || t), s !== t && (v = Y(a, "borderLeft", o, t), w = Y(a, "borderTop", o, t), "%" === s ? (m = v / q * 100 + "%", l = w / r * 100 + "%") : "em" === s ? (x = Y(a, "borderLeft", 1, "em"), m = v / x + "em", l = w / x + "em") : (m = v + "px", l = w + "px"), u && (n = parseFloat(m) + p + s, k = parseFloat(l) + p + s)), g = ra(z, y[j], m + " " + l, n + " " + k, !1, "0px", g);
                    return g
                },
                prefix: !0,
                formatter: ma("0px 0px 0px 0px", !1, !0)
            }), ua("backgroundPosition", {
                defaultValue: "0 0",
                parser: function(a, b, c, d, f, g) {
                    var h, i, j, k, l, m, n = "background-position",
                        o = e || W(a, null),
                        q = this.format((o ? p ? o.getPropertyValue(n + "-x") + " " + o.getPropertyValue(n + "-y") : o.getPropertyValue(n) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"),
                        r = this.format(b);
                    if (-1 !== q.indexOf("%") != (-1 !== r.indexOf("%")) && (m = X(a, "backgroundImage").replace(B, ""), m && "none" !== m)) {
                        for (h = q.split(" "), i = r.split(" "), N.setAttribute("src", m), j = 2; --j > -1;) q = h[j], k = -1 !== q.indexOf("%"), k !== (-1 !== i[j].indexOf("%")) && (l = 0 === j ? a.offsetWidth - N.width : a.offsetHeight - N.height, h[j] = k ? parseFloat(q) / 100 * l + "px" : parseFloat(q) / l * 100 + "%");
                        q = h.join(" ")
                    }
                    return this.parseComplex(a.style, q, r, f, g)
                },
                formatter: da
            }), ua("backgroundSize", {
                defaultValue: "0 0",
                formatter: da
            }), ua("perspective", {
                defaultValue: "0px",
                prefix: !0
            }), ua("perspectiveOrigin", {
                defaultValue: "50% 50%",
                prefix: !0
            }), ua("transformStyle", {
                prefix: !0
            }), ua("backfaceVisibility", {
                prefix: !0
            }), ua("userSelect", {
                prefix: !0
            }), ua("margin", {
                parser: na("marginTop,marginRight,marginBottom,marginLeft")
            }), ua("padding", {
                parser: na("paddingTop,paddingRight,paddingBottom,paddingLeft")
            }), ua("clip", {
                defaultValue: "rect(0px,0px,0px,0px)",
                parser: function(a, b, c, d, f, g) {
                    var h, i, j;
                    return 9 > p ? (i = a.currentStyle, j = 8 > p ? " " : ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")", b = this.format(b).split(",").join(j)) : (h = this.format(X(a, this.p, e, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, h, b, f, g)
                }
            }), ua("textShadow", {
                defaultValue: "0px 0px 0px #999",
                color: !0,
                multi: !0
            }), ua("autoRound,strictUnits", {
                parser: function(a, b, c, d, e) {
                    return e
                }
            }), ua("border", {
                defaultValue: "0px solid #000",
                parser: function(a, b, c, d, f, g) {
                    return this.parseComplex(a.style, this.format(X(a, "borderTopWidth", e, !1, "0px") + " " + X(a, "borderTopStyle", e, !1, "solid") + " " + X(a, "borderTopColor", e, !1, "#000")), this.format(b), f, g)
                },
                color: !0,
                formatter: function(a) {
                    var b = a.split(" ");
                    return b[0] + " " + (b[1] || "solid") + " " + (a.match(la) || ["#000"])[0]
                }
            }), ua("borderWidth", {
                parser: na("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
            }), ua("float,cssFloat,styleFloat", {
                parser: function(a, b, c, d, e, f) {
                    var g = a.style,
                        h = "cssFloat" in g ? "cssFloat" : "styleFloat";
                    return new pa(g, h, 0, 0, e, -1, c, !1, 0, g[h], b)
                }
            });
            var Oa = function(a) {
                var b, c = this.t,
                    d = c.filter || X(this.data, "filter") || "",
                    e = this.s + this.c * a | 0;
                100 === e && (-1 === d.indexOf("atrix(") && -1 === d.indexOf("radient(") && -1 === d.indexOf("oader(") ? (c.removeAttribute("filter"), b = !X(this.data, "filter")) : (c.filter = d.replace(x, ""), b = !0)), b || (this.xn1 && (c.filter = d = d || "alpha(opacity=" + e + ")"), -1 === d.indexOf("pacity") ? 0 === e && this.xn1 || (c.filter = d + " alpha(opacity=" + e + ")") : c.filter = d.replace(v, "opacity=" + e))
            };
            ua("opacity,alpha,autoAlpha", {
                defaultValue: "1",
                parser: function(a, b, c, d, f, g) {
                    var h = parseFloat(X(a, "opacity", e, !1, "1")),
                        i = a.style,
                        j = "autoAlpha" === c;
                    return "string" == typeof b && "=" === b.charAt(1) && (b = ("-" === b.charAt(0) ? -1 : 1) * parseFloat(b.substr(2)) + h), j && 1 === h && "hidden" === X(a, "visibility", e) && 0 !== b && (h = 0), Q ? f = new pa(i, "opacity", h, b - h, f) : (f = new pa(i, "opacity", 100 * h, 100 * (b - h), f), f.xn1 = j ? 1 : 0, i.zoom = 1, f.type = 2, f.b = "alpha(opacity=" + f.s + ")", f.e = "alpha(opacity=" + (f.s + f.c) + ")", f.data = a, f.plugin = g, f.setRatio = Oa), j && (f = new pa(i, "visibility", 0, 0, f, -1, null, !1, 0, 0 !== h ? "inherit" : "hidden", 0 === b ? "hidden" : "inherit"), f.xs0 = "inherit", d._overwriteProps.push(f.n), d._overwriteProps.push(c)), f
                }
            });
            var Pa = function(a, b) {
                    b && (a.removeProperty ? (("ms" === b.substr(0, 2) || "webkit" === b.substr(0, 6)) && (b = "-" + b), a.removeProperty(b.replace(z, "-$1").toLowerCase())) : a.removeAttribute(b))
                },
                Qa = function(a) {
                    if (this.t._gsClassPT = this, 1 === a || 0 === a) {
                        this.t.setAttribute("class", 0 === a ? this.b : this.e);
                        for (var b = this.data, c = this.t.style; b;) b.v ? c[b.p] = b.v : Pa(c, b.p), b = b._next;
                        1 === a && this.t._gsClassPT === this && (this.t._gsClassPT = null)
                    } else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
                };
            ua("className", {
                parser: function(a, b, d, f, g, h, i) {
                    var j, k, l, m, n, o = a.getAttribute("class") || "",
                        p = a.style.cssText;
                    if (g = f._classNamePT = new pa(a, d, 0, 0, g, 2),
                        g.setRatio = Qa, g.pr = -11, c = !0, g.b = o, k = $(a, e), l = a._gsClassPT) {
                        for (m = {}, n = l.data; n;) m[n.p] = 1, n = n._next;
                        l.setRatio(1)
                    }
                    return a._gsClassPT = g, g.e = "=" !== b.charAt(1) ? b : o.replace(new RegExp("\\s*\\b" + b.substr(2) + "\\b"), "") + ("+" === b.charAt(0) ? " " + b.substr(2) : ""), a.setAttribute("class", g.e), j = _(a, k, $(a), i, m), a.setAttribute("class", o), g.data = j.firstMPT, a.style.cssText = p, g = g.xfirst = f.parse(a, j.difs, g, h)
                }
            });
            var Ra = function(a) {
                if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                    var b, c, d, e, f, g = this.t.style,
                        h = i.transform.parse;
                    if ("all" === this.e) g.cssText = "", e = !0;
                    else
                        for (b = this.e.split(" ").join("").split(","), d = b.length; --d > -1;) c = b[d], i[c] && (i[c].parse === h ? e = !0 : c = "transformOrigin" === c ? Aa : i[c].p), Pa(g, c);
                    e && (Pa(g, ya), f = this.t._gsTransform, f && (f.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
                }
            };
            for (ua("clearProps", {
                    parser: function(a, b, d, e, f) {
                        return f = new pa(a, d, 0, 0, f, 2), f.setRatio = Ra, f.e = b, f.pr = -10, f.data = e._tween, c = !0, f
                    }
                }), j = "bezier,throwProps,physicsProps,physics2D".split(","), sa = j.length; sa--;) va(j[sa]);
            j = g.prototype, j._firstPT = j._lastParsedTransform = j._transform = null, j._onInitTween = function(a, b, h) {
                if (!a.nodeType) return !1;
                this._target = a, this._tween = h, this._vars = b, k = b.autoRound, c = !1, d = b.suffixMap || g.suffixMap, e = W(a, ""), f = this._overwriteProps;
                var j, n, p, q, r, s, t, u, v, x = a.style;
                if (l && "" === x.zIndex && (j = X(a, "zIndex", e), ("auto" === j || "" === j) && this._addLazySet(x, "zIndex", 0)), "string" == typeof b && (q = x.cssText, j = $(a, e), x.cssText = q + ";" + b, j = _(a, j, $(a)).difs, !Q && w.test(b) && (j.opacity = parseFloat(RegExp.$1)), b = j, x.cssText = q), b.className ? this._firstPT = n = i.className.parse(a, b.className, "className", this, null, null, b) : this._firstPT = n = this.parse(a, b, null), this._transformType) {
                    for (v = 3 === this._transformType, ya ? m && (l = !0, "" === x.zIndex && (t = X(a, "zIndex", e), ("auto" === t || "" === t) && this._addLazySet(x, "zIndex", 0)), o && this._addLazySet(x, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (v ? "visible" : "hidden"))) : x.zoom = 1, p = n; p && p._next;) p = p._next;
                    u = new pa(a, "transform", 0, 0, null, 2), this._linkCSSP(u, null, p), u.setRatio = ya ? Na : Ma, u.data = this._transform || La(a, e, !0), u.tween = h, u.pr = -1, f.pop()
                }
                if (c) {
                    for (; n;) {
                        for (s = n._next, p = q; p && p.pr > n.pr;) p = p._next;
                        (n._prev = p ? p._prev : r) ? n._prev._next = n: q = n, (n._next = p) ? p._prev = n : r = n, n = s
                    }
                    this._firstPT = q
                }
                return !0
            }, j.parse = function(a, b, c, f) {
                var g, h, j, l, m, n, o, p, q, r, s = a.style;
                for (g in b) n = b[g], h = i[g], h ? c = h.parse(a, n, g, this, c, f, b) : (m = X(a, g, e) + "", q = "string" == typeof n, "color" === g || "fill" === g || "stroke" === g || -1 !== g.indexOf("Color") || q && y.test(n) ? (q || (n = ja(n), n = (n.length > 3 ? "rgba(" : "rgb(") + n.join(",") + ")"), c = ra(s, g, m, n, !0, "transparent", c, 0, f)) : !q || -1 === n.indexOf(" ") && -1 === n.indexOf(",") ? (j = parseFloat(m), o = j || 0 === j ? m.substr((j + "").length) : "", ("" === m || "auto" === m) && ("width" === g || "height" === g ? (j = ca(a, g, e), o = "px") : "left" === g || "top" === g ? (j = Z(a, g, e), o = "px") : (j = "opacity" !== g ? 0 : 1, o = "")), r = q && "=" === n.charAt(1), r ? (l = parseInt(n.charAt(0) + "1", 10), n = n.substr(2), l *= parseFloat(n), p = n.replace(u, "")) : (l = parseFloat(n), p = q ? n.replace(u, "") : ""), "" === p && (p = g in d ? d[g] : o), n = l || 0 === l ? (r ? l + j : l) + p : b[g], o !== p && "" !== p && (l || 0 === l) && j && (j = Y(a, g, j, o), "%" === p ? (j /= Y(a, g, 100, "%") / 100, b.strictUnits !== !0 && (m = j + "%")) : "em" === p || "rem" === p || "vw" === p || "vh" === p ? j /= Y(a, g, 1, p) : "px" !== p && (l = Y(a, g, l, p), p = "px"), r && (l || 0 === l) && (n = l + j + p)), r && (l += j), !j && 0 !== j || !l && 0 !== l ? void 0 !== s[g] && (n || n + "" != "NaN" && null != n) ? (c = new pa(s, g, l || j || 0, 0, c, -1, g, !1, 0, m, n), c.xs0 = "none" !== n || "display" !== g && -1 === g.indexOf("Style") ? n : m) : S("invalid " + g + " tween value: " + b[g]) : (c = new pa(s, g, j, l - j, c, 0, g, k !== !1 && ("px" === p || "zIndex" === g), 0, m, n), c.xs0 = p)) : c = ra(s, g, m, n, !0, null, c, 0, f)), f && c && !c.plugin && (c.plugin = f);
                return c
            }, j.setRatio = function(a) {
                var b, c, d, e = this._firstPT,
                    f = 1e-6;
                if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                    if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                        for (; e;) {
                            if (b = e.c * a + e.s, e.r ? b = Math.round(b) : f > b && b > -f && (b = 0), e.type)
                                if (1 === e.type)
                                    if (d = e.l, 2 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2;
                                    else if (3 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3;
                            else if (4 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4;
                            else if (5 === d) e.t[e.p] = e.xs0 + b + e.xs1 + e.xn1 + e.xs2 + e.xn2 + e.xs3 + e.xn3 + e.xs4 + e.xn4 + e.xs5;
                            else {
                                for (c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                e.t[e.p] = c
                            } else -1 === e.type ? e.t[e.p] = e.xs0 : e.setRatio && e.setRatio(a);
                            else e.t[e.p] = b + e.xs0;
                            e = e._next
                        } else
                            for (; e;) 2 !== e.type ? e.t[e.p] = e.b : e.setRatio(a), e = e._next;
                    else
                        for (; e;) {
                            if (2 !== e.type)
                                if (e.r && -1 !== e.type)
                                    if (b = Math.round(e.s + e.c), e.type) {
                                        if (1 === e.type) {
                                            for (d = e.l, c = e.xs0 + b + e.xs1, d = 1; d < e.l; d++) c += e["xn" + d] + e["xs" + (d + 1)];
                                            e.t[e.p] = c
                                        }
                                    } else e.t[e.p] = b + e.xs0;
                            else e.t[e.p] = e.e;
                            else e.setRatio(a);
                            e = e._next
                        }
            }, j._enableTransforms = function(a) {
                this._transform = this._transform || La(this._target, e, !0), this._transformType = this._transform.svg && wa || !a && 3 !== this._transformType ? 2 : 3
            };
            var Sa = function(a) {
                this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
            };
            j._addLazySet = function(a, b, c) {
                var d = this._firstPT = new pa(a, b, 0, 0, this._firstPT, 2);
                d.e = c, d.setRatio = Sa, d.data = this
            }, j._linkCSSP = function(a, b, c, d) {
                return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next, d = !0), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._next = b, a._prev = c), a
            }, j._kill = function(b) {
                var c, d, e, f = b;
                if (b.autoAlpha || b.alpha) {
                    f = {};
                    for (d in b) f[d] = b[d];
                    f.opacity = 1, f.autoAlpha && (f.visibility = 1)
                }
                return b.className && (c = this._classNamePT) && (e = c.xfirst, e && e._prev ? this._linkCSSP(e._prev, c._next, e._prev._prev) : e === this._firstPT && (this._firstPT = c._next), c._next && this._linkCSSP(c._next, c._next._next, e._prev), this._classNamePT = null), a.prototype._kill.call(this, f)
            };
            var Ta = function(a, b, c) {
                var d, e, f, g;
                if (a.slice)
                    for (e = a.length; --e > -1;) Ta(a[e], b, c);
                else
                    for (d = a.childNodes, e = d.length; --e > -1;) f = d[e], g = f.type, f.style && (b.push($(f)), c && c.push(f)), 1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Ta(f, b, c)
            };
            return g.cascadeTo = function(a, c, d) {
                var e, f, g, h, i = b.to(a, c, d),
                    j = [i],
                    k = [],
                    l = [],
                    m = [],
                    n = b._internals.reservedProps;
                for (a = i._targets || i.target, Ta(a, k, m), i.render(c, !0, !0), Ta(a, l), i.render(0, !0, !0), i._enabled(!0), e = m.length; --e > -1;)
                    if (f = _(m[e], k[e], l[e]), f.firstMPT) {
                        f = f.difs;
                        for (g in d) n[g] && (f[g] = d[g]);
                        h = {};
                        for (g in f) h[g] = k[e][g];
                        j.push(b.fromTo(m[e], c, h, f))
                    }
                return j
            }, a.activate([g]), g
        }, !0)
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function(a) {
        "use strict";
        var b = function() {
            return (_gsScope.GreenSockGlobals || _gsScope)[a]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = b())
    }("CSSPlugin");

/*!
 * VERSION: 0.3.4
 * DATE: 2015-08-15
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
! function(a) {
    "use strict";
    var b = a.GreenSockGlobals || a,
        c = function(a) {
            var c, d = a.split("."),
                e = b;
            for (c = 0; c < d.length; c++) e[d[c]] = e = e[d[c]] || {};
            return e
        },
        d = c("com.greensock.utils"),
        e = function(a) {
            var b = a.nodeType,
                c = "";
            if (1 === b || 9 === b || 11 === b) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
            } else if (3 === b || 4 === b) return a.nodeValue;
            return c
        },
        f = document,
        g = f.defaultView ? f.defaultView.getComputedStyle : function() {},
        h = /([A-Z])/g,
        i = function(a, b, c, d) {
            var e;
            return (c = c || g(a, null)) ? (a = c.getPropertyValue(b.replace(h, "-$1").toLowerCase()), e = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, e = c[b]), d ? e : parseInt(e, 10) || 0
        },
        j = function(a) {
            return a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1
        },
        k = function(a) {
            var b, c, d, e = [],
                f = a.length;
            for (b = 0; f > b; b++)
                if (c = a[b], j(c))
                    for (d = c.length, d = 0; d < c.length; d++) e.push(c[d]);
                else e.push(c);
            return e
        },
        l = ")eefec303079ad17405c",
        m = /(?:<br>|<br\/>|<br \/>)/gi,
        n = f.all && !f.addEventListener,
        o = "<div style='position:relative;display:inline-block;" + (n ? "*display:inline;*zoom:1;'" : "'"),
        p = function(a) {
            a = a || "";
            var b = -1 !== a.indexOf("++"),
                c = 1;
            return b && (a = a.split("++").join("")),
                function() {
                    return o + (a ? " class='" + a + (b ? c++ : "") + "'>" : ">")
                }
        },
        q = d.SplitText = b.SplitText = function(a, b) {
            if ("string" == typeof a && (a = q.selector(a)), !a) throw "cannot split a null element.";
            this.elements = j(a) ? k(a) : [a], this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = b || {}, this.split(b)
        },
        r = function(a, b, c) {
            var d = a.nodeType;
            if (1 === d || 9 === d || 11 === d)
                for (a = a.firstChild; a; a = a.nextSibling) r(a, b, c);
            else(3 === d || 4 === d) && (a.nodeValue = a.nodeValue.split(b).join(c))
        },
        s = function(a, b) {
            for (var c = b.length; --c > -1;) a.push(b[c])
        },
        t = function(a, b, c, d, h) {
            m.test(a.innerHTML) && (a.innerHTML = a.innerHTML.replace(m, l));
            var j, k, n, o, q, t, u, v, w, x, y, z, A, B, C = e(a),
                D = b.type || b.split || "chars,words,lines",
                E = -1 !== D.indexOf("lines") ? [] : null,
                F = -1 !== D.indexOf("words"),
                G = -1 !== D.indexOf("chars"),
                H = "absolute" === b.position || b.absolute === !0,
                I = H ? "&#173; " : " ",
                J = -999,
                K = g(a),
                L = i(a, "paddingLeft", K),
                M = i(a, "borderBottomWidth", K) + i(a, "borderTopWidth", K),
                N = i(a, "borderLeftWidth", K) + i(a, "borderRightWidth", K),
                O = i(a, "paddingTop", K) + i(a, "paddingBottom", K),
                P = i(a, "paddingLeft", K) + i(a, "paddingRight", K),
                Q = i(a, "textAlign", K, !0),
                R = a.clientHeight,
                S = a.clientWidth,
                T = "</div>",
                U = p(b.wordsClass),
                V = p(b.charsClass),
                W = -1 !== (b.linesClass || "").indexOf("++"),
                X = b.linesClass,
                Y = -1 !== C.indexOf("<"),
                Z = !0,
                $ = [],
                _ = [],
                aa = [];
            for (W && (X = X.split("++").join("")), Y && (C = C.split("<").join("{{LT}}")), j = C.length, o = U(), q = 0; j > q; q++)
                if (u = C.charAt(q), ")" === u && C.substr(q, 20) === l) o += (Z ? T : "") + "<BR/>", Z = !1, q !== j - 20 && C.substr(q + 20, 20) !== l && (o += " " + U(), Z = !0), q += 19;
                else if (" " === u && " " !== C.charAt(q - 1) && q !== j - 1 && C.substr(q - 20, 20) !== l) {
                for (o += Z ? T : "", Z = !1;
                    " " === C.charAt(q + 1);) o += I, q++;
                (")" !== C.charAt(q + 1) || C.substr(q + 1, 20) !== l) && (o += I + U(), Z = !0)
            } else "{" === u && "{{LT}}" === C.substr(q, 6) ? (o += G ? V() + "{{LT}}</div>" : "{{LT}}", q += 5) : o += G && " " !== u ? V() + u + "</div>" : u;
            for (a.innerHTML = o + (Z ? T : ""), Y && r(a, "{{LT}}", "<"), t = a.getElementsByTagName("*"), j = t.length, v = [], q = 0; j > q; q++) v[q] = t[q];
            if (E || H)
                for (q = 0; j > q; q++) w = v[q], n = w.parentNode === a, (n || H || G && !F) && (x = w.offsetTop, E && n && x !== J && "BR" !== w.nodeName && (k = [], E.push(k), J = x), H && (w._x = w.offsetLeft, w._y = x, w._w = w.offsetWidth, w._h = w.offsetHeight), E && (F !== n && G || (k.push(w), w._x -= L), n && q && (v[q - 1]._wordEnd = !0), "BR" === w.nodeName && w.nextSibling && "BR" === w.nextSibling.nodeName && E.push([])));
            for (q = 0; j > q; q++) w = v[q], n = w.parentNode === a, "BR" !== w.nodeName ? (H && (z = w.style, F || n || (w._x += w.parentNode._x, w._y += w.parentNode._y), z.left = w._x + "px", z.top = w._y + "px", z.position = "absolute", z.display = "block", z.width = w._w + 1 + "px", z.height = w._h + "px"), F ? n && "" !== w.innerHTML ? _.push(w) : G && $.push(w) : n ? (a.removeChild(w), v.splice(q--, 1), j--) : !n && G && (x = !E && !H && w.nextSibling, a.appendChild(w), x || a.appendChild(f.createTextNode(" ")), $.push(w))) : E || H ? (a.removeChild(w), v.splice(q--, 1), j--) : F || a.appendChild(w);
            if (E) {
                for (H && (y = f.createElement("div"), a.appendChild(y), A = y.offsetWidth + "px", x = y.offsetParent === a ? 0 : a.offsetLeft, a.removeChild(y)), z = a.style.cssText, a.style.cssText = "display:none;"; a.firstChild;) a.removeChild(a.firstChild);
                for (B = !H || !F && !G, q = 0; q < E.length; q++) {
                    for (k = E[q], y = f.createElement("div"), y.style.cssText = "display:block;text-align:" + Q + ";position:" + (H ? "absolute;" : "relative;"), X && (y.className = X + (W ? q + 1 : "")), aa.push(y), j = k.length, t = 0; j > t; t++) "BR" !== k[t].nodeName && (w = k[t], y.appendChild(w), B && (w._wordEnd || F) && y.appendChild(f.createTextNode(" ")), H && (0 === t && (y.style.top = w._y + "px", y.style.left = L + x + "px"), w.style.top = "0px", x && (w.style.left = w._x - x + "px")));
                    0 === j && (y.innerHTML = "&nbsp;"), F || G || (y.innerHTML = e(y).split(String.fromCharCode(160)).join(" ")), H && (y.style.width = A, y.style.height = w._h + "px"), a.appendChild(y)
                }
                a.style.cssText = z
            }
            H && (R > a.clientHeight && (a.style.height = R - O + "px", a.clientHeight < R && (a.style.height = R + M + "px")), S > a.clientWidth && (a.style.width = S - P + "px", a.clientWidth < S && (a.style.width = S + N + "px"))), s(c, $), s(d, _), s(h, aa)
        },
        u = q.prototype;
    u.split = function(a) {
        this.isSplit && this.revert(), this.vars = a || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
        for (var b = this.elements.length; --b > -1;) this._originals[b] = this.elements[b].innerHTML, t(this.elements[b], this.vars, this.chars, this.words, this.lines);
        return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this
    }, u.revert = function() {
        if (!this._originals) throw "revert() call wasn't scoped properly.";
        for (var a = this._originals.length; --a > -1;) this.elements[a].innerHTML = this._originals[a];
        return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this
    }, q.selector = a.$ || a.jQuery || function(b) {
        var c = a.$ || a.jQuery;
        return c ? (q.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b)
    }, q.version = "0.3.4"
}(_gsScope),
function(a) {
    "use strict";
    var b = function() {
        return (_gsScope.GreenSockGlobals || _gsScope)[a]
    };
    "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (module.exports = b())
}("SplitText");

try {
    window.GreenSockGlobals = null;
    window._gsQueue = null;
    window._gsDefine = null;

    delete(window.GreenSockGlobals);
    delete(window._gsQueue);
    delete(window._gsDefine);
} catch (e) {}

try {
    window.GreenSockGlobals = oldgs;
    window._gsQueue = oldgs_queue;
} catch (e) {}

if (window.tplogs == true)
    try {
        console.groupEnd();
    } catch (e) {}

(function(e, t) {
    e.waitForImages = {
        hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage"]
    };
    e.expr[":"].uncached = function(t) {
        var n = document.createElement("img");
        n.src = t.src;
        return e(t).is('img[src!=""]') && !n.complete
    };
    e.fn.waitForImages = function(t, n, r) {
        if (e.isPlainObject(arguments[0])) {
            n = t.each;
            r = t.waitForAll;
            t = t.finished
        }
        t = t || e.noop;
        n = n || e.noop;
        r = !!r;
        if (!e.isFunction(t) || !e.isFunction(n)) {
            throw new TypeError("An invalid callback was supplied.")
        }
        return this.each(function() {
            var i = e(this),
                s = [];
            if (r) {
                var o = e.waitForImages.hasImageProperties || [],
                    u = /url\((['"]?)(.*?)\1\)/g;
                i.find("*").each(function() {
                    var t = e(this);
                    if (t.is("img:uncached")) {
                        s.push({
                            src: t.attr("src"),
                            element: t[0]
                        })
                    }
                    e.each(o, function(e, n) {
                        var r = t.css(n);
                        if (!r) {
                            return true
                        }
                        var i;
                        while (i = u.exec(r)) {
                            s.push({
                                src: i[2],
                                element: t[0]
                            })
                        }
                    })
                })
            } else {
                i.find("img:uncached").each(function() {
                    s.push({
                        src: this.src,
                        element: this
                    })
                })
            }
            var f = s.length,
                l = 0;
            if (f == 0) {
                t.call(i[0])
            }
            e.each(s, function(r, s) {
                var o = new Image;
                e(o).bind("load error", function(e) {
                    l++;
                    n.call(s.element, l, f, e.type == "load");
                    if (l == f) {
                        t.call(i[0]);
                        return false
                    }
                });
                o.src = s.src
            })
        })
    };
})(jQuery)

/**************************************************************************
 * jquery.themepunch.revolution.js - jQuery Plugin for Revolution Slider
 * @version: 5.2.5 (13.04.2016)
 * @requires jQuery v1.7 or later (tested on 1.9)
 * @author ThemePunch
 **************************************************************************/
! function(jQuery, undefined) {
    "use strict";
    jQuery.fn.extend({
        revolution: function(e) {
            var t = {
                delay: 9e3,
                responsiveLevels: 4064,
                visibilityLevels: [2048, 1024, 778, 480],
                gridwidth: 960,
                gridheight: 500,
                minHeight: 0,
                autoHeight: "off",
                sliderType: "standard",
                sliderLayout: "auto",
                fullScreenAutoWidth: "off",
                fullScreenAlignForce: "off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "0",
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLimit: 0,
                hideSliderAtLimit: 0,
                disableProgressBar: "off",
                stopAtSlide: -1,
                stopAfterLoops: -1,
                shadow: 0,
                dottedOverlay: "none",
                startDelay: 0,
                lazyType: "smart",
                spinner: "spinner0",
                shuffle: "off",
                viewPort: {
                    enable: !1,
                    outof: "wait",
                    visible_area: "60%"
                },
                fallbacks: {
                    isJoomla: !1,
                    panZoomDisableOnMobile: "off",
                    simplifyAll: "on",
                    nextSlideOnWindowFocus: "off",
                    disableFocusListener: !0
                },
                parallax: {
                    type: "off",
                    levels: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
                    origo: "enterpoint",
                    speed: 400,
                    bgparallax: "off",
                    opacity: "on",
                    disable_onmobile: "off",
                    ddd_shadow: "on",
                    ddd_bgfreeze: "off",
                    ddd_overflow: "visible",
                    ddd_layer_overflow: "visible",
                    ddd_z_correction: 65,
                    ddd_path: "mouse"
                },
                carousel: {
                    horizontal_align: "center",
                    vertical_align: "center",
                    infinity: "on",
                    space: 0,
                    maxVisibleItems: 3,
                    stretch: "off",
                    fadeout: "on",
                    maxRotation: 0,
                    minScale: 0,
                    vary_fade: "off",
                    vary_rotation: "on",
                    vary_scale: "off",
                    border_radius: "0px",
                    padding_top: 0,
                    padding_bottom: 0
                },
                navigation: {
                    keyboardNavigation: "off",
                    keyboard_direction: "horizontal",
                    mouseScrollNavigation: "off",
                    onHoverStop: "on",
                    touch: {
                        touchenabled: "off",
                        swipe_treshold: 75,
                        swipe_min_touches: 1,
                        drag_block_vertical: !1,
                        swipe_direction: "horizontal"
                    },
                    arrows: {
                        style: "",
                        enable: !1,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        tmp: "",
                        rtl: !1,
                        left: {
                            h_align: "left",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0,
                            container: "slider"
                        },
                        right: {
                            h_align: "right",
                            v_align: "center",
                            h_offset: 20,
                            v_offset: 0,
                            container: "slider"
                        }
                    },
                    bullets: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        h_align: "left",
                        v_align: "center",
                        space: 0,
                        h_offset: 20,
                        v_offset: 0,
                        tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
                    },
                    thumbnails: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        width: 100,
                        height: 50,
                        min_width: 100,
                        wrapper_padding: 2,
                        wrapper_color: "#f5f5f5",
                        wrapper_opacity: 1,
                        tmp: '<span class="tp-thumb-image"></span><span class="tp-thumb-title"></span>',
                        visibleAmount: 5,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        span: !1,
                        position: "inner",
                        space: 2,
                        h_align: "left",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    },
                    tabs: {
                        container: "slider",
                        rtl: !1,
                        style: "",
                        enable: !1,
                        width: 100,
                        min_width: 100,
                        height: 50,
                        wrapper_padding: 10,
                        wrapper_color: "#f5f5f5",
                        wrapper_opacity: 1,
                        tmp: '<span class="tp-tab-image"></span>',
                        visibleAmount: 5,
                        hide_onmobile: !1,
                        hide_onleave: !0,
                        hide_delay: 200,
                        hide_delay_mobile: 1200,
                        hide_under: 0,
                        hide_over: 9999,
                        direction: "horizontal",
                        span: !1,
                        space: 0,
                        position: "inner",
                        h_align: "left",
                        v_align: "center",
                        h_offset: 20,
                        v_offset: 0
                    }
                },
                extensions: "extensions/",
                extensions_suffix: ".min.js",
                debugMode: !1
            };
            return e = jQuery.extend(!0, {}, t, e), this.each(function() {
                var t = jQuery(this);
                e.minHeight = e.minHeight != undefined ? parseInt(e.minHeight, 0) : e.minHeight, "hero" == e.sliderType && t.find(">ul>li").each(function(e) {
                    e > 0 && jQuery(this).remove()
                }), e.jsFileLocation = e.jsFileLocation || getScriptLocation("themepunch.revolution.min.js"), e.jsFileLocation = e.jsFileLocation + e.extensions, e.scriptsneeded = getNeededScripts(e, t), e.curWinRange = 0, e.rtl = !0, e.navigation != undefined && e.navigation.touch != undefined && (e.navigation.touch.swipe_min_touches = e.navigation.touch.swipe_min_touches > 5 ? 1 : e.navigation.touch.swipe_min_touches), jQuery(this).on("scriptsloaded", function() {
                    return e.modulesfailing ? (t.html('<div style="margin:auto;line-height:40px;font-size:14px;color:#fff;padding:15px;background:#e74c3c;margin:20px 0px;">!! Error at loading Slider Revolution 5.0 Extrensions.' + e.errorm + "</div>").show(), !1) : (_R.migration != undefined && (e = _R.migration(t, e)), punchgs.force3D = !0, "on" !== e.simplifyAll && punchgs.TweenLite.lagSmoothing(1e3, 16), prepareOptions(t, e), void initSlider(t, e))
                }), t.data("opt", e), waitForScripts(t, e)
            })
        },
        revremoveslide: function(e) {
            return this.each(function() {
                var t = jQuery(this);
                if (t != undefined && t.length > 0 && jQuery("body").find("#" + t.attr("id")).length > 0) {
                    var i = t.parent().find(".tp-bannertimer"),
                        n = i.data("opt");
                    if (n && n.li.length > 0 && (e > 0 || e <= n.li.length)) {
                        var a = jQuery(n.li[e]),
                            r = a.data("index"),
                            o = !1;
                        n.slideamount = n.slideamount - 1, removeNavWithLiref(".tp-bullet", r, n), removeNavWithLiref(".tp-tab", r, n), removeNavWithLiref(".tp-thumb", r, n), a.hasClass("active-revslide") && (o = !0), a.remove(), n.li = removeArray(n.li, e), n.carousel && n.carousel.slides && (n.carousel.slides = removeArray(n.carousel.slides, e)), n.thumbs = removeArray(n.thumbs, e), _R.updateNavIndexes && _R.updateNavIndexes(n), o && t.revnext(), punchgs.TweenLite.set(n.li, {
                            minWidth: "99%"
                        }), punchgs.TweenLite.set(n.li, {
                            minWidth: "100%"
                        })
                    }
                }
            })
        },
        revaddcallback: function(e) {
            return this.each(function() {
                var t = jQuery(this);
                if (t != undefined && t.length > 0 && jQuery("body").find("#" + t.attr("id")).length > 0) {
                    var i = t.parent().find(".tp-bannertimer"),
                        n = i.data("opt");
                    n.callBackArray === undefined && (n.callBackArray = new Array), n.callBackArray.push(e)
                }
            })
        },
        revgetparallaxproc: function() {
            var e = jQuery(this);
            if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                var t = e.parent().find(".tp-bannertimer"),
                    i = t.data("opt");
                return i.scrollproc
            }
        },
        revdebugmode: function() {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    i.debugMode = !0, containerResized(e, i)
                }
            })
        },
        revscroll: function(e) {
            return this.each(function() {
                var t = jQuery(this);
                t != undefined && t.length > 0 && jQuery("body").find("#" + t.attr("id")).length > 0 && jQuery("body,html").animate({
                    scrollTop: t.offset().top + t.height() - e + "px"
                }, {
                    duration: 400
                })
            })
        },
        revredraw: function(e) {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    containerResized(e, i)
                }
            })
        },
        revkill: function(e) {
            var t = this,
                i = jQuery(this);
            if (punchgs.TweenLite.killDelayedCallsTo(_R.showHideNavElements), _R.endMoveCaption && a.endtimeouts && a.endtimeouts.length > 0 && jQuery.each(a.endtimeouts, function(e, t) {
                    clearTimeout(t)
                }), i != undefined && i.length > 0 && jQuery("body").find("#" + i.attr("id")).length > 0) {
                i.data("conthover", 1), i.data("conthover-changed", 1), i.trigger("revolution.slide.onpause");
                var n = i.parent().find(".tp-bannertimer"),
                    a = n.data("opt");
                a.tonpause = !0, i.trigger("stoptimer"), punchgs.TweenLite.killTweensOf(i.find("*"), !1), punchgs.TweenLite.killTweensOf(i, !1), i.unbind("hover, mouseover, mouseenter,mouseleave, resize");
                var r = "resize.revslider-" + i.attr("id");
                jQuery(window).off(r), i.find("*").each(function() {
                    var e = jQuery(this);
                    e.unbind("on, hover, mouseenter,mouseleave,mouseover, resize,restarttimer, stoptimer"), e.off("on, hover, mouseenter,mouseleave,mouseover, resize"), e.data("mySplitText", null), e.data("ctl", null), e.data("tween") != undefined && e.data("tween").kill(), e.data("kenburn") != undefined && e.data("kenburn").kill(), e.data("timeline_out") != undefined && e.data("timeline_out").kill(), e.data("timeline") != undefined && e.data("timeline").kill(), e.remove(), e.empty(), e = null
                }), punchgs.TweenLite.killTweensOf(i.find("*"), !1), punchgs.TweenLite.killTweensOf(i, !1), n.remove();
                try {
                    i.closest(".forcefullwidth_wrapper_tp_banner").remove()
                } catch (o) {}
                try {
                    i.closest(".rev_slider_wrapper").remove()
                } catch (o) {}
                try {
                    i.remove()
                } catch (o) {}
                return i.empty(), i.html(), i = null, a = null, delete t.c, delete t.opt, !0
            }
            return !1
        },
        revpause: function() {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    e.data("conthover", 1), e.data("conthover-changed", 1), e.trigger("revolution.slide.onpause");
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    i.tonpause = !0, e.trigger("stoptimer")
                }
            })
        },
        revresume: function() {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    e.data("conthover", 0), e.data("conthover-changed", 1), e.trigger("revolution.slide.onresume");
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    i.tonpause = !1, e.trigger("starttimer")
                }
            })
        },
        revstart: function() {
            var e = jQuery(this);
            return e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0 && e.data("opt") ? e.data("opt").sliderisrunning ? (console.log("Slider Is Running Already"), !1) : (runSlider(e, e.data("opt")), !0) : void 0
        },
        revnext: function() {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    _R.callingNewSlide(i, e, 1)
                }
            })
        },
        revprev: function() {
            return this.each(function() {
                var e = jQuery(this);
                if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                    var t = e.parent().find(".tp-bannertimer"),
                        i = t.data("opt");
                    _R.callingNewSlide(i, e, -1)
                }
            })
        },
        revmaxslide: function() {
            return jQuery(this).find(".tp-revslider-mainul >li").length
        },
        revcurrentslide: function() {
            var e = jQuery(this);
            if (e != undefined && e.length > 0 && jQuery("body").find("#" + e.attr("id")).length > 0) {
                var t = e.parent().find(".tp-bannertimer"),
                    i = t.data("opt");
                return parseInt(i.act, 0) + 1
            }
        },
        revlastslide: function() {
            return jQuery(this).find(".tp-revslider-mainul >li").length
        },
        revshowslide: function(e) {
            return this.each(function() {
                var t = jQuery(this);
                if (t != undefined && t.length > 0 && jQuery("body").find("#" + t.attr("id")).length > 0) {
                    var i = t.parent().find(".tp-bannertimer"),
                        n = i.data("opt");
                    _R.callingNewSlide(n, t, "to" + (e - 1))
                }
            })
        },
        revcallslidewithid: function(e) {
            return this.each(function() {
                var t = jQuery(this);
                if (t != undefined && t.length > 0 && jQuery("body").find("#" + t.attr("id")).length > 0) {
                    var i = t.parent().find(".tp-bannertimer"),
                        n = i.data("opt");
                    _R.callingNewSlide(n, t, e)
                }
            })
        }
    });
    var _R = jQuery.fn.revolution;
    jQuery.extend(!0, _R, {
        simp: function(e, t, i) {
            var n = Math.abs(e) - Math.floor(Math.abs(e / t)) * t;
            return i ? n : 0 > e ? -1 * n : n
        },
        iOSVersion: function() {
            var e = !1;
            return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ? navigator.userAgent.match(/OS 4_\d like Mac OS X/i) && (e = !0) : e = !1, e
        },
        isIE: function(e, t) {
            var i = jQuery('<div style="display:none;"/>').appendTo(jQuery("body"));
            i.html("<!--[if " + (t || "") + " IE " + (e || "") + "]><a>&nbsp;</a><![endif]-->");
            var n = i.find("a").length;
            return i.remove(), n
        },
        is_mobile: function() {
            var e = ["android", "webos", "iphone", "ipad", "blackberry", "Android", "webos", , "iPod", "iPhone", "iPad", "Blackberry", "BlackBerry"],
                t = !1;
            for (var i in e) navigator.userAgent.split(e[i]).length > 1 && (t = !0);
            return t
        },
        callBackHandling: function(e, t, i) {
            try {
                e.callBackArray && jQuery.each(e.callBackArray, function(e, n) {
                    n && n.inmodule && n.inmodule === t && n.atposition && n.atposition === i && n.callback && n.callback.call()
                })
            } catch (n) {
                console.log("Call Back Failed")
            }
        },
        get_browser: function() {
            var e, t = navigator.appName,
                i = navigator.userAgent,
                n = i.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            return n && null != (e = i.match(/version\/([\.\d]+)/i)) && (n[2] = e[1]), n = n ? [n[1], n[2]] : [t, navigator.appVersion, "-?"], n[0]
        },
        get_browser_version: function() {
            var e, t = navigator.appName,
                i = navigator.userAgent,
                n = i.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            return n && null != (e = i.match(/version\/([\.\d]+)/i)) && (n[2] = e[1]), n = n ? [n[1], n[2]] : [t, navigator.appVersion, "-?"], n[1]
        },
        getHorizontalOffset: function(e, t) {
            var i = gWiderOut(e, ".outer-left"),
                n = gWiderOut(e, ".outer-right");
            switch (t) {
                case "left":
                    return i;
                case "right":
                    return n;
                case "both":
                    return i + n
            }
        },
        callingNewSlide: function(e, t, i) {
            var n = t.find(".next-revslide").length > 0 ? t.find(".next-revslide").index() : t.find(".processing-revslide").length > 0 ? t.find(".processing-revslide").index() : t.find(".active-revslide").index(),
                a = 0;
            t.find(".next-revslide").removeClass("next-revslide"), t.find(".active-revslide").hasClass("tp-invisible-slide") && (n = e.last_shown_slide), i && jQuery.isNumeric(i) || i.match(/to/g) ? (1 === i || -1 === i ? (a = n + i, a = 0 > a ? e.slideamount - 1 : a >= e.slideamount ? 0 : a) : (i = jQuery.isNumeric(i) ? i : parseInt(i.split("to")[1], 0), a = 0 > i ? 0 : i > e.slideamount - 1 ? e.slideamount - 1 : i), t.find(".tp-revslider-slidesli:eq(" + a + ")").addClass("next-revslide")) : i && t.find(".tp-revslider-slidesli").each(function() {
                var e = jQuery(this);
                e.data("index") === i && e.addClass("next-revslide")
            }), a = t.find(".next-revslide").index(), t.trigger("revolution.nextslide.waiting"), a !== n && -1 != a ? swapSlide(t, e) : t.find(".next-revslide").removeClass("next-revslide")
        },
        slotSize: function(e, t) {
            t.slotw = Math.ceil(t.width / t.slots), "fullscreen" == t.sliderLayout ? t.sloth = Math.ceil(jQuery(window).height() / t.slots) : t.sloth = Math.ceil(t.height / t.slots), "on" == t.autoHeight && e !== undefined && "" !== e && (t.sloth = Math.ceil(e.height() / t.slots))
        },
        setSize: function(e) {
            var t = (e.top_outer || 0) + (e.bottom_outer || 0),
                i = parseInt(e.carousel.padding_top || 0, 0),
                n = parseInt(e.carousel.padding_bottom || 0, 0),
                a = e.gridheight[e.curWinRange];
            if (e.paddings = e.paddings === undefined ? {
                    top: parseInt(e.c.parent().css("paddingTop"), 0) || 0,
                    bottom: parseInt(e.c.parent().css("paddingBottom"), 0) || 0
                } : e.paddings, a = a < e.minHeight ? e.minHeight : a, "fullwidth" == e.sliderLayout && "off" == e.autoHeight && punchgs.TweenLite.set(e.c, {
                    maxHeight: a + "px"
                }), e.c.css({
                    marginTop: i,
                    marginBottom: n
                }), e.width = e.ul.width(), e.height = e.ul.height(), setScale(e), e.height = Math.round(e.gridheight[e.curWinRange] * (e.width / e.gridwidth[e.curWinRange])), e.height > e.gridheight[e.curWinRange] && "on" != e.autoHeight && (e.height = e.gridheight[e.curWinRange]), "fullscreen" == e.sliderLayout || e.infullscreenmode) {
                e.height = e.bw * e.gridheight[e.curWinRange];
                var r = (e.c.parent().width(), jQuery(window).height());
                if (e.fullScreenOffsetContainer != undefined) {
                    try {
                        var o = e.fullScreenOffsetContainer.split(",");
                        o && jQuery.each(o, function(e, t) {
                            r = jQuery(t).length > 0 ? r - jQuery(t).outerHeight(!0) : r
                        })
                    } catch (s) {}
                    try {
                        e.fullScreenOffset.split("%").length > 1 && e.fullScreenOffset != undefined && e.fullScreenOffset.length > 0 ? r -= jQuery(window).height() * parseInt(e.fullScreenOffset, 0) / 100 : e.fullScreenOffset != undefined && e.fullScreenOffset.length > 0 && (r -= parseInt(e.fullScreenOffset, 0))
                    } catch (s) {}
                }
                r = r < e.minHeight ? e.minHeight : r, r -= t, e.c.parent().height(r), e.c.closest(".rev_slider_wrapper").height(r), e.c.css({
                    height: "100%"
                }), e.height = r, e.minHeight != undefined && e.height < e.minHeight && (e.height = e.minHeight)
            } else e.minHeight != undefined && e.height < e.minHeight && (e.height = e.minHeight), e.c.height(e.height);
            var d = {
                height: i + n + t + e.height + e.paddings.top + e.paddings.bottom
            };
            e.c.closest(".forcefullwidth_wrapper_tp_banner").find(".tp-fullwidth-forcer").css(d), e.c.closest(".rev_slider_wrapper").css(d), setScale(e)
        },
        enterInViewPort: function(e) {
            e.waitForCountDown && (countDown(e.c, e), e.waitForCountDown = !1), e.waitForFirstSlide && (swapSlide(e.c, e), e.waitForFirstSlide = !1), ("playing" == e.sliderlaststatus || e.sliderlaststatus == undefined) && e.c.trigger("starttimer"), e.lastplayedvideos != undefined && e.lastplayedvideos.length > 0 && jQuery.each(e.lastplayedvideos, function(t, i) {
                _R.playVideo(i, e)
            })
        },
        leaveViewPort: function(e) {
            e.sliderlaststatus = e.sliderstatus, e.c.trigger("stoptimer"), e.playingvideos != undefined && e.playingvideos.length > 0 && (e.lastplayedvideos = jQuery.extend(!0, [], e.playingvideos), e.playingvideos && jQuery.each(e.playingvideos, function(t, i) {
                e.leaveViewPortBasedStop = !0, _R.stopVideo && _R.stopVideo(i, e)
            }))
        },
        unToggleState: function(e) {
            e != undefined && e.length > 0 && jQuery.each(e, function(e, t) {
                t.removeClass("rs-toggle-content-active")
            })
        },
        toggleState: function(e) {
            e != undefined && e.length > 0 && jQuery.each(e, function(e, t) {
                t.addClass("rs-toggle-content-active")
            })
        },
        lastToggleState: function(e) {
            var t = 0;
            return e != undefined && e.length > 0 && jQuery.each(e, function(e, i) {
                t = i.hasClass("rs-toggle-content-active")
            }), t
        }
    });
    var _ISM = _R.is_mobile(),
        removeArray = function(e, t) {
            var i = [];
            return jQuery.each(e, function(e, n) {
                e != t && i.push(n)
            }), i
        },
        removeNavWithLiref = function(e, t, i) {
            i.c.find(e).each(function() {
                var e = jQuery(this);
                e.data("liref") === t && e.remove()
            })
        },
        lAjax = function(e, t) {
            return jQuery("body").data(e) ? !1 : t.filesystem ? (t.errorm === undefined && (t.errorm = "<br>Local Filesystem Detected !<br>Put this to your header:"), console.warn("Local Filesystem detected !"), t.errorm = t.errorm + '<br>&lt;script type="text/javascript" src="' + t.jsFileLocation + e + t.extensions_suffix + '"&gt;&lt;/script&gt;', console.warn(t.jsFileLocation + e + t.extensions_suffix + " could not be loaded !"), console.warn("Please use a local Server or work online or make sure that you load all needed Libraries manually in your Document."), console.log(" "), t.modulesfailing = !0, !1) : (jQuery.ajax({
                url: t.jsFileLocation + e + t.extensions_suffix,
                dataType: "script",
                cache: !0,
                error: function(i) {
                    console.warn("Slider Revolution 5.0 Error !"), console.error("Failure at Loading:" + e + t.extensions_suffix + " on Path:" + t.jsFileLocation), console.info(i)
                }
            }), void jQuery("body").data(e, !0))
        },
        getNeededScripts = function(e, t) {
            var i = new Object,
                n = e.navigation;
            return i.kenburns = !1, i.parallax = !1, i.carousel = !1, i.navigation = !1, i.videos = !1, i.actions = !1, i.layeranim = !1, i.migration = !1, t.data("version") && t.data("version").toString().match(/5./gi) ? (t.find("img").each(function() {
                "on" == jQuery(this).data("kenburns") && (i.kenburns = !0)
            }), ("carousel" == e.sliderType || "on" == n.keyboardNavigation || "on" == n.mouseScrollNavigation || "on" == n.touch.touchenabled || n.arrows.enable || n.bullets.enable || n.thumbnails.enable || n.tabs.enable) && (i.navigation = !0), t.find(".tp-caption, .tp-static-layer, .rs-background-video-layer").each(function() {
                var e = jQuery(this);
                (e.data("ytid") != undefined || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("youtube") > 0) && (i.videos = !0), (e.data("vimeoid") != undefined || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("vimeo") > 0) && (i.videos = !0), e.data("actions") !== undefined && (i.actions = !0), i.layeranim = !0
            }), t.find("li").each(function() {
                jQuery(this).data("link") && jQuery(this).data("link") != undefined && (i.layeranim = !0, i.actions = !0)
            }), !i.videos && (t.find(".rs-background-video-layer").length > 0 || t.find(".tp-videolayer").length > 0 || t.find(".tp-audiolayer") || t.find("iframe").length > 0 || t.find("video").length > 0) && (i.videos = !0), "carousel" == e.sliderType && (i.carousel = !0), ("off" !== e.parallax.type || e.viewPort.enable || "true" == e.viewPort.enable) && (i.parallax = !0)) : (i.kenburns = !0, i.parallax = !0, i.carousel = !1, i.navigation = !0, i.videos = !0, i.actions = !0, i.layeranim = !0, i.migration = !0), "hero" == e.sliderType && (i.carousel = !1, i.navigation = !1), window.location.href.match(/file:/gi) && (i.filesystem = !0, e.filesystem = !0), i.videos && "undefined" == typeof _R.isVideoPlaying && lAjax("revolution.extension.video", e), i.carousel && "undefined" == typeof _R.prepareCarousel && lAjax("revolution.extension.carousel", e), i.carousel || "undefined" != typeof _R.animateSlide || lAjax("revolution.extension.slideanims", e), i.actions && "undefined" == typeof _R.checkActions && lAjax("revolution.extension.actions", e), i.layeranim && "undefined" == typeof _R.handleStaticLayers && lAjax("revolution.extension.layeranimation", e), i.kenburns && "undefined" == typeof _R.stopKenBurn && lAjax("revolution.extension.kenburn", e), i.navigation && "undefined" == typeof _R.createNavigation && lAjax("revolution.extension.navigation", e), i.migration && "undefined" == typeof _R.migration && lAjax("revolution.extension.migration", e), i.parallax && "undefined" == typeof _R.checkForParallax && lAjax("revolution.extension.parallax", e), e.addons != undefined && e.addons.length > 0 && jQuery.each(e.addons, function(t, i) {
                "object" == typeof i && i.fileprefix != undefined && lAjax(i.fileprefix, e)
            }), i
        },
        waitForScripts = function(e, t) {
            var i = !0,
                n = t.scriptsneeded;
            t.addons != undefined && t.addons.length > 0 && jQuery.each(t.addons, function(e, t) {
                "object" == typeof t && t.init != undefined && _R[t.init] === undefined && (i = !1)
            }), n.filesystem || "undefined" != typeof punchgs && i && (!n.kenburns || n.kenburns && "undefined" != typeof _R.stopKenBurn) && (!n.navigation || n.navigation && "undefined" != typeof _R.createNavigation) && (!n.carousel || n.carousel && "undefined" != typeof _R.prepareCarousel) && (!n.videos || n.videos && "undefined" != typeof _R.resetVideo) && (!n.actions || n.actions && "undefined" != typeof _R.checkActions) && (!n.layeranim || n.layeranim && "undefined" != typeof _R.handleStaticLayers) && (!n.migration || n.migration && "undefined" != typeof _R.migration) && (!n.parallax || n.parallax && "undefined" != typeof _R.checkForParallax) && (n.carousel || !n.carousel && "undefined" != typeof _R.animateSlide) ? e.trigger("scriptsloaded") : setTimeout(function() {
                waitForScripts(e, t)
            }, 50)
        },
        getScriptLocation = function(e) {
            var t = new RegExp("themepunch.revolution.min.js", "gi"),
                i = "";
            return jQuery("script").each(function() {
                var e = jQuery(this).attr("src");
                e && e.match(t) && (i = e)
            }), i = i.replace("jquery.themepunch.revolution.min.js", ""), i = i.replace("jquery.themepunch.revolution.js", ""), i = i.split("?")[0]
        },
        setCurWinRange = function(e, t) {
            var i = 9999,
                n = 0,
                a = 0,
                r = 0,
                o = jQuery(window).width(),
                s = t && 9999 == e.responsiveLevels ? e.visibilityLevels : e.responsiveLevels;
            s && s.length && jQuery.each(s, function(e, t) {
                t > o && (0 == n || n > t) && (i = t, r = e, n = t), o > t && t > n && (n = t, a = e)
            }), i > n && (r = a), t ? e.forcedWinRange = r : e.curWinRange = r
        },
        prepareOptions = function(e, t) {
            t.carousel.maxVisibleItems = t.carousel.maxVisibleItems < 1 ? 999 : t.carousel.maxVisibleItems, t.carousel.vertical_align = "top" === t.carousel.vertical_align ? "0%" : "bottom" === t.carousel.vertical_align ? "100%" : "50%"
        },
        gWiderOut = function(e, t) {
            var i = 0;
            return e.find(t).each(function() {
                var e = jQuery(this);
                !e.hasClass("tp-forcenotvisible") && i < e.outerWidth() && (i = e.outerWidth())
            }), i
        },
        initSlider = function(container, opt) {
            return container == undefined ? !1 : (container.data("aimg") != undefined && ("enabled" == container.data("aie8") && _R.isIE(8) || "enabled" == container.data("amobile") && _ISM) && container.html('<img class="tp-slider-alternative-image" src="' + container.data("aimg") + '">'), container.find(">ul").addClass("tp-revslider-mainul"), opt.c = container, opt.ul = container.find(".tp-revslider-mainul"), opt.ul.find(">li").each(function(e) {
                var t = jQuery(this);
                "on" == t.data("hideslideonmobile") && _ISM && t.remove(), (t.data("invisible") || t.data("invisible") === !0) && (t.addClass("tp-invisible-slide"), t.appendTo(opt.ul))
            }), opt.addons != undefined && opt.addons.length > 0 && jQuery.each(opt.addons, function(i, obj) {
                "object" == typeof obj && obj.init != undefined && _R[obj.init](eval(obj.params))
            }), opt.cid = container.attr("id"), opt.ul.css({
                visibility: "visible"
            }), opt.slideamount = opt.ul.find(">li").not(".tp-invisible-slide").length, opt.slayers = container.find(".tp-static-layers"), void(1 != opt.waitForInit && (container.data("opt", opt), runSlider(container, opt))))
        },
        runSlider = function(e, t) {
            if (t.sliderisrunning = !0, t.ul.find(">li").each(function(e) {
                    jQuery(this).data("originalindex", e)
                }), "on" == t.shuffle) {
                var i = new Object,
                    n = t.ul.find(">li:first-child");
                i.fstransition = n.data("fstransition"), i.fsmasterspeed = n.data("fsmasterspeed"), i.fsslotamount = n.data("fsslotamount");
                for (var a = 0; a < t.slideamount; a++) {
                    var r = Math.round(Math.random() * t.slideamount);
                    t.ul.find(">li:eq(" + r + ")").prependTo(t.ul)
                }
                var o = t.ul.find(">li:first-child");
                o.data("fstransition", i.fstransition), o.data("fsmasterspeed", i.fsmasterspeed), o.data("fsslotamount", i.fsslotamount), t.li = t.ul.find(">li").not(".tp-invisible-slide")
            }
            if (t.allli = t.ul.find(">li"), t.li = t.ul.find(">li").not(".tp-invisible-slide"), t.inli = t.ul.find(">li.tp-invisible-slide"), t.thumbs = new Array, t.slots = 4, t.act = -1, t.firststart = 1, t.loadqueue = new Array, t.syncload = 0, t.conw = e.width(), t.conh = e.height(), t.responsiveLevels.length > 1 ? t.responsiveLevels[0] = 9999 : t.responsiveLevels = 9999, jQuery.each(t.allli, function(e, i) {
                    var i = jQuery(i),
                        n = i.find(".rev-slidebg") || i.find("img").first(),
                        a = 0;
                    i.addClass("tp-revslider-slidesli"), i.data("index") === undefined && i.data("index", "rs-" + Math.round(999999 * Math.random()));
                    var r = new Object;
                    r.params = new Array, r.id = i.data("index"), r.src = i.data("thumb") !== undefined ? i.data("thumb") : n.data("lazyload") !== undefined ? n.data("lazyload") : n.attr("src"), i.data("title") !== undefined && r.params.push({
                        from: RegExp("\\{\\{title\\}\\}", "g"),
                        to: i.data("title")
                    }), i.data("description") !== undefined && r.params.push({
                        from: RegExp("\\{\\{description\\}\\}", "g"),
                        to: i.data("description")
                    });
                    for (var a = 1; 10 >= a; a++) i.data("param" + a) !== undefined && r.params.push({
                        from: RegExp("\\{\\{param" + a + "\\}\\}", "g"),
                        to: i.data("param" + a)
                    });
                    if (t.thumbs.push(r), i.data("origindex", i.index()), i.data("link") != undefined) {
                        var o = i.data("link"),
                            s = i.data("target") || "_self",
                            d = "back" === i.data("slideindex") ? 0 : 60,
                            l = i.data("linktoslide"),
                            u = l;
                        l != undefined && "next" != l && "prev" != l && t.allli.each(function() {
                            var e = jQuery(this);
                            e.data("origindex") + 1 == u && (l = e.data("index"))
                        }), "slide" != o && (l = "no");
                        var c = '<div class="tp-caption slidelink" style="cursor:pointer;width:100%;height:100%;z-index:' + d + ';" data-x="center" data-y="center" data-basealign="slide" ',
                            p = "scroll_under" === l ? '[{"event":"click","action":"scrollbelow","offset":"100px","delay":"0"}]' : "prev" === l ? '[{"event":"click","action":"jumptoslide","slide":"prev","delay":"0.2"}]' : "next" === l ? '[{"event":"click","action":"jumptoslide","slide":"next","delay":"0.2"}]' : '[{"event":"click","action":"jumptoslide","slide":"' + l + '","delay":"0.2"}]';
                        c = "no" == l ? c + ' data-start="0">' : c + "data-actions='" + p + '\' data-start="0">', c += '<a style="width:100%;height:100%;display:block"', c = "slide" != o ? c + ' target="' + s + '" href="' + o + '"' : c, c += '><span style="width:100%;height:100%;display:block"></span></a></div>', i.append(c)
                    }
                }), t.rle = t.responsiveLevels.length || 1, t.gridwidth = cArray(t.gridwidth, t.rle), t.gridheight = cArray(t.gridheight, t.rle), "on" == t.simplifyAll && (_R.isIE(8) || _R.iOSVersion()) && (e.find(".tp-caption").each(function() {
                    var e = jQuery(this);
                    e.removeClass("customin customout").addClass("fadein fadeout"), e.data("splitin", ""), e.data("speed", 400)
                }), t.allli.each(function() {
                    var e = jQuery(this);
                    e.data("transition", "fade"), e.data("masterspeed", 500), e.data("slotamount", 1);
                    var t = e.find(".rev-slidebg") || e.find(">img").first();
                    t.data("kenburns", "off")
                })), t.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), t.autoHeight = "fullscreen" == t.sliderLayout ? "on" : t.autoHeight, "fullwidth" == t.sliderLayout && "off" == t.autoHeight && e.css({
                    maxHeight: t.gridheight[t.curWinRange] + "px"
                }), "auto" != t.sliderLayout && 0 == e.closest(".forcefullwidth_wrapper_tp_banner").length && ("fullscreen" !== t.sliderLayout || "on" != t.fullScreenAutoWidth)) {
                var s = e.parent(),
                    d = s.css("marginBottom"),
                    l = s.css("marginTop"),
                    u = e.attr("id") + "_forcefullwidth";
                d = d === undefined ? 0 : d, l = l === undefined ? 0 : l, s.wrap('<div class="forcefullwidth_wrapper_tp_banner" id="' + u + '" style="position:relative;width:100%;height:auto;margin-top:' + l + ";margin-bottom:" + d + '"></div>'), e.closest(".forcefullwidth_wrapper_tp_banner").append('<div class="tp-fullwidth-forcer" style="width:100%;height:' + e.height() + 'px"></div>'), e.parent().css({
                    marginTop: "0px",
                    marginBottom: "0px"
                }), e.parent().css({
                    position: "absolute"
                })
            }
            if (t.shadow !== undefined && t.shadow > 0 && (e.parent().addClass("tp-shadow" + t.shadow), e.parent().append('<div class="tp-shadowcover"></div>'), e.parent().find(".tp-shadowcover").css({
                    backgroundColor: e.parent().css("backgroundColor"),
                    backgroundImage: e.parent().css("backgroundImage")
                })), setCurWinRange(t), setCurWinRange(t, !0), !e.hasClass("revslider-initialised")) {
                e.addClass("revslider-initialised"), e.addClass("tp-simpleresponsive"), e.attr("id") == undefined && e.attr("id", "revslider-" + Math.round(1e3 * Math.random() + 5)), t.firefox13 = !1, t.ie = !jQuery.support.opacity, t.ie9 = 9 == document.documentMode, t.origcd = t.delay;
                var c = jQuery.fn.jquery.split("."),
                    p = parseFloat(c[0]),
                    f = parseFloat(c[1]);
                parseFloat(c[2] || "0");
                1 == p && 7 > f && e.html('<div style="text-align:center; padding:40px 0px; font-size:20px; color:#992222;"> The Current Version of jQuery:' + c + " <br>Please update your jQuery Version to min. 1.7 in Case you wish to use the Revolution Slider Plugin</div>"), p > 1 && (t.ie = !1);
                var h = new Object;
                h.addedyt = 0, h.addedvim = 0, h.addedvid = 0, e.find(".tp-caption, .rs-background-video-layer").each(function(e) {
                    var i = jQuery(this),
                        n = i.data("autoplayonlyfirsttime"),
                        a = i.data("autoplay"),
                        r = i.hasClass("tp-audiolayer"),
                        o = i.data("videoloop");
                    i.hasClass("tp-static-layer") && _R.handleStaticLayers && _R.handleStaticLayers(i, t);
                    var s = i.data("noposteronmobile") || i.data("noPosterOnMobile") || i.data("posteronmobile") || i.data("posterOnMobile") || i.data("posterOnMObile");
                    i.data("noposteronmobile", s);
                    var d = 0;
                    if (i.find("iframe").each(function() {
                            punchgs.TweenLite.set(jQuery(this), {
                                autoAlpha: 0
                            }), d++
                        }), d > 0 && i.data("iframes", !0), i.hasClass("tp-caption")) {
                        var l = i.hasClass("slidelink") ? "width:100% !important;height:100% !important;" : "";
                        i.wrap('<div class="tp-parallax-wrap" style="' + l + 'position:absolute;visibility:hidden"><div class="tp-loop-wrap" style="' + l + 'position:absolute;"><div class="tp-mask-wrap" style="' + l + 'position:absolute" ></div></div></div>');
                        var u = ["pendulum", "rotate", "slideloop", "pulse", "wave"],
                            c = i.closest(".tp-loop-wrap");
                        jQuery.each(u, function(e, t) {
                            var n = i.find(".rs-" + t),
                                a = n.data() || "";
                            "" != a && (c.data(a), c.addClass("rs-" + t), n.children(0).unwrap(), i.data("loopanimation", "on"))
                        }), punchgs.TweenLite.set(i, {
                            visibility: "hidden"
                        })
                    }
                    var p = i.data("actions");
                    p !== undefined && _R.checkActions(i, t, p), checkHoverDependencies(i, t), _R.checkVideoApis && (h = _R.checkVideoApis(i, t, h)), _ISM && ((1 == n || "true" == n) && (i.data("autoplayonlyfirsttime", "false"), n = !1), (1 == a || "true" == a || "on" == a || "1sttime" == a) && (i.data("autoplay", "off"), a = "off")), i.data("videoloop", o), r || 1 != n && "true" != n && "1sttime" != a || "loopandnoslidestop" == o || i.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-once"), r || 1 != a && "true" != a && "on" != a && "no1sttime" != a || "loopandnoslidestop" == o || i.closest("li.tp-revslider-slidesli").addClass("rs-pause-timer-always")
                }), e.hover(function() {
                    e.trigger("tp-mouseenter"), t.overcontainer = !0
                }, function() {
                    e.trigger("tp-mouseleft"), t.overcontainer = !1
                }), e.on("mouseover", function() {
                    e.trigger("tp-mouseover"), t.overcontainer = !0
                }), e.find(".tp-caption video").each(function(e) {
                    var t = jQuery(this);
                    t.removeClass("video-js vjs-default-skin"), t.attr("preload", ""), t.css({
                        display: "none"
                    })
                }), "standard" !== t.sliderType && (t.lazyType = "all"), loadImages(e.find(".tp-static-layers"), t, 0, !0), waitForCurrentImages(e.find(".tp-static-layers"), t, function() {
                    e.find(".tp-static-layers img").each(function() {
                        var e = jQuery(this),
                            i = e.data("lazyload") != undefined ? e.data("lazyload") : e.attr("src"),
                            n = getLoadObj(t, i);
                        e.attr("src", n.src)
                    })
                }), t.allli.each(function(e) {
                    var i = jQuery(this);
                    ("all" == t.lazyType || "smart" == t.lazyType && (0 == e || 1 == e || e == t.slideamount || e == t.slideamount - 1)) && (loadImages(i, t, e), waitForCurrentImages(i, t, function() {
                        "carousel" == t.sliderType && punchgs.TweenLite.to(i, 1, {
                            autoAlpha: 1,
                            ease: punchgs.Power3.easeInOut
                        })
                    }))
                });
                var g = getUrlVars("#")[0];
                if (g.length < 9 && g.split("slide").length > 1) {
                    var v = parseInt(g.split("slide")[1], 0);
                    1 > v && (v = 1), v > t.slideamount && (v = t.slideamount), t.startWithSlide = v - 1
                }
                e.append('<div class="tp-loader ' + t.spinner + '"><div class="dot1"></div><div class="dot2"></div><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'), 0 === e.find(".tp-bannertimer").length && e.append('<div class="tp-bannertimer" style="visibility:hidden"></div>'), e.find(".tp-bannertimer").css({
                    width: "0%"
                }), e.find(".tp-bannertimer").data("opt", t), t.ul.css({
                    display: "block"
                }), prepareSlides(e, t), "off" !== t.parallax.type && _R.checkForParallax && _R.checkForParallax(e, t), _R.setSize(t), "hero" !== t.sliderType && _R.createNavigation && _R.createNavigation(e, t), _R.resizeThumbsTabs && _R.resizeThumbsTabs && _R.resizeThumbsTabs(t), contWidthManager(t);
                var m = t.viewPort;
                t.inviewport = !1, m != undefined && m.enable && (jQuery.isNumeric(m.visible_area) || -1 !== m.visible_area.indexOf("%") && (m.visible_area = parseInt(m.visible_area) / 100), _R.scrollTicker && _R.scrollTicker(t, e)), setTimeout(function() {
                    "carousel" == t.sliderType && _R.prepareCarousel && _R.prepareCarousel(t), !m.enable || m.enable && t.inviewport || m.enable && !t.inviewport && "wait" == !m.outof ? swapSlide(e, t) : t.waitForFirstSlide = !0, _R.manageNavigation && _R.manageNavigation(t), t.slideamount > 1 && (!m.enable || m.enable && t.inviewport ? countDown(e, t) : t.waitForCountDown = !0), setTimeout(function() {
                        e.trigger("revolution.slide.onloaded")
                    }, 100)
                }, t.startDelay), t.startDelay = 0, jQuery("body").data("rs-fullScreenMode", !1), jQuery(window).on("mozfullscreenchange webkitfullscreenchange fullscreenchange", function() {
                    jQuery("body").data("rs-fullScreenMode", !jQuery("body").data("rs-fullScreenMode")), jQuery("body").data("rs-fullScreenMode") && setTimeout(function() {
                        jQuery(window).trigger("resize")
                    }, 200)
                });
                var y = "resize.revslider-" + e.attr("id");
                jQuery(window).on(y, function() {
                    return e == undefined ? !1 : (0 != jQuery("body").find(e) && contWidthManager(t), void((e.outerWidth(!0) != t.width || e.is(":hidden") || "fullscreen" == t.sliderLayout && jQuery(window).height() != t.lastwindowheight) && (t.lastwindowheight = jQuery(window).height(), containerResized(e, t))))
                }), hideSliderUnder(e, t), contWidthManager(t), t.fallbacks.disableFocusListener || "true" == t.fallbacks.disableFocusListener || t.fallbacks.disableFocusListener === !0 || tabBlurringCheck(e, t)
            }
        },
        cArray = function(e, t) {
            if (!jQuery.isArray(e)) {
                var i = e;
                e = new Array, e.push(i)
            }
            if (e.length < t)
                for (var i = e[e.length - 1], n = 0; n < t - e.length + 2; n++) e.push(i);
            return e
        },
        checkHoverDependencies = function(e, t) {
            "sliderenter" === e.data("start") && (t.layersonhover === undefined && (t.c.on("tp-mouseenter", function() {
                t.layersonhover && jQuery.each(t.layersonhover, function(e, i) {
                    i.data("animdirection", "in");
                    var n = i.data("timeline_out"),
                        a = "carousel" === t.sliderType ? 0 : t.width / 2 - t.gridwidth[t.curWinRange] * t.bw / 2,
                        r = 0,
                        o = i.closest(".tp-revslider-slidesli"),
                        s = i.closest(".tp-static-layers");
                    if (o.length > 0 && o.hasClass("active-revslide") || o.hasClass("processing-revslide") || s.length > 0) {
                        n != undefined && (n.pause(0), n.kill()), _R.animateSingleCaption(i, t, a, r, 0, !1, !0);
                        var d = i.data("timeline");
                        i.data("triggerstate", "on"), d.play(0)
                    }
                })
            }), t.c.on("tp-mouseleft", function() {
                t.layersonhover && jQuery.each(t.layersonhover, function(e, i) {
                    i.data("animdirection", "out"), i.data("triggered", !0), i.data("triggerstate", "off"), _R.stopVideo && _R.stopVideo(i, t), _R.endMoveCaption && _R.endMoveCaption(i, null, null, t)
                })
            }), t.layersonhover = new Array), t.layersonhover.push(e))
        },
        contWidthManager = function(e) {
            var t = _R.getHorizontalOffset(e.c, "left");
            if ("auto" == e.sliderLayout || "fullscreen" === e.sliderLayout && "on" == e.fullScreenAutoWidth) "fullscreen" == e.sliderLayout && "on" == e.fullScreenAutoWidth ? punchgs.TweenLite.set(e.ul, {
                left: 0,
                width: e.c.width()
            }) : punchgs.TweenLite.set(e.ul, {
                left: t,
                width: e.c.width() - _R.getHorizontalOffset(e.c, "both")
            });
            else {
                var i = Math.ceil(e.c.closest(".forcefullwidth_wrapper_tp_banner").offset().left - t);
                punchgs.TweenLite.set(e.c.parent(), {
                    left: 0 - i + "px",
                    width: jQuery(window).width() - _R.getHorizontalOffset(e.c, "both")
                })
            }
            e.slayers && "fullwidth" != e.sliderLayout && "fullscreen" != e.sliderLayout && punchgs.TweenLite.set(e.slayers, {
                left: t
            })
        },
        cv = function(e, t) {
            return e === undefined ? t : e
        },
        hideSliderUnder = function(e, t, i) {
            var n = e.parent();
            jQuery(window).width() < t.hideSliderAtLimit ? (e.trigger("stoptimer"), "none" != n.css("display") && n.data("olddisplay", n.css("display")), n.css({
                display: "none"
            })) : e.is(":hidden") && i && (n.data("olddisplay") != undefined && "undefined" != n.data("olddisplay") && "none" != n.data("olddisplay") ? n.css({
                display: n.data("olddisplay")
            }) : n.css({
                display: "block"
            }), e.trigger("restarttimer"), setTimeout(function() {
                containerResized(e, t)
            }, 150)), _R.hideUnHideNav && _R.hideUnHideNav(t)
        },
        containerResized = function(e, t) {
            if (1 == t.infullscreenmode && (t.minHeight = jQuery(window).height()), setCurWinRange(t), setCurWinRange(t, !0), !_R.resizeThumbsTabs || _R.resizeThumbsTabs(t) === !0) {
                if (hideSliderUnder(e, t, !0), contWidthManager(t), "carousel" == t.sliderType && _R.prepareCarousel(t, !0), e === undefined) return !1;
                _R.setSize(t), t.conw = t.c.width(), t.conh = t.infullscreenmode ? t.minHeight : t.c.height();
                var i = e.find(".active-revslide .slotholder"),
                    n = e.find(".processing-revslide .slotholder");
                removeSlots(e, t, e, 2), "standard" === t.sliderType && (punchgs.TweenLite.set(n.find(".defaultimg"), {
                    opacity: 0
                }), i.find(".defaultimg").css({
                    opacity: 1
                })), "carousel" == t.sliderType && t.lastconw != t.conw && (clearTimeout(t.pcartimer), t.pcartimer = setTimeout(function() {
                    _R.prepareCarousel(t, !0)
                }, 100), t.lastconw = t.conw), _R.manageNavigation && _R.manageNavigation(t), _R.animateTheCaptions && _R.animateTheCaptions(e.find(".active-revslide"), t, !0), "on" == n.data("kenburns") && _R.startKenBurn(n, t, n.data("kbtl").progress()), "on" == i.data("kenburns") && _R.startKenBurn(i, t, i.data("kbtl").progress()), _R.animateTheCaptions && _R.animateTheCaptions(n.closest("li"), t, !0), _R.manageNavigation && _R.manageNavigation(t)
            }
        },
        setScale = function(e) {
            e.bw = e.width / e.gridwidth[e.curWinRange], e.bh = e.height / e.gridheight[e.curWinRange], e.bh > e.bw ? e.bh = e.bw : e.bw = e.bh, (e.bh > 1 || e.bw > 1) && (e.bw = 1, e.bh = 1)
        },
        prepareSlides = function(e, t) {
            if (e.find(".tp-caption").each(function() {
                    var e = jQuery(this);
                    e.data("transition") !== undefined && e.addClass(e.data("transition"))
                }), t.ul.css({
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    maxHeight: e.parent().css("maxHeight")
                }), "on" == t.autoHeight && (t.ul.css({
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    maxHeight: "none"
                }), e.css({
                    maxHeight: "none"
                }), e.parent().css({
                    maxHeight: "none"
                })), t.allli.each(function(e) {
                    var i = jQuery(this),
                        n = i.data("originalindex");
                    (t.startWithSlide != undefined && n == t.startWithSlide || t.startWithSlide === undefined && 0 == e) && i.addClass("next-revslide"), i.css({
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                    })
                }), "carousel" === t.sliderType) {
                t.ul.css({
                    overflow: "visible"
                }).wrap('<div class="tp-carousel-wrapper" style="width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:hidden;"></div>');
                var i = '<div style="clear:both;display:block;width:100%;height:1px;position:relative;margin-bottom:-1px"></div>';
                t.c.parent().prepend(i), t.c.parent().append(i), _R.prepareCarousel(t)
            }
            e.parent().css({
                overflow: "visible"
            }), t.allli.find(">img").each(function(e) {
                var i = jQuery(this),
                    n = i.closest("li").find(".rs-background-video-layer");
                n.addClass("defaultvid").css({
                    zIndex: 30
                }), i.addClass("defaultimg"), "on" == t.fallbacks.panZoomDisableOnMobile && _ISM && (i.data("kenburns", "off"), i.data("bgfit", "cover")), i.wrap('<div class="slotholder" style="position:absolute; top:0px; left:0px; z-index:0;width:100%;height:100%;"></div>'), n.appendTo(i.closest("li").find(".slotholder"));
                var a = i.data();
                i.closest(".slotholder").data(a), n.length > 0 && a.bgparallax != undefined && n.data("bgparallax", a.bgparallax), "none" != t.dottedOverlay && t.dottedOverlay != undefined && i.closest(".slotholder").append('<div class="tp-dottedoverlay ' + t.dottedOverlay + '"></div>');
                var r = i.attr("src");
                a.src = r, a.bgfit = a.bgfit || "cover", a.bgrepeat = a.bgrepeat || "no-repeat", a.bgposition = a.bgposition || "center center";
                var o = i.closest(".slotholder");
                i.parent().append('<div class="tp-bgimg defaultimg" style="background-color:' + i.css("backgroundColor") + ";background-repeat:" + a.bgrepeat + ";background-image:url(" + r + ");background-size:" + a.bgfit + ";background-position:" + a.bgposition + ';width:100%;height:100%;"></div>');
                var s = document.createComment("Runtime Modification - Img tag is Still Available for SEO Goals in Source - " + i.get(0).outerHTML);
                i.replaceWith(s), i = o.find(".tp-bgimg"), i.data(a), i.attr("src", r), ("standard" === t.sliderType || "undefined" === t.sliderType) && i.css({
                    opacity: 0
                })
            })
        },
        removeSlots = function(e, t, i, n) {
            t.removePrepare = t.removePrepare + n, i.find(".slot, .slot-circle-wrapper").each(function() {
                jQuery(this).remove()
            }), t.transition = 0, t.removePrepare = 0
        },
        cutParams = function(e) {
            var t = e;
            return e != undefined && e.length > 0 && (t = e.split("?")[0]), t
        },
        relativeRedir = function(e) {
            return location.pathname.replace(/(.*)\/[^\/]*/, "$1/" + e)
        },
        abstorel = function(e, t) {
            var i = e.split("/"),
                n = t.split("/");
            i.pop();
            for (var a = 0; a < n.length; a++) "." != n[a] && (".." == n[a] ? i.pop() : i.push(n[a]));
            return i.join("/")
        },
        imgLoaded = function(e, t, i) {
            t.syncload--, t.loadqueue && jQuery.each(t.loadqueue, function(t, n) {
                var a = n.src.replace(/\.\.\/\.\.\//gi, ""),
                    r = self.location.href,
                    o = document.location.origin,
                    s = r.substring(0, r.length - 1) + "/" + a,
                    d = o + "/" + a,
                    l = abstorel(self.location.href, n.src);
                r = r.substring(0, r.length - 1) + a, o += a, (cutParams(o) === cutParams(decodeURIComponent(e.src)) || cutParams(r) === cutParams(decodeURIComponent(e.src)) || cutParams(l) === cutParams(decodeURIComponent(e.src)) || cutParams(d) === cutParams(decodeURIComponent(e.src)) || cutParams(s) === cutParams(decodeURIComponent(e.src)) || cutParams(n.src) === cutParams(decodeURIComponent(e.src)) || cutParams(n.src).replace(/^.*\/\/[^\/]+/, "") === cutParams(decodeURIComponent(e.src)).replace(/^.*\/\/[^\/]+/, "") || "file://" === window.location.origin && cutParams(e.src).match(new RegExp(a))) && (n.progress = i, n.width = e.width, n.height = e.height)
            }), progressImageLoad(t)
        },
        progressImageLoad = function(e) {
            3 != e.syncload && e.loadqueue && jQuery.each(e.loadqueue, function(t, i) {
                if (i.progress.match(/prepared/g) && e.syncload <= 3) {
                    if (e.syncload++, "img" == i.type) {
                        var n = new Image;
                        n.onload = function() {
                            imgLoaded(this, e, "loaded")
                        }, n.onerror = function() {
                            imgLoaded(this, e, "failed")
                        }, n.src = i.src
                    } else jQuery.get(i.src, function(t) {
                        i.innerHTML = (new XMLSerializer).serializeToString(t.documentElement), i.progress = "loaded", e.syncload--, progressImageLoad(e)
                    }).fail(function() {
                        i.progress = "failed", e.syncload--, progressImageLoad(e)
                    });
                    i.progress = "inload"
                }
            })
        },
        addToLoadQueue = function(e, t, i, n, a) {
            var r = !1;
            if (t.loadqueue && jQuery.each(t.loadqueue, function(t, i) {
                    i.src === e && (r = !0)
                }), !r) {
                var o = new Object;
                o.src = e, o.type = n || "img", o.prio = i, o.progress = "prepared", o["static"] = a, t.loadqueue.push(o)
            }
        },
        loadImages = function(e, t, i, n) {
            e.find("img,.defaultimg, .tp-svg-layer").each(function() {
                var e = jQuery(this),
                    a = e.data("lazyload") !== undefined && "undefined" !== e.data("lazyload") ? e.data("lazyload") : e.data("svg_src") != undefined ? e.data("svg_src") : e.attr("src"),
                    r = e.data("svg_src") != undefined ? "svg" : "img";
                e.data("start-to-load", jQuery.now()), addToLoadQueue(a, t, i, r, n)
            }), progressImageLoad(t)
        },
        getLoadObj = function(e, t) {
            var i = new Object;
            return e.loadqueue && jQuery.each(e.loadqueue, function(e, n) {
                n.src == t && (i = n)
            }), i
        },
        waitForCurrentImages = function(e, t, i) {
            var n = !1;
            e.find("img,.defaultimg, .tp-svg-layer").each(function() {
                var i = jQuery(this),
                    a = i.data("lazyload") != undefined ? i.data("lazyload") : i.data("svg_src") != undefined ? i.data("svg_src") : i.attr("src"),
                    r = getLoadObj(t, a);
                if (i.data("loaded") === undefined && r !== undefined && r.progress && r.progress.match(/loaded/g)) {
                    if (i.attr("src", r.src), "img" == r.type)
                        if (i.hasClass("defaultimg")) _R.isIE(8) ? defimg.attr("src", r.src) : i.css({
                            backgroundImage: 'url("' + r.src + '")'
                        }), e.data("owidth", r.width), e.data("oheight", r.height), e.find(".slotholder").data("owidth", r.width), e.find(".slotholder").data("oheight", r.height);
                        else {
                            var o = i.data("ww"),
                                s = i.data("hh");
                            i.data("owidth", r.width), i.data("oheight", r.height), o = o == undefined || "auto" == o || "" == o ? r.width : o, s = s == undefined || "auto" == s || "" == s ? r.height : s, i.data("ww", o), i.data("hh", s)
                        }
                    else "svg" == r.type && "loaded" == r.progress && (i.append('<div class="tp-svg-innercontainer"></div>'), i.find(".tp-svg-innercontainer").append(r.innerHTML));
                    i.data("loaded", !0)
                }
                if (r && r.progress && r.progress.match(/inprogress|inload|prepared/g) && (jQuery.now() - i.data("start-to-load") < 5e3 ? n = !0 : (r.progress = "failed", console.error(a + "  Could not be loaded !"))), 1 == t.youtubeapineeded && (!window.YT || YT.Player == undefined) && (n = !0, jQuery.now() - t.youtubestarttime > 5e3 && 1 != t.youtubewarning)) {
                    t.youtubewarning = !0;
                    var d = "YouTube Api Could not be loaded !";
                    "https:" === location.protocol && (d += " Please Check and Renew SSL Certificate !"), console.error(d), t.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>' + d + "</strong></div>")
                }
                if (1 == t.vimeoapineeded && !window.Froogaloop && (n = !0, jQuery.now() - t.vimeostarttime > 5e3 && 1 != t.vimeowarning)) {
                    t.vimeowarning = !0;
                    var d = "Vimeo Froogaloop Api Could not be loaded !";
                    "https:" === location.protocol && (d += " Please Check and Renew SSL Certificate !"), console.error(d), t.c.append('<div style="position:absolute;top:50%;width:100%;color:#e74c3c;  font-size:16px; text-align:center; padding:15px;background:#000; display:block;"><strong>' + d + "</strong></div>")
                }
            }), !_ISM && t.audioqueue && t.audioqueue.length > 0 && jQuery.each(t.audioqueue, function(e, t) {
                t.status && "prepared" === t.status && jQuery.now() - t.start < t.waittime && (n = !0)
            }), jQuery.each(t.loadqueue, function(e, t) {
                t["static"] !== !0 || "loaded" == t.progress && "failed" !== t.progress || (n = !0)
            }), n ? setTimeout(function() {
                waitForCurrentImages(e, t, i)
            }, 19) : setTimeout(i, 19)
        },
        swapSlide = function(e, t) {
            if (clearTimeout(t.waitWithSwapSlide), e.find(".processing-revslide").length > 0) return t.waitWithSwapSlide = setTimeout(function() {
                swapSlide(e, t)
            }, 150), !1;
            var i = e.find(".active-revslide"),
                n = e.find(".next-revslide"),
                a = n.find(".defaultimg");
            return n.index() === i.index() ? (n.removeClass("next-revslide"), !1) : (n.removeClass("next-revslide").addClass("processing-revslide"), n.data("slide_on_focus_amount", n.data("slide_on_focus_amount") + 1 || 1), "on" == t.stopLoop && n.index() == t.lastslidetoshow - 1 && (e.find(".tp-bannertimer").css({
                visibility: "hidden"
            }), e.trigger("revolution.slide.onstop"), t.noloopanymore = 1), n.index() === t.slideamount - 1 && (t.looptogo = t.looptogo - 1, t.looptogo <= 0 && (t.stopLoop = "on")), t.tonpause = !0, e.trigger("stoptimer"), t.cd = 0, "off" === t.spinner ? e.find(".tp-loader").css({
                display: "none"
            }) : e.find(".tp-loader").css({
                display: "block"
            }), loadImages(n, t, 1), _R.preLoadAudio && _R.preLoadAudio(n, t, 1), void waitForCurrentImages(n, t, function() {
                n.find(".rs-background-video-layer").each(function() {
                    var e = jQuery(this);
                    e.hasClass("HasListener") || (e.data("bgvideo", 1), _R.manageVideoLayer && _R.manageVideoLayer(e, t)), 0 == e.find(".rs-fullvideo-cover").length && e.append('<div class="rs-fullvideo-cover"></div>')
                }), swapSlideProgress(t, a, e)
            }))
        },
        swapSlideProgress = function(e, t, i) {
            var n = i.find(".active-revslide"),
                a = i.find(".processing-revslide"),
                r = n.find(".slotholder"),
                o = a.find(".slotholder");
            e.tonpause = !1, e.cd = 0, i.find(".tp-loader").css({
                display: "none"
            }), _R.setSize(e), _R.slotSize(t, e), _R.manageNavigation && _R.manageNavigation(e);
            var s = {};
            s.nextslide = a, s.currentslide = n, i.trigger("revolution.slide.onbeforeswap", s), e.transition = 1, e.videoplaying = !1, a.data("delay") != undefined ? (e.cd = 0, e.delay = a.data("delay")) : e.delay = e.origcd, "true" == a.data("ssop") || a.data("ssop") === !0 ? e.ssop = !0 : e.ssop = !1, i.trigger("nulltimer");
            var d = n.index(),
                l = a.index();
            e.sdir = d > l ? 1 : 0, "arrow" == e.sc_indicator && (0 == d && l == e.slideamount - 1 && (e.sdir = 1), d == e.slideamount - 1 && 0 == l && (e.sdir = 0)), e.lsdir = e.lsdir === undefined ? e.sdir : e.lsdir, e.dirc = e.lsdir != e.sdir, e.lsdir = e.sdir, n.index() != a.index() && 1 != e.firststart && _R.removeTheCaptions && _R.removeTheCaptions(n, e), a.hasClass("rs-pause-timer-once") || a.hasClass("rs-pause-timer-always") ? e.videoplaying = !0 : i.trigger("restarttimer"), a.removeClass("rs-pause-timer-once");
            var u, c;
            if ("carousel" == e.sliderType) c = new punchgs.TimelineLite, _R.prepareCarousel(e, c), letItFree(i, e, o, r, a, n, c), e.transition = 0, e.firststart = 0;
            else {
                c = new punchgs.TimelineLite({
                    onComplete: function() {
                        letItFree(i, e, o, r, a, n, c)
                    }
                }), c.add(punchgs.TweenLite.set(o.find(".defaultimg"), {
                    opacity: 0
                })), c.pause(), 1 == e.firststart && (punchgs.TweenLite.set(n, {
                    autoAlpha: 0
                }), e.firststart = 0), punchgs.TweenLite.set(n, {
                    zIndex: 18
                }), punchgs.TweenLite.set(a, {
                    autoAlpha: 0,
                    zIndex: 20
                }), "prepared" == a.data("differentissplayed") && (a.data("differentissplayed", "done"), a.data("transition", a.data("savedtransition")), a.data("slotamount", a.data("savedslotamount")), a.data("masterspeed", a.data("savedmasterspeed"))), a.data("fstransition") != undefined && "done" != a.data("differentissplayed") && (a.data("savedtransition", a.data("transition")), a.data("savedslotamount", a.data("slotamount")), a.data("savedmasterspeed", a.data("masterspeed")), a.data("transition", a.data("fstransition")), a.data("slotamount", a.data("fsslotamount")), a.data("masterspeed", a.data("fsmasterspeed")), a.data("differentissplayed", "prepared")), a.data("transition") == undefined && a.data("transition", "random"), u = 0;
                var p = a.data("transition") !== undefined ? a.data("transition").split(",") : "fade",
                    f = a.data("nexttransid") == undefined ? -1 : a.data("nexttransid");
                "on" == a.data("randomtransition") ? f = Math.round(Math.random() * p.length) : f += 1, f == p.length && (f = 0), a.data("nexttransid", f);
                var h = p[f];
                e.ie && ("boxfade" == h && (h = "boxslide"), "slotfade-vertical" == h && (h = "slotzoom-vertical"), "slotfade-horizontal" == h && (h = "slotzoom-horizontal")), _R.isIE(8) && (h = 11), c = _R.animateSlide(u, h, i, e, a, n, o, r, c), "on" == o.data("kenburns") && (_R.startKenBurn(o, e), c.add(punchgs.TweenLite.set(o, {
                    autoAlpha: 0
                }))), c.pause()
            }
            _R.scrollHandling && (_R.scrollHandling(e, !0), c.eventCallback("onUpdate", function() {
                _R.scrollHandling(e, !0)
            })), "off" != e.parallax.type && e.parallax.firstgo == undefined && _R.scrollHandling && (e.parallax.firstgo = !0, e.lastscrolltop = -999, _R.scrollHandling(e, !0), setTimeout(function() {
                e.lastscrolltop = -999, _R.scrollHandling(e, !0)
            }, 210), setTimeout(function() {
                e.lastscrolltop = -999, _R.scrollHandling(e, !0)
            }, 420)), _R.animateTheCaptions ? _R.animateTheCaptions(a, e, null, c) : c != undefined && setTimeout(function() {
                c.resume()
            }, 30), punchgs.TweenLite.to(a, .001, {
                autoAlpha: 1
            })
        },
        letItFree = function(e, t, i, n, a, r, o) {
            "carousel" === t.sliderType || (t.removePrepare = 0, punchgs.TweenLite.to(i.find(".defaultimg"), .001, {
                zIndex: 20,
                autoAlpha: 1,
                onComplete: function() {
                    removeSlots(e, t, a, 1)
                }
            }), a.index() != r.index() && punchgs.TweenLite.to(r, .2, {
                zIndex: 18,
                autoAlpha: 0,
                onComplete: function() {
                    removeSlots(e, t, r, 1)
                }
            })), e.find(".active-revslide").removeClass("active-revslide"), e.find(".processing-revslide").removeClass("processing-revslide").addClass("active-revslide"), t.act = a.index(), t.c.attr("data-slideactive", e.find(".active-revslide").data("index")), ("scroll" == t.parallax.type || "scroll+mouse" == t.parallax.type || "mouse+scroll" == t.parallax.type) && (t.lastscrolltop = -999, _R.scrollHandling(t)), o.clear(), n.data("kbtl") != undefined && (n.data("kbtl").reverse(), n.data("kbtl").timeScale(25)), "on" == i.data("kenburns") && (i.data("kbtl") != undefined ? (i.data("kbtl").timeScale(1), i.data("kbtl").play()) : _R.startKenBurn(i, t)), a.find(".rs-background-video-layer").each(function(e) {
                if (_ISM) return !1;
                var i = jQuery(this);
                _R.resetVideo(i, t), punchgs.TweenLite.fromTo(i, 1, {
                    autoAlpha: 0
                }, {
                    autoAlpha: 1,
                    ease: punchgs.Power3.easeInOut,
                    delay: .2,
                    onComplete: function() {
                        _R.animcompleted && _R.animcompleted(i, t)
                    }
                })
            }), r.find(".rs-background-video-layer").each(function(e) {
                if (_ISM) return !1;
                var i = jQuery(this);
                _R.stopVideo && (_R.resetVideo(i, t), _R.stopVideo(i, t)), punchgs.TweenLite.to(i, 1, {
                    autoAlpha: 0,
                    ease: punchgs.Power3.easeInOut,
                    delay: .2
                })
            });
            var s = {};
            s.slideIndex = a.index() + 1, s.slideLIIndex = a.index(), s.slide = a, s.currentslide = a, s.prevslide = r, t.last_shown_slide = r.index(), e.trigger("revolution.slide.onchange", s), e.trigger("revolution.slide.onafterswap", s), t.duringslidechange = !1;
            var d = r.data("slide_on_focus_amount"),
                l = r.data("hideafterloop");
            0 != l && d >= l && t.c.revremoveslide(r.index())
        },
        removeAllListeners = function(e, t) {
            e.children().each(function() {
                try {
                    jQuery(this).die("click")
                } catch (e) {}
                try {
                    jQuery(this).die("mouseenter")
                } catch (e) {}
                try {
                    jQuery(this).die("mouseleave")
                } catch (e) {}
                try {
                    jQuery(this).unbind("hover")
                } catch (e) {}
            });
            try {
                e.die("click", "mouseenter", "mouseleave")
            } catch (i) {}
            clearInterval(t.cdint), e = null
        },
        countDown = function(e, t) {
            t.cd = 0, t.loop = 0, t.stopAfterLoops != undefined && t.stopAfterLoops > -1 ? t.looptogo = t.stopAfterLoops : t.looptogo = 9999999, t.stopAtSlide != undefined && t.stopAtSlide > -1 ? t.lastslidetoshow = t.stopAtSlide : t.lastslidetoshow = 999, t.stopLoop = "off", 0 == t.looptogo && (t.stopLoop = "on");
            var i = e.find(".tp-bannertimer");
            e.on("stoptimer", function() {
                var e = jQuery(this).find(".tp-bannertimer");
                e.data("tween").pause(), "on" == t.disableProgressBar && e.css({
                    visibility: "hidden"
                }), t.sliderstatus = "paused", _R.unToggleState(t.slidertoggledby)
            }), e.on("starttimer", function() {
                t.forcepause_viatoggle || (1 != t.conthover && 1 != t.videoplaying && t.width > t.hideSliderAtLimit && 1 != t.tonpause && 1 != t.overnav && 1 != t.ssop && (1 === t.noloopanymore || t.viewPort.enable && !t.inviewport || (i.css({
                    visibility: "visible"
                }), i.data("tween").resume(), t.sliderstatus = "playing")), "on" == t.disableProgressBar && i.css({
                    visibility: "hidden"
                }), _R.toggleState(t.slidertoggledby))
            }), e.on("restarttimer", function() {
                if (!t.forcepause_viatoggle) {
                    var e = jQuery(this).find(".tp-bannertimer");
                    if (t.mouseoncontainer && "on" == t.navigation.onHoverStop && !_ISM) return !1;
                    1 === t.noloopanymore || t.viewPort.enable && !t.inviewport || 1 == t.ssop || (e.css({
                        visibility: "visible"
                    }), e.data("tween").kill(), e.data("tween", punchgs.TweenLite.fromTo(e, t.delay / 1e3, {
                        width: "0%"
                    }, {
                        force3D: "auto",
                        width: "100%",
                        ease: punchgs.Linear.easeNone,
                        onComplete: n,
                        delay: 1
                    })), t.sliderstatus = "playing"), "on" == t.disableProgressBar && e.css({
                        visibility: "hidden"
                    }), _R.toggleState(t.slidertoggledby)
                }
            }), e.on("nulltimer", function() {
                i.data("tween").kill(), i.data("tween", punchgs.TweenLite.fromTo(i, t.delay / 1e3, {
                    width: "0%"
                }, {
                    force3D: "auto",
                    width: "100%",
                    ease: punchgs.Linear.easeNone,
                    onComplete: n,
                    delay: 1
                })), i.data("tween").pause(0), "on" == t.disableProgressBar && i.css({
                    visibility: "hidden"
                }), t.sliderstatus = "paused"
            });
            var n = function() {
                0 == jQuery("body").find(e).length && (removeAllListeners(e, t), clearInterval(t.cdint)), e.trigger("revolution.slide.slideatend"), 1 == e.data("conthover-changed") && (t.conthover = e.data("conthover"), e.data("conthover-changed", 0)), _R.callingNewSlide(t, e, 1)
            };
            i.data("tween", punchgs.TweenLite.fromTo(i, t.delay / 1e3, {
                width: "0%"
            }, {
                force3D: "auto",
                width: "100%",
                ease: punchgs.Linear.easeNone,
                onComplete: n,
                delay: 1
            })), i.data("opt", t), t.slideamount > 1 && (0 != t.stopAfterLoops || 1 != t.stopAtSlide) ? e.trigger("starttimer") : (t.noloopanymore = 1, e.trigger("nulltimer")), e.on("tp-mouseenter", function() {
                t.mouseoncontainer = !0, "on" != t.navigation.onHoverStop || _ISM || (e.trigger("stoptimer"), e.trigger("revolution.slide.onpause"))
            }), e.on("tp-mouseleft", function() {
                t.mouseoncontainer = !1, 1 != e.data("conthover") && "on" == t.navigation.onHoverStop && (1 == t.viewPort.enable && t.inviewport || 0 == t.viewPort.enable) && (e.trigger("revolution.slide.onresume"), e.trigger("starttimer"))
            })
        },
        vis = function() {
            var e, t, i = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };
            for (e in i)
                if (e in document) {
                    t = i[e];
                    break
                }
            return function(i) {
                return i && document.addEventListener(t, i), !document[e]
            }
        }(),
        restartOnFocus = function(e) {
            return e == undefined || e.c == undefined ? !1 : void(1 != e.windowfocused && (e.windowfocused = !0, punchgs.TweenLite.delayedCall(.3, function() {
                "on" == e.fallbacks.nextSlideOnWindowFocus && e.c.revnext(), e.c.revredraw(), "playing" == e.lastsliderstatus && e.c.revresume()
            })))
        },
        lastStatBlur = function(e) {
            e.windowfocused = !1, e.lastsliderstatus = e.sliderstatus, e.c.revpause();
            var t = e.c.find(".active-revslide .slotholder"),
                i = e.c.find(".processing-revslide .slotholder");
            "on" == i.data("kenburns") && _R.stopKenBurn(i, e), "on" == t.data("kenburns") && _R.stopKenBurn(t, e)
        },
        tabBlurringCheck = function(e, t) {
            var i = document.documentMode === undefined,
                n = window.chrome;
            i && !n ? jQuery(window).on("focusin", function() {
                restartOnFocus(t)
            }).on("focusout", function() {
                lastStatBlur(t)
            }) : window.addEventListener ? (window.addEventListener("focus", function(e) {
                restartOnFocus(t)
            }, !1), window.addEventListener("blur", function(e) {
                lastStatBlur(t)
            }, !1)) : (window.attachEvent("focus", function(e) {
                restartOnFocus(t)
            }), window.attachEvent("blur", function(e) {
                lastStatBlur(t)
            }))
        },
        getUrlVars = function(e) {
            for (var t, i = [], n = window.location.href.slice(window.location.href.indexOf(e) + 1).split("_"), a = 0; a < n.length; a++) n[a] = n[a].replace("%3D", "="), t = n[a].split("="), i.push(t[0]), i[t[0]] = t[1];
            return i
        }
}(jQuery);

/********************************************
 * REVOLUTION 5.2.5 EXTENSION - VIDEO FUNCTIONS
 * @version: 1.8 (05.04.2016)
 * @requires jquery.themepunch.revolution.js
 * @author ThemePunch
 *********************************************/
! function(e) {
    function t(e) {
        return void 0 == e ? -1 : jQuery.isNumeric(e) ? e : e.split(":").length > 1 ? 60 * parseInt(e.split(":")[0], 0) + parseInt(e.split(":")[1], 0) : e
    }
    var a = jQuery.fn.revolution,
        i = a.is_mobile();
    jQuery.extend(!0, a, {
        preLoadAudio: function(e, t) {
            e.find(".tp-audiolayer").each(function() {
                var e = jQuery(this),
                    i = {};
                0 === e.find("audio").length && (i.src = void 0 != e.data("videomp4") ? e.data("videomp4") : "", i.pre = e.data("videopreload") || "", void 0 === e.attr("id") && e.attr("audio-layer-" + Math.round(199999 * Math.random())), i.id = e.attr("id"), i.status = "prepared", i.start = jQuery.now(), i.waittime = 1e3 * e.data("videopreloadwait") || 5e3, ("auto" == i.pre || "canplaythrough" == i.pre || "canplay" == i.pre || "progress" == i.pre) && (void 0 === t.audioqueue && (t.audioqueue = []), t.audioqueue.push(i), a.manageVideoLayer(e, t)))
            })
        },
        preLoadAudioDone: function(e, t, a) {
            t.audioqueue && t.audioqueue.length > 0 && jQuery.each(t.audioqueue, function(t, i) {
                e.data("videomp4") !== i.src || i.pre !== a && "auto" !== i.pre || (i.status = "loaded")
            })
        },
        resetVideo: function(e, d) {
            switch (e.data("videotype")) {
                case "youtube":
                    e.data("player");
                    try {
                        if ("on" == e.data("forcerewind")) {
                            var o = t(e.data("videostartat"));
                            o = -1 == o ? 0 : o, void 0 != e.data("player") && (e.data("player").seekTo(o), e.data("player").pauseVideo())
                        }
                    } catch (r) {}
                    0 == e.find(".tp-videoposter").length && punchgs.TweenLite.to(e.find("iframe"), .3, {
                        autoAlpha: 1,
                        display: "block",
                        ease: punchgs.Power3.easeInOut
                    });
                    break;
                case "vimeo":
                    var n = $f(e.find("iframe").attr("id"));
                    try {
                        if ("on" == e.data("forcerewind")) {
                            var o = t(e.data("videostartat"));
                            o = -1 == o ? 0 : o, n.api("seekTo", o), n.api("pause")
                        }
                    } catch (r) {}
                    0 == e.find(".tp-videoposter").length && punchgs.TweenLite.to(e.find("iframe"), .3, {
                        autoAlpha: 1,
                        display: "block",
                        ease: punchgs.Power3.easeInOut
                    });
                    break;
                case "html5":
                    if (i && 1 == e.data("disablevideoonmobile")) return !1;
                    var s = "html5" == e.data("audio") ? "audio" : "video",
                        l = e.find(s),
                        u = l[0];
                    if (punchgs.TweenLite.to(l, .3, {
                            autoAlpha: 1,
                            display: "block",
                            ease: punchgs.Power3.easeInOut
                        }), "on" == e.data("forcerewind") && !e.hasClass("videoisplaying")) try {
                        var o = t(e.data("videostartat"));
                        u.currentTime = -1 == o ? 0 : o
                    } catch (r) {}("mute" == e.data("volume") || a.lastToggleState(e.data("videomutetoggledby")) || d.globalmute === !0) && (u.muted = !0)
            }
        },
        isVideoMuted: function(e, t) {
            var a = !1;
            switch (e.data("videotype")) {
                case "youtube":
                    try {
                        var i = e.data("player");
                        a = i.isMuted()
                    } catch (d) {}
                    break;
                case "vimeo":
                    try {
                        $f(e.find("iframe").attr("id"));
                        "mute" == e.data("volume") && (a = !0)
                    } catch (d) {}
                    break;
                case "html5":
                    var o = "html5" == e.data("audio") ? "audio" : "video",
                        r = e.find(o),
                        n = r[0];
                    n.muted && (a = !0)
            }
            return a
        },
        muteVideo: function(e, t) {
            switch (e.data("videotype")) {
                case "youtube":
                    try {
                        var a = e.data("player");
                        a.mute()
                    } catch (i) {}
                    break;
                case "vimeo":
                    try {
                        var d = $f(e.find("iframe").attr("id"));
                        e.data("volume", "mute"), d.api("setVolume", 0)
                    } catch (i) {}
                    break;
                case "html5":
                    var o = "html5" == e.data("audio") ? "audio" : "video",
                        r = e.find(o),
                        n = r[0];
                    n.muted = !0
            }
        },
        unMuteVideo: function(e, t) {
            if (t.globalmute !== !0) switch (e.data("videotype")) {
                case "youtube":
                    try {
                        var a = e.data("player");
                        a.unMute()
                    } catch (i) {}
                    break;
                case "vimeo":
                    try {
                        var d = $f(e.find("iframe").attr("id"));
                        e.data("volume", "1"), d.api("setVolume", 1)
                    } catch (i) {}
                    break;
                case "html5":
                    var o = "html5" == e.data("audio") ? "audio" : "video",
                        r = e.find(o),
                        n = r[0];
                    n.muted = !1
            }
        },
        stopVideo: function(e, t) {
            switch (t.leaveViewPortBasedStop || (t.lastplayedvideos = []), t.leaveViewPortBasedStop = !1, e.data("videotype")) {
                case "youtube":
                    try {
                        var a = e.data("player");
                        a.pauseVideo()
                    } catch (i) {}
                    break;
                case "vimeo":
                    try {
                        var d = $f(e.find("iframe").attr("id"));
                        d.api("pause")
                    } catch (i) {}
                    break;
                case "html5":
                    var o = "html5" == e.data("audio") ? "audio" : "video",
                        r = e.find(o),
                        n = r[0];
                    void 0 != r && void 0 != n && n.pause()
            }
        },
        playVideo: function(e, o) {
            switch (clearTimeout(e.data("videoplaywait")), e.data("videotype")) {
                case "youtube":
                    if (0 == e.find("iframe").length) e.append(e.data("videomarkup")), r(e, o, !0);
                    else if (void 0 != e.data("player").playVideo) {
                        var n = t(e.data("videostartat")),
                            s = e.data("player").getCurrentTime();
                        1 == e.data("nextslideatend-triggered") && (s = -1, e.data("nextslideatend-triggered", 0)), -1 != n && n > s && e.data("player").seekTo(n), e.data("player").playVideo()
                    } else e.data("videoplaywait", setTimeout(function() {
                        a.playVideo(e, o)
                    }, 50));
                    break;
                case "vimeo":
                    if (0 == e.find("iframe").length) e.append(e.data("videomarkup")), r(e, o, !0);
                    else if (e.hasClass("rs-apiready")) {
                        var l = e.find("iframe").attr("id"),
                            u = $f(l);
                        void 0 == u.api("play") ? e.data("videoplaywait", setTimeout(function() {
                            a.playVideo(e, o)
                        }, 50)) : setTimeout(function() {
                            u.api("play");
                            var a = t(e.data("videostartat")),
                                i = e.data("currenttime");
                            1 == e.data("nextslideatend-triggered") && (i = -1, e.data("nextslideatend-triggered", 0)), -1 != a && a > i && u.api("seekTo", a)
                        }, 510)
                    } else e.data("videoplaywait", setTimeout(function() {
                        a.playVideo(e, o)
                    }, 50));
                    break;
                case "html5":
                    if (i && 1 == e.data("disablevideoonmobile")) return !1;
                    var p = "html5" == e.data("audio") ? "audio" : "video",
                        v = e.find(p),
                        c = v[0],
                        g = v.parent();
                    if (1 != g.data("metaloaded")) d(c, "loadedmetadata", function(e) {
                        a.resetVideo(e, o), c.play();
                        var i = t(e.data("videostartat")),
                            d = c.currentTime;
                        1 == e.data("nextslideatend-triggered") && (d = -1, e.data("nextslideatend-triggered", 0)), -1 != i && i > d && (c.currentTime = i)
                    }(e));
                    else {
                        c.play();
                        var n = t(e.data("videostartat")),
                            s = c.currentTime;
                        1 == e.data("nextslideatend-triggered") && (s = -1, e.data("nextslideatend-triggered", 0)), -1 != n && n > s && (c.currentTime = n)
                    }
            }
        },
        isVideoPlaying: function(e, t) {
            var a = !1;
            return void 0 != t.playingvideos && jQuery.each(t.playingvideos, function(t, i) {
                e.attr("id") == i.attr("id") && (a = !0)
            }), a
        },
        removeMediaFromList: function(e, t) {
            p(e, t)
        },
        prepareCoveredVideo: function(e, t, i) {
            var d = i.find("iframe, video"),
                o = e.split(":")[0],
                r = e.split(":")[1],
                n = i.closest(".tp-revslider-slidesli"),
                s = n.width() / n.height(),
                l = o / r,
                u = s / l * 100,
                p = l / s * 100;
            s > l ? punchgs.TweenLite.to(d, .001, {
                height: u + "%",
                width: "100%",
                top: -(u - 100) / 2 + "%",
                left: "0px",
                position: "absolute"
            }) : punchgs.TweenLite.to(d, .001, {
                width: p + "%",
                height: "100%",
                left: -(p - 100) / 2 + "%",
                top: "0px",
                position: "absolute"
            }), d.hasClass("resizelistener") || (d.addClass("resizelistener"), jQuery(window).resize(function() {
                clearTimeout(d.data("resizelistener")), d.data("resizelistener", setTimeout(function() {
                    a.prepareCoveredVideo(e, t, i)
                }, 30))
            }))
        },
        checkVideoApis: function(e, t, a) {
            var i = "https:" === location.protocol ? "https" : "http";
            if ((void 0 != e.data("ytid") || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("youtube") > 0) && (t.youtubeapineeded = !0), (void 0 != e.data("ytid") || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("youtube") > 0) && 0 == a.addedyt) {
                t.youtubestarttime = jQuery.now(), a.addedyt = 1;
                var d = document.createElement("script");
                d.src = "https://www.youtube.com/iframe_api";
                var o = document.getElementsByTagName("script")[0],
                    r = !0;
                jQuery("head").find("*").each(function() {
                    "https://www.youtube.com/iframe_api" == jQuery(this).attr("src") && (r = !1)
                }), r && o.parentNode.insertBefore(d, o)
            }
            if ((void 0 != e.data("vimeoid") || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("vimeo") > 0) && (t.vimeoapineeded = !0), (void 0 != e.data("vimeoid") || e.find("iframe").length > 0 && e.find("iframe").attr("src").toLowerCase().indexOf("vimeo") > 0) && 0 == a.addedvim) {
                t.vimeostarttime = jQuery.now(), a.addedvim = 1;
                var n = document.createElement("script"),
                    o = document.getElementsByTagName("script")[0],
                    r = !0;
                n.src = i + "://f.vimeocdn.com/js/froogaloop2.min.js", jQuery("head").find("*").each(function() {
                    jQuery(this).attr("src") == i + "://f.vimeocdn.com/js/froogaloop2.min.js" && (r = !1)
                }), r && o.parentNode.insertBefore(n, o)
            }
            return a
        },
        manageVideoLayer: function(e, o, n, s) {
            var u = e.data("videoattributes"),
                p = e.data("ytid"),
                v = e.data("vimeoid"),
                c = "auto" === e.data("videopreload") || "canplay" === e.data("videopreload") || "canplaythrough" === e.data("videopreload") || "progress" === e.data("videopreload") ? "auto" : e.data("videopreload"),
                g = e.data("videomp4"),
                m = e.data("videowebm"),
                f = e.data("videoogv"),
                y = e.data("allowfullscreenvideo"),
                h = e.data("videocontrols"),
                b = "http",
                w = "loop" == e.data("videoloop") ? "loop" : "loopandnoslidestop" == e.data("videoloop") ? "loop" : "",
                T = void 0 != g || void 0 != m ? "html5" : void 0 != p && String(p).length > 1 ? "youtube" : void 0 != v && String(v).length > 1 ? "vimeo" : "none",
                k = "html5" == e.data("audio") ? "audio" : "video",
                x = "html5" == T && 0 == e.find(k).length ? "html5" : "youtube" == T && 0 == e.find("iframe").length ? "youtube" : "vimeo" == T && 0 == e.find("iframe").length ? "vimeo" : "none";
            switch (w = e.data("nextslideatend") === !0 ? "" : w, e.data("videotype", T), x) {
                case "html5":
                    "controls" != h && (h = "");
                    var k = "video";
                    "html5" == e.data("audio") && (k = "audio", e.addClass("tp-audio-html5"));
                    var L = "<" + k + ' style="object-fit:cover;background-size:cover;visible:hidden;width:100%; height:100%" class="" ' + w + ' preload="' + c + '">';
                    "auto" == c && (o.mediapreload = !0), void 0 != m && "firefox" == a.get_browser().toLowerCase() && (L = L + '<source src="' + m + '" type="video/webm" />'), void 0 != g && (L = L + '<source src="' + g + '" type="video/mp4" />'), void 0 != f && (L = L + '<source src="' + f + '" type="video/ogg" />'), L = L + "</" + k + ">";
                    var V = "";
                    ("true" === y || y === !0) && (V = '<div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-full-screen">Full-Screen</button></div>'), "controls" == h && (L += '<div class="tp-video-controls"><div class="tp-video-button-wrap"><button type="button" class="tp-video-button tp-vid-play-pause">Play</button></div><div class="tp-video-seek-bar-wrap"><input  type="range" class="tp-seek-bar" value="0"></div><div class="tp-video-button-wrap"><button  type="button" class="tp-video-button tp-vid-mute">Mute</button></div><div class="tp-video-vol-bar-wrap"><input  type="range" class="tp-volume-bar" min="0" max="1" step="0.1" value="1"></div>' + V + "</div>"), e.data("videomarkup", L), e.append(L), (i && 1 == e.data("disablevideoonmobile") || a.isIE(8)) && e.find(k).remove(), e.find(k).each(function(t) {
                        var i = this,
                            r = jQuery(this);
                        r.parent().hasClass("html5vid") || r.wrap('<div class="html5vid" style="position:relative;top:0px;left:0px;width:100%;height:100%; overflow:hidden;"></div>');
                        var n = r.parent();
                        1 != n.data("metaloaded") && d(i, "loadedmetadata", function(e) {
                            l(e, o), a.resetVideo(e, o)
                        }(e))
                    });
                    break;
                case "youtube":
                    b = "http", "https:" === location.protocol && (b = "https"), "none" == h && (u = u.replace("controls=1", "controls=0"), -1 == u.toLowerCase().indexOf("controls") && (u += "&controls=0"));
                    var C = t(e.data("videostartat")),
                        P = t(e.data("videoendat")); - 1 != C && (u = u + "&start=" + C), -1 != P && (u = u + "&end=" + P);
                    var I = u.split("origin=" + b + "://"),
                        j = "";
                    I.length > 1 ? (j = I[0] + "origin=" + b + "://", self.location.href.match(/www/gi) && !I[1].match(/www/gi) && (j += "www."), j += I[1]) : j = u;
                    var A = "true" === y || y === !0 ? "allowfullscreen" : "";
                    e.data("videomarkup", '<iframe style="visible:hidden" src="' + b + "://www.youtube.com/embed/" + p + "?" + j + '" ' + A + ' width="100%" height="100%" style="width:100%;height:100%"></iframe>');
                    break;
                case "vimeo":
                    "https:" === location.protocol && (b = "https"), e.data("videomarkup", '<iframe style="visible:hidden" src="' + b + "://player.vimeo.com/video/" + v + "?autoplay=0&" + u + '" webkitallowfullscreen mozallowfullscreen allowfullscreen width="100%" height="100%" style="100%;height:100%"></iframe>')
            }
            var _ = i && "on" == e.data("noposteronmobile");
            if (void 0 != e.data("videoposter") && e.data("videoposter").length > 2 && !_) 0 == e.find(".tp-videoposter").length && e.append('<div class="tp-videoposter noSwipe" style="cursor:pointer; position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:3;background-image:url(' + e.data("videoposter") + '); background-size:cover;background-position:center center;"></div>'), 0 == e.find("iframe").length && e.find(".tp-videoposter").click(function() {
                if (a.playVideo(e, o), i) {
                    if (1 == e.data("disablevideoonmobile")) return !1;
                    punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                        autoAlpha: 0,
                        force3D: "auto",
                        ease: punchgs.Power3.easeInOut
                    }), punchgs.TweenLite.to(e.find("iframe"), .3, {
                        autoAlpha: 1,
                        display: "block",
                        ease: punchgs.Power3.easeInOut
                    })
                }
            });
            else {
                if (i && 1 == e.data("disablevideoonmobile")) return !1;
                0 != e.find("iframe").length || "youtube" != T && "vimeo" != T || (e.append(e.data("videomarkup")), r(e, o, !1))
            }
            "none" != e.data("dottedoverlay") && void 0 != e.data("dottedoverlay") && 1 != e.find(".tp-dottedoverlay").length && e.append('<div class="tp-dottedoverlay ' + e.data("dottedoverlay") + '"></div>'), e.addClass("HasListener"), 1 == e.data("bgvideo") && punchgs.TweenLite.set(e.find("video, iframe"), {
                autoAlpha: 0
            })
        }
    });
    var d = function(e, t, a) {
            e.addEventListener ? e.addEventListener(t, a, !1) : e.attachEvent(t, a, !1)
        },
        o = function(e, t, a) {
            var i = {};
            return i.video = e, i.videotype = t, i.settings = a, i
        },
        r = function(e, d, r) {
            var l = e.find("iframe"),
                v = "iframe" + Math.round(1e5 * Math.random() + 1),
                c = e.data("videoloop"),
                g = "loopandnoslidestop" != c;
            if (c = "loop" == c || "loopandnoslidestop" == c, 1 == e.data("forcecover")) {
                e.removeClass("fullscreenvideo").addClass("coverscreenvideo");
                var m = e.data("aspectratio");
                void 0 != m && m.split(":").length > 1 && a.prepareCoveredVideo(m, d, e)
            }
            if (1 == e.data("bgvideo")) {
                var m = e.data("aspectratio");
                void 0 != m && m.split(":").length > 1 && a.prepareCoveredVideo(m, d, e)
            }
            if (l.attr("id", v), r && e.data("startvideonow", !0), 1 !== e.data("videolistenerexist")) switch (e.data("videotype")) {
                case "youtube":
                    var f = new YT.Player(v, {
                        events: {
                            onStateChange: function(i) {
                                var r = e.closest(".tp-simpleresponsive"),
                                    l = (e.data("videorate"), e.data("videostart"), s());
                                if (i.data == YT.PlayerState.PLAYING) punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                                    autoAlpha: 0,
                                    force3D: "auto",
                                    ease: punchgs.Power3.easeInOut
                                }), punchgs.TweenLite.to(e.find("iframe"), .3, {
                                    autoAlpha: 1,
                                    display: "block",
                                    ease: punchgs.Power3.easeInOut
                                }), "mute" == e.data("volume") || a.lastToggleState(e.data("videomutetoggledby")) || d.globalmute === !0 ? f.mute() : (f.unMute(), f.setVolume(parseInt(e.data("volume"), 0) || 75)), d.videoplaying = !0, u(e, d), g ? d.c.trigger("stoptimer") : d.videoplaying = !1, d.c.trigger("revolution.slide.onvideoplay", o(f, "youtube", e.data())), a.toggleState(e.data("videotoggledby"));
                                else {
                                    if (0 == i.data && c) {
                                        var v = t(e.data("videostartat")); - 1 != v && f.seekTo(v), f.playVideo(), a.toggleState(e.data("videotoggledby"))
                                    }!l && (0 == i.data || 2 == i.data) && "on" == e.data("showcoveronpause") && e.find(".tp-videoposter").length > 0 && (punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                                        autoAlpha: 1,
                                        force3D: "auto",
                                        ease: punchgs.Power3.easeInOut
                                    }), punchgs.TweenLite.to(e.find("iframe"), .3, {
                                        autoAlpha: 0,
                                        ease: punchgs.Power3.easeInOut
                                    })), -1 != i.data && 3 != i.data && (d.videoplaying = !1, d.tonpause = !1, p(e, d), r.trigger("starttimer"), d.c.trigger("revolution.slide.onvideostop", o(f, "youtube", e.data())), (void 0 == d.currentLayerVideoIsPlaying || d.currentLayerVideoIsPlaying.attr("id") == e.attr("id")) && a.unToggleState(e.data("videotoggledby"))), 0 == i.data && 1 == e.data("nextslideatend") ? (n(), e.data("nextslideatend-triggered", 1), d.c.revnext(), p(e, d)) : (p(e, d), d.videoplaying = !1, r.trigger("starttimer"), d.c.trigger("revolution.slide.onvideostop", o(f, "youtube", e.data())), (void 0 == d.currentLayerVideoIsPlaying || d.currentLayerVideoIsPlaying.attr("id") == e.attr("id")) && a.unToggleState(e.data("videotoggledby")))
                                }
                            },
                            onReady: function(a) {
                                var d = e.data("videorate");
                                e.data("videostart");
                                if (e.addClass("rs-apiready"), void 0 != d && a.target.setPlaybackRate(parseFloat(d)), e.find(".tp-videoposter").unbind("click"), e.find(".tp-videoposter").click(function() {
                                        i || f.playVideo()
                                    }), e.data("startvideonow")) {
                                    e.data("player").playVideo();
                                    var o = t(e.data("videostartat")); - 1 != o && e.data("player").seekTo(o)
                                }
                                e.data("videolistenerexist", 1)
                            }
                        }
                    });
                    e.data("player", f);
                    break;
                case "vimeo":
                    for (var y, h = l.attr("src"), b = {}, w = h, T = /([^&=]+)=([^&]*)/g; y = T.exec(w);) b[decodeURIComponent(y[1])] = decodeURIComponent(y[2]);
                    h = void 0 != b.player_id ? h.replace(b.player_id, v) : h + "&player_id=" + v;
                    try {
                        h = h.replace("api=0", "api=1")
                    } catch (k) {}
                    h += "&api=1", l.attr("src", h);
                    var f = e.find("iframe")[0],
                        x = (jQuery("#" + v), $f(v));
                    x.addEvent("ready", function() {
                        if (e.addClass("rs-apiready"), x.addEvent("play", function(t) {
                                e.data("nextslidecalled", 0), punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                                    autoAlpha: 0,
                                    force3D: "auto",
                                    ease: punchgs.Power3.easeInOut
                                }), punchgs.TweenLite.to(e.find("iframe"), .3, {
                                    autoAlpha: 1,
                                    display: "block",
                                    ease: punchgs.Power3.easeInOut
                                }), d.c.trigger("revolution.slide.onvideoplay", o(x, "vimeo", e.data())), d.videoplaying = !0, u(e, d), g ? d.c.trigger("stoptimer") : d.videoplaying = !1, "mute" == e.data("volume") || a.lastToggleState(e.data("videomutetoggledby")) || d.globalmute === !0 ? x.api("setVolume", "0") : x.api("setVolume", parseInt(e.data("volume"), 0) / 100 || .75), a.toggleState(e.data("videotoggledby"))
                            }), x.addEvent("playProgress", function(a) {
                                var i = t(e.data("videoendat"));
                                if (e.data("currenttime", a.seconds), 0 != i && Math.abs(i - a.seconds) < .3 && i > a.seconds && 1 != e.data("nextslidecalled"))
                                    if (c) {
                                        x.api("play");
                                        var o = t(e.data("videostartat")); - 1 != o && x.api("seekTo", o)
                                    } else 1 == e.data("nextslideatend") && (e.data("nextslideatend-triggered", 1), e.data("nextslidecalled", 1), d.c.revnext()), x.api("pause")
                            }), x.addEvent("finish", function(t) {
                                p(e, d), d.videoplaying = !1, d.c.trigger("starttimer"), d.c.trigger("revolution.slide.onvideostop", o(x, "vimeo", e.data())), 1 == e.data("nextslideatend") && (e.data("nextslideatend-triggered", 1), d.c.revnext()), (void 0 == d.currentLayerVideoIsPlaying || d.currentLayerVideoIsPlaying.attr("id") == e.attr("id")) && a.unToggleState(e.data("videotoggledby"))
                            }), x.addEvent("pause", function(t) {
                                e.find(".tp-videoposter").length > 0 && "on" == e.data("showcoveronpause") && (punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                                    autoAlpha: 1,
                                    force3D: "auto",
                                    ease: punchgs.Power3.easeInOut
                                }), punchgs.TweenLite.to(e.find("iframe"), .3, {
                                    autoAlpha: 0,
                                    ease: punchgs.Power3.easeInOut
                                })), d.videoplaying = !1, d.tonpause = !1, p(e, d), d.c.trigger("starttimer"), d.c.trigger("revolution.slide.onvideostop", o(x, "vimeo", e.data())), (void 0 == d.currentLayerVideoIsPlaying || d.currentLayerVideoIsPlaying.attr("id") == e.attr("id")) && a.unToggleState(e.data("videotoggledby"))
                            }), e.find(".tp-videoposter").unbind("click"), e.find(".tp-videoposter").click(function() {
                                return i ? void 0 : (x.api("play"), !1)
                            }), e.data("startvideonow")) {
                            x.api("play");
                            var r = t(e.data("videostartat")); - 1 != r && x.api("seekTo", r)
                        }
                        e.data("videolistenerexist", 1)
                    })
            } else {
                var L = t(e.data("videostartat"));
                switch (e.data("videotype")) {
                    case "youtube":
                        r && (e.data("player").playVideo(), -1 != L && e.data("player").seekTo());
                        break;
                    case "vimeo":
                        if (r) {
                            var x = $f(e.find("iframe").attr("id"));
                            x.api("play"), -1 != L && x.api("seekTo", L)
                        }
                }
            }
        },
        n = function() {
            document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()
        },
        s = function() {
            try {
                if (void 0 !== window.fullScreen) return window.fullScreen;
                var e = 5;
                return jQuery.browser.webkit && /Apple Computer/.test(navigator.vendor) && (e = 42), screen.width == window.innerWidth && Math.abs(screen.height - window.innerHeight) < e
            } catch (t) {}
        },
        l = function(e, r, l) {
            if (i && 1 == e.data("disablevideoonmobile")) return !1;
            var v = "html5" == e.data("audio") ? "audio" : "video",
                c = e.find(v),
                g = c[0],
                m = c.parent(),
                f = e.data("videoloop"),
                y = "loopandnoslidestop" != f;
            if (f = "loop" == f || "loopandnoslidestop" == f, m.data("metaloaded", 1), 1 != e.data("bgvideo") || "none" !== e.data("videoloop") && e.data("videoloop") !== !1 || (y = !1), void 0 == c.attr("control") && (0 != e.find(".tp-video-play-button").length || i || e.append('<div class="tp-video-play-button"><i class="revicon-right-dir"></i><span class="tp-revstop">&nbsp;</span></div>'), e.find("video, .tp-poster, .tp-video-play-button").click(function() {
                    e.hasClass("videoisplaying") ? g.pause() : g.play()
                })), 1 == e.data("forcecover") || e.hasClass("fullscreenvideo") || 1 == e.data("bgvideo"))
                if (1 == e.data("forcecover") || 1 == e.data("bgvideo")) {
                    m.addClass("fullcoveredvideo");
                    var h = e.data("aspectratio") || "4:3";
                    a.prepareCoveredVideo(h, r, e)
                } else m.addClass("fullscreenvideo");
            var b = e.find(".tp-vid-play-pause")[0],
                w = e.find(".tp-vid-mute")[0],
                T = e.find(".tp-vid-full-screen")[0],
                k = e.find(".tp-seek-bar")[0],
                x = e.find(".tp-volume-bar")[0];
            void 0 != b && d(b, "click", function() {
                1 == g.paused ? g.play() : g.pause()
            }), void 0 != w && d(w, "click", function() {
                0 == g.muted ? (g.muted = !0, w.innerHTML = "Unmute") : (g.muted = !1, w.innerHTML = "Mute")
            }), void 0 != T && T && d(T, "click", function() {
                g.requestFullscreen ? g.requestFullscreen() : g.mozRequestFullScreen ? g.mozRequestFullScreen() : g.webkitRequestFullscreen && g.webkitRequestFullscreen()
            }), void 0 != k && (d(k, "change", function() {
                var e = g.duration * (k.value / 100);
                g.currentTime = e
            }), d(k, "mousedown", function() {
                e.addClass("seekbardragged"), g.pause()
            }), d(k, "mouseup", function() {
                e.removeClass("seekbardragged"), g.play()
            })), d(g, "canplaythrough", function() {
                a.preLoadAudioDone(e, r, "canplaythrough")
            }), d(g, "canplay", function() {
                a.preLoadAudioDone(e, r, "canplay")
            }), d(g, "progress", function() {
                a.preLoadAudioDone(e, r, "progress")
            }), d(g, "timeupdate", function() {
                var a = 100 / g.duration * g.currentTime,
                    i = t(e.data("videoendat")),
                    d = g.currentTime;
                if (void 0 != k && (k.value = a), 0 != i && -1 != i && Math.abs(i - d) <= .3 && i > d && 1 != e.data("nextslidecalled"))
                    if (f) {
                        g.play();
                        var o = t(e.data("videostartat")); - 1 != o && (g.currentTime = o)
                    } else 1 == e.data("nextslideatend") && (e.data("nextslideatend-triggered", 1), e.data("nextslidecalled", 1), r.just_called_nextslide_at_htmltimer = !0, r.c.revnext(), setTimeout(function() {
                        r.just_called_nextslide_at_htmltimer = !1
                    }, 1e3)), g.pause()
            }), void 0 != x && d(x, "change", function() {
                g.volume = x.value
            }), d(g, "play", function() {
                e.data("nextslidecalled", 0);
                var t = e.data("volume");
                t = void 0 != t && "mute" != t ? parseFloat(t) / 100 : t, r.globalmute === !0 ? g.muted = !0 : g.muted = !1, t > 1 && (t /= 100), "mute" == t ? g.muted = !0 : void 0 != t && (g.volume = t), e.addClass("videoisplaying");
                var i = "html5" == e.data("audio") ? "audio" : "video";
                u(e, r), y && "audio" != i ? (r.videoplaying = !0, r.c.trigger("stoptimer"), r.c.trigger("revolution.slide.onvideoplay", o(g, "html5", e.data()))) : (r.videoplaying = !1, "audio" != i && r.c.trigger("starttimer"), r.c.trigger("revolution.slide.onvideostop", o(g, "html5", e.data()))), punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                    autoAlpha: 0,
                    force3D: "auto",
                    ease: punchgs.Power3.easeInOut
                }), punchgs.TweenLite.to(e.find(i), .3, {
                    autoAlpha: 1,
                    display: "block",
                    ease: punchgs.Power3.easeInOut
                });
                var d = e.find(".tp-vid-play-pause")[0],
                    n = e.find(".tp-vid-mute")[0];
                void 0 != d && (d.innerHTML = "Pause"), void 0 != n && g.muted && (n.innerHTML = "Unmute"), a.toggleState(e.data("videotoggledby"))
            }), d(g, "pause", function() {
                var t = "html5" == e.data("audio") ? "audio" : "video",
                    i = s();
                !i && e.find(".tp-videoposter").length > 0 && "on" == e.data("showcoveronpause") && !e.hasClass("seekbardragged") && (punchgs.TweenLite.to(e.find(".tp-videoposter"), .3, {
                    autoAlpha: 1,
                    force3D: "auto",
                    ease: punchgs.Power3.easeInOut
                }), punchgs.TweenLite.to(e.find(t), .3, {
                    autoAlpha: 0,
                    ease: punchgs.Power3.easeInOut
                })), e.removeClass("videoisplaying"), r.videoplaying = !1, p(e, r), "audio" != t && r.c.trigger("starttimer"), r.c.trigger("revolution.slide.onvideostop", o(g, "html5", e.data()));
                var d = e.find(".tp-vid-play-pause")[0];
                void 0 != d && (d.innerHTML = "Play"), (void 0 == r.currentLayerVideoIsPlaying || r.currentLayerVideoIsPlaying.attr("id") == e.attr("id")) && a.unToggleState(e.data("videotoggledby"))
            }), d(g, "ended", function() {
                n(), p(e, r), r.videoplaying = !1, p(e, r), "audio" != v && r.c.trigger("starttimer"), r.c.trigger("revolution.slide.onvideostop", o(g, "html5", e.data())), e.data("nextslideatend") === !0 && g.currentTime > 0 && (1 == !r.just_called_nextslide_at_htmltimer && (e.data("nextslideatend-triggered", 1), r.c.revnext(), r.just_called_nextslide_at_htmltimer = !0), setTimeout(function() {
                    r.just_called_nextslide_at_htmltimer = !1
                }, 1500)), e.removeClass("videoisplaying")
            })
        },
        u = function(e, t) {
            void 0 == t.playingvideos && (t.playingvideos = new Array), e.data("stopallvideos") && void 0 != t.playingvideos && t.playingvideos.length > 0 && (t.lastplayedvideos = jQuery.extend(!0, [], t.playingvideos), jQuery.each(t.playingvideos, function(e, i) {
                a.stopVideo(i, t)
            })), t.playingvideos.push(e), t.currentLayerVideoIsPlaying = e
        },
        p = function(e, t) {
            void 0 != t.playingvideos && jQuery.inArray(e, t.playingvideos) >= 0 && t.playingvideos.splice(jQuery.inArray(e, t.playingvideos), 1)
        }
}(jQuery);

/************************************************
 * REVOLUTION 5.2 EXTENSION - SLIDE ANIMATIONS
 * @version: 1.1.2 (23.02.2016)
 * @requires jquery.themepunch.revolution.js
 * @author ThemePunch
 ************************************************/
! function(t) {
    var e = jQuery.fn.revolution;
    jQuery.extend(!0, e, {
        animateSlide: function(t, e, o, a, i, r, s, l, d) {
            return n(t, e, o, a, i, r, s, l, d)
        }
    });
    var o = function(t, o, a, i) {
            var n = t,
                r = n.find(".defaultimg"),
                s = n.data("zoomstart"),
                l = n.data("rotationstart");
            void 0 != r.data("currotate") && (l = r.data("currotate")), void 0 != r.data("curscale") && "box" == i ? s = 100 * r.data("curscale") : void 0 != r.data("curscale") && (s = r.data("curscale")), e.slotSize(r, o);
            var d = r.attr("src"),
                h = r.css("backgroundColor"),
                f = o.width,
                c = o.height,
                p = r.data("fxof"),
                u = 0;
            "on" == o.autoHeight && (c = o.c.height()), void 0 == p && (p = 0);
            var g = 0,
                w = r.data("bgfit"),
                v = r.data("bgrepeat"),
                m = r.data("bgposition");
            switch (void 0 == w && (w = "cover"), void 0 == v && (v = "no-repeat"), void 0 == m && (m = "center center"), i) {
                case "box":
                    for (var x = 0, y = 0, T = 0; T < o.slots; T++) {
                        y = 0;
                        for (var z = 0; z < o.slots; z++) n.append('<div class="slot" style="position:absolute;top:' + (u + y) + "px;left:" + (p + x) + "px;width:" + o.slotw + "px;height:" + o.sloth + 'px;overflow:hidden;"><div class="slotslide" data-x="' + x + '" data-y="' + y + '" style="position:absolute;top:0px;left:0px;width:' + o.slotw + "px;height:" + o.sloth + 'px;overflow:hidden;"><div style="position:absolute;top:' + (0 - y) + "px;left:" + (0 - x) + "px;width:" + f + "px;height:" + c + "px;background-color:" + h + ";background-image:url(" + d + ");background-repeat:" + v + ";background-size:" + w + ";background-position:" + m + ';"></div></div></div>'), y += o.sloth, void 0 != s && void 0 != l && punchgs.TweenLite.set(n.find(".slot").last(), {
                            rotationZ: l
                        });
                        x += o.slotw
                    }
                    break;
                case "vertical":
                case "horizontal":
                    if ("horizontal" == i) {
                        if (!a) var g = 0 - o.slotw;
                        for (var z = 0; z < o.slots; z++) n.append('<div class="slot" style="position:absolute;top:' + (0 + u) + "px;left:" + (p + z * o.slotw) + "px;overflow:hidden;width:" + (o.slotw + .6) + "px;height:" + c + 'px"><div class="slotslide" style="position:absolute;top:0px;left:' + g + "px;width:" + (o.slotw + .6) + "px;height:" + c + 'px;overflow:hidden;"><div style="background-color:' + h + ";position:absolute;top:0px;left:" + (0 - z * o.slotw) + "px;width:" + f + "px;height:" + c + "px;background-image:url(" + d + ");background-repeat:" + v + ";background-size:" + w + ";background-position:" + m + ';"></div></div></div>'), void 0 != s && void 0 != l && punchgs.TweenLite.set(n.find(".slot").last(), {
                            rotationZ: l
                        })
                    } else {
                        if (!a) var g = 0 - o.sloth;
                        for (var z = 0; z < o.slots + 2; z++) n.append('<div class="slot" style="position:absolute;top:' + (u + z * o.sloth) + "px;left:" + p + "px;overflow:hidden;width:" + f + "px;height:" + o.sloth + 'px"><div class="slotslide" style="position:absolute;top:' + g + "px;left:0px;width:" + f + "px;height:" + o.sloth + 'px;overflow:hidden;"><div style="background-color:' + h + ";position:absolute;top:" + (0 - z * o.sloth) + "px;left:0px;width:" + f + "px;height:" + c + "px;background-image:url(" + d + ");background-repeat:" + v + ";background-size:" + w + ";background-position:" + m + ';"></div></div></div>'), void 0 != s && void 0 != l && punchgs.TweenLite.set(n.find(".slot").last(), {
                            rotationZ: l
                        })
                    }
            }
        },
        a = function(t, e, o, a, i) {
            function n() {
                jQuery.each(y, function(t, e) {
                    (e[0] == o || e[8] == o) && (w = e[1], v = e[2], m = x), x += 1
                })
            }
            var r = punchgs.Power1.easeIn,
                s = punchgs.Power1.easeOut,
                l = punchgs.Power1.easeInOut,
                d = punchgs.Power2.easeIn,
                h = punchgs.Power2.easeOut,
                f = punchgs.Power2.easeInOut,
                c = (punchgs.Power3.easeIn, punchgs.Power3.easeOut),
                p = punchgs.Power3.easeInOut,
                u = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
                g = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27],
                w = 0,
                v = 1,
                m = 0,
                x = 0,
                y = (new Array, [
                    ["boxslide", 0, 1, 10, 0, "box", !1, null, 0, s, s, 500, 6],
                    ["boxfade", 1, 0, 10, 0, "box", !1, null, 1, l, l, 700, 5],
                    ["slotslide-horizontal", 2, 0, 0, 200, "horizontal", !0, !1, 2, f, f, 700, 3],
                    ["slotslide-vertical", 3, 0, 0, 200, "vertical", !0, !1, 3, f, f, 700, 3],
                    ["curtain-1", 4, 3, 0, 0, "horizontal", !0, !0, 4, s, s, 300, 5],
                    ["curtain-2", 5, 3, 0, 0, "horizontal", !0, !0, 5, s, s, 300, 5],
                    ["curtain-3", 6, 3, 25, 0, "horizontal", !0, !0, 6, s, s, 300, 5],
                    ["slotzoom-horizontal", 7, 0, 0, 400, "horizontal", !0, !0, 7, s, s, 300, 7],
                    ["slotzoom-vertical", 8, 0, 0, 0, "vertical", !0, !0, 8, h, h, 500, 8],
                    ["slotfade-horizontal", 9, 0, 0, 500, "horizontal", !0, null, 9, h, h, 500, 25],
                    ["slotfade-vertical", 10, 0, 0, 500, "vertical", !0, null, 10, h, h, 500, 25],
                    ["fade", 11, 0, 1, 300, "horizontal", !0, null, 11, f, f, 1e3, 1],
                    ["crossfade", 11, 1, 1, 300, "horizontal", !0, null, 11, f, f, 1e3, 1],
                    ["fadethroughdark", 11, 2, 1, 300, "horizontal", !0, null, 11, f, f, 1e3, 1],
                    ["fadethroughlight", 11, 3, 1, 300, "horizontal", !0, null, 11, f, f, 1e3, 1],
                    ["fadethroughtransparent", 11, 4, 1, 300, "horizontal", !0, null, 11, f, f, 1e3, 1],
                    ["slideleft", 12, 0, 1, 0, "horizontal", !0, !0, 12, p, p, 1e3, 1],
                    ["slideup", 13, 0, 1, 0, "horizontal", !0, !0, 13, p, p, 1e3, 1],
                    ["slidedown", 14, 0, 1, 0, "horizontal", !0, !0, 14, p, p, 1e3, 1],
                    ["slideright", 15, 0, 1, 0, "horizontal", !0, !0, 15, p, p, 1e3, 1],
                    ["slideoverleft", 12, 7, 1, 0, "horizontal", !0, !0, 12, p, p, 1e3, 1],
                    ["slideoverup", 13, 7, 1, 0, "horizontal", !0, !0, 13, p, p, 1e3, 1],
                    ["slideoverdown", 14, 7, 1, 0, "horizontal", !0, !0, 14, p, p, 1e3, 1],
                    ["slideoverright", 15, 7, 1, 0, "horizontal", !0, !0, 15, p, p, 1e3, 1],
                    ["slideremoveleft", 12, 8, 1, 0, "horizontal", !0, !0, 12, p, p, 1e3, 1],
                    ["slideremoveup", 13, 8, 1, 0, "horizontal", !0, !0, 13, p, p, 1e3, 1],
                    ["slideremovedown", 14, 8, 1, 0, "horizontal", !0, !0, 14, p, p, 1e3, 1],
                    ["slideremoveright", 15, 8, 1, 0, "horizontal", !0, !0, 15, p, p, 1e3, 1],
                    ["papercut", 16, 0, 0, 600, "", null, null, 16, p, p, 1e3, 2],
                    ["3dcurtain-horizontal", 17, 0, 20, 100, "vertical", !1, !0, 17, l, l, 500, 7],
                    ["3dcurtain-vertical", 18, 0, 10, 100, "horizontal", !1, !0, 18, l, l, 500, 5],
                    ["cubic", 19, 0, 20, 600, "horizontal", !1, !0, 19, p, p, 500, 1],
                    ["cube", 19, 0, 20, 600, "horizontal", !1, !0, 20, p, p, 500, 1],
                    ["flyin", 20, 0, 4, 600, "vertical", !1, !0, 21, c, p, 500, 1],
                    ["turnoff", 21, 0, 1, 500, "horizontal", !1, !0, 22, p, p, 500, 1],
                    ["incube", 22, 0, 20, 200, "horizontal", !1, !0, 23, f, f, 500, 1],
                    ["cubic-horizontal", 23, 0, 20, 500, "vertical", !1, !0, 24, h, h, 500, 1],
                    ["cube-horizontal", 23, 0, 20, 500, "vertical", !1, !0, 25, h, h, 500, 1],
                    ["incube-horizontal", 24, 0, 20, 500, "vertical", !1, !0, 26, f, f, 500, 1],
                    ["turnoff-vertical", 25, 0, 1, 200, "horizontal", !1, !0, 27, f, f, 500, 1],
                    ["fadefromright", 12, 1, 1, 0, "horizontal", !0, !0, 28, f, f, 1e3, 1],
                    ["fadefromleft", 15, 1, 1, 0, "horizontal", !0, !0, 29, f, f, 1e3, 1],
                    ["fadefromtop", 14, 1, 1, 0, "horizontal", !0, !0, 30, f, f, 1e3, 1],
                    ["fadefrombottom", 13, 1, 1, 0, "horizontal", !0, !0, 31, f, f, 1e3, 1],
                    ["fadetoleftfadefromright", 12, 2, 1, 0, "horizontal", !0, !0, 32, f, f, 1e3, 1],
                    ["fadetorightfadefromleft", 15, 2, 1, 0, "horizontal", !0, !0, 33, f, f, 1e3, 1],
                    ["fadetobottomfadefromtop", 14, 2, 1, 0, "horizontal", !0, !0, 34, f, f, 1e3, 1],
                    ["fadetotopfadefrombottom", 13, 2, 1, 0, "horizontal", !0, !0, 35, f, f, 1e3, 1],
                    ["parallaxtoright", 12, 3, 1, 0, "horizontal", !0, !0, 36, f, d, 1500, 1],
                    ["parallaxtoleft", 15, 3, 1, 0, "horizontal", !0, !0, 37, f, d, 1500, 1],
                    ["parallaxtotop", 14, 3, 1, 0, "horizontal", !0, !0, 38, f, r, 1500, 1],
                    ["parallaxtobottom", 13, 3, 1, 0, "horizontal", !0, !0, 39, f, r, 1500, 1],
                    ["scaledownfromright", 12, 4, 1, 0, "horizontal", !0, !0, 40, f, d, 1e3, 1],
                    ["scaledownfromleft", 15, 4, 1, 0, "horizontal", !0, !0, 41, f, d, 1e3, 1],
                    ["scaledownfromtop", 14, 4, 1, 0, "horizontal", !0, !0, 42, f, d, 1e3, 1],
                    ["scaledownfrombottom", 13, 4, 1, 0, "horizontal", !0, !0, 43, f, d, 1e3, 1],
                    ["zoomout", 13, 5, 1, 0, "horizontal", !0, !0, 44, f, d, 1e3, 1],
                    ["zoomin", 13, 6, 1, 0, "horizontal", !0, !0, 45, f, d, 1e3, 1],
                    ["slidingoverlayup", 27, 0, 1, 0, "horizontal", !0, !0, 47, l, s, 2e3, 1],
                    ["slidingoverlaydown", 28, 0, 1, 0, "horizontal", !0, !0, 48, l, s, 2e3, 1],
                    ["slidingoverlayright", 30, 0, 1, 0, "horizontal", !0, !0, 49, l, s, 2e3, 1],
                    ["slidingoverlayleft", 29, 0, 1, 0, "horizontal", !0, !0, 50, l, s, 2e3, 1],
                    ["parallaxcirclesup", 31, 0, 1, 0, "horizontal", !0, !0, 51, f, r, 1500, 1],
                    ["parallaxcirclesdown", 32, 0, 1, 0, "horizontal", !0, !0, 52, f, r, 1500, 1],
                    ["parallaxcirclesright", 33, 0, 1, 0, "horizontal", !0, !0, 53, f, r, 1500, 1],
                    ["parallaxcirclesleft", 34, 0, 1, 0, "horizontal", !0, !0, 54, f, r, 1500, 1],
                    ["notransition", 26, 0, 1, 0, "horizontal", !0, null, 46, f, d, 1e3, 1],
                    ["parallaxright", 12, 3, 1, 0, "horizontal", !0, !0, 55, f, d, 1500, 1],
                    ["parallaxleft", 15, 3, 1, 0, "horizontal", !0, !0, 56, f, d, 1500, 1],
                    ["parallaxup", 14, 3, 1, 0, "horizontal", !0, !0, 57, f, r, 1500, 1],
                    ["parallaxdown", 13, 3, 1, 0, "horizontal", !0, !0, 58, f, r, 1500, 1]
                ]);
            e.duringslidechange = !0, e.testanims = !1, 1 == e.testanims && (e.nexttesttransform = void 0 === e.nexttesttransform ? 34 : e.nexttesttransform + 1, e.nexttesttransform = e.nexttesttransform > 70 ? 0 : e.nexttesttransform, o = y[e.nexttesttransform][0], console.log(o + "  " + e.nexttesttransform + "  " + y[e.nexttesttransform][1] + "  " + y[e.nexttesttransform][2])), jQuery.each(["parallaxcircles", "slidingoverlay", "slide", "slideover", "slideremove", "parallax"], function(t, e) {
                o == e + "horizontal" && (o = 1 != i ? e + "left" : e + "right"), o == e + "vertical" && (o = 1 != i ? e + "up" : e + "down")
            }), "random" == o && (o = Math.round(Math.random() * y.length - 1), o > y.length - 1 && (o = y.length - 1)), "random-static" == o && (o = Math.round(Math.random() * u.length - 1), o > u.length - 1 && (o = u.length - 1), o = u[o]), "random-premium" == o && (o = Math.round(Math.random() * g.length - 1), o > g.length - 1 && (o = g.length - 1), o = g[o]);
            var T = [12, 13, 14, 15, 16, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
            if (1 == e.isJoomla && void 0 != window.MooTools && -1 != T.indexOf(o)) {
                var z = Math.round(Math.random() * (g.length - 2)) + 1;
                z > g.length - 1 && (z = g.length - 1), 0 == z && (z = 1), o = g[z]
            }
            n(), w > 30 && (w = 30), 0 > w && (w = 0);
            var L = new Object;
            return L.nexttrans = w, L.STA = y[m], L.specials = v, L
        },
        i = function(t, e) {
            return void 0 == e || jQuery.isNumeric(t) ? t : void 0 == t ? t : t.split(",")[e]
        },
        n = function(t, e, n, r, s, l, d, h, f) {
            function c(t, e, o, a, i) {
                var n = t.find(".slot"),
                    r = 6,
                    s = [2, 1.2, .9, .7, .55, .42],
                    l = t.width(),
                    h = t.height();
                n.wrap('<div class="slot-circle-wrapper" style="overflow:hidden;position:absolute;border:1px solid #fff"></div>');
                for (var c = 0; r > c; c++) n.parent().clone(!1).appendTo(d);
                t.find(".slot-circle-wrapper").each(function(t) {
                    if (r > t) {
                        var a = jQuery(this),
                            n = a.find(".slot"),
                            d = l > h ? s[t] * l : s[t] * h,
                            c = d,
                            p = 0 + (c / 2 - l / 2),
                            u = 0 + (d / 2 - h / 2),
                            g = 0 != t ? "50%" : "0",
                            w = 31 == o ? h / 2 - d / 2 : 32 == o ? h / 2 - d / 2 : h / 2 - d / 2,
                            v = 33 == o ? l / 2 - c / 2 : 34 == o ? l - c : l / 2 - c / 2,
                            m = {
                                scale: 1,
                                transformOrigo: "50% 50%",
                                width: c + "px",
                                height: d + "px",
                                top: w + "px",
                                left: v + "px",
                                borderRadius: g
                            },
                            x = {
                                scale: 1,
                                top: h / 2 - d / 2,
                                left: l / 2 - c / 2,
                                ease: i
                            },
                            y = 31 == o ? u : 32 == o ? u : u,
                            T = 33 == o ? p : 34 == o ? p + l / 2 : p,
                            z = {
                                width: l,
                                height: h,
                                autoAlpha: 1,
                                top: y + "px",
                                position: "absolute",
                                left: T + "px"
                            },
                            L = {
                                top: u + "px",
                                left: p + "px",
                                ease: i
                            },
                            b = e,
                            D = 0;
                        f.add(punchgs.TweenLite.fromTo(a, b, m, x), D), f.add(punchgs.TweenLite.fromTo(n, b, z, L), D), f.add(punchgs.TweenLite.fromTo(a, .001, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1
                        }), 0)
                    }
                })
            }
            var p = l.index(),
                u = s.index(),
                g = p > u ? 1 : 0;
            "arrow" == r.sc_indicator && (g = r.sc_indicator_dir);
            var w = a(n, r, e, d, g),
                v = w.STA,
                m = w.specials,
                t = w.nexttrans;
            "on" == d.data("kenburns") && (t = 11);
            var x = s.data("nexttransid") || 0,
                y = i(s.data("masterspeed"), x);
            y = "default" === y ? v[11] : "random" === y ? Math.round(1e3 * Math.random() + 300) : void 0 != y ? parseInt(y, 0) : v[11], y = y > r.delay ? r.delay : y, y += v[4], r.slots = i(s.data("slotamount"), x), r.slots = void 0 == r.slots || "default" == r.slots ? v[12] : "random" == r.slots ? Math.round(12 * Math.random() + 4) : r.slots, r.slots = r.slots < 1 ? "boxslide" == e ? Math.round(6 * Math.random() + 3) : "flyin" == e ? Math.round(4 * Math.random() + 1) : r.slots : r.slots, r.slots = (4 == t || 5 == t || 6 == t) && r.slots < 3 ? 3 : r.slots, r.slots = 0 != v[3] ? Math.min(r.slots, v[3]) : r.slots, r.slots = 9 == t ? r.width / 20 : 10 == t ? r.height / 20 : r.slots, r.rotate = i(s.data("rotate"), x), r.rotate = void 0 == r.rotate || "default" == r.rotate ? 0 : 999 == r.rotate || "random" == r.rotate ? Math.round(360 * Math.random()) : r.rotate, r.rotate = !jQuery.support.transition || r.ie || r.ie9 ? 0 : r.rotate, 11 != t && (null != v[7] && o(h, r, v[7], v[5]), null != v[6] && o(d, r, v[6], v[5])), f.add(punchgs.TweenLite.set(d.find(".defaultvid"), {
                y: 0,
                x: 0,
                top: 0,
                left: 0,
                scale: 1
            }), 0), f.add(punchgs.TweenLite.set(h.find(".defaultvid"), {
                y: 0,
                x: 0,
                top: 0,
                left: 0,
                scale: 1
            }), 0), f.add(punchgs.TweenLite.set(d.find(".defaultvid"), {
                y: "+0%",
                x: "+0%"
            }), 0), f.add(punchgs.TweenLite.set(h.find(".defaultvid"), {
                y: "+0%",
                x: "+0%"
            }), 0), f.add(punchgs.TweenLite.set(d, {
                autoAlpha: 1,
                y: "+0%",
                x: "+0%"
            }), 0), f.add(punchgs.TweenLite.set(h, {
                autoAlpha: 1,
                y: "+0%",
                x: "+0%"
            }), 0), f.add(punchgs.TweenLite.set(d.parent(), {
                backgroundColor: "transparent"
            }), 0), f.add(punchgs.TweenLite.set(h.parent(), {
                backgroundColor: "transparent"
            }), 0);
            var T = i(s.data("easein"), x),
                z = i(s.data("easeout"), x);
            if (T = "default" === T ? v[9] || punchgs.Power2.easeInOut : T || v[9] || punchgs.Power2.easeInOut, z = "default" === z ? v[10] || punchgs.Power2.easeInOut : z || v[10] || punchgs.Power2.easeInOut, 0 == t) {
                var L = Math.ceil(r.height / r.sloth),
                    b = 0;
                d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    b += 1, b == L && (b = 0), f.add(punchgs.TweenLite.from(e, y / 600, {
                        opacity: 0,
                        top: 0 - r.sloth,
                        left: 0 - r.slotw,
                        rotation: r.rotate,
                        force3D: "auto",
                        ease: T
                    }), (15 * t + 30 * b) / 1500)
                })
            }
            if (1 == t) {
                var D, A = 0;
                d.find(".slotslide").each(function(t) {
                    var e = jQuery(this),
                        o = Math.random() * y + 300,
                        a = 500 * Math.random() + 200;
                    o + a > D && (D = a + a, A = t), f.add(punchgs.TweenLite.from(e, o / 1e3, {
                        autoAlpha: 0,
                        force3D: "auto",
                        rotation: r.rotate,
                        ease: T
                    }), a / 1e3)
                })
            }
            if (2 == t) {
                var j = new punchgs.TimelineLite;
                h.find(".slotslide").each(function() {
                    var t = jQuery(this);
                    j.add(punchgs.TweenLite.to(t, y / 1e3, {
                        left: r.slotw,
                        ease: T,
                        force3D: "auto",
                        rotation: 0 - r.rotate
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function() {
                    var t = jQuery(this);
                    j.add(punchgs.TweenLite.from(t, y / 1e3, {
                        left: 0 - r.slotw,
                        ease: T,
                        force3D: "auto",
                        rotation: r.rotate
                    }), 0), f.add(j, 0)
                })
            }
            if (3 == t) {
                var j = new punchgs.TimelineLite;
                h.find(".slotslide").each(function() {
                    var t = jQuery(this);
                    j.add(punchgs.TweenLite.to(t, y / 1e3, {
                        top: r.sloth,
                        ease: T,
                        rotation: r.rotate,
                        force3D: "auto",
                        transformPerspective: 600
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function() {
                    var t = jQuery(this);
                    j.add(punchgs.TweenLite.from(t, y / 1e3, {
                        top: 0 - r.sloth,
                        rotation: r.rotate,
                        ease: z,
                        force3D: "auto",
                        transformPerspective: 600
                    }), 0), f.add(j, 0)
                })
            }
            if (4 == t || 5 == t) {
                setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100);
                var k = y / 1e3,
                    j = new punchgs.TimelineLite;
                h.find(".slotslide").each(function(e) {
                    var o = jQuery(this),
                        a = e * k / r.slots;
                    5 == t && (a = (r.slots - e - 1) * k / r.slots / 1.5), j.add(punchgs.TweenLite.to(o, 3 * k, {
                        transformPerspective: 600,
                        force3D: "auto",
                        top: 0 + r.height,
                        opacity: .5,
                        rotation: r.rotate,
                        ease: T,
                        delay: a
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function(e) {
                    var o = jQuery(this),
                        a = e * k / r.slots;
                    5 == t && (a = (r.slots - e - 1) * k / r.slots / 1.5), j.add(punchgs.TweenLite.from(o, 3 * k, {
                        top: 0 - r.height,
                        opacity: .5,
                        rotation: r.rotate,
                        force3D: "auto",
                        ease: punchgs.eo,
                        delay: a
                    }), 0), f.add(j, 0)
                })
            }
            if (6 == t) {
                r.slots < 2 && (r.slots = 2), r.slots % 2 && (r.slots = r.slots + 1);
                var j = new punchgs.TimelineLite;
                setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100), h.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    if (t + 1 < r.slots / 2) var o = 90 * (t + 2);
                    else var o = 90 * (2 + r.slots - t);
                    j.add(punchgs.TweenLite.to(e, (y + o) / 1e3, {
                        top: 0 + r.height,
                        opacity: 1,
                        force3D: "auto",
                        rotation: r.rotate,
                        ease: T
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    if (t + 1 < r.slots / 2) var o = 90 * (t + 2);
                    else var o = 90 * (2 + r.slots - t);
                    j.add(punchgs.TweenLite.from(e, (y + o) / 1e3, {
                        top: 0 - r.height,
                        opacity: 1,
                        force3D: "auto",
                        rotation: r.rotate,
                        ease: z
                    }), 0), f.add(j, 0)
                })
            }
            if (7 == t) {
                y = 2 * y, y > r.delay && (y = r.delay);
                var j = new punchgs.TimelineLite;
                setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100), h.find(".slotslide").each(function() {
                    var t = jQuery(this).find("div");
                    j.add(punchgs.TweenLite.to(t, y / 1e3, {
                        left: 0 - r.slotw / 2 + "px",
                        top: 0 - r.height / 2 + "px",
                        width: 2 * r.slotw + "px",
                        height: 2 * r.height + "px",
                        opacity: 0,
                        rotation: r.rotate,
                        force3D: "auto",
                        ease: T
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function(t) {
                    var e = jQuery(this).find("div");
                    j.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        left: 0,
                        top: 0,
                        opacity: 0,
                        transformPerspective: 600
                    }, {
                        left: 0 - t * r.slotw + "px",
                        ease: z,
                        force3D: "auto",
                        top: "0px",
                        width: r.width,
                        height: r.height,
                        opacity: 1,
                        rotation: 0,
                        delay: .1
                    }), 0), f.add(j, 0)
                })
            }
            if (8 == t) {
                y = 3 * y, y > r.delay && (y = r.delay);
                var j = new punchgs.TimelineLite;
                h.find(".slotslide").each(function() {
                    var t = jQuery(this).find("div");
                    j.add(punchgs.TweenLite.to(t, y / 1e3, {
                        left: 0 - r.width / 2 + "px",
                        top: 0 - r.sloth / 2 + "px",
                        width: 2 * r.width + "px",
                        height: 2 * r.sloth + "px",
                        force3D: "auto",
                        ease: T,
                        opacity: 0,
                        rotation: r.rotate
                    }), 0), f.add(j, 0)
                }), d.find(".slotslide").each(function(t) {
                    var e = jQuery(this).find("div");
                    j.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        left: 0,
                        top: 0,
                        opacity: 0,
                        force3D: "auto"
                    }, {
                        left: "0px",
                        top: 0 - t * r.sloth + "px",
                        width: d.find(".defaultimg").data("neww") + "px",
                        height: d.find(".defaultimg").data("newh") + "px",
                        opacity: 1,
                        ease: z,
                        rotation: 0
                    }), 0), f.add(j, 0)
                })
            }
            if (9 == t || 10 == t) {
                var M = 0;
                d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    M++, f.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        autoAlpha: 0,
                        force3D: "auto",
                        transformPerspective: 600
                    }, {
                        autoAlpha: 1,
                        ease: T,
                        delay: 5 * t / 1e3
                    }), 0)
                })
            }
            if (27 == t || 28 == t || 29 == t || 30 == t) {
                var P = d.find(".slot"),
                    Q = 27 == t || 28 == t ? 1 : 2,
                    O = 27 == t || 29 == t ? "-100%" : "+100%",
                    I = 27 == t || 29 == t ? "+100%" : "-100%",
                    X = 27 == t || 29 == t ? "-80%" : "80%",
                    Y = 27 == t || 29 == t ? "80%" : "-80%",
                    S = 27 == t || 29 == t ? "10%" : "-10%",
                    _ = {
                        overwrite: "all"
                    },
                    C = {
                        autoAlpha: 0,
                        zIndex: 1,
                        force3D: "auto",
                        ease: T
                    },
                    V = {
                        position: "inherit",
                        autoAlpha: 0,
                        overwrite: "all",
                        zIndex: 1
                    },
                    Z = {
                        autoAlpha: 1,
                        force3D: "auto",
                        ease: z
                    },
                    H = {
                        overwrite: "all",
                        zIndex: 2
                    },
                    J = {
                        autoAlpha: 1,
                        force3D: "auto",
                        overwrite: "all",
                        ease: T
                    },
                    N = {
                        overwrite: "all",
                        zIndex: 2
                    },
                    R = {
                        autoAlpha: 1,
                        force3D: "auto",
                        ease: T
                    },
                    q = 1 == Q ? "y" : "x";
                _[q] = "0px", C[q] = O, V[q] = S, Z[q] = "0%", H[q] = I, J[q] = O, N[q] = X, R[q] = Y, P.append('<span style="background-color:rgba(0,0,0,0.6);width:100%;height:100%;position:absolute;top:0px;left:0px;display:block;z-index:2"></span>'), f.add(punchgs.TweenLite.fromTo(h, y / 1e3, _, C), 0), f.add(punchgs.TweenLite.fromTo(d.find(".defaultimg"), y / 2e3, V, Z), y / 2e3), f.add(punchgs.TweenLite.fromTo(P, y / 1e3, H, J), 0), f.add(punchgs.TweenLite.fromTo(P.find(".slotslide div"), y / 1e3, N, R), 0)
            }
            if (31 == t || 32 == t || 33 == t || 34 == t) {
                y = 6e3, T = punchgs.Power3.easeInOut;
                var B = y / 1e3;
                mas = B - B / 5, _nt = t, fy = 31 == _nt ? "+100%" : 32 == _nt ? "-100%" : "0%", fx = 33 == _nt ? "+100%" : 34 == _nt ? "-100%" : "0%", ty = 31 == _nt ? "-100%" : 32 == _nt ? "+100%" : "0%", tx = 33 == _nt ? "-100%" : 34 == _nt ? "+100%" : "0%", f.add(punchgs.TweenLite.fromTo(h, B - .2 * B, {
                    y: 0,
                    x: 0
                }, {
                    y: ty,
                    x: tx,
                    ease: z
                }), .2 * B), f.add(punchgs.TweenLite.fromTo(d, B, {
                    y: fy,
                    x: fx
                }, {
                    y: "0%",
                    x: "0%",
                    ease: T
                }), 0), d.find(".slot").remove(), d.find(".defaultimg").clone().appendTo(d).addClass("slot"), c(d, B, _nt, "in", T)
            }
            if (11 == t) {
                m > 4 && (m = 0);
                var M = 0,
                    E = 2 == m ? "#000000" : 3 == m ? "#ffffff" : "transparent";
                switch (m) {
                    case 0:
                        f.add(punchgs.TweenLite.fromTo(d, y / 1e3, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            force3D: "auto",
                            ease: T
                        }), 0);
                        break;
                    case 1:
                        f.add(punchgs.TweenLite.fromTo(d, y / 1e3, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            force3D: "auto",
                            ease: T
                        }), 0), f.add(punchgs.TweenLite.fromTo(h, y / 1e3, {
                            autoAlpha: 1
                        }, {
                            autoAlpha: 0,
                            force3D: "auto",
                            ease: T
                        }), 0);
                        break;
                    case 2:
                    case 3:
                    case 4:
                        f.add(punchgs.TweenLite.set(h.parent(), {
                            backgroundColor: E,
                            force3D: "auto"
                        }), 0), f.add(punchgs.TweenLite.set(d.parent(), {
                            backgroundColor: "transparent",
                            force3D: "auto"
                        }), 0), f.add(punchgs.TweenLite.to(h, y / 2e3, {
                            autoAlpha: 0,
                            force3D: "auto",
                            ease: T
                        }), 0), f.add(punchgs.TweenLite.fromTo(d, y / 2e3, {
                            autoAlpha: 0
                        }, {
                            autoAlpha: 1,
                            force3D: "auto",
                            ease: T
                        }), y / 2e3)
                }
                f.add(punchgs.TweenLite.set(d.find(".defaultimg"), {
                    autoAlpha: 1
                }), 0), f.add(punchgs.TweenLite.set(h.find("defaultimg"), {
                    autoAlpha: 1
                }), 0)
            }
            if (26 == t) {
                var M = 0;
                y = 0, f.add(punchgs.TweenLite.fromTo(d, y / 1e3, {
                    autoAlpha: 0
                }, {
                    autoAlpha: 1,
                    force3D: "auto",
                    ease: T
                }), 0), f.add(punchgs.TweenLite.to(h, y / 1e3, {
                    autoAlpha: 0,
                    force3D: "auto",
                    ease: T
                }), 0), f.add(punchgs.TweenLite.set(d.find(".defaultimg"), {
                    autoAlpha: 1
                }), 0), f.add(punchgs.TweenLite.set(h.find("defaultimg"), {
                    autoAlpha: 1
                }), 0)
            }
            if (12 == t || 13 == t || 14 == t || 15 == t) {
                y = y, y > r.delay && (y = r.delay), setTimeout(function() {
                    punchgs.TweenLite.set(h.find(".defaultimg"), {
                        autoAlpha: 0
                    })
                }, 100);
                var F = r.width,
                    G = r.height,
                    K = d.find(".slotslide, .defaultvid"),
                    U = 0,
                    W = 0,
                    $ = 1,
                    tt = 1,
                    et = 1,
                    ot = y / 1e3,
                    at = ot;
                ("fullwidth" == r.sliderLayout || "fullscreen" == r.sliderLayout) && (F = K.width(), G = K.height()), 12 == t ? U = F : 15 == t ? U = 0 - F : 13 == t ? W = G : 14 == t && (W = 0 - G), 1 == m && ($ = 0), 2 == m && ($ = 0), 3 == m && (ot = y / 1300), (4 == m || 5 == m) && (tt = .6), 6 == m && (tt = 1.4), (5 == m || 6 == m) && (et = 1.4, $ = 0, F = 0, G = 0, U = 0, W = 0), 6 == m && (et = .6);
                7 == m && (F = 0, G = 0);
                var it = d.find(".slotslide"),
                    nt = h.find(".slotslide, .defaultvid");
                if (f.add(punchgs.TweenLite.set(l, {
                        zIndex: 15
                    }), 0), f.add(punchgs.TweenLite.set(s, {
                        zIndex: 20
                    }), 0), 8 == m ? (f.add(punchgs.TweenLite.set(l, {
                        zIndex: 20
                    }), 0), f.add(punchgs.TweenLite.set(s, {
                        zIndex: 15
                    }), 0), f.add(punchgs.TweenLite.set(it, {
                        left: 0,
                        top: 0,
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        ease: T,
                        force3D: "auto"
                    }), 0)) : f.add(punchgs.TweenLite.from(it, ot, {
                        left: U,
                        top: W,
                        scale: et,
                        opacity: $,
                        rotation: r.rotate,
                        ease: T,
                        force3D: "auto"
                    }), 0), (4 == m || 5 == m) && (F = 0, G = 0), 1 != m) switch (t) {
                    case 12:
                        f.add(punchgs.TweenLite.to(nt, at, {
                            left: 0 - F + "px",
                            force3D: "auto",
                            scale: tt,
                            opacity: $,
                            rotation: r.rotate,
                            ease: z
                        }), 0);
                        break;
                    case 15:
                        f.add(punchgs.TweenLite.to(nt, at, {
                            left: F + "px",
                            force3D: "auto",
                            scale: tt,
                            opacity: $,
                            rotation: r.rotate,
                            ease: z
                        }), 0);
                        break;
                    case 13:
                        f.add(punchgs.TweenLite.to(nt, at, {
                            top: 0 - G + "px",
                            force3D: "auto",
                            scale: tt,
                            opacity: $,
                            rotation: r.rotate,
                            ease: z
                        }), 0);
                        break;
                    case 14:
                        f.add(punchgs.TweenLite.to(nt, at, {
                            top: G + "px",
                            force3D: "auto",
                            scale: tt,
                            opacity: $,
                            rotation: r.rotate,
                            ease: z
                        }), 0)
                }
            }
            if (16 == t) {
                var j = new punchgs.TimelineLite;
                f.add(punchgs.TweenLite.set(l, {
                    position: "absolute",
                    "z-index": 20
                }), 0), f.add(punchgs.TweenLite.set(s, {
                    position: "absolute",
                    "z-index": 15
                }), 0), l.wrapInner('<div class="tp-half-one" style="position:relative; width:100%;height:100%"></div>'), l.find(".tp-half-one").clone(!0).appendTo(l).addClass("tp-half-two"), l.find(".tp-half-two").removeClass("tp-half-one");
                var F = r.width,
                    G = r.height;
                "on" == r.autoHeight && (G = n.height()), l.find(".tp-half-one .defaultimg").wrap('<div class="tp-papercut" style="width:' + F + "px;height:" + G + 'px;"></div>'), l.find(".tp-half-two .defaultimg").wrap('<div class="tp-papercut" style="width:' + F + "px;height:" + G + 'px;"></div>'), l.find(".tp-half-two .defaultimg").css({
                    position: "absolute",
                    top: "-50%"
                }), l.find(".tp-half-two .tp-caption").wrapAll('<div style="position:absolute;top:-50%;left:0px;"></div>'), f.add(punchgs.TweenLite.set(l.find(".tp-half-two"), {
                    width: F,
                    height: G,
                    overflow: "hidden",
                    zIndex: 15,
                    position: "absolute",
                    top: G / 2,
                    left: "0px",
                    transformPerspective: 600,
                    transformOrigin: "center bottom"
                }), 0), f.add(punchgs.TweenLite.set(l.find(".tp-half-one"), {
                    width: F,
                    height: G / 2,
                    overflow: "visible",
                    zIndex: 10,
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    transformPerspective: 600,
                    transformOrigin: "center top"
                }), 0);
                var rt = (l.find(".defaultimg"), Math.round(20 * Math.random() - 10)),
                    st = Math.round(20 * Math.random() - 10),
                    lt = Math.round(20 * Math.random() - 10),
                    dt = .4 * Math.random() - .2,
                    ht = .4 * Math.random() - .2,
                    ft = 1 * Math.random() + 1,
                    ct = 1 * Math.random() + 1,
                    pt = .3 * Math.random() + .3;
                f.add(punchgs.TweenLite.set(l.find(".tp-half-one"), {
                    overflow: "hidden"
                }), 0), f.add(punchgs.TweenLite.fromTo(l.find(".tp-half-one"), y / 800, {
                    width: F,
                    height: G / 2,
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    force3D: "auto",
                    transformOrigin: "center top"
                }, {
                    scale: ft,
                    rotation: rt,
                    y: 0 - G - G / 4,
                    autoAlpha: 0,
                    ease: T
                }), 0), f.add(punchgs.TweenLite.fromTo(l.find(".tp-half-two"), y / 800, {
                    width: F,
                    height: G,
                    overflow: "hidden",
                    position: "absolute",
                    top: G / 2,
                    left: "0px",
                    force3D: "auto",
                    transformOrigin: "center bottom"
                }, {
                    scale: ct,
                    rotation: st,
                    y: G + G / 4,
                    ease: T,
                    autoAlpha: 0,
                    onComplete: function() {
                        punchgs.TweenLite.set(l, {
                            position: "absolute",
                            "z-index": 15
                        }), punchgs.TweenLite.set(s, {
                            position: "absolute",
                            "z-index": 20
                        }), l.find(".tp-half-one").length > 0 && (l.find(".tp-half-one .defaultimg").unwrap(), l.find(".tp-half-one .slotholder").unwrap()), l.find(".tp-half-two").remove()
                    }
                }), 0), j.add(punchgs.TweenLite.set(d.find(".defaultimg"), {
                    autoAlpha: 1
                }), 0), null != l.html() && f.add(punchgs.TweenLite.fromTo(s, (y - 200) / 1e3, {
                    scale: pt,
                    x: r.width / 4 * dt,
                    y: G / 4 * ht,
                    rotation: lt,
                    force3D: "auto",
                    transformOrigin: "center center",
                    ease: z
                }, {
                    autoAlpha: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotation: 0
                }), 0), f.add(j, 0)
            }
            if (17 == t && d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    f.add(punchgs.TweenLite.fromTo(e, y / 800, {
                        opacity: 0,
                        rotationY: 0,
                        scale: .9,
                        rotationX: -110,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: "center center"
                    }, {
                        opacity: 1,
                        top: 0,
                        left: 0,
                        scale: 1,
                        rotation: 0,
                        rotationX: 0,
                        force3D: "auto",
                        rotationY: 0,
                        ease: T,
                        delay: .06 * t
                    }), 0)
                }), 18 == t && d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    f.add(punchgs.TweenLite.fromTo(e, y / 500, {
                        autoAlpha: 0,
                        rotationY: 110,
                        scale: .9,
                        rotationX: 10,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: "center center"
                    }, {
                        autoAlpha: 1,
                        top: 0,
                        left: 0,
                        scale: 1,
                        rotation: 0,
                        rotationX: 0,
                        force3D: "auto",
                        rotationY: 0,
                        ease: T,
                        delay: .06 * t
                    }), 0)
                }), 19 == t || 22 == t) {
                var j = new punchgs.TimelineLite;
                f.add(punchgs.TweenLite.set(l, {
                    zIndex: 20
                }), 0), f.add(punchgs.TweenLite.set(s, {
                    zIndex: 20
                }), 0), setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100);
                var ut = 90,
                    $ = 1,
                    gt = "center center ";
                1 == g && (ut = -90), 19 == t ? (gt = gt + "-" + r.height / 2, $ = 0) : gt += r.height / 2, punchgs.TweenLite.set(n, {
                    transformStyle: "flat",
                    backfaceVisibility: "hidden",
                    transformPerspective: 600
                }), d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    j.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        transformStyle: "flat",
                        backfaceVisibility: "hidden",
                        left: 0,
                        rotationY: r.rotate,
                        z: 10,
                        top: 0,
                        scale: 1,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: gt,
                        rotationX: ut
                    }, {
                        left: 0,
                        rotationY: 0,
                        top: 0,
                        z: 0,
                        scale: 1,
                        force3D: "auto",
                        rotationX: 0,
                        delay: 50 * t / 1e3,
                        ease: T
                    }), 0), j.add(punchgs.TweenLite.to(e, .1, {
                        autoAlpha: 1,
                        delay: 50 * t / 1e3
                    }), 0), f.add(j)
                }), h.find(".slotslide").each(function(t) {
                    var e = jQuery(this),
                        o = -90;
                    1 == g && (o = 90), j.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        transformStyle: "flat",
                        backfaceVisibility: "hidden",
                        autoAlpha: 1,
                        rotationY: 0,
                        top: 0,
                        z: 0,
                        scale: 1,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: gt,
                        rotationX: 0
                    }, {
                        autoAlpha: 1,
                        rotationY: r.rotate,
                        top: 0,
                        z: 10,
                        scale: 1,
                        rotationX: o,
                        delay: 50 * t / 1e3,
                        force3D: "auto",
                        ease: z
                    }), 0), f.add(j)
                }), f.add(punchgs.TweenLite.set(l, {
                    zIndex: 18
                }), 0)
            }
            if (20 == t) {
                if (setTimeout(function() {
                        h.find(".defaultimg").css({
                            opacity: 0
                        })
                    }, 100), 1 == g) var wt = -r.width,
                    ut = 80,
                    gt = "20% 70% -" + r.height / 2;
                else var wt = r.width,
                    ut = -80,
                    gt = "80% 70% -" + r.height / 2;
                d.find(".slotslide").each(function(t) {
                    var e = jQuery(this),
                        o = 50 * t / 1e3;
                    f.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        left: wt,
                        rotationX: 40,
                        z: -600,
                        opacity: $,
                        top: 0,
                        scale: 1,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: gt,
                        transformStyle: "flat",
                        rotationY: ut
                    }, {
                        left: 0,
                        rotationX: 0,
                        opacity: 1,
                        top: 0,
                        z: 0,
                        scale: 1,
                        rotationY: 0,
                        delay: o,
                        ease: T
                    }), 0)
                }), h.find(".slotslide").each(function(t) {
                    var e = jQuery(this),
                        o = 50 * t / 1e3;
                    if (o = t > 0 ? o + y / 9e3 : 0, 1 != g) var a = -r.width / 2,
                        i = 30,
                        n = "20% 70% -" + r.height / 2;
                    else var a = r.width / 2,
                        i = -30,
                        n = "80% 70% -" + r.height / 2;
                    z = punchgs.Power2.easeInOut, f.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        opacity: 1,
                        rotationX: 0,
                        top: 0,
                        z: 0,
                        scale: 1,
                        left: 0,
                        force3D: "auto",
                        transformPerspective: 600,
                        transformOrigin: n,
                        transformStyle: "flat",
                        rotationY: 0
                    }, {
                        opacity: 1,
                        rotationX: 20,
                        top: 0,
                        z: -600,
                        left: a,
                        force3D: "auto",
                        rotationY: i,
                        delay: o,
                        ease: z
                    }), 0)
                })
            }
            if (21 == t || 25 == t) {
                setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100);
                var ut = 90,
                    wt = -r.width,
                    vt = -ut;
                if (1 == g)
                    if (25 == t) {
                        var gt = "center top 0";
                        ut = r.rotate
                    } else {
                        var gt = "left center 0";
                        vt = r.rotate
                    }
                else if (wt = r.width, ut = -90, 25 == t) {
                    var gt = "center bottom 0";
                    vt = -ut, ut = r.rotate
                } else {
                    var gt = "right center 0";
                    vt = r.rotate
                }
                d.find(".slotslide").each(function(t) {
                    var e = jQuery(this),
                        o = y / 1.5 / 3;
                    f.add(punchgs.TweenLite.fromTo(e, 2 * o / 1e3, {
                        left: 0,
                        transformStyle: "flat",
                        rotationX: vt,
                        z: 0,
                        autoAlpha: 0,
                        top: 0,
                        scale: 1,
                        force3D: "auto",
                        transformPerspective: 1200,
                        transformOrigin: gt,
                        rotationY: ut
                    }, {
                        left: 0,
                        rotationX: 0,
                        top: 0,
                        z: 0,
                        autoAlpha: 1,
                        scale: 1,
                        rotationY: 0,
                        force3D: "auto",
                        delay: o / 1e3,
                        ease: T
                    }), 0)
                }), 1 != g ? (wt = -r.width, ut = 90, 25 == t ? (gt = "center top 0", vt = -ut, ut = r.rotate) : (gt = "left center 0", vt = r.rotate)) : (wt = r.width, ut = -90, 25 == t ? (gt = "center bottom 0", vt = -ut, ut = r.rotate) : (gt = "right center 0", vt = r.rotate)), h.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    f.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        left: 0,
                        transformStyle: "flat",
                        rotationX: 0,
                        z: 0,
                        autoAlpha: 1,
                        top: 0,
                        scale: 1,
                        force3D: "auto",
                        transformPerspective: 1200,
                        transformOrigin: gt,
                        rotationY: 0
                    }, {
                        left: 0,
                        rotationX: vt,
                        top: 0,
                        z: 0,
                        autoAlpha: 1,
                        force3D: "auto",
                        scale: 1,
                        rotationY: ut,
                        ease: z
                    }), 0)
                })
            }
            if (23 == t || 24 == t) {
                setTimeout(function() {
                    h.find(".defaultimg").css({
                        opacity: 0
                    })
                }, 100);
                var ut = -90,
                    $ = 1,
                    mt = 0;
                if (1 == g && (ut = 90), 23 == t) {
                    var gt = "center center -" + r.width / 2;
                    $ = 0
                } else var gt = "center center " + r.width / 2;
                punchgs.TweenLite.set(n, {
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    perspective: 2500
                }), d.find(".slotslide").each(function(t) {
                    var e = jQuery(this);
                    f.add(punchgs.TweenLite.fromTo(e, y / 1e3, {
                        left: mt,
                        rotationX: r.rotate,
                        force3D: "auto",
                        opacity: $,
                        top: 0,
                        scale: 1,
                        transformPerspective: 1200,
                        transformOrigin: gt,
                        rotationY: ut
                    }, {
                        left: 0,
                        rotationX: 0,
                        autoAlpha: 1,
                        top: 0,
                        z: 0,
                        scale: 1,
                        rotationY: 0,
                        delay: 50 * t / 500,
                        ease: T
                    }), 0)
                }), ut = 90, 1 == g && (ut = -90), h.find(".slotslide").each(function(e) {
                    var o = jQuery(this);
                    f.add(punchgs.TweenLite.fromTo(o, y / 1e3, {
                        left: 0,
                        rotationX: 0,
                        top: 0,
                        z: 0,
                        scale: 1,
                        force3D: "auto",
                        transformStyle: "flat",
                        transformPerspective: 1200,
                        transformOrigin: gt,
                        rotationY: 0
                    }, {
                        left: mt,
                        rotationX: r.rotate,
                        top: 0,
                        scale: 1,
                        rotationY: ut,
                        delay: 50 * e / 500,
                        ease: z
                    }), 0), 23 == t && f.add(punchgs.TweenLite.fromTo(o, y / 2e3, {
                        autoAlpha: 1
                    }, {
                        autoAlpha: 0,
                        delay: 50 * e / 500 + y / 3e3,
                        ease: z
                    }), 0)
                })
            }
            return f
        }
}(jQuery);

/************************************************
 * REVOLUTION 5.2 EXTENSION - LAYER ANIMATION
 * @version: 2.4 (12.04.2016)
 * @requires jquery.themepunch.revolution.js
 * @author ThemePunch
 ************************************************/
! function(a) {
    function e(a, e, t, i, n, o, r) {
        var d = a.find(e);
        d.css("borderWidth", o + "px"), d.css(t, 0 - o + "px"), d.css(i, "0px solid transparent"), d.css(n, r)
    }
    var t = jQuery.fn.revolution;
    t.is_mobile();
    jQuery.extend(!0, t, {
        animcompleted: function(a, e) {
            var i = a.data("videotype"),
                n = a.data("autoplay"),
                o = a.data("autoplayonlyfirsttime");
            void 0 != i && "none" != i && (1 == n || "true" == n || "on" == n || "1sttime" == n || o ? (t.playVideo(a, e), t.toggleState(a.data("videotoggledby")), (o || "1sttime" == n) && (a.data("autoplayonlyfirsttime", !1), a.data("autoplay", "off"))) : ("no1sttime" == n && a.data("autoplay", "on"), t.unToggleState(a.data("videotoggledby"))))
        },
        handleStaticLayers: function(a, e) {
            var t = parseInt(a.data("startslide"), 0),
                i = parseInt(a.data("endslide"), 0);
            0 > t && (t = 0), 0 > i && (i = e.slideamount), 0 === t && i === e.slideamount - 1 && (i = e.slideamount + 1), a.data("startslide", t), a.data("endslide", i)
        },
        animateTheCaptions: function(a, e, i, n) {
            var o = "carousel" === e.sliderType ? 0 : e.width / 2 - e.gridwidth[e.curWinRange] * e.bw / 2,
                r = 0,
                d = a.data("index");
            e.layers = e.layers || new Object, e.layers[d] = e.layers[d] || a.find(".tp-caption"), e.layers["static"] = e.layers["static"] || e.c.find(".tp-static-layers").find(".tp-caption");
            var s = new Array;
            if (e.conh = e.c.height(), e.conw = e.c.width(), e.ulw = e.ul.width(), e.ulh = e.ul.height(), e.debugMode) {
                a.addClass("indebugmode"), a.find(".helpgrid").remove(), e.c.find(".hglayerinfo").remove(), a.append('<div class="helpgrid" style="width:' + e.gridwidth[e.curWinRange] * e.bw + "px;height:" + e.gridheight[e.curWinRange] * e.bw + 'px;"></div>');
                var l = a.find(".helpgrid");
                l.append('<div class="hginfo">Zoom:' + Math.round(100 * e.bw) + "% &nbsp;&nbsp;&nbsp; Device Level:" + e.curWinRange + "&nbsp;&nbsp;&nbsp; Grid Preset:" + e.gridwidth[e.curWinRange] + "x" + e.gridheight[e.curWinRange] + "</div>"), e.c.append('<div class="hglayerinfo"></div>'), l.append('<div class="tlhg"></div>')
            }
            s && jQuery.each(s, function(a) {
                var e = jQuery(this);
                punchgs.TweenLite.set(e.find(".tp-videoposter"), {
                    autoAlpha: 1
                }), punchgs.TweenLite.set(e.find("iframe"), {
                    autoAlpha: 0
                })
            }), e.layers[d] && jQuery.each(e.layers[d], function(a, e) {
                s.push(e)
            }), e.layers["static"] && jQuery.each(e.layers["static"], function(a, e) {
                s.push(e)
            }), s && jQuery.each(s, function(a) {
                t.animateSingleCaption(jQuery(this), e, o, r, a, i)
            });
            var p = jQuery("body").find("#" + e.c.attr("id")).find(".tp-bannertimer");
            p.data("opt", e), void 0 != n && setTimeout(function() {
                n.resume()
            }, 30)
        },
        animateSingleCaption: function(a, r, s, f, b, x, T) {
            var L = x,
                W = g(a, r, "in", !0),
                j = a.data("_pw") || a.closest(".tp-parallax-wrap"),
                C = a.data("_lw") || a.closest(".tp-loop-wrap"),
                R = a.data("_mw") || a.closest(".tp-mask-wrap"),
                k = a.data("responsive") || "on",
                I = a.data("responsive_offset") || "on",
                _ = a.data("basealign") || "grid",
                Q = "grid" === _ ? r.width : r.ulw,
                S = "grid" === _ ? r.height : r.ulh,
                z = jQuery("body").hasClass("rtl");
            if (a.data("_pw") || (a.data("staticlayer") ? a.data("_li", a.closest(".tp-static-layers")) : a.data("_li", a.closest(".tp-revslider-slidesli")), a.data("slidelink", a.hasClass("slidelink")), a.data("_pw", j), a.data("_lw", C), a.data("_mw", R)), !a.data("togglelisteners") && a.find(".rs-toggled-content") && (a.on("click", function() {
                    a.toggleClass("rs-toggle-content-active")
                }), a.data("togglelisteners", !0)), "fullscreen" == r.sliderLayout && (f = S / 2 - r.gridheight[r.curWinRange] * r.bh / 2), ("on" == r.autoHeight || void 0 != r.minHeight && r.minHeight > 0) && (f = r.conh / 2 - r.gridheight[r.curWinRange] * r.bh / 2), 0 > f && (f = 0), r.debugMode) {
                a.closest("li").find(".helpgrid").css({
                    top: f + "px",
                    left: s + "px"
                });
                var M = r.c.find(".hglayerinfo");
                a.on("hover, mouseenter", function() {
                    var e = "";
                    a.data() && jQuery.each(a.data(), function(a, t) {
                        "object" != typeof t && (e = e + '<span style="white-space:nowrap"><span style="color:#27ae60">' + a + ":</span>" + t + "</span>&nbsp; &nbsp; ")
                    }), M.html(e)
                })
            }
            var O = c(a.data("visibility"), r)[r.forcedWinRange] || c(a.data("visibility"), r) || "on";
            if ("off" == O || Q < r.hideCaptionAtLimit && "on" == a.data("captionhidden") || Q < r.hideAllCaptionAtLimit ? a.addClass("tp-hidden-caption") : a.removeClass("tp-hidden-caption"), a.data("layertype", "html"), 0 > s && (s = 0), void 0 != a.data("thumbimage") && void 0 == a.data("videoposter") && a.data("videoposter", a.data("thumbimage")), a.find("img").length > 0) {
                var H = a.find("img");
                a.data("layertype", "image"), 0 == H.width() && H.css({
                    width: "auto"
                }), 0 == H.height() && H.css({
                    height: "auto"
                }), void 0 == H.data("ww") && H.width() > 0 && H.data("ww", H.width()), void 0 == H.data("hh") && H.height() > 0 && H.data("hh", H.height());
                var B = H.data("ww"),
                    A = H.data("hh"),
                    D = "slide" == _ ? r.ulw : r.gridwidth[r.curWinRange],
                    F = "slide" == _ ? r.ulh : r.gridheight[r.curWinRange],
                    B = c(H.data("ww"), r)[r.curWinRange] || c(H.data("ww"), r) || "auto",
                    A = c(H.data("hh"), r)[r.curWinRange] || c(H.data("hh"), r) || "auto",
                    P = "full" === B || "full-proportional" === B,
                    X = "full" === A || "full-proportional" === A;
                if ("full-proportional" === B) {
                    var Y = H.data("owidth"),
                        V = H.data("oheight");
                    V / F > Y / D ? (B = D, A = V * (D / Y)) : (A = F, B = Y * (F / V))
                } else B = P ? D : parseFloat(B), A = X ? F : parseFloat(A);
                void 0 == B && (B = 0), void 0 == A && (A = 0), "off" !== k ? ("grid" != _ && P ? H.width(B) : H.width(B * r.bw), "grid" != _ && X ? H.height(A) : H.height(A * r.bh)) : (H.width(B), H.height(A))
            }
            "slide" === _ && (s = 0, f = 0);
            var N = "html5" == a.data("audio") ? "audio" : "video";
            if (a.hasClass("tp-videolayer") || a.hasClass("tp-audiolayer") || a.find("iframe").length > 0 || a.find(N).length > 0) {
                if (a.data("layertype", "video"), t.manageVideoLayer && t.manageVideoLayer(a, r, x, L), !x && !L) {
                    a.data("videotype");
                    t.resetVideo && t.resetVideo(a, r)
                }
                var $ = a.data("aspectratio");
                void 0 != $ && $.split(":").length > 1 && t.prepareCoveredVideo($, r, a);
                var H = a.find("iframe") ? a.find("iframe") : H = a.find(N),
                    Z = a.find("iframe") ? !1 : !0,
                    G = a.hasClass("coverscreenvideo");
                H.css({
                    display: "block"
                }), void 0 == a.data("videowidth") && (a.data("videowidth", H.width()), a.data("videoheight", H.height()));
                var U, B = c(a.data("videowidth"), r)[r.curWinRange] || c(a.data("videowidth"), r) || "auto",
                    A = c(a.data("videoheight"), r)[r.curWinRange] || c(a.data("videoheight"), r) || "auto";
                B = parseFloat(B), A = parseFloat(A), void 0 === a.data("cssobj") && (U = v(a, 0), a.data("cssobj", U));
                var q = u(a.data("cssobj"), r);
                if ("auto" == q.lineHeight && (q.lineHeight = q.fontSize + 4), a.hasClass("fullscreenvideo") || G) {
                    s = 0, f = 0, a.data("x", 0), a.data("y", 0);
                    var E = S;
                    "on" == r.autoHeight && (E = r.conh), a.css({
                        width: Q,
                        height: E
                    })
                } else punchgs.TweenLite.set(a, {
                    paddingTop: Math.round(q.paddingTop * r.bh) + "px",
                    paddingBottom: Math.round(q.paddingBottom * r.bh) + "px",
                    paddingLeft: Math.round(q.paddingLeft * r.bw) + "px",
                    paddingRight: Math.round(q.paddingRight * r.bw) + "px",
                    marginTop: q.marginTop * r.bh + "px",
                    marginBottom: q.marginBottom * r.bh + "px",
                    marginLeft: q.marginLeft * r.bw + "px",
                    marginRight: q.marginRight * r.bw + "px",
                    borderTopWidth: Math.round(q.borderTopWidth * r.bh) + "px",
                    borderBottomWidth: Math.round(q.borderBottomWidth * r.bh) + "px",
                    borderLeftWidth: Math.round(q.borderLeftWidth * r.bw) + "px",
                    borderRightWidth: Math.round(q.borderRightWidth * r.bw) + "px",
                    width: B * r.bw + "px",
                    height: A * r.bh + "px"
                });
                (0 == Z && !G || 1 != a.data("forcecover") && !a.hasClass("fullscreenvideo") && !G) && (H.width(B * r.bw), H.height(A * r.bh))
            }
            var J = a.data("slidelink") || !1;
            a.find(".tp-resizeme, .tp-resizeme *").each(function() {
                w(jQuery(this), r, "rekursive", k)
            }), a.hasClass("tp-resizeme") && a.find("*").each(function() {
                w(jQuery(this), r, "rekursive", k)
            }), w(a, r, 0, k);
            var K = a.outerHeight(),
                aa = a.css("backgroundColor");
            e(a, ".frontcorner", "left", "borderRight", "borderTopColor", K, aa), e(a, ".frontcornertop", "left", "borderRight", "borderBottomColor", K, aa), e(a, ".backcorner", "right", "borderLeft", "borderBottomColor", K, aa), e(a, ".backcornertop", "right", "borderLeft", "borderTopColor", K, aa), "on" == r.fullScreenAlignForce && (s = 0, f = 0);
            var ea = a.data("arrobj");
            if (void 0 === ea) {
                var ea = new Object;
                ea.voa = c(a.data("voffset"), r)[r.curWinRange] || c(a.data("voffset"), r)[0], ea.hoa = c(a.data("hoffset"), r)[r.curWinRange] || c(a.data("hoffset"), r)[0], ea.elx = c(a.data("x"), r)[r.curWinRange] || c(a.data("x"), r)[0], ea.ely = c(a.data("y"), r)[r.curWinRange] || c(a.data("y"), r)[0]
            }
            var ta = 0 == ea.voa.length ? 0 : ea.voa,
                ia = 0 == ea.hoa.length ? 0 : ea.hoa,
                na = 0 == ea.elx.length ? 0 : ea.elx,
                oa = 0 == ea.ely.length ? 0 : ea.ely,
                ra = a.outerWidth(!0),
                da = a.outerHeight(!0);
            0 == ra && 0 == da && (ra = r.ulw, da = r.ulh);
            var sa = "off" !== I ? parseInt(ta, 0) * r.bw : parseInt(ta, 0),
                la = "off" !== I ? parseInt(ia, 0) * r.bw : parseInt(ia, 0),
                pa = "grid" === _ ? r.gridwidth[r.curWinRange] * r.bw : Q,
                ha = "grid" === _ ? r.gridheight[r.curWinRange] * r.bw : S;
            "on" == r.fullScreenAlignForce && (pa = r.ulw, ha = r.ulh), na = "center" === na || "middle" === na ? pa / 2 - ra / 2 + la : "left" === na ? la : "right" === na ? pa - ra - la : "off" !== I ? na * r.bw : na, oa = "center" == oa || "middle" == oa ? ha / 2 - da / 2 + sa : "top" == oa ? sa : "bottom" == oa ? ha - da - sa : "off" !== I ? oa * r.bw : oa, z && !J && (na += ra), J && (na = 0);
            var ca = a.data("lasttriggerstate"),
                ga = a.data("triggerstate"),
                ma = void 0 != a.data("start") ? a.data("start") : 100,
                va = a.data("end"),
                ua = T ? 0 : "bytrigger" === ma || "sliderenter" === ma ? 0 : parseFloat(ma) / 1e3,
                fa = na + s,
                wa = oa + f,
                ya = a.css("z-Index");
            T || ("reset" == ca && "bytrigger" != ma ? (a.data("triggerstate", "on"), a.data("animdirection", "in"), ga = "on") : "reset" == ca && "bytrigger" == ma && (a.data("triggerstate", "off"), a.data("animdirection", "out"), ga = "off")), punchgs.TweenLite.set(j, {
                zIndex: ya,
                top: wa,
                left: fa,
                overwrite: "auto"
            }), 0 == W && (L = !0), void 0 == a.data("timeline") || L || (2 != W && a.data("timeline").gotoAndPlay(0), L = !0), !x && a.data("timeline_out") && 2 != W && 0 != W && (a.data("timeline_out").kill(), a.data("outstarted", 0)), T && void 0 != a.data("timeline") && (a.removeData("$anims"), a.data("timeline").pause(0), a.data("timeline").kill(), void 0 != a.data("newhoveranim") && (a.data("newhoveranim").progress(0), a.data("newhoveranim").kill()), a.removeData("timeline"), punchgs.TweenLite.killTweensOf(a), a.unbind("hover"), a.removeClass("rs-hover-ready"), a.removeData("newhoveranim"));
            var ba = a.data("timeline") ? a.data("timeline").time() : 0,
                xa = void 0 !== a.data("timeline") ? a.data("timeline").progress() : 0,
                Ta = a.data("timeline") || new punchgs.TimelineLite({
                    smoothChildTiming: !0
                });
            xa = jQuery.isNumeric(xa) ? xa : 0, Ta.pause();
            var La = {};
            if (La.svg = void 0 != a.data("svg_src") ? a.find("svg") : !1, 1 > xa && 1 != a.data("outstarted") || 2 == W || T) {
                var Wa = a;
                if (void 0 != a.data("mySplitText") && a.data("mySplitText").revert(), void 0 != a.data("splitin") && a.data("splitin").match(/chars|words|lines/g) || void 0 != a.data("splitout") && a.data("splitout").match(/chars|words|lines/g)) {
                    var ja = a.find("a").length > 0 ? a.find("a") : a;
                    a.data("mySplitText", new punchgs.SplitText(ja, {
                        type: "lines,words,chars",
                        charsClass: "tp-splitted tp-charsplit",
                        wordsClass: "tp-splitted tp-wordsplit",
                        linesClass: "tp-splitted tp-linesplit"
                    })), a.addClass("splitted")
                }
                void 0 !== a.data("mySplitText") && a.data("splitin") && a.data("splitin").match(/chars|words|lines/g) && (Wa = a.data("mySplitText")[a.data("splitin")]);
                var Ca = new Object;
                La.svg && (La.idle = o(a.data("svg_idle"), n()), punchgs.TweenLite.set(La.svg, La.idle.anim));
                var Ra = void 0 != a.data("transform_in") ? a.data("transform_in").match(/\(R\)/gi) : !1;
                if (!a.data("$anims") || T || Ra) {
                    var ka = i(),
                        Ia = i(),
                        _a = d(),
                        Qa = void 0 !== a.data("transform_hover") || void 0 !== a.data("style_hover");
                    Ia = p(Ia, a.data("transform_idle")), ka = p(Ia, a.data("transform_in"), 1 == r.sdir), Qa && (_a = p(_a, a.data("transform_hover")), _a = m(_a, a.data("style_hover")), La.svg && ($svghover = o(a.data("svg_hover"), n()), void 0 != _a.anim.color && ($svghover.anim.fill = _a.anim.color), a.data("hoversvg", $svghover)), a.data("hover", _a)), ka.elemdelay = void 0 == a.data("elementdelay") ? 0 : a.data("elementdelay"), Ia.anim.ease = ka.anim.ease = ka.anim.ease || punchgs.Power1.easeInOut, Qa && !a.hasClass("rs-hover-ready") && (a.addClass("rs-hover-ready"), a.hover(function(a) {
                        var e = jQuery(a.currentTarget),
                            t = e.data("hover"),
                            i = e.data("timeline");
                        i && 1 == i.progress() && (void 0 === e.data("newhoveranim") || "none" === e.data("newhoveranim") ? (e.data("newhoveranim", punchgs.TweenLite.to(e, t.speed, t.anim)), La.svg && e.data("newsvghoveranim", punchgs.TweenLite.to(La.svg, t.speed, e.data("hoversvg").anim))) : (e.data("newhoveranim").progress(0), e.data("newhoveranim").play(), La.svg && e.data("newsvghoveranim").progress(0).play()))
                    }, function(a) {
                        var e = jQuery(a.currentTarget),
                            t = e.data("timeline");
                        t && 1 == t.progress() && void 0 != e.data("newhoveranim") && (e.data("newhoveranim").reverse(), La.svg && e.data("newsvghoveranim").reverse())
                    })), Ca = new Object, Ca.f = ka, Ca.r = Ia, a.data("$anims")
                } else Ca = a.data("$anims");
                var Sa = h(a.data("mask_in")),
                    za = new punchgs.TimelineLite;
                if (Ca.f.anim.x = Ca.f.anim.x * r.bw || l(Ca.f.anim.x, r, ra, da, wa, fa, "horizontal"), Ca.f.anim.y = Ca.f.anim.y * r.bw || l(Ca.f.anim.y, r, ra, da, wa, fa, "vertical"), 2 != W || T) {
                    if (Wa != a) {
                        var Ma = Ca.r.anim.ease;
                        Ta.add(punchgs.TweenLite.set(a, Ca.r.anim)), Ca.r = i(), Ca.r.anim.ease = Ma
                    }
                    if (Ca.f.anim.visibility = "hidden", a.data("eow", ra), a.data("eoh", da), a.data("speed", Ca.f.speed), a.data("ease", Ca.r.anim.ease), za.eventCallback("onStart", function() {
                            punchgs.TweenLite.set(a, {
                                visibility: "visible"
                            }), a.data("iframes") && a.find("iframe").each(function() {
                                punchgs.TweenLite.set(jQuery(this), {
                                    autoAlpha: 1
                                })
                            }), punchgs.TweenLite.set(j, {
                                visibility: "visible"
                            });
                            var e = {};
                            e.layer = a, e.eventtype = "enterstage", e.layertype = a.data("layertype"), a.data("active", !0), e.layersettings = a.data(), r.c.trigger("revolution.layeraction", [e])
                        }), za.eventCallback("onComplete", function() {
                            var e = {};
                            e.layer = a, e.eventtype = "enteredstage", e.layertype = a.data("layertype"), e.layersettings = a.data(), r.c.trigger("revolution.layeraction", [e]), t.animcompleted(a, r)
                        }), "sliderenter" == ma && r.overcontainer && (ua = .6), Ta.add(za.staggerFromTo(Wa, Ca.f.speed, Ca.f.anim, Ca.r.anim, Ca.f.elemdelay), ua), Sa) {
                        var Oa = new Object;
                        Oa.ease = Ca.r.anim.ease, Oa.overflow = Sa.anim.overflow = "hidden", Oa.overwrite = "all", Oa.x = Oa.y = 0, Sa.anim.x = Sa.anim.x * r.bw || l(Sa.anim.x, r, ra, da, wa, fa, "horizontal"), Sa.anim.y = Sa.anim.y * r.bw || l(Sa.anim.y, r, ra, da, wa, fa, "vertical"), Ta.add(punchgs.TweenLite.fromTo(R, Ca.f.speed, Sa.anim, Oa, ka.elemdelay), ua)
                    } else Ta.add(punchgs.TweenLite.set(R, {
                        overflow: "visible"
                    }, ka.elemdelay), 0)
                }
                if (a.data("timeline", Ta), r.sliderscrope = void 0 === r.sliderscrope ? Math.round(99999 * Math.random()) : r.sliderscrope, W = g(a, r, "in"), void 0 === r.endtimeouts && (r.endtimeouts = []), (0 === xa || 2 == W) && "bytrigger" !== va && !T && "sliderleave" != va) {
                    if (void 0 != va && (-1 == W || 2 == W) && "bytriger" !== va) var Ha = setTimeout(function() {
                        t.endMoveCaption(a, R, j, r)
                    }, parseInt(a.data("end"), 0));
                    r.endtimeouts.push(Ha)
                }
                Ta = a.data("timeline"), "on" == a.data("loopanimation") && y(C, r.bw), ("sliderenter" != ma || "sliderenter" == ma && r.overcontainer) && (-1 == W || 1 == W || T || 0 == W && 1 > xa && a.hasClass("rev-static-visbile")) && (1 > xa && xa > 0 || 0 == xa && "bytrigger" != ma && "keep" != ca || 0 == xa && "bytrigger" != ma && "keep" == ca && "on" == ga || "bytrigger" == ma && "keep" == ca && "on" == ga) && (Ta.resume(ba), t.toggleState(a.data("layertoggledby")))
            }
            "on" == a.data("loopanimation") && punchgs.TweenLite.set(C, {
                minWidth: ra,
                minHeight: da
            }), 0 == a.data("slidelink") || 1 != a.data("slidelink") && !a.hasClass("slidelink") ? (punchgs.TweenLite.set(R, {
                width: "auto",
                height: "auto"
            }), a.data("slidelink", 0)) : (punchgs.TweenLite.set(R, {
                width: "100%",
                height: "100%"
            }), a.data("slidelink", 1))
        },
        endMoveCaption: function(a, e, n, o) {
            if (e = void 0 != e ? e : a.data("_mw"), n = void 0 != n ? n : a.data("_pw"), a.data("outstarted", 1), a.data("timeline")) a.data("timeline").pause();
            else if (void 0 === a.data("_pw")) return;
            var d = new punchgs.TimelineLite,
                s = new punchgs.TimelineLite,
                c = new punchgs.TimelineLite,
                g = p(i(), a.data("transform_in"), 1 == o.sdir),
                m = a.data("transform_out") ? p(r(), a.data("transform_out"), 1 == o.sdir) : p(r(), a.data("transform_in"), 1 == o.sdir),
                v = a.data("splitout") && a.data("splitout").match(/words|chars|lines/g) ? a.data("mySplitText")[a.data("splitout")] : a,
                u = void 0 == a.data("endelementdelay") ? 0 : a.data("endelementdelay"),
                f = a.innerWidth(),
                w = a.innerHeight(),
                y = n.position();
            a.data("transform_out") && a.data("transform_out").match(/auto:auto/g) && (g.speed = m.speed, g.anim.ease = m.anim.ease, m = g);
            var b = h(a.data("mask_out"));
            m.anim.x = m.anim.x * o.bw || l(m.anim.x, o, f, w, y.top, y.left, "horizontal"), m.anim.y = m.anim.y * o.bw || l(m.anim.y, o, f, w, y.top, y.left, "vertical"), s.eventCallback("onStart", function() {
                var e = {};
                e.layer = a, e.eventtype = "leavestage", e.layertype = a.data("layertype"), e.layersettings = a.data(), a.data("active", !1), o.c.trigger("revolution.layeraction", [e])
            }), s.eventCallback("onComplete", function() {
                punchgs.TweenLite.set(a, {
                    visibility: "hidden"
                }), punchgs.TweenLite.set(n, {
                    visibility: "hidden"
                });
                var e = {};
                e.layer = a, e.eventtype = "leftstage", a.data("active", !1), e.layertype = a.data("layertype"), e.layersettings = a.data(), o.c.trigger("revolution.layeraction", [e]), t.stopVideo && t.stopVideo(a, o)
            }), d.add(s.staggerTo(v, m.speed, m.anim, u), 0), b ? (b.anim.ease = m.anim.ease, b.anim.overflow = "hidden", b.anim.x = b.anim.x * o.bw || l(b.anim.x, o, f, w, y.top, y.left, "horizontal"), b.anim.y = b.anim.y * o.bw || l(b.anim.y, o, f, w, y.top, y.left, "vertical"), d.add(c.to(e, m.speed, b.anim, u), 0)) : d.add(c.set(e, {
                overflow: "visible",
                overwrite: "auto"
            }, u), 0), a.data("timeline_out", d)
        },
        removeTheCaptions: function(a, e) {
            var i = a.data("index"),
                n = new Array;
            e.layers[i] && jQuery.each(e.layers[i], function(a, e) {
                n.push(e)
            }), e.layers["static"] && jQuery.each(e.layers["static"], function(a, e) {
                n.push(e)
            }), e.endtimeouts && e.endtimeouts.length > 0 && jQuery.each(e.endtimeouts, function(a, e) {
                clearTimeout(e)
            }), e.endtimeouts = new Array, n && jQuery.each(n, function(a) {
                var i = jQuery(this),
                    n = g(i, e, "out");
                0 != n && (b(i), clearTimeout(i.data("videoplaywait")), t.stopVideo && t.stopVideo(i, e), t.endMoveCaption(i, null, null, e), t.removeMediaFromList && t.removeMediaFromList(i, e), e.lastplayedvideos = [])
            })
        }
    });
    var i = function() {
            var a = new Object;
            return a.anim = new Object, a.anim.x = 0, a.anim.y = 0, a.anim.z = 0, a.anim.rotationX = 0, a.anim.rotationY = 0, a.anim.rotationZ = 0, a.anim.scaleX = 1, a.anim.scaleY = 1, a.anim.skewX = 0, a.anim.skewY = 0, a.anim.opacity = 1, a.anim.transformOrigin = "50% 50%", a.anim.transformPerspective = 600, a.anim.rotation = 0, a.anim.ease = punchgs.Power3.easeOut, a.anim.force3D = "auto", a.speed = .3, a.anim.autoAlpha = 1, a.anim.visibility = "visible", a.anim.overwrite = "all", a
        },
        n = function() {
            var a = new Object;
            return a.anim = new Object, a.anim.stroke = "none", a.anim.strokeWidth = 0, a.anim.strokeDasharray = "none", a.anim.strokeDashoffset = "0", a
        },
        o = function(a, e) {
            var t = a.split(";");
            return t && jQuery.each(t, function(a, t) {
                var i = t.split(":"),
                    n = i[0],
                    o = i[1];
                "sc" == n && (e.anim.stroke = o), "sw" == n && (e.anim.strokeWidth = o), "sda" == n && (e.anim.strokeDasharray = o), "sdo" == n && (e.anim.strokeDashoffset = o)
            }), e
        },
        r = function() {
            var a = new Object;
            return a.anim = new Object, a.anim.x = 0, a.anim.y = 0, a.anim.z = 0, a
        },
        d = function() {
            var a = new Object;
            return a.anim = new Object, a.speed = .2, a
        },
        s = function(a, e) {
            if (jQuery.isNumeric(parseFloat(a))) return parseFloat(a);
            if (void 0 === a || "inherit" === a) return e;
            if (a.split("{").length > 1) {
                var t = a.split(","),
                    i = parseFloat(t[1].split("}")[0]);
                t = parseFloat(t[0].split("{")[1]), a = Math.random() * (i - t) + t
            }
            return a
        },
        l = function(a, e, t, i, n, o, r) {
            return !jQuery.isNumeric(a) && a.match(/%]/g) ? (a = a.split("[")[1].split("]")[0], "horizontal" == r ? a = (t + 2) * parseInt(a, 0) / 100 : "vertical" == r && (a = (i + 2) * parseInt(a, 0) / 100)) : (a = "layer_left" === a ? 0 - t : "layer_right" === a ? t : a, a = "layer_top" === a ? 0 - i : "layer_bottom" === a ? i : a, a = "left" === a || "stage_left" === a ? 0 - t - o : "right" === a || "stage_right" === a ? e.conw - o : "center" === a || "stage_center" === a ? e.conw / 2 - t / 2 - o : a, a = "top" === a || "stage_top" === a ? 0 - i - n : "bottom" === a || "stage_bottom" === a ? e.conh - n : "middle" === a || "stage_middle" === a ? e.conh / 2 - i / 2 - n : a), a
        },
        p = function(a, e, t) {
            var i = new Object;
            if (i = jQuery.extend(!0, {}, i, a), void 0 === e) return i;
            var n = e.split(";");
            return n && jQuery.each(n, function(a, e) {
                var n = e.split(":"),
                    o = n[0],
                    r = n[1];
                t && void 0 != r && r.length > 0 && r.match(/\(R\)/) && (r = r.replace("(R)", ""), r = "right" === r ? "left" : "left" === r ? "right" : "top" === r ? "bottom" : "bottom" === r ? "top" : r, "[" === r[0] && "-" === r[1] ? r = r.replace("[-", "[") : "[" === r[0] && "-" !== r[1] ? r = r.replace("[", "[-") : "-" === r[0] ? r = r.replace("-", "") : r[0].match(/[1-9]/) && (r = "-" + r)), void 0 != r && (r = r.replace(/\(R\)/, ""), ("rotationX" == o || "rX" == o) && (i.anim.rotationX = s(r, i.anim.rotationX) + "deg"), ("rotationY" == o || "rY" == o) && (i.anim.rotationY = s(r, i.anim.rotationY) + "deg"), ("rotationZ" == o || "rZ" == o) && (i.anim.rotation = s(r, i.anim.rotationZ) + "deg"), ("scaleX" == o || "sX" == o) && (i.anim.scaleX = s(r, i.anim.scaleX)), ("scaleY" == o || "sY" == o) && (i.anim.scaleY = s(r, i.anim.scaleY)), ("opacity" == o || "o" == o) && (i.anim.opacity = s(r, i.anim.opacity)), i.anim.opacity = 0 == i.anim.opacity ? 1e-4 : i.anim.opacity, ("skewX" == o || "skX" == o) && (i.anim.skewX = s(r, i.anim.skewX)), ("skewY" == o || "skY" == o) && (i.anim.skewY = s(r, i.anim.skewY)), "x" == o && (i.anim.x = s(r, i.anim.x)), "y" == o && (i.anim.y = s(r, i.anim.y)), "z" == o && (i.anim.z = s(r, i.anim.z)), ("transformOrigin" == o || "tO" == o) && (i.anim.transformOrigin = r.toString()), ("transformPerspective" == o || "tP" == o) && (i.anim.transformPerspective = parseInt(r, 0)), ("speed" == o || "s" == o) && (i.speed = parseFloat(r) / 1e3), ("ease" == o || "e" == o) && (i.anim.ease = r))
            }), i
        },
        h = function(a) {
            if (void 0 === a) return !1;
            var e = new Object;
            e.anim = new Object;
            var t = a.split(";");
            return t && jQuery.each(t, function(a, t) {
                t = t.split(":");
                var i = t[0],
                    n = t[1];
                "x" == i && (e.anim.x = n), "y" == i && (e.anim.y = n), "s" == i && (e.speed = parseFloat(n) / 1e3), ("e" == i || "ease" == i) && (e.anim.ease = n)
            }), e
        },
        c = function(a, e, t) {
            if (void 0 == a && (a = 0), !jQuery.isArray(a) && "string" === jQuery.type(a) && (a.split(",").length > 1 || a.split("[").length > 1)) {
                a = a.replace("[", ""), a = a.replace("]", "");
                var i = a.match(/'/g) ? a.split("',") : a.split(",");
                a = new Array, i && jQuery.each(i, function(e, t) {
                    t = t.replace("'", ""), t = t.replace("'", ""), a.push(t)
                })
            } else {
                var n = a;
                jQuery.isArray(a) || (a = new Array, a.push(n))
            }
            var n = a[a.length - 1];
            if (a.length < e.rle)
                for (var o = 1; o <= e.curWinRange; o++) a.push(n);
            return a
        },
        g = function(a, e, t, i) {
            var n = -1;
            if (a.hasClass("tp-static-layer")) {
                a.data("staticlayer", !0);
                var o = parseInt(a.data("startslide"), 0),
                    r = parseInt(a.data("endslide"), 0),
                    d = e.c.find(".processing-revslide").index(),
                    s = -1 != d ? d : e.c.find(".active-revslide").index();
                s = -1 == s ? 0 : s, "in" === t ? a.hasClass("rev-static-visbile") ? n = r == s || o > s || s > r ? 2 : 0 : s >= o && r >= s || o == s || r == s ? (i || (a.addClass("rev-static-visbile"), a.removeClass("rev-static-hidden")), n = 1) : n = 0 : a.hasClass("rev-static-visbile") ? o > s || s > r ? (n = 2, i || (a.removeClass("rev-static-visbile"), a.addClass("rev-static-hidden"))) : n = 0 : n = 2
            }
            return n
        },
        m = function(a, e) {
            if (void 0 === e) return a;
            e = e.replace("c:", "color:"), e = e.replace("bg:", "background-color:"), e = e.replace("bw:", "border-width:"), e = e.replace("bc:", "border-color:"), e = e.replace("br:", "borderRadius:"), e = e.replace("bs:", "border-style:"), e = e.replace("td:", "text-decoration:");
            var t = e.split(";");
            return t && jQuery.each(t, function(e, t) {
                var i = t.split(":");
                i[0].length > 0 && (a.anim[i[0]] = i[1])
            }), a
        },
        v = function(a, e) {
            var t, i = new Object,
                n = !1;
            if ("rekursive" == e && (t = a.closest(".tp-caption"), t && a.css("fontSize") === t.css("fontSize") && (n = !0)), i.basealign = a.data("basealign") || "grid", i.fontSize = n ? void 0 === t.data("fontsize") ? parseInt(t.css("fontSize"), 0) || 0 : t.data("fontsize") : void 0 === a.data("fontsize") ? parseInt(a.css("fontSize"), 0) || 0 : a.data("fontsize"), i.fontWeight = n ? void 0 === t.data("fontweight") ? parseInt(t.css("fontWeight"), 0) || 0 : t.data("fontweight") : void 0 === a.data("fontweight") ? parseInt(a.css("fontWeight"), 0) || 0 : a.data("fontweight"), i.whiteSpace = n ? void 0 === t.data("whitespace") ? t.css("whitespace") || "normal" : t.data("whitespace") : void 0 === a.data("whitespace") ? a.css("whitespace") || "normal" : a.data("whitespace"), -1 !== jQuery.inArray(a.data("layertype"), ["video", "image", "audio"]) || a.is("img") ? i.lineHeight = 0 : i.lineHeight = n ? void 0 === t.data("lineheight") ? parseInt(t.css("lineHeight"), 0) || 0 : t.data("lineheight") : void 0 === a.data("lineheight") ? parseInt(a.css("lineHeight"), 0) || 0 : a.data("lineheight"), i.letterSpacing = n ? void 0 === t.data("letterspacing") ? parseFloat(t.css("letterSpacing"), 0) || 0 : t.data("letterspacing") : void 0 === a.data("letterspacing") ? parseFloat(a.css("letterSpacing")) || 0 : a.data("letterspacing"), i.paddingTop = void 0 === a.data("paddingtop") ? parseInt(a.css("paddingTop"), 0) || 0 : a.data("paddingtop"), i.paddingBottom = void 0 === a.data("paddingbottom") ? parseInt(a.css("paddingBottom"), 0) || 0 : a.data("paddingbottom"), i.paddingLeft = void 0 === a.data("paddingleft") ? parseInt(a.css("paddingLeft"), 0) || 0 : a.data("paddingleft"), i.paddingRight = void 0 === a.data("paddingright") ? parseInt(a.css("paddingRight"), 0) || 0 : a.data("paddingright"), i.marginTop = void 0 === a.data("margintop") ? parseInt(a.css("marginTop"), 0) || 0 : a.data("margintop"), i.marginBottom = void 0 === a.data("marginbottom") ? parseInt(a.css("marginBottom"), 0) || 0 : a.data("marginbottom"), i.marginLeft = void 0 === a.data("marginleft") ? parseInt(a.css("marginLeft"), 0) || 0 : a.data("marginleft"), i.marginRight = void 0 === a.data("marginright") ? parseInt(a.css("marginRight"), 0) || 0 : a.data("marginright"), i.borderTopWidth = void 0 === a.data("bordertopwidth") ? parseInt(a.css("borderTopWidth"), 0) || 0 : a.data("bordertopwidth"), i.borderBottomWidth = void 0 === a.data("borderbottomwidth") ? parseInt(a.css("borderBottomWidth"), 0) || 0 : a.data("borderbottomwidth"), i.borderLeftWidth = void 0 === a.data("borderleftwidth") ? parseInt(a.css("borderLeftWidth"), 0) || 0 : a.data("borderleftwidth"), i.borderRightWidth = void 0 === a.data("borderrightwidth") ? parseInt(a.css("borderRightWidth"), 0) || 0 : a.data("borderrightwidth"), "rekursive" != e) {
                if (i.color = void 0 === a.data("color") ? "nopredefinedcolor" : a.data("color"), i.whiteSpace = n ? void 0 === t.data("whitespace") ? t.css("whiteSpace") || "nowrap" : t.data("whitespace") : void 0 === a.data("whitespace") ? a.css("whiteSpace") || "nowrap" : a.data("whitespace"), i.minWidth = void 0 === a.data("width") ? parseInt(a.css("minWidth"), 0) || 0 : a.data("width"), i.minHeight = void 0 === a.data("height") ? parseInt(a.css("minHeight"), 0) || 0 : a.data("height"), void 0 != a.data("videowidth") && void 0 != a.data("videoheight")) {
                    var o = a.data("videowidth"),
                        r = a.data("videoheight");
                    o = "100%" === o ? "none" : o, r = "100%" === r ? "none" : r, a.data("width", o), a.data("height", r)
                }
                i.maxWidth = void 0 === a.data("width") ? parseInt(a.css("maxWidth"), 0) || "none" : a.data("width"), i.maxHeight = void 0 === a.data("height") ? parseInt(a.css("maxHeight"), 0) || "none" : a.data("height"), i.wan = void 0 === a.data("wan") ? parseInt(a.css("-webkit-transition"), 0) || "none" : a.data("wan"), i.moan = void 0 === a.data("moan") ? parseInt(a.css("-moz-animation-transition"), 0) || "none" : a.data("moan"), i.man = void 0 === a.data("man") ? parseInt(a.css("-ms-animation-transition"), 0) || "none" : a.data("man"), i.ani = void 0 === a.data("ani") ? parseInt(a.css("transition"), 0) || "none" : a.data("ani")
            }
            return i.styleProps = a.css(["background-color", "border-top-color", "border-bottom-color", "border-right-color", "border-left-color", "border-top-style", "border-bottom-style", "border-left-style", "border-right-style", "border-left-width", "border-right-width", "border-bottom-width", "border-top-width", "color", "text-decoration", "font-style", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]), i
        },
        u = function(a, e) {
            var t = new Object;
            return a && jQuery.each(a, function(i, n) {
                t[i] = c(n, e)[e.curWinRange] || a[i]
            }), t
        },
        f = function(a, e, t, i) {
            return a = jQuery.isNumeric(a) ? a * e + "px" : a, a = "full" === a ? i : "auto" === a || "none" === a ? t : a
        },
        w = function(a, e, t, i) {
            var n;
            try {
                if ("BR" == a[0].nodeName || "br" == a[0].tagName) return !1
            } catch (o) {}
            void 0 === a.data("cssobj") ? (n = v(a, t), a.data("cssobj", n)) : n = a.data("cssobj");
            var r = u(n, e),
                d = e.bw,
                s = e.bh;
            if ("off" === i && (d = 1, s = 1), "auto" == r.lineHeight && (r.lineHeight = r.fontSize + 4), !a.hasClass("tp-splitted")) {
                a.css("-webkit-transition", "none"), a.css("-moz-transition", "none"), a.css("-ms-transition", "none"), a.css("transition", "none");
                var l = void 0 !== a.data("transform_hover") || void 0 !== a.data("style_hover");
                if (l && punchgs.TweenLite.set(a, r.styleProps), punchgs.TweenLite.set(a, {
                        fontSize: Math.round(r.fontSize * d) + "px",
                        fontWeight: r.fontWeight,
                        letterSpacing: Math.floor(r.letterSpacing * d) + "px",
                        paddingTop: Math.round(r.paddingTop * s) + "px",
                        paddingBottom: Math.round(r.paddingBottom * s) + "px",
                        paddingLeft: Math.round(r.paddingLeft * d) + "px",
                        paddingRight: Math.round(r.paddingRight * d) + "px",
                        marginTop: r.marginTop * s + "px",
                        marginBottom: r.marginBottom * s + "px",
                        marginLeft: r.marginLeft * d + "px",
                        marginRight: r.marginRight * d + "px",
                        borderTopWidth: Math.round(r.borderTopWidth * s) + "px",
                        borderBottomWidth: Math.round(r.borderBottomWidth * s) + "px",
                        borderLeftWidth: Math.round(r.borderLeftWidth * d) + "px",
                        borderRightWidth: Math.round(r.borderRightWidth * d) + "px",
                        lineHeight: Math.round(r.lineHeight * s) + "px",
                        overwrite: "auto"
                    }), "rekursive" != t) {
                    var p = "slide" == r.basealign ? e.ulw : e.gridwidth[e.curWinRange],
                        h = "slide" == r.basealign ? e.ulh : e.gridheight[e.curWinRange],
                        c = f(r.maxWidth, d, "none", p),
                        g = f(r.maxHeight, s, "none", h),
                        m = f(r.minWidth, d, "0px", p),
                        w = f(r.minHeight, s, "0px", h);
                    punchgs.TweenLite.set(a, {
                        maxWidth: c,
                        maxHeight: g,
                        minWidth: m,
                        minHeight: w,
                        whiteSpace: r.whiteSpace,
                        overwrite: "auto"
                    }), "nopredefinedcolor" != r.color && punchgs.TweenLite.set(a, {
                        color: r.color,
                        overwrite: "auto"
                    }), void 0 != a.data("svg_src") && ("nopredefinedcolor" != r.color ? punchgs.TweenLite.set(a.find("svg"), {
                        fill: r.color,
                        overwrite: "auto"
                    }) : punchgs.TweenLite.set(a.find("svg"), {
                        fill: r.styleProps.color,
                        overwrite: "auto"
                    }))
                }
                setTimeout(function() {
                    a.css("-webkit-transition", a.data("wan")), a.css("-moz-transition", a.data("moan")), a.css("-ms-transition", a.data("man")), a.css("transition", a.data("ani"))
                }, 30)
            }
        },
        y = function(a, e) {
            if (a.hasClass("rs-pendulum") && void 0 == a.data("loop-timeline")) {
                a.data("loop-timeline", new punchgs.TimelineLite);
                var t = void 0 == a.data("startdeg") ? -20 : a.data("startdeg"),
                    i = void 0 == a.data("enddeg") ? 20 : a.data("enddeg"),
                    n = void 0 == a.data("speed") ? 2 : a.data("speed"),
                    o = void 0 == a.data("origin") ? "50% 50%" : a.data("origin"),
                    r = void 0 == a.data("easing") ? punchgs.Power2.easeInOut : a.data("ease");
                t *= e, i *= e, a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    rotation: t,
                    transformOrigin: o
                }, {
                    rotation: i,
                    ease: r
                })), a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    rotation: i,
                    transformOrigin: o
                }, {
                    rotation: t,
                    ease: r,
                    onComplete: function() {
                        a.data("loop-timeline").restart()
                    }
                }))
            }
            if (a.hasClass("rs-rotate") && void 0 == a.data("loop-timeline")) {
                a.data("loop-timeline", new punchgs.TimelineLite);
                var t = void 0 == a.data("startdeg") ? 0 : a.data("startdeg"),
                    i = void 0 == a.data("enddeg") ? 360 : a.data("enddeg");
                n = void 0 == a.data("speed") ? 2 : a.data("speed"), o = void 0 == a.data("origin") ? "50% 50%" : a.data("origin"), r = void 0 == a.data("easing") ? punchgs.Power2.easeInOut : a.data("easing"), t *= e, i *= e, a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    rotation: t,
                    transformOrigin: o
                }, {
                    rotation: i,
                    ease: r,
                    onComplete: function() {
                        a.data("loop-timeline").restart()
                    }
                }))
            }
            if (a.hasClass("rs-slideloop") && void 0 == a.data("loop-timeline")) {
                a.data("loop-timeline", new punchgs.TimelineLite);
                var d = void 0 == a.data("xs") ? 0 : a.data("xs"),
                    s = void 0 == a.data("ys") ? 0 : a.data("ys"),
                    l = void 0 == a.data("xe") ? 0 : a.data("xe"),
                    p = void 0 == a.data("ye") ? 0 : a.data("ye"),
                    n = void 0 == a.data("speed") ? 2 : a.data("speed"),
                    r = void 0 == a.data("easing") ? punchgs.Power2.easeInOut : a.data("easing");
                d *= e, s *= e, l *= e, p *= e, a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    x: d,
                    y: s
                }, {
                    x: l,
                    y: p,
                    ease: r
                })), a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    x: l,
                    y: p
                }, {
                    x: d,
                    y: s,
                    onComplete: function() {
                        a.data("loop-timeline").restart()
                    }
                }))
            }
            if (a.hasClass("rs-pulse") && void 0 == a.data("loop-timeline")) {
                a.data("loop-timeline", new punchgs.TimelineLite);
                var h = void 0 == a.data("zoomstart") ? 0 : a.data("zoomstart"),
                    c = void 0 == a.data("zoomend") ? 0 : a.data("zoomend"),
                    n = void 0 == a.data("speed") ? 2 : a.data("speed"),
                    r = void 0 == a.data("easing") ? punchgs.Power2.easeInOut : a.data("easing");
                a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    scale: h
                }, {
                    scale: c,
                    ease: r
                })), a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(a, n, {
                    force3D: "auto",
                    scale: c
                }, {
                    scale: h,
                    onComplete: function() {
                        a.data("loop-timeline").restart()
                    }
                }))
            }
            if (a.hasClass("rs-wave") && void 0 == a.data("loop-timeline")) {
                a.data("loop-timeline", new punchgs.TimelineLite);
                var g = void 0 == a.data("angle") ? 10 : parseInt(a.data("angle"), 0),
                    m = void 0 == a.data("radius") ? 10 : parseInt(a.data("radius"), 0),
                    n = void 0 == a.data("speed") ? -20 : a.data("speed"),
                    o = void 0 == a.data("origin") ? "50% 50%" : a.data("origin"),
                    v = o.split(" "),
                    u = new Object;
                v.length >= 1 ? (u.x = v[0], u.y = v[1]) : (u.x = "50%", u.y = "50%"), g *= e, m *= e;
                var f = 0 - a.height() / 2 + m * (-1 + parseInt(u.y, 0) / 100),
                    w = a.width() * (-.5 + parseInt(u.x, 0) / 100),
                    y = {
                        a: 0,
                        ang: g,
                        element: a,
                        unit: m,
                        xoffset: w,
                        yoffset: f
                    };
                a.data("loop-timeline").append(new punchgs.TweenLite.fromTo(y, n, {
                    a: 360
                }, {
                    a: 0,
                    force3D: "auto",
                    ease: punchgs.Linear.easeNone,
                    onUpdate: function() {
                        var a = (y.a + y.ang) * (Math.PI / 180);
                        punchgs.TweenLite.to(y.element, .1, {
                            force3D: "auto",
                            x: y.xoffset + Math.cos(a) * y.unit,
                            y: y.unit * (1 - Math.sin(a)) + y.yoffset / .5
                        })
                    },
                    onComplete: function() {
                        a.data("loop-timeline").restart()
                    }
                }))
            }
        },
        b = function(a) {
            a.find(".rs-pendulum, .rs-slideloop, .rs-pulse, .rs-wave").each(function() {
                var a = jQuery(this);
                void 0 != a.data("loop-timeline") && (a.data("loop-timeline").pause(), a.data("loop-timeline", null))
            })
        }
}(jQuery);