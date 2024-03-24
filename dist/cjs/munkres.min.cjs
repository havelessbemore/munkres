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
"use strict";var m=Object.defineProperty;var u=(l,t,s)=>t in l?m(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var a=(l,t,s)=>(u(l,typeof t!="symbol"?t+"":t,s),s);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function g(l){const t=l.length;if(t<=0)return;let s=l[0];for(let o=1;o<t;++o)s=s>=l[o]?s:l[o];return s}const f={NONE:0,STAR:1,PRIME:2};class v{constructor(t){a(this,"covY");a(this,"covX");a(this,"mask");this.mat=t;const s=t.length,o=t[0].length,e=new Array(s);for(let c=0;c<s;++c)e[c]=new Array(o).fill(0);this.covY=new Array(o).fill(!1),this.covX=new Array(s).fill(!1),this.mask=e}assign(){this._step1(),this._step2();let t=3;do switch(t){case 3:t=this._step3();break;case 4:t=this._step4();break;case 6:t=this._step6();break;default:throw new Error(`Invalid state ${t}`)}while(t!=7);console.log(_(this.mat,this.mask))}_step1(){const t=this.mat,s=t.length,o=t[0].length;for(let e=0;e<s;++e){const c=t[e],n=g(c);for(let i=0;i<o;++i)c[i]-=n}}_step2(){const t=this.mat,s=t.length,o=t[0].length,e=this.covY,c=this.covX,n=this.mask;for(let i=0;i<s;++i){if(e[i])continue;const r=t[i];for(let h=0;h<o;++h)!c[h]&&r[h]==0&&(c[h]=!0,e[i]=!0,n[i][h]=f.STAR)}this._resetCoverage()}_step3(){const t=this.mat,s=t.length,o=t[0].length,e=this.covX,c=this.mask;let n=0;for(let i=0;i<o;++i)for(let r=0;r<s;++r)if(c[r][i]==f.STAR){e[i]=!0,++n;break}return n<o?4:7}_step4(){const t=this.covY,s=this.covX,o=this.mask;for(;;){let[e,c]=this._findUncoveredZero();if(e<0)return 6;o[e][c]=f.PRIME;const n=this._findStarInRow(e);if(n<0)return this._step5(e,c),3;t[e]=!0,s[n]=!1}}_step5(t,s){const o=[t,s];for(;t=this._findStarInCol(s),!(t<0);)o.push(t,this._findPrimeInRow(t));const e=this.mask,c=o.length;for(let n=1;n<c;++n)t=o[n-(n&1)],s=o[n-(n^1)],e[t][s]=e[t][s]==f.STAR?f.NONE:f.STAR;this._resetCoverage(),this._resetPrimes()}_step6(){const t=this.covY,s=this.covX,o=this.mat,e=t.length,c=s.length,n=this._findMinUncovered();for(let i=0;i<e;++i)for(let r=0;r<c;++r)t[i]&&(o[i][r]+=n),s[r]||(o[i][r]-=n);return 4}_findMinUncovered(){const t=this.covY,s=this.covX,o=this.mat,e=t.length,c=s.length;let n=1/0;for(let i=0;i<e;++i){if(t[i])continue;const r=o[i];for(let h=0;h<c;++h)!s[h]&&r[h]<n&&(n=r[h])}return n}_findPrimeInRow(t){const s=this.mask[t],o=s.length;for(let e=0;e<o;++e)if(s[e]==f.PRIME)return e;return-1}_findStarInCol(t){const s=this.mask,o=s.length;for(let e=0;e<o;++e)if(s[e][t]==f.STAR)return o;return-1}_findStarInRow(t){const s=this.mask[t],o=s.length;for(let e=0;e<o;++e)if(s[e]==f.STAR)return e;return-1}_findUncoveredZero(){const t=this.mat,s=t.length,o=t[0].length,e=this.covY,c=this.covX;for(let n=0;n<s;++n){if(e[n])continue;const i=t[n];for(let r=0;r<o;++r)if(!c[r]&&i[r]==0)return[n,r]}return[-1,-1]}_resetCoverage(){this.covX.fill(!1),this.covY.fill(!1)}_resetPrimes(){const t=this.mask,s=t.length,o=t[0].length;for(let e=0;e<s;++e){const c=t[e];for(let n=0;n<o;++n)c[n]==f.PRIME&&(c[n]=f.NONE)}}}function _(l,t){const s=[],o=l.length,e=l[0].length;let c=-1/0;for(let n=0;n<o;++n)for(let i=0;i<e;++i)c=Math.max(c,l[n][i]);c=`${c}`.length+1;for(let n=0;n<o;++n){for(let i=0;i<e;++i){let r=`${l[n][i]}`;switch(t[n][i]){case 1:r+="*";case 2:r+='"'}s.push(r.padEnd(c," "))}s.push(`
`)}return s.join(" ")}const X=[[1,2,3],[2,4,6],[3,6,9]],k=new v(X);k.assign();exports.Munkres=v;exports.Zero=f;
//# sourceMappingURL=munkres.min.cjs.map
