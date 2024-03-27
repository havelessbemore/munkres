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
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function h(n){const t=n.length;if(t<=0)return;let o=n[0];for(let e=1;e<t;++e)o>n[e]&&(o=n[e]);return o}function y(n){const t=n.length,o=new Array(t);for(let e=0;e<t;++e)o[e]=Array.from(n[e]);return o}function w(n,t){const o=n.length;if(o<=0||t<0||t>=n[0].length)return;let e=n[0][t];for(let f=1;f<o;++f)e>n[f][t]&&(e=n[f][t]);return e}function v(n,t,o){const e=t.length,f=n.length,i=new Array(f);for(let l=0;l<f;++l){const r=new Array(e);for(let s=0;s<e;++s)r[s]=o(n[l],t[s]);i[l]=r}return i}function g(n){var f;const t=n.length,o=((f=n[0])==null?void 0:f.length)??0;if(t<=0||o<=0)return;let e=n[0][0];for(let i=0;i<t;++i){const l=n[i];for(let r=0;r<o;++r)e<l[r]&&(e=l[r])}return e}function d(n){var f;const t=n.length,o=((f=n[0])==null?void 0:f.length)??0;if(t<=0||o<=0)return;let e=n[0][0];for(let i=0;i<t;++i){const l=n[i];for(let r=0;r<o;++r)e>l[r]&&(e=l[r])}return e}function C(n,t){var f;const o=n.length,e=((f=n[0])==null?void 0:f.length)??0;if(!(o<=0||e<=0)){t=t??g(n);for(let i=0;i<o;++i){const l=n[i];for(let r=0;r<e;++r)l[r]=t-l[r]}}}function A(n){var e;const t=n.length,o=((e=n[0])==null?void 0:e.length)??0;for(let f=0;f<t;++f){const i=n[f];for(let l=0;l<o;++l)i[l]=-i[l]}}function I(n){var e;const t=n.length,o=((e=n[0])==null?void 0:e.length)??0;for(let f=0;f<o;++f){const i=w(n,f);if(isFinite(i))for(let l=0;l<t;++l)n[l][f]-=i;else for(let l=0;l<t;++l)n[l][f]=n[l][f]==i?0:1/0}}function Y(n){var e;const t=n.length,o=((e=n[0])==null?void 0:e.length)??0;for(let f=0;f<t;++f){const i=n[f],l=h(i);if(isFinite(l))for(let r=0;r<o;++r)i[r]-=l;else for(let r=0;r<o;++r)i[r]=i[r]==l?0:1/0}}function F(n,t,o){const e=o.length,f=t.length;let i=-1,l=-1,r;for(let s=0;s<f;++s){if(t[s]>=0)continue;const u=n[s];for(let c=0;c<e;++c)if(!(o[c]>=0&&t[o[c]]<0)){if(u[c]==0)return[s,c];r<=u[c]||(r=u[c],i=c,l=s)}}return[l,i]}function S(n){Y(n),I(n)}function X(n,t,o){const e=t.length,f=o.length;let i=0;for(let l=0;l<f;++l){const r=n[l];for(let s=0;s<e;++s)if(r[s]==0&&t[s]<0){t[s]=l,o[l]=s,++i;break}}return i}function k(n){var l;const t=new Array(((l=n[0])==null?void 0:l.length)??0).fill(-1),o=new Array(n.length).fill(-1),e=new Array(n.length).fill(-1);S(n);let f=X(n,t,o);const i=Math.min(t.length,o.length);for(;f<i;){const[r,s]=F(n,e,t);n[r][s]!=0&&T(n[r][s],n,e,t),e[r]=s,o[r]<0&&(O(r,e,t,o),++f)}return o}function O(n,t,o,e){if(t[n]<0)throw new Error("Input must be prime.");let f=n;for(;f>=0;){const i=t[f];n=f,f=o[i],t[n]=-1,o[i]=n,e[n]=i}}function T(n,t,o,e){const f=e.length,i=o.length;if(!isFinite(n))return b(t,o,e);for(let l=0;l<i;++l){const r=t[l];for(let s=0;s<f;++s)e[s]>=0&&o[e[s]]<0?o[l]>=0&&(r[s]+=n):o[l]<0&&(r[s]-=n)}}function b(n,t,o){const e=o.length,f=t.length;for(let i=0;i<f;++i){const l=n[i];for(let r=0;r<e;++r)o[r]>=0&&t[o[r]]<0?t[i]>=0&&(l[r]+=1/0):t[i]<0&&(l[r]=0)}}function p(n){return Array.from(k(y(n)).entries()).filter(([,t])=>t>=0)}exports.createCostMatrix=v;exports.getMaxCost=g;exports.getMinCost=d;exports.invertCostMatrix=C;exports.munkres=p;exports.negateCostMatrix=A;
//# sourceMappingURL=munkres.min.cjs.map
