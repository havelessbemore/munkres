/*! munkres
https://github.com/havelessbemore/munkres

MIT License

Copyright (C) 2024-2024 Michael Rojas <dev.michael.rojas@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
function M(n) {
  const t = n.length, e = new Array(t);
  for (let r = 0; r < t; ++r)
    e[r] = n[r].slice(0);
  return e;
}
function N(n, t, e) {
  const r = n.length, s = t.length, o = new Array(r);
  for (let c = 0; c < r; ++c) {
    const f = new Array(s);
    for (let i = 0; i < s; ++i)
      f[i] = e(n[c], t[i]);
    o[c] = f;
  }
  return o;
}
function C(n) {
  const t = n.length;
  for (let e = 0; e < t; ++e)
    n[e].reverse();
}
function v(n) {
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || e <= 0)
    return;
  let r = n[0][0];
  for (let o = 0; o < t; ++o) {
    const c = n[o];
    for (let f = 0; f < e; ++f)
      r < c[f] && (r = c[f]);
  }
  return r;
}
function E(n) {
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || e <= 0)
    return;
  let r = n[0][0];
  for (let o = 0; o < t; ++o) {
    const c = n[o];
    for (let f = 0; f < e; ++f)
      r > c[f] && (r = c[f]);
  }
  return r;
}
function b(n, t) {
  var s;
  const e = n.length, r = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (!(e <= 0 || r <= 0)) {
    t = t ?? v(n);
    for (let o = 0; o < e; ++o) {
      const c = n[o];
      for (let f = 0; f < r; ++f)
        c[f] = t - c[f];
    }
  }
}
function R(n) {
  var r;
  const t = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  for (let s = 0; s < t; ++s) {
    const o = n[s];
    for (let c = 0; c < e; ++c)
      o[c] = -o[c];
  }
}
function Y(n) {
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0, r = Math.min(t, e);
  for (let o = 1; o < r; ++o)
    for (let c = 0; c < o; ++c) {
      const f = n[o][c];
      n[o][c] = n[c][o], n[c][o] = f;
    }
  if (t > e) {
    for (let o = 0; o < e; ++o) {
      const c = n[o];
      c.length = t;
      for (let f = e; f < t; ++f)
        c[f] = n[f][o];
    }
    n.length = e;
  }
  if (t < e) {
    n.length = e;
    for (let o = t; o < e; ++o) {
      const c = new Array(t);
      for (let f = 0; f < t; ++f)
        c[f] = n[f][o];
      n[o] = c;
    }
    for (let o = 0; o < t; ++o)
      n[o].length = t;
  }
}
function V(n, t, e) {
  return N(n, t, e);
}
function x(n) {
  return v(n);
}
function k(n) {
  return E(n);
}
function d(n, t) {
  b(n, t);
}
function a(n) {
  R(n);
}
function T(n) {
  const t = n.length, e = new Array(t);
  for (let r = 0; r < t; ++r)
    e[r] = [r, n[r]];
  return e;
}
function $(n) {
  const t = n.length;
  if (t <= 0)
    return;
  let e = n[0];
  for (let r = 1; r < t; ++r)
    e > n[r] && (e = n[r]);
  return e;
}
function B(n) {
  return typeof n == "bigint";
}
function H(n) {
  var r;
  const t = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  return t > e && (n = M(n), Y(n)), I(n);
}
function I(n) {
  var i;
  const t = n.length, e = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  if (t <= 0 || e <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const r = new Array(e), s = new Array(t);
  j(n, r, s);
  const o = new Array(e).fill(-1), c = new Array(t).fill(-1), f = q(n, r, s, o, c);
  return z(t - f, n, r, s, o, c), { dualX: r, dualY: s, starsX: o, starsY: c };
}
function j(n, t, e) {
  const r = t.length, s = e.length;
  for (let f = 0; f < s; ++f)
    e[f] = $(n[f]);
  if (s < r) {
    t.fill(0);
    return;
  }
  let o = e[0], c = n[0];
  for (let f = 0; f < r; ++f)
    t[f] = c[f] === o ? 0 : c[f] - o;
  for (let f = 1; f < s; ++f) {
    o = e[f], c = n[f];
    for (let i = 0; i < r; ++i) {
      const h = c[i] === o ? 0 : c[i] - o;
      h < t[i] && (t[i] = h);
    }
  }
}
function q(n, t, e, r, s) {
  const o = t.length, c = e.length;
  let f = 0;
  for (let i = 0; i < c; ++i) {
    const h = -e[i], l = n[i];
    for (let g = 0; g < o; ++g) {
      const w = t[g] === h ? 0 : t[g] - h;
      if (r[g] === -1 && l[g] === w) {
        r[g] = i, s[i] = g, ++f;
        break;
      }
    }
  }
  return f;
}
function z(n, t, e, r, s, o) {
  if (n <= 0)
    return;
  const c = e.length, f = r.length, i = new Uint32Array(f), h = new Uint32Array(c), l = new Array(c).fill(0), g = new Uint32Array(c);
  for (let w = 0; n > 0; ++w) {
    if (o[w] !== -1)
      continue;
    let u = 0;
    g.fill(w), i[w] = n;
    let y = G(w, t, e, r, h, l);
    for (; ; ) {
      u >= y && (y = D(
        F(y, h, l),
        n,
        y,
        i,
        e,
        r,
        h,
        l
      ));
      const A = h[u++];
      if (s[A] === -1) {
        U(A, g, s, o), --n;
        break;
      }
      const p = s[A];
      i[p] = n, y = J(
        p,
        y,
        t,
        e,
        r,
        h,
        l,
        g
      );
    }
  }
}
function U(n, t, e, r) {
  do {
    const s = t[n], o = r[s];
    e[n] = s, r[s] = n, n = o;
  } while (n !== -1);
}
function D(n, t, e, r, s, o, c, f) {
  const i = s.length, h = o.length;
  for (let l = 0; l < e; ++l) {
    const g = c[l];
    s[g] = s[g] === n ? 0 : s[g] - n;
  }
  for (let l = e; l < i; ++l) {
    const g = c[l];
    f[g] === n ? (c[l] = c[e], c[e++] = g) : f[g] -= n;
  }
  n = -n;
  for (let l = 0; l < h; ++l)
    r[l] === t && (o[l] = o[l] === n ? 0 : o[l] - n);
  return e;
}
function F(n, t, e) {
  const r = t.length;
  let s = e[t[n]];
  for (let o = n + 1; o < r; ++o)
    e[t[o]] < s && (s = e[t[o]]);
  return s;
}
function G(n, t, e, r, s, o) {
  const c = -r[n], f = t[n], i = e.length;
  let h = 0;
  for (let l = 0; l < i; ++l) {
    s[l] = l;
    const g = e[l] === c ? 0 : e[l] - c;
    f[l] === g ? (s[l] = s[h], s[h++] = l) : o[l] = f[l] - g;
  }
  return h;
}
function J(n, t, e, r, s, o, c, f) {
  const i = -s[n], h = e[n], l = f.length;
  for (let g = t; g < l; ++g) {
    const w = o[g];
    let u = r[w] === i ? 0 : r[w] - i;
    h[w] === u ? (o[g] = o[t], o[t++] = w, f[w] = n) : (u = h[w] - u, u < c[w] && (c[w] = u, f[w] = n));
  }
  return t;
}
function K(n) {
  var r;
  const t = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  return t > e && (n = M(n), Y(n)), L(n);
}
function L(n) {
  var i;
  const t = n.length, e = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  if (t <= 0 || e <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const r = new Array(e), s = new Array(t);
  O(n, r, s);
  const o = new Array(e).fill(-1), c = new Array(t).fill(-1), f = P(n, r, s, o, c);
  return Q(t - f, n, r, s, o, c), { dualX: r, dualY: s, starsX: o, starsY: c };
}
function O(n, t, e) {
  const r = t.length, s = e.length;
  for (let f = 0; f < s; ++f)
    e[f] = $(n[f]);
  if (s < r) {
    t.fill(0n);
    return;
  }
  let o = e[0], c = n[0];
  for (let f = 0; f < r; ++f)
    t[f] = c[f] - o;
  for (let f = 1; f < s; ++f) {
    o = e[f], c = n[f];
    for (let i = 0; i < r; ++i) {
      const h = c[i] - o;
      h < t[i] && (t[i] = h);
    }
  }
}
function P(n, t, e, r, s) {
  const o = t.length, c = e.length;
  let f = 0;
  for (let i = 0; i < c; ++i) {
    const h = -e[i], l = n[i];
    for (let g = 0; g < o; ++g)
      if (r[g] === -1 && l[g] === t[g] - h) {
        r[g] = i, s[i] = g, ++f;
        break;
      }
  }
  return f;
}
function Q(n, t, e, r, s, o) {
  if (n <= 0)
    return;
  const c = e.length, f = r.length, i = new Uint32Array(f), h = new Uint32Array(c), l = new Array(c), g = new Uint32Array(c);
  for (let w = 0; n > 0; ++w) {
    if (o[w] !== -1)
      continue;
    let u = 0;
    g.fill(w), i[w] = n;
    let y = _(w, t, e, r, h, l);
    for (; ; ) {
      u >= y && (y = W(
        Z(y, h, l),
        n,
        y,
        i,
        e,
        r,
        h,
        l
      ));
      const A = h[u++];
      if (s[A] === -1) {
        U(A, g, s, o), --n;
        break;
      }
      const p = s[A];
      i[p] = n, y = X(
        p,
        y,
        t,
        e,
        r,
        h,
        l,
        g
      );
    }
  }
}
function W(n, t, e, r, s, o, c, f) {
  const i = s.length, h = o.length;
  for (let l = 0; l < e; ++l)
    s[c[l]] -= n;
  for (let l = e; l < i; ++l) {
    const g = c[l];
    f[g] -= n, f[g] === 0n && (c[l] = c[e], c[e++] = g);
  }
  for (let l = 0; l < h; ++l)
    r[l] === t && (o[l] += n);
  return e;
}
function Z(n, t, e) {
  const r = t.length;
  let s = e[t[n]];
  for (let o = n + 1; o < r; ++o)
    e[t[o]] < s && (s = e[t[o]]);
  return s;
}
function _(n, t, e, r, s, o) {
  const c = r[n], f = t[n], i = e.length;
  let h = 0;
  for (let l = 0; l < i; ++l)
    s[l] = l, o[l] = f[l] - e[l] - c, o[l] === 0n && (s[l] = s[h], s[h++] = l);
  return h;
}
function X(n, t, e, r, s, o, c, f) {
  const i = s[n], h = e[n], l = f.length;
  for (let g = t; g < l; ++g) {
    const w = o[g], u = h[w] - r[w] - i;
    u < c[w] && (u === 0n ? (o[g] = o[t], o[t++] = w, f[w] = n) : (c[w] = u, f[w] = n));
  }
  return t;
}
function S(n) {
  return B((n[0] ?? [])[0]) ? K(n) : H(n);
}
function m(n) {
  var r;
  const { starsY: t } = S(n), e = T(t);
  return n.length > (((r = n[0]) == null ? void 0 : r.length) ?? 0) && C(e), e;
}
export {
  V as createCostMatrix,
  m as default,
  x as getMaxCost,
  k as getMinCost,
  d as invertCostMatrix,
  m as munkres,
  a as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
