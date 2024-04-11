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
function k(n) {
  const o = n.length, t = new Array(o);
  for (let f = 0; f < o; ++f)
    t[f] = n[f].slice(0);
  return t;
}
function C(n, o, t) {
  const f = n.length, s = o.length, e = new Array(f);
  for (let r = 0; r < f; ++r) {
    const i = new Array(s);
    for (let c = 0; c < s; ++c)
      i[c] = t(n[r], o[c]);
    e[r] = i;
  }
  return e;
}
function b(n) {
  const o = n.length;
  for (let t = 0; t < o; ++t)
    n[t].reverse();
}
function M(n) {
  var s;
  const o = n.length, t = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (o <= 0 || t <= 0)
    return;
  let f = n[0][0];
  for (let e = 0; e < o; ++e) {
    const r = n[e];
    for (let i = 0; i < t; ++i)
      f < r[i] && (f = r[i]);
  }
  return f;
}
function S(n) {
  var s;
  const o = n.length, t = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (o <= 0 || t <= 0)
    return;
  let f = n[0][0];
  for (let e = 0; e < o; ++e) {
    const r = n[e];
    for (let i = 0; i < t; ++i)
      f > r[i] && (f = r[i]);
  }
  return f;
}
function E(n, o) {
  var s;
  const t = n.length, f = ((s = n[0]) == null ? void 0 : s.length) ?? 0;
  if (!(t <= 0 || f <= 0)) {
    o = o ?? M(n);
    for (let e = 0; e < t; ++e) {
      const r = n[e];
      for (let i = 0; i < f; ++i)
        r[i] = o - r[i];
    }
  }
}
function P(n) {
  var f;
  const o = n.length, t = ((f = n[0]) == null ? void 0 : f.length) ?? 0;
  for (let s = 0; s < o; ++s) {
    const e = n[s];
    for (let r = 0; r < t; ++r)
      e[r] = -e[r];
  }
}
function R(n) {
  var s;
  const o = n.length, t = ((s = n[0]) == null ? void 0 : s.length) ?? 0, f = Math.min(o, t);
  for (let e = 1; e < f; ++e)
    for (let r = 0; r < e; ++r) {
      const i = n[e][r];
      n[e][r] = n[r][e], n[r][e] = i;
    }
  if (o > t) {
    for (let e = 0; e < t; ++e) {
      n[e].length = o;
      for (let r = t; r < o; ++r)
        n[e][r] = n[r][e];
    }
    n.length = t;
  }
  if (o < t) {
    n.length = t;
    for (let e = o; e < t; ++e) {
      n[e] = new Array(o);
      for (let r = 0; r < o; ++r)
        n[e][r] = n[r][e];
    }
    for (let e = 0; e < o; ++e)
      n[e].length = o;
  }
}
function L(n, o, t) {
  return C(n, o, t);
}
function O(n) {
  return M(n);
}
function Q(n) {
  return S(n);
}
function W(n, o) {
  E(n, o);
}
function Z(n) {
  P(n);
}
function N(n) {
  const o = n.length;
  if (o <= 0)
    return;
  let t = n[0];
  for (let f = 1; f < o; ++f)
    t > n[f] && (t = n[f]);
  return t;
}
function T(n, o, t) {
  var i;
  const f = n.length, s = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  for (let c = 0; c < f; ++c)
    t[c] = N(n[c]);
  if (f < s) {
    o.fill(0);
    return;
  }
  let e = t[0], r = n[0];
  for (let c = 0; c < s; ++c)
    o[c] = r[c] === e ? 0 : r[c] - e;
  for (let c = 1; c < f; ++c) {
    e = t[c], r = n[c];
    for (let l = 0; l < s; ++l) {
      const g = r[l] === e ? 0 : r[l] - e;
      g < o[l] && (o[l] = g);
    }
  }
}
function B(n, o, t, f, s) {
  const e = o.length, r = t.length;
  let i = 0;
  for (let c = 0; c < r; ++c) {
    const l = -t[c], g = n[c];
    for (let h = 0; h < e; ++h) {
      const u = o[h] === l ? 0 : o[h] - l;
      if (f[h] === -1 && g[h] === u) {
        f[h] = c, s[c] = h, ++i;
        break;
      }
    }
  }
  return i;
}
function H(n) {
  var A;
  const o = n.length, t = ((A = n[0]) == null ? void 0 : A.length) ?? 0;
  if (o > t)
    throw new RangeError("invalid MxN matrix: M > N");
  const f = new Array(t), s = new Array(o);
  T(n, f, s);
  const e = new Array(t).fill(-1), r = new Array(o).fill(-1);
  let i = B(n, f, s, e, r);
  if (i >= o)
    return r;
  const c = new Array(t), l = new Array(o).fill(-1), g = new Array(t), h = new Array(t), u = new Array(t);
  for (let w = 0; i < o; ++w)
    if (r[w] === -1)
      for (c.fill(-1), l[w] = w, X(u), U(w, n, f, s, g, h); ; ) {
        const [v, y, Y] = d(u, g, h);
        if (g[y] > 0 && I(g[y], w, c, l, f, s, g), c[y] = v, u[y] = y + 1 < t ? u[y + 1] : t, u[Y] = u[y], e[y] === -1) {
          $(y, c, e, r), ++i;
          break;
        }
        const p = e[y];
        l[p] = w, j(p, n, f, s, u, g, h);
      }
  return r;
}
function $(n, o, t, f) {
  do {
    const s = o[n], e = f[s];
    t[n] = s, f[s] = n, n = e;
  } while (n !== -1);
}
function I(n, o, t, f, s, e, r) {
  const i = s.length, c = e.length;
  for (let l = 0; l < c; ++l)
    f[l] === o && (e[l] = e[l] === -n ? 0 : e[l] + n);
  for (let l = 0; l < i; ++l)
    t[l] === -1 ? r[l] = r[l] === n ? 0 : r[l] - n : s[l] = s[l] === n ? 0 : s[l] - n;
}
function X(n) {
  const o = n.length;
  for (let t = 0; t < o; ++t)
    n[t] = t;
}
function d(n, o, t) {
  const f = o.length;
  let s = 0, e = o[n[s]];
  for (let i = n[0] + 1; i < f && n[i] < f; ++i) {
    const c = n[i];
    if (o[c] < e && (e = o[c], s = i, e === 0))
      break;
    i = c;
  }
  const r = n[s];
  return [t[r], r, s];
}
function U(n, o, t, f, s, e) {
  const r = -f[n], i = o[n], c = e.length;
  e.fill(n);
  for (let l = 0; l < c; ++l) {
    const g = t[l] === r ? 0 : t[l] - r;
    s[l] = i[l] === g ? 0 : i[l] - g;
  }
}
function j(n, o, t, f, s, e, r) {
  const i = -f[n], c = o[n], l = r.length;
  for (let g = 0; g < l && s[g] < l; ++g) {
    g = s[g];
    const h = t[g] === i ? 0 : t[g] - i, u = c[g] === h ? 0 : c[g] - h;
    u < e[g] && (e[g] = u, r[g] = n);
  }
}
function q(n, o, t) {
  var i;
  const f = n.length, s = ((i = n[0]) == null ? void 0 : i.length) ?? 0;
  for (let c = 0; c < f; ++c)
    t[c] = N(n[c]);
  if (f < s) {
    o.fill(0n);
    return;
  }
  let e = t[0], r = n[0];
  for (let c = 0; c < s; ++c)
    o[c] = r[c] - e;
  for (let c = 1; c < f; ++c) {
    e = t[c], r = n[c];
    for (let l = 0; l < s; ++l) {
      const g = r[l] - e;
      g < o[l] && (o[l] = g);
    }
  }
}
function z(n, o, t, f, s) {
  const e = o.length, r = t.length;
  let i = 0;
  for (let c = 0; c < r; ++c) {
    const l = n[c], g = t[c];
    for (let h = 0; h < e; ++h)
      if (f[h] === -1 && l[h] === o[h] + g) {
        f[h] = c, s[c] = h, ++i;
        break;
      }
  }
  return i;
}
function D(n) {
  var A;
  const o = n.length, t = ((A = n[0]) == null ? void 0 : A.length) ?? 0;
  if (o > t)
    throw new RangeError("invalid MxN matrix: M > N");
  const f = new Array(t), s = new Array(o);
  q(n, f, s);
  const e = new Array(t).fill(-1), r = new Array(o).fill(-1);
  let i = z(n, f, s, e, r);
  if (i >= o)
    return r;
  const c = new Array(t), l = new Array(o).fill(-1), g = new Array(t), h = new Array(t), u = new Array(t);
  for (let w = 0; i < o; ++w)
    if (r[w] === -1)
      for (c.fill(-1), l[w] = w, X(u), G(w, n, f, s, g, h); ; ) {
        const [v, y, Y] = d(u, g, h);
        if (g[y] > 0n && F(g[y], w, c, l, f, s, g), c[y] = v, u[y] = y + 1 < t ? u[y + 1] : t, u[Y] = u[y], e[y] === -1) {
          $(y, c, e, r), ++i;
          break;
        }
        const p = e[y];
        l[p] = w, J(p, n, f, s, u, g, h);
      }
  return r;
}
function F(n, o, t, f, s, e, r) {
  const i = s.length, c = e.length;
  for (let l = 0; l < c; ++l)
    f[l] === o && (e[l] += n);
  for (let l = 0; l < i; ++l)
    t[l] === -1 ? r[l] -= n : s[l] -= n;
}
function G(n, o, t, f, s, e) {
  const r = s.length, i = o[n], c = f[n];
  e.fill(n);
  for (let l = 0; l < r; ++l)
    s[l] = i[l] - t[l] - c;
}
function J(n, o, t, f, s, e, r) {
  const i = e.length, c = o[n], l = f[n];
  for (let g = 0; g < i && s[g] < i; ++g) {
    g = s[g];
    const h = c[g] - t[g] - l;
    h < e[g] && (e[g] = h, r[g] = n);
  }
}
function K(n) {
  return typeof n == "bigint";
}
function _(n) {
  var r;
  const o = n.length, t = ((r = n[0]) == null ? void 0 : r.length) ?? 0;
  if (t <= 0)
    return [];
  o > t && (n = k(n), R(n));
  const f = K(n[0][0]) ? D(n) : H(n), s = f.length, e = new Array(s);
  for (let i = 0; i < s; ++i)
    e[i] = [i, f[i]];
  return o > t && b(e), e;
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
