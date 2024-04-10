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
function d(n) {
  const o = n.length, e = new Array(o);
  for (let c = 0; c < o; ++c)
    e[c] = n[c].slice(0);
  return e;
}
function k(n, o, e) {
  const c = n.length, r = o.length, f = new Array(c);
  for (let t = 0; t < c; ++t) {
    const s = new Array(r);
    for (let i = 0; i < r; ++i)
      s[i] = e(n[t], o[i]);
    f[t] = s;
  }
  return f;
}
function C(n) {
  const o = n.length;
  for (let e = 0; e < o; ++e)
    n[e].reverse();
}
function Y(n) {
  var r;
  const o = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (o <= 0 || e <= 0)
    return;
  let c = n[0][0];
  for (let f = 0; f < o; ++f) {
    const t = n[f];
    for (let s = 0; s < e; ++s)
      c < t[s] && (c = t[s]);
  }
  return c;
}
function S(n) {
  var r;
  const o = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (o <= 0 || e <= 0)
    return;
  let c = n[0][0];
  for (let f = 0; f < o; ++f) {
    const t = n[f];
    for (let s = 0; s < e; ++s)
      c > t[s] && (c = t[s]);
  }
  return c;
}
function E(n, o) {
  var r;
  const e = n.length, c = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (!(e <= 0 || c <= 0)) {
    o = o ?? Y(n);
    for (let f = 0; f < e; ++f) {
      const t = n[f];
      for (let s = 0; s < c; ++s)
        t[s] = o - t[s];
    }
  }
}
function R(n) {
  var c;
  const o = n.length, e = ((c = n[0]) == null ? void 0 : c.length) ?? 0;
  for (let r = 0; r < o; ++r) {
    const f = n[r];
    for (let t = 0; t < e; ++t)
      f[t] = -f[t];
  }
}
function T(n) {
  var r;
  const o = n.length, e = ((r = n[0]) == null ? void 0 : r.length) ?? 0, c = Math.min(o, e);
  for (let f = 1; f < c; ++f)
    for (let t = 0; t < f; ++t) {
      const s = n[f][t];
      n[f][t] = n[t][f], n[t][f] = s;
    }
  if (o > e) {
    for (let f = 0; f < e; ++f) {
      n[f].length = o;
      for (let t = e; t < o; ++t)
        n[f][t] = n[t][f];
    }
    n.length = e;
  }
  if (o < e) {
    n.length = e;
    for (let f = o; f < e; ++f) {
      n[f] = new Array(o);
      for (let t = 0; t < o; ++t)
        n[f][t] = n[t][f];
    }
    for (let f = 0; f < o; ++f)
      n[f].length = o;
  }
}
function L(n, o, e) {
  return k(n, o, e);
}
function O(n) {
  return Y(n);
}
function Q(n) {
  return S(n);
}
function W(n, o) {
  E(n, o);
}
function Z(n) {
  R(n);
}
function X(n) {
  const o = n.length;
  if (o <= 0)
    return;
  let e = n[0];
  for (let c = 1; c < o; ++c)
    e > n[c] && (e = n[c]);
  return e;
}
function j(n, o, e) {
  var f;
  const c = n.length, r = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (c <= r)
    for (let t = 0; t < c; ++t)
      e[t] = X(n[t]);
  if (c >= r) {
    let t = e[0], s = n[0];
    for (let i = 0; i < r; ++i)
      o[i] = s[i] === t ? 0 : s[i] - t;
    for (let i = 1; i < c; ++i) {
      t = e[i], s = n[i];
      for (let l = 0; l < r; ++l) {
        const g = s[l] === t ? 0 : s[l] - t;
        g < o[l] && (o[l] = g);
      }
    }
  }
}
function B(n, o, e, c, r) {
  const f = o.length, t = e.length;
  let s = 0;
  for (let i = 0; i < t; ++i) {
    const l = -e[i], g = n[i];
    for (let h = 0; h < f; ++h) {
      const w = o[h] === l ? 0 : o[h] - l;
      if (c[h] === -1 && g[h] === w) {
        c[h] = i, r[i] = h, ++s;
        break;
      }
    }
  }
  return s;
}
function H(n) {
  var A;
  const o = n.length, e = ((A = n[0]) == null ? void 0 : A.length) ?? 0;
  if (o > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const c = new Array(e).fill(0), r = new Array(o).fill(0);
  j(n, c, r);
  const f = new Array(e).fill(-1), t = new Array(o).fill(-1);
  let s = B(n, c, r, f, t);
  if (s >= o)
    return t;
  const i = new Array(e), l = new Array(o).fill(-1), g = new Array(e), h = new Array(e), w = new Array(e);
  for (let y = 0; s < o; ++y)
    if (t[y] === -1)
      for (i.fill(-1), l[y] = y, M(w), P(y, n, c, r, g, h); ; ) {
        const [p, u] = b(w, g, h);
        if (g[u] > 0 && I(g[u], y, i, l, c, r, g), i[u] = p, $(w, u), f[u] === -1) {
          N(u, i, f, t), ++s;
          break;
        }
        const v = f[u];
        l[v] = y, U(v, n, c, r, w, g, h);
      }
  return t;
}
function N(n, o, e, c) {
  do {
    const r = o[n], f = c[r];
    e[n] = r, c[r] = n, n = f;
  } while (n !== -1);
}
function I(n, o, e, c, r, f, t) {
  const s = r.length, i = f.length;
  for (let l = 0; l < i; ++l)
    c[l] === o && (f[l] = f[l] === -n ? 0 : f[l] + n);
  for (let l = 0; l < s; ++l)
    e[l] === -1 ? t[l] = t[l] === n ? 0 : t[l] - n : r[l] = r[l] === n ? 0 : r[l] - n;
}
function M(n) {
  const o = n.length;
  for (let e = 0; e < o; ++e)
    n[e] = e;
}
function $(n, o) {
  const e = n.length, c = o + 1 < e ? n[o + 1] : e;
  for (let r = o; r >= 0 && n[r] === o; --r)
    n[r] = c;
}
function b(n, o, e) {
  const c = o.length;
  let r = n[0], f = o[r];
  for (let t = r + 1; t < c && n[t] < c && (t = n[t], !(o[t] < f && (f = o[t], r = t, f === 0))); ++t)
    ;
  return [e[r], r];
}
function P(n, o, e, c, r, f) {
  const t = -c[n], s = o[n], i = f.length;
  f.fill(n);
  for (let l = 0; l < i; ++l) {
    const g = e[l] === t ? 0 : e[l] - t;
    r[l] = s[l] === g ? 0 : s[l] - g;
  }
}
function U(n, o, e, c, r, f, t) {
  const s = -c[n], i = o[n], l = t.length;
  for (let g = 0; g < l && r[g] < l; ++g) {
    g = r[g];
    const h = e[g] === s ? 0 : e[g] - s, w = i[g] === h ? 0 : i[g] - h;
    w < f[g] && (f[g] = w, t[g] = n);
  }
}
function q(n, o, e) {
  var f;
  const c = n.length, r = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  if (c <= r)
    for (let t = 0; t < c; ++t)
      e[t] = X(n[t]);
  if (c >= r) {
    for (let t = 0; t < r; ++t)
      o[t] = n[0][t] - e[0];
    for (let t = 1; t < c; ++t) {
      const s = n[t], i = e[t];
      for (let l = 0; l < r; ++l)
        s[l] - i < o[l] && (o[l] = s[l] - i);
    }
  }
}
function z(n, o, e, c, r) {
  const f = o.length, t = e.length;
  let s = 0;
  for (let i = 0; i < t; ++i) {
    const l = n[i], g = e[i];
    for (let h = 0; h < f; ++h)
      if (c[h] === -1 && l[h] === o[h] + g) {
        c[h] = i, r[i] = h, ++s;
        break;
      }
  }
  return s;
}
function D(n) {
  var A;
  const o = n.length, e = ((A = n[0]) == null ? void 0 : A.length) ?? 0;
  if (o > e)
    throw new RangeError("invalid MxN matrix: M > N");
  const c = new Array(e).fill(0n), r = new Array(o).fill(0n);
  q(n, c, r);
  const f = new Array(e).fill(-1), t = new Array(o).fill(-1);
  let s = z(n, c, r, f, t);
  if (s >= o)
    return t;
  const i = new Array(e), l = new Array(o).fill(-1), g = new Array(e), h = new Array(e), w = new Array(e);
  for (let y = 0; s < o; ++y)
    if (t[y] === -1)
      for (i.fill(-1), l[y] = y, M(w), G(y, n, c, r, g, h); ; ) {
        const [p, u] = b(w, g, h);
        if (g[u] > 0n && F(g[u], y, i, l, c, r, g), i[u] = p, $(w, u), f[u] === -1) {
          N(u, i, f, t), ++s;
          break;
        }
        const v = f[u];
        l[v] = y, J(v, n, c, r, w, g, h);
      }
  return t;
}
function F(n, o, e, c, r, f, t) {
  const s = r.length, i = f.length;
  for (let l = 0; l < i; ++l)
    c[l] === o && (f[l] += n);
  for (let l = 0; l < s; ++l)
    e[l] === -1 ? t[l] -= n : r[l] -= n;
}
function G(n, o, e, c, r, f) {
  const t = r.length, s = o[n], i = c[n];
  f.fill(n);
  for (let l = 0; l < t; ++l)
    r[l] = s[l] - e[l] - i;
}
function J(n, o, e, c, r, f, t) {
  const s = f.length, i = o[n], l = c[n];
  for (let g = 0; g < s && r[g] < s; ++g) {
    g = r[g];
    const h = i[g] - e[g] - l;
    h < f[g] && (f[g] = h, t[g] = n);
  }
}
function K(n) {
  return typeof n == "bigint";
}
function _(n) {
  var t;
  const o = n.length, e = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  if (e <= 0)
    return [];
  o > e && (n = d(n), T(n));
  const c = K(n[0][0]) ? D(n) : H(n), r = c.length, f = new Array(r);
  for (let s = 0; s < r; ++s)
    f[s] = [s, c[s]];
  return o > e && C(f), f;
}
export {
  L as createCostMatrix,
  _ as default,
  O as getMaxCost,
  Q as getMinCost,
  W as invertCostMatrix,
  _ as munkres,
  Z as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
