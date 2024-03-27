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
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function w(n){const e=n.length;if(e<=0)return;let l=n[0];for(let t=1;t<e;++t)l>n[t]&&(l=n[t]);return l}function x(n){const e=n.length,l=new Array(e);for(let t=0;t<e;++t)l[t]=Array.from(n[t]);return l}function M(n,e){const l=n.length;if(l<=0||e<0||e>=n[0].length)return;let t=n[0][e];for(let o=1;o<l;++o)t>n[o][e]&&(t=n[o][e]);return t}function v(n,e){const l=n.length,t=new Array(l);for(let o=0;o<l;++o){const f=n[o],r=f.length,s=new Array(r);for(let c=0;c<r;++c)s[c]=e(f[c],o,c,n);t[o]=s}return t}function C(n,e,l){const t=e.length,o=n.length,f=new Array(o);for(let r=0;r<o;++r){const s=new Array(t);for(let c=0;c<t;++c)s[c]=l(n[r],e[c]);f[r]=s}return f}function y(n){var o;const e=n.length,l=((o=n[0])==null?void 0:o.length)??0;if(e<=0||l<=0)return;let t=n[0][0];for(let f=0;f<e;++f){const r=n[f];for(let s=0;s<l;++s)t<r[s]&&(t=r[s])}return t}function A(n){var o;const e=n.length,l=((o=n[0])==null?void 0:o.length)??0;if(e<=0||l<=0)return;let t=n[0][0];for(let f=0;f<e;++f){const r=n[f];for(let s=0;s<l;++s)t>r[s]&&(t=r[s])}return t}function d(n,e){var o;const l=n.length,t=((o=n[0])==null?void 0:o.length)??0;if(!(l<=0||t<=0)){e=e??y(n);for(let f=0;f<l;++f){const r=n[f];for(let s=0;s<t;++s)r[s]=e-r[s]}}}function I(n){var t;const e=n.length,l=((t=n[0])==null?void 0:t.length)??0;for(let o=0;o<e;++o){const f=n[o];for(let r=0;r<l;++r)f[r]=-f[r]}}function S(n){var t;const e=n.length,l=((t=n[0])==null?void 0:t.length)??0;for(let o=0;o<l;++o){const f=M(n,o);if(isFinite(f))for(let r=0;r<e;++r)n[r][o]-=f;else for(let r=0;r<e;++r)n[r][o]=n[r][o]==f?0:1/0}}function X(n){var t;const e=n.length,l=((t=n[0])==null?void 0:t.length)??0;for(let o=0;o<e;++o){const f=n[o],r=w(f);if(isFinite(r))for(let s=0;s<l;++s)f[s]-=r;else for(let s=0;s<l;++s)f[s]=f[s]==r?0:1/0}}function F(n,e,l){const t=l.length,o=e.length;let f=-1,r=-1,s;for(let c=0;c<o;++c){if(e[c]>=0)continue;const i=n[c];for(let u=0;u<t;++u)if(!(l[u]>=0&&e[l[u]]<0)){if(i[u]==0)return[c,u];s<=i[u]||(s=i[u],f=u,r=c)}}return[r,f]}function j(n){X(n),S(n)}function k(n,e,l){const t=e.length,o=l.length;let f=0;for(let r=0;r<o;++r){const s=n[r];for(let c=0;c<t;++c)if(s[c]==0&&e[c]<0){e[c]=r,l[r]=c,++f;break}}return f}function O(n,e=!1){var s;const l=new Array(((s=n[0])==null?void 0:s.length)??0).fill(-1),t=new Array(n.length).fill(-1),o=new Array(n.length).fill(-1);e&&console.log(`0:

%s
`,g(n,t,o)),j(n),e&&console.log(`1:

%s
`,g(n,t,o));let f=k(n,l,t);e&&console.log(`2&3:

%s
`,g(n,t,o));const r=Math.min(l.length,t.length);for(;f<r;){const[c,i]=F(n,o,l);n[c][i]!=0&&(Y(n[c][i],n,o,l),e&&console.log(`6:

%s
`,g(n,t,o))),o[c]=i,e&&console.log(`4:

%s
`,g(n,t,o)),t[c]<0&&(T(c,o,l,t),++f,e&&console.log(`5:

%s
`,g(n,t,o)))}return t}function T(n,e,l,t){if(e[n]<0)throw new Error("Input must be prime.");let o=n;for(;o>=0;){const f=e[o];n=o,o=l[f],e[n]=-1,l[f]=n,t[n]=f}}function Y(n,e,l,t){const o=t.length,f=l.length;if(!isFinite(n))return $(e,l,t);for(let r=0;r<f;++r){const s=e[r];for(let c=0;c<o;++c)t[c]>=0&&l[t[c]]<0?l[r]>=0&&(s[c]+=n):l[r]<0&&(s[c]-=n)}}function $(n,e,l){const t=l.length,o=e.length;for(let f=0;f<o;++f){const r=n[f];for(let s=0;s<t;++s)l[s]>=0&&e[l[s]]<0?e[f]>=0&&(r[s]+=1/0):e[f]<0&&(r[s]=0)}}function g(n,e,l=[]){var c;const t=v(n,i=>`${i}`),o=t.length,f=((c=t[0])==null?void 0:c.length)??0;for(let i=0;i<o;++i){const u=t[i];e[i]>=0&&(u[e[i]]="*"+u[e[i]]),l[i]>=0&&(u[l[i]]='"'+u[l[i]])}let r=0;for(let i=0;i<o;++i)for(let u=0;u<f;++u)r=Math.max(r,t[i][u].length);for(let i=0;i<o;++i){const u=t[i];for(let h=0;h<f;++h)u[h].length<r&&(u[h]=u[h].padStart(r," "))}const s=new Array(o);for(let i=0;i<o;++i)s[i]=`[${t[i].join(", ")}]`;return s.join(`,
`)}function p(n,e=!1){return Array.from(O(x(n),e).entries()).filter(([,l])=>l>=0)}exports.createCostMatrix=C;exports.getMaxCost=y;exports.getMinCost=A;exports.invertCostMatrix=d;exports.munkres=p;exports.negateCostMatrix=I;
//# sourceMappingURL=munkres.min.cjs.map
