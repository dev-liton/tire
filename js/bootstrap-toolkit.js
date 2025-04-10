/*!
 * Responsive Bootstrap Toolkit
 * Author:    Maciej Gurban
 * License:   MIT
 * Version:   2.6.3 (2016-06-21)
 * Origin:    https://github.com/maciej-gurban/responsive-bootstrap-toolkit
 */
var ResponsiveBootstrapToolkit = function(i) {
    var e = {
            detectionDivs: {
                bootstrap: {
                    xs: i('<div class="device-xs visible-xs visible-xs-block"></div>'),
                    sm: i('<div class="device-sm visible-sm visible-sm-block"></div>'),
                    md: i('<div class="device-md visible-md visible-md-block"></div>'),
                    lg: i('<div class="device-lg visible-lg visible-lg-block"></div>')
                },
                foundation: {
                    small: i('<div class="device-xs show-for-small-only"></div>'),
                    medium: i('<div class="device-sm show-for-medium-only"></div>'),
                    large: i('<div class="device-md show-for-large-only"></div>'),
                    xlarge: i('<div class="device-lg show-for-xlarge-only"></div>')
                }
            },
            applyDetectionDivs: function() {
                i(document).ready(function() {
                    i.each(o.breakpoints, function(i) {
                        o.breakpoints[i].appendTo(".responsive-bootstrap-toolkit")
                    })
                })
            },
            isAnExpression: function(i) {
                return "<" == i.charAt(0) || ">" == i.charAt(0)
            },
            splitExpression: function(i) {
                var e = i.charAt(0),
                    o = "=" == i.charAt(1),
                    s = 1 + (o ? 1 : 0),
                    n = i.slice(s);
                return {
                    operator: e,
                    orEqual: o,
                    breakpointName: n
                }
            },
            isAnyActive: function(e) {
                var s = !1;
                return i.each(e, function(i, e) {
                    return o.breakpoints[e].is(":visible") ? (s = !0, !1) : void 0
                }), s
            },
            isMatchingExpression: function(i) {
                var s = e.splitExpression(i),
                    n = Object.keys(o.breakpoints),
                    r = n.indexOf(s.breakpointName);
                if (-1 !== r) {
                    var t = 0,
                        a = 0;
                    "<" == s.operator && (t = 0, a = s.orEqual ? ++r : r), ">" == s.operator && (t = s.orEqual ? r : ++r, a = void 0);
                    var l = n.slice(t, a);
                    return e.isAnyActive(l)
                }
            }
        },
        o = {
            interval: 300,
            framework: null,
            breakpoints: null,
            is: function(i) {
                return e.isAnExpression(i) ? e.isMatchingExpression(i) : o.breakpoints[i] && o.breakpoints[i].is(":visible")
            },
            use: function(i, s) {
                o.framework = i.toLowerCase(), "bootstrap" === o.framework || "foundation" === o.framework ? o.breakpoints = e.detectionDivs[o.framework] : o.breakpoints = s, e.applyDetectionDivs()
            },
            current: function() {
                var e = "unrecognized";
                return i.each(o.breakpoints, function(i) {
                    o.is(i) && (e = i)
                }), e
            },
            changed: function(i, e) {
                var s;
                return function() {
                    clearTimeout(s), s = setTimeout(function() {
                        i()
                    }, e || o.interval)
                }
            }
        };
    return i(document).ready(function() {
        i('<div class="responsive-bootstrap-toolkit"></div>').appendTo("body")
    }), null === o.framework && o.use("bootstrap"), o
}(jQuery);
"undefined" != typeof module && module.exports && (module.exports = ResponsiveBootstrapToolkit);