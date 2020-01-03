var smartdots2 = (function(t) {
  var e = {};
  function r(n) {
    if (e[n]) return e[n].exports;
    var o = (e[n] = { i: n, l: !1, exports: {} });
    return t[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
  }
  return (
    (r.m = t),
    (r.c = e),
    (r.d = function(t, e, n) {
      r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (r.r = function(t) {
      'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (r.t = function(t, e) {
      if ((1 & e && (t = r(t)), 8 & e)) return t;
      if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if ((r.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: t }), 2 & e && 'string' != typeof t))
        for (var o in t)
          r.d(
            n,
            o,
            function(e) {
              return t[e];
            }.bind(null, o)
          );
      return n;
    }),
    (r.n = function(t) {
      var e =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return r.d(e, 'a', e), e;
    }),
    (r.o = function(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (r.p = ''),
    r((r.s = 0))
  );
})([
  function(t, e, r) {
    'use strict';
    r.r(e);
    const n = [100, 100],
      o = (t, e) => Math.random() * (e - t) + t,
      a = t => {
        let e = [0, 0],
          r = [0, 0],
          n = 0;
        const o = [];
        return (
          t.forEach(t => {
            (r = [r[0] + t[0], r[1] + t[1]]),
              (n = Math.sqrt(r[0] ** 2 + r[1] ** 2)),
              n > 0.75 && (r = [(r[0] / n) * 0.75, (r[0] / n) * 0.75]),
              o.push([e[0] + r[0], e[1] + r[1]]),
              (e = o.slice(-1)[0]);
          }),
          o
        );
      },
      i = (t, e) => 1 / (1 + ((t, e) => Math.sqrt((t[0] - e[0]) ** 2 + (t[1] - e[1]) ** 2))(t, e)),
      u = new (class {
        constructor({ initialStateGenerator: t, mutator: e, fitnessEvaluator: r }) {
          (this.initialStateGenerator = t), (this.mutator = e), (this.fitnessEvaluator = r);
        }
        *optimize() {
          let t = this.initialStateGenerator();
          for (;;) {
            let e = Number.NEGATIVE_INFINITY;
            const r = t.reduce((t, r) => {
              let n = this.fitnessEvaluator(r);
              return (t = n > e ? r : t), (e = n > e ? n : e), t;
            });
            yield { bestState: r, population: t }, (t = this.mutator(r));
          }
        }
      })({
        initialStateGenerator: () =>
          Array(200)
            .fill(0)
            .map(() =>
              Array(500)
                .fill(0)
                .map(() => [o(-0.75, 0.75), o(-0.75, 0.75)])
            ),
        mutator: t => {
          const e = Array(200)
            .fill(0)
            .map(() => t.slice().map(t => (Math.random() < 0.5 ? [t[0] + o(-0.1, 0.1), t[1] + o(-0.1, 0.1)] : t)));
          return e.push(t), e;
        },
        fitnessEvaluator: t => {
          return a(t)
            .map(t => i(t, n))
            .reduce((t, e) => (t = e > t ? e : t), Number.NEGATIVE_INFINITY);
        }
      }).optimize();
    e.default = function*() {
      for (;;) {
        const t = u.next().value;
        yield { positions: a(t.bestState), popPos: t.population.map(t => a(t)) };
      }
    };
  }
]);
