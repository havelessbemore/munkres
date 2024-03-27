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
function h(n) {
  const e = n.length;
  if (e <= 0)
    return;
  let o = n[0];
  for (let t = 1; t < e; ++t)
    o > n[t] && (o = n[t]);
  return o;
}
function g(n) {
  const e = n.length, o = new Array(e);
  for (let t = 0; t < e; ++t)
    o[t] = Array.from(n[t]);
  return o;
}
function y(n, e) {
  const o = n.length;
  if (o <= 0 || e < 0 || e >= n[0].length)
    return;
  let t = n[0][e];
  for (let f = 1; f < o; ++f)
    t > n[f][e] && (t = n[f][e]);
  return t;
}
function p(n, e, o) {
  const t = e.length, f = n.length, r = new Array(f);
  for (let l = 0; l < f; ++l) {
    const i = new Array(t);
    for (let c = 0; c < t; ++c)
      i[c] = o(n[l], e[c]);
    r[l] = i;
  }
  return r;
}
function w(n) {
  var f;
  const e = n.length, o = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (e <= 0 || o <= 0)
    return;
  let t = n[0][0];
  for (let r = 0; r < e; ++r) {
    const l = n[r];
    for (let i = 0; i < o; ++i)
      t < l[i] && (t = l[i]);
  }
  return t;
}
function E(n) {
  var f;
  const e = n.length, o = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (e <= 0 || o <= 0)
    return;
  let t = n[0][0];
  for (let r = 0; r < e; ++r) {
    const l = n[r];
    for (let i = 0; i < o; ++i)
      t > l[i] && (t = l[i]);
  }
  return t;
}
function N(n, e) {
  var f;
  const o = n.length, t = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (!(o <= 0 || t <= 0)) {
    e = e ?? w(n);
    for (let r = 0; r < o; ++r) {
      const l = n[r];
      for (let i = 0; i < t; ++i)
        l[i] = e - l[i];
    }
  }
}
function O(n) {
  var t;
  const e = n.length, o = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let f = 0; f < e; ++f) {
    const r = n[f];
    for (let l = 0; l < o; ++l)
      r[l] = -r[l];
  }
}
function v(n) {
  var t;
  const e = n.length, o = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let f = 0; f < o; ++f) {
    const r = y(n, f);
    if (isFinite(r))
      for (let l = 0; l < e; ++l)
        n[l][f] -= r;
    else
      for (let l = 0; l < e; ++l)
        n[l][f] = n[l][f] == r ? 0 : 1 / 0;
  }
}
function d(n) {
  var t;
  const e = n.length, o = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let f = 0; f < e; ++f) {
    const r = n[f], l = h(r);
    if (isFinite(l))
      for (let i = 0; i < o; ++i)
        r[i] -= l;
    else
      for (let i = 0; i < o; ++i)
        r[i] = r[i] == l ? 0 : 1 / 0;
  }
}
function A(n, e, o) {
  const t = o.length, f = e.length;
  let r = -1, l = -1, i;
  for (let c = 0; c < f; ++c) {
    if (e[c] >= 0)
      continue;
    const u = n[c];
    for (let s = 0; s < t; ++s)
      if (!(o[s] >= 0 && e[o[s]] < 0)) {
        if (u[s] == 0)
          return [c, s];
        i <= u[s] || (i = u[s], r = s, l = c);
      }
  }
  return [l, r];
}
function C(n) {
  d(n), v(n);
}
function I(n, e, o) {
  const t = e.length, f = o.length;
  let r = 0;
  for (let l = 0; l < f; ++l) {
    const i = n[l];
    for (let c = 0; c < t; ++c)
      if (i[c] == 0 && e[c] < 0) {
        e[c] = l, o[l] = c, ++r;
        break;
      }
  }
  return r;
}
function Y(n) {
  var l;
  const e = new Array(((l = n[0]) == null ? void 0 : l.length) ?? 0).fill(-1), o = new Array(n.length).fill(-1), t = new Array(n.length).fill(-1);
  C(n);
  let f = I(n, e, o);
  const r = Math.min(e.length, o.length);
  for (; f < r; ) {
    const [i, c] = A(n, t, e);
    n[i][c] != 0 && X(n[i][c], n, t, e), t[i] = c, o[i] < 0 && (F(i, t, e, o), ++f);
  }
  return o;
}
function F(n, e, o, t) {
  if (e[n] < 0)
    throw new Error("Input must be prime.");
  let f = n;
  for (; f >= 0; ) {
    const r = e[f];
    n = f, f = o[r], e[n] = -1, o[r] = n, t[n] = r;
  }
}
function X(n, e, o, t) {
  const f = t.length, r = o.length;
  if (!isFinite(n))
    return k(e, o, t);
  for (let l = 0; l < r; ++l) {
    const i = e[l];
    for (let c = 0; c < f; ++c)
      t[c] >= 0 && o[t[c]] < 0 ? o[l] >= 0 && (i[c] += n) : o[l] < 0 && (i[c] -= n);
  }
}
function k(n, e, o) {
  const t = o.length, f = e.length;
  for (let r = 0; r < f; ++r) {
    const l = n[r];
    for (let i = 0; i < t; ++i)
      o[i] >= 0 && e[o[i]] < 0 ? e[r] >= 0 && (l[i] += 1 / 0) : e[r] < 0 && (l[i] = 0);
  }
}
function R(n) {
  return Array.from(Y(g(n)).entries()).filter(
    ([, e]) => e >= 0
  );
}
export {
  p as createCostMatrix,
  w as getMaxCost,
  E as getMinCost,
  N as invertCostMatrix,
  R as munkres,
  O as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
