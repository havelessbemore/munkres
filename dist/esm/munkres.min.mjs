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
function U(n) {
  var o;
  const e = n.length, r = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (e <= 0 || r <= 0)
    return;
  let f = n[0][0];
  for (let c = 0; c < e; ++c) {
    const i = n[c];
    for (let t = 0; t < r; ++t)
      f < i[t] && (f = i[t]);
  }
  return f;
}
function H(n) {
  var o;
  const e = n.length, r = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (e <= 0 || r <= 0)
    return;
  let f = n[0][0];
  for (let c = 0; c < e; ++c) {
    const i = n[c];
    for (let t = 0; t < r; ++t)
      f > i[t] && (f = i[t]);
  }
  return f;
}
function I(n, e, r) {
  const f = n.length, o = e.length, c = new Array(f);
  for (let i = 0; i < f; ++i) {
    const t = new Array(o);
    for (let s = 0; s < o; ++s)
      t[s] = r(n[i], e[s]);
    c[i] = t;
  }
  return c;
}
function P(n) {
  const e = n.length;
  for (let r = 0; r < e; ++r)
    n[r].reverse();
}
function Z(n) {
  const e = n.length, r = new Array(e);
  for (let f = 0; f < e; ++f) {
    const o = n[f], c = o.length, i = new Array(c);
    for (let t = 0; t < c; ++t)
      i[t] = o[t];
    r[f] = i;
  }
  return r;
}
function j(n, e, r) {
  const f = new Array(n);
  for (let o = 0; o < n; ++o) {
    const c = new Array(e);
    for (let i = 0; i < e; ++i)
      c[i] = r(o, i);
    f[o] = c;
  }
  return f;
}
function q(n, e) {
  var o;
  const r = n.length, f = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (!(r <= 0 || f <= 0)) {
    e = e ?? U(n);
    for (let c = 0; c < r; ++c) {
      const i = n[c];
      for (let t = 0; t < f; ++t)
        i[t] = e - i[t];
    }
  }
}
function C(n) {
  var f;
  const e = n.length, r = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  for (let o = 0; o < e; ++o) {
    const c = n[o];
    for (let i = 0; i < r; ++i)
      c[i] = -c[i];
  }
}
function nn(n) {
  return Z(n);
}
function tn(n, e, r) {
  return I(n, e, r);
}
function on(n, e, r) {
  return j(n, e, r);
}
function en(n) {
  return U(n);
}
function rn(n) {
  return H(n);
}
function fn(n, e) {
  q(n, e);
}
function cn(n) {
  C(n);
}
function D(n) {
  return typeof n == "bigint";
}
function B(n) {
  const e = n.length, r = new Array(e);
  for (let f = 0; f < e; ++f)
    r[f] = [f, n[f]];
  return r;
}
function S(n) {
  const e = n.length;
  if (e <= 0)
    return;
  let r = n[0];
  for (let f = 1; f < e; ++f)
    r > n[f] && (r = n[f]);
  return r;
}
function E(n, e, r, f, o, c) {
  if (n <= 0)
    return;
  const i = f.length, t = new Uint32Array(i), s = new Array(i), g = new Uint32Array(i);
  for (let l = 0; n > 0; ++l) {
    if (o[l] !== -1)
      continue;
    let u = G(l, e, r, f, t, s, g), w = 1, y;
    for (y = t[0]; c[y] !== -1; y = t[w++]) {
      const A = c[y], M = s[y], v = r[A] - M;
      for (let p = u; p < i; ++p) {
        y = t[p];
        const h = e[y][A] - f[y] - v;
        h < s[y] && (h === M && (t[p] = t[u], t[u++] = y), s[y] = h, g[y] = A);
      }
      w >= u && (u = $(u, t, s));
    }
    F(l, w, r, f, t, s, c), T(y, g, o, c), --n;
  }
}
function T(n, e, r, f) {
  do {
    const o = e[n], c = r[o];
    r[o] = n, f[n] = o, n = c;
  } while (n !== -1);
}
function F(n, e, r, f, o, c, i) {
  const t = c[o[e - 1]];
  let s = t;
  for (let g = 0; g < e; ++g) {
    const l = o[g];
    r[n] += s, s = t - c[l], f[l] -= s, n = i[l];
  }
}
function G(n, e, r, f, o, c, i) {
  const t = r[n], s = o.length;
  let g = 0;
  for (let l = 0; l < s; ++l)
    o[l] = l, i[l] = n, c[l] = e[l][n] - f[l] - t, c[l] === 0n && (o[l] = o[g], o[g++] = l);
  return g || $(g, o, c);
}
function J(n) {
  var s;
  const e = n.length, r = ((s = n[0]) == null ? void 0 : s.length) ?? 0, f = new Array(r), o = new Array(e);
  K(n, f, o);
  const c = new Array(r).fill(-1), i = new Array(e).fill(-1), t = L(n, f, o, c, i);
  return e <= r ? O(e - t, n, f, o, c, i) : E(r - t, n, f, o, c, i), { dualX: f, dualY: o, matrix: n, starsX: c, starsY: i };
}
function K(n, e, r) {
  const f = e.length, o = r.length;
  if (o > f)
    r.fill(0n);
  else
    for (let t = 0; t < o; ++t)
      r[t] = S(n[t]);
  if (o < f) {
    e.fill(0n);
    return;
  }
  let c = r[0], i = n[0];
  for (let t = 0; t < f; ++t)
    e[t] = i[t] - c;
  for (let t = 1; t < o; ++t) {
    c = r[t], i = n[t];
    for (let s = 0; s < f; ++s) {
      const g = i[s] - c;
      g < e[s] && (e[s] = g);
    }
  }
}
function L(n, e, r, f, o) {
  const c = e.length, i = r.length, t = i <= c ? i : c;
  let s = 0;
  for (let g = 0; g < i && s < t; ++g) {
    const l = r[g], u = n[g];
    for (let w = 0; w < c; ++w)
      if (f[w] === -1 && l === u[w] - e[w]) {
        f[w] = g, o[g] = w, ++s;
        break;
      }
  }
  return s;
}
function O(n, e, r, f, o, c) {
  if (n <= 0)
    return;
  const i = r.length, t = new Uint32Array(i), s = new Array(i), g = new Uint32Array(i);
  for (let l = 0; n > 0; ++l) {
    if (c[l] !== -1)
      continue;
    let u = R(l, e, r, f, t, s, g), w = 1, y;
    for (y = t[0]; o[y] !== -1; y = t[w++]) {
      const A = o[y], M = s[y], v = f[A] - M, p = e[A];
      for (let h = u; h < i; ++h) {
        y = t[h];
        const z = p[y] - r[y] - v;
        z < s[y] && (z === M && (t[h] = t[u], t[u++] = y), s[y] = z, g[y] = A);
      }
      w >= u && (u = $(u, t, s));
    }
    Q(l, w, r, f, t, s, o), b(y, g, o, c), --n;
  }
}
function b(n, e, r, f) {
  do {
    const o = e[n], c = f[o];
    r[n] = o, f[o] = n, n = c;
  } while (n !== -1);
}
function Q(n, e, r, f, o, c, i) {
  const t = c[o[e - 1]];
  let s = t;
  for (let g = 0; g < e; ++g) {
    const l = o[g];
    f[n] += s, s = t - c[l], r[l] -= s, n = i[l];
  }
}
function R(n, e, r, f, o, c, i) {
  const t = f[n], s = e[n], g = o.length;
  let l = 0;
  for (let u = 0; u < g; ++u)
    o[u] = u, i[u] = n, c[u] = s[u] - r[u] - t, c[u] === 0n && (o[u] = o[l], o[l++] = u);
  return l || $(l, o, c);
}
function W(n, e, r, f, o, c) {
  if (n <= 0)
    return;
  const i = f.length, t = new Uint32Array(i), s = new Array(i), g = new Uint32Array(i);
  for (let l = 0; n > 0; ++l) {
    if (o[l] !== -1)
      continue;
    let u = x(l, e, r, f, t, s, g), w = 1, y;
    for (y = t[0]; c[y] !== -1; y = t[w++]) {
      const A = c[y], M = s[y], v = r[A];
      for (let p = u; p < i; ++p) {
        y = t[p];
        const h = (e[y][A] - (v + f[y] || 0) || 0) + M || 0;
        h < s[y] && (h === M && (t[p] = t[u], t[u++] = y), s[y] = h, g[y] = A);
      }
      w >= u && (u = $(u, t, s));
    }
    _(l, w, r, f, t, s, c), T(y, g, o, c), --n;
  }
}
function _(n, e, r, f, o, c, i) {
  const t = c[o[e - 1]];
  let s = t;
  for (let g = 0; g < e; ++g) {
    const l = o[g];
    r[n] = r[n] + s || 0, s = t - c[l] || 0, f[l] = f[l] - s || 0, n = i[l];
  }
}
function x(n, e, r, f, o, c, i) {
  const t = r[n], s = o.length;
  let g = 0;
  for (let l = 0; l < s; ++l)
    o[l] = l, i[l] = n, c[l] = e[l][n] - (t + f[l] || 0) || 0, c[l] === 0 && (o[l] = o[g], o[g++] = l);
  return g || $(g, o, c);
}
function N(n) {
  var s;
  const e = n.length, r = ((s = n[0]) == null ? void 0 : s.length) ?? 0, f = new Array(r), o = new Array(e);
  Y(n, f, o);
  const c = new Array(r).fill(-1), i = new Array(e).fill(-1), t = X(n, f, o, c, i);
  return e <= r ? V(e - t, n, f, o, c, i) : W(r - t, n, f, o, c, i), { dualX: f, dualY: o, matrix: n, starsX: c, starsY: i };
}
function Y(n, e, r) {
  const f = e.length, o = r.length;
  if (o > f)
    r.fill(0);
  else
    for (let t = 0; t < o; ++t)
      r[t] = S(n[t]);
  if (o < f) {
    e.fill(0);
    return;
  }
  let c = r[0], i = n[0];
  for (let t = 0; t < f; ++t)
    e[t] = i[t] - c || 0;
  for (let t = 1; t < o; ++t) {
    c = r[t], i = n[t];
    for (let s = 0; s < f; ++s) {
      const g = i[s] - c || 0;
      g < e[s] && (e[s] = g);
    }
  }
}
function X(n, e, r, f, o) {
  const c = e.length, i = r.length, t = i <= c ? i : c;
  let s = 0;
  for (let g = 0; g < i && s < t; ++g) {
    const l = r[g], u = n[g];
    for (let w = 0; w < c; ++w)
      if (f[w] === -1 && u[w] === (e[w] + l || 0)) {
        f[w] = g, o[g] = w, ++s;
        break;
      }
  }
  return s;
}
function V(n, e, r, f, o, c) {
  if (n <= 0)
    return;
  const i = r.length, t = new Uint32Array(i), s = new Array(i), g = new Uint32Array(i);
  for (let l = 0; n > 0; ++l) {
    if (c[l] !== -1)
      continue;
    let u = k(l, e, r, f, t, s, g), w = 1, y;
    for (y = t[0]; o[y] !== -1; y = t[w++]) {
      const A = o[y], M = f[A], v = s[y], p = e[A];
      for (let h = u; h < i; ++h) {
        y = t[h];
        const z = (p[y] - (r[y] + M || 0) || 0) + v || 0;
        z < s[y] && (z === v && (t[h] = t[u], t[u++] = y), s[y] = z, g[y] = A);
      }
      w >= u && (u = $(u, t, s));
    }
    d(l, w, r, f, t, s, o), b(y, g, o, c), --n;
  }
}
function d(n, e, r, f, o, c, i) {
  const t = c[o[e - 1]];
  let s = t;
  for (let g = 0; g < e; ++g) {
    const l = o[g];
    f[n] = f[n] + s || 0, s = t - c[l] || 0, r[l] = r[l] - s || 0, n = i[l];
  }
}
function k(n, e, r, f, o, c, i) {
  const t = f[n], s = e[n], g = o.length;
  let l = 0;
  for (let u = 0; u < g; ++u)
    o[u] = u, i[u] = n, c[u] = s[u] - (r[u] + t || 0) || 0, c[u] === 0 && (o[u] = o[l], o[l++] = u);
  return l || $(l, o, c);
}
function m(n) {
  return D((n[0] ?? [])[0]) ? J(n) : N(n);
}
function $(n, e, r) {
  const f = e.length;
  let o = n + 1, c = e[n];
  for (let i = o; i < f; ++i) {
    const t = e[i];
    r[t] > r[c] || (r[t] < r[c] && (c = t, o = n), e[i] = e[o], e[o++] = t);
  }
  return o;
}
function a(n) {
  if (n.starsY.length <= n.starsX.length)
    return B(n.starsY);
  const e = B(n.starsX);
  return P(e), e;
}
function sn(n) {
  return a(m(n));
}
export {
  nn as copyMatrix,
  tn as createMatrix,
  sn as default,
  on as genMatrix,
  en as getMatrixMax,
  rn as getMatrixMin,
  fn as invertMatrix,
  sn as munkres,
  cn as negateMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
