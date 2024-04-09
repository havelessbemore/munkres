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
function Y(n) {
  const e = n.length;
  if (e <= 0)
    return;
  let o = n[0];
  for (let l = 1; l < e; ++l)
    o > n[l] && (o = n[l]);
  return o;
}
function d(n) {
  return typeof n == "bigint";
}
function M(n) {
  const e = n.length, o = new Array(e);
  for (let l = 0; l < e; ++l)
    o[l] = n[l].slice(0);
  return o;
}
function C(n, e, o) {
  const l = n.length, c = e.length, f = new Array(l);
  for (let t = 0; t < l; ++t) {
    const s = new Array(c);
    for (let r = 0; r < c; ++r)
      s[r] = o(n[t], e[r]);
    f[t] = s;
  }
  return f;
}
function N(n) {
  const e = n.length;
  for (let o = 0; o < e; ++o)
    n[o].reverse();
}
function I(n, e) {
  const o = n.length;
  if (o <= 0 || e < 0 || e >= n[0].length)
    return;
  let l = n[0][e];
  for (let c = 1; c < o; ++c)
    l > n[c][e] && (l = n[c][e]);
  return l;
}
function X(n) {
  var c;
  const e = n.length, o = ((c = n[0]) == null ? void 0 : c.length) ?? 0;
  if (e <= 0 || o <= 0)
    return;
  let l = n[0][0];
  for (let f = 0; f < e; ++f) {
    const t = n[f];
    for (let s = 0; s < o; ++s)
      l < t[s] && (l = t[s]);
  }
  return l;
}
function $(n) {
  var c;
  const e = n.length, o = ((c = n[0]) == null ? void 0 : c.length) ?? 0;
  if (e <= 0 || o <= 0)
    return;
  let l = n[0][0];
  for (let f = 0; f < e; ++f) {
    const t = n[f];
    for (let s = 0; s < o; ++s)
      l > t[s] && (l = t[s]);
  }
  return l;
}
function b(n, e) {
  var c;
  const o = n.length, l = ((c = n[0]) == null ? void 0 : c.length) ?? 0;
  if (!(o <= 0 || l <= 0)) {
    e = e ?? X(n);
    for (let f = 0; f < o; ++f) {
      const t = n[f];
      for (let s = 0; s < l; ++s)
        t[s] = e - t[s];
    }
  }
}
function k(n) {
  var l;
  const e = n.length, o = ((l = n[0]) == null ? void 0 : l.length) ?? 0;
  for (let c = 0; c < e; ++c) {
    const f = n[c];
    for (let t = 0; t < o; ++t)
      f[t] = -f[t];
  }
}
function E(n) {
  var l;
  const e = n.length, o = ((l = n[0]) == null ? void 0 : l.length) ?? 0;
  if (!(o <= 0))
    for (let c = 0; c < o; ++c) {
      const f = I(n, c);
      if (d(f) || isFinite(f))
        for (let t = 0; t < e; ++t)
          n[t][c] = n[t][c] - f;
      else
        for (let t = 0; t < e; ++t)
          n[t][c] = n[t][c] == f ? 0 : 1 / 0;
    }
}
function F(n) {
  const e = n.length;
  for (let o = 0; o < e; ++o) {
    const l = n[o], c = Y(l);
    if (c == null)
      continue;
    const f = l.length;
    if (d(c) || isFinite(c))
      for (let t = 0; t < f; ++t)
        l[t] = l[t] - c;
    else
      for (let t = 0; t < f; ++t)
        l[t] = l[t] == c ? 0 : 1 / 0;
  }
}
function R(n) {
  var c;
  const e = n.length, o = ((c = n[0]) == null ? void 0 : c.length) ?? 0, l = Math.min(e, o);
  for (let f = 1; f < l; ++f)
    for (let t = 0; t < f; ++t) {
      const s = n[f][t];
      n[f][t] = n[t][f], n[t][f] = s;
    }
  if (e > o) {
    for (let f = 0; f < o; ++f) {
      n[f].length = e;
      for (let t = o; t < e; ++t)
        n[f][t] = n[t][f];
    }
    n.length = o;
  }
  if (e < o) {
    n.length = o;
    for (let f = e; f < o; ++f) {
      n[f] = new Array(e);
      for (let t = 0; t < e; ++t)
        n[f][t] = n[t][f];
    }
    for (let f = 0; f < e; ++f)
      n[f].length = e;
  }
}
function _(n, e, o) {
  return C(n, e, o);
}
function V(n) {
  return X(n);
}
function x(n) {
  return $(n);
}
function a(n, e) {
  b(n, e);
}
function m(n) {
  k(n);
}
function S(n, e, o) {
  var f;
  const l = n.length, c = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (l <= c)
    for (let t = 0; t < l; ++t)
      o[t] = Y(n[t]);
  if (l >= c) {
    for (let t = 0; t < c; ++t)
      e[t] = n[0][t] - o[0];
    for (let t = 1; t < l; ++t) {
      const s = n[t], r = o[t];
      for (let i = 0; i < c; ++i)
        s[i] - r < e[i] && (e[i] = s[i] - r);
    }
  }
}
function U(n, e, o, l, c) {
  const f = e.length, t = o.length;
  let s = 0;
  for (let r = 0; r < t; ++r) {
    const i = n[r], u = o[r];
    for (let g = 0; g < f; ++g)
      if (l[g] === -1 && i[g] === e[g] + u) {
        l[g] = r, c[r] = g, ++s;
        break;
      }
  }
  return s;
}
function T(n) {
  var v;
  const e = n.length, o = ((v = n[0]) == null ? void 0 : v.length) ?? 0;
  if (e > o)
    throw new RangeError("invalid MxN matrix: M > N");
  const l = new Array(o).fill(0n), c = new Array(e).fill(0n);
  S(n, l, c);
  const f = new Array(o).fill(-1), t = new Array(e).fill(-1);
  let s = U(n, l, c, f, t);
  if (s >= e)
    return t;
  const r = new Array(o), i = new Array(e).fill(-1), u = new Array(o), g = new Array(o), w = new Array(o);
  for (let h = 0; s < e; ++h)
    if (t[h] === -1)
      for (r.fill(-1), i[h] = h, H(w), q(h, n, l, c, u, g); ; ) {
        const [p, y] = Z(w, u, g);
        if (u[y] > 0n && B(u[y], h, r, i, l, c, u), r[y] = p, P(w, y), f[y] === -1) {
          j(y, r, f, t), ++s;
          break;
        }
        const A = f[y];
        i[A] = h, z(A, n, l, c, w, u, g);
      }
  return t;
}
function j(n, e, o, l) {
  do {
    const c = e[n], f = l[c];
    o[n] = c, l[c] = n, n = f;
  } while (n !== -1);
}
function B(n, e, o, l, c, f, t) {
  const s = c.length, r = f.length;
  for (let i = 0; i < r; ++i)
    l[i] === e && (f[i] += n);
  for (let i = 0; i < s; ++i)
    o[i] === -1 ? t[i] -= n : c[i] -= n;
}
function H(n) {
  const e = n.length;
  for (let o = 0; o < e; ++o)
    n[o] = o;
}
function P(n, e) {
  const o = n.length, l = e + 1 < o ? n[e + 1] : o;
  for (let c = e; c >= 0 && n[c] === e; --c)
    n[c] = l;
}
function Z(n, e, o) {
  const l = e.length;
  let c = n[0], f = e[c];
  for (let t = c + 1; t < l && n[t] < l && (t = n[t], !(f > e[t] && (f = e[t], c = t, f === 0n))); ++t)
    ;
  return [o[c], c];
}
function q(n, e, o, l, c, f) {
  const t = c.length, s = e[n], r = l[n];
  f.fill(n);
  for (let i = 0; i < t; ++i)
    c[i] = s[i] - o[i] - r;
}
function z(n, e, o, l, c, f, t) {
  const s = f.length, r = e[n], i = l[n];
  for (let u = 0; u < s && c[u] < s; ++u) {
    u = c[u];
    const g = r[u] - o[u] - i;
    g < f[u] && (f[u] = g, t[u] = n);
  }
}
function D(n, e, o) {
  const l = o.length, c = e.length;
  for (let f = 0; f < c; ++f) {
    if (e[f] >= 0)
      continue;
    const t = n[f];
    for (let s = 0; s < l; ++s)
      if (t[s] == 0 && (o[s] < 0 || e[o[s]] >= 0))
        return [f, s];
  }
  return [-1, -1];
}
function G(n, e, o) {
  const l = o.length, c = e.length;
  let f = -1, t = -1, s;
  for (let r = 0; r < c; ++r) {
    if (e[r] >= 0)
      continue;
    const i = n[r];
    for (let u = 0; u < l; ++u)
      !(s <= i[u]) && (o[u] < 0 || e[o[u]] >= 0) && (s = i[u], f = u, t = r);
  }
  return [t, f];
}
function J(n) {
  var l;
  const e = n.length, o = ((l = n[0]) == null ? void 0 : l.length) ?? 0;
  e <= o && F(n), e >= o && E(n);
}
function K(n, e, o) {
  const l = e.length, c = o.length;
  let f = 0;
  for (let t = 0; t < c; ++t) {
    const s = n[t];
    for (let r = 0; r < l; ++r)
      if (s[r] == 0 && e[r] < 0) {
        e[r] = t, o[t] = r, ++f;
        break;
      }
  }
  return f;
}
function L(n) {
  var s;
  const e = n.length, o = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (e > o)
    throw new RangeError("invalid MxN matrix: M > N");
  const l = new Array(o).fill(-1), c = new Array(e).fill(-1), f = new Array(e).fill(-1);
  J(n);
  let t = K(n, l, c);
  for (; t < e; ) {
    let [r, i] = D(n, f, l);
    r < 0 && ([r, i] = G(n, f, l), Q(n[r][i], n, f, l)), f[r] = i, c[r] < 0 && (O(r, f, l, c), f.fill(-1), ++t);
  }
  return c;
}
function O(n, e, o, l) {
  if (e[n] < 0)
    throw new Error("Input must be prime.");
  do {
    const c = e[n], f = o[c];
    o[c] = n, l[n] = c, n = f;
  } while (n >= 0);
}
function Q(n, e, o, l) {
  const c = l.length, f = o.length;
  if (!isFinite(n))
    return W(e, o, l);
  for (let t = 0; t < f; ++t) {
    const s = e[t];
    for (let r = 0; r < c; ++r)
      l[r] >= 0 && o[l[r]] < 0 ? o[t] >= 0 && (s[r] += n) : o[t] < 0 && (s[r] -= n);
  }
}
function W(n, e, o) {
  const l = o.length, c = e.length;
  for (let f = 0; f < c; ++f) {
    const t = n[f];
    for (let s = 0; s < l; ++s)
      o[s] >= 0 && e[o[s]] < 0 ? e[f] >= 0 && (t[s] += 1 / 0) : e[f] < 0 && (t[s] = 0);
  }
}
function nn(n) {
  var t;
  const e = n.length, o = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  if (o <= 0)
    return [];
  n = M(n), e > o && R(n);
  const l = d(n[0][0]) ? T(n) : L(n), c = l.length, f = new Array(c);
  for (let s = 0; s < c; ++s)
    f[s] = [s, l[s]];
  return e > o && N(f), f;
}
export {
  _ as createCostMatrix,
  nn as default,
  V as getMaxCost,
  x as getMinCost,
  a as invertCostMatrix,
  nn as munkres,
  m as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
