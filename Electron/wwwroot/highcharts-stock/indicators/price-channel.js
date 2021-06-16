/*
 Highstock JS v9.1.1 (2021-06-03)

 Indicator series type for Highcharts Stock

 (c) 2010-2021 Daniel Studencki

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/price-channel",["highcharts","highcharts/modules/stock"],function(c){a(c);a.Highcharts=c;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function c(a,b,g,e){a.hasOwnProperty(b)||(a[b]=e.apply(null,g))}a=a?a._modules:{};c(a,"Mixins/MultipleLines.js",[a["Core/Globals.js"],a["Core/Utilities.js"]],function(a,
b){var g=b.defined,e=b.error,l=b.merge,k=a.seriesTypes.sma;return{pointArrayMap:["top","bottom"],pointValKey:"top",linesApiNames:["bottomLine"],getTranslatedLinesNames:function(h){var a=[];(this.pointArrayMap||[]).forEach(function(b){b!==h&&a.push("plot"+b.charAt(0).toUpperCase()+b.slice(1))});return a},toYData:function(a){var h=[];(this.pointArrayMap||[]).forEach(function(b){h.push(a[b])});return h},translate:function(){var a=this,b=a.pointArrayMap,g=[],f;g=a.getTranslatedLinesNames();k.prototype.translate.apply(a,
arguments);a.points.forEach(function(h){b.forEach(function(b,r){f=h[b];null!==f&&(h[g[r]]=a.yAxis.toPixels(f,!0))})})},drawGraph:function(){var a=this,b=a.linesApiNames,c=a.points,f=c.length,m=a.options,d=a.graph,r={options:{gapSize:m.gapSize}},q=[],n;a.getTranslatedLinesNames(a.pointValKey).forEach(function(a,b){for(q[b]=[];f--;)n=c[f],q[b].push({x:n.x,plotX:n.plotX,plotY:n[a],isNull:!g(n[a])});f=c.length});b.forEach(function(b,d){q[d]?(a.points=q[d],m[b]?a.options=l(m[b].styles,r):e('Error: "There is no '+
b+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names." at mixin/multiple-line.js:34'),a.graph=a["graph"+b],k.prototype.drawGraph.call(a),a["graph"+b]=a.graph):e('Error: "'+b+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")});a.points=c;a.options=m;a.graph=d;k.prototype.drawGraph.call(a)}}});c(a,"Mixins/ReduceArray.js",[],function(){return{minInArray:function(a,b){return a.reduce(function(a,e){return Math.min(a,
e[b])},Number.MAX_VALUE)},maxInArray:function(a,b){return a.reduce(function(a,e){return Math.max(a,e[b])},-Number.MAX_VALUE)},getArrayExtremes:function(a,b,g){return a.reduce(function(a,c){return[Math.min(a[0],c[b]),Math.max(a[1],c[g])]},[Number.MAX_VALUE,-Number.MAX_VALUE])}}});c(a,"Stock/Indicators/PC/PCIndicator.js",[a["Core/Color/Palette.js"],a["Mixins/MultipleLines.js"],a["Mixins/ReduceArray.js"],a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,b,c,e,l){var g=this&&this.__extends||
function(){var a=function(b,d){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,b){a.__proto__=b}||function(a,b){for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d])};return a(b,d)};return function(b,d){function c(){this.constructor=b}a(b,d);b.prototype=null===d?Object.create(d):(c.prototype=d.prototype,new c)}}(),h=e.seriesTypes.sma,k=l.merge;l=l.extend;var t=c.getArrayExtremes;c=function(b){function c(){var a=null!==b&&b.apply(this,arguments)||this;a.data=void 0;a.options=void 0;a.points=
void 0;return a}g(c,b);c.prototype.getValues=function(a,b){b=b.period;var c=a.xData,d=(a=a.yData)?a.length:0,e=[],g=[],h=[],f;if(!(d<b)){for(f=b;f<=d;f++){var l=c[f-1];var k=a.slice(f-b,f);var p=t(k,2,1);k=p[1];var m=p[0];p=(k+m)/2;e.push([l,k,p,m]);g.push(l);h.push([k,p,m])}return{values:e,xData:g,yData:h}}};c.defaultOptions=k(h.defaultOptions,{params:{index:void 0,period:20},lineWidth:1,topLine:{styles:{lineColor:a.colors[2],lineWidth:1}},bottomLine:{styles:{lineColor:a.colors[8],lineWidth:1}},
dataGrouping:{approximation:"averages"}});return c}(h);l(c.prototype,{getTranslatedLinesNames:b.getTranslatedLinesNames,drawGraph:b.drawGraph,toYData:b.toYData,pointArrayMap:["top","middle","bottom"],pointValKey:"middle",nameBase:"Price Channel",nameComponents:["period"],linesApiNames:["topLine","bottomLine"],translate:b.translate});e.registerSeriesType("pc",c);"";return c});c(a,"masters/indicators/price-channel.src.js",[],function(){})});
//# sourceMappingURL=price-channel.js.map