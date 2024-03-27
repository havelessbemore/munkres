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
  for (let f = 1; f < l; ++f)
    o > n[f][e] && (o = n[f][e]);
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
  var r;
  const o = n.length;
  if (o >= e)
    return;
  n.length = e;
  const f = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  for (let t = o; t < e; ++t)
    n[t] = new Array(f).fill(l);
}
function A(n, e, l) {
  var r;
  const o = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (o >= e)
    return;
  const f = n.length;
  for (let t = 0; t < f; ++t)
    n[t].length = e, n[t].fill(l, o, e);
}
function H(n, e, l) {
  const o = e.length, f = n.length, r = new Array(f);
  for (let t = 0; t < f; ++t) {
    const c = new Array(o);
    for (let i = 0; i < o; ++i)
      c[i] = l(n[t], e[i]);
    r[t] = c;
  }
  return r;
}
function Y(n) {
  var f;
  const e = n.length, l = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let o = n[0][0];
  for (let r = 0; r < e; ++r) {
    const t = n[r];
    for (let c = 0; c < l; ++c)
      o < t[c] && (o = t[c]);
  }
  return o;
}
function O(n) {
  var f;
  const e = n.length, l = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let o = n[0][0];
  for (let r = 0; r < e; ++r) {
    const t = n[r];
    for (let c = 0; c < l; ++c)
      o > t[c] && (o = t[c]);
  }
  return o;
}
function R(n, e) {
  var f;
  const l = n.length, o = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (!(l <= 0 || o <= 0)) {
    e = e ?? Y(n);
    for (let r = 0; r < l; ++r) {
      const t = n[r];
      for (let c = 0; c < o; ++c)
        t[c] = e - t[c];
    }
  }
}
function S(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let f = 0; f < e; ++f) {
    const r = n[f];
    for (let t = 0; t < l; ++t)
      r[t] = -r[t];
  }
}
function C(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let f = 0; f < l; ++f) {
    const r = y(n, f);
    if (isFinite(r))
      for (let t = 0; t < e; ++t)
        n[t][f] -= r;
    else
      for (let t = 0; t < e; ++t)
        n[t][f] = n[t][f] == r ? 0 : 1 / 0;
  }
}
function p(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let f = 0; f < e; ++f) {
    const r = n[f], t = g(r);
    if (isFinite(t))
      for (let c = 0; c < l; ++c)
        r[c] -= t;
    else
      for (let c = 0; c < l; ++c)
        r[c] = r[c] == t ? 0 : 1 / 0;
  }
}
function X(n, e, l) {
  const o = l.length, f = e.length;
  let r = -1, t = -1, c;
  for (let i = 0; i < f; ++i) {
    if (e[i] >= 0)
      continue;
    const u = n[i];
    for (let s = 0; s < o; ++s)
      if (!(l[s] >= 0 && e[l[s]] < 0)) {
        if (u[s] == 0)
          return [i, s];
        c <= u[s] || (c = u[s], r = s, t = i);
      }
  }
  return [t, r];
}
function I(n) {
  p(n), C(n);
}
function N(n, e, l) {
  const o = e.length, f = l.length;
  let r = 0;
  for (let t = 0; t < f; ++t) {
    const c = n[t];
    for (let i = 0; i < o; ++i)
      if (c[i] == 0 && e[i] < 0) {
        e[i] = t, l[t] = i, ++r;
        break;
      }
  }
  return r;
}
function F(n) {
  if (!w(n))
    throw new Error("matrix must be NxN");
  const e = n.length, l = new Array(e).fill(-1), o = new Array(e).fill(-1), f = new Array(e).fill(-1);
  I(n);
  let r = N(n, l, o);
  for (; r < e; ) {
    const [t, c] = X(n, f, l);
    n[t][c] != 0 && k(n[t][c], n, f, l), f[t] = c, o[t] < 0 && (E(t, f, l, o), f.fill(-1), ++r);
  }
  return o;
}
function E(n, e, l, o) {
  if (e[n] < 0)
    throw new Error("Input must be prime.");
  let f = n;
  for (; f >= 0; ) {
    const r = e[f];
    n = f, f = l[r], l[r] = n, o[n] = r;
  }
}
function k(n, e, l, o) {
  const f = o.length, r = l.length;
  if (!isFinite(n))
    return q(e, l, o);
  for (let t = 0; t < r; ++t) {
    const c = e[t];
    for (let i = 0; i < f; ++i)
      o[i] >= 0 && l[o[i]] < 0 ? l[t] >= 0 && (c[i] += n) : l[t] < 0 && (c[i] -= n);
  }
}
function q(n, e, l) {
  const o = l.length, f = e.length;
  for (let r = 0; r < f; ++r) {
    const t = n[r];
    for (let c = 0; c < o; ++c)
      l[c] >= 0 && e[l[c]] < 0 ? e[r] >= 0 && (t[c] += 1 / 0) : e[r] < 0 && (t[c] = 0);
  }
}
function T(n) {
  var r;
  const e = n.length, l = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (l <= 0)
    return [];
  n = h(n), d(n, l, e, 0);
  const o = F(n), f = new Array(Math.min(e, l));
  for (let t = 0, c = 0; t < e; ++t)
    o[t] < l && (f[c++] = [t, o[t]]);
  return f;
}
export {
  H as createCostMatrix,
  Y as getMaxCost,
  O as getMinCost,
  R as invertCostMatrix,
  T as munkres,
  S as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
