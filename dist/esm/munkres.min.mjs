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
function y(n) {
  const e = n.length;
  if (e <= 0)
    return;
  let l = n[0];
  for (let t = 1; t < e; ++t)
    l > n[t] && (l = n[t]);
  return l;
}
function w(n) {
  const e = n.length, l = new Array(e);
  for (let t = 0; t < e; ++t)
    l[t] = Array.from(n[t]);
  return l;
}
function x(n, e) {
  const l = n.length;
  if (l <= 0 || e < 0 || e >= n[0].length)
    return;
  let t = n[0][e];
  for (let o = 1; o < l; ++o)
    t > n[o][e] && (t = n[o][e]);
  return t;
}
function v(n, e) {
  const l = n.length, t = new Array(l);
  for (let o = 0; o < l; ++o) {
    const r = n[o], f = r.length, s = new Array(f);
    for (let c = 0; c < f; ++c)
      s[c] = e(r[c], o, c, n);
    t[o] = s;
  }
  return t;
}
function j(n, e, l) {
  const t = e.length, o = n.length, r = new Array(o);
  for (let f = 0; f < o; ++f) {
    const s = new Array(t);
    for (let c = 0; c < t; ++c)
      s[c] = l(n[f], e[c]);
    r[f] = s;
  }
  return r;
}
function A(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let t = n[0][0];
  for (let r = 0; r < e; ++r) {
    const f = n[r];
    for (let s = 0; s < l; ++s)
      t < f[s] && (t = f[s]);
  }
  return t;
}
function k(n) {
  var o;
  const e = n.length, l = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (e <= 0 || l <= 0)
    return;
  let t = n[0][0];
  for (let r = 0; r < e; ++r) {
    const f = n[r];
    for (let s = 0; s < l; ++s)
      t > f[s] && (t = f[s]);
  }
  return t;
}
function p(n, e) {
  var o;
  const l = n.length, t = ((o = n[0]) == null ? void 0 : o.length) ?? 0;
  if (!(l <= 0 || t <= 0)) {
    e = e ?? A(n);
    for (let r = 0; r < l; ++r) {
      const f = n[r];
      for (let s = 0; s < t; ++s)
        f[s] = e - f[s];
    }
  }
}
function E(n) {
  var t;
  const e = n.length, l = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let o = 0; o < e; ++o) {
    const r = n[o];
    for (let f = 0; f < l; ++f)
      r[f] = -r[f];
  }
}
function M(n) {
  var t;
  const e = n.length, l = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let o = 0; o < l; ++o) {
    const r = x(n, o);
    if (isFinite(r))
      for (let f = 0; f < e; ++f)
        n[f][o] -= r;
    else
      for (let f = 0; f < e; ++f)
        n[f][o] = n[f][o] == r ? 0 : 1 / 0;
  }
}
function d(n) {
  var t;
  const e = n.length, l = ((t = n[0]) == null ? void 0 : t.length) ?? 0;
  for (let o = 0; o < e; ++o) {
    const r = n[o], f = y(r);
    if (isFinite(f))
      for (let s = 0; s < l; ++s)
        r[s] -= f;
    else
      for (let s = 0; s < l; ++s)
        r[s] = r[s] == f ? 0 : 1 / 0;
  }
}
function C(n, e, l) {
  const t = l.length, o = e.length;
  let r = -1, f = -1, s;
  for (let c = 0; c < o; ++c) {
    if (e[c] >= 0)
      continue;
    const i = n[c];
    for (let u = 0; u < t; ++u)
      if (!(l[u] >= 0 && e[l[u]] < 0)) {
        if (i[u] == 0)
          return [c, u];
        s <= i[u] || (s = i[u], r = u, f = c);
      }
  }
  return [f, r];
}
function I(n) {
  d(n), M(n);
}
function X(n, e, l) {
  const t = e.length, o = l.length;
  let r = 0;
  for (let f = 0; f < o; ++f) {
    const s = n[f];
    for (let c = 0; c < t; ++c)
      if (s[c] == 0 && e[c] < 0) {
        e[c] = f, l[f] = c, ++r;
        break;
      }
  }
  return r;
}
function F(n, e = !1) {
  var s;
  const l = new Array(((s = n[0]) == null ? void 0 : s.length) ?? 0).fill(-1), t = new Array(n.length).fill(-1), o = new Array(n.length).fill(-1);
  e && console.log(`0:

%s
`, h(n, t, o)), I(n), e && console.log(`1:

%s
`, h(n, t, o));
  let r = X(n, l, t);
  e && console.log(`2&3:

%s
`, h(n, t, o));
  const f = Math.min(l.length, t.length);
  for (; r < f; ) {
    const [c, i] = C(n, o, l);
    n[c][i] != 0 && (Y(n[c][i], n, o, l), e && console.log(`6:

%s
`, h(n, t, o))), o[c] = i, e && console.log(`4:

%s
`, h(n, t, o)), t[c] < 0 && (S(c, o, l, t), ++r, e && console.log(`5:

%s
`, h(n, t, o)));
  }
  return t;
}
function S(n, e, l, t) {
  if (e[n] < 0)
    throw new Error("Input must be prime.");
  let o = n;
  for (; o >= 0; ) {
    const r = e[o];
    n = o, o = l[r], e[n] = -1, l[r] = n, t[n] = r;
  }
}
function Y(n, e, l, t) {
  const o = t.length, r = l.length;
  if (!isFinite(n))
    return $(e, l, t);
  for (let f = 0; f < r; ++f) {
    const s = e[f];
    for (let c = 0; c < o; ++c)
      t[c] >= 0 && l[t[c]] < 0 ? l[f] >= 0 && (s[c] += n) : l[f] < 0 && (s[c] -= n);
  }
}
function $(n, e, l) {
  const t = l.length, o = e.length;
  for (let r = 0; r < o; ++r) {
    const f = n[r];
    for (let s = 0; s < t; ++s)
      l[s] >= 0 && e[l[s]] < 0 ? e[r] >= 0 && (f[s] += 1 / 0) : e[r] < 0 && (f[s] = 0);
  }
}
function h(n, e, l = []) {
  var c;
  const t = v(n, (i) => `${i}`), o = t.length, r = ((c = t[0]) == null ? void 0 : c.length) ?? 0;
  for (let i = 0; i < o; ++i) {
    const u = t[i];
    e[i] >= 0 && (u[e[i]] = "*" + u[e[i]]), l[i] >= 0 && (u[l[i]] = '"' + u[l[i]]);
  }
  let f = 0;
  for (let i = 0; i < o; ++i)
    for (let u = 0; u < r; ++u)
      f = Math.max(f, t[i][u].length);
  for (let i = 0; i < o; ++i) {
    const u = t[i];
    for (let g = 0; g < r; ++g)
      u[g].length < f && (u[g] = u[g].padStart(f, " "));
  }
  const s = new Array(o);
  for (let i = 0; i < o; ++i)
    s[i] = `[${t[i].join(", ")}]`;
  return s.join(`,
`);
}
function N(n, e = !1) {
  return Array.from(F(w(n), e).entries()).filter(
    ([, l]) => l >= 0
  );
}
export {
  j as createCostMatrix,
  A as getMaxCost,
  k as getMinCost,
  p as invertCostMatrix,
  N as munkres,
  E as negateCostMatrix
};
//# sourceMappingURL=munkres.min.mjs.map
