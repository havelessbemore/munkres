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
  const t = n.length, o = new Array(t);
  for (let e = 0; e < t; ++e)
    o[e] = n[e].slice(0);
  return o;
}
function b(n, t, o) {
  const e = n.length, s = t.length, c = new Array(e);
  for (let f = 0; f < e; ++f) {
    const r = new Array(s);
    for (let i = 0; i < s; ++i)
      r[i] = o(n[f], t[i]);
    c[f] = r;
  }
  return c;
}
function C(n) {
  const t = n.length;
  for (let o = 0; o < t; ++o)
    n[o].reverse();
}
function Y(n) {
  var s;
  const t = n.length, o = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || o <= 0)
    return;
  let e = n[0][0];
  for (let c = 0; c < t; ++c) {
    const f = n[c];
    for (let r = 0; r < o; ++r)
      e < f[r] && (e = f[r]);
  }
  return e;
}
function S(n) {
  var s;
  const t = n.length, o = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (t <= 0 || o <= 0)
    return;
  let e = n[0][0];
  for (let c = 0; c < t; ++c) {
    const f = n[c];
    for (let r = 0; r < o; ++r)
      e > f[r] && (e = f[r]);
  }
  return e;
}
function k(n, t) {
  var s;
  const o = n.length, e = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (!(o <= 0 || e <= 0)) {
    t = t ?? Y(n);
    for (let c = 0; c < o; ++c) {
      const f = n[c];
      for (let r = 0; r < e; ++r)
        f[r] = t - f[r];
    }
  }
}
function P(n) {
  var e;
  const t = n.length, o = ((e = n[0]) == null ? void 0 : e.length) ?? 0;
  for (let s = 0; s < t; ++s) {
    const c = n[s];
    for (let f = 0; f < o; ++f)
      c[f] = -c[f];
  }
}
function $(n) {
  var s;
  const t = n.length, o = ((s = n[0]) == null ? void 0 : s.length) ?? 0, e = Math.min(t, o);
  for (let c = 1; c < e; ++c)
    for (let f = 0; f < c; ++f) {
      const r = n[c][f];
      n[c][f] = n[f][c], n[f][c] = r;
    }
  if (t > o) {
    for (let c = 0; c < o; ++c) {
      const f = n[c];
      f.length = t;
      for (let r = o; r < t; ++r)
        f[r] = n[r][c];
    }
    n.length = o;
  }
  if (t < o) {
    n.length = o;
    for (let c = t; c < o; ++c) {
      const f = new Array(t);
      for (let r = 0; r < t; ++r)
        f[r] = n[r][c];
      n[c] = f;
    }
    for (let c = 0; c < t; ++c)
      n[c].length = t;
  }
}
function x(n, t, o) {
  return b(n, t, o);
}
function d(n) {
  return Y(n);
}
function a(n) {
  return S(n);
}
function m(n, t) {
  k(n, t);
}
function nn(n) {
  P(n);
}
function R(n) {
  const t = n.length, o = new Array(t);
  for (let e = 0; e < t; ++e)
    o[e] = [e, n[e]];
  return o;
}
function U(n) {
  const t = n.length;
  if (t <= 0)
    return;
  let o = n[0];
  for (let e = 1; e < t; ++e)
    o > n[e] && (o = n[e]);
  return o;
}
function T(n) {
  return typeof n == "bigint";
}
function B(n) {
  var e;
  const t = n.length, o = ((e = n[0]) == null ? void 0 : e.length) ?? 0;
  return t > o && (n = M(n), $(n)), H(n);
}
function H(n) {
  var i;
  const t = n.length, o = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  if (t <= 0 || o <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > o)
    throw new RangeError("invalid MxN matrix: M > N");
  const e = new Array(o), s = new Array(t);
  I(n, e, s);
  const c = new Array(o).fill(-1), f = new Array(t).fill(-1), r = j(n, e, s, c, f);
  return q(t - r, n, e, s, c, f), { dualX: e, dualY: s, starsX: c, starsY: f };
}
function I(n, t, o) {
  const e = t.length, s = o.length;
  for (let r = 0; r < s; ++r)
    o[r] = U(n[r]);
  if (s < e) {
    t.fill(0);
    return;
  }
  let c = o[0], f = n[0];
  for (let r = 0; r < e; ++r)
    t[r] = f[r] === c ? 0 : f[r] - c;
  for (let r = 1; r < s; ++r) {
    c = o[r], f = n[r];
    for (let i = 0; i < e; ++i) {
      const l = f[i] === c ? 0 : f[i] - c;
      l < t[i] && (t[i] = l);
    }
  }
}
function j(n, t, o, e, s) {
  const c = t.length, f = o.length;
  let r = 0;
  for (let i = 0; i < f; ++i) {
    const l = -o[i], g = n[i];
    for (let h = 0; h < c; ++h) {
      const w = t[h] === l ? 0 : t[h] - l;
      if (e[h] === -1 && g[h] === w) {
        e[h] = i, s[i] = h, ++r;
        break;
      }
    }
  }
  return r;
}
function q(n, t, o, e, s, c) {
  if (n <= 0)
    return;
  const f = o.length, r = e.length, i = new Uint32Array(r), l = new Uint32Array(f), g = new Uint32Array(f), h = new Array(f), w = new Uint32Array(f);
  for (let u = 0; n > 0; ++u)
    if (c[u] === -1)
      for (i[u] = n, E(l), F(u, t, o, e, h, w); ; ) {
        const [p, y, v] = D(l, h, w);
        if (h[y] > 0 && z(h[y], n, i, o, e, l, h), g[y] = p, l[y] = y + 1 < f ? l[y + 1] : f, l[v] = l[y], s[y] === -1) {
          N(y, g, s, c), --n;
          break;
        }
        const A = s[y];
        i[A] = n, G(A, t, o, e, l, h, w);
      }
}
function N(n, t, o, e) {
  do {
    const s = t[n], c = e[s];
    o[n] = s, e[s] = n, n = c;
  } while (n !== -1);
}
function z(n, t, o, e, s, c, f) {
  const r = e.length, i = s.length;
  for (let l = 0; l < r; ++l)
    c[l] === l ? f[l] = f[l] === n ? 0 : f[l] - n : e[l] = e[l] === n ? 0 : e[l] - n;
  n = -n;
  for (let l = 0; l < i; ++l)
    o[l] === t && (s[l] = s[l] === n ? 0 : s[l] - n);
}
function E(n) {
  const t = n.length;
  for (let o = 0; o < t; ++o)
    n[o] = o;
}
function D(n, t, o) {
  const e = t.length;
  let s = 0, c = t[n[s]];
  for (let r = n[0] + 1; r < e && n[r] < e; ++r) {
    const i = n[r];
    if (t[i] < c && (c = t[i], s = r, c === 0))
      break;
    r = i;
  }
  const f = n[s];
  return [o[f], f, s];
}
function F(n, t, o, e, s, c) {
  const f = -e[n], r = t[n], i = c.length;
  c.fill(n);
  for (let l = 0; l < i; ++l) {
    const g = o[l] === f ? 0 : o[l] - f;
    s[l] = r[l] === g ? 0 : r[l] - g;
  }
}
function G(n, t, o, e, s, c, f) {
  const r = -e[n], i = t[n], l = f.length;
  for (let g = 0; g < l && s[g] < l; ++g) {
    g = s[g];
    const h = o[g] === r ? 0 : o[g] - r, w = i[g] === h ? 0 : i[g] - h;
    w < c[g] && (c[g] = w, f[g] = n);
  }
}
function J(n) {
  var e;
  const t = n.length, o = ((e = n[0]) == null ? void 0 : e.length) ?? 0;
  return t > o && (n = M(n), $(n)), K(n);
}
function K(n) {
  var i;
  const t = n.length, o = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  if (t <= 0 || o <= 0)
    return { dualX: [], dualY: [], starsX: [], starsY: [] };
  if (t > o)
    throw new RangeError("invalid MxN matrix: M > N");
  const e = new Array(o), s = new Array(t);
  L(n, e, s);
  const c = new Array(o).fill(-1), f = new Array(t).fill(-1), r = O(n, e, s, c, f);
  return Q(t - r, n, e, s, c, f), { dualX: e, dualY: s, starsX: c, starsY: f };
}
function L(n, t, o) {
  const e = t.length, s = o.length;
  for (let r = 0; r < s; ++r)
    o[r] = U(n[r]);
  if (s < e) {
    t.fill(0n);
    return;
  }
  let c = o[0], f = n[0];
  for (let r = 0; r < e; ++r)
    t[r] = f[r] - c;
  for (let r = 1; r < s; ++r) {
    c = o[r], f = n[r];
    for (let i = 0; i < e; ++i) {
      const l = f[i] - c;
      l < t[i] && (t[i] = l);
    }
  }
}
function O(n, t, o, e, s) {
  const c = t.length, f = o.length;
  let r = 0;
  for (let i = 0; i < f; ++i) {
    const l = -o[i], g = n[i];
    for (let h = 0; h < c; ++h)
      if (e[h] === -1 && g[h] === t[h] - l) {
        e[h] = i, s[i] = h, ++r;
        break;
      }
  }
  return r;
}
function Q(n, t, o, e, s, c) {
  if (n <= 0)
    return;
  const f = o.length, r = e.length, i = new Uint32Array(r), l = new Uint32Array(f), g = new Uint32Array(f), h = new Array(f), w = new Uint32Array(f);
  for (let u = 0; n > 0; ++u)
    if (c[u] === -1)
      for (i[u] = n, E(l), _(u, t, o, e, h, w); ; ) {
        const [p, y, v] = Z(l, h, w);
        if (h[y] > 0n && W(h[y], n, i, o, e, l, h), g[y] = p, l[y] = y + 1 < f ? l[y + 1] : f, l[v] = l[y], s[y] === -1) {
          N(y, g, s, c), --n;
          break;
        }
        const A = s[y];
        i[A] = n, X(A, t, o, e, l, h, w);
      }
}
function W(n, t, o, e, s, c, f) {
  const r = e.length, i = s.length;
  for (let l = 0; l < r; ++l)
    c[l] === l ? f[l] -= n : e[l] -= n;
  for (let l = 0; l < i; ++l)
    o[l] === t && (s[l] += n);
}
function Z(n, t, o) {
  const e = t.length;
  let s = 0, c = t[n[s]];
  for (let r = n[0] + 1; r < e && n[r] < e; ++r) {
    const i = n[r];
    if (t[i] < c && (c = t[i], s = r, c === 0n))
      break;
    r = i;
  }
  const f = n[s];
  return [o[f], f, s];
}
function _(n, t, o, e, s, c) {
  const f = e[n], r = t[n], i = c.length;
  c.fill(n);
  for (let l = 0; l < i; ++l)
    s[l] = r[l] - o[l] - f;
}
function X(n, t, o, e, s, c, f) {
  const r = e[n], i = t[n], l = f.length;
  for (let g = 0; g < l && s[g] < l; ++g) {
    g = s[g];
    const h = i[g] - o[g] - r;
    h < c[g] && (c[g] = h, f[g] = n);
  }
}
function V(n) {
  return T((n[0] ?? [])[0]) ? J(n) : B(n);
}
function tn(n) {
  var e;
  const { starsY: t } = V(n), o = R(t);
  return n.length > (((e = n[0]) == null ? void 0 : e.length) ?? 0) && C(o), o;
}
export {
  x as createCostMatrix,
  tn as default,
  d as getMaxCost,
  a as getMinCost,
  m as invertCostMatrix,
  tn as munkres,
  nn as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
