(function () {
  'use strict';

  angular.module('ml.analyticsDashboard', [
    'ml.analyticsDashboard.report',
    'ngTable',
    'ui.dashboard',
    'ui.router'
  ])
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('root.analytics-dashboard', {
        url: '/analytics-dashboard',
        template: '<ml-analytics-dashboard></ml-analytics-dashboard>'
      })
      .state('root.analytics-dashboard.new-report', {
        url: '/new-report',
        templateUrl: '/templates/new-report.html',
        controller: 'NewReportCtrl'
      })
      .state('root.analytics-dashboard.home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('root.analytics-dashboard.designer', {
        url: '/designer{uri:path}',
        templateUrl: '/templates/designer.html',
        controller: 'ReportDesignerCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      })
      .state('root.analytics-dashboard.remover', {
        url: '/remover{uri:path}',
        templateUrl: '/templates/remover.html',
        controller: 'ReportRemoverCtrl'
      })
      .state('root.analytics-dashboard.editor', {
        url: '/editor{uri:path}',
        templateUrl: '/templates/editor.html',
        controller: 'ReportEditorCtrl',
        resolve: {
          ReportData: function($stateParams, ReportService) {
            //MarkLogic.Util.showLoader();
            var uri = $stateParams.uri;
            return ReportService.getReport(uri).then(function(response) {
              //MarkLogic.Util.hideLoader();
              return response;
            });
          }
        }
      });
  }

}());

(function () {
  'use strict';
  angular.module('ml.analyticsDashboard')
    .directive('mlAnalyticsDashboard', mlAnalyticsDashboard);

  function mlAnalyticsDashboard() {
    return {
      restrict: 'E',
      templateUrl: '/templates/dashboard.html',
      controller: 'SidebarCtrl'
    };
  }
}());

/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
(function(){"use strict";var t=this,i=t.Chart,e=function(t){this.canvas=t.canvas,this.ctx=t;var i=function(t,i){return t["offset"+i]?t["offset"+i]:document.defaultView.getComputedStyle(t).getPropertyValue(i)},e=this.width=i(t.canvas,"Width"),n=this.height=i(t.canvas,"Height");t.canvas.width=e,t.canvas.height=n;var e=this.width=t.canvas.width,n=this.height=t.canvas.height;return this.aspectRatio=this.width/this.height,s.retinaScale(this),this};e.defaults={global:{animation:!0,animationSteps:60,animationEasing:"easeOutQuart",showScale:!0,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleIntegersOnly:!0,scaleBeginAtZero:!1,scaleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",responsive:!1,maintainAspectRatio:!0,showTooltips:!0,customTooltips:!1,tooltipEvents:["mousemove","touchstart","touchmove","mouseout"],tooltipFillColor:"rgba(0,0,0,0.8)",tooltipFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipFontSize:14,tooltipFontStyle:"normal",tooltipFontColor:"#fff",tooltipTitleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipTitleFontSize:14,tooltipTitleFontStyle:"bold",tooltipTitleFontColor:"#fff",tooltipYPadding:6,tooltipXPadding:6,tooltipCaretSize:8,tooltipCornerRadius:6,tooltipXOffset:10,tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= value %>",multiTooltipTemplate:"<%= value %>",multiTooltipKeyBackground:"#fff",onAnimationProgress:function(){},onAnimationComplete:function(){}}},e.types={};var s=e.helpers={},n=s.each=function(t,i,e){var s=Array.prototype.slice.call(arguments,3);if(t)if(t.length===+t.length){var n;for(n=0;n<t.length;n++)i.apply(e,[t[n],n].concat(s))}else for(var o in t)i.apply(e,[t[o],o].concat(s))},o=s.clone=function(t){var i={};return n(t,function(e,s){t.hasOwnProperty(s)&&(i[s]=e)}),i},a=s.extend=function(t){return n(Array.prototype.slice.call(arguments,1),function(i){n(i,function(e,s){i.hasOwnProperty(s)&&(t[s]=e)})}),t},h=s.merge=function(){var t=Array.prototype.slice.call(arguments,0);return t.unshift({}),a.apply(null,t)},l=s.indexOf=function(t,i){if(Array.prototype.indexOf)return t.indexOf(i);for(var e=0;e<t.length;e++)if(t[e]===i)return e;return-1},r=(s.where=function(t,i){var e=[];return s.each(t,function(t){i(t)&&e.push(t)}),e},s.findNextWhere=function(t,i,e){e||(e=-1);for(var s=e+1;s<t.length;s++){var n=t[s];if(i(n))return n}},s.findPreviousWhere=function(t,i,e){e||(e=t.length);for(var s=e-1;s>=0;s--){var n=t[s];if(i(n))return n}},s.inherits=function(t){var i=this,e=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return i.apply(this,arguments)},s=function(){this.constructor=e};return s.prototype=i.prototype,e.prototype=new s,e.extend=r,t&&a(e.prototype,t),e.__super__=i.prototype,e}),c=s.noop=function(){},u=s.uid=function(){var t=0;return function(){return"chart-"+t++}}(),d=s.warn=function(t){window.console&&"function"==typeof window.console.warn&&console.warn(t)},p=s.amd="function"==typeof define&&define.amd,f=s.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},g=s.max=function(t){return Math.max.apply(Math,t)},m=s.min=function(t){return Math.min.apply(Math,t)},v=(s.cap=function(t,i,e){if(f(i)){if(t>i)return i}else if(f(e)&&e>t)return e;return t},s.getDecimalPlaces=function(t){return t%1!==0&&f(t)?t.toString().split(".")[1].length:0}),S=s.radians=function(t){return t*(Math.PI/180)},x=(s.getAngleFromPoint=function(t,i){var e=i.x-t.x,s=i.y-t.y,n=Math.sqrt(e*e+s*s),o=2*Math.PI+Math.atan2(s,e);return 0>e&&0>s&&(o+=2*Math.PI),{angle:o,distance:n}},s.aliasPixel=function(t){return t%2===0?0:.5}),y=(s.splineCurve=function(t,i,e,s){var n=Math.sqrt(Math.pow(i.x-t.x,2)+Math.pow(i.y-t.y,2)),o=Math.sqrt(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2)),a=s*n/(n+o),h=s*o/(n+o);return{inner:{x:i.x-a*(e.x-t.x),y:i.y-a*(e.y-t.y)},outer:{x:i.x+h*(e.x-t.x),y:i.y+h*(e.y-t.y)}}},s.calculateOrderOfMagnitude=function(t){return Math.floor(Math.log(t)/Math.LN10)}),C=(s.calculateScaleRange=function(t,i,e,s,n){var o=2,a=Math.floor(i/(1.5*e)),h=o>=a,l=g(t),r=m(t);l===r&&(l+=.5,r>=.5&&!s?r-=.5:l+=.5);for(var c=Math.abs(l-r),u=y(c),d=Math.ceil(l/(1*Math.pow(10,u)))*Math.pow(10,u),p=s?0:Math.floor(r/(1*Math.pow(10,u)))*Math.pow(10,u),f=d-p,v=Math.pow(10,u),S=Math.round(f/v);(S>a||a>2*S)&&!h;)if(S>a)v*=2,S=Math.round(f/v),S%1!==0&&(h=!0);else if(n&&u>=0){if(v/2%1!==0)break;v/=2,S=Math.round(f/v)}else v/=2,S=Math.round(f/v);return h&&(S=o,v=f/S),{steps:S,stepValue:v,min:p,max:p+S*v}},s.template=function(t,i){function e(t,i){var e=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):s[t]=s[t];return i?e(i):e}if(t instanceof Function)return t(i);var s={};return e(t,i)}),w=(s.generateLabels=function(t,i,e,s){var o=new Array(i);return labelTemplateString&&n(o,function(i,n){o[n]=C(t,{value:e+s*(n+1)})}),o},s.easingEffects={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-1*t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return 1*((t=t/1-1)*t*t+1)},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-1*((t=t/1-1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-0.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return 1*(t/=1)*t*t*t*t},easeOutQuint:function(t){return 1*((t=t/1-1)*t*t*t*t+1)},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return-1*Math.cos(t/1*(Math.PI/2))+1},easeOutSine:function(t){return 1*Math.sin(t/1*(Math.PI/2))},easeInOutSine:function(t){return-0.5*(Math.cos(Math.PI*t/1)-1)},easeInExpo:function(t){return 0===t?1:1*Math.pow(2,10*(t/1-1))},easeOutExpo:function(t){return 1===t?1:1*(-Math.pow(2,-10*t/1)+1)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return t>=1?t:-1*(Math.sqrt(1-(t/=1)*t)-1)},easeOutCirc:function(t){return 1*Math.sqrt(1-(t=t/1-1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),-(s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)))},easeOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),s*Math.pow(2,-10*t)*Math.sin(2*(1*t-i)*Math.PI/e)+1)},easeInOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:2==(t/=.5)?1:(e||(e=.3*1.5),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),1>t?-.5*s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e):s*Math.pow(2,-10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)*.5+1)},easeInBack:function(t){var i=1.70158;return 1*(t/=1)*t*((i+1)*t-i)},easeOutBack:function(t){var i=1.70158;return 1*((t=t/1-1)*t*((i+1)*t+i)+1)},easeInOutBack:function(t){var i=1.70158;return(t/=.5)<1?.5*t*t*(((i*=1.525)+1)*t-i):.5*((t-=2)*t*(((i*=1.525)+1)*t+i)+2)},easeInBounce:function(t){return 1-w.easeOutBounce(1-t)},easeOutBounce:function(t){return(t/=1)<1/2.75?7.5625*t*t:2/2.75>t?1*(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1*(7.5625*(t-=2.25/2.75)*t+.9375):1*(7.5625*(t-=2.625/2.75)*t+.984375)},easeInOutBounce:function(t){return.5>t?.5*w.easeInBounce(2*t):.5*w.easeOutBounce(2*t-1)+.5}}),b=s.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),P=s.cancelAnimFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t,1e3/60)}}(),L=(s.animationLoop=function(t,i,e,s,n,o){var a=0,h=w[e]||w.linear,l=function(){a++;var e=a/i,r=h(e);t.call(o,r,e,a),s.call(o,r,e),i>a?o.animationFrame=b(l):n.apply(o)};b(l)},s.getRelativePosition=function(t){var i,e,s=t.originalEvent||t,n=t.currentTarget||t.srcElement,o=n.getBoundingClientRect();return s.touches?(i=s.touches[0].clientX-o.left,e=s.touches[0].clientY-o.top):(i=s.clientX-o.left,e=s.clientY-o.top),{x:i,y:e}},s.addEvent=function(t,i,e){t.addEventListener?t.addEventListener(i,e):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e}),k=s.removeEvent=function(t,i,e){t.removeEventListener?t.removeEventListener(i,e,!1):t.detachEvent?t.detachEvent("on"+i,e):t["on"+i]=c},F=(s.bindEvents=function(t,i,e){t.events||(t.events={}),n(i,function(i){t.events[i]=function(){e.apply(t,arguments)},L(t.chart.canvas,i,t.events[i])})},s.unbindEvents=function(t,i){n(i,function(i,e){k(t.chart.canvas,e,i)})}),R=s.getMaximumWidth=function(t){var i=t.parentNode;return i.clientWidth},T=s.getMaximumHeight=function(t){var i=t.parentNode;return i.clientHeight},A=(s.getMaximumSize=s.getMaximumWidth,s.retinaScale=function(t){var i=t.ctx,e=t.canvas.width,s=t.canvas.height;window.devicePixelRatio&&(i.canvas.style.width=e+"px",i.canvas.style.height=s+"px",i.canvas.height=s*window.devicePixelRatio,i.canvas.width=e*window.devicePixelRatio,i.scale(window.devicePixelRatio,window.devicePixelRatio))}),M=s.clear=function(t){t.ctx.clearRect(0,0,t.width,t.height)},W=s.fontString=function(t,i,e){return i+" "+t+"px "+e},z=s.longestText=function(t,i,e){t.font=i;var s=0;return n(e,function(i){var e=t.measureText(i).width;s=e>s?e:s}),s},B=s.drawRoundedRectangle=function(t,i,e,s,n,o){t.beginPath(),t.moveTo(i+o,e),t.lineTo(i+s-o,e),t.quadraticCurveTo(i+s,e,i+s,e+o),t.lineTo(i+s,e+n-o),t.quadraticCurveTo(i+s,e+n,i+s-o,e+n),t.lineTo(i+o,e+n),t.quadraticCurveTo(i,e+n,i,e+n-o),t.lineTo(i,e+o),t.quadraticCurveTo(i,e,i+o,e),t.closePath()};e.instances={},e.Type=function(t,i,s){this.options=i,this.chart=s,this.id=u(),e.instances[this.id]=this,i.responsive&&this.resize(),this.initialize.call(this,t)},a(e.Type.prototype,{initialize:function(){return this},clear:function(){return M(this.chart),this},stop:function(){return P(this.animationFrame),this},resize:function(t){this.stop();var i=this.chart.canvas,e=R(this.chart.canvas),s=this.options.maintainAspectRatio?e/this.chart.aspectRatio:T(this.chart.canvas);return i.width=this.chart.width=e,i.height=this.chart.height=s,A(this.chart),"function"==typeof t&&t.apply(this,Array.prototype.slice.call(arguments,1)),this},reflow:c,render:function(t){return t&&this.reflow(),this.options.animation&&!t?s.animationLoop(this.draw,this.options.animationSteps,this.options.animationEasing,this.options.onAnimationProgress,this.options.onAnimationComplete,this):(this.draw(),this.options.onAnimationComplete.call(this)),this},generateLegend:function(){return C(this.options.legendTemplate,this)},destroy:function(){this.clear(),F(this,this.events);var t=this.chart.canvas;t.width=this.chart.width,t.height=this.chart.height,t.style.removeProperty?(t.style.removeProperty("width"),t.style.removeProperty("height")):(t.style.removeAttribute("width"),t.style.removeAttribute("height")),delete e.instances[this.id]},showTooltip:function(t,i){"undefined"==typeof this.activeElements&&(this.activeElements=[]);var o=function(t){var i=!1;return t.length!==this.activeElements.length?i=!0:(n(t,function(t,e){t!==this.activeElements[e]&&(i=!0)},this),i)}.call(this,t);if(o||i){if(this.activeElements=t,this.draw(),this.options.customTooltips&&this.options.customTooltips(!1),t.length>0)if(this.datasets&&this.datasets.length>1){for(var a,h,r=this.datasets.length-1;r>=0&&(a=this.datasets[r].points||this.datasets[r].bars||this.datasets[r].segments,h=l(a,t[0]),-1===h);r--);var c=[],u=[],d=function(){var t,i,e,n,o,a=[],l=[],r=[];return s.each(this.datasets,function(i){t=i.points||i.bars||i.segments,t[h]&&t[h].hasValue()&&a.push(t[h])}),s.each(a,function(t){l.push(t.x),r.push(t.y),c.push(s.template(this.options.multiTooltipTemplate,t)),u.push({fill:t._saved.fillColor||t.fillColor,stroke:t._saved.strokeColor||t.strokeColor})},this),o=m(r),e=g(r),n=m(l),i=g(l),{x:n>this.chart.width/2?n:i,y:(o+e)/2}}.call(this,h);new e.MultiTooltip({x:d.x,y:d.y,xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,xOffset:this.options.tooltipXOffset,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,titleTextColor:this.options.tooltipTitleFontColor,titleFontFamily:this.options.tooltipTitleFontFamily,titleFontStyle:this.options.tooltipTitleFontStyle,titleFontSize:this.options.tooltipTitleFontSize,cornerRadius:this.options.tooltipCornerRadius,labels:c,legendColors:u,legendColorBackground:this.options.multiTooltipKeyBackground,title:t[0].label,chart:this.chart,ctx:this.chart.ctx,custom:this.options.customTooltips}).draw()}else n(t,function(t){var i=t.tooltipPosition();new e.Tooltip({x:Math.round(i.x),y:Math.round(i.y),xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,caretHeight:this.options.tooltipCaretSize,cornerRadius:this.options.tooltipCornerRadius,text:C(this.options.tooltipTemplate,t),chart:this.chart,custom:this.options.customTooltips}).draw()},this);return this}},toBase64Image:function(){return this.chart.canvas.toDataURL.apply(this.chart.canvas,arguments)}}),e.Type.extend=function(t){var i=this,s=function(){return i.apply(this,arguments)};if(s.prototype=o(i.prototype),a(s.prototype,t),s.extend=e.Type.extend,t.name||i.prototype.name){var n=t.name||i.prototype.name,l=e.defaults[i.prototype.name]?o(e.defaults[i.prototype.name]):{};e.defaults[n]=a(l,t.defaults),e.types[n]=s,e.prototype[n]=function(t,i){var o=h(e.defaults.global,e.defaults[n],i||{});return new s(t,o,this)}}else d("Name not provided for this chart, so it hasn't been registered");return i},e.Element=function(t){a(this,t),this.initialize.apply(this,arguments),this.save()},a(e.Element.prototype,{initialize:function(){},restore:function(t){return t?n(t,function(t){this[t]=this._saved[t]},this):a(this,this._saved),this},save:function(){return this._saved=o(this),delete this._saved._saved,this},update:function(t){return n(t,function(t,i){this._saved[i]=this[i],this[i]=t},this),this},transition:function(t,i){return n(t,function(t,e){this[e]=(t-this._saved[e])*i+this._saved[e]},this),this},tooltipPosition:function(){return{x:this.x,y:this.y}},hasValue:function(){return f(this.value)}}),e.Element.extend=r,e.Point=e.Element.extend({display:!0,inRange:function(t,i){var e=this.hitDetectionRadius+this.radius;return Math.pow(t-this.x,2)+Math.pow(i-this.y,2)<Math.pow(e,2)},draw:function(){if(this.display){var t=this.ctx;t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.closePath(),t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.fillStyle=this.fillColor,t.fill(),t.stroke()}}}),e.Arc=e.Element.extend({inRange:function(t,i){var e=s.getAngleFromPoint(this,{x:t,y:i}),n=e.angle>=this.startAngle&&e.angle<=this.endAngle,o=e.distance>=this.innerRadius&&e.distance<=this.outerRadius;return n&&o},tooltipPosition:function(){var t=this.startAngle+(this.endAngle-this.startAngle)/2,i=(this.outerRadius-this.innerRadius)/2+this.innerRadius;return{x:this.x+Math.cos(t)*i,y:this.y+Math.sin(t)*i}},draw:function(t){var i=this.ctx;i.beginPath(),i.arc(this.x,this.y,this.outerRadius,this.startAngle,this.endAngle),i.arc(this.x,this.y,this.innerRadius,this.endAngle,this.startAngle,!0),i.closePath(),i.strokeStyle=this.strokeColor,i.lineWidth=this.strokeWidth,i.fillStyle=this.fillColor,i.fill(),i.lineJoin="bevel",this.showStroke&&i.stroke()}}),e.Rectangle=e.Element.extend({draw:function(){var t=this.ctx,i=this.width/2,e=this.x-i,s=this.x+i,n=this.base-(this.base-this.y),o=this.strokeWidth/2;this.showStroke&&(e+=o,s-=o,n+=o),t.beginPath(),t.fillStyle=this.fillColor,t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.moveTo(e,this.base),t.lineTo(e,n),t.lineTo(s,n),t.lineTo(s,this.base),t.fill(),this.showStroke&&t.stroke()},height:function(){return this.base-this.y},inRange:function(t,i){return t>=this.x-this.width/2&&t<=this.x+this.width/2&&i>=this.y&&i<=this.base}}),e.Tooltip=e.Element.extend({draw:function(){var t=this.chart.ctx;t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.xAlign="center",this.yAlign="above";var i=this.caretPadding=2,e=t.measureText(this.text).width+2*this.xPadding,s=this.fontSize+2*this.yPadding,n=s+this.caretHeight+i;this.x+e/2>this.chart.width?this.xAlign="left":this.x-e/2<0&&(this.xAlign="right"),this.y-n<0&&(this.yAlign="below");var o=this.x-e/2,a=this.y-n;if(t.fillStyle=this.fillColor,this.custom)this.custom(this);else{switch(this.yAlign){case"above":t.beginPath(),t.moveTo(this.x,this.y-i),t.lineTo(this.x+this.caretHeight,this.y-(i+this.caretHeight)),t.lineTo(this.x-this.caretHeight,this.y-(i+this.caretHeight)),t.closePath(),t.fill();break;case"below":a=this.y+i+this.caretHeight,t.beginPath(),t.moveTo(this.x,this.y+i),t.lineTo(this.x+this.caretHeight,this.y+i+this.caretHeight),t.lineTo(this.x-this.caretHeight,this.y+i+this.caretHeight),t.closePath(),t.fill()}switch(this.xAlign){case"left":o=this.x-e+(this.cornerRadius+this.caretHeight);break;case"right":o=this.x-(this.cornerRadius+this.caretHeight)}B(t,o,a,e,s,this.cornerRadius),t.fill(),t.fillStyle=this.textColor,t.textAlign="center",t.textBaseline="middle",t.fillText(this.text,o+e/2,a+s/2)}}}),e.MultiTooltip=e.Element.extend({initialize:function(){this.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.titleFont=W(this.titleFontSize,this.titleFontStyle,this.titleFontFamily),this.height=this.labels.length*this.fontSize+(this.labels.length-1)*(this.fontSize/2)+2*this.yPadding+1.5*this.titleFontSize,this.ctx.font=this.titleFont;var t=this.ctx.measureText(this.title).width,i=z(this.ctx,this.font,this.labels)+this.fontSize+3,e=g([i,t]);this.width=e+2*this.xPadding;var s=this.height/2;this.y-s<0?this.y=s:this.y+s>this.chart.height&&(this.y=this.chart.height-s),this.x>this.chart.width/2?this.x-=this.xOffset+this.width:this.x+=this.xOffset},getLineHeight:function(t){var i=this.y-this.height/2+this.yPadding,e=t-1;return 0===t?i+this.titleFontSize/2:i+(1.5*this.fontSize*e+this.fontSize/2)+1.5*this.titleFontSize},draw:function(){if(this.custom)this.custom(this);else{B(this.ctx,this.x,this.y-this.height/2,this.width,this.height,this.cornerRadius);var t=this.ctx;t.fillStyle=this.fillColor,t.fill(),t.closePath(),t.textAlign="left",t.textBaseline="middle",t.fillStyle=this.titleTextColor,t.font=this.titleFont,t.fillText(this.title,this.x+this.xPadding,this.getLineHeight(0)),t.font=this.font,s.each(this.labels,function(i,e){t.fillStyle=this.textColor,t.fillText(i,this.x+this.xPadding+this.fontSize+3,this.getLineHeight(e+1)),t.fillStyle=this.legendColorBackground,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize),t.fillStyle=this.legendColors[e].fill,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize)},this)}}}),e.Scale=e.Element.extend({initialize:function(){this.fit()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}));this.yLabelWidth=this.display&&this.showLabels?z(this.ctx,this.font,this.yLabels):0},addXLabel:function(t){this.xLabels.push(t),this.valuesCount++,this.fit()},removeXLabel:function(){this.xLabels.shift(),this.valuesCount--,this.fit()},fit:function(){this.startPoint=this.display?this.fontSize:0,this.endPoint=this.display?this.height-1.5*this.fontSize-5:this.height,this.startPoint+=this.padding,this.endPoint-=this.padding;var t,i=this.endPoint-this.startPoint;for(this.calculateYRange(i),this.buildYLabels(),this.calculateXLabelRotation();i>this.endPoint-this.startPoint;)i=this.endPoint-this.startPoint,t=this.yLabelWidth,this.calculateYRange(i),this.buildYLabels(),t<this.yLabelWidth&&this.calculateXLabelRotation()},calculateXLabelRotation:function(){this.ctx.font=this.font;var t,i,e=this.ctx.measureText(this.xLabels[0]).width,s=this.ctx.measureText(this.xLabels[this.xLabels.length-1]).width;if(this.xScalePaddingRight=s/2+3,this.xScalePaddingLeft=e/2>this.yLabelWidth+10?e/2:this.yLabelWidth+10,this.xLabelRotation=0,this.display){var n,o=z(this.ctx,this.font,this.xLabels);this.xLabelWidth=o;for(var a=Math.floor(this.calculateX(1)-this.calculateX(0))-6;this.xLabelWidth>a&&0===this.xLabelRotation||this.xLabelWidth>a&&this.xLabelRotation<=90&&this.xLabelRotation>0;)n=Math.cos(S(this.xLabelRotation)),t=n*e,i=n*s,t+this.fontSize/2>this.yLabelWidth+8&&(this.xScalePaddingLeft=t+this.fontSize/2),this.xScalePaddingRight=this.fontSize/2,this.xLabelRotation++,this.xLabelWidth=n*o;this.xLabelRotation>0&&(this.endPoint-=Math.sin(S(this.xLabelRotation))*o+3)}else this.xLabelWidth=0,this.xScalePaddingRight=this.padding,this.xScalePaddingLeft=this.padding},calculateYRange:c,drawingArea:function(){return this.startPoint-this.endPoint},calculateY:function(t){var i=this.drawingArea()/(this.min-this.max);return this.endPoint-i*(t-this.min)},calculateX:function(t){var i=(this.xLabelRotation>0,this.width-(this.xScalePaddingLeft+this.xScalePaddingRight)),e=i/Math.max(this.valuesCount-(this.offsetGridLines?0:1),1),s=e*t+this.xScalePaddingLeft;return this.offsetGridLines&&(s+=e/2),Math.round(s)},update:function(t){s.extend(this,t),this.fit()},draw:function(){var t=this.ctx,i=(this.endPoint-this.startPoint)/this.steps,e=Math.round(this.xScalePaddingLeft);this.display&&(t.fillStyle=this.textColor,t.font=this.font,n(this.yLabels,function(n,o){var a=this.endPoint-i*o,h=Math.round(a),l=this.showHorizontalLines;t.textAlign="right",t.textBaseline="middle",this.showLabels&&t.fillText(n,e-10,a),0!==o||l||(l=!0),l&&t.beginPath(),o>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),h+=s.aliasPixel(t.lineWidth),l&&(t.moveTo(e,h),t.lineTo(this.width,h),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(e-5,h),t.lineTo(e,h),t.stroke(),t.closePath()},this),n(this.xLabels,function(i,e){var s=this.calculateX(e)+x(this.lineWidth),n=this.calculateX(e-(this.offsetGridLines?.5:0))+x(this.lineWidth),o=this.xLabelRotation>0,a=this.showVerticalLines;0!==e||a||(a=!0),a&&t.beginPath(),e>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),a&&(t.moveTo(n,this.endPoint),t.lineTo(n,this.startPoint-3),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(n,this.endPoint),t.lineTo(n,this.endPoint+5),t.stroke(),t.closePath(),t.save(),t.translate(s,o?this.endPoint+12:this.endPoint+8),t.rotate(-1*S(this.xLabelRotation)),t.font=this.font,t.textAlign=o?"right":"center",t.textBaseline=o?"middle":"top",t.fillText(i,0,0),t.restore()},this))}}),e.RadialScale=e.Element.extend({initialize:function(){this.size=m([this.height,this.width]),this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2},calculateCenterOffset:function(t){var i=this.drawingArea/(this.max-this.min);return(t-this.min)*i},update:function(){this.lineArc?this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2:this.setScaleSize(),this.buildYLabels()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}))},getCircumference:function(){return 2*Math.PI/this.valuesCount},setScaleSize:function(){var t,i,e,s,n,o,a,h,l,r,c,u,d=m([this.height/2-this.pointLabelFontSize-5,this.width/2]),p=this.width,g=0;for(this.ctx.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),i=0;i<this.valuesCount;i++)t=this.getPointPosition(i,d),e=this.ctx.measureText(C(this.templateString,{value:this.labels[i]})).width+5,0===i||i===this.valuesCount/2?(s=e/2,t.x+s>p&&(p=t.x+s,n=i),t.x-s<g&&(g=t.x-s,a=i)):i<this.valuesCount/2?t.x+e>p&&(p=t.x+e,n=i):i>this.valuesCount/2&&t.x-e<g&&(g=t.x-e,a=i);l=g,r=Math.ceil(p-this.width),o=this.getIndexAngle(n),h=this.getIndexAngle(a),c=r/Math.sin(o+Math.PI/2),u=l/Math.sin(h+Math.PI/2),c=f(c)?c:0,u=f(u)?u:0,this.drawingArea=d-(u+c)/2,this.setCenterPoint(u,c)},setCenterPoint:function(t,i){var e=this.width-i-this.drawingArea,s=t+this.drawingArea;this.xCenter=(s+e)/2,this.yCenter=this.height/2},getIndexAngle:function(t){var i=2*Math.PI/this.valuesCount;return t*i-Math.PI/2},getPointPosition:function(t,i){var e=this.getIndexAngle(t);return{x:Math.cos(e)*i+this.xCenter,y:Math.sin(e)*i+this.yCenter}},draw:function(){if(this.display){var t=this.ctx;if(n(this.yLabels,function(i,e){if(e>0){var s,n=e*(this.drawingArea/this.steps),o=this.yCenter-n;if(this.lineWidth>0)if(t.strokeStyle=this.lineColor,t.lineWidth=this.lineWidth,this.lineArc)t.beginPath(),t.arc(this.xCenter,this.yCenter,n,0,2*Math.PI),t.closePath(),t.stroke();else{t.beginPath();for(var a=0;a<this.valuesCount;a++)s=this.getPointPosition(a,this.calculateCenterOffset(this.min+e*this.stepValue)),0===a?t.moveTo(s.x,s.y):t.lineTo(s.x,s.y);t.closePath(),t.stroke()}if(this.showLabels){if(t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.showLabelBackdrop){var h=t.measureText(i).width;t.fillStyle=this.backdropColor,t.fillRect(this.xCenter-h/2-this.backdropPaddingX,o-this.fontSize/2-this.backdropPaddingY,h+2*this.backdropPaddingX,this.fontSize+2*this.backdropPaddingY)}t.textAlign="center",t.textBaseline="middle",t.fillStyle=this.fontColor,t.fillText(i,this.xCenter,o)}}},this),!this.lineArc){t.lineWidth=this.angleLineWidth,t.strokeStyle=this.angleLineColor;for(var i=this.valuesCount-1;i>=0;i--){if(this.angleLineWidth>0){var e=this.getPointPosition(i,this.calculateCenterOffset(this.max));t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(e.x,e.y),t.stroke(),t.closePath()}var s=this.getPointPosition(i,this.calculateCenterOffset(this.max)+5);t.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),t.fillStyle=this.pointLabelFontColor;var o=this.labels.length,a=this.labels.length/2,h=a/2,l=h>i||i>o-h,r=i===h||i===o-h;t.textAlign=0===i?"center":i===a?"center":a>i?"left":"right",t.textBaseline=r?"middle":l?"bottom":"top",t.fillText(this.labels[i],s.x,s.y)}}}}}),s.addEvent(window,"resize",function(){var t;return function(){clearTimeout(t),t=setTimeout(function(){n(e.instances,function(t){t.options.responsive&&t.resize(t.render,!0)})},50)}}()),p?define(function(){return e}):"object"==typeof module&&module.exports&&(module.exports=e),t.Chart=e,e.noConflict=function(){return t.Chart=i,e}}).call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleBeginAtZero:!0,scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Bar",defaults:s,initialize:function(t){var s=this.options;this.ScaleClass=i.Scale.extend({offsetGridLines:!0,calculateBarX:function(t,i,e){var n=this.calculateBaseWidth(),o=this.calculateX(e)-n/2,a=this.calculateBarWidth(t);return o+a*i+i*s.barDatasetSpacing+a/2},calculateBaseWidth:function(){return this.calculateX(1)-this.calculateX(0)-2*s.barValueSpacing},calculateBarWidth:function(t){var i=this.calculateBaseWidth()-(t-1)*s.barDatasetSpacing;return i/t}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getBarsAtEvent(t):[];this.eachBars(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),this.BarClass=i.Rectangle.extend({strokeWidth:this.options.barStrokeWidth,showStroke:this.options.barShowStroke,ctx:this.chart.ctx}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,bars:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.bars.push(new this.BarClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.strokeColor,fillColor:i.fillColor,highlightFill:i.highlightFill||i.fillColor,highlightStroke:i.highlightStroke||i.strokeColor}))},this)},this),this.buildScale(t.labels),this.BarClass.prototype.base=this.scale.endPoint,this.eachBars(function(t,i,s){e.extend(t,{width:this.scale.calculateBarWidth(this.datasets.length),x:this.scale.calculateBarX(this.datasets.length,s,i),y:this.scale.endPoint}),t.save()},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachBars(function(t){t.save()}),this.render()},eachBars:function(t){e.each(this.datasets,function(i,s){e.each(i.bars,t,this,s)},this)},getBarsAtEvent:function(t){for(var i,s=[],n=e.getRelativePosition(t),o=function(t){s.push(t.bars[i])},a=0;a<this.datasets.length;a++)for(i=0;i<this.datasets[a].bars.length;i++)if(this.datasets[a].bars[i].inRange(n.x,n.y))return e.each(this.datasets,o),s;return s},buildScale:function(t){var i=this,s=function(){var t=[];return i.eachBars(function(i){t.push(i.value)}),t},n={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(s(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.barShowStroke?this.options.barStrokeWidth:0,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(n,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new this.ScaleClass(n)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].bars.push(new this.BarClass({value:t,label:i,x:this.scale.calculateBarX(this.datasets.length,e,this.scale.valuesCount+1),y:this.scale.endPoint,width:this.scale.calculateBarWidth(this.datasets.length),base:this.scale.endPoint,strokeColor:this.datasets[e].strokeColor,fillColor:this.datasets[e].fillColor}))
},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.bars.shift()},this),this.update()},reflow:function(){e.extend(this.BarClass.prototype,{y:this.scale.endPoint,base:this.scale.endPoint});var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();this.chart.ctx;this.scale.draw(i),e.each(this.datasets,function(t,s){e.each(t.bars,function(t,e){t.hasValue()&&(t.base=this.scale.endPoint,t.transition({x:this.scale.calculateBarX(this.datasets.length,s,e),y:this.scale.calculateY(t.value),width:this.scale.calculateBarWidth(this.datasets.length)},i).draw())},this)},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Doughnut",defaults:s,initialize:function(t){this.segments=[],this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,this.SegmentArc=i.Arc.extend({ctx:this.chart.ctx,x:this.chart.width/2,y:this.chart.height/2}),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.calculateTotal(t),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({value:t.value,outerRadius:this.options.animateScale?0:this.outerRadius,innerRadius:this.options.animateScale?0:this.outerRadius/100*this.options.percentageInnerCutout,fillColor:t.color,highlightColor:t.highlight||t.color,showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,startAngle:1.5*Math.PI,circumference:this.options.animateRotate?0:this.calculateCircumference(t.value),label:t.label})),e||(this.reflow(),this.update())},calculateCircumference:function(t){return 2*Math.PI*(Math.abs(t)/this.total)},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=Math.abs(t.value)},this)},update:function(){this.calculateTotal(this.segments),e.each(this.activeElements,function(t){t.restore(["fillColor"])}),e.each(this.segments,function(t){t.save()}),this.render()},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,e.each(this.segments,function(t){t.update({outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout})},this)},draw:function(t){var i=t?t:1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.calculateCircumference(t.value),outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout},i),t.endAngle=t.startAngle+t.circumference,t.draw(),0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle)},this)}}),i.types.Doughnut.extend({name:"Pie",defaults:e.merge(s,{percentageInnerCutout:0})})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,bezierCurve:!0,bezierCurveTension:.4,pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Line",defaults:s,initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx,inRange:function(t){return Math.pow(t-this.x,2)<Math.pow(this.radius+this.hitDetectionRadius,2)}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this),this.buildScale(t.labels),this.eachPoints(function(t,i){e.extend(t,{x:this.scale.calculateX(i),y:this.scale.endPoint}),t.save()},this)},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachPoints(function(t){t.save()}),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.datasets,function(t){e.each(t.points,function(t){t.inRange(s.x,s.y)&&i.push(t)})},this),i},buildScale:function(t){var s=this,n=function(){var t=[];return s.eachPoints(function(i){t.push(i.value)}),t},o={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(n(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.pointDotRadius+this.options.pointDotStrokeWidth,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(o,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new i.Scale(o)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:this.scale.calculateX(this.scale.valuesCount+1),y:this.scale.endPoint,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.points.shift()},this),this.update()},reflow:function(){var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();var s=this.chart.ctx,n=function(t){return null!==t.value},o=function(t,i,s){return e.findNextWhere(i,n,s)||t},a=function(t,i,s){return e.findPreviousWhere(i,n,s)||t};this.scale.draw(i),e.each(this.datasets,function(t){var h=e.where(t.points,n);e.each(t.points,function(t,e){t.hasValue()&&t.transition({y:this.scale.calculateY(t.value),x:this.scale.calculateX(e)},i)},this),this.options.bezierCurve&&e.each(h,function(t,i){var s=i>0&&i<h.length-1?this.options.bezierCurveTension:0;t.controlPoints=e.splineCurve(a(t,h,i),t,o(t,h,i),s),t.controlPoints.outer.y>this.scale.endPoint?t.controlPoints.outer.y=this.scale.endPoint:t.controlPoints.outer.y<this.scale.startPoint&&(t.controlPoints.outer.y=this.scale.startPoint),t.controlPoints.inner.y>this.scale.endPoint?t.controlPoints.inner.y=this.scale.endPoint:t.controlPoints.inner.y<this.scale.startPoint&&(t.controlPoints.inner.y=this.scale.startPoint)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(h,function(t,i){if(0===i)s.moveTo(t.x,t.y);else if(this.options.bezierCurve){var e=a(t,h,i);s.bezierCurveTo(e.controlPoints.outer.x,e.controlPoints.outer.y,t.controlPoints.inner.x,t.controlPoints.inner.y,t.x,t.y)}else s.lineTo(t.x,t.y)},this),s.stroke(),this.options.datasetFill&&h.length>0&&(s.lineTo(h[h.length-1].x,this.scale.endPoint),s.lineTo(h[0].x,this.scale.endPoint),s.fillStyle=t.fillColor,s.closePath(),s.fill()),e.each(h,function(t){t.draw()})},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:!0,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:!0,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"PolarArea",defaults:s,initialize:function(t){this.segments=[],this.SegmentArc=i.Arc.extend({showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,ctx:this.chart.ctx,innerRadius:0,x:this.chart.width/2,y:this.chart.height/2}),this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,lineArc:!0,width:this.chart.width,height:this.chart.height,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,valuesCount:t.length}),this.updateScaleRange(t),this.scale.update(),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({fillColor:t.color,highlightColor:t.highlight||t.color,label:t.label,value:t.value,outerRadius:this.options.animateScale?0:this.scale.calculateCenterOffset(t.value),circumference:this.options.animateRotate?0:this.scale.getCircumference(),startAngle:1.5*Math.PI})),e||(this.reflow(),this.update())},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=t.value},this),this.scale.valuesCount=this.segments.length},updateScaleRange:function(t){var i=[];e.each(t,function(t){i.push(t.value)});var s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s,{size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2})},update:function(){this.calculateTotal(this.segments),e.each(this.segments,function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.updateScaleRange(this.segments),this.scale.update(),e.extend(this.scale,{xCenter:this.chart.width/2,yCenter:this.chart.height/2}),e.each(this.segments,function(t){t.update({outerRadius:this.scale.calculateCenterOffset(t.value)})},this)},draw:function(t){var i=t||1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.scale.getCircumference(),outerRadius:this.scale.calculateCenterOffset(t.value)},i),t.endAngle=t.startAngle+t.circumference,0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle),t.draw()},this),this.scale.draw()}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers;i.Type.extend({name:"Radar",defaults:{scaleShowLine:!0,angleShowLineOut:!0,scaleShowLabels:!1,scaleBeginAtZero:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:10,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'},initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx}),this.datasets=[],this.buildScale(t),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){var o;this.scale.animation||(o=this.scale.getPointPosition(n,this.scale.calculateCenterOffset(e))),s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,x:this.options.animation?this.scale.xCenter:o.x,y:this.options.animation?this.scale.yCenter:o.y,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this)},this),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=e.getRelativePosition(t),s=e.getAngleFromPoint({x:this.scale.xCenter,y:this.scale.yCenter},i),n=2*Math.PI/this.scale.valuesCount,o=Math.round((s.angle-1.5*Math.PI)/n),a=[];return(o>=this.scale.valuesCount||0>o)&&(o=0),s.distance<=this.scale.drawingArea&&e.each(this.datasets,function(t){a.push(t.points[o])}),a},buildScale:function(t){this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,angleLineColor:this.options.angleLineColor,angleLineWidth:this.options.angleShowLineOut?this.options.angleLineWidth:0,pointLabelFontColor:this.options.pointLabelFontColor,pointLabelFontSize:this.options.pointLabelFontSize,pointLabelFontFamily:this.options.pointLabelFontFamily,pointLabelFontStyle:this.options.pointLabelFontStyle,height:this.chart.height,width:this.chart.width,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,labels:t.labels,valuesCount:t.datasets[0].data.length}),this.scale.setScaleSize(),this.updateScaleRange(t.datasets),this.scale.buildYLabels()},updateScaleRange:function(t){var i=function(){var i=[];return e.each(t,function(t){t.data?i=i.concat(t.data):e.each(t.points,function(t){i.push(t.value)})}),i}(),s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s)},addData:function(t,i){this.scale.valuesCount++,e.each(t,function(t,e){var s=this.scale.getPointPosition(this.scale.valuesCount,this.scale.calculateCenterOffset(t));this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:s.x,y:s.y,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.labels.push(i),this.reflow(),this.update()},removeData:function(){this.scale.valuesCount--,this.scale.labels.shift(),e.each(this.datasets,function(t){t.points.shift()},this),this.reflow(),this.update()},update:function(){this.eachPoints(function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.scale,{width:this.chart.width,height:this.chart.height,size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2}),this.updateScaleRange(this.datasets),this.scale.setScaleSize(),this.scale.buildYLabels()},draw:function(t){var i=t||1,s=this.chart.ctx;this.clear(),this.scale.draw(),e.each(this.datasets,function(t){e.each(t.points,function(t,e){t.hasValue()&&t.transition(this.scale.getPointPosition(e,this.scale.calculateCenterOffset(t.value)),i)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(t.points,function(t,i){0===i?s.moveTo(t.x,t.y):s.lineTo(t.x,t.y)},this),s.closePath(),s.stroke(),s.fillStyle=t.fillColor,s.fill(),e.each(t.points,function(t){t.hasValue()&&t.draw()})},this)}})}.call(this);
/**
 * ml-dimension-builder
 *
 * Angular Module for building MarkLogic search dimensions
 */

(function(angular) {
  'use strict';

  angular.module('ml-dimension-builder', []);

})(window.angular);

(function(angular) {
  'use strict';

  var app = angular.module('ml-dimension-builder');

  app.directive('dimensionBuilder', ['dimensionBuilderService',
    function DB(dimensionBuilderService) {
      return {
        scope: {
          data: '=dimensionBuilder',
        },

        templateUrl: 'ml-dimension-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.facets = [];

          /**
           * Removes a dimension
           */
          scope.removeDimension = function(idx) {
            scope.facets.splice(idx, 1);
          };

          /**
           * Adds a dimension
           */
          scope.addDimension = function() {
            scope.facets.push({});
          };

          scope.$watch('data.needsRefresh', function(curr) {
            if (! curr) return;

            scope.facets = dimensionBuilderService.toFacets(data.dimensions, scope.data.fields);
            scope.data.needsRefresh = false;
          });

          scope.$watch('facets', function(curr) {
            if (! curr) return;

            data.dimensions = dimensionBuilderService.toDimensions(scope.facets, scope.data.fields);
          }, true);
        }
      };
    }
  ]);

  app.directive('dimensionBuilderChooser', [
    function dimensionBuilderChooser() {
      return {
        scope: {
          dimensionFields: '=',
          item: '=dimensionBuilderChooser',
          onRemove: '&',
        },

        templateUrl: 'ml-dimension-builder/ChooserDirective.html'
      };
    }
  ]);

  app.directive('dimensionBuilderRule', [
    function dimensionBuilderRule() {
      return {
        scope: {
          dimensionFields: '=',
          rule: '=dimensionBuilderRule',
          onRemove: '&',
        },

        templateUrl: 'ml-dimension-builder/RuleDirective.html',

        link: function(scope) {
          scope.getType = function() {
            var fields = scope.dimensionFields,
                field = scope.rule.field;

            if (! fields || ! field) return;

            return fields[field].type;
          };
        }
      };
    }
  ]);

  // Determines which Rule type should be displayed
  app.directive('dimensionType', [
    function dimensionType() {
      return {
        scope: {
          type: '=dimensionType',
          rule: '=',
          guide: '=',
        },

        template: '<ng-include src="getTemplateUrl()" />',

        link: function(scope) {
          scope.getTemplateUrl = function() {
            var type = scope.type;
            if (! type) return;

            type = type.charAt(0).toUpperCase() + type.slice(1);

            return 'ml-dimension-builder/types/' + type + '.html';
          };

          scope.inputNeeded = function() {
            // None of these requires an input.
            var needs = [];

            return ~needs.indexOf(scope.rule.operation);
          };
        },
      };
    }
  ]);

})(window.angular);

/**
 * Convert facets into queries, and vice versa
 */

(function(angular) {
  'use strict';

  angular.module('ml-dimension-builder')
    .factory('dimensionBuilderService', [
      function() {
        return {
          toFacets: toFacets,
          toDimensions: toDimensions,
        };
      }
    ]);

  function toFacets(dimensions, fieldMap) {
    var facets = dimensions.map(parseDimensionGroup.bind(dimensions, fieldMap));
    return facets;
  }

  function toDimensions(facets, fieldMap) {
    var dimensions = facets.map(parseFacetGroup.bind(facets, fieldMap)).filter(function(item) {
      return !! item;
    });
    return dimensions;
  }

  function parseDimensionGroup(fieldMap, group, truthy) {
    if (truthy !== false) truthy = true;

    var operation = Object.keys(group)[0];
    var obj = getDimensionTemplate('item');

    switch (operation) {
      case 'avg':
      case 'count':
      case 'max':
      case 'median':
      case 'min':
      case 'stddev':
      case 'stddev-population':
      case 'sum':
      case 'variance':
      case 'variance-population':
      case 'groupby':
      case 'atomic':
        obj.field = group[operation].field;
        obj.operation = operation;
        delete obj.value;
        break;
      default:
        obj.field = Object.keys(group[operation])[0];
        break;
    }

    return obj;
  }

  function parseFacetGroup(fieldMap, group) {
    var obj = {};

    if (group.type === 'group') {
      obj[group.operation] = group.rules.map(parseFacetGroup.bind(group, fieldMap)).filter(function(item) {
        return !! item;
      });
      return obj;
    }

    var fieldName = group.field;
    var fieldData = fieldMap[fieldName];

    if (! fieldName) return;

    switch (fieldData.type) {
      case 'string':
      case 'int':
      case 'long':
      case 'decimal':
      case 'boolean':
      case 'date':
        if (! group.operation) return;

        obj[group.operation] = {};
        obj[group.operation].field = fieldName;
        break;

      default:
        throw new Error('unexpected operation');
    }

    return obj;
  }

  function getDimensionTemplate(type) {
    var templates = {
      item: {
        field: '',
        operation: '',
        value: ''
      }
    };

    return angular.copy(templates[type]);
  }

})(window.angular);

(function(angular) {
  "use strict"; 

  angular.module("ml-dimension-builder").run(["$templateCache", function($templateCache) {
    $templateCache.put("ml-dimension-builder/BuilderDirective.html", 
      "<div class=\"dimension-builder\">" +
      "  <div class=\"filter-panels\">" +
      "    <div class=\"list-group form-inline\">" +
      "      <div data-ng-repeat=\"facet in facets\" data-dimension-builder-chooser=\"facet\" data-dimension-fields=\"data.fields\" data-on-remove=\"removeDimension($index)\" data-depth=\"0\"></div>" +
      "      <div class=\"list-group-item actions\">" +
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Dimension\" data-ng-click=\"addDimension()\">" +
      "          <i class=\"fa fa-plus\"> Add Dimension</i>" +
      "        </a>" +
      "     </div>" +
      "    </div>" +
      "  </div>" +
      "</div>");

    $templateCache.put("ml-dimension-builder/ChooserDirective.html", 
      "<div class=\"list-group-item dimension-builder-chooser\">" +
      "  <div data-dimension-builder-rule=\"item\" data-dimension-fields=\"dimensionFields\" data-on-remove=\"onRemove()\"></div>" +
      "</div>");

    $templateCache.put("ml-dimension-builder/RuleDirective.html", 
      "<div class=\"dimension-builder-rule\">" +
      "  <select class=\"form-control\" data-ng-model=\"rule.field\" data-ng-options=\"key as key for (key, value) in dimensionFields\"></select>" +
      "  <span data-dimension-type=\"getType()\" data-rule=\"rule\" data-guide=\"dimensionFields[rule.field]\"></span>" +
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" +
      "    <i class=\"fa fa-minus\"></i>" +
      "  </a>" +
      "</div>");

    // String type
    $templateCache.put("ml-dimension-builder/types/String.html", 
      "<span class=\"string-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Text\">" + 
      "      <option value=\"count\">count</option>" + 
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" +
      "      <option value=\"atomic\">atomic</option>" +
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "</span>");

    // Int type
    $templateCache.put("ml-dimension-builder/types/Int.html", 
      "<span class=\"integer-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" +  
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Long type
    $templateCache.put("ml-dimension-builder/types/Long.html", 
      "<span class=\"integer-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" +
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Decimal type
    $templateCache.put("ml-dimension-builder/types/Decimal.html", 
      "<span class=\"decimal-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Function\">" +
      "      <option value=\"avg\">avg</option>" +
      "      <option value=\"count\">count</option>" + 
      "      <option value=\"max\">max</option>" + 
      "      <option value=\"median\">median</option>" +  
      "      <option value=\"min\">min</option>" +  
      "      <option value=\"stddev\">stddev</option>" +  
      "      <option value=\"stddev-population\">stddev-population</option>" +  
      "      <option value=\"sum\">sum</option>" +  
      "      <option value=\"variance\">variance</option>" +  
      "      <option value=\"variance-population\">variance-population</option>" + 
      "    </optgroup>" + 
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"number\" min=\"{{ guide.minimum }}\" max=\"{{ guide.maximum }}\" />" +
      "</span>");

    // Boolean type
    $templateCache.put("ml-dimension-builder/types/Boolean.html", 
      "<span class=\"boolean-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Generic\">" + 
      "      <option value=\"groupby\">group by</option>" + 
      "      <option value=\"atomic\">atomic</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "</span>");

    // Date type
    $templateCache.put("ml-dimension-builder/types/Date.html", 
      "<span class=\"date-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Generic\">" +
      "      <option value=\"groupby\">group by</option>" +
      "      <option value=\"atomic\">Standard</option>" +
      "    </optgroup>" +
      "  </select>" +
      "</span>");
  }]);
})(window.angular);

/**
 * ml-index-builder
 *
 * Angular Module for building MarkLogic indexes
 */

(function(angular) {
  'use strict';

  angular.module('ml-index-builder', []);

})(window.angular);

(function(angular) {
  'use strict';

  var app = angular.module('ml-index-builder');

  app.directive('indexBuilder', ['indexBuilderService',
    function DB(indexBuilderService) {
      return {
        scope: {
          data: '=indexBuilder',
        },

        templateUrl: 'ml-index-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.facets = [];

          /**
           * Removes an index
           */
          scope.removeIndex = function(idx) {
            scope.facets.splice(idx, 1);
          };

          /**
           * Adds an index
           */
          scope.addIndex = function() {
            scope.facets.push({});
          };

          scope.$watch('data.needsRefresh', function(curr) {
            if (! curr) return;

            scope.facets = indexBuilderService.toFacets(data.indexes, scope.data.fields);
            scope.data.needsRefresh = false;
          });

          scope.$watch('facets', function(curr) {
            if (! curr) return;

            data.indexes = indexBuilderService.toIndexes(scope.facets, scope.data.fields);
          }, true);
        }
      };
    }
  ]);

  app.directive('indexBuilderChooser', [
    function indexBuilderChooser() {
      return {
        scope: {
          indexFields: '=',
          item: '=indexBuilderChooser',
          onRemove: '&',
        },

        templateUrl: 'ml-index-builder/ChooserDirective.html'
      };
    }
  ]);

  app.directive('indexBuilderRule', [
    function indexBuilderRule() {
      return {
        scope: {
          indexFields: '=',
          rule: '=indexBuilderRule',
          onRemove: '&',
        },

        templateUrl: 'ml-index-builder/RuleDirective.html',

        link: function(scope) {
          scope.getType = function() {
            var fields = scope.indexFields,
                field = scope.rule.field;

            if (! fields || ! field) return;

            return fields[field].type;
          };
        }
      };
    }
  ]);

  // Determines which Rule type should be displayed
  app.directive('indexType', [
    function indexType() {
      return {
        scope: {
          type: '=indexType',
          rule: '=',
          guide: '=',
        },

        template: '<ng-include src="getTemplateUrl()" />',

        link: function(scope) {
          scope.getTemplateUrl = function() {
            var type = scope.type;
            if (! type) return;

            type = type.charAt(0).toUpperCase() + type.slice(1);

            return 'ml-index-builder/types/' + type + '.html';
          };

          scope.inputNeeded = function() {
            // None of these requires an input.
            var needs = [
              'int',
              'unsignedInt',
              'long',
              'unsignedLong',
              'float',
              'double',
              'decimal' ,
              'dateTime',
              'time',
              'date',
              'gYearMonth',
              'gYear',
              'gMonth',
              'gDay',
              'yearMonthDuration',
              'dayTimeDuration',
              'string',
              'anyURI'
            ];

            return ~needs.indexOf(scope.rule.operation);
          };
        },
      };
    }
  ]);

})(window.angular);

/**
 * Convert facets into indexes, and vice versa
 */

(function(angular) {
  'use strict';

  angular.module('ml-index-builder')
    .factory('indexBuilderService', [
      function() {
        return {
          toFacets: toFacets,
          toIndexes: toIndexes,
        };
      }
    ]);

  function toFacets(indexes, fieldMap) {
    var facets = indexes.map(parseIndexGroup.bind(indexes, fieldMap));
    return facets;
  }

  function toIndexes(facets, fieldMap) {
    var indexes = facets.map(parseFacetGroup.bind(facets, fieldMap)).filter(function(item) {
      return !! item;
    });
    return indexes;
  }

  function parseIndexGroup(fieldMap, group, truthy) {
    if (truthy !== false) truthy = true;

    var operation = Object.keys(group)[0];
    var obj = getIndexTemplate('item');

    // scalar type
    switch (operation) {
      case 'int':
      case 'unsignedInt':
      case 'long':
      case 'unsignedLong':
      case 'float':
      case 'double':
      case 'decimal':
      case 'dateTime':
      case 'time':
      case 'date':
      case 'gYearMonth':
      case 'gYear':
      case 'gMonth':
      case 'gDay':
      case 'yearMonthDuration':
      case 'dayTimeDuration':
      case 'string':
      case 'anyURI':
        obj.field = group[operation].field;
        obj.operation = operation;
        obj.value = group[operation].value;
        break;
      default:
        obj.field = Object.keys(group[operation])[0];
        break;
    }

    return obj;
  }

  function parseFacetGroup(fieldMap, group) {
    var obj = {};

    if (group.type === 'group') {
      obj[group.operation] = group.rules.map(parseFacetGroup.bind(group, fieldMap)).filter(function(item) {
        return !! item;
      });
      return obj;
    }

    var fieldName = group.field;
    var fieldData = fieldMap[fieldName];

    if (! fieldName) return;

    switch (fieldData.type) {
      case 'element':
        if (! group.operation) return;

        obj[group.operation] = {};
        obj[group.operation].field = fieldName;
        obj[group.operation].value = group.value;
        break;

      default:
        throw new Error('unexpected type');
    }

    return obj;
  }

  function getIndexTemplate(type) {
    var templates = {
      item: {
        field: '',
        operation: '',
        value: ''
      }
    };

    return angular.copy(templates[type]);
  }

})(window.angular);

(function(angular) {
  "use strict"; 

  angular.module("ml-index-builder").run(["$templateCache", function($templateCache) {
    $templateCache.put("ml-index-builder/BuilderDirective.html", 
      "<div class=\"index-builder\">" +
      "  <div class=\"filter-panels\">" +
      "    <div class=\"list-group form-inline\">" +
      "      <div data-ng-repeat=\"facet in facets\" data-index-builder-chooser=\"facet\" data-index-fields=\"data.fields\" data-on-remove=\"removeIndex($index)\" data-depth=\"0\"></div>" +
      "      <div class=\"list-group-item actions\">" +
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Index\" data-ng-click=\"addIndex()\">" +
      "          <i class=\"fa fa-plus\"> Add Index</i>" +
      "        </a>" +
      "     </div>" +
      "    </div>" +
      "  </div>" +
      "</div>");

    $templateCache.put("ml-index-builder/ChooserDirective.html", 
      "<div class=\"list-group-item index-builder-chooser\">" +
      "  <div data-index-builder-rule=\"item\" data-index-fields=\"indexFields\" data-on-remove=\"onRemove()\"></div>" +
      "</div>");

    $templateCache.put("ml-index-builder/RuleDirective.html", 
      "<div class=\"index-builder-rule\">" +
      "  <select class=\"form-control\" data-ng-model=\"rule.field\" data-ng-options=\"key as key for (key, value) in indexFields\"></select>" +
      "  <span data-index-type=\"getType()\" data-rule=\"rule\" data-guide=\"indexFields[rule.field]\"></span>" +
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" +
      "    <i class=\"fa fa-minus\"></i>" +
      "  </a>" +
      "</div>");

    // Element Range Index type
    $templateCache.put("ml-index-builder/types/Element.html", 
      "<span class=\"element-rule\">" +
      "  <select data-ng-model=\"rule.operation\" class=\"form-control\">" +
      "    <optgroup label=\"Scalar Type\">" +
      "      <option value=\"int\">int</option>" + 
      "      <option value=\"unsignedInt\">unsignedInt</option>" + 
      "      <option value=\"long\">long</option>" + 
      "      <option value=\"unsignedLong\">unsignedLong</option>" + 
      "      <option value=\"float\">float</option>" + 
      "      <option value=\"double\">double</option>" + 
      "      <option value=\"decimal\">decimal</option>" + 
      "      <option value=\"dateTime\">dateTime</option>" + 
      "      <option value=\"time\">time</option>" + 
      "      <option value=\"date\">date</option>" + 
      "      <option value=\"gYearMonth\">gYearMonth</option>" + 
      "      <option value=\"gYear\">gYear</option>" + 
      "      <option value=\"gMonth\">gMonth</option>" + 
      "      <option value=\"gDay\">gDay</option>" + 
      "      <option value=\"yearMonthDuration\">yearMonthDuration</option>" +
      "      <option value=\"dayTimeDuration\">dayTimeDuration</option>" + 
      "      <option value=\"string\">string</option>" + 
      "      <option value=\"anyURI\">anyURI</option>" +  
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" placeholder=\"namespace uri\" />" + 
      "</span>");
  }]);
})(window.angular);

/**
 * ml-sq-builder
 *
 * Angular Module for building MarkLogic Structured Query
 */

(function(angular) {
  'use strict';

  angular.module('ml-sq-builder', [
    'RecursionHelper',
  ]);

})(window.angular);

(function(angular) {
  'use strict';

  var app = angular.module('ml-sq-builder');

  app.directive('sqBuilder', [
    'sqBuilderService',

    function EB(sqBuilderService) {
      return {
        scope: {
          data: '=sqBuilder',
        },

        templateUrl: 'ml-sq-builder/BuilderDirective.html',

        link: function(scope) {
          var data = scope.data;

          scope.filters = [];

          /**
           * Removes either group or rule
           */
          scope.removeChild = function(idx) {
            scope.filters.splice(idx, 1);
          };

          /**
           * Adds a single rule
           */
          scope.addRule = function() {
            scope.filters.push({});
          };

          /**
           * Adds a group of rules
           */
          scope.addGroup = function() {
            scope.filters.push({
              type: 'group',
              subType: 'and-query',
              rules: []
            });
          };

          scope.$watch('data.needsUpdate', function(curr) {
            if (! curr) return;

            scope.filters = sqBuilderService.toFilters(data.query, scope.data.fields);
            scope.data.needsUpdate = false;
          });

          scope.$watch('filters', function(curr) {
            if (! curr) return;

            data.query = sqBuilderService.toQuery(scope.filters, scope.data.fields);
          }, true);
        }
      };
    }
  ]);

  // Recursively decide whether to show a group or rule
  app.directive('sqBuilderChooser', [
    'RecursionHelper',
    'groupClassHelper',

    function sqBuilderChooser(RH, groupClassHelper) {
      return {
        scope: {
          sqFields: '=',
          sqParameters: '=',
          item: '=sqBuilderChooser',
          onRemove: '&',
        },

        templateUrl: 'ml-sq-builder/ChooserDirective.html',

        compile: function (element) {
          return RH.compile(element, function(scope, el, attrs) {
            var depth = scope.depth = (+ attrs.depth),
                item = scope.item;

            scope.getGroupClassName = function() {
              var level = depth;
              if (item.type === 'group') level++;

              return groupClassHelper(level);
            };
          });
        }
      };
    }
  ]);

  app.directive('sqBuilderGroup', [
    'RecursionHelper',
    'groupClassHelper',

    function sqBuilderGroup(RH, groupClassHelper) {
      return {
        scope: {
          sqFields: '=',
          sqParameters: '=',
          group: '=sqBuilderGroup',
          onRemove: '&',
        },

        templateUrl: 'ml-sq-builder/GroupDirective.html',

        compile: function(element) {
          return RH.compile(element, function(scope, el, attrs) {
            var depth = scope.depth = (+ attrs.depth);
            var group = scope.group;

            scope.addRule = function() {
              group.rules.push({});
            };
            scope.addGroup = function() {
              group.rules.push({
                type: 'group',
                subType: 'and-query',
                rules: []
              });
            };

            scope.removeChild = function(idx) {
              group.rules.splice(idx, 1);
            };

            scope.getGroupClassName = function() {
              return groupClassHelper(depth + 1);
            };
          });
        }
      };
    }
  ]);

  app.directive('sqBuilderRule', [
    function sqBuilderRule() {
      return {
        scope: {
          sqFields: '=',
          sqParameters: '=',
          rule: '=sqBuilderRule',
          onRemove: '&',
        },

        templateUrl: 'ml-sq-builder/RuleDirective.html',

        link: function(scope) {
          scope.getType = function() {
            var fields = scope.sqFields,
              field = scope.rule.field;

            if (! fields || ! field) return;

            return fields[field].type;
          };
        }
      };
    }

  ]);

  // Determines which rule type should be displayed
  app.directive('sqType', [
    function() {
      return {
        scope: {
          type: '=sqType',
          rule: '=',
          guide: '=',
          parameters: '=',
        },

        template: '<ng-include src="getTemplateUrl()" />',

        link: function(scope) {
          scope.getTemplateUrl = function() {
            var type = scope.type;
            if (! type) return;

            type = type.charAt(0).toUpperCase() + type.slice(1);

            return 'ml-sq-builder/types/' + type + '.html';
          };

          // This is a weird hack to make sure these are numbers
          scope.booleans = [ 'False', 'True' ];
          scope.booleansOrder = [ 'True', 'False' ];

          scope.inputNeeded = function() {
            var needs = [
              'value-query',
              'word-query',
              'EQ',
              'NE',
              'GT',
              'GE',
              'LT',
              'LE'
            ];

            // A range query must either be backed by a 
            // range index or used in a filtered search 
            // operation.

            return ~needs.indexOf(scope.rule.subType);
          };
        },
      };
    }
  ]);

})(window.angular);

(function(angular) {
  'use strict';

  // keeps all of the groups colored correctly
  angular.module('ml-sq-builder')
    .factory('groupClassHelper', function groupClassHelper() {

      return function(level) {
        var levels = [
          '',
          'list-group-item-info',
          'list-group-item-success',
          'list-group-item-warning',
          'list-group-item-danger',
        ];

        return levels[level % levels.length];
      };
    });

})(window.angular);

(function(angular) {
  'use strict';

  // Convert filters into queries, and vice versa
  angular.module('ml-sq-builder')
    .factory('sqBuilderService', [
      function() {
        return {
          toFilters: toFilters,
          toQuery: toQuery,
        };
      }
    ]);

  function toFilters(query, fieldMap) {
    var filters = query.map(parseQueryGroup.bind(query, fieldMap));
    return filters;
  }

  function toQuery(filters, fieldMap) {
    var query = filters.map(parseFilterGroup.bind(filters, fieldMap)).filter(function(item) {
      return !! item;
    });
    return query;
  }

  function parseQueryGroup(fieldMap, group) {
    var typeMap = {
      'or-query': 'group',
      'and-query': 'group',
      'value-query': 'value',
      'word-query': 'word',
      'range-query': 'range'
    };

    // The group parameter is an element in the query array.
    var key = Object.keys(group)[0];
    var query = group[key];
    var type = typeMap[key];
    var obj = getFilterTemplate(type);

    switch (key) {
      case 'or-query':
      case 'and-query':
        obj.rules = group[key].queries.map(parseQueryGroup.bind(group, fieldMap));
        obj.subType = key;
        break;
      case 'value-query':
        obj.field = getConstraintName(query);
        obj.subType = key;

        var fieldData = fieldMap[obj.field];
        if (fieldData.type === 'boolean') {
          // group.text is true or false
          obj.value = query.text ? 1 : 0;
        } else {
          obj.value = query.text;
        }

        break;
      case 'word-query':
        obj.field = getConstraintName(query);
        obj.subType = key;
        obj.value = query.text;
        break;
      case 'range-query':
        if (query['path-index']) {
          obj.field = getConstraintName(query);
          obj.subType = 'value-query';
          obj.value = query.value;
        } else {
          obj.field = getConstraintName(query);
          obj.subType = query['range-operator'];
          obj.operator = obj.subType;
          obj.value = query.value;
        }
        break;
      default:
        throw new Error('unexpected query');
    }

    return obj;
  }

  function parseFilterGroup(fieldMap, group) {
    var obj = {};

    if (group.type === 'group') {
      obj[group.subType] = group.rules.map(parseFilterGroup.bind(group, fieldMap)).filter(function(item) {
        return !! item;
      });

      // The obj has only one property, its value is an array.
      // The key is equal to group.subType
      var key = Object.keys(obj)[0];
      var queries = {
        'queries': obj[key]
      };
      var queryObj = {};

      queryObj[key] = queries;

      return queryObj;
    }

    var fieldName = group.field;
    var fieldData = fieldMap[fieldName];

    if (! fieldName) return;

    switch (fieldData.type) {
      case 'string':
        // A query for a string field is translated 
        // to value-query or word-query or range-query.

        if (fieldData.classification === 'path-expression') {
          // Convert path rule to range-query
          var dataType = 'xs:' + fieldData.type;
          obj['range-query'] = {
            'path-index': {
              'text': fieldName,
              'namespaces': {}
            },
            'type': dataType,
            'range-operator': 'EQ',
            'value': group.value
          };
        } else {
          // Convert element or attribute rule to value-query/word-query
          // Set the default subType for newly created query
          if (!group.subType) {
            group.subType = 'value-query';
          }

          var value = {
            'text': group.value
          };

          setConstraint(value, fieldName, fieldData);

          obj[group.subType] = value;
        }

        break;
      case 'int':
      case 'long':
      case 'decimal':
        // A query for a numeric field is translated 
        // to range-query.
        // The type is the type of the range index.

        // Set the default subType for newly created query
        if (!group.subType) {
          group.subType = 'EQ';
        }

        var dataType = 'xs:' + fieldData.type;

        var value = {
          'type': dataType,
          'range-operator': group.subType,
          'value': group.value
        };

        setConstraint(value, fieldName, fieldData);

        if (fieldData.classification === 'path-expression') {
          value['path-index'] = {
            text: fieldName,
            namespaces: {}
          };
        }

        obj['range-query'] = value;

        break;
      case 'boolean':
        // A query for a boolean field is translated 
        // to value-query.
        // group.value is 1 or 0

        // Set the default value for newly created query
        if (group.value === undefined)
          group.value = 1;

        var value = {
          'text': group.value ? true : false
        };

        if (fieldData.classification === 'json-property') {
          value.type = 'boolean';
        }

        setConstraint(value, fieldName, fieldData);

        obj['value-query'] = value;

        break;
      case 'date':
        // TO DO
        break;

      default:
        throw new Error('unexpected field type');
    }

    return obj;
  }

  function getConstraintName(query) {
    if (query['json-property']) {
      return query['json-property'];
    } else if (query.attribute) {
      return query.attribute.name;
    } else if (query.element) {
      return query.element.name;
    } else if (query.field) {
      return query.field.name;
    } else if (query['path-index']) {
      return query['path-index'].text; 
    }
  }

  // You must specify at least one element, json-property, 
  // or field to define the range constraint to apply to 
  // the query. These components are mutually exclusive.
  function setConstraint(value, fieldName, fieldData) {
    var claz = fieldData.classification;

    if (claz === 'json-property') {
      value[claz] = fieldName;
    } else if (claz === 'element' || claz === 'attribute') {
      value[claz] = {
        name: fieldName,
        ns: fieldData.ns
      };
      if (claz === 'attribute') {
        value.element = {
          name: fieldData['parent-localname'],
          ns: fieldData['parent-namespace-uri']
        };
      }
    } else if (claz === 'field') {
      value[claz] = {
        name: fieldName,
        collation: fieldData.collation
      };
    }
  }

  function getFilterTemplate(type) {
    var templates = {
      group: {
        type: 'group',
        subType: '',
        rules: []
      },
      value: {
        field: '',
        subType: '',
        value: ''
      },
      word: {
        field: '',
        subType: '',
        value: ''
      },
      range: {
        field: '',
        subType: '',
        operator: '',
        value: null
      }
    };

    return angular.copy(templates[type]);
  }

})(window.angular);

(function(angular) {
  "use strict"; 

  angular.module("ml-sq-builder").run(["$templateCache", function($templateCache) {
    $templateCache.put("ml-sq-builder/BuilderDirective.html",
      "<div class=\"sq-builder\">" + 
      "  <div class=\"form-inline\">" +
      "    <p>If <select class=\"form-control\" data-ng-model=\"data.operation\">" + 
      "        <option value=\"and-query\">All</option>" + 
      "        <option value=\"or-query\">Any</option>" + 
      "      </select> of these conditions are met</p>" + 
      "  </div>" +
      "  <div class=\"filter-panels\">" + 
      "    <div class=\"list-group form-inline\">" + 
      "      <div data-ng-repeat=\"filter in filters\" data-sq-builder-chooser=\"filter\" data-sq-fields=\"data.fields\" data-sq-parameters=\"data.parameters\" data-on-remove=\"removeChild($index)\" data-depth=\"0\"></div>" + 
      "      <div class=\"list-group-item actions\">" +
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Rule\" data-ng-click=\"addRule()\">" + 
      "          <i class=\"fa fa-plus\"> Add Rule</i>" + 
      "        </a>" + 
      "        <a class=\"btn btn-xs btn-primary\" title=\"Add Group\" data-ng-click=\"addGroup()\">" + 
      "          <i class=\"fa fa-list\"> Add Group</i>" + 
      "        </a>" + 
      "      </div>" + 
      "    </div>" + 
      "  </div>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/ChooserDirective.html",
      "<div class=\"list-group-item sq-builder-chooser\" data-ng-class=\"getGroupClassName()\">" + 
      "  <div data-ng-if=\"item.type === \'group\'\" data-sq-builder-group=\"item\" data-depth=\"{{ depth }}\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-on-remove=\"onRemove()\"></div>" + 
      "  <div data-ng-if=\"item.type !== \'group\'\" data-sq-builder-rule=\"item\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-on-remove=\"onRemove()\"></div>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/GroupDirective.html",
      "<div class=\"sq-builder-group\">" +
      "  <h5>If" + 
      "    <select data-ng-model=\"group.subType\" class=\"form-control\">" + 
      "      <option value=\"and-query\">All</option>" + 
      "      <option value=\"or-query\">Any</option>" + 
      "    </select>" + 
      "    of these conditions are met" + 
      "  </h5>" + 
      "  <div data-ng-repeat=\"rule in group.rules\" data-sq-builder-chooser=\"rule\" data-sq-fields=\"sqFields\" data-sq-parameters=\"sqParameters\" data-depth=\"{{ +depth + 1 }}\" data-on-remove=\"removeChild($index)\"></div>" + 
      "  <div class=\"list-group-item actions\" data-ng-class=\"getGroupClassName()\">" + 
      "    <a class=\"btn btn-xs btn-primary\" title=\"Add Sub-Rule\" data-ng-click=\"addRule()\">" + 
      "      <i class=\"fa fa-plus\"> Add Rule</i>" + 
      "    </a>" + 
      "    <a class=\"btn btn-xs btn-primary\" title=\"Add Sub-Group\" data-ng-click=\"addGroup()\">" + 
      "      <i class=\"fa fa-list\"> Add Sub-Group</i>" + 
      "    </a>" + 
      "  </div>" + 
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" + 
      "    <i class=\"fa fa-minus\"></i>" + 
      "  </a>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/RuleDirective.html",
      "<div class=\"sq-builder-rule\">" + 
      "  <select class=\"form-control\" data-ng-model=\"rule.field\" data-ng-options=\"key as key for (key, value) in sqFields\"></select>" + 
      "  <span data-sq-type=\"getType()\" data-rule=\"rule\" data-guide=\"sqFields[rule.field]\" data-parameters=\"sqParameters\"></span>" + 
      "  <a class=\"btn btn-xs btn-danger remover\" data-ng-click=\"onRemove()\">" + 
      "    <i class=\"fa fa-minus\"></i>" + 
      "  </a>" + 
      "</div>");

    $templateCache.put("ml-sq-builder/types/String.html",
      "<span class=\"string-rule\">" +
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Text\">" + 
      "      <option value=\"word-query\">Contains</option>" + 
      "      <option value=\"value-query\">Equals</option>" +  
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Int.html",
      "<span class=\"integer-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Integer\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Long.html",
      "<span class=\"integer-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Integer\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Decimal.html",
      "<span class=\"decimal-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" +
      "    <optgroup label=\"Decimal\">" + 
      "      <option value=\"EQ\">=</option>" + 
      "      <option value=\"NE\">!=</option>" + 
      "      <option value=\"GT\">&gt;</option>" + 
      "      <option value=\"GE\">&ge;</option>" + 
      "      <option value=\"LT\">&lt;</option>" + 
      "      <option value=\"LE\">&le;</option>" + 
      "    </optgroup>" + 
      "  </select>" + 
      "  <input data-ng-if=\"inputNeeded()\" class=\"form-control\" data-ng-model=\"rule.value\" type=\"text\" />" + 
      "  <select class=\"form-control\" ng-model=\"rule.value\">" + 
      "    <option ng-repeat=\"parameter in parameters\" value=\"#{{parameter.name}}#\">{{parameter.name}}</option>" + 
      "  </select>" + 
      "</span>");

    $templateCache.put("ml-sq-builder/types/Boolean.html",
      "<span class=\"boolean-rule\">Equals" +  
      "  <select data-ng-model=\"rule.value\" class=\"form-control\" data-ng-options=\"booleans.indexOf(choice) as choice for choice in booleansOrder\"></select>" +
      "</span>");

    $templateCache.put("ml-sq-builder/types/Date.html",
      "<span class=\"date-rule\">" + 
      "  <select data-ng-model=\"rule.subType\" class=\"form-control\">" + 
      "    <optgroup label=\"Date\">" + 
      "    </optgroup>" + 
      "  </select>" + 
      "</span>");
  }]);
})(window.angular);

/*
 * @(#)util.js
 */

/*
 * Author: Jianmin Liu
 * Created: 2015/07/20
 */

var MarkLogic;

(function(MarkLogic) {
  (function(Util) {
    function parseMultiPart(body, contentType) {
      // Examples for content types:
      // multipart/mixed; boundary=ML_BOUNDARY_7372759131301359002
      var contentTypeLen = contentType.length;
      var boundary = null;
  
      if (15 <= contentTypeLen && contentType.substr(0, 15) === 'multipart/mixed') {
        boundary = contentType.replace(/^multipart.mixed\s*;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1');
        if (boundary.length === contentTypeLen) {
          // error: multipart/mixed response without boundary
          return null;
        }
      }

      // Parse Content-Disposition header string.
      function parseContentDisposition(str) {
        var qescRegExp = /\\([\u0000-\u007f])/g;
        var params = {};
        var parts = str.split(';');

        for (var i = 0; i < parts.length; i++) {
          var part = parts[i].trim();
          var segments = part.split('=');
          if (segments.length === 2) {
            var key = segments[0];
            var value = segments[1];
            if (value[0] === '"') {
              // remove quotes and escapes
              value = value.substr(1, value.length - 2).replace(qescRegExp, '$1');
            }
            params[key] = value;
          }
        }

        return params;
      }

      // \r\n is part of the boundary.
      boundary = '\r\n--' + boundary;
      var s = body;

      // Prepend what has been stripped by the body parsing mechanism.
      s = '\r\n' + s;

      var parts = s.split(new RegExp(boundary));
      var docs = [];
      var metadata = null;

      // First part is a preamble, last part is closing '--'
      for (var i = 1; i < parts.length-1; i++) {
        var subparts = parts[i].split('\r\n\r\n');
        var headers = subparts[0].split('\r\n');

        for (var j = 1; j < headers.length; j++) {
          var header = headers[j];
          var segments = header.split(':');
          if (segments.length === 2) {
            if ('content-disposition' === segments[0].toLowerCase()) {
              var params = parseContentDisposition(segments[1]);
              var uri = params.filename;
              if (uri) {
                var doc = JSON.parse(subparts[1]);
                doc.uri = uri;
                docs.push(doc);
                break;
              } else {
                metadata = JSON.parse(subparts[1]);
              }
            }
          }
        }
      }
      return {results: docs, metadata: metadata};
    }
    Util.parseMultiPart = parseMultiPart;

    function showLoader() {
      $('#loader').css('display', 'block');
    }
    Util.showLoader = showLoader;

    function hideLoader() {
      $('#loader').css('display', 'none');
    }
    Util.hideLoader = hideLoader;

    function assignToScope($scope, obj) {
      for(var key in obj) {
        $scope[key] = obj[key];
      }
    }
    Util.assignToScope = assignToScope;

    function showModal(dialogId) {
      jQuery(dialogId).modal({'backdrop' : 'static'});
    }
    Util.showModal = showModal;

    function hideModal(dialogId) {
      jQuery(dialogId).modal('hide');
    }
    Util.hideModal = hideModal;

    function getSessionProperty(name) {
      return window.sessionStorage.getItem(name);
    }
    Util.getSessionProperty = getSessionProperty;

    function setSessionProperty(name, value) {
      window.sessionStorage.setItem(name, value);
    }
    Util.setSessionProperty = setSessionProperty;

    // Get the extension from a filename.
    function getFileExtension(filename) {
      var pos = filename.lastIndexOf('.');
      if (pos != -1)
        return filename.substring(pos+1);
      else // if '.'' never occurs
        return '';
    }
    Util.getFileExtension = getFileExtension;

    // Get the filename from a file selection.
    function getInputFilename(pathname) {
      var pos = pathname.lastIndexOf('/');
      if (pos == -1)
        pos = pathname.lastIndexOf('\\');
      if (pos != -1)
        return pathname.substring(pos+1);
      else
        return pathname;
    }
    Util.getInputFilename = getInputFilename;

  })(MarkLogic.Util || (MarkLogic.Util = {}));
  var Util = MarkLogic.Util;
})(MarkLogic || (MarkLogic = {}));

var CONTAINER_BORDER = 8;
var LC_INITIAL_WIDTH = 250;
var SPLITTER_WIDTH   = 5;

jQuery(window).resize(function() {
    resizeViewPort();
});

function resizeViewPort() {
    var win = jQuery(window);
    var height = win.height();
    var width = $('#analytics-dashboard').width(); // win.width()

    var mainContainerHeight = height - 220;
    var workspaceContainerHeight = mainContainerHeight - 10;
    var sidebarHeight = workspaceContainerHeight - 2;

    jQuery("#analytics-dashboard").css("height", mainContainerHeight);

    jQuery("#main-container").css("height", mainContainerHeight);

    jQuery(".left-column").css({
        width: LC_INITIAL_WIDTH
    });

    jQuery(".splitter").css({
        left: LC_INITIAL_WIDTH,
        width: SPLITTER_WIDTH
    });

    jQuery(".right-column").css({
        left: LC_INITIAL_WIDTH+SPLITTER_WIDTH,
        width: width-LC_INITIAL_WIDTH-SPLITTER_WIDTH-CONTAINER_BORDER+1
    });

    // Resize the right-side container
    jQuery("#workspace-container").css("height", workspaceContainerHeight);

    // Resize the left-side container
    jQuery("#sidebar-container").css("height", workspaceContainerHeight);
    jQuery("#sidebar").css("height", sidebarHeight);
}

function setupWizard() {
    resizeViewPort();

    jQuery(".splitter").drag("start", function() {
        // Hide any iframe
    }).drag("end", function() {
        // Show the iframe
    }).drag(function(ev, dd) {
        var win = $('#analytics-dashboard'); // jQuery(window);
        // 13=8+5 where 8 is the wizard container 
        // border width, 5 is the splitter's width.
        var rightWidth = win.width() - dd.offsetX - 13;
        if (dd.offsetX < 2)
            return;

        // Move the splitter horizontally
        jQuery(this).css({
            left: dd.offsetX
        });

        // Resize the left column horizontally
        jQuery(".left-column").css({
            width: dd.offsetX
        });

        // Resize the right column horizontally
        jQuery(".right-column").css({
            left: dd.offsetX+5,
            width: rightWidth
        });
    }, {relative: true});
}

/* end of util.js */

'use strict';

angular.module('marklogic.widgets', []);

angular.module('marklogic.widgets').run(['$templateCache', function($templateCache) {

  $templateCache.put('template/widgets/time.html',
    '<div>\n' +
    '  Current Time\n' +
    '  <div class="alert alert-success">{{time}}</div>\n' +
    '</div>'
  );

}]);

angular.module('marklogic.widgets').directive('mlTime', function($interval) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'template/widgets/time.html',
    link: function(scope) {
      function update() {
        var d = new Date();
        if (scope.widget.format && scope.widget.format === 'year')
          scope.time = d.toLocaleTimeString() + ' ' + d.toLocaleDateString();
        else
          scope.time = d.toLocaleTimeString();
      }
      var promise = $interval(update, 500);
      scope.$on('$destroy', function() {
        $interval.cancel(promise);
      });
    }
  };
});

angular.module('marklogic.widgets').directive('mlCanvasChart', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<canvas style="height:300px;min-width:300px;max-width:100%;width:auto;"></canvas>',
    controller: function($scope) {
      $scope.showModeButton = false;
    },
    link: function(scope, element, attrs) {
      var data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [{
          label: "2014 claims #",
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: [456,479,324,569,702,60]
        },{
          label: "2015 claims #",
          fillColor: "rgba(151,187,205,0.5)",
          strokeColor: "rgba(151,187,205,0.8)",
          highlightFill: "rgba(151,187,205,0.75)",
          highlightStroke: "rgba(151,187,205,1)",
          data: [364,504,605,400,345,320]
        }]
      };

      var ctx = $(element).get(0).getContext('2d');
      var myBarChart = new Chart(ctx).Bar(data);
    }
  };
});

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportDesignerCtrl', ['$scope', '$stateParams', '$interval', 'ReportData', 'ReportService', 'WidgetDefinitions',
    function($scope, $stateParams, $interval, ReportData, ReportService, WidgetDefinitions) {

    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;

        $scope.report.widgets = value.widgets;
        $scope.saveWidgets();
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    $scope.report = {};
    $scope.report.uri = decodeURIComponent($stateParams.uri);
    angular.extend($scope.report, ReportData.data);

    var defaultWidgets = null;
    if ($scope.report.widgets) {
      defaultWidgets = _.map($scope.report.widgets, function(widget) {
        return {
          name: widget.name,
          title: widget.title,
          attrs: widget.attrs,
          style: widget.size,
          dataModelOptions: widget.dataModelOptions
        };
      });
    } else {
      defaultWidgets = [];
    }

    $scope.reportDashboardOptions = {
      widgetButtons: true,
      widgetDefinitions: WidgetDefinitions,
      defaultWidgets: defaultWidgets,
      hideToolbar: false,
      hideWidgetName: true,
      explicitSave: false,
      stringifyStorage: false,
      storage: storage,
      storageId: $scope.report.uri
    };

    ReportService.setDashboardOptions($scope.reportDashboardOptions);

    $scope.percentage = 5;
    $interval(function () {
      $scope.percentage = ($scope.percentage + 10) % 100;
    }, 1000);

    // external controls
    $scope.addWidget = function(directive) {
      $scope.dashboardOptions.addWidget({
        name: directive
      });
    };

    $scope.$on('widgetAdded', function(event, widget) {
      event.stopPropagation();
    });

    $scope.saveWidgets = function() {
      MarkLogic.Util.showLoader();
      ReportService.updateReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportEditorCtrl', ['$scope', '$stateParams', '$state', 'ReportData', 'ReportService',
    function($scope, $stateParams, $state, ReportData, ReportService) {

    $scope.report = {};
    $scope.report.uri = decodeURIComponent($stateParams.uri);
    angular.extend($scope.report, ReportData.data);

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.updateReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.updateReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();

        //$scope.updateTableRow();
        $state.go('root.analytics-dashboard.home');
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('HomeCtrl', ['$scope', '$http', 
    function($scope, $http) {

    $scope.createChart = function() {
      var barData = { 
        labels : ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: '2014 budget #',
            fillColor: '#382765',
            data: [456,479,324,569,702,60]
          },
          {
            label: '2015 budget #',
            fillColor: '#7BC225',
            strokeColor : "#48A497",
            data: [364,504,605,400,345,320]
          }
        ]
      };

      var context = document.getElementById('budget-canvas').getContext('2d');
      var budgetChart = new Chart(context).Bar(barData);
    };

    $scope.createChart();

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('NewReportCtrl', ['$scope', '$location', '$rootScope', 'userService', 'ReportService',
    function($scope, $location, $rootScope, userService, ReportService) {

    $scope.currentUser = null;
    $scope.report = {};
    $scope.report.privacy = 'public';

    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
    });

    $scope.setOption = function(option) {
      $scope.report.privacy = option;
    };

    $scope.isActive = function(option) {
      return option === $scope.report.privacy;
    };

    $scope.createReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.createReport($scope.report).then(function(response) {
        MarkLogic.Util.hideLoader();
        var uri = response.replace(/(.*\?uri=)/, '');
        $scope.report.uri = uri;

        $rootScope.$broadcast('ReportCreated', $scope.report);
        $location.path('/analytics-dashboard/designer' + uri);
      });
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('ReportRemoverCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'ReportService',
    function($rootScope, $scope, $stateParams, $state, ReportService) {

    $scope.report.uri = decodeURIComponent($stateParams.uri);

    $scope.deleteReport = function() {
      MarkLogic.Util.showLoader();

      ReportService.deleteReport($scope.report.uri).then(function(response) {
        MarkLogic.Util.hideLoader();
        $rootScope.$broadcast('ReportDeleted', $scope.report.uri);
        $state.go('root.analytics-dashboard.home');
      }, function(response) {
        alert(response);
      });
    };

    $scope.cancel = function() {
      $state.go('root.analytics-dashboard.home');
    };

  }]);
}());

(function() {
  'use strict';

  angular.module('ml.analyticsDashboard').controller('SidebarCtrl', ['$rootScope', '$scope', '$location', '$state', 'userService', 'ReportService', 'WidgetDefinitions',
    function($rootScope, $scope, $location, $state, userService, ReportService, WidgetDefinitions) {

    setupWizard();

    $scope.currentUser = null;
    $scope.search = {};
    $scope.showLoading = false;
    $scope.widgetDefs = WidgetDefinitions;
    $scope.reports = [];

    // The report selected for update or delete.
    $scope.report = {};

    var editReportDialogId = '#edit-report-dialog';
    var deleteReportDialogId = '#delete-report-dialog';

    // Retrieve reports if the user logs in
    $scope.$watch(userService.currentUser, function(newValue) {
      $scope.currentUser = newValue;
      $scope.getReports();
    });

    $scope.getReports = function() {
      $scope.showLoading = true;
      ReportService.getReports().then(function(response) {
        var contentType = response.headers('content-type');
        var page = MarkLogic.Util.parseMultiPart(response.data, contentType);
        $scope.reports = page.results;
        $scope.showLoading = false;
      }, function() {
        $scope.showLoading = false;
      });
    };

    $scope.addWidget = function(widgetDef) {
      ReportService.getDashboardOptions($scope.reportDashboardOptions).addWidget({
        name: widgetDef.name
      });
    };

    $scope.gotoDesigner = function(uri) {
      $location.path('/analytics-dashboard/designer' + uri);
    };

    $scope.showReportEditor = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/analytics-dashboard/editor' + report.uri);
    };

    $scope.showReportRemover = function(report) {
      $scope.report.uri = report.uri;
      $location.path('/analytics-dashboard/remover' + report.uri);
    };

    $scope.createReport = function() {
      $location.path('/analytics-dashboard/new-report');
    };

    $scope.setReport = function(report) {
      angular.extend($scope.report, report);
    };

    $scope.updateTableRow = function() {
      for (var i = 0; i < $scope.reports.length; i++) {
        var report = $scope.reports[i];
        if (report.uri === $scope.report.uri) {
          report.name = $scope.report.name;
          report.description = $scope.report.description;
          break;
        }
      }
    };

    $scope.$on('ReportCreated', function(event, report) { 
      $scope.reports.push(report);
    });

    $scope.$on('ReportDeleted', function(event, reportUri) {
      for (var i = 0; i < $scope.reports.length; i++) {
        if (reportUri === $scope.reports[i].uri) {
          // The first parameter is the index, the second 
          // parameter is the number of elements to remove.
          $scope.reports.splice(i, 1);
          break;
        }
      }
    });

    var currentPath = $location.path();
    if (currentPath === '/analytics-dashboard' || currentPath === '/analytics-dashboard/')
      $state.go('root.analytics-dashboard.home');
  }]);
}());

/*! 
 * jquery.event.drag - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x

;(function( $ ){

// add the jquery instance method
$.fn.drag = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drag") !== 0 ) 
		type = "drag"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drag special event 
drag = $special.drag = {
	
	// these are the default settings
	defaults: {
		which: 1, // mouse button pressed to start drag sequence
		distance: 0, // distance dragged before dragstart
		not: ':input', // selector to suppress dragging on target elements
		handle: null, // selector to match handle target elements
		relative: false, // true to use "position", false to use "offset"
		drop: true, // false to suppress drop events, true or selector to allow
		click: false // false to suppress click events after dragend (no proxy)
	},
	
	// the key name for stored drag data
	datakey: "dragdata",
	
	// prevent bubbling for better performance
	noBubble: true,
	
	// count bound related events
	add: function( obj ){ 
		// read the interaction data
		var data = $.data( this, drag.datakey ),
		// read any passed options 
		opts = obj.data || {};
		// count another realted event
		data.related += 1;
		// extend data options bound with this event
		// don't iterate "opts" in case it is a node 
		$.each( drag.defaults, function( key, def ){
			if ( opts[ key ] !== undefined )
				data[ key ] = opts[ key ];
		});
	},
	
	// forget unbound related events
	remove: function(){
		$.data( this, drag.datakey ).related -= 1;
	},
	
	// configure interaction, capture settings
	setup: function(){
		// check for related events
		if ( $.data( this, drag.datakey ) ) 
			return;
		// initialize the drag data with copied defaults
		var data = $.extend({ related:0 }, drag.defaults );
		// store the interaction data
		$.data( this, drag.datakey, data );
		// bind the mousedown event, which starts drag interactions
		$event.add( this, "touchstart mousedown", drag.init, data );
		// prevent image dragging in IE...
		if ( this.attachEvent ) 
			this.attachEvent("ondragstart", drag.dontstart ); 
	},
	
	// destroy configured interaction
	teardown: function(){
		var data = $.data( this, drag.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		$.removeData( this, drag.datakey );
		// remove the mousedown event
		$event.remove( this, "touchstart mousedown", drag.init );
		// enable text selection
		drag.textselect( true ); 
		// un-prevent image dragging in IE...
		if ( this.detachEvent ) 
			this.detachEvent("ondragstart", drag.dontstart ); 
	},
		
	// initialize the interaction
	init: function( event ){ 
		// sorry, only one touch at a time
		if ( drag.touched ) 
			return;
		// the drag/drop interaction data
		var dd = event.data, results;
		// check the which directive
		if ( event.which != 0 && dd.which > 0 && event.which != dd.which ) 
			return; 
		// check for suppressed selector
		if ( $( event.target ).is( dd.not ) ) 
			return;
		// check for handle selector
		if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) 
			return;

		drag.touched = event.type == 'touchstart' ? this : null;
		dd.propagates = 1;
		dd.mousedown = this;
		dd.interactions = [ drag.interaction( this, dd ) ];
		dd.target = event.target;
		dd.pageX = event.pageX;
		dd.pageY = event.pageY;
		dd.dragging = null;
		// handle draginit event... 
		results = drag.hijack( event, "draginit", dd );
		// early cancel
		if ( !dd.propagates )
			return;
		// flatten the result set
		results = drag.flatten( results );
		// insert new interaction elements
		if ( results && results.length ){
			dd.interactions = [];
			$.each( results, function(){
				dd.interactions.push( drag.interaction( this, dd ) );
			});
		}
		// remember how many interactions are propagating
		dd.propagates = dd.interactions.length;
		// locate and init the drop targets
		if ( dd.drop !== false && $special.drop ) 
			$special.drop.handler( event, dd );
		// disable text selection
		drag.textselect( false ); 
		// bind additional events...
		if ( drag.touched )
			$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
		else 
			$event.add( document, "mousemove mouseup", drag.handler, dd );
		// helps prevent text selection or scrolling
		if ( !drag.touched || dd.live )
			return false;
	},	
	
	// returns an interaction object
	interaction: function( elem, dd ){
		var offset = $( elem )[ dd.relative ? "position" : "offset" ]() || { top:0, left:0 };
		return {
			drag: elem, 
			callback: new drag.callback(), 
			droppable: [],
			offset: offset
		};
	},
	
	// handle drag-releatd DOM events
	handler: function( event ){ 
		// read the data before hijacking anything
		var dd = event.data;	
		// handle various events
		switch ( event.type ){
			// mousemove, check distance, start dragging
			case !dd.dragging && 'touchmove': 
				event.preventDefault();
			case !dd.dragging && 'mousemove':
				//  drag tolerance, x² + y² = distance²
				if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
					break; // distance tolerance not reached
				event.target = dd.target; // force target from "mousedown" event (fix distance issue)
				drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
				if ( dd.propagates ) // "dragstart" not rejected
					dd.dragging = true; // activate interaction
			// mousemove, dragging
			case 'touchmove':
				event.preventDefault();
			case 'mousemove':
				if ( dd.dragging ){
					// trigger "drag"		
					drag.hijack( event, "drag", dd );
					if ( dd.propagates ){
						// manage drop events
						if ( dd.drop !== false && $special.drop )
							$special.drop.handler( event, dd ); // "dropstart", "dropend"							
						break; // "drag" not rejected, stop		
					}
					event.type = "mouseup"; // helps "drop" handler behave
				}
			// mouseup, stop dragging
			case 'touchend': 
			case 'mouseup': 
			default:
				if ( drag.touched )
					$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
				else 
					$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events	
				if ( dd.dragging ){
					if ( dd.drop !== false && $special.drop )
						$special.drop.handler( event, dd ); // "drop"
					drag.hijack( event, "dragend", dd ); // trigger "dragend"	
				}
				drag.textselect( true ); // enable text selection
				// if suppressing click events...
				if ( dd.click === false && dd.dragging )
					$.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
				dd.dragging = drag.touched = false; // deactivate element	
				break;
		}
	},
		
	// re-use event object for custom events
	hijack: function( event, type, dd, x, elem ){
		// not configured
		if ( !dd ) 
			return;
		// remember the original event and type
		var orig = { event:event.originalEvent, type:event.type },
		// is the event drag related or drog related?
		mode = type.indexOf("drop") ? "drag" : "drop",
		// iteration vars
		result, i = x || 0, ia, $elems, callback,
		len = !isNaN( x ) ? x : dd.interactions.length;
		// modify the event type
		event.type = type;
		// remove the original event
		event.originalEvent = null;
		// initialize the results
		dd.results = [];
		// handle each interacted element
		do if ( ia = dd.interactions[ i ] ){
			// validate the interaction
			if ( type !== "dragend" && ia.cancelled )
				continue;
			// set the dragdrop properties on the event object
			callback = drag.properties( event, dd, ia );
			// prepare for more results
			ia.results = [];
			// handle each element
			$( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
				// identify drag or drop targets individually
				callback.target = subject;
				// force propagtion of the custom event
				event.isPropagationStopped = function(){ return false; };
				// handle the event	
				result = subject ? $event.dispatch.call( subject, event, callback ) : null;
				// stop the drag interaction for this element
				if ( result === false ){
					if ( mode == "drag" ){
						ia.cancelled = true;
						dd.propagates -= 1;
					}
					if ( type == "drop" ){
						ia[ mode ][p] = null;
					}
				}
				// assign any dropinit elements
				else if ( type == "dropinit" )
					ia.droppable.push( drag.element( result ) || subject );
				// accept a returned proxy element 
				if ( type == "dragstart" )
					ia.proxy = $( drag.element( result ) || ia.drag )[0];
				// remember this result	
				ia.results.push( result );
				// forget the event result, for recycling
				delete event.result;
				// break on cancelled handler
				if ( type !== "dropinit" )
					return result;
			});	
			// flatten the results	
			dd.results[ i ] = drag.flatten( ia.results );	
			// accept a set of valid drop targets
			if ( type == "dropinit" )
				ia.droppable = drag.flatten( ia.droppable );
			// locate drop targets
			if ( type == "dragstart" && !ia.cancelled )
				callback.update(); 
		}
		while ( ++i < len )
		// restore the original event & type
		event.type = orig.type;
		event.originalEvent = orig.event;
		// return all handler results
		return drag.flatten( dd.results );
	},
		
	// extend the callback object with drag/drop properties...
	properties: function( event, dd, ia ){		
		var obj = ia.callback;
		// elements
		obj.drag = ia.drag;
		obj.proxy = ia.proxy || ia.drag;
		// starting mouse position
		obj.startX = dd.pageX;
		obj.startY = dd.pageY;
		// current distance dragged
		obj.deltaX = event.pageX - dd.pageX;
		obj.deltaY = event.pageY - dd.pageY;
		// original element position
		obj.originalX = ia.offset.left;
		obj.originalY = ia.offset.top;
		// adjusted element position
		obj.offsetX = obj.originalX + obj.deltaX; 
		obj.offsetY = obj.originalY + obj.deltaY;
		// assign the drop targets information
		obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
		obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
		return obj;	
	},
	
	// determine is the argument is an element or jquery instance
	element: function( arg ){
		if ( arg && ( arg.jquery || arg.nodeType == 1 ) )
			return arg;
	},
	
	// flatten nested jquery objects and arrays into a single dimension array
	flatten: function( arr ){
		return $.map( arr, function( member ){
			return member && member.jquery ? $.makeArray( member ) : 
				member && member.length ? drag.flatten( member ) : member;
		});
	},
	
	// toggles text selection attributes ON (true) or OFF (false)
	textselect: function( bool ){ 
		$( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart )
			.css("MozUserSelect", bool ? "" : "none" );
		// .attr("unselectable", bool ? "off" : "on" )
		document.unselectable = bool ? "off" : "on"; 
	},
	
	// suppress "selectstart" and "ondragstart" events
	dontstart: function(){ 
		return false; 
	},
	
	// a callback instance contructor
	callback: function(){}
	
};

// callback methods
drag.callback.prototype = {
	update: function(){
		if ( $special.drop && this.available.length )
			$.each( this.available, function( i ){
				$special.drop.locate( this, i );
			});
	}
};

// patch $.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
	if ( $.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
		$.removeData( this, "suppress."+ event.type );
		return;
	}
	return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
	props: "clientX clientY pageX pageY screenX screenY".split( " " ),
	filter: function( event, orig ) {
		if ( orig ){
			var touched = ( orig.touches && orig.touches[0] )
				|| ( orig.changedTouches && orig.changedTouches[0] )
				|| null; 
			// iOS webkit: touchstart, touchmove, touchend
			if ( touched ) 
				$.each( touchHooks.props, function( i, prop ){
					event[ prop ] = touched[ prop ];
				});
		}
		return event;
	}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

})( jQuery );
/*! 
 * jquery.event.drag.live - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2010-06-07
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x, event.drag 2.2

;(function( $ ){
	
// local refs (increase compression)
var $event = $.event,
// ref the special event config
drag = $event.special.drag,
// old drag event add method
origadd = drag.add,
// old drag event teradown method
origteardown = drag.teardown;

// allow events to bubble for delegation
drag.noBubble = false;

// the namespace for internal live events
drag.livekey = "livedrag";

// new drop event add method
drag.add = function( obj ){ 
	// call the old method
	origadd.apply( this, arguments );
	// read the data
	var data = $.data( this, drag.datakey );
	// bind the live "draginit" delegator
	if ( !data.live && obj.selector ){
		data.live = true;
		$event.add( this, "draginit."+ drag.livekey, drag.delegate );
	}
};

// new drop event teardown method
drag.teardown = function(){ 
	// call the old method
	origteardown.apply( this, arguments );
	// read the data
	var data = $.data( this, drag.datakey ) || {};
	// bind the live "draginit" delegator
	if ( data.live ){
		// remove the "live" delegation
		$event.remove( this, "draginit."+ drag.livekey, drag.delegate );
		data.live = false;
	}
};

// identify potential delegate elements
drag.delegate = function( event ){
	// local refs
	var elems = [], target, 
	// element event structure
	events = $.data( this, "events" ) || {};
	// query live events
	$.each( events || [], function( key, arr ){
		// no event type matches
		if ( key.indexOf("drag") !== 0 )
			return;
		$.each( arr || [], function( i, obj ){
			// locate the element to delegate
			target = $( event.target ).closest( obj.selector, event.currentTarget )[0];
			// no element found
			if ( !target ) 
				return;
			// add an event handler
			$event.add( target, obj.origType+'.'+drag.livekey, obj.origHandler || obj.handler, obj.data );
			// remember new elements
			if ( $.inArray( target, elems ) < 0 )
				elems.push( target );		
		});
	});
	// if there are no elements, break
	if ( !elems.length ) 
		return false;
	// return the matched results, and clenup when complete		
	return $( elems ).bind("dragend."+ drag.livekey, function(){
		$event.remove( this, "."+ drag.livekey ); // cleanup delegation
	});
};
	
})( jQuery );
/*
 * Copyright (c) 2015 MarkLogic Corporation. ALL Rights Reserved.
 */

(function(angular) {
  'use strict';

  angular.module('ml.analyticsDashboard.report', ['ml-dimension-builder', 'ml-sq-builder']);

})(window.angular);

(function(angular) {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .factory('mlReportService', [
      function() {
        return {
          getDirectiveTemplate: getDirectiveTemplate
        };
      }
    ]);

  function getDirectiveTemplate(mode, name) {
    var dmt = '/templates/widgets/ml-smart-grid/design-mode.html';
    var vmt = '/templates/widgets/ml-smart-grid/view-mode.html';
    var template = '';

    if (mode) {
      mode = mode.toLowerCase();
      if (mode === 'design') {
        template = dmt;
      } else if (mode === 'view') {
        template = vmt;
      }
    } else {
      template = vmt;
    }

    return template;
  }

})(window.angular);

(function(angular) {
  'use strict';

  angular.module('ml.analyticsDashboard.report')
    .factory('SmartGridDataModel', ['WidgetDataModel', '$http',
      function(WidgetDataModel, $http) {
        function SmartGridDataModel() {
        }

        SmartGridDataModel.prototype = Object.create(WidgetDataModel.prototype);

        SmartGridDataModel.prototype.init = function() {
          WidgetDataModel.prototype.init.call(this);
          this.load();
        };

        SmartGridDataModel.prototype.load = function() {
          //console.log(this);
        };

        return SmartGridDataModel;
      }
    ]);

})(window.angular);

  function setModalMaxHeight(element) {
    var ele = $(element);
    var dialogMargin  = $(window).width() > 767 ? 62 : 22;
    var contentHeight = $(window).height() - dialogMargin;
    var headerHeight  = ele.find('.modal-header').outerHeight() || 2;
    var footerHeight  = ele.find('.modal-footer').outerHeight() || 2;
    var maxHeight     = contentHeight - (headerHeight + footerHeight);

    ele.find('.modal-content').css({
      'overflow': 'hidden'
    });

    ele.find('.modal-body').css({
      'max-height': maxHeight,
      'overflow-y': 'auto'
    });

    ele.find('#query-editor').css({
      'height': maxHeight-220
    });
  }

  var modalCallbackRegistered = false;

  function registerModalCallback() {
    if (modalCallbackRegistered) return;

    $('.modal').on('show.bs.modal', function() {
      $(this).show();
      setModalMaxHeight(this);
    });

    modalCallbackRegistered = true;
  }

  $(window).resize(function() {
    if ($('.modal.in').length !== 0) {
      setModalMaxHeight($('.modal.in'));
    }
  });

angular.module('ml.analyticsDashboard.report').directive('mlSmartGrid', ['$compile', 'MLRest', 'mlReportService', 'NgTableParams',
  function($compile, mlRest, mlReportService, NgTableParams) {

  return {
    restrict: 'A',
    replace: false,
    template: '<div ng-include="contentUrl"></div>',
    controller: function($scope, $http, $q, $filter) {
      // Set the initial mode for this widget to View.
      $scope.showModeButton = true;
      $scope.widget.mode = 'View';

/*
      $scope.data.fields = {
        'state': {type: 'string', classification: 'json-property'},
        'city': {type: 'string', classification: 'element', ns: 'claim-ns'},
        'payor': {type: 'string', classification: 'field', collation: 'claim-collation'},
        'payment': {type: 'number', classification: 'element', ns: '', minimum: 10, maximum: 900},
        'paid': {type: 'boolean', classification: 'json-property', ns: '', }
      };
*/
      $scope.model = {
        queryConfig: null,
        queryError: null,
        config: null,
        configError: null,
        results: null,
        includeFrequency: false,
        loadingConfig: false,
        loadingResults: false,
        groupingStrategy: 'root',
        showBuilder: false
      };

      if ($scope.widget.dataModelOptions.groupingStrategy) {
        $scope.model.groupingStrategy = $scope.widget.dataModelOptions.groupingStrategy;
      }

      $scope.deferredAbort = null;

      $scope.data = {};
      $scope.data.docs = [];
      $scope.data.fields = {};
      $scope.data.operation = 'and-query';
      $scope.data.query = [];
      $scope.data.dimensions = [];
      $scope.data.needsUpdate = true;
      $scope.data.needsRefresh = true;
      $scope.data.directory = $scope.widget.dataModelOptions.directory;
      $scope.data.directory_model = null;
      $scope.data.parameters = $scope.widget.dataModelOptions.parameters;

      $scope.executor = {};
      $scope.executor.transform = 'smart-filter';
      $scope.executor.disableRun = true;
      $scope.executor.disableDownload = true;

      $scope.highchart = null;

      $scope.grid = {
        page: 1,
        total: 0
      };

      $scope.showDimensions = function() {
        var dimensions = {
          dimensions: $scope.data.dimensions
        };
        return JSON.stringify(dimensions, null, 2);
      };

      $scope.showQuery = function() {
        var query = $scope.getStructuredQuery();
        return JSON.stringify(query, null, 2);
      };

      $scope.getStructuredQuery = function() {
        var query = {
          'query': {
            "queries": []
          }
        };
        var rootQuery = {};
        rootQuery[$scope.data.operation] = {'queries': $scope.data.query};

        query.query.queries.push(rootQuery);

        return query;
      };

      $scope.clearResults = function() {
        $scope.model.results = null;
        $scope.executor.dimensions = [];
        $scope.executor.results = [];
        $scope.executor.disableDownload = true;

        if ($scope.highchart) {
          $scope.highchart.highcharts().destroy();
          $scope.highchart = null;
        }
      };

      $scope.getDbConfig = function() {
        var params = {
          'rs:strategy': $scope.model.groupingStrategy
        };

        $scope.model.showBuilder = false;
        $scope.model.loadingConfig = true;

        if ($scope.model.config) {
          params['rs:database'] = $scope.model.config['current-database'];
        } else if ($scope.widget.dataModelOptions.database) {
          params['rs:database'] = $scope.widget.dataModelOptions.database;
        }

        $scope.clearResults();
        $scope.model.includeFrequency = false;
        // $scope.model.config = null;
        $scope.model.queryConfig = {
          'result-type': 'group-by',
          rows: [],
          columns: [],
          computes: [],
          options: ['headers=true'],
          filters: {}
        };

        $scope.data.docs = [];
        $scope.data.fields = {};

        $http.get('/v1/resources/index-discovery', {
          params: params
        }).then(function(response) {
          $scope.model.loadingConfig = false;

          if (response.data.errorResponse) {
            $scope.model.configError = response.data.errorResponse.message;
            return;
          }

          $scope.model.config = response.data;

          var docsExist = !angular.equals($scope.model.config.docs, {});
          if (docsExist) {
            $scope.model.configError = null;

            var docs = $scope.model.config.docs;
            var keys = Object.keys(docs);

            // For each configured doc
            keys.forEach(function(key) {
              var doc = {
                id: key, 
                name: key,
                fields: {}
              };
              var indexes = docs[key];

              indexes.forEach(function(index) {
                var field = {
                  type: index['scalar-type']
                };
                field['ref-type'] = index['ref-type'];

                var ns = index['namespace-uri'];
                if (ns || ns === '') {
                  field.ns = ns;
                }

                var collation = index.collation;
                if (collation) {
                  field.collation = collation;
                }

                if (index.localname) {
                  if (index['parent-localname']) {
                    // attribute range index
                    field.classification = 'attribute';
                    field['parent-localname'] = index['parent-localname'];
                    field['parent-namespace-uri'] = index['parent-namespace-uri'];
                  } else {
                    // element range index
                    field.classification = 'element';
                  }
                  doc.fields[index.localname] = field;
                } else if (index['path-expression']) {
                  // path range index
                  field.classification = 'path-expression';
                  doc.fields[index['path-expression']] = field;
                }
              });

              $scope.data.docs.push(doc);
            });

            for (var i = 0; i < $scope.data.docs.length; i++) {
              var model = $scope.data.docs[i];
              if (model.id === $scope.data.directory) {
                $scope.data.directory_model = model;
                $scope.setDocument();
                break;
              }
            }

            $scope.executor.disableRun = false;
          } else {
            $scope.model.configError = 'No documents with range indices in the database';
          }
        }, function(response) {
          $scope.model.loadingConfig = false;
          $scope.model.configError = response.data;
        });
      };

      $scope.setDocument = function() {
        if ($scope.data.directory_model) {
          var directory = $scope.data.directory_model.id;
          $scope.data.directory = directory;
          $scope.executor.dimensions = [];
          $scope.executor.results = [];

          for (var i = 0; i < $scope.data.docs.length; i++) {
            var doc = $scope.data.docs[i];
            if (doc.id === directory) {
              $scope.data.fields = doc.fields;
              break;
            }
          }
          $scope.data.operation = 'and-query';
          $scope.data.query = [];
          $scope.data.dimensions = [];

          if (directory === $scope.widget.dataModelOptions.directory) {
            if ($scope.widget.dataModelOptions.query && 
                $scope.widget.dataModelOptions.query.query &&
                $scope.widget.dataModelOptions.query.query.queries) {
              var query = $scope.widget.dataModelOptions.query.query.queries[0];
              var operation = Object.keys(query)[0];
              $scope.data.operation = operation;
              $scope.data.query = query[operation].queries;
            } else {
              $scope.data.operation = 'and-query';
              $scope.data.query = [];
            }

            if ($scope.widget.dataModelOptions.dimensions) {
              angular.copy($scope.widget.dataModelOptions.dimensions, $scope.data.dimensions);
            } else {
              $scope.data.dimensions = [];
            }
          } else {
            $scope.data.operation = 'and-query';
            $scope.data.query = [];
            $scope.data.dimensions = [];
          }

          $scope.data.needsUpdate = true;
          $scope.data.needsRefresh = true;

          $scope.model.showBuilder = true;
        } else {
          $scope.model.showBuilder = false;
        }
      };

      $scope.edit = function() {
        registerModalCallback();
        $('#query-editor-dialog').modal({'backdrop': 'static'});

        var value = $scope.showQuery();
        var container = document.getElementById('query-editor');
        container.innerHTML = '';

        var cme = CodeMirror(container, {
          value: value,
          indentUnit: 2,
          lineNumbers: true,
          readOnly: false,
          matchBrackets: true,
          autoCloseBrackets: true,
          mode: 'application/ld+json',
          lineWrapping: false
        });
      };

      $scope.save = function() {
        $scope.widget.dataModelOptions.database = $scope.model.config['current-database'];
        $scope.widget.dataModelOptions.groupingStrategy = $scope.model.groupingStrategy;
        $scope.widget.dataModelOptions.directory = $scope.data.directory_model.id;

        $scope.widget.dataModelOptions.query = {};
        $scope.widget.dataModelOptions.dimensions = [];

        angular.copy($scope.getStructuredQuery(), $scope.widget.dataModelOptions.query);
        angular.copy($scope.data.dimensions, $scope.widget.dataModelOptions.dimensions);

        $scope.options.saveDashboard();
      };

      $scope.download = function() {
        var data = [];

        var headerRow = [];
        if ($scope.model.results) {
          // Complex query
          $scope.model.results.headers.forEach(function(header) {
            headerRow.push(header); 
          });
          data.push(headerRow);

          $scope.model.results.results.forEach(function(result) {
            data.push(result); 
          });
        } else if ($scope.executor.results.length > 0) {
          // Simple query
          $scope.executor.dimensions.forEach(function(dimension) {
            headerRow.push(dimension.name); 
          });
          data.push(headerRow);

          $scope.executor.results.forEach(function(result) {
            data.push(result); 
          });
        }

        $http({
          method: 'POST',
          url: '/api/report/prepare',
          data: {data : data}
        }).then(function(response) {
          // You can't download file through Ajax.
          window.location = '/api/report/download';
        }, function(response) {
          // error
        });
      };

      $scope.execute = function() {
        var dimensions = $scope.widget.dataModelOptions.dimensions;
        // Number of groupby fields.
        var count = 0;

        dimensions.forEach(function(dimension) {
          if (dimension.groupby) count++;
        });

        // If there is no groupby dimension, we will do simple 
        // search, otherwise we will do aggregate computations.
        $scope.model.loadingResults = true;
        if (count)
          $scope.executeComplexQuery(count);
        else
          $scope.executeSimpleQuery(1);
      };

      $scope.getColumn = function(name) {
        var directory = $scope.widget.dataModelOptions.directory;
        var fields = $scope.model.config.docs[directory];
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          if (name === field.localname || name === field['path-expression'])
            return field;
        }
        return null;
      };

      function getParameterValue(name) {
        var parameters = $scope.widget.dataModelOptions.parameters;

        for (var i = 0; i < parameters.length; i++) {
          var parameter = parameters[i];
          var temp = '#' + parameter.name + '#';
          if (name === temp)
            return parameter.value;
        }

        return null;
      }

      function setQueryParameters(query) {
        var type = typeof query;

        if (type == 'object') {
          for (var key in query) {
            if (key === 'text' || key === 'value') {
              var value = getParameterValue(query[key]);
              if (value !== null)
                query[key] = value;
            } else {
              setQueryParameters(query[key]);
            }
          }
        }
      }

      $scope.executeComplexQuery = function(count) {
        var queries = $scope.widget.dataModelOptions.query.query.queries;
        if (queries.length === 1) {
          // The first element has only one key.
          var firstElement = queries[0];
          var key = Object.keys(firstElement)[0];

          // The group-by will fail if an or-query is empty, so we
          // convert an empty query at the root level.
          if (firstElement[key].queries.length === 0)
            queries = [];
        }

        setQueryParameters(queries);

        var search = {
          'search': {
            'options': {
              'search-option': ['unfiltered']
            },
            'query': {
              'queries': queries
            }
          }
        };

        if ($scope.widget.mode === 'View' && $scope.executor.simple) {
          search.search.qtext = $scope.executor.simple;
        } else {
          search.search.qtext = '';
        }

        var params = {};
        var queryConfig = angular.copy($scope.model.queryConfig);

        if ($scope.model.config) {
          params['rs:database'] = $scope.model.config['current-database'];
        }

        if ($scope.model.includeFrequency) {
          queryConfig.computes.push({fn: 'frequency'});
        }

        queryConfig.filters = search;

        var dimensions = $scope.widget.dataModelOptions.dimensions;
        dimensions.forEach(function(dimension) {
          var key = Object.keys(dimension)[0];

          if (key !== 'atomic') {
            var name = dimension[key].field;
            var column = $scope.getColumn(name);

            if (key === 'groupby') {
              queryConfig.columns.push(column);
            } else {
              queryConfig.computes.push({
                fn: key,
                ref: column
              });
            }
          }
        });

        $scope.model.loadingResults = true;
        $scope.clearResults();

        $scope.deferredAbort = $q.defer();
        $http({
          method: 'POST',
          url: '/v1/resources/group-by',
          params: params,
          data: queryConfig,
          timeout: $scope.deferredAbort.promise
        }).then(function(response) {
          $scope.model.results = response.data;
          $scope.model.queryError = null;
          $scope.model.loadingResults = false;

          $scope.createComplexTable($scope.model.results.headers, $scope.model.results.results);
          $scope.createHighcharts(count, $scope.model.results.headers, $scope.model.results.results);

          $scope.executor.disableDownload = false;
        }, function(response) {
          $scope.model.loadingResults = false;

          if (response.status !== 0) {
            $scope.model.queryError = {
              title: response.statusText,
              description: response.data
            };
          }
        });
      };

      $scope.createSimpleTable = function(headers, results) {
        $scope.cols = [
          //{ field: "name", title: "Name", sortable: "name", show: true },
          //{ field: "age", title: "Age", sortable: "age", show: true },
          //{ field: "money", title: "Money", show: true }
        ];

        headers.forEach(function(header) {
          $scope.cols.push({
            field: header, 
            title: header, 
            sortable: header, 
            show: true
          });
        });

        var records = [];
        results.forEach(function(row) {
          var record = {};
          for (var i = 0; i < row.length; i++) {
            record[headers[i]] = row[i];
          }
          records.push(record);
        });

        var initialParams = {
          page: 1, // show first page
          count: $scope.widget.dataModelOptions.pageLength, // count per page
          sorting: {}
        };
        initialParams.sorting[headers[0]] = 'desc';

        var total = $scope.grid.total;

        $scope.tableParams = new NgTableParams(initialParams, {
          total: total,
          getData: function($defer, params) {
            //console.log(params);
            var orderedData = params.sorting() ? 
                $filter('orderBy')(records, $scope.tableParams.orderBy()) : records;

            orderedData = params.filter() ? 
                $filter('filter')(orderedData, params.filter()) : orderedData;

            // Set total for recalc pagination
            //params.total(orderedData.length);

            $defer.resolve(orderedData);
          }
        });
      };

      $scope.createComplexTable = function(headers, results) {
        $scope.cols = [
          //{ field: "name", title: "Name", sortable: "name", show: true },
          //{ field: "age", title: "Age", sortable: "age", show: true },
          //{ field: "money", title: "Money", show: true }
        ];

        headers.forEach(function(header) {
          $scope.cols.push({
            field: header, 
            title: header, 
            sortable: header, 
            show: true
          });
        });

        var records = [];
        results.forEach(function(row) {
          var record = {};
          for (var i = 0; i < row.length; i++) {
            record[headers[i]] = row[i];
          }
          records.push(record);
        });

        var initialParams = {
          page: 1, // show first page
          count: $scope.widget.dataModelOptions.pageLength, // count per page
          sorting: {}
        };
        initialParams.sorting[headers[0]] = 'desc';

        $scope.tableParams = new NgTableParams(initialParams, {
          total: records.length, // Defines the total number of items for the table
          getData: function($defer, params) {
            var orderedData = params.sorting() ? 
                $filter('orderBy')(records, $scope.tableParams.orderBy()) : records;

            orderedData = params.filter() ? 
                $filter('filter')(orderedData, params.filter()) : orderedData;

            // Set total for recalc pagination
            params.total(orderedData.length);

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
      };

      $scope.fetchPage = function() {
        var start = 1 + ($scope.grid.page - 1) * $scope.widget.dataModelOptions.pageLength;

        $scope.model.loadingResults = true;
        $scope.executeSimpleQuery(start);
      };

      $scope.executeSimpleQuery = function(start) {
        var directory = '/' + $scope.widget.dataModelOptions.directory + '/';
        var queries = $scope.widget.dataModelOptions.query.query.queries;

        setQueryParameters(queries);

        var search = {
          'search': {
            'options': {
              'search-option': ['unfiltered']
            },
            'query': {
              'queries': queries
            }
          }
        };

        if ($scope.widget.mode === 'View' && $scope.executor.simple) {
          search.search.qtext = $scope.executor.simple;
        }

        var params = {
          'directory': directory,
          'pageLength': $scope.widget.dataModelOptions.pageLength,
          'start': start, // current pagination offset
          'category': 'content',
          'view': 'metadata',
          'format': 'json'
        };

        $scope.clearResults();

        var dimensions = $scope.widget.dataModelOptions.dimensions;
        var headers = [];

        dimensions.forEach(function(dimension) {
          var key = Object.keys(dimension)[0];
          var name = dimension[key].field;
          var type = $scope.data.fields[name].type;
          var item = {name: name, type: type};
          $scope.executor.dimensions.push(item);
          headers.push(name);
        });

        // We need two transforms: one for JSON, one for XML.
        // These transforms filter the document. The XML
        // transform also converts am XML document to JSON.
        if ($scope.executor.transform) {
          params.transform = $scope.executor.transform;

          $scope.executor.dimensions.forEach(function(dimension) {
            params['trans:' + dimension.name] = dimension.type;
          });
        }

        mlRest.search(params, search).then(function(response) {
          $scope.model.loadingResults = false;

          var contentType = response.headers('content-type');
          var pageResults = MarkLogic.Util.parseMultiPart(response.data, contentType);
          var results = pageResults.results;

          $scope.grid.total = pageResults.metadata.total;

          results.forEach(function(result) {
            var item = [];
            $scope.executor.dimensions.forEach(function(dimension) {
              var name = dimension.name;
              item.push(result[name]);
            });

            $scope.executor.results.push(item);
          });

          $scope.executor.disableDownload = false;

          $scope.createSimpleTable(headers, $scope.executor.results);
        });
      };

      $scope.createHighcharts = function(count, headers, results) {
        var chartType = $scope.widget.dataModelOptions.chart;

        if (chartType === 'column')
          $scope.createColumnHighcharts(count, headers, results);
        else
          $scope.createPieHighcharts(count, headers, results);
      };

      // Create a column chart
      $scope.createColumnHighcharts = function(count, headers, results) {
        var categories = [];
        var series = [];

        // count is number of groupby fields.
        // Skip all groupby fields.
        for (var i = count; i < headers.length; i++) {
          series.push({
            name: headers[i],
            data: []
          });
        }

        results.forEach(function(row) {
          var groups = [];
          for (var i = 0; i < count; i++) {
            groups.push(row[i]);
          }
          categories.push(groups.join(','));

          for (i = count; i < row.length; i++) {
            series[i-count].data.push(row[i]);
          }
        });

        $scope.highchart = $scope.element.find('div.hcontainer').highcharts({
          chart: {
            type: 'column'
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: series
        });
      };

      // Create a pie chart
      $scope.createPieHighcharts = function(count, headers, results) {
        var colors = Highcharts.getOptions().colors;
        var measures = [];
        var series = [];

        // count is number of groupby fields.
        // Skip all groupby fields.
        for (var i = count; i < headers.length; i++) {
          series.push({
            name: headers[i],
            data: []
          });
          measures.push(headers[i]);
        }

        var rings = series.length;
        if (rings > 1) {
          var percent = Math.floor(100/rings);
          var ring = 0;

          // The innermost ring
          series[ring].size = percent + '%';
          /*series[ring].dataLabels = {
            distance: -30
          };*/

          for (ring = 1; ring < rings; ring++) {
            series[ring].innerSize = percent*ring + '%';
            series[ring].size = percent*(ring+1) + '%';
            /*series[ring].dataLabels = {
              distance: (0-percent*ring)
            };*/
          }
        }

        results.forEach(function(row) {
          var groups = [];
          for (var i = 0; i < count; i++) {
            groups.push(row[i]);
          }
          var category = groups.join(',');

          for (i = count; i < row.length; i++) {
            series[i-count].data.push({
              name: category,
              color: colors[i-count],
              y: row[i]
            });
          }
        });

        var title = 'Measures: ' + measures;

        $scope.highchart = $scope.element.find('div.hcontainer').highcharts({
          chart: {
            type: 'pie'
          },
          credits: {
            enabled: false
          },
          title: {
            text: title
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: 1,
            borderRadius: 10,
            headerFormat: '<span style="font-size:16px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                         '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>'
          },
          plotOptions: {
            pie: {
              showInLegend: true,
              shadow: false,
              center: ['50%', '50%'],
              dataLabels: {
                enabled: true,
                useHTML: false,
                format: '<b>{point.name} {series.name}</b>: {point.percentage:.1f}%',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            }
          },
          series: series
        });
      };

      // Kick off
      $scope.getDbConfig();
    },

    link: function($scope, element, attrs) {
      $scope.element = element;
      $scope.contentUrl = mlReportService.getDirectiveTemplate($scope.widget.mode, 'ml-smart-grid');

      $scope.$watch('widget.mode', function(mode) {
        //console.log($scope);

        $scope.clearResults();

        $scope.contentUrl = mlReportService.getDirectiveTemplate(mode, 'ml-smart-grid');

        $scope.data.needsUpdate = true;
        $scope.data.needsRefresh = true;

        if (mode === 'View') {
          //$scope.execute();
        }
      });
    }
  };
}]);

(function() {
  'use strict';

  // Report Service
  angular.module('ml.analyticsDashboard').service('ReportService', ['$http', '$q', 'MLRest', function($http, $q, mlRest) {
    var dashboardOptions = null;
    var store = {};
    var storage = {
      getItem : function(key) {
        return store[key];
      },
      setItem : function(key, value) {
        store[key] = value;
      },
      removeItem : function(key) {
        delete store[key];
      }
    };

    this.getStorage = function() {
      return storage;
    };

    this.setDashboardOptions = function(options) {
      dashboardOptions = options;
    };

    this.getDashboardOptions = function() {
      return dashboardOptions;
    };

    this.getReports = function() {
      //return this.get('/api/reports');

      var search = {
        'search': {
          'options': {
            'search-option': ['unfiltered']
          },
          'query': {
            'queries': [{
              'directory-query': {
                uri: ['/report/']
              }
            }]
          }
        }
      };

      // HTTP header names are case-insensitive.
      //
      // A multi-document read is distinguished from a normal search 
      // operation by setting the Accept header to multipart/mixed.
      //
      // Can use the 'category' parameter only with multipart/mixed accept.
      return mlRest.search({
               'pageLength': 20,
               'category': 'content',
               'format': 'json'
              }, search);
    };

    this.getReport = function(uri) {
      return mlRest.getDocument(uri, {format: 'json'});
    };

    this.createReport = function(report) {
      return mlRest.createDocument(report, {
               directory: '/report/',
               format: 'json',
               extension: '.json'
             });
    };

    this.deleteReport = function(uri) {
      return mlRest.deleteDocument(uri);
    };

    this.updateReport = function(data) {
      //return this.put('/api/report', data);
      return mlRest.updateDocument(data, {uri: data.uri});
    };

    this.get = function(url) {
      return $http.get(url);
    };

    this.post = function(url, data) {
      return $http.post(url, data);
    };

    this.put = function(url, data) {
      return $http.put(url, data);
    };

    this.delete = function(url) {
      return $http.delete(url);
    };
  }]);

  angular.module('ml.analyticsDashboard').factory('WidgetDefinitions', ['SmartGridDataModel',  
    function(SmartGridDataModel) {
    return [
      {
        name: 'Query Builder',
        directive: 'ml-smart-grid',
        title: 'Query Builder',
        icon: 'fa fa-th',
        dataAttrName: 'grid',
        dataModelType: SmartGridDataModel,
        dataModelOptions: {
          database: '',
          groupingStrategy: '',
          directory: '',
          query: {},
          dimensions: [],
          chart: 'column',
          pageLength: 10,
          parameters: []
        },
        style: {
          width: '100%'
        },
        settingsModalOptions: {
          templateUrl: '/templates/widgets/qb-settings.html',
          //controller: 'QueryBuilderWidgetSettingsCtrl',
          backdrop: false
        },
        onSettingsClose: function(result, widget) {
          //jQuery.extend(true, widget, result);
          widget.title = result.title;
          widget.dataModelOptions.pageLength = result.dataModelOptions.pageLength;
          widget.dataModelOptions.chart = result.dataModelOptions.chart;
          angular.copy(result.dataModelOptions.parameters, widget.dataModelOptions.parameters);
        },
        onSettingsDismiss: function(reason, scope) {
          // Do nothing here, since the user pressed cancel
        }
      },
      {
        name: 'Timer',
        directive: 'ml-time',
        title: 'Timer',
        icon: 'fa fa-th',
        style: {
          width: '100%'
        },
        dataModelOptions: {
          format: 'standard'
        },
        settingsModalOptions: {
          templateUrl: '/templates/widgets/time-settings.html',
          //controller: 'TimerWidgetSettingsCtrl',
          backdrop: false
        },
        onSettingsClose: function(result, widget) {
          console.log('Widget-specific settings resolved!');
          console.log(result);
          jQuery.extend(true, widget, result);
        },
        onSettingsDismiss: function(reason, scope) {
          //console.log('Settings have been dismissed: ', reason);
          //console.log('Dashboard scope: ', scope);
        }
      },
      {
        name: 'Scope Monitor',
        title: 'Scope Monitor',
        icon: 'fa fa-list',
        style: {
          width: '100%'
        },
        templateUrl: '/templates/percentage.html'
      },
      {
        name: 'Canvas Chart' ,
        directive: 'ml-canvas-chart',
        title: 'Canvas Chart',
        icon: 'fa fa-th',
        style: {
          width: '100%'
        }
      }
    ];
  }]);
}());
