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
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function h(n){const e=n.length;if(e<=0)return;let l=n[0];for(let o=1;o<e;++o)l>n[o]&&(l=n[o]);return l}function y(n){const e=n.length,l=new Array(e);for(let o=0;o<e;++o)l[o]=Array.from(n[o]);return l}function w(n,e){const l=n.length;if(l<=0||e<0||e>=n[0].length)return;let o=n[0][e];for(let r=1;r<l;++r)o>n[r][e]&&(o=n[r][e]);return o}function d(n){var e;return n.length==(((e=n[0])==null?void 0:e.length)??0)}function v(n,e,l,o){C(n,e,o),A(n,l,o)}function C(n,e,l){var f;const o=n.length;if(o>=e)return;n.length=e;const r=((f=n[0])==null?void 0:f.length)??0;for(let t=o;t<e;++t)n[t]=new Array(r).fill(l)}function A(n,e,l){var f;const o=((f=n[0])==null?void 0:f.length)??0;if(o>=e)return;const r=n.length;for(let t=0;t<r;++t)n[t].length=e,n[t].fill(l,o,e)}function Y(n,e,l){const o=e.length,r=n.length,f=new Array(r);for(let t=0;t<r;++t){const i=new Array(o);for(let c=0;c<o;++c)i[c]=l(n[t],e[c]);f[t]=i}return f}function g(n){var r;const e=n.length,l=((r=n[0])==null?void 0:r.length)??0;if(e<=0||l<=0)return;let o=n[0][0];for(let f=0;f<e;++f){const t=n[f];for(let i=0;i<l;++i)o<t[i]&&(o=t[i])}return o}function X(n){var r;const e=n.length,l=((r=n[0])==null?void 0:r.length)??0;if(e<=0||l<=0)return;let o=n[0][0];for(let f=0;f<e;++f){const t=n[f];for(let i=0;i<l;++i)o>t[i]&&(o=t[i])}return o}function p(n,e){var r;const l=n.length,o=((r=n[0])==null?void 0:r.length)??0;if(!(l<=0||o<=0)){e=e??g(n);for(let f=0;f<l;++f){const t=n[f];for(let i=0;i<o;++i)t[i]=e-t[i]}}}function I(n){var o;const e=n.length,l=((o=n[0])==null?void 0:o.length)??0;for(let r=0;r<e;++r){const f=n[r];for(let t=0;t<l;++t)f[t]=-f[t]}}function S(n){var o;const e=n.length,l=((o=n[0])==null?void 0:o.length)??0;for(let r=0;r<l;++r){const f=w(n,r);if(isFinite(f))for(let t=0;t<e;++t)n[t][r]-=f;else for(let t=0;t<e;++t)n[t][r]=n[t][r]==f?0:1/0}}function F(n){var o;const e=n.length,l=((o=n[0])==null?void 0:o.length)??0;for(let r=0;r<e;++r){const f=n[r],t=h(f);if(isFinite(t))for(let i=0;i<l;++i)f[i]-=t;else for(let i=0;i<l;++i)f[i]=f[i]==t?0:1/0}}function N(n,e,l){const o=l.length,r=e.length;let f=-1,t=-1,i;for(let c=0;c<r;++c){if(e[c]>=0)continue;const u=n[c];for(let s=0;s<o;++s)if(!(l[s]>=0&&e[l[s]]<0)){if(u[s]==0)return[c,s];i<=u[s]||(i=u[s],f=s,t=c)}}return[t,f]}function b(n){F(n),S(n)}function k(n,e,l){const o=e.length,r=l.length;let f=0;for(let t=0;t<r;++t){const i=n[t];for(let c=0;c<o;++c)if(i[c]==0&&e[c]<0){e[c]=t,l[t]=c,++f;break}}return f}function E(n){var t;if(!d(n))throw new Error("matrix must be NxN");const e=new Array(((t=n[0])==null?void 0:t.length)??0).fill(-1),l=new Array(n.length).fill(-1),o=new Array(n.length).fill(-1);b(n);let r=k(n,e,l);const f=Math.min(e.length,l.length);for(;r<f;){const[i,c]=N(n,o,e);n[i][c]!=0&&T(n[i][c],n,o,e),o[i]=c,l[i]<0&&(O(i,o,e,l),++r)}return l}function O(n,e,l,o){if(e[n]<0)throw new Error("Input must be prime.");let r=n;for(;r>=0;){const f=e[r];n=r,r=l[f],e[n]=-1,l[f]=n,o[n]=f}}function T(n,e,l,o){const r=o.length,f=l.length;if(!isFinite(n))return q(e,l,o);for(let t=0;t<f;++t){const i=e[t];for(let c=0;c<r;++c)o[c]>=0&&l[o[c]]<0?l[t]>=0&&(i[c]+=n):l[t]<0&&(i[c]-=n)}}function q(n,e,l){const o=l.length,r=e.length;for(let f=0;f<r;++f){const t=n[f];for(let i=0;i<o;++i)l[i]>=0&&e[l[i]]<0?e[f]>=0&&(t[i]+=1/0):e[f]<0&&(t[i]=0)}}function H(n){var f;const e=n.length,l=((f=n[0])==null?void 0:f.length)??0;if(l<=0)return[];n=y(n),v(n,l,e,0);const o=E(n),r=new Array(Math.min(e,l));for(let t=0,i=0;t<e;++t)o[t]<l&&(r[i++]=[t,o[t]]);return r}exports.createCostMatrix=Y;exports.getMaxCost=g;exports.getMinCost=X;exports.invertCostMatrix=p;exports.munkres=H;exports.negateCostMatrix=I;
//# sourceMappingURL=munkres.min.cjs.map
