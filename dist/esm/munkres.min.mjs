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
var v = Object.defineProperty;
var m = (h, t, s) => t in h ? v(h, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : h[t] = s;
var a = (h, t, s) => (m(h, typeof t != "symbol" ? t + "" : t, s), s);
function u(h) {
  const t = h.length;
  if (t <= 0)
    return;
  let s = h[0];
  for (let o = 1; o < t; ++o)
    s = s >= h[o] ? s : h[o];
  return s;
}
const f = {
  NONE: 0,
  STAR: 1,
  PRIME: 2
};
class g {
  constructor(t) {
    a(this, "covY");
    a(this, "covX");
    a(this, "mask");
    this.mat = t;
    const s = t.length, o = t[0].length, n = new Array(s);
    for (let i = 0; i < s; ++i)
      n[i] = new Array(o).fill(0);
    this.covY = new Array(o).fill(!1), this.covX = new Array(s).fill(!1), this.mask = n;
  }
  assign() {
    this._step1(), this._step2();
    let t = 3;
    do
      switch (t) {
        case 3:
          t = this._step3();
          break;
        case 4:
          t = this._step4();
          break;
        case 6:
          t = this._step6();
          break;
        default:
          throw new Error(`Invalid state ${t}`);
      }
    while (t != 7);
    console.log(_(this.mat, this.mask));
  }
  _step1() {
    const t = this.mat, s = t.length, o = t[0].length;
    for (let n = 0; n < s; ++n) {
      const i = t[n], e = u(i);
      for (let c = 0; c < o; ++c)
        i[c] -= e;
    }
  }
  _step2() {
    const t = this.mat, s = t.length, o = t[0].length, n = this.covY, i = this.covX, e = this.mask;
    for (let c = 0; c < s; ++c) {
      if (n[c])
        continue;
      const r = t[c];
      for (let l = 0; l < o; ++l)
        !i[l] && r[l] == 0 && (i[l] = !0, n[c] = !0, e[c][l] = f.STAR);
    }
    this._resetCoverage();
  }
  _step3() {
    const t = this.mat, s = t.length, o = t[0].length, n = this.covX, i = this.mask;
    let e = 0;
    for (let c = 0; c < o; ++c)
      for (let r = 0; r < s; ++r)
        if (i[r][c] == f.STAR) {
          n[c] = !0, ++e;
          break;
        }
    return e < o ? 4 : 7;
  }
  _step4() {
    const t = this.covY, s = this.covX, o = this.mask;
    for (; ; ) {
      let [n, i] = this._findUncoveredZero();
      if (n < 0)
        return 6;
      o[n][i] = f.PRIME;
      const e = this._findStarInRow(n);
      if (e < 0)
        return this._step5(n, i), 3;
      t[n] = !0, s[e] = !1;
    }
  }
  _step5(t, s) {
    const o = [t, s];
    for (; t = this._findStarInCol(s), !(t < 0); )
      o.push(t, this._findPrimeInRow(t));
    const n = this.mask, i = o.length;
    for (let e = 1; e < i; ++e)
      t = o[e - (e & 1)], s = o[e - (e ^ 1)], n[t][s] = n[t][s] == f.STAR ? f.NONE : f.STAR;
    this._resetCoverage(), this._resetPrimes();
  }
  _step6() {
    const t = this.covY, s = this.covX, o = this.mat, n = t.length, i = s.length, e = this._findMinUncovered();
    for (let c = 0; c < n; ++c)
      for (let r = 0; r < i; ++r)
        t[c] && (o[c][r] += e), s[r] || (o[c][r] -= e);
    return 4;
  }
  _findMinUncovered() {
    const t = this.covY, s = this.covX, o = this.mat, n = t.length, i = s.length;
    let e = 1 / 0;
    for (let c = 0; c < n; ++c) {
      if (t[c])
        continue;
      const r = o[c];
      for (let l = 0; l < i; ++l)
        !s[l] && r[l] < e && (e = r[l]);
    }
    return e;
  }
  _findPrimeInRow(t) {
    const s = this.mask[t], o = s.length;
    for (let n = 0; n < o; ++n)
      if (s[n] == f.PRIME)
        return n;
    return -1;
  }
  _findStarInCol(t) {
    const s = this.mask, o = s.length;
    for (let n = 0; n < o; ++n)
      if (s[n][t] == f.STAR)
        return o;
    return -1;
  }
  _findStarInRow(t) {
    const s = this.mask[t], o = s.length;
    for (let n = 0; n < o; ++n)
      if (s[n] == f.STAR)
        return n;
    return -1;
  }
  _findUncoveredZero() {
    const t = this.mat, s = t.length, o = t[0].length, n = this.covY, i = this.covX;
    for (let e = 0; e < s; ++e) {
      if (n[e])
        continue;
      const c = t[e];
      for (let r = 0; r < o; ++r)
        if (!i[r] && c[r] == 0)
          return [e, r];
    }
    return [-1, -1];
  }
  _resetCoverage() {
    this.covX.fill(!1), this.covY.fill(!1);
  }
  _resetPrimes() {
    const t = this.mask, s = t.length, o = t[0].length;
    for (let n = 0; n < s; ++n) {
      const i = t[n];
      for (let e = 0; e < o; ++e)
        i[e] == f.PRIME && (i[e] = f.NONE);
    }
  }
}
function _(h, t) {
  const s = [], o = h.length, n = h[0].length;
  let i = -1 / 0;
  for (let e = 0; e < o; ++e)
    for (let c = 0; c < n; ++c)
      i = Math.max(i, h[e][c]);
  i = `${i}`.length + 1;
  for (let e = 0; e < o; ++e) {
    for (let c = 0; c < n; ++c) {
      let r = `${h[e][c]}`;
      switch (t[e][c]) {
        case 1:
          r += "*";
        case 2:
          r += '"';
      }
      s.push(r.padEnd(i, " "));
    }
    s.push(`
`);
  }
  return s.join(" ");
}
const X = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9]
], k = new g(X);
k.assign();
export {
  g as Munkres,
  f as Zero
};
//# sourceMappingURL=munkres.min.mjs.map
