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
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || e <= 0)
    return;
  let o = n[0][0];
  for (let r = 0; r < t; ++r) {
    const c = n[r];
    for (let f = 0; f < e; ++f)
      o < c[f] && (o = c[f]);
  }
  return o;
}
function E(n) {
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || e <= 0)
    return;
  let o = n[0][0];
  for (let r = 0; r < t; ++r) {
    const c = n[r];
    for (let f = 0; f < e; ++f)
      o > c[f] && (o = c[f]);
  }
  return o;
}
function z(n, t, e) {
  const o = n.length, s = t.length, r = new Array(o);
  for (let c = 0; c < o; ++c) {
    const f = new Array(s);
    for (let l = 0; l < s; ++l)
      f[l] = e(n[c], t[l]);
    r[c] = f;
  }
  return r;
}
function b(n) {
  const t = n.length;
  for (let e = 0; e < t; ++e)
    n[e].reverse();
}
function v(n) {
  const t = n.length, e = new Array(t);
  for (let o = 0; o < t; ++o) {
    const s = n[o], r = s.length, c = new Array(r);
    for (let f = 0; f < r; ++f)
      c[f] = s[f];
    e[o] = c;
  }
  return e;
}
function B(n, t, e) {
  const o = new Array(n);
  for (let s = 0; s < n; ++s) {
    const r = new Array(t);
    for (let c = 0; c < t; ++c)
      r[c] = e(s, c);
    o[s] = r;
  }
  return o;
}
function R(n, t) {
  var s;
  const e = n.length, o = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (!(e <= 0 || o <= 0)) {
    t = t ?? M(n);
    for (let r = 0; r < e; ++r) {
      const c = n[r];
      for (let f = 0; f < o; ++f)
        c[f] = t - c[f];
    }
  }
}
function T(n) {
  var o;
  const t = n.length, e = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  for (let s = 0; s < t; ++s) {
    const r = n[s];
    for (let c = 0; c < e; ++c)
      r[c] = -r[c];
  }
}
function Y(n) {
  var s;
  const t = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0, o = Math.min(t, e);
  for (let r = 1; r < o; ++r)
    for (let c = 0; c < r; ++c) {
      const f = n[r][c];
      n[r][c] = n[c][r], n[c][r] = f;
    }
  if (t > e) {
    for (let r = 0; r < e; ++r) {
      const c = n[r];
      c.length = t;
      for (let f = e; f < t; ++f)
        c[f] = n[f][r];
    }
    n.length = e;
  }
  if (t < e) {
    n.length = e;
    for (let r = t; r < e; ++r) {
      const c = new Array(t);
      for (let f = 0; f < t; ++f)
        c[f] = n[f][r];
      n[r] = c;
    }
    for (let r = 0; r < t; ++r)
      n[r].length = t;
  }
}
function d(n) {
  return v(n);
}
function x(n, t, e) {
  return z(n, t, e);
}
function k(n, t, e) {
  return B(n, t, e);
}
function a(n) {
  return M(n);
}
function m(n) {
  return E(n);
}
function nn(n, t) {
  R(n, t);
}
function tn(n) {
  T(n);
}
function j(n) {
  const t = n.length, e = new Array(t);
  for (let o = 0; o < t; ++o)
    e[o] = [o, n[o]];
  return e;
}
function $(n) {
  const t = n.length;
  if (t <= 0)
    return;
  let e = n[0];
  for (let o = 1; o < t; ++o)
    e > n[o] && (e = n[o]);
  return e;
}
function H(n) {
  return typeof n == "bigint";
}
function I(n) {
  var o;
  const t = n.length, e = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  return t > e && (n = v(n), Y(n)), q(n);
}
function q(n) {
  var l;
  const t = n.length, e = ((l = n[0]) == null ? void 0 : l.length) ?? 0;
  if (t <= 0 || e <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const o = new Array(e), s = new Array(t);
  C(n, o, s);
  const r = new Array(e).fill(-1), c = new Array(t).fill(-1), f = D(n, o, s, r, c);
  return F(t - f, n, o, s, r, c), { dualX: o, dualY: s, starsX: r, starsY: c };
}
function C(n, t, e) {
  const o = t.length, s = e.length;
  for (let f = 0; f < s; ++f)
    e[f] = $(n[f]);
  if (s < o) {
    t.fill(0);
    return;
  }
  let r = e[0], c = n[0];
  for (let f = 0; f < o; ++f)
    t[f] = c[f] - r || 0;
  for (let f = 1; f < s; ++f) {
    r = e[f], c = n[f];
    for (let l = 0; l < o; ++l) {
      const g = c[l] - r || 0;
      g < t[l] && (t[l] = g);
    }
  }
}
function D(n, t, e, o, s) {
  const r = t.length, c = e.length;
  let f = 0;
  for (let l = 0; l < c; ++l) {
    const g = e[l], u = n[l];
    for (let i = 0; i < r; ++i)
      if (o[i] === -1 && u[i] === (t[i] + g || 0)) {
        o[i] = l, s[l] = i, ++f;
        break;
      }
  }
  return f;
}
function F(n, t, e, o, s, r) {
  if (n <= 0)
    return;
  const c = e.length, f = o.length, l = new Uint32Array(f), g = new Uint32Array(c), u = new Array(c), i = new Uint32Array(c);
  for (let w = 0; n > 0; ++w) {
    if (r[w] !== -1)
      continue;
    let h = J(w, t, e, o, g, u, i);
    l[0] = w;
    let y = 0;
    do {
      if (y >= h) {
        const p = X(h, g, u);
        h = U(p, h, g, u);
      }
      const A = g[y++];
      if (s[A] === -1) {
        N(A, i, s, r), G(y, u[A], l, e, o, g, u), --n;
        break;
      }
      l[y] = s[A], h = K(
        s[A],
        h,
        u[A],
        t,
        e,
        o,
        g,
        u,
        i
      );
    } while (!0);
  }
}
function N(n, t, e, o) {
  do {
    const s = t[n], r = o[s];
    e[n] = s, o[s] = n, n = r;
  } while (n !== -1);
}
function G(n, t, e, o, s, r, c) {
  let f = 0;
  for (let l = 0; l < n; ++l) {
    let g = e[l];
    s[g] = s[g] + (t - f || 0) || 0, g = r[l], f = c[g], o[g] = o[g] - (t - f || 0) || 0;
  }
}
function U(n, t, e, o) {
  const s = e.length;
  for (let r = t; r < s; ++r) {
    const c = e[r];
    o[c] === n && (e[r] = e[t], e[t++] = c);
  }
  return t;
}
function X(n, t, e) {
  const o = t.length;
  let s = e[t[n]];
  for (let r = n + 1; r < o; ++r)
    e[t[r]] < s && (s = e[t[r]]);
  return s;
}
function J(n, t, e, o, s, r, c) {
  const f = o[n], l = t[n], g = s.length;
  let u = 0;
  for (let i = 0; i < g; ++i)
    s[i] = i, c[i] = n, r[i] = l[i] - (e[i] + f || 0) || 0, r[i] === 0 && (s[i] = s[u], s[u++] = i);
  return u;
}
function K(n, t, e, o, s, r, c, f, l) {
  const g = r[n], u = o[n], i = c.length;
  for (let w = t; w < i; ++w) {
    const h = c[w], y = (u[h] - (s[h] + g || 0) || 0) + e || 0;
    y < f[h] && (y === e && (c[w] = c[t], c[t++] = h), f[h] = y, l[h] = n);
  }
  return t;
}
function L(n) {
  var o;
  const t = n.length, e = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  return t > e && (n = v(n), Y(n)), O(n);
}
function O(n) {
  var l;
  const t = n.length, e = ((l = n[0]) == null ? void 0 : l.length) ?? 0;
  if (t <= 0 || e <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const o = new Array(e), s = new Array(t);
  P(n, o, s);
  const r = new Array(e).fill(-1), c = new Array(t).fill(-1), f = Q(n, o, s, r, c);
  return W(t - f, n, o, s, r, c), { dualX: o, dualY: s, starsX: r, starsY: c };
}
function P(n, t, e) {
  const o = t.length, s = e.length;
  for (let f = 0; f < s; ++f)
    e[f] = $(n[f]);
  if (s < o) {
    t.fill(0n);
    return;
  }
  let r = e[0], c = n[0];
  for (let f = 0; f < o; ++f)
    t[f] = c[f] - r;
  for (let f = 1; f < s; ++f) {
    r = e[f], c = n[f];
    for (let l = 0; l < o; ++l) {
      const g = c[l] - r;
      g < t[l] && (t[l] = g);
    }
  }
}
function Q(n, t, e, o, s) {
  const r = t.length, c = e.length;
  let f = 0;
  for (let l = 0; l < c; ++l) {
    const g = e[l], u = n[l];
    for (let i = 0; i < r; ++i)
      if (o[i] === -1 && u[i] === t[i] + g) {
        o[i] = l, s[l] = i, ++f;
        break;
      }
  }
  return f;
}
function W(n, t, e, o, s, r) {
  if (n <= 0)
    return;
  const c = e.length, f = o.length, l = new Uint32Array(f), g = new Uint32Array(c), u = new Array(c), i = new Uint32Array(c);
  for (let w = 0; n > 0; ++w) {
    if (r[w] !== -1)
      continue;
    let h = _(w, t, e, o, g, u, i);
    l[0] = w;
    let y = 0;
    do {
      if (y >= h) {
        const p = X(h, g, u);
        h = U(p, h, g, u);
      }
      const A = g[y++];
      if (s[A] === -1) {
        N(A, i, s, r), Z(y, u[A], l, e, o, g, u), --n;
        break;
      }
      l[y] = s[A], h = S(
        s[A],
        h,
        u[A],
        t,
        e,
        o,
        g,
        u,
        i
      );
    } while (!0);
  }
}
function Z(n, t, e, o, s, r, c) {
  let f = 0n;
  for (let l = 0; l < n; ++l) {
    const g = r[l];
    s[e[l]] += t - f, f = c[g], o[g] -= t - f;
  }
}
function _(n, t, e, o, s, r, c) {
  const f = o[n], l = t[n], g = s.length;
  let u = 0;
  for (let i = 0; i < g; ++i)
    s[i] = i, c[i] = n, r[i] = l[i] - e[i] - f, r[i] === 0n && (s[i] = s[u], s[u++] = i);
  return u;
}
function S(n, t, e, o, s, r, c, f, l) {
  const g = r[n] - e, u = o[n], i = c.length;
  for (let w = t; w < i; ++w) {
    const h = c[w], y = u[h] - s[h] - g;
    y < f[h] && (y === e && (c[w] = c[t], c[t++] = h), f[h] = y, l[h] = n);
  }
  return t;
}
function V(n) {
  return H((n[0] ?? [])[0]) ? L(n) : I(n);
}
function en(n) {
  var o;
  const { starsY: t } = V(n), e = j(t);
  return n.length > (((o = n[0]) == null ? void 0 : o.length) ?? 0) && b(e), e;
}
export {
  d as copyMatrix,
  x as createMatrix,
  en as default,
  k as genMatrix,
  a as getMatrixMax,
  m as getMatrixMin,
  nn as invertMatrix,
  en as munkres,
  tn as negateMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
