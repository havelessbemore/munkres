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
function g(n) {
  const e = n.length;
  if (e <= 0)
    return;
  let l = n[0];
  for (let o = 1; o < e; ++o)
    l > n[o] && (l = n[o]);
  return l;
}
function h(n) {
  const e = n.length, l = new Array(e);
  for (let o = 0; o < e; ++o)
    l[o] = Array.from(n[o]);
  return l;
}
function y(n, e) {
  const l = n.length;
  if (l <= 0 || e < 0 || e >= n[0].length)
    return;
  let o = n[0][e];
  for (let r = 1; r < l; ++r)
    o > n[r][e] && (o = n[r][e]);
  return o;
}
function w(n) {
  var e;
  return n.length == (((e = n[0]) == null ? void 0 : e.length) ?? 0);
}
function d(n, e, l, o) {
  v(n, e, o), A(n, l, o);
}
function v(n, e, l) {
  var f;
  const o = n.length;
  if (o >= e)
    return;
  n.length = e;
  const r = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  for (let t = o; t < e; ++t)
    n[t] = new Array(r).fill(l);
}
function A(n, e, l) {
  var f;
  const o = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (o >= e)
    return;
  const r = n.length;
  for (let t = 0; t < r; ++t)
    n[t].length = e, n[t].fill(l, o, e);
}
function q(n, e, l) {
  const o = e.length, r = n.length, f = new Array(r);
  for (let t = 0; t < r; ++t) {
    const c = new Array(o);
    for (let i = 0; i < o; ++i)
      c[i] = l(n[t], e[i]);
    f[t] = c;
  }
  return f;
}
function C(n) {
  var r;
  const e = n.length, l = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let o = n[0][0];
  for (let f = 0; f < e; ++f) {
    const t = n[f];
    for (let c = 0; c < l; ++c)
      o < t[c] && (o = t[c]);
  }
  return o;
}
function H(n) {
  var r;
  const e = n.length, l = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let o = n[0][0];
  for (let f = 0; f < e; ++f) {
    const t = n[f];
    for (let c = 0; c < l; ++c)
      o > t[c] && (o = t[c]);
  }
  return o;
}
function O(n, e) {
  var r;
  const l = n.length, o = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (!(l <= 0 || o <= 0)) {
    e = e ?? C(n);
    for (let f = 0; f < l; ++f) {
      const t = n[f];
      for (let c = 0; c < o; ++c)
        t[c] = e - t[c];
    }
  }
}
function R(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let r = 0; r < e; ++r) {
    const f = n[r];
    for (let t = 0; t < l; ++t)
      f[t] = -f[t];
  }
}
function Y(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let r = 0; r < l; ++r) {
    const f = y(n, r);
    if (isFinite(f))
      for (let t = 0; t < e; ++t)
        n[t][r] -= f;
    else
      for (let t = 0; t < e; ++t)
        n[t][r] = n[t][r] == f ? 0 : 1 / 0;
  }
}
function X(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let r = 0; r < e; ++r) {
    const f = n[r], t = g(f);
    if (isFinite(t))
      for (let c = 0; c < l; ++c)
        f[c] -= t;
    else
      for (let c = 0; c < l; ++c)
        f[c] = f[c] == t ? 0 : 1 / 0;
  }
}
function p(n, e, l) {
  const o = l.length, r = e.length;
  let f = -1, t = -1, c;
  for (let i = 0; i < r; ++i) {
    if (e[i] >= 0)
      continue;
    const u = n[i];
    for (let s = 0; s < o; ++s)
      if (!(l[s] >= 0 && e[l[s]] < 0)) {
        if (u[s] == 0)
          return [i, s];
        c <= u[s] || (c = u[s], f = s, t = i);
      }
  }
  return [t, f];
}
function I(n) {
  X(n), Y(n);
}
function F(n, e, l) {
  const o = e.length, r = l.length;
  let f = 0;
  for (let t = 0; t < r; ++t) {
    const c = n[t];
    for (let i = 0; i < o; ++i)
      if (c[i] == 0 && e[i] < 0) {
        e[i] = t, l[t] = i, ++f;
        break;
      }
  }
  return f;
}
function N(n) {
  var t;
  if (!w(n))
    throw new Error("matrix must be NxN");
  const e = new Array(((t = n[0]) == null ? void 0 : t.length) ?? 0).fill(-1), l = new Array(n.length).fill(-1), o = new Array(n.length).fill(-1);
  I(n);
  let r = F(n, e, l);
  const f = Math.min(e.length, l.length);
  for (; r < f; ) {
    const [c, i] = p(n, o, e);
    n[c][i] != 0 && S(n[c][i], n, o, e), o[c] = i, l[c] < 0 && (E(c, o, e, l), ++r);
  }
  return l;
}
function E(n, e, l, o) {
  if (e[n] < 0)
    throw new Error("Input must be prime.");
  let r = n;
  for (; r >= 0; ) {
    const f = e[r];
    n = r, r = l[f], e[n] = -1, l[f] = n, o[n] = f;
  }
}
function S(n, e, l, o) {
  const r = o.length, f = l.length;
  if (!isFinite(n))
    return k(e, l, o);
  for (let t = 0; t < f; ++t) {
    const c = e[t];
    for (let i = 0; i < r; ++i)
      o[i] >= 0 && l[o[i]] < 0 ? l[t] >= 0 && (c[i] += n) : l[t] < 0 && (c[i] -= n);
  }
}
function k(n, e, l) {
  const o = l.length, r = e.length;
  for (let f = 0; f < r; ++f) {
    const t = n[f];
    for (let c = 0; c < o; ++c)
      l[c] >= 0 && e[l[c]] < 0 ? e[f] >= 0 && (t[c] += 1 / 0) : e[f] < 0 && (t[c] = 0);
  }
}
function T(n) {
  var f;
  const e = n.length, l = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (l <= 0)
    return [];
  n = h(n), d(n, l, e, 0);
  const o = N(n), r = new Array(Math.min(e, l));
  for (let t = 0, c = 0; t < e; ++t)
    o[t] < l && (r[c++] = [t, o[t]]);
  return r;
}
export {
  q as createCostMatrix,
  C as getMaxCost,
  H as getMinCost,
  O as invertCostMatrix,
  T as munkres,
  R as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
